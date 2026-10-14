// Seminar-Banner: erzeugt aus renders/seminar-banner.html die Vorschauseite (alle Varianten und Breiten)
// und rendert die Vorschaubilder.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/seminar-banner/source/build.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const renders = path.join(here, '..', 'renders');
const snippet = readFileSync(path.join(renders, 'seminar-banner.html'), 'utf8');

const style = snippet.match(/^<style>[\s\S]*?^<\/style>/m)[0];
const markup = snippet.slice(snippet.indexOf(style) + style.length).trim();
const blau = markup.replace('class="sch-sb"', 'class="sch-sb sch-sb--blau"');
const ohneBild = markup.replace(/\s*<div class="sch-sb__media">[\s\S]*?<\/div>/, '');

const fonts = path.relative(renders, path.join(here, '..', '..', '..', 'brand-guidelines/default/assets/fonts'));
const face = (file, weight) =>
  `@font-face{font-family:"Filson Pro";src:url("${fonts}/${file}") format("opentype");font-weight:${weight};font-display:block}`;

const section = (title, html, width) => `
  <section>
    <h2>${title}</h2>
    <div class="frame"${width ? ` style="max-width:${width}px"` : ''}>${html}</div>
  </section>`;

const page = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Seminar-Banner Vorschau</title>
<style>
${face('FilsonProRegular.otf', 400)}
${face('FilsonProMedium.otf', 500)}
${face('FilsonProBold.otf', 700)}
body{margin:0;padding:40px 16px 64px;background:#ffffff;color:#000000;font-family:"Filson Pro",Arial,sans-serif}
main{max-width:1280px;margin:0 auto}
h1{margin:0 0 8px;color:#123442;font-size:28px;line-height:1.15}
p.lead{margin:0 0 40px;color:#6e7478;font-size:16px;line-height:1.5}
section{margin:0 0 40px}
h2{margin:0 0 12px;color:#123442;font-size:16px;line-height:1.15;font-weight:700}
.frame{width:100%}
.vorlage img{display:block;width:100%;max-width:766px;height:auto;border:1px solid #c9c9c9}
</style>
${style}
</head>
<body>
<main>
  <h1>Seminar-Banner</h1>
  <p class="lead">Nachbau als HTML-Baustein. Die Breite des Banners richtet sich nach dem Platz, in den er eingefügt wird.</p>
  <section class="vorlage">
    <h2>Vorlage (Screenshot)</h2>
    <img src="../source/vorlage-screenshot.png" alt="Vorlage">
  </section>
  ${section('Nachbau, volle Breite', markup)}
  ${section('Variante Blau', blau)}
  ${section('Ohne Bild', ohneBild)}
  ${section('Schmale Spalte (800 px)', markup, 800)}
  ${section('Smartphone (bis 640 px Breite)', markup, 390)}
</main>
</body>
</html>
`;

const vorschau = path.join(renders, 'vorschau.html');
writeFileSync(vorschau, page);

const browser = await chromium.launch();
const shots = [
  { file: 'vorschau-desktop.png', width: 1360 },
  { file: 'vorschau-mobil.png', width: 390 },
];
for (const { file, width } of shots) {
  const tab = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2 });
  await tab.goto(pathToFileURL(vorschau).href);
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(renders, file), fullPage: true });
  await tab.close();
}

// Hover-Zustand des Buttons als Detailbild
{
  const tab = await browser.newPage({ viewport: { width: 1360, height: 800 }, deviceScaleFactor: 2 });
  await tab.goto(pathToFileURL(vorschau).href);
  await tab.evaluate(() => document.fonts.ready);
  const banner = tab.locator('.sch-sb').first();
  await tab.locator('.sch-sb__btn').first().hover();
  await tab.waitForTimeout(300);
  await banner.screenshot({ path: path.join(renders, 'detail-hover.png') });
  await tab.close();
}

await browser.close();
console.log('fertig:', vorschau);
