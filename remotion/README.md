# Remotion-Workspace

[Remotion](https://www.remotion.dev) **4.0.533** (neueste stabile Version, Stand Okt. 2026) — Motion Graphics als React-Code. Ergänzt Hyperframes: gut für datengetriebene, parametrisierte oder viele gleichartige Videos (Props per Zod-Schema, im Studio live editierbar).

## Befehle (im Ordner `remotion/`)

```bash
npm i                                   # einmalig
npm run dev                             # Remotion Studio (Live-Preview, localhost:3000)
npm run render -- BrandIntro <projekt>  # → ../projects/<projekt>/renders/BrandIntro.mp4
npm run render -- BrandIntro <projekt> intro.mp4 --props='{"headline":"Hallo"}'
npm run lint                            # ESLint + TypeScript
node scripts/stills.mjs <CompositionId> <outDir> 0 45 90   # Einzelbilder + Kontaktbogen zur Selbstkontrolle
```

Beim ersten Render lädt Remotion einmalig eine Chrome-Headless-Shell herunter. In Umgebungen ohne Zugriff auf `remotion.media` (z. B. Cloud-Sandbox) einen vorhandenen Chromium übergeben: `--browser-executable=/pfad/zu/chrome`.

## Struktur

```
src/index.ts                  Entry (registerRoot)
src/Root.tsx                  Alle Compositions registrieren
src/brand/tokens.ts           Farben, Font-Stack, Easings (aus brand-guidelines/default + docs/motion-philosophy.md)
src/brand/fonts.ts            Filson Pro laden (wartet vor dem ersten Frame)
src/compositions/BrandIntro.tsx  Starter-Szene / Vorlage
public/brand/                 Logos (mit eingebetteten Farben) + Fonts, via staticFile()
scripts/render.mjs            Render-Wrapper, schreibt nur nach projects/<name>/renders/
scripts/stills.mjs            Einzelbilder + Kontaktbogen (bündelt einmal, rendert mehrere Frames)
src/compositions/quinline/    QuinLine® 74 vs. 84 (30 s): Szenen, Overlay, Pane-Slide-Übergang, Timing
```

## Regeln für Agents

- Erst die Skills lesen: `.claude/skills/remotion-best-practices` (Router zu den übrigen `remotion-*`-Skills).
- Animation nur über `useCurrentFrame()` + `interpolate()`/`spring()` — keine CSS-Transitions, kein `setTimeout`.
- Easings aus `src/brand/tokens.ts` (`ease.reveal` = power3.out, `ease.loop` = sine.inOut). Niemals linear.
- Farben/Fonts nur aus den Brand-Tokens; Banned Fonts siehe `docs/motion-philosophy.md`.
- Alle `remotion`/`@remotion/*`-Pakete auf exakt derselben Version halten (`npm run upgrade`).
- Renders ausschließlich via `npm run render` → `projects/<name>/renders/`.

Lizenz: Remotion ist kostenlos für Teams bis 3 Personen, darüber ist eine Company License nötig — siehe https://www.remotion.pro/license.
