"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getDomainUrl, getMapsUrl, getPhoneDisplay, getPhoneHref } from "@/lib/site-config";

const QUICK_LINKS = [
  { label: "Live Sports", href: "/live-sports" },
  { label: "Gaming Zone", href: "/#gaming-zone" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Reservations", href: "/#reserve" },
];

export function SiteFooter() {
  const site = useSiteConfig();
  const appUrl = getDomainUrl(site, "APP");
  const phoneHref = getPhoneHref(site);
  const mapsUrl = getMapsUrl(site);

  return (
    <footer className="home-footer" id="contact">
      <div className="home-container home-footer__grid">
        <div className="home-footer__brand">
          <Link href="/" className="logo">
            <Image src={site.logoUrl} alt={site.siteName} className="logo__mark" width={48} height={48} unoptimized />
            <span className="logo__copy">
              <span className="logo__text">{site.siteName}</span>
            </span>
          </Link>
          <div className="home-divider" aria-hidden="true" />
          <p>{site.branchName || site.siteName}{site.address ? ` — ${site.address}` : ""}</p>
          <div className="home-footer__social" aria-label="Location">
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Maps">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="home-footer__col">
          <h3>Quick Links</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul>
            {appUrl && <li><a href={`${appUrl}/categories.html`}>Menu</a></li>}
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="home-footer__col">
          <h3>Our Menu</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul>
            {appUrl && <li><a href={`${appUrl}/categories.html`}>Browse menu</a></li>}
          </ul>
        </div>

        <div className="home-footer__col">
          <h3>Contact Us</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul className="home-footer__contact">
            {phoneHref && (
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={phoneHref}>{getPhoneDisplay(site)}</a>
              </li>
            )}
            {site.address && (
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {mapsUrl ? <a href={mapsUrl} target="_blank" rel="noopener noreferrer">{site.address}</a> : site.address}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="home-footer__bottom">
        <div className="home-divider home-divider--center" aria-hidden="true" />
        <p>&copy; {new Date().getFullYear()} {site.siteName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
