import { type Generator, joinText, type KnowledgePointDef, type Problem, type Rng, same as sameText, type Text } from "@ga/content";

const quote = (s: string) => `> ${s}`;

/** Why builds the solution of an item from its right answer and its sentence, in every locale. */
export type Why = (right: string, shown: string) => Text;

/** ChoiceItem is one bank item of a choice: what to show, the right option and the wrong ones. */
export type ChoiceItem = readonly [shown: string, right: string, wrong: readonly string[]];

/**
 * WhyNot builds the feedback for choosing a wrong option: what that option shows about the learner's reading, without
 * repeating the solution. position is the option's place among the item's wrong options, for banks that list their
 * wrong options in a fixed order of kinds.
 */
export type WhyNot = (wrong: string, right: string, shown: string, position: number) => Text;

/**
 * choiceGenerator picks an item of a bank by seed and shuffles its options. Each wrong option is a plausible mistake, so
 * it also serves as a listed wrong response; with whyNot, choosing it gets feedback of its own.
 */
export function choiceGenerator(question: Text, bank: readonly ChoiceItem[], why: Why, whyNot?: WhyNot): Generator {
  return (rng: Rng): Problem => {
    const [shown, right, wrong] = rng.cycle(bank);
    const options = rng.shuffle([right, ...wrong]);
    const answer = options.indexOf(right);
    return {
      prompt: shown === "" ? question : joinText([question, sameText(quote(shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(sameText) } },
      solution: why(right, shown),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(whyNot && {
        mistakes: wrong.map((w, position) => ({ response: String(options.indexOf(w)), feedback: whyNot(w, right, shown, position) })),
      }),
    };
  };
}

/** TypedItem is one bank item of a typed answer: what to show, the accepted forms with the first shown as the answer, and likely errors. */
export interface TypedItem {
  readonly shown: string;
  /** accepted are the checker's data; the first must also be a plain sentence, shown as the answer unless canonical says otherwise. */
  readonly accepted: readonly string[];
  readonly canonical?: string;
  /** wrong are plausible wrong responses, each of them rejected. */
  readonly wrong: readonly string[];
  /** instruction adds to the question for this item, such as the word to use. */
  readonly instruction?: Text;
}

/** typedGenerator picks an item of a bank by seed; the learner types the answer. */
export function typedGenerator(
  checker: "sentence" | "sentence-pattern" | "word-form",
  question: Text,
  bank: readonly TypedItem[],
  why: Why,
): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const canonical = item.canonical ?? item.accepted[0] ?? "";
    return {
      prompt: joinText([question, ...(item.instruction ? [item.instruction] : []), sameText(quote(item.shown))]),
      answer: { checker, expected: [...item.accepted], input: { kind: "text" } },
      solution: why(canonical, item.shown),
      canonical,
      wrong: [...item.wrong],
    };
  };
}

/** OrderItem is one bank item of an order: the items in a right order, and any other orders that are also right. */
export interface OrderItem {
  readonly sentences: readonly string[];
  /** alsoRight lists further right orders, as indexes into sentences. */
  readonly alsoRight?: readonly (readonly number[])[];
}

/** orderGenerator picks an item of a bank by seed and shuffles its sentences, never showing them already in a right order. */
export function orderGenerator(question: Text, bank: readonly OrderItem[], why: Why): Generator {
  return (rng: Rng): Problem => {
    const { sentences, alsoRight = [] } = rng.cycle(bank);
    const rightOrders = [sentences.map((_, i) => i), ...alsoRight];
    const isRight = (order: readonly number[]) => rightOrders.some((o) => o.join() === order.join());
    let shuffled = rng.shuffle(sentences.map((_, i) => i));
    // A rotation of a right order keeps the sentences out of order, so this ends after one pass.
    for (let tries = 0; isRight(shuffled) && tries < sentences.length; tries++) shuffled = [...shuffled.slice(1), shuffled[0]!];
    const position = (from: readonly number[]) => from.map((original) => shuffled.indexOf(original));
    const expected = rightOrders.map(position);
    const canonical = expected[0]!.join(",");
    return {
      prompt: question,
      answer: {
        checker: "order",
        expected: expected.map((o) => [...o]),
        input: { kind: "order", items: shuffled.map((i) => sameText(sentences[i]!)) },
      },
      solution: why(sentences.join(" "), ""),
      canonical,
      wrong: isRight(shuffled) ? [] : [shuffled.map((_, i) => i).join(",")],
    };
  };
}

/** typed builds a TypedItem whose answer is canonical; patterns replace it as the accepted forms when several are right. */
export function typed(
  shown: string,
  canonical: string,
  wrong: readonly string[],
  patterns?: readonly string[],
  instruction?: Text,
): TypedItem {
  return { shown, canonical, accepted: patterns ?? [canonical], wrong, ...(instruction && { instruction }) };
}

/** WritingItem is one bank item of a writing task: what to write about, any text to work from, and a model answer by the author. */
export interface WritingItem {
  /** task is what to write, in English; it follows the question. */
  readonly task: string;
  /** source is text the task works from, such as notes to turn into a paragraph. */
  readonly source?: string;
  /** model is one good response: shown to the judge, and to the learner after a verdict that counts. */
  readonly model: string;
}

/** WritingLimits are the length a writing task asks for. */
export interface WritingLimits {
  readonly minWords: number;
  readonly maxChars: number;
}

/**
 * writingGenerator picks an item of a bank by seed; the learner writes a text that a model
 * judges against criteria of the topic. A response far too short is a listed wrong one.
 */
export function writingGenerator(
  question: Text,
  bank: readonly WritingItem[],
  criteria: readonly string[],
  limits: WritingLimits,
  why: (model: string) => Text,
): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    return {
      prompt: joinText([question, sameText(item.task), ...(item.source ? [sameText(quote(item.source))] : [])]),
      answer: {
        checker: "writing",
        expected: { ...limits },
        input: { kind: "writing", ...limits },
        judged: { criteria: [...criteria], ...(item.source && { source: item.source }) },
      },
      solution: why(item.model),
      canonical: item.model,
      wrong: [item.model.split(/\s+/u).slice(0, 3).join(" ")],
    };
  };
}

/** point builds a knowledge point. */
export function point(id: string, title: Text, explanation: Text, generate: Generator): KnowledgePointDef {
  return { id, title, explanation, generate };
}
