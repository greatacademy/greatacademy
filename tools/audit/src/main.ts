import { readdirSync, readFileSync, writeFileSync } from "node:fs";

import { compileEnglish } from "@ga/content-english";
import { compileMath } from "@ga/content-math";

import { audit, type Outline, parseOutline, renderReport } from "./audit.ts";

// The report goes to the path given as the first argument, or to standard output; the second names the subject:
// `pnpm nx run audit:audit -- /tmp/audit.md english`.
const subjectId = process.argv[3] ?? "math";
const outlineDir = new URL(`../../../docs/${subjectId}-courses/`, import.meta.url);
const outlines = new Map<string, Outline>();
for (const file of readdirSync(outlineDir).filter((f) => f.endsWith(".md") && !f.endsWith(".zh-CN.md"))) {
  outlines.set(file.replace(/\.md$/, ""), parseOutline(readFileSync(new URL(file, outlineDir), "utf8")));
}
const report = audit(subjectId === "english" ? compileEnglish() : compileMath(), outlines);
const out = process.argv[2];
if (out) {
  writeFileSync(out, renderReport(report));
  for (const [check, items] of report.findings) console.log(`${check}: ${items.length}`);
} else {
  process.stdout.write(renderReport(report));
}
