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

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

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
  "Enter all solutions separated by commas, or $\\varnothing$ if there are none.",
  "请用逗号分隔写出所有解；如果无解，请输入 $\\varnothing$。",
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
  knowledgePoints: [
    {
      id: "perfect-square-trinomials-under-a-root",
      title: t("Perfect-square trinomials", "完全平方三项式"),
      explanation: t(
        "A perfect-square trinomial is the square of a binomial, and $\\sqrt{u^{2}} = |u|$ for any expression $u$:\n\n$$\\sqrt{4x^{2} - 12x + 9} = \\sqrt{(2x - 3)^{2}} = |2x - 3|$$\n\nThe absolute value is needed because $2x - 3$ is negative for some $x$, while a square root never is. If all three terms share a perfect-square factor, take it out first:\n\n$$\\sqrt{16x^{2} + 48x + 36} = \\sqrt{4(4x^{2} + 12x + 9)} = \\sqrt{4(2x + 3)^{2}} = 2|2x + 3|$$",
        "完全平方三项式是二项式的平方，而对任何式子 $u$ 都有 $\\sqrt{u^{2}} = |u|$：\n\n$$\\sqrt{4x^{2} - 12x + 9} = \\sqrt{(2x - 3)^{2}} = |2x - 3|$$\n\n需要绝对值，是因为 $2x - 3$ 对某些 $x$ 是负数，而平方根永远不是负数。如果三项有公共的完全平方因数，先把它提出来：\n\n$$\\sqrt{16x^{2} + 48x + 36} = \\sqrt{4(4x^{2} + 12x + 9)} = \\sqrt{4(2x + 3)^{2}} = 2|2x + 3|$$",
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
        const work =
          k === 1
            ? `\\sqrt{${inside}} = \\sqrt{(${lin})^{2}} = ${answer}`
            : `\\sqrt{${inside}} = \\sqrt{${k * k}(${trinomial(p, b)})} = \\sqrt{${k * k}(${lin})^{2}} = ${answer}`;
        return expressionProblem({
          prompt: anyReal(`\\sqrt{${inside}}`),
          answer,
          radical: true,
          wrong: [linear(k * p, k * b), linear(-k * p, -k * b), `${front(k)}|${linear(p, -b)}|`, ...(k > 1 ? [`${k * k}|${lin}|`] : [])],
          solution: t(
            `${k === 1 ? "The trinomial is a perfect square" : `Take out the common factor $${k * k}$; what is left is a perfect square`}:${steps(work)}The binomial $${lin}$ is negative for some $x$, so the absolute value stays.`,
            `${k === 1 ? "这个三项式是完全平方式" : `提出公因数 $${k * k}$，剩下的是完全平方式`}：${steps(work)}二项式 $${lin}$ 对某些 $x$ 是负数，所以要保留绝对值。`,
          ),
        });
      },
    },
    {
      id: "common-factors-that-are-not-squares",
      title: t("Common factors that are not squares", "不是平方数的公因数"),
      explanation: t(
        "When the common factor is not a perfect square, it stays under the root after the squared binomial comes out. Split it into its largest square factor and the rest:\n\n$$\\sqrt{12x^{2} - 24x + 12} = \\sqrt{12(x - 1)^{2}} = \\sqrt{4 \\cdot 3 \\cdot (x - 1)^{2}} = 2|x - 1|\\sqrt{3}$$",
        "当公因数不是完全平方数时，平方的二项式移到根号外后，它的一部分留在根号内。把它分成最大的平方因数和剩余部分：\n\n$$\\sqrt{12x^{2} - 24x + 12} = \\sqrt{12(x - 1)^{2}} = \\sqrt{4 \\cdot 3 \\cdot (x - 1)^{2}} = 2|x - 1|\\sqrt{3}$$",
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
          solution: t(
            `Take out the common factor $${c}$ and factor the perfect square:${steps(`\\sqrt{${inside}} = \\sqrt{${c}(${trinomial(1, b)})} = \\sqrt{${c}(${lin})^{2}}${split} = ${answer}`)}`,
            `提出公因数 $${c}$，再分解完全平方式：${steps(`\\sqrt{${inside}} = \\sqrt{${c}(${trinomial(1, b)})} = \\sqrt{${c}(${lin})^{2}}${split} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "a-common-factor-of-x",
      title: t("A common factor of $x$", "公因式 $x$"),
      explanation: t(
        "A common factor can contain $x$. Factor it out, then factor the perfect square that is left:\n\n$$\\sqrt{x^{3} - 6x^{2} + 9x} = \\sqrt{x(x^{2} - 6x + 9)} = \\sqrt{x(x - 3)^{2}} = |x - 3|\\sqrt{x}$$\n\nThe expression is defined only for $x \\ge 0$, but $x - 3$ is still negative for $0 \\le x < 3$, so the absolute value stays.",
        "公因式可以含有 $x$。先提出它，再分解剩下的完全平方式：\n\n$$\\sqrt{x^{3} - 6x^{2} + 9x} = \\sqrt{x(x^{2} - 6x + 9)} = \\sqrt{x(x - 3)^{2}} = |x - 3|\\sqrt{x}$$\n\n这个式子只在 $x \\ge 0$ 时有意义，但当 $0 \\le x < 3$ 时 $x - 3$ 仍是负数，所以要保留绝对值。",
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
          solution: t(
            `Factor out $${gcf}$, then factor the perfect square:${steps(`\\sqrt{${inside}} = \\sqrt{${gcf}(${trinomial(1, -b)})} = \\sqrt{${gcf}(${lin})^{2}} = ${answer}`)}For $0 \\le x < ${b}$, $${lin}$ is negative, so the absolute value stays.`,
            `提出 $${gcf}$，再分解完全平方式：${steps(`\\sqrt{${inside}} = \\sqrt{${gcf}(${trinomial(1, -b)})} = \\sqrt{${gcf}(${lin})^{2}} = ${answer}`)}当 $0 \\le x < ${b}$ 时 $${lin}$ 是负数，所以要保留绝对值。`,
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

/** rootLineWork squares √(ax + b) = mx + c, solves the quadratic and checks each root. */
function rootLineWork(g: RootLine): Text {
  const { a, b, m, c, r1, r2 } = g;
  const factor = `${m * m === 1 ? "" : m * m}(${linear(1, -r1)})(${linear(1, -r2)}) = 0`;
  const work = steps(
    `${linear(a, b)} = ${poly([m * m, "x^{2}"], [2 * m * c, "x"], [c * c, ""])}`,
    `${poly([m * m, "x^{2}"], [2 * m * c - a, "x"], [c * c - b, ""])} = 0`,
    factor,
  );
  const right = linear(m, c);
  const check = (r: number) => {
    const v = m * r + c;
    return v >= 0
      ? t(`At $x = ${r}$, $${right} = ${v}$, which is not negative: a solution.`, `当 $x = ${r}$ 时，$${right} = ${v}$，不是负数：是解。`)
      : t(
          `At $x = ${r}$, $${right} = ${v}$, but a square root is never negative: extraneous.`,
          `当 $x = ${r}$ 时，$${right} = ${v}$，但平方根不可能是负数：是增根。`,
        );
  };
  const [c1, c2] = [check(r1), check(r2)];
  return t(
    `Square both sides and solve the quadratic:${work}Check each root in $${right}$, which must equal a square root. ${c1.en} ${c2.en}`,
    `两边平方，解所得的二次方程：${work}检验每个根，$${right}$ 必须等于一个平方根。${c1["zh-CN"]}${c2["zh-CN"]}`,
  );
}

/** rootLineWrong are the solution sets of keeping every root, keeping none, and keeping the wrong ones. */
function rootLineWrong(g: RootLine): string[][] {
  const valid = validRoots(g);
  const invalid = [g.r1, g.r2].filter((r) => !valid.includes(r));
  return [sols([g.r1, g.r2]), [], sols(invalid)];
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
    { topic: "solving-odd-power-equations", weight: 0.2 },
  ],
  xp: 20,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "roots-equal-to-linear-expressions",
      title: t("A root equal to a linear expression", "根式等于一次式"),
      explanation: t(
        "When the other side is a linear expression, squaring both sides gives a quadratic equation. Solve it, then check every root: a square root is never negative, so a root that makes the other side negative is extraneous.\n\n$$\\sqrt{x + 7} = x + 1 \\;\\Rightarrow\\; x + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; x^{2} + x - 6 = 0 \\;\\Rightarrow\\; (x + 3)(x - 2) = 0$$\n\nAt $x = 2$, $x + 1 = 3$: a solution. At $x = -3$, $x + 1 = -2 < 0$: extraneous. The only solution is $x = 2$.",
        "当另一边是一次式时，两边平方得到一个二次方程。解出它，再检验每个根：平方根永远不是负数，所以使另一边为负的根是增根。\n\n$$\\sqrt{x + 7} = x + 1 \\;\\Rightarrow\\; x + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; x^{2} + x - 6 = 0 \\;\\Rightarrow\\; (x + 3)(x - 2) = 0$$\n\n当 $x = 2$ 时，$x + 1 = 3$：是解。当 $x = -3$ 时，$x + 1 = -2 < 0$：是增根。唯一的解是 $x = 2$。",
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
        "Squaring a side that is a sum with a root, such as $x - \\sqrt{x + 10}$, does not remove the root. Isolate the root first:\n\n$$x - \\sqrt{x + 10} = 2 \\;\\Rightarrow\\; \\sqrt{x + 10} = x - 2 \\;\\Rightarrow\\; x + 10 = x^{2} - 4x + 4 \\;\\Rightarrow\\; (x - 6)(x + 1) = 0$$\n\nAt $x = 6$, $x - 2 = 4$: a solution. At $x = -1$, $x - 2 = -3$: extraneous.",
        "如果一边是含根式的和，比如 $x - \\sqrt{x + 10}$，直接平方并不能消去根号。先分离根式：\n\n$$x - \\sqrt{x + 10} = 2 \\;\\Rightarrow\\; \\sqrt{x + 10} = x - 2 \\;\\Rightarrow\\; x + 10 = x^{2} - 4x + 4 \\;\\Rightarrow\\; (x - 6)(x + 1) = 0$$\n\n当 $x = 6$ 时，$x - 2 = 4$：是解。当 $x = -1$ 时，$x - 2 = -3$：是增根。",
      ),
      generate(rng) {
        const g = randomRootLine(rng);
        const left = rootLineLeft(g);
        const mx = linear(g.m, 0);
        const form = rng.int(0, 2);
        let eq: string;
        if (form === 0) eq = `${mx} - ${left} = ${-g.c}`;
        else if (form === 1) eq = `${left} - ${mx} = ${g.c}`;
        else {
          const p = rng.nonZero(-9, 9);
          eq = `${left}${plus(p)} = ${linear(g.m, g.c + p)}`;
        }
        const work = rootLineWork(g);
        const isolated = `${left} = ${linear(g.m, g.c)}`;
        return solutionsProblem({
          prompt: solve(eq),
          values: sols(validRoots(g)),
          wrong: rootLineWrong(g),
          solution: t(`Isolate the root:${steps(isolated)}${work.en}`, `先分离根式：${steps(isolated)}${work["zh-CN"]}`),
        });
      },
    },
    {
      id: "two-square-roots",
      title: t("Two square roots", "两个平方根"),
      explanation: t(
        "With two square roots, isolate one and square; the $x$ terms cancel and one root is left. Isolate it and square again:\n\n$$\\sqrt{x + 5} + \\sqrt{x} = 5 \\;\\Rightarrow\\; \\sqrt{x + 5} = 5 - \\sqrt{x} \\;\\Rightarrow\\; x + 5 = 25 - 10\\sqrt{x} + x$$\n\nSo $10\\sqrt{x} = 20$, $\\sqrt{x} = 2$ and $x = 4$. Check: $\\sqrt{9} + \\sqrt{4} = 5$. If the isolated root comes out negative, there is no solution. Do not square each term on its own: $(p + q)^{2} \\ne p^{2} + q^{2}$.",
        "有两个平方根时，先分离出一个再平方；$x$ 项相互抵消，只剩一个根式。再分离它并再次平方：\n\n$$\\sqrt{x + 5} + \\sqrt{x} = 5 \\;\\Rightarrow\\; \\sqrt{x + 5} = 5 - \\sqrt{x} \\;\\Rightarrow\\; x + 5 = 25 - 10\\sqrt{x} + x$$\n\n所以 $10\\sqrt{x} = 20$，$\\sqrt{x} = 2$，$x = 4$。检验：$\\sqrt{9} + \\sqrt{4} = 5$。如果分离出的根式等于负数，方程无解。不要把每一项分别平方：$(p + q)^{2} \\ne p^{2} + q^{2}$。",
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
            solution: t(
              `Isolate $\\sqrt{${P}}$ and square, then isolate the other root and square again:${steps(`\\sqrt{${P}} = ${c} - \\sqrt{${R}}`, `${P} = ${c * c} - ${2 * c}\\sqrt{${R}} + ${R}`, `${2 * c}\\sqrt{${R}} = ${c * c + q - p}`, `\\sqrt{${R}} = ${v}`, `x = ${x0}`)}Check: $\\sqrt{${u * u}} + \\sqrt{${v * v}} = ${u} + ${v} = ${c}$.`,
              `分离 $\\sqrt{${P}}$ 并平方，再分离另一个根式并再次平方：${steps(`\\sqrt{${P}} = ${c} - \\sqrt{${R}}`, `${P} = ${c * c} - ${2 * c}\\sqrt{${R}} + ${R}`, `${2 * c}\\sqrt{${R}} = ${c * c + q - p}`, `\\sqrt{${R}} = ${v}`, `x = ${x0}`)}检验：$\\sqrt{${u * u}} + \\sqrt{${v * v}} = ${u} + ${v} = ${c}$。`,
            ),
          });
        }
        const c = u - v;
        if (kind === "difference") {
          return solutionsProblem({
            prompt: solve(`\\sqrt{${P}} - \\sqrt{${R}} = ${c}`),
            values: [num(x0)],
            wrong: [[], [num(v * v - p)], [num(u * u - q)]],
            solution: t(
              `Isolate $\\sqrt{${P}}$ and square, then isolate the other root and square again:${steps(`\\sqrt{${P}} = ${c} + \\sqrt{${R}}`, `${P} = ${c * c} + ${2 * c}\\sqrt{${R}} + ${R}`, `${2 * c}\\sqrt{${R}} = ${p - q - c * c}`, `\\sqrt{${R}} = ${v}`, `x = ${x0}`)}Check: $\\sqrt{${u * u}} - \\sqrt{${v * v}} = ${u} - ${v} = ${c}$.`,
              `分离 $\\sqrt{${P}}$ 并平方，再分离另一个根式并再次平方：${steps(`\\sqrt{${P}} = ${c} + \\sqrt{${R}}`, `${P} = ${c * c} + ${2 * c}\\sqrt{${R}} + ${R}`, `${2 * c}\\sqrt{${R}} = ${p - q - c * c}`, `\\sqrt{${R}} = ${v}`, `x = ${x0}`)}检验：$\\sqrt{${u * u}} - \\sqrt{${v * v}} = ${u} - ${v} = ${c}$。`,
            ),
          });
        }
        return solutionsProblem({
          prompt: solve(`\\sqrt{${R}} - \\sqrt{${P}} = ${c}`),
          values: [],
          wrong: [[num(x0)]],
          solution: t(
            `Isolate $\\sqrt{${R}}$ and square:${steps(`\\sqrt{${R}} = ${c} + \\sqrt{${P}}`, `${R} = ${c * c} + ${2 * c}\\sqrt{${P}} + ${P}`, `${2 * c}\\sqrt{${P}} = ${q - p - c * c}`, `\\sqrt{${P}} = ${-u}`)}A square root is never negative, so there is no solution. (Squaring once more would give the extraneous root $x = ${x0}$.)`,
            `分离 $\\sqrt{${R}}$ 并平方：${steps(`\\sqrt{${R}} = ${c} + \\sqrt{${P}}`, `${R} = ${c * c} + ${2 * c}\\sqrt{${P}} + ${P}`, `${2 * c}\\sqrt{${P}} = ${q - p - c * c}`, `\\sqrt{${P}} = ${-u}`)}平方根不可能是负数，所以方程无解。（再平方一次会得到增根 $x = ${x0}$。）`,
          ),
        });
      },
    },
    {
      id: "cube-root-equations",
      title: t("Cube root equations", "立方根方程"),
      explanation: t(
        "Undo a cube root by isolating it and cubing both sides. A cube root can be negative, so cubing creates no extraneous solutions:\n\n$$2\\sqrt[3]{x - 3} + 7 = 1 \\;\\Rightarrow\\; \\sqrt[3]{x - 3} = -3 \\;\\Rightarrow\\; x - 3 = -27 \\;\\Rightarrow\\; x = -24$$",
        "要消去立方根，先把它分离出来，再两边立方。立方根可以是负数，所以立方不会产生增根：\n\n$$2\\sqrt[3]{x - 3} + 7 = 1 \\;\\Rightarrow\\; \\sqrt[3]{x - 3} = -3 \\;\\Rightarrow\\; x - 3 = -27 \\;\\Rightarrow\\; x = -24$$",
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
        const lines = [...(k === 1 ? [] : [`${front(k)}${cube} = ${e - d}`]), `${cube} = ${r}`, `${linear(a, b)} = ${r ** 3}`, `x = ${x0}`];
        return solutionsProblem({
          prompt: solve(`${front(k)}${cube}${plus(d)} = ${e}`),
          values: [num(x0)],
          wrong: [
            [num(Q.of(r * r - b, a))],
            ...(r !== 0 ? [[num(Q.of(-(r ** 3) - b, a))]] : []),
            ...(k !== 1 ? [[num(Q.of((e - d) ** 3 - b, a))]] : []),
            ...(r < 0 ? [[]] : []),
          ],
          solution: t(
            `Isolate the cube root, cube both sides and solve:${steps(...lines)}`,
            `分离立方根，两边立方并求解：${steps(...lines)}`,
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
  encompasses: [
    { topic: "range-of-a-function", weight: 0.3 },
    { topic: "domain-of-a-function", weight: 0.3 },
    { topic: "graphs-of-functions", weight: 0.3 },
    { topic: "simplifying-square-roots", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.B"],
  knowledgePoints: [
    {
      id: "values-of-the-square-root-function",
      title: t("Values of the square root function", "平方根函数的值"),
      explanation: t(
        "The **square root function** $f(x) = \\sqrt{x}$ takes each number $x \\ge 0$ to the number $y \\ge 0$ with $y^{2} = x$. Perfect squares give the easiest points: $(0, 0)$, $(1, 1)$, $(4, 2)$, $(9, 3)$. Other values are written in simplest radical form, such as $f(12) = \\sqrt{12} = 2\\sqrt{3}$.\n\nTo find where $f(x) = 5$, undo the root by squaring: $x = 5^{2} = 25$.",
        "**平方根函数** $f(x) = \\sqrt{x}$ 把每个 $x \\ge 0$ 对应到满足 $y^{2} = x$ 的 $y \\ge 0$。完全平方数给出最容易的点：$(0, 0)$、$(1, 1)$、$(4, 2)$、$(9, 3)$。其他的值写成最简根式，比如 $f(12) = \\sqrt{12} = 2\\sqrt{3}$。\n\n要求使 $f(x) = 5$ 的 $x$，用平方撤销根号：$x = 5^{2} = 25$。",
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
            solution: t(
              `${steps(`f(${n}) = \\sqrt{${n}}${k > 1 && m > 1 ? ` = \\sqrt{${k * k}} \\cdot \\sqrt{${m}}` : ""} = ${radical(k, m)}`)}`,
              `${steps(`f(${n}) = \\sqrt{${n}}${k > 1 && m > 1 ? ` = \\sqrt{${k * k}} \\cdot \\sqrt{${m}}` : ""} = ${radical(k, m)}`)}`,
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
          solution: t(
            `$\\sqrt{x} = ${v.toLatex()}$, so squaring gives $x = \\left(${v.toLatex()}\\right)^{2} = ${x.toLatex()}$.`,
            `$\\sqrt{x} = ${v.toLatex()}$，两边平方得 $x = \\left(${v.toLatex()}\\right)^{2} = ${x.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "points-on-the-square-root-graph",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "The point $(p, q)$ is on the graph of $y = \\sqrt{x}$ exactly when $q = \\sqrt{p}$, that is, when $q \\ge 0$ and $q^{2} = p$. So:\n\n- no point has a negative $x$-coordinate: $\\sqrt{x}$ is not defined for $x < 0$, and the graph lies to the right of the $y$-axis;\n- no point has a negative $y$-coordinate: the graph lies on or above the $x$-axis.\n\n$(16, 4)$ is on the graph, but $(16, -4)$ and $(4, 16)$ are not.",
        "点 $(p, q)$ 在 $y = \\sqrt{x}$ 的图象上当且仅当 $q = \\sqrt{p}$，即 $q \\ge 0$ 且 $q^{2} = p$。所以：\n\n- 没有点的横坐标是负数：$x < 0$ 时 $\\sqrt{x}$ 没有定义，图象在 $y$ 轴右侧；\n- 没有点的纵坐标是负数：图象在 $x$ 轴上或上方。\n\n$(16, 4)$ 在图象上，而 $(16, -4)$ 和 $(4, 16)$ 不在。",
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
          solution: t(`${on ? "Yes" : "No"}: ${reason.en}`, `${on ? "在" : "不在"}：${reason["zh-CN"]}`),
        });
      },
    },
    {
      id: "inequalities-from-the-graph",
      title: t("Reading inequalities from the graph", "从图象读出不等式的解"),
      explanation: t(
        "The domain of $y = \\sqrt{x}$ is $[0, \\infty)$ and its range is $[0, \\infty)$. The graph rises from left to right, so larger inputs always give larger outputs. To find where $\\sqrt{x} < 3$, find where the graph reaches the height $3$, at $x = 9$: the graph is below that height to the left of $x = 9$, back to the start of the domain at $x = 0$. So $\\sqrt{x} < 3$ for $x$ in $[0, 9)$, and $\\sqrt{x} \\ge 3$ for $x$ in $[9, \\infty)$.",
        "$y = \\sqrt{x}$ 的定义域是 $[0, \\infty)$，值域是 $[0, \\infty)$。图象从左到右上升，所以输入越大输出越大。要求 $\\sqrt{x} < 3$ 的解，找出图象到达高度 $3$ 的位置 $x = 9$：在 $x = 9$ 左边、直到定义域起点 $x = 0$，图象都低于这个高度。所以 $\\sqrt{x} < 3$ 的解是 $[0, 9)$，$\\sqrt{x} \\ge 3$ 的解是 $[9, \\infty)$。",
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
          solution: t(
            `The graph reaches the height $${k}$ at $x = ${k}^{2} = ${k2}$ and rises from left to right${below ? `, so it is ${op === "<" ? "below" : "at or below"} that height from the start of the domain, $x = 0$, ${op === "<" ? "up to but not including" : "up to and including"} $x = ${k2}$` : `, so it is ${op === ">" ? "above" : "at or above"} that height for $x ${op} ${k2}$`}. The answer is ${setText(set)}.`,
            `图象在 $x = ${k}^{2} = ${k2}$ 处到达高度 $${k}$，并且从左到右上升${below ? `，所以从定义域起点 $x = 0$ 到 $x = ${k2}$（${op === "<" ? "不含" : "含"}）图象${op === "<" ? "低于" : "不高于"}这个高度` : `，所以当 $x ${op} ${k2}$ 时图象${op === ">" ? "高于" : "不低于"}这个高度`}。答案是 ${setText(set)}。`,
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
  encompasses: [
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.4 },
    { topic: "graphing-the-square-root-function", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "the-endpoint",
      title: t("The endpoint", "端点"),
      explanation: t(
        "The graph of $y = \\sqrt{x}$ starts at the **endpoint** $(0, 0)$. The graph of $y = a\\sqrt{x - h} + k$ is that graph shifted $h$ units right and $k$ units up, after a vertical stretch or reflection, so it starts at $(h, k)$: the root is $0$ when $x = h$, and then $y = k$.\n\nThe same holds for $y = a\\sqrt{h - x} + k$, whose graph is reflected in a vertical line and extends to the left. For $y = -2\\sqrt{x + 4} + 1$, the root is $0$ at $x = -4$, so the endpoint is $(-4, 1)$.",
        "$y = \\sqrt{x}$ 的图象从**端点** $(0, 0)$ 出发。$y = a\\sqrt{x - h} + k$ 的图象是把它竖直伸缩或翻折后，再向右平移 $h$ 个单位、向上平移 $k$ 个单位，所以从 $(h, k)$ 出发：当 $x = h$ 时根式为 $0$，此时 $y = k$。\n\n$y = a\\sqrt{h - x} + k$ 也是如此，它的图象关于一条竖直直线翻折过，向左延伸。对于 $y = -2\\sqrt{x + 4} + 1$，当 $x = -4$ 时根式为 $0$，所以端点是 $(-4, 1)$。",
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
          solution: t(
            `The root is $0$ when $${sqrtInner(s, h)} = 0$, that is, at $x = ${h}$. Then $y = ${k}$, so the endpoint is $${pt(h, k)}$.`,
            `当 $${sqrtInner(s, h)} = 0$，即 $x = ${h}$ 时，根式为 $0$，此时 $y = ${k}$，所以端点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "equations-from-transformations",
      title: t("Equations from transformations", "由变换写解析式"),
      explanation: t(
        "Apply the transformations to $y = \\sqrt{x}$ in order:\n\n- reflect in the $y$-axis: $x$ becomes $-x$;\n- shift right $h$: $x$ becomes $x - h$;\n- reflect in the $x$-axis or stretch vertically by $a$: multiply the root by $-1$ or $a$;\n- shift up $k$: add $k$.\n\nReflecting $y = \\sqrt{x}$ in the $y$-axis gives $y = \\sqrt{-x}$; shifting it right $3$ then gives $y = \\sqrt{-(x - 3)} = \\sqrt{3 - x}$; stretching by $2$ and shifting down $1$ gives $y = 2\\sqrt{3 - x} - 1$.",
        "按顺序对 $y = \\sqrt{x}$ 进行变换：\n\n- 关于 $y$ 轴翻折：把 $x$ 换成 $-x$；\n- 向右平移 $h$：把 $x$ 换成 $x - h$；\n- 关于 $x$ 轴翻折或竖直伸长为 $a$ 倍：根式乘以 $-1$ 或 $a$；\n- 向上平移 $k$：加上 $k$。\n\n把 $y = \\sqrt{x}$ 关于 $y$ 轴翻折得 $y = \\sqrt{-x}$；再向右平移 $3$ 得 $y = \\sqrt{-(x - 3)} = \\sqrt{3 - x}$；再竖直伸长为 $2$ 倍并向下平移 $1$ 得 $y = 2\\sqrt{3 - x} - 1$。",
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
          solution: t(
            `The ${reflectY ? "reflection in the $y$-axis and the " : ""}horizontal shift act on $x$: $${reflectY ? `\\sqrt{-x}` : "\\sqrt{x}"}$ becomes $${root(2, sqrtInner(s, h))}$. The rest act on the output: multiply by $${a}$ and add $${k}$. So $y = ${answer}$.`,
            `${reflectY ? "关于 $y$ 轴的翻折和" : ""}水平平移作用在 $x$ 上：$${reflectY ? `\\sqrt{-x}` : "\\sqrt{x}"}$ 变成 $${root(2, sqrtInner(s, h))}$。其余的变换作用在输出上：乘以 $${a}$，再加上 $${k}$。所以 $y = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "equations-from-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "To write the equation of a transformed square-root graph:\n\n1. read the endpoint $(h, k)$;\n2. see which way the graph goes from it: to the right means $\\sqrt{x - h}$, to the left $\\sqrt{h - x}$;\n3. find $a$ from the point one unit across from the endpoint: there the root is $1$, so the graph is $a$ units above the endpoint (below when $a < 0$).\n\nA graph starting at $(2, -1)$, going right and passing through $(3, 1)$ has $a = 2$: $y = 2\\sqrt{x - 2} - 1$.",
        "要写出变换后平方根函数图象的解析式：\n\n1. 读出端点 $(h, k)$；\n2. 看图象从端点向哪边延伸：向右是 $\\sqrt{x - h}$，向左是 $\\sqrt{h - x}$；\n3. 由与端点水平相距一个单位的点求 $a$：那里根式等于 $1$，所以图象比端点高 $a$ 个单位（$a < 0$ 时是低）。\n\n从 $(2, -1)$ 出发、向右延伸并经过 $(3, 1)$ 的图象有 $a = 2$：$y = 2\\sqrt{x - 2} - 1$。",
      ),
      generate(rng) {
        const g = randomSqrtGraph(rng);
        const answer = sqrtLatex(g);
        const [, p1] = sqrtPoints(g);
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
            solution: t(
              `The endpoint is $${pt(g.h, g.k)}$ and the graph extends to the ${g.s > 0 ? "right" : "left"}, so the root is $${root(2, sqrtInner(g.s, g.h))}$. At $${pt(p1![0], p1![1])}$ the root is $1$ and the graph is $${g.a}$ from the endpoint's height, so $a = ${g.a}$ and $y = ${answer}$.`,
              `端点是 $${pt(g.h, g.k)}$，图象向${g.s > 0 ? "右" : "左"}延伸，所以根式是 $${root(2, sqrtInner(g.s, g.h))}$。在 $${pt(p1![0], p1![1])}$ 处根式为 $1$，图象与端点的高度差为 $${g.a}$，所以 $a = ${g.a}$，$y = ${answer}$。`,
            ),
          }),
          figure: sqrtFigure(g),
        };
      },
    },
    {
      id: "the-direction-of-the-graph",
      title: t("Which way the graph goes", "图象的延伸方向"),
      explanation: t(
        "From its endpoint, the graph of $y = a\\sqrt{bx + c} + k$ extends:\n\n- to the **right** when $b > 0$ (the radicand grows as $x$ grows) and to the **left** when $b < 0$;\n- **upward** when $a > 0$ and **downward** when $a < 0$.\n\nSo $y = -\\sqrt{4 - 2x} + 3$, with $b = -2$ and $a = -1$, extends to the left and downward.",
        "从端点出发，$y = a\\sqrt{bx + c} + k$ 的图象：\n\n- 当 $b > 0$ 时向**右**延伸（$x$ 增大时被开方式增大），当 $b < 0$ 时向**左**延伸；\n- 当 $a > 0$ 时向**上**，当 $a < 0$ 时向**下**。\n\n所以 $y = -\\sqrt{4 - 2x} + 3$ 中 $b = -2$，$a = -1$，图象向左下方延伸。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const b = rng.pick([1, -1, 2, -2, 3, -3]);
        const c = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const inner = b < 0 && c > 0 && rng.bool() ? poly([c, ""], [b, "x"]) : linear(b, c);
        const correct = (b > 0 ? 0 : 2) + (a > 0 ? 0 : 1);
        return choiceProblem({
          prompt: t(
            `From its endpoint, in which direction does the graph of $y = ${rootFn(a, inner, k)}$ extend?`,
            `从端点出发，$y = ${rootFn(a, inner, k)}$ 的图象向哪个方向延伸？`,
          ),
          options: [
            t("Right and up", "向右上方"),
            t("Right and down", "向右下方"),
            t("Left and up", "向左上方"),
            t("Left and down", "向左下方"),
          ],
          correct,
          solution: t(
            `The coefficient of $x$ under the root is $${b}$, ${b > 0 ? "positive, so the graph extends to the right" : "negative, so the graph extends to the left"}. The coefficient of the root is $${a}$, ${a > 0 ? "positive, so it goes up" : "negative, so it goes down"}.`,
            `根号下 $x$ 的系数是 $${b}$，${b > 0 ? "为正，所以图象向右延伸" : "为负，所以图象向左延伸"}。根式的系数是 $${a}$，${a > 0 ? "为正，所以向上" : "为负，所以向下"}。`,
          ),
        });
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
  encompasses: [
    { topic: "graph-transformations-of-square-root-functions", weight: 0.3 },
    { topic: "cube-roots-of-algebraic-perfect-cubes", weight: 0.2 },
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "values-of-the-cube-root-function",
      title: t("Values of the cube root function", "立方根函数的值"),
      explanation: t(
        "The **cube root function** $f(x) = \\sqrt[3]{x}$ takes each real number $x$ to the number $y$ with $y^{3} = x$. Unlike the square root, it is defined for negative numbers too, and its values can be negative: $\\sqrt[3]{-8} = -2$ because $(-2)^{3} = -8$. Perfect cubes give the easiest points: $(-8, -2)$, $(-1, -1)$, $(0, 0)$, $(1, 1)$, $(8, 2)$.\n\nTo find where $f(x) = -3$, cube: $x = (-3)^{3} = -27$.",
        "**立方根函数** $f(x) = \\sqrt[3]{x}$ 把每个实数 $x$ 对应到满足 $y^{3} = x$ 的数 $y$。与平方根不同，它对负数也有定义，函数值也可以是负数：$\\sqrt[3]{-8} = -2$，因为 $(-2)^{3} = -8$。完全立方数给出最容易的点：$(-8, -2)$、$(-1, -1)$、$(0, 0)$、$(1, 1)$、$(8, 2)$。\n\n要求使 $f(x) = -3$ 的 $x$，两边立方：$x = (-3)^{3} = -27$。",
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
            solution: t(
              `$\\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}$, so $f\\left(${cube.toLatex()}\\right) = ${v.toLatex()}$.`,
              `$\\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}$，所以 $f\\left(${cube.toLatex()}\\right) = ${v.toLatex()}$。`,
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
          solution: t(
            `$\\sqrt[3]{x} = ${v.toLatex()}$, so cubing gives $x = \\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}$.`,
            `$\\sqrt[3]{x} = ${v.toLatex()}$，两边立方得 $x = \\left(${v.toLatex()}\\right)^{3} = ${cube.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "points-on-the-cube-root-graph",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "The point $(p, q)$ is on the graph of $y = \\sqrt[3]{x}$ exactly when $q^{3} = p$. The graph passes through all four quadrants' neighbours: it runs from the lower left, through the origin, to the upper right, and it is symmetric about the origin, because $\\sqrt[3]{-x} = -\\sqrt[3]{x}$. So $(-27, -3)$ is on the graph, but $(-27, 3)$ and $(9, 3)$ are not.",
        "点 $(p, q)$ 在 $y = \\sqrt[3]{x}$ 的图象上当且仅当 $q^{3} = p$。图象从左下方经过原点延伸到右上方，并且关于原点对称，因为 $\\sqrt[3]{-x} = -\\sqrt[3]{x}$。所以 $(-27, -3)$ 在图象上，而 $(-27, 3)$ 和 $(9, 3)$ 不在。",
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
          solution: t(`${on ? "Yes" : "No"}: ${reason.en}`, `${on ? "在" : "不在"}：${reason["zh-CN"]}`),
        });
      },
    },
    {
      id: "transformed-cube-root-graphs",
      title: t("Transformed cube root graphs", "变换后的立方根函数图象"),
      explanation: t(
        "The graph of $y = \\sqrt[3]{x}$ is steepest at its **center** $(0, 0)$, about which it is symmetric. The graph of $y = a\\sqrt[3]{x - h} + k$ is that graph stretched by $a$ (and reflected when $a < 0$) and moved so that its center is at $(h, k)$. One unit right of the center the root is $1$, so the graph is at height $k + a$.\n\nFor $y = -2\\sqrt[3]{x + 1} + 3$, the center is $(-1, 3)$ and the graph passes through $(0, 1)$ and $(-2, 5)$.",
        "$y = \\sqrt[3]{x}$ 的图象在**中心** $(0, 0)$ 处最陡，并关于它对称。$y = a\\sqrt[3]{x - h} + k$ 的图象是把它伸缩为 $a$ 倍（$a < 0$ 时还要翻折），再移到中心为 $(h, k)$ 的位置。在中心右边一个单位处根式为 $1$，所以图象的高度是 $k + a$。\n\n对于 $y = -2\\sqrt[3]{x + 1} + 3$，中心是 $(-1, 3)$，图象经过 $(0, 1)$ 和 $(-2, 5)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2]);
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const eq = (p: number, q: number, r: number) => same(`$y = ${rootFn(p, shifted(q), r, 3)}$`);
        return {
          ...shuffled(
            rng,
            t("Which equation has the graph shown?", "图中的图象是哪个方程的图象？"),
            [eq(a, h, k), eq(a, -h, k), eq(a, h, -k), eq(-a, h, k)],
            t(
              `The center of the graph is $${pt(h, k)}$, so the equation has the form $y = a\\sqrt[3]{${shifted(h)}}${plus(k)}$. One unit right of the center, at $${pt(h + 1, k + a)}$, the graph is $${a}$ from the center's height, so $a = ${a}$: $y = ${rootFn(a, shifted(h), k, 3)}$.`,
              `图象的中心是 $${pt(h, k)}$，所以方程形如 $y = a\\sqrt[3]{${shifted(h)}}${plus(k)}$。在中心右边一个单位处 $${pt(h + 1, k + a)}$，图象与中心的高度差为 $${a}$，所以 $a = ${a}$：$y = ${rootFn(a, shifted(h), k, 3)}$。`,
            ),
          ),
          figure: cbrtFigure(a, h, k),
        };
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
    { topic: "global-extrema", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B", "CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "increasing-or-decreasing",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "On its domain, $f(x) = a\\sqrt{bx + c} + k$ is either increasing everywhere or decreasing everywhere. As $x$ increases:\n\n- $bx + c$ increases when $b > 0$, so the root increases; it decreases when $b < 0$;\n- multiplying by a negative $a$ reverses the direction.\n\nSo $f$ is **increasing** when $a$ and $b$ have the same sign and **decreasing** when they have opposite signs. $f(x) = -3\\sqrt{2x + 1}$ is decreasing; $f(x) = -\\sqrt{5 - x}$ is increasing.",
        "在定义域上，$f(x) = a\\sqrt{bx + c} + k$ 要么处处递增，要么处处递减。当 $x$ 增大时：\n\n- 若 $b > 0$，$bx + c$ 增大，根式增大；若 $b < 0$，它减小；\n- 乘以负数 $a$ 会使方向反过来。\n\n所以 $a$ 与 $b$ 同号时 $f$ **递增**，异号时 $f$ **递减**。$f(x) = -3\\sqrt{2x + 1}$ 递减；$f(x) = -\\sqrt{5 - x}$ 递增。",
      ),
      keyPrerequisites: ["increasing-and-decreasing"],
      generate(rng) {
        const f = randomRootFn(rng);
        const up = f.a * f.b > 0;
        return choiceProblem({
          prompt: t(`Is ${fIs(f)} increasing or decreasing on its domain?`, `${fIs(f)} 在定义域上是递增还是递减？`),
          options: [t("Increasing", "递增"), t("Decreasing", "递减")],
          correct: up ? 0 : 1,
          solution: t(
            `As $x$ increases, $${linear(f.b, f.c)}$ ${f.b > 0 ? "increases" : "decreases"}, so the root ${f.b > 0 ? "increases" : "decreases"}. Multiplying by $${f.a}$ ${f.a > 0 ? "keeps" : "reverses"} that direction, so $f$ is ${up ? "increasing" : "decreasing"}.`,
            `当 $x$ 增大时，$${linear(f.b, f.c)}$ ${f.b > 0 ? "增大" : "减小"}，所以根式${f.b > 0 ? "增大" : "减小"}。乘以 $${f.a}$ ${f.a > 0 ? "保持" : "反转"}了这个方向，所以 $f$ ${up ? "递增" : "递减"}。`,
          ),
        });
      },
    },
    {
      id: "maximum-or-minimum-value",
      title: t("The maximum or minimum value", "最大值或最小值"),
      explanation: t(
        "A square root is smallest, $0$, at the endpoint, where the radicand is $0$, and grows without bound away from it. So $f(x) = a\\sqrt{bx + c} + k$ takes the value $k$ at its endpoint, and:\n\n- when $a > 0$, $k$ is its **minimum** value and it has no maximum;\n- when $a < 0$, $k$ is its **maximum** value and it has no minimum.\n\n$f(x) = -2\\sqrt{x - 3} + 5$ has the maximum value $5$, at $x = 3$.",
        "平方根在端点（被开方式为 $0$ 处）最小，等于 $0$，离开端点后无限增大。所以 $f(x) = a\\sqrt{bx + c} + k$ 在端点处取值 $k$，并且：\n\n- 当 $a > 0$ 时，$k$ 是它的**最小值**，它没有最大值；\n- 当 $a < 0$ 时，$k$ 是它的**最大值**，它没有最小值。\n\n$f(x) = -2\\sqrt{x - 3} + 5$ 的最大值是 $5$，在 $x = 3$ 处取得。",
      ),
      keyPrerequisites: ["global-extrema"],
      generate(rng) {
        const f = randomRootFn(rng);
        const x0 = endX(f);
        const min = (v: Coefficient) => t(`A minimum value of $${num(v)}$`, `最小值 $${num(v)}$`);
        const max = (v: Coefficient) => t(`A maximum value of $${num(v)}$`, `最大值 $${num(v)}$`);
        const [right, other] = f.a > 0 ? [min, max] : [max, min];
        return shuffled(
          rng,
          t(`Which describes ${fIs(f)}?`, `下列哪一项描述了 ${fIs(f)}？`),
          [right(f.k), other(f.k), right(x0), other(x0), t("Neither a maximum nor a minimum value", "既没有最大值也没有最小值")],
          t(
            `At the endpoint $x = ${x0.toLatex()}$ the root is $0$ and $f = ${f.k}$. Away from it the root grows, and multiplying by $${f.a}$ makes $f$ ${f.a > 0 ? "grow" : "fall"}. So $${f.k}$ is the ${f.a > 0 ? "minimum" : "maximum"} value, and there is no ${f.a > 0 ? "maximum" : "minimum"}.`,
            `在端点 $x = ${x0.toLatex()}$ 处根式为 $0$，$f = ${f.k}$。离开端点后根式增大，乘以 $${f.a}$ 使 $f$ ${f.a > 0 ? "增大" : "减小"}。所以 $${f.k}$ 是${f.a > 0 ? "最小值" : "最大值"}，没有${f.a > 0 ? "最大值" : "最小值"}。`,
          ),
        );
      },
    },
    {
      id: "the-y-intercept-of-a-square-root-function",
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "The graph crosses the $y$-axis where $x = 0$, so the $y$-intercept is $f(0)$, provided $0$ is in the domain. For $f(x) = 3\\sqrt{4 - x} - 7$:\n\n$$f(0) = 3\\sqrt{4} - 7 = 3 \\cdot 2 - 7 = -1,$$\n\nso the graph crosses the $y$-axis at $(0, -1)$.",
        "图象在 $x = 0$ 处与 $y$ 轴相交，所以只要 $0$ 在定义域内，$y$ 轴截距就是 $f(0)$。对于 $f(x) = 3\\sqrt{4 - x} - 7$：\n\n$$f(0) = 3\\sqrt{4} - 7 = 3 \\cdot 2 - 7 = -1,$$\n\n所以图象与 $y$ 轴交于 $(0, -1)$。",
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
          solution: t(
            `$m = f(0) = ${front(f.a)}\\sqrt{${f.c}}${plus(f.k)} = ${f.a === 1 ? s : `${f.a} \\cdot ${s}`}${plus(f.k)} = ${answer}$.`,
            `$m = f(0) = ${front(f.a)}\\sqrt{${f.c}}${plus(f.k)} = ${f.a === 1 ? s : `${f.a} \\cdot ${s}`}${plus(f.k)} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

// 6.21.5 The domain of a transformed radical function.

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
  encompasses: [
    { topic: "domain-of-a-function", weight: 0.4 },
    { topic: "the-domain-and-range-of-transformed-functions", weight: 0.3 },
    { topic: "graphing-the-cube-root-function", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "domain-of-a-square-root-function",
      title: t("Square roots", "平方根"),
      explanation: t(
        "A square root is defined only when its radicand is not negative. So the domain of $f(x) = a\\sqrt{bx + c} + k$ is the solution set of $bx + c \\ge 0$; $a$ and $k$ do not matter. Dividing by a negative $b$ reverses the inequality.\n\nFor $f(x) = 4\\sqrt{6 - 2x} + 1$: $6 - 2x \\ge 0$ gives $x \\le 3$, so the domain is $(-\\infty, 3]$.",
        "平方根只在被开方式不是负数时有定义。所以 $f(x) = a\\sqrt{bx + c} + k$ 的定义域是 $bx + c \\ge 0$ 的解集；与 $a$、$k$ 无关。除以负数 $b$ 时不等号方向改变。\n\n对于 $f(x) = 4\\sqrt{6 - 2x} + 1$：由 $6 - 2x \\ge 0$ 得 $x \\le 3$，所以定义域是 $(-\\infty, 3]$。",
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
          solution: t(
            `The radicand must not be negative:${steps(`${linear(f.b, f.c)} \\ge 0`, `x ${f.b > 0 ? "\\ge" : "\\le"} ${x0.toLatex()}`)}${f.b < 0 ? "Dividing by a negative number reversed the inequality. " : ""}The domain is ${setText(set)}.`,
            `被开方式不能是负数：${steps(`${linear(f.b, f.c)} \\ge 0`, `x ${f.b > 0 ? "\\ge" : "\\le"} ${x0.toLatex()}`)}${f.b < 0 ? "除以负数时不等号方向改变了。" : ""}定义域是 ${setText(set)}。`,
          ),
        });
      },
    },
    {
      id: "even-and-odd-roots",
      title: t("Even and odd roots", "偶次根与奇次根"),
      explanation: t(
        "Every real number has exactly one real cube root, so a cube root, and any odd root, is defined everywhere: the domain of $f(x) = a\\sqrt[3]{bx + c} + k$ is $(-\\infty, \\infty)$. An even root, such as a square root or a fourth root, needs a radicand that is not negative.\n\n$f(x) = \\sqrt[5]{2x - 9}$ has domain $(-\\infty, \\infty)$, but $g(x) = \\sqrt[4]{2x - 9}$ has domain $\\left[\\frac{9}{2}, \\infty\\right)$.",
        "每个实数都恰好有一个实数立方根，所以立方根以及任何奇次根处处有定义：$f(x) = a\\sqrt[3]{bx + c} + k$ 的定义域是 $(-\\infty, \\infty)$。偶次根（如平方根、四次根）要求被开方式不是负数。\n\n$f(x) = \\sqrt[5]{2x - 9}$ 的定义域是 $(-\\infty, \\infty)$，而 $g(x) = \\sqrt[4]{2x - 9}$ 的定义域是 $\\left[\\frac{9}{2}, \\infty\\right)$。",
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
            ? t(
                `The index $${n}$ is odd, and an odd root is defined for every real number. The domain is ${setText(set)}.`,
                `根指数 $${n}$ 是奇数，奇次根对所有实数都有定义。定义域是 ${setText(set)}。`,
              )
            : t(
                `The index $${n}$ is even, so the radicand must not be negative: $${linear(f.b, f.c)} \\ge 0$, that is, $x ${f.b > 0 ? "\\ge" : "\\le"} ${x0.toLatex()}$. The domain is ${setText(set)}.`,
                `根指数 $${n}$ 是偶数，所以被开方式不能是负数：$${linear(f.b, f.c)} \\ge 0$，即 $x ${f.b > 0 ? "\\ge" : "\\le"} ${x0.toLatex()}$。定义域是 ${setText(set)}。`,
              ),
        });
      },
    },
    {
      id: "several-conditions",
      title: t("Several conditions at once", "同时满足几个条件"),
      explanation: t(
        "When a function has several parts, $x$ must satisfy the condition of each part:\n\n- every even root needs a radicand that is not negative;\n- a denominator must not be $0$, so a square root in a denominator needs a **positive** radicand;\n- an odd root adds no condition.\n\nFor $f(x) = \\sqrt{x + 2} + \\sqrt{5 - x}$: $x \\ge -2$ and $x \\le 5$, so the domain is $[-2, 5]$. For $g(x) = \\frac{3}{\\sqrt{x - 1}}$: $x - 1 > 0$, so the domain is $(1, \\infty)$.",
        "当函数由几部分组成时，$x$ 必须满足每一部分的条件：\n\n- 每个偶次根的被开方式都不能是负数；\n- 分母不能为 $0$，所以分母中的平方根要求被开方式为**正数**；\n- 奇次根不增加条件。\n\n对于 $f(x) = \\sqrt{x + 2} + \\sqrt{5 - x}$：$x \\ge -2$ 且 $x \\le 5$，所以定义域是 $[-2, 5]$。对于 $g(x) = \\frac{3}{\\sqrt{x - 1}}$：$x - 1 > 0$，所以定义域是 $(1, \\infty)$。",
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
            solution: t(
              `Both radicands must not be negative: $${shifted(p)} \\ge 0$ gives $x \\ge ${p}$, and $${flipped(q)} \\ge 0$ gives $x \\le ${q}$. Both hold on ${setText(set)}.`,
              `两个被开方式都不能是负数：由 $${shifted(p)} \\ge 0$ 得 $x \\ge ${p}$，由 $${flipped(q)} \\ge 0$ 得 $x \\le ${q}$。两者同时成立的范围是 ${setText(set)}。`,
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
            solution: t(
              `The radicand must not be negative, and the root must not be $0$ because it is in the denominator, so $${linear(b, c)} > 0$, that is, $x ${b > 0 ? ">" : "<"} ${x0.toLatex()}$. The domain is ${setText(set)}.`,
              `被开方式不能是负数，而根式在分母中又不能为 $0$，所以 $${linear(b, c)} > 0$，即 $x ${b > 0 ? ">" : "<"} ${x0.toLatex()}$。定义域是 ${setText(set)}。`,
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
          solution: t(
            `The square root needs $${shifted(p)} \\ge 0$, that is, $x \\ge ${p}$. The cube root is defined for every $x$ and adds no condition. The domain is ${setText(set)}.`,
            `平方根要求 $${shifted(p)} \\ge 0$，即 $x \\ge ${p}$。立方根对所有 $x$ 都有定义，不增加条件。定义域是 ${setText(set)}。`,
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
  encompasses: [
    { topic: "the-domain-of-a-transformed-radical-function", weight: 0.3 },
    { topic: "properties-of-transformed-square-root-functions", weight: 0.5 },
    { topic: "range-of-a-function", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.C.7.B"],
  knowledgePoints: [
    {
      id: "range-of-a-radical-function",
      title: t("The range from the equation", "由解析式求值域"),
      explanation: t(
        "An even root takes every value from $0$ up, so $a\\sqrt{bx + c}$ takes every value from $0$ up when $a > 0$ and from $0$ down when $a < 0$. Adding $k$ moves the start to $k$:\n\n- $a > 0$: the range is $[k, \\infty)$;\n- $a < 0$: the range is $(-\\infty, k]$.\n\nThe inside, $bx + c$, does not change the range. An odd root takes every real value, so its range is $(-\\infty, \\infty)$. For $f(x) = -3\\sqrt[4]{x + 8} + 2$, the range is $(-\\infty, 2]$.",
        "偶次根取遍从 $0$ 开始的所有值，所以当 $a > 0$ 时 $a\\sqrt{bx + c}$ 取遍从 $0$ 往上的所有值，当 $a < 0$ 时取遍从 $0$ 往下的所有值。加上 $k$ 把起点移到 $k$：\n\n- $a > 0$：值域是 $[k, \\infty)$；\n- $a < 0$：值域是 $(-\\infty, k]$。\n\n内部的 $bx + c$ 不改变值域。奇次根取遍所有实数，所以值域是 $(-\\infty, \\infty)$。对于 $f(x) = -3\\sqrt[4]{x + 8} + 2$，值域是 $(-\\infty, 2]$。",
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
            ? t(
                `The index $${f.n}$ is odd, so the root takes every real value, and so does $f$. The range is ${setText(set)}.`,
                `根指数 $${f.n}$ 是奇数，所以根式取遍所有实数，$f$ 也是。值域是 ${setText(set)}。`,
              )
            : t(
                `The root takes every value $\\ge 0$. Multiplying by $${f.a}$ gives every value ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"}, and adding $${f.k}$ gives every value ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$. The range is ${setText(set)}.`,
                `根式取遍所有 $\\ge 0$ 的值。乘以 $${f.a}$ 后取遍所有 ${f.a > 0 ? "$\\ge 0$" : "$\\le 0$"} 的值，再加上 $${f.k}$ 后取遍所有 ${f.a > 0 ? "$\\ge" : "$\\le"} ${f.k}$ 的值。值域是 ${setText(set)}。`,
              ),
        });
      },
    },
    {
      id: "range-on-a-restricted-domain",
      title: t("On a restricted domain", "限制定义域时的值域"),
      explanation: t(
        "A transformed square-root function is either increasing or decreasing, so on an interval $[p, q]$ its least and greatest values are at the ends. Evaluate $f$ at both ends; the range runs from the smaller value to the larger.\n\nFor $f(x) = -2\\sqrt{x - 1} + 3$ on $[2, 10]$: $f(2) = -2 \\cdot 1 + 3 = 1$ and $f(10) = -2 \\cdot 3 + 3 = -3$, so the range is $[-3, 1]$.",
        "变换后的平方根函数要么递增要么递减，所以在区间 $[p, q]$ 上它的最小值和最大值在两端取得。计算 $f$ 在两端的值；值域从较小的值到较大的值。\n\n对于 $f(x) = -2\\sqrt{x - 1} + 3$ 在 $[2, 10]$ 上：$f(2) = -2 \\cdot 1 + 3 = 1$，$f(10) = -2 \\cdot 3 + 3 = -3$，所以值域是 $[-3, 1]$。",
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
          solution: t(
            `$f$ is ${a > 0 ? "increasing" : "decreasing"}, so its extreme values are at the ends:${steps(`f(${lo}) = ${front(a)}\\sqrt{${p * p}}${plus(k)} = ${vLo}`, `f(${hi}) = ${front(a)}\\sqrt{${q * q}}${plus(k)} = ${vHi}`)}The range is ${setText(set)}.`,
            `$f$ ${a > 0 ? "递增" : "递减"}，所以最值在两端取得：${steps(`f(${lo}) = ${front(a)}\\sqrt{${p * p}}${plus(k)} = ${vLo}`, `f(${hi}) = ${front(a)}\\sqrt{${q * q}}${plus(k)} = ${vHi}`)}值域是 ${setText(set)}。`,
          ),
        });
      },
    },
    {
      id: "range-from-a-graph",
      title: t("The range from a graph", "从图象读出值域"),
      explanation: t(
        "On the graph, the range is the set of heights the graph reaches. A transformed square-root graph starts at its endpoint $(h, k)$ and then rises or falls forever, so its range is $[k, \\infty)$ when it goes up from the endpoint and $(-\\infty, k]$ when it goes down. Whether it extends to the left or to the right does not matter.",
        "在图象上，值域是图象所能到达的所有高度。变换后的平方根函数图象从端点 $(h, k)$ 出发，然后一直上升或一直下降，所以从端点向上时值域是 $[k, \\infty)$，向下时是 $(-\\infty, k]$。向左还是向右延伸都没有关系。",
      ),
      generate(rng) {
        const g = randomSqrtGraph(rng);
        const set = ray(g.a > 0, g.k);
        return {
          ...intervalProblem({
            prompt: t(
              `The graph of a transformation of $y = \\sqrt{x}$ is shown. Find its range. ${asInterval.en}`,
              `图中是 $y = \\sqrt{x}$ 经过变换后的图象。求它的值域。${asInterval["zh-CN"]}`,
            ),
            set,
            form: "interval",
            wrong: [ray(g.s > 0, g.h), ray(g.a < 0, g.k), ray(g.a > 0, g.h), ray(g.a > 0, g.k, false)],
            solution: t(
              `The graph starts at $${pt(g.h, g.k)}$ and goes ${g.a > 0 ? "up" : "down"} without end, so it reaches every height ${g.a > 0 ? "$\\ge" : "$\\le"} ${g.k}$. The range is ${setText(set)}.`,
              `图象从 $${pt(g.h, g.k)}$ 出发，一直向${g.a > 0 ? "上" : "下"}延伸，所以能到达所有 ${g.a > 0 ? "$\\ge" : "$\\le"} ${g.k}$ 的高度。值域是 ${setText(set)}。`,
            ),
          }),
          figure: sqrtFigure(g),
        };
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
    { topic: "solving-advanced-radical-equations", weight: 0.3 },
    { topic: "solving-radical-equations", weight: 0.4 },
    { topic: "roots-of-a-function", weight: 0.3 },
    { topic: "the-range-of-a-transformed-radical-function", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.A.2", "CCSS.HSF.IF.C.7.B"],
  knowledgePoints: [
    {
      id: "roots-of-square-root-functions",
      title: t("Square-root functions", "平方根函数"),
      explanation: t(
        "A root of $f$ is a solution of $f(x) = 0$. For $f(x) = a\\sqrt{bx + c} + k$, isolate the root: $\\sqrt{bx + c} = -\\frac{k}{a}$. If $-\\frac{k}{a} < 0$ there is no root, since a square root is never negative; the range of $f$ does not contain $0$. Otherwise square and solve.\n\nFor $f(x) = 2\\sqrt{x + 3} - 6$: $\\sqrt{x + 3} = 3$, so $x + 3 = 9$ and $x = 6$. But $f(x) = 2\\sqrt{x + 3} + 6$ has no root.",
        "$f$ 的零点是 $f(x) = 0$ 的解。对于 $f(x) = a\\sqrt{bx + c} + k$，先分离根式：$\\sqrt{bx + c} = -\\frac{k}{a}$。若 $-\\frac{k}{a} < 0$，则没有零点，因为平方根不可能是负数；$f$ 的值域不包含 $0$。否则两边平方并求解。\n\n对于 $f(x) = 2\\sqrt{x + 3} - 6$：$\\sqrt{x + 3} = 3$，所以 $x + 3 = 9$，$x = 6$。而 $f(x) = 2\\sqrt{x + 3} + 6$ 没有零点。",
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
          solution: exists
            ? t(
                `Set $f(x) = 0$ and isolate the root, then square and solve:${steps(isolated, `${linear(b, c)} = ${s * s}`, `x = ${x0.toLatex()}`)}`,
                `令 $f(x) = 0$ 并分离根式，再两边平方求解：${steps(isolated, `${linear(b, c)} = ${s * s}`, `x = ${x0.toLatex()}`)}`,
              )
            : t(
                `Set $f(x) = 0$ and isolate the root:${steps(isolated)}A square root is never negative, so $f$ has no roots.`,
                `令 $f(x) = 0$ 并分离根式：${steps(isolated)}平方根不可能是负数，所以 $f$ 没有零点。`,
              ),
        });
      },
    },
    {
      id: "roots-of-cube-root-functions",
      title: t("Cube-root functions", "立方根函数"),
      explanation: t(
        "A cube-root function $f(x) = a\\sqrt[3]{bx + c} + k$ always has exactly one root, because a cube root can take any value, negative ones included. Isolate the root and cube:\n\n$$-2\\sqrt[3]{x - 1} - 4 = 0 \\;\\Rightarrow\\; \\sqrt[3]{x - 1} = -2 \\;\\Rightarrow\\; x - 1 = -8 \\;\\Rightarrow\\; x = -7$$",
        "立方根函数 $f(x) = a\\sqrt[3]{bx + c} + k$ 总是恰好有一个零点，因为立方根可以取任何值，包括负数。分离根式再两边立方：\n\n$$-2\\sqrt[3]{x - 1} - 4 = 0 \\;\\Rightarrow\\; \\sqrt[3]{x - 1} = -2 \\;\\Rightarrow\\; x - 1 = -8 \\;\\Rightarrow\\; x = -7$$",
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
          solution: t(
            `Set $f(x) = 0$, isolate the cube root, cube and solve:${steps(`\\sqrt[3]{${linear(b, c)}} = ${s}`, `${linear(b, c)} = ${s ** 3}`, `x = ${x0.toLatex()}`)}`,
            `令 $f(x) = 0$，分离立方根，两边立方并求解：${steps(`\\sqrt[3]{${linear(b, c)}} = ${s}`, `${linear(b, c)} = ${s ** 3}`, `x = ${x0.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "how-many-roots",
      title: t("How many roots", "零点的个数"),
      explanation: t(
        "Without solving, the range tells how many roots a radical function has:\n\n- $a\\sqrt{bx + c} + k$ has range $[k, \\infty)$ for $a > 0$ and $(-\\infty, k]$ for $a < 0$. It has one root when $0$ is in the range, that is, when $k = 0$ or $k$ and $a$ have opposite signs, and no root otherwise;\n- $a\\sqrt[3]{bx + c} + k$ has range $(-\\infty, \\infty)$ and exactly one root.\n\n$f(x) = -\\sqrt{x + 5} - 2$ has range $(-\\infty, -2]$, so it has no root.",
        "不用求解，由值域就能知道根式函数有几个零点：\n\n- $a\\sqrt{bx + c} + k$ 在 $a > 0$ 时值域是 $[k, \\infty)$，在 $a < 0$ 时是 $(-\\infty, k]$。当 $0$ 在值域内，即 $k = 0$ 或 $k$ 与 $a$ 异号时，它有一个零点，否则没有；\n- $a\\sqrt[3]{bx + c} + k$ 的值域是 $(-\\infty, \\infty)$，恰好有一个零点。\n\n$f(x) = -\\sqrt{x + 5} - 2$ 的值域是 $(-\\infty, -2]$，所以没有零点。",
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
          solution: odd
            ? t(
                `A cube root takes every real value, so the range of $f$ is ${setText(realLine)}. It contains $0$ exactly once, since $f$ is ${f.a * f.b > 0 ? "increasing" : "decreasing"}: $f$ has $1$ root.`,
                `立方根取遍所有实数，所以 $f$ 的值域是 ${setText(realLine)}。由于 $f$ ${f.a * f.b > 0 ? "递增" : "递减"}，它恰好取到 $0$ 一次：$f$ 有 $1$ 个零点。`,
              )
            : t(
                `The range of $f$ is ${setText(rangeOf(f))}, which ${count ? "contains" : "does not contain"} $0$. So $f$ has $${count}$ root${count ? "" : "s"}.`,
                `$f$ 的值域是 ${setText(rangeOf(f))}，${count ? "包含" : "不包含"} $0$。所以 $f$ 有 $${count}$ 个零点。`,
              ),
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
  knowledgePoints: [
    {
      id: "inverses-of-square-root-functions-with-an-inner-coefficient",
      title: t("Inverses of square-root functions", "平方根函数的反函数"),
      explanation: t(
        "Swap $x$ and $y$, isolate the root, square, and solve for $y$. For $f(x) = 3\\sqrt{2x - 1} + 4$:\n\n$$x = 3\\sqrt{2y - 1} + 4, \\quad \\frac{x - 4}{3} = \\sqrt{2y - 1}, \\quad \\frac{(x - 4)^{2}}{9} = 2y - 1,$$\n\n$$f^{-1}(x) = \\frac{(x - 4)^{2} + 9}{18}.$$\n\nSquare the coefficient $3$ together with $x - 4$: the $9$ is easy to forget.",
        "交换 $x$ 与 $y$，分离根式，两边平方，再解出 $y$。对于 $f(x) = 3\\sqrt{2x - 1} + 4$：\n\n$$x = 3\\sqrt{2y - 1} + 4, \\quad \\frac{x - 4}{3} = \\sqrt{2y - 1}, \\quad \\frac{(x - 4)^{2}}{9} = 2y - 1,$$\n\n$$f^{-1}(x) = \\frac{(x - 4)^{2} + 9}{18}.$$\n\n系数 $3$ 要和 $x - 4$ 一起平方：这个 $9$ 很容易忘记。",
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
          solution: t(
            `Swap $x$ and $y$, isolate the root and square:${steps(`x = ${rootFn(a, linear(b, c, "y"), k)}`, `${isolated} = \\sqrt{${linear(b, c, "y")}}`, `${square} = ${linear(b, c, "y")}`)}Solve for $y$: $f^{-1}(x) = ${answer}$.`,
            `交换 $x$ 与 $y$，分离根式再平方：${steps(`x = ${rootFn(a, linear(b, c, "y"), k)}`, `${isolated} = \\sqrt{${linear(b, c, "y")}}`, `${square} = ${linear(b, c, "y")}`)}解出 $y$：$f^{-1}(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "the-domain-of-the-inverse",
      title: t("The domain and range of the inverse", "反函数的定义域与值域"),
      explanation: t(
        "The inverse swaps inputs and outputs, so the domain of $f^{-1}$ is the range of $f$ and the range of $f^{-1}$ is the domain of $f$. The formula of the inverse of a square-root function is a parabola, but $f^{-1}$ is only part of it.\n\nFor $f(x) = -\\sqrt{x + 2} + 5$: the range of $f$ is $(-\\infty, 5]$ and its domain is $[-2, \\infty)$, so $f^{-1}$ has domain $(-\\infty, 5]$ and range $[-2, \\infty)$.",
        "反函数把输入和输出对调，所以 $f^{-1}$ 的定义域是 $f$ 的值域，$f^{-1}$ 的值域是 $f$ 的定义域。平方根函数的反函数的解析式是一条抛物线，但 $f^{-1}$ 只是其中一部分。\n\n对于 $f(x) = -\\sqrt{x + 2} + 5$：$f$ 的值域是 $(-\\infty, 5]$，定义域是 $[-2, \\infty)$，所以 $f^{-1}$ 的定义域是 $(-\\infty, 5]$，值域是 $[-2, \\infty)$。",
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
            ? t(
                `The domain of $f^{-1}$ is the range of $f$. The root takes every value $\\ge 0$; multiplying by $${f.a}$ and adding $${f.k}$ gives the range ${setText(ran)}.`,
                `$f^{-1}$ 的定义域是 $f$ 的值域。根式取遍所有 $\\ge 0$ 的值；乘以 $${f.a}$ 再加上 $${f.k}$，得值域 ${setText(ran)}。`,
              )
            : t(
                `The range of $f^{-1}$ is the domain of $f$: $${linear(f.b, f.c)} \\ge 0$ gives $x ${f.b > 0 ? "\\ge" : "\\le"} ${endX(f).toLatex()}$, that is, ${setText(dom)}.`,
                `$f^{-1}$ 的值域是 $f$ 的定义域：由 $${linear(f.b, f.c)} \\ge 0$ 得 $x ${f.b > 0 ? "\\ge" : "\\le"} ${endX(f).toLatex()}$，即 ${setText(dom)}。`,
              ),
        });
      },
    },
    {
      id: "inverses-of-cube-root-functions",
      title: t("Inverses of cube-root functions", "立方根函数的反函数"),
      explanation: t(
        "Undo a cube root by cubing. For $f(x) = 2\\sqrt[3]{x + 1} - 3$, swap and solve:\n\n$$x = 2\\sqrt[3]{y + 1} - 3, \\quad \\frac{x + 3}{2} = \\sqrt[3]{y + 1}, \\quad \\frac{(x + 3)^{3}}{8} = y + 1,$$\n\nso $f^{-1}(x) = \\frac{(x + 3)^{3}}{8} - 1$. The domain and range of a cube-root function are all real numbers, so its inverse needs no restriction.",
        "用立方撤销立方根。对于 $f(x) = 2\\sqrt[3]{x + 1} - 3$，交换并求解：\n\n$$x = 2\\sqrt[3]{y + 1} - 3, \\quad \\frac{x + 3}{2} = \\sqrt[3]{y + 1}, \\quad \\frac{(x + 3)^{3}}{8} = y + 1,$$\n\n所以 $f^{-1}(x) = \\frac{(x + 3)^{3}}{8} - 1$。立方根函数的定义域和值域都是全体实数，所以它的反函数不需要限制。",
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
          solution: t(
            `Swap $x$ and $y$, isolate the cube root and cube:${steps(`x = ${rootFn(a, linear(1, -h, "y"), k, 3)}`, `${isolated} = \\sqrt[3]{${linear(1, -h, "y")}}`, `${quotientLatex(squared(k, 3), a3, true)} = ${linear(1, -h, "y")}`)}So $f^{-1}(x) = ${answer}$.`,
            `交换 $x$ 与 $y$，分离立方根再立方：${steps(`x = ${rootFn(a, linear(1, -h, "y"), k, 3)}`, `${isolated} = \\sqrt[3]{${linear(1, -h, "y")}}`, `${quotientLatex(squared(k, 3), a3, true)} = ${linear(1, -h, "y")}`)}所以 $f^{-1}(x) = ${answer}$。`,
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
  encompasses: [
    { topic: "solving-advanced-radical-equations", weight: 0.5 },
    { topic: "finding-intersections-of-lines-and-quadratic-functions", weight: 0.3 },
    { topic: "roots-of-transformed-radical-functions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.REI.D.11", "CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "horizontal-lines",
      title: t("Horizontal lines", "水平直线"),
      explanation: t(
        "The graph of $y = a\\sqrt{x - h} + k$ meets the horizontal line $y = m$ where $a\\sqrt{x - h} + k = m$. Solve for $x$; the point is $(x, m)$.\n\nFor $y = 2\\sqrt{x + 1} - 3$ and $y = 5$: $2\\sqrt{x + 1} = 8$, $\\sqrt{x + 1} = 4$, $x = 15$. They meet at $(15, 5)$.",
        "$y = a\\sqrt{x - h} + k$ 的图象与水平直线 $y = m$ 相交于 $a\\sqrt{x - h} + k = m$ 处。解出 $x$，交点就是 $(x, m)$。\n\n对于 $y = 2\\sqrt{x + 1} - 3$ 和 $y = 5$：$2\\sqrt{x + 1} = 8$，$\\sqrt{x + 1} = 4$，$x = 15$。它们交于 $(15, 5)$。",
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
          solution: t(
            `Set the two equal and solve:${steps(`${curve} = ${m}`, `${a === 1 ? "" : `${front(a)}`}\\sqrt{${inner}} = ${m - k}`, ...(a === 1 ? [] : [`\\sqrt{${inner}} = ${r}`]), `${inner} = ${r * r}`, `x = ${x}`)}The point is $${pt(x, m)}$.`,
            `令两式相等并求解：${steps(`${curve} = ${m}`, `${a === 1 ? "" : `${front(a)}`}\\sqrt{${inner}} = ${m - k}`, ...(a === 1 ? [] : [`\\sqrt{${inner}} = ${r}`]), `${inner} = ${r * r}`, `x = ${x}`)}交点是 $${pt(x, m)}$。`,
          ),
        });
      },
    },
    {
      id: "slanted-lines",
      title: t("Slanted lines", "斜直线"),
      explanation: t(
        "To intersect $y = \\sqrt{ax + b}$ with the line $y = mx + c$, solve $\\sqrt{ax + b} = mx + c$: square, solve the quadratic, and reject the roots where $mx + c < 0$. They are extraneous: there the line is below the $x$-axis, while the graph of the root never is. Each remaining root $x$ gives the point $(x, mx + c)$.\n\nFor $y = \\sqrt{x + 7}$ and $y = x + 1$: the roots are $2$ and $-3$, and only $x = 2$ gives $x + 1 \\ge 0$. The point is $(2, 3)$.",
        "要求 $y = \\sqrt{ax + b}$ 与直线 $y = mx + c$ 的交点，就解 $\\sqrt{ax + b} = mx + c$：两边平方，解二次方程，舍去使 $mx + c < 0$ 的根。它们是增根：在那里直线位于 $x$ 轴下方，而根式的图象永远不会。剩下的每个根 $x$ 给出交点 $(x, mx + c)$。\n\n对于 $y = \\sqrt{x + 7}$ 和 $y = x + 1$：两个根是 $2$ 和 $-3$，只有 $x = 2$ 使 $x + 1 \\ge 0$。交点是 $(2, 3)$。",
      ),
      generate(rng) {
        const g = randomRootLine(rng, (count) => count === 1);
        const [x] = validRoots(g);
        const bad = x === g.r1 ? g.r2 : g.r1;
        const y = g.m * x! + g.c;
        const line = linear(g.m, g.c);
        const work = rootLineWork(g);
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
          solution: t(
            `Solve $${rootLineLeft(g)} = ${line}$. ${work.en} At $x = ${x}$, $y = ${y}$, so the point is $${pt(x!, y)}$.`,
            `解 $${rootLineLeft(g)} = ${line}$。${work["zh-CN"]}当 $x = ${x}$ 时 $y = ${y}$，所以交点是 $${pt(x!, y)}$。`,
          ),
        });
      },
    },
    {
      id: "counting-intersections",
      title: t("Counting intersections", "数交点的个数"),
      explanation: t(
        "A line can meet the graph of $y = \\sqrt{ax + b}$ in $0$, $1$ or $2$ points. Squaring $\\sqrt{ax + b} = mx + c$ gives a quadratic with at most two roots, but only the roots with $mx + c \\ge 0$ give intersection points. So count the roots that pass the check, not all the roots of the quadratic.",
        "直线与 $y = \\sqrt{ax + b}$ 的图象可能有 $0$、$1$ 或 $2$ 个交点。把 $\\sqrt{ax + b} = mx + c$ 平方得到的二次方程最多有两个根，但只有满足 $mx + c \\ge 0$ 的根才给出交点。所以要数通过检验的根，而不是二次方程的所有根。",
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
          solution: t(
            `Solve $${rootLineLeft(g)} = ${line}$. ${rootLineWork(g).en} So there ${target === 1 ? "is $1$ point" : `are $${target}$ points`} in common.`,
            `解 $${rootLineLeft(g)} = ${line}$。${rootLineWork(g)["zh-CN"]}所以有 $${target}$ 个公共点。`,
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
