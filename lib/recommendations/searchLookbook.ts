import type { Look, Lookbook, Product, SearchFilters } from "@/app/types/domain";
import { EDITORIAL_COVER } from "@/app/data/catalogImages";
import { getCatalogDesigners, getCatalogProducts } from "@/lib/catalog/getCatalog";
import {
  assembleDiverseLook,
  searchCatalog,
} from "@/app/services/catalog.service";
import { assembleVariedLookbook } from "@/app/services/lookAssembly.service";
import { coverFromProducts } from "@/app/data/productImagery";
import { parseSearchQuery } from "@/app/services/catalog.service";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface SearchRecommendationResult {
  lookbook: Lookbook;
  looks: Look[];
  products: Product[];
  empty: boolean;
  message?: string;
}

export async function searchLookbookRecommendation(
  filters: SearchFilters
): Promise<SearchRecommendationResult> {
  const products = await getCatalogProducts();
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
        generationMethod: "search",
        saved: false,
        collectionIds: [],
        description: "Verified catalog is empty. Run catalog:seed to load designers.",
      },
      looks: [],
      products: [],
      empty: true,
      message: "No verified catalog products available.",
    };
  }

  const parsed = filters.query ? parseSearchQuery(filters.query) : {};
  const merged: SearchFilters = { ...parsed, ...filters, query: filters.query };

  const assembled = assembleDiverseLook(merged, undefined, products);
  const candidates = searchCatalog(merged, undefined, products);

  const lookbook: Lookbook = {
    id: id("lb"),
    title: filters.query?.slice(0, 48) ?? "Search Results",
    description: assembled.explanation || "Results from verified catalog.",
    coverImageUrl: EDITORIAL_COVER,
    generatedAt: new Date().toISOString(),
    occasion: filters.occasion,
    climate: filters.climate,
    location: filters.city ?? parsed.city,
    priceRange: filters.priceRange,
    aestheticTags: merged.aesthetics ?? ["discovered"],
    visibility: "private",
    generationMethod: "search",
    saved: false,
    collectionIds: [],
  };

  if (!candidates.length) {
    return {
      lookbook: {
        ...lookbook,
        title: "No matches",
        description:
          "No verified products match your search. Try broadening filters or location.",
      },
      looks: [],
      products: [],
      empty: true,
      message: "No verified catalog matches for this search.",
    };
  }

  const looks = assembleVariedLookbook(candidates, lookbook.id, assembled.explanation, undefined, {
    styleBlend: filters.query?.slice(0, 48) ?? "Search Results",
    dressingFor: filters.occasion,
  });
  const usedIds = new Set(looks.flatMap((l) => l.productIds ?? []));
  const usedProducts = products.filter((p) => usedIds.has(p.id));

  lookbook.coverImageUrl = coverFromProducts(
    looks.flatMap((l) => l.productIds ?? []),
    products
  );

  if (!looks.length) {
    return {
      lookbook: {
        ...lookbook,
        title: "Limited matches",
        description: "Inventory could not form complete looks — try fewer filters.",
      },
      looks: [],
      products: [],
      empty: true,
      message: "Could not assemble complete outfits from current inventory.",
    };
  }

  void designers;
  return {
    lookbook,
    looks,
    products: usedProducts,
    empty: false,
  };
}
