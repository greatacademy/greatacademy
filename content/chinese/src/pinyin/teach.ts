// The texts the pinyin topics teach with (docs/chinese-curriculum.md §8.3): the four tones and their marks, how each
// initial is said, the vowel a tone mark goes on, and the spelling rules of the Scheme of the Chinese Phonetic Alphabet
// that write a final differently from its table.

import { type Text, t } from "@ga/content";

import { markAt, type Syllable, vowelsOf } from "./syllables.ts";

/** TONE_EN names the four tones in English, first to fourth. */
export const TONE_EN: readonly string[] = ["first", "second", "third", "fourth"];

/** TONE_ZH names the four tones in Chinese, first to fourth. */
export const TONE_ZH: readonly string[] = ["第一声", "第二声", "第三声", "第四声"];

/** SYMBOL are the marks of the four tones. */
export const SYMBOL: readonly string[] = ["ˉ", "ˊ", "ˇ", "ˋ"];

/** PITCH_EN says in English how the pitch of each tone moves. */
export const PITCH_EN: readonly string[] = ["high and level", "rising", "low, dipping and rising", "falling"];

/** PITCH_ZH says in Chinese how the pitch of each tone moves. */
export const PITCH_ZH: readonly string[] = ["高而平", "往上升", "先降后升", "往下降"];

/** SHAPE_EN describes in English the shape of each tone mark. */
export const SHAPE_EN: readonly string[] = ["a level line", "a line rising to the right", "a dip like a v", "a line falling to the right"];

/** SHAPE_ZH describes in Chinese the shape of each tone mark. */
export const SHAPE_ZH: readonly string[] = ["一条平线", "向右上扬的斜线", "像 v 一样向下弯", "向右下降的斜线"];

/** toneConfusion is a further reason for two tones often taken for each other, or empty. */
export function toneConfusion(a: number, b: number): Text {
  const pair = [a, b].sort().join("");
  if (pair === "24")
    return t(
      " ˊ and ˋ slant opposite ways: ˊ rises to the right, as the second tone does, and ˋ falls, as the fourth does.",
      "ˊ 和 ˋ 斜的方向相反：ˊ 向右上扬，像第二声往上升；ˋ 向右下降，像第四声往下降。",
    );
  if (pair === "23")
    return t(
      " The second tone rises straight up; the third first dips low, then comes up.",
      "第二声直接往上升；第三声先降下去，再升上来。",
    );
  if (pair === "14")
    return t(" Both start high, but the first stays there while the fourth falls.", "两个都从高处起，第一声一直保持高平，第四声却往下降。");
  return t("", "");
}

/** SAID says how each initial is said, in English and in Chinese. */
export const SAID: Readonly<Record<string, readonly [string, string]>> = {
  b: ["said with both lips, without a puff of air", "双唇音，不送气"],
  p: ["said with both lips and a puff of air", "双唇音，送气"],
  m: ["said with both lips, through the nose", "双唇鼻音"],
  f: ["said with the upper teeth on the lower lip", "唇齿音，上齿碰下唇"],
  d: ["said with the tongue tip behind the upper teeth, without a puff of air", "舌尖中音，不送气"],
  t: ["said with the tongue tip behind the upper teeth and a puff of air", "舌尖中音，送气"],
  n: ["said with the tongue tip behind the upper teeth, through the nose", "舌尖中音，鼻音"],
  l: ["said with the tongue tip behind the upper teeth, the air passing over the sides of the tongue", "舌尖中音，边音"],
  g: ["said with the back of the tongue, without a puff of air", "舌根音，不送气"],
  k: ["said with the back of the tongue and a puff of air", "舌根音，送气"],
  h: ["breathed out past the back of the tongue", "舌根音，擦音"],
  j: ["said with the flat of the tongue on the palate, without a puff of air", "舌面音，不送气"],
  q: ["said with the flat of the tongue on the palate and a puff of air", "舌面音，送气"],
  x: ["hissed with the flat of the tongue near the palate", "舌面音，擦音"],
  zh: ["said with the tongue tip curled back, without a puff of air", "翘舌音，不送气"],
  ch: ["said with the tongue tip curled back and a puff of air", "翘舌音，送气"],
  sh: ["hissed with the tongue tip curled back", "翘舌音，擦音"],
  r: ["said with the tongue tip curled back and the voice on", "翘舌音，浊音"],
  z: ["said with the tongue tip behind the front teeth, without a puff of air", "平舌音，不送气"],
  c: ["said with the tongue tip behind the front teeth and a puff of air", "平舌音，送气"],
  s: ["hissed with the tongue tip behind the front teeth", "平舌音，擦音"],
  "": ["begun with the final, with no initial", "零声母，直接从韵母开始"],
};

/** said is how an initial is said, in English and in Chinese. */
export const said = (initial: string): readonly [string, string] => SAID[initial] ?? SAID[""]!;

/** nasal says how a final ending in n or ng ends, or undefined for another final. */
export function nasal(final: string): readonly [string, string] | undefined {
  if (final.endsWith("ng")) return ["a back nasal, ending with the back of the tongue raised", "后鼻韵母，收音时舌根抬起"];
  if (final.endsWith("n")) return ["a front nasal, ending with the tongue tip behind the upper teeth", "前鼻韵母，收音时舌尖抵住上齿龈"];
  return undefined;
}

/** TONE_MARKS are the combining marks of the four tones. */
const TONE_MARKS = ["̄", "́", "̌", "̀"];

/** Untoned is a written syllable taken apart: its letters, its tone, and the index of the letter its mark is on. */
export interface Untoned {
  readonly plain: string;
  readonly tone: number;
  readonly at: number;
}

/** untone takes the tone mark off a written syllable, which may not be spelled as the rules say. */
export function untone(written: string): Untoned {
  let tone = 0;
  let at = -1;
  const chars = [...written.normalize("NFC")].map((ch, i) => {
    const nfd = ch.normalize("NFD");
    const k = TONE_MARKS.findIndex((m) => nfd.includes(m));
    if (k < 0) return ch;
    tone = k + 1;
    at = i;
    return nfd.replace(TONE_MARKS[k]!, "").normalize("NFC");
  });
  return { plain: chars.join(""), tone, at };
}

/** markedVowel is the vowel of a plain syllable that carries the tone mark. */
export const markedVowel = (plain: string): string => [...plain][markAt(plain)]!;

/** markWhere says why the tone mark of a plain syllable goes on the vowel it goes on. */
export function markWhere(plain: string): Text {
  const v = markedVowel(plain);
  const dot = v === "i" ? t(", and the dot of i gives way to the mark", "，i 上的点去掉") : t("", "");
  if (plain.includes("a")) return t(`${plain} has an a, so the mark goes on a.`, `${plain} 里有 a，调号标在 a 上。`);
  if (plain.includes("e")) return t(`${plain} has no a but an e, so the mark goes on e.`, `${plain} 里没有 a，有 e，调号标在 e 上。`);
  if (plain.includes("ou"))
    return t(`${plain} has no a or e but ou, so the mark goes on its o.`, `${plain} 里没有 a、e，有 ou，调号标在 o 上。`);
  if (vowelsOf(plain).length === 1)
    return t(
      `${plain} has one vowel, ${v}, so the mark goes on it${dot.en}.`,
      `${plain} 只有一个元音 ${v}，调号标在 ${v} 上${dot["zh-CN"]}。`,
    );
  return t(
    `${plain} has no a, e or ou, so the mark goes on the last vowel, ${v}${dot.en}.`,
    `${plain} 里没有 a、e、ou，调号标在最后一个元音 ${v} 上${dot["zh-CN"]}。`,
  );
}

/** spell writes an initial and a final of the scheme's table as the spelling rules say, without a tone. */
export function spell(initial: string, full: string): string {
  if (initial === "") {
    if (full === "i" || full === "in" || full === "ing") return `y${full}`;
    if (full === "u") return "wu";
    if (full.startsWith("ü")) return `yu${full.slice(1)}`;
    if (full.startsWith("i")) return `y${full.slice(1)}`;
    if (full.startsWith("u")) return `w${full.slice(1)}`;
    return full;
  }
  if ("jqx".includes(initial) && full.startsWith("ü")) return `${initial}u${full.slice(1)}`;
  const short: Readonly<Record<string, string>> = { iou: "iu", uei: "ui", uen: "un" };
  return initial + (short[full] ?? full);
}

/** ruleOf says which spelling rule writes a syllable's final differently from the table, and what it writes. */
export function ruleOf(s: Syllable): Text {
  const { initial, full, plain } = s;
  if (initial === "") {
    if (full === "i" || full === "in" || full === "ing")
      return t(`With no initial, ${full} is written with y before it: ${plain}.`, `没有声母时，${full} 前面加 y，写成 ${plain}。`);
    if (full === "u") return t("With no initial, u is written wu.", "没有声母时，u 写成 wu。");
    if (full.startsWith("ü"))
      return t(
        `With no initial, ${full} is written with y before it, and ü loses its two dots: ${plain}.`,
        `没有声母时，${full} 前面加 y，ü 去掉两点，写成 ${plain}。`,
      );
    if (full.startsWith("i"))
      return t(
        `With no initial, the i that begins ${full} is written y: ${plain}.`,
        `没有声母时，${full} 开头的 i 改写成 y，写成 ${plain}。`,
      );
    if (full.startsWith("u"))
      return t(
        `With no initial, the u that begins ${full} is written w: ${plain}.`,
        `没有声母时，${full} 开头的 u 改写成 w，写成 ${plain}。`,
      );
  }
  if ("jqx".includes(initial) && full.startsWith("ü"))
    return t(`After ${initial}, ü loses its two dots: ${plain}.`, `ü 跟 ${initial} 相拼时去掉两点，写成 ${plain}。`);
  if (full === "iou" || full === "uei" || full === "uen")
    return t(`After an initial, ${full} is shortened to ${s.final}: ${plain}.`, `${full} 跟声母相拼时省写成 ${s.final}，写成 ${plain}。`);
  throw new Error(`pinyin: no spelling rule writes ${plain}`);
}
