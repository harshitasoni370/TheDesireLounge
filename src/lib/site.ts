export interface NavLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "https://app.thedesirelounge.com/categories.html", external: true },
  { label: "Lounge", href: "https://dl.thedesirelounge.com", external: true },
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

export const WHATSAPP_NUMBER = "971509002202";
export const PHONE_NUMBER_DISPLAY = "+971 50 900 2202";
export const PHONE_NUMBER_HREF = "tel:+971509002202";
export const EMAIL = "info@thedesirelounge.com";
export const ADDRESS = "15 8th St - Oud Metha - Dubai - United Arab Emirates";
export const MAPS_URL = "https://maps.app.goo.gl/ZEzx6gWvyjT3cqzB7";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CTqZiSxwUeXCEBM/review";
export const MENU_URL = "https://app.thedesirelounge.com/categories.html";
export const RESERVATION_API_URL = "https://fumesandflavoursapi.cylsysuat.com/api/Reservation/CraeteReservation";
export const RESERVATION_CATEGORIES_API_URL = "https://fumesandflavoursapi.cylsysuat.com/api/Reservation/getReservationCategories";
export const RESERVATION_COMPANY_ID = "0ffbe39e-abf8-4827-9107-1a04b39f3416";
export const RESERVATION_BRANCH_ID = "f4fb1d76-83a0-4965-86b5-63da28249dae";
