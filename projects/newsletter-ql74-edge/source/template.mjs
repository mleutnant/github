// Newsletter QuinLine® 74 Edge – gemeinsame Quelle für beide Fassungen:
//   cr: true  -> CleverReach-Vorlage (Editor-Markierungen html/image/loop, Bilder flach im ZIP)
//   cr: false -> eigenständiges E-Mail-HTML (Bilder unter images/)
//
// Outlook-Regeln, die hier durchgängig gelten (Outlook Desktop rendert mit Word, Outlook Web/neues Outlook säubert HTML):
//   - jede <td> hat ein explizites padding (sonst übernimmt Outlook das Padding der Elternzelle)
//   - farbige Linien sind Rahmen (border-top/-left), keine gefüllten Zellen – die Farbfläche kann nicht wachsen
//   - vertikale Abstände über Spacer-Zeilen, nie über margin auf Tabellen
//   - jede Zelle in einer farbigen Fläche trägt die Flächenfarbe selbst (bgcolor + background)
//   - nie zwei Tabellen direkt nebeneinander innerhalb einer Zelle

const F = 'font-family:Arial,Helvetica,sans-serif;';
const X = 'mso-line-height-rule:exactly;';
const BLUE = '#123442';
const RED = '#e3002c';
const YELLOW = '#f6a206';
const WHITE = '#ffffff';
const GREY = '#f6f6f6';
const PAGE = '#eef1f2';
const HAIR = '#d0d7db';
const HAIR_BLUE = '#4b656f';
const ON_BLUE = '#e7ebec';

const T = (attrs = '') => `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${attrs ? ' ' + attrs : ''}>`;
const bgAttr = (bg) => (bg ? ` bgcolor="${bg}"` : '');
const bgCss = (bg) => (bg ? ` background:${bg};` : '');

export function render({ cr, contentOnly = false }) {
  const html = (inner) => (cr ? `<!--#html #-->${inner}<!--#/html#-->` : inner);
  const image = (inner) => (cr ? `<!--#image #-->${inner}<!--#/image#-->` : inner);
  const src = (file) => (cr ? file : `images/${file}`);

  const spacer = (h, bg, colspan = 0) =>
    `<tr><td${colspan ? ` colspan="${colspan}"` : ''} height="${h}"${bgAttr(bg)} style="padding:0; height:${h}px;${bgCss(bg)} font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr>`;

  // Zeile mit seitlichem Rand (48 px Desktop, 20 px mobil)
  const row = (bg, content, { style = '', cls = '', attrs = '' } = {}) =>
    `<tr><td class="px${cls ? ' ' + cls : ''}"${attrs ? ' ' + attrs : ''}${bgAttr(bg)} style="padding:0 48px;${bgCss(bg)} ${style}">${content}</td></tr>`;

  // 64 px breite Unterlinie unter Überschriften – als Rahmen, damit die Farbe immer exakt 4 px hoch bleibt
  const rule = (color, bg) =>
    `${T('width="64"')}<tr><td width="64" height="1"${bgAttr(bg)} style="padding:0; width:64px; height:1px;${bgCss(bg)} border-top:4px solid ${color}; font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr></table>`;

  const hairline = (color, bg) =>
    `${T('width="100%"')}<tr><td height="1"${bgAttr(bg)} style="padding:0; height:1px;${bgCss(bg)} border-top:1px solid ${color}; font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr></table>`;

  const section = (bg, rows) =>
    `${T(`width="100%" bgcolor="${bg}" style="background:${bg};"`)}\n${rows.join('\n')}\n</table>`;

  const eyebrow = (text, color) =>
    `<p style="margin:0 0 10px 0; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${color};">${text}</p>`;
  const h2 = (text, color) =>
    `<h2 style="margin:0; ${F} font-size:28px; line-height:32px; ${X} font-weight:700; letter-spacing:-0.2px; color:${color};">${text}</h2>`;
  const heading = (bg, num, title, onBlue = false) =>
    row(bg, html(`\n${eyebrow(`Thema ${num}`, onBlue ? WHITE : RED)}\n${h2(title, onBlue ? WHITE : BLUE)}\n`), {
      cls: 'h2',
      style: `${F} font-size:28px; line-height:32px; ${X} font-weight:700; color:${onBlue ? WHITE : BLUE};`,
    });

  const text = (bg, inner, { size = 16, lh = 24, color = '#000000', extra = '' } = {}) =>
    row(bg, html(inner), { cls: 'hy', attrs: 'lang="de"', style: `${F} font-size:${size}px; line-height:${lh}px; ${X} color:${color}; ${extra}` });

  const p = (inner, { size = 16, lh = 24, color = '#000000', mb = 0, extra = '' } = {}) =>
    `<p style="margin:0 0 ${mb}px 0; ${F} font-size:${size}px; line-height:${lh}px; ${X} color:${color};${extra ? ' ' + extra : ''}">${inner}</p>`;

  const button = (href, label) =>
    `${T()}<tr><td class="btn-red" bgcolor="${RED}" style="padding:13px 24px; background:${RED}; ${F} font-size:15px; line-height:18px; ${X} font-weight:700; color:${WHITE};">${html(`<a href="${href}" style="${F} font-size:15px; line-height:18px; font-weight:700; color:${WHITE}; text-decoration:none;">${label}</a>`)}</td></tr></table>`;

  // Zweispaltige Daten-Tabelle (Bezeichnung | Wert), mobil untereinander
  const specTable = (rows, { bg, top, topWidth, line, labelColor, valueColor, labelWidth, pad, size }) => {
    const tr = rows
      .map(([label, value]) =>
        `<tr>` +
        `<td class="stack spec-l" width="${labelWidth}" valign="top"${bgAttr(bg)} style="padding:${pad}px 16px ${pad}px 0;${bgCss(bg)} border-bottom:1px solid ${line}; ${F} font-size:${size}px; line-height:22px; ${X} font-weight:700; color:${labelColor};">${html(label)}</td>` +
        `<td class="stack spec-v hy" lang="de" valign="top"${bgAttr(bg)} style="padding:${pad}px 0;${bgCss(bg)} border-bottom:1px solid ${line}; ${F} font-size:${size}px; line-height:22px; ${X} color:${valueColor};">${html(value)}</td>` +
        `</tr>`)
      .join('\n');
    return `${T('width="100%"')}\n<tr><td colspan="2" height="1"${bgAttr(bg)} style="padding:0; height:1px;${bgCss(bg)} border-top:${topWidth}px solid ${top}; font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr>\n${tr}\n</table>`;
  };

  // ---------------------------------------------------------------- Blöcke

  const header = `${T('width="100%"')}
<tr><td class="px" style="padding:20px 0 12px 0;">${T('width="100%"')}<tr>
<td align="left" style="padding:0; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${BLUE};">${html('Produkt-News')}</td>
<td align="right" style="padding:0; ${F} font-size:12px; line-height:16px; ${X} color:#6e7478;">${html('QuinLine® 74 Edge')}</td>
</tr></table></td></tr>
</table>`;

  const keyvisual = `${T(`width="100%" bgcolor="${BLUE}" style="background:${BLUE};"`)}
<tr><td bgcolor="${BLUE}" style="padding:0; background:${BLUE};">${image(`<img src="${src('keyvisual-ql74-edge.jpg')}" width="600" height="340" class="img-fluid" alt="QuinLine® 74 Edge – die geradlinige Hebeschiebetür von SCHMIDT" style="display:block; width:600px; max-width:100%; height:auto; border:0; ${F} font-size:24px; line-height:30px; font-weight:700; color:${WHITE};">`)}</td></tr>
</table>`;

  const intro = section(WHITE, [
    spacer(48, WHITE),
    text(WHITE, `
${p('{SALUTATION[std:Sehr geehrte Damen und Herren][salutation:formal|de]} {LASTNAME},', { mb: 20 })}
${p(`mit dem Profilsystem <strong style="color:${BLUE};">QuinLine® 74 Edge</strong> erweitern wir unser Hebeschiebetür-Programm um eine konsequent geradlinige Variante. Der schmale Flügelüberschlag und die eckigen Glasleisten verzichten bewusst auf Rundungen. So entsteht eine markante, nahezu rechtwinklige Kontur, die sich nahtlos in Objekte mit eckigen Fensterprofilen einfügt.`, { mb: 20 })}
${p('Gleichzeitig nimmt das System Glasdicken bis 50&nbsp;mm auf und ist damit bestens gerüstet für Dreifachverglasung, Schall- und Sicherheitsglas. So verbindet die Edge moderne Optik mit maximaler Flexibilität bei der Verglasung.', { mb: 28 })}
${p('Ihr Team der SCHMIDT GmbH', { color: BLUE, extra: 'font-weight:700;' })}
`),
    spacer(8, WHITE),
  ]);

  const tocItems = ['Technische Details', 'Verfügbarkeit und Farbsortiment', 'Glasleisten-Sortiment', 'Farbübersicht und Kompendium'];
  const toc = section(WHITE, [
    spacer(40, WHITE),
    row(WHITE, `${T(`width="100%" bgcolor="${GREY}" style="background:${GREY};"`)}
<tr><td bgcolor="${GREY}" style="padding:28px 28px 8px 28px; background:${GREY}; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${RED};">${html('Unsere heutigen Themen')}</td></tr>
<tr><td bgcolor="${GREY}" style="padding:0 28px 20px 28px; background:${GREY};">${T('width="100%"')}
${tocItems
  .map((item, i) => {
    const last = i === tocItems.length - 1;
    const border = last ? '' : ` border-bottom:1px solid ${HAIR};`;
    return `<tr><td width="40" valign="top" bgcolor="${GREY}" style="padding:12px 0; background:${GREY};${border} ${F} font-size:16px; line-height:22px; ${X} font-weight:700; color:${RED};">0${i + 1}</td><td valign="top" bgcolor="${GREY}" style="padding:12px 0; background:${GREY};${border} ${F} font-size:16px; line-height:22px; ${X} color:${BLUE};">${html(item)}</td></tr>`;
  })
  .join('\n')}
</table></td></tr>
</table>`),
  ]);

  const thema1 = section(WHITE, [
    spacer(56, WHITE),
    heading(WHITE, '01', 'Technische Details zum Edge'),
    spacer(16, WHITE),
    row(WHITE, rule(RED, WHITE)),
    spacer(24, WHITE),
    text(WHITE, `\n${p('Bei der QuinLine® 74 Edge ändert sich vor allem die Optik, nicht die Technik: Das System basiert auf der bewährten QuinLine® 74 und übernimmt die wichtigsten Systemmerkmale. Für die Verarbeitung heißt das vertraute Abläufe, kombiniert mit einer schlanken, geradlinigen Profilgeometrie und einer großen Bandbreite bei der Verglasung.', { size: 18, lh: 27, color: BLUE })}\n`, { size: 18, lh: 27, color: BLUE }).replace('class="px hy"', 'class="px hy lead"'),
    spacer(36, WHITE),
    row(WHITE, html('Die wichtigsten Systemdaten auf einen Blick'), { style: `${F} font-size:17px; line-height:22px; ${X} font-weight:700; color:#000000;` }),
    spacer(12, WHITE),
    row(WHITE, specTable(
      [
        ['Zargenprofil', '5 Kammern, Bautiefe 174&nbsp;mm, Ansicht 63&nbsp;mm'],
        ['Flügelprofil', '5 Kammern, Bautiefe 74&nbsp;mm, Ansicht 92&nbsp;mm'],
        ['Profilüberschlag', 'geradlinig und schlank, 25&nbsp;mm Höhe'],
        ['Design', 'kantige Glasleisten und Mitteldichtleisten'],
        ['Glasdicken', 'bis 50&nbsp;mm'],
        ['Systemtechnik', 'bewährte Merkmale analog Basis-System QuinLine®&nbsp;74'],
      ],
      { bg: WHITE, top: BLUE, topWidth: 2, line: HAIR, labelColor: BLUE, valueColor: '#000000', labelWidth: 170, pad: 12, size: 15 },
    )),
  ]);

  const muster = section(WHITE, [
    spacer(40, WHITE),
    row(WHITE, `${T(`width="100%" bgcolor="${GREY}" style="background:${GREY};"`)}
<tr><td bgcolor="${GREY}" style="padding:28px 28px 28px 26px; background:${GREY}; border-left:6px solid ${RED}; ${F} font-size:16px; line-height:24px; ${X} color:#000000;">${html(`
${p('Flügelmuster für Ihre Ausstellung?', { size: 20, lh: 24, color: BLUE, mb: 8, extra: 'font-weight:700;' })}
${p(`Gerne senden wir Ihnen kostenlos ein Muster einer Flügelecke mit dem Edge-Profil. Schreiben Sie uns dazu einfach eine kurze Mail an <a href="mailto:verkauf@schmidt-boke.de" style="color:${RED}; text-decoration:none; font-weight:700; white-space:nowrap;">verkauf@schmidt-boke.de</a>.`, { mb: 20 })}
`)}${button('mailto:verkauf@schmidt-boke.de?subject=Fl%C3%BCgelmuster%20QuinLine%C2%AE%2074%20Edge', 'Muster anfordern')}</td></tr>
</table>`),
    spacer(56, WHITE),
  ]);

  const stat = (label, value) =>
    `<td class="stack" width="240" valign="top" bgcolor="${BLUE}" style="padding:16px 0 0 0; background:${BLUE}; border-top:1px solid ${HAIR_BLUE}; ${F} font-size:14px; line-height:18px; ${X} color:${ON_BLUE};">${html(`
${p(label, { size: 14, lh: 18, color: ON_BLUE, mb: 6 })}
<p class="stat" style="margin:0; ${F} font-size:22px; line-height:27px; ${X} font-weight:700; color:${WHITE};">${value}</p>
`)}</td>`;

  const thema2 = `${section(BLUE, [
    spacer(56, BLUE),
    heading(BLUE, '02', 'Verfügbarkeit und Farbsortiment', true),
    spacer(16, BLUE),
    row(BLUE, rule(YELLOW, BLUE)),
    spacer(32, BLUE),
    row(BLUE, `${T('width="100%"')}<tr>
${stat('Standardschwelle', 'ab sofort bestellbar')}
<td class="stack-spacer" width="24" bgcolor="${BLUE}" style="padding:0; width:24px; background:${BLUE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>
${stat('Niedrigschwelle und Renovierungsschwelle', 'ab Mitte November bestellbar')}
</tr></table>`),
    spacer(36, BLUE),
    row(BLUE, specTable(
      [
        ['Farbsortiment', 'weiß und cremeweiß durchgefärbt sowie Standard- und Sonderdekore gemäß Farbübersicht Stand 04/2026 (Download-Bereich im Kunden-Login)'],
        ['Verglasungsdichtungen', 'schwarz und grau'],
      ],
      { bg: BLUE, top: HAIR_BLUE, topWidth: 1, line: HAIR_BLUE, labelColor: WHITE, valueColor: ON_BLUE, labelWidth: 190, pad: 14, size: 15 },
    )),
    spacer(48, BLUE),
    `<tr><td height="8" bgcolor="${YELLOW}" style="padding:0; height:8px; background:${YELLOW}; font-size:8px; line-height:8px; ${X}">&nbsp;</td></tr>`,
  ])}`;

  const glass = [
    ['20–27&nbsp;mm', 'auftragsbezogen'],
    ['28–31&nbsp;mm', `<strong style="color:${BLUE};">weiß ab Lager</strong>, Dekor auftragsbezogen`],
    ['32–35&nbsp;mm', 'auftragsbezogen'],
    ['36–50&nbsp;mm', `<strong style="color:${BLUE};">ab Lager</strong>`, true],
  ];
  const glassCell = (inner, { first, bg, bold }) =>
    `<td${first ? ' width="150"' : ''} bgcolor="${bg}" style="padding:14px ${first ? '16px' : '12px'} 14px ${first ? '12px' : '0'}; background:${bg}; border-bottom:1px solid ${HAIR}; ${F} font-size:16px; line-height:22px; ${X}${bold ? ' font-weight:700;' : ''} color:#000000;">${html(inner)}</td>`;
  const glassHead = (label, first) =>
    `<td${first ? ' width="150"' : ''} bgcolor="${WHITE}" style="padding:0 ${first ? '16px' : '0'} 10px ${first ? '12px' : '0'}; background:${WHITE}; border-bottom:2px solid ${BLUE}; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${BLUE};">${html(label)}</td>`;

  const thema3 = section(WHITE, [
    spacer(56, WHITE),
    heading(WHITE, '03', 'Glasleisten-Sortiment'),
    spacer(16, WHITE),
    row(WHITE, rule(RED, WHITE)),
    spacer(24, WHITE),
    text(WHITE, 'Gängige Glasdicken halten wir ab Lager vor, alle weiteren fertigen wir auftragsbezogen.'),
    spacer(28, WHITE),
    row(WHITE, `${T('width="100%"')}
<tr>${glassHead('Glasdicke', true)}${glassHead('Verfügbarkeit', false)}</tr>
${glass
  .map(([a, b, hi]) => {
    const bg = hi ? PAGE : WHITE;
    return `<tr>${glassCell(a, { first: true, bg, bold: true })}${glassCell(b, { first: false, bg })}</tr>`;
  })
  .join('\n')}
</table>`),
    spacer(16, WHITE),
    row(WHITE, html('<strong style="color:#000000;">Eckausführung:</strong> auf Gehrung gestoßen'), { style: `${F} font-size:14px; line-height:20px; ${X} color:#6e7478;` }),
    spacer(56, WHITE),
  ]);

  const divider = section(WHITE, [row(WHITE, hairline(HAIR, WHITE))]);

  const card = (stand, title, body, term) =>
    `<td class="stack" width="240" valign="top" bgcolor="${GREY}" style="padding:20px 20px 22px 20px; background:${GREY}; border-top:4px solid ${BLUE}; ${F} font-size:15px; line-height:22px; ${X} color:#000000;">${html(`
${p(stand, { size: 12, lh: 16, color: '#6e7478', mb: 4, extra: 'font-weight:700; letter-spacing:1.4px; text-transform:uppercase;' })}
${p(title, { size: 19, lh: 23, color: BLUE, mb: 10, extra: 'font-weight:700;' })}
${p(body, { size: 15, lh: 22, mb: 14 })}
${p(`Suchbegriff im Kunden-Login:<br><strong style="color:#000000;">${term}</strong>`, { size: 14, lh: 20, color: '#6e7478' })}
`)}</td>`;

  const thema4 = section(WHITE, [
    spacer(56, WHITE),
    heading(WHITE, '04', 'Farbübersicht und Kompendium zum QuinLine®&nbsp;74&nbsp;Edge'),
    spacer(16, WHITE),
    row(WHITE, rule(RED, WHITE)),
    spacer(16, WHITE),
    row(WHITE, image(`<img src="${src('mockup-farbuebersicht-kompendium.jpg')}" width="504" height="371" class="img-fluid" alt="Farbübersicht 04/2026 und Typenübersicht aus dem Kompendium QuinLine® 74 Edge" style="display:block; width:504px; max-width:100%; height:auto; border:0; ${F} font-size:14px; color:#6e7478;">`), { attrs: 'align="center"' }),
    spacer(24, WHITE),
    row(WHITE, `${T('width="100%"')}<tr>
${card('Stand 04/2026', 'Farbübersicht', 'Enthält bereits die verfügbaren Standard- und Sonderdekore für das neue System QuinLine® 74 Edge.', '„Farbübersicht“')}
<td class="stack-spacer" width="24" bgcolor="${WHITE}" style="padding:0; width:24px; background:${WHITE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>
${card('Stand 09/2026', 'Kompendium', 'Alle technischen Details: Typenübersicht, Elementgrößen, Verglasungsübersicht und Schnittzeichnungen.', '„Kompendium Edge“')}
</tr></table>`),
    spacer(28, WHITE),
    text(WHITE, 'Beides finden Sie im Download-Bereich des Kunden-Logins. Am schnellsten geht es über die Suche im linken Menü.'),
    spacer(24, WHITE),
    row(WHITE, button('https://kunden-login.schmidt-boke.de/', 'Zum Kunden-Login')),
    spacer(56, WHITE),
  ]);

  const social = (label, href) =>
    `<td class="btn-out" bgcolor="${BLUE}" style="padding:9px 16px; background:${BLUE}; border:1px solid ${WHITE}; ${F} font-size:14px; line-height:18px; ${X} font-weight:700; color:${WHITE};">${html(`<a href="${href}" style="${F} font-size:14px; line-height:18px; font-weight:700; color:${WHITE}; text-decoration:none;">${label}</a>`)}</td>`;
  const gap = `<td class="sp" width="12" bgcolor="${BLUE}" style="padding:0; width:12px; background:${BLUE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>`;

  const footer = section(BLUE, [
    spacer(48, BLUE),
    row(BLUE, html('Immer up to date – SCHMIDT auf Social Media'), { attrs: 'align="center"', style: `${F} font-size:20px; line-height:26px; ${X} font-weight:700; color:${WHITE};` }),
    spacer(20, BLUE),
    row(BLUE, `${T('class="social" align="center"')}<tr>
${social('LinkedIn', 'LINK-LINKEDIN')}${gap}${social('Instagram', 'LINK-INSTAGRAM')}${gap}${social('Facebook', 'LINK-FACEBOOK')}
</tr></table>`, { attrs: 'align="center"' }),
    spacer(40, BLUE),
    row(BLUE, hairline(HAIR_BLUE, BLUE)),
    spacer(32, BLUE),
    row(BLUE, `<img src="${src('logo-schmidt-negativ.png')}" width="150" height="24" alt="SCHMIDT" style="display:block; margin:0 auto; width:150px; height:auto; border:0; ${F} font-size:20px; font-weight:700; color:${WHITE};">`, { attrs: 'align="center"' }),
    spacer(24, BLUE),
    row(BLUE, html(`Weitere Informationen zu Neuheiten und Änderungen erhalten Sie regelmäßig in unserem Kunden-Login unter <a href="https://kunden-login.schmidt-boke.de/" style="color:${WHITE}; text-decoration:underline;">kunden-login.schmidt-boke.de</a>.`), { cls: 'hy', attrs: 'align="center" lang="de"', style: `${F} font-size:14px; line-height:21px; ${X} color:${ON_BLUE};` }),
    spacer(16, BLUE),
    row(BLUE, html(`SCHMIDT GmbH | Töllen Linde 3 | 33129 Delbrück-Boke<br>Telefon <a href="tel:+49525098450" style="color:#c5ced2; text-decoration:none;">+49 5250 9845-0</a> | <a href="mailto:kontakt@schmidt-boke.de" style="color:#c5ced2; text-decoration:none;">kontakt@schmidt-boke.de</a>`), { attrs: 'align="center"', style: `${F} font-size:13px; line-height:20px; ${X} color:#c5ced2;` }),
    '<!-- Hier ggf. Abmeldelink und Impressum mit den Platzhaltern des Newsletter-Tools einfügen -->',
    spacer(40, BLUE),
    `<tr><td height="8" bgcolor="${YELLOW}" style="padding:0; height:8px; background:${YELLOW}; font-size:8px; line-height:8px; ${X}">&nbsp;</td></tr>`,
  ]);

  const blocks = [
    ['Titelbild', keyvisual],
    ['Einleitung', intro],
    ['Themenübersicht', toc],
    ['Thema 01 – Technische Details', thema1],
    ['Flügelmuster', muster],
    ['Thema 02 – Verfügbarkeit und Farbsortiment', thema2],
    ['Thema 03 – Glasleisten-Sortiment', thema3],
    ['Trennlinie', divider],
    ['Thema 04 – Farbübersicht und Kompendium', thema4],
  ].map(([name, b]) => `<!-- BLOCK: ${name} -->\n${b}`);

  const body = cr
    ? `<!--#loop #-->\n${blocks.join('\n<!--#loopsplit #-->\n')}\n<!--#/loop#-->`
    : blocks.join('\n');

  const scope = contentOnly
    ? `  Nur Inhaltsbereich: ohne Kopfzeile, ohne Social Media und Fußbereich (die kommen aus Ihrer CleverReach-Vorlage).\n`
    : '';
  const notes = scope + (cr
    ? `  Vorlage für CleverReach: die ZIP-Datei unter "Eigene Vorlagen" hochladen (nicht entpacken).
  Im Editor editierbar: Texte/Links (HTML-Markierungen), Bilder (IMAGE-Markierungen),
  Blöcke innerhalb von LOOP (verschieben, kopieren, löschen). Kopf- und Fußbereich sind fest, ihre Texte editierbar.
  Bilder beim Austauschen in der Breite lassen: Titelbild 600 px, Broschüren-Bild 504 px.`
    : `  Bilder unter images/ im Newsletter-Tool hochladen und die src-Pfade anpassen.
  keyvisual-ql74-edge.jpg und mockup-farbuebersicht-kompendium.jpg sind Ausschnitte aus Screenshots,
  bitte durch die Originale ersetzen (Anzeigebreite 600 px bzw. 504 px).`);

  const preheader = cr
    ? ''
    : `\n<div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">QuinLine® 74 Edge: die konsequent geradlinige Hebeschiebetür für Glasdicken bis 50 mm – Systemdaten, Verfügbarkeit, Glasleisten und Kompendium.${'&#847;&zwnj;&nbsp;'.repeat(20)}</div>\n`;

  return `<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>QuinLine® 74 Edge – Produkt-News von SCHMIDT</title>
<!--
  SCHMIDT Produkt-News: QuinLine® 74 Edge
  Erzeugt aus source/template.mjs – Änderungen dort vornehmen und source/build.mjs ausführen.
  E-Mail-HTML: Tabellen-Layout, Inline-Styles, 600 px, Schrift Arial (Office-Schrift laut CD-Guideline), für Outlook gehärtet.
${notes}
${contentOnly ? '' : '  Platzhalter vor dem Versand ersetzen: LINK-LINKEDIN, LINK-INSTAGRAM, LINK-FACEBOOK.\n'}  Die Anrede-Variable {SALUTATION…} {LASTNAME} ist unverändert aus dem Original übernommen.
-->
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>
  table, td, p, a, span, h1, h2, h3 { font-family: Arial, Helvetica, sans-serif !important; }
</style>
<![endif]-->
<style>
  html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  a { text-decoration: none; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font: inherit !important; }
  u + #body a { color: inherit; text-decoration: none; font: inherit; }
  .hy { -webkit-hyphens: auto; -ms-hyphens: auto; hyphens: auto; }
  .btn-red:hover { background: #c30026 !important; }
  .btn-out:hover { background: #ffffff !important; }
  .btn-out:hover a { color: #123442 !important; }

  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .stack { display: block !important; width: 100% !important; box-sizing: border-box; }
    .stack-spacer { display: block !important; width: 100% !important; height: 24px !important; }
    .spec-l { padding-bottom: 0 !important; border-bottom: 0 !important; }
    .spec-v { padding-top: 2px !important; }
    .h2, .h2 h2 { font-size: 24px !important; line-height: 28px !important; }
    .lead, .lead p { font-size: 17px !important; line-height: 26px !important; }
    .stat { font-size: 20px !important; line-height: 24px !important; }
    .img-fluid { width: 100% !important; height: auto !important; }
    .social td.sp { width: 8px !important; }
  }
</style>
</head>
<body id="body" style="margin:0; padding:0; background:${PAGE}; word-spacing:normal;">${preheader}
${T(`width="100%" bgcolor="${PAGE}" style="background:${PAGE};"`)}
<tr>
<td align="center" bgcolor="${PAGE}" style="padding:0; background:${PAGE};">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;"><![endif]-->
${T('class="container" width="600" style="width:600px; max-width:600px;"')}
<tr>
<td style="padding:0;">

${contentOnly ? '' : `<!-- KOPFZEILE (fest) -->\n${header}\n`}
${body}
${contentOnly ? '' : `\n<!-- FOOTER (fest) -->\n${footer}\n\n${T('width="100%"')}${spacer(32, PAGE)}</table>\n`}
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td>
</tr>
</table>
</body>
</html>
`;
}
