const { SectionHeading, FeatureIcon, Button, NewsCard, FrameBox, Rule, StatBlock } = window.SCHMIDTDesignSystem_b5cc27;

const ARGUMENTS = [
  ['profilsystem', 'Von SCHMIDT entwickeltes, unabhängiges Profilsystem'],
  ['barrierefrei', 'Barrierefrei durch flache Schwellenlösungen'],
  ['zusatzausstattung', 'Individualisierbar in Design, Farbe und Ausstattung'],
  ['regen', 'Hohe Schlagregendichtheit bei erhöhter Windlast'],
  ['sicherheit', 'Geprüfte Sicherheit RC 1 N bis RC 3'],
  ['breite', 'Größe bis zu 7 m Breite'],
  ['thermostat', 'Passivhaustaugliche Wärmedämmung'],
  ['tablet-handy', 'Smarthomefähig – Öffnen auf Knopfdruck'],
  ['schalldaemmung', 'Lärmschutz bis 44 db']
];

const NEWS = [
  ['Beitrag zum InScreen in der bauelemente bau', 'In der aktuellen September-Ausgabe berichten wir auf einer Doppelseite über unseren InScreen-Insektenschutz für die QuinLine®-Hebeschiebetür.', '../../assets/img/innenraum-blick.png'],
  ['SCHMIDT in der Titelstory des „treffpunkt“ Magazins', 'Geschäftsführerin Teresa Schmidt-Bertsch berichtet über die Entwicklung unseres Familienbetriebs und die erfolgreiche Unternehmensnachfolge.', '../../assets/img/terrasse-hebeschiebetuer.png'],
  ['November-Seminare für Vertrieb und Montage', 'Im November 2026 startet unsere nächste Inhouse-Seminarreihe für Kaufleute und Monteure, abgerundet durch eine Betriebsführung.', '../../assets/img/hero-ausblick.png']
];

function Home({ go }) {
  return (
    <main>
      {/* Hero */}
      <section className="wrap" style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 'var(--space-8)', alignItems: 'end' }}>
          <h1 style={{ fontSize: 'var(--fs-display)', margin: 0, maxWidth: '16ch' }}>Funktion &amp; Design in Größe vereint</h1>
          <p style={{ fontSize: 'var(--fs-body-lg)', margin: 0, paddingBottom: 6, maxWidth: '38ch' }}>QuinLine® Hebeschiebetür-Systeme sind die individuelle Lösung für ein lichtdurchflutetes Zuhause.</p>
        </div>
      </section>
      <section style={{ position: 'relative', marginTop: 'var(--space-6)' }}>
        <img src="../../assets/img/hero-ausblick.png" alt="Blick durch eine QuinLine® Hebeschiebetür auf eine Waldlandschaft" style={{ width: '100%', height: 620, objectFit: 'cover' }} />
        <span aria-hidden="true" style={{ position: 'absolute', right: '4%', top: -26, width: 'var(--frame-weight)', height: 200, background: 'var(--sch-yellow)' }} />
        <span aria-hidden="true" style={{ position: 'absolute', right: '4%', top: -26, width: 160, height: 'var(--frame-weight)', background: 'var(--sch-yellow)' }} />
        <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 120, width: 120, height: 'var(--frame-weight)', background: 'var(--sch-red)' }} />
      </section>

      {/* Willkommen */}
      <section className="wrap" style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 'var(--space-9)', alignItems: 'start' }}>
          <div>
            <SectionHeading title="Willkommen beim Marktführer für Kunststoff-Hebeschiebetüren" />
            <p style={{ marginTop: 'var(--space-5)' }}>Die SCHMIDT GmbH fokussiert sich seit mehr als 50 Jahren auf die Entwicklung und Produktion von Hebeschiebetüren. Zeitgemäßes Design, höchster Komfort, langlebige Funktionalität und zertifizierte Qualität – die QuinLine® Hebeschiebetür bietet individuelle Lösungen für Neubauten wie auch die Haussanierung. Die Basis für die ausgereifte Sicherheitstechnik, den hervorragenden Schall- und Wärmeschutz bis hin zur Passivhaustauglichkeit, liefert das unternehmenseigene, unabhängige SCHMIDT Profilsystem.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6) var(--space-5)', marginTop: 'var(--space-7)' }}>
              {ARGUMENTS.map(([icon, label]) => <FeatureIcon key={icon} name={icon} label={label} size={52} />)}
            </div>
          </div>
          <img src="../../assets/img/innenraum-blick.png" alt="Qualitätskontrolle einer QuinLine® 84" style={{ width: '100%', height: 560, objectFit: 'cover' }} />
        </div>
      </section>

      {/* Am Puls des Marktes */}
      <section style={{ background: 'var(--surface-subtle)' }}>
        <div className="wrap" style={{ padding: 'var(--section-y) var(--gutter)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
          <img src="../../assets/img/terrasse-hebeschiebetuer.png" alt="Besprechung bei der SCHMIDT GmbH" style={{ width: '100%', height: 420, objectFit: 'cover' }} />
          <div>
            <SectionHeading title="Am Puls des Marktes" />
            <p style={{ marginTop: 'var(--space-5)' }}>Zeiten ändern sich und so auch die Anforderungen in der Fensterbranche. Die SCHMIDT GmbH entwickelt seit 1950 Lösungen, die auf den Bedarf des Fensterherstellers abgestimmt sind. Seit 1976 fokussiert sich das Unternehmen auf Kunststoff-Hebeschiebetüren und setzt damit regelmäßig Meilensteine für den Markt.</p>
            <div style={{ display: 'flex', gap: 'var(--space-7)', margin: 'var(--space-6) 0' }}>
              <StatBlock value="1950" label="Gründung" />
              <StatBlock value="30.000" label="Hebeschiebetüren pro Jahr" />
              <StatBlock value="ca. 150" label="Mitarbeiter" />
            </div>
            <Button variant="outline" onClick={() => go('unternehmen')}>Über uns</Button>
          </div>
        </div>
      </section>

      {/* System QuinLine — blue field with frame */}
      <section className="wrap" style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <FrameBox surface="blue" frame="yellow" corner="bottom-right" inset={34} minHeight={440} contentStyle={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
            <div>
              <SectionHeading tone="on-blue" title="Das System QuinLine®" intro="Das 5-Kammer-Profilsystem QuinLine® ist ein eigenständiges System, das einzig für die Konstruktion der QuinLine® 74 und der QuinLine® 84 eingesetzt wird. Die Sortimentsbreite und -tiefe ist einzigartig für Kunststoff-Hebeschiebetüren." />
              <div style={{ display: 'flex', gap: 'var(--space-7)', marginTop: 'var(--space-7)' }}>
                <FeatureIcon name="barrierefrei" label="Barrierefrei" tone="on-blue" size={46} />
                <FeatureIcon name="sicherheit" label="Geprüfte Sicherheit" tone="on-blue" size={46} />
                <FeatureIcon name="zusatzausstattung" label="Individualisierbar" tone="on-blue" size={46} />
                <FeatureIcon name="breite" label="Bis zu 7 m Breite" tone="on-blue" size={46} />
              </div>
              <div style={{ marginTop: 'var(--space-7)' }}>
                <Button variant="outline" onBlue onClick={() => go('produkte')}>Produkte</Button>
              </div>
            </div>
            <img src="../../assets/img/innenraum-blick.png" alt="QuinLine® Profilsystem" style={{ width: '100%', height: 340, objectFit: 'cover' }} />
          </div>
        </FrameBox>
      </section>

      {/* News */}
      <section className="wrap" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
        <SectionHeading title="Neues von Schmidt" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginTop: 'var(--space-7)' }}>
          {NEWS.map(([title, text, img]) => <NewsCard key={title} image={img} title={title} text={text} href="#" cta="Weiterlesen" />)}
        </div>
        <div style={{ marginTop: 'var(--space-6)' }}><Button variant="quiet">Alle News</Button></div>
      </section>
    </main>
  );
}
window.Home = Home;
