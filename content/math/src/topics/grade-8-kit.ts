// Writing helpers for the topics of grade 8: answers in scientific notation with a reason for
// each wrong one, and the drawings of powers that several grade-8 files share.

import type { Figure, Problem } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Q, sci } from "@ga/subject-math";

import { expressionProblem, radicalProblem, scientificProblem, withMistakes } from "../problems.ts";
import { type Pair, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import type { Said } from "./grade-6-kit.ts";
import { areaGridFigure, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** Shift is a wrong answer in scientific notation, a × 10^n, with the reason a learner writes it. */
export type Shift = readonly [a: Q, n: number, en: string, zh: string];

/** scienced asks for a number in scientific notation, works it in labelled steps with a check, and answers each wrong one with its reason. */
export function scienced(
  prompt: Pair,
  a: Q,
  n: number,
  walk: readonly Walk[],
  check: Pair,
  shifts: readonly Shift[],
  figure?: Figure,
): Problem {
  const problem = scientificProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: { a, n },
    wrong: shifts.map(([wa, wn]) => [wa, wn] as const),
    solution: walkThrough(walk, check),
  });
  const reasons = shifts
    .filter(([wa, wn]) => problem.wrong?.includes(sci(wa, wn)))
    .map(([wa, wn, en, zh]) => ({ response: sci(wa, wn), why: t(en, zh) }));
  const listed = withMistakes(problem, reasons);
  return figure ? { ...listed, figure } : listed;
}

/** rooted asks for an answer in simplest radical form, works it in labelled steps with a check, and answers each wrong one with its reason. */
export function rooted(
  prompt: Pair,
  answer: readonly [Coefficient, number],
  walk: readonly Walk[],
  check: Pair,
  saids: readonly Said[],
  figure?: Figure,
): Problem {
  const problem = radicalProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: saids.map(([response]) => response),
    solution: walkThrough(walk, check),
  });
  const reasons = saids
    .filter(([response], i) => problem.wrong?.includes(response) && saids.findIndex(([r]) => r === response) === i)
    .map(([response, en, zh]) => ({ response, why: t(en, zh) }));
  const listed = withMistakes(problem, reasons);
  return figure ? { ...listed, figure } : listed;
}

/** surdExpressed asks for an expression in simplest radical form, works it in labelled steps with a check, and answers each distinct wrong one with its reason. */
export function surdExpressed(
  prompt: Pair,
  answer: string,
  walk: readonly Walk[],
  check: Pair,
  saids: readonly Said[],
  figure?: Figure,
): Problem {
  const kept = saids.filter(([r], i) => r !== answer && saids.findIndex(([w]) => w === r) === i);
  const problem = expressionProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    radical: true,
    mistakes: kept.map(([response, en, zh]) => ({ response, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  });
  return figure ? { ...problem, figure } : problem;
}

/** factorTape draws one bar of single factors in groups, each group shaded in turn, with the whole power written over it. */
export function factorTape(groups: readonly (readonly [text: string, count: number])[], total: string, alt: Pair): Figure {
  const pieces = groups.flatMap(([text, count], g) => Array.from({ length: count }, () => ({ size: 1, text, lit: g % 2 === 1 })));
  return tapeFigure([{ total, pieces }], alt);
}

/** tableFigure draws a table of values in the grid of an area model, with its own description in place of the area model's. */
export function tableFigure(
  rows: readonly string[],
  columns: readonly string[],
  inside: readonly (readonly string[])[],
  alt: Pair,
): Figure {
  return { ...areaGridFigure(rows, columns, inside), alt: t(alt[0], alt[1]) };
}

/** superscript writes an integer in superscript digits: superscript(-2) is "⁻²". */
export function superscript(n: number): string {
  const digits = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return `${n < 0 ? "⁻" : ""}${[...String(Math.abs(n))].map((d) => digits[Number(d)]).join("")}`;
}

/** stepDown draws a number line with powers of b from bᵉ down to b⁰ = 1, each jump dividing by b. */
export function stepDown(b: number, e: number, alt: Pair): Figure {
  const values = Array.from({ length: e + 1 }, (_, i) => b ** (e - i));
  return lineFigure(
    {
      lo: 0,
      hi: b ** e,
      step: 1,
      labels: [0, ...values],
      marks: values.map((v, i) => ({ at: v, text: `${b}${superscript(e - i)}`, result: i === e })),
      jumps: values.slice(1).map((v, i) => [values[i] ?? 0, v] as const),
    },
    alt,
  );
}

/** fractionSteps draws a number line from 0 to 1 with b⁰ = 1 and the powers b⁻¹ … b⁻ᵉ, each jump dividing by b. */
export function fractionSteps(b: number, e: number, alt: Pair): Figure {
  const values = Array.from({ length: e + 1 }, (_, i) => 1 / b ** i);
  return lineFigure(
    {
      lo: 0,
      hi: 1,
      step: 1 / b ** e,
      labels: values.slice(0, 3),
      label: (v) => (v === 1 ? "1" : `1/${Math.round(1 / v)}`),
      marks: values.map((v, i) => ({ at: v, text: `${b}${superscript(-i)}`, result: i === e })),
      jumps: values.slice(1).map((v, i) => [values[i] ?? 0, v] as const),
    },
    alt,
  );
}
