// College writing: the course. Each unit is a theme and teaches words, sentences and style, reading and writing
// together, with a reading unit on the theme and a conversation that closes it.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const words = t("Words", "词汇");
const style = t("Sentences and Style", "句子与文风");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of four modules on a theme, leaving out a module with no topics and a missing reading unit. */
const unit = (
  title: Text,
  parts: { words: string[]; style: string[]; reading: string[]; writing: string[] },
  readingUnit: string | undefined,
  conversation: string,
): UnitDef => ({
  title,
  modules: [
    { title: words, topics: parts.words },
    { title: style, topics: parts.style },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  ...(readingUnit === undefined ? {} : { reading: [readingUnit] }),
  conversation,
});

const units: readonly UnitDef[] = [
  unit(
    t("Reading Academic Prose", "阅读学术文章"),
    {
      words: ["words-of-academic-discourse"],
      style: ["hedging-and-qualification"],
      reading: ["reading-academic-arguments"],
      writing: ["writing-a-critical-summary"],
    },
    "academic-prose",
    "professor-office-hours",
  ),
  unit(
    t("Questions and Sources", "问题与资料"),
    {
      words: ["words-of-research"],
      style: ["verbs-for-citing-sources"],
      reading: ["finding-scholarly-sources"],
      writing: ["forming-a-research-question", "writing-an-annotated-bibliography"],
    },
    "research-in-practice",
    "librarian-research-consultation",
  ),
  unit(
    t("Using Sources Honestly", "诚实地使用资料"),
    {
      words: ["words-of-evidence-and-inference"],
      style: ["quoting-and-paraphrasing", "citing-in-mla-and-apa"],
      reading: ["tracing-claims-to-sources"],
      writing: ["writing-a-paraphrase"],
    },
    "the-ethics-of-knowledge",
    "writing-center-citation-help",
  ),
  unit(
    t("The Research Paper", "研究论文"),
    {
      words: ["words-of-scholarly-argument"],
      style: ["cohesion-old-before-new"],
      reading: ["reading-a-research-paper"],
      writing: ["writing-a-literature-review", "writing-a-research-paper"],
    },
    "inside-a-research-paper",
    "peer-review-workshop",
  ),
  unit(
    t("Style and Clarity", "文风与清晰"),
    {
      words: ["words-often-misused"],
      style: ["clear-sentences-characters-and-actions"],
      reading: ["analyzing-prose-style"],
      writing: ["revising-for-clarity"],
    },
    "essays-on-writing",
    "editor-style-review",
  ),
  unit(
    t("Numbers in Arguments", "论证中的数字"),
    {
      words: ["words-of-statistics"],
      style: ["numbers-in-writing"],
      reading: ["reading-charts-and-statistics"],
      writing: ["writing-about-data"],
    },
    "numbers-in-the-news",
    "presenting-findings-to-a-panel",
  ),
  unit(
    t("Writing at Work", "职场写作"),
    {
      words: ["words-of-the-workplace"],
      style: ["tone-and-register-at-work"],
      reading: ["reading-workplace-documents"],
      writing: ["writing-a-professional-email", "writing-a-memo", "writing-a-cover-letter"],
    },
    "writing-at-work",
    "job-interview-practice",
  ),
  unit(
    t("Proposals and Reports", "提案与报告"),
    {
      words: ["words-of-planning-and-proposals"],
      style: ["parallel-lists-and-headings"],
      reading: ["reading-requests-for-proposals"],
      writing: ["writing-an-executive-summary", "writing-a-research-proposal"],
    },
    "plans-that-worked",
    "client-project-meeting",
  ),
];

/** courseCollege is the native course of college writing. */
export const courseCollege: CourseDef = {
  id: "english-college-writing",
  title: t("College Writing", "大学写作"),
  description: t(
    "English for academic and professional writing at university, in eight themed units from reading academic prose to proposals and reports. Each unit teaches the words of its theme, a matter of style or citation, a reading skill for research articles, data or workplace documents, and a kind of writing together, from the critical summary and the research paper to the memo, the cover letter and the research proposal. The writing in the course is judged by a model.",
    "面向大学学术写作和职业写作的英语课程，共八个主题单元，从阅读学术文章到提案与报告。每个单元同时教授该主题的词汇、一项文风或引用规范、一种阅读研究文章、数据或职场文件的技能，以及一种写作，从评述性摘要和研究论文到备忘录、求职信和研究计划书。课程中的写作由模型评判。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  buildsOn: ["english-grade-12"],
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
