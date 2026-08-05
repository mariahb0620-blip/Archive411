export { applyShowroomPatches } from "./showroomProducts";

import { SEED_DESIGNERS } from "./designers";
import { SEED_DESIGNERS_EXTENDED } from "./designersExtended";
import { SEED_CONCEPT_STORES, SEED_VINTAGE_SELLERS } from "./sources";
import { SEED_PRODUCTS } from "./products";
import { SEED_PRODUCTS_EXTENDED } from "./productsExtended";
import { SEED_SHOWROOMS } from "./showrooms";
import { applyShowroomPatches } from "./showroomProducts";
import {
  normalizeProductImagery,
  normalizeCoverImageUrl,
  placeholderFromSeed,
  isStockOrAiImageUrl,
  EDITORIAL_PLACEHOLDER,
} from "@/app/data/productImagery";

function entityCover(id: string, url?: string): string {
  if (!url || isStockOrAiImageUrl(url) || url === EDITORIAL_PLACEHOLDER) {
    return placeholderFromSeed(id);
  }
  return normalizeCoverImageUrl(url);
}

export const MOCK_DESIGNERS = [...SEED_DESIGNERS, ...SEED_DESIGNERS_EXTENDED].map((d) => ({
  ...d,
  coverImageUrl: entityCover(d.id, d.coverImageUrl),
}));
export const MOCK_CONCEPT_STORES = SEED_CONCEPT_STORES.map((s) => ({
  ...s,
  coverImageUrl: entityCover(s.id, s.coverImageUrl),
}));
export const MOCK_VINTAGE_SELLERS = SEED_VINTAGE_SELLERS.map((s) => ({
  ...s,
  coverImageUrl: entityCover(s.id, s.coverImageUrl),
}));
export const MOCK_SHOWROOMS = SEED_SHOWROOMS.map((s) => ({
  ...s,
  coverImageUrl: entityCover(s.id, s.coverImageUrl),
  showroomLookbookUrls: (s.showroomLookbookUrls ?? []).map((url, i) =>
    entityCover(`${s.id}-look-${i}`, url)
  ),
}));
export const MOCK_PRODUCTS = applyShowroomPatches([
  ...SEED_PRODUCTS,
  ...SEED_PRODUCTS_EXTENDED,
]).map(normalizeProductImagery);
