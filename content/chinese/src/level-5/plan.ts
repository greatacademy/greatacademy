// The plan of level 5 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelFourPlan } from "../level-4/plan.ts";
import { characterBatchesA } from "./character-data-a.ts";
import { characterBatchesB } from "./character-data-b.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatchesA } from "./word-data-a.ts";
import { wordBatchesB } from "./word-data-b.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 5. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Society", "社会"), characters: 3, words: 9 },
  { title: t("Education", "教育"), characters: 3, words: 9 },
  { title: t("The Environment", "环境"), characters: 3, words: 9 },
  { title: t("Technology", "科技"), characters: 3, words: 9 },
  { title: t("Traditions and Customs", "传统和习俗"), characters: 3, words: 9 },
  { title: t("Government and Public Life", "政府和公共生活"), characters: 3, words: 9 },
  { title: t("The World", "世界"), characters: 2, words: 9 },
  { title: t("Business and Management", "企业和管理"), characters: 2, words: 9 },
  { title: t("The Mind", "心理"), characters: 2, words: 9 },
  { title: t("Literature", "文学"), characters: 2, words: 9 },
  { title: t("Food and Cooking", "饮食和烹饪"), characters: 2, words: 9 },
  { title: t("Values and Ideas", "价值和观念"), characters: 2, words: 8 },
];

/** levelFivePlan is level 5 read from its data and checked, with the levels before it. */
export const levelFivePlan: LevelPlan = planLevel({
  level: 5,
  numeral: "五",
  units: UNITS,
  characterBatches: [...characterBatchesA, ...characterBatchesB],
  wordBatches: [...wordBatchesA, ...wordBatchesB],
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelFourPlan.characters,
  earlierWords: levelFourPlan.words,
  after: levelFourPlan.last.words,
});
