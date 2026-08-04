"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import StepIndicator from "@/app/components/StepIndicator";
import RouteGuard from "@/app/components/RouteGuard";
import {
  ClothingSizesStep,
  ContextBriefStep,
  FootwearInclusionStep,
  PresentationStep,
  STEP_PROMPTS,
  StyleDirectionStep,
} from "@/app/components/build/BuildQuestionSteps";
import { getBuildSteps, type BuildStepId } from "@/app/data/buildQuestionnaire";
import {
  generateLookbookFromBuild,
  storeLookbookSession,
} from "@/app/services/lookbook.service";
import type { BuildLookAnswers } from "@/app/types/domain";
import { EDITORIAL_EASE } from "@/app/lib/motion";

function normalizeBuildAnswers(answers: BuildLookAnswers): BuildLookAnswers {
  const next = { ...answers };
  const inclusion = next.footwear?.inclusion;
  if (inclusion && inclusion !== "no") {
    next.footwear = {
      ...next.footwear,
      types: next.footwear?.types?.length ? next.footwear.types : ["Any"],
    };
  }
  return next;
}

function BuildContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<BuildLookAnswers>({});

  const steps = useMemo(() => getBuildSteps(answers), [answers]);
  const stepId = steps[stepIndex];
  const total = steps.length;
  const prompt = STEP_PROMPTS[stepId];

  useEffect(() => {
    const target = searchParams.get("step") as BuildStepId | null;
    if (target) {
      const idx = steps.indexOf(target);
      if (idx >= 0) setStepIndex(idx);
    }
  }, [searchParams, steps]);

  const patchAnswers = useCallback((patch: Partial<BuildLookAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const finish = () => {
    const normalized = normalizeBuildAnswers(answers);
    const { lookbook, looks } = generateLookbookFromBuild(normalized);
    storeLookbookSession(lookbook, looks, "build", normalized);
    router.push(`/lookbooks/${lookbook.id}`);
  };

  const renderStep = () => {
    switch (stepId) {
      case "styleDirections":
        return <StyleDirectionStep answers={answers} onChange={patchAnswers} />;
      case "clothingPresentation":
        return <PresentationStep answers={answers} onChange={patchAnswers} />;
      case "clothingSizes":
        return <ClothingSizesStep answers={answers} onChange={patchAnswers} />;
      case "contextBrief":
        return <ContextBriefStep answers={answers} onChange={patchAnswers} />;
      case "footwearInclusion":
        return <FootwearInclusionStep answers={answers} onChange={patchAnswers} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-editorial flex min-h-screen flex-col pt-24 pb-16 md:pt-28"
      >
        <StepIndicator totalSteps={total} currentStep={stepIndex} />
        <div className="flex flex-1 flex-col items-center justify-center py-8 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepId}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
              className="w-full max-w-3xl text-center"
            >
              <h1 className="font-display text-2xl text-ivory md:text-4xl">{prompt}</h1>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          {stepIndex > 0 && (
            <EditorialButton variant="ghost" onClick={() => setStepIndex((s) => s - 1)}>
              Back
            </EditorialButton>
          )}
          {stepIndex < total - 1 ? (
            <EditorialButton onClick={() => setStepIndex((s) => s + 1)}>
              Continue
            </EditorialButton>
          ) : (
            <EditorialButton onClick={finish}>Generate lookbook</EditorialButton>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BuildPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <BuildContent />
    </RouteGuard>
  );
}
