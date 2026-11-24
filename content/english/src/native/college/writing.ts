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

const onePiece = (check?: Text) => (model: string) =>
  t(
    `One good response:\n\n> ${model.replaceAll("\n", "\n> ")}${check ? `\n\n**Check.** ${check.en}` : ""}`,
    `一个好的回答：\n\n> ${model.replaceAll("\n", "\n> ")}${check ? `\n\n**检验。** ${check["zh-CN"]}` : ""}`,
  );

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
  readonly check?: Text;
}

const piece = (spec: Piece): KnowledgePointDef =>
  point(
    spec.point,
    spec.pointTitle,
    spec.explanation,
    writingGenerator(spec.question, spec.bank, spec.criteria, { minWords: spec.minWords, maxChars: spec.maxChars }, onePiece(spec.check)),
  );

interface Judged extends Piece {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro?: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly { readonly topic: string; readonly weight: number }[];
  readonly xp: number;
}

const judged = (spec: Judged): TopicDef => ({
  id: spec.id,
  title: spec.title,
  summary: spec.summary,
  ...(spec.intro ? { intro: spec.intro } : {}),
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
  intro: t(
    "A short research paper moves like a conversation with the field: its introduction narrows from context to a gap and a thesis, its method and results lay out the evidence, and its discussion explains what the findings mean and where they stop.",
    "一篇简短的研究论文就像与学术界的对话：引言从背景收窄到研究空白与论点，方法与结果呈现证据，讨论部分则解释发现的意义与边界。",
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
        "The introduction of a research paper moves from the general to the particular, like a funnel.\n\n1. **Context**: why the topic matters, in a sentence or two.\n2. **Earlier work**: what researchers have found, with citations, briefly, since the literature review or the discussion can say more.\n3. **The gap**: what that work leaves open. *Yet no study has compared...*; *However, these findings come from a single...*\n4. **The question**: what this study asks, stated precisely.\n5. **The thesis**: your answer, as a claim you will defend. *I argue that...*\n\nThe gap is the hinge of the introduction: it shows that your question is worth asking because no one has fully answered it.\n\n> **Watch out.** Never skip the **gap** between earlier work and your thesis, and keep your thesis no stronger than the evidence you actually have.",
        "研究论文的引言像漏斗一样，从一般逐步收窄到具体。\n\n1. **背景**：用一两句话说明这个主题为什么重要。\n2. **已有研究**：研究者已经发现了什么，附上引用，要简短，因为文献综述或讨论部分还可以展开。\n3. **空白**：这些研究还留下了什么没有解决。*Yet no study has compared...*；*However, these findings come from a single...*\n4. **问题**：本研究要问什么，要表述精确。\n5. **论点**：你的回答，作为一个你要捍卫的主张。*I argue that...*\n\n空白是引言的枢纽：它表明你的问题值得研究，因为还没有人完整地回答过它。\n\n> **注意。** 千万别跳过已有研究与你论点之间的**研究空白**，论点的力度也不要超出你实际掌握的证据。",
      ),
      question: t("Write the introduction of a research paper.", "写一篇研究论文的引言。"),
      bank: introductionBank,
      criteria: paperCriteria.introduction,
      minWords: 100,
      maxChars: 2500,
      check: t(
        "Trace the funnel in your draft: does it move cleanly from context → earlier work with citations → the gap → the question → a defensible thesis?",
        "按漏斗顺序检查初稿：是否依次走完了“背景 → 带引用的已有研究 → 研究空白 → 研究问题 → 可论证的论点”？",
      ),
    }),
    piece({
      point: "the-discussion",
      pointTitle: t("The Discussion", "讨论"),
      explanation: t(
        "The results section says what you found; the **discussion** says what it means. A good discussion does four things.\n\n- **Interpret**: state the main result in a sentence and say what it suggests, as an answer to your question.\n- **Compare**: relate it to earlier work. Does it confirm, extend or contradict what others found? Can it explain a puzzle in their results?\n- **Admit the limits**: name the features of your study that could explain the result another way: a small sample, a group that chose itself, a second change at the same time, a measure that may be inaccurate. Say how much each one weakens the conclusion.\n- **Look ahead**: say what study would test the result more strongly.\n\nUse hedges that match the evidence: *suggests*, *is consistent with*, *may*.\n\n> **Watch out.** Do not merely repeat the numbers from the results section, and do not hide limitations—naming a study's limits honestly makes the conclusion more credible.",
        "结果部分说明你发现了什么；**讨论**部分说明它意味着什么。好的讨论要做四件事。\n\n- **解释**：用一句话陈述主要结果，并说明它作为对研究问题的回答说明了什么。\n- **比较**：把它与已有研究联系起来。它是证实、拓展还是反驳了别人的发现？它能否解释别人结果中的疑点？\n- **承认局限**：指出你的研究中可能以另一种方式解释结果的特点：样本小、参与者自愿选择、同一时间还有另一项变化、测量可能不准确。说明每一项在多大程度上削弱了结论。\n- **展望**：说明什么样的研究能更有力地检验这一结果。\n\n使用与证据相符的委婉语：*suggests、is consistent with、may*。\n\n> **注意。** 不要只把结果部分的数字再抄一遍，也不要回避局限——坦诚指出研究边界反而会增强结论的可信度。",
      ),
      question: t("Write the discussion section of a research paper.", "写一篇研究论文的讨论部分。"),
      bank: discussionBank,
      criteria: paperCriteria.discussion,
      minWords: 110,
      maxChars: 2500,
      check: t(
        "Verify all four moves in your discussion: an interpretation of the main finding, a comparison with earlier work, at least one concrete limitation, and a hedged tone (*suggests*, *may*).",
        "核对讨论段的四步是否齐全：解释主要发现、与已有研究对比、指出至少一项具体局限，并使用克制的措辞（*suggests*、*may*）。",
      ),
    }),
    piece({
      point: "the-whole-paper",
      pointTitle: t("The Whole Paper", "完整的论文"),
      explanation: t(
        "A short research paper puts the parts together under clear headings.\n\n- **A title** that names the topic and, if possible, the finding.\n- **Introduction**: context, earlier work, the gap, the question and the thesis.\n- **Method and Results**: who or what you studied and how, then what you found, with exact figures and no interpretation.\n- **Discussion**: what the results mean, how they fit earlier work, their limits and the next step.\n- **References**: every source cited in the text, in one style (here APA), in alphabetical order by author.\n\n> **Watch out.** Match every in-text citation one-for-one with an entry in the References list, and make sure the thesis in the introduction agrees with the conclusion in the discussion.",
        "一篇简短的研究论文用清楚的小标题把各部分组合起来。\n\n- **标题**：点明主题，如果可能，也点明发现。\n- **引言**：背景、已有研究、空白、问题和论点。\n- **方法与结果**：研究了谁或什么、怎样研究的，然后是发现了什么，给出确切数字，不加解释。\n- **讨论**：结果意味着什么、与已有研究如何对应、有哪些局限、下一步做什么。\n- **参考文献**：正文中引用的每一个来源，用同一种格式（这里用 APA），按作者姓氏字母顺序排列。\n\n> **注意。** 正文里的每一处引用都要和文末参考文献逐一对应，并确保引言里的论点与讨论段得出的结论前后一致。",
      ),
      question: t("Write a short research paper.", "写一篇简短的研究论文。"),
      bank: researchPaperBank,
      criteria: paperCriteria.whole,
      minWords: 180,
      maxChars: 5000,
      check: t(
        "Check that every section heading is present, every in-text citation appears in the alphabetical APA References list, and the discussion answers the introduction's thesis without overstating the data.",
        "核对各部分小标题是否齐全、正文每处引用是否都出现在按字母排序的 APA 参考文献表中，且讨论段回应了引言论点而没有夸大数据。",
      ),
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
    intro: t(
      "Before judging an academic study, you must represent it fairly: a critical summary first captures the authors' question, claim, and evidence in neutral words, then weighs one genuine strength against one concrete methodological limit.",
      "评价一篇学术研究前，必须先公正地还原它：评述性摘要先用客观中立的语言概括作者的问题、主张与证据，再分别指出一项真实优点与一项具体的方法局限。",
    ),
    prerequisites: ["writing-an-objective-summary", "reading-academic-arguments"],
    encompasses: [{ topic: "writing-an-objective-summary", weight: 0.4 }],
    xp: 25,
    criteria: ["col-critsum-claim", "col-critsum-support", "col-critsum-strength", "col-critsum-limitation"],
    point: "summarizing-and-judging-an-article",
    pointTitle: t("Summarizing and Judging an Article", "概括并评价一篇文章"),
    explanation: t(
      "A **critical summary** first reports an article fairly and then judges it.\n\nThe summary part names the authors and year and gives the article's **question**, its **claim**, and the **evidence** behind it, in your own words and in a few sentences. Keep it objective: report what the authors argue (*she argues that*, *they conclude that*) without yet agreeing or disagreeing.\n\nThe critical part names **one strength** and **one limitation**, each with a reason. Judge the reasoning, not the topic. Good strengths: a large sample, a fair comparison group, random assignment, two kinds of evidence that agree. Good limitations: a small or narrow sample, a second factor that could explain the result, a short period, a conclusion that goes further than the evidence. End by saying what the evidence does support.\n\n> **Watch out.** Keep your opinion out of the summary paragraph, and evaluate the **evidence and method**—not whether you personally like the topic.",
      "**评述性摘要**先公正地转述一篇文章，再对它作出评价。\n\n摘要部分写明作者和年份，用你自己的话、用几句话给出文章的**问题**、**主张**和支持主张的**证据**。要保持客观：转述作者的论证（*she argues that、they conclude that*），此时还不表示赞同或反对。\n\n评述部分指出**一个优点**和**一个局限**，各附理由。评价的是推理，而不是话题。好的优点如：样本大、对照组公平、随机分组、两种证据相互印证。好的局限如：样本小或范围窄、有另一个因素可以解释结果、时间短、结论超出了证据。最后说明证据究竟支持什么。\n\n> **注意。** 摘要段里不要夹杂个人评价，评述段要针对**证据与方法**，而不是凭个人喜好评价话题本身。",
    ),
    question: t("Write a critical summary of the article.", "为这篇文章写一篇评述性摘要。"),
    bank: criticalSummaryBank,
    minWords: 110,
    maxChars: 2200,
    check: t(
      "Check both halves: does the summary objectively state the authors, question, claim, and evidence, and does the critique justify both one strength and one limitation?",
      "检查前后两半：摘要段是否客观写清作者、问题、主张与证据，评述段是否各自用理由支撑了一个优点和一个局限？",
    ),
  }),
  judged({
    id: "forming-a-research-question",
    title: t("Forming a Research Question", "提出研究问题"),
    summary: t(
      "A question narrow enough to answer and open enough to argue, and why it is worth asking.",
      "提出一个窄到可以回答、开放到可以论证的问题，并说明它为什么值得研究。",
    ),
    intro: t(
      "A broad theme like *sleep and school performance* cannot guide a single study. Turning it into a sharp question—naming the group, setting, and measurable outcome—gives your research a clear target.",
      "像 *sleep and school performance* 这样宽泛的主题无法指导一项具体研究。只有把它收窄为点明群体、场景与可测指标的研究问题，研究才有清晰靶心。",
    ),
    prerequisites: ["reading-academic-arguments"],
    encompasses: [],
    xp: 15,
    criteria: ["col-question-focused", "col-question-open", "col-question-researchable", "col-question-significance"],
    point: "narrowing-a-topic-to-a-question",
    pointTitle: t("Narrowing a Topic to a Question", "把话题缩小为问题"),
    explanation: t(
      "A **topic** (*social media and teenagers*) is too large to research. A **research question** names what exactly you will find out, and it has four qualities.\n\n- **Focused**: it names a particular group, place, time or change. *Teenagers at my school*, *since 1950*, *after the wage rose*.\n- **Open**: its answer is not a simple fact or a yes that everyone already accepts; reasonable people could expect different answers. Ask *how*, *why*, *to what extent*, or *does X change Y*.\n- **Researchable**: you can name the evidence that would answer it, such as records, a survey, interviews or an experiment, and you could gather it.\n- **Significant**: someone would care about the answer and could act on it.\n\nAfter the question, explain in two or three sentences how it meets these tests.\n\n> **Watch out.** Do not stop at a single-fact question or a value judgment—your question must need gathered evidence and allow more than one reasonable hypothesis.",
      "**话题**（*social media and teenagers*）太大，无法研究。**研究问题**要说明你究竟要弄清什么，它有四个特点。\n\n- **聚焦**：它点明特定的群体、地点、时间或变化。*Teenagers at my school、since 1950、after the wage rose*。\n- **开放**：答案不是一个简单的事实，也不是人人都已接受的“是”；理性的人可能预期不同的答案。可以问 *how、why、to what extent* 或 *does X change Y*。\n- **可研究**：你能说出回答它所需的证据，如记录、调查、访谈或实验，而且你能收集到。\n- **有意义**：有人会关心答案，并能据此采取行动。\n\n写出问题后，用两三句话说明它如何满足这些标准。\n\n> **注意。** 不要写成查一下就知道的单一事实或纯价值判断——你的问题必须需要收集证据，且存在多种合理假设。",
    ),
    question: t("Write a focused research question from this topic.", "根据这个话题写一个聚焦的研究问题。"),
    bank: researchQuestionBank,
    minWords: 50,
    maxChars: 1500,
    check: t(
      "Test your question against all four criteria—focused, open, researchable, and significant—and confirm your brief explanation explicitly names the evidence that could answer it.",
      "用四项标准逐条检验你的问题——聚焦、开放、可研究、有意义——并确认后面的简短说明明确指出了回答它所需的证据。",
    ),
  }),
  judged({
    id: "writing-an-annotated-bibliography",
    title: t("Writing an Annotated Bibliography", "写注释书目"),
    summary: t(
      "Entries that give each source's reference, then summarize it, evaluate it and say how it will be used.",
      "写出每条书目：给出资料的参考文献格式，然后概括、评价它，并说明将如何使用它。",
    ),
    intro: t(
      "When juggling ten articles for a term paper, a bare list of titles soon blurs together. An annotated bibliography pairs each formatted reference with a concise summary, a reliability check, and a note on how you will use it.",
      "写学期论文面对十几篇文献时，光列标题很快就会混为一团。注释书目在每条规范引文后附上简短概括、可靠性评估以及它在你论文中的具体用途。",
    ),
    prerequisites: ["finding-scholarly-sources", "writing-a-critical-summary"],
    encompasses: [{ topic: "writing-a-critical-summary", weight: 0.3 }],
    xp: 25,
    criteria: ["col-annot-citation", "col-annot-summary", "col-annot-evaluation", "col-annot-use"],
    point: "annotating-a-source",
    pointTitle: t("Annotating a Source", "为资料写注释"),
    explanation: t(
      "An **annotated bibliography** lists your sources, each followed by a short paragraph called an **annotation**. It records what you have read so that you can plan and write the paper.\n\n1. **The reference**: the full entry in the required style (APA or MLA), with authors, year, title, and where it was published.\n2. **Summary**: in one or two sentences, what the source does and finds.\n3. **Evaluation**: how reliable and useful it is. Is it scholarly or popular? Is its evidence strong? What are its limits or its bias?\n4. **Use**: how the source will serve your paper: as main evidence, as background, as the opposing view, as a source of other sources.\n\n> **Watch out.** Do not stop after summarizing the source—every annotation must also **evaluate** its reliability or limits and explain **how it fits** into your paper.",
      "**注释书目**列出你的资料，每条之后附一小段文字，叫作**注释**。它记录你读过的东西，便于你规划和撰写论文。\n\n1. **参考文献条目**：按要求的格式（APA 或 MLA）写出完整条目，包括作者、年份、标题和出处。\n2. **概括**：用一两句话说明资料做了什么、发现了什么。\n3. **评价**：它有多可靠、多有用。它是学术资料还是大众资料？证据是否有力？有什么局限或偏向？\n4. **用途**：资料将怎样服务于你的论文：作为主要证据、作为背景、作为对立观点，或作为寻找其他资料的线索。\n\n大众资料或有偏向的资料也可能有用，只要你清楚说明它适合用来做什么。\n\n> **注意。** 不要只写完概括就收笔——每条注释都必须包含**可靠性/局限评价**以及**在论文中的具体用途**。",
    ),
    question: t("Write two entries of an annotated bibliography.", "写两条注释书目。"),
    bank: annotatedBibliographyBank,
    minWords: 140,
    maxChars: 3000,
    check: t(
      "Confirm each entry has all four parts in order: a complete formatted reference, a 1–2 sentence summary, an evaluation of strengths/limits, and its exact role in your paper.",
      "核对每条书目是否依次包含全部四部分：规范完整的参考文献条目、一两句概括、优缺点评估，以及它在论文中的明确用途。",
    ),
  }),
  judged({
    id: "writing-a-paraphrase",
    title: t("Writing a Paraphrase", "写转述"),
    summary: t(
      "A passage restated faithfully in new words and a new structure, with its citation.",
      "用新的词语和新的结构忠实地重述一段文字，并注明出处。",
    ),
    intro: t(
      "Swapping a few synonyms while leaving the original sentence skeleton intact is still patchwriting. A true paraphrase rebuilds the idea in your own sentence structure, keeps every qualification faithful, and cites the source.",
      "只替换几个近义词、原句骨架照搬不动，依然属于拼凑抄袭。真正的转述会用自己的句法重建观点、忠实保留所有限定条件，并规范注明出处。",
    ),
    prerequisites: ["quoting-and-paraphrasing"],
    encompasses: [{ topic: "quoting-and-paraphrasing", weight: 0.3 }],
    xp: 15,
    criteria: ["col-para-faithful", "col-para-complete", "col-para-own-words", "col-para-cited"],
    point: "restating-a-passage",
    pointTitle: t("Restating a Passage", "重述一段文字"),
    explanation: t(
      "A **paraphrase** restates a source's idea in your own words. It is about as long as the original, unlike a summary, and it must pass four tests.\n\n- **Faithful**: it says what the source says, no more and no less certain. If the source says *may*, so do you.\n- **Complete**: it keeps every part of the idea, including any condition or exception (*although the group had more education*).\n- **In your own words and structure**: changing a few words while keeping the sentence's shape is still plagiarism. Start from a different point, split or join sentences, and turn nouns into verbs or the reverse. Technical terms and names may stay.\n- **Cited**: a paraphrase is still someone else's idea, so it needs a citation, with a page number where the style asks for one.\n\n> **Watch out.** Never strengthen a hedged claim (*may suggest* → *proves*) and never forget the citation—putting an idea in your own words does not make it yours.",
      "**转述**是用你自己的话重述来源中的观点。它与原文长度相当，这一点与概括不同，而且必须通过四项检验。\n\n- **忠实**：它说的正是来源所说的，不多也不少，确定程度也一致。来源说 *may*，你也要这样说。\n- **完整**：它保留观点的每一部分，包括任何条件或例外（*although the group had more education*）。\n- **用自己的词语和结构**：只换几个词而保留句子的形状，仍然是抄袭。可以从不同的地方说起，拆分或合并句子，把名词变成动词或反过来。专业术语和名称可以保留。\n- **注明出处**：转述的仍是别人的观点，所以需要引用；格式要求时，还要注明页码。\n\n> **注意。** 不要擅自加重原文的语气（把 *may suggest* 写成 *proves*），也绝不能漏掉引用——换了你自己的措辞，观点依然属于原作者。",
    ),
    question: t("Paraphrase the passage.", "转述这段文字。"),
    bank: paraphraseBank,
    minWords: 22,
    maxChars: 1200,
    check: t(
      "Place your paraphrase next to the source: is the sentence structure genuinely new, is every hedge and exception preserved, and is the citation included?",
      "把你的转述与原文并排对照：句式是否真正重构、所有限定条件与委婉语气是否完整保留、出处引用是否写上？",
    ),
  }),
  judged({
    id: "writing-a-literature-review",
    title: t("Writing a Literature Review", "写文献综述"),
    summary: t(
      "A paragraph that relates several sources to one another and ends with the gap they leave.",
      "写一段文字，把几份资料相互联系起来，并以它们留下的研究空白收尾。",
    ),
    intro: t(
      "Instead of listing *Author A found X. Author B found Y.*, a literature review puts scholars in conversation—showing where studies agree, where they clash, which evidence is stronger, and what gap remains open.",
      "文献综述不是挨个报流水账（*A 发现了 X，B 发现了 Y*），而是让学者们展开对话——指明哪些研究彼此印证、哪些相互冲突、哪些证据更有力，以及最后留下的研究空白。",
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
      "A **literature review** is not a list of summaries, one source after another. It is organized around **ideas**, and it shows how the sources relate.\n\n- Open with a sentence that states what the research, taken together, shows or debates.\n- Bring the sources in where they support, extend, explain or contradict each other: *Silva's survey suggests why...*; *Park, however, found...*; *These findings are not necessarily in conflict, since...*\n- Weigh them: note which evidence is stronger and which is thin.\n- End with the **gap**: what none of the sources has shown, which your own study will address.\n\nCite every source by author and year each time you use it.\n\n> **Watch out.** Avoid the “one sentence per source” laundry list—connect sources explicitly (*however*, *extends*, *explains*) and finish by naming the exact **gap**.",
      "**文献综述**不是一串摘要、一份资料接一份资料地罗列。它围绕**观点**组织，展示资料之间的关系。\n\n- 开头用一句话说明这些研究合起来表明了什么或在争论什么。\n- 在资料相互支持、拓展、解释或矛盾的地方引入它们：*Silva's survey suggests why...*；*Park, however, found...*；*These findings are not necessarily in conflict, since...*\n- 权衡它们：指出哪些证据更有力，哪些证据薄弱。\n- 以**空白**收尾：没有一份资料证明过的东西，正是你自己的研究要解决的。\n\n每次使用资料都要注明作者和年份。\n\n> **注意。** 避免“一篇文献写一句”的流水账——用明确的连接词（*however*、*extends*、*explains*）把文献串起来，并在段尾点明具体的**研究空白**。",
    ),
    question: t("Write a literature review paragraph.", "写一段文献综述。"),
    bank: literatureReviewBank,
    minWords: 120,
    maxChars: 3000,
    check: t(
      "Verify that your paragraph opens with a synthesis claim, explicitly links the sources to one another with author-year citations, weighs their evidence, and closes on the remaining gap.",
      "核对段落是否以综合判断开头、用作者年份引用把各文献明确关联、权衡了证据强弱，并以留下的研究空白收尾。",
    ),
  }),
  researchPaperTopic,
  judged({
    id: "revising-for-clarity",
    title: t("Revising for Clarity", "为求清晰而修改"),
    summary: t(
      "A dense paragraph rewritten with its characters as subjects and its actions as verbs, without losing its meaning.",
      "改写一段晦涩的文字，让人物作主语、动作作谓语，同时不丢失原意。",
    ),
    intro: t(
      "Turning *The occurrence of delays in the delivery of supplies caused frustration on the part of clinic staff* into *Late supply deliveries frustrated clinic staff* cuts half the words without dropping a single fact. In this topic, you untangle a whole dense paragraph into direct, readable prose.",
      "把 *The occurrence of delays in the delivery of supplies caused frustration on the part of clinic staff* 改写成 *Late supply deliveries frustrated clinic staff*，删去一半冗余字数却不漏掉任何事实。本主题带你把整段晦涩文字改写得直接、通顺。",
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
      "Dense prose hides **who does what**. To revise it:\n\n1. **Find the characters**: the people or groups the paragraph is about (*the school*, *the principal*, *teachers and parents*).\n2. **Find the actions**, often buried in nouns: *implementation* (implement), *determination* (decide), *participation* (take part).\n3. **Rewrite** each sentence with a character as the subject and its action as the verb: *The implementation of the policy by the school* becomes *The school put the policy into effect*.\n4. **Cut** empty phrases: *there was*, *the existence of*, *on the part of*, *the process of*.\n\nThen check that **nothing was lost**: every fact, condition and reason in the original must still be there. Clarity that changes the meaning is not an improvement.\n\n> **Watch out.** Do not delete important conditions, numbers, or exceptions just to make the paragraph shorter—every fact from the original must survive the rewrite.",
      "晦涩的文字掩盖了**谁做了什么**。修改的方法是：\n\n1. **找出人物**：段落所讲的人或群体（*the school、the principal、teachers and parents*）。\n2. **找出动作**，它们常常埋在名词里：*implementation*（implement）、*determination*（decide）、*participation*（take part）。\n3. **改写**每个句子，让人物作主语、动作作谓语：*The implementation of the policy by the school* 改为 *The school put the policy into effect*。\n4. **删去**空洞的短语：*there was、the existence of、on the part of、the process of*。\n\n然后检查**有没有丢失内容**：原文中的每一个事实、条件和理由都必须还在。改变了原意的清晰并不是改进。\n\n> **注意。** 别为了缩减字数而删掉原文里的关键条件、数字或例外——所有事实都必须在改写后完整保留。",
    ),
    question: t("Revise the paragraph for clarity.", "修改这段文字，使它清晰。"),
    bank: clarityBank,
    minWords: 20,
    maxChars: 1200,
    check: t(
      "Compare your revision against the original sentence by sentence: does each sentence put a real actor in the subject and a real action in the verb, while preserving every fact, reason, and condition?",
      "把你的改写与原文逐句对照：每句话是否都让真正的人物作主语、真正的动作作谓语，并且完整保留了原文的每一条事实、理由和条件？",
    ),
  }),
  judged({
    id: "writing-about-data",
    title: t("Writing About Data", "描述数据"),
    summary: t(
      "A paragraph that reports a table or chart accurately and draws only the conclusion it supports.",
      "写一段文字，准确报告表格或图表的内容，只得出它所支持的结论。",
    ),
    intro: t(
      "A table full of numbers does not speak for itself: strong data writing names the source, highlights the main trend with exact anchor figures, notes any key exception, and stops strictly at what the data can prove.",
      "满屏数字的表格不会自己说话：好的数据描述会先交代来源，再用关键数字点明主趋势、指出重要例外，并严格守住数据所能证明的边界。",
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
      "A paragraph about data guides the reader through the numbers to what they mean.\n\n1. **Context**: say what the data are and where they come from (*The survey of 2,400 students shows...*).\n2. **The main pattern**: the overall trend or comparison, with exact figures at its ends (*from 7.6 hours in grade 9 to 6.8 hours in grade 12*). Do not list every number; choose the ones that show the pattern.\n3. **A detail or exception**: the point that breaks or sharpens the pattern (*except in 2020*; *the fall is steepest early*).\n4. **The conclusion the data support**, and its limit. Compare rates, not totals, when groups differ in size.\n\n> **Watch out.** Do not turn correlation into causation (*shows a link*, not *proves X caused Y*), and never compare raw totals when two groups are different sizes—use rates or percentages.",
      "描述数据的段落要引导读者透过数字看到其含义。\n\n1. **背景**：说明数据是什么、来自哪里（*The survey of 2,400 students shows...*）。\n2. **主要规律**：总体趋势或比较，给出两端的确切数字（*from 7.6 hours in grade 9 to 6.8 hours in grade 12*）。不要列出每个数字，只选能显示规律的那些。\n3. **细节或例外**：打破或凸显规律的那一点（*except in 2020*；*the fall is steepest early*）。\n4. **数据所支持的结论**及其局限。数字要带正确的单位。\n\n> **注意。** 不要把相关关系写成因果关系（说 *shows a link*，不说 *proves X caused Y*）；两个群体规模不同时，不能直接比总数，要比较比率或百分比。",
    ),
    question: t("Write a paragraph about the data.", "写一段描述这些数据的文字。"),
    bank: dataBank,
    minWords: 80,
    maxChars: 2000,
    check: t(
      "Re-check every number and unit against the table, confirm you reported the main pattern and an exception, and verify your conclusion does not claim causation from a correlation.",
      "对照原表复核每个数字和单位，确认已写出主趋势与例外，并检查结论没有把相关关系夸大成因果关系。",
    ),
  }),
  judged({
    id: "writing-a-professional-email",
    title: t("Writing a Professional Email", "写工作邮件"),
    summary: t(
      "An email with a clear subject line, its purpose at once, a suitable tone and a clear next step.",
      "写一封邮件：主题行清楚，开门见山说明目的，语气得体，下一步明确。",
    ),
    intro: t(
      "A subject line like *Quick question* gets buried in a busy inbox, whereas *Request to move Friday's budget review to Monday* tells the recipient what you need before they even click open.",
      "像 *Quick question* 这样的邮件主题很容易被淹没，而 *Request to move Friday's budget review to Monday* 在对方点开前就已经说明了来意。",
    ),
    prerequisites: ["tone-and-register-at-work"],
    encompasses: [{ topic: "tone-and-register-at-work", weight: 0.3 }],
    xp: 15,
    criteria: ["col-email-subject", "col-email-purpose", "col-email-tone", "col-email-action"],
    point: "an-email-that-gets-an-answer",
    pointTitle: t("An Email That Gets an Answer", "能得到回复的邮件"),
    explanation: t(
      "A busy reader decides from the first lines whether an email needs attention, so a professional email puts everything important up front.\n\n- **Subject line**: specific enough to tell the reader what the email is about and what it asks. *Request to move the sales report deadline to Tuesday*, not *Report*.\n- **Purpose at once**: the first sentence after the greeting says why you are writing.\n- **Brief reasons and details**: only what the reader needs to decide or act.\n- **Tone**: polite and direct. Requests use *Could you* or *Would it be possible*; refusals are clear and give a short reason and, where possible, an alternative. Match the formality to the reader: *Dear Ms. Carter* for a manager or client, *Hi Priya* for a colleague you know.\n- **A clear next step**: what you want the reader to do, and by when.\n\n> **Watch out.** Never bury the actual request at the bottom of a long paragraph, and never leave the subject line vague (*Update* or *Question*).",
      "忙碌的读者从最初几行就决定一封邮件是否需要处理，所以工作邮件要把一切重要内容放在前面。\n\n- **主题行**：要具体到让读者知道邮件关于什么、请求什么。写 *Request to move the sales report deadline to Tuesday*，而不是 *Report*。\n- **开门见山说明目的**：称呼之后的第一句就说明你为什么写信。\n- **简要的理由和细节**：只写读者作决定或采取行动所需的内容。\n- **语气**：礼貌而直接。请求用 *Could you* 或 *Would it be possible*；拒绝要明确，给出简短理由，并尽可能提供替代方案。正式程度要与读者相称：对经理或客户用 *Dear Ms. Carter*，对熟悉的同事用 *Hi Priya*。\n- **明确的下一步**：你希望读者做什么、在什么时候之前做。\n\n> **注意。** 不要把真正要请对方做的事埋在长段末尾，也不要用含糊的主题行（如 *Update* 或 *Question*）。",
    ),
    question: t("Write the email.", "写这封邮件。"),
    bank: emailBank,
    minWords: 60,
    maxChars: 1600,
    check: t(
      "Check four essentials: a specific subject line, the purpose in the very first sentence, a tone matched to the recipient, and a clear next step with a deadline.",
      "核对四个要点：具体的主题行、首句开门见山的目的、符合收件人身份的语气，以及带时间节点的明确下一步。",
    ),
  }),
  judged({
    id: "writing-a-memo",
    title: t("Writing a Memo", "写备忘录"),
    summary: t(
      "A memo with its heading, its purpose in the first sentence, organized content and the action it asks for.",
      "写一份备忘录：有标准抬头，第一句说明目的，内容有条理，并提出所要求的行动。",
    ),
    intro: t(
      "Inside an organization, a memo skips *Dear…* and *Sincerely* and opens with a four-line header (*To*, *From*, *Date*, *Subject*), putting the decision or policy change in the very first sentence.",
      "机构内部的备忘录省去书信称呼和落款，以四行标准抬头（*To*、*From*、*Date*、*Subject*）开篇，第一句话就直接公布变动、结论或行动要求。",
    ),
    prerequisites: ["writing-a-professional-email"],
    encompasses: [{ topic: "writing-a-professional-email", weight: 0.3 }],
    xp: 20,
    criteria: ["col-memo-format", "col-memo-purpose", "col-memo-organization", "col-memo-action"],
    point: "a-memo-that-informs-and-directs",
    pointTitle: t("A Memo That Informs and Directs", "传达信息并指导行动的备忘录"),
    explanation: t(
      "A **memo** is a short document sent within an organization to announce, report or recommend. It has a fixed form.\n\n- **The heading**: *To*, *From* (with your role), *Date* and *Subject*, each on its own line. The subject line names the topic and the point: *New sign-in rule for visitors from 1 March*.\n- **The purpose in the first sentence**: the change, the finding or the recommendation itself, not an introduction to it.\n- **The body**: the reason, the details and the effect on the reader, in short paragraphs. Use a bulleted or numbered list for actions, steps or figures, and keep its items parallel.\n- **The action**: what readers must do, by when, and whom to ask.\n\n> **Watch out.** Do not add a letter greeting (*Dear Staff,*) or sign-off (*Sincerely,*) to a memo—the *To/From/Date/Subject* heading replaces both.",
      "**备忘录**是在机构内部发送的简短文件，用来通知、报告或建议。它有固定的格式。\n\n- **抬头**：*To*、*From*（附上你的职位）、*Date* 和 *Subject*，各占一行。主题行要点明话题和要点：*New sign-in rule for visitors from 1 March*。\n- **第一句说明目的**：直接写出变化、发现或建议本身，而不是对它的铺垫。\n- **正文**：用简短的段落写出理由、细节以及对读者的影响。行动、步骤或数字用项目符号或编号列出，各项要保持平行结构。\n- **行动**：读者必须做什么、在什么时候之前做、有问题找谁。\n\n> **注意。** 备忘录不要加书信称呼（*Dear Staff,*）或落款（*Sincerely,*）——*To/From/Date/Subject* 抬头已经承担了这两项功能。",
    ),
    question: t("Write the memo.", "写这份备忘录。"),
    bank: memoBank,
    minWords: 90,
    maxChars: 2200,
    check: t(
      "Verify the four-line memo header (*To*, *From*, *Date*, *Subject*), confirm the main point appears in sentence one, and check that required actions, deadlines, and contacts are easy to scan.",
      "核对四行抬头（*To*、*From*、*Date*、*Subject*）是否规范、主旨是否出现在第一句，以及要求采取的行动、截止时间和联系人是否一目了然。",
    ),
  }),
  judged({
    id: "writing-a-cover-letter",
    title: t("Writing a Cover Letter", "写求职信"),
    summary: t(
      "A letter that names the position, matches experience to its requirements with examples, and asks for an interview.",
      "写一封信：点明所申请的职位，用实例说明经历与职位要求相符，并请求面试。",
    ),
    intro: t(
      "Telling a hiring manager *I am a fast learner and team player* says nothing they haven't read a hundred times. A strong cover letter picks two key requirements from the job posting and proves each with a concrete result from your past work.",
      "在求职信里空泛地说 *I am a fast learner and team player* 毫无说服力。好的求职信会紧扣招聘启事的两项核心要求，用你过往具体的经历与数据结果逐一证明。",
    ),
    prerequisites: ["writing-a-professional-email", "reading-workplace-documents"],
    encompasses: [{ topic: "writing-a-professional-email", weight: 0.3 }],
    xp: 25,
    criteria: ["col-cover-position", "col-cover-match", "col-cover-tone", "col-cover-close"],
    point: "matching-yourself-to-a-job",
    pointTitle: t("Matching Yourself to a Job", "让自己与职位相匹配"),
    explanation: t(
      "A **cover letter** argues that you fit a particular job. Its evidence is your experience, and its structure follows the posting.\n\n- **Opening**: name the position and, in a sentence, why you want it or what you bring.\n- **Body**: take two of the posting's requirements, in its own words where you can (*Your posting asks for experience helping the public*), and answer each with a **specific example**: what you did, where, and with what result, ideally with a number (*organized twelve volunteers*, *followers grew from 300 to 2,000*).\n- **Close**: thank the reader and ask for an interview or a conversation.\n\nKeep the tone confident and polite, neither boastful nor apologetic, and keep the letter to one page.\n\n> **Watch out.** Never make bare trait claims (*I am hard-working*) without a concrete example, and never write a generic letter that could apply to any job.",
      "**求职信**论证你适合某个特定职位。它的证据是你的经历，它的结构依照招聘启事。\n\n- **开头**：点明职位，并用一句话说明你为什么想要它或你能带来什么。\n- **正文**：选取启事中的两项要求，尽可能使用它自己的措辞（*Your posting asks for experience helping the public*），并用**具体的例子**逐一回应：你做了什么、在哪里做的、结果如何，最好带有数字（*organized twelve volunteers*、*followers grew from 300 to 2,000*）。\n- **结尾**：感谢读者，并请求面试或交谈的机会。\n\n语气要自信而礼貌，既不夸耀也不自贬，篇幅控制在一页以内。\n\n> **注意。** 不要只贴空洞的自我评价标签（如 *I am hard-working*）而不给实例，也不要写一封套在任何岗位上都行的泛泛来信。",
    ),
    question: t("Write the cover letter.", "写这封求职信。"),
    bank: coverLetterBank,
    minWords: 150,
    maxChars: 3000,
    check: t(
      "Check that your letter names the exact position, matches at least two requirements from the posting with concrete examples (and figures where available), and closes with a polite request for an interview.",
      "核对求职信是否明确点出职位名称、用具体实例（及数据）对应了启事中的至少两项要求，并在结尾礼貌请求面试机会。",
    ),
  }),
  judged({
    id: "writing-an-executive-summary",
    title: t("Writing an Executive Summary", "写执行摘要"),
    summary: t(
      "A summary of a report that gives its purpose, findings and recommendation, so a reader can decide without the rest.",
      "为报告写摘要：给出目的、发现和建议，让读者不读全文也能作出决定。",
    ),
    intro: t(
      "A busy director may read only page one of a forty-page report before voting on a budget. An executive summary stands completely on its own, leading with the purpose and recommendation and backing them with only the numbers that decide the choice.",
      "忙碌的负责人可能只看四十页报告的第一页就要拍板预算。执行摘要必须能独立成篇，开篇亮出目的与建议，并只保留真正影响决策的关键数据与成本风险。",
    ),
    prerequisites: ["writing-a-critical-summary", "writing-a-memo"],
    encompasses: [{ topic: "writing-a-critical-summary", weight: 0.3 }],
    xp: 25,
    criteria: ["col-exec-purpose", "col-exec-findings", "col-exec-recommendation", "col-exec-standalone"],
    point: "a-summary-for-a-decision",
    pointTitle: t("A Summary for a Decision", "为决策而写的摘要"),
    explanation: t(
      "An **executive summary** opens a report for readers who may read nothing else, usually the people who must decide. It must stand on its own.\n\n- **Purpose and recommendation first**: the question the report answers and what it recommends, in the first paragraph.\n- **Key findings**: the few facts that support the recommendation, with the figures that matter. Leave out the method's details and anything that does not bear on the decision.\n- **Costs and risks**: what the recommendation costs and any concern a reader will raise, with its answer.\n- **The action**: exactly what the reader is asked to approve or do, and when.\n\n> **Watch out.** Never write an executive summary as a teaser (*This report will discuss…*) that hides the recommendation until the end, and never use undefined abbreviations from later pages.",
      "**执行摘要**放在报告开头，写给可能只读这一部分的读者，通常是必须作决定的人。它必须能够独立成篇。\n\n- **先写目的和建议**：在第一段写出报告要回答的问题和它的建议。\n- **主要发现**：支持建议的少数几个事实，附上关键数字。省略方法的细节和与决策无关的内容。\n- **成本和风险**：建议需要多少成本，以及读者会提出的任何顾虑和对它的回应。\n- **行动**：明确说明请读者批准或做什么、在什么时候。\n\n摘要最后写，但放在最前面。\n\n> **注意。** 不要把执行摘要写成吊胃口的目录预告（*This report will discuss…*）而把建议藏到最后，也不要使用正文中才定义的缩写。",
    ),
    question: t("Write the executive summary.", "写这份执行摘要。"),
    bank: executiveSummaryBank,
    minWords: 110,
    maxChars: 2200,
    check: t(
      "Imagine a decision-maker reads only your summary: can they see the purpose, recommendation, key supporting figures, cost/risk, and exact approval needed without turning the page?",
      "假设决策者只读这份摘要：不翻看正文，他们能否立刻看清目的、建议、关键数据、成本与风险，以及需要批准的具体事项？",
    ),
  }),
  judged({
    id: "writing-a-research-proposal",
    title: t("Writing a Research Proposal", "写研究计划书"),
    summary: t(
      "A short proposal: the question, why it matters, how it will be answered, and a feasible schedule and budget.",
      "写一份简短的计划书：研究问题、它为什么重要、怎样回答它，以及可行的时间表和预算。",
    ),
    intro: t(
      "Before a committee approves funding or lab time, they need to see that a study is both worthwhile and doable. A research proposal pairs a sharp question and rationale with a concrete method, realistic schedule, and itemized budget.",
      "在委员会批准经费或实验时间前，他们既要看研究值不值得做，也要看能不能做成。研究计划书用小标题把聚焦的问题、研究理由、具体方法、可行进度与逐项预算清楚呈现。",
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
      "A **research proposal** asks a teacher, a committee or a funder to approve a study before it begins. It persuades by being specific.\n\n- **Research question**: focused, open and researchable.\n- **Rationale**: why the question matters, what earlier work leaves open, and who could use the answer.\n- **Method**: who or what you will study, what you will measure or collect, and how you will compare or analyze it. Name the steps that guard against the obvious objection (random groups, a comparison period, a second kind of evidence).\n- **Schedule**: the stages of the work with their weeks or months, ending with the writing.\n- **Budget**: what the money is for, item by item, or why none is needed.\n\nUse headings so that a reviewer can find each part.\n\n> **Watch out.** Do not leave the method vague (*we will do a survey*) or the schedule unrealistic—reviewers reject proposals whose timeline or budget does not match the work promised.",
      "**研究计划书**请老师、委员会或资助方在研究开始之前批准它。它靠具体来说服人。\n\n- **研究问题**：聚焦、开放、可研究。\n- **理由**：这个问题为什么重要，已有研究留下了什么空白，谁能用上答案。\n- **方法**：你将研究谁或什么，测量或收集什么，怎样比较或分析。写明用来应对明显质疑的步骤（随机分组、对照时期、第二种证据）。\n- **时间表**：工作的各个阶段及其所需的周数或月数，以撰写收尾。\n- **预算**：逐项说明资金的用途，或者说明为什么不需要资金。\n\n使用小标题，让评审人能找到每一部分。\n\n> **注意。** 方法不要写得笼统（如只写 *we will do a survey*），进度也不要脱离现实——时间表或预算与承诺的工作量不匹配，计划书就会被拒。",
    ),
    question: t("Write the research proposal.", "写这份研究计划书。"),
    bank: researchProposalBank,
    minWords: 130,
    maxChars: 3000,
    check: t(
      "Confirm all five headed sections are present (research question, rationale, method, schedule, budget) and that your timeline and budget realistically support the method you describe.",
      "核对五个带小标题的部分是否齐全（研究问题、理由、方法、时间表、预算），且进度安排与预算能够现实地支撑所述方法。",
    ),
  }),
];
