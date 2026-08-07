/**
 * Catalog staleness report — run: npm run catalog:stale
 */
import fs from "fs";
import path from "path";
import { BETA_PRODUCTS } from "../app/data/betaCatalog";
import { EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";

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

const MAX_AGE_DAYS = Number(process.env.VERIFICATION_MAX_AGE_DAYS ?? 7);
const ALL = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];
const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

function isStale(p: (typeof ALL)[number]): boolean {
  const checked = p.lastCheckedAt ?? p.lastVerifiedAt;
  if (!checked) return true;
  return new Date(checked).getTime() < cutoff;
}

const verified = ALL.filter((p) => p.verificationStatus === "verified");
const stale = ALL.filter((p) => p.verificationStatus === "verified" && isStale(p));
const broken = ALL.filter((p) => p.verificationStatus === "broken_url");
const unavailable = ALL.filter((p) => p.verificationStatus === "unavailable");
const manualReview = ALL.filter((p) => p.verificationStatus === "manual_review");
const homepage = ALL.filter((p) => p.verificationStatus === "homepage_redirect");

console.log("=== Archive411 catalog staleness ===\n");
console.log(`VERIFICATION_MAX_AGE_DAYS: ${MAX_AGE_DAYS}`);
console.log(`Cutoff: ${new Date(cutoff).toISOString()}\n`);
console.log(`Verified active: ${verified.length - stale.length}`);
console.log(`Stale (verified, not checked recently): ${stale.length}`);
console.log(`Broken URL: ${broken.length}`);
console.log(`Unavailable: ${unavailable.length}`);
console.log(`Manual review: ${manualReview.length}`);
console.log(`Homepage redirect (not shoppable): ${homepage.length}`);

if (stale.length) {
  console.log("\nStale products:");
  for (const p of stale.slice(0, 20)) {
    console.log(`  ${p.id} — last checked ${p.lastCheckedAt ?? p.lastVerifiedAt}`);
  }
  if (stale.length > 20) console.log(`  ... and ${stale.length - 20} more`);
}

console.log("\n=== Staleness report complete ===");
