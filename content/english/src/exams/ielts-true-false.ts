// IELTS Reading: True/False/Not given about facts, and Yes/No/Not given about a writer's views. Each short text
// carries three statements, one of each answer, so that a learner must tell a contradiction from a silence.

import { type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type LabelledItem, labelGenerator } from "./kit.ts";

/** Kind is the answer of a statement: it agrees with the text, contradicts it, or the text does not say. */
type Kind = "agrees" | "contradicts" | "silent";

/** Statement is a statement about a text, its answer, and the sentence of the text that decides it. */
type Statement = readonly [statement: string, kind: Kind, evidence: string];

/** Judged is a short text with its three statements. */
interface Judged {
  readonly text: string;
  readonly statements: readonly Statement[];
}

const position: Record<Kind, number> = { agrees: 0, contradicts: 1, silent: 2 };

function solution(kind: Kind, evidence: string, views: boolean): Text {
  const [yes, no] = views ? ["Yes", "No"] : ["True", "False"];
  const claim = views ? "the writer's view" : "the information";
  const claimZh = views ? "作者的观点" : "文中的信息";
  if (kind === "agrees")
    return t(`${yes}. The text says the same in other words: "${evidence}"`, `${yes}。原文换了一种说法表达同样的意思："${evidence}"`);
  if (kind === "contradicts")
    return t(`${no}. The statement contradicts ${claim}: "${evidence}"`, `${no}。题目与${claimZh}相矛盾："${evidence}"`);
  return t(
    `Not given. The text only says: "${evidence}" It neither confirms nor contradicts the statement, so do not add what you know or guess.`,
    `Not given。原文只说："${evidence}" 它既没有证实也没有否定题目的说法，不要加入自己的知识或猜测。`,
  );
}

/** whyNotLabel explains a wrong label: label 0 says the text agrees, 1 that it contradicts, 2 that it is silent. */
function whyNotLabel(kind: Kind, label: number, evidence: string, views: boolean): Text {
  const [yes, no] = views ? ["Yes", "No"] : ["True", "False"];
  if (kind === "agrees")
    return label === 1
      ? t(
          `${no} needs the text to say the opposite, but it says the same in other words: "${evidence}"`,
          `${no} 要求原文说出相反的意思，但原文换了说法表达的是同样的意思："${evidence}"`,
        )
      : t(
          `The text does say this, in other words, so it is not Not given: "${evidence}"`,
          `原文确实说了这一点，只是换了说法，所以不是 Not given："${evidence}"`,
        );
  if (kind === "contradicts")
    return label === 0
      ? t(
          `${yes} needs the text to say the same, but it says the opposite: "${evidence}"`,
          `${yes} 要求原文表达同样的意思，但原文说的正相反："${evidence}"`,
        )
      : t(
          `The text does speak to this, and it says the opposite, so it is not Not given: "${evidence}"`,
          `原文确实谈到了这一点，而且说的正相反，所以不是 Not given："${evidence}"`,
        );
  return label === 0
    ? t(
        `${yes} needs the text to confirm the statement, but it only says: "${evidence}" That is close, not the same.`,
        `${yes} 要求原文证实题目的说法，但原文只说："${evidence}" 意思相近，并不相同。`,
      )
    : t(
        `${no} needs the text to say the opposite, but it only says: "${evidence}" That leaves the statement open.`,
        `${no} 要求原文说出相反的意思，但原文只说："${evidence}" 题目的说法仍无从判断。`,
      );
}

function items(texts: readonly Judged[], views: boolean): readonly LabelledItem[] {
  const byText = texts.map((judged) =>
    judged.statements.map(
      ([statement, kind, evidence]): LabelledItem => ({
        shown: `${judged.text}\n\n**Statement:** ${statement}`,
        right: position[kind],
        solution: solution(kind, evidence, views),
        whyNot: (label: number) => whyNotLabel(kind, label, evidence, views),
      }),
    ),
  );
  return interleave(byText);
}

const facts: readonly Judged[] = [
  {
    text: "The first public library in the town opened in 1872 in two rooms above a bakery. It lent books only to members, who paid a small fee each year. In 1905 the library moved to a new stone building paid for by a local businessman, and from then on anyone could borrow books without paying.",
    statements: [
      [
        "At first, people had to pay to borrow books from the library.",
        "agrees",
        "It lent books only to members, who paid a small fee each year.",
      ],
      [
        "The library's first home was a stone building.",
        "contradicts",
        "The first public library in the town opened in 1872 in two rooms above a bakery.",
      ],
      [
        "The businessman who paid for the new building had been a member of the library.",
        "silent",
        "In 1905 the library moved to a new stone building paid for by a local businessman.",
      ],
    ],
  },
  {
    text: "Sea otters spend almost their whole lives in the water. Unlike most sea animals, they have no layer of fat to keep them warm. Instead, they rely on their fur, which is the thickest of any animal, and they must eat about a quarter of their body weight every day to produce enough heat.",
    statements: [
      [
        "Sea otters are protected from the cold by a thick layer of fat.",
        "contradicts",
        "Unlike most sea animals, they have no layer of fat to keep them warm.",
      ],
      [
        "A sea otter needs a large amount of food each day.",
        "agrees",
        "They must eat about a quarter of their body weight every day to produce enough heat.",
      ],
      ["Sea otters live longer than most other sea animals.", "silent", "Sea otters spend almost their whole lives in the water."],
    ],
  },
  {
    text: "The bridge was designed in 1930 to carry trains as well as cars. Work on it began in 1932, but a shortage of steel stopped it for two years. When it finally opened in 1937, the railway line was never built, and the space intended for trains became a path for people on foot and on bicycles.",
    statements: [
      [
        "The bridge took less than five years to build.",
        "contradicts",
        "Work on it began in 1932, but a shortage of steel stopped it for two years. When it finally opened in 1937...",
      ],
      ["Trains have never crossed the bridge.", "agrees", "When it finally opened in 1937, the railway line was never built."],
      [
        "The path on the bridge is popular with tourists.",
        "silent",
        "The space intended for trains became a path for people on foot and on bicycles.",
      ],
    ],
  },
  {
    text: "Most deserts are hot, but the largest desert in the world is cold. Antarctica counts as a desert because it receives very little rain or snow: in many areas, less than 50 millimetres a year. The Sahara, the largest hot desert, receives a similar amount but covers a smaller area.",
    statements: [
      [
        "Antarctica receives more rain and snow than the Sahara.",
        "silent",
        "The Sahara, the largest hot desert, receives a similar amount but covers a smaller area.",
      ],
      ["A place can be a desert even if it is cold.", "agrees", "Most deserts are hot, but the largest desert in the world is cold."],
      [
        "The Sahara is the largest desert in the world.",
        "contradicts",
        "The Sahara, the largest hot desert, receives a similar amount but covers a smaller area.",
      ],
    ],
  },
  {
    text: "In the study, 120 office workers were given plants for their desks, while another 120 were not. After three months, the workers with plants reported feeling less stressed. However, the researchers found no difference between the two groups in the amount of work they completed.",
    statements: [
      [
        "The workers with plants completed more work than the others.",
        "contradicts",
        "The researchers found no difference between the two groups in the amount of work they completed.",
      ],
      [
        "The study lasted for a quarter of a year.",
        "agrees",
        "After three months, the workers with plants reported feeling less stressed.",
      ],
      ["The workers chose which plants they wanted on their desks.", "silent", "120 office workers were given plants for their desks."],
    ],
  },
  {
    text: "Paper money was first used in China more than a thousand years ago. Merchants who carried heavy coins over long distances began to leave them with trusted traders and receive a paper note in return. The government later took control of printing the notes, and copying them became a serious crime.",
    statements: [
      [
        "Paper money began as a way of avoiding the need to carry coins.",
        "agrees",
        "Merchants who carried heavy coins over long distances began to leave them with trusted traders and receive a paper note in return.",
      ],
      [
        "The government invented paper money.",
        "contradicts",
        "Merchants ... began to leave them with trusted traders ... The government later took control of printing the notes.",
      ],
      ["The first paper notes were printed in several colours.", "silent", "The government later took control of printing the notes."],
    ],
  },
  {
    text: "The volcano last erupted in 1991, after sleeping for nearly 500 years. Scientists had noticed small earthquakes and rising gas levels two months earlier, and about 60,000 people were moved away from the area. Although the eruption was one of the largest of the century, relatively few lives were lost.",
    statements: [
      [
        "Warning signs were detected before the eruption.",
        "agrees",
        "Scientists had noticed small earthquakes and rising gas levels two months earlier.",
      ],
      [
        "The volcano had erupted several times during the twentieth century.",
        "contradicts",
        "The volcano last erupted in 1991, after sleeping for nearly 500 years.",
      ],
      ["Most of the people who moved away returned within a year.", "silent", "About 60,000 people were moved away from the area."],
    ],
  },
  {
    text: "Honey does not go bad if it is kept in a closed container. It contains very little water, and its natural acids prevent bacteria from growing. Jars of honey found in ancient tombs were still safe to eat, although their colour had become darker.",
    statements: [
      [
        "Honey from ancient tombs had changed in colour.",
        "agrees",
        "Jars of honey found in ancient tombs were still safe to eat, although their colour had become darker.",
      ],
      [
        "Honey stays fresh because it contains a lot of water.",
        "contradicts",
        "It contains very little water, and its natural acids prevent bacteria from growing.",
      ],
      ["Ancient people used honey as a medicine.", "silent", "Jars of honey found in ancient tombs were still safe to eat."],
    ],
  },
  {
    text: "The city introduced a charge for driving into its centre in 2003. Within a year, traffic in the centre had fallen by about 18 per cent. The money raised by the charge was spent on buses, and the number of bus passengers rose in the same period.",
    statements: [
      [
        "Traffic in the city centre fell by almost a fifth in the first year.",
        "agrees",
        "Within a year, traffic in the centre had fallen by about 18 per cent.",
      ],
      ["The charge was introduced to raise money for new roads.", "contradicts", "The money raised by the charge was spent on buses."],
      [
        "Shops in the centre lost customers because of the charge.",
        "silent",
        "Within a year, traffic in the centre had fallen by about 18 per cent.",
      ],
    ],
  },
  {
    text: "Elephants can recognise the voices of about a hundred other elephants. In one experiment, researchers played recordings of calls to family groups. The groups ignored the calls of elephants they knew but gathered together nervously when they heard unfamiliar ones.",
    statements: [
      [
        "The elephants reacted more strongly to calls they did not know.",
        "agrees",
        "The groups ignored the calls of elephants they knew but gathered together nervously when they heard unfamiliar ones.",
      ],
      [
        "In the experiment, the elephants ran away from familiar calls.",
        "contradicts",
        "The groups ignored the calls of elephants they knew.",
      ],
      [
        "Female elephants recognise more voices than male elephants.",
        "silent",
        "Elephants can recognise the voices of about a hundred other elephants.",
      ],
    ],
  },
];

const views: readonly Judged[] = [
  {
    text: "Many people believe that working from home makes employees lazy. In my view, the opposite is true: without long journeys to the office, most people have more energy for their work. What they lose, however, is the casual conversation with colleagues, and companies should not underestimate its value.",
    statements: [
      [
        "Working from home tends to make employees less hard-working.",
        "contradicts",
        "Many people believe that working from home makes employees lazy. In my view, the opposite is true.",
      ],
      [
        "Casual conversations with colleagues are important.",
        "agrees",
        "What they lose, however, is the casual conversation with colleagues, and companies should not underestimate its value.",
      ],
      [
        "Companies should pay for employees' equipment at home.",
        "silent",
        "In my view, the opposite is true: without long journeys to the office, most people have more energy for their work.",
      ],
    ],
  },
  {
    text: "Schools often present history as a list of dates to be memorised. This, I would argue, is the surest way to make young people hate the subject. History should be taught through the lives of ordinary people, because students understand the past best when they can imagine themselves in it.",
    statements: [
      [
        "Memorising dates is a good way to make students interested in history.",
        "contradicts",
        "This, I would argue, is the surest way to make young people hate the subject.",
      ],
      [
        "Students learn history better when they can picture themselves in the past.",
        "agrees",
        "Students understand the past best when they can imagine themselves in it.",
      ],
      ["History lessons should take place in museums.", "silent", "History should be taught through the lives of ordinary people."],
    ],
  },
  {
    text: "It is often said that tourism destroys the places it depends on. There is some truth in this, but the claim is too simple. Carefully managed tourism has paid for the protection of forests and old buildings that would otherwise have been lost. The real problem is not tourism itself but the lack of limits on visitor numbers.",
    statements: [
      [
        "Tourism can sometimes help to protect places.",
        "agrees",
        "Carefully managed tourism has paid for the protection of forests and old buildings that would otherwise have been lost.",
      ],
      [
        "Tourism itself is the main cause of damage to popular places.",
        "contradicts",
        "The real problem is not tourism itself but the lack of limits on visitor numbers.",
      ],
      [
        "Visitors should pay a tax when they enter a country.",
        "silent",
        "The real problem is not tourism itself but the lack of limits on visitor numbers.",
      ],
    ],
  },
  {
    text: "Some scientists welcome the use of computer programs to check research papers for errors. I share their enthusiasm, but with one reservation. A program can find a wrong number; it cannot judge whether a question was worth asking. That judgement must stay with human experts.",
    statements: [
      [
        "Computer programs should replace human experts in judging research.",
        "contradicts",
        "That judgement must stay with human experts.",
      ],
      [
        "The writer is generally in favour of using programs to check papers.",
        "agrees",
        "I share their enthusiasm, but with one reservation.",
      ],
      [
        "Computer programs make fewer mistakes than human experts.",
        "silent",
        "A program can find a wrong number; it cannot judge whether a question was worth asking.",
      ],
    ],
  },
  {
    text: "Governments spend large sums advertising healthy eating, yet obesity keeps rising. The adverts are not the problem; the problem is that healthy food costs more than unhealthy food in most supermarkets. Until that changes, I doubt that any campaign will make much difference.",
    statements: [
      ["Advertising campaigns are the main reason why obesity is rising.", "contradicts", "The adverts are not the problem."],
      ["The price of healthy food needs to change.", "agrees", "Until that changes, I doubt that any campaign will make much difference."],
      ["Supermarkets should be forced to sell less sugar.", "silent", "Healthy food costs more than unhealthy food in most supermarkets."],
    ],
  },
  {
    text: "Learning a musical instrument is frequently defended on the grounds that it improves children's performance in mathematics. The evidence for this is weak. But music needs no such defence: the pleasure of making it is reason enough to teach it.",
    statements: [
      ["There is strong evidence that music lessons improve mathematics.", "contradicts", "The evidence for this is weak."],
      ["Music is worth teaching for its own sake.", "agrees", "The pleasure of making it is reason enough to teach it."],
      [
        "Children should be allowed to choose which instrument they learn.",
        "silent",
        "Learning a musical instrument is frequently defended on the grounds that it improves children's performance in mathematics.",
      ],
    ],
  },
  {
    text: "New buildings in our cities are often criticised for looking all the same. The criticism is fair, but architects are rarely to blame: they work within strict budgets and rules set by others. If we want more interesting cities, we must change the rules rather than attack the designers.",
    statements: [
      [
        "Architects are mainly responsible for the sameness of new buildings.",
        "contradicts",
        "The criticism is fair, but architects are rarely to blame.",
      ],
      ["Many new city buildings do look similar.", "agrees", "The criticism is fair."],
      [
        "Old buildings are more comfortable to live in than new ones.",
        "silent",
        "New buildings in our cities are often criticised for looking all the same.",
      ],
    ],
  },
  {
    text: "Space exploration is sometimes called a waste of money when so many problems remain on Earth. I disagree. Satellites tell us more about our changing climate than any other source, and the technology developed for space has found countless uses at home. The cost, though considerable, is small compared with what we gain.",
    statements: [
      [
        "Space exploration is a waste of money.",
        "contradicts",
        "Space exploration is sometimes called a waste of money when so many problems remain on Earth. I disagree.",
      ],
      [
        "The benefits of space exploration are greater than its cost.",
        "agrees",
        "The cost, though considerable, is small compared with what we gain.",
      ],
      [
        "Private companies explore space more cheaply than governments.",
        "silent",
        "The cost, though considerable, is small compared with what we gain.",
      ],
    ],
  },
  {
    text: "Online reviews have changed how we choose restaurants and hotels. They are useful, but they should be read with care, since a few angry customers can make an excellent place look poor. The most reliable guide is the average of many reviews, not the loudest one.",
    statements: [
      [
        "A small number of bad reviews can give a misleading picture.",
        "agrees",
        "A few angry customers can make an excellent place look poor.",
      ],
      [
        "The most recent review is the most reliable guide.",
        "contradicts",
        "The most reliable guide is the average of many reviews, not the loudest one.",
      ],
      ["Restaurants often pay people to write good reviews.", "silent", "They are useful, but they should be read with care."],
    ],
  },
  {
    text: "Exams are often blamed for the stress that students feel. Exams are certainly stressful, but I believe that a moderate amount of pressure helps most students to learn. What harms them is when a single exam decides their whole future.",
    statements: [
      [
        "Some pressure can be good for students' learning.",
        "agrees",
        "I believe that a moderate amount of pressure helps most students to learn.",
      ],
      [
        "Exams should be abolished because they cause stress.",
        "contradicts",
        "Exams are certainly stressful, but I believe that a moderate amount of pressure helps most students to learn.",
      ],
      [
        "Teachers are better at judging students than exams are.",
        "silent",
        "What harms them is when a single exam decides their whole future.",
      ],
    ],
  },
];

const factQuestion = t(
  "Does the statement agree with the information in the text? Choose **True** if it agrees, **False** if it contradicts it, or **Not given** if there is no information on this.",
  "题目中的陈述与短文的信息一致吗？一致选 **True**，矛盾选 **False**，短文没有提到则选 **Not given**。",
);

const viewQuestion = t(
  "Does the statement agree with the views of the writer? Choose **Yes** if it agrees, **No** if it contradicts them, or **Not given** if it is impossible to say what the writer thinks about this.",
  "题目中的陈述与作者的观点一致吗？一致选 **Yes**，矛盾选 **No**，无法判断作者怎么想则选 **Not given**。",
);

/** trueFalseNotGiven is the IELTS topic of True/False/Not given and Yes/No/Not given. */
export const trueFalseNotGiven: TopicDef = examTopic({
  id: "ielts-true-false-not-given",
  title: t("True, False or Not Given", "判断题：True、False 还是 Not Given"),
  summary: t(
    "IELTS-style statements about short texts: whether each agrees with the information or the writer's views, contradicts them, or is not given.",
    "雅思风格的判断题：短文后的陈述与信息或作者观点一致、矛盾，还是没有提到。",
  ),
  strand: "reading",
  prerequisites: ["fact-and-opinion", "making-inferences"],
  encompasses: [
    { topic: "fact-and-opinion", weight: 0.2 },
    { topic: "making-inferences", weight: 0.2 },
  ],
  xp: 10,
  points: [
    point(
      "true-false-not-given",
      t("True, False or Not Given", "True、False 还是 Not Given"),
      t(
        "Find the sentence of the text that the statement is about, then compare the two carefully.\n\n- **True**: the text says the same thing, usually in other words.\n- **False**: the text says something that cannot be true at the same time as the statement: a different number, the opposite fact, a different person.\n- **Not given**: the text says nothing either way. Often the text mentions the same subject but not the detail the statement adds, such as a reason, a comparison or *most*.\n\nJudge only by the text, never by what you know about the world. Watch words that change the meaning: *all, some, only, never, more than, first*.",
        "先找到陈述所涉及的原文句子，再仔细比较两者。\n\n- **True**：原文表达了同样的意思，通常换了说法。\n- **False**：原文的说法与陈述不可能同时成立：数字不同、事实相反、人物不同。\n- **Not given**：原文对此既没肯定也没否定。常见情况是原文提到了同一话题，却没有陈述所加的细节，如原因、比较或 *most*。\n\n只依据原文判断，不要用自己对世界的了解。注意改变意思的词：*all, some, only, never, more than, first*。很多中国考生把“原文没提”当成 False，这是最常见的失分点。",
      ),
      labelGenerator(factQuestion, ["True", "False", "Not given"], items(facts, false)),
    ),
    point(
      "yes-no-not-given",
      t("Yes, No or Not Given", "Yes、No 还是 Not Given"),
      t(
        "These questions are about what the **writer thinks**, not about facts. First find the writer's own position: it often comes after words such as *In my view, I would argue, I disagree, but*. Views the writer reports from others (*Many people believe ..., It is often said ...*) are not the writer's own.\n\n- **Yes**: the writer holds this view.\n- **No**: the writer holds the opposite view.\n- **Not given**: the writer does not say what they think about this point.",
        "这类题问的是**作者怎么想**，而不是事实。先找到作者自己的立场：它常出现在 *In my view, I would argue, I disagree, but* 等词之后。作者转述的别人的看法（*Many people believe ..., It is often said ...*）不是作者自己的观点。\n\n- **Yes**：作者持这个观点。\n- **No**：作者持相反的观点。\n- **Not given**：作者没有说他对这一点怎么看。",
      ),
      labelGenerator(viewQuestion, ["Yes", "No", "Not given"], items(views, true)),
    ),
  ],
});
