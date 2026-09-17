import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function FeatureIcon({ name, label, size = 56, tone = 'ink', align = 'left', style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 'var(--space-3)', textAlign: align, ...style }} {...rest}>
      <Icon name={name} size={size} tone={tone === 'on-blue' ? 'white' : tone} />
      <div style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', lineHeight: 'var(--lh-caption)', color: tone === 'on-blue' ? 'var(--text-on-blue)' : 'var(--text-primary)', maxWidth: '16ch' }}>{label}</div>
    </div>
  );
}
