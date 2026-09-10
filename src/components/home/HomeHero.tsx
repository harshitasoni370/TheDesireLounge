"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroAnimate } from "@/components/common/HeroAnimate";
import { MAPS_URL, MENU_URL } from "@/lib/site";

const SLIDES = [
  "/images/index-hero-bg.webp",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1800&q=80",
];

const SLIDE_INTERVAL = 6500;

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  const restart = useCallback(() => {
    if (reducedRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restart]);

  function goTo(next: number) {
    setIndex((next + SLIDES.length) % SLIDES.length);
    restart();
  }

  return (
    <section className="home-hero" id="hero" aria-labelledby="hero-heading">
      <div className="home-hero__slides" id="hero-slides" aria-hidden="true">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`home-hero__slide${i === 0 ? " home-hero__slide--primary" : ""}${i === index ? " is-active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
            role="img"
            aria-label={i === 0 ? "Desire Sheesha Lounge dining with shisha and gourmet platters" : undefined}
          />
        ))}
      </div>
      <div className="home-hero__overlay" aria-hidden="true" />

      <div className="home-hero__frame">
        <button type="button" className="home-hero__arrow home-hero__arrow--prev" aria-label="Previous slide" onClick={() => goTo(index - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" className="home-hero__arrow home-hero__arrow--next" aria-label="Next slide" onClick={() => goTo(index + 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <HeroAnimate className="home-hero__content">
          <h1 id="hero-heading" className="home-hero__brand hero-anim">
            DESIRE
            <br />
            <span className="home-hero__subbrand">SHEESHA LOUNGE</span>
          </h1>
          <p className="home-hero__tagline hero-anim">
            Eat. Chill. Play. <em>24/7</em>
          </p>
          <ul className="home-hero__chips hero-anim" aria-label="Venue highlights">
            <li>Premium Lounge</li>
            <li>Multi-Cuisine Food</li>
            <li>Live Sports</li>
            <li>Gaming Zone</li>
          </ul>
          <p className="home-hero__location hero-anim">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Oud Metha, Dubai
          </p>
          <div className="home-hero__ctas hero-anim">
            <a href="#reserve" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Reserve a Table
            </a>
            <a href={MENU_URL} className="btn btn-ghost">
              View Menu
            </a>
            <a href={MAPS_URL} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              Get Directions
            </a>
          </div>
        </HeroAnimate>
      </div>

      <div className="home-hero__dots" id="hero-dots" role="tablist" aria-label="Hero slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`home-hero__dot${i === index ? " is-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
