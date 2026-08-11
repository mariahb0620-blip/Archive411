/**
 * Sample OpenAI tag enrichment for verified products only.
 * Run: npm run catalog:enrich-sample
 * Optional: npm run catalog:enrich-sample -- --ids=beta-guape-heels,beta-telfar-bag
 * Optional: npm run catalog:enrich-sample -- --report
 *
 * Does NOT write to betaCatalog.ts or Supabase — review output first.
 */
import fs from "fs";
import path from "path";
import { BETA_PRODUCTS } from "../app/data/betaCatalog";
import { filterRecommendationEligible } from "../lib/catalog/isRecommendationEligible";
import { enrichVerifiedProducts } from "../lib/catalog/enrichTags";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

function argValue(prefix: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${prefix}=`));
  return hit?.slice(prefix.length + 1);
}

async function main() {
  console.log("=== Archive411 catalog enrichment sample ===\n");

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY not set — add to .env.local or export for this run.");
    process.exit(1);
  }

  const limit = Number(argValue("--limit") ?? 3);
  const idsArg = argValue("--ids");
  const ids = idsArg ? idsArg.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
  const writeReport = process.argv.includes("--report");

  const eligible = filterRecommendationEligible(BETA_PRODUCTS);
  console.log(`Verified eligible pool: ${eligible.length} products`);
  console.log(`Sample size: ${ids?.length ?? limit}\n`);

  const results = await enrichVerifiedProducts(BETA_PRODUCTS, { limit, ids });

  if (!results.length) {
    console.error("No verified products matched sample criteria.");
    process.exit(1);
  }

  const reportPayload = results.map(({ product, before, after }) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    before,
    after,
    enrichedAt: new Date().toISOString(),
  }));

  if (writeReport) {
    const reportDir = path.join(process.cwd(), "data", "catalog", "import", "enrichment-reviews");
    fs.mkdirSync(reportDir, { recursive: true });
    const reportPath = path.join(
      reportDir,
      `enrichment-${Date.now()}.json`
    );
    fs.writeFileSync(reportPath, `${JSON.stringify(reportPayload, null, 2)}\n`, "utf8");
    console.log(`Report written: ${reportPath}\n`);
  }

  for (const { product, before, after } of results) {
    console.log("─".repeat(60));
    console.log(`${product.id} — ${product.name}`);
    console.log(`Category: ${product.category}${product.subcategory ? ` / ${product.subcategory}` : ""}`);
    if (after.skipped) {
      console.log(`SKIPPED: ${after.reason}`);
      continue;
    }
    console.log("\nBEFORE:");
    console.log(JSON.stringify(before, null, 2));
    console.log("\nAFTER:");
    console.log(JSON.stringify(after, null, 2));
    console.log("");
  }

  const skipped = results.filter((r) => r.after.skipped).length;
  console.log("--- Summary ---");
  console.log(`Enriched: ${results.length - skipped}/${results.length}`);
  if (writeReport) {
    console.log("Review report saved under data/catalog/import/enrichment-reviews/");
  } else {
    console.log("No catalog files modified — use --report to save review JSON.");
  }
  console.log("\n=== Sample enrichment complete ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
