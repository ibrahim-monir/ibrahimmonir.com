import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "api.ibrahimmonir.com", pathname: "/storage/**" },
    ],
  },
  async redirects() {
    return [
      // Canonicalize to the apex domain (matches metadataBase in layout.tsx).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ibrahimmonir.com" }],
        destination: "https://ibrahimmonir.com/:path*",
        permanent: true,
      },
      // The Packages page was renamed to Pricing.
      {
        source: "/packages",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
