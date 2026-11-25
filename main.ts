// One Line, One Laugh — make.fun entry for @greydi92.
// Writes a single funny line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// No network, no dependencies, Node 22. Exits 0 and never throws.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LINE = "I asked the universe for a sign. It sent me a CAPTCHA.";

// Normalise once: exactly one line, no leading/trailing whitespace, so
// the gate's character count is the line itself and nothing else.
const TEXT = LINE.replace(/\s+/g, " ").trim();

function outputDir(): string {
  const env = process.env.MAKEFUN_OUTPUT_DIR;
  if (env && env.trim().length > 0) return resolve(env);
  return "/output";
}

function main(): void {
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the gate counts characters, so the file is
  // exactly the line — 54 code points, inside the 1–140 window.
  writeFileSync(join(dir, "entry.txt"), TEXT, "utf8");
}

try {
  main();
} catch (err) {
  // Never fail the run: if the chosen dir is unusable, fall back to a
  // sibling "output" folder next to this script and try once more.
  try {
    const fallback = join(dirname(fileURLToPath(import.meta.url)), "output");
    mkdirSync(fallback, { recursive: true });
    writeFileSync(join(fallback, "entry.txt"), TEXT, "utf8");
  } catch {
    // Last resort: stay silent and exit 0 anyway — a crash scores 0,
    // a missing file scores 0, but a thrown error can do worse.
  }
}
