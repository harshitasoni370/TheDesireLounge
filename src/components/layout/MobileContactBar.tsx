"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getPhoneDisplay, getPhoneHref, getWhatsAppHref } from "@/lib/site-config";

export function MobileContactBar() {
  const site = useSiteConfig();
  const phoneHref = getPhoneHref(site);
  const whatsappHref = getWhatsAppHref(site);

  return (
    <div className="home-mobile-bar" role="navigation" aria-label="Quick contact">
      {phoneHref && <a href={phoneHref} className="home-mobile-bar__btn home-mobile-bar__btn--call">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
        </svg>
        {getPhoneDisplay(site)}
      </a>}
      {whatsappHref && <a href={whatsappHref} className="home-mobile-bar__btn home-mobile-bar__btn--wa" target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11 11 0 0 0 3.2 17.7L2 22l4.4-1.2A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.7.7-2.5-.2-.3a9 9 0 1 1 7 3.6zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a2.4 2.4 0 0 0-.8 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.4 12 12 0 0 0 1.3.5 3.1 3.1 0 0 0 1.4.1 2.3 2.3 0 0 0 1.5-1.1 1.9 1.9 0 0 0 .1-1.1c-.1-.1-.3-.2-.6-.3z" />
        </svg>
        WhatsApp
      </a>}
    </div>
  );
}
