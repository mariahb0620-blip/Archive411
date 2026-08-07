import type { Designer, Product } from "@/app/types/domain";
import { BETA_DESIGNERS, BETA_PRODUCTS } from "@/app/data/betaCatalog";
import { EXTENDED_DESIGNERS, EXTENDED_PRODUCTS } from "@/app/data/extendedCatalog";
import { filterRecommendationEligible } from "@/lib/catalog/isRecommendationEligible";

/** Client-safe verified catalog pool (no server imports). */
export const LOCAL_DESIGNERS: Designer[] = [...BETA_DESIGNERS, ...EXTENDED_DESIGNERS];
export const LOCAL_PRODUCTS: Product[] = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];

/** Full catalog including browse-only / pending records (designer profiles, future SKUs). */
export function getVerifiedProductsSync(): Product[] {
  return LOCAL_PRODUCTS;
}

export function getVerifiedDesignersSync(): Designer[] {
  return LOCAL_DESIGNERS;
}

/** Shoppable pool — exact verified product URLs only. */
export function getRecommendationEligibleProductsSync(): Product[] {
  return filterRecommendationEligible(LOCAL_PRODUCTS);
}
