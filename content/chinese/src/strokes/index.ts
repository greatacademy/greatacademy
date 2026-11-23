// Strokes and components, the first topics of writing in grades 1 and 2 (docs/chinese-curriculum.md §5.2): the names
// of strokes and how many a character has, the rules of stroke order, and the components that a character's meaning
// often comes from. Every question is about simple characters a child meets first; the order of their strokes follows
// the standard order of the general standard characters. Writing characters by hand is in writing.ts.

import { type Text, type TopicDef, t } from "@ga/content";

import { type DrillItem, drillItem, drillTopic, lines } from "../grammar/drill.ts";

/** STROKES are the names of the strokes these topics teach. */
const STROKES = [
  "横",
  "竖",
  "撇",
  "捺",
  "点",
  "提",
  "横折",
  "横撇",
  "横折钩",
  "竖钩",
  "竖折",
  "竖弯",
  "竖弯钩",
  "横折弯钩",
  "撇点",
  "撇折",
  "弯钩",
  "卧钩",
  "竖折折钩",
] as const;

/** Written is a character and the names of its strokes in the standard order. */
interface Written {
  readonly char: string;
  readonly strokes: readonly string[];
}

/** written reads lines of a character and the names of its strokes, separated by spaces. */
function written(data: string): readonly Written[] {
  return data
    .trim()
    .split("\n")
    .map((line) => {
      const [char, ...strokes] = line.trim().split(/\s+/u);
      if (!char || strokes.length === 0) throw new Error(`strokes: ${line}`);
      for (const s of strokes) if (!(STROKES as readonly string[]).includes(s)) throw new Error(`strokes: ${s} of ${char}`);
      return { char, strokes };
    });
}

/** basic are characters of the six basic strokes only. */
const basic = written(`
一 横
二 横 横
三 横 横 横
十 横 竖
人 撇 捺
八 撇 捺
大 横 撇 捺
天 横 横 撇 捺
土 横 竖 横
王 横 横 竖 横
工 横 竖 横
上 竖 横 横
下 横 竖 点
个 撇 捺 竖
六 点 横 撇 点
文 点 横 撇 捺
广 点 横 撇
厂 横 撇
千 撇 横 竖
干 横 横 竖
不 横 撇 竖 点
牛 撇 横 横 竖
午 撇 横 横 竖
立 点 横 点 撇 横
火 点 撇 撇 捺
禾 撇 横 竖 撇 点
米 点 撇 横 竖 撇 捺
羊 点 撇 横 横 横 竖
`);

/** turning are characters with strokes that turn or hook. */
const turning = written(`
口 竖 横折 横
日 竖 横折 横 横
目 竖 横折 横 横 横
田 竖 横折 横 竖 横
中 竖 横折 横 竖
山 竖 竖折 竖
月 撇 横折钩 横 横
力 横折钩 撇
小 竖钩 点 点
水 竖钩 横撇 撇 捺
子 横撇 竖钩 横
了 横撇 竖钩
女 撇点 撇 横
儿 撇 竖弯钩
九 撇 横折弯钩
七 横 竖弯钩
门 点 竖 横折钩
心 点 卧钩 点 点
也 横折钩 竖 竖弯钩
白 撇 竖 横折 横 横
石 横 撇 竖 横折 横
手 撇 横 横 弯钩
车 横 撇折 横 竖
云 横 横 撇折 点
方 点 横 横折钩 撇
又 横撇 捺
四 竖 横折 撇 竖弯 横
五 横 竖 横折 横
马 横折 竖折折钩 横
电 竖 横折 横 横 竖弯钩
`);

/** counted asks how many strokes a character has: one fewer, one more and two more are the wrong answers. */
const counted = (w: Written): DrillItem => {
  const n = w.strokes.length;
  const wrong = n === 1 ? ([2, 3, 4] as const) : ([n - 1, n + 1, n + 2] as const);
  return drillItem(w.char, String(n), [String(wrong[0]), String(wrong[1]), String(wrong[2])]);
};

/** LIKE are the strokes a child takes a stroke for, most alike first. */
const LIKE: Readonly<Record<string, readonly string[]>> = {
  横: ["提", "竖", "撇"],
  竖: ["竖钩", "横", "撇"],
  撇: ["点", "捺", "竖"],
  捺: ["点", "撇", "提"],
  点: ["撇", "捺", "提"],
  提: ["横", "撇", "点"],
  横折: ["横折钩", "横撇", "竖折"],
  横撇: ["横折", "撇", "横折钩"],
  横折钩: ["横折", "横撇", "竖钩"],
  竖钩: ["竖", "弯钩", "竖弯钩"],
  竖折: ["横折", "竖弯", "竖"],
  竖弯: ["竖弯钩", "竖折", "竖"],
  竖弯钩: ["竖弯", "横折弯钩", "竖钩"],
  横折弯钩: ["竖弯钩", "横折钩", "横折"],
  撇点: ["撇折", "撇", "点"],
  撇折: ["撇点", "横折", "撇"],
  弯钩: ["竖钩", "竖弯钩", "撇"],
  卧钩: ["竖弯钩", "弯钩", "点"],
  竖折折钩: ["横折钩", "竖折", "竖弯钩"],
};

/** strokeAt asks for the stroke at a place of a character, its first or the one after those given. */
function strokeAt(w: Written, at: number): DrillItem {
  const right = w.strokes[at]!;
  const like = LIKE[right]!;
  const shown = at === 0 ? w.char : `${w.char}　已经写了：${w.strokes.slice(0, at).join("、")}`;
  return drillItem(shown, right, [like[0]!, like[1]!, like[2]!]);
}

const sequence = (w: Written) => w.strokes.join("、");

/** RULES are the rules of stroke order, each with the characters it shows best and three rules they do not follow. */
const RULES: readonly (readonly [rule: string, en: string, chars: string, wrong: readonly [string, string, string]])[] = [
  ["先横后竖", "horizontal before vertical", "十 干 土 丰 王", ["先撇后捺", "从外到内", "先里头后封口"]],
  ["先撇后捺", "left-falling before right-falling", "人 八 入 大", ["先横后竖", "从外到内", "先里头后封口"]],
  ["从上到下", "top to bottom", "三 二 字 吕 早", ["从左到右", "先撇后捺", "先中间后两边"]],
  ["从左到右", "left to right", "川 好 地 林 竹", ["从上到下", "先中间后两边", "先里头后封口"]],
  ["从外到内", "outside before inside", "月 同 风 用", ["从左到右", "从上到下", "先撇后捺"]],
  ["先里头后封口", "inside before closing", "日 田 目 回 国 四", ["从左到右", "先撇后捺", "先中间后两边"]],
  ["先中间后两边", "middle before the sides", "小 水 山", ["从左到右", "先横后竖", "从外到内"]],
];

const ruleItems: readonly DrillItem[] = RULES.flatMap(([rule, , chars, wrong]) => chars.split(" ").map((c) => drillItem(c, rule, wrong)));

/** HOW say how each stroke is written. */
const HOW: Readonly<Record<(typeof STROKES)[number], Text>> = {
  横: t("goes level from left to right", "从左向右写平"),
  竖: t("goes straight down", "从上向下写直"),
  撇: t("falls to the lower left", "向左下方撇出"),
  捺: t("falls to the lower right", "向右下方捺出"),
  点: t("is a short dot", "是短短的一点"),
  提: t("rises to the upper right", "向右上方提起"),
  横折: t("goes across, then turns down", "先横，再折向下"),
  横撇: t("goes across, then turns to fall to the lower left", "先横，再折向左下方撇出"),
  横折钩: t("goes across, turns down and ends in a hook to the left", "先横，折向下，末尾向左钩"),
  竖钩: t("goes down and ends in a hook to the left", "向下写，末尾向左钩"),
  竖折: t("goes down, then turns to the right", "先竖，再折向右"),
  竖弯: t("goes down, then bends round to the right", "先竖，再弯向右"),
  竖弯钩: t("goes down, bends round to the right and hooks up", "先竖，弯向右，末尾向上钩"),
  横折弯钩: t("goes across, turns down, bends round to the right and hooks up", "先横，折向下，弯向右，末尾向上钩"),
  撇点: t("falls to the lower left, then turns into a dot to the lower right", "先撇，再折向右下写点"),
  撇折: t("falls to the lower left, then turns to rise to the right", "先撇，再折向右上提"),
  弯钩: t("curves down and ends in a hook to the left", "弯着向下，末尾向左钩"),
  卧钩: t("lies along the bottom, curving, and hooks up", "横卧着弯过来，末尾向上钩"),
  竖折折钩: t("goes down, turns right, turns down again and ends in a hook", "先竖，折向右，再折向下，末尾带钩"),
};

const how = (stroke: string): Text => HOW[stroke as (typeof STROKES)[number]]!;

/** writtenOf finds the strokes of a character among those these topics ask about. */
const writtenOf = (char: string): Written => [...basic, ...turning].find((w) => w.char === char)!;

/** countWhy works out the strokes of a character, then checks the count against the names. */
const countWhy = (right: string, shown: string): Text => {
  const w = writtenOf(shown);
  return t(
    `Write ${shown} stroke by stroke in the standard order: ${sequence(w)}.\n\n**Check.** That is ${right} names, one for each stroke, so ${shown} has ${right} strokes.`,
    `按笔顺一笔一笔写“${shown}”：${sequence(w)}。\n\n**检验。** 一共 ${right} 个笔画名称，一个名称一笔，所以“${shown}”是 ${right} 笔。`,
  );
};

/** countWhyNot says what a wrong count of strokes misses or adds. */
const countWhyNot = (wrong: string, right: string, shown: string): Text => {
  const d = Number(wrong) - Number(right);
  if (d < 0)
    return t(
      `${wrong} misses ${-d === 1 ? "a stroke" : `${-d} strokes`}: ${shown} is ${sequence(writtenOf(shown))}, ${right} strokes.`,
      `${wrong} 笔漏数了${-d === 1 ? "一笔" : `${-d} 笔`}：“${shown}”是${sequence(writtenOf(shown))}，共 ${right} 笔。`,
    );
  return t(
    `${wrong} counts ${d === 1 ? "one stroke" : `${d} strokes`} too many, as when a turn or a crossing is taken for a new stroke: ${shown} has ${right}.`,
    `${wrong} 笔多数了${d === 1 ? "一笔" : `${d} 笔`}，就像把转折或交叉的地方当成了新的一笔；“${shown}”是 ${right} 笔。`,
  );
};

/** placeWhy names the stroke at a place of a character: the strokes in order, then the one asked, then a check. */
const placeWhy = (right: string, shown: string): Text => {
  const char = [...shown][0]!;
  const w = writtenOf(char);
  const given = shown === char ? 0 : shown.split("：")[1]!.split("、").length;
  const first = given === 0;
  return t(
    `In the standard order, ${char} is written ${sequence(w)}.\n\n${first ? "The first stroke" : `After the ${given} written, the next stroke`} is ${right}, which ${how(right).en}.\n\n**Check.** ${first ? `${char} has ${w.strokes.length} strokes and ${right} is the first of them.` : `${given} strokes are written and ${char} has ${w.strokes.length}, so the next is stroke ${given + 1}: ${right}.`}`,
    `按笔顺，“${char}”的写法是${sequence(w)}。\n\n${first ? "第一笔" : `写完这 ${given} 笔，下一笔`}是${right}，${how(right)["zh-CN"]}。\n\n**检验。** ${first ? `“${char}”共 ${w.strokes.length} 笔，${right}是其中的第一笔。` : `已经写了 ${given} 笔，“${char}”共 ${w.strokes.length} 笔，下一笔是第 ${given + 1} 笔：${right}。`}`,
  );
};

/** placeWhyNot says why a stroke is not the one at a place: it comes elsewhere in the character, or it is not in it. */
const placeWhyNot = (wrong: string, right: string, shown: string): Text => {
  const char = [...shown][0]!;
  const w = writtenOf(char);
  if (w.strokes.includes(wrong))
    return t(
      `${wrong} is a stroke of ${char}, but not this one: the order is ${sequence(w)}.`,
      `${wrong}是“${char}”的笔画，但不在这个位置：笔顺是${sequence(w)}。`,
    );
  return t(
    `${wrong} ${how(wrong).en}; ${char} has no ${wrong}, and the stroke here is ${right}, which ${how(right).en}.`,
    `${wrong}${how(wrong)["zh-CN"]}；“${char}”里没有${wrong}，这一笔是${right}，${how(right)["zh-CN"]}。`,
  );
};

/** PLACES name what in a character each rule of stroke order is about. */
const PLACES: Readonly<Record<string, Text>> = {
  先横后竖: t("a 横 and a 竖 that cross", "相交的横和竖"),
  先撇后捺: t("a 撇 paired with a 捺", "成对的撇和捺"),
  从上到下: t("parts one above another", "上下排列的部分"),
  从左到右: t("parts side by side", "左右并排的部分"),
  从外到内: t("a frame and the strokes inside it", "外框和框里的笔画"),
  先里头后封口: t("a frame closed by its last 横", "最后一横封口的框"),
  先中间后两边: t("a middle stroke with strokes on both sides", "中间一笔和两边的笔画"),
};

/** strokeOrderTopics are the topics of strokes: counting them, naming them in order, and the rules of their order. */
export const strokeOrderTopics: readonly TopicDef[] = [
  drillTopic({
    id: "strokes-basic",
    title: t("Basic Strokes", "基本笔画"),
    summary: t(
      "The six basic strokes, 横 竖 撇 捺 点 提, and counting the strokes of simple characters.",
      "认识六种基本笔画：横、竖、撇、捺、点、提，数一数简单的字有几笔。",
    ),
    intro: t(
      "A character is written stroke by stroke, and each stroke has a name. Take 十: first 横, level from left to right, then 竖, straight down through it. That is two strokes. This topic counts the strokes of simple characters and names the stroke each one begins with.",
      "汉字是一笔一笔写成的，每一笔都有名称。比如“十”：先写横，从左向右写平；再写竖，从上向下穿过横。一共两笔。这个专题数简单字的笔画，并说出每个字的第一笔。",
    ),
    prerequisites: [],
    strand: "characters",
    points: [
      {
        suffix: "count",
        title: t("Counting Strokes", "数笔画"),
        explanation: t(
          "A stroke is everything the pen draws between touching the paper and lifting from it. Count a character by writing it in the air or with a finger, one stroke at a time: 大 is 横, then 撇, then 捺, three strokes.\n\n> **Watch out.** Strokes that cross are still one stroke each: in 十 the 横 and the 竖 cross, but 十 has two strokes, not four.",
          "笔从落到纸上到离开纸，写出来的就是一笔。数笔画时，可以用手指照着字一笔一笔书空：“大”先写横，再写撇，最后写捺，一共三笔。\n\n> **注意。** 交叉的笔画仍然各是一笔：“十”的横和竖交叉，但“十”是两笔，不是四笔。",
        ),
        question: t("How many strokes does this character have?", "这个字一共有几笔？"),
        items: basic.map(counted),
        why: countWhy,
        whyNot: countWhyNot,
      },
      {
        suffix: "first",
        title: t("The First Stroke", "第一笔"),
        explanation: t(
          "The basic strokes are 横, level from left to right; 竖, straight down; 撇, falling to the lower left; 捺, falling to the lower right; 点, a short dot; and 提, rising to the upper right. The first stroke is the one the standard order writes first: 大 begins with 横, 人 with 撇, 文 with 点.\n\n> **Watch out.** The first stroke follows the standard order, not the stroke that looks first: 个 begins with 撇, not with its 竖, and 上 begins with 竖, not with a 横.",
          "基本笔画有：横，从左往右写平；竖，从上往下写直；撇，向左下方撇出；捺，向右下方捺出；点，短短的一点；提，向右上方提起。第一笔就是按笔顺最先写的那一笔：“大”先写横，“人”先写撇，“文”先写点。\n\n> **注意。** 第一笔要按笔顺来定，不是看上去最显眼的那一笔：“个”先写撇，不是先写竖；“上”先写竖，不是先写横。",
        ),
        question: t("What is the first stroke of this character?", "这个字的第一笔是什么？"),
        items: basic.filter((w) => w.strokes.length > 1).map((w) => strokeAt(w, 0)),
        why: placeWhy,
        whyNot: placeWhyNot,
      },
    ],
  }),
  drillTopic({
    id: "strokes-turning",
    title: t("Strokes That Turn and Hook", "折笔和钩笔"),
    summary: t(
      "Strokes that turn or end in a hook, such as 横折, 竖钩 and 竖弯钩, and naming the strokes of a character in order.",
      "认识横折、竖钩、竖弯钩等带折、带钩的笔画，按笔顺说出字的笔画。",
    ),
    intro: t(
      "Some strokes change direction without the pen lifting, or end in a hook. Take 口: 竖, then 横折, which goes across and turns down, then 横. That is three strokes. This topic counts the strokes of characters with such strokes and names the stroke that comes next.",
      "有些笔画中途转折，笔不离开纸；有些笔画末尾带钩。比如“口”：先写竖，再写横折，先横再折向下，最后写横。一共三笔。这个专题数这类字的笔画，并说出下一笔写什么。",
    ),
    prerequisites: ["strokes-basic"],
    strand: "characters",
    points: [
      {
        suffix: "count",
        title: t("Counting Strokes That Turn", "数带折带钩的笔画"),
        explanation: t(
          "A stroke that turns is still one stroke: the pen does not lift at the corner. 力 is 横折钩 and 撇, two strokes: the 横折钩 goes across, turns down and hooks in one movement.\n\n> **Watch out.** A corner is not a new stroke: the 横折 of 口 goes across and down in one movement, so 口 has three strokes, not four.",
          "转弯的笔画仍然是一笔，因为笔在拐角处没有离开纸。“力”是横折钩、撇，两笔：横折钩先横，再折向下，最后带钩，一笔写成。\n\n> **注意。** 拐角不是新的一笔：“口”的横折是一笔写成的，所以“口”是三笔，不是四笔。",
        ),
        question: t("How many strokes does this character have?", "这个字一共有几笔？"),
        items: turning.map(counted),
        why: countWhy,
        whyNot: countWhyNot,
      },
      {
        suffix: "next",
        title: t("The Next Stroke", "下一笔"),
        explanation: t(
          "Name a turning stroke by its parts in order: 横折 goes across and then down; 横折钩 adds a hook; 竖钩 goes down and hooks to the left; 竖弯钩 goes down, bends to the right and hooks up. To find the next stroke, write the strokes already given and see what is left: 小 is 竖钩, 点, 点, so after the 竖钩 comes a 点.\n\n> **Watch out.** Strokes that differ only by a hook are different strokes: 竖 ends straight, while 竖钩 hooks to the left, as in 小.",
          "带折、带钩的笔画按书写的先后命名：横折先横后折向下；横折钩再加一个钩；竖钩向下写，最后向左钩；竖弯钩向下写，弯向右边，再向上钩。找下一笔时，先把已经写了的笔画写出来，看看还缺哪一笔：“小”是竖钩、点、点，写完竖钩，下一笔是点。\n\n> **注意。** 只差一个钩的也是不同的笔画：竖直直地收笔，竖钩末尾向左钩，比如“小”的第一笔。",
        ),
        question: t("Which stroke comes next?", "接下来写哪一笔？"),
        items: turning.map((w) => strokeAt(w, Math.floor(w.strokes.length / 2))),
        why: placeWhy,
        whyNot: placeWhyNot,
      },
    ],
  }),
  drillTopic({
    id: "strokes-order",
    title: t("Rules of Stroke Order", "笔顺规则"),
    summary: t(
      "The rules of stroke order: horizontal before vertical, left-falling before right-falling, top to bottom, left to right, outside before inside, inside before closing, the middle before the sides.",
      "笔顺规则：先横后竖，先撇后捺，从上到下，从左到右，从外到内，先里头后封口，先中间后两边。",
    ),
    intro: t(
      "The order of strokes follows a few rules, each saying what comes first. Take 十: its 横 and 竖 cross, and the 横 is written first, so 十 shows 先横后竖, horizontal before vertical. This topic finds the rule a character shows best and uses the rules to find a missing stroke.",
      "笔顺有几条规则，每条都说明先写什么。比如“十”：横和竖相交，先写横，再写竖，所以“十”体现的是先横后竖。这个专题找出一个字最能体现的规则，并用规则找出缺的那一笔。",
    ),
    prerequisites: ["strokes-turning"],
    strand: "characters",
    points: [
      {
        suffix: "rule",
        title: t("Which Rule", "用的是哪条规则"),
        explanation: t(
          "Each rule says what comes first. 十 writes 横 before 竖; 人 writes 撇 before 捺; 三 goes from top to bottom; 川 from left to right; 月 writes the outside before the inside; 日 writes the inside before the last stroke that closes it; 小 writes the middle before the sides. To choose, find the place in the character that a rule is about: in 人, a 撇 and a 捺 that meet.\n\n> **Watch out.** A character may follow several rules; choose the one it shows best. 日 is written from the outside in, but what stands out is its last 横, which closes the frame: 先里头后封口.",
          "每条规则都说明先写什么。“十”先横后竖；“人”先撇后捺；“三”从上到下；“川”从左到右；“月”先外后内；“日”先写里面，最后一横封口；“小”先写中间，再写两边。选的时候，先在字里找到规则说的地方：“人”里是相交的撇和捺。\n\n> **注意。** 一个字可能同时符合几条规则，要选最能体现的那一条。“日”也是先外后内，但最突出的是最后一横封口，所以是先里头后封口。",
        ),
        question: t("Which rule of stroke order does this character show best?", "这个字的笔顺最能体现哪条规则？"),
        items: ruleItems,
        why: (right, shown) => {
          const en = RULES.find(([rule]) => rule === right)![1];
          const place = PLACES[right]!;
          return t(
            `${shown} is made of ${place.en}.\n\nThe rule about that is ${right}, ${en}.\n\n**Check.** Point to the place in ${shown} the rule names, ${place.en}, and write it: the stroke the rule puts first comes first.`,
            `“${shown}”里有${place["zh-CN"]}。\n\n讲这种情况的规则是${right}。\n\n**检验。** 在“${shown}”里指出规则说的地方：${place["zh-CN"]}，照着写一遍：规则说先写的那一笔，正是先写的。`,
          );
        },
        whyNot: (wrong, _right, shown) =>
          t(
            `${wrong} is about ${PLACES[wrong]!.en}, which is not what ${shown} shows best.`,
            `${wrong}说的是${PLACES[wrong]!["zh-CN"]}，不是“${shown}”最突出的地方。`,
          ),
      },
      {
        suffix: "next",
        title: t("Following the Rules", "按规则写下一笔"),
        explanation: t(
          "When a stroke is missing, the rules say which: in 天, after the two 横 comes 撇, since 撇 goes before 捺; in 田 the last stroke is the 横 that closes it.\n\n> **Watch out.** In a frame that closes, the bottom 横 comes last, after the strokes inside: writing it before them, as in 日, is a common slip.",
          "缺了哪一笔，可以用规则来判断：写“天”，两横之后先撇后捺；写“田”，最后写封口的那一横。\n\n> **注意。** 封口的框，底下那一横最后写，要先写里面的笔画：像“日”，先写封口的横是常见的错误。",
        ),
        question: t("Which stroke comes next?", "接下来写哪一笔？"),
        items: [...basic.filter((w) => w.strokes.length >= 3), ...turning.filter((w) => w.strokes.length >= 4)].map((w) =>
          strokeAt(w, w.strokes.length - 1),
        ),
        why: placeWhy,
        whyNot: placeWhyNot,
      },
    ],
  }),
];

/** Component is a component that tells what a character is about: its form, name, meaning and characters with it. */
interface Component {
  readonly form: string;
  readonly name: string;
  readonly meaning: string;
  readonly en: string;
  readonly chars: readonly string[];
  readonly like: readonly [string, string, string];
}

/** COMPONENTS are the common components of grades 1 and 2, each with three it is taken for. */
const COMPONENTS: readonly Component[] = lines(
  `
氵 | 三点水 | 水 | water | 河 江 湖 海 洗 | 冫 讠 扌
冫 | 两点水 | 寒冷 | cold | 冰 冷 冻 凉 | 氵 讠 亻
亻 | 单人旁 | 人 | people | 你 他 们 休 住 | 彳 扌 忄
彳 | 双人旁 | 行走 | walking | 很 往 得 待 | 亻 扌 犭
口 | 口字旁 | 嘴 | the mouth | 叫 吃 喝 吹 唱 | 日 目 土
扌 | 提手旁 | 手 | the hand | 打 拍 找 拉 推 | 木 亻 犭
木 | 木字旁 | 树木 | trees and wood | 林 树 桥 村 杨 | 禾 扌 米
讠 | 言字旁 | 说话 | speaking | 说 话 请 读 让 | 氵 冫 纟
女 | 女字旁 | 女性 | women | 妈 姐 妹 奶 她 | 子 亻 纟
艹 | 草字头 | 草 | plants | 花 草 苹 菜 茶 | 竹 宀 雨
纟 | 绞丝旁 | 丝线 | thread | 红 绿 给 线 纸 | 钅 饣 讠
辶 | 走之 | 走路 | going | 这 远 近 进 送 | 足 彳 廴
宀 | 宝盖头 | 房屋 | houses | 家 字 安 室 宝 | 艹 穴 冖
犭 | 反犬旁 | 动物 | animals | 猫 狗 猪 猴 | 扌 彳 亻
钅 | 金字旁 | 金属 | metal | 钱 针 铁 钟 | 纟 饣 车
饣 | 食字旁 | 吃的 | food | 饭 饿 饱 馆 | 纟 钅 讠
忄 | 竖心旁 | 心情 | feelings | 情 快 怕 慢 | 亻 扌 小
足 | 足字旁 | 脚 | the feet | 跑 跳 踢 路 | 辶 口 走
日 | 日字旁 | 太阳和时间 | the sun and time | 明 晴 时 晚 | 目 月 口
雨 | 雨字头 | 天气 | weather | 雪 雷 雾 霜 | 宀 艹 竹
竹 | 竹字头 | 竹子 | bamboo | 笔 笑 等 答 | 艹 宀 雨
火 | 火字旁 | 火 | fire | 灯 炒 烧 烤 | 米 木 犭
月 | 月字旁 | 身体 | the body | 肚 脸 腿 胖 | 日 目 舟
目 | 目字旁 | 眼睛 | the eyes | 眼 睛 睡 盯 | 日 月 口
土 | 提土旁 | 土地 | earth | 地 场 城 块 | 扌 王 木
禾 | 禾木旁 | 庄稼 | grain | 秋 种 稻 秧 | 木 米 扌
衤 | 衣字旁 | 衣服 | clothes | 衬 衫 裤 袜 | 礻 亻 扌
`,
  6,
).map(([form, name, meaning, en, chars, like]) => {
  const l = like!.split(" ");
  if (l.length !== 3) throw new Error(`components: ${form}`);
  return { form: form!, name: name!, meaning: meaning!, en: en!, chars: chars!.split(" "), like: [l[0]!, l[1]!, l[2]!] };
});

const byForm = new Map(COMPONENTS.map((c) => [c.form, c]));

/** NAMES are the names of components that are not among those taught, as wrong answers. */
const NAMES: Readonly<Record<string, string>> = {
  廴: "建之旁",
  冖: "秃宝盖",
  穴: "穴宝盖",
  舟: "舟字旁",
  礻: "示字旁",
  小: "小字头",
  子: "子字旁",
  米: "米字旁",
  车: "车字旁",
  走: "走字旁",
  王: "王字旁",
};

const nameOf = (form: string): string => byForm.get(form)?.name ?? NAMES[form] ?? form;

/** named asks for the component of a character by its name. */
const named = (c: Component, char: string): DrillItem => drillItem(char, c.name, [nameOf(c.like[0]), nameOf(c.like[1]), nameOf(c.like[2])]);

/** found asks for the character with a component, among characters with components it is taken for. */
function found(c: Component, k: number): DrillItem {
  const others = c.like.map((f, i) => {
    const o = byForm.get(f);
    return o ? o.chars[(k + i) % o.chars.length]! : undefined;
  });
  const pool = [
    ...others.filter((x): x is string => x !== undefined),
    ...COMPONENTS.filter((o) => o !== c && !c.like.includes(o.form)).map((o) => o.chars[k % o.chars.length]!),
  ];
  const wrong = [...new Set(pool)].filter((x) => !c.chars.includes(x)).slice(0, 3);
  return drillItem(`${c.form}（${c.name}）`, c.chars[k % c.chars.length]!, [wrong[0]!, wrong[1]!, wrong[2]!]);
}

const half = Math.ceil(COMPONENTS.length / 2);

/** formOfName finds the component a name belongs to. */
const formOfName = (name: string): string =>
  COMPONENTS.find((c) => c.name === name)?.form ?? Object.entries(NAMES).find(([, n]) => n === name)?.[0] ?? name;

/** withChar finds the component a character of these topics is taught with. */
const withChar = (char: string): Component => COMPONENTS.find((c) => c.chars.includes(char))!;

/** othersWith lists two other characters with a component, for a check. */
const othersWith = (c: Component, char: string): string =>
  c.chars
    .filter((x) => x !== char)
    .slice(0, 2)
    .join("、");

/** nameWhyNot says why a name is not that of the component shown: it names a component that only looks like it. */
const nameWhyNot = (c: Component, wrong: string): Text =>
  t(
    `${wrong} is the name of ${formOfName(wrong)}, which looks like ${c.form} but is another component; this one is ${c.form}, ${c.name}.`,
    `${wrong}是“${formOfName(wrong)}”的名称，“${formOfName(wrong)}”和“${c.form}”长得像，却是另一个偏旁；这里是“${c.form}”${c.name}。`,
  );

/** componentTopic is a topic of naming and finding a group of components. */
function componentTopic(id: string, part: readonly Component[], n: number, prerequisites: readonly string[]): TopicDef {
  const forms = part.map((c) => c.form).join(" ");
  const first = part[0]!;
  const like = first.like[0];
  return drillTopic({
    id,
    title: t(`Components ${n}`, `偏旁 ${n}`),
    summary: t(`Naming and finding the components ${forms}.`, `认识偏旁 ${forms}：说出名称，找出带这个偏旁的字。`),
    intro: t(
      `Many characters have a part, the component, that hints at what they are about. Take ${first.chars[0]}: it has ${first.form}, called ${first.name}, and characters with it are often about ${first.en}. This topic names the components ${forms} and finds the characters that have them.`,
      `很多字里有一个表示意思的部分，叫偏旁。比如“${first.chars[0]}”带“${first.form}”，叫${first.name}，带它的字多和${first.meaning}有关。这个专题认识偏旁 ${forms}：说出名称，找出带它的字。`,
    ),
    prerequisites,
    strand: "characters",
    points: [
      {
        suffix: "name",
        title: t("Naming the Component", "说出偏旁"),
        explanation: t(
          `Many characters are made of a part that hints at the meaning and a part that hints at the sound. The part that hints at the meaning is the component, and each has a name: ${part.map((c) => `${c.form} ${c.name}`).join(", ")}. Look at the left of a character first, then at its top: ${first.chars[1]} has ${first.form}, so its component is ${first.name}.\n\n> **Watch out.** Components that look alike have different names: ${first.form} is ${first.name}, but ${like} is ${nameOf(like)}.`,
          `很多字由表示意思的部分和表示读音的部分组成。表示意思的部分叫偏旁，每个偏旁都有名称：${part.map((c) => `${c.form}${c.name}`).join("，")}。先看字的左边，再看字的上面：“${first.chars[1]}”带“${first.form}”，偏旁是${first.name}。\n\n> **注意。** 长得像的偏旁名称不同：“${first.form}”是${first.name}，“${like}”却是${nameOf(like)}。`,
        ),
        question: t("What is the component of this character called?", "这个字的偏旁叫什么？"),
        items: part.flatMap((c) => c.chars.map((char) => named(c, char))),
        why: (right, shown) => {
          const c = withChar(shown);
          return t(
            `${shown} has the component ${c.form}.\n\n${c.form} is called ${right}.\n\n**Check.** ${othersWith(c, shown)} have the same ${c.form}, and characters with it are often about ${c.en}.`,
            `“${shown}”带偏旁“${c.form}”。\n\n“${c.form}”叫${right}。\n\n**检验。** “${othersWith(c, shown)}”也带“${c.form}”，带它的字多和${c.meaning}有关。`,
          );
        },
        whyNot: (wrong, _right, shown) => nameWhyNot(withChar(shown), wrong),
      },
      {
        suffix: "find",
        title: t("Finding the Character", "找出带偏旁的字"),
        explanation: t(
          "Some components look alike: 氵 has three dots, 冫 two; 亻 has one stroke on the left, 彳 two; 扌 is a hand with a hook, 木 a tree. Look closely at the component before choosing: 河 has three dots, so it has 氵, not 冫.\n\n> **Watch out.** A component is not always on the left: 艹 and 宀 sit on top, and 辶 runs under the rest of the character.",
          "有些偏旁长得很像：三点水有三点，两点水只有两点；单人旁左边一撇一竖，双人旁两撇一竖；提手旁是一横一竖钩一提，木字旁是横竖撇点。选之前先看清楚偏旁：“河”左边是三点，带的是三点水，不是两点水。\n\n> **注意。** 偏旁不一定在左边：草字头、宝盖头在上面，走之在字的左下方，托着其余部分。",
        ),
        question: t("Which character has this component?", "哪个字带这个偏旁？"),
        items: part.flatMap((c) => [found(c, 0), found(c, 1)]),
        why: (right, shown) => {
          const c = withChar(right);
          return t(
            `${right} has the component ${shown}.\n\n**Check.** ${othersWith(c, right)} have the same ${c.form}, and so does ${right}.`,
            `“${right}”带偏旁${shown}。\n\n**检验。** “${othersWith(c, right)}”也带“${c.form}”，“${right}”和它们一样。`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const o = withChar(wrong);
          return t(`${wrong} has ${o.form}, ${o.name}, not ${shown}.`, `“${wrong}”带的是“${o.form}”${o.name}，不是${shown}。`);
        },
      },
    ],
  });
}

/** byMeaning finds the component whose characters are often about a meaning. */
const byMeaning = (meaning: string): Component => COMPONENTS.find((c) => c.meaning === meaning)!;

/** componentTopics are the topics of components: two groups to name and find, then what components mean. */
export const componentTopics: readonly TopicDef[] = [
  componentTopic("components-1", COMPONENTS.slice(0, half), 1, ["strokes-order"]),
  componentTopic("components-2", COMPONENTS.slice(half), 2, ["components-1"]),
  drillTopic({
    id: "components-meaning",
    title: t("What Components Mean", "偏旁表示的意思"),
    summary: t(
      "What a component tells about a character's meaning, and the component that characters share.",
      "偏旁和字的意思有什么关系，找出几个字共同的偏旁。",
    ),
    intro: t(
      "A component often tells what a character is about. Take 氵, 三点水: 河 and 洗 both have it, and both are about water. This topic goes from a component to what its characters are about, and from a few characters to the component they share.",
      "偏旁常常告诉我们字和什么有关。比如三点水“氵”：“河、洗”都带它，都和水有关。这个专题从偏旁说出字多和什么有关，再从几个字找出它们共同的偏旁。",
    ),
    prerequisites: ["components-2"],
    strand: "characters",
    points: [
      {
        suffix: "meaning",
        title: t("What a Component Means", "偏旁的意思"),
        explanation: t(
          "A component often tells what a character is about: characters with 氵 are often about water, as 河 and 洗; with 扌, about the hand, as 打 and 拍; with 口, about the mouth, as 吃 and 唱. Knowing it helps to guess a new character's meaning.\n\n> **Watch out.** A component hints at the meaning; it does not give it. 很 has 彳, the component of walking, but 很 means “very”.",
          "偏旁常常告诉我们这个字和什么有关：带三点水的字多和水有关，如“河、洗”；带提手旁的字多和手有关，如“打、拍”；带口字旁的字多和嘴有关，如“吃、唱”。知道了偏旁，就能猜出生字的意思。\n\n> **注意。** 偏旁只提示意思，并不等于字义。“很”带双人旁，双人旁多和行走有关，可“很”的意思是“非常”。",
        ),
        question: t("Characters with this component are often about what?", "带这个偏旁的字多和什么有关？"),
        items: COMPONENTS.map((c) => {
          const wrong = c.like.map((f) => byForm.get(f)?.meaning).filter((m): m is string => m !== undefined && m !== c.meaning);
          const rest = COMPONENTS.map((o) => o.meaning).filter((m) => m !== c.meaning && !wrong.includes(m));
          const three = [...wrong, ...rest].slice(0, 3);
          return drillItem(`${c.form}（${c.name}）：${c.chars.slice(0, 2).join("、")}`, c.meaning, [three[0]!, three[1]!, three[2]!]);
        }),
        why: (right) => {
          const c = byMeaning(right);
          const pair = c.chars.slice(0, 2).join("、");
          return t(
            `${pair} both have ${c.form}, ${c.name}.\n\nCharacters with ${c.form} are often about ${c.en} (${right}).\n\n**Check.** ${c.chars.length > 2 ? `${c.chars.slice(2).join("、")} have ${c.form} as well; ` : ""}the component is ${c.form}, not one that looks like it, such as ${c.like[0]}.`,
            `“${pair}”都带“${c.form}”${c.name}。\n\n带“${c.form}”的字多和${right}有关。\n\n**检验。** ${c.chars.length > 2 ? `“${c.chars.slice(2).join("、")}”也带“${c.form}”；` : ""}这里的偏旁是“${c.form}”，不是和它长得像的“${c.like[0]}”。`,
          );
        },
        whyNot: (wrong, right) => {
          const o = byMeaning(wrong);
          const c = byMeaning(right);
          return t(
            `${wrong} (${o.en}) goes with ${o.form}, ${o.name}, as in ${o.chars[0]}, not with ${c.form}.`,
            `“${wrong}”对应的是“${o.form}”${o.name}，如“${o.chars[0]}”，不是“${c.form}”。`,
          );
        },
      },
      {
        suffix: "shared",
        title: t("The Shared Component", "相同的偏旁"),
        explanation: t(
          "Characters that share a component are often about the same kind of thing: 妈, 姐 and 妹 all have 女, and are all about women of the family. Look for the part each of them has.\n\n> **Watch out.** Find the part all of them have, not a part only one or two have: 姐 has 且 as well, but 妈 and 妹 do not.",
          "偏旁相同的字，意思常常是同一类的：“妈、姐、妹”都带女字旁，都是家里的女性。要找每个字都有的那一部分。\n\n> **注意。** 要找每个字都有的部分，不是只有一两个字有的部分：“姐”里还有“且”，可“妈、妹”里没有。",
        ),
        question: t("Which component do these characters share?", "这几个字共同的偏旁是什么？"),
        items: COMPONENTS.map((c) =>
          drillItem(c.chars.slice(-3).join(" "), c.name, [nameOf(c.like[0]), nameOf(c.like[1]), nameOf(c.like[2])]),
        ),
        why: (right, shown) => {
          const c = COMPONENTS.find((x) => x.name === right)!;
          const chars = shown.split(" ");
          return t(
            `${chars.join(", ")} each have ${c.form}.\n\n${c.form} is called ${right}.\n\n**Check.** Look at each in turn: ${chars.map((x) => `${x} has ${c.form}`).join(", ")}.`,
            `“${chars.join("、")}”每个字都带“${c.form}”。\n\n“${c.form}”叫${right}。\n\n**检验。** 逐个看：${chars.map((x) => `“${x}”带“${c.form}”`).join("，")}。`,
          );
        },
        whyNot: (wrong, right) => nameWhyNot(COMPONENTS.find((x) => x.name === right)!, wrong),
      },
    ],
  }),
];
