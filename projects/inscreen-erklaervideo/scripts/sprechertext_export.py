"""Sprechertext mit Zeitmarken für eine eigene Sprachaufnahme (aus script/timing.json).

    python3 projects/inscreen-erklaervideo/scripts/sprechertext_export.py

Ausgabe: renders/sprechertext_timecodes.md (Tabelle zum Einsprechen) und
renders/sprechertext.srt (Satzteile mit Zeiten — als Führungsspur in jeden Schnitt importierbar).
Die Animation hängt an diesen Zeiten: Wer die Abschnitte an den Einsätzen beginnt und ungefähr in der
angegebenen Dauer spricht, trifft die Bilder.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]


def tc(t: float) -> str:
    m, s = divmod(max(0.0, t), 60)
    return f"{int(m):02d}:{s:04.1f}".replace(".", ",")


def dec(x: float) -> str:
    return f"{x:.1f}".replace(".", ",")


def dec3(x: float) -> str:
    return f"{x:.3f}".replace(".", ",")


def srt_tc(t: float) -> str:
    ms = int(round(max(0.0, t) * 1000))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def phrases(words):
    """Satzteile: Umbruch nach . ? ! : und vor/nach Gedankenstrich."""
    out, cur = [], []
    for w in words:
        if re.fullmatch(r"[–-]", w["w"]):
            if cur:
                out.append(cur)
            cur = []
            continue
        cur.append(w)
        if re.search(r"[.?!:]$", w["w"]):
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def main():
    T = json.loads((PROJECT / "script" / "timing.json").read_text(encoding="utf-8"))
    segs = T["segments"]
    out = PROJECT / "renders"
    out.mkdir(exist_ok=True)

    md = [
        "# Sprechertext mit Zeitmarken — InScreen-Erklärvideo",
        "",
        f"Videolänge {tc(T['total'])} (16:9 und 9:16 identisch getaktet). Jeder Abschnitt beginnt beim "
        "**Einsatz** und sollte ungefähr in der angegebenen **Sprechdauer** fertig sein — dann landen die "
        "Bewegungen auf den richtigen Wörtern. Kleine Abweichungen (± 0,3 s) sind unkritisch.",
        "",
        *([
            f"**Eigene Aufnahme anlegen:** `{T['voSync']['source']}` ohne Tempoänderung bei "
            f"**{dec3(T['voSync']['offset'])} s** (Timecode {srt_tc(T['voSync']['offset'])}) auf die Tonspur legen — "
            "dann sitzt jedes Wort auf der Animation.",
            "",
            *[
                line
                for k, c in enumerate(T["voSync"].get("cuts", []))
                for line in (
                    f"- **Schnitt nach Abschnitt {int(c['after'][1:])}:** Aufnahme bei **{dec3(c['source_t'])} s** (Aufnahme-Zeit) "
                    f"schneiden und den Rest **{dec(c['insert'])} s später** anlegen — also ab Video-Zeit "
                    f"**{dec3(T['voSync']['offset'] + c['source_t'] + sum(x['insert'] for x in T['voSync']['cuts'][:k + 1]))} s**.",
                )
            ],
            *(["", "Sonst nichts schneiden oder verschieben."] if T["voSync"].get("cuts") else []),
            "",
        ] if T.get("voSync") else []),
        "| Nr. | Einsatz | Ende | Sprechdauer | Pause danach | Text |",
        "|---|---|---|---|---|---|",
    ]
    for i, s in enumerate(segs):
        nxt = segs[i + 1]["start"] if i + 1 < len(segs) else T["total"]
        md.append(
            f"| {i + 1} | {tc(s['start'])} | {tc(s['end'])} | {dec(s['end'] - s['start'])} s | "
            f"{dec(nxt - s['end'])} s | {s['text']} |"
        )
    md += [
        "",
        "## Pegel für den eigenen Mix",
        "",
        "- Die Tonspur im Video ist Musik (−36 LUFS) + Geräusche (−25 LUFS), genau auf Vorgabe-Pegel — ohne "
        "Sprecher. Darum klingt sie allein recht leise.",
        "- Eigene Stimme auf **−14 LUFS** bringen (integriert, über die ganze Länge gemessen) und darüberlegen.",
        "- Danach den Gesamtmix auf **−12 LUFS** anheben (ca. +1,6 dB), True Peak höchstens −1 dBTP — das "
        "ergibt dieselbe Balance wie im fertigen Original-Mix.",
        "- Optional wie im Original: Musik unter der Stimme um ca. 4 dB absenken (Ducking).",
        "- Einzelspuren zum freien Mischen: `musik.wav` und `geraeusche_16x9.wav` bzw. `geraeusche_9x16.wav` "
        "(die Schlussszene ist je Format etwas anders getaktet) — jeweils ab 0,0 s an den Videoanfang legen.",
        "",
        "## Führungsspur",
        "",
        "`sprechertext.srt` enthält dieselben Sätze mit Zeiten. In Premiere, DaVinci Resolve, Final Cut oder "
        "CapCut als Untertitel-Spur importieren und beim Einsprechen mitlesen bzw. die Aufnahme danach anlegen.",
        "",
    ]
    (out / "sprechertext_timecodes.md").write_text("\n".join(md), encoding="utf-8")

    cues = []
    for s in segs:
        for ph in phrases(s["words"]):
            cues.append((ph[0]["s"], ph[-1]["e"], " ".join(w["w"] for w in ph)))
    srt = []
    for n, (a, b, text) in enumerate(cues, 1):
        nxt = cues[n][0] - 0.04 if n < len(cues) else b + 0.6
        srt += [str(n), f"{srt_tc(a)} --> {srt_tc(min(b + 0.25, nxt))}", text, ""]
    (out / "sprechertext.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"{len(segs)} Abschnitte, {len(cues)} Untertitel → {out}")


if __name__ == "__main__":
    main()
