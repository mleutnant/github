# InScreen-Erklärvideo — Design System

Kundenschulung „Darum ist InScreen die beste Insektenschutzlösung für Hebeschiebetüren“.
1920×1080, 30 fps, ca. 60 s. Abgeleitet aus `brand-guidelines/default/` (SCHMIDT CD, Stand 08/2024)
und der InScreen-Broschüre 2026. Der Nutzer hat ausdrücklich einen **verspielten, illustrierten
Erklärvideo-Stil mit eigenen Figuren** bestellt — das geht vor dem ruhigen Motion-Stil der
Produktfilme. Marke bleibt über Farben, Typo, Rahmenmotiv und Tonalität erkennbar.

## Colors

Markenfarben (verbindlich, für Typo, Rahmen, UI-Elemente):

- `--sch-blue: #123442` — Hintergrund der Erklär-Einschübe, dunkle Flächen (RAL 5008)
- `--sch-red: #e3002c` — Rahmenlinien, Kreuze, kleine Akzente — nie große Fläche
- `--sch-yellow: #f6a206` — Rahmenlinien, Highlights, Abendlicht — nie Schriftfarbe
- `--sch-white: #ffffff` — Schrift auf Blau
- `--sch-black: #000000` — nur Logo-Wortmarke

Illustrationspalette (Erweiterung nur für Figuren und Kulissen, aus den Markenfarben abgeleitet):

- Blau-Rampe: `#1d4557` `#2c5a6e` `#4b6f80` `#7d9aa7` `#b9cad1` `#e3ebee`
- Abendlicht (Gelb-Rampe): `#f8b73a` `#fbd27f` `#fde6b5` `#fff4dc`
- Cremeweiß / Wand: `#f7f1e6` `#efe5d3` `#e2d3bb`
- Holz (Golden Oak): `#a9632c` `#c47e3f` `#dba468`
- Anthrazitgrau: `#2f353a` `#3a4147` `#566069`
- Grün (gedämpft, blaustichig): `#3f6b5c` `#5a8a72` `#86ae8f` `#b5d0b0`
- Haut: `#f1c39d` `#dd9f74` `#a86c48` · Wangen `#ef8f86`
- Haare: `#5a2e1e` `#2b2421` `#d9d4cc`
- Linien/Schatten auf Hell: `#1d2a31` (Outline-Ton für Augen, Brauen, Münder)

## Typography

Einzige Schrift: **Filson Pro** (`assets/fonts/*.otf`). Headlines Heavy (800) / Black (900),
Labels Bold (700), Fließtext Medium (500). Keine anderen Fonts (Banned-List aus `docs/motion-philosophy.md`).

## Style

- Flache 2D-Vektorillustration, weiche runde Formen, keine Outlines außer Gesichtsdetails.
- Formschatten als dunklere Tönung derselben Farbe, kein Verlauf auf großen Flächen.
- Figuren mit großen Köpfen, ausdrucksstarken Augen/Brauen/Mündern, „Rubber-Hose“-Gliedmaßen.
- Signature: rot-gelbes L-Rahmenmotiv der Marke als Titelrahmen und Übergang.
- Listen mit `|` als Marker (Brand-Regel), keine Emojis, keine Ausrufezeichen-Häufung.

## Motion

- Verspielt, aber präzise: Squash & Stretch, Overshoot (`back.out`), Antizipation vor großen Bewegungen.
- Mindestens 3 Easings pro Szene, nie `linear` für sichtbare Bewegungen (Ausnahme: Flügelschlag-Loops).
- Anchor-Word-Sync: Schlüsselbewegungen landen auf dem gesprochenen Wort (±100 ms) — Zeiten aus
  `timing.js`, erzeugt aus den ElevenLabs-Zeitstempeln.
- Figuren sind nie eingefroren: Atmen, Blinzeln, Blickwechsel laufen immer.

## Don'ts

- Rot nie als große Fläche, Gelb nie als Schrift, nie Rot+Gelb gleichzeitig als Flächen.
- Keine Fremdfonts, keine Emojis, kein Stock-Look, keine Fotos.
- Keine Produktaussagen außerhalb der Broschüre (siehe `docs/fakten.md`).
