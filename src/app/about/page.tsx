import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { Welcome } from "@/components/about/Welcome";
import { WhatMakesUsSpecial } from "@/components/about/WhatMakesUsSpecial";
import { OurVibe } from "@/components/about/OurVibe";
import { AboutClosing } from "@/components/about/AboutClosing";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about this restaurant and its offerings.",
  alternates: { canonical: "/about" },
};

const HIGHLIGHTS = [
  {
    title: "Premium Shisha",
    subtitle: "100+ Flavours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3c2.5 2 4 4.5 4 7.5a4 4 0 1 1-8 0C8 7.5 9.5 5 12 3z" />
        <path d="M8 18h8M9 21h6M12 14v4" />
      </svg>
    ),
  },
  {
    title: "Exquisite Cuisine",
    subtitle: "Indian & Continental",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 12h16l-1.5 8H5.5L4 12z" />
        <path d="M8 12V7a4 4 0 0 1 8 0v5" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    title: "Signature Mocktails",
    subtitle: "50+ Crafted Drinks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 21h8M12 17v4M7 3v4a5 5 0 0 0 10 0V3" />
        <path d="M7 3h10" />
      </svg>
    ),
  },
  {
    title: "Great Vibes Always",
    subtitle: "Open 24/7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        id="about-hero"
        className="about-hero"
        bgImage="/images/index-hero-bg.webp"
        bgAlt="Warm pendant lights over a premium lounge interior"
        title="About Us"
        script="Our Story"
        copy="Discover the people, food and experiences that make this restaurant special."
        ctas={[
          {
            label: "Our Story",
            href: "#welcome",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            ),
          },
          {
            label: "Reserve a Table",
            href: "/#reserve",
            variant: "ghost",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            ),
          },
        ]}
      />
      <HighlightsStrip items={HIGHLIGHTS} ariaLabel="What we offer" />
      <Welcome />
      <WhatMakesUsSpecial />
      <OurVibe />
      <AboutClosing />
      <CtaBanner
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
          </svg>
        }
        title="Come Experience It Yourself"
        text="We look forward to welcoming you."
        script="Your table is waiting."
        ctaLabel="Reserve a Table"
        ctaHref="/#reserve"
      />
    </main>
  );
}
