// The plan of level 6 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelFivePlan } from "../level-5/plan.ts";
import { characterBatchesA } from "./character-data-a.ts";
import { characterBatchesB } from "./character-data-b.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatchesA } from "./word-data-a.ts";
import { wordBatchesB } from "./word-data-b.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 6. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Language and Communication", "语言和交流"), characters: 3, words: 10 },
  { title: t("Families and Generations", "家庭和代际"), characters: 3, words: 10 },
  { title: t("Cities and the Countryside", "城市和乡村"), characters: 3, words: 10 },
  { title: t("Health and Ways of Living", "健康和生活方式"), characters: 3, words: 10 },
  { title: t("Science and Discovery", "科学和发现"), characters: 3, words: 10 },
  { title: t("Culture and Heritage", "文化和遗产"), characters: 3, words: 10 },
  { title: t("News and Opinion", "新闻和舆论"), characters: 2, words: 9 },
  { title: t("Money and Spending", "金融和消费"), characters: 2, words: 9 },
  { title: t("Relationships", "人际关系"), characters: 2, words: 9 },
  { title: t("The Performing Arts", "表演艺术"), characters: 2, words: 9 },
  { title: t("Geography and Travel", "地理和旅行"), characters: 2, words: 9 },
  { title: t("Thinking and Arguing", "思考和论证"), characters: 2, words: 9 },
];

/** levelSixPlan is level 6 read from its data and checked, with the levels before it. */
export const levelSixPlan: LevelPlan = planLevel({
  level: 6,
  numeral: "六",
  units: UNITS,
  characterBatches: [...characterBatchesA, ...characterBatchesB],
  wordBatches: [...wordBatchesA, ...wordBatchesB],
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelFivePlan.characters,
  earlierWords: levelFivePlan.words,
  earlierMeanings: levelFivePlan.meanings,
  after: levelFivePlan.last.words,
});
