"use client";

import Image, { type ImageProps } from "next/image";
import { EDITORIAL_COVER } from "@/app/data/catalogImages";

function isSvgSrc(src: ImageProps["src"]): boolean {
  if (typeof src === "string") return src.endsWith(".svg");
  if (typeof src === "object" && src !== null && "src" in src) {
    return String(src.src).endsWith(".svg");
  }
  return false;
}

/** next/image wrapper — local SVG placeholders must bypass the optimizer. */
export default function AppImage({ src, alt, ...props }: ImageProps) {
  const resolved = src || EDITORIAL_COVER;
  return <Image src={resolved} alt={alt} unoptimized={isSvgSrc(resolved)} {...props} />;
}
