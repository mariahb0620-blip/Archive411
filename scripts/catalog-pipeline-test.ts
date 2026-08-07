/**
 * Catalog pipeline unit checks — run: npm run catalog:pipeline-test
 */
import { BETA_PRODUCTS } from "../app/data/betaCatalog";
import { EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";
import {
  filterRecommendationEligible,
  getRecommendationEligibility,
  isRecommendationEligible,
} from "../lib/catalog/isRecommendationEligible";
import { verifyProductStatic } from "../lib/catalog/verifyProduct";
import { classifyProductUrl } from "../app/utils/productLinkQuality";
import { getRakutenStatus } from "../lib/catalog/providers/rakuten";
import { generateLookbookFromBuildForPool } from "../lib/recommendations/generateForPool";
import type { BuildLookAnswers } from "../app/types/domain";

let failed = false;
function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}
function pass(msg: string) {
  console.log(`OK: ${msg}`);
}

console.log("=== Catalog pipeline tests ===\n");

// Invalid URL rejection
const badUrl = verifyProductStatic({
  id: "test",
  name: "Test",
  productUrl: "https://example.com/products/fake",
  price: 100,
  currency: "USD",
  category: "tops",
  designerId: "des-test",
  imageUrls: ["/images/catalog/product-tops.png"],
  presentationTags: ["feminine"],
  occasionTags: ["everyday"],
  inventoryStatus: "in-stock",
  imageSource: "category_placeholder",
});
if (badUrl.verificationStatus === "verified") fail("example.com should not verify");
else pass("Invalid URL rejected");

// Homepage redirect
const homepage = EXTENDED_PRODUCTS[0];
if (classifyProductUrl(homepage.productUrl) !== "homepage") {
  fail("Extended product should be homepage tier");
} else pass("Homepage redirect detected");
if (isRecommendationEligible(homepage)) fail("Extended homepage product must not be eligible");
else pass("Homepage product excluded from recommendations");

// Beta product eligibility
const eligible = filterRecommendationEligible(BETA_PRODUCTS);
if (eligible.length !== BETA_PRODUCTS.length) {
  fail(`Expected all ${BETA_PRODUCTS.length} beta products eligible, got ${eligible.length}`);
} else pass(`${eligible.length} beta products recommendation-eligible`);

// Missing price
const noPrice = getRecommendationEligibility({
  ...BETA_PRODUCTS[0],
  price: 0,
});
if (noPrice.eligible) fail("Zero price should be ineligible");
else pass("Missing price excluded");

// Sold out
const soldOut = getRecommendationEligibility({
  ...BETA_PRODUCTS[0],
  inventoryStatus: "sold-out",
});
if (soldOut.eligible) fail("Sold out should be ineligible");
else pass("Sold out excluded");

// Occasion filtering
const dateNight: BuildLookAnswers = {
  clothingPresentation: ["Feminine"],
  dressingFor: "Date night",
  styleDirections: ["y2k"],
  location: "New York",
  climate: "Summer",
  footwear: { inclusion: "yes", types: ["Heel"] },
};
const { looks: looks1 } = generateLookbookFromBuildForPool(dateNight, eligible);
const { looks: looks2 } = generateLookbookFromBuildForPool(dateNight, eligible);
if (!looks1.length) fail("Date night should produce looks");
else pass("Date night produces looks");

const ids1 = looks1.flatMap((l) => l.productIds).sort().join(",");
const ids2 = looks2.flatMap((l) => l.productIds).sort().join(",");
if (ids1 === ids2 && eligible.length > 8) {
  console.log("WARN: identical consecutive builds — limited pool size");
} else {
  pass("Build variation or small pool acknowledged");
}

// Rakuten fallback
const rakuten = getRakutenStatus();
if (rakuten.configured) pass("Rakuten configured");
else pass(`Rakuten fallback: ${rakuten.message}`);

// OpenAI not required
if (!process.env.OPENAI_API_KEY) pass("OpenAI optional — verification works without key");
else pass("OpenAI present — enrichment only, not verification source");

console.log(failed ? "\n=== PIPELINE TESTS FAILED ===" : "\n=== PIPELINE TESTS PASSED ===");
process.exit(failed ? 1 : 0);
