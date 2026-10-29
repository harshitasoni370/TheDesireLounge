export interface NavLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Sports", href: "/live-sports" },
];

export const GAMING_LINKS: NavLinkItem[] = [
  { label: "PlayStation", href: "/playstation" },
  { label: "Board Games", href: "/board-games" },
];

export const NAV_LINKS_TAIL: NavLinkItem[] = [
  { label: "Events", href: "/events" },
  { label: "Catering", href: "/catering" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

function normalizeRestaurantApiBaseUrl(value: string) {
  const baseUrl = value.trim().replace(/\/+$/, "");
  return /\/api$/i.test(baseUrl) ? baseUrl : `${baseUrl}/api`;
}

export const RESTAURANT_API_BASE_URL = normalizeRestaurantApiBaseUrl(
  process.env.NEXT_PUBLIC_RESTAURANT_API_BASE_URL?.trim() || "https://restaurents-api.cylsys.com/api",
);
export const RESTAURANT_ASSET_BASE_URL = new URL(RESTAURANT_API_BASE_URL).origin;
export const EVENTS_API_BASE_URL = (process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL || "https://fumesandflavoursapi.cylsysuat.com").replace(
  /\/+$/,
  "",
);
export const EVENTS_API_PROXY_BASE_URL = "/events-api";
export const RESTAURANT_API_ENDPOINTS = {
  liveSports: "/Livesports/GetLiveSports",
  liveSportsCompetitions: "/Livesports/GetLiveSportsCompetitions",
  playstationGames: "/Playstation/Playstationgamelist",
  boardGames: "/BoardGame/Boardgamelist",
} as const;
export const WEBSITE_CONFIG_API_URL =
  process.env.NEXT_PUBLIC_WEBSITE_CONFIG_API_URL ||
  // "https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain";
  "https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain";
