// Brent — the price (local 0–149). The pane reveals the scene during 0–15,
// the next one covers it during 135–150, so every move lands by f72 and the
// scene then holds with a slow drift.
//
// Brand "Prinzip Rahmen und Fläche" on the full blue field: an open red frame
// (its gap on the top edge, like the Bildmarke, right above the bar) holds the
// counter and a single-value gauge. The gauge is honest: one bar on a fixed
// scale 85–125, no invented price history.
//
// One component, two layouts (useVideoConfig decides):
// - 16:9: headline left, frame right. The counter's cap height spans both
//   title lines and shares their baselines, and the unit shares the
//   description's first baseline, so the two columns read on one grid.
// - 9:16: stacked for social. Headline, rule and description on top, the
//   frame below at almost full width, the date line under it. Every text sits
//   inside the social safe zone (x 60–940, y 220–1560); only the frame's right
//   stroke and the yellow foot reach beyond it.
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  OpenFrame,
  RULE,
  RiseText,
  SceneBg,
  TYPE,
  TitleRule,
  YellowFoot,
  clamp,
  fmt,
  splitBalanced,
  type OelpreisProps,
} from "../kit";

// ---------------------------------------------------------------------------
// Type metrics (Filson Pro, em) — used to place text by its baseline
// ---------------------------------------------------------------------------
const ASC = 0.917;
const DESC = 0.256;
const CAP = 0.701;
/** Advance of a tabular figure (tnum) in Filson Pro Bold. */
const TNUM = 0.68;
/** Rough average advance per character of Bold title type (overflow guard). */
const TITLE_CHAR = 0.58;

/** Top of a text box whose first baseline should sit at `baseline`. */
const boxTop = (baseline: number, size: number, lineHeight: number) =>
  baseline - ((lineHeight - ASC - DESC) * size) / 2 - ASC * size;

// Gauge: fixed scale, so any value between 85 and 125 fits.
const SCALE = { min: 85, max: 125 } as const;
const MAJOR = [90, 100, 110, 120];
const MINOR = [85, 95, 105, 115, 125];

// ---------------------------------------------------------------------------
// Geometry (absolute px), one set per orientation
// ---------------------------------------------------------------------------
const makeLayout = (portrait: boolean) => {
  // Text column: headline, rule, description.
  const LEFT_X = portrait ? 80 : 140;
  const TITLE_SIZE = portrait ? 120 : TYPE.title;
  const TITLE_MAX_W = portrait ? 820 : 780;
  const TITLE_LINE = TITLE_SIZE * 1.15;
  /** Cap line of title line 1 (16:9: shared with the counter). */
  const CAP_TOP = portrait ? 282 : 372;
  const BASE_1 = CAP_TOP + CAP * TITLE_SIZE;
  /** Baseline of title line 2 (16:9: shared with the counter). */
  const BASE_2 = BASE_1 + TITLE_LINE;
  const RULE_GAP = portrait ? 36 : 32;
  const RULE_TOP = BASE_2 + RULE_GAP;
  const RULE_W = portrait ? 220 : 200;
  const DESC_SIZE = portrait ? 42 : TYPE.body;
  /** Description line 1 (16:9: shared with the unit). */
  const DESC_BASE = RULE_TOP + RULE.title + RULE_GAP + CAP * DESC_SIZE;
  const DESC_W = portrait ? 820 : 640;
  const STAND_SIZE = portrait ? TYPE.side : Math.round(TYPE.side * 0.9);

  // Open frame (outer edges). In 16:9 its left edge follows from the counter.
  const FRAME_TOP = portrait ? 780 : 170;
  const FRAME_BOTTOM = portrait ? 1440 : 890;
  const FRAME_RIGHT = portrait ? 1000 : 1780;
  const STROKE = 10;

  // Gauge.
  const SCALE_PAD = portrait ? 80 : 90;
  const SCALE_TOP = FRAME_TOP + SCALE_PAD; // y of 125
  const SCALE_BOTTOM = FRAME_BOTTOM - SCALE_PAD; // y of 85
  const PX_PER_USD = (SCALE_BOTTOM - SCALE_TOP) / (SCALE.max - SCALE.min);
  const LABEL_SIZE = portrait ? 28 : 26;
  const LABEL_W = portrait ? 50 : 48;
  // 9:16: labels end left of x 940 (safe zone), the stroke may run past it.
  const LABEL_PAD = portrait ? 62 : 52;
  const LABEL_X = FRAME_RIGHT - STROKE - LABEL_PAD - LABEL_W;
  const TICK_MAJOR = 20;
  const TICK_MINOR = 10;
  const AXIS_X = LABEL_X - 12 - TICK_MAJOR;
  const BAR_W = 24;
  const BAR_RIGHT = AXIS_X - 6;
  const BAR_LEFT = BAR_RIGHT - BAR_W;
  const MARKER_LEFT = BAR_LEFT - 12;
  const MARKER_RIGHT = AXIS_X + TICK_MAJOR;
  const MARKER_H = 4;

  const levelY = (value: number) =>
    SCALE_BOTTOM -
    (Math.min(Math.max(value, SCALE.min), SCALE.max) - SCALE.min) * PX_PER_USD;

  // Counter. Its box holds three tabular figures; right-aligned, so it never
  // jitters.
  const COUNTER_RIGHT = MARKER_LEFT - 48;
  const COUNTER_PAD = 44;
  let COUNTER_SIZE: number;
  let COUNTER_W: number;
  let FRAME_LEFT: number;
  let COUNTER_BASE: number;
  let UNIT_SIZE: number;
  let UNIT_BASE: number;
  let STAND_BASE: number;
  if (portrait) {
    // The frame is set (centred, 80 px margins); the counter fills it up to
    // the gauge, and its cap height is centred on the scale's 110 tick.
    FRAME_LEFT = 80;
    COUNTER_W = COUNTER_RIGHT - COUNTER_PAD - FRAME_LEFT;
    COUNTER_SIZE = COUNTER_W / (3 * TNUM);
    COUNTER_BASE = levelY(110) + (CAP * COUNTER_SIZE) / 2;
    UNIT_SIZE = DESC_SIZE;
    UNIT_BASE = COUNTER_BASE + 96;
    STAND_BASE = FRAME_BOTTOM + 90;
  } else {
    // Cap height = title line 1 cap top → title line 2 baseline.
    COUNTER_SIZE = (BASE_2 - CAP_TOP) / CAP;
    COUNTER_W = Math.ceil(3 * TNUM * COUNTER_SIZE);
    FRAME_LEFT = COUNTER_RIGHT - COUNTER_W - COUNTER_PAD;
    COUNTER_BASE = BASE_2;
    UNIT_SIZE = TYPE.body;
    UNIT_BASE = DESC_BASE;
    // The date line's baseline sits on the frame's foot.
    STAND_BASE = FRAME_BOTTOM;
  }
  const UNIT_W = 320;

  /** Gap on the top edge sits right above the bar (OpenFrame's gapAt, 0–1). */
  const GAP_AT =
    ((BAR_LEFT + BAR_RIGHT) / 2 - (FRAME_LEFT + STROKE / 2)) /
    (FRAME_RIGHT - FRAME_LEFT - STROKE);

  return {
    LEFT_X,
    TITLE_SIZE,
    TITLE_MAX_W,
    TITLE_LINE,
    BASE_1,
    RULE_TOP,
    RULE_W,
    DESC_SIZE,
    DESC_BASE,
    DESC_W,
    STAND_SIZE,
    STAND_BASE,
    FRAME_TOP,
    FRAME_BOTTOM,
    FRAME_LEFT,
    FRAME_RIGHT,
    STROKE,
    GAP_AT,
    SCALE_TOP,
    SCALE_BOTTOM,
    LABEL_SIZE,
    LABEL_X,
    TICK_MAJOR,
    TICK_MINOR,
    AXIS_X,
    BAR_W,
    BAR_LEFT,
    MARKER_LEFT,
    MARKER_RIGHT,
    MARKER_H,
    levelY,
    COUNTER_SIZE,
    COUNTER_W,
    COUNTER_RIGHT,
    COUNTER_BASE,
    UNIT_SIZE,
    UNIT_BASE,
    UNIT_W,
  };
};

const LANDSCAPE = makeLayout(false);
const PORTRAIT = makeLayout(true);

const useLayout = () => {
  const { width, height } = useVideoConfig();
  return height > width ? PORTRAIT : LANDSCAPE;
};

// ---------------------------------------------------------------------------
// Beats (local frames, one beat = 15)
// ---------------------------------------------------------------------------
const TITLE_IN = 9; // line 1 rises 9–25, line 2 12–28
const RULE_IN = 24; // red Unterlinie snaps 24–38
const FRAME_IN = 15; // frame draws 15–50
const GAUGE_IN = 16; // axis draws 16–34, ticks follow bottom → top
const COUNTER_IN = 14; // number rises 14–26 on its start value
const COUNT_FROM = 20; // counts 20–72, bar rises in sync
const COUNT_TO = 72;
const UNIT_IN = 30;
const DESC_IN = 32;
const STAND_IN = 46;
const FOOT_FROM = 40; // yellow foot rule 40–70
const FOOT_TO = 70;
const DRIFT_FROM = 80; // calm hold until the pane covers the scene

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Decimals the value actually carries (0 for the usual whole-dollar price). */
const decimalsOf = (value: number) =>
  Number.isInteger(value) ? 0 : Number.isInteger(value * 10) ? 1 : 2;

/** Width of a tabular number in em (figures 0,68, comma/point ~0,27). */
const numberEm = (text: string) =>
  [...text].reduce((sum, c) => sum + (/\d/.test(c) ? TNUM : 0.27), 0);

// ---------------------------------------------------------------------------
// Text column: headline, rule, description, date line
// ---------------------------------------------------------------------------

const Headline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const lines = splitBalanced(text);
  const longest = Math.max(...lines.map((l) => l.length));
  // Guard against a longer headline running into the frame / safe zone.
  const size = Math.min(L.TITLE_SIZE, L.TITLE_MAX_W / (longest * TITLE_CHAR));
  const rule = interpolate(frame, [RULE_IN, RULE_IN + 14], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  return (
    <>
      {lines.map((line, i) => {
        const rise = interpolate(
          frame,
          [TITLE_IN + i * 3, TITLE_IN + 16 + i * 3],
          [0, 1],
          { ...clamp, easing: ease.reveal },
        );
        return (
          <RiseText
            key={line}
            progress={rise}
            style={{
              position: "absolute",
              left: L.LEFT_X,
              top: boxTop(L.BASE_1 + i * L.TITLE_LINE, size, 1.15),
              fontSize: size,
            }}
          >
            <div
              style={{ fontWeight: 700, lineHeight: 1.15, whiteSpace: "nowrap" }}
            >
              {line}
            </div>
          </RiseText>
        );
      })}
      <TitleRule
        progress={rule}
        width={L.RULE_W}
        style={{ position: "absolute", left: L.LEFT_X, top: L.RULE_TOP }}
      />
    </>
  );
};

const Description: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const rise = interpolate(frame, [DESC_IN, DESC_IN + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <RiseText
      progress={rise}
      style={{
        position: "absolute",
        left: L.LEFT_X,
        top: boxTop(L.DESC_BASE, L.DESC_SIZE, 1.5),
        width: L.DESC_W,
        fontSize: L.DESC_SIZE,
      }}
    >
      <div
        style={{
          fontWeight: 500,
          lineHeight: 1.5,
          opacity: 0.9,
          textWrap: "balance",
        }}
      >
        Preis je Barrel Nordseeöl der Sorte Brent, in US-Dollar
      </div>
    </RiseText>
  );
};

/** Date line, bottom-left (16:9: its baseline sits on the frame's foot). */
const Stand: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const rise = interpolate(frame, [STAND_IN, STAND_IN + 14], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <RiseText
      progress={rise}
      style={{
        position: "absolute",
        left: L.LEFT_X,
        top: boxTop(L.STAND_BASE, L.STAND_SIZE, 1.3),
        fontSize: L.STAND_SIZE,
      }}
    >
      <div
        style={{
          fontWeight: 400,
          lineHeight: 1.3,
          opacity: 0.9,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </RiseText>
  );
};

// ---------------------------------------------------------------------------
// Frame content: counter + gauge
// ---------------------------------------------------------------------------

/** Continuous price value: scale floor (or lower) → brentValue, 20–72. */
const usePrice = (value: number) => {
  const frame = useCurrentFrame();
  const start = Math.min(SCALE.min, value - 25);
  return interpolate(frame, [COUNT_FROM, COUNT_TO], [start, value], {
    ...clamp,
    easing: ease.snap,
  });
};

const Counter: React.FC<{ value: number }> = ({ value }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const price = usePrice(value);
  const decimals = decimalsOf(value);
  const f = 10 ** decimals;
  // Rounded, and exactly `value` once the count has landed.
  const shown = frame >= COUNT_TO ? value : Math.round(price * f) / f;
  // Scale down only if the final number is wider than three figures.
  const size = Math.min(
    L.COUNTER_SIZE,
    L.COUNTER_W / numberEm(fmt(value, decimals)),
  );
  const rise = interpolate(frame, [COUNTER_IN, COUNTER_IN + 12], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const unitRise = interpolate(frame, [UNIT_IN, UNIT_IN + 14], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <>
      <RiseText
        progress={rise}
        style={{
          position: "absolute",
          left: L.COUNTER_RIGHT - L.COUNTER_W,
          width: L.COUNTER_W,
          top: boxTop(L.COUNTER_BASE, size, 1),
          fontSize: size,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            lineHeight: 1,
            textAlign: "right",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(shown, decimals)}
        </div>
      </RiseText>
      <RiseText
        progress={unitRise}
        style={{
          position: "absolute",
          left: L.COUNTER_RIGHT - L.UNIT_W,
          width: L.UNIT_W,
          top: boxTop(L.UNIT_BASE, L.UNIT_SIZE, 1.5),
          fontSize: L.UNIT_SIZE,
        }}
      >
        <div
          style={{
            fontWeight: 500,
            lineHeight: 1.5,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          US-Dollar
        </div>
      </RiseText>
    </>
  );
};

/** Horizontal tick on the scale, drawn out from the axis. */
const Tick: React.FC<{
  x: number;
  y: number;
  length: number;
  progress: number;
  color: string;
}> = ({ x, y, length, progress, color }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - 1,
      width: length * progress,
      height: 2,
      backgroundColor: color,
    }}
  />
);

/**
 * Vertical single-value gauge: track + axis with ticks at 90–120, a red bar
 * that rises with the counter and a white marker line at the value.
 */
const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const price = usePrice(value);
  const axis = interpolate(frame, [GAUGE_IN, GAUGE_IN + 18], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const marker = interpolate(frame, [COUNT_FROM - 2, COUNT_FROM + 8], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  // Ticks follow the axis upwards: the lower the tick, the earlier it draws.
  const tickIn = (v: number) => {
    const start = GAUGE_IN + 2 + ((v - SCALE.min) / (SCALE.max - SCALE.min)) * 12;
    return interpolate(frame, [start, start + 10], [0, 1], {
      ...clamp,
      easing: ease.snap,
    });
  };
  const span = L.SCALE_BOTTOM - L.SCALE_TOP;
  const barTop = L.levelY(price);
  return (
    <>
      {/* Track: the full scale range, so the bar reads against it */}
      <div
        style={{
          position: "absolute",
          left: L.BAR_LEFT,
          top: L.SCALE_BOTTOM - span * axis,
          width: L.BAR_W,
          height: span * axis,
          backgroundColor: colors.blue90,
        }}
      />
      {/* Axis, drawn bottom → top */}
      <div
        style={{
          position: "absolute",
          left: L.AXIS_X - 1,
          top: L.SCALE_BOTTOM - span * axis,
          width: 2,
          height: span * axis,
          backgroundColor: colors.blue20,
        }}
      />
      {MINOR.map((v) => (
        <Tick
          key={v}
          x={L.AXIS_X}
          y={L.levelY(v)}
          length={L.TICK_MINOR}
          progress={tickIn(v)}
          color={colors.blue70}
        />
      ))}
      {MAJOR.map((v) => {
        const t = tickIn(v);
        return (
          <div key={v}>
            <Tick
              x={L.AXIS_X}
              y={L.levelY(v)}
              length={L.TICK_MAJOR}
              progress={t}
              color={colors.blue20}
            />
            <div
              style={{
                position: "absolute",
                left: L.LABEL_X,
                top: boxTop(
                  L.levelY(v) + (CAP * L.LABEL_SIZE) / 2,
                  L.LABEL_SIZE,
                  1.3,
                ),
                fontSize: L.LABEL_SIZE,
                fontWeight: 400,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                color: colors.blue20,
                opacity: t,
                translate: `${(t - 1) * 12}px 0`,
              }}
            >
              {fmt(v)}
            </div>
          </div>
        );
      })}
      {/* Bar: honest level of the counter's value */}
      <div
        style={{
          position: "absolute",
          left: L.BAR_LEFT,
          top: barTop,
          width: L.BAR_W,
          height: L.SCALE_BOTTOM - barTop,
          backgroundColor: colors.red,
        }}
      />
      {/* Marker line at the value, rides on top of the bar */}
      <div
        style={{
          position: "absolute",
          left: L.MARKER_LEFT,
          top: barTop - L.MARKER_H / 2,
          width: L.MARKER_RIGHT - L.MARKER_LEFT,
          height: L.MARKER_H,
          backgroundColor: colors.white,
          scale: `${marker} 1`,
          transformOrigin: `${L.BAR_LEFT + L.BAR_W / 2 - L.MARKER_LEFT}px 50%`,
        }}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export const BrentScene: React.FC<OelpreisProps> = ({
  brentHeadline,
  brentValue,
  stand,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const frameDraw = interpolate(frame, [FRAME_IN, FRAME_IN + 35], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const foot = interpolate(frame, [FOOT_FROM, FOOT_TO], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  // Hold: everything drifts 4 px left, ahead of the next pane's exit drift.
  const drift = interpolate(frame, [DRIFT_FROM, 149], [0, -4], {
    ...clamp,
    easing: ease.loop,
  });

  return (
    <SceneBg>
      <AbsoluteFill style={{ translate: `${drift}px 0` }}>
        <Headline text={brentHeadline} />
        <Description />
        <Stand text={stand} />

        <OpenFrame
          left={L.FRAME_LEFT}
          top={L.FRAME_TOP}
          width={L.FRAME_RIGHT - L.FRAME_LEFT}
          height={L.FRAME_BOTTOM - L.FRAME_TOP}
          progress={frameDraw}
          gapAt={L.GAP_AT}
          stroke={L.STROKE}
        />
        <Gauge value={brentValue} />
        <Counter value={brentValue} />
      </AbsoluteFill>
      <YellowFoot progress={foot} />
    </SceneBg>
  );
};
