/** Catalog pipeline types — verification, ingestion, providers. */

export type VerificationStatus =
  | "pending"
  | "verified"
  | "unavailable"
  | "broken_url"
  | "homepage_redirect"
  | "missing_data"
  | "manual_review";

export type ProductSourceType =
  | "manual"
  | "curated"
  | "rakuten"
  | "retailer_feed"
  | "shopify";

export type ImageSource =
  | "retailer"
  | "designer"
  | "rakuten"
  | "category_placeholder"
  | "unknown";

export type AffiliateNetwork = "rakuten" | "impact" | "direct" | "none";

export interface ProductVerificationResult {
  verificationStatus: VerificationStatus;
  verified: boolean;
  verificationMethod: string;
  issues: string[];
  finalUrl?: string;
  httpStatus?: number;
  extractedImageUrl?: string;
  extractedTitle?: string;
}

export interface ImportProductRecord {
  id?: string;
  designerId?: string;
  designer?: string;
  designerSlug?: string;
  productName: string;
  productUrl: string;
  sourceUrl?: string;
  sourceType?: ProductSourceType;
  sourceProductId?: string;
  retailerName?: string;
  imageUrl?: string;
  imageSource?: ImageSource;
  price: number;
  currency: string;
  category: string;
  subcategory?: string;
  availableSizes?: string[];
  presentationTags?: string[];
  styleTags?: string[];
  occasionTags?: string[];
  climateTags?: string[];
  seasonTags?: string[];
  colorTags?: string[];
  aestheticTags?: string[];
  departmentTags?: string[];
  footwearType?: string;
  heelHeight?: string;
  inventoryStatus?: string;
  affiliateUrl?: string;
  affiliateNetwork?: AffiliateNetwork;
}

export interface ImportSummary {
  added: number;
  updated: number;
  verified: number;
  rejected: number;
  needsManualReview: number;
  errors: string[];
}
