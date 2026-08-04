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
        className="group block border border-smoke/50 bg-charcoal p-6 transition-colors hover:border-accent/60 md:p-8"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-display text-2xl text-ivory md:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        <span className="mt-6 inline-block text-[10px] uppercase tracking-[0.25em] text-accent transition-colors group-hover:text-ivory">
          Explore →
        </span>
      </Link>
    </motion.div>
  );
}
