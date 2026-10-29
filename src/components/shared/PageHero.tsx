"use client";

import { HeroAnimate } from "@/components/common/HeroAnimate";
import { BookingLink } from "@/components/booking/BookingLink";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getBookingCheckoutUrl, type BookingOptions } from "@/lib/booking";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
  booking?: BookingOptions;
}

export function PageHero({
  id,
  className,
  bgImage,
  bgAlt,
  title,
  script,
  copy,
  ctas,
}: {
  id: string;
  className?: string;
  bgImage: string;
  bgAlt: string;
  title: string;
  script: string;
  copy: string;
  ctas: HeroCta[];
}) {
  const site = useSiteConfig();

  return (
    <section className={`gallery-hero${className ? ` ${className}` : ""}`} id={id} aria-labelledby={`${id}-heading`}>
      <div className="gallery-hero__bg" style={{ backgroundImage: `url('${bgImage}')` }} role="img" aria-label={bgAlt} />
      <div className="gallery-hero__overlay" aria-hidden="true" />

      <HeroAnimate className="gallery-hero__content home-container">
        <h1 id={`${id}-heading`} className="gallery-hero__title hero-anim">
          {title}
        </h1>
        <p className="gallery-hero__script hero-anim text-script">{script}</p>
        <p className="gallery-hero__copy hero-anim">{copy}</p>
        <div className="gallery-hero__ctas hero-anim">
          {ctas.map((cta) => {
            const href = cta.booking || cta.href === "/#reserve"
              ? getBookingCheckoutUrl(site, cta.booking)
              : cta.href;
            const className = `btn ${cta.variant === "ghost" ? "btn-ghost gallery-hero__book" : "btn-primary"}`;

            return href && (cta.booking || cta.href === "/#reserve") ? (
              <BookingLink key={cta.label} href={href} className={className}>
                {cta.icon}
                {cta.label}
              </BookingLink>
            ) : href ? (
              <a key={cta.label} href={href} className={className}>
                {cta.icon}
                {cta.label}
              </a>
            ) : (
              <span key={cta.label} className={className} aria-disabled="true">
                {cta.icon}
                {cta.label}
              </span>
            );
          })}
        </div>
      </HeroAnimate>
    </section>
  );
}
