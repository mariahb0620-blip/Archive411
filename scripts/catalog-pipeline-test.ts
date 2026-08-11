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
import {
  validateAndNormalizeEnrichment,
  enrichProductTags,
  applyEnrichmentToProduct,
} from "../lib/catalog/enrichTags";
import { assertNoForbiddenEnrichmentFields } from "../lib/catalog/tagAllowlists";
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

async function main() {
  console.log("=== Catalog pipeline tests ===\n");

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

  const homepage = EXTENDED_PRODUCTS[0];
  if (classifyProductUrl(homepage.productUrl) !== "homepage") {
    fail("Extended product should be homepage tier");
  } else pass("Homepage redirect detected");
  if (isRecommendationEligible(homepage)) fail("Extended homepage product must not be eligible");
  else pass("Homepage product excluded from recommendations");

  const eligible = filterRecommendationEligible(BETA_PRODUCTS);
  if (eligible.length !== BETA_PRODUCTS.length) {
    fail(`Expected all ${BETA_PRODUCTS.length} beta products eligible, got ${eligible.length}`);
  } else pass(`${eligible.length} beta products recommendation-eligible`);

  const noPrice = getRecommendationEligibility({ ...BETA_PRODUCTS[0], price: 0 });
  if (noPrice.eligible) fail("Zero price should be ineligible");
  else pass("Missing price excluded");

  const soldOut = getRecommendationEligibility({
    ...BETA_PRODUCTS[0],
    inventoryStatus: "sold-out",
  });
  if (soldOut.eligible) fail("Sold out should be ineligible");
  else pass("Sold out excluded");

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

  const rakuten = getRakutenStatus();
  if (rakuten.configured) pass("Rakuten configured");
  else pass(`Rakuten fallback: ${rakuten.message}`);

  try {
    assertNoForbiddenEnrichmentFields({ styleTags: ["y2k"], productUrl: "https://evil.com" });
    fail("Should reject forbidden enrichment fields");
  } catch {
    pass("Forbidden enrichment fields rejected");
  }

  const sampleProduct = BETA_PRODUCTS[0];
  const normalized = validateAndNormalizeEnrichment(sampleProduct, {
    styleTags: ["y2k", "hot-girl-y2k", "INVALID_STYLE_XYZ"],
    occasionTags: ["date night", "fake-occasion"],
    presentationTags: ["feminine"],
    climateTags: ["summer", "warm"],
    colorTags: ["black", "not-a-color"],
    stylingNotes: "Evening heel styling for date night looks.",
  });
  if (normalized.styleTags.includes("invalid_style_xyz")) fail("Invalid style tag leaked through");
  else pass("Style tags filtered to allowlist");
  if (!normalized.occasionTags.some((t) => t.includes("date"))) fail("Valid occasion tag missing");
  else pass("Occasion tags validated");
  if (normalized.colorTags.includes("not-a-color")) fail("Invalid color tag leaked through");
  else pass("Color tags filtered");

  const enriched = applyEnrichmentToProduct(sampleProduct, normalized);
  if (enriched.productUrl !== sampleProduct.productUrl) fail("Enrichment must not change productUrl");
  if (enriched.price !== sampleProduct.price) fail("Enrichment must not change price");
  if (enriched.verificationStatus !== sampleProduct.verificationStatus) {
    fail("Enrichment must not change verificationStatus");
  }
  if (!enriched.styleTags?.length) fail("Enrichment should apply styleTags");
  else pass("applyEnrichmentToProduct mutates tag fields only");

  const unverified = await enrichProductTags({
    ...sampleProduct,
    verificationStatus: "homepage_redirect",
    verified: false,
  });
  if (!unverified.skipped) fail("Unverified product must skip enrichment");
  else pass("Unverified product skips OpenAI enrichment");

  if (!process.env.OPENAI_API_KEY) {
    const skipped = await enrichProductTags(sampleProduct);
    if (!skipped.skipped) fail("Missing API key should skip enrichment");
    else pass("OpenAI optional — deterministic fallback when key missing");
  } else {
    pass("OpenAI present — enrichment only, not verification source");
  }

  console.log(failed ? "\n=== PIPELINE TESTS FAILED ===" : "\n=== PIPELINE TESTS PASSED ===");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
