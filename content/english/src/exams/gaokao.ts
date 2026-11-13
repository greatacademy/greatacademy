// The Gaokao English course: reading, language use and writing practice in the formats of the English paper of
// China's national college entrance examination, over topics already in the graph. See
// docs/english-courses/english-gaokao.md.

import { type CourseDef, type TopicDef, t } from "@ga/content";
import { continuationSkills } from "./gaokao-continuation.ts";
import { cloze, grammarFilling, sevenFromFive } from "./gaokao-language.ts";
import { gaokaoReading } from "./gaokao-reading.ts";
import { continuationWriting, practicalWriting } from "./gaokao-writing.ts";
import { examGroup } from "./kit.ts";

/** topics are the new topics of the Gaokao English course, all practice-only. */
export const topics: readonly TopicDef[] = [
  sevenFromFive,
  cloze,
  grammarFilling,
  practicalWriting,
  continuationSkills,
  continuationWriting,
];

/** reading are the reading units of the Gaokao English course. */
export const reading = [gaokaoReading];

/** course is the Gaokao English course. */
export const course: CourseDef = {
  id: "english-gaokao",
  title: t("Gaokao English", "高考英语"),
  description: t(
    "Practice for the English paper of China's national college entrance examination after English B1: reading comprehension and seven-from-five, with the words of the themes the paper draws on; cloze and grammar filling, with the tenses, conditionals and clauses they test; practical writing and continuation writing, with the sentences that follow a given opening and show feelings. It teaches nothing new: its own topics start with practice, and every text is written for this course in the words of B1 and below. Listening will follow with audio.",
    "学完英语 B1 之后的高考英语练习：阅读理解和七选五，以及试卷常用话题的词汇；完形填空和语法填空，以及它们考查的时态、条件句和从句；应用文写作和读后续写，以及承接段首句、表现情感的句子。本课程不教新知识：它自己的主题一开始就是练习，所有文章都是用 B1 及以下的词为本课程原创的。听力将在有了音频之后加入。",
  ),
  group: examGroup,
  buildsOn: ["english-b1"],
  units: [
    {
      title: t("Reading", "阅读"),
      modules: [
        {
          title: t("Reading Comprehension", "阅读理解"),
          topics: [
            "main-idea",
            "supporting-details",
            "making-inferences",
            "authors-purpose",
            "identifying-topic-sentences",
            "summarizing-a-text",
          ],
        },
        {
          title: t("Words of the Themes", "话题词汇"),
          topics: [
            "b1-words-school-life",
            "b1-words-learning",
            "b1-words-study-skills",
            "b1-words-relationships",
            "b1-words-emotions",
            "b1-words-healthy-habits",
            "b1-words-environment",
            "b1-words-green-living",
            "b1-words-culture",
            "b1-words-science",
            "b1-words-inventions",
            "b1-words-describing-events",
          ],
        },
        {
          title: t("Seven-from-Five", "七选五"),
          topics: ["ordering-sentences-in-a-paragraph", "choosing-transitions", "gaokao-seven-from-five"],
        },
      ],
      reading: ["gaokao-reading"],
    },
    {
      title: t("Language Use", "语言运用"),
      modules: [
        {
          title: t("Grammar Filling", "语法填空"),
          topics: [
            "articles-in-general-and-specific",
            "active-and-passive-voice",
            "present-perfect-or-past-simple",
            "present-perfect-continuous",
            "past-perfect",
            "verb-tense-consistency",
            "first-conditional",
            "second-conditional",
            "may-might-and-could",
            "gerunds-and-infinitives",
            "relative-clauses",
            "combining-with-relative-clauses",
            "gaokao-grammar-filling",
          ],
        },
        {
          title: t("Cloze", "完形填空"),
          topics: ["phrasal-verbs", "comparatives-and-superlatives", "gaokao-cloze"],
        },
      ],
    },
    {
      title: t("Writing", "写作"),
      modules: [
        {
          title: t("Practical Writing", "应用文写作"),
          topics: [
            "writing-an-informal-email",
            "writing-a-formal-email",
            "writing-a-letter-of-advice",
            "writing-a-letter-of-complaint",
            "writing-an-article",
            "gaokao-practical-writing",
          ],
        },
        {
          title: t("Continuation Writing", "读后续写"),
          topics: ["b1-words-life-events", "writing-a-story", "gaokao-continuation-skills", "gaokao-continuation-writing"],
        },
      ],
    },
  ],
  reading: ["gaokao-reading"],
};
