// The packs of English, gathered for the subject: the levels for learners of English as a foreign language in
// order, then the native courses and the exam courses. Each directory has its own authors; this file only lists them.

import type { LexiconEntry } from "@ga/content";
import { pack as exams } from "./exams/index.ts";
import { pack as a1 } from "./levels/a1/index.ts";
import { pack as a2 } from "./levels/a2/index.ts";
import { pack as b1 } from "./levels/b1/index.ts";
import { pack as b2 } from "./levels/b2/index.ts";
import { pack as preA1 } from "./levels/pre-a1/index.ts";
import { native } from "./native/index.ts";
import type { Pack } from "./pack.ts";

/** levelPacks are the packs of the foreign-language levels, lowest first. */
export const levelPacks: readonly (readonly [level: string, pack: Pack])[] = [
  ["pre-a1", preA1],
  ["a1", a1],
  ["a2", a2],
  ["b1", b1],
  ["b2", b2],
];

/** englishPacks are all the packs of English. */
export const englishPacks: readonly Pack[] = [...levelPacks.map(([, pack]) => pack), native, exams];

/** packLexicon adds to a lexicon the words of the packs, and the words their batches teach, that it lacks. */
export function packLexicon(base: readonly LexiconEntry[]): readonly LexiconEntry[] {
  const seen = new Set(base.flatMap((entry) => [entry.word, ...(entry.forms ?? [])]));
  const added: LexiconEntry[] = [];
  const add = (entry: LexiconEntry) => {
    if ([entry.word, ...(entry.forms ?? [])].some((w) => seen.has(w))) return;
    for (const w of [entry.word, ...(entry.forms ?? [])]) seen.add(w);
    added.push(entry);
  };
  for (const pack of englishPacks) for (const entry of pack.lexicon) add(entry);
  for (const pack of englishPacks) for (const batch of pack.vocabulary) for (const word of batch.words) add({ word });
  return [...base, ...added];
}
