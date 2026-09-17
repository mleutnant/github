import React from 'react';
const fieldBase = {
  fontFamily: 'var(--font-core)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)', background: 'var(--surface-page)',
  border: '1px solid var(--sch-blue)', borderRadius: 'var(--radius)',
  padding: '12px 14px', width: '100%', lineHeight: 1.3,
  transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)'
};

export function Input({ label, id, type = 'text', hint, error, required = false, value, onChange, placeholder, disabled, style, ...rest }) {
  const fid = id || 'in-' + (label || type).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? <label htmlFor={fid} style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: 'var(--text-heading)' }}>{label}{required ? ' *' : ''}</label> : null}
      <input id={fid} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} required={required}
        style={{ ...fieldBase, borderColor: error ? 'var(--sch-red)' : 'var(--sch-blue)', opacity: disabled ? .5 : 1 }} {...rest} />
      {error ? <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--sch-red)' }}>{error}</span>
        : hint ? <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>{hint}</span> : null}
    </div>
  );
}
