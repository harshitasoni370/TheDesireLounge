import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { EventsSchedule } from "@/components/events/EventsSchedule";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse current and upcoming events and reserve your place.",
  alternates: { canonical: "/events" },
};

function EventsContent() {
  return (
    <main id="main">
      <PageHero
        id="events-hero"
        className="sports-hero events-hero"
        bgImage="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1800&q=80"
        bgAlt="Lounge night atmosphere with warm lights for upcoming events"
        title="Events"
        script="Nights Worth Showing Up For."
        copy="Browse scheduled events and find the details for your next visit."
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
            booking: { category: "EVENT", reservationCategory: "EVENT" },
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
        text="Check the latest event schedule and reserve a table for your next visit."
        script="Eat. Chill. Celebrate."
        ctaLabel="Reserve a Table"
        ctaHref="/#reserve"
        booking={{ category: "EVENT", reservationCategory: "EVENT" }}
      />
    </main>
  );
}

export default function EventsPage() {
  return <Suspense fallback={<main id="main" aria-busy="true" />}><EventsContent /></Suspense>;
}
