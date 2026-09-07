const fs = require("fs");

let html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const js = fs.readFileSync("script.js", "utf8");
const img = fs.readFileSync("assets/donut-hero.png").toString("base64");

html = html.replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`);
html = html.replace('src="assets/donut-hero.png"', `src="data:image/png;base64,${img}"`);
html = html.replace(
  '<script type="module" src="script.js"></script>',
  `<script type="module">${js}</script>`
);

fs.writeFileSync("vercel-import.html", html);
