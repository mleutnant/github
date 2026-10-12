import puppeteer from '/home/user/github/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const [,, html, code] = process.argv;
const b = await puppeteer.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',args:['--no-sandbox','--allow-file-access-from-files']});
const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.setViewport({width:1920,height:1080}); await p.goto('file://'+html,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,300));
console.log(JSON.stringify(await p.evaluate(code), null, 1)); if(errs.length) console.log(errs.join('\n')); await b.close();
