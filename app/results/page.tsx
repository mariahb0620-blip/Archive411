"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RouteGuard from "@/app/components/RouteGuard";

function ResultsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/build");
  }, [router]);
  return null;
}

export default function ResultsPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <ResultsRedirect />
    </RouteGuard>
  );
}
