import React from 'react';

const SURFACES = { blue: 'var(--surface-inverse)', white: 'var(--surface-page)', subtle: 'var(--surface-subtle)', none: 'transparent' };
const FRAMES = { red: 'var(--frame-red)', yellow: 'var(--frame-yellow)', blue: 'var(--frame-blue)' };

/** Prinzip 1: a surface overlaid by a frame; at the crossing point a gap appears. */
export function FrameBox({ children, surface = 'blue', frame = 'yellow', corner = 'bottom-right', inset = 28, weight, image, minHeight = 260, style, contentStyle, ...rest }) {
  const w = weight || 'var(--frame-weight)';
  const vertical = corner.includes('right') ? { right: 0 } : { left: 0 };
  const horizontal = corner.includes('bottom') ? { bottom: 0 } : { top: 0 };
  const px = typeof inset === 'number' ? inset + 'px' : inset;
  return (
    <div style={{ position: 'relative', ...style }} {...rest}>
      <div
        style={{
          background: image ? `center/cover no-repeat url("${image}")` : SURFACES[surface] || surface,
          color: surface === 'blue' ? 'var(--text-on-blue)' : 'var(--text-primary)',
          minHeight: typeof minHeight === 'number' ? minHeight + 'px' : minHeight,
          marginRight: corner.includes('right') ? px : 0,
          marginLeft: corner.includes('left') ? px : 0,
          marginBottom: corner.includes('bottom') ? px : 0,
          marginTop: corner.includes('top') ? px : 0,
          padding: 'var(--space-6)',
          ...contentStyle
        }}
      >
        {children}
      </div>
      <span aria-hidden="true" style={{ position: 'absolute', ...vertical, ...horizontal, width: `calc(50% + ${px})`, height: w, background: FRAMES[frame] || frame }} />
      <span aria-hidden="true" style={{ position: 'absolute', ...vertical, ...horizontal, width: w, height: `calc(55% + ${px})`, background: FRAMES[frame] || frame }} />
    </div>
  );
}
