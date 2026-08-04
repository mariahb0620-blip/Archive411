"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import EmptyState from "@/app/components/EmptyState";
import RouteGuard from "@/app/components/RouteGuard";
import { DESIGNER_LABEL_DISPLAY } from "@/app/data/aestheticTags";
import {
  INDEPENDENT_SECTIONS,
  MOCK_CONCEPT_STORES,
  MOCK_DESIGNERS,
} from "@/app/data/mockCatalog";
import {
  generateIndependentLookbook,
  storeLookbookSession,
} from "@/app/services/lookbook.service";

function IndependentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [madeToOrder, setMadeToOrder] = useState(searchParams.get("madeToOrder") === "1");
  const [customSizing, setCustomSizing] = useState(false);

  const filtered = useMemo(
    () =>
      MOCK_DESIGNERS.filter((d) => {
        if (city && !d.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (madeToOrder && !d.madeToOrder) return false;
        if (customSizing && !d.customSizing) return false;
        return d.isIndependent || d.isEmerging;
      }),
    [city, madeToOrder, customSizing]
  );

  const generateEdit = () => {
    const { lookbook, looks } = generateIndependentLookbook(filtered.map((d) => d.id));
    storeLookbookSession(lookbook, looks, "independent");
    router.push(`/lookbooks/${lookbook.id}`);
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent">The Independent Edit</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">The Independent Edit</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Discover independent and emerging designers shaping fashion across the world.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {INDEPENDENT_SECTIONS.map((section) => (
            <span
              key={section}
              className="border border-smoke/50 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-muted"
            >
              {section}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FilterSelect
            label="City"
            value={city}
            onChange={setCity}
            options={[...new Set(MOCK_DESIGNERS.map((d) => d.city))]}
          />
          <Toggle label="Made to order" checked={madeToOrder} onChange={setMadeToOrder} />
          <Toggle label="Custom sizing" checked={customSizing} onChange={setCustomSizing} />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16">
            <EmptyState
              headline="We are still building this part of the Archive."
              text="Try expanding your price, location or shipping filters, or request a designer you would like to see."
              primaryLabel="Adjust Filters"
              primaryHref="/independent"
              secondaryLabel="Request a Designer"
              secondaryHref="/for-designers/apply"
            />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((designer) => (
                <Link
                  key={designer.id}
                  href={`/designers/${designer.slug}`}
                  className="border border-smoke/50 bg-charcoal"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={designer.coverImageUrl}
                      alt={designer.labelName}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-accent">
                      {DESIGNER_LABEL_DISPLAY[designer.labelType] ?? "Designer"}
                    </p>
                    <h3 className="mt-1 font-display text-xl text-ivory">{designer.labelName}</h3>
                    <p className="mt-2 text-xs text-muted">
                      {designer.city}, {designer.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <EditorialButton onClick={generateEdit}>
                Generate Independent Edit lookbook
              </EditorialButton>
            </div>
          </>
        )}

        <section className="mt-20 border-t border-smoke/30 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl text-ivory">Fashion destinations</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Multi-brand concept stores curating independent designers within one location.
              </p>
            </div>
            <Link
              href="/destinations"
              className="text-[10px] uppercase tracking-[0.2em] text-accent hover:underline"
            >
              View all destinations →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {MOCK_CONCEPT_STORES.map((store) => (
              <Link
                key={store.id}
                href={`/destinations/${store.slug}`}
                className="group border border-smoke/50 bg-charcoal"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={store.coverImageUrl}
                    alt={store.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="600px"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                    Concept store · {store.city}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-ivory">{store.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-smoke/30 pt-12">
          <h2 className="font-display text-2xl text-ivory">Add Your Label to Archive411</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Are you an independent or emerging designer? Connect your website and introduce your
            work to users searching by style, size, city, occasion and budget.
          </p>
          <div className="mt-6 flex gap-4">
            <EditorialButton href="/for-designers/apply">Apply to Join</EditorialButton>
            <Link
              href="/for-designers"
              className="self-center text-xs uppercase tracking-[0.2em] text-muted hover:text-ivory"
            >
              Learn How It Works
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 pt-6 text-sm text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent"
      />
      {label}
    </label>
  );
}

export default function IndependentPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <IndependentContent />
    </RouteGuard>
  );
}
