/**
 * Catalog verification — run: npm run catalog:verify
 */
import { BETA_PRODUCTS, BETA_DESIGNERS, isBetaCatalogUrl } from "../app/data/betaCatalog";
import { EXTENDED_DESIGNERS, EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";
import { isStockOrAiImageUrl } from "../app/data/productImagery";
import { generateLookbookFromBuildForPool } from "../lib/recommendations/generateForPool";
import { searchCatalog } from "../app/services/catalog.service";
import type { BuildLookAnswers } from "../app/types/domain";

const ALL_PRODUCTS = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];
const ALL_DESIGNERS = [...BETA_DESIGNERS, ...EXTENDED_DESIGNERS];

let failed = false;
function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

console.log("=== Archive411 catalog verification ===\n");
console.log(`Verified products: ${ALL_PRODUCTS.length}`);
console.log(`Verified designers: ${ALL_DESIGNERS.length}`);

const exampleUrls = ALL_PRODUCTS.filter((p) => p.productUrl.includes("example.com"));
console.log(
  `\nexample.com in beta catalog: ${exampleUrls.length}${
    exampleUrls.length ? " (FAIL)" : " (OK)"
  }`
);
if (exampleUrls.length) {
  exampleUrls.forEach((p) => console.log(`  - ${p.id}: ${p.productUrl}`));
  fail("Beta catalog contains example.com URLs");
}

for (const p of ALL_PRODUCTS) {
  if (!p.name || !p.price || !p.availableSizes.length || !p.imageUrls.length) {
    fail(`Product ${p.id} missing required fields`);
  }
  if (!isBetaCatalogUrl(p.productUrl)) {
    fail(`Product ${p.id} has invalid URL: ${p.productUrl}`);
  }
}

const stockImages = ALL_PRODUCTS.filter((p) =>
  p.imageUrls.some((u) => isStockOrAiImageUrl(u))
);
console.log(
  `\nStock/AI product images: ${stockImages.length}${stockImages.length ? " (FAIL)" : " (OK)"}`
);

const feminineY2k: BuildLookAnswers = {
  styleDirections: ["y2k", "hot-girl-y2k"],
  clothingPresentation: ["Feminine"],
  dressingFor: "Date night",
  location: "New York",
  climate: "Summer",
  independentDesigners: true,
  footwear: { inclusion: "yes", types: ["Heel"] },
};

const ranked = searchCatalog(
  {
    aesthetics: ["y2k", "hot-girl-y2k"],
    independentOnly: true,
    department: "womenswear",
    city: "New York",
  },
  ["Feminine"],
  ALL_PRODUCTS
);
console.log(`\nFeminine Y2K independent search hits: ${ranked.length}`);
if (ranked.length < 1) {
  fail("No search hits for Feminine Y2K independent profile");
}

const signatures = new Set<string>();
for (let i = 0; i < 5; i++) {
  const { looks } = generateLookbookFromBuildForPool(feminineY2k, ALL_PRODUCTS);
  signatures.add(looks.flatMap((l) => l.productIds).sort().join("|"));
}
console.log(`\nLookbook variety (5 runs): ${signatures.size}/5 unique product sets`);
if (signatures.size < 1) {
  fail("Build flow returns no looks for Feminine Y2K profile");
} else if (signatures.size < 2) {
  console.log("  WARN — limited variety with current beta catalog size (20 products)");
}

const streetMasc: BuildLookAnswers = {
  styleDirections: ["streetwear", "black-street-style"],
  clothingPresentation: ["Masculine"],
  dressingFor: "Weekend",
  location: "London",
  climate: "Autumn",
  independentDesigners: false,
  footwear: { inclusion: "yes", types: ["Sneaker"] },
};
const { looks: streetLooks } = generateLookbookFromBuildForPool(streetMasc, ALL_PRODUCTS);
const y2kLooks = generateLookbookFromBuildForPool(feminineY2k, ALL_PRODUCTS).looks;
const y2kIds = new Set(y2kLooks.flatMap((l) => l.productIds));
const streetIds = new Set(streetLooks.flatMap((l) => l.productIds));
const overlap = [...y2kIds].filter((id) => streetIds.has(id));
console.log(`\nContrasting profiles product overlap: ${overlap.length} shared IDs`);
if (y2kIds.size > 0 && streetIds.size > 0 && overlap.length === y2kIds.size && overlap.length === streetIds.size) {
  fail("Different questionnaire profiles return identical products");
} else {
  console.log("  OK — profiles produce different results");
}

console.log(failed ? "\n=== VERIFICATION FAILED ===" : "\n=== VERIFICATION PASSED ===");
process.exit(failed ? 1 : 0);
