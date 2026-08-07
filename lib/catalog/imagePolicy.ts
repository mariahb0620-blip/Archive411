import { isStockOrAiImageUrl } from "@/app/data/productImagery";
import type { ImageSource, Product } from "@/app/types/domain";
export type { ImageSource };

const CATEGORY_PLACEHOLDER_PATTERN = /\/images\/catalog\/product-/i;

export function isCategoryPlaceholderImage(url: string | undefined): boolean {
  if (!url?.trim()) return true;
  return CATEGORY_PLACEHOLDER_PATTERN.test(url);
}

export function inferImageSource(url: string | undefined): ImageSource {
  if (!url?.trim()) return "unknown";
  if (isCategoryPlaceholderImage(url)) return "category_placeholder";
  if (isStockOrAiImageUrl(url)) return "unknown";
  return "retailer";
}

/** True when image is authorized product photography (not stock/AI/category placeholder). */
export function hasAuthorizedProductImage(product: Pick<Product, "imageUrls" | "imageSource">): boolean {
  if (product.imageSource === "category_placeholder") return false;
  if (product.imageSource === "retailer" || product.imageSource === "designer" || product.imageSource === "rakuten") {
    const url = product.imageUrls[0];
    return Boolean(url && !isStockOrAiImageUrl(url) && !isCategoryPlaceholderImage(url));
  }
  const url = product.imageUrls[0];
  if (!url || isStockOrAiImageUrl(url) || isCategoryPlaceholderImage(url)) return false;
  return true;
}

export function isDisplayableProductImage(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  if (isStockOrAiImageUrl(url)) return false;
  return true;
}
