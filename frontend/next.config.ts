import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '../.next',
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "api.ibrahimmonir.com", pathname: "/storage/**" },
    ],
  },
};

export default nextConfig;
