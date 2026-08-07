"use client";

import AppImage from "@/app/components/AppImage";
import { useParams } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";
import {
  getDesignerBySlug,
  getDesignerProducts,
  formatCurrency,
} from "@/app/services/lookbook.service";
import { DESIGNER_LABEL_DISPLAY } from "@/app/data/aestheticTags";

function DesignerProfileContent() {
  const params = useParams();
  const slug = params.slug as string;
  const designer = getDesignerBySlug(slug);
  const products = designer ? getDesignerProducts(designer.id) : [];

  if (!designer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-muted">Designer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain>
        <div className="relative mb-10 aspect-[21/9] overflow-hidden border border-smoke/40">
          <AppImage src={designer.coverImageUrl} alt={designer.labelName} fill className="object-cover" sizes="1200px" />
        </div>

        <header className="border-b border-smoke/30 pb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
            {DESIGNER_LABEL_DISPLAY[designer.labelType] ?? "Designer"} · {designer.city},{" "}
            {designer.country}
          </p>
          <h1 className="mt-3 font-display text-4xl text-ivory">{designer.labelName}</h1>
          {designer.isReferenceExample && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-smoke">
              Reference example — not an official partnership
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <EditorialButton variant="ghost" disabled>
              Save designer (soon)
            </EditorialButton>
            <EditorialButton variant="ghost" disabled>
              Follow designer (soon)
            </EditorialButton>
            {designer.requestDesignerEnabled && (
              <EditorialButton href="/for-designers/apply" variant="ghost">
                Request This Designer
              </EditorialButton>
            )}
          </div>
        </header>

        <section className="py-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent">About the Designer</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke">Written by the designer.</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/90">{designer.biography}</p>
          {designer.designPhilosophy && (
            <p className="mt-4 max-w-2xl text-sm text-muted">{designer.designPhilosophy}</p>
          )}
        </section>

        <section className="grid gap-4 border-y border-smoke/30 py-8 md:grid-cols-3">
          <Info label="Size range" value={designer.sizeRange} />
          <Info label="Made to order" value={designer.madeToOrder ? "Yes" : "No"} />
          <Info label="Custom sizing" value={designer.customSizing ? "Yes" : "No"} />
        </section>

        <section className="py-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Current pieces</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="border border-smoke/50 bg-charcoal">
                <div className="relative aspect-square">
                  <AppImage src={p.imageUrls[0]} alt={p.name} fill className="object-cover" sizes="300px" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-ivory">{p.name}</p>
                  <p className="mt-1 text-sm text-accent">{formatCurrency(p.price, p.currency)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {designer.isPlaceholder && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-smoke">Placeholder designer data</p>
        )}
      </AppPageMain>
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

export default function DesignerProfilePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <DesignerProfileContent />
    </RouteGuard>
  );
}
