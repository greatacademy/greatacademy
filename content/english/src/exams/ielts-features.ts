// IELTS Reading: matching features and multiple choice. Each text reports what three people found or think about one
// subject. A learner matches statements to the people, who are lettered A to C, and answers multiple-choice questions
// that follow the text. The statements and options say it in other words, and the other people often speak about the
// same subject.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type LabelledItem, labelGenerator, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?…]$/u.test(evidence) ? "" : ".");

/** Statement is a statement, the index of the person it matches, and their words that decide it. */
type Statement = readonly [statement: string, person: number, evidence: string];

/** Question is a question, its right option, three wrong ones, and the words of the text that decide it. */
type Question = readonly [question: string, right: string, wrong: readonly [string, string, string], evidence: string];

/** Featured is a text about three people, with a statement about each and three questions. */
interface Featured {
  readonly text: string;
  readonly people: readonly [string, string, string];
  readonly statements: readonly [Statement, Statement, Statement];
  readonly questions: readonly [Question, Question, Question];
}

const letters = ["A", "B", "C"] as const;

const texts: readonly Featured[] = [
  {
    text: "Researchers disagree about why teenagers go to bed so late. Dr Maria Kovacs, a sleep scientist, argues that the cause is biological: during adolescence the body releases the sleep hormone melatonin about two hours later than in childhood. Professor James Holt accepts this but believes that screens make the problem worse, because the light from phones delays melatonin even further. Dr Aisha Rahman, who studies schools, points out that whatever the cause, early school start times leave most teenagers short of sleep, and she reports that a district which moved its start time from 7.30 to 8.30 saw attendance rise by six per cent.",
    people: ["Maria Kovacs", "James Holt", "Aisha Rahman"],
    statements: [
      [
        "A change in the timetable improved how often students came to school.",
        2,
        "a district which moved its start time from 7.30 to 8.30 saw attendance rise by six per cent",
      ],
      ["Teenagers' late bedtimes are mainly the result of a change inside the body.", 0, "the cause is biological"],
      ["Modern devices add to a natural tendency.", 1, "screens make the problem worse"],
    ],
    questions: [
      [
        "According to Dr Kovacs, what happens during adolescence?",
        "A sleep hormone is released later in the evening.",
        ["Teenagers need less sleep than children.", "The body stops producing a sleep hormone.", "Light from screens has no effect."],
        "the body releases the sleep hormone melatonin about two hours later than in childhood",
      ],
      [
        "What is Professor Holt's view of Dr Kovacs's explanation?",
        "He agrees with it but adds another cause.",
        ["He rejects it completely.", "He thinks it applies only to children.", "He says it has not been tested."],
        "accepts this but believes that screens make the problem worse",
      ],
      [
        "What happened in the district Dr Rahman describes?",
        "More students attended school after it started later.",
        ["Students went to bed two hours earlier.", "Schools began at 7.30 instead of 8.30.", "Attendance fell by six per cent."],
        "moved its start time from 7.30 to 8.30 saw attendance rise by six per cent",
      ],
    ],
  },
  {
    text: "City councils plant trees for many reasons, and experts emphasise different benefits. Dr Lena Fischer, an engineer, values trees mainly for the way they absorb rainwater: in her measurements, a street lined with mature trees sent 20 per cent less water into the drains during heavy storms. Professor Daniel Osei, a doctor, is more interested in health; he found that people living on leafy streets reported fewer visits to their family doctor. Dr Kenji Mori, an economist, warns that new trees are expensive to look after in their first years and argues that councils should plant fewer trees but care for them properly.",
    people: ["Lena Fischer", "Daniel Osei", "Kenji Mori"],
    statements: [
      ["Planting too many trees at once may be a mistake.", 2, "councils should plant fewer trees but care for them properly"],
      [
        "Trees can reduce the risk of flooding.",
        0,
        "a street lined with mature trees sent 20 per cent less water into the drains during heavy storms",
      ],
      [
        "Living near trees may be linked with better health.",
        1,
        "people living on leafy streets reported fewer visits to their family doctor",
      ],
    ],
    questions: [
      [
        "What did Dr Fischer measure?",
        "How much rainwater reached the drains.",
        ["How many trees were planted each year.", "How much it cost to care for trees.", "How often people visited a doctor."],
        "a street lined with mature trees sent 20 per cent less water into the drains",
      ],
      [
        "What does Dr Mori say about young trees?",
        "They cost a lot to maintain.",
        ["They absorb more rain than old trees.", "They grow best on busy streets.", "They improve people's health quickly."],
        "new trees are expensive to look after in their first years",
      ],
      [
        "What is the main purpose of the text?",
        "To compare experts' views on the value of city trees.",
        ["To argue that cities need more trees.", "To explain how trees absorb water.", "To describe the work of one council."],
        "experts emphasise different benefits",
      ],
    ],
  },
  {
    text: "Can adults learn a new language as well as children? Professor Ruth Adler, a linguist, believes they cannot reach native-like pronunciation unless they start before about the age of twelve. Dr Tomás Vega disagrees with the idea of a fixed age limit; in his study, adults who spent at least a year living abroad often sounded native to listeners. Dr Hana Novak, a teacher trainer, says the question matters less than people think, because most learners want to be understood, not to sound like natives, and adults in fact learn grammar faster than children in the early stages.",
    people: ["Ruth Adler", "Tomás Vega", "Hana Novak"],
    statements: [
      ["Older learners have an advantage at the start.", 2, "adults in fact learn grammar faster than children in the early stages"],
      [
        "Time spent in another country can make an important difference.",
        1,
        "adults who spent at least a year living abroad often sounded native to listeners",
      ],
      [
        "Starting late limits how a learner will sound.",
        0,
        "they cannot reach native-like pronunciation unless they start before about the age of twelve",
      ],
    ],
    questions: [
      [
        "What did Dr Vega's study suggest?",
        "Some adult learners can sound like native speakers.",
        [
          "Children always learn faster than adults.",
          "Living abroad does not help pronunciation.",
          "Adults should start before the age of twelve.",
        ],
        "adults who spent at least a year living abroad often sounded native to listeners",
      ],
      [
        "Why does Dr Novak think the debate is less important?",
        "Most learners only want to be understood.",
        ["Adults cannot improve their pronunciation.", "Native speakers do not notice accents.", "Grammar is harder than pronunciation."],
        "most learners want to be understood, not to sound like natives",
      ],
      [
        "Which statement about Professor Adler is true?",
        "She believes there is an age limit for perfect pronunciation.",
        ["She studied adults living abroad.", "She trains language teachers.", "She thinks adults learn grammar faster."],
        "they cannot reach native-like pronunciation unless they start before about the age of twelve",
      ],
    ],
  },
  {
    text: "A company of 200 staff tried a four-day working week for six months, and three people involved drew different conclusions. Sarah Lin, the head of human resources, was pleased that the number of days staff took off sick fell by a third. Mark Duval, a manager in customer service, found the change harder: his team still had to answer calls five days a week, so he had to arrange complicated rotas. Dr Priya Nair, an economist who studied the trial, noted that total output stayed the same, but she cautioned that the staff knew they were being watched and may have worked harder than usual.",
    people: ["Sarah Lin", "Mark Duval", "Priya Nair"],
    statements: [
      [
        "The results may not show what would happen normally.",
        2,
        "the staff knew they were being watched and may have worked harder than usual",
      ],
      ["Organising working hours became more difficult.", 1, "he had to arrange complicated rotas"],
      ["Employees' health appeared to improve.", 0, "the number of days staff took off sick fell by a third"],
    ],
    questions: [
      [
        "What happened to the company's output during the trial?",
        "It did not change.",
        ["It rose by a third.", "It fell in customer service.", "It was not measured."],
        "total output stayed the same",
      ],
      [
        "Why did Mark Duval find the trial difficult?",
        "Customers still expected calls to be answered every weekday.",
        ["His team took more days off sick.", "He disagreed with the economist.", "His staff refused to work on Fridays."],
        "his team still had to answer calls five days a week",
      ],
      [
        "What does Dr Nair warn about?",
        "The staff's behaviour may have been affected by the study.",
        ["The trial was too short to measure output.", "Sick days were recorded incorrectly.", "The company was too small to study."],
        "the staff knew they were being watched and may have worked harder than usual",
      ],
    ],
  },
  {
    text: "When a small charge for plastic bags was introduced in one country, three researchers studied its effects. Dr Oliver Grant found that shoppers used 80 per cent fewer bags in the first year, far more than the government had expected. Dr Mei Chen looked at what people used instead and discovered that sales of thick bin bags rose sharply, which partly cancelled out the benefit. Professor Anna Berg was less interested in the bags themselves than in the lesson: in her view, the success shows that even a tiny price can change habits that people had not thought about.",
    people: ["Oliver Grant", "Mei Chen", "Anna Berg"],
    statements: [
      ["The policy worked better than had been predicted.", 0, "far more than the government had expected"],
      [
        "A small cost can make people reconsider routine behaviour.",
        2,
        "even a tiny price can change habits that people had not thought about",
      ],
      [
        "One gain was reduced by a change in what people bought.",
        1,
        "sales of thick bin bags rose sharply, which partly cancelled out the benefit",
      ],
    ],
    questions: [
      [
        "What did Dr Chen discover?",
        "People bought more of another kind of plastic bag.",
        ["Shoppers stopped using bags completely.", "The charge was too small to have an effect.", "Bin bags became cheaper."],
        "sales of thick bin bags rose sharply",
      ],
      [
        "What was Professor Berg mainly interested in?",
        "What the charge teaches about changing habits.",
        ["How many bags shoppers used.", "What people used instead of bags.", "How much money the charge raised."],
        "less interested in the bags themselves than in the lesson",
      ],
      [
        "By how much did bag use fall in the first year?",
        "By 80 per cent.",
        ["By 20 per cent.", "By a third.", "By half."],
        "shoppers used 80 per cent fewer bags in the first year",
      ],
    ],
  },
  {
    text: "Is homework useful for young children? Dr Elena Petrova reviewed 40 studies and concluded that homework has almost no effect on the results of children under eleven. Rob Hughes, a head teacher, still sets short reading tasks at home, because he believes they help parents see what their children are learning. Professor Sam Okafor agrees with Dr Petrova's figures but thinks they miss the point: homework, he argues, teaches young children to organise their own time, a skill that tests do not measure.",
    people: ["Elena Petrova", "Rob Hughes", "Sam Okafor"],
    statements: [
      ["Homework can keep families informed.", 1, "they help parents see what their children are learning"],
      [
        "Homework may build an ability that is not measured by exams.",
        2,
        "teaches young children to organise their own time, a skill that tests do not measure",
      ],
      [
        "Homework makes little difference to young pupils' results.",
        0,
        "homework has almost no effect on the results of children under eleven",
      ],
    ],
    questions: [
      [
        "How did Dr Petrova reach her conclusion?",
        "By looking at the results of many earlier studies.",
        ["By teaching in a primary school.", "By interviewing parents.", "By testing children before and after homework."],
        "reviewed 40 studies",
      ],
      [
        "What kind of homework does Rob Hughes set?",
        "Short reading tasks.",
        ["Long writing tasks.", "No homework at all.", "Tasks for parents to complete."],
        "sets short reading tasks at home",
      ],
      [
        "What is Professor Okafor's attitude to Dr Petrova's research?",
        "He accepts her data but not her conclusion.",
        ["He thinks her figures are wrong.", "He agrees with her completely.", "He has not read it."],
        "agrees with Dr Petrova's figures but thinks they miss the point",
      ],
    ],
  },
  {
    text: "Three specialists were asked whether large solar farms should be built in deserts. Dr Yusuf Ali, an engineer, pointed out that desert sunshine is strong and reliable, but sand blowing across the panels can cut their output by a quarter unless they are cleaned often. Dr Clara Weiss, an ecologist, warned that deserts are not empty: rare plants and animals live there, and building roads to the farms disturbs them. Professor Raj Patel argued that the main problem is distance, since most deserts are far from the cities that need the power, and long cables lose some of the energy on the way.",
    people: ["Yusuf Ali", "Clara Weiss", "Raj Patel"],
    statements: [
      ["Some electricity is wasted on its way to users.", 2, "long cables lose some of the energy on the way"],
      ["The construction of transport links may harm wildlife.", 1, "building roads to the farms disturbs them"],
      [
        "Regular maintenance is needed to keep production high.",
        0,
        "sand blowing across the panels can cut their output by a quarter unless they are cleaned often",
      ],
    ],
    questions: [
      [
        "According to Dr Ali, what is an advantage of deserts?",
        "The sunshine there is strong and dependable.",
        ["There is little wind or sand.", "They are close to large cities.", "No plants or animals live there."],
        "desert sunshine is strong and reliable",
      ],
      [
        "What point does Dr Weiss make about deserts?",
        "They are home to rare species.",
        ["They are too hot for solar panels.", "They are already full of roads.", "They are completely empty."],
        "rare plants and animals live there",
      ],
      [
        "Which problem does Professor Patel consider the most important?",
        "The distance between deserts and cities.",
        ["The cost of cleaning panels.", "The damage to rare plants.", "The weakness of desert sunshine."],
        "the main problem is distance",
      ],
    ],
  },
  {
    text: "How do musicians become experts? Professor Ingrid Lund studied violinists at a music college and found that the best players had practised about 10,000 hours by the age of twenty. Dr Carlos Ruiz accepts that practice is necessary but says Lund's work ignores the kind of practice: in his research, players who worked on their weaknesses improved faster than those who simply played pieces they already knew. Dr Fatima Bello points to the role of teachers, noting that nearly all the top players she interviewed had had one teacher who changed the way they thought about music.",
    people: ["Ingrid Lund", "Carlos Ruiz", "Fatima Bello"],
    statements: [
      [
        "One person often made a lasting difference to successful musicians.",
        2,
        "had had one teacher who changed the way they thought about music",
      ],
      ["Concentrating on difficult areas leads to quicker progress.", 1, "players who worked on their weaknesses improved faster"],
      [
        "Experts had spent a very large amount of time practising.",
        0,
        "the best players had practised about 10,000 hours by the age of twenty",
      ],
    ],
    questions: [
      [
        "Who did Professor Lund study?",
        "Violin students at a music college.",
        ["Music teachers.", "Players of many instruments.", "Children learning their first instrument."],
        "studied violinists at a music college",
      ],
      [
        "What does Dr Ruiz criticise in Lund's research?",
        "It does not consider how musicians practise.",
        ["It overstates the importance of practice.", "It studied too few violinists.", "It ignores the role of teachers."],
        "Lund's work ignores the kind of practice",
      ],
      [
        "What did Dr Bello find?",
        "Most top players had been strongly influenced by a teacher.",
        [
          "The best players had several teachers.",
          "Teachers were less important than practice.",
          "Top players rarely spoke about their teachers.",
        ],
        "nearly all the top players she interviewed had had one teacher who changed the way they thought about music",
      ],
    ],
  },
  {
    text: "Tourism on a small island has doubled in ten years, and three residents describe its effects. Ana Duarte, who runs a café, says her income has risen so much that she now employs four people instead of one. Peter Moss, a fisherman, complains that housing prices have risen because so many homes are rented to visitors, and his son can no longer afford to live on the island. Dr Lucy Kim, who leads the island's environmental office, reports that visitors have helped pay for a new water treatment plant, but she worries that the beaches are becoming crowded in summer.",
    people: ["Ana Duarte", "Peter Moss", "Lucy Kim"],
    statements: [
      ["Tourism has created jobs.", 0, "she now employs four people instead of one"],
      ["Young local people are being forced to leave.", 1, "his son can no longer afford to live on the island"],
      [
        "Tourism has brought both an improvement and a concern.",
        2,
        "visitors have helped pay for a new water treatment plant, but she worries that the beaches are becoming crowded",
      ],
    ],
    questions: [
      [
        "Why have housing prices risen, according to Peter Moss?",
        "Many homes are let to tourists.",
        ["Fishermen earn more money.", "New homes cannot be built.", "Café owners are buying homes."],
        "so many homes are rented to visitors",
      ],
      [
        "What has tourism helped to pay for?",
        "A plant that treats water.",
        ["New beaches.", "Homes for young people.", "A larger fishing port."],
        "visitors have helped pay for a new water treatment plant",
      ],
      [
        "How has the number of tourists changed?",
        "It has doubled over a decade.",
        ["It has fallen in summer.", "It has risen by a quarter.", "It has stayed the same."],
        "Tourism on a small island has doubled in ten years",
      ],
    ],
  },
  {
    text: "Some care homes in Japan and Europe have begun using small robots to keep older residents company. Dr Hiro Tanaka, who designs the robots, says residents who talked to them each day were found to be less lonely after three months. Margaret Ellis, a nurse, is less enthusiastic; she notes that residents enjoyed the robots at first but often lost interest within weeks. Professor Ivan Sokolov raises a different concern: he fears that care homes short of money will use robots as an excuse to employ fewer human staff.",
    people: ["Hiro Tanaka", "Margaret Ellis", "Ivan Sokolov"],
    statements: [
      [
        "The robots may be used to save on staff costs.",
        2,
        "care homes short of money will use robots as an excuse to employ fewer human staff",
      ],
      ["Residents' interest did not last.", 1, "often lost interest within weeks"],
      [
        "Regular conversations with robots reduced loneliness.",
        0,
        "residents who talked to them each day were found to be less lonely after three months",
      ],
    ],
    questions: [
      [
        "What is Dr Tanaka's connection with the robots?",
        "He designs them.",
        ["He works with them as a nurse.", "He lives in a care home.", "He sells them to hospitals."],
        "who designs the robots",
      ],
      [
        "What did Margaret Ellis notice?",
        "Residents' enthusiasm faded quickly.",
        ["Residents refused to use the robots.", "The robots made residents lonelier.", "Nurses enjoyed the robots more than residents."],
        "residents enjoyed the robots at first but often lost interest within weeks",
      ],
      [
        "What is Professor Sokolov worried about?",
        "Fewer people may be employed to care for residents.",
        ["Robots are too expensive for care homes.", "Residents will talk only to robots.", "The robots are not safe."],
        "care homes short of money will use robots as an excuse to employ fewer human staff",
      ],
    ],
  },
];

// Every piece of evidence must be words of its text, and every person must be named in it.
for (const f of texts) {
  for (const evidence of [...f.statements.map(([, , e]) => e), ...f.questions.map(([, , , e]) => e)]) {
    if (!f.text.includes(evidence)) throw new Error(`evidence not in its text: ${evidence}`);
  }
  for (const person of f.people) if (!f.text.includes(person)) throw new Error(`person not in its text: ${person}`);
}

const peopleList = (f: Featured) => f.people.map((p, i) => `**${letters[i]}** ${p}`).join("\n\n");

function statementItems(f: Featured): readonly LabelledItem[] {
  return f.statements.map(([statement, person, evidence]) => {
    const letter = letters[person] as string;
    const name = f.people[person] as string;
    return {
      shown: `${f.text}\n\n${peopleList(f)}\n\n**Statement:** ${statement}`,
      right: person,
      solution: t(
        `**${letter}** (${name}): "${evidence}${end(evidence)}" The statement says this in other words. The others speak about the same subject but say something different.`,
        `**${letter}**（${name}）："${evidence}${end(evidence)}" 陈述用别的话说出了这一点。其他人谈的是同一话题，但说法不同。`,
      ),
      whyNot: (label) =>
        t(
          `${f.people[label]} speaks about the subject too, but does not say this. Look for ${name}'s words: "${evidence}${end(evidence)}"`,
          `${f.people[label]} 也谈到了这个话题，但没有这样说。看 ${name} 的话："${evidence}${end(evidence)}"`,
        ),
    };
  });
}

function questionItems(f: Featured): readonly SolvedChoice[] {
  return f.questions.map(([question, right, wrong, evidence]) => ({
    shown: `${f.text}\n\n**${question}**`,
    right,
    wrong,
    solution: t(
      `**${right}** The text says: "${evidence}${end(evidence)}" The other options borrow words from the text but change what it says, or say something it does not say.`,
      `**${right}** 原文是："${evidence}${end(evidence)}" 其他选项借用了原文的词语，却改变了原文的意思，或者说了原文没有说的话。`,
    ),
  }));
}

/** matchingFeaturesAndChoice is the IELTS topic of matching features and multiple choice. */
export const matchingFeaturesAndChoice: TopicDef = examTopic({
  id: "ielts-matching-features-and-multiple-choice",
  title: t("Matching Features and Multiple Choice", "人物观点匹配与单项选择"),
  summary: t(
    "IELTS-style questions on a text about several people: match each statement to the person who says it, and choose the answer that means what the text says.",
    "雅思风格的题目，短文介绍几个人的观点：把每条陈述与说出它的人匹配，并选出与原文意思相同的答案。",
  ),
  strand: "reading",
  prerequisites: ["supporting-details", "making-inferences"],
  encompasses: [
    { topic: "supporting-details", weight: 0.2 },
    { topic: "making-inferences", weight: 0.2 },
  ],
  xp: 12,
  points: [
    point(
      "ielts-matching-features",
      t("Matching Features", "人物观点匹配"),
      t(
        "In **matching features**, a text reports what several people found or think, and each statement says what one of them said in other words. First find each name in the text and mark what that person says. Then pick out the key idea of the statement and look for the same meaning, not the same words: *fewer visits to their family doctor* can be *better health*.\n\nThe usual trap is a person who speaks about the same subject but says something different, so check that the whole statement fits.",
        "在**人物观点匹配**题中，短文介绍几个人的发现或看法，每条陈述用别的话转述其中一个人的话。先在文中找到每个名字，标出这个人说了什么。然后抓住陈述的关键意思，找相同的意思而不是相同的词：*fewer visits to their family doctor* 可以是 *better health*。\n\n常见的陷阱是另一个人谈的是同一话题但说法不同，所以要核对整条陈述都符合。",
      ),
      labelGenerator(
        t(
          "Match the statement below the text with the correct person, **A**, **B** or **C**.",
          "把短文下方的陈述与正确的人物匹配：**A**、**B** 还是 **C**？",
        ),
        [...letters],
        interleave(texts.map(statementItems)),
      ),
    ),
    point(
      "ielts-multiple-choice",
      t("Multiple Choice", "单项选择"),
      t(
        "IELTS multiple-choice questions follow the order of the text. Find the part of the text the question is about, read it closely, then check each option against it. Wrong options often repeat words from the text but change the meaning, mix up who said what, or say something the text never says. Choose the option that means the same as the text, even when it uses different words.",
        "雅思单项选择题按原文顺序出题。先找到题目所问的那部分原文，仔细读，再逐个用它核对选项。错误选项常常重复原文的词却改变了意思、把一个人的话安到另一个人身上，或者说了原文根本没说的话。要选与原文意思相同的选项，哪怕它用了不同的词。",
      ),
      solvedChoiceGenerator(
        t("Choose the correct answer to the question below the text.", "选出短文下方问题的正确答案。"),
        interleave(texts.map(questionItems)),
      ),
    ),
  ],
});
