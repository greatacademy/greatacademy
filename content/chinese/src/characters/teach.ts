// The shared teaching of the character topics (docs/chinese-curriculum.md §5): the names of the tones, how a reading is
// typed, and what a character is not, said by its own sound and words. Recognition (recognition.ts) and writing by hand
// (../strokes/hand.ts) build their explanations and solutions with it.

import { type Text, t } from "@ga/content";
import { pinyinKey, toneless } from "@ga/subject-chinese";

/** TONES are the names of the tones, from the light tone, 0, to the fourth. */
const TONES: readonly Text[] = [
  t("the light tone", "轻声"),
  t("the first tone", "第一声"),
  t("the second tone", "第二声"),
  t("the third tone", "第三声"),
  t("the fourth tone", "第四声"),
];

/** toneOf is the tone of a syllable of pinyin, 0 for the light tone. */
export function toneOf(reading: string): number {
  const digit = /\d/u.exec(pinyinKey(reading));
  return digit ? Number(digit[0]) : 0;
}

/** toneName names the tone of a syllable of pinyin. */
export const toneName = (reading: string): Text => TONES[toneOf(reading)]!;

/** typedAs is a reading as it may be typed with a number for its tone, ü as v: wǒ as wo3, lǜ as lv4, the light tone as 5. */
export const typedAs = (reading: string): string => {
  const tone = toneOf(reading);
  return `${toneless(reading).replaceAll("ü", "v")}${tone === 0 ? "5" : tone}`;
};

/** Known is what the reasons know of a character: its reading and the words it writes. */
export interface Known {
  readonly char: string;
  readonly reading: string;
  readonly words: readonly { readonly text: string; readonly reading: string }[];
}

/** wordsOf joins two words of a character for a sentence, in English and in Chinese. */
function wordsOf(known: Known, avoid: string): Text {
  const all = [...new Set(known.words.map((w) => w.text))];
  // Words without the right character first; a character found only beside it, as 乓 in 乒乓, is named in those.
  const apart = all.filter((w) => !w.includes(avoid));
  const two = (apart.length > 0 ? apart : all).slice(0, 2);
  return t(two.join(" and "), two.map((w) => `“${w}”`).join(""));
}

/**
 * notThis says why a character is not the one a word needs, by its own sound and its own words: another sound, the same
 * sound with another tone, or the same sound in other words. `word` is the word and `reading` the sound the gap shows.
 */
export function notThis(other: Known, right: string, word: string, reading: string): Text {
  const nfc = (s: string) => s.normalize("NFC");
  // The reading of the other character nearest the gap's: the same, else the same syllable with another tone, else its own.
  const readings = [other.reading, ...other.words.map((w) => w.reading)];
  const r = readings.find((x) => nfc(x) === nfc(reading)) ?? readings.find((x) => toneless(x) === toneless(reading)) ?? other.reading;
  const its = wordsOf({ ...other, words: [...other.words.filter((w) => nfc(w.reading) === nfc(r)), ...other.words] }, right);
  if (toneless(r) !== toneless(reading)) {
    return t(
      `${other.char} is read ${r}, not ${reading}: it is the character of ${its.en}.`,
      `“${other.char}”读 ${r}，不读 ${reading}，是${its["zh-CN"]}的“${other.char}”。`,
    );
  }
  if (toneOf(r) !== toneOf(reading)) {
    return t(
      `${other.char} is read ${r}, with ${toneName(r).en}, but the pinyin here has ${toneName(reading).en}: ${other.char} is the character of ${its.en}.`,
      `“${other.char}”读 ${r}，是${toneName(r)["zh-CN"]}，这里的拼音是${toneName(reading)["zh-CN"]}；“${other.char}”是${its["zh-CN"]}的“${other.char}”。`,
    );
  }
  return t(
    `${other.char} is also read ${r}, but it is the character of ${its.en}, not of ${word}: ${word} is written with ${right}.`,
    `“${other.char}”也读 ${r}，可它是${its["zh-CN"]}的“${other.char}”，不是“${word}”的字；“${word}”要用“${right}”。`,
  );
}
