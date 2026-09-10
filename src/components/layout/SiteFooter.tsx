import Link from "next/link";
import Image from "next/image";
import {
  PHONE_NUMBER_DISPLAY,
  PHONE_NUMBER_HREF,
  EMAIL,
  ADDRESS,
  MAPS_URL,
  GOOGLE_REVIEW_URL,
  MENU_URL,
} from "@/lib/site";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/desire_lounge_dubai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/desiresheeshalounge",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@desiresheshalounge",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.93z" />
      </svg>
    ),
  },
  {
    label: "Google Maps",
    href: MAPS_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Leave a Google Review",
    href: GOOGLE_REVIEW_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.9 6.3 6.9.9-5 4.8 1.2 6.8L12 17.8 6 20.8 7.2 14 2.2 9.2l6.9-.9L12 2z" />
      </svg>
    ),
  },
];

const QUICK_LINKS = [
  { label: "Menu", href: MENU_URL, external: true },
  { label: "Live Sports", href: "/live-sports" },
  { label: "Gaming Zone", href: "/#gaming-zone" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Reservations", href: "/#reserve" },
];

const MENU_LINKS = ["Indian Favourites", "Indo Chinese", "Biryani", "Mocktails", "Desserts"];

export function SiteFooter() {
  return (
    <footer className="home-footer" id="contact">
      <div className="home-container home-footer__grid">
        <div className="home-footer__brand">
          <Link href="/" className="logo">
            <Image src="https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp" alt="" className="logo__mark" width={48} height={48} />
            <span className="logo__copy">
              <span className="logo__text">DESIRE</span>
              <span className="logo__tag">SHEESHA LOUNGE</span>
            </span>
          </Link>
          <div className="home-divider" aria-hidden="true" />
          <p>Eat. Chill. Play. 24/7 — premium lounge, multi-cuisine food, live sports and gaming in Oud Metha, Dubai.</p>
          <div className="home-footer__social" aria-label="Social media">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="home-footer__col">
          <h3>Quick Links</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? <a href={link.href}>{link.label}</a> : <Link href={link.href}>{link.label}</Link>}
              </li>
            ))}
          </ul>
        </div>

        <div className="home-footer__col">
          <h3>Our Menu</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul>
            {MENU_LINKS.map((label) => (
              <li key={label}>
                <a href={MENU_URL}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="home-footer__col">
          <h3>Contact Us</h3>
          <div className="home-divider home-divider--sm" aria-hidden="true" />
          <ul className="home-footer__contact">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href={PHONE_NUMBER_HREF}>{PHONE_NUMBER_DISPLAY}</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {ADDRESS}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="home-footer__bottom">
        <div className="home-divider home-divider--center" aria-hidden="true" />
        <p>&copy; {new Date().getFullYear()} DESIRE SHEESHA LOUNGE. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
