// Grades 6 to 8: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a
// reading unit on the theme and a conversation that closes it.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const words = t("Words", "词汇");
const grammar = t("Grammar", "语法");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of four modules on a theme, leaving out a module with no topics and a missing reading unit. */
const unit = (
  title: Text,
  parts: { words: string[]; grammar: string[]; reading: string[]; writing: string[] },
  readingUnit: string | undefined,
  conversation: string,
): UnitDef => ({
  title,
  modules: [
    { title: words, topics: parts.words },
    { title: grammar, topics: parts.grammar },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  ...(readingUnit === undefined ? {} : { reading: [readingUnit] }),
  conversation,
});

const units: readonly UnitDef[] = [
  unit(
    t("Myths and Legends", "神话与传说"),
    {
      words: ["words-from-myths", "latin-roots-2"],
      grammar: ["relative-clauses", "pronoun-case"],
      reading: ["plot-and-conflict", "theme", "narrative-point-of-view"],
      writing: ["combining-with-relative-clauses", "retelling-a-myth"],
    },
    "myths-and-legends",
    "myth-retelling-for-a-podcast",
  ),
  unit(
    t("Poetry and Song", "诗歌与歌曲"),
    {
      words: ["words-for-tone-and-feeling", "connotation-and-precise-words"],
      grammar: ["appositives", "coordinate-adjectives"],
      reading: ["personification-and-hyperbole", "sound-devices", "tone-and-mood"],
      writing: ["combining-with-appositives", "responding-to-a-poem"],
    },
    "tales-and-poems",
    "poetry-night-introduction",
  ),
  unit(
    t("Ancient Rome", "古罗马"),
    {
      words: ["words-of-ancient-rome"],
      grammar: ["participial-phrases", "misplaced-modifiers"],
      reading: ["primary-and-secondary-sources"],
      writing: ["varying-sentence-openings", "writing-an-informative-paragraph"],
    },
    "ancient-rome",
    "roman-forum-tour-guide",
  ),
  unit(
    t("Making the Case", "摆事实讲道理"),
    {
      words: ["words-of-argument"],
      grammar: ["active-and-passive-voice", "verb-moods"],
      reading: ["claims", "evidence", "reasoning", "counterclaims-and-rebuttals"],
      writing: ["writing-a-thesis-statement", "outlining-an-argument", "writing-an-evidence-paragraph", "writing-a-counterclaim-paragraph"],
    },
    "making-the-case",
    "student-council-proposal",
  ),
  unit(
    t("Oceans and Ecosystems", "海洋与生态系统"),
    {
      words: ["words-of-ecosystems"],
      grammar: ["parallel-structure"],
      reading: ["citing-textual-evidence"],
      writing: ["cutting-wordiness", "writing-an-objective-summary"],
    },
    "life-in-the-ocean",
    "marine-biologist-interview",
  ),
  unit(
    t("Turning Points", "转折点"),
    {
      words: ["words-for-character-and-motive"],
      grammar: ["gerund-and-infinitive-phrases"],
      reading: ["irony", "foreshadowing-and-flashback"],
      writing: ["writing-a-literary-analysis-paragraph"],
    },
    "turning-points",
    "book-club-discussion",
  ),
  unit(
    t("Machines That Changed the World", "改变世界的机器"),
    {
      words: ["words-of-technology"],
      grammar: ["simple-compound-and-complex-sentences"],
      reading: ["comparing-texts-on-a-topic"],
      writing: ["combining-sentences-in-your-own-words", "introductions-and-conclusions"],
    },
    "machines-that-changed-the-world",
    "inventor-pitch",
  ),
  unit(
    t("Explorers and Voyages", "探险家与航行"),
    {
      words: ["words-of-exploration"],
      grammar: ["dashes-parentheses-and-ellipses"],
      reading: ["symbolism"],
      writing: ["revising-a-draft", "writing-a-narrative-from-a-point-of-view"],
    },
    "explorers-and-voyages",
    "expedition-planning-meeting",
  ),
];

/** course68 is the native course of grades 6 to 8. */
export const course68: CourseDef = {
  id: "english-grades-6-8",
  title: t("English, Grades 6 to 8", "英语：六至八年级"),
  description: t(
    "English for readers and writers of grades 6 to 8, in eight themed units from myths to voyages of exploration. Each unit teaches the words of its theme, grammar and punctuation, reading skills for stories, poems, arguments and informational texts, and a kind of writing together, and gives a set of passages to read on the theme. The pieces written in the course are judged by a model.",
    "面向六至八年级读者和写作者的英语课程，共八个主题单元，从神话到探险航行。每个单元同时教授该主题的词汇、语法和标点、阅读故事、诗歌、议论文和说明文的技能，以及一种写作，并提供一组围绕主题的阅读文章。课程中写的文章由模型评判。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  buildsOn: ["english-grades-3-5"],
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
