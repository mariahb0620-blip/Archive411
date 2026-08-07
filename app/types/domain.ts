/** Archive411 domain models — structured for future database/API replacement. */

export type CurrencyCode = "USD" | "GBP" | "EUR" | "VND" | "THB" | "JPY" | "KRW" | "NGN" | "DKK";

export type BudgetScope = "single-item" | "full-outfit" | "either";

export type PriceTier =
  | "0-200"
  | "200-500"
  | "500-plus"
  | "under-50"
  | "50-100"
  | "100-250"
  | "250-500"
  | "custom";

export type GenerationMethod =
  | "search"
  | "build"
  | "surprise"
  | "independent";

export type VisibilityStatus = "private" | "public" | "unlisted";

export type DesignerApplicationStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected";

export type WebsiteConnectionType =
  | "shopify"
  | "squarespace"
  | "woocommerce"
  | "bigcommerce"
  | "csv"
  | "manual"
  | "api"
  | "none";

export type AuthProvider = "email" | "google" | "guest";

export type OnboardingStatus = "pending" | "intro-complete" | "complete";

export interface PriceRangeSelection {
  tier: PriceTier;
  customMin?: number;
  customMax?: number;
  scope: BudgetScope;
  currency: CurrencyCode;
}

export interface UserPreferences {
  sizes: string[];
  aesthetics: string[];
  presentationPreference?: string;
  silhouettePreferences: string[];
  colorPreferences: string[];
  budgetPreference?: PriceRangeSelection;
  independentDesignersOnly: boolean;
  accessibilityNotes?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  location?: string;
  preferredCurrency: CurrencyCode;
  preferences: UserPreferences;
  onboardingStatus: OnboardingStatus;
  authProvider: AuthProvider;
  isGuest: boolean;
  createdAt: string;
}

export interface ArchiveCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  visibility: VisibilityStatus;
}

export interface Lookbook {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  coverImageUrl: string;
  generatedAt: string;
  occasion?: string;
  climate?: string;
  location?: string;
  priceRange?: PriceRangeSelection;
  aestheticTags: string[];
  visibility: VisibilityStatus;
  generationMethod: GenerationMethod;
  saved: boolean;
  collectionIds: string[];
  notes?: string;
  buildPreferences?: BuildLookAnswers;
}

export interface Look {
  id: string;
  lookbookId: string;
  title: string;
  explanation: string;
  totalEstimatedPrice: number;
  currency: CurrencyCode;
  colorPalette: string[];
  silhouetteTags: string[];
  occasionTags: string[];
  stylingExplanation?: string;
  matchExplanation?: string;
  productIds: string[];
}

export type ClothingCategory =
  | "tops"
  | "bottoms"
  | "dresses"
  | "jumpsuits"
  | "sets"
  | "outerwear"
  | "knitwear"
  | "swimwear"
  | "shoes"
  | "handbags"
  | "jewelry"
  | "belts"
  | "hosiery"
  | "sunglasses"
  | "hats"
  | "accessories";

export type DepartmentFilter =
  | "womenswear"
  | "menswear"
  | "gender-neutral"
  | "all"
  | "no-preference";

export type ProductCondition = "new" | "vintage" | "resale" | "archive";

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

export type DesignerLabelType =
  | "independent-designer"
  | "emerging-designer"
  | "independent-label"
  | "emerging-label"
  | "designer-led-brand"
  | "local-label"
  | "artisanal-label"
  | "made-to-order-designer"
  | "contemporary-brand"
  | "major-designer";

export interface Retailer {
  id: string;
  slug: string;
  name: string;
  biography?: string;
  city: string;
  country: string;
  website?: string;
  coverImageUrl: string;
  aestheticTags: string[];
  priceRange: PriceRangeSelection;
  shippingLocations: string[];
  brandsCarriedIds: string[];
  onlinePurchasing: boolean;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
}

export interface ConceptStore {
  id: string;
  slug: string;
  name: string;
  biography: string;
  city: string;
  country: string;
  website?: string;
  coverImageUrl: string;
  physicalLocations: string[];
  designerIds: string[];
  categories: ClothingCategory[];
  aestheticTags: string[];
  priceRange: PriceRangeSelection;
  shippingLocations: string[];
  onlinePurchasing: boolean;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
}

export interface VintageSeller {
  id: string;
  slug: string;
  name: string;
  biography?: string;
  city: string;
  country: string;
  website?: string;
  coverImageUrl: string;
  aestheticTags: string[];
  specialties: string[];
  priceRange: PriceRangeSelection;
  shippingLocations: string[];
  authenticatedResale: boolean;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  productUrl: string;
  imageUrls: string[];
  category: ClothingCategory;
  subcategory?: string;
  availableSizes: string[];
  sizingSystem?: SizingSystem;
  price: number;
  originalPrice?: number;
  currency: CurrencyCode;
  color?: string;
  material?: string;
  countryOfOrigin?: string;
  designerId?: string;
  retailerId?: string;
  conceptStoreId?: string;
  vintageSellerId?: string;
  showroomId?: string;
  designerCity?: string;
  retailerCity?: string;
  aestheticTags: string[];
  presentationTags: string[];
  occasionTags: string[];
  climateTags: string[];
  departmentTags: ("womenswear" | "menswear" | "gender-neutral")[];
  /** @deprecated use presentationTags */
  genderExpressionTags?: string[];
  inventoryStatus: "in-stock" | "low-stock" | "sold-out" | "made-to-order";
  madeToOrder?: boolean;
  customSizingAvailable?: boolean;
  shippingDestinations: string[];
  condition: ProductCondition;
  conditionNotes?: string;
  lastVerifiedAt: string;
  isIndependentDesigner?: boolean;
  isEmergingDesigner?: boolean;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
  updatedAt: string;
  /** How the user acquires this piece — showroom items require fitting/reservation flow. */
  purchaseFlow?: "direct" | "showroom-fitting" | "made-to-order";
  /** Canonical source URL (may differ from affiliate destination). */
  sourceUrl?: string;
  sourceType?: ProductSourceType;
  sourceProductId?: string;
  retailerName?: string;
  designerName?: string;
  imageSource?: ImageSource;
  styleTags?: string[];
  seasonTags?: string[];
  colorTags?: string[];
  footwearType?: string;
  heelHeight?: string;
  verified?: boolean;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string;
  lastCheckedAt?: string;
  verificationMethod?: string;
  affiliateUrl?: string;
  affiliateNetwork?: AffiliateNetwork;
  stockStatus?: string;
}

export type ShowroomType =
  | "appointment-showroom"
  | "assisted-showroom"
  | "private-shopping-studio"
  | "designer-studio"
  | "multi-brand-showroom"
  | "clienteling-boutique"
  | "sample-room"
  | "made-to-order-studio"
  | "styling-studio"
  | "fashion-house-fittings";

export type ShowroomAccess = "public" | "private" | "by-appointment";
export type ShowroomDuration = "permanent" | "seasonal" | "temporary";

/** Appointment-based and assisted retail — distinct from off-the-rack stores. */
export interface Showroom {
  id: string;
  slug: string;
  name: string;
  retailerClassification: "Showroom / Private Shopping";
  showroomType: ShowroomType;
  biography: string;
  city: string;
  country: string;
  address: string;
  coverImageUrl: string;
  appointmentRequired: boolean;
  walkInAvailable: boolean;
  access: ShowroomAccess;
  designerIds: string[];
  categories: ClothingCategory[];
  showroomLookbookUrls?: string[];
  priceRange: PriceRangeSelection;
  sizeRange: string;
  customSizing: boolean;
  madeToOrder: boolean;
  fittingAvailable: boolean;
  stylingAssistance: boolean;
  languagesSpoken: string[];
  website?: string;
  bookingUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  shippingAvailable: boolean;
  reserveBeforeAppointment: boolean;
  internationalClients: boolean;
  duration: ShowroomDuration;
  appointmentNotice: string;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
}

export type CoverageLevel =
  | "covered"
  | "subtle"
  | "balanced"
  | "bold"
  | "no-preference";

export type KawaiiIntensity =
  | "subtle-reference"
  | "wearable"
  | "statement"
  | "full-expression";

export interface FittingListItem {
  id: string;
  productId: string;
  showroomId: string;
  preferredSize: string;
  alternativeSizes: string[];
  fitNotes?: string;
  accessibilityNotes?: string;
  addedAt: string;
}

export interface FittingList {
  id: string;
  userId?: string;
  showroomId: string;
  title: string;
  items: FittingListItem[];
  preferredDate?: string;
  privateFittingRequested?: boolean;
  generalNotes?: string;
  status: "draft" | "submitted" | "confirmed";
  submittedAt?: string;
  confirmationNote?: string;
}

export interface TryOnRequestPayload {
  fittingListId: string;
  showroomId: string;
  contactEmail?: string;
  contactName?: string;
  preferredDate?: string;
  items: Array<{
    productId: string;
    preferredSize: string;
    alternativeSizes: string[];
    fitNotes?: string;
    accessibilityNotes?: string;
  }>;
  privateFittingRequested?: boolean;
  generalNotes?: string;
}

export interface DesignerOwnership {
  blackOwned?: boolean;
  womenOwned?: boolean;
  queerOwned?: boolean;
  locallyProduced?: boolean;
  sustainableMaterials?: boolean;
  voluntarilyProvided: boolean;
}

export interface Designer {
  id: string;
  slug: string;
  labelName: string;
  labelType: DesignerLabelType;
  biography: string;
  designPhilosophy?: string;
  city: string;
  country: string;
  logoUrl?: string;
  coverImageUrl: string;
  website?: string;
  instagram?: string;
  socialLinks: Record<string, string>;
  aestheticTags: string[];
  sizeRange: string;
  priceRange: PriceRangeSelection;
  shippingLocations: string[];
  madeToOrder: boolean;
  customSizing: boolean;
  ownership?: DesignerOwnership;
  verificationStatus: "unverified" | "pending" | "verified";
  applicationStatus: DesignerApplicationStatus;
  websiteConnectionType: WebsiteConnectionType;
  featured: boolean;
  approvedAt?: string;
  isIndependent: boolean;
  isEmerging?: boolean;
  isPlaceholder?: boolean;
  isReferenceExample?: boolean;
  requestDesignerEnabled?: boolean;
}

export interface DesignerApplication {
  id: string;
  designerName: string;
  labelName: string;
  contactEmail: string;
  city: string;
  country: string;
  website?: string;
  instagram?: string;
  biography: string;
  designPhilosophy?: string;
  productCategories: string[];
  aestheticKeywords: string[];
  priceRange: PriceRangeSelection;
  sizeRange: string;
  customSizing: boolean;
  madeToOrder: boolean;
  shippingRegions: string[];
  connectionType: WebsiteConnectionType;
  productCount?: number;
  imagePermissionAgreed: boolean;
  editorialFeatureInterest: boolean;
  status: DesignerApplicationStatus;
  submittedAt: string;
}

export interface SearchFilters {
  query?: string;
  aesthetics?: string[];
  occasion?: string;
  city?: string;
  market?: string;
  department?: DepartmentFilter;
  genderExpression?: string;
  sizes?: string[];
  shoeSize?: string;
  priceRange?: PriceRangeSelection;
  colors?: string[];
  climate?: string;
  designers?: string[];
  stores?: string[];
  conceptStores?: string[];
  vintageSellers?: string[];
  sourceTypes?: ("designer" | "retailer" | "concept-store" | "vintage-seller")[];
  independentOnly?: boolean;
  includeVintage?: boolean;
  includeMadeToOrder?: boolean;
  shippingDestination?: string;
  /** User-selected fashion community influences — never inferred from profile. */
  fashionCommunities?: string[];
  coverageLevel?: CoverageLevel;
  kawaiiIntensity?: KawaiiIntensity;
  region?: string;
  subculture?: string;
}

export type SizingSystem = "US" | "UK" | "EU" | "letter" | "custom";

export type ShoeSizeSystem = "us-womens" | "us-mens" | "uk" | "eu" | "custom";

export type FootwearInclusion = "yes" | "no" | "optional" | "surprise";

export interface ClothingSizeEntry {
  tops?: string;
  bottoms?: string;
  dresses?: string;
  outerwear?: string;
  bras?: string;
  sizingSystem?: SizingSystem;
  specialSizing?: string[];
  skippedCategories?: string[];
}

export interface ShoePreferences {
  inclusion?: FootwearInclusion;
  types?: string[];
  heelHeight?: string;
  fitPreferences?: string[];
  shoeSize?: string;
  shoeSizeSystem?: ShoeSizeSystem;
}

export interface BuildLookAnswers {
  dressingFor?: string;
  styleDirections?: string[];
  customStyleDescription?: string;
  clothingPresentation?: string[];
  clothingSizes?: ClothingSizeEntry;
  footwear?: ShoePreferences;
  location?: string;
  climate?: string;
  priceRange?: PriceRangeSelection;
  colors?: string[];
  experimentalLevel?: number;
  independentDesigners?: boolean | "No preference";
  /** @deprecated use clothingSizes */
  sizes?: string[];
  /** @deprecated use styleDirections */
  aesthetics?: string[];
  silhouettes?: string[];
  proportionPreferences?: string[];
  stylingEffects?: string[];
  /** Optional fashion community influences — user-selected, never inferred. */
  fashionCommunities?: string[];
  /** Optional style inspiration directions — opt-in only, mapped to aesthetic tags. */
  styleInspirations?: string[];
  coverageLevel?: CoverageLevel;
  kawaiiIntensity?: KawaiiIntensity;
}

export interface SurpriseConstraints {
  priceRange?: PriceRangeSelection;
  sizes?: string[];
  occasion?: string;
  climate?: string;
  adventurousness?: number;
}

export interface IndependentDesignerFilters {
  city?: string;
  country?: string;
  priceRange?: PriceRangeSelection;
  sizes?: string[];
  customSizing?: boolean;
  madeToOrder?: boolean;
  category?: string;
  aesthetic?: string;
  genderExpression?: string;
  shippingDestination?: string;
  sustainableMaterials?: boolean;
  blackOwned?: boolean;
  womenOwned?: boolean;
  queerOwned?: boolean;
  localProduction?: boolean;
}

export interface SavedItem {
  id: string;
  userId: string;
  type: "lookbook" | "look" | "garment" | "designer";
  referenceId: string;
  collectionIds: string[];
  savedAt: string;
  notes?: string;
}

export const STORAGE_KEYS = {
  session: "archive411-session",
  onboarding: "archive411-onboarding",
  archive: "archive411-archive",
  collections: "archive411-collections",
  savedItems: "archive411-saved-items",
  designerApplications: "archive411-designer-applications",
  savedLookbookSessions: "archive411-saved-lookbook-sessions",
  fittingLists: "archive411-fitting-lists",
} as const;

export interface SavedLookbookSession {
  lookbook: Lookbook;
  looks: Look[];
  method: GenerationMethod;
  buildPreferences?: BuildLookAnswers;
  products?: Product[];
}
