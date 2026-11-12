// Grade 7: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. The first two units gather topics of the band course of
// grades 6 to 8, which keep their ids.

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
    t("Making the Case", "摆事实讲道理"),
    {
      words: ["words-of-argument", "words-of-debate", "words-of-law-and-courts", "words-of-rules-and-policy"],
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
      words: ["words-of-ecosystems", "words-of-the-deep-sea", "words-of-tides-and-currents", "words-of-conservation"],
      grammar: ["parallel-structure", "plurals-from-latin-and-greek"],
      reading: ["citing-textual-evidence"],
      writing: ["cutting-wordiness", "writing-an-objective-summary", "keeping-a-summary-objective"],
    },
    "life-in-the-ocean",
    "marine-biologist-interview",
  ),
  unit(
    t("The Renaissance", "文艺复兴"),
    {
      words: ["words-of-the-renaissance", "words-of-science-in-the-renaissance", "words-of-artists-and-workshops", "latin-roots-4"],
      grammar: ["phrases-and-clauses", "adjective-and-adverb-clauses", "commas-with-interrupters"],
      reading: ["how-individuals-and-events-interact", "tracing-a-scientific-idea-over-time"],
      writing: ["organizing-by-category", "writing-an-informative-essay"],
    },
    "a-rebirth-of-ideas",
    "renaissance-workshop-apprentice",
  ),
  unit(
    t("Empires of West Africa", "西非诸帝国"),
    {
      words: ["words-of-west-african-empires", "words-of-the-saharan-trade", "words-of-scholars-and-books", "greek-roots-3"],
      grammar: ["past-perfect-for-earlier-events", "semicolons-between-clauses"],
      reading: ["reading-historical-maps", "comparing-fiction-and-history"],
      writing: ["using-period-details", "writing-historical-fiction", "writing-a-cause-and-effect-essay"],
    },
    "gold-salt-and-books",
    "timbuktu-manuscript-library",
  ),
  unit(
    t("Fighting Disease", "抗击疾病"),
    {
      words: ["words-of-infection", "words-of-medicine", "words-of-public-health", "suffixes-of-science-and-medicine"],
      grammar: ["passive-voice-in-science"],
      reading: [
        "reading-graphs-in-science",
        "correlation-or-cause",
        "distinguishing-observation-and-inference",
        "checking-a-claim-against-the-evidence",
      ],
      writing: ["reporting-numbers-from-a-graph", "writing-a-lab-conclusion", "writing-a-report-with-data"],
    },
    "the-invisible-enemy",
    "school-nurse-flu-season",
  ),
  unit(
    t("Money and Business", "金钱与商业"),
    {
      words: ["words-of-money", "words-of-business", "words-of-choices-and-costs", "suffixes-that-form-adjectives"],
      grammar: ["agreement-with-tricky-subjects"],
      reading: ["how-sections-of-a-text-work-together"],
      writing: ["eliminating-redundancy"],
    },
    "what-money-does",
    "small-business-loan",
  ),
  unit(
    t("Imagined Futures", "想象的未来"),
    {
      words: ["words-of-science-fiction", "words-of-controlled-societies", "words-for-states-of-mind", "more-idioms"],
      grammar: ["shifts-in-verb-mood", "dangling-modifiers"],
      reading: ["how-story-elements-interact", "contrasting-points-of-view", "how-dialogue-reveals-character"],
      writing: ["pacing-with-sentence-length", "writing-a-suspense-story"],
    },
    "tomorrows-worlds",
    "book-club-dystopia",
  ),
  unit(
    t("Rights and Reform", "权利与变革"),
    {
      words: ["words-of-rights-and-equality", "words-of-protest-and-reform", "words-of-speeches", "latin-roots-5"],
      grammar: ["the-subjunctive-in-demands-and-proposals", "pronouns-in-compound-subjects-and-objects"],
      reading: ["relevant-and-sufficient-evidence", "how-a-speaker-builds-an-argument", "loaded-language"],
      writing: ["writing-a-call-to-action", "writing-a-five-paragraph-argument", "writing-a-persuasive-speech"],
    },
    "voices-for-change",
    "town-hall-speech-practice",
  ),
  unit(
    t("Flight", "飞行"),
    {
      words: ["words-of-flight", "words-of-pilots-and-airports", "words-of-trial-and-error", "greek-roots-4"],
      grammar: ["spelling-words-with-suffixes"],
      reading: ["integrating-text-and-diagrams"],
      writing: ["explaining-with-an-analogy"],
    },
    "taking-to-the-air",
    "control-tower-visit",
  ),
  unit(
    t("News and Media", "新闻与媒体"),
    {
      words: ["words-of-news", "words-of-advertising", "words-of-the-internet", "euphemisms"],
      grammar: ["commonly-confused-words-3"],
      reading: ["advertising-techniques"],
      writing: ["writing-a-headline-and-lead"],
    },
    undefined,
    "news-editor-headline",
  ),
];

/** courseGrade7 is the native course of grade 7. */
export const courseGrade7: CourseDef = {
  id: "english-grade-7",
  title: t("English, Grade 7", "英语：七年级"),
  description: t(
    "English for readers and writers of grade 7, in ten themed units from making the case and the oceans to the Renaissance, the empires of West Africa, the fight against disease, money and business, imagined futures, rights and reform, flight and the news. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The essays, stories, reports, arguments and speeches written in the course are judged by a model.",
    "面向七年级读者和写作者的英语课程，共十个主题单元，从摆事实讲道理和海洋到文艺复兴、西非诸帝国、抗击疾病、金钱与商业、想象的未来、权利与变革、飞行和新闻。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的论说文、故事、报告、议论文和演讲稿由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-6"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
