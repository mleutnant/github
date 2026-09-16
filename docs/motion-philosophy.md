# Motion Philosophy

Grundhaltung für alle Motion-Graphics-Compositions in diesem Projekt.

## Stil

- Modern, hochwertig, clean, dynamisch.
- Keine überladenen Szenen — jeder Beat hat einen klaren Fokus.

## Easings

- `power3.out` für Reveals (Elemente kommen ins Bild).
- `sine.inOut` für Loops (wiederkehrende, ruhige Bewegungen).
- **Niemals `linear`** — wirkt mechanisch und unfertig.
- Mindestens 3 verschiedene Easings pro Szene, damit Bewegung nicht monoton wirkt.

## Anchor-Word-Sync

Animationen landen **mit** dem gesprochenen Anchor-Wort, Toleranz ±100ms. Timing kommt aus den ElevenLabs-Wort-Timestamps (`transcripts/master.json`), nicht aus Schätzung.

## Banned Fonts

Folgende Fonts sind für dieses Projekt gesperrt (zu generisch / zu häufig in KI-generierten Designs):

Inter, Roboto, Open Sans, Lato, Poppins, Outfit, Sora, Fraunces, Playfair Display, Cormorant Garamond, Syne, Cinzel, Nunito, Source Sans, PT Sans, Arimo

Stattdessen: Font-Wahl aus der jeweiligen `brand-guidelines/<name>/typography.md`.
