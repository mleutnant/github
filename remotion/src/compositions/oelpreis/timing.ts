// Ölpreis / Straße von Hormus — headline wall, 18,5 s @ 30 fps,
// 1920×1080 (16:9) and 1080×1920 (9:16, same timing, own layouts).
// Same scene grid as the QuinLine® film: scenes overlap by one pane-slide
// transition (TRANSITION frames) and every scene starts on a 15-frame beat.

export const OP_FPS = 30;
export const OP_WIDTH = 1920;
export const OP_HEIGHT = 1080;
export const OP_DURATION = 555;

/** Pane-slide transition between scenes. */
export const TRANSITION = 15;

/**
 * Absolute frame where each scene starts sliding in. The scene is fully
 * visible TRANSITION frames later and stays until the next pane has covered it.
 */
export const SCENE_START = {
  wand: 0,
  brent: 150,
  hormus: 285,
  abschluss: 450,
} as const;

export type SceneKey = keyof typeof SCENE_START;
const order = Object.keys(SCENE_START) as SceneKey[];

/** Sequence length incl. the overlap with the next scene's transition. */
export const sceneDuration = (key: SceneKey): number => {
  const i = order.indexOf(key);
  const next = order[i + 1];
  return next
    ? SCENE_START[next] - SCENE_START[key] + TRANSITION
    : OP_DURATION - SCENE_START[key];
};

export const SCENE_DURATION = Object.fromEntries(
  order.map((k) => [k, sceneDuration(k)]),
) as Record<SceneKey, number>;
