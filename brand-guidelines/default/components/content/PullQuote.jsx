import React from 'react';

export function PullQuote({ quote, author, role, tone = 'ink', size = 'md', style, ...rest }) {
  const onBlue = tone === 'on-blue';
  const fs = size === 'lg' ? 'var(--fs-h1)' : size === 'sm' ? 'var(--fs-h3)' : 'var(--fs-h2)';
  return (
    <figure style={{ margin: 0, ...style }} {...rest}>
      <blockquote style={{ margin: 0, fontSize: fs, fontWeight: 'var(--fw-bold)', lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-title)', color: onBlue ? 'var(--text-on-blue)' : 'var(--text-heading)', hyphens: 'auto' }}>
        {'\u201E'}{quote}{'\u201C'}
      </blockquote>
      {(author || role) ? (
        <figcaption style={{ marginTop: 'var(--space-4)', fontSize: 'var(--fs-side)', lineHeight: 'var(--lh-side)', color: onBlue ? 'rgba(255,255,255,.9)' : 'var(--text-muted)' }}>
          {author ? <span style={{ fontWeight: 'var(--fw-medium)', color: onBlue ? 'var(--sch-white)' : 'var(--text-primary)' }}>{author}</span> : null}
          {role ? <span style={{ display: 'block' }}>{role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
