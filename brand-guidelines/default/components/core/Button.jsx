import React from 'react';

const SIZES = {
  sm: { padding: '8px 16px', fontSize: 'var(--fs-caption)' },
  md: { padding: '12px 24px', fontSize: 'var(--fs-body)' },
  lg: { padding: '16px 32px', fontSize: 'var(--fs-body-lg)' }
};

const VARIANTS = {
  primary: { background: 'var(--surface-brand)', color: 'var(--text-on-red)', border: '2px solid var(--surface-brand)' },
  secondary: { background: 'var(--surface-inverse)', color: 'var(--text-on-blue)', border: '2px solid var(--surface-inverse)' },
  outline: { background: 'transparent', color: 'var(--sch-blue)', border: '2px solid var(--sch-blue)' },
  quiet: { background: 'transparent', color: 'var(--sch-red)', border: '2px solid transparent', padding: '4px 0' }
};

const HOVER = {
  primary: { background: 'var(--sch-red-hover)', borderColor: 'var(--sch-red-hover)' },
  secondary: { background: 'var(--sch-blue-90)', borderColor: 'var(--sch-blue-90)' },
  outline: { background: 'var(--sch-blue)', color: 'var(--text-on-blue)' },
  quiet: { color: 'var(--sch-red-hover)' }
};

export function Button({ children, variant = 'primary', size = 'md', disabled = false, onBlue = false, as = 'button', href, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const Tag = href ? 'a' : as;
  const base = VARIANTS[variant] || VARIANTS.primary;
  const onBlueFix = onBlue && variant === 'outline' ? { color: 'var(--text-on-blue)', borderColor: 'var(--sch-white)' } : null;
  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
        fontFamily: 'var(--font-core)', fontWeight: 'var(--fw-bold)', lineHeight: 1.15,
        borderRadius: 'var(--radius)', cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none', letterSpacing: '0',
        transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
        ...SIZES[size], ...base, ...onBlueFix,
        ...(hover && !disabled ? (onBlue && variant === 'outline' ? { background: 'var(--sch-white)', color: 'var(--sch-blue)' } : HOVER[variant]) : null),
        transform: down && !disabled ? 'translateY(1px)' : 'none',
        opacity: disabled ? 0.4 : 1,
        ...style
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
