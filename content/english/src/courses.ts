import type { CourseDef } from "@ga/content";
import { t } from "@ga/content";

/** grammarWriting is the first course of English: grammar and sentence writing for those who already speak it. */
export const grammarWriting: CourseDef = {
  id: "english-grammar-writing",
  title: t("Grammar and Sentence Writing", "语法与句子写作"),
  description: t(
    "How English sentences work, how to join and improve them, and how words are built from their parts. For learners who already speak English, in English.",
    "英语句子的构成、句子的连接与改进，以及词的构成。面向已经会说英语的学习者，用英语讲解。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  units: [
    {
      title: t("Grammar", "语法"),
      modules: [
        {
          title: t("Parts of a Sentence", "句子的组成"),
          topics: [
            "subjects-and-predicates",
            "nouns-and-pronouns",
            "complete-sentences-and-fragments",
            "adjectives-and-adverbs",
            "prepositional-phrases",
          ],
        },
        {
          title: t("Verbs and Agreement", "动词与一致"),
          topics: ["simple-verb-tenses", "subject-verb-agreement", "pronoun-antecedent-agreement", "active-and-passive-voice"],
        },
        {
          title: t("Usage", "用法"),
          topics: ["comparatives-and-superlatives", "apostrophes-and-possessives", "commonly-confused-words", "verb-tense-consistency"],
        },
        {
          title: t("Clauses and Phrases", "从句和短语"),
          topics: [
            "coordinating-conjunctions",
            "run-ons-and-comma-splices",
            "subordinating-conjunctions",
            "relative-clauses",
            "appositives",
            "participial-phrases",
            "misplaced-modifiers",
            "parallel-structure",
          ],
        },
      ],
    },
    {
      title: t("Sentence Writing", "句子写作"),
      modules: [
        {
          title: t("Punctuating Sentences", "句子的标点"),
          topics: ["capitals-and-end-punctuation", "commas-in-a-series", "commas-after-introductions", "punctuating-dialogue"],
        },
        {
          title: t("Joining Sentences", "合并句子"),
          topics: [
            "expanding-with-because-but-so",
            "combining-with-conjunctions",
            "fixing-run-ons",
            "combining-with-relative-clauses",
            "combining-with-appositives",
          ],
        },
        { title: t("Improving Sentences", "改进句子"), topics: ["varying-sentence-openings", "cutting-wordiness"] },
        {
          title: t("Paragraphs", "段落"),
          topics: [
            "identifying-topic-sentences",
            "ordering-sentences-in-a-paragraph",
            "choosing-transitions",
            "removing-off-topic-sentences",
          ],
        },
      ],
    },
    {
      title: t("Words", "词汇"),
      modules: [
        {
          title: t("Word Parts", "构词成分"),
          topics: [
            "base-words-and-affixes",
            "common-prefixes",
            "common-suffixes",
            "suffixes-that-change-word-class",
            "prefixes-of-number-and-position",
          ],
        },
        { title: t("Roots", "词根"), topics: ["latin-roots-1", "latin-roots-2", "greek-roots-1"] },
        {
          title: t("Meaning in Context", "语境中的词义"),
          topics: ["context-clues", "academic-words-1", "academic-words-2", "academic-words-3", "connotation-and-precise-words"],
        },
      ],
    },
  ],
  reading: ["water-on-earth", "how-plants-live", "life-on-the-nile", "weather-and-climate", "the-human-body", "our-changing-earth"],
};

/** readingComprehension is the course of English on reading for meaning, for those who already speak it. */
export const readingComprehension: CourseDef = {
  id: "english-reading-comprehension",
  title: t("Reading for Meaning", "阅读理解"),
  description: t(
    "How to find what a text says, how texts are organized, and how to read between the lines. For learners who already speak English, in English.",
    "怎样找出文本所说的内容、文本怎样组织，以及怎样读出言外之意。面向已经会说英语的学习者，用英语讲解。",
  ),
  group: t("English", "英语"),
  explanationLocale: "en",
  units: [
    {
      title: t("Informational Texts", "说明性文本"),
      modules: [
        { title: t("Main Ideas", "主旨"), topics: ["main-idea", "supporting-details", "text-features"] },
        {
          title: t("How Texts Are Organized", "文本的组织"),
          topics: ["sequence-in-texts", "cause-and-effect-in-texts", "compare-and-contrast-in-texts", "text-structures"],
        },
      ],
    },
    {
      title: t("Thinking About Texts", "思考文本"),
      modules: [
        { title: t("Reading Between the Lines", "读出言外之意"), topics: ["making-inferences", "fact-and-opinion", "authors-purpose"] },
        { title: t("Stories", "故事"), topics: ["point-of-view", "characters", "lesson-of-a-story"] },
        { title: t("Figurative Language", "修辞语言"), topics: ["similes-and-metaphors", "idioms"] },
      ],
    },
  ],
};

/** englishCourses lists the courses of English. */
export const englishCourses: readonly CourseDef[] = [grammarWriting, readingComprehension];
