// The course of Pre-A1, in units on themes. Each unit teaches its words, grammar and writing together, gives a set
// of passages to read on the theme, and closes with a conversation.

import { type CourseDef, t, type UnitDef } from "@ga/content";
import { levelUnit } from "./level-unit.ts";

const units: readonly UnitDef[] = [
  levelUnit(
    t("Hello!", "你好！"),
    { words: ["pre-a1-words-hello", "pre-a1-words-i-and-you"], grammar: ["the-verb-be"] },
    "pre-a1-reading-hello",
    "meeting-a-new-classmate",
  ),
  levelUnit(
    t("Numbers and Colors", "数字和颜色"),
    {
      words: ["pre-a1-words-numbers", "pre-a1-words-colors", "pre-a1-words-how-many"],
      grammar: ["a-and-an", "plural-nouns-with-s"],
      writing: ["writing-capitals-and-periods"],
    },
    "pre-a1-reading-numbers-and-colors",
    "counting-and-colors",
  ),
  levelUnit(
    t("My Family", "我的家庭"),
    {
      words: ["pre-a1-words-family", "pre-a1-words-my-and-your", "pre-a1-words-people"],
      grammar: ["he-she-and-it", "my-your-his-her", "have-and-has"],
    },
    "pre-a1-reading-my-family",
    "talking-about-my-family",
  ),
  levelUnit(
    t("My Classroom", "我的教室"),
    {
      words: ["pre-a1-words-classroom", "pre-a1-words-this-and-that", "pre-a1-words-classroom-actions"],
      grammar: ["this-that-these-those", "in-on-and-under", "imperatives"],
      writing: ["writing-words-in-order"],
    },
    "pre-a1-reading-classroom",
    "finding-things-in-the-classroom",
  ),
  levelUnit(
    t("Animals", "动物"),
    {
      words: ["pre-a1-words-animals", "pre-a1-words-can-and-like", "pre-a1-words-little-words"],
      grammar: ["can-for-ability", "questions-with-be"],
    },
    "pre-a1-reading-animals",
    "my-favorite-animal",
  ),
  levelUnit(
    t("My Body", "我的身体"),
    { words: ["pre-a1-words-body"], grammar: ["adjectives-before-nouns"], writing: ["writing-about-yourself"] },
    "pre-a1-reading-my-body",
    "drawing-a-monster",
  ),
];

/** courses are the course of Pre-A1. */
export const courses: readonly CourseDef[] = [
  {
    id: "english-pre-a1",
    title: t("English Pre-A1", "英语 Pre-A1"),
    description: t(
      "A first English course for learners of English as a foreign language, from hello to about 160 of the commonest words. Six themed units, from greetings and numbers to family, the classroom, animals and the body, teach words, short sentences with be, have and can, and capital letters and word order, with short dialogues and descriptions to read on each theme.",
      "面向把英语作为外语学习者的入门课程，从 hello 开始，学会约 160 个最常用的英语单词。六个主题单元，从问候和数字到家庭、教室、动物和身体，教授单词、用 be、have 和 can 构成的短句，以及大写字母和词序，每个主题都配有简短的对话和描述供阅读。",
    ),
    group: t("English as a Foreign Language", "英语（外语）"),
    units,
    reading: units.flatMap((u) => u.reading ?? []),
    conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
  },
];
