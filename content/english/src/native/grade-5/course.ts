// Grade 5: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. Topics of the band course keep their ids.

import { type CourseDef, type Text, t, type UnitDef } from "@ga/content";

const words = t("Words", "词汇");
const grammar = t("Grammar", "语法");
const reading = t("Reading", "阅读");
const writing = t("Writing", "写作");

/** unit builds a unit of four modules on a theme, leaving out a module with no topics. */
const unit = (
  title: Text,
  parts: { words: string[]; grammar: string[]; reading: string[]; writing: string[] },
  readingUnit: string,
  conversation: string,
): UnitDef => ({
  title,
  modules: [
    { title: words, topics: parts.words },
    { title: grammar, topics: parts.grammar },
    { title: reading, topics: parts.reading },
    { title: writing, topics: parts.writing },
  ].filter((m) => m.topics.length > 0),
  reading: [readingUnit],
  conversation,
});

const units: readonly UnitDef[] = [
  unit(
    t("Water on Earth", "地球上的水"),
    {
      words: [
        "words-of-the-water-cycle",
        "words-of-oceans-and-ice",
        "words-for-amounts-and-distribution",
        "words-of-clean-water",
        "homographs",
      ],
      grammar: ["commas-in-a-series", "fewer-or-less"],
      reading: ["two-main-ideas", "finding-answers-in-several-sources"],
      writing: ["asking-a-research-question", "according-to-a-source"],
    },
    "water-on-earth",
    "water-saving-family-plan",
  ),
  unit(
    t("Matter and Its Changes", "物质及其变化"),
    {
      words: ["words-of-matter", "words-of-chemical-change", "words-for-describing-materials", "words-for-investigating"],
      grammar: ["perfect-verb-tenses", "spelling-able-and-ible"],
      reading: ["reading-about-an-experiment", "matching-points-and-evidence"],
      writing: ["combining-and-reducing-sentences", "writing-up-an-experiment"],
    },
    "matter-and-its-changes",
    "kitchen-science-helper",
  ),
  unit(
    t("The World Under a Microscope", "显微镜下的世界"),
    {
      words: ["words-of-cells-and-microbes", "words-of-the-lab", "words-for-how-living-things-work", "greek-roots-of-science"],
      grammar: ["spelling-ph-ch-and-y", "because-or-because-of"],
      reading: ["comparisons-that-explain", "quoting-accurately"],
      writing: ["quote-paraphrase-or-summary", "using-a-quotation-as-support", "answering-with-text-evidence"],
    },
    "the-world-under-a-microscope",
    "lab-visit-microbiologist",
  ),
  unit(
    t("The Solar System", "太阳系"),
    {
      words: ["words-of-the-solar-system", "words-of-stars-and-the-sky", "words-of-space-exploration", "latin-roots-of-earth-and-sky"],
      grammar: ["future-perfect-tense", "complete-comparisons"],
      reading: ["text-structures", "comparing-structures-of-two-texts"],
      writing: ["previewing-the-topic", "planning-a-multi-paragraph-piece", "writing-a-three-paragraph-report"],
    },
    "our-solar-system",
    "planetarium-report-questions",
  ),
  unit(
    t("Ancient Greece", "古希腊"),
    {
      words: [
        "words-of-ancient-greece",
        "words-of-greek-ideas-and-learning",
        "words-for-government-and-choices",
        "words-from-names-and-myths",
      ],
      grammar: ["capitals-for-events-and-eras", "indefinite-pronouns-and-agreement"],
      reading: ["legend-or-history", "connecting-events-in-history"],
      writing: ["ordering-reasons-logically", "one-paragraph-per-reason", "writing-an-opinion-piece"],
    },
    "ancient-greece",
    "athens-assembly-debate",
  ),
  unit(
    t("The Maya, Aztec and Inca", "玛雅、阿兹特克和印加"),
    {
      words: [
        "words-of-the-maya-aztec-and-inca",
        "words-of-heights-and-depths",
        "words-for-rise-and-fall",
        "words-of-calendars-and-counting",
      ],
      grammar: ["when-to-shift-tense", "spelling-ant-and-ent"],
      reading: ["fact-and-opinion", "authors-purpose", "multiple-accounts-of-one-event"],
      writing: ["linking-words-for-reasons-and-contrast", "writing-a-compare-and-contrast-paragraph", "writing-about-two-texts"],
    },
    "the-maya-aztec-and-inca",
    "machu-picchu-guide",
  ),
  unit(
    t("Bridges, Towers and Domes", "桥梁、高塔与穹顶"),
    {
      words: [
        "words-of-building-and-engineering",
        "words-of-forces-on-structures",
        "words-for-planning-and-solving",
        "words-of-cities",
        "blended-and-shortened-words",
      ],
      grammar: ["correlative-conjunctions", "hyphens"],
      reading: ["reading-a-news-article"],
      writing: ["formal-style", "writing-a-news-article"],
    },
    "bridges-towers-and-domes",
    "bridge-engineer-interview",
  ),
  unit(
    t("Mysteries and Detectives", "推理与侦探"),
    {
      words: ["words-of-mysteries-and-detectives", "words-for-suspense-and-puzzles", "words-for-reasoning", "word-analogies"],
      grammar: ["commas-after-introductions", "commas-before-tag-questions", "paragraphs-for-each-speaker"],
      reading: ["clues-and-red-herrings", "drawing-conclusions", "building-suspense", "comparing-stories-of-one-genre"],
      writing: ["planning-a-story-arc", "writing-a-mystery"],
    },
    "mysteries-and-detectives",
    "detective-witness-interview",
  ),
  unit(
    t("Stories of Survival", "求生故事"),
    {
      words: [
        "words-of-wilderness-survival",
        "words-of-ships-and-the-sea",
        "words-for-courage-and-fear",
        "words-for-choices-and-consequences",
      ],
      grammar: ["interjections", "however-and-therefore", "preposition-or-adverb"],
      reading: ["comparing-two-characters", "how-characters-face-challenges", "how-chapters-build-a-story"],
      writing: ["pacing-a-story", "writing-a-personal-narrative"],
    },
    "stories-of-survival",
    "wilderness-ranger-safety-briefing",
  ),
  unit(
    t("Letters and Diaries from the Past", "往昔的书信与日记"),
    {
      words: [
        "academic-words-3",
        "prefixes-of-number-and-position",
        "words-of-letters-and-diaries",
        "words-of-life-long-ago",
        "words-for-memory-and-history",
        "words-for-longing-and-affection",
      ],
      grammar: ["titles-in-italics-and-quotation-marks", "shifts-in-pronoun-person", "commonly-confused-words-2"],
      reading: ["reading-diaries-and-letters", "the-speaker-of-a-poem"],
      writing: ["proofreading", "writing-a-diary-from-history"],
    },
    "letters-and-diaries-from-the-past",
    "time-capsule-planning",
  ),
];

/** courseGrade5 is the native course of grade 5. */
export const courseGrade5: CourseDef = {
  id: "english-grade-5",
  title: t("English, Grade 5", "英语：五年级"),
  description: t(
    "English for readers and writers of grade 5, in ten themed units from water and matter to microbes, ancient Greece, the Maya, Aztec and Inca, bridges, mysteries, survival and letters from the past. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The reports, opinion pieces, articles, stories and diaries written in the course are judged by a model.",
    "面向五年级读者和写作者的英语课程，共十个主题单元，从水和物质到微生物、古希腊、玛雅、阿兹特克和印加、桥梁、推理、求生和往昔的书信。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的报告、议论文、新闻、故事和日记由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-4"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
