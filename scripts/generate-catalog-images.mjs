#!/usr/bin/env node
/**
 * Generate editorial catalog PNGs for Archive411 (products, designers, lookbooks).
 * Run: npm run images:generate
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outRoot = join(root, "public", "images");

const ACCENT = "#c4a574";

const CATEGORIES = {
  tops: { label: "Tops", shape: "top" },
  bottoms: { label: "Bottoms", shape: "bottom" },
  dresses: { label: "Dresses", shape: "dress" },
  outerwear: { label: "Outerwear", shape: "coat" },
  shoes: { label: "Footwear", shape: "shoe" },
  handbags: { label: "Bags", shape: "bag" },
  jewelry: { label: "Jewelry", shape: "jewelry" },
  accessories: { label: "Accessories", shape: "accessory" },
  default: { label: "Archive411", shape: "default" },
};

const DESIGNER_THEMES = {
  "linea-atelier": ["#141210", "#2c2620", "#6b5d4f"],
  "north-loom": ["#121418", "#2a3038", "#6b7280"],
  "chalay-reference": ["#140f16", "#3d2438", "#9d4e8a"],
  "work-from-beach-reference": ["#101820", "#1e4d5c", "#7eb8c9"],
  "guape-studio": ["#121010", "#2a2220", "#8b6914"],
  "edikted-style-reference": ["#161016", "#4a1f3d", "#e879a8"],
  "danielle-guizio-reference": ["#101010", "#282828", "#888888"],
  "tiger-mist-reference": ["#181210", "#5c3d2e", "#d4a574"],
  "fancy-club-reference": ["#0a0810", "#2d1b69", "#7c3aed"],
  "el-dantes-reference": ["#100808", "#3d1515", "#991b1b"],
  "lagos-atelier-reference": ["#101008", "#4a4020", "#ca8a04"],
  "copenhagen-knit-lab": ["#0f1214", "#334155", "#94a3b8"],
  "tokyo-after-dark-reference": ["#080810", "#1e1b4b", "#6366f1"],
  "milan-soft-tailor-reference": ["#121110", "#3d3835", "#a8a29e"],
  "fanci-club-reference": ["#100818", "#581c87", "#a855f7"],
  "lsoul-reference": ["#101018", "#1e3a5f", "#60a5fa"],
  "moi-dien-reference": ["#101410", "#14532d", "#4ade80"],
  "london-experimental-reference": ["#101010", "#27272a", "#71717a"],
  "paris-archive-reference": ["#12100e", "#44403c", "#a8a29e"],
  "nyc-downtown-reference": ["#0c0c0c", "#262626", "#737373"],
  "jaded-london-reference": ["#101010", "#365314", "#84cc16"],
  "technical-footwear-reference": ["#0a1014", "#1e3a4f", "#38bdf8"],
  telfar: ["#101010", "#1a1a1a", "#f5f5f5"],
  salomon: ["#0c1014", "#1e293b", "#ef4444"],
  "collina-strada": ["#101408", "#3f6212", "#a3e635"],
  "martine-rose": ["#101010", "#374151", "#9ca3af"],
  "wales-bonner": ["#100c08", "#78350f", "#d97706"],
  "el-dantes": ["#100808", "#450a0a", "#dc2626"],
  guzio: ["#140810", "#831843", "#f472b6"],
};

const BETA_DESIGNERS = [
  "guape-studio",
  "telfar",
  "salomon",
  "collina-strada",
  "martine-rose",
  "wales-bonner",
  "el-dantes",
  "guzio",
];

function hashPalette(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const palettes = Object.values(DESIGNER_THEMES);
  return palettes[h % palettes.length];
}

function shapeSvg(shape) {
  const stroke = ACCENT;
  const fill = "rgba(196,165,116,0.08)";
  switch (shape) {
    case "top":
      return `<path d="M300 180 L220 240 L240 620 L360 620 L380 240 Z" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/><path d="M300 180 L380 240 M300 180 L220 240" stroke="${stroke}" stroke-width="2" fill="none"/>`;
    case "bottom":
      return `<path d="M240 200 L360 200 L380 620 L300 580 L220 620 Z" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/>`;
    case "dress":
      return `<path d="M260 180 L340 180 L380 620 L220 620 Z" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/><path d="M260 180 L300 240 L340 180" stroke="${stroke}" stroke-width="2" fill="none"/>`;
    case "coat":
      return `<path d="M220 200 L380 200 L400 620 L200 620 Z" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/><path d="M300 200 L300 620" stroke="${stroke}" stroke-width="1.5" fill="none"/>`;
    case "shoe":
      return `<path d="M200 480 Q280 420 400 460 L420 540 Q300 560 180 520 Z" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/>`;
    case "bag":
      return `<rect x="230" y="280" width="140" height="160" rx="8" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/><path d="M260 280 Q300 220 340 280" stroke="${stroke}" stroke-width="2" fill="none"/>`;
    case "jewelry":
      return `<circle cx="300" cy="380" r="60" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/><circle cx="300" cy="380" r="20" stroke="${stroke}" stroke-width="2" fill="none"/>`;
    case "accessory":
      return `<rect x="250" y="320" width="100" height="140" rx="4" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/>`;
    default:
      return `<rect x="220" y="240" width="160" height="280" rx="4" stroke="${stroke}" stroke-width="2.5" fill="${fill}"/>`;
  }
}

function buildSvg({ width, height, colors, label, subtitle, shape }) {
  const [c0, c1, c2] = colors;
  const shapeMarkup = shape ? shapeSvg(shape) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c0}"/>
      <stop offset="55%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c0}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" stroke="${ACCENT}" stroke-opacity="0.25" stroke-width="1" fill="none"/>
  ${shapeMarkup}
  <text x="${width / 2}" y="${height - 72}" text-anchor="middle" fill="${ACCENT}" font-family="Georgia, serif" font-size="13" letter-spacing="6">${label.toUpperCase()}</text>
  ${subtitle ? `<text x="${width / 2}" y="${height - 44}" text-anchor="middle" fill="#888" font-family="system-ui,sans-serif" font-size="11" letter-spacing="3">${subtitle.toUpperCase()}</text>` : ""}
</svg>`;
}

async function renderPng(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(outPath);
}

async function generateProductImages() {
  const dir = join(outRoot, "catalog");
  await mkdir(dir, { recursive: true });
  for (const [key, meta] of Object.entries(CATEGORIES)) {
    const colors = hashPalette(`product-${key}`);
    const svg = buildSvg({
      width: 800,
      height: 1000,
      colors,
      label: meta.label,
      subtitle: "Archive411 catalog",
      shape: meta.shape,
    });
    const out = join(dir, `product-${key}.png`);
    await renderPng(svg, out);
    console.log(`  ${out}`);
  }
}

async function generateDesignerImages() {
  const dir = join(outRoot, "designers");
  await mkdir(dir, { recursive: true });
  const slugs = [...new Set([...Object.keys(DESIGNER_THEMES), ...BETA_DESIGNERS])];
  for (const slug of slugs) {
    const colors = DESIGNER_THEMES[slug] ?? hashPalette(slug);
    const label = slug.replace(/-reference$/, "").replace(/-/g, " ");
    const svg = buildSvg({
      width: 1200,
      height: 900,
      colors,
      label,
      subtitle: "Independent designer",
      shape: null,
    });
    const out = join(dir, `${slug}.png`);
    await renderPng(svg, out);
    console.log(`  ${out}`);
  }
}

async function generateEditorialImages() {
  const dir = join(outRoot, "editorial");
  await mkdir(dir, { recursive: true });
  const cover = buildSvg({
    width: 1600,
    height: 900,
    colors: ["#0a0a0a", "#1a1816", "#2c2620"],
    label: "Archive411",
    subtitle: "Editorial lookbook",
    shape: "dress",
  });
  const panel = buildSvg({
    width: 800,
    height: 1200,
    colors: ["#101010", "#1c1c1c", "#2a2a2a"],
    label: "Lookbook",
    subtitle: "Curated edit",
    shape: "coat",
  });
  await renderPng(cover, join(dir, "cover.png"));
  await renderPng(panel, join(dir, "panel.png"));
  console.log(`  ${join(dir, "cover.png")}`);
  console.log(`  ${join(dir, "panel.png")}`);
}

async function writeManifest() {
  const manifest = {
    catalog: Object.fromEntries(
      Object.keys(CATEGORIES).map((k) => [k, `/images/catalog/product-${k}.png`])
    ),
    editorial: {
      cover: "/images/editorial/cover.png",
      panel: "/images/editorial/panel.png",
    },
    designer: (slug) => `/images/designers/${slug}.png`,
  };
  const manifestPath = join(root, "app", "data", "catalogImages.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ${manifestPath}`);
}

async function main() {
  console.log("Generating Archive411 catalog images...\n");
  console.log("Product categories:");
  await generateProductImages();
  console.log("\nDesigner covers:");
  await generateDesignerImages();
  console.log("\nEditorial:");
  await generateEditorialImages();
  console.log("\nManifest:");
  await writeManifest();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
