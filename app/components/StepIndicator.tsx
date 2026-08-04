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
  return (
    <div
      className="flex items-center justify-center gap-3"
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
  );
}
