import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const weights = [
  ["Regular", "400"],
  ["Medium", "500"],
  ["Bold", "700"],
  ["Black", "900"],
] as const;

// Remotion waits for these before rendering a frame, so text never flashes in a fallback font.
export const fontsLoaded = Promise.all(
  weights.map(([name, weight]) =>
    loadFont({
      family: "Filson Pro",
      url: staticFile(`brand/fonts/FilsonPro${name}.otf`),
      weight,
    }),
  ),
);
