import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Compass,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  union,
} from "@ga/subject-math";

import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";

// Algebra II 2.8: graphs of polynomials.

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** front writes a coefficient in front of a factor: "", "-", "2", "\frac{1}{2}". */
function front(a: Q): string {
  if (a.eq(Q.one)) return "";
  if (a.eq(Q.of(-1))) return "-";
  return a.toLatex();
}

/** plus writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
const plus = (k: number) => (k === 0 ? "" : k < 0 ? ` - ${-k}` : ` + ${k}`);

/** minus writes a number for a figure label, with a true minus sign. */
const minus = (n: number) => String(n).replace("-", "−");

/** Factor is a root of a polynomial with its multiplicity. */
type Factor = readonly [root: number, mult: number];

/** factorLatex writes (x − r)^m: "x", "(x + 2)^{2}", "x^{3}". */
function factorLatex([r, m]: Factor): string {
  const base = r === 0 ? "x" : `(${linear(1, -r)})`;
  return m === 1 ? base : `${base}^{${m}}`;
}

/** polyLatex writes a(x − r₁)^m₁(x − r₂)^m₂…, with a factor x first. */
const polyLatex = (a: Q, fs: readonly Factor[]) =>
  `${front(a)}${[...fs.filter(([r]) => r === 0), ...fs.filter(([r]) => r !== 0)].map(factorLatex).join("")}`;

/** prodAt is the product of the factors (x − r)^m at x. */
const prodAt = (fs: readonly Factor[], x: number) => fs.reduce((acc, [r, m]) => acc * (x - r) ** m, 1);

/** valueAt is a·∏(x − r)^m at an integer x, exactly. */
const valueAt = (a: Q, fs: readonly Factor[], x: number): Q => a.mul(Q.of(prodAt(fs, x)));

/** rootsOf lists the distinct roots in increasing order. */
const rootsOf = (fs: readonly Factor[]) => [...new Set(fs.map(([r]) => r))].sort((p, q) => p - q);

/** simple turns every multiplicity into 1, as a learner who ignores multiplicities would. */
const simple = (fs: readonly Factor[]): Factor[] => fs.map(([r]) => [r, 1]);

/** SignOp is the relation of a polynomial inequality f(x) op 0. */
type SignOp = ">" | "<" | ">=" | "<=";

const opLatex: Record<SignOp, string> = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
const strict: Record<SignOp, SignOp> = { ">": ">", "<": "<", ">=": ">", "<=": "<" };
const opposite: Record<SignOp, SignOp> = { ">": "<", "<": ">", ">=": "<=", "<=": ">=" };

/** signSet is the set where s·∏(x − r)^m op 0, read from the signs between the roots. */
function signSet(s: number, fs: readonly Factor[], op: SignOp): RealSet {
  const roots = rootsOf(fs);
  const parts: Interval[] = [];
  const positive = op === ">" || op === ">=";
  for (let i = 0; i <= roots.length; i++) {
    const lo = roots[i - 1];
    const hi = roots[i];
    const x = lo === undefined ? hi! - 1 : hi === undefined ? lo + 1 : (lo + hi) / 2;
    const sign = s * Math.sign(prodAt(fs, x));
    if (positive ? sign > 0 : sign < 0)
      parts.push({
        ...(lo !== undefined && { lo: Q.of(lo) }),
        ...(hi !== undefined && { hi: Q.of(hi) }),
        loClosed: false,
        hiClosed: false,
      });
  }
  if (op === ">=" || op === "<=") for (const r of roots) parts.push({ lo: Q.of(r), hi: Q.of(r), loClosed: true, hiClosed: true });
  return union(...parts);
}

/** signTable writes the sign of f on each interval between the roots: "(-\infty, -2): -, …". */
function signTable(s: number, fs: readonly Factor[]): string {
  const roots = rootsOf(fs);
  const cells: string[] = [];
  for (let i = 0; i <= roots.length; i++) {
    const lo = roots[i - 1];
    const hi = roots[i];
    const x = lo === undefined ? hi! - 1 : hi === undefined ? lo + 1 : (lo + hi) / 2;
    const sign = s * Math.sign(prodAt(fs, x));
    cells.push(`${lo === undefined ? "(-\\infty" : `(${lo}`}, ${hi === undefined ? "\\infty)" : `${hi})`}: ${sign > 0 ? "+" : "-"}`);
  }
  return cells.join(", \\quad ");
}

/** inequalityPrompt asks where f(x) op 0, in interval notation. */
const inequalityPrompt = (f: string, op: SignOp): Text =>
  t(
    `Let $f(x) = ${f}$. For which values of $x$ is $f(x) ${opLatex[op]} 0$? Answer in interval notation.`,
    `设 $f(x) = ${f}$。$x$ 取哪些值时 $f(x) ${opLatex[op]} 0$？用区间表示。`,
  );

// Figures.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -8, yMax: 8, labelEvery: 2 };

/** Drawn is a polynomial a·∏(x − r)^m that fits the view, with a marked point of integer coordinates on its graph. */
interface Drawn {
  readonly a: Q;
  readonly fs: readonly Factor[];
  readonly mark: readonly [number, number];
}

const scales: readonly Q[] = [Q.of(1, 4), Q.of(1, 3), Q.of(1, 2), Q.one, Q.of(2)];

/** fitsView tells whether every bump between roots shows in the view and both ends leave it clearly. */
function fitsView(a: Q, fs: readonly Factor[]): boolean {
  const k = a.toNumber();
  const roots = rootsOf(fs);
  if (roots[0]! < -5 || roots[roots.length - 1]! > 5) return false;
  for (let i = 0; i + 1 < roots.length; i++) {
    const [lo, hi] = [roots[i]!, roots[i + 1]!];
    let peak = 0;
    for (let j = 0; j <= 100; j++) peak = Math.max(peak, Math.abs(k * prodAt(fs, lo + ((hi - lo) * j) / 100)));
    if (peak > 7.5 || peak < 1) return false;
  }
  return Math.abs(k * prodAt(fs, -6)) >= 4 && Math.abs(k * prodAt(fs, 6)) >= 4;
}

/** drawPolynomial draws roots and a scale until the graph fits the view and has a point to mark, the y-intercept when possible. */
function drawPolynomial(rng: Rng, roots: () => Factor[]): Drawn {
  for (;;) {
    const fs = roots().sort((p, q) => p[0] - q[0]);
    const a = rng.pick(scales).mul(Q.of(rng.sign()));
    if (!fitsView(a, fs)) continue;
    const xs = range(-5, 5).filter((x) => {
      if (fs.some(([r]) => r === x)) return false;
      const y = valueAt(a, fs, x);
      const v = y.toNumber();
      return (
        y.isInteger() &&
        Math.abs(v) >= 1 &&
        Math.abs(v) <= 7 &&
        labelDir((u) => a.toNumber() * prodAt(fs, u), x, v, pointLabel(x, v)) !== undefined
      );
    });
    if (xs.length === 0) continue;
    const x0 = xs.includes(0) ? 0 : rng.pick(xs);
    return { a, fs, mark: [x0, valueAt(a, fs, x0).toNumber()] };
  }
}

/** rootWords describes where a graph meets the x-axis, in plain text for alt text or in Markdown with TeX for solutions. */
function rootWords(fs: readonly Factor[], tex = false): { en: string; zh: string } {
  const x = tex ? "$x$" : "x";
  const at = (m: (n: number) => boolean) => fs.filter(([, n]) => m(n)).map(([r]) => (tex ? `$${r}$` : `x = ${minus(r)}`));
  const cross = at((n) => n === 1);
  const flat = at((n) => n % 2 === 1 && n > 1);
  const touch = at((n) => n % 2 === 0);
  const en = [
    cross.length > 0 ? `crosses the ${x}-axis at ${cross.join(", ")}` : "",
    flat.length > 0 ? `flattens out as it crosses the ${x}-axis at ${flat.join(", ")}` : "",
    touch.length > 0 ? `touches the ${x}-axis and turns back at ${touch.join(", ")}` : "",
  ].filter((s) => s !== "");
  const zh = [
    cross.length > 0 ? `在 ${cross.join("、")} 处穿过 ${x} 轴` : "",
    flat.length > 0 ? `在 ${flat.join("、")} 处变平并穿过 ${x} 轴` : "",
    touch.length > 0 ? `在 ${touch.join("、")} 处与 ${x} 轴相切后折回` : "",
  ].filter((s) => s !== "");
  return { en: en.join(", and "), zh: zh.join("，") };
}

const compass: Record<Compass, readonly [number, number]> = {
  ne: [0.71, -0.71],
  nw: [-0.71, -0.71],
  se: [0.71, 0.71],
  sw: [-0.71, 0.71],
  e: [1, 0],
  w: [-1, 0],
  n: [0, -1],
  s: [0, 1],
};

/** labelDir places the label of a point on a curve where it clears the curve, the axis numbers and the edges of the view, using the label geometry of plane. */
function labelDir(f: (x: number) => number, x0: number, y0: number, label: string): Compass | undefined {
  const unit = Math.min(260 / (view.xMax - view.xMin), 260 / (view.yMax - view.yMin));
  const box = (dir: Compass) => {
    const [ux, uy] = compass[dir];
    const d = 9 + Math.abs(ux) * 3.2 * label.length;
    const cx = x0 + (ux * d) / unit;
    const base = y0 - (uy * d + 4) / unit;
    const half = (3.4 * label.length) / unit;
    return { x1: cx - half, x2: cx + half, y1: base - 3 / unit, y2: base + 10 / unit };
  };
  const overlaps = (b: ReturnType<typeof box>, x1: number, x2: number, y1: number, y2: number) =>
    b.x1 < x2 && b.x2 > x1 && b.y1 < y2 && b.y2 > y1;
  const clearOfCurve = (b: ReturnType<typeof box>) => {
    for (let i = 0; i <= 200; i++) {
      const y = f(b.x1 - 0.15 + ((b.x2 - b.x1 + 0.3) * i) / 200);
      if (y > b.y1 - 0.2 && y < b.y2 + 0.2) return false;
    }
    return true;
  };
  const inside = (b: ReturnType<typeof box>) => b.x1 > view.xMin && b.x2 < view.xMax + 0.3 && b.y1 > view.yMin && b.y2 < view.yMax;
  const clearOfNumbers = (b: ReturnType<typeof box>) =>
    !overlaps(b, -1.4, 0.05, view.yMin, view.yMax) && !overlaps(b, view.xMin, view.xMax, -1, 0.05);
  const order: Compass[] = ["ne", "nw", "se", "sw", "e", "w", "n", "s"];
  return order.find((d) => inside(box(d)) && clearOfCurve(box(d)) && clearOfNumbers(box(d)));
}

/** pointLabel writes the label of a marked point. */
const pointLabel = (x: number, y: number) => `(${minus(x)}, ${minus(y)})`;

/** drawnFigure draws the graph of a drawn polynomial with its marked point. */
function drawnFigure(d: Drawn): Figure {
  const k = d.a.toNumber();
  const [x0, y0] = d.mark;
  const label = pointLabel(x0, y0);
  const dir = labelDir((x) => k * prodAt(d.fs, x), x0, y0, label) ?? "ne";
  const words = rootWords(d.fs);
  return {
    svg: plane(view, [
      { kind: "curve", f: (x) => k * prodAt(d.fs, x), accent: true },
      { kind: "point", at: [x0, y0], label, dir },
    ]),
    alt: t(
      `The graph of a polynomial function. It ${words.en}. The marked point is (${x0}, ${y0}).`,
      `一个多项式函数的图象。它${words.zh}。标出的点是 (${x0}, ${y0})。`,
    ),
  };
}

/** substitution writes the step y₀ = a·∏(x₀ − r)^m = c·a and the value of a. */
function substitution(d: Drawn): string {
  const [x0, y0] = d.mark;
  const p = prodAt(d.fs, x0);
  const factors = d.fs.map(([r, m]) => {
    const v = x0 - r;
    return m === 1 ? paren(v) : `${paren(v)}^{${m}}`;
  });
  return steps(`${y0} = a \\cdot ${factors.join(" \\cdot ")} = ${poly([p, "a"])}`, `a = ${num(d.a)}`);
}

/** equationWrongs are the equations that a forgotten scale, a sign slip or a wrong multiplicity give. */
const equationWrongs = (d: Drawn, extra: readonly string[] = []) => [
  polyLatex(Q.one, d.fs),
  polyLatex(d.a.neg(), d.fs),
  polyLatex(
    d.a,
    d.fs.map(([r, m]): Factor => [-r, m]),
  ),
  ...extra,
];

// ─── 2.8.1 Graphing elementary cubic functions ──────────────────────────────

/** cubicLatex writes a(x − h)³ + k: "2(x - 1)^{3} + 3", "-x^{3}". */
const cubicLatex = (a: Q, h: number, k: number) => `${front(a)}${factorLatex([h, 3])}${plus(k)}`;

const cubicAs: readonly Q[] = [Q.one, Q.of(2), Q.of(1, 2), Q.of(3), Q.of(1, 3)].flatMap((a) => [a, a.neg()]);

/** cubicFigure draws y = a(x − h)³ + k with its center marked. */
function cubicFigure(a: Q, h: number, k: number, extra: readonly PlaneMark[] = []): Figure {
  const n = a.toNumber();
  const rising = n > 0;
  return {
    svg: plane(view, [{ kind: "curve", f: (x) => n * (x - h) ** 3 + k, accent: true }, { kind: "point", at: [h, k] }, ...extra]),
    alt: t(
      `An S-shaped cubic curve that ${rising ? "rises" : "falls"} from left to right, with its center at the marked point (${h}, ${k}).`,
      `一条 S 形的三次曲线，从左到右${rising ? "上升" : "下降"}，对称中心是标出的点 (${h}, ${k})。`,
    ),
  };
}

/** graphingElementaryCubicFunctions graphs y = a(x − h)³ + k. */
export const graphingElementaryCubicFunctions: TopicDef = {
  id: "graphing-elementary-cubic-functions",
  title: t("Graphing Elementary Cubic Functions", "画简单三次函数的图象"),
  summary: t(
    "Graph $y = x^{3}$ and its transformations $y = a(x - h)^{3} + k$, and read the center and direction of the curve.",
    "画出 $y = x^{3}$ 及其变换 $y = a(x - h)^{3} + k$ 的图象，读出曲线的对称中心和走向。",
  ),
  prerequisites: ["combining-graph-transformations-two-operations"],
  encompasses: [
    { topic: "combining-graph-transformations-two-operations", weight: 0.3 },
    { topic: "graphing-elementary-quadratic-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.C", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "values-of-cubic-functions",
      title: t("The graph of $y = x^{3}$", "$y = x^{3}$ 的图象"),
      explanation: t(
        "The simplest **cubic function** is $y = x^{3}$. A table of values:\n\n$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & -8 & -1 & 0 & 1 & 8 \\end{array}$$\n\nUnlike a square, the cube of a negative number is negative: $(-2)^{3} = -8$. So the graph comes up from the bottom left, flattens out as it passes through $(0, 0)$, and rises to the top right. Since $(-x)^{3} = -x^{3}$, it is symmetric about the origin, which we call its **center**.\n\nFor $y = ax^{3}$, cube $x$ first, then multiply by $a$: for $y = -2x^{3}$ and $x = -3$, $y = -2 \\cdot (-27) = 54$. A negative $a$ reflects the curve in the $x$-axis, so it falls from left to right.",
        "最简单的**三次函数**是 $y = x^{3}$。函数值表：\n\n$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & -8 & -1 & 0 & 1 & 8 \\end{array}$$\n\n与平方不同，负数的立方是负数：$(-2)^{3} = -8$。所以图象从左下方上来，经过 $(0, 0)$ 时变平，再升向右上方。因为 $(-x)^{3} = -x^{3}$，图象关于原点对称，原点叫做它的**对称中心**。\n\n对 $y = ax^{3}$，先把 $x$ 立方，再乘以 $a$：对 $y = -2x^{3}$ 和 $x = -3$，$y = -2 \\cdot (-27) = 54$。负的 $a$ 把曲线关于 $x$ 轴翻折，于是它从左到右下降。",
      ),
      figure: cubicFigure(Q.one, 0, 0, [
        { kind: "point", at: [-2, -8] },
        { kind: "point", at: [-1, -1] },
        { kind: "point", at: [1, 1] },
        { kind: "point", at: [2, 8] },
      ]),
      generate(rng) {
        for (;;) {
          const a = rng.pick([...cubicAs, Q.of(4), Q.of(-4)]);
          const x = rng.nonZero(-5, 5);
          const y = a.mul(Q.of(x ** 3));
          if (!y.isInteger() || (x > 0 && rng.bool(0.6))) continue;
          const aDot = a.eq(Q.one) ? "" : a.eq(Q.of(-1)) ? "-" : `${num(a)} \\cdot `;
          const mid = a.eq(Q.one) ? "" : ` = ${aDot}${paren(x ** 3)}`;
          return numberProblem({
            prompt: t(`Let $f(x) = ${front(a)}x^{3}$. Find $f(${x})$.`, `设 $f(x) = ${front(a)}x^{3}$。求 $f(${x})$。`),
            answer: y,
            wrong: [
              y.neg(),
              a.mul(Q.of(3 * x)),
              a.mul(Q.of(x * x)),
              a
                .mul(a)
                .mul(a)
                .mul(Q.of(x ** 3)),
            ],
            solution: t(
              `Cube first, then multiply by the coefficient:${steps(`f(${x}) = ${aDot}${paren(x)}^{3}${mid} = ${num(y)}`)}`,
              `先立方，再乘以系数：${steps(`f(${x}) = ${aDot}${paren(x)}^{3}${mid} = ${num(y)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "the-center-of-a-cubic-curve",
      title: t("The center of a cubic curve", "三次曲线的对称中心"),
      explanation: t(
        "The graph of $y = a(x - h)^{3} + k$ is the graph of $y = ax^{3}$ translated $h$ units right and $k$ units up. Its center moves from $(0, 0)$ to $(h, k)$, and the curve is symmetric about that point.\n\nFor $y = 2(x + 1)^{3} - 4$, write $x + 1 = x - (-1)$: $h = -1$ and $k = -4$, so the center is $(-1, -4)$. The sign of $h$ is the opposite of the sign inside the parentheses.",
        "$y = a(x - h)^{3} + k$ 的图象是把 $y = ax^{3}$ 的图象向右平移 $h$ 个单位、向上平移 $k$ 个单位得到的。对称中心从 $(0, 0)$ 移到 $(h, k)$，曲线关于这一点对称。\n\n对 $y = 2(x + 1)^{3} - 4$，把 $x + 1$ 写成 $x - (-1)$：$h = -1$，$k = -4$，所以对称中心是 $(-1, -4)$。$h$ 的符号与括号内的符号相反。",
      ),
      keyPrerequisites: ["combining-graph-transformations-two-operations"],
      generate(rng) {
        const a = rng.pick(cubicAs);
        const h = rng.int(-6, 6);
        const k = rng.int(-9, 9);
        const lhs = rng.pick(["y", "f(x)", "g(x)"]);
        const rhs =
          rng.bool(0.25) && k !== 0
            ? `${k} ${a.sign() > 0 ? "+" : "-"} ${front(a.sign() > 0 ? a : a.neg())}${factorLatex([h, 3])}`
            : cubicLatex(a, h, k);
        return pointProblem({
          prompt: t(`What is the center of the graph of $${lhs} = ${rhs}$?`, `$${lhs} = ${rhs}$ 的图象的对称中心是哪一点？`),
          answer: [h, k],
          wrong: [
            [-h, k],
            [h, -k],
            [k, h],
            [-h, -k],
          ],
          solution: t(
            `The curve is $y = ${front(a)}x^{3}$ translated ${h < 0 ? `$${-h}$ units left` : `$${h}$ units right`} and ${k < 0 ? `$${-k}$ units down` : `$${k}$ units up`}, so its center is $(${h}, ${k})$.`,
            `这条曲线是把 $y = ${front(a)}x^{3}$ 向${h < 0 ? `左平移 $${-h}$` : `右平移 $${h}$`} 个单位、向${k < 0 ? `下平移 $${-k}$` : `上平移 $${k}$`} 个单位得到的，所以对称中心是 $(${h}, ${k})$。`,
          ),
        });
      },
    },
    {
      id: "matching-a-cubic-to-its-graph",
      title: t("Matching an equation to a cubic curve", "由三次曲线选方程"),
      explanation: t(
        "To match $y = a(x - h)^{3} + k$ to its graph, read two features:\n\n1. the center $(h, k)$, the point where the curve flattens out and about which it is symmetric;\n2. the direction: a curve that rises from left to right has $a > 0$, one that falls has $a < 0$.\n\nA curve that falls from left to right with center $(2, -1)$ is $y = a(x - 2)^{3} - 1$ with $a < 0$, such as $y = -(x - 2)^{3} - 1$.",
        "要为 $y = a(x - h)^{3} + k$ 找到图象，读出两个特征：\n\n1. 对称中心 $(h, k)$，即曲线变平、并且曲线关于它对称的点；\n2. 走向：从左到右上升的曲线 $a > 0$，下降的曲线 $a < 0$。\n\n一条从左到右下降、对称中心为 $(2, -1)$ 的曲线是 $y = a(x - 2)^{3} - 1$，其中 $a < 0$，例如 $y = -(x - 2)^{3} - 1$。",
      ),
      generate(rng) {
        const a = rng.pick([Q.one, Q.of(-1), Q.of(1, 2), Q.of(-1, 2), Q.of(2), Q.of(-2)]);
        const h = rng.nonZero(-3, 3);
        const k = rng.nonZero(-4, 4);
        const variants: [Q, number, number][] = [
          [a, h, k],
          [a.neg(), h, k],
          [a, -h, k],
          [a, h, -k],
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const rising = a.sign() > 0;
        return {
          ...choiceProblem({
            prompt: t("Which equation has the graph shown?", "图中的曲线是哪个方程的图象？"),
            options: order.map((i) => {
              const [p, q, r] = variants[i]!;
              return same(`$y = ${cubicLatex(p, q, r)}$`);
            }),
            correct: order.indexOf(0),
            solution: t(
              `The center of the curve is $(${h}, ${k})$, so $h = ${h}$ and $k = ${k}$. The curve ${rising ? "rises" : "falls"} from left to right, so $a ${rising ? ">" : "<"} 0$. The equation is $y = ${cubicLatex(a, h, k)}$.`,
              `曲线的对称中心是 $(${h}, ${k})$，所以 $h = ${h}$，$k = ${k}$。曲线从左到右${rising ? "上升" : "下降"}，所以 $a ${rising ? ">" : "<"} 0$。方程是 $y = ${cubicLatex(a, h, k)}$。`,
            ),
          }),
          figure: cubicFigure(a, h, k),
        };
      },
    },
  ],
};

// ─── 2.8.2 Graphing cubic curves containing three distinct real roots ──────

/** threeRoots draws three distinct roots for a factored cubic. */
const threeRoots = (rng: Rng, lo: number, hi: number, zero = true): Factor[] =>
  rng
    .sample(
      range(lo, hi).filter((r) => zero || r !== 0),
      3,
    )
    .map((r): Factor => [r, 1]);

/** graphingCubicCurvesContainingThreeDistinctRealRoots sketches a(x − p)(x − q)(x − r). */
export const graphingCubicCurvesContainingThreeDistinctRealRoots: TopicDef = {
  id: "graphing-cubic-curves-containing-three-distinct-real-roots",
  title: t("Graphing Cubic Curves Containing Three Distinct Real Roots", "画有三个不同实根的三次曲线"),
  summary: t(
    "Sketch $y = a(x - p)(x - q)(x - r)$ from its intercepts and end behavior, read where it is positive or negative, and find its equation from a graph.",
    "由截距和端点行为画出 $y = a(x - p)(x - q)(x - r)$ 的草图，读出它何时为正、何时为负，并由图象求方程。",
  ),
  prerequisites: ["graphing-elementary-cubic-functions", "determining-the-roots-of-polynomials", "end-behavior"],
  encompasses: [
    { topic: "determining-the-roots-of-polynomials", weight: 0.4 },
    { topic: "end-behavior", weight: 0.3 },
    { topic: "graphing-elementary-cubic-functions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSF.IF.C.7.C"],
  knowledgePoints: [
    {
      id: "the-y-intercept-of-a-factored-cubic",
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "To sketch $f(x) = a(x - p)(x - q)(x - r)$, start with the intercepts.\n\n- The roots $p$, $q$ and $r$ are the $x$-intercepts.\n- The $y$-intercept is $f(0)$: substitute $x = 0$ into every factor.\n\nFor $f(x) = 2(x - 1)(x + 3)(x - 4)$:\n\n$$f(0) = 2(0 - 1)(0 + 3)(0 - 4) = 2 \\cdot (-1) \\cdot 3 \\cdot (-4) = 24$$\n\nso the graph crosses the $y$-axis at $(0, 24)$. Count the negative factors carefully: here there are two, so the product is positive.",
        "画 $f(x) = a(x - p)(x - q)(x - r)$ 的草图，先求截距。\n\n- 根 $p$、$q$、$r$ 是 $x$ 轴截距。\n- $y$ 轴截距是 $f(0)$：在每个因式中代入 $x = 0$。\n\n对 $f(x) = 2(x - 1)(x + 3)(x - 4)$：\n\n$$f(0) = 2(0 - 1)(0 + 3)(0 - 4) = 2 \\cdot (-1) \\cdot 3 \\cdot (-4) = 24$$\n\n所以图象与 $y$ 轴交于 $(0, 24)$。要仔细数负因数的个数：这里有两个，所以乘积为正。",
      ),
      generate(rng) {
        const a = Q.of(rng.pick([1, 1, -1, 2, -2, 3, -3]));
        const fs = threeRoots(rng, -6, 6, false);
        const y0 = valueAt(a, fs, 0);
        const factors = fs.map(([r]) => paren(-r));
        return pointProblem({
          prompt: t(
            `At which point does the graph of $y = ${polyLatex(a, fs)}$ cross the $y$-axis?`,
            `$y = ${polyLatex(a, fs)}$ 的图象与 $y$ 轴交于哪一点？`,
          ),
          answer: [0, y0],
          wrong: [
            [0, y0.neg()],
            [y0, 0],
            [0, a.mul(Q.of(fs.reduce((s, [r]) => s + r, 0)))],
            [0, a],
          ],
          solution: t(
            `On the $y$-axis $x = 0$:${steps(`y = ${a.eq(Q.one) ? "" : `${paren(a)} \\cdot `}${factors.join(" \\cdot ")} = ${num(y0)}`)}The point is $(0, ${num(y0)})$.`,
            `在 $y$ 轴上 $x = 0$：${steps(`y = ${a.eq(Q.one) ? "" : `${paren(a)} \\cdot `}${factors.join(" \\cdot ")} = ${num(y0)}`)}交点是 $(0, ${num(y0)})$。`,
          ),
        });
      },
    },
    {
      id: "where-a-cubic-is-positive",
      title: t("Where the cubic is positive or negative", "三次函数何时为正、何时为负"),
      explanation: t(
        "Between consecutive roots a polynomial keeps one sign, and at a root that appears once it changes sign. The end behavior tells the sign at the far right: for $a > 0$, $f(x) \\to \\infty$ as $x \\to \\infty$, so $f$ is positive after the largest root. Moving left, the sign changes at each root.\n\nFor $f(x) = (x + 2)(x - 1)(x - 3)$, $a = 1 > 0$:\n\n$$(-\\infty, -2): -, \\quad (-2, 1): +, \\quad (1, 3): -, \\quad (3, \\infty): +$$\n\nSo $f(x) > 0$ on $(-2, 1) \\cup (3, \\infty)$. For $a < 0$ every sign is reversed. The roots themselves are not included, since $f$ is $0$ there.",
        "在相邻两根之间，多项式的符号不变；在只出现一次的根处，符号改变。端点行为给出最右边的符号：$a > 0$ 时，当 $x \\to \\infty$ 时 $f(x) \\to \\infty$，所以在最大的根右边 $f$ 为正。向左移动，每经过一个根符号就改变一次。\n\n对 $f(x) = (x + 2)(x - 1)(x - 3)$，$a = 1 > 0$：\n\n$$(-\\infty, -2): -, \\quad (-2, 1): +, \\quad (1, 3): -, \\quad (3, \\infty): +$$\n\n所以 $f(x) > 0$ 的解集是 $(-2, 1) \\cup (3, \\infty)$。$a < 0$ 时所有符号都相反。根本身不包括在内，因为在那里 $f$ 等于 $0$。",
      ),
      keyPrerequisites: ["end-behavior"],
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const fs = threeRoots(rng, -7, 7);
        const op = rng.pick([">", "<"] as const);
        const answer = signSet(Math.sign(a), fs, op);
        const right = a > 0 ? "positive" : "negative";
        return intervalProblem({
          prompt: inequalityPrompt(polyLatex(Q.of(a), fs), op),
          set: answer,
          form: "interval",
          wrong: [signSet(Math.sign(a), fs, opposite[op]), signSet(Math.sign(a), fs, op === ">" ? ">=" : "<=")],
          solution: t(
            `The roots are ${rootsOf(fs)
              .map((r) => `$${r}$`)
              .join(
                ", ",
              )}. Since $a = ${a}$ is ${right}, $f$ is ${right} after the largest root, and the sign changes at each root:${steps(signTable(Math.sign(a), fs))}So $f(x) ${opLatex[op]} 0$ on $${intervalLatex(answer)}$.`,
            `根是 ${rootsOf(fs)
              .map((r) => `$${r}$`)
              .join(
                "、",
              )}。因为 $a = ${a}$ 为${a > 0 ? "正" : "负"}，在最大的根右边 $f$ 为${a > 0 ? "正" : "负"}，每经过一个根符号改变一次：${steps(signTable(Math.sign(a), fs))}所以 $f(x) ${opLatex[op]} 0$ 的解集是 $${intervalLatex(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "a-cubic-from-its-graph",
      title: t("The equation from the graph", "由图象求方程"),
      explanation: t(
        "A cubic that crosses the $x$-axis at $p$, $q$ and $r$ is $f(x) = a(x - p)(x - q)(x - r)$ for some $a$. One more point of the graph fixes $a$.\n\nIf the graph crosses the $x$-axis at $-1$, $2$ and $3$ and passes through $(0, 3)$, then $f(x) = a(x + 1)(x - 2)(x - 3)$ and\n\n$$3 = a(0 + 1)(0 - 2)(0 - 3) = 6a \\quad\\Rightarrow\\quad a = \\frac{1}{2}$$\n\nso $f(x) = \\frac{1}{2}(x + 1)(x - 2)(x - 3)$. Check the direction: the graph rises at the right, as $a > 0$ requires.",
        "在 $p$、$q$、$r$ 处穿过 $x$ 轴的三次函数是 $f(x) = a(x - p)(x - q)(x - r)$，其中 $a$ 待定。图象上再有一个点就能确定 $a$。\n\n若图象在 $-1$、$2$、$3$ 处穿过 $x$ 轴并经过 $(0, 3)$，则 $f(x) = a(x + 1)(x - 2)(x - 3)$，且\n\n$$3 = a(0 + 1)(0 - 2)(0 - 3) = 6a \\quad\\Rightarrow\\quad a = \\frac{1}{2}$$\n\n所以 $f(x) = \\frac{1}{2}(x + 1)(x - 2)(x - 3)$。检查走向：图象右端上升，与 $a > 0$ 相符。",
      ),
      generate(rng) {
        const d = drawPolynomial(rng, () => threeRoots(rng, -4, 4));
        return {
          ...expressionProblem({
            prompt: t(
              "The graph of a cubic function $f$ is shown. Its $x$-intercepts are at integers, and it passes through the marked point. Find $f(x)$.",
              "如图是三次函数 $f$ 的图象。它的 $x$ 轴截距都是整数，并且经过标出的点。求 $f(x)$。",
            ),
            answer: polyLatex(d.a, d.fs),
            prefix: "f(x) =",
            wrong: equationWrongs(d),
            solution: t(
              `The graph crosses the $x$-axis at ${rootsOf(d.fs)
                .map((r) => `$${r}$`)
                .join(
                  ", ",
                )}, so $f(x) = a${polyLatex(Q.one, d.fs)}$. Substitute the marked point $(${d.mark[0]}, ${d.mark[1]})$:${substitution(d)}So $f(x) = ${polyLatex(d.a, d.fs)}$.`,
              `图象在 ${rootsOf(d.fs)
                .map((r) => `$${r}$`)
                .join(
                  "、",
                )} 处穿过 $x$ 轴，所以 $f(x) = a${polyLatex(Q.one, d.fs)}$。代入标出的点 $(${d.mark[0]}, ${d.mark[1]})$：${substitution(d)}所以 $f(x) = ${polyLatex(d.a, d.fs)}$。`,
            ),
          }),
          figure: drawnFigure(d),
        };
      },
    },
  ],
};

// ─── 2.8.3 Graphing cubic curves containing a double root ──────────────────

/** doubleRoot draws a double root and a simple root, distinct. */
function doubleRoot(rng: Rng, lo: number, hi: number): Factor[] {
  const [p, q] = rng.sample(range(lo, hi), 2) as [number, number];
  return [
    [p, 2],
    [q, 1],
  ];
}

const crossOptions: readonly Text[] = [
  t("It crosses the $x$-axis there.", "图象在该处穿过 $x$ 轴。"),
  t("It touches the $x$-axis there and turns back.", "图象在该处与 $x$ 轴相切后折回。"),
];

/** graphingCubicCurvesContainingADoubleRoot sketches a(x − p)²(x − q). */
export const graphingCubicCurvesContainingADoubleRoot: TopicDef = {
  id: "graphing-cubic-curves-containing-a-double-root",
  title: t("Graphing Cubic Curves Containing a Double Root", "画有二重根的三次曲线"),
  summary: t(
    "Sketch $y = a(x - p)^{2}(x - q)$: the graph touches the $x$-axis at the double root $p$ and crosses it at $q$.",
    "画出 $y = a(x - p)^{2}(x - q)$ 的草图：图象在二重根 $p$ 处与 $x$ 轴相切，在 $q$ 处穿过 $x$ 轴。",
  ),
  prerequisites: ["graphing-cubic-curves-containing-three-distinct-real-roots", "multiplicities-of-the-roots-of-polynomials"],
  encompasses: [
    { topic: "graphing-cubic-curves-containing-three-distinct-real-roots", weight: 0.6 },
    { topic: "multiplicities-of-the-roots-of-polynomials", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSF.IF.C.7.C"],
  knowledgePoints: [
    {
      id: "touching-or-crossing",
      title: t("Touching or crossing the $x$-axis", "与 $x$ 轴相切还是穿过"),
      explanation: t(
        "Near a root, the factor of that root decides the sign. A simple factor $x - q$ changes sign at $q$, so the graph **crosses** the $x$-axis there. A squared factor $(x - p)^{2}$ is never negative, so the sign does not change at $p$: the graph **touches** the $x$-axis and turns back.\n\nThe graph of $f(x) = (x - 1)^{2}(x + 2)$ crosses the $x$-axis at $-2$ and touches it at $1$, where it has a turning point.",
        "在一个根附近，由这个根的因式决定符号。单因式 $x - q$ 在 $q$ 处变号，所以图象在那里**穿过** $x$ 轴。平方因式 $(x - p)^{2}$ 永远不为负，所以在 $p$ 处符号不变：图象与 $x$ 轴**相切**后折回。\n\n$f(x) = (x - 1)^{2}(x + 2)$ 的图象在 $-2$ 处穿过 $x$ 轴，在 $1$ 处与 $x$ 轴相切，那里是一个拐回点。",
      ),
      figure: {
        svg: plane(view, [{ kind: "curve", f: (x) => (x - 1) ** 2 * (x + 2), accent: true }]),
        alt: t(
          "The graph of f(x) = (x − 1)²(x + 2). It crosses the x-axis at x = −2 and touches the x-axis and turns back at x = 1.",
          "f(x) = (x − 1)²(x + 2) 的图象。它在 x = −2 处穿过 x 轴，在 x = 1 处与 x 轴相切后折回。",
        ),
      },
      keyPrerequisites: ["multiplicities-of-the-roots-of-polynomials"],
      generate(rng) {
        const a = Q.of(rng.pick([1, 1, -1, 2, -2, 3, -3]));
        const fs = doubleRoot(rng, -7, 7);
        const [[p], [q]] = fs as [Factor, Factor];
        const expr = polyLatex(a, rng.shuffle(fs));
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(
              `The graph of $f(x) = ${expr}$ touches the $x$-axis at one point without crossing it. What is the $x$-coordinate of that point?`,
              `$f(x) = ${expr}$ 的图象在一点与 $x$ 轴相切而不穿过。这一点的 $x$ 坐标是多少？`,
            ),
            answer: p,
            wrong: [q, -p, -q],
            solution: t(
              `The factor $${factorLatex([p, 2])}$ is squared, so $f$ does not change sign at $${p}$: the graph touches the $x$-axis at $x = ${p}$. At $x = ${q}$ the factor appears once and the graph crosses.`,
              `因式 $${factorLatex([p, 2])}$ 是平方，所以 $f$ 在 $${p}$ 处不变号：图象在 $x = ${p}$ 处与 $x$ 轴相切。在 $x = ${q}$ 处因式只出现一次，图象穿过 $x$ 轴。`,
            ),
          });
        }
        const atDouble = rng.bool();
        const root = atDouble ? p : q;
        return choiceProblem({
          prompt: t(
            `What does the graph of $f(x) = ${expr}$ do at $x = ${root}$?`,
            `$f(x) = ${expr}$ 的图象在 $x = ${root}$ 处是什么情形？`,
          ),
          options: crossOptions,
          correct: atDouble ? 1 : 0,
          solution: atDouble
            ? t(
                `The root $${p}$ has multiplicity $2$: the factor $${factorLatex([p, 2])}$ is never negative, so $f$ does not change sign there and the graph touches the $x$-axis and turns back.`,
                `根 $${p}$ 是二重根：因式 $${factorLatex([p, 2])}$ 永远不为负，所以 $f$ 在那里不变号，图象与 $x$ 轴相切后折回。`,
              )
            : t(
                `The root $${q}$ has multiplicity $1$: the factor $${factorLatex([q, 1])}$ changes sign there, so the graph crosses the $x$-axis.`,
                `根 $${q}$ 是一重根：因式 $${factorLatex([q, 1])}$ 在那里变号，所以图象穿过 $x$ 轴。`,
              ),
        });
      },
    },
    {
      id: "signs-with-a-double-root",
      title: t("Signs with a double root", "有二重根时的符号"),
      explanation: t(
        "Read the signs as before, from the right end, but change sign only at a root of odd multiplicity. For $f(x) = (x - 1)^{2}(x + 2)$, $a = 1 > 0$:\n\n$$(-\\infty, -2): -, \\quad (-2, 1): +, \\quad (1, \\infty): +$$\n\nSo $f(x) > 0$ on $(-2, 1) \\cup (1, \\infty)$: the double root $1$ is left out, since $f(1) = 0$. With $\\ge$, it is put back as a single point: $f(x) \\ge 0$ on $[-2, \\infty)$, and $f(x) \\le 0$ on $(-\\infty, -2] \\cup \\{1\\}$.",
        "仍然从右端开始读符号，但只在奇数重根处变号。对 $f(x) = (x - 1)^{2}(x + 2)$，$a = 1 > 0$：\n\n$$(-\\infty, -2): -, \\quad (-2, 1): +, \\quad (1, \\infty): +$$\n\n所以 $f(x) > 0$ 的解集是 $(-2, 1) \\cup (1, \\infty)$：二重根 $1$ 要去掉，因为 $f(1) = 0$。若是 $\\ge$，就把它作为单独一点补回：$f(x) \\ge 0$ 的解集是 $[-2, \\infty)$，$f(x) \\le 0$ 的解集是 $(-\\infty, -2] \\cup \\{1\\}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const fs = doubleRoot(rng, -6, 6);
        const op = rng.pick([">", "<", ">", "<", ">=", "<="] as const);
        const s = Math.sign(a);
        const answer = signSet(s, fs, op);
        return intervalProblem({
          prompt: inequalityPrompt(polyLatex(Q.of(a), rng.shuffle(fs)), op),
          set: answer,
          form: "interval",
          wrong: [
            signSet(s, simple(fs), op),
            signSet(s, fs, opposite[op]),
            signSet(s, fs, strict[op]),
            signSet(s, fs, op === ">" ? ">=" : op === "<" ? "<=" : op),
          ],
          solution: t(
            `Since $a = ${a}$ is ${a > 0 ? "positive" : "negative"}, $f$ is ${a > 0 ? "positive" : "negative"} at the right end. The sign changes at the simple root $${fs[1]![0]}$ but not at the double root $${fs[0]![0]}$:${steps(signTable(s, fs))}So $f(x) ${opLatex[op]} 0$ on $${intervalLatex(answer)}$.`,
            `因为 $a = ${a}$ 为${a > 0 ? "正" : "负"}，$f$ 在右端为${a > 0 ? "正" : "负"}。在一重根 $${fs[1]![0]}$ 处变号，在二重根 $${fs[0]![0]}$ 处不变号：${steps(signTable(s, fs))}所以 $f(x) ${opLatex[op]} 0$ 的解集是 $${intervalLatex(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "a-cubic-with-a-double-root-from-its-graph",
      title: t("The equation from the graph", "由图象求方程"),
      explanation: t(
        "A cubic whose graph touches the $x$-axis at $p$ and crosses it at $q$ has a double root $p$ and a simple root $q$: $f(x) = a(x - p)^{2}(x - q)$. The degrees add up to $3$, as they must for a cubic. Then a marked point gives $a$.\n\nIf the graph touches the $x$-axis at $2$, crosses it at $-1$ and passes through $(0, -2)$:\n\n$$-2 = a(0 - 2)^{2}(0 + 1) = 4a \\quad\\Rightarrow\\quad a = -\\frac{1}{2}$$\n\nso $f(x) = -\\frac{1}{2}(x - 2)^{2}(x + 1)$.",
        "图象在 $p$ 处与 $x$ 轴相切、在 $q$ 处穿过 $x$ 轴的三次函数，有二重根 $p$ 和一重根 $q$：$f(x) = a(x - p)^{2}(x - q)$。重数之和是 $3$，正是三次函数应有的次数。再由标出的点求 $a$。\n\n若图象在 $2$ 处与 $x$ 轴相切，在 $-1$ 处穿过 $x$ 轴，并经过 $(0, -2)$：\n\n$$-2 = a(0 - 2)^{2}(0 + 1) = 4a \\quad\\Rightarrow\\quad a = -\\frac{1}{2}$$\n\n所以 $f(x) = -\\frac{1}{2}(x - 2)^{2}(x + 1)$。",
      ),
      generate(rng) {
        const d = drawPolynomial(rng, () => doubleRoot(rng, -4, 4));
        const p = d.fs.find(([, m]) => m === 2)![0];
        const q = d.fs.find(([, m]) => m === 1)![0];
        const general = `a${factorLatex([p, 2])}${factorLatex([q, 1])}`;
        return {
          ...expressionProblem({
            prompt: t(
              "The graph of a cubic function $f$ is shown. Its $x$-intercepts are at integers, and it passes through the marked point. Find $f(x)$.",
              "如图是三次函数 $f$ 的图象。它的 $x$ 轴截距都是整数，并且经过标出的点。求 $f(x)$。",
            ),
            answer: polyLatex(d.a, d.fs),
            prefix: "f(x) =",
            wrong: equationWrongs(d, [
              polyLatex(d.a, simple(d.fs)),
              polyLatex(d.a, [
                [p, 1],
                [q, 2],
              ]),
            ]),
            solution: t(
              `The graph touches the $x$-axis at $${p}$, a double root, and crosses it at $${q}$, so $f(x) = ${general}$. Substitute the marked point $(${d.mark[0]}, ${d.mark[1]})$:${substitution(d)}So $f(x) = ${polyLatex(d.a, d.fs)}$.`,
              `图象在 $${p}$ 处与 $x$ 轴相切（二重根），在 $${q}$ 处穿过 $x$ 轴，所以 $f(x) = ${general}$。代入标出的点 $(${d.mark[0]}, ${d.mark[1]})$：${substitution(d)}所以 $f(x) = ${polyLatex(d.a, d.fs)}$。`,
            ),
          }),
          figure: drawnFigure(d),
        };
      },
    },
  ],
};

// ─── 2.8.4 Graphing cubic curves containing one distinct real root ─────────

/** quadLatex writes x² + bx + c. */
const quadLatex = (b: number, c: number) => poly([1, "x^{2}"], [b, "x"], [c, ""]);

/** irreducible draws x² + bx + c with a negative discriminant. */
function irreducible(rng: Rng): [number, number] {
  if (rng.bool(0.4)) return [0, rng.int(1, 9)];
  const b = rng.nonZero(-6, 6);
  return [b, Math.floor((b * b) / 4) + rng.int(1, 6)];
}

/** oneRootCubic writes a(x − p)(x² + bx + c). */
const oneRootCubic = (a: Q, p: number, b: number, c: number) => `${front(a)}${factorLatex([p, 1])}(${quadLatex(b, c)})`;

/** graphingCubicCurvesContainingOneDistinctRealRoot sketches cubics with a single real root. */
export const graphingCubicCurvesContainingOneDistinctRealRoot: TopicDef = {
  id: "graphing-cubic-curves-containing-one-distinct-real-root",
  title: t("Graphing Cubic Curves Containing One Distinct Real Root", "画只有一个实根的三次曲线"),
  summary: t(
    "Sketch cubics such as $a(x - p)(x^{2} + bx + c)$ with $b^{2} - 4c < 0$, or $a(x - h)^{3}$, which cross the $x$-axis only once.",
    "画出 $a(x - p)(x^{2} + bx + c)$（$b^{2} - 4c < 0$）或 $a(x - h)^{3}$ 这类只穿过 $x$ 轴一次的三次曲线。",
  ),
  prerequisites: ["graphing-cubic-curves-containing-three-distinct-real-roots", "the-discriminant-of-a-quadratic-equation"],
  encompasses: [
    { topic: "graphing-cubic-curves-containing-three-distinct-real-roots", weight: 0.5 },
    { topic: "the-discriminant-of-a-quadratic-equation", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSF.IF.C.7.C"],
  knowledgePoints: [
    {
      id: "the-real-roots",
      title: t("A quadratic factor without real roots", "没有实根的二次因式"),
      explanation: t(
        "A cubic always has at least one real root, but it may have only one. In $f(x) = (x - 2)(x^{2} + 2x + 5)$ the quadratic factor has discriminant $2^{2} - 4 \\cdot 1 \\cdot 5 = -16 < 0$, so it is never zero (in fact always positive). The only real root is $x = 2$, and the graph crosses the $x$-axis just once.\n\nLikewise $x^{2} + 9$ has no real roots: $x^{2} + 9 = 0$ would need $x^{2} = -9$. So $(x + 1)(x^{2} + 9)$ has the single real root $-1$; $\\pm 3$ are not roots.",
        "三次函数至少有一个实根，但可能只有一个。在 $f(x) = (x - 2)(x^{2} + 2x + 5)$ 中，二次因式的判别式是 $2^{2} - 4 \\cdot 1 \\cdot 5 = -16 < 0$，所以它永远不为零（实际上总是正的）。唯一的实根是 $x = 2$，图象只穿过 $x$ 轴一次。\n\n同样，$x^{2} + 9$ 没有实根：$x^{2} + 9 = 0$ 需要 $x^{2} = -9$。所以 $(x + 1)(x^{2} + 9)$ 只有一个实根 $-1$；$\\pm 3$ 不是根。",
      ),
      keyPrerequisites: ["the-discriminant-of-a-quadratic-equation"],
      generate(rng) {
        const a = Q.of(rng.pick([1, 1, 2, -1, 3, -2]));
        const p = rng.int(-8, 8);
        const [b, c] = irreducible(rng);
        const sq = Math.round(Math.sqrt(c));
        const fake = b === 0 ? (sq * sq === c ? [String(sq), String(-sq)] : [`\\sqrt{${c}}`, `-\\sqrt{${c}}`]) : [String(-c)];
        const D = b * b - 4 * c;
        return solutionsProblem({
          prompt: t(`Find all real roots of $f(x) = ${oneRootCubic(a, p, b, c)}$.`, `求 $f(x) = ${oneRootCubic(a, p, b, c)}$ 的所有实根。`),
          values: [String(p)],
          wrong: [[String(-p)], [String(p), ...fake], [...fake]],
          solution: t(
            `The factor $${factorLatex([p, 1])}$ gives the root $x = ${p}$. The quadratic $${quadLatex(b, c)}$ has discriminant $${D}$, which is negative, so it has no real roots. The only real root is $x = ${p}$.`,
            `因式 $${factorLatex([p, 1])}$ 给出根 $x = ${p}$。二次式 $${quadLatex(b, c)}$ 的判别式是 $${D}$，为负数，所以它没有实根。唯一的实根是 $x = ${p}$。`,
          ),
        });
      },
    },
    {
      id: "counting-x-intercepts",
      title: t("Counting $x$-intercepts", "数 $x$ 轴截距的个数"),
      explanation: t(
        "To count the $x$-intercepts of $f(x) = (x - p)(x^{2} + bx + c)$, add the root $p$ to the distinct real roots of the quadratic, which its discriminant $D = b^{2} - 4c$ tells:\n\n- $D < 0$: no real roots, so **one** $x$-intercept;\n- $D = 0$: one double root, so **two** $x$-intercepts (the graph touches at the double root);\n- $D > 0$: two roots, so **three** $x$-intercepts.\n\nWatch for a root of the quadratic that equals $p$: $(x - 1)(x^{2} - 4x + 3) = (x - 1)^{2}(x - 3)$ has only two $x$-intercepts.",
        "要数 $f(x) = (x - p)(x^{2} + bx + c)$ 的 $x$ 轴截距个数，把根 $p$ 与二次式不同的实根合在一起，二次式的实根由判别式 $D = b^{2} - 4c$ 决定：\n\n- $D < 0$：没有实根，所以有**一个** $x$ 轴截距；\n- $D = 0$：一个二重根，所以有**两个** $x$ 轴截距（图象在二重根处相切）；\n- $D > 0$：两个根，所以有**三个** $x$ 轴截距。\n\n注意二次式的根可能等于 $p$：$(x - 1)(x^{2} - 4x + 3) = (x - 1)^{2}(x - 3)$ 只有两个 $x$ 轴截距。",
      ),
      keyPrerequisites: ["the-discriminant-of-a-quadratic-equation"],
      generate(rng) {
        const want = rng.pick([1, 1, 2, 3]);
        for (;;) {
          const p = rng.int(-5, 5);
          const b = rng.int(-6, 6);
          const c = rng.nonZero(-9, 9);
          const D = b * b - 4 * c;
          const s = Math.round(Math.sqrt(Math.max(D, 0)));
          let others: number[];
          if (D < 0) others = [];
          else if (s * s !== D) others = [Number.NaN, Number.NaN];
          else others = [...new Set([(-b + s) / 2, (-b - s) / 2])];
          const count = 1 + others.filter((r) => r !== p).length;
          if (count !== want) continue;
          const why =
            D < 0
              ? { en: "is negative, so the quadratic has no real roots", zh: "为负，所以二次式没有实根" }
              : D === 0
                ? { en: "is zero, so the quadratic has one double root", zh: "为零，所以二次式有一个二重根" }
                : { en: "is positive, so the quadratic has two real roots", zh: "为正，所以二次式有两个实根" };
          const shared = others.includes(p);
          return numberProblem({
            prompt: t(
              `How many $x$-intercepts does the graph of $f(x) = ${factorLatex([p, 1])}(${quadLatex(b, c)})$ have?`,
              `$f(x) = ${factorLatex([p, 1])}(${quadLatex(b, c)})$ 的图象有几个 $x$ 轴截距？`,
            ),
            answer: count,
            wrong: [1, 2, 3].filter((n) => n !== count),
            solution: t(
              `The discriminant of $${quadLatex(b, c)}$ is $${paren(b)}^{2} - 4 \\cdot ${paren(c)} = ${D}$, which ${why.en}.${shared ? ` One of them is $${p}$, the root of the linear factor.` : ""} Together with $x = ${p}$ there ${count === 1 ? "is $1$ $x$-intercept" : `are $${count}$ $x$-intercepts`}.`,
              `$${quadLatex(b, c)}$ 的判别式是 $${paren(b)}^{2} - 4 \\cdot ${paren(c)} = ${D}$，${why.zh}。${shared ? `其中一个根是一次因式的根 $${p}$。` : ""}连同 $x = ${p}$，共有 $${count}$ 个 $x$ 轴截距。`,
            ),
          });
        }
      },
    },
    {
      id: "signs-with-one-real-root",
      title: t("Signs with one real root", "只有一个实根时的符号"),
      explanation: t(
        "When the only real root is $p$, the sign changes only at $p$. A quadratic factor with negative discriminant and leading coefficient $1$ is always positive, and $(x - h)^{3}$ has the sign of $x - h$. So the sign of $f$ is the sign of $a(x - p)$.\n\nFor $f(x) = -2(x - 3)(x^{2} + x + 1)$: $f(x) > 0$ exactly when $-2(x - 3) > 0$, that is, on $(-\\infty, 3)$.",
        "当唯一的实根是 $p$ 时，符号只在 $p$ 处改变。判别式为负、首项系数为 $1$ 的二次因式总是正的，而 $(x - h)^{3}$ 与 $x - h$ 同号。所以 $f$ 的符号就是 $a(x - p)$ 的符号。\n\n对 $f(x) = -2(x - 3)(x^{2} + x + 1)$：$f(x) > 0$ 当且仅当 $-2(x - 3) > 0$，即解集是 $(-\\infty, 3)$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const p = rng.int(-8, 8);
        const op = rng.pick([">", "<"] as const);
        const fs: Factor[] = [[p, 1]];
        const answer = signSet(Math.sign(a), fs, op);
        const cube = rng.bool(0.35);
        const [b, c] = irreducible(rng);
        const f = cube ? polyLatex(Q.of(a), [[p, 3]]) : oneRootCubic(Q.of(a), p, b, c);
        const reason = cube
          ? {
              en: `$${factorLatex([p, 3])}$ has the sign of $${factorLatex([p, 1])}$`,
              zh: `$${factorLatex([p, 3])}$ 与 $${factorLatex([p, 1])}$ 同号`,
            }
          : {
              en: `$${quadLatex(b, c)}$ has discriminant $${b * b - 4 * c} < 0$, so it is always positive`,
              zh: `$${quadLatex(b, c)}$ 的判别式 $${b * b - 4 * c} < 0$，所以它总是正的`,
            };
        return intervalProblem({
          prompt: inequalityPrompt(f, op),
          set: answer,
          form: "interval",
          wrong: [signSet(Math.sign(a), fs, opposite[op]), signSet(Math.sign(a), fs, op === ">" ? ">=" : "<=")],
          solution: t(
            `Here ${reason.en}. So $f(x)$ has the sign of $${polyLatex(Q.of(a), fs)}$, which changes only at $x = ${p}$:${steps(signTable(Math.sign(a), fs))}So $f(x) ${opLatex[op]} 0$ on $${intervalLatex(answer)}$.`,
            `这里${reason.zh}。因此 $f(x)$ 与 $${polyLatex(Q.of(a), fs)}$ 同号，只在 $x = ${p}$ 处变号：${steps(signTable(Math.sign(a), fs))}所以 $f(x) ${opLatex[op]} 0$ 的解集是 $${intervalLatex(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "a-triple-root-from-the-graph",
      title: t("A triple root from the graph", "由图象求三重根的方程"),
      explanation: t(
        "The cubic $f(x) = a(x - h)^{3}$ has the single root $h$ with multiplicity $3$. Its graph is $y = ax^{3}$ moved $h$ units right: it crosses the $x$-axis at $h$ and flattens out there.\n\nIf such a graph crosses the $x$-axis at $1$ and passes through $(3, 4)$, then $h = 1$ and\n\n$$4 = a(3 - 1)^{3} = 8a \\quad\\Rightarrow\\quad a = \\frac{1}{2}$$\n\nso $f(x) = \\frac{1}{2}(x - 1)^{3}$.",
        "三次函数 $f(x) = a(x - h)^{3}$ 只有一个根 $h$，重数为 $3$。它的图象是把 $y = ax^{3}$ 向右平移 $h$ 个单位：在 $h$ 处穿过 $x$ 轴，并在那里变平。\n\n若这样的图象在 $1$ 处穿过 $x$ 轴并经过 $(3, 4)$，则 $h = 1$，且\n\n$$4 = a(3 - 1)^{3} = 8a \\quad\\Rightarrow\\quad a = \\frac{1}{2}$$\n\n所以 $f(x) = \\frac{1}{2}(x - 1)^{3}$。",
      ),
      generate(rng) {
        const d = drawPolynomial(rng, () => [[rng.int(-3, 3), 3]]);
        const h = d.fs[0]![0];
        return {
          ...expressionProblem({
            prompt: t(
              "The graph of $f(x) = a(x - h)^{3}$ is shown, where $a$ and $h$ are constants. It passes through the marked point. Find $f(x)$.",
              "如图是 $f(x) = a(x - h)^{3}$ 的图象，其中 $a$、$h$ 是常数。它经过标出的点。求 $f(x)$。",
            ),
            answer: polyLatex(d.a, d.fs),
            prefix: "f(x) =",
            wrong: equationWrongs(d, [`${front(d.a)}x^{3}${plus(-h)}`]),
            solution: t(
              `The graph crosses the $x$-axis only at $${h}$, flattening out there, so $h = ${h}$ and $f(x) = a${factorLatex([h, 3])}$. Substitute the marked point $(${d.mark[0]}, ${d.mark[1]})$:${substitution(d)}So $f(x) = ${polyLatex(d.a, d.fs)}$.`,
              `图象只在 $${h}$ 处穿过 $x$ 轴，并在那里变平，所以 $h = ${h}$，$f(x) = a${factorLatex([h, 3])}$。代入标出的点 $(${d.mark[0]}, ${d.mark[1]})$：${substitution(d)}所以 $f(x) = ${polyLatex(d.a, d.fs)}$。`,
            ),
          }),
          figure: drawnFigure(d),
        };
      },
    },
  ],
};

// ─── 2.8.6 Graphing general polynomials ─────────────────────────────────────

const behaviorOptions: readonly Text[] = [
  t("It crosses the $x$-axis without flattening.", "图象穿过 $x$ 轴，不变平。"),
  t("It touches the $x$-axis and turns back.", "图象与 $x$ 轴相切后折回。"),
  t("It flattens out as it crosses the $x$-axis.", "图象变平并穿过 $x$ 轴。"),
];

/** behaviorIndex is the option of behaviorOptions for a multiplicity. */
const behaviorIndex = (m: number) => (m === 1 ? 0 : m % 2 === 0 ? 1 : 2);

const endOptions: readonly Text[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
].map(([right, left]) => {
  const r = right! > 0 ? "\\infty" : "-\\infty";
  const l = left! > 0 ? "\\infty" : "-\\infty";
  return t(
    `As $x \\to \\infty$, $f(x) \\to ${r}$; as $x \\to -\\infty$, $f(x) \\to ${l}$`,
    `当 $x \\to \\infty$ 时 $f(x) \\to ${r}$；当 $x \\to -\\infty$ 时 $f(x) \\to ${l}$`,
  );
});

/** endIndex is the option of endOptions for the sign of a leading coefficient and a degree. */
const endIndex = (sign: number, degree: number) => {
  const left = degree % 2 === 0 ? sign : -sign;
  return (sign > 0 ? 0 : 2) + (left > 0 ? 0 : 1);
};

const infinity = (s: number) => (s > 0 ? "\\infty" : "-\\infty");

/** generalRoots draws roots of a quartic or quintic whose graph can be read. */
function generalRoots(rng: Rng): Factor[] {
  const pattern = rng.pick([
    [1, 1, 1, 1],
    [2, 1, 1],
    [2, 2],
    [3, 1],
    [2, 1, 1],
    [2, 2, 1],
    [3, 2],
    [2, 1, 1, 1],
  ]);
  return rng.sample(range(-4, 4), pattern.length).map((r, i): Factor => [r, pattern[i]!]);
}

/** graphingGeneralPolynomials sketches polynomials from their roots, multiplicities and end behavior. */
export const graphingGeneralPolynomials: TopicDef = {
  id: "graphing-general-polynomials",
  title: t("Graphing General Polynomials", "画一般多项式的图象"),
  summary: t(
    "Sketch a factored polynomial from its end behavior and the multiplicities of its roots, and find its equation from a graph.",
    "由端点行为和根的重数画出因式分解形式的多项式的草图，并由图象求方程。",
  ),
  prerequisites: ["graphing-cubic-curves-containing-a-double-root", "graphing-cubic-curves-containing-one-distinct-real-root"],
  encompasses: [
    { topic: "graphing-cubic-curves-containing-a-double-root", weight: 0.5 },
    { topic: "graphing-cubic-curves-containing-one-distinct-real-root", weight: 0.3 },
    { topic: "multiplicities-of-the-roots-of-polynomials", weight: 0.3 },
    { topic: "end-behavior", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSF.IF.C.7.C"],
  knowledgePoints: [
    {
      id: "behavior-at-a-root",
      title: t("Behavior at a root", "根处的图象形状"),
      explanation: t(
        "The multiplicity $m$ of a root decides what the graph does there:\n\n- $m = 1$: it crosses the $x$-axis, like a line;\n- $m$ even ($2, 4, \\dots$): it touches the $x$-axis and turns back, like a parabola;\n- $m$ odd and at least $3$: it flattens out as it crosses, like $y = x^{3}$.\n\nThe graph of $f(x) = (x + 3)(x - 1)^{2}(x - 4)^{3}$ crosses at $-3$, touches at $1$, and flattens out as it crosses at $4$.",
        "根的重数 $m$ 决定图象在那里的形状：\n\n- $m = 1$：图象像直线一样穿过 $x$ 轴；\n- $m$ 为偶数（$2, 4, \\dots$）：图象像抛物线一样与 $x$ 轴相切后折回；\n- $m$ 为奇数且至少为 $3$：图象像 $y = x^{3}$ 一样变平并穿过 $x$ 轴。\n\n$f(x) = (x + 3)(x - 1)^{2}(x - 4)^{3}$ 的图象在 $-3$ 处穿过，在 $1$ 处相切，在 $4$ 处变平并穿过。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = [1, rng.pick([2, 4]), rng.pick([3, 5])][kind]!;
        const roots = rng.sample(range(-7, 7), 3);
        const fs = roots.map((r, i): Factor => [r, i === 0 ? m : rng.int(1, 4)]);
        const root = roots[0]!;
        const a = Q.of(rng.pick([1, 1, -1, 2, -3]));
        const expr = polyLatex(a, rng.shuffle(fs));
        const word = [
          { en: "$1$, so the graph crosses the $x$-axis there", zh: "$1$，所以图象在那里穿过 $x$ 轴" },
          {
            en: `$${m}$, which is even, so the graph touches the $x$-axis and turns back`,
            zh: `$${m}$，是偶数，所以图象与 $x$ 轴相切后折回`,
          },
          {
            en: `$${m}$, which is odd and greater than $1$, so the graph flattens out as it crosses`,
            zh: `$${m}$，是大于 $1$ 的奇数，所以图象变平并穿过 $x$ 轴`,
          },
        ][kind]!;
        return choiceProblem({
          prompt: t(
            `What does the graph of $f(x) = ${expr}$ do at $x = ${root}$?`,
            `$f(x) = ${expr}$ 的图象在 $x = ${root}$ 处是什么情形？`,
          ),
          options: behaviorOptions,
          correct: behaviorIndex(m),
          solution: t(`The root $${root}$ has multiplicity ${word.en}.`, `根 $${root}$ 的重数是 ${word.zh}。`),
        });
      },
    },
    {
      id: "end-behavior-of-factored-polynomials",
      title: t("End behavior from the factors", "由因式看端点行为"),
      explanation: t(
        "The leading term of a factored polynomial is the product of the leading terms of its factors, so the degree is the sum of the multiplicities. A factor written as $c - x$ has leading term $-x$.\n\nFor $f(x) = 2x(x + 1)^{2}(3 - x)^{3}$ the leading term is $2 \\cdot x \\cdot x^{2} \\cdot (-x)^{3} = -2x^{6}$: the degree $6$ is even and the coefficient is negative, so $f(x) \\to -\\infty$ as $x \\to \\infty$ and as $x \\to -\\infty$.",
        "因式分解形式的多项式的首项是各因式首项的乘积，所以次数是各重数之和。写成 $c - x$ 的因式的首项是 $-x$。\n\n对 $f(x) = 2x(x + 1)^{2}(3 - x)^{3}$，首项是 $2 \\cdot x \\cdot x^{2} \\cdot (-x)^{3} = -2x^{6}$：次数 $6$ 是偶数，系数为负，所以当 $x \\to \\infty$ 以及 $x \\to -\\infty$ 时都有 $f(x) \\to -\\infty$。",
      ),
      keyPrerequisites: ["end-behavior"],
      generate(rng) {
        const a = rng.pick([1, 1, -1, 2, -2, 3, -4, 5]);
        const roots = rng.sample(range(-6, 6), rng.int(2, 3));
        const factors = roots.map((r) => ({ r, m: rng.int(1, 3), flip: r !== 0 && rng.bool(0.4) }));
        const degree = factors.reduce((s, f) => s + f.m, 0);
        const flips = factors.filter((f) => f.flip).reduce((s, f) => s + f.m, 0);
        const sign = Math.sign(a) * (flips % 2 === 0 ? 1 : -1);
        const latex = (f: { r: number; m: number; flip: boolean }) => {
          const base = f.r === 0 ? "x" : f.flip ? `(${poly([f.r, ""], [-1, "x"])})` : `(${linear(1, -f.r)})`;
          return f.m === 1 ? base : `${base}^{${f.m}}`;
        };
        const expr = `${front(Q.of(a))}${factors.map(latex).join("")}`;
        const lead = poly([a * (flips % 2 === 0 ? 1 : -1), `x^{${degree}}`]);
        const leadTerms = factors.map((f) => {
          const base = f.flip ? "(-x)" : "x";
          return f.m === 1 ? base : `${base}^{${f.m}}`;
        });
        return choiceProblem({
          prompt: t(`Describe the end behavior of $f(x) = ${expr}$.`, `描述 $f(x) = ${expr}$ 的端点行为。`),
          options: endOptions,
          correct: endIndex(sign, degree),
          solution: t(
            `Multiply the leading terms of the factors:${steps(`${a === 1 ? "" : `${paren(a)} \\cdot `}${leadTerms.join(" \\cdot ")} = ${lead}`)}The degree $${degree}$ is ${degree % 2 === 0 ? "even" : "odd"} and the leading coefficient is ${sign > 0 ? "positive" : "negative"}, so $f(x) \\to ${infinity(sign)}$ as $x \\to \\infty$ and $f(x) \\to ${infinity(degree % 2 === 0 ? sign : -sign)}$ as $x \\to -\\infty$.`,
            `把各因式的首项相乘：${steps(`${a === 1 ? "" : `${paren(a)} \\cdot `}${leadTerms.join(" \\cdot ")} = ${lead}`)}次数 $${degree}$ 是${degree % 2 === 0 ? "偶数" : "奇数"}，首项系数为${sign > 0 ? "正" : "负"}，所以当 $x \\to \\infty$ 时 $f(x) \\to ${infinity(sign)}$，当 $x \\to -\\infty$ 时 $f(x) \\to ${infinity(degree % 2 === 0 ? sign : -sign)}$。`,
          ),
        });
      },
    },
    {
      id: "signs-of-general-polynomials",
      title: t("Where a polynomial is positive or negative", "多项式何时为正、何时为负"),
      explanation: t(
        "Start at the right end, where $f$ has the sign of its leading coefficient. Moving left, the sign changes at each root of odd multiplicity and stays the same at each root of even multiplicity.\n\nFor $f(x) = -(x + 2)^{3}x^{2}(x - 3)$, the leading coefficient is $-1$:\n\n$$(-\\infty, -2): -, \\quad (-2, 0): +, \\quad (0, 3): +, \\quad (3, \\infty): -$$\n\nSo $f(x) > 0$ on $(-2, 0) \\cup (0, 3)$.",
        "从右端开始，那里 $f$ 与首项系数同号。向左移动，经过奇数重根时变号，经过偶数重根时不变号。\n\n对 $f(x) = -(x + 2)^{3}x^{2}(x - 3)$，首项系数是 $-1$：\n\n$$(-\\infty, -2): -, \\quad (-2, 0): +, \\quad (0, 3): +, \\quad (3, \\infty): -$$\n\n所以 $f(x) > 0$ 的解集是 $(-2, 0) \\cup (0, 3)$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-3, 3);
          const roots = rng.sample(range(-6, 6), rng.int(3, 4));
          const fs = roots.map((r): Factor => [r, rng.int(1, 3)]);
          if (fs.every(([, m]) => m % 2 === 0) || fs.every(([, m]) => m === 1)) continue;
          const op = rng.pick([">", "<"] as const);
          const s = Math.sign(a);
          const answer = signSet(s, fs, op);
          if (answer.length === 0) continue;
          const sorted = [...fs].sort((p, q) => p[0] - q[0]);
          const odd = sorted.filter(([, m]) => m % 2 === 1).map(([r]) => `$${r}$`);
          const even = sorted.filter(([, m]) => m % 2 === 0).map(([r]) => `$${r}$`);
          return intervalProblem({
            prompt: inequalityPrompt(polyLatex(Q.of(a), fs), op),
            set: answer,
            form: "interval",
            wrong: [signSet(s, simple(fs), op), signSet(s, fs, opposite[op]), signSet(s, simple(fs), opposite[op])],
            solution: t(
              `The leading coefficient $${a}$ is ${a > 0 ? "positive" : "negative"}, so $f$ is ${a > 0 ? "positive" : "negative"} at the right end. The sign changes at the roots of odd multiplicity (${odd.join(", ")})${even.length > 0 ? ` but not at those of even multiplicity (${even.join(", ")})` : ""}:${steps(signTable(s, sorted))}So $f(x) ${opLatex[op]} 0$ on $${intervalLatex(answer)}$.`,
              `首项系数 $${a}$ 为${a > 0 ? "正" : "负"}，所以 $f$ 在右端为${a > 0 ? "正" : "负"}。经过奇数重根（${odd.join("、")}）时变号${even.length > 0 ? `，经过偶数重根（${even.join("、")}）时不变号` : ""}：${steps(signTable(s, sorted))}所以 $f(x) ${opLatex[op]} 0$ 的解集是 $${intervalLatex(answer)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "a-polynomial-from-its-graph",
      title: t("The equation from the graph", "由图象求方程"),
      explanation: t(
        "To find a polynomial from its graph, read each $x$-intercept and its multiplicity from the shape there: crossing gives $1$, touching gives an even number, flattening while crossing gives an odd number of at least $3$. Choose the multiplicities so that they add up to the degree, then use a marked point to find $a$.\n\nA quartic whose graph touches the $x$-axis at $-1$ and crosses it at $1$ and $3$ is $f(x) = a(x + 1)^{2}(x - 1)(x - 3)$. Through $(0, -3)$:\n\n$$-3 = a(0 + 1)^{2}(0 - 1)(0 - 3) = 3a \\quad\\Rightarrow\\quad a = -1$$\n\nso $f(x) = -(x + 1)^{2}(x - 1)(x - 3)$.",
        "要由图象求多项式，先读出每个 $x$ 轴截距，并由图象在那里的形状读出重数：穿过为 $1$，相切为偶数，变平并穿过为至少 $3$ 的奇数。选取重数使它们的和等于次数，再用标出的点求 $a$。\n\n图象在 $-1$ 处与 $x$ 轴相切、在 $1$ 和 $3$ 处穿过的四次函数是 $f(x) = a(x + 1)^{2}(x - 1)(x - 3)$。经过 $(0, -3)$：\n\n$$-3 = a(0 + 1)^{2}(0 - 1)(0 - 3) = 3a \\quad\\Rightarrow\\quad a = -1$$\n\n所以 $f(x) = -(x + 1)^{2}(x - 1)(x - 3)$。",
      ),
      generate(rng) {
        const d = drawPolynomial(rng, () => generalRoots(rng));
        const degree = d.fs.reduce((s, [, m]) => s + m, 0);
        const words = rootWords(d.fs, true);
        const general = `a${polyLatex(Q.one, d.fs)}`;
        return {
          ...expressionProblem({
            prompt: t(
              `The graph of a polynomial function $f$ of degree $${degree}$ is shown. Its $x$-intercepts are at integers, and it passes through the marked point. Find $f(x)$.`,
              `如图是 $${degree}$ 次多项式函数 $f$ 的图象。它的 $x$ 轴截距都是整数，并且经过标出的点。求 $f(x)$。`,
            ),
            answer: polyLatex(d.a, d.fs),
            prefix: "f(x) =",
            wrong: equationWrongs(d, [polyLatex(d.a, simple(d.fs))]),
            solution: t(
              `The graph ${words.en}, which gives the multiplicities; they add up to $${degree}$. So $f(x) = ${general}$. Substitute the marked point $(${d.mark[0]}, ${d.mark[1]})$:${substitution(d)}So $f(x) = ${polyLatex(d.a, d.fs)}$.`,
              `图象${words.zh}，由此得到各根的重数，它们的和是 $${degree}$。所以 $f(x) = ${general}$。代入标出的点 $(${d.mark[0]}, ${d.mark[1]})$：${substitution(d)}所以 $f(x) = ${polyLatex(d.a, d.fs)}$。`,
            ),
          }),
          figure: drawnFigure(d),
        };
      },
    },
  ],
};

/** algebraIIPolynomialGraphsTopics lists the topics of Algebra II 2.8, Graphs of Polynomials, in outline order. */
export const algebraIIPolynomialGraphsTopics: readonly TopicDef[] = [
  graphingElementaryCubicFunctions,
  graphingCubicCurvesContainingThreeDistinctRealRoots,
  graphingCubicCurvesContainingADoubleRoot,
  graphingCubicCurvesContainingOneDistinctRealRoot,
  graphingGeneralPolynomials,
];
