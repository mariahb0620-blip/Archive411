import type { Product } from "@/app/types/domain";

export type OccasionKey =
  | "date-night"
  | "event"
  | "work"
  | "everyday"
  | "weekend"
  | "travel";

const OCCASION_LOOK_IDS: Record<OccasionKey, readonly string[]> = {
  "date-night": ["nightlife", "polished", "independent"],
  event: ["polished", "nightlife", "independent"],
  work: ["polished", "everyday", "independent"],
  everyday: ["everyday", "polished", "independent"],
  weekend: ["street-style", "polished", "independent"],
  travel: ["everyday", "polished", "street-style"],
};

/** Subcategories excluded for each occasion (e.g. no sneakers on date night). */
const EXCLUDED_SHOE_SUBCATEGORIES: Partial<Record<OccasionKey, readonly string[]>> = {
  "date-night": ["sneaker"],
  event: ["sneaker"],
  work: ["sneaker"],
};

/** Prefer these subcategories when picking footwear for an occasion. */
const PREFERRED_SHOE_SUBCATEGORIES: Partial<Record<OccasionKey, readonly string[]>> = {
  "date-night": ["heel", "pump", "mule", "boot", "wedge", "ankle-boot", "kitten-heel"],
  event: ["heel", "pump", "mule", "boot", "wedge"],
  work: ["flat", "loafer", "oxford", "boot", "mule", "ballet-flat"],
  everyday: ["sneaker", "flat", "loafer", "boot", "mule"],
  weekend: ["sneaker", "flat", "boot", "mule", "heel", "loafer"],
  travel: ["sneaker", "flat", "loafer", "boot"],
};

const USER_SHOE_TYPE_TO_SUBCATEGORIES: Record<string, readonly string[]> = {
  heel: ["heel", "pump", "kitten-heel", "wedge"],
  sneaker: ["sneaker"],
  wedge: ["wedge"],
  flat: ["flat", "ballet-flat"],
  mule: ["mule"],
  boot: ["boot", "ankle-boot", "knee-high-boot"],
  sandal: ["sandal"],
  loafer: ["loafer", "oxford"],
  oxford: ["oxford", "loafer"],
  platform: ["platform"],
  clog: ["clog"],
  slipper: ["slipper"],
  "ballet flat": ["ballet-flat", "flat"],
  pump: ["pump", "heel"],
  "kitten heel": ["kitten-heel", "heel"],
  "ankle boot": ["ankle-boot", "boot"],
  "knee-high boot": ["knee-high-boot", "boot"],
};

const GOING_OUT_OCCASION_TAGS = [
  "evening",
  "event",
  "going-out",
  "nightlife",
  "date-night",
  "date",
];

const CASUAL_OCCASION_TAGS = ["everyday", "travel", "weekend", "work"];

export function normalizeOccasionKey(dressingFor?: string): OccasionKey | null {
  if (!dressingFor?.trim()) return null;
  const value = dressingFor.trim().toLowerCase();
  if (value.includes("date") || value === "date night") return "date-night";
  if (value.includes("night") && !value.includes("every")) return "date-night";
  if (value === "event") return "event";
  if (value === "work") return "work";
  if (value === "everyday") return "everyday";
  if (value === "weekend") return "weekend";
  if (value === "travel") return "travel";
  return null;
}

export function lookIdsForOccasion(dressingFor?: string): readonly string[] | null {
  const key = normalizeOccasionKey(dressingFor);
  if (!key) return null;
  return OCCASION_LOOK_IDS[key];
}

function shoeSubcategory(product: Product): string {
  return (product.subcategory ?? "").toLowerCase();
}

function productHaystack(product: Product): string {
  return [
    product.subcategory ?? "",
    product.name,
    ...product.aestheticTags,
    ...product.occasionTags,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesUserFootwearTypes(product: Product, footwearTypes?: string[]): boolean {
  const types = (footwearTypes ?? []).filter((t) => t && t !== "Any");
  if (!types.length) return true;

  const sub = shoeSubcategory(product);
  const haystack = productHaystack(product);

  return types.some((type) => {
    const mapped = USER_SHOE_TYPE_TO_SUBCATEGORIES[type.toLowerCase()] ?? [type.toLowerCase()];
    return mapped.some(
      (token) =>
        sub.includes(token.replace(/\s+/g, "-")) ||
        haystack.includes(token.replace(/\s+/g, "-")) ||
        haystack.includes(token)
    );
  });
}

function isExcludedShoeForOccasion(product: Product, occasion: OccasionKey): boolean {
  const sub = shoeSubcategory(product);
  const excluded = EXCLUDED_SHOE_SUBCATEGORIES[occasion] ?? [];
  if (excluded.some((token) => sub.includes(token))) return true;

  if (occasion === "date-night" || occasion === "event") {
    const tags = product.occasionTags.map((t) => t.toLowerCase());
    const hasGoingOut = tags.some((t) =>
      GOING_OUT_OCCASION_TAGS.some((g) => t.includes(g.replace(/-/g, "")) || t.includes(g))
    );
    const isCasualOnly =
      tags.length > 0 &&
      tags.every((t) => CASUAL_OCCASION_TAGS.some((c) => t.includes(c))) &&
      (sub.includes("sneaker") || product.aestheticTags.some((a) => /streetwear|sporty|techwear/i.test(a)));

    if (isCasualOnly && !hasGoingOut) return true;
  }

  return false;
}

function isPreferredShoeForOccasion(product: Product, occasion: OccasionKey): boolean {
  const preferred = PREFERRED_SHOE_SUBCATEGORIES[occasion];
  if (!preferred?.length) return true;

  const sub = shoeSubcategory(product);
  const haystack = productHaystack(product);
  return preferred.some(
    (token) => sub.includes(token) || haystack.includes(token.replace(/-/g, " "))
  );
}

export function shoeMatchesOccasion(
  product: Product,
  dressingFor?: string,
  footwearTypes?: string[]
): boolean {
  if (product.category !== "shoes") return true;

  if (!matchesUserFootwearTypes(product, footwearTypes)) return false;

  const occasion = normalizeOccasionKey(dressingFor);
  if (!occasion) return true;

  if (isExcludedShoeForOccasion(product, occasion)) return false;

  return isPreferredShoeForOccasion(product, occasion);
}

/** Strict first, then allow any non-excluded shoe so small catalogs still assemble. */
export function shoeMatchTier(
  product: Product,
  dressingFor?: string,
  footwearTypes?: string[]
): "strict" | "relaxed" | "none" {
  if (product.category !== "shoes") return "none";
  if (shoeMatchesOccasion(product, dressingFor, footwearTypes)) return "strict";

  const occasion = normalizeOccasionKey(dressingFor);
  if (occasion && isExcludedShoeForOccasion(product, occasion)) return "none";

  if (matchesUserFootwearTypes(product, footwearTypes)) return "relaxed";
  return "none";
}

export function pickShoePredicate(
  dressingFor?: string,
  footwearTypes?: string[],
  tier: "strict" | "relaxed" = "strict"
) {
  return (product: Product) => {
    if (product.category !== "shoes") return false;
    const matchTier = shoeMatchTier(product, dressingFor, footwearTypes);
    if (tier === "strict") return matchTier === "strict";
    return matchTier === "strict" || matchTier === "relaxed";
  };
}

function isAthleticProduct(product: Product): boolean {
  const aesthetics = product.aestheticTags.join(" ").toLowerCase();
  const name = product.name.toLowerCase();
  return (
    /techwear|sporty|athletic|technical|running|outdoor|hiking|performance/.test(aesthetics) ||
    /technical|shell jacket|trail|running|gore-tex|workout|performance/.test(name)
  );
}

function wantsFemininePresentation(presentations?: string[]): boolean {
  return Boolean(
    presentations?.some((p) => /feminine/i.test(p)) &&
      !presentations.some((p) => /masculine|androgynous|gender-neutral/i.test(p))
  );
}

/** Score how well a product fits the user's occasion (all categories). */
export function scoreOccasionMatch(
  product: Product,
  dressingFor?: string,
  presentations?: string[]
): number {
  const occasion = normalizeOccasionKey(dressingFor);
  if (!occasion) return 0;

  const tags = product.occasionTags.map((t) => t.toLowerCase());
  const hasGoingOut = tags.some((t) =>
    GOING_OUT_OCCASION_TAGS.some((g) => t.includes(g.replace(/-/g, "")) || t.includes(g))
  );
  const hasCasualOnly =
    tags.length > 0 &&
    tags.every((t) => CASUAL_OCCASION_TAGS.some((c) => t.includes(c)));
  const athletic = isAthleticProduct(product);
  const feminine = wantsFemininePresentation(presentations);

  if (occasion === "date-night" || occasion === "event") {
    if (athletic && !hasGoingOut) return -120;
    if (hasGoingOut) return 35;
    if (tags.some((t) => /evening|event|nightlife/.test(t))) return 25;
    if (hasCasualOnly && !hasGoingOut) return -50;
    if (feminine && athletic) return -100;
    return 0;
  }

  if (occasion === "work") {
    if (athletic) return -90;
    if (tags.some((t) => /work|office/.test(t))) return 20;
    if (hasGoingOut && !tags.some((t) => /work/.test(t))) return -25;
    return 0;
  }

  if (occasion === "weekend") {
    if (feminine && athletic && product.category === "outerwear") return -80;
    if (athletic && hasCasualOnly && !hasGoingOut) return -30;
    if (tags.some((t) => /weekend|everyday/.test(t))) return 10;
    return 0;
  }

  if (occasion === "travel") {
    if (athletic) return 15;
    if (tags.some((t) => /travel/.test(t))) return 20;
    return 0;
  }

  if (occasion === "everyday") {
    if (tags.some((t) => /everyday|weekend/.test(t))) return 15;
    return 0;
  }

  return 0;
}

export function occasionMatchTier(
  product: Product,
  dressingFor?: string,
  presentations?: string[]
): "strict" | "relaxed" | "none" {
  if (product.category === "shoes") return "none";
  const score = scoreOccasionMatch(product, dressingFor, presentations);
  if (score >= 0) return "strict";
  if (score > -100) return "relaxed";
  return "none";
}

export function isOccasionAppropriate(
  product: Product,
  dressingFor?: string,
  presentations?: string[],
  tier: "strict" | "relaxed" = "strict"
): boolean {
  if (product.category === "shoes") {
    const shoeTier = shoeMatchTier(product, dressingFor, undefined);
    if (tier === "strict") return shoeTier === "strict";
    return shoeTier === "strict" || shoeTier === "relaxed";
  }

  const matchTier = occasionMatchTier(product, dressingFor, presentations);
  if (tier === "strict") return matchTier === "strict";
  return matchTier === "strict" || matchTier === "relaxed";
}
