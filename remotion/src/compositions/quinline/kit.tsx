// Shared building blocks for the QuinLine® comparison scenes.
// Every scene uses the same grid so the persistent column headers
// (Overlay.tsx) always sit above the right content.
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  type EasingFunction,
} from "remotion";
import { colors, ease, fontFamily } from "../../brand/tokens";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Grid (1920×1080). Left column = QuinLine® 74, right column = QuinLine® 84. */
export const GRID = {
  col74: 540,
  col84: 1380,
  colWidth: 720,
  center: 960,
  /** Content area below the header row */
  top: 310,
  bottom: 980,
  /** Header row: column stacks + category label */
  headerTop: 140,
} as const;

export const colX = (system: 74 | 84) =>
  system === 74 ? GRID.col74 : GRID.col84;

/** 0 → 1 between two local frames. Defaults to the brand reveal easing. */
export const useProgress = (
  start: number,
  end: number,
  easing: EasingFunction = ease.reveal,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, end], [0, 1], { ...clamp, easing });
};

/** German number format: 2,50 / 0,82 / 7 */
export const fmt = (value: number, decimals = 0) =>
  value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Flat blue scene background. Every scene starts with this so the pane covers the previous one. */
export const SceneBg: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{ backgroundColor: colors.blue, fontFamily, color: colors.white }}
  >
    {children}
  </AbsoluteFill>
);

/** "QuinLine®" with the registered mark set as a small superscript. */
export const QuinLine: React.FC<{ n?: 74 | 84 }> = ({ n }) => (
  <span style={{ whiteSpace: "nowrap" }}>
    QuinLine
    <span style={{ fontSize: "0.5em", verticalAlign: "0.85em" }}>®</span>
    {n ? ` ${n}` : null}
  </span>
);

export type IconName =
  | "groesse"
  | "breite"
  | "thermostat"
  | "tablet-handy"
  | "renovierung"
  | "barrierefrei"
  | "komfort"
  | "sonderausstattung"
  | "sonnenschutz";

/** Brand icon (public/brand/icons), tinted via CSS mask. White on blue only. */
export const Icon: React.FC<{
  name: IconName;
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, size, color = colors.white, style }) => {
  const url = `url(${staticFile(`brand/icons/${name}.svg`)})`;
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        ...style,
      }}
    />
  );
};

/**
 * Category label in the header row, centred between the two column headers:
 * icon on top, title below. Animates in on its own (local frames delay … delay+18).
 */
export const CategoryLabel: React.FC<{
  icon: IconName;
  title: string;
  delay?: number;
}> = ({ icon, title, delay = 6 }) => {
  const frame = useCurrentFrame();
  const iconIn = interpolate(frame, [delay, delay + 16], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const textIn = interpolate(frame, [delay + 3, delay + 19], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: GRID.center - 320,
        width: 640,
        top: GRID.headerTop,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Icon
        name={icon}
        size={64}
        style={{
          opacity: iconIn,
          translate: `0 ${(1 - iconIn) * 24}px`,
        }}
      />
      <div style={{ overflow: "hidden", paddingBottom: 6 }}>
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            translate: `0 ${(1 - textIn) * 64}px`,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

/** Central mullion between the two columns, drawn top → bottom. */
export const Divider: React.FC<{
  delay?: number;
  top?: number;
  bottom?: number;
}> = ({ delay = 4, top = GRID.top, bottom = GRID.bottom }) => {
  const p = useProgress(delay, delay + 22, ease.reveal);
  return (
    <div
      style={{
        position: "absolute",
        left: GRID.center - 1,
        top,
        width: 2,
        height: (bottom - top) * p,
        backgroundColor: colors.blue70,
      }}
    />
  );
};

/**
 * Absolutely positioned box for one column's content. Its origin (0,0) is the
 * column's top-left corner at y = GRID.top; it is GRID.colWidth wide.
 */
export const Column: React.FC<{
  system: 74 | 84;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ system, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: colX(system) - GRID.colWidth / 2,
      top: GRID.top,
      width: GRID.colWidth,
      height: GRID.bottom - GRID.top,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Technical dimension line with end ticks. `progress` draws it from the start
 * point. Horizontal lines grow left → right, vertical ones bottom → top.
 */
export const DimLine: React.FC<{
  x: number;
  y: number;
  length: number;
  vertical?: boolean;
  progress: number;
  color?: string;
  weight?: number;
  tick?: number;
}> = ({
  x,
  y,
  length,
  vertical = false,
  progress,
  color = colors.white,
  weight = 3,
  tick = 26,
}) => {
  const drawn = length * progress;
  const tickStyle = (along: number): React.CSSProperties =>
    vertical
      ? {
          position: "absolute",
          left: x - tick / 2,
          top: y - along - weight / 2,
          width: tick,
          height: weight,
          backgroundColor: color,
        }
      : {
          position: "absolute",
          left: x + along - weight / 2,
          top: y - tick / 2,
          width: weight,
          height: tick,
          backgroundColor: color,
        };
  return (
    <>
      <div
        style={
          vertical
            ? {
                position: "absolute",
                left: x - weight / 2,
                top: y - drawn,
                width: weight,
                height: drawn,
                backgroundColor: color,
              }
            : {
                position: "absolute",
                left: x,
                top: y - weight / 2,
                width: drawn,
                height: weight,
                backgroundColor: color,
              }
        }
      />
      {progress > 0 ? <div style={tickStyle(0)} /> : null}
      {progress > 0.98 ? <div style={tickStyle(length)} /> : null}
    </>
  );
};

/** Small flat yellow chip with blue type — e.g. "+10 mm", "nur QuinLine® 74". */
export const Chip: React.FC<{
  children: React.ReactNode;
  progress?: number;
  style?: React.CSSProperties;
}> = ({ children, progress = 1, style }) => (
  <div
    style={{
      display: "inline-block",
      backgroundColor: colors.yellow,
      color: colors.blue,
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1,
      padding: "10px 16px 8px",
      whiteSpace: "nowrap",
      clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Text that slides up out of a mask. */
export const RiseText: React.FC<{
  progress: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  distance?: number;
}> = ({ progress, children, style, distance = 1.1 }) => (
  <div style={{ overflow: "hidden", paddingBottom: "0.12em", ...style }}>
    <div style={{ translate: `0 ${(1 - progress) * distance * 100}%` }}>
      {children}
    </div>
  </div>
);
