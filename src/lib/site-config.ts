import { RESTAURANT_API_BASE_URL } from "@/lib/site";

export interface WebsiteDomain {
  appType: string;
  domain: string;
  url: string;
}

export interface SiteConfig {
  companyId: string;
  branchId: string;
  domain: string;
  siteName: string;
  logoUrl: string;
  assetPrefix: string;
  branchName: string;
  countryCode: string;
  phone: string;
  address: string;
  timezone: string;
  domains: WebsiteDomain[];
}

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(record: RecordValue, key: string) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Website configuration is missing "${key}".`);
  }
  return value.trim();
}

function unwrapConfig(payload: unknown): RecordValue {
  let value = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(value)) value = value[0];
    if (!isRecord(value)) break;
    if ("companyId" in value) return value;
    value = value.data ?? value.result ?? value.item ?? value;
    if (isRecord(value) && !("data" in value) && !("result" in value) && !("item" in value)) return value;
  }
  throw new Error("Website configuration response has an unsupported format.");
}

function parseDomains(value: unknown): WebsiteDomain[] {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch (error) {
      throw new Error("Website configuration contains invalid domainsJson.", { cause: error });
    }
  }

  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is WebsiteDomain =>
      isRecord(item) &&
      typeof item.appType === "string" &&
      typeof item.domain === "string" &&
      typeof item.url === "string",
  );
}

export function getSiteConfig(payload: unknown): SiteConfig {
  const record = unwrapConfig(payload);
  const logoPath = readRequiredString(record, "logoUrl");
  const logo = new URL(logoPath, `${RESTAURANT_API_BASE_URL}/`);
  const logoPathMarker = logo.pathname.toLowerCase().indexOf("/image/logo/");
  const assetPrefix = logoPathMarker > 0 ? logo.pathname.slice(1, logoPathMarker) : "";

  return {
    companyId: readRequiredString(record, "companyId"),
    branchId: readRequiredString(record, "branchId"),
    domain: readRequiredString(record, "domain"),
    siteName: readRequiredString(record, "siteName"),
    logoUrl: logo.toString(),
    assetPrefix,
    branchName: typeof record.branchName === "string" ? record.branchName.trim() : "",
    countryCode: typeof record.countryCode === "string" ? record.countryCode.trim() : "",
    phone: typeof record.phone === "string" ? record.phone.trim() : "",
    address: typeof record.address === "string" ? record.address.trim() : "",
    timezone: readRequiredString(record, "timezone"),
    domains: parseDomains(record.domainsJson),
  };
}

export function getTodayInTimezone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day), 12);
}

export function getTimeZoneOffset(date: Date, timeZone: string) {
  const value = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = value?.match(/^GMT(?:([+-])(\d{2}):(\d{2}))?$/);
  if (!match) throw new Error(`Could not determine the time-zone offset for "${timeZone}".`);
  return match[1] ? `${match[1]}${match[2]}:${match[3]}` : "+00:00";
}

export function getDomainUrl(site: SiteConfig, appType: string) {
  return (
    site.domains.find((entry) => {
      if (entry.appType.toUpperCase() !== appType.toUpperCase()) return false;
      try {
        const url = new URL(entry.url);
        const hostname = url.hostname.toLowerCase();
        const isLoopback =
          hostname === "localhost" ||
          hostname.endsWith(".localhost") ||
          hostname === "127.0.0.1" ||
          hostname === "[::1]";
        return (url.protocol === "https:" || url.protocol === "http:") && !isLoopback;
      } catch {
        return false;
      }
    })?.url.replace(/\/+$/, "") || ""
  );
}

export function getAssetUrl(path: string, site?: SiteConfig) {
  if (/^https?:\/\//i.test(path)) return path;
  const assetPath = path.replace(/^\/+/, "");
  const pathWithTenant =
    site?.assetPrefix && !assetPath.toLowerCase().startsWith(`${site.assetPrefix.toLowerCase()}/`)
      ? `${site.assetPrefix}/${assetPath}`
      : assetPath;
  return `${RESTAURANT_API_BASE_URL}/${pathWithTenant}`;
}

export function getPhoneDisplay(site: SiteConfig) {
  const countryDigits = site.countryCode.replace(/\D/g, "");
  const phoneDigits = site.phone.replace(/\D/g, "");
  const localNumber = countryDigits && phoneDigits.startsWith(countryDigits) ? phoneDigits.slice(countryDigits.length) : phoneDigits;
  return [site.countryCode, localNumber].filter(Boolean).join(" ");
}

export function getPhoneHref(site: SiteConfig) {
  const countryDigits = site.countryCode.replace(/\D/g, "");
  const phoneDigits = site.phone.replace(/\D/g, "");
  const number = countryDigits && phoneDigits.startsWith(countryDigits) ? phoneDigits : `${countryDigits}${phoneDigits}`;
  return number ? `tel:+${number}` : "";
}

export function getWhatsAppHref(site: SiteConfig) {
  const countryDigits = site.countryCode.replace(/\D/g, "");
  const phoneDigits = site.phone.replace(/\D/g, "");
  const number = countryDigits && phoneDigits.startsWith(countryDigits) ? phoneDigits : `${countryDigits}${phoneDigits}`;
  return number ? `https://wa.me/${number}` : "";
}

export function getMapsUrl(site: SiteConfig) {
  return site.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}` : "";
}
