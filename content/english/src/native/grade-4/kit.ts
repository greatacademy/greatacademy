// Grade 4: helpers for the topics of the course. Banks are hand-written lines of fields separated by bars; a topic of
// kinds names the kind of each text and then finds a text of a given kind, both from one table, so that every line
// serves two knowledge points.

import { type Generator, joinText, type Problem, type Rng, same, type Text, t } from "@ga/content";
import { fields } from "../../topics/steps.ts";

export { bars, fields, kindedChoice, type Pair } from "../../topics/steps.ts";

/** quote sets text as a block quote, every line of it. */
const quote = (s: string) =>
  s
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");

/** Item is one problem of a choice with a question, solution and feedback of its own. */
export interface Item {
  readonly question: Text;
  /** shown is the text the question is about, set as a quote; empty for none. */
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly why: Text;
  /** whyNot is the feedback for each wrong option, in the order of wrong. */
  readonly whyNot: readonly Text[];
}

/** itemGenerator picks an item of a bank by seed and shuffles its options. */
export function itemGenerator(bank: readonly Item[]): Generator {
  if (bank.length === 0) throw new Error("an empty bank");
  for (const item of bank) {
    if (item.wrong.length !== item.whyNot.length) throw new Error(`each wrong option needs feedback: ${item.right}`);
    if (new Set([item.right, ...item.wrong]).size !== item.wrong.length + 1) throw new Error(`repeated option: ${item.right}`);
  }
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: item.shown === "" ? item.question : joinText([item.question, same(quote(item.shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.why,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: item.wrong.map((w, k) => ({ response: String(options.indexOf(w)), feedback: item.whyNot[k] ?? item.why })),
    };
  };
}

/** Kind is an answer many texts share: its Chinese name and a sentence of what makes a text this kind. */
export interface Kind {
  readonly zh: string;
  readonly is: readonly [en: string, zh: string];
}

/** KindSpec is a table of texts, each of a kind, with the questions of the two knowledge points built from it. */
export interface KindSpec {
  /** lines are "text|kind", one text a line. */
  readonly lines: string;
  readonly kinds: Readonly<Record<string, Kind>>;
  /** name asks what kind the shown text is. */
  readonly name: readonly [en: string, zh: string];
  /** find asks for the option of a given kind, from its English and Chinese names. */
  readonly find: (en: string, zh: string) => readonly [en: string, zh: string];
}

/** kindRows reads the lines of a table of kinds, checking every kind. */
const kindRows = (spec: KindSpec): (readonly [text: string, kind: string])[] =>
  fields(spec.lines).map(([text, kind]) => {
    if (!text || !kind || !spec.kinds[kind]) throw new Error(`a line needs a text and a known kind: ${text}|${kind}`);
    return [text, kind] as const;
  });

/** nameKind asks the kind of each text, offering the right kind and two others. */
export function nameKind(spec: KindSpec): Generator {
  const names = Object.keys(spec.kinds);
  if (names.length < 3) throw new Error("naming a kind needs three kinds or more");
  const kind = (name: string): Kind => spec.kinds[name] as Kind;
  return itemGenerator(
    kindRows(spec).map(([text, right], i): Item => {
      const others = names.filter((n) => n !== right);
      const wrong = others.length <= 2 ? others : [0, 1].map((k) => others[(i + k) % others.length] as string);
      return {
        question: t(spec.name[0], spec.name[1]),
        shown: text,
        right,
        wrong,
        why: t(`It is **${right}**. ${kind(right).is[0]}`, `这是**${kind(right).zh}**。${kind(right).is[1]}`),
        whyNot: wrong.map((w) =>
          t(
            `It is not **${w}**. ${kind(w).is[0]} Read the text again: it does not do that.`,
            `这不是**${kind(w).zh}**。${kind(w).is[1]} 再读一遍原文：它并不是这样。`,
          ),
        ),
      };
    }),
  );
}

/** findKind asks for the text of a given kind among three, the other two of other kinds. */
export function findKind(spec: KindSpec): Generator {
  const rows = kindRows(spec);
  const kind = (name: string): Kind => spec.kinds[name] as Kind;
  return itemGenerator(
    rows.map(([text, right], i): Item => {
      const wrong: (readonly [string, string])[] = [];
      const distinct = Object.keys(spec.kinds).length > 2;
      for (let k = 1; k < rows.length && wrong.length < 2; k++) {
        const row = rows[(i + k) % rows.length] as readonly [string, string];
        if (row[1] === right || (distinct && wrong.some(([, w]) => w === row[1]))) continue;
        wrong.push(row);
      }
      const [en, zh] = spec.find(right, kind(right).zh);
      return {
        question: t(en, zh),
        shown: "",
        right: text,
        wrong: wrong.map(([w]) => w),
        why: t(`“${text}” is **${right}**. ${kind(right).is[0]}`, `“${text}”是**${kind(right).zh}**。${kind(right).is[1]}`),
        whyNot: wrong.map(([w, k]) =>
          t(`“${w}” is ${k}, not ${right}. ${kind(k).is[0]}`, `“${w}”是${kind(k).zh}，不是${kind(right).zh}。${kind(k).is[1]}`),
        ),
      };
    }),
  );
}

/** GapSpec is a bank of sentences with a gap, each with its right word and two wrong ones. */
export interface GapRow {
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly string[];
}

/** gaps reads lines of "sentence with ___|right|wrong|wrong". */
export const gaps = (lines: string): GapRow[] =>
  fields(lines).map(([shown, right, ...wrong]) => {
    if (!shown?.includes("___") || !right || wrong.length === 0) throw new Error(`a gap line needs a gap and options: ${shown}`);
    return { shown, right, wrong };
  });

/** fill puts the right word into the gap of a sentence, in bold. */
export const fill = (shown: string, word: string) => shown.replace("___", `**${word}**`);

/** capital makes the first letter of a text upper case. */
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** pick takes an element of a list by an index that may run past its end. */
export const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

/** range lists the numbers from 0 below n. */
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
