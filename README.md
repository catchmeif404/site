# catchmeif404.com

The main site. A product showroom for catchmeif404: each product hangs on its own rack of
screenshots (figdex is first) and a contact section. figdex's
OAuth pages live under `/figdex/`.
The homepage can be read in English or Korean with the EN/한국어 switch.

No framework, no build step. Plain HTML/CSS/JS.

## Local development

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Structure

```text
index.html   # product showroom (one <section class="rack"> per product)
home.css     # homepage tokens, layout, motion
home.js      # EN/KO switch, product detail overlay
figdex/      # figdex info + privacy pages (Google OAuth verification)
assets/      # logo, figdex and maskman icons and screenshots
```

To add a product, copy a rack section in `index.html`, give it an `id`, update the nav link and the
rack index number, put screenshots under `assets/<product>/`, and set `data-frame` (`phone` for app shots, `screen` for 16:9 web game shots).
The figdex screenshots in `assets/figdex/` are QA captures with test accounts and must be replaced
before release.

The Shorts Factory privacy policy (`/privacy`) was removed on 2026-11-12: Shorts Factory is not
going to production.

## Deploy

Static site, deployed via Cloudflare Pages (git integration — pushing to `main` redeploys, no
build command/output directory needed).

Last verified 2026-11-16: PR #9 (Maskman rack 02) is live about 15 s after the merge: `/` has `#maskman`,
`assets/maskman/*` return 200, headless Chrome at desktop and phone width shows the rail and the 16:9 detail.
Earlier: 2026-11-12 PR #5 (Shorts Factory policy removed) and PR #7 (`_redirects`) live.
`/`, `/figdex/`, `/figdex/privacy` return the current pages. `/privacy` and `/privacy.html` 301 to `/`:
after the file was deleted, plain `/privacy` kept serving the old page even after a zone cache purge,
and only the explicit redirect replaced it.

---

<div align="center">

Built by `catchmeif404` — building things nobody asked for.

</div>
