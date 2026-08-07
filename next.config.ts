import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
