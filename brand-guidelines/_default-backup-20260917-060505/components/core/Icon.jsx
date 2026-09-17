import React from 'react';
import { iconUrl } from './assets.js';

const TONE = { ink: 'var(--icon-ink)', white: 'var(--icon-on-blue)', red: 'var(--icon-web-accent)', blue: 'var(--sch-blue)' };

export function Icon({ name, size = 48, tone = 'ink', title, style, ...rest }) {
  const url = iconUrl(name);
  const px = typeof size === 'number' ? size + 'px' : size;
  return (
    <span
      role="img"
      aria-label={title || name}
      title={title}
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        backgroundColor: TONE[tone] || tone,
        WebkitMaskImage: `url("${url}")`,
        maskImage: `url("${url}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        flex: '0 0 auto',
        ...style
      }}
      {...rest}
    />
  );
}
