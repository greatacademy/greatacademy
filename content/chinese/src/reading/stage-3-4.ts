// The reading topics of grades 3 and 4 (docs/chinese-curriculum.md §18.9): fairy tales, fables, poems, key words and
// sentences, the main idea and popular science in grade 3; myths, folk tales, narratives, the feeling of a text,
// everyday texts and skimming in grade 4. Each topic asks two knowledge points of its ten or more texts, three questions
// a text, and each comes after the recognition batch by which nearly every character of its texts has been taught.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { byLesson, stageReadingTopics } from "./stage-1-2.ts";
import { FABLES_3, FAIRY_TALES_3, POEMS_3 } from "./texts-3a.ts";
import { KEY_SENTENCES_3, MAIN_IDEA_3, SCIENCE_3 } from "./texts-3b.ts";
import { FOLK_TALES_4, MYTHS_4, NARRATIVES_4 } from "./texts-4a.ts";
import { EVERYDAY_4, FEELINGS_4, SKIMMING_4 } from "./texts-4b.ts";
import { PASSAGE, POEM, quoted, type ReadingSpec, SIGN, readingTopicOf as topicOf, type Wording } from "./topic-kit.ts";

/** bare is a sentence without its closing mark, to be quoted inside another sentence. */
const bare = (text: string): string => text.replace(/[。！？]+$/u, "");

/** byGist words a question on what a whole text or a part of it is about: read it whole, and choose what covers it all. */
export const byGist: Wording = (q) => ({
  heads: {
    find: t("**Step 1: read the whole of what is asked about.**", "**第一步：把问到的部分读完整。**"),
    choose: t("**Step 2: choose what covers all of it.**", "**第二步：选出能概括全部的一项。**"),
  },
  find: t(
    `The question asks: ${q.ask.en} Do not stop at the first sentence; read to the end of the part asked about, where it says ${quoted(q.clue, "en")}`,
    `题目问的是：${q.ask["zh-CN"]}不要只看第一句，要把问到的部分读完，那里说：${quoted(q.clue, "zh-CN")}`,
  ),
  choose: t(
    `The answer must take in every part, not one detail, and must agree with these words: “${q.right}”.`,
    `答案要说到每一部分，而不是其中一件事，还要和这句话一致：“${q.right}”。`,
  ),
  check: t(
    `Read the part again with the answer, “${q.right}”, in mind: each sentence fits under it, and it says nothing the text does not.`,
    `心里想着答案“${q.right}”，再读一遍：每一句都能放进这个意思里，答案也没有说文中没有的内容。`,
  ),
});

/** byFeeling words a question on how a character feels: find what the character says and does, and say what it shows. */
export const byFeeling: Wording = (q) => ({
  heads: {
    find: t("**Step 1: find the words that show the feeling.**", "**第一步：找到表现心情的话。**"),
    choose: t("**Step 2: say what those words show.**", "**第二步：想想这些话说明了什么。**"),
  },
  find: t(
    `A feeling is shown by what a character says, does and looks like. The question asks: ${q.ask.en} Look at the words: ${quoted(q.clue, "en")}`,
    `人物的心情，从他说的话、做的事和样子里看得出来。题目问的是：${q.ask["zh-CN"]}看这句话：${quoted(q.clue, "zh-CN")}`,
  ),
  choose: t(`Ask what someone who says or does this feels: “${q.right}”.`, `想一想，这样说、这样做的人心里是什么感受：“${q.right}”。`),
  check: t(
    `Put yourself in the character's place at that moment and read “${bare(q.clue)}” again: “${q.right}” is just how one would feel.`,
    `把自己当成那时的人物，再读一遍“${bare(q.clue)}”：心里正是“${q.right}”。`,
  ),
});

/** byContext words a question on a word: read its sentence, and try the meaning in its place. */
export const byContext: Wording = (q) => ({
  heads: {
    find: t("**Step 1: read the word in its sentence.**", "**第一步：把词放回句子里读。**"),
    choose: t("**Step 2: choose the meaning that fits there.**", "**第二步：选出放在这里讲得通的意思。**"),
  },
  find: t(
    `The question asks: ${q.ask.en} Read the whole sentence: ${quoted(q.clue, "en")}`,
    `题目问的是：${q.ask["zh-CN"]}把整句话读一读：${quoted(q.clue, "zh-CN")}`,
  ),
  choose: t(
    `Ask what the words must mean for the sentence to make sense, with what comes before and after: “${q.right}”.`,
    `联系前后的话想一想，这个词是什么意思，句子才讲得通：“${q.right}”。`,
  ),
  check: t(
    `Say the sentence again with “${q.right}” in place of the words: it still makes sense and says the same thing.`,
    `用“${q.right}”替换句中的词再读一遍：句子讲得通，意思也没有变。`,
  ),
});

/** byKeySentence words a question on a key sentence: find the sentence the others serve, and answer by it. */
export const byKeySentence: Wording = (q) => ({
  heads: {
    find: t("**Step 1: find the sentence the others serve.**", "**第一步：找到其他句子都围绕着的那一句。**"),
    choose: t("**Step 2: answer by it.**", "**第二步：照着它回答。**"),
  },
  find: t(
    `A key sentence sums up what the other sentences of a paragraph tell, and stands most often at its start or its end. The question asks: ${q.ask.en} Here the key sentence is ${quoted(q.clue, "en")}`,
    `关键句概括了一段里其他句子写的内容，常常在段首或段尾。题目问的是：${q.ask["zh-CN"]}这一段的关键句是：${quoted(q.clue, "zh-CN")}`,
  ),
  choose: t(
    `Every other sentence tells one part of what it says. So the answer is “${q.right}”.`,
    `其他句子各写了它的一个方面。所以答案是“${q.right}”。`,
  ),
  check: t(
    `Read the other sentences one by one and ask whether each fits under “${bare(q.clue)}”: they all do, and “${q.right}” agrees with that.`,
    `把其他句子一句一句地读，问问它们是不是都围绕着“${bare(q.clue)}”写：都是，和答案“${q.right}”一致。`,
  ),
});

/** SPECS are the reading topics of grades 3 and 4, in order. */
const SPECS: readonly ReadingSpec[] = [
  {
    grade: 3,
    id: "reading-3-fairy-tales",
    title: t("Fairy Tales: the Gist", "读童话：复述大意"),
    summary: t(
      "Fairy tales written for the subject: telling back what a tale is about, in order, and how its characters feel.",
      "读为本学科写的童话：按顺序说出故事的大意，体会人物的心情。",
    ),
    intro: t(
      "To tell back the gist of a tale is to say, in a sentence or two, who did what and how it ended, in the order it happened. A hedgehog carries fruit home, meets a squirrel crying over its lost store, and gives it all away: that is the gist; the colour of the fruit is not.\n\nA tale also shows how its characters feel, by what they say and do: the squirrel “擦干眼泪，笑了”, so it is happy now. The first knowledge point asks the gist, the second how a character feels.",
      "复述童话的大意，就是用一两句话，按事情发生的顺序，说清谁做了什么，结果怎么样。小刺猬背着果子回家，遇到丢了存粮在哭的小松鼠，把果子全送给了它：这就是大意；果子是什么颜色，不是大意。\n\n童话还会通过人物说的话、做的事，写出他们的心情：小松鼠“擦干眼泪，笑了”，说明它现在高兴了。第一个知识点问大意，第二个问人物的心情。",
    ),
    data: FAIRY_TALES_3,
    kind: PASSAGE,
    after: "reading-2-fairy-tales",
    points: [
      [
        "gist",
        t("The Gist", "故事的大意"),
        t(
          "The gist says who did what and how it turned out, in order. Find the beginning, the turn and the end, and join them.\n\nIn the tale of the kite, the kite blames its string, the string lets go, the kite falls into a tree and learns the string kept it steady: that is the gist in order.\n\n> **Watch out.** An option may be true but only one part of the tale, such as “the kite flew higher and higher”, or tell its parts in the wrong order. The gist covers the whole, in order.",
          "大意要说清谁做了什么、结果怎么样，还要按顺序。先找出开头、经过和结果，再连起来说。\n\n比如风筝的故事：风筝怪线拉着她，线松开了，风筝掉进树枝里，才明白是线让她飞得稳。这就是按顺序说的大意。\n\n> **注意。** 有的选项说的是真的，却只是故事的一部分，比如“风筝越飞越高”；有的把先后顺序说反了。大意要说到全部，还要按顺序。",
        ),
        byGist,
      ],
      [
        "feelings",
        t("How a Character Feels", "人物的心情"),
        t(
          "A feeling is shown by what a character says and does, and by how they look. Find those words and ask what they show.\n\nIn “旧水桶听了，难过地低下头”, the bucket hangs its head: it is sad.\n\n> **Watch out.** A feeling can change in a tale. Read the words of the moment the question asks about, not those of another moment: the kite is happy when the string lets go, and afraid when it is caught in the tree.",
          "人物的心情，从他说的话、做的事和样子里看出来。找到这些话，想想它们说明了什么。\n\n比如“旧水桶听了，难过地低下头”，低下头，说明旧水桶很难过。\n\n> **注意。** 故事里人物的心情会变。要看题目问的那个时候的话，别看成别的时候的：线松开时风筝高兴极了，挂在树上时她又冷又怕。",
        ),
        byFeeling,
      ],
    ],
  },
  {
    grade: 3,
    id: "reading-3-fables",
    title: t("Fables and Their Lessons", "读寓言：故事和道理"),
    summary: t(
      "Fables retold from old tales: what happened in them, and the lesson their ending teaches.",
      "读改写的古代寓言：故事里发生了什么，故事的结果讲了什么道理。",
    ),
    intro: t(
      "A fable tells a short story to teach a lesson. A man of Chu praises his shield, which nothing can pierce, and then his spear, which pierces anything. Someone asks what happens if his spear strikes his shield, and he has no answer.\n\nRead a fable first for what happened, then ask why it ended so: what he said of the spear undid what he said of the shield. The lesson is that why, said for everyone: what we say must hold together. The first knowledge point asks what happened, the second the lesson.",
      "寓言用一个小故事讲一个道理。楚国有个人夸自己的盾什么都戳不穿，又夸自己的矛什么都能戳穿。有人问他用矛戳盾会怎么样，他答不上来。\n\n读寓言，先弄清发生了什么，再想想为什么会这样：他夸矛的话，推翻了他夸盾的话。把这个“为什么”说成对大家都有用的话，就是道理：说话要前后一致。第一个知识点问发生了什么，第二个问讲了什么道理。",
    ),
    data: FABLES_3,
    kind: PASSAGE,
    after: "reading-2-fables",
    points: [
      [
        "happened",
        t("What Happened", "发生了什么"),
        t(
          "Find the sentence of the fable that tells what the question asks, then choose the option that says the same.\n\nIn the fable of the bell, what was the man's plan? “把自己的耳朵捂住”: to cover his own ears.\n\n> **Watch out.** Keep to what the fable says. An option may sound sensible, such as wrapping the bell up, but if the fable does not say it, it is wrong.",
          "在寓言里找到说题目问的那件事的句子，再选和它说的一样的选项。\n\n比如掩耳盗铃，问这个人想了什么办法，句子说“把自己的耳朵捂住”。\n\n> **注意。** 要按寓言里写的选。有的选项听起来有道理，比如把铃铛包起来，可寓言里没有这样写，就不对。",
        ),
      ],
      [
        "lesson",
        t("The Lesson", "寓言的道理"),
        t(
          "The lesson comes from the ending: ask what the character did, how it turned out and why, and say the why for everyone.\n\nThe man who drove north to reach the south said his horse was fast and his money plenty; the better they were, the farther he got from Chu. Why? His direction was wrong. The lesson: first be sure of the way; on the wrong way, the better the means, the farther the goal.\n\n> **Watch out.** A lesson is not one fact of the story, such as “his horse was fast”, nor the opposite of how it ends. It must explain why the story ended as it did.",
          "道理从结果里来：想一想人物做了什么，结果怎么样，为什么，再把这个“为什么”说成对大家都有用的话。\n\n比如南辕北辙：那个人说马快、钱多，可条件越好，离楚国越远。为什么？方向错了。道理是：做事先要看准方向，方向错了，条件越好离目标越远。\n\n> **注意。** 道理不是故事里的一件事，比如“他的马跑得快”，也不能和故事的结果相反。它要能说明故事为什么是这样的结果。",
        ),
        byLesson,
      ],
    ],
  },
  {
    grade: 3,
    id: "reading-3-poems",
    title: t("Poems: Picture and Meaning", "读诗：想象画面，领悟大意"),
    summary: t(
      "Children's poems written for the subject: the picture their lines paint, and what the whole poem means.",
      "读为本学科写的儿童诗：想象诗句描绘的画面，领悟整首诗的意思。",
    ),
    intro: t(
      "A poem paints a picture with few words. In “屋顶戴上了白帽子，大树穿上了白棉袄”, picture the roofs and trees after snow: white everywhere, as if dressed in white.\n\nThen ask what the whole poem says: here, a snowy morning when the world has turned white, and the joy of the child who runs out. The first knowledge point asks the picture of the lines, the second the meaning of the poem.",
      "诗用不多的字画出一幅画。读“屋顶戴上了白帽子，大树穿上了白棉袄”，想象雪后的屋顶和大树：到处白白的，好像穿戴上了白色的衣帽。\n\n再想想整首诗说了什么：下雪的早晨，世界变白了，跑出门的孩子很快乐。第一个知识点问诗句的画面，第二个问整首诗的意思。",
    ),
    data: POEMS_3,
    kind: POEM,
    after: "reading-1-rhymes",
    points: [
      [
        "picture",
        t("The Picture", "诗句的画面"),
        t(
          "To see the picture, find the line about what the question asks, and imagine what it shows: what is there, its colour, what it does.\n\nIn “穿过金黄的稻田”, the stream passes rice fields that are golden.\n\n> **Watch out.** Poems often speak of things as if they were people: “屋顶戴上了白帽子” means snow on the roof, not a real hat. Picture what is really there.",
          "想象画面，要找到写题目里那样东西的诗句，想想它写了什么：有什么，什么颜色，在做什么。\n\n比如“穿过金黄的稻田”，小溪流过的稻田是金黄的。\n\n> **注意。** 诗常把东西当成人来写：“屋顶戴上了白帽子”说的是屋顶积了雪，不是真的帽子。要想象真正的景物。",
        ),
      ],
      [
        "meaning",
        t("The Meaning", "诗的大意"),
        t(
          "The meaning of a poem takes in all its lines: what it is about, and the feeling it shows. Read it to the end, and join what each part says.\n\n“春雨” tells where the rain falls, and then the rain says it has no colour but gave colour to all: the poem praises the rain that makes everything colourful.\n\n> **Watch out.** One line is not the meaning of the poem. “春雨落在柳树上” is true, but it is only a part.",
          "诗的大意要说到所有诗句：写了什么，表达了什么感情。要读到最后，把每一部分连起来想。\n\n比如《春雨》，先写春雨落在哪里，再写春雨说自己没有颜色，却把颜色送给了大家：这首诗赞美让万物变得五颜六色的春雨。\n\n> **注意。** 一句诗不是整首诗的大意。“春雨落在柳树上”是真的，可只是其中一部分。",
        ),
        byGist,
      ],
    ],
  },
  {
    grade: 3,
    id: "reading-3-key-sentences",
    title: t("Key Words and Sentences", "联系上下文理解词句"),
    summary: t(
      "Paragraphs written for the subject: what a word means from the words around it, and the key sentence that sums a paragraph up.",
      "读为本学科写的段落：联系上下文理解词语的意思，找到概括全段的关键句。",
    ),
    intro: t(
      "A word you do not know is explained by the words around it. In “小蚂蚁们一刻也不停地忙着”, 一刻也不停 is not a quarter of an hour: the ants never stop for a moment.\n\nMany paragraphs also have a key sentence that sums up the rest, often at the start or the end. “奶奶的手很巧。” opens a paragraph that then tells of her knitting, paper-cutting and mending. The first knowledge point asks words from their context, the second the key sentence.",
      "不认识的词，可以联系上下文来理解。“小蚂蚁们一刻也不停地忙着”，“一刻也不停”不是说一刻钟，而是一会儿也不停下。\n\n很多段落还有一个关键句，概括了其他句子写的内容，常在段首或段尾。“奶奶的手很巧。”放在段首，下面写了织毛衣、剪纸和补衣服。第一个知识点联系上下文理解词句，第二个找关键句。",
    ),
    data: KEY_SENTENCES_3,
    kind: PASSAGE,
    after: "reading-2-science",
    points: [
      [
        "context",
        t("A Word From Its Context", "联系上下文理解词语"),
        t(
          "Read the whole sentence, and the one before and after, and ask what the word must mean there.\n\nIn “我的同桌小林是个热心肠”, the next sentences tell how he lends, helps and guides: so 热心肠 means warm-hearted and keen to help.\n\n> **Watch out.** A word's everyday meaning may not fit: 热心肠 is not a warm stomach, and 报信 among ants is not a letter. Choose what fits the sentence.",
          "把整句话读一读，再联系前后的句子，想想这个词在这里是什么意思。\n\n比如“我的同桌小林是个热心肠”，后面写了他借铅笔、帮扫地、送同学，所以“热心肠”是热心帮助别人。\n\n> **注意。** 词语平常的意思不一定讲得通：“热心肠”不是肚子里热，蚂蚁“报信”也不是送信。要选放进句子里讲得通的意思。",
        ),
        byContext,
      ],
      [
        "key",
        t("The Key Sentence", "关键句"),
        t(
          "The key sentence is the one every other sentence of the paragraph serves. Find it by asking of each sentence: is this one part, or is it the whole?\n\nIn the paragraph of the market, the stall-keepers, the fishmonger and the shoppers are each one part; “早上的菜市场真热闹。” is the whole, at the start.\n\n> **Watch out.** A vivid sentence is not the key sentence because it stands out. If it tells only one part, such as the fish slapping its tail, it is not the key sentence.",
          "关键句是其他句子都围绕着写的那一句。找的时候问问每一句：它是说一个方面，还是说全部？\n\n比如写菜市场的一段，卖菜的、卖鱼的、买菜的人各是一个方面，“早上的菜市场真热闹。”说的是全部，在段首。\n\n> **注意。** 写得生动的句子不一定是关键句。如果它只写了一个方面，比如鱼尾巴甩了叔叔一脸水，就不是关键句。",
        ),
        byKeySentence,
      ],
    ],
  },
  {
    grade: 3,
    id: "reading-3-main-idea",
    title: t("The Main Idea", "把握主要内容"),
    summary: t(
      "Short texts of two or three paragraphs written for the subject: the main idea of each paragraph, and of the whole text.",
      "读为本学科写的两三段短文：每一段的主要内容，全文的主要内容。",
    ),
    intro: t(
      "The main idea is what a paragraph or a text is mostly about. Find each paragraph's main idea first, then join them. In “学游泳”, the paragraphs are: at first I sank; I practised every day; after a week I could swim. Joined: over a week of practice I learned to swim.\n\nThe main idea leaves out details, such as the water I swallowed, but misses no part. The first knowledge point asks a paragraph's main idea, the second the whole text's.",
      "主要内容是一段话或一篇文章主要写了什么。先找出每一段的主要内容，再连起来。比如《学游泳》：刚下水往下沉；每天认真练习；一个星期后学会了。连起来就是：“我”经过一个星期的练习，学会了游泳。\n\n主要内容不写细节，比如喝了几口水，但每一部分都要说到。第一个知识点问一段的主要内容，第二个问全文的。",
    ),
    data: MAIN_IDEA_3,
    kind: PASSAGE,
    after: "reading-3-key-sentences",
    points: [
      [
        "paragraph",
        t("The Main Idea of a Paragraph", "一段的主要内容"),
        t(
          "Read the whole paragraph and ask what all its sentences are about together.\n\nIn the second paragraph of “雨后”, the leaves are washed green and the puddles mirror the sky: it is about the leaves and the puddles after rain.\n\n> **Watch out.** One sentence of a paragraph, such as the drops on the leaves, is too narrow; what another paragraph tells is not this one's main idea.",
          "把整段读完，想想这一段的句子合起来写了什么。\n\n比如《雨后》第二段，写树叶被雨洗得绿油油的，水坑像镜子照出蓝天：主要写雨后的树叶和水坑。\n\n> **注意。** 段中的一句，比如叶尖上的水珠，说得太窄了；别的段写的，也不是这一段的主要内容。",
        ),
        byGist,
      ],
      [
        "text",
        t("The Main Idea of a Text", "全文的主要内容"),
        t(
          "Join the main ideas of the paragraphs into a sentence that keeps their order and says how it ends.\n\nIn “借书”: Xiaowen lends me a book; I spill juice on it; I own up and he forgives me. So: I spoiled a borrowed book, owned up honestly, and Xiaowen forgave me.\n\n> **Watch out.** Check the answer against the ending. An option that only repeats a detail, fits only one part, or says the opposite of how the text ends is not its main idea.",
          "把每段的主要内容按顺序连成一句话，还要说出结果。\n\n比如《借书》：小文借给“我”书；“我”把果汁洒在书上；“我”认错，小文原谅了“我”。连起来：“我”弄皱了借来的书，诚实地道歉，小文原谅了“我”。\n\n> **注意。** 要用结尾检查答案。只重复一个细节、只符合一部分、或和结尾相反的选项，都不是全文的主要内容。",
        ),
        byGist,
      ],
    ],
  },
  {
    grade: 3,
    id: "reading-3-science",
    title: t("Popular Science", "读科普短文"),
    summary: t(
      "Short texts of popular science written for the subject: the facts they tell, and the reasons they give.",
      "读为本学科写的科普短文：文中讲的事实，文中给出的原因。",
    ),
    intro: t(
      "A text of popular science tells facts and explains them. “蝙蝠白天倒挂在山洞里睡觉” is a fact. Why do bats not bump into things at night? The text says: they send out a sound and listen to it coming back.\n\nRead such a text for what it says is so, then for why: reasons follow 因为, 这是因为 and 所以, or 是为了 for a purpose. The first knowledge point asks the facts, the second the reasons.",
      "科普短文讲事实，也讲道理。“蝙蝠白天倒挂在山洞里睡觉”是事实。蝙蝠为什么夜里不会撞到东西？短文说：它发出声音，再听弹回来的声音。\n\n读科普短文，先看它说了什么事实，再看为什么：原因常跟在“因为”“这是因为”“所以”后面，目的常用“是为了”。第一个知识点问事实，第二个问原因。",
    ),
    data: SCIENCE_3,
    kind: PASSAGE,
    after: "reading-2-science",
    points: [
      [
        "facts",
        t("Facts", "文中的事实"),
        t(
          "Find the sentence that states the fact the question asks about, and choose the option that says the same.\n\nIn “企鹅生活在很冷很冷的南极”, where do penguins live? At the South Pole.\n\n> **Watch out.** Read the whole sentence: “萤火虫发光，不是为了照路” says the opposite of “to light the way”. A 不 or 不是 changes everything.",
          "找到说题目问的那个事实的句子，选和它说的一样的选项。\n\n比如“企鹅生活在很冷很冷的南极”，问企鹅生活在哪里，答案是南极。\n\n> **注意。** 要把整句读完：“萤火虫发光，不是为了照路”说的正好和“为了照路”相反。一个“不”“不是”，意思就全变了。",
        ),
      ],
      [
        "reasons",
        t("Reasons", "文中的原因"),
        t(
          "A question asking why is answered by the reason the text gives. Look for 因为, 这是因为, 所以 or 是为了, and read the sentence around them.\n\nWhy do we see lightning before we hear thunder? “这是因为光跑得比声音快得多”.\n\n> **Watch out.** Do not take a fact for its reason. That we see lightning first is the fact; that light is faster is the reason.",
          "问“为什么”，要用文中给出的原因回答。找一找“因为”“这是因为”“所以”“是为了”，读读它们前后的句子。\n\n比如为什么先看到闪电后听到雷声？“这是因为光跑得比声音快得多”。\n\n> **注意。** 别把事实当成原因。先看到闪电是事实，光跑得快才是原因。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-myths",
    title: t("Myths", "读神话"),
    summary: t(
      "Old Chinese myths retold for the subject: what happens in them, and what in them is imagined.",
      "读为本学科改写的中国古代神话：神话里发生了什么，哪些是想象出来的。",
    ),
    intro: t(
      "A myth is a story people told long ago to explain the world: how sky and earth were parted, where fire came from. In “后羿射日”, ten suns rise together, the crops wither, and Houyi shoots down nine of them.\n\nRead a myth first for what happens, then for what is imagined: there were never ten suns, but heat that kills crops is real. Ask what the imagined part explains or wishes for. The first knowledge point asks what happens, the second what is imagined.",
      "神话是古时候的人讲来解释世界的故事：天地是怎样分开的，火是从哪里来的。在《后羿射日》里，十个太阳一起出来，庄稼都枯死了，后羿射下了九个。\n\n读神话，先弄清发生了什么，再看哪些是想象出来的：天上从来没有十个太阳，可太热了庄稼会枯死是真的。再想想这样想象是为了说明什么、表达什么愿望。第一个知识点问发生了什么，第二个问神话里的想象。",
    ),
    data: MYTHS_4,
    kind: PASSAGE,
    after: "reading-3-fables",
    points: [
      [
        "happened",
        t("What Happens", "神话里发生了什么"),
        t(
          "Find the sentence of the myth that tells what the question asks, and choose the option that says the same.\n\nIn “精卫填海”, what does Jingwei do every day? “她每天从西山上衔来小石子和小树枝，飞到东海，把它们投进海里”.\n\n> **Watch out.** A myth may tell the same kind of thing twice. Gun blocked the flood and Yu drained it: answer about the one the question names.",
          "在神话里找到写题目问的那件事的句子，选和它说的一样的选项。\n\n比如《精卫填海》，问精卫每天做什么，句子说“她每天从西山上衔来小石子和小树枝，飞到东海，把它们投进海里”。\n\n> **注意。** 神话里可能有两个人做相似的事。鲧用堵的办法，禹用疏通的办法：要回答题目问的那一个。",
        ),
      ],
      [
        "imagined",
        t("What Is Imagined", "神话里的想象"),
        t(
          "What is imagined could not happen in real life; myths use it to explain the world or show a wish. Ask of each option: could this really happen?\n\nPangu's body becomes the mountains and rivers: that is imagined, to explain where they came from. That rain floods the land is real.\n\n> **Watch out.** A myth mixes the real and the imagined. That Yu dug channels to drain the flood could happen; the dragon drawing a river with its tail could not.",
          "想象出来的事，生活中不会真的发生；神话用它来解释世界，或者表达愿望。看每个选项都问一问：这在生活中真的会有吗？\n\n比如盘古的身体变成了山川河流，是想象，用来说明山川河流是怎样来的；下大雨会发大水，是真的。\n\n> **注意。** 神话里真的和想象的混在一起。禹挖河道把水引走，是能做到的；神龙用尾巴划出河道，是想象。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-folk-tales",
    title: t("Folk Tales", "读民间故事"),
    summary: t(
      "Folk tales retold for the subject: what happens in them, and what kind of people they tell of.",
      "读为本学科改写的民间故事：故事里发生了什么，人物是怎样的人。",
    ),
    intro: t(
      "Folk tales were told from one person to the next for a long time before anyone wrote them down. In “鲁班造锯”, Lu Ban cuts his hand on a blade of grass, looks closely, sees its little teeth, and makes the first saw.\n\nRead a folk tale for what happens, and for its people: what they do shows who they are. Lu Ban looks closely at the grass that cut him: he is observant and thinks things through. The first knowledge point asks the story, the second its people.",
      "民间故事在人们嘴里一代一代地讲下来，很久以后才有人把它写下来。在《鲁班造锯》里，鲁班的手被草划破了，他仔细一看，发现草叶边上有小细齿，就造出了锯子。\n\n读民间故事，要弄清发生了什么，也要看人物：人物做的事说明了他是怎样的人。鲁班被草划破了手，还仔细看草叶，说明他善于观察，爱动脑筋。第一个知识点问故事，第二个问人物。",
    ),
    data: FOLK_TALES_4,
    kind: PASSAGE,
    after: "reading-4-myths",
    points: [
      [
        "story",
        t("The Story", "故事的内容"),
        t(
          "Find the sentence of the tale that tells what the question asks, and choose the option that says the same.\n\nIn “年的故事”, why did the villagers flee every New Year's Eve? Nian “每到除夕，就爬上岸来，吃牲口，伤人”.\n\n> **Watch out.** Mind the order of things. In “老鼠嫁女” Father Mouse calls on the sun, the cloud, the wind and the wall, one after the other; the same four in another order are wrong.",
          "在故事里找到写题目问的那件事的句子，选和它说的一样的选项。\n\n比如《年的故事》，问村里人为什么每到除夕要逃走，句子说年“每到除夕，就爬上岸来，吃牲口，伤人”。\n\n> **注意。** 要留心事情的先后。《老鼠嫁女》里老鼠爸爸先后去找太阳、乌云、风和墙；还是这四个，顺序变了就不对。",
        ),
      ],
      [
        "people",
        t("The People of the Tale", "故事里的人物"),
        t(
          "What a character says and does shows what kind of person they are and how they feel. Find those words, and ask what they show.\n\nThe nine-coloured deer leaps into the river to save a drowning man: it is kind and helps whoever is in trouble. Diaoda swears to keep its secret and then sells it for gold: he does not keep his word.\n\n> **Watch out.** Judge by what the character does in the tale, not by what such a figure is like elsewhere: a mouse may be clever in one tale and greedy in another.",
          "人物说的话、做的事，说明了他是怎样的人，心里怎样想。找到这些话，想想它们说明了什么。\n\n比如九色鹿跳进水里救起落水的人，说明它善良，见人有难就救；调达发誓保守秘密，却为了金子把它说了出去，说明他说话不算数。\n\n> **注意。** 要按这个故事里人物做的事来判断，不要按别的故事里的样子：老鼠在这个故事里机灵，在那个故事里也许贪心。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-narrative",
    title: t("Narratives: Retelling and People", "读叙事性作品"),
    summary: t(
      "Narratives written for the subject: what a whole text is about, and what becomes of its people and how they feel.",
      "读为本学科写的记叙文：全文的主要内容，人物的经历和心情。",
    ),
    intro: t(
      "A narrative tells of something that happened to real people, in order. In “一张旧车票”, Grandpa keeps an old ticket the villagers paid for when he left to study; he became a doctor and goes back every year to treat them for nothing.\n\nJoined, that is the gist: Grandpa keeps the ticket the villagers bought him and repays them all his life. Then look at the people: what happens to them and how they feel. The first knowledge point asks the gist, the second the people.",
      "记叙文按顺序写生活中真实的人和事。在《一张旧车票》里，爷爷留着一张旧车票，是他离家上学时乡亲们凑钱买的；后来他当了医生，每年回村给乡亲们看病，不收钱。\n\n连起来，就是主要内容：爷爷留着乡亲们凑钱买的车票，一直报答乡亲。再看人物：他们经历了什么，心情怎样。第一个知识点问主要内容，第二个问人物。",
    ),
    data: NARRATIVES_4,
    kind: PASSAGE,
    after: "reading-3-main-idea",
    points: [
      [
        "gist",
        t("The Gist", "主要内容"),
        t(
          "The gist joins what happened at the start, in the middle and at the end into one sentence, and says how it turned out.\n\nIn “输了的比赛”: our class trains hard; Xiaodong falls in the relay and we come fourth; no one blames him, and he smiles again. So: Xiaodong's fall lost us the race, but no one blamed him, and everyone comforted him.\n\n> **Watch out.** A true detail, such as where Xiaodong fell, is not the gist, nor is the beginning alone. The gist must reach the end.",
          "主要内容要把开头、经过和结果连成一句话，说出事情最后怎么样了。\n\n比如《输了的比赛》：我们班认真练习；小东在接力赛中摔倒，我们得了第四名；大家没有怪他，他又笑了。连起来：小东摔倒让班级输了比赛，大家没有怪他，还安慰他。\n\n> **注意。** 文中真实的细节，比如小东在哪里摔倒，不是主要内容；只说开头也不是。主要内容要说到结果。",
        ),
        byGist,
      ],
      [
        "people",
        t("What Becomes of the People", "人物的经历和心情"),
        t(
          "Find what happens to a person and what they say, do and look like at that moment, and ask what it shows of their feelings and of them.\n\nGreat-grandma “一句话也说不出来，只是抹眼泪” as Grandpa leaves: she cannot bear to see him go.\n\n> **Watch out.** Feelings change as things happen. Xiaodong is sad when he comes back from the race and smiles at the end: answer for the moment the question asks about.",
          "找到人物经历了什么，那时他说了什么、做了什么、是什么样子，想想这说明了他怎样的心情，是怎样的人。\n\n比如爷爷离家时，太奶奶“一句话也说不出来，只是抹眼泪”，说明她舍不得爷爷走。\n\n> **注意。** 人物的心情会随着事情变化。小东刚回来时很难过，最后笑了：要回答题目问的那个时候。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-feelings",
    title: t("The Feeling of a Text", "体会思想感情"),
    summary: t(
      "Short prose written for the subject: the feeling its writer shows, and the words that show it.",
      "读为本学科写的短文：作者表达了什么感情，哪些词句表现了这种感情。",
    ),
    intro: t(
      "Writers show what they feel by what they choose to tell. In “第一场雪”, the writer “一下子愣住了”, forgets breakfast, spins in the snow and does not notice the cold: all of it shows delight.\n\nRead such a text for the feeling first, then find the words that carry it most. A sentence that only tells what is there, such as when it snowed, carries no feeling. The first knowledge point asks the feeling, the second the words that show it.",
      "作者通过写什么、怎么写，表达自己的感情。《第一场雪》里，作者“一下子愣住了”，顾不上吃早饭，在雪地里转了一圈又一圈，连手冻红了都没发觉：这些都表现了惊喜。\n\n读这样的短文，先体会感情，再找出最能表现感情的词句。只写了景物或事情的句子，比如什么时候下的雪，没有表现感情。第一个知识点问感情，第二个问表现感情的词句。",
    ),
    data: FEELINGS_4,
    kind: PASSAGE,
    after: "reading-4-narrative",
    points: [
      [
        "feeling",
        t("What the Writer Feels", "作者的感情"),
        t(
          "Ask how the writer feels about what is told, and find the sentences that say or show it: what the writer does, says and thinks.\n\nIn “我的小书桌”, the writer will not take a new desk and sees Grandpa's smile in the old one: the writer loves and treasures it.\n\n> **Watch out.** A feeling may change within a text. On the dark road the writer is afraid, and at the sight of Mother no longer: answer for the moment asked about.",
          "想一想作者对写的人、事、物有什么感情，找到说出或表现这种感情的句子：作者做了什么、说了什么、想了什么。\n\n比如《我的小书桌》，作者不肯换新书桌，看到旧书桌就像看到爷爷在笑：说明作者喜爱它、珍惜它。\n\n> **注意。** 一篇短文里感情会变。走夜路时作者很害怕，看到妈妈就不怕了：要回答题目问的那个时候。",
        ),
        byFeeling,
      ],
      [
        "words",
        t("The Words That Show It", "表现感情的词句"),
        t(
          "Among the sentences of the text, the ones that show a feeling tell what one does, says or feels inside, or picture it in an image. Ask of each: does it show the feeling, or only tell what is there?\n\n“我心里一下子空了一块” shows the loss; “院子里种着丝瓜和葡萄” only tells what grew there.\n\n> **Watch out.** An image is not to be taken word for word: “心里像开了花” means very glad, not a flower in one's heart.",
          "文中表现感情的句子，常常写人物做了什么、说了什么、心里怎样，或者用一个比方写出感受。读每一句都问一问：它表现了感情，还是只写了景物和事情？\n\n比如“我心里一下子空了一块”表现了失落；“院子里种着丝瓜和葡萄”只是写院子里种了什么。\n\n> **注意。** 比方的话不能照字面理解：“心里像开了花”是高兴极了，不是心里真的开了花。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-everyday-texts",
    title: t("Notices, Announcements and Instructions", "读通知、启事和说明书"),
    summary: t(
      "Notices, instructions, invitations and timetables written for the subject: what they ask one to do, and who, when and where.",
      "读为本学科写的通知、说明、邀请卡和时间表：要做什么，是谁、什么时候、在哪里。",
    ),
    intro: t(
      "Notices, instructions and timetables tell us what to do and when. The autumn outing notice says to meet on the playground at half past seven, bring lunch and water, and go next Friday if it rains.\n\nRead such a text for what it asks of you, and for its facts: who wrote it and to whom, the time and the place. The first knowledge point asks what to do, the second who, when and where.",
      "通知、说明和时间表告诉我们要做什么、什么时候做。秋游通知说：七点半在操场集合，带上午饭和水，如果下雨就改到下周五。\n\n读这样的文字，要弄清它要我们做什么，还要弄清是谁写给谁的、什么时间、什么地点。第一个知识点问要做什么，第二个问谁、什么时候、在哪里。",
    ),
    data: EVERYDAY_4,
    kind: SIGN,
    after: "reading-1-signs",
    points: [
      [
        "do",
        t("What to Do", "要做什么"),
        t(
          "Find the line that answers the question, and take its words exactly: what to do, how much, and what not to do.\n\nThe library rules: if a book is not finished when due, “可以续借一次”.\n\n> **Watch out.** Mind 不要, 请不要 and 不用: “不要带零食和玩具” forbids what an option might say to bring.",
          "找到回答问题的那一行，照着它的话选：做什么、做多少、不能做什么。\n\n比如图书馆须知：书到期没看完，“可以续借一次”。\n\n> **注意。** 留心“不要”“请不要”“不用”：“不要带零食和玩具”，说的正好是不能带。",
        ),
      ],
      [
        "facts",
        t("Who, When and Where", "谁、什么时候、在哪里"),
        t(
          "Who wrote a notice stands at its end, and to whom at its start. Times and places stand by the words 时间, 在 and 到; numbers must be read with what they count.\n\nThe invitation starts “亲爱的小雨” and ends “林林”: Linlin writes to Xiaoyu.\n\n> **Watch out.** A text may give several times: the outing meets at 7:30, leaves at 8 and comes back at 3. Answer the one asked about, and work a question out from the text: no bus before the first one at 6:00.",
          "通知是谁写的，写在最后；写给谁，写在开头。时间和地点常在“时间”“在”“到”这些词旁边；数字要和它数的东西一起看。\n\n比如邀请卡开头是“亲爱的小雨”，最后是“林林”：是林林写给小雨的。\n\n> **注意。** 一份文字里可能有好几个时间：秋游七点半集合，八点出发，三点回来。要回答题目问的那一个；有的题要根据文字想一想：首班车六点，五点半就没有车。",
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "reading-4-skimming",
    title: t("Skimming for the Gist", "略读：粗知大意"),
    summary: t(
      "Texts of several paragraphs written for the subject: what the whole is about, and which paragraph holds an answer.",
      "读为本学科写的几段话的短文：全文讲了什么，要找的内容在哪一段。",
    ),
    intro: t(
      "To skim is to read quickly for the gist, looking at the start of each paragraph. In “骆驼”, the first paragraph names the ship of the desert, the second tells how it goes without water, the third its feet and eyelashes: so the text is about how the camel lives in the desert.\n\nKnowing what each paragraph is about, you can find an answer without reading all of it again: its feet are in the third. The first knowledge point asks the gist, the second where an answer lies.",
      "浏览，就是快速地读，抓住大意，特别要看每一段的开头。《骆驼》第一段讲“沙漠之舟”，第二段讲骆驼耐渴，第三段讲它的脚掌和睫毛：全文讲骆驼为什么能在沙漠里生活。\n\n知道了每一段讲什么，找答案就不用从头再读：骆驼的脚掌，在第三段。第一个知识点问大意，第二个问答案在哪一段。",
    ),
    data: SKIMMING_4,
    kind: PASSAGE,
    after: "reading-4-narrative",
    points: [
      [
        "gist",
        t("The Gist", "全文的大意"),
        t(
          "Read the first sentence of each paragraph, say what each is about, and join them.\n\nIn “神奇的竹子”: it grows fast; it has many uses; pandas eat it. The gist: bamboo grows fast, has many uses, and feeds the panda.\n\n> **Watch out.** What one paragraph tells, such as that pandas eat bamboo, is too narrow for the whole text; and what a paragraph is about is not to be confused with what another paragraph tells.",
          "读每一段的第一句，说出每段讲什么，再连起来。\n\n比如《神奇的竹子》：竹子长得快；用处多；是大熊猫的食物。连起来：竹子长得快、用处多，还是大熊猫的食物。\n\n> **注意。** 一段讲的内容，比如大熊猫爱吃竹子，对全文来说太窄了；问某一段的时候，也不要选成别的段讲的。",
        ),
        byGist,
      ],
      [
        "where",
        t("Where the Answer Lies", "答案在哪一段"),
        t(
          "Recall what each paragraph is about, and go to the one whose subject is what the question asks; then check that the answer is there.\n\nIn “垃圾分类”, the kinds of waste: the second paragraph opens with “垃圾一般分成四类”.\n\n> **Watch out.** A word of the question may appear in several paragraphs. Go by what each paragraph is about, not by a single word.",
          "想一想每一段讲的是什么，找到讲题目问的内容的那一段，再看看答案是不是真的在那里。\n\n比如《垃圾分类》，问垃圾分几类：第二段开头就是“垃圾一般分成四类”。\n\n> **注意。** 题目里的词可能几段里都有。要看每一段主要讲什么，不要只看一个词。",
        ),
      ],
    ],
  },
];

/** stageThreeFourReading are the reading topics of grades 3 and 4, in order, each after the reading before it. */
export const stageThreeFourReading: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of SPECS)
    built.push(
      topicOf(
        spec,
        [...stageReadingTopics, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
