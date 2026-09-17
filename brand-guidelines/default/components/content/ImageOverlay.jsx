import React from 'react';

/** Prinzip 2: two images overlaid with "negativ multiplizieren" (screen), in analogy to panes of glass. */
export function ImageOverlay({ base, overlay, ratio = '16 / 9', offset = '18%', blend = 'screen', style, ...rest }) {
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', background: 'var(--sch-blue)', ...style }} {...rest}>
      <img src={base} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img src={overlay} alt="" style={{ position: 'absolute', top: 0, bottom: 0, left: offset, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: blend, opacity: 0.95 }} />
    </div>
  );
}
