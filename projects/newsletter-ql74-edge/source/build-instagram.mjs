// Rendert die Instagram-Story als PNG: 1080 × 1920 px und in doppelter Auflösung 2160 × 3840 px.
// Aufruf (im Repo-Root): NODE_PATH=/opt/node22/lib/node_modules node projects/newsletter-ql74-edge/source/build-instagram.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'renders', 'instagram');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
// 1x = Instagram-Originalgröße 1080 × 1920; 2x = höchste Qualität 2160 × 3840
for (const [scale, file] of [[1, 'instagram-story-edge.png'], [2, 'instagram-story-edge-2160x3840.png']]) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(path.join(here, 'instagram-story.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#story').screenshot({ path: path.join(out, file) });
  await page.close();
}
await browser.close();
console.log(out);
