// The plan of level 9 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelEightPlan } from "../level-8/plan.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 9. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Language and Rhetoric", "语言和修辞"), characters: 4, words: 16 },
  { title: t("Idioms and Allusions", "成语和典故"), characters: 4, words: 16 },
  { title: t("Philosophy", "哲学"), characters: 4, words: 16 },
  { title: t("Behaviour and Character", "行为和性格"), characters: 4, words: 16 },
  { title: t("The Universe", "宇宙和天文"), characters: 3, words: 16 },
  { title: t("Life Sciences", "生命科学"), characters: 3, words: 16 },
  { title: t("International Affairs", "国际事务"), characters: 3, words: 16 },
  { title: t("Communication and the Media", "传播和媒介"), characters: 3, words: 16 },
  { title: t("Architecture and Planning", "建筑和规划"), characters: 3, words: 15 },
  { title: t("Crafts and Folk Customs", "工艺和民俗"), characters: 3, words: 15 },
  { title: t("Sport and Competition", "体育和竞技"), characters: 3, words: 15 },
  { title: t("Formal Writing", "公文和应用文"), characters: 3, words: 15 },
];

/** levelNinePlan is level 9 read from its data and checked, with the levels before it. */
export const levelNinePlan: LevelPlan = planLevel({
  level: 9,
  numeral: "九",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelEightPlan.characters,
  earlierWords: levelEightPlan.words,
  after: levelEightPlan.last.words,
});
