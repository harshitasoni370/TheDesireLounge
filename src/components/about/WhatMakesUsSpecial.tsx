const CARDS = [
  { img: "/images/hero.webp", alt: "Premium shisha setup ready to serve", title: "100+ Premium Shisha Flavours", text: "From classic to exotic blends — curated to perfection for every mood." },
  {
    img: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80",
    alt: "Grilled kebabs and premium Indian cuisine platter",
    title: "Premium Indian & Continental Cuisine",
    text: "Authentic flavours crafted with passion, served with style.",
  },
  {
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    alt: "Live sports screening on large screens in the lounge",
    title: "Live Sports on Large Screens",
    text: "Never miss a match — football, cricket and more on big screens.",
  },
  {
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    alt: "Dedicated gaming zone with glowing neon setups",
    title: "Dedicated Gaming Zone",
    text: "PS5, FIFA and more — play, compete and chill with friends.",
  },
  {
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
    alt: "Stylish indoor dining and lounge seating area",
    title: "Indoor & Outdoor Seating",
    text: "Choose your vibe — cozy interiors or open-air ambience.",
  },
];

export function WhatMakesUsSpecial() {
  return (
    <section className="about-special" id="what-makes-us-special" aria-labelledby="special-heading">
      <div className="home-container">
        <div className="home-section-head">
          <p className="home-kicker home-kicker--decorated">Why Guests Love Us</p>
          <h2 id="special-heading" className="home-heading">
            What Makes Us Special
          </h2>
        </div>

        <div className="about-special__grid">
          {CARDS.map((card) => (
            <article className="about-special__card" key={card.title}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.alt} width={480} height={300} loading="lazy" />
              </figure>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
