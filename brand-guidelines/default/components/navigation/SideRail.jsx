import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SideRail({ onContact, onTop, contactLabel = 'Kontakt', topLabel = 'Zum Seitenanfang', style, ...rest }) {
  const btn = {
    width: 52, height: 52, display: 'grid', placeItems: 'center', border: 0, cursor: 'pointer',
    background: 'var(--sch-yellow)', borderRadius: 'var(--radius)', transition: 'background var(--dur-fast) var(--ease)'
  };
  return (
    <div style={{ position: 'absolute', right: 0, top: '30%', display: 'flex', flexDirection: 'column', gap: 2, zIndex: 15, ...style }} {...rest}>
      <button aria-label={contactLabel} title={contactLabel} onClick={onContact}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--sch-yellow-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--sch-yellow)'} style={btn}>
        <Icon name="chat" size={26} tone="ink" />
      </button>
      <button aria-label={topLabel} title={topLabel} onClick={onTop}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--sch-yellow-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--sch-yellow)'} style={btn}>
        <span aria-hidden="true" style={{ width: 16, height: 16, borderTop: '3px solid var(--sch-black)', borderRight: '3px solid var(--sch-black)', transform: 'rotate(-45deg)', marginBottom: 4 }} />
      </button>
    </div>
  );
}
