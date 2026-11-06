import { type Checker, type Json, t } from "@ga/content";

/** normalizeSentence evens out what a keyboard varies but a reader does not see: spacing and the shape of quotes and dashes. */
export function normalizeSentence(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/ ([,.;:?!])/g, "$1")
    .trim();
}

/** wordsOnly reduces a sentence to its lowercase words, to tell a slip in capitals or punctuation from a wrong sentence. */
function wordsOnly(s: string): string {
  return normalizeSentence(s)
    .toLowerCase()
    .replace(/[^a-z0-9' ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * expandPattern lists the sentences a pattern stands for. `(x)` makes x optional and `[a|b]` offers alternatives, and
 * they can nest: `[Because|Since] it rained(,) we stayed.` stands for four sentences.
 */
export function expandPattern(pattern: string): readonly string[] {
  const group = /\(([^()[\]]*)\)|\[([^()[\]]*)\]/.exec(pattern);
  if (!group) return [pattern];
  const options = group[2] !== undefined ? group[2].split("|") : ["", group[1] ?? ""];
  const before = pattern.slice(0, group.index);
  const after = pattern.slice(group.index + group[0].length);
  return [...new Set(options.flatMap((option) => expandPattern(before + option + after)))];
}

const slip = t("Your words are right. Check the capital letters and the punctuation.", "用词没错。请检查大写字母和标点。");

/** accepted is the sentences of a checker's expected data, normalized. */
function accepted(expected: Json, expand: (s: string) => readonly string[]): readonly string[] {
  const listed = Array.isArray(expected) ? expected : [expected];
  return listed.flatMap((s: Json) => (typeof s === "string" ? expand(s) : [])).map(normalizeSentence);
}

function sentenceChecker(id: string, expand: (s: string) => readonly string[]): Checker {
  return {
    id,
    check(expected, response) {
      const sentences = accepted(expected, expand);
      const given = normalizeSentence(response);
      if (sentences.includes(given)) return { correct: true };
      const words = wordsOnly(given);
      return sentences.some((s) => wordsOnly(s) === words) ? { correct: false, feedback: slip } : { correct: false };
    },
    same(_expected, response, mistake) {
      return normalizeSentence(response) === normalizeSentence(mistake);
    },
  };
}

/** sentenceExactChecker accepts any listed sentence, exact in capitals and punctuation; expected is an array of sentences. */
export const sentenceExactChecker: Checker = sentenceChecker("sentence", (s) => [s]);

/** sentencePatternChecker accepts the sentences matching any listed pattern (see expandPattern), exact in capitals and punctuation. */
export const sentencePatternChecker: Checker = sentenceChecker("sentence-pattern", expandPattern);

/** normalizeWord lowercases a typed word and removes the spaces around it. */
function normalizeWord(s: string): string {
  return s.normalize("NFKC").replace(/’/g, "'").trim().toLowerCase();
}

/** wordFormChecker accepts any listed word, spelled exactly but in either case; expected is an array of words. */
export const wordFormChecker: Checker = {
  id: "word-form",
  check(expected, response) {
    const listed = Array.isArray(expected) ? expected : [expected];
    return { correct: listed.some((w: Json) => typeof w === "string" && normalizeWord(w) === normalizeWord(response)) };
  },
  same(_expected, response, mistake) {
    return normalizeWord(response) === normalizeWord(mistake);
  },
};

/** englishCheckers are the checkers of the English subject. */
export const englishCheckers: readonly Checker[] = [sentenceExactChecker, sentencePatternChecker, wordFormChecker];
