"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";
import { DEFAULT_PRICE_RANGE } from "@/app/data/mockCatalog";
import {
  generateSurpriseLookbook,
  storeLookbookSession,
} from "@/app/services/lookbook.service";
import type { SurpriseConstraints } from "@/app/types/domain";
import { useApp } from "@/app/context/AppContext";

function SurpriseContent() {
  const router = useRouter();
  const { saveLookbook, user } = useApp();
  const [constraints, setConstraints] = useState<SurpriseConstraints>({
    priceRange: DEFAULT_PRICE_RANGE,
    adventurousness: 50,
  });
  const [result, setResult] = useState<ReturnType<
    typeof generateSurpriseLookbook
  > | null>(null);

  const generate = () => {
    setResult(generateSurpriseLookbook(constraints));
  };

  const openLookbook = () => {
    if (!result) return;
    storeLookbookSession(result.lookbook, result.looks, "surprise");
    router.push(`/lookbooks/${result.lookbook.id}`);
  };

  const save = () => {
    if (!result || user?.isGuest) return;
    saveLookbook(result.lookbook);
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="max-w-2xl space-y-8">
        <header>
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Surprise Me</p>
          <h1 className="mt-2 font-display text-3xl text-ivory">Something unexpected</h1>
          <p className="mt-3 text-sm text-muted">
            Set a few constraints — Archive411 selects an aesthetic direction and builds a lookbook
            from the verified catalog.
          </p>
        </header>

        {!result ? (
          <div className="mt-10 max-w-lg space-y-6">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Occasion
              </span>
              <input
                className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
                onChange={(e) =>
                  setConstraints((c) => ({ ...c, occasion: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                How adventurous?
              </span>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={50}
                className="mt-2 w-full accent-accent"
                onChange={(e) =>
                  setConstraints((c) => ({
                    ...c,
                    adventurousness: Number(e.target.value),
                  }))
                }
              />
            </label>
            <EditorialButton onClick={generate}>Surprise me</EditorialButton>
          </div>
        ) : (
          <div className="mt-10 max-w-2xl border border-smoke/50 bg-charcoal p-8">
            <h2 className="font-display text-3xl text-ivory">
              {result.lookbook.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {result.aestheticExplanation}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <EditorialButton onClick={generate}>Try another</EditorialButton>
              <EditorialButton variant="ghost" onClick={openLookbook}>
                View lookbook
              </EditorialButton>
              {!user?.isGuest && (
                <EditorialButton variant="ghost" onClick={save}>
                  Save to My Archive
                </EditorialButton>
              )}
            </div>
          </div>
        )}
      </AppPageMain>
    </div>
  );
}

export default function SurprisePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <SurpriseContent />
    </RouteGuard>
  );
}
