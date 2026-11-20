// Level 7 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the first third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from social change, learning and work to medicine, ecology,
// science, history, thought, literature, design, law and trade. Each unit teaches its characters first, then words and
// sentences written only with the characters of levels 1 to 6 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelSevenPlan } from "./plan.ts";

const level = buildLevel(levelSevenPlan);

/** levelSevenCharacters are the characters of levels 1 to 7, by character. */
export const levelSevenCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelSevenWords are the words of levels 1 to 7. */
export const levelSevenWords: readonly string[] = level.words;

/** levelSevenLast are the last character topic and the last word topic of level 7. */
export const levelSevenLast: { readonly characters: string; readonly words: string } = level.last;

/** levelSevenTopics are the 277 topics of level 7: 40 of characters, 188 of words and 49 of grammar. */
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
  ...withConversations(7, level.units),
};
