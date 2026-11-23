// Pinyin as the Scheme of the Chinese Phonetic Alphabet writes it: tone marks over the vowel that carries them, or tone
// numbers after each syllable as keyboards type them. Both become one form for comparison: the tone's digit right after
// the vowel that carries the mark.

const MARKS: Readonly<Record<string, readonly [string, number]>> = {
  ā: ["a", 1],
  á: ["a", 2],
  ǎ: ["a", 3],
  à: ["a", 4],
  ē: ["e", 1],
  é: ["e", 2],
  ě: ["e", 3],
  è: ["e", 4],
  ī: ["i", 1],
  í: ["i", 2],
  ǐ: ["i", 3],
  ì: ["i", 4],
  ō: ["o", 1],
  ó: ["o", 2],
  ǒ: ["o", 3],
  ò: ["o", 4],
  ū: ["u", 1],
  ú: ["u", 2],
  ǔ: ["u", 3],
  ù: ["u", 4],
  ǖ: ["ü", 1],
  ǘ: ["ü", 2],
  ǚ: ["ü", 3],
  ǜ: ["ü", 4],
};

const MARKED: Readonly<Record<string, readonly string[]>> = {
  a: ["a", "ā", "á", "ǎ", "à"],
  e: ["e", "ē", "é", "ě", "è"],
  i: ["i", "ī", "í", "ǐ", "ì"],
  o: ["o", "ō", "ó", "ǒ", "ò"],
  u: ["u", "ū", "ú", "ǔ", "ù"],
  ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
};

/** markIndex is where a syllable's tone mark goes: on a or e, on the o of ou, and otherwise on the last vowel. */
function markIndex(syllable: string): number {
  for (const v of ["a", "e"]) if (syllable.includes(v)) return syllable.indexOf(v);
  if (syllable.includes("ou")) return syllable.indexOf("ou");
  for (let i = syllable.length - 1; i >= 0; i--) if ("iouü".includes(syllable[i]!)) return i;
  return -1;
}

/** plainLetters lowercases pinyin, writes ü for v and u:, and leaves out spaces, apostrophes and hyphens. */
function plainLetters(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/u:|v/g, "ü")
    .replace(/[\s'’-]/g, "");
}

/**
 * pinyinKey is the form in which two spellings of pinyin compare: each tone as a digit right after the vowel that
 * carries it, the neutral tone with none. "Zhōngguó", "zhong1 guo2" and "zhong1guo2" give the same key.
 */
export function pinyinKey(s: string): string {
  let out = "";
  for (const ch of withMarks(plainLetters(s))) {
    const mark = MARKS[ch];
    out += mark ? `${mark[0]}${mark[1]}` : ch;
  }
  return out;
}

/** toneless is pinyin without its tones, to tell a wrong tone from a wrong syllable. */
export function toneless(s: string): string {
  let plain = toneless_.get(s);
  if (plain === undefined) {
    plain = pinyinKey(s).replace(/\d/g, "");
    toneless_.set(s, plain);
  }
  return plain;
}

/** toneless_ remembers the syllables already made toneless: content asks for the same ones many times as it builds. */
const toneless_ = new Map<string, string>();

/** withMarks writes pinyin typed with tone numbers, "lü4 se4", in tone marks, "lǜ sè". */
export function withMarks(s: string): string {
  return s.normalize("NFC").replace(/([a-zA-ZüÜv:]+)([0-5])/g, (_, raw: string, tone: string) => {
    const syllable = raw.replace(/u:|v/g, "ü").replace(/U:|V/g, "Ü");
    const at = markIndex(syllable.toLowerCase());
    if (at < 0 || tone === "0" || tone === "5") return syllable;
    const vowel = syllable[at]!;
    const marked = MARKED[vowel.toLowerCase()]?.[Number(tone)] ?? vowel;
    return syllable.slice(0, at) + (vowel === vowel.toUpperCase() ? marked.toUpperCase() : marked) + syllable.slice(at + 1);
  });
}

/** joinPinyin writes the syllables of a word as one word of pinyin, with an apostrophe before a syllable that starts with a, o or e. */
export function joinPinyin(syllables: readonly string[]): string {
  return syllables.map((s, i) => (i > 0 && /^[aoe]/u.test(toneless(s)) ? `'${s}` : s)).join("");
}

/** toneDigit is the tone of a syllable, 0 for the neutral tone. */
const toneDigit = (syllable: string): number => Number(/\d/u.exec(pinyinKey(syllable))?.[0] ?? 0);

/** retoned writes a syllable with another tone, 0 for the neutral tone. */
const retoned = (syllable: string, tone: number): string => withMarks(`${toneless(syllable)}${tone === 0 ? 5 : tone}`);

/** NUMERAL_BEFORE are characters after which 一 is a numeral or ends a word and keeps its own tone, as in 十一, 第一 and 统一. */
const NUMERAL_BEFORE = new Set([..."第十百千万零〇两二三四五六七八九统唯单专"]);

/** NUMERAL_AFTER are characters before which 一 counts in a date or a list and keeps its own tone, as in 一月 and 一号. */
const NUMERAL_AFTER = new Set([..."一月号〇零二三四五六七八九十"]);

/** NEUTRAL_FOURTH are characters often written in the neutral tone whose own tone is the fourth, so 一 before them is yí, as in 一个 and 一下. */
const NEUTRAL_FOURTH = new Set([..."个下"]);

/** OWN_ONE are words whose 一 is said yī wherever it stands, as dictionaries give them. */
const OWN_ONE = new Set(["不一而足"]);

/**
 * spokenSyllables marks 一 and 不 with the tone they are said in, as primary school textbooks and the HSK word lists do:
 * 一 is yí before a fourth tone and yì before the others, 不 is bú before a fourth tone. 一 keeps yī at the end of a
 * word and as a numeral (十一, 第一, 一月); a syllable already written in its changed tone, or in the neutral tone, is
 * kept. The third tone's change is never marked.
 */
export function spokenSyllables(word: string, syllables: readonly string[]): readonly string[] {
  const chars = [...word];
  if (chars.length !== syllables.length) return syllables;
  return syllables.map((s, i) => {
    const ch = chars[i]!;
    const next = syllables[i + 1];
    if (next === undefined || toneDigit(s) === 0) return s;
    const before = toneDigit(next) === 4 || (toneDigit(next) === 0 && NEUTRAL_FOURTH.has(chars[i + 1]!));
    if (ch === "一" && toneless(s) === "yi" && toneDigit(s) === 1) {
      if (OWN_ONE.has(word) || NUMERAL_BEFORE.has(chars[i - 1] ?? "") || NUMERAL_AFTER.has(chars[i + 1]!)) return s;
      return retoned(s, before ? 2 : 4);
    }
    if (ch === "不" && toneless(s) === "bu" && toneDigit(s) === 4 && before) return retoned(s, 2);
    return s;
  });
}

/** ownSyllables writes 一 and 不 back in their own tones, yī and bù, undoing spokenSyllables. */
export function ownSyllables(word: string, syllables: readonly string[]): readonly string[] {
  const chars = [...word];
  return syllables.map((s, i) => {
    if (chars[i] === "一" && toneless(s) === "yi" && toneDigit(s) !== 0) return retoned(s, 1);
    if (chars[i] === "不" && toneless(s) === "bu" && toneDigit(s) !== 0) return retoned(s, 4);
    return s;
  });
}

/**
 * pinyinSpellings are the spellings a typed answer of a word accepts: first its pinyin with 一 and 不 in the tone said
 * (see spokenSyllables), then with their own tones, when that differs.
 */
export function pinyinSpellings(word: string, syllables: readonly string[]): readonly string[] {
  const said = joinPinyin(spokenSyllables(word, syllables));
  const own = joinPinyin(ownSyllables(word, syllables));
  return said === own ? [said] : [said, own];
}
