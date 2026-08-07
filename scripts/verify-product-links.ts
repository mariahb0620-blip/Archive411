/**
 * Verify catalog product links are live and product-specific.
 * Run: npm run catalog:verify-links
 * OpenAI is optional and NEVER determines whether a product exists — warn only.
 */
import fs from "fs";
import path from "path";
import { BETA_PRODUCTS } from "../app/data/betaCatalog";
import { EXTENDED_PRODUCTS } from "../app/data/extendedCatalog";
import {
  classifyProductUrl,
  isProductSpecificUrl,
} from "../app/utils/productLinkQuality";

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

const BETA = BETA_PRODUCTS;
const EXTENDED = EXTENDED_PRODUCTS;
let failed = false;

function fail(msg: string) {
  console.error(`  FAIL — ${msg}`);
  failed = true;
}

function pass(msg: string) {
  console.log(`  OK — ${msg}`);
}

async function fetchCheck(url: string): Promise<{ ok: boolean; status: number; title?: string }> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Archive411-CatalogBot/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    const html = res.ok ? await res.text() : "";
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return {
      ok: res.ok,
      status: res.status,
      title: titleMatch?.[1]?.trim(),
    };
  } catch (err) {
    return { ok: false, status: 0, title: String(err) };
  }
}

async function aiVerifyProductMatch(
  productName: string,
  url: string,
  pageTitle?: string
): Promise<boolean | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You verify e-commerce links. Reply with JSON only: {\"match\":true|false,\"reason\":\"...\"}. match=true only if the URL appears to be a specific product page that could plausibly sell the named item (same brand/category). match=false for homepages, collection pages, or unrelated products.",
        },
        {
          role: "user",
          content: JSON.stringify({
            productName,
            url,
            pageTitle: pageTitle ?? null,
          }),
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(content) as { match?: boolean };
    return Boolean(parsed.match);
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Archive411 product link verification ===\n");
  console.log(`Beta products: ${BETA.length}`);
  console.log(`Extended products: ${EXTENDED.length}\n`);

  let productSpecific = 0;
  let browseOnly = 0;
  let dead = 0;

  const verifyOne = async (p: (typeof BETA)[number], requireProduct: boolean) => {
    const tier = classifyProductUrl(p.productUrl);
    console.log(`${p.id} — ${p.name}`);
    console.log(`  URL: ${p.productUrl}`);
    console.log(`  Tier: ${tier}`);

    if (tier !== "product") {
      browseOnly++;
      if (requireProduct) fail(`${p.id} is not a product-specific URL (${tier})`);
      else console.log(`  WARN — browse-only URL (${tier})`);
    } else {
      productSpecific++;
    }

    const check = await fetchCheck(p.productUrl);
    if (!check.ok) {
      dead++;
      if (requireProduct) fail(`${p.id} HTTP ${check.status || "error"}`);
      else console.log(`  WARN — HTTP ${check.status || "error"} (may block bots)`);
    } else {
      pass(`${p.id} live (HTTP ${check.status})`);
    }

    if (check.ok && tier === "product" && process.env.OPENAI_API_KEY) {
      const aiMatch = await aiVerifyProductMatch(p.name, p.productUrl, check.title);
      if (aiMatch === false) {
        console.log(`  WARN — ${p.id} AI suggests page may not match product (“${check.title ?? "no title"}”) — manual review recommended`);
      } else if (aiMatch === true) {
        pass(`${p.id} AI: plausible product page match (advisory only)`);
      }
    }

    console.log("");
  };

  for (const p of BETA) {
    await verifyOne(p, true);
  }
  for (const p of EXTENDED) {
    await verifyOne(p, false);
  }

  const total = BETA.length + EXTENDED.length;
  console.log("--- Summary ---");
  console.log(`Product-specific URLs: ${productSpecific}/${total}`);
  console.log(`Dead links: ${dead}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY not set — skipped AI product-page match checks");
  }

  console.log(failed ? "\n=== LINK VERIFICATION FAILED ===" : "\n=== LINK VERIFICATION PASSED ===");
  process.exit(failed ? 1 : 0);
}

main();
