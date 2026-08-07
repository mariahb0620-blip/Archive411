"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import StickyActionBar from "@/app/components/StickyActionBar";
import EmptyState from "@/app/components/EmptyState";
import LookbookSkeleton from "@/app/components/LookbookSkeleton";
import LookOutfitSection from "@/app/components/lookbook/LookOutfitSection";
import PreferenceTagsBar from "@/app/components/build/PreferenceTagsBar";
import RouteGuard from "@/app/components/RouteGuard";
import {
  readLookbookSession,
  readPersistedLookbook,
} from "@/app/services/lookbook.service";
import { fetchLookbookById, replaceProduct } from "@/app/services/archive.api";
import type { BuildLookAnswers, GenerationMethod, Look, Lookbook, Product } from "@/app/types/domain";
import { useApp } from "@/app/context/AppContext";

function collectUserSizes(prefs?: BuildLookAnswers): string[] {
  if (!prefs) return [];
  const sizes: string[] = [];
  const cs = prefs.clothingSizes;
  if (cs) {
    (["tops", "bottoms", "dresses", "outerwear", "bras"] as const).forEach((key) => {
      if (cs[key] && !(cs.skippedCategories ?? []).includes(key)) {
        sizes.push(cs[key]!);
      }
    });
  }
  if (prefs.footwear?.shoeSize) sizes.push(prefs.footwear.shoeSize);
  return sizes;
}

function LookbookContent() {
  const params = useParams();
  const { saveLookbook, user } = useApp();
  const [lookbook, setLookbook] = useState<Lookbook | null>(null);
  const [looks, setLooks] = useState<Look[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [buildPreferences, setBuildPreferences] = useState<BuildLookAnswers | undefined>();
  const [method, setMethod] = useState<GenerationMethod>("build");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replacing, setReplacing] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const id = params.id as string;
      setLoading(true);
      setError(null);

      const session = readLookbookSession();
      if (session && session.lookbook.id === id) {
        setLookbook(session.lookbook);
        setLooks(session.looks);
        setMethod(session.method);
        setCatalogProducts(session.products ?? []);
        setBuildPreferences(session.buildPreferences ?? session.lookbook.buildPreferences);
        setSaved(Boolean(session.lookbook.saved));
        setLoading(false);
        return;
      }

      const persisted = readPersistedLookbook(id);
      if (persisted) {
        setLookbook(persisted.lookbook);
        setLooks(persisted.looks);
        setMethod(persisted.method);
        setBuildPreferences(persisted.buildPreferences ?? persisted.lookbook.buildPreferences);
        setSaved(Boolean(persisted.lookbook.saved));
        setLoading(false);
        return;
      }

      try {
        const apiData = await fetchLookbookById(id);
        if (apiData) {
          setLookbook(apiData.lookbook);
          setLooks(apiData.looks);
          setCatalogProducts(apiData.products);
          setMethod(apiData.lookbook.generationMethod);
          setBuildPreferences(apiData.lookbook.buildPreferences);
          setSaved(true);
        } else {
          setError("Lookbook not found.");
        }
      } catch {
        setError("Could not load this lookbook.");
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const resolveLookProducts = useCallback(
    (look: Look): Product[] => {
      return (look.productIds ?? [])
        .map((pid) => catalogProducts.find((p) => p.id === pid))
        .filter(Boolean) as Product[];
    },
    [catalogProducts]
  );

  const handleReplaceItem = async (lookId: string, productId: string, category: string) => {
    setReplacing(productId);
    const excludeIds = looks.flatMap((l) => l.productIds);
    const replacement = await replaceProduct({
      category,
      excludeIds,
      answers: buildPreferences,
    });
    if (replacement) {
      setLooks((prev) =>
        prev.map((look) =>
          look.id === lookId
            ? {
                ...look,
                productIds: look.productIds.map((id) =>
                  id === productId ? replacement.id : id
                ),
              }
            : look
        )
      );
      setCatalogProducts((prev) => {
        const exists = prev.find((p) => p.id === replacement.id);
        return exists ? prev : [...prev, replacement];
      });
    }
    setReplacing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink">
        <AppHeader />
        <AppPageMain className="pt-6">
          <LookbookSkeleton />
        </AppPageMain>
      </div>
    );
  }

  if (error || !lookbook) {
    return (
      <div className="min-h-screen bg-ink">
        <AppHeader />
        <main className="container-editorial flex min-h-screen flex-col items-center justify-center pt-24">
          <EmptyState
            headline={error ?? "Lookbook not found"}
            text="Try generating a new lookbook or return to your Archive."
            primaryLabel="Build My Look"
            primaryHref="/build"
          />
        </main>
      </div>
    );
  }

  const userSizes = collectUserSizes(buildPreferences);
  const isEmpty = looks.length === 0;

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain stickyFooter={!saved && !isEmpty}>
        {buildPreferences && lookbook.generationMethod === "build" && (
          <PreferenceTagsBar answers={buildPreferences} />
        )}

        <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-lg border border-smoke/40 md:mb-12 md:aspect-[21/9] md:rounded-none">
          <AppImage src={lookbook.coverImageUrl} alt={lookbook.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 1200px" priority />
        </div>

        <header className="border-b border-smoke/30 pb-6 md:pb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Lookbook</p>
          <h1 className="mt-3 font-display text-3xl text-ivory md:text-5xl">{lookbook.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{lookbook.description}</p>
          {isEmpty && (
            <p className="mt-4 text-sm text-accent">
              No complete outfits matched your preferences in the verified catalog. Try broadening
              style, budget, or location.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-smoke">
            {lookbook.occasion && <span className="rounded-full border border-smoke/40 px-2 py-1">{lookbook.occasion}</span>}
            {lookbook.location && <span className="rounded-full border border-smoke/40 px-2 py-1">{lookbook.location}</span>}
            {lookbook.climate && <span className="rounded-full border border-smoke/40 px-2 py-1">{lookbook.climate}</span>}
          </div>
          <div className="mt-6 hidden md:block">
            <EditorialButton
              onClick={async () => {
                await saveLookbook(lookbook, {
                  looks,
                  method,
                  buildPreferences,
                });
                setSaved(true);
              }}
              disabled={saved || isEmpty}
            >
              {saved ? "Saved to My Archive" : "Save to My Archive"}
            </EditorialButton>
            {user?.isGuest && (
              <p className="mt-3 text-xs text-muted">
                Saved on this device.{" "}
                <Link href="/auth" className="text-accent underline">
                  Create an account
                </Link>{" "}
                to sync across devices.
              </p>
            )}
          </div>
        </header>

        {looks.map((look) => {
          const lookProducts = resolveLookProducts(look);
          return (
            <LookOutfitSection
              key={look.id}
              look={look}
              products={lookProducts}
              userSizes={userSizes}
              replacing={replacing}
              onReplaceItem={(productId, category) =>
                handleReplaceItem(look.id, productId, category)
              }
            />
          );
        })}
      </AppPageMain>

      {!saved && !isEmpty && (
        <StickyActionBar>
          <EditorialButton
            className="w-full"
            onClick={async () => {
              await saveLookbook(lookbook, {
                looks,
                method,
                buildPreferences,
              });
              setSaved(true);
            }}
          >
            Save to My Archive
          </EditorialButton>
        </StickyActionBar>
      )}
    </div>
  );
}

export default function LookbookPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <LookbookContent />
    </RouteGuard>
  );
}
