/**
 * Seed Supabase with verified beta catalog.
 * Run: npx tsx scripts/seed-supabase.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in env.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { BETA_DESIGNERS, BETA_PRODUCTS } from "../app/data/betaCatalog";
import { EXTENDED_DESIGNERS, EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";

const ALL_DESIGNERS = [...BETA_DESIGNERS, ...EXTENDED_DESIGNERS];
const ALL_PRODUCTS = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log("Seeding designers...");
  for (const d of ALL_DESIGNERS) {
    const { error } = await supabase.from("designers").upsert({
      id: d.id,
      slug: d.slug,
      label_name: d.labelName,
      label_type: d.labelType,
      biography: d.biography,
      city: d.city,
      country: d.country,
      cover_image_url: d.coverImageUrl,
      website: d.website,
      instagram: d.instagram,
      social_links: d.socialLinks,
      aesthetic_tags: d.aestheticTags,
      size_range: d.sizeRange,
      price_range: d.priceRange,
      shipping_locations: d.shippingLocations,
      made_to_order: d.madeToOrder,
      custom_sizing: d.customSizing,
      verification_status: d.verificationStatus,
      website_connection_type: d.websiteConnectionType,
      featured: d.featured,
      is_independent: d.isIndependent,
      is_emerging: d.isEmerging ?? false,
      is_reference_example: false,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error(`  designer ${d.id}:`, error.message);
  }

  console.log("Seeding products...");
  for (const p of ALL_PRODUCTS) {
    const { error } = await supabase.from("products").upsert({
      id: p.id,
      name: p.name,
      description: p.description,
      product_url: p.productUrl,
      image_urls: p.imageUrls,
      category: p.category,
      subcategory: p.subcategory,
      available_sizes: p.availableSizes,
      sizing_system: p.sizingSystem,
      price: p.price,
      original_price: p.originalPrice,
      currency: p.currency,
      color: p.color,
      material: p.material,
      designer_id: p.designerId,
      designer_city: p.designerCity,
      aesthetic_tags: p.aestheticTags,
      presentation_tags: p.presentationTags,
      occasion_tags: p.occasionTags,
      climate_tags: p.climateTags,
      department_tags: p.departmentTags,
      inventory_status: p.inventoryStatus,
      made_to_order: p.madeToOrder ?? false,
      shipping_destinations: p.shippingDestinations,
      condition: p.condition,
      is_independent_designer: p.isIndependentDesigner ?? false,
      is_emerging_designer: p.isEmergingDesigner ?? false,
      is_reference_example: false,
      purchase_flow: p.purchaseFlow ?? "direct",
      last_verified_at: p.lastVerifiedAt,
      updated_at: p.updatedAt,
      source_url: p.sourceUrl ?? p.productUrl,
      source_type: p.sourceType ?? "curated",
      source_product_id: p.sourceProductId,
      retailer_name: p.retailerName,
      designer_name: p.designerName,
      image_source: p.imageSource ?? "category_placeholder",
      style_tags: p.styleTags ?? [],
      season_tags: p.seasonTags ?? [],
      color_tags: p.colorTags ?? [],
      footwear_type: p.footwearType,
      heel_height: p.heelHeight,
      verified: p.verified ?? false,
      verification_status: p.verificationStatus ?? "pending",
      verified_at: p.verifiedAt,
      last_checked_at: p.lastCheckedAt ?? p.lastVerifiedAt,
      verification_method: p.verificationMethod,
      affiliate_url: p.affiliateUrl,
      affiliate_network: p.affiliateNetwork,
      stock_status: p.stockStatus ?? p.inventoryStatus,
    });
    if (error) console.error(`  product ${p.id}:`, error.message);
  }

  console.log(`Done — ${ALL_DESIGNERS.length} designers, ${ALL_PRODUCTS.length} products`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
