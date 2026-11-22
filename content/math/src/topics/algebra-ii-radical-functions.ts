import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  gcd,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  plane,
  poly,
  Q,
  type RealSet,
  radical,
  realLine,
  union,
} from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { annotate, at, onAxis, setText as setAlt, shift } from "../graph-figures.ts";
import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  radicalProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** label is the bold label of step i in both locales, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** said is a closing check paragraph in both locales. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

/** both is the same displayed work after an English and a Chinese lead-in. */
const both = (en: string, zh: string, ...lines: readonly string[]) => {
  const work = steps(...lines).trimEnd();
  return t(`${en}${work}`, `${zh}${work}`);
};

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** plus writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
function plus(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** front writes a coefficient in front of a factor: "", "-", "2", "\frac{1}{2}". */
function front(a: Coefficient): string {
  const v = toQ(a);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return v.toLatex();
}

/** pt writes an ordered pair: "(3, -\frac{1}{2})". */
const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** shifted writes x - h: "x - 3", "x + 2", "x". */
const shifted = (h: Coefficient) => linear(1, toQ(h).neg());

/** flipped writes h - x: "3 - x", "-2 - x", "-x". */
const flipped = (h: Coefficient) => poly([h, ""], [-1, "x"]);

/** squared writes (x - h)^2, or x^2 when h is 0. */
const squared = (h: Coefficient, power = 2) => (toQ(h).isZero() ? `x^{${power}}` : `(${shifted(h)})^{${power}}`);

/** root writes the nth root of inner. */
const root = (n: number, inner: string) => (n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`);

/** rootFn writes a·ⁿ√(inner) + k. */
const rootFn = (a: Coefficient, inner: string, k: Coefficient = 0, n = 2) => `${front(a)}${root(n, inner)}${plus(k)}`;

const sortQ = (xs: readonly Q[]) => [...xs].sort((p, q) => p.cmp(q));
const dedupe = (xs: readonly Q[]) => xs.filter((x, i) => xs.findIndex((y) => y.eq(x)) === i);
/** sols writes a set of solutions in increasing order, each once. */
const sols = (xs: readonly Coefficient[]) => sortQ(dedupe(xs.map(toQ))).map((x) => x.toLatex());

const listSolutions = t(
  "Enter all solutions separated by commas, or type none if there are none.",
  "请用逗号分隔写出所有解；如果无解，请输入 none。",
);

/** solve asks to solve an equation and list its solutions. */
const solve = (eq: string) => t(`Solve $${eq}$. ${listSolutions.en}`, `解方程 $${eq}$。${listSolutions["zh-CN"]}`);

/** shuffled builds a choice problem from options whose first is correct, dropping repeated options. */
function shuffled(rng: Rng, prompt: Text, options: readonly Text[], solution: Text): Problem {
  const distinct = options.filter((o, i) => options.findIndex((p) => p.en === o.en) === i).slice(0, 5);
  const order = rng.shuffle(range(0, distinct.length - 1));
  return choiceProblem({ prompt, options: order.map((i) => distinct[i]!), correct: order.indexOf(0), solution });
}

/** units writes "$3$ units" or "$1$ unit". */
const units = (n: number) => `$${Math.abs(n)}$ unit${Math.abs(n) === 1 ? "" : "s"}`;

// Intervals.

/** iv is the interval between lo and hi (infinite when undefined), closed at the ends as given. */
function iv(lo: Coefficient | undefined, hi: Coefficient | undefined, loClosed = true, hiClosed = true): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined && loClosed,
    hiClosed: hi !== undefined && hiClosed,
  };
}

/** atLeast is [v, ∞), or (v, ∞) when open. */
const atLeast = (v: Coefficient, closed = true): RealSet => union(iv(v, undefined, closed));

/** atMost is (−∞, v], or (−∞, v) when open. */
const atMost = (v: Coefficient, closed = true): RealSet => union(iv(undefined, v, true, closed));

/** between is the closed interval between two numbers, in either order. */
const between = (x: Coefficient, y: Coefficient): RealSet => {
  const [p, q] = sortQ([toQ(x), toQ(y)]);
  return union(iv(p, q));
};

/** ray is [v, ∞) when up and (−∞, v] otherwise. */
const ray = (up: boolean, v: Coefficient, closed = true) => (up ? atLeast(v, closed) : atMost(v, closed));

const setText = (set: RealSet) => `$${intervalLatex(set)}$`;

const asInterval = t("Write the answer in interval notation.", "用区间记号写出答案。");

// Graphs.

const view: PlaneView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** SqrtGraph is y = a·√(s(x − h)) + k: s = 1 opens to the right, s = −1 to the left. */
interface SqrtGraph {
  readonly a: number;
  readonly s: 1 | -1;
  readonly h: number;
  readonly k: number;
}

/** sqrtInner writes x − h for s = 1 and h − x for s = −1. */
const sqrtInner = (s: number, h: Coefficient) => (s > 0 ? shifted(h) : flipped(h));

const sqrtLatex = (g: SqrtGraph) => rootFn(g.a, sqrtInner(g.s, g.h), g.k);

/** sqrtPoints are the endpoint of a square-root graph and the points 1 and 4 units from it horizontally. */
const sqrtPoints = (g: SqrtGraph): Point[] => [
  [g.h, g.k],
  [g.h + g.s, g.k + g.a],
  [g.h + 4 * g.s, g.k + 2 * g.a],
];

/** fits tells whether every point lies in the square [-m, m]². */
const fits = (pts: readonly Point[], m = 7) => pts.every(([x, y]) => Math.abs(x) <= m && Math.abs(y) <= m);

const pointText = ([x, y]: Point) => `(${x}, ${y})`;

/** sqrtFigure draws y = a·√(s(x − h)) + k with dots at its endpoint and two more lattice points. */
function sqrtFigure(g: SqrtGraph): Figure {
  const f = (x: number) => g.a * Math.sqrt(g.s * (x - g.h)) + g.k;
  const curve: PlaneMark = g.s > 0 ? { kind: "curve", f, from: g.h, accent: true } : { kind: "curve", f, to: g.h, accent: true };
  const pts = sqrtPoints(g);
  const [p0, p1, p2] = pts.map(pointText);
  return {
    svg: plane(view, [curve, ...pts.map((at): PlaneMark => ({ kind: "point", at, accent: true }))]),
    alt: t(
      `A curve that starts at ${p0} and extends to the ${g.s > 0 ? "right" : "left"}, ${g.a > 0 ? "rising" : "falling"} ever more slowly, through ${p1} and ${p2}. Dots mark the three points.`,
      `一条从 ${p0} 出发、向${g.s > 0 ? "右" : "左"}延伸的曲线，${g.a > 0 ? "上升" : "下降"}得越来越慢，经过 ${p1} 和 ${p2}。图中用圆点标出了这三个点。`,
    ),
  };
}

/** randomSqrtGraph draws a square-root graph whose marked points fit in the view. */
function randomSqrtGraph(rng: Rng, as: readonly number[] = [1, -1, 2, -2]): SqrtGraph {
  for (;;) {
    const g: SqrtGraph = { a: rng.pick(as), s: rng.sign(), h: rng.int(-6, 6), k: rng.int(-6, 6) };
    if (fits(sqrtPoints(g))) return g;
  }
}

/** cbrtFigure draws y = a·∛(x − h) + k with dots at its center and one unit on either side. */
function cbrtFigure(a: number, h: number, k: number): Figure {
  const pts: Point[] = [
    [h - 1, k - a],
    [h, k],
    [h + 1, k + a],
  ];
  const [p0, p1, p2] = pts.map(pointText);
  return {
    svg: plane(view, [
      { kind: "curve", f: (x) => a * Math.cbrt(x - h) + k, accent: true },
      ...pts.map((at): PlaneMark => ({ kind: "point", at, accent: true })),
    ]),
    alt: t(
      `An S-shaped curve, ${a > 0 ? "rising" : "falling"} from left to right, that is steepest at its center ${p1} and passes through ${p0} and ${p2}. Dots mark the three points.`,
      `一条 S 形曲线，从左到右${a > 0 ? "上升" : "下降"}，在中心 ${p1} 处最陡，并经过 ${p0} 和 ${p2}。图中用圆点标出了这三个点。`,
    ),
  };
}

// 6.20.1 Simplifying square root expressions using polynomial factorization.

/** anyReal asks to simplify an expression in x for every real x. */
const anyReal = (expr: string) => t(`Simplify $${expr}$, where $x$ can be any real number.`, `化简 $${expr}$，其中 $x$ 可以取任意实数。`);

/** trinomial writes c(x + b)² expanded, for a binomial px + b: p²c x² + 2pbc x + b²c. */
const trinomial = (p: number, b: number, c = 1) => poly([c * p * p, "x^{2}"], [2 * c * p * b, "x"], [c * b * b, ""]);

/** simplifyingSquareRootExpressionsUsingPolynomialFactorization takes square roots of polynomials by factoring out squares. */
export const simplifyingSquareRootExpressionsUsingPolynomialFactorization: TopicDef = {
  id: "simplifying-square-root-expressions-using-polynomial-factorization",
  title: t("Simplifying Square Root Expressions Using Polynomial Factorization", "用因式分解化简平方根式"),
  summary: t(
    "Factor the polynomial under a square root to find squared factors, and take them out as absolute values.",
    "把平方根下的多项式因式分解找出平方因式，再把它们以绝对值的形式移到根号外。",
  ),
  prerequisites: [
    "square-roots-with-domain-restrictions",
    "simplifying-square-roots-with-variables",
    "factoring-perfect-square-trinomials-with-leading-coefficients",
  ],
  encompasses: [
    { topic: "square-roots-with-domain-restrictions", weight: 0.5 },
    { topic: "factoring-perfect-square-trinomials-with-leading-coefficients", weight: 0.4 },
    { topic: "simplifying-square-roots-with-variables", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.A.2", "CCSS.HSN.RN.A.2"],
  intro: t(
    `You know two facts that work together here. A perfect-square trinomial factors as a square, such as $x^{2} + 10x + 25 = (x + 5)^{2}$, and the square root of a square is an absolute value, $\\sqrt{u^{2}} = |u|$. Putting them together turns a root of a long polynomial into a short expression without a root, which makes it easier to evaluate, to graph and to solve equations with.

Take $\\sqrt{x^{2} + 10x + 25}$. Factor first, then take the root:

$$\\sqrt{x^{2} + 10x + 25} = \\sqrt{(x + 5)^{2}} = |x + 5|.$$

The absolute value matters. At $x = -7$ the original root is $\\sqrt{49 - 70 + 25} = \\sqrt{4} = 2$, and $|x + 5| = |-2| = 2$ agrees, while $x + 5$ alone would give $-2$.`,
    `这里要把两个已知的事实结合起来。完全平方三项式可以分解成平方，例如 $x^{2} + 10x + 25 = (x + 5)^{2}$；而平方的平方根是绝对值，$\\sqrt{u^{2}} = |u|$。两者结合，就能把一个长多项式的平方根化成不含根号的简短式子，求值、作图和解方程都更方便。

以 $\\sqrt{x^{2} + 10x + 25}$ 为例。先因式分解，再开平方：

$$\\sqrt{x^{2} + 10x + 25} = \\sqrt{(x + 5)^{2}} = |x + 5|.$$

绝对值不能少。当 $x = -7$ 时，原式为 $\\sqrt{49 - 70 + 25} = \\sqrt{4} = 2$，$|x + 5| = |-2| = 2$ 与之相等，而只写 $x + 5$ 会得到 $-2$。`,
  ),
  knowledgePoints: [
    {
      id: "perfect-square-trinomials-under-a-root",
      title: t("Perfect-square trinomials", "完全平方三项式"),
      explanation: t(
        "A perfect-square trinomial is the square of a binomial, and $\\sqrt{u^{2}} = |u|$ for any expression $u$:\n\n$$\\sqrt{4x^{2} - 12x + 9} = \\sqrt{(2x - 3)^{2}} = |2x - 3|$$\n\nThe absolute value is needed because $2x - 3$ is negative for some $x$, while a square root never is. If all three terms share a perfect-square factor, take it out first:\n\n$$\\sqrt{16x^{2} + 48x + 36} = \\sqrt{4(4x^{2} + 12x + 9)} = \\sqrt{4(2x + 3)^{2}} = 2|2x + 3|$$\n\n> **Watch out.** $\\sqrt{(x - 5)^{2}}$ is $|x - 5|$, not $x - 5$. At $x = 2$ it is $3$, while $x - 5$ is $-3$.",
        "完全平方三项式是二项式的平方，而对任何式子 $u$ 都有 $\\sqrt{u^{2}} = |u|$：\n\n$$\\sqrt{4x^{2} - 12x + 9} = \\sqrt{(2x - 3)^{2}} = |2x - 3|$$\n\n需要绝对值，是因为 $2x - 3$ 对某些 $x$ 是负数，而平方根永远不是负数。如果三项有公共的完全平方因数，先把它提出来：\n\n$$\\sqrt{16x^{2} + 48x + 36} = \\sqrt{4(4x^{2} + 12x + 9)} = \\sqrt{4(2x + 3)^{2}} = 2|2x + 3|$$\n\n> **注意。** $\\sqrt{(x - 5)^{2}}$ 是 $|x - 5|$，不是 $x - 5$。当 $x = 2$ 时它等于 $3$，而 $x - 5$ 等于 $-3$。",
      ),
      keyPrerequisites: ["factoring-perfect-square-trinomials-with-leading-coefficients"],
      generate(rng) {
        const k = rng.pick([1, 1, 1, 2, 3]);
        const p = k === 1 ? rng.int(2, 5) : rng.int(1, 2);
        let b: number;
        do b = rng.nonZero(-9, 9);
        while (gcd(p, Math.abs(b)) !== 1);
        const inside = trinomial(p, b, k * k);
        const lin = linear(p, b);
        const answer = `${front(k)}|${lin}|`;
        const factored = k === 1 ? `(${lin})^{2}` : `${k * k}(${lin})^{2}`;
        const at0 = k * Math.abs(b);
        return expressionProblem({
          prompt: anyReal(`\\sqrt{${inside}}`),
          answer,
          radical: true,
          wrong: [linear(k * p, k * b), linear(-k * p, -k * b), `${front(k)}|${linear(p, -b)}|`, ...(k > 1 ? [`${k * k}|${lin}|`] : [])],
          solution: join(
            label(1, "Factor the radicand", "分解被开方式"),
            k === 1
              ? both("The trinomial is the square of a binomial:", "这个三项式是一个二项式的平方：", `${inside} = (${lin})^{2}`)
              : both(
                  `All three terms share the factor $${k * k}$. Take it out, and what is left is a perfect square:`,
                  `三项有公因数 $${k * k}$。提出它，剩下的是完全平方式：`,
                  `${inside} = ${k * k}(${trinomial(p, b)}) = ${factored}`,
                ),
            para,
            label(2, "Take the square root", "开平方"),
            both(
              `Use $\\sqrt{u^{2}} = |u|$${k === 1 ? "" : ` and $\\sqrt{${k * k}} = ${k}$`}:`,
              `利用 $\\sqrt{u^{2}} = |u|$${k === 1 ? "" : `和 $\\sqrt{${k * k}} = ${k}$`}：`,
              `\\sqrt{${factored}} = ${answer}`,
            ),
            t(
              `\n\nThe binomial $${lin}$ is negative for some $x$, while a square root never is. So the absolute value stays.`,
              `\n\n二项式 $${lin}$ 对某些 $x$ 是负数，而平方根永远不是负数，所以要保留绝对值。`,
            ),
            said(
              `At $x = 0$ the radicand is $${k * k * b * b}$, so the expression is $\\sqrt{${k * k * b * b}} = ${at0}$. The answer gives $${k === 1 ? "" : `${k} \\cdot `}|${b}| = ${at0}$ as well.`,
              `当 $x = 0$ 时被开方式为 $${k * k * b * b}$，原式等于 $\\sqrt{${k * k * b * b}} = ${at0}$。答案给出 $${k === 1 ? "" : `${k} \\cdot `}|${b}| = ${at0}$，两者相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "common-factors-that-are-not-squares",
      title: t("Common factors that are not squares", "不是平方数的公因数"),
      explanation: t(
        "When the common factor is not a perfect square, it stays under the root after the squared binomial comes out. Split it into its largest square factor and the rest:\n\n$$\\sqrt{12x^{2} - 24x + 12} = \\sqrt{12(x - 1)^{2}} = \\sqrt{4 \\cdot 3 \\cdot (x - 1)^{2}} = 2|x - 1|\\sqrt{3}$$\n\n> **Watch out.** Only the square part of the factor comes out. In $\\sqrt{18(x + 2)^{2}}$ the $9$ comes out as $3$ and the $2$ stays under the root: $3|x + 2|\\sqrt{2}$.",
        "当公因数不是完全平方数时，平方的二项式移到根号外后，它的一部分留在根号内。把它分成最大的平方因数和剩余部分：\n\n$$\\sqrt{12x^{2} - 24x + 12} = \\sqrt{12(x - 1)^{2}} = \\sqrt{4 \\cdot 3 \\cdot (x - 1)^{2}} = 2|x - 1|\\sqrt{3}$$\n\n> **注意。** 只有因数中的平方部分能移出根号。在 $\\sqrt{18(x + 2)^{2}}$ 中，$9$ 作为 $3$ 移出，$2$ 留在根号内：$3|x + 2|\\sqrt{2}$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3, 5, 6, 7]);
        const k = rng.pick([1, 1, 2, 3]);
        const b = rng.nonZero(-8, 8);
        const c = m * k * k;
        const inside = trinomial(1, b, c);
        const lin = linear(1, b);
        const answer = `${front(k)}|${lin}|\\sqrt{${m}}`;
        const split = k === 1 ? "" : ` = \\sqrt{${k * k} \\cdot ${m} \\cdot (${lin})^{2}}`;
        return expressionProblem({
          prompt: anyReal(`\\sqrt{${inside}}`),
          answer,
          radical: true,
          wrong: [
            `${front(k)}(${lin})\\sqrt{${m}}`,
            `|${lin}|\\sqrt{${c}}`,
            `${front(k)}|${linear(1, -b)}|\\sqrt{${m}}`,
            `${front(m * k)}|${lin}|`,
            ...(k > 1 ? [`${k * k}|${lin}|\\sqrt{${m}}`] : []),
          ],
          solution: join(
            label(1, "Factor the radicand", "分解被开方式"),
            both(
              `All three terms share the factor $${c}$. Take it out and factor the perfect square that is left:`,
              `三项有公因数 $${c}$。提出它，再分解剩下的完全平方式：`,
              `${inside} = ${c}(${trinomial(1, b)}) = ${c}(${lin})^{2}`,
            ),
            para,
            label(2, "Take out the squares", "把平方因式移到根号外"),
            both(
              `${k === 1 ? `The number $${c}$ has no square factor, so it stays under the root.` : `Split $${c}$ into the square $${k * k}$ and the rest, $${m}$.`} The square $(${lin})^{2}$ comes out as $|${lin}|$:`,
              `${k === 1 ? `$${c}$ 没有平方因数，所以留在根号内。` : `把 $${c}$ 分成平方数 $${k * k}$ 和剩余的 $${m}$。`}平方 $(${lin})^{2}$ 移出后成为 $|${lin}|$：`,
              `\\sqrt{${c}(${lin})^{2}}${split} = ${answer}`,
            ),
            said(
              `At $x = 0$ the radicand is $${c * b * b} = ${(k * Math.abs(b)) ** 2} \\cdot ${m}$, so the expression is $${k * Math.abs(b) === 1 ? "" : k * Math.abs(b)}\\sqrt{${m}}$. The answer gives $${front(k)}|${b}|\\sqrt{${m}}$, the same number.`,
              `当 $x = 0$ 时被开方式为 $${c * b * b} = ${(k * Math.abs(b)) ** 2} \\cdot ${m}$，所以原式等于 $${k * Math.abs(b) === 1 ? "" : k * Math.abs(b)}\\sqrt{${m}}$。答案给出 $${front(k)}|${b}|\\sqrt{${m}}$，是同一个数。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-common-factor-of-x",
      title: t("A common factor of $x$", "公因式 $x$"),
      explanation: t(
        "A common factor can contain $x$. Factor it out, then factor the perfect square that is left:\n\n$$\\sqrt{x^{3} - 6x^{2} + 9x} = \\sqrt{x(x^{2} - 6x + 9)} = \\sqrt{x(x - 3)^{2}} = |x - 3|\\sqrt{x}$$\n\nThe expression is defined only for $x \\ge 0$, but $x - 3$ is still negative for $0 \\le x < 3$, so the absolute value stays.\n\n> **Watch out.** The factor $x$ is not a square, so it stays under the root as $\\sqrt{x}$. Only the squared binomial comes out.",
        "公因式可以含有 $x$。先提出它，再分解剩下的完全平方式：\n\n$$\\sqrt{x^{3} - 6x^{2} + 9x} = \\sqrt{x(x^{2} - 6x + 9)} = \\sqrt{x(x - 3)^{2}} = |x - 3|\\sqrt{x}$$\n\n这个式子只在 $x \\ge 0$ 时有意义，但当 $0 \\le x < 3$ 时 $x - 3$ 仍是负数，所以要保留绝对值。\n\n> **注意。** 因数 $x$ 不是平方，所以它以 $\\sqrt{x}$ 的形式留在根号内。只有平方的二项式能移出根号。",
      ),
      generate(rng) {
        const b = rng.int(1, 8);
        const m = rng.pick([1, 1, 4, 9, 2, 3, 5]);
        const r = m === 4 ? 2 : m === 9 ? 3 : 1;
        const rest = r > 1 || m === 1 ? "x" : `${m}x`;
        const inside = poly([m, "x^{3}"], [-2 * m * b, "x^{2}"], [m * b * b, "x"]);
        const lin = linear(1, -b);
        const answer = `${front(r)}|${lin}|\\sqrt{${rest}}`;
        const gcf = `${front(m)}x`;
        return expressionProblem({
          prompt: t(`Simplify $\\sqrt{${inside}}$.`, `化简 $\\sqrt{${inside}}$。`),
          answer,
          radical: true,
          wrong: [
            `${front(r)}(${lin})\\sqrt{${rest}}`,
            `${front(r)}|${linear(1, b)}|\\sqrt{${rest}}`,
            `${front(r)}x\\sqrt{${lin}}`,
            ...(r > 1 ? [`|${lin}|\\sqrt{${m}x}`] : []),
          ],
          solution: join(
            label(1, "Factor the radicand", "分解被开方式"),
            both(
              `Every term contains $${gcf}$. Factor it out, then factor the perfect square that is left:`,
              `每一项都含有 $${gcf}$。提出它，再分解剩下的完全平方式：`,
              `${inside} = ${gcf}(${trinomial(1, -b)}) = ${gcf}(${lin})^{2}`,
            ),
            para,
            label(2, "Take out the square", "把平方因式移到根号外"),
            both(
              `The square $(${lin})^{2}$${r > 1 ? ` and the square $${m}$` : ""} come${r > 1 ? "" : "s"} out of the root:`,
              `平方 $(${lin})^{2}$${r > 1 ? `和平方数 $${m}$` : ""}移到根号外：`,
              `\\sqrt{${gcf}(${lin})^{2}} = ${answer}`,
            ),
            t(
              `\n\nThe expression is defined only for $x \\ge 0$. For $0 \\le x < ${b}$ the binomial $${lin}$ is negative, so the absolute value stays.`,
              `\n\n原式只在 $x \\ge 0$ 时有意义。当 $0 \\le x < ${b}$ 时，二项式 $${lin}$ 是负数，所以要保留绝对值。`,
            ),
            said(
              `At $x = 1$ the radicand is $${m} \\cdot ${paren(1 - b)}^{2} = ${m * (1 - b) ** 2}$. The answer gives $${front(r)}|${1 - b}|\\sqrt{${r > 1 || m === 1 ? 1 : m}}$, whose square is also $${m * (1 - b) ** 2}$.`,
              `当 $x = 1$ 时被开方式为 $${m} \\cdot ${paren(1 - b)}^{2} = ${m * (1 - b) ** 2}$。答案给出 $${front(r)}|${1 - b}|\\sqrt{${r > 1 || m === 1 ? 1 : m}}$，它的平方也是 $${m * (1 - b) ** 2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// 6.20.2 Solving advanced radical equations.

/** RootLine is √(ax + b) = mx + c, built so that squaring gives m²(x − r1)(x − r2) = 0. */
interface RootLine {
  readonly a: number;
  readonly b: number;
  readonly m: number;
  readonly c: number;
  readonly r1: number;
  readonly r2: number;
}

/** randomRootLine draws √(ax + b) = mx + c whose squared equation has the distinct integer roots r1 and r2. */
function randomRootLine(rng: Rng, valid?: (count: number) => boolean): RootLine {
  for (;;) {
    const m = rng.pick([1, 1, 1, 2, -1]);
    const r1 = rng.int(-8, 8);
    const r2 = rng.int(-8, 8);
    const c = rng.int(-6, 6);
    if (r1 === r2) continue;
    const a = 2 * m * c + m * m * (r1 + r2);
    const b = c * c - m * m * r1 * r2;
    if (a === 0 || Math.abs(a) > 30 || Math.abs(b) > 80) continue;
    const g: RootLine = { a, b, m, c, r1: Math.min(r1, r2), r2: Math.max(r1, r2) };
    const count = validRoots(g).length;
    if (valid ? valid(count) : count > 0 || rng.bool(0.3)) return g;
  }
}

/** validRoots are the roots of the squared equation that make mx + c nonnegative. */
const validRoots = (g: RootLine) => [g.r1, g.r2].filter((r) => g.m * r + g.c >= 0);

const rootLineLeft = (g: RootLine) => `\\sqrt{${linear(g.a, g.b)}}`;

/**
 * rootLineWork squares √(ax + b) = mx + c, solves the quadratic and checks each root, numbering its two steps from start. The
 * conclusion, by default the solution set, comes before a check that substitutes both roots into the unsquared equation.
 */
function rootLineWork(g: RootLine, start = 1, conclusion?: Text): Text {
  const { a, b, m, c, r1, r2 } = g;
  const factor = `${m * m === 1 ? "" : m * m}(${linear(1, -r1)})(${linear(1, -r2)}) = 0`;
  const right = linear(m, c);
  const verdict = (r: number) => {
    const v = m * r + c;
    return v >= 0
      ? t(`At $x = ${r}$ the right side is $${v}$, which is not negative: a solution.`, `当 $x = ${r}$ 时右边等于 $${v}$，不是负数：是解。`)
      : t(
          `At $x = ${r}$ the right side is $${v}$, but a square root is never negative: extraneous.`,
          `当 $x = ${r}$ 时右边等于 $${v}$，但平方根不可能是负数：是增根。`,
        );
  };
  const substituted = (r: number) => {
    const v = m * r + c;
    return t(
      `At $x = ${r}$ the left side is $\\sqrt{${a * r + b}} = ${Math.abs(v)}$ and the right side is $${v}$, so they ${v >= 0 ? "agree" : "differ"}.`,
      `当 $x = ${r}$ 时左边是 $\\sqrt{${a * r + b}} = ${Math.abs(v)}$，右边是 $${v}$，两者${v >= 0 ? "相等" : "不相等"}。`,
    );
  };
  const valid = validRoots(g);
  const set = sols(valid);
  const conclude =
    conclusion ??
    (valid.length === 0
      ? t("Neither root passes, so the equation has no solution.", "两个根都不满足，所以方程无解。")
      : t(
          `So the solution${valid.length === 1 ? " is" : "s are"} $x = ${set.join("$ and $x = ")}$.`,
          `所以方程的解是 $x = ${set.join("$ 和 $x = ")}$。`,
        ));
  const [c1, c2] = [verdict(r1), verdict(r2)];
  const [s1, s2] = [substituted(r1), substituted(r2)];
  return join(
    label(start, "Square both sides", "两边平方"),
    both(
      "Square both sides, move every term to one side and factor:",
      "两边平方，把所有项移到一边再因式分解：",
      `${linear(a, b)} = ${poly([m * m, "x^{2}"], [2 * m * c, "x"], [c * c, ""])}`,
      `${poly([m * m, "x^{2}"], [2 * m * c - a, "x"], [c * c - b, ""])} = 0`,
      factor,
    ),
    para,
    label(start + 1, "Check each root", "检验每个根"),
    t(
      `Squaring can add roots, so check each one in $${right}$, which must equal a square root. ${c1.en} ${c2.en} ${conclude.en}`,
      `平方可能产生增根，所以把每个根代入 $${right}$ 检验，它必须等于一个平方根。${c1["zh-CN"]}${c2["zh-CN"]}${conclude["zh-CN"]}`,
    ),
    said(
      `Substitute each root into $\\sqrt{${linear(a, b)}} = ${right}$, before squaring. ${s1.en} ${s2.en}`,
      `把每个根代入平方前的 $\\sqrt{${linear(a, b)}} = ${right}$。${s1["zh-CN"]}${s2["zh-CN"]}`,
    ),
  );
}

/** rootLineWrong are the solution sets of keeping every root, keeping none, and keeping the wrong ones. */
function rootLineWrong(g: RootLine): string[][] {
  const valid = validRoots(g);
  const invalid = [g.r1, g.r2].filter((r) => !valid.includes(r));
  return [sols([g.r1, g.r2]), [], sols(invalid)];
}

/** twoRootsWork solves an equation with the roots √P and √R in three steps: isolate and square, isolate again, square again. */
function twoRootsWork(P: string, R: string, first: readonly string[], second: readonly string[], v: number, x0: number, check: Text): Text {
  return join(
    label(1, "Isolate one root and square", "分离一个根式并平方"),
    both(
      `Keep $\\sqrt{${P}}$ alone on the left, then square. The $x$ terms will cancel:`,
      `让 $\\sqrt{${P}}$ 单独留在左边，再平方。$x$ 项会相互抵消：`,
      ...first,
    ),
    para,
    label(2, "Isolate the other root", "分离另一个根式"),
    both("Collect the numbers and divide:", "合并常数再相除：", ...second),
    para,
    label(3, "Square again", "再次平方"),
    both(`The value $${v}$ is not negative, so squaring is safe:`, `$${v}$ 不是负数，所以可以平方：`, `${R} = ${v * v}`, `x = ${x0}`),
    said(check.en, check["zh-CN"]),
  );
}

/** solvingAdvancedRadicalEquations solves radical equations that lead to quadratics, have two roots, or have cube roots. */
export const solvingAdvancedRadicalEquations: TopicDef = {
  id: "solving-advanced-radical-equations",
  title: t("Solving Advanced Radical Equations", "解较复杂的根式方程"),
  summary: t(
    "Solve radical equations that become quadratic after squaring, equations with two square roots, and equations with cube roots.",
    "解平方后变成二次方程的根式方程、含两个平方根的方程以及含立方根的方程。",
  ),
  prerequisites: ["solving-radical-equations", "solving-quadratic-equations-by-factoring", "solving-odd-power-equations"],
  encompasses: [
    { topic: "solving-radical-equations", weight: 0.6 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.4 },
  ],
  xp: 20,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `You have solved radical equations by isolating the root and squaring, and quadratic equations by factoring. Many radical equations need both: after squaring, the equation becomes a quadratic. Such equations come up whenever a length found with the Pythagorean theorem is set equal to another length.

Take $\\sqrt{2x + 3} = x$. Square both sides and factor:

$$2x + 3 = x^{2}, \\qquad x^{2} - 2x - 3 = 0, \\qquad (x - 3)(x + 1) = 0.$$

The quadratic has the roots $3$ and $-1$, but squaring can add roots, so check each one. At $x = 3$, $\\sqrt{9} = 3$: a solution. At $x = -1$, $\\sqrt{1} = 1$, not $-1$: extraneous. The only solution is $x = 3$.`,
    `你已经会通过分离根式再平方来解根式方程，也会用因式分解解二次方程。很多根式方程两者都要用：平方之后，方程变成二次方程。每当用勾股定理求出的长度要等于另一段长度时，就会遇到这样的方程。

以 $\\sqrt{2x + 3} = x$ 为例。两边平方再因式分解：

$$2x + 3 = x^{2}, \\qquad x^{2} - 2x - 3 = 0, \\qquad (x - 3)(x + 1) = 0.$$

二次方程的根是 $3$ 和 $-1$，但平方可能产生增根，所以要逐个检验。当 $x = 3$ 时，$\\sqrt{9} = 3$：是解。当 $x = -1$ 时，$\\sqrt{1} = 1$，不等于 $-1$：是增根。方程唯一的解是 $x = 3$。`,
  ),
  knowledgePoints: [
    {
      id: "roots-equal-to-linear-expressions",
      title: t("A root equal to a linear expression", "根式等于一次式"),
      explanation: t(
        "When the other side is a linear expression, squaring both sides gives a quadratic equation. Solve it, then check every root: a square root is never negative, so a root that makes the other side negative is extraneous.\n\n$$\\sqrt{x + 7} = x + 1 \\;\\Rightarrow\\; x + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; x^{2} + x - 6 = 0 \\;\\Rightarrow\\; (x + 3)(x - 2) = 0$$\n\nAt $x = 2$, $x + 1 = 3$: a solution. At $x = -3$, $x + 1 = -2 < 0$: extraneous. The only solution is $x = 2$.\n\n> **Watch out.** Squaring $\\sqrt{A} = B$ and squaring $\\sqrt{A} = -B$ give the same equation. So every root of the quadratic must be checked in the original equation.",
        "当另一边是一次式时，两边平方得到一个二次方程。解出它，再检验每个根：平方根永远不是负数，所以使另一边为负的根是增根。\n\n$$\\sqrt{x + 7} = x + 1 \\;\\Rightarrow\\; x + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; x^{2} + x - 6 = 0 \\;\\Rightarrow\\; (x + 3)(x - 2) = 0$$\n\n当 $x = 2$ 时，$x + 1 = 3$：是解。当 $x = -3$ 时，$x + 1 = -2 < 0$：是增根。唯一的解是 $x = 2$。\n\n> **注意。** 把 $\\sqrt{A} = B$ 平方和把 $\\sqrt{A} = -B$ 平方，得到的是同一个方程。所以二次方程的每个根都必须代回原方程检验。",
      ),
      keyPrerequisites: ["solving-quadratic-equations-by-factoring"],
      generate(rng) {
        const g = randomRootLine(rng);
        return solutionsProblem({
          prompt: solve(`${rootLineLeft(g)} = ${linear(g.m, g.c)}`),
          values: sols(validRoots(g)),
          wrong: rootLineWrong(g),
          solution: rootLineWork(g),
        });
      },
    },
    {
      id: "isolating-the-root-before-squaring",
      title: t("Isolating the root before squaring", "平方前先分离根式"),
      explanation: t(
        "Squaring a side that is a sum with a root, such as $x - \\sqrt{x + 10}$, does not remove the root. Isolate the root first:\n\n$$x - \\sqrt{x + 10} = 2 \\;\\Rightarrow\\; \\sqrt{x + 10} = x - 2 \\;\\Rightarrow\\; x + 10 = x^{2} - 4x + 4 \\;\\Rightarrow\\; (x - 6)(x + 1) = 0$$\n\nAt $x = 6$, $x - 2 = 4$: a solution. At $x = -1$, $x - 2 = -3$: extraneous.\n\n> **Watch out.** If you square before isolating the root, the middle term $2pq$ of $(p + q)^{2}$ still contains the root. Isolate it first, so that squaring removes it.",
        "如果一边是含根式的和，比如 $x - \\sqrt{x + 10}$，直接平方并不能消去根号。先分离根式：\n\n$$x - \\sqrt{x + 10} = 2 \\;\\Rightarrow\\; \\sqrt{x + 10} = x - 2 \\;\\Rightarrow\\; x + 10 = x^{2} - 4x + 4 \\;\\Rightarrow\\; (x - 6)(x + 1) = 0$$\n\n当 $x = 6$ 时，$x - 2 = 4$：是解。当 $x = -1$ 时，$x - 2 = -3$：是增根。\n\n> **注意。** 如果不先分离根式就平方，$(p + q)^{2}$ 的中间项 $2pq$ 里仍然含有根式。先分离根式，平方才能把它消去。",
      ),
      generate(rng) {
        const g = randomRootLine(rng);
        const left = rootLineLeft(g);
        const mx = linear(g.m, 0);
        const form = rng.int(0, 2);
        let eq: string;
        if (form === 0) eq = `${mx} - ${left} = ${-g.c}`;
        else if (form === 1) eq = `${left} ${g.m < 0 ? `+ ${linear(-g.m, 0)}` : `- ${mx}`} = ${g.c}`;
        else {
          const p = rng.nonZero(-9, 9);
          eq = `${left}${plus(p)} = ${linear(g.m, g.c + p)}`;
        }
        const isolated = `${left} = ${linear(g.m, g.c)}`;
        return solutionsProblem({
          prompt: solve(eq),
          values: sols(validRoots(g)),
          wrong: rootLineWrong(g),
          solution: join(
            label(1, "Isolate the root", "分离根式"),
            both(
              "Squaring a sum that contains a root would leave a root behind. So move every other term to the right side first:",
              "直接平方含根式的和仍会留下根式，所以先把其他项都移到右边：",
              isolated,
            ),
            para,
            rootLineWork(g, 2),
          ),
        });
      },
    },
    {
      id: "two-square-roots",
      title: t("Two square roots", "两个平方根"),
      explanation: t(
        "With two square roots, isolate one and square; the $x$ terms cancel and one root is left. Isolate it and square again:\n\n$$\\sqrt{x + 5} + \\sqrt{x} = 5 \\;\\Rightarrow\\; \\sqrt{x + 5} = 5 - \\sqrt{x} \\;\\Rightarrow\\; x + 5 = 25 - 10\\sqrt{x} + x$$\n\nSo $10\\sqrt{x} = 20$, $\\sqrt{x} = 2$ and $x = 4$. Check: $\\sqrt{9} + \\sqrt{4} = 5$. If the isolated root comes out negative, there is no solution. Do not square each term on its own: $(p + q)^{2} \\ne p^{2} + q^{2}$.\n\n> **Watch out.** After the first squaring one root is still left. Isolate it, square again, and check the answer in the original equation.",
        "有两个平方根时，先分离出一个再平方；$x$ 项相互抵消，只剩一个根式。再分离它并再次平方：\n\n$$\\sqrt{x + 5} + \\sqrt{x} = 5 \\;\\Rightarrow\\; \\sqrt{x + 5} = 5 - \\sqrt{x} \\;\\Rightarrow\\; x + 5 = 25 - 10\\sqrt{x} + x$$\n\n所以 $10\\sqrt{x} = 20$，$\\sqrt{x} = 2$，$x = 4$。检验：$\\sqrt{9} + \\sqrt{4} = 5$。如果分离出的根式等于负数，方程无解。不要把每一项分别平方：$(p + q)^{2} \\ne p^{2} + q^{2}$。\n\n> **注意。** 第一次平方之后还剩一个根式。把它分离出来再平方一次，并把答案代回原方程检验。",
      ),
      generate(rng) {
        const x0 = rng.int(-10, 10);
        const kind = rng.pick(["sum", "sum", "difference", "difference", "none"] as const);
        let u: number;
        let v: number;
        do {
          u = rng.int(0, 6);
          v = rng.int(0, 6);
        } while (u === v || (kind !== "sum" && u < v));
        const p = u * u - x0;
        const q = v * v - x0;
        const [P, R] = [linear(1, p), linear(1, q)];
        const naive = Q.of(rng.int(0, 0) + (u + v) ** 2 - p - q, 2);
        if (kind === "sum") {
          const c = u + v;
          return solutionsProblem({
            prompt: solve(`\\sqrt{${P}} + \\sqrt{${R}} = ${c}`),
            values: [num(x0)],
            wrong: [[], [num(naive)], [num(v * v - p)]],
            solution: twoRootsWork(
              P,
              R,
              [`\\sqrt{${P}} = ${c} - \\sqrt{${R}}`, `${P} = ${c * c} - ${2 * c}\\sqrt{${R}} + ${R}`],
              [`${2 * c}\\sqrt{${R}} = ${c * c + q - p}`, `\\sqrt{${R}} = ${v}`],
              v,
              x0,
              t(
                `At $x = ${x0}$: $\\sqrt{${u * u}} + \\sqrt{${v * v}} = ${u} + ${v} = ${c}$, as required.`,
                `当 $x = ${x0}$ 时：$\\sqrt{${u * u}} + \\sqrt{${v * v}} = ${u} + ${v} = ${c}$，符合要求。`,
              ),
            ),
          });
        }
        const c = u - v;
        if (kind === "difference") {
          return solutionsProblem({
            prompt: solve(`\\sqrt{${P}} - \\sqrt{${R}} = ${c}`),
            values: [num(x0)],
            wrong: [[], [num(v * v - p)], [num(u * u - q)]],
            solution: twoRootsWork(
              P,
              R,
              [`\\sqrt{${P}} = ${c} + \\sqrt{${R}}`, `${P} = ${c * c} + ${2 * c}\\sqrt{${R}} + ${R}`],
              [`${2 * c}\\sqrt{${R}} = ${p - q - c * c}`, `\\sqrt{${R}} = ${v}`],
              v,
              x0,
              t(
                `At $x = ${x0}$: $\\sqrt{${u * u}} - \\sqrt{${v * v}} = ${u} - ${v} = ${c}$, as required.`,
                `当 $x = ${x0}$ 时：$\\sqrt{${u * u}} - \\sqrt{${v * v}} = ${u} - ${v} = ${c}$，符合要求。`,
              ),
            ),
          });
        }
        return solutionsProblem({
          prompt: solve(`\\sqrt{${R}} - \\sqrt{${P}} = ${c}`),
          values: [],
          wrong: [[num(x0)]],
          solution: join(
            label(1, "Isolate one root and square", "分离一个根式并平方"),
            both(
              `Move $\\sqrt{${P}}$ to the right side, then square. The $x$ terms cancel:`,
              `把 $\\sqrt{${P}}$ 移到右边，再平方。$x$ 项相互抵消：`,
              `\\sqrt{${R}} = ${c} + \\sqrt{${P}}`,
              `${R} = ${c * c} + ${2 * c}\\sqrt{${P}} + ${P}`,
            ),
            para,
            label(2, "Isolate the other root", "分离另一个根式"),
            both("Collect the numbers and divide:", "合并常数再相除：", `${2 * c}\\sqrt{${P}} = ${q - p - c * c}`, `\\sqrt{${P}} = ${-u}`),
            t("\n\nA square root is never negative, so the equation has no solution.", "\n\n平方根不可能是负数，所以方程无解。"),
            said(
              `Squaring $\\sqrt{${P}} = ${-u}$ anyway would give $x = ${x0}$. There $\\sqrt{${v * v}} - \\sqrt{${u * u}} = ${v} - ${u} = ${-c}$, not $${c}$, so that value is extraneous.`,
              `如果仍把 $\\sqrt{${P}} = ${-u}$ 平方，会得到 $x = ${x0}$。此时 $\\sqrt{${v * v}} - \\sqrt{${u * u}} = ${v} - ${u} = ${-c}$，不等于 $${c}$，所以它是增根。`,
            ),
          ),
        });
      },
    },
    {
      id: "cube-root-equations",
      title: t("Cube root equations", "立方根方程"),
      explanation: t(
        "Undo a cube root by isolating it and cubing both sides. A cube root can be negative, so cubing creates no extraneous solutions:\n\n$$2\\sqrt[3]{x - 3} + 7 = 1 \\;\\Rightarrow\\; \\sqrt[3]{x - 3} = -3 \\;\\Rightarrow\\; x - 3 = -27 \\;\\Rightarrow\\; x = -24$$\n\n> **Watch out.** A cube root may equal a negative number: $\\sqrt[3]{x - 3} = -3$ has a solution. Only an even root can never be negative.",
        "要消去立方根，先把它分离出来，再两边立方。立方根可以是负数，所以立方不会产生增根：\n\n$$2\\sqrt[3]{x - 3} + 7 = 1 \\;\\Rightarrow\\; \\sqrt[3]{x - 3} = -3 \\;\\Rightarrow\\; x - 3 = -27 \\;\\Rightarrow\\; x = -24$$\n\n> **注意。** 立方根可以等于负数：$\\sqrt[3]{x - 3} = -3$ 有解。只有偶次根不能是负数。",
      ),
      keyPrerequisites: ["solving-odd-power-equations"],
      generate(rng) {
        const r = rng.int(-4, 4);
        const x0 = rng.int(-10, 10);
        const a = rng.pick([1, 1, 2, 3, -1, -2]);
        const b = r ** 3 - a * x0;
        const k = rng.pick([1, 1, 2, 3, -1]);
        const d = rng.nonZero(-9, 9);
        const e = k * r + d;
        const cube = `\\sqrt[3]{${linear(a, b)}}`;
        const isolate = [...(k === 1 ? [] : [`${front(k)}${cube} = ${e - d}`]), `${cube} = ${r}`];
        return solutionsProblem({
          prompt: solve(`${front(k)}${cube}${plus(d)} = ${e}`),
          values: [num(x0)],
          wrong: [
            [num(Q.of(r * r - b, a))],
            ...(r !== 0 ? [[num(Q.of(-(r ** 3) - b, a))]] : []),
            ...(k !== 1 ? [[num(Q.of((e - d) ** 3 - b, a))]] : []),
            ...(r < 0 ? [[]] : []),
          ],
          solution: join(
            label(1, "Isolate the cube root", "分离立方根"),
            both(
              `${d > 0 ? `Subtract $${d}$ from` : `Add $${-d}$ to`} both sides${k === 1 ? "" : ` and divide by $${k}$`}:`,
              `两边${d > 0 ? `减去 $${d}$` : `加上 $${-d}$`}${k === 1 ? "" : `，再除以 $${k}$`}：`,
              ...isolate,
            ),
            para,
            label(2, "Cube both sides", "两边立方"),
            both(
              `A cube root can be negative, so cubing creates no extraneous roots. Cube and solve:`,
              "立方根可以是负数，所以立方不会产生增根。两边立方并求解：",
              `${linear(a, b)} = ${paren(r)}^{3} = ${r ** 3}`,
              `x = ${x0}`,
            ),
            said(
              `At $x = ${x0}$ the radicand is $${r ** 3}$, whose cube root is $${r}$. Then $${k === 1 ? "" : `${k} \\cdot `}${paren(r)}${plus(d)} = ${e}$, the right side.`,
              `当 $x = ${x0}$ 时被开方式为 $${r ** 3}$，它的立方根是 $${r}$。于是 $${k === 1 ? "" : `${k} \\cdot `}${paren(r)}${plus(d)} = ${e}$，等于右边。`,
            ),
          ),
        });
      },
    },
  ],
};

// 6.21.1 Graphing the square root function.

const sqrtView: PlaneView = { xMin: -1, xMax: 10, yMin: -1, yMax: 4 };

const sqrtBasicFigure: Figure = {
  svg: plane(sqrtView, [
    { kind: "curve", f: Math.sqrt, from: 0, accent: true },
    ...(
      [
        [0, 0],
        [1, 1],
        [4, 2],
        [9, 3],
      ] as Point[]
    ).map((at): PlaneMark => ({ kind: "point", at, accent: true })),
  ]),
  alt: t(
    "The graph of y = √x: a curve starting at (0, 0) and rising ever more slowly to the right, through (1, 1), (4, 2) and (9, 3), which are marked with dots.",
    "y = √x 的图象：一条从 (0, 0) 出发、向右上升得越来越慢的曲线，经过用圆点标出的 (1, 1)、(4, 2) 和 (9, 3)。",
  ),
};

const fSqrt = "$f(x) = \\sqrt{x}$";

/** graphingTheSquareRootFunction graphs y = √x, reads values from it and uses its domain, range and growth. */
export const graphingTheSquareRootFunction: TopicDef = {
  id: "graphing-the-square-root-function",
  title: t("Graphing the Square Root Function", "平方根函数的图象"),
  summary: t(
    "Graph y = √x through (0, 0), (1, 1), (4, 2) and (9, 3); its domain and range are [0, ∞) and it always increases.",
    "画出经过 (0, 0)、(1, 1)、(4, 2)、(9, 3) 的 y = √x 的图象；它的定义域和值域都是 [0, ∞)，并且始终递增。",
  ),
  prerequisites: ["range-of-a-function", "simplifying-square-roots"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.B"],
  intro: t(
    `You know how to simplify square roots and how to find the range of a function. Now treat the square root as a function, $f(x) = \\sqrt{x}$, and draw its graph. It describes, for example, the side of a square from its area: a square of area $x$ has side $\\sqrt{x}$.

Take a few areas whose sides are easy to find:

$$f(16) = 4, \\qquad f(25) = 5, \\qquad f(2) = \\sqrt{2} \\approx 1.41.$$

The values keep growing but more and more slowly. Going from $x = 0$ to $x = 1$ raises the graph by $1$, but going from $x = 16$ to $x = 25$, nine times as far, also raises it by only $1$. So the graph starts at the origin, climbs steeply at first and then flattens out, and it has no points with $x < 0$.`,
    `你会化简平方根，也会求函数的值域。现在把平方根看作函数 $f(x) = \\sqrt{x}$，画出它的图象。例如，它由正方形的面积给出边长：面积为 $x$ 的正方形边长是 $\\sqrt{x}$。

取几个容易求边长的面积：

$$f(16) = 4, \\qquad f(25) = 5, \\qquad f(2) = \\sqrt{2} \\approx 1.41.$$

函数值一直增大，但增大得越来越慢。从 $x = 0$ 到 $x = 1$，图象升高 $1$；而从 $x = 16$ 到 $x = 25$，走了九倍远，也只升高 $1$。所以图象从原点出发，开始时陡，后来越来越平，并且没有 $x < 0$ 的点。`,
  ),
  knowledgePoints: [
    {
      id: "values-of-the-square-root-function",
      title: t("Values of the square root function", "平方根函数的值"),
      explanation: t(
        "The **square root function** $f(x) = \\sqrt{x}$ takes each number $x \\ge 0$ to the number $y \\ge 0$ with $y^{2} = x$. Perfect squares give the easiest points: $(0, 0)$, $(1, 1)$, $(4, 2)$, $(9, 3)$. Other values are written in simplest radical form, such as $f(12) = \\sqrt{12} = 2\\sqrt{3}$.\n\nTo find where $f(x) = 5$, undo the root by squaring: $x = 5^{2} = 25$.\n\n> **Watch out.** $\\sqrt{x}$ is the nonnegative root only. $\\sqrt{25} = 5$, not $\\pm 5$, and $f(x) = -5$ has no solution.",
        "**平方根函数** $f(x) = \\sqrt{x}$ 把每个 $x \\ge 0$ 对应到满足 $y^{2} = x$ 的 $y \\ge 0$。完全平方数给出最容易的点：$(0, 0)$、$(1, 1)$、$(4, 2)$、$(9, 3)$。其他的值写成最简根式，比如 $f(12) = \\sqrt{12} = 2\\sqrt{3}$。\n\n要求使 $f(x) = 5$ 的 $x$，用平方撤销根号：$x = 5^{2} = 25$。\n\n> **注意。** $\\sqrt{x}$ 只表示非负的根。$\\sqrt{25} = 5$，不是 $\\pm 5$，而 $f(x) = -5$ 无解。",
      ),
      figure: sqrtBasicFigure,
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        if (rng.bool()) {
          const k = rng.int(1, 10);
          const m = rng.pick([1, 1, 2, 3, 5, 6, 7, 10]);
          const n = k * k * m;
          return radicalProblem({
            prompt: t(`Let ${fSqrt}. Find $f(${n})$ in simplest radical form.`, `设 ${fSqrt}。求 $f(${n})$，写成最简根式。`),
            answer: [k, m],
            wrong: [...(k > 1 && m > 1 ? [`\\sqrt{${n}}`] : []), radical(k * k, m), Q.of(n, 2).toLatex()],
            solution: join(
              label(1, "Substitute", "代入"),
              t(`Replace $x$ by $${n}$ in the rule: $f(${n}) = \\sqrt{${n}}$.`, `把法则中的 $x$ 换成 $${n}$：$f(${n}) = \\sqrt{${n}}$。`),
              para,
              label(2, "Simplify the root", "化简根式"),
              m === 1
                ? both(`$${n} = ${k}^{2}$ is a perfect square:`, `$${n} = ${k}^{2}$ 是完全平方数：`, `\\sqrt{${n}} = ${k}`)
                : k === 1
                  ? t(
                      `No perfect square other than $1$ divides $${n}$, so $\\sqrt{${n}}$ is already in simplest radical form.`,
                      `除 $1$ 以外没有完全平方数整除 $${n}$，所以 $\\sqrt{${n}}$ 已经是最简根式。`,
                    )
                  : both(
                      `The largest perfect square dividing $${n}$ is $${k * k}$, since $${n} = ${k * k} \\cdot ${m}$. Take its root out:`,
                      `整除 $${n}$ 的最大完全平方数是 $${k * k}$，因为 $${n} = ${k * k} \\cdot ${m}$。把它开方后移出：`,
                      `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`,
                    ),
              said(
                `The answer is not negative, and its square is $${m === 1 ? `${k}^{2}` : `\\left(${radical(k, m)}\\right)^{2}`} = ${k === 1 || m === 1 ? "" : `${k * k} \\cdot ${m} = `}${n}$.`,
                `答案不是负数，它的平方是 $${m === 1 ? `${k}^{2}` : `\\left(${radical(k, m)}\\right)^{2}`} = ${k === 1 || m === 1 ? "" : `${k * k} \\cdot ${m} = `}${n}$。`,
              ),
            ),
          });
        }
        let v: Q;
        if (rng.bool(0.7)) v = Q.of(rng.int(1, 15));
        else {
          const q = rng.int(2, 5);
          let p: number;
          do p = rng.int(1, 9);
          while (gcd(p, q) !== 1);
          v = Q.of(p, q);
        }
        const x = v.mul(v);
        return numberProblem({
          prompt: t(
            `Let ${fSqrt}. Find the value of $x$ for which $f(x) = ${v.toLatex()}$.`,
            `设 ${fSqrt}。求使 $f(x) = ${v.toLatex()}$ 的 $x$ 的值。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [v.mul(Q.of(2)), v, x.neg()],
          solution: join(
            label(1, "Write the equation", "写出方程"),
            t(
              `$f(x) = ${v.toLatex()}$ means $\\sqrt{x} = ${v.toLatex()}$. The value is not negative, so a solution exists.`,
              `$f(x) = ${v.toLatex()}$ 就是 $\\sqrt{x} = ${v.toLatex()}$。这个值不是负数，所以有解。`,
            ),
            para,
            label(2, "Square both sides", "两边平方"),
            both("Squaring undoes the root:", "平方可以撤销根号：", `x = \\left(${v.toLatex()}\\right)^{2} = ${x.toLatex()}`),
            said(
              `$\\sqrt{${x.toLatex()}}$ is the number that is not negative and whose square is $${x.toLatex()}$. That number is $${v.toLatex()}$, so $f(${x.toLatex()}) = ${v.toLatex()}$.`,
              `$\\sqrt{${x.toLatex()}}$ 是平方等于 $${x.toLatex()}$ 的非负数，这个数就是 $${v.toLatex()}$，所以 $f(${x.toLatex()}) = ${v.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "points-on-the-square-root-graph",
      figure: algebraDrawings3["graphing-the-square-root-function#points-on-the-square-root-graph"],
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "The point $(p, q)$ is on the graph of $y = \\sqrt{x}$ exactly when $q = \\sqrt{p}$, that is, when $q \\ge 0$ and $q^{2} = p$. So:\n\n- no point has a negative $x$-coordinate: $\\sqrt{x}$ is not defined for $x < 0$, and the graph lies to the right of the $y$-axis;\n- no point has a negative $y$-coordinate: the graph lies on or above the $x$-axis.\n\n$(16, 4)$ is on the graph, but $(16, -4)$ and $(4, 16)$ are not.\n\n> **Watch out.** Do not swap the coordinates. $(4, 2)$ is on the graph because $\\sqrt{4} = 2$, but $(2, 4)$ is not.",
        "点 $(p, q)$ 在 $y = \\sqrt{x}$ 的图象上当且仅当 $q = \\sqrt{p}$，即 $q \\ge 0$ 且 $q^{2} = p$。所以：\n\n- 没有点的横坐标是负数：$x < 0$ 时 $\\sqrt{x}$ 没有定义，图象在 $y$ 轴右侧；\n- 没有点的纵坐标是负数：图象在 $x$ 轴上或上方。\n\n$(16, 4)$ 在图象上，而 $(16, -4)$ 和 $(4, 16)$ 不在。\n\n> **注意。** 不要把坐标对调。$(4, 2)$ 在图象上，因为 $\\sqrt{4} = 2$；但 $(2, 4)$ 不在。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const kind = rng.pick(["on", "on", "on", "swapped", "below", "left", "off"] as const);
        const [x, y] =
          kind === "on"
            ? [n * n, n]
            : kind === "swapped"
              ? [n, n * n]
              : kind === "below"
                ? [n * n, -n]
                : kind === "left"
                  ? [-n * n, n]
                  : [n * n, n + 1];
        const on = kind === "on";
        const reason =
          kind === "below"
            ? t("A square root is never negative.", "平方根不可能是负数。")
            : kind === "left"
              ? t(
                  `$\\sqrt{${x}}$ is not defined: the graph has no points with a negative $x$-coordinate.`,
                  `$\\sqrt{${x}}$ 没有定义：图象上没有横坐标为负数的点。`,
                )
              : on
                ? t(`$\\sqrt{${x}} = ${y}$, since $${y}^{2} = ${x}$.`, `$\\sqrt{${x}} = ${y}$，因为 $${y}^{2} = ${x}$。`)
                : t(
                    `$\\sqrt{${x}} \\ne ${y}$, since $${y}^{2} = ${y * y} \\ne ${x}$.`,
                    `$\\sqrt{${x}} \\ne ${y}$，因为 $${y}^{2} = ${y * y} \\ne ${x}$。`,
                  );
        return choiceProblem({
          prompt: t(
            `Does the point $${pt(x, y)}$ lie on the graph of $y = \\sqrt{x}$?`,
            `点 $${pt(x, y)}$ 在 $y = \\sqrt{x}$ 的图象上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: join(
            label(1, "State the test", "写出判断条件"),
            t(
              `The point $(p, q)$ is on the graph of $y = \\sqrt{x}$ exactly when $q = \\sqrt{p}$, that is, when $q \\ge 0$ and $q^{2} = p$. Here $p = ${x}$ and $q = ${y}$.`,
              `点 $(p, q)$ 在 $y = \\sqrt{x}$ 的图象上当且仅当 $q = \\sqrt{p}$，即 $q \\ge 0$ 且 $q^{2} = p$。这里 $p = ${x}$，$q = ${y}$。`,
            ),
            para,
            label(2, "Apply it", "代入判断"),
            t(`${reason.en} So the answer is ${on ? "yes" : "no"}.`, `${reason["zh-CN"]}所以答案是${on ? "在" : "不在"}。`),
            kind === "on"
              ? said(
                  `The point of the graph above $x = ${x}$ has height $\\sqrt{${x}} = ${n}$, the given $y$-coordinate.`,
                  `图象在 $x = ${x}$ 处的点高度为 $\\sqrt{${x}} = ${n}$，正是所给的纵坐标。`,
                )
              : kind === "swapped"
                ? said(
                    `The point of the graph at height $${y}$ has $x = ${y}^{2} = ${y * y}$, not $${x}$: the coordinates are the wrong way round.`,
                    `图象上高度为 $${y}$ 的点的横坐标是 $${y}^{2} = ${y * y}$，不是 $${x}$：两个坐标颠倒了。`,
                  )
                : kind === "left"
                  ? said(
                      `Squaring the $y$-coordinate gives $${y * y}$, which is positive, while the $x$-coordinate $${x}$ is negative. They cannot be equal.`,
                      `纵坐标的平方是 $${y * y}$，是正数，而横坐标 $${x}$ 是负数，两者不可能相等。`,
                    )
                  : said(
                      `The point of the graph above $x = ${x}$ is $${pt(x, n)}$, which differs from $${pt(x, y)}$.`,
                      `图象在 $x = ${x}$ 处的点是 $${pt(x, n)}$，与 $${pt(x, y)}$ 不同。`,
                    ),
          ),
        });
      },
    },
    {
      id: "inequalities-from-the-graph",
      title: t("Reading inequalities from the graph", "从图象读出不等式的解"),
      explanation: t(
        "The domain of $y = \\sqrt{x}$ is $[0, \\infty)$ and its range is $[0, \\infty)$. The graph rises from left to right, so larger inputs always give larger outputs. To find where $\\sqrt{x} < 3$, find where the graph reaches the height $3$, at $x = 9$: the graph is below that height to the left of $x = 9$, back to the start of the domain at $x = 0$. So $\\sqrt{x} < 3$ for $x$ in $[0, 9)$, and $\\sqrt{x} \\ge 3$ for $x$ in $[9, \\infty)$.\n\n> **Watch out.** The solution of $\\sqrt{x} < 3$ starts at $0$, not at $-\\infty$. The root is not defined for negative $x$.",
        "$y = \\sqrt{x}$ 的定义域是 $[0, \\infty)$，值域是 $[0, \\infty)$。图象从左到右上升，所以输入越大输出越大。要求 $\\sqrt{x} < 3$ 的解，找出图象到达高度 $3$ 的位置 $x = 9$：在 $x = 9$ 左边、直到定义域起点 $x = 0$，图象都低于这个高度。所以 $\\sqrt{x} < 3$ 的解是 $[0, 9)$，$\\sqrt{x} \\ge 3$ 的解是 $[9, \\infty)$。\n\n> **注意。** $\\sqrt{x} < 3$ 的解从 $0$ 开始，而不是从 $-\\infty$ 开始。负的 $x$ 使根式无定义。",
      ),
      figure: sqrtBasicFigure,
      generate(rng) {
        const k = rng.int(1, 12);
        const op = rng.pick(["<", "\\le", ">", "\\ge"] as const);
        const below = op === "<" || op === "\\le";
        const closed = op === "\\le" || op === "\\ge";
        const k2 = k * k;
        const set = below ? union(iv(0, k2, true, closed)) : atLeast(k2, closed);
        return intervalProblem({
          prompt: t(
            `For which values of $x$ is $\\sqrt{x} ${op} ${k}$? ${asInterval.en}`,
            `$x$ 取哪些值时 $\\sqrt{x} ${op} ${k}$？${asInterval["zh-CN"]}`,
          ),
          set,
          form: "interval",
          wrong: below
            ? [atMost(k2, closed), union(iv(0, k, true, closed)), union(iv(0, k2, !closed, !closed))]
            : [atLeast(k, closed), atLeast(k2, !closed), union(iv(0, k2, true, !closed))],
          solution: join(
            label(1, "Find where the graph reaches the height", "找出图象到达这个高度的位置"),
            t(
              `$\\sqrt{x} = ${k}$ when $x = ${k}^{2} = ${k2}$, so the graph passes through $${pt(k2, k)}$.`,
              `当 $x = ${k}^{2} = ${k2}$ 时 $\\sqrt{x} = ${k}$，所以图象经过 $${pt(k2, k)}$。`,
            ),
            para,
            label(2, "Read the graph", "读图"),
            t(
              `The graph rises from left to right${below ? `, so it is ${op === "<" ? "below" : "at or below"} the height $${k}$ from the start of the domain, $x = 0$, ${op === "<" ? "up to but not including" : "up to and including"} $x = ${k2}$` : `, so it is ${op === ">" ? "above" : "at or above"} the height $${k}$ for $x ${op} ${k2}$`}. The answer is ${setText(set)}.`,
              `图象从左到右上升${below ? `，所以从定义域起点 $x = 0$ 到 $x = ${k2}$（${op === "<" ? "不含" : "含"}）图象${op === "<" ? "低于" : "不高于"}高度 $${k}$` : `，所以当 $x ${op} ${k2}$ 时图象${op === ">" ? "高于" : "不低于"}高度 $${k}$`}。答案是 ${setText(set)}。`,
            ),
            below
              ? said(
                  `Test one value on each side. At $x = 0$, $\\sqrt{0} = 0$ and $0 ${op} ${k}$ holds. At $x = ${(k + 1) ** 2}$, $\\sqrt{${(k + 1) ** 2}} = ${k + 1}$ and $${k + 1} ${op} ${k}$ fails.`,
                  `在两侧各取一个值检验。当 $x = 0$ 时 $\\sqrt{0} = 0$，$0 ${op} ${k}$ 成立。当 $x = ${(k + 1) ** 2}$ 时 $\\sqrt{${(k + 1) ** 2}} = ${k + 1}$，$${k + 1} ${op} ${k}$ 不成立。`,
                )
              : said(
                  `Test one value on each side. At $x = ${(k + 1) ** 2}$, $\\sqrt{${(k + 1) ** 2}} = ${k + 1}$ and $${k + 1} ${op} ${k}$ holds. At $x = 0$, $\\sqrt{0} = 0$ and $0 ${op} ${k}$ fails.`,
                  `在两侧各取一个值检验。当 $x = ${(k + 1) ** 2}$ 时 $\\sqrt{${(k + 1) ** 2}} = ${k + 1}$，$${k + 1} ${op} ${k}$ 成立。当 $x = 0$ 时 $\\sqrt{0} = 0$，$0 ${op} ${k}$ 不成立。`,
                ),
          ),
        });
      },
    },
  ],
};

// 6.21.2 Graph transformations of square root functions.

/** graphTransformationsOfSquareRootFunctions graphs y = a√(±(x − h)) + k by transforming y = √x. */
export const graphTransformationsOfSquareRootFunctions: TopicDef = {
  id: "graph-transformations-of-square-root-functions",
  title: t("Graph Transformations of Square Root Functions", "平方根函数的图象变换"),
  summary: t(
    "Graph y = a√(x − h) + k and y = a√(h − x) + k: the graph of y = √x moved so that it starts at (h, k), stretched and reflected.",
    "画 y = a√(x − h) + k 和 y = a√(h − x) + k 的图象：把 y = √x 的图象移到从 (h, k) 出发，并进行伸缩和翻折。",
  ),
  prerequisites: ["graphing-the-square-root-function", "combining-reflections-with-other-graph-transformations"],
  encompasses: [{ topic: "combining-reflections-with-other-graph-transformations", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  intro: t(
    `From transformations of graphs you know that $y = a f(x - h) + k$ is the graph of $y = f(x)$ stretched by $a$, reflected when $a < 0$, and moved $h$ right and $k$ up. Applied to $f(x) = \\sqrt{x}$, this lets you draw any transformed square-root graph from the three points $(0, 0)$, $(1, 1)$ and $(4, 2)$, without making a new table of values.

Take $y = \\sqrt{x - 3} + 2$. Here $h = 3$, $k = 2$ and $a = 1$, so every point moves $3$ right and $2$ up:

$$(0, 0) \\to (3, 2), \\qquad (1, 1) \\to (4, 3), \\qquad (4, 2) \\to (7, 4).$$

The graph starts at $(3, 2)$ and has the same shape as $y = \\sqrt{x}$. Check one point: at $x = 7$, $\\sqrt{4} + 2 = 4$.`,
    `由图象变换可知，$y = a f(x - h) + k$ 是把 $y = f(x)$ 的图象伸缩 $a$ 倍（$a < 0$ 时还要反射），再向右平移 $h$、向上平移 $k$。把它用于 $f(x) = \\sqrt{x}$，就能由 $(0, 0)$、$(1, 1)$、$(4, 2)$ 三个点画出任何变换后的平方根图象，不必重新列表。

以 $y = \\sqrt{x - 3} + 2$ 为例。这里 $h = 3$，$k = 2$，$a = 1$，所以每个点都向右移 $3$、向上移 $2$：

$$(0, 0) \\to (3, 2), \\qquad (1, 1) \\to (4, 3), \\qquad (4, 2) \\to (7, 4).$$

图象从 $(3, 2)$ 出发，形状与 $y = \\sqrt{x}$ 相同。检验一个点：当 $x = 7$ 时，$\\sqrt{4} + 2 = 4$。`,
  ),
  knowledgePoints: [
    {
      id: "the-endpoint",
      figure: algebraDrawings2["graph-transformations-of-square-root-functions#the-endpoint"],
      title: t("The endpoint", "端点"),
      explanation: t(
        "The graph of $y = \\sqrt{x}$ starts at the **endpoint** $(0, 0)$. The graph of $y = a\\sqrt{x - h} + k$ is that graph shifted $h$ units right and $k$ units up, after a vertical stretch or reflection, so it starts at $(h, k)$: the root is $0$ when $x = h$, and then $y = k$.\n\nThe same holds for $y = a\\sqrt{h - x} + k$, whose graph is reflected in a vertical line and extends to the left. For $y = -2\\sqrt{x + 4} + 1$, the root is $0$ at $x = -4$, so the endpoint is $(-4, 1)$.\n\n> **Watch out.** The endpoint of $y = \\sqrt{x + 4}$ is at $x = -4$, not $x = 4$. The root is $0$ where $x + 4 = 0$.",
        "$y = \\sqrt{x}$ 的图象从**端点** $(0, 0)$ 出发。$y = a\\sqrt{x - h} + k$ 的图象是把它竖直伸缩或翻折后，再向右平移 $h$ 个单位、向上平移 $k$ 个单位，所以从 $(h, k)$ 出发：当 $x = h$ 时根式为 $0$，此时 $y = k$。\n\n$y = a\\sqrt{h - x} + k$ 也是如此，它的图象关于一条竖直直线翻折过，向左延伸。对于 $y = -2\\sqrt{x + 4} + 1$，当 $x = -4$ 时根式为 $0$，所以端点是 $(-4, 1)$。\n\n> **注意。** $y = \\sqrt{x + 4}$ 的端点在 $x = -4$ 处，而不是 $x = 4$。根式在 $x + 4 = 0$ 处等于 $0$。",
      ),
      generate(rng) {
        const a = rng.pick<Coefficient>([1, -1, 2, -2, 3, -3, Q.of(1, 2), Q.of(-1, 2)]);
        const s = rng.sign();
        const h = rng.nonZero(-9, 9);
        const k = rng.int(-9, 9);
        const y = rootFn(a, sqrtInner(s, h), k);
        return pointProblem({
          prompt: t(`Find the endpoint of the graph of $y = ${y}$.`, `求 $y = ${y}$ 的图象的端点。`),
          answer: [h, k],
          wrong: [
            [-h, k],
            [h, -k],
            [k, h],
            [-h, -k],
          ],
          solution: join(
            label(1, "Find where the root is zero", "找出根式为零的位置"),
            t(
              `The graph starts where the radicand is $0$: $${sqrtInner(s, h)} = 0$ at $x = ${h}$.`,
              `图象从被开方式为 $0$ 的位置出发：当 $x = ${h}$ 时 $${sqrtInner(s, h)} = 0$。`,
            ),
            para,
            label(2, "Find the height there", "求出那里的高度"),
            t(
              `At $x = ${h}$ the root is $0$, so $y = ${front(a)}\\sqrt{0}${plus(k)} = ${k}$. The endpoint is $${pt(h, k)}$.`,
              `当 $x = ${h}$ 时根式为 $0$，所以 $y = ${front(a)}\\sqrt{0}${plus(k)} = ${k}$。端点是 $${pt(h, k)}$。`,
            ),
            said(
              `The graph of $y = \\sqrt{x}$ starts at $(0, 0)$. Stretching or reflecting it vertically leaves that point where it is, and the shift ${h > 0 ? "right" : "left"} $${Math.abs(h)}$${k === 0 ? "" : ` and ${k > 0 ? "up" : "down"} $${Math.abs(k)}$`} moves it to $${pt(h, k)}$.`,
              `$y = \\sqrt{x}$ 的图象从 $(0, 0)$ 出发。竖直伸缩或翻折不改变这个点，再向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$${k === 0 ? "" : `、向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$`}，它就移到 $${pt(h, k)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "equations-from-transformations",
      figure: algebraDrawings3["graph-transformations-of-square-root-functions#equations-from-transformations"],
      title: t("Equations from transformations", "由变换写解析式"),
      explanation: t(
        "Apply the transformations to $y = \\sqrt{x}$ in order:\n\n- reflect in the $y$-axis: $x$ becomes $-x$;\n- shift right $h$: $x$ becomes $x - h$;\n- reflect in the $x$-axis or stretch vertically by $a$: multiply the root by $-1$ or $a$;\n- shift up $k$: add $k$.\n\nReflecting $y = \\sqrt{x}$ in the $y$-axis gives $y = \\sqrt{-x}$; shifting it right $3$ then gives $y = \\sqrt{-(x - 3)} = \\sqrt{3 - x}$; stretching by $2$ and shifting down $1$ gives $y = 2\\sqrt{3 - x} - 1$.\n\n> **Watch out.** A shift right by $3$ replaces $x$ with $x - 3$, after any reflection. So $\\sqrt{-x}$ becomes $\\sqrt{-(x - 3)}$, not $\\sqrt{-x - 3}$.",
        "按顺序对 $y = \\sqrt{x}$ 进行变换：\n\n- 关于 $y$ 轴翻折：把 $x$ 换成 $-x$；\n- 向右平移 $h$：把 $x$ 换成 $x - h$；\n- 关于 $x$ 轴翻折或竖直伸长为 $a$ 倍：根式乘以 $-1$ 或 $a$；\n- 向上平移 $k$：加上 $k$。\n\n把 $y = \\sqrt{x}$ 关于 $y$ 轴翻折得 $y = \\sqrt{-x}$；再向右平移 $3$ 得 $y = \\sqrt{-(x - 3)} = \\sqrt{3 - x}$；再竖直伸长为 $2$ 倍并向下平移 $1$ 得 $y = 2\\sqrt{3 - x} - 1$。\n\n> **注意。** 向右平移 $3$ 是把 $x$ 换成 $x - 3$，并且在反射之后进行。所以 $\\sqrt{-x}$ 变成 $\\sqrt{-(x - 3)}$，而不是 $\\sqrt{-x - 3}$。",
      ),
      generate(rng) {
        const reflectY = rng.bool(0.4);
        const h = rng.nonZero(-6, 6);
        const reflectX = rng.bool(0.4);
        const stretch = rng.pick([1, 1, 2, 3]);
        const k = rng.nonZero(-8, 8);
        const s = reflectY ? -1 : 1;
        const a = (reflectX ? -1 : 1) * stretch;
        const steps_: Text[] = [
          ...(reflectY ? [t("reflect it in the $y$-axis", "关于 $y$ 轴翻折")] : []),
          h > 0 ? t(`shift it right ${units(h)}`, `向右平移 $${h}$ 个单位`) : t(`shift it left ${units(h)}`, `向左平移 $${-h}$ 个单位`),
          ...(reflectX ? [t("reflect it in the $x$-axis", "关于 $x$ 轴翻折")] : []),
          ...(stretch > 1 ? [t(`stretch it vertically by a factor of $${stretch}$`, `竖直方向伸长为原来的 $${stretch}$ 倍`)] : []),
          k > 0 ? t(`shift it up ${units(k)}`, `向上平移 $${k}$ 个单位`) : t(`shift it down ${units(k)}`, `向下平移 $${-k}$ 个单位`),
        ];
        const answer = rootFn(a, sqrtInner(s, h), k);
        return expressionProblem({
          prompt: t(
            `Start with the graph of $y = \\sqrt{x}$, then ${steps_.map((x) => x.en).join(", then ")}. Write the equation of the new graph.`,
            `从 $y = \\sqrt{x}$ 的图象开始，依次${steps_.map((x) => x["zh-CN"]).join("，再")}。写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [
            rootFn(a, sqrtInner(s, -h), k),
            rootFn(a, poly([-s, "x"], [-h, ""]), k),
            rootFn(a, sqrtInner(s, k), h),
            rootFn(-a, sqrtInner(s, h), k),
            ...(stretch > 1 ? [rootFn(reflectX ? -1 : 1, `${stretch}(${sqrtInner(s, h)})`, k)] : []),
          ],
          solution: join(
            label(1, "Transform the input", "变换输入"),
            t(
              `${reflectY ? "The reflection in the $y$-axis turns $\\sqrt{x}$ into $\\sqrt{-x}$. " : ""}The shift ${h > 0 ? "right" : "left"} ${units(h)} replaces $x$ by $${shifted(h)}$, so the root becomes $${root(2, sqrtInner(s, h))}$.`,
              `${reflectY ? "关于 $y$ 轴的翻折把 $\\sqrt{x}$ 变成 $\\sqrt{-x}$。" : ""}向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位把 $x$ 换成 $${shifted(h)}$，所以根式变成 $${root(2, sqrtInner(s, h))}$。`,
            ),
            para,
            label(2, "Transform the output", "变换输出"),
            t(
              `${a === 1 ? "" : `${reflectX ? "The reflection in the $x$-axis" : ""}${reflectX && stretch > 1 ? " and the " : ""}${stretch > 1 ? `${reflectX ? "" : "The "}stretch` : ""} multipl${reflectX && stretch > 1 ? "y" : "ies"} the root by $${a}$. `}The shift ${k > 0 ? "up" : "down"} ${units(k)} adds $${k}$. So $y = ${answer}$.`,
              `${a === 1 ? "" : `${reflectX ? "关于 $x$ 轴的翻折" : ""}${reflectX && stretch > 1 ? "和" : ""}${stretch > 1 ? "竖直伸长" : ""}把根式乘以 $${a}$。`}向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位，即加上 $${k}$。所以 $y = ${answer}$。`,
            ),
            said(
              `The endpoint $(0, 0)$ of $y = \\sqrt{x}$ should end up at $${pt(h, k)}$, moved by the two shifts. In $y = ${answer}$ the root is $0$ at $x = ${h}$, where $y = ${k}$, so it does.`,
              `$y = \\sqrt{x}$ 的端点 $(0, 0)$ 经过两次平移后应到达 $${pt(h, k)}$。在 $y = ${answer}$ 中，当 $x = ${h}$ 时根式为 $0$，$y = ${k}$，确实如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "equations-from-graphs",
      figure: algebraDrawings3["graph-transformations-of-square-root-functions#equations-from-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "To write the equation of a transformed square-root graph:\n\n1. read the endpoint $(h, k)$;\n2. see which way the graph goes from it: to the right means $\\sqrt{x - h}$, to the left $\\sqrt{h - x}$;\n3. find $a$ from the point one unit across from the endpoint: there the root is $1$, so the graph is $a$ units above the endpoint (below when $a < 0$).\n\nA graph starting at $(2, -1)$, going right and passing through $(3, 1)$ has $a = 2$: $y = 2\\sqrt{x - 2} - 1$.\n\n> **Watch out.** Find $a$ from the point one unit across from the endpoint. Four units across the root is $2$, so there the graph is $2a$ away from the endpoint, not $a$.",
        "要写出变换后平方根函数图象的解析式：\n\n1. 读出端点 $(h, k)$；\n2. 看图象从端点向哪边延伸：向右是 $\\sqrt{x - h}$，向左是 $\\sqrt{h - x}$；\n3. 由与端点水平相距一个单位的点求 $a$：那里根式等于 $1$，所以图象比端点高 $a$ 个单位（$a < 0$ 时是低）。\n\n从 $(2, -1)$ 出发、向右延伸并经过 $(3, 1)$ 的图象有 $a = 2$：$y = 2\\sqrt{x - 2} - 1$。\n\n> **注意。** 要用与端点水平相距一个单位的点求 $a$。水平相距四个单位时根式等于 $2$，图象与端点的竖直距离是 $2a$，而不是 $a$。",
      ),
      generate(rng) {
        const g = randomSqrtGraph(rng);
        const answer = sqrtLatex(g);
        const [, p1, p2] = sqrtPoints(g);
        return {
          ...expressionProblem({
            prompt: t(
              "The graph shown is a transformation of the graph of $y = \\sqrt{x}$. Write its equation.",
              "图中的图象由 $y = \\sqrt{x}$ 的图象变换得到。写出它的解析式。",
            ),
            answer,
            prefix: "y =",
            wrong: [
              rootFn(g.a, sqrtInner(g.s, -g.h), g.k),
              rootFn(g.a, sqrtInner(-g.s, g.h), g.k),
              rootFn(g.a, sqrtInner(g.s, g.k), g.h),
              rootFn(-g.a, sqrtInner(g.s, g.h), g.k),
              rootFn(g.a, sqrtInner(g.s, g.h), -g.k),
            ],
            solution: join(
              label(1, "Read the endpoint and the direction", "读出端点和延伸方向"),
              t(
                `The graph starts at $${pt(g.h, g.k)}$ and extends to the ${g.s > 0 ? "right" : "left"}, so the equation is $y = a${root(2, sqrtInner(g.s, g.h))}${plus(g.k)}$ for some $a$.`,
                `图象从 $${pt(g.h, g.k)}$ 出发向${g.s > 0 ? "右" : "左"}延伸，所以方程形如 $y = a${root(2, sqrtInner(g.s, g.h))}${plus(g.k)}$。`,
              ),
              para,
              label(2, "Find a", "求 a"),
              t(
                `At the marked point $${pt(p1![0], p1![1])}$, one unit across from the endpoint, the root is $1$. The graph is $${g.a}$ from the endpoint's height there, so $a = ${g.a}$ and $y = ${answer}$.`,
                `在与端点水平相距一个单位的标记点 $${pt(p1![0], p1![1])}$ 处，根式为 $1$。图象在那里与端点的高度差为 $${g.a}$，所以 $a = ${g.a}$，$y = ${answer}$。`,
              ),
              said(
                `At $x = ${p2![0]}$ the root is $\\sqrt{4} = 2$, so the equation gives $y = ${g.k} ${g.a < 0 ? "-" : "+"} ${2 * Math.abs(g.a)} = ${p2![1]}$. That is the third marked point, $${pt(p2![0], p2![1])}$.`,
                `当 $x = ${p2![0]}$ 时根式为 $\\sqrt{4} = 2$，方程给出 $y = ${g.k} ${g.a < 0 ? "-" : "+"} ${2 * Math.abs(g.a)} = ${p2![1]}$，正是第三个标记点 $${pt(p2![0], p2![1])}$。`,
              ),
            ),
          }),
          figure: sqrtFigure(g),
        };
      },
    },
    {
      id: "the-direction-of-the-graph",
      figure: algebraDrawings3["graph-transformations-of-square-root-functions#the-direction-of-the-graph"],
      title: t("Which way the graph goes", "图象的延伸方向"),
      explanation: t(
        "From its endpoint, the graph of $y = a\\sqrt{bx + c} + k$ extends:\n\n- to the **right** when $b > 0$ (the radicand grows as $x$ grows) and to the **left** when $b < 0$;\n- **upward** when $a > 0$ and **downward** when $a < 0$.\n\nSo $y = -\\sqrt{4 - 2x} + 3$, with $b = -2$ and $a = -1$, extends to the left and downward.\n\n> **Watch out.** The sign of $b$ inside the root decides left or right, and the sign of $a$ outside decides up or down. Do not mix the two.",
        "从端点出发，$y = a\\sqrt{bx + c} + k$ 的图象：\n\n- 当 $b > 0$ 时向**右**延伸（$x$ 增大时被开方式增大），当 $b < 0$ 时向**左**延伸；\n- 当 $a > 0$ 时向**上**，当 $a < 0$ 时向**下**。\n\n所以 $y = -\\sqrt{4 - 2x} + 3$ 中 $b = -2$，$a = -1$，图象向左下方延伸。\n\n> **注意。** 根号内 $b$ 的符号决定向左还是向右，根号外 $a$ 的符号决定向上还是向下。不要把两者混淆。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const b = rng.pick([1, -1, 2, -2, 3, -3]);
        const c = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const inner = b < 0 && c > 0 && rng.bool() ? poly([c, ""], [b, "x"]) : linear(b, c);
        const correct = (b > 0 ? 0 : 2) + (a > 0 ? 0 : 1);
        const options = [
          t("Right and up", "向右上方"),
          t("Right and down", "向右下方"),
          t("Left and up", "向左上方"),
          t("Left and down", "向左下方"),
        ];
        const x0 = Q.of(-c, b);
        const x1 = Q.of(1 - c, b);
        const sideways = t(
          `The coefficient of $x$ under the root is $${b}$, so the graph goes ${b > 0 ? "right" : "left"}, not ${b > 0 ? "left" : "right"}.`,
          `根号下 $x$ 的系数是 $${b}$，所以图象向${b > 0 ? "右" : "左"}而不是向${b > 0 ? "左" : "右"}。`,
        );
        const upDown = t(
          `The coefficient of the root is $${a}$, so the graph goes ${a > 0 ? "up" : "down"}, not ${a > 0 ? "down" : "up"}.`,
          `根式的系数是 $${a}$，所以图象向${a > 0 ? "上" : "下"}而不是向${a > 0 ? "下" : "上"}。`,
        );
        const whys: Reason[] = options.flatMap((o, i): Reason[] => {
          if (i === correct) return [];
          const h = i >= 2 !== b < 0;
          const v = (i % 2 === 1) !== a < 0;
          const parts = [...(h ? [sideways] : []), ...(v ? [upDown] : [])];
          return [[o.en, parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join("")]];
        });
        return reasoned(
          choiceProblem({
            prompt: t(
              `From its endpoint, in which direction does the graph of $y = ${rootFn(a, inner, k)}$ extend?`,
              `从端点出发，$y = ${rootFn(a, inner, k)}$ 的图象向哪个方向延伸？`,
            ),
            options,
            correct,
            solution: join(
              label(1, "Left or right", "向左还是向右"),
              t(
                `The coefficient of $x$ under the root is $${b}$. It is ${b > 0 ? "positive, so the radicand grows as $x$ grows and the graph extends to the right" : "negative, so the radicand grows as $x$ falls and the graph extends to the left"} of its endpoint.`,
                `根号下 $x$ 的系数是 $${b}$，${b > 0 ? "为正，所以 $x$ 增大时被开方式增大，图象从端点向右延伸" : "为负，所以 $x$ 减小时被开方式增大，图象从端点向左延伸"}。`,
              ),
              para,
              label(2, "Up or down", "向上还是向下"),
              t(
                `The coefficient of the root is $${a}$. It is ${a > 0 ? "positive, so the graph goes up" : "negative, so the graph goes down"} as the root grows. The answer is ${options[correct]!.en.toLowerCase()}.`,
                `根式的系数是 $${a}$，${a > 0 ? "为正，所以根式增大时图象向上" : "为负，所以根式增大时图象向下"}。答案是${options[correct]!["zh-CN"]}。`,
              ),
              said(
                `The endpoint is at $x = ${x0.toLatex()}$, where $y = ${k}$. At $x = ${x1.toLatex()}$ the radicand is $1$ and $y = ${k + a}$. That point is to the ${b > 0 ? "right" : "left"} of the endpoint and ${a > 0 ? "above" : "below"} it.`,
                `端点在 $x = ${x0.toLatex()}$ 处，那里 $y = ${k}$。当 $x = ${x1.toLatex()}$ 时被开方式为 $1$，$y = ${k + a}$。这个点在端点的${b > 0 ? "右" : "左"}${a > 0 ? "上" : "下"}方。`,
              ),
            ),
          }),
          whys,
        );
      },
    },
  ],
};

// 6.21.3 Graphing the cube root function.

const fCbrt = "$f(x) = \\sqrt[3]{x}$";

/** graphingTheCubeRootFunction graphs y = ∛x and its translations and stretches. */
export const graphingTheCubeRootFunction: TopicDef = {
  id: "graphing-the-cube-root-function",
  title: t("Graphing the Cube Root Function", "立方根函数的图象"),
  summary: t(
    "Graph y = ∛x, defined for every real number, through (−8, −2), (−1, −1), (0, 0), (1, 1) and (8, 2), and its transformations y = a∛(x − h) + k.",
    "画出对所有实数都有定义、经过 (−8, −2)、(−1, −1)、(0, 0)、(1, 1)、(8, 2) 的 y = ∛x 的图象，以及它的变换 y = a∛(x − h) + k。",
  ),
  prerequisites: ["graph-transformations-of-square-root-functions", "cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  intro: t(
    `You know how to take cube roots of perfect cubes and how to transform square-root graphs. The cube root is a function too, $f(x) = \\sqrt[3]{x}$, and it gives the edge of a cube from its volume. Unlike the square root, it accepts negative inputs, so its graph extends to both sides.

Take two inputs of opposite signs:

$$\\sqrt[3]{64} = 4 \\text{ because } 4^{3} = 64, \\qquad \\sqrt[3]{-64} = -4 \\text{ because } (-4)^{3} = -64.$$

So $(64, 4)$ and $(-64, -4)$ are both on the graph. Changing the sign of $x$ changes the sign of $y$, so the graph is symmetric about the origin: it comes up from the lower left, passes through $(0, 0)$ and rises slowly to the upper right.`,
    `你会求完全立方数的立方根，也会对平方根图象作变换。立方根也是函数 $f(x) = \\sqrt[3]{x}$，它由正方体的体积给出棱长。和平方根不同，它可以输入负数，所以图象向两边延伸。

取两个符号相反的输入：

$$\\sqrt[3]{64} = 4 \\text{，因为 } 4^{3} = 64, \\qquad \\sqrt[3]{-64} = -4 \\text{，因为 } (-4)^{3} = -64.$$

所以 $(64, 4)$ 和 $(-64, -4)$ 都在图象上。$x$ 变号时 $y$ 也变号，所以图象关于原点对称：它从左下方上来，经过 $(0, 0)$，再缓慢升向右上方。`,
  ),
  knowledgePoints: [
    {
      id: "values-of-the-cube-root-function",
      title: t("Values of the cube root function", "立方根函数的值"),
      explanation: t(
        "The **cube root function** $f(x) = \\sqrt[3]{x}$ takes each real number $x$ to the number $y$ with $y^{3} = x$. Unlike the square root, it is defined for negative numbers too, and its values can be negative: $\\sqrt[3]{-8} = -2$ because $(-2)^{3} = -8$. Perfect cubes give the easiest points: $(-8, -2)$, $(-1, -1)$, $(0, 0)$, $(1, 1)$, $(8, 2)$.\n\nTo find where $f(x) = -3$, cube: $x = (-3)^{3} = -27$.\n\n> **Watch out.** $\\sqrt[3]{-8} = -2$ is a real number. Only an even root of a negative number is not defined.",
        "**立方根函数** $f(x) = \\sqrt[3]{x}$ 把每个实数 $x$ 对应到满足 $y^{3} = x$ 的数 $y$。与平方根不同，它对负数也有定义，函数值也可以是负数：$\\sqrt[3]{-8} = -2$，因为 $(-2)^{3} = -8$。完全立方数给出最容易的点：$(-8, -2)$、$(-1, -1)$、$(0, 0)$、$(1, 1)$、$(8, 2)$。\n\n要求使 $f(x) = -3$ 的 $x$，两边立方：$x = (-3)^{3} = -27$。\n\n> **注意。** $\\sqrt[3]{-8} = -2$ 是实数。只有负数的偶次根才无定义。",
      ),
      figure: cbrtFigure(1, 0, 0),
      generate(rng) {
        let v: Q;
        if (rng.bool(0.7)) v = Q.of(rng.nonZero(-7, 7));
        else {
          const q = rng.int(2, 4);
          let p: number;
          do p = rng.nonZero(-5, 5);
          while (gcd(Math.abs(p), q) !== 1);
          v = Q.of(p, q);
        }
        const cube = v.pow(3);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Let ${fCbrt}. Find $f\\left(${cube.toLatex()}\\right)$.`, `设 ${fCbrt}。求 $f\\left(${cube.toLatex()}\\right)$。`),
            answer: v,
            wrong: [v.neg(), cube.div(Q.of(3)), v.abs()],
            solution: join(
              label(1, "Use the definition", "利用定义"),
              t(
                `$f\\left(${cube.toLatex()}\\right)$ is the real number whose cube is $${cube.toLatex()}$. Since $${cube.toLatex()}$ is ${v.sign() < 0 ? "negative, that number is negative too" : "positive, that number is positive"}.`,
                `$f\\left(${cube.toLatex()}\\right)$ 是立方等于 $${cube.toLatex()}$ 的实数。由于 $${cube.toLatex()}$ 是${v.sign() < 0 ? "负数，这个数也是负数" : "正数，这个数是正数"}。`,
              ),
              para,
              label(2, "Find the number", "找出这个数"),
              both("Try the cube of a simple number:", "试一个简单数的立方：", `\\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}`),
              t(
                `\n\nSo $f\\left(${cube.toLatex()}\\right) = ${v.toLatex()}$.`,
                `\n\n所以 $f\\left(${cube.toLatex()}\\right) = ${v.toLatex()}$。`,
              ),
              said(
                `Each real number has exactly one real cube root, and the cube of $${v.toLatex()}$ is $${cube.toLatex()}$. No other number can be the answer, since $\\sqrt[3]{x}$ always increases.`,
                `每个实数恰好有一个实数立方根，而 $${v.toLatex()}$ 的立方是 $${cube.toLatex()}$。由于 $\\sqrt[3]{x}$ 始终递增，答案不可能是别的数。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Let ${fCbrt}. Find the value of $x$ for which $f(x) = ${v.toLatex()}$.`,
            `设 ${fCbrt}。求使 $f(x) = ${v.toLatex()}$ 的 $x$ 的值。`,
          ),
          answer: cube,
          solveFor: "x",
          wrong: [v.mul(v), cube.neg(), v.mul(Q.of(3))],
          solution: join(
            label(1, "Write the equation", "写出方程"),
            t(
              `$f(x) = ${v.toLatex()}$ means $\\sqrt[3]{x} = ${v.toLatex()}$. A cube root can take any value, ${v.sign() < 0 ? "negative ones included, " : ""}so a solution exists.`,
              `$f(x) = ${v.toLatex()}$ 就是 $\\sqrt[3]{x} = ${v.toLatex()}$。立方根可以取任何值${v.sign() < 0 ? "，包括负数" : ""}，所以有解。`,
            ),
            para,
            label(2, "Cube both sides", "两边立方"),
            both("Cubing undoes the cube root:", "立方可以撤销立方根：", `x = \\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}`),
            said(
              `$\\sqrt[3]{${cube.toLatex()}}$ is the real number whose cube is $${cube.toLatex()}$, and that number is $${v.toLatex()}$. So $f(${cube.toLatex()}) = ${v.toLatex()}$.`,
              `$\\sqrt[3]{${cube.toLatex()}}$ 是立方等于 $${cube.toLatex()}$ 的实数，这个数就是 $${v.toLatex()}$。所以 $f(${cube.toLatex()}) = ${v.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "points-on-the-cube-root-graph",
      figure: algebraDrawings3["graphing-the-cube-root-function#points-on-the-cube-root-graph"],
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "The point $(p, q)$ is on the graph of $y = \\sqrt[3]{x}$ exactly when $q^{3} = p$. The graph lies in quadrants I and III: it runs from the lower left, through the origin, to the upper right, and it is symmetric about the origin, because $\\sqrt[3]{-x} = -\\sqrt[3]{x}$. So $(-27, -3)$ is on the graph, but $(-27, 3)$ and $(9, 3)$ are not.\n\n> **Watch out.** Unlike the square-root graph, this graph has points with negative coordinates. A point $(p, q)$ is on it exactly when $q^{3} = p$.",
        "点 $(p, q)$ 在 $y = \\sqrt[3]{x}$ 的图象上当且仅当 $q^{3} = p$。图象位于第一、第三象限：从左下方经过原点延伸到右上方，并且关于原点对称，因为 $\\sqrt[3]{-x} = -\\sqrt[3]{x}$。所以 $(-27, -3)$ 在图象上，而 $(-27, 3)$ 和 $(9, 3)$ 不在。\n\n> **注意。** 和平方根图象不同，这个图象上有坐标为负的点。点 $(p, q)$ 在图象上，当且仅当 $q^{3} = p$。",
      ),
      generate(rng) {
        const n = rng.nonZero(-6, 6);
        const kind = rng.pick(["on", "on", "on", "sign", "square", "swapped"] as const);
        const m = Math.abs(n) === 1 ? n * 2 : n;
        const [x, y] = kind === "on" ? [n ** 3, n] : kind === "sign" ? [n ** 3, -n] : kind === "square" ? [m * m, m] : [m, m ** 3];
        const on = kind === "on";
        const reason = t(
          `$${paren(y)}^{3} = ${y ** 3}$, which ${on ? "equals" : "is not"} $${x}$.`,
          `$${paren(y)}^{3} = ${y ** 3}$，${on ? "等于" : "不等于"} $${x}$。`,
        );
        return choiceProblem({
          prompt: t(
            `Does the point $${pt(x, y)}$ lie on the graph of $y = \\sqrt[3]{x}$?`,
            `点 $${pt(x, y)}$ 在 $y = \\sqrt[3]{x}$ 的图象上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: join(
            label(1, "State the test", "写出判断条件"),
            t(
              `The point $(p, q)$ is on the graph of $y = \\sqrt[3]{x}$ exactly when $q^{3} = p$. Here $p = ${x}$ and $q = ${y}$.`,
              `点 $(p, q)$ 在 $y = \\sqrt[3]{x}$ 的图象上当且仅当 $q^{3} = p$。这里 $p = ${x}$，$q = ${y}$。`,
            ),
            para,
            label(2, "Apply it", "代入判断"),
            t(`${reason.en} So the answer is ${on ? "yes" : "no"}.`, `${reason["zh-CN"]}所以答案是${on ? "在" : "不在"}。`),
            kind === "on"
              ? said(
                  `The point of the graph above $x = ${x}$ has height $\\sqrt[3]{${x}} = ${n}$, the given $y$-coordinate.`,
                  `图象在 $x = ${x}$ 处的点高度为 $\\sqrt[3]{${x}} = ${n}$，正是所给的纵坐标。`,
                )
              : kind === "sign"
                ? said(
                    `The point of the graph above $x = ${x}$ is $${pt(x, n)}$. A cube root has the same sign as the number, so the height $${y}$ has the wrong sign.`,
                    `图象在 $x = ${x}$ 处的点是 $${pt(x, n)}$。立方根与原数同号，所以高度 $${y}$ 的符号不对。`,
                  )
                : kind === "square"
                  ? said(
                      `The point of the graph at height $${m}$ has $x = ${paren(m)}^{3} = ${m ** 3}$, not $${x}$.`,
                      `图象上高度为 $${m}$ 的点的横坐标是 $${paren(m)}^{3} = ${m ** 3}$，不是 $${x}$。`,
                    )
                  : said(
                      `The point $${pt(m ** 3, m)}$ is on the graph, and the given point swaps its coordinates. Since $${m} \\ne ${m ** 3}$, the two points differ.`,
                      `点 $${pt(m ** 3, m)}$ 在图象上，所给的点把它的两个坐标对调了。由于 $${m} \\ne ${m ** 3}$，这两个点不同。`,
                    ),
          ),
        });
      },
    },
    {
      id: "transformed-cube-root-graphs",
      figure: algebraDrawings3["graphing-the-cube-root-function#transformed-cube-root-graphs"],
      title: t("Transformed cube root graphs", "变换后的立方根函数图象"),
      explanation: t(
        "The graph of $y = \\sqrt[3]{x}$ is steepest at its **center** $(0, 0)$, about which it is symmetric. The graph of $y = a\\sqrt[3]{x - h} + k$ is that graph stretched by $a$ (and reflected when $a < 0$) and moved so that its center is at $(h, k)$. One unit right of the center the root is $1$, so the graph is at height $k + a$.\n\nFor $y = -2\\sqrt[3]{x + 1} + 3$, the center is $(-1, 3)$ and the graph passes through $(0, 1)$ and $(-2, 5)$.\n\n> **Watch out.** The sign inside the root flips. The center of $y = \\sqrt[3]{x + 1} + 3$ is $(-1, 3)$, not $(1, 3)$.",
        "$y = \\sqrt[3]{x}$ 的图象在**中心** $(0, 0)$ 处最陡，并关于它对称。$y = a\\sqrt[3]{x - h} + k$ 的图象是把它伸缩为 $a$ 倍（$a < 0$ 时还要翻折），再移到中心为 $(h, k)$ 的位置。在中心右边一个单位处根式为 $1$，所以图象的高度是 $k + a$。\n\n对于 $y = -2\\sqrt[3]{x + 1} + 3$，中心是 $(-1, 3)$，图象经过 $(0, 1)$ 和 $(-2, 5)$。\n\n> **注意。** 根号内的符号要反过来。$y = \\sqrt[3]{x + 1} + 3$ 的中心是 $(-1, 3)$，而不是 $(1, 3)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const eq = (p: number, q: number, r: number) => same(`$y = ${rootFn(p, shifted(q), r, 3)}$`);
        const whys: Reason[] = [
          [
            eq(a, -h, k).en,
            `This center is at $x = ${-h}$. In $\\sqrt[3]{x - h}$ the center is at $x = h$, so the sign inside is the opposite of the shift.`,
            `这个中心在 $x = ${-h}$。在 $\\sqrt[3]{x - h}$ 中中心在 $x = h$，括号内的符号与平移方向相反。`,
          ],
          [
            eq(a, h, -k).en,
            `This center is at height $${-k}$, but the graph's center is at height $${k}$.`,
            `这个中心的高度是 $${-k}$，而图象中心的高度是 $${k}$。`,
          ],
          [
            eq(-a, h, k).en,
            `With $${-a}$ in front, one unit right of the center the graph would be at height $${k - a}$, not $${k + a}$: it is reflected.`,
            `前面是 $${-a}$ 时，在中心右边一个单位处图象的高度是 $${k - a}$，不是 $${k + a}$：图象被翻折了。`,
          ],
        ];
        return annotate(
          {
            ...reasoned(
              shuffled(
                rng,
                t("Which equation has the graph shown?", "图中的图象是哪个方程的图象？"),
                [eq(a, h, k), eq(a, -h, k), eq(a, h, -k), eq(-a, h, k)],
                join(
                  label(1, "Read the center", "读出中心"),
                  t(
                    `The graph is steepest at its center $${pt(h, k)}$, so the equation has the form $y = a\\sqrt[3]{${shifted(h)}}${plus(k)}$.`,
                    `图象在中心 $${pt(h, k)}$ 处最陡，所以方程形如 $y = a\\sqrt[3]{${shifted(h)}}${plus(k)}$。`,
                  ),
                  para,
                  label(2, "Find a", "求 a"),
                  t(
                    `One unit right of the center, at $${pt(h + 1, k + a)}$, the root is $1$ and the graph is $${a}$ from the center's height. So $a = ${a}$ and $y = ${rootFn(a, shifted(h), k, 3)}$.`,
                    `在中心右边一个单位处 $${pt(h + 1, k + a)}$，根式为 $1$，图象与中心的高度差为 $${a}$。所以 $a = ${a}$，$y = ${rootFn(a, shifted(h), k, 3)}$。`,
                  ),
                  said(
                    `One unit left of the center, at $x = ${h - 1}$, the root is $\\sqrt[3]{-1} = -1$. The equation gives $y = ${k} ${a > 0 ? "-" : "+"} ${Math.abs(a)} = ${k - a}$, which is the marked point $${pt(h - 1, k - a)}$.`,
                    `在中心左边一个单位处 $x = ${h - 1}$，根式为 $\\sqrt[3]{-1} = -1$。方程给出 $y = ${k} ${a > 0 ? "-" : "+"} ${Math.abs(a)} = ${k - a}$，正是标记点 $${pt(h - 1, k - a)}$。`,
                  ),
                ),
              ),
              whys,
            ),
            figure: cbrtFigure(a, h, k),
          },
          view,
          shift([0, 0], [h, k]),
          `The center of the graph moves from the origin to ${at([h, k])}.`,
          `图象的中心从原点移到 ${at([h, k])}。`,
        );
      },
    },
  ],
};

/** paren writes a number in parentheses when it is negative. */
function paren(n: number): string {
  return n < 0 ? `(${n})` : String(n);
}

// 6.21.4 Properties of transformed square root functions.

/** RootFn is f(x) = a·ⁿ√(bx + c) + k. */
interface RootFnDef {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly k: number;
  readonly n: number;
}

const rootFnLatex = (f: RootFnDef) => rootFn(f.a, linear(f.b, f.c), f.k, f.n);

/** endX is the x-coordinate where the radicand bx + c is 0. */
const endX = (f: RootFnDef) => Q.of(-f.c, f.b);

/** randomRootFn draws f(x) = a·ⁿ√(bx + c) + k with small coefficients. */
function randomRootFn(rng: Rng, n = 2): RootFnDef {
  return {
    a: rng.pick([1, -1, 2, -2, 3, -3]),
    b: rng.pick([1, -1, 1, -1, 2, -2, 3, -3]),
    c: rng.int(-9, 9),
    k: rng.nonZero(-9, 9),
    n,
  };
}

/** domainOf is the domain of f: all reals for an odd root, otherwise where bx + c ≥ 0. */
const domainOf = (f: RootFnDef): RealSet => (f.n % 2 === 1 ? realLine : ray(f.b > 0, endX(f)));

/** rangeOf is the range of f: all reals for an odd root, otherwise [k, ∞) or (−∞, k]. */
const rangeOf = (f: RootFnDef): RealSet => (f.n % 2 === 1 ? realLine : ray(f.a > 0, f.k));

const fIs = (f: RootFnDef) => `$f(x) = ${rootFnLatex(f)}$`;

/** propertiesOfTransformedSquareRootFunctions finds where transformed square-root functions increase, their extreme values and intercepts. */
export const propertiesOfTransformedSquareRootFunctions: TopicDef = {
  id: "properties-of-transformed-square-root-functions",
  title: t("Properties of Transformed Square Root Functions", "变换后平方根函数的性质"),
  summary: t(
    "Tell whether a·√(bx + c) + k increases or decreases, find its maximum or minimum value at the endpoint, and find its y-intercept.",
    "判断 a·√(bx + c) + k 是递增还是递减，求它在端点处取得的最大值或最小值，以及它的 y 轴截距。",
  ),
  prerequisites: ["graph-transformations-of-square-root-functions", "increasing-and-decreasing"],
  encompasses: [
    { topic: "graph-transformations-of-square-root-functions", weight: 0.4 },
    { topic: "increasing-and-decreasing", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.IF.B.4"],
  intro: t(
    `You know how to draw $y = a\\sqrt{x - h} + k$ from its endpoint, and what it means for a function to increase or decrease. Reading these properties straight from the equation, without drawing, tells you at once where the function is smallest or largest and whether it crosses the $y$-axis.

Take $f(x) = 2\\sqrt{x - 1} + 3$. Its endpoint is $(1, 3)$, and both $a = 2$ and the coefficient of $x$ are positive, so the graph goes right and up:

- it is increasing;
- its minimum value is $3$, at $x = 1$, and it has no maximum;
- it has no $y$-intercept, since $0$ is not in the domain $[1, \\infty)$: at $x = 0$ the root $\\sqrt{-1}$ is not defined.`,
    `你会由端点画出 $y = a\\sqrt{x - h} + k$ 的图象，也知道函数递增、递减的含义。不画图、直接从解析式读出这些性质，就能立刻知道函数在哪里最小或最大，以及它是否与 $y$ 轴相交。

以 $f(x) = 2\\sqrt{x - 1} + 3$ 为例。它的端点是 $(1, 3)$，$a = 2$ 和 $x$ 的系数都是正数，所以图象向右上方延伸：

- 它是增函数；
- 它的最小值是 $3$，在 $x = 1$ 处取到，没有最大值；
- 它没有 $y$ 轴截距，因为 $0$ 不在定义域 $[1, \\infty)$ 内：当 $x = 0$ 时根式 $\\sqrt{-1}$ 无定义。`,
  ),
  knowledgePoints: [
    {
      id: "increasing-or-decreasing",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "On its domain, $f(x) = a\\sqrt{bx + c} + k$ is either increasing everywhere or decreasing everywhere. As $x$ increases:\n\n- $bx + c$ increases when $b > 0$, so the root increases; it decreases when $b < 0$;\n- multiplying by a negative $a$ reverses the direction.\n\nSo $f$ is **increasing** when $a$ and $b$ have the same sign and **decreasing** when they have opposite signs. $f(x) = -3\\sqrt{2x + 1}$ is decreasing; $f(x) = -\\sqrt{5 - x}$ is increasing.\n\n> **Watch out.** A negative $b$ alone reverses the direction too. $\\sqrt{5 - x}$ is decreasing although $a = 1$ is positive.",
        "在定义域上，$f(x) = a\\sqrt{bx + c} + k$ 要么处处递增，要么处处递减。当 $x$ 增大时：\n\n- 若 $b > 0$，$bx + c$ 增大，根式增大；若 $b < 0$，它减小；\n- 乘以负数 $a$ 会使方向反过来。\n\n所以 $a$ 与 $b$ 同号时 $f$ **递增**，异号时 $f$ **递减**。$f(x) = -3\\sqrt{2x + 1}$ 递减；$f(x) = -\\sqrt{5 - x}$ 递增。\n\n> **注意。** 单独一个负的 $b$ 也会使方向反转。$\\sqrt{5 - x}$ 是减函数，尽管 $a = 1$ 是正数。",
      ),
      keyPrerequisites: ["increasing-and-decreasing"],
      generate(rng) {
        const f = randomRootFn(rng);
        const up = f.a * f.b > 0;
        return choiceProblem({
          prompt: t(`Is ${fIs(f)} increasing or decreasing on its domain?`, `${fIs(f)} 在定义域上是递增还是递减？`),
          options: [t("Increasing", "递增"), t("Decreasing", "递减")],
          correct: up ? 0 : 1,
          solution: join(
            label(1, "Follow the radicand", "看被开方式"),
            t(
              `As $x$ increases, $${linear(f.b, f.c)}$ ${f.b > 0 ? "increases" : "decreases"}, because the coefficient of $x$ is $${f.b}$. So the root ${f.b > 0 ? "increases" : "decreases"}.`,
              `当 $x$ 增大时，$${linear(f.b, f.c)}$ ${f.b > 0 ? "增大" : "减小"}，因为 $x$ 的系数是 $${f.b}$。所以根式${f.b > 0 ? "增大" : "减小"}。`,
            ),
            para,
            label(2, "Apply the coefficient", "看根式的系数"),
            t(
              `Multiplying by $${f.a}$ ${f.a > 0 ? "keeps" : "reverses"} that direction, and adding $${f.k}$ changes nothing. So $f$ is ${up ? "increasing" : "decreasing"}.`,
              `乘以 $${f.a}$ ${f.a > 0 ? "保持" : "反转"}了这个方向，加上 $${f.k}$ 不影响方向。所以 $f$ ${up ? "递增" : "递减"}。`,
            ),
            (() => {
              const [x0, x1] = [endX(f), Q.of(1 - f.c, f.b)];
              const [lo, hi] = f.b > 0 ? [x0, x1] : [x1, x0];
              const [vLo, vHi] = f.b > 0 ? [f.k, f.k + f.a] : [f.k + f.a, f.k];
              return said(
                `Compare two points. At $x = ${lo.toLatex()}$, $f = ${vLo}$, and at the larger $x = ${hi.toLatex()}$, $f = ${vHi}$. The value ${vHi > vLo ? "rose" : "fell"}, as the values of ${up ? "an increasing" : "a decreasing"} function should.`,
                `比较两个点。当 $x = ${lo.toLatex()}$ 时 $f = ${vLo}$，当 $x$ 较大、等于 $${hi.toLatex()}$ 时 $f = ${vHi}$。函数值${vHi > vLo ? "增大" : "减小"}了，符合${up ? "递增" : "递减"}函数。`,
              );
            })(),
          ),
        });
      },
    },
    {
      id: "maximum-or-minimum-value",
      title: t("The maximum or minimum value", "最大值或最小值"),
      explanation: t(
        "A square root is smallest, $0$, at the endpoint, where the radicand is $0$, and grows without bound away from it. So $f(x) = a\\sqrt{bx + c} + k$ takes the value $k$ at its endpoint, and:\n\n- when $a > 0$, $k$ is its **minimum** value and it has no maximum;\n- when $a < 0$, $k$ is its **maximum** value and it has no minimum.\n\n$f(x) = -2\\sqrt{x - 3} + 5$ has the maximum value $5$, at $x = 3$.\n\n> **Watch out.** A square-root function has only one of the two. With $a > 0$ it grows without bound, so it has a minimum $k$ and no maximum.",
        "平方根在端点（被开方式为 $0$ 处）最小，等于 $0$，离开端点后无限增大。所以 $f(x) = a\\sqrt{bx + c} + k$ 在端点处取值 $k$，并且：\n\n- 当 $a > 0$ 时，$k$ 是它的**最小值**，它没有最大值；\n- 当 $a < 0$ 时，$k$ 是它的**最大值**，它没有最小值。\n\n$f(x) = -2\\sqrt{x - 3} + 5$ 的最大值是 $5$，在 $x = 3$ 处取得。\n\n> **注意。** 平方根函数只有最大值和最小值中的一个。当 $a > 0$ 时它无限增大，所以只有最小值 $k$，没有最大值。",
      ),
      keyPrerequisites: ["global-extrema"],
      generate(rng) {
        const f = randomRootFn(rng);
        const x0 = endX(f);
        const min = (v: Coefficient) => t(`A minimum value of $${num(v)}$`, `最小值 $${num(v)}$`);
        const max = (v: Coefficient) => t(`A maximum value of $${num(v)}$`, `最大值 $${num(v)}$`);
        const [right, other] = f.a > 0 ? [min, max] : [max, min];
        return reasoned(
          shuffled(
            rng,
            t(`Which describes ${fIs(f)}?`, `下列哪一项描述了 ${fIs(f)}？`),
            [right(f.k), other(f.k), right(x0), other(x0), t("Neither a maximum nor a minimum value", "既没有最大值也没有最小值")],
            join(
              label(1, "Evaluate at the endpoint", "求端点处的值"),
              t(
                `The radicand $${linear(f.b, f.c)}$ is $0$ at $x = ${x0.toLatex()}$. There the root is $0$ and $f = ${f.k}$.`,
                `被开方式 $${linear(f.b, f.c)}$ 在 $x = ${x0.toLatex()}$ 处为 $0$。那里根式为 $0$，$f = ${f.k}$。`,
              ),
              para,
              label(2, "See which way f goes", "看 f 的走向"),
              t(
                `Away from the endpoint the root grows without bound, and multiplying by $${f.a}$ makes $f$ ${f.a > 0 ? "grow" : "fall"}. So $${f.k}$ is the ${f.a > 0 ? "minimum" : "maximum"} value, and there is no ${f.a > 0 ? "maximum" : "minimum"}.`,
                `离开端点后根式无限增大，乘以 $${f.a}$ 使 $f$ ${f.a > 0 ? "增大" : "减小"}。所以 $${f.k}$ 是${f.a > 0 ? "最小值" : "最大值"}，没有${f.a > 0 ? "最大值" : "最小值"}。`,
              ),
              said(
                `At $x = ${Q.of(1 - f.c, f.b).toLatex()}$ the radicand is $1$ and $f = ${f.k + f.a}$, which is ${f.a > 0 ? "above" : "below"} $${f.k}$. Every other value lies on that side of $${f.k}$ too, as expected.`,
                `当 $x = ${Q.of(1 - f.c, f.b).toLatex()}$ 时被开方式为 $1$，$f = ${f.k + f.a}$，${f.a > 0 ? "大于" : "小于"} $${f.k}$。函数值只在 $${f.k}$ 的这一侧，与结论一致。`,
              ),
            ),
          ),
          [
            [
              other(f.k).en,
              `The value is right but not its kind: multiplying the root by $${f.a}$ makes $f$ ${f.a > 0 ? "grow" : "fall"} away from the endpoint.`,
              `数值对了，但类型错了：根式乘以 $${f.a}$ 后，离开端点时 $f$ ${f.a > 0 ? "增大" : "减小"}。`,
            ],
            [
              right(x0).en,
              "This is the input at the endpoint: the extreme value is the output there.",
              "这是端点处的输入：极值是那里的输出。",
            ],
            [
              other(x0).en,
              "This takes the input at the endpoint as the value, and gets the kind wrong too.",
              "这里把端点处的输入当成了值，类型也错了。",
            ],
            [
              "Neither a maximum nor a minimum value",
              "The graph starts at its endpoint and goes only one way from there, so the endpoint gives an extreme value.",
              "图象从端点出发只朝一个方向走，所以端点处取得极值。",
            ],
          ],
        );
      },
    },
    {
      id: "the-y-intercept-of-a-square-root-function",
      figure: algebraDrawings3["properties-of-transformed-square-root-functions#the-y-intercept-of-a-square-root-function"],
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "The graph crosses the $y$-axis where $x = 0$, so the $y$-intercept is $f(0)$, provided $0$ is in the domain. For $f(x) = 3\\sqrt{4 - x} - 7$:\n\n$$f(0) = 3\\sqrt{4} - 7 = 3 \\cdot 2 - 7 = -1.$$\n\nSo the graph crosses the $y$-axis at $(0, -1)$.\n\n> **Watch out.** Check first that $0$ is in the domain. $f(x) = \\sqrt{x - 4}$ has no $y$-intercept, because $\\sqrt{-4}$ is not defined.",
        "图象在 $x = 0$ 处与 $y$ 轴相交，所以只要 $0$ 在定义域内，$y$ 轴截距就是 $f(0)$。对于 $f(x) = 3\\sqrt{4 - x} - 7$：\n\n$$f(0) = 3\\sqrt{4} - 7 = 3 \\cdot 2 - 7 = -1,$$\n\n所以图象与 $y$ 轴交于 $(0, -1)$。\n\n> **注意。** 先检查 $0$ 是否在定义域内。$f(x) = \\sqrt{x - 4}$ 没有 $y$ 轴截距，因为 $\\sqrt{-4}$ 无定义。",
      ),
      generate(rng) {
        const s = rng.int(0, 7);
        const f = { ...randomRootFn(rng), c: s * s };
        const answer = f.a * s + f.k;
        const inner = f.b < 0 && f.c > 0 && rng.bool() ? poly([f.c, ""], [f.b, "x"]) : linear(f.b, f.c);
        const written = rootFn(f.a, inner, f.k);
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = ${written}$ crosses the $y$-axis at the point $(0, m)$. Find $m$.`,
            `$f(x) = ${written}$ 的图象与 $y$ 轴交于点 $(0, m)$。求 $m$。`,
          ),
          answer,
          solveFor: "m",
          wrong: [f.a * f.c + f.k, f.k, f.a * s - f.k, -answer],
          solution: join(
            label(1, "Substitute x = 0", "代入 x = 0"),
            t(
              `The graph meets the $y$-axis where $x = 0$, so $m = f(0)$. At $x = 0$ the radicand is $${f.c}$, which is not negative, so $0$ is in the domain.`,
              `图象在 $x = 0$ 处与 $y$ 轴相交，所以 $m = f(0)$。当 $x = 0$ 时被开方式为 $${f.c}$，不是负数，所以 $0$ 在定义域内。`,
            ),
            para,
            label(2, "Evaluate", "计算"),
            both(
              `Take the root, $\\sqrt{${f.c}} = ${s}$, then multiply and add:`,
              `先开方，$\\sqrt{${f.c}} = ${s}$，再相乘、相加：`,
              `m = ${front(f.a)}\\sqrt{${f.c}}${plus(f.k)} = ${f.a === 1 ? s : `${f.a} \\cdot ${s}`}${plus(f.k)} = ${answer}`,
            ),
            said(
              `Work backwards from $m = ${answer}$. Subtracting $${f.k}$ and dividing by $${f.a}$ gives $${s}$, and $${s}^{2} = ${f.c}$ is the radicand at $x = 0$.`,
              `从 $m = ${answer}$ 倒推。减去 $${f.k}$ 再除以 $${f.a}$ 得 $${s}$，而 $${s}^{2} = ${f.c}$ 正是 $x = 0$ 时的被开方式。`,
            ),
          ),
        });
      },
    },
  ],
};

// 6.21.5 The domain of a transformed radical function.

/** domainWork solves bx + c ≥ 0 (or > 0 when strict) for x and names the resulting set. */
function domainWork(f: RootFnDef, x0: Q, set: RealSet, strict = false): Text {
  const rel = strict ? ">" : "\\ge";
  const flip = strict ? "<" : "\\le";
  const last = `x ${f.b > 0 ? rel : flip} ${x0.toLatex()}`;
  const lines = [
    `${linear(f.b, f.c)} ${rel} 0`,
    ...(f.c === 0 || f.b === 1 ? [] : [`${linear(f.b, 0)} ${rel} ${-f.c}`]),
    ...(f.c === 0 && f.b === 1 ? [] : [last]),
  ];
  const move =
    f.c === 0 ? [] : [t(`${f.c > 0 ? "subtract" : "add"} $${Math.abs(f.c)}$`, `${f.c > 0 ? "减去" : "加上"} $${Math.abs(f.c)}$`)];
  const divide =
    f.b === 1
      ? []
      : [
          t(
            `divide by $${f.b}$${f.b < 0 ? `, reversing the inequality because $${f.b}$ is negative` : ""}`,
            `除以 $${f.b}$${f.b < 0 ? `，因为 $${f.b}$ 是负数，不等号方向改变` : ""}`,
          ),
        ];
  const moves = [...move, ...divide];
  const en = moves.map((m) => m.en).join(", then ");
  const work = both(
    moves.length === 0 ? "The condition already gives $x$:" : `${en.charAt(0).toUpperCase()}${en.slice(1)}:`,
    moves.length === 0 ? "条件已经直接给出 $x$：" : `${moves.map((m) => m["zh-CN"]).join("，再")}：`,
    ...lines,
  );
  return join(work, t(`\n\nThe domain is ${setText(set)}.`, `\n\n定义域是 ${setText(set)}。`));
}

/** domainCheck tests one input on each side of the endpoint x0 of the radicand bx + c. */
function domainCheck(f: RootFnDef, x0: Q): Text {
  const step = Q.of(f.b > 0 ? 1 : -1);
  const [inside, outside] = [x0.add(step), x0.sub(step)];
  const B = Math.abs(f.b);
  return said(
    `At $x = ${inside.toLatex()}$, inside the answer, the radicand is $${B}$, which is not negative. At $x = ${outside.toLatex()}$, outside it, the radicand is $${-B}$, and the root is not defined there.`,
    `在答案之内的 $x = ${inside.toLatex()}$ 处，被开方式为 $${B}$，不是负数。在答案之外的 $x = ${outside.toLatex()}$ 处，被开方式为 $${-B}$，根式无定义。`,
  );
}

/** theDomainOfATransformedRadicalFunction finds the domains of functions built from square, cube and higher roots. */
export const theDomainOfATransformedRadicalFunction: TopicDef = {
  id: "the-domain-of-a-transformed-radical-function",
  title: t("The Domain of a Transformed Radical Function", "变换后根式函数的定义域"),
  summary: t(
    "Find the domain of a·ⁿ√(bx + c) + k: where bx + c ≥ 0 for an even root, every real number for an odd root.",
    "求 a·ⁿ√(bx + c) + k 的定义域：偶次根要求 bx + c ≥ 0，奇次根对所有实数都有定义。",
  ),
  prerequisites: [
    "properties-of-transformed-square-root-functions",
    "graphing-the-cube-root-function",
    "the-domain-and-range-of-transformed-functions",
    "intersections-of-intervals",
  ],
  encompasses: [{ topic: "domain-of-a-function", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  intro: t(
    `You know that the domain of a function is the set of inputs where it is defined, and that a square root needs a radicand that is not negative. For a transformed radical function, that one condition becomes a linear inequality. Knowing the domain tells you where the graph exists before you draw it.

Take $f(x) = \\sqrt{3x + 12} - 5$. The radicand must not be negative:

$$3x + 12 \\ge 0, \\qquad 3x \\ge -12, \\qquad x \\ge -4.$$

So the domain is $[-4, \\infty)$. The $-5$ outside the root plays no part. Check two inputs: at $x = -4$ the radicand is $0$, which is allowed, and at $x = -5$ it is $-3$, so the root is not defined there.`,
    `你知道函数的定义域是使它有定义的输入的集合，也知道平方根要求被开方式不是负数。对变换后的根式函数，这一个条件就变成一个一次不等式。知道了定义域，作图之前就知道图象在哪里存在。

以 $f(x) = \\sqrt{3x + 12} - 5$ 为例。被开方式不能是负数：

$$3x + 12 \\ge 0, \\qquad 3x \\ge -12, \\qquad x \\ge -4.$$

所以定义域是 $[-4, \\infty)$。根号外的 $-5$ 不起作用。检验两个输入：当 $x = -4$ 时被开方式为 $0$，可以取；当 $x = -5$ 时被开方式为 $-3$，根式无定义。`,
  ),
  knowledgePoints: [
    {
      id: "domain-of-a-square-root-function",
      title: t("Square roots", "平方根"),
      explanation: t(
        "A square root is defined only when its radicand is not negative. So the domain of $f(x) = a\\sqrt{bx + c} + k$ is the solution set of $bx + c \\ge 0$; $a$ and $k$ do not matter. Dividing by a negative $b$ reverses the inequality.\n\nFor $f(x) = 4\\sqrt{6 - 2x} + 1$: $6 - 2x \\ge 0$ gives $x \\le 3$, so the domain is $(-\\infty, 3]$.\n\n> **Watch out.** The radicand may be $0$, so solve $bx + c \\ge 0$, not $bx + c > 0$. The endpoint belongs to the domain.",
        "平方根只在被开方式不是负数时有定义。所以 $f(x) = a\\sqrt{bx + c} + k$ 的定义域是 $bx + c \\ge 0$ 的解集；与 $a$、$k$ 无关。除以负数 $b$ 时不等号方向改变。\n\n对于 $f(x) = 4\\sqrt{6 - 2x} + 1$：由 $6 - 2x \\ge 0$ 得 $x \\le 3$，所以定义域是 $(-\\infty, 3]$。\n\n> **注意。** 被开方式可以等于 $0$，所以解 $bx + c \\ge 0$，而不是 $bx + c > 0$。端点属于定义域。",
      ),
      generate(rng) {
        const f: RootFnDef = { ...randomRootFn(rng), b: rng.pick([1, -1, 2, -2, 3, -3, 4, -4]), c: rng.nonZero(-12, 12) };
        const x0 = endX(f);
        const set = domainOf(f);
        return intervalProblem({
          prompt: t(`Find the domain of ${fIs(f)}. ${asInterval.en}`, `求 ${fIs(f)} 的定义域。${asInterval["zh-CN"]}`),
          set,
          form: "interval",
          wrong: [ray(f.b > 0, x0, false), ray(f.b < 0, x0), ray(f.b > 0, x0.neg()), rangeOf(f), realLine],
          solution: join(
            label(1, "Write the condition", "写出条件"),
            t(
              `A square root is defined only when its radicand is not negative, so $${linear(f.b, f.c)} \\ge 0$. The numbers $${f.a}$ and $${f.k}$ outside the root do not matter.`,
              `平方根只在被开方式不是负数时有定义，所以 $${linear(f.b, f.c)} \\ge 0$。根号外的 $${f.a}$ 和 $${f.k}$ 不影响定义域。`,
            ),
            para,
            label(2, "Solve the inequality", "解不等式"),
            domainWork(f, x0, set),
            domainCheck(f, x0),
          ),
        });
      },
    },
    {
      id: "even-and-odd-roots",
      title: t("Even and odd roots", "偶次根与奇次根"),
      explanation: t(
        "Every real number has exactly one real cube root, so a cube root, and any odd root, is defined everywhere: the domain of $f(x) = a\\sqrt[3]{bx + c} + k$ is $(-\\infty, \\infty)$. An even root, such as a square root or a fourth root, needs a radicand that is not negative.\n\n$f(x) = \\sqrt[5]{2x - 9}$ has domain $(-\\infty, \\infty)$, but $g(x) = \\sqrt[4]{2x - 9}$ has domain $\\left[\\frac{9}{2}, \\infty\\right)$.\n\n> **Watch out.** Look at the index, not at the radicand. $\\sqrt[3]{x - 7}$ is defined for every $x$, even where $x - 7 < 0$.",
        "每个实数都恰好有一个实数立方根，所以立方根以及任何奇次根处处有定义：$f(x) = a\\sqrt[3]{bx + c} + k$ 的定义域是 $(-\\infty, \\infty)$。偶次根（如平方根、四次根）要求被开方式不是负数。\n\n$f(x) = \\sqrt[5]{2x - 9}$ 的定义域是 $(-\\infty, \\infty)$，而 $g(x) = \\sqrt[4]{2x - 9}$ 的定义域是 $\\left[\\frac{9}{2}, \\infty\\right)$。\n\n> **注意。** 要看根指数，而不是看被开方式。$\\sqrt[3]{x - 7}$ 对每个 $x$ 都有定义，即使 $x - 7 < 0$。",
      ),
      generate(rng) {
        const n = rng.pick([2, 3, 3, 4, 5]);
        const f = { ...randomRootFn(rng, n), c: rng.nonZero(-12, 12) };
        const x0 = endX(f);
        const set = domainOf(f);
        const odd = n % 2 === 1;
        return intervalProblem({
          prompt: t(`Find the domain of ${fIs(f)}. ${asInterval.en}`, `求 ${fIs(f)} 的定义域。${asInterval["zh-CN"]}`),
          set,
          form: "interval",
          wrong: odd ? [ray(f.b > 0, x0), ray(f.b < 0, x0)] : [realLine, ray(f.b < 0, x0), ray(f.b > 0, x0, false)],
          solution: odd
            ? join(
                label(1, "Look at the index", "看根指数"),
                t(
                  `The index is $${n}$, which is odd. Every real number, negative ones included, has exactly one real ${n === 3 ? "cube" : `${n}th`} root.`,
                  `根指数是 $${n}$，是奇数。每个实数（包括负数）都恰好有一个实数${n === 3 ? "立方" : `${n} 次方`}根。`,
                ),
                para,
                label(2, "Conclude", "得出结论"),
                t(
                  `So the radicand $${linear(f.b, f.c)}$ may take any value, and the domain is ${setText(set)}.`,
                  `所以被开方式 $${linear(f.b, f.c)}$ 可以取任何值，定义域是 ${setText(set)}。`,
                ),
                said(
                  `Take $x = ${x0.sub(Q.of(f.b > 0 ? 1 : -1)).toLatex()}$, where the radicand is $${-Math.abs(f.b)}$. Its ${n === 3 ? "cube" : `${n}th`} root is $-\\sqrt[${n}]{${Math.abs(f.b)}}$, a real number, so even this input is allowed.`,
                  `取 $x = ${x0.sub(Q.of(f.b > 0 ? 1 : -1)).toLatex()}$，此时被开方式为 $${-Math.abs(f.b)}$。它的${n === 3 ? "立方" : `${n} 次方`}根是 $-\\sqrt[${n}]{${Math.abs(f.b)}}$，是实数，所以这个输入也可以。`,
                ),
              )
            : join(
                label(1, "Look at the index", "看根指数"),
                t(
                  `The index is $${n}$, which is even. An even root needs a radicand that is not negative, so $${linear(f.b, f.c)} \\ge 0$.`,
                  `根指数是 $${n}$，是偶数。偶次根要求被开方式不是负数，所以 $${linear(f.b, f.c)} \\ge 0$。`,
                ),
                para,
                label(2, "Solve the inequality", "解不等式"),
                domainWork(f, x0, set),
                domainCheck(f, x0),
              ),
        });
      },
    },
    {
      id: "several-conditions",
      title: t("Several conditions at once", "同时满足几个条件"),
      explanation: t(
        "When a function has several parts, $x$ must satisfy the condition of each part:\n\n- every even root needs a radicand that is not negative;\n- a denominator must not be $0$, so a square root in a denominator needs a **positive** radicand;\n- an odd root adds no condition.\n\nFor $f(x) = \\sqrt{x + 2} + \\sqrt{5 - x}$: $x \\ge -2$ and $x \\le 5$, so the domain is $[-2, 5]$. For $g(x) = \\frac{3}{\\sqrt{x - 1}}$: $x - 1 > 0$, so the domain is $(1, \\infty)$.\n\n> **Watch out.** Every condition must hold at the same time, so intersect the sets. Their union would let in inputs where one root is not defined.",
        "当函数由几部分组成时，$x$ 必须满足每一部分的条件：\n\n- 每个偶次根的被开方式都不能是负数；\n- 分母不能为 $0$，所以分母中的平方根要求被开方式为**正数**；\n- 奇次根不增加条件。\n\n对于 $f(x) = \\sqrt{x + 2} + \\sqrt{5 - x}$：$x \\ge -2$ 且 $x \\le 5$，所以定义域是 $[-2, 5]$。对于 $g(x) = \\frac{3}{\\sqrt{x - 1}}$：$x - 1 > 0$，所以定义域是 $(1, \\infty)$。\n\n> **注意。** 所有条件必须同时成立，所以要取交集。取并集会放进使某个根式无定义的输入。",
      ),
      keyPrerequisites: ["intersections-of-intervals"],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const p = rng.int(-9, 6);
          const q = rng.int(p + 1, 9);
          const set = between(p, q);
          const f = `\\sqrt{${shifted(p)}} + \\sqrt{${flipped(q)}}`;
          return intervalProblem({
            prompt: t(`Find the domain of $f(x) = ${f}$. ${asInterval.en}`, `求 $f(x) = ${f}$ 的定义域。${asInterval["zh-CN"]}`),
            set,
            form: "interval",
            wrong: [atLeast(p), atMost(q), union(iv(p, q, false, false)), between(-q, -p)],
            solution: join(
              label(1, "Write a condition for each root", "写出每个根式的条件"),
              t(
                `Both radicands must not be negative. $${shifted(p)} \\ge 0$ gives $x \\ge ${p}$, and $${flipped(q)} \\ge 0$ gives $x \\le ${q}$.`,
                `两个被开方式都不能是负数。由 $${shifted(p)} \\ge 0$ 得 $x \\ge ${p}$，由 $${flipped(q)} \\ge 0$ 得 $x \\le ${q}$。`,
              ),
              para,
              label(2, "Intersect", "取交集"),
              t(
                `$x$ must satisfy both, so $${p} \\le x \\le ${q}$. The domain is ${setText(set)}.`,
                `$x$ 必须同时满足两个条件，所以 $${p} \\le x \\le ${q}$。定义域是 ${setText(set)}。`,
              ),
              said(
                `At $x = ${p - 1}$ the first radicand is $-1$, and at $x = ${q + 1}$ the second is $-1$, so both values are excluded. At $x = ${p}$ the radicands are $0$ and $${q - p}$, both allowed.`,
                `当 $x = ${p - 1}$ 时第一个被开方式为 $-1$，当 $x = ${q + 1}$ 时第二个为 $-1$，所以这两个值都不行。当 $x = ${p}$ 时两个被开方式分别为 $0$ 和 $${q - p}$，都可以。`,
              ),
            ),
          });
        }
        if (kind === 1) {
          const k = rng.nonZero(-9, 9);
          const b = rng.pick([1, -1, 2, -2, 3]);
          const c = rng.nonZero(-9, 9);
          const x0 = Q.of(-c, b);
          const set = ray(b > 0, x0, false);
          const f = `\\frac{${k}}{\\sqrt{${linear(b, c)}}}`;
          return intervalProblem({
            prompt: t(`Find the domain of $f(x) = ${f}$. ${asInterval.en}`, `求 $f(x) = ${f}$ 的定义域。${asInterval["zh-CN"]}`),
            set,
            form: "interval",
            wrong: [ray(b > 0, x0), ray(b < 0, x0, false), ray(b > 0, x0.neg(), false)],
            solution: join(
              label(1, "Write the condition", "写出条件"),
              t(
                `The radicand must not be negative, and the root must not be $0$ because it is in the denominator. So the radicand must be positive: $${linear(b, c)} > 0$.`,
                `被开方式不能是负数，而根式在分母中又不能为 $0$，所以被开方式必须为正：$${linear(b, c)} > 0$。`,
              ),
              para,
              label(2, "Solve the inequality", "解不等式"),
              domainWork({ a: 1, b, c, k: 0, n: 2 }, x0, set, true),
              said(
                `At $x = ${x0.toLatex()}$ the root is $0$, so the fraction is $\\frac{${k}}{0}$, which is not defined: the end is left out. At $x = ${x0.add(Q.of(b > 0 ? 1 : -1)).toLatex()}$ the radicand is $${Math.abs(b)}$ and the fraction is a real number.`,
                `当 $x = ${x0.toLatex()}$ 时根式为 $0$，分式为 $\\frac{${k}}{0}$，无定义：端点不在定义域内。当 $x = ${x0.add(Q.of(b > 0 ? 1 : -1)).toLatex()}$ 时被开方式为 $${Math.abs(b)}$，分式是实数。`,
              ),
            ),
          });
        }
        const p = rng.int(-8, 8);
        let q: number;
        do q = rng.int(-8, 8);
        while (q === p);
        const set = atLeast(p);
        const f = `\\sqrt{${shifted(p)}} + \\sqrt[3]{${shifted(q)}}`;
        return intervalProblem({
          prompt: t(`Find the domain of $f(x) = ${f}$. ${asInterval.en}`, `求 $f(x) = ${f}$ 的定义域。${asInterval["zh-CN"]}`),
          set,
          form: "interval",
          wrong: [atLeast(Math.max(p, q)), atLeast(q), realLine, atLeast(p, false)],
          solution: join(
            label(1, "The square root", "平方根"),
            t(
              `The square root needs $${shifted(p)} \\ge 0$, that is, $x \\ge ${p}$.`,
              `平方根要求 $${shifted(p)} \\ge 0$，即 $x \\ge ${p}$。`,
            ),
            para,
            label(2, "The cube root", "立方根"),
            t(
              `The cube root is defined for every $x$, so it adds no condition. The domain is ${setText(set)}.`,
              `立方根对所有 $x$ 都有定义，不增加条件。定义域是 ${setText(set)}。`,
            ),
            said(
              `At $x = ${p}$ the square root is $0$ and the cube root is $\\sqrt[3]{${p - q}}$, both real. At $x = ${p - 1}$ the square root's radicand is $-1$, so that input is excluded.`,
              `当 $x = ${p}$ 时平方根为 $0$，立方根为 $\\sqrt[3]{${p - q}}$，都是实数。当 $x = ${p - 1}$ 时平方根的被开方式为 $-1$，所以这个输入不行。`,
            ),
          ),
        });
      },
    },
  ],
};

// 6.21.6 The range of a transformed radical function.

/** theRangeOfATransformedRadicalFunction finds the ranges of transformed radical functions, also on restricted domains. */
export const theRangeOfATransformedRadicalFunction: TopicDef = {
  id: "the-range-of-a-transformed-radical-function",
  title: t("The Range of a Transformed Radical Function", "变换后根式函数的值域"),
  summary: t(
    "Find the range of a·√(bx + c) + k from the sign of a and the value k at the endpoint, also on a restricted domain and from a graph.",
    "由 a 的符号和端点处的值 k 求 a·√(bx + c) + k 的值域，包括限制定义域时和从图象读出的情形。",
  ),
  prerequisites: ["the-domain-of-a-transformed-radical-function"],
  encompasses: [{ topic: "range-of-a-function", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.C.7.B"],
  intro: t(
    `You know how to find the domain of a transformed radical function, and that the range is the set of outputs. The range tells you which equations $f(x) = T$ can be solved at all, and for a radical function it can be read from just two numbers in the equation.

Take $f(x) = 2\\sqrt{x - 5} + 1$. Build the outputs from the root outward:

$$\\sqrt{x - 5} \\ge 0, \\qquad 2\\sqrt{x - 5} \\ge 0, \\qquad 2\\sqrt{x - 5} + 1 \\ge 1.$$

So the range is $[1, \\infty)$: the value $1$ is reached at the endpoint $x = 5$, and larger $x$ give every value above it. An equation such as $f(x) = -3$ therefore has no solution.`,
    `你会求变换后根式函数的定义域，也知道值域是输出的集合。值域告诉你哪些方程 $f(x) = T$ 有解；对根式函数，只看解析式中的两个数就能读出值域。

以 $f(x) = 2\\sqrt{x - 5} + 1$ 为例。从根式开始逐步得到输出：

$$\\sqrt{x - 5} \\ge 0, \\qquad 2\\sqrt{x - 5} \\ge 0, \\qquad 2\\sqrt{x - 5} + 1 \\ge 1.$$

所以值域是 $[1, \\infty)$：在端点 $x = 5$ 处取到 $1$，更大的 $x$ 取遍 $1$ 以上的所有值。因此像 $f(x) = -3$ 这样的方程无解。`,
  ),
  knowledgePoints: [
    {
      id: "range-of-a-radical-function",
      title: t("The range from the equation", "由解析式求值域"),
      explanation: t(
        "An even root takes every value from $0$ up, so $a\\sqrt{bx + c}$ takes every value from $0$ up when $a > 0$ and from $0$ down when $a < 0$. Adding $k$ moves the start to $k$:\n\n- $a > 0$: the range is $[k, \\infty)$;\n- $a < 0$: the range is $(-\\infty, k]$.\n\nThe inside, $bx + c$, does not change the range. An odd root takes every real value, so its range is $(-\\infty, \\infty)$. For $f(x) = -3\\sqrt[4]{x + 8} + 2$, the range is $(-\\infty, 2]$.\n\n> **Watch out.** The range starts at $k$, not at the $x$-coordinate of the endpoint. The numbers $b$ and $c$ only move the graph sideways.",
        "偶次根取遍从 $0$ 开始的所有值，所以当 $a > 0$ 时 $a\\sqrt{bx + c}$ 取遍从 $0$ 往上的所有值，当 $a < 0$ 时取遍从 $0$ 往下的所有值。加上 $k$ 把起点移到 $k$：\n\n- $a > 0$：值域是 $[k, \\infty)$；\n- $a < 0$：值域是 $(-\\infty, k]$。\n\n内部的 $bx + c$ 不改变值域。奇次根取遍所有实数，所以值域是 $(-\\infty, \\infty)$。对于 $f(x) = -3\\sqrt[4]{x + 8} + 2$，值域是 $(-\\infty, 2]$。\n\n> **注意。** 值域从 $k$ 开始，而不是从端点的横坐标开始。$b$ 和 $c$ 只使图象左右移动。",
      ),
      generate(rng) {
        const f = randomRootFn(rng, rng.pick([2, 2, 2, 3, 4]));
        const set = rangeOf(f);
        const odd = f.n % 2 === 1;
        return intervalProblem({
          prompt: t(`Find the range of ${fIs(f)}. ${asInterval.en}`, `求 ${fIs(f)} 的值域。${asInterval["zh-CN"]}`),
          set,
          form: "interval",
          wrong: odd
            ? [ray(f.a > 0, f.k), ray(f.b > 0, endX(f))]
            : [ray(f.a < 0, f.k), ray(f.a > 0, f.k, false), ray(f.b > 0, endX(f)), ray(f.a > 0, -f.k), realLine],
          solution: odd
            ? join(
                label(1, "Look at the index", "看根指数"),
                t(
                  `The index $${f.n}$ is odd, so the root takes every real value as $x$ runs over all real numbers.`,
                  `根指数 $${f.n}$ 是奇数，所以当 $x$ 取遍所有实数时，根式取遍所有实数。`,
                ),
                para,
                label(2, "Multiply and add", "相乘再相加"),
                t(
                  `Multiplying every real number by $${f.a}$ and adding $${f.k}$ still gives every real number. The range is ${setText(set)}.`,
                  `把所有实数乘以 $${f.a}$ 再加上 $${f.k}$，得到的仍是所有实数。值域是 ${setText(set)}。`,
                ),
                said(
                  `Any target $T$ is reached. $f(x) = T$ needs the root to equal $\\frac{T${plus(-f.k)}}{${f.a}}$, and an odd root takes every value, so some $x$ gives it.`,
                  `任何目标值 $T$ 都能取到。$f(x) = T$ 要求根式等于 $\\frac{T${plus(-f.k)}}{${f.a}}$，而奇次根取遍所有值，所以总有某个 $x$ 使它成立。`,
                ),
              )
            : join(
                label(1, "Start from the root", "从根式开始"),
                t(
                  `An even root takes every value $\\ge 0$ and no negative value. The inside, $${linear(f.b, f.c)}$, only decides where this happens.`,
                  `偶次根取遍所有 $\\ge 0$ 的值，不取负值。内部的 $${linear(f.b, f.c)}$ 只决定在哪里取到这些值。`,
                ),
                para,
                label(2, "Multiply and add", "相乘再相加"),
                t(
                  `Multiplying by $${f.a}$ gives every value ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"}, and adding $${f.k}$ gives every value ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$. The range is ${setText(set)}.`,
                  `乘以 $${f.a}$ 后取遍所有 ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"} 的值，再加上 $${f.k}$ 后取遍所有 ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$ 的值。值域是 ${setText(set)}。`,
                ),
                said(
                  `Where the radicand is $0$, $f = ${f.k}$, the end of the range. Where the radicand is $1$, $f = ${f.k + f.a}$, which is ${f.a > 0 ? "above" : "below"} $${f.k}$ and so inside the range.`,
                  `被开方式为 $0$ 时 $f = ${f.k}$，正是值域的端点。被开方式为 $1$ 时 $f = ${f.k + f.a}$，${f.a > 0 ? "大于" : "小于"} $${f.k}$，在值域内。`,
                ),
              ),
        });
      },
    },
    {
      id: "range-on-a-restricted-domain",
      title: t("On a restricted domain", "限制定义域时的值域"),
      explanation: t(
        "A transformed square-root function is either increasing or decreasing, so on an interval $[p, q]$ its least and greatest values are at the ends. Evaluate $f$ at both ends; the range runs from the smaller value to the larger.\n\nFor $f(x) = -2\\sqrt{x - 1} + 3$ on $[2, 10]$: $f(2) = -2 \\cdot 1 + 3 = 1$ and $f(10) = -2 \\cdot 3 + 3 = -3$, so the range is $[-3, 1]$.\n\n> **Watch out.** When the function is decreasing, the left end gives the larger value. Write the range from the smaller value to the larger, whichever end each comes from.",
        "变换后的平方根函数要么递增要么递减，所以在区间 $[p, q]$ 上它的最小值和最大值在两端取得。计算 $f$ 在两端的值；值域从较小的值到较大的值。\n\n对于 $f(x) = -2\\sqrt{x - 1} + 3$ 在 $[2, 10]$ 上：$f(2) = -2 \\cdot 1 + 3 = 1$，$f(10) = -2 \\cdot 3 + 3 = -3$，所以值域是 $[-3, 1]$。\n\n> **注意。** 函数递减时，左端给出较大的值。无论哪个值来自哪一端，值域都从较小的值写到较大的值。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const p = rng.int(0, 4);
        const q = rng.int(p + 1, 6);
        const [lo, hi] = [h + p * p, h + q * q];
        const [vLo, vHi] = [a * p + k, a * q + k];
        const set = between(vLo, vHi);
        const f = rootFn(a, shifted(h), k);
        return intervalProblem({
          prompt: t(
            `Find the range of $f(x) = ${f}$ for $${lo} \\le x \\le ${hi}$. ${asInterval.en}`,
            `求 $f(x) = ${f}$ 在 $${lo} \\le x \\le ${hi}$ 上的值域。${asInterval["zh-CN"]}`,
          ),
          set,
          form: "interval",
          wrong: [between(lo, hi), between(a * p * p + k, a * q * q + k), ray(a > 0, k), between(k, vHi)],
          solution: join(
            label(1, "Decide the direction", "判断单调性"),
            t(
              `The root $\\sqrt{${shifted(h)}}$ grows as $x$ grows, and the coefficient $${a}$ is ${a > 0 ? "positive" : "negative"}. So $f$ is ${a > 0 ? "increasing" : "decreasing"}, and its least and greatest values on the interval are at the ends.`,
              `根式 $\\sqrt{${shifted(h)}}$ 随 $x$ 增大而增大，系数 $${a}$ 为${a > 0 ? "正" : "负"}。所以 $f$ ${a > 0 ? "递增" : "递减"}，在区间上的最小值和最大值在两端取得。`,
            ),
            para,
            label(2, "Evaluate at the ends", "求两端的值"),
            both(
              "Substitute both ends:",
              "代入两个端点：",
              `f(${lo}) = ${front(a)}\\sqrt{${p * p}}${plus(k)} = ${vLo}`,
              `f(${hi}) = ${front(a)}\\sqrt{${q * q}}${plus(k)} = ${vHi}`,
            ),
            t(`\n\nThe range is ${setText(set)}.`, `\n\n值域是 ${setText(set)}。`),
            said(
              `Work back from the end values. $\\frac{${vLo}${plus(-k)}}{${a}} = ${p}$ and $\\frac{${vHi}${plus(-k)}}{${a}} = ${q}$, and $${p}^{2}${plus(h)} = ${lo}$ and $${q}^{2}${plus(h)} = ${hi}$ are the ends of the interval.`,
              `从两端的值倒推。$\\frac{${vLo}${plus(-k)}}{${a}} = ${p}$，$\\frac{${vHi}${plus(-k)}}{${a}} = ${q}$，而 $${p}^{2}${plus(h)} = ${lo}$ 与 $${q}^{2}${plus(h)} = ${hi}$ 正是区间的两端。`,
            ),
          ),
        });
      },
    },
    {
      id: "range-from-a-graph",
      figure: algebraDrawings3["the-range-of-a-transformed-radical-function#range-from-a-graph"],
      title: t("The range from a graph", "从图象读出值域"),
      explanation: t(
        "On the graph, the range is the set of heights the graph reaches. A transformed square-root graph starts at its endpoint $(h, k)$ and then rises or falls forever, so its range is $[k, \\infty)$ when it goes up from the endpoint and $(-\\infty, k]$ when it goes down. Whether it extends to the left or to the right does not matter.\n\n> **Watch out.** Read the range on the $y$-axis. The $x$-coordinate of the endpoint belongs to the domain, not to the range.",
        "在图象上，值域是图象所能到达的所有高度。变换后的平方根函数图象从端点 $(h, k)$ 出发，然后一直上升或一直下降，所以从端点向上时值域是 $[k, \\infty)$，向下时是 $(-\\infty, k]$。向左还是向右延伸都没有关系。\n\n> **注意。** 值域要在 $y$ 轴上读。端点的横坐标属于定义域，不属于值域。",
      ),
      generate(rng) {
        const g = randomSqrtGraph(rng);
        const set = ray(g.a > 0, g.k);
        return annotate(
          {
            ...intervalProblem({
              prompt: t(
                `The graph of a transformation of $y = \\sqrt{x}$ is shown. Find its range. ${asInterval.en}`,
                `图中是 $y = \\sqrt{x}$ 经过变换后的图象。求它的值域。${asInterval["zh-CN"]}`,
              ),
              set,
              form: "interval",
              wrong: [ray(g.s > 0, g.h), ray(g.a < 0, g.k), ray(g.a > 0, g.h), ray(g.a > 0, g.k, false)],
              solution: join(
                label(1, "Read the endpoint", "读出端点"),
                t(
                  `The graph starts at $${pt(g.h, g.k)}$, so its heights start at $${g.k}$. Whether it runs left or right does not affect the heights.`,
                  `图象从 $${pt(g.h, g.k)}$ 出发，所以它的高度从 $${g.k}$ 开始。向左还是向右延伸不影响高度。`,
                ),
                para,
                label(2, "See which way it goes", "看延伸方向"),
                t(
                  `From there it goes ${g.a > 0 ? "up" : "down"} without end, so it reaches every height ${g.a > 0 ? "$\\ge" : "$\\le"} ${g.k}$. The range is ${setText(set)}.`,
                  `图象从那里一直向${g.a > 0 ? "上" : "下"}延伸，所以能到达所有 ${g.a > 0 ? "$\\ge" : "$\\le"} ${g.k}$ 的高度。值域是 ${setText(set)}。`,
                ),
                said(
                  `The other marked points, $${pt(...sqrtPoints(g)[1]!)}$ and $${pt(...sqrtPoints(g)[2]!)}$, have heights $${g.k + g.a}$ and $${g.k + 2 * g.a}$. Both lie ${g.a > 0 ? "above" : "below"} $${g.k}$, inside the range.`,
                  `其他两个标记点 $${pt(...sqrtPoints(g)[1]!)}$ 和 $${pt(...sqrtPoints(g)[2]!)}$ 的高度是 $${g.k + g.a}$ 和 $${g.k + 2 * g.a}$，都${g.a > 0 ? "高于" : "低于"} $${g.k}$，在值域内。`,
                ),
              ),
            }),
            figure: sqrtFigure(g),
          },
          view,
          [
            { kind: "line", a: [0, g.k], b: [1, g.k], dashed: true, tone: "action" },
            { kind: "point", at: [g.h, g.k], tone: "result" },
            ...onAxis("y", set, 8),
          ],
          `The endpoint is ${at([g.h, g.k])}, so the range is ${setAlt(set)}.`,
          `端点是 ${at([g.h, g.k])}，所以值域是 ${setAlt(set)}。`,
        );
      },
    },
  ],
};

// 6.21.7 Roots of transformed radical functions.

/** rootsOfTransformedRadicalFunctions finds the zeros of transformed square-root and cube-root functions. */
export const rootsOfTransformedRadicalFunctions: TopicDef = {
  id: "roots-of-transformed-radical-functions",
  title: t("Roots of Transformed Radical Functions", "变换后根式函数的零点"),
  summary: t(
    "Find the roots of a·√(bx + c) + k and a·∛(bx + c) + k by solving f(x) = 0, and tell when a square-root function has none.",
    "通过解 f(x) = 0 求 a·√(bx + c) + k 与 a·∛(bx + c) + k 的零点，并判断平方根函数何时没有零点。",
  ),
  prerequisites: ["the-range-of-a-transformed-radical-function", "solving-advanced-radical-equations", "roots-of-a-function"],
  encompasses: [
    { topic: "solving-radical-equations", weight: 0.4 },
    { topic: "roots-of-a-function", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2", "CCSS.HSF.IF.C.7.B"],
  intro: t(
    `You know that a root of a function is an input where its value is $0$, how to solve radical equations, and how to find the range of a radical function. A root is where the graph meets the $x$-axis, so finding it is solving the equation $f(x) = 0$, and the range tells you in advance whether there is one.

Take $f(x) = 3\\sqrt{x - 2} - 6$. Its range is $[-6, \\infty)$, which contains $0$, so it has a root. Isolate the root and square:

$$3\\sqrt{x - 2} = 6, \\qquad \\sqrt{x - 2} = 2, \\qquad x - 2 = 4, \\qquad x = 6.$$

Check: $f(6) = 3\\sqrt{4} - 6 = 0$. The graph crosses the $x$-axis at $(6, 0)$.`,
    `你知道函数的零点是使函数值为 $0$ 的输入，会解根式方程，也会求根式函数的值域。零点是图象与 $x$ 轴的交点，所以求零点就是解方程 $f(x) = 0$，而值域可以事先告诉你有没有零点。

以 $f(x) = 3\\sqrt{x - 2} - 6$ 为例。它的值域是 $[-6, \\infty)$，包含 $0$，所以有零点。分离根式再平方：

$$3\\sqrt{x - 2} = 6, \\qquad \\sqrt{x - 2} = 2, \\qquad x - 2 = 4, \\qquad x = 6.$$

检验：$f(6) = 3\\sqrt{4} - 6 = 0$。图象与 $x$ 轴交于 $(6, 0)$。`,
  ),
  knowledgePoints: [
    {
      id: "roots-of-square-root-functions",
      title: t("Square-root functions", "平方根函数"),
      explanation: t(
        "A root of $f$ is a solution of $f(x) = 0$. For $f(x) = a\\sqrt{bx + c} + k$, isolate the root: $\\sqrt{bx + c} = -\\frac{k}{a}$. If $-\\frac{k}{a} < 0$ there is no root, since a square root is never negative; the range of $f$ does not contain $0$. Otherwise square and solve.\n\nFor $f(x) = 2\\sqrt{x + 3} - 6$: $\\sqrt{x + 3} = 3$, so $x + 3 = 9$ and $x = 6$. But $f(x) = 2\\sqrt{x + 3} + 6$ has no root.\n\n> **Watch out.** Check the sign before squaring. If the isolated root equals a negative number, squaring would produce a false root.",
        "$f$ 的零点是 $f(x) = 0$ 的解。对于 $f(x) = a\\sqrt{bx + c} + k$，先分离根式：$\\sqrt{bx + c} = -\\frac{k}{a}$。若 $-\\frac{k}{a} < 0$，则没有零点，因为平方根不可能是负数；$f$ 的值域不包含 $0$。否则两边平方并求解。\n\n对于 $f(x) = 2\\sqrt{x + 3} - 6$：$\\sqrt{x + 3} = 3$，所以 $x + 3 = 9$，$x = 6$。而 $f(x) = 2\\sqrt{x + 3} + 6$ 没有零点。\n\n> **注意。** 平方之前先看符号。如果分离出的根式等于负数，平方会得出一个假根。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const b = rng.pick([1, -1, 1, 2, -2]);
        const c = rng.int(-9, 9);
        const exists = rng.bool(0.75);
        const s = exists ? rng.int(0, 6) : rng.int(1, 6);
        const k = exists ? -a * s : a * s;
        const f: RootFnDef = { a, b, c, k, n: 2 };
        const x0 = Q.of(s * s - c, b);
        const isolated = `\\sqrt{${linear(b, c)}} = ${exists ? s : -s}`;
        return solutionsProblem({
          prompt: t(`Find the roots of ${fIs(f)}. ${listSolutions.en}`, `求 ${fIs(f)} 的零点。${listSolutions["zh-CN"]}`),
          values: exists ? [num(x0)] : [],
          wrong: exists ? [[], ...(s > 1 ? [[num(Q.of(s - c, b))]] : []), ...(s > 0 ? [[num(Q.of(-s * s - c, b))]] : [])] : [[num(x0)]],
          solution: join(
            label(1, "Isolate the root", "分离根式"),
            both(
              `Set $f(x) = 0$, ${k > 0 ? `subtract $${k}$` : k < 0 ? `add $${-k}$` : "leave the right side $0$"} and divide by $${a}$:`,
              `令 $f(x) = 0$，${k > 0 ? `减去 $${k}$` : k < 0 ? `加上 $${-k}$` : "右边保持为 $0$"}，再除以 $${a}$：`,
              `${rootFnLatex(f)} = 0`,
              isolated,
            ),
            para,
            exists
              ? join(
                  label(2, "Square and solve", "平方并求解"),
                  both(
                    `The right side $${s}$ is not negative, so square both sides:`,
                    `右边 $${s}$ 不是负数，所以两边平方：`,
                    `${linear(b, c)} = ${s * s}`,
                    `x = ${x0.toLatex()}`,
                  ),
                  said(
                    `At $x = ${x0.toLatex()}$ the radicand is $${s * s}$ and its root is $${s}$. Then $f = ${a} \\cdot ${s}${plus(k)} = 0$.`,
                    `当 $x = ${x0.toLatex()}$ 时被开方式为 $${s * s}$，它的平方根是 $${s}$。于是 $f = ${a} \\cdot ${s}${plus(k)} = 0$。`,
                  ),
                )
              : join(
                  label(2, "Compare with the range of a root", "与根式的取值比较"),
                  t(
                    `A square root is never negative, so it cannot equal $${-s}$. So $f$ has no roots.`,
                    `平方根不可能是负数，不能等于 $${-s}$。所以 $f$ 没有零点。`,
                  ),
                  said(
                    `The range of $f$ is ${setText(rangeOf(f))}, since $a = ${a}$ and $k = ${k}$. It does not contain $0$, so the graph never meets the $x$-axis.`,
                    `由于 $a = ${a}$，$k = ${k}$，$f$ 的值域是 ${setText(rangeOf(f))}。它不包含 $0$，所以图象与 $x$ 轴没有交点。`,
                  ),
                ),
          ),
        });
      },
    },
    {
      id: "roots-of-cube-root-functions",
      title: t("Cube-root functions", "立方根函数"),
      explanation: t(
        "A cube-root function $f(x) = a\\sqrt[3]{bx + c} + k$ always has exactly one root, because a cube root can take any value, negative ones included. Isolate the root and cube:\n\n$$-2\\sqrt[3]{x - 1} - 4 = 0 \\;\\Rightarrow\\; \\sqrt[3]{x - 1} = -2 \\;\\Rightarrow\\; x - 1 = -8 \\;\\Rightarrow\\; x = -7$$\n\n> **Watch out.** Cube the whole isolated value, sign included: $(-2)^{3} = -8$, not $8$.",
        "立方根函数 $f(x) = a\\sqrt[3]{bx + c} + k$ 总是恰好有一个零点，因为立方根可以取任何值，包括负数。分离根式再两边立方：\n\n$$-2\\sqrt[3]{x - 1} - 4 = 0 \\;\\Rightarrow\\; \\sqrt[3]{x - 1} = -2 \\;\\Rightarrow\\; x - 1 = -8 \\;\\Rightarrow\\; x = -7$$\n\n> **注意。** 要把分离出的整个值连同符号一起立方：$(-2)^{3} = -8$，而不是 $8$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const b = rng.pick([1, -1, 1, 2, -2, 3]);
        const c = rng.int(-9, 9);
        const s = rng.int(-4, 4);
        const f: RootFnDef = { a, b, c, k: -a * s, n: 3 };
        const x0 = Q.of(s ** 3 - c, b);
        return solutionsProblem({
          prompt: t(`Find the roots of ${fIs(f)}. ${listSolutions.en}`, `求 ${fIs(f)} 的零点。${listSolutions["zh-CN"]}`),
          values: [num(x0)],
          wrong: [
            ...(s < 0 ? [[]] : []),
            ...(s !== 0 && s !== 1 ? [[num(Q.of(s * s - c, b))]] : []),
            ...(s !== 0 ? [[num(Q.of(-(s ** 3) - c, b))]] : []),
          ],
          solution: join(
            label(1, "Isolate the cube root", "分离立方根"),
            both(
              `Set $f(x) = 0$, move the constant to the right side and divide by $${a}$:`,
              `令 $f(x) = 0$，把常数移到右边，再除以 $${a}$：`,
              `${rootFnLatex(f)} = 0`,
              `\\sqrt[3]{${linear(b, c)}} = ${s}`,
            ),
            para,
            label(2, "Cube and solve", "立方并求解"),
            both(
              "A cube root may equal any number, so cube both sides:",
              "立方根可以等于任何数，所以两边立方：",
              `${linear(b, c)} = ${paren(s)}^{3} = ${s ** 3}`,
              `x = ${x0.toLatex()}`,
            ),
            said(
              `At $x = ${x0.toLatex()}$ the radicand is $${s ** 3}$, whose cube root is $${s}$. Then $f = ${a} \\cdot ${paren(s)}${plus(-a * s)} = 0$.`,
              `当 $x = ${x0.toLatex()}$ 时被开方式为 $${s ** 3}$，它的立方根是 $${s}$。于是 $f = ${a} \\cdot ${paren(s)}${plus(-a * s)} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "how-many-roots",
      title: t("How many roots", "零点的个数"),
      explanation: t(
        "Without solving, the range tells how many roots a radical function has:\n\n- $a\\sqrt{bx + c} + k$ has range $[k, \\infty)$ for $a > 0$ and $(-\\infty, k]$ for $a < 0$. It has one root when $0$ is in the range, that is, when $k = 0$ or $k$ and $a$ have opposite signs, and no root otherwise;\n- $a\\sqrt[3]{bx + c} + k$ has range $(-\\infty, \\infty)$ and exactly one root.\n\n$f(x) = -\\sqrt{x + 5} - 2$ has range $(-\\infty, -2]$, so it has no root.\n\n> **Watch out.** When $k = 0$ the root lies at the endpoint, so an even-root function still has exactly one root.",
        "不用求解，由值域就能知道根式函数有几个零点：\n\n- $a\\sqrt{bx + c} + k$ 在 $a > 0$ 时值域是 $[k, \\infty)$，在 $a < 0$ 时是 $(-\\infty, k]$。当 $0$ 在值域内，即 $k = 0$ 或 $k$ 与 $a$ 异号时，它有一个零点，否则没有；\n- $a\\sqrt[3]{bx + c} + k$ 的值域是 $(-\\infty, \\infty)$，恰好有一个零点。\n\n$f(x) = -\\sqrt{x + 5} - 2$ 的值域是 $(-\\infty, -2]$，所以没有零点。\n\n> **注意。** 当 $k = 0$ 时零点就在端点处，所以偶次根函数仍然恰好有一个零点。",
      ),
      generate(rng) {
        const f = randomRootFn(rng, rng.pick([2, 2, 2, 3]));
        const odd = f.n === 3;
        const count = odd || f.a * f.k < 0 ? 1 : 0;
        return numberProblem({
          prompt: t(`How many roots does ${fIs(f)} have?`, `${fIs(f)} 有几个零点？`),
          answer: count,
          form: "integer",
          wrong: [1 - count, 2],
          solution: (() => {
            const r = Q.of(-f.k, f.a);
            const isolated = `${root(f.n, linear(f.b, f.c))} = ${r.toLatex()}`;
            return odd
              ? join(
                  label(1, "Find the range", "求值域"),
                  t(
                    `A cube root takes every real value, so the range of $f$ is ${setText(realLine)}. It contains $0$.`,
                    `立方根取遍所有实数，所以 $f$ 的值域是 ${setText(realLine)}，包含 $0$。`,
                  ),
                  para,
                  label(2, "Count", "计数"),
                  t(
                    `$f$ is ${f.a * f.b > 0 ? "increasing" : "decreasing"}, so it takes the value $0$ only once. $f$ has $1$ root.`,
                    `$f$ ${f.a * f.b > 0 ? "递增" : "递减"}，所以只取到 $0$ 一次。$f$ 有 $1$ 个零点。`,
                  ),
                  said(
                    `Setting $f(x) = 0$ gives $${isolated}$. Cubing gives the single solution $x = ${r.pow(3).sub(Q.of(f.c)).div(Q.of(f.b)).toLatex()}$.`,
                    `令 $f(x) = 0$ 得 $${isolated}$。两边立方得唯一的解 $x = ${r.pow(3).sub(Q.of(f.c)).div(Q.of(f.b)).toLatex()}$。`,
                  ),
                )
              : join(
                  label(1, "Find the range", "求值域"),
                  t(
                    `The coefficient $${f.a}$ is ${f.a > 0 ? "positive" : "negative"} and the constant is $${f.k}$, so the range of $f$ is ${setText(rangeOf(f))}.`,
                    `系数 $${f.a}$ 为${f.a > 0 ? "正" : "负"}，常数为 $${f.k}$，所以 $f$ 的值域是 ${setText(rangeOf(f))}。`,
                  ),
                  para,
                  label(2, "Count", "计数"),
                  t(
                    `The range ${count ? "contains" : "does not contain"} $0$${count ? ", and $f$ takes each of its values once" : ""}. So $f$ has $${count}$ root${count ? "" : "s"}.`,
                    `值域${count ? "包含" : "不包含"} $0$${count ? "，而且 $f$ 的每个值只取一次" : ""}。所以 $f$ 有 $${count}$ 个零点。`,
                  ),
                  said(
                    `Setting $f(x) = 0$ gives $${isolated}$. ${count ? `The right side is positive, so squaring gives the single solution $x = ${r.pow(2).sub(Q.of(f.c)).div(Q.of(f.b)).toLatex()}$.` : "A square root is never negative, so there is no solution."}`,
                    `令 $f(x) = 0$ 得 $${isolated}$。${count ? `右边为正，两边平方得唯一的解 $x = ${r.pow(2).sub(Q.of(f.c)).div(Q.of(f.b)).toLatex()}$。` : "平方根不可能是负数，所以无解。"}`,
                  ),
                );
          })(),
        });
      },
    },
  ],
};

// 6.21.8 Inverses of radical functions.

/** quotientLatex writes N / D for an integer D ≠ 0: "N", "-(N)", "\frac{N}{D}", "-\frac{N}{D}". */
function quotientLatex(top: string, d: number, simple: boolean): string {
  if (d === 1) return top;
  if (d === -1) return simple ? `-${top}` : `-(${top})`;
  return `${d < 0 ? "-" : ""}\\frac{${top}}{${Math.abs(d)}}`;
}

/** sqrtInverse writes ((x − k)² − m)/d. */
const sqrtInverse = (k: number, m: number, d: number) => quotientLatex(`${squared(k)}${plus(-m)}`, d, m === 0);

/** inversesOfRadicalFunctions finds the inverses of square-root and cube-root functions and their domains. */
export const inversesOfRadicalFunctions: TopicDef = {
  id: "inverses-of-radical-functions",
  title: t("Inverses of Radical Functions", "根式函数的反函数"),
  summary: t(
    "Invert a·√(bx + c) + k and a·∛(x − h) + k by swapping x and y, and find the domain of the inverse from the range of the function.",
    "交换 x 与 y，求 a·√(bx + c) + k 与 a·∛(x − h) + k 的反函数，并由原函数的值域求反函数的定义域。",
  ),
  prerequisites: ["the-range-of-a-transformed-radical-function", "inverses-of-quadratic-functions"],
  encompasses: [
    { topic: "calculating-the-inverse-of-a-function", weight: 0.4 },
    { topic: "domain-and-range-of-inverse-functions", weight: 0.4 },
    { topic: "the-range-of-a-transformed-radical-function", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.A", "CCSS.HSF.BF.B.4.C"],
  intro: t(
    `You have found inverses of quadratic functions by swapping $x$ and $y$ and solving, keeping only half of the parabola. Radical functions work the other way round: squaring undoes a square root, so the inverse of a square-root function is half of a parabola. An inverse answers the reverse question, which input gives a chosen output.

Take $f(x) = \\sqrt{x + 1}$, whose range is $[0, \\infty)$. Swap $x$ and $y$ and solve for $y$:

$$x = \\sqrt{y + 1}, \\qquad x^{2} = y + 1, \\qquad y = x^{2} - 1.$$

So $f^{-1}(x) = x^{2} - 1$ for $x \\ge 0$, the range of $f$. Check: $f(3) = \\sqrt{4} = 2$, and $f^{-1}(2) = 4 - 1 = 3$ brings it back.`,
    `你求过二次函数的反函数：交换 $x$ 与 $y$ 再求解，并且只保留半条抛物线。根式函数正好反过来：平方撤销平方根，所以平方根函数的反函数是半条抛物线。反函数回答相反的问题：哪个输入给出指定的输出。

以 $f(x) = \\sqrt{x + 1}$ 为例，它的值域是 $[0, \\infty)$。交换 $x$ 与 $y$，解出 $y$：

$$x = \\sqrt{y + 1}, \\qquad x^{2} = y + 1, \\qquad y = x^{2} - 1.$$

所以 $f^{-1}(x) = x^{2} - 1$，其中 $x \\ge 0$，即 $f$ 的值域。检验：$f(3) = \\sqrt{4} = 2$，而 $f^{-1}(2) = 4 - 1 = 3$ 又回到了 $3$。`,
  ),
  knowledgePoints: [
    {
      id: "inverses-of-square-root-functions-with-an-inner-coefficient",
      title: t("Inverses of square-root functions", "平方根函数的反函数"),
      explanation: t(
        "Swap $x$ and $y$, isolate the root, square, and solve for $y$. For $f(x) = 3\\sqrt{2x - 1} + 4$:\n\n$$x = 3\\sqrt{2y - 1} + 4, \\quad \\frac{x - 4}{3} = \\sqrt{2y - 1}, \\quad \\frac{(x - 4)^{2}}{9} = 2y - 1,$$\n\n$$f^{-1}(x) = \\frac{(x - 4)^{2} + 9}{18}.$$\n\nSquare the coefficient $3$ together with $x - 4$: the $9$ is easy to forget.\n\n> **Watch out.** The formula of $f^{-1}$ alone describes a whole parabola. The inverse is only the part whose inputs lie in the range of $f$.",
        "交换 $x$ 与 $y$，分离根式，两边平方，再解出 $y$。对于 $f(x) = 3\\sqrt{2x - 1} + 4$：\n\n$$x = 3\\sqrt{2y - 1} + 4, \\quad \\frac{x - 4}{3} = \\sqrt{2y - 1}, \\quad \\frac{(x - 4)^{2}}{9} = 2y - 1,$$\n\n$$f^{-1}(x) = \\frac{(x - 4)^{2} + 9}{18}.$$\n\n系数 $3$ 要和 $x - 4$ 一起平方：这个 $9$ 很容易忘记。\n\n> **注意。** 单看 $f^{-1}$ 的解析式，它描述的是整条抛物线。反函数只是其中输入属于 $f$ 的值域的那一部分。",
      ),
      keyPrerequisites: ["calculating-the-inverse-of-a-function"],
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3]);
        const b = rng.pick([1, 1, 2, -1, 3]);
        const c = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const f: RootFnDef = { a, b, c, k, n: 2 };
        const a2 = a * a;
        const answer = sqrtInverse(k, a2 * c, a2 * b);
        const isolated = a === 1 ? shifted(k) : `\\frac{${shifted(k)}}{${a}}`;
        const square = a2 === 1 ? squared(k) : `\\frac{${squared(k)}}{${a2}}`;
        return expressionProblem({
          prompt: t(`Find the inverse of ${fIs(f)}.`, `求 ${fIs(f)} 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [
            sqrtInverse(-k, a2 * c, a2 * b),
            sqrtInverse(k, a * c, a * b),
            sqrtInverse(k, -a2 * c, a2 * b),
            sqrtInverse(k, a2 * c, a2),
            sqrtInverse(k, c, b),
          ],
          solution: join(
            label(1, "Swap and isolate the root", "交换并分离根式"),
            both(
              `Write $y = f(x)$, swap $x$ and $y$, then ${k === 0 ? "" : `${k > 0 ? "subtract" : "add"} $${Math.abs(k)}$${a === 1 ? "" : " and "}`}${a === 1 ? "" : `divide by $${a}$`}${k === 0 && a === 1 ? "the root is already alone" : ""}:`,
              `写 $y = f(x)$，交换 $x$ 与 $y$，再${k === 0 ? "" : `${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$`}${k !== 0 && a !== 1 ? "，" : ""}${a === 1 ? "" : `除以 $${a}$`}${k === 0 && a === 1 ? "根式已经单独在一边" : ""}：`,
              `x = ${rootFn(a, linear(b, c, "y"), k)}`,
              `${isolated} = \\sqrt{${linear(b, c, "y")}}`,
            ),
            para,
            label(2, "Square and solve for y", "平方并解出 y"),
            both(
              `Square both sides${a2 === 1 ? "" : `, squaring the $${a}$ too`}, then solve for $y$:`,
              `两边平方${a2 === 1 ? "" : `，$${a}$ 也要一起平方`}，再解出 $y$：`,
              `${square} = ${linear(b, c, "y")}`,
              `y = ${answer}`,
            ),
            t(`\n\nSo $f^{-1}(x) = ${answer}$.`, `\n\n所以 $f^{-1}(x) = ${answer}$。`),
            said(
              `Where the radicand is $1$, at $x = ${Q.of(1 - c, b).toLatex()}$, $f(x) = ${k === 0 ? "" : `${a}${plus(k)} = `}${a + k}$. The inverse should send $${a + k}$ back: $\\frac{${paren(a)}^{2}${plus(-a2 * c)}}{${a2 * b}} = ${Q.of(1 - c, b).toLatex()}$.`,
              `被开方式为 $1$ 时，即 $x = ${Q.of(1 - c, b).toLatex()}$ 时，$f(x) = ${k === 0 ? "" : `${a}${plus(k)} = `}${a + k}$。反函数应把 $${a + k}$ 送回去：$\\frac{${paren(a)}^{2}${plus(-a2 * c)}}{${a2 * b}} = ${Q.of(1 - c, b).toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-domain-of-the-inverse",
      figure: algebraDrawings3["inverses-of-radical-functions#the-domain-of-the-inverse"],
      title: t("The domain and range of the inverse", "反函数的定义域与值域"),
      explanation: t(
        "The inverse swaps inputs and outputs, so the domain of $f^{-1}$ is the range of $f$ and the range of $f^{-1}$ is the domain of $f$. The formula of the inverse of a square-root function is a parabola, but $f^{-1}$ is only part of it.\n\nFor $f(x) = -\\sqrt{x + 2} + 5$: the range of $f$ is $(-\\infty, 5]$ and its domain is $[-2, \\infty)$, so $f^{-1}$ has domain $(-\\infty, 5]$ and range $[-2, \\infty)$.\n\n> **Watch out.** Do not read the domain of $f^{-1}$ from its formula, which is defined for every $x$. Take it from the range of $f$.",
        "反函数把输入和输出对调，所以 $f^{-1}$ 的定义域是 $f$ 的值域，$f^{-1}$ 的值域是 $f$ 的定义域。平方根函数的反函数的解析式是一条抛物线，但 $f^{-1}$ 只是其中一部分。\n\n对于 $f(x) = -\\sqrt{x + 2} + 5$：$f$ 的值域是 $(-\\infty, 5]$，定义域是 $[-2, \\infty)$，所以 $f^{-1}$ 的定义域是 $(-\\infty, 5]$，值域是 $[-2, \\infty)$。\n\n> **注意。** 不要从 $f^{-1}$ 的解析式读定义域，那个解析式对每个 $x$ 都有定义。要由 $f$ 的值域得到它。",
      ),
      keyPrerequisites: ["domain-and-range-of-inverse-functions"],
      generate(rng) {
        const f = randomRootFn(rng);
        const askDomain = rng.bool();
        const dom = domainOf(f);
        const ran = rangeOf(f);
        const set = askDomain ? ran : dom;
        return intervalProblem({
          prompt: t(
            `Let ${fIs(f)}. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$. ${asInterval.en}`,
            `设 ${fIs(f)}。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。${asInterval["zh-CN"]}`,
          ),
          set,
          form: "interval",
          wrong: askDomain
            ? [dom, realLine, ray(f.a < 0, f.k), ray(f.a > 0, -f.k)]
            : [ran, realLine, ray(f.b < 0, endX(f)), ray(f.b > 0, endX(f).neg())],
          solution: askDomain
            ? join(
                label(1, "Swap inputs and outputs", "对调输入和输出"),
                t(
                  "The inverse takes the outputs of $f$ as its inputs, so the domain of $f^{-1}$ is the range of $f$.",
                  "反函数把 $f$ 的输出当作自己的输入，所以 $f^{-1}$ 的定义域是 $f$ 的值域。",
                ),
                para,
                label(2, "Find the range of f", "求 f 的值域"),
                t(
                  `The root takes every value $\\ge 0$. Multiplying by $${f.a}$ gives every value ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"}, and adding $${f.k}$ gives every value ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$. So the domain of $f^{-1}$ is ${setText(ran)}.`,
                  `根式取遍所有 $\\ge 0$ 的值。乘以 $${f.a}$ 后取遍所有 ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"} 的值，再加上 $${f.k}$ 后取遍所有 ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$ 的值。所以 $f^{-1}$ 的定义域是 ${setText(ran)}。`,
                ),
                said(
                  `At the endpoint $x = ${endX(f).toLatex()}$ of the domain of $f$, the radicand is $0$ and $f = ${f.k}$, the end of the answer. Where the radicand is $1$, $f = ${f.k + f.a}$, which lies inside it.`,
                  `在 $f$ 的定义域端点 $x = ${endX(f).toLatex()}$ 处，被开方式为 $0$，$f = ${f.k}$，正是答案的端点。被开方式为 $1$ 时 $f = ${f.k + f.a}$，在答案之内。`,
                ),
              )
            : join(
                label(1, "Swap inputs and outputs", "对调输入和输出"),
                t(
                  "The outputs of the inverse are the inputs of $f$, so the range of $f^{-1}$ is the domain of $f$.",
                  "反函数的输出就是 $f$ 的输入，所以 $f^{-1}$ 的值域是 $f$ 的定义域。",
                ),
                para,
                label(2, "Find the domain of f", "求 f 的定义域"),
                domainWork(f, endX(f), dom),
                t(` So the range of $f^{-1}$ is ${setText(dom)} too.`, `所以 $f^{-1}$ 的值域也是 ${setText(dom)}。`),
                domainCheck(f, endX(f)),
              ),
        });
      },
    },
    {
      id: "inverses-of-cube-root-functions",
      title: t("Inverses of cube-root functions", "立方根函数的反函数"),
      explanation: t(
        "Undo a cube root by cubing. For $f(x) = 2\\sqrt[3]{x + 1} - 3$, swap and solve:\n\n$$x = 2\\sqrt[3]{y + 1} - 3, \\quad \\frac{x + 3}{2} = \\sqrt[3]{y + 1}, \\quad \\frac{(x + 3)^{3}}{8} = y + 1.$$\n\nSo $f^{-1}(x) = \\frac{(x + 3)^{3}}{8} - 1$. The domain and range of a cube-root function are all real numbers, so its inverse needs no restriction.\n\n> **Watch out.** Cube the coefficient as well. Dividing by $2$ before cubing becomes dividing by $8$ after it.",
        "用立方撤销立方根。对于 $f(x) = 2\\sqrt[3]{x + 1} - 3$，交换并求解：\n\n$$x = 2\\sqrt[3]{y + 1} - 3, \\quad \\frac{x + 3}{2} = \\sqrt[3]{y + 1}, \\quad \\frac{(x + 3)^{3}}{8} = y + 1,$$\n\n所以 $f^{-1}(x) = \\frac{(x + 3)^{3}}{8} - 1$。立方根函数的定义域和值域都是全体实数，所以它的反函数不需要限制。\n\n> **注意。** 系数也要一起立方。立方前除以 $2$，立方后就变成除以 $8$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3]);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const a3 = a ** 3;
        const inv = (kk: number, d: number, hh: number) => `${quotientLatex(squared(kk, 3), d, true)}${plus(hh)}`;
        const answer = inv(k, a3, h);
        const f = rootFn(a, shifted(h), k, 3);
        const isolated = a === 1 ? shifted(k) : `\\frac{${shifted(k)}}{${a}}`;
        return expressionProblem({
          prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [inv(-k, a3, h), inv(k, a, h), inv(h, a3, k), inv(k, a3, -h), `${a3 === 1 ? "" : a3}${squared(k, 3)}${plus(h)}`],
          solution: join(
            label(1, "Swap and isolate the root", "交换并分离根式"),
            both(
              `Write $y = f(x)$, swap $x$ and $y$, then ${k === 0 ? "" : `${k > 0 ? "subtract" : "add"} $${Math.abs(k)}$${a === 1 ? "" : " and "}`}${a === 1 ? "" : `divide by $${a}$`}${k === 0 && a === 1 ? "the root is already alone" : ""}:`,
              `写 $y = f(x)$，交换 $x$ 与 $y$，再${k === 0 ? "" : `${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$`}${k !== 0 && a !== 1 ? "，" : ""}${a === 1 ? "" : `除以 $${a}$`}${k === 0 && a === 1 ? "根式已经单独在一边" : ""}：`,
              `x = ${rootFn(a, linear(1, -h, "y"), k, 3)}`,
              `${isolated} = \\sqrt[3]{${linear(1, -h, "y")}}`,
            ),
            para,
            label(2, "Cube and solve for y", "立方并解出 y"),
            both(
              `Cube both sides${a3 === 1 ? "" : `, cubing the $${a}$ too`}, then solve for $y$:`,
              `两边立方${a3 === 1 ? "" : `，$${a}$ 也要一起立方`}，再解出 $y$：`,
              `${quotientLatex(squared(k, 3), a3, true)} = ${linear(1, -h, "y")}`,
              `y = ${answer}`,
            ),
            t(
              `\n\nSo $f^{-1}(x) = ${answer}$. No restriction is needed: a cube root is defined for every real number.`,
              `\n\n所以 $f^{-1}(x) = ${answer}$。不需要限制定义域：立方根对所有实数都有定义。`,
            ),
            said(
              `At $x = ${h + 1}$ the cube root is $1$, so $f(${h + 1}) = ${k === 0 ? "" : `${a}${plus(k)} = `}${a + k}$. The inverse should send $${a + k}$ back: $\\frac{${paren(a)}^{3}}{${a3}}${plus(h)} = ${h + 1}$.`,
              `在 $x = ${h + 1}$ 处立方根等于 $1$，所以 $f(${h + 1}) = ${k === 0 ? "" : `${a}${plus(k)} = `}${a + k}$。反函数应把 $${a + k}$ 送回去：$\\frac{${paren(a)}^{3}}{${a3}}${plus(h)} = ${h + 1}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// 6.21.9 Finding intersections of lines and radical functions.

/** findingIntersectionsOfLinesAndRadicalFunctions intersects lines with the graphs of square-root functions. */
export const findingIntersectionsOfLinesAndRadicalFunctions: TopicDef = {
  id: "finding-intersections-of-lines-and-radical-functions",
  title: t("Finding Intersections of Lines and Radical Functions", "求直线与根式函数图象的交点"),
  summary: t(
    "Find where a line meets the graph of a square-root function by solving a radical equation, rejecting extraneous roots, and count the intersections.",
    "通过解根式方程并舍去增根，求直线与平方根函数图象的交点，并数出交点的个数。",
  ),
  prerequisites: ["roots-of-transformed-radical-functions", "finding-intersections-of-lines-and-quadratic-functions"],
  encompasses: [{ topic: "solving-advanced-radical-equations", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.D.11", "CCSS.HSA.REI.A.2"],
  intro: t(
    `You have found where a line meets a parabola by setting the two expressions for $y$ equal, and you have solved radical equations that become quadratics, rejecting extraneous roots. A line and the graph of a square root meet exactly where their $y$ values agree, so the same work gives their common points.

Take $y = \\sqrt{x}$ and $y = x - 2$. Set them equal, square and factor:

$$\\sqrt{x} = x - 2, \\qquad x = x^{2} - 4x + 4, \\qquad (x - 1)(x - 4) = 0.$$

At $x = 4$ the line gives $y = 2$ and $\\sqrt{4} = 2$: a common point. At $x = 1$ the line gives $y = -1$, but $\\sqrt{1} = 1$: extraneous. The only intersection is $(4, 2)$.`,
    `你会令两个关于 $y$ 的表达式相等来求直线与抛物线的交点，也会解平方后变成二次方程的根式方程并舍去增根。直线与平方根图象恰好在两者的 $y$ 值相等处相交，所以同样的方法能求出它们的公共点。

以 $y = \\sqrt{x}$ 和 $y = x - 2$ 为例。令两式相等，平方再因式分解：

$$\\sqrt{x} = x - 2, \\qquad x = x^{2} - 4x + 4, \\qquad (x - 1)(x - 4) = 0.$$

当 $x = 4$ 时，直线给出 $y = 2$，而 $\\sqrt{4} = 2$：是公共点。当 $x = 1$ 时，直线给出 $y = -1$，但 $\\sqrt{1} = 1$：是增根。唯一的交点是 $(4, 2)$。`,
  ),
  knowledgePoints: [
    {
      id: "horizontal-lines",
      figure: algebraDrawings2["finding-intersections-of-lines-and-radical-functions#horizontal-lines"],
      title: t("Horizontal lines", "水平直线"),
      explanation: t(
        "The graph of $y = a\\sqrt{x - h} + k$ meets the horizontal line $y = m$ where $a\\sqrt{x - h} + k = m$. Solve for $x$; the point is $(x, m)$.\n\nFor $y = 2\\sqrt{x + 1} - 3$ and $y = 5$: $2\\sqrt{x + 1} = 8$, $\\sqrt{x + 1} = 4$, $x = 15$. They meet at $(15, 5)$.\n\n> **Watch out.** If $m - k$ and $a$ have opposite signs, the root would have to be negative. Then the line misses the graph.",
        "$y = a\\sqrt{x - h} + k$ 的图象与水平直线 $y = m$ 相交于 $a\\sqrt{x - h} + k = m$ 处。解出 $x$，交点就是 $(x, m)$。\n\n对于 $y = 2\\sqrt{x + 1} - 3$ 和 $y = 5$：$2\\sqrt{x + 1} = 8$，$\\sqrt{x + 1} = 4$，$x = 15$。它们交于 $(15, 5)$。\n\n> **注意。** 如果 $m - k$ 与 $a$ 异号，根式就必须是负数。这时直线与图象没有交点。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3]);
        const s = rng.sign();
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const r = rng.int(1, 5);
        const m = k + a * r;
        const x = h + s * r * r;
        const inner = sqrtInner(s, h);
        const curve = rootFn(a, inner, k);
        return pointProblem({
          prompt: t(
            `Find the point where the graph of $y = ${curve}$ meets the line $y = ${m}$.`,
            `求 $y = ${curve}$ 的图象与直线 $y = ${m}$ 的交点。`,
          ),
          answer: [x, m],
          wrong: [[h + s * r, m], [h - s * r * r, m], [m, x], ...(a !== 1 ? [[h + s * (m - k) ** 2, m]] : [])],
          solution: join(
            label(1, "Isolate the root", "分离根式"),
            both(
              `On the line every $y$ is $${m}$, so set the two equal and get the root alone:`,
              `直线上每个点的 $y$ 都是 $${m}$，所以令两式相等，再让根式单独在一边：`,
              `${curve} = ${m}`,
              ...(k === 0 ? [] : [`${front(a)}\\sqrt{${inner}} = ${m - k}`]),
              ...(a === 1 ? [] : [`\\sqrt{${inner}} = ${r}`]),
            ),
            t(`\n\nThe root equals $${r}$, which is positive, so a solution exists.`, `\n\n根式等于正数 $${r}$，所以有解。`),
            para,
            label(2, "Square and solve", "平方并求解"),
            both(
              "Square both sides and solve for $x$:",
              "两边平方，解出 $x$：",
              `${inner} = ${r * r}`,
              ...(inner === "x" ? [] : [`x = ${x}`]),
            ),
            t(`\n\nThe point is $${pt(x, m)}$.`, `\n\n交点是 $${pt(x, m)}$。`),
            said(
              `Put $x = ${x}$ into the curve: the radicand is $${r * r}$, its root is $${r}$, and ${a === 1 && k === 0 ? `the curve is at $${m}$` : `$${a === 1 ? r : `${a} \\cdot ${r}`}${plus(k)} = ${m}$`}, the height of the line.`,
              `把 $x = ${x}$ 代入曲线：被开方式为 $${r * r}$，根是 $${r}$，${a === 1 && k === 0 ? `曲线的高度是 $${m}$` : `$${a === 1 ? r : `${a} \\cdot ${r}`}${plus(k)} = ${m}$`}，正是直线的高度。`,
            ),
          ),
        });
      },
    },
    {
      id: "slanted-lines",
      figure: algebraDrawings2["finding-intersections-of-lines-and-radical-functions#slanted-lines"],
      title: t("Slanted lines", "斜直线"),
      explanation: t(
        "To intersect $y = \\sqrt{ax + b}$ with the line $y = mx + c$, solve $\\sqrt{ax + b} = mx + c$: square, solve the quadratic, and reject the roots where $mx + c < 0$. They are extraneous: there the line is below the $x$-axis, while the graph of the root never is. Each remaining root $x$ gives the point $(x, mx + c)$.\n\nFor $y = \\sqrt{x + 7}$ and $y = x + 1$: the roots are $2$ and $-3$, and only $x = 2$ gives $x + 1 \\ge 0$. The point is $(2, 3)$.\n\n> **Watch out.** A root of the squared equation gives a point only if $mx + c \\ge 0$. A root that fails lies on the squared curve, not on the graph of the root.",
        "要求 $y = \\sqrt{ax + b}$ 与直线 $y = mx + c$ 的交点，就解 $\\sqrt{ax + b} = mx + c$：两边平方，解二次方程，舍去使 $mx + c < 0$ 的根。它们是增根：在那里直线位于 $x$ 轴下方，而根式的图象永远不会。剩下的每个根 $x$ 给出交点 $(x, mx + c)$。\n\n对于 $y = \\sqrt{x + 7}$ 和 $y = x + 1$：两个根是 $2$ 和 $-3$，只有 $x = 2$ 使 $x + 1 \\ge 0$。交点是 $(2, 3)$。\n\n> **注意。** 平方后方程的根只有在 $mx + c \\ge 0$ 时才给出交点。不满足的根落在平方后的曲线上，而不在根式的图象上。",
      ),
      generate(rng) {
        const g = randomRootLine(rng, (count) => count === 1);
        const [x] = validRoots(g);
        const bad = x === g.r1 ? g.r2 : g.r1;
        const y = g.m * x! + g.c;
        const line = linear(g.m, g.c);
        return pointProblem({
          prompt: t(
            `The graph of $y = ${rootLineLeft(g)}$ meets the line $y = ${line}$ at one point. Find it.`,
            `$y = ${rootLineLeft(g)}$ 的图象与直线 $y = ${line}$ 只有一个交点。求这个交点。`,
          ),
          answer: [x!, y],
          wrong: [
            [bad, g.m * bad + g.c],
            [y, x!],
            [x!, -y],
          ],
          solution: join(
            t(
              `The graphs meet where the two $y$ values agree, so solve $${rootLineLeft(g)} = ${line}$.\n\n`,
              `两个图象在 $y$ 值相等处相交，所以解 $${rootLineLeft(g)} = ${line}$。\n\n`,
            ),
            rootLineWork(
              g,
              1,
              t(
                `So $x = ${x}$, and on the line $y = ${y}$. The point is $${pt(x!, y)}$.`,
                `所以 $x = ${x}$，直线上对应的 $y = ${y}$。交点是 $${pt(x!, y)}$。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "counting-intersections",
      figure: algebraDrawings3["finding-intersections-of-lines-and-radical-functions#counting-intersections"],
      title: t("Counting intersections", "数交点的个数"),
      explanation: t(
        "A line can meet the graph of $y = \\sqrt{ax + b}$ in $0$, $1$ or $2$ points. Squaring $\\sqrt{ax + b} = mx + c$ gives a quadratic with at most two roots, but only the roots with $mx + c \\ge 0$ give intersection points. So count the roots that pass the check, not all the roots of the quadratic.\n\n> **Watch out.** Two roots of the quadratic do not mean two points. Check each root in $mx + c \\ge 0$ before counting.",
        "直线与 $y = \\sqrt{ax + b}$ 的图象可能有 $0$、$1$ 或 $2$ 个交点。把 $\\sqrt{ax + b} = mx + c$ 平方得到的二次方程最多有两个根，但只有满足 $mx + c \\ge 0$ 的根才给出交点。所以要数通过检验的根，而不是二次方程的所有根。\n\n> **注意。** 二次方程有两个根，并不意味着有两个交点。数之前要检验每个根是否满足 $mx + c \\ge 0$。",
      ),
      generate(rng) {
        const target = rng.pick([0, 1, 1, 2, 2]);
        const g = randomRootLine(rng, (count) => count === target);
        const line = linear(g.m, g.c);
        return numberProblem({
          prompt: t(
            `How many points do the graph of $y = ${rootLineLeft(g)}$ and the line $y = ${line}$ have in common?`,
            `$y = ${rootLineLeft(g)}$ 的图象与直线 $y = ${line}$ 有几个公共点？`,
          ),
          answer: target,
          form: "integer",
          wrong: [0, 1, 2].filter((n) => n !== target),
          solution: join(
            t(
              `Each common point comes from a solution of $${rootLineLeft(g)} = ${line}$, so solve it and count.\n\n`,
              `每个公共点都对应 $${rootLineLeft(g)} = ${line}$ 的一个解，所以解这个方程再数解的个数。\n\n`,
            ),
            rootLineWork(
              g,
              1,
              t(
                `${target === 0 ? "Neither root passes" : target === 1 ? "One root passes" : "Both roots pass"}, so there ${target === 1 ? "is $1$ point" : `are $${target}$ points`} in common.`,
                `${target === 0 ? "两个根都不满足" : target === 1 ? "只有一个根满足" : "两个根都满足"}，所以有 $${target}$ 个公共点。`,
              ),
            ),
          ),
        });
      },
    },
  ],
};

/** algebraIIRadicalFunctionsTopics are the topics of Algebra II sections 6.20 and 6.21, radical expressions and graphs of radical functions, in teaching order. */
export const algebraIIRadicalFunctionsTopics: readonly TopicDef[] = [
  simplifyingSquareRootExpressionsUsingPolynomialFactorization,
  solvingAdvancedRadicalEquations,
  graphingTheSquareRootFunction,
  graphTransformationsOfSquareRootFunctions,
  graphingTheCubeRootFunction,
  propertiesOfTransformedSquareRootFunctions,
  theDomainOfATransformedRadicalFunction,
  theRangeOfATransformedRadicalFunction,
  rootsOfTransformedRadicalFunctions,
  inversesOfRadicalFunctions,
  findingIntersectionsOfLinesAndRadicalFunctions,
];
