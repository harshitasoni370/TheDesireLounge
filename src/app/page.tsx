import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { MenuPreview } from "@/components/home/MenuPreview";
import { Hubs } from "@/components/home/Hubs";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { Reviews } from "@/components/home/Reviews";
import { ReserveForm } from "@/components/home/ReserveForm";

export const metadata: Metadata = {
  title: "DESIRE SHEESHA LOUNGE | Eat. Chill. Play. 24/7 — Oud Metha, Dubai",
  alternates: { canonical: "/" },
};

const HIGHLIGHTS = [
  {
    title: "Open 24/7",
    subtitle: "Always Open for You",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Premium Lounge",
    subtitle: "Relax & Unwind",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 21h18M5 21V10l7-5 7 5v11" />
      </svg>
    ),
  },
  {
    title: "Delicious Food",
    subtitle: "Indian · Chinese · Street Food",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19h16M6 16V9l6-4 6 4v7" />
      </svg>
    ),
  },
  {
    title: "Live Sports",
    subtitle: "All Major Matches",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 5h16v11H4zM8 21h8M12 16v5" />
      </svg>
    ),
  },
  {
    title: "Gaming Zone",
    subtitle: "PS5 · Big Screen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main id="main">
      <HomeHero />
      <HighlightsStrip items={HIGHLIGHTS} ariaLabel="Venue highlights" />
      <MenuPreview />
      <Hubs />
      <GalleryTeaser />
      <Reviews />
      <section className="home-reserve" id="reserve" aria-labelledby="reserve-heading">
        <div className="home-container">
          <ReserveForm />
        </div>
      </section>
    </main>
  );
}
