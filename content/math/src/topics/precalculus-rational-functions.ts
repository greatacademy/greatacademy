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

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

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
    { topic: "the-remainder-theorem", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "which-operations-give-polynomials",
      title: t("Which operations give polynomials", "哪些运算得到多项式"),
      explanation: t(
        "A set is **closed** under an operation when combining two of its members always gives a member of the set. Adding, subtracting or multiplying two polynomials always gives a polynomial: like terms combine, and multiplying powers of $x$ adds whole-number exponents. So polynomials are closed under addition, subtraction and multiplication.\n\nThey are **not** closed under division. Dividing by $x - s$ leaves the remainder $p(s)$:\n\n- $\\frac{x^{2} - 4}{x - 2} = x + 2$, a polynomial, because the remainder $2^{2} - 4$ is $0$;\n- $\\frac{x^{2} + 1}{x - 2} = x + 2 + \\frac{5}{x - 2}$, not a polynomial, because the remainder is $2^{2} + 1 = 5$.\n\nSo $p(x) \\div (x - s)$ is a polynomial exactly when $p(s) = 0$.",
        "如果一个集合中任意两个成员经过某种运算后结果仍在这个集合中，就说这个集合对该运算**封闭**。两个多项式相加、相减或相乘，结果总是多项式：同类项可以合并，$x$ 的幂相乘时指数（整数）相加。所以多项式对加法、减法和乘法封闭。\n\n多项式对除法**不**封闭。除以 $x - s$ 时余数是 $p(s)$：\n\n- $\\frac{x^{2} - 4}{x - 2} = x + 2$ 是多项式，因为余数 $2^{2} - 4 = 0$；\n- $\\frac{x^{2} + 1}{x - 2} = x + 2 + \\frac{5}{x - 2}$ 不是多项式，因为余数是 $2^{2} + 1 = 5$。\n\n所以 $p(x) \\div (x - s)$ 是多项式，当且仅当 $p(s) = 0$。",
      ),
      keyPrerequisites: ["the-remainder-theorem"],
      generate(rng) {
        const op = rng.pick(["+", "-", "\\cdot", "\\div", "\\div", "\\div"] as const);
        const s = rng.nonZero(-6, 6);
        const q: P = [-s, 1];
        const exact = op === "\\div" && rng.bool();
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
          solution = t(
            `Yes. Polynomials are closed under ${en}: $p(x) ${op} q(x) = ${pl(r)}$.`,
            `是。多项式对${zh}封闭：$p(x) ${op} q(x) = ${pl(r)}$。`,
          );
        } else {
          const [quot, rem] = synth(p, s);
          solution = exact
            ? t(
                `Yes. The remainder of dividing by $${bare(s)}$ is $p(${s}) = 0$, so $p(x) = (${bare(s)})(${pl(quot)})$ and $p(x) \\div q(x) = ${pl(quot)}$.`,
                `是。除以 $${bare(s)}$ 的余数是 $p(${s}) = 0$，所以 $p(x) = (${bare(s)})(${pl(quot)})$，$p(x) \\div q(x) = ${pl(quot)}$。`,
              )
            : t(
                `No. The remainder of dividing by $${bare(s)}$ is $p(${s}) = ${rem}$, which is not $0$:${steps(`\\frac{p(x)}{q(x)} = ${pl(quot)} ${then("", rem, bare(s)).trim()}`)}The fraction left over makes it not a polynomial.`,
                `不是。除以 $${bare(s)}$ 的余数是 $p(${s}) = ${rem}$，不为 $0$：${steps(`\\frac{p(x)}{q(x)} = ${pl(quot)} ${then("", rem, bare(s)).trim()}`)}剩下的分式使它不是多项式。`,
              );
        }
        return choiceProblem({ prompt, options: yesNo, correct: yes ? 0 : 1, solution });
      },
    },
    {
      id: "degrees-of-sums-and-products",
      title: t("Degrees of sums and products", "和与积的次数"),
      explanation: t(
        "When two polynomials are multiplied, their leading terms multiply, so the degrees **add**: a degree-$3$ polynomial times a degree-$2$ polynomial has degree $5$.\n\nWhen they are added or subtracted, the degree is **at most** the larger degree. It is smaller when the leading terms cancel:\n\n$$(3x^{3} + x - 1) + (-3x^{3} + 2x^{2} + 4) = 2x^{2} + x + 3,$$\n\nwhich has degree $2$, not $3$. Always check whether the leading terms cancel.",
        "两个多项式相乘时，首项相乘，所以次数**相加**：三次多项式乘以二次多项式得到五次多项式。\n\n两个多项式相加或相减时，次数**不超过**较大的次数。如果首项抵消，次数会更小：\n\n$$(3x^{3} + x - 1) + (-3x^{3} + 2x^{2} + 4) = 2x^{2} + x + 3,$$\n\n它的次数是 $2$ 而不是 $3$。一定要检查首项是否抵消。",
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
                ? t(
                    `The degrees add: $p$ has degree $${m}$ and $q$ has degree $${n}$, so $${expr}$ has degree $${m} + ${n} = ${d}$.`,
                    `次数相加：$p$ 是 $${m}$ 次，$q$ 是 $${n}$ 次，所以 $${expr}$ 的次数是 $${m} + ${n} = ${d}$。`,
                  )
                : t(
                    `Combine like terms:${steps(`${expr} = ${pl(r)}`)}${d < Math.max(m, n) ? "The leading terms cancel, so the degree" : "The degree"} is $${d}$.`,
                    `合并同类项：${steps(`${expr} = ${pl(r)}`)}${d < Math.max(m, n) ? "首项抵消了，所以次数" : "次数"}是 $${d}$。`,
                  ),
          });
        }
      },
    },
    {
      id: "computing-sums-differences-and-products",
      title: t("Computing the result", "计算运算结果"),
      explanation: t(
        "To subtract $q(x)$, subtract **every** term of it: the minus sign is distributed over the whole of $q(x)$.\n\n$$(2x^{2} - 3x + 1) - (x^{2} - 5x + 4) = 2x^{2} - 3x + 1 - x^{2} + 5x - 4 = x^{2} + 2x - 3$$\n\nTo multiply, multiply every term of one polynomial by every term of the other and collect like terms:\n\n$$(x - 2)(x^{2} + 3x - 1) = x^{3} + 3x^{2} - x - 2x^{2} - 6x + 2 = x^{3} + x^{2} - 7x + 2$$",
        "减去 $q(x)$ 时要减去它的**每一**项：负号要分配到整个 $q(x)$ 上。\n\n$$(2x^{2} - 3x + 1) - (x^{2} - 5x + 4) = 2x^{2} - 3x + 1 - x^{2} + 5x - 4 = x^{2} + 2x - 3$$\n\n相乘时，用一个多项式的每一项乘另一个多项式的每一项，再合并同类项：\n\n$$(x - 2)(x^{2} + 3x - 1) = x^{3} + 3x^{2} - x - 2x^{2} - 6x + 2 = x^{3} + x^{2} - 7x + 2$$",
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
            solution: t(
              `Distribute the minus sign over every term of $q(x)$, then combine like terms:${steps(`(${pl(p)}) - (${pl(q)}) = ${pl(r)}`)}`,
              `把负号分配到 $q(x)$ 的每一项，再合并同类项：${steps(`(${pl(p)}) - (${pl(q)}) = ${pl(r)}`)}`,
            ),
          });
        }
        const p = [rng.nonZero(-6, 6), rng.nonZero(-3, 3)];
        const q = [rng.nonZero(-9, 9), rng.int(-9, 9), rng.nonZero(-3, 3)];
        const r = mulP(p, q);
        const mulSteps = steps(
          `(${pl(p)})(${pl(q)}) = ${front(p[1]!)}x(${pl(q)}) ${sgn(p[0]!)} ${Math.abs(p[0]!)}(${pl(q)})`,
          `= ${pl(mulP([0, p[1]!], q))} ${sgn(p[0]!)} (${pl(scaleP(q, Math.abs(p[0]!)))})`,
          `= ${pl(r)}`,
        );
        return expressionProblem({
          prompt: t(
            `Let $p(x) = ${pl(p)}$ and $q(x) = ${pl(q)}$. Write $p(x)q(x)$ as a polynomial in standard form.`,
            `设 $p(x) = ${pl(p)}$，$q(x) = ${pl(q)}$。把 $p(x)q(x)$ 写成标准形式的多项式。`,
          ),
          answer: pl(r),
          simplified: true,
          wrong: [pl([p[0]! * q[0]!, p[1]! * q[1]!, 0]), pl(mulP([-p[0]!, p[1]!], q))],
          solution: t(
            `Multiply each term of $${pl(p)}$ by each term of $${pl(q)}$, then combine like terms:${mulSteps}`,
            `用 $${pl(p)}$ 的每一项乘 $${pl(q)}$ 的每一项，再合并同类项：${mulSteps}`,
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
  encompasses: [
    { topic: "adding-rational-expressions-with-unlike-denominators", weight: 0.4 },
    { topic: "dividing-rational-expressions", weight: 0.3 },
    { topic: "closure-properties-of-polynomials", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.D.7"],
  knowledgePoints: [
    {
      id: "recognizing-rational-expressions",
      title: t("Recognizing rational expressions", "识别分式"),
      explanation: t(
        "A **rational expression** is a quotient $\\frac{p(x)}{q(x)}$ of two polynomials, with $q$ not the zero polynomial. Every polynomial is one (take $q(x) = 1$).\n\n- $\\frac{x^{2}}{3} - 2x$ and $\\sqrt{2}x + 1$ are **polynomials**: dividing by a number or multiplying by an irrational number only changes the coefficients.\n- $\\frac{x + 1}{x - 3}$, $2x + \\frac{5}{x}$ and $4x^{-2} = \\frac{4}{x^{2}}$ are rational expressions but not polynomials: $x$ appears in a denominator.\n- $\\sqrt{x}$, $x^{\\frac{1}{2}}$, $|x|$ and $2^{x}$ are not rational expressions: the variable is under a root, inside absolute value bars, or in an exponent.",
        "**分式**（有理式）是两个多项式的商 $\\frac{p(x)}{q(x)}$，其中 $q$ 不是零多项式。每个多项式都是分式（取 $q(x) = 1$）。\n\n- $\\frac{x^{2}}{3} - 2x$ 和 $\\sqrt{2}x + 1$ 是**多项式**：除以一个数或乘以一个无理数只改变系数。\n- $\\frac{x + 1}{x - 3}$、$2x + \\frac{5}{x}$ 和 $4x^{-2} = \\frac{4}{x^{2}}$ 是分式但不是多项式：$x$ 出现在分母中。\n- $\\sqrt{x}$、$x^{\\frac{1}{2}}$、$|x|$ 和 $2^{x}$ 都不是分式：变量在根号下、绝对值符号内或指数上。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.int(2, 7);
        const m = rng.pick([2, 3, 5, 7]);
        const forms: readonly (readonly string[])[] = [
          [
            `\\frac{x^{3}}{${c}}${b < 0 ? ` - ${-b}x` : ` + ${b}x`}`,
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
        const why: Text[][] = [
          [
            t(
              `It is $\\frac{1}{${c}}x^{3}${b < 0 ? ` - ${-b}x` : ` + ${b}x`}$: dividing by the number $${c}$ only makes a fractional coefficient, so it is a polynomial.`,
              `它就是 $\\frac{1}{${c}}x^{3}${b < 0 ? ` - ${-b}x` : ` + ${b}x`}$：除以数 $${c}$ 只得到分数系数，所以它是多项式。`,
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
        return choiceProblem({
          prompt: t(`Which best describes $${expr}$?`, `下列哪一项最准确地描述了 $${expr}$？`),
          options: kindOptions,
          correct: kind,
          solution: why[kind]![i]!,
        });
      },
    },
    {
      id: "combining-into-one-rational-expression",
      title: t("Combining into one rational expression", "合并成一个分式"),
      explanation: t(
        "The sum, difference, product and quotient (by a nonzero expression) of two rational expressions is again a rational expression: rational expressions are **closed** under all four operations. To show it, write the result as one fraction of polynomials in lowest terms.\n\nFor $r(x) = \\frac{2}{x - 1}$ and $s(x) = \\frac{3}{x + 2}$:\n\n$$r(x) + s(x) = \\frac{2(x + 2) + 3(x - 1)}{(x - 1)(x + 2)} = \\frac{5x + 1}{(x - 1)(x + 2)}$$\n\n$$r(x) \\div s(x) = \\frac{2}{x - 1} \\cdot \\frac{x + 2}{3} = \\frac{2x + 4}{3x - 3}$$",
        "两个分式的和、差、积以及商（除以非零的式子）仍是分式：分式对四种运算都**封闭**。要说明这一点，就把结果写成一个最简的多项式之商。\n\n对 $r(x) = \\frac{2}{x - 1}$ 和 $s(x) = \\frac{3}{x + 2}$：\n\n$$r(x) + s(x) = \\frac{2(x + 2) + 3(x - 1)}{(x - 1)(x + 2)} = \\frac{5x + 1}{(x - 1)(x + 2)}$$\n\n$$r(x) \\div s(x) = \\frac{2}{x - 1} \\cdot \\frac{x + 2}{3} = \\frac{2x + 4}{3x - 3}$$",
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
        if (op === "+" || op === "-") {
          const bb = op === "+" ? b : -b;
          const top = [-(a * q + bb * p), a + bb];
          const answer = frac(pl(top), den);
          return expressionProblem({
            prompt,
            answer,
            lowest: true,
            wrong: [frac(String(a + bb), pl([-(p + q), 2])), frac(pl([-(a * p + bb * q), a + bb]), den), frac(String(a + bb), den)],
            solution: t(
              `Use the common denominator $${den}$:${steps(`${frac(`${a}${fac(q)} ${sgn(bb)} ${Math.abs(bb)}${fac(p)}`, den)} = ${answer}`)}`,
              `通分，公分母为 $${den}$：${steps(`${frac(`${a}${fac(q)} ${sgn(bb)} ${Math.abs(bb)}${fac(p)}`, den)} = ${answer}`)}`,
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
            solution: t(
              `Multiply the numerators and the denominators:${steps(`${sfrac(a, bare(p))} \\cdot ${sfrac(b, bare(q))} = ${answer}`)}`,
              `分子乘分子，分母乘分母：${steps(`${sfrac(a, bare(p))} \\cdot ${sfrac(b, bare(q))} = ${answer}`)}`,
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
          solution: t(
            `Multiply by the reciprocal of $s(x)$ and cancel common number factors:${steps(`${sfrac(a, bare(p))} \\cdot ${frac(bare(q), String(b))} = ${answer}`)}`,
            `乘以 $s(x)$ 的倒数，再约去公共的数因数：${steps(`${sfrac(a, bare(p))} \\cdot ${frac(bare(q), String(b))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "where-the-result-is-undefined",
      title: t("Where the result is not defined", "结果无意义的值"),
      explanation: t(
        "A combination of $r(x)$ and $s(x)$ is defined only where both $r$ and $s$ are. A quotient $r(x) \\div s(x)$ also needs $s(x) \\neq 0$, so the zeros of the numerator of $s$ are excluded too.\n\nFor $r(x) = \\frac{x + 4}{x - 1}$ and $s(x) = \\frac{x - 3}{x + 2}$:\n\n- $r(x) \\cdot s(x)$ is not defined at $x = 1$ and $x = -2$;\n- $r(x) \\div s(x)$ is not defined at $x = 1$, $x = -2$ and $x = 3$, where $s(x) = 0$.",
        "$r(x)$ 与 $s(x)$ 的运算结果只在 $r$ 和 $s$ 都有意义的地方有意义。商 $r(x) \\div s(x)$ 还要求 $s(x) \\neq 0$，所以 $s$ 的分子的零点也要排除。\n\n对 $r(x) = \\frac{x + 4}{x - 1}$ 和 $s(x) = \\frac{x - 3}{x + 2}$：\n\n- $r(x) \\cdot s(x)$ 在 $x = 1$ 和 $x = -2$ 处无意义；\n- $r(x) \\div s(x)$ 在 $x = 1$、$x = -2$ 以及使 $s(x) = 0$ 的 $x = 3$ 处无意义。",
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
          solution: divide
            ? t(
                `$r$ is not defined at $x = ${b}$ and $s$ at $x = ${d}$. Dividing by $s(x)$ also needs $s(x) \\neq 0$, which excludes $x = ${c}$. So the values are ${listText(answer)}.`,
                `$r$ 在 $x = ${b}$ 处无意义，$s$ 在 $x = ${d}$ 处无意义。除以 $s(x)$ 还要求 $s(x) \\neq 0$，于是又排除 $x = ${c}$。所以这些值是 ${listText(answer, "、")}。`,
              )
            : t(
                `$r$ is not defined at $x = ${b}$ and $s$ at $x = ${d}$; a product needs only both factors defined. So the values are ${listText(answer)}.`,
                `$r$ 在 $x = ${b}$ 处无意义，$s$ 在 $x = ${d}$ 处无意义；乘积只要求两个因式都有意义。所以这些值是 ${listText(answer, "、")}。`,
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

/** linearCaseSteps clears the denominators of a linear case and solves. */
function linearCaseSteps({ p, q, A, B, C, x0 }: LinearCase): string {
  return steps(
    `${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`,
    `${linear(A + B, -A * q - B * p)} = ${C}`,
    ...(A + B === 1 ? [] : [`${linear(A + B, 0)} = ${C + A * q + B * p}`]),
    `x = ${x0}`,
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
  encompasses: [
    { topic: "rational-equations-containing-binomials", weight: 0.3 },
    { topic: "rational-equations-using-cross-multiplication", weight: 0.3 },
    { topic: "adding-rational-expressions-with-unlike-denominators", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "monomial-denominators",
      title: t("Monomial denominators", "分母是单项式"),
      explanation: t(
        "With three terms, cross-multiplication no longer works. Instead multiply **every** term by the least common denominator (LCD), which clears all the fractions.\n\nFor $\\frac{5}{2x} + \\frac{1}{3x} = 4$, the LCD is $6x$ (and $x \\neq 0$):\n\n$$6x \\cdot \\frac{5}{2x} + 6x \\cdot \\frac{1}{3x} = 6x \\cdot 4$$\n\n$$15 + 2 = 24x \\quad\\Rightarrow\\quad x = \\frac{17}{24}$$\n\nDo not forget to multiply the term without a fraction too.",
        "方程有三项时，交叉相乘不再适用。改为把**每一项**都乘以最简公分母，消去所有分母。\n\n对 $\\frac{5}{2x} + \\frac{1}{3x} = 4$，最简公分母是 $6x$（且 $x \\neq 0$）：\n\n$$6x \\cdot \\frac{5}{2x} + 6x \\cdot \\frac{1}{3x} = 6x \\cdot 4$$\n\n$$15 + 2 = 24x \\quad\\Rightarrow\\quad x = \\frac{17}{24}$$\n\n不要忘了不含分母的那一项也要乘。",
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
          return numberProblem({
            prompt: t(`Solve $${then(sfrac(a, mx(m)), b, mx(n))} = ${c}$.`, `解方程 $${then(sfrac(a, mx(m)), b, mx(n))} = ${c}$。`),
            answer: x,
            solveFor: "x",
            wrong,
            solution: t(
              `The LCD is $${mx(L)}$, and $x \\neq 0$. Multiply every term by $${mx(L)}$:${steps(`${a * (L / m)} ${sgn(b * (L / n))} ${Math.abs(b * (L / n))} = ${c * L}x`, `${top} = ${c * L}x`, `x = ${num(x)}`)}`,
              `最简公分母是 $${mx(L)}$，且 $x \\neq 0$。每一项都乘以 $${mx(L)}$：${steps(`${a * (L / m)} ${sgn(b * (L / n))} ${Math.abs(b * (L / n))} = ${c * L}x`, `${top} = ${c * L}x`, `x = ${num(x)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "a-product-as-the-common-denominator",
      title: t("A product as the common denominator", "以乘积为公分母"),
      explanation: t(
        "When one denominator is a quadratic, factor it first: it is often the product of the other two denominators, and then it is the LCD.\n\n$$\\frac{2}{x - 1} + \\frac{3}{x + 2} = \\frac{9}{x^{2} + x - 2}, \\qquad x^{2} + x - 2 = (x - 1)(x + 2)$$\n\nSo $x \\neq 1$ and $x \\neq -2$. Multiply every term by $(x - 1)(x + 2)$:\n\n$$2(x + 2) + 3(x - 1) = 9 \\quad\\Rightarrow\\quad 5x + 1 = 9 \\quad\\Rightarrow\\quad x = \\frac{8}{5}$$",
        "如果有一个分母是二次式，先把它因式分解：它常常就是另两个分母的乘积，也就是最简公分母。\n\n$$\\frac{2}{x - 1} + \\frac{3}{x + 2} = \\frac{9}{x^{2} + x - 2}, \\qquad x^{2} + x - 2 = (x - 1)(x + 2)$$\n\n所以 $x \\neq 1$ 且 $x \\neq -2$。每一项都乘以 $(x - 1)(x + 2)$：\n\n$$2(x + 2) + 3(x - 1) = 9 \\quad\\Rightarrow\\quad 5x + 1 = 9 \\quad\\Rightarrow\\quad x = \\frac{8}{5}$$",
      ),
      generate(rng) {
        const c = linearCase(rng, false);
        const { p, q, A, B, C, x0 } = c;
        return solutionsProblem({
          prompt: t(`Solve $${linearCaseLatex(c)}$.`, `解方程 $${linearCaseLatex(c)}$。`),
          values: [String(x0)],
          wrong: [[num(Q.of(C + A * q - B * p, A + B))], [num(Q.of(C + A * p + B * q, A + B))], [String(x0), String(p)]],
          solution: t(
            `Factor: $${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$, so $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by $${prodL(simple([p, q]))}$:${linearCaseSteps(c)}This is not an excluded value, so the solution is $x = ${x0}$.`,
            `因式分解：$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$，所以 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$：${linearCaseSteps(c)}它不是被排除的值，所以解是 $x = ${x0}$。`,
          ),
        });
      },
    },
    {
      id: "rejecting-extraneous-solutions",
      title: t("Rejecting extraneous solutions", "舍去增根"),
      explanation: t(
        "Multiplying by an expression that can be $0$ may create a solution of the new equation that is not a solution of the original one: an **extraneous solution**. Always compare the result with the excluded values.\n\n$$\\frac{1}{x - 3} + \\frac{2}{x + 1} = \\frac{4}{x^{2} - 2x - 3} \\qquad (x \\neq 3,\\ x \\neq -1)$$\n\n$$(x + 1) + 2(x - 3) = 4 \\quad\\Rightarrow\\quad 3x - 5 = 4 \\quad\\Rightarrow\\quad x = 3$$\n\nBut $x = 3$ is excluded, so the equation has **no solution**.",
        "乘以可能为 $0$ 的式子，可能使新方程多出原方程没有的解，即**增根**。一定要把结果与被排除的值比较。\n\n$$\\frac{1}{x - 3} + \\frac{2}{x + 1} = \\frac{4}{x^{2} - 2x - 3} \\qquad (x \\neq 3,\\ x \\neq -1)$$\n\n$$(x + 1) + 2(x - 3) = 4 \\quad\\Rightarrow\\quad 3x - 5 = 4 \\quad\\Rightarrow\\quad x = 3$$\n\n但 $x = 3$ 是被排除的值，所以方程**无解**。",
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
          solution: t(
            `The excluded values are $x = ${p}$ and $x = ${q}$. Multiply every term by $${prodL(simple([p, q]))}$:${linearCaseSteps(c)}${extraneous ? `But $x = ${x0}$ is excluded, so it is extraneous and the equation has no solution.` : `This is not excluded, so the solution is $x = ${x0}$.`}`,
            `被排除的值是 $x = ${p}$ 和 $x = ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$：${linearCaseSteps(c)}${extraneous ? `但 $x = ${x0}$ 是被排除的值，是增根，所以方程无解。` : `它不是被排除的值，所以解是 $x = ${x0}$。`}`,
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
  knowledgePoints: [
    {
      id: "two-fractions-equal-to-a-number",
      title: t("Two fractions equal to a number", "两个分式之和等于一个数"),
      explanation: t(
        "Clearing the denominators of $\\frac{A}{x - p} + \\frac{B}{x - q} = C$ multiplies the constant $C$ by $(x - p)(x - q)$, which gives a quadratic equation. Collect everything on one side and factor.\n\n$$\\frac{3}{x - 1} - \\frac{2}{x + 1} = 1 \\qquad (x \\neq \\pm 1)$$\n\n$$3(x + 1) - 2(x - 1) = (x - 1)(x + 1)$$\n\n$$x + 5 = x^{2} - 1 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\nSo $x = 3$ or $x = -2$. Neither is excluded, so both are solutions.",
        "对 $\\frac{A}{x - p} + \\frac{B}{x - q} = C$ 去分母时，常数 $C$ 要乘以 $(x - p)(x - q)$，于是得到二次方程。把所有项移到一边再因式分解。\n\n$$\\frac{3}{x - 1} - \\frac{2}{x + 1} = 1 \\qquad (x \\neq \\pm 1)$$\n\n$$3(x + 1) - 2(x - 1) = (x - 1)(x + 1)$$\n\n$$x + 5 = x^{2} - 1 \\quad\\Rightarrow\\quad x^{2} - x - 6 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 2) = 0$$\n\n所以 $x = 3$ 或 $x = -2$。两者都不是被排除的值，所以都是解。",
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
          solution: t(
            `Here $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by $${prodL(simple([p, q]))}$, then collect the terms on one side:${steps(`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl(std)} = 0`, `${front(Math.abs(C))}${fac(r1)}${fac(r2)} = 0`)}Neither root is excluded, so $x = ${r1}$ or $x = ${r2}$.`,
            `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$，再把各项移到一边：${steps(`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl(std)} = 0`, `${front(Math.abs(C))}${fac(r1)}${fac(r2)} = 0`)}两个根都不是被排除的值，所以 $x = ${r1}$ 或 $x = ${r2}$。`,
          ),
        });
      },
    },
    {
      id: "a-term-without-a-denominator",
      title: t("A term without a denominator", "含不带分母的项"),
      explanation: t(
        "In $x + \\frac{A}{x - p} = C$, multiplying by $x - p$ turns the term $x$ into $x(x - p)$, so the equation becomes quadratic.\n\n$$x + \\frac{4}{x - 3} = 8 \\qquad (x \\neq 3)$$\n\n$$x(x - 3) + 4 = 8(x - 3)$$\n\n$$x^{2} - 3x + 4 = 8x - 24 \\quad\\Rightarrow\\quad x^{2} - 11x + 28 = 0 \\quad\\Rightarrow\\quad (x - 4)(x - 7) = 0$$\n\nSo $x = 4$ or $x = 7$; neither is $3$.",
        "在 $x + \\frac{A}{x - p} = C$ 中，乘以 $x - p$ 后，$x$ 这一项变成 $x(x - p)$，方程就成了二次方程。\n\n$$x + \\frac{4}{x - 3} = 8 \\qquad (x \\neq 3)$$\n\n$$x(x - 3) + 4 = 8(x - 3)$$\n\n$$x^{2} - 3x + 4 = 8x - 24 \\quad\\Rightarrow\\quad x^{2} - 11x + 28 = 0 \\quad\\Rightarrow\\quad (x - 4)(x - 7) = 0$$\n\n所以 $x = 4$ 或 $x = 7$；两者都不是 $3$。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(-6, 6);
          const [r1, r2] = rng.sample(range(-8, 8), 2) as [number, number];
          const C = r1 + r2 - p;
          const A = r1 * r2 - C * p;
          if (A === 0 || Math.abs(A) > 40) continue;
          const lhs = rng.bool(0.7) ? then("x", A, bare(p)) : `${sfrac(A, bare(p))} + x`;
          return solutionsProblem({
            prompt: t(`Solve $${lhs} = ${C}$.`, `解方程 $${lhs} = ${C}$。`),
            values: values([r1, r2]),
            wrong: [values([-r1, -r2]), values([r1])],
            solution: t(
              `Here $x \\neq ${p}$. Multiply every term by $${bare(p)}$:${steps(`${p === 0 ? "x \\cdot x" : `x${fac(p)}`} ${plus(A).trim()} = ${coefFac(C, p)}`, `${pl([A + C * p, -(p + C), 1])} = 0`, `${fac(r1)}${fac(r2)} = 0`)}Neither root is $${p}$, so $x = ${r1}$ or $x = ${r2}$.`,
              `这里 $x \\neq ${p}$。每一项都乘以 $${bare(p)}$：${steps(`${p === 0 ? "x \\cdot x" : `x${fac(p)}`} ${plus(A).trim()} = ${coefFac(C, p)}`, `${pl([A + C * p, -(p + C), 1])} = 0`, `${fac(r1)}${fac(r2)} = 0`)}两个根都不是 $${p}$，所以 $x = ${r1}$ 或 $x = ${r2}$。`,
            ),
          });
        }
      },
    },
    {
      id: "one-extraneous-root",
      title: t("One extraneous root", "一个增根"),
      explanation: t(
        "The quadratic you get after clearing denominators may have a root that is an excluded value. Reject it and keep the other root.\n\n$$\\frac{x}{x - 2} + \\frac{1}{x + 1} = \\frac{6}{x^{2} - x - 2} \\qquad (x \\neq 2,\\ x \\neq -1)$$\n\n$$x(x + 1) + (x - 2) = 6 \\quad\\Rightarrow\\quad x^{2} + 2x - 8 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 4) = 0$$\n\nSince $x = 2$ is excluded, it is extraneous: the only solution is $x = -4$.",
        "去分母后得到的二次方程，可能有一个根是被排除的值。把它舍去，保留另一个根。\n\n$$\\frac{x}{x - 2} + \\frac{1}{x + 1} = \\frac{6}{x^{2} - x - 2} \\qquad (x \\neq 2,\\ x \\neq -1)$$\n\n$$x(x + 1) + (x - 2) = 6 \\quad\\Rightarrow\\quad x^{2} + 2x - 8 = 0 \\quad\\Rightarrow\\quad (x - 2)(x + 4) = 0$$\n\n因为 $x = 2$ 被排除，它是增根：唯一的解是 $x = -4$。",
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
            solution: t(
              `Factor: $${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$, so $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by it:${steps(`x${fac(q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`, `${pl(fromRoots([p, r]))} = 0`, `${prodL(simple([p, r]))} = 0`)}The root $x = ${p}$ is excluded, so it is extraneous. The only solution is $x = ${r}$.`,
              `因式分解：$${pl(fromRoots([p, q]))} = ${prodL(simple([p, q]))}$，所以 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以它：${steps(`x${fac(q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`, `${pl(fromRoots([p, r]))} = 0`, `${prodL(simple([p, r]))} = 0`)}根 $x = ${p}$ 被排除，是增根。唯一的解是 $x = ${r}$。`,
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
  knowledgePoints: [
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        "When the quadratic does not factor, use the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ and simplify the root.\n\n$$\\frac{1}{x} + \\frac{1}{x - 2} = 1 \\qquad (x \\neq 0,\\ x \\neq 2)$$\n\n$$(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 4x + 2 = 0$$\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 8}}{2} = \\frac{4 \\pm 2\\sqrt{2}}{2} = 2 \\pm \\sqrt{2}$$\n\nIrrational roots are never the excluded integers, so both are solutions.",
        "二次式不能因式分解时，用求根公式 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$，并化简根式。\n\n$$\\frac{1}{x} + \\frac{1}{x - 2} = 1 \\qquad (x \\neq 0,\\ x \\neq 2)$$\n\n$$(x - 2) + x = x(x - 2) \\quad\\Rightarrow\\quad x^{2} - 4x + 2 = 0$$\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 8}}{2} = \\frac{4 \\pm 2\\sqrt{2}}{2} = 2 \\pm \\sqrt{2}$$\n\n无理数根不可能是被排除的整数，所以两个都是解。",
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
            solution: t(
              `Here $x \\neq ${p}$ and $x \\neq ${q}$. Multiply every term by $${prodL(simple([p, q]))}$ and collect the terms on one side:${steps(`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl([c, b, a])} = 0`)}This does not factor, so use the quadratic formula:${steps(`x = \\frac{${num(-b)} \\pm \\sqrt{${D}}}{${2 * a}} = ${answer[0]} \\text{ or } ${answer[1]}`)}`,
              `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。每一项都乘以 $${prodL(simple([p, q]))}$，再把各项移到一边：${steps(`${coefFac(A, q)} ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${coefFac(C, p)}${fac(q)}`, `${pl([c, b, a])} = 0`)}它不能因式分解，所以用求根公式：${steps(`x = \\frac{${num(-b)} \\pm \\sqrt{${D}}}{${2 * a}} = ${answer[0]} \\text{ 或 } ${answer[1]}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "factoring-a-difference-of-squares-denominator",
      title: t("Factoring the denominator first", "先分解分母"),
      explanation: t(
        "A denominator such as $x^{2} - 9$ is the difference of squares $(x - 3)(x + 3)$. Factor it to find the LCD and the excluded values, then clear the denominators.\n\n$$\\frac{x}{x - 3} + \\frac{2}{x + 3} = \\frac{18}{x^{2} - 9} \\qquad (x \\neq \\pm 3)$$\n\n$$x(x + 3) + 2(x - 3) = 18 \\quad\\Rightarrow\\quad x^{2} + 5x - 24 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 8) = 0$$\n\n$x = 3$ is excluded, so the only solution is $x = -8$.",
        "像 $x^{2} - 9$ 这样的分母是平方差 $(x - 3)(x + 3)$。先分解它，得到最简公分母和被排除的值，再去分母。\n\n$$\\frac{x}{x - 3} + \\frac{2}{x + 3} = \\frac{18}{x^{2} - 9} \\qquad (x \\neq \\pm 3)$$\n\n$$x(x + 3) + 2(x - 3) = 18 \\quad\\Rightarrow\\quad x^{2} + 5x - 24 = 0 \\quad\\Rightarrow\\quad (x - 3)(x + 8) = 0$$\n\n$x = 3$ 被排除，所以唯一的解是 $x = -8$。",
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
          return solutionsProblem({
            prompt: t(
              `Solve $${then(frac("x", bare(p)), B, bare(-p))} = ${sfrac(C, `x^{2} - ${p * p}`)}$. If there is no solution, answer "no solution".`,
              `解方程 $${then(frac("x", bare(p)), B, bare(-p))} = ${sfrac(C, `x^{2} - ${p * p}`)}$。若无解，回答“无解”。`,
            ),
            values: values(answer),
            wrong: [values([r1, r2]), values([-r1, -r2]), ...(answer.length === 2 ? [values([r1])] : [])],
            solution: t(
              `Factor $x^{2} - ${p * p} = (x - ${p})(x + ${p})$, so $x \\neq \\pm ${p}$. Multiply every term by it:${steps(`x(x + ${p}) ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`, `${pl(fromRoots([r1, r2]))} = 0`, `${prodL(simple([r1, r2]))} = 0`)}${answer.length === 2 ? `Neither root is $\\pm ${p}$, so $x = ${r1}$ or $x = ${r2}$.` : answer.length === 1 ? `The root $x = ${r1}$ is excluded, so the only solution is $x = ${answer[0]}$.` : "Both roots are excluded, so there is no solution."}`,
              `分解 $x^{2} - ${p * p} = (x - ${p})(x + ${p})$，所以 $x \\neq \\pm ${p}$。每一项都乘以它：${steps(`x(x + ${p}) ${sgn(B)} ${coefFac(Math.abs(B), p)} = ${C}`, `${pl(fromRoots([r1, r2]))} = 0`, `${prodL(simple([r1, r2]))} = 0`)}${answer.length === 2 ? `两个根都不是 $\\pm ${p}$，所以 $x = ${r1}$ 或 $x = ${r2}$。` : answer.length === 1 ? `根 $x = ${r1}$ 被排除，所以唯一的解是 $x = ${answer[0]}$。` : "两个根都被排除，所以方程无解。"}`,
            ),
          });
        }
      },
    },
    {
      id: "cross-multiplying-to-a-quadratic",
      title: t("Cross-multiplying to a quadratic", "交叉相乘得到二次方程"),
      explanation: t(
        "When each side is one fraction with a linear numerator, cross-multiply. The products are quadratics, and when the $x^{2}$ terms do not cancel the result is a quadratic equation.\n\n$$\\frac{2x - 1}{x - 1} = \\frac{x + 7}{x + 1} \\qquad (x \\neq \\pm 1)$$\n\n$$(2x - 1)(x + 1) = (x + 7)(x - 1)$$\n\n$$2x^{2} + x - 1 = x^{2} + 6x - 7 \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\nNeither $2$ nor $3$ is excluded, so $x = 2$ or $x = 3$.",
        "当方程两边都是一个分子为一次式的分式时，交叉相乘。乘积是二次式，若 $x^{2}$ 项没有抵消，就得到二次方程。\n\n$$\\frac{2x - 1}{x - 1} = \\frac{x + 7}{x + 1} \\qquad (x \\neq \\pm 1)$$\n\n$$(2x - 1)(x + 1) = (x + 7)(x - 1)$$\n\n$$2x^{2} + x - 1 = x^{2} + 6x - 7 \\quad\\Rightarrow\\quad x^{2} - 5x + 6 = 0 \\quad\\Rightarrow\\quad (x - 2)(x - 3) = 0$$\n\n$2$ 和 $3$ 都不是被排除的值，所以 $x = 2$ 或 $x = 3$。",
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
          return solutionsProblem({
            prompt: t(
              `Solve $${frac(linear(a, b), bare(p))} = ${frac(linear(c, d), bare(q))}$.`,
              `解方程 $${frac(linear(a, b), bare(p))} = ${frac(linear(c, d), bare(q))}$。`,
            ),
            values: values([r1, r2]),
            wrong: [values([-r1, -r2]), values([r1])],
            solution: t(
              `Here $x \\neq ${p}$ and $x \\neq ${q}$. Cross-multiply and expand:${steps(`(${linear(a, b)})${fac(q)} = (${linear(c, d)})${fac(p)}`, `${pl(left)} = ${pl(right)}`, `${pl(std)} = 0`, `${front(Math.abs(a - c))}${fac(r1)}${fac(r2)} = 0`)}Neither root is excluded, so $x = ${r1}$ or $x = ${r2}$.`,
              `这里 $x \\neq ${p}$ 且 $x \\neq ${q}$。交叉相乘并展开：${steps(`(${linear(a, b)})${fac(q)} = (${linear(c, d)})${fac(p)}`, `${pl(left)} = ${pl(right)}`, `${pl(std)} = 0`, `${front(Math.abs(a - c))}${fac(r1)}${fac(r2)} = 0`)}两个根都不是被排除的值，所以 $x = ${r1}$ 或 $x = ${r2}$。`,
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
  encompasses: [
    { topic: "simplifying-rational-expressions-using-polynomial-factorization", weight: 0.3 },
    { topic: "roots-of-a-function", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "roots-of-factored-rational-functions",
      title: t("Roots from factored forms", "由因式分解形式求零点"),
      explanation: t(
        "A **rational function** is $f(x) = \\frac{p(x)}{q(x)}$ with polynomials $p$ and $q$. A fraction is $0$ exactly when its numerator is $0$ and its denominator is not. So the roots of $f$ are the zeros of $p$ that are not zeros of $q$.\n\n$$f(x) = \\frac{(x - 2)(x + 5)}{(x - 2)(x + 1)}$$\n\nThe numerator is $0$ at $x = 2$ and $x = -5$. But $x = 2$ also makes the denominator $0$, so $f(2)$ is not defined. The only root is $x = -5$.",
        "**分式函数**是 $f(x) = \\frac{p(x)}{q(x)}$，其中 $p$、$q$ 是多项式。分式为 $0$ 当且仅当分子为 $0$ 而分母不为 $0$。所以 $f$ 的零点是 $p$ 的零点中不是 $q$ 的零点的那些。\n\n$$f(x) = \\frac{(x - 2)(x + 5)}{(x - 2)(x + 1)}$$\n\n分子在 $x = 2$ 和 $x = -5$ 处为 $0$。但 $x = 2$ 也使分母为 $0$，$f(2)$ 无意义。唯一的零点是 $x = -5$。",
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
          solution: t(
            `The numerator is $0$ at ${listText(nums)}. ${share ? `But $x = ${nums[0]}$ also makes the denominator $0$, so it is not a root. ` : "None of these makes the denominator $0$. "}${answer.length ? `The root${answer.length > 1 ? "s are" : " is"} ${listText(answer)}.` : "So $f$ has no roots."}`,
            `分子在 ${listText(nums, "、")} 处为 $0$。${share ? `但 $x = ${nums[0]}$ 也使分母为 $0$，所以它不是零点。` : "它们都不使分母为 $0$。"}${answer.length ? `零点是 ${listText(answer, "、")}。` : "所以 $f$ 没有零点。"}`,
          ),
        });
      },
    },
    {
      id: "factoring-to-find-roots",
      title: t("Factoring to find the roots", "因式分解求零点"),
      explanation: t(
        "When the numerator and denominator are expanded, factor both first.\n\n$$f(x) = \\frac{2x^{2} + 3x - 2}{x^{2} - 4} = \\frac{(2x - 1)(x + 2)}{(x - 2)(x + 2)}$$\n\nThe numerator is $0$ at $x = \\frac{1}{2}$ and $x = -2$, but the denominator is $0$ at $x = -2$ too. The only root is $x = \\frac{1}{2}$.",
        "如果分子和分母都是展开式，先把它们因式分解。\n\n$$f(x) = \\frac{2x^{2} + 3x - 2}{x^{2} - 4} = \\frac{(2x - 1)(x + 2)}{(x - 2)(x + 2)}$$\n\n分子在 $x = \\frac{1}{2}$ 和 $x = -2$ 处为 $0$，但分母在 $x = -2$ 处也为 $0$。唯一的零点是 $x = \\frac{1}{2}$。",
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
          return solutionsProblem({
            prompt: t(`Find the roots of $f(x) = ${frac(pl(N), pl(D))}$.`, `求 $f(x) = ${frac(pl(N), pl(D))}$ 的零点。`),
            values: values(answer),
            wrong: [values(numRoots), values([d1, d2]), values(answer.map((x) => x.neg()))],
            solution: t(
              `Factor:${steps(`f(x) = ${frac(nf, df)}`)}The numerator is $0$ at ${listText(numRoots)}${answer.length < 2 ? `, but $x = ${r}$ also makes the denominator $0$` : ", and the denominator is not $0$ there"}. So the root${answer.length > 1 ? "s are" : " is"} ${listText(answer)}.`,
              `因式分解：${steps(`f(x) = ${frac(nf, df)}`)}分子在 ${listText(numRoots, "、")} 处为 $0$${answer.length < 2 ? `，但 $x = ${r}$ 也使分母为 $0$` : "，而分母在这些地方不为 $0$"}。所以零点是 ${listText(answer, "、")}。`,
            ),
          });
        }
      },
    },
    {
      id: "intercepts-of-rational-functions",
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "The $y$-intercept of $f(x) = \\frac{p(x)}{q(x)}$ is $(0, f(0))$, where $f(0) = \\frac{p(0)}{q(0)}$ is the constant term of the numerator over the constant term of the denominator. It exists only when $q(0) \\neq 0$.\n\n$$f(x) = \\frac{x^{2} - 3x + 6}{2x^{2} + x - 4}: \\quad f(0) = \\frac{6}{-4} = -\\frac{3}{2}$$\n\nso the graph crosses the $y$-axis at $\\left(0, -\\frac{3}{2}\\right)$.",
        "$f(x) = \\frac{p(x)}{q(x)}$ 的 $y$ 轴截距是 $(0, f(0))$，其中 $f(0) = \\frac{p(0)}{q(0)}$ 是分子的常数项除以分母的常数项。只有当 $q(0) \\neq 0$ 时它才存在。\n\n$$f(x) = \\frac{x^{2} - 3x + 6}{2x^{2} + x - 4}: \\quad f(0) = \\frac{6}{-4} = -\\frac{3}{2}$$\n\n所以图象与 $y$ 轴交于 $\\left(0, -\\frac{3}{2}\\right)$。",
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
            solution: t(
              `On the $y$-axis $x = 0$, and every term with $x$ vanishes:${steps(`f(0) = ${frac(String(n0), String(d0))} = ${num(y)}`)}The point is $(0, ${num(y)})$.`,
              `在 $y$ 轴上 $x = 0$，含 $x$ 的项都为 $0$：${steps(`f(0) = ${frac(String(n0), String(d0))} = ${num(y)}`)}交点是 $(0, ${num(y)})$。`,
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
  encompasses: [
    { topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.5 },
    { topic: "roots-of-rational-functions", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "denominators-with-leading-coefficients",
      title: t("Denominators with leading coefficients", "首项系数不为 1 的分母"),
      explanation: t(
        "$f(x) = \\frac{p(x)}{q(x)}$ has a **vertical asymptote** $x = a$ when $q(a) = 0$ and the factor $x - a$ does not cancel with the numerator. Near such an $a$, $f$ grows without bound.\n\nFactor the denominator completely; a factor $kx - m$ gives $x = \\frac{m}{k}$:\n\n$$f(x) = \\frac{5}{6x^{2} + x - 2} = \\frac{5}{(2x - 1)(3x + 2)}$$\n\nThe vertical asymptotes are $x = \\frac{1}{2}$ and $x = -\\frac{2}{3}$.",
        "若 $q(a) = 0$，且因式 $x - a$ 不能与分子约去，则 $f(x) = \\frac{p(x)}{q(x)}$ 有**竖直渐近线** $x = a$。在这样的 $a$ 附近，$f$ 无界增大。\n\n把分母完全分解；因式 $kx - m$ 给出 $x = \\frac{m}{k}$：\n\n$$f(x) = \\frac{5}{6x^{2} + x - 2} = \\frac{5}{(2x - 1)(3x + 2)}$$\n\n竖直渐近线是 $x = \\frac{1}{2}$ 和 $x = -\\frac{2}{3}$。",
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
          const answer = [r1, r2];
          return solutionsProblem({
            prompt: t(
              `Find the vertical asymptotes of $f(x) = ${frac(top, pl(D))}$. Write each as $x = a$.`,
              `求 $f(x) = ${frac(top, pl(D))}$ 的竖直渐近线，每条写成 $x = a$ 的形式。`,
            ),
            values: values(answer),
            wrong: [values(answer.map((x) => x.neg())), values([Q.of(-a, b), Q.of(-c, d)]), values([s])],
            solution: t(
              `Factor the denominator:${steps(`${pl(D)} = (${linear(a, b)})(${linear(c, d)})`)}It is $0$ at $x = ${num(r1)}$ and $x = ${num(r2)}$, and the numerator is not $0$ at either. So the vertical asymptotes are $x = ${num(r1)}$ and $x = ${num(r2)}$.`,
              `分解分母：${steps(`${pl(D)} = (${linear(a, b)})(${linear(c, d)})`)}它在 $x = ${num(r1)}$ 和 $x = ${num(r2)}$ 处为 $0$，而分子在这两处都不为 $0$。所以竖直渐近线是 $x = ${num(r1)}$ 和 $x = ${num(r2)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "cubic-denominators",
      title: t("Cubic denominators", "三次分母"),
      explanation: t(
        "A cubic denominator often factors by taking out a common factor first:\n\n$$f(x) = \\frac{x + 3}{x^{3} - 9x} = \\frac{x + 3}{x(x - 3)(x + 3)}$$\n\nThe denominator is $0$ at $x = 0$, $3$ and $-3$. The factor $x + 3$ cancels with the numerator, leaving a hole at $x = -3$. So the vertical asymptotes are $x = 0$ and $x = 3$.",
        "三次分母常常可以先提取公因式再分解：\n\n$$f(x) = \\frac{x + 3}{x^{3} - 9x} = \\frac{x + 3}{x(x - 3)(x + 3)}$$\n\n分母在 $x = 0$、$3$、$-3$ 处为 $0$。因式 $x + 3$ 与分子约去，在 $x = -3$ 处只留下空洞。所以竖直渐近线是 $x = 0$ 和 $x = 3$。",
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
          solution: t(
            `Take out the common factor $${front(lead)}x$ and factor the rest:${steps(`${pl(D)} = ${front(lead)}x${fac(r1)}${fac(r2)}`)}The denominator is $0$ at ${listText(roots)}. ${shared ? `The factor $${bare(s)}$ cancels with the numerator, leaving a hole at $x = ${s}$. ` : "None of its factors cancels with the numerator. "}So the vertical asymptotes are ${listText(answer)}.`,
            `提取公因式 $${front(lead)}x$，再分解剩下的部分：${steps(`${pl(D)} = ${front(lead)}x${fac(r1)}${fac(r2)}`)}分母在 ${listText(roots, "、")} 处为 $0$。${shared ? `因式 $${bare(s)}$ 与分子约去，在 $x = ${s}$ 处只留下空洞。` : "它的因式都不能与分子约去。"}所以竖直渐近线是 ${listText(answer, "、")}。`,
          ),
        });
      },
    },
    {
      id: "counting-vertical-asymptotes",
      title: t("Counting vertical asymptotes", "数竖直渐近线的条数"),
      explanation: t(
        "To count the vertical asymptotes, factor the denominator and compare each factor with the numerator:\n\n- a factor $x^{2} + k$ with $k > 0$ is never $0$, so it gives no asymptote;\n- a repeated factor such as $(x - 2)^{2}$ gives only one asymptote, $x = 2$;\n- a factor $x - a$ that cancels completely with the numerator gives a hole, not an asymptote; but if $(x - a)^{2}$ is in the denominator and only $x - a$ in the numerator, one factor is left and $x = a$ is still an asymptote.\n\n$$\\frac{x - 1}{(x - 1)^{2}(x^{2} + 4)} = \\frac{1}{(x - 1)(x^{2} + 4)}$$\n\nhas exactly one vertical asymptote, $x = 1$.",
        "数竖直渐近线时，把分母因式分解，并把每个因式与分子比较：\n\n- $k > 0$ 时因式 $x^{2} + k$ 永不为 $0$，不产生渐近线；\n- 重复的因式如 $(x - 2)^{2}$ 只产生一条渐近线 $x = 2$；\n- 能与分子完全约去的因式 $x - a$ 产生空洞，而不是渐近线；但如果分母有 $(x - a)^{2}$ 而分子只有 $x - a$，约分后还剩一个因式，$x = a$ 仍是渐近线。\n\n$$\\frac{x - 1}{(x - 1)^{2}(x^{2} + 4)} = \\frac{1}{(x - 1)(x^{2} + 4)}$$\n\n恰有一条竖直渐近线 $x = 1$。",
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
        return numberProblem({
          prompt: t(
            `How many vertical asymptotes does the graph of $f(x) = ${frac(top, pl(D))}$ have?`,
            `$f(x) = ${frac(top, pl(D))}$ 的图象有几条竖直渐近线？`,
          ),
          answer: count,
          wrong: [roots.length, deg(D), count + 1],
          solution: t(
            `${fs.length ? `Factor the denominator: $${pl(D)} = ${fs.map(([r, m]) => facPow(r, m)).join("")}${irr ? `(x^{2} + ${irr})` : ""}$.${irr ? ` The factor $x^{2} + ${irr}$ is never $0$, because $x^{2} \\ge 0$.` : ""} The denominator is $0$ at ${listText([...new Set(roots)])}.` : `The denominator $x^{2} + ${irr}$ is never $0$, because $x^{2} \\ge 0$.`}${sNum !== undefined && roots.includes(sNum) ? ` The numerator $${bare(sNum)}$ cancels ${fs.find(([r]) => r === sNum)![1] > 1 ? "one of the two factors" : "the factor"} $${bare(sNum)}$${fs.find(([r]) => r === sNum)![1] > 1 ? `, so $x = ${sNum}$ is still an asymptote` : `, leaving a hole at $x = ${sNum}$`}.` : ""} So there ${count === 1 ? "is" : "are"} $${count}$ vertical asymptote${count === 1 ? "" : "s"}.`,
            `${fs.length ? `分解分母：$${pl(D)} = ${fs.map(([r, m]) => facPow(r, m)).join("")}${irr ? `(x^{2} + ${irr})` : ""}$。${irr ? `因为 $x^{2} \\ge 0$，因式 $x^{2} + ${irr}$ 永不为 $0$。` : ""}分母在 ${listText([...new Set(roots)], "、")} 处为 $0$。` : `因为 $x^{2} \\ge 0$，分母 $x^{2} + ${irr}$ 永不为 $0$。`}${sNum !== undefined && roots.includes(sNum) ? `分子 $${bare(sNum)}$ 约去${fs.find(([r]) => r === sNum)![1] > 1 ? "两个因式中的一个" : "因式"} $${bare(sNum)}$${fs.find(([r]) => r === sNum)![1] > 1 ? `，所以 $x = ${sNum}$ 仍是渐近线` : `，在 $x = ${sNum}$ 处只留下空洞`}。` : ""}所以共有 $${count}$ 条竖直渐近线。`,
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
  knowledgePoints: [
    {
      id: "holes-of-factored-functions",
      title: t("The coordinates of a hole", "空洞的坐标"),
      explanation: t(
        "When a factor $x - h$ cancels completely, $f$ is not defined at $x = h$ but behaves like the simplified function there. Its graph is the graph of the simplified function with one point missing, a **hole**, drawn as an open circle.\n\nTo find the hole, cancel, then substitute $x = h$ into the simplified function:\n\n$$f(x) = \\frac{2(x - 3)(x + 1)}{(x - 3)(x - 5)} = \\frac{2(x + 1)}{x - 5} \\quad (x \\neq 3)$$\n\n$$\\frac{2(3 + 1)}{3 - 5} = -4$$\n\nso the hole is at $(3, -4)$.",
        "当因式 $x - h$ 被完全约去时，$f$ 在 $x = h$ 处无意义，但在那附近与化简后的函数一样。它的图象就是化简后函数的图象去掉一个点，这个点叫**空洞**，画成空心圆圈。\n\n求空洞时，先约分，再把 $x = h$ 代入化简后的函数：\n\n$$f(x) = \\frac{2(x - 3)(x + 1)}{(x - 3)(x - 5)} = \\frac{2(x + 1)}{x - 5} \\quad (x \\neq 3)$$\n\n$$\\frac{2(3 + 1)}{3 - 5} = -4$$\n\n所以空洞在 $(3, -4)$。",
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
          solution: t(
            `The factor $${bare(h)}$ cancels:${steps(`f(x) = ${frac(prodL(simple([r]), a), bare(p))} \\quad (x \\neq ${h})`)}Substitute $x = ${h}$ into the simplified function:${steps(`${frac(`${a === 1 ? "" : a === -1 ? "-" : `${a}`}(${h} ${sgn(-r)} ${Math.abs(r)})`, `${h} ${sgn(-p)} ${Math.abs(p)}`)} = ${num(y)}`)}The hole is at $(${h}, ${num(y)})$.`,
            `因式 $${bare(h)}$ 约去：${steps(`f(x) = ${frac(prodL(simple([r]), a), bare(p))} \\quad (x \\neq ${h})`)}把 $x = ${h}$ 代入化简后的函数：${steps(`${frac(`${a === 1 ? "" : a === -1 ? "-" : `${a}`}(${h} ${sgn(-r)} ${Math.abs(r)})`, `${h} ${sgn(-p)} ${Math.abs(p)}`)} = ${num(y)}`)}空洞在 $(${h}, ${num(y)})$。`,
          ),
        });
      },
    },
    {
      id: "holes-after-factoring",
      title: t("Holes after factoring", "因式分解后求空洞"),
      explanation: t(
        "When the numerator and denominator are expanded, factor both to find a common factor.\n\n$$f(x) = \\frac{x^{2} + x - 6}{2x^{2} - 3x - 2} = \\frac{(x - 2)(x + 3)}{(x - 2)(2x + 1)} = \\frac{x + 3}{2x + 1} \\quad (x \\neq 2)$$\n\nAt $x = 2$ the simplified function is $\\frac{5}{5} = 1$, so the hole is at $(2, 1)$. The remaining factor $2x + 1$ gives the vertical asymptote $x = -\\frac{1}{2}$.",
        "如果分子和分母是展开式，把两者都因式分解，找出公因式。\n\n$$f(x) = \\frac{x^{2} + x - 6}{2x^{2} - 3x - 2} = \\frac{(x - 2)(x + 3)}{(x - 2)(2x + 1)} = \\frac{x + 3}{2x + 1} \\quad (x \\neq 2)$$\n\n在 $x = 2$ 处化简后的函数值是 $\\frac{5}{5} = 1$，所以空洞在 $(2, 1)$。剩下的因式 $2x + 1$ 给出竖直渐近线 $x = -\\frac{1}{2}$。",
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
            solution: t(
              `Factor and cancel the common factor $${bare(h)}$:${steps(`f(x) = ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}(${simpleBottom})`)} = ${frac(simpleTop, simpleBottom)} \\quad (x \\neq ${h})`)}At $x = ${h}$ the simplified function is $${num(y)}$, so the hole is at $(${h}, ${num(y)})$.`,
              `因式分解并约去公因式 $${bare(h)}$：${steps(`f(x) = ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}(${simpleBottom})`)} = ${frac(simpleTop, simpleBottom)} \\quad (x \\neq ${h})`)}化简后的函数在 $x = ${h}$ 处的值是 $${num(y)}$，所以空洞在 $(${h}, ${num(y)})$。`,
            ),
          });
        }
      },
    },
    {
      id: "hole-or-asymptote",
      title: t("Hole or vertical asymptote?", "空洞还是竖直渐近线？"),
      explanation: t(
        "At a zero $x = a$ of the denominator, count how many times $x - a$ appears on the top and on the bottom:\n\n- at least as many times on top: it cancels completely, and there is a **hole**;\n- more times on the bottom: a factor is left in the denominator, and there is a **vertical asymptote**.\n\nIf $x = a$ is not a zero of the denominator, $f(a)$ is defined: neither.\n\n$$\\frac{(x - 1)^{2}}{(x - 1)(x + 4)}: \\text{ hole at } x = 1, \\qquad \\frac{x - 1}{(x - 1)^{2}(x + 4)}: \\text{ asymptote } x = 1$$",
        "在分母的零点 $x = a$ 处，数一数 $x - a$ 在分子和分母中各出现几次：\n\n- 分子中出现的次数不少于分母：完全约去，是**空洞**；\n- 分母中出现得更多：约分后分母中还剩因式，是**竖直渐近线**。\n\n若 $x = a$ 不是分母的零点，则 $f(a)$ 有意义：两者都不是。\n\n$$\\frac{(x - 1)^{2}}{(x - 1)(x + 4)}: \\ x = 1 \\text{ 处是空洞}, \\qquad \\frac{x - 1}{(x - 1)^{2}(x + 4)}: \\ x = 1 \\text{ 是渐近线}$$",
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
        return choiceProblem({
          prompt: t(
            `Does the graph of $f(x) = ${f}$ have a hole, a vertical asymptote, or neither at $x = ${c}$?`,
            `$f(x) = ${f}$ 的图象在 $x = ${c}$ 处是空洞、竖直渐近线，还是两者都不是？`,
          ),
          options: holeOptions,
          correct: kind,
          solution:
            kind === 2
              ? t(
                  `The denominator is not $0$ at $x = ${c}$, so $f(${c})$ is defined: neither.`,
                  `分母在 $x = ${c}$ 处不为 $0$，所以 $f(${c})$ 有意义：两者都不是。`,
                )
              : t(
                  `The factor $${bare(c)}$ appears ${kN === 0 ? "zero times" : times(kN)} in the numerator and ${times(kD)} in the denominator. ${kind === 0 ? "It cancels completely, so there is a hole." : "A factor is left in the denominator, so there is a vertical asymptote."}`,
                  `因式 $${bare(c)}$ 在分子中出现 ${kN} 次，在分母中出现 ${kD} 次。${kind === 0 ? "它被完全约去，所以是空洞。" : "约分后分母中还剩这个因式，所以是竖直渐近线。"}`,
                ),
        });
      },
    },
  ],
};

// ─── 2.5.4 Horizontal asymptotes of rational functions ─────────────────────

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
  encompasses: [
    { topic: "graph-transformations-of-reciprocal-functions", weight: 0.2 },
    { topic: "end-behavior", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "equal-degrees",
      title: t("Equal degrees", "次数相等"),
      explanation: t(
        "For large $|x|$, every polynomial is dominated by its leading term. So when the numerator and the denominator have the **same degree**,\n\n$$f(x) = \\frac{6x^{2} - x + 5}{3 - 4x^{2}} \\approx \\frac{6x^{2}}{-4x^{2}} = -\\frac{3}{2}$$\n\nand $f(x) \\to -\\frac{3}{2}$ as $x \\to \\pm\\infty$. The horizontal asymptote is $y = -\\frac{3}{2}$, the ratio of the **leading** coefficients. Find the leading terms carefully when the terms are not in order.",
        "当 $|x|$ 很大时，每个多项式都由首项（最高次项）主导。所以当分子与分母**次数相同**时，\n\n$$f(x) = \\frac{6x^{2} - x + 5}{3 - 4x^{2}} \\approx \\frac{6x^{2}}{-4x^{2}} = -\\frac{3}{2}$$\n\n当 $x \\to \\pm\\infty$ 时 $f(x) \\to -\\frac{3}{2}$。水平渐近线是 $y = -\\frac{3}{2}$，即两个**首项**系数之比。各项没有按次序排列时，要仔细找出首项。",
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
            solution: t(
              `The numerator and the denominator both have degree $${n}$. The leading terms are $${poly([a, termOf(n)])}$ and $${poly([b, termOf(n)])}$, so the horizontal asymptote is $y = ${ratioText(a, b)}$.`,
              `分子和分母都是 $${n}$ 次。首项分别是 $${poly([a, termOf(n)])}$ 和 $${poly([b, termOf(n)])}$，所以水平渐近线是 $y = ${ratioText(a, b)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "comparing-degrees",
      title: t("Comparing degrees", "比较次数"),
      explanation: t(
        "Let $n$ be the degree of the numerator and $m$ the degree of the denominator.\n\n- $n < m$: the denominator grows faster, $f(x) \\to 0$, and the horizontal asymptote is $y = 0$.\n- $n = m$: the horizontal asymptote is $y = \\frac{a}{b}$, the ratio of the leading coefficients.\n- $n > m$: $|f(x)|$ grows without bound, and there is **no** horizontal asymptote.\n\nFor example, $\\frac{5x + 1}{x^{2} - 4}$ has $y = 0$, $\\frac{5x^{2} + 1}{x^{2} - 4}$ has $y = 5$, and $\\frac{5x^{3} + 1}{x^{2} - 4}$ has none.",
        "设分子的次数为 $n$，分母的次数为 $m$。\n\n- $n < m$：分母增长得更快，$f(x) \\to 0$，水平渐近线是 $y = 0$。\n- $n = m$：水平渐近线是 $y = \\frac{a}{b}$，即首项系数之比。\n- $n > m$：$|f(x)|$ 无界增大，**没有**水平渐近线。\n\n例如 $\\frac{5x + 1}{x^{2} - 4}$ 的水平渐近线是 $y = 0$，$\\frac{5x^{2} + 1}{x^{2} - 4}$ 的是 $y = 5$，$\\frac{5x^{3} + 1}{x^{2} - 4}$ 没有水平渐近线。",
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
          n < m
            ? t(
                `The numerator has degree $${n}$, less than the degree $${m}$ of the denominator, so $f(x) \\to 0$: the horizontal asymptote is $y = 0$.`,
                `分子的次数 $${n}$ 小于分母的次数 $${m}$，所以 $f(x) \\to 0$：水平渐近线是 $y = 0$。`,
              )
            : n === m
              ? t(
                  `Both have degree $${n}$, so the horizontal asymptote is the ratio of the leading coefficients: $y = ${ratioText(a, b)}$.`,
                  `两者都是 $${n}$ 次，所以水平渐近线是首项系数之比：$y = ${ratioText(a, b)}$。`,
                )
              : t(
                  `The numerator has degree $${n}$, more than the degree $${m}$ of the denominator, so $|f(x)|$ grows without bound: there is no horizontal asymptote.`,
                  `分子的次数 $${n}$ 大于分母的次数 $${m}$，所以 $|f(x)|$ 无界增大：没有水平渐近线。`,
                ),
        );
      },
    },
    {
      id: "horizontal-asymptotes-of-factored-functions",
      title: t("Factored forms", "因式分解形式"),
      explanation: t(
        "When the function is written as a product of factors, you do not need to expand it: the leading coefficient of a product is the product of the leading coefficients of its factors. Watch factors written backward, such as $3 - 2x$, whose leading coefficient is $-2$.\n\n$$f(x) = \\frac{(2x - 1)(3 - x)}{(3x + 1)(x + 4)}: \\quad y = \\frac{2 \\cdot (-1)}{3 \\cdot 1} = -\\frac{2}{3}$$",
        "函数写成因式乘积时不必展开：乘积的首项系数等于各因式首项系数之积。注意倒着写的因式，如 $3 - 2x$ 的首项系数是 $-2$。\n\n$$f(x) = \\frac{(2x - 1)(3 - x)}{(3x + 1)(x + 4)}: \\quad y = \\frac{2 \\cdot (-1)}{3 \\cdot 1} = -\\frac{2}{3}$$",
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
            solution: t(
              `Both have degree $2$. The leading coefficient of the numerator is $${lead === 1 ? "" : `${paren(lead)} \\cdot `}${paren(a1)} \\cdot ${paren(a2)} = ${lead * a1 * a2}$ and that of the denominator is $${paren(c1)} \\cdot ${paren(c2)} = ${c1 * c2}$, so the horizontal asymptote is $y = ${num(answer)}$.`,
              `分子和分母都是二次。分子的首项系数是 $${lead === 1 ? "" : `${paren(lead)} \\cdot `}${paren(a1)} \\cdot ${paren(a2)} = ${lead * a1 * a2}$，分母的首项系数是 $${paren(c1)} \\cdot ${paren(c2)} = ${c1 * c2}$，所以水平渐近线是 $y = ${num(answer)}$。`,
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
  knowledgePoints: [
    {
      id: "limits-at-infinity",
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "$\\lim_{x \\to \\infty} f(x) = L$ means that $f(x)$ gets as close to $L$ as we like when $x$ is large enough; $\\lim_{x \\to -\\infty}$ is the same for large negative $x$. For a rational function whose numerator degree is at most the denominator degree, the limit at both ends is the horizontal asymptote:\n\n$$\\lim_{x \\to -\\infty} \\frac{4x^{3} - 1}{2x^{3} + x} = \\frac{4}{2} = 2, \\qquad \\lim_{x \\to \\infty} \\frac{4x - 1}{2x^{3} + x} = 0$$",
        "$\\lim_{x \\to \\infty} f(x) = L$ 表示只要 $x$ 足够大，$f(x)$ 就可以任意接近 $L$；$\\lim_{x \\to -\\infty}$ 则对绝对值很大的负数 $x$ 而言。对分子次数不超过分母次数的分式函数，两端的极限都是水平渐近线的值：\n\n$$\\lim_{x \\to -\\infty} \\frac{4x^{3} - 1}{2x^{3} + x} = \\frac{4}{2} = 2, \\qquad \\lim_{x \\to \\infty} \\frac{4x - 1}{2x^{3} + x} = 0$$",
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
            solution:
              n < m
                ? t(
                    `The numerator has lower degree ($${n}$) than the denominator ($${m}$), so the fraction approaches $0$ at both ends. The limit is $0$.`,
                    `分子的次数（$${n}$）低于分母的次数（$${m}$），所以分式在两端都趋于 $0$。极限是 $0$。`,
                  )
                : t(
                    `Both have degree $${n}$, so the limit at either end is the ratio of the leading coefficients: $${ratioText(a, b)}$.`,
                    `两者都是 $${n}$ 次，所以在任一端的极限都是首项系数之比：$${ratioText(a, b)}$。`,
                  ),
          });
        }
      },
    },
    {
      id: "unbounded-end-behavior",
      title: t("Unbounded end behavior", "无界的端点行为"),
      explanation: t(
        "When the numerator has the higher degree, $f(x)$ behaves at both ends like the quotient of the leading terms, a power of $x$:\n\n$$f(x) = \\frac{-2x^{4} + x}{x^{2} - 5} \\approx \\frac{-2x^{4}}{x^{2}} = -2x^{2}$$\n\nSo $f(x) \\to -\\infty$ as $x \\to \\infty$ and as $x \\to -\\infty$. For an odd power such as $3x$, the two ends go in opposite directions.",
        "当分子次数更高时，$f(x)$ 在两端的行为与两个首项之商（$x$ 的一个幂）相同：\n\n$$f(x) = \\frac{-2x^{4} + x}{x^{2} - 5} \\approx \\frac{-2x^{4}}{x^{2}} = -2x^{2}$$\n\n所以当 $x \\to \\infty$ 和 $x \\to -\\infty$ 时都有 $f(x) \\to -\\infty$。对奇次幂如 $3x$，两端趋向相反。",
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
        return choiceProblem({
          prompt: t(`Describe the end behavior of $f(x) = ${frac(pl(N), pl(D))}$.`, `描述 $f(x) = ${frac(pl(N), pl(D))}$ 的端点行为。`),
          options: endOptions,
          correct: endIndex(s, atMinus),
          solution: t(
            `For large $|x|$, $f(x) \\approx ${frac(poly([a, termOf(n)]), poly([b, termOf(m)]))} = ${poly([lead, termOf(k)])}$. ${k === 2 ? "An even power has the same sign at both ends" : "An odd power changes sign between the ends"}, so $f(x) \\to ${infL(s)}$ as $x \\to \\infty$ and $f(x) \\to ${infL(atMinus)}$ as $x \\to -\\infty$.`,
            `当 $|x|$ 很大时，$f(x) \\approx ${frac(poly([a, termOf(n)]), poly([b, termOf(m)]))} = ${poly([lead, termOf(k)])}$。${k === 2 ? "偶次幂在两端符号相同" : "奇次幂在两端符号相反"}，所以当 $x \\to \\infty$ 时 $f(x) \\to ${infL(s)}$，当 $x \\to -\\infty$ 时 $f(x) \\to ${infL(atMinus)}$。`,
          ),
        });
      },
    },
    {
      id: "slant-asymptotes",
      title: t("Slant asymptotes", "斜渐近线"),
      explanation: t(
        "When the numerator's degree is exactly one more than the denominator's, divide. The quotient is a linear function, and the remainder over the denominator tends to $0$, so the graph approaches the line $y = $ quotient: a **slant** (oblique) **asymptote**.\n\n$$f(x) = \\frac{2x^{2} - 3x + 4}{x - 2} = 2x + 1 + \\frac{6}{x - 2}$$\n\nAs $x \\to \\pm\\infty$, $\\frac{6}{x - 2} \\to 0$, so the slant asymptote is $y = 2x + 1$.",
        "当分子次数恰比分母次数多 $1$ 时，做除法。商是一次函数，余式除以分母趋于 $0$，所以图象趋近直线 $y = $ 商，这条直线叫**斜渐近线**。\n\n$$f(x) = \\frac{2x^{2} - 3x + 4}{x - 2} = 2x + 1 + \\frac{6}{x - 2}$$\n\n当 $x \\to \\pm\\infty$ 时 $\\frac{6}{x - 2} \\to 0$，所以斜渐近线是 $y = 2x + 1$。",
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
            solution: t(
              `Divide by $${bare(p)}$ (synthetic division with $${p}$):${steps(`f(x) = ${linear(a, q0)} ${then("", rem, bare(p)).trim()}`)}The remainder term tends to $0$ as $x \\to \\pm\\infty$, so the slant asymptote is $y = ${linear(a, q0)}$.`,
              `除以 $${bare(p)}$（用 $${p}$ 做综合除法）：${steps(`f(x) = ${linear(a, q0)} ${then("", rem, bare(p)).trim()}`)}当 $x \\to \\pm\\infty$ 时余式项趋于 $0$，所以斜渐近线是 $y = ${linear(a, q0)}$。`,
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
  encompasses: [
    { topic: "vertical-asymptotes-of-rational-functions", weight: 0.4 },
    { topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "one-sided-infinite-limits",
      title: t("One-sided infinite limits", "单侧无穷极限"),
      explanation: t(
        "$\\lim_{x \\to a^{+}} f(x) = \\infty$ means that $f(x)$ grows without bound as $x$ approaches $a$ from the right ($x > a$); $x \\to a^{-}$ means from the left. At a vertical asymptote, find the sign of each factor near $a$:\n\n$$\\lim_{x \\to 2^{-}} \\frac{x + 1}{(x - 2)(x - 4)}$$\n\nNear $x = 2$, $x + 1 \\approx 3$ is positive and $x - 4 \\approx -2$ is negative. For $x$ just left of $2$, $x - 2$ is a tiny negative number. So the fraction is $\\frac{+}{(-)(-)}$, positive and huge: the limit is $\\infty$.",
        "$\\lim_{x \\to a^{+}} f(x) = \\infty$ 表示 $x$ 从右侧（$x > a$）趋近 $a$ 时 $f(x)$ 无界增大；$x \\to a^{-}$ 表示从左侧趋近。在竖直渐近线处，判断 $a$ 附近每个因式的符号：\n\n$$\\lim_{x \\to 2^{-}} \\frac{x + 1}{(x - 2)(x - 4)}$$\n\n在 $x = 2$ 附近，$x + 1 \\approx 3$ 为正，$x - 4 \\approx -2$ 为负。$x$ 在 $2$ 左侧附近时，$x - 2$ 是绝对值很小的负数。所以分式的符号是 $\\frac{+}{(-)(-)}$，为正且绝对值很大：极限是 $\\infty$。",
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
        return choiceProblem({
          prompt: t(`Find $${sidedLimit(p, side)} ${latex}$.`, `求 $${sidedLimit(p, side)} ${latex}$。`),
          options: limitOptions,
          correct: limitIndex(s, s),
          solution: t(
            `Near $x = ${p}$, the numerator is about $${a * (p - r)}$ and $${bare(q)}$ is about $${p - q}$, while $${bare(p)}$ is ${w.en}. So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
            `在 $x = ${p}$ 附近，分子约为 $${a * (p - r)}$，$${bare(q)}$ 约为 $${p - q}$，而 $${bare(p)}$ 是${w["zh-CN"]}。所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
          ),
        });
      },
    },
    {
      id: "two-sided-infinite-limits",
      title: t("Two-sided infinite limits", "双侧无穷极限"),
      explanation: t(
        "The two-sided limit $\\lim_{x \\to a} f(x)$ is $\\infty$ (or $-\\infty$) only when both one-sided limits are. If they differ, the limit does not exist.\n\nThe power of $x - a$ decides: an **odd** power changes sign at $a$, so the two sides go in opposite directions; an **even** power is positive on both sides.\n\n$$\\lim_{x \\to 1} \\frac{-3}{(x - 1)^{2}} = -\\infty, \\qquad \\lim_{x \\to 1} \\frac{-3}{x - 1} \\text{ does not exist.}$$",
        "只有当两个单侧极限都是 $\\infty$（或都是 $-\\infty$）时，双侧极限 $\\lim_{x \\to a} f(x)$ 才是 $\\infty$（或 $-\\infty$）。若两者不同，则极限不存在。\n\n由 $x - a$ 的次数决定：**奇**次幂在 $a$ 两侧变号，两侧趋向相反；**偶**次幂在两侧都为正。\n\n$$\\lim_{x \\to 1} \\frac{-3}{(x - 1)^{2}} = -\\infty, \\qquad \\lim_{x \\to 1} \\frac{-3}{x - 1} \\text{ 不存在。}$$",
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
        return choiceProblem({
          prompt: t(`Find $${sidedLimit(p, 0)} ${latex}$.`, `求 $${sidedLimit(p, 0)} ${latex}$。`),
          options: limitOptions,
          correct: limitIndex(left, right),
          solution: t(
            `Apart from $${facPow(p, m)}$, the fraction is about $${num(restQ)}$ near $x = ${p}$, which is ${rest > 0 ? "positive" : "negative"}. ${m === 2 ? `The square $${facPow(p, m)}$ is a tiny positive number on both sides, so both one-sided limits are $${infL(left)}$ and the limit is $${infL(left)}$.` : `The factor $${bare(p)}$ is negative on the left and positive on the right, so the one-sided limits are $${infL(left)}$ and $${infL(right)}$: the limit does not exist.`}`,
            `除 $${facPow(p, m)}$ 外，分式在 $x = ${p}$ 附近约为 $${num(restQ)}$，${rest > 0 ? "为正" : "为负"}。${m === 2 ? `平方 $${facPow(p, m)}$ 在两侧都是很小的正数，所以两个单侧极限都是 $${infL(left)}$，极限是 $${infL(left)}$。` : `因式 $${bare(p)}$ 在左侧为负、右侧为正，所以两个单侧极限分别是 $${infL(left)}$ 和 $${infL(right)}$：极限不存在。`}`,
          ),
        });
      },
    },
    {
      id: "factors-written-backward",
      title: t("Factors written backward", "倒着写的因式"),
      explanation: t(
        "A factor such as $3 - x$ is $0$ at $x = 3$ but has the opposite sign of $x - 3$: just right of $3$ it is a tiny **negative** number.\n\n$$\\lim_{x \\to 3^{+}} \\frac{2x}{3 - x}$$\n\nThe numerator is about $6$, positive; the denominator is a tiny negative number. The limit is $-\\infty$.",
        "像 $3 - x$ 这样的因式在 $x = 3$ 处为 $0$，但符号与 $x - 3$ 相反：在 $3$ 右侧附近它是绝对值很小的**负数**。\n\n$$\\lim_{x \\to 3^{+}} \\frac{2x}{3 - x}$$\n\n分子约为 $6$，为正；分母是绝对值很小的负数。极限是 $-\\infty$。",
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
        return choiceProblem({
          prompt: t(`Find $${sidedLimit(p, side)} ${latex}$.`, `求 $${sidedLimit(p, side)} ${latex}$。`),
          options: limitOptions,
          correct: limitIndex(s, s),
          solution: t(
            `The numerator is about $${a * (p - r)}$. For $x$ just ${side > 0 ? "right" : "left"} of $${p}$, $${p} - x$ is a tiny ${side > 0 ? "negative" : "positive"} number${sq ? ", and its square is a tiny positive number" : ""}. So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
            `分子约为 $${a * (p - r)}$。$x$ 在 $${p}$ ${side > 0 ? "右" : "左"}侧附近时，$${p} - x$ 是绝对值很小的${side > 0 ? "负数" : "正数"}${sq ? "，它的平方是很小的正数" : ""}。所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
          ),
        });
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
  encompasses: [
    { topic: "infinite-limits-of-rational-functions", weight: 0.6 },
    { topic: "locating-holes-in-rational-functions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "factoring-before-taking-the-limit",
      title: t("Factoring before taking the limit", "先因式分解再求极限"),
      explanation: t(
        "When the denominator is expanded, factor it to see the sign of each factor:\n\n$$\\lim_{x \\to -1^{+}} \\frac{x - 5}{x^{2} - x - 2} = \\lim_{x \\to -1^{+}} \\frac{x - 5}{(x + 1)(x - 2)}$$\n\nNear $-1$: $x - 5 \\approx -6$ and $x - 2 \\approx -3$, while $x + 1$ is a tiny positive number. The fraction is $\\frac{-}{(+)(-)}$, positive: the limit is $\\infty$.",
        "分母是展开式时，先把它因式分解，再看每个因式的符号：\n\n$$\\lim_{x \\to -1^{+}} \\frac{x - 5}{x^{2} - x - 2} = \\lim_{x \\to -1^{+}} \\frac{x - 5}{(x + 1)(x - 2)}$$\n\n在 $-1$ 附近：$x - 5 \\approx -6$，$x - 2 \\approx -3$，而 $x + 1$ 是很小的正数。分式的符号是 $\\frac{-}{(+)(-)}$，为正：极限是 $\\infty$。",
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
        return choiceProblem({
          prompt: t(`Find $${sidedLimit(p, side)} ${frac(top, pl(D))}$.`, `求 $${sidedLimit(p, side)} ${frac(top, pl(D))}$。`),
          options: limitOptions,
          correct: limitIndex(s, s),
          solution: t(
            `Factor the denominator: $${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}$. Near $x = ${p}$, the numerator is about $${a * (p - r)}$ and $${front(lead)}${fac(q)}$ is about $${lead * (p - q)}$, while $${bare(p)}$ is ${sideWord(side).en}. So the fraction is ${s > 0 ? "positive" : "negative"} and huge: the limit is $${infL(s)}$.`,
            `分解分母：$${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}$。在 $x = ${p}$ 附近，分子约为 $${a * (p - r)}$，$${front(lead)}${fac(q)}$ 约为 $${lead * (p - q)}$，而 $${bare(p)}$ 是${sideWord(side)["zh-CN"]}。所以分式${s > 0 ? "为正" : "为负"}且绝对值很大：极限是 $${infL(s)}$。`,
          ),
        });
      },
    },
    {
      id: "limits-at-holes",
      title: t("Limits at holes", "空洞处的极限"),
      explanation: t(
        "At a hole the function is undefined, but its limit is an ordinary number: cancel the common factor and substitute.\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x + 2)} = \\lim_{x \\to 3} \\frac{x + 3}{x + 2} = \\frac{6}{5}$$\n\nThe limit is the $y$-coordinate of the hole.",
        "函数在空洞处无意义，但它的极限是一个普通的数：约去公因式后代入。\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x + 2)} = \\lim_{x \\to 3} \\frac{x + 3}{x + 2} = \\frac{6}{5}$$\n\n这个极限就是空洞的纵坐标。",
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
          solution: t(
            `Factor and cancel $${bare(h)}$:${steps(`${sidedLimit(h, 0)} ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}${fac(p)}`)} = ${sidedLimit(h, 0)} ${frac(prodL(simple([r]), a), bare(p))} = ${num(answer)}`)}The limit is $${num(answer)}$.`,
            `因式分解并约去 $${bare(h)}$：${steps(`${sidedLimit(h, 0)} ${frac(`${front(a)}${fac(h)}${fac(r)}`, `${fac(h)}${fac(p)}`)} = ${sidedLimit(h, 0)} ${frac(prodL(simple([r]), a), bare(p))} = ${num(answer)}`)}极限是 $${num(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "factors-left-after-cancelling",
      title: t("Factors left after cancelling", "约分后剩余的因式"),
      explanation: t(
        "When $x - a$ appears more times in the denominator than in the numerator, cancelling leaves a power of $x - a$ in the denominator, and the limit at $a$ is infinite or does not exist. The **leftover** power decides, not the original one:\n\n$$\\lim_{x \\to 2} \\frac{(x - 2)(x + 1)}{(x - 2)^{3}} = \\lim_{x \\to 2} \\frac{x + 1}{(x - 2)^{2}} = \\infty$$\n\nbecause $x + 1 \\approx 3 > 0$ and $(x - 2)^{2}$ is positive on both sides.",
        "当 $x - a$ 在分母中出现的次数多于分子时，约分后分母中还剩 $x - a$ 的某次幂，在 $a$ 处的极限是无穷或不存在。起决定作用的是**剩余**的次数，而不是原来的次数：\n\n$$\\lim_{x \\to 2} \\frac{(x - 2)(x + 1)}{(x - 2)^{3}} = \\lim_{x \\to 2} \\frac{x + 1}{(x - 2)^{2}} = \\infty$$\n\n因为 $x + 1 \\approx 3 > 0$，且 $(x - 2)^{2}$ 在两侧都为正。",
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
        return choiceProblem({
          prompt: t(
            `Find $${sidedLimit(p, 0)} ${frac(prodL(top, a), prodL(bottom))}$.`,
            `求 $${sidedLimit(p, 0)} ${frac(prodL(top, a), prodL(bottom))}$。`,
          ),
          options: limitOptions,
          correct: limitIndex(left, right),
          solution: t(
            `Cancel $${facPow(p, k)}$:${steps(`${sidedLimit(p, 0)} ${left2}`)}${j === 2 ? `The leftover square $${facPow(p, 2)}$ is positive on both sides, so both one-sided limits are $${infL(left)}$, and the limit is $${infL(left)}$.` : `The leftover factor $${bare(p)}$ changes sign at $x = ${p}$, so the one-sided limits are $${infL(left)}$ and $${infL(right)}$: the limit does not exist.`}`,
            `约去 $${facPow(p, k)}$：${steps(`${sidedLimit(p, 0)} ${left2}`)}${j === 2 ? `剩余的平方 $${facPow(p, 2)}$ 在两侧都为正，所以两个单侧极限都是 $${infL(left)}$，极限是 $${infL(left)}$。` : `剩余的因式 $${bare(p)}$ 在 $x = ${p}$ 处变号，所以两个单侧极限分别是 $${infL(left)}$ 和 $${infL(right)}$：极限不存在。`}`,
          ),
        });
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
  knowledgePoints: [
    {
      id: "domain-of-a-rational-function",
      title: t("The domain", "定义域"),
      explanation: t(
        "The domain of a rational function is every real number except the zeros of the denominator, **including** those that cancel. A hole is still a missing point.\n\n$$f(x) = \\frac{x - 1}{x^{2} + 2x - 3} = \\frac{x - 1}{(x - 1)(x + 3)}$$\n\nThe domain is $(-\\infty, -3) \\cup (-3, 1) \\cup (1, \\infty)$: $x = -3$ is a vertical asymptote and $x = 1$ is a hole.",
        "分式函数的定义域是除去分母零点之外的全体实数，**包括**能约去的零点。空洞仍是缺失的点。\n\n$$f(x) = \\frac{x - 1}{x^{2} + 2x - 3} = \\frac{x - 1}{(x - 1)(x + 3)}$$\n\n定义域是 $(-\\infty, -3) \\cup (-3, 1) \\cup (1, \\infty)$：$x = -3$ 是竖直渐近线，$x = 1$ 是空洞。",
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
          solution: t(
            `The denominator $${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}$ is $0$ at $x = ${p}$ and $x = ${q}$.${shared ? ` The factor $${bare(s)}$ cancels, but $f(${s})$ is still not defined: there is a hole.` : ""} The domain is ${setText(answer)}.`,
            `分母 $${pl(D)} = ${front(lead)}${fac(p)}${fac(q)}$ 在 $x = ${p}$ 和 $x = ${q}$ 处为 $0$。${shared ? `因式 $${bare(s)}$ 能约去，但 $f(${s})$ 仍无意义：那里是空洞。` : ""}定义域是 ${setText(answer)}。`,
          ),
        });
      },
    },
    {
      id: "range-of-a-linear-over-linear-function",
      title: t("The range of $\\frac{ax + b}{cx + d}$", "$\\frac{ax + b}{cx + d}$ 的值域"),
      explanation: t(
        "A function $f(x) = \\frac{ax + b}{cx + d}$ with $ad - bc \\neq 0$ is a transformed reciprocal function. It takes every value except its horizontal asymptote $y = \\frac{a}{c}$.\n\nTo see why, solve $y = \\frac{ax + b}{cx + d}$ for $x$: $x = \\frac{b - dy}{cy - a}$, which works for every $y$ except $y = \\frac{a}{c}$.\n\nSo the range of $\\frac{4x - 1}{2x + 3}$ is $(-\\infty, 2) \\cup (2, \\infty)$.",
        "当 $ad - bc \\neq 0$ 时，函数 $f(x) = \\frac{ax + b}{cx + d}$ 是平移伸缩后的反比例函数。它取到除水平渐近线 $y = \\frac{a}{c}$ 之外的一切值。\n\n原因：从 $y = \\frac{ax + b}{cx + d}$ 解出 $x$，得 $x = \\frac{b - dy}{cy - a}$，对除 $y = \\frac{a}{c}$ 外的每个 $y$ 都成立。\n\n所以 $\\frac{4x - 1}{2x + 3}$ 的值域是 $(-\\infty, 2) \\cup (2, \\infty)$。",
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
            solution: t(
              `The numerator and denominator have the same degree, so the horizontal asymptote is $y = ${frac(String(a), String(c))} = ${num(ha)}$. Since $ad - bc = ${a * d - b * c} \\neq 0$, $f$ takes every other value. The range is ${setText(answer)}.`,
              `分子和分母次数相同，所以水平渐近线是 $y = ${frac(String(a), String(c))} = ${num(ha)}$。因为 $ad - bc = ${a * d - b * c} \\neq 0$，$f$ 取到其余一切值。值域是 ${setText(answer)}。`,
            ),
          });
        }
      },
    },
    {
      id: "range-with-a-hole",
      title: t("The range when there is a hole", "有空洞时的值域"),
      explanation: t(
        "A hole removes one more value from the range: the $y$-coordinate of the hole, unless the graph reaches that value somewhere else. For a simplified function $\\frac{ax + b}{cx + d}$, every value except $\\frac{a}{c}$ is reached exactly once, so the hole's value is missing.\n\n$$f(x) = \\frac{(x - 1)(2x + 1)}{(x - 1)(x + 2)} = \\frac{2x + 1}{x + 2} \\quad (x \\neq 1)$$\n\nThe hole is at $(1, 1)$ and the horizontal asymptote is $y = 2$, so the range is $(-\\infty, 1) \\cup (1, 2) \\cup (2, \\infty)$.",
        "空洞会让值域再少一个值：空洞的纵坐标，除非图象在别处取到这个值。对化简后的函数 $\\frac{ax + b}{cx + d}$，除 $\\frac{a}{c}$ 外的每个值都恰好取到一次，所以空洞处的值缺失。\n\n$$f(x) = \\frac{(x - 1)(2x + 1)}{(x - 1)(x + 2)} = \\frac{2x + 1}{x + 2} \\quad (x \\neq 1)$$\n\n空洞在 $(1, 1)$，水平渐近线是 $y = 2$，所以值域是 $(-\\infty, 1) \\cup (1, 2) \\cup (2, \\infty)$。",
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
          const f = frac(`${fac(h)}(${linear(a, b)})`, `${fac(h)}${fac(-d)}`);
          return intervalProblem({
            prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
            set: answer,
            form: "interval",
            wrong: [except(ha), except(yh), except(Q.of(-d), Q.of(h)), except(ha, Q.of(h))].filter(
              (w) => intervalLatex(w) !== intervalLatex(answer),
            ),
            solution: t(
              `Cancel $${bare(h)}$: $f(x) = ${frac(linear(a, b), bare(-d))}$ for $x \\neq ${h}$. This takes every value except the horizontal asymptote $y = ${a}$, but the hole at $x = ${h}$ removes the value $${frac(linear(a, b).replace(/x/g, `(${h})`), `${h} ${sgn(d)} ${Math.abs(d)}`)} = ${num(yh)}$. The range is ${setText(answer)}.`,
              `约去 $${bare(h)}$：当 $x \\neq ${h}$ 时 $f(x) = ${frac(linear(a, b), bare(-d))}$。它取到除水平渐近线 $y = ${a}$ 外的一切值，但 $x = ${h}$ 处的空洞去掉了值 $${frac(linear(a, b).replace(/x/g, `(${h})`), `${h} ${sgn(d)} ${Math.abs(d)}`)} = ${num(yh)}$。值域是 ${setText(answer)}。`,
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
  knowledgePoints: [
    {
      id: "linear-over-linear-from-a-graph",
      title: t("A root and two asymptotes", "一个零点和两条渐近线"),
      explanation: t(
        "A graph with one vertical asymptote $x = p$, horizontal asymptote $y = a$ and $x$-intercept $(r, 0)$ belongs to\n\n$$f(x) = \\frac{a(x - r)}{x - p}$$\n\nThe root puts $x - r$ in the numerator, the vertical asymptote puts $x - p$ in the denominator, and since both have degree $1$, the horizontal asymptote is the leading coefficient $a$.",
        "若图象有一条竖直渐近线 $x = p$、水平渐近线 $y = a$ 和 $x$ 轴截点 $(r, 0)$，则它是\n\n$$f(x) = \\frac{a(x - r)}{x - p}$$\n\n的图象。零点使分子含 $x - r$，竖直渐近线使分母含 $x - p$；两者都是一次，所以水平渐近线就是首项系数 $a$。",
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
            solution: t(
              `The vertical asymptote is $x = ${p}$, so the denominator is $${bare(p)}$. The $x$-intercept is $(${r}, 0)$, so the numerator has the factor $${bare(r)}$. The horizontal asymptote $y = ${a}$ gives $a = ${a}$. So $f(x) = ${ratioLatex(a, r, p)}$.`,
              `竖直渐近线是 $x = ${p}$，所以分母是 $${bare(p)}$。$x$ 轴截点是 $(${r}, 0)$，所以分子含因式 $${bare(r)}$。水平渐近线 $y = ${a}$ 给出 $a = ${a}$。所以 $f(x) = ${ratioLatex(a, r, p)}$。`,
            ),
          }),
          figure: figureOf(d),
        };
      },
    },
    {
      id: "two-vertical-asymptotes-and-a-point",
      title: t("Two vertical asymptotes and a point", "两条竖直渐近线和一个点"),
      explanation: t(
        "A graph with vertical asymptotes $x = p$ and $x = q$, horizontal asymptote $y = 0$ and no roots belongs to\n\n$$f(x) = \\frac{k}{(x - p)(x - q)}$$\n\nTo find $k$, substitute a marked point. If the graph passes through $(0, 2)$ and the asymptotes are $x = -1$ and $x = 3$, then $2 = \\frac{k}{(1)(-3)}$, so $k = -6$.",
        "若图象有竖直渐近线 $x = p$ 和 $x = q$、水平渐近线 $y = 0$，且没有零点，则它是\n\n$$f(x) = \\frac{k}{(x - p)(x - q)}$$\n\n的图象。代入标出的点求 $k$。若图象经过 $(0, 2)$，渐近线是 $x = -1$ 和 $x = 3$，则 $2 = \\frac{k}{(1)(-3)}$，所以 $k = -6$。",
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
              solution: t(
                `The vertical asymptotes are $x = ${p}$ and $x = ${q}$, so $f(x) = ${frac("k", `${fac(p)}${fac(q)}`)}$. Substitute the point:${steps(`${y0} = ${frac("k", `(${x0} ${sgn(-p)} ${Math.abs(p)})(${x0} ${sgn(-q)} ${Math.abs(q)})`)} = ${frac("k", String((x0 - p) * (x0 - q)))}`)}So $k = ${k}$ and $f(x) = ${answer}$.`,
                `竖直渐近线是 $x = ${p}$ 和 $x = ${q}$，所以 $f(x) = ${frac("k", `${fac(p)}${fac(q)}`)}$。代入该点：${steps(`${y0} = ${frac("k", `(${x0} ${sgn(-p)} ${Math.abs(p)})(${x0} ${sgn(-q)} ${Math.abs(q)})`)} = ${frac("k", String((x0 - p) * (x0 - q)))}`)}所以 $k = ${k}$，$f(x) = ${answer}$。`,
              ),
            }),
            figure: figureOf(d),
          };
        }
      },
    },
    {
      id: "even-multiplicity-asymptotes",
      title: t("Both sides going the same way", "两侧趋向相同"),
      explanation: t(
        "Near a vertical asymptote $x = p$, the power of $x - p$ shows in the graph:\n\n- $\\frac{k}{x - p}$: the two sides go in **opposite** directions;\n- $\\frac{k}{(x - p)^{2}}$: both sides go the **same** way, up when $k > 0$ and down when $k < 0$.\n\nAdding $c$ moves the horizontal asymptote to $y = c$.",
        "在竖直渐近线 $x = p$ 附近，$x - p$ 的次数会体现在图象上：\n\n- $\\frac{k}{x - p}$：两侧趋向**相反**；\n- $\\frac{k}{(x - p)^{2}}$：两侧趋向**相同**，$k > 0$ 时都向上，$k < 0$ 时都向下。\n\n加上 $c$ 会把水平渐近线移到 $y = c$。",
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
            t(
              `The vertical asymptote is $x = ${p}$ and the horizontal asymptote is $y = ${c}$. ${square ? `Both sides go ${k > 0 ? "up" : "down"}, so the power is even and $k ${k > 0 ? ">" : "<"} 0$` : `The two sides go in opposite directions, so the power is odd; the right side goes ${k > 0 ? "up" : "down"}, so $k ${k > 0 ? ">" : "<"} 0$`}. The equation is ${write(k, p, square).en}.`,
              `竖直渐近线是 $x = ${p}$，水平渐近线是 $y = ${c}$。${square ? `两侧都${k > 0 ? "向上" : "向下"}，所以次数为偶数，且 $k ${k > 0 ? ">" : "<"} 0$` : `两侧趋向相反，所以次数为奇数；右侧${k > 0 ? "向上" : "向下"}，所以 $k ${k > 0 ? ">" : "<"} 0$`}。方程是 ${write(k, p, square).en}。`,
            ),
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
  knowledgePoints: [
    {
      id: "a-hole-and-a-root",
      title: t("A hole, a root and two asymptotes", "空洞、零点和两条渐近线"),
      explanation: t(
        "An open circle at $x = h$ means a factor $x - h$ in **both** the numerator and the denominator. Read the rest of the formula as usual: roots give numerator factors, vertical asymptotes give denominator factors, and the horizontal asymptote gives the leading coefficient.\n\nA graph with a hole at $x = 1$, vertical asymptote $x = -2$, root $x = 3$ and horizontal asymptote $y = 2$ is\n\n$$f(x) = \\frac{2(x - 3)(x - 1)}{(x + 2)(x - 1)}$$",
        "$x = h$ 处的空心圆圈表示分子和分母**都**含有因式 $x - h$。其余部分照常读出：零点给出分子的因式，竖直渐近线给出分母的因式，水平渐近线给出首项系数。\n\n空洞在 $x = 1$、竖直渐近线为 $x = -2$、零点为 $x = 3$、水平渐近线为 $y = 2$ 的图象是\n\n$$f(x) = \\frac{2(x - 3)(x - 1)}{(x + 2)(x - 1)}$$",
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
              t(
                `The hole at $x = ${h}$ puts $${bare(h)}$ in the numerator and the denominator. The vertical asymptote $x = ${p}$ gives $${bare(p)}$ in the denominator, the root $x = ${r}$ gives $${bare(r)}$ in the numerator, and the horizontal asymptote is $y = ${a}$. The equation is ${write(a, r, p, h).en}.`,
                `$x = ${h}$ 处的空洞使分子和分母都含 $${bare(h)}$。竖直渐近线 $x = ${p}$ 使分母含 $${bare(p)}$，零点 $x = ${r}$ 使分子含 $${bare(r)}$，水平渐近线是 $y = ${a}$。方程是 ${write(a, r, p, h).en}。`,
              ),
            ),
            figure: figureOf(d),
          };
        }
      },
    },
    {
      id: "reading-k-from-a-hole",
      title: t("Reading the constant from the hole", "由空洞求常数"),
      explanation: t(
        "The coordinates of a hole can fix an unknown constant. For $f(x) = \\frac{k(x - h)}{(x - p)(x - h)}$, the simplified function is $\\frac{k}{x - p}$, and the hole lies on it.\n\nIf the vertical asymptote is $x = 1$ and the hole is at $(3, -2)$, then $-2 = \\frac{k}{3 - 1}$, so $k = -4$ and\n\n$$f(x) = \\frac{-4(x - 3)}{(x - 1)(x - 3)}$$",
        "空洞的坐标可以确定未知常数。对 $f(x) = \\frac{k(x - h)}{(x - p)(x - h)}$，化简后的函数是 $\\frac{k}{x - p}$，空洞在它的图象上。\n\n若竖直渐近线是 $x = 1$，空洞在 $(3, -2)$，则 $-2 = \\frac{k}{3 - 1}$，所以 $k = -4$，\n\n$$f(x) = \\frac{-4(x - 3)}{(x - 1)(x - 3)}$$",
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
              t(
                `The hole at $x = ${h}$ puts $${bare(h)}$ in the numerator and the denominator, and the vertical asymptote gives $${bare(p)}$. The hole lies on $y = ${frac("k", bare(p))}$:${steps(`${yh} = ${frac("k", `${h} ${sgn(-p)} ${Math.abs(p)}`)}, \\quad k = ${k}`)}The equation is ${right.en}.`,
                `$x = ${h}$ 处的空洞使分子和分母都含 $${bare(h)}$，竖直渐近线给出 $${bare(p)}$。空洞在 $y = ${frac("k", bare(p))}$ 上：${steps(`${yh} = ${frac("k", `${h} ${sgn(-p)} ${Math.abs(p)}`)}, \\quad k = ${k}`)}方程是 ${right.en}。`,
              ),
            ),
            figure: figureOf(d),
          };
        }
      },
    },
  ],
};

// ─── 2.5.11 Identifying the graph of a rational function ───────────────────

/** pick4 shuffles four drawings with the correct one first, returning the figure and the correct letter. */
function pick4(rng: Rng, ds: readonly [Drawing, Drawing, Drawing, Drawing]): [Figure, number] {
  const order = rng.shuffle([0, 1, 2, 3]);
  return [panels(order.map((i) => ds[i]!)), order.indexOf(0)];
}

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
  encompasses: [
    { topic: "identifying-a-rational-function-from-a-graph", weight: 0.4 },
    { topic: "infinite-limits-of-rational-functions", weight: 0.3 },
    { topic: "end-behavior-of-rational-functions", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "matching-linear-over-linear-graphs",
      title: t("Matching by asymptotes and intercepts", "由渐近线和截距对应"),
      explanation: t(
        "To match $f(x) = \\frac{a(x - r)}{x - p}$ with its graph, check in turn:\n\n1. the vertical asymptote $x = p$;\n2. the horizontal asymptote $y = a$;\n3. the $x$-intercept $(r, 0)$.\n\nGraphs that differ in only one of these can still be told apart by that one feature.",
        "要把 $f(x) = \\frac{a(x - r)}{x - p}$ 与它的图象对应，依次检查：\n\n1. 竖直渐近线 $x = p$；\n2. 水平渐近线 $y = a$；\n3. $x$ 轴截点 $(r, 0)$。\n\n只在其中一项上不同的图象，也能凭这一项区分。",
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
          const [figure, correct] = pick4(rng, [draw(a, r, p), draw(-a, r, p), draw(a, p, r), draw(a, r, -p)]);
          return {
            ...choiceProblem({
              prompt: t(
                `Which graph is the graph of $f(x) = ${ratioLatex(a, r, p)}$? Asymptotes are dashed and $x$-intercepts are marked.`,
                `哪个是 $f(x) = ${ratioLatex(a, r, p)}$ 的图象？渐近线画成虚线，并标出了 $x$ 轴截点。`,
              ),
              options: letterOptions,
              correct,
              solution: t(
                `The graph needs the vertical asymptote $x = ${p}$, the horizontal asymptote $y = ${a}$ and the $x$-intercept $(${r}, 0)$. Only graph ${letters[correct]} has all three.`,
                `图象应有竖直渐近线 $x = ${p}$、水平渐近线 $y = ${a}$ 和 $x$ 轴截点 $(${r}, 0)$。只有图象 ${letters[correct]} 三者都具备。`,
              ),
            }),
            figure,
          };
        }
      },
    },
    {
      id: "sign-charts",
      title: t("Sign charts", "符号表"),
      explanation: t(
        "A rational function can change sign only at its zeros and vertical asymptotes. Mark them on the number line and test one point in each interval: this is a **sign chart**, and it tells where the graph is above or below the $x$-axis.\n\n$$f(x) = \\frac{x - 2}{(x + 1)(x - 4)}$$\n\nThe critical points are $-1, 2, 4$. Testing $x = -2, 0, 3, 5$ gives the signs $-, +, -, +$, so $f(x) > 0$ on $(-1, 2) \\cup (4, \\infty)$.",
        "分式函数只可能在零点和竖直渐近线处变号。把它们标在数轴上，并在每个区间里检验一个点，这就是**符号表**，它说明图象在 $x$ 轴上方还是下方。\n\n$$f(x) = \\frac{x - 2}{(x + 1)(x - 4)}$$\n\n临界点是 $-1, 2, 4$。检验 $x = -2, 0, 3, 5$ 得符号 $-, +, -, +$，所以 $f(x) > 0$ 的解集是 $(-1, 2) \\cup (4, \\infty)$。",
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
          solution: t(
            `The critical points are ${listText([...crit].sort((u, v) => u - v))}. Testing a point in each interval gives${steps(signChart(f, crit))}So $f(x) ${op} 0$ on ${setText(answer)}.`,
            `临界点是 ${listText(
              [...crit].sort((u, v) => u - v),
              "、",
            )}。在每个区间里检验一个点，得${steps(signChart(f, crit))}所以 $f(x) ${op} 0$ 的解集是 ${setText(answer)}。`,
          ),
        });
      },
    },
    {
      id: "matching-graphs-with-two-vertical-asymptotes",
      title: t("Graphs with two vertical asymptotes", "有两条竖直渐近线的图象"),
      explanation: t(
        "For $f(x) = \\frac{k}{(x - p)(x - q)}$, the horizontal asymptote is $y = 0$ and there are no roots. The sign of $k$ decides the middle piece: between $p$ and $q$ the denominator is negative, so the middle piece is below the $x$-axis when $k > 0$ and above it when $k < 0$. The outer pieces have the opposite sign.\n\nCompare also with $\\frac{kx}{(x - p)(x - q)}$, which has a root at $x = 0$.",
        "对 $f(x) = \\frac{k}{(x - p)(x - q)}$，水平渐近线是 $y = 0$，没有零点。$k$ 的符号决定中间那一段：在 $p$ 与 $q$ 之间分母为负，所以 $k > 0$ 时中间一段在 $x$ 轴下方，$k < 0$ 时在上方。两侧的分支符号与之相反。\n\n再与 $\\frac{kx}{(x - p)(x - q)}$ 比较：它在 $x = 0$ 处有零点。",
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
          const [figure, correct] = pick4(rng, [draw(k, p, q, false), draw(-k, p, q, false), draw(k, -p, -q, false), draw(k, p, q, true)]);
          const latex = frac(String(k), `${fac(p)}${fac(q)}`);
          return {
            ...choiceProblem({
              prompt: t(
                `Which graph is the graph of $f(x) = ${latex}$? Asymptotes are dashed.`,
                `哪个是 $f(x) = ${latex}$ 的图象？渐近线画成虚线。`,
              ),
              options: letterOptions,
              correct,
              solution: t(
                `The vertical asymptotes are $x = ${p}$ and $x = ${q}$, and there is no root. Between them the denominator is negative and $k = ${k}$ is ${k > 0 ? "positive" : "negative"}, so the middle piece is ${k > 0 ? "below" : "above"} the $x$-axis. That is graph ${letters[correct]}.`,
                `竖直渐近线是 $x = ${p}$ 和 $x = ${q}$，没有零点。在两者之间分母为负，而 $k = ${k}$ ${k > 0 ? "为正" : "为负"}，所以中间一段在 $x$ 轴${k > 0 ? "下方" : "上方"}。这是图象 ${letters[correct]}。`,
              ),
            }),
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
