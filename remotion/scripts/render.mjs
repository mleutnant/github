// Usage: npm run render -- <CompositionId> <project-name> [file-name] [extra remotion flags]
// Writes to ../projects/<project-name>/renders/<file-name> (CLAUDE.md output rule).
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [compId, project, fileName, ...extra] = process.argv.slice(2);
if (!compId || !project) {
  console.error("Usage: npm run render -- <CompositionId> <project-name> [file-name] [flags]");
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "..", "projects", project, "renders");
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, fileName ?? `${compId}.mp4`);

const result = spawnSync(
  "npx",
  ["remotion", "render", "src/index.ts", compId, out, ...extra],
  { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
);
process.exit(result.status ?? 1);
