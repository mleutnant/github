// Größe: QuinLine® 74 bis 2,50 m hoch, QuinLine® 84 bis 2,70 m / 2,80 m hoch,
// beide bis 7 m breit. Each column shows a two-part lift-and-slide door as a
// schematic front elevation. Heights are drawn to one common scale
// (2,80 m ≙ 400 px), widths are schematic (same drawn width). The doors grow
// up from the floor line while the height dimension lines grow beside them
// and the values count up; the extra height of the 84 door is marked in
// yellow; then the width dimension lines snap across under both doors.
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  DimLine,
  Divider,
  GRID,
  RiseText,
  SceneBg,
  clamp,
  colX,
} from "../kit";

// ---------------------------------------------------------------------------
// Geometry (absolute px)
// ---------------------------------------------------------------------------
const PX_PER_M = 400 / 2.8;
const HEIGHT_M = { 74: 2.5, 84: 2.8 } as const;
const DOOR_H = {
  74: Math.round(HEIGHT_M[74] * PX_PER_M),
  84: Math.round(HEIGHT_M[84] * PX_PER_M),
} as const;
const DOOR_W = 380;
const FRAME = 6;
const PROFILE = 10;
const FLOOR_Y = 836;
/** Top edge of the 74 door = the level the yellow line carries across. */
const LEVEL_74 = FLOOR_Y - DOOR_H[74];
const TOP_84 = FLOOR_Y - DOOR_H[84];

/** Height dimension line sits on the outer side of each door. */
const HEIGHT_DIM_GAP = 40;
const WIDTH_DIM_Y = FLOOR_Y + 32;
const EXT_OVERSHOOT = 13;

// Text rows
const HEIGHT_ROW_TOP = 314;
const WIDTH_ROW_TOP = 890;
const ROW_H = 84;

// ---------------------------------------------------------------------------
// Beats (local frames, one beat = 15)
// ---------------------------------------------------------------------------
const FLOOR_IN = 6;
const GROW_FROM = 15;
const GROW_TO = 45; // heights land
const LEVEL_FROM = 45; // yellow difference
const WIDTH_FROM = 60; // width lines snap
const WIDTH_LAND = 75; // width values land
const HOLD_FROM = 84;
const SCENE_END = 120;

const doorLeft = (system: 74 | 84) => colX(system) - DOOR_W / 2;
const doorRight = (system: 74 | 84) => colX(system) + DOOR_W / 2;
/** Outer side: left for 74, right for 84 — the columns mirror each other. */
const heightDimX = (system: 74 | 84) =>
  system === 74
    ? doorLeft(74) - HEIGHT_DIM_GAP
    : doorRight(84) + HEIGHT_DIM_GAP;

// ---------------------------------------------------------------------------
// Door elevation
// ---------------------------------------------------------------------------

/** Lift-slide arrow drawn into the sliding sash (technical-drawing hint). */
const SlideArrow: React.FC = () => (
  <svg
    width={84}
    height={28}
    viewBox="0 0 84 28"
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      translate: "-50% -50%",
      overflow: "visible",
    }}
  >
    <path
      d="M82 14 H4 M16 3 L4 14 L16 25"
      fill="none"
      stroke={colors.blue20}
      strokeWidth={3}
      strokeLinecap="butt"
      strokeLinejoin="round"
    />
  </svg>
);

const Sash: React.FC<{
  left: number;
  width: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ left, width, children, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 0,
      bottom: 0,
      width,
      boxSizing: "border-box",
      border: `${PROFILE}px solid ${colors.black}`,
      backgroundColor: colors.blue90,
      ...style,
    }}
  >
    {children}
  </div>
);

const Door: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  // Sill draws out sideways as the pane lands, then the door grows upward.
  const sill = interpolate(frame, [FLOOR_IN + 2, GROW_FROM + 4], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const grow = interpolate(frame, [GROW_FROM, GROW_TO], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // Hold: the sliding sash glides open a touch — lift-and-slide, alive.
  const slide = interpolate(frame, [HOLD_FROM, SCENE_END], [0, -26], {
    ...clamp,
    easing: ease.loop,
  });

  const minH = FRAME * 2;
  const h = minH + (DOOR_H[system] - minH) * grow;
  const inner = DOOR_W - FRAME * 2;
  const half = inner / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: doorLeft(system),
        top: FLOOR_Y - h,
        width: DOOR_W,
        height: h,
        boxSizing: "border-box",
        border: `${FRAME}px solid ${colors.white}`,
        backgroundColor: colors.blue90,
        overflow: "hidden",
        scale: `${sill} 1`,
        opacity: sill > 0 ? 1 : 0,
      }}
    >
      {/* Fixed sash (left) */}
      <Sash left={0} width={half} />
      {/* Sliding sash (right), runs in front of the fixed one */}
      <Sash left={half} width={half} style={{ translate: `${slide}px 0` }}>
        <SlideArrow />
        {/* Lift-slide lever handle on the sash stile */}
        <div
          style={{
            position: "absolute",
            right: -(PROFILE / 2 + 4),
            top: "44%",
            width: 8,
            height: "16%",
            backgroundColor: colors.white,
          }}
        />
      </Sash>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const HLine: React.FC<{
  x: number;
  y: number;
  width: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ x, y, width, color = colors.blue70, weight = 2, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - weight / 2,
      width,
      height: weight,
      backgroundColor: color,
      ...style,
    }}
  />
);

const VLine: React.FC<{
  x: number;
  y: number;
  height: number;
  color?: string;
  weight?: number;
}> = ({ x, y, height, color = colors.blue70, weight = 2 }) => (
  <div
    style={{
      position: "absolute",
      left: x - weight / 2,
      top: y,
      width: weight,
      height,
      backgroundColor: color,
    }}
  />
);

/** Floor line under each door, drawn out from the door centre. */
const Floor: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [FLOOR_IN, FLOOR_IN + 18], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const x0 = Math.min(heightDimX(system), doorLeft(system)) - 30;
  const x1 = Math.max(heightDimX(system), doorRight(system)) + 30;
  return (
    <HLine x={x0} y={FLOOR_Y + 1} width={x1 - x0} style={{ scale: `${p} 1` }} />
  );
};

/** Vertical height dimension on the outer side, growing with the door. */
const HeightDim: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [GROW_FROM, GROW_TO], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const x = heightDimX(system);
  const h = DOOR_H[system] * grow;
  const top = FLOOR_Y - h;
  // Extension line from the door's top edge out past the dimension line.
  const extX0 = system === 74 ? x - EXT_OVERSHOOT : doorRight(84) + 6;
  const extX1 = system === 74 ? doorLeft(74) - 6 : x + EXT_OVERSHOOT;
  return (
    <>
      {grow > 0 ? <HLine x={extX0} y={top + 1} width={extX1 - extX0} /> : null}
      <DimLine
        x={x}
        y={FLOOR_Y}
        length={DOOR_H[system]}
        vertical
        progress={grow}
      />
    </>
  );
};

/** Width dimension under the door: extension lines drop, then the line snaps across. */
const WidthDim: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const ext = interpolate(frame, [WIDTH_FROM - 3, WIDTH_FROM + 5], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const dim = interpolate(frame, [WIDTH_FROM, WIDTH_FROM + 12], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const extTop = FLOOR_Y + 8;
  const extH = (WIDTH_DIM_Y + EXT_OVERSHOOT - extTop) * ext;
  return (
    <>
      <VLine x={doorLeft(system) + 1} y={extTop} height={extH} />
      <VLine x={doorRight(system) - 1} y={extTop} height={extH} />
      <DimLine
        x={doorLeft(system)}
        y={WIDTH_DIM_Y}
        length={DOOR_W}
        progress={dim}
      />
    </>
  );
};

/**
 * The story of this scene: the 74 door's height is carried across as a yellow
 * level line; it passes behind the 84 door, whose extra height above that
 * level is traced in yellow, and is dimensioned in yellow on the outer side.
 */
const HeightDifference: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [LEVEL_FROM, LEVEL_FROM + 9], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const trace = interpolate(frame, [LEVEL_FROM + 3, LEVEL_FROM + 13], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const outer = interpolate(frame, [LEVEL_FROM + 7, LEVEL_FROM + 14], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const x0 = doorRight(74) + 8;
  const x1 = doorLeft(84);
  const dimX = heightDimX(84);
  const bandH = LEVEL_74 - TOP_84 + 3;
  const half = FRAME / 2;
  return (
    <>
      {/* Level line: 74 door top → 84 door */}
      <HLine
        x={x0}
        y={LEVEL_74 + 1.5}
        width={(x1 - x0) * level}
        color={colors.yellow}
        weight={3}
      />
      {/* Extra height of the 84 door: its frame above the level turns yellow */}
      <svg
        width={DOOR_W}
        height={bandH}
        style={{
          position: "absolute",
          left: x1,
          top: TOP_84,
          overflow: "visible",
        }}
      >
        <path
          d={`M${half} ${bandH} V${half} H${DOOR_W - half} V${bandH}`}
          fill="none"
          stroke={colors.yellow}
          strokeWidth={FRAME}
          strokeLinejoin="miter"
          strokeLinecap="butt"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - trace}
        />
      </svg>
      {/* …the level re-emerges on the outer side and the difference is dimensioned */}
      <HLine
        x={doorRight(84) + 6}
        y={LEVEL_74 + 1.5}
        width={(dimX + EXT_OVERSHOOT - doorRight(84) - 6) * outer}
        color={colors.yellow}
        weight={3}
      />
      <DimLine
        x={dimX}
        y={LEVEL_74 + 1.5}
        length={LEVEL_74 - TOP_84 + 1.5}
        vertical
        progress={outer}
        color={colors.yellow}
        weight={6}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

const num = (value: number, decimals: number) =>
  value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Counter that keeps its final width, so the line never shifts while counting. */
const Count: React.FC<{ value: number; final: number; decimals: number }> = ({
  value,
  final,
  decimals,
}) => (
  <span style={{ position: "relative" }}>
    <span style={{ visibility: "hidden" }}>{num(final, decimals)}</span>
    <span style={{ position: "absolute", right: 0, top: 0 }}>
      {num(value, decimals)}
    </span>
  </span>
);

const BIS: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 500,
  color: colors.blue20,
};
const NUM: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.01em",
};
const UNIT: React.CSSProperties = { fontSize: 48, fontWeight: 700 };
const SLASH: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 500,
  color: colors.blue20,
  margin: "0 4px",
};

const ValueRow: React.FC<{
  system: 74 | 84;
  top: number;
  progress: number;
  children: React.ReactNode;
}> = ({ system, top, progress, children }) => (
  <div
    style={{
      position: "absolute",
      left: colX(system) - GRID.colWidth / 2,
      width: GRID.colWidth,
      top,
    }}
  >
    <RiseText progress={progress}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 12,
          height: ROW_H,
          lineHeight: `${ROW_H}px`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </RiseText>
  </div>
);

/** Floored so the last digit clicks in exactly on the landing beat. */
const useCount = (
  from: number,
  to: number,
  final: number,
  decimals: number,
) => {
  const frame = useCurrentFrame();
  const f = 10 ** decimals;
  return (
    Math.floor(
      interpolate(frame, [from, to], [0, final], {
        ...clamp,
        easing: ease.reveal,
      }) *
        f +
        1e-6,
    ) / f
  );
};

const HeightValues: React.FC = () => {
  const frame = useCurrentFrame();
  // Fast snap so the decimal comma is unmasked before the count gets going.
  const rise = interpolate(frame, [GROW_FROM - 1, GROW_FROM + 9], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const h74 = useCount(GROW_FROM, GROW_TO, 2.5, 2);
  const h84a = useCount(GROW_FROM, GROW_TO, 2.7, 2);
  const h84b = useCount(GROW_FROM, GROW_TO, 2.8, 2);
  return (
    <>
      <ValueRow system={74} top={HEIGHT_ROW_TOP} progress={rise}>
        <span style={BIS}>bis</span>
        <span style={NUM}>
          <Count value={h74} final={2.5} decimals={2} />
        </span>
        <span style={UNIT}>m</span>
      </ValueRow>
      <ValueRow system={84} top={HEIGHT_ROW_TOP} progress={rise}>
        <span style={BIS}>bis</span>
        <span style={NUM}>
          <Count value={h84a} final={2.7} decimals={2} />
        </span>
        <span style={UNIT}>m</span>
        <span style={SLASH}>/</span>
        <span style={NUM}>
          <Count value={h84b} final={2.8} decimals={2} />
        </span>
        <span style={UNIT}>m</span>
      </ValueRow>
    </>
  );
};

const WidthValues: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [WIDTH_FROM, WIDTH_FROM + 14], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const w = useCount(WIDTH_FROM, WIDTH_LAND, 7, 0);
  return (
    <>
      {([74, 84] as const).map((system) => (
        <ValueRow
          key={system}
          system={system}
          top={WIDTH_ROW_TOP}
          progress={rise}
        >
          <span style={BIS}>bis</span>
          <span style={NUM}>
            <Count value={w} final={7} decimals={0} />
          </span>
          <span style={UNIT}>m</span>
        </ValueRow>
      ))}
    </>
  );
};

/**
 * Row label on the centre axis ("Höhe" / "Breite"), between the two values of
 * its row — reads like a row of a comparison table.
 */
const RowLabel: React.FC<{ top: number; start: number; children: string }> = ({
  top,
  start,
  children,
}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [start + 2, start + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: GRID.center - 120,
        width: 240,
        top,
        textAlign: "center",
      }}
    >
      <RiseText progress={rise}>
        <div
          style={{
            height: ROW_H,
            lineHeight: `${ROW_H}px`,
            fontSize: 30,
            fontWeight: 500,
            color: colors.blue20,
          }}
        >
          {children}
        </div>
      </RiseText>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export const GroesseScene: React.FC = () => (
  <SceneBg>
    <CategoryLabel icon="groesse" title="Größe" />
    <Divider top={HEIGHT_ROW_TOP + ROW_H} bottom={WIDTH_ROW_TOP} />

    <Floor system={74} />
    <Floor system={84} />

    <HeightDim system={74} />
    <HeightDim system={84} />

    <Door system={74} />
    <Door system={84} />

    <WidthDim system={74} />
    <WidthDim system={84} />

    <HeightDifference />

    <RowLabel top={HEIGHT_ROW_TOP} start={GROW_FROM}>
      Höhe
    </RowLabel>
    <HeightValues />

    <RowLabel top={WIDTH_ROW_TOP} start={WIDTH_FROM - 2}>
      Breite
    </RowLabel>
    <WidthValues />
  </SceneBg>
);
