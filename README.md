# KI Video Editing Studio

Ein KI-gestütztes Video-Editing-Studio mit zwei Workflows:

1. **Edit-Workflow:** Rohvideo rein → Transkription → Cuts → Motion Graphics → finaler Render.
2. **Pure-Animation-Workflow:** Animationsvideos für Website, Promos, Erklärvideos — auch ganz ohne Roh-Video.

Werkzeuge:

- **[Video-Use](https://github.com/browser-use/video-use)** — Schnitt, Transkription (ElevenLabs Scribe), Subtitles, Self-Eval
- **[Hyperframes](https://hyperframes.heygen.com/quickstart)** — HTML-basierte Motion-Graphics-Compositions mit GSAP, Render via FFmpeg

## Voraussetzung

Ein ElevenLabs-API-Key: https://elevenlabs.io/app/settings/api-keys (Free-Tier reicht für erste Tests). In `.env` und `video-use/.env` eintragen (siehe `.env.example`).

## Quickstart

1. Roh-MP4 in `raw/<projektname>/` legen.
2. Im Chat mit Claude Code sagen: *"Edit @raw/<projektname>/<datei>.mp4 in eine Folge."*
3. Claude transkribiert, legt einen Cut-Plan auf Deutsch vor, wartet auf Bestätigung.
4. Nach dem Cut: Storyboard für Motion Graphics, dann Compositions mit Hyperframes.
5. `npx hyperframes preview` → Studio auf `localhost:3002`.
6. Iteration auf Feedback.
7. Final-Render unter `projects/<name>/renders/final.mp4`.

Für den Pure-Animation-Workflow (ohne Rohvideo) direkt ein Video beschreiben — Claude erzeugt Storyboard und baut die Compositions.

## Projektstruktur

```
raw/                    Rohvideos (gitignored)
projects/<name>/        Video-Projekte (assets, clips, transcripts, compositions, previews, renders)
brand-guidelines/       Brand-Konventionen pro Kunde/Kanal (default = Fallback)
docs/                   Motion-Philosophy & Workflow-Referenz
video-use/              Video-Use (geklont beim Setup)
.claude/skills/         Verlinkte Skills (hyperframes, gsap, hyperframes-cli, video-use)
```

## Brand Guidelines

Standardmäßig wird `brand-guidelines/default/` genutzt. Für eine eigene Brand: *"Nutze für dieses Projekt die Brand Guidelines aus `brand-guidelines/<name>/`."* sagen — Claude liest Farben, Typografie, Logos und Tone-of-Voice aus dem Ordner.

## Troubleshooting

- **FFmpeg nicht im PATH:** `ffmpeg -version` prüfen. Falls fehlend, Installationsanleitung in `SETUP.md` nutzen.
- **ElevenLabs-Limit erreicht:** `OPENAI_API_KEY` in `.env` setzen — Whisper dient als Fallback.
- **Studio-Port belegt (`localhost:3002`):** anderen Prozess auf dem Port beenden oder Hyperframes-Config anpassen.
- **`.env` und `video-use/.env` divergieren:** Claude beim nächsten Kontakt bitten zu syncen (Projekt-Root ist Single Source of Truth).

Siehe `SETUP.md` für die vollständige Setup-Anleitung und `docs/` für Workflow- und Motion-Standards.
