// Persistent layer above all scenes (absolute frames):
// - column headers "QuinLine® / 74 | 84": huge in the title scene, then they
//   shrink into the header row and stay there until the outro
// - SCHMIDT logo top left during the comparison
// - yellow progress rule along the foot of the frame
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors, ease } from "../../brand/tokens";
import { GRID, QuinLine, clamp } from "./kit";
import { QL_DURATION, SCENE_START, TRANSITION } from "./timing";

const T = SCENE_START;
const COUNT_FROM = T.titel + 6;
const COUNT_TO = T.titel + 36;
const SHRINK_FROM = T.groesse - 12;
const SHRINK_TO = T.groesse + TRANSITION + 2;
const HIDE_FROM = T.outro;
const HIDE_TO = T.outro + 14;

const ColumnHeader: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const small = interpolate(frame, [SHRINK_FROM, SHRINK_TO], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const hide = interpolate(frame, [HIDE_FROM, HIDE_TO], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  const count = interpolate(frame, [COUNT_FROM, COUNT_TO], [0, system], {
    ...clamp,
    easing: ease.snap,
  });
  const x = system === 74 ? GRID.col74 : GRID.col84;

  const wordSize = interpolate(small, [0, 1], [76, 30]);
  const wordTop = interpolate(small, [0, 1], [300, GRID.headerTop + 8]);
  const numSize = interpolate(small, [0, 1], [400, 92]);
  const numTop = interpolate(small, [0, 1], [372, GRID.headerTop + 40]);

  if (hide === 1) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x - 400,
        width: 800,
        top: 0,
        textAlign: "center",
        color: colors.white,
        opacity: 1 - hide,
        translate: `0 ${-hide * 40}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: wordTop,
          fontSize: wordSize,
          fontWeight: small > 0.5 ? 500 : 700,
          lineHeight: 1,
        }}
      >
        <QuinLine />
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: numTop,
          fontSize: numSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(Math.round(count)).padStart(2, "0")}
      </div>
    </div>
  );
};

const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = interpolate(
    frame,
    [T.groesse + 6, T.groesse + TRANSITION + 12],
    [0, 1],
    { ...clamp, easing: ease.reveal },
  );
  const outP = interpolate(frame, [HIDE_FROM, HIDE_TO], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  if (inP === 0 || outP === 1) {
    return null;
  }
  return (
    <Img
      src={staticFile("brand/logo-schmidt-negative.svg")}
      style={{
        position: "absolute",
        // The SVG has generous padding; the visible mark starts at ~(80, 52).
        left: 50,
        top: 22,
        height: 90,
        opacity: inP * (1 - outP),
        translate: `${(1 - inP) * -30}px 0`,
      }}
    />
  );
};

// Progress rule: jumps forward with every pane slide (eased, never linear).
const cuts = Object.values(SCENE_START);
const ProgressRule: React.FC = () => {
  const frame = useCurrentFrame();
  const input = cuts.flatMap((c) => [c, c + TRANSITION]);
  const output = cuts.flatMap((c, i) => [
    i === 0 ? 0 : cuts[i] / QL_DURATION,
    (cuts[i + 1] ?? QL_DURATION) / QL_DURATION,
  ]);
  const p = interpolate(frame, input, output, {
    ...clamp,
    easing: ease.slide,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: 1920 * p,
        backgroundColor: colors.yellow,
      }}
    />
  );
};

// The headers are painted onto the title scene's sash: while it slides in they
// share its clip edge and parallax (see paneSlide.tsx).
const Headers: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.titel) {
    return null;
  }
  const p = interpolate(frame, [T.titel, T.titel + TRANSITION], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const edge = (1 - p) * (1920 + 26);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge}px)` }}>
      <AbsoluteFill style={{ translate: `${(1 - p) * 320}px 0` }}>
        <ColumnHeader system={74} />
        <ColumnHeader system={84} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Overlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Headers />
    <Logo />
    <ProgressRule />
  </AbsoluteFill>
);
