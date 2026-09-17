import React from 'react';
import { Logo } from '../core/Logo.jsx';

export function SiteFooter({ address = ['SCHMIDT GmbH', 'Töllen Linde 3', '33129 Delbrück-Boke, Deutschland'], phone = '+49 5250 9845-0', email = 'kontakt@schmidt-boke.de', legal = ['Impressum', 'Datenschutz', 'AGB', 'Hinweisgebersystem'], social = [], style, ...rest }) {
  return (
    <footer style={{ background: 'var(--surface-inverse)', color: 'var(--text-on-blue)', ...style }} {...rest}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-8) var(--gutter)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-7)' }}>
        <div style={{ fontSize: 'var(--fs-side)', lineHeight: 'var(--lh-body)' }}>
          {address.map((l, i) => <div key={i} style={{ fontWeight: i === 0 ? 'var(--fw-bold)' : 'var(--fw-regular)' }}>{l}</div>)}
          <div style={{ marginTop: 'var(--space-3)' }}>Telefon <a href={'tel:' + phone.replace(/\s/g, '')} style={{ color: 'var(--sch-white)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{phone}</a></div>
          <div><a href={'mailto:' + email} style={{ color: 'var(--sch-white)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{email}</a></div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--fs-side)' }}>
          {legal.map(l => <a key={l} href="#" style={{ color: 'var(--sch-white)', textDecoration: 'none' }}>{l}</a>)}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'flex-start' }}>
          <Logo theme="negative" height={28} />
          {social.length ? (
            <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)' }}>
              {social.map(s => <a key={s} href="#" style={{ color: 'var(--sch-white)', textDecoration: 'none', borderBottom: '2px solid var(--sch-yellow)' }}>{s}</a>)}
            </div>
          ) : null}
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 'var(--frame-weight)', background: 'var(--sch-yellow)' }} />
    </footer>
  );
}
