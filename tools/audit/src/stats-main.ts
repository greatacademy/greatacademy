import { writeFileSync } from "node:fs";

import { compileEnglish } from "@ga/content-english";
import { compileMath } from "@ga/content-math";

import { renderStats, subjectStats } from "./stats.ts";

// `pnpm nx run audit:stats -- <subject> [path] [samples]` writes the statistics of a subject to the path, or to
// standard output; each knowledge point is generated with 200 seeds unless a number is given. The depths needed are those
// of content/english/PROGRESS.md: 30 problems for a rule-checked knowledge point, 25 for one of words, 12 judged tasks.
const subjectId = process.argv[2] ?? "english";
const out = process.argv[3];
const samples = Number(process.argv[4] ?? 200);
const report = renderStats(
  subjectStats(subjectId === "math" ? compileMath() : compileEnglish(), { samples, minRuledByStrand: { vocabulary: 25 } }),
);
if (out && out !== "-") writeFileSync(out, report);
else process.stdout.write(report);
