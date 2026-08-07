import type { Product } from "@/app/types/domain";

/** Max pieces from the same designer within one look (outfit). */
export const MAX_PRODUCTS_PER_DESIGNER_PER_LOOK = 2;

/** Max pieces from the same designer across a full lookbook generation. */
export const MAX_PRODUCTS_PER_DESIGNER_PER_LOOKBOOK = 4;

export interface DiversityContext {
  recentlyUsedProductIds?: Set<string>;
  recentlyUsedDesignerIds?: Set<string>;
  sessionUsedProductIds?: Set<string>;
  sessionUsedDesignerIds?: Set<string>;
}

export function designerCountInSelection(
  products: Product[],
  designerId: string | undefined
): number {
  if (!designerId) return 0;
  return products.filter((p) => p.designerId === designerId).length;
}

export function canAddProductForDiversity(
  product: Product,
  selected: Product[],
  context: DiversityContext = {}
): boolean {
  if (context.recentlyUsedProductIds?.has(product.id)) return false;
  if (context.sessionUsedProductIds?.has(product.id)) return false;

  if (product.designerId) {
    const inLook = designerCountInSelection(selected, product.designerId);
    if (inLook >= MAX_PRODUCTS_PER_DESIGNER_PER_LOOK) return false;

    const sessionDesignerUses = context.sessionUsedDesignerIds?.has(product.designerId)
      ? 1
      : 0;
    if (
      sessionDesignerUses > 0 &&
      inLook + sessionDesignerUses >= MAX_PRODUCTS_PER_DESIGNER_PER_LOOKBOOK
    ) {
      return false;
    }
  }

  return true;
}

/** Deprioritize recently seen products while preserving relevance ordering. */
export function applyDiversityPenalty(
  products: Product[],
  context: DiversityContext = {}
): Product[] {
  return [...products].sort((a, b) => {
    const aRecent =
      (context.recentlyUsedProductIds?.has(a.id) ? 1 : 0) +
      (context.recentlyUsedDesignerIds?.has(a.designerId ?? "") ? 1 : 0);
    const bRecent =
      (context.recentlyUsedProductIds?.has(b.id) ? 1 : 0) +
      (context.recentlyUsedDesignerIds?.has(b.designerId ?? "") ? 1 : 0);
    return aRecent - bRecent;
  });
}
