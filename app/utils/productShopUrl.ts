import type { Product } from "@/app/types/domain";
import {
  isInvalidProductUrl,
  isProductSpecificUrl,
} from "@/app/utils/productLinkQuality";

export function isPurchasableUrl(url: string | undefined): boolean {
  if (isInvalidProductUrl(url)) return false;
  return isProductSpecificUrl(url);
}

/** Direct SKU/product page — required for Shop now. Respects verification status. */
export function resolveProductShopUrl(product: Product): string | null {
  if (product.verificationStatus && product.verificationStatus !== "verified") {
    return null;
  }
  if (product.verified === false) return null;
  if (isPurchasableUrl(product.productUrl)) {
    return (product.affiliateUrl ?? product.productUrl).trim();
  }
  return null;
}

/** Designer site when we only have a browse/home link. */
export function resolveDesignerBrowseUrl(
  product: Product,
  designerWebsite?: string
): string | null {
  const candidates = [designerWebsite, product.productUrl].filter(Boolean) as string[];
  for (const url of candidates) {
    if (!isInvalidProductUrl(url)) return url.trim();
  }
  return null;
}
