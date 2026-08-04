"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/app/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
