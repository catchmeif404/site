const redacted = document.querySelector(".redacted");
redacted.addEventListener("click", () => {
  redacted.classList.remove("shake");
  // force reflow so the animation can replay on repeated clicks
  void redacted.offsetWidth;
  redacted.classList.add("shake");
});

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
