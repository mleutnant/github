#!/usr/bin/env python3
"""Baut timing.js (Szenen- und Wortzeiten) aus den VO-Abschnitten.

Mit ElevenLabs-Dateien (assets/audio/vo/sXX.mp3 + sXX.json) kommen die Wortzeiten aus den
Zeichen-Zeitstempeln. Fehlen sie, wird mit einer Sprechgeschwindigkeit geschätzt — so lässt sich
die Animation vorab bauen und später ohne Handarbeit auf die echte Stimme umstellen.

    python3 projects/inscreen-erklaervideo/scripts/build_timing.py
"""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
SEGMENTS = PROJECT / "script" / "vo_segments.json"
VO_DIR = PROJECT / "assets" / "audio" / "vo"
OUT_JS = PROJECT / "timing.js"
OUT_JSON = PROJECT / "script" / "timing.json"

FPS = 30
EST_CHARS_PER_SEC = 15.5  # Schätzung, nur solange keine echte VO vorliegt
INTRO = 0.9  # Musik + erste Bewegung vor dem ersten Wort
OUTRO = 2.9  # Logo-Hold nach dem letzten Wort
# Pause NACH dem jeweiligen Abschnitt (Sekunden). Szenenwechsel bekommen mehr Luft.
GAP_AFTER = {
    "s01": 0.45, "s02": 0.4, "s03": 0.45, "s04": 0.35, "s05": 0.6,
    "s06": 0.95, "s07": 0.4, "s08": 0.45, "s09": 0.3, "s10": 0.45,
}
VISUAL_LEAD = 0.3  # Bildwechsel kommt so viel früher als das erste Wort des Abschnitts


def norm(word: str) -> str:
    return re.sub(r"[^\wäöüÄÖÜß-]", "", word, flags=re.UNICODE)


def words_from_alignment(text: str, alignment: dict) -> list[dict]:
    chars = alignment["characters"]
    starts = alignment["character_start_times_seconds"]
    ends = alignment["character_end_times_seconds"]
    words, cur, ws, we = [], "", None, None
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if cur:
                words.append({"w": cur, "s": ws, "e": we})
            cur, ws, we = "", None, None
            continue
        if ws is None:
            ws = s
        cur += ch
        we = e
    if cur:
        words.append({"w": cur, "s": ws, "e": we})
    return words


def words_estimated(text: str) -> list[dict]:
    tokens = text.split()
    t, words = 0.0, []
    for tok in tokens:
        dur = max(0.14, len(tok) / EST_CHARS_PER_SEC)
        words.append({"w": tok, "s": round(t, 3), "e": round(t + dur, 3)})
        t += dur + 1 / EST_CHARS_PER_SEC
        if tok[-1] in ",:–-":
            t += 0.18
        if tok[-1] in ".?!":
            t += 0.32
    return words


def audio_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main():
    cfg = json.loads(SEGMENTS.read_text(encoding="utf-8"))
    t = INTRO
    segs, source = [], "estimated"
    for seg in cfg["segments"]:
        sid = seg["id"]
        meta = VO_DIR / f"{sid}.json"
        mp3 = next((VO_DIR / f"{sid}.{ext}" for ext in ("mp3", "wav") if (VO_DIR / f"{sid}.{ext}").exists()), VO_DIR / f"{sid}.mp3")
        if mp3.exists() and meta.exists():
            source = "elevenlabs"
            data = json.loads(meta.read_text(encoding="utf-8"))
            words = words_from_alignment(seg["text"], data["alignment"])
            file_dur = audio_duration(mp3)
            file = f"assets/audio/vo/{mp3.name}"
        else:
            words = words_estimated(seg["text"])
            file_dur = words[-1]["e"] + 0.05
            file = None
        speech_start, speech_end = words[0]["s"], words[-1]["e"]
        clip_start = t - speech_start  # Clip so legen, dass das erste Wort exakt bei t liegt
        absw = [
            {"w": w["w"], "k": norm(w["w"]).lower(), "s": round(clip_start + w["s"], 3), "e": round(clip_start + w["e"], 3)}
            for w in words
        ]
        segs.append({
            "id": sid,
            "scene": seg["scene"],
            "text": seg["text"],
            "file": file,
            "clipStart": round(clip_start, 3),
            "fileDur": round(file_dur, 3),
            "start": absw[0]["s"],
            "end": absw[-1]["e"],
            "words": absw,
        })
        t = clip_start + speech_end + GAP_AFTER.get(sid, 0.0)

    total = round(segs[-1]["end"] + OUTRO, 3)
    total = round(round(total * FPS) / FPS, 3)
    for i, s in enumerate(segs):
        s["winStart"] = 0.0 if i == 0 else round(s["start"] - VISUAL_LEAD, 3)
    for i, s in enumerate(segs):
        s["winEnd"] = segs[i + 1]["winStart"] if i + 1 < len(segs) else total

    timing = {"fps": FPS, "total": total, "source": source, "segments": segs}
    OUT_JSON.write_text(json.dumps(timing, ensure_ascii=False, indent=1), encoding="utf-8")
    OUT_JS.write_text(
        "// Generiert von scripts/build_timing.py — nicht von Hand bearbeiten.\n"
        f"window.TIMING = {json.dumps(timing, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    # Gesamtdauer statisch ins HTML schreiben (der HyperFrames-Compiler liest data-duration statisch)
    html = PROJECT / "index.html"
    if html.exists():
        h = html.read_text(encoding="utf-8")
        h = re.sub(r'data-start="0" data-duration="[\d.]+"', f'data-start="0" data-duration="{total}"', h, count=1)
        html.write_text(h, encoding="utf-8")
    print(f"Quelle: {source} · Gesamtlänge {total:.2f} s")
    for s in segs:
        print(f"  {s['id']}  Fenster {s['winStart']:6.2f}–{s['winEnd']:6.2f}  Sprache {s['start']:6.2f}–{s['end']:6.2f}  {s['scene']}")


if __name__ == "__main__":
    main()
