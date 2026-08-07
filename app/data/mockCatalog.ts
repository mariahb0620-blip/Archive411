import type { PriceRangeSelection } from "@/app/types/domain";
import { CATEGORY_IMAGES, designerCoverImage } from "@/app/data/catalogImages";

export {
  MOCK_DESIGNERS,
  MOCK_CONCEPT_STORES,
  MOCK_VINTAGE_SELLERS,
  MOCK_PRODUCTS,
  MOCK_SHOWROOMS,
} from "@/app/data/seed";

export const MOCK_DISCLAIMER =
  "Mock development data — reference examples only. Not official partnerships. Structured for production API replacement.";

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
    imageUrl: CATEGORY_IMAGES.handbags,
  },
  {
    id: "build",
    href: "/build",
    title: "Build My Look",
    description:
      "Answer a few questions and let Archive411 create a complete lookbook from global sources.",
    imageUrl: CATEGORY_IMAGES.dresses,
  },
  {
    id: "surprise",
    href: "/surprise",
    title: "Surprise Me",
    description:
      "Let Archive411 choose the direction and introduce you to something unexpected.",
    imageUrl: CATEGORY_IMAGES.shoes,
  },
  {
    id: "independent",
    href: "/independent",
    title: "The Independent Edit",
    description:
      "Discover independent and emerging designers shaping fashion across the world.",
    imageUrl: designerCoverImage("linea-atelier"),
  },
] as const;

export { INDEPENDENT_SECTIONS, HOMEPAGE_COLLECTIONS, FASHION_CITIES } from "@/app/data/fashionCities";
