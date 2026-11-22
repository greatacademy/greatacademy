// The reading topics of grades 1 and 2 (docs/chinese-curriculum.md §18.9): nursery rhymes, short stories and the words
// around us in grade 1, fables, fairy tales and short texts on nature in grade 2. Each topic asks two knowledge points of
// its ten or more texts, three questions a text, and each comes after the recognition batch by which nearly every
// character of its texts has been taught.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { RHYMES, SIGNS, STORIES } from "./texts-1.ts";
import { FABLES, FAIRY_TALES, NATURE } from "./texts-2.ts";
import {
  endingOf,
  evidenceOf,
  isHan,
  PASSAGE,
  type Piece,
  quoted,
  SIGN,
  readingTopicOf as topicOf,
  VERSE,
  type Wording,
} from "./topic-kit.ts";

/** endsOf are the last characters of the lines of a verse. */
const endsOf = (piece: Piece): string =>
  piece.body
    .split("\n")
    .map((line) => [...line].filter(isHan).at(-1) ?? "")
    .join("、");

/** byRhyme words a question on rhyme: hear the ends of the lines, choose by the sound they share, and read them again. */
const byRhyme: Wording = (q, piece) => {
  const ends = endsOf(piece);
  const first = piece.body.split("\n")[0] ?? "";
  return {
    heads: {
      find: t("**Step 1: hear the ends of the lines.**", "**第一步：听句子末尾的字。**"),
      choose: t("**Step 2: choose by the sound they end in.**", "**第二步：按末尾的音选。**"),
    },
    find: t(
      `A rhyme is heard at the ends of lines. The question asks: ${q.ask.en} Read the verse aloud: its lines end in ${ends}.`,
      `押韵要听句子末尾的字。题目问的是：${q.ask["zh-CN"]}把儿歌读出声来，每句末尾的字是：${ends}。`,
    ),
    choose: t(
      `Say these characters one after another and listen for the sound they end in; those that end alike rhyme. So the answer is “${q.right}”.`,
      `把这几个字连起来读，听它们末尾的音，末尾的音相同的就押韵。所以答案是“${q.right}”。`,
    ),
    check: t(
      `Read the verse again from “${first}”, stressing the last character of each line: the rhyming ones ring alike, and “${q.right}” agrees with what you hear.`,
      `从“${first}”起再读一遍儿歌，把每句末尾的字读得重一点：押韵的字听起来很像，和答案“${q.right}”一致。`,
    ),
  };
};

/**
 * byLesson words a question on what a fable teaches: find how it ends, ask why, and tell it back with the lesson; a
 * lesson the fable leaves unsaid is checked against the whole story, not against words it does not have.
 */
export const byLesson: Wording = (q, piece) => ({
  heads: {
    find: t("**Step 1: find how it turns out.**", "**第一步：找到故事的结果。**"),
    choose: t("**Step 2: ask why.**", "**第二步：想想为什么。**"),
  },
  find: t(
    `A fable teaches by what happens and how it ends. The question asks: ${q.ask.en} The words that show it are: ${evidenceOf(q, "en")}`,
    `寓言用发生的事和故事的结果讲道理。题目问的是：${q.ask["zh-CN"]}说明这一点的话是：${evidenceOf(q, "zh-CN")}`,
  ),
  choose:
    q.reasoning ??
    t(
      `Ask what ${q.evidence.length === 1 ? "these words show" : "these places show together"} about what the character did and why it turned out so: “${q.right}”.`,
      `想一想：${q.evidence.length === 1 ? "这句话" : "这几处合起来"}说明人物做了什么，为什么会有这样的结果？答案是“${q.right}”。`,
    ),
  check: q.inferred
    ? t(
        `The fable does not state its lesson; it is drawn from the story. Take “${q.right}” back to the story and read it to the end, ${quoted(endingOf(piece), "en")} What the character does and how it turns out are both explained by it, so the answer holds.`,
        `寓言没有把道理直接写出来，道理是从故事里悟出来的。把“${q.right}”带回故事里，一直读到结尾${quoted(endingOf(piece), "zh-CN")}人物怎么做、结果怎样，都能用它说清楚，答案站得住。`,
      )
    : t(
        `Put the answer, “${q.right}”, beside the words “${q.clue}”: it is what they show, and it explains how the fable turns out.`,
        `把答案“${q.right}”和“${q.clue}”放在一起读：答案正是这句话说明的，也说清了故事为什么是这样的结果。`,
      ),
});

/** byImagining words a question on what a fairy tale imagines: ask of each option whether it could happen in real life. */
const byImagining: Wording = (q) => ({
  heads: {
    find: t("**Step 1: find it in the tale.**", "**第一步：在童话里找到这件事。**"),
    choose: t("**Step 2: ask whether it could really happen.**", "**第二步：问问它会不会真的发生。**"),
  },
  find: t(
    `What is imagined cannot happen in real life, such as things and animals that talk and feel like people. The question asks: ${q.ask.en} Look at the words: ${quoted(q.clue, "en")}`,
    `想象出来的事，生活中不会真的有，比如东西和动物像人一样说话、有心情。题目问的是：${q.ask["zh-CN"]}看这句话：${quoted(q.clue, "zh-CN")}`,
  ),
  choose: t(
    `Ask of each option: could this happen in real life? By what the question asks, the answer is “${q.right}”.`,
    `问问每个选项：生活中真的会这样吗？按题目问的，答案是“${q.right}”。`,
  ),
  check: t(
    `Ask of the answer, “${q.right}”, once more: could it really happen? If the question asks for what is imagined, it must not; if it asks for what is real, it must. The answer fits what was asked.`,
    `再问一遍答案“${q.right}”：生活中会真的这样吗？题目问想象的事，答案就应该是不会；题目问真的事，答案就应该是会。答案和题目问的一致。`,
  ),
});

/** stageReadingTopics are the reading topics of grades 1 and 2, in order. */
export const stageReadingTopics: readonly GradeTopic[] = [
  topicOf({
    grade: 1,
    id: "reading-1-rhymes",
    title: t("Rhymes and Children's Verse", "读儿歌和儿童诗"),
    summary: t(
      "Short nursery rhymes and children's verse: what a verse says, and which characters rhyme at the ends of its lines.",
      "读短短的儿歌和儿童诗：儿歌说了什么，句子末尾哪些字押韵。",
    ),
    intro: t(
      "A nursery rhyme is short and is meant to be read aloud. Take “小鸟小鸟起得早，飞到树上叫叫叫。” It says what the bird does: it gets up early and sings in a tree. Read aloud, its lines end in 早 and 叫, which end in the same sound, ao: they rhyme, and the rhyme makes the verse easy to remember.\n\nSo read a verse twice. The first time, ask what it says: who is in it, and what they do. The second time, read it aloud and listen to the ends of the lines. The two knowledge points ask these two things.",
      "儿歌短短的，适合读出声来。比如“小鸟小鸟起得早，飞到树上叫叫叫。”它说的是小鸟做了什么：起得早，在树上叫。读出声来，句子末尾的“早”和“叫”末尾的音一样，都是 ao，这就是押韵，押韵让儿歌好读又好记。\n\n所以一首儿歌要读两遍。第一遍想想它说了什么：里面有谁，做了什么。第二遍读出声来，听听句子末尾的字。下面两个知识点问的就是这两件事。",
    ),
    data: RHYMES,
    kind: VERSE,
    points: [
      [
        "says",
        t("What the Verse Says", "儿歌说了什么"),
        t(
          "To answer a question on a verse, find the line that tells it and choose the option that says the same.\n\nIn “春天来，天气暖，小草绿，花儿鲜。” the question “What is the weather like in spring?” is answered by “天气暖”: the weather is warm.\n\n> **Watch out.** Choose what the verse says, not what you know about the world. A cat may love fish, but if the verse says it sleeps late, the answer is that it sleeps late.",
          "回答儿歌的问题，要找到说这件事的那一句，再选和它说的一样的选项。\n\n比如“春天来，天气暖，小草绿，花儿鲜。”问“春天的天气怎么样？”，回答它的是“天气暖”。\n\n> **注意。** 要选儿歌里说的，不是自己知道的。小猫也许爱吃鱼，可是儿歌说它睡懒觉，答案就是睡懒觉。",
        ),
      ],
      [
        "rhyme",
        t("Which Characters Rhyme", "哪些字押韵"),
        t(
          "Characters rhyme when they end in the same sound. In a verse the rhyme is at the ends of the lines.\n\nIn “我的家，真不大，有爸爸，有妈妈。还有一只小花猫，天天陪我说说话。” the lines end in 大, 妈, 猫 and 话. Read them aloud: 大, 妈 and 话 all end in a; 猫 ends in ao, so its line does not rhyme.\n\n> **Watch out.** Listen only to the last character of each line. A character inside a line, such as 家 or 花, may sound like the rhyme, but it is not where a rhyme is heard.",
          "字末尾的音相同，就是押韵。儿歌押韵，在句子的末尾。\n\n比如“我的家，真不大，有爸爸，有妈妈。还有一只小花猫，天天陪我说说话。”每句末尾的字是“大”“妈”“猫”“话”。读出声来：“大”“妈”“话”末尾都是 a，“猫”末尾是 ao，这一句不押韵。\n\n> **注意。** 只听每句最后一个字。句子中间的字，比如“家”“花”，听起来也许很像，但押韵不看它们。",
        ),
        byRhyme,
      ],
    ],
  }),
  topicOf({
    grade: 1,
    id: "reading-1-stories",
    title: t("Short Stories", "读小故事"),
    summary: t(
      "Short stories: who is in them, where they are and what happens, and what a word means in its sentence.",
      "读小故事：故事里有谁、在哪里、发生了什么，从句子里知道词语的意思。",
    ),
    intro: t(
      "A story tells who did what, and where. Take “小鸡跟着妈妈去草地上找虫子。” Who: the chick and its mother. Where: on the grass. What: they look for worms.\n\nA story also uses words you may not know yet. Their sentence tells you what they mean: in “小鸡找了很久，一条也没找到”, 很久 must be a long time, since the chick looked and found nothing. The two knowledge points ask what happens and what a word means.",
      "故事讲的是谁在哪里做了什么。比如“小鸡跟着妈妈去草地上找虫子。”谁：小鸡和妈妈。在哪里：草地上。做什么：找虫子。\n\n故事里还会有不认识的词，句子能告诉你它的意思：“小鸡找了很久，一条也没找到”，“很久”就是很长的时间，因为小鸡找来找去也没找到。下面两个知识点，一个问发生了什么，一个问词语的意思。",
    ),
    data: STORIES,
    kind: PASSAGE,
    points: [
      [
        "happens",
        t("Who, Where and What Happened", "谁、在哪里、发生了什么"),
        t(
          "A question asks who, where or what. Find the sentence of the story that tells it, then choose the option that says the same.\n\nIn “下雨了，小兔没有带伞。”, who has no umbrella? The sentence says: 小兔.\n\n> **Watch out.** Stories have several characters. Check that the option names the one the sentence names, not another one in the story.",
          "题目问谁、在哪里或发生了什么。在故事里找到说这件事的句子，再选和它说的一样的选项。\n\n比如“下雨了，小兔没有带伞。”问谁没有带伞，句子说的是“小兔”。\n\n> **注意。** 故事里常有好几个人物。要看清选项说的，是不是句子里说的那一个。",
        ),
      ],
      [
        "word",
        t("A Word From Its Sentence", "从句子里知道词的意思"),
        t(
          "To know what a word means, read the whole sentence it is in and ask what it must mean there.\n\nIn “小兔没有带伞”, 带 means having something with you, since the rabbit has no umbrella with it; it does not mean a belt here.\n\n> **Watch out.** A word can mean different things in different sentences. Choose the meaning that fits this sentence.",
          "要知道一个词的意思，就读它所在的整句话，想一想它在这里应该是什么意思。\n\n比如“小兔没有带伞”，“带”是随身拿着，因为小兔身边没有伞；这里的“带”不是带子。\n\n> **注意。** 一个词在不同的句子里，意思可能不一样。要选放进这句话里讲得通的意思。",
        ),
      ],
    ],
  }),
  topicOf({
    grade: 1,
    id: "reading-1-signs",
    title: t("The Words Around Us", "读身边的文字"),
    summary: t(
      "The words around us: signs and labels, then timetables, calendars and lists of duties.",
      "读身边的文字：标牌和标签，课程表、日历和值日表。",
    ),
    intro: t(
      "Words are all around us: on signs, on packets, on timetables and on calendars. They are short, and each line tells one thing. Take the sign “开门时间：早上六点到晚上十点”: it tells when the park opens, at six, and when it closes, at ten.\n\nTo read them, find the line that answers your question and read it carefully, number by number. The first knowledge point reads signs and labels, the second timetables and calendars, where a line puts together a time or a day and what happens then.",
      "文字就在我们身边：标牌上、包装上、课程表上、日历上。它们都很短，一行说一件事。比如公园的牌子“开门时间：早上六点到晚上十点”，说的是公园早上六点开门，晚上十点关门。\n\n读这些文字，要找到回答问题的那一行，一个数字一个数字地看清楚。第一个知识点读标牌和标签，第二个读课程表和日历，那里每一行把时间或日子和那时做的事放在一起。",
    ),
    data: SIGNS,
    kind: SIGN,
    points: [
      [
        "signs",
        t("Signs and Labels", "标牌和标签"),
        t(
          "A sign tells you what to do, what not to do, or where something is. Find the line about what the question asks.\n\nIn the sign “请不要摘花”, what must you not do in the park? Pick the flowers.\n\n> **Watch out.** Signs often say 不要 or 不能: read them to the end, so as not to take “do not pick the flowers” for “pick the flowers”.",
          "标牌告诉我们要做什么、不能做什么，或者东西在哪里。找到说题目里那件事的一行。\n\n比如牌子上写着“请不要摘花”，问在公园里不能做什么，答案是摘花。\n\n> **注意。** 标牌上常有“不要”“不能”，要读完整句，别把“不要摘花”看成“摘花”。",
        ),
      ],
      [
        "timetables",
        t("Timetables and Calendars", "课程表和日历"),
        t(
          "In a timetable or a calendar each line pairs a time or a day with what happens then. Find the time or the thing the question names, and read across its line.\n\nIn “第三节　音乐”, the third lesson is music; to ask which lesson is music, find 音乐 and read back to 第三节.\n\n> **Watch out.** The lines look alike. Read the right line, and not the one above or below it.",
          "课程表和日历里，每一行把时间或日子和那时做的事放在一起。先找到题目说的时间或事情，再看同一行。\n\n比如“第三节　音乐”，第三节是音乐课；问音乐课是第几节，就找到“音乐”，再看同一行前面的“第三节”。\n\n> **注意。** 每一行看起来都差不多，要看准是哪一行，别看成上一行或下一行。",
        ),
      ],
    ],
  }),
  topicOf({
    grade: 2,
    id: "reading-2-fables",
    title: t("Fables", "读寓言"),
    summary: t(
      "Fables retold from old tales: what happened in them, and what they teach.",
      "读改写的古代寓言和外国寓言：故事里发生了什么，讲了什么道理。",
    ),
    intro: t(
      "A fable is a short story that teaches something. A farmer sees a hare run into a tree stump and die; he stops working and waits by the stump for another. No hare comes, and weeds cover his field.\n\nRead a fable twice. First ask what happened, as in any story. Then ask why it ended so: the farmer took a lucky chance for something that happens every day. That is what the fable teaches. The two knowledge points ask these two things.",
      "寓言是讲道理的小故事。一个种田的人看见一只兔子撞死在树桩上，从此不再种田，守着树桩等兔子。兔子再也没有来，他的田里长满了野草。\n\n读寓言要读两遍。先像读别的故事一样，想想发生了什么。再想想为什么会有这样的结果：种田的人把碰巧遇到的事当成了天天会有的事。这就是寓言讲的道理。下面两个知识点问的就是这两件事。",
    ),
    data: FABLES,
    kind: PASSAGE,
    after: "reading-1-stories",
    points: [
      [
        "happened",
        t("What Happened", "发生了什么"),
        t(
          "Find the sentence of the fable that tells what the question asks about, then choose the option that says the same.\n\nIn the fable of the stump, how did the hare die? “一头撞在树桩上”: it ran into the stump.\n\n> **Watch out.** Keep to what the fable says. An option may be something that could have happened, such as the farmer killing the hare, which the fable never says.",
          "在寓言里找到说题目问的那件事的句子，再选和它说的一样的选项。\n\n比如守株待兔，问兔子是怎么死的，句子说“一头撞在树桩上”。\n\n> **注意。** 要按寓言里写的选。有的选项是可能发生的事，比如种田的人打死了兔子，可寓言里并没有这样写。",
        ),
      ],
      [
        "teaches",
        t("What It Teaches", "讲了什么道理"),
        t(
          "A fable teaches by its ending. Ask what the character did, how it turned out, and why; the lesson is the why, said for everyone.\n\nThe farmer waited for another hare, and weeds covered his field. Why? He took a lucky chance for something that happens every day. So the fable teaches: do not count on a lucky chance happening again.\n\n> **Watch out.** A lesson is not a fact of the story, such as “hares run fast”. It must explain why the story ended as it did.",
          "寓言用结果讲道理。想一想人物做了什么，结果怎么样，为什么会这样；把这个“为什么”说成对大家都有用的话，就是道理。\n\n种田的人等兔子，田里长满了野草。为什么？他把碰巧遇到的事当成了天天会有的事。所以道理是：不能指望碰巧的事一再发生。\n\n> **注意。** 道理不是故事里的一件事，比如“兔子跑得很快”。它要能说明故事为什么会有这样的结果。",
        ),
        byLesson,
      ],
    ],
  }),
  topicOf({
    grade: 2,
    id: "reading-2-fairy-tales",
    title: t("Fairy Tales", "读童话"),
    summary: t(
      "Fairy tales written for the subject: who wants what, and what in them is imagined.",
      "读为本学科写的童话：谁想要什么，哪些是想象出来的。",
    ),
    intro: t(
      "In a fairy tale, animals and things can think, talk and want things, like people. Take a little fish that wants to fly: it asks a bird to teach it, and the bird says it cannot fly but can swim.\n\nA fairy tale is driven by what someone wants: here, the fish wants to fly. And much of it is imagined: a real fish and bird do not talk. Read a fairy tale asking who wants what, and what could not happen in real life. The two knowledge points ask these two things.",
      "童话里，动物和东西能像人一样想事情、说话、想要东西。比如一条小鱼想飞上天，它请小鸟教它飞，小鸟说它不会飞，可是会游泳。\n\n童话的故事，常常从谁想要什么开始：这里是小鱼想飞。童话里很多事是想象出来的：真的小鱼和小鸟不会说话。读童话，要想想谁想要什么，哪些事生活中不会有。下面两个知识点问的就是这两件事。",
    ),
    data: FAIRY_TALES,
    kind: PASSAGE,
    after: "reading-1-stories",
    points: [
      [
        "wants",
        t("Who Wants What", "谁想要什么"),
        t(
          "Find the sentence that tells what a character wants or does, then choose the option that says the same.\n\nIn “小河里有一条小鱼，它很想飞上天。”, what does the fish want? To fly up into the sky.\n\n> **Watch out.** Several characters may want things. Check whose wish the question asks about.",
          "找到说人物想要什么、做了什么的句子，再选和它说的一样的选项。\n\n比如“小河里有一条小鱼，它很想飞上天。”问小鱼想做什么，答案是飞上天。\n\n> **注意。** 故事里可能好几个人物都想要东西，要看清题目问的是谁。",
        ),
      ],
      [
        "imagined",
        t("What Is Imagined", "哪些是想象的"),
        t(
          "Something is imagined when it cannot happen in real life. Ask of each thing in the tale: could this really happen?\n\nIn “小鸟说：‘你没有翅膀，可是你会游泳呀！’”, a bird talking is imagined; but that a fish swims in a river is real.\n\n> **Watch out.** A fairy tale mixes the real and the imagined. A thing that sounds lovely may still be real, such as a rainbow after rain; ask only whether it could happen.",
          "生活中不会真的发生的事，就是想象出来的。问问童话里的每件事：真的会这样吗？\n\n比如“小鸟说：‘你没有翅膀，可是你会游泳呀！’”，小鸟说话是想象的；小鱼在河里游，却是真的。\n\n> **注意。** 童话里真的事和想象的事是混在一起的。有的事听起来很美，却是真的，比如雨后出彩虹；只看它会不会真的发生。",
        ),
        byImagining,
      ],
    ],
  }),
  topicOf({
    grade: 2,
    id: "reading-2-science",
    title: t("Nature and Things", "读浅近的科普短文"),
    summary: t(
      "Short texts on nature and things: the facts in them, and the reasons they give.",
      "读浅近的科普短文：文中的事实，文中给出的原因。",
    ),
    intro: t(
      "A text on nature tells facts and explains them. Take “中午，太阳高高地在头上，影子就短短的。” The fact: at noon a shadow is short. The reason: the sun is high overhead.\n\nRead such a text asking first what it says is so, and then why. Reasons are often marked by 因为, 所以 or 这是因为. The first knowledge point asks the facts, the second the reasons the text gives.",
      "科普短文告诉我们事实，还讲清原因。比如“中午，太阳高高地在头上，影子就短短的。”事实是：中午的影子短。原因是：太阳高高地在头上。\n\n读这样的短文，先想想它说了什么事实，再想想为什么。原因前面常有“因为”“所以”“这是因为”。第一个知识点问事实，第二个问文中给出的原因。",
    ),
    data: NATURE,
    kind: PASSAGE,
    after: "reading-1-signs",
    points: [
      [
        "facts",
        t("Facts in the Text", "文中的事实"),
        t(
          "Find the sentence that states the fact the question asks about, then choose the option that says the same.\n\nIn “雪花大多有六个角。”, how many points have most snowflakes? Six.\n\n> **Watch out.** Choose by the text, not by a guess. You may think leaves turn yellow in autumn, but if a text says they turn red, the answer is red.",
          "找到说题目问的那个事实的句子，再选和它说的一样的选项。\n\n比如“雪花大多有六个角。”问雪花大多有几个角，答案是六个。\n\n> **注意。** 要按短文选，不能靠猜。也许你觉得秋天的叶子是黄的，可是短文说是红的，答案就是红的。",
        ),
      ],
      [
        "reasons",
        t("The Reason the Text Gives", "文中给出的原因"),
        t(
          "A question asking why is answered by the reason the text gives. Look for 因为, 所以 or 这是因为, and the sentence around them.\n\nIn “这是因为光照不过我们的身体”, why is there a shadow? Light cannot pass through our bodies.\n\n> **Watch out.** Do not swap cause and effect: wind comes from moving air; it is not the leaves moving that makes the wind.",
          "问“为什么”，要用文中给出的原因回答。找一找“因为”“所以”“这是因为”和它们前后的句子。\n\n比如“这是因为光照不过我们的身体”，问为什么会有影子，答案是光照不过我们的身体。\n\n> **注意。** 别把原因和结果弄反：空气动起来才有风，不是树叶动了才有风。",
        ),
      ],
    ],
  }),
];
