/**
 * Catalog coverage report — run: npm run catalog:coverage
 */
import { BETA_PRODUCTS } from "../app/data/betaCatalog";
import { EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";
import {
  filterRecommendationEligible,
  getRecommendationEligibility,
} from "../lib/catalog/isRecommendationEligible";
import type { Product } from "../app/types/domain";

const ALL = [...BETA_PRODUCTS, ...EXTENDED_PRODUCTS];
const ELIGIBLE = filterRecommendationEligible(ALL);

const OCCASIONS = [
  "Date night",
  "Nightlife",
  "Everyday",
  "Work",
  "Events",
  "Travel",
  "Weekend",
  "Warm weather",
  "Cold weather",
];

const PRESENTATIONS = ["feminine", "masculine", "androgynous"];

const CATEGORIES = [
  "tops",
  "bottoms",
  "dresses",
  "knitwear",
  "outerwear",
  "shoes",
  "handbags",
  "jewelry",
  "accessories",
];

function normalizeOccasion(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("date")) return "Date night";
  if (lower.includes("night") || lower.includes("evening")) return "Nightlife";
  if (lower.includes("work")) return "Work";
  if (lower.includes("travel")) return "Travel";
  if (lower.includes("weekend")) return "Weekend";
  if (lower.includes("event") || lower.includes("formal")) return "Events";
  if (lower.includes("everyday")) return "Everyday";
  if (lower.includes("warm") || lower.includes("summer")) return "Warm weather";
  if (lower.includes("cold") || lower.includes("winter")) return "Cold weather";
  return tag;
}

function matchesPresentation(product: Product, presentation: string): boolean {
  const tags = product.presentationTags.map((t) => t.toLowerCase());
  if (presentation === "androgynous") {
    return tags.includes("androgynous") || tags.includes("gender-neutral");
  }
  return tags.includes(presentation);
}

function matchesOccasion(product: Product, occasion: string): boolean {
  const mapped = product.occasionTags.map(normalizeOccasion);
  return mapped.includes(occasion) || product.occasionTags.some((t) => t.toLowerCase().includes(occasion.split(" ")[0].toLowerCase()));
}

function priceBand(price: number, currency: string): string {
  const usd = currency === "GBP" ? price * 1.27 : currency === "EUR" ? price * 1.08 : price;
  if (usd < 100) return "under-100";
  if (usd < 200) return "100-200";
  if (usd < 250) return "200-250";
  if (usd < 500) return "250-500";
  return "500+";
}

console.log("=== Archive411 catalog coverage ===\n");
console.log(`Total products: ${ALL.length}`);
console.log(`Recommendation-eligible: ${ELIGIBLE.length}`);
console.log(`Beta (SKU URLs): ${BETA_PRODUCTS.length}`);
console.log(`Extended (browse-only): ${EXTENDED_PRODUCTS.length}\n`);

const statusCounts = new Map<string, number>();
for (const p of ALL) {
  const status = p.verificationStatus ?? "unknown";
  statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
}
console.log("Verification status:");
for (const [status, count] of [...statusCounts.entries()].sort()) {
  console.log(`  ${status}: ${count}`);
}

console.log("\n--- By occasion × presentation (eligible only) ---");
for (const occasion of OCCASIONS) {
  console.log(`\n${occasion}`);
  for (const pres of PRESENTATIONS) {
    const count = ELIGIBLE.filter(
      (p) => matchesOccasion(p, occasion) && matchesPresentation(p, pres)
    ).length;
    console.log(`  ${pres}: ${count} eligible products`);
  }
}

console.log("\n--- Category shortages (eligible, date night × feminine) ---");
const dateFem = ELIGIBLE.filter(
  (p) => matchesOccasion(p, "Date night") && matchesPresentation(p, "feminine")
);
for (const cat of CATEGORIES) {
  const count = dateFem.filter((p) => p.category === cat).length;
  if (count < 3) console.log(`  feminine/date-night/${cat}: ${count}`);
}

console.log("\n--- By category (eligible) ---");
for (const cat of CATEGORIES) {
  console.log(`  ${cat}: ${ELIGIBLE.filter((p) => p.category === cat).length}`);
}

console.log("\n--- By designer (eligible) ---");
const byDesigner = new Map<string, number>();
for (const p of ELIGIBLE) {
  const key = p.designerId ?? "unknown";
  byDesigner.set(key, (byDesigner.get(key) ?? 0) + 1);
}
for (const [id, count] of [...byDesigner.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${id}: ${count}`);
}

console.log("\n--- By price band (eligible) ---");
const bands = new Map<string, number>();
for (const p of ELIGIBLE) {
  const band = priceBand(p.price, p.currency);
  bands.set(band, (bands.get(band) ?? 0) + 1);
}
for (const [band, count] of [...bands.entries()].sort()) {
  console.log(`  ${band}: ${count}`);
}

const ineligible = ALL.filter((p) => !getRecommendationEligibility(p).eligible);
if (ineligible.length) {
  console.log(`\n--- Ineligible (${ineligible.length}) — top reasons ---`);
  const reasonCounts = new Map<string, number>();
  for (const p of ineligible) {
    for (const r of getRecommendationEligibility(p).reasons) {
      reasonCounts.set(r, (reasonCounts.get(r) ?? 0) + 1);
    }
  }
  for (const [reason, count] of [...reasonCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${reason}: ${count}`);
  }
}

console.log("\n=== Coverage report complete ===");
