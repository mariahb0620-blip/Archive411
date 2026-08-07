"use client";

import { motion } from "framer-motion";
import { EDITORIAL_EASE } from "@/app/lib/motion";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export default function StepIndicator({
  totalSteps,
  currentStep,
}: StepIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <>
      {/* Mobile: full-width progress bar */}
      <div
        className="md:hidden"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-smoke/60">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
          />
        </div>
      </div>

      {/* Desktop: dot indicators */}
      <div
        className="hidden items-center justify-center gap-3 md:flex"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-colors ${
              index <= currentStep ? "bg-accent" : "bg-smoke"
            }`}
            initial={{ width: 16 }}
            animate={{
              width: index === currentStep ? 32 : 16,
              opacity: index <= currentStep ? 1 : 0.4,
            }}
            transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
          />
        ))}
      </div>
    </>
  );
}
