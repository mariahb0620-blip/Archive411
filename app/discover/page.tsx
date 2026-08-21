"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import DiscoveryCard from "@/app/components/DiscoveryCard";
import EditorialButton from "@/app/components/EditorialButton";
import AppPageMain from "@/app/components/AppPageMain";
import RouteGuard from "@/app/components/RouteGuard";
import {
  CULTURAL_DISCOVERY_SECTIONS,
  STYLE_COMMUNITIES,
  getStyleCommunity,
} from "@/app/data/styleCommunities";
import {
  APP_VIBE_NORTH_STAR,
  getPriorityMenswearInspiration,
  inspirationSearchAesthetics,
  STYLE_INSPIRATION_REFERENCES,
} from "@/app/data/styleInspirationBoard";
import {
  generateLookbookFromSearch,
} from "@/app/services/lookbook.service";
import { completeLookbookFlow } from "@/app/services/completeLookbookFlow";
import { useApp } from "@/app/context/AppContext";

function DiscoverContent() {
  const router = useRouter();
  const { saveLookbook } = useApp();
  const searchParams = useSearchParams();
  const communityId = searchParams.get("community");
  const board = searchParams.get("board");
  const city = searchParams.get("city") ?? undefined;
  const [community, setCommunity] = useState(
    communityId ? getStyleCommunity(communityId) : undefined
  );

  useEffect(() => {
    if (communityId) setCommunity(getStyleCommunity(communityId));
  }, [communityId]);

  const priorityTwelve = useMemo(() => getPriorityMenswearInspiration(), []);

  const exploreCommunity = async () => {
    if (!community) return;
    const { lookbook, looks } = generateLookbookFromSearch({
      aesthetics: community.searchAesthetics,
      city,
      fashionCommunities: [community.id],
    });
    await completeLookbookFlow(router, saveLookbook, {
      lookbook,
      looks,
      method: "search",
    });
  };

  const exploreBoard = async (kind: "menswear-12" | "north-star") => {
    const aesthetics =
      kind === "north-star"
        ? [...APP_VIBE_NORTH_STAR.attributes]
        : inspirationSearchAesthetics();
    const { lookbook, looks } = generateLookbookFromSearch({
      aesthetics,
      query: kind === "north-star" ? "alyazmine editorial chic" : "menswear inspiration board",
    });
    await completeLookbookFlow(router, saveLookbook, {
      lookbook,
      looks,
      method: "search",
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain>
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Cultural discovery</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          Fashion communities & creative influences
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Explore style directions from cities and communities around the world. These are fashion
          influences available for anyone to explore — Archive411 never assigns cultural categories
          based on how you look or where you live.
        </p>

        {community && (
          <section className="mt-12 border border-accent/30 bg-accent/5 p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Selected community</p>
            <h2 className="mt-2 font-display text-3xl text-ivory">{community.publicName}</h2>
            <p className="mt-4 text-sm text-muted">{community.description}</p>
            <p className="mt-4 text-xs italic text-smoke">{community.explorationNote}</p>
            {city && <p className="mt-2 text-xs text-muted">City focus: {city}</p>}
            <div className="mt-6">
              <EditorialButton onClick={exploreCommunity}>Generate lookbook edit</EditorialButton>
            </div>
          </section>
        )}

        {(board === "menswear-12" || board === "north-star" || !community) && (
          <section className="mt-12 border border-smoke/40 bg-charcoal/40 p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
              Inspiration board · Part 2
            </p>
            <h2 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
              {board === "north-star"
                ? `Vibe north star · ${APP_VIBE_NORTH_STAR.handle}`
                : "Menswear first 12 + city references"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-muted">
              {board === "north-star"
                ? APP_VIBE_NORTH_STAR.note
                : "Creative references for vibe and garment direction — not partnerships or endorsements. Names map to style attributes so looks pull this energy."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <EditorialButton onClick={() => exploreBoard("menswear-12")}>
                Generate from First 12
              </EditorialButton>
              <EditorialButton variant="ghost" onClick={() => exploreBoard("north-star")}>
                Generate Alyazmine-vibe edit
              </EditorialButton>
            </div>

            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Strongest first 12</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {priorityTwelve.map((ref) => (
                  <li key={ref.id} className="border border-smoke/40 p-4">
                    <p className="text-xs text-accent">{ref.handle}</p>
                    <p className="mt-1 font-display text-lg text-ivory">{ref.displayName}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                      {ref.city}
                    </p>
                    <p className="mt-2 line-clamp-3 text-xs text-muted">{ref.why}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                Full board · {STYLE_INSPIRATION_REFERENCES.length} references
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["New York City", "London", "Paris", "Ho Chi Minh City", "Global", "Abu Dhabi"].map(
                  (c) => (
                    <span
                      key={c}
                      className="border border-smoke/50 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ivory"
                    >
                      {c}:{" "}
                      {
                        STYLE_INSPIRATION_REFERENCES.filter((r) => r.city === c).length
                      }
                    </span>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">Editorial sections</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {CULTURAL_DISCOVERY_SECTIONS.map((section, index) => (
              <DiscoveryCard
                key={section.id}
                href={section.href}
                title={section.title}
                description={section.description}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-smoke/30 pt-16">
          <h2 className="text-[10px] uppercase tracking-[0.35em] text-muted">All style communities</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {STYLE_COMMUNITIES.map((c) => (
              <Link
                key={c.id}
                href={`/discover?community=${c.id}`}
                className="border border-smoke/50 p-6 transition-colors hover:border-accent/50"
              >
                <h3 className="font-display text-xl text-ivory">{c.publicName}</h3>
                <p className="mt-3 text-sm text-muted">{c.description}</p>
                <p className="mt-3 text-xs italic text-smoke">{c.explorationNote}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-smoke/30 pt-12">
          <Link
            href="/showrooms"
            className="text-[10px] uppercase tracking-[0.25em] text-accent hover:text-ivory"
          >
            Browse Showroom / Private Shopping locations →
          </Link>
        </section>
      </AppPageMain>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <DiscoverContent />
    </RouteGuard>
  );
}
