"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppImage from "@/app/components/AppImage";
import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import StickyActionBar from "@/app/components/StickyActionBar";
import EmptyState from "@/app/components/EmptyState";
import PreferenceTagsBar from "@/app/components/build/PreferenceTagsBar";
import RouteGuard from "@/app/components/RouteGuard";
import {
  checkSizeAvailability,
  formatCurrency,
  readLookbookSession,
  readPersistedLookbook,
} from "@/app/services/lookbook.service";
import { BETA_DESIGNERS } from "@/app/data/betaCatalog";
import { productImage } from "@/app/data/catalogImages";
import { fetchLookbookById, replaceProduct } from "@/app/services/archive.api";
import ProductSourceActions from "@/app/components/showroom/ProductSourceActions";
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

  const resolveProducts = useCallback((): Product[] => {
    const ids = looks.flatMap((l) => l.productIds);
    return ids
      .map((pid) => catalogProducts.find((p) => p.id === pid))
      .filter(Boolean) as Product[];
  }, [looks, catalogProducts]);

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
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted">Loading lookbook...</p>
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
  const products = resolveProducts();
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

        {looks.map((look) => (
          <section key={look.id} className="border-b border-smoke/30 py-12">
            <h2 className="font-display text-2xl text-ivory">{look.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{look.explanation}</p>
            {look.matchExplanation && (
              <p className="mt-3 text-sm text-accent">{look.matchExplanation}</p>
            )}
            <p className="mt-2 text-sm text-ivory">
              Estimated total · {formatCurrency(look.totalEstimatedPrice, look.currency)}
            </p>
            <div className="mt-4 flex gap-2">
              {look.colorPalette.map((c) => (
                <span key={c} className="h-6 w-6 border border-smoke/40" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </section>
        ))}

        <section className="py-12">
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">Garment breakdown</h2>
          {products.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No products in this lookbook.</p>
          ) : (
            <ul className="mt-6 divide-y divide-smoke/30">
              {products.map((product) => {
                const lookForProduct = looks.find((l) => l.productIds.includes(product.id));
                const designer = product.designerId
                  ? BETA_DESIGNERS.find((d) => d.id === product.designerId)
                  : undefined;
                const sizeStatus = checkSizeAvailability(product, userSizes);
                const sourceLabel = designer ? designer.labelName : "Source";
                const isSoldOut = product.inventoryStatus === "sold-out";
                const isBrokenLink = product.productUrl.includes("example.com");

                return (
                  <li key={product.id} className="flex gap-4 py-5 md:py-6">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md border border-smoke/40 md:h-24 md:w-20 md:rounded-none">
                      <AppImage
                        src={product.imageUrls[0] ?? productImage(product.category)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{sourceLabel}</p>
                      <p className="mt-1 text-sm text-ivory">{product.name}</p>
                      <p className="mt-1 text-sm text-accent">{formatCurrency(product.price, product.currency)}</p>
                      <p className="mt-1 text-xs text-smoke">
                        {product.condition !== "new" ? `${product.condition} · ` : ""}
                        Sizes: {product.availableSizes.join(", ")}
                      </p>
                      {isSoldOut && (
                        <p className="mt-2 text-xs text-smoke">Sold out at source</p>
                      )}
                      {sizeStatus === "check" && userSizes.length > 0 && (
                        <p className="mt-2 text-xs text-accent">Check current size availability</p>
                      )}
                      {sizeStatus === "unavailable" && (
                        <p className="mt-2 text-xs text-smoke">Not available in your selected size</p>
                      )}
                      {isBrokenLink && (
                        <p className="mt-2 text-xs text-accent">Link unavailable — development data</p>
                      )}
                      {!isBrokenLink && !isSoldOut && (
                        <ProductSourceActions product={product} userSizes={userSizes} />
                      )}
                      {designer && (
                        <Link href={`/designers/${designer.slug}`} className="mt-2 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                          View designer
                        </Link>
                      )}
                      {lookForProduct && (
                        <div className="mt-3">
                          <EditorialButton
                            variant="ghost"
                            disabled={replacing === product.id}
                            onClick={() =>
                              handleReplaceItem(lookForProduct.id, product.id, product.category)
                            }
                          >
                            {replacing === product.id ? "Replacing..." : "Replace item"}
                          </EditorialButton>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
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
