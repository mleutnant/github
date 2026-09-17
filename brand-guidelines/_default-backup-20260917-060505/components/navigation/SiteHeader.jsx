import React from 'react';
import { Logo } from '../core/Logo.jsx';

export function SiteHeader({ items = [], active, onNavigate, login = 'Kunden-Login', languages = ['DE', 'EN', 'FR'], language = 'DE', onLanguage, sticky = true, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  return (
    <header style={{ position: sticky ? 'sticky' : 'static', top: 0, zIndex: 20, background: 'var(--surface-page)', borderBottom: '1px solid var(--sch-grey-10)', ...style }} {...rest}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', height: 84, display: 'flex', alignItems: 'center', gap: 'var(--space-7)' }}>
        <a href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate(items[0] && items[0].id); }} style={{ display: 'flex', alignItems: 'center' }}>
          <Logo height={30} />
        </a>
        <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {items.map(item => {
            const on = active === item.id;
            const hot = hover === item.id;
            return (
              <a key={item.id} href={item.href || '#'}
                onClick={e => { if (onNavigate) { e.preventDefault(); onNavigate(item.id); } }}
                onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}
                style={{ position: 'relative', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: on || hot ? 'var(--sch-red)' : 'var(--sch-blue)', textDecoration: 'none', paddingBottom: 4 }}>
                {item.label}
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -2, height: 'var(--rule-body)', background: on ? 'var(--sch-red)' : 'transparent' }} />
              </a>
            );
          })}
          <div style={{ display: 'flex', gap: 'var(--space-3)', paddingLeft: 'var(--space-5)', borderLeft: '1px solid var(--sch-grey-10)' }}>
            {languages.map(l => (
              <button key={l} onClick={() => onLanguage && onLanguage(l)}
                style={{ border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-core)', fontSize: 'var(--fs-eyebrow)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', color: l === language ? 'var(--sch-blue)' : 'var(--sch-grey-60)' }}>{l}</button>
            ))}
          </div>
          <a href="#" style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: 'var(--sch-white)', background: 'var(--sch-blue)', padding: '10px 18px', textDecoration: 'none' }}>{login}</a>
        </nav>
      </div>
    </header>
  );
}
