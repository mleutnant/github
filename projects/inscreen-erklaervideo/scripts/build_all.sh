#!/usr/bin/env bash
# Komplett-Pipeline: Timing aus der Stimme -> SFX-Cues -> Musik/SFX -> Mix -> Render.
#   bash projects/inscreen-erklaervideo/scripts/build_all.sh [draft|standard|high] [16x9|9x16|beide]
# Voraussetzung: VO-Dateien in assets/audio/vo/ (scripts/vo_elevenlabs.py oder vo_from_single.py),
# Node 22, FFmpeg, uv (oder python3 mit numpy+scipy).
set -euo pipefail
P="$(cd "$(dirname "$0")/.." && pwd)"
Q="${1:-high}"
FMT="${2:-beide}"
PY="${PYTHON:-python3}"
run_py() { if command -v uv >/dev/null 2>&1; then uv run "$@"; else "$PY" "$@"; fi; }

echo "1/4 Timing aus der Stimme";            "$PY" "$P/scripts/build_timing.py"
echo "2/4 Musik + Geräusche synthetisieren"; run_py "$P/scripts/audio/synth.py"
cd "$P"
build() { # $1 html, $2 cues, $3 mix, $4 ausgabe
  echo "3/4 Cues + Mix für $1 (-14 / -36 / -12 LUFS)"
  node "$P/scripts/dev/cues.mjs" "$1" "$2"
  run_py "$P/scripts/audio/mix.py" --cues "$2" --out "$3"
  echo "4/4 Render $1 ($Q)"
  npx hyperframes render -c "$1" --quality "$Q" --output "$4"
  echo "Fertig: $P/$4"
}
if [[ "$FMT" == "16x9" || "$FMT" == "beide" ]]; then
  build index.html script/sfx_cues.json assets/audio/mix.wav "renders/inscreen-erklaervideo_16x9_${Q}.mp4"
fi
if [[ "$FMT" == "9x16" || "$FMT" == "beide" ]]; then
  build vertical.html script/sfx_cues_9x16.json assets/audio/mix-9x16.wav "renders/inscreen-erklaervideo_9x16_${Q}.mp4"
fi
