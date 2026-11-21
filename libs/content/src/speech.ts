import { t } from "./text.ts";
import type { Checker, Json } from "./types.ts";

/** HeardWord is one word of what a speech service heard, with its score when pronunciation was assessed. */
export interface HeardWord {
  readonly word: string;
  /** accuracy is how well the word was pronounced, from 0 to 100, when assessed. */
  readonly accuracy?: number;
  /** error is what an assessment against a reference found: a word left out, added, or said so that it was hard to recognize. */
  readonly error?: "omission" | "insertion" | "mispronunciation";
  /** pinyin is the reading the reference gives a syllable of Chinese, when the service says it. */
  readonly pinyin?: string;
  /** wrong are the parts of a syllable of Chinese the assessment found wrong. */
  readonly wrong?: readonly SyllablePart[];
}

/** SyllablePart is a part of a syllable of Chinese that can be said wrong: its initial, its final or its tone. */
export type SyllablePart = "initial" | "final" | "tone";

/**
 * Heard is what a speech service heard in a recording: the response to a
 * spoken problem. The server writes it from the service's answer, never the
 * client, and the checker reads it.
 */
export interface Heard {
  /** text is the words heard, as the service wrote them for reading. */
  readonly text: string;
  /** lexical is the words heard as said, when the service gives them: numbers and symbols in words, as "fifteen dollars" for "$15". */
  readonly lexical?: string;
  /** confidence is the service's confidence in the text, from 0 to 1. */
  readonly confidence: number;
  /** seconds is how long the speech lasted. */
  readonly seconds: number;
  /** accuracy, fluency and completeness are the assessment's scores from 0 to 100, when pronunciation was assessed. */
  readonly accuracy?: number;
  readonly fluency?: number;
  readonly completeness?: number;
  readonly words?: readonly HeardWord[];
}

/** SpeechMode is what a spoken problem asks: to repeat what was heard, to read a text aloud, or to say a sentence of one's own under a rule. */
export type SpeechMode = "repeat" | "read" | "say";

/** SpeechExpected is the speech checker's data. */
export interface SpeechExpected {
  readonly mode: SpeechMode;
  /** reference is the text to repeat or read. */
  readonly reference?: string;
  /** accept are the sentences that answer a "say" problem; any of them, in its normal form, is correct. */
  readonly accept?: readonly string[];
  /** minAccuracy is the pronunciation accuracy needed when pronunciation was assessed (*starting* 60). */
  readonly minAccuracy?: number;
}

/** MIN_CONFIDENCE is the confidence below which a recording that would be wrong is asked again and counts nothing (*starting*). */
export const MIN_CONFIDENCE = 0.5;

/** MIN_ACCURACY is the pronunciation accuracy a word or text needs when assessed (*starting*): low enough that an accent that is understood passes. */
export const MIN_ACCURACY = 60;

/**
 * READ_SHARE is the share of a reference's words that must be heard in order (*starting*): 95%, the accuracy at which a
 * text is read independently, so that a word read wrong fails a sentence of fewer than twenty words and a speech service's
 * slip in a longer text does not.
 */
export const READ_SHARE = 0.95;

/** MAX_HEARD_CHARS is the longest response a spoken problem takes. */
export const MAX_HEARD_CHARS = 8000;

/** heardResponse writes what was heard as the response of a spoken problem. */
export function heardResponse(heard: Heard): string {
  return JSON.stringify(heard);
}

const score = (v: unknown) => (typeof v === "number" && v >= 0 && v <= 100 ? v : undefined);

/** parseHeard reads a spoken problem's response, or undefined when it is not one. */
export function parseHeard(response: string): Heard | undefined {
  let v: unknown;
  try {
    v = JSON.parse(response);
  } catch {
    return undefined;
  }
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  if (typeof o.text !== "string" || typeof o.confidence !== "number" || typeof o.seconds !== "number") return undefined;
  const words = Array.isArray(o.words)
    ? o.words.flatMap((w): HeardWord[] => {
        if (!w || typeof w !== "object" || typeof (w as { word?: unknown }).word !== "string") return [];
        const x = w as Record<string, unknown>;
        const error = x.error === "omission" || x.error === "insertion" || x.error === "mispronunciation" ? x.error : undefined;
        const wrong = Array.isArray(x.wrong)
          ? x.wrong.filter((p): p is SyllablePart => p === "initial" || p === "final" || p === "tone")
          : [];
        return [
          {
            word: x.word as string,
            ...(score(x.accuracy) !== undefined && { accuracy: score(x.accuracy) }),
            ...(error && { error }),
            ...(typeof x.pinyin === "string" && x.pinyin.length <= 8 && { pinyin: x.pinyin }),
            ...(wrong.length > 0 && { wrong: [...new Set(wrong)] }),
          },
        ];
      })
    : undefined;
  return {
    text: o.text,
    ...(typeof o.lexical === "string" && { lexical: o.lexical }),
    confidence: o.confidence,
    seconds: o.seconds,
    ...(score(o.accuracy) !== undefined && { accuracy: score(o.accuracy) }),
    ...(score(o.fluency) !== undefined && { fluency: score(o.fluency) }),
    ...(score(o.completeness) !== undefined && { completeness: score(o.completeness) }),
    ...(words && { words }),
  };
}

const CONTRACTIONS: readonly (readonly [RegExp, string])[] = [
  [/\bcan't\b/g, "cannot"],
  [/\bwon't\b/g, "will not"],
  [/\bshan't\b/g, "shall not"],
  [/\b(\w+)n't\b/g, "$1 not"],
  [/\bi'm\b/g, "i am"],
  [/\b(\w+)'re\b/g, "$1 are"],
  [/\b(\w+)'ve\b/g, "$1 have"],
  [/\b(\w+)'ll\b/g, "$1 will"],
  [/\b(\w+)'d\b/g, "$1 would"],
  [/\b(he|she|it|that|there|what|who|where|here)'s\b/g, "$1 is"],
  [/\blet's\b/g, "let us"],
  [/\bok\b/g, "okay"],
];

const ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** numberWords says a whole number below 100 in words, as "twenty five", or gives it back as it is. */
function numberWords(w: string): string {
  if (!/^\d{1,2}$/.test(w)) return w;
  const n = Number(w);
  if (n < 20) return ONES[n]!;
  return n % 10 === 0 ? TENS[n / 10]! : `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}`;
}

/**
 * spokenWords turns a text into the words a listener hears: lower case, no
 * punctuation, contractions said in full, "OK" as "okay" and numbers below 100 in
 * words, since a speech service may write either form of what was said. A
 * Chinese character is a word of its own, one syllable, since Chinese is written
 * without spaces.
 */
export function spokenWords(text: string): string[] {
  let s = text.normalize("NFKC").toLowerCase().replace(/[‘’]/g, "'");
  for (const [re, by] of CONTRACTIONS) s = s.replace(re, by);
  return s
    .replace(/[^\p{L}\p{N}'\s-]/gu, " ")
    .replace(/(^|\s)'|'(\s|$)/g, " ")
    .replace(/\p{Script=Han}/gu, " $& ")
    .split(/[\s-]+/u)
    .filter(Boolean)
    .flatMap((w) => numberWords(w).split(" "));
}

/** heardInOrder is how many words of a reference were heard, in order: the longest common subsequence. */
export function heardInOrder(reference: readonly string[], heard: readonly string[]): number {
  let row = new Array<number>(heard.length + 1).fill(0);
  for (const r of reference) {
    const next = [0];
    for (let j = 1; j <= heard.length; j++) next.push(r === heard[j - 1] ? row[j - 1]! + 1 : Math.max(row[j]!, next[j - 1]!));
    row = next;
  }
  return row[heard.length]!;
}

/** missedWords lists the words of a reference that were not heard in order, at most a few. */
function missedWords(reference: readonly string[], heard: readonly string[]): string[] {
  const missed: string[] = [];
  let j = 0;
  for (const r of reference) {
    const at = heard.indexOf(r, j);
    if (at < 0) missed.push(r);
    else j = at + 1;
  }
  return missed.slice(0, 5);
}

/** PARTS name the parts of a syllable of Chinese said wrong. */
const PARTS: Readonly<Record<SyllablePart, { en: string; zh: string }>> = {
  initial: { en: "initial", zh: "声母" },
  final: { en: "final", zh: "韵母" },
  tone: { en: "tone", zh: "声调" },
};

/** weakWords are the words an assessment scored below the bar, at most a few, in English and Chinese with the parts of a syllable said wrong. */
function weakWords(heard: Heard, bar: number): { en: string; zh: string } {
  const weak = (heard.words ?? [])
    .filter((w) => w.error === "mispronunciation" || (w.accuracy !== undefined && w.accuracy < bar))
    .slice(0, 5);
  const named = (w: HeardWord, lang: "en" | "zh") =>
    !w.wrong?.length
      ? w.word
      : lang === "en"
        ? `${w.word} (${w.wrong.map((p) => PARTS[p].en).join(", ")})`
        : `${w.word}（${w.wrong.map((p) => PARTS[p].zh).join("、")}）`;
  return { en: weak.map((w) => named(w, "en")).join(", "), zh: weak.map((w) => named(w, "zh")).join("、") };
}

/**
 * speechChecker judges what was heard in a recording; expected is
 * SpeechExpected. Repeating and reading aloud need the reference's words heard
 * in order (all of a short one, READ_SHARE of a longer one) and, when
 * pronunciation was assessed, an accuracy that an understood accent reaches;
 * saying a sentence needs one of the accepted sentences, word for word.
 */
export const speechChecker: Checker = {
  id: "speech",
  maxLength: MAX_HEARD_CHARS,
  check(expected, response) {
    const e = expected as unknown as SpeechExpected;
    const heard = parseHeard(response);
    if (!heard) return { correct: false };
    const said = spokenWords(heard.lexical ?? heard.text);
    if (e.mode === "say") {
      const ok = (e.accept ?? []).some((a) => spokenWords(a).join(" ") === said.join(" "));
      return { correct: ok };
    }
    const reference = spokenWords(e.reference ?? "");
    const got = heardInOrder(reference, said);
    const need = reference.length <= 4 ? reference.length : Math.ceil(reference.length * READ_SHARE - 1e-9);
    if (got < need) {
      const missed = missedWords(reference, said).join(", ");
      return {
        correct: false,
        feedback: t(`Listen again for: ${missed}.`, `再听一听这些词：${missed}。`),
      };
    }
    const bar = e.minAccuracy ?? MIN_ACCURACY;
    if (heard.accuracy !== undefined && heard.accuracy < bar) {
      const weak = weakWords(heard, bar);
      return {
        correct: false,
        feedback: weak.en
          ? t(`Listen again and copy these words closely: ${weak.en}.`, `再听一遍，仔细模仿这些词：${weak.zh}。`)
          : t("Listen again and copy the sounds closely.", "再听一遍，仔细模仿其中的音。"),
      };
    }
    return { correct: true };
  },
};

/** wordsPerMinute is how fast a text was read: the reference's words heard in order, per minute of speech. */
export function wordsPerMinute(reference: string, heard: Heard): number {
  if (heard.seconds <= 0) return 0;
  return Math.round((heardInOrder(spokenWords(reference), spokenWords(heard.lexical ?? heard.text)) * 60) / heard.seconds);
}

/** speechExpected checks that a checker's data is a SpeechExpected, for the compiler. */
export function speechExpected(v: Json): v is Json & SpeechExpected {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, Json>;
  if (o.mode === "say") return Array.isArray(o.accept) && o.accept.length > 0 && o.accept.every((a) => typeof a === "string");
  return (o.mode === "repeat" || o.mode === "read") && typeof o.reference === "string" && spokenWords(o.reference).length > 0;
}
