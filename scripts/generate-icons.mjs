#!/usr/bin/env node
/**
 * Generates PNG app icons from public/icon.svg for iOS/Android PWA install.
 * Run: node scripts/generate-icons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "icon.svg");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Install sharp first: npm install --save-dev sharp");
    process.exit(1);
  }

  const svg = await readFile(svgPath);
  const sizes = [192, 512];

  for (const size of sizes) {
    const outPath = join(root, "public", `icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(outPath);
    console.log(`Created ${outPath}`);
  }

  // Apple touch icon (180x180)
  const applePath = join(root, "public", "apple-touch-icon.png");
  await sharp(svg).resize(180, 180).png().toFile(applePath);
  console.log(`Created ${applePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
