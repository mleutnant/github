# InScreen-Erklärvideo — Projekt-Memory

## Session 1 — 2026-10-06

**Auftrag:** Animiertes Erklärvideo für Kundenschulungen, „Darum ist InScreen die beste
Insektenschutzlösung für Hebeschiebetüren“, ca. 60 s, 1920×1080, HyperFrames, verspielter
2D-Illustrationsstil mit eigenen Figuren; Musik/Sounds selbst erzeugt; Stimme −14 LUFS, Musik −36 LUFS,
Mix −12 LUFS.

**Entscheidungen**
- Fakten aus der vom Nutzer gelieferten InScreen-Broschüre 2026 (`docs/fakten.md`); Website war per
  Egress-Policy gesperrt. „Ohne Bohren/Schrauben“ nur für „ab Werk“ (Broschüre), Nachrüstung „unkompliziert“.
- Stimme: Nutzer wechselte von ElevenLabs „Alex“ zu Higgsfield „Gideon“ (Seed Audio) → klang nicht
  muttersprachlich → ElevenLabs-Stimme `g1jpii0iyvtRs8fqXsd1`. ElevenLabs ist aus der Cloud-Umgebung
  nicht erreichbar (Policy + kein Key) → `scripts/vo_elevenlabs.py` läuft lokal beim Nutzer.
- Sprechertext auf ~910 Zeichen gekürzt (11 Abschnitte, `script/vo_segments.json`).
- Architektur: ein Wohnzimmer-Set mit Kamera (s01, s02, s04, s06, s08, s11) + Erklär-Einschübe
  (s03 Problem, s05 Röntgen, s07 Barrierefrei, s09/s10 Fachpartner). Alle Bewegungen an Wort-Ankern
  (`ctx.w`), Timing aus ElevenLabs-Zeichen-Zeitstempeln → echte Stimme verschiebt alles automatisch.
- Sub-Agents (CLAUDE.md-Regel): s03, s05, s07, s09+s10 parallel; Fundament + Wohnzimmer-Szenen selbst.
- Marke: Filson Pro, SCHMIDT-Farben, L-Rahmenmotiv, Listen mit `|`; Illustrationspalette als
  dokumentierte Erweiterung (`design.md`). Verspielter Motion-Stil ausdrücklich vom Nutzer gewünscht.

**Reasoning-Log / Funde**
- GSAP: `svgOrigin` auf Elementen mit x/y verschiebt sie um Hunderte Pixel → Position und
  Rotation/Skalierung immer auf getrennten Gruppen; Wackeln auf x/y-Gruppen mit `transformOrigin: 50% 50%`.
- Figuren-Position wurde mit dem Figurenmaßstab skaliert → Rig mit getrennter Skalierungsgruppe.
- Übergänge: eingehendes Set lag in der Ebenen-Reihenfolge teils unter dem ausgehenden → gegenläufige Masken.
- SFX-Normalisierung über das lauteste 250-ms-Fenster statt Durchschnitt.

**Offen**
- ElevenLabs-Dateien vom Nutzer (`assets/audio/vo/sXX.mp3/.json`), danach `scripts/build_all.sh high`,
  Self-Eval an allen Übergängen, Länge prüfen (Ziel ~60 s; geschätzt aktuell ~75 s).
