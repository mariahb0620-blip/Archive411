/**
 * Live deployment journey test — run against Vercel:
 * PLAYWRIGHT_BASE_URL=https://archive411.vercel.app npm run vercel:journey
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
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
const appUrl =
  process.env.PLAYWRIGHT_BASE_URL ||
  (process.env.VERCEL_URL?.startsWith("http")
    ? process.env.VERCEL_URL!
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL === "http://localhost:3000"
        ? "https://archive411.vercel.app"
        : process.env.NEXT_PUBLIC_APP_URL || "https://archive411.vercel.app");

let failed = false;
function pass(msg: string) {
  console.log(`  OK — ${msg}`);
}
function fail(msg: string) {
  console.error(`  FAIL — ${msg}`);
  failed = true;
}

const buildAnswers: BuildLookAnswers = {
  styleDirections: ["y2k", "hot-girl-y2k"],
  clothingPresentation: ["Feminine"],
  dressingFor: "Date night",
  location: "New York",
  climate: "Summer",
  independentDesigners: true,
  footwear: { inclusion: "yes", types: ["Heel"] },
};

const searchPayload = {
  query: "y2k evening",
  aesthetics: ["y2k"],
  occasion: "Date night",
  city: "New York",
  department: "all",
  independentOnly: true,
  includeVintage: true,
};

async function main() {
  console.log(`=== Archive411 Vercel journey test ===`);
  console.log(`Target: ${appUrl}\n`);

  if (!url || !anonKey || !serviceKey) {
    fail("Missing Supabase env vars");
    process.exit(1);
  }

  const introRes = await fetch(`${appUrl}/intro`);
  if (introRes.ok) pass(`GET /intro → ${introRes.status}`);
  else fail(`GET /intro → ${introRes.status}`);

  const email = `vercel-journey-${Date.now()}@archive411.test`;
  const password = "TestPass123!";
  const auth = createClient(url, anonKey, { auth: { persistSession: false } });
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { error: signUpError } = await auth.auth.signUp({ email, password });
  if (signUpError) fail(`Sign up: ${signUpError.message}`);
  else pass(`Sign up (${email})`);

  const { data: signInData, error: signInError } = await auth.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signInData.session) {
    fail(`Sign in: ${signInError?.message ?? "no session"}`);
    process.exit(1);
  }
  pass("Sign in returns session");
  const token = signInData.session.access_token;
  const userId = signInData.user!.id;

  const buildRes = await fetch(`${appUrl}/api/recommendations/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildAnswers),
  });
  if (!buildRes.ok) fail(`POST /api/recommendations/build → ${buildRes.status}`);
  else pass(`POST /api/recommendations/build → ${buildRes.status}`);

  const buildData = (await buildRes.json()) as {
    lookbook: { id: string; title: string };
    looks: { id: string; productIds: string[] }[];
    products: { id: string; category: string }[];
  };

  const lookbookId = buildData.lookbook.id;
  const firstProduct = buildData.products[0];
  if (firstProduct) {
    const replaceRes = await fetch(`${appUrl}/api/products/replace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: firstProduct.category,
        excludeIds: buildData.products.map((p) => p.id),
        answers: buildAnswers,
      }),
    });
    if (replaceRes.ok) pass(`POST /api/products/replace → ${replaceRes.status}`);
    else fail(`POST /api/products/replace → ${replaceRes.status}`);
  }

  const saveRes = await fetch(`${appUrl}/api/lookbooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      lookbook: { ...buildData.lookbook, saved: true },
      looks: buildData.looks,
      method: "build",
      buildPreferences: buildAnswers,
    }),
  });
  if (!saveRes.ok) fail(`POST /api/lookbooks → ${saveRes.status}`);
  else pass("Save lookbook to Archive");

  const listRes = await fetch(`${appUrl}/api/lookbooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listData = listRes.ok ? ((await listRes.json()) as { lookbooks: { id: string }[] }) : null;
  if (!listRes.ok) fail(`GET /api/lookbooks → ${listRes.status}`);
  else if (!listData?.lookbooks.some((lb) => lb.id === lookbookId)) fail("Archive missing saved lookbook");
  else pass(`Archive list contains lookbook (${listData.lookbooks.length} total)`);

  await auth.auth.signOut();
  pass("Sign out");

  const { data: reSignIn, error: reSignInErr } = await auth.auth.signInWithPassword({
    email,
    password,
  });
  if (reSignInErr || !reSignIn.session) fail(`Re-sign in: ${reSignInErr?.message ?? "no session"}`);
  else pass("Sign back in");

  const reToken = reSignIn.session!.access_token;
  const listRes2 = await fetch(`${appUrl}/api/lookbooks`, {
    headers: { Authorization: `Bearer ${reToken}` },
  });
  const listData2 = listRes2.ok ? ((await listRes2.json()) as { lookbooks: { id: string }[] }) : null;
  if (!listRes2.ok) fail(`GET /api/lookbooks after re-login → ${listRes2.status}`);
  else if (!listData2?.lookbooks.some((lb) => lb.id === lookbookId)) {
    fail("Archive empty after sign out / sign in");
  } else pass("Archive persists after sign out / sign in");

  const searchRes = await fetch(`${appUrl}/api/recommendations/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchPayload),
  });
  if (searchRes.ok) pass(`POST /api/recommendations/search → ${searchRes.status}`);
  else fail(`POST /api/recommendations/search → ${searchRes.status}`);

  const surpriseRes = await fetch(`${appUrl}/api/recommendations/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      styleDirections: ["streetwear"],
      clothingPresentation: ["Masculine"],
      dressingFor: "Weekend",
      location: "London",
      climate: "Autumn",
      independentDesigners: false,
      footwear: { inclusion: "no" },
    }),
  });
  if (surpriseRes.ok) pass(`Surprise-style build → ${surpriseRes.status}`);
  else fail(`Surprise-style build → ${surpriseRes.status}`);

  const collectionsRes = await fetch(`${appUrl}/api/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${reToken}`,
    },
    body: JSON.stringify({ name: `QA ${Date.now()}` }),
  });
  if (collectionsRes.ok) pass(`POST /api/collections → ${collectionsRes.status}`);
  else fail(`POST /api/collections → ${collectionsRes.status}`);

  const designersRes = await fetch(`${appUrl}/designers`);
  if (designersRes.ok) pass(`GET /designers → ${designersRes.status}`);
  else fail(`GET /designers → ${designersRes.status}`);

  await admin.from("lookbooks").delete().eq("id", lookbookId);
  await admin.auth.admin.deleteUser(userId);
  pass("Test user cleaned up");

  console.log(failed ? "\n=== VERCEL JOURNEY FAILED ===\n" : "\n=== VERCEL JOURNEY PASSED ===\n");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
