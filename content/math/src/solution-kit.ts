// Shared helpers for writing worked solutions: numbers and terms in LaTeX, checks, step labels, tables and the
// standard graph window. They were gathered from the Algebra I topics so that later courses reuse them.

import type { Text } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  linear,
  num,
  type PlaneView,
  paren,
  poly,
  Q,
  type RealSet,
  type Surd,
  simplifyRadical,
  surd,
  union,
} from "@ga/subject-math";

import type { InequalityOp } from "./problems.ts";

/** toQ turns a coefficient into an exact rational number. */
export const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** range lists the numbers from `from` up to `to` in steps of `by`: range(-2, 2) is [-2, -1, 0, 1, 2]. */
export const range = (from: number, to: number, by = 1) =>
  Array.from({ length: Math.floor((to - from) / by) + 1 }, (_, i) => from + i * by);

/** view is the standard graph window, from -6 to 6 on both axes. */
export const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** flip is the inequality with its sides exchanged, as when both sides are multiplied by a negative number. */
export const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };

/** holds tells whether lhs op rhs is true; two plain numbers are compared as they are, anything else exactly. */
export function holds(lhs: Coefficient, op: InequalityOp, rhs: Coefficient): boolean {
  if (typeof lhs === "number" && typeof rhs === "number") {
    return { "<": lhs < rhs, "<=": lhs <= rhs, ">": lhs > rhs, ">=": lhs >= rhs }[op];
  }
  const c = toQ(lhs).cmp(toQ(rhs));
  return { "<": c < 0, "<=": c <= 0, ">": c > 0, ">=": c >= 0 }[op];
}

/** toggleEnds includes every finite endpoint that is excluded and excludes every one that is included. */
export const toggleEnds = (s: RealSet): RealSet =>
  union(...s.map((i) => ({ ...i, loClosed: i.lo !== undefined && !i.loClosed, hiClosed: i.hi !== undefined && !i.hiClosed })));

/** isSquare tells whether n is the square of an integer. */
export const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** squareFree are the square-free radicands used in generated problems. */
export const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

/** sqrtSurd is √k for a rational k ≥ 0, in simplest form. */
export function sqrtSurd(k: Q): Surd {
  if (k.isZero()) return surd(Q.zero);
  const [c, m] = simplifyRadical(Number(k.n * k.d));
  return surd(Q.zero, Q.of(c, k.d), BigInt(m));
}

/** pw writes a power of a variable: "" for the exponent 0, "x" for 1 and "x^{3}" otherwise. */
export const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** mono writes the monomial c·xᵃ·yᵇ: "3x^{2}y", "-x", "7". */
export const mono = (c: Coefficient, x = 0, y = 0) => poly([c, `${pw("x", x)}${pw("y", y)}`]);

/**
 * front writes a factor before parentheses, a power or a root: "", "-", "3" or "\frac{1}{2}" for a constant, and the
 * monomial c·xᵃ·yᵇ when it has variables: "-2x^{2}".
 */
export function front(c: Coefficient, x = 0, y = 0): string {
  if (x !== 0 || y !== 0) return mono(c, x, y);
  const v = toQ(c);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return num(v);
}

/** tail writes a constant added after an expression: "", " + 3" or " - \frac{1}{2}". */
export function tail(c: Coefficient): string {
  const v = toQ(c);
  return v.isZero() ? "" : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`;
}

/** signed writes a term after another, with its sign as the operator: "- 3x", "+ 5". */
export function signed(term: string | number): string {
  const s = String(term);
  return s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`;
}

/** quad writes ax² + bx + c in the variable v. */
export const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** lf writes the factor (px + q). */
export const lf = (p: Coefficient, q: Coefficient, v = "x") => `(${linear(p, q, v)})`;

/** binomialSquare writes (v + p)², with tall parentheses when p is a fraction, and v² when p = 0. */
export function binomialSquare(p: Coefficient, v = "x"): string {
  const P = toQ(p);
  if (P.isZero()) return `${v}^{2}`;
  return P.isInteger() ? `(${linear(1, P, v)})^{2}` : `\\left(${linear(1, P, v)}\\right)^{2}`;
}

/** evalAt writes m · x + b for substituting x into y = mx + b, leaving out a zero b. */
export function evalAt(m: Coefficient, x: Coefficient, b: Coefficient): string {
  const B = toQ(b);
  const M = toQ(m);
  const head = M.eq(Q.of(1)) ? paren(x) : M.eq(Q.of(-1)) ? `-${paren(x)}` : `${num(m)} \\cdot ${paren(x)}`;
  return B.isZero() ? head : `${head} ${B.sign() < 0 ? "-" : "+"} ${num(B.abs())}`;
}

/** chain joins the stages of a calculation with equals signs, leaving out a stage that repeats the one before it. */
export const chain = (...parts: readonly string[]) => parts.filter((p, i) => i === 0 || p !== parts[i - 1]).join(" = ");

/** valueRows writes rows of values under a row of x-values as a display array, each row headed by its name. */
export function valueRows(xs: readonly Coefficient[], rows: readonly (readonly [string, readonly Coefficient[]])[]): string {
  const cell = (v: Coefficient) => (typeof v === "number" ? String(v) : v.toLatex());
  const row = (head: string, values: readonly Coefficient[]) => `${head} & ${values.map(cell).join(" & ")}`;
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} ${row("x", xs)} \\\\ \\hline ${rows.map(([h, v]) => row(h, v)).join(" \\\\ ")} \\end{array}$$`;
}

/** valueTable writes a table of values of the function called name as a display array. */
export const valueTable = (name: string, xs: readonly Coefficient[], ys: readonly Coefficient[]) => valueRows(xs, [[`${name}(x)`, ys]]);

/** stepLabel writes the bold start of step i with its title in each locale: "**Step 2: Factor.**" / "**第二步：分解。**". */
export function stepLabel(i: number, en: string, zh: string): Text {
  return t(`**Step ${i}: ${en}.**`, `**第${["一", "二", "三", "四", "五"][i - 1]}步：${zh}。**`);
}

/** listed joins items as a list in each locale: "a, b and c" and "a、b、c". */
export function listed(items: readonly string[]): Text {
  const en = items.length === 1 ? items[0]! : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  return t(en, items.join("、"));
}

/** listRealSolutions tells the learner how to enter the real solutions of an equation. */
export const listRealSolutions = t(
  "Enter all real solutions separated by commas, or type none if there are none.",
  "请用逗号分隔写出所有实数解；如果没有实数解，请输入 none。",
);

/** solvePrompt asks to solve an equation and tells how to enter its solutions, the real solutions by default. */
export const solvePrompt = (eq: string, how: Text = listRealSolutions): Text =>
  t(`Solve $${eq}$. ${how.en}`, `解方程 $${eq}$。${how["zh-CN"]}`);
