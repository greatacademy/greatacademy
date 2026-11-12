// Grade 9: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
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
    t("The Writer's Craft", "作家的技艺"),
    {
      words: ["words-for-literary-analysis", "words-of-tone-and-attitude", "words-of-narrative-craft"],
      grammar: ["semicolons-and-colons", "kinds-of-phrases"],
      reading: ["characterization", "allusion", "the-cumulative-impact-of-word-choice"],
      writing: ["an-analytical-thesis", "analysis-not-summary", "writing-a-literary-analysis-essay"],
    },
    "the-writers-craft",
    "seminar-on-a-short-story",
  ),
  unit(
    t("Heroes and Epics", "英雄与史诗"),
    {
      words: ["words-of-epic-and-myth", "words-of-trials-and-quests", "words-of-honor-and-hospitality"],
      grammar: ["noun-adjective-and-adverb-clauses"],
      reading: ["epic-conventions", "the-heros-journey"],
      writing: ["writing-an-epic-simile", "writing-a-heros-trial"],
    },
    "heroes-and-epics",
    "epic-hero-debate",
  ),
  unit(
    t("Tragedy and the Stage", "悲剧与舞台"),
    {
      words: ["words-of-the-theater", "words-of-love-and-feuds", "words-of-fate-and-fortune"],
      grammar: ["conditional-sentences", "the-literary-present"],
      reading: ["dramatic-structure-and-dialogue", "paradox-and-oxymoron", "soliloquy-and-aside", "tragic-heroes-and-flaws"],
      writing: [
        "citing-lines-of-plays-and-poems",
        "introducing-and-explaining-evidence",
        "writing-a-scene",
        "writing-an-analysis-of-a-soliloquy",
      ],
    },
    "tragedy-on-the-stage",
    "director-casting-discussion",
  ),
  unit(
    t("Coming of Age", "成长"),
    {
      words: ["words-of-growing-up", "words-of-family-and-belonging", "words-of-courage-and-fear"],
      grammar: ["complements-and-objects"],
      reading: ["manipulating-time-in-a-story", "how-a-theme-develops", "character-foils"],
      writing: ["claims-in-topic-sentences", "writing-an-analysis-of-a-character", "writing-a-coming-of-age-narrative"],
    },
    "coming-of-age",
    "talking-with-a-mentor",
  ),
  unit(
    t("Worlds of Tomorrow", "未来的世界"),
    {
      words: ["words-of-power-and-control", "words-of-space-travel", "words-of-artificial-minds"],
      grammar: ["elliptical-clauses"],
      reading: ["reading-speculative-fiction", "how-ideas-unfold-in-a-text"],
      writing: ["writing-speculative-fiction"],
    },
    "worlds-of-tomorrow",
    "robot-rights-panel",
  ),
  unit(
    t("Food, Health and the Body", "食物、健康与身体"),
    {
      words: ["words-of-diet-and-health", "words-of-the-hospital", "words-of-the-body-and-brain"],
      grammar: ["possessives-before-gerunds", "brackets-in-quotations"],
      reading: ["weighing-health-claims"],
      writing: ["writing-an-argument-with-sources"],
    },
    "food-health-and-the-body",
    "cafeteria-menu-hearing",
  ),
  unit(
    t("Stories from Many Cultures", "多元文化的故事"),
    {
      words: ["words-of-tradition-and-custom", "words-of-folk-wisdom", "latin-roots-7"],
      grammar: ["commonly-confused-words-5"],
      reading: ["perspective-from-another-culture"],
      writing: ["verbs-for-analyzing-a-text"],
    },
    "stories-from-many-cultures",
    "international-book-fair",
  ),
  unit(
    t("Art and Its Subjects", "艺术及其题材"),
    {
      words: ["words-of-art-and-criticism", "words-of-music-and-performance", "words-of-film", "greek-roots-6"],
      grammar: ["sentence-variety-for-effect"],
      reading: ["a-subject-in-two-mediums"],
      writing: [],
    },
    "art-and-its-subjects",
    "gallery-talk",
  ),
  unit(
    t("The Life of Words", "词语的生命"),
    {
      words: ["words-of-language-and-its-history", "word-parts-that-form-verbs", "academic-words-4", "academic-words-5"],
      grammar: ["usage-rules-and-myths", "spelling-commonly-misspelled-words"],
      reading: [],
      writing: [],
    },
    undefined,
    "dictionary-editor-interview",
  ),
  unit(
    t("Body, Health and Sport", "身体、健康与体育"),
    {
      words: ["words-of-injuries", "words-of-illness", "words-of-sport", "words-of-cooking"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Taste, Weather, Pets and Clothes", "味道、天气、宠物与衣物"),
    {
      words: ["words-of-taste-and-texture", "words-of-weather", "words-of-pets", "words-of-clothes"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Computers, Family, Shops and the Army", "电脑、家庭、商店与军队"),
    {
      words: ["words-of-software-and-security", "words-of-family", "words-of-shopping", "words-of-the-army"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Travel, Moods, States and Safety", "出行、情绪、状态与安全"),
    {
      words: ["words-of-getting-around", "words-of-moods", "words-of-how-things-are", "words-of-staying-safe"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
];

/** courseGrade9 is the native course of grade 9. */
export const courseGrade9: CourseDef = {
  id: "english-grade-9",
  title: t("English, Grade 9", "英语：九年级"),
  description: t(
    "English for readers and writers of grade 9, in nine themed units from the writer's craft, heroes and epics and the tragic stage to coming of age, worlds of tomorrow, food and health, stories from many cultures, art and its subjects and the life of words. Each unit teaches the words of its theme, grammar and usage, reading skills and a kind of writing together, and most give a set of passages to read on the theme. The analyses, narratives, stories, scenes and arguments written in the course are judged by a model.",
    "面向九年级读者和写作者的英语课程，共九个主题单元，从作家的技艺、英雄与史诗和悲剧舞台，到成长、未来的世界、食物与健康、多元文化的故事、艺术及其题材以及词语的生命。每个单元同时教授该主题的词汇、语法和用法、阅读技能和一种写作，大多数单元还提供一组围绕主题的阅读文章。课程中写的分析文章、记叙文、故事、剧本和议论文由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-8"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
