// The Cambridge B2 First course: Reading and Use of English and Writing practice in the formats of the test, over
// topics already in the graph. See docs/english-courses/english-cambridge-first.md.

import { type CourseDef, type TopicDef, t } from "@ga/content";
import { fceReading } from "./cambridge-first-reading.ts";
import { keyWordTransformations, multipleChoiceCloze, openCloze, wordFormation } from "./cambridge-first-use-of-english.ts";
import { essayTopic, part2Topic } from "./cambridge-first-writing.ts";
import { examGroup } from "./kit.ts";

/** topics are the new topics of the Cambridge B2 First course, all practice-only. */
export const topics: readonly TopicDef[] = [multipleChoiceCloze, openCloze, wordFormation, keyWordTransformations, essayTopic, part2Topic];

/** reading are the reading units of the Cambridge B2 First course. */
export const reading = [fceReading];

/** course is the Cambridge B2 First course. */
export const course: CourseDef = {
  id: "english-cambridge-first",
  title: t("Cambridge B2 First", "剑桥 B2 First"),
  description: t(
    "Practice for B2 First Reading and Use of English and Writing after English B2: the multiple-choice cloze, the open cloze, word formation and key word transformations; long texts with multiple choice, gapped texts and multiple matching; the essay of Part 1 and the article, email or letter, report and review of Part 2. It teaches nothing new: its own topics start with practice, and every text is written for this course. Listening and Speaking will follow with audio.",
    "学完英语 B2 之后的 B2 First 阅读与英语运用及写作练习：多项选择完形填空、开放式完形填空、构词和关键词句型转换；长篇文章的多项选择、段落填句和多项匹配；第 1 部分的议论文，以及第 2 部分的文章、电子邮件或信件、报告和评论。本课程不教新知识：它自己的主题一开始就是练习，所有文章都是为本课程原创的。听力和口语将在有了音频之后加入。",
  ),
  group: examGroup,
  buildsOn: ["english-b2"],
  units: [
    {
      title: t("Use of English", "英语运用"),
      modules: [
        {
          title: t("Words in Context: Parts 1 and 3", "语境中的词汇：第 1 和第 3 部分"),
          topics: [
            "phrasal-verbs",
            "b2-words-linking-1",
            "fce-multiple-choice-cloze",
            "common-prefixes",
            "suffixes-that-change-word-class",
            "fce-word-formation",
          ],
        },
        {
          title: t("Grammar Words: Part 2", "语法功能词：第 2 部分"),
          topics: ["articles-in-general-and-specific", "relative-clauses", "gerunds-and-infinitives", "fce-open-cloze"],
        },
        {
          title: t("Key Word Transformations: Part 4", "关键词句型转换：第 4 部分"),
          topics: [
            "reported-speech",
            "third-conditional",
            "passive-with-modals-and-perfect-forms",
            "causative-have-and-get",
            "fce-key-word-transformations",
          ],
        },
      ],
    },
    {
      title: t("Reading", "阅读"),
      modules: [
        { title: t("Multiple Choice and Matching", "多项选择与匹配"), topics: ["making-inferences", "authors-purpose", "tone-and-mood"] },
        { title: t("Gapped Text", "段落填句"), topics: ["ordering-sentences-in-a-paragraph", "choosing-transitions"] },
      ],
      reading: ["fce-reading"],
    },
    {
      title: t("Writing", "写作"),
      modules: [
        { title: t("Part 1: the Essay", "第 1 部分：议论文"), topics: ["writing-an-opinion-essay", "fce-writing-an-essay"] },
        {
          title: t("Part 2: Four Kinds of Text", "第 2 部分：四种文本"),
          topics: [
            "writing-an-informal-email",
            "writing-a-formal-email",
            "writing-an-article",
            "writing-a-review",
            "writing-a-report",
            "fce-writing-part-2",
          ],
        },
      ],
    },
  ],
  reading: ["fce-reading"],
};
