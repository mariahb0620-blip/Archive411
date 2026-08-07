"use client";

import AppImage from "@/app/components/AppImage";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import { MOCK_DESIGNERS } from "@/app/data/mockCatalog";
import { formatCurrency } from "@/app/services/lookbook.service";
import {
  getConceptStoreBySlug,
  getConceptStoreProducts,
} from "@/app/services/catalog.service";

function DestinationContent() {
  const params = useParams();
  const slug = params.slug as string;
  const store = getConceptStoreBySlug(slug);
  const products = store ? getConceptStoreProducts(store.id) : [];
  const stockedDesigners = store
    ? MOCK_DESIGNERS.filter((d) => store.designerIds.includes(d.id))
    : [];

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-muted">Destination not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <div className="relative mb-10 aspect-[21/9] overflow-hidden border border-smoke/40">
          <AppImage src={store.coverImageUrl} alt={store.name} fill className="object-cover" sizes="1200px" />
        </div>

        <header className="border-b border-smoke/30 pb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Concept store</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
            {store.city}, {store.country}
          </p>
          <h1 className="mt-3 font-display text-4xl text-ivory">{store.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{store.biography}</p>
          {store.isReferenceExample && (
            <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-smoke">
              Reference example — mock development data
            </p>
          )}
        </header>

        <section className="grid gap-4 border-b border-smoke/30 py-8 md:grid-cols-3">
          <Info label="Physical locations" value={store.physicalLocations.join(", ")} />
          <Info
            label="Online purchasing"
            value={store.onlinePurchasing ? "Available" : "In-store only"}
          />
          <Info label="Categories" value={store.categories.join(", ")} />
        </section>

        <section className="py-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Designers stocked</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {stockedDesigners.map((d) => (
              <Link
                key={d.id}
                href={`/designers/${d.slug}`}
                className="border border-smoke/50 px-4 py-2 text-sm text-ivory hover:border-accent"
              >
                {d.labelName}
              </Link>
            ))}
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Products at this destination</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="border border-smoke/50 bg-charcoal">
                <div className="relative aspect-square">
                  <AppImage src={p.imageUrls[0]} alt={p.name} fill className="object-cover" sizes="300px" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-ivory">{p.name}</p>
                  <p className="mt-1 text-sm text-accent">{formatCurrency(p.price, p.currency)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-smoke">
                    {p.condition === "new" ? "New" : p.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {store.website && (
          <EditorialButton href={store.website} variant="ghost">
            Visit store website
          </EditorialButton>
        )}
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-1 text-sm text-ivory">{value}</p>
    </div>
  );
}

export default function DestinationPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <DestinationContent />
    </RouteGuard>
  );
}
