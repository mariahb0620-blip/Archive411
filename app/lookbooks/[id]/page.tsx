"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import PreferenceTagsBar from "@/app/components/build/PreferenceTagsBar";
import RouteGuard from "@/app/components/RouteGuard";
import {
  checkSizeAvailability,
  formatCurrency,
  readLookbookSession,
  readPersistedLookbook,
} from "@/app/services/lookbook.service";
import { MOCK_DESIGNERS, MOCK_CONCEPT_STORES, MOCK_VINTAGE_SELLERS, MOCK_PRODUCTS, MOCK_SHOWROOMS } from "@/app/data/mockCatalog";
import ProductSourceActions from "@/app/components/showroom/ProductSourceActions";
import type { BuildLookAnswers, GenerationMethod, Look, Lookbook } from "@/app/types/domain";
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
  const [buildPreferences, setBuildPreferences] = useState<BuildLookAnswers | undefined>();
  const [method, setMethod] = useState<GenerationMethod>("build");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const session = readLookbookSession();
    if (session && session.lookbook.id === id) {
      setLookbook(session.lookbook);
      setLooks(session.looks);
      setMethod(session.method);
      setBuildPreferences(
        session.buildPreferences ?? session.lookbook.buildPreferences
      );
      return;
    }
    const persisted = readPersistedLookbook(id);
    if (persisted) {
      setLookbook(persisted.lookbook);
      setLooks(persisted.looks);
      setMethod(persisted.method);
      setBuildPreferences(
        persisted.buildPreferences ?? persisted.lookbook.buildPreferences
      );
      setSaved(Boolean(persisted.lookbook.saved));
    }
  }, [params.id]);

  if (!lookbook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-sm text-muted">Loading lookbook...</p>
      </div>
    );
  }

  const userSizes = collectUserSizes(buildPreferences);

  const products = looks.flatMap((look) =>
    look.productIds.map((pid) => MOCK_PRODUCTS.find((p) => p.id === pid)).filter(Boolean)
  );

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        {buildPreferences && lookbook.generationMethod === "build" && (
          <PreferenceTagsBar answers={buildPreferences} />
        )}

        <div className="relative mb-12 aspect-[21/9] overflow-hidden border border-smoke/40">
          <Image src={lookbook.coverImageUrl} alt={lookbook.title} fill className="object-cover" sizes="1200px" priority />
        </div>

        <header className="border-b border-smoke/30 pb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Lookbook</p>
          <h1 className="mt-3 font-display text-4xl text-ivory md:text-5xl">{lookbook.title}</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">{lookbook.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.2em] text-smoke">
            {lookbook.occasion && <span>{lookbook.occasion}</span>}
            {lookbook.location && <span>{lookbook.location}</span>}
            {lookbook.climate && <span>{lookbook.climate}</span>}
          </div>
          <div className="mt-6">
            <EditorialButton
              onClick={() => {
                saveLookbook(lookbook, {
                  looks,
                  method,
                  buildPreferences,
                });
                setSaved(true);
              }}
              disabled={saved}
            >
              {saved ? "Saved to My Archive" : "Save to My Archive"}
            </EditorialButton>
            {user?.isGuest && (
              <p className="mt-3 text-xs text-muted">
                Saved on this device. Create an account with email to keep your
                Archive across devices.
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
            <div className="mt-8 flex flex-wrap gap-3">
              <EditorialButton variant="ghost">Replace one item</EditorialButton>
              <EditorialButton variant="ghost">Find similar</EditorialButton>
            </div>
          </section>
        ))}

        <section className="py-12">
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">Garment breakdown</h2>
          <ul className="mt-6 divide-y divide-smoke/30">
            {products.map((product) => {
              if (!product) return null;
              const designer = product.designerId
                ? MOCK_DESIGNERS.find((d) => d.id === product.designerId)
                : undefined;
              const conceptStore = product.conceptStoreId
                ? MOCK_CONCEPT_STORES.find((s) => s.id === product.conceptStoreId)
                : undefined;
              const vintageSeller = product.vintageSellerId
                ? MOCK_VINTAGE_SELLERS.find((s) => s.id === product.vintageSellerId)
                : undefined;
              const showroom = product.showroomId
                ? MOCK_SHOWROOMS.find((s) => s.id === product.showroomId)
                : undefined;
              const sizeStatus = checkSizeAvailability(product, userSizes);
              const sourceLabel = showroom
                ? `Showroom · ${showroom.name.replace(" (reference profile)", "")}`
                : vintageSeller
                ? `Vintage · ${vintageSeller.name}`
                : conceptStore
                  ? `Concept store · ${conceptStore.name}`
                  : designer
                    ? designer.labelName
                    : "Source";
              return (
                <li key={product.id} className="flex gap-4 py-6">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-smoke/40">
                    <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{sourceLabel}</p>
                    <p className="mt-1 text-sm text-ivory">{product.name}</p>
                    <p className="mt-1 text-sm text-accent">{formatCurrency(product.price, product.currency)}</p>
                    <p className="mt-1 text-xs text-smoke">
                      {product.condition !== "new" ? `${product.condition} · ` : ""}
                      Sizes: {product.availableSizes.join(", ")}
                    </p>
                    {sizeStatus === "check" && userSizes.length > 0 && (
                      <p className="mt-2 text-xs text-accent">Check current size availability</p>
                    )}
                    {sizeStatus === "unavailable" && (
                      <p className="mt-2 text-xs text-smoke">Not available in your selected size</p>
                    )}
                    {product.isPlaceholder && (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-smoke">Placeholder product</p>
                    )}
                    <ProductSourceActions product={product} userSizes={userSizes} />
                    {designer && !showroom && (
                      <Link href={`/designers/${designer.slug}`} className="mt-2 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                        View designer
                      </Link>
                    )}
                    {showroom && (
                      <Link href={`/showrooms/${showroom.slug}`} className="mt-2 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                        View showroom
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
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
