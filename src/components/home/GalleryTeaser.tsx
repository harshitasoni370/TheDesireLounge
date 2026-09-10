import Link from "next/link";

const TEASER_IMAGES = [
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80", alt: "Lounge dining with live sports screens" },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80", alt: "Premium lounge seating at Desire Sheesha Lounge" },
  { src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80", alt: "Desire Sheesha Lounge neon sign in lounge" },
  { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80", alt: "Signature mocktail on the table" },
];

export function GalleryTeaser() {
  return (
    <section className="home-gallery-teaser" id="gallery" aria-labelledby="gallery-heading">
      <div className="home-container">
        <div className="home-menu__head">
          <div>
            <h2 id="gallery-heading" className="home-heading home-heading--split">
              The Desire
              <br />
              <span className="text-gold">Experience</span>
            </h2>
            <p className="home-copy">Ambience, food, shisha and nights worth remembering.</p>
          </div>
        </div>
        <div className="home-gallery-teaser__grid">
          {TEASER_IMAGES.map((img) => (
            <figure key={img.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" width={480} height={320} />
            </figure>
          ))}
        </div>
        <Link href="/gallery" className="btn btn-outline home-gallery-teaser__cta">
          Explore Full Gallery
        </Link>
      </div>
    </section>
  );
}
