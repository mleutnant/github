// Baut die Vorstellungs-PDF „SCHMIDT Intern“ für die Belegschaft.
// Die Abbildungen entstehen aus der echten App (renders/schmidt-intern.html), angemeldet als
// Mitarbeiter aus der Produktion ohne Redaktionsrechte, mit Beispielinhalten statt echter Daten.
// Aufruf: node projects/mitarbeiter-app/source/vorstellung/build.cjs
// Braucht Playwright (global installiert) und Python mit segno für den QR-Code.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { chromium } = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));

const here = __dirname;
const app = path.join(here, "..", "..");
const root = path.join(app, "..", "..");
const brand = path.join(root, "brand-guidelines", "default");
const OUT = path.join(app, "renders", "schmidt-intern-vorstellung.pdf");
const APP_URL = "https://claude.ai/artifact/95L3bzmEWkuLJ9gDAspXuH";
const STAND = "14.10.2026";

const appHtml = fs.readFileSync(path.join(app, "renders", "schmidt-intern.html"), "utf8");
const photo = { img1: "hero-ausblick.png", img2: "terrasse-hebeschiebetuer.png", img3: "innenraum-blick.png", img4: "hero-ausblick.png" };

/* ---------- Beispielinhalte (erfunden, nur für die Abbildungen) ---------- */
const MOCK = `<script>
(() => {
  const iso = (d) => new Date(Date.now() - d * 864e5).toISOString();
  const day = (d) => { const x = new Date(Date.now() + d * 864e5); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const data = {
    news: [
      { id: "n1", pinned: true, category: "Allgemein", title: "Willkommen bei SCHMIDT Intern", images: [{ id: "img1" }], createdAt: iso(0.08),
        body: "Hier finden Sie ab sofort alles, was im Haus wichtig ist: Neuigkeiten und Termine, das SCHMIDT Wiki mit Antworten auf Alltagsfragen, das Telefonbuch mit allen Durchwahlen sowie Formulare und Anleitungen." },
      { id: "n2", category: "Vertrieb", title: "Die neuen Produktfotos sind da", images: [{ id: "img2" }, { id: "img3" }], createdAt: iso(1.2), authorId: "u_erika",
        body: "Für Prospekt und Website wurden neue Bilder der QuinLine® aufgenommen. Hier eine kleine Auswahl." },
      { id: "n3", category: "Personal", title: "Erste-Hilfe-Kurs: noch Plätze frei", createdAt: iso(4), authorId: "u_erika",
        body: "Für den Kurs am 23. Oktober sind noch drei Plätze frei. Anmeldung bei der Personalabteilung." },
    ],
    termine: [
      { id: "t1", title: "Betriebsversammlung", date: day(0), time: "14:00", place: "Kantine" },
      { id: "t2", title: "Erste-Hilfe-Kurs", date: day(9), time: "08:00", place: "Schulungsraum" },
      { id: "t3", title: "Werksferien beginnen", date: day(70) },
    ],
    brett: [
      { id: "u_me", posts: [{ id: "p1", kind: "Biete", title: "Rasenmäher, gut erhalten", text: "Benzin, 46 cm Schnittbreite. Gegen eine Kiste Wasser. Halle 2, Frühschicht.", createdAt: iso(0.04) }] },
      { id: "u_erika", posts: [{ id: "p2", kind: "Suche", title: "Fahrgemeinschaft ab Paderborn", text: "Montag bis Freitag zur Frühschicht. Gern im Wechsel fahren.", createdAt: iso(1) }] },
      { id: "u_max", posts: [{ id: "p3", kind: "Info", title: "Schlüsselbund gefunden", text: "Am Mitarbeiterparkplatz, liegt am Empfang.", createdAt: iso(2) }] },
    ],
    kontakte: [
      { id: "k1", name: "Max Mustermann", abteilung: "Produktion", funktion: "Schichtleitung Frühschicht", durchwahl: "210", mobil: "+49 170 1234567", raum: "Halle 2" },
      { id: "k2", name: "Erika Mustermann", abteilung: "Personal", funktion: "Personalreferentin", durchwahl: "120", email: "erika.mustermann@schmidt-boke.de", raum: "Verwaltung, 1. OG" },
      { id: "k3", name: "Lisa Muster", abteilung: "IT", funktion: "IT-Support", durchwahl: "300", email: "lisa.muster@schmidt-boke.de" },
      { id: "k4", name: "Tom Beispiel", abteilung: "Versand", funktion: "Lagerleitung", durchwahl: "410", raum: "Halle 4" },
      { id: "k5", name: "Paul Probe", abteilung: "Produktion", funktion: "Instandhaltung", durchwahl: "230", mobil: "+49 170 7654321", raum: "Werkstatt" },
    ],
    dokumente: [
      { id: "d1", kind: "file", title: "Urlaubsantrag", category: "Formulare", assetId: "x1", contentType: "application/pdf", sizeBytes: 184000, description: "Ausfüllen, unterschreiben, bei der Führungskraft abgeben.", updatedAt: iso(20) },
      { id: "d2", kind: "file", title: "Hautschutzplan", category: "Arbeitssicherheit", assetId: "x2", contentType: "application/pdf", sizeBytes: 412000, description: "Welche Creme wann: vor, während und nach der Arbeit.", updatedAt: iso(40) },
      { id: "d3", kind: "link", title: "Montageanleitung QuinLine® 74", category: "Anleitungen", url: "https://schmidt-boke.de", updatedAt: iso(12) },
      { id: "d4", kind: "file", title: "WLAN für Gäste", category: "IT & Technik", assetId: "x3", contentType: "application/pdf", sizeBytes: 96000, updatedAt: iso(60) },
    ],
    geburtstage: [
      { id: "u_max", selbst: true, tag: 14, monat: 10, abteilung: "Produktion" },
      { id: "g1", name: "Tom Beispiel", abteilung: "Versand", tag: 16, monat: 10 },
      { id: "u_erika", selbst: true, tag: 22, monat: 10, abteilung: "Personal" },
      { id: "g2", name: "Paul Probe", abteilung: "Produktion", tag: 3, monat: 11 },
      { id: "g3", name: "Lisa Muster", abteilung: "IT", tag: 9, monat: 12 },
      { id: "g4", name: "Anna Beispiel", abteilung: "Vertrieb", tag: 28, monat: 1 },
      { id: "g5", name: "Ben Muster", abteilung: "Produktion", tag: 17, monat: 3 },
    ],
    wiki: [
      { id: "krankmeldung", title: "Wie melde ich mich krank?", category: "Personal & Abwesenheit", updatedAt: iso(3), updatedBy: "u_erika",
        summary: "Melden Sie sich vor Arbeitsbeginn krank und sagen Sie, wie lange Sie voraussichtlich fehlen. Dauert die Krankheit länger als drei Kalendertage, brauchen Sie eine ärztliche Krankschreibung.",
        body: "## So geht es\\n1. Melden Sie sich **vor Arbeitsbeginn** bei Ihrer Schichtleitung krank. Sagen Sie dabei, wie lange Sie voraussichtlich fehlen.\\n2. Dauert die Krankheit länger als drei Kalendertage, lassen Sie sich spätestens am darauffolgenden Arbeitstag ärztlich krankschreiben.\\n3. Gesetzlich Versicherte müssen die Krankschreibung nicht mehr einreichen. Die Praxis meldet sie an die Krankenkasse.\\n\\n## Gut zu wissen\\n- Privat Versicherte reichen die Bescheinigung weiterhin auf Papier ein.\\n- Bei leichten Beschwerden ist eine telefonische Krankschreibung für bis zu fünf Tage möglich.",
        kontakt: "Personalabteilung, Durchwahl 120" },
      { id: "arbeitsunfall", title: "Was tun bei einem Arbeitsunfall?", category: "Arbeitssicherheit", updatedAt: iso(6), summary: "Erste Hilfe leisten oder holen, die Führungskraft informieren und jede Verletzung ins Verbandbuch eintragen." },
      { id: "urlaub", title: "Wie beantrage ich Urlaub?", category: "Personal & Abwesenheit", updatedAt: iso(8), summary: "Mit dem Urlaubsantrag unter Dokumente, abzugeben bei Ihrer Führungskraft." },
      { id: "schicht", title: "Wie tausche ich eine Schicht?", category: "Arbeitszeit & Lohn", updatedAt: iso(10), summary: "Tausch mit einer Kollegin oder einem Kollegen absprechen und von der Schichtleitung bestätigen lassen." },
      { id: "it-hilfe", title: "Wen rufe ich bei einem IT-Problem an?", category: "IT & Technik", updatedAt: iso(15), summary: "Den IT-Support unter Durchwahl 300." },
      { id: "app-durchwahl", title: "Wie rufe ich eine Durchwahl von außen an?", category: "SCHMIDT Intern", updatedAt: iso(20), summary: "Zentrale +49 5250 9845 und dann die Durchwahl." },
    ],
  };
  const people = { u_me: "Jonas Beispiel", u_erika: "Erika Mustermann", u_max: "Max Mustermann" };
  const snap = (arr) => ({ docs: arr.map((o) => ({ id: o.id, exists: true, data: () => { const { id, ...r } = o; return r; } })) });
  const db = {
    collection: (n) => ({ onSnapshot: (cb) => { setTimeout(() => cb(snap(data[n] || [])), 30); return () => {}; }, doc: () => ({ set: async () => {} }) }),
    doc: () => ({ get: async () => ({ exists: true, data: () => ({ newsSeenAt: iso(1) }) }), set: async () => {}, update: async () => {}, delete: async () => {} }),
  };
  const user = {
    me: async () => ({ id: "u_me", name: "Jonas Beispiel", canEdit: false, isOwner: false }),
    profiles: async (ids) => Object.fromEntries(ids.map((i) => [i, { id: i, name: people[i] || "", avatarUrl: "" }])),
  };
  try { Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => {} } }); } catch (e) {}
  window.claude = { use: async (n) => (n === "db" ? db : n === "user" ? user : null) };
})();
</script>`;
const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${MOCK}${appHtml}</body></html>`;

/* ---------- Abbildungen ---------- */
const PHONE = { width: 390, height: 844 };
const SHOTS = [
  { name: "start", hash: "" },
  { name: "bilder", hash: "", scrollTo: ".post:nth-of-type(2)", offset: 70 },
  { name: "gb", hash: "", scrollTo: "#h-gb", offset: 76 },
  { name: "kalender", hash: "#geburtstage" },
  { name: "brett", hash: "", scrollTo: "#h-brett", offset: 76 },
  { name: "aushang", hash: "", scrollTo: "#h-brett", offset: 76, act: async (p) => {
    await p.click("#brettTools button");
    await p.selectOption("#f-kind", "Suche");
    await p.fill("#f-title", "Fahrgemeinschaft ab Delbrück");
    await p.fill("#f-text", "Zur Spätschicht, Montag bis Freitag. Halle 3, Durchwahl 245.");
    await p.evaluate(() => document.activeElement && document.activeElement.blur());
  } },
  { name: "wiki", hash: "#wiki" },
  { name: "artikel", hash: "#wiki-krankmeldung" },
  { name: "telefonbuch", hash: "#telefonbuch", scrollTo: "#h-pb", offset: 70, act: async (p) => {
    await p.click("button.dw >> text=410");
  } },
  { name: "dokumente", hash: "#dokumente", scrollTo: "#h-docs", offset: 70 },
  { name: "pc", hash: "", desktop: true },
];

async function shoot() {
  const browser = await chromium.launch();
  const out = {};
  for (const s of SHOTS) {
    const ctx = await browser.newContext({
      viewport: s.desktop ? { width: 1280, height: 800 } : PHONE, deviceScaleFactor: 2,
      colorScheme: "light", locale: "de-DE", timezoneId: "Europe/Berlin", isMobile: !s.desktop, hasTouch: !s.desktop,
    });
    const p = await ctx.newPage();
    await p.clock.setFixedTime(new Date("2026-10-14T07:40:00+02:00"));
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.route("https://app.local/**", (r) => {
      const u = new URL(r.request().url());
      if (u.pathname.startsWith("/_blob/")) return r.fulfill({ path: path.join(brand, "assets", "img", photo[u.pathname.slice(7)] || photo.img1) });
      return r.fulfill({ contentType: "text/html; charset=utf-8", body: doc });
    });
    await p.goto("https://app.local/" + s.hash);
    await p.waitForTimeout(500);
    if (s.scrollTo) await p.evaluate(([sel, off]) => { const el = document.querySelector(sel); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off); }, [s.scrollTo, s.offset || 0]);
    if (s.act) await s.act(p);
    await p.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.loading = "eager"; i.onload = i.onerror = r; }))));
    await p.waitForTimeout(350);
    const buf = await p.screenshot({ type: "jpeg", quality: 86 });
    if (errors.length) throw new Error(`${s.name}: ${errors.join("; ")}`);
    out[s.name] = "data:image/jpeg;base64," + buf.toString("base64");
    await ctx.close();
  }
  await browser.close();
  return out;
}

/* ---------- Folien ---------- */
const font = (w) => fs.readFileSync(path.join(app, "source", "fonts", `filson-${w}.woff2`)).toString("base64");
const logoSvg = fs.readFileSync(path.join(brand, "assets", "logo-schmidt.svg"), "utf8");
const logoPath = /<g class="wm">[\s\S]*?<path d="([^"]+)"/.exec(logoSvg)[1].replace(/\s+/g, " ");
const LOGO = (cls) => `<svg class="logo ${cls || ""}" viewBox="62 62 398 65" role="img" aria-label="SCHMIDT"><g fill="#e3002c"><polygon points="142.83,75.14 142.83,83.44 151.26,83.44 151.26,116.95 142.83,116.95 142.83,125.25 159.56,125.25 159.56,75.14"/><polygon points="62.62,62.62 62.62,125.25 79.31,125.25 79.31,116.95 70.92,116.95 70.92,70.92 130.32,70.92 130.33,116.92 91.81,116.92 91.81,83.44 126.11,83.44 126.11,75.14 83.51,75.14 83.51,125.22 138.63,125.22 138.62,62.62"/></g><path fill="currentColor" d="${logoPath}"/></svg>`;
const icon = (name) => fs.readFileSync(path.join(brand, "assets", "icons", name + ".svg"), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/, "").replace(/<svg /, '<svg class="ic" aria-hidden="true" ');
const qr = execSync(`python3 -c "import segno,sys; sys.stdout.write(segno.make('${APP_URL}', error='m').svg_inline(scale=5, border=0, dark='#123442', omitsize=True))"`).toString();

const phone = (img, alt) => `<figure class="phone"><img src="${img}" alt="${alt}"></figure>`;
const bullets = (items) => `<ul class="b">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;
const foot = (n) => `<div class="foot">${n} | ${STAND}</div>`;
const note = `<div class="note">Abbildungen mit Beispielinhalten. Namen, Termine und Durchwahlen sind erfunden.</div>`;

function featureSlide(n, kicker, title, items, phones) {
  return `<section class="slide">
  ${LOGO("left")}
  <div class="text">
    <div class="kicker">${kicker}</div>
    <h2>${title}</h2>
    <div class="rrule"></div>
    ${bullets(items)}
  </div>
  <div class="field"></div><div class="field-rule"></div>
  <div class="phones n${phones.length}">${phones.join("")}</div>
  ${note}${foot(n)}
</section>`;
}

function slides(img) {
  return [
    `<section class="slide title">
  ${LOGO("left")}
  <div class="text">
    <div class="kicker">Die neue Mitarbeiter-App</div>
    <h1>SCHMIDT Intern</h1>
    <div class="rrule"></div>
    <p class="lead">Neuigkeiten, Antworten, Durchwahlen und Formulare. An einem Ort, auf dem Handy und am PC.</p>
  </div>
  <div class="field"></div><div class="field-rule"></div>
  <div class="phones n1">${phone(img.start, "Startseite der App am Handy")}</div>
  ${foot(1)}
</section>`,
    `<section class="slide overview">
  ${LOGO("left")}
  <div class="head">
    <div class="kicker">Überblick</div>
    <h2>Vier Bereiche, eine App</h2>
    <div class="rrule"></div>
  </div>
  <div class="cols">
    <div><h3>Aktuelles</h3>${bullets(["Mitteilungen aus Geschäftsführung, Personal und Produktion", "Termine und Geburtstage", "Schwarzes Brett für alle"])}</div>
    <div><h3>Wiki</h3>${bullets(["Antworten auf Alltagsfragen", "Von der Krankmeldung bis zum Arbeitsunfall", "Mit Ansprechpartner"])}</div>
    <div><h3>Telefonbuch</h3>${bullets(["Alle Kolleginnen und Kollegen", "Suche nach Name, Abteilung oder Durchwahl", "Antippen kopiert die Nummer"])}</div>
    <div><h3>Dokumente</h3>${bullets(["Formulare wie der Urlaubsantrag", "Anleitungen und Arbeitsschutz", "Immer die aktuelle Fassung"])}</div>
  </div>
  <div class="band">
    <div class="band-in">${icon("tablet-handy")}<p><strong>Am Handy, am PC oder am Terminal in der Halle.</strong> Sie sehen überall dasselbe. Inhalte pflegt die Redaktion, damit sie stimmen.</p></div>
  </div>
  ${foot(2)}
</section>`,
    featureSlide(3, "Aktuelles", "Was im Haus los ist", [
      "Mitteilungen aus Geschäftsführung, Personal und Produktion, auch mit Fotos",
      "Ein gelbes „Neu“ zeigt, was Sie noch nicht gelesen haben",
      "Die nächsten Termine auf einen Blick, heute ist blau hervorgehoben",
    ], [phone(img.start, "Neuigkeiten am Handy"), phone(img.bilder, "Beitrag mit Fotos am Handy")]),
    featureSlide(4, "Geburtstage", "Wer hat heute Geburtstag?", [
      "Unter Aktuelles sehen Sie immer, wer als Nächstes Geburtstag hat",
      "Im Kalender sehen Sie das ganze Jahr, Monat für Monat",
      "Freiwillig: Sie tragen Ihren Geburtstag selbst ein, nur Tag und Monat, und können ihn jederzeit entfernen",
    ], [phone(img.gb, "Geburtstage unter Aktuelles"), phone(img.kalender, "Geburtstagskalender am Handy")]),
    featureSlide(5, "Schwarzes Brett", "Ihr Aushang, ohne Pinnwand", [
      "Biete, Suche oder Info: Jede und jeder kann einen Aushang machen",
      "Ihr Name steht dabei, damit man weiß, wen man ansprechen kann",
      "Eigene Aushänge können Sie abhängen, nach 90 Tagen verschwinden sie von selbst",
    ], [phone(img.brett, "Schwarzes Brett am Handy"), phone(img.aushang, "Neuen Aushang schreiben")]),
    featureSlide(6, "Wiki", "Antworten auf Alltagsfragen", [
      "Wie melde ich mich krank? Wie tausche ich eine Schicht? Was tun bei einem Arbeitsunfall?",
      "Oben steht kurz das Wichtigste, darunter Schritt für Schritt",
      "Mit Ansprechpartner, damit Sie wissen, wen Sie fragen können",
    ], [phone(img.wiki, "Wiki-Übersicht am Handy"), phone(img.artikel, "Wiki-Artikel zur Krankmeldung")]),
    featureSlide(7, "Telefonbuch und Dokumente", "Jede Durchwahl, jedes Formular", [
      "Suchen nach Name, Abteilung oder Durchwahl",
      "Durchwahl antippen: Die ganze Nummer mit Vorwahl ist kopiert",
      "Formulare, Anleitungen und Arbeitsschutz zum Öffnen am Handy",
    ], [phone(img.telefonbuch, "Telefonbuch am Handy"), phone(img.dokumente, "Dokumente am Handy")]),
    `<section class="slide pc">
  ${LOGO("left")}
  <div class="text">
    <div class="kicker">Am PC und am Terminal</div>
    <h2>Mehr Platz, gleiche App</h2>
    <div class="rrule"></div>
    ${bullets(["Am großen Bildschirm stehen Neuigkeiten, Termine und Schwarzes Brett nebeneinander", "Ideal für das gemeinsame Terminal in Pausenraum oder Halle", "Kein Programm zu installieren, die App läuft im Browser"])}
  </div>
  <div class="field"></div><div class="field-rule"></div>
  <figure class="browser"><div class="bar"><span></span></div><img src="${img.pc}" alt="Startseite der App am PC"></figure>
  ${note}${foot(8)}
</section>`,
    `<section class="slide closing">
  <div class="blue-full">
    ${LOGO("left neg")}
    <div class="close-text">
      <div class="kicker">Ihre Meinung zählt</div>
      <h2>Was fehlt Ihnen noch?</h2>
      <p>Sagen Sie uns, was Sie in der App vermissen oder was wir besser machen können. Wir bauen sie mit Ihnen weiter.</p>
    </div>
    <div class="qr-box">${qr}<p>Zur App</p></div>
  </div>
  <div class="yfoot"></div>
  ${foot(9)}
</section>`,
  ].join("\n");
}

const CSS = `
@font-face{font-family:"Filson Pro";src:url(data:font/woff2;base64,${font("Regular")}) format("woff2");font-weight:400}
@font-face{font-family:"Filson Pro";src:url(data:font/woff2;base64,${font("Medium")}) format("woff2");font-weight:500}
@font-face{font-family:"Filson Pro";src:url(data:font/woff2;base64,${font("Bold")}) format("woff2");font-weight:700}
@page{size:1280px 720px;margin:0}
:root{--blue:#123442;--red:#e3002c;--yellow:#f6a206;--ink:#000;--muted:#5b656b;--tint:#eef1f2}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff}
body{font-family:"Filson Pro",Arial,Helvetica,sans-serif;font-weight:500;color:var(--ink);-webkit-font-smoothing:antialiased}
.slide{position:relative;width:1280px;height:720px;overflow:hidden;background:#fff;break-after:page;page-break-after:always}
.slide:last-child{break-after:auto;page-break-after:auto}
.logo{position:absolute;top:40px;height:26px;width:auto;color:#000;z-index:3}
.logo.left{left:56px}
.logo.neg{color:#fff}
.foot{position:absolute;left:56px;bottom:22px;font-size:11px;font-weight:500;z-index:3}
.note{position:absolute;right:56px;bottom:22px;font-size:11px;font-weight:400;color:var(--muted);z-index:3}
.kicker{font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--red)}
h1{font-size:56px;line-height:1.1;letter-spacing:-.01em;color:var(--blue);margin:12px 0 0;font-weight:700}
h2{font-size:38px;line-height:1.15;letter-spacing:-.01em;color:var(--blue);margin:12px 0 0;font-weight:700;text-wrap:balance}
h3{font-size:22px;line-height:1.15;color:var(--blue);margin:0 0 16px;font-weight:700}
.rrule{height:4px;width:96px;background:var(--red);margin:24px 0 28px}
.text{position:absolute;left:56px;top:150px;width:470px;z-index:2}
.lead{font-size:21px;line-height:1.45;margin:0;max-width:26ch}
ul.b{list-style:none;margin:0;padding:0;font-size:18px;line-height:1.45}
ul.b li{position:relative;padding-left:18px;margin-bottom:16px}
ul.b li::before{content:"";position:absolute;left:0;top:5px;width:2px;height:18px;background:var(--red)}
.field{position:absolute;left:600px;right:0;top:0;height:560px;background:var(--blue)}
.field-rule{position:absolute;left:600px;right:0;top:560px;height:8px;background:var(--yellow)}
.field::before,.field::after{content:"";position:absolute;background:var(--red)}
.field::before{left:-20px;bottom:-20px;width:6px;height:64px}
.field::after{left:-20px;bottom:-20px;width:64px;height:6px}
.phones{position:absolute;top:58px;display:flex;gap:36px;z-index:2}
.phones.n1{left:780px}
.phones.n2{left:650px}
.phone{margin:0;width:278px;padding:10px;background:#0b1418;border-radius:40px;box-shadow:0 18px 44px rgba(18,52,66,.28)}
.phone img{display:block;width:258px;height:558px;border-radius:30px;object-fit:cover;object-position:top}
.overview .head{position:absolute;left:56px;top:120px}
.overview .cols{position:absolute;left:56px;right:56px;top:298px;display:grid;grid-template-columns:repeat(4,1fr);gap:40px}
.overview ul.b{font-size:16px}
.overview ul.b li{margin-bottom:10px}
.overview ul.b li::before{top:3px;height:17px}
.band{position:absolute;left:0;right:0;bottom:56px;height:112px;background:var(--blue)}
.band::after{content:"";position:absolute;left:0;right:0;bottom:-8px;height:8px;background:var(--yellow)}
.band-in{position:absolute;left:56px;right:56px;top:0;bottom:0;display:flex;align-items:center;gap:24px;color:#fff}
.band-in p{margin:0;font-size:19px;line-height:1.4;max-width:70ch}
.band-in strong{font-weight:700}
.ic{width:58px;height:58px;flex:none;color:#fff}
.pc .text{width:440px}
.pc .field{left:540px}
.pc .field-rule{left:540px}
.browser{position:absolute;left:600px;top:110px;width:640px;margin:0;background:#fff;border:1px solid #c9d1d5;border-radius:8px;overflow:hidden;box-shadow:0 18px 44px rgba(18,52,66,.28);z-index:2}
.browser .bar{height:26px;background:#e9edef;border-bottom:1px solid #d4dbde;display:flex;align-items:center;padding:0 12px}
.browser .bar span{display:block;height:12px;width:220px;background:#fff;border-radius:6px;margin:0 auto}
.browser img{display:block;width:100%;height:auto}
.closing .blue-full{position:absolute;left:0;right:0;top:0;height:640px;background:var(--blue);color:#fff}
.closing .yfoot{position:absolute;left:0;right:0;top:640px;height:8px;background:var(--yellow)}
.closing .close-text{position:absolute;left:56px;top:200px;width:620px}
.closing h2{color:#fff;font-size:52px}
.closing .kicker{color:rgba(255,255,255,.8)}
.closing p{font-size:21px;line-height:1.45;margin:22px 0 0;color:rgba(255,255,255,.92)}
.closing .qr-box{position:absolute;right:96px;top:196px;background:#fff;padding:22px 22px 14px;text-align:center}
.closing .qr-box svg{display:block;width:210px;height:210px}
.closing .qr-box p{color:var(--blue);font-weight:700;font-size:16px;margin:10px 0 0}
`;

(async () => {
  const img = await shoot();
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>SCHMIDT Intern – Vorstellung</title><style>${CSS}</style></head><body>${slides(img)}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.pdf({ path: OUT, width: "1280px", height: "720px", printBackground: true, preferCSSPageSize: true });
  if (process.argv[2]) fs.writeFileSync(process.argv[2], html);
  await browser.close();
  console.log(`geschrieben: ${OUT} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
})().catch((e) => { console.error(e); process.exit(1); });
