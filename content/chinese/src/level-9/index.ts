// Level 9 of Chinese as a foreign language (docs/chinese-curriculum.md §8.3): the last third of levels 7 to 9 of
// GF 0025-2021, which the subject splits into three courses by frequency, 400 more characters in 40 batches and 1,880
// words in 188 batches, in twelve units of advanced topics, from rhetoric, idioms and philosophy to character, the
// universe, the life sciences, international affairs, the media, architecture, crafts, sport and formal writing. Each
// unit teaches its characters first, then words and sentences written only with the characters of levels 1 to 8 and
// those taught so far.

import { type CourseDef, type TopicDef, t } from "@ga/content";

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { buildLevel, type LevelUnit } from "../level-2/level.ts";
import { levelEightCharacters, levelEightLast, levelEightWords } from "../level-8/index.ts";
import { characterBatches1, wordBatches1 } from "./data-1.ts";
import { characterBatches2, wordBatches2 } from "./data-2.ts";
import { characterBatches3, wordBatches3 } from "./data-3.ts";
import { characterBatches4, wordBatches4 } from "./data-4.ts";
import { grammar } from "./grammar-data.ts";
import { sentences } from "./sentence-data.ts";

/** UNITS are the units of level 9. */
const UNITS: readonly LevelUnit[] = [
  { title: t("Language and Rhetoric", "语言和修辞"), characters: 4, words: 16 },
  { title: t("Idioms and Allusions", "成语和典故"), characters: 4, words: 16 },
  { title: t("Philosophy", "哲学"), characters: 4, words: 16 },
  { title: t("Behaviour and Character", "行为和性格"), characters: 4, words: 16 },
  { title: t("The Universe", "宇宙和天文"), characters: 3, words: 16 },
  { title: t("Life Sciences", "生命科学"), characters: 3, words: 16 },
  { title: t("International Affairs", "国际事务"), characters: 3, words: 16 },
  { title: t("Communication and the Media", "传播和媒介"), characters: 3, words: 16 },
  { title: t("Architecture and Planning", "建筑和规划"), characters: 3, words: 15 },
  { title: t("Crafts and Folk Customs", "工艺和民俗"), characters: 3, words: 15 },
  { title: t("Sport and Competition", "体育和竞技"), characters: 3, words: 15 },
  { title: t("Formal Writing", "公文和应用文"), characters: 3, words: 15 },
];

const level = buildLevel({
  level: 9,
  numeral: "九",
  units: UNITS,
  characterBatches: [...characterBatches1, ...characterBatches2, ...characterBatches3, ...characterBatches4],
  wordBatches: [...wordBatches1, ...wordBatches2, ...wordBatches3, ...wordBatches4],
  grammar,
  sentences,
  earlierCharacters: levelEightCharacters,
  earlierWords: levelEightWords,
  after: levelEightLast.words,
});

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
  units: level.units,
};
