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

const ColumnHeader: React.FC<{ system: 74 | 84 }> = ({ system }) => {
  const frame = useCurrentFrame();
  const small = interpolate(frame, [SHRINK_FROM, SHRINK_TO], [0, 1], {
    ...clamp,
    easing: ease.slide,
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

  return (
    <div
      style={{
        position: "absolute",
        left: x - 400,
        width: 800,
        top: 0,
        textAlign: "center",
        color: colors.white,
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
  if (inP === 0) {
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
        opacity: inP,
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

// Headers and logo are painted onto the comparison "sashes": they ride in on
// the title scene's pane and ride out with the last data scene when the outro
// pane covers it — same clip edge and parallax as paneSlide.tsx.
const PROFILE = 26;
const Riding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  if (frame < T.titel || frame >= T.outro + TRANSITION) {
    return null;
  }
  const pIn = interpolate(frame, [T.titel, T.titel + TRANSITION], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const pOut = interpolate(frame, [T.outro, T.outro + TRANSITION], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const inEdge = (1 - pIn) * (1920 + PROFILE);
  const outEdge = (1 - pOut) * (1920 + PROFILE) - PROFILE;
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(0 ${1920 - outEdge}px 0 ${inEdge}px)`,
      }}
    >
      <AbsoluteFill
        style={{ translate: `${(1 - pIn) * 320 - pOut * 260}px 0` }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Overlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Riding>
      <ColumnHeader system={74} />
      <ColumnHeader system={84} />
      <Logo />
    </Riding>
    <ProgressRule />
  </AbsoluteFill>
);
