# Arbeitsregeln für Claude in diesem Projekt

Dieses Projekt ist ein KI Video Editing Studio mit zwei Werkzeugen:

- **Video-Use** (`./video-use/`) — Schnitt, Transkription (ElevenLabs Scribe), Subtitles, Self-Eval
- **Hyperframes** — HTML-basierte Motion-Graphics-Compositions mit GSAP, Render via FFmpeg

## Grundregeln

- **Video-Use first:** Schnitt und Transkription immer zuerst über Video-Use, erst danach Motion Graphics mit Hyperframes.
- **Plan-Bestätigung auf Deutsch, in Plain Language (keine Markup-Slang):** vor jedem Cut und vor jeder Composition auf User-OK warten, nicht ungefragt rendern.
- **Output-Pfade:** Ergebnisse landen ausschließlich unter `projects/<name>/renders/` — niemals in Repo-Root oder in `raw/`.
- **`.env` nie committen.** Secrets bleiben lokal.
- **Brand-Guidelines-Konvention beachten** (siehe unten und `docs/`).
- **Multi-Scene-Compositions:** bei unabhängigen Szenen parallele Sub-Agents nutzen (eine Szene pro Agent).
- **Self-Eval nach jedem Render:** per `timeline_view`-Pattern prüfen, bevor die Preview gezeigt wird.
- **`.env`-Sync:** Wenn `./.env` und `./video-use/.env` divergieren, syncen — `./.env` (Projekt-Root) ist die Wahrheit.
- **Skill-Imports (Windows-Hinweis):** falls eine Junction nicht angelegt werden konnte, per absolutem Pfad importieren statt über den Skill-Alias.

## Brand-Guidelines-Konvention

Wenn der Nutzer sagt *"Nutze für dieses Projekt die Brand Guidelines aus `brand-guidelines/<name>/`"*, liest Claude alle Files in diesem Ordner (Hex-Codes, Typeface-Namen, Logo-SVGs, Tone-of-Voice-Notes, optional `motion-philosophy.md`-Overrides) und richtet Schnitt-Stil, Farben, Typografie, Overlays, Subtitles und Layouts daran aus.

Ohne explizite Nennung fällt Claude auf `brand-guidelines/default/` zurück.

## Referenzen

- `docs/motion-philosophy.md` — Animation-Standards (Easings, Anchor-Word-Sync, Banned Fonts)
- `docs/video-editing-workflow.md` — Schritt-für-Schritt-Referenz vom Rohvideo bis zum finalen Render
- `SETUP.md` — Setup-Anleitung (für erneutes/partielles Setup)
