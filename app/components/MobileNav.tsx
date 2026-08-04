"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const PRIMARY_TABS = [
  { href: "/home", label: "Home", short: "Home" },
  { href: "/search", label: "Search fashion", short: "Search" },
  { href: "/create", label: "Create a look", short: "Create" },
  { href: "/archive", label: "My Archive", short: "Archive" },
  { href: "/profile", label: "Profile", short: "Profile" },
] as const;

const CREATE_OPTIONS = [
  { href: "/build", label: "Build My Look" },
  { href: "/generate", label: "Quick Generate" },
  { href: "/surprise", label: "Surprise Me" },
] as const;

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
              className="fixed inset-0 z-[65] bg-ink/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateOpen(false)}
            />
            <motion.div
              role="menu"
              aria-label="Create options"
              className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[66] border border-smoke/60 bg-charcoal p-2 md:hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              {CREATE_OPTIONS.map((opt) => (
                <Link
                  key={opt.href}
                  href={opt.href}
                  role="menuitem"
                  onClick={() => setCreateOpen(false)}
                  className="touch-target block w-full border-b border-smoke/30 px-4 text-left text-sm text-ivory last:border-0 hover:text-accent"
                >
                  {opt.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-smoke/50 bg-ink/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Primary app navigation"
      >
        <ul className="grid grid-cols-5">
          {PRIMARY_TABS.map((tab) => {
            const isActive =
              tab.href === "/create"
                ? isCreateActive
                : pathname === tab.href ||
                  (tab.href === "/archive" && pathname.startsWith("/archive"));

            if (tab.href === "/create") {
              return (
                <li key={tab.href}>
                  <button
                    type="button"
                    onClick={() => setCreateOpen((v) => !v)}
                    className={`touch-target flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-1 px-1 transition-colors ${
                      isActive ? "text-accent" : "text-muted hover:text-ivory"
                    }`}
                    aria-label={tab.label}
                    aria-expanded={createOpen}
                    aria-haspopup="menu"
                  >
                    <span className="font-display text-lg leading-none" aria-hidden="true">
                      +
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em]">
                      {tab.short}
                    </span>
                  </button>
                </li>
              );
            }

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`touch-target flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-1 transition-colors ${
                    isActive ? "text-accent" : "text-muted hover:text-ivory"
                  }`}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="font-display text-lg leading-none" aria-hidden="true">
                    {String(PRIMARY_TABS.indexOf(tab) + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em]">
                    {tab.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
