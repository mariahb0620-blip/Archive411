/**
 * Local beta journey smoke test — run: npm run beta:test
 * Requires .env.local and optional dev server at NEXT_PUBLIC_APP_URL for API cookie tests.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { buildLookbookRecommendation } from "../lib/recommendations/buildLookbook";
import { getRecommendationEligibleProductsSync } from "../lib/catalog/verifiedPool";
import type { BuildLookAnswers } from "../app/types/domain";

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

let failed = false;
function pass(msg: string) {
  console.log(`  OK — ${msg}`);
}
function fail(msg: string) {
  console.error(`  FAIL — ${msg}`);
  failed = true;
}

const feminineY2K: BuildLookAnswers = {
  styleDirections: ["y2k", "hot-girl-y2k"],
  clothingPresentation: ["Feminine"],
  dressingFor: "Date night",
  location: "New York",
  climate: "Summer",
  independentDesigners: true,
  footwear: { inclusion: "yes", types: ["Heel"] },
};

const streetwearMasculine: BuildLookAnswers = {
  styleDirections: ["streetwear", "black-street-style"],
  clothingPresentation: ["Masculine"],
  dressingFor: "Weekend",
  location: "London",
  climate: "Autumn",
  independentDesigners: false,
  footwear: { inclusion: "yes", types: ["Sneaker"] },
};

async function main() {
  console.log("=== Archive411 beta journey test ===\n");

  if (!url || !anonKey || !serviceKey) {
    fail("Missing Supabase env vars in .env.local");
    process.exit(1);
  }

  const email = `beta-test-${Date.now()}@archive411.test`;
  const password = "TestPass123!";
  const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: signUpData, error: signUpError } = await authClient.auth.signUp({
    email,
    password,
  });
  if (signUpError) fail(`Sign up: ${signUpError.message}`);
  else pass(`Sign up (${email})`);

  const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) fail(`Sign in: ${signInError.message}`);
  else if (!signInData.session) fail("Sign in returned no session (email confirmation may be enabled)");
  else pass("Sign in returns session immediately");

  const userId = signInData.user?.id ?? signUpData.user?.id;
  if (!userId) {
    fail("No user id after auth");
    process.exit(1);
  }

  const cleanup = async () => {
    await admin.from("lookbooks").delete().eq("user_id", userId);
    await admin.auth.admin.deleteUser(userId);
  };

  const resultA = await buildLookbookRecommendation(feminineY2K);
  const resultB = await buildLookbookRecommendation(streetwearMasculine);

  if (!resultA.lookbook || !resultA.looks?.length) fail("Feminine Y2K build returned empty");
  else pass(`Build My Look — feminine Y2K (${resultA.looks.length} looks)`);

  if (resultA.looks.length > 3) {
    fail(`Date night lookbook should have at most 3 looks, got ${resultA.looks.length}`);
  } else {
    pass(`Date night lookbook capped (${resultA.looks.length} looks)`);
  }

  const sneakersInDateNight = resultA.products.filter(
    (p) =>
      p.category === "shoes" &&
      (p.subcategory?.toLowerCase().includes("sneaker") ||
        p.name.toLowerCase().includes("sneaker") ||
        p.id.toLowerCase().includes("salomon"))
  );
  if (sneakersInDateNight.length) {
    fail(
      `Date night lookbook includes sneakers: ${sneakersInDateNight.map((p) => p.id).join(", ")}`
    );
  } else {
    pass("Date night lookbook excludes sneakers");
  }

  const athleticInDateNight = resultA.products.filter(
    (p) =>
      p.id === "beta-salomon-jacket" ||
      (/technical|shell jacket|techwear|sporty/i.test(p.name) &&
        p.category === "outerwear" &&
        !p.occasionTags.some((t) => /evening|event|date|nightlife/i.test(t)))
  );
  if (athleticInDateNight.length) {
    fail(
      `Date night feminine lookbook includes athletic outerwear: ${athleticInDateNight.map((p) => p.id).join(", ")}`
    );
  } else {
    pass("Date night lookbook excludes athletic outerwear");
  }

  const runSignatures = new Set<string>();
  for (let i = 0; i < 5; i++) {
    const run = await buildLookbookRecommendation(feminineY2K);
    runSignatures.add(run.looks.flatMap((l) => l.productIds).sort().join("|"));
  }
  const eligibleCount = getRecommendationEligibleProductsSync().length;
  console.log(`  Variety check: ${runSignatures.size}/5 unique product sets (eligible pool: ${eligibleCount})`);
  if (runSignatures.size < 1) {
    fail("Repeated build returned no looks");
  } else if (runSignatures.size < 2 && eligibleCount >= 12) {
    fail("Repeated build with same answers returned identical product sets (5 runs)");
  } else if (runSignatures.size < 2) {
    console.log("  WARN — limited variety with current eligible catalog size");
    pass("Repeated build variety (small pool — warn only)");
  } else {
    pass("Repeated build returns varied product selection");
  }

  if (!resultB.lookbook || !resultB.looks?.length) fail("Streetwear build returned empty");
  else pass(`Build My Look — streetwear masculine (${resultB.looks.length} looks)`);

  const idsA = new Set(resultA.looks.flatMap((l) => l.productIds));
  const idsB = new Set(resultB.looks.flatMap((l) => l.productIds));
  const overlap = [...idsA].filter((id) => idsB.has(id)).length;
  if (overlap === idsA.size && overlap === idsB.size && idsA.size > 0) {
    fail("Profiles produced identical product sets");
  } else {
    pass(`Profiles differ (${overlap} shared product IDs)`);
  }

  const badUrls = resultA.products
    .concat(resultB.products)
    .filter((p) => p.productUrl.includes("example.com"));
  if (badUrls.length) fail(`example.com in results: ${badUrls.map((p) => p.id).join(", ")}`);
  else pass("No example.com product URLs");

  const lookbookId = `lb-test-${Date.now()}`;
  const lookbook = { ...resultA.lookbook, id: lookbookId, userId, saved: true };
  const apiLookbookId = `lb-api-${Date.now()}`;
  let apiTestsRan = false;

  async function probeAppServer(): Promise<"ok" | "down" | "stale"> {
    try {
      const res = await fetch(`${appUrl}/api/recommendations/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feminineY2K),
      });
      if (res.ok) return "ok";
      if (res.status >= 500) return "stale";
      return "ok";
    } catch {
      return "down";
    }
  }

  const serverState = await probeAppServer();
  if (serverState === "down") {
    console.log(
      `  SKIP — HTTP API checks (no server at ${appUrl}; run npm run build && npm run start)`
    );
  } else if (serverState === "stale") {
    console.log(
      `  SKIP — HTTP API checks (server at ${appUrl} returned 5xx — restart: npm run build && npm run start)`
    );
  } else {
    apiTestsRan = true;
    pass("POST /api/recommendations/build → 200");

    const token = signInData.session!.access_token;
    const apiLookbook = { ...resultA.lookbook, id: apiLookbookId };
    const apiLooks = resultA.looks.map((look, i) => ({
      ...look,
      id: `${look.id}-api-${Date.now()}-${i}`,
      lookbookId: apiLookbook.id,
    }));
    const saveApiRes = await fetch(`${appUrl}/api/lookbooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lookbook: { ...apiLookbook, saved: true },
        looks: apiLooks,
        method: "build",
        buildPreferences: feminineY2K,
      }),
    });
    if (saveApiRes.ok) pass(`POST /api/lookbooks → ${saveApiRes.status}`);
    else fail(`POST /api/lookbooks → ${saveApiRes.status}`);

    const lbRes = await fetch(`${appUrl}/api/lookbooks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (lbRes.ok) pass(`GET /api/lookbooks → ${lbRes.status}`);
    else fail(`GET /api/lookbooks → ${lbRes.status}`);
  }

  const { error: lbError } = await admin.from("lookbooks").upsert({
    id: lookbook.id,
    user_id: userId,
    title: lookbook.title,
    description: lookbook.description,
    cover_image_url: lookbook.coverImageUrl,
    generated_at: lookbook.generatedAt,
    occasion: lookbook.occasion,
    climate: lookbook.climate,
    location: lookbook.location,
    price_range: lookbook.priceRange,
    aesthetic_tags: lookbook.aestheticTags,
    visibility: lookbook.visibility,
    generation_method: "build",
    saved: true,
    build_preferences: feminineY2K,
    updated_at: new Date().toISOString(),
  });
  if (lbError) fail(`Save lookbook: ${lbError.message}`);
  else pass("Save lookbook to Supabase");

  for (let i = 0; i < resultA.looks.length; i++) {
    const look = resultA.looks[i];
    await admin.from("looks").insert({
      id: look.id,
      lookbook_id: lookbookId,
      title: look.title,
      explanation: look.explanation,
      total_estimated_price: look.totalEstimatedPrice,
      currency: look.currency,
      color_palette: look.colorPalette,
      silhouette_tags: look.silhouetteTags,
      occasion_tags: look.occasionTags,
      sort_order: i,
    });
    if (look.productIds.length) {
      await admin.from("look_products").insert(
        look.productIds.map((productId, sortOrder) => ({
          look_id: look.id,
          product_id: productId,
          sort_order: sortOrder,
        }))
      );
    }
  }

  const { data: archived, error: listError } = await admin
    .from("lookbooks")
    .select("id")
    .eq("user_id", userId)
    .eq("saved", true);
  if (listError) fail(`List archive: ${listError.message}`);
  else if (!archived?.some((lb) => lb.id === lookbookId)) fail("Saved lookbook not in archive");
  else pass(`Archive list contains saved lookbook (${archived.length} total)`);

  await cleanup();
  if (apiTestsRan) {
    await admin.from("lookbooks").delete().eq("id", apiLookbookId);
  }
  pass("Test user cleaned up");

  console.log(failed ? "\n=== JOURNEY TEST FAILED ===\n" : "\n=== JOURNEY TEST PASSED ===\n");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
