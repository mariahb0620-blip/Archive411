"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";

const DASHBOARD_SECTIONS = [
  { title: "Edit profile", status: "Coming soon" },
  { title: "Connect website", status: "Shopify / manual feed" },
  { title: "Sync products", status: "Coming soon" },
  { title: "Sizing & inventory", status: "Coming soon" },
  { title: "Editorial submissions", status: "Coming soon" },
  { title: "Aggregated analytics", status: "Coming soon" },
  { title: "Verification request", status: "Available via apply" },
];

function DashboardContent() {
  const [applications, setApplications] = useState<{ id: string; status: string; label_name: string }[]>([]);

  useEffect(() => {
    fetch("/api/designer-applications")
      .then((r) => (r.ok ? r.json() : { applications: [] }))
      .then((d) => setApplications(d.applications ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="space-y-8">
        <header>
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Designer Dashboard</p>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">Your label workspace</h1>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Shell dashboard for approved designers. Analytics are aggregated — individual user
            data is never exposed.
          </p>
        </header>

        {applications.length > 0 && (
          <section className="mobile-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Your applications</p>
            <ul className="mt-3 space-y-2">
              {applications.map((a) => (
                <li key={a.id} className="flex justify-between text-sm">
                  <span className="text-ivory">{a.label_name}</span>
                  <span className="text-muted">{a.status}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {DASHBOARD_SECTIONS.map((section) => (
            <div key={section.title} className="mobile-card p-5">
              <h2 className="font-display text-xl text-ivory">{section.title}</h2>
              <p className="mt-2 text-xs text-muted">{section.status}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Pieces saved" value="—" />
          <Stat label="Website clicks" value="—" />
          <Stat label="Profile views" value="—" />
        </div>

        <Link href="/for-designers/apply" className="text-sm text-accent hover:underline">
          Submit designer application →
        </Link>
      </AppPageMain>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-card p-5">
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
