import { type Generator, joinText, type KnowledgePointDef, type Problem, type Rng, same, type Text } from "@ga/content";

/** quote sets text as a block quote, every line of it. */
export const quote = (s: string): string =>
  s
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");

/** Why builds the solution of an item from its right answer and what was shown, in every locale. */
export type Why = (right: string, shown: string) => Text;

/** WhyNot builds the feedback for a wrong option: what it shows about the learner's reading, without the solution. */
export type WhyNot = (wrong: string, right: string, shown: string) => Text;

/** ChoiceItem is one bank item of a choice: what to show, the right option and the wrong ones. */
export type ChoiceItem = readonly [shown: string, right: string, wrong: readonly string[]];

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
      prompt: shown === "" ? question : joinText([question, same(quote(shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution: why(right, shown),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(whyNot && {
        mistakes: wrong.map((w) => ({ response: String(options.indexOf(w)), feedback: whyNot(w, right, shown) })),
      }),
    };
  };
}

/** TypedItem is one bank item of a typed answer: what to show, the accepted answers with the first shown, and likely errors. */
export interface TypedItem {
  readonly shown: string;
  readonly accepted: readonly string[];
  /** wrong are plausible wrong responses, each of them rejected. */
  readonly wrong: readonly string[];
}

/** typed builds a TypedItem. */
export function typed(shown: string, accepted: string | readonly string[], wrong: readonly string[]): TypedItem {
  return { shown, accepted: typeof accepted === "string" ? [accepted] : accepted, wrong };
}

/** typedGenerator picks an item of a bank by seed; the learner types the answer in characters or in pinyin. */
export function typedGenerator(checker: "hanzi" | "pinyin", question: Text, bank: readonly TypedItem[], why: Why): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const canonical = item.accepted[0] ?? "";
    return {
      prompt: item.shown === "" ? question : joinText([question, same(quote(item.shown))]),
      answer: { checker, expected: [...item.accepted], input: { kind: "text" } },
      solution: why(canonical, item.shown),
      canonical,
      wrong: [...item.wrong],
    };
  };
}

/** point builds a knowledge point. */
export function point(id: string, title: Text, explanation: Text, generate: Generator): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** WritingItem is one task of a judged writing topic. */
export interface WritingItem {
  /** task is what to write, in Chinese; it follows the question. */
  readonly task: string;
  /** model is one good response, in Chinese: shown to the judge, and to the learner after a verdict that counts. */
  readonly model: string;
  /** picture is the path of an illustration of the task, shown with it, as in Problem: the task says in words what it shows. */
  readonly picture?: string;
}

/** WritingLimits are the length a writing task asks for; a Chinese character counts as a word. */
export interface WritingLimits {
  readonly minWords: number;
  readonly maxChars: number;
}

/**
 * writingGenerator picks an item of a bank by seed; the learner writes a text in Chinese that a model judges against
 * criteria of the topic. The first few characters of the model, far too short, are a listed wrong response.
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
      prompt: joinText([question, same(item.task)]),
      ...(item.picture && { picture: item.picture }),
      answer: {
        checker: "writing",
        expected: { ...limits },
        input: { kind: "writing", ...limits },
        judged: { criteria: [...criteria] },
      },
      solution: why(item.model),
      canonical: item.model,
      wrong: [[...item.model].slice(0, 6).join("")],
    };
  };
}
