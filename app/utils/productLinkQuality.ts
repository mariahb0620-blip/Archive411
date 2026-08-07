export type ProductLinkTier = "product" | "collection" | "homepage" | "invalid";

const INVALID_URL_PATTERNS = [/example\.com/i, /^#$/, /^$/];

/** Paths that are browse pages, not a specific SKU. */
const GENERIC_PATH_PATTERNS = [
  /^\/$/,
  /^\/collections\/?$/i,
  /^\/collections\/all\/?$/i,
  /^\/collections\/shopping\/?$/i,
  /^\/collections\/accessories\/?$/i,
  /^\/c\/[^/]+\/?$/i, // Salomon category pages e.g. /c/footwear
  /^\/shop\/?$/i,
  /^\/store\/?$/i,
];

/** Paths that usually indicate a specific product page. */
const PRODUCT_PATH_PATTERNS = [
  /\/products\/[^/?#]+/i,
  /\/product\/[^/?#]+/i, // Salomon /en-us/product/xt-6-...
];

export function isInvalidProductUrl(url: string | undefined): boolean {
  if (!url?.trim()) return true;
  return INVALID_URL_PATTERNS.some((pattern) => pattern.test(url.trim()));
}

export function classifyProductUrl(url: string | undefined): ProductLinkTier {
  if (isInvalidProductUrl(url)) return "invalid";

  try {
    const parsed = new URL(url!.trim());
    const path = parsed.pathname.replace(/\/+$/, "") || "/";

    if (PRODUCT_PATH_PATTERNS.some((pattern) => pattern.test(path))) {
      return "product";
    }
    if (GENERIC_PATH_PATTERNS.some((pattern) => pattern.test(path))) {
      return path === "/" ? "homepage" : "collection";
    }
    if (path === "/" || path.split("/").filter(Boolean).length <= 1) {
      return "homepage";
    }
    if (/\/collections\/[^/]+/i.test(path)) {
      return "collection";
    }
    return "collection";
  } catch {
    return "invalid";
  }
}

export function isProductSpecificUrl(url: string | undefined): boolean {
  return classifyProductUrl(url) === "product";
}

export function isBrowseOnlyUrl(url: string | undefined): boolean {
  const tier = classifyProductUrl(url);
  return tier === "homepage" || tier === "collection";
}
