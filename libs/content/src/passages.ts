import type { Rng } from "./rng.ts";
import type { Text } from "./text.ts";
import type { LexiconEntry, PassageDef, Problem, ReadingUnitDef } from "./types.ts";

/** PassageView is what a reader sees of a passage. */
export interface PassageView {
  readonly title: Text;
  readonly body: string;
}

/** bodyWords lists the running words of a passage body, lowercased; a word with an apostrophe or a hyphen counts once. */
export function bodyWords(body: string): string[] {
  return (body.normalize("NFKC").match(/\p{L}+(?:['\u2019-]\p{L}+)*/gu) ?? []).map((w) => w.toLowerCase().replaceAll("\u2019", "'"));
}

/** lexiconIndex maps every spelling of the lexicon's words to its entry. */
export function lexiconIndex(lexicon: readonly LexiconEntry[]): ReadonlyMap<string, LexiconEntry> {
  const index = new Map<string, LexiconEntry>();
  for (const entry of lexicon) for (const form of [entry.word, ...(entry.forms ?? [])]) index.set(form.toLowerCase(), entry);
  return index;
}

/** passageProblem builds a comprehension question of a passage; the seed shuffles its options. */
export function passageProblem(passage: PassageDef, question: number, rng: Rng): Problem {
  const q = passage.questions[question];
  if (!q) throw new Error(`passage ${passage.id} has no question ${question}`);
  const options = rng.shuffle([q.right, ...q.wrong]);
  const answer = options.indexOf(q.right);
  return {
    prompt: q.prompt,
    answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
    solution: q.solution,
    canonical: String(answer),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
  };
}

/** passagesOf lists the passages of reading units in order. */
export function passagesOf(units: readonly ReadingUnitDef[]): readonly PassageDef[] {
  return units.flatMap((u) => u.passages);
}
