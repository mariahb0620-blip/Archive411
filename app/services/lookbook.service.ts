import type {
  BuildLookAnswers,
  CurrencyCode,
  GenerationMethod,
  Look,
  Lookbook,
  PriceRangeSelection,
  Product,
  SavedLookbookSession,
  SearchFilters,
  SurpriseConstraints,
} from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import { DEFAULT_PRICE_RANGE } from "@/app/data/mockCatalog";
import {
  assembleDiverseLook,
  parseSearchQuery,
  rankCatalogProducts,
  searchCatalog,
} from "@/app/services/catalog.service";
import type { AssembleLookbookOptions } from "@/app/services/lookAssembly.service";
import {
  getVerifiedProductsSync,
  getVerifiedDesignersSync,
} from "@/lib/catalog/verifiedPool";
import { assembleVariedLookbook } from "@/app/services/lookAssembly.service";
import { checkSizeAvailability } from "@/app/utils/sizeAvailability";
import { coverFromProducts, CATEGORY_PLACEHOLDER, normalizeCoverImageUrl } from "@/app/data/productImagery";

export { checkSizeAvailability };

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildLooksFromProducts(
  candidates: Product[],
  lookbookId: string,
  matchExplanation: string,
  stylingNote?: string,
  options?: AssembleLookbookOptions
): Look[] {
  if (!candidates.length) return [];
  return assembleVariedLookbook(candidates, lookbookId, matchExplanation, stylingNote, options);
}

export function generateLookbookFromSearch(
  filters: SearchFilters
): { lookbook: Lookbook; looks: Look[] } {
  const parsed = filters.query ? parseSearchQuery(filters.query) : {};
  const merged: SearchFilters = { ...parsed, ...filters, query: filters.query };

  const pool = getVerifiedProductsSync();
  const assembled = assembleDiverseLook(merged, undefined, pool);
  const candidates = searchCatalog(merged, undefined, pool);

  const lookbook: Lookbook = {
    id: id("lb"),
    title: filters.query?.slice(0, 48) ?? "Search Results",
    description: assembled.explanation || "Search results from verified catalog.",
    coverImageUrl: CATEGORY_PLACEHOLDER.default,
    generatedAt: new Date().toISOString(),
    occasion: filters.occasion,
    climate: filters.climate,
    location: filters.city ?? parsed.city,
    priceRange: filters.priceRange ?? DEFAULT_PRICE_RANGE,
    aestheticTags: merged.aesthetics ?? filters.aesthetics ?? ["discovered"],
    visibility: "private",
    generationMethod: "search",
    saved: false,
    collectionIds: [],
  };

  const looks = buildLooksFromProducts(candidates, lookbook.id, assembled.explanation, undefined, {
    styleBlend: "Editorial mix",
    dressingFor: filters.occasion,
  });
  lookbook.coverImageUrl = coverFromProducts(
    looks.flatMap((l) => l.productIds ?? []),
    pool
  );

  return { lookbook, looks };
}

export function generateSurpriseLookbook(
  constraints: SurpriseConstraints
): {
  lookbook: Lookbook;
  looks: Look[];
  aestheticExplanation: string;
} {
  const aesthetics = [
    "Neo-romantic tailoring",
    "Soft masculine archive",
    "Tropical minimal",
    "Y2K night edit",
    "Gallery uniform",
  ];
  const picked = aesthetics[Math.floor(Math.random() * aesthetics.length)];

  const pool = getVerifiedProductsSync();
  const surpriseFilters = {
    aesthetics: [picked.toLowerCase().replace(/\s+/g, "-"), "y2k", "nightlife"],
    independentOnly: true,
    priceRange: constraints.priceRange ?? DEFAULT_PRICE_RANGE,
    climate: constraints.climate,
  };
  const candidates = searchCatalog(surpriseFilters, undefined, pool);

  const aestheticExplanation = `${picked} may appeal to you because it balances ${constraints.adventurousness && constraints.adventurousness > 60 ? "experimental proportion" : "wearable structure"} with your selected occasion and climate.`;

  const lookbook: Lookbook = {
    id: id("lb"),
    title: `Surprise: ${picked}`,
    description: `${aestheticExplanation} Verified catalog — limited beta inventory.`,
    coverImageUrl: CATEGORY_PLACEHOLDER.default,
    generatedAt: new Date().toISOString(),
    occasion: constraints.occasion,
    climate: constraints.climate,
    priceRange: constraints.priceRange ?? DEFAULT_PRICE_RANGE,
    aestheticTags: [picked.toLowerCase()],
    visibility: "private",
    generationMethod: "surprise",
    saved: false,
    collectionIds: [],
  };

  const looks = buildLooksFromProducts(
    candidates,
    lookbook.id,
    aestheticExplanation,
    undefined,
    { styleBlend: picked, dressingFor: constraints.occasion, footwearTypes: undefined }
  );
  lookbook.coverImageUrl = coverFromProducts(
    looks.flatMap((l) => l.productIds ?? []),
    pool
  );

  return {
    lookbook,
    looks,
    aestheticExplanation,
  };
}

export function generateIndependentLookbook(
  designerIds?: string[]
): { lookbook: Lookbook; looks: Look[] } {
  const pool = getVerifiedProductsSync();
  const designers = getVerifiedDesignersSync().filter(
    (d) => !designerIds?.length || designerIds.includes(d.id)
  );

  const lookbook: Lookbook = {
    id: id("lb"),
    title: "The Independent Edit",
    description: `Featuring ${designers.map((d) => d.labelName).join(", ")}. Verified catalog.`,
    coverImageUrl: normalizeCoverImageUrl(designers[0]?.coverImageUrl),
    generatedAt: new Date().toISOString(),
    aestheticTags: ["independent", "emerging"],
    visibility: "private",
    generationMethod: "independent",
    saved: false,
    collectionIds: [],
  };

  const rosterIds = designers.map((d) => d.id);

  const independentFilters = {
    independentOnly: true,
    aesthetics: ["contemporary", "independent"],
  };
  const assembled = assembleDiverseLook(independentFilters, undefined, pool);
  const candidates = searchCatalog(independentFilters, undefined, pool).filter(
    (p) => !p.designerId || rosterIds.includes(p.designerId)
  );

  return {
    lookbook,
    looks: buildLooksFromProducts(
      candidates.length ? candidates : searchCatalog(independentFilters, undefined, pool),
      lookbook.id,
      `Independent edit featuring ${designers.map((d) => d.labelName).join(", ")}. ${assembled.explanation}`,
      undefined,
      { styleBlend: "Independent Edit" }
    ),
  };
}

export function getDesignerBySlug(slug: string) {
  return getVerifiedDesignersSync().find((d) => d.slug === slug) ?? null;
}

export function getDesignerProducts(designerId: string) {
  return getVerifiedProductsSync().filter((p) => p.designerId === designerId);
}

export function getFeaturedDesigners() {
  return getVerifiedDesignersSync().filter((d) => d.featured);
}

export function productsForLooks(looks: Look[]): Product[] {
  const pool = getVerifiedProductsSync();
  const ids = new Set(looks.flatMap((l) => l.productIds));
  return pool.filter((p) => ids.has(p.id));
}

export function storeLookbookSession(
  lookbook: Lookbook,
  looks: Look[],
  method: GenerationMethod,
  buildPreferences?: BuildLookAnswers,
  products?: Product[]
) {
  if (typeof window === "undefined") return;
  const resolvedProducts = products ?? productsForLooks(looks);
  sessionStorage.setItem(
    "archive411-current-lookbook",
    JSON.stringify({
      lookbook: buildPreferences
        ? { ...lookbook, buildPreferences }
        : lookbook,
      looks,
      method,
      buildPreferences,
      products: resolvedProducts,
    })
  );
}

export function readLookbookSession(): {
  lookbook: Lookbook;
  looks: Look[];
  method: GenerationMethod;
  buildPreferences?: BuildLookAnswers;
  products?: import("@/app/types/domain").Product[];
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("archive411-current-lookbook");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readSavedSessionsMap(): Record<string, SavedLookbookSession> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedLookbookSessions);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Persist full lookbook data so saved archive entries reopen after refresh. */
export function persistLookbookToArchive(session: SavedLookbookSession): void {
  if (typeof window === "undefined") return;
  const map = readSavedSessionsMap();
  map[session.lookbook.id] = session;
  localStorage.setItem(STORAGE_KEYS.savedLookbookSessions, JSON.stringify(map));
}

export function readPersistedLookbook(
  lookbookId: string
): SavedLookbookSession | null {
  if (typeof window === "undefined") return null;
  return readSavedSessionsMap()[lookbookId] ?? null;
}

export function recommendProducts(filters: {
  sizes?: string[];
  priceRange?: PriceRangeSelection;
  independentOnly?: boolean;
}) {
  return rankCatalogProducts({
    sizes: filters.sizes,
    priceRange: filters.priceRange,
    independentOnly: filters.independentOnly,
  }, undefined, getVerifiedProductsSync()).slice(0, 12);
}
