import { readdirSync, readFileSync, writeFileSync } from "node:fs";

import { compileMath } from "@ga/content-math";

import { audit, type Outline, parseOutline, renderReport } from "./audit.ts";

// The report goes to the path given as the first argument, or to standard output:
// `pnpm nx run audit:audit -- /tmp/audit.md`.
const outlineDir = new URL("../../../docs/math-courses/", import.meta.url);
const outlines = new Map<string, Outline>();
for (const file of readdirSync(outlineDir).filter((f) => f.endsWith(".md"))) {
  outlines.set(file.replace(/\.md$/, ""), parseOutline(readFileSync(new URL(file, outlineDir), "utf8")));
}
const report = audit(compileMath(), outlines);
const out = process.argv[2];
if (out) {
  writeFileSync(out, renderReport(report));
  for (const [check, items] of report.findings) console.log(`${check}: ${items.length}`);
} else {
  process.stdout.write(renderReport(report));
}
