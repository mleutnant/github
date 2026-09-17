import React from 'react';

export function BulletList({ items = [], level = 1, tone = 'ink', columns = 1, style, ...rest }) {
  const color = tone === 'on-blue' ? 'var(--text-on-blue)' : 'var(--text-primary)';
  const marker = tone === 'on-blue' ? 'var(--sch-white)' : 'var(--sch-black)';
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, color, columns: columns > 1 ? columns : 'auto', columnGap: 'var(--space-7)', ...style }} {...rest}>
      {items.map((item, i) => (
        <li key={i} style={{ position: 'relative', paddingLeft: level === 1 ? 'var(--space-4)' : 'var(--space-5)', marginBottom: 'var(--space-3)', breakInside: 'avoid', fontSize: level === 1 ? 'var(--fs-body)' : 'var(--fs-side)' }}>
          <span aria-hidden="true" style={level === 1
            ? { position: 'absolute', left: 0, top: '0.28em', width: 'var(--rule-body)', height: '1.05em', background: marker }
            : { position: 'absolute', left: 'var(--space-2)', top: '0.5em', width: 'var(--bullet-square)', height: 'var(--bullet-square)', background: marker }} />
          {item}
        </li>
      ))}
    </ul>
  );
}
