#!/usr/bin/env bash
# Komplett-Pipeline: Timing aus der Stimme -> SFX-Cues -> Musik/SFX -> Mix -> Render.
#   bash projects/inscreen-erklaervideo/scripts/build_all.sh [draft|standard|high]
# Voraussetzung: VO-Dateien in assets/audio/vo/ (scripts/vo_elevenlabs.py), Node 22, FFmpeg, uv (oder python3+numpy+scipy).
set -euo pipefail
P="$(cd "$(dirname "$0")/.." && pwd)"
Q="${1:-high}"
PY="${PYTHON:-python3}"
run_py() { if command -v uv >/dev/null 2>&1; then uv run "$@"; else "$PY" "$@"; fi; }

echo "1/5 Timing aus der Stimme";            "$PY" "$P/scripts/build_timing.py"
echo "2/5 Geräusch-Zeitpunkte aus der Animation"; node "$P/scripts/dev/cues.mjs"
echo "3/5 Musik + Geräusche synthetisieren"; run_py "$P/scripts/audio/synth.py"
echo "4/5 Mix (-14 / -36 / -12 LUFS)";        run_py "$P/scripts/audio/mix.py"
echo "5/5 Render ($Q)"
cd "$P"
npx hyperframes render --quality "$Q" --output "renders/inscreen-erklaervideo_${Q}.mp4"
echo "Fertig: $P/renders/inscreen-erklaervideo_${Q}.mp4"
