import React from 'react';

const COLORS = { red: 'var(--frame-red)', yellow: 'var(--frame-yellow)', blue: 'var(--frame-blue)', white: 'var(--sch-white)', ink: 'var(--sch-black)' };

export function Rule({ color = 'red', weight = 'title', width = '100%', orientation = 'horizontal', length, style, ...rest }) {
  const w = weight === 'title' ? 'var(--rule-title)' : weight === 'body' ? 'var(--rule-body)' : (typeof weight === 'number' ? weight + 'px' : weight);
  const horizontal = orientation === 'horizontal';
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        background: COLORS[color] || color,
        width: horizontal ? width : w,
        height: horizontal ? w : (length || '100%'),
        ...style
      }}
      {...rest}
    />
  );
}
