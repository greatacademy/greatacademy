import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  gcd,
  type Interval,
  intervalLatex,
  lcm,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
  simplifyRadical,
  surd,
  surdLatex,
  union,
} from "@ga/subject-math";
import { precalculusDrawings } from "../explanation-drawings-precalculus.ts";
import { remainingDrawings5 } from "../explanation-drawings-remaining-5.ts";
import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus 2.4–2.5: rational expressions, equations and functions.

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** other picks an integer from lo to hi that is not in avoid. */
const other = (rng: Rng, lo: number, hi: number, avoid: readonly number[]) => rng.pick(range(lo, hi).filter((v) => !avoid.includes(v)));

/** sgn writes the operator between two terms for a signed second term: "+" or "-". */
const sgn = (c: number) => (c < 0 ? "-" : "+");

/** plus writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
const plus = (k: number) => (k === 0 ? "" : k < 0 ? ` - ${-k}` : ` + ${k}`);

// Polynomials with integer coefficients, lowest degree first.

/** P is a polynomial c₀ + c₁x + c₂x² + …. */
type P = readonly number[];

const mulP = (a: P, b: P): number[] => {
  const out: number[] = Array.from({ length: a.length + b.length - 1 }, () => 0);
  a.forEach((x, i) => {
    b.forEach((y, j) => {
      out[i + j]! += x * y;
    });
  });
  return out;
};
const addP = (a: P, b: P): number[] => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] ?? 0) + (b[i] ?? 0));
const scaleP = (a: P, k: number): number[] => a.map((c) => c * k);
const subP = (a: P, b: P): number[] => addP(a, scaleP(b, -1));

/** fromRoots is lead·∏(x − r). */
const fromRoots = (rs: readonly number[], lead = 1): number[] => rs.reduce<number[]>((p, r) => mulP(p, [-r, 1]), [lead]);

/** deg is the degree of a nonzero polynomial. */
function deg(p: P): number {
  let d = p.length - 1;
  while (d > 0 && p[d] === 0) d--;
  return d;
}

const termOf = (i: number) => (i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`);

/** pl writes a polynomial in standard form: "2x^{2} - x + 3". */
const pl = (p: P) =>
  poly(
    ...p
      .slice(0, deg(p) + 1)
      .map((c, i) => [c, termOf(i)] as const)
      .reverse(),
  );

/** plAsc writes a polynomial with the constant term first: "3 - x + 2x^{2}". */
const plAsc = (p: P) => poly(...p.slice(0, deg(p) + 1).map((c, i) => [c, termOf(i)] as const));

/** at is p(x) for a number x. */
const at = (p: P, x: number) => p.reduce((s, c, i) => s + c * x ** i, 0);

/** synth divides p by x − s: the quotient and the remainder. */
function synth(p: P, s: number): [number[], number] {
  const out: number[] = [];
  let acc = 0;
  for (const c of [...p.slice(0, deg(p) + 1)].reverse()) {
    acc = acc * s + c;
    out.push(acc);
  }
  const rem = out.pop()!;
  return [out.reverse(), rem];
}

/** randomPoly draws a polynomial of degree d with a few nonzero terms. */
function randomPoly(rng: Rng, d: number, leadMax = 5): number[] {
  const p = range(0, d).map(() => (rng.bool(0.6) ? rng.nonZero(-9, 9) : 0));
  p[d] = rng.nonZero(-leadMax, leadMax);
  if (d > 0 && p.slice(0, d).every((c) => c === 0)) p[0] = rng.nonZero(-9, 9);
  return p;
}

// Factors.

/** bare writes x − r without parentheses: "x", "x - 3", "x + 2". */
const bare = (r: number) => linear(1, -r);

/** fac writes the factor x − r for a product: "x", "(x - 3)". */
const fac = (r: number) => (r === 0 ? "x" : `(${bare(r)})`);

/** facPow writes (x − r)^m: "(x - 2)^{2}", "x^{3}". */
const facPow = (r: number, m: number) => (m === 1 ? fac(r) : `${fac(r)}^{${m}}`);

/** Factor is a root with its multiplicity. */
type Factor = readonly [root: number, mult: number];

/** prodL writes lead·∏(x − r)^m with a factor x first, without parentheses around a single factor: "x - 3", "2x(x + 1)", "-(x - 2)^{2}". */
function prodL(fs: readonly Factor[], lead = 1): string {
  if (fs.length === 0) return String(lead);
  const order = [...fs.filter(([r]) => r === 0), ...fs.filter(([r]) => r !== 0)];
  const single = order.length === 1 && order[0]![1] === 1 && lead === 1;
  const body = single ? bare(order[0]![0]) : order.map(([r, m]) => facPow(r, m)).join("");
  return lead === 1 ? body : lead === -1 ? `-${body}` : `${lead}${body}`;
}

/** simple turns roots into factors of multiplicity 1. */
const simple = (rs: readonly number[]): Factor[] => rs.map((r) => [r, 1]);

/** coefFac writes c(x − r): "(x - 3)", "-(x + 1)", "3(x - 2)", "3x". */
const coefFac = (c: number, r: number) => (c === 1 ? fac(r) : c === -1 ? `-${fac(r)}` : `${c}${fac(r)}`);

/** front writes a coefficient in front of a factor: "", "-", "2", "\frac{1}{2}". */
function front(a: Q | number): string {
  const v = a instanceof Q ? a : Q.of(a);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return v.toLatex();
}

/** frac writes a fraction. */
const frac = (top: string, bottom: string) => `\\frac{${top}}{${bottom}}`;

/** sfrac writes c over a denominator with the sign in front: "\frac{3}{x - 2}", "-\frac{3}{x - 2}". */
const sfrac = (c: number, den: string) => (c < 0 ? `-${frac(String(-c), den)}` : frac(String(c), den));

/** then writes a signed fraction after a first term: "A + \frac{3}{x}", "A - \frac{3}{x}". */
const then = (first: string, c: number, den: string) => `${first} ${sgn(c)} ${frac(String(Math.abs(c)), den)}`;

/** values writes numbers for a solution set. */
const values = (xs: readonly (number | Q)[]) => xs.map((x) => num(x));

/** listText writes numbers as inline math joined by commas. */
const listText = (xs: readonly (number | Q)[], sep = ", ") => xs.map((x) => `$${num(x)}$`).join(sep);

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled, with reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** Step is one labelled step of a solution: its title, what it says, and display lines. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** lead1 writes the single term c·x^k: "3x^{2}", "-x", "5". */
const lead1 = (c: number, k: number) => pl([...Array.from({ length: k }, () => 0), c]);

// Sets of real numbers.

/** except is the set of all real numbers except the given ones. */
function except(...pts: readonly Q[]): RealSet {
  const xs = pts.filter((p, i) => pts.findIndex((o) => o.eq(p)) === i).sort((a, b) => a.cmp(b));
  const parts: Interval[] = [];
  for (let i = 0; i <= xs.length; i++)
    parts.push({ ...(i > 0 && { lo: xs[i - 1]! }), ...(i < xs.length && { hi: xs[i]! }), loClosed: false, hiClosed: false });
  return union(...parts);
}

/** exceptN is except for integers. */
const exceptN = (...pts: readonly number[]) => except(...pts.map((p) => Q.of(p)));

/** signSet is the union of the open intervals between the critical points where f has the given sign. */
function signSet(f: (x: number) => number, crit: readonly number[], positive: boolean): RealSet {
  const xs = [...new Set(crit)].sort((a, b) => a - b);
  const parts: Interval[] = [];
  for (let i = 0; i <= xs.length; i++) {
    const lo = xs[i - 1];
    const hi = xs[i];
    const x = lo === undefined ? hi! - 1 : hi === undefined ? lo + 1 : (lo + hi) / 2;
    const s = Math.sign(f(x));
    if (positive ? s > 0 : s < 0)
      parts.push({
        ...(lo !== undefined && { lo: Q.of(lo) }),
        ...(hi !== undefined && { hi: Q.of(hi) }),
        loClosed: false,
        hiClosed: false,
      });
  }
  return union(...parts);
}

/** signChart writes the sign of f on each interval between the critical points. */
function signChart(f: (x: number) => number, crit: readonly number[]): string {
  const xs = [...new Set(crit)].sort((a, b) => a - b);
  const cells: string[] = [];
  for (let i = 0; i <= xs.length; i++) {
    const lo = xs[i - 1];
    const hi = xs[i];
    const x = lo === undefined ? hi! - 1 : hi === undefined ? lo + 1 : (lo + hi) / 2;
    cells.push(`${lo === undefined ? "(-\\infty" : `(${lo}`}, ${hi === undefined ? "\\infty)" : `${hi})`}: ${f(x) > 0 ? "+" : "-"}`);
  }
  return cells.join(", \\quad ");
}

// Limits.

const infL = (s: number) => (s > 0 ? "\\infty" : "-\\infty");

/** limitOptions are the answers of an infinite limit: ∞, −∞, or no limit. */
const limitOptions: readonly Text[] = [same("$\\infty$"), same("$-\\infty$"), t("The limit does not exist.", "极限不存在。")];

/** limitIndex is the option for the signs of f just left and just right of a point (for a one-sided limit, pass the same sign twice). */
const limitIndex = (left: number, right: number) => (left !== right ? 2 : left > 0 ? 0 : 1);

/** nearSign is the sign of f just to one side of a, found numerically from a closed form whose factors are integers. */
const nearSign = (f: (x: number) => number, a: number, side: 1 | -1) => Math.sign(f(a + side * 1e-6));

/** sideWord describes x − a just to one side of a. */
const sideWord = (side: 1 | -1): Text =>
  side > 0 ? t("a tiny positive number", "很小的正数") : t("a tiny negative number", "绝对值很小的负数");

/** limitReasons says what is wrong with each wrong limit option, from the signs of f just left and just right of the point. */
function limitReasons(left: number, right: number, oneSided: boolean): Reason[] {
  if (left === right) {
    const [en, zh] = left > 0 ? ["positive", "正"] : ["negative", "负"];
    return [
      why(
        limitOptions[left > 0 ? 1 : 0]!,
        `The sign is wrong: the fraction is ${en} ${oneSided ? "on this side of" : "on both sides of"} the asymptote, so it goes to $${infL(left)}$.`,
        `符号错了：分式在渐近线${oneSided ? "这一侧" : "两侧都"}为${zh}，所以趋于 $${infL(left)}$。`,
      ),
      why(
        limitOptions[2]!,
        oneSided
          ? `A one-sided limit looks at one side only, and there the fraction is ${en} and grows without bound: the limit is $${infL(left)}$.`
          : `Both sides go to $${infL(left)}$, so the two-sided limit is $${infL(left)}$.`,
        oneSided
          ? `单侧极限只看一侧，而这一侧分式为${zh}且无界增大：极限是 $${infL(left)}$。`
          : `两侧都趋于 $${infL(left)}$，所以双侧极限是 $${infL(left)}$。`,
      ),
    ];
  }
  const side = (s: number): [string, string] => (left === s ? ["left", "左"] : ["right", "右"]);
  return [1, -1].map((s) =>
    why(
      limitOptions[s > 0 ? 0 : 1]!,
      `Only the ${side(s)[0]} side goes to $${infL(s)}$; the ${side(-s)[0]} side goes to $${infL(-s)}$, so the two-sided limit does not exist.`,
      `只有${side(s)[1]}侧趋于 $${infL(s)}$；${side(-s)[1]}侧趋于 $${infL(-s)}$，所以双侧极限不存在。`,
    ),
  );
}

/** sideCheck evaluates f a distance d to the given sides of a. */
function sideCheck(f: (x: number) => number, a: number, sides: readonly (1 | -1)[], d: number): Text {
  const lines = sides.map((side) => Number((a + side * d).toFixed(2))).map((x) => `f(${x}) \\approx ${approx(f(x))}`);
  return t(
    `Try ${sides.length > 1 ? "values" : "a value"} close to $${a}$:${steps(...lines)}The sign${sides.length > 1 ? "s match" : " matches"}, and $|f(x)|$ grows as $x$ gets closer to $${a}$.`,
    `取接近 $${a}$ 的值：${steps(...lines)}符号一致，且 $x$ 越接近 $${a}$，$|f(x)|$ 越大。`,
  );
}

// Graphs.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** Drawing is the graph of a rational function: its formula, asymptotes, holes and marked points. */
interface Drawing {
  readonly f: (x: number) => number;
  readonly vas: readonly number[];
  readonly ha: number;
  readonly holes?: readonly Point[];
  readonly dots?: readonly Point[];
}

/** drawSvg draws a rational function with its asymptotes dashed (unless they are axes), holes open and points filled. */
function drawSvg(d: Drawing): string {
  const marks: PlaneMark[] = [];
  for (const v of d.vas) if (v !== 0) marks.push({ kind: "line", a: [v, 0], b: [v, 1], dashed: true });
  if (d.ha !== 0) marks.push({ kind: "line", a: [0, d.ha], b: [1, d.ha], dashed: true });
  const cuts: [number, number][] = [
    ...d.vas.map((v): [number, number] => [v - 1e-6, v + 1e-6]),
    ...(d.holes ?? []).map(([h]): [number, number] => [h - 0.16, h + 0.16]),
  ].sort((p, q) => p[0] - q[0]);
  let lo = view.xMin;
  for (const [a, b] of cuts) {
    marks.push({ kind: "curve", f: d.f, from: lo, to: a, accent: true });
    lo = b;
  }
  marks.push({ kind: "curve", f: d.f, from: lo, accent: true });
  for (const h of d.holes ?? []) marks.push({ kind: "point", at: h, open: true, accent: true });
  for (const p of d.dots ?? []) marks.push({ kind: "point", at: p });
  return plane(view, marks);
}

/** describe writes alt text for a drawing. */
function describe(d: Drawing): Text {
  const vas = [...d.vas].sort((a, b) => a - b);
  const vEn =
    vas.length === 0
      ? "no vertical asymptote"
      : `vertical asymptote${vas.length > 1 ? "s" : ""} ${vas.map((v) => `x = ${v}`).join(" and ")}`;
  const vZh = vas.length === 0 ? "没有竖直渐近线" : `竖直渐近线 ${vas.map((v) => `x = ${v}`).join(" 和 ")}`;
  const holes = (d.holes ?? []).map(([x]) => `x = ${x}`);
  const dots = (d.dots ?? []).map(([x, y]) => `(${x}, ${y})`);
  return t(
    `The graph of a rational function with ${vEn} and horizontal asymptote y = ${d.ha}, drawn dashed.${holes.length ? ` It has an open circle (a hole) at ${holes.join(", ")}.` : ""}${dots.length ? ` Marked points: ${dots.join(", ")}.` : ""}`,
    `一个分式函数的图象，${vZh}，水平渐近线 y = ${d.ha}，渐近线画成虚线。${holes.length ? `在 ${holes.join("、")} 处有一个空心圆圈（空洞）。` : ""}${dots.length ? `标出的点：${dots.join("、")}。` : ""}`,
  );
}

/** figureOf draws a drawing with its alt text. */
const figureOf = (d: Drawing): Figure => ({ svg: drawSvg(d), alt: describe(d) });

const letters = ["A", "B", "C", "D"] as const;

/** panels draws four graphs labeled A to D in a two-by-two grid. */
function panels(ds: readonly Drawing[]): Figure {
  const svgs = ds.map(drawSvg);
  const [, w = "314", h = "304"] = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svgs[0]!) ?? [];
  const [W, H] = [Number(w), Number(h)];
  const top = 22;
  let body = "";
  svgs.forEach((svg, i) => {
    const x = (i % 2) * W;
    const y = Math.floor(i / 2) * (H + top);
    body += `<text x="${x + 16}" y="${y + 18}" font-size="16" font-weight="bold" stroke="none" fill="currentColor">${letters[i]}</text>`;
    body += svg.replace('xmlns="http://www.w3.org/2000/svg" ', `x="${x}" y="${y + top}" width="${W}" height="${H}" `);
  });
  const alts = ds.map(describe);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2 * W} ${2 * (H + top)}" fill="none" stroke="currentColor" stroke-width="1.2" font-size="12" text-anchor="middle">${body}</svg>`,
    alt: t(
      `Four graphs labeled A to D. ${alts.map((a, i) => `${letters[i]}: ${a.en}`).join(" ")}`,
      `标为 A 到 D 的四个图象。${alts.map((a, i) => `${letters[i]}：${a["zh-CN"]}`).join("")}`,
    ),
  };
}

const letterOptions: readonly Text[] = letters.map((l) => same(l));

// ─── 2.4.1 Closure properties of polynomials ────────────────────────────────

/** closurePropertiesOfPolynomials shows that sums, differences and products of polynomials are polynomials, while quotients need not be. */
export const closurePropertiesOfPolynomials: TopicDef = {
  id: "closure-properties-of-polynomials",
  title: t("Closure Properties of Polynomials", "多项式的封闭性"),
  summary: t(
    "Polynomials are closed under addition, subtraction and multiplication but not under division; find the degree and the form of the results.",
    "多项式对加法、减法和乘法封闭，但对除法不封闭；求运算结果的次数和形式。",
  ),
  prerequisites: ["dividing-polynomials-using-long-division", "the-remainder-theorem", "adding-and-subtracting-polynomials"],
  encompasses: [
    { topic: "multiplying-polynomials", weight: 0.4 },
    { topic: "adding-and-subtracting-polynomials", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `Take $p(x) = x^{2} + 1$ and $q(x) = x - 3$. Their sum $x^{2} + x - 2$ and their product $x^{3} - 3x^{2} + x - 3$ are polynomials again. Their quotient is not:

$$\\frac{x^{2} + 1}{x - 3} = x + 3 + \\frac{10}{x - 3}$$

Check: dividing by $x - 3$ leaves the remainder $p(3) = 3^{2} + 1 = 10$, which is not $0$, so a fraction is left over.

In this lesson we see which operations on polynomials always give polynomials, find the degree of a sum or product, and compute sums, differences and products.`,
    `取 $p(x) = x^{2} + 1$，$q(x) = x - 3$。它们的和 $x^{2} + x - 2$、积 $x^{3} - 3x^{2} + x - 3$ 仍是多项式。它们的商却不是：

$$\\frac{x^{2} + 1}{x - 3} = x + 3 + \\frac{10}{x - 3}$$

检验：除以 $x - 3$ 的余数是 $p(3) = 3^{2} + 1 = 10$，不为 $0$，所以剩下一个分式。

这节课我们看哪些多项式运算的结果总是多项式，求和与积的次数，并计算和、差、积。`,
  ),
  knowledgePoints: [
    {
      id: "which-operations-give-polynomials",
      title: t("Which operations give polynomials", "哪些运算得到多项式"),
      explanation: t(
        "A set is **closed** under an operation when combining two of its members always gives a member of the set. Adding, subtracting or multiplying two polynomials always gives a polynomial: like terms combine, and multiplying powers of $x$ adds whole-number exponents. So polynomials are closed under addition, subtraction and multiplication.\n\nThey are **not** closed under division. Dividing by $x - s$ leaves the remainder $p(s)$:\n\n- $\\frac{x^{2} - 4}{x - 2} = x + 2$, a polynomial, because the remainder $2^{2} - 4$ is $0$;\n- $\\frac{x^{2} + 1}{x - 2} = x + 2 + \\frac{5}{x - 2}$, not a polynomial, because the remainder is $2^{2} + 1 = 5$.\n\nSo $p(x) \\div (x - s)$ is a polynomial exactly when $p(s) = 0$.\n\nFor $p(x) = x^{2} - x - 6$ and $q(x) = x - 3$: $p(3) = 9 - 3 - 6 = 0$, so $p(x) \\div q(x) = x + 2$ is a polynomial. Check: $(x - 3)(x + 2) = x^{2} - x - 6$.\n\n> **Watch out.** For $x - s$ substitute $s$, not $-s$: the remainder of dividing by $x - 3$ is $p(3)$. Only division needs this test; a sum, difference or product of polynomials is always a polynomial.",
        "如果一个集合中任意两个成员经过某种运算后结果仍在这个集合中，就说这个集合对该运算**封闭**。两个多项式相加、相减或相乘，结果总是多项式：同类项可以合并，$x$ 的幂相乘时指数（整数）相加。所以多项式对加法、减法和乘法封闭。\n\n多项式对除法**不**封闭。除以 $x - s$ 时余数是 $p(s)$：\n\n- $\\frac{x^{2} - 4}{x - 2} = x + 2$ 是多项式，因为余数 $2^{2} - 4 = 0$；\n- $\\frac{x^{2} + 1}{x - 2} = x + 2 + \\frac{5}{x - 2}$ 不是多项式，因为余数是 $2^{2} + 1 = 5$。\n\n所以 $p(x) \\div (x - s)$ 是多项式，当且仅当 $p(s) = 0$。\n\n对 $p(x) = x^{2} - x - 6$ 和 $q(x) = x - 3$：$p(3) = 9 - 3 - 6 = 0$，所以 $p(x) \\div q(x) = x + 2$ 是多项式。检验：$(x - 3)(x + 2) = x^{2} - x - 6$。\n\n> **注意。** 对 $x - s$ 要代入 $s$ 而不是 $-s$：除以 $x - 3$ 的余数是 $p(3)$。只有除法需要这样检验；多项式的和、差、积总是多项式。",
      ),
      keyPrerequisites: ["the-remainder-theorem"],
      generate(rng) {
        const closed = rng.bool();
        const op = closed ? rng.pick(["+", "-", "\\cdot", "\\div"] as const) : ("\\div" as const);
        const s = rng.nonZero(-6, 6);
        const q: P = [-s, 1];
        const exact = op === "\\div" && closed;
        const quad = () => [rng.int(-9, 9), rng.int(-9, 9), rng.nonZero(-3, 3)];
        let p = exact ? mulP(q, [rng.nonZero(-7, 7), rng.nonZero(-3, 3)]) : quad();
        while (op === "\\div" && !exact && at(p, s) === 0) p = quad();
        const yes = !(op === "\\div" && !exact);
        const prompt = t(
          `Let $p(x) = ${pl(p)}$ and $q(x) = ${pl(q)}$. Is $p(x) ${op} q(x)$ a polynomial?`,
          `设 $p(x) = ${pl(p)}$，$q(x) = ${pl(q)}$。$p(x) ${op} q(x)$ 是多项式吗？`,
        );
        let solution: Text;
        if (op !== "\\div") {
          const r = op === "+" ? addP(p, q) : op === "-" ? subP(p, q) : mulP(p, q);
          const [en, zh] = op === "+" ? ["addition", "加法"] : op === "-" ? ["subtraction", "减法"] : ["multiplication", "乘法"];
          solution = walked(
            [
              [
                ["Name the operation", "看运算"],
                t(
                  `Polynomials are closed under ${en}, so $p(x) ${op} q(x)$ is a polynomial: yes.`,
                  `多项式对${zh}封闭，所以 $p(x) ${op} q(x)$ 是多项式：是。`,
                ),
              ],
              [["Compute it", "算出结果"], t("Work it out:", "算出来："), [`p(x) ${op} q(x) = ${pl(r)}`]],
            ],
            t(
              `At $x = 1$: $${at(p, 1)} ${op} ${paren(at(q, 1))} = ${at(r, 1)}$, the value of $${pl(r)}$ at $x = 1$.`,
              `取 $x = 1$：$${at(p, 1)} ${op} ${paren(at(q, 1))} = ${at(r, 1)}$，正是 $${pl(r)}$ 在 $x = 1$ 处的值。`,
            ),
          );
        } else {
          const [quot, rem] = synth(p, s);
          solution = exact
            ? walked(
                [
                  [
                    ["Find the remainder", "求余数"],
                    t(`The remainder of dividing by $${bare(s)}$ is $p(${s}) = 0$.`, `除以 $${bare(s)}$ 的余数是 $p(${s}) = 0$。`),
                  ],
                  [
                    ["Divide", "做除法"],
                    t(`So $${bare(s)}$ is a factor, and the quotient is a polynomial: yes.`, `所以 $${bare(s)}$ 是因式，商是多项式：是。`),
                    [`p(x) = (${bare(s)})(${pl(quot)}), \\quad p(x) \\div q(x) = ${pl(quot)}`],
                  ],
                ],
                t(
                  `The constant terms agree: $${paren(-s)} \\cdot ${paren(quot[0]!)} = ${p[0]}$, the constant term of $p(x)$.`,
                  `常数项相符：$${paren(-s)} \\cdot ${paren(quot[0]!)} = ${p[0]}$，正是 $p(x)$ 的常数项。`,
                ),
              )
            : walked(
                [
                  [
                    ["Find the remainder", "求余数"],
                    t(
                      `The remainder of dividing by $${bare(s)}$ is $p(${s}) = ${rem}$, which is not $0$.`,
                      `除以 $${bare(s)}$ 的余数是 $p(${s}) = ${rem}$，不为 $0$。`,
                    ),
                  ],
                  [
                    ["Divide", "做除法"],
                    t("A fraction is left over, so the quotient is not a polynomial: no.", "剩下一个分式，所以商不是多项式：不是。"),
                    [`\\frac{p(x)}{q(x)} = ${pl(quot)} ${then("", rem, bare(s)).trim()}`],
                  ],
                ],
                t(
                  `Multiply back at $x = 0$: $${paren(-s)} \\cdot ${paren(quot[0]!)} + ${paren(rem)} = ${p[0]}$, the constant term of $p(x)$.`,
                  `在 $x = 0$ 处乘回去：$${paren(-s)} \\cdot ${paren(quot[0]!)} + ${paren(rem)} = ${p[0]}$，正是 $p(x)$ 的常数项。`,
                ),
              );
        }
        const reasons: Reason[] = yes
          ? [
              why(
                yesNo[1]!,
                op === "\\div"
                  ? `The remainder $p(${s})$ is $0$, so nothing is left over and the quotient is a polynomial.`
                  : "A sum, difference or product of polynomials is always a polynomial.",
                op === "\\div" ? `余数 $p(${s})$ 是 $0$，没有剩余，商是多项式。` : "多项式的和、差、积总是多项式。",
              ),
            ]
          : [
              why(
                yesNo[0]!,
                `The remainder $p(${s})$ is not $0$, so a fraction is left over; only an exact division gives a polynomial.`,
                `余数 $p(${s})$ 不为 $0$，剩下一个分式；只有整除才得到多项式。`,
              ),
            ];
        return reasoned(choiceProblem({ prompt, options: yesNo, correct: yes ? 0 : 1, solution }), reasons);
      },
    },
    {
      id: "degrees-of-sums-and-products",
      title: t("Degrees of sums and products", "和与积的次数"),
      explanation: t(
        "When two polynomials are multiplied, their leading terms multiply, so the degrees **add**: a degree-$3$ polynomial times a degree-$2$ polynomial has degree $5$.\n\nWhen they are added or subtracted, the degree is **at most** the larger degree. It is smaller when the leading terms cancel:\n\n$$(3x^{3} + x - 1) + (-3x^{3} + 2x^{2} + 4) = 2x^{2} + x + 3,$$\n\nwhich has degree $2$, not $3$. Always check whether the leading terms cancel.\n\nFor $p(x) = x^{2} + 4x$ and $q(x) = 2x^{3} - 1$, $p(x)q(x)$ has degree $2 + 3 = 5$, while $p(x) - (x^{2} - 1) = 4x + 1$ has degree $1$. Check: the leading terms of the product give $x^{2} \\cdot 2x^{3} = 2x^{5}$, and in the difference $x^{2} - x^{2} = 0$.\n\n> **Watch out.** Degrees add under multiplication; they do not multiply. A degree-$2$ times a degree-$3$ polynomial has degree $5$, not $6$.",
        "两个多项式相乘时，首项相乘，所以次数**相加**：三次多项式乘以二次多项式得到五次多项式。\n\n两个多项式相加或相减时，次数**不超过**较大的次数。如果首项抵消，次数会更小：\n\n$$(3x^{3} + x - 1) + (-3x^{3} + 2x^{2} + 4) = 2x^{2} + x + 3,$$\n\n它的次数是 $2$ 而不是 $3$。一定要检查首项是否抵消。\n\n对 $p(x) = x^{2} + 4x$ 和 $q(x) = 2x^{3} - 1$，$p(x)q(x)$ 的次数是 $2 + 3 = 5$；而 $p(x) - (x^{2} - 1) = 4x + 1$ 的次数是 $1$。检验：积的首项是 $x^{2} \\cdot 2x^{3} = 2x^{5}$，差中 $x^{2} - x^{2} = 0$。\n\n> **注意。** 相乘时次数相加，而不是相乘。二次多项式乘三次多项式是五次，不是六次。",
      ),
      generate(rng) {
        for (;;) {
          const kind = rng.pick(["product", "sum", "difference"] as const);
          const m = rng.int(1, 4);
          const p = randomPoly(rng, m);
          let q: number[];
          const cancel = kind !== "product" && rng.bool(0.6);
          if (cancel) {
            q = randomPoly(rng, m);
            q[m] = kind === "sum" ? -p[m]! : p[m]!;
          } else q = randomPoly(rng, rng.int(1, 4));
          const r = kind === "product" ? mulP(p, q) : kind === "sum" ? addP(p, q) : subP(p, q);
          if (r.every((c) => c === 0)) continue;
          const n = deg(q);
          const d = deg(r);
          const op = kind === "product" ? "" : kind === "sum" ? " + " : " - ";
          const expr = kind === "product" ? "p(x)q(x)" : `p(x)${op}q(x)`;
          return numberProblem({
            prompt: t(
              `Let $p(x) = ${pl(p)}$ and $q(x) = ${pl(q)}$. What is the degree of $${expr}$?`,
              `设 $p(x) = ${pl(p)}$，$q(x) = ${pl(q)}$。$${expr}$ 的次数是多少？`,
            ),
            answer: d,
            wrong: [m + n, Math.max(m, n), m * n],
            solution:
              kind === "product"
                ? walked(
                    [
                      [
                        ["Read the degrees", "读出次数"],
                        t(`$p$ has degree $${m}$ and $q$ has degree $${n}$.`, `$p$ 是 $${m}$ 次，$q$ 是 $${n}$ 次。`),
                      ],
                      [
                        ["Add the degrees", "次数相加"],
                        t(
                          `The leading terms multiply, so the degrees add: $${m} + ${n} = ${d}$.`,
                          `首项相乘，所以次数相加：$${m} + ${n} = ${d}$。`,
                        ),
                      ],
                    ],
                    t(
                      `The leading term of the product is $(${lead1(p[m]!, m)})(${lead1(q[n]!, n)}) = ${lead1(p[m]! * q[n]!, d)}$, which is not $0$.`,
                      `积的首项是 $(${lead1(p[m]!, m)})(${lead1(q[n]!, n)}) = ${lead1(p[m]! * q[n]!, d)}$，不为 $0$。`,
                    ),
                  )
                : walked(
                    [
                      [
                        ["Combine like terms", "合并同类项"],
                        t("Collect each power of $x$:", "把 $x$ 的各次幂分别合并："),
                        [`${expr} = ${pl(r)}`],
                      ],
                      [
                        ["Read the degree", "读出次数"],
                        t(
                          `${d < Math.max(m, n) ? "The leading terms cancel, so the degree" : "The highest power left"} is $${d}$.`,
                          `${d < Math.max(m, n) ? "首项抵消了，所以次数" : "剩下的最高次幂"}是 $${d}$。`,
                        ),
                      ],
                    ],
                    t(
                      `The highest term left is $${lead1(r[d]!, d)}$; its coefficient $${r[d]}$ is not $0$, and every higher power of $x$ has coefficient $0$.`,
                      `剩下的最高次项是 $${lead1(r[d]!, d)}$，系数 $${r[d]}$ 不为 $0$，更高次幂的系数都是 $0$。`,
                    ),
                  ),
          });
        }
      },
    },
    {
      id: "computing-sums-differences-and-products",
      title: t("Computing the result", "计算运算结果"),
      explanation: t(
        "To subtract $q(x)$, subtract **every** term of it: the minus sign is distributed over the whole of $q(x)$.\n\n$$(2x^{2} - 3x + 1) - (x^{2} - 5x + 4) = 2x^{2} - 3x + 1 - x^{2} + 5x - 4 = x^{2} + 2x - 3$$\n\nTo multiply, multiply every term of one polynomial by every term of the other and collect like terms:\n\n$$(x - 2)(x^{2} + 3x - 1) = x^{3} + 3x^{2} - x - 2x^{2} - 6x + 2 = x^{3} + x^{2} - 7x + 2$$\n\nFor instance:\n\n$$(x^{2} + 4) - (3x^{2} - x + 2) = x^{2} + 4 - 3x^{2} + x - 2 = -2x^{2} + x + 2$$\n\nCheck at $x = 1$: $5 - 4 = 1$ and $-2 + 1 + 2 = 1$.\n\n> **Watch out.** Changing the sign of only the first term of $q(x)$ is the usual slip; every term of $q(x)$ changes sign. In a product, every term meets every term: $(x - 2)(x^{2} + 3x - 1)$ has six products before collecting.",
        "减去 $q(x)$ 时要减去它的**每一**项：负号要分配到整个 $q(x)$ 上。\n\n$$(2x^{2} - 3x + 1) - (x^{2} - 5x + 4) = 2x^{2} - 3x + 1 - x^{2} + 5x - 4 = x^{2} + 2x - 3$$\n\n相乘时，用一个多项式的每一项乘另一个多项式的每一项，再合并同类项：\n\n$$(x - 2)(x^{2} + 3x - 1) = x^{3} + 3x^{2} - x - 2x^{2} - 6x + 2 = x^{3} + x^{2} - 7x + 2$$\n\n例如：\n\n$$(x^{2} + 4) - (3x^{2} - x + 2) = x^{2} + 4 - 3x^{2} + x - 2 = -2x^{2} + x + 2$$\n\n在 $x = 1$ 处检验：$5 - 4 = 1$，$-2 + 1 + 2 = 1$。\n\n> **注意。** 只改变 $q(x)$ 第一项的符号是常见错误；$q(x)$ 的每一项都要变号。相乘时每一项都要与每一项相乘：$(x - 2)(x^{2} + 3x - 1)$ 合并前有六个乘积。",
      ),
      keyPrerequisites: ["multiplying-polynomials"],
      generate(rng) {
        if (rng.bool()) {
          const p = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-5, 5)];
          const q = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-5, 5)];
          const r = subP(p, q);
          const lead = [...q];
          lead[2] = -q[2]!;
          return expressionProblem({
            prompt: t(
              `Let $p(x) = ${pl(p)}$ and $q(x) = ${pl(q)}$. Write $p(x) - q(x)$ as a polynomial in standard form.`,
              `设 $p(x) = ${pl(p)}$，$q(x) = ${pl(q)}$。把 $p(x) - q(x)$ 写成标准形式的多项式。`,
            ),
            answer: pl(r),
            simplified: true,
            wrong: [pl(addP(p, q)), pl(addP(p, lead))],
            solution: walked(
              [
                [
                  ["Distribute the minus sign", "分配负号"],
                  t("Every term of $q(x)$ changes sign:", "$q(x)$ 的每一项都变号："),
                  [`-(${pl(q)}) = ${pl(scaleP(q, -1))}`],
                ],
                [
                  ["Combine like terms", "合并同类项"],
                  t("Add the two polynomials term by term:", "把两个多项式逐项相加："),
                  [`(${pl(p)}) + (${pl(scaleP(q, -1))}) = ${pl(r)}`],
                ],
              ],
              t(
                `At $x = 1$: $p(1) - q(1) = ${at(p, 1)} - ${paren(at(q, 1))} = ${at(r, 1)}$, the value of $${pl(r)}$ at $x = 1$.`,
                `取 $x = 1$：$p(1) - q(1) = ${at(p, 1)} - ${paren(at(q, 1))} = ${at(r, 1)}$，正是 $${pl(r)}$ 在 $x = 1$ 处的值。`,
              ),
            ),
          });
        }
        const p = [rng.nonZero(-6, 6), rng.nonZero(-3, 3)];
        const q = [rng.nonZero(-9, 9), rng.int(-9, 9), rng.nonZero(-3, 3)];
        const r = mulP(p, q);
        return expressionProblem({
          prompt: t(
            `Let $p(x) = ${pl(p)}$ and $q(x) = ${pl(q)}$. Write $p(x)q(x)$ as a polynomial in standard form.`,
            `设 $p(x) = ${pl(p)}$，$q(x) = ${pl(q)}$。把 $p(x)q(x)$ 写成标准形式的多项式。`,
          ),
          answer: pl(r),
          simplified: true,
          wrong: [pl([p[0]! * q[0]!, p[1]! * q[1]!, 0]), pl(mulP([-p[0]!, p[1]!], q))],
          solution: walked(
            [
              [
                ["Distribute", "分配"],
                t(`Multiply each term of $${pl(p)}$ by all of $${pl(q)}$:`, `用 $${pl(p)}$ 的每一项去乘整个 $${pl(q)}$：`),
                [
                  `(${pl(p)})(${pl(q)}) = ${front(p[1]!)}x(${pl(q)}) ${sgn(p[0]!)} ${Math.abs(p[0]!)}(${pl(q)})`,
                  `= ${pl(mulP([0, p[1]!], q))} ${sgn(p[0]!)} (${pl(scaleP(q, Math.abs(p[0]!)))})`,
                ],
              ],
              [["Combine like terms", "合并同类项"], t("Collect each power of $x$:", "把 $x$ 的各次幂分别合并："), [`= ${pl(r)}`]],
            ],
            t(
              `At $x = 1$: $p(1)q(1) = ${paren(at(p, 1))} \\cdot ${paren(at(q, 1))} = ${at(r, 1)}$, the value of $${pl(r)}$ at $x = 1$.`,
              `取 $x = 1$：$p(1)q(1) = ${paren(at(p, 1))} \\cdot ${paren(at(q, 1))} = ${at(r, 1)}$，正是 $${pl(r)}$ 在 $x = 1$ 处的值。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.2 Closure properties of rational expressions ───────────────────────

const kindOptions: readonly Text[] = [
  t("A polynomial", "多项式"),
  t("A rational expression that is not a polynomial", "分式，但不是多项式"),
  t("Not a rational expression", "不是分式（有理式）"),
];

/** closurePropertiesOfRationalExpressions combines rational expressions and shows the result is again a rational expression. */
export const closurePropertiesOfRationalExpressions: TopicDef = {
  id: "closure-properties-of-rational-expressions",
  title: t("Closure Properties of Rational Expressions", "分式的封闭性"),
  summary: t(
    "Recognize rational expressions, combine two of them into one in lowest terms, and find where the result is not defined.",
    "识别分式，把两个分式的运算结果化为一个最简分式，并求结果无意义的 $x$ 值。",
  ),
  prerequisites: ["closure-properties-of-polynomials", "simplifying-complex-fractions"],
  encompasses: [{ topic: "dividing-rational-expressions", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSA.APR.D.7"],
  intro: t(
    `Take $r(x) = \\frac{1}{x}$ and $s(x) = \\frac{2}{x + 1}$. Over the common denominator $x(x + 1)$ their sum is one fraction of polynomials again:

$$\\frac{1}{x} + \\frac{2}{x + 1} = \\frac{(x + 1) + 2x}{x(x + 1)} = \\frac{3x + 1}{x(x + 1)}$$

It is not defined at $x = 0$ and $x = -1$, where $r$ or $s$ is not defined.

Check at $x = 1$: $1 + 1 = 2$, and $\\frac{4}{2} = 2$.

In this lesson we tell rational expressions from polynomials and from other expressions, combine two rational expressions into one, and find where the result is not defined.`,
    `取 $r(x) = \\frac{1}{x}$，$s(x) = \\frac{2}{x + 1}$。以 $x(x + 1)$ 为公分母，它们的和仍是一个多项式之商：

$$\\frac{1}{x} + \\frac{2}{x + 1} = \\frac{(x + 1) + 2x}{x(x + 1)} = \\frac{3x + 1}{x(x + 1)}$$

它在 $x = 0$ 和 $x = -1$ 处无意义，因为那里 $r$ 或 $s$ 无意义。

在 $x = 1$ 处检验：$1 + 1 = 2$，而 $\\frac{4}{2} = 2$。

这节课我们区分分式与多项式及其他式子，把两个分式的运算结果合并成一个分式，并求结果无意义的 $x$ 值。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing-rational-expressions",
      title: t("Recognizing rational expressions", "识别分式"),
      explanation: t(
        "A **rational expression** is a quotient $\\frac{p(x)}{q(x)}$ of two polynomials, with $q$ not the zero polynomial. Every polynomial is one (take $q(x) = 1$).\n\n- $\\frac{x^{2}}{3} - 2x$ and $\\sqrt{2}x + 1$ are **polynomials**: dividing by a number or multiplying by an irrational number only changes the coefficients.\n- $\\frac{x + 1}{x - 3}$, $2x + \\frac{5}{x}$ and $4x^{-2} = \\frac{4}{x^{2}}$ are rational expressions but not polynomials: $x$ appears in a denominator.\n- $\\sqrt{x}$, $x^{\\frac{1}{2}}$, $|x|$ and $2^{x}$ are not rational expressions: the variable is under a root, inside absolute value bars, or in an exponent.\n\nFor instance, $\\frac{3}{x} - x^{2} = \\frac{3 - x^{3}}{x}$ is a quotient of polynomials with $x$ in the denominator: a rational expression but not a polynomial. Check: it is not defined at $x = 0$, which never happens to a polynomial.\n\n> **Watch out.** Dividing by a number keeps a polynomial a polynomial: $\\frac{x^{2}}{5}$ is $\\frac{1}{5}x^{2}$. And $x^{-1}$ looks like a power of $x$ but is $\\frac{1}{x}$, so it is not a polynomial.",
        "**分式**（有理式）是两个多项式的商 $\\frac{p(x)}{q(x)}$，其中 $q$ 不是零多项式。每个多项式都是分式（取 $q(x) = 1$）。\n\n- $\\frac{x^{2}}{3} - 2x$ 和 $\\sqrt{2}x + 1$ 是**多项式**：除以一个数或乘以一个无理数只改变系数。\n- $\\frac{x + 1}{x - 3}$、$2x + \\frac{5}{x}$ 和 $4x^{-2} = \\frac{4}{x^{2}}$ 是分式但不是多项式：$x$ 出现在分母中。\n- $\\sqrt{x}$、$x^{\\frac{1}{2}}$、$|x|$ 和 $2^{x}$ 都不是分式：变量在根号下、绝对值符号内或指数上。\n\n例如 $\\frac{3}{x} - x^{2} = \\frac{3 - x^{3}}{x}$ 是分母含 $x$ 的多项式之商：是分式，但不是多项式。检验：它在 $x = 0$ 处无意义，而多项式在任何地方都有意义。\n\n> **注意。** 除以一个数，多项式仍是多项式：$\\frac{x^{2}}{5}$ 就是 $\\frac{1}{5}x^{2}$。$x^{-1}$ 看起来是 $x$ 的幂，其实是 $\\frac{1}{x}$，所以不是多项式。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.int(2, 7);
        const m = rng.pick([2, 3, 5, 7]);
        const forms: readonly (readonly string[])[] = [
          [
            `\\frac{x^{3}}{${c}} ${b < 0 ? "-" : "+"} ${poly([Math.abs(b), "x"])}`,
            `\\sqrt{${m}}x^{2}${plus(b)}`,
            `\\frac{${a}x^{2}${plus(b)}}{${c}}`,
            `(${bare(b)})(x^{2} + ${a})`,
          ],
          [`${a}x + \\frac{${c}}{x}`, `${a}x^{-2}${plus(b)}`, `\\frac{x${plus(b)}}{x^{2} + ${c}}`, `\\frac{x^{2}}{${a}x${plus(b)}}`],
          [`\\sqrt{x}${plus(b)}`, `${a}x^{\\frac{1}{2}}${plus(b)}`, `${a}^{x}${plus(b)}`, `${a}|x|${plus(b)}`],
        ];
        const kind = rng.int(0, 2);
        const i = rng.int(0, 3);
        const expr = forms[kind]![i]!;
        const about: Text[][] = [
          [
            t(
              `It is $\\frac{1}{${c}}x^{3} ${b < 0 ? "-" : "+"} ${poly([Math.abs(b), "x"])}$: dividing by the number $${c}$ only makes a fractional coefficient, so it is a polynomial.`,
              `它就是 $\\frac{1}{${c}}x^{3} ${b < 0 ? "-" : "+"} ${poly([Math.abs(b), "x"])}$：除以数 $${c}$ 只得到分数系数，所以它是多项式。`,
            ),
            t(
              `The coefficient $\\sqrt{${m}}$ is irrational, but $x$ is not under the root and has a whole-number exponent, so it is a polynomial.`,
              `系数 $\\sqrt{${m}}$ 是无理数，但 $x$ 不在根号下，指数是整数，所以它是多项式。`,
            ),
            t(
              `The denominator is the number $${c}$, not an expression in $x$, so it is a polynomial with fractional coefficients.`,
              `分母是数 $${c}$，不含 $x$，所以它是系数为分数的多项式。`,
            ),
            t("A product of polynomials is a polynomial.", "多项式的乘积是多项式。"),
          ],
          [
            t(
              `It is $\\frac{${a}x^{2} + ${c}}{x}$, a quotient of polynomials with $x$ in the denominator: a rational expression but not a polynomial.`,
              `它等于 $\\frac{${a}x^{2} + ${c}}{x}$，是分母含 $x$ 的多项式之商：是分式，但不是多项式。`,
            ),
            t(
              `A negative exponent puts $x$ in a denominator: $${a}x^{-2} = \\frac{${a}}{x^{2}}$. So it is a rational expression but not a polynomial.`,
              `负指数把 $x$ 放到了分母中：$${a}x^{-2} = \\frac{${a}}{x^{2}}$。所以它是分式，但不是多项式。`,
            ),
            t(
              "It is a quotient of two polynomials with $x$ in the denominator: a rational expression but not a polynomial.",
              "它是两个多项式之商，分母含 $x$：是分式，但不是多项式。",
            ),
            t(
              "It is a quotient of two polynomials with $x$ in the denominator: a rational expression but not a polynomial.",
              "它是两个多项式之商，分母含 $x$：是分式，但不是多项式。",
            ),
          ],
          [
            t(
              "The variable is under a square root, so this is not a quotient of polynomials: not a rational expression.",
              "变量在平方根下，这不是多项式之商：不是分式。",
            ),
            t(
              "$x^{\\frac{1}{2}} = \\sqrt{x}$: a fractional exponent is a root, so this is not a rational expression.",
              "$x^{\\frac{1}{2}} = \\sqrt{x}$：分数指数就是开方，所以它不是分式。",
            ),
            t(
              "The variable is in the exponent, so this is an exponential expression, not a rational expression.",
              "变量在指数上，这是指数式，不是分式。",
            ),
            t(
              "The variable is inside absolute value bars, which no quotient of polynomials can express: not a rational expression.",
              "变量在绝对值符号内，任何多项式之商都无法表示它：不是分式。",
            ),
          ],
        ];
        return reasoned(
          choiceProblem({
            prompt: t(`Which best describes $${expr}$?`, `下列哪一项最准确地描述了 $${expr}$？`),
            options: kindOptions,
            correct: kind,
            solution: walked(
              [
                [["Look at where $x$ appears", "看 $x$ 出现在哪里"], about[kind]![i]!],
                [
                  ["Choose the description", "选出描述"],
                  t(
                    `So the best description is: ${kindOptions[kind]!.en.toLowerCase()}.`,
                    `所以最准确的描述是：${kindOptions[kind]!["zh-CN"]}。`,
                  ),
                ],
              ],
              kind === 0
                ? t(
                    "It fits $\\frac{p(x)}{q(x)}$ with $q(x) = 1$, so it is also a rational expression; the narrowest true description is a polynomial.",
                    "取 $q(x) = 1$，它符合 $\\frac{p(x)}{q(x)}$，所以它也是分式；最窄的正确描述是多项式。",
                  )
                : kind === 1
                  ? t(
                      "It fits $\\frac{p(x)}{q(x)}$ only with $q(x)$ of degree at least $1$, so it is a rational expression and not a polynomial.",
                      "只有当 $q(x)$ 至少是一次时它才符合 $\\frac{p(x)}{q(x)}$，所以它是分式而不是多项式。",
                    )
                  : t(
                      "No choice of polynomials $p$ and $q$ makes $\\frac{p(x)}{q(x)}$ equal to it for every $x$.",
                      "无论怎样选多项式 $p$ 和 $q$，$\\frac{p(x)}{q(x)}$ 都不能对每个 $x$ 都等于它。",
                    ),
            ),
          }),
          kind === 0
            ? [
                why(
                  kindOptions[1]!,
                  "No $x$ is left in a denominator, so it is a polynomial, and a polynomial is the more precise description.",
                  "分母中没有 $x$，所以它是多项式，多项式是更准确的描述。",
                ),
                why(
                  kindOptions[2]!,
                  "Every polynomial is a rational expression, over the denominator $1$.",
                  "每个多项式都是分式，分母取 $1$。",
                ),
              ]
            : kind === 1
              ? [
                  why(
                    kindOptions[0]!,
                    "The variable ends up in a denominator, which a polynomial never has.",
                    "变量出现在分母中，而多项式的分母不含变量。",
                  ),
                  why(
                    kindOptions[2]!,
                    "It can be written as a quotient of two polynomials, so it is a rational expression.",
                    "它能写成两个多项式之商，所以是分式。",
                  ),
                ]
              : [
                  why(
                    kindOptions[0]!,
                    "A polynomial has only whole-number powers of $x$; here $x$ is under a root, inside absolute value bars or in an exponent.",
                    "多项式中 $x$ 只有整数次幂；这里 $x$ 在根号下、绝对值符号内或指数上。",
                  ),
                  why(
                    kindOptions[1]!,
                    "A rational expression is a quotient of polynomials, and no quotient of polynomials equals this expression.",
                    "分式是多项式之商，没有哪个多项式之商等于这个式子。",
                  ),
                ],
        );
      },
    },
    {
      id: "combining-into-one-rational-expression",
      title: t("Combining into one rational expression", "合并成一个分式"),
      explanation: t(
        "The sum, difference, product and quotient (by a nonzero expression) of two rational expressions is again a rational expression: rational expressions are **closed** under all four operations. To show it, write the result as one fraction of polynomials in lowest terms.\n\nFor $r(x) = \\frac{2}{x - 1}$ and $s(x) = \\frac{3}{x + 2}$:\n\n$$r(x) + s(x) = \\frac{2(x + 2) + 3(x - 1)}{(x - 1)(x + 2)} = \\frac{5x + 1}{(x - 1)(x + 2)}$$\n\n$$r(x) \\div s(x) = \\frac{2}{x - 1} \\cdot \\frac{x + 2}{3} = \\frac{2x + 4}{3x - 3}$$\n\nFor $r(x) = \\frac{1}{x - 2}$ and $s(x) = \\frac{4}{x + 1}$:\n\n$$r(x) - s(x) = \\frac{(x + 1) - 4(x - 2)}{(x - 2)(x + 1)} = \\frac{-3x + 9}{(x - 2)(x + 1)}$$\n\nCheck at $x = 0$: $-\\frac{1}{2} - 4 = -\\frac{9}{2}$, and $\\frac{9}{-2} = -\\frac{9}{2}$.\n\n> **Watch out.** In a difference the minus sign multiplies the whole of $4(x - 2)$, giving $-4x + 8$, not $-4x - 8$. In a quotient, flip the second fraction, not the first.",
        "两个分式的和、差、积以及商（除以非零的式子）仍是分式：分式对四种运算都**封闭**。要说明这一点，就把结果写成一个最简的多项式之商。\n\n对 $r(x) = \\frac{2}{x - 1}$ 和 $s(x) = \\frac{3}{x + 2}$：\n\n$$r(x) + s(x) = \\frac{2(x + 2) + 3(x - 1)}{(x - 1)(x + 2)} = \\frac{5x + 1}{(x - 1)(x + 2)}$$\n\n$$r(x) \\div s(x) = \\frac{2}{x - 1} \\cdot \\frac{x + 2}{3} = \\frac{2x + 4}{3x - 3}$$\n\n对 $r(x) = \\frac{1}{x - 2}$ 和 $s(x) = \\frac{4}{x + 1}$：\n\n$$r(x) - s(x) = \\frac{(x + 1) - 4(x - 2)}{(x - 2)(x + 1)} = \\frac{-3x + 9}{(x - 2)(x + 1)}$$\n\n在 $x = 0$ 处检验：$-\\frac{1}{2} - 4 = -\\frac{9}{2}$，而 $\\frac{9}{-2} = -\\frac{9}{2}$。\n\n> **注意。** 做减法时负号要乘整个 $4(x - 2)$，得到 $-4x + 8$，而不是 $-4x - 8$。做除法时把第二个分式倒过来，而不是第一个。",
      ),
      keyPrerequisites: ["adding-rational-expressions-with-unlike-denominators", "dividing-rational-expressions"],
      generate(rng) {
        const [p, q] = rng.sample(range(-6, 6), 2) as [number, number];
        const a = rng.nonZero(-7, 7);
        const b = rng.nonZero(-7, 7);
        const op = rng.pick(["+", "-", "\\cdot", "\\div"] as const);
        const den = prodL(simple([p, q]));
        const prompt = t(
          `Let $r(x) = ${sfrac(a, bare(p))}$ and $s(x) = ${sfrac(b, bare(q))}$. Write $r(x) ${op} s(x)$ as a single rational expression in lowest terms.`,
          `设 $r(x) = ${sfrac(a, bare(p))}$，$s(x) = ${sfrac(b, bare(q))}$。把 $r(x) ${op} s(x)$ 写成一个最简分式。`,
        );
        const x0 = [0, 1, 2, 3].find((v) => v !== p && v !== q)!;
        const [rv, sv] = [Q.of(a, x0 - p), Q.of(b, x0 - q)];
        const value = op === "+" ? rv.add(sv) : op === "-" ? rv.sub(sv) : op === "\\cdot" ? rv.mul(sv) : rv.div(sv);
        const atX0 = (top: number, bottom: number) =>
          t(
            `At $x = ${x0}$ both give the same value:${steps(`r(${x0}) ${op} s(${x0}) = ${num(rv)} ${op} ${paren(sv)} = ${num(value)}`, `${frac(String(top), String(bottom))} = ${num(value)}`)}The first line is the original pair of fractions, the second the answer.`,
            `取 $x = ${x0}$，两边的值相同：${steps(`r(${x0}) ${op} s(${x0}) = ${num(rv)} ${op} ${paren(sv)} = ${num(value)}`, `${frac(String(top), String(bottom))} = ${num(value)}`)}第一行是原来的两个分式，第二行是答案。`,
          );
        if (op === "+" || op === "-") {
          const bb = op === "+" ? b : -b;
          const top = [-(a * q + bb * p), a + bb];
          const answer = frac(pl(top), den);
          return expressionProblem({
            prompt,
            answer,
            lowest: true,
            wrong: [frac(String(a + bb), pl([-(p + q), 2])), frac(pl([-(a * p + bb * q), a + bb]), den), frac(String(a + bb), den)],
            solution: walked(
              [
                [
                  ["Find a common denominator", "找公分母"],
                  t(
                    `The denominators $${bare(p)}$ and $${bare(q)}$ have no common factor, so use their product $${den}$.`,
                    `分母 $${bare(p)}$ 和 $${bare(q)}$ 没有公因式，所以用它们的积 $${den}$。`,
                  ),
                ],
                [
                  ["Combine the numerators", "合并分子"],
                  t("Rewrite each fraction over it and collect the numerator:", "把每个分式化成这个分母，再合并分子："),
                  [`${frac(`${coefFac(a, q)} ${sgn(bb)} ${coefFac(Math.abs(bb), p)}`, den)} = ${answer}`],
                ],
              ],
              atX0(at(top, x0), (x0 - p) * (x0 - q)),
            ),
          });
        }
        if (op === "\\cdot") {
          const answer = sfrac(a * b, den);
          return expressionProblem({
            prompt,
            answer,
            lowest: true,
            wrong: [sfrac(a * b, pl([p * q, 0, 1])), sfrac(a + b, den), sfrac(-a * b, den)],
            solution: walked(
              [
                [
                  ["Multiply the numerators", "分子相乘"],
                  t(`$${a} \\cdot ${paren(b)} = ${a * b}$.`, `$${a} \\cdot ${paren(b)} = ${a * b}$。`),
                ],
                [
                  ["Multiply the denominators", "分母相乘"],
                  t(
                    "No factor of the numerator cancels with the denominator, so this is in lowest terms:",
                    "分子没有因式能与分母约去，所以这已是最简形式：",
                  ),
                  [`${sfrac(a, bare(p))} \\cdot ${b < 0 ? `\\left(${sfrac(b, bare(q))}\\right)` : sfrac(b, bare(q))} = ${answer}`],
                ],
              ],
              atX0(a * b, (x0 - p) * (x0 - q)),
            ),
          });
        }
        const g = gcd(a, b) * Math.sign(b);
        const [a1, b1] = [a / g, b / g];
        const answer = frac(linear(a1, -a1 * q), linear(b1, -b1 * p));
        return expressionProblem({
          prompt,
          answer,
          lowest: true,
          wrong: [frac(linear(b1, -b1 * p), linear(a1, -a1 * q)), frac(`${a}${fac(q)}`, `${b}${fac(p)}`), sfrac(a * b, den)],
          solution: walked(
            [
              [
                ["Flip the divisor", "把除式倒过来"],
                t(
                  `Dividing by $s(x)$ is multiplying by its reciprocal $${frac(bare(q), String(b))}$.`,
                  `除以 $s(x)$ 就是乘以它的倒数 $${frac(bare(q), String(b))}$。`,
                ),
              ],
              [
                ["Multiply and cancel", "相乘并约分"],
                t("Multiply, then cancel common number factors:", "相乘，再约去公共的数因数："),
                [`${sfrac(a, bare(p))} \\cdot ${frac(bare(q), String(b))} = ${answer}`],
              ],
            ],
            atX0(a1 * (x0 - q), b1 * (x0 - p)),
          ),
        });
      },
    },
    {
      id: "where-the-result-is-undefined",
      title: t("Where the result is not defined", "结果无意义的值"),
      explanation: t(
        "A combination of $r(x)$ and $s(x)$ is defined only where both $r$ and $s$ are. A quotient $r(x) \\div s(x)$ also needs $s(x) \\neq 0$, so the zeros of the numerator of $s$ are excluded too.\n\nFor $r(x) = \\frac{x + 4}{x - 1}$ and $s(x) = \\frac{x - 3}{x + 2}$:\n\n- $r(x) \\cdot s(x)$ is not defined at $x = 1$ and $x = -2$;\n- $r(x) \\div s(x)$ is not defined at $x = 1$, $x = -2$ and $x = 3$, where $s(x) = 0$.\n\nFor $r(x) = \\frac{x}{x + 3}$ and $s(x) = \\frac{x + 1}{x - 5}$, the quotient $r(x) \\div s(x)$ is not defined at $x = -3$, $x = 5$ and $x = -1$. Check: $s(-1) = \\frac{0}{-6} = 0$, and dividing by $0$ is not defined.\n\n> **Watch out.** Only a quotient excludes the zeros of the numerator of $s$; a product $r(x) \\cdot s(x)$ is defined there. The zeros of the numerator of $r$ are never excluded.",
        "$r(x)$ 与 $s(x)$ 的运算结果只在 $r$ 和 $s$ 都有意义的地方有意义。商 $r(x) \\div s(x)$ 还要求 $s(x) \\neq 0$，所以 $s$ 的分子的零点也要排除。\n\n对 $r(x) = \\frac{x + 4}{x - 1}$ 和 $s(x) = \\frac{x - 3}{x + 2}$：\n\n- $r(x) \\cdot s(x)$ 在 $x = 1$ 和 $x = -2$ 处无意义；\n- $r(x) \\div s(x)$ 在 $x = 1$、$x = -2$ 以及使 $s(x) = 0$ 的 $x = 3$ 处无意义。\n\n对 $r(x) = \\frac{x}{x + 3}$ 和 $s(x) = \\frac{x + 1}{x - 5}$，商 $r(x) \\div s(x)$ 在 $x = -3$、$x = 5$ 和 $x = -1$ 处无意义。检验：$s(-1) = \\frac{0}{-6} = 0$，而除以 $0$ 无意义。\n\n> **注意。** 只有商才要排除 $s$ 的分子的零点；乘积 $r(x) \\cdot s(x)$ 在那里有意义。$r$ 的分子的零点从来不用排除。",
      ),
      generate(rng) {
        const [a, b, c, d] = rng.sample(range(-7, 7), 4) as [number, number, number, number];
        const divide = rng.bool(0.6);
        const op = divide ? "\\div" : "\\cdot";
        const answer = divide ? [b, d, c] : [b, d];
        return solutionsProblem({
          prompt: t(
            `Let $r(x) = ${frac(bare(a), bare(b))}$ and $s(x) = ${frac(bare(c), bare(d))}$. Find all values of $x$ for which $r(x) ${op} s(x)$ is not defined.`,
            `设 $r(x) = ${frac(bare(a), bare(b))}$，$s(x) = ${frac(bare(c), bare(d))}$。求使 $r(x) ${op} s(x)$ 无意义的所有 $x$ 值。`,
          ),
          values: values(answer),
          wrong: divide ? [values([b, d]), values([b, c]), values([a, c])] : [values([b, d, c]), values([a, c])],
          solution: walked(
            [
              [
                ["Find where $r$ and $s$ are not defined", "找出 $r$、$s$ 无意义的地方"],
                t(
                  `$r$ is not defined at $x = ${b}$ and $s$ at $x = ${d}$, where their denominators are $0$.`,
                  `$r$ 在 $x = ${b}$ 处无意义，$s$ 在 $x = ${d}$ 处无意义，那里它们的分母为 $0$。`,
                ),
              ],
              divide
                ? [
                    ["Exclude the zeros of $s$", "排除 $s$ 的零点"],
                    t(
                      `Dividing by $s(x)$ also needs $s(x) \\neq 0$, which excludes $x = ${c}$. So the values are ${listText(answer)}.`,
                      `除以 $s(x)$ 还要求 $s(x) \\neq 0$，于是又排除 $x = ${c}$。所以这些值是 ${listText(answer, "、")}。`,
                    ),
                  ]
                : [
                    ["Combine", "合起来"],
                    t(
                      `A product needs only both factors defined. So the values are ${listText(answer)}.`,
                      `乘积只要求两个因式都有意义。所以这些值是 ${listText(answer, "、")}。`,
                    ),
                  ],
            ],
            divide
              ? t(
                  `$s(${c}) = ${frac("0", String(c - d))} = 0$, so $r(${c}) \\div s(${c})$ would divide by $0$.`,
                  `$s(${c}) = ${frac("0", String(c - d))} = 0$，所以 $r(${c}) \\div s(${c})$ 要除以 $0$。`,
                )
              : t(
                  `At $x = ${c}$, $s(${c}) = 0$ and $r(${c}) \\cdot 0 = 0$ is defined, so $x = ${c}$ is not excluded.`,
                  `在 $x = ${c}$ 处，$s(${c}) = 0$，而 $r(${c}) \\cdot 0 = 0$ 有意义，所以 $x = ${c}$ 不用排除。`,
                ),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.3 Rational equations with three terms ──────────────────────────────

/** mx writes a monomial denominator mx: "x", "3x". */
const mx = (m: number) => (m === 1 ? "x" : `${m}x`);

/** LinearCase is A/(x − p) + B/(x − q) = C/((x − p)(x − q)), whose cleared form is linear with root x0. */
interface LinearCase {
  readonly p: number;
  readonly q: number;
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly x0: number;
}

function linearCase(rng: Rng, extraneous: boolean): LinearCase {
  for (;;) {
    const [p, q] = rng.sample(range(-6, 6), 2) as [number, number];
    const A = rng.nonZero(-6, 6);
    const B = rng.nonZero(-6, 6);
    if (A + B === 0) continue;
    const x0 = extraneous ? rng.pick([p, q]) : other(rng, -9, 9, [p, q]);
    const C = (A + B) * x0 - A * q - B * p;
    if (C === 0 || Math.abs(C) > 60) continue;
    return { p, q, A, B, C, x0 };
  }
}

const linearCaseLatex = ({ p, q, A, B, C }: LinearCase) => `${then(sfrac(A, bare(p)), B, bare(q))} = ${sfrac(C, pl(fromRoots([p, q])))}`;

/** linearCaseLines are the display lines that clear the denominators of a linear case and solve. */
function linearCaseLines({ p, q, A, B, C, x0 }: LinearCase): string[] {
  return [
    `${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`,
    `${linear(A + B, -A * q - B * p)} = ${C}`,
    ...(A + B === 1 ? [] : [`${linear(A + B, 0)} = ${C + A * q + B * p}`]),
    `x = ${x0}`,
  ];
}

/** linearCaseSteps clears the denominators of a linear case and solves. */
const linearCaseSteps = (c: LinearCase) => steps(...linearCaseLines(c));

/** pairAt writes A/(x − p) + B/(x − q) at a number x as two signed numbers, with its value. */
function pairAt(x: number, A: number, p: number, B: number, q: number): [string, Q] {
  const u = Q.of(A, x - p);
  const v = Q.of(B, x - q);
  return [`${num(u)} ${v.sign() < 0 ? "-" : "+"} ${num(v.abs())}`, u.add(v)];
}

/** linearCheck substitutes the solution of a linear case into both sides. */
function linearCheck({ p, q, A, B, C, x0 }: LinearCase): Text {
  const [line, value] = pairAt(x0, A, p, B, q);
  const lines = steps(`${line} = ${num(value)}`, `${frac(String(C), String((x0 - p) * (x0 - q)))} = ${num(value)}`);
  return t(
    `Substitute $x = ${x0}$ into the left side, then the right side:${lines}The two sides agree.`,
    `把 $x = ${x0}$ 分别代入左边和右边：${lines}两边相等。`,
  );
}

/** rationalEquationsWithThreeTerms solves equations with two fractions and a third term by clearing denominators. */
export const rationalEquationsWithThreeTerms: TopicDef = {
  id: "rational-equations-with-three-terms",
  title: t("Rational Equations With Three Terms", "含三项的分式方程"),
  summary: t(
    "Solve equations with three terms, at least two of them fractions, by multiplying through by the least common denominator and checking for extraneous solutions.",
    "解含三项（至少两项是分式）的方程：两边同乘最简公分母，并检验增根。",
  ),
  prerequisites: ["closure-properties-of-rational-expressions", "rational-equations-containing-binomials"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `To solve $\\frac{1}{x} + \\frac{1}{2x} = 3$, multiply every term by the least common denominator $2x$ (and keep $x \\neq 0$):

$$2 + 1 = 6x \\quad\\Rightarrow\\quad x = \\frac{1}{2}$$

Check: at $x = \\frac{1}{2}$ the left side is $2 + 1 = 3$.

In this lesson we clear the fractions of a three-term equation with the least common denominator, use a factored quadratic denominator as that denominator, and reject extraneous solutions.`,
    `解 $\\frac{1}{x} + \\frac{1}{2x} = 3$ 时，把每一项都乘以最简公分母 $2x$（并保留 $x \\neq 0$）：

$$2 + 1 = 6x \\quad\\Rightarrow\\quad x = \\frac{1}{2}$$

检验：$x = \\frac{1}{2}$ 时左边是 $2 + 1 = 3$。

这节课我们用最简公分母消去三项方程中的分母，把分解后的二次分母用作公分母，并舍去增根。`,
  ),
  knowledgePoints: [
    {
      id: "monomial-denominators",
      title: t("Monomial denominators", "分母是单项式"),
      explanation: t(
        "With three terms, cross-multiplication no longer works. Instead multiply **every** term by the least common denominator (LCD), which clears all the fractions.\n\nFor $\\frac{5}{2x} + \\frac{1}{3x} = 4$, the LCD is $6x$ (and $x \\neq 0$):\n\n$$6x \\cdot \\frac{5}{2x} + 6x \\cdot \\frac{1}{3x} = 6x \\cdot 4$$\n\n$$15 + 2 = 24x \\quad\\Rightarrow\\quad x = \\frac{17}{24}$$\n\nDo not forget to multiply the term without a fraction too.\n\nFor $\\frac{3}{x} - \\frac{1}{4x} = 11$, the LCD is $4x$:\n\n$$12 - 1 = 44x \\quad\\Rightarrow\\quad x = \\frac{1}{4}$$\n\nCheck: at $x = \\frac{1}{4}$ the left side is $12 - 1 = 11$.\n\n> **Watch out.** The number on the right is a term too: multiplying by $4x$ turns $11$ into $44x$, not $11$.",
        "方程有三项时，交叉相乘不再适用。改为把**每一项**都乘以最简公分母，消去所有分母。\n\n对 $\\frac{5}{2x} + \\frac{1}{3x} = 4$，最简公分母是 $6x$（且 $x \\neq 0$）：\n\n$$6x \\cdot \\frac{5}{2x} + 6x \\cdot \\frac{1}{3x} = 6x \\cdot 4$$\n\n$$15 + 2 = 24x \\quad\\Rightarrow\\quad x = \\frac{17}{24}$$\n\n不要忘了不含分母的那一项也要乘。\n\n对 $\\frac{3}{x} - \\frac{1}{4x} = 11$，最简公分母是 $4x$：\n\n$$12 - 1 = 44x \\quad\\Rightarrow\\quad x = \\frac{1}{4}$$\n\n检验：$x = \\frac{1}{4}$ 时左边是 $12 - 1 = 11$。\n\n> **注意。** 右边的数也是一项：乘以 $4x$ 后 $11$ 变成 $44x$，而不是 $11$。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(1, 6);
          const n = rng.int(1, 6);
          if (m === n) continue;
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          const c = rng.nonZero(-6, 6);
          const L = lcm(m, n);
          const top = a * (L / m) + b * (L / n);
          if (top === 0) continue;
          const x = Q.of(top, c * L);
          const wrong = [Q.of(a + b, c * (m + n)), Q.of(c * L, top), Q.of(a * n + b * m, c)];
          const u = Q.of(a, m).div(x);
          const v = Q.of(b, n).div(x);
          return numberProblem({
            prompt: t(`Solve $${then(sfrac(a, mx(m)), b, mx(n))} = ${c}$.`, `解方程 $${then(sfrac(a, mx(m)), b, mx(n))} = ${c}$。`),
            answer: x,
            solveFor: "x",
            wrong,
            solution: walked(
              [
                [
                  ["Find the LCD", "找最简公分母"],
                  t(
                    `The LCD of $${mx(m)}$ and $${mx(n)}$ is $${mx(L)}$, and $x \\neq 0$.`,
                    `$${mx(m)}$ 和 $${mx(n)}$ 的最简公分母是 $${mx(L)}$，且 $x \\neq 0$。`,
                  ),
                ],
                [
                  ["Clear the fractions", "去分母"],
                  t(`Multiply every term by $${mx(L)}$:`, `每一项都乘以 $${mx(L)}$：`),
                  [`${a * (L / m)} ${sgn(b * (L / n))} ${Math.abs(b * (L / n))} = ${c * L}x`, `${top} = ${c * L}x`],
                ],
                [["Solve", "求解"], t(`Divide by $${c * L}$:`, `两边除以 $${c * L}$：`), [`x = ${num(x)}`]],
              ],
              t(
                `Put the solution into the two fractions:${steps(`${num(u)} ${v.sign() < 0 ? "-" : "+"} ${num(v.abs())} = ${c}`)}which is the right side.`,
                `把解代入两个分式：${steps(`${num(u)} ${v.sign() < 0 ? "-" : "+"} ${num(v.abs())} = ${c}`)}正是右边。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "a-product-as-the-common-denominator",
      title: t("A product as the common denominator", "以乘积为公分母"),
      explanation: t(
        "When one denominator is a quadratic, factor it first: it is often the product of the other two denominators, and then it is the LCD.\n\n$$\\frac{2}{x - 1} + \\frac{3}{x + 2} = \\frac{9}{x^{2} + x - 2}, \\qquad x^{2} + x - 2 = (x - 1)(x + 2)$$\n\nSo $x \\neq 1$ and $x \\neq -2$. Multiply every term by $(x - 1)(x + 2)$:\n\n$$2(x + 2) + 3(x - 1) = 9 \\quad\\Rightarrow\\quad 5x + 1 = 9 \\quad\\Rightarrow\\quad x = \\frac{8}{5}$$\n\nFor $\\frac{1}{x - 3} + \\frac{2}{x + 3} = \\frac{12}{x^{2} - 9}$, the denominator $x^{2} - 9 = (x - 3)(x + 3)$ is the LCD:\n\n$$(x + 3) + 2(x - 3) = 12 \\quad\\Rightarrow\\quad 3x - 3 = 12 \\quad\\Rightarrow\\quad x = 5$$\n\nCheck: at $x = 5$ the left side is $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$ and the right side is $\\frac{12}{16} = \\frac{3}{4}$.\n\n> **Watch out.** Multiply the bracket out in full: $2(x - 3) = 2x - 6$, not $2x - 3$. And check the factoring first; if the quadratic is not the product of the other two denominators, the LCD is larger.",
        "如果有一个分母是二次式，先把它因式分解：它常常就是另两个分母的乘积，也就是最简公分母。\n\n$$\\frac{2}{x - 1} + \\frac{3}{x + 2} = \\frac{9}{x^{2} + x - 2}, \\qquad x^{2} + x - 2 = (x - 1)(x + 2)$$\n\n所以 $x \\neq 1$ 且 $x \\neq -2$。每一项都乘以 $(x - 1)(x + 2)$：\n\n$$2(x + 2) + 3(x - 1) = 9 \\quad\\Rightarrow\\quad 5x + 1 = 9 \\quad\\Rightarrow\\quad x = \\frac{8}{5}$$\n\n对 $\\frac{1}{x - 3} + \\frac{2}{x + 3} = \\frac{12}{x^{2} - 9}$，分母 $x^{2} - 9 = (x - 3)(x + 3)$ 就是最简公分母：\n\n$$(x + 3) + 2(x - 3) = 12 \\quad\\Rightarrow\\quad 3x - 3 = 12 \\quad\\Rightarrow\\quad x = 5$$\n\n检验：$x = 5$ 时左边是 $\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}$，右边是 $\\frac{12}{16} = \\frac{3}{4}$。\n\n> **注意。** 括号要完整展开：$2(x - 3) = 2x - 6$，而不是 $2x - 3$。还要先检查因式分解；如果二次式不是另两个分母的乘积，最简公分母会更大。",
      ),
      generate(rng) {
        const c = linearCase(rng, false);
        const { p, q, A, B, C, x0 } = c;
        return solutionsProblem({
          prompt: t(`Solve $${linearCaseLatex(c)}$.`, `解方程 $${linearCaseLatex(c)}$。`),
          values: [String(x0)],
          wrong: [[num(Q.of(C + A * q - B * p, A + B))], [num(Q.of(C + A * p + B * q, A + B))], [String(x0), String(p)]],
          solution: walked(
            [
              [
                ["Factor the quadratic denominator", "分解二次分母"],
                t(
                  `$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$, so $x \\neq ${p}$ and $x \\neq ${q}$.`,
                  `$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$，所以 $x \\neq ${p}$ 且 $x \\neq ${q}$。`,
                ),
              ],
              [
                ["Clear the fractions and solve", "去分母并求解"],
                t(
                  `Multiply every term by $${prodL(simple([p, q]))}$:${linearCaseSteps(c)}This is not an excluded value, so the solution is $x = ${x0}$.`,
                  `每一项都乘以 $${prodL(simple([p, q]))}$：${linearCaseSteps(c)}它不是被排除的值，所以解是 $x = ${x0}$。`,
                ),
              ],
            ],
            linearCheck(c),
          ),
        });
      },
    },
    {
      id: "rejecting-extraneous-solutions",
      title: t("Rejecting extraneous solutions", "舍去增根"),
      explanation: t(
        "Multiplying by an expression that can be $0$ may create a solution of the new equation that is not a solution of the original one: an **extraneous solution**. Always compare the result with the excluded values.\n\n$$\\frac{1}{x - 3} + \\frac{2}{x + 1} = \\frac{4}{x^{2} - 2x - 3} \\qquad (x \\neq 3,\\ x \\neq -1)$$\n\n$$(x + 1) + 2(x - 3) = 4 \\quad\\Rightarrow\\quad 3x - 5 = 4 \\quad\\Rightarrow\\quad x = 3$$\n\nBut $x = 3$ is excluded, so the equation has **no solution**.\n\nFor $\\frac{2}{x - 1} + \\frac{1}{x + 2} = \\frac{6}{x^{2} + x - 2}$, with $x \\neq 1$ and $x \\neq -2$:\n\n$$2(x + 2) + (x - 1) = 6 \\quad\\Rightarrow\\quad 3x + 3 = 6 \\quad\\Rightarrow\\quad x = 1$$\n\nCheck: at $x = 1$ the term $\\frac{2}{x - 1}$ has denominator $0$, so $x = 1$ is extraneous and there is no solution.\n\n> **Watch out.** Write the excluded values down before you clear the fractions, and compare at the end. A value that is not excluded is a real solution; do not throw it away.",
        "乘以可能为 $0$ 的式子，可能使新方程多出原方程没有的解，即**增根**。一定要把结果与被排除的值比较。\n\n$$\\frac{1}{x - 3} + \\frac{2}{x + 1} = \\frac{4}{x^{2} - 2x - 3} \\qquad (x \\neq 3,\\ x \\neq -1)$$\n\n$$(x + 1) + 2(x - 3) = 4 \\quad\\Rightarrow\\quad 3x - 5 = 4 \\quad\\Rightarrow\\quad x = 3$$\n\n但 $x = 3$ 是被排除的值，所以方程**无解**。\n\n对 $\\frac{2}{x - 1} + \\frac{1}{x + 2} = \\frac{6}{x^{2} + x - 2}$，其中 $x \\neq 1$ 且 $x \\neq -2$：\n\n$$2(x + 2) + (x - 1) = 6 \\quad\\Rightarrow\\quad 3x + 3 = 6 \\quad\\Rightarrow\\quad x = 1$$\n\n检验：$x = 1$ 时 $\\frac{2}{x - 1}$ 的分母为 $0$，所以 $x = 1$ 是增根，方程无解。\n\n> **注意。** 去分母之前先写下被排除的值，最后再比较。不是被排除的值就是真正的解，不要把它舍掉。",
      ),
      generate(rng) {
        const extraneous = rng.bool();
        const c = linearCase(rng, extraneous);
        const { p, q, x0 } = c;
        return solutionsProblem({
          prompt: t(
            `Solve $${linearCaseLatex(c)}$. If there is no solution, answer "no solution".`,
            `解方程 $${linearCaseLatex(c)}$。若无解，回答“无解”。`,
          ),
          values: extraneous ? [] : [String(x0)],
          wrong: extraneous ? [[String(x0)]] : [[], [String(x0), String(p)]],
          solution: walked(
            [
              [
                ["List the excluded values", "列出被排除的值"],
                t(`The excluded values are $x = ${p}$ and $x = ${q}$.`, `被排除的值是 $x = ${p}$ 和 $x = ${q}$。`),
              ],
              [
                ["Clear the fractions and solve", "去分母并求解"],
                t(`Multiply every term by $${prodL(simple([p, q]))}$:`, `每一项都乘以 $${prodL(simple([p, q]))}$：`),
                linearCaseLines(c),
              ],
              [
                ["Compare with the excluded values", "与被排除的值比较"],
                extraneous
                  ? t(
                      `But $x = ${x0}$ is excluded, so it is extraneous and the equation has no solution.`,
                      `但 $x = ${x0}$ 是被排除的值，是增根，所以方程无解。`,
                    )
                  : t(`This is not excluded, so the solution is $x = ${x0}$.`, `它不是被排除的值，所以解是 $x = ${x0}$。`),
              ],
            ],
            extraneous
              ? t(
                  `At $x = ${x0}$ the denominator $${bare(x0)}$ is $${x0} ${sgn(-x0)} ${Math.abs(x0)} = 0$, so the original equation is not defined there.`,
                  `$x = ${x0}$ 时分母 $${bare(x0)}$ 等于 $${x0} ${sgn(-x0)} ${Math.abs(x0)} = 0$，原方程在那里无意义。`,
                )
              : linearCheck(c),
          ),
        });
      },
    },
  ],
};

// ─── 2.4.4 Advanced rational equations ─────────────────────────────────────

/** QuadCase is A/(x − p) + B/(x − q) = C with integer roots r1, r2. */
interface QuadCase {
  readonly p: number;
  readonly q: number;
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly r1: number;
  readonly r2: number;
}

function quadCase(rng: Rng): QuadCase {
  for (;;) {
    const [p, q] = rng.sample(range(-5, 5), 2) as [number, number];
    const [r1, r2] = rng.sample(
      range(-8, 8).filter((r) => r !== p && r !== q),
      2,
    ) as [number, number];
    const C = rng.pick([1, -1, 2, -2]);
    const nA = C * (r1 - p) * (r2 - p);
    const nB = C * (r1 - q) * (r2 - q);
    if (nA % (q - p) !== 0 || nB % (p - q) !== 0) continue;
    const A = nA / (q - p);
    const B = nB / (p - q);
    if (Math.abs(A) > 24 || Math.abs(B) > 24) continue;
    return { p, q, A, B, C, r1, r2 };
  }
}

/** check throws when two polynomials differ, guarding the algebra of a generator. */
function check(a: P, b: P): void {
  if (pl(a) !== pl(b)) throw new Error(`expected ${pl(b)}, got ${pl(a)}`);
}

/** advancedRationalEquations solves rational equations that lead to quadratic equations. */
export const advancedRationalEquations: TopicDef = {
  id: "advanced-rational-equations",
  title: t("Advanced Rational Equations", "较复杂的分式方程"),
  summary: t(
    "Solve rational equations that become quadratic equations after clearing denominators, rejecting extraneous roots.",
    "解去分母后化为二次方程的分式方程，并舍去增根。",
  ),
  prerequisites: ["rational-equations-with-three-terms", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "rational-equations-with-three-terms", weight: 0.5 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `Multiplying $x + \\frac{6}{x} = 5$ by $x$ (with $x \\neq 0$) turns the lone $x$ into $x^{2}$, so the equation becomes quadratic:

$$x^{2} + 6 = 5x \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$

Check: $2 + \\frac{6}{2} = 5$ and $3 + \\frac{6}{3} = 5$.

In this lesson we solve rational equations that become quadratic after clearing denominators: two fractions equal to a number, a term without a denominator, and an equation with one extraneous root.`,
    `把 $x + \\frac{6}{x} = 5$ 乘以 $x$（$x \\neq 0$），单独的 $x$ 变成 $x^{2}$，方程就成了二次方程：

$$x^{2} + 6 = 5x \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$

检验：$2 + \\frac{6}{2} = 5$，$3 + \\frac{6}{3} = 5$。

这节课我们解去分母后化为二次方程的分式方程：两个分式之和等于一个数、含不带分母的项，以及有一个增根的方程。`,
  ),
  knowledgePoints: [
    {
      id: "two-fractions-equal-to-a-number",
      title: t("Two fractions equal to a number", "两个分式之和等于一个数"),
      explanation: t(
        "Clearing the denominators of $\\frac{A}{x - p} + \\frac{B}{x - q} = C$ multiplies the constant $C$ by $(x - p)(x - q)$, which gives a quadratic equation. Collect everything on one side and factor.\n\n$$\\frac{3}{x - 1} - \\frac{2}{x + 1} = 1 \\qquad (x \\neq \\pm 1)$$\n\n$$3(x + 1) - 2(x - 1) = (x - 1)(x + 1)$$\n\n$$x + 5 = x^{2} - 1 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\nSo $x = 3$ or $x = -2$. Neither is excluded, so both are solutions.\n\nFor $\\frac{2}{x} + \\frac{1}{x - 2} = 1$, with $x \\neq 0$ and $x \\neq 2$:\n\n$$2(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 5x + 4 = 0 \\quad\\Rightarrow\\quad (x - 1)(x - 4) = 0$$\n\nCheck: at $x = 4$ the left side is $\\frac{1}{2} + \\frac{1}{2} = 1$; at $x = 1$ it is $2 - 1 = 1$.\n\n> **Watch out.** The number on the right is multiplied by the whole LCD: $1$ becomes $x(x - 2)$, not $1$. Then compare both roots with the excluded values.",
        "对 $\\frac{A}{x - p} + \\frac{B}{x - q} = C$ 去分母时，常数 $C$ 要乘以 $(x - p)(x - q)$，于是得到二次方程。把所有项移到一边再因式分解。\n\n$$\\frac{3}{x - 1} - \\frac{2}{x + 1} = 1 \\qquad (x \\neq \\pm 1)$$\n\n$$3(x + 1) - 2(x - 1) = (x - 1)(x + 1)$$\n\n$$x + 5 = x^{2} - 1 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\n所以 $x = 3$ 或 $x = -2$。两者都不是被排除的值，所以都是解。\n\n对 $\\frac{2}{x} + \\frac{1}{x - 2} = 1$，其中 $x \\neq 0$ 且 $x \\neq 2$：\n\n$$2(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 5x + 4 = 0 \\quad\\Rightarrow\\quad (x - 1)(x - 4) = 0$$\n\n检验：$x = 4$ 时左边是 $\\frac{1}{2} + \\frac{1}{2} = 1$；$x = 1$ 时是 $2 - 1 = 1$。\n\n> **注意。** 右边的数要乘以整个最简公分母：$1$ 变成 $x(x - 2)$，而不是 $1$。然后把两个根都与被排除的值比较。",
      ),
      generate(rng) {
        const c = quadCase(rng);
        const { p, q, A, B, C, r1, r2 } = c;
        const s = Math.sign(C);
        const std = [C * p * q + A * q + B * p, -(C * (p + q) + A + B), C].map((v) => v * s);
        check(std, fromRoots([r1, r2], Math.abs(C)));
        return solutionsProblem({
          prompt: t(`Solve $${then(sfrac(A, bare(p)), B, bare(q))} = ${C}$.`, `解方程 $${then(sfrac(A, bare(p)), B, bare(q))} = ${C}$。`),
          values: values([r1, r2]),
          wrong: [values([-r1, -r2]), values([r1]), values([r1, r2, p])],
          solution: walked(
            [
              [
                ["Clear the denominators", "去分母"],
                t(
                  `Here $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by $${prodL(simple([p, q]))}$, then collect the terms on one side:`,
                  `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$，再把各项移到一边：`,
                ),
                [`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl(std)} = 0`],
              ],
              [
                ["Factor", "因式分解"],
                t(`Neither root is excluded, so $x = ${r1}$ or $x = ${r2}$.`, `两个根都不是被排除的值，所以 $x = ${r1}$ 或 $x = ${r2}$。`),
                [`${front(Math.abs(C))}${fac(r1)}${fac(r2)} = 0`],
              ],
            ],
            t(
              `At $x = ${r1}$ the left side is${steps(`${pairAt(r1, A, p, B, q)[0]} = ${num(pairAt(r1, A, p, B, q)[1])}`)}which is the right side, $${C}$.`,
              `$x = ${r1}$ 时左边是${steps(`${pairAt(r1, A, p, B, q)[0]} = ${num(pairAt(r1, A, p, B, q)[1])}`)}正是右边的 $${C}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-term-without-a-denominator",
      title: t("A term without a denominator", "含不带分母的项"),
      explanation: t(
        "In $x + \\frac{A}{x - p} = C$, multiplying by $x - p$ turns the term $x$ into $x(x - p)$, so the equation becomes quadratic.\n\n$$x + \\frac{4}{x - 3} = 8 \\qquad (x \\neq 3)$$\n\n$$x(x - 3) + 4 = 8(x - 3)$$\n\n$$x^{2} - 3x + 4 = 8x - 24 \\quad\\Rightarrow\\quad x^{2} - 11x + 28 = 0 \\quad\\Rightarrow\\quad (x - 4)(x - 7) = 0$$\n\nSo $x = 4$ or $x = 7$; neither is $3$.\n\nFor $x + \\frac{2}{x - 1} = 4$, with $x \\neq 1$:\n\n$$x(x - 1) + 2 = 4(x - 1) \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\nCheck: $2 + \\frac{2}{1} = 4$ and $3 + \\frac{2}{2} = 4$.\n\n> **Watch out.** The lone $x$ is a term too: it becomes $x(x - 1)$, not $x$. Forgetting it leaves a linear equation and loses a root.",
        "在 $x + \\frac{A}{x - p} = C$ 中，乘以 $x - p$ 后，$x$ 这一项变成 $x(x - p)$，方程就成了二次方程。\n\n$$x + \\frac{4}{x - 3} = 8 \\qquad (x \\neq 3)$$\n\n$$x(x - 3) + 4 = 8(x - 3)$$\n\n$$x^{2} - 3x + 4 = 8x - 24 \\quad\\Rightarrow\\quad x^{2} - 11x + 28 = 0 \\quad\\Rightarrow\\quad (x - 4)(x - 7) = 0$$\n\n所以 $x = 4$ 或 $x = 7$；两者都不是 $3$。\n\n对 $x + \\frac{2}{x - 1} = 4$，其中 $x \\neq 1$：\n\n$$x(x - 1) + 2 = 4(x - 1) \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\n检验：$2 + \\frac{2}{1} = 4$，$3 + \\frac{2}{2} = 4$。\n\n> **注意。** 单独的 $x$ 也是一项：它变成 $x(x - 1)$，而不是 $x$。漏乘会得到一次方程，丢掉一个根。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(-6, 6);
          const [r1, r2] = rng.sample(range(-8, 8), 2) as [number, number];
          const C = r1 + r2 - p;
          const A = r1 * r2 - C * p;
          if (A === 0 || Math.abs(A) > 40) continue;
          const lhs = rng.bool(0.7) ? then("x", A, bare(p)) : `${sfrac(A, bare(p))} + x`;
          const u = Q.of(A, r1 - p);
          return solutionsProblem({
            prompt: t(`Solve $${lhs} = ${C}$.`, `解方程 $${lhs} = ${C}$。`),
            values: values([r1, r2]),
            wrong: [values([-r1, -r2]), values([r1])],
            solution: walked(
              [
                [
                  ["Clear the denominator", "去分母"],
                  t(
                    `Here $x \\neq ${p}$. Multiply every term by $${bare(p)}$, then collect the terms on one side:`,
                    `这里 $x \\neq ${p}$。每一项都乘以 $${bare(p)}$，再把各项移到一边：`,
                  ),
                  [
                    `${p === 0 ? "x \\cdot x" : `x${fac(p)}`} ${plus(A).trim()} = ${C === 0 ? "0" : coefFac(C, p)}`,
                    `${pl([A + C * p, -(p + C), 1])} = 0`,
                  ],
                ],
                [
                  ["Factor", "因式分解"],
                  t(`Neither root is $${p}$, so $x = ${r1}$ or $x = ${r2}$.`, `两个根都不是 $${p}$，所以 $x = ${r1}$ 或 $x = ${r2}$。`),
                  [`${fac(r1)}${fac(r2)} = 0`],
                ],
              ],
              t(
                `At $x = ${r1}$ the left side is${steps(`${r1} ${u.sign() < 0 ? "-" : "+"} ${num(u.abs())} = ${C}`)}which is the right side.`,
                `$x = ${r1}$ 时左边是${steps(`${r1} ${u.sign() < 0 ? "-" : "+"} ${num(u.abs())} = ${C}`)}正是右边。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "one-extraneous-root",
      title: t("One extraneous root", "一个增根"),
      explanation: t(
        "The quadratic you get after clearing denominators may have a root that is an excluded value. Reject it and keep the other root.\n\n$$\\frac{x}{x - 2} + \\frac{1}{x + 1} = \\frac{6}{x^{2} - x - 2} \\qquad (x \\neq 2,\\ x \\neq -1)$$\n\n$$x(x + 1) + (x - 2) = 6 \\quad\\Rightarrow\\quad x^{2} + 2x - 8 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 4) = 0$$\n\nSince $x = 2$ is excluded, it is extraneous: the only solution is $x = -4$.\n\nFor $\\frac{x}{x - 3} - \\frac{2}{x + 1} = \\frac{12}{x^{2} - 2x - 3}$, with $x \\neq 3$ and $x \\neq -1$:\n\n$$x(x + 1) - 2(x - 3) = 12 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\nSo $x = 3$ is extraneous and $x = -2$ is the solution. Check: at $x = -2$ the left side is $\\frac{2}{5} + 2 = \\frac{12}{5}$ and the right side is $\\frac{12}{5}$.\n\n> **Watch out.** Reject only the root that is an excluded value. The other root is a solution; answering both, or neither, is wrong.",
        "去分母后得到的二次方程，可能有一个根是被排除的值。把它舍去，保留另一个根。\n\n$$\\frac{x}{x - 2} + \\frac{1}{x + 1} = \\frac{6}{x^{2} - x - 2} \\qquad (x \\neq 2,\\ x \\neq -1)$$\n\n$$x(x + 1) + (x - 2) = 6 \\quad\\Rightarrow\\quad x^{2} + 2x - 8 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 4) = 0$$\n\n因为 $x = 2$ 被排除，它是增根：唯一的解是 $x = -4$。\n\n对 $\\frac{x}{x - 3} - \\frac{2}{x + 1} = \\frac{12}{x^{2} - 2x - 3}$，其中 $x \\neq 3$ 且 $x \\neq -1$：\n\n$$x(x + 1) - 2(x - 3) = 12 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\n所以 $x = 3$ 是增根，$x = -2$ 是解。检验：$x = -2$ 时左边是 $\\frac{2}{5} + 2 = \\frac{12}{5}$，右边也是 $\\frac{12}{5}$。\n\n> **注意。** 只舍去是被排除值的那个根。另一个根是解；两个都答或都不答都是错的。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q] = rng.sample(range(-6, 6), 2) as [number, number];
          if (p === 0) continue;
          const r = other(rng, -8, 8, [p, q]);
          const B = q - p - r;
          const C = -p * r - B * p;
          if (B === 0 || C === 0) continue;
          check([-B * p - C, B - q, 1], fromRoots([p, r]));
          return solutionsProblem({
            prompt: t(
              `Solve $${then(frac("x", bare(p)), B, bare(q))} = ${sfrac(C, pl(fromRoots([p, q])))}$.`,
              `解方程 $${then(frac("x", bare(p)), B, bare(q))} = ${sfrac(C, pl(fromRoots([p, q])))}$。`,
            ),
            values: [String(r)],
            wrong: [values([r, p]), values([p]), values([-r, -p])],
            solution: walked(
              [
                [
                  ["Factor the quadratic denominator", "分解二次分母"],
                  t(
                    `$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$, so $x \\neq ${p}$ and $x \\neq ${q}$.`,
                    `$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$，所以 $x \\neq ${p}$ 且 $x \\neq ${q}$。`,
                  ),
                ],
                [
                  ["Clear the denominators", "去分母"],
                  t("Multiply every term by it and collect on one side:", "每一项都乘以它，再把各项移到一边："),
                  [
                    `x${fac(q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`,
                    `${pl(fromRoots([p, r]))} = 0`,
                    `${prodL(simple([p, r]))} = 0`,
                  ],
                ],
                [
                  ["Reject the excluded root", "舍去被排除的根"],
                  t(
                    `The root $x = ${p}$ is excluded, so it is extraneous. The only solution is $x = ${r}$.`,
                    `根 $x = ${p}$ 被排除，是增根。唯一的解是 $x = ${r}$。`,
                  ),
                ],
              ],
              t(
                `Substitute $x = ${r}$ into the left side, then the right side:${steps(`${pairAt(r, r, p, B, q)[0]} = ${num(pairAt(r, r, p, B, q)[1])}`, `${frac(String(C), String((r - p) * (r - q)))} = ${num(Q.of(C, (r - p) * (r - q)))}`)}The two sides agree.`,
                `把 $x = ${r}$ 分别代入左边和右边：${steps(`${pairAt(r, r, p, B, q)[0]} = ${num(pairAt(r, r, p, B, q)[1])}`, `${frac(String(C), String((r - p) * (r - q)))} = ${num(Q.of(C, (r - p) * (r - q)))}`)}两边相等。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.4.5 Further advanced rational equations ─────────────────────────────

/** furtherAdvancedRationalEquations solves rational equations with irrational roots, factored denominators and quadratic cross-multiplication. */
export const furtherAdvancedRationalEquations: TopicDef = {
  id: "further-advanced-rational-equations",
  title: t("Further Advanced Rational Equations", "更复杂的分式方程"),
  summary: t(
    "Solve rational equations whose quadratic needs the quadratic formula, whose denominators must be factored, or whose sides are fractions with linear numerators.",
    "解需要用求根公式的分式方程、分母需要因式分解的分式方程，以及两边都是一次分子分式的方程。",
  ),
  prerequisites: ["advanced-rational-equations", "the-quadratic-formula"],
  encompasses: [
    { topic: "advanced-rational-equations", weight: 0.5 },
    { topic: "the-quadratic-formula", weight: 0.3 },
    { topic: "rational-equations-containing-binomials", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.REI.A.2", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `Clearing $\\frac{1}{x} + \\frac{1}{x + 1} = 1$ (with $x \\neq 0$ and $x \\neq -1$) gives a quadratic that does not factor:

$$(x + 1) + x = x(x + 1) \\quad\\Rightarrow\\quad x^{2} - x - 1 = 0 \\quad\\Rightarrow\\quad x = \\frac{1 \\pm \\sqrt{5}}{2}$$

Check: the two roots multiply to $\\frac{1 - 5}{4} = -1$, the constant term of $x^{2} - x - 1$, and neither is $0$ or $-1$.

In this lesson we solve rational equations with the quadratic formula, factor a difference-of-squares denominator first, and cross-multiply two fractions to a quadratic.`,
    `对 $\\frac{1}{x} + \\frac{1}{x + 1} = 1$（$x \\neq 0$ 且 $x \\neq -1$）去分母，得到一个不能因式分解的二次方程：

$$(x + 1) + x = x(x + 1) \\quad\\Rightarrow\\quad x^{2} - x - 1 = 0 \\quad\\Rightarrow\\quad x = \\frac{1 \\pm \\sqrt{5}}{2}$$

检验：两个根的积是 $\\frac{1 - 5}{4} = -1$，正是 $x^{2} - x - 1$ 的常数项，而且它们都不是 $0$ 或 $-1$。

这节课我们用求根公式解分式方程，先分解平方差形式的分母，并把两个分式交叉相乘化为二次方程。`,
  ),
  knowledgePoints: [
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        "When the quadratic does not factor, use the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ and simplify the root.\n\n$$\\frac{1}{x} + \\frac{1}{x - 2} = 1 \\qquad (x \\neq 0,\\ x \\neq 2)$$\n\n$$(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 4x + 2 = 0$$\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 8}}{2} = \\frac{4 \\pm 2\\sqrt{2}}{2} = 2 \\pm \\sqrt{2}$$\n\nIrrational roots are never the excluded integers, so both are solutions.\n\nFor $\\frac{2}{x} + \\frac{1}{x + 1} = 1$, with $x \\neq 0$ and $x \\neq -1$:\n\n$$2(x + 1) + x = x(x + 1) \\quad\\Rightarrow\\quad x^{2} - 2x - 2 = 0$$\n\n$$x = \\frac{2 \\pm \\sqrt{12}}{2} = \\frac{2 \\pm 2\\sqrt{3}}{2} = 1 \\pm \\sqrt{3}$$\n\nCheck: $(1 + \\sqrt{3})(1 - \\sqrt{3}) = 1 - 3 = -2$, the constant term of $x^{2} - 2x - 2$.\n\n> **Watch out.** Divide every term of the numerator by the denominator: $\\frac{2 \\pm 2\\sqrt{3}}{2}$ is $1 \\pm \\sqrt{3}$, not $1 \\pm 2\\sqrt{3}$.",
        "二次式不能因式分解时，用求根公式 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$，并化简根式。\n\n$$\\frac{1}{x} + \\frac{1}{x - 2} = 1 \\qquad (x \\neq 0,\\ x \\neq 2)$$\n\n$$(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 4x + 2 = 0$$\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 8}}{2} = \\frac{4 \\pm 2\\sqrt{2}}{2} = 2 \\pm \\sqrt{2}$$\n\n无理数根不可能是被排除的整数，所以两个都是解。\n\n对 $\\frac{2}{x} + \\frac{1}{x + 1} = 1$，其中 $x \\neq 0$ 且 $x \\neq -1$：\n\n$$2(x + 1) + x = x(x + 1) \\quad\\Rightarrow\\quad x^{2} - 2x - 2 = 0$$\n\n$$x = \\frac{2 \\pm \\sqrt{12}}{2} = \\frac{2 \\pm 2\\sqrt{3}}{2} = 1 \\pm \\sqrt{3}$$\n\n检验：$(1 + \\sqrt{3})(1 - \\sqrt{3}) = 1 - 3 = -2$，正是 $x^{2} - 2x - 2$ 的常数项。\n\n> **注意。** 分子的每一项都要除以分母：$\\frac{2 \\pm 2\\sqrt{3}}{2}$ 是 $1 \\pm \\sqrt{3}$，而不是 $1 \\pm 2\\sqrt{3}$。",
      ),
      keyPrerequisites: ["the-quadratic-formula"],
      generate(rng) {
        for (;;) {
          const [p, q] = rng.sample(range(-4, 4), 2) as [number, number];
          const A = rng.nonZero(-4, 4);
          const B = rng.nonZero(-4, 4);
          const C = rng.pick([1, 1, -1, 2]);
          const a = C;
          const b = -(C * (p + q) + A + B);
          const c = C * p * q + A * q + B * p;
          const D = b * b - 4 * a * c;
          if (D <= 0 || D > 300) continue;
          const [k, m] = simplifyRadical(D);
          if (m === 1) continue;
          const root = (bb: number, den: number, s: number) => surdLatex(surd(Q.of(-bb, den), Q.of(s * k, den), BigInt(m)));
          const answer = [root(b, 2 * a, 1), root(b, 2 * a, -1)];
          return solutionsProblem({
            prompt: t(
              `Solve $${then(sfrac(A, bare(p)), B, bare(q))} = ${C}$. Give exact answers.`,
              `解方程 $${then(sfrac(A, bare(p)), B, bare(q))} = ${C}$。给出精确解。`,
            ),
            values: answer,
            wrong: [[root(-b, 2 * a, 1), root(-b, 2 * a, -1)], [root(b, a, 1), root(b, a, -1)], [answer[0]!]],
            solution: walked(
              [
                [
                  ["Clear the denominators", "去分母"],
                  t(
                    `Here $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by $${prodL(simple([p, q]))}$ and collect the terms on one side:`,
                    `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$，再把各项移到一边：`,
                  ),
                  [`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl([c, b, a])} = 0`],
                ],
                [
                  ["Use the quadratic formula", "用求根公式"],
                  t(
                    `The discriminant $${D}$ is not a perfect square, so this does not factor:`,
                    `判别式 $${D}$ 不是完全平方数，所以它不能因式分解：`,
                  ),
                  [`x = \\frac{${num(-b)} \\pm \\sqrt{${D}}}{${2 * a}}`, `x_{1} = ${answer[0]}, \\quad x_{2} = ${answer[1]}`],
                ],
              ],
              t(
                `Both roots are irrational, so neither is the excluded $${p}$ or $${q}$. Their sum is minus the coefficient of $x$ over the coefficient of $x^{2}$:${steps(`\\left(${answer[0]}\\right) + \\left(${answer[1]}\\right) = ${num(Q.of(-b, a))}`)}as it should be for $${pl([c, b, a])} = 0$.`,
                `两个根都是无理数，所以都不是被排除的 $${p}$ 或 $${q}$。它们的和等于 $x$ 的系数的相反数除以 $x^{2}$ 的系数：${steps(`\\left(${answer[0]}\\right) + \\left(${answer[1]}\\right) = ${num(Q.of(-b, a))}`)}与 $${pl([c, b, a])} = 0$ 相符。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "factoring-a-difference-of-squares-denominator",
      title: t("Factoring the denominator first", "先分解分母"),
      explanation: t(
        "A denominator such as $x^{2} - 9$ is the difference of squares $(x - 3)(x + 3)$. Factor it to find the LCD and the excluded values, then clear the denominators.\n\n$$\\frac{x}{x - 3} + \\frac{2}{x + 3} = \\frac{18}{x^{2} - 9} \\qquad (x \\neq \\pm 3)$$\n\n$$x(x + 3) + 2(x - 3) = 18 \\quad\\Rightarrow\\quad x^{2} + 5x - 24 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 8) = 0$$\n\n$x = 3$ is excluded, so the only solution is $x = -8$.\n\nFor $\\frac{x}{x - 2} + \\frac{1}{x + 2} = \\frac{8}{x^{2} - 4}$, with $x^{2} - 4 = (x - 2)(x + 2)$ and $x \\neq \\pm 2$:\n\n$$x(x + 2) + (x - 2) = 8 \\quad\\Rightarrow\\quad x^{2} + 3x - 10 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 5) = 0$$\n\nSo $x = 2$ is excluded and $x = -5$ is the solution. Check: at $x = -5$ the left side is $\\frac{5}{7} - \\frac{1}{3} = \\frac{8}{21}$, and the right side is $\\frac{8}{21}$.\n\n> **Watch out.** $x^{2} - 4$ is $(x - 2)(x + 2)$, not $(x - 2)^{2}$, so both $2$ and $-2$ are excluded.",
        "像 $x^{2} - 9$ 这样的分母是平方差 $(x - 3)(x + 3)$。先分解它，得到最简公分母和被排除的值，再去分母。\n\n$$\\frac{x}{x - 3} + \\frac{2}{x + 3} = \\frac{18}{x^{2} - 9} \\qquad (x \\neq \\pm 3)$$\n\n$$x(x + 3) + 2(x - 3) = 18 \\quad\\Rightarrow\\quad x^{2} + 5x - 24 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 8) = 0$$\n\n$x = 3$ 被排除，所以唯一的解是 $x = -8$。\n\n对 $\\frac{x}{x - 2} + \\frac{1}{x + 2} = \\frac{8}{x^{2} - 4}$，有 $x^{2} - 4 = (x - 2)(x + 2)$，$x \\neq \\pm 2$：\n\n$$x(x + 2) + (x - 2) = 8 \\quad\\Rightarrow\\quad x^{2} + 3x - 10 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 5) = 0$$\n\n所以 $x = 2$ 被排除，$x = -5$ 是解。检验：$x = -5$ 时左边是 $\\frac{5}{7} - \\frac{1}{3} = \\frac{8}{21}$，右边也是 $\\frac{8}{21}$。\n\n> **注意。** $x^{2} - 4$ 是 $(x - 2)(x + 2)$，而不是 $(x - 2)^{2}$，所以 $2$ 和 $-2$ 都要排除。",
      ),
      keyPrerequisites: ["factoring-differences-of-squares"],
      generate(rng) {
        for (;;) {
          const p = rng.int(1, 6);
          const r1 = rng.bool(0.4) ? rng.pick([p, -p]) : rng.int(-8, 8);
          const r2 = other(rng, -8, 8, [r1]);
          const B = -(r1 + r2) - p;
          const C = -B * p - r1 * r2;
          if (B === 0 || C === 0) continue;
          check([-(B * p + C), p + B, 1], fromRoots([r1, r2]));
          const answer = [r1, r2].filter((r) => r !== p && r !== -p);
          const out = [r1, r2].filter((r) => r === p || r === -p);
          return solutionsProblem({
            prompt: t(
              `Solve $${then(frac("x", bare(p)), B, bare(-p))} = ${sfrac(C, `x^{2} - ${p * p}`)}$. If there is no solution, answer "no solution".`,
              `解方程 $${then(frac("x", bare(p)), B, bare(-p))} = ${sfrac(C, `x^{2} - ${p * p}`)}$。若无解，回答“无解”。`,
            ),
            values: values(answer),
            wrong: [values([r1, r2]), values([-r1, -r2]), ...(answer.length === 2 ? [values([r1])] : [])],
            solution: walked(
              [
                [
                  ["Factor the denominator", "分解分母"],
                  t(
                    `$x^{2} - ${p * p} = (x - ${p})(x + ${p})$, so $x \\neq \\pm ${p}$.`,
                    `$x^{2} - ${p * p} = (x - ${p})(x + ${p})$，所以 $x \\neq \\pm ${p}$。`,
                  ),
                ],
                [
                  ["Clear the denominators", "去分母"],
                  t("Multiply every term by it and collect on one side:", "每一项都乘以它，再把各项移到一边："),
                  [
                    `x(x + ${p}) ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`,
                    `${pl(fromRoots([r1, r2]))} = 0`,
                    `${prodL(simple([r1, r2]))} = 0`,
                  ],
                ],
                [
                  ["Compare with the excluded values", "与被排除的值比较"],
                  answer.length === 2
                    ? t(
                        `Neither root is $\\pm ${p}$, so $x = ${r1}$ or $x = ${r2}$.`,
                        `两个根都不是 $\\pm ${p}$，所以 $x = ${r1}$ 或 $x = ${r2}$。`,
                      )
                    : answer.length === 1
                      ? t(
                          `The root $x = ${out[0]}$ is excluded, so the only solution is $x = ${answer[0]}$.`,
                          `根 $x = ${out[0]}$ 被排除，所以唯一的解是 $x = ${answer[0]}$。`,
                        )
                      : t("Both roots are excluded, so there is no solution.", "两个根都被排除，所以方程无解。"),
                ],
              ],
              answer.length > 0
                ? t(
                    `Substitute $x = ${answer[0]}$ into the left side, then the right side:${steps(`${pairAt(answer[0]!, answer[0]!, p, B, -p)[0]} = ${num(pairAt(answer[0]!, answer[0]!, p, B, -p)[1])}`, `${frac(String(C), String(answer[0]! ** 2 - p * p))} = ${num(Q.of(C, answer[0]! ** 2 - p * p))}`)}The two sides agree.`,
                    `把 $x = ${answer[0]}$ 分别代入左边和右边：${steps(`${pairAt(answer[0]!, answer[0]!, p, B, -p)[0]} = ${num(pairAt(answer[0]!, answer[0]!, p, B, -p)[1])}`, `${frac(String(C), String(answer[0]! ** 2 - p * p))} = ${num(Q.of(C, answer[0]! ** 2 - p * p))}`)}两边相等。`,
                  )
                : t(
                    `Both $${r1}$ and $${r2}$ make $x^{2} - ${p * p}$ equal to $0$, since $${p}^{2} = ${p * p}$, so neither can be substituted.`,
                    `$${r1}$ 和 $${r2}$ 都使 $x^{2} - ${p * p}$ 等于 $0$（因为 $${p}^{2} = ${p * p}$），所以都不能代入。`,
                  ),
            ),
          });
        }
      },
    },
    {
      id: "cross-multiplying-to-a-quadratic",
      title: t("Cross-multiplying to a quadratic", "交叉相乘得到二次方程"),
      explanation: t(
        "When each side is one fraction with a linear numerator, cross-multiply. The products are quadratics, and when the $x^{2}$ terms do not cancel the result is a quadratic equation.\n\n$$\\frac{2x - 1}{x - 1} = \\frac{x + 7}{x + 1} \\qquad (x \\neq \\pm 1)$$\n\n$$(2x - 1)(x + 1) = (x + 7)(x - 1)$$\n\n$$2x^{2} + x - 1 = x^{2} + 6x - 7 \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\nNeither $2$ nor $3$ is excluded, so $x = 2$ or $x = 3$.\n\nFor $\\frac{x + 2}{x} = \\frac{2x - 5}{x - 2}$, with $x \\neq 0$ and $x \\neq 2$:\n\n$$(x + 2)(x - 2) = x(2x - 5) \\quad\\Rightarrow\\quad x^{2} - 4 = 2x^{2} - 5x \\quad\\Rightarrow\\quad x^{2} - 5x + 4 = 0$$\n\nSo $(x - 1)(x - 4) = 0$. Check: at $x = 1$ both sides are $3$; at $x = 4$ both are $\\frac{3}{2}$.\n\n> **Watch out.** Different $x^{2}$ coefficients do not cancel. Collect everything on one side and solve the quadratic; do not treat it as a linear equation.",
        "当方程两边都是一个分子为一次式的分式时，交叉相乘。乘积是二次式，若 $x^{2}$ 项没有抵消，就得到二次方程。\n\n$$\\frac{2x - 1}{x - 1} = \\frac{x + 7}{x + 1} \\qquad (x \\neq \\pm 1)$$\n\n$$(2x - 1)(x + 1) = (x + 7)(x - 1)$$\n\n$$2x^{2} + x - 1 = x^{2} + 6x - 7 \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\n$2$ 和 $3$ 都不是被排除的值，所以 $x = 2$ 或 $x = 3$。\n\n对 $\\frac{x + 2}{x} = \\frac{2x - 5}{x - 2}$，其中 $x \\neq 0$ 且 $x \\neq 2$：\n\n$$(x + 2)(x - 2) = x(2x - 5) \\quad\\Rightarrow\\quad x^{2} - 4 = 2x^{2} - 5x \\quad\\Rightarrow\\quad x^{2} - 5x + 4 = 0$$\n\n所以 $(x - 1)(x - 4) = 0$。检验：$x = 1$ 时两边都是 $3$；$x = 4$ 时两边都是 $\\frac{3}{2}$。\n\n> **注意。** $x^{2}$ 的系数不同时不会抵消。把所有项移到一边，解二次方程；不要把它当成一次方程。",
      ),
      generate(rng) {
        for (;;) {
          const [a, c] = rng.sample([-3, -2, -1, 1, 2, 3], 2) as [number, number];
          const [p, q] = rng.sample(range(-5, 5), 2) as [number, number];
          const [r1, r2] = rng.sample(
            range(-6, 6).filter((r) => r !== p && r !== q),
            2,
          ) as [number, number];
          const S = a * q - c * p - (a - c) * (r1 + r2);
          const Pp = (a - c) * r1 * r2;
          if ((Pp + S * q) % (p - q) !== 0) continue;
          const d = (Pp + S * q) / (p - q);
          const b = d + S;
          if (Math.abs(b) > 30 || Math.abs(d) > 30 || a * p + b === 0 || c * q + d === 0) continue;
          const left = mulP([b, a], [-q, 1]);
          const right = mulP([d, c], [-p, 1]);
          const diff = subP(left, right);
          check(diff, fromRoots([r1, r2], a - c));
          const std = a - c < 0 ? scaleP(diff, -1) : diff;
          const [u, v] = [Q.of(a * r1 + b, r1 - p), Q.of(c * r1 + d, r1 - q)];
          return solutionsProblem({
            prompt: t(
              `Solve $${frac(linear(a, b), bare(p))} = ${frac(linear(c, d), bare(q))}$.`,
              `解方程 $${frac(linear(a, b), bare(p))} = ${frac(linear(c, d), bare(q))}$。`,
            ),
            values: values([r1, r2]),
            wrong: [values([-r1, -r2]), values([r1])],
            solution: walked(
              [
                [
                  ["Cross-multiply", "交叉相乘"],
                  t(
                    `Here $x \\neq ${p}$ and $x \\neq ${q}$. Cross-multiply and expand:`,
                    `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。交叉相乘并展开：`,
                  ),
                  [`(${linear(a, b)})${fac(q)} = (${linear(c, d)})${fac(p)}`, `${pl(left)} = ${pl(right)}`],
                ],
                [
                  ["Collect and factor", "移项并因式分解"],
                  t(
                    `Neither root is excluded, so $x = ${r1}$ or $x = ${r2}$.`,
                    `两个根都不是被排除的值，所以 $x = ${r1}$ 或 $x = ${r2}$。`,
                  ),
                  [`${pl(std)} = 0`, `${front(Math.abs(a - c))}${fac(r1)}${fac(r2)} = 0`],
                ],
              ],
              t(
                `At $x = ${r1}$ the two sides are${steps(`${frac(String(a * r1 + b), String(r1 - p))} = ${num(u)}, \\quad ${frac(String(c * r1 + d), String(r1 - q))} = ${num(v)}`)}which agree.`,
                `$x = ${r1}$ 时两边分别是${steps(`${frac(String(a * r1 + b), String(r1 - p))} = ${num(u)}, \\quad ${frac(String(c * r1 + d), String(r1 - q))} = ${num(v)}`)}两者相等。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.5.1 Roots of rational functions ─────────────────────────────────────

/** RootedLinear is a linear factor kx − m with root m/k. */
type Lin = readonly [k: number, m: number];

const linLatex = ([k, m]: Lin) => (k === 1 ? fac(m) : `(${linear(k, -m)})`);
const linRoot = ([k, m]: Lin) => Q.of(m, k);

/** rootsOfRationalFunctions finds the zeros of a rational function: the zeros of the numerator that are not zeros of the denominator. */
export const rootsOfRationalFunctions: TopicDef = {
  id: "roots-of-rational-functions",
  title: t("Roots of Rational Functions", "分式函数的零点"),
  summary: t(
    "Find the roots and intercepts of a rational function: the zeros of its numerator that are not zeros of its denominator.",
    "求分式函数的零点和截距：分子的零点中不是分母零点的那些。",
  ),
  prerequisites: ["closure-properties-of-rational-expressions", "simplifying-rational-expressions-using-polynomial-factorization"],
  encompasses: [{ topic: "roots-of-a-function", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `The function $f(x) = \\frac{x^{2} - 4}{x^{2} + 1}$ is $0$ where its numerator is: $x^{2} - 4 = (x - 2)(x + 2)$ is $0$ at $x = 2$ and $x = -2$, and the denominator $x^{2} + 1$ is never $0$. So the roots are $2$ and $-2$. Its $y$-intercept is $f(0) = \\frac{-4}{1} = -4$.

Check: $f(2) = \\frac{0}{5} = 0$.

In this lesson we find the roots of a rational function from factored and from expanded forms, and find where its graph crosses the $y$-axis.`,
    `函数 $f(x) = \\frac{x^{2} - 4}{x^{2} + 1}$ 在分子为 $0$ 的地方为 $0$：$x^{2} - 4 = (x - 2)(x + 2)$ 在 $x = 2$ 和 $x = -2$ 处为 $0$，而分母 $x^{2} + 1$ 永不为 $0$。所以零点是 $2$ 和 $-2$。它的 $y$ 轴截距是 $f(0) = \\frac{-4}{1} = -4$。

检验：$f(2) = \\frac{0}{5} = 0$。

这节课我们由因式分解形式和展开形式求分式函数的零点，并求它的图象与 $y$ 轴的交点。`,
  ),
  knowledgePoints: [
    {
      id: "roots-of-factored-rational-functions",
      title: t("Roots from factored forms", "由因式分解形式求零点"),
      explanation: t(
        "A **rational function** is $f(x) = \\frac{p(x)}{q(x)}$ with polynomials $p$ and $q$. A fraction is $0$ exactly when its numerator is $0$ and its denominator is not. So the roots of $f$ are the zeros of $p$ that are not zeros of $q$.\n\n$$f(x) = \\frac{(x - 2)(x + 5)}{(x - 2)(x + 1)}$$\n\nThe numerator is $0$ at $x = 2$ and $x = -5$. But $x = 2$ also makes the denominator $0$, so $f(2)$ is not defined. The only root is $x = -5$.\n\nFor $f(x) = \\frac{(x + 3)(x - 4)}{(x - 4)(x + 1)}$, the numerator is $0$ at $x = -3$ and $x = 4$, but $x = 4$ makes the denominator $0$. The only root is $x = -3$. Check: $f(-3) = \\frac{0 \\cdot (-7)}{(-7)(-2)} = 0$.\n\n> **Watch out.** A zero of the denominator is never a root, even when the numerator is $0$ there too; and a zero of the denominator alone is where $f$ is not defined, not where it is $0$.",
        "**分式函数**是 $f(x) = \\frac{p(x)}{q(x)}$，其中 $p$、$q$ 是多项式。分式为 $0$ 当且仅当分子为 $0$ 而分母不为 $0$。所以 $f$ 的零点是 $p$ 的零点中不是 $q$ 的零点的那些。\n\n$$f(x) = \\frac{(x - 2)(x + 5)}{(x - 2)(x + 1)}$$\n\n分子在 $x = 2$ 和 $x = -5$ 处为 $0$。但 $x = 2$ 也使分母为 $0$，$f(2)$ 无意义。唯一的零点是 $x = -5$。\n\n对 $f(x) = \\frac{(x + 3)(x - 4)}{(x - 4)(x + 1)}$，分子在 $x = -3$ 和 $x = 4$ 处为 $0$，但 $x = 4$ 使分母为 $0$。唯一的零点是 $x = -3$。检验：$f(-3) = \\frac{0 \\cdot (-7)}{(-7)(-2)} = 0$。\n\n> **注意。** 分母的零点永远不是零点，即使分子在那里也为 $0$；分母的零点是 $f$ 无意义的地方，而不是 $f$ 为 $0$ 的地方。",
      ),
      generate(rng) {
        const den = rng.sample(range(-7, 7), rng.pick([1, 2]));
        const share = rng.bool(0.5);
        const n2 = rng.pick([1, 2]);
        const nums = share
          ? [rng.pick(den), ...(n2 === 2 ? [other(rng, -7, 7, den)] : [])]
          : rng.sample(
              range(-7, 7).filter((r) => !den.includes(r)),
              n2,
            );
        const a = rng.pick([1, 1, 2, -1, 3, -2]);
        const answer = nums.filter((r) => !den.includes(r));
        const f = frac(prodL(simple(nums), a), prodL(simple(den)));
        return solutionsProblem({
          prompt: t(
            `Find the roots of $f(x) = ${f}$. If there are none, answer "no solution".`,
            `求 $f(x) = ${f}$ 的零点。若没有零点，回答“无解”。`,
          ),
          values: values(answer),
          wrong: [values(nums), values(den), values(answer.map((r) => -r)), values([...nums, ...den])],
          solution: walked(
            [
              [
                ["Find the zeros of the numerator", "求分子的零点"],
                t(`The numerator is $0$ at ${listText(nums)}.`, `分子在 ${listText(nums, "、")} 处为 $0$。`),
              ],
              [
                ["Remove the zeros of the denominator", "去掉分母的零点"],
                t(
                  `${share ? `But $x = ${nums[0]}$ also makes the denominator $0$, so it is not a root. ` : "None of these makes the denominator $0$. "}${answer.length ? `The root${answer.length > 1 ? "s are" : " is"} ${listText(answer)}.` : "So $f$ has no roots."}`,
                  `${share ? `但 $x = ${nums[0]}$ 也使分母为 $0$，所以它不是零点。` : "它们都不使分母为 $0$。"}${answer.length ? `零点是 ${listText(answer, "、")}。` : "所以 $f$ 没有零点。"}`,
                ),
              ],
            ],
            answer.length
              ? t(
                  `At $x = ${answer[0]}$ the numerator is $0$ and the denominator is not:${steps(`${den.map((d) => `\\left(${answer[0]} - ${paren(d)}\\right)`).join("")} = ${den.reduce((s, d) => s * (answer[0]! - d), 1)} \\neq 0`)}so $f(${answer[0]}) = 0$.`,
                  `$x = ${answer[0]}$ 时分子为 $0$，分母不为 $0$：${steps(`${den.map((d) => `\\left(${answer[0]} - ${paren(d)}\\right)`).join("")} = ${den.reduce((s, d) => s * (answer[0]! - d), 1)} \\neq 0`)}所以 $f(${answer[0]}) = 0$。`,
                )
              : t(
                  `At $x = ${nums[0]}$ the factor $${bare(nums[0]!)}$ of the denominator is $0$, so $f(${nums[0]})$ is not defined and cannot be $0$.`,
                  `$x = ${nums[0]}$ 时分母的因式 $${bare(nums[0]!)}$ 为 $0$，所以 $f(${nums[0]})$ 无意义，不可能为 $0$。`,
                ),
          ),
        });
      },
    },
    {
      id: "factoring-to-find-roots",
      title: t("Factoring to find the roots", "因式分解求零点"),
      explanation: t(
        "When the numerator and denominator are expanded, factor both first.\n\n$$f(x) = \\frac{2x^{2} + 3x - 2}{x^{2} - 4} = \\frac{(2x - 1)(x + 2)}{(x - 2)(x + 2)}$$\n\nThe numerator is $0$ at $x = \\frac{1}{2}$ and $x = -2$, but the denominator is $0$ at $x = -2$ too. The only root is $x = \\frac{1}{2}$.\n\nFor $f(x) = \\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)}$, the numerator is $0$ at $x = 3$ and $x = -2$, and $x = 3$ also makes the denominator $0$. The only root is $x = -2$. Check: $f(-2) = \\frac{4 + 2 - 6}{4 - 9} = \\frac{0}{-5} = 0$.\n\n> **Watch out.** A factor $kx - m$ is $0$ at $x = \\frac{m}{k}$, not at $x = m$: $3x - 2$ is $0$ at $x = \\frac{2}{3}$.",
        "如果分子和分母都是展开式，先把它们因式分解。\n\n$$f(x) = \\frac{2x^{2} + 3x - 2}{x^{2} - 4} = \\frac{(2x - 1)(x + 2)}{(x - 2)(x + 2)}$$\n\n分子在 $x = \\frac{1}{2}$ 和 $x = -2$ 处为 $0$，但分母在 $x = -2$ 处也为 $0$。唯一的零点是 $x = \\frac{1}{2}$。\n\n对 $f(x) = \\frac{x^{2} - x - 6}{x^{2} - 9} = \\frac{(x - 3)(x + 2)}{(x - 3)(x + 3)}$，分子在 $x = 3$ 和 $x = -2$ 处为 $0$，而 $x = 3$ 也使分母为 $0$。唯一的零点是 $x = -2$。检验：$f(-2) = \\frac{4 + 2 - 6}{4 - 9} = \\frac{0}{-5} = 0$。\n\n> **注意。** 因式 $kx - m$ 在 $x = \\frac{m}{k}$ 处为 $0$，而不是在 $x = m$ 处：$3x - 2$ 在 $x = \\frac{2}{3}$ 处为 $0$。",
      ),
      keyPrerequisites: ["simplifying-rational-expressions-using-polynomial-factorization"],
      generate(rng) {
        for (;;) {
          const r = rng.int(-6, 6);
          const lead = rng.bool(0.5);
          const k = lead ? rng.int(2, 4) : 1;
          const m = rng.nonZero(-7, 7);
          if (gcd(k, m) !== 1) continue;
          const l1: Lin = [k, m];
          const l2: Lin = [1, r];
          const numRoots = [linRoot(l1), linRoot(l2)];
          if (numRoots[0]!.eq(numRoots[1]!)) continue;
          const share = rng.bool(0.5);
          const d1 = share ? r : rng.int(-6, 6);
          const d2 = other(rng, -6, 6, [d1, r]);
          const N = mulP([-m, k], [-r, 1]);
          const D = fromRoots([d1, d2]);
          const answer = numRoots.filter((x) => !x.eq(Q.of(d1)) && !x.eq(Q.of(d2)));
          if (answer.length === 2 && !share && rng.bool(0.5)) continue;
          const nf = r === 0 ? `x${linLatex(l1)}` : `${linLatex(l1)}${linLatex(l2)}`;
          const df = prodL(simple([d1, d2]));
          const lost = numRoots.filter((x) => !answer.includes(x));
          const qAt = (x: Q) => x.sub(Q.of(d1)).mul(x.sub(Q.of(d2)));
          const qLine = (x: Q) => `\\left(${num(x)} - ${paren(d1)}\\right)\\left(${num(x)} - ${paren(d2)}\\right) = ${num(qAt(x))} \\neq 0`;
          return solutionsProblem({
            prompt: t(`Find the roots of $f(x) = ${frac(pl(N), pl(D))}$.`, `求 $f(x) = ${frac(pl(N), pl(D))}$ 的零点。`),
            values: values(answer),
            wrong: [values(numRoots), values([d1, d2]), values(answer.map((x) => x.neg()))],
            solution: walked(
              [
                [
                  ["Factor", "因式分解"],
                  t("Factor the numerator and the denominator:", "把分子和分母因式分解："),
                  [`f(x) = ${frac(nf, df)}`],
                ],
                [
                  ["Compare the zeros", "比较零点"],
                  t(
                    `The numerator is $0$ at ${listText(numRoots)}${lost.length ? `, but ${listText(lost)} also make${lost.length === 1 ? "s" : ""} the denominator $0$` : ", and the denominator is not $0$ there"}. ${answer.length ? `So the root${answer.length > 1 ? "s are" : " is"} ${listText(answer)}.` : "So $f$ has no roots."}`,
                    `分子在 ${listText(numRoots, "、")} 处为 $0$${lost.length ? `，但 ${listText(lost, "、")} 也使分母为 $0$` : "，而分母在这些地方不为 $0$"}。${answer.length ? `所以零点是 ${listText(answer, "、")}。` : "所以 $f$ 没有零点。"}`,
                  ),
                ],
              ],
              answer.length
                ? t(
                    `The denominator is not $0$ at $x = ${num(answer[0]!)}$:${steps(`${qLine(answer[0]!)}`)}while a factor of the numerator is $0$ there, so $f$ is $0$ there.`,
                    `分母在 $x = ${num(answer[0]!)}$ 处不为 $0$：${steps(`${qLine(answer[0]!)}`)}而分子的一个因式在那里为 $0$，所以 $f$ 在那里为 $0$。`,
                  )
                : t(
                    "Each zero of the numerator makes a factor of the denominator $0$ as well, so $f$ is not defined at either of them.",
                    "分子的每个零点也使分母的某个因式为 $0$，所以 $f$ 在这些地方都无意义。",
                  ),
            ),
          });
        }
      },
    },
    {
      id: "intercepts-of-rational-functions",
      figure: precalculusDrawings["roots-of-rational-functions#intercepts-of-rational-functions"],
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "The $y$-intercept of $f(x) = \\frac{p(x)}{q(x)}$ is $(0, f(0))$, where $f(0) = \\frac{p(0)}{q(0)}$ is the constant term of the numerator over the constant term of the denominator. It exists only when $q(0) \\neq 0$.\n\n$$f(x) = \\frac{x^{2} - 3x + 6}{2x^{2} + x - 4}: \\quad f(0) = \\frac{6}{-4} = -\\frac{3}{2}$$\n\nso the graph crosses the $y$-axis at $\\left(0, -\\frac{3}{2}\\right)$.\n\nFor $f(x) = \\frac{2x - 8}{x^{2} + 4}$: $f(0) = \\frac{-8}{4} = -2$, so the $y$-intercept is $(0, -2)$. Check: $-2 \\cdot 4 = -8$, the constant term of the numerator.\n\n> **Watch out.** The $y$-intercept uses the constant terms, $f(0)$. The ratio of the leading coefficients belongs to the horizontal asymptote, and the zeros of the numerator are the $x$-intercepts.",
        "$f(x) = \\frac{p(x)}{q(x)}$ 的 $y$ 轴截距是 $(0, f(0))$，其中 $f(0) = \\frac{p(0)}{q(0)}$ 是分子的常数项除以分母的常数项。只有当 $q(0) \\neq 0$ 时它才存在。\n\n$$f(x) = \\frac{x^{2} - 3x + 6}{2x^{2} + x - 4}: \\quad f(0) = \\frac{6}{-4} = -\\frac{3}{2}$$\n\n所以图象与 $y$ 轴交于 $\\left(0, -\\frac{3}{2}\\right)$。\n\n对 $f(x) = \\frac{2x - 8}{x^{2} + 4}$：$f(0) = \\frac{-8}{4} = -2$，所以 $y$ 轴截距是 $(0, -2)$。检验：$-2 \\cdot 4 = -8$，正是分子的常数项。\n\n> **注意。** $y$ 轴截距用的是常数项，即 $f(0)$。首项系数之比属于水平渐近线，分子的零点是 $x$ 轴截距。",
      ),
      generate(rng) {
        for (;;) {
          const N = randomPoly(rng, rng.int(1, 2));
          const D = randomPoly(rng, rng.int(1, 2), 3);
          const [n0, d0] = [N[0]!, D[0]!];
          if (d0 === 0 || n0 === 0) continue;
          const y = Q.of(n0, d0);
          return pointProblem({
            prompt: t(
              `At which point does the graph of $f(x) = ${frac(pl(N), pl(D))}$ cross the $y$-axis?`,
              `$f(x) = ${frac(pl(N), pl(D))}$ 的图象与 $y$ 轴交于哪一点？`,
            ),
            answer: [0, y],
            wrong: [
              [0, Q.of(d0, n0)],
              [y, 0],
              [0, Q.of(N[deg(N)]!, D[deg(D)]!)],
            ],
            solution: walked(
              [
                [
                  ["Set $x = 0$", "令 $x = 0$"],
                  t(
                    `On the $y$-axis $x = 0$, and every term with $x$ vanishes, leaving the constant terms $${n0}$ and $${d0}$.`,
                    `在 $y$ 轴上 $x = 0$，含 $x$ 的项都为 $0$，只剩常数项 $${n0}$ 和 $${d0}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(`The point is $(0, ${num(y)})$:`, `交点是 $(0, ${num(y)})$：`),
                  [`f(0) = ${frac(String(n0), String(d0))} = ${num(y)}`],
                ],
              ],
              t(
                `Multiply back by the denominator's constant term:${steps(`${num(y)} \\cdot ${paren(d0)} = ${n0}`)}which is the numerator's constant term.`,
                `乘回分母的常数项：${steps(`${num(y)} \\cdot ${paren(d0)} = ${n0}`)}正是分子的常数项。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.5.2 Vertical asymptotes of rational functions ───────────────────────

/** expandF expands lead·∏(x − r)^m·(x² + k). */
const expandF = (lead: number, fs: readonly Factor[], k = 0) =>
  mulP(
    fs.flatMap(([r, m]) => Array.from({ length: m }, () => r)).reduce<number[]>((p, r) => mulP(p, [-r, 1]), [lead]),
    k > 0 ? [k, 0, 1] : [1],
  );

/** verticalAsymptotesOfRationalFunctions finds vertical asymptotes after factoring the denominator. */
export const verticalAsymptotesOfRationalFunctions: TopicDef = {
  id: "vertical-asymptotes-of-rational-functions",
  title: t("Vertical Asymptotes of Rational Functions", "分式函数的竖直渐近线"),
  summary: t(
    "Find the vertical asymptotes of a rational function by factoring its denominator and cancelling common factors.",
    "通过分解分母并约去公因式，求分式函数的竖直渐近线。",
  ),
  prerequisites: [
    "roots-of-rational-functions",
    "unbounded-behavior-of-functions-near-a-point",
    "factoring-cubic-polynomials-using-the-factor-theorem",
  ],
  encompasses: [{ topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.5 }],
  xp: 13,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `The function $f(x) = \\frac{3}{x^{2} - 4x} = \\frac{3}{x(x - 4)}$ has a denominator that is $0$ at $x = 0$ and $x = 4$, and a numerator that is never $0$. Near those values $f$ grows without bound, so the lines $x = 0$ and $x = 4$ are its vertical asymptotes.

Check: $f(4.01) = \\frac{3}{4.01 \\cdot 0.01} \\approx 75$, and it gets larger as $x$ gets closer to $4$.

In this lesson we find vertical asymptotes when the denominator has a leading coefficient or is a cubic, and count them when factors repeat, never vanish or cancel.`,
    `函数 $f(x) = \\frac{3}{x^{2} - 4x} = \\frac{3}{x(x - 4)}$ 的分母在 $x = 0$ 和 $x = 4$ 处为 $0$，分子永不为 $0$。在这些值附近 $f$ 无界增大，所以直线 $x = 0$ 和 $x = 4$ 是它的竖直渐近线。

检验：$f(4.01) = \\frac{3}{4.01 \\cdot 0.01} \\approx 75$，$x$ 越接近 $4$ 它越大。

这节课我们求分母有首项系数或是三次式时的竖直渐近线，并在因式重复、永不为零或被约去时数出渐近线的条数。`,
  ),
  knowledgePoints: [
    {
      id: "denominators-with-leading-coefficients",
      figure: precalculusDrawings["vertical-asymptotes-of-rational-functions#denominators-with-leading-coefficients"],
      title: t("Denominators with leading coefficients", "首项系数不为 1 的分母"),
      explanation: t(
        "$f(x) = \\frac{p(x)}{q(x)}$ has a **vertical asymptote** $x = a$ when $q(a) = 0$ and the factor $x - a$ does not cancel with the numerator. Near such an $a$, $f$ grows without bound.\n\nFactor the denominator completely; a factor $kx - m$ gives $x = \\frac{m}{k}$:\n\n$$f(x) = \\frac{5}{6x^{2} + x - 2} = \\frac{5}{(2x - 1)(3x + 2)}$$\n\nThe vertical asymptotes are $x = \\frac{1}{2}$ and $x = -\\frac{2}{3}$.\n\nFor $f(x) = \\frac{x + 1}{4x^{2} - 9} = \\frac{x + 1}{(2x - 3)(2x + 3)}$, the vertical asymptotes are $x = \\frac{3}{2}$ and $x = -\\frac{3}{2}$. Check: $4\\left(\\frac{3}{2}\\right)^{2} - 9 = 9 - 9 = 0$, and the numerator is $\\frac{5}{2}$ there, not $0$.\n\n> **Watch out.** Solve each factor: $2x - 3 = 0$ gives $x = \\frac{3}{2}$, not $x = 3$ or $x = -\\frac{3}{2}$.",
        "若 $q(a) = 0$，且因式 $x - a$ 不能与分子约去，则 $f(x) = \\frac{p(x)}{q(x)}$ 有**竖直渐近线** $x = a$。在这样的 $a$ 附近，$f$ 无界增大。\n\n把分母完全分解；因式 $kx - m$ 给出 $x = \\frac{m}{k}$：\n\n$$f(x) = \\frac{5}{6x^{2} + x - 2} = \\frac{5}{(2x - 1)(3x + 2)}$$\n\n竖直渐近线是 $x = \\frac{1}{2}$ 和 $x = -\\frac{2}{3}$。\n\n对 $f(x) = \\frac{x + 1}{4x^{2} - 9} = \\frac{x + 1}{(2x - 3)(2x + 3)}$，竖直渐近线是 $x = \\frac{3}{2}$ 和 $x = -\\frac{3}{2}$。检验：$4\\left(\\frac{3}{2}\\right)^{2} - 9 = 9 - 9 = 0$，而分子在那里是 $\\frac{5}{2}$，不为 $0$。\n\n> **注意。** 要分别解每个因式：$2x - 3 = 0$ 给出 $x = \\frac{3}{2}$，而不是 $x = 3$ 或 $x = -\\frac{3}{2}$。",
      ),
      keyPrerequisites: ["unbounded-behavior-of-functions-near-a-point"],
      generate(rng) {
        for (;;) {
          const a = rng.int(1, 4);
          const c = rng.int(1, 4);
          if (a === 1 && c === 1) continue;
          const b = rng.nonZero(-7, 7);
          const d = rng.nonZero(-7, 7);
          if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
          const r1 = Q.of(-b, a);
          const r2 = Q.of(-d, c);
          if (r1.eq(r2)) continue;
          const D = mulP([b, a], [d, c]);
          const s = rng.int(-6, 6);
          const top = rng.bool() ? String(rng.nonZero(-9, 9)) : bare(s);
          if (top === bare(s) && (r1.eq(Q.of(s)) || r2.eq(Q.of(s)))) continue;
          const answer = [r1, r2];
          const zero = (k: number, m: number, r: Q) => `${k === 1 ? "" : k}\\left(${num(r)}\\right) ${sgn(m)} ${Math.abs(m)} = 0`;
          return solutionsProblem({
            prompt: t(
              `Find the vertical asymptotes of $f(x) = ${frac(top, pl(D))}$. Write each as $x = a$.`,
              `求 $f(x) = ${frac(top, pl(D))}$ 的竖直渐近线，每条写成 $x = a$ 的形式。`,
            ),
            values: values(answer),
            wrong: [values(answer.map((x) => x.neg())), values([Q.of(-a, b), Q.of(-c, d)]), values([s])],
            solution: walked(
              [
                [
                  ["Factor the denominator", "分解分母"],
                  t("Factor it completely:", "把它完全分解："),
                  [`${pl(D)} = (${linear(a, b)})(${linear(c, d)})`],
                ],
                [
                  ["Solve each factor", "解每个因式"],
                  t(
                    `It is $0$ at $x = ${num(r1)}$ and $x = ${num(r2)}$, and the numerator is not $0$ at either. So the vertical asymptotes are $x = ${num(r1)}$ and $x = ${num(r2)}$.`,
                    `它在 $x = ${num(r1)}$ 和 $x = ${num(r2)}$ 处为 $0$，而分子在这两处都不为 $0$。所以竖直渐近线是 $x = ${num(r1)}$ 和 $x = ${num(r2)}$。`,
                  ),
                ],
              ],
              t(
                `Each value makes its factor $0$:${steps(zero(a, b, r1), zero(c, d, r2))}${top === bare(s) ? `and the numerator $${bare(s)}$ is $0$ only at $x = ${s}$, which is neither.` : `and the numerator $${top}$ is never $0$.`}`,
                `每个值都使对应的因式为 $0$：${steps(zero(a, b, r1), zero(c, d, r2))}${top === bare(s) ? `而分子 $${bare(s)}$ 只在 $x = ${s}$ 处为 $0$，不是其中任何一个。` : `而分子 $${top}$ 永不为 $0$。`}`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "cubic-denominators",
      figure: precalculusDrawings["vertical-asymptotes-of-rational-functions#cubic-denominators"],
      title: t("Cubic denominators", "三次分母"),
      explanation: t(
        "A cubic denominator often factors by taking out a common factor first:\n\n$$f(x) = \\frac{x + 3}{x^{3} - 9x} = \\frac{x + 3}{x(x - 3)(x + 3)}$$\n\nThe denominator is $0$ at $x = 0$, $3$ and $-3$. The factor $x + 3$ cancels with the numerator, leaving a hole at $x = -3$. So the vertical asymptotes are $x = 0$ and $x = 3$.\n\nFor $f(x) = \\frac{x - 1}{x^{3} - 4x} = \\frac{x - 1}{x(x - 2)(x + 2)}$, no factor cancels, so the vertical asymptotes are $x = 0$, $x = 2$ and $x = -2$. Check: the numerator is $-1$, $1$ and $-3$ at these values, never $0$.\n\n> **Watch out.** The common factor $x$ is a factor too: it gives the asymptote $x = 0$, which is easy to miss.",
        "三次分母常常可以先提取公因式再分解：\n\n$$f(x) = \\frac{x + 3}{x^{3} - 9x} = \\frac{x + 3}{x(x - 3)(x + 3)}$$\n\n分母在 $x = 0$、$3$、$-3$ 处为 $0$。因式 $x + 3$ 与分子约去，在 $x = -3$ 处只留下空洞。所以竖直渐近线是 $x = 0$ 和 $x = 3$。\n\n对 $f(x) = \\frac{x - 1}{x^{3} - 4x} = \\frac{x - 1}{x(x - 2)(x + 2)}$，没有因式能约去，所以竖直渐近线是 $x = 0$、$x = 2$ 和 $x = -2$。检验：分子在这些值处分别是 $-1$、$1$、$-3$，都不为 $0$。\n\n> **注意。** 公因式 $x$ 也是一个因式：它给出渐近线 $x = 0$，很容易漏掉。",
      ),
      generate(rng) {
        const lead = rng.pick([1, 1, 2, 3]);
        const sym = rng.bool();
        const r = rng.int(1, 6);
        const [r1, r2] = sym
          ? [r, -r]
          : (rng.sample(
              range(-6, 6).filter((x) => x !== 0),
              2,
            ) as [number, number]);
        const roots = [0, r1, r2];
        const share = rng.bool(0.5);
        const s = share ? rng.pick(roots) : other(rng, -7, 7, roots);
        const top = rng.bool(0.25) && !share ? String(rng.nonZero(-9, 9)) : bare(s);
        const shared = top === bare(s) && share;
        const answer = shared ? roots.filter((x) => x !== s) : roots;
        const D = fromRoots(roots, lead);
        return solutionsProblem({
          prompt: t(
            `Find the vertical asymptotes of $f(x) = ${frac(top, pl(D))}$. Write each as $x = a$.`,
            `求 $f(x) = ${frac(top, pl(D))}$ 的竖直渐近线，每条写成 $x = a$ 的形式。`,
          ),
          values: values(answer),
          wrong: [values(roots), values([r1, r2]), values(answer.map((x) => -x))],
          solution: walked(
            [
              [
                ["Take out the common factor", "提取公因式"],
                t(`Take out $${front(lead)}x$ and factor the rest:`, `提取 $${front(lead)}x$，再分解剩下的部分：`),
                [`${pl(D)} = ${front(lead)}x${fac(r1)}${fac(r2)}`],
              ],
              [
                ["Cancel common factors", "约去公因式"],
                t(
                  `The denominator is $0$ at ${listText(roots)}. ${shared ? `The factor $${bare(s)}$ cancels with the numerator, leaving a hole at $x = ${s}$. ` : "None of its factors cancels with the numerator. "}So the vertical asymptotes are ${listText(answer)}.`,
                  `分母在 ${listText(roots, "、")} 处为 $0$。${shared ? `因式 $${bare(s)}$ 与分子约去，在 $x = ${s}$ 处只留下空洞。` : "它的因式都不能与分子约去。"}所以竖直渐近线是 ${listText(answer, "、")}。`,
                ),
              ],
            ],
            shared
              ? t(
                  "After cancelling, the numerator is $1$, which is never $0$, while each remaining factor of the denominator is $0$ at its asymptote.",
                  "约分后分子是 $1$，永不为 $0$，而分母剩下的每个因式都在对应的渐近线处为 $0$。",
                )
              : top === bare(s)
                ? t(
                    `The numerator $${bare(s)}$ is not $0$ at any of them:${steps(...answer.map((x) => `${x} - ${paren(s)} = ${x - s}`))}so each of these values is a vertical asymptote.`,
                    `分子 $${bare(s)}$ 在这些值处都不为 $0$：${steps(...answer.map((x) => `${x} - ${paren(s)} = ${x - s}`))}所以这些值都是竖直渐近线。`,
                  )
                : t(`The numerator $${top}$ is a nonzero constant, so it is never $0$.`, `分子 $${top}$ 是非零常数，永不为 $0$。`),
          ),
        });
      },
    },
    {
      id: "counting-vertical-asymptotes",
      title: t("Counting vertical asymptotes", "数竖直渐近线的条数"),
      figure: remainingDrawings5["vertical-asymptotes-of-rational-functions#counting-vertical-asymptotes"],
      explanation: t(
        "To count the vertical asymptotes, factor the denominator and compare each factor with the numerator:\n\n- a factor $x^{2} + k$ with $k > 0$ is never $0$, so it gives no asymptote;\n- a repeated factor such as $(x - 2)^{2}$ gives only one asymptote, $x = 2$;\n- a factor $x - a$ that cancels completely with the numerator gives a hole, not an asymptote; but if $(x - a)^{2}$ is in the denominator and only $x - a$ in the numerator, one factor is left and $x = a$ is still an asymptote.\n\n$$\\frac{x - 1}{(x - 1)^{2}(x^{2} + 4)} = \\frac{1}{(x - 1)(x^{2} + 4)}$$\n\nhas exactly one vertical asymptote, $x = 1$.\n\nFor $\\frac{x + 3}{(x + 3)(x - 2)^{2}(x^{2} + 1)}$, the factor $x + 3$ cancels (a hole), $x^{2} + 1$ is never $0$, and $(x - 2)^{2}$ gives one asymptote: exactly $1$ vertical asymptote. Check: after cancelling, the denominator $(x - 2)^{2}(x^{2} + 1)$ is $0$ only at $x = 2$.\n\n> **Watch out.** Count distinct values of $x$, not factors or the degree: $(x - 2)^{2}$ has degree $2$ but gives one asymptote.",
        "数竖直渐近线时，把分母因式分解，并把每个因式与分子比较：\n\n- $k > 0$ 时因式 $x^{2} + k$ 永不为 $0$，不产生渐近线；\n- 重复的因式如 $(x - 2)^{2}$ 只产生一条渐近线 $x = 2$；\n- 能与分子完全约去的因式 $x - a$ 产生空洞，而不是渐近线；但如果分母有 $(x - a)^{2}$ 而分子只有 $x - a$，约分后还剩一个因式，$x = a$ 仍是渐近线。\n\n$$\\frac{x - 1}{(x - 1)^{2}(x^{2} + 4)} = \\frac{1}{(x - 1)(x^{2} + 4)}$$\n\n恰有一条竖直渐近线 $x = 1$。\n\n对 $\\frac{x + 3}{(x + 3)(x - 2)^{2}(x^{2} + 1)}$，因式 $x + 3$ 约去（空洞），$x^{2} + 1$ 永不为 $0$，$(x - 2)^{2}$ 给出一条渐近线：恰好 $1$ 条竖直渐近线。检验：约分后分母 $(x - 2)^{2}(x^{2} + 1)$ 只在 $x = 2$ 处为 $0$。\n\n> **注意。** 数的是 $x$ 的不同取值，而不是因式个数或次数：$(x - 2)^{2}$ 是二次的，但只给出一条渐近线。",
      ),
      generate(rng) {
        const shape = rng.int(0, 4);
        const [p, q] = rng.sample(
          range(-6, 6).filter((x) => x !== 0),
          2,
        ) as [number, number];
        const k = rng.int(1, 9);
        const fs: Factor[] =
          shape === 0
            ? [
                [p, 1],
                [q, 1],
              ]
            : shape === 1
              ? [[p, 2]]
              : shape === 2
                ? [[p, 1]]
                : shape === 3
                  ? [
                      [0, 1],
                      [p, 1],
                      [q, 1],
                    ]
                  : [];
        const irr = shape === 2 || shape === 4 ? k : 0;
        const roots = fs.map(([r]) => r);
        const share = roots.length > 0 && rng.bool(0.5);
        const s = share ? rng.pick(roots) : other(rng, -7, 7, roots);
        const top = !share && rng.bool(0.3) ? String(rng.nonZero(-9, 9)) : bare(s);
        const sNum = top === bare(s) ? s : undefined;
        const count = fs.filter(([r, m]) => m > (r === sNum ? 1 : 0)).length;
        const D = expandF(1, fs, irr);
        const left = fs.filter(([r, m]) => m > (r === sNum ? 1 : 0)).map(([r]) => r);
        const cut = sNum !== undefined && roots.includes(sNum);
        return numberProblem({
          prompt: t(
            `How many vertical asymptotes does the graph of $f(x) = ${frac(top, pl(D))}$ have?`,
            `$f(x) = ${frac(top, pl(D))}$ 的图象有几条竖直渐近线？`,
          ),
          answer: count,
          wrong: [roots.length, deg(D), count + 1],
          solution: walked(
            [
              [
                ["Factor the denominator", "分解分母"],
                t(
                  `${fs.length ? `Factor it: $${pl(D)} = ${fs.map(([r, m]) => facPow(r, m)).join("")}${irr ? `(x^{2} + ${irr})` : ""}$.${irr ? ` The factor $x^{2} + ${irr}$ is never $0$, because $x^{2} \\ge 0$.` : ""} The denominator is $0$ at ${listText([...new Set(roots)])}.` : `The denominator $x^{2} + ${irr}$ is never $0$, because $x^{2} \\ge 0$.`}`,
                  `${fs.length ? `分解：$${pl(D)} = ${fs.map(([r, m]) => facPow(r, m)).join("")}${irr ? `(x^{2} + ${irr})` : ""}$。${irr ? `因为 $x^{2} \\ge 0$，因式 $x^{2} + ${irr}$ 永不为 $0$。` : ""}分母在 ${listText([...new Set(roots)], "、")} 处为 $0$。` : `因为 $x^{2} \\ge 0$，分母 $x^{2} + ${irr}$ 永不为 $0$。`}`,
                ),
              ],
              [
                ["Compare with the numerator", "与分子比较"],
                t(
                  `${cut ? `The numerator $${bare(sNum)}$ cancels ${fs.find(([r]) => r === sNum)![1] > 1 ? "one of the two factors" : "the factor"} $${bare(sNum)}$${fs.find(([r]) => r === sNum)![1] > 1 ? `, so $x = ${sNum}$ is still an asymptote` : `, leaving a hole at $x = ${sNum}$`}. ` : "No factor of the denominator cancels with the numerator. "}So there ${count === 1 ? "is" : "are"} $${count}$ vertical asymptote${count === 1 ? "" : "s"}.`,
                  `${cut ? `分子 $${bare(sNum)}$ 约去${fs.find(([r]) => r === sNum)![1] > 1 ? "两个因式中的一个" : "因式"} $${bare(sNum)}$${fs.find(([r]) => r === sNum)![1] > 1 ? `，所以 $x = ${sNum}$ 仍是渐近线` : `，在 $x = ${sNum}$ 处只留下空洞`}。` : "分母的因式都不能与分子约去。"}所以共有 $${count}$ 条竖直渐近线。`,
                ),
              ],
            ],
            count === 0
              ? t(
                  `After cancelling, the denominator is $x^{2} + ${irr}$, which is at least $${irr}$ for every $x$, so nothing is left that can be $0$.`,
                  `约分后分母是 $x^{2} + ${irr}$，对每个 $x$ 都至少是 $${irr}$，所以没有能为 $0$ 的因式了。`,
                )
              : cut || sNum === undefined
                ? t(
                    `After cancelling, the numerator is $${cut ? "1" : top}$, which is never $0$, and a factor of the denominator is left at ${listText(left)}.`,
                    `约分后分子是 $${cut ? "1" : top}$，永不为 $0$，而在 ${listText(left, "、")} 处分母还剩因式。`,
                  )
                : t(
                    `The numerator $${bare(sNum)}$ is not $0$ at ${listText(left)}:${steps(...left.map((r) => `${r} - ${paren(sNum)} = ${r - sNum}`))}so each of these values is a vertical asymptote.`,
                    `分子 $${bare(sNum)}$ 在 ${listText(left, "、")} 处不为 $0$：${steps(...left.map((r) => `${r} - ${paren(sNum)} = ${r - sNum}`))}所以这些值都是竖直渐近线。`,
                  ),
          ),
        });
      },
    },
  ],
};

// ─── 2.5.3 Locating holes in rational functions ────────────────────────────

const holeOptions: readonly Text[] = [t("A hole", "空洞"), t("A vertical asymptote", "竖直渐近线"), t("Neither", "两者都不是")];

/** locatingHolesInRationalFunctions finds the points where a common factor cancels and leaves a hole in the graph. */
export const locatingHolesInRationalFunctions: TopicDef = {
  id: "locating-holes-in-rational-functions",
  title: t("Locating Holes in Rational Functions", "确定分式函数图象的空洞"),
  summary: t(
    "Find the holes of a rational function, where a common factor of the numerator and denominator cancels, and tell holes from vertical asymptotes.",
    "求分式函数图象的空洞（分子与分母的公因式约去之处），并区分空洞与竖直渐近线。",
  ),
  prerequisites: ["vertical-asymptotes-of-rational-functions"],
  encompasses: [
    { topic: "vertical-asymptotes-of-rational-functions", weight: 0.4 },
    { topic: "simplifying-rational-expressions-using-polynomial-factorization", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `The function $f(x) = \\frac{x^{2} - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1}$ equals $x + 1$ for every $x \\neq 1$, and it is not defined at $x = 1$. Its graph is the line $y = x + 1$ with the point $(1, 2)$ missing: a hole.

Check: $f(1.01) = 2.01$ and $f(0.99) = 1.99$, both close to $2$.

In this lesson we find the coordinates of holes from factored and from expanded forms, and tell a hole from a vertical asymptote.`,
    `函数 $f(x) = \\frac{x^{2} - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1}$ 对每个 $x \\neq 1$ 都等于 $x + 1$，在 $x = 1$ 处无意义。它的图象是直线 $y = x + 1$ 去掉点 $(1, 2)$：一个空洞。

检验：$f(1.01) = 2.01$，$f(0.99) = 1.99$，都接近 $2$。

这节课我们由因式分解形式和展开形式求空洞的坐标，并区分空洞和竖直渐近线。`,
  ),
  knowledgePoints: [
    {
      id: "holes-of-factored-functions",
      figure: precalculusDrawings["locating-holes-in-rational-functions#holes-of-factored-functions"],
      title: t("The coordinates of a hole", "空洞的坐标"),
      explanation: t(
        "When a factor $x - h$ cancels completely, $f$ is not defined at $x = h$ but behaves like the simplified function there. Its graph is the graph of the simplified function with one point missing, a **hole**, drawn as an open circle.\n\nTo find the hole, cancel, then substitute $x = h$ into the simplified function:\n\n$$f(x) = \\frac{2(x - 3)(x + 1)}{(x - 3)(x - 5)} = \\frac{2(x + 1)}{x - 5} \\quad (x \\neq 3)$$\n\n$$\\frac{2(3 + 1)}{3 - 5} = -4$$\n\nso the hole is at $(3, -4)$.\n\nFor $f(x) = \\frac{(x + 2)(x - 1)}{(x + 2)(x + 4)} = \\frac{x - 1}{x + 4}$ with $x \\neq -2$, the hole is at $x = -2$ with $y = \\frac{-3}{2}$, the point $\\left(-2, -\\frac{3}{2}\\right)$. Check: the remaining denominator $x + 4$ is $2$ at $x = -2$, not $0$, so the simplified function is defined there.\n\n> **Watch out.** Substitute into the simplified function: the original gives $\\frac{0}{0}$. The $y$-coordinate of a hole is usually not $0$.",
        "当因式 $x - h$ 被完全约去时，$f$ 在 $x = h$ 处无意义，但在那附近与化简后的函数一样。它的图象就是化简后函数的图象去掉一个点，这个点叫**空洞**，画成空心圆圈。\n\n求空洞时，先约分，再把 $x = h$ 代入化简后的函数：\n\n$$f(x) = \\frac{2(x - 3)(x + 1)}{(x - 3)(x - 5)} = \\frac{2(x + 1)}{x - 5} \\quad (x \\neq 3)$$\n\n$$\\frac{2(3 + 1)}{3 - 5} = -4$$\n\n所以空洞在 $(3, -4)$。\n\n对 $f(x) = \\frac{(x + 2)(x - 1)}{(x + 2)(x + 4)} = \\frac{x - 1}{x + 4}$（$x \\neq -2$），空洞在 $x = -2$ 处，$y = \\frac{-3}{2}$，即点 $\\left(-2, -\\frac{3}{2}\\right)$。检验：剩下的分母 $x + 4$ 在 $x = -2$ 处是 $2$，不为 $0$，所以化简后的函数在那里有意义。\n\n> **注意。** 要代入化简后的函数：原函数会得到 $\\frac{0}{0}$。空洞的纵坐标一般不是 $0$。",
      ),
      generate(rng) {
        const [h, r, p] = rng.sample(range(-7, 7), 3) as [number, number, number];
        const a = rng.pick([1, 1, 2, -1, 3, -2]);
        const y = Q.of(a * (h - r), h - p);
        const top = `${front(a)}${rng.shuffle([fac(h), fac(r)]).join("")}`;
        const bottom = rng.shuffle([fac(h), fac(p)]).join("");
        return pointProblem({
          prompt: t(
            `Find the coordinates of the hole in the graph of $f(x) = ${frac(top, bottom)}$.`,
            `求 $f(x) = ${frac(top, bottom)}$ 的图象上空洞的坐标。`,
          ),
          answer: [h, y],
          wrong: [
            [h, 0],
            [p, y],
            [h, Q.of(a * (h - p), h - r)],
            [-h, y],
          ],
          solution: walked(
            [
              [
                ["Cancel the common factor", "约去公因式"],
                t(`The factor $${bare(h)}$ cancels:`, `因式 $${bare(h)}$ 约去：`),
                [`f(x) = ${frac(prodL(simple([r]), a), bare(p))} \\quad (x \\neq ${h})`],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `Put $x = ${h}$ into the simplified function. The hole is at $(${h}, ${num(y)})$.`,
                  `把 $x = ${h}$ 代入化简后的函数。空洞在 $(${h}, ${num(y)})$。`,
                ),
                [
                  `${frac(`${a === 1 ? "" : a === -1 ? "-" : `${a}`}(${h} ${sgn(-r)} ${Math.abs(r)})`, `${h} ${sgn(-p)} ${Math.abs(p)}`)} = ${num(y)}`,
                ],
              ],
            ],
            t(
              `The remaining denominator is not $0$ at $x = ${h}$:${steps(`${h} - ${paren(p)} = ${h - p} \\neq 0`)}so the simplified function is defined there, and the missing point is a hole, not an asymptote.`,
              `剩下的分母在 $x = ${h}$ 处不为 $0$：${steps(`${h} - ${paren(p)} = ${h - p} \\neq 0`)}所以化简后的函数在那里有意义，缺的这个点是空洞而不是渐近线。`,
            ),
          ),
        });
      },
    },
    {
      id: "holes-after-factoring",
      figure: precalculusDrawings["locating-holes-in-rational-functions#holes-after-factoring"],
      title: t("Holes after factoring", "因式分解后求空洞"),
      explanation: t(
        "When the numerator and denominator are expanded, factor both to find a common factor.\n\n$$f(x) = \\frac{x^{2} + x - 6}{2x^{2} - 3x - 2} = \\frac{(x - 2)(x + 3)}{(x - 2)(2x + 1)} = \\frac{x + 3}{2x + 1} \\quad (x \\neq 2)$$\n\nAt $x = 2$ the simplified function is $\\frac{5}{5} = 1$, so the hole is at $(2, 1)$. The remaining factor $2x + 1$ gives the vertical asymptote $x = -\\frac{1}{2}$.\n\nFor $f(x) = \\frac{x^{2} - 2x - 3}{x^{2} - 9} = \\frac{(x - 3)(x + 1)}{(x - 3)(x + 3)} = \\frac{x + 1}{x + 3}$ with $x \\neq 3$, the simplified function is $\\frac{4}{6} = \\frac{2}{3}$ at $x = 3$, so the hole is at $\\left(3, \\frac{2}{3}\\right)$. Check: the remaining denominator is $3 + 3 = 6$, not $0$.\n\n> **Watch out.** Only the cancelled factor gives a hole. The other zero of the denominator, here $x = -3$, is a vertical asymptote.",
        "如果分子和分母是展开式，把两者都因式分解，找出公因式。\n\n$$f(x) = \\frac{x^{2} + x - 6}{2x^{2} - 3x - 2} = \\frac{(x - 2)(x + 3)}{(x - 2)(2x + 1)} = \\frac{x + 3}{2x + 1} \\quad (x \\neq 2)$$\n\n在 $x = 2$ 处化简后的函数值是 $\\frac{5}{5} = 1$，所以空洞在 $(2, 1)$。剩下的因式 $2x + 1$ 给出竖直渐近线 $x = -\\frac{1}{2}$。\n\n对 $f(x) = \\frac{x^{2} - 2x - 3}{x^{2} - 9} = \\frac{(x - 3)(x + 1)}{(x - 3)(x + 3)} = \\frac{x + 1}{x + 3}$（$x \\neq 3$），化简后的函数在 $x = 3$ 处是 $\\frac{4}{6} = \\frac{2}{3}$，所以空洞在 $\\left(3, \\frac{2}{3}\\right)$。检验：剩下的分母是 $3 + 3 = 6$，不为 $0$。\n\n> **注意。** 只有被约去的因式才产生空洞。分母的另一个零点（这里是 $x = -3$）是竖直渐近线。",
      ),
      generate(rng) {
        for (;;) {
          const [h, r] = rng.sample(range(-6, 6), 2) as [number, number];
          const a = rng.pick([1, 1, 2, -1, 3]);
          const b = rng.pick([1, 1, 2, 3]);
          const e = rng.int(-7, 7);
          if (gcd(b, e) !== 1 || b * h - e === 0 || (b === 1 && e === r)) continue;
          const N = fromRoots([h, r], a);
          const D = mulP([-h, 1], [-e, b]);
          const y = Q.of(a * (h - r), b * h - e);
          const simpleTop = prodL(simple([r]), a);
          const simpleBottom = linear(b, -e);
          return pointProblem({
            prompt: t(
              `Find the coordinates of the hole in the graph of $f(x) = ${frac(pl(N), pl(D))}$.`,
              `求 $f(x) = ${frac(pl(N), pl(D))}$ 的图象上空洞的坐标。`,
            ),
            answer: [h, y],
            wrong: [
              [h, 0],
              [h, Q.of(b * h - e, a * (h - r) || 1)],
              [-h, y],
            ],
            solution: walked(
              [
                [
                  ["Factor and cancel", "因式分解并约分"],
                  t(`Factor both and cancel the common factor $${bare(h)}$:`, `把两者因式分解，约去公因式 $${bare(h)}$：`),
                  [
                    `f(x) = ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}(${simpleBottom})`)} = ${frac(simpleTop, simpleBottom)} \\quad (x \\neq ${h})`,
                  ],
                ],
                [
                  ["Substitute", "代入"],
                  t(
                    `At $x = ${h}$ the simplified function is $${num(y)}$, so the hole is at $(${h}, ${num(y)})$:`,
                    `化简后的函数在 $x = ${h}$ 处的值是 $${num(y)}$，所以空洞在 $(${h}, ${num(y)})$：`,
                  ),
                  [`${frac(`${front(a)}(${h} - ${paren(r)})`, `${b === 1 ? h : `${b} \\cdot ${paren(h)}`} - ${paren(e)}`)} = ${num(y)}`],
                ],
              ],
              t(
                `The remaining denominator is not $0$ at $x = ${h}$:${steps(`${b === 1 ? h : `${b} \\cdot ${paren(h)}`} - ${paren(e)} = ${b * h - e} \\neq 0`)}so the point is a hole, not an asymptote.`,
                `剩下的分母在 $x = ${h}$ 处不为 $0$：${steps(`${b === 1 ? h : `${b} \\cdot ${paren(h)}`} - ${paren(e)} = ${b * h - e} \\neq 0`)}所以这个点是空洞，而不是渐近线。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "hole-or-asymptote",
      figure: precalculusDrawings["locating-holes-in-rational-functions#hole-or-asymptote"],
      title: t("Hole or vertical asymptote?", "空洞还是竖直渐近线？"),
      explanation: t(
        "At a zero $x = a$ of the denominator, count how many times $x - a$ appears on the top and on the bottom:\n\n- at least as many times on top: it cancels completely, and there is a **hole**;\n- more times on the bottom: a factor is left in the denominator, and there is a **vertical asymptote**.\n\nIf $x = a$ is not a zero of the denominator, $f(a)$ is defined: neither.\n\n$$\\frac{(x - 1)^{2}}{(x - 1)(x + 4)}: \\text{ hole at } x = 1, \\qquad \\frac{x - 1}{(x - 1)^{2}(x + 4)}: \\text{ asymptote } x = 1$$\n\nFor $\\frac{(x + 2)^{2}(x - 1)}{(x + 2)^{2}(x - 5)}$ at $x = -2$: $x + 2$ appears twice on top and twice on the bottom, so it cancels completely and there is a hole. Check: after cancelling, $\\frac{x - 1}{x - 5}$ is $\\frac{-3}{-7} = \\frac{3}{7}$ at $x = -2$, a finite value.\n\n> **Watch out.** Count the copies of the factor, not only whether it appears. One copy on top and two on the bottom still leaves $x - a$ in the denominator: an asymptote.",
        "在分母的零点 $x = a$ 处，数一数 $x - a$ 在分子和分母中各出现几次：\n\n- 分子中出现的次数不少于分母：完全约去，是**空洞**；\n- 分母中出现得更多：约分后分母中还剩因式，是**竖直渐近线**。\n\n若 $x = a$ 不是分母的零点，则 $f(a)$ 有意义：两者都不是。\n\n$$\\frac{(x - 1)^{2}}{(x - 1)(x + 4)}: \\ x = 1 \\text{ 处是空洞}, \\qquad \\frac{x - 1}{(x - 1)^{2}(x + 4)}: \\ x = 1 \\text{ 是渐近线}$$\n\n对 $\\frac{(x + 2)^{2}(x - 1)}{(x + 2)^{2}(x - 5)}$ 在 $x = -2$ 处：$x + 2$ 在分子和分母中都出现两次，完全约去，是空洞。检验：约分后 $\\frac{x - 1}{x - 5}$ 在 $x = -2$ 处是 $\\frac{-3}{-7} = \\frac{3}{7}$，是有限值。\n\n> **注意。** 要数因式出现的次数，而不只是看它是否出现。分子一个、分母两个，约分后分母中仍剩 $x - a$：是渐近线。",
      ),
      generate(rng) {
        const c = rng.int(-6, 6);
        const [o1, o2] = rng.sample(
          range(-6, 6).filter((x) => x !== c),
          2,
        ) as [number, number];
        const kind = rng.int(0, 2);
        const kD = kind === 0 ? rng.pick([1, 1, 2]) : kind === 1 ? rng.pick([1, 2]) : 0;
        const kN = kind === 0 ? rng.int(kD, 2) : kind === 1 ? rng.int(0, kD - 1) : rng.int(0, 1);
        const top: Factor[] = [...(kN > 0 ? [[c, kN] as Factor] : []), ...(rng.bool(0.6) || kN === 0 ? [[o1, 1] as Factor] : [])];
        const bottom: Factor[] = [...(kD > 0 ? [[c, kD] as Factor] : []), [o2, 1]];
        const f = frac(prodL(top), prodL(bottom));
        const times = (n: number, zh = false) => (zh ? `${n} 次` : n === 1 ? "once" : "twice");
        return reasoned(
          choiceProblem({
            prompt: t(
              `Does the graph of $f(x) = ${f}$ have a hole, a vertical asymptote, or neither at $x = ${c}$?`,
              `$f(x) = ${f}$ 的图象在 $x = ${c}$ 处是空洞、竖直渐近线，还是两者都不是？`,
            ),
            options: holeOptions,
            correct: kind,
            solution:
              kind === 2
                ? walked(
                    [
                      [
                        ["Look at the denominator", "看分母"],
                        t(`The denominator is not $0$ at $x = ${c}$:`, `分母在 $x = ${c}$ 处不为 $0$：`),
                        [`${c} - ${paren(o2)} = ${c - o2} \\neq 0`],
                      ],
                      [["Conclude", "下结论"], t(`So $f(${c})$ is defined: neither.`, `所以 $f(${c})$ 有意义：两者都不是。`)],
                    ],
                    t(
                      `A hole or an asymptote needs the denominator to be $0$ at $x = ${c}$, and $${bare(c)}$ is not a factor of the denominator.`,
                      `空洞或渐近线都要求分母在 $x = ${c}$ 处为 $0$，而 $${bare(c)}$ 不是分母的因式。`,
                    ),
                  )
                : walked(
                    [
                      [
                        ["Count the factor", "数因式"],
                        t(
                          `The factor $${bare(c)}$ appears ${kN === 0 ? "zero times" : times(kN)} in the numerator and ${times(kD)} in the denominator.`,
                          `因式 $${bare(c)}$ 在分子中出现 ${kN} 次，在分母中出现 ${kD} 次。`,
                        ),
                      ],
                      [
                        ["Cancel", "约分"],
                        kind === 0
                          ? t("It cancels completely, so there is a hole.", "它被完全约去，所以是空洞。")
                          : t(
                              "A factor is left in the denominator, so there is a vertical asymptote.",
                              "约分后分母中还剩这个因式，所以是竖直渐近线。",
                            ),
                      ],
                    ],
                    kind === 0
                      ? t(
                          `After cancelling, the denominator is $${bare(o2)}$, which is $${c - o2}$ at $x = ${c}$, not $0$: the simplified function has a value there, and only the point itself is missing.`,
                          `约分后分母是 $${bare(o2)}$，在 $x = ${c}$ 处等于 $${c - o2}$，不为 $0$：化简后的函数在那里有值，只是缺了这一个点。`,
                        )
                      : t(
                          `After cancelling, $${facPow(c, kD - kN)}$ is still in the denominator and is $0$ at $x = ${c}$, while the numerator is not, so $f$ grows without bound there.`,
                          `约分后分母中仍有 $${facPow(c, kD - kN)}$，它在 $x = ${c}$ 处为 $0$，而分子不为 $0$，所以 $f$ 在那里无界增大。`,
                        ),
                  ),
          }),
          kind === 2
            ? [
                why(
                  holeOptions[0]!,
                  `A hole needs the denominator to be $0$ at $x = ${c}$, and it is not.`,
                  `空洞要求分母在 $x = ${c}$ 处为 $0$，而它不为 $0$。`,
                ),
                why(
                  holeOptions[1]!,
                  `An asymptote needs the denominator to be $0$ at $x = ${c}$, and it is not.`,
                  `渐近线要求分母在 $x = ${c}$ 处为 $0$，而它不为 $0$。`,
                ),
              ]
            : [
                kind === 0
                  ? why(
                      holeOptions[1]!,
                      `Every copy of $${bare(c)}$ in the denominator cancels, so no factor is left to make it $0$.`,
                      `分母中的 $${bare(c)}$ 全部约去，没有剩下能使它为 $0$ 的因式。`,
                    )
                  : why(
                      holeOptions[0]!,
                      `The denominator has more copies of $${bare(c)}$ than the numerator, so one is left after cancelling.`,
                      `分母中 $${bare(c)}$ 的个数比分子多，约分后还剩一个。`,
                    ),
                why(
                  holeOptions[2]!,
                  `The denominator is $0$ at $x = ${c}$, so $f(${c})$ is not defined.`,
                  `分母在 $x = ${c}$ 处为 $0$，所以 $f(${c})$ 无意义。`,
                ),
              ],
        );
      },
    },
  ],
};

// ─── 2.5.4 Horizontal asymptotes of rational functions ─────────────────────

/** approx writes a number to three significant figures: "3.07", "-0.486". */
const approx = (v: number) => String(Number(v.toPrecision(3)));

/** scaled writes a·(inner), leaving out a unit coefficient and its parentheses. */
const scaled = (a: number, inner: string) => (a === 1 ? inner : `${front(a)}(${inner})`);

/** nearCheck compares f at a large x with the value it should approach. */
const nearCheck = (x: number, fx: number, target: Q): Text =>
  target.isInteger()
    ? t(
        `Try $x = ${x}$:${steps(`f(${x}) \\approx ${approx(fx)}`)}which is close to $${num(target)}$.`,
        `取 $x = ${x}$：${steps(`f(${x}) \\approx ${approx(fx)}`)}接近 $${num(target)}$。`,
      )
    : t(
        `Try $x = ${x}$:${steps(`f(${x}) \\approx ${approx(fx)}`, `${num(target)} \\approx ${approx(target.toNumber())}`)}The two are close.`,
        `取 $x = ${x}$：${steps(`f(${x}) \\approx ${approx(fx)}`, `${num(target)} \\approx ${approx(target.toNumber())}`)}两者很接近。`,
      );

/** ratioText writes a/b as a fraction, followed by its lowest terms when they differ. */
const ratioText = (a: number, b: number) => {
  const f = frac(String(a), String(b));
  const q = num(Q.of(a, b));
  return f === q ? f : `${f} = ${q}`;
};

/** horizontalAsymptotesOfRationalFunctions finds horizontal asymptotes by comparing degrees and leading coefficients. */
export const horizontalAsymptotesOfRationalFunctions: TopicDef = {
  id: "horizontal-asymptotes-of-rational-functions",
  title: t("Horizontal Asymptotes of Rational Functions", "分式函数的水平渐近线"),
  summary: t(
    "Find the horizontal asymptote of a rational function by comparing the degrees and leading coefficients of its numerator and denominator.",
    "比较分子与分母的次数和首项系数，求分式函数的水平渐近线。",
  ),
  prerequisites: ["roots-of-rational-functions", "graph-transformations-of-reciprocal-functions"],
  encompasses: [],
  xp: 13,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `For $f(x) = \\frac{3x + 1}{x - 2}$, both the numerator and the denominator have degree $1$. When $|x|$ is large, the constants hardly matter and $f(x) \\approx \\frac{3x}{x} = 3$. So the graph levels off at the line $y = 3$, its horizontal asymptote.

Check: $f(100) = \\frac{301}{98} \\approx 3.07$ and $f(1000) = \\frac{3001}{998} \\approx 3.007$, closer and closer to $3$.

In this lesson we find the horizontal asymptote when the degrees are equal, decide it by comparing the degrees in general, and read it from factored forms without expanding.`,
    `对 $f(x) = \\frac{3x + 1}{x - 2}$，分子和分母都是一次。当 $|x|$ 很大时，常数几乎不起作用，$f(x) \\approx \\frac{3x}{x} = 3$。所以图象逐渐贴近直线 $y = 3$，这就是它的水平渐近线。

检验：$f(100) = \\frac{301}{98} \\approx 3.07$，$f(1000) = \\frac{3001}{998} \\approx 3.007$，越来越接近 $3$。

这节课我们求次数相等时的水平渐近线，一般地通过比较次数判断水平渐近线，并不展开而直接由因式分解形式读出它。`,
  ),
  knowledgePoints: [
    {
      id: "equal-degrees",
      figure: precalculusDrawings["horizontal-asymptotes-of-rational-functions#equal-degrees"],
      title: t("Equal degrees", "次数相等"),
      explanation: t(
        "For large $|x|$, every polynomial is dominated by its leading term. So when the numerator and the denominator have the **same degree**,\n\n$$f(x) = \\frac{6x^{2} - x + 5}{3 - 4x^{2}} \\approx \\frac{6x^{2}}{-4x^{2}} = -\\frac{3}{2}$$\n\nand $f(x) \\to -\\frac{3}{2}$ as $x \\to \\pm\\infty$. The horizontal asymptote is $y = -\\frac{3}{2}$, the ratio of the **leading** coefficients. Find the leading terms carefully when the terms are not in order.\n\nFor $f(x) = \\frac{5 - 2x}{4x + 1}$, the leading terms are $-2x$ and $4x$, so the horizontal asymptote is $y = \\frac{-2}{4} = -\\frac{1}{2}$. Check: $f(100) = \\frac{-195}{401} \\approx -0.486$, close to $-0.5$.\n\n> **Watch out.** The ratio of the constant terms, here $\\frac{5}{1}$, is $f(0)$, the $y$-intercept, not the asymptote. Take each leading coefficient with its sign.",
        "当 $|x|$ 很大时，每个多项式都由首项（最高次项）主导。所以当分子与分母**次数相同**时，\n\n$$f(x) = \\frac{6x^{2} - x + 5}{3 - 4x^{2}} \\approx \\frac{6x^{2}}{-4x^{2}} = -\\frac{3}{2}$$\n\n当 $x \\to \\pm\\infty$ 时 $f(x) \\to -\\frac{3}{2}$。水平渐近线是 $y = -\\frac{3}{2}$，即两个**首项**系数之比。各项没有按次序排列时，要仔细找出首项。\n\n对 $f(x) = \\frac{5 - 2x}{4x + 1}$，首项是 $-2x$ 和 $4x$，所以水平渐近线是 $y = \\frac{-2}{4} = -\\frac{1}{2}$。检验：$f(100) = \\frac{-195}{401} \\approx -0.486$，接近 $-0.5$。\n\n> **注意。** 常数项之比（这里是 $\\frac{5}{1}$）是 $f(0)$，即 $y$ 轴截距，不是渐近线。首项系数要连同符号一起取。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(1, 3);
          const N = randomPoly(rng, n, 9);
          const D = randomPoly(rng, n, 6);
          const [a, b] = [N[n]!, D[n]!];
          if (N.every((c, i) => c * b === D[i]! * a)) continue;
          const write = (p: P) => (rng.bool(0.4) ? plAsc(p) : pl(p));
          const answer = Q.of(a, b);
          return numberProblem({
            prompt: t(
              `Find the horizontal asymptote of $f(x) = ${frac(write(N), write(D))}$.`,
              `求 $f(x) = ${frac(write(N), write(D))}$ 的水平渐近线。`,
            ),
            answer,
            solveFor: "y",
            wrong: [Q.of(b, a), ...(D[0] !== 0 ? [Q.of(N[0]!, D[0]!)] : []), 0, 1],
            solution: walked(
              [
                [
                  ["Compare the degrees", "比较次数"],
                  t(
                    `The numerator and the denominator both have degree $${n}$, so for large $|x|$ only the leading terms matter.`,
                    `分子和分母都是 $${n}$ 次，所以当 $|x|$ 很大时只有首项起作用。`,
                  ),
                ],
                [
                  ["Divide the leading terms", "首项相除"],
                  t(`The leading terms are $${lead1(a, n)}$ and $${lead1(b, n)}$:`, `首项分别是 $${lead1(a, n)}$ 和 $${lead1(b, n)}$：`),
                  [`y = ${frac(lead1(a, n), lead1(b, n))} = ${num(answer)}`],
                ],
              ],
              nearCheck(1000, at(N, 1000) / at(D, 1000), answer),
            ),
          });
        }
      },
    },
    {
      id: "comparing-degrees",
      figure: precalculusDrawings["horizontal-asymptotes-of-rational-functions#comparing-degrees"],
      title: t("Comparing degrees", "比较次数"),
      explanation: t(
        "Let $n$ be the degree of the numerator and $m$ the degree of the denominator.\n\n- $n < m$: the denominator grows faster, $f(x) \\to 0$, and the horizontal asymptote is $y = 0$.\n- $n = m$: the horizontal asymptote is $y = \\frac{a}{b}$, the ratio of the leading coefficients.\n- $n > m$: $|f(x)|$ grows without bound, and there is **no** horizontal asymptote.\n\nFor example, $\\frac{5x + 1}{x^{2} - 4}$ has $y = 0$, $\\frac{5x^{2} + 1}{x^{2} - 4}$ has $y = 5$, and $\\frac{5x^{3} + 1}{x^{2} - 4}$ has none.\n\nFor $f(x) = \\frac{2x^{2} - 3}{x^{3} + x}$, the numerator has degree $2$ and the denominator degree $3$, so the horizontal asymptote is $y = 0$. Check: $f(10) = \\frac{197}{1010} \\approx 0.195$ and $f(20) = \\frac{797}{8020} \\approx 0.099$, shrinking towards $0$.\n\n> **Watch out.** Compare the degrees first. The ratio of the leading coefficients is the asymptote only when the degrees are equal; a higher degree on top means there is no horizontal asymptote at all.",
        "设分子的次数为 $n$，分母的次数为 $m$。\n\n- $n < m$：分母增长得更快，$f(x) \\to 0$，水平渐近线是 $y = 0$。\n- $n = m$：水平渐近线是 $y = \\frac{a}{b}$，即首项系数之比。\n- $n > m$：$|f(x)|$ 无界增大，**没有**水平渐近线。\n\n例如 $\\frac{5x + 1}{x^{2} - 4}$ 的水平渐近线是 $y = 0$，$\\frac{5x^{2} + 1}{x^{2} - 4}$ 的是 $y = 5$，$\\frac{5x^{3} + 1}{x^{2} - 4}$ 没有水平渐近线。\n\n对 $f(x) = \\frac{2x^{2} - 3}{x^{3} + x}$，分子是 $2$ 次，分母是 $3$ 次，所以水平渐近线是 $y = 0$。检验：$f(10) = \\frac{197}{1010} \\approx 0.195$，$f(20) = \\frac{797}{8020} \\approx 0.099$，逐渐缩小趋于 $0$。\n\n> **注意。** 先比较次数。只有次数相等时，首项系数之比才是渐近线；分子次数更高时根本没有水平渐近线。",
      ),
      generate(rng) {
        const m = rng.int(1, 3);
        const n = rng.pick([0, 1, 2, 3, 4].filter((d) => Math.abs(d - m) <= 2));
        const N = randomPoly(rng, n, 9);
        const D = randomPoly(rng, m, 6);
        const [a, b] = [N[n]!, D[m]!];
        const none = t("There is no horizontal asymptote.", "没有水平渐近线。");
        const yIs = (v: Q) => same(`$y = ${num(v)}$`);
        const right = n < m ? yIs(Q.zero) : n === m ? yIs(Q.of(a, b)) : none;
        const wrong = [yIs(Q.zero), yIs(Q.of(a, b)), none, yIs(Q.of(b, a)), ...(D[0] !== 0 ? [yIs(Q.of(N[0]!, D[0]!))] : [])];
        return oneOf(
          rng,
          t(
            `What is the horizontal asymptote of the graph of $f(x) = ${frac(pl(N), pl(D))}$?`,
            `$f(x) = ${frac(pl(N), pl(D))}$ 的图象的水平渐近线是什么？`,
          ),
          right,
          wrong,
          walked(
            [
              [
                ["Compare the degrees", "比较次数"],
                t(
                  `The numerator has degree $${n}$ and the denominator has degree $${m}$${n < m ? `, so the denominator grows faster` : n === m ? ": they are equal" : `, so the numerator grows faster`}.`,
                  `分子是 $${n}$ 次，分母是 $${m}$ 次${n < m ? "，所以分母增长得更快" : n === m ? "：两者相等" : "，所以分子增长得更快"}。`,
                ),
              ],
              n < m
                ? [
                    ["Read the asymptote", "读出渐近线"],
                    t(
                      "So $f(x) \\to 0$ at both ends: the horizontal asymptote is $y = 0$.",
                      "所以在两端 $f(x) \\to 0$：水平渐近线是 $y = 0$。",
                    ),
                  ]
                : n === m
                  ? [
                      ["Divide the leading coefficients", "首项系数相除"],
                      t("The horizontal asymptote is the ratio of the leading coefficients:", "水平渐近线是首项系数之比："),
                      [`y = ${ratioText(a, b)}`],
                    ]
                  : [
                      ["Read the end behavior", "读出端点行为"],
                      t("So $|f(x)|$ grows without bound: there is no horizontal asymptote.", "所以 $|f(x)|$ 无界增大：没有水平渐近线。"),
                    ],
            ],
            n < m
              ? nearCheck(100, at(N, 100) / at(D, 100), Q.zero)
              : n === m
                ? nearCheck(1000, at(N, 1000) / at(D, 1000), Q.of(a, b))
                : t(
                    `For large $|x|$ the leading terms give${steps(`${frac(lead1(a, n), lead1(b, m))} = ${poly([Q.of(a, b), termOf(n - m)])}`)}which is unbounded.`,
                    `当 $|x|$ 很大时，由首项得${steps(`${frac(lead1(a, n), lead1(b, m))} = ${poly([Q.of(a, b), termOf(n - m)])}`)}它无界。`,
                  ),
          ),
          [
            why(
              yIs(Q.zero),
              `$y = 0$ is the asymptote when the numerator has the lower degree; here it has degree $${n}$ against $${m}$.`,
              `分子次数较低时渐近线才是 $y = 0$；这里分子是 $${n}$ 次，分母是 $${m}$ 次。`,
            ),
            why(
              none,
              `There is no horizontal asymptote only when the numerator has the higher degree; here it has degree $${n}$ against $${m}$.`,
              `只有分子次数更高时才没有水平渐近线；这里分子是 $${n}$ 次，分母是 $${m}$ 次。`,
            ),
            why(
              yIs(Q.of(a, b)),
              `The ratio of the leading coefficients is the asymptote only when the degrees are equal; here they are $${n}$ and $${m}$.`,
              `只有次数相等时首项系数之比才是渐近线；这里次数是 $${n}$ 和 $${m}$。`,
            ),
            why(
              yIs(Q.of(b, a)),
              "This divides the denominator's leading coefficient by the numerator's: the ratio is upside down.",
              "这是用分母的首项系数除以分子的首项系数：比倒过来了。",
            ),
            ...(D[0] !== 0
              ? [
                  why(
                    yIs(Q.of(N[0]!, D[0]!)),
                    "This is the ratio of the constant terms, $f(0)$: the $y$-intercept, not the value for large $|x|$.",
                    "这是常数项之比，即 $f(0)$：$y$ 轴截距，而不是 $|x|$ 很大时的值。",
                  ),
                ]
              : []),
          ],
        );
      },
    },
    {
      id: "horizontal-asymptotes-of-factored-functions",
      title: t("Factored forms", "因式分解形式"),
      explanation: t(
        "When the function is written as a product of factors, you do not need to expand it: the leading coefficient of a product is the product of the leading coefficients of its factors. Watch factors written backward, such as $3 - 2x$, whose leading coefficient is $-2$.\n\n$$f(x) = \\frac{(2x - 1)(3 - x)}{(3x + 1)(x + 4)}: \\quad y = \\frac{2 \\cdot (-1)}{3 \\cdot 1} = -\\frac{2}{3}$$\n\nFor $f(x) = \\frac{(3x + 2)(1 - x)}{(x - 4)(2x + 5)}$, the leading coefficients are $3 \\cdot (-1) = -3$ and $1 \\cdot 2 = 2$, so $y = -\\frac{3}{2}$. Check: $f(100) = \\frac{302 \\cdot (-99)}{96 \\cdot 205} \\approx -1.52$, close to $-1.5$.\n\n> **Watch out.** In a factor written backward, such as $1 - x$, the leading coefficient is $-1$, not $1$. The constant terms give $f(0)$, not the asymptote.",
        "函数写成因式乘积时不必展开：乘积的首项系数等于各因式首项系数之积。注意倒着写的因式，如 $3 - 2x$ 的首项系数是 $-2$。\n\n$$f(x) = \\frac{(2x - 1)(3 - x)}{(3x + 1)(x + 4)}: \\quad y = \\frac{2 \\cdot (-1)}{3 \\cdot 1} = -\\frac{2}{3}$$\n\n对 $f(x) = \\frac{(3x + 2)(1 - x)}{(x - 4)(2x + 5)}$，首项系数分别是 $3 \\cdot (-1) = -3$ 和 $1 \\cdot 2 = 2$，所以 $y = -\\frac{3}{2}$。检验：$f(100) = \\frac{302 \\cdot (-99)}{96 \\cdot 205} \\approx -1.52$，接近 $-1.5$。\n\n> **注意。** 倒着写的因式如 $1 - x$，首项系数是 $-1$ 而不是 $1$。常数项给出的是 $f(0)$，不是渐近线。",
      ),
      generate(rng) {
        for (;;) {
          const lin = (): [number, number, string] => {
            const k = rng.pick([1, 1, 2, 3, -1, -2]);
            const m = rng.nonZero(-7, 7);
            const latex = k < 0 ? `(${poly([m, ""], [k, "x"])})` : `(${linear(k, m)})`;
            return [k, m, latex];
          };
          const fs = [lin(), lin(), lin(), lin()];
          const lead = rng.pick([1, 1, 1, 2, 3, -1]);
          const [a1, a2, c1, c2] = fs.map(([k]) => k) as [number, number, number, number];
          const [b1, b2, d1, d2] = fs.map(([, m]) => m) as [number, number, number, number];
          const answer = Q.of(lead * a1 * a2, c1 * c2);
          if ((a1 === c1 && b1 === d1) || (a2 === c2 && b2 === d2)) continue;
          return numberProblem({
            prompt: t(
              `Find the horizontal asymptote of $f(x) = ${frac(`${front(lead)}${fs[0]![2]}${fs[1]![2]}`, `${fs[2]![2]}${fs[3]![2]}`)}$.`,
              `求 $f(x) = ${frac(`${front(lead)}${fs[0]![2]}${fs[1]![2]}`, `${fs[2]![2]}${fs[3]![2]}`)}$ 的水平渐近线。`,
            ),
            answer,
            solveFor: "y",
            wrong: [Q.of(lead * b1 * b2, d1 * d2), answer.neg(), ...(c1 + c2 !== 0 ? [Q.of(lead * (a1 + a2), c1 + c2)] : [])],
            solution: walked(
              [
                [
                  ["Compare the degrees", "比较次数"],
                  t(
                    "The numerator and the denominator are each a product of two linear factors, so both have degree $2$.",
                    "分子和分母都是两个一次因式之积，所以都是二次。",
                  ),
                ],
                [
                  ["Multiply the leading coefficients", "首项系数相乘"],
                  t(
                    "The leading coefficient of a product is the product of the leading coefficients:",
                    "乘积的首项系数等于各因式首项系数之积：",
                  ),
                  [
                    `${lead === 1 ? "" : `${paren(lead)} \\cdot `}${paren(a1)} \\cdot ${paren(a2)} = ${lead * a1 * a2}, \\quad ${paren(c1)} \\cdot ${paren(c2)} = ${c1 * c2}`,
                    `y = ${ratioText(lead * a1 * a2, c1 * c2)}`,
                  ],
                ],
              ],
              nearCheck(1000, (lead * (a1 * 1000 + b1) * (a2 * 1000 + b2)) / ((c1 * 1000 + d1) * (c2 * 1000 + d2)), answer),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.5.5 End behavior of rational functions ──────────────────────────────

const endOptions: readonly Text[] = [
  t(
    "$f(x) \\to \\infty$ as $x \\to \\infty$, and $f(x) \\to \\infty$ as $x \\to -\\infty$",
    "当 $x \\to \\infty$ 时 $f(x) \\to \\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to \\infty$",
  ),
  t(
    "$f(x) \\to -\\infty$ as $x \\to \\infty$, and $f(x) \\to -\\infty$ as $x \\to -\\infty$",
    "当 $x \\to \\infty$ 时 $f(x) \\to -\\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to -\\infty$",
  ),
  t(
    "$f(x) \\to \\infty$ as $x \\to \\infty$, and $f(x) \\to -\\infty$ as $x \\to -\\infty$",
    "当 $x \\to \\infty$ 时 $f(x) \\to \\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to -\\infty$",
  ),
  t(
    "$f(x) \\to -\\infty$ as $x \\to \\infty$, and $f(x) \\to \\infty$ as $x \\to -\\infty$",
    "当 $x \\to \\infty$ 时 $f(x) \\to -\\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to \\infty$",
  ),
];

/** endIndex is the end behavior option for the signs at +∞ and −∞. */
const endIndex = (plusInf: number, minusInf: number) => (plusInf === minusInf ? (plusInf > 0 ? 0 : 1) : plusInf > 0 ? 2 : 3);

/** endBehaviorOfRationalFunctions describes f(x) as x → ±∞: a limit, unbounded growth, or a slant asymptote. */
export const endBehaviorOfRationalFunctions: TopicDef = {
  id: "end-behavior-of-rational-functions",
  title: t("End Behavior of Rational Functions", "分式函数的端点行为"),
  summary: t(
    "Describe what a rational function does as $x \\to \\pm\\infty$: approach a horizontal asymptote, grow without bound, or follow a slant asymptote.",
    "描述 $x \\to \\pm\\infty$ 时分式函数的变化：趋近水平渐近线、无界增大，或沿斜渐近线变化。",
  ),
  prerequisites: ["horizontal-asymptotes-of-rational-functions"],
  encompasses: [
    { topic: "horizontal-asymptotes-of-rational-functions", weight: 0.5 },
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Divide $f(x) = \\frac{x^{2} + 1}{x}$ term by term: $f(x) = x + \\frac{1}{x}$. As $x \\to \\pm\\infty$ the part $\\frac{1}{x}$ tends to $0$, so the graph gets closer and closer to the line $y = x$. It has no horizontal asymptote, but it follows a slant one.

Check: $f(10) = \\frac{101}{10} = 10.1$, just above the line's value $10$.

In this lesson we find limits at infinity, describe the end behavior when the numerator has the higher degree, and find slant asymptotes by division.`,
    `把 $f(x) = \\frac{x^{2} + 1}{x}$ 逐项相除：$f(x) = x + \\frac{1}{x}$。当 $x \\to \\pm\\infty$ 时 $\\frac{1}{x}$ 趋于 $0$，所以图象越来越接近直线 $y = x$。它没有水平渐近线，但沿一条斜渐近线变化。

检验：$f(10) = \\frac{101}{10} = 10.1$，略高于直线上的值 $10$。

这节课我们求无穷远处的极限，描述分子次数更高时的端点行为，并用除法求斜渐近线。`,
  ),
  knowledgePoints: [
    {
      id: "limits-at-infinity",
      figure: precalculusDrawings["end-behavior-of-rational-functions#limits-at-infinity"],
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "$\\lim_{x \\to \\infty} f(x) = L$ means that $f(x)$ gets as close to $L$ as we like when $x$ is large enough; $\\lim_{x \\to -\\infty}$ is the same for large negative $x$. For a rational function whose numerator degree is at most the denominator degree, the limit at both ends is the horizontal asymptote:\n\n$$\\lim_{x \\to -\\infty} \\frac{4x^{3} - 1}{2x^{3} + x} = \\frac{4}{2} = 2, \\qquad \\lim_{x \\to \\infty} \\frac{4x - 1}{2x^{3} + x} = 0$$\n\nFor $\\lim_{x \\to \\infty} \\frac{3x^{2} - 5}{1 - 6x^{2}}$, both have degree $2$, so the limit is $\\frac{3}{-6} = -\\frac{1}{2}$. Check: at $x = 10$ the fraction is $\\frac{295}{-599} \\approx -0.492$.\n\n> **Watch out.** When the numerator has the lower degree the limit is $0$, not the ratio of the leading coefficients. The constant terms never decide a limit at infinity.",
        "$\\lim_{x \\to \\infty} f(x) = L$ 表示只要 $x$ 足够大，$f(x)$ 就可以任意接近 $L$；$\\lim_{x \\to -\\infty}$ 则对绝对值很大的负数 $x$ 而言。对分子次数不超过分母次数的分式函数，两端的极限都是水平渐近线的值：\n\n$$\\lim_{x \\to -\\infty} \\frac{4x^{3} - 1}{2x^{3} + x} = \\frac{4}{2} = 2, \\qquad \\lim_{x \\to \\infty} \\frac{4x - 1}{2x^{3} + x} = 0$$\n\n对 $\\lim_{x \\to \\infty} \\frac{3x^{2} - 5}{1 - 6x^{2}}$，两者都是二次，所以极限是 $\\frac{3}{-6} = -\\frac{1}{2}$。检验：$x = 10$ 时分式等于 $\\frac{295}{-599} \\approx -0.492$。\n\n> **注意。** 分子次数较低时极限是 $0$，而不是首项系数之比。常数项决定不了无穷远处的极限。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(1, 3);
          const n = rng.int(Math.max(0, m - 2), m);
          const N = randomPoly(rng, n, 9);
          const D = randomPoly(rng, m, 6);
          const [a, b] = [N[n]!, D[m]!];
          if (n === m && N.every((c, i) => c * b === D[i]! * a)) continue;
          const dir = rng.pick(["\\infty", "-\\infty"]);
          const answer = n < m ? Q.zero : Q.of(a, b);
          return numberProblem({
            prompt: t(`Find $\\lim_{x \\to ${dir}} ${frac(pl(N), pl(D))}$.`, `求 $\\lim_{x \\to ${dir}} ${frac(pl(N), pl(D))}$。`),
            answer,
            wrong: [Q.of(a, b), Q.of(b, a), ...(D[0] !== 0 ? [Q.of(N[0]!, D[0]!)] : []), Q.zero],
            solution: walked(
              [
                [
                  ["Compare the degrees", "比较次数"],
                  n < m
                    ? t(
                        `The numerator has lower degree ($${n}$) than the denominator ($${m}$), so the fraction tends to $0$ at both ends.`,
                        `分子的次数（$${n}$）低于分母的次数（$${m}$），所以分式在两端都趋于 $0$。`,
                      )
                    : t(
                        `Both have degree $${n}$, so for large $|x|$ only the leading terms matter.`,
                        `两者都是 $${n}$ 次，所以当 $|x|$ 很大时只有首项起作用。`,
                      ),
                ],
                [
                  ["Take the limit", "求极限"],
                  n < m ? t("So:", "所以：") : t("The limit is the ratio of the leading coefficients:", "极限是首项系数之比："),
                  [
                    n < m
                      ? `\\lim_{x \\to ${dir}} f(x) = 0`
                      : `\\lim_{x \\to ${dir}} f(x) = ${frac(lead1(a, n), lead1(b, n))} = ${num(answer)}`,
                  ],
                ],
              ],
              ((x) => nearCheck(x, at(N, x) / at(D, x), answer))((dir === "\\infty" ? 1 : -1) * (n < m ? 100 : 1000)),
            ),
          });
        }
      },
    },
    {
      id: "unbounded-end-behavior",
      title: t("Unbounded end behavior", "无界的端点行为"),
      explanation: t(
        "When the numerator has the higher degree, $f(x)$ behaves at both ends like the quotient of the leading terms, a power of $x$:\n\n$$f(x) = \\frac{-2x^{4} + x}{x^{2} - 5} \\approx \\frac{-2x^{4}}{x^{2}} = -2x^{2}$$\n\nSo $f(x) \\to -\\infty$ as $x \\to \\infty$ and as $x \\to -\\infty$. For an odd power such as $3x$, the two ends go in opposite directions.\n\nFor $f(x) = \\frac{3x^{3} - 1}{x^{2} + 2} \\approx \\frac{3x^{3}}{x^{2}} = 3x$, an odd power with a positive coefficient: $f(x) \\to \\infty$ as $x \\to \\infty$ and $f(x) \\to -\\infty$ as $x \\to -\\infty$. Check: $f(10) = \\frac{2999}{102} \\approx 29.4 > 0$ and $f(-10) = \\frac{-3001}{102} \\approx -29.4 < 0$.\n\n> **Watch out.** Divide the leading terms with their signs: a negative leading coefficient in the denominator flips both ends. Only the power left over, $n - m$, decides whether the two ends agree.",
        "当分子次数更高时，$f(x)$ 在两端的行为与两个首项之商（$x$ 的一个幂）相同：\n\n$$f(x) = \\frac{-2x^{4} + x}{x^{2} - 5} \\approx \\frac{-2x^{4}}{x^{2}} = -2x^{2}$$\n\n所以当 $x \\to \\infty$ 和 $x \\to -\\infty$ 时都有 $f(x) \\to -\\infty$。对奇次幂如 $3x$，两端趋向相反。\n\n对 $f(x) = \\frac{3x^{3} - 1}{x^{2} + 2} \\approx \\frac{3x^{3}}{x^{2}} = 3x$，这是系数为正的奇次幂：当 $x \\to \\infty$ 时 $f(x) \\to \\infty$，当 $x \\to -\\infty$ 时 $f(x) \\to -\\infty$。检验：$f(10) = \\frac{2999}{102} \\approx 29.4 > 0$，$f(-10) = \\frac{-3001}{102} \\approx -29.4 < 0$。\n\n> **注意。** 首项要连同符号相除：分母首项系数为负会让两端都反过来。只有剩下的次数 $n - m$ 决定两端是否同向。",
      ),
      generate(rng) {
        const m = rng.int(1, 2);
        const k = rng.int(1, 2);
        const n = m + k;
        const N = randomPoly(rng, n, 6);
        const D = randomPoly(rng, m, 4);
        const [a, b] = [N[n]!, D[m]!];
        const s = Math.sign(a * b);
        const atMinus = k % 2 === 0 ? s : -s;
        const lead = Q.of(a, b);
        const correct = endIndex(s, atMinus);
        const quotient = poly([lead, termOf(k)]);
        const far = (x: number) => at(N, x) / at(D, x);
        return reasoned(
          choiceProblem({
            prompt: t(`Describe the end behavior of $f(x) = ${frac(pl(N), pl(D))}$.`, `描述 $f(x) = ${frac(pl(N), pl(D))}$ 的端点行为。`),
            options: endOptions,
            correct,
            solution: walked(
              [
                [
                  ["Divide the leading terms", "首项相除"],
                  t("For large $|x|$ only the leading terms matter:", "当 $|x|$ 很大时只有首项起作用："),
                  [`f(x) \\approx ${frac(lead1(a, n), lead1(b, m))} = ${quotient}`],
                ],
                [
                  ["Read each end", "读出两端"],
                  t(
                    `${k === 2 ? "An even power has the same sign at both ends" : "An odd power changes sign between the ends"}, so $f(x) \\to ${infL(s)}$ as $x \\to \\infty$ and $f(x) \\to ${infL(atMinus)}$ as $x \\to -\\infty$.`,
                    `${k === 2 ? "偶次幂在两端符号相同" : "奇次幂在两端符号相反"}，所以当 $x \\to \\infty$ 时 $f(x) \\to ${infL(s)}$，当 $x \\to -\\infty$ 时 $f(x) \\to ${infL(atMinus)}$。`,
                  ),
                ],
              ],
              t(
                `Far out the signs agree:${steps(`f(100) ${far(100) > 0 ? ">" : "<"} 0, \\quad f(-100) ${far(-100) > 0 ? ">" : "<"} 0`)}`,
                `离原点很远时符号一致：${steps(`f(100) ${far(100) > 0 ? ">" : "<"} 0, \\quad f(-100) ${far(-100) > 0 ? ">" : "<"} 0`)}`,
              ),
            ),
          }),
          endOptions.flatMap((option, i) => {
            if (i === correct) return [];
            const [up, down] = (
              [
                [1, 1],
                [-1, -1],
                [1, -1],
                [-1, 1],
              ] as const
            )[i]!;
            return (up === down) !== (s === atMinus)
              ? [
                  why(
                    option,
                    `The quotient $${quotient}$ is an ${k === 2 ? "even power of $x$, so both ends go the same way" : "odd power of $x$, so the two ends go opposite ways"}.`,
                    `商 $${quotient}$ 是 $x$ 的${k === 2 ? "偶次幂，所以两端趋向相同" : "奇次幂，所以两端趋向相反"}。`,
                  ),
                ]
              : [
                  why(
                    option,
                    `The signs are reversed: the coefficient of $${quotient}$ is ${s > 0 ? "positive" : "negative"}, so $f(x) \\to ${infL(s)}$ as $x \\to \\infty$.`,
                    `符号反了：$${quotient}$ 的系数${s > 0 ? "为正" : "为负"}，所以当 $x \\to \\infty$ 时 $f(x) \\to ${infL(s)}$。`,
                  ),
                ];
          }),
        );
      },
    },
    {
      id: "slant-asymptotes",
      figure: precalculusDrawings["end-behavior-of-rational-functions#slant-asymptotes"],
      title: t("Slant asymptotes", "斜渐近线"),
      explanation: t(
        "When the numerator's degree is exactly one more than the denominator's, divide. The quotient is a linear function, and the remainder over the denominator tends to $0$, so the graph approaches the line $y = $ quotient: a **slant** (oblique) **asymptote**.\n\n$$f(x) = \\frac{2x^{2} - 3x + 4}{x - 2} = 2x + 1 + \\frac{6}{x - 2}$$\n\nAs $x \\to \\pm\\infty$, $\\frac{6}{x - 2} \\to 0$, so the slant asymptote is $y = 2x + 1$.\n\nFor $f(x) = \\frac{x^{2} + 4x + 1}{x + 1}$, synthetic division by $-1$ gives $1$, then $4 - 1 = 3$, then $1 - 3 = -2$, so $f(x) = x + 3 - \\frac{2}{x + 1}$ and the slant asymptote is $y = x + 3$. Check: $(x + 1)(x + 3) - 2 = x^{2} + 4x + 1$.\n\n> **Watch out.** To divide by $x + 1$, use $-1$ in synthetic division, not $1$. The remainder term tends to $0$ and is not part of the asymptote.",
        "当分子次数恰比分母次数多 $1$ 时，做除法。商是一次函数，余式除以分母趋于 $0$，所以图象趋近直线 $y = $ 商，这条直线叫**斜渐近线**。\n\n$$f(x) = \\frac{2x^{2} - 3x + 4}{x - 2} = 2x + 1 + \\frac{6}{x - 2}$$\n\n当 $x \\to \\pm\\infty$ 时 $\\frac{6}{x - 2} \\to 0$，所以斜渐近线是 $y = 2x + 1$。\n\n对 $f(x) = \\frac{x^{2} + 4x + 1}{x + 1}$，用 $-1$ 做综合除法得 $1$，再得 $4 - 1 = 3$，再得 $1 - 3 = -2$，所以 $f(x) = x + 3 - \\frac{2}{x + 1}$，斜渐近线是 $y = x + 3$。检验：$(x + 1)(x + 3) - 2 = x^{2} + 4x + 1$。\n\n> **注意。** 除以 $x + 1$ 时，综合除法要用 $-1$，而不是 $1$。余式项趋于 $0$，不属于渐近线。",
      ),
      keyPrerequisites: ["dividing-polynomials-using-synthetic-division"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-3, 3);
          const b = rng.int(-9, 9);
          const c = rng.int(-9, 9);
          const p = rng.nonZero(-5, 5);
          const q0 = b + a * p;
          const rem = c + p * q0;
          if (rem === 0) continue;
          const N = [c, b, a];
          return expressionProblem({
            prompt: t(
              `Find the slant asymptote of the graph of $f(x) = ${frac(pl(N), bare(p))}$.`,
              `求 $f(x) = ${frac(pl(N), bare(p))}$ 的图象的斜渐近线。`,
            ),
            answer: linear(a, q0),
            prefix: "y =",
            wrong: [linear(a, b), linear(a, b - a * p), linear(a, -q0), linear(a, q0 + rem)],
            solution: walked(
              [
                [
                  ["Divide", "做除法"],
                  t(`Synthetic division by $${p}$ brings down $${a}$, then:`, `用 $${p}$ 做综合除法，先落下 $${a}$，再算：`),
                  [
                    `${b} + ${paren(a)} \\cdot ${paren(p)} = ${q0}`,
                    `${c} + ${paren(q0)} \\cdot ${paren(p)} = ${rem}`,
                    `f(x) = ${linear(a, q0)} ${then("", rem, bare(p)).trim()}`,
                  ],
                ],
                [
                  ["Drop the remainder term", "去掉余式项"],
                  t(
                    `The remainder term tends to $0$ as $x \\to \\pm\\infty$, so the slant asymptote is $y = ${linear(a, q0)}$.`,
                    `当 $x \\to \\pm\\infty$ 时余式项趋于 $0$，所以斜渐近线是 $y = ${linear(a, q0)}$。`,
                  ),
                ],
              ],
              t(
                `Multiply back: $(${bare(p)})(${linear(a, q0)}) + ${paren(rem)}$ has $x$-coefficient and constant term${steps(`${paren(a)} \\cdot ${paren(-p)} + ${paren(q0)} = ${b}, \\quad ${paren(-p)} \\cdot ${paren(q0)} + ${paren(rem)} = ${c}`)}matching the numerator.`,
                `乘回去：$(${bare(p)})(${linear(a, q0)}) + ${paren(rem)}$ 的 $x$ 项系数和常数项是${steps(`${paren(a)} \\cdot ${paren(-p)} + ${paren(q0)} = ${b}, \\quad ${paren(-p)} \\cdot ${paren(q0)} + ${paren(rem)} = ${c}`)}与分子一致。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.5.6 Infinite limits of rational functions ───────────────────────────

/** sidedLimit writes lim as x → a from one side, or from both when side is 0. */
const sidedLimit = (a: number, side: -1 | 0 | 1) => `\\lim_{x \\to ${a}${side > 0 ? "^{+}" : side < 0 ? "^{-}" : ""}}`;

/** productAt evaluates a product of linear factors at x. */
const productAt = (lead: number, fs: readonly Factor[], x: number) => fs.reduce((s, [r, m]) => s * (x - r) ** m, lead);

/** infiniteLimitsOfRationalFunctions evaluates one-sided and two-sided infinite limits at vertical asymptotes. */
export const infiniteLimitsOfRationalFunctions: TopicDef = {
  id: "infinite-limits-of-rational-functions",
  title: t("Infinite Limits of Rational Functions", "分式函数的无穷极限"),
  summary: t(
    "Evaluate one-sided and two-sided limits of a rational function at a vertical asymptote by finding the sign of each factor.",
    "通过判断每个因式的符号，求分式函数在竖直渐近线处的单侧极限和双侧极限。",
  ),
  prerequisites: ["vertical-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Take $f(x) = \\frac{1}{x - 2}$. Just right of $2$, $x - 2$ is a tiny positive number, so $f(x)$ is huge and positive: $\\lim_{x \\to 2^{+}} f(x) = \\infty$. Just left of $2$, $x - 2$ is a tiny negative number, so $\\lim_{x \\to 2^{-}} f(x) = -\\infty$. The two sides disagree, so the two-sided limit does not exist.

Check: $f(2.01) = \\frac{1}{0.01} = 100$ and $f(1.99) = \\frac{1}{-0.01} = -100$.

In this lesson we find one-sided limits at a vertical asymptote from the signs of the factors, decide two-sided limits, and handle factors written backward.`,
    `取 $f(x) = \\frac{1}{x - 2}$。在 $2$ 右侧附近，$x - 2$ 是很小的正数，所以 $f(x)$ 为正且很大：$\\lim_{x \\to 2^{+}} f(x) = \\infty$。在 $2$ 左侧附近，$x - 2$ 是绝对值很小的负数，所以 $\\lim_{x \\to 2^{-}} f(x) = -\\infty$。两侧不一致，所以双侧极限不存在。

检验：$f(2.01) = \\frac{1}{0.01} = 100$，$f(1.99) = \\frac{1}{-0.01} = -100$。

这节课我们由因式的符号求竖直渐近线处的单侧极限，判断双侧极限，并处理倒着写的因式。`,
  ),
  knowledgePoints: [
    {
      id: "one-sided-infinite-limits",
      figure: precalculusDrawings["infinite-limits-of-rational-functions#one-sided-infinite-limits"],
      title: t("One-sided infinite limits", "单侧无穷极限"),
      explanation: t(
        "$\\lim_{x \\to a^{+}} f(x) = \\infty$ means that $f(x)$ grows without bound as $x$ approaches $a$ from the right ($x > a$); $x \\to a^{-}$ means from the left. At a vertical asymptote, find the sign of each factor near $a$:\n\n$$\\lim_{x \\to 2^{-}} \\frac{x + 1}{(x - 2)(x - 4)}$$\n\nNear $x = 2$, $x + 1 \\approx 3$ is positive and $x - 4 \\approx -2$ is negative. For $x$ just left of $2$, $x - 2$ is a tiny negative number. So the fraction is $\\frac{+}{(-)(-)}$, positive and huge: the limit is $\\infty$.\n\nFor $\\lim_{x \\to -1^{+}} \\frac{x - 3}{(x + 1)(x - 2)}$: near $-1$, $x - 3 \\approx -4$ and $x - 2 \\approx -3$, while $x + 1$ is a tiny positive number. The fraction is $\\frac{-}{(+)(-)}$, positive: the limit is $\\infty$. Check: $f(-0.99) = \\frac{-3.99}{(0.01)(-2.99)} \\approx 133$.\n\n> **Watch out.** $x \\to a^{+}$ is from the right, where $x - a$ is **positive**; $x \\to a^{-}$ is from the left, where it is negative. The other factors keep the sign of their value at $a$.",
        "$\\lim_{x \\to a^{+}} f(x) = \\infty$ 表示 $x$ 从右侧（$x > a$）趋近 $a$ 时 $f(x)$ 无界增大；$x \\to a^{-}$ 表示从左侧趋近。在竖直渐近线处，判断 $a$ 附近每个因式的符号：\n\n$$\\lim_{x \\to 2^{-}} \\frac{x + 1}{(x - 2)(x - 4)}$$\n\n在 $x = 2$ 附近，$x + 1 \\approx 3$ 为正，$x - 4 \\approx -2$ 为负。$x$ 在 $2$ 左侧附近时，$x - 2$ 是绝对值很小的负数。所以分式的符号是 $\\frac{+}{(-)(-)}$，为正且绝对值很大：极限是 $\\infty$。\n\n对 $\\lim_{x \\to -1^{+}} \\frac{x - 3}{(x + 1)(x - 2)}$：在 $-1$ 附近，$x - 3 \\approx -4$，$x - 2 \\approx -3$，而 $x + 1$ 是很小的正数。分式的符号是 $\\frac{-}{(+)(-)}$，为正：极限是 $\\infty$。检验：$f(-0.99) = \\frac{-3.99}{(0.01)(-2.99)} \\approx 133$。\n\n> **注意。** $x \\to a^{+}$ 是从右侧趋近，那里 $x - a$ 为**正**；$x \\to a^{-}$ 是从左侧趋近，那里 $x - a$ 为负。其他因式的符号与它们在 $a$ 处的值相同。",
      ),
      keyPrerequisites: ["unbounded-behavior-of-functions-near-a-point"],
      generate(rng) {
        const [p, q, r] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const a = rng.pick([1, 1, 2, -1, 3, -2]);
        const side = rng.pick([-1, 1] as const);
        const f = (x: number) => (a * (x - r)) / ((x - p) * (x - q));
        const s = nearSign(f, p, side);
        const w = sideWord(side);
        const latex = frac(prodL(simple([r]), a), `${fac(p)}${fac(q)}`);
        return reasoned(
          choiceProblem({
            prompt: t(`Find $${sidedLimit(p, side)} ${latex}$.`, `求 $${sidedLimit(p, side)} ${latex}$。`),
            options: limitOptions,
            correct: limitIndex(s, s),
            solution: walked(
              [
                [
                  ["Find the sign of each factor", "判断每个因式的符号"],
                  t(
                    `Near $x = ${p}$, the numerator is about $${a * (p - r)}$ and $${bare(q)}$ is about $${p - q}$, while $${bare(p)}$ is ${w.en}.`,
                    `在 $x = ${p}$ 附近，分子约为 $${a * (p - r)}$，$${bare(q)}$ 约为 $${p - q}$，而 $${bare(p)}$ 是${w["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Combine the signs", "合并符号"],
                  t(
                    `So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
                    `所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
                  ),
                ],
              ],
              sideCheck(f, p, [side], 0.01),
            ),
          }),
          limitReasons(s, s, true),
        );
      },
    },
    {
      id: "two-sided-infinite-limits",
      title: t("Two-sided infinite limits", "双侧无穷极限"),
      explanation: t(
        "The two-sided limit $\\lim_{x \\to a} f(x)$ is $\\infty$ (or $-\\infty$) only when both one-sided limits are. If they differ, the limit does not exist.\n\nThe power of $x - a$ decides: an **odd** power changes sign at $a$, so the two sides go in opposite directions; an **even** power is positive on both sides.\n\n$$\\lim_{x \\to 1} \\frac{-3}{(x - 1)^{2}} = -\\infty, \\qquad \\lim_{x \\to 1} \\frac{-3}{x - 1} \\text{ does not exist.}$$\n\nFor $\\lim_{x \\to -2} \\frac{5}{(x + 2)^{2}}$, the square is a tiny positive number on both sides and $5 > 0$, so both one-sided limits are $\\infty$ and the limit is $\\infty$. Check: $f(-1.9) = \\frac{5}{0.01} = 500$ and $f(-2.1) = 500$.\n\n> **Watch out.** An even power never changes sign, so the rest of the fraction decides both sides at once. An odd power always makes the two sides disagree, so the limit does not exist however the rest looks.",
        "只有当两个单侧极限都是 $\\infty$（或都是 $-\\infty$）时，双侧极限 $\\lim_{x \\to a} f(x)$ 才是 $\\infty$（或 $-\\infty$）。若两者不同，则极限不存在。\n\n由 $x - a$ 的次数决定：**奇**次幂在 $a$ 两侧变号，两侧趋向相反；**偶**次幂在两侧都为正。\n\n$$\\lim_{x \\to 1} \\frac{-3}{(x - 1)^{2}} = -\\infty, \\qquad \\lim_{x \\to 1} \\frac{-3}{x - 1} \\text{ 不存在。}$$\n\n对 $\\lim_{x \\to -2} \\frac{5}{(x + 2)^{2}}$，平方在两侧都是很小的正数，且 $5 > 0$，所以两个单侧极限都是 $\\infty$，极限是 $\\infty$。检验：$f(-1.9) = \\frac{5}{0.01} = 500$，$f(-2.1) = 500$。\n\n> **注意。** 偶次幂不会变号，所以分式的其余部分同时决定两侧。奇次幂总使两侧不一致，所以不论其余部分如何，极限都不存在。",
      ),
      generate(rng) {
        const [p, q, r] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const m = rng.pick([1, 2]);
        const a = rng.pick([1, 2, 3, 5, -1, -2, -4]);
        const withR = rng.bool();
        const withQ = rng.bool();
        const top: Factor[] = withR ? [[r, 1]] : [];
        const bottom: Factor[] = [[p, m], ...(withQ ? ([[q, 1]] as Factor[]) : [])];
        const f = (x: number) => productAt(a, top, x) / productAt(1, bottom, x);
        const [left, right] = [nearSign(f, p, -1), nearSign(f, p, 1)];
        const latex = frac(withR ? prodL(top, a) : String(a), prodL(bottom));
        const restQ = Q.of(productAt(a, top, p), productAt(1, withQ ? [[q, 1]] : [], p));
        const rest = restQ.toNumber();
        return reasoned(
          choiceProblem({
            prompt: t(`Find $${sidedLimit(p, 0)} ${latex}$.`, `求 $${sidedLimit(p, 0)} ${latex}$。`),
            options: limitOptions,
            correct: limitIndex(left, right),
            solution: walked(
              [
                [
                  ["Find the sign of the rest", "判断其余部分的符号"],
                  t(
                    `Apart from $${facPow(p, m)}$, the fraction is about $${num(restQ)}$ near $x = ${p}$, which is ${rest > 0 ? "positive" : "negative"}.`,
                    `除 $${facPow(p, m)}$ 外，分式在 $x = ${p}$ 附近约为 $${num(restQ)}$，${rest > 0 ? "为正" : "为负"}。`,
                  ),
                ],
                [
                  ["Compare the two sides", "比较两侧"],
                  t(
                    m === 2
                      ? `The square $${facPow(p, m)}$ is a tiny positive number on both sides, so both one-sided limits are $${infL(left)}$ and the limit is $${infL(left)}$.`
                      : `The factor $${bare(p)}$ is negative on the left and positive on the right, so the one-sided limits are $${infL(left)}$ and $${infL(right)}$: the limit does not exist.`,
                    m === 2
                      ? `平方 $${facPow(p, m)}$ 在两侧都是很小的正数，所以两个单侧极限都是 $${infL(left)}$，极限是 $${infL(left)}$。`
                      : `因式 $${bare(p)}$ 在左侧为负、右侧为正，所以两个单侧极限分别是 $${infL(left)}$ 和 $${infL(right)}$：极限不存在。`,
                  ),
                ],
              ],
              sideCheck(f, p, [-1, 1], 0.1),
            ),
          }),
          limitReasons(left, right, false),
        );
      },
    },
    {
      id: "factors-written-backward",
      title: t("Factors written backward", "倒着写的因式"),
      explanation: t(
        "A factor such as $3 - x$ is $0$ at $x = 3$ but has the opposite sign of $x - 3$: just right of $3$ it is a tiny **negative** number.\n\n$$\\lim_{x \\to 3^{+}} \\frac{2x}{3 - x}$$\n\nThe numerator is about $6$, positive; the denominator is a tiny negative number. The limit is $-\\infty$.\n\nFor $\\lim_{x \\to 2^{-}} \\frac{x + 1}{2 - x}$: the numerator is about $3$, and just left of $2$, $2 - x$ is a tiny **positive** number. The limit is $\\infty$. Check: $f(1.99) = \\frac{2.99}{0.01} = 299$.\n\n> **Watch out.** $2 - x$ is positive to the left of $2$ and negative to the right, the reverse of $x - 2$. Rewrite it as $-(x - 2)$ if that helps.",
        "像 $3 - x$ 这样的因式在 $x = 3$ 处为 $0$，但符号与 $x - 3$ 相反：在 $3$ 右侧附近它是绝对值很小的**负数**。\n\n$$\\lim_{x \\to 3^{+}} \\frac{2x}{3 - x}$$\n\n分子约为 $6$，为正；分母是绝对值很小的负数。极限是 $-\\infty$。\n\n对 $\\lim_{x \\to 2^{-}} \\frac{x + 1}{2 - x}$：分子约为 $3$，而在 $2$ 左侧附近 $2 - x$ 是很小的**正数**。极限是 $\\infty$。检验：$f(1.99) = \\frac{2.99}{0.01} = 299$。\n\n> **注意。** $2 - x$ 在 $2$ 的左侧为正、右侧为负，与 $x - 2$ 正好相反。需要时可把它改写成 $-(x - 2)$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-6, 6);
        const r = other(rng, -6, 6, [p]);
        const a = rng.pick([1, 2, 3, -1, -2]);
        const side = rng.pick([-1, 1] as const);
        const sq = rng.bool(0.3);
        const den = sq ? `(${p} - x)^{2}` : `${p} - x`;
        const f = (x: number) => (a * (x - r)) / (sq ? (p - x) ** 2 : p - x);
        const s = nearSign(f, p, side);
        const latex = frac(prodL(simple([r]), a), den);
        return reasoned(
          choiceProblem({
            prompt: t(`Find $${sidedLimit(p, side)} ${latex}$.`, `求 $${sidedLimit(p, side)} ${latex}$。`),
            options: limitOptions,
            correct: limitIndex(s, s),
            solution: walked(
              [
                [
                  ["Find the sign of each factor", "判断每个因式的符号"],
                  t(
                    `The numerator is about $${a * (p - r)}$. For $x$ just ${side > 0 ? "right" : "left"} of $${p}$, $${p} - x$ is a tiny ${side > 0 ? "negative" : "positive"} number${sq ? ", and its square is a tiny positive number" : ""}.`,
                    `分子约为 $${a * (p - r)}$。$x$ 在 $${p}$ ${side > 0 ? "右" : "左"}侧附近时，$${p} - x$ 是绝对值很小的${side > 0 ? "负数" : "正数"}${sq ? "，它的平方是很小的正数" : ""}。`,
                  ),
                ],
                [
                  ["Combine the signs", "合并符号"],
                  t(
                    `So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
                    `所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
                  ),
                ],
              ],
              sideCheck(f, p, [side], sq ? 0.1 : 0.01),
            ),
          }),
          limitReasons(s, s, true),
        );
      },
    },
  ],
};

// ─── 2.5.7 Infinite limits of rational functions: advanced cases ──────────

/** infiniteLimitsOfRationalFunctionsAdvancedCases evaluates limits that need factoring first, including limits at holes. */
export const infiniteLimitsOfRationalFunctionsAdvancedCases: TopicDef = {
  id: "infinite-limits-of-rational-functions-advanced-cases",
  title: t("Infinite Limits of Rational Functions: Advanced Cases", "分式函数的无穷极限：进阶情形"),
  summary: t(
    "Evaluate limits of rational functions that need factoring first, including limits at holes and at factors left after cancelling.",
    "求需要先因式分解的分式函数极限，包括空洞处的极限和约分后剩余因式处的极限。",
  ),
  prerequisites: ["infinite-limits-of-rational-functions", "locating-holes-in-rational-functions"],
  encompasses: [{ topic: "infinite-limits-of-rational-functions", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Factor $f(x) = \\frac{x - 2}{x^{2} - 5x + 6} = \\frac{x - 2}{(x - 2)(x - 3)}$. For $x \\neq 2$ it equals $\\frac{1}{x - 3}$. At $x = 2$ the factor cancels, so there is a hole and $\\lim_{x \\to 2} f(x) = \\frac{1}{2 - 3} = -1$. At $x = 3$ the factor stays, so the limit is infinite: $\\lim_{x \\to 3^{+}} f(x) = \\infty$.

Check: $f(2.01) = \\frac{1}{-0.99} \\approx -1.01$ and $f(3.01) = \\frac{1}{0.01} = 100$.

In this lesson we factor before taking a limit, find limits at holes, and read the power of a factor left after cancelling.`,
    `把 $f(x) = \\frac{x - 2}{x^{2} - 5x + 6} = \\frac{x - 2}{(x - 2)(x - 3)}$ 因式分解。当 $x \\neq 2$ 时它等于 $\\frac{1}{x - 3}$。在 $x = 2$ 处因式约去，所以那里是空洞，$\\lim_{x \\to 2} f(x) = \\frac{1}{2 - 3} = -1$。在 $x = 3$ 处因式保留，所以极限是无穷：$\\lim_{x \\to 3^{+}} f(x) = \\infty$。

检验：$f(2.01) = \\frac{1}{-0.99} \\approx -1.01$，$f(3.01) = \\frac{1}{0.01} = 100$。

这节课我们先因式分解再求极限，求空洞处的极限，并看约分后剩余因式的次数。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-before-taking-the-limit",
      title: t("Factoring before taking the limit", "先因式分解再求极限"),
      explanation: t(
        "When the denominator is expanded, factor it to see the sign of each factor:\n\n$$\\lim_{x \\to -1^{+}} \\frac{x - 5}{x^{2} - x - 2} = \\lim_{x \\to -1^{+}} \\frac{x - 5}{(x + 1)(x - 2)}$$\n\nNear $-1$: $x - 5 \\approx -6$ and $x - 2 \\approx -3$, while $x + 1$ is a tiny positive number. The fraction is $\\frac{-}{(+)(-)}$, positive: the limit is $\\infty$.\n\nFor $\\lim_{x \\to 3^{-}} \\frac{x + 1}{x^{2} - x - 6} = \\lim_{x \\to 3^{-}} \\frac{x + 1}{(x - 3)(x + 2)}$: near $3$, $x + 1 \\approx 4$ and $x + 2 \\approx 5$, while $x - 3$ is a tiny negative number. The limit is $-\\infty$. Check: $f(2.99) = \\frac{3.99}{(-0.01)(4.99)} \\approx -80$.\n\n> **Watch out.** Factor completely before reading signs, and keep the leading coefficient: $2x^{2} - 2 = 2(x - 1)(x + 1)$, not $(x - 1)(x + 1)$.",
        "分母是展开式时，先把它因式分解，再看每个因式的符号：\n\n$$\\lim_{x \\to -1^{+}} \\frac{x - 5}{x^{2} - x - 2} = \\lim_{x \\to -1^{+}} \\frac{x - 5}{(x + 1)(x - 2)}$$\n\n在 $-1$ 附近：$x - 5 \\approx -6$，$x - 2 \\approx -3$，而 $x + 1$ 是很小的正数。分式的符号是 $\\frac{-}{(+)(-)}$，为正：极限是 $\\infty$。\n\n对 $\\lim_{x \\to 3^{-}} \\frac{x + 1}{x^{2} - x - 6} = \\lim_{x \\to 3^{-}} \\frac{x + 1}{(x - 3)(x + 2)}$：在 $3$ 附近，$x + 1 \\approx 4$，$x + 2 \\approx 5$，而 $x - 3$ 是绝对值很小的负数。极限是 $-\\infty$。检验：$f(2.99) = \\frac{3.99}{(-0.01)(4.99)} \\approx -80$。\n\n> **注意。** 先完全因式分解再看符号，并保留首项系数：$2x^{2} - 2 = 2(x - 1)(x + 1)$，而不是 $(x - 1)(x + 1)$。",
      ),
      generate(rng) {
        const [p, q, r] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const a = rng.pick([1, 1, 2, -1, -3]);
        const side = rng.pick([-1, 1] as const);
        const lead = rng.pick([1, 1, 2]);
        const D = fromRoots([p, q], lead);
        const f = (x: number) => (a * (x - r)) / at(D, x);
        const s = nearSign(f, p, side);
        const top = prodL(simple([r]), a);
        return reasoned(
          choiceProblem({
            prompt: t(`Find $${sidedLimit(p, side)} ${frac(top, pl(D))}$.`, `求 $${sidedLimit(p, side)} ${frac(top, pl(D))}$。`),
            options: limitOptions,
            correct: limitIndex(s, s),
            solution: walked(
              [
                [["Factor", "因式分解"], t("Factor the denominator:", "分解分母："), [`${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}`]],
                [
                  ["Find the sign of each factor", "判断每个因式的符号"],
                  t(
                    `Near $x = ${p}$, the numerator is about $${a * (p - r)}$ and $${front(lead)}${fac(q)}$ is about $${lead * (p - q)}$, while $${bare(p)}$ is ${sideWord(side).en}.`,
                    `在 $x = ${p}$ 附近，分子约为 $${a * (p - r)}$，$${front(lead)}${fac(q)}$ 约为 $${lead * (p - q)}$，而 $${bare(p)}$ 是${sideWord(side)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Combine the signs", "合并符号"],
                  t(
                    `So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
                    `所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
                  ),
                ],
              ],
              sideCheck(f, p, [side], 0.01),
            ),
          }),
          limitReasons(s, s, true),
        );
      },
    },
    {
      id: "limits-at-holes",
      title: t("Limits at holes", "空洞处的极限"),
      explanation: t(
        "At a hole the function is undefined, but its limit is an ordinary number: cancel the common factor and substitute.\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x + 2)} = \\lim_{x \\to 3} \\frac{x + 3}{x + 2} = \\frac{6}{5}$$\n\nThe limit is the $y$-coordinate of the hole.\n\nFor $\\lim_{x \\to -1} \\frac{x^{2} - 1}{x^{2} + 3x + 2} = \\lim_{x \\to -1} \\frac{(x - 1)(x + 1)}{(x + 1)(x + 2)} = \\lim_{x \\to -1} \\frac{x - 1}{x + 2} = \\frac{-2}{1} = -2$. Check: $f(-0.99) = \\frac{-1.99}{1.01} \\approx -1.97$.\n\n> **Watch out.** Substituting before cancelling gives $\\frac{0}{0}$, which is not an answer but a signal to cancel. The limit exists even though $f(-1)$ does not.",
        "函数在空洞处无意义，但它的极限是一个普通的数：约去公因式后代入。\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x + 2)} = \\lim_{x \\to 3} \\frac{x + 3}{x + 2} = \\frac{6}{5}$$\n\n这个极限就是空洞的纵坐标。\n\n$\\lim_{x \\to -1} \\frac{x^{2} - 1}{x^{2} + 3x + 2} = \\lim_{x \\to -1} \\frac{(x - 1)(x + 1)}{(x + 1)(x + 2)} = \\lim_{x \\to -1} \\frac{x - 1}{x + 2} = \\frac{-2}{1} = -2$。检验：$f(-0.99) = \\frac{-1.99}{1.01} \\approx -1.97$。\n\n> **注意。** 约分前直接代入得 $\\frac{0}{0}$，这不是答案，而是提示要约分。即使 $f(-1)$ 无意义，极限仍然存在。",
      ),
      keyPrerequisites: ["locating-holes-in-rational-functions"],
      generate(rng) {
        const [h, r, p] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const a = rng.pick([1, 1, 2, -1, 3]);
        const N = fromRoots([h, r], a);
        const D = fromRoots([h, p]);
        const answer = Q.of(a * (h - r), h - p);
        return numberProblem({
          prompt: t(`Find $${sidedLimit(h, 0)} ${frac(pl(N), pl(D))}$.`, `求 $${sidedLimit(h, 0)} ${frac(pl(N), pl(D))}$。`),
          answer,
          wrong: [Q.zero, Q.of(a * (h - p), h - r), Q.of(a * (h + r), h + p || 1)],
          solution: walked(
            [
              [
                ["Factor and cancel", "因式分解并约分"],
                t(`Cancel $${bare(h)}$:`, `约去 $${bare(h)}$：`),
                [
                  `${sidedLimit(h, 0)} ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}${fac(p)}`)} = ${sidedLimit(h, 0)} ${frac(prodL(simple([r]), a), bare(p))}`,
                ],
              ],
              [
                ["Substitute", "代入"],
                t(`The cancelled form is defined at $x = ${h}$, so substitute:`, `约分后的式子在 $x = ${h}$ 处有意义，所以代入：`),
                [
                  `${frac(`${a === 1 ? "" : `${paren(a)} \\cdot `}(${h} - ${paren(r)})`, `${h} - ${paren(p)}`)} = ${frac(String(a * (h - r)), String(h - p))} = ${num(answer)}`,
                ],
              ],
            ],
            t(
              `The original fraction near $x = ${h}$:${steps(`f(${Number((h + 0.01).toFixed(2))}) \\approx ${approx(at(N, h + 0.01) / at(D, h + 0.01))}, \\quad ${num(answer)} \\approx ${approx(answer.toNumber())}`)}The two are close.`,
              `原分式在 $x = ${h}$ 附近：${steps(`f(${Number((h + 0.01).toFixed(2))}) \\approx ${approx(at(N, h + 0.01) / at(D, h + 0.01))}, \\quad ${num(answer)} \\approx ${approx(answer.toNumber())}`)}两者很接近。`,
            ),
          ),
        });
      },
    },
    {
      id: "factors-left-after-cancelling",
      title: t("Factors left after cancelling", "约分后剩余的因式"),
      explanation: t(
        "When $x - a$ appears more times in the denominator than in the numerator, cancelling leaves a power of $x - a$ in the denominator, and the limit at $a$ is infinite or does not exist. The **leftover** power decides, not the original one:\n\n$$\\lim_{x \\to 2} \\frac{(x - 2)(x + 1)}{(x - 2)^{3}} = \\lim_{x \\to 2} \\frac{x + 1}{(x - 2)^{2}} = \\infty$$\n\nbecause $x + 1 \\approx 3 > 0$ and $(x - 2)^{2}$ is positive on both sides.\n\nFor $\\lim_{x \\to 1} \\frac{(x - 1)^{2}(x + 2)}{(x - 1)^{3}} = \\lim_{x \\to 1} \\frac{x + 2}{x - 1}$, the leftover power is odd: the right side goes to $\\infty$ and the left side to $-\\infty$, so the limit does not exist. Check: $f(1.1) = \\frac{3.1}{0.1} = 31$ and $f(0.9) = \\frac{2.9}{-0.1} = -29$.\n\n> **Watch out.** Subtract the powers before deciding: $(x - 1)^{3}$ over $(x - 1)^{2}$ leaves an odd power even though $3$ and $2$ include an even one.",
        "当 $x - a$ 在分母中出现的次数多于分子时，约分后分母中还剩 $x - a$ 的某次幂，在 $a$ 处的极限是无穷或不存在。起决定作用的是**剩余**的次数，而不是原来的次数：\n\n$$\\lim_{x \\to 2} \\frac{(x - 2)(x + 1)}{(x - 2)^{3}} = \\lim_{x \\to 2} \\frac{x + 1}{(x - 2)^{2}} = \\infty$$\n\n因为 $x + 1 \\approx 3 > 0$，且 $(x - 2)^{2}$ 在两侧都为正。\n\n对 $\\lim_{x \\to 1} \\frac{(x - 1)^{2}(x + 2)}{(x - 1)^{3}} = \\lim_{x \\to 1} \\frac{x + 2}{x - 1}$，剩余的次数是奇数：右侧趋于 $\\infty$，左侧趋于 $-\\infty$，所以极限不存在。检验：$f(1.1) = \\frac{3.1}{0.1} = 31$，$f(0.9) = \\frac{2.9}{-0.1} = -29$。\n\n> **注意。** 先把次数相减再判断：$(x - 1)^{3}$ 除以 $(x - 1)^{2}$ 剩下的是奇次幂，尽管 $3$ 和 $2$ 中有一个是偶数。",
      ),
      generate(rng) {
        const [p, r, q] = rng.sample(range(-5, 5), 3) as [number, number, number];
        const k = rng.int(1, 2);
        const j = rng.int(1, 2);
        const a = rng.pick([1, 2, -1, -3]);
        const withQ = rng.bool();
        const top: Factor[] = [
          [p, k],
          [r, 1],
        ];
        const bottom: Factor[] = [[p, k + j], ...(withQ ? ([[q, 1]] as Factor[]) : [])];
        const f = (x: number) => productAt(a, [[r, 1]], x) / productAt(1, [[p, j], ...(withQ ? ([[q, 1]] as Factor[]) : [])], x);
        const [left, right] = [nearSign(f, p, -1), nearSign(f, p, 1)];
        const left2 = frac(prodL([[r, 1]], a), prodL([[p, j], ...(withQ ? ([[q, 1]] as Factor[]) : [])]));
        const restPositive = productAt(a, [[r, 1]], p) / (withQ ? productAt(1, [[q, 1]], p) : 1) > 0;
        const [restEn, restZh] = restPositive ? ["positive", "正"] : ["negative", "负"];
        return reasoned(
          choiceProblem({
            prompt: t(
              `Find $${sidedLimit(p, 0)} ${frac(prodL(top, a), prodL(bottom))}$.`,
              `求 $${sidedLimit(p, 0)} ${frac(prodL(top, a), prodL(bottom))}$。`,
            ),
            options: limitOptions,
            correct: limitIndex(left, right),
            solution: walked(
              [
                [["Cancel", "约分"], t(`Cancel $${facPow(p, k)}$:`, `约去 $${facPow(p, k)}$：`), [`${sidedLimit(p, 0)} ${left2}`]],
                [
                  ["Read the leftover power", "看剩余的次数"],
                  t(
                    j === 2
                      ? `Near $x = ${p}$ the rest of the fraction is ${restEn}, and the leftover square $${facPow(p, 2)}$ is positive on both sides, so both one-sided limits are $${infL(left)}$, and the limit is $${infL(left)}$.`
                      : `Near $x = ${p}$ the rest of the fraction is ${restEn}, and the leftover factor $${bare(p)}$ changes sign at $x = ${p}$, so the one-sided limits are $${infL(left)}$ and $${infL(right)}$: the limit does not exist.`,
                    j === 2
                      ? `在 $x = ${p}$ 附近，其余部分为${restZh}，剩余的平方 $${facPow(p, 2)}$ 在两侧都为正，所以两个单侧极限都是 $${infL(left)}$，极限是 $${infL(left)}$。`
                      : `在 $x = ${p}$ 附近，其余部分为${restZh}，剩余的因式 $${bare(p)}$ 在 $x = ${p}$ 处变号，所以两个单侧极限分别是 $${infL(left)}$ 和 $${infL(right)}$：极限不存在。`,
                  ),
                ],
              ],
              sideCheck(f, p, [-1, 1], 0.1),
            ),
          }),
          limitReasons(left, right, false),
        );
      },
    },
  ],
};

// ─── 2.5.8 The domain and range of a rational function ─────────────────────

/** setText writes a set of real numbers in interval notation, in math mode. */
const setText = (s: RealSet) => `$${intervalLatex(s)}$`;

/** theDomainAndRangeOfARationalFunction finds the domain and range of rational functions, holes included. */
export const theDomainAndRangeOfARationalFunction: TopicDef = {
  id: "the-domain-and-range-of-a-rational-function",
  title: t("The Domain and Range of a Rational Function", "分式函数的定义域和值域"),
  summary: t(
    "Find the domain of a rational function, and the range of a linear-over-linear function, taking holes into account.",
    "求分式函数的定义域，以及一次比一次型函数的值域，并考虑空洞的影响。",
  ),
  prerequisites: [
    "locating-holes-in-rational-functions",
    "horizontal-asymptotes-of-rational-functions",
    "domain-and-range-of-transformed-reciprocal-functions",
  ],
  encompasses: [
    { topic: "domain-and-range-of-transformed-reciprocal-functions", weight: 0.4 },
    { topic: "locating-holes-in-rational-functions", weight: 0.3 },
    { topic: "horizontal-asymptotes-of-rational-functions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Take $f(x) = \\frac{2x - 1}{x + 3}$. The denominator is $0$ at $x = -3$, so the domain is every real number except $-3$. The horizontal asymptote is $y = \\frac{2}{1} = 2$, and $f$ never takes that value, so the range is every real number except $2$.

Check: $f(x) = 2$ would mean $2x - 1 = 2(x + 3) = 2x + 6$, that is $-1 = 6$, which is false.

In this lesson we find the domain of a rational function, holes included, the range of a linear-over-linear function, and the range when the graph has a hole.`,
    `取 $f(x) = \\frac{2x - 1}{x + 3}$。分母在 $x = -3$ 处为 $0$，所以定义域是除 $-3$ 外的全体实数。水平渐近线是 $y = \\frac{2}{1} = 2$，而 $f$ 永远取不到这个值，所以值域是除 $2$ 外的全体实数。

检验：若 $f(x) = 2$，则 $2x - 1 = 2(x + 3) = 2x + 6$，即 $-1 = 6$，不成立。

这节课我们求分式函数的定义域（包括空洞），一次比一次型函数的值域，以及图象有空洞时的值域。`,
  ),
  knowledgePoints: [
    {
      id: "domain-of-a-rational-function",
      figure: precalculusDrawings["the-domain-and-range-of-a-rational-function#domain-of-a-rational-function"],
      title: t("The domain", "定义域"),
      explanation: t(
        "The domain of a rational function is every real number except the zeros of the denominator, **including** those that cancel. A hole is still a missing point.\n\n$$f(x) = \\frac{x - 1}{x^{2} + 2x - 3} = \\frac{x - 1}{(x - 1)(x + 3)}$$\n\nThe domain is $(-\\infty, -3) \\cup (-3, 1) \\cup (1, \\infty)$: $x = -3$ is a vertical asymptote and $x = 1$ is a hole.\n\nFor $f(x) = \\frac{x + 2}{x^{2} - 4} = \\frac{x + 2}{(x - 2)(x + 2)}$, the domain is $(-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty)$. Check: $f(2) = \\frac{4}{0}$ and $f(-2) = \\frac{0}{0}$ are both undefined.\n\n> **Watch out.** Read the domain before cancelling. The cancelled form $\\frac{1}{x - 2}$ is defined at $x = -2$, but $f$ is not: the hole stays out of the domain.",
        "分式函数的定义域是除去分母零点之外的全体实数，**包括**能约去的零点。空洞仍是缺失的点。\n\n$$f(x) = \\frac{x - 1}{x^{2} + 2x - 3} = \\frac{x - 1}{(x - 1)(x + 3)}$$\n\n定义域是 $(-\\infty, -3) \\cup (-3, 1) \\cup (1, \\infty)$：$x = -3$ 是竖直渐近线，$x = 1$ 是空洞。\n\n对 $f(x) = \\frac{x + 2}{x^{2} - 4} = \\frac{x + 2}{(x - 2)(x + 2)}$，定义域是 $(-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty)$。检验：$f(2) = \\frac{4}{0}$ 和 $f(-2) = \\frac{0}{0}$ 都无意义。\n\n> **注意。** 要在约分前读定义域。约分后的 $\\frac{1}{x - 2}$ 在 $x = -2$ 处有意义，但 $f$ 没有：空洞仍不在定义域内。",
      ),
      generate(rng) {
        const [p, q] = rng.sample(range(-7, 7), 2) as [number, number];
        const share = rng.bool(0.6);
        const s = share ? rng.pick([p, q]) : other(rng, -7, 7, [p, q]);
        const lead = rng.pick([1, 1, 2, 3]);
        const D = fromRoots([p, q], lead);
        const top = rng.bool(0.25) ? String(rng.nonZero(-9, 9)) : bare(s);
        const shared = share && top === bare(s);
        const answer = exceptN(p, q);
        const vas = shared ? [p, q].filter((x) => x !== s) : [p, q];
        return intervalProblem({
          prompt: t(
            `Find the domain of $f(x) = ${frac(top, pl(D))}$. Write it in interval notation.`,
            `求 $f(x) = ${frac(top, pl(D))}$ 的定义域，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong: [exceptN(...vas), exceptN(-p, -q), realLine, ...(top === bare(s) ? [exceptN(p, q, s)] : [])].filter(
            (w) => intervalLatex(w) !== intervalLatex(answer),
          ),
          solution: walked(
            [
              [
                ["Factor the denominator", "分解分母"],
                t(`The denominator is $0$ at $x = ${p}$ and $x = ${q}$:`, `分母在 $x = ${p}$ 和 $x = ${q}$ 处为 $0$：`),
                [`${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}`],
              ],
              [
                ["Remove those values", "去掉这些值"],
                t(
                  `${shared ? `The factor $${bare(s)}$ cancels, but $f(${s})$ is still not defined: there is a hole. ` : ""}The domain is ${setText(answer)}.`,
                  `${shared ? `因式 $${bare(s)}$ 能约去，但 $f(${s})$ 仍无意义：那里是空洞。` : ""}定义域是 ${setText(answer)}。`,
                ),
              ],
            ],
            t(
              `Substitute each excluded value into the factored denominator:${steps(...[p, q].map((x) => `${lead === 1 ? "" : `${lead} \\cdot `}(${x} - ${paren(p)})(${x} - ${paren(q)}) = 0`))}`,
              `把每个去掉的值代入分解后的分母：${steps(...[p, q].map((x) => `${lead === 1 ? "" : `${lead} \\cdot `}(${x} - ${paren(p)})(${x} - ${paren(q)}) = 0`))}`,
            ),
          ),
        });
      },
    },
    {
      id: "range-of-a-linear-over-linear-function",
      figure: precalculusDrawings["the-domain-and-range-of-a-rational-function#range-of-a-linear-over-linear-function"],
      title: t("The range of $\\frac{ax + b}{cx + d}$", "$\\frac{ax + b}{cx + d}$ 的值域"),
      explanation: t(
        "A function $f(x) = \\frac{ax + b}{cx + d}$ with $ad - bc \\neq 0$ is a transformed reciprocal function. It takes every value except its horizontal asymptote $y = \\frac{a}{c}$.\n\nTo see why, solve $y = \\frac{ax + b}{cx + d}$ for $x$: $x = \\frac{b - dy}{cy - a}$, which works for every $y$ except $y = \\frac{a}{c}$.\n\nSo the range of $\\frac{4x - 1}{2x + 3}$ is $(-\\infty, 2) \\cup (2, \\infty)$.\n\nFor $f(x) = \\frac{3 - x}{2x + 5}$, $a = -1$ and $c = 2$, so the range is every value except $y = -\\frac{1}{2}$. Check: $ad - bc = (-1)(5) - (3)(2) = -11 \\neq 0$, so $f$ is not constant.\n\n> **Watch out.** The value left out of the range is $\\frac{a}{c}$, from the horizontal asymptote. The value $-\\frac{d}{c}$, here $-\\frac{5}{2}$, is left out of the **domain**.",
        "当 $ad - bc \\neq 0$ 时，函数 $f(x) = \\frac{ax + b}{cx + d}$ 是平移伸缩后的反比例函数。它取到除水平渐近线 $y = \\frac{a}{c}$ 之外的一切值。\n\n原因：从 $y = \\frac{ax + b}{cx + d}$ 解出 $x$，得 $x = \\frac{b - dy}{cy - a}$，对除 $y = \\frac{a}{c}$ 外的每个 $y$ 都成立。\n\n所以 $\\frac{4x - 1}{2x + 3}$ 的值域是 $(-\\infty, 2) \\cup (2, \\infty)$。\n\n对 $f(x) = \\frac{3 - x}{2x + 5}$，$a = -1$，$c = 2$，所以值域是除 $y = -\\frac{1}{2}$ 外的一切值。检验：$ad - bc = (-1)(5) - (3)(2) = -11 \\neq 0$，所以 $f$ 不是常数。\n\n> **注意。** 值域中去掉的是来自水平渐近线的 $\\frac{a}{c}$。$-\\frac{d}{c}$（这里是 $-\\frac{5}{2}$）是从**定义域**中去掉的值。",
      ),
      keyPrerequisites: ["domain-and-range-of-transformed-reciprocal-functions"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-6, 6);
          const b = rng.int(-9, 9);
          const c = rng.int(1, 4);
          const d = rng.int(-9, 9);
          if (a * d - b * c === 0 || gcd(gcd(Math.abs(a), Math.abs(b)), gcd(c, Math.abs(d))) !== 1) continue;
          const ha = Q.of(a, c);
          const answer = except(ha);
          return intervalProblem({
            prompt: t(
              `Find the range of $f(x) = ${frac(linear(a, b), linear(c, d))}$. Write it in interval notation.`,
              `求 $f(x) = ${frac(linear(a, b), linear(c, d))}$ 的值域，用区间记号表示。`,
            ),
            set: answer,
            form: "interval",
            wrong: [except(Q.of(-d, c)), ...(b !== 0 ? [except(Q.of(b, d === 0 ? 1 : d))] : []), except(Q.of(c, a)), realLine].filter(
              (w) => intervalLatex(w) !== intervalLatex(answer),
            ),
            solution: walked(
              [
                [
                  ["Find the horizontal asymptote", "求水平渐近线"],
                  t(
                    "The numerator and denominator have the same degree, so the horizontal asymptote is the ratio of the leading coefficients:",
                    "分子和分母次数相同，所以水平渐近线是首项系数之比：",
                  ),
                  [`y = ${frac(String(a), String(c))} = ${num(ha)}`],
                ],
                [
                  ["Check that $f$ is not constant", "确认 $f$ 不是常数"],
                  t("The value of $ad - bc$ is not $0$:", "$ad - bc$ 的值不为 $0$："),
                  [`ad - bc = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${a * d - b * c} \\neq 0`],
                ],
                [
                  ["Write the range", "写出值域"],
                  t(
                    `So $f$ takes every value except the horizontal asymptote. The range is ${setText(answer)}.`,
                    `所以 $f$ 取到除水平渐近线外的一切值。值域是 ${setText(answer)}。`,
                  ),
                ],
              ],
              t(
                `Set $f(x) = ${num(ha)}$ and multiply by the denominator:${steps(`${num(ha)} \\left(${linear(c, d)}\\right) = ${linear(a, b)}`)}The $x$-terms cancel and leave $${num(Q.of(a * d, c))} = ${b}$, which is false, so this value is never reached.`,
                `令 $f(x) = ${num(ha)}$，两边乘以分母：${steps(`${num(ha)} \\left(${linear(c, d)}\\right) = ${linear(a, b)}`)}$x$ 项相消，剩下 $${num(Q.of(a * d, c))} = ${b}$，不成立，所以这个值取不到。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "range-with-a-hole",
      figure: precalculusDrawings["the-domain-and-range-of-a-rational-function#range-with-a-hole"],
      title: t("The range when there is a hole", "有空洞时的值域"),
      explanation: t(
        "A hole removes one more value from the range: the $y$-coordinate of the hole, unless the graph reaches that value somewhere else. For a simplified function $\\frac{ax + b}{cx + d}$, every value except $\\frac{a}{c}$ is reached exactly once, so the hole's value is missing.\n\n$$f(x) = \\frac{(x - 1)(2x + 1)}{(x - 1)(x + 2)} = \\frac{2x + 1}{x + 2} \\quad (x \\neq 1)$$\n\nThe hole is at $(1, 1)$ and the horizontal asymptote is $y = 2$, so the range is $(-\\infty, 1) \\cup (1, 2) \\cup (2, \\infty)$.\n\nFor $f(x) = \\frac{(x + 2)(x - 3)}{(x + 2)(x - 1)} = \\frac{x - 3}{x - 1}$ with $x \\neq -2$, the horizontal asymptote is $y = 1$ and the hole is at $\\left(-2, \\frac{5}{3}\\right)$. The range is every value except $1$ and $\\frac{5}{3}$. Check: $\\frac{-2 - 3}{-2 - 1} = \\frac{-5}{-3} = \\frac{5}{3}$.\n\n> **Watch out.** The hole's $x$-value $-2$ leaves the domain; its $y$-value $\\frac{5}{3}$ is what leaves the range.",
        "空洞会让值域再少一个值：空洞的纵坐标，除非图象在别处取到这个值。对化简后的函数 $\\frac{ax + b}{cx + d}$，除 $\\frac{a}{c}$ 外的每个值都恰好取到一次，所以空洞处的值缺失。\n\n$$f(x) = \\frac{(x - 1)(2x + 1)}{(x - 1)(x + 2)} = \\frac{2x + 1}{x + 2} \\quad (x \\neq 1)$$\n\n空洞在 $(1, 1)$，水平渐近线是 $y = 2$，所以值域是 $(-\\infty, 1) \\cup (1, 2) \\cup (2, \\infty)$。\n\n对 $f(x) = \\frac{(x + 2)(x - 3)}{(x + 2)(x - 1)} = \\frac{x - 3}{x - 1}$（$x \\neq -2$），水平渐近线是 $y = 1$，空洞在 $\\left(-2, \\frac{5}{3}\\right)$。值域是除 $1$ 和 $\\frac{5}{3}$ 外的一切值。检验：$\\frac{-2 - 3}{-2 - 1} = \\frac{-5}{-3} = \\frac{5}{3}$。\n\n> **注意。** 空洞的横坐标 $-2$ 从定义域中去掉；从值域中去掉的是它的纵坐标 $\\frac{5}{3}$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-4, 4);
          const b = rng.int(-7, 7);
          const d = rng.int(-6, 6);
          const h = rng.int(-5, 5);
          if (a * d - b === 0 || h + d === 0) continue;
          const ha = Q.of(a);
          const yh = Q.of(a * h + b, h + d);
          const answer = except(ha, yh);
          const [xTop, xBottom] = [Q.of(b).sub(Q.of(d).mul(yh)), yh.sub(ha)];
          const byLine = `x = ${num(xTop)} \\div ${xBottom.sign() < 0 ? `\\left(${num(xBottom)}\\right)` : num(xBottom)} = ${h}`;
          const f = frac(`${fac(h)}(${linear(a, b)})`, `${fac(h)}${fac(-d)}`);
          return intervalProblem({
            prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
            set: answer,
            form: "interval",
            wrong: [except(ha), except(yh), except(Q.of(-d), Q.of(h)), except(ha, Q.of(h))].filter(
              (w) => intervalLatex(w) !== intervalLatex(answer),
            ),
            solution: walked(
              [
                [
                  ["Cancel", "约分"],
                  t(`Cancel $${bare(h)}$:`, `约去 $${bare(h)}$：`),
                  [`f(x) = ${frac(linear(a, b), bare(-d))}, \\quad x \\neq ${h}`],
                ],
                [
                  ["Find the missing values", "找出取不到的值"],
                  t(
                    `This takes every value except the horizontal asymptote $y = ${a}$, and the hole at $x = ${h}$ removes its height:`,
                    `它取到除水平渐近线 $y = ${a}$ 外的一切值，而 $x = ${h}$ 处的空洞再去掉它的高度：`,
                  ),
                  [`${frac(`${scaled(a, String(h))}${plus(b)}`, d === 0 ? String(h) : `${h}${plus(d)}`)} = ${num(yh)}`],
                ],
                [["Write the range", "写出值域"], t(`The range is ${setText(answer)}.`, `值域是 ${setText(answer)}。`)],
              ],
              t(
                `Solve $y = ${frac(linear(a, b), bare(-d))}$ for $x$ and put in $y = ${num(yh)}$:${steps(`x = ${frac(poly([b, ""], [-d, "y"]), poly([1, "y"], [-a, ""]))}`, byLine)}Only the removed $x = ${h}$ gives this value, and no $x$ gives $y = ${a}$.`,
                `从 $y = ${frac(linear(a, b), bare(-d))}$ 解出 $x$，再代入 $y = ${num(yh)}$：${steps(`x = ${frac(poly([b, ""], [-d, "y"]), poly([1, "y"], [-a, ""]))}`, byLine)}只有被去掉的 $x = ${h}$ 给出这个值，而没有 $x$ 给出 $y = ${a}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.5.9 Identifying a rational function from a graph ────────────────────

/** bothEnds says the graph of a(x − r)/(x − p) is visible at both edges of the view. */
const bothEnds = (a: number, r: number, p: number) =>
  [view.xMin, view.xMax].every((x) => Math.abs((a * (x - r)) / (x - p)) < view.yMax - 0.5);

/** ratioLatex writes a(x − r)/(x − p). */
const ratioLatex = (a: number, r: number, p: number) => frac(prodL(simple([r]), a), bare(p));

/** identifyingARationalFunctionFromAGraph reads a rational function's formula from its asymptotes, intercepts and a marked point. */
export const identifyingARationalFunctionFromAGraph: TopicDef = {
  id: "identifying-a-rational-function-from-a-graph",
  title: t("Identifying a Rational Function From a Graph", "由图象确定分式函数"),
  summary: t(
    "Write the formula of a rational function from its graph, using its asymptotes, intercepts and marked points.",
    "利用渐近线、截距和标出的点，由图象写出分式函数的解析式。",
  ),
  prerequisites: ["vertical-asymptotes-of-rational-functions", "horizontal-asymptotes-of-rational-functions"],
  encompasses: [
    { topic: "vertical-asymptotes-of-rational-functions", weight: 0.3 },
    { topic: "horizontal-asymptotes-of-rational-functions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D", "CCSS.HSF.BF.A.1"],
  intro: t(
    `A graph has the vertical asymptote $x = 1$, the horizontal asymptote $y = 2$ and the $x$-intercept $(-3, 0)$. The root gives the factor $x + 3$ on top, the vertical asymptote gives $x - 1$ below, and the horizontal asymptote gives the leading coefficient $2$:

$$f(x) = \\frac{2(x + 3)}{x - 1}$$

Check: $f(-3) = \\frac{2 \\cdot 0}{-4} = 0$, and $f(0) = \\frac{6}{-1} = -6$ is where the graph crosses the $y$-axis.

In this lesson we read a linear-over-linear function from its graph, find the constant of a function with two vertical asymptotes from a marked point, and tell odd powers from even ones.`,
    `某图象有竖直渐近线 $x = 1$、水平渐近线 $y = 2$ 和 $x$ 轴截点 $(-3, 0)$。零点给出分子的因式 $x + 3$，竖直渐近线给出分母的 $x - 1$，水平渐近线给出首项系数 $2$：

$$f(x) = \\frac{2(x + 3)}{x - 1}$$

检验：$f(-3) = \\frac{2 \\cdot 0}{-4} = 0$，而 $f(0) = \\frac{6}{-1} = -6$ 正是图象与 $y$ 轴的交点。

这节课我们由图象读出一次比一次型函数，由标出的点求有两条竖直渐近线的函数中的常数，并区分奇次幂和偶次幂。`,
  ),
  knowledgePoints: [
    {
      id: "linear-over-linear-from-a-graph",
      figure: precalculusDrawings["identifying-a-rational-function-from-a-graph#linear-over-linear-from-a-graph"],
      title: t("A root and two asymptotes", "一个零点和两条渐近线"),
      explanation: t(
        "A graph with one vertical asymptote $x = p$, horizontal asymptote $y = a$ and $x$-intercept $(r, 0)$ belongs to\n\n$$f(x) = \\frac{a(x - r)}{x - p}$$\n\nThe root puts $x - r$ in the numerator, the vertical asymptote puts $x - p$ in the denominator, and since both have degree $1$, the horizontal asymptote is the leading coefficient $a$.\n\nWith vertical asymptote $x = -2$, horizontal asymptote $y = -1$ and $x$-intercept $(3, 0)$: $f(x) = \\frac{-(x - 3)}{x + 2}$. Check: $f(3) = 0$, and for large $x$, $f(x) \\approx \\frac{-x}{x} = -1$.\n\n> **Watch out.** A root at $x = 3$ gives the factor $x - 3$, not $x + 3$; likewise the asymptote $x = -2$ gives $x + 2$.",
        "若图象有一条竖直渐近线 $x = p$、水平渐近线 $y = a$ 和 $x$ 轴截点 $(r, 0)$，则它是\n\n$$f(x) = \\frac{a(x - r)}{x - p}$$\n\n的图象。零点使分子含 $x - r$，竖直渐近线使分母含 $x - p$；两者都是一次，所以水平渐近线就是首项系数 $a$。\n\n若竖直渐近线是 $x = -2$，水平渐近线是 $y = -1$，$x$ 轴截点是 $(3, 0)$，则 $f(x) = \\frac{-(x - 3)}{x + 2}$。检验：$f(3) = 0$，且 $x$ 很大时 $f(x) \\approx \\frac{-x}{x} = -1$。\n\n> **注意。** $x = 3$ 处的零点给出因式 $x - 3$，而不是 $x + 3$；同样，渐近线 $x = -2$ 给出 $x + 2$。",
      ),
      generate(rng) {
        let [p, r] = rng.sample(range(-4, 4), 2) as [number, number];
        let a = rng.pick([1, 2, 3, -1, -2, -3]);
        while (!bothEnds(a, r, p)) {
          [p, r] = rng.sample(range(-4, 4), 2) as [number, number];
          a = rng.pick([1, 2, 3, -1, -2, -3]);
        }
        const d: Drawing = { f: (x) => (a * (x - r)) / (x - p), vas: [p], ha: a, dots: [[r, 0]] };
        return {
          ...expressionProblem({
            prompt: t(
              `The graph of a rational function $f(x) = \\frac{a(x - r)}{x - p}$ is shown, with its asymptotes dashed and its $x$-intercept marked. Find $f(x)$.`,
              `图中是分式函数 $f(x) = \\frac{a(x - r)}{x - p}$ 的图象，渐近线画成虚线，并标出了 $x$ 轴截点。求 $f(x)$。`,
            ),
            answer: ratioLatex(a, r, p),
            prefix: "f(x) =",
            wrong: [ratioLatex(a, p, r), ratioLatex(-a, r, p), ratioLatex(a, -r, -p)].filter(
              (w, i, ws) => ws.indexOf(w) === i && w !== ratioLatex(a, r, p),
            ),
            solution: walked(
              [
                [
                  ["Read the asymptotes", "读出渐近线"],
                  t(
                    `The vertical asymptote $x = ${p}$ makes the denominator $${bare(p)}$, and the horizontal asymptote $y = ${a}$ gives $a = ${a}$.`,
                    `竖直渐近线 $x = ${p}$ 使分母为 $${bare(p)}$，水平渐近线 $y = ${a}$ 给出 $a = ${a}$。`,
                  ),
                ],
                [
                  ["Read the intercept", "读出截点"],
                  t(
                    `The $x$-intercept $(${r}, 0)$ puts the factor $${bare(r)}$ in the numerator. So:`,
                    `$x$ 轴截点 $(${r}, 0)$ 使分子含因式 $${bare(r)}$。所以：`,
                  ),
                  [`f(x) = ${ratioLatex(a, r, p)}`],
                ],
              ],
              t(
                `At the intercept and far out:${steps(`f(${r}) = ${frac(`${scaled(a, `${r} - ${paren(r)}`)}`, `${r} - ${paren(p)}`)} = 0`, `f(1000) \\approx ${approx((a * (1000 - r)) / (1000 - p))}`)}matching the $x$-intercept and the horizontal asymptote $y = ${a}$.`,
                `在截点处和很远处：${steps(`f(${r}) = ${frac(`${scaled(a, `${r} - ${paren(r)}`)}`, `${r} - ${paren(p)}`)} = 0`, `f(1000) \\approx ${approx((a * (1000 - r)) / (1000 - p))}`)}与 $x$ 轴截点和水平渐近线 $y = ${a}$ 一致。`,
              ),
            ),
          }),
          figure: figureOf(d),
        };
      },
    },
    {
      id: "two-vertical-asymptotes-and-a-point",
      figure: precalculusDrawings["identifying-a-rational-function-from-a-graph#two-vertical-asymptotes-and-a-point"],
      title: t("Two vertical asymptotes and a point", "两条竖直渐近线和一个点"),
      explanation: t(
        "A graph with vertical asymptotes $x = p$ and $x = q$, horizontal asymptote $y = 0$ and no roots belongs to\n\n$$f(x) = \\frac{k}{(x - p)(x - q)}$$\n\nTo find $k$, substitute a marked point. If the graph passes through $(0, 2)$ and the asymptotes are $x = -1$ and $x = 3$, then $2 = \\frac{k}{(1)(-3)}$, so $k = -6$.\n\nWith asymptotes $x = 1$ and $x = -2$ and the point $(0, 3)$: $3 = \\frac{k}{(0 - 1)(0 + 2)} = \\frac{k}{-2}$, so $k = -6$ and $f(x) = \\frac{-6}{(x - 1)(x + 2)}$. Check: $f(0) = \\frac{-6}{-2} = 3$.\n\n> **Watch out.** Substitute the point into the factors with their signs: $(0 - 1)(0 + 2) = -2$, not $2$. Then multiply, do not divide, to find $k$.",
        "若图象有竖直渐近线 $x = p$ 和 $x = q$、水平渐近线 $y = 0$，且没有零点，则它是\n\n$$f(x) = \\frac{k}{(x - p)(x - q)}$$\n\n的图象。代入标出的点求 $k$。若图象经过 $(0, 2)$，渐近线是 $x = -1$ 和 $x = 3$，则 $2 = \\frac{k}{(1)(-3)}$，所以 $k = -6$。\n\n若渐近线是 $x = 1$ 和 $x = -2$，点是 $(0, 3)$：$3 = \\frac{k}{(0 - 1)(0 + 2)} = \\frac{k}{-2}$，所以 $k = -6$，$f(x) = \\frac{-6}{(x - 1)(x + 2)}$。检验：$f(0) = \\frac{-6}{-2} = 3$。\n\n> **注意。** 把点代入因式时要带符号：$(0 - 1)(0 + 2) = -2$，而不是 $2$。然后用乘法而不是除法求 $k$。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q] = (rng.sample(range(-4, 4), 2) as [number, number]).sort((u, v) => u - v);
          const x0 = other(rng, -4, 4, [p, q]);
          const y0 = rng.nonZero(-4, 4);
          const k = y0 * (x0 - p) * (x0 - q);
          if (Math.abs(k) > 16 || Math.abs((4 * k) / (q - p) ** 2) > 5.5) continue;
          const answer = frac(String(k), `${fac(p)}${fac(q)}`);
          const d: Drawing = { f: (x) => k / ((x - p) * (x - q)), vas: [p, q], ha: 0, dots: [[x0, y0]] };
          return {
            ...expressionProblem({
              prompt: t(
                `The graph of $f(x) = \\frac{k}{(x - p)(x - q)}$ is shown, with its vertical asymptotes dashed. It passes through the marked point $(${x0}, ${y0})$. Find $f(x)$.`,
                `图中是 $f(x) = \\frac{k}{(x - p)(x - q)}$ 的图象，竖直渐近线画成虚线，图象经过标出的点 $(${x0}, ${y0})$。求 $f(x)$。`,
              ),
              answer,
              prefix: "f(x) =",
              wrong: [
                frac(String(y0), `${fac(p)}${fac(q)}`),
                frac(String(-k), `${fac(p)}${fac(q)}`),
                frac(String(k), `${fac(-p)}${fac(-q)}`),
              ].filter((w, i, ws) => ws.indexOf(w) === i && w !== answer),
              solution: walked(
                [
                  [
                    ["Write the form", "写出形式"],
                    t(
                      `The vertical asymptotes are $x = ${p}$ and $x = ${q}$, and there is no root, so:`,
                      `竖直渐近线是 $x = ${p}$ 和 $x = ${q}$，且没有零点，所以：`,
                    ),
                    [`f(x) = ${frac("k", `${fac(p)}${fac(q)}`)}`],
                  ],
                  [
                    ["Substitute the point", "代入该点"],
                    t(`Put in $(${x0}, ${y0})$ and solve for $k$:`, `代入 $(${x0}, ${y0})$，解出 $k$：`),
                    [
                      `${y0} = ${frac("k", `(${x0} - ${paren(p)})(${x0} - ${paren(q)})`)} = ${frac("k", String((x0 - p) * (x0 - q)))}`,
                      `k = ${paren(y0)} \\cdot ${paren((x0 - p) * (x0 - q))} = ${k}, \\quad f(x) = ${answer}`,
                    ],
                  ],
                ],
                t(
                  `At the marked point:${steps(`f(${x0}) = ${frac(String(k), String((x0 - p) * (x0 - q)))} = ${y0}`)}`,
                  `在标出的点处：${steps(`f(${x0}) = ${frac(String(k), String((x0 - p) * (x0 - q)))} = ${y0}`)}`,
                ),
              ),
            }),
            figure: figureOf(d),
          };
        }
      },
    },
    {
      id: "even-multiplicity-asymptotes",
      figure: precalculusDrawings["identifying-a-rational-function-from-a-graph#even-multiplicity-asymptotes"],
      title: t("Both sides going the same way", "两侧趋向相同"),
      explanation: t(
        "Near a vertical asymptote $x = p$, the power of $x - p$ shows in the graph:\n\n- $\\frac{k}{x - p}$: the two sides go in **opposite** directions;\n- $\\frac{k}{(x - p)^{2}}$: both sides go the **same** way, up when $k > 0$ and down when $k < 0$.\n\nAdding $c$ moves the horizontal asymptote to $y = c$.\n\nThe graph of $y = \\frac{-2}{(x - 1)^{2}} + 3$ has the asymptotes $x = 1$ and $y = 3$, and both sides go **down**. Check: at $x = 1.1$ and $x = 0.9$, $y = \\frac{-2}{0.01} + 3 = -197$.\n\n> **Watch out.** For an odd power, look at the right side to find the sign of $k$: the left side always goes the other way.",
        "在竖直渐近线 $x = p$ 附近，$x - p$ 的次数会体现在图象上：\n\n- $\\frac{k}{x - p}$：两侧趋向**相反**；\n- $\\frac{k}{(x - p)^{2}}$：两侧趋向**相同**，$k > 0$ 时都向上，$k < 0$ 时都向下。\n\n加上 $c$ 会把水平渐近线移到 $y = c$。\n\n$y = \\frac{-2}{(x - 1)^{2}} + 3$ 的图象有渐近线 $x = 1$ 和 $y = 3$，两侧都**向下**。检验：$x = 1.1$ 和 $x = 0.9$ 时，$y = \\frac{-2}{0.01} + 3 = -197$。\n\n> **注意。** 对奇次幂，要看右侧来判断 $k$ 的符号：左侧总是趋向相反。",
      ),
      generate(rng) {
        const p = rng.nonZero(-3, 3);
        const c = rng.int(-3, 3);
        const k = rng.pick([1, 2, 3, -1, -2, -3]);
        const square = rng.bool(0.6);
        const write = (kk: number, pp: number, sq: boolean) => same(`$y = ${sfrac(kk, sq ? `${fac(pp)}^{2}` : bare(pp))}${plus(c)}$`);
        const d: Drawing = { f: (x) => k / (square ? (x - p) ** 2 : x - p) + c, vas: [p], ha: c };
        return {
          ...oneOf(
            rng,
            t("Which equation does the graph show?", "图中是哪个方程的图象？"),
            write(k, p, square),
            [write(k, p, !square), write(-k, p, square), write(k, -p, square)],
            walked(
              [
                [
                  ["Read the asymptotes", "读出渐近线"],
                  t(
                    `The vertical asymptote is $x = ${p}$ and the horizontal asymptote is $y = ${c}$.`,
                    `竖直渐近线是 $x = ${p}$，水平渐近线是 $y = ${c}$。`,
                  ),
                ],
                [
                  ["Read the two sides", "看两侧"],
                  t(
                    `${square ? `Both sides go ${k > 0 ? "up" : "down"}, so the power is even and $k ${k > 0 ? ">" : "<"} 0$` : `The two sides go in opposite directions, so the power is odd; the right side goes ${k > 0 ? "up" : "down"}, so $k ${k > 0 ? ">" : "<"} 0$`}. The equation is ${write(k, p, square).en}.`,
                    `${square ? `两侧都${k > 0 ? "向上" : "向下"}，所以次数为偶数，且 $k ${k > 0 ? ">" : "<"} 0$` : `两侧趋向相反，所以次数为奇数；右侧${k > 0 ? "向上" : "向下"}，所以 $k ${k > 0 ? ">" : "<"} 0$`}。方程是 ${write(k, p, square).en}。`,
                  ),
                ],
              ],
              t(
                `Just left and right of the asymptote:${steps(...[-1, 1].map((side) => `x = ${Number((p + side * 0.1).toFixed(1))}: \\quad y \\approx ${approx(d.f(p + side * 0.1))}`))}${square ? `both far ${k > 0 ? "above" : "below"} $y = ${c}$, as in the graph.` : "one far above and one far below, as in the graph."}`,
                `在渐近线左右两侧附近：${steps(...[-1, 1].map((side) => `x = ${Number((p + side * 0.1).toFixed(1))}: \\quad y \\approx ${approx(d.f(p + side * 0.1))}`))}${square ? `都远在 $y = ${c}$ ${k > 0 ? "上方" : "下方"}，与图象一致。` : "一侧远在上方，一侧远在下方，与图象一致。"}`,
              ),
            ),
            [
              why(
                write(k, p, !square),
                square
                  ? "With an odd power the two sides would go in opposite directions, but in the graph both go the same way."
                  : "With a square both sides would go the same way, but in the graph they go in opposite directions.",
                square ? "若是奇次幂，两侧会趋向相反，但图中两侧趋向相同。" : "若是平方，两侧会趋向相同，但图中两侧趋向相反。",
              ),
              why(
                write(-k, p, square),
                square
                  ? `With this sign both sides would go ${k > 0 ? "down" : "up"}, but in the graph they go ${k > 0 ? "up" : "down"}.`
                  : `With this sign the right side would go ${k > 0 ? "down" : "up"}, but in the graph it goes ${k > 0 ? "up" : "down"}.`,
                square
                  ? `取这个符号时两侧都会${k > 0 ? "向下" : "向上"}，但图中两侧都${k > 0 ? "向上" : "向下"}。`
                  : `取这个符号时右侧会${k > 0 ? "向下" : "向上"}，但图中右侧${k > 0 ? "向上" : "向下"}。`,
              ),
              why(
                write(k, -p, square),
                `This has its vertical asymptote at $x = ${-p}$, but the graph's is at $x = ${p}$.`,
                `它的竖直渐近线是 $x = ${-p}$，但图中的是 $x = ${p}$。`,
              ),
            ],
          ),
          figure: figureOf(d),
        };
      },
    },
  ],
};

// ─── 2.5.10 Identifying a rational function from a graph containing holes ──

/** holeRatioLatex writes a(x − r)(x − h)/((x − p)(x − h)), or with a constant numerator when r is omitted. */
const holeRatioLatex = (a: number, r: number | undefined, p: number, h: number) =>
  frac(r === undefined ? `${a === 1 ? "" : a === -1 ? "-" : a}${fac(h)}` : `${front(a)}${fac(r)}${fac(h)}`, `${fac(p)}${fac(h)}`);

/** identifyingARationalFunctionFromAGraphContainingHoles reads a formula with a cancelled factor from a graph with an open circle. */
export const identifyingARationalFunctionFromAGraphContainingHoles: TopicDef = {
  id: "identifying-a-rational-function-from-a-graph-containing-holes",
  title: t("Identifying a Rational Function From a Graph Containing Holes", "由含空洞的图象确定分式函数"),
  summary: t(
    "Identify the formula of a rational function whose graph has a hole, which puts the same factor in the numerator and the denominator.",
    "确定图象有空洞的分式函数的解析式：空洞使分子和分母含有同一个因式。",
  ),
  prerequisites: ["identifying-a-rational-function-from-a-graph", "locating-holes-in-rational-functions"],
  encompasses: [
    { topic: "identifying-a-rational-function-from-a-graph", weight: 0.6 },
    { topic: "locating-holes-in-rational-functions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D", "CCSS.HSF.BF.A.1"],
  intro: t(
    `The graph of $f(x) = \\frac{(x - 1)(x + 2)}{(x - 1)(x - 3)}$ is the graph of $\\frac{x + 2}{x - 3}$ with one point removed: at $x = 1$ there is an open circle. Its height is the value of the simplified function there.

Check: $\\frac{1 + 2}{1 - 3} = -\\frac{3}{2}$, so the hole is at $\\left(1, -\\frac{3}{2}\\right)$.

In this lesson we read the formula of a graph that has a hole, a root and asymptotes, and find an unknown constant from the coordinates of a hole.`,
    `$f(x) = \\frac{(x - 1)(x + 2)}{(x - 1)(x - 3)}$ 的图象就是 $\\frac{x + 2}{x - 3}$ 的图象去掉一个点：在 $x = 1$ 处有一个空心圆圈。它的高度是化简后的函数在那里的值。

检验：$\\frac{1 + 2}{1 - 3} = -\\frac{3}{2}$，所以空洞在 $\\left(1, -\\frac{3}{2}\\right)$。

这节课我们读出有空洞、零点和渐近线的图象的解析式，并由空洞的坐标求未知常数。`,
  ),
  knowledgePoints: [
    {
      id: "a-hole-and-a-root",
      figure: precalculusDrawings["identifying-a-rational-function-from-a-graph-containing-holes#a-hole-and-a-root"],
      title: t("A hole, a root and two asymptotes", "空洞、零点和两条渐近线"),
      explanation: t(
        "An open circle at $x = h$ means a factor $x - h$ in **both** the numerator and the denominator. Read the rest of the formula as usual: roots give numerator factors, vertical asymptotes give denominator factors, and the horizontal asymptote gives the leading coefficient.\n\nA graph with a hole at $x = 1$, vertical asymptote $x = -2$, root $x = 3$ and horizontal asymptote $y = 2$ is\n\n$$f(x) = \\frac{2(x - 3)(x - 1)}{(x + 2)(x - 1)}$$\n\nA hole at $x = -1$, vertical asymptote $x = 2$, root $x = 4$ and horizontal asymptote $y = -1$ give $f(x) = \\frac{-(x - 4)(x + 1)}{(x - 2)(x + 1)}$. Check: the hole's height is $\\frac{-(-1 - 4)}{-1 - 2} = -\\frac{5}{3}$, where the open circle is drawn.\n\n> **Watch out.** The hole's factor must be in **both** places. In the denominator only, $x = h$ would be a vertical asymptote; left out, the graph would have no gap.",
        "$x = h$ 处的空心圆圈表示分子和分母**都**含有因式 $x - h$。其余部分照常读出：零点给出分子的因式，竖直渐近线给出分母的因式，水平渐近线给出首项系数。\n\n空洞在 $x = 1$、竖直渐近线为 $x = -2$、零点为 $x = 3$、水平渐近线为 $y = 2$ 的图象是\n\n$$f(x) = \\frac{2(x - 3)(x - 1)}{(x + 2)(x - 1)}$$\n\n空洞在 $x = -1$、竖直渐近线为 $x = 2$、零点为 $x = 4$、水平渐近线为 $y = -1$，得 $f(x) = \\frac{-(x - 4)(x + 1)}{(x - 2)(x + 1)}$。检验：空洞的高度是 $\\frac{-(-1 - 4)}{-1 - 2} = -\\frac{5}{3}$，正是空心圆圈的位置。\n\n> **注意。** 空洞的因式必须在分子、分母**两处**都有。只在分母中，$x = h$ 会是竖直渐近线；两处都没有，图象就没有缺口。",
      ),
      keyPrerequisites: ["locating-holes-in-rational-functions"],
      generate(rng) {
        for (;;) {
          const [p, r, h] = rng.sample(range(-4, 4), 3) as [number, number, number];
          const a = rng.pick([1, 2, -1, -2]);
          const yh = (a * (h - r)) / (h - p);
          if (h === 0 || Math.abs(yh) > 5 || -h === p || -h === r || !bothEnds(a, r, p)) continue;
          const write = (aa: number, rr: number, pp: number, hh: number) => same(`$y = ${holeRatioLatex(aa, rr, pp, hh)}$`);
          const d: Drawing = { f: (x) => (a * (x - r)) / (x - p), vas: [p], ha: a, holes: [[h, yh]], dots: [[r, 0]] };
          return {
            ...oneOf(
              rng,
              t("Which equation does the graph show? The open circle is a hole.", "图中是哪个方程的图象？空心圆圈是空洞。"),
              write(a, r, p, h),
              [same(`$y = ${ratioLatex(a, r, p)}$`), write(a, r, p, -h), write(a, p, r, h)],
              walked(
                [
                  [
                    ["Read the hole", "读出空洞"],
                    t(
                      `The hole at $x = ${h}$ puts $${bare(h)}$ in the numerator and the denominator.`,
                      `$x = ${h}$ 处的空洞使分子和分母都含 $${bare(h)}$。`,
                    ),
                  ],
                  [
                    ["Read the rest", "读出其余部分"],
                    t(
                      `The vertical asymptote $x = ${p}$ gives $${bare(p)}$ in the denominator, the root $x = ${r}$ gives $${bare(r)}$ in the numerator, and the horizontal asymptote is $y = ${a}$. The equation is ${write(a, r, p, h).en}.`,
                      `竖直渐近线 $x = ${p}$ 使分母含 $${bare(p)}$，零点 $x = ${r}$ 使分子含 $${bare(r)}$，水平渐近线是 $y = ${a}$。方程是 ${write(a, r, p, h).en}。`,
                    ),
                  ],
                ],
                t(
                  `The hole's height from the simplified function:${steps(`${frac(`${scaled(a, `${h} - ${paren(r)}`)}`, `${h} - ${paren(p)}`)} = ${num(Q.of(a * (h - r), h - p))}`)}which is where the open circle is drawn.`,
                  `由化简后的函数求空洞的高度：${steps(`${frac(`${scaled(a, `${h} - ${paren(r)}`)}`, `${h} - ${paren(p)}`)} = ${num(Q.of(a * (h - r), h - p))}`)}正是空心圆圈的位置。`,
                ),
              ),
              [
                why(
                  same(`$y = ${ratioLatex(a, r, p)}$`),
                  `This has no factor $${bare(h)}$, so its graph has no hole at $x = ${h}$.`,
                  `它没有因式 $${bare(h)}$，所以图象在 $x = ${h}$ 处没有空洞。`,
                ),
                why(
                  write(a, r, p, -h),
                  `This puts the hole at $x = ${-h}$, but the open circle is at $x = ${h}$.`,
                  `它的空洞在 $x = ${-h}$，但空心圆圈在 $x = ${h}$。`,
                ),
                why(
                  write(a, p, r, h),
                  `This swaps the root and the asymptote: it is $0$ at $x = ${p}$ and has its vertical asymptote at $x = ${r}$.`,
                  `它把零点和渐近线弄反了：它在 $x = ${p}$ 处为 $0$，竖直渐近线是 $x = ${r}$。`,
                ),
              ],
            ),
            figure: figureOf(d),
          };
        }
      },
    },
    {
      id: "reading-k-from-a-hole",
      figure: precalculusDrawings["identifying-a-rational-function-from-a-graph-containing-holes#reading-k-from-a-hole"],
      title: t("Reading the constant from the hole", "由空洞求常数"),
      explanation: t(
        "The coordinates of a hole can fix an unknown constant. For $f(x) = \\frac{k(x - h)}{(x - p)(x - h)}$, the simplified function is $\\frac{k}{x - p}$, and the hole lies on it.\n\nIf the vertical asymptote is $x = 1$ and the hole is at $(3, -2)$, then $-2 = \\frac{k}{3 - 1}$, so $k = -4$ and\n\n$$f(x) = \\frac{-4(x - 3)}{(x - 1)(x - 3)}$$\n\nWith vertical asymptote $x = -1$ and a hole at $(2, 4)$: $4 = \\frac{k}{2 + 1}$, so $k = 12$ and $f(x) = \\frac{12(x - 2)}{(x + 1)(x - 2)}$. Check: $\\frac{12}{2 + 1} = 4$.\n\n> **Watch out.** Substitute into the simplified $\\frac{k}{x - p}$: the original fraction is $\\frac{0}{0}$ at the hole and tells nothing. The constant is $k$, not the hole's height.",
        "空洞的坐标可以确定未知常数。对 $f(x) = \\frac{k(x - h)}{(x - p)(x - h)}$，化简后的函数是 $\\frac{k}{x - p}$，空洞在它的图象上。\n\n若竖直渐近线是 $x = 1$，空洞在 $(3, -2)$，则 $-2 = \\frac{k}{3 - 1}$，所以 $k = -4$，\n\n$$f(x) = \\frac{-4(x - 3)}{(x - 1)(x - 3)}$$\n\n若竖直渐近线是 $x = -1$，空洞在 $(2, 4)$：$4 = \\frac{k}{2 + 1}$，所以 $k = 12$，$f(x) = \\frac{12(x - 2)}{(x + 1)(x - 2)}$。检验：$\\frac{12}{2 + 1} = 4$。\n\n> **注意。** 要代入化简后的 $\\frac{k}{x - p}$：原分式在空洞处是 $\\frac{0}{0}$，什么也说明不了。常数是 $k$，不是空洞的高度。",
      ),
      generate(rng) {
        for (;;) {
          const [p, h] = rng.sample(range(-4, 4), 2) as [number, number];
          const yh = rng.nonZero(-4, 4);
          const k = yh * (h - p);
          if (h === 0 || Math.abs(k) > 12 || p === -h) continue;
          const write = (body: string) => same(`$y = ${body}$`);
          const right = write(holeRatioLatex(k, undefined, p, h));
          const d: Drawing = { f: (x) => k / (x - p), vas: [p], ha: 0, holes: [[h, yh]] };
          return {
            ...oneOf(
              rng,
              t(
                `Which equation does the graph show? The open circle is a hole at $(${h}, ${yh})$.`,
                `图中是哪个方程的图象？空心圆圈是 $(${h}, ${yh})$ 处的空洞。`,
              ),
              right,
              [
                write(sfrac(k, bare(p))),
                write(sfrac(k, `${fac(p)}${fac(h)}`)),
                write(holeRatioLatex(yh, undefined, p, h)),
                write(holeRatioLatex(k, undefined, p, -h)),
              ],
              walked(
                [
                  [
                    ["Read the factors", "读出因式"],
                    t(
                      `The hole at $x = ${h}$ puts $${bare(h)}$ in the numerator and the denominator, and the vertical asymptote gives $${bare(p)}$.`,
                      `$x = ${h}$ 处的空洞使分子和分母都含 $${bare(h)}$，竖直渐近线给出 $${bare(p)}$。`,
                    ),
                  ],
                  [
                    ["Use the hole", "利用空洞"],
                    t(`The hole lies on $y = ${frac("k", bare(p))}$:`, `空洞在 $y = ${frac("k", bare(p))}$ 上：`),
                    [`${yh} = ${frac("k", `${h} - ${paren(p)}`)}, \\quad k = ${paren(yh)} \\cdot ${paren(h - p)} = ${k}`],
                  ],
                ],
                t(
                  `The equation is ${right.en}, and at the hole the simplified function gives${steps(`${frac(String(k), `${h} - ${paren(p)}`)} = ${yh}`)}`,
                  `方程是 ${right.en}，在空洞处化简后的函数给出${steps(`${frac(String(k), `${h} - ${paren(p)}`)} = ${yh}`)}`,
                ),
              ),
              [
                why(
                  write(sfrac(k, bare(p))),
                  `This has no factor $${bare(h)}$, so its graph has no hole.`,
                  `它没有因式 $${bare(h)}$，所以图象没有空洞。`,
                ),
                why(
                  write(sfrac(k, `${fac(p)}${fac(h)}`)),
                  `With $${bare(h)}$ only in the denominator, $x = ${h}$ is a second vertical asymptote, not a hole.`,
                  `$${bare(h)}$ 只在分母中时，$x = ${h}$ 是第二条竖直渐近线，而不是空洞。`,
                ),
                why(
                  write(holeRatioLatex(yh, undefined, p, h)),
                  `This uses the hole's height $${yh}$ as $k$, but $${frac("k", `${h} - ${paren(p)}`)}$ must equal $${yh}$, so $k = ${k}$.`,
                  `它把空洞的高度 $${yh}$ 当成了 $k$，但 $${frac("k", `${h} - ${paren(p)}`)}$ 要等于 $${yh}$，所以 $k = ${k}$。`,
                ),
                why(
                  write(holeRatioLatex(k, undefined, p, -h)),
                  `This puts the hole at $x = ${-h}$, but it is at $x = ${h}$.`,
                  `它的空洞在 $x = ${-h}$，但空洞在 $x = ${h}$。`,
                ),
              ],
            ),
            figure: figureOf(d),
          };
        }
      },
    },
  ],
};

// ─── 2.5.11 Identifying the graph of a rational function ───────────────────

/** pick4 shuffles four drawings with the correct one first, returning the figure, the correct letter and where each drawing went. */
function pick4(rng: Rng, ds: readonly [Drawing, Drawing, Drawing, Drawing]): [Figure, number, number[]] {
  const order = rng.shuffle([0, 1, 2, 3]);
  return [panels(order.map((i) => ds[i]!)), order.indexOf(0), order];
}

/** letterWhy pairs the letter of drawing i with what is wrong with it. */
const letterWhy = (order: readonly number[], i: number, en: string, zh: string): Reason => why(letterOptions[order.indexOf(i)]!, en, zh);

/** identifyingTheGraphOfARationalFunction matches a rational function to its graph using asymptotes, intercepts and signs. */
export const identifyingTheGraphOfARationalFunction: TopicDef = {
  id: "identifying-the-graph-of-a-rational-function",
  title: t("Identifying the Graph of a Rational Function", "识别分式函数的图象"),
  summary: t(
    "Match a rational function to its graph using its asymptotes, intercepts and the sign of the function between its zeros and asymptotes.",
    "利用渐近线、截距以及函数在零点与渐近线之间的符号，把分式函数与它的图象对应起来。",
  ),
  prerequisites: [
    "identifying-a-rational-function-from-a-graph-containing-holes",
    "end-behavior-of-rational-functions",
    "infinite-limits-of-rational-functions",
  ],
  encompasses: [{ topic: "identifying-a-rational-function-from-a-graph", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Picture $f(x) = \\frac{x - 2}{x + 1}$ before looking at any graph: the vertical asymptote is $x = -1$, the horizontal asymptote is $y = 1$, and the $x$-intercept is $(2, 0)$. The sign changes only at $-1$ and $2$: it is positive left of $-1$, negative between, and positive right of $2$.

Check: $f(-2) = \\frac{-4}{-1} = 4 > 0$, $f(0) = -2 < 0$ and $f(3) = \\frac{1}{4} > 0$.

In this lesson we match graphs by their asymptotes and intercepts, use sign charts to tell where a graph is above the axis, and match graphs with two vertical asymptotes.`,
    `先不看图，设想 $f(x) = \\frac{x - 2}{x + 1}$ 的图象：竖直渐近线是 $x = -1$，水平渐近线是 $y = 1$，$x$ 轴截点是 $(2, 0)$。符号只在 $-1$ 和 $2$ 处改变：在 $-1$ 左侧为正，两者之间为负，$2$ 右侧为正。

检验：$f(-2) = \\frac{-4}{-1} = 4 > 0$，$f(0) = -2 < 0$，$f(3) = \\frac{1}{4} > 0$。

这节课我们由渐近线和截距对应图象，用符号表判断图象在 $x$ 轴上方的部分，并对应有两条竖直渐近线的图象。`,
  ),
  knowledgePoints: [
    {
      id: "matching-linear-over-linear-graphs",
      title: t("Matching by asymptotes and intercepts", "由渐近线和截距对应"),
      figure: remainingDrawings5["identifying-the-graph-of-a-rational-function#matching-linear-over-linear-graphs"],
      explanation: t(
        "To match $f(x) = \\frac{a(x - r)}{x - p}$ with its graph, check in turn:\n\n1. the vertical asymptote $x = p$;\n2. the horizontal asymptote $y = a$;\n3. the $x$-intercept $(r, 0)$.\n\nGraphs that differ in only one of these can still be told apart by that one feature.\n\nFor $f(x) = \\frac{-2(x - 1)}{x + 3}$, look for the asymptotes $x = -3$ and $y = -2$ and the intercept $(1, 0)$. Check: $f(0) = \\frac{-2 \\cdot (-1)}{3} = \\frac{2}{3}$, so the right graph crosses the $y$-axis just above the origin.\n\n> **Watch out.** A graph with $y = 2$ in place of $y = -2$, or with the root and the asymptote swapped, can look much the same. Check all three features before choosing.",
        "要把 $f(x) = \\frac{a(x - r)}{x - p}$ 与它的图象对应，依次检查：\n\n1. 竖直渐近线 $x = p$；\n2. 水平渐近线 $y = a$；\n3. $x$ 轴截点 $(r, 0)$。\n\n只在其中一项上不同的图象，也能凭这一项区分。\n\n对 $f(x) = \\frac{-2(x - 1)}{x + 3}$，要找渐近线 $x = -3$、$y = -2$ 和截点 $(1, 0)$。检验：$f(0) = \\frac{-2 \\cdot (-1)}{3} = \\frac{2}{3}$，所以正确的图象在原点稍上方与 $y$ 轴相交。\n\n> **注意。** 把 $y = -2$ 换成 $y = 2$，或把零点和渐近线对调的图象，看上去可能差不多。三项特征都检查过再选。",
      ),
      generate(rng) {
        for (;;) {
          const [p, r] = rng.sample(range(-4, 4), 2) as [number, number];
          const a = rng.pick([1, 2, 3, -1, -2, -3]);
          if (p === 0 || -p === r || !bothEnds(a, r, p) || !bothEnds(a, p, r) || !bothEnds(a, r, -p)) continue;
          const draw = (aa: number, rr: number, pp: number): Drawing => ({
            f: (x) => (aa * (x - rr)) / (x - pp),
            vas: [pp],
            ha: aa,
            dots: [[rr, 0]],
          });
          const [figure, correct, order] = pick4(rng, [draw(a, r, p), draw(-a, r, p), draw(a, p, r), draw(a, r, -p)]);
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `Which graph is the graph of $f(x) = ${ratioLatex(a, r, p)}$? Asymptotes are dashed and $x$-intercepts are marked.`,
                  `哪个是 $f(x) = ${ratioLatex(a, r, p)}$ 的图象？渐近线画成虚线，并标出了 $x$ 轴截点。`,
                ),
                options: letterOptions,
                correct,
                solution: walked(
                  [
                    [
                      ["List the features", "列出特征"],
                      t(
                        `The graph needs the vertical asymptote $x = ${p}$, the horizontal asymptote $y = ${a}$ and the $x$-intercept $(${r}, 0)$.`,
                        `图象应有竖直渐近线 $x = ${p}$、水平渐近线 $y = ${a}$ 和 $x$ 轴截点 $(${r}, 0)$。`,
                      ),
                    ],
                    [
                      ["Compare the graphs", "比较各图"],
                      t(`Only graph ${letters[correct]} has all three.`, `只有图象 ${letters[correct]} 三者都具备。`),
                    ],
                  ],
                  t(
                    `The $y$-intercept of $f$ is${steps(`f(0) = ${frac(`${scaled(a, `0 - ${paren(r)}`)}`, `0 - ${paren(p)}`)} = ${num(Q.of(a * r, p))}`)}and graph ${letters[correct]} crosses the $y$-axis there.`,
                    `$f$ 的 $y$ 轴截距是${steps(`f(0) = ${frac(`${scaled(a, `0 - ${paren(r)}`)}`, `0 - ${paren(p)}`)} = ${num(Q.of(a * r, p))}`)}图象 ${letters[correct]} 正在那里与 $y$ 轴相交。`,
                  ),
                ),
              }),
              [
                letterWhy(
                  order,
                  1,
                  `Its horizontal asymptote is $y = ${-a}$, not $y = ${a}$.`,
                  `它的水平渐近线是 $y = ${-a}$，不是 $y = ${a}$。`,
                ),
                letterWhy(
                  order,
                  2,
                  `Its asymptote and intercept are swapped: it has $x = ${r}$ as asymptote and $(${p}, 0)$ as intercept.`,
                  `它的渐近线和截点对调了：渐近线是 $x = ${r}$，截点是 $(${p}, 0)$。`,
                ),
                letterWhy(
                  order,
                  3,
                  `Its vertical asymptote is $x = ${-p}$, not $x = ${p}$.`,
                  `它的竖直渐近线是 $x = ${-p}$，不是 $x = ${p}$。`,
                ),
              ],
            ),
            figure,
          };
        }
      },
    },
    {
      id: "sign-charts",
      figure: precalculusDrawings["identifying-the-graph-of-a-rational-function#sign-charts"],
      title: t("Sign charts", "符号表"),
      explanation: t(
        "A rational function can change sign only at its zeros and vertical asymptotes. Mark them on the number line and test one point in each interval: this is a **sign chart**, and it tells where the graph is above or below the $x$-axis.\n\n$$f(x) = \\frac{x - 2}{(x + 1)(x - 4)}$$\n\nThe critical points are $-1, 2, 4$. Testing $x = -2, 0, 3, 5$ gives the signs $-, +, -, +$, so $f(x) > 0$ on $(-1, 2) \\cup (4, \\infty)$.\n\nFor $f(x) = \\frac{-(x - 1)}{x(x + 2)}$ the critical points are $-2, 0, 1$, and testing $x = -3, -1, \\frac{1}{2}, 2$ gives $+, -, +, -$. So $f(x) < 0$ on $(-2, 0) \\cup (1, \\infty)$. Check: $f(2) = \\frac{-1}{8} < 0$.\n\n> **Watch out.** The vertical asymptotes are critical points too, even though $f$ is not $0$ there. They are never part of the answer.",
        "分式函数只可能在零点和竖直渐近线处变号。把它们标在数轴上，并在每个区间里检验一个点，这就是**符号表**，它说明图象在 $x$ 轴上方还是下方。\n\n$$f(x) = \\frac{x - 2}{(x + 1)(x - 4)}$$\n\n临界点是 $-1, 2, 4$。检验 $x = -2, 0, 3, 5$ 得符号 $-, +, -, +$，所以 $f(x) > 0$ 的解集是 $(-1, 2) \\cup (4, \\infty)$。\n\n对 $f(x) = \\frac{-(x - 1)}{x(x + 2)}$，临界点是 $-2, 0, 1$，检验 $x = -3, -1, \\frac{1}{2}, 2$ 得符号 $+, -, +, -$。所以 $f(x) < 0$ 的解集是 $(-2, 0) \\cup (1, \\infty)$。检验：$f(2) = \\frac{-1}{8} < 0$。\n\n> **注意。** 竖直渐近线也是临界点，虽然 $f$ 在那里不为 $0$。它们永远不在答案里。",
      ),
      generate(rng) {
        const [p, q, r] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const a = rng.pick([1, 2, -1, -3]);
        const positive = rng.bool();
        const f = (x: number) => (a * (x - r)) / ((x - p) * (x - q));
        const crit = [p, q, r];
        const answer = signSet(f, crit, positive);
        const latex = frac(prodL(simple([r]), a), `${fac(p)}${fac(q)}`);
        const op = positive ? ">" : "<";
        const [c1, c2, c3] = [...crit].sort((u, v) => u - v) as [number, number, number];
        const probe = [c1 - 1, (c1 + c2) / 2, (c2 + c3) / 2, c3 + 1].find((x) => f(x) > 0 === positive)!;
        return intervalProblem({
          prompt: t(
            `Where is $f(x) = ${latex}$ ${positive ? "positive" : "negative"}? Write the set of $x$ with $f(x) ${op} 0$ in interval notation.`,
            `$f(x) = ${latex}$ 在哪里${positive ? "为正" : "为负"}？用区间记号写出 $f(x) ${op} 0$ 的 $x$ 的集合。`,
          ),
          set: answer,
          form: "interval",
          wrong: [
            signSet(f, crit, !positive),
            signSet(
              (x) => f(-x),
              crit.map((c) => -c),
              positive,
            ),
          ].filter(
            (w, i, ws) => intervalLatex(w) !== intervalLatex(answer) && ws.findIndex((o) => intervalLatex(o) === intervalLatex(w)) === i,
          ),
          solution: walked(
            [
              [
                ["Find the critical points", "找出临界点"],
                t(
                  `The numerator is $0$ at $x = ${r}$ and the denominator at $x = ${p}$ and $x = ${q}$, so the critical points are ${listText([c1, c2, c3])}.`,
                  `分子在 $x = ${r}$ 处为 $0$，分母在 $x = ${p}$ 和 $x = ${q}$ 处为 $0$，所以临界点是 ${listText([c1, c2, c3], "、")}。`,
                ),
              ],
              [
                ["Test each interval", "检验每个区间"],
                t(
                  `Testing a point in each interval gives${steps(signChart(f, crit))}So $f(x) ${op} 0$ on ${setText(answer)}.`,
                  `在每个区间里检验一个点，得${steps(signChart(f, crit))}所以 $f(x) ${op} 0$ 的解集是 ${setText(answer)}。`,
                ),
              ],
            ],
            t(
              `A point of the answer:${steps(`f(${probe}) \\approx ${approx(f(probe))} ${op} 0`)}`,
              `答案中的一个点：${steps(`f(${probe}) \\approx ${approx(f(probe))} ${op} 0`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "matching-graphs-with-two-vertical-asymptotes",
      figure: precalculusDrawings["identifying-the-graph-of-a-rational-function#matching-graphs-with-two-vertical-asymptotes"],
      title: t("Graphs with two vertical asymptotes", "有两条竖直渐近线的图象"),
      explanation: t(
        "For $f(x) = \\frac{k}{(x - p)(x - q)}$, the horizontal asymptote is $y = 0$ and there are no roots. The sign of $k$ decides the middle piece: between $p$ and $q$ the denominator is negative, so the middle piece is below the $x$-axis when $k > 0$ and above it when $k < 0$. The outer pieces have the opposite sign.\n\nCompare also with $\\frac{kx}{(x - p)(x - q)}$, which has a root at $x = 0$.\n\nFor $f(x) = \\frac{4}{(x + 1)(x - 3)}$, $k = 4 > 0$, so the middle piece, between $-1$ and $3$, is below the $x$-axis. Check: $f(1) = \\frac{4}{(2)(-2)} = -1 < 0$.\n\n> **Watch out.** The middle piece has the **opposite** sign of $k$, because the denominator is negative there. The outer pieces have the sign of $k$.",
        "对 $f(x) = \\frac{k}{(x - p)(x - q)}$，水平渐近线是 $y = 0$，没有零点。$k$ 的符号决定中间那一段：在 $p$ 与 $q$ 之间分母为负，所以 $k > 0$ 时中间一段在 $x$ 轴下方，$k < 0$ 时在上方。两侧的分支符号与之相反。\n\n再与 $\\frac{kx}{(x - p)(x - q)}$ 比较：它在 $x = 0$ 处有零点。\n\n对 $f(x) = \\frac{4}{(x + 1)(x - 3)}$，$k = 4 > 0$，所以介于 $-1$ 和 $3$ 之间的中间一段在 $x$ 轴下方。检验：$f(1) = \\frac{4}{(2)(-2)} = -1 < 0$。\n\n> **注意。** 中间一段的符号与 $k$ **相反**，因为那里分母为负。两侧分支的符号与 $k$ 相同。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q] = (rng.sample(range(-4, 4), 2) as [number, number]).sort((u, v) => u - v);
          const k = rng.pick([2, 3, 4, 6, -2, -3, -4, -6]);
          if (p === 0 || q === 0 || p === -q || Math.abs((4 * k) / (q - p) ** 2) > 5) continue;
          const draw = (kk: number, pp: number, qq: number, root: boolean): Drawing => ({
            f: (x) => (kk * (root ? x : 1)) / ((x - pp) * (x - qq)),
            vas: [pp, qq],
            ha: 0,
            ...(root && { dots: [[0, 0] as Point] }),
          });
          const [figure, correct, order] = pick4(rng, [
            draw(k, p, q, false),
            draw(-k, p, q, false),
            draw(k, -p, -q, false),
            draw(k, p, q, true),
          ]);
          const mid = (p + q) / 2;
          const latex = frac(String(k), `${fac(p)}${fac(q)}`);
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `Which graph is the graph of $f(x) = ${latex}$? Asymptotes are dashed.`,
                  `哪个是 $f(x) = ${latex}$ 的图象？渐近线画成虚线。`,
                ),
                options: letterOptions,
                correct,
                solution: walked(
                  [
                    [
                      ["Read the asymptotes", "读出渐近线"],
                      t(
                        `The vertical asymptotes are $x = ${p}$ and $x = ${q}$, the horizontal asymptote is $y = 0$, and there is no root.`,
                        `竖直渐近线是 $x = ${p}$ 和 $x = ${q}$，水平渐近线是 $y = 0$，没有零点。`,
                      ),
                    ],
                    [
                      ["Find the middle piece", "判断中间一段"],
                      t(
                        `Between them the denominator is negative and $k = ${k}$ is ${k > 0 ? "positive" : "negative"}, so the middle piece is ${k > 0 ? "below" : "above"} the $x$-axis. That is graph ${letters[correct]}.`,
                        `在两者之间分母为负，而 $k = ${k}$ ${k > 0 ? "为正" : "为负"}，所以中间一段在 $x$ 轴${k > 0 ? "下方" : "上方"}。这是图象 ${letters[correct]}。`,
                      ),
                    ],
                  ],
                  t(
                    `Halfway between the asymptotes:${steps(`f(${mid}) = ${frac(String(k), `(${mid - p})(${mid - q})`)} \\approx ${approx(k / ((mid - p) * (mid - q)))}`)}`,
                    `在两条渐近线正中间：${steps(`f(${mid}) = ${frac(String(k), `(${mid - p})(${mid - q})`)} \\approx ${approx(k / ((mid - p) * (mid - q)))}`)}`,
                  ),
                ),
              }),
              [
                letterWhy(
                  order,
                  1,
                  `Its middle piece is ${k > 0 ? "above" : "below"} the $x$-axis; with $k = ${k}$ it must be ${k > 0 ? "below" : "above"}.`,
                  `它的中间一段在 $x$ 轴${k > 0 ? "上方" : "下方"}；$k = ${k}$ 时应在${k > 0 ? "下方" : "上方"}。`,
                ),
                letterWhy(
                  order,
                  2,
                  `Its vertical asymptotes are $x = ${-q}$ and $x = ${-p}$, not $x = ${p}$ and $x = ${q}$.`,
                  `它的竖直渐近线是 $x = ${-q}$ 和 $x = ${-p}$，不是 $x = ${p}$ 和 $x = ${q}$。`,
                ),
                letterWhy(
                  order,
                  3,
                  "It crosses the $x$-axis at the origin, but $f$ has no root: its numerator is a constant.",
                  "它在原点与 $x$ 轴相交，但 $f$ 没有零点：它的分子是常数。",
                ),
              ],
            ),
            figure,
          };
        }
      },
    },
  ],
};

/** precalculusRationalFunctionTopics are the topics of Precalculus unit 2, rational functions, in outline order. */
export const precalculusRationalFunctionTopics: readonly TopicDef[] = [
  closurePropertiesOfPolynomials,
  closurePropertiesOfRationalExpressions,
  rationalEquationsWithThreeTerms,
  advancedRationalEquations,
  furtherAdvancedRationalEquations,
  rootsOfRationalFunctions,
  verticalAsymptotesOfRationalFunctions,
  locatingHolesInRationalFunctions,
  horizontalAsymptotesOfRationalFunctions,
  endBehaviorOfRationalFunctions,
  infiniteLimitsOfRationalFunctions,
  infiniteLimitsOfRationalFunctionsAdvancedCases,
  theDomainAndRangeOfARationalFunction,
  identifyingARationalFunctionFromAGraph,
  identifyingARationalFunctionFromAGraphContainingHoles,
  identifyingTheGraphOfARationalFunction,
];
