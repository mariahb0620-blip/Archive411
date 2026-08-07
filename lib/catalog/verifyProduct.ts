import {
  classifyProductUrl,
  isInvalidProductUrl,
  isProductSpecificUrl,
} from "@/app/utils/productLinkQuality";
import { hasAuthorizedProductImage, inferImageSource } from "@/lib/catalog/imagePolicy";
import type { ProductVerificationResult } from "@/lib/catalog/types";
import type { Product } from "@/app/types/domain";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;

const UNAVAILABLE_PATTERNS = [
  /sold\s*out/i,
  /out\s*of\s*stock/i,
  /no longer available/i,
  /product not found/i,
  /404/i,
];

export interface VerifyProductOptions {
  /** Skip live HTTP fetch (static checks only). */
  skipFetch?: boolean;
  requirePrice?: boolean;
  requireImage?: boolean;
}

function extractMeta(html: string, property: string): string | undefined {
  const og = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  ).exec(html);
  if (og?.[1]) return og[1].trim();
  const name = new RegExp(
    `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  ).exec(html);
  return name?.[1]?.trim();
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
}

function nameConsistency(productName: string, pageTitle?: string): boolean {
  if (!pageTitle) return true;
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  const productWords = normalize(productName);
  const titleWords = new Set(normalize(pageTitle));
  if (!productWords.length) return true;
  const overlap = productWords.filter((w) => titleWords.has(w)).length;
  return overlap >= Math.min(2, productWords.length) || overlap / productWords.length >= 0.4;
}

async function fetchProductPage(url: string): Promise<{
  ok: boolean;
  status: number;
  finalUrl: string;
  html: string;
}> {
  let current = url;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const res = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": "Archive411-CatalogBot/1.0" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        return { ok: false, status: res.status, finalUrl: current, html: "" };
      }
      current = new URL(location, current).href;
      continue;
    }

    const html = res.ok ? await res.text() : "";
    return { ok: res.ok, status: res.status, finalUrl: current, html };
  }
  return { ok: false, status: 0, finalUrl: current, html: "" };
}

/** Static verification without network — used for seed/import preview. */
export function verifyProductStatic(
  product: Pick<
    Product,
    | "id"
    | "name"
    | "productUrl"
    | "price"
    | "currency"
    | "category"
    | "designerId"
    | "imageUrls"
    | "presentationTags"
    | "occasionTags"
    | "inventoryStatus"
    | "imageSource"
  >
): ProductVerificationResult {
  const issues: string[] = [];

  if (!product.name?.trim()) issues.push("missing_name");
  if (!product.category) issues.push("missing_category");
  if (!product.designerId) issues.push("missing_designer");
  if (!product.price || product.price <= 0) issues.push("missing_price");
  if (!product.currency) issues.push("missing_currency");
  if (!product.presentationTags?.length) issues.push("missing_presentation_tags");
  if (!product.occasionTags?.length) issues.push("missing_occasion_tags");

  const url = product.productUrl?.trim() ?? "";
  if (isInvalidProductUrl(url)) {
    return {
      verificationStatus: "broken_url",
      verified: false,
      verificationMethod: "static",
      issues: [...issues, "invalid_url"],
    };
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    issues.push("non_https");
  }

  const tier = classifyProductUrl(url);
  if (tier === "homepage") {
    return {
      verificationStatus: "homepage_redirect",
      verified: false,
      verificationMethod: "static",
      issues: [...issues, "homepage_url"],
      finalUrl: url,
    };
  }
  if (tier === "collection" || tier === "invalid") {
    return {
      verificationStatus: tier === "invalid" ? "broken_url" : "homepage_redirect",
      verified: false,
      verificationMethod: "static",
      issues: [...issues, `url_tier_${tier}`],
      finalUrl: url,
    };
  }

  if (product.inventoryStatus === "sold-out") {
    return {
      verificationStatus: "unavailable",
      verified: false,
      verificationMethod: "static",
      issues: [...issues, "sold_out"],
      finalUrl: url,
    };
  }

  if (!hasAuthorizedProductImage(product)) {
    issues.push("placeholder_image");
  }

  if (issues.some((i) => i.startsWith("missing_"))) {
    return {
      verificationStatus: "missing_data",
      verified: false,
      verificationMethod: "static",
      issues,
      finalUrl: url,
    };
  }

  return {
    verificationStatus: "verified",
    verified: true,
    verificationMethod: "static",
    issues,
    finalUrl: url,
  };
}

/** Full verification including optional live URL check. OpenAI is NOT used. */
export async function verifyProduct(
  product: Pick<
    Product,
    | "id"
    | "name"
    | "productUrl"
    | "price"
    | "currency"
    | "category"
    | "designerId"
    | "imageUrls"
    | "presentationTags"
    | "occasionTags"
    | "inventoryStatus"
    | "imageSource"
  >,
  options: VerifyProductOptions = {}
): Promise<ProductVerificationResult> {
  const staticResult = verifyProductStatic(product);
  if (staticResult.verificationStatus !== "verified" && staticResult.verificationStatus !== "missing_data") {
    return staticResult;
  }

  if (options.skipFetch) {
    return staticResult.verificationStatus === "verified"
      ? staticResult
      : { ...staticResult, verificationMethod: "static_no_fetch" };
  }

  const issues = [...staticResult.issues];
  let extractedImageUrl: string | undefined;
  let extractedTitle: string | undefined;

  try {
    const { ok, status, finalUrl, html } = await fetchProductPage(product.productUrl);

    if (!ok) {
      return {
        verificationStatus: status === 404 ? "broken_url" : "unavailable",
        verified: false,
        verificationMethod: "http_fetch",
        issues: [...issues, `http_${status || "error"}`],
        finalUrl,
        httpStatus: status,
      };
    }

    const finalTier = classifyProductUrl(finalUrl);
    if (!isProductSpecificUrl(finalUrl) && finalTier !== "product") {
      return {
        verificationStatus: "homepage_redirect",
        verified: false,
        verificationMethod: "http_fetch",
        issues: [...issues, "redirect_to_non_product"],
        finalUrl,
        httpStatus: status,
      };
    }

    extractedTitle = extractTitle(html);
    extractedImageUrl =
      extractMeta(html, "og:image") ?? extractMeta(html, "twitter:image");

    if (UNAVAILABLE_PATTERNS.some((p) => p.test(html.slice(0, 8000)))) {
      return {
        verificationStatus: "unavailable",
        verified: false,
        verificationMethod: "http_fetch",
        issues: [...issues, "page_indicates_unavailable"],
        finalUrl,
        httpStatus: status,
        extractedImageUrl,
        extractedTitle,
      };
    }

    if (!nameConsistency(product.name, extractedTitle)) {
      issues.push("name_title_mismatch");
    }

    const hasImage =
      hasAuthorizedProductImage(product) ||
      Boolean(extractedImageUrl && !extractedImageUrl.includes("placeholder"));
    if (options.requireImage && !hasImage) {
      return {
        verificationStatus: "manual_review",
        verified: false,
        verificationMethod: "http_fetch",
        issues: [...issues, "no_product_image"],
        finalUrl,
        httpStatus: status,
        extractedImageUrl,
        extractedTitle,
      };
    }

    const blocking = issues.filter(
      (i) => i.startsWith("missing_") || i === "invalid_url" || i === "sold_out"
    );
    if (blocking.length) {
      return {
        verificationStatus: "missing_data",
        verified: false,
        verificationMethod: "http_fetch",
        issues,
        finalUrl,
        httpStatus: status,
        extractedImageUrl,
        extractedTitle,
      };
    }

    return {
      verificationStatus: issues.includes("placeholder_image") ? "verified" : "verified",
      verified: true,
      verificationMethod: "http_fetch",
      issues,
      finalUrl,
      httpStatus: status,
      extractedImageUrl,
      extractedTitle,
    };
  } catch {
    return {
      verificationStatus: staticResult.verified ? "verified" : staticResult.verificationStatus,
      verified: staticResult.verified,
      verificationMethod: "http_fetch_failed_fallback_static",
      issues: [...issues, "fetch_error"],
    };
  }
}

/** Apply verification result fields onto a product record. */
export function applyVerificationToProduct(
  product: Product,
  result: ProductVerificationResult
): Product {
  const now = new Date().toISOString();
  const imageUrls =
    result.extractedImageUrl && !product.imageUrls.some((u) => u === result.extractedImageUrl)
      ? [result.extractedImageUrl, ...product.imageUrls]
      : product.imageUrls;

  return {
    ...product,
    productUrl: result.finalUrl ?? product.productUrl,
    imageUrls,
    imageSource: result.extractedImageUrl
      ? inferImageSource(result.extractedImageUrl)
      : product.imageSource ?? inferImageSource(product.imageUrls[0]),
    verified: result.verified,
    verificationStatus: result.verificationStatus,
    verifiedAt: result.verified ? now : product.verifiedAt,
    lastCheckedAt: now,
    lastVerifiedAt: result.verified ? now : product.lastVerifiedAt,
    verificationMethod: result.verificationMethod,
    updatedAt: now,
  };
}
