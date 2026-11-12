// Grade 6: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
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
    t("Myths and Legends", "神话与传说"),
    {
      words: [
        "words-from-myths",
        "latin-roots-2",
        "words-of-heroes-and-quests",
        "words-of-fate-and-prophecy",
        "words-of-kingdoms-and-courts",
      ],
      grammar: ["relative-clauses", "pronoun-case", "who-and-whom"],
      reading: ["plot-and-conflict", "theme", "narrative-point-of-view", "archetypes-in-stories"],
      writing: ["combining-with-relative-clauses", "retelling-a-myth"],
    },
    "myths-and-legends",
    "myth-retelling-for-a-podcast",
  ),
  unit(
    t("Poetry and Song", "诗与歌"),
    {
      words: [
        "words-for-tone-and-feeling",
        "connotation-and-precise-words",
        "words-for-light-and-shadow",
        "words-for-ways-of-moving",
        "words-for-sounds",
      ],
      grammar: ["appositives"],
      reading: ["personification-and-hyperbole", "sound-devices", "tone-and-mood", "figurative-or-literal", "comparing-a-poem-and-a-story"],
      writing: ["coordinate-adjectives", "combining-with-appositives", "responding-to-a-poem"],
    },
    "tales-and-poems",
    "poetry-night-introduction",
  ),
  unit(
    t("Ancient Rome", "古罗马"),
    {
      words: ["words-of-ancient-rome", "words-of-roman-law-and-power", "words-of-roman-building", "words-of-revolt-and-war"],
      grammar: ["participial-phrases", "misplaced-modifiers", "who-which-and-that", "commas-with-nonessential-elements"],
      reading: ["primary-and-secondary-sources", "cause-and-effect-in-history"],
      writing: ["varying-sentence-openings", "combining-with-participial-phrases", "writing-an-informative-paragraph"],
    },
    "ancient-rome",
    "roman-forum-tour-guide",
  ),
  unit(
    t("The First Cities", "最早的城市"),
    {
      words: ["words-of-the-first-cities", "words-of-writing-and-records", "words-of-trade", "latin-roots-3"],
      grammar: ["intensive-pronouns", "vague-pronouns"],
      reading: ["how-a-sentence-fits-the-whole", "how-an-idea-is-developed"],
      writing: ["paraphrasing-a-source", "transitions-between-ideas", "writing-a-history-explanation"],
    },
    "the-first-cities",
    "museum-tablet-guide",
  ),
  unit(
    t("The Restless Earth", "躁动的地球"),
    {
      words: ["words-of-plate-tectonics", "words-of-volcanoes", "words-of-measuring", "greek-roots-2"],
      grammar: ["subject-verb-agreement-with-phrases-between", "numbers-in-words-or-figures"],
      reading: ["technical-words-in-context", "text-features-in-science"],
      writing: ["defining-a-term-in-a-sentence", "precise-words-for-science", "writing-an-explanation-of-a-process"],
    },
    "the-restless-earth",
    "earthquake-drill-planning",
  ),
  unit(
    t("Living Cells", "活的细胞"),
    {
      words: ["words-of-the-cell", "words-of-life-processes", "words-of-heredity", "prefixes-of-number-and-amount"],
      grammar: ["shifts-in-pronoun-number", "irregular-past-participles"],
      reading: ["supported-and-unsupported-claims"],
      writing: ["keeping-a-consistent-style", "writing-a-compare-and-contrast-essay"],
    },
    "inside-living-things",
    "science-fair-judge",
  ),
  unit(
    t("Memories and Growing Up", "回忆与成长"),
    {
      words: ["words-of-memory", "words-for-friends-and-family", "words-for-fear-and-courage", "more-adages-and-proverbs"],
      grammar: ["possessives-of-plural-and-compound-nouns", "spelling-doubling-final-consonants"],
      reading: ["memoir-or-fiction", "dynamic-and-static-characters"],
      writing: ["showing-character-through-action", "ending-a-narrative", "writing-a-memoir-scene"],
    },
    "growing-up",
    "neighbor-memories-interview",
  ),
  unit(
    t("Food for Everyone", "人人有饭吃"),
    {
      words: ["words-of-nutrition", "words-of-modern-farming", "words-of-hunger-and-plenty", "prefixes-of-place-and-direction"],
      grammar: ["colons-before-lists-and-explanations", "agreement-with-either-or-and-neither-nor"],
      reading: ["tracing-an-argument", "inferring-an-authors-point-of-view"],
      writing: ["choosing-relevant-reasons", "hooks-for-an-opening", "writing-a-letter-to-a-leader"],
    },
    "feeding-the-world",
    "school-lunch-committee",
  ),
  unit(
    t("Sport and Fair Play", "体育与公平竞赛"),
    {
      words: ["words-of-competition", "words-of-rules-and-fair-play", "words-of-training"],
      grammar: ["good-and-well-bad-and-badly", "capitals-in-titles-and-headings", "spelling-words-with-prefixes"],
      reading: ["reading-rules-and-instructions"],
      writing: ["writing-a-sports-column"],
    },
    "fair-play",
    "referee-call-dispute",
  ),
  unit(
    t("Where Words Come From", "词从哪里来"),
    {
      words: ["words-named-after-people", "words-about-language", "words-of-time-and-change", "words-from-other-languages"],
      grammar: [],
      reading: ["word-choice-and-meaning"],
      writing: ["writing-a-word-history"],
    },
    undefined,
    "word-origins-quiz-show",
  ),
];

/** courseGrade6 is the native course of grade 6. */
export const courseGrade6: CourseDef = {
  id: "english-grade-6",
  title: t("English, Grade 6", "英语：六年级"),
  description: t(
    "English for readers and writers of grade 6, in ten themed units from myths, poetry and ancient Rome to the first cities, the restless earth, living cells, memories of growing up, food for everyone, sport and fair play and the stories of words. Each unit teaches the words of its theme, grammar and mechanics, reading skills and a kind of writing together, and gives a set of passages to read on the theme. The explanations, essays, memoirs, letters, columns and word histories written in the course are judged by a model.",
    "面向六年级读者和写作者的英语课程，共十个主题单元，从神话、诗歌和古罗马到最早的城市、躁动的地球、活的细胞、成长的回忆、人人有饭吃、体育与公平竞赛和单词的故事。每个单元同时教授该主题的词汇、语法和书写规范、阅读技能和一种写作，并提供一组围绕主题的阅读文章。课程中写的说明文、论说文、回忆录、书信、专栏和词源短文由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-5"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
