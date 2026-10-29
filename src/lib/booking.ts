import { getDomainUrl, type SiteConfig } from "@/lib/site-config";

export interface BookingOptions {
  companyId?: string;
  branchId?: string;
  category?: string;
  reservationCategory?: string;
  categoryName?: string;
  reservationTitle?: string;
  bookingType?: string;
  moduleId?: string;
  sessionId?: string;
  tableId?: string;
  tableNumber?: string;
  hideSteps?: boolean;
  hideCurrentSession?: boolean;
  extraParams?: Record<string, string>;
}

const TABLE_RESERVATION_MODULE_ID = "b10a8026-6f97-4d93-9bd4-90258ebf940b";
const CHECKOUT_CONTEXT_ALIASES = [
  ["cid", "companyId"],
  ["bid", "branchId"],
  ["tid", "tableId"],
  ["tn", "tableNumber", "tableNo", "tableCode"],
  ["sid", "tableSessionId", "sessionId"],
  ["mid", "moduleId"],
] as const;

export function getBookingCheckoutUrl(site: SiteConfig, options: BookingOptions = {}) {
  const appUrl = getDomainUrl(site, "APP");
  if (!appUrl) return "";

  const category = options.category || "TABLE_RESERVATION";
  const categoryName =
    {
      TABLE_RESERVATION: "Table Reservation",
      EVENT: "Event",
      LIVE_SPORTS: "Live Sports",
      GAMING: "Gaming",
      BOARD_GAME: "Board Game",
      EXCLUSIVE_OFFER: "Exclusive Offer",
      BIRTHDAY: "Birthday",
      CORPORATE: "Corporate",
      CUSTOM_MOMENT: "Custom Moment",
    }[category] ||
    "Table Reservation";
  const params = new URLSearchParams({
    cid: options.companyId || site.companyId,
    bid: options.branchId || site.branchId,
    mid: options.moduleId || TABLE_RESERVATION_MODULE_ID,
    cat: category,
    rc: options.reservationCategory || category,
    rt: categoryName,
    bt: categoryName,
    s: "about-you",
    hs: options.hideSteps === false ? "0" : "1",
    hc: options.hideCurrentSession === false ? "0" : "1",
  });

  if (site.deviceId) params.set("did", site.deviceId);
  if (options.tableId) params.set("tid", options.tableId);
  if (options.tableNumber) params.set("tn", options.tableNumber);
  if (options.sessionId) params.set("sid", options.sessionId);
  if (options.categoryName) params.set("categoryName", options.categoryName);
  if (options.reservationTitle) params.set("reservationTitle", options.reservationTitle);
  if (options.bookingType) params.set("bookingType", options.bookingType);

  for (const [key, value] of Object.entries(options.extraParams || {})) {
    if (value) params.set(key, value);
  }

  return `${appUrl}/checkout?${params.toString()}`;
}

export function withBookingDeviceId(checkoutUrl: string) {
  const target = new URL(checkoutUrl);
  const currentParams = new URLSearchParams(window.location.search);
  for (const [targetKey, ...sourceKeys] of CHECKOUT_CONTEXT_ALIASES) {
    const sourceValue = sourceKeys.map((key) => currentParams.get(key)).find(Boolean);
    if (sourceValue) target.searchParams.set(targetKey, sourceValue);
  }

  let deviceId = currentParams.get("deviceId") || currentParams.get("did") || target.searchParams.get("did") || "";
  if (!deviceId) {
    try {
      deviceId = window.localStorage.getItem("desire_device_id") || "";
      deviceId ||= window.sessionStorage.getItem("desire_device_id") || "";
    } catch {
      deviceId = "";
    }
  }

  if (!deviceId) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      deviceId = crypto.randomUUID();
    } else {
      const segment = (length: number) =>
        Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      deviceId = `${segment(8)}-${segment(4)}-4${segment(3)}-8${segment(3)}-${segment(12)}`;
    }
  }

  try {
    window.localStorage.setItem("desire_device_id", deviceId);
  } catch {
    // The checkout URL still carries the ID when storage is unavailable.
  }
  try {
    window.sessionStorage.setItem("desire_device_id", deviceId);
  } catch {
    // The checkout URL still carries the ID when storage is unavailable.
  }

  target.searchParams.set("did", deviceId);
  return target.toString();
}
