const { SectionHeading, NewsCard, PullQuote, ImageOverlay, BulletList, Button } = window.SCHMIDTDesignSystem_b5cc27;

const REFS = [
  ['Sauerland Lodge', 'Sechs Design-Ferienhäuser in Niedersfeld, je mit einer QuinLine® 74 zum Südhang hin geöffnet.', '../../assets/img/hero-ausblick.png'],
  ['Weingut Bachmann', 'Stäfa am Zürichsee: drei QuinLine® 84 öffnen den Blick über die Weinberge auf den See.', '../../assets/img/terrasse-hebeschiebetuer.png'],
  ['Wohnglück zu Hermanns Füßen', 'Ein 1939 erbautes Haus in Detmold-Hiddesen, saniert mit zwei QuinLine® Hebeschiebetüren.', '../../assets/img/innenraum-blick.png']
];

function Referenzen({ go }) {
  return (
    <main>
      <section className="wrap" style={{ padding: 'var(--space-8) var(--gutter) 0' }}>
        <SectionHeading eyebrow="Referenzen" title="Blicke hinaus und hinein" intro="Im Gespräch mit den jeweiligen Hausherren haben wir nach dem Warum für eine Hebeschiebetür gefragt. Die Antworten waren klar formuliert." />
      </section>
      <section className="wrap" style={{ padding: 'var(--space-8) var(--gutter)' }}>
        <ImageOverlay base="../../assets/img/hero-ausblick.png" overlay="../../assets/img/innenraum-blick.png" ratio="21 / 9" />
      </section>
      <section className="wrap" style={{ padding: '0 var(--gutter) var(--section-y)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
        {REFS.map(([t, x, img]) => <NewsCard key={t} image={img} kicker="Referenzstory" title={t} text={x} href="#" cta="Projekt ansehen" />)}
      </section>
      <section style={{ background: 'var(--surface-inverse)' }}>
        <div className="wrap" style={{ padding: 'var(--section-y) var(--gutter)', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
          <PullQuote tone="on-blue" size="lg" quote="Der Blick wird durch die Hebeschiebetür eingerahmt. Man braucht sozusagen keinen Fernseher mehr." author="Fabian Alberti" role="Architekt, Sauerland Lodge" />
          <div>
            <BulletList tone="on-blue" items={['QuinLine® 74, Anzahl: 6', 'Öffnungsart: 2-teilig; Typ 1 und Typ 2', 'Größe: 4.975 × 2.495 mm (B × H)', 'Elementfarbe: Schwarz Ulti-Matt']} />
            <div style={{ marginTop: 'var(--space-6)' }}><Button variant="outline" onBlue onClick={() => go('kontakt')}>Kontakt aufnehmen</Button></div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.Referenzen = Referenzen;
