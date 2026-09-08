import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@13.2.0/+esm";
import {
  animate as animeAnimate,
  createTimeline,
} from "https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm";

const state = {
  package: "12 pcs",
  price: 6000,
  glaze: "Chocolate",
  topping: "Oreo crumbs",
  toppingExtra: 0,
};

const summary = document.querySelector(".order-summary");
const priceCards = document.querySelectorAll(".price-card");
const glazeButtons = document.querySelectorAll(".glaze-item");
const tabs = document.querySelectorAll(".tab");
const toppingGrids = document.querySelectorAll(".topping-grid");
const toppingButtons = document.querySelectorAll(".topping");
const themeToggle = document.querySelector(".theme-toggle");
const orderLinks = document.querySelectorAll(".order-link");
const copyStatus = document.querySelector(".copy-status");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const whatsappNumber = "2348063875757";
const instagramUrl = "https://instagram.com/glazedandgo_";
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatPrice(amount) {
  return currencyFormatter.format(amount).replace("NGN", "₦");
}

function getOrderMessage() {
  const toppingLine =
    state.toppingExtra > 0
      ? `${state.topping} (+${formatPrice(state.toppingExtra)})`
      : state.topping;
  const total = state.price + state.toppingExtra;

  return `Hello Glazed and Go, I would like to order:\n\nBox: ${state.package}\nGlaze: ${state.glaze}\nTopping: ${toppingLine}\nTotal: ${formatPrice(total)}`;
}

function updateOrderLinks() {
  const message = encodeURIComponent(getOrderMessage());

  orderLinks.forEach((link) => {
    if (link.dataset.channel === "whatsapp") {
      link.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }

    if (link.dataset.channel === "instagram") {
      link.href = instagramUrl;
    }
  });
}

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
  updateOrderLinks();

  animate(
    summary,
    { scale: [0.98, 1], opacity: [0.7, 1] },
    { duration: 0.34, easing: "ease-out" }
  );
}

orderLinks.forEach((link) => {
  link.addEventListener("click", async (event) => {
    if (link.dataset.channel !== "instagram") {
      return;
    }

    event.preventDefault();

    try {
      await navigator.clipboard.writeText(getOrderMessage());
      copyStatus.textContent = "Order copied. Paste it into Instagram DM.";
    } catch {
      copyStatus.textContent = "Copy this order into Instagram DM: " + getOrderMessage();
    }

    window.open(instagramUrl, "_blank", "noreferrer");
  });
});

priceCards.forEach((card) => {
  if (card.dataset.package === state.package) {
    card.classList.add("selected");
  }

  card.addEventListener("click", () => {
    priceCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    state.package = card.dataset.package;
    state.price = Number(card.dataset.price);
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
    state.toppingExtra = Number(button.dataset.extra);
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

updateOrderLinks();
