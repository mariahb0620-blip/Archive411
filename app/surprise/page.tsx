"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import AppImage from "@/app/components/AppImage";
import EditorialButton from "@/app/components/EditorialButton";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";
import { DEFAULT_PRICE_RANGE } from "@/app/data/mockCatalog";
import { productImage } from "@/app/data/catalogImages";
import {
  generateSurpriseLookbook,
} from "@/app/services/lookbook.service";
import { completeLookbookFlow } from "@/app/services/completeLookbookFlow";
import { getVerifiedProductsSync } from "@/lib/catalog/verifiedPool";
import type { SurpriseConstraints } from "@/app/types/domain";
import { useApp } from "@/app/context/AppContext";

function SurpriseContent() {
  const router = useRouter();
  const { saveLookbook } = useApp();
  const [constraints, setConstraints] = useState<SurpriseConstraints>({
    priceRange: DEFAULT_PRICE_RANGE,
    adventurousness: 50,
  });
  const [result, setResult] = useState<ReturnType<
    typeof generateSurpriseLookbook
  > | null>(null);

  const previewProducts = useMemo(() => {
    if (!result?.looks[0]) return [];
    const pool = getVerifiedProductsSync();
    return result.looks[0].productIds
      .slice(0, 3)
      .map((id) => pool.find((p) => p.id === id))
      .filter(Boolean);
  }, [result]);

  const generate = () => {
    setResult(generateSurpriseLookbook(constraints));
  };

  const saveToArchive = async () => {
    if (!result) return;
    await completeLookbookFlow(router, saveLookbook, {
      lookbook: result.lookbook,
      looks: result.looks,
      method: "surprise",
    });
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
          <div className="mt-10 max-w-2xl overflow-hidden border border-smoke/50 bg-charcoal">
            <div className="relative aspect-[16/9] w-full">
              <AppImage
                src={result.lookbook.coverImageUrl}
                alt={result.lookbook.title}
                fill
                className="object-cover"
                sizes="640px"
              />
            </div>
            <div className="p-8">
              <h2 className="font-display text-3xl text-ivory">
                {result.lookbook.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {result.aestheticExplanation}
              </p>
              {previewProducts.length > 0 && (
                <div className="mt-6 flex gap-2">
                  {previewProducts.map((product) => (
                    <div
                      key={product!.id}
                      className="relative h-20 w-16 overflow-hidden rounded border border-smoke/40"
                    >
                      <AppImage
                        src={product!.imageUrls[0] ?? productImage(product!.category)}
                        alt={product!.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <EditorialButton onClick={generate}>Try another</EditorialButton>
                <EditorialButton variant="ghost" onClick={saveToArchive}>
                  Save to Archive
                </EditorialButton>
              </div>
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
