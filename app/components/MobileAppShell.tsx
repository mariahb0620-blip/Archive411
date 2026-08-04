"use client";

import type { ReactNode } from "react";
import InstallPrompt from "@/app/components/InstallPrompt";
import MobileNav from "@/app/components/MobileNav";
import ServiceWorkerRegister from "@/app/components/ServiceWorkerRegister";
import SkipLink from "@/app/components/SkipLink";
import BetaBanner from "@/app/components/BetaBanner";

export default function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <BetaBanner />
      <ServiceWorkerRegister />
        <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      <MobileNav />
      <InstallPrompt />
    </>
  );
}
