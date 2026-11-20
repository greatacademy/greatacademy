// Level 9 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the last third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from rhetoric, idioms and philosophy to character, the
// universe, the life sciences, international affairs, the media, architecture, crafts, sport and formal writing. Each
// unit teaches its characters first, then words and sentences written only with the characters of levels 1 to 8 and
// those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel } from "../level-2/level.ts";
import { levelNinePlan } from "./plan.ts";

const level = buildLevel(levelNinePlan);

/** levelNineCharacters are the characters of levels 1 to 9, by character. */
export const levelNineCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelNineWords are the words of levels 1 to 9. */
export const levelNineWords: readonly string[] = level.words;

/** levelNineLast are the last character topic and the last word topic of level 9. */
export const levelNineLast: { readonly characters: string; readonly words: string } = level.last;

/** levelNineTopics are the 279 topics of level 9: 40 of characters, 188 of words and 51 of grammar. */
export const levelNineTopics: readonly TopicDef[] = level.topics;

/** levelNineCourse is the course of level 9 of Chinese as a foreign language. */
export const levelNineCourse: CourseDef = {
  id: "chinese-level-9",
  title: t("Chinese Level 9", "中文九级"),
  description: t(
    "Level 9 of Chinese as a foreign language, the last third of the advanced levels 7 to 9: 400 more characters and 1,880 words in twelve units, from rhetoric, idioms and philosophy to character, the universe, the life sciences, international affairs, the media, architecture, crafts, sport and formal writing, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的九级课程，是高等七至九级的最后一部分：十二个单元，从修辞、成语和哲学到性格、天文、生命科学、国际事务、媒介、建筑、工艺、体育和公文，再学习 400 个汉字和 1880 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-8"],
  ...withConversations(9, level.units),
};
