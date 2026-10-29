"use client";

import Link from "next/link";
import { BookingLink } from "@/components/booking/BookingLink";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getBookingCheckoutUrl, type BookingOptions } from "@/lib/booking";

export function CtaBanner({
  icon,
  title,
  text,
  script,
  ctaLabel,
  ctaHref,
  className,
  booking,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  script: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
  booking?: BookingOptions;
}) {
  const site = useSiteConfig();
  const bookingUrl = ctaHref === "/#reserve" ? getBookingCheckoutUrl(site, booking) : "";

  return (
    <section className={`gallery-cta${className ? ` ${className}` : ""}`} aria-labelledby="cta-heading">
      <div className="home-container gallery-cta__inner">
        <div className="gallery-cta__copy">
          <div className="gallery-cta__icon" aria-hidden="true">
            {icon}
          </div>
          <div>
            <h2 id="cta-heading" className="gallery-cta__title">
              {title}
            </h2>
            <p className="gallery-cta__text">{text}</p>
            <p className="gallery-cta__script text-script">{script}</p>
          </div>
        </div>
        {bookingUrl ? (
          <BookingLink href={bookingUrl} className="btn btn-primary gallery-cta__btn">
            {ctaLabel}
          </BookingLink>
        ) : ctaHref === "/#reserve" ? (
          <span className="btn btn-primary gallery-cta__btn" aria-disabled="true">
            {ctaLabel}
          </span>
        ) : ctaHref.startsWith("/") ? (
          <Link href={ctaHref} className="btn btn-primary gallery-cta__btn">
            {ctaLabel}
          </Link>
        ) : (
          <a href={ctaHref} className="btn btn-primary gallery-cta__btn">
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
