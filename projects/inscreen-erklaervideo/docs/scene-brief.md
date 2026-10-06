# Szenen-Briefing für Animatoren (Sub-Agents)

Projekt: `projects/inscreen-erklaervideo/` — 60-s-Erklärvideo „Darum ist InScreen die beste
Insektenschutzlösung für Hebeschiebetüren“, Kundenschulung SCHMIDT, 1920×1080, HyperFrames + GSAP.
Look: verspielt, flach illustriert, eigene Figuren mit Mimik/Gestik — Agentur-Probestück-Qualität.

## Zuerst lesen

1. `design.md` (Farben, Typo, Stilregeln — verbindlich), `docs/fakten.md` (nur diese Produktaussagen)
2. `lib/svg.js` (S/G-Helfer, Palette `SVGK.C`, `rng`), `lib/characters.js` (Figuren + API),
   `lib/door.js` (Hebeschiebetür mit InScreen), `lib/sets.js` (`SETS.makeStage`, Kamera), `lib/anim.js`
   (IK-Greifen, Gehen, Flugbahnen, `ANIM.sfx`, `ANIM.burst`, `ANIM.swoosh`, `ANIM.el`)
3. `lib/main.js` (Szenen-Vertrag, Übergänge), `scenes/s01.js` + `scenes/s02.js` als Stil-Referenz
4. `index.html` (CSS-Klassen `.t-title`, `.t-label`, `.t-body`, `.chip` mit `.bar`)

## Vertrag einer Szene (`scenes/sXX.js`)

```js
(window.SCENES = window.SCENES || {}).sXX = {
  set: "meinset",                       // Name des eigenen Sets; gleiche Namen = kein Set-Wechsel
  setup(R, ctx) {                        // DOM bauen (synchron)
    const st = SETS.makeStage(R.svg, { id: "set-meinset" });  // blaue Bühne, oder eigenes <g>
    R.sets.meinset = st;                 // st.root MUSS das Wurzel-<g> sein (Übergänge clippen es)
    // ... Figuren/Grafiken in st.layer (bzw. eigene Untergruppen) anlegen
  },
  build(ctx, tl, R) {                    // Animation in die Master-Timeline schreiben
    // ctx.t0/ctx.t1 = Szenenfenster (absolut), ctx.vo0/ctx.vo1 = Sprechbeginn/-ende
    // ctx.w("wort") = Startzeit des ersten Worts, das "wort" enthält (Kleinschreibung, Umlaute ok)
    // ctx.w("wort","e") = Wortende, ctx.w("wort","s",1) = zweites Vorkommen
    // Texte gehören in R.huds[ctx.id] (HTML-Ebene dieser Szene), z. B. ANIM.el("div","chip",R.huds[ctx.id],"…")
  },
};
```

- Übergänge zwischen Sets macht `main.js` (Wischer mit Rot/Gelb-Balken, Iris, Scan). **Keine
  Exit-Animationen am Szenenende** — die Szene muss bis `ctx.t1` voll sichtbar sein. Der Übergang
  beginnt ca. 0,28 s vor `ctx.t0` und dauert 0,62 s: in den ersten ~0,35 s nach `ctx.t0` nichts
  Wichtiges platzieren, der Inhalt sollte aber ab `ctx.t0 - 0.3` schon im Startzustand stehen.
- **Alle Zeiten relativ zu Wort-Ankern** (`ctx.w(...)`) oder `ctx.t0/t1` — nie absolute Sekunden.
  Die Fenster sind jetzt noch geschätzt und verschieben sich, sobald die echte ElevenLabs-Stimme da
  ist. Schlüsselbewegungen landen auf dem Anker-Wort (±100 ms). Halte Pausen flexibel: Idle-Loops
  (Atmen, Blinzeln, Schweben) bis `ctx.t1` laufen lassen.

## Harte Regeln (HyperFrames/GSAP)

- Deterministisch: kein `Math.random`, kein `Date`, kein `setTimeout`; `SVGK.rng(seed)` benutzen.
- Kein `repeat: -1`; Wiederholungen aus der Fensterlänge berechnen.
- Alles in die übergebene `tl` (nie freistehende `gsap.to`). `gsap.set` nur im `setup`/für Startzustände.
- Zustände bei exakt t=0 nicht per `tl.set` (nutze `gsap.set`); in eigenen Szenen ist `tl.fromTo`
  für Auftritte gut. Nie dieselbe Eigenschaft desselben Elements zeitgleich aus zwei Tweens animieren.
- SVG-Rotation/Skalierung immer mit `svgOrigin: "0 0"` auf Gruppen, deren Ursprung der Drehpunkt ist
  (Muster: `SVGK.G(parent,{x,y})` liefert innere Gruppe mit Ursprung am Drehpunkt). Figuren-Wurzel
  `ch.root` hat GSAP-`x/y` in Weltkoordinaten.
- Mindestens 3 verschiedene Easings pro Szene, nie `linear`/`none` für sichtbare Bewegungen
  (Ausnahme: Rotoren/Flügel). Antizipation + Overshoot (`back.out`) für den verspielten Look.
- Nur Dateien deiner Szene(n) ändern. `lib/*` und andere Szenen NICHT anfassen — brauchst du eine
  neue Figur oder Grafik, baue sie lokal in deiner Szenen-Datei (gerne mit `CHAR.face`, `CHAR.limb`).
- Marke: Rot nie als große Fläche, Gelb nie als Schrift, Schrift nur Filson Pro (über CSS),
  Listen-Marker `|` statt Punkte/Haken, keine Emojis. Text ≥ 30 px, Headlines ≥ 64 px.
- Figuren leben immer: `ch.breathe`, `ch.blinks`, Blickwechsel.

## Geräusche

`ANIM.sfx(t, name, gainDb, {dur})` an jedem sichtbaren Ereignis setzen (der Mixer legt sie bildgenau an).
Verfügbare Namen: `whoosh`, `whooshSoft`, `swish`, `pop`, `click`, `clunk`, `thud`, `slide`, `zip`,
`boing`, `bonk`, `trip`, `drill`, `ding`, `sparkle`, `tap`, `buzzIn`, `buzzShort`, `breeze`,
`robot`, `beep`, `roll`, `magnet`, `stamp`, `box`, `scribble`, `stars`. Gain 0 dB = Standard, −6 = leiser.

## Prüfen (Pflicht)

```bash
P=/home/user/github/projects/inscreen-erklaervideo
node $P/scripts/dev/snap.mjs $P/index.html /tmp/<dein-ordner>/f 10.2,11.5,13.0 inscreen-erklaervideo 0.4
bash $P/scripts/dev/sheet.sh /tmp/<dein-ordner>/sheet.png 3 /tmp/<dein-ordner>/f_*.png   # Kontaktbogen
```

Stills mit dem Read-Tool ansehen und iterieren, bis Layout, Lesbarkeit und Choreografie stimmen
(keine Überlappungen, nichts angeschnitten, Figuren-Hände treffen ihre Ziele). Achte auf „ERRORS:“
in der Ausgabe — es darf keine geben. Zeitpunkte aus `script/timing.json` (Fenster `winStart/winEnd`,
Wortzeiten `words`) wählen. Danach `cd $P && npx hyperframes lint` (aus dem Repo: `npx --prefix /home/user/github hyperframes lint`).
