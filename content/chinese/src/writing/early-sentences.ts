// The sentence building of native grades 1 and 2 (docs/chinese-curriculum.md §8.1): putting the words of a sentence in
// order, the first writing a child does, checked by rules. Each grade has four topics, after the sixteenth, thirty-third
// and fiftieth recognition batches and its last, and each uses only the characters taught by then. The heritage bridges
// take them with the batches they follow.

import { t } from "@ga/content";

import { recognitionByGrade, recognitionId } from "../characters/index.ts";
import type { GradeTopic } from "../grammar/index.ts";
import { type LevelSentences, sentenceTopic } from "../level-1/sentences.ts";
import { earlySentenceData } from "./early-sentence-data.ts";

const NUMBERS = ["", "一", "二"];

/** earlySentenceId is the id of the nth sentence-building topic of grade 1 or 2, counting from 1. */
export const earlySentenceId = (grade: number, n: number): string => `sentences-${grade}-${String(n).padStart(2, "0")}`;

/** EarlySentences are a grade's sentence topics as written in their data: unit is the recognition batch each follows. */
export interface EarlySentences {
  readonly grade: number;
  readonly topics: readonly LevelSentences[];
}

/** taughtBy are the characters of grades 1 and 2 taught by the end of a grade's nth batch. */
function taughtBy(grade: number, batch: number): ReadonlySet<string> {
  const taught = new Set<string>();
  for (const g of recognitionByGrade.filter((x) => x.grade <= grade)) {
    const batches = g.grade < grade ? g.batches : g.batches.slice(0, batch);
    if (g.grade === grade && batches.length < batch) throw new Error(`grade ${grade} has no batch ${batch}`);
    for (const b of batches) for (const e of b.entries) taught.add(e.char);
  }
  return taught;
}

/** earlySentenceTopics are the sentence-building topics of grades 1 and 2. */
export const earlySentenceTopics: readonly GradeTopic[] = earlySentenceData.flatMap(({ grade, topics }) =>
  topics.map((sentences, k) => {
    const from = k === 0 ? 1 : (topics[k - 1]?.unit ?? 0) + 1;
    const theme = t(
      `Grade ${grade} Characters, Sets ${from} to ${sentences.unit}`,
      `${NUMBERS[grade]}年级识字第${from}至${sentences.unit}组`,
    );
    return {
      grade,
      topic: sentenceTopic({
        level: grade,
        n: k + 1,
        sentences,
        themes: [theme],
        taught: taughtBy(grade, sentences.unit),
        after: recognitionId(grade, sentences.unit),
        id: earlySentenceId(grade, k + 1),
        ...(k > 0 ? { previous: earlySentenceId(grade, k) } : grade === 2 ? { previous: earlySentenceId(1, 4) } : {}),
        summary: t(
          `Putting the words of sentences in order, with the characters taught by set ${sentences.unit} of grade ${grade}.`,
          `用${NUMBERS[grade]}年级第${sentences.unit}组以前学过的字，把词语排成句子。`,
        ),
      }),
    };
  }),
);
