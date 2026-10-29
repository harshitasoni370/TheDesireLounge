# DESIRE SHEESHA LOUNGE — Next.js rebuild

A component-wise Next.js 16 (App Router + TypeScript + Tailwind v4) rebuild of the
original static `thedesirelounge.com` site, matching the original design pixel-for-pixel
(same fonts, colours, layout, and CSS).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production export in out/
```

For IIS deployment, upload the complete `out/` folder. It contains the generated
pages, `images/` assets, and `web.config` from `public/`.

## Domain-based website configuration

The static export calls
<!-- `https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain`
 -->
 `https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain`
 directly
and sends the current hostname as the `domain` query parameter. To use another
configuration endpoint, set `NEXT_PUBLIC_WEBSITE_CONFIG_API_URL` to its full
URL before building.
Company/branch IDs, venue name, logo, contact details, address, and APP/DL links
are populated from that response; a missing or invalid configuration is shown
instead of silently using another venue's details.
The tenant asset folder is inferred from the configured logo path and is reused
for API-provided event and game images.

Set these environment variables before starting local development to configure
the API targets. Restaurant API endpoint paths are appended to the configured
`/api` base URL; asset URLs continue to use the API host root.

```bash
NEXT_PUBLIC_RESTAURANT_API_BASE_URL=https://restaurents-api.cylsys.com/api/
NEXT_PUBLIC_EVENTS_API_BASE_URL=https://fumesandflavoursapi.cylsysuat.com
# NEXT_PUBLIC_WEBSITE_CONFIG_API_URL=https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain
NEXT_PUBLIC_WEBSITE_CONFIG_API_URL=https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain
```

For local previews, `NEXT_PUBLIC_WEBSITE_DOMAIN` can override `localhost` with a
domain registered in the website configuration service. The configuration
service allows the website origin through CORS, so the static website can call
the API directly.

## Structure

```
src/
  app/
    layout.tsx        Root layout — fonts, header, footer, mobile bar, WhatsApp button, toast
    page.tsx           Home
    about/page.tsx      About Us
    gallery/page.tsx    Gallery
    live-sports/page.tsx  Live Sports fixtures
    events/page.tsx      Events schedule
    catering/page.tsx    Catering services and gallery
    globals.css         Tailwind + brand theme tokens
    legacy.css           Original site.css, ported as-is for exact visual parity

  components/
    layout/            SiteHeader, SiteFooter, MobileContactBar, WhatsAppFloat
    common/             Toast, HeroAnimate (hero fade-in, no external animation lib)
    shared/             PageHero, HighlightsStrip, CtaBanner — reused across About/
                        Gallery/Live Sports/Events (same layout, different content)
    home/               HomeHero (slider), MenuPreview, Hubs, GalleryTeaser, Reviews,
                        ReserveForm (API-backed booking)
    about/              Welcome, WhatMakesUsSpecial, OurVibe, AboutClosing
    gallery/            GalleryGrid — tabs, category filters, load more, lightbox
    live-sports/        SportsSchedule — search, sport/status/month filters, pagination
    events/             EventsSchedule — API-fed live/upcoming/past events

  data/                 Bundled gallery and legacy page data

  lib/                  site.ts (API endpoints and internal navigation),
                        site-config.ts (domain response types and helpers),
                        toast.ts (tiny pub/sub used by the Toast component)
```

## Notes on the conversion

- **Design fidelity**: the original `assets/css/style.css` (~8,000 lines) is imported verbatim
  as `legacy.css`, so every existing class name and visual detail carries over unchanged.
  Only two `url(../images/...)` references were rewritten to `/images/...` to match the
  Next.js `public/` folder.
- **Fonts**: loaded via the same Google Fonts `<link>` the original site used (Cinzel, Great
  Vibes, Roboto, Playfair Display) rather than `next/font`, since the sandboxed build
  environment here can't reach `fonts.googleapis.com` at build time — functionally identical
  once deployed with normal internet access.
- **Tenant-fed pages**: the site profile, events, games, and sports use API data; booking
  links use the IDs resolved for the active domain. Gallery assets and
  editorial landing-page content remain bundled because the website configuration response
  does not contain those content collections.
- **Reservations**: all table, event, sports, and gaming booking links open the configured APP
  checkout with the venue IDs and checkout parameters used by the Digital Lounge flow.
- **Animations**: the original used GSAP (loaded from a CDN) for the hero fade-in. That's
  reproduced with the native Web Animations API in `HeroAnimate.tsx` — no extra dependency,
  same visual effect, and it fails safe (content is never left invisible) for
  `prefers-reduced-motion` users.
- **Not included**: `menu.json`, `cart.js`, `checkout-info.js`, `confirm.js`, `profile.js`, and
  `categories.js` reference a Menu / Cart / Checkout flow whose HTML wasn't part of the
  uploaded project (it lives on `app.thedesirelounge.com`, a separate app). `menu.json` was
  still copied into `src/data/` in case that flow gets added later.
