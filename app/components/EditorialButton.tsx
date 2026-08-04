"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EDITORIAL_EASE } from "@/app/lib/motion";

interface EditorialButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function EditorialButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  type = "button",
  disabled = false,
}: EditorialButtonProps) {
  const baseStyles =
    "inline-flex min-h-11 items-center justify-center px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors md:text-sm";

  const variantStyles = {
    primary: "bg-accent text-ink hover:bg-ivory",
    ghost:
      "border border-smoke/60 bg-transparent text-ivory hover:border-accent hover:text-accent",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className} ${
    disabled ? "cursor-not-allowed opacity-50" : ""
  }`;

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.02 },
    whileTap: disabled ? undefined : { scale: 0.98 },
    transition: { duration: 0.2, ease: EDITORIAL_EASE },
  };

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
