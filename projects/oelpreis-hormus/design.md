# Ölpreis / Straße von Hormus — Headline Wall (18,5 s, 16:9 und 9:16)

Kurzer News-Clip im SCHMIDT-Design. Zwei Schlagzeilen tragen den Film:

- „Brent über 110 Dollar“
- „Ölpreis steigt – Straße von Hormus im Fokus“

Beide sind Props und lassen sich vor jedem Render ändern, ebenso der Wert des Zählers (`brentValue`)
und die Stand-Zeile (`stand`).

- Composition: `remotion/src/compositions/oelpreis/` — `Oelpreis-Hormus` (1920×1080) und `Oelpreis-Hormus-9x16`
  (1080×1920), gleiche Komponente mit zwei Layouts; Szenen einzeln unter „Oelpreis-Szenen“ / „Oelpreis-Szenen-9x16“
- Render 16:9: `cd remotion && npm run render -- Oelpreis-Hormus oelpreis-hormus Oelpreis_Hormus.mp4`
- Render 9:16: `cd remotion && npm run render -- Oelpreis-Hormus-9x16 oelpreis-hormus Oelpreis_Hormus_9x16.mp4`
- 9:16 hält die Social-Safe-Zone ein: Texte innerhalb x 60–940 / y 220–1560 (rechts Buttons, unten Caption bei Reels/TikTok)
- Mit anderen Werten: `npm run render -- Oelpreis-Hormus oelpreis-hormus Oelpreis_Hormus.mp4 --props='{"brentHeadline":"Brent über 110 Dollar","brentValue":110,"hormusHeadline":"Ölpreis steigt – Straße von Hormus im Fokus","stand":"Stand: 27. Oktober 2026"}'`
- Karte: `remotion/src/compositions/oelpreis/geo.ts` (16:9) und `geoPortrait.ts` (9:16), erzeugt mit
  `assets/make-geo.mjs` aus Natural Earth 10m (world-atlas@2.0.2, gemeinfrei). Neu erzeugen:
  `node assets/make-geo.mjs <world-atlas-Ordner> <ziel.ts> [landscape|portrait]` (braucht `d3-geo` und `topojson-client`).

## Ablauf (30 fps, Szenenwechsel per „Pane Slide“ aus dem QuinLine®-Film)

| Zeit | Szene | Inhalt |
|---|---|---|
| 0–5 s | Wand | Wand aus beiden Schlagzeilen, Reihen driften gegeneinander, Kamera fährt auf „Brent über 110 Dollar“ |
| 5–9,5 s | Brent | Schlagzeile links, Zähler bis 110 US-Dollar mit Pegel rechts, roter Rahmen, gelbe Fußlinie |
| 9,5–15 s | Hormus | Karte Persischer Golf / Golf von Oman, Tankerroute stockt an der Meerenge, Schlagzeile im Panel |
| 15–18,5 s | Abschluss | Beide Schlagzeilen, Stand-Zeile, Bildmarken-Rahmen |

Ohne Ton. Selbstkontrolle nach dem Render: `python3 video-use/helpers/timeline_view.py projects/oelpreis-hormus/renders/Oelpreis_Hormus.mp4 0 9.25`
(und `9.25 18.45`).

## Fakten (Stand 27.10.2026)

- Brent am 27.10. vormittags rund 111 US-Dollar je Barrel (comdirect, 10:20 Uhr), Vortagesschluss 110,19.
- Treiber laut Berichten: Angriffe auf Tanker in der Straße von Hormus, Spannungen zwischen USA, Israel und Iran.
- Vor jedem neuen Render den Kurs prüfen und Schlagzeile/Zähler per Props anpassen.
