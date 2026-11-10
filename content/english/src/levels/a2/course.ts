// The course of A2, in units on themes. Each unit teaches its words, grammar and writing together, gives a set of
// passages to read on the theme, and closes with a conversation.

import { type CourseDef, t, type UnitDef } from "@ga/content";
import { levelUnit } from "../pre-a1/level-unit.ts";

const units: readonly UnitDef[] = [
  levelUnit(
    t("Last Weekend", "上个周末"),
    {
      words: ["a2-words-past-time", "a2-words-relatives", "a2-words-events", "a2-words-weekend", "a2-words-useful-words"],
      grammar: ["past-simple-regular", "past-simple-irregular", "past-simple-questions-and-negatives"],
      writing: ["writing-sentences-in-the-past", "writing-about-your-weekend"],
    },
    "a2-reading-last-weekend",
    "telling-about-your-weekend",
  ),
  levelUnit(
    t("Health and the Body", "健康和身体"),
    {
      words: ["a2-words-health", "a2-words-body-2", "a2-words-staying-well", "a2-words-at-the-doctor"],
      grammar: ["should-and-must", "have-to"],
      writing: ["writing-advice-with-should"],
    },
    "a2-reading-health",
    "at-the-doctor",
  ),
  levelUnit(
    t("Neighbors and Community", "邻里和社区"),
    {
      words: [
        "a2-words-neighborhood",
        "a2-words-community-actions",
        "a2-words-people-around",
        "a2-words-describing-places",
        "a2-words-pronouns",
      ],
      grammar: ["comparatives-and-superlatives", "possessive-pronouns", "apostrophes-and-possessives"],
      writing: ["writing-comparisons", "writing-a-description-of-a-place"],
    },
    "a2-reading-neighborhood",
    "meeting-a-new-neighbor",
  ),
  levelUnit(
    t("Cooking", "烹饪"),
    {
      words: ["a2-words-cooking", "a2-words-ingredients", "a2-words-taste", "a2-words-quantities"],
      grammar: ["quantifiers-a-few-and-a-little"],
      writing: ["writing-steps-in-order", "writing-a-recipe"],
    },
    "a2-reading-cooking",
    "cooking-together",
  ),
  levelUnit(
    t("Sports and Games", "运动和游戏"),
    {
      words: ["a2-words-sports", "a2-words-competition", "a2-words-movement", "a2-words-games", "a2-words-adverbs"],
      grammar: ["adverbs-of-manner", "could-for-past-ability"],
      writing: ["writing-about-a-past-event"],
    },
    "a2-reading-sports",
    "talking-about-a-match",
  ),
  levelUnit(
    t("Animals and Pets", "动物和宠物"),
    {
      words: ["a2-words-pets", "a2-words-wildlife", "a2-words-animal-life", "a2-words-farm-and-care"],
      grammar: ["past-continuous", "coordinating-conjunctions"],
      writing: ["expanding-with-because-but-so"],
    },
    "a2-reading-animals",
    "choosing-a-pet",
  ),
  levelUnit(
    t("Travel and Holidays", "旅行和假期"),
    {
      words: ["a2-words-holidays", "a2-words-places-to-visit", "a2-words-transport", "a2-words-future"],
      grammar: ["be-going-to", "will-for-the-future"],
      writing: ["writing-about-future-plans"],
    },
    "a2-reading-travel",
    "checking-into-a-hotel",
  ),
  levelUnit(
    t("The Natural World", "自然世界"),
    {
      words: ["a2-words-landscape", "a2-words-weather-2", "a2-words-space", "a2-words-plants", "a2-words-little-words-3"],
      grammar: ["present-perfect-with-ever-and-never"],
      writing: ["writing-about-an-experience"],
    },
    "a2-reading-nature",
    "planning-a-day-outdoors",
  ),
  levelUnit(
    t("Shopping and Money", "购物和金钱"),
    {
      words: ["a2-words-money", "a2-words-shops", "a2-words-things-we-buy", "a2-words-materials"],
      grammar: ["too-and-enough", "one-and-ones"],
      writing: ["writing-a-message-to-a-shop"],
    },
    "a2-reading-money",
    "returning-something-to-a-shop",
  ),
  levelUnit(
    t("Technology", "科技"),
    {
      words: ["a2-words-technology", "a2-words-using-tech", "a2-words-communication", "a2-words-machines"],
      grammar: ["present-perfect-with-just-already-and-yet"],
      writing: ["writing-an-email-to-a-friend"],
    },
    "a2-reading-technology",
    "helping-with-a-new-phone",
  ),
  levelUnit(
    t("Festivals and Celebrations", "节日和庆祝"),
    {
      words: ["a2-words-festivals", "a2-words-wishes", "a2-words-feelings-2", "a2-words-people-together"],
      grammar: ["verbs-followed-by-to", "subordinating-conjunctions"],
      writing: ["writing-an-invitation-and-a-reply"],
    },
    "a2-reading-festivals",
    "planning-a-party",
  ),
  levelUnit(
    t("Jobs and Dreams", "工作和梦想"),
    {
      words: ["a2-words-jobs-2", "a2-words-work-life", "a2-words-ambitions"],
      grammar: ["subject-and-object-questions"],
      writing: ["writing-about-your-dream-job"],
    },
    "a2-reading-jobs",
    "a-summer-job-interview",
  ),
];

/** courses are the course of A2. */
export const courses: readonly CourseDef[] = [
  {
    id: "english-a2",
    title: t("English A2", "英语 A2"),
    description: t(
      "The third course for learners of English as a foreign language, after A1: about 590 new words in twelve units. Themed units on last weekend, health, the neighborhood, cooking, sport, animals, travel, the natural world, shopping, technology, festivals and jobs teach the past simple and continuous, should, must and have to, comparisons, going to and will, the present perfect with ever, never, just, already and yet, too and enough, verbs with to, linking words and questions about the subject, with emails, recipes, stories, invitations and descriptions to write and stories, emails and simple articles to read on each theme.",
      "面向把英语作为外语学习者的第三门课程，接在 A1 之后：十二个单元约 590 个新单词。主题单元涵盖上个周末、健康、邻里、烹饪、运动、动物、旅行、自然世界、购物、科技、节日和职业，教授一般过去时和过去进行时、should、must 和 have to、比较级、going to 和 will、与 ever、never、just、already 和 yet 连用的现在完成时、too 和 enough、接 to 的动词、连接词以及对主语提问；每个主题都有邮件、食谱、故事、邀请和描述要写，也有故事、邮件和简单的文章供阅读。",
    ),
    group: t("English as a Foreign Language", "英语（外语）"),
    buildsOn: ["english-a1"],
    units,
    reading: units.flatMap((u) => u.reading ?? []),
    conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
  },
];
