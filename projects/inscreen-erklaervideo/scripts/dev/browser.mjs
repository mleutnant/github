// Pfad zum Headless-Chromium: HYPERFRAMES_BROWSER_PATH oder die erste vorhandene Playwright-Installation.
import fs from 'node:fs';
import path from 'node:path';
export function browserPath() {
  if (process.env.HYPERFRAMES_BROWSER_PATH) return process.env.HYPERFRAMES_BROWSER_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const cands = [];
  for (const d of (fs.existsSync(base) ? fs.readdirSync(base) : []).sort().reverse()) {
    if (!d.startsWith('chromium_headless_shell')) continue;
    cands.push(path.join(base, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell'));
    cands.push(path.join(base, d, 'chrome-linux', 'headless_shell'));
  }
  const hit = cands.find((p) => fs.existsSync(p));
  if (!hit) throw new Error('Kein Headless-Chromium gefunden — HYPERFRAMES_BROWSER_PATH setzen');
  return hit;
}
