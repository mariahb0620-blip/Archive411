"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { INTRO_SLIDES } from "@/app/data/mockCatalog";
import { useApp } from "@/app/context/AppContext";
import { EDITORIAL_EASE } from "@/app/lib/motion";

const PANEL_TONES = [
  "bg-[#1a1a1a]",
  "bg-[#222222]",
  "bg-[#181818]",
  "bg-[#242424]",
  "bg-[#1c1c1c]",
  "bg-[#202020]",
];

export default function IntroPage() {
  const router = useRouter();
  const { completeIntro, introComplete } = useApp();
  const [slide, setSlide] = useState(0);

  const finish = () => {
    completeIntro();
    router.push("/auth");
  };

  useEffect(() => {
    if (introComplete) router.replace("/auth");
  }, [introComplete, router]);

  if (introComplete) return null;

  const current = INTRO_SLIDES[slide];

  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 opacity-40 md:grid-cols-6">
        {PANEL_TONES.map((tone, i) => (
          <div
            key={i}
            className={`relative overflow-hidden border border-smoke/20 ${tone}`}
          >
            <div className="absolute inset-x-4 bottom-4 h-px bg-smoke/40" />
            <div className="absolute left-4 top-1/3 h-px w-1/2 bg-accent/30" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/70" />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-10 pt-16 md:px-12">
        <p className="font-display text-sm uppercase tracking-[0.35em] text-accent">
          archive.411
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl leading-tight text-ivory md:text-6xl">
              {current.headline}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
              {current.copy}
            </p>

            {slide === 1 && (
              <div className="mt-8 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="aspect-[3/4] border border-smoke/50 bg-charcoal/80"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-6">
          {slide === 0 ? (
            <>
              <button
                type="button"
                onClick={() => setSlide(1)}
                className="touch-target border border-accent bg-accent/10 px-8 text-xs uppercase tracking-[0.25em] text-accent"
              >
                Next
              </button>
              <button
                type="button"
                onClick={finish}
                className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory"
              >
                Skip
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="touch-target border border-accent bg-accent/10 px-8 text-xs uppercase tracking-[0.25em] text-accent"
            >
              Enter Archive411
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
