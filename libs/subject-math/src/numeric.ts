import { variables } from "./algebra.ts";
import type { FnName, Node } from "./latex.ts";

/** constants are the letters numericValue reads as numbers rather than variables: e and π. */
export const constants: ReadonlyMap<string, number> = new Map([
  ["e", Math.E],
  ["\\pi", Math.PI],
]);

const functions: Record<FnName, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),
  cot: (x) => Math.cos(x) / Math.sin(x),
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  arcsec: (x) => Math.acos(1 / x),
  arccsc: (x) => Math.asin(1 / x),
  arccot: (x) => Math.PI / 2 - Math.atan(x),
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sech: (x) => 1 / Math.cosh(x),
  csch: (x) => 1 / Math.sinh(x),
  coth: (x) => 1 / Math.tanh(x),
  arsinh: Math.asinh,
  arcosh: Math.acosh,
  artanh: Math.atanh,
  arsech: (x) => Math.acosh(1 / x),
  arcsch: (x) => Math.asinh(1 / x),
  arcoth: (x) => Math.atanh(1 / x),
  exp: Math.exp,
  ln: (x) => (x > 0 ? Math.log(x) : Number.NaN),
  log: (x) => (x > 0 ? Math.log10(x) : Number.NaN),
};

/** oddDenominator returns the denominator of e when e is close to a fraction with a small odd denominator, so that a negative base has a real power. */
function oddDenominator(e: number): number | undefined {
  for (let d = 3; d <= 15; d += 2) {
    const n = Math.round(e * d);
    if (Math.abs(n - e * d) < 1e-9) return n % 2 === 0 ? undefined : d;
  }
  return undefined;
}

/**
 * numericValue computes the value of node in floating point, with e and π as
 * constants and the given variable values. Where the expression is undefined
 * (division by zero, the logarithm of a negative number) the result is NaN or
 * infinite. A negative base has a real power only for exponents that are
 * fractions with an odd denominator, as in x^{\frac{1}{3}}.
 */
export function numericValue(node: Node, env: ReadonlyMap<string, number>): number {
  switch (node.k) {
    case "num":
      return node.v.toNumber();
    case "var": {
      const v = env.get(node.name) ?? constants.get(node.name);
      return v ?? Number.NaN;
    }
    case "neg":
      return -numericValue(node.a, env);
    case "pos":
    case "group":
      return numericValue(node.a, env);
    case "add":
      return numericValue(node.a, env) + numericValue(node.b, env);
    case "sub":
      return numericValue(node.a, env) - numericValue(node.b, env);
    case "mul":
      return numericValue(node.a, env) * numericValue(node.b, env);
    case "div":
      return numericValue(node.a, env) / numericValue(node.b, env);
    case "pow": {
      const b = numericValue(node.a, env);
      const e = numericValue(node.b, env);
      if (b >= 0 || Number.isInteger(e)) return b ** e;
      const d = oddDenominator(e);
      return d === undefined ? Number.NaN : -((-b) ** e) * (Math.round(e * d) % 2 === 0 ? -1 : 1);
    }
    case "sqrt":
      return Math.sqrt(numericValue(node.a, env));
    case "root": {
      const v = numericValue(node.a, env);
      if (v >= 0) return v ** (1 / node.n);
      return node.n % 2 === 1 ? -((-v) ** (1 / node.n)) : Number.NaN;
    }
    case "abs":
      return Math.abs(numericValue(node.a, env));
    case "fn": {
      const v = functions[node.name](numericValue(node.a, env));
      if (!node.base) return v;
      const b = numericValue(node.base, env);
      return b > 0 && b !== 1 ? (v * Math.LN10) / Math.log(b) : Number.NaN;
    }
  }
}

/**
 * samplePoints are the values substituted when comparing functions
 * numerically: irregular, so that they avoid the special values where
 * different functions agree, and of both signs.
 */
const samplePoints = [0.37, 1.21, -0.58, 2.43, 0.83, -1.67, 3.19, 1.74, -2.36, 0.12, 2.91, -0.93];

function close(x: number, y: number): boolean {
  return Math.abs(x - y) <= 1e-8 * Math.max(1, Math.abs(x), Math.abs(y));
}

/**
 * numericallyEquivalent tells whether two expressions agree as functions of
 * their variables: at every sample point both are undefined or both are
 * defined and equal up to rounding, and they are defined together at at least
 * four points. With positive, only positive values are substituted.
 */
export function numericallyEquivalent(a: Node, b: Node, positive = false): boolean {
  const vars = [...new Set([...variables(a), ...variables(b)])].filter((v) => !constants.has(v));
  const points = positive ? samplePoints.filter((p) => p > 0) : samplePoints;
  let agreed = 0;
  for (let i = 0; i < points.length; i++) {
    const env = new Map(vars.map((v, j) => [v, points[(i + j * 5) % points.length]!]));
    const va = numericValue(a, env);
    const vb = numericValue(b, env);
    const da = Number.isFinite(va);
    if (da !== Number.isFinite(vb)) return false;
    if (!da) continue;
    if (!close(va, vb)) return false;
    agreed++;
  }
  return agreed >= 4;
}

/**
 * differByConstant tells whether a and b differ by the same constant at every
 * sample point where both are defined, as two antiderivatives of one function
 * do, varying the variable named by x and holding the others at fixed values.
 */
export function differByConstant(a: Node, b: Node, x: string, fixed: ReadonlyMap<string, number> = new Map()): boolean {
  let difference: number | undefined;
  let agreed = 0;
  for (const p of samplePoints) {
    const env = new Map([...fixed, [x, p]]);
    const va = numericValue(a, env);
    const vb = numericValue(b, env);
    const da = Number.isFinite(va);
    if (da !== Number.isFinite(vb)) return false;
    if (!da) continue;
    if (difference === undefined) difference = va - vb;
    else if (!close(va - vb, difference)) return false;
    agreed++;
  }
  return agreed >= 4;
}
