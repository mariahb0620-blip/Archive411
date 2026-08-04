"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import EmptyState from "@/app/components/EmptyState";
import RouteGuard from "@/app/components/RouteGuard";
import { useApp } from "@/app/context/AppContext";

function ArchiveContent() {
  const { lookbooks, collections, user } = useApp();

  if (lookbooks.length === 0 && collections.length === 0) {
    return (
      <div className="min-h-screen bg-ink">
        <AppHeader />
        <main id="main-content" tabIndex={-1} className="container-editorial flex min-h-screen flex-col items-center justify-center pt-24 pb-16">
          <EmptyState
            headline="Your Archive is ready to be built."
            text="Generate a lookbook or save a look to begin collecting your personal fashion references."
            primaryLabel="Create My First Lookbook"
            primaryHref="/build"
            imageUrl="https://images.unsplash.com/photo-1496747611176-843222e1eead?w=800&q=85&auto=format&fit=crop"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial pt-24 pb-16 md:pt-28">
        <header className="mb-12 border-b border-smoke/30 pb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">My Archive</p>
          <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            Your fashion library
          </h1>
          {user?.isGuest && (
            <p className="mt-4 text-sm text-accent">
              Guest mode — lookbooks save on this device. Sign in with email to
              restore your Archive when you return.
            </p>
          )}
          {!user?.isGuest && user?.authProvider === "email" && (
            <p className="mt-4 text-sm text-muted">
              Signed in with email — your Archive is tied to this address on this
              device.
            </p>
          )}
        </header>

        {collections.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Collections</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((col) => (
                <div key={col.id} className="border border-smoke/50 bg-charcoal p-5">
                  <h3 className="font-display text-xl text-ivory">{col.name}</h3>
                  {col.description && <p className="mt-2 text-xs text-muted">{col.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted">Saved lookbooks</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lookbooks.map((lb) => (
              <Link
                key={lb.id}
                href={`/lookbooks/${lb.id}`}
                className="group border border-smoke/50 bg-charcoal"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={lb.coverImageUrl} alt={lb.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="400px" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{lb.generatedAt.slice(0, 10)}</p>
                  <h3 className="mt-2 font-display text-2xl text-ivory">{lb.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lb.aestheticTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] uppercase tracking-[0.15em] text-smoke">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
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
