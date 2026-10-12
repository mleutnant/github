// Title: the overlay draws the huge "74" and "84" counters (they later shrink
// into the column headers). This scene adds the frame around them: kicker,
// mullion between the two systems and the subline.
import { interpolate, useCurrentFrame } from "remotion";
import { colors, ease } from "../../../brand/tokens";
import { GRID, RiseText, SceneBg, clamp } from "../kit";

export const TitelScene: React.FC = () => {
  const frame = useCurrentFrame();

  const kicker = interpolate(frame, [4, 20], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  const rule = interpolate(frame, [10, 30], [0, 1], {
    ...clamp,
    easing: ease.snap,
  });
  const mullion = interpolate(frame, [6, 36], [0, 1], {
    ...clamp,
    easing: ease.slide,
  });
  const subline = interpolate(frame, [30, 48], [0, 1], {
    ...clamp,
    easing: ease.reveal,
  });
  // Kicker and subline make room before the numbers shrink into the header row.
  const leave = interpolate(frame, [56, 70], [0, 1], {
    ...clamp,
    easing: ease.move,
  });
  // Slow drift keeps the held frame alive.
  const drift = interpolate(frame, [0, 90], [0, -10], {
    ...clamp,
    easing: ease.loop,
  });

  return (
    <SceneBg>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          translate: `0 ${drift - leave * 40}px`,
          opacity: 1 - leave,
        }}
      >
        <RiseText progress={kicker}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Systemunterschiede
          </div>
        </RiseText>
        <div
          style={{
            margin: "18px auto 0",
            width: 96 * rule,
            height: 4,
            backgroundColor: colors.yellow,
          }}
        />
      </div>

      {/* Mullion: the meeting stile between the two sashes */}
      <div
        style={{
          position: "absolute",
          left: GRID.center - 3,
          top: 300,
          width: 6,
          height: 470 * mullion * (1 - leave),
          backgroundColor: colors.white,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 836,
          width: "100%",
          textAlign: "center",
          translate: `0 ${leave * 40}px`,
          opacity: 1 - leave,
        }}
      >
        <RiseText progress={subline}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>
            Zwei Systeme im direkten Vergleich
          </div>
        </RiseText>
      </div>
    </SceneBg>
  );
};
