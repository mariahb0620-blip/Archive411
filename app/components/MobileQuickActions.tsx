"use client";

import Link from "next/link";

const ACTIONS: Array<{
  href: string;
  label: string;
  desc: string;
  accent?: boolean;
}> = [
  { href: "/build", label: "Build", desc: "My Look", accent: true },
  { href: "/search", label: "Search", desc: "Global archive" },
  { href: "/archive", label: "Archive", desc: "Saved looks" },
  { href: "/designers", label: "Designers", desc: "Independent" },
];

export default function MobileQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 md:hidden">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`mobile-card flex min-h-[5.5rem] flex-col justify-between p-4 active:scale-[0.98] ${
            action.accent ? "border-accent/40 bg-accent/5" : ""
          }`}
        >
          <span className="font-display text-lg text-ivory">{action.label}</span>
          <span className="text-xs text-muted">{action.desc}</span>
        </Link>
      ))}
    </div>
  );
}
