import React from 'react';

export function StatBlock({ value, label, tone = 'ink', style, ...rest }) {
  const onBlue = tone === 'on-blue';
  return (
    <div style={{ ...style }} {...rest}>
      <div style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-title)', color: onBlue ? 'var(--sch-white)' : 'var(--text-heading)' }}>{value}</div>
      <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--fs-side)', fontWeight: 'var(--fw-regular)', lineHeight: 'var(--lh-side)', color: onBlue ? 'rgba(255,255,255,.9)' : 'var(--text-muted)', maxWidth: '18ch' }}>{label}</div>
    </div>
  );
}
