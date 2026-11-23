// The character topics of the Chinese subject: the recognition batches of grades 1 to 9 (docs/chinese-curriculum.md §5).
// The batches follow the order of the tables, 12 consecutive characters each, dealt to the grades of a stage in turn. Grades
// 1 and 2 instead take the characters of levels 1 to 3 first, in their teaching order, which follows frequency, with the
// characters of grade 1's words and their sentences among those of level 1, then the rest of their part of table one; grade 1
// takes the first half of the batches and grade 2 the second, so that a child first reads the commonest characters.
// Grouping characters by a shared component, and making components prerequisites, waits for component data (§5.3).

import { type LexiconEntry, type TopicDef, t } from "@ga/content";

import { characterBatches as levelOneBatches } from "../level-1/character-data.ts";
import { characterBatches as levelTwoBatches } from "../level-2/character-data.ts";
import { characterBatches as levelThreeBatches } from "../level-3/character-data.ts";
import { earlyWordData } from "../words/early.ts";
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

/**
 * stage splits a stage's characters into batches and deals them to its grades, two unless given: in turn, or in
 * consecutive runs when `runs` is set; each batch follows the grade's one before.
 */
function stage(first: number, entries: readonly CharacterEntry[], grades = 2, runs = false): readonly GradeCharacters[] {
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
      .filter((_, i) => (runs ? Math.floor((i * grades) / chunks.length) === which : i % grades === which))
      .map((batch, i) => ({
        entries: batch,
        topic: recognitionTopic({
          id: recognitionId(grade, i + 1),
          title: t(`Grade ${grade} Characters, Set ${i + 1}`, `${NUMERALS[grade]}年级识字 第${i + 1}组`),
          prerequisites: i === 0 ? [] : [recognitionId(grade, i)],
          entries: batch,
          known: knownCharacters,
        }),
      })),
  }));
}

/** levelCharacters are the characters of a level's batches in their teaching order, which follows frequency. */
const levelCharacters = (batches: readonly string[]): readonly string[] =>
  batches.flatMap((batch) =>
    batch
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line) => [...line][0]!),
  );

/** gradeOneWords are the characters of grade 1's words and their sentences. */
const gradeOneWords: ReadonlySet<string> = new Set(
  earlyWordData.filter((b) => b.grade === 1).flatMap((b) => b.words.flatMap((w) => [...w.text, ...w.sentences.join("")])),
);

/**
 * byFrequency orders the characters of grades 1 and 2 in tiers: level 1 and grade 1's words, level 2, level 3, then the
 * rest; within a tier, by the levels' order, then by the order of the table.
 */
function byFrequency(entries: readonly CharacterEntry[]): readonly CharacterEntry[] {
  const order = [levelOneBatches, levelTwoBatches, levelThreeBatches].map(levelCharacters);
  const rank = new Map(order.flat().map((c, i) => [c, i]));
  const tier = (c: string) => {
    const level = order.findIndex((chars) => chars.includes(c));
    if (level === 0 || gradeOneWords.has(c)) return 0;
    return level === -1 ? 3 : level;
  };
  const key = (e: CharacterEntry, i: number) => tier(e.char) * 1e5 + (rank.get(e.char) ?? order.flat().length + i);
  return entries
    .map((e, i) => [e, key(e, i)] as const)
    .sort((a, b) => a[1] - b[1])
    .map(([e]) => e);
}

/** gradesOneAndTwoEntries are the characters of grades 1 and 2 with their words and confusable characters, commonest first. */
export const gradesOneAndTwoEntries: readonly CharacterEntry[] = byFrequency(parseCharacters(gradesOneAndTwoData));

/** gradesThreeAndFourEntries are the characters of grades 3 and 4 with their words and confusable characters. */
export const gradesThreeAndFourEntries: readonly CharacterEntry[] = parseCharacters(gradesThreeAndFourData);

/** gradesFiveAndSixEntries are the characters of grades 5 and 6 with their words and confusable characters. */
export const gradesFiveAndSixEntries: readonly CharacterEntry[] = parseCharacters(gradesFiveAndSixData);

/**
 * WITHOUT_WORDS are characters of table two left out of the recognition batches: no word of today's standard writing has
 * them. 斌, “having both letters and arms”, is found mostly in names; 斌斌 and 文质斌斌 are old variants of 彬彬 and 文质彬彬.
 */
export const WITHOUT_WORDS: readonly string[] = ["斌"];

/** gradesSevenToNineEntries are the characters of grades 7 to 9 with their words and confusable characters. */
export const gradesSevenToNineEntries: readonly CharacterEntry[] = parseCharacters(gradesSevenToNineData);

/** knownCharacters are the characters of every grade, by character, for the reasons of the recognition and level topics. */
export const knownCharacters: ReadonlyMap<string, CharacterEntry> = new Map(
  [gradesOneAndTwoEntries, gradesThreeAndFourEntries, gradesFiveAndSixEntries, gradesSevenToNineEntries].flat().map((e) => [e.char, e]),
);

/** recognitionByGrade are the recognition batches of each grade. */
export const recognitionByGrade: readonly GradeCharacters[] = [
  ...stage(1, gradesOneAndTwoEntries, 2, true),
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
