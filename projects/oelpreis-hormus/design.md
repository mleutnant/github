# Ölpreis / Straße von Hormus — Headline Wall (18,5 s, 16:9)

Kurzer News-Clip im SCHMIDT-Design. Zwei Schlagzeilen tragen den Film:

- „Brent über 110 Dollar“
- „Ölpreis steigt – Straße von Hormus im Fokus“

Beide sind Props und lassen sich vor jedem Render ändern, ebenso der Wert des Zählers (`brentValue`)
und die Stand-Zeile (`stand`).

- Composition: `remotion/src/compositions/oelpreis/` (`Oelpreis-Hormus`, Szenen einzeln unter „Oelpreis-Szenen“)
- Render: `cd remotion && npm run render -- Oelpreis-Hormus oelpreis-hormus Oelpreis_Hormus.mp4`
- Mit anderen Werten: `npm run render -- Oelpreis-Hormus oelpreis-hormus Oelpreis_Hormus.mp4 --props='{"brentHeadline":"Brent über 110 Dollar","brentValue":110,"hormusHeadline":"Ölpreis steigt – Straße von Hormus im Fokus","stand":"Stand: 27. Oktober 2026"}'`
- Karte: `remotion/src/compositions/oelpreis/geo.ts`, erzeugt mit `assets/make-geo.mjs` aus Natural Earth 10m
  (world-atlas@2.0.2, gemeinfrei). Neu erzeugen: `node assets/make-geo.mjs <world-atlas-Ordner> <ziel.ts>`
  (braucht `d3-geo` und `topojson-client`).

## Ablauf (30 fps, Szenenwechsel per „Pane Slide“ aus dem QuinLine®-Film)

| Zeit | Szene | Inhalt |
|---|---|---|
| 0–5 s | Wand | Wand aus beiden Schlagzeilen, Reihen driften gegeneinander, Kamera fährt auf „Brent über 110 Dollar“ |
| 5–9,5 s | Brent | Schlagzeile links, Zähler bis 110 US-Dollar mit Pegel rechts, roter Rahmen, gelbe Fußlinie |
| 9,5–15 s | Hormus | Karte Persischer Golf / Golf von Oman, Tankerroute stockt an der Meerenge, Schlagzeile im Panel |
| 15–18,5 s | Abschluss | Beide Schlagzeilen, Stand-Zeile, Bildmarken-Rahmen |

## Fakten (Stand 27.10.2026)

- Brent am 27.10. vormittags rund 111 US-Dollar je Barrel (comdirect, 10:20 Uhr), Vortagesschluss 110,19.
- Treiber laut Berichten: Angriffe auf Tanker in der Straße von Hormus, Spannungen zwischen USA, Israel und Iran.
- Vor jedem neuen Render den Kurs prüfen und Schlagzeile/Zähler per Props anpassen.
