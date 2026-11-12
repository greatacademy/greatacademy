// Grade 10: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. Two units gather topics of the band course of grades 9 to 12,
// which keep their ids.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const words = t("Words", "词汇");
const grammar = t("Grammar", "语法");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of four modules on a theme, leaving out a module with no topics, a missing reading unit and a missing conversation. */
const unit = (
  title: Text,
  parts: { words: string[]; grammar: string[]; reading: string[]; writing: string[] },
  readingUnit: string | undefined,
  conversation?: string,
): UnitDef => ({
  title,
  modules: [
    { title: words, topics: parts.words },
    { title: grammar, topics: parts.grammar },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  ...(readingUnit === undefined ? {} : { reading: [readingUnit] }),
  ...(conversation === undefined ? {} : { conversation }),
});

const units: readonly UnitDef[] = [
  unit(
    t("Voices of Persuasion", "说服之声"),
    {
      words: ["words-of-rhetoric", "words-of-argument-and-reasoning"],
      grammar: ["periodic-and-cumulative-sentences", "parallelism-and-antithesis"],
      reading: ["rhetorical-situation", "rhetorical-appeals", "rhetorical-devices"],
      writing: ["writing-a-rhetorical-analysis"],
    },
    "voices-of-persuasion",
    "speech-coaching-session",
  ),
  unit(
    t("Poems Across Time", "穿越时代的诗歌"),
    {
      words: ["words-for-poetic-form", "words-for-poetic-devices"],
      grammar: ["fragments-and-questions-for-effect", "word-order-for-emphasis"],
      reading: ["poetic-forms-and-meter", "ambiguity-and-interpretation"],
      writing: ["writing-a-poetry-analysis"],
    },
    "poems-across-time",
    "poetry-workshop-feedback",
  ),
  unit(
    t("Ambition and Power", "野心与权力"),
    {
      words: ["words-of-ambition-and-tyranny", "words-of-loyalty-and-betrayal", "words-of-guilt-and-conscience"],
      grammar: ["some-of-whom-and-whose"],
      reading: ["complex-characters-and-motives"],
      writing: ["stating-a-theme", "writing-a-thematic-analysis"],
    },
    "ambition-and-power",
    "ambition-in-a-play-debate",
  ),
  unit(
    t("War and Memory", "战争与记忆"),
    {
      words: ["words-of-war-and-conflict", "words-of-memory-and-witness"],
      grammar: ["active-and-passive-for-emphasis"],
      reading: ["tone-shifts-in-a-text"],
      writing: ["writing-a-comparison-of-two-texts"],
    },
    "war-and-memory",
    "war-memorial-design-meeting",
  ),
  unit(
    t("The Natural World", "自然世界"),
    {
      words: ["words-of-ecology-and-climate", "words-of-landscapes-and-weather"],
      grammar: ["subordination-for-emphasis"],
      reading: ["extended-metaphor"],
      writing: ["writing-a-descriptive-essay-on-a-place"],
    },
    "the-natural-world",
    "wetland-hearing",
  ),
  unit(
    t("Media and Truth", "媒体与真相"),
    {
      words: ["words-of-journalism-and-ethics", "words-of-media-and-attention"],
      grammar: [],
      reading: ["identifying-bias-in-the-news", "how-numbers-can-mislead"],
      writing: ["keeping-an-objective-tone", "writing-an-editorial"],
    },
    "media-and-truth",
    "newsroom-editorial-meeting",
  ),
  unit(
    t("Money and Work", "金钱与工作"),
    {
      words: ["words-of-economics", "words-of-careers-and-employment"],
      grammar: [],
      reading: [],
      writing: ["showing-qualifications-with-evidence", "writing-a-letter-of-application"],
    },
    "money-and-work",
    "summer-job-interview",
  ),
  unit(
    t("Satire and Humor", "讽刺与幽默"),
    {
      words: ["words-of-satire-and-wit", "words-of-folly-and-vanity"],
      grammar: [],
      reading: ["understanding-satire"],
      writing: ["writing-a-satire"],
    },
    "satire-and-humor",
    "satire-writers-room",
  ),
  unit(
    t("Roots and Parts", "词根与词缀"),
    {
      words: ["latin-roots-8", "greek-roots-7", "word-parts-that-form-adjectives", "academic-words-6", "academic-words-7"],
      grammar: ["commonly-confused-words-6"],
      reading: [],
      writing: [],
    },
    undefined,
    "word-roots-challenge",
  ),
  unit(
    t("Puzzles, Hands and Fire", "困惑、动作与火"),
    {
      words: ["words-of-puzzling-and-pondering", "words-of-rough-handling", "words-of-fire-and-heat", "words-of-crowds-and-gatherings"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Blocking, Urging and Loathing", "阻挠、劝诱与憎恶"),
    {
      words: [
        "words-of-blocking-and-breaking",
        "words-of-coaxing-and-urging",
        "words-of-flinching-and-fretting",
        "words-of-loathing-and-bullying",
      ],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
];

/** courseGrade10 is the native course of grade 10. */
export const courseGrade10: CourseDef = {
  id: "english-grade-10",
  title: t("English, Grade 10", "英语：十年级"),
  description: t(
    "English for readers and writers of grade 10, in nine themed units from voices of persuasion and poems across time to ambition and power, war and memory, the natural world, media and truth, money and work, satire and humor and the roots and parts of words. Each unit teaches the words of its theme, grammar and style, reading skills and a kind of writing together, and most give a set of passages to read on the theme. The analyses, comparisons, descriptions, editorials, letters and satires written in the course are judged by a model.",
    "面向十年级读者和写作者的英语课程，共九个主题单元，从说服之声和穿越时代的诗歌，到野心与权力、战争与记忆、自然世界、媒体与真相、金钱与工作、讽刺与幽默以及词根与词缀。每个单元同时教授该主题的词汇、语法和文体、阅读技能和一种写作，大多数单元还提供一组围绕主题的阅读文章。课程中写的分析、比较、描写、社论、求职信和讽刺文由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-9"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
