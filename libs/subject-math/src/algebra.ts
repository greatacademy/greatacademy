import { algebraicEqual, algebraicValue, UndefinedValueError, UnknownValueError } from "./algebraic.ts";
import type { Node } from "./latex.ts";
import { Q, rationalRoot } from "./rational.ts";

/** evaluate computes the exact value of node with the given variable values. */
export function evaluate(node: Node, env: ReadonlyMap<string, Q> = new Map()): Q {
  switch (node.k) {
    case "num":
      return node.v;
    case "var": {
      const v = env.get(node.name);
      if (!v) throw new UndefinedValueError(`no value for ${node.name}`);
      return v;
    }
    case "neg":
      return evaluate(node.a, env).neg();
    case "pos":
    case "group":
      return evaluate(node.a, env);
    case "add":
      return evaluate(node.a, env).add(evaluate(node.b, env));
    case "sub":
      return evaluate(node.a, env).sub(evaluate(node.b, env));
    case "mul":
      return evaluate(node.a, env).mul(evaluate(node.b, env));
    case "div": {
      const d = evaluate(node.b, env);
      if (d.isZero()) throw new UndefinedValueError("division by zero");
      return evaluate(node.a, env).div(d);
    }
    case "pow": {
      const e = evaluate(node.b, env);
      if (e.abs().cmp(Q.of(64)) > 0 || e.d > 64n) throw new UndefinedValueError("unsupported exponent");
      let b = evaluate(node.a, env);
      if (b.isZero() && e.sign() < 0) throw new UndefinedValueError("division by zero");
      if (!e.isInteger()) {
        // A fractional exponent is a root: b^(p/q) is the qth root of b, to the power p.
        const r = b.sign() < 0 ? undefined : rationalRoot(b, Number(e.d));
        if (!r) throw new UndefinedValueError("irrational or negative power");
        b = r;
      }
      return b.pow(Number(e.n));
    }
    case "sqrt": {
      const v = evaluate(node.a, env);
      if (v.sign() < 0) throw new UndefinedValueError("square root of a negative number");
      const n = isqrt(v.n);
      const d = isqrt(v.d);
      if (n * n !== v.n || d * d !== v.d) throw new UndefinedValueError("irrational square root");
      return Q.of(n, d);
    }
    case "root": {
      const v = evaluate(node.a, env);
      const r = rationalRoot(v, node.n);
      if (!r) throw new UndefinedValueError(v.sign() < 0 && node.n % 2 === 0 ? "even root of a negative number" : "irrational root");
      return r;
    }
    case "abs":
      return evaluate(node.a, env).abs();
  }
}

function isqrt(n: bigint): bigint {
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  while (x * x > n) x--;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
}

/** variables lists the variables of node in order of first appearance. */
export function variables(node: Node, out: string[] = []): string[] {
  if (node.k === "var") {
    if (!out.includes(node.name)) out.push(node.name);
  } else if ("a" in node) {
    variables(node.a, out);
    if ("b" in node) variables(node.b, out);
  }
  return out;
}

/**
 * Poly is a polynomial with rational coefficients, keyed by monomial. A
 * monomial key lists its variables in sorted order with exponents, such as
 * "x^2*y"; the constant term has the key "".
 */
export type Poly = ReadonlyMap<string, Q>;

function monomial(powers: ReadonlyMap<string, number>): string {
  return [...powers]
    .filter(([, e]) => e !== 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([v, e]) => (e === 1 ? v : `${v}^${e}`))
    .join("*");
}

function parseMonomial(key: string): Map<string, number> {
  const powers = new Map<string, number>();
  if (key === "") return powers;
  for (const part of key.split("*")) {
    const [v, e] = part.split("^");
    powers.set(v!, e === undefined ? 1 : Number(e));
  }
  return powers;
}

function addTo(p: Map<string, Q>, key: string, c: Q) {
  const sum = (p.get(key) ?? Q.zero).add(c);
  if (sum.isZero()) p.delete(key);
  else p.set(key, sum);
}

function polyMul(a: Poly, b: Poly): Map<string, Q> {
  const out = new Map<string, Q>();
  for (const [ka, ca] of a) {
    for (const [kb, cb] of b) {
      const powers = parseMonomial(ka);
      for (const [v, e] of parseMonomial(kb)) powers.set(v, (powers.get(v) ?? 0) + e);
      addTo(out, monomial(powers), ca.mul(cb));
    }
  }
  return out;
}

/** toPoly expands node into a polynomial, or returns undefined when it is not one (division by a variable, a root, a symbolic exponent). */
export function toPoly(node: Node): Poly | undefined {
  switch (node.k) {
    case "num":
      return node.v.isZero() ? new Map() : new Map([["", node.v]]);
    case "var":
      return new Map([[node.name, Q.one]]);
    case "neg": {
      const a = toPoly(node.a);
      return a && new Map([...a].map(([k, c]) => [k, c.neg()]));
    }
    case "pos":
    case "group":
      return toPoly(node.a);
    case "add":
    case "sub": {
      const a = toPoly(node.a);
      const b = toPoly(node.b);
      if (!a || !b) return undefined;
      const out = new Map(a);
      for (const [k, c] of b) addTo(out, k, node.k === "add" ? c : c.neg());
      return out;
    }
    case "mul": {
      const a = toPoly(node.a);
      const b = toPoly(node.b);
      return a && b && polyMul(a, b);
    }
    case "div": {
      const a = toPoly(node.a);
      const b = toPoly(node.b);
      if (!a || !b || b.size !== 1 || !b.has("")) return undefined;
      const d = b.get("")!;
      return new Map([...a].map(([k, c]) => [k, c.div(d)]));
    }
    case "pow": {
      const a = toPoly(node.a);
      const e = toPoly(node.b);
      if (!a || !e) return undefined;
      if (e.size === 0) return new Map([["", Q.one]]);
      const ev = e.get("");
      if (e.size !== 1 || !ev || !ev.isInteger() || ev.sign() < 0 || ev.cmp(Q.of(16)) > 0) return undefined;
      let out: Map<string, Q> = new Map([["", Q.one]]);
      for (let i = 0n; i < ev.n; i++) out = polyMul(out, a);
      return out;
    }
    case "sqrt":
    case "root":
    case "abs":
      return undefined;
  }
}

/** polyEqual tells whether two polynomials are identical. */
export function polyEqual(a: Poly, b: Poly): boolean {
  if (a.size !== b.size) return false;
  for (const [k, c] of a) {
    const o = b.get(k);
    if (!o?.eq(c)) return false;
  }
  return true;
}

/**
 * samplePoints are the fixed rational values substituted when comparing
 * non-polynomial expressions. The integers among them let expressions with a
 * variable exponent, such as 500(1.03)^t, be evaluated exactly.
 */
const samplePoints = ["7/3", "-5/2", "11/7", "3", "-13/5", "17/4", "-2/9", "5/11", "2", "-1", "5", "4"].map((s) => Q.parse(s));

/**
 * equivalent tells whether two expressions are equal for all values of their
 * variables. Polynomials are compared exactly; other expressions are compared
 * exactly at several rational points, and must agree at at least three of them
 * where both are defined, with the same definedness at every point. Values are
 * kept exact as sums of roots of rationals (see algebraicValue), so that roots
 * and fractional exponents compare exactly; points where a value leaves that
 * form, such as a fractional power of a negative number, are skipped. With
 * positive, only positive values are substituted, for expressions whose
 * variables are known to be positive, such as \sqrt{x^{2}} = x.
 */
export function equivalent(a: Node, b: Node, positive = false): boolean {
  const pa = toPoly(a);
  const pb = toPoly(b);
  if (pa && pb) return polyEqual(pa, pb);
  const vars = [...new Set([...variables(a), ...variables(b)])];
  const points = positive ? samplePoints.filter((p) => p.sign() > 0) : samplePoints;
  let agreed = 0;
  for (let i = 0; i < points.length; i++) {
    const env = new Map(vars.map((v, j) => [v, points[(i + j * 3) % points.length]!]));
    const va = tryValue(() => algebraicValue(a, env));
    const vb = tryValue(() => algebraicValue(b, env));
    if (va === unknown || vb === unknown) continue;
    if ((va === undefined) !== (vb === undefined)) return false;
    if (va && vb) {
      if (!algebraicEqual(va, vb)) return false;
      agreed++;
    }
  }
  return agreed >= 3;
}

const unknown = Symbol("unknown");

function tryValue<T>(f: () => T): T | undefined | typeof unknown {
  try {
    return f();
  } catch (e) {
    if (e instanceof UnknownValueError) return unknown;
    if (e instanceof UndefinedValueError || e instanceof RangeError) return undefined;
    throw e;
  }
}
