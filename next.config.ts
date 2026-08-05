import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock hosts intentionally omitted — Archive411 uses local placeholders
    // or verified retailer product URLs only.
    remotePatterns: [],
  },
};

export default nextConfig;
