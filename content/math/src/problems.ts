import type { Problem, Text } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  dec,
  equivalent,
  factorizationLatex,
  parseExpression,
  primeFactors,
  Q,
  radical,
  relSymbol,
  sci,
} from "@ga/subject-math";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** NumberProblem describes a problem whose answer is one number. */
export interface NumberProblem {
  readonly prompt: Text;
  readonly answer: Coefficient;
  readonly solution: Text;
  /** wrong are the values typical mistakes produce; values equal to the answer are dropped. */
  readonly wrong?: readonly Coefficient[];
  /** solveFor shows "x =" before the field and accepts "x = …". */
  readonly solveFor?: string;
  readonly form?: "number" | "integer" | "fraction" | "decimal" | "mixed";
  /** percent shows a percent sign after the field: the answer is a number of percent. */
  readonly percent?: boolean;
  /** unit shows a unit after the field: "°", or a unit such as "cm" or "cm^2". */
  readonly unit?: string;
}

/** mixedLatex writes a number as an integer or a mixed number: "2\frac{1}{3}", "-\frac{2}{3}". */
export function mixedLatex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isInteger()) return v.toLatex();
  const a = v.abs();
  const whole = a.n / a.d;
  const rest = Q.of(a.n % a.d, a.d);
  const body = whole === 0n ? rest.toLatex() : `${whole}${rest.toLatex()}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** latexIn writes a number in the form a numeric answer asks for. */
function latexIn(v: Q, form: NumberProblem["form"]): string {
  if (form === "decimal") return dec(v);
  if (form === "mixed") return mixedLatex(v);
  return v.toLatex();
}

/** numberProblem builds a problem checked by the "number" checker. */
export function numberProblem(p: NumberProblem): Problem {
  const answer = toQ(p.answer);
  const wrong = [
    ...new Set(
      (p.wrong ?? [])
        .map(toQ)
        .filter((w) => !w.eq(answer))
        .map((w) => (p.form === "decimal" && isTerminating(w) ? dec(w) : w.toLatex())),
    ),
  ];
  return {
    prompt: p.prompt,
    answer: {
      checker: "number",
      expected: {
        value: answer.toString(),
        ...(p.form && { form: p.form }),
        ...(p.solveFor && { var: p.solveFor }),
        ...(p.percent && { percent: true }),
        ...(p.unit && { unit: p.unit }),
      },
      input: {
        kind: "math",
        ...(p.solveFor && { prefix: `${p.solveFor} =` }),
        ...(p.percent && { suffix: "\\%" }),
        ...(p.unit && { suffix: unitLatex(p.unit) }),
      },
    },
    solution: p.solution,
    canonical: latexIn(answer, p.form),
    wrong,
  };
}

/** unitLatex writes a unit after a number: "^{\\circ}" for degrees, "\\text{ cm}^{2}" for "cm^2". */
export function unitLatex(unit: string): string {
  if (unit === "°") return "^{\\circ}";
  const [name, power] = unit.split("^");
  return `\\text{ ${name}}${power ? `^{${power}}` : ""}`;
}

/** isTerminating tells whether a number has a terminating decimal expansion. */
export function isTerminating(c: Coefficient): boolean {
  let d = toQ(c).d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n;
}

/** FactorizationProblem describes a problem whose answer is the prime factorization of a number. */
export interface FactorizationProblem {
  readonly prompt: Text;
  readonly value: number;
  readonly solution: Text;
  /** wrong are products typical mistakes produce, in LaTeX. */
  readonly wrong?: readonly string[];
}

/** factorizationProblem builds a problem checked by the "factorization" checker. */
export function factorizationProblem(p: FactorizationProblem): Problem {
  const canonical = factorizationLatex(primeFactors(p.value));
  return {
    prompt: p.prompt,
    answer: { checker: "factorization", expected: { value: String(p.value) }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => w !== canonical),
  };
}

/** ScientificProblem describes a problem whose answer is a number written in scientific notation. */
export interface ScientificProblem {
  readonly prompt: Text;
  /** answer is a × 10^n with 1 ≤ |a| < 10. */
  readonly answer: { readonly a: Coefficient; readonly n: number };
  readonly solution: Text;
  /** wrong are the a × 10^n pairs typical mistakes produce; any equal to the answer are dropped. */
  readonly wrong?: readonly (readonly [Coefficient, number])[];
}

/** scientificValue is a × 10^n as an exact rational. */
export function scientificValue(a: Coefficient, n: number): Q {
  const ten = Q.of(10);
  return toQ(a).mul(n >= 0 ? ten.pow(n) : Q.one.div(ten.pow(-n)));
}

/** scientificProblem builds a problem checked by the "scientific" checker. */
export function scientificProblem(p: ScientificProblem): Problem {
  const value = scientificValue(p.answer.a, p.answer.n);
  const canonical = sci(p.answer.a, p.answer.n);
  const wrong = [...new Set((p.wrong ?? []).filter(([a, n]) => !scientificValue(a, n).eq(value)).map(([a, n]) => sci(a, n)))];
  return {
    prompt: p.prompt,
    answer: { checker: "scientific", expected: { value: value.toString() }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong,
  };
}

/** RadicalProblem describes a problem whose answer is c√m in simplest radical form. */
export interface RadicalProblem {
  readonly prompt: Text;
  /** answer is [c, m] with m square-free; m = 1 for a rational answer. */
  readonly answer: readonly [Coefficient, number];
  readonly solution: Text;
  /** wrong are responses typical mistakes produce, in LaTeX. */
  readonly wrong?: readonly string[];
}

/** radicalProblem builds a problem checked by the "radical" checker. */
export function radicalProblem(p: RadicalProblem): Problem {
  const [c, m] = p.answer;
  const canonical = radical(c, m);
  return {
    prompt: p.prompt,
    answer: { checker: "radical", expected: { coef: toQ(c).toString(), radicand: String(m) }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => w !== canonical),
  };
}

/** ExpressionProblem describes a problem whose answer is an expression. */
export interface ExpressionProblem {
  readonly prompt: Text;
  /** answer is the expected expression in LaTeX, in simplest form. */
  readonly answer: string;
  readonly solution: Text;
  /** simplified requires the response to be a fully simplified polynomial. */
  readonly simplified?: boolean;
  /** wrong are responses typical mistakes produce; expressions equivalent to the answer are dropped unless simplification is required. */
  readonly wrong?: readonly string[];
}

/** expressionProblem builds a problem checked by the "expression" checker. */
export function expressionProblem(p: ExpressionProblem): Problem {
  const target = parseExpression(p.answer);
  const wrong = [...new Set(p.wrong ?? [])].filter((w) => w !== p.answer && (p.simplified || !equivalent(parseExpression(w), target)));
  return {
    prompt: p.prompt,
    answer: { checker: "expression", expected: { expr: p.answer, ...(p.simplified && { form: "simplified" }) }, input: { kind: "math" } },
    solution: p.solution,
    canonical: p.answer,
    wrong,
  };
}

/** InequalityOp is the relation of a solution set such as x < 3. */
export type InequalityOp = "<" | "<=" | ">" | ">=";

/** InequalityProblem describes a problem whose answer is a simple inequality. */
export interface InequalityProblem {
  readonly prompt: Text;
  readonly variable?: string;
  readonly op: InequalityOp;
  readonly value: Coefficient;
  readonly solution: Text;
  /** wrong are the relations typical mistakes produce; the answer itself is dropped. */
  readonly wrong?: readonly (readonly [InequalityOp, Coefficient])[];
}

/** inequalityLatex writes "x < 3". */
export function inequalityLatex(variable: string, op: InequalityOp, value: Coefficient): string {
  return `${variable} ${relSymbol(op)} ${toQ(value).toLatex()}`;
}

/** inequalityProblem builds a problem checked by the "inequality" checker. */
export function inequalityProblem(p: InequalityProblem): Problem {
  const variable = p.variable ?? "x";
  const value = toQ(p.value);
  const wrong = [
    ...new Set((p.wrong ?? []).filter(([op, v]) => op !== p.op || !toQ(v).eq(value)).map(([op, v]) => inequalityLatex(variable, op, v))),
  ];
  return {
    prompt: p.prompt,
    answer: { checker: "inequality", expected: { var: variable, op: p.op, value: value.toString() }, input: { kind: "math" } },
    solution: p.solution,
    canonical: inequalityLatex(variable, p.op, value),
    wrong,
  };
}

/** ChoiceProblem describes a multiple-choice problem with options in a fixed order. */
export interface ChoiceProblem {
  readonly prompt: Text;
  readonly options: readonly Text[];
  readonly correct: number;
  readonly solution: Text;
}

/** choiceProblem builds a problem checked by the "choice" checker; every other option is a wrong response. */
export function choiceProblem(p: ChoiceProblem): Problem {
  return {
    prompt: p.prompt,
    answer: { checker: "choice", expected: p.correct, input: { kind: "choice", options: p.options } },
    solution: p.solution,
    canonical: String(p.correct),
    wrong: p.options.map((_, i) => String(i)).filter((i) => i !== String(p.correct)),
  };
}

/** yesNo are the options of a yes-or-no question. */
export const yesNo: readonly Text[] = [t("Yes", "是"), t("No", "否")];

/** steps writes solution steps as display math on lines of their own. */
export function steps(...lines: readonly string[]): string {
  return `\n\n${lines.map((l) => `$$${l}$$`).join("\n\n")}\n\n`;
}
