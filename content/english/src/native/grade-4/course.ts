// Grade 4: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
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
    t("Our Changing Earth", "变化的地球"),
    {
      words: [
        "words-of-earth-science",
        "latin-roots-1",
        "words-of-rocks-and-minerals",
        "words-for-slow-and-sudden-change",
        "words-of-volcanoes-and-earthquakes",
        "restatement-and-inference-clues",
      ],
      grammar: ["progressive-verb-tenses", "helping-verbs", "spelling-tion-and-sion"],
      reading: ["cause-and-effect-chains", "explanations-of-how-things-work"],
      writing: ["turning-notes-into-sentences", "linking-words-for-information", "writing-a-cause-and-effect-paragraph"],
    },
    "our-changing-earth",
    "volcano-park-ranger",
  ),
  unit(
    t("Deserts, Rainforests and Polar Lands", "沙漠、雨林与极地"),
    {
      words: ["words-of-deserts-and-rainforests", "words-of-the-polar-lands", "words-of-climate-zones", "words-for-comparing"],
      grammar: ["prepositional-phrases", "agreement-with-there-and-here"],
      reading: ["compare-and-contrast-in-texts", "comparing-data-in-a-table"],
      writing: ["choosing-headings", "facts-definitions-and-examples", "ordering-paragraphs", "writing-a-two-paragraph-report"],
    },
    "deserts-rainforests-and-polar-lands",
    "polar-research-station-call",
  ),
  unit(
    t("The Human Body", "人体"),
    {
      words: [
        "words-of-the-body-systems",
        "greek-roots-1",
        "greek-and-latin-roots-of-the-body",
        "words-of-health-and-fitness",
        "words-for-systems-and-functions",
        "words-of-the-senses-and-nerves",
      ],
      grammar: ["compound-subjects-and-predicates", "reflexive-pronouns"],
      reading: ["skimming-and-scanning", "how-authors-support-points"],
      writing: ["paraphrasing-a-sentence", "writing-a-summary"],
    },
    "the-human-body",
    "school-nurse-symptoms",
  ),
  unit(
    t("Energy All Around", "身边的能量"),
    {
      words: ["words-of-energy", "words-of-light-and-sound", "words-for-using-and-saving"],
      grammar: ["modal-verbs", "adverbs-that-compare"],
      reading: ["combining-information-from-two-texts"],
      writing: ["supporting-reasons-with-facts", "writing-a-persuasive-letter"],
    },
    "energy-all-around",
    "energy-audit-at-school",
  ),
  unit(
    t("Tall Tales and Tricksters", "荒诞故事与机智的捣蛋鬼"),
    {
      words: ["words-of-tall-tales", "words-for-tricks-and-tricksters", "words-for-retelling", "words-for-size-and-strength"],
      grammar: ["verb-tense-consistency", "double-negatives"],
      reading: [
        "similes-and-metaphors",
        "wordplay-and-puns",
        "same-pattern-different-cultures",
        "why-characters-act",
        "summarizing-a-story",
      ],
      writing: ["showing-not-telling", "writing-a-narrative-paragraph", "writing-a-tall-tale"],
    },
    "tall-tales-and-tricksters",
    "tall-tale-contest",
  ),
  unit(
    t("Life in the Middle Ages", "中世纪的生活"),
    {
      words: ["words-of-castles-and-knights", "words-of-medieval-towns-and-villages", "words-for-rules-and-power"],
      grammar: ["order-of-adjectives", "spelling-silent-letters"],
      reading: ["historical-fiction-facts-and-inventions", "how-setting-shapes-a-story"],
      writing: ["combining-with-phrases", "choosing-sensory-details", "writing-a-descriptive-paragraph"],
    },
    "life-in-the-middle-ages",
    "castle-steward-interview",
  ),
  unit(
    t("The Silk Road", "丝绸之路"),
    {
      words: ["words-of-the-silk-road", "words-for-trade-and-travel", "words-for-sharing-ideas-and-beliefs", "prefixes-in-im-il-and-ir"],
      grammar: ["commonly-confused-words", "between-among-in-and-into"],
      reading: ["idioms", "firsthand-and-secondhand-accounts"],
      writing: ["choosing-a-hook", "outlining-a-report"],
    },
    "the-silk-road",
    "silk-road-market-trade",
  ),
  unit(
    t("Art and Artists", "艺术与艺术家"),
    {
      words: ["words-of-painting-and-drawing", "words-of-sculpture-and-craft", "words-of-color", "words-for-describing-art"],
      grammar: ["run-ons-and-comma-splices", "spelling-ie-and-ei"],
      reading: ["imagery"],
      writing: ["fixing-run-ons", "writing-a-response-to-art"],
    },
    "art-and-artists",
    "art-museum-docent",
  ),
  unit(
    t("Plays for the Stage", "舞台上的戏剧"),
    {
      words: ["words-of-plays-and-theater", "words-of-comedy-and-drama", "words-for-speaking", "using-a-thesaurus"],
      grammar: ["choosing-punctuation-for-effect", "formal-and-informal-english"],
      reading: ["parts-of-a-play", "poem-play-or-story", "story-and-script", "what-characters-say-and-think"],
      writing: ["script-format", "writing-a-short-script"],
    },
    "plays-for-the-stage",
    "school-play-casting",
  ),
  unit(
    t("Lives That Made a Difference", "改变世界的人生"),
    {
      words: [
        "academic-words-2",
        "suffixes-that-change-word-class",
        "suffixes-for-people",
        "words-for-courage-and-achievement",
        "words-of-discovery-and-research",
        "words-for-helping-others",
      ],
      grammar: ["quotation-marks-for-quotations", "abbreviations", "tricky-verb-pairs"],
      reading: ["biography-or-autobiography", "adages-and-proverbs"],
      writing: ["listing-sources", "writing-a-biography-paragraph"],
    },
    "lives-that-made-a-difference",
    "biography-interview",
  ),
];

/** courseGrade4 is the native course of grade 4. */
export const courseGrade4: CourseDef = {
  id: "english-grade-4",
  title: t("English, Grade 4", "英语：四年级"),
  description: t(
    "English for readers and writers of grade 4, in ten themed units from the changing Earth and the biomes of the world to the Middle Ages, the Silk Road, art, the theater and lives that made a difference. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The reports, letters, tall tales, scripts, responses to art and paragraphs of biography written in the course are judged by a model.",
    "面向四年级读者和写作者的英语课程，共十个主题单元，从变化的地球和世界各地的生物群落，到中世纪、丝绸之路、艺术、戏剧和改变世界的人生。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的报告、书信、荒诞故事、剧本、艺术评论和人物传记段落由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-3"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
