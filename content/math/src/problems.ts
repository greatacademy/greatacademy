import type { Problem, Text } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, equivalent, parseExpression, Q, relSymbol } from "@ga/subject-math";

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
  readonly form?: "number" | "integer" | "fraction" | "decimal";
}

/** numberProblem builds a problem checked by the "number" checker. */
export function numberProblem(p: NumberProblem): Problem {
  const answer = toQ(p.answer);
  const wrong = [
    ...new Set(
      (p.wrong ?? [])
        .map(toQ)
        .filter((w) => !w.eq(answer))
        .map((w) => w.toLatex()),
    ),
  ];
  return {
    prompt: p.prompt,
    answer: {
      checker: "number",
      expected: { value: answer.toString(), ...(p.form && { form: p.form }), ...(p.solveFor && { var: p.solveFor }) },
      input: p.solveFor ? { kind: "math", prefix: `${p.solveFor} =` } : { kind: "math" },
    },
    solution: p.solution,
    canonical: answer.toLatex(),
    wrong,
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
