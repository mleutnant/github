// Scene transition modelled on a lift-and-slide door: the next scene glides in
// from the right like a sash, led by a dark profile edge, while the old scene
// drifts left behind it.
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { colors } from "../../brand/tokens";

type PaneSlideProps = Record<string, never>;

const W = 1920;
const PROFILE = 26;

const PaneSlidePresentation: React.FC<
  TransitionPresentationComponentProps<PaneSlideProps>
> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ translate: `${-p * 260}px 0` }}>
        {children}
      </AbsoluteFill>
    );
  }

  const edge = (1 - p) * (W + PROFILE);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge}px)` }}>
        <AbsoluteFill style={{ translate: `${(1 - p) * 320}px 0` }}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
      {p < 1 ? (
        <>
          {/* Sash profile: black frame with a thin highlight on the glass side */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: edge - PROFILE,
              width: PROFILE,
              backgroundColor: colors.black,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: edge,
              width: 3,
              backgroundColor: colors.blue70,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const paneSlide = (): TransitionPresentation<PaneSlideProps> => ({
  component: PaneSlidePresentation,
  props: {},
});
