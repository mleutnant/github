// Verglasung: "Aufnahme von Funktionsgläsern" — QuinLine® 74 bis 46 mm,
// QuinLine® 84 bis 56 mm. Each column shows an insulating glass unit in
// cross-section, drawn to one common scale (6 px ≙ 1 mm). Three panes are
// lowered into place one after another (lift-and-slide: drop, hover, set
// down), the cavities seal, then a dimension line measures the unit and the
// value counts up. In the 84 column the extra 10 mm are marked in yellow.
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Chip,
  DimLine,
  Divider,
  GRID,
  RiseText,
  SceneBg,
  clamp,
  colX,
} from "../kit";

/** Common drawing scale: pixels per millimetre. */
const SCALE = 6;
const MM = { 74: 46, 84: 56 } as const;
const EXTRA_MM = MM[84] - MM[74];

// Vertical layout (absolute px)
const MASK_TOP = 318; // panes are lowered in through this edge
const UNIT_TOP = 352;
const UNIT_H = 344;
const UNIT_BOTTOM = UNIT_TOP + UNIT_H;
const EXT_TOP = UNIT_BOTTOM + 12; // extension lines start below the glass
const DIM_Y = 750;
const EXT_BOTTOM = DIM_Y + 18;
const VALUE_TOP = 784;
const CAPTION_TOP = 912;
const DIVIDER_BOTTOM = 880;

// Glass unit details
const PANE_W = 12;
const SPACER_H = 24;
const SEAL_H = 8; // black edge seal outside the spacer

// Beats (local frames): panes land on 15, 22, 30; value lands on 45.
const PANE_LAND = [15, 22, 30] as const;
const MEASURE = 30;
const VALUE_LAND = 45;
const EXTRA_IN = 44;
const HOLD = 56;

/** Pane drop: fast descent to just above its seat, then set down on the beat. */
const usePaneOffset = (land: number) => {
  const frame = useCurrentFrame();
  const hover = 14;
  const fullDrop = UNIT_TOP - MASK_TOP + UNIT_H + 6;
  const descend = interpolate(frame, [land - 11, land - 4], [-fullDrop, -hover], {
    ...clamp,
    easing: ease.reveal,
  });
  const setDown = interpolate(frame, [land - 4, land], [0, hover], {
    ...clamp,
    easing: ease.move,
  });
  return descend + setDown;
};

const Pane: React.FC<{ left: number; land: number }> = ({ left, land }) => {
  const y = usePaneOffset(land);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: UNIT_TOP - MASK_TOP,
        width: PANE_W,
        height: UNIT_H,
        backgroundColor: colors.blue20,
        translate: `0 ${y}px`,
      }}
    />
  );
};

/** Gas cavity between two panes with its edge spacers; seals left → right. */
const Cavity: React.FC<{ left: number; width: number; start: number }> = ({
  left,
  width,
  start,
}) => {
  const frame = useCurrentFrame();
  const seal = interpolate(frame, [start, start + 8], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const clip = `inset(0 ${(1 - seal) * 100}% 0 0)`;
  const block = (
    top: number,
    height: number,
    color: string,
  ): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top,
    width,
    height,
    backgroundColor: color,
  });
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: UNIT_TOP - MASK_TOP,
        width,
        height: UNIT_H,
        backgroundColor: colors.blue90,
        clipPath: clip,
      }}
    >
      <div style={block(0, SEAL_H, colors.black)} />
      <div style={block(SEAL_H, SPACER_H, colors.blue70)} />
      <div style={block(UNIT_H - SEAL_H - SPACER_H, SPACER_H, colors.blue70)} />
      <div style={block(UNIT_H - SEAL_H, SEAL_H, colors.black)} />
    </div>
  );
};

/** Insulating glass unit in cross-section, centred on its column. */
const GlassUnit: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const width = MM[system] * SCALE;
  const x0 = colX(system) - width / 2;
  const mid = x0 + width / 2 - PANE_W / 2;
  const right = x0 + width - PANE_W;
  // Held: the whole unit floats up a hair.
  const float = interpolate(frame, [HOLD, 90], [0, -3], {
    ...clamp,
    easing: ease.loop,
  });
  return (
    <div style={{ position: "absolute", inset: 0, translate: `0 ${float}px` }}>
      <Cavity
        left={x0 + PANE_W}
        width={mid - x0 - PANE_W}
        start={PANE_LAND[1]}
      />
      <Cavity
        left={mid + PANE_W}
        width={right - mid - PANE_W}
        start={PANE_LAND[2]}
      />
      <Pane left={x0} land={PANE_LAND[0]} />
      <Pane left={mid} land={PANE_LAND[1]} />
      <Pane left={right} land={PANE_LAND[2]} />
    </div>
  );
};

/** Thin vertical extension line from the glass face down past the dimension line. */
const ExtLine: React.FC<{
  x: number;
  progress: number;
  color?: string;
}> = ({ x, progress, color = colors.blue20 }) => (
  <div
    style={{
      position: "absolute",
      left: x - 1,
      top: EXT_TOP,
      width: 2,
      height: (EXT_BOTTOM - EXT_TOP) * progress,
      backgroundColor: color,
    }}
  />
);

/** Dimension line under the unit, the counted value and (84) the yellow extra. */
const Measure: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const mm = MM[system];
  const width = mm * SCALE;
  const x0 = colX(system) - width / 2;

  const ext = interpolate(frame, [MEASURE - 2, MEASURE + 6], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const dim = interpolate(frame, [MEASURE, VALUE_LAND], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const valueIn = interpolate(frame, [MEASURE - 2, MEASURE + 10], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // Floor so the final digit clicks in exactly on the beat.
  const count = Math.floor(
    interpolate(frame, [MEASURE - 2, VALUE_LAND], [0, mm], {
      ...clamp,
      easing: ease.reveal,
    }),
  );

  // 84 only: the extra 10 mm beyond the 46 mm of the 74 unit.
  const extraX = x0 + MM[74] * SCALE;
  const extraExt = interpolate(frame, [EXTRA_IN - 2, EXTRA_IN + 4], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const extraDim = interpolate(frame, [EXTRA_IN, EXTRA_IN + 8], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const chip = interpolate(frame, [EXTRA_IN + 2, EXTRA_IN + 10], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });

  return (
    <>
      <ExtLine x={x0 + 1} progress={ext} />
      <ExtLine x={x0 + width - 1} progress={ext} />
      <DimLine x={x0} y={DIM_Y} length={width} progress={dim} />

      {system === 84 ? (
        <>
          <ExtLine x={extraX} progress={extraExt} color={colors.yellow} />
          <DimLine
            x={extraX}
            y={DIM_Y}
            length={EXTRA_MM * SCALE}
            progress={extraDim}
            color={colors.yellow}
            weight={6}
          />
          <div
            style={{
              position: "absolute",
              left: x0 + width + 24,
              top: DIM_Y - 23,
              translate: `${(1 - chip) * -12}px 0`,
            }}
          >
            <Chip progress={chip}>+{EXTRA_MM} mm</Chip>
          </div>
        </>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: colX(system) - GRID.colWidth / 2,
          width: GRID.colWidth,
          top: VALUE_TOP,
        }}
      >
        <RiseText progress={valueIn}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 16,
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 500, color: colors.blue20 }}>
              bis
            </span>
            <span
              style={{
                position: "relative",
                fontSize: 92,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.01em",
              }}
            >
              {/* Reserve the final width so the line never shifts while counting */}
              <span style={{ visibility: "hidden" }}>{mm}</span>
              <span style={{ position: "absolute", right: 0, top: 0 }}>
                {count}
              </span>
            </span>
            <span style={{ fontSize: 56, fontWeight: 700 }}>mm</span>
          </div>
        </RiseText>
      </div>
    </>
  );
};

export const GlasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = interpolate(frame, [10, 28], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });

  return (
    <SceneBg>
      <CategoryLabel icon="sonnenschutz" title="Verglasung" />
      <Divider bottom={DIVIDER_BOTTOM} />

      {/* Panes are lowered in through the top edge of this mask */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: MASK_TOP,
          width: "100%",
          height: UNIT_BOTTOM + 12 - MASK_TOP,
          overflow: "hidden",
        }}
      >
        <GlassUnit system={74} />
        <GlassUnit system={84} />
      </div>

      <Measure system={74} />
      <Measure system={84} />

      <div
        style={{
          position: "absolute",
          left: GRID.center - 600,
          width: 1200,
          top: CAPTION_TOP,
          textAlign: "center",
        }}
      >
        <RiseText progress={caption}>
          <div style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.15 }}>
            Aufnahme von Funktionsgläsern
          </div>
        </RiseText>
      </div>
    </SceneBg>
  );
};
