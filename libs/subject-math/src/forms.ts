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
 * "x", "3xy^{2}", "\frac{x}{2}", "\frac{3x}{4}". With radicals, a term may
 * also have one root in simplest form and absolute values as factors, and a
 * denominator with variables: "2x\sqrt{3y}", "\frac{\sqrt{x}}{x}", "4|x|".
 */
function monomialOf(node: Node, radicals = false): Monomial | undefined {
  if (node.k === "div" && node.frac && node.a.k !== "num") {
    const top = monomialOf(node.a, radicals);
    if (!top?.coefficient.isInteger() || top.key === "") return undefined;
    const d = natural(node.b);
    if (d !== undefined) {
      if (d < 2n || gcd(top.coefficient.n, d) !== 1n) return undefined;
      return { key: top.key, coefficient: top.coefficient.div(Q.of(d)) };
    }
    const bottom = radicals ? monomialOf(node.b) : undefined;
    if (!bottom || bottom.key === "" || !bottom.coefficient.isInteger() || bottom.coefficient.sign() < 0) return undefined;
    if (gcd(top.coefficient.n, bottom.coefficient.n) !== 1n) return undefined;
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

/** rootKey describes a radicand in simplest form for a root of index n: a monomial with an integer coefficient free of nth powers and every exponent below n, or a polynomial with integer coefficients that has more than one term; it returns undefined otherwise. */
function rootKey(radicand: Node, n: number): string | undefined {
  const m = monomialOf(unwrapGroup(radicand));
  if (m) {
    const c = m.coefficient;
    if (!c.isInteger() || c.sign() <= 0 || (c.eq(Q.one) && m.key === "")) return undefined;
    for (let p = 2n; p ** BigInt(n) <= c.n; p++) if (c.n % p ** BigInt(n) === 0n) return undefined;
    if (m.key.split("*").some((v) => Number(v.split("^")[1] ?? 1) >= n)) return undefined;
    return `${n}:${c.n}*${m.key}`;
  }
  return isSimplifiedPolynomial(unwrapGroup(radicand)) && !hasFraction(radicand) ? `${n}:${nodeKey(unwrapGroup(radicand))}` : undefined;
}

/** absKey describes the contents of an absolute value, which must be a simplified polynomial. */
function absKey(inner: Node): string | undefined {
  const u = unwrapGroup(inner);
  return isSimplifiedPolynomial(u) ? nodeKey(u) : undefined;
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
 * isSimplifiedRadical tells whether node is in simplest radical form: a sum
 * of terms as in isSimplifiedPolynomial, where a term may also have one root
 * whose radicand has no perfect nth-power factor, no fraction and no root
 * (\sqrt{12x^{3}} becomes 2x\sqrt{3x}), absolute values, and a denominator
 * that is a monomial with no root, with no two terms alike.
 */
export function isSimplifiedRadical(node: Node): boolean {
  return isSimplifiedSum(node, true);
}

function isSimplifiedSum(node: Node, radicals: boolean): boolean {
  const termOf = (n: Node) => monomialOf(n, radicals);
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
  if (!collect(node, true)) return false;
  if (terms.length === 1) return true;
  const keys = new Set(terms.map((m) => m.key));
  return keys.size === terms.length && terms.every((m) => !m.coefficient.isZero());
}
