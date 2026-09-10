import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { EventsSchedule } from "@/components/events/EventsSchedule";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Events at DESIRE SHEESHA LOUNGE — Sufi Night and Live Music Night, free-entry performances from 10 PM in Oud Metha, Dubai.",
  alternates: { canonical: "/events" },
};

const HIGHLIGHTS = [
  {
    title: "Sufi Night",
    subtitle: "Wagashaider · Fri 14 Aug",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Live Music Night",
    subtitle: "Saffi Zulfiqar · Sun 16 Aug",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Entry Free",
    subtitle: "Everyone welcome",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2l2.5 7h7l-5.5 4.2 2.1 6.8L12 16.5 5.9 20l2.1-6.8L2.5 9h7L12 2z" />
      </svg>
    ),
  },
  {
    title: "From 10 PM",
    subtitle: "Lounge nights · 24/7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

export default function EventsPage() {
  return (
    <main id="main">
      <PageHero
        id="events-hero"
        className="sports-hero events-hero"
        bgImage="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1800&q=80"
        bgAlt="Lounge night atmosphere with warm lights for upcoming events"
        title="Events"
        script="Nights Worth Showing Up For."
        copy="Sufi Night and Live Music Night this August — free-entry performances from 10 PM at Desire Sheesha Lounge in Oud Metha."
        ctas={[
          {
            label: "View Events",
            href: "#events-schedule",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
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
      <HighlightsStrip items={HIGHLIGHTS} ariaLabel="Event highlights" />
      <EventsSchedule />
      <CtaBanner
        className="sports-cta"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        }
        title="Save Your Spot"
        text="Reserve a table for Sufi Night or Live Music Night — free entry from 10 PM."
        script="Eat. Chill. Celebrate."
        ctaLabel="Reserve a Table"
        ctaHref="/#reserve"
      />
    </main>
  );
}
