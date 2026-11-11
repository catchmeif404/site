const LANGUAGE_KEY = "site-language";
const stored = localStorage.getItem(LANGUAGE_KEY);
const locale = stored === "ko" || (stored === null && navigator.language.startsWith("ko")) ? "ko" : "en";
const tr = (en, ko) => (locale === "ko" ? ko : en);

document.documentElement.lang = locale;
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
  button.addEventListener("click", () => {
    localStorage.setItem(LANGUAGE_KEY, button.dataset.lang);
    window.location.reload();
  });
});
document.title = tr("Shorts Factory — privacy policy | catchmeif404", "Shorts Factory — 개인정보처리방침 | catchmeif404");
