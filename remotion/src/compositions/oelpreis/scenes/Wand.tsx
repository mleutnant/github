// Wand — headline wall (local 0–164). The two headline props pile up into a
// wall of nine rows: each row repeats both headlines, separated by the brand's
// red list bar, in varying sizes and three tones (blue 70 far, blue 20 mid,
// white near). Rows drift sideways in alternating directions, bigger rows
// further (parallax). Once the wall is full, the camera pushes into one
// instance of the Brent headline near the centre: everything else dims to
// blue 70, the target turns white and gets its red Unterlinie.
// First scene of the film: starts on the plain blue field; the next pane covers
// it at local 150–165, so nothing exits.
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { colors, ease } from "../../../brand/tokens";
import type { OelpreisProps } from "../kit";
import { RULE, RiseText, SceneBg, TYPE, TitleRule, clamp } from "../kit";

const W = 1920;
const H = 1080;

// Filson Pro Bold metrics (em, hhea) inside a 1.15 line box.
const LEADING = 1.15;
const BASELINE = 0.906;
const CAP = 0.701;

/** Red list bar between two headlines. */
const BAR_W = 6;
/** Space on either side of a bar, in em of the row. */
const GAP_EM = 0.85;

type Kind = "brent" | "hormus";

type RowSpec = {
  /** Font size (px). */
  size: number;
  /** Resting colour before the push. */
  tone: string;
  /** Where the row's pivot headline is centred (wall px, before drift). */
  x: number;
  /** Which headline the pivot carries; the row alternates from there. */
  pivot: Kind;
};

// Top → bottom. Bigger rows are brighter and drift further, so the wall has depth.
const ROWS: RowSpec[] = [
  { size: 52, tone: colors.blue70, x: 640, pivot: "brent" },
  { size: 76, tone: colors.blue20, x: 1240, pivot: "hormus" },
  { size: 44, tone: colors.blue70, x: 820, pivot: "brent" },
  { size: 84, tone: colors.white, x: 835, pivot: "hormus" },
  { size: 68, tone: colors.blue20, x: 900, pivot: "brent" },
  { size: 56, tone: colors.blue70, x: 1300, pivot: "hormus" },
  { size: 80, tone: colors.white, x: 700, pivot: "brent" },
  { size: 48, tone: colors.blue70, x: 1100, pivot: "hormus" },
  { size: 64, tone: colors.blue20, x: 560, pivot: "brent" },
];

/** The camera pushes into this row's pivot (a Brent headline). */
const TARGET_ROW = 4;
/** Headlines on each side of a row's pivot — enough to outrun drift and frame. */
const SIDE = 4;

// Vertical rhythm: the cap middles of the first and last row sit just inside
// the frame edges (the wall bleeds out), rows keep a constant cap-to-cap gap.
const FIRST_CAP_MID = 16;
const LAST_CAP_MID = 1066;
const caps = ROWS.map((r) => r.size * CAP);
const capSum = caps.reduce((a, b) => a + b, 0);
const ROW_GAP =
  (LAST_CAP_MID -
    FIRST_CAP_MID -
    (capSum - caps[0] / 2 - caps[caps.length - 1] / 2)) /
  (ROWS.length - 1);
const ROW_TOPS = ROWS.map((r, i) => {
  const capMid =
    FIRST_CAP_MID +
    caps.slice(0, i).reduce((a, c, k) => a + c / 2 + ROW_GAP + caps[k + 1] / 2, 0);
  return capMid - (BASELINE - CAP / 2) * r.size;
});

// Beats (local frames)
const B = {
  /** First headlines, one by one … */
  leads: [3, 11, 17],
  /** … then the rest of the wall, ever faster. */
  pile: 20,
  pileEnd: 46,
  rise: 14,
  /** Focus: everything else dims, the target turns white. */
  dim: 58,
  dimEnd: 100,
  /** Bars leave red quickly, so the in-between mix is barely seen. */
  barsDimEnd: 68,
  /** Camera push into the target. */
  push: 60,
  pushEnd: 140,
  /** Red Unterlinie under the target. */
  rule: 114,
  ruleEnd: 138,
  /** Drift runs across the whole scene, incl. the pane overlap. */
  driftEnd: 165,
} as const;

/** Target size on screen at the end of the push (px font size) … */
const TARGET_SIZE = 150;
/** … unless the headline would get wider than this. */
const TARGET_MAX_W = 1600;
/** Unterlinie position under the target, em below the line top. */
const RULE_TOP_EM = BASELINE + 0.33;
/** Unterlinie weight in wall px: the 4 px title rule, scaled to the type. */
const RULE_W = (RULE.title * ROWS[TARGET_ROW].size) / TYPE.title;
/** Focus point: middle between the target's cap top and its rule. */
const FOCUS_EM =
  (BASELINE - CAP + RULE_TOP_EM + RULE_W / ROWS[TARGET_ROW].size) / 2;

const key = (row: number, j: number) => `${row}:${j}`;

// Appearance frame of every headline. Three hand-picked leads open the wall
// (fully in frame; the third is the later push target, so the camera returns
// to a headline the viewer has already read). The rest follow in a seeded
// order (centre of each row first) with the interval shrinking — the news
// piling up.
const LEADS = [key(3, 0), key(6, 0), key(TARGET_ROW, 0)];
const APPEAR: Record<string, number> = (() => {
  const items: Array<{ id: string; order: number }> = [];
  ROWS.forEach((_, r) => {
    for (let j = -SIDE; j <= SIDE; j++) {
      const id = key(r, j);
      if (!LEADS.includes(id)) {
        items.push({
          id,
          order: Math.abs(j) * 0.45 + random(`wand-${id}`) * 0.9,
        });
      }
    }
  });
  items.sort((a, b) => a.order - b.order);
  const out: Record<string, number> = {};
  LEADS.forEach((id, i) => {
    out[id] = B.leads[i];
  });
  items.forEach(({ id }, rank) => {
    out[id] =
      B.pile + (B.pileEnd - B.pile) * Math.pow(rank / (items.length - 1), 0.6);
  });
  return out;
})();

/** Horizontal drift of a row: alternating directions, bigger rows further. */
const driftOf = (row: number, frame: number) => {
  const amp = 90 + ROWS[row].size * 2.2;
  const dir = row % 2 === 0 ? 1 : -1;
  return interpolate(frame, [0, B.driftEnd], [-amp / 2, amp / 2], {
    ...clamp,
    easing: ease.loop,
  }) * dir;
};

/** Measures the target headline once the brand font is ready (layout px, unscaled). */
const useMeasuredWidth = (text: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useLayoutEffect(() => {
    const handle = delayRender("Wand: measuring the target headline");
    let active = true;
    document.fonts.ready.then(() => {
      if (active && ref.current) {
        setWidth(ref.current.offsetWidth);
      }
      continueRender(handle);
    });
    return () => {
      active = false;
      continueRender(handle);
    };
  }, [text, delayRender, continueRender]);
  return [ref, width] as const;
};

const Headline: React.FC<{ text: string; start: number; color: string }> = ({
  text,
  start,
  color,
}) => {
  const frame = useCurrentFrame();
  return (
    <RiseText
      progress={interpolate(frame, [start, start + B.rise], [0, 1], {
        ...clamp,
        easing: ease.reveal,
      })}
      // A little further than the default so umlauts never peek out of the mask.
      distance={1.3}
      style={{ flexShrink: 0, color }}
    >
      {text}
    </RiseText>
  );
};

/** Red list bar, 0.8 × cap height, centred on the caps. Snaps open vertically. */
const Bar: React.FC<{ size: number; start: number; color: string }> = ({
  size,
  start,
  color,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: BAR_W,
        height: size * LEADING,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (BASELINE - CAP * 0.9) * size,
          width: BAR_W,
          height: CAP * 0.8 * size,
          backgroundColor: color,
          scale: `1 ${interpolate(frame, [start, start + 10], [0, 1], {
            ...clamp,
            easing: ease.snap,
          })}`,
        }}
      />
    </div>
  );
};

export const WandScene: React.FC<OelpreisProps> = ({
  brentHeadline,
  hormusHeadline,
}) => {
  const frame = useCurrentFrame();
  const [targetRef, targetWidth] = useMeasuredWidth(brentHeadline);

  const textOf = (row: number, j: number) => {
    const pivotIsBrent = ROWS[row].pivot === "brent";
    const same = Math.abs(j) % 2 === 0;
    return pivotIsBrent === same ? brentHeadline : hormusHeadline;
  };

  // Focus: everything but the target sinks to blue 70.
  const dim = interpolate(frame, [B.dim, B.dimEnd], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const barColor = interpolateColors(
    frame,
    [B.dim, B.barsDimEnd],
    [colors.red, colors.blue70],
    { easing: ease.move },
  );

  // Camera: scale the wall around the target and carry it to the frame centre.
  const target = ROWS[TARGET_ROW];
  const endScale = Math.min(
    TARGET_SIZE / target.size,
    targetWidth ? TARGET_MAX_W / targetWidth : Infinity,
  );
  const push = interpolate(frame, [B.push, B.pushEnd], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const scale = interpolate(frame, [B.push, B.pushEnd], [1, endScale], {
    ...clamp,
    easing: ease.slide,
    output: "perceptual-scale",
  });
  const fx = target.x + driftOf(TARGET_ROW, frame);
  const fy = ROW_TOPS[TARGET_ROW] + FOCUS_EM * target.size;
  const cx = fx + (W / 2 - fx) * push;
  const cy = fy + (H / 2 - fy) * push;

  const ruleIn = interpolate(frame, [B.rule, B.ruleEnd], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });

  return (
    <SceneBg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: "0 0",
          translate: `${cx - scale * fx}px ${cy - scale * fy}px`,
          scale: String(scale),
        }}
      >
        {ROWS.map((row, r) => {
          const gap = row.size * GAP_EM;
          const color = interpolateColors(dim, [0, 1], [row.tone, colors.blue70]);
          const isTarget = r === TARGET_ROW;
          const item = (j: number) => (
            <Headline
              key={`h${j}`}
              text={textOf(r, j)}
              start={APPEAR[key(r, j)]}
              color={color}
            />
          );
          // Bar between headline j and j + 1, once both are there.
          const bar = (j: number) => (
            <Bar
              key={`b${j}`}
              size={row.size}
              start={Math.max(APPEAR[key(r, j)], APPEAR[key(r, j + 1)]) + 3}
              color={barColor}
            />
          );
          const left: React.ReactNode[] = [];
          for (let j = -SIDE; j < 0; j++) {
            left.push(item(j), bar(j));
          }
          const right: React.ReactNode[] = [];
          for (let j = 1; j <= SIDE; j++) {
            right.push(bar(j - 1), item(j));
          }
          const strip: React.CSSProperties = {
            position: "absolute",
            top: 0,
            display: "flex",
            alignItems: "flex-start",
            gap,
            width: "max-content",
          };
          return (
            <div
              key={row.x}
              style={{
                position: "absolute",
                left: row.x,
                top: ROW_TOPS[r],
                translate: `${driftOf(r, frame)}px 0`,
                fontSize: row.size,
                fontWeight: 700,
                lineHeight: LEADING,
                whiteSpace: "nowrap",
              }}
            >
              {/* Pivot headline, centred on row.x; the strips hang off its sides. */}
              <div
                ref={isTarget ? targetRef : undefined}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "max-content",
                  translate: "-50% 0",
                }}
              >
                <Headline
                  text={textOf(r, 0)}
                  start={APPEAR[key(r, 0)]}
                  color={
                    isTarget
                      ? interpolateColors(dim, [0, 1], [row.tone, colors.white])
                      : color
                  }
                />
                {isTarget && targetWidth ? (
                  <TitleRule
                    progress={ruleIn}
                    width={targetWidth}
                    weight={RULE_W}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: RULE_TOP_EM * row.size,
                    }}
                  />
                ) : null}
                <div style={{ ...strip, right: "100%", paddingRight: gap }}>
                  {left}
                </div>
                <div style={{ ...strip, left: "100%", paddingLeft: gap }}>
                  {right}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneBg>
  );
};
