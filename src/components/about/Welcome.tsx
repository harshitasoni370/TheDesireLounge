"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

const STATS = [
  {
    value: "2 Lakh+",
    label: "Guests Served",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "250+",
    label: "Veg & Non-Veg Items",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 13c0 3.5 2.5 6 6 6s6-2.5 6-6V8H6v5z" />
        <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <path d="M10 4v2M14 4v2" />
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Signature Mocktails",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 21h8M12 17v4M7 3v4a5 5 0 0 0 10 0V3" />
        <path d="M7 3h10" />
      </svg>
    ),
  },
  {
    value: "100+",
    label: "Premium Shisha Flavours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3c2.5 2 4 4.5 4 7.5a4 4 0 1 1-8 0C8 7.5 9.5 5 12 3z" />
        <path d="M8 18h8M9 21h6M12 14v4" />
      </svg>
    ),
  },
];

export function Welcome() {
  const site = useSiteConfig();

  return (
    <section className="about-welcome" id="welcome" aria-labelledby="welcome-heading">
      <div className="home-container about-welcome__grid">
        <figure className="about-welcome__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80"
            alt="Night-time exterior entrance of the lounge with warm lighting"
            width={720}
            height={960}
            loading="lazy"
          />
        </figure>

        <div className="about-welcome__content">
          <p className="about-welcome__eyebrow text-script">Welcome to —</p>
          <h2 id="welcome-heading" className="home-heading home-heading--split">
            <span className="text-gold">{site.siteName}</span>
          </h2>
          {site.address && <p className="home-copy">{site.siteName} is located at {site.address}.</p>}
          <p className="home-copy">
            Visit {site.siteName} to enjoy a welcoming place to meet, celebrate and unwind.
          </p>

          <ul className="about-stats" aria-label="Venue highlights">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="about-stats__icon" aria-hidden="true">
                  {stat.icon}
                </span>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
