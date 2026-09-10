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
    globals.css         Tailwind + brand theme tokens
    legacy.css           Original site.css, ported as-is for exact visual parity

  components/
    layout/            SiteHeader, SiteFooter, MobileContactBar, WhatsAppFloat
    common/             Toast, HeroAnimate (hero fade-in, no external animation lib)
    shared/             PageHero, HighlightsStrip, CtaBanner — reused across About/
                        Gallery/Live Sports/Events (same layout, different content)
    home/               HomeHero (slider), MenuPreview, Hubs, GalleryTeaser, Reviews,
                        ReserveForm (WhatsApp submission)
    about/              Welcome, WhatMakesUsSpecial, OurVibe, AboutClosing
    gallery/            GalleryGrid — tabs, category filters, load more, lightbox
    live-sports/        SportsSchedule — search, sport/status/month filters, pagination
    events/             EventsSchedule — live/upcoming/past cards with WhatsApp reserve CTA

  data/                 menu.json, gallery.json, sports-schedule.json, events-schedule.json
                        (copied from the original assets/data, imported directly — no client fetch)

  lib/                  site.ts (shared constants: phone, WhatsApp, address, nav links),
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
- **Data-driven pages**: Gallery, Live Sports and Events all read from the original JSON data
  files (`src/data/*.json`) instead of hardcoded markup, matching how the original site's
  vanilla-JS page controllers worked — just re-implemented as React components.
- **Animations**: the original used GSAP (loaded from a CDN) for the hero fade-in. That's
  reproduced with the native Web Animations API in `HeroAnimate.tsx` — no extra dependency,
  same visual effect, and it fails safe (content is never left invisible) for
  `prefers-reduced-motion` users.
- **Not included**: `menu.json`, `cart.js`, `checkout-info.js`, `confirm.js`, `profile.js`, and
  `categories.js` reference a Menu / Cart / Checkout flow whose HTML wasn't part of the
  uploaded project (it lives on `app.thedesirelounge.com`, a separate app). `menu.json` was
  still copied into `src/data/` in case that flow gets added later.
