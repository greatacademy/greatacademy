// Steps: helpers for the knowledge points that follow a topic's first one, so that a topic goes from recognizing to
// using what it teaches. Banks are written as lines of fields separated by bars; a choice either takes its options
// from a table of labels, each with its own explanation, or lists its wrong options in a fixed order of kinds, each
// kind with its own feedback.

import { type Generator, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator } from "@ga/subject-english";

/** Pair is a text in English and in Simplified Chinese. */
export type Pair = readonly [en: string, zh: string];

/** fields splits hand-written lines into fields separated by bars; \n in a field is a line break. */
export const fields = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.split("|").map((field) => field.trim().replaceAll("\\n", "\n")));

/** bars turns lines of "shown|right|wrong|wrong..." into choice items, checking that each has a wrong option. */
export const bars = (lines: string, wrongCount?: number): ChoiceItem[] =>
  fields(lines).map(([shown, right, ...wrong]) => {
    if (!shown || !right || wrong.length === 0) throw new Error(`a choice line needs at least three fields: ${shown}`);
    if (wrongCount !== undefined && wrong.length !== wrongCount)
      throw new Error(`a line of this bank needs ${wrongCount} wrong options: ${shown}`);
    return [shown, right, wrong];
  });

/** fill replaces {wrong} and {right} in a text of feedback with the options. */
const fill = (s: string, wrong: string, right: string) => s.replaceAll("{wrong}", wrong).replaceAll("{right}", right);

/**
 * kindedChoice builds a choice whose wrong options are listed in a fixed order of kinds: the first wrong option of
 * every line is of the first kind, and so on. Choosing one gets the feedback of its kind.
 */
export function kindedChoice(
  question: Pair,
  bank: readonly ChoiceItem[],
  why: (right: string, shown: string) => Pair,
  kinds: readonly Pair[],
): Generator {
  for (const [shown, , wrong] of bank)
    if (wrong.length > kinds.length) throw new Error(`more wrong options than kinds of feedback: ${shown}`);
  return choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right, shown) => t(...why(right, shown)),
    (wrong, right, _shown, position) => {
      const [en, zh] = kinds[position] ?? ["", ""];
      return t(fill(en, wrong, right), fill(zh, wrong, right));
    },
  );
}

/** Label is an answer that many items share: its Chinese name, why it fits, and why it does not when chosen wrongly. */
export interface Label {
  readonly zh: string;
  readonly why: Pair;
  readonly not: Pair;
}

/**
 * labelChoice builds a choice whose options are labels of a table. Lines are "shown|right" or "shown|right|wrong|wrong";
 * a line with no wrong options takes the next two labels of the table after the right one.
 */
export function labelChoice(question: Pair, lines: string, labels: Readonly<Record<string, Label>>): Generator {
  const names = Object.keys(labels);
  const label = (name: string): Label => {
    const found = labels[name];
    if (!found) throw new Error(`unknown label ${name}`);
    return found;
  };
  const bank: ChoiceItem[] = fields(lines).map(([shown, right, ...wrong], i) => {
    if (!shown || !right) throw new Error(`a label line needs a text and a label: ${shown}`);
    label(right);
    for (const w of wrong) label(w);
    const others = names.filter((n) => n !== right);
    const picked = wrong.length > 0 ? wrong : others.length <= 2 ? others : [0, 1].map((k) => others[(i + k) % others.length] ?? "");
    return [shown, right, picked];
  });
  return choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => {
      const l = label(right);
      return t(`It is **${right}**. ${l.why[0]}`, `这是**${l.zh}**。${l.why[1]}`);
    },
    (wrong) => t(...label(wrong).not),
  );
}
