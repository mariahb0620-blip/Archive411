export type GenerationMode = "random" | "curated";

export type BudgetTier =
  | "under-200"
  | "200-500"
  | "500-1000"
  | "1000-plus"
  | "high-low-blend"
  | "no-limit";

export interface GenerationSettings {
  mode: GenerationMode;
  categories: string[];
  aesthetic: string;
  colorPalette: string;
  bodyFocus: string;
  budget: BudgetTier;
}

export interface Garment {
  id: string;
  name: string;
  brand: string;
  price: number;
  retailer: "macys" | "luxury" | "mixed";
  imageUrl: string;
  affiliateUrl: string;
}

export interface OutfitLook {
  id: string;
  title: string;
  tagline: string;
  heroImageUrl: string;
  garments: Garment[];
  totalPrice: number;
  tier: BudgetTier;
}

export const CATEGORY_OPTIONS = [
  "workwear",
  "streetwear",
  "evening",
  "casual",
  "athleisure",
  "minimalist",
] as const;

export const AESTHETIC_OPTIONS = [
  "classic",
  "avant-garde",
  "quiet-luxury",
  "street-luxe",
  "romantic",
  "androgynous",
] as const;

export const COLOR_PALETTE_OPTIONS = [
  "monochrome",
  "earth-tones",
  "bold-contrast",
  "pastels",
  "jewel-tones",
  "neutrals",
] as const;

export const BODY_FOCUS_OPTIONS = [
  "balanced",
  "structured-shoulders",
  "defined-waist",
  "elongated-silhouette",
  "relaxed-fit",
] as const;

export const BUDGET_OPTIONS: { value: BudgetTier; label: string }[] = [
  { value: "under-200", label: "Under $200" },
  { value: "200-500", label: "$200 – $500" },
  { value: "500-1000", label: "$500 – $1,000" },
  { value: "1000-plus", label: "$1,000+" },
  { value: "high-low-blend", label: "High-Low Blend (Mixed)" },
  { value: "no-limit", label: "No Price Limit" },
];

export const DEFAULT_SETTINGS: GenerationSettings = {
  mode: "curated",
  categories: ["minimalist"],
  aesthetic: "quiet-luxury",
  colorPalette: "monochrome",
  bodyFocus: "balanced",
  budget: "high-low-blend",
};

export const SESSION_SETTINGS_KEY = "archive411-settings";
export const SESSION_PROMPT_KEY = "archive411-prompt";
