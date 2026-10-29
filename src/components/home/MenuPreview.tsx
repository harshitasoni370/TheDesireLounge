"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getDomainUrl } from "@/lib/site-config";

const MENU_CARDS = [
  { img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80", alt: "Indian favourites platter", label: "Indian Favourites" },
  { img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80", alt: "Chaat and street food", label: "Chaat & Street Food" },
  { img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80", alt: "Indo Chinese noodles", label: "Indo Chinese" },
  { img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", alt: "Hyderabadi biryani", label: "Biryani" },
  { img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", alt: "Signature mocktails", label: "Mocktails" },
  { img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", alt: "Chocolate dessert cake", label: "Desserts" },
];

export function MenuPreview() {
  const appUrl = getDomainUrl(useSiteConfig(), "APP");

  return (
    <section className="home-menu" id="menu" aria-labelledby="menu-heading">
      <div className="home-container">
        <div className="home-menu__head">
          <div>
            <h2 id="menu-heading" className="home-heading home-heading--split">
              Explore Our
              <br />
              <span className="text-gold">Menu</span>
            </h2>
            <p className="home-copy">From flavorful Indian favourites to refreshing mocktails, we have something for every mood and every moment.</p>
          </div>
          {appUrl && <a href={`${appUrl}/categories`} className="btn btn-outline home-menu__all">View Full Menu</a>}
        </div>

        {appUrl && <div className="home-menu__grid">
          {MENU_CARDS.map((card) => (
            <a href={`${appUrl}/categories`} className="home-menu__card" key={card.label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.img} alt={card.alt} loading="lazy" width={280} height={200} />
              <span>{card.label}</span>
            </a>
          ))}
        </div>}
      </div>
    </section>
  );
}
