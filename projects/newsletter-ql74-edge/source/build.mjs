// Newsletter QuinLine® 74 Edge: erzeugt beide HTML-Fassungen aus template.mjs, rastert das Negativ-Logo,
// rendert die Vorschauen und packt das CleverReach-ZIP.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/newsletter-ql74-edge/source/build.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { readFileSync, writeFileSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { render } from './template.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const renders = path.join(here, '..', 'renders');
const repo = path.join(here, '..', '..', '..');
const html = path.join(renders, 'newsletter-ql74-edge.html');

// 0) HTML-Fassungen erzeugen: komplett und nur Inhaltsbereich (ohne Kopfzeile/Social Media/Fußbereich)
writeFileSync(html, render({ cr: false }));
writeFileSync(path.join(renders, 'cleverreach', 'newsletter-ql74-edge-cleverreach.html'), render({ cr: true }));
writeFileSync(path.join(renders, 'newsletter-ql74-edge-inhalt.html'), render({ cr: false, contentOnly: true }));
writeFileSync(path.join(renders, 'cleverreach-inhalt', 'newsletter-ql74-edge-inhalt-cleverreach.html'), render({ cr: true, contentOnly: true }));
writeFileSync(path.join(renders, 'newsletter-ql74-edge-inhalt-snippet.html'), render({ snippet: true }));

const browser = await chromium.launch();

// 1) Negativ-Logo (komplett weiß, laut Guideline) als PNG, da Gmail & Co. kein SVG anzeigen.
//    Auf die Logo-Kontur zugeschnitten, 300 px breit = 2x für 150 px Anzeigebreite.
{
  const svg = readFileSync(path.join(repo, 'brand-guidelines/default/assets/logo-schmidt-negative.svg'), 'utf8');
  const page = await browser.newPage({ viewport: { width: 1200, height: 600 } });
  await page.setContent(`<html><head><style>svg, svg *{fill:#ffffff !important}</style></head>
    <body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg width="522" ')}</body></html>`);
  const bbox = await page.evaluate(() => {
    const b = document.querySelector('svg').getBBox();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
  const scale = 300 / bbox.width;
  await page.evaluate((w) => document.querySelector('svg').setAttribute('width', String(w)), 522 * scale);
  await page.screenshot({
    path: path.join(renders, 'images', 'logo-schmidt-negativ.png'),
    omitBackground: true,
    clip: { x: bbox.x * scale, y: bbox.y * scale, width: 300, height: Math.ceil(bbox.height * scale) },
  });
  await page.close();
}

// 2) Vorschauen. Die Anrede-Variable des Newsletter-Tools wird nur für den Screenshot ersetzt.
// Skalierung so gewählt, dass die Bilder unter 8000 px Höhe bleiben (Grenze für die Anzeige im Chat).
async function preview(width, file, scale) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeValue.includes('{SALUTATION')) n.nodeValue = 'Sehr geehrter Herr Mustermann,';
    }
  });
  await page.screenshot({ path: path.join(renders, file), fullPage: true, type: 'jpeg', quality: 86 });
  await page.close();
}
await preview(760, 'preview-desktop.jpg', 1.5);
await preview(390, 'preview-mobile.jpg', 1.35);

await browser.close();

// 3) CleverReach-Pakete: HTML mit Editor-Markierungen + Bilder flach in einem ZIP (CleverReach erlaubt keine Unterordner).
function pack(dir, images, zipName) {
  const cr = path.join(renders, dir);
  for (const f of images) copyFileSync(path.join(renders, 'images', f), path.join(cr, f));
  const zip = path.join(renders, zipName);
  rmSync(zip, { force: true });
  execFileSync('zip', ['-j', '-q', zip, ...readdirSync(cr).map((f) => path.join(cr, f))]);
}
pack('cleverreach', ['keyvisual-ql74-edge.jpg', 'mockup-farbuebersicht-kompendium.jpg', 'logo-schmidt-negativ.png'], 'newsletter-ql74-edge-cleverreach.zip');
pack('cleverreach-inhalt', ['keyvisual-ql74-edge.jpg', 'mockup-farbuebersicht-kompendium.jpg'], 'newsletter-ql74-edge-inhalt-cleverreach.zip');
console.log('ok');
