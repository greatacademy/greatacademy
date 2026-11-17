import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { formatIds, mergeIds, parseIds, type SubjectDef, subjectIds } from "@ga/content";
import { chinese } from "@ga/content-chinese";
import { english } from "@ga/content-english";
import { math } from "@ga/content-math";

// `pnpm nx run audit:ids` records in each subject's `published-ids.txt` the ids it defines that are not there yet. It
// never removes an id: a published id stays, because learner state names it (Content §2).
const subjects: readonly [SubjectDef, string][] = [
  [math, "content/math"],
  [english, "content/english"],
  [chinese, "content/chinese"],
];
for (const [subject, dir] of subjects) {
  const path = new URL(`../../../${dir}/published-ids.txt`, import.meta.url);
  const before = existsSync(path) ? readFileSync(path, "utf8") : "";
  const after = formatIds(mergeIds(parseIds(before), subjectIds(subject)));
  if (after !== before) writeFileSync(path, after);
  process.stdout.write(`${dir}/published-ids.txt: ${after === before ? "unchanged" : "updated"}\n`);
}
