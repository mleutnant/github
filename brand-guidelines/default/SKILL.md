---
name: default-design
description: Default-Brand-Skill (Platzhalter) für dieses Video-Editing-Projekt. Definiert Farb-Tokens, Typografie und Tone-of-Voice, damit claude.ai/design sie automatisch beim Bau von Claude-Design-Bundles nutzt.
---

# Default Design Skill

Dies ist die Default-Brand für den Direkt-Hyperframes- und den Claude-Design-Pfad. Es sind aktuell **Platzhalter-Werte** — sobald eine echte Brand vorliegt (z.B. via Claude-Design-Export-ZIP), diesen Folder komplett ersetzen (siehe `SETUP.md` Phase 6b) und `name` oben auf den echten Brand-Namen umbenennen.

## Farben

Siehe `colors.md` für alle Tokens (`--bg`, `--ink`, `--accent`, `--accent-dim`, `--muted`).

## Typografie

Siehe `typography.md` — Display- und Data-Font, keine Banned Fonts (Liste in `docs/motion-philosophy.md` im Hauptprojekt).

## Tone of Voice

Siehe `tone.md`.

## Logo

`logo/logo-light.svg` und `logo/logo-dark.svg` — aktuell Platzhalter, vom Nutzer zu ersetzen.

## Verwendung

- **Direkt-Hyperframes-Pfad:** Claude liest diesen Folder direkt aus dem Repo (`brand-guidelines/default/`).
- **Claude-Design-Pfad:** Dieser Folder wird als Skill in claude.ai/design hochgeladen; claude.ai lädt Farben/Typo/Tone von dort automatisch.
