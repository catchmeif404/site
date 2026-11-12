// EN/KO switch; the choice is kept in the site-language localStorage key.
const LANGUAGE_KEY = "site-language";
const stored = localStorage.getItem(LANGUAGE_KEY);
const locale = stored === "ko" || (stored === null && navigator.language.startsWith("ko")) ? "ko" : "en";
const tr = (en, ko) => (locale === "ko" ? ko : en);

document.documentElement.lang = locale;
document.title = tr("catchmeif404 — products", "catchmeif404 — 제품");
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
  button.addEventListener("click", () => {
    if (button.dataset.lang === locale) return;
    localStorage.setItem(LANGUAGE_KEY, button.dataset.lang);
    window.location.reload();
  });
});

// ---- detail overlay: a piece taken off the rail ----
// Everything shown here is read from the rack's own markup, so a new product only needs a new
// <section class="rack"> in index.html.
const detail = document.getElementById("detail");
const detailImg = document.getElementById("detail-img");
const detailIcon = document.getElementById("detail-icon");
const detailProduct = document.getElementById("detail-product");
const detailNo = document.getElementById("detail-no");
const detailTitle = document.getElementById("detail-title");
const detailDesc = document.getElementById("detail-desc");
const detailInfo = document.getElementById("detail-info");
const detailCtas = document.getElementById("detail-ctas");
const tabButtons = detail.querySelectorAll("[data-tab]");
const pageRegions = document.querySelectorAll(".topbar, main, .foot");

let current = null; // { rack, index }

const cloneChildren = (source) => Array.from(source.childNodes, (node) => node.cloneNode(true));

function hangersOf(rack) {
  return Array.from(rack.querySelectorAll(".hanger"));
}

function fill(rack, index) {
  const hanger = hangersOf(rack)[index];
  const button = hanger.querySelector(".hanger-btn");
  const title = hanger.querySelector(".hanger-title");
  const productName = rack.querySelector(".rack-name").textContent;

  detailImg.src = button.dataset.src;
  detailImg.alt = `${productName} — ${title.querySelector(`[lang="${locale}"]`)?.textContent ?? title.textContent}`;
  detailIcon.src = rack.querySelector(".rack-icon")?.getAttribute("src") ?? "";
  detailProduct.textContent = productName;
  detailNo.textContent = hanger.querySelector(".hanger-no").textContent;
  detailTitle.replaceChildren(...cloneChildren(title));
  detailDesc.replaceChildren(...cloneChildren(hanger.querySelector(".hanger-desc")));

  const info = rack.querySelector(".rack-info");
  detailInfo.replaceChildren(...(info ? cloneChildren(info) : []));
  const ctas = rack.querySelector(".rack-ctas");
  detailCtas.replaceChildren(...(ctas ? cloneChildren(ctas) : []));

  // replay the drop each time a piece is taken off the rail
  detail.classList.remove("is-entering");
  void detail.offsetWidth;
  detail.classList.add("is-entering");
}

function showTab(tab) {
  tabButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.tab === tab)));
  detailDesc.hidden = tab !== "screen";
  detailInfo.hidden = tab !== "info";
}

function openDetail(rack, index) {
  current = { rack, index };
  fill(rack, index);
  showTab("screen");
  detail.hidden = false;
  document.body.classList.add("is-locked");
  pageRegions.forEach((region) => { region.inert = true; });
  detail.querySelector(".detail-close").focus();
}

function closeDetail() {
  if (!current) return;
  const { rack, index } = current;
  current = null;
  detail.hidden = true;
  document.body.classList.remove("is-locked");
  pageRegions.forEach((region) => { region.inert = false; });
  hangersOf(rack)[index]?.querySelector(".hanger-btn").focus({ preventScroll: true });
}

function step(delta) {
  if (!current) return;
  const count = hangersOf(current.rack).length;
  current.index = (current.index + delta + count) % count;
  fill(current.rack, current.index);
}

document.querySelectorAll(".rack").forEach((rack) => {
  hangersOf(rack).forEach((hanger, index) => {
    hanger.querySelector(".hanger-btn").addEventListener("click", () => openDetail(rack, index));
  });
});

detail.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", closeDetail));
detail.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => step(Number(button.dataset.step)));
});
tabButtons.forEach((button) => button.addEventListener("click", () => showTab(button.dataset.tab)));

document.addEventListener("keydown", (event) => {
  if (!current) return;
  if (event.key === "Escape") closeDetail();
  else if (event.key === "ArrowLeft") step(-1);
  else if (event.key === "ArrowRight") step(1);
});
