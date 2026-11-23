// Using a dictionary (docs/chinese-curriculum.md §8.1 and §18.9, grade 2): looking a character up by its pinyin, by the
// capital letter and then the syllable, and by its radical, then by the strokes left. Each is asked of characters a
// learner of grade 2 already knows: the pinyin from the recognition batches of grade 1, the radical from the components
// of grade 2 and the strokes from the standard medians the writing topics use.

import { type Text, type TopicDef, t } from "@ga/content";
import { toneless } from "@ga/subject-chinese";

import { type DrillItem, drillItem, drillTopic } from "../grammar/drill.ts";
import { strokeCount } from "../strokes/hand.ts";
import { componentTopics } from "../strokes/index.ts";
import { recognitionByGrade } from "./index.ts";

/** Radical is a radical of the dictionary: its form, its strokes, the radicals taken for it, and characters looked up under it. */
interface Radical {
  readonly form: string;
  readonly strokes: number;
  readonly like: readonly [string, string];
  readonly chars: readonly string[];
}

/**
 * RADICALS are the radicals of the components grade 2 teaches, with the strokes a dictionary counts for them and
 * characters looked up under them; a character a dictionary may file under another radical, such as 字, is left out.
 */
const RADICALS: readonly Radical[] = [
  { form: "氵", strokes: 3, like: ["冫", "讠"], chars: [..."河江湖海洗"] },
  { form: "冫", strokes: 2, like: ["氵", "讠"], chars: [..."冰冷冻凉"] },
  { form: "亻", strokes: 2, like: ["彳", "讠"], chars: [..."你他们休住"] },
  { form: "彳", strokes: 3, like: ["亻", "犭"], chars: [..."很往得待"] },
  { form: "口", strokes: 3, like: ["日", "目"], chars: [..."叫吃喝吹唱"] },
  { form: "扌", strokes: 3, like: ["木", "犭"], chars: [..."打拍找拉推"] },
  { form: "木", strokes: 4, like: ["扌", "禾"], chars: [..."林树桥村杨"] },
  { form: "讠", strokes: 2, like: ["亻", "氵"], chars: [..."说话请读让"] },
  { form: "女", strokes: 3, like: ["亻", "纟"], chars: [..."妈姐妹奶她"] },
  { form: "艹", strokes: 3, like: ["竹", "宀"], chars: [..."花草苹菜茶"] },
  { form: "纟", strokes: 3, like: ["钅", "女"], chars: [..."红绿给线纸"] },
  { form: "辶", strokes: 3, like: ["足", "彳"], chars: [..."这远近进送"] },
  { form: "宀", strokes: 3, like: ["艹", "雨"], chars: [..."家安室宝"] },
  { form: "犭", strokes: 3, like: ["彳", "扌"], chars: [..."猫狗猪猴"] },
  { form: "钅", strokes: 5, like: ["饣", "纟"], chars: [..."钱针铁钟"] },
  { form: "饣", strokes: 3, like: ["钅", "忄"], chars: [..."饭饿饱馆"] },
  { form: "忄", strokes: 3, like: ["饣", "亻"], chars: [..."情快怕慢"] },
  { form: "足", strokes: 7, like: ["辶", "口"], chars: [..."跑跳踢路"] },
  { form: "日", strokes: 4, like: ["目", "月"], chars: [..."明晴时晚"] },
  { form: "雨", strokes: 8, like: ["宀", "竹"], chars: [..."雪雷雾霜"] },
  { form: "竹", strokes: 6, like: ["艹", "雨"], chars: [..."笔笑等答"] },
  { form: "火", strokes: 4, like: ["木", "日"], chars: [..."灯炒烧烤"] },
  { form: "月", strokes: 4, like: ["日", "目"], chars: [..."肚脸腿胖"] },
  { form: "目", strokes: 5, like: ["日", "月"], chars: [..."眼睛睡盯"] },
  { form: "土", strokes: 3, like: ["扌", "木"], chars: [..."地场城块"] },
  { form: "禾", strokes: 5, like: ["木", "衤"], chars: [..."秋种稻秧"] },
  { form: "衤", strokes: 5, like: ["禾", "扌"], chars: [..."衬衫裤袜"] },
];

/** radicalName names a radical in a dictionary's list, as the answers show them. */
const radicalName = (form: string): string => (form === "竹" ? "⺮" : form === "足" ? "⻊" : form);

/** strokesOf is the strokes of a character in the standard medians, if the writing topics have it. */
const strokesOf = strokeCount;

/** radicalItems ask, for each character, its radical and the strokes left, among radicals taken for it and counts one off. */
const radicalItems: readonly DrillItem[] = RADICALS.flatMap((r) =>
  r.chars.flatMap((char) => {
    const all = strokesOf(char);
    if (all === undefined) return [];
    const left = all - r.strokes;
    if (left < 1) throw new Error(`dictionary: ${char} has no strokes beyond ${r.form}`);
    const [a, b] = r.like;
    const answer = (form: string, n: number) => `${radicalName(form)}部，${n} 画`;
    return [drillItem(char, answer(r.form, left), [answer(r.form, left + 1), answer(a, left), answer(b, left === 1 ? 2 : left - 1)])];
  }),
);

/** strokeItems ask how many strokes a character has in all, the first step of looking it up by its strokes. */
const strokeItems: readonly DrillItem[] = RADICALS.flatMap((r) =>
  r.chars.flatMap((char) => {
    const n = strokesOf(char);
    return n === undefined ? [] : [drillItem(char, `${n} 画`, [`${n - 1} 画`, `${n + 1} 画`, `${n + 2} 画`])];
  }),
);

/** Entry is a character known by grade 2 with its syllable. */
interface Entry {
  readonly char: string;
  readonly reading: string;
  /** syllable is the reading without its tone, ü written as ü. */
  readonly syllable: string;
}

/** syllableOf writes a reading without its tone, keeping ü. */
const syllableOf = (reading: string): string => toneless(reading.normalize("NFC")).replace(/v/gu, "ü");

/** ENTRIES are the characters of grade 1 with one reading, in the order taught. */
const ENTRIES: readonly Entry[] = recognitionByGrade
  .filter((g) => g.grade === 1)
  .flatMap((g) => g.batches.flatMap((b) => b.entries))
  .filter((e) => /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/u.test(e.reading.normalize("NFC")))
  .map((e) => ({ char: e.char, reading: e.reading, syllable: syllableOf(e.reading) }));

/** LETTERS_LIKE are the capital letters taken for each, among the 23 letters a syllable may start with. */
const LETTERS_LIKE: Readonly<Record<string, readonly [string, string]>> = {
  A: ["E", "O"],
  B: ["P", "D"],
  C: ["Z", "S"],
  D: ["T", "B"],
  E: ["A", "O"],
  F: ["H", "P"],
  G: ["K", "J"],
  H: ["F", "G"],
  J: ["Q", "Z"],
  K: ["G", "H"],
  L: ["N", "R"],
  M: ["N", "B"],
  N: ["L", "M"],
  O: ["A", "W"],
  P: ["B", "F"],
  Q: ["J", "X"],
  R: ["L", "Y"],
  S: ["X", "C"],
  T: ["D", "P"],
  W: ["Y", "H"],
  X: ["S", "Q"],
  Y: ["W", "J"],
  Z: ["C", "J"],
};

/** confused is a syllable a learner may take for another: zh for z and back, an for ang, in for ing, en for eng, n for l. */
function confused(s: string): string | undefined {
  const swaps: readonly [RegExp, (m: string) => string][] = [
    [/^(zh|ch|sh)/u, (m) => m[0]!],
    [/^(z|c|s)(?!h)/u, (m) => `${m}h`],
    [/ang$/u, () => "an"],
    [/eng$/u, () => "en"],
    [/ing$/u, () => "in"],
    [/(?<!i|u)an$/u, () => "ang"],
    [/en$/u, () => "eng"],
    [/in$/u, () => "ing"],
    [/^n/u, () => "l"],
    [/^l/u, () => "n"],
  ];
  for (const [re, by] of swaps) if (re.test(s)) return s.replace(re, by);
  return undefined;
}

/** letterItems ask the capital letter and then the syllable a character is looked up under. */
const letterItems: readonly DrillItem[] = ENTRIES.flatMap((e) => {
  const letter = e.syllable[0]!.toUpperCase();
  const like = LETTERS_LIKE[letter];
  const other = confused(e.syllable);
  if (!like || !other) return [];
  const answer = (l: string, s: string) => `${l}，${s}`;
  return [drillItem(e.char, answer(letter, e.syllable), [answer(letter, other), answer(like[0], e.syllable), answer(like[1], other)])];
}).filter((_, i) => i % 3 === 0);

/** dictionaryKey sorts syllables as a dictionary does, letter by letter, ü after u. */
const dictionaryKey = (s: string): string => s.replace(/ü/gu, "u~");

/** orderItems ask which of four characters of different syllables comes first in a dictionary. */
const orderItems: readonly DrillItem[] = (() => {
  const out: DrillItem[] = [];
  const pool = ENTRIES.filter((e, i) => ENTRIES.findIndex((x) => x.syllable === e.syllable) === i);
  for (let i = 0; i + 4 <= pool.length && out.length < 40; i += 7) {
    const four = [pool[i]!, pool[(i + 13) % pool.length]!, pool[(i + 29) % pool.length]!, pool[(i + 47) % pool.length]!];
    if (new Set(four.map((e) => e.syllable)).size !== 4) continue;
    const sorted = [...four].sort((a, b) => (dictionaryKey(a.syllable) < dictionaryKey(b.syllable) ? -1 : 1));
    const [first, ...rest] = sorted;
    out.push(drillItem(four.map((e) => e.char).join("　"), first!.char, [rest[0]!.char, rest[1]!.char, rest[2]!.char]));
  }
  return out;
})();

/** entryOf finds a character of grade 1 by itself. */
const entryOf = (char: string): Entry => ENTRIES.find((e) => e.char === char)!;

/** initialOf is the initial of a syllable, empty when it has none. */
const initialOf = (s: string): string => /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?/u.exec(s)![0];

/** letterWhy works out the capital letter and syllable of a character: its reading, its syllable, then a check. */
const letterWhy = (right: string, shown: string): Text => {
  const e = entryOf(shown);
  const letter = right.split("，")[0]!;
  return t(
    `${shown} is read ${e.reading}; without its tone the syllable is ${e.syllable}.\n\nThe syllable starts with ${e.syllable[0]}, so look under the capital letter ${letter}, then for ${e.syllable} under it.\n\n**Check.** Spell the syllable letter by letter, ${[...e.syllable].join("-")}: its first letter is ${e.syllable[0]}, which is ${letter}.`,
    `“${shown}”读 ${e.reading}，去掉声调，音节是 ${e.syllable}。\n\n这个音节的第一个字母是 ${e.syllable[0]}，所以先查大写字母 ${letter}，再在下面找音节 ${e.syllable}。\n\n**检验。** 把音节一个字母一个字母地拼出来：${[...e.syllable].join("-")}，第一个字母是 ${e.syllable[0]}，大写就是 ${letter}。`,
  );
};

/** letterWhyNot says what a wrong letter or syllable gets wrong. */
const letterWhyNot = (wrong: string, right: string, shown: string): Text => {
  const e = entryOf(shown);
  const [wl = "", ws = ""] = wrong.split("，");
  const [rl = ""] = right.split("，");
  const syllable = (): Text => {
    const [wi, ri] = [initialOf(ws), initialOf(e.syllable)];
    return wi !== ri
      ? t(
          `${ws} begins with ${wi}, but ${shown} (${e.reading}) begins with ${ri}`,
          `${ws} 的声母是 ${wi}，可“${shown}”（${e.reading}）的声母是 ${ri}`,
        )
      : t(
          `${ws} ends in ${ws.slice(wi.length)}, but ${shown} (${e.reading}) ends in ${e.syllable.slice(ri.length)}`,
          `${ws} 的韵母是 ${ws.slice(wi.length)}，可“${shown}”（${e.reading}）的韵母是 ${e.syllable.slice(ri.length)}`,
        );
  };
  if (wl === rl) return t(`${syllable().en}.`, `${syllable()["zh-CN"]}。`);
  if (ws === e.syllable)
    return t(
      `${wl} is not where ${e.syllable} is found: it starts with ${e.syllable[0]}, so it is under ${rl}.`,
      `${e.syllable} 不在 ${wl} 下面：它的第一个字母是 ${e.syllable[0]}，要查 ${rl}。`,
    );
  return t(
    `Both are off: ${syllable().en}, and ${e.syllable} is under ${rl}, not ${wl}.`,
    `字母和音节都不对：${syllable()["zh-CN"]}；${e.syllable} 在 ${rl} 下面，不在 ${wl} 下面。`,
  );
};

/** firstDifference is where two syllables first differ in a dictionary's order, or where the shorter ends. */
function firstDifference(a: string, b: string): { readonly at: number; readonly x?: string; readonly y?: string } {
  const [xs, ys] = [[...a], [...b]];
  for (let k = 0; k < Math.min(xs.length, ys.length); k++) if (xs[k] !== ys[k]) return { at: k, x: xs[k]!, y: ys[k]! };
  return { at: Math.min(xs.length, ys.length) };
}

/** ORDINALS name the places of letters in a syllable. */
const ORDINALS: readonly Text[] = [
  t("first", "第一"),
  t("second", "第二"),
  t("third", "第三"),
  t("fourth", "第四"),
  t("fifth", "第五"),
  t("sixth", "第六"),
];

/** comesBefore says why one syllable comes before another in a dictionary. */
const comesBefore = (a: string, b: string): Text => {
  const d = firstDifference(a, b);
  if (d.x === undefined) return t(`${a} is ${b} cut short, and the shorter comes first`, `${a} 是 ${b} 的前一部分，短的排在前面`);
  const place = ORDINALS[d.at]!;
  return t(
    `${a} and ${b} first differ at the ${place.en} letter, and ${d.x} comes before ${d.y}`,
    `${a} 和 ${b} 从${place["zh-CN"]}个字母开始不同，${d.x} 排在 ${d.y} 前面`,
  );
};

/** orderWhy sorts the syllables of the characters shown, then checks the first against the next. */
const orderWhy = (right: string, shown: string): Text => {
  const chars = shown.split("　");
  const sorted = chars.map((c) => entryOf(c)).sort((a, b) => (dictionaryKey(a.syllable) < dictionaryKey(b.syllable) ? -1 : 1));
  const list = (sep: string) => chars.map((c) => `${c} ${entryOf(c).syllable}`).join(sep);
  const order = sorted.map((e) => e.syllable).join(" → ");
  const first = entryOf(right);
  const next = sorted[1]!;
  return t(
    `Their syllables are ${list(", ")}.\n\nIn dictionary order: ${order}. So ${right}, ${first.syllable}, comes first.\n\n**Check.** ${comesBefore(first.syllable, next.syllable).en}.`,
    `它们的音节是：${list("，")}。\n\n按字典的顺序：${order}。所以“${right}”（${first.syllable}）排在最前面。\n\n**检验。** ${comesBefore(first.syllable, next.syllable)["zh-CN"]}。`,
  );
};

/** orderWhyNot says why a character does not come first: its syllable comes after the first one. */
const orderWhyNot = (wrong: string, right: string): Text => {
  const [w, r] = [entryOf(wrong), entryOf(right)];
  return t(
    `${wrong} is ${w.syllable}, which comes after ${r.syllable}: ${comesBefore(r.syllable, w.syllable).en}.`,
    `“${wrong}”的音节是 ${w.syllable}，排在 ${r.syllable} 后面：${comesBefore(r.syllable, w.syllable)["zh-CN"]}。`,
  );
};

/** radicalOf finds the radical a character is looked up under. */
const radicalOf = (char: string): Radical => RADICALS.find((r) => r.chars.includes(char))!;

/** formOf reads the radical of an answer such as 氵部，5 画, as RADICALS write it. */
const formOf = (answer: string): string => {
  const f = answer.split("部")[0]!;
  return f === "⺮" ? "竹" : f === "⻊" ? "足" : f;
};

/** radicalWhy works out a character's radical and the strokes left beyond it. */
const radicalWhy = (_right: string, shown: string): Text => {
  const r = radicalOf(shown);
  const all = strokesOf(shown)!;
  const left = all - r.strokes;
  const name = radicalName(r.form);
  return t(
    `${shown} is looked up under the radical ${name}, which has ${r.strokes} strokes.\n\n${shown} has ${all} strokes in all, so ${left} are left beyond the radical: under ${name}, look among the characters of ${left} strokes.\n\n**Check.** ${r.strokes} strokes of the radical and ${left} left make ${all}, the strokes of ${shown}.`,
    `“${shown}”要查${name}部，${name}是 ${r.strokes} 画。\n\n“${shown}”一共 ${all} 画，除去部首还有 ${left} 画：在${name}部下面找 ${left} 画的字。\n\n**检验。** 部首 ${r.strokes} 画加上剩下的 ${left} 画，正好是“${shown}”的 ${all} 画。`,
  );
};

/** radicalWhyNot says what a wrong radical or count gets wrong. */
const radicalWhyNot = (wrong: string, _right: string, shown: string): Text => {
  const r = radicalOf(shown);
  const all = strokesOf(shown)!;
  const left = all - r.strokes;
  const form = formOf(wrong);
  const n = Number(/(\d+) 画/u.exec(wrong)![1]);
  const name = radicalName(r.form);
  if (form === r.form)
    return t(
      `${n} strokes left is ${n > left ? "one too many" : "one too few"}: ${shown} has ${all} strokes, ${r.strokes} of them in ${name}, which leaves ${left}.`,
      `剩余 ${n} 画${n > left ? "多数了一画" : "少数了一画"}：“${shown}”一共 ${all} 画，${name}占 ${r.strokes} 画，剩下 ${left} 画。`,
    );
  return t(
    `${radicalName(form)} only looks like ${name}: the radical of ${shown} is ${name}, and ${left} strokes are left beyond it.`,
    `${radicalName(form)}只是和${name}长得像：“${shown}”的部首是${name}，除去部首还有 ${left} 画。`,
  );
};

/** strokesWhy works out a character's strokes as its radical and the rest. */
const strokesWhy = (right: string, shown: string): Text => {
  const r = radicalOf(shown);
  const all = strokesOf(shown)!;
  const name = radicalName(r.form);
  return t(
    `Written stroke by stroke in the standard order, ${shown} has ${all} strokes.\n\nIts radical ${name} has ${r.strokes} of them, and the rest of it ${all - r.strokes}.\n\n**Check.** ${r.strokes} + ${all - r.strokes} = ${all}: ${shown} has ${right.replace("画", "strokes")}.`,
    `按笔顺一笔一笔地写，“${shown}”一共 ${all} 画。\n\n其中部首${name}是 ${r.strokes} 画，其余部分是 ${all - r.strokes} 画。\n\n**检验。** ${r.strokes} + ${all - r.strokes} = ${all}，“${shown}”一共 ${right}。`,
  );
};

/** strokesWhyNot says what a wrong count misses or adds. */
const strokesWhyNot = (wrong: string, right: string, shown: string): Text => {
  const d = Number.parseInt(wrong, 10) - Number.parseInt(right, 10);
  if (d < 0) return t(`${wrong.replace("画", "strokes")} misses a stroke of ${shown}.`, `${wrong}漏数了“${shown}”的一画。`);
  return t(
    `${wrong.replace("画", "strokes")} counts ${d === 1 ? "one stroke" : `${d} strokes`} too many, as when a turning stroke is counted twice.`,
    `${wrong}多数了${d === 1 ? "一画" : `${d} 画`}，就像把一个带转折的笔画数成了两画。`,
  );
};

const first = ENTRIES[0]!;
const firstRadical = RADICALS.find((r) => strokesOf(r.chars[0]!) !== undefined)!;
const firstChar = firstRadical.chars[0]!;
const firstAll = strokesOf(firstChar)!;

/** dictionaryTopics are the topics of looking characters up: by pinyin, then by radical and strokes. */
export const dictionaryTopics: readonly TopicDef[] = [
  drillTopic({
    id: "dictionary-pinyin",
    title: t("Looking Up by Pinyin", "音序查字法"),
    summary: t(
      "Finding a character in a dictionary by the capital letter of its pinyin and then its syllable, and the order of syllables in a dictionary.",
      "用音序查字法查字：先查大写字母，再查音节；以及字典里音节的先后顺序。",
    ),
    intro: t(
      `When you know how a character is read, look it up by its pinyin. Take ${first.char}, read ${first.reading}: its syllable without the tone is ${first.syllable}, so find the capital letter ${first.syllable[0]!.toUpperCase()} in the index, then ${first.syllable} under it, and turn to the page given. This topic finds the letter and syllable of a character, and the order of syllables in a dictionary.`,
      `知道字的读音，就用音序查字法。比如“${first.char}”读 ${first.reading}，去掉声调，音节是 ${first.syllable}：先在索引里找大写字母 ${first.syllable[0]!.toUpperCase()}，再在下面找 ${first.syllable}，翻到它所在的那一页。这个专题练习找字母和音节，以及字典里音节的先后顺序。`,
    ),
    prerequisites: [componentTopics.at(-1)!.id],
    strand: "characters",
    points: [
      {
        suffix: "letter",
        title: t("Letter and Syllable", "大写字母和音节"),
        explanation: t(
          `When you know how a character is read, look it up by its pinyin. First find the capital letter its syllable starts with in the dictionary's index, then the syllable under that letter, without its tone, and turn to the page given: ${first.char}, ${first.reading}, is under ${first.syllable[0]!.toUpperCase()}, syllable ${first.syllable}.\n\n> **Watch out.** zh, ch and sh are found under Z, C and S, so listen carefully for the difference between z and zh, an and ang: 中 zhōng is under Z, syllable zhong, not zong.`,
          `知道字的读音，就用音序查字法：先在《汉语拼音音节索引》中找到音节的第一个字母（大写），再在这个字母下面找到这个音节（不带声调），看它在哪一页，然后翻到这一页找这个字：“${first.char}”读 ${first.reading}，查 ${first.syllable[0]!.toUpperCase()}，音节 ${first.syllable}。\n\n> **注意。** zh、ch、sh 开头的音节分别在 Z、C、S 下面，要分清 z 和 zh、an 和 ang：“中”读 zhōng，查 Z，音节是 zhong，不是 zong。`,
        ),
        question: t(
          "To look this character up by its pinyin, which capital letter and which syllable do you look for?",
          "用音序查字法查这个字，先查哪个大写字母，再查哪个音节？",
        ),
        items: letterItems,
        why: letterWhy,
        whyNot: letterWhyNot,
      },
      {
        suffix: "order",
        title: t("The Order of Syllables", "音节的顺序"),
        explanation: t(
          "A dictionary orders syllables letter by letter, as the alphabet does: ba before bai before ban, and ü after u. Compare the first letters; if they are the same, compare the second, and so on: bai and ban first differ at the third letter, and i comes before n.\n\n> **Watch out.** zh, ch and sh are not letters of their own: chi is filed under C, and comes before ci, since h comes before i.",
          "字典按字母表的顺序排列音节，一个字母一个字母地比：ba 在 bai 前面，bai 在 ban 前面，ü 排在 u 后面。先比第一个字母，相同的再比第二个，依此类推：bai 和 ban 从第三个字母开始不同，i 排在 n 前面。\n\n> **注意。** zh、ch、sh 不是单独的字母：chi 排在 C 下面，而且在 ci 前面，因为 h 排在 i 前面。",
        ),
        question: t("Which of these characters comes first in a dictionary?", "这几个字在字典里，哪个排在最前面？"),
        items: orderItems,
        why: orderWhy,
        whyNot: orderWhyNot,
      },
    ],
  }),
  drillTopic({
    id: "dictionary-radicals",
    title: t("Looking Up by Radical", "部首查字法"),
    summary: t(
      "Finding a character in a dictionary by its radical and the strokes left beyond it, and counting a character's strokes.",
      "用部首查字法查字：先查部首，再查除去部首还有几画；以及数清一个字的笔画。",
    ),
    intro: t(
      `When you do not know how a character is read, look it up by its radical. Take ${firstChar}: its radical is ${firstRadical.form}, ${firstRadical.strokes} strokes, and ${firstChar} has ${firstAll} strokes in all, so look under ${firstRadical.form} among the characters of ${firstAll - firstRadical.strokes} strokes. This topic finds a character's radical and the strokes left, and counts a character's strokes.`,
      `不知道字的读音，就用部首查字法。比如“${firstChar}”：部首是${firstRadical.form}，${firstRadical.strokes} 画；“${firstChar}”一共 ${firstAll} 画，所以在${firstRadical.form}部下面找 ${firstAll - firstRadical.strokes} 画的字。这个专题练习找部首和剩余笔画，并数清一个字的笔画。`,
    ),
    prerequisites: ["dictionary-pinyin"],
    strand: "characters",
    points: [
      {
        suffix: "radical",
        title: t("Radical and Strokes Left", "部首和剩余笔画"),
        explanation: t(
          `When you do not know how a character is read, look it up by its radical. Find the radical in the radical index, counted by its own strokes; then, under it, count the strokes of the character without the radical, and find the character among those with that many. 氵 has three strokes, 冫 two; 亻 two, 彳 three.\n\n> **Watch out.** Count the strokes left without the radical, not the whole character: ${firstChar} has ${firstAll} strokes, but under ${firstRadical.form} you look for ${firstAll - firstRadical.strokes}.`,
          `不知道字的读音，就用部首查字法：先在《部首目录》里按部首的笔画数找到部首，看它在检字表的哪一页；再数出这个字除去部首还有几画，在这一部下面找到这个笔画数，就能找到这个字。三点水是三画，两点水是两画；单人旁两画，双人旁三画。\n\n> **注意。** 要数除去部首后剩下的笔画，不是整个字的笔画：“${firstChar}”一共 ${firstAll} 画，在${firstRadical.form}部下面却要找 ${firstAll - firstRadical.strokes} 画。`,
        ),
        question: t(
          "Under which radical, and how many strokes beyond it, do you find this character?",
          "查这个字，先查什么部首，再查几画？",
        ),
        items: radicalItems,
        why: radicalWhy,
        whyNot: radicalWhyNot,
      },
      {
        suffix: "strokes",
        title: t("Counting Strokes", "数笔画"),
        explanation: t(
          `A character whose radical is hard to tell is looked up by its strokes in all. Count each stroke as you would write it: ${firstChar} is ${firstRadical.strokes} strokes of ${firstRadical.form} and ${firstAll - firstRadical.strokes} more, ${firstAll} in all.\n\n> **Watch out.** 乛, ㇆ and 𠃊 are one stroke each, though they turn: the 横折 of 口 is one stroke, so 口 has three, not four.`,
          `部首不好确定的字，可以按总笔画数查。照写字的笔顺一笔一笔地数：“${firstChar}”是${firstRadical.form}的 ${firstRadical.strokes} 画加上 ${firstAll - firstRadical.strokes} 画，一共 ${firstAll} 画。\n\n> **注意。** 横折、横折钩、竖折这样带转折的笔画，都只算一画：“口”的横折是一画，所以“口”是三画，不是四画。`,
        ),
        question: t("How many strokes does this character have?", "这个字一共有几画？"),
        items: strokeItems,
        why: strokesWhy,
        whyNot: strokesWhyNot,
      },
    ],
  }),
];
