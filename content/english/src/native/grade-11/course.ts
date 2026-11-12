// Grade 11: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. Three units gather topics of the band course of grades 9 to 12,
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
    t("Dreams and Promises", "梦想与承诺"),
    {
      words: ["words-of-wealth-and-class", "words-of-hope-and-disillusion"],
      grammar: ["reducing-nominalizations"],
      reading: ["unstated-assumptions"],
      writing: ["summarizing-an-opposing-view-fairly", "writing-a-critique-of-an-argument"],
    },
    "dreams-and-promises",
    "american-dream-panel",
  ),
  unit(
    t("Nature and the Self", "自然与自我"),
    {
      words: ["words-of-nature-and-the-self", "words-of-solitude-and-simplicity"],
      grammar: [],
      reading: ["motifs-in-a-story"],
      writing: ["moving-between-concrete-and-abstract", "writing-a-meditative-essay"],
    },
    "nature-and-the-self",
    "nature-journal-sharing",
  ),
  unit(
    t("Justice and Protest", "正义与抗议"),
    {
      words: ["words-of-justice-and-protest", "words-of-equality-and-freedom"],
      grammar: ["restrictive-and-nonrestrictive-elements"],
      reading: ["comparing-arguments-on-one-issue"],
      writing: ["conclusions-that-widen-the-view", "writing-an-open-letter"],
    },
    "justice-and-protest",
    "student-protest-planning",
  ),
  unit(
    t("Between Two Worlds", "两个世界之间"),
    {
      words: ["words-of-migration-and-identity", "words-of-home-and-exile"],
      grammar: ["mixed-constructions"],
      reading: ["free-indirect-discourse"],
      writing: ["writing-a-narrative-of-two-worlds"],
    },
    "between-two-worlds",
    "welcoming-a-new-student",
  ),
  unit(
    t("Machines and Makers", "机器与制造者"),
    {
      words: ["words-of-industry-and-labor", "words-of-machines-and-ethics"],
      grammar: [],
      reading: [],
      writing: ["writing-an-analysis-of-a-motif"],
    },
    "machines-and-makers",
    "automation-town-meeting",
  ),
  unit(
    t("Roots and Parts", "词根与词缀"),
    {
      words: ["latin-roots-9", "greek-roots-8", "word-parts-that-form-nouns", "academic-words-8", "academic-words-9"],
      grammar: ["commonly-confused-words-7"],
      reading: [],
      writing: [],
    },
    undefined,
    "etymology-detective",
  ),
  unit(
    t("Easing and Society", "缓解与交往"),
    {
      words: ["words-of-easing-and-stopping", "words-of-sociable-and-solitary-people", "words-of-nerve-and-offense"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Skill and Dullness", "技艺与乏味"),
    {
      words: ["words-of-skill-and-clumsiness", "words-of-dull-and-stale-things"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Scorn and Trickery", "蔑视与欺诈"),
    {
      words: ["words-of-scolding-and-scorn", "words-of-harm-and-trickery", "words-of-care-and-carelessness"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Firm Minds and Measures", "坚定心志与多少"),
    {
      words: ["words-of-firm-and-fickle-minds", "words-of-much-and-little", "words-of-holding-and-letting-go"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Feeling and Belief", "情感与信念"),
    {
      words: ["words-of-dislike-and-levity", "words-of-doubt-and-belief"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Excellence and Hardship", "卓越与艰苦"),
    {
      words: ["words-of-excellence-and-awe", "words-of-harshness-and-hardship", "words-of-ranks-and-types"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Company and Whims", "相处与心血来潮"),
    {
      words: ["words-of-company-and-candor", "words-of-leanings-and-whims", "words-of-the-relentless-and-the-calm"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Writing and Means", "写作与办法"),
    {
      words: ["words-for-trimming-and-padding-writing", "words-of-means-that-work", "words-of-yielding-and-resisting"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Dark and Daily Times", "黑暗与日常"),
    {
      words: ["words-of-dark-times", "words-of-the-commonplace-and-the-spreading"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Minds and Characters", "思维与人物"),
    {
      words: ["words-of-hazy-and-sharp-thinking", "words-for-characters-in-company", "words-of-the-fleeting-and-the-sharp"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Process", "表示过程的学术词"),
    {
      words: ["words-for-starting-and-finishing", "words-for-more-and-less"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Structure", "表示结构的学术词"),
    {
      words: ["words-for-joining-and-matching", "words-for-limiting-and-keeping"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Sight and Sorting", "表示视觉与分类的学术词"),
    {
      words: ["words-for-showing-and-seeing", "words-for-sorting-and-differing", "words-for-supporting-and-making-up"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Study and Work", "表示研究与工作的学术词"),
    {
      words: ["words-for-research-and-numbers", "words-for-roles-and-institutions"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Ideas and Places", "表示观念与地点的学术词"),
    {
      words: ["words-for-thinking-ahead", "words-for-places-and-moving"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Writing and Getting", "表示写作与获取的学术词"),
    {
      words: ["words-for-drafting-and-editing", "words-for-gaining-and-giving", "words-for-meeting-and-talking"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Parts and Rank", "表示部分与主次的学术词"),
    {
      words: ["words-for-inside-and-outside", "words-for-exactness-and-rank"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Academic Words of Change and Reach", "表示变化与普及的学术词"),
    {
      words: ["words-for-changing-and-handling", "words-for-fitting-and-spreading"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
];

/** courseGrade11 is the native course of grade 11. */
export const courseGrade11: CourseDef = {
  id: "english-grade-11",
  title: t("English, Grade 11", "英语：十一年级"),
  description: t(
    "English for readers and writers of grade 11, in nine themed units from rights and laws, a century of change and science and society to dreams and promises, nature and the self, justice and protest, life between two worlds, machines and makers and the roots and parts of words. Each unit teaches the words of its theme, grammar and style, reading skills and a kind of writing together, and most give a set of passages to read on the theme. The arguments, critiques, meditations, open letters, narratives and analyses written in the course are judged by a model.",
    "面向十一年级读者和写作者的英语课程，共九个主题单元，从权利与法律、百年变迁和科学与社会，到梦想与承诺、自然与自我、正义与抗议、两个世界之间、机器与制造者以及词根与词缀。每个单元同时教授该主题的词汇、语法和文体、阅读技能和一种写作，大多数单元还提供一组围绕主题的阅读文章。课程中写的议论文、评论、沉思随笔、公开信、叙事和分析由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-10"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
