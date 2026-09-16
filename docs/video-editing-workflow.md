# Video-Editing-Workflow

Referenz für Claude im Lauf einer Session — Schritt für Schritt vom Rohvideo bis zum finalen Render.

## Edit-Workflow (mit Rohvideo)

1. Nutzer legt Roh-MP4 in `raw/<projektname>/`.
2. Nutzer sagt: *"Edit @raw/<projektname>/<datei>.mp4 in eine Folge."*
3. Transkription mit ElevenLabs Scribe (`video-use`).
4. Füllwörter, Pausen, Fehlstarts, Versprecher, Retakes erkennen (siehe Cut-Standards in `SETUP.md`).
5. Cut-Plan auf **Deutsch**, Plain Language vorlegen → auf Nutzer-OK warten.
6. `projects/<name>/clips/edited.mp4` + `master.srt` + Wort-Zeitstempel-JSON erzeugen.
7. Storyboard für Motion Graphics vorlegen (HTML mit Beats, Anchor-Wörtern, Animation-Typen) → auf Nutzer-OK warten.
8. Compositions mit Hyperframes bauen (eine pro Szene, parallel via Sub-Agents wo sinnvoll).
9. `npx hyperframes preview` → Studio auf `localhost:3002`.
10. Iteration auf Feedback hin.
11. Final-Render unter `projects/<name>/renders/final.mp4` (1920×1080 / 30fps default, 1080×1920 für Shorts).
12. Self-Eval per `timeline_view`-Pattern.

## Pure-Animation-Workflow (ohne Rohvideo)

Identisch ab Schritt 7 — Nutzer beschreibt das gewünschte Video, Claude erzeugt Storyboard und baut die Compositions.

## Workflow-Branch nach dem Cut

Vor dem Bau von HTML-Compositions entscheiden, welcher Pfad gilt:

- **Direkt Hyperframes** — Claude baut Storyboard und Compositions selbst, mit einer Brand aus `brand-guidelines/`.
- **Claude Design (claude.ai)** — Claude exportiert nur das Output-Timeline-Transkript, der Nutzer baut die HTMLs in claude.ai und liefert ein Bundle zurück.

Details, Padding-Regeln, Versprecher-Detection und die Claude-Design-Bundle-Pipeline stehen in `SETUP.md`.
