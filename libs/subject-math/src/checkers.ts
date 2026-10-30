import type { Checker, Json, Text, Verdict } from "@ga/content";
import { t } from "@ga/content";

import { equivalent, evaluate, type Poly, toPoly } from "./algebra.ts";
import { isSimplifiedPolynomial, isSimplifiedRadical, type NumberLiteral, numberLiteral } from "./forms.ts";
import { type ParsedSet, parseInequalities, parseIntervals, setEqual } from "./intervals.ts";
import { isRelation, type Node, normalizeLatex, ParseError, parseExpression, parseLatex, type RelOp, unwrap } from "./latex.ts";
import { isPrime, isSquareFree } from "./numbers.ts";
import { Q } from "./rational.ts";
import { type Surd, surdEqual, surdValue } from "./surds.ts";

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
  radicalForm: t(
    "Write the answer in simplest radical form: no perfect-square factor or squared variable under a square root, no fraction under a root, no root in a denominator, and like terms combined.",
    "请写成最简根式：平方根内不含完全平方因数或变量的平方，根号内不含分数，分母中不含根号，并合并同类项。",
  ),
  simplify: t("Simplify fully: remove parentheses and combine like terms.", "请完全化简：去掉括号并合并同类项。"),
  inequality: t("Write an inequality such as $x < 3$.", "请写出不等式，例如 $x < 3$。"),
  interval: t(
    "Write the set in interval notation, such as $(-2, 5]$ or $(-\\infty, 1) \\cup [3, \\infty)$.",
    "请用区间记号写出这个集合，例如 $(-2, 5]$ 或 $(-\\infty, 1) \\cup [3, \\infty)$。",
  ),
  inequalities: t(
    "Write the set with inequalities, such as $-2 < x \\le 5$ or $x < 1 \\text{ or } x \\ge 3$.",
    "请用不等式写出这个集合，例如 $-2 < x \\le 5$ 或 $x < 1 \\text{ or } x \\ge 3$。",
  ),
  equation: t("Write an equation.", "请写出一个方程。"),
  slopeIntercept: t("Write the equation in slope-intercept form, $y = mx + b$.", "请把方程写成斜截式 $y = mx + b$。"),
  standard: t(
    "Write the equation in standard form, $Ax + By = C$, with integers $A$, $B$ and $C$ that have no common factor and $A > 0$.",
    "请把方程写成一般式 $Ax + By = C$，其中 $A$、$B$、$C$ 是没有公因数的整数，且 $A > 0$。",
  ),
  pointSlope: t("Write the equation in point-slope form, $y - y_1 = m(x - x_1)$.", "请把方程写成点斜式 $y - y_1 = m(x - x_1)$。"),
  factorCompletely: t("Factor completely.", "请彻底分解因式。"),
  commonFactor: t("Factor out the greatest common factor of the coefficients.", "请提出各项系数的最大公因数。"),
  point: t("Write the ordered pair, such as $(3, -2)$.", "请写出有序数对，例如 $(3, -2)$。"),
  solutions: t(
    "List the solutions separated by commas, such as $x = 2, x = -5$, or enter $\\varnothing$ if there are none.",
    "请用逗号分隔列出所有解，例如 $x = 2, x = -5$；如果无解，请输入 $\\varnothing$。",
  ),
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
 * simplest form (see isSimplifiedPolynomial); with "radical", an expression in
 * simplest radical form (see isSimplifiedRadical). With expected.positive,
 * the variables are taken to be positive, so that \sqrt{x^{2}} equals x.
 */
export const expressionChecker: Checker = {
  id: "expression",
  check(expected, response) {
    const e = obj(expected);
    const target = parseExpression(str(e, "expr"));
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.expression);
    if (!equivalent(parsed, target, e.positive === true)) return wrong();
    if (e.form === "simplified" && !isSimplifiedPolynomial(parsed)) return wrong(feedback.simplify);
    if (e.form === "radical" && !isSimplifiedRadical(parsed)) return wrong(feedback.radicalForm);
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

const emptySet = new Set([
  "\\emptyset",
  "\\varnothing",
  "∅",
  "\\{\\}",
  "{}",
  "nosolution",
  "nosolutions",
  "norealsolution",
  "norealsolutions",
  "none",
  "无解",
  "没有解",
  "无实数解",
]);

/** isEmptySet recognizes ∅ and "no solution" in the forms a learner may type. */
export function isEmptySet(response: string): boolean {
  const s = normalizeLatex(response)
    .replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\left|\\right|\s|~/g, "")
    .toLowerCase();
  return emptySet.has(s);
}

/** splitTopLevel splits s at the given separator outside parentheses, brackets and braces. */
export function splitTopLevel(s: string, separator: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (c === "\\" && (s[i + 1] === "{" || s[i + 1] === "}")) {
      i++;
      continue;
    }
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    else if (depth === 0 && s.startsWith(separator, i)) {
      out.push(s.slice(start, i));
      start = i + separator.length;
      i += separator.length - 1;
    }
  }
  out.push(s.slice(start));
  return out;
}

/** expandPlusMinus expands each ± (or ∓) into its two cases: "3 \pm \sqrt{2}" gives "3 + \sqrt{2}" and "3 - \sqrt{2}". */
export function expandPlusMinus(s: string): string[] {
  const m = /\\pm(?![a-zA-Z])|±|\\mp(?![a-zA-Z])|∓/.exec(s);
  if (!m) return [s];
  const minusFirst = m[0].includes("mp") || m[0] === "∓";
  const before = s.slice(0, m.index);
  const after = s.slice(m.index + m[0].length);
  return [`${before}${minusFirst ? "-" : "+"}${after}`, `${before}${minusFirst ? "+" : "-"}${after}`].flatMap(expandPlusMinus);
}

/** listItems splits a list of answers at commas, semicolons and "or", after removing set braces. */
function listItems(response: string): string[] {
  const s = normalizeLatex(response)
    .replace(/\\(?:text|mathrm|operatorname)\{\s*(?:or|and|或|和|与)\s*\}/g, ",")
    .replace(/\\(?:lor|vee)(?![a-zA-Z])/g, ",")
    .replace(/;/g, ",")
    .replace(/^\\left\\\{|\\right\\\}$/g, "")
    .replace(/^\\\{|\\\}$/g, "");
  return splitTopLevel(s, ",")
    .map((p) => p.trim())
    .filter((p) => p !== "");
}

/** simplestSurd tells whether a number is written in simplest form: a reduced number literal for a rational, square-free integer radicands and integer denominators with no common factor otherwise. */
function simplestSurd(node: Node, value: Surd): boolean {
  if (value.m === 1n) {
    const lit = numberLiteral(node);
    return lit?.reduced === true;
  }
  const ok = (n: Node): boolean => {
    switch (n.k) {
      case "num":
      case "var":
        return true;
      case "sqrt": {
        const r = integerLiteral(n.a);
        return r !== undefined && r > 1n && isSquareFree(Number(r));
      }
      case "div": {
        const top = surdValue(n.a);
        const bottom = integerLiteral(n.b);
        if (!top || bottom === undefined || bottom < 2n) return false;
        const parts = [top.a, top.b];
        if (!parts.every((p) => p.isInteger())) return false;
        const g = parts.reduce((acc, p) => gcdBig(acc, p.n < 0n ? -p.n : p.n), bottom);
        return g === 1n && ok(n.a);
      }
      case "pow":
        return false;
      default:
        return "b" in n ? ok(n.a) && ok(n.b) : ok(n.a);
    }
  };
  return ok(node);
}

function gcdBig(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

/**
 * solutionsChecker accepts the solution set of an equation: expected.values
 * lists the solutions in LaTeX (rationals or numbers such as
 * \frac{3 + \sqrt{5}}{2}), empty when there are none, and expected.var names
 * the variable. The response lists the solutions in any order, separated by
 * commas, semicolons or "or", each alone or as "x = …", with ± allowed:
 * "x = 3, x = -2", "-2, 3", "x = \pm 3", "\frac{3 \pm \sqrt{5}}{2}". No
 * solution is ∅, \varnothing or "no solution". Each number must be in simplest
 * form.
 */
export const solutionsChecker: Checker = {
  id: "solutions",
  check(expected, response) {
    const e = obj(expected);
    const variable = typeof e.var === "string" ? e.var : "x";
    const raw = e.values;
    if (!Array.isArray(raw) || !raw.every((v) => typeof v === "string")) throw new TypeError("expected.values must be an array of strings");
    const values = (raw as string[]).map((v) => {
      const s = surdValue(parseExpression(v));
      if (!s) throw new TypeError(`expected value is not an exact number: ${v}`);
      return s;
    });
    if (isEmptySet(response)) return values.length === 0 ? { correct: true } : wrong();
    const items = listItems(response);
    if (items.length === 0) return wrong(feedback.unreadable);
    const found: Surd[] = [];
    let unsimplified: Text | undefined;
    for (const item of items.flatMap(expandPlusMinus)) {
      const parsed = parse(() => parseLatex(item));
      if (isVerdict(parsed)) return parsed;
      let node: Node;
      if (isRelation(parsed)) {
        const l = unwrap(parsed.left);
        if (parsed.op !== "=" || l.k !== "var" || l.name !== variable) return wrong(feedback.solutions);
        node = parsed.right;
      } else node = parsed;
      const v = surdValue(node);
      if (!v) return wrong(feedback.solutions);
      if (!simplestSurd(unwrap(node), v))
        unsimplified ??= v.m === 1n ? (numberLiteral(node) ? feedback.lowestTerms : feedback.singleNumber) : feedback.radical;
      if (!found.some((f) => surdEqual(f, v))) found.push(v);
    }
    const same = found.length === values.length && found.every((f) => values.some((v) => surdEqual(f, v)));
    if (!same) return wrong();
    return unsimplified ? wrong(unsimplified) : { correct: true };
  },
};

function tryParseSet(f: () => ParsedSet): ParsedSet | undefined {
  try {
    return f();
  } catch (e) {
    if (e instanceof ParseError) return undefined;
    throw e;
  }
}

/**
 * intervalChecker accepts a set of real numbers equal to expected.set, which
 * is written in interval notation. With expected.form "interval" the response
 * must be in interval notation ("(-2, 5]", "(-\\infty, 1) \\cup [3, \\infty)",
 * \\mathbb{R}, \\varnothing); with "inequality", inequalities in expected.var
 * ("-2 < x \\le 5", "x < 1 \\text{ or } x \\ge 3"); without a form, either.
 * Endpoints must be numbers in simplest form.
 */
export const intervalChecker: Checker = {
  id: "interval",
  check(expected, response) {
    const e = obj(expected);
    const target = parseIntervals(str(e, "set")).set;
    const variable = typeof e.var === "string" ? e.var : "x";
    const asInterval = e.form === "inequality" ? undefined : tryParseSet(() => parseIntervals(response));
    const asInequality = e.form === "interval" ? undefined : tryParseSet(() => parseInequalities(response, variable));
    const got = asInterval ?? asInequality;
    if (!got) {
      const other =
        e.form === "interval"
          ? tryParseSet(() => parseInequalities(response, variable))
          : e.form === "inequality"
            ? tryParseSet(() => parseIntervals(response))
            : undefined;
      if (other) return wrong(e.form === "interval" ? feedback.interval : feedback.inequalities);
      return wrong(feedback.unreadable);
    }
    if (!setEqual(got.set, target)) return wrong();
    return got.reduced ? { correct: true } : wrong(feedback.lowestTerms);
  },
};

/**
 * pointChecker accepts an ordered pair (or tuple) of numbers equal to
 * expected.values, written "(3, -2)", or, when expected.vars names the
 * coordinates, as "x = 3, y = -2" in any order. Each number must be written
 * as in numberChecker's default form.
 */
export const pointChecker: Checker = {
  id: "point",
  check(expected, response) {
    const e = obj(expected);
    const values = e.values;
    if (!Array.isArray(values) || !values.every((v) => typeof v === "string"))
      throw new TypeError("expected.values must be an array of strings");
    const target = (values as string[]).map((v) => Q.parse(v));
    const vars = Array.isArray(e.vars) ? (e.vars as string[]) : undefined;
    const s = normalizeLatex(response)
      .replace(/\\left|\\right/g, "")
      .trim();
    let parts: string[];
    if (s.startsWith("(") && s.endsWith(")") && splitTopLevel(s, ",").length === 1) {
      parts = splitTopLevel(s.slice(1, -1), ",").map((p) => p.trim());
    } else if (vars) {
      const byVar = new Map<string, string>();
      for (const item of listItems(response)) {
        const m = /^([a-zA-Z])\s*=(.*)$/.exec(item);
        if (!m || !vars.includes(m[1]!) || byVar.has(m[1]!)) return wrong(feedback.point);
        byVar.set(m[1]!, m[2]!);
      }
      if (byVar.size !== vars.length) return wrong(feedback.point);
      parts = vars.map((v) => byVar.get(v)!);
    } else return wrong(feedback.point);
    if (parts.length !== target.length) return wrong(feedback.point);
    let verdict: Verdict = { correct: true };
    for (const [i, part] of parts.entries()) {
      const parsed = parse(() => parseLatex(part));
      if (isVerdict(parsed)) return parsed;
      if (isRelation(parsed)) return wrong(feedback.point);
      const v = judgeLiteral(numberLiteral(parsed), parsed, target[i]!, "number");
      if (!v.correct && !v.feedback) return v;
      if (!v.correct && verdict.correct) verdict = v;
    }
    return verdict;
  },
};

/** proportional tells whether two polynomials are nonzero multiples of each other. */
function proportional(a: Poly, b: Poly): boolean {
  if (a.size === 0 || a.size !== b.size) return false;
  const [k, c] = [...a][0]!;
  const o = b.get(k);
  if (!o) return false;
  const ratio = o.div(c);
  return [...a].every(([key, v]) => b.get(key)?.eq(v.mul(ratio)) === true);
}

const isVar = (n: Node, name: string) => {
  const u = unwrap(n);
  return u.k === "var" && u.name === name;
};

/** onlyKeys tells whether a polynomial has terms only in the given monomials. */
const onlyKeys = (p: Poly, keys: readonly string[]) => [...p.keys()].every((k) => keys.includes(k));

/** isSlopeIntercept recognizes y = mx + b with the right side simplified, or the sides swapped. */
function isSlopeIntercept(left: Node, right: Node, x: string, y: string): boolean {
  const side = isVar(left, y) ? right : isVar(right, y) ? left : undefined;
  const p = side && toPoly(side);
  return !!side && !!p && onlyKeys(p, [x, ""]) && isSimplifiedPolynomial(side);
}

/** isStandard recognizes Ax + By = C with integer A, B, C without a common factor, and A > 0 (or A = 0 and B > 0). */
function isStandard(left: Node, right: Node, x: string, y: string): boolean {
  const l = toPoly(left);
  const lit = numberLiteral(right);
  if (!l || !lit || lit.kind !== "integer" || !onlyKeys(l, [x, y]) || !isSimplifiedPolynomial(left)) return false;
  const a = l.get(x) ?? Q.zero;
  const b = l.get(y) ?? Q.zero;
  if (!a.isInteger() || !b.isInteger() || (a.isZero() && b.isZero())) return false;
  if (a.sign() < 0 || (a.isZero() && b.sign() < 0)) return false;
  let g = 0n;
  for (const v of [a.n, b.n, lit.value.n]) {
    let [m, n] = [g, v < 0n ? -v : v];
    while (n !== 0n) [m, n] = [n, m % n];
    g = m;
  }
  return g === 1n;
}

/** isPointSlope recognizes y − k = m(x − h): the left side y or y ± k, the right side m(x ± h), (x ± h) or −(x ± h). */
function isPointSlope(left: Node, right: Node, x: string, y: string): boolean {
  const shifted = (n: Node, v: string) => {
    const u = unwrap(n);
    if (isVar(u, v)) return true;
    return (u.k === "add" || u.k === "sub") && isVar(u.a, v) && numberLiteral(u.b) !== undefined;
  };
  if (!shifted(left, y)) return false;
  const r = right;
  const group = (n: Node) => n.k === "group" && shifted(n.a, x);
  if (group(r)) return true;
  if (r.k === "neg") return group(r.a) || (r.a.k === "mul" && numberLiteral(r.a.a) !== undefined && group(r.a.b));
  return r.k === "mul" && numberLiteral(r.a) !== undefined && group(r.b);
}

/**
 * equationChecker accepts an equation equivalent to expected.eq, a polynomial
 * equation such as "y = 2x + 3": the difference of the two sides must be a
 * nonzero multiple of that of expected.eq. expected.form may require the form
 * of a line in expected.vars (x and y by default): "slope-intercept"
 * (y = mx + b), "standard" (Ax + By = C, integers without a common factor,
 * A > 0) or "point-slope" (y − k = m(x − h)).
 */
export const equationChecker: Checker = {
  id: "equation",
  check(expected, response) {
    const e = obj(expected);
    const target = parseLatex(str(e, "eq"));
    if (!isRelation(target) || target.op !== "=") throw new TypeError("expected.eq must be an equation");
    const tp = toPoly({ k: "sub", a: target.left, b: target.right });
    if (!tp) throw new TypeError("expected.eq must be a polynomial equation");
    const [x, y] = Array.isArray(e.vars) ? (e.vars as string[]) : ["x", "y"];
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (!isRelation(parsed) || parsed.op !== "=") return wrong(feedback.equation);
    const rp = toPoly({ k: "sub", a: parsed.left, b: parsed.right });
    if (!rp || !proportional(rp, tp)) return wrong();
    const [l, r] = [parsed.left, parsed.right];
    if (e.form === "slope-intercept" && !isSlopeIntercept(l, r, x!, y!)) return wrong(feedback.slopeIntercept);
    if (e.form === "standard" && !isStandard(l, r, x!, y!)) return wrong(feedback.standard);
    if (e.form === "point-slope" && !isPointSlope(l, r, x!, y!)) return wrong(feedback.pointSlope);
    return { correct: true };
  },
};

/** Factored is an expression read as a product: a constant times nonconstant polynomial factors, repeated for powers. */
interface Factored {
  readonly constant: Q;
  readonly factors: readonly Poly[];
}

/** factoredForm reads an expression as a product of factors; a sum is one factor. It returns undefined for an expression that is not a polynomial. */
export function factoredForm(node: Node): Factored | undefined {
  const n = unwrap(node);
  if (n.k === "neg") {
    const f = factoredForm(n.a);
    return f && { ...f, constant: f.constant.neg() };
  }
  if (n.k === "mul") {
    const a = factoredForm(n.a);
    const b = factoredForm(n.b);
    return a && b && { constant: a.constant.mul(b.constant), factors: [...a.factors, ...b.factors] };
  }
  if (n.k === "pow") {
    const e = integerLiteral(n.b);
    const base = factoredForm(n.a);
    if (e !== undefined && e >= 1n && e <= 16n && base) {
      const factors: Poly[] = [];
      for (let i = 0n; i < e; i++) factors.push(...base.factors);
      return { constant: base.constant.pow(Number(e)), factors };
    }
  }
  const p = toPoly(n);
  if (!p) return undefined;
  if ([...p.keys()].every((k) => k === "")) return { constant: p.get("") ?? Q.zero, factors: [] };
  return { constant: Q.one, factors: [p] };
}

/** isPrimitive tells whether a polynomial has integer coefficients with no common factor. */
function isPrimitive(p: Poly): boolean {
  let g = 0n;
  for (const c of p.values()) {
    if (!c.isInteger()) return false;
    g = gcdBig(g, c.n < 0n ? -c.n : c.n);
  }
  return g === 1n;
}

/**
 * factoredChecker accepts a complete factorization of expected.expr, which is
 * written fully factored over the integers: the response must be equivalent,
 * with as many nonconstant factors (counted with multiplicity) as
 * expected.expr, each with integer coefficients that have no common factor,
 * times an integer. "2(x + 1)(x - 3)" is accepted for 2x² − 4x − 6, while
 * "(2x + 2)(x - 3)" and "2(x² − 2x − 3)" are rejected with feedback.
 */
export const factoredChecker: Checker = {
  id: "factored",
  check(expected, response) {
    const target = parseExpression(str(obj(expected), "expr"));
    const want = factoredForm(target);
    if (!want) throw new TypeError("expected.expr must be a polynomial");
    const parsed = parse(() => parseLatex(response));
    if (isVerdict(parsed)) return parsed;
    if (isRelation(parsed)) return wrong(feedback.expression);
    if (!equivalent(parsed, target)) return wrong();
    const got = factoredForm(parsed);
    if (!got || got.factors.length < want.factors.length) return wrong(feedback.factorCompletely);
    if (!got.factors.every(isPrimitive) || !got.constant.isInteger()) return wrong(feedback.commonFactor);
    return got.factors.length === want.factors.length ? { correct: true } : wrong(feedback.factorCompletely);
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
  solutionsChecker,
  intervalChecker,
  pointChecker,
  equationChecker,
  factoredChecker,
];
