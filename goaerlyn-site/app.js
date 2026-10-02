// ===== CONFIG: paste your Make.com webhook URL here =====
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/REPLACE_WITH_YOUR_WEBHOOK";

// Forms → Make (fields + form name + page + timestamp)
document.querySelectorAll("form[data-make]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = form.querySelector(".form-msg") || form.parentElement.querySelector(".form-msg");
    const btn = form.querySelector("button[type=submit]");
    const data = Object.fromEntries(new FormData(form));
    if (data.company_website) return; // honeypot
    data.form = form.dataset.make;
    data.page = location.pathname;
    data.submitted_at = new Date().toISOString();
    data.ref = new URLSearchParams(location.search).get("ref") || "";
    btn.disabled = true;
    try {
      // form-encoded + no-cors = no preflight; Make parses the fields automatically
      await fetch(MAKE_WEBHOOK_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
      form.reset();
      if (msg) { msg.className = "form-msg"; msg.textContent = form.dataset.success || "You're on the list."; }
    } catch {
      if (msg) { msg.className = "form-msg err"; msg.textContent = "That didn't go through. Check your connection and try again."; }
    } finally {
      btn.disabled = false;
    }
  });
});

// "Why this?" toggle
document.querySelectorAll("[data-toggle]").forEach((b) => {
  const target = document.getElementById(b.dataset.toggle);
  b.addEventListener("click", () => {
    const open = target.classList.toggle("open");
    b.setAttribute("aria-expanded", open);
    b.textContent = open ? "Why this? ↑" : "Why this? ↓";
  });
});

// Demo tabs
const stage = document.querySelector(".demo-stage video");
document.querySelectorAll(".demo-tabs button").forEach((t) => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".demo-tabs button").forEach((x) => x.setAttribute("aria-selected", "false"));
    t.setAttribute("aria-selected", "true");
    stage.className = t.dataset.shape;
    stage.poster = t.dataset.poster;
    stage.src = t.dataset.src;
    stage.play().catch(() => {});
  });
});
