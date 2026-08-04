"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { LookbookProfile, IntelligenceGarment } from "@/app/types/fashionIntelligence";
import {
  formatIntelligencePrice,
  openTrackedLink,
  shopLabel,
  trackingLabel,
} from "@/app/utils/fashionIntelligenceHelpers";
import { backdropVariants, drawerVariants, EDITORIAL_EASE } from "@/app/lib/motion";

function IntelChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-smoke/40 bg-ink/50 px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.3em] text-smoke">{label}</p>
      <p className="mt-1 text-xs leading-snug text-ivory/90">{value}</p>
    </div>
  );
}

interface FashionIntelligenceDrawerProps {
  profile: LookbookProfile | null;
  onClose: () => void;
  onAffiliateRedirect?: (garment: IntelligenceGarment) => void;
}

export default function FashionIntelligenceDrawer({
  profile,
  onClose,
  onAffiliateRedirect,
}: FashionIntelligenceDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!profile) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [profile, onClose]);

  return (
    <AnimatePresence>
      {profile && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-[3px]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            ref={panelRef}
            key="drawer"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${profile.title} fashion intelligence breakdown`}
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-none flex-col border-l border-smoke/50 bg-charcoal shadow-[-28px_0_100px_rgba(0,0,0,0.6)] md:max-w-xl"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-smoke/40">
              <Image
                src={profile.heroImageUrl}
                alt={profile.title}
                fill
                className="object-cover"
                sizes="640px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-ink/30" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 border border-smoke/60 bg-ink/85 px-3 py-2 text-xs uppercase tracking-[0.2em] text-ivory backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                aria-label="Close look detail"
              >
                Close
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="border-b border-smoke/30 px-6 py-7 md:px-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
                  Look {String(profile.index).padStart(2, "0")} · {profile.season} ·{" "}
                  {profile.subculture}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ivory">{profile.title}</h2>
                <p className="mt-2 text-sm text-muted">{profile.tagline}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-accent">
                  Total Investment · {formatIntelligencePrice(profile.totalPrice)}
                </p>
              </div>

              <div className="border-b border-smoke/30 px-6 py-6 md:px-8">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.35em] text-muted">
                  Fashion Intelligence
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <IntelChip label="Historical Influence" value={profile.historicalInfluence} />
                  <IntelChip label="Runway Reference" value={profile.runwayReference} />
                </div>
              </div>

              <div className="border-b border-smoke/30 px-6 py-6 md:px-8">
                <h3 className="mb-3 text-[10px] uppercase tracking-[0.35em] text-muted">
                  Curation Narrative
                </h3>
                <p className="text-sm leading-[1.75] text-ivory/85">
                  {profile.curationNarrative}
                </p>
              </div>

              <div className="px-6 py-6 md:px-8">
                <div className="mb-6 flex items-end justify-between">
                  <h3 className="text-[10px] uppercase tracking-[0.35em] text-muted">
                    Garment Registry
                  </h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-smoke">
                    Ad-free · Affiliate tracked
                  </p>
                </div>

                <ul className="divide-y divide-smoke/30">
                  {profile.garments.map((garment, i) => (
                    <motion.li
                      key={garment.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + i * 0.06,
                        duration: 0.4,
                        ease: EDITORIAL_EASE,
                      }}
                      className="flex gap-4 py-6 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-smoke/40 bg-smoke">
                        <Image
                          src={garment.imageUrl}
                          alt={garment.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        <span
                          className={`absolute bottom-0 left-0 right-0 py-0.5 text-center text-[8px] uppercase tracking-[0.15em] ${
                            garment.retailer === "macys"
                              ? "bg-ink/80 text-muted"
                              : "bg-ink/80 text-accent"
                          }`}
                        >
                          {garment.retailer === "macys" ? "Macy's" : "Luxury"}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span
                              className={`text-[10px] uppercase tracking-[0.2em] ${
                                garment.retailer === "macys" ? "text-muted" : "text-accent"
                              }`}
                            >
                              {garment.brand}
                            </span>
                            <span className="text-[10px] text-smoke">·</span>
                            <span className="text-[10px] uppercase tracking-[0.15em] text-smoke">
                              {trackingLabel(garment.trackingNetwork)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-snug text-ivory">
                            {garment.name}
                          </p>
                          <p className="mt-1 text-sm text-accent">
                            {formatIntelligencePrice(garment.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAffiliateRedirect) {
                              onAffiliateRedirect(garment);
                            } else {
                              openTrackedLink(garment);
                            }
                          }}
                          className="mt-4 w-fit border border-smoke/60 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
                          aria-label={`${shopLabel(garment)} — ${garment.name}`}
                        >
                          {shopLabel(garment)}
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
