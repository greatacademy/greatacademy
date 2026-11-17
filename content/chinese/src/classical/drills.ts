// The drills of classical language (文言) in grades 5 and 6 (docs/chinese-curriculum.md §7): content words and whole
// sentences put into modern Chinese in grade 5, the function words 之, 而, 以 and 于 in grade 6. Every sentence is from
// a classical text in the public domain, most of them from the passages recited in these grades; the meanings, the
// translations and the wrong answers are written for this subject.

import { t } from "@ga/content";

import { type DrillItem, type DrillSpec, drillItem, lines } from "../grammar/drill.ts";

/** ClassicalDrill is a drill topic of classical language without its prerequisites, and its grade. */
export type ClassicalDrill = Omit<DrillSpec, "prerequisites" | "strand"> & { readonly grade: number };

/** items reads lines of a shown sentence, its right answer and three wrong ones. */
const items = (data: string): readonly DrillItem[] =>
  lines(data, 5).map(([shown, right, a, b, c]) => drillItem(shown!, right!, [a!, b!, c!]));

/** others are the usages of a word other than one, which are the wrong answers when that one is right. */
function others(all: readonly string[], one: string): [string, string, string] {
  const rest = all.filter((u) => u !== one);
  if (rest.length !== 3) throw new Error(`classical drill: ${one} among ${all.join("、")}`);
  return rest as [string, string, string];
}

/** usages reads lines of a shown sentence and the number of its usage among a word's four. */
const usages = (data: string, all: readonly string[]): readonly DrillItem[] =>
  lines(data, 2).map(([shown, n]) => {
    const right = all[Number(n)];
    if (right === undefined) throw new Error(`classical drill: usage ${n} of ${shown}`);
    return drillItem(shown!, right, others(all, right));
  });

/** marked takes a shown sentence apart into the sentence and the character in brackets after it. */
function marked(shown: string): readonly [string, string] {
  const m = /^(.*)（(.)）$/u.exec(shown);
  if (!m) throw new Error(`classical drill: no character in brackets in ${shown}`);
  return [m[1]!, m[2]!];
}

/** usageWhy explains the meaning or usage of the character in brackets of a sentence. */
const usageWhy = (right: string, shown: string) => {
  const [sentence, char] = marked(shown);
  return t(`In ${sentence}, ${char} is: ${right}.`, `在“${sentence}”中，“${char}”是：${right}。`);
};

const contentWords = items(`
兔走触株（走） | 跑 | 行走 | 离开 | 前往
因释其耒而守株（释） | 放下 | 解释 | 释放 | 拿起
冀复得兔（冀） | 希望 | 害怕 | 打算 | 等待
冀复得兔（复） | 再，又 | 回复 | 恢复 | 重复
而身为宋国笑（笑） | 嘲笑 | 微笑 | 欢笑 | 笑话
甚聪惠（惠） | 同“慧”，聪明 | 恩惠 | 实惠 | 优惠
孔君平诣其父（诣） | 拜访 | 告诉 | 询问 | 寻找
为设果（设） | 摆放，摆出 | 设计 | 假设 | 建设
未闻孔雀是夫子家禽（闻） | 听说 | 闻到 | 新闻 | 看见
夏月则练囊盛数十萤火以照书（盛） | 装 | 茂盛 | 盛大 | 旺盛
胤恭勤不倦（倦） | 懈怠 | 卷起 | 休息 | 害怕
学而时习之（习） | 温习 | 习惯 | 风俗 | 学会
温故而知新（故） | 旧的知识 | 故事 | 缘故 | 故意
兔不可复得（得） | 得到 | 必须 | 得意 | 获胜
`);

const sentences = items(`
兔走触株，折颈而死 | 一只兔子奔跑着撞到树桩上，折断脖子死了 | 一只兔子走到树桩旁，被人折断脖子打死了 | 一只兔子跑来碰到树桩，吓得摔倒在地 | 一只兔子在树桩旁行走，扭伤了脖子
因释其耒而守株 | 于是放下他的农具，守在树桩旁边 | 因为解释他的农具而守着树桩 | 于是拿起农具去砍那个树桩 | 因此把农具放在树桩上守着田地
兔不可复得，而身为宋国笑 | 兔子不可能再得到，他自己却被宋国人嘲笑 | 兔子不能回来了，他身边的宋国人都在笑 | 兔子没有再得到，他为宋国人讲了笑话 | 兔子不会再来了，他觉得宋国人很好笑
孔君平诣其父，父不在 | 孔君平去拜访孩子的父亲，父亲不在家 | 孔君平告诉孩子的父亲，父亲不在家 | 孔君平是孩子的父亲，可他不在家 | 孔君平去找他的父亲，父亲不在乎
此是君家果 | 这是你家的水果 | 这是君王家的水果 | 这是你家种的果树 | 这是孔君平家的水果
未闻孔雀是夫子家禽 | 没有听说孔雀是您家的鸟 | 没有闻到孔雀是您家的鸟 | 还没听说孔雀是孔子家的鸟 | 孔雀不是夫子家养的家禽
家贫不常得油 | 家里贫穷，不能经常得到灯油 | 家里贫穷，常常不吃油 | 家里贫穷，不常用油做饭 | 家里贫穷，从来没有得到过油
以夜继日焉 | 用夜晚接着白天读书 | 晚上睡觉，白天继续读书 | 从夜晚一直等到白天 | 用夜晚的时间代替白天休息
学而时习之 | 学了又按时温习它 | 学习的时候要练习 | 学习了很长时间才学会 | 学过以后时常忘记它
温故而知新 | 温习旧的知识，从而得到新的理解 | 温暖故乡，才能知道新的事情 | 复习故事，就能写出新的故事 | 温习旧知识，然后丢掉它去学新知识
宋人有耕者 | 宋国有个种田的人 | 宋国人都会种田 | 宋朝有一个种田的人 | 姓宋的人有一块耕地
乃呼儿出 | 就把孩子叫了出来 | 于是孩子呼喊着出来 | 才叫来孩子的父亲 | 就叫孩子出去
`);

const ZHI = ["代词，代指人或事物", "助词，相当于“的”", "动词，到、往", "助词，不译"];

const zhi = usages(
  `
学而时习之（之） | 0
一人虽听之（之） | 0
思援弓缴而射之（之） | 0
问之，曰：“欲作针。”（之） | 0
择其善者而从之（之） | 0
通国之善弈者也（之） | 1
梁国杨氏之子（之） | 1
吾盾之坚，物莫能陷也（之） | 3
吾矛之利，于物无不陷也（之） | 3
黄鹤楼送孟浩然之广陵（之） | 2
吾欲之南海（之） | 2
`,
  ZHI,
);

const ER = ["表示顺承，可译为“就”“然后”", "表示转折，可译为“却”“但是”", "表示修饰，可译为“地”“着”", "表示并列，可译为“而且”"];
const YI = ["用，拿", "认为", "用来，来", "因为"];
const YU = ["比", "在", "对，对于", "从"];

const erYiYu = [
  ...usages(
    `
因释其耒而守株（而） | 0
而身为宋国笑（而） | 1
温故而知新（而） | 0
人不知而不愠（而） | 1
`,
    ER,
  ),
  ...usages(
    `
一心以为有鸿鹄将至（以） | 1
夏月则练囊盛数十萤火以照书（以） | 2
以夜继日焉（以） | 0
以子之矛，陷子之盾（以） | 0
不以物喜，不以己悲（以） | 3
`,
    YI,
  ),
  ...usages(
    `
霜叶红于二月花（于） | 0
苛政猛于虎也（于） | 0
吾矛之利，于物无不陷也（于） | 2
战于长勺（于） | 1
青，取之于蓝（于） | 3
`,
    YU,
  ),
];

/** classicalDrills are the drill topics of classical language, in the order they are taught. */
export const classicalDrills: readonly ClassicalDrill[] = [
  {
    grade: 5,
    id: "classical-words-5-01",
    title: t("Classical Chinese: Words and Sentences", "文言文：字词和句子"),
    summary: t(
      "The meaning of a content word in a classical sentence, and a classical sentence in modern Chinese.",
      "文言句子中实词的意思，以及把文言句子翻译成现代汉语。",
    ),
    points: [
      {
        suffix: "meaning",
        title: t("Content Words", "文言实词"),
        explanation: t(
          "A character of classical Chinese often means something other than the word it makes today: 去 is to leave, 汤 is hot water, 兵 is a weapon. Read the whole sentence, then ask what the character must mean in it.",
          "文言文中的字常常和今天的意思不一样：“去”是离开，“汤”是热水，“兵”是兵器。先读懂整句话，再想一想这个字在句中应该是什么意思。",
        ),
        question: t("What does the character in brackets mean in this sentence?", "括号里的字在这句话中是什么意思？"),
        items: contentWords,
        why: usageWhy,
      },
      {
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "To put a classical sentence into modern Chinese, give every character its meaning in the sentence, keep the order of the sentence, and add only the words modern Chinese needs: 未成，弃去 is 学业没有完成，就放弃离开了.",
          "把文言句子翻译成现代汉语，要落实每个字在句中的意思，保持句子的顺序，只补上现代汉语需要的词：“未成，弃去”就是“学业没有完成，就放弃离开了”。",
        ),
        question: t("Which is the right modern Chinese for this sentence?", "这句话翻译成现代汉语，哪一项正确？"),
        items: sentences,
        why: (right, shown) => t(`${shown} means: ${right}.`, `“${shown}”的意思是：${right}。`),
      },
    ],
  },
  {
    grade: 6,
    id: "classical-function-words-6-01",
    title: t("Classical Chinese: Function Words", "文言文：虚词"),
    summary: t("The usages of 之, 而, 以 and 于 in classical sentences.", "文言句子中“之”“而”“以”“于”的用法。"),
    points: [
      {
        suffix: "zhi",
        title: t("The Usages of 之", "“之”的用法"),
        explanation: t(
          `之 has four common usages:\n\n- ${ZHI[0]}: 知之为知之, where 之 is what one knows\n- ${ZHI[1]}: 小大之狱, cases great and small\n- ${ZHI[2]}: 辍耕之垄上, going to the ridge of the field\n- ${ZHI[3]}: 予独爱莲之出淤泥而不染, between a subject and what is said of it`,
          `“之”常见的用法有四种：\n\n- ${ZHI[0]}：知之为知之，“之”指知道的事\n- ${ZHI[1]}：小大之狱，大大小小的案件\n- ${ZHI[2]}：辍耕之垄上，到田埂上去\n- ${ZHI[3]}：予独爱莲之出淤泥而不染，用在主语和谓语之间`,
        ),
        question: t("What is the usage of 之 in this sentence?", "“之”在这句话中是什么用法？"),
        items: zhi,
        why: usageWhy,
      },
      {
        suffix: "er-yi-yu",
        title: t("The Usages of 而, 以 and 于", "“而”“以”“于”的用法"),
        explanation: t(
          `而 joins two parts: ${ER.join("; ")}.\n\n以: ${YI.join("; ")}.\n\n于: ${YU.join("; ")}.\n\nFirst see what the two parts of the sentence are, then which usage joins them.`,
          `“而”连接前后两部分：${ER.join("；")}。\n\n“以”：${YI.join("；")}。\n\n“于”：${YU.join("；")}。\n\n先看清句子前后两部分的关系，再判断是哪一种用法。`,
        ),
        question: t("What is the usage of the character in brackets in this sentence?", "括号里的字在这句话中是什么用法？"),
        items: erYiYu,
        why: usageWhy,
      },
    ],
  },
];
