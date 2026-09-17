# SCHMIDT Design System

The design system of **SCHMIDT GmbH**, Delbrück-Boke — manufacturer of the QuinLine® lift-and-slide
door (*Hebeschiebetür*) and, by its own description, the European market leader for PVC lift-and-slide
doors. Founded 1950, focused on lift-and-slide doors since 1976, around 150 staff, roughly 30,000 doors
a year, sold in DACH, Benelux and France. Customers are window manufacturers and fitters first, then
architects and planners, then private clients.

Everything here is derived from one source: the official **Corporate Design Guideline, Stand August
2024** (`uploads/250917_SCH_Umsetzung_Guideline_X03.pdf`, 20 pages, produced by deteringdesign GmbH),
plus the public content of **schmidt-boke.de** for the website recreation. No codebase, Figma file or
font binaries were provided.

## Products and surfaces represented

| Surface | Where it is covered |
|---|---|
| Website (schmidt-boke.de) | `ui_kits/website/` — home, products, references, contact |
| PowerPoint presentation template | `slides/` — 7 slide types |
| Print system (Produktbroschüre, Kundenmagazin, Produkt-News, Schulungsflyer, Briefbogen, Visitenkarte, Wandkalender, Anzeigen, LKW/Fahne) | documented in this readme; not rebuilt as artifacts |

---

## Index

| Path | What it is |
|---|---|
| `styles.css` | the one file consumers link; `@import`s everything below |
| `tokens/colors.css` | brand colours + semantic aliases |
| `tokens/typography.css` | font stack, weights, line heights, type scale, rule weights |
| `tokens/spacing.css` | 4px spacing scale, container, gutters |
| `tokens/layout.css` | radius (0), frame weights, shadows, motion |
| `tokens/base.css` | element defaults (body, headings, links, focus) |
| `assets/logo-schmidt.png` | Wort- und Bildmarke, transparent background |
| `assets/bildmarke.png` | Bildmarke alone |
| `assets/icons/*.png` | all 16 brand icons, transparent, 256 px |
| `assets/img/*.png` | three brand photographs |
| `guidelines/*.card.html` | foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/` | React primitives, grouped by concern |
| `ui_kits/website/` | click-through recreation of schmidt-boke.de |
| `templates/webseite/` | starting template: a full brand website page (Design Component) |
| `slides/` | presentation templates |
| `SKILL.md` | Agent-Skill entry point |

### Components

**core** — `Logo`, `Icon`, `Button`, `Rule`, `FrameBox`
**content** — `SectionHeading`, `BulletList`, `FeatureIcon`, `StatBlock`, `PullQuote`, `NewsCard`, `ImageOverlay`
**forms** — `Input`, `Select`, `Checkbox`, `RadioGroup`
**navigation** — `SiteHeader`, `SiteFooter`, `SideRail`

#### Intentional additions

The source is a brand guideline, not a component library, so the inventory was authored from the
surfaces the guideline documents. Three entries go beyond what the guideline draws literally:

- `Icon` — a wrapper so the 16 supplied glyphs can be recoloured per the black/white/red rule.
- `FrameBox` / `ImageOverlay` — the two layout Prinzipien from p.6 turned into components, because
  every layout in the system depends on them.
- `SideRail` — the website's right-hand contact/back-to-top rail; its glyphs come from the brand set,
  its back-to-top chevron is drawn from two borders (no arrow glyph exists in the set).

---

## CONTENT FUNDAMENTALS

**Language.** German, Sie-form throughout, addressed to a professional trade audience ("Sehr geehrte
Damen und Herren", "Sprechen Sie uns gerne an"). English and French versions of the website exist;
the design system's own copy stays German.

**Company name.** The wordmark reads "Schmidt" in mixed case, but **in running text the company name is
always set in caps: SCHMIDT**. Legal name: SCHMIDT GmbH. The product name is always written with the
registered mark and the capital L: **QuinLine®**, with the depth appended — QuinLine® 74, QuinLine® 84.

**Tone.** Matter-of-fact, technically precise, quietly confident. Claims are backed by numbers and
norms rather than adjectives: "4,5 mm vom höchsten Punkt der Laufschiene", "bis Sicherheitsstufe RC 3
zertifiziert", "Uf = 1,3 W/(m²K)", "bis zu 7 m Breite aus einem Guss". Where the brand does allow
warmth it is dry and regional rather than exclamatory — headlines like "Schneiden? Ade!",
"Mach'n Haken dran", "Vom Nichts zum gewissen Etwas", "Wer hat's erfunden? Ri… Pardon, die Schweizer."
The customer magazine is the one place where that register runs freely; product and technical material
stays sober.

**Headline shapes.** Three recurring forms:
1. Short verb triads — "Heben. Schieben. Öffnen."
2. Noun pairs bound by "und"/"&" — "Funktion & Design in Größe vereint", "Herzensprojekt mit Stil und Verstand"
3. A promise plus its qualifier — "Grenzenlos Wohnen", "Unser System zeigt Größe"

**Body copy.** Short paragraphs, one idea each, hyphenated (the guideline mandates Silbentrennung).
Technical facts are lists, never prose. Lists use the brand's own markers: a vertical bar `|` on the
first level, a filled square on the second — never a dot, dash or check mark. Units are written the
German way: `4,5 mm`, `> 50 Mio €`, `2.575 mm`, `Uf =1,3 W/(m²K)`.

**Product argument captions** are one or two words, occasionally with a second line: "Barrierefrei",
"Geprüfte Sicherheit", "Smart Home", "Sonder-/ausstattung".

**No emoji, ever.** No exclamation-heavy marketing voice, no first-person singular except in signed
editorials ("Herzlichst Ihr Meinolf Funkenmeier"). "Wir" is the company; "Sie" is the reader.

---

## VISUAL FOUNDATIONS

**The idea.** The Bildmarke is an abstracted lift-and-slide door: an open frame with a second pane
sliding behind it, drawn with deliberate breaks in the stroke. Every other visual decision restates
that motif — frames crossing surfaces, panes overlapping, openings.

**Colour.** Four primaries — Weiß `#FFFFFF`, Schwarz `#000000`, Blau `#123442` (RAL 5008), Schmidt Rot
`#E3002C` (RAL 3020, Pantone 185 C) — plus one secondary, Warmes Gelb `#F6A206`. Roles are fixed:
white and blue carry surfaces, black carries text and the wordmark, red is the Bildmarke and the frame,
yellow is a frame and a flat accent. Never more than one blue field and one accent colour per view.
Red is never a large surface; yellow is never type. A small derived tint ramp (`--sch-blue-90`,
`--sch-grey-05` …) exists for screen UI only and is marked as such in `tokens/colors.css`.

**Type.** Filson Pro (Olivier Gourvat) — a friendly geometric-humanist sans — in three weights:
Bold for titles (115 % leading), Medium for body (150 % leading, hyphenated), Regular for side columns
(130 % leading). Icon captions are Medium at 115 %. Kerning is optical everywhere. Arial Regular/Bold is
the sanctioned Office fallback. **No licensed webfont files were supplied, so this system substitutes
Figtree from Google Fonts** — see Caveats.

**Layout Prinzip 1 — Rahmen und Fläche.** A field (blue, or a photo) is overlaid by an L-shaped frame,
offset so a gap opens where the two cross, in analogy to the logo. On full-bleed photography the same
principle may be built from two frames instead. One instance per layout, at a generous size. See
`FrameBox`.

**Layout Prinzip 2 — Überlagerung.** Photographs overlap with a "negativ multiplizieren" (screen)
blend, like panes of glass. Used on inner spreads, chapter openers and in digital media. See
`ImageOverlay`.

**Backgrounds.** White is the default page. Blue fields are large, flat and hard-edged, typically
bleeding off two or three sides with a white margin remaining on one. No gradients, no textures, no
patterns, no noise. Full-bleed photography appears on covers, hero areas and chapter openers.

**Photography.** Daylight architecture shot from inside looking out: a QuinLine® door framing a
landscape. People appear mid-movement and are often motion-blurred — the door is the subject, the
person is the proof it moves. Grade is cool-neutral and true: green foliage, grey-black profiles, warm
wood as the only warm note. No filters, no grain, no black and white, no staged smiles. Product shots
(profiles, thresholds, handles) are clinical on white.

**Corners and borders.** Radius is **0** everywhere — cards, buttons, fields, images, blue fields. The
only round shapes in the system are radio buttons. Borders are either the 6–8 px brand frame or a 1 px
hairline; nothing in between. Blue fields close with an 8 px yellow rule at their foot.

**Rules.** The Unterlinie under a subtitle takes its weight from the type it belongs to (4 px under a
title, 2 px under body). Red rules sit under titles and cross photo edges; yellow rules run along the
foot of blue fields and drop vertically past a photo.

**Shadows.** Print uses none. On screen, cards get one soft shadow (`--shadow-card`,
`0 2px 14px rgba(18,52,66,.10)`) that deepens on hover (`--shadow-raised`). No inner shadows, no glows.

**Transparency and blur.** Blur is never used. Transparency appears only as the screen-blend image
overlay of Prinzip 2 and as white at 90–92 % for secondary copy on blue. No frosted panels, no
protection gradients — legibility over photography is solved with a solid field or a white margin, not
a gradient scrim.

**Motion.** Restrained and short. Colour and shadow transitions at 140–240 ms on
`cubic-bezier(.2,.6,.2,1)`; a photo may scale 1.03 on card hover over 420 ms. No bounces, no parallax,
no entrance animations, no autoplaying carousels of the hero.

**Hover and press.** Hover darkens a fill (red → `#C30026`, blue → `#24424F`, yellow → `#DC9005`) or
inverts an outline button to a blue fill; nav links and text actions turn red. Press nudges the control
1 px down — no scale, no ripple. Focus is a 3 px yellow outline at 2 px offset.

**Layout rules.** 1280 px container, 24 px gutter, 96 px vertical section rhythm; text columns cap at
about 62 characters. The website header is sticky; the yellow contact rail is pinned to the right edge.
Slides are 1280 × 720 with the logo 26 px tall, 40 px from the top and 56 px from the edge, and the
slide number bottom-left.

---

## ICONOGRAPHY

The brand has **its own icon set of 16 glyphs**, developed from the geometry of the Bildmarke and the
type (guideline p.5). They are line icons: rounded joins combined with cleanly cut ends, and
characteristic **breaks in the stroke** — the same interruption that appears in the Bildmarke. Stroke
weight is uniform and fairly heavy; there is no filled variant.

**Colour rule (from the guideline):** icons are used **only black on white or white on blue**. The one
exception is the website, where they may also be played in red. `Icon` enforces exactly these three
tones.

**What is in `assets/icons/`** — extracted from the guideline page and re-cut as 256 px transparent
PNGs. The guideline does not name the glyphs, so the file names describe them by use:

`schalldaemmung` (muted speaker) · `tablet-handy` (tablet + phone) · `wohnkomfort` (sofa) ·
`kosteneffizienz` (calculator) · `beratung` (two speech bubbles) · `breite` (double arrow) ·
`sicherheit` (padlock) · `regen` (cloud with rain) · `witterungsschutz` (sun behind shield) ·
`zusatzausstattung` (plus in a frame with lines) · `montage` (house with wrench) ·
`barrierefrei` (wheelchair) · `thermostat` (thermometer on a base) · `profilsystem` (profile sections) ·
`leichtlaeufig` (crossing diagonal arrows) · `nullschwelle` (threshold with "0 mm")

The live website uses the same set as individual SVGs (`icon-sicherheit.svg`, `icon-barrierefrei-1.svg`,
`icon-profilsystem.svg`, `icon-breite-1.svg`, `icon-thermostat-1.svg`, `icon-tablet-handy-2.svg`,
`icon-schalldaemmung.svg`, `icon-regen-1.svg`, `icon-design-1.svg`, plus navigation glyphs
`icon-uebersicht`, `icon-pakete`, `icon-nav-foerderung`, `icon-nav-news`, `icon-nav-downloads`).
**Those SVG originals are not in this system** — they could not be downloaded — so the PNG re-cuts stand
in and the five navigation glyphs are missing entirely.

**No third-party icon library is used, and none should be introduced.** No Lucide, no Font Awesome, no
Material. No emoji. No unicode characters as icons — the only unicode symbols in brand use are the
`|` bullet marker, the `®` on QuinLine, German quotation marks `„ “`, and the `–` en dash.

**Logo.** `assets/logo-schmidt.png` (Wort- und Bildmarke) and `assets/bildmarke.png` (Bildmarke alone)
are re-cuts from the guideline PDF at print resolution. **Vector originals were not supplied** — see
Caveats. The Bildmarke may appear alone on merchandise or as a sender mark, but only within the wider
context of the brand.

---

## Caveats

1. **Fonts.** Filson Pro is a commercial licence and no font files were provided. `--font-core` keeps
   `"Filson Pro"` first and falls back to **Figtree** (Google Fonts), the closest free
   geometric-humanist match. Supply the licensed WOFF2 files and the substitution disappears.
2. **Logo and icons are PNG re-cuts** from the guideline PDF, not the vector originals. They are clean
   at print resolution, but SVG/EPS originals should replace them.
3. **Website assets** (the real SVG icons, the photo library, the mega-menu) could not be fetched from
   schmidt-boke.de; the UI kit uses guideline photography and a flat nav instead.
4. **Icon names are descriptive guesses** — the guideline does not label them.
5. **Not rebuilt:** print templates (Briefbogen, Visitenkarte, Magazin, Produktbroschüre,
   Produkt-News, Wandkalender, LKW-Beschriftung, Fahne). Their rules are described above.
