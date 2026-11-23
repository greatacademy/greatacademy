// The plan of level 3 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelTwoPlan } from "../level-2/plan.ts";
import { characterBatches } from "./character-data.ts";
import { levelThreeClues } from "./clue-data.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatches } from "./word-data.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 3. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Opinions and Reasons", "观点和理由"), characters: 3, words: 9 },
  { title: t("Personality", "性格"), characters: 3, words: 8 },
  { title: t("Relationships", "人和人"), characters: 3, words: 8 },
  { title: t("Education", "教育"), characters: 3, words: 9 },
  { title: t("Work and Business", "工作和生意"), characters: 3, words: 9 },
  { title: t("Society and Rules", "社会和规则"), characters: 3, words: 9 },
  { title: t("Environment", "环境"), characters: 3, words: 8 },
  { title: t("Technology", "科技"), characters: 3, words: 9 },
  { title: t("Culture", "文化"), characters: 2, words: 8 },
  { title: t("Money and Shopping", "钱和消费"), characters: 2, words: 8 },
  { title: t("News", "新闻"), characters: 1, words: 6 },
  { title: t("Lifestyle", "生活方式"), characters: 1, words: 6 },
];

/** levelThreePlan is level 3 read from its data and checked, with the levels before it. */
export const levelThreePlan: LevelPlan = planLevel({
  level: 3,
  numeral: "三",
  units: UNITS,
  characterBatches,
  wordBatches,
  clues: levelThreeClues,
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelTwoPlan.characters,
  earlierWords: levelTwoPlan.words,
  earlierMeanings: levelTwoPlan.meanings,
  after: levelTwoPlan.last.words,
});
