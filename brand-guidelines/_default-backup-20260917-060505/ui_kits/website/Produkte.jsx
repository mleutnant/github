const { SectionHeading, BulletList, FeatureIcon, Button, Rule, FrameBox } = window.SCHMIDTDesignSystem_b5cc27;

const SCHWELLEN = [
  ['Standardschwelle', '174 mm', '198 mm', 'silber / schwarz eloxiert'],
  ['Niedrigschwelle', '174 mm', '198 mm', 'silber eloxiert'],
  ['Renovierungsschwelle', '140/174 mm', '—', 'nur QuinLine® 74'],
  ['Standardschwelle mit Außenanschlag', '174 mm', '198 mm', 'silber eloxiert'],
  ['Niedrigschwelle mit Außenanschlag', '174 mm', '198 mm', 'silber eloxiert']
];

function Produkte({ go }) {
  const [system, setSystem] = React.useState('74');
  const data = {
    '74': { tiefe: '74 mm', zarge: '174 mm', uf: 'Uf = 1,5 W/(m²K)', glas: 'bis 46 mm Dicke', hoehe: 'bis zu 2,50 m' },
    '84': { tiefe: '84 mm', zarge: '198 mm', uf: 'Uf = 1,3 W/(m²K)', glas: 'bis 56 mm Dicke', hoehe: 'Weiß bis 2,80 m · Farbe bis 2,70 m' }
  }[system];
  return (
    <main>
      <section className="wrap" style={{ padding: 'var(--space-8) var(--gutter) 0' }}>
        <SectionHeading eyebrow="Produkte" title={'System QuinLine® ' + system} intro="Zwei Bautiefen, eine Basis. Technisch bis ins kleinste Detail durchdacht, bietet das Profilsystem vielseitige Möglichkeiten in der Bestandssanierung wie im Neubau." />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <Button variant={system === '74' ? 'primary' : 'outline'} onClick={() => setSystem('74')}>QuinLine® 74</Button>
          <Button variant={system === '84' ? 'primary' : 'outline'} onClick={() => setSystem('84')}>QuinLine® 84</Button>
        </div>
      </section>

      <section className="wrap" style={{ padding: 'var(--space-8) var(--gutter)', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <h3>Funktion</h3>
          <Rule color="red" width="72px" style={{ margin: 'var(--space-3) 0 var(--space-5)' }} />
          <BulletList items={[
            'Flügelbautiefe ' + data.tiefe,
            'Zargenbautiefe ' + data.zarge,
            'Rahmen Wärmedurchgangskoeffizient ' + data.uf,
            'Aufnahmekapazität für Isoliergläser ' + data.glas,
            'Höhe ' + data.hoehe,
            'Breite bis 7 m'
          ]} />
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
            <FeatureIcon name="thermostat" label="Wärmedämmung" size={46} />
            <FeatureIcon name="sicherheit" label="RC 1 N bis RC 3" size={46} />
            <FeatureIcon name="nullschwelle" label="Niedrigschwelle 4,5 mm" size={46} />
            <FeatureIcon name="leichtlaeufig" label="Leichtläufig" size={46} />
          </div>
        </div>
        <img src="../../assets/img/terrasse-hebeschiebetuer.png" alt={'QuinLine® ' + system} style={{ width: '100%', height: 420, objectFit: 'cover' }} />
      </section>

      <section style={{ background: 'var(--surface-subtle)' }}>
        <div className="wrap" style={{ padding: 'var(--section-y) var(--gutter)' }}>
          <SectionHeading title="Die Welt der Schwellen" intro="Allein die Schwellenvarianten erstrecken sich über die Standardschwelle und die Renovierungsschwelle bis hin zur barrierefreien Niedrigschwelle." />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--space-7)', fontSize: 'var(--fs-side)' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 'var(--fs-caption)' }}>
                <th style={{ padding: '10px 12px' }}>Schwelle</th><th style={{ padding: '10px 12px' }}>Bautiefe QL 74</th><th style={{ padding: '10px 12px' }}>Bautiefe QL 84</th><th style={{ padding: '10px 12px' }}>Ausführung</th>
              </tr>
            </thead>
            <tbody>
              {SCHWELLEN.map(r => (
                <tr key={r[0]} style={{ borderTop: '1px solid var(--sch-grey-30)' }}>
                  {r.map((c, i) => <td key={i} style={{ padding: '12px', fontWeight: i === 0 ? 'var(--fw-bold)' : 'var(--fw-regular)', color: i === 0 ? 'var(--text-heading)' : 'var(--text-primary)' }}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>Das Schwellen-Abdeckprofil 0° ist bei allen Schwellen, bis auf die schwarze Schwelle, nachrüstbar.</p>
        </div>
      </section>

      <section className="wrap" style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <FrameBox surface="blue" frame="red" corner="bottom-left" inset={30} minHeight={260} contentStyle={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-7)', alignItems: 'center' }}>
            <SectionHeading tone="on-blue" level={3} title="Schritt für Schritt zur perfekten Hebeschiebetür" intro="Größen, Typen, Schwellen, Optik und Design, Wärmedämmung, Einbruchschutz, Sonderausstattung, elektrischer Antrieb eVOMATIC®." />
            <Button variant="outline" onBlue onClick={() => go('kontakt')}>Beratung anfragen</Button>
          </div>
        </FrameBox>
      </section>
    </main>
  );
}
window.Produkte = Produkte;
