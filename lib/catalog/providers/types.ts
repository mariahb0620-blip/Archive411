import type { ImportProductRecord, ProductSourceType } from "@/lib/catalog/types";
import type { AffiliateNetwork, ClothingCategory, CurrencyCode, Product } from "@/app/types/domain";

export interface CatalogProvider {
  id: ProductSourceType;
  name: string;
  isConfigured(): boolean;
  fetchProducts(options?: { limit?: number; query?: string }): Promise<ImportProductRecord[]>;
}

export interface NormalizedCatalogProduct
  extends Omit<
    Product,
    "id" | "updatedAt" | "lastVerifiedAt"
  > {
  id?: string;
}

export function normalizeImportRecord(
  record: ImportProductRecord,
  defaults?: Partial<NormalizedCatalogProduct>
): NormalizedCatalogProduct {
  const slug = (record.designerSlug ?? record.designer ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const id =
    record.id ??
    `prod-${slug}-${record.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;

  return {
    id,
    name: record.productName,
    productUrl: record.productUrl,
    sourceUrl: record.sourceUrl ?? record.productUrl,
    sourceType: record.sourceType ?? "curated",
    sourceProductId: record.sourceProductId,
    retailerName: record.retailerName,
    designerName: record.designer,
    imageUrls: record.imageUrl ? [record.imageUrl] : [],
    imageSource: record.imageSource ?? (record.imageUrl ? "retailer" : "unknown"),
    category: record.category as ClothingCategory,
    subcategory: record.subcategory,
    availableSizes: record.availableSizes ?? [],
    price: record.price,
    currency: record.currency as CurrencyCode,
    designerId: record.designerId,
    aestheticTags: record.aestheticTags ?? [],
    presentationTags: record.presentationTags ?? [],
    occasionTags: record.occasionTags ?? [],
    climateTags: record.climateTags ?? [],
    departmentTags: (record.departmentTags ?? []) as Product["departmentTags"],
    styleTags: record.styleTags ?? [],
    seasonTags: record.seasonTags ?? [],
    colorTags: record.colorTags ?? [],
    footwearType: record.footwearType,
    heelHeight: record.heelHeight,
    inventoryStatus: (record.inventoryStatus as Product["inventoryStatus"]) ?? "in-stock",
    affiliateUrl: record.affiliateUrl,
    affiliateNetwork: record.affiliateNetwork as AffiliateNetwork | undefined,
    verificationStatus: "pending",
    verified: false,
    shippingDestinations: defaults?.shippingDestinations ?? ["US", "EU", "UK"],
    condition: "new",
    isReferenceExample: false,
    ...defaults,
  };
}
