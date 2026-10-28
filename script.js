const locale = localStorage.getItem("site-language") === "ko" ||
  (localStorage.getItem("site-language") === null && navigator.language.startsWith("ko")) ? "ko" : "en";
const tr = (en, ko) => locale === "ko" ? ko : en;
const exhibitKo = {
  "aws-cost-calculator": { title: "AWS 비용 계산기", description: "AWS보다 먼저 이번 달 요금을 추정한다. 규칙 기반. 갑작스러운 청구서는 증거물에서 제외." },
  DevDNA: { title: "DevDNA", description: "GitHub 활동을 증거 분석에 부친다. 어떤 개발자인지 배지가 판정한다." },
  "git-commit-identity-guard": { title: "Git 커밋 신원 감시관", description: "계정이 틀렸다면 푸시한 뒤가 아니라 커밋하기 전에 멈춘다." },
};
const upcomingKo = {
  catchprocess: "컴퓨터 안에 숨어 있던 작업을 추적하는 살아 있는 사건 파일.",
};
const reportBody = (entry) => {
  if (locale !== "ko") return entry.body;
  if (entry.bodyKo) return entry.bodyKo;
  const shipped = /^Shipped (v\S+)\.$/.exec(entry.body || "");
  return shipped ? `${shipped[1]} 배포.` : entry.body;
};
// The public CMS currently sends one language. Keep authored entries sealed until both locales are supplied.
const bilingualAnnouncement = (entry) => Boolean(entry.titleKo && entry.bodyKo && entry.title && entry.body);
const bilingualExhibit = (entry) => Boolean(exhibitKo[entry.projectKey] || (entry.titleKo && entry.descriptionKo));
const bilingualUpcoming = (entry) => Boolean(upcomingKo[entry.project] || (entry.titleKo && entry.bodyKo));
document.documentElement.lang = locale;
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
  button.addEventListener("click", () => {
    localStorage.setItem("site-language", button.dataset.lang);
    window.location.reload();
  });
});
const policyPage = /\/privacy(?:\.html)?\/?$/.test(document.location.pathname);
document.title = policyPage
  ? tr("Shorts Factory — privacy file | catchmeif404", "Shorts Factory — 개인정보처리방침 | catchmeif404")
  : tr("catchmeif404 — case file", "catchmeif404 — 사건 파일");

const redacted = document.querySelector(".redacted");
if (redacted) {
  redacted.title = tr("nice try", "시도는 좋았다");
  redacted.setAttribute("aria-label", tr("Redacted", "삭제된 정보"));
}
if (redacted) redacted.addEventListener("click", () => {
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
const ANNOUNCEMENTS_API = "https://catchmeif404-admin-production.up.railway.app/api/public/announcements";
const reportsEmpty = document.getElementById("reports-empty");
const reportsList = document.getElementById("reports-list");
const exhibitsLabel = document.getElementById("exhibits-label");
const exhibitsList = document.getElementById("exhibits-list");
const upcomingSection = document.getElementById("upcoming-section");
const upcomingTear = document.getElementById("upcoming-tear");
const upcomingList = document.getElementById("upcoming-list");
const announcementsSection = document.getElementById("announcements-section");
const announcementsTear = document.getElementById("announcements-tear");
const announcementsList = document.getElementById("announcements-list");

if (reportsList) fetch(REPORTS_API)
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

if (announcementsList) fetch(ANNOUNCEMENTS_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries)) return;
    const ready = entries.filter(bilingualAnnouncement);
    if (ready.length === 0) return;

    announcementsSection.hidden = false;
    announcementsTear.hidden = false;
    for (const entry of ready) {
      announcementsList.appendChild(renderReport(entry));
    }
  })
  .catch(() => {
    // Keep the section hidden until there is announcement material.
  });

function renderReport(entry) {
  const article = document.createElement("article");
  article.className = "report";

  const meta = document.createElement("span");
  meta.className = "report-meta";
  const kindLabel = entry.kind === "deploy" ? tr("Shipped", "배포") : tr("Dispatch", "보고");
  meta.textContent = `${kindLabel} — ${formatReportDate(entry.date)}`;
  article.appendChild(meta);

  const title = document.createElement("h3");
  title.textContent = locale === "ko" ? entry.titleKo || entry.title : entry.title;
  article.appendChild(title);

  if (entry.body) {
    const body = document.createElement("p");
    body.textContent = reportBody(entry);
    article.appendChild(body);
  }

  if (entry.url) {
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = tr("View", "보기");
    article.appendChild(link);
  }

  return article;
}

function formatReportDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", { year: "numeric", month: "short", day: "numeric" });
}

if (exhibitsList) fetch(EXHIBITS_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries)) return;
    const ready = entries.filter(bilingualExhibit);
    if (ready.length === 0) return;

    exhibitsList.replaceChildren();
    exhibitsLabel.textContent = tr(`Evidence on file — ${ready.length} item${ready.length === 1 ? "" : "s"} logged`, `확보된 증거 — ${ready.length}건`);
    ready.forEach((entry, index) => {
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
  tag.textContent = tr(`Exhibit ${String.fromCharCode(65 + index)}`, `증거물 ${String.fromCharCode(65 + index)}`);
  article.appendChild(tag);

  const title = document.createElement("h3");
  const translated = exhibitKo[entry.projectKey];
  title.textContent = (locale === "ko" ? entry.titleKo || translated?.title : entry.title) || entry.title || entry.projectKey || tr("Untitled", "제목 없음");
  article.appendChild(title);

  if (entry.description) {
    const description = document.createElement("p");
    description.textContent = locale === "ko" ? entry.descriptionKo || translated?.description || entry.description : entry.description;
    article.appendChild(description);
  }

  const links = document.createElement("p");
  links.className = "exhibit-links";

  if (entry.url) {
    const live = document.createElement("a");
    live.href = entry.url;
    live.textContent = tr("View live", "서비스 보기");
    links.appendChild(live);
  }

  if (entry.projectKey) {
    const repo = document.createElement("a");
    repo.href = `https://github.com/catchmeif404/${encodeURIComponent(entry.projectKey)}`;
    repo.textContent = tr("Open file", "파일 열기");
    links.appendChild(repo);
  }

  if (links.children.length > 0) {
    article.appendChild(links);
  }

  return article;
}

if (upcomingList) fetch(UPCOMING_API)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
  .then((entries) => {
    if (!Array.isArray(entries)) return;
    const ready = entries.filter(bilingualUpcoming);
    if (ready.length === 0) return;

    upcomingSection.hidden = false;
    upcomingTear.hidden = false;
    ready.slice(0, 4).forEach((entry) => {
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
  title.textContent = locale === "ko" ? entry.titleKo || entry.title : entry.title;
  article.appendChild(title);

  if (entry.body) {
    const body = document.createElement("p");
    body.textContent = locale === "ko" ? entry.bodyKo || upcomingKo[entry.project] || entry.body : entry.body;
    article.appendChild(body);
  }

  if (entry.url) {
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = tr("View", "보기");
    article.appendChild(link);
  }

  return article;
}

function formatKind(kind) {
  const translated = { deploy: "배포", release: "출시", event: "일정", note: "메모" };
  if (locale === "ko" && translated[String(kind || "note").toLowerCase()]) return translated[String(kind || "note").toLowerCase()];
  return String(kind || tr("Note", "메모"))
    .toLowerCase()
    .replace(/_/g, " ");
}

const form = document.getElementById("tip-form");
const status = document.getElementById("tip-status");

if (form) form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.elements.namedItem("name").value.trim();
  const email = form.elements.namedItem("email").value.trim();
  const message = form.elements.namedItem("message").value.trim();

  const subject = encodeURIComponent(tr("Tip for catchmeif404", "catchmeif404 제보"));
  const body = encodeURIComponent(
    `${message}\n\n— ${name || "anonymous"} <${email}>`
  );

  window.location.href = `mailto:hello@catchmeif404.com?subject=${subject}&body=${body}`;
  status.textContent = tr("Tip drafted. Check your mail app to send it.", "제보 초안을 만들었다. 메일 앱에서 발송해 달라.");
});
