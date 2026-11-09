// Abschluss — end card, the last scene of the film (local 0–104). Revealed by
// the pane during 0–15; nothing covers it at the end, so frame 104 is the
// final image.
//
// Brand "Prinzip Rahmen und Fläche": a large red open frame around both
// headlines and the date, and — like the Bildmarke — a second pane behind it,
// offset down-right and sharing the frame's bottom edge. Only the part of that
// pane outside the frame shows: a bracket that slides out from behind the
// frame, its stroke broken where it passes behind the first.
//
// One component, two layouts: 16:9 (wide frame, title on one line) and 9:16
// (tall frame inside the social safe zone, title in two balanced lines).
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
  RiseText,
  SceneBg,
  TYPE,
  TitleRule,
  YellowFoot,
  breakAfterDash,
  clamp,
  splitBalanced,
  type OelpreisProps,
} from "../kit";

// ---------------------------------------------------------------------------
// Layouts. Frame geometry is in screen px, outer edges: a = open frame,
// b = pane behind it (only its top and right edge matter, it shares a's
// bottom edge).
type Layout = {
  a: { left: number; top: number; right: number; bottom: number };
  b: { top: number; right: number };
  /** Left edge of the text block (vertically centred in frame a). */
  textLeft: number;
  /** Widest a text line may run before it is split or set smaller. */
  textMaxW: number;
  /** Set the title in two balanced lines. */
  twoLineTitle: boolean;
  type: { title: number; subtitle: number; side: number };
  rule: { width: number; above: number; below: number };
  standGap: number;
};

const LANDSCAPE: Layout = {
  a: { left: 190, top: 180, right: 1570, bottom: 880 },
  b: { top: 310, right: 1730 },
  textLeft: 400,
  textMaxW: Infinity,
  twoLineTitle: false,
  type: { title: TYPE.title, subtitle: TYPE.subtitle, side: TYPE.side },
  rule: { width: 200, above: 18, below: 34 },
  standGap: 30,
};

// 9:16: text stays inside x 60–940 / y 220–1560 (Reels/TikTok UI); the frame
// and bracket keep equal 80 px side margins, centred a little above the middle.
const PORTRAIT: Layout = {
  a: { left: 80, top: 420, right: 880, bottom: 1420 },
  b: { top: 590, right: 1000 },
  textLeft: 180,
  textMaxW: 650,
  twoLineTitle: true,
  type: { title: 116, subtitle: 60, side: 32 },
  rule: { width: 240, above: 22, below: 42 },
  standGap: 38,
};

const STROKE = 10;
const GAP = 30;
const H = STROKE / 2;

/**
 * The detached bracket of pane b (the Bildmarke's small "]"): top arm, right
 * side, bottom arm on a's bottom line. It is cut off one gap right of frame
 * a's outer edge and slides out over `travel` px from behind it.
 */
const bracketOf = ({ a, b }: Layout) => {
  const cut = a.right + GAP;
  return {
    cut,
    travel: b.right - cut,
    points: [
      [cut, b.top + H],
      [b.right - H, b.top + H],
      [b.right - H, a.bottom - H],
      [cut, a.bottom - H],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(" "),
  };
};

const BRACKET = {
  landscape: bracketOf(LANDSCAPE),
  portrait: bracketOf(PORTRAIT),
};

// ---------------------------------------------------------------------------
// Line fitting (only bites in the narrow portrait column).

/** Generous average Filson Pro glyph width in em, for a width estimate. */
const CHAR_EM = 0.55;
const estWidth = (line: string, size: number) => line.length * CHAR_EM * size;

/** Font size at which the longest line fits `maxW` (never above `size`). */
const fitSize = (lines: string[], size: number, maxW: number) =>
  Math.min(size, ...lines.map((l) => maxW / (l.length * CHAR_EM)));

/**
 * Splits a line at the most balanced word gap that does not leave a short
 * word ("von", "im", a number) dangling at a line end, so names like
 * "Straße von Hormus" stay together.
 */
const splitLine = (text: string): string[] => {
  const words = text.trim().split(/ +/);
  if (words.length < 2) {
    return [text];
  }
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const head = words.slice(0, i).join(" ");
    const tail = words.slice(i).join(" ");
    const dangling = /^[\p{Ll}\d]{1,3}$/u.test(words[i - 1]);
    const score = Math.abs(head.length - tail.length) + (dangling ? 1000 : 0);
    if (score < bestScore) {
      best = i;
      bestScore = score;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

// ---------------------------------------------------------------------------

export const AbschlussScene: React.FC<OelpreisProps> = ({
  brentHeadline,
  hormusHeadline,
  stand,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const L = portrait ? PORTRAIT : LANDSCAPE;
  const bracket = portrait ? BRACKET.portrait : BRACKET.landscape;

  const p = (start: number, end: number, easing: (t: number) => number) =>
    interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

  const titleLines = L.twoLineTitle
    ? splitBalanced(brentHeadline)
    : [brentHeadline];
  const titleSize = fitSize(titleLines, L.type.title, L.textMaxW);
  const hormusLines = breakAfterDash(hormusHeadline).flatMap((line) =>
    estWidth(line, L.type.subtitle) > L.textMaxW ? splitLine(line) : [line],
  );
  const subtitleSize = fitSize(hormusLines, L.type.subtitle, L.textMaxW);

  // f8–45: frame A draws itself as one line, starting at its top gap.
  const frameDraw = p(8, 45, ease.reveal);
  // f10–46: title, red Unterlinie, the lines of the cause and the date rise
  // out of their masks in a stagger. The cause's lines share the 16:9
  // window (first line from f22, last line from f27) however many there are.
  const titleIn = (i: number) => p(10 + i * 3, 28 + i * 3, ease.reveal);
  const ruleIn = p(20, 36, ease.snap);
  const hormusStep = hormusLines.length > 1 ? 5 / (hormusLines.length - 1) : 0;
  const hormusIn = (i: number) =>
    p(22 + i * hormusStep, 40 + i * hormusStep, ease.reveal);
  const standIn = p(32, 50, ease.reveal);
  // f28–52: the rear pane's bracket slides out from behind the frame like a
  // sash and stops on its gap.
  const bracketOut = p(28, 52, ease.slide);
  // f40–70: yellow foot closes the blue field.
  const footIn = p(40, 70, ease.move);
  // f40–104: the card lifts by 4 px and settles on the last frame.
  const lift = interpolate(frame, [40, 104], [0, -4], {
    ...clamp,
    easing: ease.loop,
  });

  const { a } = L;

  return (
    <SceneBg>
      <AbsoluteFill style={{ translate: `0 ${lift}px` }}>
        <OpenFrame
          left={a.left}
          top={a.top}
          width={a.right - a.left}
          height={a.bottom - a.top}
          progress={frameDraw}
          gap={GAP}
          stroke={STROKE}
        />

        {/* Bracket: clipped at the cut so it appears from behind frame A */}
        <div
          style={{
            position: "absolute",
            left: bracket.cut,
            top: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        >
          <svg
            width={width}
            height={height}
            style={{
              position: "absolute",
              left: -bracket.cut,
              top: 0,
              translate: `${-(1 - bracketOut) * bracket.travel}px 0`,
            }}
          >
            <polyline
              points={bracket.points}
              fill="none"
              stroke={colors.red}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: L.textLeft,
            top: a.top,
            height: a.bottom - a.top,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            whiteSpace: "nowrap",
          }}
        >
          {titleLines.map((line, i) => (
            <RiseText
              key={i}
              progress={titleIn(i)}
              // Cancel the mask's descender padding between the lines.
              style={{
                fontSize: titleSize,
                marginTop: i === 0 ? 0 : "-0.12em",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                {line}
              </div>
            </RiseText>
          ))}

          <TitleRule
            progress={ruleIn}
            width={L.rule.width}
            style={{ marginTop: L.rule.above, marginBottom: L.rule.below }}
          />

          {hormusLines.map((line, i) => (
            <RiseText
              key={i}
              progress={hormusIn(i)}
              // Cancel the mask's descender padding between the lines.
              style={{
                fontSize: subtitleSize,
                marginTop: i === 0 ? 0 : "-0.12em",
              }}
            >
              <div style={{ fontWeight: 500, lineHeight: 1.15 }}>{line}</div>
            </RiseText>
          ))}

          <RiseText
            progress={standIn}
            style={{ fontSize: L.type.side, marginTop: L.standGap }}
          >
            <div style={{ fontWeight: 400, lineHeight: 1.3, opacity: 0.9 }}>
              {stand}
            </div>
          </RiseText>
        </div>
      </AbsoluteFill>

      <YellowFoot progress={footIn} />
    </SceneBg>
  );
};
