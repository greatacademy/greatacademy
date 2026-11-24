// Grades 9 to 12: writing judged by a model, the longer pieces of high school: the literary analysis essay, the
// scene, the argumentative and explanatory essays, the poetry analysis, the personal essay and the college
// application essay.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { argumentEssayBank, explanatoryEssayBank } from "./writing-argument.ts";
import { literaryEssayBank } from "./writing-literary.ts";
import { collegeEssayBank, personalEssayBank } from "./writing-personal.ts";
import { poetryAnalysisBank } from "./writing-poetry.ts";
import { sceneBank } from "./writing-scene.ts";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const onePiece = (check?: Text) => (model: string) =>
  t(
    `One good response:\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}${check ? `\n\n**Check.** ${check.en}` : ""}`,
    `一个好的回答：\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}${check ? `\n\n**检验。** ${check["zh-CN"]}` : ""}`,
  );

interface Judged {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro?: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly { readonly topic: string; readonly weight: number }[];
  readonly xp: number;
  readonly criteria: readonly string[];
  readonly point: string;
  readonly pointTitle: Text;
  readonly explanation: Text;
  readonly question: Text;
  readonly bank: readonly WritingItem[];
  readonly minWords: number;
  readonly maxChars: number;
  readonly check?: Text;
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
  knowledgePoints: [
    point(
      spec.point,
      spec.pointTitle,
      spec.explanation,
      writingGenerator(spec.question, spec.bank, spec.criteria, { minWords: spec.minWords, maxChars: spec.maxChars }, onePiece(spec.check)),
    ),
  ],
});

/** writingTopics912 lists the judged writing topics of grades 9 to 12. */
export const writingTopics912: readonly TopicDef[] = [
  judged({
    id: "writing-a-literary-analysis-essay",
    title: t("Writing a Literary Analysis Essay", "写文学分析文章"),
    summary: t(
      "A short essay of four or five paragraphs that argues a claim about a story's meaning, with quoted evidence.",
      "写一篇四五段的短文，就一个故事的含义提出论点，并引用原文作为证据。",
    ),
    intro: t(
      "Retelling *what happened* in a novel only summarizes; arguing *why a broken lantern marks the narrator's turning point* analyzes. A four- or five-paragraph literary analysis essay proves one arguable claim with woven quotations and explanation.",
      "复述小说里“发生了什么”只是概括；论证“一盏摔碎的灯笼为何标志着叙述者的转折”才是分析。一篇四五段的文学分析文章，会用融入句中的引文和阐释来证明一个可辩护的论点。",
    ),
    prerequisites: ["writing-a-literary-analysis-paragraph", "introductions-and-conclusions", "characterization"],
    encompasses: [
      { topic: "writing-a-literary-analysis-paragraph", weight: 0.4 },
      { topic: "introductions-and-conclusions", weight: 0.3 },
    ],
    xp: 30,
    criteria: ["g912-litessay-thesis", "g912-litessay-evidence", "g912-litessay-analysis", "g912-litessay-structure"],
    point: "arguing-about-a-story",
    pointTitle: t("Arguing About a Story", "就故事展开论证"),
    explanation: t(
      "A literary analysis essay argues one **claim** about what a story means: not what happens, but what the events suggest. *The story suggests that pride feels like independence until it is too late.*\n\nBuild the essay in four or five paragraphs. The introduction names the story and states the claim. Each body paragraph makes one point that supports it, **quotes** a short line from the story, and then **explains** how the words support the point: the quotation is evidence, and the explanation is the analysis. The conclusion returns to the claim and widens it, showing why it matters.\n\nWork quotations into your own sentences, and spend more words explaining them than quoting them.\n\n> **Watch out.** Do not let body paragraphs slip into plot retelling—every paragraph should open with an analytical claim, weave in a brief quote, and spend at least two sentences explaining *how* that wording proves the thesis.",
      "文学分析文章就故事的含义提出一个**论点**：不是讲发生了什么，而是讲这些事件说明了什么。*The story suggests that pride feels like independence until it is too late.*\n\n文章分四五段。引言点出故事并提出论点。每个主体段落提出一个支持论点的分论点，**引用**故事中的一句短语，然后**解释**这些词句如何支持分论点：引文是证据，解释才是分析。结尾回到论点并加以拓展，说明它为何重要。\n\n把引文融入你自己的句子里，用来解释的文字要多于引文本身。\n\n> **注意。** 不要让主体段滑向复述情节——每段都应以分析性分论点开头，织入简短引文，并用至少两句话解释这些措辞*如何*支撑中心论点。",
    ),
    question: t(
      "Read the story notes and write the essay in English, in four or five paragraphs.",
      "阅读故事梗概，用英语写这篇文章，分四五段。",
    ),
    bank: literaryEssayBank,
    minWords: 180,
    maxChars: 6000,
    check: t(
      "Verify that the essay has a clear arguable thesis in the opening, woven quotations in the body paragraphs followed by your own analysis (not bare plot summary), and a closing paragraph that widens the claim.",
      "核对文章开头是否提出可辩护的中心论点，主体段是否将引文自然织入句子并在引文后展开自己的分析（而非复述情节），以及结尾是否回扣并拓展论点。",
    ),
  }),
  judged({
    id: "writing-a-scene",
    title: t("Writing a Scene", "写戏剧场景"),
    summary: t(
      "A short scene in script form in which characters in conflict reveal themselves through dialogue and action.",
      "用剧本格式写一个短场景，让处于冲突中的人物通过对白和动作展现自己。",
    ),
    intro: t(
      "In a staged scene, nobody gets to step out and tell the audience *'He was nervous'*. Instead, a character fidgets with a train ticket, dodges a direct question, and forces a turning point through spoken lines and bracketed actions alone.",
      "在舞台场景里，没人能跳出来告诉观众“他很紧张”。人物只能靠反复折起车票、回避正面追问，用对白和方括号里的动作一步步把冲突推向转折点。",
    ),
    prerequisites: ["writing-a-narrative-from-a-point-of-view", "dramatic-structure-and-dialogue"],
    encompasses: [
      { topic: "writing-a-narrative-from-a-point-of-view", weight: 0.3 },
      { topic: "punctuating-dialogue", weight: 0.2 },
    ],
    xp: 25,
    criteria: ["g912-scene-format", "g912-scene-conflict", "g912-scene-character", "g912-scene-shape"],
    point: "staging-a-conflict",
    pointTitle: t("Staging a Conflict", "把冲突搬上舞台"),
    explanation: t(
      "A script has no narrator, so everything the audience learns comes from what characters **say** and **do**. Write each speaker's name, a colon and the line; put actions and settings in *stage directions* in brackets: *[She turns away.]*\n\nStart with two characters who want different things, and let the **conflict** show through their dialogue. Let characters reveal themselves indirectly: a person who interrupts, changes the subject or answers a question with a question tells us more than a description could. Build toward a **turning point**, a moment that changes the situation, and end there or just after.\n\n> **Watch out.** Keep hidden thoughts out of stage directions—write only physical movements, expressions, or vocal cues an actor can actually perform on stage.",
      "剧本没有叙述者，观众了解的一切都来自人物**说**了什么、**做**了什么。写出说话人的名字、冒号和台词；把动作和场景写在方括号里的*舞台说明*中：*[She turns away.]*\n\n从两个想要不同东西的人物写起，让**冲突**通过对白体现出来。让人物间接地展现自己：打断别人、转换话题或以问答问的人，比任何描述都更能说明他是什么样的人。逐步推向一个**转折点**，即改变局面的时刻，并在那里或稍后结束。\n\n> **注意。** 不要把心理活动写进舞台说明——只写演员能在舞台上实际演出来的动作、神态或语气提示。",
    ),
    question: t("Write the scene in English, in script form.", "用英语以剧本格式写出这个场景。"),
    bank: sceneBank,
    minWords: 140,
    maxChars: 5000,
    check: t(
      "Check that the script uses speaker labels with colons and playable bracketed stage directions, puts two opposing goals in motion, and reaches a clear turning point by the end.",
      "核对剧本是否使用“人物名+冒号”与可表演的方括号舞台说明，是否让两个人物的目标产生冲突，并在结尾前推进到明确的转折点。",
    ),
  }),
  judged({
    id: "writing-an-argumentative-essay",
    title: t("Writing an Argumentative Essay", "写议论文"),
    summary: t(
      "A short essay that argues a position from notes, with evidence, a counterclaim and a rebuttal.",
      "根据笔记写一篇短文，论证一个立场，包含证据、反方观点及反驳。",
    ),
    intro: t(
      "A persuasive opinion becomes a real argument only when it backs each reason with concrete evidence and answers the strongest objection head-on. In this topic, you write a four- or five-paragraph argumentative essay from source notes, including a fair counterclaim and rebuttal.",
      "只有用扎实证据支撑每一条理由并正面回应最强反对意见，个人看法才能成为真正的论证。本主题带你根据资料笔记写一篇四五段的议论文，包含公正的反方观点与有力反驳。",
    ),
    prerequisites: ["writing-a-counterclaim-paragraph", "introductions-and-conclusions", "logical-fallacies"],
    encompasses: [
      { topic: "writing-a-counterclaim-paragraph", weight: 0.4 },
      { topic: "introductions-and-conclusions", weight: 0.3 },
    ],
    xp: 30,
    criteria: ["g912-argument-thesis", "g912-argument-evidence", "g912-argument-counterclaim", "g912-argument-structure"],
    point: "arguing-a-position",
    pointTitle: t("Arguing a Position", "论证一个立场"),
    explanation: t(
      "An argumentative essay takes a **position** on a debatable question and defends it. State the position clearly in the introduction: *High schools should start later, because the change protects students' health and improves learning.*\n\nGive each reason its own body paragraph and support it with **evidence**: facts, numbers or examples, here taken from the notes, and explain how each piece supports the reason. Then present the **strongest opposing view** fairly and answer it: show that it is mistaken, or that your position still outweighs it. A conclusion restates the position and why it matters. Avoid fallacies: attack ideas, not people, and do not claim more than the evidence shows.\n\n> **Watch out.** Do not invent a weak straw-man objection just to knock it down easily—state the *strongest* reason a thoughtful opponent would raise, then answer it with evidence.",
      "议论文就一个有争议的问题表明**立场**并加以论证。在引言中清楚地提出立场：*High schools should start later, because the change protects students' health and improves learning.*\n\n每个理由各占一个主体段落，并用**证据**支持：事实、数字或例子（这里来自笔记），并说明每条证据如何支持理由。然后公正地陈述**最有力的反方观点**并加以回应：说明它是错的，或者说明你的立场仍然更有分量。结尾重申立场及其重要性。避免逻辑谬误：针对观点而非个人，也不要声称超出证据所能证明的结论。\n\n> **注意。** 不要为了好反驳而编造一个不堪一击的稻草人观点——要公正陈述理性反对者会提出的*最有力*理由，再用证据加以回应。",
    ),
    question: t("Read the notes and write the essay in English, in four or five paragraphs.", "阅读笔记，用英语写这篇文章，分四五段。"),
    bank: argumentEssayBank,
    minWords: 180,
    maxChars: 6000,
    check: t(
      "Verify four essentials in your draft: a clear debatable thesis in the opening, evidence from the notes explained in each body paragraph, a fair counterclaim followed by a reasoned rebuttal, and a conclusion that reinforces why the position matters.",
      "核对草稿是否具备四项要素：开头有明确且可辩论的立场、每个主体段用笔记证据并加以阐释、公正呈现反方观点并有理有据地反驳，以及结尾重申立场的重要性。",
    ),
  }),
  judged({
    id: "writing-an-explanatory-essay",
    title: t("Writing an Explanatory Essay", "写说明文"),
    summary: t(
      "A short essay that explains a topic in history or science from notes, objectively and in a clear order.",
      "根据笔记写一篇短文，客观、有条理地说明一个历史或科学话题。",
    ),
    intro: t(
      "Explaining how a printing press spread literacy—or how an urban heat island forms—demands clear order and neutral facts rather than taking a side. In this topic, you write a four- or five-paragraph explanatory essay that organizes source notes logically in an objective voice.",
      "无论是解释印刷术如何推动识字率上升，还是说明城市热岛如何形成，都需要清晰的顺序与客观事实，而不是站队表态。本主题带你根据资料笔记，以客观语气写出一篇条理分明的说明文。",
    ),
    prerequisites: ["writing-an-informative-paragraph", "introductions-and-conclusions", "analyzing-historical-documents"],
    encompasses: [
      { topic: "writing-an-informative-paragraph", weight: 0.4 },
      { topic: "introductions-and-conclusions", weight: 0.3 },
    ],
    xp: 30,
    criteria: ["g912-explain-focus", "g912-explain-development", "g912-explain-organization", "g912-explain-objective"],
    point: "explaining-a-topic",
    pointTitle: t("Explaining a Topic", "说明一个话题"),
    explanation: t(
      "An explanatory essay helps a reader **understand** something: how a process works, why an event happened, what something caused. It does not argue for the writer's opinion.\n\nIntroduce the topic and what the essay will explain. Organize the body in an order that fits the topic: steps of a process, events in time, or causes and then effects. Develop each paragraph with **facts, definitions and examples** from the notes, and connect paragraphs with transitions such as *as a result*, *at the same time* and *finally*. Keep an **objective** tone: report what happened and what experts know, not what you feel about it. End with a conclusion that sums up the significance of the topic.\n\n> **Watch out.** Keep personal opinions and loaded praise out of your draft—if a sentence says *I think this was amazing* or argues *we should*, cut it back to verifiable facts and clear cause-and-effect explanation.",
      "说明文帮助读者**理解**某件事：一个过程如何进行、一个事件为何发生、某事造成了什么结果。它不论证作者的个人观点。\n\n先介绍话题以及文章要说明的内容。主体按照适合话题的顺序组织：过程的步骤、事件的时间顺序，或者先原因后结果。每段用笔记中的**事实、定义和例子**展开，并用 *as a result*、*at the same time*、*finally* 等过渡词连接各段。保持**客观**的语气：陈述发生了什么、专家知道什么，而不是你对它的感受。结尾总结这个话题的意义。\n\n> **注意。** 不要在说明文里夹带个人好恶或劝说语气——如果句中出现“我觉得很了不起”或“我们应该”这类表达，请改回可核查的事实与清晰的因果说明。",
    ),
    question: t("Read the notes and write the essay in English, in four or five paragraphs.", "阅读笔记，用英语写这篇文章，分四五段。"),
    bank: explanatoryEssayBank,
    minWords: 180,
    maxChars: 6000,
    check: t(
      "Check your draft for three things: a logical sequence (steps, chronology, or cause-to-effect) linked by transitions, accurate facts and examples drawn from the notes, and a consistently objective tone with no personal advocacy.",
      "从三方面核对草稿：段落按合理顺序（步骤、时间或因果）推进并用过渡词衔接、准确使用笔记中的事实与例子，以及通篇保持客观语气、不夹带个人立场。",
    ),
  }),
  judged({
    id: "writing-a-poetry-analysis",
    title: t("Writing a Poetry Analysis", "写诗歌分析"),
    summary: t(
      "A short essay that makes a claim about a poem's meaning and shows how its form, sound and images create it.",
      "写一篇短文，就一首诗的含义提出论点，并说明其形式、声音和意象如何营造这一含义。",
    ),
    intro: t(
      "A poem about an empty dock does not say *grief* aloud; it lets the creaking rope and broken line breaks carry the weight. In this topic, you write a short poetry analysis that argues for a poem's meaning and proves how exact images, sounds, and turns build it.",
      "一首写空码头的诗不会直白说出“悲伤”，而是让嘎吱作响的缆绳与突兀的分行去承载分量。本主题带你写一篇诗歌分析短文，提出对诗意的论断，并用精准引文证明意象、声音与转折如何共同营造这一含义。",
    ),
    prerequisites: ["responding-to-a-poem", "poetic-forms-and-meter", "writing-a-literary-analysis-essay"],
    encompasses: [
      { topic: "responding-to-a-poem", weight: 0.3 },
      { topic: "writing-a-literary-analysis-essay", weight: 0.3 },
    ],
    xp: 30,
    criteria: ["g912-poetry-claim", "g912-poetry-quotes", "g912-poetry-craft", "g912-poetry-structure"],
    point: "analyzing-a-poem",
    pointTitle: t("Analyzing a Poem", "分析一首诗"),
    explanation: t(
      "A poetry analysis makes a **claim** about what a poem means or does, then shows **how** the poem achieves it. *The poem suggests that a family's love can live in a few minutes of breakfast.*\n\nIn each body paragraph, look at one element of **craft**: an image or comparison, a sound pattern such as alliteration or rhyme, a repeated word, a line break, or a **turn** where the poem changes direction. Quote the exact words, with a slash to mark a line break (*one leaving, / one arriving*), and explain their effect. Do not only name a device: say what it does to the meaning or the feeling. Follow the poem's movement from beginning to end, so the reader sees how it builds.\n\n> **Watch out.** Never stop at spotting a device (*The poem uses alliteration*)—every quotation must be followed by an explanation of *how* that image, sound, or turn shapes the poem's meaning.",
      "诗歌分析就一首诗的含义或作用提出**论点**，然后说明诗是**如何**做到的。*The poem suggests that a family's love can live in a few minutes of breakfast.*\n\n每个主体段落考察一个**技巧**要素：一个意象或比喻、头韵或押韵等声音模式、一个重复的词、一处分行，或者诗歌改变方向的**转折**。准确引用原词，用斜线标示分行（*one leaving, / one arriving*），并解释其效果。不要只说出修辞手法的名称：要说明它对含义或感情起了什么作用。顺着诗歌从开头到结尾的推进来写，让读者看到它是如何层层展开的。\n\n> **注意。** 不要停在“这首诗用了头韵”这种贴标签上——每处引文后面都必须解释这一意象、声音或转折*如何*塑造诗的含义。",
    ),
    question: t("Read the poem and write the analysis in English, in four or five paragraphs.", "阅读这首诗，用英语写分析文章，分四五段。"),
    check: t(
      "Check each body paragraph: does it quote exact words from the poem (marking line breaks with a slash) and explain how a specific craft choice creates meaning rather than merely paraphrasing the stanza?",
      "检查每个主体段：是否准确引用了原诗词句（跨行用斜线标明），并解释具体技巧如何营造含义，而不是把诗节复述成白话？",
    ),
    bank: poetryAnalysisBank,
    minWords: 160,
    maxChars: 5500,
  }),
  judged({
    id: "writing-a-personal-essay",
    title: t("Writing a Personal Essay", "写个人随笔"),
    summary: t(
      "A short essay that tells a real experience in specific scenes and reflects on what it meant.",
      "写一篇短文，用具体的场景讲述一段真实经历，并反思它的意义。",
    ),
    intro: t(
      "Remembering a summer of folding dumplings beside a silent grandmother becomes a personal essay only when the concrete scene opens onto what you understand now that you could not see then. In this topic, you write a three- to five-paragraph personal essay that pairs vivid scenes with honest reflection.",
      "回忆在沉默的外婆身旁包饺子的那个夏天，只有当具体场景引出你如今才看清的领悟时，它才成为真正的个人随笔。本主题带你写一篇三到五段的个人随笔，将鲜活场景与真诚反思融为一体。",
    ),
    prerequisites: ["writing-a-narrative-from-a-point-of-view", "introductions-and-conclusions", "reading-personal-essays"],
    encompasses: [
      { topic: "writing-a-narrative-from-a-point-of-view", weight: 0.3 },
      { topic: "introductions-and-conclusions", weight: 0.2 },
    ],
    xp: 25,
    criteria: ["g912-personal-experience", "g912-personal-reflection", "g912-personal-voice", "g912-personal-shape"],
    point: "telling-and-reflecting",
    pointTitle: t("Telling and Reflecting", "讲述与反思"),
    explanation: t(
      "A personal essay does two things: it **tells** a real experience and it **reflects** on what the experience meant. Without the story, the reflection is a lecture; without the reflection, the story is only an anecdote.\n\nTell the experience in **specific scenes**: a place, a moment, something someone said. *I played the first two lines perfectly. Then my hands stopped.* Use the first person and a natural, honest voice. Then step back and reflect: what did you understand then, and what do you understand now? The best reflection is specific too; it names a change in how you think or act, not a general moral.\n\n> **Watch out.** Avoid ending with a cliché slogan like *I learned never to give up*—anchor your closing reflection to a specific shift in how you see yourself, another person, or your choices.",
      "个人随笔做两件事：**讲述**一段真实经历，并**反思**这段经历的意义。只有故事没有反思，就只是一则轶事；只有反思没有故事，就成了说教。\n\n用**具体的场景**讲述经历：一个地点、一个时刻、某人说过的一句话。*I played the first two lines perfectly. Then my hands stopped.* 使用第一人称和自然、真诚的语气。然后退后一步进行反思：你当时明白了什么，现在又明白了什么？最好的反思也是具体的；它说出你在想法或做法上的某个变化，而不是一句笼统的道理。\n\n> **注意。** 不要用“我学会了永不放弃”这类套话收尾——把反思紧扣在这次经历带给你的具体认知或行动转变上。",
    ),
    question: t("Write the personal essay in English, in three to five paragraphs.", "用英语写这篇个人随笔，分三到五段。"),
    bank: personalEssayBank,
    minWords: 150,
    maxChars: 5000,
    check: t(
      "Review your draft for two halves: concrete first-person scenes with sensory details, and a specific closing reflection showing what you understand now rather than a generic moral.",
      "核对草稿的两半：是否有带感官细节的第一人称具体场景，以及结尾的反思是否道出了你如今的具体领悟而非空泛大道理。",
    ),
  }),
  judged({
    id: "writing-a-college-application-essay",
    title: t("Writing a College Application Essay", "写大学申请文书"),
    summary: t(
      "A personal essay that answers an application prompt with a specific story and the insight it shows about the writer.",
      "写一篇个人文书，用具体的故事回应申请题目，并展现故事所体现的作者的见识。",
    ),
    intro: t(
      "Admissions readers already have your transcript and activity list—what they cannot see there is how you think when a plan breaks or a small moment changes your mind. In this topic, you write a four- to six-paragraph college application essay built around one specific story and genuine insight.",
      "招生官手里已经有你的成绩单和活动清单——他们看不见的是当计划落空或某个瞬间触动你时，你如何思考。本主题带你围绕一个具体故事与真实见识，写出一篇四到六段的大学申请文书。",
    ),
    prerequisites: ["writing-a-personal-essay"],
    encompasses: [{ topic: "writing-a-personal-essay", weight: 0.4 }],
    xp: 30,
    criteria: ["g912-college-prompt", "g912-college-specific", "g912-college-insight", "g912-college-craft"],
    point: "answering-an-application-prompt",
    pointTitle: t("Answering an Application Prompt", "回应申请文书题目"),
    explanation: t(
      "A college application essay is a personal essay with a reader in mind: someone who wants to know who you are and how you think. It must **answer the prompt**, but the prompt is a door, not a cage.\n\nChoose one **specific** story rather than a list of achievements: a single afternoon in a bicycle shop can say more than a résumé. Show yourself through actions and details, then reflect to reveal an **insight**: what you learned about yourself or others, and how it shapes what you will do next. Keep a genuine voice, open with a moment that draws the reader in, and make every sentence earn its place, because application essays have strict word limits.\n\n> **Watch out.** Do not turn the essay into a prose résumé listing five clubs and awards—zoom in on *one* telling moment and let your reflection show how your mind works.",
      "大学申请文书是一篇心中有读者的个人随笔：读者想知道你是谁、你如何思考。它必须**回应题目**，但题目是一扇门，而不是一个笼子。\n\n选择一个**具体**的故事，而不是罗列成就：在自行车修理铺度过的一个下午，可能比一份简历更能说明问题。通过行动和细节展现自己，然后通过反思揭示一种**见识**：你对自己或他人有了什么认识，它将如何影响你接下来要做的事。保持真实的语气，用一个吸引读者的瞬间开头，并让每一句话都有存在的价值，因为申请文书有严格的字数限制。\n\n> **注意。** 别把文书写成罗列社团与奖项的散文版简历——聚焦*一个*有说服力的具体片段，用反思展现你的思考方式。",
    ),
    question: t("Write the application essay in English, in four to six paragraphs.", "用英语写这篇申请文书，分四到六段。"),
    bank: collegeEssayBank,
    minWords: 200,
    maxChars: 6500,
    check: t(
      "Check your draft against four admissions tests: does it directly answer the prompt, focus on one concrete story rather than a résumé list, reveal genuine self-insight, and open with an engaging moment?",
      "用四项标准复核文书：是否紧扣申请题目、是否聚焦单个具体故事而非罗列简历、是否展现真实自我洞察，以及开头是否能立刻吸引读者？",
    ),
  }),
];
