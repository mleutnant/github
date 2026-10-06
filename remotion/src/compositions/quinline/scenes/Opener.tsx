// Auftakt — "Heben. Schieben. Öffnen." told literally by a lift-and-slide door.
// Two flat blue sashes cover the frame. They lift (a sliver of daylight shows
// beneath), the right sash slides behind the left one and reveals the view,
// then the door locks by lowering. Finally the red brand frame (Prinzip
// "Rahmen und Fläche") draws itself from the blue field across the photo edge.
// First scene of the video: no pane reveal at the start; the next pane covers
// it at local 90–105, so nothing exits.
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import hero from "../../../../../projects/quinline-vergleich/assets/hero-ausblick.jpg";
import { colors, ease } from "../../../brand/tokens";
import { RiseText, SceneBg, clamp } from "../kit";

const W = 1920;
const H = 1080;
const MID = W / 2;

/** How far the sashes lift before they slide (px). */
const LIFT = 18;
/** Black profiles where the sashes meet: the fixed sash's edge stays as the
 * line between blue field and photo, the sliding sash's edge disappears. */
const SEAM = 12;
const SEAM_SLIDING = 8;
/** Black profile on the sliding sash's outer (trailing) edge, plus its
 * hairline; both start just outside the frame. */
const EDGE = 26;
const SASH_W = MID + EDGE + 4;

// Copy block on the left sash
const TEXT_X = 140;
const WORD_SIZE = 132;
const WORD_TOP = 206;
const WORD_PITCH = 150;
const CAPTION_TOP = 766;

// Red brand frame: one L-shaped stroke from the blue field across the photo edge
const RULE = 10;
const RULE_Y = 868;
const CORNER_X = 1770;
const ARM_TOP = 300;
const GAP_FROM = MID - SEAM / 2 - 30;
const GAP_TO = MID - SEAM / 2 + 30;
const H_LEN = CORNER_X - TEXT_X;
const V_LEN = RULE_Y + RULE - ARM_TOP;

// Beats (local frames; 15 frames = one beat at 120 BPM)
const B = {
  heben: 0,
  schieben: 15,
  oeffnen: 45,
  caption: 52,
  frame: 60,
} as const;

const words = [
  { text: "Heben.", start: B.heben },
  { text: "Schieben.", start: B.schieben },
  { text: "Öffnen.", start: B.oeffnen },
];

const RedFrame: React.FC = () => {
  const frame = useCurrentFrame();
  // One continuous pen stroke: right along the foot, then up the photo.
  const drawn =
    interpolate(frame, [B.frame, B.frame + 24], [0, 1], {
      ...clamp,
      easing: ease.reveal,
    }) *
    (H_LEN + V_LEN);
  if (drawn <= 0) {
    return null;
  }
  const head = TEXT_X + Math.min(drawn, H_LEN);
  const leftSeg = Math.max(0, Math.min(head, GAP_FROM) - TEXT_X);
  const rightSeg = Math.max(0, head - GAP_TO);
  const up = Math.max(0, drawn - H_LEN);
  const bar: React.CSSProperties = {
    position: "absolute",
    backgroundColor: colors.red,
  };
  return (
    <>
      <div
        style={{
          ...bar,
          left: TEXT_X,
          top: RULE_Y,
          width: leftSeg,
          height: RULE,
        }}
      />
      {rightSeg > 0 ? (
        <div
          style={{
            ...bar,
            left: GAP_TO,
            top: RULE_Y,
            // the horizontal arm runs under the corner so the joint is square
            width: Math.min(
              rightSeg + (up > 0 ? RULE : 0),
              CORNER_X + RULE - GAP_TO,
            ),
            height: RULE,
          }}
        />
      ) : null}
      {up > 0 ? (
        <div
          style={{
            ...bar,
            left: CORNER_X,
            top: RULE_Y + RULE - up,
            width: RULE,
            height: up,
          }}
        />
      ) : null}
    </>
  );
};

export const OpenerScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Heben: both sashes lift a little …
  const lift = interpolate(frame, [B.heben + 1, B.heben + 13], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // … and lock by lowering once the sliding sash has arrived.
  const lower = interpolate(frame, [B.oeffnen, B.oeffnen + 8], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const sashY = -LIFT * lift * (1 - lower);

  // Schieben: the right sash travels fully behind the left one.
  const slide = interpolate(frame, [B.schieben, B.oeffnen], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const slideX = -SASH_W * slide;

  // The view settles from a slight push-in for the whole scene.
  const photoScale = interpolate(frame, [0, 105], [1.12, 1], {
    ...clamp,
    easing: ease.loop,
  });

  const captionIn = interpolate(frame, [B.caption, B.caption + 14], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });

  return (
    <SceneBg>
      {/* The view, lying beneath the door */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={hero}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: "75% 50%",
            scale: String(photoScale),
          }}
        />
      </AbsoluteFill>

      {/* Right sash: slides behind the left one */}
      <div
        style={{
          position: "absolute",
          left: MID,
          top: 0,
          width: SASH_W,
          height: H,
          backgroundColor: colors.blue,
          translate: `${slideX}px ${sashY}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SEAM_SLIDING,
            height: H,
            backgroundColor: colors.black,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: EDGE,
            top: 0,
            width: 3,
            height: H,
            backgroundColor: colors.blue70,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: EDGE,
            height: H,
            backgroundColor: colors.black,
          }}
        />
      </div>

      {/* Left sash: fixed, carries the copy */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: MID,
          height: H,
          backgroundColor: colors.blue,
          translate: `0 ${sashY}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: SEAM,
            height: H,
            backgroundColor: colors.black,
          }}
        />
        {words.map((w, i) => (
          <RiseText
            key={w.text}
            progress={interpolate(frame, [w.start, w.start + 14], [0, 1], {
              ...clamp,
              easing: ease.reveal,
            })}
            distance={1.3}
            style={{
              position: "absolute",
              left: TEXT_X,
              top: WORD_TOP + i * WORD_PITCH,
              fontSize: WORD_SIZE,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {w.text}
          </RiseText>
        ))}
        <RiseText
          progress={captionIn}
          style={{
            position: "absolute",
            left: TEXT_X,
            top: CAPTION_TOP,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
          }}
        >
          Hebeschiebetüren von SCHMIDT
        </RiseText>
      </div>

      <RedFrame />
    </SceneBg>
  );
};
