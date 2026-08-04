"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import StepIndicator from "@/app/components/StepIndicator";
import RouteGuard from "@/app/components/RouteGuard";
import { EDITORIAL_EASE } from "@/app/lib/motion";
import { buildStylingPrompt } from "@/app/utils/promptBuilder";
import {
  BUDGET_OPTIONS,
  SESSION_PROMPT_KEY,
  SESSION_SETTINGS_KEY,
  type BudgetTier,
  type GenerationMode,
  type GenerationSettings,
} from "@/app/types/styling";

type GarmentCategory =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "footwear"
  | "accessories"
  | "full-outfit";

type QuizStep = "mode" | "categories" | "budget";

interface QuizState {
  mode: GenerationMode;
  categories: GarmentCategory[];
  budget: BudgetTier;
}

const GARMENT_CATEGORIES: {
  value: GarmentCategory;
  label: string;
  description: string;
}[] = [
  { value: "tops", label: "Tops", description: "Shirts, blouses, knits, and layers above the waist." },
  { value: "bottoms", label: "Bottoms", description: "Trousers, denim, skirts, and tailored foundations." },
  { value: "outerwear", label: "Outerwear", description: "Coats, blazers, jackets, and structural cover-ups." },
  { value: "footwear", label: "Footwear", description: "Boots, sneakers, heels, and statement soles." },
  { value: "accessories", label: "Accessories", description: "Bags, belts, jewelry, and finishing details." },
  { value: "full-outfit", label: "Full Outfit", description: "Complete head-to-toe looks, styled as one edit." },
];

const MODE_OPTIONS: {
  value: GenerationMode;
  title: string;
  description: string;
}[] = [
  {
    value: "random",
    title: "Random Generation",
    description: "Surprise me with an algorithmic style mix.",
  },
  {
    value: "curated",
    title: "Curated Control",
    description: "Specify my focus garment categories.",
  },
];

const LOADING_PHRASES = [
  "Analyzing architectural silhouettes...",
  "Filtering verified premium retailers...",
  "Balancing high-low sourcing ratios...",
  "Cross-referencing Macy's foundations...",
  "Elevating with luxury accent pieces...",
  "Curating twelve editorial looks...",
  "Finalizing your personal style registry...",
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EDITORIAL_EASE },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.4, ease: EDITORIAL_EASE },
  }),
};

const INITIAL_STATE: QuizState = {
  mode: "curated",
  categories: [],
  budget: "high-low-blend",
};

function buildResultsUrl(state: QuizState): string {
  const params = new URLSearchParams({
    mode: state.mode,
    budget: state.budget,
    from: "generate",
  });
  if (state.mode === "curated" && state.categories.length > 0) {
    params.set("categories", state.categories.join(","));
  }
  return `/results?${params.toString()}`;
}

function toGenerationSettings(state: QuizState): GenerationSettings {
  return {
    mode: state.mode,
    categories:
      state.mode === "curated" && state.categories.length > 0
        ? state.categories
        : ["full-outfit"],
    aesthetic: "quiet-luxury",
    colorPalette: "monochrome",
    bodyFocus: "balanced",
    budget: state.budget,
  };
}

function PremiumLoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 900);
    const completeTimer = setTimeout(onComplete, 4200);
    return () => {
      clearInterval(phraseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink">
      <div className="container-editorial max-w-2xl text-center">
        <motion.p
          className="mb-8 font-display text-xs uppercase tracking-[0.45em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          archive.411
        </motion.p>
        <div className="relative h-20 overflow-hidden md:h-24">
          <AnimatePresence mode="wait">
            <motion.p
              key={LOADING_PHRASES[index]}
              className="font-display text-2xl leading-snug text-ivory md:text-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
            >
              {LOADING_PHRASES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.div
          className="mx-auto mt-14 h-px origin-left bg-accent/50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 4.2, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function GenerateContent() {
  const router = useRouter();
  const [step, setStep] = useState<QuizStep>("mode");
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const steps = useMemo<QuizStep[]>(
    () => (state.mode === "curated" ? ["mode", "categories", "budget"] : ["mode", "budget"]),
    [state.mode]
  );

  const currentStepIndex = steps.indexOf(step);

  const goToStep = (next: QuizStep, dir: number) => {
    setDirection(dir);
    setStep(next);
  };

  const goNext = () => {
    if (step === "mode") {
      goToStep(state.mode === "curated" ? "categories" : "budget", 1);
      return;
    }
    if (step === "categories") goToStep("budget", 1);
  };

  const goBack = () => {
    if (step === "budget") {
      goToStep(state.mode === "curated" ? "categories" : "mode", -1);
      return;
    }
    if (step === "categories") goToStep("mode", -1);
  };

  const toggleCategory = (category: GarmentCategory) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const canProceed = (): boolean => {
    if (step === "mode") return true;
    if (step === "categories") return state.categories.length > 0;
    if (step === "budget") return Boolean(state.budget);
    return false;
  };

  const handleSubmit = () => {
    const settings = toGenerationSettings(state);
    sessionStorage.setItem(SESSION_SETTINGS_KEY, JSON.stringify(settings));
    sessionStorage.setItem(SESSION_PROMPT_KEY, buildStylingPrompt(settings));
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <PremiumLoadingScreen onComplete={() => router.push(buildResultsUrl(state))} />
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-editorial mobile-page-top flex min-h-screen flex-col pb-16 md:pt-28 md:pb-16"
      >
        <div className="mb-10 text-center md:mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">
            Personal Style Registry
          </p>
          <StepIndicator totalSteps={steps.length} currentStep={currentStepIndex} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            {step === "mode" && (
              <motion.div
                key="mode"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl text-center"
              >
                <h1 className="font-display text-4xl text-ivory md:text-5xl">Define Your Edit</h1>
                <p className="mx-auto mt-4 max-w-lg text-sm text-muted md:text-base">
                  Built for a contemporary wardrobe — sharp, intentional, and ready for right now.
                </p>
                <div className="mt-12 grid gap-4 md:grid-cols-2">
                  {MODE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          mode: option.value,
                          categories: option.value === "random" ? [] : prev.categories,
                        }))
                      }
                      className={`border p-8 text-left transition-colors ${
                        state.mode === option.value
                          ? "border-accent bg-accent/5"
                          : "border-smoke/60 hover:border-smoke"
                      }`}
                    >
                      <h2 className="font-display text-xl text-ivory md:text-2xl">{option.title}</h2>
                      <p className="mt-3 text-sm text-muted">{option.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "categories" && (
              <motion.div
                key="categories"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-4xl text-center"
              >
                <h1 className="font-display text-4xl text-ivory md:text-5xl">Focus Categories</h1>
                <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {GARMENT_CATEGORIES.map((category) => {
                    const selected = state.categories.includes(category.value);
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => toggleCategory(category.value)}
                        className={`border p-6 text-left transition-colors ${
                          selected
                            ? "border-accent bg-accent/5"
                            : "border-smoke/60 hover:border-smoke"
                        }`}
                      >
                        <h2 className="font-display text-lg text-ivory">{category.label}</h2>
                        <p className="mt-2 text-xs text-muted">{category.description}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === "budget" && (
              <motion.div
                key="budget"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-2xl text-center"
              >
                <h1 className="font-display text-4xl text-ivory md:text-5xl">Investment Tier</h1>
                <div className="mt-12 space-y-3">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setState((prev) => ({ ...prev, budget: option.value }))
                      }
                      className={`w-full border px-6 py-5 text-left transition-colors ${
                        state.budget === option.value
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-smoke/60 text-ivory hover:border-smoke"
                      }`}
                    >
                      <span className="text-sm uppercase tracking-[0.18em]">{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          {currentStepIndex > 0 && (
            <EditorialButton variant="ghost" onClick={goBack}>
              Back
            </EditorialButton>
          )}
          {step !== "budget" ? (
            <EditorialButton onClick={goNext} disabled={!canProceed()}>
              Continue
            </EditorialButton>
          ) : (
            <EditorialButton onClick={handleSubmit} disabled={!canProceed()}>
              Generate Edit
            </EditorialButton>
          )}
        </div>
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <GenerateContent />
    </RouteGuard>
  );
}
