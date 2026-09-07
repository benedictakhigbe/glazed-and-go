import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@13.2.0/+esm";
import {
  animate as animeAnimate,
  createTimeline,
} from "https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm";

const state = {
  package: "12 pcs",
  glaze: "Chocolate",
  topping: "Oreo crumbs",
};

const summary = document.querySelector(".order-summary");
const priceCards = document.querySelectorAll(".price-card");
const glazeButtons = document.querySelectorAll(".glaze-item");
const tabs = document.querySelectorAll(".tab");
const toppingGrids = document.querySelectorAll(".topping-grid");
const toppingButtons = document.querySelectorAll(".topping");
const themeToggle = document.querySelector(".theme-toggle");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

const savedTheme = localStorage.getItem("glazed-theme");
applyTheme(savedTheme || (systemPrefersDark.matches ? "dark" : "light"));

function updateSummary() {
  summary.innerHTML = `Your box: <strong>${state.package}</strong> with <strong>${state.glaze}</strong> glaze and <strong>${state.topping}</strong>.`;

  animate(
    summary,
    { scale: [0.98, 1], opacity: [0.7, 1] },
    { duration: 0.34, easing: "ease-out" }
  );
}

priceCards.forEach((card) => {
  if (card.dataset.package === state.package) {
    card.classList.add("selected");
  }

  card.addEventListener("click", () => {
    priceCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    state.package = card.dataset.package;
    updateSummary();

    animeAnimate(card, {
      scale: [1, 1.035, 1],
      duration: 440,
      easing: "easeOutBack",
    });
  });
});

glazeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    glazeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.glaze = button.dataset.glaze;
    updateSummary();
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    toppingGrids.forEach((grid) => {
      grid.classList.toggle("active", grid.id === tab.dataset.tab);
    });

    const activeGrid = document.getElementById(tab.dataset.tab);
    animate(
      activeGrid.querySelectorAll(".topping"),
      { opacity: [0, 1], y: [8, 0] },
      { delay: stagger(0.04), duration: 0.28 }
    );
  });
});

toppingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toppingButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.topping = button.dataset.topping;
    updateSummary();

    animeAnimate(button.querySelector(".topping-swatch"), {
      rotate: "1turn",
      scale: [1, 1.08, 1],
      duration: 520,
      easing: "easeOutExpo",
    });
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("glazed-theme", nextTheme);
  applyTheme(nextTheme);

  animeAnimate(themeToggle, {
    scale: [1, 0.94, 1],
    duration: 360,
    easing: "easeOutBack",
  });
});

const timeline = createTimeline({ defaults: { ease: "outExpo" } });
timeline
  .add(".topbar", { opacity: [0, 1], translateY: [-16, 0], duration: 650 })
  .add(".eyebrow", { opacity: [0, 1], translateY: [14, 0], duration: 550 }, "-=320")
  .add("h1", { opacity: [0, 1], translateY: [24, 0], duration: 760 }, "-=360")
  .add(".hero-copy", { opacity: [0, 1], translateY: [14, 0], duration: 560 }, "-=390")
  .add(".hero-actions .button", { opacity: [0, 1], translateY: [12, 0], delay: 70, duration: 480 }, "-=330");

inView(
  ".reveal",
  (element) => {
    animate(
      element,
      { opacity: 1, y: 0 },
      { duration: 0.58, easing: [0.22, 1, 0.36, 1] }
    );
  },
  { margin: "0px 0px -80px 0px" }
);
