// Baut SCHMIDT Intern zu einer einzelnen HTML-Datei:
// Filson Pro (Latin-Subset, woff2), der Logo-Pfad aus brand-guidelines/default und der QR-Code zur App
// (source/qr-app.svg, mit segno erzeugt) werden eingebettet.
// Aufruf: node projects/mitarbeiter-app/source/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");
const out = join(here, "..", "renders", "schmidt-intern.html");

const font = (w) => readFileSync(join(here, "fonts", `filson-${w}.woff2`)).toString("base64");
const logoSvg = readFileSync(join(root, "brand-guidelines", "default", "assets", "logo-schmidt.svg"), "utf8");
const logoPath = /<g class="wm">[\s\S]*?<path d="([^"]+)"/.exec(logoSvg)?.[1].replace(/\s+/g, " ").trim();
if (!logoPath) throw new Error("Wortmarke nicht in logo-schmidt.svg gefunden");

const html = readFileSync(join(here, "app.html"), "utf8")
  .replace("__FONT_400__", font("Regular"))
  .replace("__FONT_500__", font("Medium"))
  .replace("__FONT_700__", font("Bold"))
  .replaceAll("__LOGO_PATH__", logoPath)
  .replace("__QR_SVG__", readFileSync(join(here, "qr-app.svg"), "utf8").trim());

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`geschrieben: ${out} (${Math.round(html.length / 1024)} KB)`);
