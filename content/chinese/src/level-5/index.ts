// Level 5 of Chinese as a foreign language (docs/chinese-curriculum.md §8.4): 300 more characters in 30 batches and
// 1,070 words in 107 batches, in twelve units of upper intermediate topics, from society, education and the environment
// to technology, traditions, government, the world, business, the mind, literature, food and values. Each unit teaches
// its characters first, then words and sentences written only with the characters of levels 1 to 4 and those taught so
// far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelFivePlan } from "./plan.ts";

const level = buildLevel(levelFivePlan);

/** levelFiveCharacters are the characters of levels 1 to 5, by character. */
export const levelFiveCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelFiveWords are the words of levels 1 to 5. */
export const levelFiveWords: readonly string[] = level.words;

/** levelFiveLast are the last character topic and the last word topic of level 5. */
export const levelFiveLast: { readonly characters: string; readonly words: string } = level.last;

/** levelFiveTopics are the 199 topics of level 5: 30 of characters, 107 of words and 62 of grammar. */
export const levelFiveTopics: readonly TopicDef[] = level.topics;

/** levelFiveCourse is the course of level 5 of Chinese as a foreign language. */
export const levelFiveCourse: CourseDef = {
  id: "chinese-level-5",
  title: t("Chinese Level 5", "中文五级"),
  description: t(
    "Level 5 of Chinese as a foreign language: 300 more characters and 1,070 words of upper intermediate topics in twelve units, from society, education and the environment to technology, traditions, public life, the world, business, the mind, literature, food and values, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的五级课程：十二个单元，从社会、教育和环境到科技、传统、公共生活、世界、企业、心理、文学、饮食和观念，再学习 300 个汉字和 1070 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-4"],
  ...withConversations(5, level.units),
};
