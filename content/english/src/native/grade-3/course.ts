// Grade 3: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
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
    t("Stories and Fables", "故事与寓言"),
    {
      words: ["context-clues", "words-for-character-traits", "words-of-folk-tales", "words-for-feelings", "synonyms-and-antonyms"],
      grammar: [
        "nouns-and-pronouns",
        "subjects-and-predicates",
        "complete-sentences-and-fragments",
        "capitals-and-end-punctuation",
        "abstract-nouns",
      ],
      reading: ["making-inferences", "characters", "lesson-of-a-story", "setting-problem-and-solution"],
      writing: ["adding-details-to-a-sentence"],
    },
    "stories-and-fables",
    "fable-for-a-younger-cousin",
  ),
  unit(
    t("How Plants Live", "植物怎样生活"),
    {
      words: [
        "base-words-and-affixes",
        "common-suffixes",
        "words-of-plant-life",
        "words-of-farms-and-gardens",
        "words-for-growth-and-change",
        "compound-words",
      ],
      grammar: ["plural-nouns", "adjectives-and-adverbs", "coordinating-conjunctions"],
      reading: ["main-idea", "sequence-in-texts"],
      writing: ["expanding-with-because-but-so", "expanding-ideas-in-your-own-words"],
    },
    "how-plants-live",
    "garden-center-plant-advice",
  ),
  unit(
    t("How Animals Survive", "动物怎样生存"),
    {
      words: [
        "words-of-animal-survival",
        "words-of-animal-bodies",
        "words-of-animal-groups-and-homes",
        "words-for-danger-and-safety",
        "homophones",
      ],
      grammar: ["simple-verb-tenses", "subordinating-conjunctions", "collective-nouns"],
      reading: ["supporting-details", "answering-questions-from-the-text"],
      writing: ["combining-with-conjunctions", "identifying-topic-sentences", "grouping-related-facts"],
    },
    "how-animals-survive",
    "zookeeper-interview",
  ),
  unit(
    t("Weather and Climate", "天气与气候"),
    {
      words: ["words-of-weather-science", "academic-words-1", "words-of-the-forecast", "words-for-measuring", "shades-of-meaning"],
      grammar: ["subject-verb-agreement", "comparatives-and-superlatives", "adding-ed-and-ing"],
      reading: ["cause-and-effect-in-texts", "reading-a-table"],
      writing: [
        "ordering-sentences-in-a-paragraph",
        "removing-off-topic-sentences",
        "choosing-transitions",
        "choosing-a-closing-sentence",
        "writing-a-paragraph",
      ],
    },
    "weather-and-climate",
    "hiking-trip-weather-check",
  ),
  unit(
    t("Our World on a Map", "地图上的世界"),
    {
      words: ["words-of-maps", "words-of-land-and-water", "words-for-places-and-directions", "using-a-dictionary-and-glossary"],
      grammar: ["capitalizing-names-and-titles", "commas-in-dates-addresses-and-letters"],
      reading: ["text-features", "fiction-and-nonfiction", "reading-a-letter"],
      writing: ["parts-of-a-friendly-letter", "writing-a-friendly-letter"],
    },
    "our-world-on-a-map",
    "lost-visitor-directions",
  ),
  unit(
    t("Life on the Nile", "尼罗河畔的生活"),
    {
      words: ["words-of-ancient-egypt", "common-prefixes", "words-of-a-river-kingdom", "words-of-ancient-life", "words-for-time-long-ago"],
      grammar: ["apostrophes-and-possessives", "contractions"],
      reading: ["reading-a-timeline", "making-predictions"],
      writing: ["taking-notes-from-a-text", "writing-a-fact-paragraph"],
    },
    "life-on-the-nile",
    "egyptian-gallery-guide",
  ),
  unit(
    t("Along the Yellow River", "黄河两岸"),
    {
      words: ["words-of-ancient-china", "words-of-walls-and-watchtowers", "words-for-thinking-and-wondering"],
      grammar: ["action-and-linking-verbs", "punctuating-dialogue"],
      reading: ["point-of-view", "comparing-two-stories", "character-change"],
      writing: ["choosing-a-story-opening", "ending-a-story", "writing-a-fable"],
    },
    "along-the-yellow-river",
    "great-wall-guide",
  ),
  unit(
    t("Pushes, Pulls and Magnets", "推、拉和磁铁"),
    {
      words: ["multiple-meaning-words", "words-of-forces-and-motion", "words-of-magnets", "words-for-explaining-how"],
      grammar: ["pronoun-antecedent-agreement"],
      reading: ["steps-in-a-procedure", "two-texts-on-one-topic"],
      writing: ["writing-a-how-to-paragraph", "answering-a-question-in-sentences"],
    },
    "pushes-pulls-and-magnets",
    "toy-car-ramp-test",
  ),
  unit(
    t("Making Music", "演奏音乐"),
    {
      words: ["words-of-music", "words-of-instrument-families", "words-for-describing-music", "words-for-performing"],
      grammar: ["four-kinds-of-sentences"],
      reading: ["retelling-key-events", "how-actions-move-the-plot"],
      writing: ["linking-reasons-to-an-opinion", "writing-an-opinion-paragraph"],
    },
    "the-world-of-music",
    "music-shop-first-instrument",
  ),
  unit(
    t("Poems for All Seasons", "四季的诗"),
    {
      words: ["words-of-poetry", "words-for-seasons-and-senses", "sensory-words", "literal-and-nonliteral-phrases"],
      grammar: ["spelling-ck-tch-and-dge"],
      reading: ["parts-of-stories-and-poems", "what-a-poem-is-about"],
      writing: ["strong-verbs", "writing-a-seasons-poem"],
    },
    "poems-for-all-seasons",
    "poem-for-a-grandparent",
  ),
];

/** courseGrade3 is the native course of grade 3. */
export const courseGrade3: CourseDef = {
  id: "english-grade-3",
  title: t("English, Grade 3", "英语：三年级"),
  description: t(
    "English for readers and writers of grade 3, in ten themed units from fables and plants to the Yellow River, magnets, music and poems of the seasons. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The letters, paragraphs, fables, answers and poems written in the course are judged by a model.",
    "面向三年级读者和写作者的英语课程，共十个主题单元，从寓言和植物到黄河、磁铁、音乐和四季的诗。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的书信、段落、寓言、回答和诗由模型评判。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
