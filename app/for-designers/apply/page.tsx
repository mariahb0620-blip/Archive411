"use client";

import { useState } from "react";
import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import type { DesignerApplication } from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import { DEFAULT_PRICE_RANGE } from "@/app/data/mockCatalog";

function ApplyContent() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    designerName: "",
    labelName: "",
    contactEmail: "",
    city: "",
    country: "",
    website: "",
    instagram: "",
    biography: "",
    designPhilosophy: "",
    productCategories: "",
    aestheticKeywords: "",
    sizeRange: "",
    customSizing: false,
    madeToOrder: false,
    shippingRegions: "",
    connectionType: "manual",
    productCount: "",
    imagePermissionAgreed: false,
    editorialFeatureInterest: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      designerName: form.designerName,
      labelName: form.labelName,
      contactEmail: form.contactEmail,
      city: form.city,
      country: form.country,
      website: form.website,
      instagram: form.instagram,
      biography: form.biography,
      designPhilosophy: form.designPhilosophy,
      productCategories: form.productCategories.split(",").map((s) => s.trim()),
      aestheticKeywords: form.aestheticKeywords.split(",").map((s) => s.trim()),
      priceRange: DEFAULT_PRICE_RANGE,
      sizeRange: form.sizeRange,
      customSizing: form.customSizing,
      madeToOrder: form.madeToOrder,
      shippingRegions: form.shippingRegions.split(",").map((s) => s.trim()),
      connectionType: form.connectionType,
    };

    try {
      await fetch("/api/designer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // fall through to localStorage backup
    }

    const application: DesignerApplication = {
      id: `app-${Date.now()}`,
      ...payload,
      connectionType: form.connectionType as DesignerApplication["connectionType"],
      productCount: form.productCount ? Number(form.productCount) : undefined,
      imagePermissionAgreed: form.imagePermissionAgreed,
      editorialFeatureInterest: form.editorialFeatureInterest,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.designerApplications) ?? "[]"
    ) as DesignerApplication[];
    localStorage.setItem(
      STORAGE_KEYS.designerApplications,
      JSON.stringify([application, ...existing])
    );
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ink">
        <AppHeader />
        <main className="container-editorial flex min-h-screen flex-col items-center justify-center pt-24 text-center">
          <h1 className="font-display text-4xl text-ivory">Application received</h1>
          <p className="mt-4 max-w-md text-sm text-muted">
            Thank you. The Archive411 team may review your submission for quality,
            authenticity and image permissions.
          </p>
          <div className="mt-8">
            <EditorialButton href="/for-designers">Back to For Designers</EditorialButton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial max-w-2xl pt-24 pb-16 md:pt-28">
        <h1 className="font-display text-4xl text-ivory">Designer application</h1>
        <form onSubmit={submit} className="mt-10 space-y-6">
          {[
            ["designerName", "Designer name"],
            ["labelName", "Label name"],
            ["contactEmail", "Contact email"],
            ["city", "City"],
            ["country", "Country"],
            ["website", "Website"],
            ["instagram", "Instagram"],
            ["sizeRange", "Size range"],
            ["productCategories", "Product categories (comma-separated)"],
            ["aestheticKeywords", "Aesthetic keywords (comma-separated)"],
            ["shippingRegions", "Shipping regions (comma-separated)"],
            ["productCount", "Number of current products"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
              <input
                required={key === "contactEmail" || key === "labelName"}
                type={key === "contactEmail" ? "email" : "text"}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Brand biography</span>
            <textarea
              required
              rows={4}
              value={form.biography}
              onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value }))}
              className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Design philosophy</span>
            <textarea
              rows={3}
              value={form.designPhilosophy}
              onChange={(e) => setForm((f) => ({ ...f, designPhilosophy: e.target.value }))}
              className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-muted">
            <input type="checkbox" checked={form.imagePermissionAgreed} onChange={(e) => setForm((f) => ({ ...f, imagePermissionAgreed: e.target.checked }))} className="accent-accent" required />
            I agree Archive411 may display approved product images, descriptions, prices and links.
          </label>

          <EditorialButton type="submit">Submit application</EditorialButton>
        </form>
      </main>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <RouteGuard requireIntro requireAuth={false}>
      <ApplyContent />
    </RouteGuard>
  );
}
