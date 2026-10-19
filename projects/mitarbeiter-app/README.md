# SCHMIDT Intern – Mitarbeiter-App

Web-App für die Belegschaft im SCHMIDT Corporate Design, veröffentlicht als Seite auf claude.ai:
https://claude.ai/artifact/95L3bzmEWkuLJ9gDAspXuH

## Bereiche

- **Aktuelles:** Neuigkeiten mit bis zu 6 Bildern (Bereichs-Filter, Anheften, „Neu“-Markierung je Person), Termine,
  Geburtstage der nächsten 14 Tage (mindestens immer der nächste; am Handy zusätzlich als Zeile oben)
- **Geburtstagskalender** (`#geburtstage`): ganzes Jahr nach Monaten. Freiwillig: jede Person trägt Tag und Monat selbst ein
  (kein Jahr) und kann den Eintrag entfernen; die Redaktion kann Einträge für Personen ohne App-Zugang anlegen
- **Wiki:** Artikel zu Alltagsfragen (z. B. Krankmeldung) mit „Kurz gesagt“, Schritten, Ansprechpartner und eigenem Link (`#wiki-<id>`);
  Entwürfe sieht nur die Redaktion, Text in [eckigen Klammern] wird als offener Platzhalter markiert
- **Telefonbuch:** Suche, Abteilungs-Filter, Klick kopiert die volle Nummer (Zentrale +49 5250 9845 plus Durchwahl), Import einer Liste aus Excel/CSV
- **Dokumente:** Dateien (PDF, Bild, Video, Text bis 20 MB) oder Links, Kategorien, Suche, dazu die neuesten Wiki-Artikel

## Rechte

| Wer (Freigabe-Menü) | darf |
|---|---|
| Eigentümer, Bearbeiter („Redaktion“) | alles anlegen, ändern, löschen; Dateien hochladen |
| Mitwirkende | alles lesen, eigenen Geburtstag eintragen |
| Betrachter | nur lesen |

Die Regeln liegen in der Datenablage der Seite (`news`, `termine`, `kontakte`, `dokumente`, `wiki` schreibt nur die Redaktion,
`wikiEntwurf` liest und schreibt nur die Redaktion;
`geburtstage/<person>` schreibt jede Person selbst, Geburtstage lesen nur Mitwirkende und höher
(also keine Besucher von außerhalb der Organisation); `data/users/<person>/state` merkt sich, was jemand gelesen hat).

## Bauen

```bash
node projects/mitarbeiter-app/source/build.mjs
```

Schreibt `renders/schmidt-intern.html`. Eingebettet werden Filson Pro (Latin-Subset aus
`brand-guidelines/default/assets/fonts/`, als woff2 in `source/fonts/`) und die Wortmarke aus `logo-schmidt.svg`.
Danach die Datei erneut auf dieselbe Adresse veröffentlichen; die Inhalte in der Datenablage bleiben erhalten.

## Vorstellung für die Belegschaft (PDF)

```bash
node projects/mitarbeiter-app/source/vorstellung/build.cjs
```

Schreibt `renders/schmidt-intern-vorstellung.pdf` (8 Folien, 16:9). Die Abbildungen entstehen aus der gebauten App,
angemeldet als Mitarbeiter aus der Produktion ohne Redaktionsrechte, mit erfundenen Beispielinhalten.
Braucht Playwright und Python mit `segno` (QR-Code).
