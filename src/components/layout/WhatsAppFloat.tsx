"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getWhatsAppHref } from "@/lib/site-config";

export function WhatsAppFloat() {
  const whatsappHref = getWhatsAppHref(useSiteConfig());

  return (
    whatsappHref && <a
      className="home-whatsapp home-whatsapp--desktop"
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp — Book instantly"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 3.2 17.7L2 22l4.4-1.2A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.7.7-2.5-.2-.3a9 9 0 1 1 7 3.6zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a2.4 2.4 0 0 0-.8 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.4 12 12 0 0 0 1.3.5 3.1 3.1 0 0 0 1.4.1 2.3 2.3 0 0 0 1.5-1.1 1.9 1.9 0 0 0 .1-1.1c-.1-.1-.3-.2-.6-.3z" />
      </svg>
      <span className="home-whatsapp__copy">
        <strong>Book instantly</strong>
        <small>Chat on WhatsApp</small>
      </span>
    </a>
  );
}
