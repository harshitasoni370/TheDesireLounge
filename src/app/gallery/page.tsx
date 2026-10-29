import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from the restaurant.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main id="main">
      <PageHero
        id="gallery-hero"
        bgImage="/images/index-hero-bg.webp"
        bgAlt="Lounge table with shisha, mocktail and candlelight"
        title="Gallery"
        script="Every Corner Tells a Story"
        copy="Explore photos and videos from the restaurant."
        ctas={[
          {
            label: "Explore Photos",
            href: "#gallery-grid",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          {
            label: "Watch Videos",
            href: "#gallery-grid-videos",
            variant: "ghost",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ),
          },
        ]}
      />
      <GalleryGrid />
      <CtaBanner
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        }
        title="Memories Made Here"
        text="Great food, good vibes and unforgettable times."
        script="Capture. Share. Cherish."
        ctaLabel="Visit Us & Make Memories"
        ctaHref="/#reserve"
      />
    </main>
  );
}
