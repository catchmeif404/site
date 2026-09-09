# catchmeif404.md

Project guidance for any AI coding agent working on the `catchmeif404.com` static site.

Read the parent workspace guidance in `../catchmeif404.md` first. This repository is the visual
and tonal reference for the anonymous-developer case-file identity.

## Project

- Plain HTML, CSS, and JavaScript. There is no framework or build step.
- `index.html` is the page structure, `style.css` owns tokens and layout, and `script.js` owns
  the redaction easter egg, tip form, and field-report fetch.
- Keep the case-file framing, restrained red accents, redactions, evidence/exhibit language, and
  dry deadpan tone intact.

## Development and verification

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` and verify both light/dark presentation, responsive layout, links,
the tip form, and the field-report fallback. Do not add a build tool or framework for a small
content/layout change.

## Deployment

Cloudflare Pages deploys this repository through its Git integration. Production releases follow
the workspace tag policy described in the parent guidance; do not assume every push is a release.
