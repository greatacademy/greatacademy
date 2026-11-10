// College writing: writing judged by a model: the critical summary, the research question, the annotated
// bibliography, the paraphrase, the literature review and the research paper; revising for clarity and writing
// about data; the email, the memo and the cover letter; the executive summary and the research proposal.

import { type CriterionSpec, type KnowledgePointDef, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { clarityBank, dataBank } from "./writing-clarity.ts";
import { discussionBank, introductionBank, literatureReviewBank, researchPaperBank } from "./writing-paper.ts";
import { executiveSummaryBank, researchProposalBank } from "./writing-proposals.ts";
import { annotatedBibliographyBank, criticalSummaryBank, paraphraseBank, researchQuestionBank } from "./writing-sources.ts";
import { coverLetterBank, emailBank, memoBank } from "./writing-work.ts";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const onePiece = (model: string) =>
  t(`One good response:\n\n> ${model.replaceAll("\n", "\n> ")}`, `一个好的回答：\n\n> ${model.replaceAll("\n", "\n> ")}`);

/** Piece describes one judged knowledge point. */
interface Piece {
  readonly point: string;
  readonly pointTitle: Text;
  readonly explanation: Text;
  readonly question: Text;
  readonly bank: readonly WritingItem[];
  readonly criteria: readonly string[];
  readonly minWords: number;
  readonly maxChars: number;
}

const piece = (spec: Piece): KnowledgePointDef =>
  point(
    spec.point,
    spec.pointTitle,
    spec.explanation,
    writingGenerator(spec.question, spec.bank, spec.criteria, { minWords: spec.minWords, maxChars: spec.maxChars }, onePiece),
  );

interface Judged extends Piece {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly { readonly topic: string; readonly weight: number }[];
  readonly xp: number;
}

const judged = (spec: Judged): TopicDef => ({
  id: spec.id,
  title: spec.title,
  summary: spec.summary,
  prerequisites: spec.prerequisites,
  encompasses: spec.encompasses,
  xp: spec.xp,
  strand: "writing",
  criteria: spec.criteria.map(criterion),
  knowledgePoints: [piece(spec)],
});

const paperCriteria = {
  introduction: ["col-paper-context", "col-paper-gap", "col-paper-thesis"],
  discussion: ["col-paper-interprets", "col-paper-compares", "col-paper-limits"],
  whole: ["col-paper-thesis", "col-paper-evidence", "col-paper-organization", "col-paper-references"],
} as const;

/** researchPaperTopic is the research paper, judged in three knowledge points: the introduction, the discussion and the whole short paper. */
const researchPaperTopic: TopicDef = {
  id: "writing-a-research-paper",
  title: t("Writing a Research Paper", "写研究论文"),
  summary: t(
    "A short research paper: an introduction that ends in a thesis, a discussion that interprets results, and the whole paper with its references.",
    "写一篇简短的研究论文：以论点收尾的引言、解释结果的讨论，以及附有参考文献的完整论文。",
  ),
  prerequisites: ["writing-a-literature-review", "citing-in-mla-and-apa", "writing-an-argumentative-essay"],
  encompasses: [
    { topic: "writing-a-literature-review", weight: 0.3 },
    { topic: "writing-an-argumentative-essay", weight: 0.3 },
    { topic: "citing-in-mla-and-apa", weight: 0.2 },
  ],
  xp: 45,
  strand: "writing",
  criteria: [...new Set([...paperCriteria.introduction, ...paperCriteria.discussion, ...paperCriteria.whole])].map(criterion),
  knowledgePoints: [
    piece({
      point: "the-introduction",
      pointTitle: t("The Introduction", "引言"),
      explanation: t(
        "The introduction of a research paper moves from the general to the particular, like a funnel.\n\n1. **Context**: why the topic matters, in a sentence or two.\n2. **Earlier work**: what researchers have found, with citations, briefly, since the literature review or the discussion can say more.\n3. **The gap**: what that work leaves open. *Yet no study has compared...*; *However, these findings come from a single...*\n4. **The question**: what this study asks, stated precisely.\n5. **The thesis**: your answer, as a claim you will defend. *I argue that...*\n\nThe gap is the hinge of the introduction: it shows that your question is worth asking because no one has fully answered it. Keep the thesis as strong as your evidence and no stronger; if your results have a limit, the thesis can say so.",
        "研究论文的引言像漏斗一样，从一般逐步收窄到具体。\n\n1. **背景**：用一两句话说明这个主题为什么重要。\n2. **已有研究**：研究者已经发现了什么，附上引用，要简短，因为文献综述或讨论部分还可以展开。\n3. **空白**：这些研究还留下了什么没有解决。*Yet no study has compared...*；*However, these findings come from a single...*\n4. **问题**：本研究要问什么，要表述精确。\n5. **论点**：你的回答，作为一个你要捍卫的主张。*I argue that...*\n\n空白是引言的枢纽：它表明你的问题值得研究，因为还没有人完整地回答过它。论点的强度要与证据相当，不能更强；如果你的结果有局限，论点里可以说明。",
      ),
      question: t("Write the introduction of a research paper.", "写一篇研究论文的引言。"),
      bank: introductionBank,
      criteria: paperCriteria.introduction,
      minWords: 100,
      maxChars: 2500,
    }),
    piece({
      point: "the-discussion",
      pointTitle: t("The Discussion", "讨论"),
      explanation: t(
        "The results section says what you found; the **discussion** says what it means. A good discussion does four things.\n\n- **Interpret**: state the main result in a sentence and say what it suggests, as an answer to your question.\n- **Compare**: relate it to earlier work. Does it confirm, extend or contradict what others found? Can it explain a puzzle in their results?\n- **Admit the limits**: name the features of your study that could explain the result another way: a small sample, a group that chose itself, a second change at the same time, a measure that may be inaccurate. Say how much each one weakens the conclusion.\n- **Look ahead**: say what study would test the result more strongly.\n\nUse hedges that match the evidence: *suggests*, *is consistent with*, *may*. A limitation stated honestly makes a reader trust the rest.",
        "结果部分说明你发现了什么；**讨论**部分说明它意味着什么。好的讨论要做四件事。\n\n- **解释**：用一句话陈述主要结果，并说明它作为对研究问题的回答说明了什么。\n- **比较**：把它与已有研究联系起来。它是证实、拓展还是反驳了别人的发现？它能否解释别人结果中的疑点？\n- **承认局限**：指出你的研究中可能以另一种方式解释结果的特点：样本小、参与者自愿选择、同一时间还有另一项变化、测量可能不准确。说明每一项在多大程度上削弱了结论。\n- **展望**：说明什么样的研究能更有力地检验这一结果。\n\n使用与证据相符的委婉语：*suggests、is consistent with、may*。坦诚地说明局限，读者才会信任其余部分。",
      ),
      question: t("Write the discussion section of a research paper.", "写一篇研究论文的讨论部分。"),
      bank: discussionBank,
      criteria: paperCriteria.discussion,
      minWords: 110,
      maxChars: 2500,
    }),
    piece({
      point: "the-whole-paper",
      pointTitle: t("The Whole Paper", "完整的论文"),
      explanation: t(
        "A short research paper puts the parts together under clear headings.\n\n- **A title** that names the topic and, if possible, the finding.\n- **Introduction**: context, earlier work, the gap, the question and the thesis.\n- **Method and Results**: who or what you studied and how, then what you found, with exact figures and no interpretation.\n- **Discussion**: what the results mean, how they fit earlier work, their limits and the next step.\n- **References**: every source cited in the text, in one style (here APA), in alphabetical order by author.\n\nEvery claim about earlier work needs a citation, and every citation in the text needs an entry in the references. The thesis in the introduction and the conclusion of the discussion should agree.",
        "一篇简短的研究论文用清楚的小标题把各部分组合起来。\n\n- **标题**：点明主题，如果可能，也点明发现。\n- **引言**：背景、已有研究、空白、问题和论点。\n- **方法与结果**：研究了谁或什么、怎样研究的，然后是发现了什么，给出确切数字，不加解释。\n- **讨论**：结果意味着什么、与已有研究如何对应、有哪些局限、下一步做什么。\n- **参考文献**：正文中引用的每一个来源，用同一种格式（这里用 APA），按作者姓氏字母顺序排列。\n\n每一个关于已有研究的说法都需要引用，正文中的每一处引用都要在参考文献中有对应条目。引言中的论点要与讨论的结论一致。",
      ),
      question: t("Write a short research paper.", "写一篇简短的研究论文。"),
      bank: researchPaperBank,
      criteria: paperCriteria.whole,
      minWords: 180,
      maxChars: 5000,
    }),
  ],
};

/** writingTopicsCollege lists the judged writing topics of the college writing course. */
export const writingTopicsCollege: readonly TopicDef[] = [
  judged({
    id: "writing-a-critical-summary",
    title: t("Writing a Critical Summary", "写评述性摘要"),
    summary: t(
      "An article's question, claim and evidence in a paragraph, then one strength and one limitation.",
      "用一段话写出文章的问题、主张和证据，再指出一个优点和一个局限。",
    ),
    prerequisites: ["writing-an-objective-summary", "reading-academic-arguments"],
    encompasses: [{ topic: "writing-an-objective-summary", weight: 0.4 }],
    xp: 25,
    criteria: ["col-critsum-claim", "col-critsum-support", "col-critsum-strength", "col-critsum-limitation"],
    point: "summarizing-and-judging-an-article",
    pointTitle: t("Summarizing and Judging an Article", "概括并评价一篇文章"),
    explanation: t(
      "A **critical summary** first reports an article fairly and then judges it.\n\nThe summary part names the authors and year and gives the article's **question**, its **claim**, and the **evidence** behind it, in your own words and in a few sentences. Keep it objective: report what the authors argue (*she argues that*, *they conclude that*) without yet agreeing or disagreeing.\n\nThe critical part names **one strength** and **one limitation**, each with a reason. Judge the reasoning, not the topic. Good strengths: a large sample, a fair comparison group, random assignment, two kinds of evidence that agree. Good limitations: a small or narrow sample, a second factor that could explain the result, a short period, a conclusion that goes further than the evidence. End by saying what the evidence does support.",
      "**评述性摘要**先公正地转述一篇文章，再对它作出评价。\n\n摘要部分写明作者和年份，用你自己的话、用几句话给出文章的**问题**、**主张**和支持主张的**证据**。要保持客观：转述作者的论证（*she argues that、they conclude that*），此时还不表示赞同或反对。\n\n评述部分指出**一个优点**和**一个局限**，各附理由。评价的是推理，而不是话题。好的优点如：样本大、对照组公平、随机分组、两种证据相互印证。好的局限如：样本小或范围窄、有另一个因素可以解释结果、时间短、结论超出了证据。最后说明证据究竟支持什么。",
    ),
    question: t("Write a critical summary of the article.", "为这篇文章写一篇评述性摘要。"),
    bank: criticalSummaryBank,
    minWords: 110,
    maxChars: 2200,
  }),
  judged({
    id: "forming-a-research-question",
    title: t("Forming a Research Question", "提出研究问题"),
    summary: t(
      "A question narrow enough to answer and open enough to argue, and why it is worth asking.",
      "提出一个窄到可以回答、开放到可以论证的问题，并说明它为什么值得研究。",
    ),
    prerequisites: ["reading-academic-arguments"],
    encompasses: [],
    xp: 15,
    criteria: ["col-question-focused", "col-question-open", "col-question-researchable", "col-question-significance"],
    point: "narrowing-a-topic-to-a-question",
    pointTitle: t("Narrowing a Topic to a Question", "把话题缩小为问题"),
    explanation: t(
      "A **topic** (*social media and teenagers*) is too large to research. A **research question** names what exactly you will find out, and it has four qualities.\n\n- **Focused**: it names a particular group, place, time or change. *Teenagers at my school*, *since 1950*, *after the wage rose*.\n- **Open**: its answer is not a simple fact or a yes that everyone already accepts; reasonable people could expect different answers. Ask *how*, *why*, *to what extent*, or *does X change Y*.\n- **Researchable**: you can name the evidence that would answer it, such as records, a survey, interviews or an experiment, and you could gather it.\n- **Significant**: someone would care about the answer and could act on it.\n\nAfter the question, explain in two or three sentences how it meets these tests.",
      "**话题**（*social media and teenagers*）太大，无法研究。**研究问题**要说明你究竟要弄清什么，它有四个特点。\n\n- **聚焦**：它点明特定的群体、地点、时间或变化。*Teenagers at my school、since 1950、after the wage rose*。\n- **开放**：答案不是一个简单的事实，也不是人人都已接受的“是”；理性的人可能预期不同的答案。可以问 *how、why、to what extent* 或 *does X change Y*。\n- **可研究**：你能说出回答它所需的证据，如记录、调查、访谈或实验，而且你能收集到。\n- **有意义**：有人会关心答案，并能据此采取行动。\n\n写出问题后，用两三句话说明它如何满足这些标准。",
    ),
    question: t("Write a focused research question from this topic.", "根据这个话题写一个聚焦的研究问题。"),
    bank: researchQuestionBank,
    minWords: 50,
    maxChars: 1500,
  }),
  judged({
    id: "writing-an-annotated-bibliography",
    title: t("Writing an Annotated Bibliography", "写注释书目"),
    summary: t(
      "Entries that give each source's reference, then summarize it, evaluate it and say how it will be used.",
      "写出每条书目：给出资料的参考文献格式，然后概括、评价它，并说明将如何使用它。",
    ),
    prerequisites: ["finding-scholarly-sources", "writing-a-critical-summary"],
    encompasses: [{ topic: "writing-a-critical-summary", weight: 0.3 }],
    xp: 25,
    criteria: ["col-annot-citation", "col-annot-summary", "col-annot-evaluation", "col-annot-use"],
    point: "annotating-a-source",
    pointTitle: t("Annotating a Source", "为资料写注释"),
    explanation: t(
      "An **annotated bibliography** lists your sources, each followed by a short paragraph called an **annotation**. It records what you have read so that you can plan and write the paper.\n\n1. **The reference**: the full entry in the required style (APA or MLA), with authors, year, title, and where it was published.\n2. **Summary**: in one or two sentences, what the source does and finds.\n3. **Evaluation**: how reliable and useful it is. Is it scholarly or popular? Is its evidence strong? What are its limits or its bias?\n4. **Use**: how the source will serve your paper: as main evidence, as background, as the opposing view, as a source of other sources.\n\nA popular or biased source can still be useful if you say clearly what it is good for.",
      "**注释书目**列出你的资料，每条之后附一小段文字，叫作**注释**。它记录你读过的东西，便于你规划和撰写论文。\n\n1. **参考文献条目**：按要求的格式（APA 或 MLA）写出完整条目，包括作者、年份、标题和出处。\n2. **概括**：用一两句话说明资料做了什么、发现了什么。\n3. **评价**：它有多可靠、多有用。它是学术资料还是大众资料？证据是否有力？有什么局限或偏向？\n4. **用途**：资料将怎样服务于你的论文：作为主要证据、作为背景、作为对立观点，或作为寻找其他资料的线索。\n\n大众资料或有偏向的资料也可能有用，只要你清楚说明它适合用来做什么。",
    ),
    question: t("Write two entries of an annotated bibliography.", "写两条注释书目。"),
    bank: annotatedBibliographyBank,
    minWords: 140,
    maxChars: 3000,
  }),
  judged({
    id: "writing-a-paraphrase",
    title: t("Writing a Paraphrase", "写转述"),
    summary: t(
      "A passage restated faithfully in new words and a new structure, with its citation.",
      "用新的词语和新的结构忠实地重述一段文字，并注明出处。",
    ),
    prerequisites: ["quoting-and-paraphrasing"],
    encompasses: [{ topic: "quoting-and-paraphrasing", weight: 0.3 }],
    xp: 15,
    criteria: ["col-para-faithful", "col-para-complete", "col-para-own-words", "col-para-cited"],
    point: "restating-a-passage",
    pointTitle: t("Restating a Passage", "重述一段文字"),
    explanation: t(
      "A **paraphrase** restates a source's idea in your own words. It is about as long as the original, unlike a summary, and it must pass four tests.\n\n- **Faithful**: it says what the source says, no more and no less certain. If the source says *may*, so do you.\n- **Complete**: it keeps every part of the idea, including any condition or exception (*although the group had more education*).\n- **In your own words and structure**: changing a few words while keeping the sentence's shape is still plagiarism. Start from a different point, split or join sentences, and turn nouns into verbs or the reverse. Technical terms and names may stay.\n- **Cited**: a paraphrase is still someone else's idea, so it needs a citation, with a page number where the style asks for one.\n\nA good method: read the passage, look away, write the idea from memory, then check it against the original.",
      "**转述**是用你自己的话重述来源中的观点。它与原文长度相当，这一点与概括不同，而且必须通过四项检验。\n\n- **忠实**：它说的正是来源所说的，不多也不少，确定程度也一致。来源说 *may*，你也要这样说。\n- **完整**：它保留观点的每一部分，包括任何条件或例外（*although the group had more education*）。\n- **用自己的词语和结构**：只换几个词而保留句子的形状，仍然是抄袭。可以从不同的地方说起，拆分或合并句子，把名词变成动词或反过来。专业术语和名称可以保留。\n- **注明出处**：转述的仍是别人的观点，所以需要引用；格式要求时，还要注明页码。\n\n一个好方法：读完这段文字，移开视线，凭记忆写出观点，再对照原文检查。",
    ),
    question: t("Paraphrase the passage.", "转述这段文字。"),
    bank: paraphraseBank,
    minWords: 22,
    maxChars: 1200,
  }),
  judged({
    id: "writing-a-literature-review",
    title: t("Writing a Literature Review", "写文献综述"),
    summary: t(
      "A paragraph that relates several sources to one another and ends with the gap they leave.",
      "写一段文字，把几份资料相互联系起来，并以它们留下的研究空白收尾。",
    ),
    prerequisites: ["writing-an-annotated-bibliography", "synthesizing-sources"],
    encompasses: [
      { topic: "synthesizing-sources", weight: 0.4 },
      { topic: "writing-an-annotated-bibliography", weight: 0.2 },
    ],
    xp: 30,
    criteria: ["col-litrev-synthesis", "col-litrev-relations", "col-litrev-gap", "col-litrev-citations"],
    point: "relating-sources-to-one-another",
    pointTitle: t("Relating Sources to One Another", "把资料相互联系起来"),
    explanation: t(
      "A **literature review** is not a list of summaries, one source after another. It is organized around **ideas**, and it shows how the sources relate.\n\n- Open with a sentence that states what the research, taken together, shows or debates.\n- Bring the sources in where they support, extend, explain or contradict each other: *Silva's survey suggests why...*; *Park, however, found...*; *These findings are not necessarily in conflict, since...*\n- Weigh them: note which evidence is stronger and which is thin.\n- End with the **gap**: what none of the sources has shown, which your own study will address.\n\nCite every source by author and year each time you use it. Use verbs that show your view of the source (*shows*, *suggests*, *claims*, *cautions*), since the review is also your judgment of the field.",
      "**文献综述**不是一串摘要、一份资料接一份资料地罗列。它围绕**观点**组织，展示资料之间的关系。\n\n- 开头用一句话说明这些研究合起来表明了什么或在争论什么。\n- 在资料相互支持、拓展、解释或矛盾的地方引入它们：*Silva's survey suggests why...*；*Park, however, found...*；*These findings are not necessarily in conflict, since...*\n- 权衡它们：指出哪些证据更有力，哪些证据薄弱。\n- 以**空白**收尾：没有一份资料证明过的东西，正是你自己的研究要解决的。\n\n每次使用资料都要注明作者和年份。用能表明你对资料看法的动词（*shows、suggests、claims、cautions*），因为综述也是你对这一领域的判断。",
    ),
    question: t("Write a literature review paragraph.", "写一段文献综述。"),
    bank: literatureReviewBank,
    minWords: 120,
    maxChars: 3000,
  }),
  researchPaperTopic,
  judged({
    id: "revising-for-clarity",
    title: t("Revising for Clarity", "为求清晰而修改"),
    summary: t(
      "A dense paragraph rewritten with its characters as subjects and its actions as verbs, without losing its meaning.",
      "改写一段晦涩的文字，让人物作主语、动作作谓语，同时不丢失原意。",
    ),
    prerequisites: ["clear-sentences-characters-and-actions", "revising-a-draft"],
    encompasses: [
      { topic: "clear-sentences-characters-and-actions", weight: 0.3 },
      { topic: "cutting-wordiness", weight: 0.2 },
    ],
    xp: 15,
    criteria: ["col-clarity-meaning", "col-clarity-actors", "col-clarity-concise", "col-clarity-readable"],
    point: "rewriting-a-dense-paragraph",
    pointTitle: t("Rewriting a Dense Paragraph", "改写晦涩的段落"),
    explanation: t(
      "Dense prose hides **who does what**. To revise it:\n\n1. **Find the characters**: the people or groups the paragraph is about (*the school*, *the principal*, *teachers and parents*).\n2. **Find the actions**, often buried in nouns: *implementation* (implement), *determination* (decide), *participation* (take part).\n3. **Rewrite** each sentence with a character as the subject and its action as the verb: *The implementation of the policy by the school* becomes *The school put the policy into effect*.\n4. **Cut** empty phrases: *there was*, *the existence of*, *on the part of*, *the process of*.\n\nThen check that **nothing was lost**: every fact, condition and reason in the original must still be there. Clarity that changes the meaning is not an improvement.",
      "晦涩的文字掩盖了**谁做了什么**。修改的方法是：\n\n1. **找出人物**：段落所讲的人或群体（*the school、the principal、teachers and parents*）。\n2. **找出动作**，它们常常埋在名词里：*implementation*（implement）、*determination*（decide）、*participation*（take part）。\n3. **改写**每个句子，让人物作主语、动作作谓语：*The implementation of the policy by the school* 改为 *The school put the policy into effect*。\n4. **删去**空洞的短语：*there was、the existence of、on the part of、the process of*。\n\n然后检查**有没有丢失内容**：原文中的每一个事实、条件和理由都必须还在。改变了原意的清晰并不是改进。",
    ),
    question: t("Revise the paragraph for clarity.", "修改这段文字，使它清晰。"),
    bank: clarityBank,
    minWords: 20,
    maxChars: 1200,
  }),
  judged({
    id: "writing-about-data",
    title: t("Writing About Data", "描述数据"),
    summary: t(
      "A paragraph that reports a table or chart accurately and draws only the conclusion it supports.",
      "写一段文字，准确报告表格或图表的内容，只得出它所支持的结论。",
    ),
    prerequisites: ["reading-charts-and-statistics", "numbers-in-writing", "writing-an-explanatory-essay"],
    encompasses: [
      { topic: "numbers-in-writing", weight: 0.2 },
      { topic: "reading-charts-and-statistics", weight: 0.2 },
    ],
    xp: 20,
    criteria: ["col-data-context", "col-data-accurate", "col-data-pattern", "col-data-supported"],
    point: "reporting-a-table-or-chart",
    pointTitle: t("Reporting a Table or Chart", "报告表格或图表"),
    explanation: t(
      "A paragraph about data guides the reader through the numbers to what they mean.\n\n1. **Context**: say what the data are and where they come from (*The survey of 2,400 students shows...*).\n2. **The main pattern**: the overall trend or comparison, with exact figures at its ends (*from 7.6 hours in grade 9 to 6.8 hours in grade 12*). Do not list every number; choose the ones that show the pattern.\n3. **A detail or exception**: the point that breaks or sharpens the pattern (*except in 2020*; *the fall is steepest early*).\n4. **The conclusion the data support**, and its limit. Compare rates, not totals, when groups differ in size. A comparison of different groups shows a link, not a cause.\n\nState figures with the right units, and write numbers as the style of your field requires.",
      "描述数据的段落要引导读者透过数字看到其含义。\n\n1. **背景**：说明数据是什么、来自哪里（*The survey of 2,400 students shows...*）。\n2. **主要规律**：总体趋势或比较，给出两端的确切数字（*from 7.6 hours in grade 9 to 6.8 hours in grade 12*）。不要列出每个数字，只选能显示规律的那些。\n3. **细节或例外**：打破或凸显规律的那一点（*except in 2020*；*the fall is steepest early*）。\n4. **数据所支持的结论**及其局限。群体规模不同时，要比较比率而不是总数。比较不同群体只能说明关联，不能说明因果。\n\n数字要带正确的单位，并按你所在领域的规范书写数字。",
    ),
    question: t("Write a paragraph about the data.", "写一段描述这些数据的文字。"),
    bank: dataBank,
    minWords: 80,
    maxChars: 2000,
  }),
  judged({
    id: "writing-a-professional-email",
    title: t("Writing a Professional Email", "写工作邮件"),
    summary: t(
      "An email with a clear subject line, its purpose at once, a suitable tone and a clear next step.",
      "写一封邮件：主题行清楚，开门见山说明目的，语气得体，下一步明确。",
    ),
    prerequisites: ["tone-and-register-at-work"],
    encompasses: [{ topic: "tone-and-register-at-work", weight: 0.3 }],
    xp: 15,
    criteria: ["col-email-subject", "col-email-purpose", "col-email-tone", "col-email-action"],
    point: "an-email-that-gets-an-answer",
    pointTitle: t("An Email That Gets an Answer", "能得到回复的邮件"),
    explanation: t(
      "A busy reader decides from the first lines whether an email needs attention, so a professional email puts everything important up front.\n\n- **Subject line**: specific enough to tell the reader what the email is about and what it asks. *Request to move the sales report deadline to Tuesday*, not *Report*.\n- **Purpose at once**: the first sentence after the greeting says why you are writing.\n- **Brief reasons and details**: only what the reader needs to decide or act.\n- **Tone**: polite and direct. Requests use *Could you* or *Would it be possible*; refusals are clear and give a short reason and, where possible, an alternative. Match the formality to the reader: *Dear Ms. Carter* for a manager or client, *Hi Priya* for a colleague you know.\n- **A clear next step**: what you want the reader to do, and by when. Make it easy to answer.",
      "忙碌的读者从最初几行就决定一封邮件是否需要处理，所以工作邮件要把一切重要内容放在前面。\n\n- **主题行**：要具体到让读者知道邮件关于什么、请求什么。写 *Request to move the sales report deadline to Tuesday*，而不是 *Report*。\n- **开门见山说明目的**：称呼之后的第一句就说明你为什么写信。\n- **简要的理由和细节**：只写读者作决定或采取行动所需的内容。\n- **语气**：礼貌而直接。请求用 *Could you* 或 *Would it be possible*；拒绝要明确，给出简短理由，并尽可能提供替代方案。正式程度要与读者相称：对经理或客户用 *Dear Ms. Carter*，对熟悉的同事用 *Hi Priya*。\n- **明确的下一步**：你希望读者做什么、在什么时候之前做。让对方容易回复。",
    ),
    question: t("Write the email.", "写这封邮件。"),
    bank: emailBank,
    minWords: 60,
    maxChars: 1600,
  }),
  judged({
    id: "writing-a-memo",
    title: t("Writing a Memo", "写备忘录"),
    summary: t(
      "A memo with its heading, its purpose in the first sentence, organized content and the action it asks for.",
      "写一份备忘录：有标准抬头，第一句说明目的，内容有条理，并提出所要求的行动。",
    ),
    prerequisites: ["writing-a-professional-email"],
    encompasses: [{ topic: "writing-a-professional-email", weight: 0.3 }],
    xp: 20,
    criteria: ["col-memo-format", "col-memo-purpose", "col-memo-organization", "col-memo-action"],
    point: "a-memo-that-informs-and-directs",
    pointTitle: t("A Memo That Informs and Directs", "传达信息并指导行动的备忘录"),
    explanation: t(
      "A **memo** is a short document sent within an organization to announce, report or recommend. It has a fixed form.\n\n- **The heading**: *To*, *From* (with your role), *Date* and *Subject*, each on its own line. The subject line names the topic and the point: *New sign-in rule for visitors from 1 March*.\n- **The purpose in the first sentence**: the change, the finding or the recommendation itself, not an introduction to it.\n- **The body**: the reason, the details and the effect on the reader, in short paragraphs. Use a bulleted or numbered list for actions, steps or figures, and keep its items parallel.\n- **The action**: what readers must do, by when, and whom to ask.\n\nA memo has no greeting or closing like a letter; its heading does that work.",
      "**备忘录**是在机构内部发送的简短文件，用来通知、报告或建议。它有固定的格式。\n\n- **抬头**：*To*、*From*（附上你的职位）、*Date* 和 *Subject*，各占一行。主题行要点明话题和要点：*New sign-in rule for visitors from 1 March*。\n- **第一句说明目的**：直接写出变化、发现或建议本身，而不是对它的铺垫。\n- **正文**：用简短的段落写出理由、细节以及对读者的影响。行动、步骤或数字用项目符号或编号列出，各项要保持平行结构。\n- **行动**：读者必须做什么、在什么时候之前做、有问题找谁。\n\n备忘录不像书信那样有称呼和结束语，抬头已经承担了这项功能。",
    ),
    question: t("Write the memo.", "写这份备忘录。"),
    bank: memoBank,
    minWords: 90,
    maxChars: 2200,
  }),
  judged({
    id: "writing-a-cover-letter",
    title: t("Writing a Cover Letter", "写求职信"),
    summary: t(
      "A letter that names the position, matches experience to its requirements with examples, and asks for an interview.",
      "写一封信：点明所申请的职位，用实例说明经历与职位要求相符，并请求面试。",
    ),
    prerequisites: ["writing-a-professional-email", "reading-workplace-documents"],
    encompasses: [{ topic: "writing-a-professional-email", weight: 0.3 }],
    xp: 25,
    criteria: ["col-cover-position", "col-cover-match", "col-cover-tone", "col-cover-close"],
    point: "matching-yourself-to-a-job",
    pointTitle: t("Matching Yourself to a Job", "让自己与职位相匹配"),
    explanation: t(
      "A **cover letter** argues that you fit a particular job. Its evidence is your experience, and its structure follows the posting.\n\n- **Opening**: name the position and, in a sentence, why you want it or what you bring.\n- **Body**: take two of the posting's requirements, in its own words where you can (*Your posting asks for experience helping the public*), and answer each with a **specific example**: what you did, where, and with what result, ideally with a number (*organized twelve volunteers*, *followers grew from 300 to 2,000*). Claims such as *I am hard-working* persuade no one without evidence.\n- **Close**: thank the reader and ask for an interview or a conversation.\n\nKeep the tone confident and polite, neither boastful nor apologetic, and keep the letter to one page.",
      "**求职信**论证你适合某个特定职位。它的证据是你的经历，它的结构依照招聘启事。\n\n- **开头**：点明职位，并用一句话说明你为什么想要它或你能带来什么。\n- **正文**：选取启事中的两项要求，尽可能使用它自己的措辞（*Your posting asks for experience helping the public*），并用**具体的例子**逐一回应：你做了什么、在哪里做的、结果如何，最好带有数字（*organized twelve volunteers*、*followers grew from 300 to 2,000*）。像 *I am hard-working* 这样没有证据的说法说服不了任何人。\n- **结尾**：感谢读者，并请求面试或交谈的机会。\n\n语气要自信而礼貌，既不夸耀也不自贬，篇幅控制在一页以内。",
    ),
    question: t("Write the cover letter.", "写这封求职信。"),
    bank: coverLetterBank,
    minWords: 150,
    maxChars: 3000,
  }),
  judged({
    id: "writing-an-executive-summary",
    title: t("Writing an Executive Summary", "写执行摘要"),
    summary: t(
      "A summary of a report that gives its purpose, findings and recommendation, so a reader can decide without the rest.",
      "为报告写摘要：给出目的、发现和建议，让读者不读全文也能作出决定。",
    ),
    prerequisites: ["writing-a-critical-summary", "writing-a-memo"],
    encompasses: [{ topic: "writing-a-critical-summary", weight: 0.3 }],
    xp: 25,
    criteria: ["col-exec-purpose", "col-exec-findings", "col-exec-recommendation", "col-exec-standalone"],
    point: "a-summary-for-a-decision",
    pointTitle: t("A Summary for a Decision", "为决策而写的摘要"),
    explanation: t(
      "An **executive summary** opens a report for readers who may read nothing else, usually the people who must decide. It must stand on its own.\n\n- **Purpose and recommendation first**: the question the report answers and what it recommends, in the first paragraph.\n- **Key findings**: the few facts that support the recommendation, with the figures that matter. Leave out the method's details and anything that does not bear on the decision.\n- **Costs and risks**: what the recommendation costs and any concern a reader will raise, with its answer.\n- **The action**: exactly what the reader is asked to approve or do, and when.\n\nWrite it last, after the report, but place it first. Use no terms or abbreviations that the report defines later.",
      "**执行摘要**放在报告开头，写给可能只读这一部分的读者，通常是必须作决定的人。它必须能够独立成篇。\n\n- **先写目的和建议**：在第一段写出报告要回答的问题和它的建议。\n- **主要发现**：支持建议的少数几个事实，附上关键数字。省略方法的细节和与决策无关的内容。\n- **成本和风险**：建议需要多少成本，以及读者会提出的任何顾虑和对它的回应。\n- **行动**：明确说明请读者批准或做什么、在什么时候。\n\n摘要最后写，在完成报告之后，但要放在最前面。不要使用报告后文才定义的术语或缩写。",
    ),
    question: t("Write the executive summary.", "写这份执行摘要。"),
    bank: executiveSummaryBank,
    minWords: 110,
    maxChars: 2200,
  }),
  judged({
    id: "writing-a-research-proposal",
    title: t("Writing a Research Proposal", "写研究计划书"),
    summary: t(
      "A short proposal: the question, why it matters, how it will be answered, and a feasible schedule and budget.",
      "写一份简短的计划书：研究问题、它为什么重要、怎样回答它，以及可行的时间表和预算。",
    ),
    prerequisites: ["forming-a-research-question", "writing-an-executive-summary"],
    encompasses: [
      { topic: "forming-a-research-question", weight: 0.4 },
      { topic: "writing-an-executive-summary", weight: 0.2 },
    ],
    xp: 30,
    criteria: ["col-proposal-question", "col-proposal-rationale", "col-proposal-method", "col-proposal-feasible"],
    point: "planning-a-study",
    pointTitle: t("Planning a Study", "规划一项研究"),
    explanation: t(
      "A **research proposal** asks a teacher, a committee or a funder to approve a study before it begins. It persuades by being specific.\n\n- **Research question**: focused, open and researchable.\n- **Rationale**: why the question matters, what earlier work leaves open, and who could use the answer.\n- **Method**: who or what you will study, what you will measure or collect, and how you will compare or analyze it. Name the steps that guard against the obvious objection (random groups, a comparison period, a second kind of evidence).\n- **Schedule**: the stages of the work with their weeks or months, ending with the writing.\n- **Budget**: what the money is for, item by item, or why none is needed.\n\nUse headings, so that a reviewer can find each part, and show that the plan fits the time and resources available.",
      "**研究计划书**请老师、委员会或资助方在研究开始之前批准它。它靠具体来说服人。\n\n- **研究问题**：聚焦、开放、可研究。\n- **理由**：这个问题为什么重要，已有研究留下了什么空白，谁能用上答案。\n- **方法**：你将研究谁或什么，测量或收集什么，怎样比较或分析。写明用来应对明显质疑的步骤（随机分组、对照时期、第二种证据）。\n- **时间表**：工作的各个阶段及其所需的周数或月数，以撰写收尾。\n- **预算**：逐项说明资金的用途，或者说明为什么不需要资金。\n\n使用小标题，让评审人能找到每一部分，并表明计划与现有的时间和资源相符。",
    ),
    question: t("Write the research proposal.", "写这份研究计划书。"),
    bank: researchProposalBank,
    minWords: 130,
    maxChars: 3000,
  }),
];
