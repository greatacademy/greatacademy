import type { Node } from "./latex.ts";
import { simplifyRadical } from "./numbers.ts";
import { Q } from "./rational.ts";

/**
 * Surd is an exact number a + b√m with rational a and b and a square-free
 * integer m > 1; a rational number has b = 0 and m = 1.
 */
export interface Surd {
  readonly a: Q;
  readonly b: Q;
  readonly m: bigint;
}

/** surd builds a + b√m, normalizing a zero b to a rational. */
export function surd(a: Q, b: Q = Q.zero, m: bigint = 1n): Surd {
  return b.isZero() || m === 1n ? { a: m === 1n ? a.add(b) : a, b: Q.zero, m: 1n } : { a, b, m };
}

/** commonRoot is the root two surds share, or undefined when they have different irrational parts. */
function commonRoot(x: Surd, y: Surd): bigint | undefined {
  if (x.m === 1n) return y.m;
  if (y.m === 1n || y.m === x.m) return x.m;
  return undefined;
}

const add = (x: Surd, y: Surd): Surd | undefined => {
  const m = commonRoot(x, y);
  return m === undefined ? undefined : surd(x.a.add(y.a), x.b.add(y.b), m);
};

const neg = (x: Surd): Surd => surd(x.a.neg(), x.b.neg(), x.m);

const mul = (x: Surd, y: Surd): Surd | undefined => {
  const m = commonRoot(x, y);
  if (m === undefined) return undefined;
  const r = Q.of(m);
  return surd(x.a.mul(y.a).add(x.b.mul(y.b).mul(r)), x.a.mul(y.b).add(x.b.mul(y.a)), m);
};

/** inverse is 1 / (a + b√m) = (a − b√m) / (a² − b²m), or undefined for zero. */
const inverse = (x: Surd): Surd | undefined => {
  const norm = x.a.mul(x.a).sub(x.b.mul(x.b).mul(Q.of(x.m)));
  return norm.isZero() ? undefined : surd(x.a.div(norm), x.b.neg().div(norm), x.m);
};

/** sqrtOf is √v for a rational v ≥ 0: √(p/q) = √(pq)/q, with the square factor taken out. */
function sqrtOf(v: Q): Surd | undefined {
  if (v.sign() < 0) return undefined;
  if (v.isZero()) return surd(Q.zero);
  const pq = v.n * v.d;
  if (pq > BigInt(Number.MAX_SAFE_INTEGER)) return undefined;
  const [k, m] = simplifyRadical(Number(pq));
  return surd(Q.zero, Q.of(k, v.d), BigInt(m));
}

/**
 * surdValue computes the exact value of a variable-free expression whose
 * square roots share one radicand, such as \frac{3 + \sqrt{5}}{2}; it returns
 * undefined for anything else (variables, two different roots, roots of
 * irrational or negative numbers, division by zero).
 */
export function surdValue(node: Node): Surd | undefined {
  switch (node.k) {
    case "num":
      return surd(node.v);
    case "var":
      return undefined;
    case "neg": {
      const a = surdValue(node.a);
      return a && neg(a);
    }
    case "pos":
    case "group":
      return surdValue(node.a);
    case "add":
    case "sub": {
      const a = surdValue(node.a);
      const b = surdValue(node.b);
      return a && b && add(a, node.k === "add" ? b : neg(b));
    }
    case "mul": {
      const a = surdValue(node.a);
      const b = surdValue(node.b);
      return a && b && mul(a, b);
    }
    case "div": {
      const a = surdValue(node.a);
      const b = surdValue(node.b);
      const inv = b && inverse(b);
      return a && inv && mul(a, inv);
    }
    case "pow": {
      const base = surdValue(node.a);
      const e = surdValue(node.b);
      if (!base || !e || e.m !== 1n || !e.a.isInteger() || e.a.abs().cmp(Q.of(16)) > 0) return undefined;
      let out: Surd | undefined = surd(Q.one);
      const k = Number(e.a.n);
      const factor = k < 0 ? inverse(base) : base;
      for (let i = 0; i < Math.abs(k) && out && factor; i++) out = mul(out, factor);
      return factor ? out : undefined;
    }
    case "sqrt": {
      const v = surdValue(node.a);
      return v && v.m === 1n ? sqrtOf(v.a) : undefined;
    }
  }
}

/** surdEqual tells whether two surds are the same number. */
export function surdEqual(x: Surd, y: Surd): boolean {
  return x.a.eq(y.a) && x.b.eq(y.b) && (x.b.isZero() || x.m === y.m);
}

/** surdCompare orders two surds by value; their irrational parts are compared in floating point, which suffices for distinct values of moderate size. */
export function surdCompare(x: Surd, y: Surd): number {
  if (surdEqual(x, y)) return 0;
  const v = (s: Surd) => s.a.toNumber() + s.b.toNumber() * Math.sqrt(Number(s.m));
  return v(x) < v(y) ? -1 : 1;
}

/** surdLatex writes a surd in simplest form: "3", "-\frac{2}{3}", "2\sqrt{3}", "\frac{3 - \sqrt{5}}{2}". */
export function surdLatex(s: Surd): string {
  if (s.m === 1n) return s.a.toLatex();
  const d = lcmBig(s.a.d, s.b.d);
  const p = (s.a.n * d) / s.a.d;
  const k = (s.b.n * d) / s.b.d;
  const root = `${k === 1n ? "" : k === -1n ? "-" : k}\\sqrt{${s.m}}`;
  const top = p === 0n ? root : `${p} ${k < 0n ? "-" : "+"} ${root.replace(/^-/, "")}`;
  if (d === 1n) return top;
  if (p === 0n && k < 0n) return `-\\frac{${root.slice(1)}}{${d}}`;
  return `\\frac{${top}}{${d}}`;
}

function lcmBig(a: bigint, b: bigint): bigint {
  let [x, y] = [a, b];
  while (y !== 0n) [x, y] = [y, x % y];
  return (a / x) * b;
}
