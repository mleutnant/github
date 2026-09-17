# Seminare — Projekt-Memory

## Session 1 — 2026-09-17

**Quelle:** `raw/seminare/C0244_1.mp4` (1280x720@50fps, 14.5s, ein einziger durchgehender Talking-Head-Take).

**Strategie:** Social-Media-Snippet, 9:16 vertikal. Kein ElevenLabs-Zugriff möglich (Netzwerk-Policy blockt api.elevenlabs.io — bestätigt über Proxy-Status-Log, nicht der API Key). Nutzer hat das Transkript manuell geliefert: "Wenn ihr eure Kenntnisse rund um das Thema QuinLine-Hebeschiebetüren in unseren Systemen 74 und 84 auffrischen wollt oder auch vertiefen wollt und auch im Umgang mit der Montage einfach sicher sein wollt, dann sind unsere Seminare im November goldrichtig für euch." Darauf basierend zwei inhaltsbezogene Grafiken statt Wasserzeichen gebaut.

**Entscheidungen:**
- Trim: 0.12s–14.05s (Original) → 13.94s Output. Kopf/Fuß-Padding vor erstem/nach letztem hörbarem Wort, Rest ist durchgehender Take (kein Multi-Take-Schnitt nötig).
- Reframe: 16:9 → 9:16, Crop 406x720 zentriert (x=436), Skalierung auf 1080x1920, Person bleibt zentriert.
- Grade: `neutral_punch` (Kontrast 1.06 + sanfte S-Kurve, kein Farbstich) manuell in den Crop-Schritt gebacken, da render.py's automatisches Scale nicht mit dem custom Vertical-Crop kompatibel ist.
- Lower-Third-Callout ("QuinLine® 74 & 84") als transparentes WebM-Overlay (HyperFrames, VP9-Alpha), eingeblendet bei 7.08s (natürliche Sprechpause im Original bei ~7.2s) für 4.5s, Safe-Zone-konform (Chip-Unterkante bei y=1390, oberhalb der Social-UI-Zone).
- Outro-CTA-Karte (HyperFrames, 2.5s, 1080x1920): SCHMIDT-Blau-Vollbild, Logo, "Seminare im November" + "QuinLine® 74 | 84 – Auffrischung, Vertiefung & Montage-Sicherheit", im Stil der Brand-Slides (TitleSlide/ClosingSlide) adaptiert. Hängt als zweite Range direkt ans Ende.
- Keine Untertitel (Nutzer-Entscheidung), kein Wasserzeichen (Nutzer-Korrektur nach erstem Plan).

**Reasoning-Log:**
- api.elevenlabs.io ist für diese Session per Egress-Policy geblockt (403, bestätigt via `/root/.ccr/__agentproxy/status`) — Workaround laut Proxy-Regeln nicht erlaubt, daher Nutzer um manuelles Transkript gebeten.
- Bug gefunden + gefixt: `video-use/helpers/render.py` decodierte WebM-Alpha-Overlays mit FFmpegs Standard-VP9-Decoder, der den Alphakanal verwirft (schwarzer Vollbild-Hintergrund statt Transparenz). Fix: `-c:v libvpx-vp9` wird jetzt für `.webm`-Overlay-Inputs erzwungen (siehe `build_final_composite`).
- Zwei parallele Sub-Agents für die zwei unabhängigen Animationsslots (Hard Rule 10), nicht sequenziell.

**Output:** `projects/seminare/renders/C0244_1_seminare_folge.mp4` (1080x1920@50fps, 16.5s, -14 LUFS).

**Outstanding:** Keine Untertitel/ASR-Transkript-Cache vorhanden, da ElevenLabs in dieser Session nicht erreichbar war. Für zukünftige Sessions mit Netzwerkzugriff könnte eine echte Wort-Timestamp-Transkription nachgeholt werden, falls Anchor-Word-Sync-Animationen gewünscht sind.
