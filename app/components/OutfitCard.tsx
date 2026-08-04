"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { formatPrice } from "@/app/utils/affiliate";
import type { OutfitLook } from "@/app/types/styling";
import { staggerItem } from "@/app/lib/motion";

interface OutfitCardProps {
  look: OutfitLook;
  onClick: (look: OutfitLook) => void;
}

export default function OutfitCard({ look, onClick }: OutfitCardProps) {
  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={() => onClick(look)}
      className="group w-full cursor-pointer text-left"
      aria-label={`View ${look.title} look details`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
        <Image
          src={look.heroImageUrl}
          alt={look.title}
          fill
          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <p className="font-display text-xl text-ivory md:text-2xl">
            {look.title}
          </p>
          <p className="mt-1 text-sm text-muted">{look.tagline}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">
            {formatPrice(look.totalPrice)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
