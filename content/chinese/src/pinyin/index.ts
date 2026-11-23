// The pinyin topics of the Chinese subject (docs/chinese-curriculum.md §5 and §8): tones and their marks, initials,
// finals, the spelling rules of the Scheme of the Chinese Phonetic Alphabet, and the tones that change in speech while
// the written tone stays (GB/T 16159-2012); hearing syllables plays recordings (listening.ts).

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

import { gradesFiveAndSixEntries, gradesThreeAndFourEntries } from "../characters/index.ts";
import { pinyinHearing } from "./listening.ts";
import { type SaidWord, sayingTopic } from "./saying.ts";
import { INITIALS, mark, markAt, parseSyllable, type Syllable, TONE_NAMES, vowelsOf } from "./syllables.ts";
import {
  markedVowel,
  markWhere,
  nasal,
  PITCH_EN,
  PITCH_ZH,
  ruleOf,
  SHAPE_EN,
  SHAPE_ZH,
  SYMBOL,
  said,
  spell,
  TONE_EN,
  TONE_ZH,
  toneConfusion,
  untone,
} from "./teach.ts";

/** syllables are the distinct readings of the characters this subject teaches, in the order of the tables. */
const syllables: readonly Syllable[] = [
  ...new Map(
    [...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries].flatMap((e) => {
      const s = parseSyllable(e.reading);
      return s ? [[s.written, s] as const] : [];
    }),
  ).values(),
];

/** byWritten finds a syllable of the inventory by its written form. */
const byWritten = new Map(syllables.map((s) => [s.written, s]));

/** syllableOf is the syllable of the inventory written so; every option asked about is one. */
function syllableOf(written: string): Syllable {
  const s = byWritten.get(written);
  if (!s) throw new Error(`pinyin: ${written} is not in the inventory`);
  return s;
}

/** spread reorders a list so that neighbours are far apart: every seventh item, then the next offset, and so on. */
function spread<T>(items: readonly T[], step = 7): readonly T[] {
  return Array.from({ length: step }, (_, k) => k).flatMap((k) => items.filter((_, i) => i % step === k));
}

/** distance is the edit distance between two spellings. */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let last = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = old;
    }
  }
  return row[b.length]!;
}

/** nearest are the spellings of a list closest to one, nearest first, the list's order breaking ties. */
const nearest = (one: string, all: readonly string[], n: number): readonly string[] =>
  all
    .filter((o) => o !== one)
    .map((o, i) => [o, distance(one, o), i] as const)
    .sort((x, y) => x[1] - y[1] || x[2] - y[2])
    .slice(0, n)
    .map(([o]) => o);

/** rounds asks each item with two of its three wrong answers at a time, in three pairs, item by item within a round. */
function rounds(
  items: readonly (readonly [shown: string, right: string, wrong: readonly [string, string, string]])[],
): readonly ChoiceItem[] {
  const pairs = [
    [0, 1],
    [1, 2],
    [0, 2],
  ] as const;
  return pairs.flatMap(([a, b]) => items.map(([shown, right, wrong]): ChoiceItem => [shown, right, [wrong[a], wrong[b]]]));
}

/** threeOf is the first three distinct answers of a list that differ from the right one, or undefined if there are fewer. */
function threeOf(right: string, candidates: readonly string[]): [string, string, string] | undefined {
  const out = [...new Set(candidates.filter((c) => c !== right))];
  return out.length >= 3 ? [out[0]!, out[1]!, out[2]!] : undefined;
}

const toneName = (tone: number): string => TONE_NAMES[tone - 1]!;
const toneOfName = (name: string): number => Number(name[0]);
const numbered = (s: Syllable): string => `${s.plain}${s.tone}`;

/** MA are the four tones of ma, each a word of its own. */
const MA = ["mā (妈)", "má (麻)", "mǎ (马)", "mà (骂)"];

/** fourTones writes a plain syllable in each of the four tones. */
const fourTones = (plain: string): string => [1, 2, 3, 4].map((x) => mark(plain, x)).join(" ");

// Tones and their marks.

/** namingWhy works the tone of a written syllable: find the mark, then name its tone. */
const namingWhy = (right: string, shown: string): Text => {
  const s = syllableOf(shown);
  const n = s.tone - 1;
  const v = markedVowel(s.plain);
  return t(
    `**Step 1: find the mark.** In ${shown} the mark sits over ${v}. Its shape is ${SHAPE_EN[n]}: ${SYMBOL[n]}.\n\n**Step 2: name the tone.** ${SYMBOL[n]} marks the ${TONE_EN[n]} tone, ${PITCH_EN[n]}: ${right}.\n\n**Check.** Compare the syllable ma, whose four tones are four words: ${MA[n]} has the same mark, ${SYMBOL[n]}, and its pitch is ${PITCH_EN[n]}, as the ${TONE_EN[n]} tone's is.`,
    `**第一步：找到调号。**${shown} 的调号标在 ${v} 上，样子是${SHAPE_ZH[n]}：${SYMBOL[n]}。\n\n**第二步：说出声调。**${SYMBOL[n]} 表示${TONE_ZH[n]}，${PITCH_ZH[n]}：${right}。\n\n**检验。** 和 ma 的四个声调比一比：${MA[n]!.replace(" (", "（").replace(")", "）")}的调号也是 ${SYMBOL[n]}，读起来${PITCH_ZH[n]}，正是${TONE_ZH[n]}。`,
  );
};

/** namingWhyNot says which mark a wrong tone has, and why it is not the one shown. */
const namingWhyNot = (wrong: string, right: string, shown: string): Text => {
  const w = toneOfName(wrong) - 1;
  const r = toneOfName(right) - 1;
  const more = toneConfusion(w + 1, r + 1);
  return t(
    `${wrong}: the ${TONE_EN[w]} tone is marked ${SYMBOL[w]}, ${SHAPE_EN[w]}; the mark on ${shown} is ${SYMBOL[r]}.${more.en}`,
    `${wrong}：${TONE_ZH[w]}的调号是 ${SYMBOL[w]}，${SHAPE_ZH[w]}；${shown} 的调号是 ${SYMBOL[r]}。${more["zh-CN"]}`,
  );
};

/** placingWhy works the written form of a numbered syllable: the tone's mark, then the vowel it goes on. */
const placingWhy = (right: string, shown: string): Text => {
  const s = syllableOf(right);
  const n = s.tone - 1;
  const where = markWhere(s.plain);
  const vowels = vowelsOf(s.plain).map((i) => [...s.plain][i]!);
  const v = markedVowel(s.plain);
  return t(
    `**Step 1: the tone.** The number ${s.tone} is the ${TONE_EN[n]} tone, marked ${SYMBOL[n]}.\n\n**Step 2: the vowel.** The vowels of ${s.plain} are ${vowels.join(", ")}. ${where.en} So ${shown} is written ${right}.\n\n**Check.** The vowel does not depend on the tone: in all four tones, ${fourTones(s.plain)}, the mark of ${s.plain} sits on ${v}. Only its shape changes, and ${SYMBOL[n]} is tone ${s.tone}.`,
    `**第一步：看声调。**数字 ${s.tone} 是${TONE_ZH[n]}，调号是 ${SYMBOL[n]}。\n\n**第二步：找元音。**${s.plain} 的元音有 ${vowels.join("、")}。${where["zh-CN"]}所以 ${shown} 写作 ${right}。\n\n**检验。** 标在哪个元音上和第几声无关：四个声调 ${fourTones(s.plain)} 里，${s.plain} 的调号都标在 ${v} 上，变的只是调号的样子，${SYMBOL[n]} 是第 ${s.tone} 声。`,
  );
};

/** placingWhyNot says whether a wrong spelling has the wrong tone or puts its mark on the wrong vowel. */
const placingWhyNot = (wrong: string, right: string): Text => {
  const s = syllableOf(right);
  const w = untone(wrong);
  if (w.tone !== s.tone)
    return t(
      `${wrong} has the mark ${SYMBOL[w.tone - 1]}, tone ${w.tone}; the number ${s.tone} asks for ${SYMBOL[s.tone - 1]}.`,
      `${wrong} 标的是 ${SYMBOL[w.tone - 1]}，是第 ${w.tone} 声；数字 ${s.tone} 要标 ${SYMBOL[s.tone - 1]}。`,
    );
  const where = markWhere(s.plain);
  return t(
    `${wrong} puts the mark on ${[...w.plain][w.at]}, but ${where.en.charAt(0).toLowerCase()}${where.en.slice(1)}`,
    `${wrong} 把调号标在了 ${[...w.plain][w.at]} 上，可是 ${where["zh-CN"]}`,
  );
};

const placed = syllables.flatMap((s): readonly (readonly [string, string, readonly [string, string, string]])[] => {
  const vowels = vowelsOf(s.plain);
  if (vowels.length < 2) return [];
  const at = markAt(s.plain);
  const otherVowels = vowels.filter((v) => v !== at).map((v) => mark(s.plain, s.tone, v));
  const otherTones = [1, 2, 3, 4].filter((x) => x !== s.tone).map((x) => mark(s.plain, x));
  const wrong = threeOf(s.written, [...otherVowels, ...otherTones]);
  return wrong ? [[numbered(s), s.written, wrong] as const] : [];
});

const pinyinTones: TopicDef = {
  id: "pinyin-tones",
  title: t("Tones and Tone Marks", "声调和调号"),
  summary: t("The four tones, their marks, and the vowel a mark goes on.", "认识四个声调和调号，把调号标在正确的元音上。"),
  intro: t(
    "Mandarin has four tones, and the tone changes the meaning: mā (妈 mother), má (麻 hemp), mǎ (马 horse), mà (骂 to scold) are four different words. Pinyin draws each tone as a mark over a vowel: ˉ high and level, ˊ rising, ˇ dipping and rising, ˋ falling. A syllable in the neutral tone, short and light, has no mark. The tone can also be typed as a number after the syllable: ma3 is mǎ.\n\nThe first knowledge point reads the tone from its mark, the second writes a syllable with its mark on the right vowel.",
    "普通话有四个声调，声调不同，意思就不同：mā（妈）、má（麻）、mǎ（马）、mà（骂）是四个不同的字。拼音把声调画成元音上的调号：ˉ 高而平，ˊ 往上升，ˇ 先降后升，ˋ 往下降。轻声又短又轻，不标调号。声调也可以用数字写在音节后面：ma3 就是 mǎ。\n\n第一个知识点从调号认出声调，第二个把调号标在正确的元音上。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-tones-naming",
      t("Reading the Tone Mark", "认读调号"),
      t(
        "Find the vowel with a mark over it, then read the mark's shape: ˉ is the first tone, high and level; ˊ the second, rising; ˇ the third, low, dipping and rising; ˋ the fourth, falling. Each mark draws how the pitch moves.\n\nIn hǎo the mark over a is ˇ, a dip: hǎo is the third tone.\n\n> **Watch out.** ˊ and ˋ are easy to mix up. ˊ rises to the right, as the second tone does; ˋ falls to the right, as the fourth does: má is the second tone, mà the fourth.",
        "先找到上面有调号的元音，再看调号的样子：ˉ 是第一声，高而平；ˊ 是第二声，往上升；ˇ 是第三声，先降后升；ˋ 是第四声，往下降。调号画的就是音高的走向。\n\n比如 hǎo，a 上的调号是 ˇ，向下弯，所以 hǎo 是第三声。\n\n> **注意。** ˊ 和 ˋ 容易弄混。ˊ 向右上扬，像第二声往上升；ˋ 向右下降，像第四声往下降：má 是第二声，mà 是第四声。",
      ),
      choiceGenerator(
        t("Which tone does this syllable have?", "这个音节是第几声？"),
        rounds(
          spread(syllables).map(
            (s) =>
              [s.written, toneName(s.tone), [1, 2, 3, 4].filter((x) => x !== s.tone).map(toneName) as [string, string, string]] as const,
          ),
        ),
        namingWhy,
        namingWhyNot,
      ),
    ),
    point(
      "pinyin-tones-placing",
      t("Placing the Mark", "标调号"),
      t(
        "The tone mark goes on a vowel, chosen in this order: on a if the syllable has one; else on e; else on the o of ou; otherwise on the last vowel. The dot of i gives way to the mark: yī, nǐ.\n\nTake gui4. It has no a, e or ou, so the mark goes on the last vowel, i, and the fourth tone is ˋ: guì.\n\n> **Watch out.** In iu and ui the mark goes on the last vowel, whichever it is: liù and guì, not lìu and gùi.",
        "调号标在元音上，按这个顺序找：有 a 标在 a 上；没有 a 标在 e 上；再没有就标在 ou 的 o 上；其余的标在最后一个元音上。i 上标调号时去掉上面的点：yī、nǐ。\n\n比如 gui4：没有 a、e、ou，调号标在最后一个元音 i 上，第四声是 ˋ，写作 guì。\n\n> **注意。** iu 和 ui 都标在后一个元音上：写 liù、guì，不写 lìu、gùi。",
      ),
      choiceGenerator(
        t("Which is this syllable written with its tone mark?", "这个音节加上调号，应该怎样写？"),
        rounds(spread(placed)),
        placingWhy,
        placingWhyNot,
      ),
    ),
  ],
};

// Initials.

/** CONFUSED are, for each initial, the initials most often taken for it, nearest first. */
const CONFUSED: Readonly<Record<string, readonly string[]>> = {
  b: ["p", "m", "d", "f"],
  p: ["b", "f", "t", "m"],
  m: ["n", "b", "f", "l"],
  f: ["h", "p", "b", "s"],
  d: ["t", "b", "n", "l"],
  t: ["d", "p", "k", "n"],
  n: ["l", "m", "d", "r"],
  l: ["n", "r", "d", "t"],
  g: ["k", "h", "d", "j"],
  k: ["g", "h", "t", "q"],
  h: ["f", "k", "g", "x"],
  j: ["q", "x", "zh", "z"],
  q: ["j", "x", "ch", "c"],
  x: ["s", "sh", "q", "j"],
  zh: ["z", "ch", "j", "sh"],
  ch: ["c", "zh", "q", "sh"],
  sh: ["s", "x", "ch", "r"],
  r: ["l", "sh", "zh", "y"],
  z: ["zh", "c", "j", "s"],
  c: ["ch", "z", "q", "s"],
  s: ["sh", "x", "c", "z"],
};

const withInitial = syllables.filter((s) => s.initial !== "");
const byInitial = new Map(INITIALS.map((i) => [i, withInitial.filter((s) => s.initial === i)]));

/** sameFinal is a syllable of the inventory with a given initial and the final of another, if there is one. */
const sameFinal = (initial: string, s: Syllable): Syllable | undefined =>
  byInitial.get(initial)?.find((o) => o.final === s.final) ??
  byInitial.get(initial)?.[(s.written.length * 7) % (byInitial.get(initial)?.length || 1)];

/** rest is what is left of a written syllable once its initial is taken off. */
const rest = (s: Syllable): string => s.written.slice(s.initial.length);

/** initialStep splits a syllable at its first vowel, saying when the initial is written with two letters. */
const initialStep = (s: Syllable): Text =>
  s.initial.length === 2
    ? t(
        `The letters before the first vowel of ${s.written} are ${s.initial}: two letters, but one initial.`,
        `${s.written} 第一个元音前面的字母是 ${s.initial}：两个字母，表示一个声母。`,
      )
    : t(`The letter before the first vowel of ${s.written} is ${s.initial}.`, `${s.written} 第一个元音前面的字母是 ${s.initial}。`);

/** initialCheck puts the initial back on the rest of the syllable. */
const initialCheck = (s: Syllable): Text =>
  t(
    `**Check.** Take ${s.initial} off ${s.written}: what is left, ${rest(s)}, begins with a vowel, so no letter of the initial is left over. ${s.initial} is ${said(s.initial)[0]}.`,
    `**检验。** 把 ${s.initial} 从 ${s.written} 上去掉，剩下的 ${rest(s)} 以元音开头，声母的字母一个也没剩下。${s.initial} 是${said(s.initial)[1]}。`,
  );

/** initialWhyNot says why a wrong initial is not the one a syllable begins with. */
function initialWhyNot(wrong: string, s: Syllable): Text {
  if (s.initial.startsWith(wrong) && s.initial.length > wrong.length)
    return t(
      `${wrong} alone leaves the h behind: in ${s.written} the h after ${wrong} belongs to the initial, and ${s.initial} is one initial.`,
      `只取 ${wrong} 会把 h 漏掉：${s.written} 里 ${wrong} 后面的 h 也属于声母，${s.initial} 是一个声母。`,
    );
  if (wrong.startsWith(s.initial) && wrong.length > s.initial.length)
    return t(
      `${wrong} needs an h after ${s.initial}, and ${s.written} has none: its initial is ${s.initial}, ${said(s.initial)[0]}.`,
      `${wrong} 要在 ${s.initial} 后面有 h，${s.written} 里没有：它的声母是 ${s.initial}，${said(s.initial)[1]}。`,
    );
  return t(
    `${wrong} is ${said(wrong)[0]}; ${s.written} begins with the letter${s.initial.length === 2 ? "s" : ""} ${s.initial}, ${said(s.initial)[0]}.`,
    `${wrong} 是${said(wrong)[1]}；${s.written} 开头是 ${s.initial}，${said(s.initial)[1]}。`,
  );
}

const pinyinInitials: TopicDef = {
  id: "pinyin-initials",
  title: t("Initials", "声母"),
  summary: t("The 21 initials, and telling apart those that are easy to confuse.", "认识 21 个声母，分清容易混淆的声母。"),
  intro: t(
    "A syllable is an initial, a final and a tone. The initial is the consonant it begins with, and there are 21: b p m f, d t n l, g k h, j q x, zh ch sh r, z c s. In zhōng the initial is zh, two letters that make one sound; ōng is the final. Some syllables have no initial and begin with their final: ài, ōu, and those written with y or w.\n\nThe first knowledge point finds the initial of a syllable, the second picks out the syllable that has a given initial.",
    "音节由声母、韵母和声调组成。声母是音节开头的辅音，共 21 个：b p m f，d t n l，g k h，j q x，zh ch sh r，z c s。比如 zhōng，声母是 zh，两个字母表示一个音；ōng 是韵母。有的音节没有声母，直接以韵母开头，比如 ài、ōu，以及用 y、w 开头的音节。\n\n第一个知识点找出音节的声母，第二个找出带某个声母的音节。",
  ),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-initials-finding",
      t("Finding the Initial", "找出声母"),
      t(
        "The initial is every consonant letter before the first vowel. Most initials are one letter; zh, ch and sh are two letters that make one initial.\n\nIn shuō the letters before the first vowel u are s and h: the initial is sh, and uō is the final.\n\n> **Watch out.** Do not stop at the first letter. The initial of shuō is sh, not s; s alone would leave the h with nowhere to go.",
        "声母是第一个元音前面的所有辅音字母。大多数声母是一个字母；zh、ch、sh 是两个字母表示一个声母。\n\n比如 shuō，第一个元音 u 前面是 s 和 h，声母是 sh，uō 是韵母。\n\n> **注意。** 不要只看第一个字母。shuō 的声母是 sh，不是 s；只取 s，后面的 h 就没有着落了。",
      ),
      choiceGenerator(
        t("What is the initial of this syllable?", "这个音节的声母是什么？"),
        rounds(
          spread(withInitial).map(
            (s) => [s.written, s.initial, CONFUSED[s.initial]!.slice(0, 3) as unknown as [string, string, string]] as const,
          ),
        ),
        (right, shown) => {
          const s = syllableOf(shown);
          const step = initialStep(s);
          const check = initialCheck(s);
          return t(
            `**Step 1: split at the first vowel.** ${step.en}\n\n**Step 2: name the initial.** The initial of ${shown} is ${right}, and ${rest(s)} is its final with the tone.\n\n${check.en}`,
            `**第一步：在第一个元音前分开。**${step["zh-CN"]}\n\n**第二步：说出声母。**${shown} 的声母是 ${right}，${rest(s)} 是带调的韵母。\n\n${check["zh-CN"]}`,
          );
        },
        (wrong, _right, shown) => initialWhyNot(wrong, syllableOf(shown)),
      ),
    ),
    point(
      "pinyin-initials-choosing",
      t("Choosing by the Initial", "按声母选音节"),
      t(
        "To find the syllable with a given initial, read the letters before the first vowel of each option, all of them, and compare them with the initial letter by letter.\n\nWhich has the initial l: nù, lù or rù? Before the vowel ù they have n, l and r: lù is the one.\n\n> **Watch out.** Options that differ in one letter differ in their initial: n and l, z and zh, b and d. Read the whole initial, not its shape at a glance.",
        "要找带某个声母的音节，就把每个选项第一个元音前面的字母都读出来，和这个声母逐个字母比较。\n\n比如哪个音节的声母是 l：nù、lù 还是 rù？ù 前面分别是 n、l、r，所以是 lù。\n\n> **注意。** 差一个字母，声母就不同：n 和 l、z 和 zh、b 和 d。要把整个声母看清楚，不能只看个大概。",
      ),
      choiceGenerator(
        t("Which syllable has this initial?", "哪个音节是这个声母？"),
        rounds(
          spread(withInitial).flatMap((s) => {
            const wrong = threeOf(
              s.written,
              CONFUSED[s.initial]!.flatMap((i) => {
                const o = sameFinal(i, s);
                return o ? [o.written] : [];
              }),
            );
            return wrong ? [[s.initial, s.written, wrong] as const] : [];
          }),
        ),
        (right, shown) => {
          const s = syllableOf(right);
          const check = initialCheck(s);
          return t(
            `**Step 1: read each option's initial.** Read the letters before the first vowel of each option.\n\n**Step 2: match it.** ${right} begins with ${shown}, then the vowel: its initial is ${shown}.\n\n${check.en}`,
            `**第一步：读出每个选项的声母。**把每个选项第一个元音前面的字母读出来。\n\n**第二步：对上声母。**${right} 开头是 ${shown}，后面就是元音，它的声母是 ${shown}。\n\n${check["zh-CN"]}`,
          );
        },
        (wrong, _right, shown) => {
          const w = syllableOf(wrong);
          if (shown.startsWith(w.initial) && shown.length > w.initial.length)
            return t(
              `${wrong} begins with ${w.initial} alone, with no h after it: its initial is ${w.initial}, not ${shown}.`,
              `${wrong} 开头只有 ${w.initial}，后面没有 h：它的声母是 ${w.initial}，不是 ${shown}。`,
            );
          return t(
            `${wrong} begins with ${w.initial}, ${said(w.initial)[0]}; ${shown} is ${said(shown)[0]}.`,
            `${wrong} 的声母是 ${w.initial}，${said(w.initial)[1]}；${shown} 是${said(shown)[1]}。`,
          );
        },
      ),
    ),
  ],
};

// Finals.

/** plainFinal is a syllable whose final is written as in the scheme's table, after an initial. */
const plainFinal = withInitial.filter((s) => s.final === s.full);
const writtenFinals = [...new Set(plainFinal.map((s) => s.final))];

/** finalDifference says how a wrong final differs from the right one, by the g of a nasal or by the syllable it makes. */
function finalDifference(wrong: string, s: Syllable): Text {
  const end = nasal(s.final);
  if (`${wrong}g` === s.final && end)
    return t(
      `${wrong} ends in n; ${s.final} ends in ng, ${end[0]}, and ${s.written} has the g.`,
      `${wrong} 以 n 收尾；${s.final} 以 ng 收尾，是${end[1]}，${s.written} 里有 g。`,
    );
  if (wrong === `${s.final}g` && end)
    return t(
      `${wrong} ends in ng; ${s.final} ends in n, ${end[0]}, and ${s.written} has no g.`,
      `${wrong} 以 ng 收尾；${s.final} 以 n 收尾，是${end[1]}，${s.written} 里没有 g。`,
    );
  const would = mark(s.initial + wrong, s.tone);
  return t(
    `With ${wrong} the syllable would be ${would}; after ${s.initial}, ${s.written} has the letters ${s.final}.`,
    `韵母是 ${wrong} 的话，音节就是 ${would}；${s.written} 在 ${s.initial} 后面的字母是 ${s.final}。`,
  );
}

/** finalCheck puts the initial, the final and the tone back together. */
const finalCheck = (s: Syllable): Text =>
  t(
    `**Check.** Put it back together: ${s.initial} + ${s.final} in the ${TONE_EN[s.tone - 1]} tone gives ${s.written}, letter for letter.`,
    `**检验。** 拼回去：${s.initial} + ${s.final}，读${TONE_ZH[s.tone - 1]}，正好是 ${s.written}，一个字母不差。`,
  );

const pinyinFinals: TopicDef = {
  id: "pinyin-finals",
  title: t("Finals", "韵母"),
  summary: t(
    "Single, compound and nasal finals, and telling apart those that sound alike.",
    "认识单韵母、复韵母和鼻韵母，分清读音相近的韵母。",
  ),
  intro: t(
    "The final is what follows the initial: one vowel (a o e i u ü), vowels together (ai ei ao ou ia ie ua uo üe iao uai), or vowels with n or ng (an en in ian uan; ang eng ing ong iang uang iong). In bàn the initial is b and the final an; in bàng the final is ang, a different final and a different word. The final carries the tone mark, but the mark is not one of its letters.\n\nThe first knowledge point finds the final of a syllable, the second picks out the syllable that has a given final.",
    "韵母是声母后面的部分：单韵母（a o e i u ü）、复韵母（ai ei ao ou ia ie ua uo üe iao uai），以及带 n 或 ng 的鼻韵母（an en in ian uan；ang eng ing ong iang uang iong）。比如 bàn，声母是 b，韵母是 an；bàng 的韵母是 ang，韵母不同，就是另一个字。调号标在韵母上，但调号不算韵母的字母。\n\n第一个知识点找出音节的韵母，第二个找出带某个韵母的音节。",
  ),
  prerequisites: ["pinyin-initials"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-finals-finding",
      t("Finding the Final", "找出韵母"),
      t(
        "Take off the whole initial, then take off the tone mark: the letters left are the final.\n\nIn zhāng take off zh, which leaves āng; without its mark that is ang.\n\n> **Watch out.** an and ang, en and eng, in and ing differ only by a g. Read the final to its last letter: zhāng ends in ng, so its final is ang, not an.",
        "先去掉整个声母，再去掉调号，剩下的字母就是韵母。\n\n比如 zhāng，去掉 zh 剩下 āng，去掉调号就是 ang。\n\n> **注意。** an 和 ang、en 和 eng、in 和 ing 只差一个 g。要看到韵母的最后一个字母：zhāng 以 ng 结尾，韵母是 ang，不是 an。",
      ),
      choiceGenerator(
        t("What is the final of this syllable?", "这个音节的韵母是什么？"),
        rounds(
          spread(plainFinal).map((s) => [s.written, s.final, nearest(s.final, writtenFinals, 3) as [string, string, string]] as const),
        ),
        (right, shown) => {
          const s = syllableOf(shown);
          const check = finalCheck(s);
          return t(
            `**Step 1: take off the initial.** The initial of ${shown} is ${s.initial}; taking it off leaves ${rest(s)}.\n\n**Step 2: take off the mark.** The mark tells the tone and is not a letter of the final: the final is ${right}.\n\n${check.en}`,
            `**第一步：去掉声母。**${shown} 的声母是 ${s.initial}，去掉后剩下 ${rest(s)}。\n\n**第二步：去掉调号。**调号表示声调，不是韵母的字母：韵母是 ${right}。\n\n${check["zh-CN"]}`,
          );
        },
        (wrong, _right, shown) => finalDifference(wrong, syllableOf(shown)),
      ),
    ),
    point(
      "pinyin-finals-choosing",
      t("Choosing by the Final", "按韵母选音节"),
      t(
        "To find the syllable with a given final, take the initial off each option and compare what is left with the final, letter by letter, ignoring the mark.\n\nWhich has the final in: qīng or qín? Taking off q leaves īng and ín. īng has a g more, so it is ing; ín is exactly i and n, so qín has the final in.\n\n> **Watch out.** Take off the whole initial first. In zhèng take off zh, not just z, or the h will seem part of the final.",
        "要找带某个韵母的音节，就把每个选项的声母去掉，不看调号，把剩下的部分和这个韵母逐个字母比较。\n\n比如找韵母 in：qīng 去掉 q 剩下 īng，多了一个 g，是 ing；qín 去掉 q 剩下 ín，正好是 i 和 n，就是 in。\n\n> **注意。** 先把整个声母去掉。zhèng 要去掉 zh，不能只去掉 z，否则 h 会被当成韵母的一部分。",
      ),
      choiceGenerator(
        t("Which syllable has this final?", "哪个音节是这个韵母？"),
        rounds(
          spread(plainFinal).flatMap((s) => {
            const near = nearest(s.final, writtenFinals, 8);
            const wrong = threeOf(
              s.written,
              near.flatMap((f) => {
                const o = plainFinal.find((x) => x.final === f && x.initial === s.initial) ?? plainFinal.find((x) => x.final === f);
                return o ? [o.written] : [];
              }),
            );
            return wrong ? [[s.final, s.written, wrong] as const] : [];
          }),
        ),
        (right, shown) => {
          const s = syllableOf(right);
          const check = finalCheck(s);
          return t(
            `**Step 1: take off each initial.** Take the initial off each option and ignore the mark.\n\n**Step 2: match the final.** ${right} is ${s.initial} and ${rest(s)}: without its mark, ${shown}.\n\n${check.en}`,
            `**第一步：去掉每个选项的声母。**把每个选项的声母去掉，不看调号。\n\n**第二步：对上韵母。**${right} 是 ${s.initial} 加 ${rest(s)}，去掉调号正是 ${shown}。\n\n${check["zh-CN"]}`,
          );
        },
        (wrong, _right, shown) => {
          const w = syllableOf(wrong);
          const end = nasal(shown);
          const g =
            end && (`${w.final}g` === shown || w.final === `${shown}g`)
              ? t(` ${shown} is ${end[0]}.`, `${shown} 是${end[1]}。`)
              : t("", "");
          return t(
            `Taking ${w.initial} off ${wrong} leaves ${rest(w)}: its final is ${w.final}, not ${shown}.${g.en}`,
            `${wrong} 去掉 ${w.initial} 剩下 ${rest(w)}，韵母是 ${w.final}，不是 ${shown}。${g["zh-CN"]}`,
          );
        },
      ),
    ),
  ],
};

// Spelling rules.

const spelled = syllables.filter((s) => s.initial + s.full !== s.plain);
const allFulls = [...new Set(syllables.map((s) => s.full))];

/** misspellings are spellings a learner might give a syllable whose final is written differently: the final as in the table, y or w put before it, a wrong mark, a wrong tone. */
function misspellings(s: Syllable): readonly string[] {
  const table = s.initial + s.full;
  const out: string[] = [mark(table, s.tone)];
  if (s.initial === "") {
    const first = s.full[0] === "ü" ? "y" : s.full[0] === "u" ? "w" : "y";
    out.push(mark(first + s.full, s.tone));
    if (s.full.startsWith("ü")) out.push(mark(`yu${s.full.slice(1)}`.replace("yuu", "yu"), s.tone, 1));
  }
  if ("jqx".includes(s.initial) && s.initial !== "") out.push(mark(`${s.initial}${s.full}`.replace("ü", "u").replace("u", "ü"), s.tone));
  for (const v of vowelsOf(s.plain)) if (v !== markAt(s.plain)) out.push(mark(s.plain, s.tone, v));
  for (const x of [1, 2, 3, 4]) if (x !== s.tone) out.push(mark(s.plain, x));
  return out.filter((w) => w !== s.written);
}

/** spelledShown is how the writing knowledge point shows a syllable: its initial, its final of the table and its tone. */
const spelledShown = (s: Syllable): string => `${s.initial === "" ? "" : `${s.initial} + `}${s.full} + ${toneName(s.tone)}`;

/** bySpelledShown finds a syllable by how the writing knowledge point shows it. */
const bySpelledShown = new Map(spelled.map((s) => [spelledShown(s), s]));

/** lower starts a sentence in the middle of another. */
const lower = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1);

/** spellingWhyNot says what a wrong spelling of a syllable got wrong: the rule, the mark or the tone. */
function spellingWhyNot(wrong: string, s: Syllable): Text {
  const w = untone(wrong);
  const rule = ruleOf(s);
  if (w.plain === s.plain) {
    if (w.tone !== s.tone)
      return t(
        `${wrong} has the mark ${SYMBOL[w.tone - 1]}, the ${TONE_EN[w.tone - 1]} tone; the syllable is in the ${TONE_EN[s.tone - 1]} tone, ${SYMBOL[s.tone - 1]}.`,
        `${wrong} 标的是 ${SYMBOL[w.tone - 1]}，是${TONE_ZH[w.tone - 1]}；这个音节是${TONE_ZH[s.tone - 1]}，调号是 ${SYMBOL[s.tone - 1]}。`,
      );
    const where = markWhere(s.plain);
    return t(
      `${wrong} has the right letters, but its mark is on ${[...w.plain][w.at]}: ${lower(where.en)}`,
      `${wrong} 字母都对，调号却标在 ${[...w.plain][w.at]} 上：${where["zh-CN"]}`,
    );
  }
  if (w.plain === s.initial + s.full)
    return t(
      `${wrong} writes ${s.full} as the table has it, but the spelling rule changes it: ${lower(rule.en)}`,
      `${wrong} 照搬了韵母表里的 ${s.full}，没有按拼写规则改写：${rule["zh-CN"]}`,
    );
  if (s.initial === "" && /^[yw]/u.test(w.plain) && w.plain.slice(1) === s.full)
    return t(
      `${wrong} puts ${w.plain[0]} before ${s.full} but keeps all its letters: ${lower(rule.en)}`,
      `${wrong} 在 ${s.full} 前面加了 ${w.plain[0]}，原来的字母却一个没改：${rule["zh-CN"]}`,
    );
  return t(
    `${wrong} spells the letters ${w.plain}; by the rule, ${lower(rule.en)}`,
    `${wrong} 的字母是 ${w.plain}；按规则，${rule["zh-CN"]}`,
  );
}

/** readingWhyNot says why a wrong final of the table is not the one a written syllable stands for. */
function readingWhyNot(wrong: string, s: Syllable): Text {
  if (wrong === s.final)
    return t(
      `${wrong} is how ${s.written} writes its final once the rule has changed it; undo the rule, and the table has ${s.full}.`,
      `${wrong} 是按规则改写以后的样子；还原回去，韵母表里是 ${s.full}。`,
    );
  const would = spell(s.initial, wrong);
  if (would === s.plain)
    return t(
      `${wrong} does not go with ${s.initial}: after j, q and x a written u always stands for ü, so the final is ${s.full}.`,
      `${wrong} 不能和 ${s.initial} 相拼：j、q、x 后面写的 u 都是 ü，所以韵母是 ${s.full}。`,
    );
  return t(
    `With ${wrong} as its final, the syllable would be spelled ${would}, not ${s.plain}.`,
    `韵母如果是 ${wrong}，这个音节要写成 ${would}，不是 ${s.plain}。`,
  );
}

const pinyinSpelling: TopicDef = {
  id: "pinyin-spelling",
  title: t("Spelling Rules: y, w, ü and Shortened Finals", "拼写规则：y、w、ü 和省写"),
  summary: t(
    "Writing syllables whose finals are spelled differently from the table, and reading them back.",
    "按拼写规则写音节，并认出音节里的韵母。",
  ),
  intro: t(
    "Some finals are written differently from the scheme's table. Without an initial, i, u and ü are written yi, wu and yu, and finals beginning with them begin with y or w instead: ia → ya, uo → wo, üe → yue. After j, q, x and y, ü loses its two dots: jū, qù, xué, yuán. After an initial, iou, uei and uen are shortened to iu, ui and un: liù, guì, lùn. So the table's ü with the third tone is written yǔ, and l with iou in the fourth tone is written liù.\n\nThe first knowledge point writes a syllable by the rules, the second reads the table's final back out of a written syllable.",
    "有些韵母的写法和韵母表不一样。没有声母时，i、u、ü 写成 yi、wu、yu；以 i、u、ü 开头的韵母改用 y 或 w 开头：ia 写成 ya，uo 写成 wo，üe 写成 yue。ü 跟 j、q、x、y 相拼时去掉两点：jū、qù、xué、yuán。iou、uei、uen 跟声母相拼时省写成 iu、ui、un：liù、guì、lùn。所以韵母表里的 ü 读第三声写作 yǔ，l 加 iou 读第四声写作 liù。\n\n第一个知识点按规则写出音节，第二个从写出的音节里认出韵母表里的韵母。",
  ),
  prerequisites: ["pinyin-finals"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-spelling-writing",
      t("Writing the Syllable", "拼写音节"),
      t(
        "Write a syllable in three steps: find the rule that applies to its final, write the letters the rule gives, then put the tone mark on the vowel the order a, e, o of ou, last vowel chooses.\n\nTake ü + üe with no initial, in the fourth tone. With no initial, üe takes y before it and ü loses its dots: yue. It has an e, so the mark goes on e: yuè.\n\n> **Watch out.** ü keeps its dots after n and l: nǚ, lǜ. Only after j, q, x and y do they go, because there they cannot be taken for u; nu and lu are other syllables.",
        "写音节分三步：先找出韵母适用的拼写规则，再按规则写出字母，最后按 a、e、ou 的 o、最后一个元音的顺序标上调号。\n\n比如没有声母的 üe，读第四声：没有声母时 üe 前面加 y，ü 去掉两点，写成 yue；里面有 e，调号标在 e 上：yuè。\n\n> **注意。** ü 跟 n、l 相拼时两点不能去掉：nǚ、lǜ。只有在 j、q、x、y 后面才去掉，因为那里不会和 u 混淆；nu、lu 是另外的音节。",
      ),
      choiceGenerator(
        t("How is this syllable written?", "这个音节应该怎样写？"),
        rounds(
          spread(spelled).flatMap((s) => {
            const wrong = threeOf(s.written, misspellings(s));
            return wrong ? [[spelledShown(s), s.written, wrong] as const] : [];
          }),
        ),
        (right, shown) => {
          const s = bySpelledShown.get(shown)!;
          const rule = ruleOf(s);
          const where = markWhere(s.plain);
          const n = s.tone - 1;
          return t(
            `**Step 1: find the rule.** ${rule.en}\n\n**Step 2: place the mark.** The ${TONE_EN[n]} tone is marked ${SYMBOL[n]}. ${where.en} So the syllable is written ${right}.\n\n**Check.** Read ${right} back: without its mark it is ${s.plain}, and undoing the rule gives ${s.initial === "" ? "" : `${s.initial} + `}${s.full} again, the syllable asked for.`,
            `**第一步：找出规则。**${rule["zh-CN"]}\n\n**第二步：标调号。**${TONE_ZH[n]}的调号是 ${SYMBOL[n]}。${where["zh-CN"]}所以这个音节写作 ${right}。\n\n**检验。** 把 ${right} 读回去：去掉调号是 ${s.plain}，按规则还原又是 ${s.initial === "" ? "" : `${s.initial} + `}${s.full}，正是题目要写的音节。`,
          );
        },
        (wrong, _right, shown) => spellingWhyNot(wrong, bySpelledShown.get(shown)!),
      ),
    ),
    point(
      "pinyin-spelling-reading",
      t("Finding the Final of the Table", "认出韵母"),
      t(
        "To find the table's final in a written syllable, see which spelling rule wrote it, and undo the rule.\n\nIn liù the initial is l and the written final iu. After an initial, iou is shortened to iu, so the table's final is iou.\n\n> **Watch out.** ju, qu, xu and yu hide a ü: the dots were dropped, not the vowel changed. The final of qù is ü, not u.",
        "要认出写出来的音节里韵母表上的韵母，就看它用了哪条拼写规则，再把规则还原。\n\n比如 liù，声母是 l，写出来的韵母是 iu。iou 跟声母相拼时省写成 iu，所以韵母表里是 iou。\n\n> **注意。** ju、qu、xu、yu 里藏着 ü：去掉的是两点，元音并没有变。qù 的韵母是 ü，不是 u。",
      ),
      choiceGenerator(
        t("Which final of the table does this syllable have?", "这个音节的韵母是韵母表里的哪一个？"),
        rounds(
          spread(spelled).flatMap((s) => {
            const wrong = threeOf(s.full, [s.final, ...nearest(s.full, allFulls, 4)]);
            return wrong ? [[s.written, s.full, wrong] as const] : [];
          }),
        ),
        (right, shown) => {
          const s = syllableOf(shown);
          const rule = ruleOf(s);
          return t(
            `**Step 1: find the rule that wrote it.** ${shown} is ${s.plain} with its mark. ${rule.en}\n\n**Step 2: undo the rule.** So the final of the table is ${right}.\n\n**Check.** Write ${right} by the rules again${s.initial === "" ? "" : ` after ${s.initial}`}: it gives ${spell(s.initial, s.full)}, the letters of ${shown}.`,
            `**第一步：看用了哪条规则。**${shown} 去掉调号是 ${s.plain}。${rule["zh-CN"]}\n\n**第二步：还原规则。**所以韵母表里的韵母是 ${right}。\n\n**检验。** 再按规则把 ${right} ${s.initial === "" ? "" : `跟 ${s.initial} `}写一遍，得到 ${spell(s.initial, s.full)}，正是 ${shown} 的字母。`,
          );
        },
        (wrong, _right, shown) => readingWhyNot(wrong, syllableOf(shown)),
      ),
    ),
  ],
};

// Tone changes in speech.

/** changed writes a word's pinyin with its first syllable said in another tone. */
function retone(pinyin: string, tones: readonly number[]): string {
  return pinyin
    .split(" ")
    .map((w, i) => {
      const s = parseSyllable(w);
      return s && tones[i] !== undefined ? mark(s.plain, tones[i]) : w;
    })
    .join(" ");
}

const yi = `
一定 | yī dìng | 2
一样 | yī yàng | 2
一半 | yī bàn | 2
一共 | yī gòng | 2
一次 | yī cì | 2
一下 | yī xià | 2
一块 | yī kuài | 2
一路 | yī lù | 2
一起 | yī qǐ | 4
一天 | yī tiān | 4
一年 | yī nián | 4
一边 | yī biān | 4
一点 | yī diǎn | 4
一直 | yī zhí | 4
一百 | yī bǎi | 4
一些 | yī xiē | 4
第一 | dì yī | 1
十一 | shí yī | 1
统一 | tǒng yī | 1
唯一 | wéi yī | 1
`;

const bu = `
不是 | bù shì | 2
不会 | bù huì | 2
不对 | bù duì | 2
不去 | bù qù | 2
不要 | bù yào | 2
不用 | bù yòng | 2
不在 | bù zài | 2
不错 | bù cuò | 2
不好 | bù hǎo | 4
不来 | bù lái | 4
不吃 | bù chī | 4
不行 | bù xíng | 4
不忙 | bù máng | 4
不多 | bù duō | 4
不想 | bù xiǎng | 4
不听 | bù tīng | 4
`;

/** rows reads lines of ` | `-separated fields. */
const rows = (data: string): readonly (readonly string[])[] =>
  data
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .map((l) => l.split(" | ").map((f) => f.trim()));

/** Changing is a word with 一 or 不: its characters, its pinyin, the syllable that is 一 or 不, and the tone it is said in. */
interface Changing {
  readonly word: string;
  readonly pinyin: string;
  readonly at: number;
  readonly tone: number;
}

/** changing reads the words of 一 or 不. */
const changing = (data: string, plain: string): readonly Changing[] =>
  rows(data).map(([word, pinyin, tone]) => {
    const at = pinyin!.split(" ").findIndex((x) => parseSyllable(x)?.plain === plain);
    if (at < 0) throw new Error(`pinyin: ${word} has no ${plain}`);
    return { word: word!, pinyin: pinyin!, at, tone: Number(tone) };
  });

const yiWords = changing(yi, "yi");
const buWords = changing(bu, "bu");

/** shownWord is how a word of 一 or 不 is shown. */
const shownWord = (w: Changing): string => `${w.word}（${w.pinyin}）`;

/** saidAs builds the items that ask how 一 or 不 is said in a word, its four tones the options. */
const saidAs = (words: readonly Changing[], plain: string): readonly (readonly [string, string, readonly [string, string, string]])[] =>
  words.map((w) => {
    const right = mark(plain, w.tone);
    const wrong = [1, 2, 3, 4].filter((x) => x !== w.tone).map((x) => mark(plain, x)) as [string, string, string];
    return [shownWord(w), right, wrong] as const;
  });

/** nextTone is the tone of the syllable after 一 or 不 in a word, or undefined when it ends the word. */
const nextTone = (w: Changing): number | undefined => {
  const next = w.pinyin.split(" ")[w.at + 1];
  return next === undefined ? undefined : parseSyllable(next)?.tone;
};

/** saidWord writes a word of 一 or 不 as it is said. */
const saidWord = (w: Changing, plain: string): string =>
  w.pinyin
    .split(" ")
    .map((x, i) => (i === w.at ? mark(plain, w.tone) : x))
    .join(" ");

/** another is a different word of the list said with the same tone. */
const another = (w: Changing, words: readonly Changing[]): Changing =>
  words.find((o) => o.word !== w.word && o.tone === w.tone && (nextTone(o) ?? 0) === (nextTone(w) ?? 0)) ??
  words.find((o) => o.word !== w.word && o.tone === w.tone)!;

/** changeWhy works how 一 or 不 is said in a word: the tone after it, then the rule. */
function changeWhy(char: string, plain: string, words: readonly Changing[]) {
  const byShown = new Map(words.map((w) => [shownWord(w), w]));
  const written = mark(plain, char === "一" ? 1 : 4);
  return (right: string, shown: string): Text => {
    const w = byShown.get(shown)!;
    const next = nextTone(w);
    const nextSyllable = w.pinyin.split(" ")[w.at + 1];
    const other = another(w, words);
    const step1 =
      next === undefined
        ? t(
            `**Step 1: look after ${char}.** In ${w.word} nothing comes after ${char}: it ends the word${char === "一" && w.word.startsWith("第") ? ", an ordinal" : ""}.`,
            `**第一步：看“${char}”后面。**“${w.word}”里“${char}”后面没有别的音节，它在词尾${char === "一" && w.word.startsWith("第") ? "，表示序数" : ""}。`,
          )
        : t(
            `**Step 1: look at the tone after ${char}.** In ${w.word}, ${char} comes before ${nextSyllable}, the ${TONE_EN[next - 1]} tone.`,
            `**第一步：看“${char}”后面的声调。**“${w.word}”里“${char}”后面是 ${nextSyllable}，${TONE_ZH[next - 1]}。`,
          );
    const rule =
      next === undefined
        ? t(`At the end of a word ${char} keeps its own tone: ${right}.`, `在词尾，“${char}”读原调：${right}。`)
        : next === 4
          ? t(`Before a fourth tone ${char} is said in the second tone: ${right}.`, `在第四声前，“${char}”读第二声：${right}。`)
          : char === "一"
            ? t(
                `Before the first, second and third tones 一 is said in the fourth tone: ${right}.`,
                `在第一、二、三声前，“一”读第四声：${right}。`,
              )
            : t(`Before a tone other than the fourth, 不 keeps its own tone: ${right}.`, `在第四声以外的声调前，“不”读原调：${right}。`);
    return t(
      `${step1.en}\n\n**Step 2: apply the rule.** ${rule.en} ${right === written ? "Here the writing and the speaking agree." : `Pinyin still writes ${written}.`}\n\n**Check.** Another word with ${char} in the same place, ${other.word}, is said ${saidWord(other, plain)} the same way.`,
      `${step1["zh-CN"]}\n\n**第二步：用规则。**${rule["zh-CN"]}${right === written ? "这里写法和读法一样。" : `拼音仍写 ${written}。`}\n\n**检验。** 同样情况的另一个词“${other.word}”，也读作 ${saidWord(other, plain)}。`,
    );
  };
}

/** changeWhyNot says why 一 or 不 is not said in a wrong tone in a word. */
function changeWhyNot(char: string, plain: string, words: readonly Changing[]) {
  const byShown = new Map(words.map((w) => [shownWord(w), w]));
  const tones = char === "一" ? [1, 2, 4] : [2, 4];
  const own = char === "一" ? 1 : 4;
  return (wrong: string, _right: string, shown: string): Text => {
    const w = byShown.get(shown)!;
    const tone = untone(wrong).tone;
    const next = nextTone(w);
    const where =
      next === undefined
        ? t("it ends the word", "它在词尾")
        : t(`it comes before the ${TONE_EN[next - 1]} tone`, `它后面是${TONE_ZH[next - 1]}`);
    if (!tones.includes(tone)) {
      const list = tones.map((x) => mark(plain, x));
      return t(
        `${wrong}: ${char} is never said in the ${TONE_EN[tone - 1]} tone; it is ${list.slice(0, -1).join(", ")} or ${list.at(-1)}.`,
        `${wrong}：“${char}”从来不读${TONE_ZH[tone - 1]}，只读 ${list.slice(0, -1).join("、")} 或 ${list.at(-1)}。`,
      );
    }
    if (tone === own)
      return t(
        `${wrong} is how ${char} is written, and said ${char === "一" ? "alone or at the end of a word" : "before tones other than the fourth"}; here ${where.en}, so it changes.`,
        `${wrong} 是“${char}”的写法，${char === "一" ? "单念或在词尾" : "在第四声以外的声调前"}才这样读；这里${where["zh-CN"]}，要变调。`,
      );
    if (tone === 2)
      return t(`${wrong} is said only before a fourth tone; here ${where.en}.`, `${wrong} 只在第四声前才读；这里${where["zh-CN"]}。`);
    return t(
      `${wrong} is said before the first, second and third tones; here ${where.en}.`,
      `${wrong} 只在第一、二、三声前才读；这里${where["zh-CN"]}。`,
    );
  };
}

const pinyinYiBu: TopicDef = {
  id: "pinyin-yi-and-bu",
  title: t("The Tones of 一 and 不", "“一”和“不”的变调"),
  summary: t(
    "How 一 and 不 are said before other tones, while their written tones stay.",
    "“一”和“不”在不同声调前的读法，书写时仍标原调。",
  ),
  intro: t(
    "一 and 不 change their tone in speech, but pinyin writes their own tones, yī and bù. What they change to depends on the tone of the syllable after them. 一天 is written yī tiān: tiān is the first tone, so 一 is said yì, yìtiān. 不是 is written bù shì: shì is the fourth tone, so 不 is said bú, búshì.\n\nThe first knowledge point says 一 in a word, the second says 不.",
    "“一”和“不”在说话时会变调，但拼音仍写它们原来的声调 yī 和 bù。变成什么，要看后面那个音节的声调。“一天”写作 yī tiān，tiān 是第一声，“一”读 yì：yìtiān。“不是”写作 bù shì，shì 是第四声，“不”读 bú：búshì。\n\n第一个知识点读词里的“一”，第二个读词里的“不”。",
  ),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 6,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-yi-and-bu-yi",
      t("Saying 一", "“一”的读法"),
      t(
        "Look at the syllable after 一. Before a fourth tone 一 is said yí; before the first, second and third tones it is said yì. Alone, in counting, at the end of a word or as an ordinal it keeps yī.\n\nIn 一定 yī dìng, dìng is the fourth tone, so 一 is said yí: yídìng.\n\n> **Watch out.** 一 at the end of a word keeps yī, even after a fourth tone: 第一 is said dì yī. What decides is the syllable after 一, not the one before it.",
        "看“一”后面的音节。在第四声前，“一”读 yí；在第一、二、三声前读 yì。单念、数数、在词尾或表示序数时读 yī。\n\n比如“一定”yī dìng，dìng 是第四声，“一”读 yí：yídìng。\n\n> **注意。** 在词尾的“一”读 yī，即使前面是第四声：“第一”读 dì yī。决定读法的是“一”后面的音节，不是前面的。",
      ),
      choiceGenerator(
        t("How is 一 said in this word?", "这个词里的“一”读什么？"),
        rounds(spread(saidAs(yiWords, "yi"), 5)),
        changeWhy("一", "yi", yiWords),
        changeWhyNot("一", "yi", yiWords),
      ),
    ),
    point(
      "pinyin-yi-and-bu-bu",
      t("Saying 不", "“不”的读法"),
      t(
        "Look at the syllable after 不. Before a fourth tone 不 is said bú; before the other tones it keeps bù.\n\nIn 不是 bù shì, shì is the fourth tone, so 不 is said bú: búshì.\n\n> **Watch out.** 不 changes only before a fourth tone. 不好 bù hǎo and 不来 bù lái keep bù, however quickly they are said.",
        "看“不”后面的音节。在第四声前，“不”读 bú；在其他声调前仍读 bù。\n\n比如“不是”bù shì，shì 是第四声，“不”读 bú：búshì。\n\n> **注意。** “不”只在第四声前变调。“不好”bù hǎo、“不来”bù lái 都读 bù，说得再快也不变。",
      ),
      choiceGenerator(
        t("How is 不 said in this word?", "这个词里的“不”读什么？"),
        rounds(spread(saidAs(buWords, "bu"), 5)),
        changeWhy("不", "bu", buWords),
        changeWhyNot("不", "bu", buWords),
      ),
    ),
  ],
};

/** Third is a word of two third tones: how it is written, how it is said, and three wrong ways. */
interface Third {
  readonly word: string;
  readonly pinyin: string;
  readonly said: string;
  readonly wrong: readonly [string, string, string];
}

const thirds: readonly Third[] = rows(`
你好 | nǐ hǎo
水果 | shuǐ guǒ
雨伞 | yǔ sǎn
老虎 | lǎo hǔ
很好 | hěn hǎo
手表 | shǒu biǎo
小鸟 | xiǎo niǎo
可以 | kě yǐ
洗澡 | xǐ zǎo
展览 | zhǎn lǎn
了解 | liǎo jiě
所以 | suǒ yǐ
理想 | lǐ xiǎng
广场 | guǎng chǎng
粉笔 | fěn bǐ
古老 | gǔ lǎo
演讲 | yǎn jiǎng
美好 | měi hǎo
领导 | lǐng dǎo
厂长 | chǎng zhǎng
`).map(([word, pinyin]) => {
  const said = retone(pinyin!, [2, 3]);
  return { word: word!, pinyin: pinyin!, said, wrong: [retone(pinyin!, [3, 2]), retone(pinyin!, [2, 2]), pinyin!] as const };
});

/** thirdOther is the word after a word of two third tones, to check it against. */
const thirdOther = (w: Third): Third => thirds[(thirds.indexOf(w) + 1) % thirds.length]!;

const saidShown = (w: Third): string => `${w.word}（${w.pinyin}）`;
const writtenShown = (w: Third): string => `${w.word}（读作 ${w.said}）`;
const bySaidShown = new Map(thirds.map((w) => [saidShown(w), w]));
const byWrittenShown = new Map(thirds.map((w) => [writtenShown(w), w]));

/** thirdWhyNot says what a wrong reading or spelling of a word of two third tones changed. */
function thirdWhyNot(wrong: string, w: Third, writing: boolean): Text {
  const [first, second] = w.pinyin.split(" ");
  if (wrong === w.wrong[0])
    return t(
      `${wrong} changes the second syllable; it is the first of two third tones that changes, and ${second} keeps its third tone.`,
      `${wrong} 变的是后一个音节；两个第三声相连，变的是前一个，${second} 仍读第三声。`,
    );
  if (wrong === w.wrong[1])
    return t(
      `${wrong} puts both syllables in the second tone; the last third tone does not change, so ${second} stays.`,
      `${wrong} 把两个音节都变成了第二声；后一个第三声不变，${second} 照旧。`,
    );
  if (writing)
    return t(
      `${wrong} writes the tone that is said; pinyin writes the tone of each character, and ${w.word.charAt(0)} alone is ${first}.`,
      `${wrong} 写的是实际读音；拼音标每个字原来的声调，“${w.word.charAt(0)}”单念是 ${first}。`,
    );
  return t(
    `${wrong} is how the word is written; said, the first of the two third tones rises to the second.`,
    `${wrong} 是这个词的写法；实际说的时候，两个第三声的前一个要读成第二声。`,
  );
}

const pinyinThirdTones: TopicDef = {
  id: "pinyin-third-tones",
  title: t("Two Third Tones", "两个第三声相连"),
  summary: t(
    "Saying the first of two third tones as a second tone, while writing both as third tones.",
    "两个第三声相连时前一个读第二声，书写时仍标第三声。",
  ),
  intro: t(
    "When two third tones come together, the first is said in the second tone. 水果 is written shuǐ guǒ, both third tones; said, shuǐ rises to shuí, and the word is shuí guǒ. Only the speaking changes: pinyin still writes both third tones, the tone each character has alone.\n\nThe first knowledge point says such a word, the second writes it.",
    "两个第三声连在一起时，前一个读成第二声。“水果”写作 shuǐ guǒ，两个都是第三声；说的时候 shuǐ 读成 shuí，整个词读 shuí guǒ。变的只是读音，拼音仍然标两个第三声，也就是每个字单念时的声调。\n\n第一个知识点读这样的词，第二个写这样的词。",
  ),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 6,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-third-tones-saying",
      t("Saying Them", "读法"),
      t(
        "Look at the tones as written. If both syllables are third tones, say the first in the second tone and keep the second as it is.\n\n你好 is written nǐ hǎo: two third tones, so 你 rises, and the word is said ní hǎo.\n\n> **Watch out.** Only the first of the two changes. The last third tone keeps its tone: ní hǎo, not ní háo.",
        "先看写出来的声调。如果两个音节都是第三声，前一个读第二声，后一个不变。\n\n比如“你好”写作 nǐ hǎo，两个都是第三声，“你”读成第二声，整个词读 ní hǎo。\n\n> **注意。** 变的只是前一个。后一个第三声不变：读 ní hǎo，不读 ní háo。",
      ),
      choiceGenerator(
        t("How is this word said?", "这个词实际读作什么？"),
        rounds(
          spread(
            thirds.map((w) => [saidShown(w), w.said, [w.wrong[0], w.wrong[1], w.wrong[2]]] as const),
            5,
          ),
        ),
        (right, shown) => {
          const w = bySaidShown.get(shown)!;
          const [first, second] = w.pinyin.split(" ");
          const other = thirdOther(w);
          return t(
            `**Step 1: read the written tones.** ${w.word} is written ${w.pinyin}: ${first} and ${second} are both third tones.\n\n**Step 2: change the first.** The first of two third tones is said in the second tone, and the second stays: ${right}.\n\n**Check.** Another word of two third tones, ${other.word} ${other.pinyin}, is said ${other.said} the same way: the first rises, the last dips.`,
            `**第一步：看写出来的声调。**“${w.word}”写作 ${w.pinyin}，${first} 和 ${second} 都是第三声。\n\n**第二步：变前一个。**两个第三声相连，前一个读第二声，后一个不变：${right}。\n\n**检验。** 另一个两个第三声的词“${other.word}”${other.pinyin}，也读作 ${other.said}：前一个上升，后一个先降后升。`,
          );
        },
        (wrong, _right, shown) => thirdWhyNot(wrong, bySaidShown.get(shown)!, false),
      ),
    ),
    point(
      "pinyin-third-tones-writing",
      t("Writing Them", "写法"),
      t(
        "Pinyin writes the tone each character has alone, not the tone it is said in. A second tone heard before a third tone may be a third tone written.\n\n你好 is said ní hǎo. 你 alone is nǐ and 好 is hǎo, so the word is written nǐ hǎo.\n\n> **Watch out.** Do not write what you hear. ní hǎo is the speaking; the writing keeps both third tones: nǐ hǎo.",
        "拼音标的是每个字单念时的声调，不是说话时的读音。第三声前面听到的第二声，写的时候可能是第三声。\n\n比如“你好”读作 ní hǎo。“你”单念是 nǐ，“好”是 hǎo，所以写作 nǐ hǎo。\n\n> **注意。** 不要听到什么就写什么。ní hǎo 是读音，写的时候要标两个第三声：nǐ hǎo。",
      ),
      choiceGenerator(
        t("How is this word written in pinyin?", "这个词的拼音应该怎样写？"),
        rounds(
          spread(
            thirds.map((w) => [writtenShown(w), w.pinyin, [w.said, w.wrong[0], w.wrong[1]]] as const),
            5,
          ),
        ),
        (right, shown) => {
          const w = byWrittenShown.get(shown)!;
          const [first, second] = w.pinyin.split(" ");
          const [a, b] = [...w.word];
          return t(
            `**Step 1: take each character alone.** ${a} alone is ${first} and ${b} alone is ${second}: both third tones.\n\n**Step 2: write their own tones.** Pinyin writes the tone of each character: ${right}.\n\n**Check.** Say ${right} by the rule: two third tones, the first rises to the second, which gives ${w.said}, the reading given.`,
            `**第一步：一个字一个字地看。**“${a}”单念是 ${first}，“${b}”单念是 ${second}，都是第三声。\n\n**第二步：标原来的声调。**拼音标每个字原来的声调：${right}。\n\n**检验。** 按规则读 ${right}：两个第三声相连，前一个读第二声，得到 ${w.said}，和题目给的读音一样。`,
          );
        },
        (wrong, _right, shown) => thirdWhyNot(wrong, byWrittenShown.get(shown)!, true),
      ),
    ),
  ],
};

/** changedAt says a word of 一 or 不 in the tone it takes in speech. */
const changedAt = (words: readonly Changing[], plain: string): readonly SaidWord[] =>
  words.map((w) => ({ word: w.word, pinyin: w.pinyin, said: saidWord(w, plain) }));

/** pinyinSaying is the spoken topic: tone pairs, then the words whose tones change in speech. */
const pinyinSaying: TopicDef = sayingTopic(
  [...thirds.map((w) => ({ word: w.word, pinyin: w.pinyin, said: w.said })), ...changedAt(yiWords, "yi"), ...changedAt(buWords, "bu")],
  ["pinyin-hearing", "pinyin-yi-and-bu", "pinyin-third-tones"],
);

/** pinyinTopics are the pinyin topics, in order. */
export const pinyinTopics: readonly TopicDef[] = [
  pinyinTones,
  pinyinInitials,
  pinyinFinals,
  pinyinSpelling,
  pinyinHearing,
  pinyinYiBu,
  pinyinThirdTones,
  pinyinSaying,
];

/** pinyinTitle names the strand of pinyin. */
export const pinyinTitle: Text = t("Pinyin", "拼音");
