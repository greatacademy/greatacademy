// Shared pieces of the level 1 topics (docs/chinese-curriculum.md §8.3): choices whose options are texts in the learner's
// locale, the three pairs of wrong answers each item is asked with, and wrong readings that change one tone.

import { type Generator, joinText, type Problem, type Rng, same, type Text, t } from "@ga/content";
import { pinyinKey, quote, toneless, withMarks } from "@ga/subject-chinese";

/** Asked is what an item asks: what is shown, the right option, three wrong ones and the solution, each in every locale. */
export interface Asked {
  readonly shown: Text;
  readonly right: Text;
  readonly wrong: readonly [Text, Text, Text];
  readonly solution: Text;
  /** reasons say why each wrong option is wrong, in the order of wrong. */
  readonly reasons?: readonly [Text, Text, Text];
}

/** Item is one bank item of a choice: an Asked with two of its wrong options and their reasons. */
interface Item {
  readonly shown: Text;
  readonly right: Text;
  readonly wrong: readonly [Text, Text];
  readonly solution: Text;
  readonly reasons?: readonly [Text, Text];
}

/** withReasons ends a solution with why each wrong option is wrong, one line an option. */
function withReasons(solution: Text, reasons: readonly Text[]): Text {
  const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
  return t(`${solution.en}\n\nThe other options:\n\n${list("en")}`, `${solution["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`);
}

/** PAIRS are the pairs of wrong options an item is asked with, one a round, so that ten items make 30 problems. */
const PAIRS = [
  [0, 1],
  [1, 2],
  [0, 2],
] as const;

/** quoted sets a text as a block quote in each locale. */
const quoted = (s: Text): Text => t(quote(s.en), quote(s["zh-CN"]));

/**
 * askedGenerator asks each item with two of its three wrong options at a time, in three pairs, item by item within a
 * round, so that consecutive seeds never show the same item; it shuffles the options by seed.
 */
export function askedGenerator(question: Text, asked: readonly Asked[]): Generator {
  const bank: readonly Item[] = PAIRS.flatMap(([a, b]) =>
    asked.map(
      (q): Item => ({
        shown: q.shown,
        right: q.right,
        solution: q.solution,
        wrong: [q.wrong[a], q.wrong[b]],
        ...(q.reasons && { reasons: [q.reasons[a], q.reasons[b]] as const }),
      }),
    ),
  );
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: joinText([question, quoted(item.shown)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: item.reasons ? withReasons(item.solution, item.reasons) : item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(item.reasons && {
        mistakes: item.wrong.map((w, k) => ({ response: String(options.indexOf(w)), feedback: item.reasons![k]! })),
      }),
    };
  };
}

/** threeOf is the first three distinct candidates that differ from the right one; it throws, naming `where`, if there are fewer. */
export function threeOf(what: string, right: string, candidates: readonly string[], where = "level 1"): [string, string, string] {
  const out: string[] = [];
  for (const c of candidates) {
    if (c !== right && !out.includes(c)) out.push(c);
    if (out.length === 3) return [out[0]!, out[1]!, out[2]!];
  }
  throw new Error(`${where}: too few wrong answers for ${what}`);
}

/** three makes three texts the same in every locale. */
export const three = (w: readonly [string, string, string]): [Text, Text, Text] => [same(w[0]), same(w[1]), same(w[2])];

/** spread orders the other items of a list from item i on, every third first, so that neighbours in the data are not always offered together. */
export function spread<T>(items: readonly T[], i: number): readonly T[] {
  const others = [...items.slice(i + 1), ...items.slice(0, i)];
  return [0, 1, 2].flatMap((k) => others.filter((_, j) => j % 3 === k));
}

/** toneOf is the tone of a syllable of pinyin, 0 for the neutral tone. */
export function toneOf(syllable: string): number {
  const digit = /\d/u.exec(pinyinKey(syllable));
  return digit ? Number(digit[0]) : 0;
}

/** withTone writes a syllable of pinyin with another tone, 0 for the neutral tone. */
export const withTone = (syllable: string, tone: number): string => withMarks(`${toneless(syllable)}${tone === 0 ? 5 : tone}`);

/** fields splits a line of data at ` | `, checking it has between `min` and `max` fields; its error names `where`. */
export function fields(line: string, min: number, max: number, where = "level 1"): readonly string[] {
  const parts = line.split(" | ").map((f) => f.trim());
  if (parts.length < min || parts.length > max) throw new Error(`${where} data: ${line}`);
  return parts;
}

/** dataLines are the trimmed lines of data that are not empty. */
export const dataLines = (data: string): readonly string[] =>
  data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

/** nearOf makes the words or characters kept apart symmetric: each one's set and every one whose set names it; its error names `where`. */
export function nearOf(
  items: readonly { readonly key: string; readonly near: readonly string[] }[],
  where = "level 1",
): ReadonlyMap<string, ReadonlySet<string>> {
  const keys = new Set(items.map((i) => i.key));
  const out = new Map<string, Set<string>>(items.map((i) => [i.key, new Set<string>()]));
  for (const item of items) {
    for (const n of item.near) {
      if (!keys.has(n)) throw new Error(`${where} data: ${n}, kept apart from ${item.key}, is not in its batch`);
      out.get(item.key)!.add(n);
      out.get(n)!.add(item.key);
    }
  }
  return out;
}
