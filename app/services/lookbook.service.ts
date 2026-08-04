import type {
  BuildLookAnswers,
  CurrencyCode,
  GenerationMethod,
  Look,
  Lookbook,
  PriceRangeSelection,
  SavedLookbookSession,
  SearchFilters,
  SurpriseConstraints,
} from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import {
  DEFAULT_PRICE_RANGE,
  MOCK_DESIGNERS,
  MOCK_DISCLAIMER,
  MOCK_LOOKS,
  MOCK_PRODUCTS,
} from "@/app/data/mockCatalog";
import {
  STYLE_DIRECTION_OPTIONS,
  blendStyleLabel,
} from "@/app/data/buildQuestionnaire";
import {
  assembleDiverseLook,
  parseSearchQuery,
  rankCatalogProducts,
  searchCatalog,
} from "@/app/services/catalog.service";
import { assembleVariedLookbook } from "@/app/services/lookAssembly.service";
import { shuffleArray, rotateArray } from "@/app/utils/pickRandom";

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

function styleLabels(answers: BuildLookAnswers): string[] {
  const fromIds = (answers.styleDirections ?? []).map((sid) => {
    const found = STYLE_DIRECTION_OPTIONS.find((s) => s.id === sid);
    return found?.label ?? sid;
  });
  const legacy = answers.aesthetics ?? [];
  if (answers.customStyleDescription?.trim()) {
    fromIds.push(answers.customStyleDescription.trim());
  }
  return fromIds.length ? fromIds : legacy;
}

function buildBlendExplanation(answers: BuildLookAnswers): string {
  const styles = styleLabels(answers);
  const presentation = answers.clothingPresentation ?? [];

  const parts: string[] = [];

  if (styles.length >= 2) {
    const hasY2K = styles.some((s) => /y2k/i.test(s));
    const hasOffice = styles.some((s) => /office|business/i.test(s));
    const hasStreet = styles.some((s) => /street/i.test(s));
    const hasQuiet = styles.some((s) => /quiet luxury/i.test(s));
    const hasEvening = styles.some((s) => /evening/i.test(s));
    const hasVintage = styles.some((s) => /vintage/i.test(s));
    const hasScandi = styles.some((s) => /scandinavian/i.test(s));

    if (hasY2K && hasOffice) {
      parts.push("Polished Y2K-inspired work looks that balance nostalgia with office-ready structure.");
    } else if (presentation.includes("Feminine") && hasStreet) {
      parts.push("Feminine details paired with streetwear proportions and urban layering.");
    } else if (presentation.includes("Masculine") && styles.some((s) => /romantic/i.test(s))) {
      parts.push("Masculine silhouettes softened through fabric, color, and romantic detailing.");
    } else if (
      (presentation.includes("Androgynous") || presentation.includes("Gender-neutral")) &&
      hasEvening
    ) {
      parts.push("Occasion looks that avoid strongly gendered styling while staying elevated.");
    } else if (presentation.includes("Gender-neutral") && hasQuiet) {
      parts.push("Refined, versatile silhouettes drawn across retailer categories.");
    } else if (hasVintage && styles.some((s) => /experimental/i.test(s))) {
      parts.push("Vintage references reinterpreted through experimental proportion and texture.");
    } else if (hasScandi && presentation.includes("Feminine")) {
      parts.push("Scandinavian minimal lines with soft feminine proportion and palette.");
    } else {
      parts.push(
        `Intentional blend of ${styles.slice(0, 3).join(", ")}${styles.length > 3 ? " and more" : ""}.`
      );
    }
  } else if (styles.length === 1) {
    parts.push(`Looks shaped primarily by ${styles[0]}.`);
  }

  if (presentation.length && !presentation.includes("No preference")) {
    parts.push(`Presentation: ${presentation.join(", ")}.`);
  }

  const footwear = answers.footwear;
  if (footwear?.inclusion === "no") {
    parts.push("Clothing-only edit — footwear excluded.");
  } else if (footwear?.types?.length) {
    parts.push(`Footwear focus: ${footwear.types.join(", ")}.`);
  }

  return parts.join(" ") || "Built from your style, fit, and presentation preferences.";
}

function collectSearchSizes(answers: BuildLookAnswers): string[] {
  const sizes: string[] = [];
  const cs = answers.clothingSizes;
  if (cs) {
    (["tops", "bottoms", "dresses", "outerwear", "bras"] as const).forEach((key) => {
      if (cs[key] && !(cs.skippedCategories ?? []).includes(key)) {
        sizes.push(cs[key]!);
      }
    });
  }
  if (answers.footwear?.shoeSize) sizes.push(answers.footwear.shoeSize);
  return sizes.length ? sizes : (answers.sizes ?? []);
}

import { checkSizeAvailability } from "@/app/utils/sizeAvailability";
import { STYLE_TO_AESTHETIC } from "@/app/data/curatedRoster";
import { communitySearchAesthetics } from "@/app/data/styleCommunities";
import { resolveDepartmentFromBuild } from "@/app/utils/presentationMatch";
import { coverFromProducts, CATEGORY_PLACEHOLDER, normalizeCoverImageUrl } from "@/app/data/productImagery";

export { checkSizeAvailability };

function styleAestheticTags(answers: BuildLookAnswers): string[] {
  const fromStyles = (answers.styleDirections ?? []).flatMap(
    (sid) => STYLE_TO_AESTHETIC[sid] ?? []
  );
  const fromCommunities = answers.fashionCommunities?.length
    ? communitySearchAesthetics(answers.fashionCommunities)
    : [];
  return [...styleLabels(answers), ...fromStyles, ...fromCommunities];
}

function buildLooksFromProducts(
  candidates: import("@/app/types/domain").Product[],
  lookbookId: string,
  matchExplanation: string,
  stylingNote?: string
): Look[] {
  if (!candidates.length) {
    return MOCK_LOOKS.map((look) => ({
      ...look,
      id: id("look"),
      lookbookId,
      matchExplanation,
    }));
  }

  const varied = assembleVariedLookbook(candidates, lookbookId, matchExplanation, stylingNote);
  if (varied.length) return varied;

  return MOCK_LOOKS.map((look) => ({
    ...look,
    id: id("look"),
    lookbookId,
    matchExplanation,
    productIds: candidates.slice(0, 4).map((p) => p.id),
  }));
}

function mergeCandidatePool(
  assembled: import("@/app/services/catalog.service").AssembledLook,
  ranked: import("@/app/types/domain").Product[]
): import("@/app/types/domain").Product[] {
  const seen = new Set<string>();
  const merged: import("@/app/types/domain").Product[] = [];
  for (const p of [...assembled.products, ...ranked]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    merged.push(p);
  }
  return merged;
}

export function generateLookbookFromBuild(
  answers: BuildLookAnswers
): { lookbook: Lookbook; looks: Look[] } {
  const labels = styleLabels(answers);
  const blendTitle = blendStyleLabel(
    answers.styleDirections ?? [],
    answers.customStyleDescription
  );
  const location = answers.location ?? "Global";
  const searchSizes = collectSearchSizes(answers);
  const independent = answers.independentDesigners === true;
  const presentations = answers.clothingPresentation;
  const department = resolveDepartmentFromBuild(answers);

  const blendNote = buildBlendExplanation(answers);
  const aestheticTags = styleAestheticTags(answers);

  const searchFilters = {
    aesthetics: aestheticTags,
    fashionCommunities: answers.fashionCommunities,
    coverageLevel: answers.coverageLevel,
    kawaiiIntensity: answers.kawaiiIntensity,
    city: location,
    climate: answers.climate,
    priceRange: answers.priceRange ?? DEFAULT_PRICE_RANGE,
    sizes: searchSizes,
    independentOnly: independent,
    department,
  } as const;

  const assembled = assembleDiverseLook(searchFilters, answers);
  const ranked = searchCatalog(searchFilters, presentations);
  const candidates = rotateArray(shuffleArray(mergeCandidatePool(assembled, ranked)));

  const lookbook: Lookbook = {
    id: id("lb"),
    title: `${location} · ${blendTitle}`,
    description: `${blendNote} ${MOCK_DISCLAIMER}`,
    coverImageUrl: CATEGORY_PLACEHOLDER.default,
    generatedAt: new Date().toISOString(),
    occasion: answers.dressingFor,
    climate: answers.climate,
    location,
    priceRange: answers.priceRange ?? DEFAULT_PRICE_RANGE,
    aestheticTags: labels.map((l) => l.toLowerCase().replace(/\s+/g, "-")),
    visibility: "private",
    generationMethod: "build",
    saved: false,
    collectionIds: [],
    buildPreferences: answers,
  };

  const looks = buildLooksFromProducts(
    candidates,
    lookbook.id,
    `${blendNote} ${assembled.explanation}`,
    `Silhouettes selected for ${answers.clothingPresentation?.join(" and ") ?? "your"} presentation preference.${independent ? " Independent designers prioritized." : ""}${searchSizes.length ? ` Sized for: ${searchSizes.join(", ")}.` : ""}`
  );

  const allProductIds = looks.flatMap((l) => l.productIds ?? []);
  lookbook.coverImageUrl = coverFromProducts(allProductIds, MOCK_PRODUCTS);

  return { lookbook, looks };
}

export function generateLookbookFromSearch(
  filters: SearchFilters
): { lookbook: Lookbook; looks: Look[] } {
  const parsed = filters.query ? parseSearchQuery(filters.query) : {};
  const merged: SearchFilters = { ...parsed, ...filters, query: filters.query };

  const assembled = assembleDiverseLook(merged);
  const candidates = searchCatalog(merged);

  const lookbook: Lookbook = {
    id: id("lb"),
    title: filters.query?.slice(0, 48) ?? "Search Results",
    description: `${assembled.explanation} ${MOCK_DISCLAIMER}`,
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

  const looks = buildLooksFromProducts(candidates, lookbook.id, assembled.explanation);
  lookbook.coverImageUrl = coverFromProducts(
    looks.flatMap((l) => l.productIds ?? []),
    MOCK_PRODUCTS
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

  const lookbook: Lookbook = {
    id: id("lb"),
    title: `Surprise: ${picked}`,
    description: `Archive411 selected ${picked} based on your constraints. ${MOCK_DISCLAIMER}`,
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

  const surpriseFilters = {
    aesthetics: [picked.toLowerCase().replace(/\s+/g, "-"), "y2k", "nightlife"],
    independentOnly: true,
    priceRange: constraints.priceRange ?? DEFAULT_PRICE_RANGE,
    climate: constraints.climate,
  };
  const assembled = assembleDiverseLook(surpriseFilters);
  const candidates = searchCatalog(surpriseFilters);

  const aestheticExplanation = `${picked} may appeal to you because it balances ${constraints.adventurousness && constraints.adventurousness > 60 ? "experimental proportion" : "wearable structure"} with your selected occasion and climate.`;

  const looks = buildLooksFromProducts(
    candidates,
    lookbook.id,
    `${aestheticExplanation} ${assembled.explanation}`
  );
  lookbook.coverImageUrl = coverFromProducts(
    looks.flatMap((l) => l.productIds ?? []),
    MOCK_PRODUCTS
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
  const designers = MOCK_DESIGNERS.filter(
    (d) => !designerIds?.length || designerIds.includes(d.id)
  );

  const lookbook: Lookbook = {
    id: id("lb"),
    title: "The Independent Edit",
    description: `Featuring ${designers.map((d) => d.labelName).join(", ")}. ${MOCK_DISCLAIMER}`,
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
  const assembled = assembleDiverseLook(independentFilters);
  const candidates = searchCatalog(independentFilters).filter(
    (p) => !p.designerId || rosterIds.includes(p.designerId)
  );

  return {
    lookbook,
    looks: buildLooksFromProducts(
      candidates.length >= 4 ? candidates : searchCatalog(independentFilters),
      lookbook.id,
      `Independent edit featuring ${designers.map((d) => d.labelName).join(", ")}. ${assembled.explanation}`
    ),
  };
}

export function getDesignerBySlug(slug: string) {
  return MOCK_DESIGNERS.find((d) => d.slug === slug) ?? null;
}

export function getDesignerProducts(designerId: string) {
  return MOCK_PRODUCTS.filter((p) => p.designerId === designerId);
}

export function getFeaturedDesigners() {
  return MOCK_DESIGNERS.filter((d) => d.featured);
}

export function storeLookbookSession(
  lookbook: Lookbook,
  looks: Look[],
  method: GenerationMethod,
  buildPreferences?: BuildLookAnswers
) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    "archive411-current-lookbook",
    JSON.stringify({
      lookbook: buildPreferences
        ? { ...lookbook, buildPreferences }
        : lookbook,
      looks,
      method,
      buildPreferences,
    })
  );
}

export function readLookbookSession(): {
  lookbook: Lookbook;
  looks: Look[];
  method: GenerationMethod;
  buildPreferences?: BuildLookAnswers;
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
  }).slice(0, 12);
}
