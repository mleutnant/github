#!/usr/bin/env python3
"""Erzeugt die Einstiegsseiten einer Sprachfassung aus den deutschen (index.html, vertical.html).

    python3 projects/inscreen-erklaervideo/scripts/make_lang_html.py nl

Schreibt index_<lang>.html und vertical_<lang>.html: lädt lang/<lang>.js + lib/i18n.js, timing_<lang>.js und
den Mix der Sprachfassung (assets/audio/mix_<lang>.wav bzw. mix-9x16_<lang>.wav); Kompositions-ID mit Suffix.
data-duration setzt danach build_timing.py --lang <lang>. Nach Änderungen an den deutschen Seiten neu erzeugen.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]


def convert(src: str, lang: str) -> str:
    s = src
    s = re.sub(r'<html lang="de"', f'<html lang="{lang}"', s, count=1)
    s = re.sub(r"(<title>[^<]*)</title>", rf"\1 ({lang.upper()})</title>", s, count=1)
    s = s.replace('<script src="timing.js"></script>',
                  f'<script src="timing_{lang}.js"></script>\n    <script src="lang/{lang}.js"></script>\n    <script src="lib/i18n.js"></script>', 1)
    s = re.sub(r'src="assets/audio/(mix(?:-9x16)?)\.wav"', rf'src="assets/audio/\1_{lang}.wav"', s)
    for cid in re.findall(r'data-composition-id="([^"]+)"', s):
        s = s.replace(f'"{cid}"', f'"{cid}-{lang}"')
    return s


def main():
    lang = sys.argv[1] if len(sys.argv) > 1 else "nl"
    for name in ("index.html", "vertical.html"):
        src = (PROJECT / name).read_text(encoding="utf-8")
        out = PROJECT / name.replace(".html", f"_{lang}.html")
        out.write_text(convert(src, lang), encoding="utf-8")
        print(f"{out.name} geschrieben")


if __name__ == "__main__":
    main()
