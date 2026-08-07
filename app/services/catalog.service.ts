import type {
  BuildLookAnswers,
  CurrencyCode,
  Product,
  SearchFilters,
} from "@/app/types/domain";
import {
  MOCK_CONCEPT_STORES,
  MOCK_DESIGNERS,
  MOCK_PRODUCTS,
  MOCK_VINTAGE_SELLERS,
  MOCK_SHOWROOMS,
} from "@/app/data/seed";
import { getVerifiedProductsSync } from "@/lib/catalog/verifiedPool";
import {
  PRIORITY_CONCEPT_STORE_IDS,
  PRIORITY_DESIGNER_IDS,
  PRIORITY_VINTAGE_SELLER_IDS,
  ROSTER_DISPLAY_NAMES,
  STYLE_TO_AESTHETIC,
} from "@/app/data/curatedRoster";
import { parseStyleUniverseQuery } from "@/app/data/styleUniverse";
import { communitySearchAesthetics } from "@/app/data/styleCommunities";
import { checkSizeAvailability } from "@/app/utils/sizeAvailability";
import { pickRandom, rotateArray, shuffleArray } from "@/app/utils/pickRandom";
import { scorePresentationMatch } from "@/app/utils/presentationMatch";

/** Verified beta catalog — never default to mock reference products. */
function verifiedPool(override?: Product[]): Product[] {
  return override ?? getVerifiedProductsSync();
}

/** Round-robin across cities/sources so results aren't always the same market. */
const GLOBAL_SOURCE_REGIONS = [
  "Ho Chi Minh City",
  "Bangkok",
  "New York City",
  "London",
  "Paris",
  "Tokyo",
  "Seoul",
  "Lagos",
] as const;

function productRegion(product: Product): string {
  return product.designerCity ?? product.retailerCity ?? "Global";
}

export function interleaveGlobalSources(products: Product[]): Product[] {
  const buckets = new Map<string, Product[]>();
  for (const region of GLOBAL_SOURCE_REGIONS) buckets.set(region, []);
  buckets.set("Global", []);
  buckets.set("Other", []);

  for (const p of products) {
    const city = productRegion(p);
    const key = GLOBAL_SOURCE_REGIONS.find((r) => city.toLowerCase().includes(r.toLowerCase()));
    if (key) buckets.get(key)!.push(p);
    else if (city === "Global") buckets.get("Global")!.push(p);
    else buckets.get("Other")!.push(p);
  }

  for (const [key, list] of buckets) {
    buckets.set(key, shuffleArray(list));
  }

  const order = [...GLOBAL_SOURCE_REGIONS, "Other", "Global"];
  const result: Product[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const key of order) {
      const bucket = buckets.get(key)!;
      if (bucket.length) {
        result.push(bucket.shift()!);
        added = true;
      }
    }
  }
  return result.length ? result : products;
}

const FX_TO_USD: Record<CurrencyCode, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  VND: 0.00004,
  THB: 0.028,
  JPY: 0.0067,
  KRW: 0.00075,
  NGN: 0.00065,
  DKK: 0.14,
};

export function convertToCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  const usd = amount * FX_TO_USD[from];
  return Math.round(usd / FX_TO_USD[to]);
}

export function getProductSourceName(product: Product): string {
  if (product.designerId && ROSTER_DISPLAY_NAMES[product.designerId]) {
    return ROSTER_DISPLAY_NAMES[product.designerId];
  }
  if (product.designerId) {
    return MOCK_DESIGNERS.find((d) => d.id === product.designerId)?.labelName ?? "Designer";
  }
  if (product.conceptStoreId) {
    return (
      ROSTER_DISPLAY_NAMES[product.conceptStoreId] ??
      MOCK_CONCEPT_STORES.find((s) => s.id === product.conceptStoreId)?.name ??
      "Concept store"
    );
  }
  if (product.showroomId) {
    const sr = MOCK_SHOWROOMS.find((s) => s.id === product.showroomId);
    return sr?.name.replace(" (reference profile)", "") ?? "Showroom";
  }
  if (product.vintageSellerId) {
    return (
      ROSTER_DISPLAY_NAMES[product.vintageSellerId] ??
      MOCK_VINTAGE_SELLERS.find((s) => s.id === product.vintageSellerId)?.name ??
      "Vintage seller"
    );
  }
  return "Source";
}

function isRosterProduct(product: Product): boolean {
  return (
    (product.designerId != null && PRIORITY_DESIGNER_IDS.has(product.designerId)) ||
    (product.conceptStoreId != null && PRIORITY_CONCEPT_STORE_IDS.has(product.conceptStoreId)) ||
    (product.vintageSellerId != null && PRIORITY_VINTAGE_SELLER_IDS.has(product.vintageSellerId)) ||
    Boolean(product.isIndependentDesigner || product.isEmergingDesigner)
  );
}

function queryTerms(query?: string): string[] {
  if (!query?.trim()) return [];
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreProduct(
  product: Product,
  filters: SearchFilters,
  terms: string[],
  presentations?: string[]
): number {
  let score = isRosterProduct(product) ? 40 : 5;

  if (product.isEmergingDesigner) score += 15;
  if (product.conceptStoreId) score += 12;
  if (product.condition !== "new") score += 8;

  const haystack = [
    product.name,
    product.description,
    ...product.aestheticTags,
    ...product.presentationTags,
    ...product.occasionTags,
    product.designerCity,
    product.retailerCity,
    product.category,
    product.subcategory,
    product.designerId ? ROSTER_DISPLAY_NAMES[product.designerId] : "",
    product.conceptStoreId ? ROSTER_DISPLAY_NAMES[product.conceptStoreId] : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const term of terms) {
    if (haystack.includes(term)) score += 12;
  }

  if (filters.aesthetics?.length) {
    const tags = product.aestheticTags.map((t) => t.toLowerCase());
    const wantsEditorial = filters.aesthetics.some((a) =>
      /y2k|nightlife|street|experimental|sexy|chic|editorial|body-conscious/i.test(a)
    );
    const isGenericLuxury = tags.some((t) =>
      /quiet-luxury|minimalist/.test(t)
    );
    if (wantsEditorial && isGenericLuxury && !product.isEmergingDesigner) {
      score -= 15;
    }
    for (const a of filters.aesthetics) {
      const norm = a.toLowerCase().replace(/\s+/g, "-");
      if (tags.some((t) => t.includes(norm) || norm.includes(t.replace(/-/g, "")))) score += 18;
    }
  }

  if (filters.city) {
    const c = filters.city.toLowerCase();
    if (product.designerCity?.toLowerCase().includes(c)) score += 25;
    if (product.retailerCity?.toLowerCase().includes(c)) score += 15;
  }

  if (filters.climate && product.climateTags.some((t) => t.includes(filters.climate!.toLowerCase()))) {
    score += 10;
  }

  if (filters.independentOnly) {
    if (product.isIndependentDesigner || product.isEmergingDesigner) score += 35;
    else score -= 20;
  }

  if (filters.includeVintage === false && product.condition !== "new") {
    score -= 100;
  }

  if (!productMatchesDepartment(product, filters.department)) score -= 100;

  score += scorePresentationMatch(product, presentations);

  if (filters.sizes?.length) {
    const status = checkSizeAvailability(product, filters.sizes);
    if (status === "unavailable") score -= 100;
    if (status === "confirmed") score += 8;
  }

  const maxBudget =
    filters.priceRange?.customMax ??
    (filters.priceRange?.tier === "under-50"
      ? 50
      : filters.priceRange?.tier === "50-100"
        ? 100
        : filters.priceRange?.tier === "100-250"
          ? 250
          : filters.priceRange?.tier === "250-500"
            ? 500
            : undefined);

  if (maxBudget) {
    const priceUsd = convertToCurrency(product.price, product.currency, "USD");
    if (priceUsd > maxBudget) score -= 80;
  }

  if (filters.coverageLevel && filters.coverageLevel !== "no-preference") {
    const tags = product.aestheticTags.join(" ").toLowerCase();
    const isRevealing = /sheer|cutout|body-conscious|mini|open-back|low-rise/.test(tags);
    const isModest = /tailored|outerwear|knitwear|full-coverage|layering/.test(tags);
    if (filters.coverageLevel === "covered" && isRevealing) score -= 20;
    if (filters.coverageLevel === "bold" && isRevealing) score += 15;
    if (filters.coverageLevel === "subtle" && isModest) score += 8;
  }

  if (filters.fashionCommunities?.length) {
    score += 10;
  }

  if (!filters.shippingDestination) return score;
  const d = filters.shippingDestination.toUpperCase();
  if (
    !product.shippingDestinations.some(
      (s) => s.toUpperCase() === d || s.toUpperCase().includes(d)
    )
  ) {
    score -= 30;
  }

  return score;
}

export function rankCatalogProducts(
  filters: SearchFilters,
  presentations?: string[],
  pool?: Product[]
): Product[] {
  const terms = queryTerms(filters.query);
  const catalog = verifiedPool(pool).filter((p) => !p.isReferenceExample);
  const scored = [...catalog]
    .map((product) => ({
      product,
      score: scoreProduct(product, filters, terms, presentations),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const tiers: Product[] = [];
  let i = 0;
  while (i < scored.length) {
    const score = scored[i].score;
    const tier: typeof scored = [];
    while (i < scored.length && scored[i].score === score) {
      tier.push(scored[i]);
      i++;
    }
    tiers.push(...shuffleArray(tier).map((t) => t.product));
  }

  return rotateArray(interleaveGlobalSources(tiers));
}

function productMatchesDepartment(
  product: Product,
  department?: SearchFilters["department"]
): boolean {
  if (!department || department === "all" || department === "no-preference") return true;
  return product.departmentTags.includes(department);
}

export function searchCatalog(
  filters: SearchFilters,
  presentations?: string[],
  pool?: Product[]
): Product[] {
  const catalog = verifiedPool(pool).filter((p) => !p.isReferenceExample);
  const ranked = rankCatalogProducts(filters, presentations, catalog);
  if (ranked.length > 0) return ranked;

  return rotateArray(
    interleaveGlobalSources(
      [...catalog]
        .filter(isRosterProduct)
        .sort(
          (a, b) =>
            scoreProduct(b, filters, queryTerms(filters.query), presentations) -
            scoreProduct(a, filters, queryTerms(filters.query), presentations)
        )
    )
  );
}

export interface AssembledLook {
  products: Product[];
  explanation: string;
  sourceSummary: string[];
}

/** Source diversity: independent, price alternative, accessory/footwear, geographic spread when relevant. */
export function assembleDiverseLook(
  filters: SearchFilters,
  answers?: BuildLookAnswers,
  pool?: Product[]
): AssembledLook {
  const productPool = verifiedPool(pool);
  const styleAesthetics =
    answers?.styleDirections?.flatMap((id) => STYLE_TO_AESTHETIC[id] ?? []) ?? [];
  const communityAesthetics =
    answers?.fashionCommunities?.length
      ? communitySearchAesthetics(answers.fashionCommunities)
      : [];
  const mergedAesthetics = [
    ...(filters.aesthetics ?? []),
    ...(answers?.aesthetics ?? []),
    ...styleAesthetics,
    ...communityAesthetics,
    ...(answers?.customStyleDescription ? [answers.customStyleDescription] : []),
  ];

  const presentations = answers?.clothingPresentation;

  const candidates = searchCatalog(
    {
      ...filters,
      aesthetics: mergedAesthetics.length ? mergedAesthetics : filters.aesthetics,
      fashionCommunities: filters.fashionCommunities ?? answers?.fashionCommunities,
      coverageLevel: filters.coverageLevel ?? answers?.coverageLevel,
      kawaiiIntensity: filters.kawaiiIntensity ?? answers?.kawaiiIntensity,
      city: filters.city ?? answers?.location,
      climate: filters.climate ?? answers?.climate,
      sizes: filters.sizes ?? collectSizesFromBuild(answers),
      shippingDestination: filters.shippingDestination ?? answers?.location,
    },
    presentations,
    productPool
  );

  if (candidates.length === 0) {
    return {
      products: [],
      explanation: "No matching products found across participating sources.",
      sourceSummary: [],
    };
  }

  const selected: Product[] = [];
  const usedDesigners = new Set<string>();
  const usedSources = new Set<string>();

  const rosterFirst = rotateArray(
    shuffleArray(
      [...candidates].sort((a, b) => {
        const aR = isRosterProduct(a) ? 1 : 0;
        const bR = isRosterProduct(b) ? 1 : 0;
        return bR - aR;
      })
    )
  );

  const pick = (pool: Product[], predicate?: (p: Product) => boolean) => {
    const matches = pool.filter(
      (p) =>
        (!predicate || predicate(p)) &&
        !selected.includes(p) &&
        (!p.designerId || !usedDesigners.has(p.designerId))
    );
    const item = pickRandom(matches, 7);
    if (item) {
      selected.push(item);
      if (item.designerId) usedDesigners.add(item.designerId);
      trackSource(item, usedSources);
    }
    return item;
  };

  // Core garment — roster labels first
  pick(
    rosterFirst,
    (p) => ["tops", "dresses", "sets", "bottoms"].includes(p.category)
  );

  // Footwear from discussed roster (GUAPÉ, El Dantés, etc.)
  pick(
    rosterFirst,
    (p) =>
      p.category === "shoes" &&
      Boolean(isRosterProduct(p) || p.isIndependentDesigner || p.isEmergingDesigner)
  );

  // Independent / emerging label
  pick(rosterFirst, (p) => !!(p.isIndependentDesigner || p.isEmergingDesigner));

  // Vintage or concept-store piece
  pick(
    rosterFirst,
    (p) =>
      p.condition !== "new" ||
      (p.conceptStoreId != null && PRIORITY_CONCEPT_STORE_IDS.has(p.conceptStoreId))
  );

  // City-relevant piece (HCMC, Bangkok, Seoul, etc.)
  if (filters.city || answers?.location) {
    const city = (filters.city ?? answers?.location ?? "").toLowerCase();
    pick(rosterFirst, (p) => p.designerCity?.toLowerCase().includes(city) ?? false);
  }

  // Fill remaining slots up to 5, roster-weighted, randomized
  for (const p of shuffleArray(rosterFirst)) {
    if (selected.length >= 5) break;
    if (!selected.includes(p)) pick([p]);
  }

  const cities = [...new Set(selected.map((p) => p.designerCity ?? p.retailerCity).filter(Boolean))];
  const hasVintage = selected.some((p) => p.condition !== "new");
  const hasIndependent = selected.some((p) => p.isIndependentDesigner || p.isEmergingDesigner);

  const sourceNames = selected.map(getProductSourceName);
  const explanation = [
    `Curated from ${selected.length} pieces across ${usedSources.size} source${usedSources.size === 1 ? "" : "s"}.`,
    sourceNames.length ? `Featuring: ${[...new Set(sourceNames)].slice(0, 5).join(", ")}.` : "",
    hasIndependent ? "Independent and emerging labels prioritized." : "",
    hasVintage ? "Includes vintage and archive pieces where relevant." : "",
    cities.length ? `Geographic mix: ${cities.join(", ")}.` : "",
    "Styling assembled across departments — not limited to one retailer's categories.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    products: selected,
    explanation,
    sourceSummary: [...usedSources],
  };
}

function trackSource(product: Product, set: Set<string>) {
  if (product.designerId) {
    const d = MOCK_DESIGNERS.find((x) => x.id === product.designerId);
    if (d) set.add(d.labelName);
  }
  if (product.conceptStoreId) {
    const cs = MOCK_CONCEPT_STORES.find((x) => x.id === product.conceptStoreId);
    if (cs) set.add(cs.name);
  }
  if (product.vintageSellerId) {
    const vs = MOCK_VINTAGE_SELLERS.find((x) => x.id === product.vintageSellerId);
    if (vs) set.add(vs.name);
  }
}

function collectSizesFromBuild(answers?: BuildLookAnswers): string[] | undefined {
  if (!answers?.clothingSizes) return answers?.sizes;
  const cs = answers.clothingSizes;
  const sizes: string[] = [];
  (["tops", "bottoms", "dresses", "outerwear", "bras"] as const).forEach((k) => {
    if (cs[k] && !(cs.skippedCategories ?? []).includes(k)) sizes.push(cs[k]!);
  });
  if (answers.footwear?.shoeSize) sizes.push(answers.footwear.shoeSize);
  return sizes.length ? sizes : undefined;
}

export function getConceptStoreBySlug(slug: string) {
  return MOCK_CONCEPT_STORES.find((s) => s.slug === slug) ?? null;
}

export function getConceptStoreProducts(storeId: string) {
  return MOCK_PRODUCTS.filter((p) => p.conceptStoreId === storeId);
}

export function getVintageSellerBySlug(slug: string) {
  return MOCK_VINTAGE_SELLERS.find((s) => s.slug === slug) ?? null;
}

export function getCityEdit(city: string) {
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.designerCity?.toLowerCase().includes(city.toLowerCase()) ||
      p.retailerCity?.toLowerCase().includes(city.toLowerCase())
  );
}

export function parseSearchQuery(query: string): Partial<SearchFilters> & {
  styleDirectionLabels?: string[];
} {
  const lower = query.toLowerCase();
  const universe = parseStyleUniverseQuery(query);
  const aesthetics: string[] = [...universe.aesthetics];

  if (/chic and sexy|chic.*sexy/.test(lower)) aesthetics.push("chic-and-sexy");
  if (/y2k/.test(lower)) aesthetics.push("y2k");
  if (/feminine/.test(lower)) aesthetics.push("feminine");
  if (/androgynous|feminine-androgynous/.test(lower)) aesthetics.push("androgynous");
  if (/masculine/.test(lower)) aesthetics.push("masculine");
  if (/gender.expansive|gender.neutral/.test(lower)) aesthetics.push("gender-expansive");
  if (/nightlife|night out|club|going out/.test(lower)) aesthetics.push("nightlife", "going-out");
  if (/humid|tropical|resort|heat/.test(lower)) aesthetics.push("humid", "resort-wear");
  if (/vintage|archive|resale|cavalli/.test(lower)) aesthetics.push("vintage", "archive-fashion");
  if (/independent|emerging|local label/.test(lower)) aesthetics.push("independent", "emerging");
  if (/street.?style|streetwear/.test(lower)) aesthetics.push("street-style", "elevated-streetwear");
  if (/tailor|blazer|suit/.test(lower)) aesthetics.push("tailored", "soft-tailoring");
  if (/heel|footwear|shoe|sneaker|tabi|mary jane|platform/.test(lower)) aesthetics.push("statement-footwear");
  if (/handbag|bag|accessory|jewelry|sunglasses/.test(lower)) aesthetics.push("statement-accessories");
  if (/sheer|mesh|cutout|open back|draped|low-rise|body.conscious/.test(lower)) {
    aesthetics.push("sheer-layering", "body-conscious");
  }

  let city = universe.city;
  if (!city) {
    for (const c of [
      "Ho Chi Minh City",
      "Bangkok",
      "London",
      "Paris",
      "Tokyo",
      "Seoul",
      "New York City",
      "New York",
      "Lagos",
      "Copenhagen",
      "Milan",
    ]) {
      if (lower.includes(c.toLowerCase())) {
        city = c === "New York" ? "New York City" : c;
        break;
      }
    }
  }

  const budgetMatch = lower.match(/\$(\d+)/);
  const customMax = budgetMatch ? Number(budgetMatch[1]) : undefined;

  return {
    query,
    aesthetics: aesthetics.length ? [...new Set(aesthetics)] : undefined,
    city,
    priceRange: customMax
      ? { tier: "custom", customMax, scope: "full-outfit", currency: "USD" }
      : undefined,
    includeVintage: /vintage|archive|resale|tabi|el dant/.test(lower) || undefined,
    styleDirectionLabels: universe.styleDirectionLabels.length
      ? universe.styleDirectionLabels
      : undefined,
  };
}
