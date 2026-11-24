// Writing helpers for the topics of grade 6: answers that are numbers of any sign or
// expressions, each typical mistake with its reason, explanations that end in a check
// and a warning, and introductions that open with a scene.

import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, Q } from "@ga/subject-math";

import {
  expressionProblem,
  factoredProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  numberProblem,
  pointLatex,
  pointProblem,
  withMistakes,
} from "../problems.ts";
import { type MathWrong, type Pair, picked, pickedMath, type Walk, type Wrong, walkThrough } from "./early-grades-more-kit.ts";

/** Off is a wrong number with the reason a learner reaches it, in English and Chinese; unlike a Miss it may be negative. */
export type Off = readonly [value: Coefficient, en: string, zh: string];

/** ValueOptions are what a numeric answer may add: its form, a unit or percent sign after the field, a variable before it, and a figure. */
export interface ValueOptions {
  readonly form?: "number" | "integer" | "fraction" | "decimal" | "mixed";
  readonly unit?: string;
  readonly percent?: boolean;
  readonly solveFor?: string;
  readonly figure?: Figure;
}

/** q turns a coefficient into a rational number. */
const q = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** valued asks for one number of any sign, works it in labelled steps with a check, and answers each distinct wrong value with its reason. */
export function valued(
  prompt: Pair,
  answer: Coefficient,
  walk: readonly Walk[],
  check: Pair,
  offs: readonly Off[],
  options: ValueOptions = {},
): Problem {
  const right = q(answer);
  const kept = offs.filter(([v], i) => !q(v).eq(right) && offs.findIndex(([w]) => q(w).eq(q(v))) === i);
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: options.form ?? (right.isInteger() ? "integer" : "number"),
    ...(options.unit && { unit: options.unit }),
    ...(options.percent && { percent: true }),
    ...(options.solveFor && { solveFor: options.solveFor }),
    mistakes: kept.map(([value, en, zh]) => ({ value, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  });
  return options.figure ? { ...problem, figure: options.figure } : problem;
}

/** Said is a wrong response written in LaTeX with the reason a learner gives it. */
export type Said = readonly [response: string, en: string, zh: string];

/** ExpressionOptions are what an expression answer may add: a required simplest form, a prefix before the field, and a figure. */
export interface ExpressionOptions {
  readonly simplified?: boolean;
  readonly prefix?: string;
  readonly figure?: Figure;
}

/** expressed asks for an expression, works it in labelled steps with a check, and answers each wrong response the checker rejects with its reason. */
export function expressed(
  prompt: Pair,
  answer: string,
  walk: readonly Walk[],
  check: Pair,
  saids: readonly Said[],
  options: ExpressionOptions = {},
): Problem {
  const problem = expressionProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    ...(options.simplified && { simplified: true }),
    ...(options.prefix && { prefix: options.prefix }),
    mistakes: saids.map(([response, en, zh]) => ({ response, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  });
  return options.figure ? { ...problem, figure: options.figure } : problem;
}

/** factored asks for a complete factorization, works it in labelled steps with a check, and answers each wrong factorization with its reason. */
export function factored(
  prompt: Pair,
  answer: string,
  walk: readonly Walk[],
  check: Pair,
  saids: readonly Said[],
  figure?: Figure,
): Problem {
  const problem = factoredProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: saids.map(([response]) => response),
    solution: walkThrough(walk, check),
  });
  const listed = saids.filter(([response]) => problem.wrong?.includes(response));
  const withReasons = withMistakes(
    problem,
    listed.map(([response, en, zh]) => ({ response, why: t(en, zh) })),
  );
  return figure ? { ...withReasons, figure } : withReasons;
}

/** Edge is a wrong inequality, given by its symbol and boundary, with the reason a learner writes it. */
export type Edge = readonly [op: InequalityOp, value: Coefficient, en: string, zh: string];

/** bounded asks for an inequality in one variable, works it in labelled steps with a check, and answers each wrong inequality with its reason. */
export function bounded(
  prompt: Pair,
  variable: string,
  op: InequalityOp,
  value: Coefficient,
  walk: readonly Walk[],
  check: Pair,
  edges: readonly Edge[],
  figure?: Figure,
): Problem {
  const problem = inequalityProblem({
    prompt: t(prompt[0], prompt[1]),
    variable,
    op,
    value,
    wrong: edges.map(([o, v]) => [o, v] as const),
    solution: walkThrough(walk, check),
  });
  const withReasons = withMistakes(
    problem,
    edges.map(([o, v, en, zh]) => ({ response: inequalityLatex(variable, o, v), why: t(en, zh) })),
  );
  return figure ? { ...withReasons, figure } : withReasons;
}

/** decided asks a yes-or-no question, works it in labelled steps with a check, and says why the other answer is wrong. */
export function decided(rng: Rng, prompt: Pair, yes: boolean, walk: readonly Walk[], check: Pair, other: Pair, figure?: Figure): Problem {
  const [right, wrong]: [Pair, Pair] = yes
    ? [
        ["Yes", "是"],
        ["No", "否"],
      ]
    : [
        ["No", "否"],
        ["Yes", "是"],
      ];
  return picked(rng, prompt, right, [[wrong, other[0], other[1]]], walk, check, figure);
}

/** chosen is picked from the early-grades kit, named for the grade-6 topics. */
export const chosen = (
  rng: Rng,
  prompt: Pair,
  correct: Pair,
  wrong: readonly Wrong[],
  walk: readonly Walk[],
  check: Pair,
  figure?: Figure,
): Problem => picked(rng, prompt, correct, wrong, walk, check, figure);

/** chosenMath is pickedMath from the early-grades kit, named for the grade-6 topics. */
export const chosenMath = (
  rng: Rng,
  prompt: Pair,
  correct: string,
  wrong: readonly MathWrong[],
  walk: readonly Walk[],
  check: Pair,
  figure?: Figure,
): Problem => pickedMath(rng, prompt, correct, wrong, walk, check, figure);

/** taught writes an explanation: the lesson, then a line that checks it another way, then one warning about one error. */
export function taught(lead: Pair, check: Pair, watch: Pair): Text {
  return t(
    `${lead[0]}\n\nCheck: ${check[0]}\n\n> **Watch out.** ${watch[0]}`,
    `${lead[1]}\n\n检验：${check[1]}\n\n> **注意。** ${watch[1]}`,
  );
}

/** lesson builds a knowledge point from its id, title, explanation parts (lead, check, warning), generator and figure. */
export function lesson(
  id: string,
  title: Pair,
  explanation: readonly [lead: Pair, check: Pair, watch: Pair],
  generate: (rng: Rng) => Problem,
  figure: Figure,
): KnowledgePointDef {
  return { id, title: t(title[0], title[1]), explanation: taught(...explanation), generate, figure };
}

/** drawn returns a drawing that a table of drawings must hold, and fails loudly when it is missing. */
export function drawn(figure: Figure | undefined): Figure {
  if (!figure) throw new Error("a drawing is missing from its table");
  return figure;
}

/** introduced writes a topic introduction: a short scene, a check of it, and what the lesson does. */
export function introduced(scene: Pair, check: Pair, plan: Pair): Text {
  return t(`${scene[0]}\n\nCheck: ${check[0]}\n\nIn this lesson we ${plan[0]}`, `${scene[1]}\n\n检验：${check[1]}\n\n本课我们${plan[1]}`);
}

/** withIntro gives a topic its introduction. */
export const withIntro = (topic: TopicDef, scene: Pair, check: Pair, plan: Pair): TopicDef => ({
  ...topic,
  intro: introduced(scene, check, plan),
});

/** Spot is a wrong point with the reason a learner reaches it, in English and Chinese. */
export type Spot = readonly [point: readonly number[], en: string, zh: string];

/** located asks for a point, works it in labelled steps with a check, and answers each distinct wrong point with its reason. */
export function located(
  prompt: Pair,
  answer: readonly number[],
  walk: readonly Walk[],
  check: Pair,
  spots: readonly Spot[],
  figure?: Figure,
): Problem {
  const key = (p: readonly number[]) => p.join(",");
  const kept = spots.filter(([p], i) => key(p) !== key(answer) && spots.findIndex(([w]) => key(w) === key(p)) === i);
  const problem = pointProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: [...answer],
    wrong: kept.map(([p]) => [...p]),
    solution: walkThrough(walk, check),
  });
  const withReasons = withMistakes(
    problem,
    kept.map(([p, en, zh]) => ({ response: pointLatex(p), why: t(en, zh) })),
  );
  return figure ? { ...withReasons, figure } : withReasons;
}

/** ExactSpot is a wrong point with exact coordinates, such as halves, and the reason a learner reaches it. */
export type ExactSpot = readonly [point: readonly Coefficient[], en: string, zh: string];

/** placed asks for a point with exact coordinates, works it in labelled steps with a check, and answers each distinct wrong point with its reason. */
export function placed(
  prompt: Pair,
  answer: readonly Coefficient[],
  walk: readonly Walk[],
  check: Pair,
  spots: readonly ExactSpot[],
  figure?: Figure,
): Problem {
  const key = (p: readonly Coefficient[]) => pointLatex(p);
  const kept = spots.filter(([p], i) => key(p) !== key(answer) && spots.findIndex(([w]) => key(w) === key(p)) === i);
  const problem = pointProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: [...answer],
    wrong: kept.map(([p]) => [...p]),
    solution: walkThrough(walk, check),
  });
  const withReasons = withMistakes(
    problem,
    kept.map(([p, en, zh]) => ({ response: pointLatex(p), why: t(en, zh) })),
  );
  return figure ? { ...withReasons, figure } : withReasons;
}
