// Hormus — the strait on a map (local 0–179). Revealed by the pane during
// 0–15, covered by the next pane during 165–180, so everything settles by ~150.
//
// A flat brand map (water = blue field, land = blue90) zooms slowly toward the
// Strait of Hormus. The tanker route draws in from the Persian Gulf, stalls at
// the strait while a red open frame marks it, then crawls on into the Gulf of
// Oman. The headline sits in a blue field at the bottom-left (16:9) or low
// across the frame (9:16).
//
// One component, two layouts: the composition's aspect picks LANDSCAPE
// (1920×1080, geo.ts) or PORTRAIT (1080×1920, geoPortrait.ts). Timing and
// animation beats are shared.
import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  BORDERS_D as LAND_BORDERS_D,
  LAND_D as LAND_LAND_D,
  ROUTE as LAND_ROUTE,
  STRAIT as LAND_STRAIT,
} from "../geo";
import {
  BORDERS_D as PORT_BORDERS_D,
  LAND_D as PORT_LAND_D,
  ROUTE as PORT_ROUTE,
  STRAIT as PORT_STRAIT,
} from "../geoPortrait";
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

type Geo = {
  land: string;
  borders: string;
  route: ReadonlyArray<Pt>;
  strait: Pt;
};

// ---------------------------------------------------------------------------
// Map data per layout: route arc lengths and the strait point on the route.
const makeMap = ({ land, borders, route, strait }: Geo) => {
  const [SX, SY] = strait;

  // Tanker route: cumulative arc lengths (map px) so any prefix can be drawn.
  const SEG = route
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]));
  const CUM = SEG.reduce<number[]>(
    (acc, l) => [...acc, acc[acc.length - 1] + l],
    [0],
  );
  const ROUTE_LEN = CUM[CUM.length - 1];

  // Route point closest to the strait (STRAIT itself sits on the Musandam
  // tip, ~14–16 px south of the fairway): the line stalls here and the marker
  // frames it, so the route runs through the frame instead of grazing its edge.
  const NEAREST = SEG.reduce(
    (best, len, i) => {
      const [ax, ay] = route[i];
      const [bx, by] = route[i + 1];
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
    { d: Infinity, s: 0, at: strait },
  );

  /** The route from its start up to arc length `s`, as an SVG path. */
  const routeUpTo = (s: number): string => {
    const pts: Pt[] = [route[0]];
    for (let i = 1; i < route.length; i++) {
      if (CUM[i] <= s) {
        pts.push(route[i]);
        continue;
      }
      const t = (s - CUM[i - 1]) / SEG[i - 1];
      const [ax, ay] = route[i - 1];
      const [bx, by] = route[i];
      pts.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
      break;
    }
    return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  };

  // Camera: the map layer scales about the strait, so the strait stays put
  // on screen. Everything that must not scale (labels, marker) is placed
  // with the same transform in an unscaled layer.
  const toScreen = ([x, y]: Pt, k: number): Pt => [
    SX + (x - SX) * k,
    SY + (y - SY) * k,
  ];

  return {
    land,
    borders,
    SX,
    SY,
    ROUTE_LEN,
    AT_STRAIT: NEAREST.s,
    MARK_AT: NEAREST.at,
    routeUpTo,
    toScreen,
  };
};

// ---------------------------------------------------------------------------
// Shared constants (both layouts).
const ZOOM = 1.7;

/** Route dash in map px: ~14/10 on screen while the line holds at the strait. */
const DASH = 11;
const DASH_GAP = 8;

// Strait marker: a small open frame (the Bildmarke's gap in its top edge).
const MARK = 56;
const MARK_STROKE = 6;
const MARK_GAP = 14;
const MARK_GAP_AT = 0.68;
const LEADER = { gap: 12, length: 44 };
const STRAIT_LABEL = 38;

const markerPoints = (() => {
  const h = MARK_STROKE / 2;
  const x0 = h;
  const x1 = MARK - h;
  const gx = x0 + (x1 - x0) * MARK_GAP_AT;
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

type Region = { text: string; at: Pt; delay: number };

/** Leader line and strait-name position for the marker at screen (mx, my). */
type StraitPlacement = (
  mx: number,
  my: number,
  leaderIn: number,
) => {
  leader: { left: number; top: number; width: number; height: number };
  label: React.CSSProperties;
};

type Layout = {
  map: ReturnType<typeof makeMap>;
  frame: { width: number; height: number };
  regions: Region[];
  regionSize: number;
  strait: StraitPlacement;
  panel: {
    bottom: number;
    width: number;
    padX: number;
    padY: number;
    title: number;
  };
};

// ---------------------------------------------------------------------------
// 16:9 — map from geo.ts, name right of the marker, headline bottom-left.
const LANDSCAPE: Layout = {
  map: makeMap({
    land: LAND_LAND_D,
    borders: LAND_BORDERS_D,
    route: LAND_ROUTE,
    strait: LAND_STRAIT,
  }),
  frame: { width: 1920, height: 1080 },
  // Region labels (map px). geo.ts's LABELS suit the full view only; these
  // sit inside their region for the whole zoom 1.0 → 1.7, off the route and
  // clear of the headline field. "Oman" names the Musandam tip south of the
  // strait.
  regions: [
    { text: "Iran", at: [1120, 380], delay: 8 },
    { text: "Persischer Golf", at: [620, 470], delay: 12 },
    { text: "Golf von Oman", at: [1520, 775], delay: 16 },
    { text: "Oman", at: [1170, 670], delay: 20 },
  ],
  regionSize: 26,
  // Leader + name, to the right of the marker over the Iranian coast.
  strait: (mx, my, leaderIn) => ({
    leader: {
      left: mx + MARK / 2 + LEADER.gap,
      top: my - 1.5,
      width: LEADER.length * leaderIn,
      height: 3,
    },
    label: {
      position: "absolute",
      left: mx + MARK / 2 + LEADER.gap + LEADER.length + 14,
      top: my - (STRAIT_LABEL * 1.15) / 2,
      fontSize: STRAIT_LABEL,
    },
  }),
  // Headline field (bottom-left).
  panel: { bottom: 90, width: 1080, padX: 64, padY: 44, title: 70 },
};

// ---------------------------------------------------------------------------
// 9:16 — map from geoPortrait.ts (strait at 535/760). Right of the marker the
// name would pass the social safe edge (x 940), left of it lies the incoming
// route, so the name stands above the marker on the Iranian coast, its leader
// rising out of the frame's gap. Text stays inside x 60–940 / y 220–1560.
const PORTRAIT_LEADER = 90;
/** Box height of the name: Bold 115 % plus RiseText's 0.12em foot padding. */
const STRAIT_LABEL_BOX = STRAIT_LABEL * (1.15 + 0.12);

const PORTRAIT: Layout = {
  map: makeMap({
    land: PORT_LAND_D,
    borders: PORT_BORDERS_D,
    route: PORT_ROUTE,
    strait: PORT_STRAIT,
  }),
  frame: { width: 1080, height: 1920 },
  // Own anchors (map px) so every name stays inside the safe zone and above
  // the headline field for the whole zoom 1.0 → 1.7 (screen x = 535 +
  // (x − 535)·k, y = 760 + (y − 760)·k).
  regions: [
    { text: "Iran", at: [700, 480], delay: 8 },
    { text: "Persischer Golf", at: [350, 840], delay: 12 },
    { text: "Golf von Oman", at: [703, 1010], delay: 16 },
    { text: "Oman", at: [490, 905], delay: 20 },
  ],
  regionSize: 26,
  strait: (mx, my, leaderIn) => {
    // Leader rises from the centre of the marker's top-edge gap.
    const h = MARK_STROKE / 2;
    const lx = mx - MARK / 2 + h + (MARK - 2 * h) * MARK_GAP_AT;
    const leaderBottom = my - MARK / 2 - LEADER.gap;
    const leaderTop = leaderBottom - PORTRAIT_LEADER;
    return {
      leader: {
        left: lx - 1.5,
        top: leaderBottom - PORTRAIT_LEADER * leaderIn,
        width: 3,
        height: PORTRAIT_LEADER * leaderIn,
      },
      label: {
        position: "absolute",
        left: lx,
        top: leaderTop - 4 - STRAIT_LABEL_BOX,
        translate: "-50% 0",
        fontSize: STRAIT_LABEL,
      },
    };
  },
  // Headline field: full width, low in the frame, foot at y 1560.
  panel: { bottom: 360, width: 1080, padX: 64, padY: 44, title: 62 },
};

export const HormusScene: React.FC<OelpreisProps> = ({ hormusHeadline }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = height > width ? PORTRAIT : LANDSCAPE;
  const { SX, SY, AT_STRAIT, ROUTE_LEN, MARK_AT, routeUpTo, toScreen } =
    L.map;
  const PANEL = L.panel;

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
  const strait = L.strait(mx, my, leaderIn);

  return (
    <SceneBg>
      {/* Map: one layer, scaled about the strait. Strokes stay hairline-thin;
          dash patterns are given in screen px × k so they stay fixed to the
          map instead of crawling while the camera zooms. */}
      <svg
        width={L.frame.width}
        height={L.frame.height}
        viewBox={`0 0 ${L.frame.width} ${L.frame.height}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <g style={{ scale: String(k), transformOrigin: `${SX}px ${SY}px` }}>
          <path
            d={L.map.land}
            fill={colors.blue90}
            stroke={colors.blue70}
            strokeWidth={1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={L.map.borders}
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
      {L.regions.map(({ text, at, delay }) => {
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
                fontSize: L.regionSize,
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

      {/* Leader + name (right of the marker in 16:9, above it in 9:16). */}
      <div
        style={{
          position: "absolute",
          ...strait.leader,
          backgroundColor: colors.white,
        }}
      />
      <RiseText progress={strLabelIn} style={strait.label}>
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
        <RiseText progress={titleIn} style={{ fontSize: PANEL.title }}>
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
