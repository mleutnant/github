import "./index.css";
import { Composition, Folder, delayRender, continueRender } from "remotion";
import { fontsLoaded } from "./brand/fonts";
import { BrandIntro, brandIntroSchema } from "./compositions/BrandIntro";
import {
  HISTORIE_DURATION,
  HISTORIE_FPS,
  SchmidtHistorie,
} from "./compositions/SchmidtHistorie";
import { OELPREIS_DEFAULTS, oelpreisSchema } from "./compositions/oelpreis/kit";
import { Oelpreis } from "./compositions/oelpreis/Oelpreis";
import { AbschlussScene } from "./compositions/oelpreis/scenes/Abschluss";
import { BrentScene } from "./compositions/oelpreis/scenes/Brent";
import { HormusScene } from "./compositions/oelpreis/scenes/Hormus";
import { WandScene } from "./compositions/oelpreis/scenes/Wand";
import {
  OP_DURATION,
  OP_FPS,
  OP_HEIGHT,
  OP_WIDTH,
  SCENE_DURATION as OP_SCENE_DURATION,
} from "./compositions/oelpreis/timing";
import { QuinLineVergleich } from "./compositions/quinline/QuinLineVergleich";
import { AntriebScene } from "./compositions/quinline/scenes/Antrieb";
import { BautiefeScene } from "./compositions/quinline/scenes/Bautiefe";
import { GlasScene } from "./compositions/quinline/scenes/Glas";
import { GroesseScene } from "./compositions/quinline/scenes/Groesse";
import { OpenerScene } from "./compositions/quinline/scenes/Opener";
import { OutroScene } from "./compositions/quinline/scenes/Outro";
import { SchwellenScene } from "./compositions/quinline/scenes/Schwellen";
import { TitelScene } from "./compositions/quinline/scenes/Titel";
import { TypenScene } from "./compositions/quinline/scenes/Typen";
import { WaermeScene } from "./compositions/quinline/scenes/Waerme";
import {
  QL_DURATION,
  QL_FPS,
  QL_HEIGHT,
  QL_WIDTH,
  SCENE_DURATION,
} from "./compositions/quinline/timing";

const handle = delayRender("Loading brand fonts");
fontsLoaded.then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandIntro"
        component={BrandIntro}
        schema={brandIntroSchema}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "QuinLine® 84",
          subline: "Bis zu 7 m Breite aus einem Guss",
        }}
      />
      <Composition
        id="SchmidtHistorie"
        component={SchmidtHistorie}
        durationInFrames={HISTORIE_DURATION}
        fps={HISTORIE_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="SchmidtHistorie-9x16"
        component={SchmidtHistorie}
        durationInFrames={HISTORIE_DURATION}
        fps={HISTORIE_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="QuinLineVergleich"
        component={QuinLineVergleich}
        durationInFrames={QL_DURATION}
        fps={QL_FPS}
        width={QL_WIDTH}
        height={QL_HEIGHT}
      />
      <Folder name="QuinLine-Szenen">
        <Composition
          id="QL-Auftakt"
          component={OpenerScene}
          durationInFrames={SCENE_DURATION.opener}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Titel"
          component={TitelScene}
          durationInFrames={SCENE_DURATION.titel}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Groesse"
          component={GroesseScene}
          durationInFrames={SCENE_DURATION.groesse}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Bautiefe"
          component={BautiefeScene}
          durationInFrames={SCENE_DURATION.bautiefe}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Verglasung"
          component={GlasScene}
          durationInFrames={SCENE_DURATION.glas}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Typen"
          component={TypenScene}
          durationInFrames={SCENE_DURATION.typen}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Schwellen"
          component={SchwellenScene}
          durationInFrames={SCENE_DURATION.schwellen}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Waermedaemmung"
          component={WaermeScene}
          durationInFrames={SCENE_DURATION.waerme}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Antrieb"
          component={AntriebScene}
          durationInFrames={SCENE_DURATION.antrieb}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
        <Composition
          id="QL-Abschluss"
          component={OutroScene}
          durationInFrames={SCENE_DURATION.outro}
          fps={QL_FPS}
          width={QL_WIDTH}
          height={QL_HEIGHT}
        />
      </Folder>
      <Composition
        id="Oelpreis-Hormus"
        component={Oelpreis}
        schema={oelpreisSchema}
        durationInFrames={OP_DURATION}
        fps={OP_FPS}
        width={OP_WIDTH}
        height={OP_HEIGHT}
        defaultProps={OELPREIS_DEFAULTS}
      />
      <Folder name="Oelpreis-Szenen">
        <Composition
          id="OP-Wand"
          component={WandScene}
          schema={oelpreisSchema}
          durationInFrames={OP_SCENE_DURATION.wand}
          fps={OP_FPS}
          width={OP_WIDTH}
          height={OP_HEIGHT}
          defaultProps={OELPREIS_DEFAULTS}
        />
        <Composition
          id="OP-Brent"
          component={BrentScene}
          schema={oelpreisSchema}
          durationInFrames={OP_SCENE_DURATION.brent}
          fps={OP_FPS}
          width={OP_WIDTH}
          height={OP_HEIGHT}
          defaultProps={OELPREIS_DEFAULTS}
        />
        <Composition
          id="OP-Hormus"
          component={HormusScene}
          schema={oelpreisSchema}
          durationInFrames={OP_SCENE_DURATION.hormus}
          fps={OP_FPS}
          width={OP_WIDTH}
          height={OP_HEIGHT}
          defaultProps={OELPREIS_DEFAULTS}
        />
        <Composition
          id="OP-Abschluss"
          component={AbschlussScene}
          schema={oelpreisSchema}
          durationInFrames={OP_SCENE_DURATION.abschluss}
          fps={OP_FPS}
          width={OP_WIDTH}
          height={OP_HEIGHT}
          defaultProps={OELPREIS_DEFAULTS}
        />
      </Folder>
    </>
  );
};
