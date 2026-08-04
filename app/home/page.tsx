"use client";

import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/app/components/AppHeader";
import DiscoveryCard from "@/app/components/DiscoveryCard";
import RouteGuard from "@/app/components/RouteGuard";
import { DISCOVERY_MODES, HOMEPAGE_COLLECTIONS } from "@/app/data/mockCatalog";
import { CULTURAL_DISCOVERY_SECTIONS } from "@/app/data/styleCommunities";
import { getFeaturedDesigners } from "@/app/services/lookbook.service";
import { useApp } from "@/app/context/AppContext";

function HomeContent() {
  const { user } = useApp();
  const featured = getFeaturedDesigners();

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="container-editorial pt-24 pb-16 md:pt-28 md:pb-24"
      >
        <header className="mb-12 border-b border-smoke/30 pb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            What are you looking for today?
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Explore fashion through complete looks, independent designers and
            personalized search — not product grids.
          </p>
        </header>

        <section aria-label="Discovery modes" className="grid gap-5 md:grid-cols-2">
          {DISCOVERY_MODES.map((mode, index) => (
            <DiscoveryCard
              key={mode.id}
              href={mode.href}
              title={mode.title}
              description={mode.description}
              index={index}
            />
          ))}
        </section>

        <section className="mt-20 border-t border-smoke/30 pt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                High-Low Registry
              </p>
              <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">
                Twelve editorial lookbook profiles
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                Macy&apos;s foundations paired with luxury accents — historical
                influence, runway references, and curation narratives for every
                look.
              </p>
            </div>
            <Link
              href="/results"
              className="text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-ivory"
            >
              Open registry →
            </Link>
          </div>
        </section>

        <section className="mt-20 border-t border-smoke/30 pt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                The Independent Edit
              </p>
              <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">
                Discover independent and emerging designers shaping fashion across the world.
              </h2>
            </div>
            <Link
              href="/independent"
              className="text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-ivory"
            >
              View all →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featured.map((designer) => (
              <Link
                key={designer.id}
                href={`/designers/${designer.slug}`}
                className="group border border-smoke/50 bg-charcoal transition-colors hover:border-accent/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={designer.coverImageUrl}
                    alt={designer.labelName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                    {designer.city}, {designer.country}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ivory">
                    {designer.labelName}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-muted">
                    {designer.biography}
                  </p>
                  <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                    View designer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
                Cultural discovery
              </p>
              <h2 className="mt-3 font-display text-3xl text-ivory">
                Fashion communities & creative influences
              </h2>
              <p className="mt-4 max-w-xl text-sm text-muted">
                Explore style directions from cities and communities worldwide — never
                assigned based on how you look.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-ivory"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURAL_DISCOVERY_SECTIONS.slice(0, 6).map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className="border border-smoke/50 p-5 transition-colors hover:border-accent/50"
              >
                <h3 className="font-display text-lg text-ivory">{section.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted">{section.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <Link
            href="/showrooms"
            className="group block border border-smoke/50 bg-charcoal p-8 transition-colors hover:border-accent/50"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Showroom / Private Shopping
            </p>
            <h2 className="mt-3 font-display text-2xl text-ivory">
              Appointment-based showrooms & styling studios
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Build a fitting list, request try-ons, and book appointments — not off-the-rack
              shopping.
            </p>
            <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] text-accent group-hover:text-ivory">
              Browse showrooms →
            </span>
          </Link>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
            Global edits
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {HOMEPAGE_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.href}
                className="border border-smoke/50 px-4 py-2 text-xs text-ivory transition-colors hover:border-accent hover:text-accent"
              >
                {col.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
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
