# Briefing 9:16 (Social-Fassung) — Szenen fürs Hochformat neu anordnen

Ziel: Das fertige 16:9-Erklärvideo (`index.html`, `scenes/`) als **echte 9:16-Fassung** (1080×1920,
`vertical.html`, `scenes-9x16/`) für Reels/TikTok/Shorts. Gleiche Stimme, gleiche Musik, gleiches
Timing, gleiche Figuren und Gags — jede Szene wird fürs Hochformat **neu komponiert**, nicht beschnitten.

Lies zuerst `docs/scene-brief.md` (Vertrag, harte Regeln, SFX, Prüfwerkzeuge — gilt unverändert) und
die Querformat-Version deiner Szene in `scenes/sXX.js` (das ist die Vorlage). Arbeite NUR in
`scenes-9x16/sXX.js` (dort liegt eine Kopie der Querformat-Version als Ausgangspunkt).
`scenes/`, `lib/`, `index.html`, `vertical.html` NICHT ändern.

## Bildformat und Zonen (1080 × 1920)

- `SVGK.F` = `{ W: 1080, H: 1920, portrait: true }`. `SETS.makeStage` füllt automatisch 1080×1920,
  `SETS.camera` zentriert auf (540, 960): `cam.to(tl,t,{x,y,z})` legt den Weltpunkt (x,y) in die
  Bildmitte (540,960). Tipp: Soll Weltpunkt (wx,wy) bei Bild-y = sy landen → `y = wy + (960 - sy)/z`.
- **Inhaltszone: x 60–1000, y 210–1330.** Oben 0–210 frei (Status-/Fortschrittsleiste der Apps).
- **Untertitel-Zone y 1350–1540 ist reserviert** (wortgenaue Untertitel, `lib/captions.js`, liegen
  über allem). Dort keine Texte, Köpfe, Hände, wichtigen Aktionen.
- Unten 1540–1920 und rechts x > 960 im Bereich y 900–1540 sind App-Bedienelemente → nur Kulisse.
- Figuren und Tür dürfen größer sein als im Querformat (Kamera näher), Texte groß: Headlines ≥ 72 px,
  Chips/Labels ≥ 40 px, nichts unter 32 px. Nebeneinander → **untereinander** stapeln (Panels,
  Chips, Schritt-Listen). Lieber weniger, aber größer.
- Nichts darf seitlich angeschnitten sein, was gelesen werden soll.

## Wohnzimmer-Set (s01, s02, s04, s06, s08, s11)

Wand reicht jetzt bis y −1300, Boden bis y ≈ 2570 — man kann vertikal frei kadrieren. Tür: Welt
x 560–1460, y 170–870, Boden-/Fußlinie der Figuren ≈ y 952. Gute Totale: `cam {x:1010, y:≈750, z:≈1.05}`
(Tür ≈ y 350–1090 im Bild, Anna-Füße ≈ 1170). Halbnah auf Anna/Mücken: z 1.6–2.2.
Jede Szene setzt ihre Kamera beim Start selbst (wie im Querformat).

## Übergänge

`main.js` macht die Übergänge (Wischer/Iris/Scan) automatisch im neuen Format. Für Iris-Übergänge
(in s04 und s11) muss die eingehende Szene ihren Mittelpunkt setzen: `trans: { type: "iris", cx, cy }`
als Eigenschaft im Szenen-Objekt (Bildkoordinaten 1080×1920), z. B. auf Annas Kopf oder die Tür.

## Prüfen

```bash
P=/home/user/github/projects/inscreen-erklaervideo
node $P/scripts/dev/snap.mjs $P/vertical.html /tmp/claude-0/<ordner>/f 10.2,11.5 inscreen-erklaervideo-9x16 0.35
bash $P/scripts/dev/sheet.sh /tmp/claude-0/<ordner>/sheet.png 4 /tmp/claude-0/<ordner>/f_*.png
```
Zeitpunkte aus `script/timing.json` (echte Stimme, Fenster `winStart/winEnd`, Wortzeiten). Prüfe
viele Zeitpunkte deiner Szene inkl. Anfang/Ende; achte auf die Untertitel (dürfen nichts verdecken
und nicht verdeckt werden), Lesbarkeit, Safe-Zonen, Hände am Ziel. Keine „ERRORS:“ (außer einer
fehlenden Audio-Datei). Danach `npx --prefix /home/user/github hyperframes lint` im Projektordner.
