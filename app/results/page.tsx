"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import AppHeader from "@/app/components/AppHeader";
import FashionIntelligenceCard from "@/app/components/FashionIntelligenceCard";
import FashionIntelligenceDrawer from "@/app/components/FashionIntelligenceDrawer";
import RouteGuard from "@/app/components/RouteGuard";
import { LOOKBOOK_MATRIX } from "@/app/data/fashionIntelligenceMatrix";
import { EDITORIAL_EASE, pageVariants, staggerContainer } from "@/app/lib/motion";
import type { IntelligenceGarment, LookbookProfile } from "@/app/types/fashionIntelligence";

interface AffiliateResponse {
  affiliateUrl?: string;
  error?: string;
}

async function triggerSecureAffiliateRedirect(query: string): Promise<void> {
  try {
    const response = await fetch("/api/affiliate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as AffiliateResponse;

    if (data.affiliateUrl) {
      window.open(data.affiliateUrl, "_blank");
    }
  } catch {
    // Network or parse failure — do not open an untracked fallback URL.
  }
}

function handleGarmentAffiliateRedirect(garment: IntelligenceGarment): void {
  void triggerSecureAffiliateRedirect(`${garment.name} ${garment.affiliateUrl}`);
}

function readMetaFromParams(searchParams: URLSearchParams): string {
  const mode = searchParams.get("mode");
  const budget = searchParams.get("budget");
  const categories = searchParams.get("categories");
  const from = searchParams.get("from");

  const parts: string[] = [];
  if (from === "build") parts.push("Build My Look");
  if (from === "generate") parts.push("Curated Edit");
  if (mode) parts.push(mode === "random" ? "Random Edit" : "Curated Edit");
  if (categories) parts.push(`${categories.split(",").length} categories`);
  if (budget) parts.push(budget.replace(/-/g, " "));

  return parts.length > 0 ? parts.join(" · ") : "High-Low Style Registry";
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<LookbookProfile | null>(null);
  const [meta, setMeta] = useState("High-Low Style Registry");

  useEffect(() => {
    setMeta(readMetaFromParams(searchParams));
  }, [searchParams]);

  return (
    <motion.div
      className="min-h-screen bg-ink"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <AppHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="container-editorial mobile-page-top pb-24 md:pt-28 md:pb-28"
      >
        <header className="mb-14 border-b border-smoke/30 pb-10 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            className="text-[10px] uppercase tracking-[0.45em] text-muted"
          >
            Fashion Intelligence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: EDITORIAL_EASE }}
            className="mt-4 font-display text-4xl text-ivory md:text-6xl"
          >
            High-Low Registry
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EDITORIAL_EASE }}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-muted"
          >
            {meta}. Twelve editorial lookbook profiles pairing Macy&apos;s foundations
            with luxury accents — each mapped to historical influence, runway
            reference, and subculture-calibrated curation narratives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EDITORIAL_EASE }}
            className="mt-8 flex flex-wrap items-center gap-6 border-t border-smoke/20 pt-6"
          >
            {[
              { label: "Profiles", value: String(LOOKBOOK_MATRIX.length) },
              { label: "Matrix", value: "High-Low" },
              { label: "Tracking", value: "Rakuten · Impact" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[9px] uppercase tracking-[0.3em] text-smoke">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm text-ivory">{stat.value}</p>
              </div>
            ))}
            <Link
              href="/build"
              className="ml-auto text-[10px] uppercase tracking-[0.25em] text-accent transition-colors hover:text-ivory"
            >
              Build a custom edit →
            </Link>
          </motion.div>
        </header>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {LOOKBOOK_MATRIX.map((profile) => (
            <FashionIntelligenceCard
              key={profile.id}
              profile={profile}
              onSelect={setSelected}
            />
          ))}
        </motion.div>
      </main>

      <FashionIntelligenceDrawer
        profile={selected}
        onClose={() => setSelected(null)}
        onAffiliateRedirect={handleGarmentAffiliateRedirect}
      />
    </motion.div>
  );
}

export default function ResultsPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ink">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
              Loading registry...
            </p>
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </RouteGuard>
  );
}
