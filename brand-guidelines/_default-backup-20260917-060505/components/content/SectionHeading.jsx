import React from 'react';
import { Rule } from '../core/Rule.jsx';

export function SectionHeading({ eyebrow, title, intro, level = 2, rule = 'red', ruleWidth = '96px', tone = 'ink', align = 'left', style, ...rest }) {
  const H = 'h' + level;
  const onBlue = tone === 'on-blue';
  return (
    <header style={{ textAlign: align, ...style }} {...rest}>
      {eyebrow ? (
        <div style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: onBlue ? 'var(--sch-yellow)' : 'var(--sch-red)', marginBottom: 'var(--space-3)' }}>{eyebrow}</div>
      ) : null}
      {React.createElement(H, { style: { color: onBlue ? 'var(--text-on-blue)' : 'var(--text-heading)', margin: 0, maxWidth: '22ch' } }, title)}
      {rule ? <Rule color={onBlue && rule === 'red' ? 'yellow' : rule} width={ruleWidth} style={{ marginTop: 'var(--space-4)', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }} /> : null}
      {intro ? (
        <p style={{ marginTop: 'var(--space-5)', marginBottom: 0, maxWidth: '62ch', color: onBlue ? 'rgba(255,255,255,.92)' : 'var(--text-primary)', fontSize: 'var(--fs-body-lg)' }}>{intro}</p>
      ) : null}
    </header>
  );
}
