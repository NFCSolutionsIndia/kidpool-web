# KidsPool landing page

React 18 + Vite + three.js marketing site for KidsPool, the carpool app for parents. Pages are pre-rendered to real HTML at build time for search engines and fast first paint.

Pages: Home, Privacy Policy (`/privacy`), Terms & Conditions (`/terms`) and a 404 page.

## Run it

```bash
npm install
npm run dev        # development server (usually http://localhost:5173)
npm run build      # client build + pre-render of every page into dist/
npm run preview    # serve dist/ the way a static host would
```

`npm run build` runs three steps: the client build, a server build of `src/entry-server.jsx`, and `scripts/prerender.mjs`, which writes the HTML for each page plus `sitemap.xml` and `robots.txt`.

## Deploying

- **Own domain:** set `VITE_SITE_URL` in `.env` (used for canonical links, the sitemap and share images), run `npm run build` and upload `dist/`.
- **GitHub Pages:** `.github/workflows/deploy.yml` builds with `BASE_PATH=/kidpool-web/` and publishes to https://nfcsolutionsindia.github.io/kidpool-web/. Every image and link goes through `src/lib/base.js`, so the site works at a domain root or in a sub-folder.

## Settings to fill in before launch

| What | Where |
|---|---|
| Real domain | `VITE_SITE_URL` in `.env` (placeholder: https://www.kidspool.app) |
| Registered company name | `LEGAL_NAME` in `src/sections/Footer.jsx` (fills the Privacy Policy, Terms, footer and search data) |
| App Store and Google Play links | `APP_STORE_URL` and `PLAY_STORE_URL` in `src/sections/AppDownload.jsx` |
| Social profile links | `SOCIAL` in `src/sections/Footer.jsx` (empty links show "Coming soon") |
| Policy effective date | `EFFECTIVE_DATE` in `src/sections/Legal.jsx` |

## Rules that keep the site compliant

- **Safety claims** in `src/sections/Safety.jsx` follow the app design (Figma v3). Remove any claim for a feature that doesn't ship.
- **No tracking scripts.** Any analytics or ad tag must load through `loadMarketingTag()` in `src/lib/consent.js`, which honors the visitor's opt-out and the Global Privacy Control signal. Name the tool in the Privacy Policy first.
- **Motion can always be paused** (the "Pause animation" button beside the hero illustration) and respects reduced-motion settings.
- Accessibility target: WCAG 2.1 AA (axe reports 0 violations on every page).

## Where things live

```
src/
  main.jsx               app entry (hydrates the pre-rendered HTML)
  entry-server.jsx       build-time renderer used by scripts/prerender.mjs
  App.jsx                routes: home, privacy, terms, 404
  sections/              Header, Hero, Trust, HowItWorks, Features, Preview, Safety,
                         UseCases, AppDownload, FAQ, Footer, Legal, NotFound
  scenes/                three.js scenes (HeroScene, StepsScene, CommunityScene), loaded lazily
  components/            ui (icons, wordmark), Reveal (entrance animations), Leaves, JellyRadio
  hooks/                 useThreeScene, useTilt, useMotionPause (site-wide pause)
  lib/                   base (base path), brand (colors), consent (privacy choices),
                         ripple (button click effect), threeKit (3D builders)
  styles/kidspool.css     design tokens and all styles
public/                  photos (WebP), app screenshots, icons, share image, web manifest
scripts/prerender.mjs    writes each page's HTML, sitemap.xml and robots.txt
```
