"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import RouteGuard from "@/app/components/RouteGuard";
import { MOCK_DESIGNERS } from "@/app/data/mockCatalog";
import { DESIGNER_LABEL_DISPLAY } from "@/app/data/aestheticTags";

function DesignersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <h1 className="font-display text-4xl text-ivory md:text-5xl">Designers</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Independent, emerging and designer-led labels in the Archive411 registry.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_DESIGNERS.map((d) => (
            <Link key={d.id} href={`/designers/${d.slug}`} className="border border-smoke/50 bg-charcoal">
              <div className="relative aspect-[4/3]">
                <Image src={d.coverImageUrl} alt={d.labelName} fill className="object-cover" sizes="400px" />
              </div>
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent">
                  {DESIGNER_LABEL_DISPLAY[d.labelType]}
                </p>
                <h2 className="mt-1 font-display text-xl text-ivory">{d.labelName}</h2>
                <p className="mt-1 text-xs text-muted">{d.city}, {d.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
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
