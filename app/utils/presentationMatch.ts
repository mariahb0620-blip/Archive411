import type { BuildLookAnswers, DepartmentFilter, Product } from "@/app/types/domain";

export function resolveDepartmentFromBuild(
  answers: BuildLookAnswers
): DepartmentFilter {
  const p = answers.clothingPresentation ?? [];
  if (p.includes("No preference") || p.includes("A mix") || p.length === 0) return "all";
  if (p.includes("Gender-neutral") && p.length === 1) return "gender-neutral";
  if (p.includes("Feminine") && !p.includes("Masculine") && !p.includes("Androgynous"))
    return "womenswear";
  if (p.includes("Masculine") && !p.includes("Feminine") && !p.includes("Androgynous"))
    return "menswear";
  return "all";
}

export function scorePresentationMatch(
  product: Product,
  presentations?: string[]
): number {
  if (!presentations?.length) return 0;
  if (
    presentations.includes("No preference") ||
    presentations.includes("A mix") ||
    presentations.length > 2
  ) {
    return 0;
  }

  const tags = product.presentationTags.map((t) => t.toLowerCase());
  const wantsFem = presentations.some((p) => /feminine/i.test(p));
  const wantsMasc = presentations.some((p) => /masculine/i.test(p));
  const wantsAndro = presentations.some((p) => /androgynous|gender-neutral/i.test(p));

  const hasFem = tags.includes("feminine");
  const hasMasc = tags.includes("masculine");
  const hasAndro = tags.includes("androgynous") || tags.includes("gender-neutral");

  if (wantsFem && !wantsMasc && !wantsAndro) {
    if (hasFem) return 35;
    if (hasMasc && !hasFem) return -80;
    if (hasAndro) return 10;
    if (product.departmentTags.includes("womenswear")) return 20;
    if (
      product.departmentTags.includes("menswear") &&
      !product.departmentTags.includes("womenswear")
    )
      return -60;
  }

  if (wantsMasc && !wantsFem && !wantsAndro) {
    if (hasMasc) return 35;
    if (hasAndro) return 10;
    if (hasFem && !hasMasc) return -40;
    if (product.departmentTags.includes("menswear")) return 20;
  }

  if (wantsAndro || presentations.includes("Gender-neutral")) {
    if (hasAndro || product.departmentTags.includes("gender-neutral")) return 25;
  }

  return 0;
}
