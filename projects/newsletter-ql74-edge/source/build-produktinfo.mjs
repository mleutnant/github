// Rendert produktinfo-edge.html zu PDF (A4, 2 Seiten) über das vorinstallierte Chromium.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/newsletter-ql74-edge/source/build-produktinfo.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, 'produktinfo-edge.html');
const out = path.join(here, '..', 'renders', 'SCHMIDT_Produktinfo_QuinLine74_Edge.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
console.log(out);
