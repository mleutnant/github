const { SiteHeader, SiteFooter, SideRail } = window.SCHMIDTDesignSystem_b5cc27;

const NAV = [
  { id: 'home', label: 'Start' },
  { id: 'produkte', label: 'Produkte' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'unternehmen', label: 'Unternehmen' },
  { id: 'kontakt', label: 'Kontakt' }
];

function App() {
  const [page, setPage] = React.useState('home');
  const Screen = { home: window.Home, produkte: window.Produkte, referenzen: window.Referenzen, kontakt: window.Kontakt, unternehmen: window.Referenzen }[page] || window.Home;
  return (
    <div>
      <SiteHeader items={NAV} active={page} onNavigate={setPage} />
      <div style={{ position: 'relative' }}>
        <SideRail onContact={() => setPage('kontakt')} onTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <Screen go={setPage} />
      </div>
      <SiteFooter social={['Facebook', 'Instagram', 'LinkedIn']} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
