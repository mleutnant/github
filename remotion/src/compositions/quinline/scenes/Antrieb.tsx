// Elektrischer Antrieb — the QuinLine® 84's exclusive feature, staged as the
// last data moment before the outro. Both columns show the same schematic
// two-part lift-and-slide door (front elevation, Schema A). Only the 84 door
// moves: it lifts, slides open by itself, pauses, slides back and lowers into
// its seat. The 74 door stays a static, inactive drawing.
//
// Beats (local frames, 15 per beat):
//   f15 sash lifts · f18–42 slides open · f30 "eVOMATIC®" rises
//   f45 chip + yellow frame · f50–70 slides back · f75 sash lowers (locks)
import type React from "react";
import {
  interpolate,
  useCurrentFrame,
  type EasingFunction,
} from "remotion";
import { colors, ease } from "../../../brand/tokens";
import {
  CategoryLabel,
  Chip,
  Divider,
  QuinLine,
  RiseText,
  SceneBg,
  clamp,
  colX,
} from "../kit";

// ---------------------------------------------------------------------------
// Timing (local frames)
// ---------------------------------------------------------------------------
const DRAW_84 = 3; // door drawing starts (84 is revealed first by the pane)
const DRAW_74 = 6;
const LIFT_AT = [15, 20] as const; // beat: sash lifts off its seat
const OPEN_AT = [18, 42] as const; // slides open
const WORD_AT = 28; // beat 30: wordmark letters rise
const CAPTION_AT = [30, 46] as const; // 74 caption, mirrored row
const CHIP_AT = [45, 53] as const; // beat: chip snaps in
const RAHMEN_AT = 45; // yellow frame draws from its corner
const CLOSE_AT = [50, 70] as const; // slides back
const LOCK_AT = [70, 75] as const; // beat 75: lowers into its seat

// ---------------------------------------------------------------------------
// Door geometry (px)
// ---------------------------------------------------------------------------
const DOOR_W = 480;
const DOOR_H = 330;
const DOOR_TOP = 376;
const FRAME = 8; // Blendrahmen line (white)
const PROFILE = 18; // sash profile (black)
const INNER_W = DOOR_W - 2 * FRAME;
const SASH_W = INNER_W / 2; // the two sashes meet in the middle
const SASH_H = DOOR_H - 2 * FRAME;
const LIFT = FRAME; // lifted sash tucks exactly under the head
const TRAVEL = INNER_W - SASH_W; // fully open: sash covers the fixed pane
const HAIR = 2; // inactive drawing line weight
const KEYLINE = 3; // break in the stroke that separates the sliding sash

// Prinzip Rahmen: open L frame at the top-left corner of the 84 door, the
// side where the opening appears
const RAHMEN_GAP = 22;
const RAHMEN_W = 8;
const RAHMEN_H_ARM = Math.round((DOOR_W + 30) * 0.5 + 30);
const RAHMEN_V_ARM = Math.round((DOOR_H + 30) * 0.55 + 30);

// Text rows below the door
const ROW_TOP = 750;
const ROW_H = 104;
const CHIP_TOP = 880;

const useP = (start: number, end: number, easing: EasingFunction) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, end], [0, 1], { ...clamp, easing });
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  ...style,
});

// ---------------------------------------------------------------------------
// Door drawing
// ---------------------------------------------------------------------------

/** One frame line set: sill grows from the centre, jambs rise, head closes. */
const FrameLines: React.FC<{
  from: number;
  weight: number;
  color: string;
}> = ({ from, weight, color }) => {
  const sill = useP(from, from + 7, ease.snap);
  const jambs = useP(from + 2, from + 9, ease.reveal);
  const head = useP(from + 5, from + 11, ease.reveal);
  const half = DOOR_W / 2;
  return (
    <>
      <div
        style={abs({
          left: half * (1 - sill),
          top: DOOR_H - weight,
          width: DOOR_W * sill,
          height: weight,
          backgroundColor: color,
        })}
      />
      {[0, DOOR_W - weight].map((left) => (
        <div
          key={left}
          style={abs({
            left,
            top: DOOR_H * (1 - jambs),
            width: weight,
            height: DOOR_H * jambs,
            backgroundColor: color,
          })}
        />
      ))}
      <div
        style={abs({
          left: 0,
          top: 0,
          width: half * head,
          height: weight,
          backgroundColor: color,
        })}
      />
      <div
        style={abs({
          left: DOOR_W - half * head,
          top: 0,
          width: half * head,
          height: weight,
          backgroundColor: color,
        })}
      />
    </>
  );
};

/** A sash: black profile + blue90 glass (active) or hairline outline (inactive). */
const Sash: React.FC<{
  left: number;
  top: number;
  active: boolean;
  reveal: number;
}> = ({ left, top, active, reveal }) => (
  <div
    style={abs({
      left,
      top,
      width: SASH_W,
      height: SASH_H,
      boxSizing: "border-box",
      backgroundColor: active ? colors.black : colors.blue,
      border: active ? undefined : `${HAIR}px solid ${colors.blue70}`,
      clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`,
    })}
  >
    <div
      style={abs({
        left: active ? PROFILE : PROFILE - HAIR,
        top: active ? PROFILE : PROFILE - HAIR,
        right: active ? PROFILE : PROFILE - HAIR,
        bottom: active ? PROFILE : PROFILE - HAIR,
        boxSizing: "border-box",
        backgroundColor: active ? colors.blue90 : "transparent",
        border: active ? undefined : `${HAIR}px solid ${colors.blue70}`,
      })}
    />
  </div>
);

const Door: React.FC<{
  system: 74 | 84;
  from: number;
  slide?: number;
  lift?: number;
}> = ({ system, from, slide = 0, lift = 0 }) => {
  const active = system === 84;
  const glazing = useP(from + 3, from + 10, ease.reveal);
  return (
    <div
      style={abs({
        left: colX(system) - DOOR_W / 2,
        top: DOOR_TOP,
        width: DOOR_W,
        height: DOOR_H,
      })}
    >
      {/* Fixed pane (right), then the sliding sash in front of it (left) */}
      <Sash
        left={DOOR_W - FRAME - SASH_W}
        top={FRAME}
        active={active}
        reveal={glazing}
      />
      {/* Keyline: a break in the stroke between the two overlapping sashes */}
      <div
        style={abs({
          left: FRAME + slide * TRAVEL - KEYLINE,
          top: FRAME - lift * LIFT - KEYLINE,
          width: SASH_W + 2 * KEYLINE,
          height: SASH_H + 2 * KEYLINE,
          backgroundColor: colors.blue,
          clipPath: `inset(${(1 - glazing) * 100}% 0 0 0)`,
        })}
      />
      <Sash
        left={FRAME + slide * TRAVEL}
        top={FRAME - lift * LIFT}
        active={active}
        reveal={glazing}
      />
      {/* Frame on top: the lifted sash tucks under the head */}
      <FrameLines
        from={from}
        weight={active ? FRAME : HAIR}
        color={active ? colors.white : colors.blue70}
      />
    </div>
  );
};

/** Prinzip Rahmen: open L frame offset from the door's top-left corner. */
const Rahmen: React.FC = () => {
  const h = useP(RAHMEN_AT, RAHMEN_AT + 14, ease.snap);
  const v = useP(RAHMEN_AT + 2, RAHMEN_AT + 16, ease.snap);
  const cornerX = colX(84) - DOOR_W / 2 - RAHMEN_GAP - RAHMEN_W;
  const cornerY = DOOR_TOP - RAHMEN_GAP - RAHMEN_W;
  if (h === 0) {
    return null;
  }
  return (
    <>
      <div
        style={abs({
          left: cornerX,
          top: cornerY,
          width: RAHMEN_H_ARM * h,
          height: RAHMEN_W,
          backgroundColor: colors.yellow,
        })}
      />
      <div
        style={abs({
          left: cornerX,
          top: cornerY,
          width: RAHMEN_W,
          height: RAHMEN_V_ARM * v,
          backgroundColor: colors.yellow,
        })}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

/** "eVOMATIC®": letters rise one after another out of a mask. */
const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const letters = "eVOMATIC".split("");
  const rise = (i: number) =>
    interpolate(frame, [WORD_AT + i, WORD_AT + i + 14], [0, 1], {
      ...clamp,
      easing: ease.reveal,
    });
  return (
    <div
      style={{
        overflow: "hidden",
        paddingTop: 6,
        paddingBottom: 14,
        fontSize: 92,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {letters.map((l, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            translate: `0 ${(1 - rise(i)) * 120}%`,
          }}
        >
          {l}
        </span>
      ))}
      <span
        style={{
          display: "inline-block",
          fontSize: 32,
          marginLeft: 4,
          verticalAlign: 40,
          translate: `0 ${(1 - rise(letters.length)) * 360}%`,
        }}
      >
        ®
      </span>
    </div>
  );
};

const Row: React.FC<{ system: 74 | 84; children: React.ReactNode }> = ({
  system,
  children,
}) => (
  <div
    style={abs({
      left: colX(system) - 360,
      width: 720,
      top: ROW_TOP,
      height: ROW_H,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    })}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export const AntriebScene: React.FC = () => {
  const lift = useP(LIFT_AT[0], LIFT_AT[1], ease.move);
  const lower = useP(LOCK_AT[0], LOCK_AT[1], ease.move);
  const open = useP(OPEN_AT[0], OPEN_AT[1], ease.slide);
  const close = useP(CLOSE_AT[0], CLOSE_AT[1], ease.slide);
  const caption = useP(CAPTION_AT[0], CAPTION_AT[1], ease.reveal);
  const chip = useP(CHIP_AT[0], CHIP_AT[1], ease.snap);

  return (
    <SceneBg>
      <CategoryLabel icon="tablet-handy" title="Elektrischer Antrieb" />
      <Divider />

      {/* QuinLine® 74 — same door, static and inactive */}
      <Door system={74} from={DRAW_74} />
      <Row system={74}>
        <RiseText progress={caption}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.15,
              color: colors.blue20,
              whiteSpace: "nowrap",
            }}
          >
            nicht verfügbar
          </div>
        </RiseText>
      </Row>

      {/* QuinLine® 84 — the door opens and closes by itself */}
      <Rahmen />
      <Door
        system={84}
        from={DRAW_84}
        slide={open * (1 - close)}
        lift={lift * (1 - lower)}
      />
      <Row system={84}>
        <Wordmark />
      </Row>
      <div
        style={abs({
          left: colX(84) - 360,
          width: 720,
          top: CHIP_TOP,
          textAlign: "center",
        })}
      >
        <Chip
          progress={chip}
          style={{ fontSize: 30, translate: `${(1 - chip) * -16}px 0` }}
        >
          nur bei <QuinLine n={84} />
        </Chip>
      </div>
    </SceneBg>
  );
};
