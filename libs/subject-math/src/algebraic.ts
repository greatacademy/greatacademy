// Exact arithmetic on sums of square roots, so that radical expressions with
// variables, such as 2x\sqrt{3x}, can be compared at rational points.

import type { Node } from "./latex.ts";
import { Q, rationalRoot } from "./rational.ts";

/** UndefinedValueError reports an expression that is undefined at a point, or has no exact rational value there. */
export class UndefinedValueError extends Error {}

/** Algebraic is a sum of terms c·√r keyed by the square-free integer r ≥ 1; the empty map is zero. */
export type Algebraic = ReadonlyMap<bigint, Q>;

/** UnknownValueError reports a value outside what Algebraic can represent exactly (a root of an irrational number, numbers too large to factor). */
export class UnknownValueError extends Error {}

const rational = (q: Q): Algebraic => (q.isZero() ? new Map() : new Map([[1n, q]]));

function addTerm(m: Map<bigint, Q>, r: bigint, c: Q) {
  const sum = (m.get(r) ?? Q.zero).add(c);
  if (sum.isZero()) m.delete(r);
  else m.set(r, sum);
}

function add(x: Algebraic, y: Algebraic, sign = 1): Algebraic {
  const out = new Map(x);
  for (const [r, c] of y) addTerm(out, r, sign > 0 ? c : c.neg());
  return out;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function mul(x: Algebraic, y: Algebraic): Algebraic {
  const out = new Map<bigint, Q>();
  for (const [r, c] of x) {
    for (const [s, d] of y) {
      // √r·√s = g·√(rs/g²) for square-free r and s with g = gcd(r, s).
      const g = gcd(r, s);
      addTerm(out, (r / g) * (s / g), c.mul(d).mul(Q.of(g)));
    }
  }
  return out;
}

/** asRational is the value of x when it is rational. */
function asRational(x: Algebraic): Q | undefined {
  if (x.size === 0) return Q.zero;
  return x.size === 1 ? x.get(1n) : undefined;
}

function smallestPrime(n: bigint): bigint {
  for (let p = 2n; p * p <= n; p++) if (n % p === 0n) return p;
  return n;
}

/** inverse is 1/x, found by multiplying by conjugates until the denominator is rational; it throws for zero. */
function inverse(x: Algebraic): Algebraic {
  let num: Algebraic = rational(Q.one);
  let den = x;
  for (let steps = 0; asRational(den) === undefined; steps++) {
    if (steps > 8) throw new UnknownValueError("too many radicals");
    const p = smallestPrime([...den.keys()].find((r) => r !== 1n)!);
    const conj = new Map([...den].map(([r, c]) => [r, r % p === 0n ? c.neg() : c]));
    num = mul(num, conj);
    den = mul(den, conj);
  }
  const d = asRational(den)!;
  if (d.isZero()) throw new UndefinedValueError("division by zero");
  return new Map([...num].map(([r, c]) => [r, c.div(d)]));
}

const factorLimit = 100_000n;

/** sqrtOf is √v for a rational v ≥ 0, written c·√r with r square-free. */
function sqrtOf(v: Q): Algebraic {
  if (v.sign() < 0) throw new UndefinedValueError("square root of a negative number");
  if (v.isZero()) return new Map();
  // √(n/d) = √(nd)/d; take out the square factors of nd.
  let rest = v.n * v.d;
  let out = 1n;
  let large = rest;
  for (let p = 2n; p < factorLimit && p * p <= large; p++) {
    while (rest % (p * p) === 0n) {
      rest /= p * p;
      out *= p;
    }
    while (large % p === 0n) large /= p;
  }
  // large is the part of rest with no prime factor below factorLimit: 1, a prime, pq or p² when below factorLimit³.
  if (large >= factorLimit * factorLimit) {
    if (large >= factorLimit ** 3n) throw new UnknownValueError("number too large");
    const r = rationalRoot(Q.of(large), 2);
    if (r) {
      rest /= large;
      out *= r.n;
    }
  }
  return new Map([[rest, Q.of(out, v.d)]]);
}

/** approx is a floating-point value of x, used only for its sign. */
const approx = (x: Algebraic) => [...x].reduce((s, [r, c]) => s + c.toNumber() * Math.sqrt(Number(r)), 0);

/**
 * algebraicValue computes the exact value of node with the given variable
 * values. It throws UndefinedValueError where the expression is undefined
 * (division by zero, an even root of a negative number) and UnknownValueError
 * where the value is not a sum of square roots of rationals (a cube root of
 * 2, a root of a root).
 */
export function algebraicValue(node: Node, env: ReadonlyMap<string, Q>): Algebraic {
  switch (node.k) {
    case "num":
      return rational(node.v);
    case "var": {
      const v = env.get(node.name);
      if (!v) throw new UndefinedValueError(`no value for ${node.name}`);
      return rational(v);
    }
    case "neg":
      return add(new Map(), algebraicValue(node.a, env), -1);
    case "pos":
    case "group":
      return algebraicValue(node.a, env);
    case "add":
    case "sub":
      return add(algebraicValue(node.a, env), algebraicValue(node.b, env), node.k === "add" ? 1 : -1);
    case "mul":
      return mul(algebraicValue(node.a, env), algebraicValue(node.b, env));
    case "div":
      return mul(algebraicValue(node.a, env), inverse(algebraicValue(node.b, env)));
    case "pow": {
      const e = asRational(algebraicValue(node.b, env));
      if (!e?.isInteger() || e.abs().cmp(Q.of(32)) > 0) throw new UnknownValueError("unsupported exponent");
      const base = algebraicValue(node.a, env);
      const factor = e.sign() < 0 ? inverse(base) : base;
      let out = rational(Q.one);
      for (let i = 0n; i < (e.n < 0n ? -e.n : e.n); i++) out = mul(out, factor);
      return out;
    }
    case "sqrt": {
      const v = asRational(algebraicValue(node.a, env));
      if (v === undefined) throw new UnknownValueError("square root of an irrational number");
      return sqrtOf(v);
    }
    case "root": {
      const v = asRational(algebraicValue(node.a, env));
      if (v === undefined) throw new UnknownValueError("root of an irrational number");
      if (v.sign() < 0 && node.n % 2 === 0) throw new UndefinedValueError("even root of a negative number");
      const r = rationalRoot(v, node.n);
      if (!r) throw new UnknownValueError("irrational root");
      return rational(r);
    }
    case "abs": {
      const v = algebraicValue(node.a, env);
      return approx(v) < 0 ? add(new Map(), v, -1) : v;
    }
  }
}

/** algebraicEqual tells whether two values are equal. */
export function algebraicEqual(x: Algebraic, y: Algebraic): boolean {
  return add(x, y, -1).size === 0;
}

/** hasRadical tells whether node contains a root or an absolute value. */
export function hasRadical(node: Node): boolean {
  if (node.k === "sqrt" || node.k === "root" || node.k === "abs") return true;
  if (!("a" in node)) return false;
  return hasRadical(node.a) || ("b" in node && hasRadical(node.b));
}
