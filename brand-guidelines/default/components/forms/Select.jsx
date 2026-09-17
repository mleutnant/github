import React from 'react';
const fieldBase = {
  fontFamily: 'var(--font-core)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)', background: 'var(--surface-page)',
  border: '1px solid var(--sch-blue)', borderRadius: 'var(--radius)',
  padding: '12px 14px', width: '100%', lineHeight: 1.3,
  transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)'
};

export function Select({ label, id, options = [], value, onChange, hint, required = false, disabled, style, ...rest }) {
  const fid = id || 'sel-' + (label || 'field').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? <label htmlFor={fid} style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: 'var(--text-heading)' }}>{label}{required ? ' *' : ''}</label> : null}
      <select id={fid} value={value} onChange={onChange} disabled={disabled} required={required}
        style={{ ...fieldBase, appearance: 'none', paddingRight: '40px', opacity: disabled ? .5 : 1,
          backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--sch-blue) 50%), linear-gradient(135deg, var(--sch-blue) 50%, transparent 50%)',
          backgroundPosition: 'calc(100% - 20px) calc(50% + 2px), calc(100% - 14px) calc(50% + 2px)',
          backgroundSize: '6px 6px, 6px 6px', backgroundRepeat: 'no-repeat' }} {...rest}>
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint ? <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>{hint}</span> : null}
    </div>
  );
}
