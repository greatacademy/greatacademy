// Grades 3 to 5: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a
// reading unit on the theme and a conversation that closes it.

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
    t("Stories and Fables", "故事与寓言"),
    {
      words: ["context-clues", "words-for-character-traits"],
      grammar: ["nouns-and-pronouns", "subjects-and-predicates", "complete-sentences-and-fragments"],
      reading: ["making-inferences", "characters", "point-of-view", "lesson-of-a-story"],
      writing: ["capitals-and-end-punctuation", "punctuating-dialogue"],
    },
    "stories-and-fables",
    "fable-for-a-younger-cousin",
  ),
  unit(
    t("Water on Earth", "地球上的水"),
    {
      words: ["words-of-the-water-cycle", "academic-words-1"],
      grammar: ["plural-nouns", "simple-verb-tenses", "subject-verb-agreement", "coordinating-conjunctions"],
      reading: ["main-idea", "supporting-details"],
      writing: ["commas-in-a-series", "expanding-with-because-but-so"],
    },
    "water-on-earth",
    "water-saving-family-plan",
  ),
  unit(
    t("How Plants Live", "植物怎样生活"),
    {
      words: ["base-words-and-affixes", "common-suffixes", "words-of-plant-life"],
      grammar: ["adjectives-and-adverbs", "order-of-adjectives", "comparatives-and-superlatives", "prepositional-phrases"],
      reading: ["sequence-in-texts"],
      writing: ["expanding-ideas-in-your-own-words"],
    },
    "how-plants-live",
    "garden-center-plant-advice",
  ),
  unit(
    t("Life on the Nile", "尼罗河畔的生活"),
    {
      words: ["words-of-ancient-egypt", "common-prefixes"],
      grammar: ["verb-tense-consistency", "capitalizing-names-and-titles", "apostrophes-and-possessives", "subordinating-conjunctions"],
      reading: ["compare-and-contrast-in-texts"],
      writing: ["commas-after-introductions", "combining-with-conjunctions"],
    },
    "life-on-the-nile",
    "egyptian-gallery-guide",
  ),
  unit(
    t("Weather and Climate", "天气与气候"),
    {
      words: ["words-of-weather-science", "academic-words-2"],
      grammar: ["progressive-verb-tenses", "modal-verbs"],
      reading: ["cause-and-effect-in-texts"],
      writing: ["identifying-topic-sentences", "ordering-sentences-in-a-paragraph"],
    },
    "weather-and-climate",
    "hiking-trip-weather-check",
  ),
  unit(
    t("How Animals Survive", "动物怎样生存"),
    {
      words: ["words-of-animal-survival", "suffixes-that-change-word-class"],
      grammar: ["run-ons-and-comma-splices", "commonly-confused-words"],
      reading: ["fact-and-opinion", "authors-purpose"],
      writing: [
        "fixing-run-ons",
        "choosing-transitions",
        "removing-off-topic-sentences",
        "writing-a-paragraph",
        "writing-an-opinion-paragraph",
      ],
    },
    "how-animals-survive",
    "zookeeper-interview",
  ),
  unit(
    t("The Human Body", "人体"),
    {
      words: ["latin-roots-1", "greek-roots-1", "words-of-the-body-systems"],
      grammar: ["pronoun-antecedent-agreement"],
      reading: ["text-features"],
      writing: ["writing-a-how-to-paragraph", "writing-a-summary"],
    },
    "the-human-body",
    "school-nurse-symptoms",
  ),
  unit(
    t("Our Changing Earth", "变化的地球"),
    {
      words: ["words-of-earth-science", "academic-words-3", "prefixes-of-number-and-position"],
      grammar: ["perfect-verb-tenses"],
      reading: ["text-structures"],
      writing: ["writing-a-cause-and-effect-paragraph", "writing-a-compare-and-contrast-paragraph"],
    },
    "our-changing-earth",
    "volcano-park-ranger",
  ),
  unit(
    t("The Solar System", "太阳系"),
    {
      words: ["words-of-the-solar-system", "multiple-meaning-words"],
      grammar: ["correlative-conjunctions"],
      reading: ["similes-and-metaphors", "idioms"],
      writing: ["writing-a-narrative-paragraph", "writing-a-descriptive-paragraph"],
    },
    "our-solar-system",
    "planetarium-report-questions",
  ),
];

/** course35 is the native course of grades 3 to 5, retired now that the courses of grades 3, 4 and 5 hold all its topics. */
export const course35: CourseDef = {
  id: "english-grades-3-5",
  retired: true,
  title: t("English, Grades 3 to 5", "英语：三至五年级"),
  description: t(
    "English for readers and writers of grades 3 to 5, in nine themed units from fables to the solar system. Each unit teaches the words of its theme, grammar and punctuation, a reading skill and a kind of writing together, and gives a set of passages to read on the theme. The paragraphs written in the course are judged by a model.",
    "面向三至五年级读者和写作者的英语课程，共九个主题单元，从寓言到太阳系。每个单元同时教授该主题的词汇、语法和标点、一项阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的段落由模型评判。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
