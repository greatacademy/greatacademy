// Grade 12: the course. Each unit is a theme and teaches words, grammar, reading and writing together, with a reading
// unit on the theme and a conversation that closes it. The first unit gathers the last topics of the band course of
// grades 9 to 12, which keep their ids.

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
    t("Essays of Experience", "经验之文"),
    {
      words: ["words-for-reflection"],
      grammar: [],
      reading: ["reading-personal-essays"],
      writing: ["writing-a-personal-essay", "writing-a-college-application-essay"],
    },
    "essays-of-experience",
    "college-admissions-interview",
  ),
  unit(
    t("Power and Conscience", "权力与良知"),
    {
      words: ["words-of-power-and-corruption", "words-of-conscience-and-duty"],
      grammar: ["ambiguous-pronoun-reference"],
      reading: ["reading-an-investigative-report"],
      writing: ["choosing-precise-diction", "writing-a-profile-of-a-person-of-conscience"],
    },
    "power-and-corruption",
    "reporting-wrongdoing",
  ),
  unit(
    t("Belief and Doubt", "信念与怀疑"),
    {
      words: ["words-of-philosophy", "words-of-belief-and-doubt", "words-of-worship-and-belief"],
      grammar: ["inverted-conditionals"],
      reading: ["following-a-thought-experiment"],
      writing: ["defining-a-term-in-an-argument", "writing-a-philosophical-essay"],
    },
    "questions-of-philosophy",
    "philosophy-cafe",
  ),
  unit(
    t("Art and Its Critics", "艺术与评论"),
    {
      words: ["words-of-art-criticism", "words-of-taste-and-beauty", "words-of-architecture"],
      grammar: [],
      reading: ["evaluating-a-review"],
      writing: ["writing-a-review-of-a-work-of-art"],
    },
    "art-and-its-critics",
    "modern-art-gallery-talk",
  ),
  unit(
    t("Literature Across Languages", "跨越语言的文学"),
    {
      words: ["words-of-translation-and-meaning", "words-of-world-literature"],
      grammar: [],
      reading: ["comparing-translations"],
      writing: ["writing-a-comparison-of-translations"],
    },
    "literature-across-languages",
    "translators-choice",
  ),
  unit(
    t("Risk and Responsibility", "风险与责任"),
    {
      words: ["words-of-risk-and-uncertainty", "words-of-crisis-and-response"],
      grammar: ["jargon-and-plain-language"],
      reading: ["reading-risk-and-probability"],
      writing: ["explaining-a-risk-clearly", "writing-a-proposal-to-reduce-a-risk"],
    },
    "risk-and-responsibility",
    "town-meeting-on-risk",
  ),
  unit(
    t("Roots and Parts", "词根与词缀"),
    {
      words: [
        "latin-roots-10",
        "greek-roots-9",
        "latin-roots-11",
        "greek-roots-10",
        "latin-roots-12",
        "greek-roots-11",
        "latin-roots-13",
        "academic-words-10",
        "academic-words-11",
        "academic-words-12",
        "academic-words-13",
        "academic-words-14",
      ],
      grammar: ["commonly-confused-words-8"],
      reading: [],
      writing: [],
    },
    undefined,
    "word-detective",
  ),
  unit(
    t("Science and Inquiry", "科学与探究"),
    {
      words: [
        "words-of-the-scientific-method",
        "words-of-physics-and-energy",
        "words-of-chemistry-and-matter",
        "words-of-the-cosmos",
        "words-of-medicine-and-disease",
        "words-of-the-mind",
      ],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Law and Nations", "法律与国家"),
    {
      words: [
        "words-of-the-courtroom",
        "words-of-embassies-and-treaties",
        "words-of-crowns-and-colonies",
        "words-of-debt-and-credit",
        "words-of-elections-and-office",
      ],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Rhetoric and Reason", "修辞与理性"),
    { words: ["words-of-rhetoric-and-oratory", "words-of-logic-and-error"], grammar: [], reading: [], writing: [] },
    undefined,
  ),
  unit(
    t("Temperament and Character", "气质与品格"),
    {
      words: [
        "words-of-the-four-temperaments",
        "words-of-company-and-solitude",
        "words-of-pride-and-humility",
        "words-of-generosity-and-greed",
        "words-of-anger-and-calm",
        "words-of-deceit-and-candor",
      ],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Style and the Senses", "文风与感官"),
    {
      words: [
        "words-for-the-style-of-prose",
        "words-for-sounds-and-voices",
        "words-of-light-and-color",
        "words-of-walking-and-moving",
        "words-of-surfaces-and-textures",
      ],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Reputation and Secrets", "名声与秘密"),
    {
      words: ["words-of-praise", "words-of-blame", "words-of-fame-and-obscurity", "words-of-secrets"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Change and Order", "变化与秩序"),
    {
      words: ["words-of-change-and-constancy", "words-of-decay-and-ruin", "words-of-order-and-chaos", "words-of-plenty-and-want"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Manners, Effort and Age", "礼貌、勤奋与年龄"),
    {
      words: ["words-of-manners-good-and-bad", "words-of-diligence-and-sloth", "words-of-delay-and-idleness", "words-of-youth-and-old-age"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("War and Peacemaking", "战争与调停"),
    {
      words: ["words-of-battle-and-siege", "words-of-calming-and-defiance", "words-of-daring-and-timidity"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Talk and Feeling", "言谈与情感"),
    {
      words: ["words-for-talkers-and-the-silent", "words-of-rapture-and-gloom", "words-of-remembering-and-forgetting"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Origins, Wiles and Likeness", "起源、诡计与相似"),
    {
      words: ["words-of-beginnings-and-endings", "words-of-wit-and-wiles", "words-of-likeness-and-difference"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Appetite and the Body", "食欲与身体"),
    {
      words: ["words-of-taste-and-appetite", "words-for-the-build-of-the-body", "words-of-envy-and-malice"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Power and the Road", "权力与旅途"),
    {
      words: ["words-of-obedience-and-revolt", "words-of-roaming-and-wandering", "words-of-luxury-and-penury"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Clear Thought and Last Wills", "清晰思维与遗嘱"),
    {
      words: ["words-of-clear-and-muddled-thought", "words-of-wills-and-inheritance"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
  unit(
    t("Ships and Pirates", "船与海盗"),
    {
      words: ["words-of-ships-and-sailors", "words-of-pirates-and-plunder"],
      grammar: [],
      reading: [],
      writing: [],
    },
    undefined,
  ),
];

/** courseGrade12 is the native course of grade 12. */
export const courseGrade12: CourseDef = {
  id: "english-grade-12",
  title: t("English, Grade 12", "英语：十二年级"),
  description: t(
    "English for readers and writers of grade 12, in seven themed units from essays of experience, power and conscience and belief and doubt to art and its critics, literature across languages, risk and responsibility and the roots and parts of words. Each unit teaches the words of its theme, grammar and style, reading skills and a kind of writing together, and most give a set of passages to read on the theme. The personal essays, profiles, philosophical essays, reviews, comparisons of translations and proposals written in the course are judged by a model.",
    "面向十二年级读者和写作者的英语课程，共七个主题单元，从经验之文、权力与良知和信念与怀疑，到艺术与评论、跨越语言的文学、风险与责任以及词根与词缀。每个单元同时教授该主题的词汇、语法和文体、阅读技能和一种写作，大多数单元还提供一组围绕主题的阅读文章。课程中写的个人随笔、人物特写、哲学短文、评论、译本比较和提案由模型评判。",
  ),
  group: t("English", "英语"),
  buildsOn: ["english-grade-11"],
  explanationLocale: "en",
  units,
  reading: units.flatMap((u) => u.reading ?? []),
  conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
};
