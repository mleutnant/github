import { Easing } from "remotion";

// Default brand (SCHMIDT) — mirrors brand-guidelines/default/tokens/*.css.
// When a project names another brand folder, add a sibling file and swap the import.
export const colors = {
  white: "#ffffff",
  black: "#000000",
  blue: "#123442", // RAL 5008 — surfaces, frames
  red: "#e3002c", // RAL 3020 — Bildmarke, frames
  yellow: "#f6a206", // secondary accent
  // Derived screen tints (brand-guidelines/default/tokens/colors.css)
  blue90: "#24424f",
  blue70: "#4b656f",
  blue20: "#d0d7db",
  grey60: "#6e7478",
} as const;

export const fontFamily = '"Filson Pro", Arial, Helvetica, sans-serif';

// Easings from docs/motion-philosophy.md, expressed as GSAP-equivalent curves.
// Never use linear.
export const ease = {
  /** GSAP power3.out — reveals */
  reveal: Easing.bezier(0.165, 0.84, 0.44, 1),
  /** GSAP sine.inOut — loops, calm recurring motion */
  loop: Easing.bezier(0.445, 0.05, 0.55, 0.95),
  /** GSAP power2.inOut — moves / exits */
  move: Easing.bezier(0.455, 0.03, 0.515, 0.955),
  /** GSAP power3.inOut — panes sliding across the frame */
  slide: Easing.bezier(0.645, 0.045, 0.355, 1),
  /** GSAP expo.out — fast snaps that settle softly (counters, rules) */
  snap: Easing.bezier(0.16, 1, 0.3, 1),
  /** GSAP back.out(1.4) — small accents */
  pop: Easing.bezier(0.175, 0.885, 0.32, 1.275),
} as const;
