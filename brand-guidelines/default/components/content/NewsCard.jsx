import React from 'react';

export function NewsCard({ image, kicker, title, text, href, cta = 'Weiterlesen', style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'block', background: 'var(--surface-page)', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: 'var(--radius)', boxShadow: hover ? 'var(--shadow-raised)' : 'var(--shadow-card)', transition: 'box-shadow var(--dur) var(--ease)', ...style }} {...rest}>
      {image ? (
        <div style={{ overflow: 'hidden' }}>
          <img src={image} alt="" style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', transform: hover ? 'scale(1.03)' : 'none', transition: 'transform var(--dur-slow) var(--ease)' }} />
        </div>
      ) : null}
      <div style={{ padding: 'var(--space-5)' }}>
        {kicker ? <div style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--sch-red)', marginBottom: 'var(--space-2)' }}>{kicker}</div> : null}
        <h3 style={{ fontSize: 'var(--fs-h4)', marginBottom: 'var(--space-3)' }}>{title}</h3>
        {text ? <p style={{ fontSize: 'var(--fs-side)', lineHeight: 'var(--lh-side)', margin: 0, color: 'var(--text-primary)' }}>{text}</p> : null}
        <span style={{ display: 'inline-block', marginTop: 'var(--space-4)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-caption)', color: hover ? 'var(--sch-red-hover)' : 'var(--sch-red)' }}>{cta}</span>
      </div>
    </a>
  );
}
