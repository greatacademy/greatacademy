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

/** monomialOf recognizes a term written in simplest form: "7", "-\frac{2}{3}", "x", "3xy^{2}", "\frac{x}{2}", "\frac{3x}{4}". */
function monomialOf(node: Node): Monomial | undefined {
  if (node.k === "div" && node.frac && node.a.k !== "num") {
    const d = natural(node.b);
    const top = monomialOf(node.a);
    if (d === undefined || d < 2n || !top || !top.coefficient.isInteger() || top.key === "") return undefined;
    if (gcd(top.coefficient.n, d) !== 1n) return undefined;
    return { key: top.key, coefficient: top.coefficient.div(Q.of(d)) };
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
    if (f.k === "var") name = f.name;
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

/**
 * isSimplifiedPolynomial tells whether node is a sum of monomials in simplest
 * form with no two like terms, no zero terms, no parentheses, and no doubled
 * signs such as "x + -3". The order of the terms does not matter.
 */
export function isSimplifiedPolynomial(node: Node): boolean {
  const terms: Monomial[] = [];
  const collect = (n: Node, first: boolean): boolean => {
    if (n.k === "add" || n.k === "sub") {
      if (!collect(n.a, first)) return false;
      const m = monomialOf(n.b);
      if (!m || m.coefficient.sign() < 0) return false;
      terms.push(n.k === "sub" ? { ...m, coefficient: m.coefficient.neg() } : m);
      return true;
    }
    if (first && n.k === "neg") {
      const m = monomialOf(n.a);
      if (!m) return false;
      terms.push({ ...m, coefficient: m.coefficient.neg() });
      return true;
    }
    const m = monomialOf(n);
    if (!m) return false;
    terms.push(m);
    return true;
  };
  if (!collect(node, true)) return false;
  if (terms.length === 1) return true;
  const keys = new Set(terms.map((m) => m.key));
  return keys.size === terms.length && terms.every((m) => !m.coefficient.isZero());
}
