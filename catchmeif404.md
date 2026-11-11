# catchmeif404.md

Project guidance for any AI coding agent working on the `catchmeif404.com` static site.

Read the parent workspace guidance in `../catchmeif404.md` first. The homepage is the
catchmeif404 product showroom. The anonymous-developer case-file persona is retired (owner decision 2026-11-11); write plain product language.

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
- `privacy.html` is the public, bilingual Shorts Factory privacy policy (required for Google OAuth
  verification). The homepage no longer mentions Shorts Factory or links to this file (owner
  decision, 2026-11-03); it stays reachable at `/privacy` and `/privacy.html`. It still uses `style.css` and `script.js`. `style.css` owns that file's tokens and
  layout; `script.js` owns only its EN/KO switch and page title.
- Visual voice for the homepage: navy `#1B2430` and blue `#2F6BEB` from the 404 logo, Outfit /
  Noto Sans KR / JetBrains Mono. No tagline; the page says what it is (products).
- Assets: `assets/logo-404.png`, `assets/figdex/icon.png`, and `assets/figdex/{home,profile,detail,cabinet,dex,item}.jpg`.
  The figdex screenshots are QA captures that show test accounts. Replace them with clean captures
  before release.
- Adding a product: copy a rack section, give it an `id`, update the nav link and the rack index
  number, put screenshots under `assets/<product>/`, and set `data-frame` (`phone` today).
- `figdex/index.html` (`/figdex/`) and `figdex/privacy.html` (`/figdex/privacy`) are standalone, inline-styled, bilingual pages for Google OAuth verification (TK-240). `figdex/privacy.html` is a verbatim copy of figdex `backend/src/main/resources/static/privacy.html` (version 2, effective 2026-11-06; source commit in an HTML comment). Do not edit the policy text here: change it in figdex first, then re-copy.

## Development and verification

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` and verify responsive layout at desktop and 375px mobile, EN/KO
selection on the homepage and privacy file, rack detail open/close/step (Esc, arrow keys), links,
the privacy policy (unaffected by homepage changes), and the browser console (no errors). Light
theme only. Do not add a build tool or framework for a small content/layout change.

## Deployment

Cloudflare Pages deploys this repository through its Git integration. Production releases follow
the workspace tag policy described in the parent guidance; do not assume every push is a release.
Last verified 2026-10-28: commit `1d60c96` was pushed to `main`, and the updated homepage and
Shorts Factory privacy file were served live. Both `https://catchmeif404.com/privacy` and
`https://catchmeif404.com/privacy.html` returned HTTP 200. 

The `feat/showroom-home` branch (commit `89d6f60`) is not merged to `main` and not deployed. The
last verified record above describes the previous case-file homepage, not the showroom.
