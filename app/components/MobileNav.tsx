"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  IconArchive,
  IconCreate,
  IconHome,
  IconProfile,
  IconSearch,
} from "@/app/components/MobileNavIcons";

const PRIMARY_TABS = [
  { href: "/home", label: "Home", short: "Home", Icon: IconHome },
  { href: "/search", label: "Search", short: "Search", Icon: IconSearch },
  { href: "/create", label: "Create", short: "Create", Icon: IconCreate },
  { href: "/archive", label: "Archive", short: "Archive", Icon: IconArchive },
  { href: "/profile", label: "Profile", short: "Profile", Icon: IconProfile },
] as const;

const CREATE_OPTIONS = [
  { href: "/build", label: "Build My Look", desc: "Questionnaire → curated lookbook", available: true },
  { href: "/generate", label: "Quick Generate", desc: "Coming soon — use Build My Look", available: false },
  { href: "/surprise", label: "Surprise Me", desc: "Random style from verified catalog", available: true },
] as const;

function tabActive(pathname: string, href: string, isCreateActive: boolean): boolean {
  if (href === "/create") return isCreateActive;
  if (href === "/archive") {
    return pathname === "/archive";
  }
  if (href === "/home") {
    return pathname === "/home" || pathname === "/independent" || pathname === "/designers";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNav() {
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(false);

  const isCreateActive =
    pathname === "/build" ||
    pathname === "/surprise" ||
    pathname === "/generate";

  return (
    <>
      <AnimatePresence>
        {createOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close create menu"
              className="fixed inset-0 z-[65] bg-ink/70 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateOpen(false)}
            />
            <motion.div
              role="menu"
              aria-label="Create options"
              className="fixed inset-x-3 z-[66] overflow-hidden rounded-2xl border border-smoke/60 bg-charcoal shadow-2xl md:hidden"
              style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <p className="border-b border-smoke/30 px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-muted">
                Create a look
              </p>
              {CREATE_OPTIONS.map((opt) =>
                opt.available ? (
                  <Link
                    key={opt.href}
                    href={opt.href}
                    role="menuitem"
                    onClick={() => setCreateOpen(false)}
                    className="flex min-h-[3.5rem] flex-col justify-center border-b border-smoke/20 px-4 py-3 last:border-0 active:bg-smoke/30"
                  >
                    <span className="text-sm font-medium text-ivory">{opt.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{opt.desc}</span>
                  </Link>
                ) : (
                  <div
                    key={opt.href}
                    role="menuitem"
                    aria-disabled="true"
                    className="flex min-h-[3.5rem] flex-col justify-center border-b border-smoke/20 px-4 py-3 opacity-50"
                  >
                    <span className="text-sm font-medium text-ivory">{opt.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{opt.desc}</span>
                  </div>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-smoke/50 bg-ink/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Primary app navigation"
      >
        <ul className="grid grid-cols-5 px-1 pt-1">
          {PRIMARY_TABS.map((tab) => {
            const isActive = tabActive(pathname, tab.href, isCreateActive);
            const { Icon } = tab;

            if (tab.href === "/create") {
              return (
                <li key={tab.href}>
                  <button
                    type="button"
                    onClick={() => setCreateOpen((v) => !v)}
                    className={`relative flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 transition-colors active:scale-95 ${
                      isActive || createOpen ? "text-accent" : "text-muted"
                    }`}
                    aria-label={tab.label}
                    aria-expanded={createOpen}
                    aria-haspopup="menu"
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                        isActive || createOpen
                          ? "border-accent/60 bg-accent/15"
                          : "border-smoke/50 bg-charcoal"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-medium tracking-wide">{tab.short}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`relative flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 transition-colors active:scale-95 ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium tracking-wide">{tab.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
