// Rendert die LinkedIn-Grafiken (Ersatz für die Tabellen) als PNG: 1200 px breit, 2x = 2400 px.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/newsletter-ql74-edge/source/build-linkedin.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'renders', 'linkedin');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(here, 'linkedin-grafiken.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
for (const id of ['systemdaten', 'glasleisten']) {
  await page.locator(`#${id}`).screenshot({ path: path.join(out, `linkedin-${id}.png`) });
}
await browser.close();
console.log(out);
