// Bautiefe: construction depth of sash (Flügel) and frame (Zarge), drawn as
// technical depth bars to ONE common scale, so lengths compare across both
// columns. The extra depth of QuinLine® 84 over QuinLine® 74 is the yellow
// part of each 84 bar.
//
// Beats (local frames, 15 = one beat):
//   15  Flügel: dimension lines, bars and counters snap out
//   30  Flügel: +10 mm fills yellow, chip
//   45  Zarge: dimension lines, bars and counters snap out
//   60  Zarge: +24 mm fills yellow, chip
//   ~80 everything in place, hold (slow drift)
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Chip,
  DimLine,
  GRID,
  RiseText,
  SceneBg,
  clamp,
  colX,
  fmt,
} from "../kit";

type System = 74 | 84;

type Row = {
  label: string;
  /** y of the value line (top of the row) */
  top: number;
  /** local frame: lines and bars start */
  grow: number;
  /** local frame: yellow difference arrives */
  delta: number;
  depth: Record<System, number>;
  view: Record<System, number>;
};

const ROWS: Row[] = [
  {
    label: "Flügel",
    top: 350,
    grow: 15,
    delta: 30,
    depth: { 74: 74, 84: 84 },
    view: { 74: 88, 84: 95 },
  },
  {
    label: "Zarge",
    top: 670,
    grow: 45,
    delta: 60,
    depth: { 74: 174, 84: 198 },
    view: { 74: 63, 84: 63 },
  },
];

/** Common scale for every bar: 198 mm ≙ 560 px. */
const SCALE = 560 / 198;
/** Bars start at the same x relative to each column (column left + 80). */
const X_OFF = 80;
const GROW = 18;

const DIM_Y = 100;
const BAR_Y = 130;
const BAR_H = 72;
const OUTLINE = 3;
const CAPTION_Y = 226;
const LABEL_Y = BAR_Y + BAR_H / 2;

const startX = (system: System) => colX(system) - GRID.colWidth / 2 + X_OFF;

const DepthRow: React.FC<{ system: System; row: Row }> = ({ system, row }) => {
  const frame = useCurrentFrame();
  const depth = row.depth[system];
  const x0 = startX(system);
  const len = depth * SCALE;

  const dim = interpolate(frame, [row.grow, row.grow + GROW], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const bar = interpolate(frame, [row.grow + 2, row.grow + GROW + 2], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const valueIn = interpolate(frame, [row.grow - 3, row.grow + 9], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const caption = interpolate(frame, [row.delta + 3, row.delta + 19], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });

  // QuinLine® 84 only: the depth beyond the 74 value turns yellow.
  const isPlus = system === 84;
  const plusMm = row.depth[84] - row.depth[74];
  const fill = interpolate(frame, [row.delta, row.delta + 10], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const chip = interpolate(frame, [row.delta + 1, row.delta + 13], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const mark = interpolate(frame, [row.delta, row.delta + 12], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const ref74 = row.depth[74] * SCALE;

  return (
    <>
      {/* Value: counts with the dimension line, so the number always reads its length */}
      <div
        style={{
          position: "absolute",
          left: x0,
          top: row.top,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <RiseText progress={valueIn} style={{ paddingBottom: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 66,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.01em",
              }}
            >
              {fmt(depth * dim)}
            </span>
            <span style={{ fontSize: 40, fontWeight: 500 }}>mm</span>
          </div>
        </RiseText>
        {isPlus && chip > 0 ? (
          <Chip
            progress={chip}
            style={{ translate: `${(1 - chip) * -16}px 0` }}
          >
            +{fmt(plusMm)} mm
          </Chip>
        ) : null}
      </div>

      <DimLine x={x0} y={row.top + DIM_Y} length={len} progress={dim} />

      {/* Depth bar */}
      {bar > 0 ? (
        <div
          style={{
            position: "absolute",
            left: x0,
            top: row.top + BAR_Y,
            width: Math.max(len * bar, OUTLINE * 2),
            height: BAR_H,
            boxSizing: "border-box",
            border: `${OUTLINE}px solid ${colors.white}`,
            backgroundColor: colors.blue90,
            overflow: "hidden",
          }}
        >
          {isPlus ? (
            <div
              style={{
                position: "absolute",
                left: ref74 - OUTLINE,
                top: 0,
                bottom: 0,
                width: (len - ref74 - OUTLINE) * fill,
                backgroundColor: colors.yellow,
              }}
            />
          ) : null}
        </div>
      ) : null}

      {/* Where QuinLine® 74 would end: short reference mark through the bar */}
      {isPlus && mark > 0 ? (
        <div
          style={{
            position: "absolute",
            left: x0 + ref74 - 1,
            top: row.top + BAR_Y - 14,
            width: 3,
            height: BAR_H + 28,
            backgroundColor: colors.white,
            scale: `1 ${mark}`,
          }}
        />
      ) : null}

      {/* Caption: visible face width of the profile */}
      <RiseText
        progress={caption}
        style={{
          position: "absolute",
          left: x0,
          top: row.top + CAPTION_Y,
          whiteSpace: "nowrap",
          lineHeight: 1.15,
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 400, color: colors.blue20 }}>
          Profilansicht{" "}
        </span>
        <span style={{ fontSize: 30, fontWeight: 500 }}>
          {fmt(row.view[system])} mm
        </span>
      </RiseText>
    </>
  );
};

/** Row label centred on the mullion, between the two columns. */
const RowLabel: React.FC<{ row: Row; delay: number }> = ({ row, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <RiseText
      progress={p}
      style={{
        position: "absolute",
        left: GRID.center - 100,
        width: 200,
        top: row.top + LABEL_Y - 22,
        textAlign: "center",
        paddingBottom: 0,
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.15 }}>
        {row.label}
      </div>
    </RiseText>
  );
};

/** Mullion on x=960, drawn top → bottom, interrupted around the row labels. */
const Mullion: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 34], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const reach = GRID.top + (GRID.bottom - GRID.top) * p;
  const GAP = 40;
  const cuts = ROWS.map((r) => r.top + LABEL_Y);
  const segments: [number, number][] = [
    [GRID.top, cuts[0] - GAP],
    [cuts[0] + GAP, cuts[1] - GAP],
    [cuts[1] + GAP, GRID.bottom],
  ];
  return (
    <>
      {segments.map(([a, b]) => {
        const h = Math.min(Math.max(reach - a, 0), b - a);
        return h > 0 ? (
          <div
            key={a}
            style={{
              position: "absolute",
              left: GRID.center - 1,
              top: a,
              width: 2,
              height: h,
              backgroundColor: colors.blue70,
            }}
          />
        ) : null;
      })}
    </>
  );
};

export const BautiefeScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow drift keeps the held drawing alive.
  const drift = interpolate(frame, [30, 120], [0, -8], {
    ...clamp,
    easing: ease.loop,
  });

  return (
    <SceneBg>
      <CategoryLabel icon="breite" title="Bautiefe" />
      <div
        style={{ position: "absolute", inset: 0, translate: `0 ${drift}px` }}
      >
        <Mullion />
        <RowLabel row={ROWS[0]} delay={8} />
        <RowLabel row={ROWS[1]} delay={38} />
        {ROWS.map((row) => (
          <div key={row.label}>
            <DepthRow system={74} row={row} />
            <DepthRow system={84} row={row} />
          </div>
        ))}
      </div>
    </SceneBg>
  );
};
