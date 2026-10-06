// node snap.mjs <html> <outPrefix> <t1,t2,...> [compId] [scale]
import puppeteer from '/home/user/github/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const [,, html, out, times='0', comp='', scale='0.5'] = process.argv;
const b = await puppeteer.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',args:['--no-sandbox','--allow-file-access-from-files']});
const p = await b.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
await p.setViewport({width:1920,height:1080,deviceScaleFactor:parseFloat(scale)});
await p.goto('file://'+html,{waitUntil:'load'});
await new Promise(r=>setTimeout(r,400)); if (errs.length) console.log('ERRORS:\n'+errs.join('\n'));
for (const t of times.split(',')) {
  if (comp) await p.evaluate((c,t)=>{const tl=window.__timelines[c]; tl.seek(parseFloat(t), false);}, comp, t);
  await p.screenshot({path:`${out}_${t}.png`});
}
if (errs.length) console.log('ERRORS:\n'+errs.join('\n'));
await b.close();
