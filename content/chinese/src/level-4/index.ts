// Level 4 of Chinese as a foreign language (docs/chinese-curriculum.md §8.4): 300 more characters in 30 batches and
// 1,000 words in 100 batches, in twelve units of intermediate topics, from health, travel and the media to history, the
// arts, the law, the economy, feelings, nature, sport, science and careers. Each unit teaches its characters first, then
// words and sentences written only with the characters of levels 1 to 3 and those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import { withConversations } from "../conversations.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel, type LevelUnit } from "../level-2/level.ts";
import { levelThreeCharacters, levelThreeLast, levelThreeWords } from "../level-3/index.ts";
import { characterBatches } from "./character-data.ts";
import { dialogues } from "./dialogue-data.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";
import { wordBatchesA } from "./word-data-a.ts";
import { wordBatchesB } from "./word-data-b.ts";
import { writing } from "./writing-data.ts";

/** UNITS are the units of level 4. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Health and Medicine", "健康和医疗"), characters: 3, words: 9 },
  { title: t("Travel and Transport", "旅行和交通"), characters: 3, words: 9 },
  { title: t("Media and the Internet", "媒体和网络"), characters: 3, words: 9 },
  { title: t("History", "历史"), characters: 3, words: 8 },
  { title: t("The Arts", "艺术"), characters: 3, words: 8 },
  { title: t("Law and Rights", "法律和权利"), characters: 3, words: 9 },
  { title: t("The Economy", "经济"), characters: 3, words: 9 },
  { title: t("Feelings", "情感"), characters: 2, words: 8 },
  { title: t("Nature and Climate", "自然和气候"), characters: 2, words: 8 },
  { title: t("Sport", "体育"), characters: 2, words: 8 },
  { title: t("Science", "科学"), characters: 2, words: 8 },
  { title: t("Careers", "职业"), characters: 1, words: 7 },
];

const level = buildLevel({
  level: 4,
  numeral: "四",
  units: UNITS,
  characterBatches,
  wordBatches: [...wordBatchesA, ...wordBatchesB],
  grammar,
  sentences,
  writing,
  dialogues,
  earlierCharacters: levelThreeCharacters,
  earlierWords: levelThreeWords,
  after: levelThreeLast.words,
});

/** levelFourCharacters are the characters of levels 1 to 4, by character. */
export const levelFourCharacters: ReadonlyMap<string, LevelOneCharacter> = level.characters;

/** levelFourWords are the words of levels 1 to 4. */
export const levelFourWords: readonly string[] = level.words;

/** levelFourLast are the last character topic and the last word topic of level 4. */
export const levelFourLast: { readonly characters: string; readonly words: string } = level.last;

/** levelFourTopics are the 203 topics of level 4: 30 of characters, 100 of words and 73 of grammar. */
export const levelFourTopics: readonly TopicDef[] = level.topics;

/** levelFourCourse is the course of level 4 of Chinese as a foreign language. */
export const levelFourCourse: CourseDef = {
  id: "chinese-level-4",
  title: t("Chinese Level 4", "中文四级"),
  description: t(
    "Level 4 of Chinese as a foreign language: 300 more characters and 1,000 words of intermediate topics in twelve units, from health, travel and the media to history, the arts, the law, the economy, feelings, nature, sport, science and careers, each word met in a sentence of characters already taught. Explanations are in the learner's language.",
    "面向把中文作为外语学习的人的四级课程：十二个单元，从健康、旅行和媒体到历史、艺术、法律、经济、情感、自然、体育、科学和职业，再学习 300 个汉字和 1000 个词语，每个词都放在只用学过的字写成的句子里。用学习者的语言讲解。",
  ),
  group: t("Chinese", "语文"),
  buildsOn: ["chinese-level-3"],
  ...withConversations(4, level.units),
};
