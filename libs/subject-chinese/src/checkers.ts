import { type Checker, type Json, t } from "@ga/content";

import { pinyinKey, toneless } from "./pinyin.ts";
import { strokesChecker } from "./strokes.ts";

const HALF_TO_FULL: Readonly<Record<string, string>> = {
  ",": "，",
  "?": "？",
  "!": "！",
  ":": "：",
  ";": "；",
  "(": "（",
  ")": "）",
};

/**
 * normalizeHanzi evens out what an input method varies but a reader does not see: spaces, the width of punctuation and
 * the direction of quotes. Characters are compared exactly, so a variant form stays the error it is.
 */
export function normalizeHanzi(s: string): string {
  return s
    .normalize("NFC")
    .replace(/\s+/gu, "")
    .replace(/[,?!:;()]/g, (c) => HALF_TO_FULL[c] ?? c)
    .replace(/(\p{Script=Han})\.$/u, "$1。")
    .replace(/[“”"]/g, '"')
    .replace(/[‘’']/g, "'");
}

/** withoutPunctuation keeps only letters and digits, to tell a slip in punctuation from a wrong character. */
function withoutPunctuation(s: string): string {
  return normalizeHanzi(s).replace(/[^\p{L}\p{N}]/gu, "");
}

/** listed is the strings of a checker's expected data. */
function listed(expected: Json): readonly string[] {
  return (Array.isArray(expected) ? expected : [expected]).filter((s: Json): s is string => typeof s === "string");
}

const punctuationSlip = t("The characters are right. Check the punctuation.", "字都写对了，请检查标点。");

/**
 * hanziChecker accepts any listed text, exact in characters and punctuation once spacing and the width of marks are
 * evened out; expected is an array of texts. Recited lines and typed words both use it.
 */
export const hanziChecker: Checker = {
  id: "hanzi",
  check(expected, response) {
    const texts = listed(expected);
    const given = normalizeHanzi(response);
    if (texts.some((s) => normalizeHanzi(s) === given)) return { correct: true };
    const bare = withoutPunctuation(response);
    return bare !== "" && texts.some((s) => withoutPunctuation(s) === bare)
      ? { correct: false, feedback: punctuationSlip }
      : { correct: false };
  },
  same(_expected, response, mistake) {
    return normalizeHanzi(response) === normalizeHanzi(mistake);
  },
};

const toneSlip = t("The syllables are right. Check the tones.", "音节对了，请检查声调。");

/**
 * pinyinChecker accepts any listed spelling, in tone marks or tone numbers, with ü typed as v, in either case and with
 * any spacing; expected is an array of spellings. A word with 一 or 不 lists both its spelling in the tone said and
 * the one in their own tones (see pinyinSpellings), so either is accepted.
 */
export const pinyinChecker: Checker = {
  id: "pinyin",
  check(expected, response) {
    const spellings = listed(expected);
    const given = pinyinKey(response);
    if (spellings.some((s) => pinyinKey(s) === given)) return { correct: true };
    const bare = toneless(response);
    return bare !== "" && spellings.some((s) => toneless(s) === bare) ? { correct: false, feedback: toneSlip } : { correct: false };
  },
  same(_expected, response, mistake) {
    return pinyinKey(response) === pinyinKey(mistake);
  },
};

/** chineseCheckers are the checkers of the Chinese subject. */
export const chineseCheckers: readonly Checker[] = [hanziChecker, pinyinChecker, strokesChecker];
