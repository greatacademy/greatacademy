// The plan of level 8 of Chinese as a foreign language: its units and batches, read and checked without building its
// topics, which index.ts builds. The HSK courses and the writing of the levels need only this.

import { t } from "@ga/content";

import { type LevelPlan, type LevelUnit, planLevel } from "../level-2/level.ts";
import { levelSevenPlan } from "../level-7/plan.ts";
import { levelEightClues } from "./clue-data.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 8. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Communities and Social Issues", "社区和社会问题"), characters: 4, words: 16 },
  { title: t("Research and Academia", "学术和研究"), characters: 4, words: 16 },
  { title: t("Industry and Farming", "工业和农业"), characters: 4, words: 16 },
  { title: t("Public Health", "公共卫生"), characters: 4, words: 16 },
  { title: t("Energy and Resources", "能源和资源"), characters: 3, words: 16 },
  { title: t("Engineering and Inventions", "工程和发明"), characters: 3, words: 16 },
  { title: t("Civilizations", "文明"), characters: 3, words: 16 },
  { title: t("Ethics", "伦理和道德"), characters: 3, words: 16 },
  { title: t("Poetry and Drama", "诗歌和戏剧"), characters: 3, words: 15 },
  { title: t("Music and Film", "音乐和电影"), characters: 3, words: 15 },
  { title: t("Institutions and Administration", "制度和行政"), characters: 3, words: 15 },
  { title: t("Finance and Markets", "金融和市场"), characters: 3, words: 15 },
];

/** levelEightPlan is level 8 read from its data and checked, with the levels before it. */
export const levelEightPlan: LevelPlan = planLevel({
  level: 8,
  numeral: "八",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  clues: levelEightClues,
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelSevenPlan.characters,
  earlierWords: levelSevenPlan.words,
  earlierMeanings: levelSevenPlan.meanings,
  after: levelSevenPlan.last.words,
});
