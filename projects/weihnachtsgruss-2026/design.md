# Weihnachtsgruß 2026 — Video Design System

Abgeleitet aus `brand-guidelines/default/` (SCHMIDT Corporate Design Guideline, Stand August 2024). Werte sind verbindlich — keine Ersetzungen.

## Format

- 1920 × 1080, 30 fps, 15,0 s, ohne Ton.

## Colors

- `--sch-blue: #123442` — Winterabend-Fläche (Szene 1), RAL 5008
- `--sch-white: #ffffff` — helle Fläche ab Szene 2, Linienzeichnung und Schnee auf Blau
- `--sch-black: #000000` — Schrift auf Weiß
- `--sch-red: #e3002c` — Lichtpunkte, Unterlinie, Bildmarke (RAL 3020)
- `--sch-yellow: #f6a206` — warmes Licht, nur als halbtransparente Fläche über Weiß/Blau, nie als Schrift

Das offizielle Logo-SVG (`assets/SCH_CD_Logo_RGB_Positiv.svg`) bleibt unverändert, auch sein Rot `#E4002C`.

## Typography

Einzige Markenschrift: **Filson Pro** (lizenziert, `assets/fonts/*.otf`).

- Bold (700) — alle Sätze und Headlines, Zeilenabstand 115 %
- Medium (500) — Folgezeile und Absenderzeile
- Regular (400) — Reserve

## Personality

Ruhig, warm, präzise. Das Motiv der Bildmarke — ein Rahmen, hinter dem ein zweiter Flügel gleitet, mit bewussten Unterbrechungen im Strich — trägt die Eröffnung. Kein lauter Weihnachtskitsch.

## Do's

- Flache, hart begrenzte Flächen; Licht als klar umrissene, halbtransparente gelbe Form
- Linien weiß auf Blau, Unterlinie rot 4 px unter der Headline
- Pro Bild nur eine Akzentfarbe: Gelb (Szene 1 bis Anfang 2) und Rot (ab Szene 2) überschneiden sich nur im Übergang
- Eckenradius 0 — einzige runde Formen sind Schneeflocken/Lichtpunkte
- Easings: `power3.out` für Reveals, `sine.inOut` für ruhige Bewegungen, nie `linear`

## Don'ts

- Keine Verläufe, kein Glow, keine Unschärfe, keine Texturen oder Rauschen
- Rot nie als große Fläche, Gelb nie als Schrift
- Keine Bounces/Elastic-Easings, keine Emojis, keine Ausrufezeichen
- Keine anderen Fonts als Filson Pro (Banned Fonts siehe `docs/motion-philosophy.md`)
- Logo nicht animiert zerlegen — es blendet als Ganzes ein und aus

## Platzhalter

- „QuinLine®“ ist in Filson Pro Bold gesetzt, bis eine offizielle QuinLine®-Logodatei vorliegt.
