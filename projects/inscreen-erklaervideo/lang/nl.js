// Niederländische Sprachfassung: Wort-Anker (deutscher Schlüssel → niederländisches Wort im Sprechertext),
// Bildtexte (exakter deutscher Text → Übersetzung) und ganze Phrasen für wortweise animierte Zeilen.
// Begriffe aus der NL-Broschüre „InScreen – Insectenhor voor de hefschuifdeur“.
window.I18N = {
  lang: "nl",
  anchors: {
    s01: { sommerabend: "zomeravond", hebeschiebetür: "hefschuifdeur", steht: "staat", herrlich: "heerlijk" },
    s02: { nur: "maar", ungebetenen: "ongenode", gäste: "gasten" },
    s03: { klassische: "klassieke", fliegengitter: "vliegenhorren", aufgesetzt: "opgebouwd", auffällig: "opvallend",
      stolperkante: "struikelrand", gebohrt: "boren", auch: "ook", noch: "nog" },
    s04: { hier: "hier", kommt: "komt", inscreen: "inscreen", insektenschutz: "insectenhor", integriert: "geïntegreerd", quinline: "quinline" },
    s05: { plissee: "plissé", integrationsprofil: "integratieprofiel", festflügel: "vleugel", führungsschiene: "geleiderail",
      schwellenkonstruktion: "drempelconstructie" },
    s06: { zurückgeschoben: "teruggeschoven", verschwindet: "verdwijnt", fast: "bijna", griffleiste: "greeplijst", rahmen: "frame",
      farblich: "passende", passend: "kleur", foliert: "folie" },
    s07: { keine: "geen", stolperkante: "struikelgevaar", durchgangsbereich: "doorgang", kinder: "kinderen", großeltern: "grootouders",
      tablett: "dienblad", bequem: "comfortabel" },
    s08: { fiberglas: "glasvezelplissé", gleitet: "glijdt", stufenlos: "traploos", auf: "open", zu: "dicht", mücken: "muggen",
      bleiben: "blijven", draußen: "buiten" },
    s09: { für: "voor", fachpartner: "vakpartner", bestellt: "bestelt", wird: "alles", aus: "bij", hand: "adres", die: "de",
      maße: "maten", liegen: "zijn", schon: "al", vor: "bekend" },
    s10: { kommt: "komt", inscreen: "inscreen", plug: "plug", einclipsen: "vastklikken", fertig: "klaar", ohne: "zonder",
      bohren: "boren", und: "en", schrauben: "schroeven", nachrüsten: "achteraf", unkompliziert: "eenvoudig" },
    s11: { integriert: "geïntegreerd", farblich: "passende", schnell: "snel", darum: "daarom", inscreen: "inscreen", beste: "beste",
      hebeschiebetüren: "hefschuifdeuren" },
  },
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
    "Klassische": "Klassieke", "Fliegengitter": "vliegenhorren", "aufgesetzt": "opgebouwd", "auffällig": "opvallend",
    "Stolperkante": "struikelrand", "Bohren nötig": "boren nodig",
    // s04
    "Insektenschutz für die Hebeschiebetür": "Insectenhor voor de hefschuifdeur", "Direkt": "Direct", "integriert": "geïntegreerd",
    "die": "de", "Hebeschiebetür": "hefschuifdeur",
    // s05
    "Innenansicht": "Binnenaanzicht", "InScreen-Rahmen": "InScreen-frame", "Festflügel": "Vaste vleugel", "Schwelle": "Drempel",
    "Führungsschiene eingelassen": "Geleiderail ingebouwd", "Führungsschiene": "Geleiderail", "eingelassen": "ingebouwd",
    "innen": "binnen", "außen": "buiten",
    // s06
    "Integrationsprofil": "Integratieprofiel", "im Festflügel": "in de vaste vleugel", "fast unsichtbar": "bijna onzichtbaar",
    "Griffleiste": "Greeplijst", "Griffleiste & Rahmen": "Greeplijst & frame", "der Plisseekassette": "van de plissé-cassette",
    "Farblich passend": "In passende kleur", "Griffleiste & Kassettenrahmen": "Greeplijst & cassetteframe",
    "Griffleiste & Kassettenrahmen:": "Greeplijst & cassetteframe:", "foliert oder pulverbeschichtet": "met folie of poedercoating",
    "Weiß": "Wit", "Anthrazitgrau": "Antraciet", "Farbbeispiele – weitere Farben erhältlich": "Kleurvoorbeelden – meer kleuren leverbaar",
    // s07
    "Keine Stolperkante": "Geen struikelgevaar", "im Durchgangsbereich": "in de doorgang",
    // s08
    "Fiberglas-Plissee": "Glasvezelplissé", "stufenlos": "traploos",
    // s09
    "InScreen auswählen": "InScreen selecteren", "Automatische Systemkonfiguration": "Automatische systeemconfiguratie",
    "Passgenauer Zuschnitt und Produktion": "Exact op maat gesneden en geproduceerd",
    "Plug-&-Play-Set zur Auslieferung": "Plug-and-play-set voor levering", "74 · Auftrag": "74 · Order",
    "Maße liegen vor": "Maten zijn bekend", "bestellt": "besteld",
    // s10
    "Ab Werk": "Af fabriek", "Nachrüstung": "Achteraf", "Plug-&-Play-Set": "Plug-and-play-set",
    // s11
    "Integriert": "Geïntegreerd", "Schnell montiert": "Snel gemonteerd", "Darum ist": "Daarom is",
    "für": "voor",
  },
  // Untertitel: abweichende Schreibweise nur in der Anzeige
  captionDisplay: { s03: { "vliegenhorren:": "vliegenhorren?" } },
};
