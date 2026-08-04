"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function RootPage() {
  const router = useRouter();
  const { isLoading, introComplete, isAuthenticated } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (!introComplete) {
      router.replace("/intro");
      return;
    }
    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }
    router.replace("/home");
  }, [isLoading, introComplete, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-muted">
        archive.411
      </p>
    </div>
  );
}
