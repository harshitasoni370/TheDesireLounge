"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { RESTAURANT_ASSET_BASE_URL } from "@/lib/site";
import { getPhoneDisplay, getPhoneHref, getWhatsAppHref } from "@/lib/site-config";

type CateringMedia = {
  kind: "image" | "video";
  src: string;
  alt: string;
  number: number;
};

const CATERING_PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21].map(
  (number): CateringMedia => ({
    kind: "image",
    src: `${RESTAURANT_ASSET_BASE_URL}/Assets/DES/Image/Catering/${number}.jpeg`,
    alt: `Catering spread by Desire Sheesha Lounge, Dubai — photo ${number > 17 ? number - 2 : number}`,
    number,
  }),
);

const CATERING_VIDEOS = [18, 19].map(
  (number): CateringMedia => ({
    kind: "video",
    src: `${RESTAURANT_ASSET_BASE_URL}/Assets/DES/Image/Catering/${number}.mp4`,
    alt: `Catering video ${number - 17} — Desire Sheesha Lounge, Dubai`,
    number,
  }),
);

const ALL_MEDIA = [...CATERING_PHOTOS, ...CATERING_VIDEOS];
const CATERING_MESSAGE = "Hi Desire Lounge, I'd like to enquire about catering.";

const SERVICES = [
  {
    title: "Corporate Events",
    text: "Office lunches, meetings and team gatherings — neatly packed and on time.",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
      </>
    ),
  },
  {
    title: "Parties & Birthdays",
    text: "Platters, starters and desserts that keep every table full and every guest happy.",
    icon: (
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />
    ),
  },
  {
    title: "Private Celebrations",
    text: "Family dinners, engagements and intimate get-togethers, planned around your guest list.",
    icon: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    ),
  },
  {
    title: "Multi-Cuisine Menus",
    text: "Indian favourites, Indo-Chinese, biryani and more — mix and match to suit your crowd.",
    icon: (
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    ),
  },
];

export function CateringContent() {
  const site = useSiteConfig();
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const activeMedia = activeMediaIndex === null ? null : ALL_MEDIA[activeMediaIndex];
  const phoneHref = getPhoneHref(site) || "tel:+971509002202";
  const phoneDisplay = getPhoneDisplay(site) || "+971 50 900 2202";
  const whatsappUrl = `${getWhatsAppHref(site) || "https://wa.me/971509002202"}?text=${encodeURIComponent(CATERING_MESSAGE)}`;

  useEffect(() => {
    if (activeMediaIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMediaIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveMediaIndex((index) => (index === null ? null : (index - 1 + ALL_MEDIA.length) % ALL_MEDIA.length));
      }
      if (event.key === "ArrowRight") {
        setActiveMediaIndex((index) => (index === null ? null : (index + 1) % ALL_MEDIA.length));
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMediaIndex]);

  useEffect(() => {
    if (activeMediaIndex === null) {
      lastTrigger.current?.focus();
      lastTrigger.current = null;
    }
  }, [activeMediaIndex]);

  return (
    <main id="main" className="catering-page">
      <section className="gallery-hero catering-hero" id="catering-hero" aria-labelledby="catering-hero-heading">
        <div
          className="gallery-hero__bg"
          style={{ backgroundImage: "url('/images/index-hero-bg.webp')" }}
          role="img"
          aria-label="Lounge table with shisha, mocktail and candlelight at Desire Sheesha Lounge"
        />
        <div className="gallery-hero__overlay" aria-hidden="true" />
        <div className="gallery-hero__content home-container">
          <p className="home-kicker hero-anim">Oud Metha, Dubai</p>
          <h1 id="catering-hero-heading" className="gallery-hero__title hero-anim">
            Catering
          </h1>
          <p className="gallery-hero__script hero-anim text-script">Flavours for Every Celebration</p>
          <p className="gallery-hero__copy hero-anim">
            Bring the Desire Sheesha Lounge kitchen to your event. Freshly prepared multi-cuisine platters and spreads,
            made for parties, offices and private occasions.
          </p>
          <div className="gallery-hero__ctas hero-anim">
            <a href={whatsappUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Enquire on WhatsApp
            </a>
            <a href="#catering-gallery" className="btn btn-ghost gallery-hero__book">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              View Our Spreads
            </a>
          </div>
        </div>
      </section>

      <section className="catering-services" aria-labelledby="catering-services-heading">
        <div className="home-container">
          <div className="catering-heading">
            <p className="home-kicker">What We Cater</p>
            <h2 id="catering-services-heading" className="catering-heading__title">
              Made Fresh. Served Your Way.
            </h2>
            <div className="home-divider home-divider--center" aria-hidden="true" />
          </div>
          <ul className="catering-services__grid">
            {SERVICES.map((service) => (
              <li className="catering-service" key={service.title}>
                <span className="catering-service__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    {service.icon}
                  </svg>
                </span>
                <h3 className="catering-service__title">{service.title}</h3>
                <p className="catering-service__text">{service.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="catering-gallery" id="catering-gallery" aria-labelledby="catering-gallery-heading">
        <div className="home-container">
          <div className="catering-heading">
            <p className="home-kicker">Catering Gallery</p>
            <h2 id="catering-gallery-heading" className="catering-heading__title">
              A Taste of What We Serve
            </h2>
            <p className="catering-heading__sub text-script">Every platter, plated with care</p>
            <p className="catering-heading__meta">19 photos · 2 videos · tap any image to enlarge</p>
          </div>
          <div className="catering-grid" id="catering-grid">
            {CATERING_PHOTOS.map((photo, index) => {
              const photoNumber = index + 1;
              return (
                <figure
                  className={`catering-tile${index === 0 ? " catering-tile--feature" : ""}${
                    photo.number === 7 || photo.number === 14 ? " catering-tile--wide" : ""
                  }`}
                  key={photo.src}
                >
                  <button
                    type="button"
                    className="catering-tile__trigger"
                    aria-label={`View photo ${photoNumber} of 19`}
                    onClick={(event) => {
                      lastTrigger.current = event.currentTarget;
                      setActiveMediaIndex(index);
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      unoptimized
                      priority={index < 4}
                    />
                    <span className="catering-tile__zoom" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                      </svg>
                    </span>
                  </button>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="catering-videos" id="catering-videos" aria-labelledby="catering-videos-heading">
        <div className="home-container">
          <div className="catering-heading">
            <p className="home-kicker">In Motion</p>
            <h2 id="catering-videos-heading" className="catering-heading__title">
              Catering Videos
            </h2>
            <div className="home-divider home-divider--center" aria-hidden="true" />
          </div>
          <div className="catering-videos__grid">
            {CATERING_VIDEOS.map((video, index) => (
              <figure className="catering-tile catering-tile--video" key={video.src}>
                <button
                  type="button"
                  className="catering-tile__trigger"
                  aria-label={`Play catering video ${index + 1}`}
                  onClick={(event) => {
                    lastTrigger.current = event.currentTarget;
                    setActiveMediaIndex(CATERING_PHOTOS.length + index);
                  }}
                >
                  <video
                    className="catering-tile__media"
                    src={`${video.src}#t=0.6`}
                    poster="/images/index-hero-bg.webp"
                    preload="metadata"
                    muted
                    playsInline
                    aria-hidden="true"
                  />
                  <span className="catering-tile__play" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8 5 20 12 8 19 8 5" />
                    </svg>
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-cta catering-cta" aria-labelledby="catering-cta-heading">
        <div className="home-container gallery-cta__inner">
          <div className="gallery-cta__copy">
            <div className="gallery-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
              </svg>
            </div>
            <div>
              <h2 id="catering-cta-heading" className="gallery-cta__title">
                Planning an Event?
              </h2>
              <p className="gallery-cta__text">
                Tell us your date, guest count and cuisine preferences — we’ll take care of the rest.
              </p>
              <p className="gallery-cta__script text-script">Let’s cater your celebration</p>
            </div>
          </div>
          <div className="catering-cta__actions">
            <a href={whatsappUrl} className="btn btn-primary gallery-cta__btn" target="_blank" rel="noopener noreferrer">
              WhatsApp Us
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a href={phoneHref} className="btn btn-ghost gallery-cta__btn">
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {activeMedia && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Catering gallery viewer">
          <div className="gallery-lightbox__backdrop" onClick={() => setActiveMediaIndex(null)} />
          <button
            type="button"
            className="gallery-lightbox__close"
            aria-label="Close gallery viewer"
            onClick={() => setActiveMediaIndex(null)}
          >
            ×
          </button>
          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--prev"
            aria-label="Previous item"
            onClick={() =>
              setActiveMediaIndex((index) => (index === null ? null : (index - 1 + ALL_MEDIA.length) % ALL_MEDIA.length))
            }
          >
            ‹
          </button>
          <figure className="gallery-lightbox__figure">
            {activeMedia.kind === "image" ? (
              <Image src={activeMedia.src} alt={activeMedia.alt} width={1440} height={1080} unoptimized />
            ) : (
              <video src={activeMedia.src} controls autoPlay playsInline />
            )}
            <figcaption className="gallery-lightbox__caption">{activeMedia.alt}</figcaption>
          </figure>
          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--next"
            aria-label="Next item"
            onClick={() => setActiveMediaIndex((index) => (index === null ? null : (index + 1) % ALL_MEDIA.length))}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
