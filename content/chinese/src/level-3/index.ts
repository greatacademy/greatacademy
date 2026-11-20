// Level 3 of Chinese as a foreign language (docs/chinese-curriculum.md §8.4): 300 more characters in 30 batches and
// 970 words in 97 batches, in twelve units of social life a step beyond level 2, from opinions and personality to
// society, the environment, technology, culture and the news. Each unit teaches its characters first, then words and
// sentences written only with the characters of levels 1 and 2 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelThreePlan } from "./plan.ts";

const level = buildLevel(levelThreePlan);

/** levelThreeCharacters are the characters of levels 1 to 3, by character. */
export const levelThreeCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelThreeWords are the words of levels 1 to 3. */
export const levelThreeWords: readonly string[] = level.words;

/** levelThreeLast are the last character topic and the last word topic of level 3. */
export const levelThreeLast: { readonly characters: string; readonly words: string } = level.last;

/** levelThreeTopics are the 208 topics of level 3: 30 of characters, 97 of words and 81 of grammar. */
export const levelThreeTopics: readonly TopicDef[] = level.topics;

/** levelThreeCourse is the course of level 3 of Chinese as a foreign language. */
export const levelThreeCourse: CourseDef = {
  id: "chinese-level-3",
  title: t("Chinese Level 3", "中文三级"),
  description: t(
    "Level 3 of Chinese as a foreign language: 300 more characters and 970 words of social life in twelve units, from opinions, personality and relationships to education, work, society, the environment, technology, culture, money, the news and ways of living, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的三级课程：十二个单元，从观点、性格和人际关系到教育、工作、社会、环境、科技、文化、消费、新闻和生活方式，再学习 300 个汉字和 970 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-2"],
  units: level.units,
};
