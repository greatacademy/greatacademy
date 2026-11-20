// Grade 2: the course. Each unit is a theme and teaches phonics, sentence building, words, reading and writing
// together, with a reading unit on the theme, whose passages the unit's listening plays and whose sentences its speaking
// reads aloud. The phonics topics are those of the phonics course and keep their ids.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const phonics = t("Phonics", "自然拼读");
const grammar = t("Grammar", "语法");
const words = t("Words", "词汇");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of five modules on a theme, leaving out a module with no topics. */
const unit = (
  title: Text,
  parts: { phonics: string[]; grammar: string[]; words: string[]; reading: string[]; writing: string[] },
  readingUnit: string,
): UnitDef => ({
  title,
  modules: [
    { title: phonics, topics: parts.phonics },
    { title: grammar, topics: parts.grammar },
    { title: words, topics: parts.words },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  reading: [readingUnit],
});

const units: readonly UnitDef[] = [
  unit(
    t("Long Ago and Today", "过去和现在"),
    {
      phonics: ["reading-words-with-silent-e", "spelling-words-with-silent-e", "hearing-words-with-silent-e", "saying-words-with-silent-e"],
      grammar: ["past-tense-with-ed", "irregular-past-verbs"],
      words: [],
      reading: ["beginning-middle-and-end"],
      writing: [],
    },
    "long-ago-and-today",
  ),
  unit(
    t("Our Neighborhood", "我们的社区"),
    {
      phonics: [
        "reading-words-with-vowel-teams",
        "spelling-words-with-vowel-teams",
        "hearing-words-with-vowel-teams",
        "saying-words-with-vowel-teams",
      ],
      grammar: ["is-are-was-were", "owning-with-apostrophe-s"],
      words: [],
      reading: ["the-main-topic-of-a-text"],
      writing: [],
    },
    "our-neighborhood",
  ),
  unit(
    t("Animals Big and Small", "大大小小的动物"),
    {
      phonics: [],
      grammar: ["adjectives-that-compare", "irregular-plurals"],
      words: ["stronger-and-weaker-words"],
      reading: [],
      writing: ["facts-that-belong-together"],
    },
    "animals-big-and-small",
  ),
  unit(
    t("Tales to Tell", "讲故事"),
    {
      phonics: [],
      grammar: ["making-contractions"],
      words: [],
      reading: ["how-characters-feel"],
      writing: ["telling-a-story-in-order"],
    },
    "tales-to-tell",
  ),
  unit(
    t("How Things Work", "东西是怎样工作的"),
    {
      phonics: [],
      grammar: ["and-but-and-or"],
      words: ["prefixes-un-and-re"],
      reading: [],
      writing: [],
    },
    "how-things-work",
  ),
  unit(
    t("Letters and Celebrations", "书信和庆祝"),
    {
      phonics: ["reading-decodable-sentences", "saying-decodable-sentences", "writing-decodable-sentences"],
      grammar: ["commas-in-letters"],
      words: [],
      reading: [],
      writing: ["writing-a-thank-you-note"],
    },
    "letters-and-celebrations",
  ),
];

/** courseGrade2 is the English course of grade 2. */
export const courseGrade2: CourseDef = {
  id: "english-grade-2",
  title: t("English, Grade 2", "英语：二年级"),
  description: t(
    "Grade 2 English for native speakers, in six themes from *Long Ago and Today* to *Letters and Celebrations*. Each theme teaches phonics, from words with a silent e and vowel teams to whole short sentences; grammar, with the past in *-ed* and past verbs that change, *is*, *are*, *was* and *were*, owning with *'s*, comparing with *-er* and *-est*, plurals that change, contractions, *and*, *but* and *or*, and the commas of a letter; words, with the prefixes *un-* and *re-* and shades of meaning; reading stories, fables and texts of facts, for their beginning, middle and end, their main topic and how characters feel; and writing a story in order, a short report and a thank-you note. Each theme closes by listening to its passages read aloud and reading its sentences aloud.",
    "面向母语学习者的二年级英语，分六个主题，从《过去和现在》到《书信和庆祝》。每个主题都教自然拼读，从含不发音 e 的词和元音组合到完整的短句；教语法，包括用 *-ed* 表示过去和不规则的过去式、*is*、*are*、*was* 和 *were*、用 *'s* 表示所属、用 *-er* 和 *-est* 比较、不规则复数、缩写形式、*and*、*but* 和 *or*，以及书信中的逗号；教词汇，包括前缀 *un-* 和 *re-* 以及词义的细微差别；教读故事、寓言和讲事实的短文，理解它们的开头、中间和结尾、主题以及人物的感受；还教按顺序写故事、写短小的报告和感谢便条。每个主题最后都要听本主题篇章的朗读，并大声朗读其中的句子。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-1"],
  units,
  reading: units.flatMap((u) => u.reading ?? []),
};
