# catchmeif404.md

Project guidance for any AI coding agent working on the `catchmeif404.com` static site.

Read the parent workspace guidance in `../catchmeif404.md` first. The homepage is the
catchmeif404 product showroom; the case-file identity now lives only in `privacy.html`.

## Project

- Plain HTML, CSS, and JavaScript. There is no framework or build step.
- `index.html` is a product showroom, not a case file. Each product is a `<section class="rack">`
  with screenshots hanging on a clothes-rail; new products are appended as new rack sections.
  Light theme only (the logo art is on white). figdex is the only product so far (01), followed
  by a closing "next rail is empty (404)" section that holds contact.
- `home.css` owns the homepage tokens, layout, and motion (scroll-driven animations use
  `animation-timeline` with a static fallback; `prefers-reduced-motion` is respected).
  `home.js` owns the EN/KO switch (same `site-language` localStorage key as `script.js`) and the
  detail overlay built from each rack's markup (`.hanger-title`, `.hanger-desc`, `.rack-info`,
  `.rack-ctas`; Esc closes, arrow keys step).
- `privacy.html` is the public, bilingual Shorts Factory privacy file (required for Google OAuth
  verification). The homepage no longer mentions Shorts Factory or links to this file (owner
  decision, 2026-11-03); it stays reachable at `/privacy` and `/privacy.html`. It still uses `style.css` and `script.js`. `style.css` owns that file's tokens and
  layout; `script.js` owns the redaction easter egg, the tip form, and the public feed fetches
  (field reports, exhibits, announcements, upcoming). The homepage no longer uses the feed fetches
  or the tip form.
- Visual voice for the homepage: navy `#1B2430` and blue `#2F6BEB` from the 404 logo, Outfit /
  Noto Sans KR / JetBrains Mono. Tagline: "The operator is 404, the services are 200 /
  운영자는 404, 서비스는 200".
- Case-file voice (redactions, "Subject", "Ref.", exhibits, dry deadpan tone, restrained red
  accents) remains only on `privacy.html`. Do not spread it to the homepage or new product rails.
- Assets: `assets/logo-404.png`, `assets/figdex/icon.png`, and `assets/figdex/{home,profile,detail,cabinet,dex,item}.jpg`.
  The figdex screenshots are QA captures that show test accounts. Replace them with clean captures
  before release.
- Adding a product: copy a rack section, give it an `id`, update the nav link and the rack index
  number, put screenshots under `assets/<product>/`, and set `data-frame` (`phone` today).

## Development and verification

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` and verify responsive layout at desktop and 375px mobile, EN/KO
selection on the homepage and privacy file, rack detail open/close/step (Esc, arrow keys), links,
the privacy file (unaffected by homepage changes), and the browser console (no errors). Light
theme only. Do not add a build tool or framework for a small content/layout change.

## Deployment

Cloudflare Pages deploys this repository through its Git integration. Production releases follow
the workspace tag policy described in the parent guidance; do not assume every push is a release.
Last verified 2026-10-28: commit `1d60c96` was pushed to `main`, and the updated homepage and
Shorts Factory privacy file were served live. Both `https://catchmeif404.com/privacy` and
`https://catchmeif404.com/privacy.html` returned HTTP 200. The homepage links to the public
privacy file; the case remains open.

The `feat/showroom-home` branch (commit `89d6f60`) is not merged to `main` and not deployed. The
last verified record above describes the previous case-file homepage, not the showroom.
