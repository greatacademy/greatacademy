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
      writing: ["combining-with-conjunctions", "identifying-topic-sentences", "writing-an-informal-email"],
    },
    "b1-reading-education",
    "choosing-a-course",
  ),
  levelUnit(
    t("Work and Careers", "工作与职业"),
    {
      words: [
        "b1-words-applying",
        "b1-words-workplace",
        "b1-words-business",
        "b1-words-work-verbs",
        "b1-words-jobs-3",
        "b1-words-work-qualities",
        "b1-words-office",
        "b1-words-little-words-5",
      ],
      grammar: ["used-to", "present-perfect-continuous"],
      writing: ["writing-a-formal-email"],
    },
    "b1-reading-work",
    "a-job-interview",
  ),
  levelUnit(
    t("Health and Fitness", "健康与健身"),
    {
      words: [
        "b1-words-illness",
        "b1-words-healthcare",
        "b1-words-fitness",
        "b1-words-nutrition",
        "b1-words-body-and-mind",
        "b1-words-health-verbs",
        "b1-words-symptoms",
        "b1-words-healthy-habits",
      ],
      grammar: ["first-conditional"],
      writing: ["ordering-sentences-in-a-paragraph", "removing-off-topic-sentences"],
    },
    "b1-reading-health",
    "talking-to-a-fitness-coach",
  ),
  levelUnit(
    t("The Environment", "环境"),
    {
      words: [
        "b1-words-environment",
        "b1-words-nature-2",
        "b1-words-green-living",
        "b1-words-change",
        "b1-words-taking-action",
        "b1-words-weather-and-climate",
        "b1-words-waste",
      ],
      grammar: ["active-and-passive-voice"],
      writing: ["choosing-transitions", "writing-a-paragraph"],
    },
    "b1-reading-environment",
    "planning-a-green-project",
  ),
  levelUnit(
    t("Media and News", "媒体与新闻"),
    {
      words: [
        "b1-words-news",
        "b1-words-media",
        "b1-words-truth",
        "b1-words-crime",
        "b1-words-describing-events",
        "b1-words-communicating",
        "b1-words-opinions",
      ],
      grammar: ["reported-speech"],
      writing: ["writing-an-opinion-paragraph", "writing-an-article"],
    },
    "b1-reading-media",
    "discussing-a-news-story",
  ),
  levelUnit(
    t("Technology in Our Lives", "生活中的科技"),
    {
      words: [
        "b1-words-digital",
        "b1-words-online-safety",
        "b1-words-research-and-design",
        "b1-words-gadgets",
        "b1-words-tech-verbs",
        "b1-words-tech-problems",
      ],
      grammar: ["second-conditional", "relative-clauses"],
      writing: ["combining-with-relative-clauses"],
    },
    "b1-reading-technology",
    "solving-a-tech-problem",
  ),
  levelUnit(
    t("Travel and Culture", "旅行与文化"),
    {
      words: [
        "b1-words-culture",
        "b1-words-travel-2",
        "b1-words-adventure",
        "b1-words-food-culture",
        "b1-words-nations",
        "b1-words-travel-problems",
        "b1-words-describing-places-2",
      ],
      grammar: ["articles-in-general-and-specific"],
      writing: ["writing-a-story"],
    },
    "b1-reading-culture",
    "asking-about-local-customs",
  ),
  levelUnit(
    t("Relationships", "人际关系"),
    {
      words: [
        "b1-words-relationships",
        "b1-words-personality",
        "b1-words-getting-on",
        "b1-words-emotions",
        "b1-words-social-life",
        "b1-words-life-events",
        "b1-words-family-life",
      ],
      grammar: ["question-tags", "indirect-questions", "run-ons-and-comma-splices"],
      writing: ["fixing-run-ons", "writing-a-letter-of-advice"],
    },
    "b1-reading-relationships",
    "giving-a-friend-advice",
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
