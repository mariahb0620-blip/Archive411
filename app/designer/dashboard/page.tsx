"use client";

import AppHeader from "@/app/components/AppHeader";
import RouteGuard from "@/app/components/RouteGuard";

const DASHBOARD_SECTIONS = [
  "Edit profile",
  "Connect website",
  "Sync products",
  "Sizing & inventory",
  "Editorial submissions",
  "Aggregated analytics",
  "Verification request",
];

function DashboardContent() {
  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Designer Dashboard</p>
        <h1 className="mt-4 font-display text-4xl text-ivory">Your label workspace</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Shell dashboard for approved designers. Analytics are aggregated — individual
          user data is never exposed.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {DASHBOARD_SECTIONS.map((section) => (
            <div key={section} className="border border-smoke/50 bg-charcoal p-6">
              <h2 className="font-display text-xl text-ivory">{section}</h2>
              <p className="mt-2 text-xs text-muted">Coming soon — structured for production API.</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Stat label="Pieces saved" value="—" />
          <Stat label="Website clicks" value="—" />
          <Stat label="Profile views" value="—" />
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-smoke/50 p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-ivory">{value}</p>
    </div>
  );
}

export default function DesignerDashboardPage() {
  return (
    <RouteGuard requireIntro requireAuth={false}>
      <DashboardContent />
    </RouteGuard>
  );
}
