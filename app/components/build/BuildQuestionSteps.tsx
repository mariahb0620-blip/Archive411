"use client";

import { useMemo, useState } from "react";
import {
  STYLE_DIRECTION_OPTIONS,
  CONTEXT_STEPS,
  COVERAGE_MAP,
  KAWAII_MAP,
  SIZING_SYSTEM_OPTIONS,
  SPECIAL_SIZING_OPTIONS,
  SIZE_CATEGORY_FIELDS,
  getSizeOptionsForCategory,
  type BuildStepId,
  type SizeCategoryKey,
} from "@/app/data/buildQuestionnaire";
import { DEFAULT_PRICE_RANGE, PRICE_TIER_LABELS } from "@/app/data/mockCatalog";
import { STYLE_COMMUNITIES } from "@/app/data/styleCommunities";
import { STYLE_INSPIRATION_OPTIONS } from "@/app/data/styleInspiration";
import type { BuildLookAnswers } from "@/app/types/domain";

function SelectChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm transition-colors active:scale-[0.98] ${
        selected
          ? "border-accent bg-accent/10 text-accent"
          : "border-smoke/50 text-ivory hover:border-smoke"
      }`}
    >
      {label}
    </button>
  );
}

/** Full-width selectable cards — do not use touch-target (breaks multi-line layout). */
const OPTION_CARD_BASE =
  "w-full rounded-xl border p-5 text-left transition-colors min-h-[4.5rem] active:scale-[0.99]";

const OPTION_CARD_SELECTED = "border-accent bg-accent/5";
const OPTION_CARD_DEFAULT = "border-smoke/50 hover:border-smoke";

export function StyleDirectionStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = answers.styleDirections ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STYLE_DIRECTION_OPTIONS;
    return STYLE_DIRECTION_OPTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.category.includes(q as "aesthetic" | "occasion")
    );
  }, [query]);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange({ styleDirections: next });
  };

  const addCustomFromSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const match = STYLE_DIRECTION_OPTIONS.find(
      (s) => s.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      if (!selected.includes(match.id)) {
        onChange({ styleDirections: [...selected, match.id] });
      }
    } else {
      onChange({ customStyleDescription: trimmed });
    }
    setQuery("");
  };

  return (
    <div className="w-full max-w-3xl text-left">
      <p className="text-center text-sm text-muted">
        Choose one or more — aesthetics and occasions can combine freely.
      </p>
      <div className="mt-8">
        <label className="sr-only" htmlFor="style-search">
          Search aesthetics
        </label>
        <div className="flex gap-2">
          <input
            id="style-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomFromSearch()}
            placeholder="Search or type your own aesthetic…"
            className="flex-1 border border-smoke/60 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-smoke"
          />
          <button
            type="button"
            onClick={addCustomFromSearch}
            className="border border-smoke/60 px-4 py-3 text-xs uppercase tracking-[0.15em] text-ivory hover:border-accent hover:text-accent"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((style) => (
          <SelectChip
            key={style.id}
            label={style.label}
            selected={selected.includes(style.id)}
            onClick={() => toggle(style.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Custom style description
        </label>
        <textarea
          value={answers.customStyleDescription ?? ""}
          onChange={(e) => onChange({ customStyleDescription: e.target.value })}
          rows={3}
          placeholder="Describe a combination not listed — e.g. Y2K and feminine, quiet luxury and masculine…"
          className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-smoke"
        />
      </div>

      {(selected.length > 0 || answers.customStyleDescription) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {selected.map((id) => {
            const label =
              STYLE_DIRECTION_OPTIONS.find((s) => s.id === id)?.label ?? id;
            return (
              <span
                key={id}
                className="border border-accent/40 bg-accent/5 px-3 py-1 text-xs text-accent"
              >
                {label}
              </span>
            );
          })}
          {answers.customStyleDescription && (
            <span className="border border-smoke/40 px-3 py-1 text-xs text-ivory">
              {answers.customStyleDescription}
            </span>
          )}
        </div>
      )}

      <details className="mt-10 border border-smoke/40 p-4">
        <summary className="cursor-pointer text-sm text-muted">
          Fashion communities & creative influences (optional)
        </summary>
        <p className="mt-3 text-xs text-muted">
          Never assigned based on how you look — skip if you prefer.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {STYLE_COMMUNITIES.map((c) => {
            const commSelected = (answers.fashionCommunities ?? []).includes(c.id);
            return (
              <SelectChip
                key={c.id}
                label={c.publicName}
                selected={commSelected}
                onClick={() => {
                  const current = answers.fashionCommunities ?? [];
                  onChange({
                    fashionCommunities: commSelected
                      ? current.filter((x) => x !== c.id)
                      : [...current, c.id],
                  });
                }}
              />
            );
          })}
        </div>
      </details>
    </div>
  );
}

export function PresentationStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const options = [
    "Feminine",
    "Masculine",
    "Androgynous",
    "Gender-neutral",
    "A mix",
    "No preference",
  ] as const;
  const selected = answers.clothingPresentation ?? [];

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange({ clothingPresentation: next });
  };

  return (
    <div className="w-full max-w-2xl text-left">
      <p className="text-center text-sm text-muted">
        A style preference — separate from gender identity. Guides silhouette,
        styling, and search terms without limiting retailer departments.
      </p>
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <SelectChip
            key={opt}
            label={opt}
            selected={selected.includes(opt)}
            onClick={() => toggle(opt)}
          />
        ))}
      </div>
    </div>
  );
}

export function ClothingSizesStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const sizes = answers.clothingSizes ?? {};
  const skipped = new Set(sizes.skippedCategories ?? []);
  const system = sizes.sizingSystem ?? "letter";
  const isCustom = system === "custom";

  const updateSizes = (patch: Partial<NonNullable<BuildLookAnswers["clothingSizes"]>>) => {
    onChange({ clothingSizes: { ...sizes, ...patch } });
  };

  const setSizingSystem = (id: string) => {
    const cleared: Partial<NonNullable<BuildLookAnswers["clothingSizes"]>> = {
      sizingSystem: id as NonNullable<BuildLookAnswers["clothingSizes"]>["sizingSystem"],
      tops: undefined,
      bottoms: undefined,
      dresses: undefined,
      outerwear: undefined,
      bras: undefined,
    };
    updateSizes(cleared);
  };

  const toggleSkip = (key: SizeCategoryKey) => {
    const next = new Set(skipped);
    if (next.has(key)) next.delete(key);
    else {
      next.add(key);
      updateSizes({ [key]: undefined, skippedCategories: Array.from(next) });
      return;
    }
    updateSizes({ skippedCategories: Array.from(next) });
  };

  const toggleSpecial = (opt: string) => {
    const current = sizes.specialSizing ?? [];
    const next = current.includes(opt)
      ? current.filter((s) => s !== opt)
      : [...current, opt];
    updateSizes({ specialSizing: next });
  };

  return (
    <div className="w-full max-w-xl text-left">
      <p className="text-center text-sm leading-relaxed text-muted">
        Pick a sizing system, then tap your size for each category — no typing
        required. Brands still vary; we&apos;ll prioritize likely matches.
      </p>

      <fieldset className="mt-8">
        <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Sizing system
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZING_SYSTEM_OPTIONS.map((sys) => (
            <SelectChip
              key={sys.id}
              label={sys.label}
              selected={system === sys.id}
              onClick={() => setSizingSystem(sys.id)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 space-y-8">
        {SIZE_CATEGORY_FIELDS.map(({ key, label }) => {
          const isSkipped = skipped.has(key);
          const selected = (sizes[key] as string | undefined) ?? "";
          const options = getSizeOptionsForCategory(system, key);

          return (
            <fieldset key={key} className={isSkipped ? "opacity-40" : undefined}>
              <div className="flex items-center justify-between gap-3">
                <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  {label}
                  {selected && !isSkipped ? (
                    <span className="ml-2 tracking-normal text-accent">· {selected}</span>
                  ) : null}
                </legend>
                <button
                  type="button"
                  onClick={() => toggleSkip(key)}
                  className="shrink-0 border border-smoke/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-muted hover:text-ivory"
                >
                  {isSkipped ? "Include" : "Skip"}
                </button>
              </div>

              {!isSkipped && (
                isCustom ? (
                  <input
                    type="text"
                    value={selected}
                    onChange={(e) => updateSizes({ [key]: e.target.value })}
                    placeholder="e.g. chest 36 in / waist 28 in"
                    className="mt-3 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-smoke"
                  />
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <SelectChip
                        key={opt}
                        label={opt}
                        selected={selected === opt}
                        onClick={() =>
                          updateSizes({
                            [key]: selected === opt ? undefined : opt,
                          })
                        }
                      />
                    ))}
                  </div>
                )
              )}
            </fieldset>
          );
        })}
      </div>

      <fieldset className="mt-8">
        <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Additional sizing needs
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPECIAL_SIZING_OPTIONS.map((opt) => (
            <SelectChip
              key={opt}
              label={opt}
              selected={(sizes.specialSizing ?? []).includes(opt)}
              onClick={() => toggleSpecial(opt)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function FootwearInclusionStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const options = [
    { id: "yes", label: "Yes, include shoes", desc: "Shoes are part of each look." },
    { id: "no", label: "No, clothing only", desc: "Focus on garments without footwear." },
    {
      id: "optional",
      label: "Show shoes as optional additions",
      desc: "Footwear suggestions you can add or skip.",
    },
    { id: "surprise", label: "Surprise me", desc: "Archive411 decides whether to include shoes." },
  ] as const;

  const current = answers.footwear?.inclusion;

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl text-left">
      <div className="flex flex-col gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() =>
              onChange({ footwear: { ...answers.footwear, inclusion: opt.id } })
            }
            className={`${OPTION_CARD_BASE} ${
              current === opt.id ? OPTION_CARD_SELECTED : OPTION_CARD_DEFAULT
            }`}
          >
            <span className="block text-sm font-medium text-ivory">{opt.label}</span>
            <span className="mt-2 block text-xs leading-relaxed text-muted">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FootwearDetailsStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const footwear = answers.footwear ?? {};
  const types = footwear.types ?? [];
  const fitPrefs = footwear.fitPreferences ?? [];
  const showHeelHeight = types.includes("Heel");

  const shoeTypes = [
    "Heel", "Sneaker", "Wedge", "Flat", "Mule", "Boot", "Sandal",
    "Loafer", "Oxford", "Platform", "Clog", "Slipper", "Ballet flat",
    "Pump", "Kitten heel", "Ankle boot", "Knee-high boot", "Any",
  ];

  const updateFootwear = (patch: Partial<NonNullable<BuildLookAnswers["footwear"]>>) => {
    onChange({ footwear: { ...footwear, ...patch } });
  };

  const toggleType = (t: string) => {
    const next = types.includes(t) ? types.filter((x) => x !== t) : [...types, t];
    updateFootwear({ types: next });
  };

  const toggleFit = (f: string) => {
    const next = fitPrefs.includes(f)
      ? fitPrefs.filter((x) => x !== f)
      : [...fitPrefs, f];
    updateFootwear({ fitPreferences: next });
  };

  const sizeSystems = [
    { id: "us-womens", label: "US women's" },
    { id: "us-mens", label: "US men's" },
    { id: "uk", label: "UK" },
    { id: "eu", label: "EU" },
    { id: "custom", label: "Custom measurement" },
  ] as const;

  return (
    <div className="w-full max-w-2xl text-left">
      <fieldset>
        <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Shoe types
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {shoeTypes.map((t) => (
            <SelectChip
              key={t}
              label={t}
              selected={types.includes(t)}
              onClick={() => toggleType(t)}
            />
          ))}
        </div>
      </fieldset>

      {showHeelHeight && (
        <fieldset className="mt-8">
          <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Preferred heel height
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Flat or nearly flat",
              "Low heel",
              "Mid heel",
              "High heel",
              "Any height",
            ].map((h) => (
              <SelectChip
                key={h}
                label={h}
                selected={footwear.heelHeight === h}
                onClick={() => updateFootwear({ heelHeight: h })}
              />
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-8">
        <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Fit & comfort
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Wide fit", "Narrow fit", "Standard fit", "Extended shoe sizing",
            "Comfort priority", "Walking-friendly", "Accessibility needs",
            "Weather resistance", "No preference",
          ].map((f) => (
            <SelectChip
              key={f}
              label={f}
              selected={fitPrefs.includes(f)}
              onClick={() => toggleFit(f)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Shoe size
        </legend>
        <p className="mt-1 text-xs text-muted">
          Select your sizing system — not inferred from clothing presentation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizeSystems.map((sys) => (
            <SelectChip
              key={sys.id}
              label={sys.label}
              selected={footwear.shoeSizeSystem === sys.id}
              onClick={() => updateFootwear({ shoeSizeSystem: sys.id })}
            />
          ))}
        </div>
        <input
          type="text"
          value={footwear.shoeSize ?? ""}
          onChange={(e) => updateFootwear({ shoeSize: e.target.value })}
          placeholder="Enter shoe size"
          className="mt-4 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-sm text-ivory"
        />
      </fieldset>
    </div>
  );
}

export function FashionCommunityStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const selected = answers.fashionCommunities ?? [];

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange({ fashionCommunities: next });
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl text-left">
      <p className="mb-8 text-center text-sm text-muted">
        Optional — explore fashion communities and creative influences. Never assigned
        based on how you look. Skip if you prefer.
      </p>
      <div className="flex flex-col gap-4">
        {STYLE_COMMUNITIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={`${OPTION_CARD_BASE} ${
              selected.includes(c.id) ? OPTION_CARD_SELECTED : OPTION_CARD_DEFAULT
            }`}
          >
            <span className="block text-sm font-medium text-ivory">{c.publicName}</span>
            <span className="mt-2 block text-xs leading-relaxed text-muted">{c.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContextBriefStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const dressingOpts = CONTEXT_STEPS.find((s) => s.id === "dressingFor")!.options;
  const locationOpts = CONTEXT_STEPS.find((s) => s.id === "location")!.options;
  const climateOpts = CONTEXT_STEPS.find((s) => s.id === "climate")!.options;
  const independentOpts = CONTEXT_STEPS.find((s) => s.id === "independentDesigners")!.options;
  const coverageOpts = CONTEXT_STEPS.find((s) => s.id === "coverageLevel")!.options;
  const kawaiiOpts = CONTEXT_STEPS.find((s) => s.id === "kawaiiIntensity")!.options;

  const styles = answers.styleDirections ?? [];
  const showCoverage =
    styles.includes("hot-girl-y2k") ||
    (answers.fashionCommunities ?? []).includes("hot-girl-y2k");
  const showKawaii =
    styles.includes("kawaii") || (answers.fashionCommunities ?? []).includes("kawaii");

  const range = answers.priceRange ?? DEFAULT_PRICE_RANGE;
  const experimental = answers.experimentalLevel ?? 50;

  const sectionLabel = "text-[10px] uppercase tracking-[0.2em] text-muted";

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl space-y-8 text-left">
      <p className="text-center text-sm text-muted">
        Occasion, location, budget, and sourcing — one step instead of many.
      </p>

      <fieldset>
        <legend className={sectionLabel}>What are you dressing for?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {dressingOpts.map((opt) => (
            <SelectChip
              key={opt}
              label={opt}
              selected={answers.dressingFor === opt}
              onClick={() => onChange({ dressingFor: opt })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionLabel}>Where will you wear this?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {locationOpts.map((opt) => (
            <SelectChip
              key={opt}
              label={opt}
              selected={answers.location === opt}
              onClick={() => onChange({ location: opt })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionLabel}>Weather or season</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {climateOpts.map((opt) => (
            <SelectChip
              key={opt}
              label={opt}
              selected={answers.climate === opt}
              onClick={() => onChange({ climate: opt })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionLabel}>Price range</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(PRICE_TIER_LABELS).map(([tier, label]) => (
            <SelectChip
              key={tier}
              label={label}
              selected={range.tier === tier}
              onClick={() =>
                onChange({ priceRange: { ...range, tier: tier as typeof range.tier } })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionLabel}>Prioritize independent designers?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {independentOpts.map((opt) => {
            const selected =
              opt === "Yes"
                ? answers.independentDesigners === true
                : opt === "No"
                  ? answers.independentDesigners === false
                  : answers.independentDesigners === "No preference";
            return (
              <SelectChip
                key={opt}
                label={opt}
                selected={selected}
                onClick={() =>
                  onChange({
                    independentDesigners:
                      opt === "Yes" ? true : opt === "No" ? false : "No preference",
                  })
                }
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionLabel}>How experimental?</legend>
        <input
          type="range"
          min={0}
          max={100}
          value={experimental}
          onChange={(e) => onChange({ experimentalLevel: Number(e.target.value) })}
          className="mt-3 w-full accent-accent"
          aria-label="Experimental level"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Wearable</span>
          <span>Experimental</span>
        </div>
      </fieldset>

      {showCoverage && (
        <fieldset>
          <legend className={sectionLabel}>Coverage level (optional)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {coverageOpts.map((opt) => (
              <SelectChip
                key={opt}
                label={opt}
                selected={answers.coverageLevel === COVERAGE_MAP[opt]}
                onClick={() =>
                  onChange({
                    coverageLevel: COVERAGE_MAP[opt] as BuildLookAnswers["coverageLevel"],
                  })
                }
              />
            ))}
          </div>
        </fieldset>
      )}

      {showKawaii && (
        <fieldset>
          <legend className={sectionLabel}>Kawaii intensity (optional)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {kawaiiOpts.map((opt) => (
              <SelectChip
                key={opt}
                label={opt}
                selected={answers.kawaiiIntensity === KAWAII_MAP[opt]}
                onClick={() =>
                  onChange({
                    kawaiiIntensity: KAWAII_MAP[opt] as BuildLookAnswers["kawaiiIntensity"],
                  })
                }
              />
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

export function StyleInspirationStep({
  answers,
  onChange,
}: {
  answers: BuildLookAnswers;
  onChange: (patch: Partial<BuildLookAnswers>) => void;
}) {
  const selected = answers.styleInspirations ?? [];

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange({ styleInspirations: next });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Optional — pick style directions that resonate. Never inferred from how you look.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {STYLE_INSPIRATION_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`rounded-xl border p-4 text-left transition-colors active:scale-[0.98] ${
              selected.includes(opt.id)
                ? "border-accent bg-accent/10"
                : "border-smoke/50 hover:border-smoke"
            }`}
          >
            <span className="text-sm font-medium text-ivory">{opt.label}</span>
            <p className="mt-1 text-xs text-muted">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export const STEP_PROMPTS: Record<BuildStepId, string> = {
  styleDirections: "What styles should shape this look?",
  styleInspiration: "Any inspiration directions? (optional)",
  clothingPresentation: "How would you like the clothing to be presented?",
  clothingSizes: "What sizes should we search for?",
  contextBrief: "Set the scene for your lookbook",
  footwearInclusion: "Would you like shoes included in this lookbook?",
};
