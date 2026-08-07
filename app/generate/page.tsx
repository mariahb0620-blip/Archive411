"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";

function GenerateContent() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/build"), 8000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="max-w-lg space-y-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Coming soon</p>
        <h1 className="font-display text-3xl text-ivory">Quick Generate</h1>
        <p className="text-sm text-muted">
          The editorial registry matrix is being rebuilt on the verified catalog. Use Build My Look
          for full lookbooks today.
        </p>
        <EditorialButton href="/build">Build My Look</EditorialButton>
        <EditorialButton variant="ghost" href="/home">
          Back to Home
        </EditorialButton>
      </AppPageMain>
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
