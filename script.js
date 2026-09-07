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
const reportsEmpty = document.getElementById("reports-empty");
const reportsList = document.getElementById("reports-list");

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
