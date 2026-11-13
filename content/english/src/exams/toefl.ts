// The TOEFL iBT course: reading and writing practice in the formats of the updated test, over topics already in the
// graph. See docs/english-courses/english-toefl.md.

import { type CourseDef, type TopicDef, t } from "@ga/content";
import { examGroup } from "./kit.ts";
import { buildASentence } from "./toefl-build-a-sentence.ts";
import { completeTheWords } from "./toefl-complete-the-words.ts";
import { passageQuestions } from "./toefl-passage-questions.ts";
import { toeflReading } from "./toefl-reading.ts";
import { academicDiscussion, writingAnEmail } from "./toefl-writing.ts";

/** topics are the new topics of the TOEFL course, all practice-only. */
export const topics: readonly TopicDef[] = [completeTheWords, passageQuestions, buildASentence, writingAnEmail, academicDiscussion];

/** reading are the reading units of the TOEFL course. */
export const reading = [toeflReading];

/** course is the TOEFL iBT course. */
export const course: CourseDef = {
  id: "english-toefl",
  title: t("TOEFL iBT", "托福网考"),
  description: t(
    "Practice for the Reading and Writing sections of the TOEFL iBT after English B2: completing words in academic texts, the words of campus and academic subjects, everyday notices and short academic passages with questions on words and purpose, building replies word by word, an email and a post to an academic discussion. It teaches nothing new: its own topics start with practice, and every text is written for this course. Listening and Speaking will follow with audio.",
    "学完英语 B2 之后的托福网考阅读和写作练习：在学术短文中补全单词、校园与学术话题的词汇、日常通知和带词义与写作意图题的简短学术文章、逐词组成回答、写电子邮件和学术讨论帖。本课程不教新知识：它自己的主题一开始就是练习，所有文章都是为本课程原创的。听力和口语将在有了音频之后加入。",
  ),
  group: examGroup,
  buildsOn: ["english-b2"],
  units: [
    {
      title: t("Reading", "阅读"),
      modules: [
        {
          title: t("Reading Skills", "阅读技能"),
          topics: ["main-idea", "supporting-details", "making-inferences", "authors-purpose", "reading-workplace-documents"],
        },
        {
          title: t("Complete the Words", "补全单词"),
          topics: ["b2-words-linking-1", "b2-words-research-2", "toefl-complete-the-words"],
        },
        {
          title: t("Academic Words", "学术词汇"),
          topics: [
            "b2-words-higher-education",
            "b2-words-learning-2",
            "b2-words-teaching",
            "b2-words-assessment",
            "b2-words-digital-learning",
            "b2-words-genetics",
            "b2-words-ecosystems",
            "b2-words-psychology",
            "b2-words-memory-and-sleep",
            "b2-words-science-verbs",
            "b2-words-thinking-verbs",
            "b2-words-academic-adjectives",
            "b2-words-transitions",
          ],
        },
        {
          title: t("Academic Passages", "学术文章"),
          topics: ["context-clues", "toefl-passage-questions"],
        },
      ],
      reading: ["toefl-reading"],
    },
    {
      title: t("Writing", "写作"),
      modules: [
        {
          title: t("Build a Sentence", "连词成句"),
          topics: [
            "indirect-questions",
            "subject-and-object-questions",
            "reporting-verbs",
            "participial-phrases",
            "appositives",
            "toefl-build-a-sentence",
          ],
        },
        {
          title: t("Write an Email", "写电子邮件"),
          topics: ["b2-words-formal-verbs", "writing-a-formal-email", "toefl-writing-an-email"],
        },
        {
          title: t("Academic Discussion", "学术讨论"),
          topics: [
            "b2-words-opinion-verbs",
            "b2-words-certainty",
            "b2-words-tech-in-society",
            "linking-words-of-contrast",
            "writing-an-opinion-paragraph",
            "writing-an-evidence-paragraph",
            "counterclaims-and-rebuttals",
            "writing-a-counterclaim-paragraph",
            "toefl-academic-discussion",
          ],
        },
      ],
    },
  ],
  reading: ["toefl-reading"],
};
