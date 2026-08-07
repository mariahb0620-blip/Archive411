"use client";

import Link from "next/link";
import { useMemo } from "react";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import DiscoveryCard from "@/app/components/DiscoveryCard";
import EditorialButton from "@/app/components/EditorialButton";
import MobileQuickActions from "@/app/components/MobileQuickActions";
import MobileSectionHeader from "@/app/components/MobileSectionHeader";
import RouteGuard from "@/app/components/RouteGuard";
import AppImage from "@/app/components/AppImage";
import { useApp } from "@/app/context/AppContext";
import { BETA_DESIGNERS } from "@/app/data/betaCatalog";
import { DISCOVERY_MODES } from "@/app/data/mockCatalog";

function uniqueFeaturedByCity() {
  const seen = new Set<string>();
  return BETA_DESIGNERS.filter((d) => d.featured)
    .filter((d) => {
      const key = d.city.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

function HomeContent() {
  const { user, lookbooks } = useApp();
  const featured = useMemo(() => uniqueFeaturedByCity(), []);
  const recentLookbook = lookbooks[0];

  const displayName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="space-y-8 md:space-y-16">
        <section>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Archive411</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ivory md:text-5xl">
            Hello, {displayName}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
            Explore independent fashion worldwide, or build a look in minutes.
          </p>
        </section>

        <MobileQuickActions />

        {recentLookbook && (
          <section className="mobile-card flex items-center justify-between gap-4 p-4 md:hidden">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Continue</p>
              <p className="mt-1 line-clamp-1 text-sm text-ivory">{recentLookbook.title}</p>
            </div>
            <Link
              href={`/lookbooks/${recentLookbook.id}`}
              className="shrink-0 rounded-full bg-accent/10 px-4 py-2 text-xs uppercase tracking-wider text-accent"
            >
              Open
            </Link>
          </section>
        )}

        <section>
          <MobileSectionHeader eyebrow="Explore" title="How do you want to discover?" />
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
            {DISCOVERY_MODES.map((mode, index) => (
              <DiscoveryCard
                key={mode.id}
                href={mode.href}
                title={mode.title}
                description={mode.description}
                index={index}
              />
            ))}
          </div>
        </section>

        <section>
          <MobileSectionHeader
            eyebrow="Independent"
            title="Featured designers"
            href="/designers"
          />
          <div className="mobile-horizontal-scroll md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3">
            {featured.map((designer) => (
              <Link
                key={designer.id}
                href={`/designers/${designer.slug}`}
                className="mobile-card group w-[68vw] shrink-0 snap-start overflow-hidden active:scale-[0.98] md:w-auto"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#141414]">
                  <AppImage
                    src={designer.coverImageUrl}
                    alt={designer.labelName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 68vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    {designer.city}, {designer.country}
                  </p>
                  <p className="mt-1 font-display text-lg text-ivory">{designer.labelName}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{designer.biography}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="hidden border-t border-smoke/30 pt-12 md:block">
          <MobileSectionHeader eyebrow="Account" title="Your style registry" />
          <p className="mb-6 max-w-2xl text-muted">
            Save looks, track designers, and refine your preferences over time.
          </p>
          <div className="flex flex-wrap gap-4">
            <EditorialButton href="/profile">View profile</EditorialButton>
            <EditorialButton href="/build" variant="ghost">
              Build a look
            </EditorialButton>
          </div>
        </section>
      </AppPageMain>
    </div>
  );
}

export default function HomePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <HomeContent />
    </RouteGuard>
  );
}
