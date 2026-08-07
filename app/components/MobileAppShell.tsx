"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import InstallPrompt from "@/app/components/InstallPrompt";
import MobileNav from "@/app/components/MobileNav";
import ServiceWorkerRegister from "@/app/components/ServiceWorkerRegister";
import SkipLink from "@/app/components/SkipLink";
import BetaBanner from "@/app/components/BetaBanner";

const FULLSCREEN_ROUTES = ["/intro", "/auth"];

export default function MobileAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = FULLSCREEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      <SkipLink />
      {!hideNav && <BetaBanner />}
      <ServiceWorkerRegister />
      <div className={hideNav ? "" : "pb-mobile-nav md:pb-0"}>{children}</div>
      {!hideNav && <MobileNav />}
      {!hideNav && <InstallPrompt />}
    </>
  );
}
