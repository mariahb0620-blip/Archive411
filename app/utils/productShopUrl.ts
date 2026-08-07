import type { Product } from "@/app/types/domain";

const INVALID_URL_PATTERNS = [/example\.com/i, /^#$/, /^$/];

export function isPurchasableUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  return !INVALID_URL_PATTERNS.some((pattern) => pattern.test(url.trim()));
}

export function resolveProductShopUrl(
  product: Product,
  designerWebsite?: string
): string | null {
  if (isPurchasableUrl(product.productUrl)) return product.productUrl.trim();
  if (isPurchasableUrl(designerWebsite)) return designerWebsite!.trim();
  return null;
}
