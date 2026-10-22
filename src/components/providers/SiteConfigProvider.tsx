"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WEBSITE_CONFIG_API_URL } from "@/lib/site";
import { getDomainUrl, getSiteConfig, type SiteConfig } from "@/lib/site-config";

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function useSiteConfig() {
  const site = useContext(SiteConfigContext);
  if (!site) throw new Error("useSiteConfig must be used inside SiteConfigProvider.");
  return site;
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const domain = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN?.trim() || window.location.hostname;
    const params = new URLSearchParams({ domain });

    fetch(`${WEBSITE_CONFIG_API_URL}?${params}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Website configuration API returned ${response.status}.`);
        return response.json() as Promise<unknown>;
      })
      .then((payload) => setSite(getSiteConfig(payload)))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        const cause = reason instanceof Error ? reason : new Error(String(reason));
        console.error(`Unable to load website configuration for domain "${domain}".`, cause);
        setError(cause);
      });

    return () => controller.abort();
  }, [retryKey]);

  useEffect(() => {
    if (!site) return;

    const pageName = pathname
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    document.title = pageName ? `${pageName} | ${site.siteName}` : site.siteName;

    const description = `${site.siteName}${site.address ? ` — ${site.address}` : ""}`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = description;

    const icon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (icon) icon.href = site.logoUrl;

    const canonicalUrl = getDomainUrl(site, "WEBSITE") || window.location.origin;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${canonicalUrl}${pathname}`;
  }, [pathname, site]);

  if (error) {
    return (
      <main className="home-container" role="alert" style={{ paddingBlock: "5rem", textAlign: "center" }}>
        <h1 className="home-heading">Website configuration unavailable</h1>
        <p className="home-copy">{error.message}</p>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setError(null);
            setRetryKey((key) => key + 1);
          }}
        >
          Retry
        </button>
      </main>
    );
  }

  if (!site) {
    return (
      <main className="home-container" role="status" style={{ paddingBlock: "5rem", textAlign: "center" }}>
        Loading website…
      </main>
    );
  }

  return <SiteConfigContext.Provider value={site}>{children}</SiteConfigContext.Provider>;
}
