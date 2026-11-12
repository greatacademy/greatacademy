// Grades 9 to 12: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a
// reading unit on the theme and a conversation that closes it. The topics of the skill course of rhetoric are
// regrouped here by theme.

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
    t("The Writer's Craft", "作家的技艺"),
    {
      words: ["words-for-literary-analysis"],
      grammar: ["semicolons-and-colons"],
      reading: ["characterization", "allusion"],
      writing: ["writing-a-literary-analysis-essay"],
    },
    "the-writers-craft",
    "seminar-on-a-short-story",
  ),
  unit(
    t("Voices of Persuasion", "说服之声"),
    {
      words: ["words-of-rhetoric"],
      grammar: ["periodic-and-cumulative-sentences"],
      reading: ["rhetorical-situation", "rhetorical-appeals", "rhetorical-devices"],
      writing: ["writing-a-rhetorical-analysis"],
    },
    "voices-of-persuasion",
    "speech-coaching-session",
  ),
  unit(
    t("Tragedy and the Stage", "悲剧与舞台"),
    {
      words: ["words-of-the-theater"],
      grammar: ["conditional-sentences"],
      reading: ["dramatic-structure-and-dialogue", "paradox-and-oxymoron"],
      writing: ["writing-a-scene"],
    },
    "tragedy-on-the-stage",
    "director-casting-discussion",
  ),
  unit(
    t("Rights and Laws", "权利与法律"),
    {
      words: ["words-of-government-and-law"],
      grammar: ["absolute-phrases"],
      reading: ["logical-fallacies"],
      writing: ["writing-an-argumentative-essay"],
    },
    "rights-and-laws",
    "mock-trial-witness",
  ),
  unit(
    t("Science and Society", "科学与社会"),
    {
      words: ["words-of-scientific-inquiry"],
      grammar: ["noun-clauses"],
      reading: ["evaluating-sources"],
      writing: ["synthesizing-sources"],
    },
    "science-and-society",
    "science-fair-judge-questions",
  ),
  unit(
    t("A Century of Change", "百年变迁"),
    {
      words: ["words-of-modern-history"],
      grammar: ["integrating-quotations"],
      reading: ["analyzing-historical-documents"],
      writing: ["writing-an-explanatory-essay"],
    },
    "a-century-of-change",
    "oral-history-interview",
  ),
  unit(
    t("Poems Across Time", "穿越时代的诗歌"),
    {
      words: ["words-for-poetic-form"],
      grammar: ["word-order-for-emphasis"],
      reading: ["poetic-forms-and-meter"],
      writing: ["writing-a-poetry-analysis"],
    },
    "poems-across-time",
    "poetry-workshop-feedback",
  ),
  unit(
    t("Essays of Experience", "经验之文"),
    {
      words: ["words-for-reflection"],
      grammar: ["sentence-variety-for-effect"],
      reading: ["reading-personal-essays"],
      writing: ["writing-a-personal-essay", "writing-a-college-application-essay"],
    },
    "essays-of-experience",
    "college-admissions-interview",
  ),
];

/** course912 is the native course of grades 9 to 12. */
export const course912: CourseDef = {
  id: "english-grades-9-12",
  title: t("English, Grades 9 to 12", "英语：九至十二年级"),
  description: t(
    "English for readers and writers of high school, in eight themed units from the writer's craft to essays of experience. Each unit teaches the words of its theme, control of the sentence, reading skills for literature, drama, poetry, speeches and historical and scientific writing, and a kind of essay together, and gives a set of passages to read on the theme. The essays written in the course are judged by a model.",
    "面向高中读者和写作者的英语课程，共八个主题单元，从作家的技艺到经验之文。每个单元同时教授该主题的词汇、对句子的驾驭、阅读文学、戏剧、诗歌、演讲以及历史和科学文章的技能，以及一种文章的写作，并提供一组围绕主题的阅读文章。课程中写的文章由模型评判。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  buildsOn: ["english-grade-8"],
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
