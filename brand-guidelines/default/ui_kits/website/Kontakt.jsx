const { SectionHeading, Input, Select, Checkbox, RadioGroup, Button, BulletList, Rule } = window.SCHMIDTDesignSystem_b5cc27;

function Kontakt() {
  const [sent, setSent] = React.useState(false);
  const [format, setFormat] = React.useState('gedruckt');
  const [agree, setAgree] = React.useState(false);
  return (
    <main className="wrap" style={{ padding: 'var(--space-8) var(--gutter) var(--section-y)' }}>
      <SectionHeading eyebrow="Kontakt" title="Sie haben Fragen zur QuinLine® Hebeschiebetür?" intro="Sprechen Sie uns gerne an — oder bestellen Sie weitere Exemplare unserer Produktbroschüre." />
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-9)', marginTop: 'var(--space-8)', alignItems: 'start' }}>
        {sent ? (
          <div style={{ background: 'var(--surface-inverse)', color: 'var(--text-on-blue)', padding: 'var(--space-7)' }}>
            <h3 style={{ color: 'var(--text-on-blue)' }}>Vielen Dank für Ihre Anfrage.</h3>
            <Rule color="yellow" width="80px" style={{ margin: 'var(--space-4) 0' }} />
            <p style={{ margin: 0 }}>Unser Verkaufsinnendienst meldet sich innerhalb eines Werktags bei Ihnen.</p>
            <div style={{ marginTop: 'var(--space-6)' }}><Button variant="outline" onBlue onClick={() => setSent(false)}>Neue Anfrage</Button></div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
            <Input label="Firma" required />
            <Input label="Vor- und Nachname" required />
            <Input label="Straße" />
            <Input label="PLZ / Ort" />
            <Input label="E-Mail-Adresse" type="email" required />
            <Input label="Telefon" type="tel" />
            <Select label="Ich bin" options={['Fensterhersteller / Monteur', 'Planer / Architekt', 'Privater Bauherr']} style={{ gridColumn: 'span 2' }} />
            <RadioGroup name="format" legend="Produktbroschüre „Heben. Schieben. Öffnen.“" inline value={format} onChange={e => setFormat(e.target.value)} options={['gedruckt', 'PDF-Datei']} style={{ gridColumn: 'span 2' }} />
            <Checkbox style={{ gridColumn: 'span 2' }} label="Ich habe die Datenschutzerklärung gelesen." checked={agree} onChange={e => setAgree(e.target.checked)} />
            <div style={{ gridColumn: 'span 2' }}><Button disabled={!agree}>Anfrage senden</Button></div>
          </form>
        )}
        <aside style={{ borderLeft: '1px solid var(--sch-grey-10)', paddingLeft: 'var(--space-7)', fontSize: 'var(--fs-side)', lineHeight: 'var(--lh-body)' }}>
          <h4>SCHMIDT GmbH</h4>
          <p style={{ marginTop: 'var(--space-3)' }}>Töllen Linde 3<br />33129 Delbrück-Boke<br />Deutschland</p>
          <p style={{ margin: 0 }}>Telefon <a href="tel:+49525098450">+49 5250 9845-0</a><br />Telefax +49 5250 9845-50<br /><a href="mailto:kontakt@schmidt-boke.de">kontakt@schmidt-boke.de</a></p>
          <Rule color="red" width="60px" style={{ margin: 'var(--space-6) 0' }} />
          <BulletList level={1} items={['Verkaufsinnendienst Boke', 'Zuständiger Verkaufsleiter', 'Kunden-Login für Lagertüren']} />
        </aside>
      </div>
    </main>
  );
}
window.Kontakt = Kontakt;
