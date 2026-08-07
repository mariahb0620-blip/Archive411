"use client";

import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";
import { getVerifiedDesignersSync } from "@/lib/catalog/verifiedPool";
import { DESIGNER_LABEL_DISPLAY } from "@/app/data/aestheticTags";

function DesignersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain>
        <h1 className="font-display text-3xl text-ivory md:text-5xl">Designers</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Independent, emerging and designer-led labels in the Archive411 registry.
        </p>
        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {getVerifiedDesignersSync().map((d) => (
            <Link
              key={d.id}
              href={`/designers/${d.slug}`}
              className="group overflow-hidden rounded-xl border border-smoke/50 bg-charcoal active:scale-[0.98] md:rounded-none md:active:scale-100"
            >
              <div className="relative aspect-[16/10] md:aspect-[4/3]">
                <AppImage src={d.coverImageUrl} alt={d.labelName} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width:768px) 100vw, 400px" />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent">
                  {DESIGNER_LABEL_DISPLAY[d.labelType]}
                </p>
                <h2 className="mt-1 font-display text-xl text-ivory">{d.labelName}</h2>
                <p className="mt-1 text-xs text-muted">{d.city}, {d.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </AppPageMain>
    </div>
  );
}

export default function DesignersPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <DesignersContent />
    </RouteGuard>
  );
}
