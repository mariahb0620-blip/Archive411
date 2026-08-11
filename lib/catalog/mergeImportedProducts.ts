import fs from "fs";
import path from "path";
import type { Product } from "@/app/types/domain";

const VERIFIED_PRODUCTS_PATH = path.join(
  process.cwd(),
  "data",
  "catalog",
  "import",
  "verified-products.json"
);

export function loadVerifiedProductsFile(): Product[] {
  if (!fs.existsSync(VERIFIED_PRODUCTS_PATH)) return [];
  const raw = JSON.parse(fs.readFileSync(VERIFIED_PRODUCTS_PATH, "utf8"));
  return Array.isArray(raw) ? (raw as Product[]) : [];
}

/** Upsert imported products into verified-products.json by id. */
export function mergeIntoVerifiedProductsFile(incoming: Product[]): Product[] {
  const existing = loadVerifiedProductsFile();
  const byId = new Map<string, Product>();
  for (const p of existing) byId.set(p.id, p);
  for (const p of incoming) {
    if (p.verificationStatus === "verified") byId.set(p.id, p);
  }
  const merged = [...byId.values()];
  fs.mkdirSync(path.dirname(VERIFIED_PRODUCTS_PATH), { recursive: true });
  fs.writeFileSync(VERIFIED_PRODUCTS_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  return merged;
}
