# Abgespeckter Edge-Newsletter für den Außendienst (Interessenten, nach telefonischer Zusage).
# Aufbau: persönlicher Einstieg (normaler Mailtext) – gestalteter Teil im Newsletter-Design – Gruß und Signatur.
# Gestaltung und Outlook-Regeln wie source/template.mjs (Tabellen-Layout, Inline-Styles, Spacer-Zeilen,
# Linien als Rahmen, jede Zelle mit eigenem padding und eigener Hintergrundfarbe).
# Erzeugt in renders/aussendienst/:
#   - edge-newsletter-aussendienst.eml   öffnet sich im klassischen Outlook als bearbeitbarer Entwurf (X-Unsent)
#   - edge-newsletter-aussendienst.html  Browser-Fassung (Bilder aus ../images/) zum Prüfen oder Kopieren
# Aufruf (im Repo-Root): python3 projects/newsletter-ql74-edge/source/build-aussendienst-newsletter.py
from email.message import EmailMessage
from pathlib import Path

here = Path(__file__).resolve().parent
renders = here.parent / 'renders'
out = renders / 'aussendienst'
out.mkdir(parents=True, exist_ok=True)

SUBJECT = 'Wie besprochen: Infos zur QuinLine® 74 Edge'
LINK = ('https://schmidt-boke.de/de/quinline-74-edge-ab-sofort-bestellbar/'
        '?utm_source=aussendienst&utm_medium=email&utm_campaign=ql74-edge')

IMAGES = {  # Datei -> Content-ID im Outlook-Entwurf
    'keyvisual-ql74-edge.jpg': 'keyvisual-edge@schmidt-boke.de',
    'logo-schmidt-negativ.png': 'logo-schmidt@schmidt-boke.de',
}

F = 'font-family:Arial,Helvetica,sans-serif;'
X = 'mso-line-height-rule:exactly;'
BLUE, RED, YELLOW, WHITE = '#123442', '#e3002c', '#f6a206', '#ffffff'
GREY, HAIR, HAIR_BLUE, ON_BLUE = '#f6f6f6', '#d0d7db', '#4b656f', '#e7ebec'
HL = 'background:#ffff00;'  # Platzhalter gelb, damit sie vor dem Senden auffallen


def T(attrs=''):
    return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{" " + attrs if attrs else ""}>'


def spacer(h, bg):
    return (f'<tr><td height="{h}" bgcolor="{bg}" style="padding:0; height:{h}px; background:{bg}; '
            f'font-size:1px; line-height:1px; {X}">&nbsp;</td></tr>')


def row(bg, content, style='', attrs=''):
    return f'<tr><td{" " + attrs if attrs else ""} bgcolor="{bg}" style="padding:0 32px; background:{bg}; {style}">{content}</td></tr>'


def p(inner, size=16, lh=24, color='#000000', mb=0, extra=''):
    return (f'<p style="margin:0 0 {mb}px 0; {F} font-size:{size}px; line-height:{lh}px; {X} '
            f'color:{color};{" " + extra if extra else ""}">{inner}</p>')


def rule(color, bg):
    return (f'{T("width=\"64\"")}<tr><td width="64" height="1" bgcolor="{bg}" style="padding:0; width:64px; height:1px; '
            f'background:{bg}; border-top:4px solid {color}; font-size:1px; line-height:1px; {X}">&nbsp;</td></tr></table>')


def section(bg, rows):
    return f'{T(f"width=\"100%\" bgcolor=\"{bg}\" style=\"background:{bg};\"")}\n' + '\n'.join(rows) + '\n</table>'


def eyebrow(text, color):
    return (f'<p style="margin:0 0 10px 0; {F} font-size:12px; line-height:16px; {X} font-weight:700; '
            f'letter-spacing:1.4px; text-transform:uppercase; color:{color};">{text}</p>')


def h2(text, color):
    return (f'<h2 style="margin:0; {F} font-size:26px; line-height:30px; {X} font-weight:700; '
            f'letter-spacing:-0.2px; color:{color};">{text}</h2>')


def heading(bg, kicker, title, on_blue=False):
    return row(bg, eyebrow(kicker, WHITE if on_blue else RED) + h2(title, WHITE if on_blue else BLUE))


def button(href, label):
    return (f'{T()}<tr><td bgcolor="{RED}" style="padding:13px 24px; background:{RED}; {F} font-size:16px; line-height:20px; '
            f'{X} font-weight:700; color:{WHITE};"><a href="{href}" style="{F} font-size:16px; line-height:20px; '
            f'font-weight:700; color:{WHITE}; text-decoration:none;">{label}</a></td></tr></table>')


def spec_table(rows):
    tr = '\n'.join(
        f'<tr><td width="34%" valign="top" bgcolor="{WHITE}" style="padding:11px 12px 11px 0; background:{WHITE}; '
        f'border-bottom:1px solid {HAIR}; {F} font-size:15px; line-height:22px; {X} font-weight:700; color:{BLUE};">{a}</td>'
        f'<td valign="top" bgcolor="{WHITE}" style="padding:11px 0; background:{WHITE}; border-bottom:1px solid {HAIR}; '
        f'{F} font-size:15px; line-height:22px; {X} color:#000000;">{b}</td></tr>'
        for a, b in rows)
    return (f'{T("width=\"100%\"")}\n<tr><td colspan="2" height="1" bgcolor="{WHITE}" style="padding:0; height:1px; '
            f'background:{WHITE}; border-top:2px solid {BLUE}; font-size:1px; line-height:1px; {X}">&nbsp;</td></tr>\n{tr}\n</table>')


def card(src):
    keyvisual = (f'{T(f"width=\"100%\" bgcolor=\"{BLUE}\" style=\"background:{BLUE};\"")}<tr><td bgcolor="{BLUE}" '
                 f'style="padding:0; background:{BLUE};"><img src="{src("keyvisual-ql74-edge.jpg")}" width="600" height="340" '
                 f'alt="QuinLine® 74 Edge – die geradlinige Hebeschiebetür von SCHMIDT" style="display:block; width:600px; '
                 f'max-width:100%; height:auto; border:0;"></td></tr></table>')

    intro = section(WHITE, [
        spacer(40, WHITE),
        heading(WHITE, 'Neu im Programm', 'Die geradlinige Variante der QuinLine®&nbsp;74'),
        spacer(16, WHITE),
        row(WHITE, rule(RED, WHITE)),
        spacer(24, WHITE),
        row(WHITE,
            p(f'Mit dem Profilsystem <strong style="color:{BLUE};">QuinLine®&nbsp;74 Edge</strong> erweitern wir unser '
              'Hebeschiebetür-Programm um eine konsequent geradlinige Variante. Der schmale Flügelüberschlag und die eckigen '
              'Glasleisten verzichten bewusst auf Rundungen. So entsteht eine markante, nahezu rechtwinklige Kontur, die sich '
              'nahtlos in Objekte mit eckigen Fensterprofilen einfügt.', mb=16)
            + p('Gleichzeitig nimmt das System Glasdicken bis 50&nbsp;mm auf und ist damit bestens gerüstet für '
                'Dreifachverglasung, Schall- und Sicherheitsglas. Die Technik entspricht der bewährten QuinLine®&nbsp;74.'),
            style=f'{F} font-size:16px; line-height:24px; {X} color:#000000;'),
        spacer(32, WHITE),
        row(WHITE, 'Die wichtigsten Systemdaten', style=f'{F} font-size:19px; line-height:25px; {X} font-weight:700; color:#000000;'),
        spacer(12, WHITE),
        row(WHITE, spec_table([
            ('Zargenprofil', '5 Kammern, Bautiefe 174&nbsp;mm, Ansicht&nbsp;63&nbsp;mm'),
            ('Flügelprofil', '5 Kammern, Bautiefe 74&nbsp;mm, Ansicht&nbsp;92&nbsp;mm'),
            ('Profilüberschlag', 'geradlinig und schlank, 25&nbsp;mm Höhe'),
            ('Design', 'kantige Glasleisten und Mitteldichtleisten'),
            ('Glasdicken', 'bis 50&nbsp;mm'),
            ('Elementgrößen', 'bis 7&nbsp;m Breite und 2,50&nbsp;m Höhe'),
            ('Getriebe', 'Riegelbolzen- oder Hakenriegelgetriebe'),
            ('Sicherheit', 'Sicherheitspakete ohne Einschränkungen einsetzbar'),
        ])),
        spacer(40, WHITE),
    ])

    def info(label, value):
        return (f'<tr><td bgcolor="{BLUE}" style="padding:14px 0; background:{BLUE}; border-bottom:1px solid {HAIR_BLUE}; '
                f'{F} font-size:16px; line-height:24px; {X} color:{ON_BLUE};">'
                + p(label, color=WHITE, mb=2, extra='font-weight:700;') + p(value, color=ON_BLUE) + '</td></tr>')

    verfuegbar = section(BLUE, [
        spacer(40, BLUE),
        heading(BLUE, 'Verfügbarkeit', 'Ab sofort bestellbar', on_blue=True),
        spacer(16, BLUE),
        row(BLUE, rule(YELLOW, BLUE)),
        spacer(20, BLUE),
        row(BLUE, f'{T("width=\"100%\"")}\n<tr><td height="1" bgcolor="{BLUE}" style="padding:0; height:1px; background:{BLUE}; '
                  f'border-top:1px solid {HAIR_BLUE}; font-size:1px; line-height:1px; {X}">&nbsp;</td></tr>\n'
                  + info('Schwelle', 'mit Standardschwelle ab sofort bestellbar')
                  + info('Farben', 'weiß und cremeweiß durchgefärbt sowie Standard- und Sonderdekore')
                  + info('Verglasungsdichtungen', 'schwarz und grau')
                  + '\n</table>'),
        spacer(40, BLUE),
        f'<tr><td height="8" bgcolor="{YELLOW}" style="padding:0; height:8px; background:{YELLOW}; font-size:8px; line-height:8px; {X}">&nbsp;</td></tr>',
    ])

    muster = section(WHITE, [
        spacer(40, WHITE),
        row(WHITE, f'{T(f"width=\"100%\" bgcolor=\"{GREY}\" style=\"background:{GREY};\"")}<tr><td bgcolor="{GREY}" '
                   f'style="padding:24px 24px 24px 22px; background:{GREY}; border-left:6px solid {RED}; {F} font-size:16px; '
                   f'line-height:24px; {X} color:#000000;">'
                   + p('Flügelmuster für Ihre Ausstellung?', size=19, lh=25, color=BLUE, mb=8, extra='font-weight:700;')
                   + p('Gern sende ich Ihnen kostenlos ein Muster einer Flügelecke mit dem Edge-Profil. '
                       'Antworten Sie mir dazu einfach kurz auf diese Mail.')
                   + '</td></tr></table>'),
        spacer(28, WHITE),
        row(WHITE, p('Alle Details zur QuinLine®&nbsp;74 Edge finden Sie auf unserer Website.', mb=16) + button(LINK, 'Zur QuinLine®&nbsp;74 Edge')),
        spacer(40, WHITE),
    ])

    def social(label, href):
        return (f'<td bgcolor="{BLUE}" style="padding:0; background:{BLUE};">{T()}<tr><td bgcolor="{BLUE}" '
                f'style="padding:8px 14px; background:{BLUE}; border:1px solid {WHITE}; {F} font-size:13px; line-height:18px; '
                f'{X} font-weight:700; color:{WHITE};"><a href="{href}" style="{F} font-size:13px; line-height:18px; '
                f'font-weight:700; color:{WHITE}; text-decoration:none;">{label}</a></td></tr></table></td>')

    gap = f'<td width="10" bgcolor="{BLUE}" style="padding:0; width:10px; background:{BLUE}; font-size:1px; line-height:1px; {X}">&nbsp;</td>'
    fuss = section(BLUE, [
        spacer(32, BLUE),
        row(BLUE, f'<img src="{src("logo-schmidt-negativ.png")}" width="150" height="24" alt="SCHMIDT" '
                  f'style="display:block; margin:0 auto; width:150px; height:auto; border:0;">', attrs='align="center"'),
        spacer(14, BLUE),
        row(BLUE, f'<a href="https://www.schmidt-boke.de" style="{F} font-size:14px; line-height:20px; color:{WHITE}; '
                  f'text-decoration:none;">www.schmidt-boke.de</a>', attrs='align="center"',
            style=f'{F} font-size:14px; line-height:20px; {X} color:{WHITE};'),
        spacer(18, BLUE),
        row(BLUE, f'{T("align=\"center\"")}<tr>'
                  + social('LinkedIn', 'https://www.linkedin.com/company/schmidt-die-hebeschiebetuer') + gap
                  + social('Instagram', 'https://www.instagram.com/schmidt_die_hebeschiebetuer/') + gap
                  + social('Facebook', 'https://www.facebook.com/schmidtdiehebeschiebetuer')
                  + '</tr></table>', attrs='align="center"'),
        spacer(32, BLUE),
        f'<tr><td height="8" bgcolor="{YELLOW}" style="padding:0; height:8px; background:{YELLOW}; font-size:8px; line-height:8px; {X}">&nbsp;</td></tr>',
    ])

    return (f'<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;"><![endif]-->\n'
            f'{T("width=\"600\" style=\"width:600px; max-width:100%; border:1px solid " + HAIR + ";\"")}<tr><td style="padding:0;">\n'
            f'{keyvisual}\n{intro}\n{verfuegbar}\n{muster}\n{fuss}\n'
            f'</td></tr></table>\n<!--[if mso]></td></tr></table><![endif]-->')


MAIL = 'margin:0 0 11pt 0; font-family:Arial,Helvetica,sans-serif; font-size:11pt; line-height:1.4; color:#000000;'


def document(src):
    return f'''<!DOCTYPE html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{SUBJECT}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  table, td {{ mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }}
  img {{ -ms-interpolation-mode:bicubic; border:0; }}
</style>
</head>
<body style="margin:0; padding:0; background:#ffffff;">
<p style="{MAIL}">Guten Tag <span style="{HL}">Frau/Herr [Name]</span>,</p>
<p style="{MAIL}">vielen Dank für das nette Telefonat. Wie besprochen schicke ich Ihnen hier die wichtigsten Infos zu unserer neuen QuinLine®&nbsp;74 Edge.</p>
<p style="margin:0 0 6pt 0; font-size:1px; line-height:1px;">&nbsp;</p>
{card(src)}
<p style="margin:0 0 6pt 0; font-size:1px; line-height:1px;">&nbsp;</p>
<p style="{MAIL} margin-top:14pt;">Bei Fragen bin ich gern für Sie da.</p>
<p style="{MAIL}">Viele Grüße</p>
<p style="{MAIL}"><span style="{HL}">[Hier Signatur einfügen: Nachricht → Signatur]</span></p>
</body>
</html>
'''


TEXT = f'''Guten Tag Frau/Herr [Name],

vielen Dank für das nette Telefonat. Wie besprochen schicke ich Ihnen hier die wichtigsten Infos zu unserer neuen QuinLine® 74 Edge.

Mit dem Profilsystem QuinLine® 74 Edge erweitern wir unser Hebeschiebetür-Programm um eine konsequent geradlinige Variante: schmaler Flügelüberschlag (25 mm), kantige Glas- und Mitteldichtleisten, Glasdicken bis 50 mm. Die Technik entspricht der bewährten QuinLine® 74. Mit Standardschwelle ist die Edge ab sofort bestellbar.

Gern sende ich Ihnen kostenlos ein Muster einer Flügelecke mit dem Edge-Profil. Antworten Sie mir dazu einfach kurz auf diese Mail.

Alle Details: {LINK}

Bei Fragen bin ich gern für Sie da.

Viele Grüße
'''

# 1) Browser-Fassung zum Prüfen (Bilder aus renders/images/)
(out / 'edge-newsletter-aussendienst.html').write_text(document(lambda f: '../images/' + f), encoding='utf-8')

# 2) Outlook-Entwurf mit eingebetteten Bildern
msg = EmailMessage()
msg['Subject'] = SUBJECT
msg['X-Unsent'] = '1'
msg.set_content(TEXT)
msg.add_alternative(document(lambda f: 'cid:' + IMAGES[f]), subtype='html')
html_part = msg.get_payload()[1]
for f, cid in IMAGES.items():
    data = (renders / 'images' / f).read_bytes()
    sub = 'png' if f.endswith('.png') else 'jpeg'
    html_part.add_related(data, 'image', sub, cid='<' + cid + '>', disposition='inline', filename=f)
(out / 'edge-newsletter-aussendienst.eml').write_bytes(bytes(msg))
print(out)
