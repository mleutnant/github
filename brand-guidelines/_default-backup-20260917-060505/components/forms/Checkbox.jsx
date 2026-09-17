import React from 'react';

export function Checkbox({ label, checked = false, onChange, disabled, id, style, ...rest }) {
  const fid = id || 'cb-' + String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <label htmlFor={fid} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <input id={fid} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span aria-hidden="true" style={{ flex: '0 0 auto', width: 20, height: 20, marginTop: 2, border: '2px solid var(--sch-blue)', background: checked ? 'var(--sch-blue)' : 'transparent', display: 'grid', placeItems: 'center' }}>
        {checked ? <span style={{ width: 8, height: 8, background: 'var(--sch-white)' }} /> : null}
      </span>
      <span style={{ fontSize: 'var(--fs-body)' }}>{label}</span>
    </label>
  );
}
