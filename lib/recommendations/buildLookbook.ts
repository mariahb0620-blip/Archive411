import type {
  BuildLookAnswers,
  Designer,
  Look,
  Lookbook,
  Product,
} from "@/app/types/domain";
import { BETA_DESIGNERS, BETA_PRODUCTS } from "@/app/data/betaCatalog";
import { EDITORIAL_COVER } from "@/app/data/catalogImages";
import { getCatalogProducts, getCatalogDesigners } from "@/lib/catalog/getCatalog";
import { generateLookbookFromBuildForPool } from "@/lib/recommendations/generateForPool";

export interface BuildRecommendationResult {
  lookbook: Lookbook;
  looks: Look[];
  products: Product[];
  designers: Designer[];
  empty: boolean;
  message?: string;
}

/** Server-side structured lookbook generation — no AI hallucination. */
export async function buildLookbookRecommendation(
  answers: BuildLookAnswers,
  productPool?: Product[]
): Promise<BuildRecommendationResult> {
  const products = productPool ?? (await getCatalogProducts());
  const designers = await getCatalogDesigners();

  if (!products.length) {
    return {
      lookbook: {
        id: `lb-empty-${Date.now()}`,
        title: "No matches yet",
        coverImageUrl: EDITORIAL_COVER,
        generatedAt: new Date().toISOString(),
        aestheticTags: [],
        visibility: "private",
        generationMethod: "build",
        saved: false,
        collectionIds: [],
        buildPreferences: answers,
        description:
          "We could not find verified catalog pieces for this combination. Try broadening style, budget, or location.",
      },
      looks: [],
      products: [],
      designers,
      empty: true,
      message: "No verified catalog matches for your preferences.",
    };
  }

  const originalProducts = products;
  // Temporarily inject verified pool into lookbook service via module override pattern
  const { lookbook, looks } = generateLookbookFromBuildForPool(answers, originalProducts);

  const usedProductIds = new Set(looks.flatMap((l) => l.productIds));
  const usedProducts = originalProducts.filter((p) => usedProductIds.has(p.id));

  if (!looks.length || !usedProducts.length) {
    return {
      lookbook: {
        ...lookbook,
        title: "Limited matches",
        description:
          "Inventory is limited for this combination. We returned fewer looks rather than fabricating products.",
      },
      looks,
      products: usedProducts,
      designers,
      empty: looks.length === 0,
      message:
        looks.length === 0
          ? "No complete outfits available with current verified inventory."
          : undefined,
    };
  }

  return {
    lookbook,
    looks,
    products: usedProducts,
    designers,
    empty: false,
  };
}

export async function findReplacementProduct(params: {
  category: string;
  excludeIds: string[];
  answers?: BuildLookAnswers;
}): Promise<Product | null> {
  const products = await getCatalogProducts();
  const candidates = products.filter(
    (p) =>
      p.category === params.category &&
      !params.excludeIds.includes(p.id) &&
      p.inventoryStatus !== "sold-out"
  );
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export { BETA_PRODUCTS, BETA_DESIGNERS };
