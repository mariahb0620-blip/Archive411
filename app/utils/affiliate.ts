import type { Garment } from "@/app/types/styling";

const RAKUTEN_BASE =
  process.env.NEXT_PUBLIC_RAKUTEN_REDIRECT ??
  "https://click.linksynergy.com/fs-bin/click";

const IMPACT_BASE =
  process.env.NEXT_PUBLIC_IMPACT_REDIRECT ??
  "https://your-impact-tracking-url.com";

export function buildAffiliateRedirect(garment: Garment): string {
  const baseUrl =
    garment.retailer === "luxury" ? IMPACT_BASE : RAKUTEN_BASE;

  const params = new URLSearchParams({
    id: garment.id,
    url: garment.affiliateUrl,
    retailer: garment.retailer,
    sku: garment.id,
  });

  return `${baseUrl}?${params.toString()}`;
}

export function trackProductClick(garmentId: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("archive411:product-click", {
        detail: { garmentId, timestamp: Date.now() },
      })
    );
  }
}

export function openAffiliateLink(garment: Garment): void {
  trackProductClick(garment.id);
  const url = buildAffiliateRedirect(garment);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getRetailerLabel(retailer: Garment["retailer"]): string {
  switch (retailer) {
    case "macys":
      return "Shop at Macy's";
    case "luxury":
      return "Shop Luxury";
    case "mixed":
      return "Shop Now";
  }
}
