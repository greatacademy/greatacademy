// The idiom topics of the Chinese subject: batches of 8 from grade 3 (docs/chinese-curriculum.md §6), each batch
// following the grade's one before.

import { type LexiconEntry, type TopicDef, t } from "@ga/content";

import { idiomClues } from "./clue-data.ts";
import { gradeFiveIdioms, gradeFourIdioms, gradeSixIdioms, gradeThreeIdioms } from "./data.ts";
import { type Idiom, idiomTopic, parseIdioms } from "./idioms.ts";
import { gradeEightIdioms, gradeNineIdioms, gradeSevenIdioms } from "./junior.ts";
import { seniorRequiredIdioms, seniorSelectiveIdioms } from "./senior.ts";

/** BATCH is the number of idioms of a batch. */
const BATCH = 8;

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** IdiomBatch is an idiom topic and its idioms. */
export interface IdiomBatch {
  readonly topic: TopicDef;
  readonly idioms: readonly Idiom[];
}

/** GradeIdioms are a grade's idiom batches, in order. */
export interface GradeIdioms {
  readonly grade: number;
  readonly batches: readonly IdiomBatch[];
}

/** idiomId is the id of a grade's idiom batch, counted from 1. */
export const idiomId = (grade: number, n: number): string => `idioms-${grade}-${String(n).padStart(2, "0")}`;

/** title is the title of a grade's idiom batch; grades 10 and 11 are the required and selective courses of senior school. */
function title(n: number, k: number) {
  if (n === 10) return t(`Senior Required Idioms, Set ${k}`, `高中必修成语 第${k}组`);
  if (n === 11) return t(`Senior Selective Idioms, Set ${k}`, `高中选择性必修成语 第${k}组`);
  return t(`Grade ${n} Idioms, Set ${k}`, `${NUMERALS[n]}年级成语 第${k}组`);
}

function grade(n: number, data: string): GradeIdioms {
  const idioms = parseIdioms(data);
  const batches: IdiomBatch[] = [];
  for (let i = 0; i < idioms.length; i += BATCH) {
    const k = batches.length + 1;
    const part = idioms.slice(i, i + BATCH);
    batches.push({
      idioms: part,
      topic: idiomTopic({
        id: idiomId(n, k),
        title: title(n, k),
        prerequisites: k === 1 ? [] : [idiomId(n, k - 1)],
        idioms: part,
        clues: idiomClues,
      }),
    });
  }
  return { grade: n, batches };
}

/** idiomsByGrade are the idiom batches of each grade. */
export const idiomsByGrade: readonly GradeIdioms[] = [
  grade(3, gradeThreeIdioms),
  grade(4, gradeFourIdioms),
  grade(5, gradeFiveIdioms),
  grade(6, gradeSixIdioms),
  grade(7, gradeSevenIdioms),
  grade(8, gradeEightIdioms),
  grade(9, gradeNineIdioms),
  grade(10, seniorRequiredIdioms),
  grade(11, seniorSelectiveIdioms),
];

/** idiomTopics are every idiom topic. */
export const idiomTopics: readonly TopicDef[] = idiomsByGrade.flatMap((g) => g.batches.map((b) => b.topic));

/** idiomLexicon makes each idiom a word of the lexicon, taught by its batch. */
export const idiomLexicon = (): readonly LexiconEntry[] =>
  idiomsByGrade.flatMap((g) => g.batches.flatMap((b) => b.idioms.map((i) => ({ word: i.text, topic: b.topic.id }))));
