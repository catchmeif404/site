# catchmeif404.md

Project guidance for any AI coding agent working on the `catchmeif404.com` static site.

Read the parent workspace guidance in `../catchmeif404.md` first. This repository is the visual
and tonal reference for the anonymous-developer case-file identity.

## Project

- Plain HTML, CSS, and JavaScript. There is no framework or build step.
- `index.html` is the homepage case file; `privacy.html` is the public, bilingual Shorts Factory
  privacy file. `style.css` owns tokens and layout, and `script.js` owns EN/KO selection, the
  redaction easter egg, tip form, and public feed fetches.
- Keep the case-file framing, restrained red accents, redactions, evidence/exhibit language, and
  dry deadpan tone intact.

## Development and verification

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` and verify both light/dark presentation, responsive layout, EN/KO
selection on the homepage and privacy file, links, the tip form, and the field-report fallback.
Do not add a build tool or framework for a small content/layout change.

## Deployment

Cloudflare Pages deploys this repository through its Git integration. Production releases follow
the workspace tag policy described in the parent guidance; do not assume every push is a release.
Last verified 2026-10-28: commit `1d60c96` was pushed to `main`, and the updated homepage and
Shorts Factory privacy file were served live. Both `https://catchmeif404.com/privacy` and
`https://catchmeif404.com/privacy.html` returned HTTP 200. The homepage links to the public
privacy file; the case remains open.
