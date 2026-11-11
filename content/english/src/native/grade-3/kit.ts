// Grade 3: helpers for the topics of the course. A choice or an order here carries its own question, text, solution
// and feedback for each wrong option, so that a bank built from hand-written cores can say exactly why each option
// is right or wrong.

import { type Generator, joinText, type KnowledgePointDef, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";

/** Pair is a text in English and in Simplified Chinese. */
export type Pair = readonly [en: string, zh: string];

/** pair turns a Pair into a Text. */
export const pair = (p: Pair): Text => t(p[0], p[1]);

/** quote sets text as a block quote, every line of it. */
const quote = (s: string) =>
  s
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");

/** rows splits hand-written lines into fields separated by bars; \n in a field is a line break. */
export const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.split("|").map((field) => field.trim().replaceAll("\\n", "\n")));

/** need returns the fields of a row, checking that it has at least n of them. */
export const need = (row: readonly string[], n: number): string[] => {
  if (row.length < n || row.slice(0, n).some((f) => f === "")) throw new Error(`a row needs ${n} fields: ${row.join("|")}`);
  return [...row];
};

/** Ask is one item of a choice: its question, the text it shows, its options, its solution and why each wrong option is wrong. */
export interface Ask {
  readonly question: Text;
  /** shown is the text the question is about, quoted under it; empty for none. */
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly why: Text;
  /** whyNot is the feedback for each wrong option, in the order of wrong. */
  readonly whyNot: readonly Text[];
}

/** askGenerator picks an item by seed and shuffles its options; each wrong option is a listed mistake with its own feedback. */
export function askGenerator(items: readonly Ask[]): Generator {
  if (items.length === 0) throw new Error("an empty bank");
  for (const item of items) {
    if (item.wrong.length < 2) throw new Error(`a choice needs at least two wrong options: ${item.right}`);
    if (item.whyNot.length !== item.wrong.length) throw new Error(`each wrong option needs feedback: ${item.right}`);
    if (new Set([item.right, ...item.wrong]).size !== item.wrong.length + 1) throw new Error(`repeated options: ${item.right}`);
  }
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: item.shown === "" ? item.question : joinText([item.question, same(quote(item.shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.why,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: item.wrong.map((w, i) => ({ response: String(options.indexOf(w)), feedback: item.whyNot[i] ?? item.why })),
    };
  };
}

/** Arrange is one item of an order: its question, the text it shows, and the items in their right order. */
export interface Arrange {
  readonly question: Text;
  readonly shown: string;
  readonly steps: readonly string[];
  readonly why: Text;
}

/** arrangeGenerator picks an item by seed and shuffles its steps, never showing them already in order. */
export function arrangeGenerator(items: readonly Arrange[]): Generator {
  if (items.length === 0) throw new Error("an empty bank");
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const right = item.steps.map((_, i) => i);
    let shuffled = rng.shuffle(right);
    // A rotation of the right order keeps the steps out of order, so this ends after one pass.
    for (let tries = 0; shuffled.join() === right.join() && tries < right.length; tries++)
      shuffled = [...shuffled.slice(1), shuffled[0] ?? 0];
    const expected = right.map((original) => shuffled.indexOf(original));
    return {
      prompt: item.shown === "" ? item.question : joinText([item.question, same(quote(item.shown))]),
      answer: { checker: "order", expected: [expected], input: { kind: "order", items: shuffled.map((i) => same(item.steps[i] ?? "")) } },
      solution: item.why,
      canonical: expected.join(","),
      wrong: [shuffled.map((_, i) => i).join(",")],
    };
  };
}

/** fill replaces {wrong} and {right} in a pair of feedback with the options. */
export const fill = (p: Pair, wrong: string, right: string): Text =>
  t(p[0].replaceAll("{wrong}", wrong).replaceAll("{right}", right), p[1].replaceAll("{wrong}", wrong).replaceAll("{right}", right));

/** kinded builds an Ask whose wrong options are of fixed kinds, each with its feedback, from a row of shown, right and wrong options. */
export const kinded = (question: Pair, why: (right: string, shown: string) => Pair, kinds: readonly Pair[]) => {
  return (row: readonly string[], shownOverride?: string): Ask => {
    const [shown = "", right = "", ...wrong] = row;
    if (right === "" || wrong.length < 2) throw new Error(`a kinded row needs a right and two wrong options: ${row.join("|")}`);
    if (wrong.length > kinds.length) throw new Error(`more wrong options than kinds: ${row.join("|")}`);
    const s = shownOverride ?? shown;
    return {
      question: pair(question),
      shown: s,
      right,
      wrong,
      why: pair(why(right, s)),
      whyNot: wrong.map((w, i) => fill(kinds[i] ?? ["", ""], w, right)),
    };
  };
};

/** topic builds a topic of the course, worth 14 XP unless given; its strand comes from the list it is gathered in. */
export const topic = (
  id: string,
  title: Text,
  summary: Text,
  prerequisites: readonly string[],
  knowledgePoints: readonly KnowledgePointDef[],
  xp = 14,
): TopicDef => ({ id, title, summary, prerequisites: [...prerequisites], encompasses: [], xp, knowledgePoints: [...knowledgePoints] });

/** bold puts the first whole-word match of a word in bold. */
export const bold = (sentence: string, word: string): string =>
  sentence.replace(new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`), "**$1**");

/** gapFill puts a word in bold into the gap of a sentence. */
export const gapFill = (sentence: string, word: string): string => sentence.replace("___", `**${word}**`);
