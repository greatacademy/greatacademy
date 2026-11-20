// Level 6 of Chinese as a foreign language (docs/chinese-curriculum.md §8.4): 300 more characters in 30 batches and
// 1,140 words in 114 batches, in twelve units of advanced topics, from language, families and cities to health, science,
// heritage, the media, money, relationships, the performing arts, geography and argument. Each unit teaches its characters
// first, then words and sentences written only with the characters of levels 1 to 5 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelSixPlan } from "./plan.ts";

const level = buildLevel(levelSixPlan);

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
