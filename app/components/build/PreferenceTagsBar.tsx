"use client";

import Link from "next/link";
import {
  STYLE_DIRECTION_OPTIONS,
  blendStyleLabel,
} from "@/app/data/buildQuestionnaire";
import type { BuildLookAnswers } from "@/app/types/domain";

export interface PreferenceTag {
  id: string;
  label: string;
  editStep?: string;
}

export function buildPreferenceTags(answers: BuildLookAnswers): PreferenceTag[] {
  const tags: PreferenceTag[] = [];

  (answers.styleDirections ?? []).forEach((id) => {
    const found = STYLE_DIRECTION_OPTIONS.find((s) => s.id === id);
    tags.push({
      id: `style-${id}`,
      label: found?.label ?? id,
      editStep: "styleDirections",
    });
  });

  if (answers.customStyleDescription?.trim()) {
    tags.push({
      id: "style-custom",
      label: answers.customStyleDescription.trim(),
      editStep: "styleDirections",
    });
  }

  (answers.clothingPresentation ?? []).forEach((p) => {
    tags.push({ id: `presentation-${p}`, label: p, editStep: "clothingPresentation" });
  });

  const cs = answers.clothingSizes;
  if (cs) {
    (["tops", "bottoms", "dresses", "outerwear", "bras"] as const).forEach((key) => {
      const val = cs[key];
      if (val && !(cs.skippedCategories ?? []).includes(key)) {
        tags.push({
          id: `size-${key}`,
          label: `${key}: ${val}${cs.sizingSystem ? ` (${cs.sizingSystem})` : ""}`,
          editStep: "clothingSizes",
        });
      }
    });
    (cs.specialSizing ?? []).forEach((sp) => {
      tags.push({ id: `special-${sp}`, label: sp, editStep: "clothingSizes" });
    });
  }

  if (answers.footwear?.inclusion) {
    const labels: Record<string, string> = {
      yes: "Shoes included",
      no: "Clothing only",
      optional: "Optional shoes",
      surprise: "Surprise footwear",
    };
    tags.push({
      id: "footwear-inclusion",
      label: labels[answers.footwear.inclusion] ?? answers.footwear.inclusion,
      editStep: "footwearInclusion",
    });
  }

  (answers.footwear?.types ?? [])
    .filter((t) => t !== "Any")
    .forEach((t) => {
      tags.push({ id: `shoe-${t}`, label: t, editStep: "footwearInclusion" });
    });

  if (answers.footwear?.heelHeight) {
    tags.push({
      id: "heel-height",
      label: answers.footwear.heelHeight,
      editStep: "footwearInclusion",
    });
  }

  if (answers.footwear?.shoeSize) {
    tags.push({
      id: "shoe-size",
      label: `Shoe ${answers.footwear.shoeSize}${answers.footwear.shoeSizeSystem ? ` (${answers.footwear.shoeSizeSystem})` : ""}`,
      editStep: "clothingSizes",
    });
  }

  if (answers.dressingFor) {
    tags.push({ id: "occasion", label: answers.dressingFor, editStep: "contextBrief" });
  }
  if (answers.location) {
    tags.push({ id: "location", label: answers.location, editStep: "contextBrief" });
  }
  if (answers.climate) {
    tags.push({ id: "climate", label: answers.climate, editStep: "contextBrief" });
  }
  (answers.colors ?? []).forEach((c) => {
    tags.push({ id: `color-${c}`, label: c, editStep: "contextBrief" });
  });

  if (answers.independentDesigners === true) {
    tags.push({ id: "independent", label: "Independent designers", editStep: "contextBrief" });
  }

  const blend = blendStyleLabel(answers.styleDirections ?? [], answers.customStyleDescription);
  if (blend !== "Editorial mix" && tags.filter((t) => t.id.startsWith("style-")).length > 1) {
    tags.unshift({ id: "blend", label: blend });
  }

  return tags;
}

export default function PreferenceTagsBar({
  answers,
  onRemove,
}: {
  answers: BuildLookAnswers;
  onRemove?: (tagId: string) => void;
}) {
  const tags = buildPreferenceTags(answers);

  if (tags.length === 0) return null;

  return (
    <div className="mb-8 border border-smoke/30 bg-charcoal/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
          Your preferences
        </p>
        <Link
          href="/build"
          className="text-[10px] uppercase tracking-[0.2em] text-accent hover:underline"
        >
          Edit in questionnaire
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="group inline-flex items-center gap-2 border border-smoke/50 bg-ink px-3 py-1.5 text-xs text-ivory"
          >
            {tag.label}
            {onRemove && tag.id !== "blend" && (
              <button
                type="button"
                onClick={() => onRemove(tag.id)}
                className="text-muted hover:text-accent"
                aria-label={`Remove ${tag.label}`}
              >
                ×
              </button>
            )}
            {tag.editStep && !onRemove && (
              <Link
                href={`/build?step=${tag.editStep}`}
                className="text-[10px] uppercase tracking-[0.1em] text-accent opacity-0 transition-opacity group-hover:opacity-100"
              >
                Edit
              </Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
