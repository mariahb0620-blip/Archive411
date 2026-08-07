/**
 * Two-user RLS isolation test — run: npm run beta:rls
 * User A saves a lookbook; User B must not read, update, or delete it.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { buildLookbookRecommendation } from "../lib/recommendations/buildLookbook";
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
const appUrl = process.env.PLAYWRIGHT_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

async function createUser(label: string) {
  const email = `rls-${label}-${Date.now()}@archive411.test`;
  const password = "TestPass123!";
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(`Create ${label}: ${error?.message ?? "no user"}`);
  return { id: data.user.id, email, password };
}

async function signInClient(email: string, password: string) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(`Sign in: ${error?.message ?? "no session"}`);
  return { client, session: data.session, userId: data.user!.id };
}

async function saveLookbookForUser(userId: string, lookbookId: string) {
  const result = await buildLookbookRecommendation(feminineY2K);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const lookbook = { ...result.lookbook, id: lookbookId, userId, saved: true };

  const { error: lbError } = await admin.from("lookbooks").insert({
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
  if (lbError) throw lbError;

  for (let i = 0; i < result.looks.length; i++) {
    const look = result.looks[i];
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
  }

  return lookbook.title;
}

async function main() {
  console.log("=== Archive411 RLS two-user test ===\n");

  if (!url || !anonKey || !serviceKey) {
    fail("Missing Supabase env vars");
    process.exit(1);
  }

  const userA = await createUser("a");
  const userB = await createUser("b");
  pass(`Created User A (${userA.email})`);
  pass(`Created User B (${userB.email})`);

  const lookbookId = `lb-rls-${Date.now()}`;
  const title = await saveLookbookForUser(userA.id, lookbookId);
  pass(`User A saved lookbook "${title}" (${lookbookId})`);

  const sessionA = await signInClient(userA.email, userA.password);
  const sessionB = await signInClient(userB.email, userB.password);

  const { data: aOwn, error: aOwnErr } = await sessionA.client
    .from("lookbooks")
    .select("id, title")
    .eq("id", lookbookId);
  if (aOwnErr) fail(`User A read own lookbook: ${aOwnErr.message}`);
  else if (!aOwn?.length) fail("User A cannot read own lookbook");
  else pass("User A can read own lookbook");

  const { data: bRead, error: bReadErr } = await sessionB.client
    .from("lookbooks")
    .select("id, title")
    .eq("id", lookbookId);
  if (bReadErr) fail(`User B read attempt errored unexpectedly: ${bReadErr.message}`);
  else if (bRead?.length) fail("User B can read User A lookbook (RLS breach)");
  else pass("User B cannot read User A lookbook via direct select");

  const { data: bList } = await sessionB.client.from("lookbooks").select("id").eq("saved", true);
  if (bList?.some((lb) => lb.id === lookbookId)) {
    fail("User A lookbook appears in User B archive list");
  } else {
    pass("User B archive list excludes User A lookbook");
  }

  const { data: bUpdate, error: bUpdateErr } = await sessionB.client
    .from("lookbooks")
    .update({ title: "Hacked by B" })
    .eq("id", lookbookId)
    .select("id");
  if (bUpdateErr) {
    pass(`User B update blocked (${bUpdateErr.message})`);
  } else if (bUpdate?.length) {
    fail("User B updated User A lookbook (RLS breach)");
  } else {
    pass("User B update returned no rows (RLS enforced)");
  }

  const { data: bDelete, error: bDeleteErr } = await sessionB.client
    .from("lookbooks")
    .delete()
    .eq("id", lookbookId)
    .select("id");
  if (bDeleteErr) {
    pass(`User B delete blocked (${bDeleteErr.message})`);
  } else if (bDelete?.length) {
    fail("User B deleted User A lookbook (RLS breach)");
  } else {
    pass("User B delete returned no rows (RLS enforced)");
  }

  const { data: afterDelete } = await sessionA.client
    .from("lookbooks")
    .select("id")
    .eq("id", lookbookId);
  if (!afterDelete?.length) fail("User A lookbook was deleted by User B attack");
  else pass("User A lookbook still intact after User B delete attempt");

  try {
    const bToken = sessionB.session.access_token;
    const res = await fetch(`${appUrl}/api/lookbooks/${lookbookId}`, {
      headers: { Authorization: `Bearer ${bToken}` },
    });
    if (res.status === 404 || res.status === 403) {
      pass(`User B GET /api/lookbooks/${lookbookId} → ${res.status} (isolated)`);
    } else if (res.ok) {
      fail(`User B GET /api/lookbooks/${lookbookId} → ${res.status} (API leak)`);
    } else {
      pass(`User B GET /api/lookbooks/${lookbookId} → ${res.status}`);
    }
  } catch {
    console.log(`  SKIP — API isolation test (app not reachable at ${appUrl})`);
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  await admin.from("lookbooks").delete().eq("id", lookbookId);
  await admin.auth.admin.deleteUser(userA.id);
  await admin.auth.admin.deleteUser(userB.id);
  pass("Test users and lookbook cleaned up");

  console.log(failed ? "\n=== RLS TEST FAILED ===\n" : "\n=== RLS TEST PASSED ===\n");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
