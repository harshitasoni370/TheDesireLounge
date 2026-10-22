export interface NavLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Live Sports", href: "/live-sports" },
];

export const GAMING_LINKS: NavLinkItem[] = [
  { label: "PlayStation", href: "/playstation" },
  { label: "Board Games", href: "/board-games" },
];

export const NAV_LINKS_TAIL: NavLinkItem[] = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

export const RESTAURANT_API_BASE_URL = (
  process.env.NEXT_PUBLIC_RESTAURANT_API_BASE_URL || "https://restaurents-api.cylsys.com"
).replace(/\/+$/, "");
export const RESTAURANT_API_PROXY_BASE_URL = "/restaurant-api";
export const EVENTS_API_BASE_URL = (process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL || "https://fumesandflavoursapi.cylsysuat.com").replace(
  /\/+$/,
  "",
);
export const EVENTS_API_PROXY_BASE_URL = "/events-api";
export const WEBSITE_CONFIG_API_URL =
  process.env.NEXT_PUBLIC_WEBSITE_CONFIG_API_URL ||
  // "https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain";
  "https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain";

export const RESERVATION_API_URL = `${RESTAURANT_API_PROXY_BASE_URL}/api/Reservation/CraeteReservation`;
export const RESERVATION_CATEGORIES_API_URL = `${RESTAURANT_API_PROXY_BASE_URL}/api/Reservation/getReservationCategories`;
