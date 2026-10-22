"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, NAV_LINKS_TAIL, GAMING_LINKS } from "@/lib/site";
import { getDomainUrl } from "@/lib/site-config";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

export function SiteHeader() {
  const site = useSiteConfig();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [gamingOpen, setGamingOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 18);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setGamingOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setGamingOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const closeMobileNav = () => {
    setNavOpen(false);
    setGamingOpen(false);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const appUrl = getDomainUrl(site, "APP");
  const loungeUrl = getDomainUrl(site, "DL");

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="site-header">
      <div className="site-header__inner">
        <Link href="/" className="logo site-header__logo">
          <Image src={site.logoUrl} alt={site.siteName} className="logo__mark" width={48} height={48} unoptimized />
          <span className="logo__copy">
            <span className="logo__text">{site.siteName}</span>
          </span>
        </Link>

        <nav className={`site-nav${navOpen ? " is-open" : ""}`} id="site-nav" aria-label="Primary" ref={navRef}>
          {appUrl && (
            <a href={`${appUrl}/categories.html`} className="site-nav__link" onClick={closeMobileNav}>
              Menu
            </a>
          )}
          {loungeUrl && (
            <a href={loungeUrl} className="site-nav__link" onClick={closeMobileNav}>
              Lounge
            </a>
          )}
          {NAV_LINKS.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} className="site-nav__link" onClick={closeMobileNav}>
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`site-nav__link${isActive(item.href) ? " is-active" : ""}`}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={closeMobileNav}
              >
                {item.label}
              </Link>
            )
          )}

          <div className={`site-nav__item site-nav__item--dropdown${gamingOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="site-nav__link site-nav__dropdown-toggle"
              aria-expanded={gamingOpen}
              aria-haspopup="true"
              aria-controls="gaming-nav-menu"
              onClick={(e) => {
                e.stopPropagation();
                setGamingOpen((v) => !v);
              }}
            >
              Gaming
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="site-nav__dropdown" id="gaming-nav-menu">
              {GAMING_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="site-nav__dropdown-link" rel="noopener noreferrer" onClick={closeMobileNav}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {NAV_LINKS_TAIL.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`site-nav__link${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={closeMobileNav}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href="/#reserve" className="site-header__cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M8 15h2M8 18h2M14 15h2M14 18h2" />
            </svg>
            <span>Reserve a Table</span>
          </Link>
          <button
            type="button"
            className="site-header__toggle"
            id="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            aria-label="Toggle menu"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
