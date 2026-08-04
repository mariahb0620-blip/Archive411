export { SEED_SHOWROOMS } from "./showrooms";
export { applyShowroomPatches } from "./showroomProducts";

import { SEED_DESIGNERS } from "./designers";
import { SEED_DESIGNERS_EXTENDED } from "./designersExtended";
import { SEED_CONCEPT_STORES, SEED_VINTAGE_SELLERS } from "./sources";
import { SEED_PRODUCTS } from "./products";
import { SEED_PRODUCTS_EXTENDED } from "./productsExtended";
import { SEED_SHOWROOMS } from "./showrooms";
import { applyShowroomPatches } from "./showroomProducts";
import { normalizeProductImagery, normalizeCoverImageUrl } from "@/app/data/productImagery";

export const MOCK_DESIGNERS = [...SEED_DESIGNERS, ...SEED_DESIGNERS_EXTENDED].map((d) => ({
  ...d,
  coverImageUrl: normalizeCoverImageUrl(d.coverImageUrl),
}));
export const MOCK_CONCEPT_STORES = SEED_CONCEPT_STORES.map((s) => ({
  ...s,
  coverImageUrl: normalizeCoverImageUrl(s.coverImageUrl),
}));
export const MOCK_VINTAGE_SELLERS = SEED_VINTAGE_SELLERS;
export const MOCK_SHOWROOMS = SEED_SHOWROOMS.map((s) => ({
  ...s,
  coverImageUrl: normalizeCoverImageUrl(s.coverImageUrl),
}));
export const MOCK_PRODUCTS = applyShowroomPatches([
  ...SEED_PRODUCTS,
  ...SEED_PRODUCTS_EXTENDED,
]).map(normalizeProductImagery);
