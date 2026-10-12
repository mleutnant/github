// Schwellen — "versus" table of the seven threshold types.
// Rows cascade in (label rises, markers snap under the 74 / 84 column
// headers), then the two thresholds only QuinLine® 74 offers get the yellow
// accent while the other rows step back.
import type React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Chip,
  GRID,
  QuinLine,
  RiseText,
  SceneBg,
  clamp,
} from "../kit";

type Row = { name: string; q74: boolean; q84: boolean };

// Data verbatim from the SCHMIDT "Systemunterschiede" table.
const ROWS: Row[] = [
  { name: "Standard-Alu-Bodenschwelle", q74: true, q84: true },
  { name: "Standard-Alu-Bodenschwelle in schwarz", q74: true, q84: false },
  { name: "Niedrigschwelle", q74: true, q84: true },
  { name: "Renovierungsschwelle", q74: true, q84: false },
  { name: "Standardschwelle mit Außenanschlag", q74: true, q84: true },
  { name: "Niedrigschwelle mit Außenanschlag", q74: true, q84: true },
  { name: "Schwellen-Abdeckprofil 0°", q74: true, q84: true },
];

// Layout
const TABLE_TOP = 322;
const PITCH = 84;
const LINE_X0 = 380;
const LINE_X1 = 1540;
const MARK = 28;
const LABEL_SIZE = 32;
const LEGEND_Y = 962;

// Timing (local frames). Beat = 15 frames.
const ROW_START = 10; // first label starts rising
const ROW_STAGGER = 5; // triplet feel: markers land on 15, 20 … 45
const MARK_DELAY = 4; // marker snaps a few frames after its label
const LINE_START = 6;
const LEGEND_START = 48;
const HL_START = 60; // difference beat
const CHIP_START = 71; // chips land on beat 75

const rowY = (i: number) => TABLE_TOP + PITCH * (i + 0.5);
const isOnly74 = (r: Row) => r.q74 && !r.q84;

const Hairline: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const start = LINE_START + ROW_STAGGER * index;
  const p = interpolate(frame, [start, start + 20], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const half = ((LINE_X1 - LINE_X0) / 2) * p;
  return (
    <div
      style={{
        position: "absolute",
        left: GRID.center - half,
        width: half * 2,
        top: TABLE_TOP + PITCH * index,
        height: 1,
        backgroundColor: colors.blue70,
      }}
    />
  );
};

const Marker: React.FC<{
  x: number;
  y: number;
  available: boolean;
  progress: number;
  fill: string;
}> = ({ x, y, available, progress, fill }) => (
  <div
    style={{
      position: "absolute",
      left: x - MARK / 2,
      top: y - MARK / 2,
      width: MARK,
      height: MARK,
      boxSizing: "border-box",
      backgroundColor: available ? fill : "transparent",
      border: available ? "none" : `2px solid ${colors.blue70}`,
      scale: String(progress),
    }}
  />
);

const TableRow: React.FC<{ row: Row; index: number }> = ({ row, index }) => {
  const frame = useCurrentFrame();
  const start = ROW_START + ROW_STAGGER * index;
  const y = rowY(index);
  const only74 = isOnly74(row);

  const labelIn = interpolate(frame, [start, start + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const markIn = interpolate(
    frame,
    [start + MARK_DELAY, start + MARK_DELAY + 12],
    [0, 1],
    { ...clamp, easing: ease.snap },
  );
  // Difference beat: highlighted rows turn yellow, the others step back.
  const hl = interpolate(frame, [HL_START, HL_START + 8], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const dim = interpolate(frame, [HL_START, HL_START + 12], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const labelColor = only74
    ? colors.white
    : interpolateColors(dim, [0, 1], [colors.white, colors.blue20]);
  const fill74 = only74
    ? interpolateColors(hl, [0, 1], [colors.white, colors.yellow])
    : interpolateColors(dim, [0, 1], [colors.white, colors.blue20]);
  const fill84 = interpolateColors(dim, [0, 1], [colors.white, colors.blue20]);

  const barIn = interpolate(frame, [HL_START, HL_START + 10], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const chipStart = CHIP_START + (index === 1 ? 0 : 2);
  const chipIn = interpolate(frame, [chipStart, chipStart + 14], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const chipSettle = interpolate(frame, [chipStart, chipStart + 30], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });

  return (
    <>
      {/* Label, centred on the mullion axis */}
      <div
        style={{
          position: "absolute",
          left: GRID.center - 360,
          width: 720,
          top: y - 28,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          {only74 ? (
            <div
              style={{
                position: "absolute",
                left: -26,
                top: 4,
                bottom: 6,
                width: 6,
                backgroundColor: colors.yellow,
                scale: `1 ${barIn}`,
                transformOrigin: "50% 100%",
              }}
            />
          ) : null}
          <RiseText
            progress={labelIn}
            style={{
              fontSize: LABEL_SIZE,
              fontWeight: 500,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              color: labelColor,
            }}
          >
            {row.name}
          </RiseText>
        </div>
      </div>

      <Marker
        x={GRID.col74}
        y={y}
        available={row.q74}
        progress={markIn}
        fill={fill74}
      />
      <Marker
        x={GRID.col84}
        y={y}
        available={row.q84}
        progress={markIn}
        fill={fill84}
      />

      {only74 ? (
        <div
          style={{
            position: "absolute",
            right: 1920 - (GRID.col74 - MARK / 2 - 22),
            top: y - 23,
            translate: `${(1 - chipSettle) * 24}px 0`,
          }}
        >
          {/* Wipes open from the marker side (right) towards the left. */}
          <Chip
            style={{ clipPath: `inset(0 0 0 ${(1 - chipIn) * 100}%)` }}
          >
            nur <QuinLine n={74} />
          </Chip>
        </div>
      ) : null}
    </>
  );
};

const LegendItem: React.FC<{ filled: boolean; label: string }> = ({
  filled,
  label,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{
        width: 22,
        height: 22,
        boxSizing: "border-box",
        backgroundColor: filled ? colors.white : "transparent",
        border: filled ? "none" : `2px solid ${colors.blue70}`,
      }}
    />
    <div
      style={{
        fontSize: 28,
        fontWeight: 400,
        lineHeight: 1.3,
        color: colors.blue20,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  </div>
);

const Legend: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [LEGEND_START, LEGEND_START + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: GRID.center - 500,
        width: 1000,
        top: LEGEND_Y - 22,
        height: 44,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 64,
        opacity: p,
        translate: `0 ${(1 - p) * 16}px`,
      }}
    >
      <LegendItem filled label="verfügbar" />
      <LegendItem filled={false} label="nicht verfügbar" />
    </div>
  );
};

export const SchwellenScene: React.FC = () => (
  <SceneBg>
    <CategoryLabel icon="barrierefrei" title="Schwellen" />
    {Array.from({ length: ROWS.length + 1 }, (_, k) => (
      <Hairline key={`line-${k}`} index={k} />
    ))}
    {ROWS.map((row, i) => (
      <TableRow key={row.name} row={row} index={i} />
    ))}
    <Legend />
  </SceneBg>
);
