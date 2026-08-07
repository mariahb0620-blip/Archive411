import type { ClothingCategory, Product } from "@/app/types/domain";
import {
  CATEGORY_IMAGES,
  EDITORIAL_COVER,
  EDITORIAL_PANEL,
  productImage,
  imageFromSeed,
  entityCoverImage,
} from "@/app/data/catalogImages";

/** @deprecated use CATEGORY_IMAGES */
export const CATEGORY_PLACEHOLDER = CATEGORY_IMAGES;

export const EDITORIAL_PLACEHOLDER = EDITORIAL_COVER;
export { EDITORIAL_PANEL };

const STOCK_IMAGE_PATTERN =
  /unsplash\.com|placeholder\.com|picsum|generated|midjourney|dalle|pexels\.com|gettyimages|shutterstock/i;

export function productPlaceholder(category: ClothingCategory): string {
  return productImage(category);
}

export function isStockOrAiImageUrl(url: string): boolean {
  return STOCK_IMAGE_PATTERN.test(url);
}

/** Stable catalog image from a seed string. */
export function placeholderFromSeed(seed: string): string {
  return imageFromSeed(seed);
}

/** Strip stock/AI URLs; use local catalog assets. */
export function stripStockImageUrl(
  url: string | undefined,
  fallback: string = EDITORIAL_COVER
): string {
  if (!url || isStockOrAiImageUrl(url)) return fallback;
  if (url.endsWith(".svg") || url.includes("/placeholders/")) return fallback;
  return url;
}

export function normalizeProductImagery(product: Product): Product {
  const placeholder = productImage(product.category);
  const urls = product.imageUrls.map((url) => {
    if (isStockOrAiImageUrl(url) || url.endsWith(".svg") || url.includes("/placeholders/")) {
      return placeholder;
    }
    return url;
  });
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
  return CATEGORY_IMAGES.default;
}

export function normalizeCoverImageUrl(url?: string): string {
  return stripStockImageUrl(url, EDITORIAL_COVER);
}

export { entityCoverImage, productImage, imageFromSeed };
