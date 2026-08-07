/** Style direction options — aesthetics and occasion dimensions can combine freely. */
export const STYLE_DIRECTION_OPTIONS = [
  { id: "y2k", label: "Y2K", category: "aesthetic" as const },
  { id: "1990s-minimalism", label: "1990s minimalism", category: "aesthetic" as const },
  { id: "1970s", label: "1970s", category: "aesthetic" as const },
  { id: "vintage", label: "Vintage", category: "aesthetic" as const },
  { id: "streetwear", label: "Streetwear", category: "aesthetic" as const },
  { id: "office-wear", label: "Office wear", category: "occasion" as const },
  { id: "business-casual", label: "Business casual", category: "occasion" as const },
  { id: "office-siren", label: "Office siren", category: "aesthetic" as const },
  { id: "evening-wear", label: "Evening wear", category: "occasion" as const },
  { id: "quiet-luxury", label: "Quiet luxury", category: "aesthetic" as const },
  { id: "old-money", label: "Old money", category: "aesthetic" as const },
  { id: "scandinavian-minimalism", label: "Scandinavian minimalism", category: "aesthetic" as const },
  { id: "japanese-minimalism", label: "Japanese minimalism", category: "aesthetic" as const },
  { id: "parisian", label: "Parisian", category: "aesthetic" as const },
  { id: "romantic", label: "Romantic", category: "aesthetic" as const },
  { id: "bohemian", label: "Bohemian", category: "aesthetic" as const },
  { id: "preppy", label: "Preppy", category: "aesthetic" as const },
  { id: "sporty", label: "Sporty", category: "aesthetic" as const },
  { id: "athleisure", label: "Athleisure", category: "aesthetic" as const },
  { id: "techwear", label: "Techwear", category: "aesthetic" as const },
  { id: "avant-garde", label: "Avant-garde", category: "aesthetic" as const },
  { id: "punk", label: "Punk", category: "aesthetic" as const },
  { id: "grunge", label: "Grunge", category: "aesthetic" as const },
  { id: "goth", label: "Goth", category: "aesthetic" as const },
  { id: "dark-academia", label: "Dark academia", category: "aesthetic" as const },
  { id: "coastal", label: "Coastal", category: "aesthetic" as const },
  { id: "resort-wear", label: "Resort wear", category: "occasion" as const },
  { id: "western", label: "Western", category: "aesthetic" as const },
  { id: "afrofuturism", label: "Afrofuturism", category: "aesthetic" as const },
  { id: "modest-fashion", label: "Modest fashion", category: "aesthetic" as const },
  { id: "gender-fluid-fashion", label: "Gender-fluid fashion", category: "aesthetic" as const },
  { id: "experimental", label: "Experimental", category: "aesthetic" as const },
  { id: "black-street-style", label: "Black street style", category: "aesthetic" as const },
  { id: "hot-girl-y2k", label: "Hot-Girl Y2K", category: "aesthetic" as const },
  { id: "black-latino-mens-street", label: "Black and Latino men's street style", category: "aesthetic" as const },
  { id: "tokyo-street", label: "Tokyo street style", category: "aesthetic" as const },
  { id: "korean-street", label: "Seoul street style", category: "aesthetic" as const },
  { id: "thai-vietnamese-street", label: "Bangkok & HCMC street style", category: "aesthetic" as const },
  { id: "alternative", label: "Alternative fashion", category: "aesthetic" as const },
  { id: "kawaii", label: "Kawaii", category: "aesthetic" as const },
  { id: "casual-everyday", label: "Casual everyday", category: "occasion" as const },
  { id: "formal", label: "Formal", category: "occasion" as const },
] as const;

export const PRESENTATION_OPTIONS = [
  "Feminine",
  "Masculine",
  "Androgynous",
  "Gender-neutral",
  "A mix",
  "No preference",
] as const;

export const SIZING_SYSTEM_OPTIONS = [
  { id: "US", label: "US" },
  { id: "UK", label: "UK" },
  { id: "EU", label: "EU" },
  { id: "letter", label: "International letter sizing" },
  { id: "custom", label: "Custom measurements" },
] as const;

export const SIZE_CATEGORY_FIELDS = [
  { key: "tops", label: "Tops", placeholder: "e.g. M, 8, EU 38" },
  { key: "bottoms", label: "Bottoms", placeholder: "e.g. 30, 10, EU 40" },
  { key: "dresses", label: "Dresses", placeholder: "e.g. S, 6, EU 36" },
  { key: "outerwear", label: "Jackets & outerwear", placeholder: "e.g. L, 12" },
  { key: "bras", label: "Bras (optional)", placeholder: "e.g. 34C" },
] as const;

export type SizeCategoryKey = (typeof SIZE_CATEGORY_FIELDS)[number]["key"];

const LETTER_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
const US_NUMERIC = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24"] as const;
const US_WAIST = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "36", "38", "40", "42"] as const;
const UK_NUMERIC = ["4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26"] as const;
const EU_NUMERIC = ["32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52"] as const;
const BRA_SIZES = [
  "30A", "30B", "30C", "30D", "32A", "32B", "32C", "32D", "32DD",
  "34A", "34B", "34C", "34D", "34DD", "34E",
  "36A", "36B", "36C", "36D", "36DD", "36E",
  "38B", "38C", "38D", "38DD", "40C", "40D", "40DD", "42C", "42D",
] as const;

/** Selectable size chips by sizing system + category — avoids free-text typos. */
export function getSizeOptionsForCategory(
  system: string | undefined,
  category: SizeCategoryKey
): readonly string[] {
  if (category === "bras") return BRA_SIZES;

  const resolved = system ?? "letter";

  if (resolved === "letter") return LETTER_SIZES;
  if (resolved === "US") {
    if (category === "bottoms") return US_WAIST;
    return US_NUMERIC;
  }
  if (resolved === "UK") return UK_NUMERIC;
  if (resolved === "EU") return EU_NUMERIC;
  return LETTER_SIZES;
}

export const SPECIAL_SIZING_OPTIONS = [
  "Petite",
  "Tall",
  "Maternity",
  "Adaptive clothing",
  "Made-to-measure",
  "Extended sizing",
] as const;

export const FOOTWEAR_INCLUSION_OPTIONS = [
  { id: "yes", label: "Yes, include shoes" },
  { id: "no", label: "No, clothing only" },
  { id: "optional", label: "Show shoes as optional additions" },
  { id: "surprise", label: "Surprise me" },
] as const;

export const SHOE_TYPE_OPTIONS = [
  "Heel",
  "Sneaker",
  "Wedge",
  "Flat",
  "Mule",
  "Boot",
  "Sandal",
  "Loafer",
  "Oxford",
  "Platform",
  "Clog",
  "Slipper",
  "Ballet flat",
  "Pump",
  "Kitten heel",
  "Ankle boot",
  "Knee-high boot",
  "Any",
] as const;

export const HEEL_HEIGHT_OPTIONS = [
  "Flat or nearly flat",
  "Low heel",
  "Mid heel",
  "High heel",
  "Any height",
] as const;

export const SHOE_FIT_OPTIONS = [
  "Wide fit",
  "Narrow fit",
  "Standard fit",
  "Extended shoe sizing",
  "Comfort priority",
  "Walking-friendly",
  "Accessibility needs",
  "Weather resistance",
  "No preference",
] as const;

export const SHOE_SIZE_SYSTEM_OPTIONS = [
  { id: "us-womens", label: "US women's sizing" },
  { id: "us-mens", label: "US men's sizing" },
  { id: "uk", label: "UK sizing" },
  { id: "eu", label: "EU sizing" },
  { id: "custom", label: "Custom measurement" },
] as const;

export const CONTEXT_STEPS = [
  {
    id: "dressingFor",
    prompt: "What are you dressing for?",
    options: ["Work", "Date night", "Travel", "Weekend", "Event", "Everyday"],
  },
  {
    id: "location",
    prompt: "Where will you be wearing this?",
    options: ["New York", "London", "Paris", "Ho Chi Minh City", "Los Angeles", "Other"],
  },
  {
    id: "climate",
    prompt: "What is the weather or season?",
    options: ["Summer", "Spring", "Autumn", "Winter", "Transitional", "Humid"],
  },
  {
    id: "priceRange",
    prompt: "What is your price range?",
    type: "price" as const,
  },
  {
    id: "colors",
    prompt: "What colors do you want to wear?",
    multi: true,
    options: ["Monochrome", "Earth tones", "Jewel tones", "Pastels", "Bold contrast", "Open to suggestion"],
  },
  {
    id: "experimentalLevel",
    prompt: "How experimental should the look feel?",
    type: "experimentalSpectrum" as const,
  },
  {
    id: "independentDesigners",
    prompt: "Would you like Archive411 to prioritize independent designers?",
    options: ["Yes", "No", "No preference"],
  },
  {
    id: "coverageLevel",
    prompt: "How revealing should the look feel?",
    options: ["Covered", "Subtle", "Balanced", "Bold", "No preference"],
  },
  {
    id: "kawaiiIntensity",
    prompt: "How far should we take this aesthetic?",
    options: ["Subtle reference", "Wearable", "Statement", "Full expression"],
  },
] as const;

export type BuildStepId =
  | "styleDirections"
  | "styleInspiration"
  | "clothingPresentation"
  | "clothingSizes"
  | "contextBrief"
  | "footwearInclusion";

const COVERAGE_MAP: Record<string, string> = {
  Covered: "covered",
  Subtle: "subtle",
  Balanced: "balanced",
  Bold: "bold",
  "No preference": "no-preference",
};

const KAWAII_MAP: Record<string, string> = {
  "Subtle reference": "subtle-reference",
  Wearable: "wearable",
  Statement: "statement",
  "Full expression": "full-expression",
};

export function getBuildSteps(_answers?: { // eslint-disable-line @typescript-eslint/no-unused-vars
  footwear?: { inclusion?: string };
  styleDirections?: string[];
  fashionCommunities?: string[];
}): BuildStepId[] {
  return [
    "styleDirections",
    "styleInspiration",
    "clothingPresentation",
    "clothingSizes",
    "contextBrief",
    "footwearInclusion",
  ];
}

export { COVERAGE_MAP, KAWAII_MAP };

export function blendStyleLabel(directions: string[], custom?: string): string {
  const labels = directions.map((id) => {
    const found = STYLE_DIRECTION_OPTIONS.find((s) => s.id === id);
    return found?.label ?? id;
  });
  if (custom?.trim()) labels.push(custom.trim());
  return labels.join(" + ") || "Editorial mix";
}
