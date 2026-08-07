"use client";

import { useEffect } from "react";
import Link from "next/link";
import AppImage from "@/app/components/AppImage";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EmptyState from "@/app/components/EmptyState";
import RouteGuard from "@/app/components/RouteGuard";
import { useApp } from "@/app/context/AppContext";

function ArchiveContent() {
  const { lookbooks, collections, user, refreshArchive, isLoading } = useApp();

  useEffect(() => {
    refreshArchive();
  }, [refreshArchive]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted">Loading archive...</p>
      </div>
    );
  }

  if (lookbooks.length === 0 && collections.length === 0) {
    return (
      <div className="min-h-screen bg-ink">
        <AppHeader />
        <AppPageMain className="flex min-h-[60vh] flex-col items-center justify-center">
          <EmptyState
            headline="Your Archive is ready to be built."
            text="Generate a lookbook or save a look to begin collecting your personal fashion references."
            primaryLabel="Create My First Lookbook"
            primaryHref="/build"
          />
        </AppPageMain>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain>
        <header className="mb-8 border-b border-smoke/30 pb-6 md:mb-12 md:pb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">My Archive</p>
          <h1 className="mt-3 font-display text-3xl text-ivory md:text-5xl">Your fashion library</h1>
          {user?.isGuest && (
            <p className="mt-4 text-sm text-accent">
              Guest mode — lookbooks save on this device.{" "}
              <Link href="/auth" className="underline">
                Create an account
              </Link>{" "}
              to sync your Archive across devices.
            </p>
          )}
          {!user?.isGuest && user?.authProvider === "email" && (
            <p className="mt-4 text-sm text-muted">
              Signed in with email — your Archive syncs across devices when Supabase is connected.
            </p>
          )}
        </header>

        {collections.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Collections</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((col) => (
                <div key={col.id} className="rounded-xl border border-smoke/50 bg-charcoal p-5 md:rounded-none">
                  <h3 className="font-display text-xl text-ivory">{col.name}</h3>
                  {col.description && <p className="mt-2 text-xs text-muted">{col.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Saved lookbooks</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lookbooks.map((lb) => (
              <Link
                key={lb.id}
                href={`/lookbooks/${lb.id}`}
                className="group overflow-hidden rounded-xl border border-smoke/50 bg-charcoal active:scale-[0.98] md:rounded-none md:active:scale-100"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <AppImage
                    src={lb.coverImageUrl}
                    alt={lb.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    {lb.generatedAt.slice(0, 10)}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-ivory md:text-2xl">{lb.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lb.aestheticTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] uppercase tracking-[0.15em] text-smoke">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </AppPageMain>
    </div>
  );
}

export default function ArchivePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <ArchiveContent />
    </RouteGuard>
  );
}
