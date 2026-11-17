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
  return pinyinKey(s).replace(/\d/g, "");
}

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
