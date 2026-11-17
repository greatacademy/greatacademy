// The character topics of the Chinese subject: the recognition batches of grades 1 to 9 (docs/chinese-curriculum.md §5).
// The batches follow the order of the tables, 12 consecutive characters each, dealt to the grades of a stage in turn.
// Grouping characters by a shared component, and making components prerequisites, waits for component data (§5.3).

import { type LexiconEntry, type TopicDef, t } from "@ga/content";

import { tableOne, tableTwo } from "./common.ts";
import { gradesOneAndTwoData } from "./grades-1-2.ts";
import { gradesThreeAndFourData } from "./grades-3-4.ts";
import { gradesFiveAndSixData } from "./grades-5-6.ts";
import { gradesSevenToNineData } from "./grades-7-9.ts";
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

/** stage splits a stage's characters into batches and deals them to its grades in turn, two unless given; each batch follows the grade's one before. */
function stage(first: number, entries: readonly CharacterEntry[], grades = 2): readonly GradeCharacters[] {
  const chunks: (readonly CharacterEntry[])[] = [];
  for (let i = 0; i < entries.length; i += BATCH) chunks.push(entries.slice(i, i + BATCH));
  const last = chunks.at(-1);
  if (chunks.length > 1 && last && last.length < BATCH / 2) {
    // A very short last batch joins the one before.
    chunks.splice(-2, 2, [...chunks.at(-2)!, ...last]);
  } else if (chunks.length > 1 && last && last.length < BATCH) {
    // A short last batch would have too few items; the last two share their characters evenly instead.
    const both = [...chunks.at(-2)!, ...last];
    const half = Math.ceil(both.length / 2);
    chunks.splice(-2, 2, both.slice(0, half), both.slice(half));
  }
  return Array.from({ length: grades }, (_, which) => first + which).map((grade, which) => ({
    grade,
    batches: chunks
      .filter((_, i) => i % grades === which)
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

/** gradesOneAndTwoEntries are the characters of grades 1 and 2 with their words and confusable characters. */
export const gradesOneAndTwoEntries: readonly CharacterEntry[] = parseCharacters(gradesOneAndTwoData);

/** gradesThreeAndFourEntries are the characters of grades 3 and 4 with their words and confusable characters. */
export const gradesThreeAndFourEntries: readonly CharacterEntry[] = parseCharacters(gradesThreeAndFourData);

/** gradesFiveAndSixEntries are the characters of grades 5 and 6 with their words and confusable characters. */
export const gradesFiveAndSixEntries: readonly CharacterEntry[] = parseCharacters(gradesFiveAndSixData);

/** gradesSevenToNineEntries are the characters of grades 7 to 9 with their words and confusable characters. */
export const gradesSevenToNineEntries: readonly CharacterEntry[] = parseCharacters(gradesSevenToNineData);

/** recognitionByGrade are the recognition batches of each grade. */
export const recognitionByGrade: readonly GradeCharacters[] = [
  ...stage(1, gradesOneAndTwoEntries),
  ...stage(3, gradesThreeAndFourEntries),
  ...stage(5, gradesFiveAndSixEntries),
  ...stage(7, gradesSevenToNineEntries, 3),
];

/** characterTopics are every character topic. */
export const characterTopics: readonly TopicDef[] = recognitionByGrade.flatMap((g) => g.batches.map((b) => b.topic));

/**
 * characterLexicon makes each character of both tables a word of the lexicon. The characters of grades 1 to 6 are taught
 * by their batch; the rest of table two, taught in grades 7 to 9, is known, since the texts of primary school hold some of
 * those characters and should not wait for a batch of junior secondary school.
 */
export function characterLexicon(): readonly LexiconEntry[] {
  const primary = recognitionByGrade.filter((g) => g.grade <= 6);
  const later = new Set(primary.flatMap((g) => g.batches.flatMap((b) => b.entries.map((e) => e.char))));
  const early = [...tableOne, ...tableTwo].filter((c) => !later.has(c)).map((word) => ({ word }));
  const taught = primary.flatMap((g) => g.batches.flatMap((b) => b.entries.map((e) => ({ word: e.char, topic: b.topic.id }))));
  return [...early, ...taught];
}
