import { STYLE_DIRECTION_OPTIONS } from "@/app/data/buildQuestionnaire";
import { STYLE_TO_AESTHETIC } from "@/app/data/curatedRoster";

/** Presentation tags used in catalog + build questionnaire. */
export const ALLOWED_PRESENTATION_TAGS = [
  "feminine",
  "masculine",
  "androgynous",
  "gender-neutral",
] as const;

/** Occasion tags aligned with catalog seed + occasionRules. */
export const ALLOWED_OCCASION_TAGS = [
  "date night",
  "date-night",
  "nightlife",
  "evening",
  "going-out",
  "everyday",
  "work",
  "events",
  "event",
  "travel",
  "weekend",
  "formal",
] as const;

export const ALLOWED_CLIMATE_TAGS = [
  "warm",
  "cold",
  "temperate",
  "transitional",
  "summer",
  "winter",
  "autumn",
  "spring",
] as const;

/** Style/aesthetic slugs from style directions + curated roster mappings. */
export const ALLOWED_STYLE_TAGS: readonly string[] = [
  ...new Set([
    ...STYLE_DIRECTION_OPTIONS.filter((o) => o.category === "aesthetic").map((o) => o.id),
    ...Object.values(STYLE_TO_AESTHETIC).flat(),
    "sculptural",
    "artisanal",
    "contemporary",
    "streetwear",
    "gender-neutral",
    "tailored",
    "nightlife",
    "body-conscious",
    "elevated-streetwear",
    "soft-tailoring",
    "archive-fashion",
    "handmade",
  ]),
];

export const ALLOWED_COLOR_TAGS = [
  "black",
  "white",
  "ivory",
  "cream",
  "beige",
  "brown",
  "tan",
  "grey",
  "gray",
  "silver",
  "gold",
  "red",
  "burgundy",
  "pink",
  "blush",
  "orange",
  "yellow",
  "green",
  "olive",
  "blue",
  "navy",
  "purple",
  "lavender",
  "multicolor",
  "neutral",
  "metallic",
  "pastel",
  "print",
  "floral",
  "animal-print",
] as const;

export type AllowedPresentation = (typeof ALLOWED_PRESENTATION_TAGS)[number];
export type AllowedOccasion = (typeof ALLOWED_OCCASION_TAGS)[number];
export type AllowedClimate = (typeof ALLOWED_CLIMATE_TAGS)[number];
export type AllowedColor = (typeof ALLOWED_COLOR_TAGS)[number];

const FORBIDDEN_ENRICHMENT_KEYS = new Set([
  "productUrl",
  "product_url",
  "url",
  "price",
  "currency",
  "imageUrl",
  "imageUrls",
  "image_url",
  "retailerName",
  "retailer",
  "inventoryStatus",
  "stock_status",
  "verificationStatus",
  "verified",
  "affiliateUrl",
  "sourceProductId",
  "id",
  "name",
]);

export function normalizeTag(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function matchesAllowlist(value: string, allowed: readonly string[]): boolean {
  const norm = normalizeTag(value);
  return allowed.some(
    (a) => norm === normalizeTag(a) || norm.includes(normalizeTag(a)) || normalizeTag(a).includes(norm)
  );
}

export function filterTagsToAllowlist(
  incoming: string[] | undefined,
  allowed: readonly string[],
  fallback: string[],
  max = 12
): string[] {
  if (!incoming?.length) return [...fallback];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of incoming) {
    if (!raw?.trim()) continue;
    const norm = normalizeTag(raw);
    if (!matchesAllowlist(norm, allowed)) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
    if (out.length >= max) break;
  }
  return out.length ? out : [...fallback];
}

/** Reject structured output that includes commerce/verification fields. */
export function assertNoForbiddenEnrichmentFields(payload: Record<string, unknown>): void {
  for (const key of Object.keys(payload)) {
    if (FORBIDDEN_ENRICHMENT_KEYS.has(key)) {
      throw new Error(`Forbidden enrichment field: ${key}`);
    }
  }
}

export const ENRICHMENT_JSON_SCHEMA = {
  name: "product_tag_enrichment",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      styleTags: {
        type: "array",
        items: { type: "string" },
        maxItems: 12,
      },
      occasionTags: {
        type: "array",
        items: { type: "string" },
        maxItems: 8,
      },
      presentationTags: {
        type: "array",
        items: { type: "string" },
        maxItems: 4,
      },
      climateTags: {
        type: "array",
        items: { type: "string" },
        maxItems: 6,
      },
      colorTags: {
        type: "array",
        items: { type: "string" },
        maxItems: 8,
      },
      stylingNotes: {
        type: "string",
        description: "Short internal styling note — not shown as product fact",
      },
    },
    required: ["styleTags", "occasionTags", "presentationTags", "climateTags", "colorTags", "stylingNotes"],
  },
} as const;
