// Rendert handlungsempfehlungen.html zu PDF (A4) über das vorinstallierte Chromium.
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node build-pdf.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, 'handlungsempfehlungen.html');
const out = path.join(here, '..', 'renders', 'SCHMIDT_Handlungsempfehlungen_Umweltaussagen.pdf');

const footer = `
<div style="width:100%;padding:0 18mm;font-family:Arial,Helvetica,sans-serif;font-size:7pt;color:#6e7478;display:flex;justify-content:space-between;">
  <span>SCHMIDT GmbH · Handlungsempfehlungen Umweltaussagen · Interne Arbeitsunterlage · Stand 05.10.2026</span>
  <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: footer,
  margin: { top: '18mm', right: '18mm', bottom: '20mm', left: '18mm' },
});
await browser.close();
console.log(out);
