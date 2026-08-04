"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import { AESTHETIC_TAGS, DEPARTMENT_OPTIONS } from "@/app/data/aestheticTags";
import { FASHION_CITIES } from "@/app/data/fashionCities";
import { DEFAULT_PRICE_RANGE, PRICE_TIER_LABELS } from "@/app/data/mockCatalog";
import {
  generateLookbookFromSearch,
  storeLookbookSession,
} from "@/app/services/lookbook.service";
import type { DepartmentFilter, PriceRangeSelection } from "@/app/types/domain";

const OCCASIONS = ["Work", "Date night", "Travel", "Event", "Everyday", "Nightlife", "Vacation"];

function SearchContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState<DepartmentFilter>("all");
  const [independentOnly, setIndependentOnly] = useState(false);
  const [includeVintage, setIncludeVintage] = useState(true);
  const [priceRange, setPriceRange] = useState<PriceRangeSelection>(DEFAULT_PRICE_RANGE);

  const search = () => {
    const { lookbook, looks } = generateLookbookFromSearch({
      query,
      aesthetics: aesthetic ? [aesthetic] : undefined,
      occasion,
      city,
      department,
      priceRange,
      independentOnly,
      includeVintage,
    });
    storeLookbookSession(lookbook, looks, "search");
    router.push(`/lookbooks/${lookbook.id}`);
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Search Your Way</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          Search the global archive
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Search across designers, concept stores, vintage sellers and retailers —
          not one department or one country. Presentation guides results without
          restricting retailer categories.
        </p>

        <div className="mt-10 space-y-8">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Search request
            </span>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              placeholder="Create a chic and sexy feminine-androgynous look for a humid night in Ho Chi Minh City. Include heels and a handbag. US 8–10, shoe size US 9, budget $300."
              className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <FilterSelect
              label="Aesthetic"
              value={aesthetic}
              onChange={setAesthetic}
              options={[...AESTHETIC_TAGS]}
            />
            <FilterSelect
              label="Occasion"
              value={occasion}
              onChange={setOccasion}
              options={OCCASIONS}
            />
            <FilterSelect
              label="City / market"
              value={city}
              onChange={setCity}
              options={FASHION_CITIES.map((c) => c.city)}
            />
            <FilterSelect
              label="Department"
              value={department}
              onChange={(v) => setDepartment(v as DepartmentFilter)}
              options={DEPARTMENT_OPTIONS.map((d) => d.id)}
              labels={Object.fromEntries(DEPARTMENT_OPTIONS.map((d) => [d.id, d.label]))}
            />
            <FilterSelect
              label="Price range"
              value={priceRange.tier}
              onChange={(tier) =>
                setPriceRange((p) => ({ ...p, tier: tier as PriceRangeSelection["tier"] }))
              }
              options={Object.keys(PRICE_TIER_LABELS)}
              labels={PRICE_TIER_LABELS}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={independentOnly}
                onChange={(e) => setIndependentOnly(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Prioritize independent and emerging designers
            </label>
            <label className="flex items-center gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={includeVintage}
                onChange={(e) => setIncludeVintage(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Include vintage and archive sources
            </label>
          </div>

          <EditorialButton onClick={search}>Search looks</EditorialButton>
        </div>
      </main>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
      >
        <option value="">Any</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SearchPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <SearchContent />
    </RouteGuard>
  );
}
