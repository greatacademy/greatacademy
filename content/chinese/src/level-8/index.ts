// Level 8 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the second third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from communities, research and industry to public health,
// energy, engineering, civilizations, ethics, poetry and drama, music and film, institutions and finance. Each unit
// teaches its characters first, then words and sentences written only with the characters of levels 1 to 7 and those
// taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelEightPlan } from "./plan.ts";

const level = buildLevel(levelEightPlan);

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
  ...withConversations(8, level.units),
};
