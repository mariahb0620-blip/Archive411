"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import RouteGuard from "@/app/components/RouteGuard";
import { MOCK_CONCEPT_STORES, MOCK_VINTAGE_SELLERS } from "@/app/data/mockCatalog";

function DestinationsContent() {
  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Fashion destinations</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">Concept stores & sources</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Multi-brand destinations, vintage sellers and curated resale — modeled separately from
          individual designers. Reference profiles for development; not official partnerships.
        </p>

        <section className="mt-12">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent">Concept stores</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {MOCK_CONCEPT_STORES.map((store) => (
              <Link
                key={store.id}
                href={`/destinations/${store.slug}`}
                className="border border-smoke/50 bg-charcoal"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={store.coverImageUrl} alt={store.name} fill className="object-cover" sizes="600px" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted">{store.city}, {store.country}</p>
                  <h3 className="mt-2 font-display text-xl text-ivory">{store.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent">Vintage & archive sellers</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_VINTAGE_SELLERS.map((seller) => (
              <div key={seller.id} className="border border-smoke/50 bg-charcoal p-5">
                <p className="text-xs text-muted">{seller.city}, {seller.country}</p>
                <h3 className="mt-2 font-display text-lg text-ivory">{seller.name}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">{seller.biography}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-smoke">
                  {seller.specialties.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <DestinationsContent />
    </RouteGuard>
  );
}
