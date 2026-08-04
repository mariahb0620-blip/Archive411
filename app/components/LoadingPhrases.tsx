"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EDITORIAL_EASE, LOADING_PHRASES } from "@/app/lib/motion";

interface LoadingPhrasesProps {
  phrases?: string[];
  intervalMs?: number;
  onComplete?: () => void;
  durationMs?: number;
}

export default function LoadingPhrases({
  phrases = LOADING_PHRASES,
  intervalMs = 1200,
  onComplete,
  durationMs = 4800,
}: LoadingPhrasesProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, intervalMs);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, durationMs);

    return () => {
      clearInterval(phraseTimer);
      clearTimeout(completeTimer);
    };
  }, [phrases.length, intervalMs, durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink">
      <div className="container-editorial text-center">
        <motion.p
          className="mb-6 font-display text-sm uppercase tracking-[0.4em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
        >
          ARCHIVE411
        </motion.p>

        <div className="relative h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={phrases[index]}
              className="font-display text-2xl text-ivory md:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            >
              {phrases[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          className="mx-auto mt-12 h-px w-24 bg-accent/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}
