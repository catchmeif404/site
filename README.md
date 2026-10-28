# catchmeif404.com

The main site. A case file on an anonymous developer — evidence
(projects), field reports (log), a tip line (contact), and a public Shorts Factory privacy file.
The homepage and privacy file can be read in English or Korean with the EN/한국어 switch.

No framework, no build step. Plain HTML/CSS/JS.

## Local development

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Structure

```text
index.html   # homepage case file
privacy.html # Shorts Factory privacy file
style.css    # tokens + layout
script.js    # language switch, redaction-bar easter egg, tip form -> mailto, public feed fetches
```

`script.js` fetches `catchmeif404-admin`'s public `GET /api/public/field-reports` (published
announcements + actual GitHub release history, merged) client-side to populate "Field reports" —
fails silently into the static "No reports filed yet" placeholder if that's unreachable, so the
page never breaks on it.

The homepage links to the privacy file from the Shorts Factory operations entry and footer.
The public policy is served at both `/privacy` and `/privacy.html`.

## Deploy

Static site, deployed via Cloudflare Pages (git integration — pushing to `main` redeploys, no
build command/output directory needed).

Last verified 2026-10-28: commit `1d60c96` was pushed to `main`, and Cloudflare Pages served the
updated homepage and bilingual privacy file. Both `https://catchmeif404.com/privacy` and
`https://catchmeif404.com/privacy.html` returned HTTP 200. Case file open; privacy file public.

---

<div align="center">

Built by `catchmeif404` — building things nobody asked for.

</div>
