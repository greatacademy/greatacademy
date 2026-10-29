import { Q } from "./rational.ts";

/** Coefficient is a number usable as a coefficient in generated LaTeX. */
export type Coefficient = number | Q;

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** num writes a number in LaTeX: "-5", "\frac{3}{4}", "-\frac{3}{4}". */
export function num(c: Coefficient): string {
  return toQ(c).toLatex();
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
