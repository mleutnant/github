// Ölpreis / Straße von Hormus — 18,5 s headline wall in SCHMIDT design.
// Two headlines (props) carry the film: a wall built from both, the price,
// the strait on a map, and an end card with both headlines.
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { colors, ease, fontFamily } from "../../brand/tokens";
import { paneSlide } from "../quinline/paneSlide";
import type { OelpreisProps } from "./kit";
import { AbschlussScene } from "./scenes/Abschluss";
import { BrentScene } from "./scenes/Brent";
import { HormusScene } from "./scenes/Hormus";
import { WandScene } from "./scenes/Wand";
import { SCENE_DURATION, TRANSITION } from "./timing";

const timing = linearTiming({ durationInFrames: TRANSITION, easing: ease.slide });

export const Oelpreis: React.FC<OelpreisProps> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.blue, fontFamily }}>
      <TransitionSeries name="Szenen">
        <TransitionSeries.Sequence
          name="Wand"
          durationInFrames={SCENE_DURATION.wand}
          premountFor={fps}
        >
          <WandScene {...props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Brent"
          durationInFrames={SCENE_DURATION.brent}
          premountFor={fps}
        >
          <BrentScene {...props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Hormus"
          durationInFrames={SCENE_DURATION.hormus}
          premountFor={fps}
        >
          <HormusScene {...props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Abschluss"
          durationInFrames={SCENE_DURATION.abschluss}
          premountFor={fps}
        >
          <AbschlussScene {...props} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
