// Helpers shared by the files that give topics a third knowledge point.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { chooseMath, type Pair } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
export const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** fraction builds a problem whose answer is a fraction, dropping wrong answers equal to it. */
export const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** decimal builds a problem whose answer is a decimal, dropping wrong answers equal to it. */
export const decimal = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "decimal",
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** integer builds a problem whose answer is an integer that may be negative, filling up the wrong answers it needs. */
export const integer = (prompt: Pair, answer: number, wrong: readonly number[], solution: Pair) => {
  const kept = [...new Set(wrong.filter((w) => w !== answer))];
  for (let k = 1; kept.length < 3; k++) if (!kept.includes(answer + k)) kept.push(answer + k);
  return numberProblem({ prompt: t(prompt[0], prompt[1]), answer, form: "integer", wrong: kept, solution: t(solution[0], solution[1]) });
};

/** frac writes a fraction in LaTeX. */
export const frac = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** tenths writes a count of tenths as a decimal. */
export const tenths = (n: number) => (n / 10).toFixed(1);

/** signed writes a number after a term, as " + 3" or " - 3", and nothing for 0. */
export const signed = (n: number) => (n === 0 ? "" : n < 0 ? ` - ${-n}` : ` + ${n}`);

/** gcd finds the greatest common factor of two whole numbers. */
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** chooseFilled builds a choice problem with four options, filling in near misses of the answer when wrong answers coincide. */
export const chooseFilled = (
  rng: Parameters<KnowledgePointDef["generate"]>[0],
  prompt: Pair,
  correct: string,
  wrong: readonly string[],
  solution: Pair,
) => {
  const options: string[] = [];
  for (const option of wrong) if (option !== correct && !options.includes(option)) options.push(option);
  for (let step = 1; options.length < 3 && step < 30; step++) {
    const near = correct.replace(/-?\d+/, (n) => String(Number(n) + step));
    if (near !== correct && !options.includes(near)) options.push(near);
  }
  return chooseMath(rng, prompt, correct, options, solution);
};
