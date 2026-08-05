const fs = require("fs");
const path = require("path");

const root = process.cwd();
console.log("Running in:", root);

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}
function save(rel, s) {
  fs.writeFileSync(path.join(root, rel), s);
  console.log("wrote", rel);
}

// ---- 1) GUAPE -> London ----
{
  const file = "app/data/seed/designers.ts";
  let s = read(file);
  const start = s.indexOf('id: "des-guape"');
  if (start < 0) throw new Error("des-guape not found");
  const end = s.indexOf("},", start);
  if (end < 0) throw new Error("des-guape block end not found");
  let block = s.slice(start, end);
  block = block
    .replace('slug: "guape-studio-reference"', 'slug: "guape-studio"')
    .replace(/biography: "[^"]*"/, 'biography: "London-based footwear and accessories studio. Official site: guapestudio.com."')
    .replace('city: "Ho Chi Minh City"', 'city: "London"')
    .replace('country: "Vietnam"', 'country: "United Kingdom"')
    .replace(/website: "[^"]*"/, 'website: "https://guapestudio.com/"')
    .replace(/coverImageUrl: "[^"]*"/, 'coverImageUrl: "/placeholders/product-shoes.svg"')
    .replace('currency: "VND"', 'currency: "GBP"')
    .replace('shippingLocations: ["VN", "US", "EU"]', 'shippingLocations: ["UK", "EU", "US"]');
  s = s.slice(0, start) + block + s.slice(end);
  save(file, s);
  console.log("GUAPE -> London OK");
}

for (const file of ["app/data/seed/products.ts", "app/data/seed/productsExtended.ts"]) {
  const parts = read(file).split('designerId: "des-guape"');
  const out = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    out.push(
      'designerId: "des-guape"' +
        parts[i].replace('designerCity: "Ho Chi Minh City"', 'designerCity: "London"')
    );
  }
  save(file, out.join(""));
}

for (const file of ["app/data/seed/sources.ts", "app/data/seed/showrooms.ts"]) {
  let s = read(file);
  s = s.replace(/"des-guape",\s*/g, "").replace(/,\s*"des-guape"/g, "");
  save(file, s);
}

// ---- 2) Summer Mermaid (HCMC) ----
{
  const file = "app/data/seed/designersExtended.ts";
  let s = read(file);
  if (!s.includes("des-summer-mermaid")) {
    const marker = "export const SEED_DESIGNERS_EXTENDED: Designer[] = [";
    if (!s.includes(marker)) throw new Error("SEED_DESIGNERS_EXTENDED marker missing");
    const block = `
  {
    id: "des-summer-mermaid",
    slug: "summer-mermaid",
    labelName: "Summer Mermaid",
    labelType: "independent-designer",
    biography: "Ho Chi Minh City label with fluid, seaside-evening silhouettes.",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    coverImageUrl: "/placeholders/product-dresses.svg",
    website: "https://example.com/summer-mermaid",
    socialLinks: {},
    aestheticTags: ["mermaid-inspired", "resort-wear", "evening", "humid-night"],
    sizeRange: "XS-XL",
    priceRange: { tier: "50-100", scope: "single-item", currency: "USD" },
    shippingLocations: ["VN", "US", "EU"],
    madeToOrder: false,
    customSizing: false,
    websiteConnectionType: "manual",
    featured: true,
    isIndependent: true,
    isEmerging: true,
    ...PLACEHOLDER,
  },
`;
    s = s.replace(marker, marker + block);
    save(file, s);
    console.log("Summer Mermaid designer OK");
  } else {
    console.log("Summer Mermaid designer already exists");
  }
}

{
  const file = "app/data/seed/productsExtended.ts";
  let s = read(file);
  if (!s.includes("prod-summer-mermaid-dress")) {
    const marker = "export const SEED_PRODUCTS_EXTENDED: Product[] = [";
    const block = `
  {
    id: "prod-summer-mermaid-dress",
    name: "Bias Mermaid Slip Dress",
    designerId: "des-summer-mermaid",
    conceptStoreId: "cs-new-playground",
    designerCity: "Ho Chi Minh City",
    productUrl: "https://example.com/mock/summer-mermaid-dress",
    imageUrls: ["/placeholders/product-dresses.svg"],
    category: "dresses",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    sizingSystem: "letter",
    price: 88,
    currency: "USD",
    aestheticTags: ["mermaid-inspired", "resort-wear", "evening", "chic-and-sexy"],
    presentationTags: ["feminine"],
    occasionTags: ["going-out", "vacation-wear", "evening"],
    climateTags: ["humid", "summer"],
    departmentTags: ["womenswear"],
    shippingDestinations: ["VN", "US", "EU"],
    isIndependentDesigner: true,
    isEmergingDesigner: true,
    ...BASE,
  },
  {
    id: "prod-summer-mermaid-top",
    name: "Sheer Seaside Mesh Top",
    designerId: "des-summer-mermaid",
    conceptStoreId: "cs-rue-miche",
    designerCity: "Ho Chi Minh City",
    productUrl: "https://example.com/mock/summer-mermaid-top",
    imageUrls: ["/placeholders/product-tops.svg"],
    category: "tops",
    availableSizes: ["XS", "S", "M", "L"],
    sizingSystem: "letter",
    price: 54,
    currency: "USD",
    aestheticTags: ["mermaid-inspired", "y2k", "nightlife"],
    presentationTags: ["feminine"],
    occasionTags: ["going-out", "vacation-wear"],
    climateTags: ["humid", "summer"],
    departmentTags: ["womenswear"],
    shippingDestinations: ["VN", "US"],
    isIndependentDesigner: true,
    isEmergingDesigner: true,
    ...BASE,
  },
`;
    s = s.replace(marker, marker + block);
    save(file, s);
    console.log("Summer Mermaid products OK");
  } else {
    console.log("Summer Mermaid products already exist");
  }
}

{
  const file = "app/data/curatedRoster.ts";
  let s = read(file);
  if (!s.includes("des-summer-mermaid")) {
    s = s.replace(
      '"des-guape": "GUAPÉ Studio",',
      '"des-guape": "GUAPÉ Studio",\n  "des-summer-mermaid": "Summer Mermaid",'
    );
    s = s.replace('"des-guape",', '"des-guape",\n  "des-summer-mermaid",');
    save(file, s);
  }
}

// ---- 3) Featured: one clean set ----
for (const file of ["app/data/seed/designers.ts", "app/data/seed/designersExtended.ts"]) {
  let s = read(file).replace(/featured: true/g, "featured: false");
  for (const id of [
    "des-guape",
    "des-linea",
    "des-summer-mermaid",
    "des-fanci-club-ref",
    "des-lsoul-ref",
    "des-wfbb",
  ]) {
    const idx = s.indexOf('id: "' + id + '"');
    if (idx < 0) continue;
    const feat = s.indexOf("featured: false", idx);
    if (feat > idx && feat < idx + 800) {
      s = s.slice(0, feat) + "featured: true" + s.slice(feat + "featured: false".length);
      console.log("featured on", id);
    }
  }
  save(file, s);
}

// ---- 4) fashionCities ----
save(
  "app/data/fashionCities.ts",
  `export const FASHION_CITIES = [
  { city: "New York City", country: "United States", region: "Americas" },
  { city: "Paris", country: "France", region: "Europe" },
  { city: "London", country: "United Kingdom", region: "Europe" },
  { city: "Ho Chi Minh City", country: "Vietnam", region: "Southeast Asia" },
  { city: "Bangkok", country: "Thailand", region: "Southeast Asia" },
  { city: "Tokyo", country: "Japan", region: "East Asia" },
  { city: "Seoul", country: "South Korea", region: "East Asia" },
  { city: "Lagos", country: "Nigeria", region: "Africa" },
  { city: "Copenhagen", country: "Denmark", region: "Europe" },
  { city: "Milan", country: "Italy", region: "Europe" },
  { city: "Los Angeles", country: "United States", region: "Americas" },
] as const;

export const HOMEPAGE_COLLECTIONS = [
  { id: "hcmc", title: "New from Ho Chi Minh City", href: "/independent?city=Ho%20Chi%20Minh%20City" },
  { id: "london", title: "Independent London", href: "/independent?city=London" },
  { id: "guape", title: "GUAPE Studio (London)", href: "/designers/guape-studio" },
  { id: "summer-mermaid", title: "Summer Mermaid (HCMC)", href: "/designers/summer-mermaid" },
  { id: "bangkok", title: "Bangkok Designers to Know", href: "/independent?city=Bangkok" },
  { id: "nyc", title: "Emerging New York", href: "/independent?city=New%20York" },
  { id: "paris", title: "Paris Beyond the Main Houses", href: "/independent?city=Paris" },
  { id: "tokyo", title: "Tokyo After Dark", href: "/independent?city=Tokyo" },
  { id: "showrooms", title: "Showrooms & Private Shopping", href: "/showrooms" },
  { id: "discover", title: "Fashion Communities", href: "/discover" },
  { id: "build", title: "Build a Lookbook", href: "/build" },
  { id: "designers", title: "All Designers in the Archive", href: "/designers" },
] as const;

export const INDEPENDENT_SECTIONS = [
  "New from Ho Chi Minh City",
  "Independent London",
  "Bangkok Designers to Know",
  "Emerging New York",
  "Paris Beyond the Main Houses",
  "Tokyo After Dark",
  "Handmade and Made to Order",
] as const;
`
);

// ---- 5) home page ----
save(
  "app/home/page.tsx",
  `"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import DiscoveryCard from "@/app/components/DiscoveryCard";
import RouteGuard from "@/app/components/RouteGuard";
import { DISCOVERY_MODES, HOMEPAGE_COLLECTIONS, MOCK_DESIGNERS } from "@/app/data/mockCatalog";
import { CULTURAL_DISCOVERY_SECTIONS } from "@/app/data/styleCommunities";
import { useApp } from "@/app/context/AppContext";

function uniqueFeaturedByCity() {
  const seen = new Set<string>();
  return MOCK_DESIGNERS.filter((d) => d.featured)
    .filter((d) => {
      const key = d.city.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

function HomeContent() {
  const { user } = useApp();
  const featured = uniqueFeaturedByCity();

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-editorial pt-24 pb-16 md:pt-28 md:pb-24"
      >
        <header className="mb-12 border-b border-smoke/30 pb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
            Welcome{user?.name ? \`, \${user.name}\` : ""}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            What are you looking for today?
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Explore complete looks and independent labels by city — each path goes somewhere different.
          </p>
        </header>

        <section aria-label="Discovery modes" className="grid gap-5 md:grid-cols-2">
          {DISCOVERY_MODES.map((mode, index) => (
            <DiscoveryCard
              key={mode.id}
              href={mode.href}
              title={mode.title}
              description={mode.description}
              index={index}
            />
          ))}
        </section>

        <section className="mt-20 border-t border-smoke/30 pt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Featured labels</p>
              <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">
                Independent designers by city
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                One featured house per city. No stock photos.
              </p>
            </div>
            <Link
              href="/designers"
              className="text-[10px] uppercase tracking-[0.25em] text-muted hover:text-ivory"
            >
              View all →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featured.map((designer) => (
              <Link
                key={designer.id}
                href={\`/designers/\${designer.slug}\`}
                className="group border border-smoke/50 bg-charcoal hover:border-accent/50"
              >
                <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-[#141414] p-6">
                  <Image
                    src={designer.coverImageUrl}
                    alt=""
                    fill
                    className="object-contain p-10 opacity-80"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                      {designer.city}, {designer.country}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-ivory">
                      {designer.labelName}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="line-clamp-2 text-sm text-muted">{designer.biography}</p>
                  <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                    View designer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Cultural discovery</p>
              <h2 className="mt-3 font-display text-3xl text-ivory">Fashion communities</h2>
            </div>
            <Link
              href="/discover"
              className="text-[10px] uppercase tracking-[0.25em] text-muted hover:text-ivory"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURAL_DISCOVERY_SECTIONS.slice(0, 6).map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className="border border-smoke/50 p-5 hover:border-accent/50"
              >
                <h3 className="font-display text-lg text-ivory">{section.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted">{section.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <Link
            href="/showrooms"
            className="group block border border-smoke/50 bg-charcoal p-8 hover:border-accent/50"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Showroom / Private Shopping
            </p>
            <h2 className="mt-3 font-display text-2xl text-ivory">
              Appointment-based showrooms
            </h2>
            <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
              Browse showrooms →
            </span>
          </Link>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Global edits</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {HOMEPAGE_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.href}
                className="border border-smoke/50 px-4 py-2 text-xs text-ivory hover:border-accent hover:text-accent"
              >
                {col.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <HomeContent />
    </RouteGuard>
  );
}
`
);

// ---- 6) imagery fallback ----
{
  const file = "app/data/productImagery.ts";
  let s = read(file);
  s = s.replace(
    'export const EDITORIAL_PLACEHOLDER = "/placeholders/editorial-cover.svg";',
    'export const EDITORIAL_PLACEHOLDER = "/placeholders/product-default.svg";'
  );
  save(file, s);
}

// ---- 7) independent lookbook ----
{
  const file = "app/services/lookbook.service.ts";
  let s = read(file);
  s = s.replace(
    "candidates.length >= 4 ? candidates : searchCatalog(independentFilters)",
    "candidates.length ? candidates : searchCatalog({ ...independentFilters, independentOnly: true })"
  );
  save(file, s);
}

// Verify
{
  const d = read("app/data/seed/designers.ts");
  const gStart = d.indexOf('id: "des-guape"');
  const g = d.slice(gStart, gStart + 500);
  console.log("\nVERIFY GUAPE snippet:\n", g);
  console.log(
    "\nVERIFY home has uniqueFeaturedByCity:",
    read("app/home/page.tsx").includes("uniqueFeaturedByCity")
  );
  console.log(
    "VERIFY Summer Mermaid:",
    read("app/data/seed/designersExtended.ts").includes("des-summer-mermaid")
  );
}

console.log("\nDONE — next: npm run build && npx vercel --prod --yes");
