/**
 * Catalog verification — run: npm run catalog:verify
 *
 * Checks product coverage, source diversity, presentation filtering,
 * image policy (no stock/AI URLs), and lookbook variety across runs.
 */
import { MOCK_PRODUCTS, MOCK_DESIGNERS } from "../app/data/seed/index";
import {
  PRIORITY_DESIGNER_IDS,
  PRIORITY_CONCEPT_STORE_IDS,
} from "../app/data/curatedRoster";
import { isStockOrAiImageUrl } from "../app/data/productImagery";
import { generateLookbookFromBuild } from "../app/services/lookbook.service";
import { searchCatalog } from "../app/services/catalog.service";
import type { BuildLookAnswers } from "../app/types/domain";

const GLOBAL_REGIONS = [
  "Ho Chi Minh City",
  "Bangkok",
  "New York",
  "London",
  "Paris",
  "Tokyo",
  "Seoul",
  "Lagos",
];

function regionFor(city?: string): string {
  if (!city) return "Unknown";
  const lower = city.toLowerCase();
  for (const r of GLOBAL_REGIONS) {
    if (lower.includes(r.toLowerCase().replace(" city", ""))) return r;
  }
  return city;
}

console.log("=== Archive411 catalog verification ===\n");

console.log(`Products in catalog: ${MOCK_PRODUCTS.length}`);
console.log(`Designers in catalog: ${MOCK_DESIGNERS.length}`);

const regionCounts = new Map<string, number>();
for (const p of MOCK_PRODUCTS) {
  const r = regionFor(p.designerCity ?? p.retailerCity);
  regionCounts.set(r, (regionCounts.get(r) ?? 0) + 1);
}
console.log("\nProducts by designer/retailer region:");
for (const [r, n] of [...regionCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${r}: ${n}`);
}

const rosterDesigners = MOCK_DESIGNERS.filter((d) =>
  PRIORITY_DESIGNER_IDS.has(d.id)
);
const rosterProducts = MOCK_PRODUCTS.filter(
  (p) => p.designerId && PRIORITY_DESIGNER_IDS.has(p.designerId)
);
console.log(`\nPriority roster designers: ${rosterDesigners.length}/${PRIORITY_DESIGNER_IDS.size}`);
console.log(`Priority roster products: ${rosterProducts.length}`);
console.log(`Priority concept stores seeded: ${PRIORITY_CONCEPT_STORE_IDS.size}`);

const stockImages = MOCK_PRODUCTS.filter((p) =>
  p.imageUrls.some((u) => isStockOrAiImageUrl(u))
);
console.log(
  `\nStock/AI product images remaining: ${stockImages.length}${
    stockImages.length ? " (FAIL)" : " (OK)"
  }`
);
if (stockImages.length) {
  stockImages.slice(0, 5).forEach((p) => console.log(`  - ${p.id}: ${p.imageUrls[0]}`));
}

const feminineAfro: BuildLookAnswers = {
  styleDirections: ["afrofuturism"],
  clothingPresentation: ["Feminine"],
  dressingFor: "Event",
  location: "New York",
  climate: "Summer",
  independentDesigners: true,
  footwear: { inclusion: "yes", types: ["Any"] },
};

const ranked = searchCatalog(
  {
    aesthetics: ["afrofuturism", "tailored", "artisanal"],
    independentOnly: false,
    department: "womenswear",
  },
  ["Feminine"]
);

const mascOnlyTop = ranked.slice(0, 12).filter(
  (p) =>
    p.presentationTags.includes("masculine") &&
    !p.presentationTags.includes("feminine") &&
    p.departmentTags.includes("menswear") &&
    !p.departmentTags.includes("womenswear")
);

console.log(`\nFeminine + Afrofuturism — top 12 masculine-only hits: ${mascOnlyTop.length}`);
if (mascOnlyTop.length) {
  mascOnlyTop.forEach((p) => console.log(`  - ${p.name} (${p.id})`));
} else {
  console.log("  (OK — no mismatched masculine-only pieces in top results)");
}

const signatures = new Set<string>();
const RUNS = 8;
for (let i = 0; i < RUNS; i++) {
  const { looks } = generateLookbookFromBuild(feminineAfro);
  const sig = looks
    .flatMap((l) => l.productIds ?? [])
    .sort()
    .join("|");
  signatures.add(sig);
}

console.log(`\nLookbook variety (${RUNS} runs, Feminine + Afrofuturism, independent prioritized):`);
console.log(`  Unique product sets: ${signatures.size}/${RUNS}`);
if (signatures.size < 3) {
  console.log("  WARN — low variety; expand catalog or check shuffle");
} else {
  console.log("  OK");
}

const sourceSpread = new Set<string>();
for (let i = 0; i < 5; i++) {
  const { looks } = generateLookbookFromBuild({
    ...feminineAfro,
    location: "Global",
    styleDirections: ["tokyo-street", "thai-vietnamese-street"],
  });
  for (const lid of looks.flatMap((l) => l.productIds ?? [])) {
    const p = MOCK_PRODUCTS.find((x) => x.id === lid);
    if (p) sourceSpread.add(regionFor(p.designerCity ?? p.retailerCity));
  }
}
console.log(`\nGlobal source spread (5 multi-city runs): ${[...sourceSpread].join(", ")}`);

console.log("\n=== Done ===");
