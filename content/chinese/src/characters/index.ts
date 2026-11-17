// The character topics of the Chinese subject: for now, the recognition batches of grades 3 to 6 (docs/chinese-curriculum.md §5).
// The batches follow the order of the tables, 12 consecutive characters each, dealt to the two grades of a stage in turn.
// Grouping characters by a shared component, and making components prerequisites, waits for component data (§5.3).

import { type LexiconEntry, type TopicDef, t } from "@ga/content";

import { gradesFiveAndSix, gradesThreeAndFour, tableOne, tableTwo } from "./common.ts";
import { gradesThreeAndFourData } from "./grades-3-4.ts";
import { gradesFiveAndSixData } from "./grades-5-6.ts";
import { type CharacterEntry, parseCharacters, recognitionTopic } from "./recognition.ts";

/** BATCH is the number of characters of a recognition batch. */
const BATCH = 12;

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** Batch is a recognition topic and its characters. */
export interface Batch {
  readonly topic: TopicDef;
  readonly entries: readonly CharacterEntry[];
}

/** GradeCharacters are a grade's recognition batches, in order. */
export interface GradeCharacters {
  readonly grade: number;
  readonly batches: readonly Batch[];
}

/** recognitionId is the id of a grade's recognition batch, counted from 1. */
export const recognitionId = (grade: number, n: number): string => `recognizing-characters-${grade}-${String(n).padStart(2, "0")}`;

/** stage splits a stage's characters into batches and deals them to its two grades in turn; each batch follows the grade's one before. */
function stage(first: number, entries: readonly CharacterEntry[]): readonly GradeCharacters[] {
  const chunks: (readonly CharacterEntry[])[] = [];
  for (let i = 0; i < entries.length; i += BATCH) chunks.push(entries.slice(i, i + BATCH));
  return [first, first + 1].map((grade, which) => ({
    grade,
    batches: chunks
      .filter((_, i) => i % 2 === which)
      .map((batch, i) => ({
        entries: batch,
        topic: recognitionTopic({
          id: recognitionId(grade, i + 1),
          title: t(`Grade ${grade} Characters, Set ${i + 1}`, `${NUMERALS[grade]}年级识字 第${i + 1}组`),
          prerequisites: i === 0 ? [] : [recognitionId(grade, i)],
          entries: batch,
        }),
      })),
  }));
}

/** gradesThreeAndFourEntries are the characters of grades 3 and 4 with their words and confusable characters. */
export const gradesThreeAndFourEntries: readonly CharacterEntry[] = parseCharacters(gradesThreeAndFourData);

/** gradesFiveAndSixEntries are the characters of grades 5 and 6 with their words and confusable characters. */
export const gradesFiveAndSixEntries: readonly CharacterEntry[] = parseCharacters(gradesFiveAndSixData);

/** recognitionByGrade are the recognition batches of each grade. */
export const recognitionByGrade: readonly GradeCharacters[] = [
  ...stage(3, gradesThreeAndFourEntries),
  ...stage(5, gradesFiveAndSixEntries),
];

/** characterTopics are every character topic. */
export const characterTopics: readonly TopicDef[] = recognitionByGrade.flatMap((g) => g.batches.map((b) => b.topic));

/** characterLexicon makes each character of both tables a word of the lexicon: those grades 1 and 2 teach, and those of table two no grade teaches, known; the others taught by their batch. */
export function characterLexicon(): readonly LexiconEntry[] {
  const later = new Set([...gradesThreeAndFour, ...gradesFiveAndSix]);
  const early = [...tableOne, ...tableTwo].filter((c) => !later.has(c)).map((word) => ({ word }));
  const taught = recognitionByGrade.flatMap((g) => g.batches.flatMap((b) => b.entries.map((e) => ({ word: e.char, topic: b.topic.id }))));
  return [...early, ...taught];
}
