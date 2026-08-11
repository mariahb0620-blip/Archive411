/**
 * Curated catalog import — run: npm run catalog:import [--dry-run] [path]
 * Default input: data/catalog/import/batch-*.json (excludes verified-products.json)
 */
import fs from "fs";
import path from "path";
import { ingestImportRecords } from "../lib/catalog/ingest";
import { mergeIntoVerifiedProductsFile } from "../lib/catalog/mergeImportedProducts";
import { filterRecommendationEligible } from "../lib/catalog/isRecommendationEligible";
import type { ImportProductRecord } from "../lib/catalog/types";

const IMPORT_DIR = path.join(process.cwd(), "data", "catalog", "import");
const SKIP_FILES = new Set(["verified-products.json", "example-record.json"]);

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

const dryRun = process.argv.includes("--dry-run");
const inputArg = process.argv.find((a) => a.endsWith(".json") && !a.startsWith("-"));

function loadRecords(): ImportProductRecord[] {
  const records: ImportProductRecord[] = [];
  const dir = inputArg ? path.dirname(path.resolve(inputArg)) : IMPORT_DIR;

  const files = inputArg
    ? [path.resolve(inputArg)]
    : fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((f) => f.endsWith(".json") && !SKIP_FILES.has(f))
          .map((f) => path.join(dir, f))
      : [];

  if (!files.length) {
    console.error(
      "No import JSON files found. Add batch-*.json to data/catalog/import/ or pass a file path."
    );
    process.exit(1);
  }

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as
      | ImportProductRecord[]
      | { products: ImportProductRecord[] };
    const batch = Array.isArray(raw) ? raw : raw.products;
    if (!batch?.length) {
      console.warn(`Skipping empty file: ${file}`);
      continue;
    }
    records.push(...batch);
    console.log(`Loaded ${batch.length} records from ${path.basename(file)}`);
  }
  return records;
}

async function main() {
  console.log("=== Archive411 catalog import ===\n");
  if (dryRun) console.log("DRY RUN — no file or Supabase writes\n");

  const records = loadRecords();
  const enrichTags = process.argv.includes("--enrich-tags");
  const { products, summary } = await ingestImportRecords(records, {
    dryRun,
    skipFetch: true,
    enrichTags,
  });

  const verifiedProducts = products.filter((p) => p.verificationStatus === "verified");

  console.log("\n--- Import summary ---");
  console.log(`Added/previewed: ${summary.added}`);
  console.log(`Verified: ${summary.verified}`);
  console.log(`Rejected: ${summary.rejected}`);
  console.log(`Needs manual review: ${summary.needsManualReview}`);

  if (summary.errors.length) {
    console.log("\nErrors:");
    summary.errors.slice(0, 15).forEach((e) => console.log(`  ${e}`));
  }

  if (!dryRun && verifiedProducts.length) {
    const merged = mergeIntoVerifiedProductsFile(verifiedProducts);
    const eligible = filterRecommendationEligible(merged);
    console.log(`\nMerged ${verifiedProducts.length} product(s) into verified-products.json`);
    console.log(`Local import pool: ${merged.length} total, ${eligible.length} recommendation-eligible`);
  }

  if (!dryRun && products.length && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("\nSupabase credentials missing — import validated only");
      process.exit(summary.rejected > 0 ? 1 : 0);
    }
    const supabase = createClient(url, key);
    for (const p of products) {
      const { error } = await supabase.from("products").upsert({
        id: p.id,
        name: p.name,
        product_url: p.productUrl,
        image_urls: p.imageUrls,
        category: p.category,
        subcategory: p.subcategory,
        available_sizes: p.availableSizes,
        price: p.price,
        currency: p.currency,
        designer_id: p.designerId,
        aesthetic_tags: p.aestheticTags,
        presentation_tags: p.presentationTags,
        occasion_tags: p.occasionTags,
        climate_tags: p.climateTags,
        department_tags: p.departmentTags,
        style_tags: p.styleTags ?? [],
        season_tags: p.seasonTags ?? [],
        color_tags: p.colorTags ?? [],
        inventory_status: p.inventoryStatus,
        source_url: p.sourceUrl,
        source_type: p.sourceType,
        image_source: p.imageSource,
        verified: p.verified,
        verification_status: p.verificationStatus,
        verified_at: p.verifiedAt,
        last_checked_at: p.lastCheckedAt,
        verification_method: p.verificationMethod,
        last_verified_at: p.lastVerifiedAt,
        updated_at: p.updatedAt,
        is_reference_example: false,
        shipping_destinations: p.shippingDestinations,
        condition: p.condition,
      });
      if (error) summary.errors.push(`${p.id}: ${error.message}`);
    }
    console.log(`\nUpserted ${products.length} products to Supabase`);
  } else if (!dryRun && verifiedProducts.length) {
    console.log("\nRun npm run catalog:seed to sync full catalog to Supabase.");
  }

  console.log(failed(summary) ? "\n=== IMPORT FAILED ===" : "\n=== IMPORT COMPLETE ===");
  process.exit(failed(summary) ? 1 : 0);
}

function failed(summary: { rejected: number; errors: string[] }): boolean {
  return summary.rejected > 0 && summary.errors.length > 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
