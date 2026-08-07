"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EDITORIAL_EASE } from "@/app/lib/motion";

interface DiscoveryCardProps {
  href: string;
  title: string;
  description: string;
  index: number;
}

export default function DiscoveryCard({
  href,
  title,
  description,
  index,
}: DiscoveryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: EDITORIAL_EASE }}
    >
      <Link
        href={href}
        className="group mobile-card flex items-start justify-between gap-4 p-5 transition-colors active:scale-[0.98] active:bg-smoke/20 md:rounded-none md:p-8 md:active:scale-100"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted md:block">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-xl text-ivory md:mt-3 md:text-3xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted md:mt-3 md:line-clamp-none">
            {description}
          </p>
          <span className="mt-4 hidden text-[10px] uppercase tracking-[0.25em] text-accent transition-colors group-hover:text-ivory md:inline-block">
            Explore →
          </span>
        </div>
        <span className="mt-1 shrink-0 text-lg text-muted md:hidden" aria-hidden>
          →
        </span>
      </Link>
    </motion.div>
  );
}
