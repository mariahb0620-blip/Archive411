"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookbookProfile } from "@/app/types/fashionIntelligence";
import { formatIntelligencePrice } from "@/app/utils/fashionIntelligenceHelpers";
import { staggerItem } from "@/app/lib/motion";

function IntelChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-smoke/40 bg-ink/50 px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.3em] text-smoke">{label}</p>
      <p className="mt-1 text-xs leading-snug text-ivory/90">{value}</p>
    </div>
  );
}

interface FashionIntelligenceCardProps {
  profile: LookbookProfile;
  onSelect: (profile: LookbookProfile) => void;
}

export default function FashionIntelligenceCard({
  profile,
  onSelect,
}: FashionIntelligenceCardProps) {
  const macysCount = profile.garments.filter((g) => g.retailer === "macys").length;
  const luxuryCount = profile.garments.filter((g) => g.retailer === "luxury").length;

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="group cursor-pointer"
      onClick={() => onSelect(profile)}
      role="button"
      tabIndex={0}
      aria-label={`Open look ${profile.index}: ${profile.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(profile);
        }
      }}
    >
      <div className="relative overflow-hidden border border-smoke/50 bg-charcoal">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={profile.heroImageUrl}
            alt={profile.title}
            fill
            className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80" />
        </div>

        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
          <span className="border border-smoke/60 bg-ink/75 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-muted backdrop-blur-sm">
            {profile.season}
          </span>
          <span className="font-display text-sm text-ivory/80">
            {String(profile.index).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-smoke/40 bg-ink/80 p-5 backdrop-blur-md">
          <p className="text-[9px] uppercase tracking-[0.28em] text-accent">
            {profile.subculture}
          </p>
          <h2 className="mt-1.5 font-display text-xl leading-tight text-ivory md:text-2xl">
            {profile.title}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{profile.tagline}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <IntelChip label="Historical Influence" value={profile.historicalInfluence} />
            <IntelChip label="Runway Reference" value={profile.runwayReference} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-smoke/30 pt-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent">
                {formatIntelligencePrice(profile.totalPrice)}
              </span>
              <span className="text-[9px] text-smoke">
                {macysCount} Macy&apos;s · {luxuryCount} Luxury
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted transition-colors group-hover:text-ivory">
              Open Edit →
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
