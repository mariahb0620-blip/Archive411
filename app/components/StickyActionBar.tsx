"use client";

import type { ReactNode } from "react";

/** Fixed bottom bar above mobile tab nav — for primary CTAs on long pages. */
export default function StickyActionBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 z-[55] border-t border-smoke/50 bg-ink/95 px-4 py-3 backdrop-blur-md md:static md:z-auto md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
      style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg gap-3 md:max-w-none md:justify-center">{children}</div>
    </div>
  );
}
