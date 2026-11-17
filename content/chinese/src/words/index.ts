// The word topics of the Chinese subject: batches of 10 by theme from grade 1 (docs/chinese-curriculum.md §6), each
// batch following the grade's one before.

import type { LexiconEntry, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { wordData as laterWordData } from "./data.ts";
import { earlyWordData } from "./early.ts";
import { juniorWordData } from "./junior.ts";
import { seniorWordData } from "./senior.ts";
import { type Word, wordTopic } from "./words.ts";

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** titleOf is the title of a grade's word batch of a theme; grades 10 and 11 are the required and selective required courses. */
const titleOf = (grade: number, theme: Text): Text =>
  grade === 10
    ? t(`Senior Required Words: ${theme.en}`, `高中必修词语：${theme["zh-CN"]}`)
    : grade === 11
      ? t(`Senior Selective Words: ${theme.en}`, `高中选择性必修词语：${theme["zh-CN"]}`)
      : t(`Grade ${grade} Words: ${theme.en}`, `${NUMERALS[grade]}年级词语：${theme["zh-CN"]}`);

/** WordBatch is a word topic, its grade and its words. */
export interface WordBatch {
  readonly grade: number;
  readonly topic: TopicDef;
  readonly words: readonly Word[];
}

/** wordId is the id of a grade's word batch, counted from 1. */
export const wordId = (grade: number, n: number): string => `words-${grade}-${String(n).padStart(2, "0")}`;

const wordData = [...earlyWordData, ...laterWordData, ...juniorWordData, ...seniorWordData];

/** wordBatches are the word batches of every grade, in order. */
export const wordBatches: readonly WordBatch[] = wordData.map((batch, i) => {
  const k = wordData.slice(0, i).filter((b) => b.grade === batch.grade).length + 1;
  return {
    grade: batch.grade,
    words: batch.words,
    topic: wordTopic({
      id: wordId(batch.grade, k),
      title: titleOf(batch.grade, batch.theme),
      prerequisites: k === 1 ? [] : [wordId(batch.grade, k - 1)],
      words: batch.words,
    }),
  };
});

/** wordTopics are every word topic. */
export const wordTopics: readonly TopicDef[] = wordBatches.map((b) => b.topic);

/** wordLexicon makes each word of a batch a word of the lexicon, taught by its batch. */
export const wordLexicon = (): readonly LexiconEntry[] =>
  wordBatches.flatMap((b) => b.words.map((w) => ({ word: w.text, topic: b.topic.id })));
