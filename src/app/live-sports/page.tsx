import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { SportsSchedule } from "@/components/live-sports/SportsSchedule";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "Live Sports",
  description:
    "Live Sports at DESIRE SHEESHA LOUNGE — football and cricket fixtures screened on big screens in Oud Metha, Dubai.",
  alternates: { canonical: "/live-sports" },
};

const HIGHLIGHTS = [
  {
    title: "Big Screens",
    subtitle: "Immersive match viewing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 19v2" />
      </svg>
    ),
  },
  {
    title: "Football",
    subtitle: "UEFA · Leagues · Finals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
      </svg>
    ),
  },
  {
    title: "Cricket",
    subtitle: "Tests · ODIs · T20Is",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l2.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Open 24/7",
    subtitle: "Late kick-offs welcome",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

function LiveSportsContent() {
  return (
    <main id="main">
      <PageHero
        id="sports-hero"
        className="sports-hero"
        bgImage="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&q=80"
        bgAlt="Football stadium lights and crowd atmosphere for live sports night"
        title="Live Sports"
        script="Every Match. Big Screens. Better Vibes."
        copy="Football and cricket fixtures screened live at Desire Sheesha Lounge — grab a table, order your favourites, and catch the action in Oud Metha."
        ctas={[
          {
            label: "View Fixtures",
            href: "#sports-schedule",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
              </svg>
            ),
          },
          {
            label: "Reserve for Match Night",
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
      <HighlightsStrip items={HIGHLIGHTS} ariaLabel="Sports lounge highlights" />
      <SportsSchedule />
      <CtaBanner
        className="sports-cta"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" />
          </svg>
        }
        title="Make it a Match Night"
        text="Reserve a table for kick-off and catch every moment on our big screens."
        script="Eat. Chill. Cheer."
        ctaLabel="Reserve a Table"
        ctaHref="/#reserve"
      />
    </main>
  );
}

export default function LiveSportsPage() {
  return <Suspense fallback={<main id="main" aria-busy="true" /> }><LiveSportsContent /></Suspense>;
}
