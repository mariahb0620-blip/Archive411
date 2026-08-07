import type { Look, Product } from "@/app/types/domain";
import {
  LOOK_INTERPRETATIONS,
  MIXED_STYLING_NOTES,
} from "@/app/data/styleUniverse";
import { convertToCurrency } from "@/app/services/catalog.service";
import { productImage } from "@/app/data/catalogImages";
import { pickRandom, rotateArray, shuffleArray } from "@/app/utils/pickRandom";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface AssembleLookbookOptions {
  styleBlend?: string;
  dressingFor?: string;
}

function orderInterpretations(dressingFor?: string) {
  const specs = [...LOOK_INTERPRETATIONS];
  const promote = (lookId: string) => {
    const idx = specs.findIndex((s) => s.id === lookId);
    if (idx > 0) {
      const [item] = specs.splice(idx, 1);
      specs.unshift(item);
    }
  };

  const occasion = dressingFor?.toLowerCase() ?? "";
  if (occasion.includes("date") || occasion.includes("night")) {
    promote("nightlife");
  } else if (occasion.includes("work") || occasion.includes("everyday")) {
    promote("everyday");
    promote("polished");
  } else if (occasion.includes("event")) {
    promote("polished");
    promote("nightlife");
  }

  return specs;
}

function personalizedTitle(specTitle: string, styleBlend?: string): string {
  if (!styleBlend || styleBlend === "Editorial mix") return specTitle;
  return `${styleBlend} · ${specTitle}`;
}

function paletteFromProducts(products: Product[]): string[] {
  return products
    .slice(0, 5)
    .map((p) => p.imageUrls[0] ?? productImage(p.category))
    .filter(Boolean);
}

function productMatchesTags(product: Product, tags: readonly string[]): boolean {
  const haystack = [
    ...product.aestheticTags,
    ...product.occasionTags,
    product.subcategory ?? "",
    product.category,
  ]
    .join(" ")
    .toLowerCase();
  return tags.some((t) => haystack.includes(t.toLowerCase().replace(/\s+/g, "-")));
}

function hasMixedPresentation(products: Product[]): boolean {
  const depts = new Set(products.flatMap((p) => p.departmentTags));
  const categories = new Set(products.map((p) => p.category));
  const hasMenswear = products.some((p) => p.departmentTags.includes("menswear"));
  const hasFeminine = products.some(
    (p) =>
      p.presentationTags.includes("feminine") ||
      p.category === "dresses" ||
      p.subcategory === "corset"
  );
  return (
    depts.size > 1 ||
    (hasMenswear && hasFeminine) ||
    (categories.has("outerwear") && categories.has("dresses"))
  );
}

function pickForLook(
  pool: Product[],
  spec: (typeof LOOK_INTERPRETATIONS)[number],
  usedProductIds: Set<string>,
  usedDesignerIds: Set<string>,
  lookIndex: number
): Product[] {
  const selected: Product[] = [];
  const shuffledPool = shuffleArray(pool.filter((p) => !usedProductIds.has(p.id)));
  const available = rotateArray(shuffledPool, lookIndex * 3 + Math.floor(Math.random() * 5));

  const tryPick = (predicate: (p: Product) => boolean) => {
    const matches = available.filter(
      (p) =>
        predicate(p) &&
        !selected.includes(p) &&
        (!p.designerId || !usedDesignerIds.has(p.designerId) || selected.length >= 2)
    );
    const item = pickRandom(matches, 8);
    if (item) {
      selected.push(item);
      if (item.designerId) usedDesignerIds.add(item.designerId);
    }
    return item;
  };

  for (const cat of spec.requiredCategories) {
    tryPick((p) => p.category === cat);
  }

  if ("preferCategories" in spec && spec.preferCategories) {
    for (const cat of spec.preferCategories) {
      if (selected.length >= 5) break;
      tryPick((p) => p.category === cat);
    }
  }

  if ("requireIndependent" in spec && spec.requireIndependent) {
    tryPick((p) => !!(p.isIndependentDesigner || p.isEmergingDesigner || p.conceptStoreId));
  }

  if (spec.preferredTags.length) {
    tryPick((p) => productMatchesTags(p, spec.preferredTags));
  }

  if (!selected.some((p) => p.category === "shoes")) {
    tryPick((p) => p.category === "shoes");
  }
  if (!selected.some((p) => ["handbags", "jewelry", "accessories", "sunglasses"].includes(p.category))) {
    tryPick((p) => ["handbags", "jewelry", "accessories", "sunglasses"].includes(p.category));
  }

  if (spec.avoidDuplicateCategory) {
    const cat = spec.avoidDuplicateCategory;
    const dupes = selected.filter((p) => p.category === cat).length;
    if (dupes > 1) {
      const replaceIdx = selected.findIndex((p) => p.category === cat);
      if (replaceIdx >= 0) selected.splice(replaceIdx, 1);
    }
  }

  const remainder = shuffleArray(available.filter((p) => !selected.includes(p)));
  for (const p of remainder) {
    if (selected.length >= 5) break;
    if (!selected.includes(p)) {
      selected.push(p);
      if (p.designerId) usedDesignerIds.add(p.designerId);
    }
  }

  if ("requireMixedPresentation" in spec && spec.requireMixedPresentation && selected.length >= 2) {
    const hasFem = selected.some((p) => p.presentationTags.includes("feminine") || p.category === "dresses");
    if (hasFem && !selected.some((p) => p.departmentTags.includes("menswear"))) {
      const mensMatches = available.filter(
        (p) =>
          !selected.includes(p) &&
          (p.departmentTags.includes("menswear") ||
            p.category === "outerwear" ||
            p.category === "bottoms")
      );
      const mensPiece = pickRandom(mensMatches, 5);
      if (mensPiece && selected.length >= 3) {
        selected[0] = mensPiece;
      }
    }
  }

  return selected.slice(0, 5);
}

export function assembleVariedLookbook(
  candidates: Product[],
  lookbookId: string,
  matchExplanation: string,
  stylingNote?: string,
  options?: AssembleLookbookOptions
): Look[] {
  if (!candidates.length) return [];

  const rotatedCandidates = rotateArray(shuffleArray(candidates));
  const usedProductIds = new Set<string>();
  const usedDesignerIds = new Set<string>();
  const looks: Look[] = [];
  const interpretations = orderInterpretations(options?.dressingFor);

  interpretations.forEach((spec, index) => {
    const products = pickForLook(
      rotatedCandidates,
      spec,
      usedProductIds,
      usedDesignerIds,
      index
    );
    if (!products.length) return;

    products.forEach((p) => usedProductIds.add(p.id));

    const totalUsd = products.reduce(
      (sum, p) => sum + convertToCurrency(p.price, p.currency, "USD"),
      0
    );

    const mixedNote =
      spec.id === "unexpected"
        ? MIXED_STYLING_NOTES[index % MIXED_STYLING_NOTES.length]
        : undefined;

    looks.push({
      id: id("look"),
      lookbookId,
      title: personalizedTitle(spec.title, options?.styleBlend),
      explanation: spec.description,
      totalEstimatedPrice: totalUsd,
      currency: products[0]?.currency ?? "USD",
      colorPalette: paletteFromProducts(products),
      silhouetteTags: products.flatMap((p) => p.aestheticTags).slice(0, 4),
      occasionTags: products.flatMap((p) => p.occasionTags).slice(0, 4),
      stylingExplanation:
        mixedNote ??
        stylingNote ??
        (hasMixedPresentation(products)
          ? "Cross-department styling — pieces assembled across retailer categories for an intentional mixed-presentation look."
          : "Editorial styling assembled from independent labels, concept stores and archive sources."),
      matchExplanation,
      productIds: products.map((p) => p.id),
    });
  });

  return looks;
}
