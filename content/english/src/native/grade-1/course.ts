// Grade 1: the course. Each unit is a theme and teaches phonics, sentence building, reading and writing together, with a
// reading unit on the theme, whose passages the unit's listening plays and whose sentences its speaking reads aloud.
// The phonics topics are those of the phonics course and keep their ids.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const phonics = t("Phonics", "自然拼读");
const grammar = t("Grammar", "语法");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of four modules on a theme, leaving out a module with no topics. */
const unit = (
  title: Text,
  parts: { phonics: string[]; grammar: string[]; reading: string[]; writing: string[] },
  readingUnit: string,
): UnitDef => ({
  title,
  modules: [
    { title: phonics, topics: parts.phonics },
    { title: grammar, topics: parts.grammar },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  reading: [readingUnit],
});

const units: readonly UnitDef[] = [
  unit(
    t("All About Me", "关于我"),
    {
      phonics: ["capital-and-small-letters", "alphabetical-order", "first-and-last-letters"],
      grammar: ["starting-a-sentence-with-a-capital", "capitals-for-names"],
      reading: ["who-and-where-in-a-story"],
      writing: [],
    },
    "all-about-me",
  ),
  unit(
    t("Pets and Animals", "宠物和动物"),
    {
      phonics: ["reading-short-vowel-words", "spelling-short-vowel-words", "hearing-short-vowel-words", "saying-short-vowel-words"],
      grammar: ["naming-words", "one-and-more-than-one"],
      reading: ["rhyming-words"],
      writing: [],
    },
    "pets-and-animals",
  ),
  unit(
    t("Home and School", "家和学校"),
    {
      phonics: ["reading-words-with-digraphs", "spelling-words-with-digraphs", "hearing-words-with-digraphs", "saying-words-with-digraphs"],
      grammar: ["telling-and-asking-sentences", "word-order-in-a-sentence", "action-words"],
      reading: ["what-happens-first-next-and-last"],
      writing: ["a-sentence-tells-a-whole-idea"],
    },
    "home-and-school",
  ),
  unit(
    t("Weather and Seasons", "天气和季节"),
    {
      phonics: ["reading-words-with-blends", "spelling-words-with-blends", "hearing-words-with-blends", "saying-words-with-blends"],
      grammar: ["describing-words", "a-or-an"],
      reading: ["clapping-syllables"],
      writing: ["adding-a-describing-word"],
    },
    "weather-and-seasons",
  ),
  unit(
    t("Food and Friends", "食物和朋友"),
    {
      phonics: ["reading-sight-words", "spelling-sight-words"],
      grammar: ["he-she-it-and-they", "joining-with-and"],
      reading: ["finding-facts-in-a-text"],
      writing: [],
    },
    "food-and-friends",
  ),
  unit(
    t("Bugs and Growing Things", "小虫和生长的东西"),
    {
      phonics: [],
      grammar: [],
      reading: [],
      writing: ["writing-steps-with-first-and-next"],
    },
    "bugs-and-growing-things",
  ),
];

/** courseGrade1 is the English course of grade 1. */
export const courseGrade1: CourseDef = {
  id: "english-grade-1",
  title: t("English, Grade 1", "英语：一年级"),
  description: t(
    "Grade 1 English for native speakers, with an adult nearby, in six themes from *All About Me* to *Bugs and Growing Things*. Each theme teaches phonics, from letters and short vowels to digraphs, blends and sight words; building sentences, with capitals, end marks, word order, naming, action and describing words, plurals, *a* and *an*, *he*, *she*, *it* and *they*, and joining with *and*; reading short stories and texts of facts, for who and where, the order of events, facts, rhymes and syllables; and writing whole sentences, adding detail and telling steps in order. Each theme closes by listening to its passages read aloud and reading its sentences aloud.",
    "面向母语学习者的一年级英语，需要大人在旁陪伴，分六个主题，从《关于我》到《小虫和生长的东西》。每个主题都教自然拼读，从字母和短元音到二合字母、辅音连缀和常见词；教造句，包括大写、句末标点、词序、名称词、动作词、描述词、复数、*a* 和 *an*、*he*、*she*、*it*、*they* 以及用 *and* 连接；教读短故事和讲事实的短文，找出人物和地点、事情的顺序、事实、押韵和音节；还教写完整的句子、添加细节和按顺序写步骤。每个主题最后都要听本主题篇章的朗读，并大声朗读其中的句子。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-phonics"],
  units,
  reading: units.flatMap((u) => u.reading ?? []),
};
