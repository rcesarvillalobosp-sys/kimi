"use strict";
// Configuración de la página
const DOWNLOAD_URL = "https://github.com/rcesarvillalobosp-sys/kimi/releases/latest/download/Kimi-Windows.exe";
const WHATSAPP = "";   // p. ej. "51999999999"
const VERSION = "1.2.4";

document.querySelectorAll("[data-download]").forEach((a) => { a.href = DOWNLOAD_URL; });
document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = VERSION; });
document.getElementById("year").textContent = new Date().getFullYear();

if (WHATSAPP) {
  const wa = document.getElementById("wa-link");
  wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hola, quiero información de Kimi.");
  wa.hidden = false;
  document.getElementById("contact-line").innerHTML = '¿Tienes otra duda? <a href="' + wa.href + '" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>.';
}

// Cabecera con borde al bajar
const header = document.getElementById("top");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

// Funciones: pestañas accesibles (clic y flechas del teclado)
const tabs = [...document.querySelectorAll(".mod-tab")];
const select = (tab, focus) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
};
tabs.forEach((t, i) => {
  t.addEventListener("click", () => select(t, false));
  t.addEventListener("keydown", (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
    if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
    if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
  });
});

// Videos: se reproducen solo a la vista y nunca solos si la persona prefiere menos movimiento.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const videos = [...document.querySelectorAll("video")];
if (calm) videos.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); v.controls = true; });
const vio = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
  if (calm || target.dataset.paused === "1") return;
  if (isIntersecting) { target.preload = "auto"; target.play().catch(() => {}); } else target.pause();
}), { threshold: 0.35 });
videos.forEach((v) => vio.observe(v));
document.querySelectorAll("[data-video-toggle]").forEach((btn) => {
  const v = document.getElementById(btn.dataset.videoToggle);
  const sync = () => {
    btn.querySelector("[data-icon-pause]").hidden = v.paused;
    btn.querySelector("[data-icon-play]").hidden = !v.paused;
    btn.setAttribute("aria-label", v.paused ? "Reproducir el video" : "Pausar el video");
  };
  btn.addEventListener("click", () => { if (v.paused) { v.dataset.paused = "0"; v.play(); } else { v.dataset.paused = "1"; v.pause(); } });
  v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
});

// Planes: mensual o anual
document.querySelectorAll("[data-cycle]").forEach((b) => b.addEventListener("click", () => {
  const year = b.dataset.cycle === "year";
  document.querySelectorAll("[data-cycle]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  document.querySelectorAll(".plan").forEach((plan) => {
    const price = plan.querySelector("[data-m]");
    price.textContent = "S/ " + Number(year ? price.dataset.y : price.dataset.m).toLocaleString("es-PE");
    plan.querySelector("[data-unit]").textContent = year ? "al año" : "al mes";
    const note = plan.querySelector(".price-note");
    note.textContent = year ? note.dataset.noteY : "";
  });
}));
