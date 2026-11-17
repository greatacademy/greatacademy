// Level 7 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the first third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from social change, learning and work to medicine, ecology,
// science, history, thought, literature, design, law and trade. Each unit teaches its characters first, then words and
// sentences written only with the characters of levels 1 to 6 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel, type LevelUnit } from "../level-2/level.ts";
import { levelSixCharacters, levelSixLast, levelSixWords } from "../level-6/index.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";

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

const level = buildLevel({
  level: 7,
  numeral: "七",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  earlierCharacters: levelSixCharacters,
  earlierWords: levelSixWords,
  after: levelSixLast.words,
});

/** levelSevenCharacters are the characters of levels 1 to 7, by character. */
export const levelSevenCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelSevenWords are the words of levels 1 to 7. */
export const levelSevenWords: readonly string[] = level.words;

/** levelSevenLast are the last character topic and the last word topic of level 7. */
export const levelSevenLast: { readonly characters: string; readonly words: string } = level.last;

/** levelSevenTopics are the 228 topics of level 7: 40 of characters and 188 of words. */
export const levelSevenTopics: readonly TopicDef[] = level.topics;

/** levelSevenCourse is the course of level 7 of Chinese as a foreign language. */
export const levelSevenCourse: CourseDef = {
  id: "chinese-level-7",
  title: t("Chinese Level 7", "中文七级"),
  description: t(
    "Level 7 of Chinese as a foreign language, the first third of the advanced levels 7 to 9: 400 more characters and 1,880 words in twelve units, from social change, learning and work to medicine, ecology, science, history, thought, literature, design, law and trade, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的七级课程，是高等七至九级的第一部分：十二个单元，从社会变迁、学习和职场到医学、生态、科技、历史、思想、文学、设计、法律和贸易，再学习 400 个汉字和 1880 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-6"],
  units: level.units,
};
