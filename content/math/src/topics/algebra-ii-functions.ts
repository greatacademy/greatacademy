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
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";
import { annotate, at, guides, onAxis, setText as setAlt, stretchOf } from "../graph-figures.ts";
import { choiceProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps, verdictChoice, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** disp is displayed work that closes a paragraph. */
const disp = (...lines: readonly string[]) => steps(...lines).trimEnd();

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
  encompasses: [{ topic: "increasing-and-decreasing", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.B.4"],
  intro: t(
    `You can find the global maximum and minimum of a function and the intervals where it increases or decreases. A local extremum is where the function turns: a hilltop or a valley floor that only has to beat the points nearby. It is what you look for when you ask where a quantity peaks for a while, even if it later goes higher.

Suppose a graph runs through $(-4, 1)$, $(-1, 5)$, $(2, 0)$ and $(5, 6)$. It rises to $(-1, 5)$ and then falls, so $f$ has a local maximum $5$ at $x = -1$. It falls to $(2, 0)$ and then rises, so $f$ has a local minimum $0$ at $x = 2$. The endpoint $(5, 6)$ is higher than both, so it is the global maximum, but it is not a local one.`,
    `你已经会求函数的最大值、最小值，也会找函数递增或递减的区间。极值点是函数转向的地方：山顶或谷底，只需要比附近的点高或低。想知道一个量在一段时间内的峰值（即使它后来更高）时，找的就是它。

设图象经过 $(-4, 1)$、$(-1, 5)$、$(2, 0)$ 和 $(5, 6)$。它上升到 $(-1, 5)$ 后下降，所以 $f$ 在 $x = -1$ 处取得极大值 $5$。它下降到 $(2, 0)$ 后上升，所以 $f$ 在 $x = 2$ 处取得极小值 $0$。端点 $(5, 6)$ 比两者都高，是最大值点，但不是极值点。`,
  ),
  knowledgePoints: [
    {
      id: "local-extrema-from-a-graph",
      figure: algebraDrawings2["local-extrema#local-extrema-from-a-graph"],
      title: t("Local extrema on a graph", "图象上的极值"),
      explanation: t(
        "A function $f$ has a **local maximum** at $x = c$ if $f(c)$ is at least as large as every value of $f$ at inputs close to $c$, on both sides. On a graph it is the top of a hill. A **local minimum** is the bottom of a valley.\n\nThe value $f(c)$ is the local maximum (or minimum) **value**; $x = c$ is where it occurs. In this course an endpoint of the domain is never a local extremum, because the graph does not continue on both sides of it.\n\nA graph rising to $(-1, 4)$, falling to $(2, -3)$ and then rising again has a local maximum at $x = -1$ and a local minimum at $x = 2$.\n\n> **Watch out.** Endpoints of the graph are never local extrema here, even when they are the highest or lowest points. Answer with the $x$-coordinates where the turns occur, not their heights.",
        '如果在 $c$ 附近（两侧）的所有输入处，$f$ 的值都不超过 $f(c)$，就说 $f$ 在 $x = c$ 处取得**极大值**。在图象上，它是"山顶"。**极小值**则是"谷底"。\n\n$f(c)$ 是极大（小）**值**，$x = c$ 是取得它的位置（极大值点、极小值点）。本课程中，定义域的端点不算极值点，因为图象没有在它的两侧延伸。\n\n一个图象上升到 $(-1, 4)$，下降到 $(2, -3)$，再上升，则它在 $x = -1$ 处取得极大值，在 $x = 2$ 处取得极小值。\n\n> **注意。** 这里图象的端点永远不算极值点，即使它们是最高点或最低点。答案写转折处的横坐标，而不是高度。',
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
        const neighbors = answer.map((x) => {
          const i = pts.findIndex((q) => q[0] === x);
          const [ax, ay] = pts[i - 1]!;
          const [, cy] = pts[i]!;
          const [bx, by] = pts[i + 1]!;
          return `f(${ax}) = ${ay}, \\quad f(${x}) = ${cy}, \\quad f(${bx}) = ${by}`;
        });
        return annotate(
          {
            ...solutionsProblem({
              prompt: t(
                `${graphShown.en} Find every $x$-value at which $f$ has a local ${kind.en}. Enter them separated by commas.`,
                `${graphShown["zh-CN"]}求 $f$ 取得${kind["zh-CN"]}的所有 $x$ 值，用逗号分隔。`,
              ),
              values: answer.map(String),
              wrong: [other.map(String), [...answer, ...extremeEnds].map(String), ys.map(String)],
              solution: join(
                label(1, "Find the turning points", "找转折点"),
                t(
                  `The graph turns ${wantMax ? "from rising to falling" : "from falling to rising"} at $x = ${answer.join(", ")}$.`,
                  `图象在 $x = ${answer.join(", ")}$ 处${wantMax ? "由上升转为下降" : "由下降转为上升"}。`,
                ),
                para,
                label(2, "Leave out the endpoints", "去掉端点"),
                t(
                  `The endpoints $x = ${ends[0]![0]}$ and $x = ${ends[1]![0]}$ do not count, since the graph does not continue on both sides of them. So the local ${wantMax ? "maxima" : "minima"} occur at $x = ${answer.join(", ")}$.`,
                  `端点 $x = ${ends[0]![0]}$ 和 $x = ${ends[1]![0]}$ 不算，因为图象没有在它们两侧延伸。所以 $f$ 在 $x = ${answer.join(", ")}$ 处取得${kind["zh-CN"]}。`,
                ),
                said(
                  `Compare each answer with the vertices on either side:${disp(...neighbors)}\n\nIn each line the middle value is ${wantMax ? "larger" : "smaller"} than both of its neighbors.`,
                  `把每个答案与两侧相邻的顶点比较：${disp(...neighbors)}\n\n每一行中间的值都${wantMax ? "大于" : "小于"}两侧的值。`,
                ),
              ),
            }),
            figure: graphFigure([{ name: "f", pts }]),
          },
          view,
          answer.flatMap((x, i) => guides([x, ys[i]!])).filter((m) => !(m.kind === "segment" && m.a[0] === 0)),
          `The local ${kind.en} ${answer.length > 1 ? "values occur" : "value occurs"} at x = ${answer.join(", ")}.`,
          `${kind["zh-CN"]}出现在 x = ${answer.join("、")}。`,
        );
      },
    },
    {
      id: "local-and-global-extrema",
      figure: algebraDrawings2["local-extrema#local-and-global-extrema"],
      title: t("Local and global extrema", "极值与最值"),
      explanation: t(
        "The **global** maximum is the largest value of $f$ on its whole domain; a **local** maximum only has to beat the values nearby. A hilltop that is also the highest point of the graph is both. A lower hilltop is only a local maximum.\n\nLikewise a valley floor is a local minimum, and it is also the global minimum when no point of the graph, including the endpoints, is lower.\n\n> **Watch out.** A local maximum need not be the global maximum: compare it with every point of the graph, endpoints included, before calling it global.",
        "**最大值**是 $f$ 在整个定义域上最大的值；**极大值**只需要比附近的值大。一个山顶如果也是整个图象的最高点，那它既是极大值点也是最大值点；较低的山顶只是极大值点。\n\n同样，谷底是极小值点；如果图象上（包括端点）没有更低的点，它也是最小值点。\n\n> **注意。** 极大值不一定是最大值：要和图象上所有的点（包括端点）比较，才能判断它是不是最大值。",
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
        const shape = isMax
          ? t(
              `The graph falls after $${pt(c, y)}$, so the point is a hilltop, not a valley floor.`,
              `图象过了 $${pt(c, y)}$ 之后下降，所以它是山顶，不是谷底。`,
            )
          : t(
              `The graph rises after $${pt(c, y)}$, so the point is a valley floor, not a hilltop.`,
              `图象过了 $${pt(c, y)}$ 之后上升，所以它是谷底，不是山顶。`,
            );
        const whole = global
          ? t(
              `No point of the graph is ${isMax ? "higher" : "lower"} than this one, so it is also the global ${isMax ? "maximum" : "minimum"}.`,
              `图象上没有比它更${isMax ? "高" : "低"}的点，所以它也是最${isMax ? "大" : "小"}值点。`,
            )
          : t(
              `The graph reaches $${extremeY}$ elsewhere, ${isMax ? "higher" : "lower"} than $${y}$, so the point is not the global ${isMax ? "maximum" : "minimum"}.`,
              `图象在别处达到 $${extremeY}$，比 $${y}$ 更${isMax ? "高" : "低"}，所以它不是最${isMax ? "大" : "小"}值点。`,
            );
        const reasons = extremumOptions.map((o, n): Reason => {
          const r = n < 2 !== isMax ? shape : whole;
          return [o.en, r.en, r["zh-CN"]];
        });
        return annotate(
          {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `${graphShown.en} Which describes the point $${pt(c, y)}$?`,
                  `${graphShown["zh-CN"]}哪一项描述了点 $${pt(c, y)}$？`,
                ),
                options: extremumOptions,
                correct,
                solution: join(
                  label(1, "Decide whether it is a local extremum", "判断是不是极值点"),
                  t(
                    `The graph ${isMax ? "rises to" : "falls to"} $${pt(c, y)}$ and then ${isMax ? "falls" : "rises"}, so it is a local ${isMax ? "maximum" : "minimum"}.`,
                    `图象${isMax ? "上升到" : "下降到"} $${pt(c, y)}$ 后${isMax ? "下降" : "上升"}，所以它是极${isMax ? "大" : "小"}值点。`,
                  ),
                  para,
                  label(2, "Compare with the whole graph", "与整个图象比较"),
                  t(
                    `The ${isMax ? "largest" : "smallest"} value of $f$ on the whole graph, endpoints included, is $${extremeY}$. So the point ${global ? "is" : "is not"} the global ${isMax ? "maximum" : "minimum"}.`,
                    `整个图象上（包括端点）$f$ 的${isMax ? "最大" : "最小"}值是 $${extremeY}$。所以它${global ? "也是" : "不是"}最${isMax ? "大" : "小"}值点。`,
                  ),
                  said(
                    `The heights of the vertices, from left to right, are $${ys.join(", ")}$. The ${isMax ? "largest" : "smallest"} of them is $${extremeY}$${global ? ", the height of the point itself" : `, which is not the height $${y}$ of the point`}.`,
                    `各顶点从左到右的高度是 $${ys.join(", ")}$，其中最${isMax ? "大" : "小"}的是 $${extremeY}$，${global ? "正是这个点的高度" : `不是这个点的高度 $${y}$`}。`,
                  ),
                ),
              }),
              reasons,
            ),
            figure: graphFigure([{ name: "f", pts }]),
          },
          view,
          guides([c, y], at([c, y])),
          `The turning point is ${at([c, y])}; the extreme height of the whole graph is ${extremeY}.`,
          `转折点是 ${at([c, y])}；整个图象的最值是 ${extremeY}。`,
        );
      },
    },
    {
      id: "extrema-from-increasing-and-decreasing",
      title: t("Extrema from increasing and decreasing", "由增减性判断极值"),
      explanation: t(
        "Where a continuous function changes from **increasing to decreasing**, it has a local maximum; where it changes from **decreasing to increasing**, it has a local minimum. If it increases (or decreases) on both sides of a point, there is no extremum there.\n\nIf $f$ is increasing on $(-\\infty, 1)$, decreasing on $(1, 4)$ and increasing on $(4, \\infty)$, it has a local maximum at $x = 1$ and a local minimum at $x = 4$.\n\n> **Watch out.** A point where $f$ is increasing on both sides is not an extremum, even though the interval changes there. Only a change of direction gives one.",
        "连续函数由**增变减**的地方取得极大值，由**减变增**的地方取得极小值。如果在某点两侧都递增（或都递减），该点就不是极值点。\n\n若 $f$ 在 $(-\\infty, 1)$ 上递增，在 $(1, 4)$ 上递减，在 $(4, \\infty)$ 上递增，则 $f$ 在 $x = 1$ 处取得极大值，在 $x = 4$ 处取得极小值。\n\n> **注意。** 如果 $f$ 在某点两侧都递增，即使区间在那里换了，它也不是极值点。只有增减方向改变才有极值。",
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
        const b = bs[i]!;
        const near =
          correct === 0
            ? t(
                `On the left $f$ rises up to $f(${b})$, and on the right it falls away from it, so the nearby values on both sides are smaller than $f(${b})$.`,
                `左侧 $f$ 上升到 $f(${b})$，右侧从它开始下降，所以两侧附近的值都比 $f(${b})$ 小。`,
              )
            : correct === 1
              ? t(
                  `On the left $f$ falls down to $f(${b})$, and on the right it rises away from it, so the nearby values on both sides are larger than $f(${b})$.`,
                  `左侧 $f$ 下降到 $f(${b})$，右侧从它开始上升，所以两侧附近的值都比 $f(${b})$ 大。`,
                )
              : t(
                  `Nearby values are ${before > 0 ? "smaller" : "larger"} than $f(${b})$ on the left and ${before > 0 ? "larger" : "smaller"} on the right, so $f(${b})$ is neither the largest nor the smallest value nearby.`,
                  `附近的值在左侧比 $f(${b})$ ${before > 0 ? "小" : "大"}，在右侧比它${before > 0 ? "大" : "小"}，所以 $f(${b})$ 既不是附近最大的值，也不是附近最小的值。`,
                );
        const keeps = word(before);
        const reasons: Reason[] = [
          correct === 1
            ? [
                kindOptions[0]!.en,
                "Falling then rising makes a valley floor, so this is a minimum, not a maximum.",
                "先减后增形成谷底，所以这是极小值，不是极大值。",
              ]
            : [
                kindOptions[0]!.en,
                `A local maximum needs $f$ to change from increasing to decreasing, but here $f$ is ${keeps.en} on both sides.`,
                `极大值要求 $f$ 由增变减，但这里 $f$ 在两侧都${keeps["zh-CN"]}。`,
              ],
          correct === 0
            ? [
                kindOptions[1]!.en,
                "Rising then falling makes a hilltop, so this is a maximum, not a minimum.",
                "先增后减形成山顶，所以这是极大值，不是极小值。",
              ]
            : [
                kindOptions[1]!.en,
                `A local minimum needs $f$ to change from decreasing to increasing, but here $f$ is ${keeps.en} on both sides.`,
                `极小值要求 $f$ 由减变增，但这里 $f$ 在两侧都${keeps["zh-CN"]}。`,
              ],
          [
            kindOptions[2]!.en,
            `The function changes direction at $x = ${b}$, so there is an extremum there.`,
            `函数在 $x = ${b}$ 处改变了增减方向，所以那里是极值点。`,
          ],
        ];
        return reasoned(
          choiceProblem({
            prompt: t(
              `The continuous function $f$ is ${enList}. What does $f$ have at $x = ${bs[i]}$?`,
              `连续函数 $f$ ${parts.map((p) => p.zh).join("，")}。$f$ 在 $x = ${bs[i]}$ 处取得什么？`,
            ),
            options: kindOptions,
            correct,
            solution: join(
              label(1, "Read the direction on each side", "看两侧的增减"),
              t(
                `Just left of $x = ${b}$, $f$ is ${word(before).en}; just right of it, $f$ is ${word(after).en}.`,
                `在 $x = ${b}$ 左侧附近 $f$ ${word(before)["zh-CN"]}，右侧附近 $f$ ${word(after)["zh-CN"]}。`,
              ),
              para,
              label(2, "Decide", "作出判断"),
              t(
                correct === 0
                  ? "Rising then falling gives a local maximum."
                  : correct === 1
                    ? "Falling then rising gives a local minimum."
                    : "It does not change direction, so there is no extremum there.",
                correct === 0
                  ? "先增后减，取得极大值。"
                  : correct === 1
                    ? "先减后增，取得极小值。"
                    : "增减性没有改变，所以那里不是极值点。",
              ),
              said(near.en, near["zh-CN"]),
            ),
          }),
          reasons,
        );
      },
    },
  ],
};

// Topic: one-to-one functions.

/** OneToOneCase is a formula with whether its function is one-to-one, the steps that decide it and a check by a second route. */
interface OneToOneCase {
  readonly latex: string;
  readonly yes: boolean;
  readonly shape: Text;
  readonly verdict: Text;
  readonly check: Text;
}

/** over writes the expression e divided by a, for a solved formula. */
const over = (e: string, a: number) => (a === 1 ? e : a === -1 ? `-(${e})` : `\\frac{${e}}{${a}}`);

/** times writes the factor a in front of a number: "", "-" or "2 \cdot ". */
const times = (a: number) => (a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `);

function oneToOneCase(rng: Rng): OneToOneCase {
  const h = rng.nonZero(-6, 6);
  const k = rng.int(-9, 9);
  const a = rng.sign() * rng.int(1, 3);
  const y = `y${plus(-k)}`;
  const way = a > 0 ? t("rises", "上升") : t("falls", "下降");
  const test = t(
    "Every horizontal line meets the graph at most once, so $f$ is one-to-one.",
    "每条水平线与图象至多交于一点，所以 $f$ 是一一对应的。",
  );
  const yes = (latex: string, shape: Text, solve: string, x: string, en = "", zh = ""): OneToOneCase => ({
    latex,
    yes: true,
    shape,
    verdict: test,
    check: t(
      `Solve $y = ${solve}$ for $x$${en}:${disp(`x = ${x}`)}\n\nEach output in the range comes from exactly one input.`,
      `从 $y = ${solve}$ 解出 $x$${zh}：${disp(`x = ${x}`)}\n\n值域中的每个输出都恰好来自一个输入。`,
    ),
  });
  const same = (latex: string, shape: Text, at: (d: number) => string, f: (x: number) => number): OneToOneCase => {
    const v = f(h + 1);
    const lines = [`f(${h - 1}) = ${at(-1)} = ${v}`, `f(${h + 1}) = ${at(1)} = ${v}`];
    return {
      latex,
      yes: false,
      shape,
      verdict: t(
        `Inputs the same distance from $${h}$ on either side, such as $${h - 1}$ and $${h + 1}$, give the same output. So some horizontal line meets the graph twice, and $f$ is not one-to-one.`,
        `在 $${h}$ 两侧距离相同的输入，例如 $${h - 1}$ 和 $${h + 1}$，给出相同的输出。所以某条水平线与图象交于两点，$f$ 不是一一对应的。`,
      ),
      check: t(
        `Compute both outputs:${disp(...lines)}\n\nTwo different inputs give the same output.`,
        `算出两个输出：${disp(...lines)}\n\n两个不同的输入给出相同的输出。`,
      ),
    };
  };
  const squared = (c: number) => (d: number) => `${times(c)}${d < 0 ? `(${d})` : d}^{2}${plus(k)}`;
  switch (rng.int(0, 6)) {
    case 0:
      return yes(linear(a, k), t("The graph is a line that is not horizontal.", "图象是一条不水平的直线。"), linear(a, k), over(y, a));
    case 1:
      return same(
        sqForm(a, h, k),
        t(`The graph is a parabola with axis of symmetry $x = ${h}$.`, `图象是对称轴为 $x = ${h}$ 的抛物线。`),
        squared(a),
        (x) => a * (x - h) ** 2 + k,
      );
    case 2:
      return yes(
        cubeForm(a, h, k),
        t(
          `The cube $(${shifted(h)})^{3}$ takes every value exactly once, so the graph always ${way.en}.`,
          `立方 $(${shifted(h)})^{3}$ 的每个值只取一次，所以图象始终${way["zh-CN"]}。`,
        ),
        cubeForm(a, h, k),
        `\\sqrt[3]{${over(y, a)}}${plus(h)}`,
      );
    case 3:
      return same(
        absForm(a, h, k),
        t(`The graph is a V shape with axis of symmetry $x = ${h}$.`, `图象是对称轴为 $x = ${h}$ 的 V 形。`),
        (d) => `${times(a)}|${d}|${plus(k)}`,
        (x) => a * Math.abs(x - h) + k,
      );
    case 4: {
      const base = over(y, a);
      return yes(
        sqrtForm(a, h, k),
        t(
          `A square root always increases on its domain, so the graph always ${way.en}.`,
          `平方根在定义域上始终递增，所以图象始终${way["zh-CN"]}。`,
        ),
        sqrtForm(a, h, k),
        `${base === "y" ? "y^{2}" : `\\left(${base}\\right)^{2}`}${plus(h)}`,
      );
    }
    case 5:
      return yes(
        `${sqForm(1, h, k)}, \\; x \\ge ${h}`,
        t(
          `On $x \\ge ${h}$ only the right half of the parabola remains, and it always rises.`,
          `在 $x \\ge ${h}$ 上只剩下抛物线的右半支，它始终上升。`,
        ),
        sqForm(1, h, k),
        `\\sqrt{${y}}${plus(h)}`,
        `, taking the square root that keeps $x \\ge ${h}$`,
        `，取使 $x \\ge ${h}$ 的平方根`,
      );
    default: {
      const lo = h - rng.int(1, 4);
      return same(
        `${sqForm(1, h, k)}, \\; x \\ge ${lo}`,
        t(
          `The graph is part of the parabola with axis of symmetry $x = ${h}$, and the domain $x \\ge ${lo}$ reaches past the axis on the left.`,
          `图象是对称轴为 $x = ${h}$ 的抛物线的一部分，而定义域 $x \\ge ${lo}$ 越过了对称轴，延伸到它的左侧。`,
        ),
        squared(1),
        (x) => (x - h) ** 2 + k,
      );
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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.4.D"],
  intro: t(
    `You can tell whether a graph is a function with the vertical line test, and you can graph parabolas and V shapes. A one-to-one function goes further: different inputs always give different outputs. Only such a function can be undone by an inverse, because each output points back to a single input.

Take $f(x) = |x - 2|$. The inputs $0$ and $4$ are both $2$ away from $2$, and $f(0) = f(4) = 2$. Two inputs share an output, so $f$ is not one-to-one. By contrast $g(x) = 3x - 1$ is a line that is not horizontal, and $g(a) = g(b)$ forces $a = b$, so $g$ is one-to-one.`,
    `你已经会用竖直线检验判断图象是不是函数，也会画抛物线和 V 形图象。一一对应的函数要求更多：不同的输入总给出不同的输出。只有这样的函数才能被反函数还原，因为每个输出只对应回一个输入。

看 $f(x) = |x - 2|$。输入 $0$ 和 $4$ 到 $2$ 的距离都是 $2$，并且 $f(0) = f(4) = 2$。两个输入有相同的输出，所以 $f$ 不是一一对应的。相反，$g(x) = 3x - 1$ 是一条不水平的直线，由 $g(a) = g(b)$ 必定得到 $a = b$，所以 $g$ 是一一对应的。`,
  ),
  knowledgePoints: [
    {
      id: "one-to-one-from-a-table",
      title: t("One-to-one from a table", "从数值表判断"),
      explanation: t(
        "A function is **one-to-one** if different inputs always give different outputs: no output is used twice.\n\nIn a table, look along the output row. If some output appears twice, the function is not one-to-one. The table $x: 1, 2, 3$ with $f(x): 5, 7, 5$ is not one-to-one, since $f(1) = f(3) = 5$.\n\n> **Watch out.** A repeated input would stop $f$ being a function; for one-to-one, look for a repeated output in the second row.",
        "如果不同的输入总给出不同的输出（没有哪个输出被用了两次），就说这个函数是**一一对应的**。\n\n在数值表中，看输出那一行。如果某个输出出现两次，函数就不是一一对应的。$x: 1, 2, 3$、$f(x): 5, 7, 5$ 的表不是一一对应的，因为 $f(1) = f(3) = 5$。\n\n> **注意。** 输入重复会使 $f$ 不成为函数；判断一一对应要看第二行有没有重复的输出。",
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
        const sorted = [...ys].sort((u, w) => u - w).join(", ");
        return verdictChoice(rng, {
          prompt: t(
            `The table shows the function $f$.${valueTable("f", xs, ys)}Is $f$ one-to-one?`,
            `下表给出了函数 $f$。${valueTable("f", xs, ys)}$f$ 是一一对应的吗？`,
          ),
          holds: !repeat,
          yes: t("the five outputs are all different", "五个输出各不相同"),
          no: t(`the output $${repeat ? ys[i] : ys[0]}$ appears twice`, `输出 $${repeat ? ys[i] : ys[0]}$ 出现了两次`),
          yesWrong: t("every input has exactly one output", "每个输入恰有一个输出"),
          noWrong: t("the outputs do not increase from left to right", "输出没有从左到右递增"),
          solution: join(
            label(1, "Read the outputs", "读出输出"),
            t(`The outputs in the second row are $${ys.join(", ")}$.`, `第二行的输出是 $${ys.join(", ")}$。`),
            para,
            label(2, "Look for a repeated output", "找重复的输出"),
            repeat
              ? t(
                  `The output $${ys[i]}$ appears twice: $f(${xs[i]}) = f(${xs[j]}) = ${ys[i]}$. So $f$ is not one-to-one.`,
                  `输出 $${ys[i]}$ 出现了两次：$f(${xs[i]}) = f(${xs[j]}) = ${ys[i]}$。所以 $f$ 不是一一对应的。`,
                )
              : t("The five outputs are all different, so $f$ is one-to-one.", "五个输出各不相同，所以 $f$ 是一一对应的。"),
            repeat
              ? said(
                  `In order of size the outputs are $${sorted}$. The value $${ys[i]}$ sits twice in a row, so it is used twice.`,
                  `按大小排列，输出是 $${sorted}$。$${ys[i]}$ 连续出现两次，所以它被用了两次。`,
                )
              : said(
                  `In order of size the outputs are $${sorted}$. No two neighbors are equal, so no output is used twice.`,
                  `按大小排列，输出是 $${sorted}$。相邻的两个数都不相等，所以没有哪个输出被用了两次。`,
                ),
          ),
        });
      },
    },
    {
      id: "the-horizontal-line-test",
      figure: algebraDrawings2["one-to-one-functions#the-horizontal-line-test"],
      title: t("The horizontal line test", "水平线检验"),
      explanation: t(
        "Two inputs with the same output are two points of the graph at the same height. So a function is one-to-one exactly when **no horizontal line meets its graph more than once**: the **horizontal line test**.\n\nA graph that always rises (or always falls) passes the test. A graph that rises and then falls fails it: a horizontal line just below the top meets it twice.\n\n> **Watch out.** The vertical line test decides whether a graph is a function. The horizontal line test decides whether the function is one-to-one. Do not mix them up.",
        "两个输入有相同的输出，就是图象上两个高度相同的点。所以函数是一一对应的，当且仅当**任何水平线与图象的交点都不超过一个**：这就是**水平线检验**。\n\n始终上升（或始终下降）的图象通过检验。先升后降的图象不能通过：略低于顶点的水平线与它交于两点。\n\n> **注意。** 竖直线检验判断图象是不是函数；水平线检验判断函数是不是一一对应的。不要混淆。",
      ),
      generate(rng) {
        const yes = rng.bool();
        let pts: Point[];
        do {
          pts = yes ? monoWalk(rng, rng.int(-6, -3), rng.int(3, 6), -5, 5, 4) : walk(rng, rng.int(-6, -3), rng.int(3, 6), -5, 5, 4);
        } while (isMonotone(pts) !== yes);
        const { maxXs, minXs } = turning(pts);
        const turn = [...maxXs, ...minXs].sort((a, b) => a - b)[0]!;
        const up = pts[0]![1] < pts[1]![1];
        const level = () => {
          const i = pts.findIndex((q) => q[0] === turn);
          const [px, py] = pts[i - 1]!;
          const [tx, ty] = pts[i]!;
          const [nx, ny] = pts[i + 1]!;
          const L = Q.of(2 * ty + (maxXs.includes(turn) ? -1 : 1), 2);
          const xa = Q.of(2 * tx * Math.abs(ty - py) - (tx - px), 2 * Math.abs(ty - py));
          const xb = Q.of(2 * tx * Math.abs(ty - ny) + (nx - tx), 2 * Math.abs(ty - ny));
          return `f(${num(xa)}) = f(${num(xb)}) = ${num(L)}`;
        };
        return {
          ...verdictChoice(rng, {
            prompt: t(`${graphShown.en} Is $f$ one-to-one?`, `${graphShown["zh-CN"]}$f$ 是一一对应的吗？`),
            holds: yes,
            yes: t("every horizontal line meets the graph at most once", "每条水平线与图象至多交于一点"),
            no: t("some horizontal line meets the graph more than once", "存在与图象交于不止一点的水平线"),
            yesWrong: t("every vertical line meets the graph at most once", "每条竖直线与图象至多交于一点"),
            noWrong: t("some vertical line meets the graph more than once", "存在与图象交于不止一点的竖直线"),
            solution: yes
              ? join(
                  label(1, "Follow the graph", "沿图象看"),
                  t(`From left to right, the graph ${up ? "rises" : "falls"} all the way.`, `从左到右，图象一直${up ? "上升" : "下降"}。`),
                  para,
                  label(2, "Apply the horizontal line test", "用水平线检验"),
                  t(
                    "So every horizontal line meets it at most once, and $f$ is one-to-one.",
                    "所以每条水平线与它至多交于一点，$f$ 是一一对应的。",
                  ),
                  said(
                    `The heights of the vertices, from left to right, are $${pts.map((q) => q[1]).join(", ")}$. Each is ${up ? "larger" : "smaller"} than the one before, so no height is reached twice.`,
                    `各顶点从左到右的高度是 $${pts.map((q) => q[1]).join(", ")}$，每一个都比前一个${up ? "大" : "小"}，所以没有哪个高度被达到两次。`,
                  ),
                )
              : join(
                  label(1, "Find a turn", "找转折点"),
                  t(
                    `The graph turns around at $x = ${turn}$, where it has a ${maxXs.includes(turn) ? "high" : "low"} point.`,
                    `图象在 $x = ${turn}$ 处转向，那里是一个${maxXs.includes(turn) ? "高" : "低"}点。`,
                  ),
                  para,
                  label(2, "Apply the horizontal line test", "用水平线检验"),
                  t(
                    `A horizontal line slightly ${maxXs.includes(turn) ? "below" : "above"} that point meets the graph twice, once on each side of the turn. So $f$ is not one-to-one.`,
                    `略${maxXs.includes(turn) ? "低于" : "高于"}该点的水平线与图象交于两点，转折点两侧各一个。所以 $f$ 不是一一对应的。`,
                  ),
                  said(
                    `Take the horizontal line half a unit ${maxXs.includes(turn) ? "below" : "above"} the turn. It meets the graph at two inputs:${disp(level())}\n\nTwo different inputs share an output.`,
                    `取比转折点${maxXs.includes(turn) ? "低" : "高"}半个单位的水平线，它与图象交于两个输入处：${disp(level())}\n\n两个不同的输入有相同的输出。`,
                  ),
                ),
          }),
          figure: graphFigure([{ name: "f", pts }]),
        };
      },
    },
    {
      id: "one-to-one-from-a-formula",
      title: t("One-to-one from a formula", "从解析式判断"),
      figure: remainingDrawings4["one-to-one-functions#one-to-one-from-a-formula"],
      explanation: t(
        "Picture the graph. Lines that are not horizontal, cubes $a(x - h)^{3} + k$ and square roots $a\\sqrt{x - h} + k$ always rise or always fall, so they are one-to-one.\n\nParabolas $a(x - h)^{2} + k$ and V shapes $a|x - h| + k$ are symmetric about $x = h$, so $f(h - 1) = f(h + 1)$: they are not one-to-one, unless the domain is cut down to one side of $x = h$.\n\n> **Watch out.** A parabola or V shape whose domain is cut down to one side of the axis is one-to-one, but a domain that reaches past the axis, such as $x \\ge h - 2$, is not.",
        "想象图象。不水平的直线、立方函数 $a(x - h)^{3} + k$ 和平方根函数 $a\\sqrt{x - h} + k$ 始终上升或始终下降，所以是一一对应的。\n\n抛物线 $a(x - h)^{2} + k$ 和 V 形 $a|x - h| + k$ 关于 $x = h$ 对称，所以 $f(h - 1) = f(h + 1)$：它们不是一一对应的，除非把定义域限制在 $x = h$ 的一侧。\n\n> **注意。** 定义域限制在对称轴一侧的抛物线或 V 形是一一对应的，但越过对称轴的定义域（例如 $x \\ge h - 2$）就不是。",
      ),
      generate(rng) {
        const c = oneToOneCase(rng);
        return choiceProblem({
          prompt: t(`Is $f(x) = ${c.latex}$ one-to-one?`, `$f(x) = ${c.latex}$ 是一一对应的吗？`),
          options: yesNo,
          correct: c.yes ? 0 : 1,
          solution: join(
            label(1, "Picture the graph", "想象图象"),
            c.shape,
            para,
            label(2, "Apply the horizontal line test", "用水平线检验"),
            c.verdict,
            said(c.check.en, c.check["zh-CN"]),
          ),
        });
      },
    },
    {
      id: "inputs-with-equal-outputs",
      figure: algebraDrawings2["one-to-one-functions#inputs-with-equal-outputs"],
      title: t("Inputs with equal outputs", "输出相同的输入"),
      explanation: t(
        "The graphs of $a(x - h)^{2} + k$ and $a|x - h| + k$ are symmetric about the line $x = h$. An input $c$ and its mirror image $2h - c$, the same distance from $h$ on the other side, give the same output.\n\nFor $f(x) = (x - 3)^{2} + 1$: $f(1) = f(5) = 5$, since $1$ and $5$ are both $2$ away from $3$.\n\n> **Watch out.** The mirror image of $c$ is $2h - c$, not $-c$: reflect in the line $x = h$, not in the $y$-axis.",
        "$a(x - h)^{2} + k$ 与 $a|x - h| + k$ 的图象关于直线 $x = h$ 对称。输入 $c$ 和它的对称点 $2h - c$（在 $h$ 另一侧、与 $h$ 距离相同）给出相同的输出。\n\n对于 $f(x) = (x - 3)^{2} + 1$：$f(1) = f(5) = 5$，因为 $1$ 和 $5$ 到 $3$ 的距离都是 $2$。\n\n> **注意。** $c$ 的对称点是 $2h - c$，不是 $-c$：要关于直线 $x = h$ 对称，而不是关于 $y$ 轴。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const c = distinctFrom(rng, -9, 9, h);
        const a = rng.sign() * rng.int(1, 3);
        const k = rng.int(-9, 9);
        const square = rng.bool();
        const latex = square ? sqForm(a, h, k) : absForm(a, h, k);
        const v = square ? a * (c - h) ** 2 + k : a * Math.abs(c - h) + k;
        const at = (d: number) => (square ? `${times(a)}${d < 0 ? `(${d})` : d}^{2}${plus(k)}` : `${times(a)}|${d}|${plus(k)}`);
        return numberProblem({
          prompt: t(
            `For $f(x) = ${latex}$, there is a number $d \\ne ${c}$ with $f(d) = f(${c})$. Find $d$.`,
            `对于 $f(x) = ${latex}$，存在数 $d \\ne ${c}$ 使 $f(d) = f(${c})$。求 $d$。`,
          ),
          answer: 2 * h - c,
          wrong: [-c, c - 2 * h, h - c, 2 * c - h],
          solution: join(
            label(1, "Find the axis of symmetry", "找对称轴"),
            t(
              `The graph of $f$ is ${square ? "a parabola" : "a V shape"} symmetric about $x = ${h}$.`,
              `$f$ 的图象是关于 $x = ${h}$ 对称的${square ? "抛物线" : " V 形"}。`,
            ),
            para,
            label(2, "Reflect the input", "作输入的对称点"),
            t(
              `The input $${c}$ is $${Math.abs(c - h)}$ ${c < h ? "left" : "right"} of $${h}$, so its mirror image is $${Math.abs(c - h)}$ ${c < h ? "right" : "left"} of it: $d = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${c < 0 ? `(${c})` : c} = ${2 * h - c}$.`,
              `输入 $${c}$ 在 $${h}$ 的${c < h ? "左" : "右"}边 $${Math.abs(c - h)}$ 个单位，它的对称点在 $${h}$ 的${c < h ? "右" : "左"}边 $${Math.abs(c - h)}$ 个单位：$d = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${c < 0 ? `(${c})` : c} = ${2 * h - c}$。`,
            ),
            said(
              `Compute both outputs:${disp(`f(${c}) = ${at(c - h)} = ${v}`, `f(${2 * h - c}) = ${at(h - c)} = ${v}`)}\n\nThe two inputs give the same output.`,
              `算出两个输出：${disp(`f(${c}) = ${at(c - h)} = ${v}`, `f(${2 * h - c}) = ${at(h - c)} = ${v}`)}\n\n两个输入给出相同的输出。`,
            ),
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
    { topic: "slope-intercept-form", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.4.C"],
  intro: t(
    `You know that an inverse function undoes a function, that only one-to-one functions have inverses, and how to read a line from its slope and intercept. Here you draw the inverse: every point of the graph of $f$ has its coordinates swapped, which reflects the graph in the line $y = x$.

Take the one-to-one function with $f(1) = 4$ and $f(3) = -2$. Its graph contains $(1, 4)$ and $(3, -2)$, so the graph of $f^{-1}$ contains $(4, 1)$ and $(-2, 3)$, and $f^{-1}(-2) = 3$. The midpoint of $(1, 4)$ and $(4, 1)$ is $(2.5, 2.5)$, on the line $y = x$, as a mirror image should be.`,
    `你已经知道反函数能还原函数，只有一一对应的函数才有反函数，也会从斜率与截距读出直线。这里要画反函数的图象：把 $f$ 图象上每个点的坐标交换，相当于把图象关于直线 $y = x$ 对称。

设一一对应的函数满足 $f(1) = 4$、$f(3) = -2$。它的图象含有 $(1, 4)$ 和 $(3, -2)$，所以 $f^{-1}$ 的图象含有 $(4, 1)$ 和 $(-2, 3)$，并且 $f^{-1}(-2) = 3$。$(1, 4)$ 与 $(4, 1)$ 的中点是 $(2.5, 2.5)$，在直线 $y = x$ 上，正符合对称的要求。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-the-inverse",
      figure: algebraDrawings2["graphs-of-inverse-functions#points-on-the-inverse"],
      title: t("Points on the inverse", "反函数图象上的点"),
      explanation: t(
        "If $f(a) = b$, then $f^{-1}(b) = a$. So the point $(a, b)$ is on the graph of $f$ exactly when $(b, a)$ is on the graph of $f^{-1}$: **swap the coordinates**.\n\nIf $(2, 7)$ is on the graph of $f$, then $(7, 2)$ is on the graph of $f^{-1}$.\n\n> **Watch out.** Swapping the coordinates is not changing their signs. The point $(2, 7)$ goes to $(7, 2)$, not to $(-2, -7)$ or $(-7, -2)$.",
        "若 $f(a) = b$，则 $f^{-1}(b) = a$。所以点 $(a, b)$ 在 $f$ 的图象上，当且仅当 $(b, a)$ 在 $f^{-1}$ 的图象上：**交换坐标**。\n\n若 $(2, 7)$ 在 $f$ 的图象上，则 $(7, 2)$ 在 $f^{-1}$ 的图象上。\n\n> **注意。** 交换坐标不是改变它们的符号。点 $(2, 7)$ 变成 $(7, 2)$，而不是 $(-2, -7)$ 或 $(-7, -2)$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = distinctFrom(rng, -9, 9, a);
        const toInverse = rng.bool(0.7);
        const [from, to] = toInverse ? ["f", "f^{-1}"] : ["f^{-1}", "f"];
        const mid = Q.of(a + b, 2);
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
          solution: join(
            label(1, "Read the point", "读懂这个点"),
            t(
              `The point $${pt(a, b)}$ on the graph of $${from}$ means $${from}(${a}) = ${b}$.`,
              `点 $${pt(a, b)}$ 在 $${from}$ 的图象上，意思是 $${from}(${a}) = ${b}$。`,
            ),
            para,
            label(2, "Swap the coordinates", "交换坐标"),
            t(
              `The inverse sends $${b}$ back to $${a}$, so $${to}(${b}) = ${a}$ and the point $${pt(b, a)}$ is on the graph of $${to}$.`,
              `反函数把 $${b}$ 送回 $${a}$，所以 $${to}(${b}) = ${a}$，点 $${pt(b, a)}$ 在 $${to}$ 的图象上。`,
            ),
            said(
              `The two points should be mirror images in $y = x$. Their midpoint is${disp(`\\left(${num(mid)}, ${num(mid)}\\right)`)}\n\nIt lies on $y = x$, and the segment joining $${pt(a, b)}$ and $${pt(b, a)}$ has slope $-1$, so it is perpendicular to $y = x$.`,
              `这两个点应关于 $y = x$ 对称。它们的中点是${disp(`\\left(${num(mid)}, ${num(mid)}\\right)`)}\n\n它在 $y = x$ 上，连接 $${pt(a, b)}$ 与 $${pt(b, a)}$ 的线段斜率为 $-1$，与 $y = x$ 垂直。`,
            ),
          ),
        });
      },
    },
    {
      id: "inverse-values-from-a-graph",
      figure: algebraDrawings2["graphs-of-inverse-functions#inverse-values-from-a-graph"],
      title: t("Inverse values from a graph", "从图象读反函数值"),
      explanation: t(
        "To find $f^{-1}(b)$ from the graph of $f$, look for the point of the graph at **height** $b$ and read its $x$-coordinate. Do not read $f(b)$: that is the height above $x = b$.\n\nIf the graph passes through $(-2, 3)$, then $f^{-1}(3) = -2$.\n\n> **Watch out.** $f^{-1}(b)$ does not mean the reciprocal of $f(b)$. The exponent $-1$ names the inverse function.",
        "从 $f$ 的图象求 $f^{-1}(b)$：找到图象上**高度**为 $b$ 的点，读出它的横坐标。不要读 $f(b)$：那是 $x = b$ 上方的高度。\n\n若图象经过 $(-2, 3)$，则 $f^{-1}(3) = -2$。\n\n> **注意。** $f^{-1}(b)$ 不是 $f(b)$ 的倒数。指数 $-1$ 表示反函数。",
      ),
      generate(rng) {
        const pts = monoWalk(rng, rng.int(-6, -4), rng.int(4, 6), -5, 5, 4);
        const [x, y] = rng.pick(pts);
        const fy = valueOn(pts, y);
        const up = pts[0]![1] < pts[1]![1];
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `${graphShown.en} The function $f$ is one-to-one. Find $f^{-1}(${y})$.`,
                `${graphShown["zh-CN"]}$f$ 是一一对应的。求 $f^{-1}(${y})$。`,
              ),
              answer: x,
              wrong: [...(fy ? [fy] : []), y, -x],
              solution: join(
                label(1, "Find the height", "找高度"),
                t(
                  `$f^{-1}(${y})$ is the input whose output is $${y}$. Go across from $${y}$ on the vertical axis to the graph: the graph is at height $${y}$ at the point $${pt(x, y)}$.`,
                  `$f^{-1}(${y})$ 是输出为 $${y}$ 的那个输入。从纵轴上的 $${y}$ 水平走到图象：图象在点 $${pt(x, y)}$ 处高度为 $${y}$。`,
                ),
                para,
                label(2, "Read the input", "读出输入"),
                t(`So $f(${x}) = ${y}$, and $f^{-1}(${y}) = ${x}$.`, `所以 $f(${x}) = ${y}$，$f^{-1}(${y}) = ${x}$。`),
                said(
                  `The graph only ${up ? "rises" : "falls"}, so $${pt(x, y)}$ is its only point at height $${y}$. Then $f(f^{-1}(${y})) = f(${x}) = ${y}$, as it should be.`,
                  `图象一直${up ? "上升" : "下降"}，所以 $${pt(x, y)}$ 是它唯一高度为 $${y}$ 的点。于是 $f(f^{-1}(${y})) = f(${x}) = ${y}$，符合要求。`,
                ),
              ),
            }),
            figure: graphFigure([{ name: "f", pts }]),
          },
          view,
          [
            { kind: "arrow", from: [0, y], to: [x, y], tone: "action", thin: true },
            { kind: "arrow", from: [x, y], to: [x, 0], tone: "action", thin: true },
            { kind: "point", at: [x, 0], label: String(x), dir: y >= 0 ? "s" : "n", tone: "result" },
          ],
          `Start at height ${y} on the vertical axis, go across to the graph and down to x = ${x}.`,
          `从纵轴上的 ${y} 出发，水平走到图象，再竖直走到 x = ${x}。`,
        );
      },
    },
    {
      id: "inverses-of-lines",
      figure: algebraDrawings2["graphs-of-inverse-functions#inverses-of-lines"],
      title: t("Inverses of lines", "直线的反函数"),
      explanation: t(
        "Swapping coordinates reflects the graph in the line $y = x$. The $y$-intercept $(0, b)$ of a line becomes the $x$-intercept $(b, 0)$ of the inverse. Rise and run swap, so a line with slope $m \\ne 0$ becomes a line with slope $\\frac{1}{m}$.\n\nFor $f(x) = 2x + 6$: the graph of $f^{-1}$ has $x$-intercept $6$, $y$-intercept $-3$ (the swap of the $x$-intercept $(-3, 0)$ of $f$) and slope $\\frac{1}{2}$.\n\n> **Watch out.** The slope of the inverse is the reciprocal of $m$, not $-m$ or its negative reciprocal. The negative reciprocal belongs to perpendicular lines.",
        "交换坐标就是把图象关于直线 $y = x$ 对称。直线的 $y$ 轴截距点 $(0, b)$ 变成反函数的 $x$ 轴截距点 $(b, 0)$。竖直变化量与水平变化量互换，所以斜率为 $m \\ne 0$ 的直线变成斜率为 $\\frac{1}{m}$ 的直线。\n\n对于 $f(x) = 2x + 6$：$f^{-1}$ 的图象 $x$ 轴截距为 $6$，$y$ 轴截距为 $-3$（由 $f$ 的 $x$ 轴截距点 $(-3, 0)$ 交换坐标得到），斜率为 $\\frac{1}{2}$。\n\n> **注意。** 反函数的斜率是 $m$ 的倒数，不是 $-m$，也不是负倒数。负倒数是垂直直线的斜率。",
      ),
      generate(rng) {
        const m = rng.pick(slopes);
        const b = rng.nonZero(-9, 9);
        const ask = rng.int(0, 2);
        const fLatex = poly([m, "x"], [b, ""]);
        const xInt = Q.of(-b).div(m);
        const answer = [Q.one.div(m), xInt, Q.of(b)][ask]!;
        const inverse = poly([Q.one.div(m), "x"], [xInt, ""]);
        const what = [t("the slope", "斜率"), t("the $y$-intercept", "$y$ 轴截距"), t("the $x$-intercept", "$x$ 轴截距")][ask]!;
        return numberProblem({
          prompt: t(
            `Find ${what.en} of the graph of $f^{-1}$, where $f(x) = ${fLatex}$.`,
            `设 $f(x) = ${fLatex}$。求 $f^{-1}$ 的图象的${what["zh-CN"]}。`,
          ),
          answer,
          wrong: [m, Q.one.div(m).neg(), m.neg(), Q.of(b), xInt, Q.of(-b)],
          solution: join(
            label(1, "Read the line", "读出直线"),
            t(
              `The graph of $f$ is the line with slope $${num(m)}$ and $y$-intercept $${b}$.`,
              `$f$ 的图象是斜率为 $${num(m)}$、$y$ 轴截距为 $${b}$ 的直线。`,
            ),
            para,
            label(2, "Reflect in the line y = x", "关于直线 y = x 对称"),
            [
              t(
                `Reflecting in $y = x$ swaps rise and run, so the slope of $f^{-1}$ is $\\frac{1}{${num(m)}} = ${num(answer)}$.`,
                `关于 $y = x$ 对称后竖直与水平变化量互换，所以 $f^{-1}$ 的斜率是 $\\frac{1}{${num(m)}} = ${num(answer)}$。`,
              ),
              t(
                `The $y$-intercept of $f^{-1}$ comes from the $x$-intercept of $f$. Solving $${fLatex} = 0$ gives $x = ${num(xInt)}$. So $f^{-1}$ has $y$-intercept $${num(xInt)}$.`,
                `$f^{-1}$ 的 $y$ 轴截距来自 $f$ 的 $x$ 轴截距。由 $${fLatex} = 0$ 得 $x = ${num(xInt)}$。所以 $f^{-1}$ 的 $y$ 轴截距为 $${num(xInt)}$。`,
              ),
              t(
                `The $y$-intercept of $f$ is $(0, ${b})$; swapping gives $(${b}, 0)$ on $f^{-1}$, so its $x$-intercept is $${b}$.`,
                `$f$ 的 $y$ 轴截距点是 $(0, ${b})$；交换坐标得到 $f^{-1}$ 上的 $(${b}, 0)$，所以它的 $x$ 轴截距为 $${b}$。`,
              ),
            ][ask]!,
            said(
              `Find the inverse by solving $y = ${fLatex}$ for $x$ and swapping the letters:${disp(`x = ${front(Q.one.div(m))}(y${plus(-b)})`, `f^{-1}(x) = ${inverse}`)}\n\n${[`The slope is the coefficient of $x$, which is $${num(answer)}$.`, `The $y$-intercept is the constant term, which is $${num(xInt)}$.`, `Setting $f^{-1}(x) = 0$ gives $x = ${b}$, the $x$-intercept.`][ask]}`,
              `解 $y = ${fLatex}$ 得出 $x$，再交换字母，求出反函数：${disp(`x = ${front(Q.one.div(m))}(y${plus(-b)})`, `f^{-1}(x) = ${inverse}`)}\n\n${[`斜率是 $x$ 的系数 $${num(answer)}$。`, `$y$ 轴截距是常数项 $${num(xInt)}$。`, `令 $f^{-1}(x) = 0$ 得 $x = ${b}$，即 $x$ 轴截距。`][ask]}`,
            ),
          ),
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
  encompasses: [{ topic: "range-of-a-function", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.4.C"],
  intro: t(
    `You can draw the graph of an inverse by swapping coordinates, and you can find the range of functions such as square roots. Swapping every point also swaps the sets they fill: the inputs of $f$ become the outputs of $f^{-1}$. This tells you where an inverse is defined before you write a formula for it.

Take $f(x) = \\sqrt{x - 3} + 1$. The root needs $x \\ge 3$, so $f$ has domain $[3, \\infty)$, and the root is never negative, so $f$ has range $[1, \\infty)$. So $f^{-1}$ has domain $[1, \\infty)$ and range $[3, \\infty)$. Indeed $f(7) = 3$, and $f^{-1}(3) = 7$ uses an input in $[1, \\infty)$ and gives an output in $[3, \\infty)$.`,
    `你已经会通过交换坐标画出反函数的图象，也会求平方根等函数的值域。交换每个点，也就交换了这些点的横、纵坐标所组成的集合：$f$ 的输入变成 $f^{-1}$ 的输出。这样在写出反函数的解析式之前，就能知道它在哪里有定义。

看 $f(x) = \\sqrt{x - 3} + 1$。根式要求 $x \\ge 3$，所以 $f$ 的定义域为 $[3, \\infty)$；根式的值不为负，所以 $f$ 的值域为 $[1, \\infty)$。因此 $f^{-1}$ 的定义域为 $[1, \\infty)$，值域为 $[3, \\infty)$。事实上 $f(7) = 3$，而 $f^{-1}(3) = 7$ 的输入在 $[1, \\infty)$ 中，输出在 $[3, \\infty)$ 中。`,
  ),
  knowledgePoints: [
    {
      id: "swapping-domain-and-range",
      title: t("Swapping domain and range", "定义域与值域互换"),
      explanation: t(
        "The inverse swaps inputs and outputs. So\n\n- the **domain** of $f^{-1}$ is the **range** of $f$;\n- the **range** of $f^{-1}$ is the **domain** of $f$.\n\nIf $f$ has domain $[0, 4]$ and range $[-3, 5)$, then $f^{-1}$ has domain $[-3, 5)$ and range $[0, 4]$.\n\n> **Watch out.** The domain and range trade places whole, brackets included: a bracket that leaves out an end of the range of $f$ leaves it out of the domain of $f^{-1}$ too.",
        "反函数交换输入与输出。所以\n\n- $f^{-1}$ 的**定义域**是 $f$ 的**值域**；\n- $f^{-1}$ 的**值域**是 $f$ 的**定义域**。\n\n若 $f$ 的定义域为 $[0, 4]$，值域为 $[-3, 5)$，则 $f^{-1}$ 的定义域为 $[-3, 5)$，值域为 $[0, 4]$。\n\n> **注意。** 定义域与值域整体互换，括号也一起换：$f$ 的值域不含的端点，$f^{-1}$ 的定义域也不含。",
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
          solution: join(
            label(1, "Read the domain and range of f", "读出 f 的定义域与值域"),
            t(`$f$ has domain ${setText(dom)} and range ${setText(ran)}.`, `$f$ 的定义域为 ${setText(dom)}，值域为 ${setText(ran)}。`),
            para,
            label(2, "Swap them", "互换"),
            t(
              `The inverse swaps inputs and outputs, so the ${askDomain ? "domain" : "range"} of $f^{-1}$ is the ${askDomain ? "range" : "domain"} of $f$: ${setText(askDomain ? ran : dom)}.`,
              `反函数交换输入与输出，所以 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}是 $f$ 的${askDomain ? "值域" : "定义域"}：${setText(askDomain ? ran : dom)}。`,
            ),
            said(
              `Every point $(a, b)$ of the graph of $f$ has $a$ in ${setText(dom)} and $b$ in ${setText(ran)}. Its swap $(b, a)$ is a point of the graph of $f^{-1}$, so the ${askDomain ? "inputs" : "outputs"} of $f^{-1}$ are exactly the numbers in ${setText(askDomain ? ran : dom)}.`,
              `$f$ 图象上的每个点 $(a, b)$ 都满足 $a$ 属于 ${setText(dom)}，$b$ 属于 ${setText(ran)}。交换后的 $(b, a)$ 是 $f^{-1}$ 图象上的点，所以 $f^{-1}$ 的${askDomain ? "输入" : "输出"}恰好是 ${setText(askDomain ? ran : dom)} 中的数。`,
            ),
          ),
        });
      },
    },
    {
      id: "domain-and-range-from-a-graph",
      figure: algebraDrawings2["domain-and-range-of-inverse-functions#domain-and-range-from-a-graph"],
      title: t("From a graph", "从图象求"),
      explanation: t(
        "Read the domain and range of $f$ from its graph, then swap them. An open dot leaves its coordinate out.\n\nIf the graph of $f$ runs from a filled dot at $(-4, 5)$ down to an open dot at $(3, -1)$, then $f$ has domain $[-4, 3)$ and range $(-1, 5]$, so $f^{-1}$ has domain $(-1, 5]$ and range $[-4, 3)$.\n\n> **Watch out.** Read the range from the heights of the ends, not from the order of the dots. A falling graph has its smallest output at its right end.",
        "从图象读出 $f$ 的定义域与值域，再互换。空心点处的坐标不包含在内。\n\n若 $f$ 的图象从实心点 $(-4, 5)$ 下降到空心点 $(3, -1)$，则 $f$ 的定义域为 $[-4, 3)$，值域为 $(-1, 5]$，所以 $f^{-1}$ 的定义域为 $(-1, 5]$，值域为 $[-4, 3)$。\n\n> **注意。** 值域要看两端的高度，而不是端点的左右顺序。下降的图象，最小的输出在右端。",
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
        const dot = (open: boolean) => (open ? t("an open dot", "空心点") : t("a filled dot", "实心点"));
        return {
          ...intervalProblem({
            prompt: t(
              `${graphShown.en} Find the ${askDomain ? "domain" : "range"} of $f^{-1}$.`,
              `${graphShown["zh-CN"]}求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。`,
            ),
            set: askDomain ? ran : dom,
            wrong: [askDomain ? dom : ran, askDomain ? union(iv(ran[0]!.lo, ran[0]!.hi)) : union(iv(x0, x1))],
            solution: join(
              label(1, "Read the ends of the graph", "读出图象的两端"),
              t(
                `The graph runs from ${dot(openStart).en} at $${pt(x0, y0)}$ to ${dot(openEnd).en} at $${pt(x1, y1)}$, and it only ${y0 < y1 ? "rises" : "falls"} in between.`,
                `图象从 $${pt(x0, y0)}$ 处的${dot(openStart)["zh-CN"]}延伸到 $${pt(x1, y1)}$ 处的${dot(openEnd)["zh-CN"]}，中间一直${y0 < y1 ? "上升" : "下降"}。`,
              ),
              para,
              label(2, "Read the domain and range, then swap", "读出定义域与值域，再互换"),
              t(
                `So $f$ has domain ${setText(dom)} and range ${setText(ran)}. Swapping them, the ${askDomain ? "domain" : "range"} of $f^{-1}$ is ${setText(askDomain ? ran : dom)}.`,
                `所以 $f$ 的定义域为 ${setText(dom)}，值域为 ${setText(ran)}。互换后，$f^{-1}$ 的${askDomain ? "定义域" : "值域"}为 ${setText(askDomain ? ran : dom)}。`,
              ),
              said(
                `Swap the coordinates of the end dots: the graph of $f^{-1}$ runs from $${pt(y0, x0)}$ to $${pt(y1, x1)}$, with the same dots filled or open. Its ${askDomain ? `inputs run between $${y0}$ and $${y1}$` : `outputs run between $${x0}$ and $${x1}$`}, which gives ${setText(askDomain ? ran : dom)}.`,
                `交换两端点的坐标：$f^{-1}$ 的图象从 $${pt(y0, x0)}$ 延伸到 $${pt(y1, x1)}$，端点的实心或空心不变。它的${askDomain ? `输入在 $${y0}$ 与 $${y1}$` : `输出在 $${x0}$ 与 $${x1}$`} 之间，得到 ${setText(askDomain ? ran : dom)}。`,
              ),
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
        "For $f(x) = a\\sqrt{x - h} + k$: the square root needs $x \\ge h$, so the domain is $[h, \\infty)$. The root takes every value $\\ge 0$, so the range is $[k, \\infty)$ when $a > 0$ and $(-\\infty, k]$ when $a < 0$.\n\nFor $f(x) = -2\\sqrt{x + 1} + 3$: domain $[-1, \\infty)$, range $(-\\infty, 3]$. So $f^{-1}$ has domain $(-\\infty, 3]$ and range $[-1, \\infty)$.\n\n> **Watch out.** The domain starts at $h$, the number that makes the radicand $0$, not at $-h$. A negative factor flips the range, not the domain.",
        "对于 $f(x) = a\\sqrt{x - h} + k$：平方根要求 $x \\ge h$，所以定义域为 $[h, \\infty)$。根式取遍所有 $\\ge 0$ 的值，所以 $a > 0$ 时值域为 $[k, \\infty)$，$a < 0$ 时值域为 $(-\\infty, k]$。\n\n对于 $f(x) = -2\\sqrt{x + 1} + 3$：定义域 $[-1, \\infty)$，值域 $(-\\infty, 3]$。所以 $f^{-1}$ 的定义域为 $(-\\infty, 3]$，值域为 $[-1, \\infty)$。\n\n> **注意。** 定义域从 $h$ 开始，即使被开方式为 $0$ 的数，而不是 $-h$。负系数翻转的是值域，不是定义域。",
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
          solution: join(
            label(1, "Find the domain of f", "求 f 的定义域"),
            t(
              `The square root needs $${shifted(h)} \\ge 0$, that is $x \\ge ${h}$. So $f$ has domain ${setText(dom)}.`,
              `平方根要求 $${shifted(h)} \\ge 0$，即 $x \\ge ${h}$。所以 $f$ 的定义域为 ${setText(dom)}。`,
            ),
            para,
            label(2, "Find the range of f, then swap", "求 f 的值域，再互换"),
            t(
              `The root takes every value $\\ge 0$${a < 0 ? " and the negative factor turns it upside down" : ""}, so $f$ has range ${setText(ran)}. So the ${askDomain ? "domain" : "range"} of $f^{-1}$ is the ${askDomain ? "range" : "domain"} of $f$: ${setText(askDomain ? ran : dom)}.`,
              `根式取遍所有 $\\ge 0$ 的值${a < 0 ? "，负系数使它上下翻转" : ""}，所以 $f$ 的值域为 ${setText(ran)}。所以 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}是 $f$ 的${askDomain ? "值域" : "定义域"}：${setText(askDomain ? ran : dom)}。`,
            ),
            said(
              `The graph of $f$ starts at $${pt(h, k)}$, and $f(${h + 1}) = ${a + k}$. Swapping, the graph of $f^{-1}$ starts at $${pt(k, h)}$ and passes through $${pt(a + k, h + 1)}$: it heads ${a > 0 ? "right" : "left"} from $x = ${k}$ and up from $y = ${h}$, which matches ${setText(askDomain ? ran : dom)}.`,
              `$f$ 的图象从 $${pt(h, k)}$ 出发，且 $f(${h + 1}) = ${a + k}$。交换坐标后，$f^{-1}$ 的图象从 $${pt(k, h)}$ 出发并经过 $${pt(a + k, h + 1)}$：它从 $x = ${k}$ 向${a > 0 ? "右" : "左"}、从 $y = ${h}$ 向上延伸，与 ${setText(askDomain ? ran : dom)} 相符。`,
            ),
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
    { topic: "the-vertex-form-of-a-parabola", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.4.D"],
  intro: t(
    `You can find the domain and range of an inverse, locate local extrema, and write a parabola in vertex form. Many useful functions, like parabolas, are not one-to-one, so they have no inverse as they stand. Cutting the domain at a turning point keeps one piece that only rises or only falls, and that piece has an inverse.

Take $f(x) = -(x + 1)^{2} + 5$. Its vertex is $(-1, 5)$, and $f(-3) = f(1) = 1$, so $f$ is not one-to-one. On $x \\le -1$ it only rises, so restricted there it is invertible. Its range is then $(-\\infty, 5]$, so $f^{-1}$ has domain $(-\\infty, 5]$ and range $(-\\infty, -1]$.`,
    `你已经会求反函数的定义域与值域，会找极值点，也会把抛物线写成顶点式。许多有用的函数（比如抛物线）不是一一对应的，原样没有反函数。在转折点处截断定义域，留下只升或只降的一段，这一段就有反函数。

看 $f(x) = -(x + 1)^{2} + 5$。它的顶点是 $(-1, 5)$，并且 $f(-3) = f(1) = 1$，所以 $f$ 不是一一对应的。在 $x \\le -1$ 上它只上升，所以限制在那里它就可逆。这时它的值域为 $(-\\infty, 5]$，所以 $f^{-1}$ 的定义域为 $(-\\infty, 5]$，值域为 $(-\\infty, -1]$。`,
  ),
  knowledgePoints: [
    {
      id: "restricting-parabolas-and-v-shapes",
      figure: algebraDrawings2["invertible-functions#restricting-parabolas-and-v-shapes"],
      title: t("Restricting parabolas and V shapes", "限制抛物线与 V 形图象"),
      explanation: t(
        "A function is **invertible** (has an inverse function) exactly when it is one-to-one: otherwise some output would have to go back to two inputs.\n\n$f(x) = (x - 2)^{2}$ is not one-to-one, but on $[2, \\infty)$ it always increases, and on $(-\\infty, 2]$ it always decreases. Restricting the domain to either half makes it invertible. The largest interval containing $x = 5$ on which $f$ is one-to-one is $[2, \\infty)$. The same works for $a|x - h| + k$, split at $x = h$.\n\n> **Watch out.** The interval starts at the vertex $x = h$, not at the given input. The given input only tells you which side to take.",
        "函数**可逆**（有反函数）当且仅当它是一一对应的：否则某个输出就要对应回两个输入。\n\n$f(x) = (x - 2)^{2}$ 不是一一对应的，但在 $[2, \\infty)$ 上它始终递增，在 $(-\\infty, 2]$ 上始终递减。把定义域限制在任一半上，它就可逆。包含 $x = 5$、使 $f$ 一一对应的最大区间是 $[2, \\infty)$。对 $a|x - h| + k$ 同样在 $x = h$ 处分开。\n\n> **注意。** 区间从顶点 $x = h$ 开始，而不是从给定的输入开始。给定的输入只告诉你取哪一侧。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const c = distinctFrom(rng, -9, 9, h);
        const a = rng.sign() * rng.int(1, 3);
        const k = rng.int(-9, 9);
        const square = rng.bool();
        const latex = square ? sqForm(a, h, k) : absForm(a, h, k);
        const right = c > h;
        const v = square ? a * (c - h) ** 2 + k : a * Math.abs(c - h) + k;
        const side = a > 0 === right ? t("rises", "上升") : t("falls", "下降");
        return intervalProblem({
          prompt: t(
            `Find the largest interval containing $x = ${c}$ on which $f(x) = ${latex}$ is one-to-one.`,
            `求包含 $x = ${c}$、使 $f(x) = ${latex}$ 一一对应的最大区间。`,
          ),
          set: ray(h, right),
          wrong: [ray(h, !right), ray(h, right, false), ray(c, right), ray(-h, right)],
          solution: join(
            label(1, "Find the vertex", "找顶点"),
            t(
              `The graph is ${square ? "a parabola" : "a V shape"} with vertex $${pt(h, k)}$. It is symmetric about $x = ${h}$ and turns there.`,
              `图象是顶点为 $${pt(h, k)}$ 的${square ? "抛物线" : " V 形"}，关于 $x = ${h}$ 对称，并在那里转向。`,
            ),
            para,
            label(2, "Take the side that contains the input", "取包含该输入的一侧"),
            t(
              `On each side of $x = ${h}$ the graph only rises or only falls. The input $${c}$ is on the ${right ? "right" : "left"}, where the graph ${side.en} ${right ? "away from" : "toward"} the vertex. So the interval is ${setText(ray(h, right))}.`,
              `在 $x = ${h}$ 的每一侧，图象只升或只降。输入 $${c}$ 在${right ? "右" : "左"}侧，图象在那里${right ? "离开顶点" : "朝顶点"}${side["zh-CN"]}。所以区间是 ${setText(ray(h, right))}。`,
            ),
            said(
              `The mirror image of $${c}$ in $x = ${h}$ is $${2 * h - c}$, and${disp(`f(${c}) = f(${2 * h - c}) = ${v}`)}\n\nAn interval that reached past $x = ${h}$ could contain both of these inputs. So the interval must stop at the vertex, and on the side of $${c}$ it can run on forever.`,
              `$${c}$ 关于 $x = ${h}$ 的对称点是 $${2 * h - c}$，并且${disp(`f(${c}) = f(${2 * h - c}) = ${v}`)}\n\n越过 $x = ${h}$ 的区间就可能同时含有这两个输入。所以区间必须止于顶点，而在 $${c}$ 那一侧可以一直延伸。`,
            ),
          ),
        });
      },
    },
    {
      id: "restricting-a-graph",
      figure: algebraDrawings2["invertible-functions#restricting-a-graph"],
      title: t("Restricting a graph", "限制图象"),
      explanation: t(
        "On a graph, the function is one-to-one between two neighboring turning points (or a turning point and an endpoint), since it only rises or only falls there. The turning points themselves can be included.\n\nIf a graph turns at $x = -2$ and $x = 3$ and is defined on $[-5, 5]$, the largest interval containing $x = 1$ on which it is one-to-one is $[-2, 3]$.\n\n> **Watch out.** The interval runs between neighboring turning points, not across the whole domain. Include the turning points themselves, since the function is still one-to-one with them.",
        "在图象上，函数在相邻两个转折点之间（或转折点与端点之间）是一一对应的，因为它在那里只升或只降。转折点本身可以包含在内。\n\n若图象在 $x = -2$ 和 $x = 3$ 处转折，定义在 $[-5, 5]$ 上，则包含 $x = 1$、使它一一对应的最大区间是 $[-2, 3]$。\n\n> **注意。** 区间在相邻两个转折点之间，而不是整个定义域。转折点本身要包含在内，因为包含它们时函数仍是一一对应的。",
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
        const rises = valueOn(pts, hi)!.cmp(valueOn(pts, lo)!) > 0;
        const turns = breaks.slice(1, -1);
        const heights = pts.filter((q) => q[0] >= lo && q[0] <= hi).map((q) => q[1]);
        const li = pts.findIndex((q) => q[0] === lo);
        const hiIndex = pts.findIndex((q) => q[0] === hi);
        const left = pts[li - 1];
        const right = pts[hiIndex + 1];
        const beyond = join(
          t(
            `From $x = ${lo}$ to $x = ${hi}$ the vertices have heights $${heights.join(", ")}$, each ${rises ? "larger" : "smaller"} than the one before.`,
            `从 $x = ${lo}$ 到 $x = ${hi}$，各顶点的高度是 $${heights.join(", ")}$，每一个都比前一个${rises ? "大" : "小"}。`,
          ),
          left
            ? t(
                ` Going left from $x = ${lo}$, the graph ${rises ? "rises" : "falls"} again to $f(${left[0]}) = ${left[1]}$.`,
                `从 $x = ${lo}$ 向左，图象又${rises ? "上升" : "下降"}到 $f(${left[0]}) = ${left[1]}$。`,
              )
            : t(` The graph starts at $x = ${lo}$.`, `图象从 $x = ${lo}$ 开始。`),
          right
            ? t(
                ` Going right from $x = ${hi}$, the graph ${rises ? "falls" : "rises"} again to $f(${right[0]}) = ${right[1]}$.`,
                `从 $x = ${hi}$ 向右，图象又${rises ? "下降" : "上升"}到 $f(${right[0]}) = ${right[1]}$。`,
              )
            : t(` The graph ends at $x = ${hi}$.`, `图象在 $x = ${hi}$ 结束。`),
          t(
            " Past a turning point the graph comes back through heights it has already reached, so the interval cannot be any longer.",
            "过了转折点，图象会回到已经达到过的高度，所以区间不能再长。",
          ),
        );
        return annotate(
          {
            ...intervalProblem({
              prompt: t(
                `${graphShown.en} Find the largest interval containing $x = ${c}$ on which $f$ is one-to-one.`,
                `${graphShown["zh-CN"]}求包含 $x = ${c}$、使 $f$ 一一对应的最大区间。`,
              ),
              set,
              wrong,
              solution: join(
                label(1, "Find the turning points", "找转折点"),
                t(
                  `The graph turns at $x = ${turns.join(", ")}$. These points and the ends $x = ${breaks[0]}$ and $x = ${breaks[breaks.length - 1]}$ cut it into pieces that only rise or only fall.`,
                  `图象在 $x = ${turns.join(", ")}$ 处转折。这些点和两端 $x = ${breaks[0]}$、$x = ${breaks[breaks.length - 1]}$ 把图象分成只升或只降的几段。`,
                ),
                para,
                label(2, "Take the piece that contains the input", "取包含该输入的一段"),
                t(
                  `Around $x = ${c}$ the graph only ${rises ? "rises" : "falls"} from $x = ${lo}$, where it ${j === 0 ? "starts" : "turns"}, to $x = ${hi}$, where it ${j === breaks.length - 2 ? "ends" : "turns"}. So the interval is ${setText(set)}.`,
                  `在 $x = ${c}$ 附近，图象从 $x = ${lo}$ 到 $x = ${hi}$ 一直${rises ? "上升" : "下降"}，两端分别是${j === 0 ? "起点" : "转折点"}和${j === breaks.length - 2 ? "终点" : "转折点"}。所以区间是 ${setText(set)}。`,
                ),
                said(beyond.en, beyond["zh-CN"]),
              ),
            }),
            figure: graphFigure([{ name: "f", pts }]),
          },
          view,
          [stretchOf(pts, lo, hi), ...onAxis("x", set, 6)],
          `On ${setAlt(set)} the graph only rises or only falls, and it contains x = ${c}.`,
          `在 ${setAlt(set)} 上图象只升或只降，并且包含 x = ${c}。`,
        );
      },
    },
    {
      id: "inverses-of-restricted-functions",
      title: t("Inverses of restricted functions", "限制后函数的反函数"),
      explanation: t(
        "After restricting the domain, the inverse has domain equal to the range of the restricted function, and range equal to the restricted domain.\n\n$f(x) = (x - 1)^{2} + 4$ with $x \\le 1$ has range $[4, \\infty)$. So $f^{-1}$ has domain $[4, \\infty)$ and range $(-\\infty, 1]$.\n\n> **Watch out.** The range of the inverse is the restricted domain, not the range of the whole parabola. The direction of the restriction decides it.",
        "限制定义域后，反函数的定义域是限制后函数的值域，值域是限制后的定义域。\n\n$f(x) = (x - 1)^{2} + 4$（$x \\le 1$）的值域为 $[4, \\infty)$。所以 $f^{-1}$ 的定义域为 $[4, \\infty)$，值域为 $(-\\infty, 1]$。\n\n> **注意。** 反函数的值域是限制后的定义域，而不是整条抛物线的值域。限制的方向决定了它。",
      ),
      generate(rng) {
        const h = rng.nonZero(-7, 7);
        const k = distinctFrom(rng, -9, 9, h);
        const a = rng.bool(0.7) ? 1 : -1;
        const right = rng.bool();
        const askDomain = rng.bool();
        const dom = ray(h, right);
        const ran = ray(k, a > 0);
        const step = right ? 1 : -1;
        return intervalProblem({
          prompt: t(
            `$f(x) = ${sqForm(a, h, k)}$ with domain $x ${right ? "\\ge" : "\\le"} ${h}$. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$.`,
            `$f(x) = ${sqForm(a, h, k)}$，定义域为 $x ${right ? "\\ge" : "\\le"} ${h}$。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}。`,
          ),
          set: askDomain ? ran : dom,
          wrong: [askDomain ? dom : ran, askDomain ? ray(k, a < 0) : ray(h, !right), askDomain ? ray(h, right) : ray(k, right)],
          solution: join(
            label(1, "Find the range of the restricted function", "求限制后函数的值域"),
            t(
              `The vertex is $${pt(h, k)}$, at the end of the domain, and the parabola opens ${a > 0 ? "up" : "down"}. So the half that remains starts at height $${k}$ and goes ${a > 0 ? "up" : "down"} forever, and the range of $f$ is ${setText(ran)}.`,
              `顶点 $${pt(h, k)}$ 在定义域的端点处，抛物线开口向${a > 0 ? "上" : "下"}。所以剩下的半支从高度 $${k}$ 开始一直向${a > 0 ? "上" : "下"}延伸，$f$ 的值域为 ${setText(ran)}。`,
            ),
            para,
            label(2, "Swap domain and range", "互换定义域与值域"),
            t(
              `The ${askDomain ? "domain" : "range"} of $f^{-1}$ is the ${askDomain ? "range" : "domain"} of $f$: ${setText(askDomain ? ran : dom)}.`,
              `$f^{-1}$ 的${askDomain ? "定义域" : "值域"}是 $f$ 的${askDomain ? "值域" : "定义域"}：${setText(askDomain ? ran : dom)}。`,
            ),
            said(
              `The input $${h + step}$ is in the domain, and $f(${h + step}) = ${a + k}$. So the graph of $f^{-1}$ starts at $${pt(k, h)}$ and passes through $${pt(a + k, h + step)}$. Its input $${a + k}$ is in ${setText(ran)}, and its output $${h + step}$ is in ${setText(dom)}.`,
              `输入 $${h + step}$ 在定义域中，且 $f(${h + step}) = ${a + k}$。所以 $f^{-1}$ 的图象从 $${pt(k, h)}$ 出发并经过 $${pt(a + k, h + step)}$。它的输入 $${a + k}$ 在 ${setText(ran)} 中，输出 $${h + step}$ 在 ${setText(dom)} 中。`,
            ),
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
