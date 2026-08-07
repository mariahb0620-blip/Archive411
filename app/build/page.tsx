"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import StepIndicator from "@/app/components/StepIndicator";
import StickyActionBar from "@/app/components/StickyActionBar";
import RouteGuard from "@/app/components/RouteGuard";
import {
  StyleInspirationStep,
  ClothingSizesStep,
  ContextBriefStep,
  FootwearInclusionStep,
  PresentationStep,
  STEP_PROMPTS,
  StyleDirectionStep,
} from "@/app/components/build/BuildQuestionSteps";
import { getBuildSteps, type BuildStepId } from "@/app/data/buildQuestionnaire";
import { storeLookbookSession } from "@/app/services/lookbook.service";
import { fetchBuildRecommendation } from "@/app/services/archive.api";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const finish = async () => {
    setLoading(true);
    setError(null);
    const normalized = normalizeBuildAnswers(answers);
    try {
      const result = await fetchBuildRecommendation(normalized);
      storeLookbookSession(
        result.lookbook,
        result.looks,
        "build",
        normalized,
        result.products
      );
      router.push(`/lookbooks/${result.lookbook.id}`);
    } catch {
      setError("We could not generate your lookbook. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (stepId) {
      case "styleDirections":
        return <StyleDirectionStep answers={answers} onChange={patchAnswers} />;
      case "styleInspiration":
        return <StyleInspirationStep answers={answers} onChange={patchAnswers} />;
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
      <AppPageMain stickyFooter className="flex min-h-[calc(100dvh-3.75rem)] flex-col md:min-h-screen">
        <StepIndicator totalSteps={total} currentStep={stepIndex} />
        <p className="mt-2 text-center text-xs text-muted md:hidden">
          Step {stepIndex + 1} of {total}
        </p>

        <div className="flex flex-1 flex-col py-6 md:items-center md:justify-center md:py-12">
          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent"
              />
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted">
                Building your lookbook...
              </p>
              <p className="mt-3 max-w-xs text-sm text-muted">
                Matching verified catalog pieces to your preferences.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={stepId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                className="w-full max-w-3xl md:text-center"
              >
                <h1 className="font-display text-2xl leading-snug text-ivory md:text-4xl">
                  {prompt}
                </h1>
                <div className="mt-8">{renderStep()}</div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-accent" role="alert">
            {error}
          </p>
        )}
      </AppPageMain>

      {!loading && (
        <StickyActionBar>
          {stepIndex > 0 && (
            <EditorialButton
              variant="ghost"
              className="flex-1 md:flex-none"
              onClick={() => setStepIndex((s) => s - 1)}
            >
              Back
            </EditorialButton>
          )}
          {stepIndex < total - 1 ? (
            <EditorialButton
              className="flex-1 md:flex-none"
              onClick={() => setStepIndex((s) => s + 1)}
            >
              Continue
            </EditorialButton>
          ) : (
            <EditorialButton className="flex-1 md:flex-none" onClick={finish}>
              Generate lookbook
            </EditorialButton>
          )}
        </StickyActionBar>
      )}
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
