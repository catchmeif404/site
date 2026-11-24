"""Build the Notes section, the About and Privacy pages, sitemap.xml and robots.txt.

    python3 tools/build_notes.py

Sources are HTML fragments in content/ (line 1: an HTML comment holding JSON metadata, then the body):
  content/notes/<slug>.<lang>.html   {"title", "description", "date", "product"}
  content/pages/<name>.<lang>.html   {"title", "description"}
Output is plain static HTML committed next to index.html (Cloudflare Pages serves the repo as it is):
  /notes/, /notes/<slug>/, /about/, /privacy/            English
  /ko/notes/, /ko/notes/<slug>/, /ko/about/, /ko/privacy/  Korean
Python standard library only. Re-run after editing anything in content/ and commit the result.
"""
import enum
import html
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://catchmeif404.com"
ADSENSE_CLIENT = "ca-pub-6944124131865180"
FONTS = ("https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&family=Noto+Sans+KR:wght@400;500;700;900"
         "&family=JetBrains+Mono:wght@500;700&display=swap")
PAGES = ("about", "privacy")
CURRENT = ' aria-current="page"'
ALLOWED_TAGS = {"p", "h2", "h3", "ul", "ol", "li", "pre", "code", "strong", "em", "a", "blockquote",
                "table", "thead", "tbody", "tr", "th", "td", "br"}


class Lang(enum.Enum):
    EN = "en"
    KO = "ko"

    @property
    def prefix(self):
        return "" if self is Lang.EN else "/ko"

    @property
    def other(self):
        return Lang.KO if self is Lang.EN else Lang.EN


TEXT = {
    "products": {Lang.EN: "Products", Lang.KO: "제품"},
    "notes": {Lang.EN: "Notes", Lang.KO: "글"},
    "about": {Lang.EN: "About", Lang.KO: "소개"},
    "privacy": {Lang.EN: "Privacy", Lang.KO: "개인정보처리방침"},
    "notes_title": {Lang.EN: "Notes", Lang.KO: "글"},
    "notes_lead": {
        Lang.EN: "What we learned building and running our products: design decisions, mistakes and the fixes that stuck.",
        Lang.KO: "제품을 만들고 운영하면서 배운 것들이에요. 설계에서 고른 것, 실수한 것, 그리고 남은 해결책을 적어요.",
    },
    "notes_desc": {
        Lang.EN: "Engineering notes from catchmeif404: how figdex, Maskman, SantaPick and nightshift are built, deployed and run.",
        Lang.KO: "catchmeif404 개발 노트: figdex, 마스크맨, 산타픽, nightshift를 만들고 배포하고 운영한 기록.",
    },
    "all_notes": {Lang.EN: "All notes", Lang.KO: "글 목록"},
    "published": {Lang.EN: "Published", Lang.KO: "작성"},
    "more": {Lang.EN: "More notes", Lang.KO: "다른 글"},
    "switch": {Lang.EN: "한국어", Lang.KO: "English"},
}


def t(key, lang):
    return TEXT[key][lang]


def read_fragment(path, required):
    raw = path.read_text(encoding="utf-8")
    first, _, body = raw.partition("\n")
    match = re.fullmatch(r"\s*<!--\s*(\{.*\})\s*-->\s*", first)
    if not match:
        sys.exit(f"{path}: line 1 must be an HTML comment holding JSON metadata")
    meta = json.loads(match.group(1))
    missing = [key for key in required if not str(meta.get(key, "")).strip()]
    if missing:
        sys.exit(f"{path}: metadata is missing {missing}")
    used = {tag.lower() for tag in re.findall(r"</?([a-zA-Z][a-zA-Z0-9]*)", re.sub(r"(?s)<pre>.*?</pre>", "", body))}
    if used - ALLOWED_TAGS:
        sys.exit(f"{path}: tags not allowed: {sorted(used - ALLOWED_TAGS)}")
    if re.search(r"(?i)<h1|<script|<style|\son[a-z]+=", body):
        sys.exit(f"{path}: h1, script, style and inline handlers are not allowed")
    return meta, body.strip()


def page(lang, path, title, description, main, kind, alternate=True, structured=""):
    """`path` is the page's path without the language prefix, e.g. "/notes/" or "/about/"."""
    url = f"{SITE}{lang.prefix}{path}"
    esc = html.escape
    alternates = "" if not alternate else "".join(
        f'  <link rel="alternate" hreflang="{code}" href="{SITE}{prefix}{path}">\n'
        for code, prefix in (("en", Lang.EN.prefix), ("ko", Lang.KO.prefix), ("x-default", Lang.EN.prefix)))
    nav = "".join(
        f'<a href="{href}"{CURRENT if current else ""}>{label}</a>'
        for href, label, current in (
            (f"/", t("products", lang), False),
            (f"{lang.prefix}/notes/", t("notes", lang), kind == "notes"),
            (f"{lang.prefix}/about/", t("about", lang), kind == "about"),
        ))
    return f"""<!doctype html>
<html lang="{lang.value}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-adsense-account" content="{ADSENSE_CLIENT}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" crossorigin="anonymous"></script>
  <title>{esc(title)} · catchmeif404</title>
  <meta name="description" content="{esc(description)}">
  <link rel="canonical" href="{url}">
{alternates}  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:type" content="{"article" if structured else "website"}">
  <meta property="og:url" content="{url}">
  <meta property="og:site_name" content="catchmeif404">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/notes.css">
{structured}</head>
<body>
  <header class="bar">
    <div class="bar-inner">
      <a class="bar-logo" href="/" aria-label="catchmeif404"><img src="/assets/logo-404.png" alt="" width="40" height="40"><span>catchmeif404</span></a>
      <nav class="bar-nav" aria-label="{t("notes", lang)}">{nav}</nav>
      <a class="bar-lang" href="{lang.other.prefix}{path}" lang="{lang.other.value}" hreflang="{lang.other.value}">{t("switch", lang)}</a>
    </div>
  </header>
  <main class="wrap">
{main}
  </main>
  <footer class="foot">
    <div class="foot-row">
      <span>© 2026 catchmeif404</span>
      <span class="foot-links">
        <a href="{lang.prefix}/notes/">{t("notes", lang)}</a>
        <a href="{lang.prefix}/about/">{t("about", lang)}</a>
        <a href="{lang.prefix}/privacy/">{t("privacy", lang)}</a>
        <a href="https://github.com/catchmeif404">GitHub</a>
      </span>
    </div>
  </footer>
</body>
</html>
"""


def write(lang, path, content):
    target = ROOT / (lang.prefix + path).strip("/") / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    return f"{SITE}{lang.prefix}{path}"


def card(lang, note):
    meta = note[lang][0]
    return (f'      <li class="card"><a href="{lang.prefix}/notes/{note["slug"]}/">'
            f'<span class="tag">{html.escape(meta["product"])}</span>'
            f'<span class="card-title">{html.escape(meta["title"])}</span>'
            f'<span class="card-desc">{html.escape(meta["description"])}</span>'
            f'<time datetime="{meta["date"]}">{meta["date"]}</time></a></li>')


def main():
    notes = []
    for en_path in sorted((ROOT / "content/notes").glob("*.en.html")):
        slug = en_path.name[: -len(".en.html")]
        ko_path = en_path.with_name(f"{slug}.ko.html")
        if not ko_path.exists():
            sys.exit(f"{slug}: the Korean file is missing (every note needs both languages)")
        required = ("title", "description", "date", "product")
        notes.append({"slug": slug, Lang.EN: read_fragment(en_path, required), Lang.KO: read_fragment(ko_path, required)})
    orphans = [p.name for p in (ROOT / "content/notes").glob("*.ko.html") if not p.with_name(p.name.replace(".ko.", ".en.")).exists()]
    if orphans:
        sys.exit(f"Korean notes without an English file: {orphans}")
    notes.sort(key=lambda n: (n[Lang.EN][0]["date"], n["slug"]), reverse=True)

    for lang in Lang:  # generated folders are rebuilt from scratch so a removed note leaves no page behind
        shutil.rmtree(ROOT / (lang.prefix + "/notes").strip("/"), ignore_errors=True)

    urls = [f"{SITE}/", f"{SITE}/figdex/"]
    for lang in Lang:
        cards = "\n".join(card(lang, note) for note in notes)
        body = (f'    <h1>{t("notes_title", lang)}</h1>\n    <p class="lead">{t("notes_lead", lang)}</p>\n'
                f'    <ul class="cards">\n{cards}\n    </ul>')
        urls.append(write(lang, "/notes/", page(lang, "/notes/", t("notes_title", lang), t("notes_desc", lang), body, "notes")))
        for index, note in enumerate(notes):
            meta, content = note[lang]
            others = [n for n in notes if n is not note]
            near = (others[index:] + others[:index])[:3]
            more = "\n".join(card(lang, n) for n in near)
            structured = "  <script type=\"application/ld+json\">" + json.dumps({
                "@context": "https://schema.org", "@type": "Article", "headline": meta["title"],
                "description": meta["description"], "datePublished": meta["date"], "inLanguage": lang.value,
                "author": {"@type": "Organization", "name": "catchmeif404", "url": SITE},
                "publisher": {"@type": "Organization", "name": "catchmeif404", "url": SITE},
                "mainEntityOfPage": f"{SITE}{lang.prefix}/notes/{note['slug']}/",
            }, ensure_ascii=False) + "</script>\n"
            body = (f'    <article class="note">\n      <p class="crumb"><a href="{lang.prefix}/notes/">{t("all_notes", lang)}</a>'
                    f'<span class="tag">{html.escape(meta["product"])}</span></p>\n'
                    f'      <h1>{html.escape(meta["title"])}</h1>\n'
                    f'      <p class="meta">{t("published", lang)} <time datetime="{meta["date"]}">{meta["date"]}</time> · catchmeif404</p>\n'
                    f'{content}\n    </article>\n'
                    f'    <section class="more"><h2>{t("more", lang)}</h2>\n    <ul class="cards">\n{more}\n    </ul></section>')
            path = f"/notes/{note['slug']}/"
            urls.append(write(lang, path, page(lang, path, meta["title"], meta["description"], body, "notes", structured=structured)))
        for name in PAGES:
            meta, content = read_fragment(ROOT / f"content/pages/{name}.{lang.value}.html", ("title", "description"))
            body = f'    <article class="note">\n      <h1>{html.escape(meta["title"])}</h1>\n{content}\n    </article>'
            urls.append(write(lang, f"/{name}/", page(lang, f"/{name}/", meta["title"], meta["description"], body, name)))

    sitemap = "\n".join(f"  <url><loc>{url}</loc></url>" for url in urls)
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sitemap}\n</urlset>\n',
        encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /content/\nDisallow: /tools/\n\nSitemap: {SITE}/sitemap.xml\n",
                                     encoding="utf-8")
    print(f"built {len(notes)} notes x {len(Lang)} languages, {len(urls)} urls in sitemap.xml")


if __name__ == "__main__":
    main()
