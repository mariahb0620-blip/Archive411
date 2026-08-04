"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/build", label: "Build a Look" },
  { href: "/results", label: "Registry" },
  { href: "/independent", label: "Independent Edit" },
  { href: "/archive", label: "My Archive" },
  { href: "/designers", label: "Designers" },
  { href: "/for-designers", label: "For Designers" },
  { href: "/profile", label: "Profile" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-smoke/40 bg-ink/95 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="container-editorial flex h-14 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/home"
          className="font-display text-base tracking-[0.2em] text-ivory transition-colors hover:text-accent md:text-xl"
          aria-label="archive.411 home"
        >
          archive<span className="text-accent">.411</span>
        </Link>

        {/* Mobile: quick profile access */}
        <Link
          href="/profile"
          className="touch-target text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory lg:hidden"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          Profile
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/archive" && pathname.startsWith("/archive")) ||
              (link.href === "/results" && pathname.startsWith("/results"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-accent" : "text-muted hover:text-ivory"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
