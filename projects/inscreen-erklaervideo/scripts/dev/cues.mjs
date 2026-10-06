// Liest die SFX-Cues (ANIM.sfx) aus der Komposition und schreibt script/sfx_cues.json
import puppeteer from '/home/user/github/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const P = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const exe = process.env.HYPERFRAMES_BROWSER_PATH || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const b = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + P + '/index.html', { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 300));
const cues = await p.evaluate(() => (window.SFX_CUES || []).slice().sort((a, b) => a.t - b.t));
writeFileSync(P + '/script/sfx_cues.json', JSON.stringify(cues, null, 1));
console.log(`${cues.length} SFX-Cues -> script/sfx_cues.json`);
if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
await b.close();
