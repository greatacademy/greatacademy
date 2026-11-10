// The IELTS Academic course: reading and writing practice in the formats of the test, over topics already in the
// graph. See docs/english-courses/english-ielts.md.

import { type CourseDef, type TopicDef, t } from "@ga/content";
import { describingData } from "./ielts-data.ts";
import { matchingHeadings } from "./ielts-matching.ts";
import { ieltsReading } from "./ielts-reading.ts";
import { trueFalseNotGiven } from "./ielts-true-false.ts";
import { writingTask1, writingTask2 } from "./ielts-writing.ts";
import { examGroup } from "./kit.ts";

/** topics are the new topics of the IELTS course, all practice-only. */
export const topics: readonly TopicDef[] = [trueFalseNotGiven, matchingHeadings, describingData, writingTask1, writingTask2];

/** reading are the reading units of the IELTS course. */
export const reading = [ieltsReading];

/** course is the IELTS Academic course. */
export const course: CourseDef = {
  id: "english-ielts",
  title: t("IELTS Academic", "雅思学术类"),
  description: t(
    "Practice for IELTS Academic Reading and Writing after English B2: True/False/Not given, matching headings and information, academic passages in the formats of the test, describing data for Task 1 and the essay of Task 2. It teaches nothing new: its own topics start with practice, and every text is written for this course. Listening and Speaking will follow with audio.",
    "学完英语 B2 之后的雅思学术类阅读与写作练习：判断题、段落标题与信息匹配、按考试题型出题的学术文章、Task 1 的数据描述和 Task 2 的议论文。本课程不教新知识：它自己的主题一开始就是练习，所有文章都是为本课程原创的。听力和口语将在有了音频之后加入。",
  ),
  group: examGroup,
  buildsOn: ["english-b2"],
  units: [
    {
      title: t("Academic Reading", "学术阅读"),
      modules: [
        {
          title: t("Reading Skills", "阅读技能"),
          topics: ["main-idea", "supporting-details", "making-inferences", "fact-and-opinion", "claims", "reading-charts-and-statistics"],
        },
        { title: t("IELTS Question Types", "雅思题型"), topics: ["ielts-true-false-not-given", "ielts-matching-headings"] },
      ],
      reading: ["ielts-reading"],
    },
    {
      title: t("Writing Task 1", "写作 Task 1"),
      modules: [
        {
          title: t("The Language of Data", "数据的语言"),
          topics: ["b2-words-trends", "comparatives-and-superlatives", "ielts-describing-data"],
        },
        { title: t("The Report", "报告"), topics: ["writing-a-report", "ielts-writing-task-1"] },
      ],
    },
    {
      title: t("Writing Task 2", "写作 Task 2"),
      modules: [
        {
          title: t("Building an Argument", "构建论证"),
          topics: ["b2-words-linking-1", "hedging-and-qualification", "writing-a-thesis-statement", "introductions-and-conclusions"],
        },
        { title: t("The Essay", "议论文"), topics: ["writing-an-opinion-essay", "ielts-writing-task-2"] },
      ],
    },
  ],
  reading: ["ielts-reading"],
};
