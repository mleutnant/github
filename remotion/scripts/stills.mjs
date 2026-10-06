// Self-eval helper: bundle once, render several frames of one composition as a
// contact sheet (plus the single frames) for visual checks.
// Usage: node scripts/stills.mjs <CompositionId> <outDir> <frame> [frame ...]
// Optional: CHROME=/path/to/chrome (defaults to the pre-installed headless shell if present).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [compId, outDirArg, ...frameArgs] = process.argv.slice(2);
if (!compId || !outDirArg || frameArgs.length === 0) {
  console.error("Usage: node scripts/stills.mjs <CompositionId> <outDir> <frame> [frame ...]");
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(outDirArg);
mkdirSync(outDir, { recursive: true });

const headless = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = process.env.CHROME ?? (existsSync(headless) ? headless : null);

const serveUrl = await bundle({
  entryPoint: resolve(root, "src/index.ts"),
  webpackOverride: enableTailwind,
  rspack: true,
});
const composition = await selectComposition({
  serveUrl,
  id: compId,
  browserExecutable,
});

const files = [];
for (const f of frameArgs.map(Number)) {
  const output = resolve(outDir, `${compId}_${String(f).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: f, output, browserExecutable });
  files.push(output);
  console.log(output);
}

// Contact sheet: frames in a grid, 3 per row, with the frame number burned in.
const cols = Math.min(3, files.length);
const rows = Math.ceil(files.length / cols);
const sheet = resolve(outDir, `${compId}_sheet.jpg`);
const inputs = files.flatMap((p) => ["-i", p]);
const labelled = files
  .map(
    (p, i) =>
      `[${i}:v]scale=640:-2,drawbox=x=0:y=0:w=110:h=34:color=black@0.7:t=fill,` +
      `drawtext=text='${frameArgs[i]}':x=8:y=6:fontsize=22:fontcolor=white[v${i}]`,
  )
  .join(";");
const pads = files.length < cols * rows
  ? Array.from({ length: cols * rows - files.length }, (_, k) => `color=c=gray:s=640x360:d=1[e${k}]`).join(";") + ";"
  : "";
const all = [
  ...files.map((_, i) => `[v${i}]`),
  ...Array.from({ length: cols * rows - files.length }, (_, k) => `[e${k}]`),
].join("");
const layout = Array.from({ length: cols * rows }, (_, i) => {
  const c = i % cols;
  const r = Math.floor(i / cols);
  return `${c * 640}_${r * 360}`;
}).join("|");
execFileSync("ffmpeg", [
  "-loglevel", "error", "-y", ...inputs,
  "-filter_complex",
  `${labelled};${pads}${all}xstack=inputs=${cols * rows}:layout=${layout}:fill=gray`,
  "-frames:v", "1", "-q:v", "3", sheet,
]);
console.log(sheet);
