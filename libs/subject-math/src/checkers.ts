import type { Checker, Json, Text, Verdict } from "@ga/content";
import { t } from "@ga/content";

import { equivalent, evaluate } from "./algebra.ts";
import { isSimplifiedPolynomial, type NumberLiteral, numberLiteral } from "./forms.ts";
import { isRelation, type Node, ParseError, parseExpression, parseLatex, type RelOp, unwrap } from "./latex.ts";
import { isPrime, isSquareFree } from "./numbers.ts";
import { Q } from "./rational.ts";

const feedback = {
  unreadable: t("This answer could not be read as mathematics.", "无法把这个答案识别为数学表达式。"),
  singleNumber: t("Simplify your answer to a single number.", "请把答案化简成一个数。"),
  lowestTerms: t("Write the fraction in lowest terms.", "请把分数化成最简分数。"),
  integer: t("Write the answer as an integer.", "请把答案写成整数。"),
  fraction: t("Write the answer as a fraction, not a decimal.", "请把答案写成分数，而不是小数。"),
  decimal: t("Write the answer as a decimal.", "请把答案写成小数。"),
  mixed: t("Write the answer as a mixed number.", "请把答案写成带分数。"),
  primes: t("Write the number as a product of primes, such as $2^{2} \\cdot 3$.", "请把这个数写成质数的乘积，例如 $2^{2} \\cdot 3$。"),
  scientific: t(
    "Write the number in scientific notation, $a \\times 10^{n}$ with $1 \\le a < 10$.",
    "请用科学记数法写出这个数，即 $a \\times 10^{n}$，其中 $1 \\le a < 10$。",
  ),
  radical: t(
    "Simplify the radical: no perfect-square factor under the root, no root in the denominator, and the fraction in lowest terms.",
    "请化简根式：根号内不含完全平方因数，分母中不含根号，分数化为最简。",
  ),
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
export type NumberForm = "number" | "integer" | "fraction" | "decimal" | "mixed";

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
  if (form === "mixed" && (lit.kind === "decimal" || (lit.kind === "fraction" && value.abs().cmp(Q.one) > 0))) return wrong(feedback.mixed);
  if (!lit.reduced) return wrong(feedback.lowestTerms);
  return { correct: true };
}

/**
 * stripUnit removes a unit the learner typed after a number: "°" as °,
 * ^\circ or \degree; a unit such as "cm^2" as cm, \text{cm} or
 * \mathrm{cm}, with its exponent, after optional spacing.
 */
export function stripUnit(response: string, unit: string): string {
  if (unit === "°") return response.replace(/\s*(?:°|\^\{?\\circ\}?|\\degree)\s*$/, "");
  const [name = "", power] = unit.split("^");
  const exponent = power ? `\\^\\{?${power}\\}?` : "";
  const pattern = new RegExp(`(?:\\s|\\\\[,;:! ]|~)*(?:\\\\(?:text|mathrm)\\{\\s*${name}\\s*\\}|${name})${exponent}\\s*$`);
  return response.replace(pattern, "");
}

/**
 * numberChecker accepts a single number equal to expected.value (a rational
 * such as "-3", "3/4" or "2.5"), written in expected.form:
 * - "number" (default): an integer, decimal, fraction in lowest terms or mixed number;
 * - "integer": an integer;
 * - "fraction": an integer, fraction in lowest terms or mixed number;
 * - "decimal": an integer or decimal;
 * - "mixed": an integer, mixed number, or fraction less than 1 in absolute value.
 * With expected.var, "x = 3" and "3 = x" are accepted as well as "3". With
 * expected.percent, the field is followed by a percent sign and one typed by
 * the learner as well is ignored; likewise with expected.unit, "°" or a unit
 * such as "cm" or "cm^2" (see stripUnit).
 */
export const numberChecker: Checker = {
  id: "number",
  check(expected, response) {
    const e = obj(expected);
    const value = Q.parse(str(e, "value"));
    const form = (e.form ?? "number") as NumberForm;
    const variable = typeof e.var === "string" ? e.var : undefined;
    const unit = typeof e.unit === "string" ? e.unit : undefined;
    const text = e.percent === true ? response.replace(/\\?%\s*$/, "") : unit ? stripUnit(response, unit) : response;
    const parsed = parse(() => parseLatex(text));
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

function primeFactor(node: Node): { p: bigint; e: bigint } | undefined {
  const n = unwrap(node);
  const prime = (x: Node) => (x.k === "num" && !x.decimal && x.v.isInteger() && isPrime(Number(x.v.n)) ? x.v.n : undefined);
  if (n.k === "num") {
    const p = prime(n);
    return p === undefined ? undefined : { p, e: 1n };
  }
  if (n.k === "pow") {
    const p = prime(unwrap(n.a));
    const b = unwrap(n.b);
    if (p === undefined || b.k !== "num" || b.decimal || !b.v.isInteger() || b.v.n < 1n) return undefined;
    return { p, e: b.v.n };
  }
  return undefined;
}

/**
 * factorizationChecker accepts a prime factorization of expected.value, an
 * integer ≥ 2: a product of primes and powers of primes, in any order, such as
 * "2^{3} \\cdot 3" or "2 \\cdot 2 \\cdot 2 \\cdot 3".
 */
export const factorizationChecker: Checker = {
  id: "factorization",
  check(expected, response) {
    const value = BigInt(str(obj(expected), "value"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.primes);
    const terms: Node[] = [];
    const collect = (n: Node) => {
      const u = unwrap(n);
      if (u.k === "mul") {
        collect(u.a);
        collect(u.b);
      } else terms.push(u);
    };
    collect(parsed);
    let product = 1n;
    let allPrime = true;
    for (const term of terms) {
      const f = primeFactor(term);
      if (!f) {
        allPrime = false;
        break;
      }
      product *= f.p ** f.e;
    }
    if (allPrime) return product === value ? { correct: true } : wrong();
    let v: Q | undefined;
    try {
      v = evaluate(parsed);
    } catch {
      v = undefined;
    }
    return wrong(v?.eq(Q.of(value)) ? feedback.primes : undefined);
  },
};

/** exactValue is the value of an expression, or undefined when it has none (a variable, an irrational root). */
function exactValue(node: Node): Q | undefined {
  try {
    return evaluate(node);
  } catch {
    return undefined;
  }
}

function integerLiteral(node: Node): bigint | undefined {
  const n = unwrap(node);
  if (n.k === "neg") {
    const v = integerLiteral(n.a);
    return v === undefined ? undefined : -v;
  }
  return n.k === "num" && !n.decimal && n.v.isInteger() ? n.v.n : undefined;
}

/** scientificParts reads a × 10ⁿ (a signed integer or decimal, n an integer), or 10ⁿ alone. */
function scientificParts(node: Node): { a: Q; n: bigint } | undefined {
  const u = unwrap(node);
  if (u.k === "neg") {
    const p = scientificParts(u.a);
    return p && { a: p.a.neg(), n: p.n };
  }
  const power = (x: Node) => {
    const w = unwrap(x);
    if (w.k !== "pow") return undefined;
    const base = unwrap(w.a);
    if (base.k !== "num" || base.decimal || !base.v.eq(Q.of(10))) return undefined;
    return integerLiteral(w.b);
  };
  const alone = power(u);
  if (alone !== undefined) return { a: Q.one, n: alone };
  if (u.k !== "mul") return undefined;
  const lit = numberLiteral(u.a);
  const n = power(u.b);
  if (!lit || (lit.kind !== "integer" && lit.kind !== "decimal") || n === undefined) return undefined;
  return { a: lit.value, n };
}

/**
 * scientificChecker accepts expected.value (a rational) written in scientific
 * notation: a × 10ⁿ with 1 ≤ |a| < 10 written as an integer or decimal, such
 * as "4.5 \\times 10^{3}", "4.5 \\cdot 10^{-3}" or "10^{6}".
 */
export const scientificChecker: Checker = {
  id: "scientific",
  check(expected, response) {
    const value = Q.parse(str(obj(expected), "value"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.scientific);
    const p = scientificParts(parsed);
    const ten = Q.of(10);
    if (p && p.a.abs().cmp(Q.one) >= 0 && p.a.abs().cmp(ten) < 0) {
      const v = p.a.mul(p.n >= 0n ? ten.pow(Number(p.n)) : Q.one.div(ten.pow(Number(-p.n))));
      return v.eq(value) ? { correct: true } : wrong();
    }
    return wrong(exactValue(parsed)?.eq(value) || p ? feedback.scientific : undefined);
  },
};

/** RadicalTerm is c√m, read from a response; simplest tells whether it was written in simplest form. */
interface RadicalTerm {
  readonly c: Q;
  readonly m: bigint;
  readonly simplest: boolean;
}

/** radicalTerm reads a rational, √m, c√m, c·√m, or (c√m)/d, with an optional sign. */
function radicalTerm(node: Node): RadicalTerm | undefined {
  const u = unwrap(node);
  if (u.k === "neg") {
    const t = radicalTerm(u.a);
    return t && { ...t, c: t.c.neg() };
  }
  const root = (x: Node): bigint | undefined => {
    const w = unwrap(x);
    if (w.k !== "sqrt") return undefined;
    const m = integerLiteral(w.a);
    return m !== undefined && m >= 1n ? m : undefined;
  };
  const lit = numberLiteral(u);
  if (lit) return { c: lit.value, m: 1n, simplest: lit.reduced && lit.kind !== "decimal" };
  const m = root(u);
  if (m !== undefined) return { c: Q.one, m, simplest: m > 1n && isSquareFree(Number(m)) };
  if (u.k === "mul") {
    const c = numberLiteral(u.a);
    const r = root(u.b);
    if (!c || r === undefined || c.kind === "decimal") return undefined;
    return { c: c.value, m: r, simplest: c.reduced && r > 1n && isSquareFree(Number(r)) && !c.value.abs().eq(Q.one) };
  }
  if (u.k === "div") {
    const top = radicalTerm(u.a);
    const d = integerLiteral(u.b);
    if (!top || top.m === 1n || d === undefined || d <= 1n) return undefined;
    const c = top.c.div(Q.of(d));
    return { c, m: top.m, simplest: top.simplest && top.c.isInteger() && c.d === d };
  }
  return undefined;
}

/**
 * radicalChecker accepts expected.coef × √expected.radicand (a rational and a
 * square-free integer ≥ 1) in simplest radical form: "6\\sqrt{2}",
 * "-\\sqrt{5}", "\\frac{\\sqrt{6}}{3}" or "\\frac{2\\sqrt{3}}{3}"; with radicand 1
 * the answer is a rational number. An equal value in another form, such as
 * "\\sqrt{72}" or "\\frac{2}{\\sqrt{3}}", earns the simplification feedback.
 */
export const radicalChecker: Checker = {
  id: "radical",
  check(expected, response) {
    const e = obj(expected);
    const coef = Q.parse(str(e, "coef"));
    const radicand = BigInt(str(e, "radicand"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.radical);
    const t = radicalTerm(parsed);
    // c√m and coef√radicand are equal when they have the same sign and c²m = coef²·radicand.
    const square = (c: Q, m: bigint) => c.mul(c).mul(Q.of(m));
    const same = (c: Q, m: bigint) => c.sign() === coef.sign() && square(c, m).eq(square(coef, radicand));
    if (t) {
      if (!same(t.c, t.m)) return wrong();
      return t.simplest ? { correct: true } : wrong(feedback.radical);
    }
    // Other forms: a root in the denominator, or a product of roots.
    const u = unwrap(parsed);
    if (u.k === "div") {
      const top = radicalTerm(u.a);
      const bottom = radicalTerm(u.b);
      if (top && bottom && !bottom.c.isZero()) {
        // (a√p)/(b√q) = (a/(bq))·√(pq)
        const c = top.c.div(bottom.c.mul(Q.of(bottom.m)));
        if (same(c, top.m * bottom.m)) return wrong(feedback.radical);
      }
    }
    return wrong(exactValue(parsed)?.eq(coef) && radicand === 1n ? feedback.singleNumber : undefined);
  },
};

/** mathCheckers are the checkers the mathematics subject registers. */
export const mathCheckers: readonly Checker[] = [
  numberChecker,
  expressionChecker,
  inequalityChecker,
  factorizationChecker,
  scientificChecker,
  radicalChecker,
];
