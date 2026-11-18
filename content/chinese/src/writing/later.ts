// The judged writing of native grades 7 to 11 and the essay of the Gaokao (docs/chinese-curriculum.md §11): W5
// compositions, two kinds of writing a grade. Each topic has one bank of tasks that its two knowledge points share, each
// knowledge point judging the work by two of the topic's three criteria. A Chinese character counts as a word.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, type WritingLimits, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { argueBank, centerBank, detailBank, explainOrderBank, speechBank, storyBank } from "./bank-c.ts";
import { commentaryBank, dialecticBank, essayBank, materialBank, proposalBank } from "./bank-d.ts";

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that an essay stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

const onePiece = (model: string): Text => t(`One good answer:\n\n${quoted(model)}`, `一篇好的答案：\n\n${quoted(model)}`);

/** Step is one knowledge point of a judged topic: what it teaches, what it asks and the two criteria it judges by. */
interface Step {
  readonly id: string;
  readonly title: Text;
  readonly explanation: Text;
  readonly question: Text;
  readonly criteria: readonly [string, string];
}

/** Judged describes a judged writing topic. */
interface Judged {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: TopicDef["encompasses"];
  readonly xp: number;
  readonly criteria: readonly [string, string, string];
  readonly bank: readonly WritingItem[];
  readonly limits: WritingLimits;
  readonly steps: readonly [Step, Step];
}

/** judged builds a judged writing topic. */
function judged(spec: Judged, practiceOnly = false): TopicDef {
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    prerequisites: [...spec.prerequisites],
    encompasses: spec.encompasses,
    xp: spec.xp,
    strand: "writing",
    ...(practiceOnly && { practiceOnly: true }),
    criteria: spec.criteria.map(criterion),
    knowledgePoints: spec.steps.map((s) =>
      point(s.id, s.title, s.explanation, writingGenerator(s.question, spec.bank, s.criteria, spec.limits, onePiece)),
    ),
  };
}

/** laterWritingTopics are the judged writing topics of grades 7 to 11, in order. */
export const laterWritingTopics: readonly GradeTopic[] = [
  {
    grade: 7,
    topic: judged({
      id: "writing-7-center",
      title: t("Making the Centre Stand Out", "突出中心"),
      summary: t(
        "Write a narrative in Chinese with one clear central idea, choosing the material that serves it and telling the part that shows it best in detail.",
        "用中文写一篇记叙文：中心明确，围绕中心选择材料，把最能表现中心的部分写详细。",
      ),
      prerequisites: ["writing-6-scene"],
      encompasses: [{ topic: "writing-5-person", weight: 0.2 }],
      xp: 26,
      criteria: ["zh7-center-clear", "zh7-center-material", "zh7-center-emphasis"],
      bank: centerBank,
      limits: { minWords: 450, maxChars: 3000 },
      steps: [
        {
          id: "writing-7-center-material",
          title: t("Material That Serves the Centre", "围绕中心选材"),
          explanation: t(
            "Before writing, decide the **centre**: the one thing the piece is meant to show, such as how a grandfather's patience changed you. Then choose **material** for it. Of all that happened, keep what shows the centre and leave out the rest, however interesting: a story about patience has no room for the football match that afternoon.",
            "动笔之前，先想好**中心**：这篇文章要表现的那一点，比如爷爷的耐心怎样改变了你。再围绕中心**选材**。发生过的事情很多，只留下能表现中心的，其余的再有趣也要舍去：写耐心的文章，就容不下那天下午的足球赛。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Keep to one clear centre, and choose only material that serves it.",
            "根据下面的要求，用中文写一篇记叙文。中心要明确，只选择能表现中心的材料。",
          ),
          criteria: ["zh7-center-clear", "zh7-center-material"],
        },
        {
          id: "writing-7-center-emphasis",
          title: t("Detail Where It Matters", "详写和略写"),
          explanation: t(
            "Not every part deserves the same number of words. The part that shows the centre best is told **in detail** (详写): slow it down with actions, words and feelings. The parts that only lead up to it or follow it are told **briefly** (略写), in a sentence or two. A reader remembers what you dwell on.",
            "不是每一部分都要用一样多的笔墨。最能表现中心的部分要**详写**：放慢节奏，写出动作、语言和感受。只是引出它或交代结果的部分要**略写**，一两句话就够了。你在哪里停留，读者就记住哪里。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Tell in detail the part that best shows your centre, and the rest briefly.",
            "根据下面的要求，用中文写一篇记叙文。把最能表现中心的部分写详细，其余部分写简略。",
          ),
          criteria: ["zh7-center-emphasis", "zh7-center-clear"],
        },
      ],
    }),
  },
  {
    grade: 7,
    topic: judged({
      id: "writing-7-detail",
      title: t("Catching the Telling Detail", "抓住细节"),
      summary: t(
        "Write in Chinese about an event or a person, with closely observed details that reveal character or feeling.",
        "用中文写一件事或一个人，抓住能表现人物性格和情感的细节，写得细致具体。",
      ),
      prerequisites: ["writing-7-center"],
      encompasses: [{ topic: "writing-7-center", weight: 0.3 }],
      xp: 26,
      criteria: ["zh7-detail-telling", "zh7-detail-meaning", "zh7-detail-whole"],
      bank: detailBank,
      limits: { minWords: 450, maxChars: 3000 },
      steps: [
        {
          id: "writing-7-detail-telling",
          title: t("Looking Closely", "把细节写细"),
          explanation: t(
            "A **detail** is a small thing seen up close: the way a hand grips a cup, a word said too quickly, a button sewn on with thread of the wrong colour. Write it precisely. *妈妈很累* is general; *妈妈靠在门框上，鞋也没换，手里的钥匙半天没放下* is a detail.",
            "**细节**是凑近了看到的小地方：一只手怎样握着杯子，一句说得太快的话，一颗用不同颜色的线缝上的扣子。要把它写准确。“妈妈很累”是笼统的；“妈妈靠在门框上，鞋也没换，手里的钥匙半天没放下”才是细节。",
          ),
          question: t(
            "Write in Chinese on the task below. Include at least one closely observed detail, written precisely, within a whole event.",
            "根据下面的要求，用中文写一篇文章。在完整的事情中，至少写出一个细致准确的细节。",
          ),
          criteria: ["zh7-detail-telling", "zh7-detail-whole"],
        },
        {
          id: "writing-7-detail-meaning",
          title: t("Details That Mean Something", "细节要有意味"),
          explanation: t(
            "A detail earns its place when it **reveals** something: a person's character, a feeling they hide, what the event meant. The keys left in the hand show tiredness without saying so. Choose details for what they show, not for decoration, and the reader will understand more than you state.",
            "细节要能**表现**什么，才值得写：人物的性格，他藏着的感情，这件事的意义。手里没放下的钥匙，不说累，却写出了累。选细节要看它能表现什么，而不是为了装饰，读者就能读懂你没有直接说出来的东西。",
          ),
          question: t(
            "Write in Chinese on the task below. Choose details that reveal character or feeling, not only decorate.",
            "根据下面的要求，用中文写一篇文章。选择能表现人物性格或情感的细节，不要只为了装饰。",
          ),
          criteria: ["zh7-detail-meaning", "zh7-detail-telling"],
        },
      ],
    }),
  },
  {
    grade: 8,
    topic: judged({
      id: "writing-8-explain",
      title: t("Explaining in Order", "说明事物的特征和顺序"),
      summary: t(
        "Write an explanation in Chinese that grasps the main features of a thing and follows a clear order in space, time or logic, in accurate language.",
        "用中文写一篇说明文：抓住事物的主要特征，按空间、时间或逻辑顺序来写，语言准确。",
      ),
      prerequisites: ["writing-5-explain", "writing-7-center"],
      encompasses: [{ topic: "writing-5-explain", weight: 0.3 }],
      xp: 26,
      criteria: ["zh8-explain-feature", "zh8-explain-order", "zh8-explain-accurate"],
      bank: explainOrderBank,
      limits: { minWords: 400, maxChars: 2800 },
      steps: [
        {
          id: "writing-8-explain-order",
          title: t("Features in Order", "抓住特征，有序说明"),
          explanation: t(
            "First find the **features** that make the thing what it is: for a stone arch bridge, its arch and how it bears weight, not the colour of its railings. Then choose an **order**: **space** for a building (from outside to inside), **time** for a process (step by step), **logic** for an idea (from cause to effect, from the general to the particular). Words like *首先*, *接着*, *往里走* show the reader the way.",
            "先找出事物的**特征**，就是它之所以是它的地方：写石拱桥，要写它的拱和它怎样承重，而不是栏杆的颜色。再选一种**顺序**：写建筑用**空间顺序**（由外到内），写过程用**时间顺序**（一步一步），写道理用**逻辑顺序**（由因到果、由总到分）。“首先”“接着”“往里走”这样的词，给读者指路。",
          ),
          question: t(
            "Write an explanation in Chinese of the thing below. Grasp its main features and follow a clear order.",
            "用中文写一篇说明文，介绍下面的事物。抓住它的主要特征，按一定的顺序说明。",
          ),
          criteria: ["zh8-explain-feature", "zh8-explain-order"],
        },
        {
          id: "writing-8-explain-accurate",
          title: t("Accurate Language", "说明语言要准确"),
          explanation: t(
            "An explanation must be **true**, and its words must say exactly as much as is true. Where a statement holds only mostly, say so: *一般*, *大约*, *左右*, *几乎*. *熊猫只吃竹子* is wrong; *大熊猫的食物几乎全是竹子* is accurate. A wrong fact costs more than a missing one.",
            "说明文必须**真实**，用词要恰好说到事实那么多。一个说法只是大体如此，就要说明：“一般”“大约”“左右”“几乎”。“熊猫只吃竹子”不对；“大熊猫的食物几乎全是竹子”才准确。写错一个事实，比少写一个更糟。",
          ),
          question: t(
            "Write an explanation in Chinese of the thing below. Keep the language accurate, qualifying what is not always true.",
            "用中文写一篇说明文，介绍下面的事物。语言要准确，不是一概如此的地方要加限制。",
          ),
          criteria: ["zh8-explain-accurate", "zh8-explain-feature"],
        },
      ],
    }),
  },
  {
    grade: 8,
    topic: judged({
      id: "writing-8-speech",
      title: t("Writing a Speech", "撰写演讲稿"),
      summary: t(
        "Write a speech in Chinese for an occasion and an audience, with one clear view supported by reasons and language made to be heard.",
        "用中文为一个场合和一群听众写演讲稿：观点明确，有理有据，语言适合说给人听。",
      ),
      prerequisites: ["writing-6-argue", "writing-7-center"],
      encompasses: [{ topic: "writing-6-argue", weight: 0.2 }],
      xp: 24,
      criteria: ["zh8-speech-audience", "zh8-speech-view", "zh8-speech-spoken"],
      bank: speechBank,
      limits: { minWords: 400, maxChars: 2800 },
      steps: [
        {
          id: "writing-8-speech-view",
          title: t("Audience and View", "面向听众，观点鲜明"),
          explanation: t(
            "A speech is written for **listeners** on an **occasion**. It begins by addressing them, *各位老师、同学们：*, and ends by thanking them. In between, put forward **one view** or appeal, and back it with reasons and examples the listeners know. A speech that tries to say everything is remembered for nothing.",
            "演讲稿是为某个**场合**的**听众**写的。开头要称呼他们：“各位老师、同学们：”，结尾要向他们致谢。中间提出**一个观点**或一个倡议，用听众熟悉的理由和事例来支持它。什么都想说的演讲，最后什么也没让人记住。",
          ),
          question: t(
            "Write the speech below in Chinese. Address your audience, and put forward one clear view with reasons.",
            "用中文写下面这篇演讲稿。称呼听众，提出一个明确的观点并说明理由。",
          ),
          criteria: ["zh8-speech-audience", "zh8-speech-view"],
        },
        {
          id: "writing-8-speech-spoken",
          title: t("Made to Be Heard", "适合说给人听"),
          explanation: t(
            "Listeners cannot read a sentence twice. Write **short, clear sentences**, speak to them directly (*同学们，你们有没有想过……*), and use devices that work by ear: a **question** to the audience, a phrase **repeated** to drive the point home, a **call to act** at the end.",
            "听众不能把一句话再读一遍。所以句子要**短而清楚**，直接对听众说话（“同学们，你们有没有想过……”），多用适合听的手法：向听众**提问**，**反复**一句话来强调，结尾**号召**大家行动。",
          ),
          question: t(
            "Write the speech below in Chinese. Make it easy to follow by ear, speaking to your listeners directly.",
            "用中文写下面这篇演讲稿。要适合说给人听，直接对听众说话。",
          ),
          criteria: ["zh8-speech-spoken", "zh8-speech-view"],
        },
      ],
    }),
  },
  {
    grade: 9,
    topic: judged({
      id: "writing-9-argue",
      title: t("Writing an Argument", "议论文：论点、论据和论证"),
      summary: t(
        "Write an argument in Chinese with a clear central claim, evidence that bears on it, and at least two methods of argument.",
        "用中文写一篇议论文：中心论点明确，论据充分，至少用上两种论证方法。",
      ),
      prerequisites: ["writing-8-speech", "writing-8-explain"],
      encompasses: [{ topic: "writing-6-argue", weight: 0.3 }],
      xp: 28,
      criteria: ["zh9-argue-thesis", "zh9-argue-evidence", "zh9-argue-methods"],
      bank: argueBank,
      limits: { minWords: 500, maxChars: 3200 },
      steps: [
        {
          id: "writing-9-argue-thesis",
          title: t("A Claim and Its Evidence", "论点和论据"),
          explanation: t(
            "An argument has three parts. The **claim** (论点) is what you hold, stated clearly and early: *专注是做成一件事的前提。* The **evidence** (论据) is what supports it: **facts** (examples, events, data you are sure of) and **reasoning** (sayings, principles, common sense). Evidence must bear on the claim itself, not only on the topic.",
            "议论文有三要素。**论点**是你的主张，要尽早明确地提出：“专注是做成一件事的前提。”**论据**是支持它的材料：**事实论据**（事例、事件、确凿的数据）和**道理论据**（名言、道理、常识）。论据要能证明论点本身，而不只是和话题沾边。",
          ),
          question: t(
            "Write an argument in Chinese on the question below. State a clear claim early, and support it with evidence that bears on it.",
            "就下面的问题，用中文写一篇议论文。尽早提出明确的论点，并用切合论点的论据来证明。",
          ),
          criteria: ["zh9-argue-thesis", "zh9-argue-evidence"],
        },
        {
          id: "writing-9-argue-methods",
          title: t("Methods of Argument", "论证方法"),
          explanation: t(
            "**Methods** (论证方法) connect evidence to claim. **举例论证**: an example, then what it proves. **道理论证**: a principle or saying, explained. **对比论证**: two cases set side by side, so the difference speaks. **比喻论证**: a comparison that makes the idea clear. Use at least two, and after each, say how it proves the claim.",
            "**论证方法**把论据和论点连起来。**举例论证**：举出事例，再说明它证明了什么。**道理论证**：引用道理或名言，并加以阐释。**对比论证**：把两种情况放在一起，让差别说话。**比喻论证**：用比喻把道理讲明白。至少用上两种，每用一种，都要说明它怎样证明论点。",
          ),
          question: t(
            "Write an argument in Chinese on the question below. Use at least two methods of argument, and explain how each proves your claim.",
            "就下面的问题，用中文写一篇议论文。至少用上两种论证方法，并说明每一种怎样证明论点。",
          ),
          criteria: ["zh9-argue-methods", "zh9-argue-thesis"],
        },
      ],
    }),
  },
  {
    grade: 9,
    topic: judged({
      id: "writing-9-story",
      title: t("A Whole Narrative", "写一篇完整的记叙文"),
      summary: t(
        "Write a narrative in Chinese held together by a thread, with its key scene vividly described and a theme that emerges from the story.",
        "用中文写一篇完整的记叙文：有清晰的线索，关键场面描写生动，主题从故事中自然流露。",
      ),
      prerequisites: ["writing-7-detail"],
      encompasses: [
        { topic: "writing-7-detail", weight: 0.3 },
        { topic: "writing-7-center", weight: 0.2 },
      ],
      xp: 28,
      criteria: ["zh9-story-thread", "zh9-story-detail", "zh9-story-theme"],
      bank: storyBank,
      limits: { minWords: 600, maxChars: 3600 },
      steps: [
        {
          id: "writing-9-story-thread",
          title: t("A Thread and a Scene", "线索和场面"),
          explanation: t(
            "A longer narrative needs a **thread** (线索) to hold it together: an object that keeps returning (an old bicycle), a feeling that changes, or the passing of time. Each part hangs on it. At the key moment, slow down into a **scene**: what people do and say, what they think, what the place looks and sounds like.",
            "篇幅长一些的记叙文，需要一条**线索**把它串起来：一件反复出现的东西（一辆旧自行车），一种不断变化的心情，或者时间的推移。每一部分都挂在这条线上。到了关键的时刻，放慢节奏，写成一个**场面**：人物做了什么、说了什么、想了什么，那里是什么样子、有什么声音。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Hold it together with a clear thread, and describe its key scene vividly.",
            "根据下面的要求，用中文写一篇记叙文。用清晰的线索把全文串起来，把关键场面写生动。",
          ),
          criteria: ["zh9-story-thread", "zh9-story-detail"],
        },
        {
          id: "writing-9-story-theme",
          title: t("Letting the Theme Emerge", "让主题自然流露"),
          explanation: t(
            "The **theme** of a story is what it means. It should grow out of what happens, so that the reader feels it before you name it. The ending may bring it out, with a returning image or one quiet sentence, but a moral tacked on (*从此我明白了一个道理……*) after a story that has not shown it convinces no one.",
            "故事的**主题**就是它的意义。主题要从事情本身中生长出来，让读者在你点明之前就已经感受到。结尾可以把它点出来，用一个再次出现的形象，或一句平静的话；但如果故事本身没有表现出来，最后硬加一句“从此我明白了一个道理……”，是说服不了人的。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Let the theme emerge from the story, and bring it out at the end without a moral tacked on.",
            "根据下面的要求，用中文写一篇记叙文。让主题从故事中自然流露，结尾点明主题，不要生硬地加上道理。",
          ),
          criteria: ["zh9-story-theme", "zh9-story-detail"],
        },
      ],
    }),
  },
  {
    grade: 10,
    topic: judged({
      id: "writing-10-material",
      title: t("Writing on Given Material", "任务驱动型材料作文"),
      summary: t(
        "Write an essay in Chinese on given material and a task: a view drawn from the material, an argument that develops in stages, and evidence analysed.",
        "用中文根据材料和任务写作文：从材料中提炼观点，论证层层深入，论据经过分析。",
      ),
      prerequisites: ["writing-9-argue"],
      encompasses: [{ topic: "writing-9-argue", weight: 0.3 }],
      xp: 30,
      criteria: ["zh10-task-material", "zh10-task-depth", "zh10-task-evidence"],
      bank: materialBank,
      limits: { minWords: 700, maxChars: 4000 },
      steps: [
        {
          id: "writing-10-material-view",
          title: t("A View from the Material", "从材料中立意"),
          explanation: t(
            "In a material essay, the view (立意) comes **from the material and the task**. Read what happens in it and what it sets against what, then ask what it invites you to think about. A view that the material does not raise, however good, misses the task. State it in your title or opening, and keep to it.",
            "材料作文的立意来自**材料和任务**。读清楚材料里发生了什么、拿什么和什么对照，再想想它要你思考什么。材料没有涉及的观点，再好也偏离了题意。把立意放在标题或开头，全文都围绕它。",
          ),
          question: t(
            "Read the material and write an essay in Chinese as the task asks. Draw your view from the material, and support it with evidence you analyse.",
            "阅读材料，按要求用中文写一篇文章。从材料中提炼观点，并用经过分析的论据来支持它。",
          ),
          criteria: ["zh10-task-material", "zh10-task-evidence"],
        },
        {
          id: "writing-10-material-depth",
          title: t("Going Deeper in Stages", "层层深入"),
          explanation: t(
            "A strong essay does not repeat its view five times. It goes **deeper in stages**: what the matter is, why it is so, what follows from it or what to do. Each paragraph should move the argument a step, so that the reader ends further on than where they began.",
            "好的议论文不是把观点重复五遍，而是**层层深入**：是什么，为什么，怎么办或由此能推出什么。每一段都要让论证前进一步，读者读完时，走得比开头更远。",
          ),
          question: t(
            "Read the material and write an essay in Chinese as the task asks. Develop the argument in stages, each paragraph a step further.",
            "阅读材料，按要求用中文写一篇文章。论证要层层深入，每一段都向前推进一步。",
          ),
          criteria: ["zh10-task-depth", "zh10-task-material"],
        },
      ],
    }),
  },
  {
    grade: 10,
    topic: judged({
      id: "writing-10-commentary",
      title: t("Writing a Commentary", "写时评"),
      summary: t(
        "Write a commentary in Chinese on an event or phenomenon: state it briefly, take a reasoned view, and analyse its causes and consequences.",
        "用中文就一件事或一种现象写时评：简要准确地叙述，提出有理有据的看法，分析原因和影响。",
      ),
      prerequisites: ["writing-10-material"],
      encompasses: [{ topic: "writing-10-material", weight: 0.2 }],
      xp: 28,
      criteria: ["zh10-comment-event", "zh10-comment-view", "zh10-comment-analysis"],
      bank: commentaryBank,
      limits: { minWords: 650, maxChars: 4000 },
      steps: [
        {
          id: "writing-10-commentary-view",
          title: t("The Event and a View", "述事和表态"),
          explanation: t(
            "A commentary (时评) begins by **stating the event** briefly and as given, without adding facts that change it. Then it takes **a view**: reasoned, fair, without sweeping words like *完全*, *一切* where they do not hold. A reader should be able to disagree with you and still find you fair.",
            "时评开头要**简要叙述事件**，按给出的事实来写，不添加改变事实的内容。接着**表明看法**：有道理，公允，不在不成立的地方用“完全”“一切”这样绝对的词。读者即使不同意你，也会觉得你说得公道。",
          ),
          question: t(
            "Write a commentary in Chinese on the event below. State it briefly and accurately, and take one clear, reasoned view.",
            "就下面的事件，用中文写一篇时评。简要准确地叙述它，提出一个明确、有理有据的看法。",
          ),
          criteria: ["zh10-comment-event", "zh10-comment-view"],
        },
        {
          id: "writing-10-commentary-analysis",
          title: t("Causes, Consequences and a Way Forward", "分析原因，提出建议"),
          explanation: t(
            "A view becomes a commentary when it is **analysed**: why has this happened, who gains and who loses, what will follow if it goes on? End with a **reasoned suggestion** or conclusion that follows from the analysis, not a slogan.",
            "看法经过**分析**，才成为时评：为什么会出现这种情况？谁得益，谁受损？如果继续下去会怎样？结尾提出从分析中得出的**建议**或结论，而不是喊口号。",
          ),
          question: t(
            "Write a commentary in Chinese on the event below. Analyse its causes or consequences, and end with a reasoned suggestion.",
            "就下面的事件，用中文写一篇时评。分析它的原因或影响，结尾提出有道理的建议。",
          ),
          criteria: ["zh10-comment-analysis", "zh10-comment-view"],
        },
      ],
    }),
  },
  {
    grade: 11,
    topic: judged({
      id: "writing-11-dialectic",
      title: t("Weighing Both Sides", "辩证分析"),
      summary: t(
        "Write an essay in Chinese on a two-sided question: consider each side and its conditions, and reach a reasoned position of your own.",
        "用中文就一个两面性的问题写作文：分析两方面及其条件，得出自己有理有据的结论。",
      ),
      prerequisites: ["writing-10-material"],
      encompasses: [{ topic: "writing-10-material", weight: 0.3 }],
      xp: 30,
      criteria: ["zh11-dialectic-sides", "zh11-dialectic-position", "zh11-dialectic-reasoning"],
      bank: dialecticBank,
      limits: { minWords: 700, maxChars: 4000 },
      steps: [
        {
          id: "writing-11-dialectic-sides",
          title: t("Both Sides and Their Conditions", "一分为二，看条件"),
          explanation: t(
            "Many questions have no answer that holds always. **Weigh both sides**: what speed gains and what it loses, what slowness gives and what it costs. Then ask **under what conditions** each holds: speed in an emergency, slowness in learning a craft. Conditions turn a vague *both are good* into thinking.",
            "很多问题没有永远成立的答案。要**一分为二**：快得到了什么、失去了什么，慢给了什么、代价是什么。再问每一方面在**什么条件下**成立：紧急时要快，学手艺要慢。有了条件，含糊的“两者都好”才变成真正的思考。",
          ),
          question: t(
            "Write an essay in Chinese on the question below. Weigh both sides, and the conditions under which each holds, in clearly linked steps.",
            "就下面的问题，用中文写一篇作文。分析两方面以及各自成立的条件，推理环环相扣。",
          ),
          criteria: ["zh11-dialectic-sides", "zh11-dialectic-reasoning"],
        },
        {
          id: "writing-11-dialectic-position",
          title: t("A Position of Your Own", "得出自己的结论"),
          explanation: t(
            "Weighing both sides is the road, not the destination. End at **a position of your own** that takes both into account: not *快和慢各有道理*, but *该快的地方快，才换得来该慢的地方慢*. Mark where the argument turns with *当然*, *但是*, *只有……才……*.",
            "分析两方面是路，不是终点。最后要得出**自己的结论**，并且把两方面都考虑进去：不是“快和慢各有道理”，而是“该快的地方快，才换得来该慢的地方慢”。论证转折的地方，用“当然”“但是”“只有……才……”标出来。",
          ),
          question: t(
            "Write an essay in Chinese on the question below. Reach a reasoned position of your own that takes both sides into account.",
            "就下面的问题，用中文写一篇作文。得出考虑到两方面的、自己的结论。",
          ),
          criteria: ["zh11-dialectic-position", "zh11-dialectic-sides"],
        },
      ],
    }),
  },
  {
    grade: 11,
    topic: judged({
      id: "writing-11-proposal",
      title: t("Writing a Proposal", "写倡议书"),
      summary: t(
        "Write a proposal (倡议书) in Chinese in its proper form, with the background and reasons, concrete actions and a call to act.",
        "用中文按格式写一份倡议书：说明背景和理由，提出具体可行的做法，发出号召。",
      ),
      prerequisites: ["writing-8-speech", "writing-4-letter"],
      encompasses: [{ topic: "writing-4-letter", weight: 0.2 }],
      xp: 24,
      criteria: ["zh11-proposal-form", "zh11-proposal-reason", "zh11-proposal-actions"],
      bank: proposalBank,
      limits: { minWords: 450, maxChars: 3000 },
      steps: [
        {
          id: "writing-11-proposal-form",
          title: t("Form and Reasons", "格式和理由"),
          explanation: t(
            "A proposal has a set form: the title *倡议书* in the middle of the first line, the people addressed (*亲爱的同学们：*), the body, and the proposer and the date at the end. The body starts with the **background and reasons**: what the problem is and why acting matters, so that readers want to join.",
            "倡议书有固定的格式：第一行正中写标题“倡议书”，下一行写称呼（“亲爱的同学们：”），然后是正文，最后写倡议人和日期。正文先写**背景和理由**：问题是什么，为什么要行动，让读者愿意响应。",
          ),
          question: t(
            "Write the proposal below in Chinese, in the form of a proposal, explaining its background and reasons.",
            "用中文写下面这份倡议书，注意格式，写清楚背景和理由。",
          ),
          criteria: ["zh11-proposal-form", "zh11-proposal-reason"],
        },
        {
          id: "writing-11-proposal-actions",
          title: t("Concrete Actions", "具体可行的倡议"),
          explanation: t(
            "*大家要节约用水* is a wish, not a proposal. Give **concrete, feasible actions**, set out one by one: *一、洗手时随手关紧水龙头；二、……*. Each should be something a reader could do tomorrow. End with a **call to act** that gathers them.",
            "“大家要节约用水”只是愿望，不是倡议。要提出**具体可行的做法**，一条一条列出来：“一、洗手时随手关紧水龙头；二、……”每一条都应该是读者明天就能做到的。最后用一句**号召**把大家凝聚起来。",
          ),
          question: t(
            "Write the proposal below in Chinese. Set out concrete, feasible actions, and end with a call to act.",
            "用中文写下面这份倡议书。逐条提出具体可行的做法，最后发出号召。",
          ),
          criteria: ["zh11-proposal-actions", "zh11-proposal-reason"],
        },
      ],
    }),
  },
];

/** gaokaoEssayTopic is the essay of the Gaokao: practice-only, as every topic of the exam course is. */
export const gaokaoEssayTopic: TopicDef = judged(
  {
    id: "gaokao-essay",
    title: t("Gaokao: The Essay", "高考：作文"),
    summary: t(
      "Write the 800-character essay of the Gaokao on given material: an apt thesis, a well-organised whole and an argument of substance.",
      "按高考作文的要求，根据材料写一篇不少于 800 字的文章：立意准确，结构完整，论证有分量。",
    ),
    prerequisites: ["writing-11-dialectic", "writing-10-commentary"],
    encompasses: [
      { topic: "writing-10-material", weight: 0.3 },
      { topic: "writing-11-dialectic", weight: 0.3 },
    ],
    xp: 32,
    criteria: ["zhgk-essay-thesis", "zhgk-essay-structure", "zhgk-essay-argument"],
    bank: essayBank,
    limits: { minWords: 800, maxChars: 4500 },
    steps: [
      {
        id: "gaokao-essay-whole",
        title: t("Thesis and Structure", "立意和结构"),
        explanation: t(
          "The essay is judged first on whether it **answers the prompt**: read the material, find what it sets you to think about, and state an apt thesis in your title or opening. Then build a **whole**: an opening that states the view, body paragraphs that each do one job, and a conclusion that gathers them, in about 800 characters.",
          "高考作文首先看是否**切合题意**：读懂材料，找出它要你思考的问题，在标题或开头亮出准确的立意。然后搭好**结构**：开头提出观点，主体每一段承担一项任务，结尾总收全文，全文 800 字左右。",
        ),
        question: t(
          "Write the essay below in Chinese, of at least 800 characters. State an apt thesis, and organise the whole clearly.",
          "按下面的要求，用中文写一篇不少于 800 字的作文。立意准确，结构清晰完整。",
        ),
        criteria: ["zhgk-essay-thesis", "zhgk-essay-structure"],
      },
      {
        id: "gaokao-essay-argument",
        title: t("An Argument of Substance", "论证有分量"),
        explanation: t(
          "What lifts an essay is **substance**: apt evidence, each piece analysed, and reasoning that goes past the obvious, asking why, under what conditions, and what follows. A string of famous names with no analysis is padding; one example thought through is worth three listed.",
          "让作文出彩的是**分量**：论据恰当，每一个都经过分析；推理不停留在显而易见的地方，追问为什么、在什么条件下、由此会怎样。一串名人名字而没有分析，只是堆砌；一个想透了的例子，胜过三个罗列的例子。",
        ),
        question: t(
          "Write the essay below in Chinese, of at least 800 characters. Argue with substance: apt evidence, analysed.",
          "按下面的要求，用中文写一篇不少于 800 字的作文。论证要有分量：论据恰当，并加以分析。",
        ),
        criteria: ["zhgk-essay-argument", "zhgk-essay-thesis"],
      },
    ],
  },
  true,
);
