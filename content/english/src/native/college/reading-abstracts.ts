// College writing: the moves of a research abstract. Each abstract here has five sentences, one for each move: the
// background, the gap or aim, the method, the result and the implication. A learner first names the move a sentence
// makes, then tells which move an abstract leaves out.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

/** moves are the five moves of an abstract, in their usual order. */
const moves = ["background", "gap or aim", "method", "result", "implication"] as const;

/** Move is one of the five moves. */
type Move = (typeof moves)[number];

const moveZh: Readonly<Record<Move, string>> = {
  background: "背景",
  "gap or aim": "研究空白或目的",
  method: "方法",
  result: "结果",
  implication: "意义",
};

const moveWhat: Readonly<Record<Move, readonly [string, string]>> = {
  background: ["it states what is already known or why the field matters", "它陈述已知的情况或这一领域为何重要"],
  "gap or aim": ["it names what is not yet known or what this study sets out to do", "它指出尚未知道的问题，或本研究要做什么"],
  method: ["it says how the study was done: who or what was studied, and how", "它说明研究是怎样做的：研究了谁或什么、用什么方法"],
  result: ["it reports what the study found, often with figures", "它报告研究发现了什么，常常带有数据"],
  implication: ["it says what the finding means or what should follow from it", "它说明发现意味着什么，或接下来应当怎样做"],
};

/** abstracts are original abstracts of five sentences, in the order of the moves. */
const abstracts: readonly (readonly [string, string, string, string, string])[] = [
  [
    "Urban heat islands raise summer temperatures in large cities by several degrees compared with the surrounding countryside.",
    "Although green roofs are widely promoted as a remedy, their effect at the scale of a whole neighborhood has rarely been measured.",
    "We installed temperature sensors on 120 buildings in two districts of a mid-sized city, 40 of which had green roofs, and recorded air temperatures over three summers.",
    "Streets in the district with the most green roofs were on average 1.4 °C cooler at midday than comparable streets in the other district.",
    "These findings suggest that city planners could reduce extreme heat by encouraging green roofs across whole districts rather than on single buildings.",
  ],
  [
    "Many universities now record their lectures and make them available online.",
    "It remains unclear, however, whether students who rely on recordings learn as much as those who attend in person.",
    "This study compared the final examination scores of 640 first-year students in an introductory biology course, grouped by how often they attended lectures and how often they watched recordings.",
    "Students who attended regularly scored on average eight points higher, even after prior grades were taken into account, while those who watched recordings instead of attending scored lowest.",
    "Instructors may therefore wish to present recordings as a supplement to attendance rather than as a substitute for it.",
  ],
  [
    "Honeybee colonies in Europe and North America have declined sharply over the past two decades.",
    "While pesticides are often blamed, the combined effect of pesticides and poor nutrition has received little attention.",
    "We raised 48 small colonies under controlled conditions, giving half a varied diet of pollen and half a single type, and exposed some of each group to a low dose of a common pesticide.",
    "Colonies exposed to the pesticide lost 35 per cent of their workers when fed a single pollen type, but only 12 per cent when fed a varied diet.",
    "Protecting a variety of flowering plants near farmland may help bees withstand the pesticides they cannot avoid.",
  ],
  [
    "Remote work expanded rapidly after 2020 and has remained common in many professional occupations.",
    "The aim of this study was to examine how remote work affects the informal exchange of knowledge between junior and senior employees.",
    "We conducted semi-structured interviews with 36 employees at four software companies, half working mainly from home and half mainly in the office.",
    "Junior employees working from home reported asking colleagues for help far less often, and several described feeling that their questions would interrupt others.",
    "Companies that rely on remote work may need to create deliberate occasions for junior staff to learn from experienced colleagues.",
  ],
  [
    "Plastic waste in the ocean breaks down into microplastics, fragments smaller than five millimetres.",
    "Little is known about how quickly these fragments reach the deep sea floor.",
    "Sediment samples were collected at 30 sites at depths from 200 to 4,000 metres along a single ocean current and analysed for microplastic particles.",
    "Concentrations of microplastics at the deepest sites were comparable to those near the coast, and particles younger than ten years were found at every site.",
    "The deep sea floor may be a major and fast-growing store of plastic pollution, which future estimates of ocean plastic should take into account.",
  ],
  [
    "Reading aloud to young children is widely recommended as a way to support early language development.",
    "This study asked whether the effect of shared reading depends on how much adults talk about the story, not only on how often they read.",
    "Over six months, 90 parents of three-year-olds were randomly assigned either to read as usual or to ask open questions about each story, and the children's vocabulary was tested before and after.",
    "Children whose parents asked open questions gained on average 40 per cent more new words than those whose parents read as usual.",
    "Programmes that promote reading at home might achieve more by teaching parents to talk about stories than by simply encouraging them to read more often.",
  ],
  [
    "Electric scooters for hire have spread quickly through cities since 2018.",
    "Their effect on car use has been debated, but few studies have tracked the journeys that scooters actually replace.",
    "We surveyed 2,300 riders in three cities immediately after their trips, asking how they would otherwise have made the journey.",
    "Only 9 per cent of trips replaced a car or taxi journey, while over 60 per cent replaced walking or public transport.",
    "Cities hoping that hired scooters will reduce traffic should not count on them alone and may need to combine them with other measures.",
  ],
];

const sentenceItems: readonly ChoiceItem[] = abstracts.flatMap((abstract) =>
  abstract.map((_, i): ChoiceItem => {
    const right = moves[i] as Move;
    const shown = abstract.map((s, j) => (j === i ? `**${s}**` : s)).join(" ");
    const wrong = moves.filter((m) => m !== right).slice(0, 3);
    const extra = moves.filter((m) => m !== right)[3];
    // Rotate the left-out move so that each wrong move is offered about as often.
    return [shown, right, i % 2 === 0 ? wrong : [...wrong.slice(1), extra as Move]];
  }),
);

const missingItems: readonly ChoiceItem[] = abstracts.flatMap((abstract, a) =>
  abstract.map((_, i): ChoiceItem => {
    const right = moves[i] as Move;
    const others = moves.filter((m) => m !== right);
    const leaveOut = others[a % others.length] as Move;
    return [abstract.filter((_, j) => j !== i).join(" "), right, others.filter((m) => m !== leaveOut)];
  }),
);

const explainMove = (right: string) => {
  const move = right as Move;
  const [en, zh] = moveWhat[move];
  return t(`**${right}**: ${en}.`, `**${right}**（${moveZh[move]}）：${zh}。`);
};

/** abstractMoves is the college topic of the moves of a research abstract. */
export const abstractMoves: TopicDef = {
  id: "the-moves-of-an-abstract",
  title: t("The Moves of an Abstract", "摘要的语步"),
  summary: t(
    "The five moves of a research abstract: background, gap or aim, method, result and implication.",
    "研究摘要的五个语步：背景、研究空白或目的、方法、结果和意义。",
  ),
  prerequisites: ["reading-a-research-paper"],
  encompasses: [{ topic: "reading-a-research-paper", weight: 0.2 }],
  xp: 14,
  strand: "reading",
  knowledgePoints: [
    point(
      "naming-the-move",
      t("Naming the Move of a Sentence", "说出句子的语步"),
      t(
        "An abstract tells the whole study in a few sentences, and each sentence makes one **move**. The **background** says what is known or why it matters. The **gap or aim** says what is not known or what the study sets out to do; it often begins with *however*, *little is known*, *this study asks* or *the aim was*. The **method** says how: the people or things studied, how many, and what was done, usually in the past tense. The **result** reports what was found, often with figures. The **implication** says what it means, usually with *may*, *suggest* or *should*.\n\nTo name a move, ask what the sentence does, not what it is about: a sentence full of figures can be a method (*we surveyed 2,300 riders*) or a result (*only 9 per cent of trips*).",
        "摘要用几句话讲完整个研究，每句话完成一个**语步**。**背景**说明已知的情况或其重要性。**研究空白或目的**说明尚未知道什么，或本研究要做什么；常以 *however*、*little is known*、*this study asks*、*the aim was* 开头。**方法**说明怎样做：研究对象、数量和做法，通常用过去时。**结果**报告发现了什么，常带数据。**意义**说明发现意味着什么，常用 *may*、*suggest*、*should*。\n\n判断语步，要问句子在做什么，而不是它在讲什么：满是数字的句子可能是方法（*we surveyed 2,300 riders*），也可能是结果（*only 9 per cent of trips*）。",
      ),
      choiceGenerator(t("Which move does the sentence in bold make?", "加粗的句子属于哪个语步？"), sentenceItems, explainMove),
    ),
    point(
      "finding-the-missing-move",
      t("Finding the Missing Move", "找出缺少的语步"),
      t(
        "A complete abstract makes all five moves in order: background, gap or aim, method, result, implication. When one is missing, the abstract jumps: from a known problem straight to *we interviewed 36 employees* without saying what the study wanted to know, or from the method straight to what companies should do without saying what was found. Read the abstract move by move and find the place where a step of the story is skipped.",
        "完整的摘要按顺序包含五个语步：背景、研究空白或目的、方法、结果、意义。缺了一个，摘要就会跳跃：从已知的问题直接跳到 *we interviewed 36 employees*，却没说研究想知道什么；或者从方法直接跳到公司应该怎么做，却没说发现了什么。逐个语步地读摘要，找出跳过了哪一步。",
      ),
      choiceGenerator(t("Which move is missing from this abstract?", "这篇摘要缺少哪个语步？"), missingItems, explainMove),
    ),
  ],
};
