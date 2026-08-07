import { isProductSpecificUrl } from "@/app/utils/productLinkQuality";
import { hasAuthorizedProductImage } from "@/lib/catalog/imagePolicy";
import type { VerificationStatus } from "@/lib/catalog/types";
import type { Product } from "@/app/types/domain";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

const BLOCKING_STATUSES: VerificationStatus[] = [
  "broken_url",
  "homepage_redirect",
  "unavailable",
  "missing_data",
  "manual_review",
  "pending",
];

/**
 * Single gate for shoppable recommendation eligibility.
 * Does NOT fall back to designer homepages.
 */
export function isRecommendationEligible(product: Product): boolean {
  return getRecommendationEligibility(product).eligible;
}

export function getRecommendationEligibility(product: Product): EligibilityResult {
  const reasons: string[] = [];

  if (product.isReferenceExample) reasons.push("reference_example");
  if (product.isPlaceholder) reasons.push("placeholder_record");

  const status = product.verificationStatus ?? inferLegacyStatus(product);
  if (status !== "verified") {
    if (BLOCKING_STATUSES.includes(status)) reasons.push(`verification_${status}`);
    else if (!status) reasons.push("verification_unknown");
    else reasons.push(`verification_${status}`);
  }

  if (!isProductSpecificUrl(product.productUrl)) {
    reasons.push("not_product_specific_url");
  }

  if (!product.designerId) reasons.push("missing_designer");
  if (!product.category) reasons.push("missing_category");
  if (!product.name?.trim()) reasons.push("missing_name");
  if (!product.price || product.price <= 0) reasons.push("missing_price");
  if (!product.currency) reasons.push("missing_currency");
  if (!product.presentationTags?.length) reasons.push("missing_presentation_tags");
  if (!product.occasionTags?.length) reasons.push("missing_occasion_tags");
  if (!product.imageUrls?.length) reasons.push("missing_image");

  if (product.inventoryStatus === "sold-out") reasons.push("sold_out");

  // Block stock/AI imagery; category placeholders allowed for beta URL-verified SKUs
  const primaryImage = product.imageUrls[0];
  if (primaryImage && /unsplash|pexels|getty|shutterstock|midjourney|dalle/i.test(primaryImage)) {
    reasons.push("stock_or_ai_image");
  }

  // Prefer authorized imagery when explicitly marked non-placeholder source required
  if (product.imageSource === "category_placeholder" && product.verificationStatus === "verified") {
    // Beta continuity: eligible with placeholder illustration, tracked separately
  } else if (product.imageSource && product.imageSource !== "category_placeholder" && !hasAuthorizedProductImage(product)) {
    reasons.push("unauthorized_image");
  }

  return { eligible: reasons.length === 0, reasons };
}

/** Infer status for legacy seed records without explicit verification_status. */
function inferLegacyStatus(product: Product): VerificationStatus {
  if (product.verified === true) return "verified";
  if (product.verified === false && product.verificationStatus) {
    return product.verificationStatus;
  }
  if (isProductSpecificUrl(product.productUrl)) return "verified";
  return "homepage_redirect";
}

export function filterRecommendationEligible(products: Product[]): Product[] {
  return products.filter(isRecommendationEligible);
}
