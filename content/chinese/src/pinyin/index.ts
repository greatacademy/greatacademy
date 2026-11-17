// The pinyin topics of the Chinese subject (docs/chinese-curriculum.md §5 and §8): tones and their marks, initials,
// finals, the spelling rules of the Scheme of the Chinese Phonetic Alphabet, and the tones that change in speech while
// the written tone stays (GB/T 16159-2012). These are the topics that need no audio; listening joins them with the
// recordings (docs/chinese-development-plan.md C2.3).

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

import { gradesFiveAndSixEntries, gradesThreeAndFourEntries } from "../characters/index.ts";
import { INITIALS, mark, markAt, parseSyllable, type Syllable, TONE_NAMES, vowelsOf } from "./syllables.ts";

/** syllables are the distinct readings of the characters this subject teaches, in the order of the tables. */
const syllables: readonly Syllable[] = [
  ...new Map(
    [...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries].flatMap((e) => {
      const s = parseSyllable(e.reading);
      return s ? [[s.written, s] as const] : [];
    }),
  ).values(),
];

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
const numbered = (s: Syllable): string => `${s.plain.replace("ü", "ü")}${s.tone}`;

// Tones and their marks.

const toneExplanation = t(
  "Mandarin has four tones, and a syllable's tone changes its meaning: mā (mother), má (hemp), mǎ (horse), mà (to scold). Pinyin marks the tone over a vowel: ˉ the first tone, high and level; ˊ the second, rising; ˇ the third, low, dipping and rising; ˋ the fourth, falling. A syllable in the neutral tone, short and light, has no mark. Tones can also be typed as numbers after the syllable: ma1, ma2, ma3, ma4.",
  "普通话有四个声调，声调不同，意思就不同：mā（妈）、má（麻）、mǎ（马）、mà（骂）。拼音把声调符号标在元音上：ˉ 第一声，高而平；ˊ 第二声，往上升；ˇ 第三声，先降后升；ˋ 第四声，往下降。轻声又短又轻，不标调号。声调也可以用数字写在音节后面：ma1、ma2、ma3、ma4。",
);

const placementExplanation = t(
  "The tone mark goes on a vowel: on a if the syllable has one, else on e, else on the o of ou; otherwise on the last vowel, so liù and guì. The dot of i gives way to the mark: yī, nǐ.",
  "调号标在元音上：有 a 标在 a 上，没有 a 标在 e 上，再没有就标在 ou 的 o 上；其余的标在最后一个元音上，所以写 liù、guì。i 上标调号时去掉上面的点：yī、nǐ。",
);

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
  prerequisites: [],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-tones-naming",
      t("Reading the Tone Mark", "认读调号"),
      toneExplanation,
      choiceGenerator(
        t("Which tone does this syllable have?", "这个音节是第几声？"),
        rounds(
          spread(syllables).map(
            (s) =>
              [s.written, toneName(s.tone), [1, 2, 3, 4].filter((x) => x !== s.tone).map(toneName) as [string, string, string]] as const,
          ),
        ),
        (right, shown) =>
          t(`${shown} has the mark ${right.slice(2)}: tone ${right[0]}.`, `${shown} 的调号是 ${right.slice(2)}，读第${right[0]}声。`),
      ),
    ),
    point(
      "pinyin-tones-placing",
      t("Placing the Mark", "标调号"),
      t(`${toneExplanation.en}\n\n${placementExplanation.en}`, `${toneExplanation["zh-CN"]}\n\n${placementExplanation["zh-CN"]}`),
      choiceGenerator(
        t("Which is this syllable written with its tone mark?", "这个音节加上调号，应该怎样写？"),
        rounds(spread(placed)),
        (right, shown) =>
          t(
            `${shown} is written ${right}: tone ${shown.slice(-1)}, marked on ${[...right].find((c) => c.normalize("NFD").length > 1) ?? ""}.`,
            `${shown} 写作 ${right}：第${shown.slice(-1)}声，调号标在 ${[...right].find((c) => c.normalize("NFD").length > 1) ?? ""} 上。`,
          ),
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
const initialExplanation = t(
  "A syllable is an initial, a final and a tone. The initial is the consonant it begins with; there are 21: b p m f, d t n l, g k h, j q x, zh ch sh r, z c s. Two letters make one initial in zh, ch and sh. Some syllables have no initial and begin with their final: ài, ōu, and those written with y or w.",
  "音节由声母、韵母和声调组成。声母是音节开头的辅音，共 21 个：b p m f，d t n l，g k h，j q x，zh ch sh r，z c s。zh、ch、sh 是两个字母表示一个声母。有的音节没有声母，直接以韵母开头，比如 ài、ōu，以及用 y、w 开头的音节。",
);

/** sameFinal is a syllable of the inventory with a given initial and the final of another, if there is one. */
const sameFinal = (initial: string, s: Syllable): Syllable | undefined =>
  byInitial.get(initial)?.find((o) => o.final === s.final) ??
  byInitial.get(initial)?.[(s.written.length * 7) % (byInitial.get(initial)?.length || 1)];

const pinyinInitials: TopicDef = {
  id: "pinyin-initials",
  title: t("Initials", "声母"),
  summary: t("The 21 initials, and telling apart those that are easy to confuse.", "认识 21 个声母，分清容易混淆的声母。"),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-initials-finding",
      t("Finding the Initial", "找出声母"),
      initialExplanation,
      choiceGenerator(
        t("What is the initial of this syllable?", "这个音节的声母是什么？"),
        rounds(
          spread(withInitial).map(
            (s) => [s.written, s.initial, CONFUSED[s.initial]!.slice(0, 3) as unknown as [string, string, string]] as const,
          ),
        ),
        (right, shown) => t(`${shown} begins with the initial ${right}.`, `${shown} 的声母是 ${right}。`),
      ),
    ),
    point(
      "pinyin-initials-choosing",
      t("Choosing by the Initial", "按声母选音节"),
      initialExplanation,
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
        (right, shown) => t(`${right} begins with ${shown}.`, `${right} 的声母是 ${shown}。`),
      ),
    ),
  ],
};

// Finals.

/** plainFinal is a syllable whose final is written as in the scheme's table, after an initial. */
const plainFinal = withInitial.filter((s) => s.final === s.full);
const writtenFinals = [...new Set(plainFinal.map((s) => s.final))];
const finalExplanation = t(
  "The final is what follows the initial: one vowel (a o e i u ü), vowels together (ai ei ao ou ia ie ua uo üe iao uai), or vowels with n or ng (an en in ian uan; ang eng ing ong iang uang iong). The final carries the tone mark. Finals that sound alike are told apart by their letters: an and ang, en and eng, in and ing.",
  "韵母是声母后面的部分：单韵母（a o e i u ü）、复韵母（ai ei ao ou ia ie ua uo üe iao uai），以及带 n 或 ng 的鼻韵母（an en in ian uan；ang eng ing ong iang uang iong）。调号标在韵母上。读音相近的韵母要看清字母：an 和 ang、en 和 eng、in 和 ing。",
);

const pinyinFinals: TopicDef = {
  id: "pinyin-finals",
  title: t("Finals", "韵母"),
  summary: t(
    "Single, compound and nasal finals, and telling apart those that sound alike.",
    "认识单韵母、复韵母和鼻韵母，分清读音相近的韵母。",
  ),
  prerequisites: ["pinyin-initials"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-finals-finding",
      t("Finding the Final", "找出韵母"),
      finalExplanation,
      choiceGenerator(
        t("What is the final of this syllable?", "这个音节的韵母是什么？"),
        rounds(
          spread(plainFinal).map((s) => [s.written, s.final, nearest(s.final, writtenFinals, 3) as [string, string, string]] as const),
        ),
        (right, shown) => t(`${shown} is its initial and the final ${right}.`, `${shown} 的韵母是 ${right}。`),
      ),
    ),
    point(
      "pinyin-finals-choosing",
      t("Choosing by the Final", "按韵母选音节"),
      finalExplanation,
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
        (right, shown) => t(`${right} has the final ${shown}.`, `${right} 的韵母是 ${shown}。`),
      ),
    ),
  ],
};

// Spelling rules.

const spelled = syllables.filter((s) => s.initial + s.full !== s.plain);
const allFulls = [...new Set(syllables.map((s) => s.full))];
const spellingExplanation = t(
  "Some finals are written differently from the scheme's table. Without an initial, i, u and ü are written yi, wu and yu, and finals beginning with them begin with y or w instead: ia → ya, ie → ye, uo → wo, üe → yue. After j, q, x and y, ü loses its two dots: jū, qù, xué, yuán. After an initial, iou, uei and uen are shortened to iu, ui and un: liù, guì, lùn.",
  "有些韵母的写法和韵母表不一样。没有声母时，i、u、ü 写成 yi、wu、yu；以 i、u、ü 开头的韵母改用 y 或 w 开头：ia 写成 ya，ie 写成 ye，uo 写成 wo，üe 写成 yue。ü 跟 j、q、x、y 相拼时去掉两点：jū、qù、xué、yuán。iou、uei、uen 跟声母相拼时省写成 iu、ui、un：liù、guì、lùn。",
);

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

const pinyinSpelling: TopicDef = {
  id: "pinyin-spelling",
  title: t("Spelling Rules: y, w, ü and Shortened Finals", "拼写规则：y、w、ü 和省写"),
  summary: t(
    "Writing syllables whose finals are spelled differently from the table, and reading them back.",
    "按拼写规则写音节，并认出音节里的韵母。",
  ),
  prerequisites: ["pinyin-finals"],
  encompasses: [],
  xp: 8,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-spelling-writing",
      t("Writing the Syllable", "拼写音节"),
      spellingExplanation,
      choiceGenerator(
        t("How is this syllable written?", "这个音节应该怎样写？"),
        rounds(
          spread(spelled).flatMap((s) => {
            const wrong = threeOf(s.written, misspellings(s));
            return wrong
              ? [[`${s.initial === "" ? "" : `${s.initial} + `}${s.full} + ${toneName(s.tone)}`, s.written, wrong] as const]
              : [];
          }),
        ),
        (right, shown) => t(`${shown} is written ${right}.`, `${shown} 写作 ${right}。`),
      ),
    ),
    point(
      "pinyin-spelling-reading",
      t("Finding the Final of the Table", "认出韵母"),
      spellingExplanation,
      choiceGenerator(
        t("Which final of the table does this syllable have?", "这个音节的韵母是韵母表里的哪一个？"),
        rounds(
          spread(spelled).flatMap((s) => {
            const wrong = threeOf(s.full, [s.final, ...nearest(s.full, allFulls, 4)]);
            return wrong ? [[s.written, s.full, wrong] as const] : [];
          }),
        ),
        (right, shown) =>
          t(`${shown} has the final ${right}, written as the rules say.`, `${shown} 的韵母是 ${right}，按拼写规则写成现在的样子。`),
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

/** saidAs builds the items that ask how a syllable of a word is said, its four tones the options. */
function saidAs(
  data: string,
  at: (pinyin: string) => number,
  plain: string,
): readonly (readonly [string, string, readonly [string, string, string]])[] {
  return rows(data).map(([word, pinyin, tone]) => {
    const right = mark(plain, Number(tone));
    const wrong = [1, 2, 3, 4].filter((x) => x !== Number(tone)).map((x) => mark(plain, x)) as [string, string, string];
    if (pinyin!.split(" ")[at(pinyin!)] === undefined) throw new Error(`pinyin: ${word}`);
    return [`${word}（${pinyin}）`, right, wrong] as const;
  });
}

const yiBuExplanation = t(
  "一 and 不 change their tone in speech, but pinyin writes their own tones, yī and bù. 一 is said yí before a fourth tone (一定 yídìng) and yì before the other tones (一天 yìtiān, 一年 yìnián, 一起 yìqǐ); counted, at the end of a word or in an ordinal it keeps yī (第一, 十一). 不 is said bú before a fourth tone (不是 búshì) and keeps bù before the others (不好, 不来).",
  "“一”和“不”在说话时会变调，但拼音仍写原来的声调 yī 和 bù。“一”在第四声前读 yí（一定），在第一、二、三声前读 yì（一天、一年、一起）；单念、在词尾或表示序数时读 yī（第一、十一）。“不”在第四声前读 bú（不是），在其他声调前仍读 bù（不好、不来）。",
);

const pinyinYiBu: TopicDef = {
  id: "pinyin-yi-and-bu",
  title: t("The Tones of 一 and 不", "“一”和“不”的变调"),
  summary: t(
    "How 一 and 不 are said before other tones, while their written tones stay.",
    "“一”和“不”在不同声调前的读法，书写时仍标原调。",
  ),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 6,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-yi-and-bu-yi",
      t("Saying 一", "“一”的读法"),
      yiBuExplanation,
      choiceGenerator(
        t("How is 一 said in this word?", "这个词里的“一”读什么？"),
        rounds(
          spread(
            saidAs(yi, (p) => p.split(" ").indexOf("yī"), "yi"),
            5,
          ),
        ),
        (right, shown) => t(`In ${shown} 一 is said ${right}; it is still written yī.`, `${shown}里的“一”读 ${right}，书写时仍标 yī。`),
      ),
    ),
    point(
      "pinyin-yi-and-bu-bu",
      t("Saying 不", "“不”的读法"),
      yiBuExplanation,
      choiceGenerator(
        t("How is 不 said in this word?", "这个词里的“不”读什么？"),
        rounds(
          spread(
            saidAs(bu, () => 0, "bu"),
            5,
          ),
        ),
        (right, shown) => t(`In ${shown} 不 is said ${right}; it is still written bù.`, `${shown}里的“不”读 ${right}，书写时仍标 bù。`),
      ),
    ),
  ],
};

const thirds = rows(`
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

const thirdExplanation = t(
  "When two third tones come together, the first is said in the second tone: 你好 is written nǐ hǎo and said ní hǎo. Only the speaking changes; pinyin still writes both third tones.",
  "两个第三声连在一起时，前一个读成第二声：“你好”写作 nǐ hǎo，读作 ní hǎo。变的只是读音，拼音仍然标两个第三声。",
);

const pinyinThirdTones: TopicDef = {
  id: "pinyin-third-tones",
  title: t("Two Third Tones", "两个第三声相连"),
  summary: t(
    "Saying the first of two third tones as a second tone, while writing both as third tones.",
    "两个第三声相连时前一个读第二声，书写时仍标第三声。",
  ),
  prerequisites: ["pinyin-tones"],
  encompasses: [],
  xp: 6,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-third-tones-saying",
      t("Saying Them", "读法"),
      thirdExplanation,
      choiceGenerator(
        t("How is this word said?", "这个词实际读作什么？"),
        rounds(
          spread(
            thirds.map((w) => [`${w.word}（${w.pinyin}）`, w.said, [w.wrong[0], w.wrong[1], w.wrong[2]]] as const),
            5,
          ),
        ),
        (right, shown) =>
          t(
            `Two third tones: the first is said in the second tone, ${right}. (${shown})`,
            `两个第三声相连，前一个读第二声：${right}。（${shown}）`,
          ),
      ),
    ),
    point(
      "pinyin-third-tones-writing",
      t("Writing Them", "写法"),
      thirdExplanation,
      choiceGenerator(
        t("How is this word written in pinyin?", "这个词的拼音应该怎样写？"),
        rounds(
          spread(
            thirds.map((w) => [`${w.word}（读作 ${w.said}）`, w.pinyin, [w.said, w.wrong[0], w.wrong[1]]] as const),
            5,
          ),
        ),
        (right) => t(`Pinyin writes the original tones: ${right}.`, `拼音标原来的声调：${right}。`),
      ),
    ),
  ],
};

/** pinyinTopics are the pinyin topics, in order. */
export const pinyinTopics: readonly TopicDef[] = [pinyinTones, pinyinInitials, pinyinFinals, pinyinSpelling, pinyinYiBu, pinyinThirdTones];

/** pinyinTitle names the strand of pinyin. */
export const pinyinTitle: Text = t("Pinyin", "拼音");
