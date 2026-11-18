// Level 6 of Chinese as a foreign language (docs/chinese-curriculum.md §8.4): 300 more characters in 30 batches and
// 1,140 words in 114 batches, in twelve units of advanced topics, from language, families and cities to health, science,
// heritage, the media, money, relationships, the performing arts, geography and argument. Each unit teaches its characters
// first, then words and sentences written only with the characters of levels 1 to 5 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel, type LevelUnit } from "../level-2/level.ts";
import { levelFiveCharacters, levelFiveLast, levelFiveWords } from "../level-5/index.ts";
import { characterBatchesA } from "./character-data-a.ts";
import { characterBatchesB } from "./character-data-b.ts";
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

const level = buildLevel({
  level: 6,
  numeral: "六",
  units: UNITS,
  characterBatches: [...characterBatchesA, ...characterBatchesB],
  wordBatches: [...wordBatchesA, ...wordBatchesB],
  grammar,
  sentences,
  writing,
  earlierCharacters: levelFiveCharacters,
  earlierWords: levelFiveWords,
  after: levelFiveLast.words,
});

/** levelSixCharacters are the characters of levels 1 to 6, by character. */
export const levelSixCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelSixWords are the words of levels 1 to 6. */
export const levelSixWords: readonly string[] = level.words;

/** levelSixLast are the last character topic and the last word topic of level 6. */
export const levelSixLast: { readonly characters: string; readonly words: string } = level.last;

/** levelSixTopics are the 206 topics of level 6: 30 of characters, 114 of words and 62 of grammar. */
export const levelSixTopics: readonly TopicDef[] = level.topics;

/** levelSixCourse is the course of level 6 of Chinese as a foreign language. */
export const levelSixCourse: CourseDef = {
  id: "chinese-level-6",
  title: t("Chinese Level 6", "中文六级"),
  description: t(
    "Level 6 of Chinese as a foreign language: 300 more characters and 1,140 words of advanced topics in twelve units, from language, families and cities to health, science, heritage, the news, money, relationships, the performing arts, geography and argument, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的六级课程：十二个单元，从语言、家庭和城市到健康、科学、文化遗产、新闻、金融、人际关系、表演艺术、地理和论证，再学习 300 个汉字和 1140 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-5"],
  ...withConversations(6, level.units),
};
