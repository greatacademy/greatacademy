// Exact arithmetic on sums of real roots of rationals, so that radical
// expressions and fractional powers with variables, such as 2x\sqrt{3x},
// \sqrt[3]{54x^{2}} or x^{\frac{3}{4}}, can be compared at rational points.

import type { Node } from "./latex.ts";
import { Q, rationalRoot } from "./rational.ts";

/** UndefinedValueError reports an expression that is undefined at a point, or has no exact rational value there. */
export class UndefinedValueError extends Error {}

/** UnknownValueError reports a value outside what Algebraic can represent exactly (a root of a sum of roots, a power of a negative number with a fractional exponent, numbers too large to factor). */
export class UnknownValueError extends Error {}

/**
 * Algebraic is an exact real number written as a sum of terms c·r^(1/index),
 * keyed by the integer r ≥ 1 with no factor that is a perfect index-th power;
 * the empty map is zero. Such roots of distinct r are linearly independent
 * over the rationals, so the form is unique for a given index.
 */
export interface Algebraic {
  readonly index: number;
  readonly terms: ReadonlyMap<bigint, Q>;
}

/** maxIndex bounds the index of roots, beyond which values are unknown. */
const maxIndex = 60;

const rational = (q: Q): Algebraic => ({ index: 1, terms: q.isZero() ? new Map() : new Map([[1n, q]]) });

function addTerm(m: Map<bigint, Q>, r: bigint, c: Q) {
  const sum = (m.get(r) ?? Q.zero).add(c);
  if (sum.isZero()) m.delete(r);
  else m.set(r, sum);
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

const lcm = (a: number, b: number) => (a / Number(gcd(BigInt(a), BigInt(b)))) * b;

/** lift writes x with roots of index m, a multiple of x.index: r^(1/n) = (r^(m/n))^(1/m). */
function lift(x: Algebraic, m: number): Map<bigint, Q> {
  if (m > maxIndex) throw new UnknownValueError("root index too large");
  const k = BigInt(m / x.index);
  return new Map([...x.terms].map(([r, c]) => [r ** k, c]));
}

/** reduce writes x with the smallest index possible, keeping numbers small and recognizing rational values. */
function reduce(x: Algebraic): Algebraic {
  if (x.index === 1) return x;
  if (x.terms.size === 0 || (x.terms.size === 1 && x.terms.has(1n))) return { index: 1, terms: x.terms };
  for (let d = 1; d < x.index; d++) {
    if (x.index % d !== 0) continue;
    const k = x.index / d;
    const roots = [...x.terms.keys()].map((r) => rationalRoot(Q.of(r), k));
    if (roots.every((r) => r !== undefined)) return { index: d, terms: new Map([...x.terms.values()].map((c, i) => [roots[i]!.n, c])) };
  }
  return x;
}

function add(x: Algebraic, y: Algebraic, sign = 1): Algebraic {
  const m = lcm(x.index, y.index);
  const out = lift(x, m);
  for (const [r, c] of lift(y, m)) addTerm(out, r, sign > 0 ? c : c.neg());
  return reduce({ index: m, terms: out });
}

const neg = (x: Algebraic): Algebraic => ({ index: x.index, terms: new Map([...x.terms].map(([r, c]) => [r, c.neg()])) });

function mul(x: Algebraic, y: Algebraic): Algebraic {
  const m = lcm(x.index, y.index);
  const [a, b] = [lift(x, m), lift(y, m)];
  const out = new Map<bigint, Q>();
  for (const [r, c] of a) {
    for (const [s, d] of b) {
      if (m <= 2) {
        // √r·√s = g·√(rs/g²) for square-free r and s with g = gcd(r, s).
        const g = gcd(r, s);
        addTerm(out, (r / g) * (s / g), c.mul(d).mul(Q.of(g)));
      } else {
        const [outside, inside] = extractPower(r * s, m);
        addTerm(out, inside, c.mul(d).mul(Q.of(outside)));
      }
    }
  }
  return reduce({ index: m, terms: out });
}

/** asRational is the value of x when it is rational. */
function asRational(x: Algebraic): Q | undefined {
  if (x.terms.size === 0) return Q.zero;
  return x.terms.size === 1 ? x.terms.get(1n) : undefined;
}

function smallestPrime(n: bigint): bigint {
  for (let p = 2n; p * p <= n; p++) if (n % p === 0n) return p;
  return n;
}

/**
 * inverse is 1/x; it throws for zero. A single term c·r^(1/n) has the inverse
 * r^((n−1)/n)/(c·r); a sum of square roots is multiplied by conjugates until
 * the denominator is rational; other sums are unknown.
 */
function inverse(x: Algebraic): Algebraic {
  const v = asRational(x);
  if (v !== undefined) {
    if (v.isZero()) throw new UndefinedValueError("division by zero");
    return rational(Q.one.div(v));
  }
  if (x.terms.size === 1) {
    const [r, c] = [...x.terms][0]!;
    const [outside, inside] = extractPower(r ** BigInt(x.index - 1), x.index);
    return { index: x.index, terms: new Map([[inside, Q.of(outside).div(c.mul(Q.of(r)))]]) };
  }
  if (x.index > 2) throw new UnknownValueError("inverse of a sum of higher roots");
  let num: Algebraic = rational(Q.one);
  let den = x;
  for (let steps = 0; asRational(den) === undefined; steps++) {
    if (steps > 8) throw new UnknownValueError("too many radicals");
    const p = smallestPrime([...den.terms.keys()].find((r) => r !== 1n)!);
    const conj: Algebraic = { index: den.index, terms: new Map([...den.terms].map(([r, c]) => [r, r % p === 0n ? c.neg() : c])) };
    num = mul(num, conj);
    den = mul(den, conj);
  }
  const d = asRational(den)!;
  if (d.isZero()) throw new UndefinedValueError("division by zero");
  return reduce({ index: num.index, terms: new Map([...num.terms].map(([r, c]) => [r, c.div(d)])) });
}

const factorLimit = 100_000n;

/** extractPower writes v ≥ 1 as outside^n · inside with inside free of perfect nth-power factors. */
function extractPower(v: bigint, n: number): [bigint, bigint] {
  const big = BigInt(n);
  let inside = 1n;
  let outside = 1n;
  let rest = v;
  for (let p = 2n; p < factorLimit && p * p <= rest; p++) {
    let e = 0n;
    while (rest % p === 0n) {
      rest /= p;
      e++;
    }
    outside *= p ** (e / big);
    inside *= p ** (e % big);
  }
  // rest has no prime factor below p: 1, a prime, or below factorLimit³ a product of two primes or a square.
  if (rest >= factorLimit * factorLimit) {
    if (rest >= factorLimit ** 3n) throw new UnknownValueError("number too large");
    const r = n === 2 ? rationalRoot(Q.of(rest), 2) : undefined;
    if (r) return [outside * r.n, inside];
  }
  return [outside, inside * rest];
}

/** rootOf is the real nth root of a rational v, for n ≤ maxIndex. */
function rootOf(v: Q, n: number): Algebraic {
  if (n > maxIndex) throw new UnknownValueError("root index too large");
  if (v.sign() < 0) {
    if (n % 2 === 0) throw new UndefinedValueError("even root of a negative number");
    return neg(rootOf(v.neg(), n));
  }
  if (v.isZero() || n === 1) return rational(v);
  // (a/b)^(1/n) = (a·b^(n−1))^(1/n)/b; take out the nth powers.
  const [outside, inside] = extractPower(v.n * v.d ** BigInt(n - 1), n);
  return reduce({ index: n, terms: new Map([[inside, Q.of(outside, v.d)]]) });
}

/** power is x^e for a rational e: an integer power by repeated multiplication, a fractional one of a positive single term c·r^(1/n) as c^e·r^(e/n). */
function power(x: Algebraic, e: Q): Algebraic {
  if (e.abs().cmp(Q.of(64)) > 0) throw new UnknownValueError("unsupported exponent");
  const v = asRational(x);
  if (v?.isZero()) {
    if (e.sign() < 0) throw new UndefinedValueError("division by zero");
    return e.isZero() ? rational(Q.one) : rational(Q.zero);
  }
  if (e.isInteger()) {
    if (v !== undefined) return rational(v.pow(Number(e.n)));
    if (e.abs().cmp(Q.of(32)) > 0) throw new UnknownValueError("unsupported exponent");
    const factor = e.sign() < 0 ? inverse(x) : x;
    let out = rational(Q.one);
    for (let i = 0n; i < (e.n < 0n ? -e.n : e.n); i++) out = mul(out, factor);
    return out;
  }
  // A power of a negative number with a fractional exponent is left unknown: conventions differ.
  if (x.terms.size !== 1) throw new UnknownValueError("fractional power of a sum");
  const [r, c] = [...x.terms][0]!;
  if (c.sign() < 0) throw new UnknownValueError("fractional power of a negative number");
  const p = Number(e.n);
  const q = Number(e.d);
  return mul(rootOf(c.pow(p), q), rootOf(Q.of(r).pow(p), q * x.index));
}

/** root is the real nth root of x: of a rational, or of a single term. */
function root(x: Algebraic, n: number): Algebraic {
  const v = asRational(x);
  if (v !== undefined) return rootOf(v, n);
  if (x.terms.size !== 1) throw new UnknownValueError("root of a sum of roots");
  const c = [...x.terms.values()][0]!;
  if (c.sign() > 0) return power(x, Q.of(1, n));
  if (n % 2 === 0) throw new UndefinedValueError("even root of a negative number");
  return neg(power(neg(x), Q.of(1, n)));
}

/** approx is a floating-point value of x, used only for its sign. */
const approx = (x: Algebraic) => [...x.terms].reduce((s, [r, c]) => s + c.toNumber() * Number(r) ** (1 / x.index), 0);

/**
 * algebraicValue computes the exact value of node with the given variable
 * values. It throws UndefinedValueError where the expression is undefined
 * (division by zero, an even root of a negative number) and UnknownValueError
 * where the value is not a sum of roots of rationals (a root of a sum of
 * roots), is a fractional power of a negative number, or is too large.
 * Fractional exponents are roots: x^{\frac{3}{4}} is \sqrt[4]{x^{3}}.
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
      return neg(algebraicValue(node.a, env));
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
      if (e === undefined) throw new UnknownValueError("irrational exponent");
      return power(algebraicValue(node.a, env), e);
    }
    case "sqrt":
      return root(algebraicValue(node.a, env), 2);
    case "root":
      return root(algebraicValue(node.a, env), node.n);
    case "abs": {
      const v = algebraicValue(node.a, env);
      return approx(v) < 0 ? neg(v) : v;
    }
  }
}

/** algebraicEqual tells whether two values are equal. */
export function algebraicEqual(x: Algebraic, y: Algebraic): boolean {
  return add(x, y, -1).terms.size === 0;
}

/** hasRadical tells whether node contains a root or an absolute value. */
export function hasRadical(node: Node): boolean {
  if (node.k === "sqrt" || node.k === "root" || node.k === "abs") return true;
  if (!("a" in node)) return false;
  return hasRadical(node.a) || ("b" in node && hasRadical(node.b));
}
