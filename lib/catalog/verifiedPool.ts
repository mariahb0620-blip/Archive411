import type { Designer, Product } from "@/app/types/domain";
import { BETA_DESIGNERS, BETA_PRODUCTS } from "@/app/data/betaCatalog";
import { EXTENDED_DESIGNERS, EXTENDED_PRODUCTS } from "@/app/data/extendedCatalog";

/** Client-safe verified catalog pool (no server imports). */
export const LOCAL_DESIGNERS: Designer[] = [...BETA_DESIGNERS, ...EXTENDED_DESIGNERS];
export const LOCAL_PRODUCTS: Product[] = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];

export function getVerifiedProductsSync(): Product[] {
  return LOCAL_PRODUCTS;
}

export function getVerifiedDesignersSync(): Designer[] {
  return LOCAL_DESIGNERS;
}
