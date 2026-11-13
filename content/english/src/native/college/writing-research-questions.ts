// College writing: telling a good research question from a weak one. Each subject has a broad question, a second one
// as broad, a question answered by looking up one fact, a question of taste or belief, and three focused questions that
// one study could answer. A learner first names what kind of question each one is, then narrows the broad question.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

/** kinds are the kinds of question a learner names, the last one a good research question. */
const kinds = [
  "too broad to answer in one study",
  "answered by looking up one fact",
  "a matter of taste or belief, not evidence",
  "focused and researchable",
] as const;

/** Kind is one of the kinds of question. */
type Kind = (typeof kinds)[number];

const kindWhy: Readonly<Record<Kind, readonly [string, string]>> = {
  "too broad to answer in one study": [
    "it names a whole field, not a question one study can answer: there is no clear group, place or measure to look at",
    "它说的是整个领域，而不是一项研究能回答的问题：没有明确的人群、地点或衡量标准",
  ],
  "answered by looking up one fact": [
    "a reference book or a single search answers it, so there is nothing to find out by research",
    "查一本参考书或搜索一次就能回答，没有需要通过研究去发现的东西",
  ],
  "a matter of taste or belief, not evidence": [
    "it asks for a judgment of taste or values, and no data could settle it",
    "它要求的是品味或价值判断，任何数据都无法给出定论",
  ],
  "focused and researchable": [
    "it names who or what is studied, where or when, and what is measured or asked, so one study could answer it with evidence",
    "它说清了研究谁或什么、在何时何地、衡量或询问什么，因此一项研究可以用证据回答它",
  ],
};

const kindZh: Readonly<Record<Kind, string>> = {
  "too broad to answer in one study": "范围太大，一项研究无法回答",
  "answered by looking up one fact": "查一个事实就能回答",
  "a matter of taste or belief, not evidence": "属于品味或信念，无法用证据回答",
  "focused and researchable": "聚焦且可以研究",
};

/** Subject is a subject of research with its questions of each kind. */
interface Subject {
  readonly broad: string;
  readonly alsoBroad: string;
  readonly fact: string;
  readonly opinion: string;
  readonly focused: readonly [string, string, string];
}

const subjects: readonly Subject[] = [
  {
    broad: "What effect does social media have on society?",
    alsoBroad: "How has the internet changed young people's lives?",
    fact: "When was the first social media site launched?",
    opinion: "Is social media a bad thing?",
    focused: [
      "How does the time 15-year-olds in one city spend on short-video apps relate to their hours of sleep on school nights?",
      "Did students at two high schools who took a two-week break from social media report less anxiety than those who did not?",
      "How do first-year university students describe the part group chats played in making friends during their first term?",
    ],
  },
  {
    broad: "What is the future of transport?",
    alsoBroad: "How do cities affect the environment?",
    fact: "How long is the longest metro line in the world?",
    opinion: "Are bicycles more beautiful than cars?",
    focused: [
      "How did car traffic on streets within 500 metres of new bike lanes in one city change in the year after they opened?",
      "Why do commuters in a mid-sized city who live near a train station still drive to work?",
      "How did free bus travel for people over 65 in one region affect how often they visited the town centre?",
    ],
  },
  {
    broad: "How does food affect health?",
    alsoBroad: "Why do people eat what they eat?",
    fact: "How many calories are in a slice of white bread?",
    opinion: "Is Italian food the best in the world?",
    focused: [
      "Does printing calorie counts on the menu change what students order in one university canteen?",
      "How do working parents of young children in one town decide what to cook on weekday evenings?",
      "How did the amount of fruit pupils took at lunch change after one school district moved fruit to the start of the lunch line?",
    ],
  },
  {
    broad: "What can be done about climate change?",
    alsoBroad: "How does the weather affect farming?",
    fact: "What was the average temperature in Paris last July?",
    opinion: "Do farmers deserve more respect than office workers?",
    focused: [
      "How have rice farmers in one province changed their planting dates as the rains have come later over the past decade?",
      "What persuades owners of small dairy farms in one region to adopt feeding methods that reduce methane?",
      "How did crop yields on farms using cover crops differ from those on nearby farms without them during the 2022 drought?",
    ],
  },
  {
    broad: "How has technology changed education?",
    alsoBroad: "What makes a good teacher?",
    fact: "In what year did the first online university degree begin?",
    opinion: "Is it wrong for teachers to use slides?",
    focused: [
      "Do first-year students who attend live online lectures hand in more assignments than those who watch the recordings?",
      "How do teachers in rural schools in one county decide which lessons to teach online?",
      "What reasons do adult learners give for leaving free online language courses within the first month?",
    ],
  },
  {
    broad: "How has work changed in the twenty-first century?",
    alsoBroad: "What makes employees happy?",
    fact: "How many hours a week does the average employee in Germany work?",
    opinion: "Is working from home lazier than working in an office?",
    focused: [
      "How did sick days change at three firms in the year after they moved to a four-day week?",
      "How do junior staff at one software company learn from senior colleagues when most of them work from home?",
      "What reasons do nurses who leave hospital jobs within two years give for leaving?",
    ],
  },
  {
    broad: "How do children learn languages?",
    alsoBroad: "Why are languages important?",
    fact: "How many official languages does Switzerland have?",
    opinion: "Is French a more beautiful language than German?",
    focused: [
      "How often do children of Chinese-speaking parents in one Canadian city use Chinese with their brothers and sisters, compared with their parents?",
      "Does a weekly storytelling session in their home language improve the English vocabulary of five-year-olds in one school?",
      "Why do some adult migrants in one town stop attending free language classes after the first term?",
    ],
  },
  {
    broad: "What are the effects of tourism?",
    alsoBroad: "Why do people travel?",
    fact: "How many visitors did the Louvre receive last year?",
    opinion: "Are beach holidays a waste of time?",
    focused: [
      "How did rents in the old town of one coastal city change after short-term holiday lets were limited in 2019?",
      "How do residents of a small island describe the effects of cruise ships on their daily lives?",
      "Did visitor numbers at one national park fall after it began charging an entry fee?",
    ],
  },
  {
    broad: "Why do people read?",
    alsoBroad: "How has reading changed in the digital age?",
    fact: "When was the first e-book reader sold?",
    opinion: "Are printed books better than e-books?",
    focused: [
      "Do students who read a text on paper answer more questions about it correctly than those who read it on a screen?",
      "How do teenagers in one city choose the books they read outside school?",
      "How did borrowing at public libraries in one region change after fines for late books were removed?",
    ],
  },
  {
    broad: "How can the world save energy?",
    alsoBroad: "Why do people waste energy?",
    fact: "What is the price of electricity in Spain today?",
    opinion: "Is it selfish to leave the lights on?",
    focused: [
      "Did households in one town that received monthly reports comparing their electricity use with their neighbours' use less electricity?",
      "Why do tenants in older apartment blocks in one city rarely ask for insulation to be installed?",
      "How much energy is saved in one university dormitory when the heating switches off automatically at night?",
    ],
  },
];

/** others gives the kinds other than right, in order. */
const others = (right: Kind) => kinds.filter((k) => k !== right);

const kindItems: readonly ChoiceItem[] = subjects.flatMap((s): ChoiceItem[] => {
  const asked: readonly (readonly [string, Kind])[] = [
    [s.broad, "too broad to answer in one study"],
    [s.fact, "answered by looking up one fact"],
    [s.focused[0], "focused and researchable"],
    [s.opinion, "a matter of taste or belief, not evidence"],
    [s.alsoBroad, "too broad to answer in one study"],
    [s.focused[1], "focused and researchable"],
    [s.focused[2], "focused and researchable"],
  ];
  return asked.map(([question, kind]) => [question, kind, others(kind)]);
});

const narrowItems: readonly ChoiceItem[] = subjects.flatMap((s) =>
  s.focused.map((f): ChoiceItem => [`**Broad question:** ${s.broad}`, f, [s.alsoBroad, s.fact, s.opinion]]),
);

/** judgingResearchQuestions is the college topic of telling a good research question from a weak one. */
export const judgingResearchQuestions: TopicDef = {
  id: "judging-research-questions",
  title: t("Judging Research Questions", "判断研究问题的好坏"),
  summary: t(
    "What makes a research question one a study can answer: not too broad, not a single fact, not a matter of taste, but focused on who, where and what is measured.",
    "一个研究问题怎样才能由一项研究来回答：不能太宽泛，不能只是一个事实，也不能是品味问题，而要聚焦于研究谁、在哪里、衡量什么。",
  ),
  prerequisites: ["words-of-research"],
  encompasses: [{ topic: "words-of-research", weight: 0.1 }],
  xp: 12,
  strand: "writing",
  knowledgePoints: [
    point(
      "naming-the-kind-of-question",
      t("Naming the Kind of Question", "判断问题的类型"),
      t(
        "A research question must be one that evidence from a single study can answer. Three kinds fail. A question that is **too broad**, such as *How does food affect health?*, names a whole field. A question **answered by one fact**, such as *How many calories are in a slice of bread?*, needs a search, not research. A question of **taste or belief**, such as *Is Italian food the best?*, cannot be settled by any data.\n\nA **focused** question names who or what is studied, where or when, and what is measured or asked: *Does printing calorie counts on the menu change what students order in one university canteen?*",
        "研究问题必须能用一项研究得到的证据来回答。有三类问题不合格。**范围太大**的问题，如 *How does food affect health?*，说的是整个领域。**查一个事实就能回答**的问题，如 *How many calories are in a slice of bread?*，只需搜索，不需研究。**品味或信念**的问题，如 *Is Italian food the best?*，任何数据都无法定论。\n\n**聚焦**的问题说清楚研究谁或什么、在何时何地、衡量或询问什么：*Does printing calorie counts on the menu change what students order in one university canteen?*",
      ),
      choiceGenerator(t("What kind of question is this?", "这是哪一类问题？"), kindItems, (right) => {
        const kind = right as Kind;
        const [en, zh] = kindWhy[kind];
        return t(`**${right}**: ${en}.`, `**${right}**（${kindZh[kind]}）：${zh}。`);
      }),
    ),
    point(
      "narrowing-a-broad-question",
      t("Narrowing a Broad Question", "把宽泛的问题收窄"),
      t(
        "To turn a broad question into a research question, narrow it on three sides: **who** (first-year students, owners of small dairy farms), **where or when** (one city, the year after the bike lanes opened) and **what is measured or asked** (hours of sleep, the reasons people give). A narrower question is not a smaller idea: it is one you can actually answer.\n\nDo not narrow it into a single fact to look up, or into a question of taste; and a different broad question is no better than the first.",
        "要把宽泛的问题变成研究问题，就要从三方面收窄：**研究谁**（大一学生、小型奶牛场的场主）、**在何时何地**（某一个城市、自行车道开通后的一年）和**衡量或询问什么**（睡眠时长、人们给出的理由）。更窄的问题并不是更小的想法，而是真正能回答的问题。\n\n不要把它收窄成只需查找的事实，或者品味问题；换成另一个宽泛的问题也并没有更好。",
      ),
      choiceGenerator(
        t("Which question narrows the broad question into a good research question?", "哪个问题把宽泛的问题收窄成了好的研究问题？"),
        narrowItems,
        (right) =>
          t(
            `**${right}** It names who is studied, where or when, and what is measured or asked, so one study could answer it. The others are still too broad, need only one fact, or ask for a judgment of taste.`,
            `**${right}** 它说清了研究谁、在何时何地、衡量或询问什么，因此一项研究就能回答。其他选项要么仍然太宽泛，要么只需查一个事实，要么要求的是品味判断。`,
          ),
      ),
    ),
  ],
};
