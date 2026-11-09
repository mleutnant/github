# InScreen-Erklärvideo — „Darum ist InScreen die beste Insektenschutzlösung für Hebeschiebetüren“

60-s-Erklärvideo für Kundenschulungen (SCHMIDT, QuinLine® InScreen), 1920×1080 / 30 fps,
HyperFrames (HTML + SVG + GSAP). Alle Figuren, Kulissen, Musik und Geräusche sind selbst erzeugt
(Code-Illustration bzw. Synthese), keine Stock-Assets.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Wurzel-Komposition (lädt Timing, Bibliotheken, Szenen) |
| `timing.js` / `script/timing.json` | Szenenfenster + Wortzeiten (aus ElevenLabs-Zeitstempeln, sonst geschätzt) |
| `script/vo_segments.json` | Sprechertext in 11 Abschnitten, Stimme, Modell |
| `lib/` | `svg.js` (Helfer, Palette), `characters.js` (Anna, Mücken, Ben, Kind, Opa, Tablett), `door.js` (QuinLine-Hebeschiebetür mit InScreen), `sets.js` (Wohnzimmer, Bühnen, Kamera), `anim.js` (IK, Gehen, SFX-Cues), `main.js` (Master-Timeline, Übergänge) |
| `scenes/s01.js … s11.js` | eine Datei pro Szene, Choreografie an Anker-Wörtern |
| `scripts/vo_elevenlabs.py` | Stimme erzeugen (lokal, Key aus `.env`) |
| `scripts/build_timing.py` | Timing aus den VO-Dateien bauen |
| `scripts/dev/cues.mjs` | Geräusch-Zeitpunkte aus der Animation auslesen |
| `scripts/audio/synth.py` | Musik + Sounddesign synthetisieren |
| `scripts/audio/mix.py` | Mix: Stimme −14 LUFS, Musik −36 LUFS, Gesamt −12 LUFS / ≤ −1 dBTP |
| `scripts/build_all.sh` | alles in einem Rutsch inkl. Render |
| `design.md`, `docs/fakten.md` | Gestaltungsregeln, belegte Produktaussagen (Broschüre 2026) |

## Formate

| Datei | Format | Szenen |
|---|---|---|
| `index.html` | 16:9, 1920×1080 | `scenes/` |
| `vertical.html` | 9:16, 1080×1920 (Social, mit wortgenauen Untertiteln aus `lib/captions.js`) | `scenes-9x16/` |

## Stimme einbinden und rendern

```bash
# Variante A: Stimme per API (lokal, ELEVENLABS_API_KEY in .env) — liefert exakte Wort-Zeitstempel
python projects/inscreen-erklaervideo/scripts/vo_elevenlabs.py
# Variante B: eine komplette MP3 von der ElevenLabs-Website zerlegen (Pausen-Zuordnung, Tempo optional)
uv run projects/inscreen-erklaervideo/scripts/vo_from_single.py <datei.mp3> --tempo 1.06 --max-pause 0.3

bash projects/inscreen-erklaervideo/scripts/build_all.sh high beide   # Timing, Musik, Cues, Mix, Render (16:9 + 9:16)

# Ohne Sprecher (nur Musik −36 LUFS + Geräusche −25 LUFS, kein Ducking) für eine eigene Sprachaufnahme;
# 9:16 wahlweise ohne eingebrannte Untertitel
STIMME=aus bash projects/inscreen-erklaervideo/scripts/build_all.sh high beide
STIMME=aus UNTERTITEL=aus bash projects/inscreen-erklaervideo/scripts/build_all.sh high 9x16
python3 projects/inscreen-erklaervideo/scripts/sprechertext_export.py  # Sprechertext mit Zeitmarken + SRT-Führungsspur
```

Die Animation hängt an den Wort-Zeitstempeln: Mit der echten Stimme verschieben sich alle Szenen
automatisch, Schlüsselbewegungen landen weiterhin auf ihren Anker-Wörtern.

## Sprachfassungen (z. B. Niederländisch)

Die deutsche Fassung bleibt die Quelle. Eine Sprachfassung besteht aus:

| Pfad | Inhalt |
|---|---|
| `script/vo_segments_nl.json` | Sprechertext NL (11 Abschnitte, gleiche IDs) |
| `lang/nl.js` | Wort-Anker (deutscher Schlüssel → NL-Wort), Bildtexte (DE → NL), Phrasen, Untertitel-Schreibweise |
| `lib/i18n.js` | übersetzt Bildtexte beim Setzen (innerHTML/textContent); `ctx.w()` übersetzt Anker in `lib/main.js` |
| `index_nl.html`, `vertical_nl.html` | erzeugt mit `scripts/make_lang_html.py nl` (nach Änderungen an den deutschen Seiten neu erzeugen) |
| `assets/audio/vo_nl/`, `timing_nl.js` | Aufnahme + Timing der Sprachfassung |

`"direkt": true` in `script/vo_segments_nl.json`: Das Video folgt der Aufnahme ohne Extra-Pausen — die MP3
wird unverändert ab 0:00 daruntergelegt, keine Schnitte (Schwellen- und Farbszene laufen dann im gesprochenen Text).

```bash
uv run projects/inscreen-erklaervideo/scripts/vo_from_single.py <nl.mp3> --lang nl --tempo 1.0 --max-pause 0
python3 projects/inscreen-erklaervideo/scripts/build_timing.py --lang nl
uv run projects/inscreen-erklaervideo/scripts/audio/synth.py --timing script/timing_nl.json --music assets/audio/music_nl.wav
node projects/inscreen-erklaervideo/scripts/dev/cues.mjs index_nl.html script/sfx_cues_nl.json
uv run projects/inscreen-erklaervideo/scripts/audio/mix.py --cues script/sfx_cues_nl.json --timing script/timing_nl.json \
  --music assets/audio/music_nl.wav --out assets/audio/mix_nl.wav --no-vo
PRODUCER_DISABLE_GPU=true npx hyperframes render -c index_nl.html --quality high --output renders/nl/inscreen_nl_16x9_high.mp4 --variables '{"captions":false}'
python3 projects/inscreen-erklaervideo/scripts/sprechertext_export.py --lang nl   # Anlege-/Schnittpunkte der NL-Aufnahme
```

**Render-Hinweis:** Immer mit `PRODUCER_DISABLE_GPU=true` rendern (`build_all.sh` setzt das selbst). Mit der
Software-GPU des Browsers erscheinen sonst in manchen Szenen dunkle Rechtecke über Figuren und Tür.

## Vorschau

```bash
cd projects/inscreen-erklaervideo && npx hyperframes preview
```
