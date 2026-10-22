const REVIEWS = [
  { initial: "A", name: "Aman Verma", date: "2 days ago", text: "Amazing place to chill with friends. Great food, great ambience and super friendly staff!" },
  { initial: "R", name: "Riya Sharma", date: "1 week ago", text: "The food is delicious and the sports vibe is just awesome. Our go-to place in Oud Metha!" },
  { initial: "Z", name: "Zaid Khan", date: "2 weeks ago", text: "Open 24/7 is a game changer! Perfect late-night hangout spot in Oud Metha." },
];

export function Reviews() {
  return (
    <section className="home-reviews" id="testimonials" aria-labelledby="reviews-heading">
      <div className="home-container home-reviews__layout">
        <aside className="home-reviews__summary" aria-label="Google rating summary">
          <h2 id="reviews-heading" className="home-heading home-heading--split">
            Loved by
            <br />
            <span className="text-gold">Our Guests</span>
          </h2>
          <div className="home-reviews__score">
            <strong>4.5</strong>
            <div>
              <div className="home-reviews__stars" aria-label="4.5 out of 5 stars">
                ★★★★★
              </div>
              <span>183+ Reviews</span>
            </div>
          </div>
          <p className="home-copy">4.5 Google Rating</p>
        </aside>

        <div className="home-reviews__cards">
          {REVIEWS.map((review) => (
            <article className="home-google-card" key={review.name}>
              <header className="home-google-card__head">
                <span className="home-google-card__avatar" aria-hidden="true">
                  {review.initial}
                </span>
                <div className="home-google-card__id">
                  <cite>{review.name}</cite>
                  <span className="home-google-card__date">{review.date}</span>
                </div>
                <span className="home-google-card__badge" aria-label="Posted on Google">
                  G
                </span>
              </header>
              <div className="home-google-card__stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
