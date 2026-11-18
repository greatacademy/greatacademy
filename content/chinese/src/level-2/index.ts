// Level 2 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): 300 more characters in 30 batches and
// 770 words in 77 batches, in twelve units of daily life a step beyond level 1. Each unit teaches its characters
// first, then words and sentences written only with the characters of level 1 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { levelOneCharacters, levelOneWordId, levelOneWords } from "../level-1/index.ts";
import { characterBatches } from "./character-data.ts";
import { grammar } from "./grammar-data.ts";
import { buildLevel, type LevelUnit } from "./level.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatches } from "./word-data.ts";

/** UNITS are the units of level 2. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Daily Routine", "日常作息"), characters: 4, words: 10 },
  { title: t("Home", "住房和家居"), characters: 3, words: 8 },
  { title: t("Colours and Clothes", "颜色和衣服"), characters: 2, words: 5 },
  { title: t("Food and Restaurants", "饮食和饭馆"), characters: 3, words: 6 },
  { title: t("Work and the Office", "工作和办公室"), characters: 3, words: 8 },
  { title: t("Health", "健康"), characters: 2, words: 5 },
  { title: t("Travel", "旅行"), characters: 3, words: 7 },
  { title: t("Feelings", "心情"), characters: 2, words: 6 },
  { title: t("Nature", "自然"), characters: 3, words: 8 },
  { title: t("Sports", "运动"), characters: 2, words: 5 },
  { title: t("Media and Communication", "媒体和交流"), characters: 2, words: 5 },
  { title: t("Festivals", "节日"), characters: 1, words: 4 },
];

const level = buildLevel({
  level: 2,
  numeral: "二",
  units: UNITS,
  characterBatches,
  wordBatches,
  grammar,
  sentences,
  earlierCharacters: levelOneCharacters,
  earlierWords: levelOneWords,
  after: levelOneWordId(50),
});

/** levelTwoCharacters are the characters of levels 1 and 2, by character. */
export const levelTwoCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelTwoWords are the words of levels 1 and 2. */
export const levelTwoWords: readonly string[] = level.words;

/** levelTwoLast are the last character topic and the last word topic of level 2. */
export const levelTwoLast: { readonly characters: string; readonly words: string } = level.last;

/** levelTwoTopics are the 177 topics of level 2: 30 of characters, 77 of words and 70 of grammar. */
export const levelTwoTopics: readonly TopicDef[] = level.topics;

/** levelTwoCourse is the course of level 2 of Chinese as a foreign language. */
export const levelTwoCourse: CourseDef = {
  id: "chinese-level-2",
  title: t("Chinese Level 2", "中文二级"),
  description: t(
    "Level 2 of Chinese as a foreign language: 300 more characters and 770 words of daily life in twelve units, from the daily routine and the home to travel, feelings, nature and festivals, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的二级课程：十二个单元，从日常作息、住房到旅行、心情、自然和节日，再学习 300 个汉字和 770 个日常词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-1"],
  units: level.units,
};
