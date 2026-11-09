// Newsletter Restplätze Seminar Montage und Technik: erzeugt beide HTML-Fassungen aus template.mjs,
// rendert die Vorschauen und packt das CleverReach-ZIP.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/newsletter-seminare-restplaetze/source/build.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFileSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { render } from './template.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const renders = path.join(here, '..', 'renders');
const html = path.join(renders, 'newsletter-seminare-restplaetze.html');
const images = ['keyvisual-seminare.jpg', 'montage-praxis.jpg', 'mark-dieckmann.jpg', 'logo-schmidt-negativ.png'];

// 1) HTML-Fassungen
writeFileSync(html, render({ cr: false }));
writeFileSync(path.join(renders, 'cleverreach', 'newsletter-seminare-restplaetze-cleverreach.html'), render({ cr: true }));

// 2) Vorschauen (Anrede nur für den Screenshot ersetzt; unter 8000 px Höhe für die Anzeige im Chat)
const browser = await chromium.launch();
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

// 3) CleverReach-ZIP: HTML + Bilder flach (keine Unterordner)
const cr = path.join(renders, 'cleverreach');
for (const f of images) copyFileSync(path.join(renders, 'images', f), path.join(cr, f));
const zip = path.join(renders, 'newsletter-seminare-restplaetze-cleverreach.zip');
rmSync(zip, { force: true });
execFileSync('zip', ['-j', '-q', '-X', zip, ...readdirSync(cr).sort().map((f) => path.join(cr, f))]);
console.log('ok');
