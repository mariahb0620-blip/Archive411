import type { PriceTier } from "@/app/types/domain";

export const PRICE_TIER_LABELS: Record<PriceTier, string> = {
  "0-200": "$0–$200",
  "200-500": "$200–$500",
  "500-plus": "$500+",
  // Legacy tiers — designer metadata and saved lookbooks
  "under-50": "$0–$200",
  "50-100": "$0–$200",
  "100-250": "$0–$200",
  "250-500": "$200–$500",
  custom: "Custom range",
};

export const USER_PRICE_TIERS: PriceTier[] = ["0-200", "200-500", "500-plus"];

export function getPriceTierBounds(tier?: PriceTier, customMax?: number): {
  min?: number;
  max?: number;
} {
  if (tier === "custom" && customMax != null) {
    return { max: customMax };
  }

  switch (tier) {
    case "0-200":
    case "under-50":
    case "50-100":
    case "100-250":
      return { max: 200 };
    case "200-500":
    case "250-500":
      return { min: 200, max: 500 };
    case "500-plus":
      return { min: 500 };
    default:
      return {};
  }
}

export function scorePriceTierMatch(priceUsd: number, tier?: PriceTier, customMax?: number): number {
  const { min, max } = getPriceTierBounds(tier, customMax);
  if (min == null && max == null) return 0;
  if (max != null && priceUsd > max) return -80;
  if (min != null && priceUsd < min) return -80;
  return 0;
}
