# UI kit — schmidt-boke.de

A click-through recreation of the SCHMIDT website, built entirely from this system's components.

| File | Screen |
|---|---|
| `index.html` | shell: loads `styles.css`, the compiled bundle and every screen |
| `App.jsx` | header / footer frame, page switching, right-hand `SideRail` |
| `Home.jsx` | hero, Willkommen + 9 product arguments, Am Puls des Marktes, blue QuinLine® field, news |
| `Produkte.jsx` | QuinLine® 74 / 84 toggle, Funktion list, Schwellen table, closing frame |
| `Referenzen.jsx` | reference stories, Prinzip-2 image overlay, blue quote band |
| `Kontakt.jsx` | contact + brochure order form with a sent state |

## Sources

Structure, navigation labels and body copy were taken from the live site (schmidt-boke.de, DE tree) and
from the Corporate Design Guideline p.17, which shows the homepage above the fold. Photography is
extracted from the guideline PDF; the real site's own images were not reachable, so three photos stand
in for the full library.

## Known gaps

- The site's mega-menu (Produkte / Kunde / Unternehmen flyouts with their own icon columns) is reduced
  to a flat nav — the flyout's exact layout is not documented in the material provided.
- The search field, cookie banner and Kunden-Login application are out of scope.
