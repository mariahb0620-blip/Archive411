/**
 * Central image paths for catalog, designers, and editorial assets.
 * PNGs generated via: npm run images:generate
 */
import type { ClothingCategory } from "@/app/types/domain";
import manifest from "@/app/data/catalogImages.json";

const catalog = manifest.catalog as Record<string, string>;
const editorial = manifest.editorial as { cover: string; panel: string };

export const CATEGORY_IMAGES: Record<ClothingCategory | "default", string> = {
  tops: catalog.tops,
  bottoms: catalog.bottoms,
  dresses: catalog.dresses,
  jumpsuits: catalog.dresses,
  sets: catalog.dresses,
  outerwear: catalog.outerwear,
  knitwear: catalog.tops,
  swimwear: catalog.dresses,
  shoes: catalog.shoes,
  handbags: catalog.handbags,
  jewelry: catalog.jewelry,
  belts: catalog.accessories,
  hosiery: catalog.accessories,
  sunglasses: catalog.accessories,
  hats: catalog.accessories,
  accessories: catalog.accessories,
  default: catalog.default,
};

export const EDITORIAL_COVER = editorial.cover;
export const EDITORIAL_PANEL = editorial.panel;

const CATEGORY_CYCLE = [
  CATEGORY_IMAGES.tops,
  CATEGORY_IMAGES.bottoms,
  CATEGORY_IMAGES.dresses,
  CATEGORY_IMAGES.outerwear,
  CATEGORY_IMAGES.shoes,
  CATEGORY_IMAGES.handbags,
  CATEGORY_IMAGES.jewelry,
  CATEGORY_IMAGES.accessories,
] as const;

export function productImage(category: ClothingCategory): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.default;
}

export function designerCoverImage(slug: string): string {
  return `/images/designers/${slug}.png`;
}

export function imageFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_CYCLE[hash % CATEGORY_CYCLE.length];
}

export function entityCoverImage(params: {
  id: string;
  slug?: string;
  fallbackUrl?: string;
  kind?: "designer" | "entity";
}): string {
  const { id, slug, fallbackUrl, kind = "entity" } = params;
  if (kind === "designer" && slug) {
    return designerCoverImage(slug);
  }
  if (fallbackUrl && !fallbackUrl.includes(".svg") && !fallbackUrl.includes("example.com")) {
    return fallbackUrl;
  }
  return imageFromSeed(id);
}
