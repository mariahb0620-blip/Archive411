"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Lookbook detail removed for beta — send users to Archive instead. */
export default function LookbookRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/archive");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <p className="text-[10px] uppercase tracking-[0.4em] text-muted">Opening archive...</p>
    </div>
  );
}
