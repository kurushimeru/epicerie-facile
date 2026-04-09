import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "*.flipp.com" },
      { hostname: "flipp.com" },
      { hostname: "cdn.flipp.com" },
    ],
    // Images Flipp = URLs externes non optimisables par Next — unoptimized géré dans ProductCard
  },
};

export default nextConfig;
