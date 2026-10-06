// Typen — QuinLine® 74: 2- bis 4-teilig | QuinLine® 84: 2- bis 4-teilig,
// Schema E entfällt bei 3-teilig.
// Per column three schematic front elevations (2-, 3-, 4-teilig) rise out of a
// floor line, then every door operates once: the sash lifts, slides open,
// slides back and locks on beat 45 while the range lands below. The 84 column
// then gets its one difference: a yellow-marked note plus a yellow underline
// under "3-teilig".
import type React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Column,
  Divider,
  GRID,
  RiseText,
  SceneBg,
  clamp,
} from "../kit";

// ---- Beat sheet (local frames, 120 BPM → beat every 15 frames) ----
const T = {
  floor: [3, 19],
  /** Doors rise out of the floor line one after another */
  doors: [8, 15, 22],
  doorDur: 14,
  /** Sash operation: lift → slide open → slide back → lower (lock on 45) */
  lift: [24, 28],
  open: [27, 35],
  close: [37, 44],
  lower: [43, 46],
  /** Range line lands with the lock */
  big: [36, 48],
  /** 84 only: note marker, note text, underline under "3-teilig" */
  marker: [50, 56],
  note: [51, 62],
  underline: [51, 60],
  /** Calm push-in while holding */
  drift: [46, 90],
} as const;

// ---- Door geometry (px) ----
const PANE = 66; // one sash incl. its black profiles
const DOOR_H = 168;
const FRAME = 4; // white outer frame
const PROFILE = 5; // black sash profile
const GAP = 32;
const SLIDE = Math.round(PANE * 0.8);
const LIFT = 3;
const INNER_H = DOOR_H - 2 * FRAME;
const GLASS_W = PANE - 2 * PROFILE;
const GLASS_H = INNER_H - 2 * PROFILE;

type Door = {
  panes: number;
  /** Index of the sash that operates */
  slider: number;
  /** Direction it slides open */
  dir: -1 | 1;
  label: string;
  start: number;
};

const DOORS: Door[] = [
  { panes: 2, slider: 1, dir: -1, label: "2-teilig", start: T.doors[0] },
  { panes: 3, slider: 1, dir: -1, label: "3-teilig", start: T.doors[1] },
  { panes: 4, slider: 2, dir: 1, label: "4-teilig", start: T.doors[2] },
];

const doorW = (panes: number) => panes * PANE + 2 * FRAME;
const ROW_W =
  DOORS.reduce((sum, d) => sum + doorW(d.panes), 0) + GAP * (DOORS.length - 1);
const ROW_X = (GRID.colWidth - ROW_W) / 2;
const DOOR_X = DOORS.map(
  (_, i) =>
    ROW_X + DOORS.slice(0, i).reduce((sum, d) => sum + doorW(d.panes) + GAP, 0),
);

// ---- Vertical layout, relative to the column top (y = 310) ----
const DOOR_TOP = 118;
const FLOOR = DOOR_TOP + DOOR_H;
const LABEL_TOP = FLOOR + 20;
const BIG_TOP = LABEL_TOP + 92;
const NOTE_TOP = BIG_TOP + 112;

const useEased = (
  range: readonly [number, number],
  easing: (t: number) => number,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, range, [0, 1], { ...clamp, easing });
};

/** One sash: black profile, blue90 glass with the architectural glass hatch. */
const Sash: React.FC<{
  left: number;
  handle?: "left" | "right";
  style?: React.CSSProperties;
}> = ({ left, handle, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 0,
      width: PANE,
      height: INNER_H,
      backgroundColor: colors.black,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: PROFILE,
        top: PROFILE,
        width: GLASS_W,
        height: GLASS_H,
        backgroundColor: colors.blue90,
      }}
    >
      <svg
        width={GLASS_W}
        height={GLASS_H}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <line
          x1={14}
          y1={34}
          x2={34}
          y2={14}
          stroke={colors.blue70}
          strokeWidth={2}
        />
        <line
          x1={14}
          y1={48}
          x2={42}
          y2={20}
          stroke={colors.blue70}
          strokeWidth={2}
        />
      </svg>
    </div>
    {handle ? (
      <div
        style={{
          position: "absolute",
          left: handle === "right" ? PANE - PROFILE - 3 : PROFILE - 3,
          top: INNER_H * 0.52 - 13,
          width: 6,
          height: 26,
          backgroundColor: colors.white,
        }}
      />
    ) : null}
  </div>
);

/** Front elevation of one lift-and-slide door that rises out of the floor and operates once. */
const DoorElevation: React.FC<{ door: Door; x: number }> = ({ door, x }) => {
  const rise = useEased([door.start, door.start + T.doorDur], ease.reveal);
  const up = useEased(T.lift, ease.move);
  const down = useEased(T.lower, ease.snap);
  const opened = useEased(T.open, ease.slide);
  const closed = useEased(T.close, ease.slide);

  const lift = up * (1 - down) * LIFT;
  const shift = door.dir * (opened - closed) * SLIDE;
  const fixed = Array.from({ length: door.panes }, (_, i) => i).filter(
    (i) => i !== door.slider,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: DOOR_TOP,
        width: doorW(door.panes),
        height: DOOR_H,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `0 ${(1 - rise) * (DOOR_H + 2)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: FRAME,
            top: FRAME,
            width: door.panes * PANE,
            height: INNER_H,
            overflow: "hidden",
            backgroundColor: colors.blue,
          }}
        >
          {fixed.map((i) => (
            <Sash key={i} left={i * PANE} />
          ))}
          <Sash
            left={door.slider * PANE}
            handle={door.dir === -1 ? "right" : "left"}
            style={{ translate: `${shift}px ${-lift}px` }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            border: `${FRAME}px solid ${colors.white}`,
          }}
        />
      </div>
    </div>
  );
};

const DoorLabel: React.FC<{ door: Door; x: number; accent: boolean }> = ({
  door,
  x,
  accent,
}) => {
  const labelIn = useEased(
    [door.start + 4, door.start + 4 + T.doorDur],
    ease.reveal,
  );
  const line = useEased(T.underline, ease.snap);
  const color = accent
    ? interpolateColors(line, [0, 1], [colors.blue20, colors.white])
    : colors.blue20;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        width: doorW(door.panes),
        top: LABEL_TOP,
        textAlign: "center",
      }}
    >
      <div style={{ display: "inline-block", position: "relative" }}>
        <RiseText progress={labelIn}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              color,
            }}
          >
            {door.label}
          </div>
        </RiseText>
        {accent ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "100%",
              marginTop: 2,
              height: 4,
              backgroundColor: colors.yellow,
              scale: `${line} 1`,
              transformOrigin: "left center",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const TypenColumn: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const floor = useEased(T.floor, ease.snap);
  const big = useEased(T.big, ease.reveal);
  const marker = useEased(T.marker, ease.snap);
  const note = useEased(T.note, ease.reveal);
  const drift = useEased(T.drift, ease.loop);
  const is84 = system === 84;

  return (
    <Column
      system={system}
      style={{
        scale: `${1 + drift * 0.014}`,
        transformOrigin: "50% 45%",
      }}
    >
      {/* Floor line grows outward from the central mullion */}
      <div
        style={{
          position: "absolute",
          left: ROW_X - 16,
          width: ROW_W + 32,
          top: FLOOR,
          height: 2,
          backgroundColor: colors.blue70,
          scale: `${floor} 1`,
          transformOrigin: is84 ? "left center" : "right center",
        }}
      />
      {DOORS.map((door, i) => (
        <DoorElevation key={door.label} door={door} x={DOOR_X[i]} />
      ))}
      {DOORS.map((door, i) => (
        <DoorLabel
          key={door.label}
          door={door}
          x={DOOR_X[i]}
          accent={is84 && door.panes === 3}
        />
      ))}

      <RiseText
        progress={big}
        style={{
          position: "absolute",
          left: 0,
          top: BIG_TOP,
          width: GRID.colWidth,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
          }}
        >
          2- bis 4-teilig
        </div>
      </RiseText>

      {is84 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: NOTE_TOP,
            width: GRID.colWidth,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              marginTop: -2,
              backgroundColor: colors.yellow,
              scale: `${marker}`,
            }}
          />
          <RiseText progress={note}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              }}
            >
              Schema E entfällt bei 3-teilig
            </div>
          </RiseText>
        </div>
      ) : null}
    </Column>
  );
};

export const TypenScene: React.FC = () => (
  <SceneBg>
    <CategoryLabel icon="sonderausstattung" title="Typen" />
    <Divider />
    <TypenColumn system={74} />
    <TypenColumn system={84} />
  </SceneBg>
);
