import { Q } from "./rational.ts";

/** Coefficient is a number usable as a coefficient in generated LaTeX. */
export type Coefficient = number | Q;

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** num writes a number in LaTeX: "-5", "\frac{3}{4}", "-\frac{3}{4}". */
export function num(c: Coefficient): string {
  return toQ(c).toLatex();
}

/**
 * dec writes a number with a terminating decimal expansion as a decimal:
 * "0.75", "-2.5", "3". It throws for a number such as 1/3.
 */
export function dec(c: Coefficient): string {
  const v = toQ(c);
  let k = 0;
  while (10n ** BigInt(k) % v.d !== 0n) {
    if (++k > 15) throw new RangeError(`no terminating decimal: ${v}`);
  }
  const scaled = (v.n < 0n ? -v.n : v.n) * (10n ** BigInt(k) / v.d);
  const digits = scaled.toString().padStart(k + 1, "0");
  const body = k === 0 ? digits : `${digits.slice(0, -k)}.${digits.slice(-k)}`;
  return v.n < 0n ? `-${body}` : body;
}

/**
 * radical writes c√m in simplest form, with m a square-free integer: "3\sqrt{2}",
 * "-\sqrt{5}", "\frac{\sqrt{6}}{3}", "\frac{2\sqrt{3}}{3}"; with m = 1 it is just c.
 */
export function radical(c: Coefficient, m: number): string {
  const v = toQ(c);
  if (m === 1) return v.toLatex();
  const n = v.n < 0n ? -v.n : v.n;
  const top = `${n === 1n ? "" : n}\\sqrt{${m}}`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.n < 0n ? `-${body}` : body;
}

/** sci writes a × 10ⁿ in scientific notation: sci(4.5, 3) is "4.5 \times 10^{3}". */
export function sci(a: Coefficient, n: number): string {
  return `${dec(a)} \\times 10^{${n}}`;
}

/** paren writes a number, in parentheses when negative, for use after an operator: "(-5)". */
export function paren(c: Coefficient): string {
  const s = num(c);
  return toQ(c).sign() < 0 ? `(${s})` : s;
}

/**
 * poly writes a sum of terms in LaTeX, dropping zero terms, unit coefficients
 * and doubled signs: poly([3, "x"], [-1, "y"], [-5, ""]) is "3x - y - 5".
 * Terms are written in the order given.
 */
export function poly(...terms: readonly (readonly [Coefficient, string])[]): string {
  let out = "";
  for (const [c, v] of terms) {
    const coefficient = toQ(c);
    if (coefficient.isZero()) continue;
    const negative = coefficient.sign() < 0;
    const abs = coefficient.abs();
    const body = v === "" ? abs.toLatex() : abs.eq(Q.one) ? v : `${abs.toLatex()}${v}`;
    if (out === "") out = negative ? `-${body}` : body;
    else out += negative ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

/** linear writes ax + b: linear(2, -3) is "2x - 3". */
export function linear(a: Coefficient, b: Coefficient, variable = "x"): string {
  return poly([a, variable], [b, ""]);
}

/** relSymbol writes a relation in LaTeX. */
export function relSymbol(op: "=" | "<" | ">" | "<=" | ">="): string {
  return { "=": "=", "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge" }[op];
}
