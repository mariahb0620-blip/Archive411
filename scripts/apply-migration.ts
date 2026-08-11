/**
 * Apply Supabase migration SQL via direct Postgres connection.
 * Requires SUPABASE_DB_PASSWORD in .env.local (Dashboard → Settings → Database).
 *
 * Run: npm run db:migrate
 */
import fs from "fs";
import path from "path";
import { Client } from "pg";

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

const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
  /https:\/\/([^.]+)\.supabase\.co/
)?.[1];

const password = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

if (!password) {
  console.error(`
Missing SUPABASE_DB_PASSWORD in .env.local

Get it from Supabase Dashboard:
  Project → Settings → Database → Database password

Then add to .env.local:
  SUPABASE_DB_PASSWORD=your-password

Or paste supabase/migrations/*.sql into SQL Editor → New query → Run
`);
  process.exit(1);
}

const regions = [
  "us-east-1",
  "us-west-1",
  "eu-west-1",
  "eu-central-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "sa-east-1",
];

async function connect(): Promise<Client> {
  const attempts: string[] = [
    `postgresql://postgres.${projectRef}:${encodeURIComponent(password!)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres:${encodeURIComponent(password!)}@db.${projectRef}.supabase.co:5432/postgres`,
  ];
  for (const region of regions) {
    attempts.push(
      `postgresql://postgres.${projectRef}:${encodeURIComponent(password!)}@aws-0-${region}.pooler.supabase.com:6543/postgres`
    );
  }

  let lastError: Error | undefined;
  for (const url of attempts) {
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      console.log("Connected via", url.replace(/:[^:@]+@/, ":***@"));
      return client;
    } catch (err) {
      lastError = err as Error;
      await client.end().catch(() => {});
    }
  }
  throw lastError ?? new Error("Could not connect to Supabase Postgres");
}

function listMigrationFiles(): string[] {
  const dir = path.join(process.cwd(), "supabase/migrations");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => path.join(dir, f));
}

async function main() {
  const files = listMigrationFiles();
  if (!files.length) {
    console.error("No migration files in supabase/migrations/");
    process.exit(1);
  }

  const client = await connect();
  try {
    for (const sqlPath of files) {
      const sql = fs.readFileSync(sqlPath, "utf8");
      console.log(`Applying ${path.basename(sqlPath)}...`);
      await client.query(sql);
      console.log(`  OK — ${path.basename(sqlPath)}`);
    }
    console.log("\nAll migrations applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
