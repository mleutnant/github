# Persönliche Edge-Mail für den Außendienst (Interessenten, nach telefonischer Zusage).
# Erzeugt in renders/aussendienst/:
#   - edge-mail-aussendienst.eml   öffnet sich im klassischen Outlook als bearbeitbarer Entwurf (X-Unsent)
#   - edge-mail-aussendienst.html  zum Kopieren aus dem Browser (z. B. für das neue Outlook)
#   - render-edge-mail.jpg         Produktbild, im Entwurf eingebettet
# Aufruf (im Repo-Root): python3 projects/newsletter-ql74-edge/source/build-aussendienst-mail.py
from email.message import EmailMessage
from pathlib import Path
from PIL import Image
import io

here = Path(__file__).resolve().parent
out = here.parent / 'renders' / 'aussendienst'
out.mkdir(parents=True, exist_ok=True)

SUBJECT = 'Wie besprochen: Infos zur QuinLine® 74 Edge'
LINK = ('https://schmidt-boke.de/de/quinline-74-edge-ab-sofort-bestellbar/'
        '?utm_source=aussendienst&utm_medium=email&utm_campaign=ql74-edge')
CID = 'render-edge@schmidt-boke.de'

# Produktbild: freigestelltes Rendering auf Weiß, 560 px breit (angezeigt mit 280 px)
src = Image.open(here.parent / 'renders' / 'images' / 'render-ql74-edge-freigestellt.png').convert('RGBA')
src = src.crop(src.split()[-1].getbbox())
w = 560
h = round(src.height * w / src.width)
src = src.resize((w, h), Image.LANCZOS)
bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
bg.alpha_composite(src)
buf = io.BytesIO()
bg.convert('RGB').save(buf, 'JPEG', quality=86, optimize=True, progressive=True)
img = buf.getvalue()
(out / 'render-edge-mail.jpg').write_bytes(img)

P = 'margin:0 0 12pt 0;'
HL = 'background:#ffff00;'  # Platzhalter gelb, damit sie vor dem Senden auffallen


def html(img_src):
    return f'''<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><title>{SUBJECT}</title></head>
<body style="margin:0;padding:0;background:#ffffff">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.4;color:#000000">
<p style="{P}">Guten Tag <span style="{HL}">Frau/Herr [Name]</span>,</p>
<p style="{P}">vielen Dank für das nette Telefonat. Wie besprochen schicke ich Ihnen die Infos zu unserer neuen <b>QuinLine®&nbsp;74 Edge</b>.</p>
<p style="{P}">Die Edge ist die konsequent geradlinige Variante unserer Kunststoff-Hebeschiebetür QuinLine®&nbsp;74. Sie verzichtet bewusst auf Rundungen und passt damit genau zu Objekten mit eckigen Fensterprofilen:</p>
<ul style="margin:0 0 12pt 0;padding-left:20pt">
<li style="margin:0 0 3pt 0">schmaler, geradliniger Flügelüberschlag mit 25&nbsp;mm</li>
<li style="margin:0 0 3pt 0">kantige Glas- und Mitteldichtleisten</li>
<li style="margin:0 0 3pt 0">Glasdicken bis 50&nbsp;mm, auch für Dreifach-, Schall- und Sicherheitsglas</li>
<li style="margin:0">bewährte Technik der QuinLine®&nbsp;74, Elemente bis 7&nbsp;m Breite und 2,50&nbsp;m Höhe</li>
</ul>
<p style="{P}">Mit Standardschwelle ist die Edge ab sofort bestellbar.</p>
<p style="{P}"><img src="{img_src}" width="280" height="{round(280 * h / w)}" alt="QuinLine® 74 Edge mit kantigen Glasleisten und schmalem Flügelüberschlag" style="display:block;border:0;width:280px;height:auto"></p>
<p style="{P}">Am besten überzeugt die Optik in der Hand: Gern schicke ich Ihnen kostenlos ein Muster der Flügelecke, zum Beispiel für Ihre Ausstellung. Eine kurze Antwort auf diese Mail genügt.</p>
<p style="{P}">Alle Daten finden Sie in der Produktinformation im Anhang, weitere Informationen auf unserer Website: <a href="{LINK}" style="color:#e3002c;font-weight:bold">QuinLine®&nbsp;74 Edge</a></p>
<p style="{P}">Bei Fragen bin ich gern für Sie da.</p>
<p style="{P}">Viele Grüße</p>
<p style="{P}"><span style="{HL}">[Hier Signatur einfügen: Nachricht → Signatur]</span></p>
</div>
</body></html>
'''


TEXT = f'''Guten Tag Frau/Herr [Name],

vielen Dank für das nette Telefonat. Wie besprochen schicke ich Ihnen die Infos zu unserer neuen QuinLine® 74 Edge.

Die Edge ist die konsequent geradlinige Variante unserer Kunststoff-Hebeschiebetür QuinLine® 74. Sie verzichtet bewusst auf Rundungen und passt damit genau zu Objekten mit eckigen Fensterprofilen:

- schmaler, geradliniger Flügelüberschlag mit 25 mm
- kantige Glas- und Mitteldichtleisten
- Glasdicken bis 50 mm, auch für Dreifach-, Schall- und Sicherheitsglas
- bewährte Technik der QuinLine® 74, Elemente bis 7 m Breite und 2,50 m Höhe

Mit Standardschwelle ist die Edge ab sofort bestellbar.

Am besten überzeugt die Optik in der Hand: Gern schicke ich Ihnen kostenlos ein Muster der Flügelecke, zum Beispiel für Ihre Ausstellung. Eine kurze Antwort auf diese Mail genügt.

Alle Daten finden Sie in der Produktinformation im Anhang, weitere Informationen auf unserer Website:
{LINK}

Bei Fragen bin ich gern für Sie da.

Viele Grüße
'''

# 1) HTML-Datei zum Kopieren aus dem Browser
(out / 'edge-mail-aussendienst.html').write_text(html('render-edge-mail.jpg'), encoding='utf-8')

# 2) Outlook-Entwurf: X-Unsent: 1 lässt Outlook die Datei als neue, ungesendete Mail öffnen
msg = EmailMessage()
msg['Subject'] = SUBJECT
msg['X-Unsent'] = '1'
msg.set_content(TEXT)
msg.add_alternative(html('cid:' + CID), subtype='html')
msg.get_payload()[1].add_related(img, 'image', 'jpeg', cid='<' + CID + '>',
                                 disposition='inline', filename='quinline-74-edge.jpg')
# PDF-Produktinformation anhängen (falls vorhanden; erzeugt mit build-produktinfo.mjs)
pdf = here.parent / 'renders' / 'SCHMIDT_Produktinfo_QuinLine74_Edge.pdf'
if pdf.exists():
    msg.add_attachment(pdf.read_bytes(), maintype='application', subtype='pdf', filename=pdf.name)
(out / 'edge-mail-aussendienst.eml').write_bytes(bytes(msg))
print(out)
