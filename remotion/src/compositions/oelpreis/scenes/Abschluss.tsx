// Abschluss — end card, the last scene of the film (local 0–104). Revealed by
// the pane during 0–15; nothing covers it at the end, so frame 104 is the
// final image.
//
// Brand "Prinzip Rahmen und Fläche": a large red open frame around both
// headlines and the date, and — like the Bildmarke — a second pane behind it,
// offset down-right and sharing the frame's bottom edge. Only the part of that
// pane outside the frame shows: a bracket that slides out from behind the
// frame, its stroke broken where it passes behind the first.
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  OpenFrame,
  RiseText,
  SceneBg,
  TYPE,
  TitleRule,
  YellowFoot,
  clamp,
  type OelpreisProps,
} from "../kit";

// ---------------------------------------------------------------------------
// Frame geometry (screen px, outer edges). A = open frame, B = pane behind it.
const STROKE = 10;
const GAP = 30;
const H = STROKE / 2;
const A = { left: 190, top: 180, right: 1570, bottom: 880 };
const B = { top: 310, right: 1730 };
/** The bracket is cut off one gap right of frame A's outer edge. */
const CUT = A.right + GAP;
/** How far the bracket travels while sliding out from behind A (px). */
const BRACKET_TRAVEL = B.right - CUT;

// The detached bracket of pane B (the Bildmarke's small "]"): top arm, right
// side, bottom arm on A's bottom line.
const BRACKET = [
  [CUT, B.top + H],
  [B.right - H, B.top + H],
  [B.right - H, A.bottom - H],
  [CUT, A.bottom - H],
]
  .map(([x, y]) => `${x},${y}`)
  .join(" ");

// ---------------------------------------------------------------------------
// Text block: left-aligned, vertically centred in frame A.
const TEXT_LEFT = 400;
const RULE_W = 200;

/**
 * Sets a headline as two deliberate lines after its dash
 * ("A – B" → ["A –", "B"]); without a dash it stays on one line.
 */
const breakAfterDash = (text: string): string[] => {
  const m = text.match(/^(.+?\s[–—-])\s+(.+)$/);
  return m ? [m[1], m[2]] : [text];
};

export const AbschlussScene: React.FC<OelpreisProps> = ({
  brentHeadline,
  hormusHeadline,
  stand,
}) => {
  const frame = useCurrentFrame();
  const p = (start: number, end: number, easing: (t: number) => number) =>
    interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

  // f8–45: frame A draws itself as one line, starting at its top gap.
  const frameDraw = p(8, 45, ease.reveal);
  // f10–46: title, red Unterlinie, both lines of the cause and the date rise
  // out of their masks in a stagger.
  const titleIn = p(10, 28, ease.reveal);
  const ruleIn = p(20, 36, ease.snap);
  const hormusIn = (i: number) => p(22 + i * 5, 40 + i * 5, ease.reveal);
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

  const hormusLines = breakAfterDash(hormusHeadline);

  return (
    <SceneBg>
      <AbsoluteFill style={{ translate: `0 ${lift}px` }}>
        <OpenFrame
          left={A.left}
          top={A.top}
          width={A.right - A.left}
          height={A.bottom - A.top}
          progress={frameDraw}
          gap={GAP}
          stroke={STROKE}
        />

        {/* Bracket: clipped at the cut so it appears from behind frame A */}
        <div
          style={{
            position: "absolute",
            left: CUT,
            top: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        >
          <svg
            width={1920}
            height={1080}
            style={{
              position: "absolute",
              left: -CUT,
              top: 0,
              translate: `${-(1 - bracketOut) * BRACKET_TRAVEL}px 0`,
            }}
          >
            <polyline
              points={BRACKET}
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
            left: TEXT_LEFT,
            top: A.top,
            height: A.bottom - A.top,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            whiteSpace: "nowrap",
          }}
        >
          <RiseText progress={titleIn} style={{ fontSize: TYPE.title }}>
            <div
              style={{
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {brentHeadline}
            </div>
          </RiseText>

          <TitleRule
            progress={ruleIn}
            width={RULE_W}
            style={{ marginTop: 18, marginBottom: 34 }}
          />

          {hormusLines.map((line, i) => (
            <RiseText
              key={i}
              progress={hormusIn(i)}
              // Cancel the mask's descender padding between the two lines.
              style={{
                fontSize: TYPE.subtitle,
                marginTop: i === 0 ? 0 : "-0.12em",
              }}
            >
              <div style={{ fontWeight: 500, lineHeight: 1.15 }}>{line}</div>
            </RiseText>
          ))}

          <RiseText
            progress={standIn}
            style={{ fontSize: TYPE.side, marginTop: 30 }}
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
