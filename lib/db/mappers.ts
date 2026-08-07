import type {
  BuildLookAnswers,
  Designer,
  GenerationMethod,
  Look,
  Lookbook,
  Product,
} from "@/app/types/domain";
import { productImage } from "@/app/data/catalogImages";
import { getRequestSupabase } from "@/lib/supabase/server";

export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    productUrl: row.product_url as string,
    imageUrls: (row.image_urls as string[])?.length
      ? (row.image_urls as string[])
      : [productImage(row.category as Product["category"])],
    category: row.category as Product["category"],
    subcategory: row.subcategory as string | undefined,
    availableSizes: (row.available_sizes as string[]) ?? [],
    sizingSystem: row.sizing_system as Product["sizingSystem"],
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    currency: row.currency as Product["currency"],
    color: row.color as string | undefined,
    material: row.material as string | undefined,
    designerId: row.designer_id as string | undefined,
    designerCity: row.designer_city as string | undefined,
    aestheticTags: (row.aesthetic_tags as string[]) ?? [],
    presentationTags: (row.presentation_tags as string[]) ?? [],
    occasionTags: (row.occasion_tags as string[]) ?? [],
    climateTags: (row.climate_tags as string[]) ?? [],
    departmentTags: (row.department_tags as Product["departmentTags"]) ?? [],
    inventoryStatus: row.inventory_status as Product["inventoryStatus"],
    madeToOrder: Boolean(row.made_to_order),
    shippingDestinations: (row.shipping_destinations as string[]) ?? [],
    condition: row.condition as Product["condition"],
    isIndependentDesigner: Boolean(row.is_independent_designer),
    isEmergingDesigner: Boolean(row.is_emerging_designer),
    isReferenceExample: Boolean(row.is_reference_example),
    purchaseFlow: (row.purchase_flow as Product["purchaseFlow"]) ?? "direct",
    lastVerifiedAt: row.last_verified_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapDesignerRow(row: Record<string, unknown>): Designer {
  return {
    id: row.id as string,
    slug: row.slug as string,
    labelName: row.label_name as string,
    labelType: row.label_type as Designer["labelType"],
    biography: row.biography as string,
    city: row.city as string,
    country: row.country as string,
    coverImageUrl: row.cover_image_url as string,
    website: row.website as string | undefined,
    instagram: row.instagram as string | undefined,
    socialLinks: (row.social_links as Record<string, string>) ?? {},
    aestheticTags: (row.aesthetic_tags as string[]) ?? [],
    sizeRange: row.size_range as string,
    priceRange: row.price_range as Designer["priceRange"],
    shippingLocations: (row.shipping_locations as string[]) ?? [],
    madeToOrder: Boolean(row.made_to_order),
    customSizing: Boolean(row.custom_sizing),
    verificationStatus: row.verification_status as Designer["verificationStatus"],
    applicationStatus: "approved",
    websiteConnectionType: row.website_connection_type as Designer["websiteConnectionType"],
    featured: Boolean(row.featured),
    isIndependent: Boolean(row.is_independent),
    isEmerging: Boolean(row.is_emerging),
    isReferenceExample: Boolean(row.is_reference_example),
  };
}

export function mapLookbookRow(row: Record<string, unknown>): Lookbook {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: row.description as string | undefined,
    coverImageUrl: row.cover_image_url as string,
    generatedAt: row.generated_at as string,
    occasion: row.occasion as string | undefined,
    climate: row.climate as string | undefined,
    location: row.location as string | undefined,
    priceRange: row.price_range as Lookbook["priceRange"],
    aestheticTags: (row.aesthetic_tags as string[]) ?? [],
    visibility: row.visibility as Lookbook["visibility"],
    generationMethod: row.generation_method as GenerationMethod,
    saved: Boolean(row.saved),
    collectionIds: [],
    buildPreferences: row.build_preferences as BuildLookAnswers | undefined,
    notes: row.notes as string | undefined,
  };
}

export function mapLookRow(row: Record<string, unknown>): Look {
  return {
    id: row.id as string,
    lookbookId: row.lookbook_id as string,
    title: row.title as string,
    explanation: row.explanation as string,
    totalEstimatedPrice: Number(row.total_estimated_price),
    currency: row.currency as Look["currency"],
    colorPalette: (row.color_palette as string[]) ?? [],
    silhouetteTags: (row.silhouette_tags as string[]) ?? [],
    occasionTags: (row.occasion_tags as string[]) ?? [],
    stylingExplanation: row.styling_explanation as string | undefined,
    matchExplanation: row.match_explanation as string | undefined,
    productIds: [],
  };
}

export async function saveLookbookToDb(params: {
  userId: string;
  lookbook: Lookbook;
  looks: Look[];
  products: Product[];
  method: GenerationMethod;
  buildPreferences?: BuildLookAnswers;
}): Promise<void> {
  const supabase = await getRequestSupabase();
  const { lookbook, looks, userId, method, buildPreferences } = params;

  const { error: lbError } = await supabase.from("lookbooks").upsert({
    id: lookbook.id,
    user_id: userId,
    title: lookbook.title,
    description: lookbook.description,
    cover_image_url: lookbook.coverImageUrl,
    generated_at: lookbook.generatedAt,
    occasion: lookbook.occasion,
    climate: lookbook.climate,
    location: lookbook.location,
    price_range: lookbook.priceRange,
    aesthetic_tags: lookbook.aestheticTags,
    visibility: lookbook.visibility,
    generation_method: method,
    saved: true,
    build_preferences: buildPreferences ?? lookbook.buildPreferences,
    notes: lookbook.notes,
    updated_at: new Date().toISOString(),
  });

  if (lbError) throw lbError;

  await supabase.from("looks").delete().eq("lookbook_id", lookbook.id);

  for (let i = 0; i < looks.length; i++) {
    const look = looks[i];
    const { error: lookError } = await supabase.from("looks").insert({
      id: look.id,
      lookbook_id: lookbook.id,
      title: look.title,
      explanation: look.explanation,
      total_estimated_price: look.totalEstimatedPrice,
      currency: look.currency,
      color_palette: look.colorPalette,
      silhouette_tags: look.silhouetteTags,
      occasion_tags: look.occasionTags,
      styling_explanation: look.stylingExplanation,
      match_explanation: look.matchExplanation,
      sort_order: i,
    });
    if (lookError) throw lookError;

    if (look.productIds.length) {
      const lookProducts = look.productIds.map((productId, sortOrder) => ({
        look_id: look.id,
        product_id: productId,
        sort_order: sortOrder,
      }));
      const { error: lpError } = await supabase.from("look_products").insert(lookProducts);
      if (lpError) throw lpError;
    }
  }
}

export async function listUserLookbooks(userId: string): Promise<Lookbook[]> {
  const supabase = await getRequestSupabase();
  const { data, error } = await supabase
    .from("lookbooks")
    .select("*")
    .eq("user_id", userId)
    .eq("saved", true)
    .order("generated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapLookbookRow);
}

export async function getLookbookById(
  userId: string,
  lookbookId: string
): Promise<{ lookbook: Lookbook; looks: Look[]; productIds: string[] } | null> {
  const supabase = await getRequestSupabase();
  const { data: lb, error } = await supabase
    .from("lookbooks")
    .select("*")
    .eq("id", lookbookId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!lb) return null;

  const { data: looksData, error: looksError } = await supabase
    .from("looks")
    .select("*")
    .eq("lookbook_id", lookbookId)
    .order("sort_order", { ascending: true });
  if (looksError) throw looksError;

  const looks = (looksData ?? []).map(mapLookRow);
  const allProductIds: string[] = [];

  for (const look of looks) {
    const { data: lp } = await supabase
      .from("look_products")
      .select("product_id, sort_order")
      .eq("look_id", look.id)
      .order("sort_order", { ascending: true });
    look.productIds = (lp ?? []).map((r) => r.product_id as string);
    allProductIds.push(...look.productIds);
  }

  return {
    lookbook: mapLookbookRow(lb),
    looks,
    productIds: [...new Set(allProductIds)],
  };
}
