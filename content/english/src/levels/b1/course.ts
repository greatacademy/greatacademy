// The course of B1, in units on themes. Each unit teaches its words, grammar and writing together, gives a set of
// articles, emails and stories to read on the theme, and closes with a conversation.

import { type CourseDef, t, type UnitDef } from "@ga/content";
import { levelUnit } from "../pre-a1/level-unit.ts";

const units: readonly UnitDef[] = [
  levelUnit(
    t("Education and Learning", "教育与学习"),
    {
      words: [
        "b1-words-school-life",
        "b1-words-learning",
        "b1-words-school-people",
        "b1-words-subjects-2",
        "b1-words-thinking",
        "b1-words-qualities",
        "b1-words-study-skills",
        "b1-words-little-words-4",
      ],
      grammar: ["present-perfect-or-past-simple"],
      writing: ["identifying-topic-sentences", "writing-an-informal-email"],
    },
    "b1-reading-education",
    "choosing-a-course",
  ),
];

/** courses are the course of B1, with the units written so far. */
export const courses: readonly CourseDef[] = [
  {
    id: "english-b1",
    title: t("English B1", "英语 B1"),
    description: t(
      "The fourth course for learners of English as a foreign language, after A2. Themed units teach the words of school, work, health, the environment, the media, technology, travel, relationships, cities, science, money and the arts, the present perfect against the past simple and the other tenses of everyday speech, with paragraphs, emails, stories and articles to write and articles, opinions, narratives and reports of 180 to 350 words to read on each theme.",
      "面向把英语作为外语学习者的第四门课程，接在 A2 之后。主题单元涵盖学校、工作、健康、环境、媒体、科技、旅行、人际关系、城市、科学、金钱和艺术的词汇，教授现在完成时与一般过去时的区别以及日常口语中的其他时态；每个主题都有段落、邮件、故事和文章要写，也有 180 到 350 词的文章、观点、叙述和报道供阅读。",
    ),
    group: t("English as a Foreign Language", "英语（外语）"),
    buildsOn: ["english-a2"],
    units,
    reading: units.flatMap((u) => u.reading ?? []),
    conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
  },
];
