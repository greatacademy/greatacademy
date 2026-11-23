// The plan of level 4 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelThreePlan } from "../level-3/plan.ts";
import { characterBatches } from "./character-data.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatchesA } from "./word-data-a.ts";
import { wordBatchesB } from "./word-data-b.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 4. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Health and Medicine", "健康和医疗"), characters: 3, words: 9 },
  { title: t("Travel and Transport", "旅行和交通"), characters: 3, words: 9 },
  { title: t("Media and the Internet", "媒体和网络"), characters: 3, words: 9 },
  { title: t("History", "历史"), characters: 3, words: 8 },
  { title: t("The Arts", "艺术"), characters: 3, words: 8 },
  { title: t("Law and Rights", "法律和权利"), characters: 3, words: 9 },
  { title: t("The Economy", "经济"), characters: 3, words: 9 },
  { title: t("Feelings", "情感"), characters: 2, words: 8 },
  { title: t("Nature and Climate", "自然和气候"), characters: 2, words: 8 },
  { title: t("Sport", "体育"), characters: 2, words: 8 },
  { title: t("Science", "科学"), characters: 2, words: 8 },
  { title: t("Careers", "职业"), characters: 1, words: 7 },
];

/** levelFourPlan is level 4 read from its data and checked, with the levels before it. */
export const levelFourPlan: LevelPlan = planLevel({
  level: 4,
  numeral: "四",
  units: UNITS,
  characterBatches,
  wordBatches: [...wordBatchesA, ...wordBatchesB],
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelThreePlan.characters,
  earlierWords: levelThreePlan.words,
  earlierMeanings: levelThreePlan.meanings,
  after: levelThreePlan.last.words,
});
