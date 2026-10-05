import "./index.css";
import { Composition, delayRender, continueRender } from "remotion";
import { fontsLoaded } from "./brand/fonts";
import { BrandIntro, brandIntroSchema } from "./compositions/BrandIntro";

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
    </>
  );
};
