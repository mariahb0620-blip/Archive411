"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/app/context/AppContext";

export default function RouteGuard({
  children,
  requireAuth = false,
  requireIntro = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireIntro?: boolean;
}) {
  const router = useRouter();
  const { isLoading, introComplete, isAuthenticated } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (requireIntro && !introComplete) {
      router.replace("/intro");
      return;
    }
    if (requireAuth && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isLoading, introComplete, isAuthenticated, requireAuth, requireIntro, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
          Loading archive.411...
        </p>
      </div>
    );
  }

  if (requireIntro && !introComplete) return null;
  if (requireAuth && !isAuthenticated) return null;

  return children;
}
