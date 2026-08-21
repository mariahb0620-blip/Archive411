import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local SVG placeholders; add retailer CDNs here when real feeds connect.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: "/results", destination: "/build", permanent: false },
      { source: "/saved", destination: "/archive", permanent: false },
    ];
  },
};

export default nextConfig;
