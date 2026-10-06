# QuinLine® 74 vs. QuinLine® 84 — Systemvergleich (30 s, 16:9)

Showreel-Clip, der die Systemunterschiede der beiden Hebeschiebetür-Systeme zeigt.
Datenquelle: SCHMIDT-Tabelle „Systemunterschiede“ (Größe, Bautiefe, Funktionsgläser, Typen,
Schwellen, U<sub>w</sub>-Wert, eVOMATIC®). Alle Werte 1:1 übernommen.

- Composition: `remotion/src/compositions/quinline/` (`QuinLineVergleich`, Szenen einzeln unter „QuinLine-Szenen“)
- Render: `cd remotion && npm run render -- QuinLineVergleich quinline-vergleich QuinLine_74_vs_84.mp4`
- Ton: `python3 projects/quinline-vergleich/audio/make_soundtrack.py` → `remotion/public/quinline/soundtrack.wav`
  (komplett synthetisch, 120 BPM, −14 LUFS; Hits aus den Beat-Listen der Szenen)

## Ablauf (1 Beat = 15 Frames, 120 BPM)

| Zeit | Szene | Inhalt |
|---|---|---|
| 0–3 s | Auftakt | „Heben. Schieben. Öffnen.“ — zwei Flügel heben sich, gleiten auf, Foto + roter Rahmen |
| 3–5,5 s | Titel | „Systemunterschiede“, 74 / 84 zählen hoch und schrumpfen zu Spaltenköpfen |
| 5,5–9 s | Größe | Türen maßstäblich in der Höhe (2,50 m vs. 2,70 / 2,80 m), Breite bis 7 m |
| 9–12,5 s | Bautiefe | Flügel 74 / 84 mm, Zarge 174 / 198 mm, Profilansichten, Differenz gelb |
| 12,5–15 s | Verglasung | Funktionsgläser bis 46 / 56 mm als Glasquerschnitt |
| 15–17,5 s | Typen | 2- bis 4-teilig, Hinweis „Schema E entfällt bei 3-teilig“ (84) |
| 17,5–21,5 s | Schwellen | 7 Schwellen als Versus-Tabelle, zwei nur bei 74 |
| 21,5–24,5 s | Wärmedämmung | U<sub>w</sub> 0,82 vs. 0,71 W/(m²K), Niedrigenergiehäuser / Passivhaustauglich |
| 24,5–27 s | Antrieb | eVOMATIC® nur bei QuinLine® 84 — Flügel öffnet von selbst |
| 27–30 s | Abschluss | Bildmarken-Rahmen, Logo, „Grenzenlos Wohnen.“, schmidt-boke.de |

Szenenwechsel: „Pane Slide“ — die nächste Szene gleitet wie ein Schiebeflügel mit schwarzem Profil
von rechts ins Bild. Brand: `brand-guidelines/default` (Blau-Fläche, Filson Pro, Gelb als einziger
Akzent in Datenszenen, Rot nur für Rahmen/Logo, Quadrate statt Häkchen).
