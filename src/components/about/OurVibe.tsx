const VIBE_LIST = [
  {
    title: "Open 24 Hours",
    text: "Day or night — we're always here for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Perfect for Every Occasion",
    text: "Hangouts, celebrations, date nights or solo chill.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Quality You Can Taste",
    text: "Premium ingredients. Consistent excellence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
      </svg>
    ),
  },
  {
    title: "Hospitality That Feels Like Family",
    text: "Warm service that makes you feel at home.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
];

export function OurVibe() {
  return (
    <section className="about-vibe" id="our-vibe" aria-labelledby="vibe-heading">
      <div className="home-container about-vibe__grid">
        <div className="about-vibe__gallery">
          <figure className="about-vibe__main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80"
              alt="Bar and lounge counter with ambient lighting at Desire Sheesha Lounge"
              width={720}
              height={540}
              loading="lazy"
            />
          </figure>
          <figure className="about-vibe__side">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=80" alt="Lounge seating with soft lighting" width={480} height={300} loading="lazy" />
          </figure>
          <figure className="about-vibe__side">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=700&q=80" alt="Neon lounge ambience inside Desire Sheesha Lounge" width={480} height={300} loading="lazy" />
          </figure>
        </div>

        <div className="about-vibe__content">
          <p className="home-kicker">The Ambience</p>
          <h2 id="vibe-heading" className="home-heading">
            Our Vibe
          </h2>
          <p className="home-copy">
            Soft lights. Smooth music. Warm conversations. Desire Sheesha Lounge is designed to feel like your favourite spot in the city —
            familiar, lively and always welcoming.
          </p>

          <ul className="about-vibe__list">
            {VIBE_LIST.map((item) => (
              <li key={item.title}>
                <span className="home-about__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
