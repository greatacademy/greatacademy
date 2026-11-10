// The course of B2, in units on themes. Each unit teaches its words, grammar and writing together, gives a set of
// articles, essays and reports to read on the theme, and closes with a conversation.

import { type CourseDef, t, type UnitDef } from "@ga/content";
import { levelUnit } from "../pre-a1/level-unit.ts";

const units: readonly UnitDef[] = [
  levelUnit(
    t("Society and Change", "社会与变迁"),
    {
      words: [
        "b2-words-society",
        "b2-words-population",
        "b2-words-change-verbs",
        "b2-words-history",
        "b2-words-war-and-peace",
        "b2-words-politics",
        "b2-words-social-issues",
        "b2-words-trends",
        "b2-words-generations",
        "b2-words-linking-1",
        "b2-words-opinion-verbs",
      ],
      grammar: ["third-conditional"],
      writing: ["writing-a-thesis-statement"],
    },
    "b2-reading-society",
    "debating-a-social-change",
  ),
  levelUnit(
    t("Work and the Economy", "工作与经济"),
    {
      words: [
        "b2-words-economy",
        "b2-words-companies",
        "b2-words-management",
        "b2-words-employment",
        "b2-words-finance",
        "b2-words-work-conditions",
        "b2-words-production",
        "b2-words-skills",
        "b2-words-success",
        "b2-words-linking-2",
        "b2-words-quantity",
      ],
      grammar: ["passive-with-modals-and-perfect-forms", "causative-have-and-get"],
      writing: ["writing-a-report"],
    },
    "b2-reading-economy",
    "negotiating-a-pay-rise",
  ),
  levelUnit(
    t("Science, Ethics and Medicine", "科学、伦理与医学"),
    {
      words: [
        "b2-words-medicine",
        "b2-words-organs",
        "b2-words-ethics",
        "b2-words-research-2",
        "b2-words-genetics",
        "b2-words-science-verbs",
        "b2-words-mental-health",
        "b2-words-health-systems",
        "b2-words-scientific-adjectives",
        "b2-words-animals-and-people",
        "b2-words-risk",
      ],
      grammar: ["modals-of-deduction", "past-modals"],
      writing: ["introductions-and-conclusions"],
    },
    "b2-reading-medicine",
    "a-hospital-ethics-panel",
  ),
  levelUnit(
    t("Climate and Sustainability", "气候与可持续发展"),
    {
      words: [
        "b2-words-climate-change",
        "b2-words-energy",
        "b2-words-ecosystems",
        "b2-words-sustainability",
        "b2-words-farming",
        "b2-words-environmental-action",
        "b2-words-disasters",
        "b2-words-water",
        "b2-words-cause-and-effect",
        "b2-words-the-future",
        "b2-words-materials-2",
      ],
      grammar: ["future-continuous-and-future-perfect"],
      writing: ["writing-an-opinion-essay"],
    },
    "b2-reading-climate",
    "a-town-hall-on-energy",
  ),
];

/** courses are the course of B2, with the units written so far. */
export const courses: readonly CourseDef[] = [
  {
    id: "english-b2",
    title: t("English B2", "英语 B2"),
    description: t(
      "The fifth course for learners of English as a foreign language, after B1. Themed units teach the words of society, work and the economy, medicine, the climate, the media, education, culture, technology, the law and the mind; the third and mixed conditionals, past modals, the passive and the structures of formal writing; essays, reports, proposals and letters to write; and articles, essays and reports of 250 to 450 words to read on each theme.",
      "面向把英语作为外语学习者的第五门课程，接在 B1 之后。主题单元涵盖社会、工作与经济、医学、气候、媒体、教育、文化、科技、法律和心理的词汇，教授第三条件句和混合条件句、过去情态、被动语态以及正式写作的句式；要写议论文、报告、提案和信件，每个主题都有 250 到 450 词的文章、评论和报告供阅读。",
    ),
    group: t("English as a Foreign Language", "英语（外语）"),
    buildsOn: ["english-b1"],
    units,
    reading: units.flatMap((u) => u.reading ?? []),
    conversations: units.flatMap((u) => (u.conversation === undefined ? [] : [u.conversation])),
  },
];
