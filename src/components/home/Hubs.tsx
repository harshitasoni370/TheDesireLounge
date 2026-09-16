import Link from "next/link";

export function Hubs() {
  return (
    <section className="home-hubs" aria-label="Live sports, offers and gaming">
      <div className="home-container home-hubs__grid">
        <article className="home-hub" id="live-sports">
          <div className="home-hub__media" style={{ ["--hub-img" as string]: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80')" }} />
          <div className="home-hub__body">
            <h2 className="home-hub__title">Live Sports</h2>
            <p className="home-hub__copy">Catch all the action on our big screens with the best vibes.</p>
            <ul className="home-hub__list">
              <li>
                <span className="home-hub__badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                </span>
                <div>
                  <strong>India vs Australia</strong>
                  <span>Today · 8:00 PM</span>
                </div>
              </li>
              <li>
                <span className="home-hub__badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l2.5 1.5" />
                  </svg>
                </span>
                <div>
                  <strong>Real Madrid vs Barcelona</strong>
                  <span>Today · 11:00 PM</span>
                </div>
              </li>
            </ul>
            <Link href="/live-sports" className="home-link">
              View All Matches →
            </Link>
          </div>
        </article>

        <article className="home-hub" id="events">
          <div className="home-hub__body">
            <h2 className="home-hub__title">Offers &amp; Events</h2>
            <p className="home-hub__copy">Exciting offers, special nights and events you don&rsquo;t want to miss.</p>
            <div className="home-hub__tags">
              <span>Ladies Night</span>
              <span>Sunday Brunch</span>
              <span>Match Night</span>
              <span>Late Night Offers</span>
            </div>
            <Link href="/events" className="home-link">
              View All Events →
            </Link>
          </div>
        </article>

        <article className="home-hub home-hub--gaming" id="gaming-zone">
          <div className="home-hub__media" style={{ ["--hub-img" as string]: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80')" }} />
          <div className="home-hub__body">
            <h2 className="home-hub__title">Gaming Zone</h2>
            <p className="home-hub__copy">Play, compete and hang with friends in our premium gaming zone.</p>
            <ul className="home-hub__features">
              <li>PS5 &amp; Latest Games</li>
              <li>Big Screen Experience</li>
              <li>Group Play &amp; Tournaments</li>
            </ul>
            <a href="/playstation" className="home-link">
              Explore Gaming →
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
