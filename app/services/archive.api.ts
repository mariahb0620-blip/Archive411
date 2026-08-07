"use client";

import type { BuildLookAnswers, GenerationMethod, Look, Lookbook } from "@/app/types/domain";

export async function fetchBuildRecommendation(
  answers: BuildLookAnswers
): Promise<{
  lookbook: Lookbook;
  looks: Look[];
  products: import("@/app/types/domain").Product[];
  empty: boolean;
  message?: string;
}> {
  const res = await fetch("/api/recommendations/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) {
    throw new Error("Failed to generate lookbook");
  }
  return res.json();
}

export async function fetchUserLookbooks(): Promise<Lookbook[]> {
  const res = await fetch("/api/lookbooks");
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to load archive");
  const data = await res.json();
  return data.lookbooks ?? [];
}

export async function saveLookbookToApi(params: {
  lookbook: Lookbook;
  looks: Look[];
  method: GenerationMethod;
  buildPreferences?: BuildLookAnswers;
}): Promise<void> {
  const res = await fetch("/api/lookbooks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to save lookbook");
  }
}

export async function fetchLookbookById(id: string): Promise<{
  lookbook: Lookbook;
  looks: Look[];
  products: import("@/app/types/domain").Product[];
} | null> {
  const res = await fetch(`/api/lookbooks/${id}`);
  if (res.status === 404) return null;
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load lookbook");
  return res.json();
}

export async function replaceProduct(params: {
  category: string;
  excludeIds: string[];
  answers?: BuildLookAnswers;
}): Promise<import("@/app/types/domain").Product | null> {
  const res = await fetch("/api/products/replace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product ?? null;
}

export async function fetchSearchRecommendation(
  filters: import("@/app/types/domain").SearchFilters
): Promise<{
  lookbook: Lookbook;
  looks: Look[];
  products: import("@/app/types/domain").Product[];
  empty: boolean;
  message?: string;
}> {
  const res = await fetch("/api/recommendations/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) throw new Error("Failed to generate search lookbook");
  return res.json();
}
