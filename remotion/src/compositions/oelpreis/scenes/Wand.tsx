// Wand — headline wall (local 0–164). The two headline props pile up into a
// wall of rows: each row repeats both headlines, separated by the brand's
// red list bar, in varying sizes and three tones (blue 70 far, blue 20 mid,
// white near). Rows drift sideways in alternating directions, bigger rows
// further (parallax). Once the wall is full, the camera pushes into one
// instance of the Brent headline near the centre: everything else dims to
// blue 70, the target turns white and gets its red Unterlinie.
// First scene of the film: starts on the plain blue field; the next pane covers
// it at local 150–165, so nothing exits.
// One component, two layouts: 16:9 (nine rows across 1920×1080) and 9:16
// (sixteen rows across 1080×1920, push target inside the social safe zone).
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { colors, ease } from "../../../brand/tokens";
import type { OelpreisProps } from "../kit";
import { RULE, RiseText, SceneBg, TYPE, TitleRule, clamp } from "../kit";

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

type LayoutSpec = {
  /** Frame (= wall) size in px. */
  w: number;
  h: number;
  /** Top → bottom. Bigger rows are brighter and drift further, so the wall has depth. */
  rows: RowSpec[];
  /** The camera pushes into this row's pivot (a Brent headline). */
  targetRow: number;
  /** Rows whose pivots open the wall before the target: Hormus, then Brent. */
  leadRows: [number, number];
  /** Headlines on each side of a row's pivot — enough to outrun drift and frame. */
  side: number;
  /**
   * Vertical rhythm: the cap middles of the first and last row sit just inside
   * the frame edges (the wall bleeds out), rows keep a constant cap-to-cap gap.
   */
  firstCapMid: number;
  lastCapMid: number;
  /** Drift amplitude of a row: base + size × perSize (px, full sweep). */
  driftBase: number;
  driftPerSize: number;
  /** Target size on screen at the end of the push (px font size) … */
  targetSize: number;
  /** … unless the headline would get wider than this. */
  targetMaxW: number;
  /** Where the focus point lands at the end of the push (frame px). */
  focusX: number;
  focusY: number;
  /** Tone everything but the target sinks to during the push. */
  dimTone: string;
};

// 16:9 — approved layout, keep every value as it is.
const LANDSCAPE: LayoutSpec = {
  w: 1920,
  h: 1080,
  rows: [
    { size: 52, tone: colors.blue70, x: 640, pivot: "brent" },
    { size: 76, tone: colors.blue20, x: 1240, pivot: "hormus" },
    { size: 44, tone: colors.blue70, x: 820, pivot: "brent" },
    { size: 84, tone: colors.white, x: 835, pivot: "hormus" },
    { size: 68, tone: colors.blue20, x: 900, pivot: "brent" },
    { size: 56, tone: colors.blue70, x: 1300, pivot: "hormus" },
    { size: 80, tone: colors.white, x: 700, pivot: "brent" },
    { size: 48, tone: colors.blue70, x: 1100, pivot: "hormus" },
    { size: 64, tone: colors.blue20, x: 560, pivot: "brent" },
  ],
  targetRow: 4,
  leadRows: [3, 6],
  side: 4,
  firstCapMid: 16,
  lastCapMid: 1066,
  driftBase: 90,
  driftPerSize: 2.2,
  targetSize: 150,
  targetMaxW: 1600,
  focusX: 960,
  focusY: 540,
  dimTone: colors.blue70,
};

// 9:16 — sixteen rows fill the tall frame. The leads stay fully in frame while
// they are read (the long Hormus headline needs a small row for that); the push
// target ends centred, at most 760 px wide, inside the safe zone x 60–940 /
// y 220–1560. Drift is a touch calmer for the narrow frame.
const PORTRAIT: LayoutSpec = {
  w: 1080,
  h: 1920,
  rows: [
    { size: 42, tone: colors.blue70, x: 380, pivot: "brent" },
    { size: 60, tone: colors.blue20, x: 700, pivot: "hormus" },
    { size: 38, tone: colors.blue70, x: 250, pivot: "brent" },
    { size: 76, tone: colors.white, x: 620, pivot: "hormus" },
    { size: 40, tone: colors.blue70, x: 800, pivot: "brent" },
    { size: 44, tone: colors.blue20, x: 480, pivot: "hormus" },
    { size: 68, tone: colors.white, x: 300, pivot: "brent" },
    { size: 36, tone: colors.blue70, x: 760, pivot: "hormus" },
    { size: 48, tone: colors.blue20, x: 600, pivot: "brent" },
    { size: 40, tone: colors.blue70, x: 280, pivot: "hormus" },
    { size: 76, tone: colors.white, x: 560, pivot: "brent" },
    { size: 56, tone: colors.blue20, x: 820, pivot: "hormus" },
    { size: 38, tone: colors.blue70, x: 330, pivot: "brent" },
    { size: 72, tone: colors.white, x: 640, pivot: "hormus" },
    { size: 42, tone: colors.blue70, x: 210, pivot: "brent" },
    { size: 62, tone: colors.blue20, x: 720, pivot: "hormus" },
  ],
  targetRow: 8,
  leadRows: [5, 10],
  side: 3,
  firstCapMid: 16,
  lastCapMid: 1906,
  driftBase: 70,
  driftPerSize: 1.6,
  targetSize: 112,
  targetMaxW: 760,
  focusX: 540,
  focusY: 930,
  // The portrait push stays small (the target must fit 760 px), so larger
  // rows end up bigger than the target: sink them further to keep the focus.
  dimTone: colors.blue90,
};

// Beats (local frames) — shared by both layouts.
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

/** Unterlinie position under the target, em below the line top. */
const RULE_TOP_EM = BASELINE + 0.33;

const key = (row: number, j: number) => `${row}:${j}`;

/** Derives row positions, appearance frames, drift and focus from a spec. */
const buildLayout = (spec: LayoutSpec) => {
  const { rows, targetRow, side } = spec;

  const caps = rows.map((r) => r.size * CAP);
  const capSum = caps.reduce((a, b) => a + b, 0);
  const rowGap =
    (spec.lastCapMid -
      spec.firstCapMid -
      (capSum - caps[0] / 2 - caps[caps.length - 1] / 2)) /
    (rows.length - 1);
  const rowTops = rows.map((r, i) => {
    const capMid =
      spec.firstCapMid +
      caps
        .slice(0, i)
        .reduce((a, c, k) => a + c / 2 + rowGap + caps[k + 1] / 2, 0);
    return capMid - (BASELINE - CAP / 2) * r.size;
  });

  /** Unterlinie weight in wall px: the 4 px title rule, scaled to the type. */
  const ruleW = (RULE.title * rows[targetRow].size) / TYPE.title;
  /** Focus point: middle between the target's cap top and its rule. */
  const focusEm =
    (BASELINE - CAP + RULE_TOP_EM + ruleW / rows[targetRow].size) / 2;

  // Appearance frame of every headline. Three hand-picked leads open the wall
  // (fully in frame; the third is the later push target, so the camera returns
  // to a headline the viewer has already read). The rest follow in a seeded
  // order (centre of each row first) with the interval shrinking — the news
  // piling up.
  const leads = [
    key(spec.leadRows[0], 0),
    key(spec.leadRows[1], 0),
    key(targetRow, 0),
  ];
  const appear: Record<string, number> = (() => {
    const items: Array<{ id: string; order: number }> = [];
    rows.forEach((_, r) => {
      for (let j = -side; j <= side; j++) {
        const id = key(r, j);
        if (!leads.includes(id)) {
          items.push({
            id,
            order: Math.abs(j) * 0.45 + random(`wand-${id}`) * 0.9,
          });
        }
      }
    });
    items.sort((a, b) => a.order - b.order);
    const out: Record<string, number> = {};
    leads.forEach((id, i) => {
      out[id] = B.leads[i];
    });
    items.forEach(({ id }, rank) => {
      out[id] =
        B.pile +
        (B.pileEnd - B.pile) * Math.pow(rank / (items.length - 1), 0.6);
    });
    return out;
  })();

  /** Horizontal drift of a row: alternating directions, bigger rows further. */
  const driftOf = (row: number, frame: number) => {
    const amp = spec.driftBase + rows[row].size * spec.driftPerSize;
    const dir = row % 2 === 0 ? 1 : -1;
    return (
      interpolate(frame, [0, B.driftEnd], [-amp / 2, amp / 2], {
        ...clamp,
        easing: ease.loop,
      }) * dir
    );
  };

  return { ...spec, rowTops, ruleW, focusEm, appear, driftOf };
};

const LAYOUTS = {
  landscape: buildLayout(LANDSCAPE),
  portrait: buildLayout(PORTRAIT),
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
  const { width, height } = useVideoConfig();
  const L = height > width ? LAYOUTS.portrait : LAYOUTS.landscape;
  const [targetRef, targetWidth] = useMeasuredWidth(brentHeadline);

  const textOf = (row: number, j: number) => {
    const pivotIsBrent = L.rows[row].pivot === "brent";
    const same = Math.abs(j) % 2 === 0;
    return pivotIsBrent === same ? brentHeadline : hormusHeadline;
  };

  // Focus: everything but the target sinks to the layout's dim tone.
  const dim = interpolate(frame, [B.dim, B.dimEnd], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const barColor = interpolateColors(
    frame,
    [B.dim, B.barsDimEnd],
    [colors.red, L.dimTone],
    { easing: ease.move },
  );

  // Camera: scale the wall around the target and carry it to the focus spot.
  const target = L.rows[L.targetRow];
  const endScale = Math.min(
    L.targetSize / target.size,
    targetWidth ? L.targetMaxW / targetWidth : Infinity,
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
  const fx = target.x + L.driftOf(L.targetRow, frame);
  const fy = L.rowTops[L.targetRow] + L.focusEm * target.size;
  const cx = fx + (L.focusX - fx) * push;
  const cy = fy + (L.focusY - fy) * push;

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
          width: L.w,
          height: L.h,
          transformOrigin: "0 0",
          translate: `${cx - scale * fx}px ${cy - scale * fy}px`,
          scale: String(scale),
        }}
      >
        {L.rows.map((row, r) => {
          const gap = row.size * GAP_EM;
          const color = interpolateColors(dim, [0, 1], [row.tone, L.dimTone]);
          const isTarget = r === L.targetRow;
          const item = (j: number) => (
            <Headline
              key={`h${j}`}
              text={textOf(r, j)}
              start={L.appear[key(r, j)]}
              color={color}
            />
          );
          // Bar between headline j and j + 1, once both are there.
          const bar = (j: number) => (
            <Bar
              key={`b${j}`}
              size={row.size}
              start={Math.max(L.appear[key(r, j)], L.appear[key(r, j + 1)]) + 3}
              color={barColor}
            />
          );
          const left: React.ReactNode[] = [];
          for (let j = -L.side; j < 0; j++) {
            left.push(item(j), bar(j));
          }
          const right: React.ReactNode[] = [];
          for (let j = 1; j <= L.side; j++) {
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
              key={r}
              style={{
                position: "absolute",
                left: row.x,
                top: L.rowTops[r],
                translate: `${L.driftOf(r, frame)}px 0`,
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
                  start={L.appear[key(r, 0)]}
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
                    weight={L.ruleW}
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
