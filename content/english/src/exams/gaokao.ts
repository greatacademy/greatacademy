// The Gaokao English course: reading, language use and writing practice in the formats of the English paper of
// China's national college entrance examination, over topics already in the graph. See
// docs/english-courses/english-gaokao.md.

import { type CourseDef, type TopicDef, t } from "@ga/content";
import { cloze, grammarFilling, sevenFromFive } from "./gaokao-language.ts";
import { gaokaoReading } from "./gaokao-reading.ts";
import { continuationWriting, practicalWriting } from "./gaokao-writing.ts";
import { examGroup } from "./kit.ts";

/** topics are the new topics of the Gaokao English course, all practice-only. */
export const topics: readonly TopicDef[] = [sevenFromFive, cloze, grammarFilling, practicalWriting, continuationWriting];

/** reading are the reading units of the Gaokao English course. */
export const reading = [gaokaoReading];

/** course is the Gaokao English course. */
export const course: CourseDef = {
  id: "english-gaokao",
  title: t("Gaokao English", "高考英语"),
  description: t(
    "Practice for the English paper of China's national college entrance examination after English B1: reading comprehension and seven-from-five; cloze and grammar filling; practical writing and continuation writing. It teaches nothing new: its own topics start with practice, and every text is written for this course in the words of B1 and below. Listening will follow with audio.",
    "学完英语 B1 之后的高考英语练习：阅读理解和七选五；完形填空和语法填空；应用文写作和读后续写。本课程不教新知识：它自己的主题一开始就是练习，所有文章都是用 B1 及以下的词为本课程原创的。听力将在有了音频之后加入。",
  ),
  group: examGroup,
  buildsOn: ["english-b1"],
  units: [
    {
      title: t("Reading", "阅读"),
      modules: [
        {
          title: t("Reading Comprehension", "阅读理解"),
          topics: ["main-idea", "supporting-details", "making-inferences", "authors-purpose"],
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
          title: t("Cloze", "完形填空"),
          topics: ["phrasal-verbs", "comparatives-and-superlatives", "gaokao-cloze"],
        },
        {
          title: t("Grammar Filling", "语法填空"),
          topics: [
            "articles-in-general-and-specific",
            "active-and-passive-voice",
            "past-perfect",
            "gerunds-and-infinitives",
            "relative-clauses",
            "gaokao-grammar-filling",
          ],
        },
      ],
    },
    {
      title: t("Writing", "写作"),
      modules: [
        {
          title: t("Practical Writing", "应用文写作"),
          topics: ["writing-an-informal-email", "writing-a-formal-email", "writing-a-letter-of-advice", "gaokao-practical-writing"],
        },
        { title: t("Continuation Writing", "读后续写"), topics: ["writing-a-story", "gaokao-continuation-writing"] },
      ],
    },
  ],
  reading: ["gaokao-reading"],
};
