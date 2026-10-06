const WHATSAPP = "5585982213913";

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector("#mobile-navigation");

function setMenu(open) {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mobileNav.classList.toggle("is-open", open);
  mobileNav.setAttribute("aria-hidden", String(!open));
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((element) => {
    const delay = Number(element.dataset.revealDelay ?? 0);
    element.style.setProperty("--reveal-delay", `${Math.min(delay, 420)}ms`);
    observer.observe(element);
  });
}

const projectButtons = Array.from(document.querySelectorAll(".project-options button"));
let projectType = "Realismo";
const checkIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

function selectProject(name) {
  projectType = name;
  projectButtons.forEach((button) => {
    const selected = button.dataset.project === name;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    button.innerHTML = `${selected ? checkIcon : ""}${button.dataset.project}`;
  });
}

projectButtons.forEach((button) => {
  button.addEventListener("click", () => selectProject(button.dataset.project));
});

const form = document.querySelector(".booking-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    "Olá, Muell! Vim pelo site e quero solicitar um horário.",
    "",
    `Nome: ${String(data.get("name") ?? "").trim()}`,
    `Cidade: ${String(data.get("city") ?? "").trim()}`,
    `Tipo de projeto: ${projectType}`,
    `Local do corpo: ${String(data.get("placement") ?? "").trim()}`,
    `Tamanho aproximado: ${String(data.get("size") ?? "").trim()}`,
    `Ideia: ${String(data.get("idea") ?? "").trim()}`,
  ].join("\n");

  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});
