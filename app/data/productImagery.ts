import type { ClothingCategory, Product } from "@/app/types/domain";

/** Product-only placeholders — no models, no AI/stock imagery. Replace with retailer URLs when feeds connect. */
export const CATEGORY_PLACEHOLDER: Record<ClothingCategory | "default", string> = {
  tops: "/placeholders/product-tops.svg",
  bottoms: "/placeholders/product-bottoms.svg",
  dresses: "/placeholders/product-dresses.svg",
  jumpsuits: "/placeholders/product-dresses.svg",
  sets: "/placeholders/product-dresses.svg",
  outerwear: "/placeholders/product-outerwear.svg",
  knitwear: "/placeholders/product-tops.svg",
  swimwear: "/placeholders/product-dresses.svg",
  shoes: "/placeholders/product-shoes.svg",
  handbags: "/placeholders/product-handbags.svg",
  jewelry: "/placeholders/product-jewelry.svg",
  belts: "/placeholders/product-accessories.svg",
  hosiery: "/placeholders/product-accessories.svg",
  sunglasses: "/placeholders/product-accessories.svg",
  hats: "/placeholders/product-accessories.svg",
  accessories: "/placeholders/product-accessories.svg",
  default: "/placeholders/product-default.svg",
};

export const EDITORIAL_PLACEHOLDER = "/placeholders/editorial-cover.svg";
export const EDITORIAL_PANEL = "/placeholders/editorial-panel.svg";

const PRODUCT_PLACEHOLDER_CYCLE = [
  CATEGORY_PLACEHOLDER.tops,
  CATEGORY_PLACEHOLDER.bottoms,
  CATEGORY_PLACEHOLDER.dresses,
  CATEGORY_PLACEHOLDER.outerwear,
  CATEGORY_PLACEHOLDER.shoes,
  CATEGORY_PLACEHOLDER.handbags,
  CATEGORY_PLACEHOLDER.jewelry,
  CATEGORY_PLACEHOLDER.accessories,
] as const;

const STOCK_IMAGE_PATTERN =
  /unsplash\.com|placeholder\.com|picsum|generated|midjourney|dalle|pexels\.com|gettyimages|shutterstock/i;

export function productPlaceholder(category: ClothingCategory): string {
  return CATEGORY_PLACEHOLDER[category] ?? CATEGORY_PLACEHOLDER.default;
}

export function isStockOrAiImageUrl(url: string): boolean {
  return STOCK_IMAGE_PATTERN.test(url);
}

/** Stable non-stock image from a seed string (replaces Unsplash helpers). */
export function placeholderFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PRODUCT_PLACEHOLDER_CYCLE[hash % PRODUCT_PLACEHOLDER_CYCLE.length];
}

/** Strip stock/AI URLs; keep only local or verified retailer URLs. */
export function stripStockImageUrl(
  url: string | undefined,
  fallback: string = EDITORIAL_PLACEHOLDER
): string {
  if (!url || isStockOrAiImageUrl(url)) return fallback;
  return url;
}

/** Strip stock-model Unsplash URLs; use category placeholders until retailer feeds connect. */
export function normalizeProductImagery(product: Product): Product {
  const placeholder = productPlaceholder(product.category);
  const urls = product.imageUrls.map((url) =>
    isStockOrAiImageUrl(url) ? placeholder : url
  );
  return {
    ...product,
    imageUrls: urls.length ? urls : [placeholder],
  };
}

export function coverFromProducts(productIds: string[], products: Product[]): string {
  for (const id of productIds) {
    const p = products.find((x) => x.id === id);
    if (p?.imageUrls[0]) return p.imageUrls[0];
  }
  return CATEGORY_PLACEHOLDER.default;
}

/** Entity covers (designers, showrooms, lookbooks) — no lifestyle/model stock art. */
export function normalizeCoverImageUrl(url?: string): string {
  return stripStockImageUrl(url, EDITORIAL_PLACEHOLDER);
}
