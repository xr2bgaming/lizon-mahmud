"use strict";

document.documentElement.classList.add("js");

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* Footer */
$$("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});

/* Mobile navigation */
const menuButton = $(".menu-toggle");
const navigation = $(".navigation");

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
}

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navigation?.classList.toggle("open", !expanded);
});

$$(".navigation a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" &&
      menuButton?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener("click", event => {
  if (!event.target.closest(".header")) closeMenu();
});

window.matchMedia("(min-width: 761px)").addEventListener("change", event => {
  if (event.matches) closeMenu();
});

/* Scroll reveal: content remains visible without JavaScript. */
const revealElements = $$(".reveal");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

/* Pointer spotlight: one frame update per pointer event batch. */
const cursorLight = $(".cursor-light");
let pointerFrame = null;
let pointerX = 0;
let pointerY = 0;
let activeCard = null;

document.addEventListener("pointermove", event => {
  if (!finePointer.matches || reducedMotion.matches) return;

  pointerX = event.clientX;
  pointerY = event.clientY;
  activeCard = event.target.closest(".spotlight");

  if (pointerFrame !== null) return;

  pointerFrame = requestAnimationFrame(() => {
    if (cursorLight) {
      cursorLight.style.left = `${pointerX}px`;
      cursorLight.style.top = `${pointerY}px`;
    }

    if (activeCard) {
      const bounds = activeCard.getBoundingClientRect();
      activeCard.style.setProperty("--mx", `${pointerX - bounds.left}px`);
      activeCard.style.setProperty("--my", `${pointerY - bounds.top}px`);
    }

    pointerFrame = null;
  });
}, { passive: true });

/* Portal controls */
const themes = {
  cyan: {
    accent: "#7cf6ef",
    secondary: "#a68bff",
    rgb: "124, 246, 239",
    label: "CYAN / 01"
  },
  violet: {
    accent: "#b094ff",
    secondary: "#76dfff",
    rgb: "176, 148, 255",
    label: "VIOLET / 02"
  },
  rose: {
    accent: "#ff94bd",
    secondary: "#c4a0ff",
    rgb: "255, 148, 189",
    label: "ROSE / 03"
  },
  amber: {
    accent: "#ffcf86",
    secondary: "#ff95ad",
    rgb: "255, 207, 134",
    label: "AMBER / 04"
  }
};

const root = document.documentElement;
const frequencyLabel = $("#frequency-label");

$$("[data-theme]").forEach(button => {
  button.addEventListener("click", () => {
    const theme = themes[button.dataset.theme];
    if (!theme) return;

    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent-rgb", theme.rgb);

    if (frequencyLabel) frequencyLabel.textContent = theme.label;

    $$("[data-theme]").forEach(swatch => {
      const selected = swatch === button;
      swatch.classList.toggle("selected", selected);
      swatch.setAttribute("aria-pressed", String(selected));
    });
  });
});

const intensity = $("#intensity");
const intensityValue = $("#intensity-value");

intensity?.addEventListener("input", () => {
  const value = Number(intensity.value);
  root.style.setProperty("--core-light", String(value / 100));
  if (intensityValue) intensityValue.textContent = `${value}%`;
});

const motion = $("#motion");

function updateMotion() {
  if (!motion) return;
  document.body.classList.toggle("motion-paused", !motion.checked);
}

if (motion) {
  motion.checked = !reducedMotion.matches;
  updateMotion();
  motion.addEventListener("change", updateMotion);

  reducedMotion.addEventListener("change", event => {
    motion.checked = !event.matches;
    updateMotion();
  });
}

/* Visual initialization sequence */
const launch = $("#launch");
const portalStage = $(".portal-stage");
const stageState = $("#stage-state");
const portalStatus = $("#portal-status");

let initialized = false;
let initializing = false;

launch?.addEventListener("click", () => {
  if (initializing) return;

  if (initialized) {
    initialized = false;
    portalStage?.classList.remove("is-active");
    if (stageState) stageState.textContent = "STANDBY";
    if (portalStatus) portalStatus.textContent = "Portal reset. Ready when you are.";
    launch.innerHTML = 'Initialize portal <span aria-hidden="true">↗</span>';
    return;
  }

  initializing = true;
  launch.disabled = true;
  launch.setAttribute("aria-busy", "true");
  launch.textContent = "Initializing…";

  if (stageState) stageState.textContent = "INITIALIZING";
  if (portalStatus) portalStatus.textContent = "Bringing your atmosphere to life…";

  window.setTimeout(() => {
    initialized = true;
    initializing = false;

    portalStage?.classList.add("is-active");
    if (stageState) stageState.textContent = "PORTAL ACTIVE";
    if (portalStatus) {
      portalStatus.textContent = "Welcome to Aetheria. Your atmosphere is ready.";
    }

    launch.disabled = false;
    launch.removeAttribute("aria-busy");
    launch.innerHTML = 'Reset portal <span aria-hidden="true">↺</span>';
  }, reducedMotion.matches ? 150 : 1400);
});const PROFILE = {
  name: "Lizon Mahmud",
  email: "", // এখানে তোমার email দাও
  bio: "এখানে তোমার short introduction লিখবে",
  about: "এখানে নিজের বিস্তারিত পরিচয় লিখবে"
};