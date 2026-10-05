import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { colors, ease, fontFamily } from "../brand/tokens";

export const brandIntroSchema = z.object({
  headline: z.string(),
  subline: z.string(),
});

// Starter composition: shows the brand tokens, fonts and easings working together.
// Copy it as a template for new scenes.
export const BrandIntro: React.FC<z.infer<typeof brandIntroSchema>> = ({
  headline,
  subline,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const frameIn = interpolate(frame, [0, 24], [0, 1], {
    easing: ease.reveal,
    extrapolateRight: "clamp",
  });
  const logo = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const headlineIn = interpolate(frame, [20, 44], [0, 1], {
    easing: ease.reveal,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sublineIn = interpolate(frame, [32, 56], [0, 1], {
    easing: ease.reveal,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5),
    [-1, 1],
    [-6, 6],
    { easing: ease.loop },
  );
  const out = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { easing: ease.move, extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.blue, fontFamily, opacity: out }}
    >
      {/* Red frame — layout principle from the brand guideline */}
      <div
        style={{
          position: "absolute",
          inset: 64,
          border: `8px solid ${colors.red}`,
          clipPath: `inset(0 ${(1 - frameIn) * 100}% 0 0)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 160px",
          gap: 32,
          transform: `translateY(${drift}px)`,
        }}
      >
        <Img
          src={staticFile("brand/logo-schmidt-negative.svg")}
          style={{
            width: 360,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 30}px)`,
          }}
        />
        <div
          style={{
            color: colors.white,
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.05,
            opacity: headlineIn,
            transform: `translateY(${(1 - headlineIn) * 40}px)`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            color: colors.yellow,
            fontSize: 44,
            fontWeight: 500,
            opacity: sublineIn,
            transform: `translateY(${(1 - sublineIn) * 24}px)`,
          }}
        >
          {subline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
