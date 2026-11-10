// The course of A1, in units on themes. Each unit teaches its words, grammar and writing together, gives a set of
// passages to read on the theme, and closes with a conversation.

import { type CourseDef, t, type UnitDef } from "@ga/content";
import { levelUnit } from "../pre-a1/level-unit.ts";

const units: readonly UnitDef[] = [
  levelUnit(
    t("All About Me", "关于我"),
    {
      words: [
        "a1-words-numbers-to-hundred",
        "a1-words-about-me",
        "a1-words-feelings",
        "a1-words-everyday-words",
        "a1-words-little-words-3",
      ],
      grammar: ["present-simple"],
    },
    "a1-reading-all-about-me",
    "introducing-yourself",
  ),
  levelUnit(
    t("My Day", "我的一天"),
    {
      words: ["a1-words-my-day", "a1-words-times-of-day", "a1-words-how-often", "a1-words-little-words-1"],
      grammar: ["third-person-s", "adverbs-of-frequency"],
      writing: ["writing-sentences-about-routines"],
    },
    "a1-reading-my-day",
    "talking-about-your-day",
  ),
  levelUnit(
    t("Time and Dates", "时间和日期"),
    {
      words: ["a1-words-time", "a1-words-days", "a1-words-months", "a1-words-dates", "a1-words-ordinals"],
      grammar: ["prepositions-of-time"],
      writing: ["writing-capital-letters-for-names"],
    },
    "a1-reading-time-and-dates",
    "making-a-plan-to-meet",
  ),
  levelUnit(
    t("Food and Drink", "食物和饮料"),
    {
      words: ["a1-words-food", "a1-words-drinks", "a1-words-meals", "a1-words-favorite-foods"],
      grammar: ["countable-and-uncountable-nouns", "some-and-any"],
      writing: ["joining-with-and-but-or"],
    },
    "a1-reading-food",
    "ordering-lunch",
  ),
  levelUnit(
    t("Clothes and Shopping", "衣服和购物"),
    {
      words: ["a1-words-clothes", "a1-words-shopping", "a1-words-at-the-shop"],
      grammar: ["present-continuous", "how-much-and-how-many"],
      writing: ["writing-what-people-are-wearing"],
    },
    "a1-reading-shopping",
    "buying-clothes",
  ),
  levelUnit(
    t("Home", "家"),
    {
      words: ["a1-words-home", "a1-words-things-at-home", "a1-words-housework"],
      grammar: ["there-is-and-there-are", "prepositions-of-place"],
      writing: ["writing-about-a-room"],
    },
    "a1-reading-home",
    "describing-your-home",
  ),
  levelUnit(
    t("Free Time", "业余时间"),
    {
      words: ["a1-words-sports-and-music", "a1-words-hobbies", "a1-words-parties", "a1-words-actions"],
      grammar: ["like-and-love-with-ing"],
      writing: ["writing-about-likes"],
    },
    "a1-reading-free-time",
    "inviting-a-friend",
  ),
  levelUnit(
    t("School", "学校"),
    {
      words: ["a1-words-school-subjects", "a1-words-schoolwork", "a1-words-little-words-2"],
      grammar: ["present-simple-negatives", "present-simple-questions"],
      writing: ["writing-questions"],
    },
    "a1-reading-school",
    "asking-about-school",
  ),
  levelUnit(
    t("The Library", "图书馆"),
    { words: ["a1-words-library", "a1-words-books"], grammar: ["object-pronouns", "the-article-the"], writing: ["writing-a-short-note"] },
    "a1-reading-library",
    "library-help-desk",
  ),
  levelUnit(
    t("Weather and Nature", "天气和自然"),
    {
      words: ["a1-words-weather", "a1-words-seasons", "a1-words-nature", "a1-words-wild-animals"],
      grammar: ["it-for-weather"],
      writing: ["writing-a-postcard"],
    },
    "a1-reading-weather",
    "talking-about-the-weather",
  ),
  levelUnit(
    t("People and Jobs", "人和职业"),
    {
      words: ["a1-words-jobs", "a1-words-describing-people", "a1-words-work-actions"],
      grammar: ["was-and-were"],
      writing: ["writing-about-a-person"],
    },
    "a1-reading-jobs",
    "asking-about-a-job",
  ),
  levelUnit(
    t("Town and Travel", "城镇和出行"),
    {
      words: ["a1-words-town", "a1-words-directions", "a1-words-trips"],
      grammar: ["wh-questions", "can-for-requests"],
      writing: ["writing-directions-to-your-home"],
    },
    "a1-reading-town",
    "asking-the-way",
  ),
];

/** courses are the course of A1. */
export const courses: readonly CourseDef[] = [
  {
    id: "english-a1",
    title: t("English A1", "英语 A1"),
    description: t(
      "The second course for learners of English as a foreign language, after Pre-A1: about 470 new everyday words, 635 in all. Twelve themed units, from yourself and your day to food, shopping, home, school, the library, the weather, jobs and travel, teach words, the present simple and continuous, was and were, and short pieces of writing, with notes, messages, descriptions and dialogues to read on each theme.",
      "面向把英语作为外语学习者的第二门课程，接在 Pre-A1 之后：约 470 个新的日常单词，累计 635 个。十二个主题单元，从自己和一天的生活，到食物、购物、家、学校、图书馆、天气、职业和出行，教授单词、一般现在时和现在进行时、was 和 were 以及简短的写作，每个主题都配有便条、消息、描述和对话供阅读。",
    ),
    group: t("English as a Foreign Language", "英语（外语）"),
    buildsOn: ["english-pre-a1"],
    units,
    reading: units.flatMap((u) => u.reading ?? []),
    conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
  },
];
