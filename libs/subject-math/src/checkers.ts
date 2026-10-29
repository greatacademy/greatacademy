import type { Checker, Json, Text, Verdict } from "@ga/content";
import { t } from "@ga/content";

import { equivalent, evaluate } from "./algebra.ts";
import { isSimplifiedPolynomial, type NumberLiteral, numberLiteral } from "./forms.ts";
import { isRelation, type Node, ParseError, parseExpression, parseLatex, type RelOp, unwrap } from "./latex.ts";
import { Q } from "./rational.ts";

const feedback = {
  unreadable: t("This answer could not be read as mathematics.", "无法把这个答案识别为数学表达式。"),
  singleNumber: t("Simplify your answer to a single number.", "请把答案化简成一个数。"),
  lowestTerms: t("Write the fraction in lowest terms.", "请把分数化成最简分数。"),
  integer: t("Write the answer as an integer.", "请把答案写成整数。"),
  fraction: t("Write the answer as a fraction, not a decimal.", "请把答案写成分数，而不是小数。"),
  decimal: t("Write the answer as a decimal.", "请把答案写成小数。"),
  expression: t("Write an expression, not an equation.", "请写出表达式，而不是等式。"),
  simplify: t("Simplify fully: remove parentheses and combine like terms.", "请完全化简：去掉括号并合并同类项。"),
  inequality: t("Write an inequality such as $x < 3$.", "请写出不等式，例如 $x < 3$。"),
} satisfies Record<string, Text>;

const wrong = (fb?: Text): Verdict => (fb ? { correct: false, feedback: fb } : { correct: false });

function parse<T>(f: () => T): T | Verdict {
  try {
    return f();
  } catch (e) {
    if (e instanceof ParseError) return wrong(feedback.unreadable);
    throw e;
  }
}

const isVerdict = (x: unknown): x is Verdict => typeof x === "object" && x !== null && "correct" in x;

function obj(expected: Json): Record<string, Json> {
  if (typeof expected !== "object" || expected === null || Array.isArray(expected)) throw new TypeError("expected must be an object");
  return expected as Record<string, Json>;
}

function str(o: Record<string, Json>, key: string): string {
  const v = o[key];
  if (typeof v !== "string") throw new TypeError(`expected.${key} must be a string`);
  return v;
}

/** NumberForm is the form a numeric answer must take. */
export type NumberForm = "number" | "integer" | "fraction" | "decimal";

/** judgeLiteral checks a number literal's value and form. */
function judgeLiteral(lit: NumberLiteral | undefined, node: Node, value: Q, form: NumberForm): Verdict {
  if (!lit) {
    let v: Q | undefined;
    try {
      v = evaluate(node);
    } catch {
      v = undefined;
    }
    return wrong(v?.eq(value) ? feedback.singleNumber : undefined);
  }
  if (!lit.value.eq(value)) return wrong();
  if (form === "integer" && lit.kind !== "integer") return wrong(feedback.integer);
  if (form === "decimal" && lit.kind !== "decimal" && lit.kind !== "integer") return wrong(feedback.decimal);
  if (form === "fraction" && lit.kind === "decimal") return wrong(feedback.fraction);
  if (!lit.reduced) return wrong(feedback.lowestTerms);
  return { correct: true };
}

/**
 * numberChecker accepts a single number equal to expected.value (a rational
 * such as "-3", "3/4" or "2.5"), written in expected.form:
 * - "number" (default): an integer, decimal, fraction in lowest terms or mixed number;
 * - "integer": an integer;
 * - "fraction": an integer, fraction in lowest terms or mixed number;
 * - "decimal": an integer or decimal.
 * With expected.var, "x = 3" and "3 = x" are accepted as well as "3".
 */
export const numberChecker: Checker = {
  id: "number",
  check(expected, response) {
    const e = obj(expected);
    const value = Q.parse(str(e, "value"));
    const form = (e.form ?? "number") as NumberForm;
    const variable = typeof e.var === "string" ? e.var : undefined;
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    let node: Node;
    if (isRelation(parsed)) {
      if (!variable || parsed.op !== "=") return wrong(feedback.singleNumber);
      const l = unwrap(parsed.left);
      const r = unwrap(parsed.right);
      if (l.k === "var" && l.name === variable) node = parsed.right;
      else if (r.k === "var" && r.name === variable) node = parsed.left;
      else return wrong();
    } else node = parsed;
    return judgeLiteral(numberLiteral(node), node, value, form);
  },
};

/**
 * expressionChecker accepts an expression equivalent to expected.expr (LaTeX).
 * With expected.form "simplified", the response must also be a polynomial in
 * simplest form (see isSimplifiedPolynomial).
 */
export const expressionChecker: Checker = {
  id: "expression",
  check(expected, response) {
    const e = obj(expected);
    const target = parseExpression(str(e, "expr"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.expression);
    if (!equivalent(parsed, target)) return wrong();
    if (e.form === "simplified" && !isSimplifiedPolynomial(parsed)) return wrong(feedback.simplify);
    return { correct: true };
  },
};

const flipped: Record<RelOp, RelOp> = { "=": "=", "<": ">", ">": "<", "<=": ">=", ">=": "<=" };

/**
 * inequalityChecker accepts a simple inequality between expected.var and a
 * number: expected.op is one of "<", "<=", ">", ">=" and expected.value a
 * rational. Both "x < 3" and "3 > x" are accepted; the number must be written
 * as in numberChecker's default form.
 */
export const inequalityChecker: Checker = {
  id: "inequality",
  check(expected, response) {
    const e = obj(expected);
    const variable = str(e, "var");
    const op = str(e, "op") as RelOp;
    const value = Q.parse(str(e, "value"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (!isRelation(parsed) || parsed.op === "=") return wrong(feedback.inequality);
    const l = unwrap(parsed.left);
    const r = unwrap(parsed.right);
    let side: Node;
    let rel: RelOp;
    if (l.k === "var" && l.name === variable) {
      side = parsed.right;
      rel = parsed.op;
    } else if (r.k === "var" && r.name === variable) {
      side = parsed.left;
      rel = flipped[parsed.op];
    } else return wrong(feedback.inequality);
    if (rel !== op) return wrong();
    return judgeLiteral(numberLiteral(side), side, value, "number");
  },
};

/** mathCheckers are the checkers the mathematics subject registers. */
export const mathCheckers: readonly Checker[] = [numberChecker, expressionChecker, inequalityChecker];
