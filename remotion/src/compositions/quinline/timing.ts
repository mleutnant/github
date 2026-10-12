// QuinLine® 74 vs. 84 — 30 s @ 30 fps, 1920×1080.
// Beat grid: 120 BPM → one beat every 15 frames. Every scene starts on a beat.
// Keep in sync with projects/quinline-vergleich/audio/make_soundtrack.py.

export const QL_FPS = 30;
export const QL_WIDTH = 1920;
export const QL_HEIGHT = 1080;
export const QL_DURATION = 900;
export const BEAT = 15;

/** Pane-slide transition between scenes: exactly one beat. */
export const TRANSITION = 15;

/**
 * Absolute frame where each scene starts sliding in. The scene is fully
 * visible TRANSITION frames later and stays until the next pane has covered it.
 */
export const SCENE_START = {
  opener: 0,
  titel: 90,
  groesse: 165,
  bautiefe: 270,
  glas: 375,
  typen: 450,
  schwellen: 525,
  waerme: 645,
  antrieb: 735,
  outro: 810,
} as const;

export type SceneKey = keyof typeof SCENE_START;
const order = Object.keys(SCENE_START) as SceneKey[];

/** Sequence length incl. the overlap with the next scene's transition. */
export const sceneDuration = (key: SceneKey): number => {
  const i = order.indexOf(key);
  const next = order[i + 1];
  return next
    ? SCENE_START[next] - SCENE_START[key] + TRANSITION
    : QL_DURATION - SCENE_START[key];
};

export const SCENE_DURATION = Object.fromEntries(
  order.map((k) => [k, sceneDuration(k)]),
) as Record<SceneKey, number>;
