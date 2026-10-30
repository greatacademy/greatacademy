import { type Poly, toPoly } from "./algebra.ts";
import type { Node } from "./latex.ts";
import { Q } from "./rational.ts";

/** NumberLiteral describes an answer written as a single number. */
export interface NumberLiteral {
  readonly value: Q;
  readonly kind: "integer" | "decimal" | "fraction" | "mixed";
  /** reduced is false for a fraction not in lowest terms or with denominator 1, or a mixed number with an improper fraction part. */
  readonly reduced: boolean;
}

function natural(node: Node): bigint | undefined {
  return node.k === "num" && !node.decimal && node.v.isInteger() ? node.v.n : undefined;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

/**
 * numberLiteral recognizes a single signed number: an integer ("-12"), a
 * decimal ("3.5"), a fraction ("\frac{3}{4}", "-\frac{3}{4}", "\frac{-3}{4}",
 * "3/4") or a mixed number ("2\frac{1}{3}"). Anything else, including
 * arithmetic such as "3+4", is not a literal.
 */
export function numberLiteral(node: Node): NumberLiteral | undefined {
  let sign = 1n;
  let inner = node;
  while (inner.k === "group") inner = inner.a;
  if (inner.k === "neg" || inner.k === "pos") {
    if (inner.k === "neg") sign = -1n;
    inner = inner.a;
  }
  if (inner.k === "num") {
    const v = sign < 0n ? inner.v.neg() : inner.v;
    return { value: v, kind: inner.decimal ? "decimal" : "integer", reduced: true };
  }
  if (inner.k === "div") {
    let numNode = inner.a;
    let s = sign;
    if (numNode.k === "neg" && sign > 0n) {
      s = -1n;
      numNode = numNode.a;
    }
    const n = natural(numNode);
    const d = natural(inner.b);
    if (n === undefined || d === undefined || d === 0n) return undefined;
    return { value: Q.of(s * n, d), kind: "fraction", reduced: d > 1n && gcd(n, d) === 1n };
  }
  if (inner.k === "mul" && inner.implicit && inner.b.k === "div" && inner.b.frac) {
    let whole = inner.a;
    if (whole.k === "neg" && sign > 0n) {
      sign = -1n;
      whole = whole.a;
    }
    const w = natural(whole);
    const n = natural(inner.b.a);
    const d = natural(inner.b.b);
    if (w === undefined || n === undefined || d === undefined || d === 0n || w === 0n) return undefined;
    const value = Q.of(w * d + n, d);
    return { value: sign < 0n ? value.neg() : value, kind: "mixed", reduced: n > 0n && n < d && gcd(n, d) === 1n };
  }
  return undefined;
}

/** Monomial is a term of a simplified polynomial: a coefficient times variables raised to powers. */
interface Monomial {
  readonly key: string;
  readonly coefficient: Q;
}

function factors(node: Node, out: Node[]): Node[] {
  if (node.k === "mul") {
    factors(node.a, out);
    factors(node.b, out);
  } else out.push(node);
  return out;
}

/**
 * monomialOf recognizes a term written in simplest form: "7", "-\frac{2}{3}",
 * "x", "3xy^{2}", "\frac{x}{2}", "\frac{3x}{4}". With quotients, a term may
 * also have a denominator with variables, sharing no variable and no number
 * factor with the numerator: "\frac{8x^{6}}{27y^{3}}", "\frac{1}{x^{2}}".
 * With radicals (which implies quotients), a term may also have one root in
 * simplest form and absolute values as factors: "2x\sqrt{3y}",
 * "\frac{\sqrt{x}}{x}", "4|x|".
 */
function monomialOf(node: Node, radicals = false, quotients = radicals): Monomial | undefined {
  const d = node.k === "div" && node.frac ? natural(node.b) : undefined;
  if (node.k === "div" && node.frac && (node.a.k !== "num" || (quotients && d === undefined))) {
    const top = monomialOf(node.a, radicals);
    if (!top?.coefficient.isInteger() || top.coefficient.isZero()) return undefined;
    if (d !== undefined) {
      if (top.key === "" || d < 2n || gcd(top.coefficient.n, d) !== 1n) return undefined;
      return { key: top.key, coefficient: top.coefficient.div(Q.of(d)) };
    }
    const bottom = quotients ? monomialOf(node.b) : undefined;
    if (!bottom || bottom.key === "" || !bottom.coefficient.isInteger() || bottom.coefficient.sign() < 0) return undefined;
    if (gcd(top.coefficient.n, bottom.coefficient.n) !== 1n) return undefined;
    const names = (key: string) => key.split("*").map((f) => f.split("^")[0]!);
    if (names(top.key).some((v) => /^(?:[a-zA-Z]|\\pi)$/.test(v) && names(bottom.key).includes(v))) return undefined;
    return { key: `${top.key}/${bottom.key}`, coefficient: top.coefficient.div(bottom.coefficient) };
  }
  const fs = factors(node, []);
  let coefficient = Q.one;
  let explicitCoefficient = false;
  const powers = new Map<string, number>();
  for (const [i, f] of fs.entries()) {
    const lit = f.k === "num" || f.k === "div" || f.k === "neg" ? numberLiteral(f) : undefined;
    if (lit) {
      if (i !== 0 || !lit.reduced || lit.kind === "mixed") return undefined;
      coefficient = lit.value;
      explicitCoefficient = true;
      continue;
    }
    let name: string;
    let e = 1;
    if (radicals && (f.k === "sqrt" || f.k === "root" || f.k === "abs")) {
      const inner = f.k === "abs" ? absKey(f.a) : rootKey(f.a, f.k === "root" ? f.n : 2);
      if (inner === undefined) return undefined;
      name = `${f.k}(${inner})`;
      if (f.k !== "abs" && [...powers.keys()].some((k) => !k.startsWith("abs(") && k.includes("("))) return undefined;
    } else if (f.k === "var") name = f.name;
    else if (f.k === "pow" && f.a.k === "var") {
      const n = natural(f.b);
      if (n === undefined || n < 2n) return undefined;
      name = f.a.name;
      e = Number(n);
    } else return undefined;
    if (powers.has(name)) return undefined;
    powers.set(name, e);
  }
  if (explicitCoefficient && powers.size > 0 && coefficient.eq(Q.one)) return undefined;
  const key = [...powers]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([v, e]) => (e === 1 ? v : `${v}^${e}`))
    .join("*");
  return { key, coefficient };
}

/** rootKey describes a radicand in simplest form for a root of index n: a monomial with an integer coefficient free of nth powers and every exponent below n, or a polynomial with integer coefficients that has more than one term and no perfect nth-power factor; it returns undefined otherwise. */
function rootKey(radicand: Node, n: number): string | undefined {
  const m = monomialOf(unwrapGroup(radicand));
  if (m) {
    const c = m.coefficient;
    if (!c.isInteger() || c.sign() <= 0 || (c.eq(Q.one) && m.key === "")) return undefined;
    for (let p = 2n; p ** BigInt(n) <= c.n; p++) if (c.n % p ** BigInt(n) === 0n) return undefined;
    if (m.key.split("*").some((v) => Number(v.split("^")[1] ?? 1) >= n)) return undefined;
    return `${n}:${c.n}*${m.key}`;
  }
  const u = unwrapGroup(radicand);
  if (!isSimplifiedPolynomial(u) || hasFraction(u)) return undefined;
  const p = toPoly(u);
  return p && !hasPowerFactor(p, n) ? `${n}:${nodeKey(u)}` : undefined;
}

/**
 * absKey describes the contents of an absolute value, which must be a
 * simplified polynomial with integer coefficients and no common number factor,
 * and not a negated monomial: |-6x| is 6|x| and |2x+4| is 2|x+2|.
 */
function absKey(inner: Node): string | undefined {
  const u = unwrapGroup(inner);
  if (!isSimplifiedPolynomial(u) || hasFraction(u)) return undefined;
  const p = toPoly(u);
  if (!p || integerContent(p) !== 1n) return undefined;
  if (p.size === 1 && [...p.values()][0]!.sign() < 0) return undefined;
  return nodeKey(u);
}

const nodeKey = (n: Node) => JSON.stringify(n, (_, v) => (typeof v === "bigint" ? String(v) : v));

const unwrapGroup = (n: Node): Node => (n.k === "group" ? unwrapGroup(n.a) : n);

function hasFraction(n: Node): boolean {
  if (n.k === "div") return true;
  if (n.k === "num") return !n.v.isInteger();
  return "a" in n && (hasFraction(n.a) || ("b" in n && hasFraction(n.b)));
}

/** leadingNeg removes the sign of a term written with a leading minus: "-x" and "-xy", which parses as (−x)·y; it returns undefined for a term without one. */
function leadingNeg(node: Node): Node | undefined {
  if (node.k === "neg") return node.a;
  if (node.k !== "mul") return undefined;
  const a = leadingNeg(node.a);
  return a && { ...node, a };
}

/**
 * isSimplifiedPolynomial tells whether node is a sum of monomials in simplest
 * form with no two like terms, no zero terms, no parentheses, and no doubled
 * signs such as "x + -3". The order of the terms does not matter.
 */
export function isSimplifiedPolynomial(node: Node): boolean {
  return isSimplifiedSum(node, false);
}

/**
 * isSimplifiedExpression tells whether node is a sum of terms as in
 * isSimplifiedPolynomial, where a term may also have a denominator that is a
 * monomial with no variable and no number factor in common with its
 * numerator, as in \frac{8x^{6}}{27y^{3}} or 3x+\frac{1}{x}.
 */
export function isSimplifiedExpression(node: Node): boolean {
  return sumTerms(node, false, true) !== undefined;
}

/**
 * isSimplifiedRadical tells whether node is in simplest radical form: a sum
 * of terms as in isSimplifiedPolynomial, where a term may also have one root
 * whose radicand has no perfect nth-power factor, no fraction and no root
 * (\sqrt{12x^{3}} becomes 2x\sqrt{3x}), absolute values, and a denominator
 * that is a monomial with no root, with no two terms alike. A polynomial
 * radicand must have no perfect nth-power factor (\sqrt{x^{2}-6x+9} is
 * |x-3|). A sum with integer coefficients may stand over a number that
 * shares no factor with all of them, as in \frac{3+\sqrt{5}}{2}.
 */
export function isSimplifiedRadical(node: Node): boolean {
  let n = unwrapGroup(node);
  if (n.k === "neg") n = unwrapGroup(n.a);
  // A sum over a number, such as \frac{3+\sqrt{5}}{2}, with no factor common to the denominator and every coefficient.
  if (n.k === "div" && n.frac && (n.a.k === "add" || n.a.k === "sub")) {
    const d = natural(n.b);
    const terms = d !== undefined && d >= 2n ? sumTerms(n.a, true) : undefined;
    if (!terms?.every((m) => m.coefficient.isInteger())) return false;
    return terms.reduce((g, m) => gcd(g, m.coefficient.n), d!) === 1n;
  }
  return isSimplifiedSum(node, true);
}

function isSimplifiedSum(node: Node, radicals: boolean): boolean {
  return sumTerms(node, radicals) !== undefined;
}

/** sumTerms lists the terms of a sum in simplest form, as in isSimplifiedSum, or returns undefined when it is not one. */
function sumTerms(node: Node, radicals: boolean, quotients = radicals): Monomial[] | undefined {
  const termOf = (n: Node) => monomialOf(n, radicals, quotients);
  const terms: Monomial[] = [];
  const collect = (n: Node, first: boolean): boolean => {
    if (n.k === "add" || n.k === "sub") {
      if (!collect(n.a, first)) return false;
      const m = termOf(n.b);
      if (!m || m.coefficient.sign() < 0) return false;
      terms.push(n.k === "sub" ? { ...m, coefficient: m.coefficient.neg() } : m);
      return true;
    }
    const negated = first ? leadingNeg(n) : undefined;
    if (negated) {
      const m = termOf(negated);
      if (!m) return false;
      terms.push({ ...m, coefficient: m.coefficient.neg() });
      return true;
    }
    const m = termOf(n);
    if (!m) return false;
    terms.push(m);
    return true;
  };
  if (!collect(node, true)) return undefined;
  if (terms.length === 1) return terms;
  const keys = new Set(terms.map((m) => m.key));
  return keys.size === terms.length && terms.every((m) => !m.coefficient.isZero()) ? terms : undefined;
}

/** coefficients lists the coefficients of a polynomial in one variable from the constant term up, or returns undefined for a polynomial in several variables. */
function coefficients(p: Poly, v: string): Q[] | undefined {
  const out: Q[] = [];
  for (const [key, c] of p) {
    const m = key === "" ? ["", "0"] : /^([^*^]+)(?:\^(\d+))?$/.exec(key);
    if (!m || (key !== "" && m[1] !== v)) return undefined;
    const e = key === "" ? 0 : Number(m[2] ?? 1);
    while (out.length <= e) out.push(Q.zero);
    out[e] = c;
  }
  return out;
}

/** polyGcd is the greatest common divisor of two polynomials in one variable, coefficients from the constant term up (Euclid's algorithm over the rationals); the gcd of zero and zero is empty. */
function polyGcd(a: Q[], b: Q[]): Q[] {
  const trim = (p: Q[]) => {
    const q = [...p];
    while (q.length > 0 && q[q.length - 1]!.isZero()) q.pop();
    return q;
  };
  let [x, y] = [trim(a), trim(b)];
  while (y.length > 0) {
    const r = [...x];
    while (r.length >= y.length && r.length > 0) {
      const f = r[r.length - 1]!.div(y[y.length - 1]!);
      const shift = r.length - y.length;
      for (let i = 0; i < y.length; i++) r[i + shift] = r[i + shift]!.sub(f.mul(y[i]!));
      r.pop();
      while (r.length > 0 && r[r.length - 1]!.isZero()) r.pop();
    }
    [x, y] = [y, r];
  }
  return x;
}

const derivative = (p: Q[]) => p.slice(1).map((c, i) => c.mul(Q.of(i + 1)));

/**
 * hasPowerFactor tells whether a polynomial with integer coefficients has a
 * factor that is a perfect nth power: a number, a power of a variable, or in
 * one variable a polynomial factor repeated n times, found as a common factor
 * of the polynomial and its first n − 1 derivatives (x^{2}-6x+9 = (x-3)^{2}).
 */
function hasPowerFactor(p: Poly, n: number): boolean {
  const content = integerContent(p);
  if (content === undefined) return false;
  for (let q = 2n; q ** BigInt(n) <= content; q++) if (content % q ** BigInt(n) === 0n) return true;
  const vars = new Set([...p.keys()].flatMap((k) => (k === "" ? [] : k.split("*").map((f) => f.split("^")[0]!))));
  for (const v of vars) if (Math.min(...[...p.keys()].map((k) => power(k, v))) >= n) return true;
  if (vars.size !== 1) return false;
  const [v] = vars;
  let d = coefficients(p, v!);
  if (!d) return false;
  let g = d;
  for (let i = 1; i < n && g.length > 1; i++) {
    d = derivative(d);
    g = polyGcd(g, d);
  }
  return g.length > 1;
}

/**
 * isSimplifiedProduct tells whether node is a simplified polynomial, such as
 * x^{2}-1, or a product of at most one number (first), powers of distinct
 * variables, and simplified sums in parentheses and their powers, such as
 * 3x(x-1)^{2}(x+2). A product of numbers (2 \cdot 3x) or a power of a
 * product ((2x^{2})^{3}) is not simplified.
 */
function isSimplifiedProduct(node: Node): boolean {
  const u = unwrapGroup(node);
  const fs = factors(u, []);
  if (fs.length === 1 && isSimplifiedPolynomial(u)) return true;
  const seen = new Set<string>();
  return fs.every((factor, i) => {
    let f = factor;
    if (i === 0 && f.k === "neg" && f.a.k !== "num") f = f.a;
    if (f.k === "num" || f.k === "div" || f.k === "neg") {
      const lit = numberLiteral(f);
      return i === 0 && lit !== undefined && lit.reduced && lit.kind !== "mixed";
    }
    const base = f.k === "pow" && (natural(f.b) ?? 0n) >= 2n ? f.a : f;
    if (base.k === "var") {
      if (seen.has(base.name)) return false;
      seen.add(base.name);
      return true;
    }
    return base.k === "group" && (base.a.k === "add" || base.a.k === "sub") && isSimplifiedPolynomial(base.a);
  });
}

/** power is the exponent of variable v in a monomial key such as "x^2*y". */
function power(key: string, v: string): number {
  for (const f of key.split("*")) {
    const [name, e] = f.split("^");
    if (name === v) return Number(e ?? 1);
  }
  return 0;
}

function integerContent(p: Poly): bigint | undefined {
  let g = 0n;
  for (const c of p.values()) {
    if (!c.isInteger()) return undefined;
    g = gcd(g, c.n);
  }
  return g;
}

/**
 * isLowestTerms tells whether node is a rational expression in lowest terms:
 * a polynomial, or one fraction (possibly negated) of two polynomials, each
 * written expanded or as a product of simplified factors, with integer coefficients and no common
 * factor, such as \frac{x+1}{x-2} or -\frac{2}{3(x-1)}. In several variables
 * only common numbers and common monomial factors are detected.
 */
export function isLowestTerms(node: Node): boolean {
  let n = unwrapGroup(node);
  if (n.k === "neg") n = unwrapGroup(n.a);
  if (n.k !== "div") return isSimplifiedProduct(n);
  if (!isSimplifiedProduct(n.a) || !isSimplifiedProduct(n.b)) return false;
  const top = toPoly(n.a);
  const bottom = toPoly(n.b);
  if (!top || !bottom || top.size === 0 || bottom.size === 0) return false;
  const [ct, cb] = [integerContent(top), integerContent(bottom)];
  if (ct === undefined || cb === undefined || gcd(ct, cb) !== 1n) return false;
  if (bottom.size === 1 && bottom.has("")) return !bottom.get("")!.abs().eq(Q.one);
  const vars = new Set([...top.keys(), ...bottom.keys()].flatMap((k) => (k === "" ? [] : k.split("*").map((f) => f.split("^")[0]!))));
  const minPower = (p: Poly, v: string) => Math.min(...[...p.keys()].map((k) => power(k, v)));
  for (const v of vars) if (minPower(top, v) > 0 && minPower(bottom, v) > 0) return false;
  if (vars.size === 1) {
    const [v] = vars;
    const a = coefficients(top, v!);
    const b = coefficients(bottom, v!);
    if (a && b && polyGcd(a, b).length > 1) return false;
  }
  return true;
}

/**
 * isVertexForm tells whether node is a quadratic in vertex form,
 * a(x-h)^{2}+k, with a single squared binomial: a, h and k are numbers in
 * simplest form, a is omitted when it is 1 (and written - when it is -1), the
 * binomial is x-h or x+h with h ≠ 0, or x alone when h is 0, and k is omitted
 * when it is 0: 2(x-3)^{2}+1, -(x+1)^{2}-4, (x-5)^{2}, \frac{1}{2}x^{2}-3.
 */
export function isVertexForm(node: Node): boolean {
  const positiveLiteral = (n: Node) => {
    if (n.k !== "num" && n.k !== "div") return false;
    const lit = numberLiteral(n);
    return !!lit?.reduced && lit.kind !== "mixed" && lit.value.sign() > 0;
  };
  let square = node;
  if (node.k === "add" || node.k === "sub") {
    if (!positiveLiteral(node.b)) return false;
    square = node.a;
  }
  let negated = false;
  if (square.k === "neg") {
    negated = true;
    square = square.a;
  }
  if (square.k === "mul") {
    let a = square.a;
    if (a.k === "neg" && !negated) a = a.a;
    if (!positiveLiteral(a) || numberLiteral(a)!.value.eq(Q.one)) return false;
    square = square.b;
  }
  if (square.k !== "pow" || natural(square.b) !== 2n) return false;
  const base = square.a;
  if (base.k === "var") return true;
  if (base.k !== "group" || (base.a.k !== "add" && base.a.k !== "sub")) return false;
  return base.a.a.k === "var" && positiveLiteral(base.a.b);
}
