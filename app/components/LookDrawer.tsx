"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  formatPrice,
  getRetailerLabel,
  openAffiliateLink,
} from "@/app/utils/affiliate";
import type { OutfitLook } from "@/app/types/styling";
import { backdropVariants, drawerVariants } from "@/app/lib/motion";

interface LookDrawerProps {
  look: OutfitLook | null;
  onClose: () => void;
}

export default function LookDrawer({ look, onClose }: LookDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!look) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [look, onClose]);

  useEffect(() => {
    if (look && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [look]);

  return (
    <AnimatePresence>
      {look && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${look.title} look details`}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-lg flex-col border-l border-smoke/40 bg-charcoal shadow-2xl"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
              <Image
                src={look.heroImageUrl}
                alt={look.title}
                fill
                className="object-cover"
                sizes="512px"
                priority
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-smoke/60 bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
              <div className="mb-8">
                <h2 className="font-display text-3xl text-ivory">{look.title}</h2>
                <p className="mt-2 text-muted">{look.tagline}</p>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-accent">
                  Total · {formatPrice(look.totalPrice)}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-muted">
                  Garment Breakdown
                </h3>

                {look.garments.map((garment) => (
                  <div
                    key={garment.id}
                    className="flex gap-4 border-b border-smoke/30 pb-6"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-smoke">
                      <Image
                        src={garment.imageUrl}
                        alt={garment.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted">
                          {garment.brand}
                        </p>
                        <p className="mt-1 text-sm text-ivory">{garment.name}</p>
                        <p className="mt-1 text-sm text-accent">
                          {formatPrice(garment.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openAffiliateLink(garment)}
                        className="mt-3 self-start border border-smoke/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-accent hover:text-accent"
                        aria-label={`${getRetailerLabel(garment.retailer)} — ${garment.name}`}
                      >
                        {getRetailerLabel(garment.retailer)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
