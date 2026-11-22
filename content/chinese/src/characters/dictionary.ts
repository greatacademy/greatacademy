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

const lookedUp = (right: string, shown: string): Text => t(`${shown}: ${right}.`, `“${shown}”：${right}。`);

/** dictionaryTopics are the topics of looking characters up: by pinyin, then by radical and strokes. */
export const dictionaryTopics: readonly TopicDef[] = [
  drillTopic({
    id: "dictionary-pinyin",
    title: t("Looking Up by Pinyin", "音序查字法"),
    summary: t(
      "Finding a character in a dictionary by the capital letter of its pinyin and then its syllable, and the order of syllables in a dictionary.",
      "用音序查字法查字：先查大写字母，再查音节；以及字典里音节的先后顺序。",
    ),
    prerequisites: [componentTopics.at(-1)!.id],
    strand: "characters",
    points: [
      {
        suffix: "letter",
        title: t("Letter and Syllable", "大写字母和音节"),
        explanation: t(
          "When you know how a character is read, look it up by its pinyin. First find the capital letter its syllable starts with in the dictionary's index, then the syllable under that letter, without its tone, and turn to the page given. zh, ch and sh are found under Z, C and S, so listen carefully for the difference between z and zh, an and ang.",
          "知道字的读音，就用音序查字法：先在《汉语拼音音节索引》中找到音节的第一个字母（大写），再在这个字母下面找到这个音节（不带声调），看它在哪一页，然后翻到这一页找这个字。zh、ch、sh 开头的音节分别在 Z、C、S 下面，要分清 z 和 zh、an 和 ang。",
        ),
        question: t(
          "To look this character up by its pinyin, which capital letter and which syllable do you look for?",
          "用音序查字法查这个字，先查哪个大写字母，再查哪个音节？",
        ),
        items: letterItems,
        why: lookedUp,
      },
      {
        suffix: "order",
        title: t("The Order of Syllables", "音节的顺序"),
        explanation: t(
          "A dictionary orders syllables letter by letter, as the alphabet does: ba before bai before ban, and ü after u. Compare the first letters; if they are the same, compare the second, and so on.",
          "字典按字母表的顺序排列音节，一个字母一个字母地比：ba 在 bai 前面，bai 在 ban 前面，ü 排在 u 后面。先比第一个字母，相同的再比第二个，依此类推。",
        ),
        question: t("Which of these characters comes first in a dictionary?", "这几个字在字典里，哪个排在最前面？"),
        items: orderItems,
        why: (right) => t(`${right} comes first.`, `“${right}”排在最前面。`),
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
    prerequisites: ["dictionary-pinyin"],
    strand: "characters",
    points: [
      {
        suffix: "radical",
        title: t("Radical and Strokes Left", "部首和剩余笔画"),
        explanation: t(
          "When you do not know how a character is read, look it up by its radical. Find the radical in the radical index, counted by its own strokes; then, under it, count the strokes of the character without the radical, and find the character among those with that many. 氵 has three strokes, 冫 two; 亻 two, 彳 three.",
          "不知道字的读音，就用部首查字法：先在《部首目录》里按部首的笔画数找到部首，看它在检字表的哪一页；再数出这个字除去部首还有几画，在这一部下面找到这个笔画数，就能找到这个字。三点水是三画，两点水是两画；单人旁两画，双人旁三画。",
        ),
        question: t(
          "Under which radical, and how many strokes beyond it, do you find this character?",
          "查这个字，先查什么部首，再查几画？",
        ),
        items: radicalItems,
        why: lookedUp,
      },
      {
        suffix: "strokes",
        title: t("Counting Strokes", "数笔画"),
        explanation: t(
          "A character whose radical is hard to tell is looked up by its strokes in all. Count each stroke as you would write it: 乛, ㇆ and 𠃊 are one stroke each, though they turn.",
          "部首不好确定的字，可以按总笔画数查。照写字的笔顺一笔一笔地数：横折、横折钩、竖折这样带转折的笔画，都只算一画。",
        ),
        question: t("How many strokes does this character have?", "这个字一共有几画？"),
        items: strokeItems,
        why: (right, shown) => t(`${shown} has ${right.replace("画", "strokes")}.`, `“${shown}”一共${right}。`),
      },
    ],
  }),
];
