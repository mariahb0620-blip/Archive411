"use client";

import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";

function ForDesignersContent() {
  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial max-w-3xl pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent">For Designers</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          Add Your Label to Archive411
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Are you an independent or emerging designer? Connect your website and
          introduce your work to users searching by style, size, city, occasion and
          budget.
        </p>

        <section className="mt-12 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            Archive411 is a fashion discovery and lookbook platform — not a
            generic marketplace. We feature designers alongside complete looks so
            users discover your work in context.
          </p>
          <p>
            Submissions may be reviewed for quality, authenticity, product
            information and image permissions. We do not promise automatic
            acceptance.
          </p>
          <p>
            Designers must agree that Archive411 can display approved product
            images, descriptions, prices and links. We do not scrape or copy
            designer content without permission.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <EditorialButton href="/for-designers/apply">Apply to Join</EditorialButton>
          <EditorialButton variant="ghost" href="/designer/dashboard">
            Designer Dashboard
          </EditorialButton>
        </div>
      </main>
    </div>
  );
}

export default function ForDesignersPage() {
  return (
    <RouteGuard requireIntro requireAuth={false}>
      <ForDesignersContent />
    </RouteGuard>
  );
}
