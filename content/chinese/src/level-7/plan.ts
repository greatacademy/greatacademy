// The plan of level 7 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelSixPlan } from "../level-6/plan.ts";
import { levelSevenClues } from "./clue-data.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 7. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Social Change", "社会变迁"), characters: 4, words: 16 },
  { title: t("Schools and Learning", "学校和学习"), characters: 4, words: 16 },
  { title: t("Work and the Workplace", "工作和职场"), characters: 4, words: 16 },
  { title: t("Medicine", "医学"), characters: 4, words: 16 },
  { title: t("Nature and Ecology", "自然和生态"), characters: 3, words: 16 },
  { title: t("Science and Technology", "科学技术"), characters: 3, words: 16 },
  { title: t("History", "历史"), characters: 3, words: 16 },
  { title: t("Thought and Belief", "思想和信仰"), characters: 3, words: 16 },
  { title: t("Literature and Writing", "文学和写作"), characters: 3, words: 15 },
  { title: t("Art and Design", "艺术和设计"), characters: 3, words: 15 },
  { title: t("Law and Society", "法律和社会"), characters: 3, words: 15 },
  { title: t("The Economy and Trade", "经济和贸易"), characters: 3, words: 15 },
];

/** levelSevenPlan is level 7 read from its data and checked, with the levels before it. */
export const levelSevenPlan: LevelPlan = planLevel({
  level: 7,
  numeral: "七",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  clues: levelSevenClues,
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelSixPlan.characters,
  earlierWords: levelSixPlan.words,
  earlierMeanings: levelSixPlan.meanings,
  after: levelSixPlan.last.words,
});
