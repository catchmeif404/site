# catchmeif404.com

The main site. A case file on an anonymous developer — evidence
(projects), field reports (log), and a tip line (contact).

No framework, no build step. Plain HTML/CSS/JS.

## Local development

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Structure

```text
index.html   # the whole page
style.css    # tokens + layout
script.js    # redaction-bar easter egg, tip form -> mailto, Field reports fetch
```

`script.js` fetches `catchmeif404-admin`'s public `GET /api/public/field-reports` (published
announcements + actual GitHub release history, merged) client-side to populate "Field reports" —
fails silently into the static "No reports filed yet" placeholder if that's unreachable, so the
page never breaks on it.

## Deploy

Static site, deployed via Cloudflare Pages (git integration — pushing to `main` redeploys, no
build command/output directory needed).

---

<div align="center">

Built by `catchmeif404` — building things nobody asked for.

</div>
