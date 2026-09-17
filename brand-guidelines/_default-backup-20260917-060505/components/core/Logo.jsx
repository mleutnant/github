import React from 'react';
import { assetBase } from './assets.js';

const FILTER = {
  positive: 'none',
  negative: 'brightness(0) invert(1)',
  mono: 'brightness(0)'
};

export function Logo({ variant = 'wordmark', theme = 'positive', height = 32, alt = 'SCHMIDT — Die Hebeschiebetür', clearspace = false, style, ...rest }) {
  const file = variant === 'mark' ? 'bildmarke.png' : 'logo-schmidt.png';
  return (
    <img
      src={`${assetBase()}/${file}`}
      alt={alt}
      style={{
        height: typeof height === 'number' ? height + 'px' : height,
        width: 'auto',
        filter: FILTER[theme] || 'none',
        padding: clearspace ? `calc(${typeof height === 'number' ? height + 'px' : height} * 0.34)` : 0,
        ...style
      }}
      {...rest}
    />
  );
}
