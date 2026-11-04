// Newsletter „Restplätze Seminar Montage und Technik“ (November 2026) – gemeinsame Quelle für beide Fassungen:
//   cr: true  -> CleverReach-Vorlage (Editor-Markierungen html/image/loop, Bilder flach im ZIP)
//   cr: false -> eigenständiges E-Mail-HTML (Bilder unter images/)
// Aufbau und Outlook-Regeln wie projects/newsletter-ql74-edge/source/template.mjs:
//   jede <td> mit explizitem padding · farbige Linien als Rahmen · Abstände über Spacer-Zeilen ·
//   Zellen in farbigen Flächen tragen die Flächenfarbe · keine direkt benachbarten Tabellen in einer Zelle.
// Fakten (Termine, Inhalte, Kontakt) aus dem Seminar-Newsletter vom September 2026.

const F = 'font-family:Arial,Helvetica,sans-serif;';
const X = 'mso-line-height-rule:exactly;';
const BLUE = '#123442';
const RED = '#e3002c';
const YELLOW = '#f6a206';
const WHITE = '#ffffff';
const GREY = '#f6f6f6';
const PAGE = '#eef1f2';
const HAIR_BLUE = '#4b656f';
const ON_BLUE = '#e7ebec';

// CleverReach-Links aus der bisherigen SCHMIDT-Vorlage ([…] sind CleverReach-Platzhalter, & als &amp; im href)
const URL_ONLINE = 'https://262600.seu2.cleverreach.com/m/[MAILING_ID]/[HASH]';
const URL_ABMELDEN = 'https://366524.eu2.cleverreach.com/rmftlp.php?cid=[CTID]&amp;mid=[MAILING_ID]&amp;h=[CTID]-[USER_ID_SECURE]';
const MAIL_ANMELDUNG = 'mailto:seminare@schmidt-boke.de?subject=Anmeldung%20Seminar%20Montage%20und%20Technik';

const T = (attrs = '') => `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${attrs ? ' ' + attrs : ''}>`;
const bgAttr = (bg) => (bg ? ` bgcolor="${bg}"` : '');
const bgCss = (bg) => (bg ? ` background:${bg};` : '');

export function render({ cr }) {
  const html = (inner) => (cr ? `<!--#html #-->${inner}<!--#/html#-->` : inner);
  const image = (inner) => (cr ? `<!--#image #-->${inner}<!--#/image#-->` : inner);
  const src = (file) => (cr ? file : `images/${file}`);

  const spacer = (h, bg) =>
    `<tr><td height="${h}"${bgAttr(bg)} style="padding:0; height:${h}px;${bgCss(bg)} font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr>`;
  const row = (bg, content, { style = '', cls = '', attrs = '' } = {}) =>
    `<tr><td class="px${cls ? ' ' + cls : ''}"${attrs ? ' ' + attrs : ''}${bgAttr(bg)} style="padding:0 48px;${bgCss(bg)} ${style}">${content}</td></tr>`;
  const rule = (color, bg) =>
    `${T('width="64"')}<tr><td width="64" height="1"${bgAttr(bg)} style="padding:0; width:64px; height:1px;${bgCss(bg)} border-top:4px solid ${color}; font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr></table>`;
  const hairline = (color, bg) =>
    `${T('width="100%"')}<tr><td height="1"${bgAttr(bg)} style="padding:0; height:1px;${bgCss(bg)} border-top:1px solid ${color}; font-size:1px; line-height:1px; ${X}">&nbsp;</td></tr></table>`;
  const section = (bg, rows) =>
    `${T(`width="100%" bgcolor="${bg}" style="background:${bg};"`)}\n${rows.join('\n')}\n</table>`;
  const p = (inner, { size = 16, lh = 24, color = '#000000', mb = 0, extra = '' } = {}) =>
    `<p style="margin:0 0 ${mb}px 0; ${F} font-size:${size}px; line-height:${lh}px; ${X} color:${color};${extra ? ' ' + extra : ''}">${inner}</p>`;
  const eyebrow = (t, color) =>
    `<p style="margin:0 0 10px 0; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${color};">${t}</p>`;
  const h2 = (t, color) =>
    `<h2 style="margin:0; ${F} font-size:28px; line-height:32px; ${X} font-weight:700; letter-spacing:-0.2px; color:${color};">${t}</h2>`;
  const heading = (bg, kicker, title, onBlue = false) =>
    row(bg, html(`\n${eyebrow(kicker, onBlue ? WHITE : RED)}\n${h2(title, onBlue ? WHITE : BLUE)}\n`), {
      cls: 'h2',
      style: `${F} font-size:28px; line-height:32px; ${X} font-weight:700; color:${onBlue ? WHITE : BLUE};`,
    });
  const text = (bg, inner, { size = 16, lh = 24, color = '#000000' } = {}) =>
    row(bg, html(inner), { cls: 'hy', attrs: 'lang="de"', style: `${F} font-size:${size}px; line-height:${lh}px; ${X} color:${color};` });
  const button = (href, label) =>
    `${T()}<tr><td class="btn-red" bgcolor="${RED}" style="padding:13px 24px; background:${RED}; ${F} font-size:16px; line-height:20px; ${X} font-weight:700; color:${WHITE};">${html(`<a href="${href}" style="${F} font-size:16px; line-height:20px; font-weight:700; color:${WHITE}; text-decoration:none;">${label}</a>`)}</td></tr></table>`;
  const mail = (color) =>
    `<a href="mailto:seminare@schmidt-boke.de" style="color:${color}; text-decoration:none; font-weight:700; white-space:nowrap;">seminare@schmidt-boke.de</a>`;

  // ---------------------------------------------------------------- Blöcke

  const header = `${T('width="100%"')}
<tr><td class="px" style="padding:20px 0 12px 0;">${T('width="100%"')}<tr>
<td align="left" style="padding:0; ${F} font-size:12px; line-height:16px; ${X} font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:${BLUE};">${html('QuinLine® Seminare')}</td>
<td align="right" style="padding:0; ${F} font-size:12px; line-height:16px; ${X} color:#6e7478;">${html('Montage und Technik')}</td>
</tr></table></td></tr>
</table>`;

  const keyvisual = `${T(`width="100%" bgcolor="${BLUE}" style="background:${BLUE};"`)}
<tr><td bgcolor="${BLUE}" style="padding:0; background:${BLUE};">${image(`<img src="${src('keyvisual-seminare.jpg')}" width="600" height="338" class="img-fluid" alt="QuinLine® Seminare bei SCHMIDT in Delbrück-Boke" style="display:block; width:600px; max-width:100%; height:auto; border:0; ${F} font-size:24px; line-height:30px; font-weight:700; color:${WHITE};">`)}</td></tr>
</table>`;

  const intro = section(WHITE, [
    spacer(48, WHITE),
    text(WHITE, `
${p('{SALUTATION[std:Sehr geehrte Damen und Herren][salutation:formal|de]} {LASTNAME},', { mb: 20 })}
${p('im September haben wir Sie zu unseren QuinLine® Seminaren im November eingeladen. Für das <strong style="color:' + BLUE + ';">Seminar für Montage und Technik</strong> sind an beiden Terminen noch vereinzelt Plätze frei.', { mb: 20 })}
${p('Neu dabei ist ein Gastbeitrag der Firma Knelsen, mit Vortrag und gemeinsamer Montage an einer Muster-Hebeschiebetür. Wenn Ihre Monteure und Techniker dabei sein sollen, melden Sie sie am besten jetzt an.')}
`),
    spacer(48, WHITE),
  ]);

  // Restplätze: zwei Termine nebeneinander (mobil untereinander), darunter Ort und Knopf
  const termin = (tag, datum) =>
    `<td class="stack" width="240" valign="top" bgcolor="${BLUE}" style="padding:16px 0 0 0; background:${BLUE}; border-top:1px solid ${HAIR_BLUE}; ${F} font-size:14px; line-height:20px; ${X} color:${ON_BLUE};">${html(`
${p(tag, { size: 14, lh: 20, color: ON_BLUE, mb: 4 })}
${p(datum, { size: 20, lh: 26, color: WHITE, mb: 4, extra: 'font-weight:700;' })}
${p('09:00 bis 16:15 Uhr', { size: 14, lh: 20, color: ON_BLUE })}
`)}</td>`;

  const restplaetze = section(BLUE, [
    spacer(56, BLUE),
    heading(BLUE, 'Seminar für Montage und Technik', 'Noch vereinzelt Plätze frei', true),
    spacer(16, BLUE),
    row(BLUE, rule(YELLOW, BLUE)),
    spacer(32, BLUE),
    row(BLUE, `${T('width="100%"')}<tr>
${termin('Donnerstag', '12.11.2026')}
<td class="stack-spacer" width="24" bgcolor="${BLUE}" style="padding:0; width:24px; background:${BLUE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>
${termin('Donnerstag', '19.11.2026')}
</tr></table>`),
    spacer(32, BLUE),
    row(BLUE, `${T('width="100%"')}
<tr><td bgcolor="${BLUE}" style="padding:16px 0; background:${BLUE}; border-top:1px solid ${HAIR_BLUE}; border-bottom:1px solid ${HAIR_BLUE}; ${F} font-size:16px; line-height:24px; ${X} color:${ON_BLUE};">${html(`
${p('Ort', { color: WHITE, mb: 4, extra: 'font-weight:700;' })}
${p('SCHMIDT GmbH, Töllen Linde 3, 33129&nbsp;Delbrück-Boke', { color: ON_BLUE })}
`)}</td></tr>
</table>`),
    spacer(32, BLUE),
    row(BLUE, button(MAIL_ANMELDUNG, 'Jetzt Platz sichern')),
    spacer(48, BLUE),
    `<tr><td height="8" bgcolor="${YELLOW}" style="padding:0; height:8px; background:${YELLOW}; font-size:8px; line-height:8px; ${X}">&nbsp;</td></tr>`,
  ]);

  // Gastbeitrag Knelsen: Einleitung, Foto, zwei Teile (Theorie | Praxis)
  const teil = (nr, titel, body) =>
    `<td class="stack" width="240" valign="top" bgcolor="${GREY}" style="padding:20px 20px 22px 20px; background:${GREY}; border-top:4px solid ${BLUE}; ${F} font-size:16px; line-height:24px; ${X} color:#000000;">${html(`
${p(nr, { size: 12, lh: 16, color: '#6e7478', mb: 4, extra: 'font-weight:700; letter-spacing:1.4px; text-transform:uppercase;' })}
${p(titel, { size: 20, lh: 26, color: BLUE, mb: 10, extra: 'font-weight:700;' })}
${p(body)}
`)}</td>`;

  const knelsen = section(WHITE, [
    spacer(56, WHITE),
    heading(WHITE, 'Neu bei den Technik-Seminaren', 'Sicher befestigt: Gastbeitrag von Knelsen'),
    spacer(16, WHITE),
    row(WHITE, rule(RED, WHITE)),
    spacer(24, WHITE),
    text(WHITE, `Für einen praxisnahen Gastbeitrag konnten wir die Firma Knelsen (<a href="https://www.knelsen.de" style="color:${RED}; text-decoration:none; font-weight:700;">www.knelsen.de</a>) gewinnen. Das Unternehmen ist auf die Entwicklung und Herstellung von Fensterbefestigungen für energetisch hochwertige Fenstersysteme spezialisiert. Der Gastbeitrag besteht aus zwei Teilen:`),
    spacer(24, WHITE),
    row(WHITE, `${T('width="100%"')}<tr>
${teil('Teil 1', 'Theorie', 'Knelsen stellt sichere Befestigungssysteme vor und zeigt, worauf es bei der fachgerechten Montage der Hebeschiebetür ankommt.')}
<td class="stack-spacer" width="24" bgcolor="${WHITE}" style="padding:0; width:24px; background:${WHITE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>
${teil('Teil 2', 'Praxis', 'An einer Muster-Hebeschiebetür zeigen wir gemeinsam, wie die Montage in der Praxis abläuft. Jeder Teilnehmer wirkt mit und testet selbst.')}
</tr></table>`),
    spacer(24, WHITE),
    row(WHITE, image(`<img src="${src('montage-praxis.jpg')}" width="504" height="336" class="img-fluid" alt="Montage einer Hebeschiebetür in der Praxis" style="display:block; width:504px; max-width:100%; height:auto; border:0; ${F} font-size:14px; color:#6e7478;">`), { attrs: 'align="center"' }),
    spacer(24, WHITE),
    text(WHITE, 'Daneben stehen wie angekündigt Lagerung und Transport, Vorbereitung und Montage sowie Fehlerbilder und Fallbeispiele aus der Praxis auf dem Programm.'),
    spacer(56, WHITE),
  ]);

  // Anmeldung: Foto Mark Dieckmann + Text, darunter Gruß
  const anmeldung = section(WHITE, [
    row(WHITE, hairline('#d0d7db', WHITE)),
    spacer(56, WHITE),
    heading(WHITE, 'Anmeldung', 'Jetzt Platz sichern'),
    spacer(16, WHITE),
    row(WHITE, rule(RED, WHITE)),
    spacer(24, WHITE),
    row(WHITE, `${T('width="100%"')}<tr>
<td class="stack" width="200" valign="top" bgcolor="${WHITE}" style="padding:0; background:${WHITE};">${image(`<img src="${src('mark-dieckmann.jpg')}" width="200" height="214" alt="Mark Dieckmann, SCHMIDT GmbH" style="display:block; width:200px; height:auto; border:0; ${F} font-size:14px; color:#6e7478;">`)}</td>
<td class="stack-spacer" width="24" bgcolor="${WHITE}" style="padding:0; width:24px; background:${WHITE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>
<td class="stack hy" lang="de" valign="top" bgcolor="${WHITE}" style="padding:0; background:${WHITE}; ${F} font-size:16px; line-height:24px; ${X} color:#000000;">${html(`
${p(`Für Anmeldungen oder Fragen zu den Seminaren melden Sie sich gerne bei Mark Dieckmann unter ${mail(RED)}.`, { mb: 16 })}
${p('Nennen Sie uns dabei einfach den gewünschten Termin, den 12.&nbsp;oder 19.&nbsp;November, und wie viele Personen teilnehmen.', { mb: 24 })}
`)}${button(MAIL_ANMELDUNG, 'Platz sichern')}</td>
</tr></table>`),
    spacer(40, WHITE),
    text(WHITE, `
${p('Wir freuen uns auf Sie und Ihr Team in Delbrück-Boke!', { mb: 16 })}
${p('Mit freundlichen Grüßen<br><strong style="color:' + BLUE + ';">Ihr Team der SCHMIDT GmbH</strong>')}
`),
    spacer(56, WHITE),
  ]);

  const social = (label, href) =>
    `<td bgcolor="${BLUE}" style="padding:0; background:${BLUE};">${T()}<tr><td class="btn-out" bgcolor="${BLUE}" style="padding:9px 16px; background:${BLUE}; border:1px solid ${WHITE}; ${F} font-size:14px; line-height:20px; ${X} font-weight:700; color:${WHITE};">${html(`<a href="${href}" style="${F} font-size:14px; line-height:20px; font-weight:700; color:${WHITE}; text-decoration:none;">${label}</a>`)}</td></tr></table></td>`;
  const gap = `<td class="sp" width="12" bgcolor="${BLUE}" style="padding:0; width:12px; background:${BLUE}; font-size:1px; line-height:1px; ${X}">&nbsp;</td>`;

  const footer = section(BLUE, [
    spacer(48, BLUE),
    row(BLUE, html('Immer up to date – SCHMIDT auf Social Media'), { attrs: 'align="center"', style: `${F} font-size:20px; line-height:26px; ${X} font-weight:700; color:${WHITE};` }),
    spacer(20, BLUE),
    row(BLUE, `${T('class="social" align="center"')}<tr>
${social('LinkedIn', 'https://www.linkedin.com/company/schmidt-die-hebeschiebetuer')}${gap}${social('Instagram', 'https://www.instagram.com/schmidt_die_hebeschiebetuer/')}${gap}${social('Facebook', 'https://www.facebook.com/schmidtdiehebeschiebetuer')}
</tr></table>`, { attrs: 'align="center"' }),
    spacer(40, BLUE),
    row(BLUE, hairline(HAIR_BLUE, BLUE)),
    spacer(32, BLUE),
    row(BLUE, `<img src="${src('logo-schmidt-negativ.png')}" width="150" height="24" alt="SCHMIDT" style="display:block; margin:0 auto; width:150px; height:auto; border:0; ${F} font-size:20px; font-weight:700; color:${WHITE};">`, { attrs: 'align="center"' }),
    spacer(24, BLUE),
    row(BLUE, html(`Weitere Informationen zu Neuheiten und Änderungen erhalten Sie regelmäßig in unserem Kunden-Login unter <a href="https://kunden-login.schmidt-boke.de/" style="color:${WHITE}; text-decoration:underline;">kunden-login.schmidt-boke.de</a>.`), { cls: 'hy', attrs: 'align="center" lang="de"', style: `${F} font-size:14px; line-height:20px; ${X} color:${ON_BLUE};` }),
    spacer(40, BLUE),
    `<tr><td height="8" bgcolor="${YELLOW}" style="padding:0; height:8px; background:${YELLOW}; font-size:8px; line-height:8px; ${X}">&nbsp;</td></tr>`,
  ]);

  const legalText = (inner) =>
    row(PAGE, html(inner), { attrs: 'align="center"', style: `${F} font-size:12px; line-height:18px; ${X} color:#4b565c;` });
  const legalLink = (href, label) => `<a href="${href}" style="color:${RED}; font-weight:700; text-decoration:none;">${label}</a>`;
  const plainLink = (href, label) => `<a href="${href}" style="color:#4b565c; text-decoration:none;">${label}</a>`;
  const legal = section(PAGE, [
    spacer(32, PAGE),
    legalText(`Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte ${legalLink(URL_ONLINE, 'hier')}.`),
    spacer(24, PAGE),
    legalText('SCHMIDT GmbH<br>Töllen Linde 3<br>33129 Delbrück-Boke<br>Deutschland'),
    spacer(16, PAGE),
    legalText(`${plainLink('tel:+49525098450', '+49 5250 9845-0')}<br>${plainLink('mailto:kontakt@schmidt-boke.de', 'kontakt@schmidt-boke.de')}<br>${plainLink('https://www.schmidt-boke.de', 'www.schmidt-boke.de')}`),
    spacer(16, PAGE),
    legalText('Geschäftsführer: Teresa Schmidt-Bertsch, Meinolf Funkenmeier<br>Register: Amtsgericht Paderborn, HRB 6481<br>Tax ID: DE 126 335 238'),
    spacer(16, PAGE),
    legalText(`Wenn Sie diesen Newsletter (an: {EMAIL}) nicht mehr empfangen möchten, können Sie ihn ${legalLink(URL_ABMELDEN, 'hier abbestellen')}.`),
    spacer(40, PAGE),
  ]);

  const blocks = [
    ['Titelbild', keyvisual],
    ['Einleitung', intro],
    ['Restplätze', restplaetze],
    ['Gastbeitrag Knelsen', knelsen],
    ['Anmeldung', anmeldung],
  ].map(([name, b]) => `<!-- BLOCK: ${name} -->\n${b}`);

  const body = cr
    ? `<!--#loop #-->\n${blocks.join('\n<!--#loopsplit #-->\n')}\n<!--#/loop#-->`
    : blocks.join('\n');

  const notes = cr
    ? `  Vorlage für CleverReach: die ZIP-Datei unter "Eigene Vorlagen" hochladen (nicht entpacken).
  Editierbar: Texte/Links (HTML-Markierungen), Bilder (IMAGE-Markierungen), Blöcke innerhalb von LOOP.`
    : `  Bilder unter images/ im Newsletter-Tool hochladen und die src-Pfade anpassen.`;

  const preheader = cr
    ? ''
    : `\n<div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">Seminar für Montage und Technik am 12. und 19.11.2026: noch vereinzelt Plätze frei – mit Gastbeitrag und Praxisteil von Knelsen.${'&#847;&zwnj;&nbsp;'.repeat(20)}</div>\n`;

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
<title>Restplätze: Seminar für Montage und Technik – SCHMIDT</title>
<!--
  SCHMIDT Seminare: Restplätze Seminar für Montage und Technik (12. und 19.11.2026)
  Erzeugt aus source/template.mjs – Änderungen dort vornehmen und source/build.mjs ausführen.
  E-Mail-HTML: Tabellen-Layout, Inline-Styles, 600 px, Schrift Arial (Office-Schrift laut CD-Guideline), für Outlook gehärtet.
${notes}
  Die Anrede-Variable {SALUTATION…} {LASTNAME} ist unverändert aus der bisherigen Vorlage übernommen.
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
    .h2, .h2 h2 { font-size: 24px !important; line-height: 28px !important; }
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

<!-- KOPFZEILE (fest) -->
${header}

${body}

<!-- FOOTER (fest) -->
${footer}

<!-- PFLICHTANGABEN (fest) -->
${legal}

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
