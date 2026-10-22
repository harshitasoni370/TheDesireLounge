import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const restaurantApiUrl = new URL(process.env.NEXT_PUBLIC_RESTAURANT_API_BASE_URL || "https://restaurents-api.cylsys.com");
const websiteConfigApiUrl = new URL(
  process.env.NEXT_PUBLIC_WEBSITE_CONFIG_API_UPSTREAM?.trim() ||
    // "https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain",
    "https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain"
);
const eventsApiBaseUrl = (
  process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL ||
  // "https://fumesandflavoursapi.cylsysuat.com"
  "https://restaurents-api.cylsys.com"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.thedesirelounge.com" },
      {
        protocol: restaurantApiUrl.protocol === "http:" ? "http" : "https",
        hostname: restaurantApiUrl.hostname,
        pathname: "/**",
      },

    ],
  },
  // Development rewrites mirror the same-origin reverse proxies configured for IIS.
  // Rewrites are ignored by `next build` with output: "export".
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/website-config-api",
              destination: websiteConfigApiUrl.toString(),
            },
            {
              source: "/restaurant-api/:path*",
              destination: `${restaurantApiUrl.origin}/:path*`,
            },
            {
              source: "/events-api/:path*",
              destination: `${eventsApiBaseUrl}/:path*`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;