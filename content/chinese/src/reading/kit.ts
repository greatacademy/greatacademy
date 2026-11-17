// The helpers that build the reading units of Chinese: passages written for this subject, each with a short check.

import { type PassageDef, type PassageQuestionDef, type ReadingUnitDef, type Text, t } from "@ga/content";

import { wordId } from "../words/index.ts";

/** Pair is a text in Chinese and in English, in that order. */
export type Pair = readonly [zh: string, en: string];

const text = ([zh, en]: Pair): Text => t(en, zh);

/** question builds a comprehension question from its prompt, right option, wrong options and solution. */
export function question(prompt: Pair, right: Pair, wrong: readonly Pair[], solution: Pair): PassageQuestionDef {
  return { prompt: text(prompt), right: text(right), wrong: wrong.map(text), solution: text(solution) };
}

/** PassageData is a passage without the topics it needs, which are its grade's. */
export type PassageData = Omit<PassageDef, "topics" | "title"> & { readonly title: Pair };

/** unitAfter builds a reading unit whose passages each need the given topic. */
export function unitAfter(topic: string, id: string, title: Pair, passages: readonly PassageData[]): ReadingUnitDef {
  return {
    id,
    title: text(title),
    passages: passages.map((p) => ({ ...p, title: text(p.title), topics: [{ topic, weight: 0.2 }] })),
  };
}

/** unit builds a grade's reading unit; each passage needs the grade's first word batch. */
export function unit(grade: number, id: string, title: Pair, passages: readonly PassageData[]): ReadingUnitDef {
  return unitAfter(wordId(grade, 1), id, title, passages);
}
