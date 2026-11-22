// The language topic of grade 6 (docs/chinese-curriculum.md §18.9): how compound words are formed, by the five
// structures of the school grammars, and families of words that share a character in one sense. The analyses and
// senses are those of the general dictionaries, worded for this subject; the words are common ones of the grades.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, rows } from "./choice-kit.ts";

/** Structure is one of the five structures of compound words. */
type Structure = "并列" | "偏正" | "动宾" | "主谓" | "补充";

/** STRUCTURES are the five structures, each with how its two parts stand to each other. */
const STRUCTURES: Readonly<Record<Structure, Text>> = {
  并列: t("two parts of like or opposite meaning stand side by side, equal", "两部分意思相近或相反，地位平等，并排在一起"),
  偏正: t("the first part describes or limits the second, which is the main one", "前一部分修饰、限制后一部分，后一部分是主要的"),
  动宾: t("the first part is an action and the second what it acts on", "前一部分是动作，后一部分是动作涉及的事物"),
  主谓: t(
    "the first part is what is spoken of and the second says what it does or is like",
    "前一部分是被陈述的对象，后一部分说明它怎么样",
  ),
  补充: t(
    "the second part completes the first, telling its result, or the first names a thing and the second its unit",
    "后一部分补充说明前一部分的结果，或者前面是事物、后面是它的单位",
  ),
};

/**
 * COMPOUNDS are the words, each on a line `word | structure | how its parts stand, Chinese ~ English | a structure it
 * might be taken for | another`.
 */
const COMPOUNDS = rows(
  `
道路 | 并列 | “道”和“路”都是路的意思 ~ 道 and 路 both mean a road | 偏正 | 动宾
美丽 | 并列 | “美”和“丽”都是好看的意思 ~ 美 and 丽 both mean lovely | 偏正 | 主谓
朋友 | 并列 | “朋”和“友”都是朋友的意思 ~ 朋 and 友 both mean a friend | 偏正 | 补充
买卖 | 并列 | “买”和“卖”意思相反，合起来指做生意 ~ 买 and 卖 are opposites, together meaning trade | 动宾 | 补充
大小 | 并列 | “大”和“小”意思相反，合起来指尺寸 ~ 大 and 小 are opposites, together meaning size | 偏正 | 主谓
火车 | 偏正 | “火”说明是什么样的“车”，原来指烧火开动的车 ~ 火 tells what kind of 车, first a car driven by fire | 并列 | 主谓
黑板 | 偏正 | “黑”说明是什么样的“板” ~ 黑 tells what kind of 板, board | 并列 | 动宾
雪白 | 偏正 | “雪”说明怎样“白”：像雪一样白 ~ 雪 tells how 白: white as snow | 主谓 | 并列
飞快 | 偏正 | “飞”说明怎样“快”：快得像飞 ~ 飞 tells how 快: fast as flying | 动宾 | 补充
课本 | 偏正 | “课”说明是什么“本”：上课用的书 ~ 课 tells which 本: the book for lessons | 并列 | 动宾
跳舞 | 动宾 | “跳”是动作，“舞”是跳的东西 ~ 跳 is the action and 舞 what is danced | 并列 | 主谓
读书 | 动宾 | “读”是动作，“书”是读的东西 ~ 读 is the action and 书 what is read | 偏正 | 补充
关心 | 动宾 | “关”是牵挂，“心”是牵挂的对象 ~ 关 is to concern, 心 what is concerned | 主谓 | 偏正
司机 | 动宾 | “司”是掌管，“机”是掌管的机器 ~ 司 is to run, 机 the machine run | 偏正 | 并列
注意 | 动宾 | “注”是集中，“意”是集中的心思 ~ 注 is to fix, 意 the mind that is fixed | 主谓 | 补充
地震 | 主谓 | “地”是被说的对象，“震”说它怎么样：大地震动 ~ 地 is what is spoken of, and 震 what it does: the earth shakes | 动宾 | 偏正
日出 | 主谓 | “日”是被说的对象，“出”说它怎么样：太阳出来 ~ 日 is spoken of, and 出 what it does: the sun comes out | 动宾 | 补充
心疼 | 主谓 | “心”是被说的对象，“疼”说它怎么样 ~ 心 is spoken of, and 疼 what it does: the heart aches | 动宾 | 偏正
年轻 | 主谓 | “年”指年纪，“轻”说年纪怎么样：年纪小 ~ 年 is age, and 轻 what it is: young | 偏正 | 并列
胆小 | 主谓 | “胆”指胆量，“小”说胆量怎么样 ~ 胆 is courage, and 小 what it is: small | 偏正 | 补充
提高 | 补充 | “提”是动作，“高”是提的结果 ~ 提 is the action and 高 its result: raised high | 动宾 | 并列
说明 | 补充 | “说”是动作，“明”是说的结果：说清楚 ~ 说 is the action and 明 its result: made clear | 动宾 | 偏正
打倒 | 补充 | “打”是动作，“倒”是打的结果 ~ 打 is the action and 倒 its result: knocked down | 动宾 | 主谓
放大 | 补充 | “放”是动作，“大”是放的结果 ~ 放 is the action and 大 its result: enlarged | 偏正 | 动宾
纸张 | 补充 | “纸”是事物，“张”是纸的单位，合起来指纸的总称 ~ 纸 is the thing and 张 its unit, together paper in general | 偏正 | 并列
`,
  5,
).map(([word, structure, how, w1, w2]) => ({
  word: word!,
  structure: structure as Structure,
  how: bilingual(how!),
  wrong: [w1 as Structure, w2 as Structure],
}));

/** byStructure are the questions of naming the structure of a compound word. */
const byStructure: readonly Choice[] = COMPOUNDS.map(({ word, structure, how, wrong }) => {
  for (const s of [structure, ...wrong]) if (!(s in STRUCTURES)) throw new Error(`compounds: ${word} ${s}`);
  return choice({
    ask: t(`What is the structure of ${word}?`, `“${word}”是什么结构的词？`),
    shown: "",
    right: structure,
    wrong: wrong.map((s) => [
      s,
      t(
        `in a ${s} word ${STRUCTURES[s].en}; but in ${word}, ${how.en}.`,
        `${s}式是${STRUCTURES[s]["zh-CN"]}；可“${word}”里，${how["zh-CN"]}。`,
      ),
    ]),
    find: t(
      `Split ${word} into its two characters and ask how they stand: ${how.en}.`,
      `把“${word}”分成两个字，看它们是什么关系：${how["zh-CN"]}。`,
    ),
    choose: t(`That is ${structure}: ${STRUCTURES[structure].en}.`, `这是${structure}式：${STRUCTURES[structure]["zh-CN"]}。`),
    check: t(
      `Say the word as its two parts again: “${how.en}” matches ${structure} and no other structure.`,
      `再把两个字的关系说一遍：“${how["zh-CN"]}”，正是${structure}式，不是别的结构。`,
    ),
  });
});

/**
 * FAMILIES are the shared characters, each on a line `character | a word | the sense there, Chinese ~ English | a word
 * of the same sense | a word of another sense ~ that sense, Chinese ~ English | another ~ its sense`.
 */
const FAMILIES = rows(
  `
花 | 花朵 | 植物的花 ~ a flower | 花瓣 | 花钱 ~ 用掉 ~ to spend | 眼花 ~ 看东西模糊 ~ blurred
白 | 白云 | 像雪的颜色 ~ white | 雪白 | 白跑 ~ 没有效果，白白地 ~ for nothing | 明白 ~ 清楚 ~ clear
生 | 出生 | 生出来 ~ to be born | 生日 | 学生 ~ 读书的人 ~ a learner | 生肉 ~ 没有煮熟的 ~ raw
开 | 开门 | 打开 ~ to open | 开窗 | 开车 ~ 驾驶 ~ to drive | 开会 ~ 举行 ~ to hold
老 | 老人 | 年纪大 ~ old in years | 老年 | 老师 ~ 放在前面的词头，没有年纪大的意思 ~ a prefix, with no sense of age | 老是 ~ 总是 ~ always
发 | 发信 | 送出 ~ to send | 分发 | 头发 ~ 头上的毛 ~ hair | 发现 ~ 找到、看出 ~ to find
光 | 阳光 | 光线 ~ light | 灯光 | 光滑 ~ 平滑 ~ smooth | 吃光 ~ 一点不剩 ~ all gone
深 | 深水 | 从上到下距离大 ~ deep | 深井 | 深夜 ~ 时间很久 ~ late | 深红 ~ 颜色浓 ~ dark in colour
头 | 点头 | 脑袋 ~ the head | 头发 | 石头 ~ 放在后面的词尾，没有实在意思 ~ a suffix, with no sense of its own | 带头 ~ 在最前面 ~ in front
道 | 街道 | 路 ~ a road | 道路 | 知道 ~ 懂得 ~ to know | 道理 ~ 事情的理由 ~ a reason
高 | 高楼 | 从下到上距离大 ~ tall | 高山 | 高声 ~ 声音大 ~ loud | 高级 ~ 等级在上 ~ high in rank
冷 | 冷水 | 温度低 ~ cold | 冰冷 | 冷淡 ~ 不热情 ~ unfriendly | 冷门 ~ 很少有人注意的 ~ little heeded
`,
  6,
).map(([char, word, sense, same, other1, other2]) => {
  const other = (field: string): readonly [string, Text] => {
    const [w = "", zh = "", en = ""] = field.split(" ~ ").map((s) => s.trim());
    if (w === "" || zh === "" || en === "" || !w.includes(char!)) throw new Error(`families: ${char} ${field}`);
    return [w, t(en, zh)];
  };
  if (!word!.includes(char!) || !same!.includes(char!)) throw new Error(`families: ${char}`);
  return { char: char!, word: word!, sense: bilingual(sense!), same: same!, others: [other(other1!), other(other2!)] };
});

/** byFamily are the questions of finding the word in which a character has the sense it has in a given word. */
const byFamily: readonly Choice[] = FAMILIES.map(({ char, word, sense, same, others }) =>
  choice({
    ask: t(`In which word does ${char} mean what it means in ${word}?`, `下面哪个词里的“${char}”和“${word}”里的“${char}”意思相同？`),
    shown: "",
    right: same,
    wrong: others.map(([w, s]) => [
      w,
      t(`in ${w}, ${char} means ${s.en}, not ${sense.en}.`, `“${w}”里的“${char}”是${s["zh-CN"]}，不是“${sense["zh-CN"]}”的意思。`),
    ]),
    find: t(`In ${word}, ${char} means ${sense.en}.`, `“${word}”里的“${char}”是“${sense["zh-CN"]}”的意思。`),
    choose: t(
      `Ask what ${char} means in each word. In ${same} it also means ${sense.en}.`,
      `看看每个词里的“${char}”是什么意思。“${same}”里的“${char}”也是“${sense["zh-CN"]}”。`,
    ),
    check: t(
      `Put the sense back into both words: ${word} and ${same} each still make sense with ${char} as ${sense.en}; they belong to one family.`,
      `把“${sense["zh-CN"]}”这个意思放回两个词里：“${word}”和“${same}”都讲得通，是同一个意思的一族词。`,
    ),
  }),
);

/** gradeSixLanguage are the language topics of grade 6. */
export const gradeSixLanguage: readonly GradeTopic[] = [
  {
    grade: 6,
    topic: {
      id: "language-6-word-formation",
      title: t("How Words Are Formed", "构词和组词"),
      summary: t(
        "The five structures of compound words, 并列, 偏正, 动宾, 主谓 and 补充, and families of words that share a character in one sense.",
        "合成词的五种结构：并列、偏正、动宾、主谓、补充；含同一个字、意思相同的一族词。",
      ),
      intro: t(
        "Most words of two characters are built from two parts that stand to each other in one of five ways. In 道路 both mean road (并列); in 黑板 黑 describes the board (偏正); in 读书 书 is what is read (动宾); in 地震 the earth is what shakes (主谓); in 提高 高 is the result of raising (补充).\n\nA character also builds families of words. 花 in 花朵 and 花瓣 is the flower; in 花钱 it is to spend: another family. The first knowledge point names the structure, the second finds the word of the same family.",
        "大多数两个字的词，是由两部分按五种关系组成的。“道路”两个字都是路的意思（并列）；“黑板”的“黑”修饰“板”（偏正）；“读书”的“书”是读的东西（动宾）；“地震”是大地震动（主谓）；“提高”的“高”是提的结果（补充）。\n\n一个字还能组成一族一族的词。“花朵”“花瓣”里的“花”是植物的花；“花钱”里的“花”是用掉的意思，是另一族。第一个知识点辨别结构，第二个找出同一族的词。",
      ),
      prerequisites: ["language-5-character-formation"],
      encompasses: [],
      xp: 12,
      strand: "words",
      knowledgePoints: [
        point(
          "language-6-word-formation-structure",
          t("The Structure of Compound Words", "合成词的结构"),
          t(
            "Split the word into its two characters and ask how they stand: equal (并列), the first describing the second (偏正), an action and what it acts on (动宾), a thing and what it does or is like (主谓), or an action and its result (补充).\n\n雪白 is white as snow: 雪 tells how white, so 偏正.\n\n> **Watch out.** 动宾 and 主谓 both join a noun and a verb: in 动宾 the action comes first, as in 跳舞; in 主谓 the thing comes first and the second part says what it does, as in 日出.",
            "把词分成两个字，看它们是什么关系：地位平等的是并列；前面修饰后面的是偏正；前面是动作、后面是动作涉及的事物的是动宾；前面是事物、后面说它怎么样的是主谓；前面是动作、后面是结果的是补充。\n\n“雪白”是像雪一样白：“雪”说明怎样白，是偏正。\n\n> **注意。** 动宾和主谓都由名词和动词组成：动宾是动作在前，比如“跳舞”；主谓是事物在前，后面说它怎么样，比如“日出”。",
          ),
          choiceTopicGenerator(byStructure, {
            find: t("**Step 1: see how the two characters stand.**", "**第一步：看两个字是什么关系。**"),
            choose: t("**Step 2: name the structure.**", "**第二步：说出是什么结构。**"),
          }),
        ),
        point(
          "language-6-word-formation-family",
          t("Families of Words", "同一族的词"),
          t(
            "A character can have several senses, and the words that use it in one sense make a family. Find what the character means in the given word, then look for the word in which it means the same.\n\n深 in 深水 is deep from top to bottom; in 深井 too. In 深夜 it is late, and in 深红 dark: other families.\n\n> **Watch out.** Sharing the character is not enough: 头 in 点头 is the head, but in 石头 it is only a suffix. Put the sense back into the word to test it.",
            "一个字可以有几个意思，用它的同一个意思组成的词，是一族词。先想想这个字在给出的词里是什么意思，再找它意思相同的词。\n\n“深水”的“深”是从上到下距离大，“深井”也是。“深夜”的“深”是时间很久，“深红”的“深”是颜色浓，是别的族。\n\n> **注意。** 有同一个字不等于是同一族：“点头”的“头”是脑袋，“石头”的“头”只是词尾。要把意思放回词里试一试。",
          ),
          choiceTopicGenerator(byFamily, {
            find: t("**Step 1: find the sense in the given word.**", "**第一步：弄清字在给出的词里的意思。**"),
            choose: t("**Step 2: find the word with the same sense.**", "**第二步：找出意思相同的词。**"),
          }),
        ),
      ],
    },
  },
];
