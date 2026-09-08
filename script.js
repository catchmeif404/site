const redacted = document.querySelector(".redacted");
redacted.addEventListener("click", () => {
  redacted.classList.remove("shake");
  // force reflow so the animation can replay on repeated clicks
  void redacted.offsetWidth;
  redacted.classList.add("shake");
});

// Field reports: pulled live from catchmeif404-admin's public feed (published announcements +
// actual GitHub release history, merged). Fails silently into the existing empty-note if the
// backend is unreachable — this is a static site with no build step, it should never break on a
// failed fetch.
const REPORTS_API = "https://catchmeif404-admin-production.up.railway.app/api/public/field-reports";
const EXHIBITS_API = "https://catchmeif404-admin-production.up.railway.app/api/public/exhibits";
const UPCOMING_API = "https://catchmeif404-admin-production.up.railway.app/api/public/calendar/events";
const reportsEmpty = document.getElementById("reports-empty");
const reportsList = document.getElementById("reports-list");
const exhibitsLabel = document.getElementById("exhibits-label");
const exhibitsList = document.getElementById("exhibits-list");
const upcomingSection = document.getElementById("upcoming-section");
const upcomingTear = document.getElementById("upcoming-tear");
const upcomingList = document.getElementById("upcoming-list");

fetch(REPORTS_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return;

    reportsEmpty.hidden = true;
    for (const entry of entries) {
      reportsList.appendChild(renderReport(entry));
    }
  })
  .catch(() => {
    // Leave the "No reports filed yet" note as-is.
  });

function renderReport(entry) {
  const article = document.createElement("article");
  article.className = "report";

  const meta = document.createElement("span");
  meta.className = "report-meta";
  const kindLabel = entry.kind === "deploy" ? "Shipped" : "Dispatch";
  meta.textContent = `${kindLabel} — ${formatReportDate(entry.date)}`;
  article.appendChild(meta);

  const title = document.createElement("h3");
  title.textContent = entry.title;
  article.appendChild(title);

  if (entry.body) {
    const body = document.createElement("p");
    body.textContent = entry.body;
    article.appendChild(body);
  }

  if (entry.url) {
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = "View";
    article.appendChild(link);
  }

  return article;
}

function formatReportDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

fetch(EXHIBITS_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return;

    exhibitsList.replaceChildren();
    exhibitsLabel.textContent = `Evidence on file — ${entries.length} item${entries.length === 1 ? "" : "s"} logged`;
    entries.forEach((entry, index) => {
      exhibitsList.appendChild(renderExhibit(entry, index));
    });
  })
  .catch(() => {
    // Keep the hard-coded case file exhibits if the CMS feed is empty or unreachable.
  });

function renderExhibit(entry, index) {
  const article = document.createElement("article");
  article.className = "exhibit";
  article.style.setProperty("--rot", `${[-2, 1.5, -1, 1][index % 4]}deg`);

  const tag = document.createElement("span");
  tag.className = "exhibit-tag";
  tag.textContent = `Exhibit ${String.fromCharCode(65 + index)}`;
  article.appendChild(tag);

  const title = document.createElement("h3");
  title.textContent = entry.title || entry.projectKey || "Untitled";
  article.appendChild(title);

  if (entry.description) {
    const description = document.createElement("p");
    description.textContent = entry.description;
    article.appendChild(description);
  }

  const links = document.createElement("p");
  links.className = "exhibit-links";

  if (entry.url) {
    const live = document.createElement("a");
    live.href = entry.url;
    live.textContent = "View live";
    links.appendChild(live);
  }

  if (entry.projectKey) {
    const repo = document.createElement("a");
    repo.href = `https://github.com/catchmeif404/${encodeURIComponent(entry.projectKey)}`;
    repo.textContent = "Open file";
    links.appendChild(repo);
  }

  if (links.children.length > 0) {
    article.appendChild(links);
  }

  return article;
}

fetch(UPCOMING_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return;

    upcomingSection.hidden = false;
    upcomingTear.hidden = false;
    entries.slice(0, 4).forEach((entry) => {
      upcomingList.appendChild(renderUpcoming(entry));
    });
  })
  .catch(() => {
    // Keep this section hidden until there is public calendar material.
  });

function renderUpcoming(entry) {
  const article = document.createElement("article");
  article.className = "upcoming-item";

  const meta = document.createElement("span");
  meta.className = "report-meta";
  meta.textContent = `${formatKind(entry.kind)} — ${formatReportDate(entry.date)}`;
  article.appendChild(meta);

  const title = document.createElement("h3");
  title.textContent = entry.title;
  article.appendChild(title);

  if (entry.body) {
    const body = document.createElement("p");
    body.textContent = entry.body;
    article.appendChild(body);
  }

  if (entry.url) {
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = "View";
    article.appendChild(link);
  }

  return article;
}

function formatKind(kind) {
  return String(kind || "Note")
    .toLowerCase()
    .replace(/_/g, " ");
}

const form = document.getElementById("tip-form");
const status = document.getElementById("tip-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent("Tip for catchmeif404");
  const body = encodeURIComponent(
    `${message}\n\n— ${name || "anonymous"} <${email}>`
  );

  window.location.href = `mailto:hello@catchmeif404.com?subject=${subject}&body=${body}`;
  status.textContent = "Tip drafted. Check your mail app to send it.";
});
