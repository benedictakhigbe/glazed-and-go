import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@13.2.0/+esm";
import {
  animate as animeAnimate,
  createTimeline,
} from "https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm";

const glazes = ["Chocolate", "Strawberry", "White chocolate"];
const toppings = [
  { name: "Oreo crumbs", extra: 0 },
  { name: "Rainbow sprinkles", extra: 0 },
  { name: "Crushed biscuits", extra: 0 },
  { name: "M&M's", extra: 600 },
  { name: "Chocolate chips", extra: 600 },
  { name: "White chocolate chips", extra: 600 },
];

const state = {
  package: "12 pcs",
  count: 12,
  price: 6000,
  donuts: [],
};

const summary = document.querySelector(".order-summary");
const priceCards = document.querySelectorAll(".price-card");
const glazeInputs = document.querySelectorAll("[data-glaze-count]");
const glazeBalance = document.querySelector(".glaze-balance");
const donutGrid = document.querySelector(".donut-custom-grid");
const defaultTopping = document.querySelector("[data-default-topping]");
const customDonutDetails = document.querySelector(".custom-donut-details");
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
  return currencyFormatter.format(amount).replace("NGN", "\u20a6");
}

function getDefaultDonuts(count) {
  return Array.from({ length: count }, (_, index) => ({
    glaze: glazes[index % glazes.length],
    topping: toppings[0].name,
  }));
}

function getTopping(name) {
  return toppings.find((topping) => topping.name === name) || toppings[0];
}

function getGlazeCounts() {
  return glazes.map((glaze) => ({
    glaze,
    count: state.donuts.filter((donut) => donut.glaze === glaze).length,
  }));
}

function getPremiumCount() {
  return state.donuts.filter((donut) => getTopping(donut.topping).extra > 0).length;
}

function getRequestedGlazeTotal() {
  return Array.from(glazeInputs).reduce((sum, input) => sum + Math.max(0, Number(input.value) || 0), 0);
}

function isGlazeMixComplete() {
  return getRequestedGlazeTotal() === state.count;
}

function getTotal() {
  return state.price + getPremiumCount() * 600;
}

function getOrderMessage() {
  const glazeLines = getGlazeCounts()
    .filter((item) => item.count > 0)
    .map((item) => `${item.count} ${item.glaze}`)
    .join(", ");
  const donutLines = state.donuts
    .map((donut, index) => `${index + 1}. ${donut.glaze} with ${donut.topping}`)
    .join("\n");
  const premiumLine =
    getPremiumCount() > 0 ? `\nPremium toppings: ${getPremiumCount()} x ${formatPrice(600)}` : "";

  return `Hello Glazed and Go, I would like to order a custom box:\n\nBox: ${state.package}\nGlaze mix: ${glazeLines}\nDonuts:\n${donutLines}${premiumLine}\nTotal: ${formatPrice(getTotal())}`;
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

function updateGlazeInputs() {
  const counts = getGlazeCounts();

  glazeInputs.forEach((input) => {
    const match = counts.find((item) => item.glaze === input.dataset.glazeCount);
    input.max = String(state.count);
    input.value = String(match ? match.count : 0);
  });

  glazeBalance.textContent = `${state.count} of ${state.count} donuts assigned.`;
}

function updateSummary() {
  const glazeText = getGlazeCounts()
    .filter((item) => item.count > 0)
    .map((item) => `<strong>${item.count}</strong> ${item.glaze}`)
    .join(", ");
  const premiumCount = getPremiumCount();
  const premiumText = premiumCount > 0 ? ` Premium toppings: <strong>${premiumCount}</strong>.` : "";

  summary.innerHTML = `Your custom <strong>${state.package}</strong> box: ${glazeText}.${premiumText} Total: <strong>${formatPrice(getTotal())}</strong>.`;
  updateGlazeInputs();
  updateOrderLinks();

  animate(
    summary,
    { scale: [0.98, 1], opacity: [0.7, 1] },
    { duration: 0.34, easing: "ease-out" }
  );
}

function getGlazeClass(glaze) {
  if (glaze === "Strawberry") return "strawberry";
  if (glaze === "White chocolate") return "white";
  return "chocolate";
}

function getToppingClass(topping) {
  if (topping === "Rainbow sprinkles") return "sprinkles";
  if (topping === "Crushed biscuits") return "biscuit";
  if (topping === "M&M's") return "candy";
  if (topping === "Chocolate chips") return "chips";
  if (topping === "White chocolate chips") return "whitechips";
  return "oreo";
}

function getCustomSelectOption(option) {
  return `
    <button
      class="custom-option${option.selected ? " selected" : ""}"
      type="button"
      role="option"
      aria-selected="${option.selected}"
      data-value="${option.value}"
    >
      ${option.swatch ? `<i class="option-dot ${option.swatch}" aria-hidden="true"></i>` : ""}
      <span>${option.label}</span>
      ${option.meta ? `<small>${option.meta}</small>` : ""}
    </button>
  `;
}

function createCustomSelect({ label, value, options, name, index = "" }) {
  const selectedOption = options.find((option) => option.value === value) || options[0];
  const optionMarkup = options
    .map((option) =>
      getCustomSelectOption({
        ...option,
        selected: option.value === selectedOption.value,
      })
    )
    .join("");

  return `
    <div class="custom-select" data-select-name="${name}" data-select-index="${index}">
      <button
        class="custom-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        ${selectedOption.swatch ? `<i class="option-dot ${selectedOption.swatch}" aria-hidden="true"></i>` : ""}
        <span>${selectedOption.label}</span>
        ${selectedOption.meta ? `<small>${selectedOption.meta}</small>` : ""}
      </button>
      <div class="custom-select-menu" role="listbox" aria-label="${label}">
        ${optionMarkup}
      </div>
    </div>
  `;
}

function getToppingOptions(selected) {
  return toppings.map((topping) => ({
    value: topping.name,
    label: topping.name,
    meta: topping.extra > 0 ? `+${formatPrice(topping.extra)} each` : "Regular",
    swatch: getToppingClass(topping.name),
    selected: topping.name === selected,
  }));
}

function getGlazeOptionList(selected) {
  return glazes.map((glaze) => ({
    value: glaze,
    label: glaze,
    swatch: `glaze ${getGlazeClass(glaze)}`,
    selected: glaze === selected,
  }));
}

function closeCustomSelects(except = null) {
  document.querySelectorAll(".custom-select.open").forEach((select) => {
    if (select === except) {
      return;
    }

    select.classList.remove("open");
    select.querySelector(".custom-select-trigger").setAttribute("aria-expanded", "false");
  });
}

function bindCustomSelects(root = document) {
  root.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !select.classList.contains("open");
      closeCustomSelects(select);
      select.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });

    select.querySelectorAll(".custom-option").forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        handleCustomSelect(select, option.dataset.value);
        closeCustomSelects();
      });
    });
  });
}

function handleCustomSelect(select, value) {
  const name = select.dataset.selectName;
  const index = Number(select.dataset.selectIndex);

  if (value === "Custom toppings") {
    customDonutDetails.open = true;
    return;
  }

  if (name === "default-topping") {
    state.donuts = state.donuts.map((donut) => ({
      ...donut,
      topping: value,
    }));
    renderDefaultTopping();
    renderDonutGrid();
    updateSummary();
    return;
  }

  if (name === "donut-glaze") {
    state.donuts[index].glaze = value;
    renderDonutGrid();
    updateSummary();
  }

  if (name === "donut-topping") {
    state.donuts[index].topping = value;
    renderDonutGrid();
    updateSummary();
  }
}

function renderDefaultTopping() {
  const firstTopping = state.donuts[0]?.topping || toppings[0].name;
  const value = state.donuts.every((donut) => donut.topping === firstTopping)
    ? firstTopping
    : "Custom toppings";
  const options = getToppingOptions(value);

  if (value === "Custom toppings") {
    options.unshift({
      value,
      label: value,
      meta: "Mixed per donut",
      swatch: "mixed",
      selected: true,
    });
  }

  defaultTopping.innerHTML = createCustomSelect({
    label: "Main topping",
    value,
    options,
    name: "default-topping",
  });
  bindCustomSelects(defaultTopping);
}

function renderDonutGrid() {
  donutGrid.innerHTML = state.donuts
    .map(
      (donut, index) => `
        <article class="donut-card" data-donut-index="${index}">
          <div class="donut-card-title">
            <span class="donut-swatch ${getGlazeClass(donut.glaze)}"></span>
            <strong>Donut ${index + 1}</strong>
          </div>
          <div class="donut-field">
            <span>Glaze</span>
            ${createCustomSelect({
              label: `Donut ${index + 1} glaze`,
              value: donut.glaze,
              options: getGlazeOptionList(donut.glaze),
              name: "donut-glaze",
              index,
            })}
          </div>
          <div class="donut-field">
            <span>Topping</span>
            ${createCustomSelect({
              label: `Donut ${index + 1} topping`,
              value: donut.topping,
              options: getToppingOptions(donut.topping),
              name: "donut-topping",
              index,
            })}
          </div>
        </article>
      `
    )
    .join("");

  bindCustomSelects(donutGrid);
}

function applyGlazeCounts() {
  const requested = glazes.map((glaze) => {
    const input = document.querySelector(`[data-glaze-count="${glaze}"]`);
    return {
      glaze,
      count: Math.max(0, Number(input.value) || 0),
    };
  });
  const total = requested.reduce((sum, item) => sum + item.count, 0);

  if (total !== state.count) {
    glazeBalance.textContent = `Choose exactly ${state.count} donuts. Current total: ${total}.`;
    return;
  }

  const currentToppings = state.donuts.map((donut) => donut.topping);
  const nextDonuts = requested.flatMap((item) =>
    Array.from({ length: item.count }, () => ({ glaze: item.glaze, topping: toppings[0].name }))
  );

  state.donuts = nextDonuts.map((donut, index) => ({
    ...donut,
    topping: currentToppings[index] || toppings[0].name,
  }));

  renderDonutGrid();
  updateSummary();
}

function resizeBox(card) {
  state.package = card.dataset.package;
  state.count = Number.parseInt(card.dataset.package, 10);
  state.price = Number(card.dataset.price);
  state.donuts = getDefaultDonuts(state.count);
  renderDonutGrid();
  updateSummary();
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

orderLinks.forEach((link) => {
  link.addEventListener("click", async (event) => {
    if (!isGlazeMixComplete()) {
      event.preventDefault();
      const message = `Choose exactly ${state.count} glaze amounts before ordering. Current total: ${getRequestedGlazeTotal()}.`;
      glazeBalance.textContent = message;
      copyStatus.textContent = message;
      document.querySelector("#glazes").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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
    resizeBox(card);

    animeAnimate(card, {
      scale: [1, 1.035, 1],
      duration: 440,
      easing: "easeOutBack",
    });
  });
});

glazeInputs.forEach((input) => {
  input.addEventListener("input", applyGlazeCounts);
});

customDonutDetails.addEventListener("toggle", (event) => {
  if (event.target.open) {
    animate(
      donutGrid.querySelectorAll(".donut-card"),
      { opacity: [0, 1], y: [8, 0] },
      { delay: stagger(0.025), duration: 0.22 }
    );
  }
});

document.querySelectorAll("[data-apply-topping]").forEach((button) => {
  button.addEventListener("click", () => {
    state.donuts = state.donuts.map((donut) => ({
      ...donut,
      topping: button.dataset.applyTopping,
    }));
    renderDonutGrid();
    updateSummary();
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

state.donuts = getDefaultDonuts(state.count);
document.addEventListener("click", () => closeCustomSelects());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCustomSelects();
  }
});
renderDefaultTopping();
renderDonutGrid();
updateSummary();
