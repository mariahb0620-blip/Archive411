"use client";

import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import EditorialButton from "@/app/components/EditorialButton";

interface EmptyStateProps {
  headline: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageUrl?: string;
}

export default function EmptyState({
  headline,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  imageUrl,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg text-center">
      {imageUrl && (
        <div className="relative mx-auto mb-8 aspect-[4/3] max-w-sm overflow-hidden border border-smoke/40">
          <AppImage src={imageUrl} alt="" fill className="object-cover" sizes="400px" />
        </div>
      )}
      <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
        Archive411
      </p>
      <h2 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
        {headline}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">{text}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <EditorialButton href={primaryHref}>{primaryLabel}</EditorialButton>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
