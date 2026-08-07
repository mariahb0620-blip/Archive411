"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import StickyActionBar from "@/app/components/StickyActionBar";
import { SelectChip } from "@/app/components/build/BuildQuestionSteps";
import { AESTHETIC_TAGS, DEPARTMENT_OPTIONS } from "@/app/data/aestheticTags";
import { FASHION_CITIES } from "@/app/data/fashionCities";
import { DEFAULT_PRICE_RANGE, PRICE_TIER_LABELS } from "@/app/data/mockCatalog";
import { fetchSearchRecommendation } from "@/app/services/archive.api";
import { storeLookbookSession } from "@/app/services/lookbook.service";
import type { DepartmentFilter, PriceRangeSelection } from "@/app/types/domain";

const OCCASIONS = ["Work", "Date night", "Travel", "Event", "Everyday", "Nightlife", "Vacation"];

const EXAMPLE_QUERIES = [
  "Y2K going-out look in NYC",
  "Quiet luxury workwear",
  "Independent streetwear under $250",
  "Parisian date night with heels",
];

const FEATURED_AESTHETICS = AESTHETIC_TAGS.slice(0, 12);

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSearchRecommendation({
        query,
        aesthetics: aesthetic ? [aesthetic] : undefined,
        occasion,
        city,
        department,
        priceRange,
        independentOnly,
        includeVintage,
      });
      if (result.empty || !result.looks.length) {
        setError(result.message ?? "No matches found. Try broadening your filters.");
        return;
      }
      storeLookbookSession(result.lookbook, result.looks, "search", undefined, result.products);
      router.push(`/lookbooks/${result.lookbook.id}`);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain stickyFooter className="max-w-2xl space-y-8">
        <header>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Search</p>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
            Search the global archive
          </h1>
          <p className="mt-3 text-sm text-muted">
            Search across designers, concept stores, vintage sellers and retailers worldwide.
          </p>
        </header>

        <div className="space-y-6">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Search request
            </span>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              placeholder="Describe the look, occasion, city, sizes, and budget…"
              className="mobile-input mt-2 resize-none"
            />
          </label>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Try an example</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((example) => (
                <SelectChip
                  key={example}
                  label={example}
                  selected={query === example}
                  onClick={() => setQuery(example)}
                />
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Aesthetic
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURED_AESTHETICS.map((tag) => (
                <SelectChip
                  key={tag}
                  label={tag}
                  selected={aesthetic === tag}
                  onClick={() => setAesthetic(aesthetic === tag ? "" : tag)}
                />
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
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

          <div className="mobile-card space-y-1 p-1">
            <label className="mobile-settings-row cursor-pointer">
              <span className="text-muted">Prioritize independent designers</span>
              <input
                type="checkbox"
                checked={independentOnly}
                onChange={(e) => setIndependentOnly(e.target.checked)}
                className="h-5 w-5 accent-accent"
              />
            </label>
            <label className="mobile-settings-row cursor-pointer">
              <span className="text-muted">Include vintage & archive</span>
              <input
                type="checkbox"
                checked={includeVintage}
                onChange={(e) => setIncludeVintage(e.target.checked)}
                className="h-5 w-5 accent-accent"
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          )}

          <div className="hidden md:block">
            <EditorialButton onClick={search} disabled={loading}>
              {loading ? "Searching…" : "Search looks"}
            </EditorialButton>
          </div>
        </div>
      </AppPageMain>

      <div className="md:hidden">
        <StickyActionBar>
          <EditorialButton onClick={search} disabled={loading} className="w-full">
            {loading ? "Searching…" : "Search looks"}
          </EditorialButton>
        </StickyActionBar>
      </div>
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
        className="mobile-input mt-2 appearance-none"
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
