#!/usr/bin/env python3
"""Sprechertext für das InScreen-Erklärvideo mit ElevenLabs erzeugen.

Erzeugt pro Abschnitt aus ../script/vo_segments.json eine MP3 und eine JSON
mit Zeichen-Zeitstempeln (für die wortgenaue Synchronisation der Animation).

Aufruf (aus dem Repo-Root, nur Python-Standardbibliothek nötig):

    python projects/inscreen-erklaervideo/scripts/vo_elevenlabs.py
    python projects/inscreen-erklaervideo/scripts/vo_elevenlabs.py --only s05 s10 --force

Der API-Key kommt aus ELEVENLABS_API_KEY (Umgebung) oder aus ./.env im Repo-Root.
Ausgabe: projects/inscreen-erklaervideo/assets/audio/vo/sXX.mp3 + sXX.json
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
SEGMENTS_FILE = PROJECT / "script" / "vo_segments.json"
OUT_DIR = PROJECT / "assets" / "audio" / "vo"
API = "https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps"
OUTPUT_FORMATS = ["mp3_44100_192", "mp3_44100_128"]


def find_api_key() -> str:
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if key:
        return key
    for parent in [PROJECT, *PROJECT.parents]:
        env = parent / ".env"
        if env.is_file():
            for line in env.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith("ELEVENLABS_API_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if key:
                        return key
    sys.exit("ELEVENLABS_API_KEY nicht gefunden (weder in der Umgebung noch in .env).")


def post(url: str, key: str, payload: dict) -> tuple[int, dict | str]:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        return err.code, err.read().decode("utf-8", errors="replace")


def payload_variants(text: str, model: str, lang: str, prev_text: str, next_text: str):
    """Von voll ausgestattet bis minimal — nicht jedes Modell kennt jeden Parameter."""
    base = {"text": text, "model_id": model}
    full = dict(base, language_code=lang, previous_text=prev_text, next_text=next_text)
    no_context = dict(base, language_code=lang)
    yield {k: v for k, v in full.items() if v}
    yield no_context
    yield base


def synthesize(seg, idx, segments, cfg, key, state):
    prev_text = segments[idx - 1]["text"] if idx > 0 else ""
    next_text = segments[idx + 1]["text"] if idx + 1 < len(segments) else ""
    models = [state["model"]] if state.get("model") else cfg["model_preference"]
    errors = []
    for model in models:
        for fmt in [state["format"]] if state.get("format") else OUTPUT_FORMATS:
            url = API.format(voice=cfg["voice_id"]) + f"?output_format={fmt}"
            for payload in payload_variants(seg["text"], model, cfg.get("language_code", ""), prev_text, next_text):
                status, body = post(url, key, payload)
                if status == 200 and isinstance(body, dict) and body.get("audio_base64"):
                    state["model"], state["format"] = model, fmt
                    return model, fmt, payload, body
                errors.append(f"{model} / {fmt} / {sorted(payload)} -> HTTP {status}: {str(body)[:300]}")
                if status in (401, 403):
                    sys.exit("ElevenLabs lehnt den Key ab:\n" + errors[-1])
                if status == 429:
                    time.sleep(5)
    sys.exit("Kein Modell/Format hat funktioniert:\n" + "\n".join(errors))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="nur diese Abschnitte, z. B. s05 s10")
    ap.add_argument("--force", action="store_true", help="vorhandene Dateien überschreiben")
    args = ap.parse_args()

    cfg = json.loads(SEGMENTS_FILE.read_text(encoding="utf-8"))
    segments = cfg["segments"]
    key = find_api_key()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    state: dict = {}

    for idx, seg in enumerate(segments):
        if args.only and seg["id"] not in args.only:
            continue
        mp3, meta = OUT_DIR / f"{seg['id']}.mp3", OUT_DIR / f"{seg['id']}.json"
        if mp3.exists() and meta.exists() and not args.force:
            print(f"{seg['id']}: vorhanden, übersprungen (--force zum Überschreiben)")
            continue
        model, fmt, payload, body = synthesize(seg, idx, segments, cfg, key, state)
        mp3.write_bytes(base64.b64decode(body["audio_base64"]))
        alignment = body.get("alignment") or {}
        ends = alignment.get("character_end_times_seconds") or [0]
        meta.write_text(
            json.dumps(
                {
                    "id": seg["id"],
                    "text": seg["text"],
                    "voice_id": cfg["voice_id"],
                    "model_id": model,
                    "output_format": fmt,
                    "request_fields": sorted(payload),
                    "alignment": alignment,
                    "normalized_alignment": body.get("normalized_alignment"),
                },
                ensure_ascii=False,
                indent=1,
            ),
            encoding="utf-8",
        )
        print(f"{seg['id']}: {ends[-1]:.2f} s  ({model}, {fmt})  {seg['text'][:60]}")

    print(f"\nFertig. Dateien liegen in {OUT_DIR}")


if __name__ == "__main__":
    main()
