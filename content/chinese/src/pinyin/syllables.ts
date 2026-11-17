// Syllables of pinyin taken apart by the Scheme of the Chinese Phonetic Alphabet: the initial, the final as written and
// as it is in the scheme's table, and the tone. The syllables the topics ask about are the readings of the characters
// this subject teaches, so every one is a syllable of Mandarin with a tone it has.

/** MARKED are the vowels with the marks of the four tones, in order. */
const MARKED: Readonly<Record<string, string>> = { a: "āáǎà", o: "ōóǒò", e: "ēéěè", i: "īíǐì", u: "ūúǔù", ü: "ǖǘǚǜ" };

/** UNMARKED gives a marked vowel's plain vowel and tone. */
const UNMARKED: ReadonlyMap<string, readonly [string, number]> = new Map(
  Object.entries(MARKED).flatMap(([vowel, marked]) => [...marked].map((m, i) => [m, [vowel, i + 1] as const])),
);

/** INITIALS are the 21 initials, the two-letter ones first so that they are matched before z, c and s. */
export const INITIALS: readonly string[] = [
  "zh",
  "ch",
  "sh",
  "b",
  "p",
  "m",
  "f",
  "d",
  "t",
  "n",
  "l",
  "g",
  "k",
  "h",
  "j",
  "q",
  "x",
  "r",
  "z",
  "c",
  "s",
];

/** Syllable is a syllable of pinyin with one of the four tones, taken apart. */
export interface Syllable {
  /** written is the syllable with its tone mark, as hǎo. */
  readonly written: string;
  /** plain is the syllable without its tone mark, as hao. */
  readonly plain: string;
  readonly tone: number;
  /** initial is the initial, or "" for a syllable without one. */
  readonly initial: string;
  /** final is the final as the syllable writes it, as u in ju or iu in liu. */
  readonly final: string;
  /** full is the final as the scheme's table gives it, as ü in ju, iou in liu and ia in ya. */
  readonly full: string;
}

/** ZERO are the finals of the scheme written without an initial, by their written form. */
const ZERO: Readonly<Record<string, string>> = {
  yi: "i",
  ya: "ia",
  ye: "ie",
  yao: "iao",
  you: "iou",
  yan: "ian",
  yin: "in",
  yang: "iang",
  ying: "ing",
  yong: "iong",
  wu: "u",
  wa: "ua",
  wo: "uo",
  wai: "uai",
  wei: "uei",
  wan: "uan",
  wen: "uen",
  wang: "uang",
  weng: "ueng",
  yu: "ü",
  yue: "üe",
  yuan: "üan",
  yun: "ün",
};

/** fullFinal is the final of the scheme's table that an initial and a written final stand for. */
function fullFinal(initial: string, final: string): string {
  if (initial === "") return ZERO[final] ?? final;
  if ("jqx".includes(initial) && final.startsWith("u")) return `ü${final.slice(1)}`;
  if (final === "iu") return "iou";
  if (final === "ui") return "uei";
  if (final === "un") return "uen";
  return final;
}

/** parseSyllable takes a syllable with a tone mark apart; it returns undefined for one in the neutral tone or not of one syllable. */
export function parseSyllable(written: string): Syllable | undefined {
  const lower = written.normalize("NFC").toLowerCase();
  if (!/^[a-zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]+$/u.test(lower)) return undefined;
  let tone = 0;
  let plain = "";
  for (const ch of lower) {
    const u = UNMARKED.get(ch);
    if (u) {
      if (tone !== 0) return undefined;
      tone = u[1];
      plain += u[0];
    } else plain += ch;
  }
  if (tone === 0) return undefined;
  const initial = INITIALS.find((i) => plain.startsWith(i) && plain.length > i.length) ?? "";
  const final = plain.slice(initial.length);
  if (initial === "" && !ZERO[final] && !/^[aoe]/u.test(final)) return undefined;
  return { written: lower, plain, tone, initial, final, full: fullFinal(initial, final) };
}

/** markAt is the index of the vowel of a plain syllable that carries the tone mark: a, else e, else the o of ou, else the last vowel. */
export function markAt(plain: string): number {
  for (const v of ["a", "e"]) if (plain.includes(v)) return plain.indexOf(v);
  if (plain.includes("ou")) return plain.indexOf("ou");
  let last = -1;
  [...plain].forEach((ch, i) => {
    if (MARKED[ch]) last = i;
  });
  return last;
}

/** vowelsOf are the indexes of the vowels of a plain syllable. */
export const vowelsOf = (plain: string): readonly number[] => [...plain].flatMap((ch, i) => (MARKED[ch] ? [i] : []));

/** mark writes a plain syllable with a tone, its mark on the vowel at `at`, by default the vowel the rule chooses. */
export function mark(plain: string, tone: number, at: number = markAt(plain)): string {
  const chars = [...plain];
  const vowel = chars[at];
  const marked = vowel === undefined ? undefined : MARKED[vowel]?.[tone - 1];
  if (marked === undefined) throw new Error(`pinyin: no vowel to mark in ${plain} at ${at}`);
  chars[at] = marked;
  return chars.join("");
}

/** TONE_NAMES are the four tones with their marks, as the options of a choice. */
export const TONE_NAMES: readonly string[] = ["1 ˉ", "2 ˊ", "3 ˇ", "4 ˋ"];
