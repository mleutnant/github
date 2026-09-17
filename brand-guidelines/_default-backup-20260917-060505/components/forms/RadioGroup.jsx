import React from 'react';

export function RadioGroup({ legend, name, options = [], value, onChange, inline = false, style, ...rest }) {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0, ...style }} {...rest}>
      {legend ? <legend style={{ padding: 0, marginBottom: 'var(--space-3)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: 'var(--text-heading)' }}>{legend}</legend> : null}
      <div style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? 'var(--space-6)' : 'var(--space-3)' }}>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lab = typeof o === 'string' ? o : o.label;
          const on = value === val;
          return (
            <label key={val} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" name={name} value={val} checked={on} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
              <span aria-hidden="true" style={{ flex: '0 0 auto', width: 20, height: 20, border: '2px solid var(--sch-blue)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                {on ? <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--sch-red)' }} /> : null}
              </span>
              <span style={{ fontSize: 'var(--fs-body)' }}>{lab}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
