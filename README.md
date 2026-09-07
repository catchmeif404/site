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
script.js    # redaction-bar easter egg, tip form -> mailto
```

## Deploy

Static site, deployed via Cloudflare Pages. Pushing to `main` redeploys.

---

<div align="center">

Built by `catchmeif404` — building things nobody asked for.

</div>
