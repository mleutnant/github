# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "scipy"]
# ///
"""Mischt Stimme, Musik und Geräusche bildgenau und normalisiert auf die Zielpegel.

    uv run projects/inscreen-erklaervideo/scripts/audio/mix.py

Zielwerte (Vorgabe): Stimme -14 LUFS, Musik -36 LUFS (mit leichtem Ducking unter der Stimme),
fertiger Mix -12 LUFS integriert bei max. -1 dBTP. Gemessen mit FFmpeg ebur128 (ITU-R BS.1770).
Eingaben: script/timing.json, script/sfx_cues.json (scripts/dev/cues.mjs), assets/audio/music.wav,
assets/audio/vo/sXX.mp3. Ausgabe: assets/audio/mix.wav + assets/audio/stems/*.wav + script/loudness.json
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synth  # noqa: E402

SR = synth.SR
PROJECT = Path(__file__).resolve().parents[2]
AUD = PROJECT / "assets" / "audio"
TARGET_VO, TARGET_MUSIC, TARGET_SFX, TARGET_MIX, TP_MAX = -14.0, -36.0, -25.0, -12.0, -1.0
DUCK_DB = -4.0


def measure(st):
    """Integrierte Lautheit (LUFS) + True Peak (dBTP) per FFmpeg ebur128."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        path = f.name
    wavfile.write(path, SR, np.clip(st.T, -4, 4).astype(np.float32))
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    Path(path).unlink(missing_ok=True)
    summ = out[out.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+|-inf) LUFS", summ).group(1).replace("-inf", "-120"))
    tp = re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summ)
    return i, float(tp.group(1).replace("-inf", "-120")) if tp else None


def db(x):
    return 10 ** (x / 20)


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def loudest_rms(x, win=0.25):
    """RMS des lautesten 250-ms-Fensters — kurze Klicks und lange Ausklinger klingen gleich laut."""
    n = max(1, int(win * SR))
    if len(x) <= n:
        return float(np.sqrt(np.mean(x ** 2)))
    c = np.cumsum(np.concatenate([[0.0], x ** 2]))
    return float(np.sqrt(np.max(c[n:] - c[:-n]) / n))


def smooth_gate(n, intervals, att=0.12, rel=0.45):
    g = np.zeros(n)
    for a, b in intervals:
        g[max(0, int(a * SR)): min(n, int(b * SR))] = 1.0
    # asymmetrische Glättung: schnell runter (att), langsam hoch (rel)
    out = np.zeros(n)
    ka, kr = 1 - np.exp(-1 / (att * SR)), 1 - np.exp(-1 / (rel * SR))
    y = 0.0
    for i in range(0, n, 64):  # blockweise für Tempo
        target = g[i]
        y += (target - y) * (1 - (1 - (ka if target > y else kr)) ** 64)
        out[i:i + 64] = y
    return out


def limiter(st, ceiling_db=-1.3, look=0.004, release=0.08):
    """Einfacher Look-ahead-Peak-Limiter (Sample-Peak, mit Reserve für True Peak)."""
    c = db(ceiling_db)
    # True-Peak-Erkennung: 4-fach überabgetastet, Maximum je Original-Sample
    from scipy.signal import resample_poly
    up = np.abs(resample_poly(st, 4, 1, axis=1))
    n = st.shape[1]
    up = up[:, : n * 4].reshape(st.shape[0], n, 4).max(axis=2)
    peak = np.max(up, axis=0)
    need = np.minimum(1.0, c / np.maximum(peak, 1e-9))
    la = int(look * SR)
    from scipy.ndimage import minimum_filter1d
    need = minimum_filter1d(need, size=2 * la + 1)
    g = np.empty_like(need)
    k = 1 - np.exp(-1 / (release * SR))
    y = 1.0
    for i in range(len(need)):
        y = need[i] if need[i] < y else y + (need[i] - y) * k
        g[i] = y
    return st * g[None, :]


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--cues", default="script/sfx_cues.json")
    ap.add_argument("--out", default="assets/audio/mix.wav")
    ap.add_argument("--no-vo", action="store_true",
                    help="nur Musik + Geräusche (ohne Sprecher, ohne Ducking) — Pegel bleiben so, dass eine eigene Stimme "
                         "mit -14 LUFS darüber passt")
    args = ap.parse_args()
    timing = json.loads((PROJECT / "script" / "timing.json").read_text(encoding="utf-8"))
    total = timing["total"]
    N = int(round(total * SR))
    cues_path = PROJECT / args.cues
    cues = json.loads(cues_path.read_text(encoding="utf-8")) if cues_path.exists() else []

    # ---- Stimme
    vo = np.zeros((2, N))
    have_vo = False
    for s in timing["segments"]:
        if s.get("file") and not args.no_vo:
            x = decode(PROJECT / s["file"])
            synth.place(vo, x, s["clipStart"], 1.0, 0.0)
            have_vo = True
    # ---- Musik mit Ducking unter der Stimme
    sr_m, music = wavfile.read(str(AUD / "music.wav"))
    music = music.T.astype(np.float64)[:, :N]
    if music.shape[1] < N:
        music = np.pad(music, ((0, 0), (0, N - music.shape[1])))
    speech = [(s["start"] - 0.05, s["end"] + 0.1) for s in timing["segments"]]
    if not args.no_vo:
        duck = 1 - (1 - db(DUCK_DB)) * smooth_gate(N, speech)
        music *= duck[None, :]
    # ---- Geräusche
    sfx = np.zeros((2, N))
    for c in cues:
        name = c["name"]
        if name in synth.VARIABLE and c.get("dur"):
            x = synth.VARIABLE[name](max(0.2, float(c["dur"])))
        elif name in synth.SFX:
            x = synth.SFX[name]()
        else:
            print(f"  ! unbekannter SFX-Name: {name}")
            continue
        x = np.asarray(x)
        if x.ndim == 1:
            x = x * (0.1 / max(loudest_rms(x), 1e-9))  # gleiche wahrgenommene Spitzenlautheit
            synth.place(sfx, x, c["t"], db(c.get("gain", 0)), c.get("pan", 0.0))
        else:
            x = x * (0.1 / max(loudest_rms(x.mean(axis=0)), 1e-9)) * db(c.get("gain", 0))
            i = int(c["t"] * SR)
            n = min(x.shape[1], N - i)
            if n > 0:
                sfx[:, i:i + n] += x[:, :n]

    report = {}
    if have_vo:
        li, _ = measure(vo)
        vo *= db(TARGET_VO - li)
        report["vo_in"] = li
    lm, _ = measure(music)
    music *= db(TARGET_MUSIC - lm)
    ls, _ = measure(sfx) if np.any(sfx) else (-120, None)
    if ls > -100:
        sfx *= db(TARGET_SFX - ls)
    # Kontrolle der Stems
    report["stems"] = {
        "vo": measure(vo)[0] if have_vo else None,
        "music": measure(music)[0],
        "sfx": measure(sfx)[0] if ls > -100 else None,
    }
    mix = vo + music + sfx
    if have_vo:
        for _ in range(4):
            li, _ = measure(mix)
            mix *= db(TARGET_MIX - li)
            mix = limiter(mix, -1.8)
        li, tp = measure(mix)
    elif args.no_vo:
        # Bett für eine eigene Stimme: Musik/Geräusche exakt auf Vorgabe (-36 / -25 LUFS), keine Anhebung.
        # Eigene Stimme mit -14 LUFS dazu, dann den Gesamtmix auf -12 LUFS -> wie der Original-Mix.
        mix = limiter(mix, -1.4)
        li, tp = measure(mix)
        print("  Hinweis: Mix ohne Stimme (Musik + Geräusche auf Vorgabe-Pegel).")
    else:
        # Vorschau ohne Stimme: gleicher Verstärkungsweg, als wäre die Stimme da (+2 dB)
        mix *= db(TARGET_MIX - TARGET_VO)
        mix = limiter(mix, -1.4)
        li, tp = measure(mix)
        print("  Hinweis: Mix ohne Stimme (Musik + Geräusche).")
    report["mix"] = {"lufs": li, "true_peak_dbtp": tp, "with_vo": have_vo}
    stems = AUD / "stems"
    stems.mkdir(exist_ok=True)
    for name, st in [("vo", vo), ("music", music), ("sfx", sfx)]:
        wavfile.write(str(stems / f"{name}.wav"), SR, np.clip(st.T, -1, 1).astype(np.float32))
    pcm = (np.clip(mix.T, -1, 1) * 32767).astype(np.int16)
    wavfile.write(str(PROJECT / args.out), SR, pcm)
    (PROJECT / "script" / "loudness.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
