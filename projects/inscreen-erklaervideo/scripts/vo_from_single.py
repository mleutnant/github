# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "scipy"]
# ///
"""Eine komplette VO-Aufnahme (z. B. Download von der ElevenLabs-Website) in die 11 Abschnitte zerlegen.

    uv run projects/inscreen-erklaervideo/scripts/vo_from_single.py <datei.mp3> [--tempo 1.0]

Die Website liefert keine Zeitstempel. Das Skript findet die Sprechpausen, ordnet sie per dynamischer
Programmierung den Satz-/Phrasengrenzen des Sprechertexts zu (Sprechgeschwindigkeit als Modell) und
verteilt die Wörter innerhalb jeder Phrase nach Zeichenzahl auf die reine Sprechzeit (Pausen ausgespart).
Ausgabe wie vo_elevenlabs.py: assets/audio/vo/sXX.wav + sXX.json (Zeichen-Zeitstempel) — danach
build_timing.py / build_all.sh wie gewohnt.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile

SR = 48000
PROJECT = Path(__file__).resolve().parents[1]
VO = PROJECT / "assets" / "audio" / "vo"
FRAME = 0.01  # 10-ms-Hüllkurve


def decode(path, tempo):
    af = ["-af", f"rubberband=tempo={tempo}:formant=preserved:pitchq=quality"] if abs(tempo - 1) > 1e-3 else []
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), *af, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def envelope_db(x):
    n = int(FRAME * SR)
    m = len(x) // n
    e = np.sqrt(np.mean(x[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e)


def silences(edb, thr, min_dur):
    """Liste (start, ende) stiller Bereiche in Sekunden."""
    quiet = edb < thr
    out, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) * FRAME >= min_dur:
                out.append((i * FRAME, j * FRAME))
            i = j
        else:
            i += 1
    return out


def phrases_of(text):
    """Phrasen = Teile zwischen Satzzeichen, die eine Pause erzeugen können."""
    parts = re.split(r"(?<=[,:.?!–])\s+", text.strip())
    return [p for p in parts if p]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--tempo", type=float, default=1.0, help="Zeitstreckung (1.05 = 5 %% schneller, Tonhöhe bleibt)")
    ap.add_argument("--max-pause", type=float, default=0.0, help="Pausen innerhalb eines Abschnitts auf diese Länge kürzen (0 = aus)")
    args = ap.parse_args()
    cfg = json.loads((PROJECT / "script" / "vo_segments.json").read_text(encoding="utf-8"))
    segs = cfg["segments"]

    x = decode(args.file, args.tempo)
    edb = envelope_db(x)
    peak = np.percentile(edb, 99)
    thr = peak - 42
    dur = len(x) / SR
    sil = silences(edb, thr, 0.22)
    # Sprech-Start/-Ende
    voiced = np.where(edb > thr)[0]
    t_first, t_last = voiced[0] * FRAME, (voiced[-1] + 1) * FRAME
    sil = [(a, b) for a, b in sil if a > t_first and b < t_last]

    # Phrasen + Grenzen (k = Grenze nach Phrase k), mit Kennzeichnung der Segment-Enden
    ph, seg_of, is_seg_end = [], [], []
    for si, s in enumerate(segs):
        ps = phrases_of(s["text"])
        for k, p in enumerate(ps):
            ph.append(p)
            seg_of.append(si)
            is_seg_end.append(k == len(ps) - 1)
    chars = np.array([len(p) + 1 for p in ph], dtype=float)
    cum = np.cumsum(chars)  # Grenze nach Phrase k liegt bei cum[k] Zeichen
    # Sprechzeit-Achse (Pausen herausgerechnet)
    sil_total = sum(b - a for a, b in sil)
    speech_total = (t_last - t_first) - sil_total
    rate = speech_total / cum[-1]

    def speech_time(t):
        st = t - t_first
        for a, b in sil:
            if b <= t:
                st -= b - a
            elif a < t:
                st -= t - a
        return st

    P = [(speech_time(a), a, b) for a, b in sil]  # Pausenposition auf der Sprechzeit-Achse
    K = len(ph) - 1  # mögliche Grenzen (ohne Ende)
    J = len(P)
    INF = 1e18
    # DP: Pause j -> Grenze k (streng monoton). Kosten: (Abweichung)^2, Segment-Enden ohne Pause sind teuer.
    exp_t = cum[:-1] * rate
    cost = np.full((J + 1, K + 1), INF)
    back = np.zeros((J + 1, K + 1), dtype=int)
    cost[0, :] = 0.0
    for j in range(1, J + 1):
        pj, a, b = P[j - 1]
        d = b - a
        for k in range(1, K + 1):
            bonus = -0.15 * min(d, 0.8) if is_seg_end[k - 1] else 0.0
            c_here = (pj - exp_t[k - 1]) ** 2 + bonus
            best = cost[j - 1, :k].min()
            arg = int(cost[j - 1, :k].argmin())
            cost[j, k] = best + c_here
            back[j, k] = arg
    # Segment-Enden, die keine Pause bekommen, bestrafen
    k_end = int(np.argmin(cost[J, :]))
    assign = {}
    k = k_end
    for j in range(J, 0, -1):
        assign[k - 1] = j - 1  # Grenze (k-1) bekommt Pause (j-1)
        k = back[j, k]
    missing = [seg_of[k] + 1 for k in range(K) if is_seg_end[k] and k not in assign]
    if missing:
        print(f"  ! Segment-Enden ohne erkannte Pause nach Abschnitt(en): {missing} — Grenze wird geschätzt")

    # Grenzzeiten (real): Pause -> (Ende Phrase = Pausenbeginn, Start nächste = Pausenende); sonst Schätzung
    bounds = []
    for kk in range(K):
        if kk in assign:
            _, a, b = P[assign[kk]]
            bounds.append((a, b))
        else:
            bounds.append(None)
    # Phrasen-Zeiten bestimmen; unbekannte Grenzen per Sprechzeit interpolieren
    starts, ends = [0.0] * len(ph), [0.0] * len(ph)
    starts[0] = t_first
    for kk in range(K):
        if bounds[kk]:
            ends[kk], starts[kk + 1] = bounds[kk]
    # Lücken (Grenzen ohne Pause) über Zeichenanteil zwischen bekannten Punkten füllen
    known = [(-1, t_first)] + [(kk, bounds[kk][0]) for kk in range(K) if bounds[kk]] + [(len(ph) - 1, t_last)]
    for (k0, ta), (k1, tb) in zip(known[:-1], known[1:]):
        if k1 - k0 <= 1:
            continue
        s0 = starts[k0 + 1]
        span = chars[k0 + 1: k1 + 1]
        tot = span.sum()
        acc = 0.0
        for kk in range(k0 + 1, k1):
            acc += chars[kk]
            t = s0 + (tb - s0) * acc / tot
            ends[kk] = t
            starts[kk + 1] = t
    ends[-1] = t_last

    # Wörter innerhalb jeder Phrase verteilen (Sprechzeit ohne interne Kurzpausen)
    short_sil = silences(edb, thr, 0.07)
    def words_in(phrase, a, b):
        ws = phrase.split()
        inner = [(max(a, s0), min(b, s1)) for s0, s1 in short_sil if s1 > a and s0 < b and s0 > a + 0.02 and s1 < b - 0.02]
        segs_t, cur = [], a
        for s0, s1 in inner:
            segs_t.append((cur, s0)); cur = s1
        segs_t.append((cur, b))
        total = sum(e - s for s, e in segs_t)
        def map_t(f):  # Anteil der Sprechzeit -> echte Zeit
            target = f * total
            for s, e in segs_t:
                if target <= e - s:
                    return s + target
                target -= e - s
            return b
        w = np.array([len(re.sub(r"[^\wäöüÄÖÜß]", "", t)) + 1.5 for t in ws])
        c = np.concatenate([[0], np.cumsum(w)]) / w.sum()
        return [(t, map_t(c[i]), map_t(c[i + 1]) - 0.02) for i, t in enumerate(ws)]

    seg_words = [[] for _ in segs]
    for kk, p in enumerate(ph):
        seg_words[seg_of[kk]].extend(words_in(p, starts[kk], ends[kk]))

    # Ausschneiden + Zeichen-Zeitstempel schreiben
    VO.mkdir(parents=True, exist_ok=True)
    for f in VO.glob("s??.*"):
        f.unlink()
    pre, post = 0.06, 0.14
    for si, s in enumerate(segs):
        ws = seg_words[si]
        c0 = max(0.0, ws[0][1] - pre)
        c1 = min(dur, ws[-1][2] + post)
        # lange Pausen innerhalb des Abschnitts kürzen (Mitte der Stille herausschneiden)
        cuts = []
        if args.max_pause > 0:
            for a, b in sil:
                if a > c0 + 0.05 and b < c1 - 0.05 and (b - a) > args.max_pause:
                    cuts.append((a + args.max_pause / 2, b - args.max_pause / 2))
        pieces, cur = [], c0
        for a, b in cuts:
            pieces.append((cur, a)); cur = b
        pieces.append((cur, c1))
        xf = int(0.008 * SR)
        clip = np.zeros(0)
        for a, b in pieces:
            seg = x[int(a * SR): int(b * SR)].copy()
            if len(clip) >= xf and len(seg) >= xf:
                ramp = np.linspace(0, 1, xf)
                clip[-xf:] = clip[-xf:] * (1 - ramp) + seg[:xf] * ramp
                seg = seg[xf:]
            clip = np.concatenate([clip, seg])
        def shift(t):
            d = 0.0
            for a, b in cuts:
                if t >= b:
                    d += (b - a) + xf / SR
                elif t > a:
                    d += t - a
            return t - d
        ws = [(w, shift(a), shift(b)) for w, a, b in ws]
        c1 = c0 + len(clip) / SR
        nf = int(0.012 * SR)
        clip[:nf] *= np.linspace(0, 1, nf)
        clip[-nf:] *= np.linspace(1, 0, nf)
        wavfile.write(str(VO / f"{s['id']}.wav"), SR, (np.clip(clip, -1, 1) * 32767).astype(np.int16))
        chars_l, cs, ce = [], [], []
        for i, (w, a, b) in enumerate(ws):
            n = len(w)
            for j, ch in enumerate(w):
                chars_l.append(ch)
                cs.append(round(a - c0 + (b - a) * j / n, 3))
                ce.append(round(a - c0 + (b - a) * (j + 1) / n, 3))
            if i < len(ws) - 1:
                chars_l.append(" ")
                cs.append(round(b - c0, 3))
                ce.append(round(ws[i + 1][1] - c0, 3))
        meta = {
            "id": s["id"], "text": s["text"], "source": Path(args.file).name, "tempo": args.tempo, "max_pause": args.max_pause,
            "timing_method": "Pausen-Zuordnung + Zeichenanteil (keine ElevenLabs-Zeitstempel)",
            "alignment": {"characters": chars_l, "character_start_times_seconds": cs, "character_end_times_seconds": ce},
        }
        (VO / f"{s['id']}.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"{s['id']}: {c0:6.2f} s, Länge {c1 - c0:4.2f} s, {len(cuts)} Pause(n) gekürzt  {s['text'][:50]}")
    print(f"Sprechzeit gesamt {t_last - t_first:.2f} s (Tempo {args.tempo})")


if __name__ == "__main__":
    main()
