# catchmeif404.com

The main site. A product showroom for catchmeif404: each product hangs on its own rack of
screenshots (figdex is first) and a contact section. A public Shorts Factory privacy file is served separately.
The homepage and privacy file can be read in English or Korean with the EN/한국어 switch.

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
privacy.html # Shorts Factory privacy file (case-file styled)
style.css    # privacy file tokens + layout
script.js    # language switch, redaction-bar easter egg, tip form, public feed fetches
assets/      # logo, figdex icon and screenshots
```

The homepage no longer uses `script.js`'s feed fetches or tip form. The privacy file still loads
`style.css` and `script.js`.

To add a product, copy a rack section in `index.html`, give it an `id`, update the nav link and the
rack index number, put screenshots under `assets/<product>/`, and set `data-frame` (`phone` today).
The figdex screenshots in `assets/figdex/` are QA captures with test accounts and must be replaced
before release.

The homepage does not link to the privacy file or mention Shorts Factory (owner decision,
2026-11-03). The public policy is still served at both `/privacy` and `/privacy.html`.

## Deploy

Static site, deployed via Cloudflare Pages (git integration — pushing to `main` redeploys, no
build command/output directory needed).

Last verified 2026-10-28: commit `1d60c96` was pushed to `main`, and Cloudflare Pages served the
updated homepage and bilingual privacy file. Both `https://catchmeif404.com/privacy` and
`https://catchmeif404.com/privacy.html` returned HTTP 200. Case file open; privacy file public.

The `feat/showroom-home` branch (commit `89d6f60`) is not merged to `main` and not deployed. The
verified record above is for the previous case-file homepage.

---

<div align="center">

Built by `catchmeif404` — building things nobody asked for.

</div>
