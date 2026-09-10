import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.thedesirelounge.com" },
      { protocol: "https", hostname: "restaurents-api.cylsys.com", pathname: "/**" },

    ],
  },
};

export default nextConfig;
