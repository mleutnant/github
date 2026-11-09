// Niederländische Sprachfassung: Wort-Anker (deutscher Schlüssel → niederländisches Wort im Sprechertext),
// Bildtexte (exakter deutscher Text → Übersetzung) und ganze Phrasen für wortweise animierte Zeilen.
// Begriffe aus der NL-Broschüre „InScreen – Insectenhor voor de hefschuifdeur“.
window.I18N = {
  lang: "nl",
  anchors: {
    s01: { sommerabend: "zomeravond", hebeschiebetür: "hefschuifdeur", steht: "staat", herrlich: "genieten" },
    s02: { nur: "maar", ungebetenen: "ongenode", gäste: "gasten" },
    s03: { klassische: "klassieke", fliegengitter: "insectenhorren", aufgesetzt: "optisch", auffällig: "fraai",
      stolperkante: "storend", gebohrt: "montagegaten", auch: { w: "boren", e: true }, noch: { w: "boren", e: true, d: 0.15 } },
    s04: { hier: "dan", kommt: "onze", inscreen: "inscreen", insektenschutz: "insectenhor", integriert: "geïntegreerd", quinline: "quinline" },
    s05: { plissee: "hor", integrationsprofil: "profiel", festflügel: "vleugel", führungsschiene: "aandrijfsysteem",
      schwellenkonstruktion: "onderdorpel" },
    s06: { zurückgeschoben: "teruggeschoven", verschwindet: "matcht", fast: "volledig", griffleiste: "frame", rahmen: "hor",
      farblich: "folie", passend: "leverbaar", foliert: "hefschuifpui" },
    s07: { keine: "geen", stolperkante: "drempel", durchgangsbereich: "doorgang", kinder: { w: "geen", n: 1 }, großeltern: "kans",
      tablett: "struikelen" },
    s08: { fiberglas: "glasvezelplissé", gleitet: "glijdt", stufenlos: "moeiteloos", auf: "open", zu: "dicht", mücken: "muggen",
      bleiben: "blijven", draußen: "buiten" },
    s09: { für: "voor", fachpartner: "vakpartner", bestellt: "klik", wird: "besteld", aus: { w: "besteld", e: true, d: 0.1 },
      hand: { w: "nul", d: -0.15 }, die: "nul", maße: "procent", liegen: "foutmarge", schon: { w: "foutmarge", d: 0.3 },
      vor: { w: "foutmarge", e: true } },
    s10: { kommt: "komt", inscreen: "inscreen", plug: "plug", einclipsen: "vastklikken", fertig: "klaar", ohne: "zonder",
      bohren: "boren", und: { w: "en", n: 3 }, schrauben: "schroeven", nachrüsten: { w: "schroeven", e: true, d: 0.2 },
      unkompliziert: { w: "schroeven", e: true, d: 0.4 } },
    s11: { integriert: "geïntegreerd", farblich: "bijpassende", schnell: "snel", darum: "daarom", inscreen: "inscreen", beste: "beste",
      hebeschiebetüren: "hefschuifdeuren" },
  },
  // Szenen mit eigener NL-Choreografie (Text der NL-Kollegen weicht inhaltlich ab)
  //   s03: optisch niet fraai / storend geluid / afwijkende kleur / montagegaten boren (statt Stolpern)
  //   s10: ohne „Nachrüsten“-Teil
  variant: { s03: true, s10: true },
  // Ganze Zeilen, die wortweise erscheinen (ANIM.words)
  phrases: {
    "die beste Insektenschutzlösung für Hebeschiebetüren.": "de beste insectenhor voor hefschuifdeuren.",
    "die beste": "de beste",
    "Insektenschutzlösung": "insectenhor voor",
    "für Hebeschiebetüren.": "hefschuifdeuren.",
  },
  // Bildtexte (Textknoten, exakt)
  text: {
    // s03
    "Klassische": "Klassieke", "Fliegengitter": "insectenhorren", "aufgesetzt": "optisch niet fraai", "auffällig": "storend geluid",
    "Stolperkante": "afwijkende kleur", "Bohren nötig": "montagegaten boren",
    // s04
    "Insektenschutz für die Hebeschiebetür": "Insectenhor voor de hefschuifdeur", "Direkt": "Direct", "integriert": "geïntegreerd",
    "in": "met", "die": "de", "Hebeschiebetür": "hefschuifdeur",
    // s05
    "Innenansicht": "Binnenaanzicht", "InScreen-Rahmen": "InScreen-frame", "Festflügel": "Vaste vleugel", "Schwelle": "Onderdorpel",
    "Führungsschiene eingelassen": "Aandrijfsysteem geïntegreerd", "Führungsschiene": "Aandrijfsysteem", "eingelassen": "geïntegreerd",
    "innen": "binnen", "außen": "buiten",
    // s06
    "Integrationsprofil": "Profiel", "im Festflügel": "in de vaste vleugel", "fast unsichtbar": "volledig passend",
    "Griffleiste": "Greeplijst", "Griffleiste & Rahmen": "Frame van de hor", "der Plisseekassette": "in dezelfde folie als de pui",
    "Farblich passend": "In bijpassende kleur", "Griffleiste & Kassettenrahmen": "Frame van de hor:",
    "Griffleiste & Kassettenrahmen:": "Frame van de hor:", "foliert oder pulverbeschichtet": "in dezelfde folie als de pui",
    "Weiß": "Wit", "Anthrazitgrau": "Antraciet", "Farbbeispiele – weitere Farben erhältlich": "Kleurvoorbeelden – meer kleuren leverbaar",
    // s07
    "Keine Stolperkante": "Geen drempel", "im Durchgangsbereich": "in de doorgang",
    // s08
    "Fiberglas-Plissee": "Glasvezelplissé", "stufenlos": "moeiteloos",
    // s09
    "InScreen auswählen": "InScreen selecteren", "Automatische Systemkonfiguration": "Automatische systeemconfiguratie",
    "Passgenauer Zuschnitt und Produktion": "Exact op maat gesneden en geproduceerd",
    "Plug-&-Play-Set zur Auslieferung": "Plug-and-play-set voor levering", "74 · Auftrag": "74 · Configurator",
    "Maße liegen vor": "0% foutmarge", "bestellt": "besteld",
    // s10
    "Ab Werk": "Af fabriek", "Nachrüstung": "Achteraf", "Plug-&-Play-Set": "Plug-and-play-set",
    // s11
    "Integriert": "Volledig geïntegreerd", "Schnell montiert": "Snel gemonteerd", "Darum ist": "Daarom is de",
    "für": "voor",
  },
  // Untertitel: abweichende Schreibweise nur in der Anzeige
  captionDisplay: { s03: { "insectenhorren:": "insectenhorren?" }, s09: { "Nul": "0%", "procent": "" } },
};
