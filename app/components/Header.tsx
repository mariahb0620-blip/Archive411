"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  aboutHref?: string;
}

export default function Header({ aboutHref = "#about" }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/generate", label: "Explore" },
    { href: "/saved", label: "Saved Looks" },
    { href: aboutHref, label: "About" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-smoke/40 bg-ink/80 backdrop-blur-md">
      <div className="container-editorial flex h-16 items-center justify-between md:h-18">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-widest text-ivory transition-colors hover:text-accent md:text-2xl"
          aria-label="ARCHIVE411 home"
        >
          ARCHIVE411
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex md:gap-10"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href.startsWith("/") && pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs uppercase tracking-[0.2em] transition-colors md:text-sm ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-ivory"
                }`}
                aria-label={link.label}
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
