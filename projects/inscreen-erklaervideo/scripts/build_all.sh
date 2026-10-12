#!/usr/bin/env bash
# Komplett-Pipeline: Timing aus der Stimme -> SFX-Cues -> Musik/SFX -> Mix -> Render.
#   bash projects/inscreen-erklaervideo/scripts/build_all.sh [draft|standard|high] [16x9|9x16|beide]
# Schalter (Umgebungsvariablen):
#   STIMME=aus      nur Musik + Geräusche, ohne Sprecher und ohne Ducking (für eine eigene Sprachaufnahme)
#   UNTERTITEL=aus  9:16 ohne eingebrannte Untertitel
# Voraussetzung: VO-Dateien in assets/audio/vo/ (scripts/vo_elevenlabs.py oder vo_from_single.py),
# Node 22, FFmpeg, uv (oder python3 mit numpy+scipy).
set -euo pipefail
P="$(cd "$(dirname "$0")/.." && pwd)"
Q="${1:-high}"
FMT="${2:-beide}"
PY="${PYTHON:-python3}"
run_py() { if command -v uv >/dev/null 2>&1; then uv run "$@"; else "$PY" "$@"; fi; }
MIXARGS=(); SUF=""
if [[ "${STIMME:-an}" == "aus" ]]; then MIXARGS=(--no-vo); SUF="_ohne-stimme"; fi
VARS='{"captions":true}'; SUF9=""
if [[ "${UNTERTITEL:-an}" == "aus" ]]; then VARS='{"captions":false}'; SUF9="_ohne-untertitel"; fi

echo "1/4 Timing aus der Stimme";            "$PY" "$P/scripts/build_timing.py"
echo "2/4 Musik + Geräusche synthetisieren"; run_py "$P/scripts/audio/synth.py"
cd "$P"
build() { # $1 html, $2 cues, $3 mix, $4 ausgabe, $5 optionale Render-Variablen
  echo "3/4 Cues + Mix für $1 (-14 / -36 / -12 LUFS)"
  node "$P/scripts/dev/cues.mjs" "$1" "$2"
  run_py "$P/scripts/audio/mix.py" --cues "$2" --out "$3" ${MIXARGS[@]+"${MIXARGS[@]}"}
  echo "4/4 Render $1 ($Q)"
  npx hyperframes render -c "$1" --quality "$Q" --output "$4" ${5:+--variables "$5"}
  echo "Fertig: $P/$4"
}
if [[ "$FMT" == "16x9" || "$FMT" == "beide" ]]; then
  build index.html script/sfx_cues.json assets/audio/mix.wav "renders/inscreen-erklaervideo_16x9${SUF}_${Q}.mp4"
fi
if [[ "$FMT" == "9x16" || "$FMT" == "beide" ]]; then
  build vertical.html script/sfx_cues_9x16.json assets/audio/mix-9x16.wav "renders/inscreen-erklaervideo_9x16${SUF}${SUF9}_${Q}.mp4" "$VARS"
fi
