"use client";

import Image, { type ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** Local SVG placeholders use <img>; remote retailer URLs use next/image. */
export default function SafeImage({
  src,
  alt,
  className,
  fill,
  ...rest
}: SafeImageProps) {
  const isLocalSvg =
    src.startsWith("/placeholders/") ||
    src.endsWith(".svg") ||
    src.includes("/placeholders/");

  if (isLocalSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className={className}
        style={
          fill
            ? {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }
            : { width: "100%", height: "100%", objectFit: "contain" }
        }
      />
    );
  }

  return <Image src={src} alt={alt ?? ""} className={className} fill={fill} {...rest} />;
}
