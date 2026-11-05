import type { Figure, Problem, Rng, Text } from "@ga/content";
import { same, t } from "@ga/content";
import { linear, type PlaneMark, poly, Q, radical } from "@ga/subject-math";

import { choiceProblem } from "../problems.ts";

// Helpers shared by the calculus topics.

/** graphAltOf describes for screen readers what a graph of y = f(x) shows: where its curves pass and end, its dots and its dashed lines. */
export function graphAltOf(
  view: { readonly xMin: number; readonly xMax: number; readonly yMin: number; readonly yMax: number },
  marks: readonly PlaneMark[],
): Text {
  const num = (n: number) => String(Math.round(n * 100) / 100);
  const en: string[] = [];
  const zh: string[] = [];
  for (const mark of marks) {
    if (mark.kind === "curve") {
      const [from, to] = [mark.from ?? view.xMin, mark.to ?? view.xMax];
      const points: string[] = [];
      for (let x = Math.ceil(from); x <= to; x++) {
        const y = mark.f(x);
        if (x > from && x < to && Number.isFinite(y) && y >= view.yMin && y <= view.yMax) points.push(`(${x}, ${num(y)})`);
      }
      const edge = (x: number | undefined) => (x === undefined ? undefined : `x = ${num(x)}, y = ${num(mark.f(x))}`);
      const ends = [edge(mark.from), edge(mark.to)].filter((end) => end !== undefined);
      en.push(`a curve through ${points.join(", ")}${ends.length ? `, with an end at ${ends.join(" and at ")}` : ""}`);
      zh.push(`一条经过 ${points.join("、")} 的曲线${ends.length ? `，端点在 ${ends.join(" 和 ")}` : ""}`);
    } else if (mark.kind === "point") {
      const at = `(${num(mark.at[0])}, ${num(mark.at[1])})`;
      en.push(`${mark.open ? "an open" : "a filled"} dot at ${at}`);
      zh.push(`${at} 处的${mark.open ? "空心" : "实心"}点`);
    } else if (mark.kind === "segment") {
      const ends = `(${num(mark.a[0])}, ${num(mark.a[1])}) to (${num(mark.b[0])}, ${num(mark.b[1])})`;
      en.push(`a straight piece from ${ends}`);
      zh.push(`一段直线 ${ends.replace(" to ", " 到 ")}`);
    } else if (mark.kind === "line") {
      const vertical = mark.a[0] === mark.b[0];
      const where = vertical
        ? `x = ${num(mark.a[0])}`
        : `through (${num(mark.a[0])}, ${num(mark.a[1])}) and (${num(mark.b[0])}, ${num(mark.b[1])})`;
      en.push(`a ${mark.dashed ? "dashed " : ""}line ${where}`);
      zh.push(`一条${mark.dashed ? "虚" : "直"}线 ${where.replace("through", "经过").replace(" and ", " 和 ")}`);
    }
  }
  return t(`The graph of y = f(x): ${en.join("; ")}.`, `y = f(x) 的图像：${zh.join("；")}。`);
}

/** range lists the integers from lo to hi. */
export const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** oneOf builds a multiple-choice problem from a right option and up to three distinct wrong ones, with an optional figure. */
export function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return figure ? { ...problem, figure } : problem;
}

/** Side is the side from which a one-sided limit approaches: −1 from the left, 1 from the right. */
export type Side = -1 | 1;

/** lim writes the limit operator as x approaches a, from one side when side is given: "\lim_{x \to 2^{-}}". */
export const lim = (a: string | number, side?: Side, variable = "x") =>
  `\\lim_{${variable} \\to ${a}${side === undefined ? "" : side < 0 ? "^{-}" : "^{+}"}}`;

/** infL writes ∞ or −∞ by sign. */
export const infL = (s: number) => (s > 0 ? "\\infty" : "-\\infty");

/** bare writes x − p without parentheses: "x - 3", "x + 2", "x". */
export const bare = (p: number, variable = "x") => linear(1, -p, variable);

/** fac writes the factor (x − p), or x when p is 0. */
export const fac = (p: number, variable = "x") => (p === 0 ? variable : `(${bare(p, variable)})`);

/** LimitValue is a finite limit, ∞, −∞, or a limit that does not exist. */
export type LimitValue = Q | "inf" | "-inf" | "dne";

/** limitText writes a limit value as an option. */
export function limitText(v: LimitValue): Text {
  if (v === "inf") return same("$\\infty$");
  if (v === "-inf") return same("$-\\infty$");
  if (v === "dne") return t("The limit does not exist.", "极限不存在。");
  return same(`$${v.toLatex()}$`);
}

/** limitLatex writes a limit value inside math: a number, \infty or -\infty ("does not exist" has no formula). */
export const limitLatex = (v: Exclude<LimitValue, "dne">) => (v === "inf" ? "\\infty" : v === "-inf" ? "-\\infty" : v.toLatex());

/**
 * limitChoice asks for a limit as a choice among the right value and wrong
 * ones; the options always include ∞ and −∞ (and "does not exist" when
 * dne is set), so their presence gives nothing away.
 */
export function limitChoice(
  rng: Rng,
  prompt: Text,
  right: LimitValue,
  wrong: readonly LimitValue[],
  solution: Text,
  figure?: Figure,
  dne = false,
): Problem {
  const key = (v: LimitValue) => (v instanceof Q ? v.toString() : v);
  const pool: LimitValue[] = [...wrong, "inf", "-inf", ...(dne ? (["dne"] as const) : [])];
  const seen = new Set([key(right)]);
  const rest: LimitValue[] = [];
  for (const w of pool) {
    if (!seen.has(key(w))) {
      seen.add(key(w));
      rest.push(w);
    }
  }
  // Keep the symbolic options and fill the rest with the first wrong numbers.
  const symbolic = rest.filter((v) => !(v instanceof Q));
  const numeric = rest.filter((v) => v instanceof Q);
  const chosen = [...numeric.slice(0, Math.max(1, 3 - symbolic.length)), ...symbolic].slice(0, dne ? 4 : 3);
  const options = [right, ...chosen];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({
    prompt,
    options: order.map((i) => limitText(options[i]!)),
    correct: order.indexOf(0),
    solution,
  });
  return figure ? { ...problem, figure } : problem;
}

/** rounded rounds a value to the given number of decimal places, or is undefined when it lies too close to a rounding boundary. */
export function rounded(value: number, places: number): Q | undefined {
  const scaled = Math.abs(value) * 10 ** places;
  if (!Number.isFinite(scaled) || Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.02) return undefined;
  return Q.of(Math.round(value * 10 ** places), 10 ** places);
}

/** Exact is an exact trigonometric value c√m, with m 1, 2 or 3. */
export interface Exact {
  readonly c: Q;
  readonly m: number;
}

/** exactLatex writes an exact value in simplest radical form. */
export const exactLatex = (e: Exact) => radical(e.c, e.m);

/** exactNumber is the value of an exact value in floating point. */
export const exactNumber = (e: Exact) => e.c.toNumber() * Math.sqrt(e.m);

/** exactMul multiplies an exact value by a rational number. */
export const exactMul = (e: Exact, k: Q): Exact => (k.isZero() ? { c: Q.zero, m: 1 } : { c: e.c.mul(k), m: e.m });

/** exactDiv divides two exact values; b must not be zero. */
export function exactDiv(a: Exact, b: Exact): Exact {
  // (c₁√m₁)/(c₂√m₂) = c₁/(c₂m₂) · √(m₁m₂)
  let c = a.c.div(b.c.mul(Q.of(b.m)));
  let m = a.m * b.m;
  if (m === 4 || m === 9) {
    c = c.mul(Q.of(Math.sqrt(m)));
    m = 1;
  }
  return c.isZero() ? { c, m: 1 } : { c, m };
}

/** piLatex writes the multiple n/d of π: "\\frac{\\pi}{6}", "-\\frac{3\\pi}{4}", "2\\pi", "0". */
export function piLatex(n: number, d = 1): string {
  if (n === 0) return "0";
  const g = gcd(Math.abs(n), d);
  const [p, q] = [n / g, d / g];
  const sign = p < 0 ? "-" : "";
  const k = Math.abs(p);
  const top = k === 1 ? "\\pi" : `${k}\\pi`;
  return q === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${q}}`;
}

/** SpecialAngle is a multiple of π/6 or π/4, whose sine and cosine have exact values. */
export interface SpecialAngle {
  /** n and d give the angle nπ/d in lowest terms. */
  readonly n: number;
  readonly d: number;
  /** latex is the angle in radians, such as "\\frac{\\pi}{6}". */
  readonly latex: string;
  readonly value: number;
  readonly sin: Exact;
  readonly cos: Exact;
}

function exactOf(v: number): Exact {
  const s = v < 0 ? -1 : 1;
  const a = Math.abs(v);
  const near = (x: number) => Math.abs(a - x) < 1e-9;
  if (near(0)) return { c: Q.zero, m: 1 };
  if (near(0.5)) return { c: Q.of(s, 2), m: 1 };
  if (near(1)) return { c: Q.of(s), m: 1 };
  if (near(Math.SQRT2 / 2)) return { c: Q.of(s, 2), m: 2 };
  if (near(Math.sqrt(3) / 2)) return { c: Q.of(s, 2), m: 3 };
  throw new RangeError(`no exact value for ${v}`);
}

/** specialAngles are the multiples of π/6 and π/4 from −π to 2π, in increasing order. */
export const specialAngles: readonly SpecialAngle[] = (() => {
  const out: SpecialAngle[] = [];
  const seen = new Set<string>();
  for (const den of [1, 2, 3, 4, 6]) {
    for (let k = -den; k <= 2 * den; k++) {
      const g = gcd(Math.abs(k), den);
      const n = k / g;
      const d = k === 0 ? 1 : den / g;
      if (seen.has(`${n}/${d}`)) continue;
      seen.add(`${n}/${d}`);
      const value = (n * Math.PI) / d;
      out.push({ n, d, latex: piLatex(n, d), value, sin: exactOf(Math.sin(value)), cos: exactOf(Math.cos(value)) });
    }
  }
  return out.sort((x, y) => x.value - y.value);
})();

/** table writes a Markdown table with a header row and further rows. */
export function table(head: readonly string[], ...rows: readonly (readonly string[])[]): string {
  const line = (r: readonly string[]) => `| ${r.join(" | ")} |`;
  return [line(head), `|${head.map(() => " :---: |").join("")}`, ...rows.map(line)].join("\n");
}

/** gcd is the greatest common divisor of two non-negative integers. */
export function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

/** sqrtLatex writes √n in simplest radical form: sqrtLatex(63) is "3\\sqrt{7}", sqrtLatex(16) is "4". */
export function sqrtLatex(n: number): string {
  let out = 1;
  let rest = n;
  for (let f = 2; f * f <= rest; f++) {
    while (rest % (f * f) === 0) {
      rest /= f * f;
      out *= f;
    }
  }
  if (rest === 1) return String(out);
  return `${out === 1 ? "" : out}\\sqrt{${rest}}`;
}

/** Poly is a polynomial by its coefficients, the constant term first. */
export type Poly = readonly number[];

/** power writes x^n: "", "x", "x^{3}". */
export const power = (n: number, v = "x") => (n === 0 ? "" : n === 1 ? v : `${v}^{${n}}`);

/** pLatex writes a polynomial from its highest power down. */
export const pLatex = (p: Poly, v = "x") => poly(...p.map((c, i) => [c, power(i, v)] as const).reverse());

/** pAt evaluates a polynomial. */
export const pAt = (p: Poly, x: number) => p.reduce((s, c, i) => s + c * x ** i, 0);

/** pDer is the derivative of a polynomial. */
export const pDer = (p: Poly): Poly => (p.length <= 1 ? [0] : p.slice(1).map((c, i) => c * (i + 1)));

/** fracL writes k/den with the sign in front: "\\frac{3}{x}", "-\\frac{3}{x}". */
export const fracL = (k: number, den: string) => `${k < 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${den}}`;

/** sumLatex writes terms added together, as the learner reads them; empty terms are skipped. */
export const sumLatex = (terms: readonly string[]) =>
  terms
    .filter((x) => x !== "" && x !== "0")
    .reduce((s, x, i) => (i === 0 ? x : x.startsWith("-") ? `${s} - ${x.slice(1)}` : `${s} + ${x}`), "") || "0";

/** cdot writes k times a term that starts with a digit: "3^{x}", "-3^{x}", "2 \\cdot 3^{x}". */
export const cdot = (k: number, x: string) => (k === 1 ? x : k === -1 ? `-${x}` : `${k} \\cdot ${x}`);

/** par wraps a negative number in parentheses. */
export const par = (n: number | Q) => {
  const q = n instanceof Q ? n : Q.of(n);
  return q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex();
};
