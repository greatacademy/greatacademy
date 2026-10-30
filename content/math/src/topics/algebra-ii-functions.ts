import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
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
  union,
} from "@ga/subject-math";

import { choiceProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, yesNo } from "../problems.ts";

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
const shifted = (h: Coefficient, v = "x") => linear(1, toQ(h).neg(), v);

/** sqForm writes a(x - h)^2 + k. */
const sqForm = (a: Coefficient, h: Coefficient, k: Coefficient, v = "x") =>
  `${front(a)}${toQ(h).isZero() ? `${v}^{2}` : `(${shifted(h, v)})^{2}`}${plus(k)}`;

/** cubeForm writes a(x - h)^3 + k. */
const cubeForm = (a: Coefficient, h: Coefficient, k: Coefficient) =>
  `${front(a)}${toQ(h).isZero() ? "x^{3}" : `(${shifted(h)})^{3}`}${plus(k)}`;

/** absForm writes a|x - h| + k. */
const absForm = (a: Coefficient, h: Coefficient, k: Coefficient) => `${front(a)}|${shifted(h)}|${plus(k)}`;

/** sqrtForm writes a√(x - h) + k. */
const sqrtForm = (a: Coefficient, h: Coefficient, k: Coefficient) => `${front(a)}\\sqrt{${shifted(h)}}${plus(k)}`;

/** valueTable writes a table of values as display math. */
function valueTable(name: string, xs: readonly Coefficient[], ys: readonly Coefficient[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.map(num).join(" & ")} \\\\ \\hline ${name}(x) & ${ys.map(num).join(" & ")} \\end{array}$$`;
}

/** iv is the interval between lo and hi (infinite when undefined), closed at the ends as given. */
function iv(lo: Coefficient | undefined, hi: Coefficient | undefined, loClosed = true, hiClosed = true): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined && loClosed,
    hiClosed: hi !== undefined && hiClosed,
  };
}

const setText = (set: RealSet) => `$${intervalLatex(set)}$`;

/** ray is [v, ∞) when up, and (-∞, v] otherwise. */
const ray = (v: Coefficient, up: boolean, closed = true): RealSet => union(up ? iv(v, undefined, closed) : iv(undefined, v, true, closed));

/** randomSet draws an interval with integer ends, bounded or not, open or closed at each end. */
function randomSet(rng: Rng, lo = -9, hi = 9): RealSet {
  const a = rng.int(lo, hi - 3);
  const b = rng.int(a + 1, hi);
  const kind = rng.int(0, 5);
  if (kind === 0) return union(iv(a, undefined, rng.bool()));
  if (kind === 1) return union(iv(undefined, b, true, rng.bool()));
  return union(iv(a, b, rng.bool(0.7), rng.bool(0.7)));
}

// Graphs made of line segments.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** Curve is a graph made of line segments through its vertices, with a dot at each end. */
interface Curve {
  readonly name: string;
  readonly pts: readonly Point[];
  readonly dashed?: boolean;
  readonly openStart?: boolean;
  readonly openEnd?: boolean;
}

const pointText = ([x, y]: Point) => `(${x}, ${y})`;

function curveMarks(c: Curve, label: boolean): PlaneMark[] {
  const accent = c.dashed !== true;
  const marks: PlaneMark[] = [];
  for (let i = 0; i + 1 < c.pts.length; i++)
    marks.push({ kind: "segment", a: c.pts[i]!, b: c.pts[i + 1]!, accent, ...(c.dashed && { dashed: true }) });
  marks.push({ kind: "point", at: c.pts[0]!, open: c.openStart === true, accent });
  marks.push({ kind: "point", at: c.pts[c.pts.length - 1]!, open: c.openEnd === true, accent });
  if (label) marks.push({ kind: "label", at: c.pts[c.pts.length - 1]!, text: c.name, dir: "n" });
  return marks;
}

function curveAlt(c: Curve, many: boolean): Text {
  const ends = t(
    `It starts with ${c.openStart ? "an open" : "a filled"} dot and ends with ${c.openEnd ? "an open" : "a filled"} dot.`,
    `起点为${c.openStart ? "空心" : "实心"}点，终点为${c.openEnd ? "空心" : "实心"}点。`,
  );
  const style = many ? t(c.dashed ? "Dashed: " : "Solid: ", c.dashed ? "虚线：" : "实线：") : t("", "");
  return t(
    `${style.en}the graph of ${c.name}, line segments through ${c.pts.map(pointText).join(", ")}. ${ends.en}`,
    `${style["zh-CN"]}${c.name} 的图象，依次经过 ${c.pts.map(pointText).join("、")} 的折线，${ends["zh-CN"]}`,
  );
}

/** graphFigure draws one or more graphs made of line segments, labeled by name when there are several. */
function graphFigure(curves: readonly Curve[], extra: readonly PlaneMark[] = []): Figure {
  const many = curves.length > 1;
  const alts = curves.map((c) => curveAlt(c, many));
  return {
    svg: plane(view, [...curves.flatMap((c) => curveMarks(c, many)), ...extra]),
    alt: t(alts.map((a) => a.en.charAt(0).toUpperCase() + a.en.slice(1)).join(" "), alts.map((a) => a["zh-CN"]).join("")),
  };
}

/** distinctFrom draws an integer in [lo, hi] other than avoid. */
function distinctFrom(rng: Rng, lo: number, hi: number, avoid: number): number {
  const y = rng.int(lo, hi - 1);
  return y >= avoid ? y + 1 : y;
}

/** walkXs draws the x-coordinates of the vertices from x0 to x1: both ends and up to maxInterior points between. */
function walkXs(rng: Rng, x0: number, x1: number, maxInterior = 3): number[] {
  const inner = range(x0 + 1, x1 - 1);
  const k = Math.min(inner.length, rng.int(1, maxInterior));
  return [x0, ...rng.sample(inner, k).sort((a, b) => a - b), x1];
}

/** walk draws vertices from x0 to x1 with integer coordinates, y in [yMin, yMax], and no horizontal segment. */
function walk(rng: Rng, x0: number, x1: number, yMin = -5, yMax = 5, maxInterior = 3): Point[] {
  const xs = walkXs(rng, x0, x1, maxInterior);
  const pts: Point[] = [];
  let y = rng.int(yMin, yMax);
  for (const x of xs) {
    pts.push([x, y]);
    y = distinctFrom(rng, yMin, yMax, y);
  }
  return pts;
}

/** monoWalk draws the vertices of an increasing or decreasing graph from x0 to x1. */
function monoWalk(rng: Rng, x0: number, x1: number, yMin = -5, yMax = 5, maxInterior = 3): Point[] {
  const xs = walkXs(rng, x0, x1, Math.min(maxInterior, yMax - yMin - 1));
  const ys = rng.sample(range(yMin, yMax), xs.length).sort((a, b) => a - b);
  if (rng.bool()) ys.reverse();
  return xs.map((x, i): Point => [x, ys[i]!]);
}

/** turning lists the x-coordinates of the interior vertices where the graph turns down (maxima) or up (minima). */
function turning(pts: readonly Point[]): { maxXs: number[]; minXs: number[] } {
  const maxXs: number[] = [];
  const minXs: number[] = [];
  for (let i = 1; i + 1 < pts.length; i++) {
    const before = pts[i]![1] - pts[i - 1]![1];
    const after = pts[i + 1]![1] - pts[i]![1];
    if (before > 0 && after < 0) maxXs.push(pts[i]![0]);
    if (before < 0 && after > 0) minXs.push(pts[i]![0]);
  }
  return { maxXs, minXs };
}

/** valueOn is the y-value of a graph made of segments at x, if x is in its domain. */
function valueOn(pts: readonly Point[], x: number): Q | undefined {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    if (x >= x0 && x <= x1) return Q.of(y0).add(Q.of((y1 - y0) * (x - x0), x1 - x0));
  }
  return undefined;
}

/** isMonotone tells whether a graph made of segments is increasing or decreasing throughout. */
const isMonotone = (pts: readonly Point[]) => {
  const { maxXs, minXs } = turning(pts);
  return maxXs.length === 0 && minXs.length === 0;
};

const graphShown = t("The graph of $f$ is shown.", "下图是 $f$ 的图象。");

// Topic: local extrema.

const extremumOptions: readonly Text[] = [
  t("A local maximum, but not the global maximum", "极大值点，但不是最大值点"),
  t("Both a local maximum and the global maximum", "既是极大值点，也是最大值点"),
  t("A local minimum, but not the global minimum", "极小值点，但不是最小值点"),
  t("Both a local minimum and the global minimum", "既是极小值点，也是最小值点"),
];

const kindOptions: readonly Text[] = [t("A local maximum", "极大值"), t("A local minimum", "极小值"), t("Neither", "都不是")];

/** localExtrema finds local maxima and minima on graphs and from intervals of increase and decrease. */
export const localExtrema: TopicDef = {
  id: "local-extrema",
  title: t("Local Extrema of Functions", "函数的极值"),
  summary: t(
    "Find local maxima and minima: points of a graph higher or lower than every nearby point.",
    "求函数的极大值与极小值：图象上比附近所有点都高或都低的点。",
  ),
  prerequisites: ["global-extrema", "increasing-and-decreasing"],
  encompasses: [
    { topic: "global-extrema", weight: 0.4 },
    { topic: "increasing-and-decreasing", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "local-extrema-from-a-graph",
      title: t("Local extrema on a graph", "图象上的极值"),
      explanation: t(
        "A function $f$ has a **local maximum** at $x = c$ if $f(c)$ is at least as large as every value of $f$ at inputs close to $c$, on both sides. On a graph it is the top of a hill. A **local minimum** is the bottom of a valley.\n\nThe value $f(c)$ is the local maximum (or minimum) **value**; $x = c$ is where it occurs. In this course an endpoint of the domain is never a local extremum, because the graph does not continue on both sides of it.\n\nA graph rising to $(-1, 4)$, falling to $(2, -3)$ and then rising again has a local maximum at $x = -1$ and a local minimum at $x = 2$.",
        '如果在 $c$ 附近（两侧）的所有输入处，$f$ 的值都不超过 $f(c)$，就说 $f$ 在 $x = c$ 处取得**极大值**。在图象上，它是"山顶"。**极小值**则是"谷底"。\n\n$f(c)$ 是极大（小）**值**，$x = c$ 是取得它的位置（极大值点、极小值点）。本课程中，定义域的端点不算极值点，因为图象没有在它的两侧延伸。\n\n一个图象上升到 $(-1, 4)$，下降到 $(2, -3)$，再上升，则它在 $x = -1$ 处取得极大值，在 $x = 2$ 处取得极小值。',
      ),
      generate(rng) {
        let pts: Point[];
        let found: { maxXs: number[]; minXs: number[] };
        do {
          pts = walk(rng, rng.int(-6, -4), rng.int(4, 6), -5, 5, 5);
          found = turning(pts);
        } while (found.maxXs.length === 0 || found.minXs.length === 0);
        const wantMax = rng.bool();
        const answer = wantMax ? found.maxXs : found.minXs;
        const other = wantMax ? found.minXs : found.maxXs;
        const ends = [pts[0]!, pts[pts.length - 1]!];
        const extremeEnds = ends.filter(([, y]) => pts.every(([, w]) => (wantMax ? w <= y : w >= y))).map(([x]) => x);
        const ys = answer.map((x) => pts.find((p) => p[0] === x)![1]);
        const kind = wantMax ? t("maximum", "极大值") : t("minimum", "极小值");
        return {
          ...solutionsProblem({
            prompt: t(
              `${graphShown.en} Find every $x$-value at which $f$ has a local ${kind.en}. Enter them separated by commas.`,
              `${graphShown["zh-CN"]}求 $f$ 取得${kind["zh-CN"]}的所有 $x$ 值，用逗号分隔。`,
            ),
            values: answer.map(String),
            wrong: [other.map(String), [...answer, ...extremeEnds].map(String), ys.map(String)],
            solution: t(
              `The graph turns ${wantMax ? "from rising to falling" : "from falling to rising"} at $x = ${answer.join(", ")}$. The endpoints do not count. So the local ${wantMax ? "maxima" : "minima"} occur at $x = ${answer.join(", ")}$.`,
              `图象在 $x = ${answer.join(", ")}$ 处${wantMax ? "由上升转为下降" : "由下降转为上升"}，端点不算。所以 $f$ 在 $x = ${answer.join(", ")}$ 处取得${kind["zh-CN"]}。`,
            ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "local-and-global-extrema",
      title: t("Local and global extrema", "极值与最值"),
      explanation: t(
        "The **global** maximum is the largest value of $f$ on its whole domain; a **local** maximum only has to beat the values nearby. A hilltop that is also the highest point of the graph is both. A lower hilltop is only a local maximum.\n\nLikewise a valley floor is a local minimum, and it is also the global minimum when no point of the graph, including the endpoints, is lower.",
        "**最大值**是 $f$ 在整个定义域上最大的值；**极大值**只需要比附近的值大。一个山顶如果也是整个图象的最高点，那它既是极大值点也是最大值点；较低的山顶只是极大值点。\n\n同样，谷底是极小值点；如果图象上（包括端点）没有更低的点，它也是最小值点。",
      ),
      generate(rng) {
        let pts: Point[];
        let found: { maxXs: number[]; minXs: number[] };
        do {
          pts = walk(rng, rng.int(-6, -4), rng.int(4, 6), -5, 5, 5);
          found = turning(pts);
        } while (found.maxXs.length + found.minXs.length < 2);
        const isMax = found.minXs.length === 0 || (found.maxXs.length > 0 && rng.bool());
        const c = rng.pick(isMax ? found.maxXs : found.minXs);
        const y = pts.find((p) => p[0] === c)![1];
        const ys = pts.map((p) => p[1]);
        const global = isMax ? y === Math.max(...ys) : y === Math.min(...ys);
        const correct = (isMax ? 0 : 2) + (global ? 1 : 0);
        const extremeY = isMax ? Math.max(...ys) : Math.min(...ys);
        return {
          ...choiceProblem({
            prompt: t(`${graphShown.en} Which describes the point $${pt(c, y)}$?`, `${graphShown["zh-CN"]}哪一项描述了点 $${pt(c, y)}$？`),
            options: extremumOptions,
            correct,
            solution: t(
              `The graph ${isMax ? "rises to" : "falls to"} $${pt(c, y)}$ and then ${isMax ? "falls" : "rises"}, so it is a local ${isMax ? "maximum" : "minimum"}. The ${isMax ? "largest" : "smallest"} value of $f$ on the whole graph is $${extremeY}$, so it ${global ? "is" : "is not"} the global ${isMax ? "maximum" : "minimum"}.`,
              `图象${isMax ? "上升到" : "下降到"} $${pt(c, y)}$ 后${isMax ? "下降" : "上升"}，所以它是极${isMax ? "大" : "小"}值点。整个图象上 $f$ 的${isMax ? "最大" : "最小"}值是 $${extremeY}$，所以它${global ? "也是" : "不是"}最${isMax ? "大" : "小"}值点。`,
            ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "extrema-from-increasing-and-decreasing",
      title: t("Extrema from increasing and decreasing", "由增减性判断极值"),
      explanation: t(
        "Where a continuous function changes from **increasing to decreasing**, it has a local maximum; where it changes from **decreasing to increasing**, it has a local minimum. If it increases (or decreases) on both sides of a point, there is no extremum there.\n\nIf $f$ is increasing on $(-\\infty, 1)$, decreasing on $(1, 4)$ and increasing on $(4, \\infty)$, it has a local maximum at $x = 1$ and a local minimum at $x = 4$.",
        "连续函数由**增变减**的地方取得极大值，由**减变增**的地方取得极小值。如果在某点两侧都递增（或都递减），该点就不是极值点。\n\n若 $f$ 在 $(-\\infty, 1)$ 上递增，在 $(1, 4)$ 上递减，在 $(4, \\infty)$ 上递增，则 $f$ 在 $x = 1$ 处取得极大值，在 $x = 4$ 处取得极小值。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const bs = rng.sample(range(-9, 9), n).sort((a, b) => a - b);
        const dirs: number[] = [rng.sign()];
        for (let i = 1; i <= n; i++) dirs.push(rng.bool(0.8) ? -dirs[i - 1]! : dirs[i - 1]!);
        const i = rng.int(0, n - 1);
        const before = dirs[i]!;
        const after = dirs[i + 1]!;
        const correct = before === after ? 2 : before > 0 ? 0 : 1;
        const ends = [undefined, ...bs, undefined];
        const parts = dirs.map((d, j) => {
          const set = intervalLatex([iv(ends[j], ends[j + 1], false, false)]);
          return { en: `${d > 0 ? "increasing" : "decreasing"} on $${set}$`, zh: `在 $${set}$ 上${d > 0 ? "递增" : "递减"}` };
        });
        const enList = `${parts
          .slice(0, -1)
          .map((p) => p.en)
          .join(", ")} and ${parts[parts.length - 1]!.en}`;
        const word = (d: number) => t(d > 0 ? "increasing" : "decreasing", d > 0 ? "递增" : "递减");
        return choiceProblem({
          prompt: t(
            `The continuous function $f$ is ${enList}. What does $f$ have at $x = ${bs[i]}$?`,
            `连续函数 $f$ ${parts.map((p) => p.zh).join("，")}。$f$ 在 $x = ${bs[i]}$ 处取得什么？`,
          ),
          options: kindOptions,
          correct,
          solution: t(
            `Just left of $x = ${bs[i]}$, $f$ is ${word(before).en}; just right of it, $f$ is ${word(after).en}. ${correct === 0 ? "Rising then falling gives a local maximum." : correct === 1 ? "Falling then rising gives a local minimum." : "It does not change direction, so there is no extremum there."}`,
            `在 $x = ${bs[i]}$ 左侧附近 $f$ ${word(before)["zh-CN"]}，右侧附近 $f$ ${word(after)["zh-CN"]}。${correct === 0 ? "先增后减，取得极大值。" : correct === 1 ? "先减后增，取得极小值。" : "增减性没有改变，所以那里不是极值点。"}`,
          ),
        });
      },
    },
  ],
};

// Topic: one-to-one functions.

/** OneToOneCase is a formula with whether its function is one-to-one, and two inputs with equal outputs when it is not. */
interface OneToOneCase {
  readonly latex: string;
  readonly yes: boolean;
  readonly reason: Text;
}

function oneToOneCase(rng: Rng): OneToOneCase {
  const h = rng.nonZero(-6, 6);
  const k = rng.int(-9, 9);
  const a = rng.sign() * rng.int(1, 3);
  const same = (latex: string, f: (x: number) => number): OneToOneCase => {
    const v = f(h + 1);
    return {
      latex,
      yes: false,
      reason: t(
        `Two different inputs give the same output: $f(${h - 1}) = f(${h + 1}) = ${v}$. So $f$ is not one-to-one.`,
        `两个不同的输入给出相同的输出：$f(${h - 1}) = f(${h + 1}) = ${v}$。所以 $f$ 不是一一对应的。`,
      ),
    };
  };
  const yes = (latex: string, en: string, zh: string): OneToOneCase => ({ latex, yes: true, reason: t(en, zh) });
  switch (rng.int(0, 6)) {
    case 0:
      return yes(
        linear(a, k),
        "Its graph is a line that is not horizontal, so every horizontal line meets it once: $f$ is one-to-one.",
        "它的图象是一条不水平的直线，每条水平线都与它恰好交于一点：$f$ 是一一对应的。",
      );
    case 1:
      return same(sqForm(a, h, k), (x) => a * (x - h) ** 2 + k);
    case 2:
      return yes(
        cubeForm(a, h, k),
        "The cube $(x - h)^{3}$ takes every value exactly once, so $f$ always increases or always decreases: it is one-to-one.",
        "立方 $(x - h)^{3}$ 的每个值只取一次，所以 $f$ 始终递增或始终递减：它是一一对应的。",
      );
    case 3:
      return same(absForm(a, h, k), (x) => a * Math.abs(x - h) + k);
    case 4:
      return yes(
        sqrtForm(a, h, k),
        "A square root always increases on its domain, and the factor and the constant keep it always increasing or always decreasing: $f$ is one-to-one.",
        "平方根在定义域上始终递增，系数和常数不会改变它始终递增或始终递减的性质：$f$ 是一一对应的。",
      );
    case 5:
      return yes(
        `${sqForm(1, h, k)}, \\; x \\ge ${h}`,
        `On $x \\ge ${h}$ only the right half of the parabola remains, which always increases: $f$ is one-to-one.`,
        `在 $x \\ge ${h}$ 上只剩下抛物线的右半支，它始终递增：$f$ 是一一对应的。`,
      );
    default: {
      const lo = h - rng.int(1, 4);
      return same(`${sqForm(1, h, k)}, \\; x \\ge ${lo}`, (x) => (x - h) ** 2 + k);
    }
  }
}

/** oneToOneFunctions decides whether functions are one-to-one from tables, graphs and formulas. */
export const oneToOneFunctions: TopicDef = {
  id: "one-to-one-functions",
  title: t("One-to-One Functions", "一一对应的函数"),
  summary: t(
    "Decide whether different inputs always give different outputs, from tables, with the horizontal line test, and from formulas.",
    "判断不同的输入是否总有不同的输出：从数值表、用水平线检验、从解析式判断。",
  ),
  prerequisites: ["vertical-line-test", "absolute-value-graphs", "graphing-elementary-quadratic-functions"],
  encompasses: [{ topic: "vertical-line-test", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.4.D"],
  knowledgePoints: [
    {
      id: "one-to-one-from-a-table",
      title: t("One-to-one from a table", "从数值表判断"),
      explanation: t(
        "A function is **one-to-one** if different inputs always give different outputs: no output is used twice.\n\nIn a table, look along the output row. If some output appears twice, the function is not one-to-one. The table $x: 1, 2, 3$ with $f(x): 5, 7, 5$ is not one-to-one, since $f(1) = f(3) = 5$.",
        "如果不同的输入总给出不同的输出（没有哪个输出被用了两次），就说这个函数是**一一对应的**。\n\n在数值表中，看输出那一行。如果某个输出出现两次，函数就不是一一对应的。$x: 1, 2, 3$、$f(x): 5, 7, 5$ 的表不是一一对应的，因为 $f(1) = f(3) = 5$。",
      ),
      generate(rng) {
        const xs = rng.sample(range(-6, 8), 5).sort((a, b) => a - b);
        const ys = rng.sample(range(-9, 12), 5);
        const repeat = rng.bool();
        let i = 0;
        let j = 0;
        if (repeat) {
          [i, j] = rng.sample([0, 1, 2, 3, 4], 2).sort() as [number, number];
          ys[j] = ys[i]!;
        }
        return choiceProblem({
          prompt: t(
            `The table shows the function $f$.${valueTable("f", xs, ys)}Is $f$ one-to-one?`,
            `下表给出了函数 $f$。${valueTable("f", xs, ys)}$f$ 是一一对应的吗？`,
          ),
          options: yesNo,
          correct: repeat ? 1 : 0,
          solution: repeat
            ? t(
                `The output $${ys[i]}$ appears twice: $f(${xs[i]}) = f(${xs[j]}) = ${ys[i]}$. So $f$ is not one-to-one.`,
                `输出 $${ys[i]}$ 出现了两次：$f(${xs[i]}) = f(${xs[j]}) = ${ys[i]}$。所以 $f$ 不是一一对应的。`,
              )
            : t("The five outputs are all different, so $f$ is one-to-one.", "五个输出各不相同，所以 $f$ 是一一对应的。"),
        });
      },
    },
    {
      id: "the-horizontal-line-test",
      title: t("The horizontal line test", "水平线检验"),
      explanation: t(
        "Two inputs with the same output are two points of the graph at the same height. So a function is one-to-one exactly when **no horizontal line meets its graph more than once**: the **horizontal line test**.\n\nA graph that always rises (or always falls) passes the test. A graph that rises and then falls fails it: a horizontal line just below the top meets it twice.",
        "两个输入有相同的输出，就是图象上两个高度相同的点。所以函数是一一对应的，当且仅当**任何水平线与图象的交点都不超过一个**：这就是**水平线检验**。\n\n始终上升（或始终下降）的图象通过检验。先升后降的图象不能通过：略低于顶点的水平线与它交于两点。",
      ),
      generate(rng) {
        const yes = rng.bool();
        let pts: Point[];
        do {
          pts = yes ? monoWalk(rng, rng.int(-6, -3), rng.int(3, 6), -5, 5, 4) : walk(rng, rng.int(-6, -3), rng.int(3, 6), -5, 5, 4);
        } while (isMonotone(pts) !== yes);
        const { maxXs, minXs } = turning(pts);
        const turn = [...maxXs, ...minXs].sort((a, b) => a - b)[0]!;
        return {
          ...choiceProblem({
            prompt: t(`${graphShown.en} Is $f$ one-to-one?`, `${graphShown["zh-CN"]}$f$ 是一一对应的吗？`),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: yes
              ? t(
                  `The graph ${pts[0]![1] < pts[1]![1] ? "rises" : "falls"} all the way, so every horizontal line meets it at most once. $f$ is one-to-one.`,
                  `图象一直${pts[0]![1] < pts[1]![1] ? "上升" : "下降"}，所以每条水平线与它至多交于一点。$f$ 是一一对应的。`,
                )
              : t(
                  `The graph turns around at $x = ${turn}$, so a horizontal line slightly ${maxXs.includes(turn) ? "below" : "above"} that point meets it twice. $f$ is not one-to-one.`,
                  `图象在 $x = ${turn}$ 处转向，所以略${maxXs.includes(turn) ? "低于" : "高于"}该点的水平线与图象交于两点。$f$ 不是一一对应的。`,
                ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "one-to-one-from-a-formula",
      title: t("One-to-one from a formula", "从解析式判断"),
      explanation: t(
        "Picture the graph. Lines that are not horizontal, cubes $a(x - h)^{3} + k$ and square roots $a\\sqrt{x - h} + k$ always rise or always fall, so they are one-to-one.\n\nParabolas $a(x - h)^{2} + k$ and V shapes $a|x - h| + k$ are symmetric about $x = h$, so $f(h - 1) = f(h + 1)$: they are not one-to-one, unless the domain is cut down to one side of $x = h$.",
        "想象图象。不水平的直线、立方函数 $a(x - h)^{3} + k$ 和平方根函数 $a\\sqrt{x - h} + k$ 始终上升或始终下降，所以是一一对应的。\n\n抛物线 $a(x - h)^{2} + k$ 和 V 形 $a|x - h| + k$ 关于 $x = h$ 对称，所以 $f(h - 1) = f(h + 1)$：它们不是一一对应的，除非把定义域限制在 $x = h$ 的一侧。",
      ),
      generate(rng) {
        const c = oneToOneCase(rng);
        return choiceProblem({
          prompt: t(`Is $f(x) = ${c.latex}$ one-to-one?`, `$f(x) = ${c.latex}$ 是一一对应的吗？`),
          options: yesNo,
          correct: c.yes ? 0 : 1,
          solution: c.reason,
        });
      },
    },
    {
      id: "inputs-with-equal-outputs",
      title: t("Inputs with equal outputs", "输出相同的输入"),
      explanation: t(
        "The graphs of $a(x - h)^{2} + k$ and $a|x - h| + k$ are symmetric about the line $x = h$. An input $c$ and its mirror image $2h - c$, the same distance from $h$ on the other side, give the same output.\n\nFor $f(x) = (x - 3)^{2} + 1$: $f(1) = f(5) = 5$, since $1$ and $5$ are both $2$ away from $3$.",
        "$a(x - h)^{2} + k$ 与 $a|x - h| + k$ 的图象关于直线 $x = h$ 对称。输入 $c$ 和它的对称点 $2h - c$（在 $h$ 另一侧、与 $h$ 距离相同）给出相同的输出。\n\n对于 $f(x) = (x - 3)^{2} + 1$：$f(1) = f(5) = 5$，因为 $1$ 和 $5$ 到 $3$ 的距离都是 $2$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const c = distinctFrom(rng, -9, 9, h);
        const a = rng.sign() * rng.int(1, 3);
        const k = rng.int(-9, 9);
        const square = rng.bool();
        const latex = square ? sqForm(a, h, k) : absForm(a, h, k);
        const v = square ? a * (c - h) ** 2 + k : a * Math.abs(c - h) + k;
        return numberProblem({
          prompt: t(
            `For $f(x) = ${latex}$, there is a number $d \\ne ${c}$ with $f(d) = f(${c})$. Find $d$.`,
            `对于 $f(x) = ${latex}$，存在数 $d \\ne ${c}$ 使 $f(d) = f(${c})$。求 $d$。`,
          ),
          answer: 2 * h - c,
          wrong: [-c, c - 2 * h, h - c, 2 * c - h],
          solution: t(
            `The graph is symmetric about $x = ${h}$. The input $${c}$ is $${Math.abs(c - h)}$ ${c < h ? "left" : "right"} of $${h}$, so its mirror image is $${Math.abs(c - h)}$ ${c < h ? "right" : "left"} of it: $d = ${2 * h - c}$. Check: $f(${2 * h - c}) = f(${c}) = ${v}$.`,
            `图象关于 $x = ${h}$ 对称。输入 $${c}$ 在 $${h}$ 的${c < h ? "左" : "右"}边 $${Math.abs(c - h)}$ 个单位，它的对称点在 $${h}$ 的${c < h ? "右" : "左"}边 $${Math.abs(c - h)}$ 个单位：$d = ${2 * h - c}$。检验：$f(${2 * h - c}) = f(${c}) = ${v}$。`,
          ),
        });
      },
    },
  ],
};

// Topic: graphs of inverse functions.

const slopes: readonly Q[] = [2, 3, 4, -2, -3, -4]
  .map((n) => Q.of(n))
  .concat([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(-1, 3), Q.of(3, 2), Q.of(-2, 3)]);

/** graphsOfInverseFunctions reflects graphs in the line y = x. */
export const graphsOfInverseFunctions: TopicDef = {
  id: "graphs-of-inverse-functions",
  title: t("Graphs of Inverse Functions", "反函数的图象"),
  summary: t(
    "Swap the coordinates of points to get the graph of the inverse: the reflection of the graph in the line y = x.",
    "交换点的坐标得到反函数的图象：原图象关于直线 y = x 的对称图形。",
  ),
  prerequisites: ["introduction-to-inverse-functions", "one-to-one-functions", "slope-intercept-form"],
  encompasses: [
    { topic: "introduction-to-inverse-functions", weight: 0.4 },
    { topic: "one-to-one-functions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.4.C"],
  knowledgePoints: [
    {
      id: "points-on-the-inverse",
      title: t("Points on the inverse", "反函数图象上的点"),
      explanation: t(
        "If $f(a) = b$, then $f^{-1}(b) = a$. So the point $(a, b)$ is on the graph of $f$ exactly when $(b, a)$ is on the graph of $f^{-1}$: **swap the coordinates**.\n\nIf $(2, 7)$ is on the graph of $f$, then $(7, 2)$ is on the graph of $f^{-1}$.",
        "若 $f(a) = b$，则 $f^{-1}(b) = a$。所以点 $(a, b)$ 在 $f$ 的图象上，当且仅当 $(b, a)$ 在 $f^{-1}$ 的图象上：**交换坐标**。\n\n若 $(2, 7)$ 在 $f$ 的图象上，则 $(7, 2)$ 在 $f^{-1}$ 的图象上。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = distinctFrom(rng, -9, 9, a);
        const toInverse = rng.bool(0.7);
        const [from, to] = toInverse ? ["f", "f^{-1}"] : ["f^{-1}", "f"];
        return pointProblem({
          prompt: t(
            `The invertible function $f$ has inverse $f^{-1}$. The point $${pt(a, b)}$ is on the graph of $${from}$. Which point must be on the graph of $${to}$?`,
            `可逆函数 $f$ 的反函数是 $f^{-1}$。点 $${pt(a, b)}$ 在 $${from}$ 的图象上。哪个点一定在 $${to}$ 的图象上？`,
          ),
          answer: [b, a],
          wrong: [
            [a, b],
            [-a, -b],
            [-b, -a],
            [b, -a],
          ],
          solution: t(
            `Swap the coordinates: $${pt(a, b)}$ on $${from}$ gives $${pt(b, a)}$ on $${to}$.`,
            `交换坐标：$${from}$ 上的 $${pt(a, b)}$ 对应 $${to}$ 上的 $${pt(b, a)}$。`,
          ),
        });
      },
    },
    {
      id: "inverse-values-from-a-graph",
      title: t("Inverse values from a graph", "从图象读反函数值"),
      explanation: t(
        "To find $f^{-1}(b)$ from the graph of $f$, look for the point of the graph at **height** $b$ and read its $x$-coordinate. Do not read $f(b)$: that is the height above $x = b$.\n\nIf the graph passes through $(-2, 3)$, then $f^{-1}(3) = -2$.",
        "从 $f$ 的图象求 $f^{-1}(b)$：找到图象上**高度**为 $b$ 的点，读出它的横坐标。不要读 $f(b)$：那是 $x = b$ 上方的高度。\n\n若图象经过 $(-2, 3)$，则 $f^{-1}(3) = -2$。",
      ),
      generate(rng) {
        const pts = monoWalk(rng, rng.int(-6, -4), rng.int(4, 6), -5, 5, 4);
        const [x, y] = rng.pick(pts);
        const fy = valueOn(pts, y);
        return {
          ...numberProblem({
            prompt: t(
              `${graphShown.en} The function $f$ is one-to-one. Find $f^{-1}(${y})$.`,
              `${graphShown["zh-CN"]}$f$ 是一一对应的。求 $f^{-1}(${y})$。`,
            ),
            answer: x,
            wrong: [...(fy ? [fy] : []), y, -x],
            solution: t(
              `The graph is at height $${y}$ at the point $${pt(x, y)}$, so $f(${x}) = ${y}$ and $f^{-1}(${y}) = ${x}$.`,
              `图象在点 $${pt(x, y)}$ 处高度为 $${y}$，所以 $f(${x}) = ${y}$，$f^{-1}(${y}) = ${x}$。`,
            ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "inverses-of-lines",
      title: t("Inverses of lines", "直线的反函数"),
      explanation: t(
        "Swapping coordinates reflects the graph in the line $y = x$. A line with slope $m \\ne 0$ becomes a line with slope $\\frac{1}{m}$, since rise and run swap. Its $y$-intercept $(0, b)$ becomes the $x$-intercept $(b, 0)$ of the inverse.\n\nFor $f(x) = 2x + 6$: the graph of $f^{-1}$ has slope $\\frac{1}{2}$, $x$-intercept $6$, and $y$-intercept $-3$ (the swap of the $x$-intercept $(-3, 0)$ of $f$).",
        "交换坐标就是把图象关于直线 $y = x$ 对称。斜率为 $m \\ne 0$ 的直线变成斜率为 $\\frac{1}{m}$ 的直线，因为竖直变化量与水平变化量互换了。它的 $y$ 轴截距点 $(0, b)$ 变成反函数的 $x$ 轴截距点 $(b, 0)$。\n\n对于 $f(x) = 2x + 6$：$f^{-1}$ 的图象斜率为 $\\frac{1}{2}$，$x$ 轴截距为 $6$，$y$ 轴截距为 $-3$（由 $f$ 的 $x$ 轴截距点 $(-3, 0)$ 交换坐标得到）。",
      ),
      generate(rng) {
        const m = rng.pick(slopes);
        const b = rng.nonZero(-9, 9);
        const ask = rng.int(0, 2);
        const fLatex = poly([m, "x"], [b, ""]);
        const xInt = Q.of(-b).div(m);
        const answer = [Q.one.div(m), xInt, Q.of(b)][ask]!;
        const what = [t("the slope", "斜率"), t("the $y$-intercept", "$y$ 轴截距"), t("the $x$-intercept", "$x$ 轴截距")][ask]!;
        return numberProblem({
          prompt: t(
            `Find ${what.en} of the graph of $f^{-1}$, where $f(x) = ${fLatex}$.`,
            `设 $f(x) = ${fLatex}$。求 $f^{-1}$ 的图象的${what["zh-CN"]}。`,
          ),
          answer,
          wrong: [m, Q.one.div(m).neg(), m.neg(), Q.of(b), xInt, Q.of(-b)],
          solution: [
            t(
              `The graph of $f$ has slope $${num(m)}$. Reflecting in $y = x$ swaps rise and run, so the slope of $f^{-1}$ is $\\frac{1}{${num(m)}} = ${num(answer)}$.`,
              `$f$ 的图象斜率为 $${num(m)}$。关于 $y = x$ 对称后竖直与水平变化量互换，所以 $f^{-1}$ 的斜率是 $\\frac{1}{${num(m)}} = ${num(answer)}$。`,
            ),
            t(
              `The $y$-intercept of $f^{-1}$ comes from the $x$-intercept of $f$: $${fLatex} = 0$ gives $x = ${num(xInt)}$, so $f^{-1}$ has $y$-intercept $${num(xInt)}$.`,
              `$f^{-1}$ 的 $y$ 轴截距来自 $f$ 的 $x$ 轴截距：由 $${fLatex} = 0$ 得 $x = ${num(xInt)}$，所以 $f^{-1}$ 的 $y$ 轴截距为 $${num(xInt)}$。`,
            ),
            t(
              `The $y$-intercept of $f$ is $(0, ${b})$; swapping gives $(${b}, 0)$ on $f^{-1}$, so its $x$-intercept is $${b}$.`,
              `$f$ 的 $y$ 轴截距点是 $(0, ${b})$；交换坐标得到 $f^{-1}$ 上的 $(${b}, 0)$，所以它的 $x$ 轴截距为 $${b}$。`,
            ),
          ][ask]!,
        });
      },
    },
  ],
};

// Topic: domain and range of inverse functions.

/** domainAndRangeOfInverseFunctions swaps the domain and range of a function to get those of its inverse. */
export const domainAndRangeOfInverseFunctions: TopicDef = {
  id: "domain-and-range-of-inverse-functions",
  title: t("Domain and Range of Inverse Functions", "反函数的定义域与值域"),
  summary: t(
    "The domain of the inverse is the range of the function, and its range is the domain of the function.",
    "反函数的定义域是原函数的值域，反函数的值域是原函数的定义域。",
  ),
  prerequisites: ["graphs-of-inverse-functions", "range-advanced-cases"],
  encompasses: [
    { topic: "graphs-of-inverse-functions", weight: 0.3 },
    { topic: "range-of-a-function", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.4.C"],
  knowledgePoints: [
    {
      id: "swapping-domain-and-range",
      title: t("Swapping domain and range", "定义域与值域互换"),
      explanation: t(
        "The inverse swaps inputs and outputs. So\n\n- the **domain** of $f^{-1}$ is the **range** of $f$;\n- the **range** of $f^{-1}$ is the **domain** of $f$.\n\nIf $f$ has domain $[0, 4]$ and range $[-3, 5)$, then $f^{-1}$ has domain $[-3, 5)$ and range $[0, 4]$.",
        "反函数交换输入与输出。所以\n\n- $f^{-1}$ 的**定义域**是 $f$ 的**值域**；\n- $f^{-1}$ 的**值域**是 $f$ 的**定义域**。\n\n若 $f$ 的定义域为 $[0, 4]$，值域为 $[-3, 5)$，则 $f^{-1}$ 的定义域为 $[-3, 5)$，值域为 $[0, 4]$。",
      ),
      generate(rng) {
        const dom = randomSet(rng);
        let ran: RealSet;
        do ran = randomSet(rng);
        while (intervalLatex(ran) === intervalLatex(dom));
        const askDomain = rng.bool();
        return intervalProblem({
          prompt: t(
            `The one-to-one function $f$ has domain ${setText(dom)} and range ${setText(ran)}. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$.`,
            `一一对应的函数 $f$ 的定义域为 ${setText(dom)}，值域为 ${setText(ran)}。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。`,
          ),
          set: askDomain ? ran : dom,
          wrong: [askDomain ? dom : ran],
          solution: t(
            `The ${askDomain ? "domain" : "range"} of $f^{-1}$ is the ${askDomain ? "range" : "domain"} of $f$: ${setText(askDomain ? ran : dom)}.`,
            `$f^{-1}$ 的${askDomain ? "定义域" : "值域"}是 $f$ 的${askDomain ? "值域" : "定义域"}：${setText(askDomain ? ran : dom)}。`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-from-a-graph",
      title: t("From a graph", "从图象求"),
      explanation: t(
        "Read the domain and range of $f$ from its graph, then swap them. An open dot leaves its coordinate out.\n\nIf the graph of $f$ runs from a filled dot at $(-4, 5)$ down to an open dot at $(3, -1)$, then $f$ has domain $[-4, 3)$ and range $(-1, 5]$, so $f^{-1}$ has domain $(-1, 5]$ and range $[-4, 3)$.",
        "从图象读出 $f$ 的定义域与值域，再互换。空心点处的坐标不包含在内。\n\n若 $f$ 的图象从实心点 $(-4, 5)$ 下降到空心点 $(3, -1)$，则 $f$ 的定义域为 $[-4, 3)$，值域为 $(-1, 5]$，所以 $f^{-1}$ 的定义域为 $(-1, 5]$，值域为 $[-4, 3)$。",
      ),
      generate(rng) {
        const pts = monoWalk(rng, rng.int(-6, -2), rng.int(1, 6), -5, 5, 3);
        const openStart = rng.bool(0.4);
        const openEnd = rng.bool(0.4);
        const [x0, y0] = pts[0]!;
        const [x1, y1] = pts[pts.length - 1]!;
        const dom = union(iv(x0, x1, !openStart, !openEnd));
        const ran = y0 < y1 ? union(iv(y0, y1, !openStart, !openEnd)) : union(iv(y1, y0, !openEnd, !openStart));
        const askDomain = rng.bool();
        return {
          ...intervalProblem({
            prompt: t(
              `${graphShown.en} Find the ${askDomain ? "domain" : "range"} of $f^{-1}$.`,
              `${graphShown["zh-CN"]}求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。`,
            ),
            set: askDomain ? ran : dom,
            wrong: [askDomain ? dom : ran, askDomain ? union(iv(ran[0]!.lo, ran[0]!.hi)) : union(iv(x0, x1))],
            solution: t(
              `From the graph, $f$ has domain ${setText(dom)} and range ${setText(ran)}. Swapping them, the ${askDomain ? "domain" : "range"} of $f^{-1}$ is ${setText(askDomain ? ran : dom)}.`,
              `由图象，$f$ 的定义域为 ${setText(dom)}，值域为 ${setText(ran)}。互换后，$f^{-1}$ 的${askDomain ? "定义域" : "值域"}为 ${setText(askDomain ? ran : dom)}。`,
            ),
          }),
          figure: graphFigure([{ name: "f", pts, openStart, openEnd }]),
        };
      },
    },
    {
      id: "domain-and-range-from-a-formula",
      title: t("From a formula", "从解析式求"),
      explanation: t(
        "For $f(x) = a\\sqrt{x - h} + k$: the square root needs $x \\ge h$, so the domain is $[h, \\infty)$. The root takes every value $\\ge 0$, so the range is $[k, \\infty)$ when $a > 0$ and $(-\\infty, k]$ when $a < 0$.\n\nFor $f(x) = -2\\sqrt{x + 1} + 3$: domain $[-1, \\infty)$, range $(-\\infty, 3]$. So $f^{-1}$ has domain $(-\\infty, 3]$ and range $[-1, \\infty)$.",
        "对于 $f(x) = a\\sqrt{x - h} + k$：平方根要求 $x \\ge h$，所以定义域为 $[h, \\infty)$。根式取遍所有 $\\ge 0$ 的值，所以 $a > 0$ 时值域为 $[k, \\infty)$，$a < 0$ 时值域为 $(-\\infty, k]$。\n\n对于 $f(x) = -2\\sqrt{x + 1} + 3$：定义域 $[-1, \\infty)$，值域 $(-\\infty, 3]$。所以 $f^{-1}$ 的定义域为 $(-\\infty, 3]$，值域为 $[-1, \\infty)$。",
      ),
      keyPrerequisites: ["range-advanced-cases"],
      generate(rng) {
        const a = rng.sign() * rng.int(1, 4);
        const h = rng.nonZero(-9, 9);
        const k = distinctFrom(rng, -9, 9, h);
        const dom = ray(h, true);
        const ran = ray(k, a > 0);
        const askDomain = rng.bool();
        return intervalProblem({
          prompt: t(
            `Find the ${askDomain ? "domain" : "range"} of the inverse of $f(x) = ${sqrtForm(a, h, k)}$.`,
            `求 $f(x) = ${sqrtForm(a, h, k)}$ 的反函数的${askDomain ? "定义域" : "值域"}。`,
          ),
          set: askDomain ? ran : dom,
          wrong: [askDomain ? dom : ran, askDomain ? ray(k, a < 0) : ray(-h, true), askDomain ? ray(-k, a > 0) : ray(h, false)],
          solution: t(
            `$f$ has domain ${setText(dom)} and range ${setText(ran)}${a < 0 ? " (the negative factor turns the root upside down)" : ""}. So the ${askDomain ? "domain" : "range"} of $f^{-1}$ is ${setText(askDomain ? ran : dom)}.`,
            `$f$ 的定义域为 ${setText(dom)}，值域为 ${setText(ran)}${a < 0 ? "（负系数使根式上下翻转）" : ""}。所以 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}为 ${setText(askDomain ? ran : dom)}。`,
          ),
        });
      },
    },
  ],
};

// Topic: invertible functions.

/** invertibleFunctions restricts domains so that functions have inverses. */
export const invertibleFunctions: TopicDef = {
  id: "invertible-functions",
  title: t("Invertible Functions", "可逆函数"),
  summary: t(
    "A function has an inverse exactly when it is one-to-one; restrict the domain of a function that is not to make it invertible.",
    "函数有反函数当且仅当它是一一对应的；对不是一一对应的函数限制定义域使其可逆。",
  ),
  prerequisites: ["domain-and-range-of-inverse-functions", "local-extrema", "the-vertex-form-of-a-parabola"],
  encompasses: [
    { topic: "one-to-one-functions", weight: 0.4 },
    { topic: "domain-and-range-of-inverse-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.4.D"],
  knowledgePoints: [
    {
      id: "restricting-parabolas-and-v-shapes",
      title: t("Restricting parabolas and V shapes", "限制抛物线与 V 形图象"),
      explanation: t(
        "A function is **invertible** (has an inverse function) exactly when it is one-to-one: otherwise some output would have to go back to two inputs.\n\n$f(x) = (x - 2)^{2}$ is not one-to-one, but on $[2, \\infty)$ it always increases, and on $(-\\infty, 2]$ it always decreases. Restricting the domain to either half makes it invertible. The largest interval containing $x = 5$ on which $f$ is one-to-one is $[2, \\infty)$. The same works for $a|x - h| + k$, split at $x = h$.",
        "函数**可逆**（有反函数）当且仅当它是一一对应的：否则某个输出就要对应回两个输入。\n\n$f(x) = (x - 2)^{2}$ 不是一一对应的，但在 $[2, \\infty)$ 上它始终递增，在 $(-\\infty, 2]$ 上始终递减。把定义域限制在任一半上，它就可逆。包含 $x = 5$、使 $f$ 一一对应的最大区间是 $[2, \\infty)$。对 $a|x - h| + k$ 同样在 $x = h$ 处分开。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const c = distinctFrom(rng, -9, 9, h);
        const a = rng.sign() * rng.int(1, 3);
        const k = rng.int(-9, 9);
        const latex = rng.bool() ? sqForm(a, h, k) : absForm(a, h, k);
        const right = c > h;
        return intervalProblem({
          prompt: t(
            `Find the largest interval containing $x = ${c}$ on which $f(x) = ${latex}$ is one-to-one.`,
            `求包含 $x = ${c}$、使 $f(x) = ${latex}$ 一一对应的最大区间。`,
          ),
          set: ray(h, right),
          wrong: [ray(h, !right), ray(h, right, false), ray(c, right), ray(-h, right)],
          solution: t(
            `The graph is symmetric about $x = ${h}$ and turns there. It is one-to-one on each side of $x = ${h}$, and $${c}$ is on the ${right ? "right" : "left"}, so the interval is ${setText(ray(h, right))}.`,
            `图象关于 $x = ${h}$ 对称，并在那里转向。在 $x = ${h}$ 的每一侧它都是一一对应的，而 $${c}$ 在${right ? "右" : "左"}侧，所以区间是 ${setText(ray(h, right))}。`,
          ),
        });
      },
    },
    {
      id: "restricting-a-graph",
      title: t("Restricting a graph", "限制图象"),
      explanation: t(
        "On a graph, the function is one-to-one between two neighboring turning points (or a turning point and an endpoint), since it only rises or only falls there. The turning points themselves can be included.\n\nIf a graph turns at $x = -2$ and $x = 3$ and is defined on $[-5, 5]$, the largest interval containing $x = 1$ on which it is one-to-one is $[-2, 3]$.",
        "在图象上，函数在相邻两个转折点之间（或转折点与端点之间）是一一对应的，因为它在那里只升或只降。转折点本身可以包含在内。\n\n若图象在 $x = -2$ 和 $x = 3$ 处转折，定义在 $[-5, 5]$ 上，则包含 $x = 1$、使它一一对应的最大区间是 $[-2, 3]$。",
      ),
      keyPrerequisites: ["local-extrema"],
      generate(rng) {
        let pts: Point[];
        let breaks: number[];
        let j: number;
        do {
          pts = walk(rng, rng.int(-6, -4), rng.int(4, 6), -5, 5, 4);
          const { maxXs, minXs } = turning(pts);
          breaks = [pts[0]![0], ...[...maxXs, ...minXs].sort((a, b) => a - b), pts[pts.length - 1]![0]];
          j = rng.int(0, breaks.length - 2);
        } while (breaks.length < 3 || breaks[j + 1]! - breaks[j]! < 2);
        const lo = breaks[j]!;
        const hi = breaks[j + 1]!;
        const c = rng.int(lo + 1, hi - 1);
        const set = union(iv(lo, hi));
        const wrong = [union(iv(lo, hi, false, false)), union(iv(pts[0]![0], pts[pts.length - 1]![0]))];
        if (j > 0) wrong.push(union(iv(breaks[j - 1]!, hi)));
        return {
          ...intervalProblem({
            prompt: t(
              `${graphShown.en} Find the largest interval containing $x = ${c}$ on which $f$ is one-to-one.`,
              `${graphShown["zh-CN"]}求包含 $x = ${c}$、使 $f$ 一一对应的最大区间。`,
            ),
            set,
            wrong,
            solution: t(
              `Around $x = ${c}$ the graph only ${valueOn(pts, hi)!.cmp(valueOn(pts, lo)!) > 0 ? "rises" : "falls"} from $x = ${lo}$ to $x = ${hi}$, where it ${j === 0 ? "starts" : "turns"} and ${j === breaks.length - 2 ? "ends" : "turns"}. So the interval is ${setText(set)}.`,
              `在 $x = ${c}$ 附近，图象从 $x = ${lo}$ 到 $x = ${hi}$ 一直${valueOn(pts, hi)!.cmp(valueOn(pts, lo)!) > 0 ? "上升" : "下降"}，两端分别是${j === 0 ? "起点" : "转折点"}和${j === breaks.length - 2 ? "终点" : "转折点"}。所以区间是 ${setText(set)}。`,
            ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "inverses-of-restricted-functions",
      title: t("Inverses of restricted functions", "限制后函数的反函数"),
      explanation: t(
        "After restricting the domain, the inverse has domain equal to the range of the restricted function, and range equal to the restricted domain.\n\n$f(x) = (x - 1)^{2} + 4$ with $x \\le 1$ has range $[4, \\infty)$. So $f^{-1}$ has domain $[4, \\infty)$ and range $(-\\infty, 1]$.",
        "限制定义域后，反函数的定义域是限制后函数的值域，值域是限制后的定义域。\n\n$f(x) = (x - 1)^{2} + 4$（$x \\le 1$）的值域为 $[4, \\infty)$。所以 $f^{-1}$ 的定义域为 $[4, \\infty)$，值域为 $(-\\infty, 1]$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const k = distinctFrom(rng, -9, 9, h);
        const a = rng.bool(0.7) ? 1 : -1;
        const right = rng.bool();
        const askDomain = rng.bool();
        const dom = ray(h, right);
        const ran = ray(k, a > 0);
        return intervalProblem({
          prompt: t(
            `$f(x) = ${sqForm(a, h, k)}$ with domain $x ${right ? "\\ge" : "\\le"} ${h}$. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$.`,
            `$f(x) = ${sqForm(a, h, k)}$，定义域为 $x ${right ? "\\ge" : "\\le"} ${h}$。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。`,
          ),
          set: askDomain ? ran : dom,
          wrong: [askDomain ? dom : ran, askDomain ? ray(k, a < 0) : ray(h, !right), askDomain ? ray(h, right) : ray(k, right)],
          solution: t(
            `The vertex is $${pt(h, k)}$ and the parabola opens ${a > 0 ? "up" : "down"}, so the range of $f$ is ${setText(ran)}. The ${askDomain ? "domain" : "range"} of $f^{-1}$ is the ${askDomain ? "range" : "domain"} of $f$: ${setText(askDomain ? ran : dom)}.`,
            `顶点为 $${pt(h, k)}$，抛物线开口向${a > 0 ? "上" : "下"}，所以 $f$ 的值域为 ${setText(ran)}。$f^{-1}$ 的${askDomain ? "定义域" : "值域"}是 $f$ 的${askDomain ? "值域" : "定义域"}：${setText(askDomain ? ran : dom)}。`,
          ),
        });
      },
    },
  ],
};

/** algebraIIFunctionTopics are the topics of the Algebra II functions unit, in teaching order. */
export const algebraIIFunctionTopics: readonly TopicDef[] = [
  localExtrema,
  oneToOneFunctions,
  graphsOfInverseFunctions,
  domainAndRangeOfInverseFunctions,
  invertibleFunctions,
];
