const fs = require("fs");
const path = require("path");

const root = process.cwd();
const output = path.join(root, "public");

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "assets"), { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

fs.copyFileSync(
  path.join(root, "assets", "donut-hero.png"),
  path.join(output, "assets", "donut-hero.png")
);
