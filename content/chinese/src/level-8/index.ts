// Level 8 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the second third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from communities, research and industry to public health,
// energy, engineering, civilizations, ethics, poetry and drama, music and film, institutions and finance. Each unit
// teaches its characters first, then words and sentences written only with the characters of levels 1 to 7 and those
// taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel, type LevelUnit } from "../level-2/level.ts";
import { levelSevenCharacters, levelSevenLast, levelSevenWords } from "../level-7/index.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";
import { grammar } from "./grammar-data.ts";

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

const level = buildLevel({
  level: 8,
  numeral: "八",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  grammar,
  earlierCharacters: levelSevenCharacters,
  earlierWords: levelSevenWords,
  after: levelSevenLast.words,
});

/** levelEightCharacters are the characters of levels 1 to 8, by character. */
export const levelEightCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelEightWords are the words of levels 1 to 8. */
export const levelEightWords: readonly string[] = level.words;

/** levelEightLast are the last character topic and the last word topic of level 8. */
export const levelEightLast: { readonly characters: string; readonly words: string } = level.last;

/** levelEightTopics are the 279 topics of level 8: 40 of characters, 188 of words and 51 of grammar. */
export const levelEightTopics: readonly TopicDef[] = level.topics;

/** levelEightCourse is the course of level 8 of Chinese as a foreign language. */
export const levelEightCourse: CourseDef = {
  id: "chinese-level-8",
  title: t("Chinese Level 8", "中文八级"),
  description: t(
    "Level 8 of Chinese as a foreign language, the second third of the advanced levels 7 to 9: 400 more characters and 1,880 words in twelve units, from communities, research and industry to public health, energy, engineering, civilizations, ethics, poetry and drama, music and film, institutions and finance, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的八级课程，是高等七至九级的第二部分：十二个单元，从社区、学术和工业到公共卫生、能源、工程、文明、伦理、诗歌和戏剧、音乐和电影、制度和金融，再学习 400 个汉字和 1880 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-7"],
  units: level.units,
};
