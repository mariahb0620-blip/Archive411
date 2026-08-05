import type {
  CurrencyCode,
  Look,
  Lookbook,
  PriceRangeSelection,
} from "@/app/types/domain";
import { EDITORIAL_PLACEHOLDER } from "@/app/data/productImagery";

export {
  MOCK_DESIGNERS,
  MOCK_CONCEPT_STORES,
  MOCK_VINTAGE_SELLERS,
  MOCK_PRODUCTS,
  MOCK_SHOWROOMS,
} from "@/app/data/seed";

export const MOCK_DISCLAIMER =
  "Mock development data — reference examples only. Not official partnerships. Structured for production API replacement.";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  VND: "₫",
  THB: "฿",
  JPY: "¥",
  KRW: "₩",
  NGN: "₦",
  DKK: "kr",
};

export const PRICE_TIER_LABELS: Record<string, string> = {
  "under-50": "Under $50",
  "50-100": "$50–$100",
  "100-250": "$100–$250",
  "250-500": "$250–$500",
  "500-plus": "$500+",
  custom: "Custom range",
};

export const DEFAULT_PRICE_RANGE: PriceRangeSelection = {
  tier: "100-250",
  scope: "full-outfit",
  currency: "USD",
};

export const MOCK_LOOKBOOKS: Lookbook[] = [
  {
    id: "lb-01",
    title: "Global Night Edit",
    description: "Layered looks sourced across independent labels and concept stores.",
    coverImageUrl: EDITORIAL_PLACEHOLDER,
    generatedAt: "2026-02-15",
    occasion: "Evening",
    climate: "Humid",
    location: "Ho Chi Minh City",
    priceRange: DEFAULT_PRICE_RANGE,
    aestheticTags: ["chic-and-sexy", "nightlife"],
    visibility: "private",
    generationMethod: "build",
    saved: false,
    collectionIds: [],
  },
];

export const MOCK_LOOKS: Look[] = [
  {
    id: "look-01",
    lookbookId: "lb-01",
    title: "Humid Night Column",
    explanation:
      "A column silhouette blending independent Southeast Asian labels with archive accessories — calibrated to your preferred fit and presentation.",
    totalEstimatedPrice: 248,
    currency: "USD",
    colorPalette: ["#1a1a1a", "#888888", "#c9b896"],
    silhouetteTags: ["column", "body-conscious"],
    occasionTags: ["nightlife", "beach-to-night"],
    stylingExplanation:
      "Feminine-androgynous styling assembled across departments — not limited to how each retailer categorizes the garment.",
    matchExplanation:
      "Sourced from participating designers, concept stores and vintage sellers with size and shipping checks applied.",
    productIds: ["prod-bangkok-top", "prod-hcmc-heels", "prod-vintage-bag", "prod-budget-top"],
  },
];

export const INTRO_SLIDES = [
  {
    id: 1,
    headline: "Your style, translated.",
    copy: "Tell Archive411 what you are looking for, and discover complete looks based on your style, size, budget, presentation and lifestyle.",
    cta: "Next",
  },
  {
    id: 2,
    headline: "Build an archive that is yours.",
    copy: "Save personalized lookbooks, revisit past inspiration and discover independent designers from fashion communities around the world.",
    cta: "Enter Archive411",
  },
] as const;

export const DISCOVERY_MODES = [
  {
    id: "search",
    href: "/search",
    title: "Search Your Way",
    description:
      "Search across designers, concept stores, vintage sellers and retailers worldwide — not one department or one retailer.",
  },
  {
    id: "build",
    href: "/build",
    title: "Build My Look",
    description:
      "Answer a few questions and let Archive411 create a complete lookbook from global sources.",
  },
  {
    id: "surprise",
    href: "/surprise",
    title: "Surprise Me",
    description:
      "Let Archive411 choose the direction and introduce you to something unexpected.",
  },
  {
    id: "independent",
    href: "/independent",
    title: "The Independent Edit",
    description:
      "Discover independent and emerging designers shaping fashion across the world.",
  },
] as const;

/** @deprecated Build flow uses buildQuestionnaire.ts */
export const BUILD_QUESTIONS = [] as const;

export { INDEPENDENT_SECTIONS, HOMEPAGE_COLLECTIONS, FASHION_CITIES } from "@/app/data/fashionCities";
