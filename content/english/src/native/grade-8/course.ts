// Grade 8: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. The first three units gather topics of the band course of
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
    t("Turning Points", "转折点"),
    {
      words: [
        "words-for-character-and-motive",
        "words-of-crisis-and-upheaval",
        "words-of-regret-and-redemption",
        "words-of-story-structure",
      ],
      grammar: ["gerund-and-infinitive-phrases", "identifying-verbals"],
      reading: ["irony", "foreshadowing-and-flashback", "how-incidents-propel-the-action", "dramatic-irony"],
      writing: ["writing-a-literary-analysis-paragraph"],
    },
    "turning-points",
    "book-club-discussion",
  ),
  unit(
    t("Machines That Changed the World", "改变世界的机器"),
    {
      words: ["words-of-technology", "words-of-engines", "words-of-computers", "words-of-the-machine-age"],
      grammar: ["simple-compound-and-complex-sentences", "commas-in-complex-sentences", "choosing-the-subordinating-conjunction"],
      reading: ["comparing-texts-on-a-topic", "how-a-paragraph-is-built"],
      writing: ["combining-sentences-in-your-own-words", "introductions-and-conclusions", "summarizing-a-technical-text"],
    },
    "machines-that-changed-the-world",
    "inventor-pitch",
  ),
  unit(
    t("Explorers and Voyages", "探险与航行"),
    {
      words: ["words-of-exploration", "words-of-navigation-at-sea", "words-of-life-aboard-ship", "words-of-perils-at-sea"],
      grammar: ["dashes-parentheses-and-ellipses", "ellipses-in-quotations"],
      reading: ["symbolism", "conflicting-accounts-of-one-event"],
      writing: ["revising-a-draft", "writing-a-narrative-from-a-point-of-view"],
    },
    "explorers-and-voyages",
    "expedition-planning-meeting",
  ),
  unit(
    t("The Age of Revolutions", "革命时代"),
    {
      words: ["words-of-revolution", "words-of-founding-documents", "words-of-slavery-and-abolition", "latin-roots-6"],
      grammar: ["the-subjunctive-in-wishes-and-conditions"],
      reading: ["reading-a-founding-document", "acknowledging-conflicting-viewpoints"],
      writing: ["quoting-a-primary-source", "writing-an-argument-about-history"],
    },
    "the-age-of-revolutions",
    "town-meeting-1775",
  ),
  unit(
    t("Smoke and Steam", "烟与蒸汽"),
    {
      words: ["words-of-factories-and-mills", "words-of-coal-and-railways", "words-of-workers-and-cities", "suffixes-that-form-nouns"],
      grammar: ["parallel-verbals", "shifts-in-voice"],
      reading: ["tracking-a-central-idea", "facts-interpretations-and-judgments"],
      writing: ["using-statistics-in-a-sentence", "writing-an-informative-report-from-sources"],
    },
    "smoke-and-steam",
    "mill-inspector-visit",
  ),
  unit(
    t("The Story of Life", "生命的故事"),
    {
      words: ["words-of-evolution", "words-of-classifying-life", "words-of-fossils-and-genes", "greek-roots-5"],
      grammar: ["hyphenating-compound-modifiers"],
      reading: ["evaluating-a-scientific-argument", "irrelevant-evidence"],
      writing: ["qualifying-a-claim", "writing-a-scientific-explanation"],
    },
    "the-story-of-life",
    "museum-fossil-hall",
  ),
  unit(
    t("Tales of Dread", "恐怖故事"),
    {
      words: ["words-of-gloom-and-horror", "words-of-ghosts-and-haunting", "words-of-madness-and-despair"],
      grammar: ["who-whoever-whom-whomever"],
      reading: ["unreliable-narrators", "recognizing-gothic-elements"],
      writing: ["creating-atmosphere-with-sensory-details", "writing-a-gothic-tale"],
    },
    "tales-of-dread",
    "ghost-story-night",
  ),
  unit(
    t("The Globe and Its Plays", "环球剧场及其戏剧"),
    {
      words: ["words-of-the-elizabethan-stage", "words-of-courts-and-feuds", "early-modern-english-words"],
      grammar: ["reading-inverted-sentences"],
      reading: ["reading-a-scene-of-shakespeare", "comparing-a-play-and-its-production"],
      writing: ["writing-stage-directions", "writing-a-scene-for-the-stage"],
    },
    "the-globe-and-its-plays",
    "director-casting-call",
  ),
  unit(
    t("Journeys to a New Home", "迁往新家园"),
    {
      words: ["words-of-migration", "words-of-new-lives", "words-of-diplomacy"],
      grammar: ["prepositions-before-relative-pronouns"],
      reading: ["reading-an-oral-history", "comparing-a-memoir-and-a-report"],
      writing: ["interviewing-and-quoting-a-person", "writing-a-reflective-essay"],
    },
    "journeys-to-a-new-home",
    "family-journey-interview",
  ),
  unit(
    t("Right and Wrong", "是与非"),
    {
      words: [
        "words-of-right-and-wrong",
        "words-of-good-character",
        "words-of-politics-and-power",
        "words-for-talking-about-language",
        "words-that-changed-meaning",
      ],
      grammar: ["commonly-confused-words-4"],
      reading: ["how-modern-stories-use-old-tales", "evaluating-an-argument-as-a-whole"],
      writing: ["writing-an-essay-on-a-retold-tale"],
    },
    undefined,
    "ethics-club-debate",
  ),
  unit(
    t("The Organs, the Blood and Waves", "器官、血液与波"),
    {
      words: ["words-of-the-organs", "words-of-blood", "words-of-waves"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Food Webs, the Newsroom and Banking", "食物网、新闻编辑室与银行"),
    {
      words: ["words-of-food-webs", "words-of-the-newsroom", "words-of-banking"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
];

/** courseGrade8 is the native course of grade 8. */
export const courseGrade8: CourseDef = {
  id: "english-grade-8",
  title: t("English, Grade 8", "英语：八年级"),
  description: t(
    "English for readers and writers of grade 8, in ten themed units from turning points in stories, machines and voyages to the age of revolutions, the industrial age, the story of life, tales of dread, Shakespeare's stage, journeys to a new home and questions of right and wrong. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The arguments, reports, explanations, tales, scenes and essays written in the course are judged by a model. Two more units teach words alone, ten to a batch: the organs, the blood and waves, and food webs, the newsroom and banking.",
    "面向八年级读者和写作者的英语课程，共十个主题单元，从故事中的转折点、机器和航行到革命时代、工业时代、生命的故事、恐怖故事、莎士比亚的舞台、迁往新家园以及是与非的问题。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的议论文、报告、科学解释、故事、剧本和文章由模型评判。另有两个单元只教词汇，每组十个词：器官、血液与波，以及食物网、新闻编辑室与银行。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-7"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
