// The clues of the gap sentences of the word and idiom topics (docs/chinese-curriculum.md §6): for each sentence, written
// by hand, what in it decides the word, and the other words of its batch that could also fill it, which are never
// offered against it. A reason for a wrong option joins the clue to that option's own meaning.

import { type Text, t } from "@ga/content";

/** Clue is what in a gap sentence decides its word, and the words of the batch that would also fit the gap. */
export interface Clue {
  readonly why: Text;
  readonly fits: readonly string[];
}

/** clueKey names a sentence of a word: the word and the sentence's place among its sentences, counted from 1. */
export const clueKey = (word: string, n: number): string => `${word}/${n}`;

/**
 * parseClues reads clue data, a line a sentence, its fields separated by ` | `: the word and the sentence's place, as
 * clueKey writes them, the clue in Chinese and in English, without a full stop, and, if any, the words of the batch that
 * would also fit the gap, separated by spaces.
 */
export function parseClues(data: string): ReadonlyMap<string, Clue> {
  const out = new Map<string, Clue>();
  for (const line of data.split("\n").map((l) => l.trim())) {
    if (line === "") continue;
    const fields = line.split(" | ").map((f) => f.trim());
    if (fields.length < 3 || fields.length > 4) throw new Error(`clue data: ${line}`);
    const [key = "", zh = "", en = "", fits = ""] = fields;
    if (!/\/\d$/u.test(key) || zh === "" || en === "") throw new Error(`clue data: ${line}`);
    if (out.has(key)) throw new Error(`clue data: ${key} appears twice`);
    out.set(key, { why: t(en, zh), fits: fits === "" ? [] : fits.split(" ") });
  }
  return out;
}

/** clueOf is the clue of a sentence of a word; it throws, naming `where`, when the sentence has none. */
export function clueOf(clues: ReadonlyMap<string, Clue>, word: string, n: number, where: string): Clue {
  const c = clues.get(clueKey(word, n));
  if (!c) throw new Error(`${where}: no clue for sentence ${n} of ${word}`);
  return c;
}
