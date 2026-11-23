// The plan of level 2 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { levelOnePlan } from "../level-1/plan.ts";
import { characterBatches } from "./character-data.ts";
import { levelTwoClues } from "./clue-data.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { type LevelPlan, type LevelUnit, planLevel } from "./level.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatches } from "./word-data.ts";
import { writing } from "./writing-data.ts";

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

/** levelTwoPlan is level 2 read from its data and checked, with the levels before it. */
export const levelTwoPlan: LevelPlan = planLevel({
  level: 2,
  numeral: "二",
  units: UNITS,
  characterBatches,
  wordBatches,
  clues: levelTwoClues,
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelOnePlan.characters,
  earlierWords: levelOnePlan.words,
  earlierMeanings: levelOnePlan.meanings,
  after: levelOnePlan.last.words,
});
