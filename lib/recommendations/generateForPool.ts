/**
 * Lookbook generation against an explicit product pool (verified catalog).
 */
import type { BuildLookAnswers, Look, Lookbook, Product } from "@/app/types/domain";
import {
  DEFAULT_PRICE_RANGE,
  MOCK_DISCLAIMER,
} from "@/app/data/mockCatalog";
import {
  STYLE_DIRECTION_OPTIONS,
  blendStyleLabel,
} from "@/app/data/buildQuestionnaire";
import {
  assembleDiverseLook,
  searchCatalog,
} from "@/app/services/catalog.service";
import { assembleVariedLookbook } from "@/app/services/lookAssembly.service";
import { shuffleArray, rotateArray } from "@/app/utils/pickRandom";
import { checkSizeAvailability } from "@/app/utils/sizeAvailability";
import { STYLE_TO_AESTHETIC } from "@/app/data/curatedRoster";
import { inspirationTagsForIds } from "@/app/data/styleInspiration";
import { communitySearchAesthetics } from "@/app/data/styleCommunities";
import { resolveDepartmentFromBuild } from "@/app/utils/presentationMatch";
import { EDITORIAL_COVER } from "@/app/data/catalogImages";
import { coverFromProducts, normalizeCoverImageUrl } from "@/app/data/productImagery";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function styleLabels(answers: BuildLookAnswers): string[] {
  const fromIds = (answers.styleDirections ?? []).map((sid) => {
    const found = STYLE_DIRECTION_OPTIONS.find((s) => s.id === sid);
    return found?.label ?? sid;
  });
  if (answers.customStyleDescription?.trim()) fromIds.push(answers.customStyleDescription.trim());
  return fromIds.length ? fromIds : (answers.aesthetics ?? []);
}

function collectSearchSizes(answers: BuildLookAnswers): string[] {
  const sizes: string[] = [];
  const cs = answers.clothingSizes;
  if (cs) {
    (["tops", "bottoms", "dresses", "outerwear", "bras"] as const).forEach((key) => {
      if (cs[key] && !(cs.skippedCategories ?? []).includes(key)) sizes.push(cs[key]!);
    });
  }
  if (answers.footwear?.shoeSize) sizes.push(answers.footwear.shoeSize);
  return sizes.length ? sizes : (answers.sizes ?? []);
}

function styleAestheticTags(answers: BuildLookAnswers): string[] {
  const fromStyles = (answers.styleDirections ?? []).flatMap(
    (sid) => STYLE_TO_AESTHETIC[sid] ?? []
  );
  const fromCommunities = answers.fashionCommunities?.length
    ? communitySearchAesthetics(answers.fashionCommunities)
    : [];
  const fromInspiration = answers.styleInspirations?.length
    ? inspirationTagsForIds(answers.styleInspirations)
    : [];
  return [...styleLabels(answers), ...fromStyles, ...fromCommunities, ...fromInspiration];
}

function buildLooksFromProducts(
  candidates: Product[],
  lookbookId: string,
  matchExplanation: string,
  stylingNote?: string
): Look[] {
  if (!candidates.length) return [];

  const varied = assembleVariedLookbook(candidates, lookbookId, matchExplanation, stylingNote);
  if (varied.length) return varied;

  return [];
}

function mergeCandidatePool(
  assembled: { products: Product[] },
  ranked: Product[]
): Product[] {
  const seen = new Set<string>();
  const merged: Product[] = [];
  for (const p of [...assembled.products, ...ranked]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    merged.push(p);
  }
  return merged;
}

export function generateLookbookFromBuildForPool(
  answers: BuildLookAnswers,
  pool: Product[]
): { lookbook: Lookbook; looks: Look[] } {
  const blendTitle = blendStyleLabel(
    answers.styleDirections ?? [],
    answers.customStyleDescription
  );
  const location = answers.location ?? "Global";
  const searchSizes = collectSearchSizes(answers);
  const independent = answers.independentDesigners === true;
  const presentations = answers.clothingPresentation;
  const department = resolveDepartmentFromBuild(answers);
  const aestheticTags = styleAestheticTags(answers);
  const footwearExcluded = answers.footwear?.inclusion === "no";

  const searchFilters = {
    aesthetics: aestheticTags,
    fashionCommunities: answers.fashionCommunities,
    coverageLevel: answers.coverageLevel,
    kawaiiIntensity: answers.kawaiiIntensity,
    city: location,
    climate: answers.climate,
    priceRange: answers.priceRange ?? DEFAULT_PRICE_RANGE,
    sizes: searchSizes,
    independentOnly: independent,
    department,
  } as const;

  let filteredPool = pool.filter((p) => !p.isReferenceExample);
  if (footwearExcluded) {
    filteredPool = filteredPool.filter((p) => p.category !== "shoes");
  }

  const assembled = assembleDiverseLook(searchFilters, answers, filteredPool);
  const ranked = searchCatalog(searchFilters, presentations, filteredPool);
  const candidates = rotateArray(shuffleArray(mergeCandidatePool(assembled, ranked)));

  const lookbookId = id("lb");
  const matchExplanation = `Matched from verified catalog based on ${blendTitle}. ${MOCK_DISCLAIMER}`;

  const looks = buildLooksFromProducts(candidates, lookbookId, matchExplanation);

  const lookbook: Lookbook = {
    id: lookbookId,
    title: blendTitle,
    description: `Editorial lookbook for ${answers.dressingFor ?? "your occasion"} in ${location}.`,
    coverImageUrl: normalizeCoverImageUrl(
      coverFromProducts(
        candidates.map((p) => p.id),
        candidates
      ) ?? EDITORIAL_COVER
    ),
    generatedAt: new Date().toISOString(),
    occasion: answers.dressingFor,
    climate: answers.climate,
    location,
    priceRange: answers.priceRange,
    aestheticTags: aestheticTags.slice(0, 8),
    visibility: "private",
    generationMethod: "build",
    saved: false,
    collectionIds: [],
    buildPreferences: answers,
  };

  return { lookbook, looks };
}

export { checkSizeAvailability };
