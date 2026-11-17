// Chinese is written without spaces, so a passage is split into words by the lexicon, longest match first (Chinese
// Curriculum §9). The split is content, the same everywhere, never a model's.

const HAN = /\p{Script=Han}/u;

/**
 * segmenter builds a subject's `words`: runs of Chinese characters split by the longest spelling in the lexicon or among
 * a passage's known words, a character alone where none matches; runs of letters or digits as words of their own;
 * punctuation and spaces left out.
 */
export function segmenter(spellings: Iterable<string>): (body: string, known: readonly string[]) => readonly string[] {
  const lexicon = new Set(spellings);
  let longest = 1;
  for (const s of lexicon) longest = Math.max(longest, [...s].length);
  return (body, known) => {
    const words = new Set([...lexicon, ...known]);
    const most = Math.max(longest, ...known.map((k) => [...k].length));
    const out: string[] = [];
    const chars = [...body.normalize("NFC")];
    let i = 0;
    while (i < chars.length) {
      const c = chars[i]!;
      if (HAN.test(c)) {
        let n = Math.min(most, chars.length - i);
        while (n > 1) {
          const run = chars.slice(i, i + n);
          if (run.every((r) => HAN.test(r)) && words.has(run.join(""))) break;
          n--;
        }
        out.push(chars.slice(i, i + n).join(""));
        i += n;
      } else if (/[\p{L}\p{N}]/u.test(c)) {
        let j = i;
        while (j < chars.length && /[\p{L}\p{N}'’]/u.test(chars[j]!) && !HAN.test(chars[j]!)) j++;
        out.push(chars.slice(i, j).join(""));
        i = j;
      } else i++;
    }
    return out;
  };
}

/** hanzi are the Chinese characters of a text, in order, repeats included. */
export function hanzi(text: string): readonly string[] {
  return [...text.normalize("NFC")].filter((c) => HAN.test(c));
}
