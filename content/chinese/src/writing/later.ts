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

/** worked writes the solution of a task: what to plan, the model as one good answer, and how to check one's own. */
const worked =
  (plan: Text, check: Text) =>
  (model: string): Text =>
    t(
      `**Step 1: plan what to write.** ${plan.en}\n\n**Step 2: write it.** One good answer:\n\n${quoted(model)}\n\n**Check.** ${check.en}`,
      `**第一步：想好要写什么。**${plan["zh-CN"]}\n\n**第二步：写下来。**一篇好的答案：\n\n${quoted(model)}\n\n**检验。** ${check["zh-CN"]}`,
    );

/** Step is one knowledge point of a judged topic: what it teaches, what it asks, the two criteria it judges by, and the plan and the check of its solution. */
interface Step {
  readonly id: string;
  readonly title: Text;
  readonly explanation: Text;
  readonly question: Text;
  readonly criteria: readonly [string, string];
  readonly plan: Text;
  readonly check: Text;
}

/** Judged describes a judged writing topic. */
interface Judged {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro: Text;
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
    intro: spec.intro,
    prerequisites: [...spec.prerequisites],
    encompasses: spec.encompasses,
    xp: spec.xp,
    strand: "writing",
    ...(practiceOnly && { practiceOnly: true }),
    criteria: spec.criteria.map(criterion),
    knowledgePoints: spec.steps.map((s) =>
      point(s.id, s.title, s.explanation, writingGenerator(s.question, spec.bank, s.criteria, spec.limits, worked(s.plan, s.check))),
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
      intro: t(
        "A narrative stands out when everything in it serves one centre. In 《第一次掌勺》 the centre might be how hard it is to cook a meal for the family: the shopping takes a sentence, the burnt first try and the careful second one take the most words, and the trip to the park that afternoon is left out.\n\nThe first knowledge point chooses material for the centre; the second tells the part that shows it best in detail.",
        "记叙文要突出中心，写的一切就都要为一个中心服务。比如《第一次掌勺》，中心可以是给全家做一顿饭有多不容易：买菜一句带过，第一次炒煳了、第二次小心翼翼地重做写得最多，下午去公园的事干脆不写。\n\n第一个知识点围绕中心选材；第二个把最能表现中心的部分写详细。",
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
            "Before writing, decide the **centre**: the one thing the piece is meant to show, such as how a grandfather's patience changed you. Then choose **material** for it. Of all that happened, keep what shows the centre and leave out the rest, however interesting: a story about patience has no room for the football match that afternoon.\n\n> **Watch out.** A title is not yet a centre. 《第一次掌勺》 could be about how hard cooking is, about a parent's daily work, or about growing up; decide which before you choose what to keep.",
            "动笔之前，先想好**中心**：这篇文章要表现的那一点，比如爷爷的耐心怎样改变了你。再围绕中心**选材**。发生过的事情很多，只留下能表现中心的，其余的再有趣也要舍去：写耐心的文章，就容不下那天下午的足球赛。\n\n> **注意。** 题目还不是中心。《第一次掌勺》可以写做饭的难，可以写父母每天的辛苦，也可以写自己长大了；先定下写哪一个，再决定留下什么。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Keep to one clear centre, and choose only material that serves it.",
            "根据下面的要求，用中文写一篇记叙文。中心要明确，只选择能表现中心的材料。",
          ),
          criteria: ["zh7-center-clear", "zh7-center-material"],
          plan: t(
            "Write the centre in one sentence, list what happened, and cross out what does not show the centre.",
            "用一句话写出中心，列出发生过的事，把不能表现中心的划掉。",
          ),
          check: t(
            "Read each paragraph and ask what it does for the centre; one that does nothing comes out.",
            "读每一段，问问它为中心做了什么；什么也没做的就删去。",
          ),
        },
        {
          id: "writing-7-center-emphasis",
          title: t("Detail Where It Matters", "详写和略写"),
          explanation: t(
            "Not every part deserves the same number of words. The part that shows the centre best is told **in detail** (详写): slow it down with actions, words and feelings. The parts that only lead up to it or follow it are told **briefly** (略写), in a sentence or two. A reader remembers what you dwell on.\n\n> **Watch out.** Detail is not length for its own sake. A long account of the walk to the market and two lines for the burnt dish get the proportion backwards.",
            "不是每一部分都要用一样多的笔墨。最能表现中心的部分要**详写**：放慢节奏，写出动作、语言和感受。只是引出它或交代结果的部分要**略写**，一两句话就够了。你在哪里停留，读者就记住哪里。\n\n> **注意。** 详写不是为了凑字数。去菜市场的路上写了一大段，炒煳菜只写两行，详略就颠倒了。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Tell in detail the part that best shows your centre, and the rest briefly.",
            "根据下面的要求，用中文写一篇记叙文。把最能表现中心的部分写详细，其余部分写简略。",
          ),
          criteria: ["zh7-center-emphasis", "zh7-center-clear"],
          plan: t(
            "Mark the part that shows the centre best, to be told in detail, and plan its actions, words and feelings; give the other parts a sentence or two each.",
            "标出最能表现中心、要详写的部分，想好其中的动作、语言和感受；其余部分各用一两句话。",
          ),
          check: t(
            "Compare the lengths: the part that shows the centre is the longest, and the parts around it are short.",
            "比一比篇幅：最能表现中心的部分最长，前后的部分都很简短。",
          ),
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
      intro: t(
        "A telling detail is a small thing seen up close that says something large. In 《那双磨破的球鞋》, a toe worn through and mended twice with thread of another colour can show a whole season of practice, and a mother's care, without one word of praise.\n\nThe first knowledge point writes a detail precisely; the second chooses details for what they reveal.",
        "细节是凑近了看到的小地方，却能说出大的意思。比如《那双磨破的球鞋》：鞋尖磨穿了，用别的颜色的线补过两次，不用一句夸奖，就写出了一整个赛季的苦练和妈妈的细心。\n\n第一个知识点把细节写细；第二个选能表现人物的细节。",
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
            "A **detail** is a small thing seen up close: the way a hand grips a cup, a word said too quickly, a button sewn on with thread of the wrong colour. Write it precisely. *妈妈很累* is general; *妈妈靠在门框上，鞋也没换，手里的钥匙半天没放下* is a detail.\n\n> **Watch out.** A detail is still part of a whole. One sharp sentence with no event around it is a sketch, not a narrative: set it inside what happened.",
            "**细节**是凑近了看到的小地方：一只手怎样握着杯子，一句说得太快的话，一颗用不同颜色的线缝上的扣子。要把它写准确。“妈妈很累”是笼统的；“妈妈靠在门框上，鞋也没换，手里的钥匙半天没放下”才是细节。\n\n> **注意。** 细节仍是全文的一部分。一句写得很细的话，周围没有事情，只是片段，不是记叙文：要把它放进完整的事情里。",
          ),
          question: t(
            "Write in Chinese on the task below. Include at least one closely observed detail, written precisely, within a whole event.",
            "根据下面的要求，用中文写一篇文章。在完整的事情中，至少写出一个细致准确的细节。",
          ),
          criteria: ["zh7-detail-telling", "zh7-detail-whole"],
          plan: t(
            "Choose the event and the moment in it worth seeing up close; note the exact action, object or words you will write.",
            "选好事情，再找出其中值得凑近看的一刻；记下要写的那个动作、物件或那句话。",
          ),
          check: t(
            "Find the detail and ask whether a reader could picture it exactly, and whether it sits inside a whole event.",
            "找出细节，问一问：读者能不能准确地想象出它？它是不是在一件完整的事情里？",
          ),
        },
        {
          id: "writing-7-detail-meaning",
          title: t("Details That Mean Something", "细节要有意味"),
          explanation: t(
            "A detail earns its place when it **reveals** something: a person's character, a feeling they hide, what the event meant. The keys left in the hand show tiredness without saying so. Choose details for what they show, not for decoration, and the reader will understand more than you state.\n\n> **Watch out.** Do not explain the detail away. After the keys left in her hand, “这说明妈妈很累” tells the reader what they have already seen; let the detail speak.",
            "细节要能**表现**什么，才值得写：人物的性格，他藏着的感情，这件事的意义。手里没放下的钥匙，不说累，却写出了累。选细节要看它能表现什么，而不是为了装饰，读者就能读懂你没有直接说出来的东西。\n\n> **注意。** 不要把细节的意思说破。写了手里没放下的钥匙，再写“这说明妈妈很累”，就是把读者已经看到的又说一遍；让细节自己说话。",
          ),
          question: t(
            "Write in Chinese on the task below. Choose details that reveal character or feeling, not only decorate.",
            "根据下面的要求，用中文写一篇文章。选择能表现人物性格或情感的细节，不要只为了装饰。",
          ),
          criteria: ["zh7-detail-meaning", "zh7-detail-telling"],
          plan: t(
            "Decide what you want the reader to understand about the person, then choose the detail that shows it.",
            "先想好要让读者明白人物的什么，再挑出能表现它的细节。",
          ),
          check: t(
            "Cover the sentence that names the feeling: the detail alone still lets the reader understand it.",
            "把点明情感的句子遮住：只看细节，读者仍然能读懂。",
          ),
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
      intro: t(
        "An explanation in order grasps what makes a thing what it is and leads the reader through it. How tofu is made follows time: soaking the beans, grinding them, boiling the milk, adding the brine, pressing. A library follows space, from the entrance floor by floor. Words such as “首先”, “然后”, “往里走” mark the way.\n\nThe first knowledge point grasps the features and keeps an order; the second keeps the language accurate.",
        "有顺序的说明文，抓住事物之所以是它的特征，带着读者一步步看清它。介绍豆腐的做法按时间顺序：泡豆、磨浆、煮浆、点卤、压制；介绍图书馆按空间顺序，从入口一层一层往上。“首先”“然后”“往里走”这样的词标出路线。\n\n第一个知识点抓住特征、有序说明；第二个让说明语言准确。",
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
            "First find the **features** that make the thing what it is: for a stone arch bridge, its arch and how it bears weight, not the colour of its railings. Then choose an **order**: **space** for a building (from outside to inside), **time** for a process (step by step), **logic** for an idea (from cause to effect, from the general to the particular). Words like *首先*, *接着*, *往里走* show the reader the way.\n\n> **Watch out.** Keep one order for the whole, or for each part. Describing the pressing of tofu before the beans are ground leaves the reader lost.",
            "先找出事物的**特征**，就是它之所以是它的地方：写石拱桥，要写它的拱和它怎样承重，而不是栏杆的颜色。再选一种**顺序**：写建筑用**空间顺序**（由外到内），写过程用**时间顺序**（一步一步），写道理用**逻辑顺序**（由因到果、由总到分）。“首先”“接着”“往里走”这样的词，给读者指路。\n\n> **注意。** 全文或每一部分只用一种顺序。还没磨浆就先写压制，读者就糊涂了。",
          ),
          question: t(
            "Write an explanation in Chinese of the thing below. Grasp its main features and follow a clear order.",
            "用中文写一篇说明文，介绍下面的事物。抓住它的主要特征，按一定的顺序说明。",
          ),
          criteria: ["zh8-explain-feature", "zh8-explain-order"],
          plan: t(
            "List the main features, choose the order that fits the thing, space, time or logic, and note the words that will mark each step.",
            "列出主要特征，选好合适的顺序：空间、时间或逻辑；记下标示每一步的词语。",
          ),
          check: t(
            "Follow the marking words through the piece: the parts come in the order you chose, and each feature is one that makes the thing what it is.",
            "顺着标示顺序的词语读一遍：各部分按选定的顺序排列，写的都是事物的主要特征。",
          ),
        },
        {
          id: "writing-8-explain-accurate",
          title: t("Accurate Language", "说明语言要准确"),
          explanation: t(
            "An explanation must be **true**, and its words must say exactly as much as is true. Where a statement holds only mostly, say so: *一般*, *大约*, *左右*, *几乎*. *熊猫只吃竹子* is wrong; *大熊猫的食物几乎全是竹子* is accurate. A wrong fact costs more than a missing one.\n\n> **Watch out.** Qualifying is not hedging everywhere: “大约” before a figure you know exactly makes it vaguer, not more accurate. Qualify only what is not always true.",
            "说明文必须**真实**，用词要恰好说到事实那么多。一个说法只是大体如此，就要说明：“一般”“大约”“左右”“几乎”。“熊猫只吃竹子”不对；“大熊猫的食物几乎全是竹子”才准确。写错一个事实，比少写一个更糟。\n\n> **注意。** 加限制不是处处含糊：确知的数字前加“大约”，反而不准确了。只给不是一概如此的说法加限制。",
          ),
          question: t(
            "Write an explanation in Chinese of the thing below. Keep the language accurate, qualifying what is not always true.",
            "用中文写一篇说明文，介绍下面的事物。语言要准确，不是一概如此的地方要加限制。",
          ),
          criteria: ["zh8-explain-accurate", "zh8-explain-feature"],
          plan: t(
            "Mark each statement that holds only mostly or roughly, and choose the qualifying word it needs.",
            "标出只是大体如此、大约如此的说法，给每一处选好要加的限制词。",
          ),
          check: t(
            "Read each statement as a fact: it is true as written, no wider and no narrower.",
            "把每句话当作事实来读：写的恰好是真实的，不说大，也不说小。",
          ),
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
      intro: t(
        "A speech is written to be heard, by an audience on an occasion. At a class meeting on single-use plastics: “各位同学：” to begin; one appeal, to use fewer of them, with a figure the listeners can picture and a question put to them; and “谢谢大家！” at the end.\n\nThe first knowledge point addresses the audience with one clear view; the second makes the language easy to follow by ear.",
        "演讲稿是写给某个场合的听众听的。比如在班会上倡议少用一次性塑料制品：开头称呼“各位同学：”；提出一个倡议，就是少用，配上听众想象得出的数字，再向他们提一个问题；结尾说“谢谢大家！”\n\n第一个知识点面向听众，观点鲜明；第二个让语言适合说给人听。",
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
            "A speech is written for **listeners** on an **occasion**. It begins by addressing them, *各位老师、同学们：*, and ends by thanking them. In between, put forward **one view** or appeal, and back it with reasons and examples the listeners know. A speech that tries to say everything is remembered for nothing.\n\n> **Watch out.** The reasons must suit these listeners. To classmates, the lunch boxes your own school throws away after one use count for more than a national figure they cannot picture.",
            "演讲稿是为某个**场合**的**听众**写的。开头要称呼他们：“各位老师、同学们：”，结尾要向他们致谢。中间提出**一个观点**或一个倡议，用听众熟悉的理由和事例来支持它。什么都想说的演讲，最后什么也没让人记住。\n\n> **注意。** 理由要适合这些听众。对同学说，学校里用一次就扔掉的饭盒，比一个他们想象不出来的全国数字更有分量。",
          ),
          question: t(
            "Write the speech below in Chinese. Address your audience, and put forward one clear view with reasons.",
            "用中文写下面这篇演讲稿。称呼听众，提出一个明确的观点并说明理由。",
          ),
          criteria: ["zh8-speech-audience", "zh8-speech-view"],
          plan: t(
            "Name the occasion and the listeners, write the address and the one view, and choose two reasons these listeners know.",
            "想清楚场合和听众，写好称呼和那一个观点，再选两个听众熟悉的理由。",
          ),
          check: t(
            "Find the address at the start and the thanks at the end, and check that every paragraph serves the one view.",
            "开头有称呼，结尾有致谢，中间每一段都为同一个观点服务。",
          ),
        },
        {
          id: "writing-8-speech-spoken",
          title: t("Made to Be Heard", "适合说给人听"),
          explanation: t(
            "Listeners cannot read a sentence twice. Write **short, clear sentences**, speak to them directly (*同学们，你们有没有想过……*), and use devices that work by ear: a **question** to the audience, a phrase **repeated** to drive the point home, a **call to act** at the end.\n\n> **Watch out.** A long sentence of three clauses, “由于……因此……从而……”, reads well but is lost when heard. Break it into two or three short ones.",
            "听众不能把一句话再读一遍。所以句子要**短而清楚**，直接对听众说话（“同学们，你们有没有想过……”），多用适合听的手法：向听众**提问**，**反复**一句话来强调，结尾**号召**大家行动。\n\n> **注意。** “由于……因此……从而……”这样带三个分句的长句，读起来通顺，听起来却跟不上。把它拆成两三个短句。",
          ),
          question: t(
            "Write the speech below in Chinese. Make it easy to follow by ear, speaking to your listeners directly.",
            "用中文写下面这篇演讲稿。要适合说给人听，直接对听众说话。",
          ),
          criteria: ["zh8-speech-spoken", "zh8-speech-view"],
          plan: t(
            "Plan where you will put a question to the audience, which phrase you will repeat, and the call to act at the end.",
            "想好在哪里向听众提问，反复哪一句话，结尾怎样号召大家行动。",
          ),
          check: t(
            "Read it aloud: each sentence can be followed in one hearing, and the question, the repeated phrase and the call to act are there.",
            "把它念出来：每句话听一遍就能明白，提问、反复和号召都在。",
          ),
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
      intro: t(
        "An argument states a claim and proves it with evidence, linked by methods of argument. On “谈专注”: the claim “专注是做成一件事的前提”; an example of someone who succeeded by staying with one thing, then what it proves; a saying, explained; and a contrast with someone who scattered their effort.\n\nThe first knowledge point states the claim and gives it evidence; the second uses methods of argument.",
        "议论文提出论点，用论据来证明，用论证方法把它们连起来。比如“谈专注”：论点是“专注是做成一件事的前提”；举一个人专心做一件事而成功的例子，说明它证明了什么；引一句名言，加以阐释；再拿一个三心二意的人作对比。\n\n第一个知识点提出论点、摆出论据；第二个运用论证方法。",
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
            "An argument has three parts. The **claim** (论点) is what you hold, stated clearly and early: *专注是做成一件事的前提。* The **evidence** (论据) is what supports it: **facts** (examples, events, data you are sure of) and **reasoning** (sayings, principles, common sense). Evidence must bear on the claim itself, not only on the topic.\n\n> **Watch out.** A topic is not a claim. “专注” is a topic, “专注很重要” is a weak claim, and “专注是做成一件事的前提” says something that can be argued.",
            "议论文有三要素。**论点**是你的主张，要尽早明确地提出：“专注是做成一件事的前提。”**论据**是支持它的材料：**事实论据**（事例、事件、确凿的数据）和**道理论据**（名言、道理、常识）。论据要能证明论点本身，而不只是和话题沾边。\n\n> **注意。** 话题不是论点。“专注”是话题，“专注很重要”是空泛的论点，“专注是做成一件事的前提”才说出了可以论证的主张。",
          ),
          question: t(
            "Write an argument in Chinese on the question below. State a clear claim early, and support it with evidence that bears on it.",
            "就下面的问题，用中文写一篇议论文。尽早提出明确的论点，并用切合论点的论据来证明。",
          ),
          criteria: ["zh9-argue-thesis", "zh9-argue-evidence"],
          plan: t(
            "Write the claim as one sentence that can be argued, then choose a fact and a principle that bear on it.",
            "把论点写成一句可以论证的话，再选一个事实论据和一个道理论据，都要切合论点。",
          ),
          check: t(
            "Find the claim in the opening, and ask of each piece of evidence whether it proves the claim itself, not only the topic.",
            "在开头找到论点，问问每个论据证明的是不是论点本身，而不只是话题。",
          ),
        },
        {
          id: "writing-9-argue-methods",
          title: t("Methods of Argument", "论证方法"),
          explanation: t(
            "**Methods** (论证方法) connect evidence to claim. **举例论证**: an example, then what it proves. **道理论证**: a principle or saying, explained. **对比论证**: two cases set side by side, so the difference speaks. **比喻论证**: a comparison that makes the idea clear. Use at least two, and after each, say how it proves the claim.\n\n> **Watch out.** Naming a method is not using it. A contrast sets out both sides and draws the difference: the focused one finished, the scattered one did not, and that is why.",
            "**论证方法**把论据和论点连起来。**举例论证**：举出事例，再说明它证明了什么。**道理论证**：引用道理或名言，并加以阐释。**对比论证**：把两种情况放在一起，让差别说话。**比喻论证**：用比喻把道理讲明白。至少用上两种，每用一种，都要说明它怎样证明论点。\n\n> **注意。** 说出方法的名字不等于用了它。对比论证要把两方面都摆出来，再点明差别：专注的人做成了，分心的人没做成，原因就在这里。",
          ),
          question: t(
            "Write an argument in Chinese on the question below. Use at least two methods of argument, and explain how each proves your claim.",
            "就下面的问题，用中文写一篇议论文。至少用上两种论证方法，并说明每一种怎样证明论点。",
          ),
          criteria: ["zh9-argue-methods", "zh9-argue-thesis"],
          plan: t(
            "Choose two methods, decide which evidence each uses, and plan the sentence after each that ties it to the claim.",
            "选好两种论证方法，想好各用哪个论据，再想好每一处后面把它和论点连起来的那句话。",
          ),
          check: t(
            "Point to the two methods where they appear, and find after each the sentence that says how it proves the claim.",
            "在文中指出这两种方法，并在每一处后面找到说明它怎样证明论点的句子。",
          ),
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
      intro: t(
        "A whole narrative hangs on a thread, comes alive in its key scene, and lets its meaning grow out of what happens. In 《那段坡路》 the slope is the thread: pushed up it as a small child, walking up it alone, running up it to catch a bus. The last climb is told slowly as a scene, and what growing up means is felt before it is named.\n\nThe first knowledge point holds the story on a thread with a key scene; the second lets the theme emerge.",
        "一篇完整的记叙文由线索串起，在关键场面中活起来，意义从事情中生长出来。比如《那段坡路》：坡路就是线索，小时候被推着上坡，后来自己走上坡，再后来跑上坡去赶车。最后一次上坡写成放慢的场面，长大意味着什么，读者在点明之前就感受到了。\n\n第一个知识点用线索串起故事、写好关键场面；第二个让主题自然流露。",
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
            "A longer narrative needs a **thread** (线索) to hold it together: an object that keeps returning (an old bicycle), a feeling that changes, or the passing of time. Each part hangs on it. At the key moment, slow down into a **scene**: what people do and say, what they think, what the place looks and sounds like.\n\n> **Watch out.** A thread must be followed, not mentioned once. If the slope appears in the first paragraph and never again, the parts fall apart.",
            "篇幅长一些的记叙文，需要一条**线索**把它串起来：一件反复出现的东西（一辆旧自行车），一种不断变化的心情，或者时间的推移。每一部分都挂在这条线上。到了关键的时刻，放慢节奏，写成一个**场面**：人物做了什么、说了什么、想了什么，那里是什么样子、有什么声音。\n\n> **注意。** 线索要贯穿全文，不能只提一次。坡路只在第一段出现，后面再也不提，各部分就散了。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Hold it together with a clear thread, and describe its key scene vividly.",
            "根据下面的要求，用中文写一篇记叙文。用清晰的线索把全文串起来，把关键场面写生动。",
          ),
          criteria: ["zh9-story-thread", "zh9-story-detail"],
          plan: t(
            "Choose the thread, list the parts it will join, and pick the key moment to slow down into a scene.",
            "选好线索，列出它要串起的几个部分，挑出要放慢写成场面的关键时刻。",
          ),
          check: t(
            "Find the thread in each part, and read the key scene again: it has actions, words, thoughts and the look or sound of the place.",
            "在每一部分找到线索；再读关键场面：有动作、语言、心理，也有那里的样子或声音。",
          ),
        },
        {
          id: "writing-9-story-theme",
          title: t("Letting the Theme Emerge", "让主题自然流露"),
          explanation: t(
            "The **theme** of a story is what it means. It should grow out of what happens, so that the reader feels it before you name it. The ending may bring it out, with a returning image or one quiet sentence, but a moral tacked on (*从此我明白了一个道理……*) after a story that has not shown it convinces no one.\n\n> **Watch out.** A tacked-on moral is easy to spot: delete the last sentence, and if the story then means nothing, the meaning was never in the story.",
            "故事的**主题**就是它的意义。主题要从事情本身中生长出来，让读者在你点明之前就已经感受到。结尾可以把它点出来，用一个再次出现的形象，或一句平静的话；但如果故事本身没有表现出来，最后硬加一句“从此我明白了一个道理……”，是说服不了人的。\n\n> **注意。** 生硬加上的道理很容易看出来：把最后一句删掉，如果故事就没有了意义，说明意义本来就不在故事里。",
          ),
          question: t(
            "Write a narrative in Chinese on the task below. Let the theme emerge from the story, and bring it out at the end without a moral tacked on.",
            "根据下面的要求，用中文写一篇记叙文。让主题从故事中自然流露，结尾点明主题，不要生硬地加上道理。",
          ),
          criteria: ["zh9-story-theme", "zh9-story-detail"],
          plan: t(
            "Decide what the story means, and choose the events and the returning image that will show it.",
            "先想好故事的意义，再选能表现它的事情和那个再次出现的形象。",
          ),
          check: t(
            "Cover the last sentence: the story still lets the reader feel its meaning, and the ending brings it out without preaching.",
            "把最后一句遮住：故事仍能让读者感受到意义；结尾点出它，而不是说教。",
          ),
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
      intro: t(
        "A material essay draws its view from the material and the task, then argues it in stages. In the material on giving old things new life, the classmates who mend and remake are set against the one who says to buy new, and the teacher's line, “物尽其用，也是一种对待生活的态度”, points the way. A view such as “物尽其用，是对生活的一份尊重” comes from it.\n\nThe first knowledge point draws the view from the material; the second develops the argument in stages.",
        "材料作文从材料和任务中立意，再层层深入地论证。比如“旧物新生”的材料：修补改造旧物的同学，和主张“坏了就换新的”的同学形成对照；老师写的“物尽其用，也是一种对待生活的态度”指明了方向。由此可以立意为“物尽其用，是对生活的一份尊重”。\n\n第一个知识点从材料中立意；第二个让论证层层深入。",
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
            "In a material essay, the view (立意) comes **from the material and the task**. Read what happens in it and what it sets against what, then ask what it invites you to think about. A view that the material does not raise, however good, misses the task. State it in your title or opening, and keep to it.\n\n> **Watch out.** Seizing one phrase is not reading the material. Writing only about saving money, from “东西这么便宜”, misses what the material sets against it; the view must account for the whole.",
            "材料作文的立意来自**材料和任务**。读清楚材料里发生了什么、拿什么和什么对照，再想想它要你思考什么。材料没有涉及的观点，再好也偏离了题意。把立意放在标题或开头，全文都围绕它。\n\n> **注意。** 抓住一句话不等于读懂了材料。只从“东西这么便宜”出发去写省钱，就漏掉了材料拿来对照的另一面；立意要照顾到材料的整体。",
          ),
          question: t(
            "Read the material and write an essay in Chinese as the task asks. Draw your view from the material, and support it with evidence you analyse.",
            "阅读材料，按要求用中文写一篇文章。从材料中提炼观点，并用经过分析的论据来支持它。",
          ),
          criteria: ["zh10-task-material", "zh10-task-evidence"],
          plan: t(
            "Write down what the material sets against what and what the task asks, then state in one sentence a view that answers both.",
            "写下材料拿什么和什么对照、任务要求做什么，再用一句话写出同时回应两者的立意。",
          ),
          check: t(
            "Lay the view beside the material: it follows from the material as a whole, and the essay keeps to it from title to end.",
            "把立意放在材料旁边对照：它是从材料整体得出的，全文从标题到结尾都围绕它。",
          ),
        },
        {
          id: "writing-10-material-depth",
          title: t("Going Deeper in Stages", "层层深入"),
          explanation: t(
            "A strong essay does not repeat its view five times. It goes **deeper in stages**: what the matter is, why it is so, what follows from it or what to do. Each paragraph should move the argument a step, so that the reader ends further on than where they began.\n\n> **Watch out.** Three paragraphs each saying “物尽其用很重要” with a new example stand side by side; they do not go deeper. Ask the next question each time: why does it matter, and what should we do?",
            "好的议论文不是把观点重复五遍，而是**层层深入**：是什么，为什么，怎么办或由此能推出什么。每一段都要让论证前进一步，读者读完时，走得比开头更远。\n\n> **注意。** 三段都在说“物尽其用很重要”，只是换了例子，那是并列，不是深入。每一段都要追问下一个问题：为什么重要？我们该怎么做？",
          ),
          question: t(
            "Read the material and write an essay in Chinese as the task asks. Develop the argument in stages, each paragraph a step further.",
            "阅读材料，按要求用中文写一篇文章。论证要层层深入，每一段都向前推进一步。",
          ),
          criteria: ["zh10-task-depth", "zh10-task-material"],
          plan: t(
            "Plan the stages, what it is, why, and what follows or what to do, and give each stage a paragraph.",
            "想好几个层次：是什么，为什么，怎么办或由此推出什么，每个层次一段。",
          ),
          check: t(
            "Sum up each paragraph in a line: each says something the one before did not.",
            "给每一段写一句概括：每一段都说出了前一段没说的东西。",
          ),
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
      intro: t(
        "A commentary states an event, takes a view and analyses it. On the school rule that phones go into lockers over the midday break: a sentence on what the rule is and how pupils took it; a view, fair to those who complain; why the rule was made, what it gains and what it costs; and a suggestion that follows.\n\nThe first knowledge point states the event and takes a view; the second analyses causes and consequences.",
        "时评叙述事件，表明看法，再加以分析。比如学校规定午休时手机放进收纳柜：用一句话说清规定是什么、同学们有什么反应；提出看法，对抱怨的同学也要公道；再分析为什么这样规定，得到了什么，付出了什么；最后提出从分析中得出的建议。\n\n第一个知识点述事和表态；第二个分析原因，提出建议。",
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
            "A commentary (时评) begins by **stating the event** briefly and as given, without adding facts that change it. Then it takes **a view**: reasoned, fair, without sweeping words like *完全*, *一切* where they do not hold. A reader should be able to disagree with you and still find you fair.\n\n> **Watch out.** Do not change the facts to suit the view. The rule takes phones only over the midday break, so “学校禁止学生带手机” overstates it.",
            "时评开头要**简要叙述事件**，按给出的事实来写，不添加改变事实的内容。接着**表明看法**：有道理，公允，不在不成立的地方用“完全”“一切”这样绝对的词。读者即使不同意你，也会觉得你说得公道。\n\n> **注意。** 不要为了观点改动事实。规定只是午休时收手机，写成“学校禁止学生带手机”就说过头了。",
          ),
          question: t(
            "Write a commentary in Chinese on the event below. State it briefly and accurately, and take one clear, reasoned view.",
            "就下面的事件，用中文写一篇时评。简要准确地叙述它，提出一个明确、有理有据的看法。",
          ),
          criteria: ["zh10-comment-event", "zh10-comment-view"],
          plan: t(
            "Put the event in one or two sentences, as given, and write the view in one sentence, without absolute words that do not hold.",
            "用一两句话按给出的事实写出事件，再用一句话写出看法，不用不成立的绝对化词语。",
          ),
          check: t(
            "Compare your account with the event as given: nothing is added or changed, and the view is one, clear and fair.",
            "把你的叙述和给出的事件对照：没有添加或改动；看法只有一个，明确而公道。",
          ),
        },
        {
          id: "writing-10-commentary-analysis",
          title: t("Causes, Consequences and a Way Forward", "分析原因，提出建议"),
          explanation: t(
            "A view becomes a commentary when it is **analysed**: why has this happened, who gains and who loses, what will follow if it goes on? End with a **reasoned suggestion** or conclusion that follows from the analysis, not a slogan.\n\n> **Watch out.** A slogan is not a suggestion. “让我们共同努力，建设美好校园” follows from nothing; “午休结束前十分钟开柜，方便同学联系家长” follows from the complaint you analysed.",
            "看法经过**分析**，才成为时评：为什么会出现这种情况？谁得益，谁受损？如果继续下去会怎样？结尾提出从分析中得出的**建议**或结论，而不是喊口号。\n\n> **注意。** 口号不是建议。“让我们共同努力，建设美好校园”不是从分析里来的；“午休结束前十分钟开柜，方便同学联系家长”才是从你分析过的抱怨中得出的。",
          ),
          question: t(
            "Write a commentary in Chinese on the event below. Analyse its causes or consequences, and end with a reasoned suggestion.",
            "就下面的事件，用中文写一篇时评。分析它的原因或影响，结尾提出有道理的建议。",
          ),
          criteria: ["zh10-comment-analysis", "zh10-comment-view"],
          plan: t(
            "Ask why it happened, who gains and who loses, and what follows if it goes on; choose the suggestion that answers what you found.",
            "问一问：为什么会这样？谁得益，谁受损？继续下去会怎样？再选出能回应这些分析的建议。",
          ),
          check: t(
            "Trace the suggestion back: it answers a cause or a consequence you analysed, and is not a slogan.",
            "把建议往回追：它回应的是你分析过的某个原因或影响，不是口号。",
          ),
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
      intro: t(
        "A dialectical essay weighs both sides of a two-sided question, asks when each holds, and arrives at a position of its own. On speed and slowness: speed wins in an emergency, slowness in learning a craft; and the position “该快的地方快，才换得来该慢的地方慢” takes both into account.\n\nThe first knowledge point weighs both sides and their conditions; the second reaches a position of your own.",
        "辩证分析的作文要权衡一个问题的两方面，追问各自成立的条件，最后得出自己的结论。比如快与慢：紧急时快更好，学手艺时慢更好；结论“该快的地方快，才换得来该慢的地方慢”，把两方面都考虑进去了。\n\n第一个知识点一分为二、看条件；第二个得出自己的结论。",
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
            "Many questions have no answer that holds always. **Weigh both sides**: what speed gains and what it loses, what slowness gives and what it costs. Then ask **under what conditions** each holds: speed in an emergency, slowness in learning a craft. Conditions turn a vague *both are good* into thinking.\n\n> **Watch out.** Two lists, the good of speed and then the good of slowness, are not yet weighing. Set the two against each other under a condition: when does the gain of one cost the other?",
            "很多问题没有永远成立的答案。要**一分为二**：快得到了什么、失去了什么，慢给了什么、代价是什么。再问每一方面在**什么条件下**成立：紧急时要快，学手艺要慢。有了条件，含糊的“两者都好”才变成真正的思考。\n\n> **注意。** 先列快的好处、再列慢的好处，还不是权衡。要在条件下把两者放在一起比：什么时候一方的得，正是另一方的失？",
          ),
          question: t(
            "Write an essay in Chinese on the question below. Weigh both sides, and the conditions under which each holds, in clearly linked steps.",
            "就下面的问题，用中文写一篇作文。分析两方面以及各自成立的条件，推理环环相扣。",
          ),
          criteria: ["zh11-dialectic-sides", "zh11-dialectic-reasoning"],
          plan: t(
            "For each side, write what it gains, what it costs, and the condition under which it holds.",
            "为每一方面写出它得到的、付出的，以及它成立的条件。",
          ),
          check: t(
            "Find each side and the condition you gave it, and the words that link one step of the reasoning to the next.",
            "找出两方面各自的论述和条件，以及把一步推理接到下一步的词语。",
          ),
        },
        {
          id: "writing-11-dialectic-position",
          title: t("A Position of Your Own", "得出自己的结论"),
          explanation: t(
            "Weighing both sides is the road, not the destination. End at **a position of your own** that takes both into account: not *快和慢各有道理*, but *该快的地方快，才换得来该慢的地方慢*. Mark where the argument turns with *当然*, *但是*, *只有……才……*.\n\n> **Watch out.** “两者都重要” sits on the fence. A position says how the two relate: which comes first, which serves which, or when each should give way.",
            "分析两方面是路，不是终点。最后要得出**自己的结论**，并且把两方面都考虑进去：不是“快和慢各有道理”，而是“该快的地方快，才换得来该慢的地方慢”。论证转折的地方，用“当然”“但是”“只有……才……”标出来。\n\n> **注意。** “两者都重要”是骑墙。结论要说出两者的关系：哪个在先，哪个为哪个服务，或者什么时候各自让步。",
          ),
          question: t(
            "Write an essay in Chinese on the question below. Reach a reasoned position of your own that takes both sides into account.",
            "就下面的问题，用中文写一篇作文。得出考虑到两方面的、自己的结论。",
          ),
          criteria: ["zh11-dialectic-position", "zh11-dialectic-sides"],
          plan: t(
            "Write the position in one sentence that relates the two sides, and mark where the argument will turn.",
            "用一句话写出把两方面联系起来的结论，标出论证转折的地方。",
          ),
          check: t(
            "Find the position at the end: it relates both sides, and follows from the weighing before it.",
            "在结尾找到结论：它说出了两方面的关系，并且是从前面的分析中得出的。",
          ),
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
      intro: t(
        "A proposal sets out a problem, gives reasons, lists actions a reader can take and calls on them to act. On saving water at school: the title “倡议书”, “全校同学们：”, the dripping taps, three numbered actions such as turning taps off fully after washing, a call to act, and the student union with the date at the end.\n\nThe first knowledge point writes the form and the reasons; the second sets out concrete actions.",
        "倡议书提出问题，说明理由，列出读者能做到的做法，再发出号召。比如在校园里节约用水：标题“倡议书”，称呼“全校同学们：”，写一写滴水的龙头，逐条列出“洗手后随手关紧水龙头”等三条做法，发出号召，最后署上学生会和日期。\n\n第一个知识点写好格式和理由；第二个提出具体可行的倡议。",
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
            "A proposal has a set form: the title *倡议书* in the middle of the first line, the people addressed (*亲爱的同学们：*), the body, and the proposer and the date at the end. The body starts with the **background and reasons**: what the problem is and why acting matters, so that readers want to join.\n\n> **Watch out.** The proposer and the date go at the end, on the right; a proposal in the name of the student union is signed by the union, not by you.",
            "倡议书有固定的格式：第一行正中写标题“倡议书”，下一行写称呼（“亲爱的同学们：”），然后是正文，最后写倡议人和日期。正文先写**背景和理由**：问题是什么，为什么要行动，让读者愿意响应。\n\n> **注意。** 倡议人和日期写在末尾右下方；以学生会名义写的倡议书，署名是学生会，不是你自己。",
          ),
          question: t(
            "Write the proposal below in Chinese, in the form of a proposal, explaining its background and reasons.",
            "用中文写下面这份倡议书，注意格式，写清楚背景和理由。",
          ),
          criteria: ["zh11-proposal-form", "zh11-proposal-reason"],
          plan: t(
            "Set out the title, the people addressed, the background and reasons, the body, and the proposer with the date, in that order.",
            "按顺序排好：标题、称呼、背景和理由、正文、倡议人和日期。",
          ),
          check: t(
            "Check the form part by part, then read the reasons as a reader: they say what the problem is and why acting matters.",
            "逐项核对格式；再站在读者的角度读理由：说清了问题是什么、为什么要行动。",
          ),
        },
        {
          id: "writing-11-proposal-actions",
          title: t("Concrete Actions", "具体可行的倡议"),
          explanation: t(
            "*大家要节约用水* is a wish, not a proposal. Give **concrete, feasible actions**, set out one by one: *一、洗手时随手关紧水龙头；二、……*. Each should be something a reader could do tomorrow. End with a **call to act** that gathers them.\n\n> **Watch out.** An action must be one the reader can take. “学校应安装节水龙头” asks the school, not the classmates addressed; ask them for what is in their own hands.",
            "“大家要节约用水”只是愿望，不是倡议。要提出**具体可行的做法**，一条一条列出来：“一、洗手时随手关紧水龙头；二、……”每一条都应该是读者明天就能做到的。最后用一句**号召**把大家凝聚起来。\n\n> **注意。** 倡议要是读者能做的。“学校应安装节水龙头”是向学校提要求，不是对同学们倡议；要倡议他们自己能做到的事。",
          ),
          question: t(
            "Write the proposal below in Chinese. Set out concrete, feasible actions, and end with a call to act.",
            "用中文写下面这份倡议书。逐条提出具体可行的做法，最后发出号召。",
          ),
          criteria: ["zh11-proposal-actions", "zh11-proposal-reason"],
          plan: t(
            "List three or four actions a reader could take tomorrow, number them, and write the call to act that gathers them.",
            "列出三四条读者明天就能做到的做法，编上序号，再写一句把它们凝聚起来的号召。",
          ),
          check: t(
            "Ask of each numbered action whether one reader could take it tomorrow, and find the call to act at the end.",
            "问问每一条：一个读者明天能不能做到？再在结尾找到号召。",
          ),
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
    intro: t(
      "The Gaokao essay is judged on whether its thesis fits the material, whether the whole is well built, and whether the argument has substance. On a museum's wall of unanswered questions: a thesis such as “比答案更珍贵的，是还没有答案的问题”, an opening that states it, body paragraphs that each do one job, and an example analysed rather than a list of famous names.\n\nThe first knowledge point sets the thesis and the structure; the second gives the argument substance.",
      "高考作文看立意是否切合材料、结构是否完整、论证是否有分量。比如科技馆的“问题墙”：立意可以是“比答案更珍贵的，是还没有答案的问题”；开头提出它，主体每一段承担一项任务，用经过分析的例子，而不是罗列名人名字。\n\n第一个知识点确定立意和结构；第二个让论证有分量。",
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
          "The essay is judged first on whether it **answers the prompt**: read the material, find what it sets you to think about, and state an apt thesis in your title or opening. Then build a **whole**: an opening that states the view, body paragraphs that each do one job, and a conclusion that gathers them, in about 800 characters.\n\n> **Watch out.** A thesis that fits any prompt fits none. “要勇于探索” could be written on anything; “留下问题，比留下感想更能让人走得远” answers this wall.",
          "高考作文首先看是否**切合题意**：读懂材料，找出它要你思考的问题，在标题或开头亮出准确的立意。然后搭好**结构**：开头提出观点，主体每一段承担一项任务，结尾总收全文，全文 800 字左右。\n\n> **注意。** 放在哪个题目下都行的立意，就是没有扣住这个题目。“要勇于探索”写什么都能用；“留下问题，比留下感想更能让人走得远”才回应了这面问题墙。",
        ),
        question: t(
          "Write the essay below in Chinese, of at least 800 characters. State an apt thesis, and organise the whole clearly.",
          "按下面的要求，用中文写一篇不少于 800 字的作文。立意准确，结构清晰完整。",
        ),
        criteria: ["zhgk-essay-thesis", "zhgk-essay-structure"],
        plan: t(
          "Name what the material sets you to think about, write the thesis in one sentence, and plan the job of each body paragraph.",
          "说出材料要你思考的问题，用一句话写出立意，再想好主体每一段承担的任务。",
        ),
        check: t(
          "Find the thesis in the title or opening and lay it beside the material; give each paragraph its job in a word, and find the conclusion that gathers them.",
          "在标题或开头找到立意，和材料对照；给每一段用一个词说出它的任务，再找到总收全文的结尾。",
        ),
      },
      {
        id: "gaokao-essay-argument",
        title: t("An Argument of Substance", "论证有分量"),
        explanation: t(
          "What lifts an essay is **substance**: apt evidence, each piece analysed, and reasoning that goes past the obvious, asking why, under what conditions, and what follows. A string of famous names with no analysis is padding; one example thought through is worth three listed.\n\n> **Watch out.** Analysis answers why. After the old craftsman's words, do not stop at “这说明要与时俱进”; say why a change of tool does not change the maker.",
          "让作文出彩的是**分量**：论据恰当，每一个都经过分析；推理不停留在显而易见的地方，追问为什么、在什么条件下、由此会怎样。一串名人名字而没有分析，只是堆砌；一个想透了的例子，胜过三个罗列的例子。\n\n> **注意。** 分析要回答为什么。引了老师傅的话，不能停在“这说明要与时俱进”；要说清为什么换了工具，编的人却没变。",
        ),
        question: t(
          "Write the essay below in Chinese, of at least 800 characters. Argue with substance: apt evidence, analysed.",
          "按下面的要求，用中文写一篇不少于 800 字的作文。论证要有分量：论据恰当，并加以分析。",
        ),
        criteria: ["zhgk-essay-argument", "zhgk-essay-thesis"],
        plan: t(
          "Choose one or two pieces of evidence that bear on the thesis, and for each plan the why, the condition and what follows.",
          "选一两个切合立意的论据，为每一个想好：为什么、在什么条件下、由此会怎样。",
        ),
        check: t(
          "After each piece of evidence, find at least one sentence of analysis that goes past restating the thesis.",
          "在每个论据后面，至少找到一句不只是重复立意的分析。",
        ),
      },
    ],
  },
  true,
);
