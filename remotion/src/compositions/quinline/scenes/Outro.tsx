// Outro / end card — the last scene of the video (local 0–89). Revealed by the
// pane during 0–15; nothing covers it at the end, so frame 89 is the final image.
//
// Brand "Prinzip Rahmen und Fläche": the Bildmarke's construction redrawn as a
// large, thin red line — an open frame with a second pane offset down-right
// behind it, the stroke broken wherever the two cross. Inside the overlap:
// SCHMIDT logo, claim, both systems, URL.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import { QuinLine, RiseText, SceneBg, clamp } from "../kit";

// ---------------------------------------------------------------------------
// Frame geometry (screen px, outer edges). A = open frame, B = pane behind it.
// Both share the bottom edge, exactly like the two parts of the Bildmarke.
const STROKE = 10;
const GAP = 26;
const A = { left: 310, top: 190, right: 1430 };
const B = { left: 490, top: 290, right: 1610 };
const BOTTOM = 850;
const H = STROKE / 2;

type Pt = readonly [number, number];

// One continuous line (the Bildmarke's large polygon): starts on B's top edge
// just before it passes behind A, runs left, down B's left edge, along the
// shared bottom, up A's right side, across A's top, down A's left side, and
// stops at the gap next to B's corner.
const MAIN: Pt[] = [
  [A.right - STROKE - GAP, B.top + H],
  [B.left + H, B.top + H],
  [B.left + H, BOTTOM - H],
  [A.right - H, BOTTOM - H],
  [A.right - H, A.top + H],
  [A.left + H, A.top + H],
  [A.left + H, BOTTOM - H],
  [B.left - GAP, BOTTOM - H],
];

// The detached bracket of pane B outside frame A (the Bildmarke's small "]").
const BRACKET: Pt[] = [
  [A.right + GAP, B.top + H],
  [B.right - H, B.top + H],
  [B.right - H, BOTTOM - H],
  [A.right + GAP, BOTTOM - H],
];

/** How far the bracket travels while sliding shut (px). */
const BRACKET_TRAVEL = 120;

const toD = (pts: Pt[]) =>
  pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

const lengthOf = (pts: Pt[]) =>
  pts.reduce(
    (sum, [x, y], i) =>
      i === 0 ? 0 : sum + Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]),
    0,
  );

/** Red stroke that draws itself along its path (butt ends, sharp corners). */
const Stroke: React.FC<{ points: Pt[]; progress: number }> = ({
  points,
  progress,
}) => {
  if (progress <= 0) {
    return null;
  }
  const length = lengthOf(points);
  return (
    <path
      d={toD(points)}
      fill="none"
      stroke={colors.red}
      strokeWidth={STROKE}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      strokeDasharray={`${length} ${length}`}
      strokeDashoffset={length * (1 - progress)}
    />
  );
};

// ---------------------------------------------------------------------------
// Content layout. The logo SVG is heavily padded: the visible mark spans only
// these units of its 522 × 187.87 viewBox.
const LOGO_VB = { w: 522, h: 187.87 };
const MARK = { x0: 62.62, x1: 459.42, y0: 62.62, y1: 126.07 };
const LOGO_VISIBLE_W = 700;
const LOGO_K = LOGO_VISIBLE_W / (MARK.x1 - MARK.x0);
const CX = (A.right + B.left) / 2; // centre of the overlap = 960
const LOGO_CY = 438;
const CLAIM_TOP = 539;
const LINE_TOP = 652;
const URL_TOP = 721;
const SEP_GAP = 28; // half the space between the two names, bar in the middle

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = (start: number, end: number, easing: (t: number) => number) =>
    interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

  // f6–30: the frame draws itself as one line. The bracket (pane B outside
  // the frame) draws on while sliding shut from the right like a sash and
  // locks into its gap on the beat at f30.
  const mainDraw = p(6, 30, ease.reveal);
  const bracketDraw = p(13, 25, ease.snap);
  const bracketShut = p(12, 30, ease.slide);
  // f15–35: logo rises in.
  const logoIn = p(15, 35, ease.reveal);
  const logoFade = p(15, 29, ease.reveal);
  // f30–45: claim rises out of its mask.
  const claimIn = p(30, 45, ease.reveal);
  // f45: separator snaps open, the two system names slide out from behind it
  // like two sashes (f45–57).
  const barIn = p(45, 53, ease.snap);
  const namesIn = p(45, 57, ease.slide);
  // f54–66: URL.
  const urlIn = p(54, 66, ease.reveal);
  // f36–89: extremely slow push-in (0.6 %) that settles on the last frame.
  const breathe = interpolate(frame, [36, 89], [1, 1.006], {
    ...clamp,
    easing: ease.loop,
  });

  return (
    <SceneBg>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Stroke points={MAIN} progress={mainDraw} />
        <g transform={`translate(${(1 - bracketShut) * BRACKET_TRAVEL} 0)`}>
          <Stroke points={BRACKET} progress={bracketDraw} />
        </g>
      </svg>

      <AbsoluteFill
        style={{
          scale: String(breathe),
          transformOrigin: `${CX}px ${(LOGO_CY + URL_TOP + 38) / 2}px`,
        }}
      >
        <Img
          src={staticFile("brand/logo-schmidt-negative.svg")}
          style={{
            position: "absolute",
            width: LOGO_VB.w * LOGO_K,
            height: LOGO_VB.h * LOGO_K,
            left: CX - ((MARK.x0 + MARK.x1) / 2) * LOGO_K,
            top: LOGO_CY - ((MARK.y0 + MARK.y1) / 2) * LOGO_K,
            opacity: logoFade,
            translate: `0 ${(1 - logoIn) * 40}px`,
          }}
        />

        <RiseText
          progress={claimIn}
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: CLAIM_TOP,
            fontSize: 68,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Grenzenlos Wohnen.
          </div>
        </RiseText>

        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: LINE_TOP,
            height: 48,
            fontSize: 36,
            fontWeight: 500,
            lineHeight: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 1920 - (CX - SEP_GAP),
              top: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ translate: `${(1 - namesIn) * 105}% 0` }}>
              <QuinLine n={74} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: CX - 1.5,
              top: 13,
              width: 3,
              height: 40,
              backgroundColor: colors.white,
              scale: `1 ${barIn}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: CX + SEP_GAP,
              top: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ translate: `${-(1 - namesIn) * 105}% 0` }}>
              <QuinLine n={84} />
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: URL_TOP,
            textAlign: "center",
            fontSize: 32,
            fontWeight: 500,
            lineHeight: "38px",
            color: colors.blue20,
            opacity: urlIn,
            translate: `0 ${(1 - urlIn) * 16}px`,
          }}
        >
          schmidt-boke.de
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};
