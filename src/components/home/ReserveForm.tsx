"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { BookingLink } from "@/components/booking/BookingLink";
import { getBookingCheckoutUrl } from "@/lib/booking";
import { getPhoneDisplay, getPhoneHref } from "@/lib/site-config";

const CATEGORY_LABELS: Record<string, string> = {
  TABLE_RESERVATION: "Table Reservation",
  EVENT: "Event",
  LIVE_SPORTS: "Live Sports",
  GAMING: "Gaming",
  BOARD_GAME: "Board Game",
  EXCLUSIVE_OFFER: "Exclusive Offer",
  BIRTHDAY: "Birthday",
  CORPORATE: "Corporate",
  CUSTOM_MOMENT: "Custom Moment",
};

export function ReserveForm() {
  const site = useSiteConfig();
  const categoryLabel = CATEGORY_LABELS.TABLE_RESERVATION;
  const bookingUrl = getBookingCheckoutUrl(site);

  return (
    <div className="home-reserve__panel">
      <div className="home-reserve__grid">
        <div className="home-reserve__intro">
          <div className="home-reserve__intro-top">
            <p className="home-kicker home-kicker--line-right">
              Book Your Experience<span className="home-kicker__line" aria-hidden="true" />
            </p>
            <h2 id="reserve-heading" className="home-heading home-heading--split">
              <span className="text-gold">{categoryLabel}</span>
            </h2>
            <div className="home-divider" aria-hidden="true" />
            <p className="home-copy">
              Whether it&rsquo;s a casual hangout, match night or a late-night chill session — we&rsquo;ve got the perfect
              table waiting for you.
            </p>
          </div>

          <ul className="home-reserve__perks" aria-label="Reservation highlights">
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div><strong>Open 24/7</strong><span>Book any time — day or night</span></div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 5h16v11H4zM8 21h8M12 16v5" />
                </svg>
              </span>
              <div><strong>Live Sports</strong><span>Big screens for every match</span></div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
                </svg>
              </span>
              <div><strong>Gaming Zone</strong><span>Play after you dine</span></div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <div><strong>Quick Confirmation</strong><span>We confirm on WhatsApp</span></div>
            </li>
          </ul>

          <div className="home-reserve__intro-meta">
            {getPhoneHref(site) && (
              <a href={getPhoneHref(site)} className="home-reserve__meta-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{getPhoneDisplay(site)}</span>
              </a>
            )}
            {site.address && <span className="home-reserve__meta-loc">{site.address}</span>}
          </div>
        </div>

        <div className="home-reserve__form">
          <div className="home-reserve__checkout">
            <span className="home-reserve__perk-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <h3>Continue to Secure Booking</h3>
            <p>Choose your date, time and table in our booking experience.</p>
            {bookingUrl ? (
              <BookingLink href={bookingUrl} className="btn btn-primary btn-block btn-reserve">
                Reserve Now
              </BookingLink>
            ) : (
              <p role="status">Online booking is currently unavailable. Please call {getPhoneDisplay(site)}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
