// Hormus — the strait on a map (local 0–179). Revealed by the pane during
// 0–15, covered by the next pane during 165–180, so everything settles by ~150.
//
// A flat brand map (water = blue field, land = blue90) zooms slowly toward the
// Strait of Hormus. The tanker route draws in from the Persian Gulf, stalls at
// the strait while a red open frame marks it, then crawls on into the Gulf of
// Oman. The headline sits in a blue field at the bottom-left.
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import { BORDERS_D, LAND_D, ROUTE, STRAIT } from "../geo";
import type { OelpreisProps } from "../kit";
import {
  RiseText,
  SceneBg,
  TitleRule,
  YellowFoot,
  breakAfterDash,
  clamp,
} from "../kit";

type Pt = readonly [number, number];

// ---------------------------------------------------------------------------
// Camera: the map layer scales about the strait, so the strait stays put on
// screen. Everything that must not scale (labels, marker) is placed with the
// same transform in an unscaled layer.
const ZOOM = 1.7;
const [SX, SY] = STRAIT;
const toScreen = ([x, y]: Pt, k: number): Pt => [
  SX + (x - SX) * k,
  SY + (y - SY) * k,
];

// ---------------------------------------------------------------------------
// Tanker route: cumulative arc lengths (map px) so any prefix can be drawn.
const SEG = ROUTE.slice(1).map((p, i) =>
  Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]),
);
const CUM = SEG.reduce<number[]>(
  (acc, l) => [...acc, acc[acc.length - 1] + l],
  [0],
);
const ROUTE_LEN = CUM[CUM.length - 1];

// Route point closest to the strait (STRAIT itself sits on the Musandam tip,
// ~16 px south of the fairway): the line stalls here and the marker frames it,
// so the route runs through the frame instead of grazing its edge.
const NEAREST = SEG.reduce(
  (best, len, i) => {
    const [ax, ay] = ROUTE[i];
    const [bx, by] = ROUTE[i + 1];
    const t = Math.max(
      0,
      Math.min(
        1,
        ((SX - ax) * (bx - ax) + (SY - ay) * (by - ay)) / (len * len),
      ),
    );
    const at: Pt = [ax + (bx - ax) * t, ay + (by - ay) * t];
    const d = Math.hypot(at[0] - SX, at[1] - SY);
    return d < best.d ? { d, s: CUM[i] + len * t, at } : best;
  },
  { d: Infinity, s: 0, at: STRAIT as Pt },
);
const AT_STRAIT = NEAREST.s;
const MARK_AT = NEAREST.at;

/** The route from its start up to arc length `s`, as an SVG path. */
const routeUpTo = (s: number): string => {
  const pts: Pt[] = [ROUTE[0]];
  for (let i = 1; i < ROUTE.length; i++) {
    if (CUM[i] <= s) {
      pts.push(ROUTE[i]);
      continue;
    }
    const t = (s - CUM[i - 1]) / SEG[i - 1];
    const [ax, ay] = ROUTE[i - 1];
    const [bx, by] = ROUTE[i];
    pts.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    break;
  }
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
};

/** Route dash in map px: ~14/10 on screen while the line holds at the strait. */
const DASH = 11;
const DASH_GAP = 8;

// ---------------------------------------------------------------------------
// Region labels (map px). geo.ts's LABELS suit the full view only; these sit
// inside their region for the whole zoom 1.0 → 1.7, off the route and clear
// of the headline field. "Oman" names the Musandam tip south of the strait.
const REGIONS: Array<{ text: string; at: Pt; delay: number }> = [
  { text: "Iran", at: [1120, 380], delay: 8 },
  { text: "Persischer Golf", at: [620, 470], delay: 12 },
  { text: "Golf von Oman", at: [1520, 775], delay: 16 },
  { text: "Oman", at: [1170, 670], delay: 20 },
];

// Strait marker: a small open frame (the Bildmarke's gap in its top edge).
const MARK = 56;
const MARK_STROKE = 6;
const MARK_GAP = 14;
const LEADER = { gap: 12, length: 44 };

const markerPoints = (() => {
  const h = MARK_STROKE / 2;
  const x0 = h;
  const x1 = MARK - h;
  const gx = x0 + (x1 - x0) * 0.68;
  const pts: Pt[] = [
    [gx + MARK_GAP / 2, x0],
    [x1, x0],
    [x1, x1],
    [x0, x1],
    [x0, x0],
    [gx - MARK_GAP / 2, x0],
  ];
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
})();

// Headline field (bottom-left).
const PANEL = { bottom: 90, width: 1080, padX: 64, padY: 44 };

export const HormusScene: React.FC<OelpreisProps> = ({ hormusHeadline }) => {
  const frame = useCurrentFrame();
  const p = (start: number, end: number, easing: (t: number) => number) =>
    interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

  // f0–150: slow push-in toward the strait.
  const k = interpolate(frame, [0, 150], [1, ZOOM], {
    ...clamp,
    easing: ease.slide,
    output: "perceptual-scale",
  });
  // f14–70: route draws in and decelerates into the strait; f70–90 it stalls;
  // f90–140: it creeps on into the Gulf of Oman.
  const routeS = interpolate(
    frame,
    [14, 70, 90, 140],
    [0, AT_STRAIT, AT_STRAIT, ROUTE_LEN],
    { ...clamp, easing: [ease.reveal, ease.loop, ease.move] },
  );
  // f30–58: headline field slides in from the left, title and rules follow.
  const panelIn = p(30, 58, ease.reveal);
  const footIn = p(40, 62, ease.snap);
  const titleIn = p(38, 58, ease.reveal);
  const ruleIn = p(48, 64, ease.snap);
  // f56–70: strait marker pops in; f70–110 it breathes while the route stalls
  // and restarts. Leader and label follow it out.
  const markerPop = interpolate(frame, [56, 70], [0.4, 1], {
    ...clamp,
    easing: ease.pop,
  });
  const markerFade = p(56, 62, ease.reveal);
  const breathe = interpolate(
    frame,
    [70, 80, 90, 100, 110],
    [1, 1.06, 1, 1.06, 1],
    { ...clamp, easing: ease.loop },
  );
  const leaderIn = p(64, 74, ease.snap);
  const strLabelIn = p(68, 84, ease.reveal);
  // Marker, leader and name ride on the map transform (unscaled).
  const [mx, my] = toScreen(MARK_AT, k);

  return (
    <SceneBg>
      {/* Map: one layer, scaled about the strait. Strokes stay hairline-thin;
          dash patterns are given in screen px × k so they stay fixed to the
          map instead of crawling while the camera zooms. */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <g style={{ scale: String(k), transformOrigin: `${SX}px ${SY}px` }}>
          <path
            d={LAND_D}
            fill={colors.blue90}
            stroke={colors.blue70}
            strokeWidth={1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={BORDERS_D}
            fill="none"
            stroke={colors.blue70}
            strokeWidth={1.5}
            strokeDasharray={`${6 * k} ${5 * k}`}
            vectorEffect="non-scaling-stroke"
          />
          {routeS > 0 ? (
            <path
              d={routeUpTo(routeS)}
              fill="none"
              stroke={colors.white}
              strokeWidth={4}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeDasharray={`${DASH * k} ${DASH_GAP * k}`}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </g>
      </svg>

      {/* Region labels: unscaled, riding on the map transform. */}
      {REGIONS.map(({ text, at, delay }) => {
        const [x, y] = toScreen(at, k);
        const inP = p(delay, delay + 18, ease.reveal);
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: "0.06em",
                color: colors.blue20,
                whiteSpace: "nowrap",
                opacity: inP,
                translate: `0 ${(1 - inP) * 14}px`,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}

      {/* Strait marker: red open frame around the fairway at the strait. */}
      <div
        style={{
          position: "absolute",
          left: mx - MARK / 2,
          top: my - MARK / 2,
          width: MARK,
          height: MARK,
          opacity: markerFade,
          scale: String(markerPop * breathe),
        }}
      >
        <svg width={MARK} height={MARK} style={{ overflow: "visible" }}>
          <polyline
            points={markerPoints}
            fill="none"
            stroke={colors.red}
            strokeWidth={MARK_STROKE}
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
        </svg>
      </div>

      {/* Leader + name, to the right of the marker over the Iranian coast. */}
      <div
        style={{
          position: "absolute",
          left: mx + MARK / 2 + LEADER.gap,
          top: my - 1.5,
          width: LEADER.length * leaderIn,
          height: 3,
          backgroundColor: colors.white,
        }}
      />
      <RiseText
        progress={strLabelIn}
        style={{
          position: "absolute",
          left: mx + MARK / 2 + LEADER.gap + LEADER.length + 14,
          top: my - (38 * 1.15) / 2,
          fontSize: 38,
        }}
      >
        <div
          style={{ fontWeight: 700, lineHeight: 1.15, whiteSpace: "nowrap" }}
        >
          Straße von Hormus
        </div>
      </RiseText>

      {/* Headline field: slides in from the left, closes with the yellow foot. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: PANEL.bottom,
          width: PANEL.width,
          boxSizing: "border-box",
          padding: `${PANEL.padY}px ${PANEL.padX}px ${PANEL.padY + 8}px`,
          backgroundColor: colors.blue,
          translate: `${(panelIn - 1) * 100}% 0`,
        }}
      >
        <RiseText progress={titleIn} style={{ fontSize: 70 }}>
          <div
            style={{
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {breakAfterDash(hormusHeadline).map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </RiseText>
        <TitleRule progress={ruleIn} width={120} style={{ marginTop: 18 }} />
        <YellowFoot progress={footIn} />
      </div>
    </SceneBg>
  );
};
