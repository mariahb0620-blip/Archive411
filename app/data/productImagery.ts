import type { ClothingCategory, Product } from "@/app/types/domain";

/** Product-only placeholders — no models, no AI imagery. Replace with retailer URLs in production. */
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

export function productPlaceholder(category: ClothingCategory): string {
  return CATEGORY_PLACEHOLDER[category] ?? CATEGORY_PLACEHOLDER.default;
}

/** Strip stock-model Unsplash URLs; use category placeholders until retailer feeds connect. */
export function normalizeProductImagery(product: Product): Product {
  const placeholder = productPlaceholder(product.category);
  const urls = product.imageUrls.map((url) =>
    /unsplash\.com|placeholder\.com|picsum|generated|midjourney|dalle/i.test(url)
      ? placeholder
      : url
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

const STOCK_IMAGE_PATTERN =
  /unsplash\.com|placeholder\.com|picsum|generated|midjourney|dalle/i;

export function isStockOrAiImageUrl(url: string): boolean {
  return STOCK_IMAGE_PATTERN.test(url);
}

/** Entity covers (designers, showrooms) — no lifestyle/model stock art. */
export function normalizeCoverImageUrl(url?: string): string {
  if (!url || isStockOrAiImageUrl(url)) return CATEGORY_PLACEHOLDER.default;
  return url;
}
