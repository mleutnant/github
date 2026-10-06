// QuinLine® 74 vs. QuinLine® 84 — 30 s showreel comparing both
// lift-and-slide door systems. Data: SCHMIDT "Systemunterschiede" table.
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { colors, ease, fontFamily } from "../../brand/tokens";
import { Overlay } from "./Overlay";
import { paneSlide } from "./paneSlide";
import { AntriebScene } from "./scenes/Antrieb";
import { BautiefeScene } from "./scenes/Bautiefe";
import { GlasScene } from "./scenes/Glas";
import { GroesseScene } from "./scenes/Groesse";
import { OpenerScene } from "./scenes/Opener";
import { OutroScene } from "./scenes/Outro";
import { SchwellenScene } from "./scenes/Schwellen";
import { TitelScene } from "./scenes/Titel";
import { TypenScene } from "./scenes/Typen";
import { WaermeScene } from "./scenes/Waerme";
import { SCENE_DURATION, TRANSITION } from "./timing";

const timing = linearTiming({ durationInFrames: TRANSITION, easing: ease.slide });

export const QuinLineVergleich: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.blue, fontFamily }}>
      <TransitionSeries name="Szenen">
        <TransitionSeries.Sequence
          name="Auftakt"
          durationInFrames={SCENE_DURATION.opener}
          premountFor={fps}
        >
          <OpenerScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Titel"
          durationInFrames={SCENE_DURATION.titel}
          premountFor={fps}
        >
          <TitelScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Größe"
          durationInFrames={SCENE_DURATION.groesse}
          premountFor={fps}
        >
          <GroesseScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Bautiefe"
          durationInFrames={SCENE_DURATION.bautiefe}
          premountFor={fps}
        >
          <BautiefeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Verglasung"
          durationInFrames={SCENE_DURATION.glas}
          premountFor={fps}
        >
          <GlasScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Typen"
          durationInFrames={SCENE_DURATION.typen}
          premountFor={fps}
        >
          <TypenScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Schwellen"
          durationInFrames={SCENE_DURATION.schwellen}
          premountFor={fps}
        >
          <SchwellenScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Wärmedämmung"
          durationInFrames={SCENE_DURATION.waerme}
          premountFor={fps}
        >
          <WaermeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Antrieb"
          durationInFrames={SCENE_DURATION.antrieb}
          premountFor={fps}
        >
          <AntriebScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paneSlide()} timing={timing} />
        <TransitionSeries.Sequence
          name="Abschluss"
          durationInFrames={SCENE_DURATION.outro}
          premountFor={fps}
        >
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Overlay />
      <Audio src={staticFile("quinline/soundtrack.wav")} name="Soundtrack" />
    </AbsoluteFill>
  );
};
