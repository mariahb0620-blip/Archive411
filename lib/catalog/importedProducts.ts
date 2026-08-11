import type { Product } from "@/app/types/domain";
import importedRaw from "../../data/catalog/import/verified-products.json";
import { filterRecommendationEligible } from "@/lib/catalog/isRecommendationEligible";

/** Verified products merged from JSON import batches (see data/catalog/import/README.md). */
export function getImportedProducts(): Product[] {
  if (!Array.isArray(importedRaw)) return [];
  return importedRaw as Product[];
}

export function getImportedEligibleProducts(): Product[] {
  return filterRecommendationEligible(getImportedProducts());
}
