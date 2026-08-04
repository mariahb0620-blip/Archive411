"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { INTRO_SLIDES } from "@/app/data/mockCatalog";
import { useApp } from "@/app/context/AppContext";
import { EDITORIAL_EASE } from "@/app/lib/motion";

const COLLAGE_IMAGES = [
  "photo-1529625668260-d7f9d0855913",
  "photo-1509631179647-0177331693ae",
  "photo-1515886657613-9f3515b0c78f",
  "photo-1539008835657-9e8e96875921",
  "photo-1490481651871-ab68de25d43d",
  "photo-1469334031218-e382a71b716b",
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
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 opacity-30 md:grid-cols-6">
        {COLLAGE_IMAGES.map((id) => (
          <div key={id} className="relative overflow-hidden">
            <Image
              src={`https://images.unsplash.com/${id}?w=400&q=80&auto=format&fit=crop`}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
            />
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
