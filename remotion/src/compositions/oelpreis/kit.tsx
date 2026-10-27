// Shared building blocks for the Ölpreis / Hormus headline wall.
// Generic helpers come from the QuinLine® kit; this file adds the props schema
// and the brand rules every scene of this film uses.
import type React from "react";
import { z } from "zod";
import { colors } from "../../brand/tokens";

export { RiseText, SceneBg, clamp, fmt, useProgress } from "../quinline/kit";

export const oelpreisSchema = z.object({
  /** Headline 1 — the price. */
  brentHeadline: z.string(),
  /** Value shown by the counter (US-Dollar je Barrel Brent). */
  brentValue: z.number(),
  /** Headline 2 — the cause. */
  hormusHeadline: z.string(),
  /** Date line, e.g. "Stand: 27. Oktober 2026". */
  stand: z.string(),
});

export type OelpreisProps = z.infer<typeof oelpreisSchema>;

export const OELPREIS_DEFAULTS: OelpreisProps = {
  brentHeadline: "Brent über 110 Dollar",
  brentValue: 110,
  hormusHeadline: "Ölpreis steigt – Straße von Hormus im Fokus",
  stand: "Stand: 27. Oktober 2026",
};

/**
 * Sets a headline as two deliberate lines after its dash
 * ("A – B" → ["A –", "B"]); without a dash it stays on one line.
 */
export const breakAfterDash = (text: string): string[] => {
  const m = text.match(/^(.+?\s[–—-])\s+(.+)$/);
  return m ? [m[1], m[2]] : [text];
};

/** Type scale for 1920×1080 (Filson Pro: Bold titles 1.15, Medium body 1.5, Regular side 1.3). */
export const TYPE = {
  display: 132,
  title: 96,
  subtitle: 56,
  body: 40,
  side: 30,
} as const;

/** Brand rule weights: 4 px under a title, 8 px frame / yellow foot rule. */
export const RULE = { title: 4, frame: 8 } as const;

/**
 * Red Unterlinie under a title. Grows left → right with `progress`.
 * Place it inside the title's container (it is a block element).
 */
export const TitleRule: React.FC<{
  progress: number;
  width: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ progress, width, color = colors.red, weight = RULE.title, style }) => (
  <div
    style={{
      width: width * progress,
      height: weight,
      backgroundColor: color,
      ...style,
    }}
  />
);

/**
 * 8 px yellow rule along the foot of a blue field (brand rule). Absolutely
 * positioned at the bottom edge of its parent; grows left → right.
 */
export const YellowFoot: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      height: RULE.frame,
      width: `${progress * 100}%`,
      backgroundColor: colors.yellow,
    }}
  />
);

/**
 * Open brand frame (Prinzip "Rahmen und Fläche"): a rectangle drawn as one
 * stroke that starts and ends at a gap in its top edge, like the Bildmarke.
 * `progress` 0 → 1 draws it. Coordinates are the frame's outer edges in the
 * parent's pixel space; the SVG covers the parent (position absolute, inset 0).
 */
export const OpenFrame: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  progress: number;
  /** Where the gap sits on the top edge, 0 = left corner, 1 = right corner. */
  gapAt?: number;
  gap?: number;
  stroke?: number;
  color?: string;
}> = ({
  left,
  top,
  width,
  height,
  progress,
  gapAt = 0.72,
  gap = 34,
  stroke = 10,
  color = colors.red,
}) => {
  const h = stroke / 2;
  const x0 = left + h;
  const y0 = top + h;
  const x1 = left + width - h;
  const y1 = top + height - h;
  const gx = x0 + (x1 - x0) * gapAt;
  // Start right of the gap, run clockwise round the frame, stop left of the gap.
  const pts: Array<[number, number]> = [
    [gx + gap / 2, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
    [x0, y0],
    [gx - gap / 2, y0],
  ];
  const length = pts.reduce(
    (sum, [x, y], i) =>
      i === 0 ? 0 : sum + Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]),
    0,
  );
  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
      width="100%"
      height="100%"
    >
      <polyline
        points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
      />
    </svg>
  );
};
