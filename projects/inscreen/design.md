# InScreen — Video Design System

Abgeleitet aus `brand-guidelines/default/` (SCHMIDT Corporate Design Guideline, Stand August 2024). Werte sind verbindlich — keine Ersetzungen.

## Colors

- `--sch-blue: #123442` — Primärfläche, dunkler Hintergrund (RAL 5008)
- `--sch-red: #e3002c` — Bildmarke, Rahmen, Fokus-Akzent (RAL 3020)
- `--sch-yellow: #f6a206` — Sekundärakzent, Rahmen
- `--sch-white: #ffffff` — Schrift auf Blau, helle Flächen
- `--sch-black: #000000` — Wortmarke, Schrift auf Weiß
- `--sch-blue-90: #24424f` / `--sch-blue-70: #4b656f` — abgeleitete Blautöne für Tiefe/Gradients
- `--sch-grey-60: #6e7478` — gedämpfter Text auf Weiß

## Typography

Einzige Markenschrift: **Filson Pro** (lizenziert, Dateien unter `assets/fonts/*.otf`). Kein Ersatzfont. Gewichte: Light (300), Book (350), Regular (400), Medium (500), Bold (700), Heavy (800), Black (900) — starker Gewichtskontrast für Video (Headline 900/800 vs. Body 350/400).

## Personality

Cinematisch, hochwertig, präzise — Architektur- und Produktfotografie-Ästhetik. Ruhige, kontrollierte Bewegung statt verspielt. Das rote/gelbe Linienmotiv (siehe Broschüren-Cover) ist das wiederkehrende grafische Signature-Element.

## Do's

- Rot/Gelb als Linien-Akzente (Rahmen, Dividers, Reveal-Masken), nicht als große Flächen
- Dunkles Blau als dominanter Video-Hintergrund, Weiß/Cremeweiß für helle Szenen
- Produktfotografie (Terrasse, Wohnraum) großflächig mit leichtem Ken-Burns-Zoom
- Icons aus `assets/icons/` (Broschüren-Icons) im Schwarz/Weiß-Look je nach Untergrund

## Don'ts

- Keine anderen Fonts als Filson Pro
- Kein Rot+Gelb gleichzeitig als Flächenfarbe (nur als dünne Linien/Rahmen, siehe Guideline)
- Keine banned fonts (Inter, Roboto, Poppins, etc. — ohnehin irrelevant, da Filson Pro exklusiv)
- Kein lauter/verspielter Motion-Stil (kein `elastic`/`bounce`) — Premium-Energie: `sine.inOut`, `power1-3`
