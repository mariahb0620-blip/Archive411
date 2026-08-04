import type {
  IntelligenceGarment,
  TrackingNetwork,
} from "@/app/types/fashionIntelligence";

const RAKUTEN_BASE =
  process.env.NEXT_PUBLIC_RAKUTEN_REDIRECT ??
  "https://click.linksynergy.com/fs-bin/click";

const IMPACT_BASE =
  process.env.NEXT_PUBLIC_IMPACT_REDIRECT ??
  "https://your-impact-tracking-url.com";

export function formatIntelligencePrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function sumGarmentPrices(garments: IntelligenceGarment[]): number {
  return garments.reduce((acc, g) => acc + g.price, 0);
}

export function buildTrackingUrl(garment: IntelligenceGarment): string {
  const base =
    garment.trackingNetwork === "impact" ? IMPACT_BASE : RAKUTEN_BASE;

  const params = new URLSearchParams({
    id: garment.id,
    sku: garment.id,
    subid: "archive411",
    url: garment.affiliateUrl,
    retailer: garment.retailer,
  });

  return `${base}?${params.toString()}`;
}

export function openTrackedLink(garment: IntelligenceGarment): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("archive411:product-click", {
        detail: { garmentId: garment.id, network: garment.trackingNetwork },
      })
    );
  }
  window.open(buildTrackingUrl(garment), "_blank", "noopener,noreferrer");
}

export function shopLabel(garment: IntelligenceGarment): string {
  if (garment.retailer === "macys") {
    return garment.trackingNetwork === "rakuten"
      ? "Track via Rakuten"
      : "Shop Macy's";
  }
  return garment.trackingNetwork === "impact"
    ? "Track via Impact"
    : "Shop Luxury";
}

export function trackingLabel(network: TrackingNetwork): string {
  return network === "rakuten" ? "Rakuten" : "Impact.com";
}
