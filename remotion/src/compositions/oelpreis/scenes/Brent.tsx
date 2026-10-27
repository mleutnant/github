// Brent — the price (local 0–149). The pane reveals the scene during 0–15,
// the next one covers it during 135–150, so every move lands by f72 and the
// scene then holds with a slow drift.
//
// Brand "Prinzip Rahmen und Fläche" on the full blue field: the headline sits
// left; on the right an open red frame (its gap on the top edge, like the
// Bildmarke, right above the bar) holds the counter and a single-value gauge.
// The gauge is honest: one bar on a fixed scale 85–125, no invented price
// history. The counter's cap height spans both title lines and shares their
// baselines, and the unit shares the description's first baseline, so the two
// columns read on one grid.
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
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

// ---------------------------------------------------------------------------
// Geometry (absolute px)
// ---------------------------------------------------------------------------
const LEFT_X = 140;
const TITLE_MAX_W = 780;
const TITLE_LINE = TYPE.title * 1.15;
/** Shared cap line of title line 1 and the counter. */
const CAP_TOP = 372;
const BASE_1 = CAP_TOP + CAP * TYPE.title;
/** Title line 2 and the counter share this baseline. */
const BASE_2 = BASE_1 + TITLE_LINE;
const RULE_TOP = BASE_2 + 32;
const RULE_W = 200;
/** Description line 1 and the unit share this baseline. */
const DESC_BASE = RULE_TOP + RULE.title + 32 + CAP * TYPE.body;
const DESC_W = 640;
const STAND_SIZE = Math.round(TYPE.side * 0.9);

// Open frame (outer edges). Its left edge follows from the counter below.
const FRAME_TOP = 170;
const FRAME_BOTTOM = 890;
const FRAME_RIGHT = 1780;
const STROKE = 10;

// Gauge: fixed scale, so any value between 85 and 125 fits.
const SCALE = { min: 85, max: 125 } as const;
const SCALE_TOP = FRAME_TOP + 90; // y of 125
const SCALE_BOTTOM = FRAME_BOTTOM - 90; // y of 85
const PX_PER_USD = (SCALE_BOTTOM - SCALE_TOP) / (SCALE.max - SCALE.min);
const MAJOR = [90, 100, 110, 120];
const MINOR = [85, 95, 105, 115, 125];
const LABEL_SIZE = 26;
const LABEL_W = 48;
const LABEL_X = FRAME_RIGHT - STROKE - 52 - LABEL_W;
const TICK_MAJOR = 20;
const TICK_MINOR = 10;
const AXIS_X = LABEL_X - 12 - TICK_MAJOR;
const BAR_W = 24;
const BAR_RIGHT = AXIS_X - 6;
const BAR_LEFT = BAR_RIGHT - BAR_W;
const MARKER_LEFT = BAR_LEFT - 12;
const MARKER_RIGHT = AXIS_X + TICK_MAJOR;
const MARKER_H = 4;

// Counter: cap height = title line 1 cap top → title line 2 baseline.
const COUNTER_SIZE = (BASE_2 - CAP_TOP) / CAP;
/** Box for three tabular figures; right-aligned, so it never jitters. */
const COUNTER_W = Math.ceil(3 * TNUM * COUNTER_SIZE);
const COUNTER_RIGHT = MARKER_LEFT - 48;
const FRAME_LEFT = COUNTER_RIGHT - COUNTER_W - 44;
const UNIT_W = 320;

/** Gap on the top edge sits right above the bar (OpenFrame's gapAt, 0–1). */
const GAP_AT =
  ((BAR_LEFT + BAR_RIGHT) / 2 - (FRAME_LEFT + STROKE / 2)) /
  (FRAME_RIGHT - FRAME_LEFT - STROKE);

const levelY = (value: number) =>
  SCALE_BOTTOM -
  (Math.min(Math.max(value, SCALE.min), SCALE.max) - SCALE.min) * PX_PER_USD;

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

/**
 * Splits a headline into two lines of about equal length at a word gap.
 * A number stays with the word after it ("110 Dollar" never breaks).
 */
const splitTitle = (text: string): string[] => {
  const words = text
    .trim()
    .replace(/(\d)\s+(?=\S)/g, "$1 ")
    .split(/\s+/);
  if (words.length < 2) {
    return [text];
  }
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(
      words.slice(0, i).join(" ").length - words.slice(i).join(" ").length,
    );
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

/** Decimals the value actually carries (0 for the usual whole-dollar price). */
const decimalsOf = (value: number) =>
  Number.isInteger(value) ? 0 : Number.isInteger(value * 10) ? 1 : 2;

/** Width of a tabular number in em (figures 0,68, comma/point ~0,27). */
const numberEm = (text: string) =>
  [...text].reduce((sum, c) => sum + (/\d/.test(c) ? TNUM : 0.27), 0);

// ---------------------------------------------------------------------------
// Left column: headline, rule, description, date line
// ---------------------------------------------------------------------------

const Headline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const lines = splitTitle(text);
  const longest = Math.max(...lines.map((l) => l.length));
  // Guard against a longer headline running into the frame.
  const size = Math.min(TYPE.title, TITLE_MAX_W / (longest * TITLE_CHAR));
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
              left: LEFT_X,
              top: boxTop(BASE_1 + i * TITLE_LINE, size, 1.15),
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
        width={RULE_W}
        style={{ position: "absolute", left: LEFT_X, top: RULE_TOP }}
      />
    </>
  );
};

const Description: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [DESC_IN, DESC_IN + 16], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <RiseText
      progress={rise}
      style={{
        position: "absolute",
        left: LEFT_X,
        top: boxTop(DESC_BASE, TYPE.body, 1.5),
        width: DESC_W,
        fontSize: TYPE.body,
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

/** Date line, bottom-left; its baseline sits on the frame's foot. */
const Stand: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [STAND_IN, STAND_IN + 14], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  return (
    <RiseText
      progress={rise}
      style={{
        position: "absolute",
        left: LEFT_X,
        top: boxTop(FRAME_BOTTOM, STAND_SIZE, 1.3),
        fontSize: STAND_SIZE,
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
// Right group: counter + gauge
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
  const price = usePrice(value);
  const decimals = decimalsOf(value);
  const f = 10 ** decimals;
  // Rounded, and exactly `value` once the count has landed.
  const shown = frame >= COUNT_TO ? value : Math.round(price * f) / f;
  // Scale down only if the final number is wider than three figures.
  const size = Math.min(
    COUNTER_SIZE,
    COUNTER_W / numberEm(fmt(value, decimals)),
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
          left: COUNTER_RIGHT - COUNTER_W,
          width: COUNTER_W,
          top: boxTop(BASE_2, size, 1),
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
          left: COUNTER_RIGHT - UNIT_W,
          width: UNIT_W,
          top: boxTop(DESC_BASE, TYPE.body, 1.5),
          fontSize: TYPE.body,
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
  y: number;
  length: number;
  progress: number;
  color: string;
}> = ({ y, length, progress, color }) => (
  <div
    style={{
      position: "absolute",
      left: AXIS_X,
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
  const span = SCALE_BOTTOM - SCALE_TOP;
  const barTop = levelY(price);
  return (
    <>
      {/* Track: the full scale range, so the bar reads against it */}
      <div
        style={{
          position: "absolute",
          left: BAR_LEFT,
          top: SCALE_BOTTOM - span * axis,
          width: BAR_W,
          height: span * axis,
          backgroundColor: colors.blue90,
        }}
      />
      {/* Axis, drawn bottom → top */}
      <div
        style={{
          position: "absolute",
          left: AXIS_X - 1,
          top: SCALE_BOTTOM - span * axis,
          width: 2,
          height: span * axis,
          backgroundColor: colors.blue20,
        }}
      />
      {MINOR.map((v) => (
        <Tick
          key={v}
          y={levelY(v)}
          length={TICK_MINOR}
          progress={tickIn(v)}
          color={colors.blue70}
        />
      ))}
      {MAJOR.map((v) => {
        const t = tickIn(v);
        return (
          <div key={v}>
            <Tick
              y={levelY(v)}
              length={TICK_MAJOR}
              progress={t}
              color={colors.blue20}
            />
            <div
              style={{
                position: "absolute",
                left: LABEL_X,
                top: boxTop(levelY(v) + (CAP * LABEL_SIZE) / 2, LABEL_SIZE, 1.3),
                fontSize: LABEL_SIZE,
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
          left: BAR_LEFT,
          top: barTop,
          width: BAR_W,
          height: SCALE_BOTTOM - barTop,
          backgroundColor: colors.red,
        }}
      />
      {/* Marker line at the value, rides on top of the bar */}
      <div
        style={{
          position: "absolute",
          left: MARKER_LEFT,
          top: barTop - MARKER_H / 2,
          width: MARKER_RIGHT - MARKER_LEFT,
          height: MARKER_H,
          backgroundColor: colors.white,
          scale: `${marker} 1`,
          transformOrigin: `${BAR_LEFT + BAR_W / 2 - MARKER_LEFT}px 50%`,
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
          left={FRAME_LEFT}
          top={FRAME_TOP}
          width={FRAME_RIGHT - FRAME_LEFT}
          height={FRAME_BOTTOM - FRAME_TOP}
          progress={frameDraw}
          gapAt={GAP_AT}
          stroke={STROKE}
        />
        <Gauge value={brentValue} />
        <Counter value={brentValue} />
      </AbsoluteFill>
      <YellowFoot progress={foot} />
    </SceneBg>
  );
};
