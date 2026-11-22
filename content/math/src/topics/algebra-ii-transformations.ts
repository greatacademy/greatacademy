import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Interval,
  intervalLatex,
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
  union,
} from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { annotate, at, plain, pointMove, shift } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, steps } from "../problems.ts";
import { chain, stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** cap capitalizes the first letter of an English sentence. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** label opens a step of a solution in the language of the text: "**Step 1: Shift.**". */
const label = (i: number, en: string, zh: string) => stepLabel(i, en, zh);

/** shuffled builds a choice problem from options whose first is correct, dropping repeated options. */
function shuffled(rng: Rng, prompt: Text, options: readonly Text[], solution: Text): Problem {
  const distinct = options.filter((o, i) => options.findIndex((p) => p.en === o.en) === i).slice(0, 4);
  const order = rng.shuffle(range(0, distinct.length - 1));
  return choiceProblem({ prompt, options: order.map((i) => distinct[i]!), correct: order.indexOf(0), solution });
}

// Transformations.

/** Tf is the transformation g(x) = a·f(b(x − h)) + k of a function f. */
interface Tf {
  readonly a: Q;
  readonly b: Q;
  readonly h: Q;
  readonly k: Q;
}

/** tf builds a transformation; missing parameters leave the graph unchanged. */
function tf(p: { a?: Coefficient; b?: Coefficient; h?: Coefficient; k?: Coefficient }): Tf {
  return { a: toQ(p.a ?? 1), b: toQ(p.b ?? 1), h: toQ(p.h ?? 0), k: toQ(p.k ?? 0) };
}

/** argLatex writes the argument b(x − h): "x - 3", "2x", "-x", "2(x + 1)". */
function argLatex(b: Q, h: Q): string {
  if (h.isZero()) return `${front(b)}x`;
  if (b.eq(Q.one)) return shifted(h);
  return `${front(b)}(${shifted(h)})`;
}

/** tfLatex writes a·f(b(x − h)) + k: "2f(x - 3) + 1", "-f(-x)". */
const tfLatex = (g: Tf, name = "f") => `${front(g.a)}${name}(${argLatex(g.b, g.h)})${plus(g.k)}`;

/** linLatex writes a·f(bx + c) + d with the argument expanded: "2f(3x - 6) + 1". */
const linLatex = (a: Q, b: Q, c: Q, d: Q, name = "f") => `${front(a)}${name}(${linear(b, c)})${plus(d)}`;

/** mapPoint is the point of the graph of g that comes from the point (x, y) of the graph of f. */
const mapPoint = (g: Tf, [x, y]: readonly [Q, Q]): [Q, Q] => [x.div(g.b).add(g.h), g.a.mul(y).add(g.k)];

/** unmapPoint is the point of the graph of f that the point (u, v) of the graph of g comes from. */
const unmapPoint = (g: Tf, [u, v]: readonly [Q, Q]): [Q, Q] => [g.b.mul(u.sub(g.h)), v.sub(g.k).div(g.a)];

/** Op is one elementary transformation of a graph. */
type Op =
  | { readonly kind: "up"; readonly by: Q }
  | { readonly kind: "right"; readonly by: Q }
  | { readonly kind: "vertical"; readonly by: Q }
  | { readonly kind: "horizontal"; readonly by: Q }
  | { readonly kind: "x-axis" }
  | { readonly kind: "y-axis" };

const up = (by: Coefficient): Op => ({ kind: "up", by: toQ(by) });
const right = (by: Coefficient): Op => ({ kind: "right", by: toQ(by) });
const vertical = (by: Coefficient): Op => ({ kind: "vertical", by: toQ(by) });
const horizontal = (by: Coefficient): Op => ({ kind: "horizontal", by: toQ(by) });
const xAxis: Op = { kind: "x-axis" };
const yAxis: Op = { kind: "y-axis" };

/** applyOp applies one more operation after the transformation g. */
function applyOp(g: Tf, op: Op): Tf {
  switch (op.kind) {
    case "up":
      return { ...g, k: g.k.add(op.by) };
    case "vertical":
      return { ...g, a: g.a.mul(op.by), k: g.k.mul(op.by) };
    case "x-axis":
      return { ...g, a: g.a.neg(), k: g.k.neg() };
    case "right":
      return { ...g, h: g.h.add(op.by) };
    case "horizontal":
      return { ...g, b: g.b.div(op.by), h: g.h.mul(op.by) };
    case "y-axis":
      return { ...g, b: g.b.neg(), h: g.h.neg() };
  }
}

/** compose applies operations in order, starting from f itself. */
const compose = (ops: readonly Op[]): Tf => ops.reduce(applyOp, tf({}));

/** units writes "3 units" or "1 unit". */
const units = (v: Q) => `$${v.abs().toLatex()}$ unit${v.abs().eq(Q.one) ? "" : "s"}`;

/** opText describes one operation. */
function opText(op: Op): Text {
  switch (op.kind) {
    case "up":
      return op.by.sign() > 0
        ? t(`shift up ${units(op.by)}`, `向上平移 $${op.by.toLatex()}$ 个单位`)
        : t(`shift down ${units(op.by)}`, `向下平移 $${op.by.neg().toLatex()}$ 个单位`);
    case "right":
      return op.by.sign() > 0
        ? t(`shift right ${units(op.by)}`, `向右平移 $${op.by.toLatex()}$ 个单位`)
        : t(`shift left ${units(op.by)}`, `向左平移 $${op.by.neg().toLatex()}$ 个单位`);
    case "vertical":
      return op.by.cmp(Q.one) > 0
        ? t(`stretch vertically by a factor of $${op.by.toLatex()}$`, `竖直方向伸长为原来的 $${op.by.toLatex()}$ 倍`)
        : t(`compress vertically by a factor of $${op.by.toLatex()}$`, `竖直方向压缩为原来的 $${op.by.toLatex()}$`);
    case "horizontal":
      return op.by.cmp(Q.one) > 0
        ? t(`stretch horizontally by a factor of $${op.by.toLatex()}$`, `水平方向伸长为原来的 $${op.by.toLatex()}$ 倍`)
        : t(`compress horizontally by a factor of $${op.by.toLatex()}$`, `水平方向压缩为原来的 $${op.by.toLatex()}$`);
    case "x-axis":
      return t("reflect in the $x$-axis", "关于 $x$ 轴翻折");
    case "y-axis":
      return t("reflect in the $y$-axis", "关于 $y$ 轴翻折");
  }
}

/** opsText describes operations in order: "Shift right 2 units, then shift up 1 unit." */
function opsText(ops: readonly Op[]): Text {
  const texts = ops.map(opText);
  return t(`${cap(texts.map((x) => x.en).join(", then "))}.`, `${texts.map((x) => x["zh-CN"]).join("，再")}。`);
}

/** opHow says what one operation does to the formula written so far. */
function opHow(op: Op): Text {
  switch (op.kind) {
    case "up":
      return op.by.sign() < 0
        ? t(`subtract $${op.by.neg().toLatex()}$ from the whole formula`, `给整个式子减去 $${op.by.neg().toLatex()}$`)
        : t(`add $${op.by.toLatex()}$ to the whole formula`, `给整个式子加上 $${op.by.toLatex()}$`);
    case "vertical":
      return t(`multiply the whole formula by $${op.by.toLatex()}$`, `把整个式子乘以 $${op.by.toLatex()}$`);
    case "x-axis":
      return t("multiply the whole formula by $-1$", "把整个式子乘以 $-1$");
    case "right":
      return t(`replace $x$ with $${shifted(op.by)}$`, `把 $x$ 换成 $${shifted(op.by)}$`);
    case "horizontal":
      return t(`replace $x$ with $${front(Q.one.div(op.by))}x$`, `把 $x$ 换成 $${front(Q.one.div(op.by))}x$`);
    case "y-axis":
      return t("replace $x$ with $-x$", "把 $x$ 换成 $-x$");
  }
}

/** trail lists where a point of f is after each operation in turn. */
const trail = (ops: readonly Op[], p: readonly [Q, Q]): [Q, Q][] => ops.map((_, i) => mapPoint(compose(ops.slice(0, i + 1)), p));

/** argAt works out the input b(x − h) of f at a number x: "2(4 - 3) = 2". */
function argAt(g: Tf, x: Q): string {
  const v = g.b.mul(x.sub(g.h));
  if (g.b.eq(Q.one) && g.h.isZero()) return num(v);
  if (g.b.eq(Q.one)) return `${num(x)}${plus(g.h.neg())} = ${num(v)}`;
  if (g.h.isZero()) return `${g.b.eq(Q.of(-1)) ? `-(${num(x)})` : `${g.b.toLatex()} \\cdot ${paren(x)}`} = ${num(v)}`;
  return `${front(g.b)}(${num(x)}${plus(g.h.neg())}) = ${num(v)}`;
}

/** addText says to add a number, or to subtract its size when it is negative. */
const addText = (v: Q): Text =>
  v.sign() < 0 ? t(`subtract $${v.neg().toLatex()}$`, `减去 $${v.neg().toLatex()}$`) : t(`add $${v.toLatex()}$`, `加上 $${v.toLatex()}$`);

/** outAt writes the output a·y + k of g once f has given y: "2 \cdot 3 + 1". */
function outAt(g: Tf, y: Q): string {
  if (g.a.eq(Q.one)) return `${num(y)}${plus(g.k)}`;
  return `${g.a.eq(Q.of(-1)) ? "-" : `${g.a.toLatex()} \\cdot `}${paren(y)}${plus(g.k)}`;
}

/** standardOps lists the operations that give a·f(b(x − h)) + k from f: horizontal ones, then vertical ones. */
function standardOps(g: Tf): Op[] {
  const ops: Op[] = [];
  if (g.b.sign() < 0) ops.push(yAxis);
  if (!g.b.abs().eq(Q.one)) ops.push(horizontal(Q.one.div(g.b.abs())));
  if (!g.h.isZero()) ops.push(right(g.h));
  if (g.a.sign() < 0) ops.push(xAxis);
  if (!g.a.abs().eq(Q.one)) ops.push(vertical(g.a.abs()));
  if (!g.k.isZero()) ops.push(up(g.k));
  return ops;
}

// Graphs made of line segments.

const view: PlaneView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** fits tells whether every point lies in the square [-m, m]². */
const fits = (pts: readonly Point[], m = 7) => pts.every(([x, y]) => Math.abs(x) <= m && Math.abs(y) <= m);

const collinear = (p: Point, q: Point, r: Point) => (q[0] - p[0]) * (r[1] - p[1]) === (q[1] - p[1]) * (r[0] - p[0]);

/**
 * randomGraph draws the vertices of a graph made of line segments: n vertices with x-coordinates that are multiples of
 * xStep in [xLo, xHi], y-coordinates that are multiples of yStep in [yLo, yHi], and no three consecutive vertices on a line.
 */
function randomGraph(rng: Rng, xLo: number, xHi: number, yLo: number, yHi: number, xStep = 1, yStep = 1): Point[] {
  const xs = range(Math.ceil(xLo / xStep), Math.floor(xHi / xStep));
  const ys = range(Math.ceil(yLo / yStep), Math.floor(yHi / yStep));
  for (;;) {
    const n = rng.int(3, Math.min(5, xs.length));
    const px = rng.sample(xs, n).sort((a, b) => a - b);
    const pts = px.map((x): Point => [x * xStep, rng.pick(ys) * yStep]);
    if (pts.every((p, i) => i < 2 || !collinear(pts[i - 2]!, pts[i - 1]!, p))) return pts;
  }
}

/** mapGraph maps the vertices of f to those of g, in increasing order of x, or undefined when one is not a lattice point. */
function mapGraph(g: Tf, pts: readonly Point[]): Point[] | undefined {
  const out: Point[] = [];
  for (const [x, y] of pts) {
    const [u, v] = mapPoint(g, [Q.of(x), Q.of(y)]);
    if (!u.isInteger() || !v.isInteger()) return undefined;
    out.push([u.toNumber(), v.toNumber()]);
  }
  return out.sort((p, q) => p[0] - q[0]);
}

/** imageKey identifies the graph of g for f made of line segments: two transformations give the same graph exactly when their keys agree. */
function imageKey(g: Tf, pts: readonly Point[]): string {
  return pts
    .map(([x, y]) => mapPoint(g, [Q.of(x), Q.of(y)]))
    .sort((p, q) => p[0].cmp(q[0]))
    .map(([x, y]) => `${x},${y}`)
    .join(";");
}

const pointText = ([x, y]: Point) => `(${x}, ${y})`;

function segments(pts: readonly Point[], dashed: boolean): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let i = 0; i + 1 < pts.length; i++) marks.push({ kind: "segment", a: pts[i]!, b: pts[i + 1]!, accent: !dashed, dashed });
  marks.push({ kind: "point", at: pts[0]!, accent: !dashed });
  marks.push({ kind: "point", at: pts[pts.length - 1]!, accent: !dashed });
  return marks;
}

/** graphFigure draws the graph of f, solid, and optionally the graph of g, dashed, each made of line segments between filled end dots. */
function graphFigure(f: readonly Point[], g?: readonly Point[]): Figure {
  const fEn = `the graph of f, line segments through ${f.map(pointText).join(", ")}`;
  const fZh = `f 的图象，依次经过 ${f.map(pointText).join("、")} 的折线`;
  if (!g) return { svg: plane(view, segments(f, false)), alt: t(`${cap(fEn)}, with filled dots at both ends.`, `${fZh}，两端为实心点。`) };
  return {
    svg: plane(view, [...segments(f, false), ...segments(g, true)]),
    alt: t(
      `Solid: ${fEn}. Dashed: the graph of g, line segments through ${g.map(pointText).join(", ")}. Both have filled dots at their ends.`,
      `实线：${fZh}。虚线：g 的图象，依次经过 ${g.map(pointText).join("、")} 的折线。两端都是实心点。`,
    ),
  };
}

/** valueOn is the value at x of a graph made of segments, if x is in its domain. */
function valueOn(pts: readonly Point[], x: number): Q | undefined {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    if (x >= x0 && x <= x1) return Q.of(y0).add(Q.of((y1 - y0) * (x - x0), x1 - x0));
  }
  return undefined;
}

/** pairCase draws a graph of f and a transformation from make whose image is a lattice graph inside the view. */
function pairCase(
  rng: Rng,
  make: () => Tf,
  box: {
    readonly x?: readonly [number, number];
    readonly y?: readonly [number, number];
    readonly xStep?: number;
    readonly yStep?: number;
  } = {},
): { f: Point[]; g: Point[]; tf: Tf } {
  const [xLo, xHi] = box.x ?? [-5, 5];
  const [yLo, yHi] = box.y ?? [-5, 5];
  for (;;) {
    const g = make();
    const f = randomGraph(rng, xLo, xHi, yLo, yHi, box.xStep, box.yStep);
    const image = mapGraph(g, f);
    if (image && fits(image) && image.some((p, i) => p[0] !== f[i]![0] || p[1] !== f[i]![1])) return { f, g: image, tf: g };
  }
}

const solidDashed = (what: string, whatZh: string) =>
  t(`The graph of $f$ is solid and the graph of $g$ is dashed. ${what}`, `图中实线是 $f$ 的图象，虚线是 $g$ 的图象。${whatZh}`);

// Polynomials with rational coefficients, from the constant term up.

type QPoly = readonly Q[];

function pAdd(a: QPoly, b: QPoly): QPoly {
  return range(0, Math.max(a.length, b.length) - 1).map((i) => (a[i] ?? Q.zero).add(b[i] ?? Q.zero));
}

function pMul(a: QPoly, b: QPoly): QPoly {
  const out = new Array<Q>(a.length + b.length - 1).fill(Q.zero);
  a.forEach((x, i) => {
    b.forEach((y, j) => {
      out[i + j] = out[i + j]!.add(x.mul(y));
    });
  });
  return out;
}

const pScale = (p: QPoly, c: Q): QPoly => p.map((x) => x.mul(c));

/** pCompose is f(g(x)). */
function pCompose(f: QPoly, g: QPoly): QPoly {
  let out: QPoly = [Q.zero];
  let power: QPoly = [Q.one];
  for (const c of f) {
    out = pAdd(out, pScale(power, c));
    power = pMul(power, g);
  }
  return out;
}

const pAt = (p: QPoly, x: Q) => p.reduce((acc, c, i) => acc.add(c.mul(x.pow(i))), Q.zero);

/** pLatex writes a polynomial from its highest power down: "2x^{2} - x + 3". */
function pLatex(p: QPoly): string {
  const terms: [Q, string][] = [];
  for (let i = p.length - 1; i >= 0; i--) terms.push([p[i]!, i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`]);
  return poly(...terms);
}

/** transformPoly is a·f(b(x − h)) + k for a polynomial f. */
const transformPoly = (f: QPoly, g: Tf): QPoly => pAdd(pScale(pCompose(f, [g.b.mul(g.h).neg(), g.b]), g.a), [g.k]);

const tfPoly = (f: QPoly, g: Tf) => pLatex(transformPoly(f, g));

/** substituted writes the quadratic f with a binomial in place of x: "(x + 4)^{2} + 4(x + 4) + 6". */
function substituted(f: QPoly, inner: string): string {
  const [c, b, a] = f as [Q, Q, Q];
  const middle = b.sign() < 0 ? ` - ${front(b.neg())}` : ` + ${front(b)}`;
  return `${front(a)}(${inner})^{2}${middle}(${inner})${plus(c)}`;
}

/** randomQuadratic draws ax² + bx + c with small integer coefficients, b and c nonzero. */
function randomQuadratic(rng: Rng): QPoly {
  return [rng.nonZero(-9, 9), rng.nonZero(-6, 6), rng.pick([1, 1, -1, 2, -2])].map((n) => Q.of(n));
}

const fIs = (f: QPoly) => `$f(x) = ${pLatex(f)}$`;

// Values.

const stretchFactors: readonly Q[] = [Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2)];

/** randomPoint draws a lattice point with coordinates in [-9, 9]. */
const randomPoint = (rng: Rng): [Q, Q] => [Q.of(rng.int(-9, 9)), Q.of(rng.int(-9, 9))];

/** pointQuestion asks for the image of a point of f on the graph of g. */
const pointQuestion = (p: readonly [Q, Q], g: string) =>
  t(
    `The point $${pt(p[0], p[1])}$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = ${g}$?`,
    `点 $${pt(p[0], p[1])}$ 在 $y = f(x)$ 的图象上。哪个点一定在 $y = ${g}$ 的图象上？`,
  );

/** imageProblem asks for the image of a point under a transformation, with the given wrong transformations. */
function imageProblem(p: readonly [Q, Q], g: Tf, wrongTfs: readonly Tf[], solution: Text, written = tfLatex(g)): Problem {
  const [u, v] = mapPoint(g, p);
  return {
    ...pointProblem({
      prompt: pointQuestion(p, written),
      answer: [u, v],
      wrong: [...wrongTfs.map((w) => mapPoint(w, p)), [p[1], p[0]]],
      solution,
    }),
    solutionFigure: pointMove([p[0].toNumber(), p[1].toNumber()], [u.toNumber(), v.toNumber()]),
  };
}

/** imageMarks draws the arrow from a point of f to the same point of g. */
const imageMarks = (g: Tf, p: Point) => {
  const [u, v] = mapPoint(g, [Q.of(p[0]), Q.of(p[1])]);
  return shift(p, [u.toNumber(), v.toNumber()]);
};

/** imageAlt says where a point of f goes on g, in both languages, for alt text. */
const imageAlt = (g: Tf, p: Point): [string, string] => {
  const [u, v] = mapPoint(g, [Q.of(p[0]), Q.of(p[1])]);
  return [
    `The point ${at(p)} of f moves to (${plain(u)}, ${plain(v)}) on g.`,
    `f 上的点 ${at(p)} 移到 g 上的 (${plain(u)}, ${plain(v)})。`,
  ];
};

// 3.10.1 Vertical translations.

/** verticalTranslationsOfFunctions shifts graphs up and down with y = f(x) + k. */
export const verticalTranslationsOfFunctions: TopicDef = {
  id: "vertical-translations-of-functions",
  title: t("Vertical Translations of Functions", "函数图象的上下平移"),
  summary: t(
    "Shift the graph of any function up or down: y = f(x) + k moves every point k units vertically.",
    "把任意函数的图象上下平移：y = f(x) + k 把每个点竖直移动 k 个单位。",
  ),
  prerequisites: ["absolute-value-graphs", "the-vertex-form-of-a-parabola"],
  encompasses: [{ topic: "graphs-of-functions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We have seen that the graph of $y = |x| + 2$ is the V of $y = |x|$ moved up, with its vertex at $(0, 2)$, and that $y = (x - 3)^{2} + 1$ is a parabola with vertex $(3, 1)$. Those were special cases of one idea that works for **every** function.

Take $f(x) = |x|$ and $g(x) = f(x) + 2$. For each input, $g$ gives the output of $f$ plus $2$:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 2 & 1 & 0 & 1 & 2 \\\\ g(x) & 4 & 3 & 2 & 3 & 4 \\end{array}$$

Every point of the graph of $f$ moves $2$ units straight up: $(-1, 1)$ goes to $(-1, 3)$ and the vertex $(0, 0)$ goes to $(0, 2)$. Check: $g(-1) = |-1| + 2 = 3$.

In this lesson we move points, write the equation of a shifted function, and read the shift off two graphs.`,
    `我们已经看到，$y = |x| + 2$ 的图象是 $y = |x|$ 的 V 形向上移动得到的，顶点在 $(0, 2)$；$y = (x - 3)^{2} + 1$ 是顶点为 $(3, 1)$ 的抛物线。这些都是同一个想法的特例，而这个想法对**任何**函数都成立。

取 $f(x) = |x|$，$g(x) = f(x) + 2$。对每个输入，$g$ 给出 $f$ 的输出再加 $2$：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 2 & 1 & 0 & 1 & 2 \\\\ g(x) & 4 & 3 & 2 & 3 & 4 \\end{array}$$

$f$ 的图象上每个点都竖直向上移动 $2$ 个单位：$(-1, 1)$ 移到 $(-1, 3)$，顶点 $(0, 0)$ 移到 $(0, 2)$。检验：$g(-1) = |-1| + 2 = 3$。

这节课我们移动点，写出平移后函数的解析式，并从两个图象读出平移量。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-vertical-translation",
      figure: algebraDrawings2["vertical-translations-of-functions#points-under-a-vertical-translation"],
      title: t("Moving points up and down", "上下移动点"),
      explanation: t(
        `The graph of $y = f(x) + k$ has the same inputs as $y = f(x)$, but every output is $k$ more. So every point $(x, y)$ of the graph of $f$ moves to $(x, y + k)$: the graph shifts **up** $k$ units when $k > 0$ and **down** $|k|$ units when $k < 0$.

If $(2, 5)$ is on the graph of $y = f(x)$, then $f(2) = 5$, so at $x = 2$ the function $f(x) - 3$ is $5 - 3 = 2$: the point $(2, 2)$ is on the graph of $y = f(x) - 3$.

> **Watch out.** A number added **outside** $f$ changes only $y$, in the direction of its sign: $- 3$ moves down, not up. It does not move the point left or right, and the coordinates don't swap.`,
        `$y = f(x) + k$ 与 $y = f(x)$ 的输入相同，但每个输出都多了 $k$。所以 $f$ 的图象上每个点 $(x, y)$ 都移到 $(x, y + k)$：$k > 0$ 时图象向**上**平移 $k$ 个单位，$k < 0$ 时向**下**平移 $|k|$ 个单位。

若 $(2, 5)$ 在 $y = f(x)$ 的图象上，则 $f(2) = 5$，所以 $x = 2$ 时 $f(x) - 3$ 的值是 $5 - 3 = 2$：点 $(2, 2)$ 在 $y = f(x) - 3$ 的图象上。

> **注意。** 加在 $f$ **外面**的数只改变 $y$，方向与它的符号一致：$- 3$ 是向下移动，不是向上。它不会让点左右移动，坐标也不会对调。`,
      ),
      generate(rng) {
        const p = randomPoint(rng);
        const k = rng.nonZero(-9, 9);
        const g = tf({ k });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ k: -k }), tf({ h: k }), tf({ h: -k })],
          t(
            `${label(1, "Read the change", "看变化").en} Since $${pt(p[0], p[1])}$ is on the graph of $f$, $f(${num(p[0])}) = ${num(p[1])}$. In $f(x)${plus(k)}$ the input stays the same and the output ${k > 0 ? "gains" : "loses"} $${Math.abs(k)}$.

${label(2, "Move the point", "移动点").en} Keep $x = ${num(p[0])}$ and ${k > 0 ? "add" : "subtract"} $${Math.abs(k)}$ to the $y$-coordinate: the point moves ${k > 0 ? "up" : "down"} ${units(Q.of(k))}.${steps(`${chain(`${num(p[1])}${plus(k)}`, num(y))}`)}The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$, $f(${num(x)})${plus(k)} = ${num(p[1])}${plus(k)} = ${num(y)}$, the $y$-coordinate found.`,
            `${label(1, "Read the change", "看变化")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 的图象上，$f(${num(p[0])}) = ${num(p[1])}$。在 $f(x)${plus(k)}$ 中输入不变，输出${k > 0 ? "增加" : "减少"} $${Math.abs(k)}$。

${label(2, "Move the point", "移动点")["zh-CN"]} $x = ${num(p[0])}$ 不变，$y$ 坐标${k > 0 ? "加上" : "减去"} $${Math.abs(k)}$：点向${k > 0 ? "上" : "下"}移动 $${Math.abs(k)}$ 个单位。${steps(`${chain(`${num(p[1])}${plus(k)}`, num(y))}`)}所求的点是 $${pt(x, y)}$。

**检验。** $x = ${num(x)}$ 时，$f(${num(x)})${plus(k)} = ${num(p[1])}${plus(k)} = ${num(y)}$，正是求得的 $y$ 坐标。`,
          ),
        );
      },
    },
    {
      id: "equations-of-vertical-translations",
      figure: algebraDrawings2["vertical-translations-of-functions#equations-of-vertical-translations"],
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        `To shift the graph of $f$ up by $k$ units, every output must grow by $k$, so add $k$ to the whole function: $g(x) = f(x) + k$. To shift it down, subtract. Only the constant term changes.

For $f(x) = x^2 - 4x + 1$ shifted down $5$ units:

$$g(x) = f(x) - 5 = x^2 - 4x + 1 - 5 = x^2 - 4x - 4$$

Check at $x = 0$: $f(0) = 1$ and $g(0) = -4$, which is $5$ less.

> **Watch out.** Down means subtract: shifting down $5$ is $f(x) - 5$, not $f(x) + 5$. Don't put the number inside, as in $f(x - 5)$: that moves the graph sideways. And the answer must change: $g$ is not $f$ again.`,
        `要把 $f$ 的图象向上平移 $k$ 个单位，每个输出都要增加 $k$，所以给整个函数加上 $k$：$g(x) = f(x) + k$。向下平移就减去。只有常数项改变。

把 $f(x) = x^2 - 4x + 1$ 向下平移 $5$ 个单位：

$$g(x) = f(x) - 5 = x^2 - 4x + 1 - 5 = x^2 - 4x - 4$$

用 $x = 0$ 检验：$f(0) = 1$，$g(0) = -4$，正好少 $5$。

> **注意。** 向下就是减：向下平移 $5$ 是 $f(x) - 5$，不是 $f(x) + 5$。不要把这个数放进括号里，例如 $f(x - 5)$，那是左右移动。答案也必须有变化：$g$ 不是 $f$ 本身。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const k = rng.nonZero(-9, 9);
        const g = tf({ k });
        const answer = tfPoly(f, g);
        const c0 = f[0]!;
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the graph of $f$ shifted ${k > 0 ? "up" : "down"} ${units(Q.of(k))}. Find $g(x)$.`,
            `设 ${fIs(f)}。把 $f$ 的图象向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位得到 $g$ 的图象。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ k: -k })), tfPoly(f, tf({ h: k })), tfPoly(f, tf({ h: -k })), pLatex(f)],
          solution: t(
            `${label(1, "Change the output", "改变输出").en} Shifting ${k > 0 ? "up" : "down"} ${units(Q.of(k))} ${k > 0 ? "adds" : "subtracts"} $${Math.abs(k)}$ ${k > 0 ? "to" : "from"} every output, so $g(x) = f(x)${plus(k)}$.

${label(2, "Combine the constants", "合并常数").en} Only the constant term changes: $${num(c0)}${plus(k)} = ${num(c0.add(Q.of(k)))}$.${steps(`g(x) = ${pLatex(f)}${plus(k)}`, `= ${answer}`)}**Check.** $f(0) = ${num(c0)}$ and $g(0) = ${num(c0.add(Q.of(k)))}$, which is ${units(Q.of(k))} ${k > 0 ? "higher" : "lower"}.`,
            `${label(1, "Change the output", "改变输出")["zh-CN"]} 向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位，就是每个输出${k > 0 ? "加上" : "减去"} $${Math.abs(k)}$，所以 $g(x) = f(x)${plus(k)}$。

${label(2, "Combine the constants", "合并常数")["zh-CN"]} 只有常数项改变：$${num(c0)}${plus(k)} = ${num(c0.add(Q.of(k)))}$。${steps(`g(x) = ${pLatex(f)}${plus(k)}`, `= ${answer}`)}**检验。** $f(0) = ${num(c0)}$，$g(0) = ${num(c0.add(Q.of(k)))}$，${k > 0 ? "高了" : "低了"} $${Math.abs(k)}$ 个单位。`,
          ),
        });
      },
    },
    {
      id: "vertical-translations-from-graphs",
      figure: algebraDrawings2["vertical-translations-of-functions#vertical-translations-from-graphs"],
      title: t("Reading the shift from graphs", "从图象读出平移量"),
      explanation: t(
        `When the graph of $g$ is the graph of $f$ shifted vertically, the two graphs have the same shape and the same $x$-values; only the heights differ, by the same amount everywhere. So compare one point of $f$ with the point of $g$ directly above or below it. If $(1, -2)$ is on $f$ and $(1, 2)$ is on $g$, the height changed by $2 - (-2) = 4$, so every point moved up $4$ units and $g(x) = f(x) + 4$.

> **Watch out.** Subtract in the order $g$ minus $f$: when the dashed graph of $g$ is **below** $f$, $k$ is negative. Compare points with the same $x$, such as matching corners, not points that only look close.`,
        `如果 $g$ 的图象是 $f$ 的图象上下平移得到的，两个图象形状相同，$x$ 值也相同，只有高度不同，而且处处差同样多。所以比较 $f$ 上的一个点和 $g$ 上正上方或正下方对应的点。若 $(1, -2)$ 在 $f$ 上、$(1, 2)$ 在 $g$ 上，高度变化了 $2 - (-2) = 4$，所以每个点都向上移动了 $4$ 个单位，$g(x) = f(x) + 4$。

> **注意。** 按 $g$ 减 $f$ 的顺序相减：$g$ 的虚线在 $f$ **下方**时，$k$ 是负数。要比较 $x$ 相同的对应点，例如对应的拐点，而不是看起来接近的点。`,
      ),
      generate(rng) {
        const c = pairCase(rng, () => tf({ k: rng.nonZero(-6, 6) }), { y: [-4, 4] });
        const k = c.tf.k;
        const [x, y] = c.f[0]!;
        const y1 = k.add(Q.of(y));
        const [xl, yl] = c.f[c.f.length - 1]!;
        return annotate(
          {
            ...numberProblem({
              prompt: solidDashed("Given that $g(x) = f(x) + k$, find $k$.", "已知 $g(x) = f(x) + k$，求 $k$。"),
              answer: k,
              wrong: [k.neg()],
              solution: t(
                `${label(1, "Match a point", "找对应点").en} Take the left endpoint $${pt(x, y)}$ of $f$. A vertical shift keeps $x$, so its image is the left endpoint of $g$, $${pt(x, y1)}$, directly ${k.sign() > 0 ? "above" : "below"} it.

${label(2, "Subtract the heights", "高度相减").en} $k$ is the height on $g$ minus the height on $f$:${steps(`k = ${num(y1)} - ${paren(y)} = ${k.toLatex()}`)}**Check.** The right endpoint $${pt(xl, yl)}$ of $f$ should move to $${pt(xl, k.add(Q.of(yl)))}$, and it does: that is the right endpoint of $g$.`,
                `${label(1, "Match a point", "找对应点")["zh-CN"]} 取 $f$ 的左端点 $${pt(x, y)}$。上下平移不改变 $x$，所以它的像是 $g$ 的左端点 $${pt(x, y1)}$，在它的正${k.sign() > 0 ? "上" : "下"}方。

${label(2, "Subtract the heights", "高度相减")["zh-CN"]} $k$ 等于 $g$ 上的高度减去 $f$ 上的高度：${steps(`k = ${num(y1)} - ${paren(y)} = ${k.toLatex()}`)}**检验。** $f$ 的右端点 $${pt(xl, yl)}$ 应该移到 $${pt(xl, k.add(Q.of(yl)))}$，确实如此：它正是 $g$ 的右端点。`,
              ),
            }),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(c.tf, [x, y]),
          ...imageAlt(c.tf, [x, y]),
        );
      },
    },
  ],
};

// 3.10.2 Horizontal translations.

/** horizontalTranslationsOfFunctions shifts graphs left and right with y = f(x − h). */
export const horizontalTranslationsOfFunctions: TopicDef = {
  id: "horizontal-translations-of-functions",
  title: t("Horizontal Translations of Functions", "函数图象的左右平移"),
  summary: t(
    "Shift the graph of any function left or right: y = f(x − h) moves every point h units to the right.",
    "把任意函数的图象左右平移：y = f(x − h) 把每个点向右移动 h 个单位。",
  ),
  prerequisites: ["vertical-translations-of-functions"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We know that adding $k$ **outside** a function, $f(x) + k$, moves its graph up or down. What happens when we change the input **inside** the function instead?

Take $f(x) = x^{2}$ and $g(x) = f(x - 3) = (x - 3)^{2}$:

$$\\begin{array}{c|ccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\hline g(x) & 4 & 1 & 0 & 1 & 4 \\end{array}$$

The lowest point of $g$ is at $x = 3$, where the input of $f$ is $3 - 3 = 0$. So $g$ does at $x = 3$ what $f$ does at $x = 0$: the vertex $(0, 0)$ of $f$ moves to $(3, 0)$, and the whole parabola moves $3$ units **right**, although the formula shows $- 3$. Check: $g(5) = 2^{2} = 4 = f(2)$, and $(2, 4)$ moved to $(5, 4)$.

In this lesson we move points left and right, write the equation of a shifted function, and read the shift off two graphs.`,
    `我们知道在函数**外面**加 $k$，即 $f(x) + k$，会让图象上下移动。如果改为在函数**里面**改变输入，会怎样？

取 $f(x) = x^{2}$，$g(x) = f(x - 3) = (x - 3)^{2}$：

$$\\begin{array}{c|ccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\hline g(x) & 4 & 1 & 0 & 1 & 4 \\end{array}$$

$g$ 的最低点在 $x = 3$，这时 $f$ 的输入是 $3 - 3 = 0$。所以 $g$ 在 $x = 3$ 处做的事，就是 $f$ 在 $x = 0$ 处做的事：$f$ 的顶点 $(0, 0)$ 移到 $(3, 0)$，整条抛物线向**右**移动 $3$ 个单位，尽管式子里写的是 $- 3$。检验：$g(5) = 2^{2} = 4 = f(2)$，$(2, 4)$ 移到了 $(5, 4)$。

这节课我们左右移动点，写出平移后函数的解析式，并从两个图象读出平移量。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-translation",
      figure: algebraDrawings2["horizontal-translations-of-functions#points-under-a-horizontal-translation"],
      title: t("Moving points left and right", "左右移动点"),
      explanation: t(
        `The graph of $y = f(x - h)$ reaches each output of $f$ $h$ units **later**: at $x = p + h$ it computes $f(p + h - h) = f(p)$. So every point $(x, y)$ moves to $(x + h, y)$, which is a shift **right** for $h > 0$; the height $y$ does not change.

The sign looks backwards: $y = f(x + 3) = f(x - (-3))$ has $h = -3$, so it is shifted $3$ units **left**, and $(2, 5)$ on $f$ moves to $(2 - 3, 5) = (-1, 5)$. Check: at $x = -1$ the input of $f$ is $-1 + 3 = 2$.

> **Watch out.** Inside the parentheses the sign is reversed: $f(x + 3)$ moves **left**, $f(x - 3)$ moves **right**. A change inside moves $x$ only; it does not move the point up or down, and the coordinates don't swap.`,
        `$y = f(x - h)$ 的图象比 $f$ **晚** $h$ 个单位达到每个输出：在 $x = p + h$ 处它计算的是 $f(p + h - h) = f(p)$。所以每个点 $(x, y)$ 都移到 $(x + h, y)$，$h > 0$ 时是向**右**平移；高度 $y$ 不变。

符号看起来是反的：$y = f(x + 3) = f(x - (-3))$ 中 $h = -3$，所以是向**左**平移 $3$ 个单位，$f$ 上的 $(2, 5)$ 移到 $(2 - 3, 5) = (-1, 5)$。检验：$x = -1$ 时 $f$ 的输入是 $-1 + 3 = 2$。

> **注意。** 括号里的符号是反的：$f(x + 3)$ 向**左**移，$f(x - 3)$ 向**右**移。括号里的改变只移动 $x$，不会让点上下移动，坐标也不会对调。`,
      ),
      generate(rng) {
        const p = randomPoint(rng);
        const h = rng.nonZero(-9, 9);
        const g = tf({ h });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ h: -h }), tf({ k: h }), tf({ k: -h })],
          t(
            `${label(1, "Read the shift", "读出平移量").en} ${h > 0 ? `$f(${shifted(h)})$ has the form $f(x - h)$ with $h = ${h}$` : `$f(${shifted(h)}) = f(x - (${h}))$, so $h = ${h}$`}: the graph shifts ${h > 0 ? "right" : "left"} ${units(Q.of(h))}.

${label(2, "Move the point", "移动点").en} Add $h$ to the $x$-coordinate and keep $y = ${num(p[1])}$:${steps(`${chain(`${num(p[0])}${plus(h)}`, num(x))}`)}The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input of $f$ is $${num(x)}${plus(-h)} = ${num(p[0])}$, and $f(${num(p[0])}) = ${num(p[1])}$.`,
            `${label(1, "Read the shift", "读出平移量")["zh-CN"]} ${h > 0 ? `$f(${shifted(h)})$ 形如 $f(x - h)$，$h = ${h}$` : `$f(${shifted(h)}) = f(x - (${h}))$，所以 $h = ${h}$`}：图象向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位。

${label(2, "Move the point", "移动点")["zh-CN"]} $x$ 坐标加上 $h$，$y = ${num(p[1])}$ 不变：${steps(`${chain(`${num(p[0])}${plus(h)}`, num(x))}`)}所求的点是 $${pt(x, y)}$。

**检验。** $x = ${num(x)}$ 时 $f$ 的输入是 $${num(x)}${plus(-h)} = ${num(p[0])}$，而 $f(${num(p[0])}) = ${num(p[1])}$。`,
          ),
        );
      },
    },
    {
      id: "equations-of-horizontal-translations",
      figure: algebraDrawings2["horizontal-translations-of-functions#equations-of-horizontal-translations"],
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        `To shift the graph of $f$ right by $h$ units, the new function must do at $x$ what $f$ did at $x - h$, so replace every $x$ in $f(x)$ with $(x - h)$; to shift it left, replace $x$ with $(x + h)$.

For $f(x) = x^2 + 3x$ shifted left $2$ units:

$$g(x) = f(x + 2) = (x + 2)^2 + 3(x + 2) = x^2 + 7x + 10$$

Check: $g(-2) = 0 = f(0)$, so the point $(0, 0)$ of $f$ moved to $(-2, 0)$. You may leave the answer unexpanded.

> **Watch out.** Right means $x - h$ and left means $x + h$, the opposite of what the sign suggests. Replace **every** $x$, including the one in the middle term, and don't add $h$ outside the function: that moves the graph up or down.`,
        `要把 $f$ 的图象向右平移 $h$ 个单位，新函数在 $x$ 处要做 $f$ 在 $x - h$ 处做的事，所以把 $f(x)$ 中的每个 $x$ 换成 $(x - h)$；向左平移则换成 $(x + h)$。

把 $f(x) = x^2 + 3x$ 向左平移 $2$ 个单位：

$$g(x) = f(x + 2) = (x + 2)^2 + 3(x + 2) = x^2 + 7x + 10$$

检验：$g(-2) = 0 = f(0)$，所以 $f$ 上的点 $(0, 0)$ 移到了 $(-2, 0)$。答案可以不展开。

> **注意。** 向右是 $x - h$，向左是 $x + h$，与符号给人的感觉相反。要替换**每一个** $x$，包括一次项里的 $x$；也不要把 $h$ 加在函数外面，那是上下移动。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const h = rng.nonZero(-6, 6);
        const answer = tfPoly(f, tf({ h }));
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the graph of $f$ shifted ${h > 0 ? "right" : "left"} ${units(Q.of(h))}. Find $g(x)$.`,
            `设 ${fIs(f)}。把 $f$ 的图象向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位得到 $g$ 的图象。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ h: -h })), tfPoly(f, tf({ k: h })), tfPoly(f, tf({ k: -h }))],
          solution: t(
            `${label(1, "Replace the input", "替换输入").en} Shifting ${h > 0 ? "right" : "left"} ${units(Q.of(h))} means $g(x) = f(${shifted(h)})$: replace every $x$ in $f$ with $(${shifted(h)})$.${steps(`g(x) = ${substituted(f, shifted(h))}`)}${label(2, "Expand", "展开").en} Multiply out and collect like terms:${steps(`g(x) = ${answer}`)}**Check.** $g(${h}) = f(${h}${plus(-h)}) = f(0) = ${num(f[0]!)}$, and the expanded form gives $${num(pAt(transformPoly(f, tf({ h })), Q.of(h)))}$ at $x = ${h}$ too.`,
            `${label(1, "Replace the input", "替换输入")["zh-CN"]} 向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位，就是 $g(x) = f(${shifted(h)})$：把 $f$ 中的每个 $x$ 换成 $(${shifted(h)})$。${steps(`g(x) = ${substituted(f, shifted(h))}`)}${label(2, "Expand", "展开")["zh-CN"]} 展开并合并同类项：${steps(`g(x) = ${answer}`)}**检验。** $g(${h}) = f(${h}${plus(-h)}) = f(0) = ${num(f[0]!)}$，展开式在 $x = ${h}$ 处的值也是 $${num(pAt(transformPoly(f, tf({ h })), Q.of(h)))}$。`,
          ),
        });
      },
    },
    {
      id: "horizontal-translations-from-graphs",
      figure: algebraDrawings2["horizontal-translations-of-functions#horizontal-translations-from-graphs"],
      title: t("Reading the shift from graphs", "从图象读出平移量"),
      explanation: t(
        `When the graph of $g$ is the graph of $f$ shifted horizontally, every point keeps its height and moves the same distance sideways. So match a point of $f$ with the point of $g$ at the same height, such as the two left endpoints, and subtract the $x$-coordinates. If the left endpoint of $f$ is $(-3, 1)$ and that of $g$ is $(2, 1)$, the graph moved $2 - (-3) = 5$ units right, so $g(x) = f(x - 5)$ and $h = 5$.

> **Watch out.** $h$ is the $x$ of $g$ minus the $x$ of $f$: a dashed graph to the **left** gives a negative $h$. Then $g(x) = f(x - h)$, so a shift right by $5$ is written $f(x - 5)$ with $h = 5$, not $h = -5$.`,
        `如果 $g$ 的图象是 $f$ 的图象左右平移得到的，每个点高度不变，都向旁边移动同样的距离。所以把 $f$ 上的一个点与 $g$ 上同样高度的对应点配对，例如两个左端点，再把 $x$ 坐标相减。若 $f$ 的左端点是 $(-3, 1)$、$g$ 的左端点是 $(2, 1)$，则图象向右移动了 $2 - (-3) = 5$ 个单位，所以 $g(x) = f(x - 5)$，$h = 5$。

> **注意。** $h$ 等于 $g$ 的 $x$ 减去 $f$ 的 $x$：虚线在**左**边时 $h$ 是负数。而 $g(x) = f(x - h)$，所以向右平移 $5$ 写成 $f(x - 5)$，$h = 5$，不是 $h = -5$。`,
      ),
      generate(rng) {
        const c = pairCase(rng, () => tf({ h: rng.nonZero(-6, 6) }), { x: [-4, 4] });
        const h = c.tf.h;
        const [x, y] = c.f[0]!;
        const x1 = h.add(Q.of(x));
        const [xl, yl] = c.f[c.f.length - 1]!;
        return annotate(
          {
            ...numberProblem({
              prompt: solidDashed("Given that $g(x) = f(x - h)$, find $h$.", "已知 $g(x) = f(x - h)$，求 $h$。"),
              answer: h,
              wrong: [h.neg()],
              solution: t(
                `${label(1, "Match a point", "找对应点").en} A horizontal shift keeps heights, so the left endpoint $${pt(x, y)}$ of $f$ goes to the left endpoint of $g$, $${pt(x1, y)}$, ${units(h)} to the ${h.sign() > 0 ? "right" : "left"}.

${label(2, "Subtract the $x$-coordinates", "横坐标相减").en} In $g(x) = f(x - h)$, $h$ is how far the graph moved right:${steps(`h = ${num(x1)} - ${paren(x)} = ${h.toLatex()}`)}**Check.** The right endpoint $${pt(xl, yl)}$ of $f$ should move to $${pt(h.add(Q.of(xl)), yl)}$, and that is the right endpoint of $g$.`,
                `${label(1, "Match a point", "找对应点")["zh-CN"]} 左右平移不改变高度，所以 $f$ 的左端点 $${pt(x, y)}$ 移到 $g$ 的左端点 $${pt(x1, y)}$，向${h.sign() > 0 ? "右" : "左"}移动了 $${h.abs().toLatex()}$ 个单位。

${label(2, "Subtract the $x$-coordinates", "横坐标相减")["zh-CN"]} 在 $g(x) = f(x - h)$ 中，$h$ 就是图象向右移动的距离：${steps(`h = ${num(x1)} - ${paren(x)} = ${h.toLatex()}`)}**检验。** $f$ 的右端点 $${pt(xl, yl)}$ 应该移到 $${pt(h.add(Q.of(xl)), yl)}$，它正是 $g$ 的右端点。`,
              ),
            }),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(c.tf, [x, y]),
          ...imageAlt(c.tf, [x, y]),
        );
      },
    },
  ],
};

// 3.10.3 Vertical stretches.

/** stretchOptions describes the four stretches and compressions by the factors c and 1/c (c > 1). */
function stretchOptions(c: Q): { vs: Text; vc: Text; hs: Text; hc: Text } {
  const inv = Q.one.div(c);
  return {
    vs: opText(vertical(c)),
    vc: opText(vertical(inv)),
    hs: opText(horizontal(c)),
    hc: opText(horizontal(inv)),
  };
}

const capText = (x: Text) => t(cap(x.en), x["zh-CN"]);

/** verticalStretchesOfFunctions stretches and compresses graphs vertically with y = a·f(x). */
export const verticalStretchesOfFunctions: TopicDef = {
  id: "vertical-stretches-of-functions",
  title: t("Vertical Stretches of Functions", "函数图象的竖直伸缩"),
  summary: t(
    "Stretch or compress a graph vertically: y = a·f(x) multiplies every y-coordinate by a.",
    "把图象竖直伸缩：y = a·f(x) 把每个纵坐标乘以 a。",
  ),
  prerequisites: ["vertical-translations-of-functions", "stretches-of-absolute-value-graphs"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We have seen that $y = 2|x|$ is a narrower V than $y = |x|$: every output is doubled. The same works for any function: multiplying the **whole** function by a number multiplies every height.

Take $f(x) = |x| - 2$ and $g(x) = 3f(x)$:

$$\\begin{array}{c|ccccc} x & -4 & -2 & 0 & 2 & 4 \\\\ \\hline f(x) & 2 & 0 & -2 & 0 & 2 \\\\ g(x) & 6 & 0 & -6 & 0 & 6 \\end{array}$$

Each point $(x, y)$ moves to $(x, 3y)$: $(4, 2)$ goes up to $(4, 6)$, $(0, -2)$ goes down to $(0, -6)$, and the points $(\\pm 2, 0)$ on the $x$-axis stay put, because $3 \\cdot 0 = 0$. The graph is pulled away from the $x$-axis. Check: $g(4) = 3(|4| - 2) = 6$.

In this lesson we move points with a vertical stretch, tell stretches from compressions, and read the factor off two graphs.`,
    `我们已经看到，$y = 2|x|$ 是比 $y = |x|$ 更窄的 V 形：每个输出都乘以 $2$。这对任何函数都成立：把**整个**函数乘以一个数，就把每个高度乘以这个数。

取 $f(x) = |x| - 2$，$g(x) = 3f(x)$：

$$\\begin{array}{c|ccccc} x & -4 & -2 & 0 & 2 & 4 \\\\ \\hline f(x) & 2 & 0 & -2 & 0 & 2 \\\\ g(x) & 6 & 0 & -6 & 0 & 6 \\end{array}$$

每个点 $(x, y)$ 都移到 $(x, 3y)$：$(4, 2)$ 向上移到 $(4, 6)$，$(0, -2)$ 向下移到 $(0, -6)$，$x$ 轴上的点 $(\\pm 2, 0)$ 不动，因为 $3 \\cdot 0 = 0$。图象被拉离 $x$ 轴。检验：$g(4) = 3(|4| - 2) = 6$。

这节课我们用竖直伸缩移动点，区分伸长与压缩，并从两个图象读出系数。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-vertical-stretch",
      figure: algebraDrawings2["vertical-stretches-of-functions#points-under-a-vertical-stretch"],
      title: t("Multiplying the y-coordinates", "纵坐标乘以系数"),
      explanation: t(
        `For $a > 0$, the graph of $y = a f(x)$ multiplies every output of $f$ by $a$ and leaves the inputs alone, so the point $(x, y)$ moves to $(x, ay)$. Points on the $x$-axis stay where they are, because $a \\cdot 0 = 0$.

If $a > 1$ the graph is **stretched** vertically by a factor of $a$; if $0 < a < 1$ it is **compressed** by a factor of $a$. The point $(4, -6)$ on $f$ moves to $\\left(4, \\frac{1}{3} \\cdot (-6)\\right) = (4, -2)$ on $y = \\frac{1}{3}f(x)$.

> **Watch out.** A factor **outside** $f$ multiplies $y$ only: don't change $x$, don't divide by the factor, and don't add it. Multiply the $y$-coordinate and keep the $x$-coordinate in place; the coordinates don't swap.`,
        `当 $a > 0$ 时，$y = a f(x)$ 把 $f$ 的每个输出乘以 $a$，输入不变，所以点 $(x, y)$ 移到 $(x, ay)$。$x$ 轴上的点不动，因为 $a \\cdot 0 = 0$。

$a > 1$ 时图象竖直方向**伸长**为原来的 $a$ 倍；$0 < a < 1$ 时竖直方向**压缩**为原来的 $a$。$f$ 上的点 $(4, -6)$ 移到 $y = \\frac{1}{3}f(x)$ 上的 $\\left(4, \\frac{1}{3} \\cdot (-6)\\right) = (4, -2)$。

> **注意。** $f$ **外面**的系数只乘 $y$：不要改变 $x$，不要除以系数，也不要把它加上。纵坐标相乘，横坐标不动，坐标也不对调。`,
      ),
      generate(rng) {
        const a = rng.pick(stretchFactors);
        const p: [Q, Q] = [
          Q.of(rng.int(-9, 9)),
          Q.of(rng.nonZero(-4, 4))
            .mul(Q.of(a.d))
            .mul(Q.of(rng.int(1, 2))),
        ];
        const g = tf({ a });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ b: a }), tf({ b: Q.one.div(a) }), tf({ a: Q.one.div(a) }), tf({ k: a })],
          t(
            `${label(1, "Read the factor", "读出系数").en} Since $${pt(p[0], p[1])}$ is on the graph of $f$, $f(${num(p[0])}) = ${num(p[1])}$. In $${front(a)}f(x)$ the input stays and the output is multiplied by $${a.toLatex()}$, a vertical ${a.cmp(Q.one) > 0 ? "stretch" : "compression"}.

${label(2, "Multiply the height", "高度相乘").en} Keep $x = ${num(p[0])}$ and multiply the $y$-coordinate:${steps(`${a.toLatex()} \\cdot ${paren(p[1])} = ${num(y)}`)}The point is $${pt(x, y)}$.

**Check.** The new height divided by the old one is $\\frac{${num(y)}}{${num(p[1])}} = ${a.toLatex()}$, the factor, and the $x$-coordinate is unchanged.`,
            `${label(1, "Read the factor", "读出系数")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 的图象上，$f(${num(p[0])}) = ${num(p[1])}$。在 $${front(a)}f(x)$ 中输入不变，输出乘以 $${a.toLatex()}$，是竖直方向的${a.cmp(Q.one) > 0 ? "伸长" : "压缩"}。

${label(2, "Multiply the height", "高度相乘")["zh-CN"]} $x = ${num(p[0])}$ 不变，纵坐标相乘：${steps(`${a.toLatex()} \\cdot ${paren(p[1])} = ${num(y)}`)}所求的点是 $${pt(x, y)}$。

**检验。** 新高度除以原高度是 $\\frac{${num(y)}}{${num(p[1])}} = ${a.toLatex()}$，正是系数，横坐标也没变。`,
          ),
        );
      },
    },
    {
      id: "describing-vertical-stretches",
      title: t("Stretch or compression?", "伸长还是压缩？"),
      explanation: t(
        `In $y = a f(x)$ the factor multiplies the **output**, so the change is vertical: every height is multiplied by $a$ and every $x$-coordinate stays. A factor above $1$ pulls points away from the $x$-axis, a **stretch**; a factor between $0$ and $1$ pulls them toward it, a **compression**.

So $y = 4f(x)$ is a vertical stretch by a factor of $4$: the point $(1, 3)$ goes to $(1, 12)$. And $y = \\frac{1}{4}f(x)$ is a vertical compression by a factor of $\\frac{1}{4}$: $(1, 3)$ goes to $\\left(1, \\frac{3}{4}\\right)$.

> **Watch out.** Outside the parentheses the factor means what it says: $4f(x)$ stretches, it does not compress, and it acts vertically, not horizontally. Only a factor **inside**, as in $f(4x)$, changes the graph sideways.`,
        `在 $y = a f(x)$ 中系数乘的是**输出**，所以变化是竖直方向的：每个高度都乘以 $a$，横坐标不变。大于 $1$ 的系数让点远离 $x$ 轴，是**伸长**；介于 $0$ 和 $1$ 之间的系数让点靠近 $x$ 轴，是**压缩**。

所以 $y = 4f(x)$ 是竖直方向伸长为原来的 $4$ 倍：点 $(1, 3)$ 移到 $(1, 12)$。$y = \\frac{1}{4}f(x)$ 是竖直方向压缩为原来的 $\\frac{1}{4}$：$(1, 3)$ 移到 $\\left(1, \\frac{3}{4}\\right)$。

> **注意。** 括号外面的系数就是字面意思：$4f(x)$ 是伸长，不是压缩，而且在竖直方向，不在水平方向。只有括号**里面**的系数，例如 $f(4x)$，才让图象左右变化。`,
      ),
      generate(rng) {
        const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(6), Q.of(3, 2), Q.of(5, 2), Q.of(4, 3), Q.of(5, 3), Q.of(7, 2)]);
        const fn = rng.pick(["f", "g", "h"]);
        const a = rng.bool() ? c : Q.one.div(c);
        const o = stretchOptions(c);
        const correct = a.eq(c) ? o.vs : o.vc;
        const others = a.eq(c) ? [o.vc, o.hs, o.hc] : [o.vs, o.hc, o.hs];
        return reasoned(
          shuffled(
            rng,
            t(
              `How is the graph of $y = ${front(a)}${fn}(x)$ obtained from the graph of $y = ${fn}(x)$?`,
              `$y = ${front(a)}${fn}(x)$ 的图象是怎样由 $y = ${fn}(x)$ 的图象得到的？`,
            ),
            [correct, ...others].map(capText),
            t(
              `${label(1, "Inside or outside", "里面还是外面").en} The factor $${a.toLatex()}$ multiplies $${fn}(x)$, the **output**, so the change is vertical and the $x$-coordinates stay.

${label(2, "Stretch or compression", "伸长还是压缩").en} The factor is ${a.cmp(Q.one) > 0 ? "greater than $1$, so points move away from the $x$-axis" : "between $0$ and $1$, so points move toward the $x$-axis"}: ${correct.en}.

**Check.** A point $(1, 6)$ of $${fn}$ moves to $\\left(1, ${Q.of(6).mul(a).toLatex()}\\right)$: same $x$, height ${a.cmp(Q.one) > 0 ? "larger" : "smaller"}.`,
              `${label(1, "Inside or outside", "里面还是外面")["zh-CN"]} 系数 $${a.toLatex()}$ 乘的是 $${fn}(x)$，即**输出**，所以变化在竖直方向，横坐标不变。

${label(2, "Stretch or compression", "伸长还是压缩")["zh-CN"]} 系数${a.cmp(Q.one) > 0 ? "大于 $1$，所以点远离 $x$ 轴" : "介于 $0$ 和 $1$ 之间，所以点靠近 $x$ 轴"}：${correct["zh-CN"]}。

**检验。** $${fn}$ 上的点 $(1, 6)$ 移到 $\\left(1, ${Q.of(6).mul(a).toLatex()}\\right)$：$x$ 不变，高度变${a.cmp(Q.one) > 0 ? "大" : "小"}。`,
            ),
          ),
          [
            [
              capText(a.eq(c) ? o.vc : o.vs).en,
              a.eq(c)
                ? "A factor greater than $1$ moves the outputs away from the $x$-axis, which is a stretch."
                : "A factor between $0$ and $1$ moves the outputs toward the $x$-axis, which is a compression.",
              a.eq(c) ? "大于 $1$ 的系数让输出远离 $x$ 轴，这是伸长。" : "介于 $0$ 和 $1$ 之间的系数让输出靠近 $x$ 轴，这是压缩。",
            ],
            [
              capText(o.hs).en,
              "The factor multiplies the outputs here, so the change is vertical; a factor on the input would change the graph horizontally.",
              "这里系数乘的是输出，所以变化在竖直方向；乘在输入上的系数才改变水平方向。",
            ],
            [
              capText(o.hc).en,
              "The factor multiplies the outputs here, so the change is vertical; a factor on the input would change the graph horizontally.",
              "这里系数乘的是输出，所以变化在竖直方向；乘在输入上的系数才改变水平方向。",
            ],
          ],
        );
      },
    },
    {
      id: "vertical-stretches-from-graphs",
      figure: algebraDrawings2["vertical-stretches-of-functions#vertical-stretches-from-graphs"],
      title: t("Reading the factor from graphs", "从图象读出系数"),
      explanation: t(
        `In $g(x) = a f(x)$ each height of $g$ is $a$ times the height of $f$ at the same $x$. So to find $a$ from graphs, pick a point of $f$ **off** the $x$-axis and divide the height of $g$ at the same $x$ by it. If $f(2) = 4$ and $g(2) = 2$, then $a = \\frac{2}{4} = \\frac{1}{2}$: a compression, since $g$ is flatter.

> **Watch out.** Divide in the order $g$ over $f$; $\\frac{4}{2} = 2$ would be the factor that takes $g$ back to $f$. Don't use a point on the $x$-axis, where both heights are $0$, and keep the sign: a positive $a$ keeps every point on its side of the $x$-axis.`,
        `在 $g(x) = a f(x)$ 中，$g$ 的每个高度都是同一个 $x$ 处 $f$ 的高度的 $a$ 倍。所以要从图象求 $a$，取 $f$ 上一个**不在** $x$ 轴上的点，用同一个 $x$ 处 $g$ 的高度除以它。若 $f(2) = 4$，$g(2) = 2$，则 $a = \\frac{2}{4} = \\frac{1}{2}$：$g$ 更平，是压缩。

> **注意。** 按 $g$ 除以 $f$ 的顺序相除；$\\frac{4}{2} = 2$ 是把 $g$ 变回 $f$ 的系数。不要用 $x$ 轴上的点，那里两个高度都是 $0$；也要注意符号：正的 $a$ 让每个点留在 $x$ 轴的同一侧。`,
      ),
      generate(rng) {
        const a = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2)]);
        const yStep = Number(a.d);
        const lim = Math.floor(7 / Number(a.n)) * yStep;
        const c = pairCase(rng, () => tf({ a }), { y: [-Math.min(lim, 6), Math.min(lim, 6)], yStep });
        const [x, y] = c.f.find(([, v]) => v !== 0)!;
        const [x2, y2] = c.f.find(([u, v]) => u !== x || v !== y)!;
        return annotate(
          {
            ...numberProblem({
              prompt: solidDashed("Given that $g(x) = a f(x)$, find $a$.", "已知 $g(x) = a f(x)$，求 $a$。"),
              answer: a,
              wrong: [Q.one.div(a), a.neg()],
              solution: t(
                `${label(1, "Match a point", "找对应点").en} Take the point $${pt(x, y)}$ of $f$, off the $x$-axis. A vertical stretch keeps $x$, so at $x = ${x}$ the graph of $g$ is at height $${a.mul(Q.of(y)).toLatex()}$.

${label(2, "Divide the heights", "高度相除").en} $a$ is the height on $g$ divided by the height on $f$:${steps(`a = \\frac{${a.mul(Q.of(y)).toLatex()}}{${y}} = ${a.toLatex()}`)}**Check.** The vertex $${pt(x2, y2)}$ of $f$ should go to $${pt(x2, a.mul(Q.of(y2)))}$, and that is a vertex of $g$.`,
                `${label(1, "Match a point", "找对应点")["zh-CN"]} 取 $f$ 上不在 $x$ 轴上的点 $${pt(x, y)}$。竖直伸缩不改变 $x$，所以在 $x = ${x}$ 处 $g$ 的高度是 $${a.mul(Q.of(y)).toLatex()}$。

${label(2, "Divide the heights", "高度相除")["zh-CN"]} $a$ 等于 $g$ 上的高度除以 $f$ 上的高度：${steps(`a = \\frac{${a.mul(Q.of(y)).toLatex()}}{${y}} = ${a.toLatex()}`)}**检验。** $f$ 的顶点 $${pt(x2, y2)}$ 应该移到 $${pt(x2, a.mul(Q.of(y2)))}$，它正是 $g$ 的一个顶点。`,
              ),
            }),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(c.tf, [x, y]),
          ...imageAlt(c.tf, [x, y]),
        );
      },
    },
  ],
};

// 3.10.4 Horizontal stretches.

/** horizontalStretchesOfFunctions stretches and compresses graphs horizontally with y = f(bx). */
export const horizontalStretchesOfFunctions: TopicDef = {
  id: "horizontal-stretches-of-functions",
  title: t("Horizontal Stretches of Functions", "函数图象的水平伸缩"),
  summary: t(
    "Stretch or compress a graph horizontally: y = f(bx) divides every x-coordinate by b.",
    "把图象水平伸缩：y = f(bx) 把每个横坐标除以 b。",
  ),
  prerequisites: ["horizontal-translations-of-functions", "vertical-stretches-of-functions"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We know that a vertical stretch $a f(x)$ multiplies the heights, and that a change inside, $f(x - h)$, acts on $x$ the opposite way from how it looks. A factor inside, $f(bx)$, behaves the same way: it acts on the $x$-coordinates, and backward.

Take $f(x) = x^{2} - 4$, which is $0$ at $x = \\pm 2$, and $g(x) = f(2x) = 4x^{2} - 4$:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 0 & -3 & -4 & -3 & 0 \\\\ g(x) & 12 & 0 & -4 & 0 & 12 \\end{array}$$

$g$ is $0$ at $x = \\pm 1$, not $\\pm 4$: $g$ reaches $f(2)$ already at $x = 1$, because $2 \\cdot 1 = 2$. Every point $(x, y)$ moves to $\\left(\\frac{x}{2}, y\\right)$, so the graph is squeezed toward the $y$-axis. Check: $g(1) = f(2) = 0$.

In this lesson we move points, tell stretches from compressions, write the equations, and read the factor off two graphs.`,
    `我们知道竖直伸缩 $a f(x)$ 把高度相乘，而括号里的改变 $f(x - h)$ 对 $x$ 的作用与看上去相反。括号里的系数 $f(bx)$ 也是这样：它作用在横坐标上，而且是反着来的。

取 $f(x) = x^{2} - 4$，它在 $x = \\pm 2$ 处为 $0$；再取 $g(x) = f(2x) = 4x^{2} - 4$：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 0 & -3 & -4 & -3 & 0 \\\\ g(x) & 12 & 0 & -4 & 0 & 12 \\end{array}$$

$g$ 在 $x = \\pm 1$ 处为 $0$，而不是 $\\pm 4$：$g$ 在 $x = 1$ 时就取到 $f(2)$，因为 $2 \\cdot 1 = 2$。每个点 $(x, y)$ 都移到 $\\left(\\frac{x}{2}, y\\right)$，图象被向 $y$ 轴挤压。检验：$g(1) = f(2) = 0$。

这节课我们移动点，区分伸长与压缩，写出解析式，并从两个图象读出系数。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-stretch",
      figure: algebraDrawings2["horizontal-stretches-of-functions#points-under-a-horizontal-stretch"],
      title: t("Dividing the x-coordinates", "横坐标除以系数"),
      explanation: t(
        `For $b > 0$, the graph of $y = f(bx)$ reaches the output $f(p)$ when $bx = p$, that is at $x = \\frac{p}{b}$. So the point $(x, y)$ moves to $\\left(\\frac{x}{b}, y\\right)$: the $x$-coordinates are **divided** by $b$, and the heights stay.

The point $(6, 1)$ on $f$ moves to $\\left(\\frac{6}{2}, 1\\right) = (3, 1)$ on $y = f(2x)$, and to $\\left(6 \\div \\frac{1}{2}, 1\\right) = (12, 1)$ on $y = f\\left(\\frac{1}{2}x\\right)$. Check: $2 \\cdot 3 = 6$.

> **Watch out.** Inside the function the factor works backward: **divide** the $x$-coordinate by $b$, don't multiply it. And a factor inside never changes $y$: multiplying the height is what a factor outside does.`,
        `当 $b > 0$ 时，$y = f(bx)$ 在 $bx = p$，即 $x = \\frac{p}{b}$ 时取到输出 $f(p)$。所以点 $(x, y)$ 移到 $\\left(\\frac{x}{b}, y\\right)$：横坐标**除以** $b$，高度不变。

$f$ 上的点 $(6, 1)$ 移到 $y = f(2x)$ 上的 $\\left(\\frac{6}{2}, 1\\right) = (3, 1)$，移到 $y = f\\left(\\frac{1}{2}x\\right)$ 上的 $\\left(6 \\div \\frac{1}{2}, 1\\right) = (12, 1)$。检验：$2 \\cdot 3 = 6$。

> **注意。** 函数里面的系数作用是反的：横坐标要**除以** $b$，不是乘以 $b$。括号里的系数也不会改变 $y$：把高度相乘是外面的系数做的事。`,
      ),
      generate(rng) {
        const b = rng.pick(stretchFactors);
        const p: [Q, Q] = [
          Q.of(rng.nonZero(-4, 4))
            .mul(Q.of(b.n))
            .mul(Q.of(rng.int(1, 2))),
          Q.of(rng.int(-9, 9)),
        ];
        const g = tf({ b });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ b: Q.one.div(b) }), tf({ a: b }), tf({ a: Q.one.div(b) })],
          t(
            `${label(1, "Find the new input", "求新的输入").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. The graph of $f(${front(b)}x)$ reaches this output when $${front(b)}x = ${num(p[0])}$:${steps(`x = ${num(p[0])} \\div ${b.toLatex()} = ${num(x)}`)}${label(2, "Keep the height", "高度不变").en} The output is still $${num(p[1])}$, so the point is $${pt(x, y)}$.

**Check.** $${b.toLatex()} \\cdot ${paren(x)} = ${p[0].toLatex()}$, so $f(${front(b)} \\cdot ${paren(x)}) = f(${num(p[0])}) = ${num(p[1])}$.`,
            `${label(1, "Find the new input", "求新的输入")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。$f(${front(b)}x)$ 在 $${front(b)}x = ${num(p[0])}$ 时取到这个输出：${steps(`x = ${num(p[0])} \\div ${b.toLatex()} = ${num(x)}`)}${label(2, "Keep the height", "高度不变")["zh-CN"]} 输出仍是 $${num(p[1])}$，所以所求的点是 $${pt(x, y)}$。

**检验。** $${b.toLatex()} \\cdot ${paren(x)} = ${p[0].toLatex()}$，所以 $f(${front(b)} \\cdot ${paren(x)}) = f(${num(p[0])}) = ${num(p[1])}$。`,
          ),
        );
      },
    },
    {
      id: "describing-horizontal-stretches",
      title: t("Stretch or compression?", "伸长还是压缩？"),
      explanation: t(
        `Because $y = f(bx)$ divides the $x$-coordinates by $b$, the factor of the horizontal change is $\\frac{1}{b}$, and the heights don't change:

- $y = f(3x)$ is a horizontal **compression** by a factor of $\\frac{1}{3}$: the point $(6, 2)$ goes to $(2, 2)$;
- $y = f\\left(\\frac{1}{3}x\\right)$ is a horizontal **stretch** by a factor of $3$: $(6, 2)$ goes to $(18, 2)$.

> **Watch out.** This is the opposite of a vertical factor: inside, a number above $1$ **compresses**, and a number between $0$ and $1$ stretches. And since the factor is inside, the change is horizontal, not vertical.`,
        `因为 $y = f(bx)$ 把横坐标除以 $b$，水平方向变化的倍数是 $\\frac{1}{b}$，高度不变：

- $y = f(3x)$ 是水平方向**压缩**为原来的 $\\frac{1}{3}$：点 $(6, 2)$ 移到 $(2, 2)$；
- $y = f\\left(\\frac{1}{3}x\\right)$ 是水平方向**伸长**为原来的 $3$ 倍：$(6, 2)$ 移到 $(18, 2)$。

> **注意。** 这与竖直方向的系数正好相反：在括号里，大于 $1$ 的数是**压缩**，介于 $0$ 和 $1$ 之间的数是伸长。系数在括号里，所以变化在水平方向，不在竖直方向。`,
      ),
      generate(rng) {
        const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(6), Q.of(3, 2), Q.of(5, 2), Q.of(4, 3), Q.of(5, 3), Q.of(7, 2)]);
        const fn = rng.pick(["f", "g", "h"]);
        const b = rng.bool() ? c : Q.one.div(c);
        const o = stretchOptions(c);
        const correct = b.eq(c) ? o.hc : o.hs;
        const others = b.eq(c) ? [o.hs, o.vs, o.vc] : [o.hc, o.vc, o.vs];
        return reasoned(
          shuffled(
            rng,
            t(
              `How is the graph of $y = ${fn}(${front(b)}x)$ obtained from the graph of $y = ${fn}(x)$?`,
              `$y = ${fn}(${front(b)}x)$ 的图象是怎样由 $y = ${fn}(x)$ 的图象得到的？`,
            ),
            [correct, ...others].map(capText),
            t(
              `${label(1, "Inside or outside", "里面还是外面").en} The factor $${b.toLatex()}$ multiplies the **input** $x$, so the change is horizontal and the heights stay.

${label(2, "Turn the factor over", "把系数倒过来").en} The graph reaches each output when $${front(b)}x$ equals the old input, so every $x$-coordinate is divided by $${b.toLatex()}$, that is multiplied by $${Q.one.div(b).toLatex()}$: ${correct.en}.

**Check.** A point $(6, 1)$ of $${fn}$ moves to $\\left(${Q.of(6).div(b).toLatex()}, 1\\right)$: same height, ${b.cmp(Q.one) > 0 ? "closer to" : "farther from"} the $y$-axis.`,
              `${label(1, "Inside or outside", "里面还是外面")["zh-CN"]} 系数 $${b.toLatex()}$ 乘的是**输入** $x$，所以变化在水平方向，高度不变。

${label(2, "Turn the factor over", "把系数倒过来")["zh-CN"]} 当 $${front(b)}x$ 等于原来的输入时，图象取到同样的输出，所以每个横坐标除以 $${b.toLatex()}$，即乘以 $${Q.one.div(b).toLatex()}$：${correct["zh-CN"]}。

**检验。** $${fn}$ 上的点 $(6, 1)$ 移到 $\\left(${Q.of(6).div(b).toLatex()}, 1\\right)$：高度不变，${b.cmp(Q.one) > 0 ? "离 $y$ 轴更近" : "离 $y$ 轴更远"}。`,
            ),
          ),
          [
            [
              capText(b.eq(c) ? o.hs : o.hc).en,
              b.eq(c)
                ? "On the input a factor works backward: a factor greater than $1$ compresses the graph toward the $y$-axis."
                : "On the input a factor works backward: a factor between $0$ and $1$ stretches the graph away from the $y$-axis.",
              b.eq(c)
                ? "输入上的系数作用相反：大于 $1$ 的系数把图象向 $y$ 轴压缩。"
                : "输入上的系数作用相反：介于 $0$ 和 $1$ 之间的系数把图象从 $y$ 轴拉开。",
            ],
            [
              capText(o.vs).en,
              "The factor multiplies the input here, so the change is horizontal; a factor outside would change the graph vertically.",
              "这里系数乘的是输入，所以变化在水平方向；乘在外面的系数才改变竖直方向。",
            ],
            [
              capText(o.vc).en,
              "The factor multiplies the input here, so the change is horizontal; a factor outside would change the graph vertically.",
              "这里系数乘的是输入，所以变化在水平方向；乘在外面的系数才改变竖直方向。",
            ],
          ],
        );
      },
    },
    {
      id: "equations-of-horizontal-stretches",
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        `A horizontal stretch by a factor of $s$ multiplies the $x$-coordinates by $s$. The new function must reach at $x$ the value $f$ had at $\\frac{x}{s}$, so it replaces $x$ with $\\frac{1}{s}x$. Stretching $f(x) = x^2 - 4x$ horizontally by a factor of $2$ gives

$$g(x) = f\\left(\\tfrac{1}{2}x\\right) = \\left(\\tfrac{1}{2}x\\right)^2 - 4 \\cdot \\tfrac{1}{2}x = \\tfrac{1}{4}x^2 - 2x,$$

and compressing it by a factor of $\\frac{1}{2}$ gives $g(x) = f(2x) = 4x^2 - 8x$. Check: $f$ is $0$ at $x = 4$, and the stretched $g$ is $0$ at $x = 8$: $\\frac{1}{4} \\cdot 64 - 16 = 0$.

> **Watch out.** Stretching by $2$ means $f\\left(\\frac{1}{2}x\\right)$, not $f(2x)$: the factor goes in upside down. Put it **inside**, on $x$; multiplying the whole function by it is a vertical change.`,
        `水平方向伸长为原来的 $s$ 倍，就是把横坐标乘以 $s$。新函数在 $x$ 处要取到 $f$ 在 $\\frac{x}{s}$ 处的值，所以把 $x$ 换成 $\\frac{1}{s}x$。把 $f(x) = x^2 - 4x$ 水平方向伸长为原来的 $2$ 倍得到

$$g(x) = f\\left(\\tfrac{1}{2}x\\right) = \\left(\\tfrac{1}{2}x\\right)^2 - 4 \\cdot \\tfrac{1}{2}x = \\tfrac{1}{4}x^2 - 2x,$$

水平方向压缩为原来的 $\\frac{1}{2}$ 得到 $g(x) = f(2x) = 4x^2 - 8x$。检验：$f$ 在 $x = 4$ 处为 $0$，伸长后的 $g$ 在 $x = 8$ 处为 $0$：$\\frac{1}{4} \\cdot 64 - 16 = 0$。

> **注意。** 伸长为 $2$ 倍是 $f\\left(\\frac{1}{2}x\\right)$，不是 $f(2x)$：系数要倒过来放进去。系数要放在**里面**的 $x$ 上；把整个函数乘以它是竖直方向的变化。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const s = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3)]);
        const b = Q.one.div(s);
        const answer = tfPoly(f, tf({ b }));
        const op = opText(horizontal(s));
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is obtained when the graph of $f$ is ${op.en.replace(/^(stretch|compress)/, "$1ed")}. Find $g(x)$.`,
            `设 ${fIs(f)}。把 $f$ 的图象${op["zh-CN"]}，得到 $g$ 的图象。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ b: s })), tfPoly(f, tf({ a: s })), tfPoly(f, tf({ a: b }))],
          solution: t(
            `${label(1, "Replace the input", "替换输入").en} The $x$-coordinates are multiplied by $${s.toLatex()}$, so $g$ must reach at $x$ what $f$ reached at $${front(b)}x$: replace every $x$ with $${front(b)}x$.${steps(`g(x) = f(${front(b)}x) = ${substituted(f, `${front(b)}x`)}`)}${label(2, "Simplify", "化简").en} Square and multiply out:${steps(`g(x) = ${answer}`)}**Check.** $g(${s.toLatex()}) = f(1) = ${num(pAt(f, Q.one))}$, and the simplified form gives $${num(pAt(transformPoly(f, tf({ b })), s))}$ at $x = ${s.toLatex()}$ too.`,
            `${label(1, "Replace the input", "替换输入")["zh-CN"]} 横坐标乘以 $${s.toLatex()}$，所以 $g$ 在 $x$ 处要取到 $f$ 在 $${front(b)}x$ 处的值：把每个 $x$ 换成 $${front(b)}x$。${steps(`g(x) = f(${front(b)}x) = ${substituted(f, `${front(b)}x`)}`)}${label(2, "Simplify", "化简")["zh-CN"]} 平方并展开：${steps(`g(x) = ${answer}`)}**检验。** $g(${s.toLatex()}) = f(1) = ${num(pAt(f, Q.one))}$，化简后的式子在 $x = ${s.toLatex()}$ 处的值也是 $${num(pAt(transformPoly(f, tf({ b })), s))}$。`,
          ),
        });
      },
    },
    {
      id: "horizontal-stretches-from-graphs",
      figure: algebraDrawings2["horizontal-stretches-of-functions#horizontal-stretches-from-graphs"],
      title: t("Reading the factor from graphs", "从图象读出系数"),
      explanation: t(
        `In $g(x) = f(bx)$ every point keeps its height and its $x$-coordinate is divided by $b$. So to find $b$ from graphs, match a point of $f$ **off** the $y$-axis, such as an endpoint, with the corresponding point of $g$ at the same height: $b$ is the $x$-coordinate on $f$ divided by the one on $g$. If the right endpoint of $f$ is $(4, 2)$ and that of $g$ is $(2, 2)$, then $b = \\frac{4}{2} = 2$: the graph was compressed.

> **Watch out.** Divide $f$ by $g$, not $g$ by $f$: a dashed graph that is **narrower** has $b > 1$. Points on the $y$-axis don't move and tell nothing, and matching corners keep their sides of the $y$-axis when $b > 0$.`,
        `在 $g(x) = f(bx)$ 中，每个点高度不变，横坐标除以 $b$。所以要从图象求 $b$，把 $f$ 上一个**不在** $y$ 轴上的点（例如端点）与 $g$ 上同样高度的对应点配对：$b$ 等于 $f$ 上的横坐标除以 $g$ 上的横坐标。若 $f$ 的右端点是 $(4, 2)$、$g$ 的右端点是 $(2, 2)$，则 $b = \\frac{4}{2} = 2$：图象被压缩了。

> **注意。** 用 $f$ 除以 $g$，不是 $g$ 除以 $f$：虚线图象**更窄**时 $b > 1$。$y$ 轴上的点不动，看不出什么；$b > 0$ 时对应的拐点留在 $y$ 轴的同一侧。`,
      ),
      generate(rng) {
        const b = rng.pick([Q.of(2), Q.of(1, 2), Q.of(3), Q.of(1, 3)]);
        const xStep = Number(b.n);
        const lim = Math.floor(7 / Number(b.d)) * xStep;
        const c = pairCase(rng, () => tf({ b }), { x: [-Math.min(lim, 6), Math.min(lim, 6)], xStep });
        const [x, y] = c.f[0]![0] !== 0 ? c.f[0]! : c.f[c.f.length - 1]!;
        const u = Q.of(x).div(b);
        const [x2, y2] = c.f.find(([u, v]) => u !== 0 && (u !== x || v !== y)) ?? c.f.find(([u, v]) => u !== x || v !== y)!;
        return annotate(
          {
            ...numberProblem({
              prompt: solidDashed("Given that $g(x) = f(bx)$, find $b$.", "已知 $g(x) = f(bx)$，求 $b$。"),
              answer: b,
              wrong: [Q.one.div(b), b.neg()],
              solution: t(
                `${label(1, "Match a point", "找对应点").en} Take the point $${pt(x, y)}$ of $f$, off the $y$-axis. A horizontal stretch keeps heights, so it goes to the matching point $${pt(u, y)}$ of $g$.

${label(2, "Divide the $x$-coordinates", "横坐标相除").en} In $g(x) = f(bx)$ the $x$-coordinates of $f$ are divided by $b$. So $b$ is the $x$ on $f$ divided by the $x$ on $g$:${steps(`b = \\frac{${x}}{${u.toLatex()}} = ${b.toLatex()}`)}**Check.** The vertex $${pt(x2, y2)}$ of $f$ should go to $${pt(Q.of(x2).div(b), y2)}$, and that is a vertex of $g$.`,
                `${label(1, "Match a point", "找对应点")["zh-CN"]} 取 $f$ 上不在 $y$ 轴上的点 $${pt(x, y)}$。水平伸缩不改变高度，所以它移到 $g$ 上的对应点 $${pt(u, y)}$。

${label(2, "Divide the $x$-coordinates", "横坐标相除")["zh-CN"]} 在 $g(x) = f(bx)$ 中，$f$ 的横坐标除以 $b$。因此 $b$ 等于 $f$ 上的 $x$ 除以 $g$ 上的 $x$：${steps(`b = \\frac{${x}}{${u.toLatex()}} = ${b.toLatex()}`)}**检验。** $f$ 的顶点 $${pt(x2, y2)}$ 应该移到 $${pt(Q.of(x2).div(b), y2)}$，它正是 $g$ 的一个顶点。`,
              ),
            }),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(c.tf, [x, y]),
          ...imageAlt(c.tf, [x, y]),
        );
      },
    },
  ],
};

// 3.10.5 Two operations.

/** twoOps draws two operations of different kinds that act on the graph in the given order. */
function twoOps(rng: Rng): Op[] {
  const kinds = rng.pick([
    ["vertical", "up"],
    ["up", "vertical"],
    ["right", "up"],
    ["horizontal", "right"],
    ["right", "horizontal"],
    ["vertical", "right"],
    ["horizontal", "up"],
  ] as const);
  return kinds.map((k): Op => {
    if (k === "up") return up(rng.nonZero(-5, 5));
    if (k === "right") return right(rng.nonZero(-5, 5));
    const c = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2)]);
    return k === "vertical" ? vertical(c) : horizontal(c);
  });
}

/** combiningGraphTransformationsTwoOperations combines two transformations and attends to their order. */
export const combiningGraphTransformationsTwoOperations: TopicDef = {
  id: "combining-graph-transformations-two-operations",
  title: t("Combining Graph Transformations: Two Operations", "图象的组合变换：两步"),
  summary: t(
    "Combine two translations and stretches, and see when their order changes the result.",
    "组合两次平移或伸缩，并判断它们的顺序何时会影响结果。",
  ),
  prerequisites: ["horizontal-stretches-of-functions"],
  encompasses: [
    { topic: "horizontal-stretches-of-functions", weight: 0.4 },
    { topic: "vertical-stretches-of-functions", weight: 0.4 },
    { topic: "horizontal-translations-of-functions", weight: 0.4 },
    { topic: "vertical-translations-of-functions", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We can already shift a graph and stretch it, one change at a time. Now we make two changes in a row and watch which coordinate each one acts on.

Take $f(x) = x^{2}$ and $g(x) = 3f(x - 2) - 1$. The change inside, $x - 2$, moves every point right $2$. The changes outside multiply every height by $3$ and then subtract $1$:

$$\\begin{array}{c|ccc} \\text{point of } f & (-1, 1) & (0, 0) & (1, 1) \\\\ \\hline \\text{point of } g & (1, 2) & (2, -1) & (3, 2) \\end{array}$$

For $(1, 1)$: $x$ becomes $1 + 2 = 3$ and $y$ becomes $3 \\cdot 1 - 1 = 2$. Check: $g(3) = 3(3 - 2)^{2} - 1 = 2$.

The order of the two outside changes matters. Stretching first and then shifting down $1$ gives $3f(x - 2) - 1$; shifting down first gives $3(f(x - 2) - 1) = 3f(x - 2) - 3$, because the stretch also triples the shift.

In this lesson we follow points through two transformations, decide when the order matters, and read two transformations off a pair of graphs.`,
    `我们已经会一次做一种变化：平移或伸缩图象。现在连续做两次变化，并看清每一次作用在哪个坐标上。

取 $f(x) = x^{2}$，$g(x) = 3f(x - 2) - 1$。括号里的 $x - 2$ 把每个点向右移 $2$；外面的变化先把每个高度乘以 $3$，再减去 $1$：

$$\\begin{array}{c|ccc} f \\text{ 上的点} & (-1, 1) & (0, 0) & (1, 1) \\\\ \\hline g \\text{ 上的点} & (1, 2) & (2, -1) & (3, 2) \\end{array}$$

对于 $(1, 1)$：$x$ 变成 $1 + 2 = 3$，$y$ 变成 $3 \\cdot 1 - 1 = 2$。检验：$g(3) = 3(3 - 2)^{2} - 1 = 2$。

外面两个变化的顺序有影响。先伸长再向下平移 $1$ 得到 $3f(x - 2) - 1$；先向下平移则得到 $3(f(x - 2) - 1) = 3f(x - 2) - 3$，因为伸长把平移量也变成了 $3$ 倍。

这节课我们追踪点经过两次变换后的位置，判断顺序何时有影响，并从两个图象读出两次变换。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-two-transformations",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        `A point $(x, y)$ is on the graph of $f$ when $f(x) = y$. The graph of $g(x) = a f(b(x - h)) + k$ uses that same value of $f$ where its input $b(x' - h)$ equals $x$, that is at $x' = \\frac{x}{b} + h$. There the output $y$ is multiplied by $a$ and **then** gains $k$. Change one coordinate at a time: the new point is $\\left(\\frac{x}{b} + h, ay + k\\right)$.

The point $(1, 4)$ on $f$ moves to $(1, 2 \\cdot 4 - 3) = (1, 5)$ on $y = 2f(x) - 3$, to $(1 - 1, 4 + 6) = (0, 10)$ on $y = f(x + 1) + 6$, and to $\\left(\\frac{1}{2}, 4\\right)$ on $y = f(2x)$.

> **Watch out.** Inside the function the changes act on $x$ backward: $x - h$ **adds** $h$, and a factor $b$ **divides** by $b$. Outside, multiply by $a$ as written, before adding $k$. Do not multiply the shift $h$ by $b$, and keep the $x$-coordinate first when you write the point.`,
        `点 $(x, y)$ 在 $f$ 的图象上，就是 $f(x) = y$。$g(x) = a f(b(x - h)) + k$ 的图象在输入 $b(x' - h)$ 等于 $x$ 的地方，也就是 $x' = \\frac{x}{b} + h$ 处，用到 $f$ 的这个值。在那里输出 $y$ 先乘以 $a$，**再**加上 $k$。逐个坐标地变化：新的点是 $\\left(\\frac{x}{b} + h, ay + k\\right)$。

$f$ 上的点 $(1, 4)$ 移到 $y = 2f(x) - 3$ 上的 $(1, 2 \\cdot 4 - 3) = (1, 5)$，移到 $y = f(x + 1) + 6$ 上的 $(1 - 1, 4 + 6) = (0, 10)$，移到 $y = f(2x)$ 上的 $\\left(\\frac{1}{2}, 4\\right)$。

> **注意。** 函数内部的变化反着作用于 $x$：$x - h$ 是**加上** $h$，系数 $b$ 是**除以** $b$。外部的 $a$ 照写的那样相乘，乘完再加 $k$。不要把平移量 $h$ 乘以 $b$；写点时横坐标在前。`,
      ),
      generate(rng) {
        const g = compose(twoOps(rng));
        const p: [Q, Q] = [Q.of(rng.int(-6, 6)).mul(Q.of(g.b.n)), Q.of(rng.int(-6, 6)).mul(Q.of(g.a.d))];
        const [x, y] = mapPoint(g, p);
        const xHow = g.b.eq(Q.one)
          ? addText(g.h)
          : g.h.isZero()
            ? t(`divide by $${g.b.toLatex()}$`, `除以 $${g.b.toLatex()}$`)
            : t(`divide by $${g.b.toLatex()}$ and then ${addText(g.h).en}`, `先除以 $${g.b.toLatex()}$，再${addText(g.h)["zh-CN"]}`);
        const yHow = g.a.eq(Q.one)
          ? addText(g.k)
          : g.k.isZero()
            ? t(`multiply by $${g.a.toLatex()}$`, `乘以 $${g.a.toLatex()}$`)
            : t(`multiply by $${g.a.toLatex()}$ and then ${addText(g.k).en}`, `先乘以 $${g.a.toLatex()}$，再${addText(g.k)["zh-CN"]}`);
        const xMoves = !(g.b.eq(Q.one) && g.h.isZero());
        const yMoves = !(g.a.eq(Q.one) && g.k.isZero());
        const xStep = `${num(p[0])}${g.b.eq(Q.one) ? "" : ` \\div ${paren(g.b)}`}${plus(g.h)} = ${num(x)}`;
        const yStep = `${outAt(g, p[1])} = ${num(y)}`;
        return imageProblem(
          p,
          g,
          [
            { ...g, h: g.h.neg() },
            { ...g, k: g.k.neg() },
            { ...g, a: Q.one.div(g.a) },
            { ...g, b: Q.one.div(g.b) },
            { ...g, h: g.h.mul(g.b) },
          ],
          t(
            `${label(1, "Move the $x$-coordinate", "移动横坐标").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. ${
              xMoves
                ? `The changes inside, in $f(${argLatex(g.b, g.h)})$, act on $x$ backward: ${xHow.en}.${steps(xStep)}`
                : `Nothing changes inside $f$, so the $x$-coordinate stays $${num(x)}$.

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标").en} ${
              yMoves
                ? `The changes outside act on $y$ as written: ${yHow.en}.${steps(yStep)}`
                : `Nothing changes outside $f$, so the $y$-coordinate stays $${num(y)}$.

`
            }The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input of $f$ is $${argAt(g, x)}$, and $f(${num(p[0])}) = ${num(p[1])}$. So $g(${num(x)}) = ${outAt(g, p[1])} = ${num(y)}$.`,
            `${label(1, "Move the $x$-coordinate", "移动横坐标")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。${
              xMoves
                ? `$f(${argLatex(g.b, g.h)})$ 括号里的变化反着作用于 $x$：${xHow["zh-CN"]}。${steps(xStep)}`
                : `$f$ 的括号里没有变化，横坐标仍是 $${num(x)}$。

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标")["zh-CN"]} ${
              yMoves
                ? `外面的变化照写的那样作用于 $y$：${yHow["zh-CN"]}。${steps(yStep)}`
                : `$f$ 的外面没有变化，纵坐标仍是 $${num(y)}$。

`
            }所求的点是 $${pt(x, y)}$。

**检验。** 在 $x = ${num(x)}$ 处，$f$ 的输入是 $${argAt(g, x)}$，而 $f(${num(p[0])}) = ${num(p[1])}$。因此 $g(${num(x)}) = ${outAt(g, p[1])} = ${num(y)}$。`,
          ),
        );
      },
    },
    {
      id: "the-order-of-two-transformations",
      title: t("The order of the operations", "变换的顺序"),
      explanation: t(
        `Each operation acts on the formula built so far. An outside operation acts on the **whole** output, and an inside one replaces $x$ wherever it appears. So the order matters when two operations act in the same direction, and not when one is vertical and the other horizontal.

Stretching vertically by $2$ and then shifting up $3$ gives $y = 2f(x) + 3$; shifting up $3$ first and then stretching gives $y = 2(f(x) + 3) = 2f(x) + 6$, since the stretch doubles the shift too.

Horizontally, shifting right $1$ and then compressing by a factor of $\\frac{1}{2}$ replaces $x$ with $x - 1$ and then $x$ with $2x$: $y = f(2x - 1) = f\\left(2\\left(x - \\frac{1}{2}\\right)\\right)$. Compressing first gives $y = f(2(x - 1))$.

> **Watch out.** Apply the operations in the order given; reversing them changes the result when they act in the same direction. Keep the signs of the shifts ($x - h$ moves right, $+k$ moves up), and write a vertical factor as given but a horizontal one as its reciprocal.`,
        `每一步变换都作用在已经得到的式子上。外面的变换作用于**整个**输出，括号里的变换把每一处 $x$ 都替换掉。所以当两个变换作用在同一方向时，顺序会影响结果；一个竖直、一个水平时则不影响。

先竖直伸长为原来的 $2$ 倍再向上平移 $3$ 得到 $y = 2f(x) + 3$；先向上平移 $3$ 再伸长得到 $y = 2(f(x) + 3) = 2f(x) + 6$，因为伸长把平移量也变成了 $2$ 倍。

水平方向，先向右平移 $1$ 再压缩为原来的 $\\frac{1}{2}$：先把 $x$ 换成 $x - 1$，再把 $x$ 换成 $2x$，得到 $y = f(2x - 1) = f\\left(2\\left(x - \\frac{1}{2}\\right)\\right)$。先压缩则得到 $y = f(2(x - 1))$。

> **注意。** 按给出的顺序进行变换；两个变换作用在同一方向时，颠倒顺序会改变结果。注意平移的符号（$x - h$ 向右移，$+k$ 向上移）；竖直伸缩直接写系数，水平伸缩写它的倒数。`,
      ),
      generate(rng) {
        const ops = twoOps(rng);
        const g = compose(ops);
        const rev = compose([...ops].reverse());
        const candidates = [
          g,
          rev,
          { ...g, h: g.h.neg() },
          { ...g, k: g.k.neg() },
          { ...rev, h: rev.h.neg(), k: rev.k.neg() },
          { ...g, a: Q.one.div(g.a), b: Q.one.div(g.b) },
        ];
        const first = compose(ops.slice(0, 1));
        const pair: [Q, Q] = [Q.of(2), Q.of(2)];
        const end = mapPoint(g, pair);
        return reasoned(
          shuffled(
            rng,
            t(
              `The graph of $g$ is obtained from the graph of $f$ as follows. ${opsText(ops).en} Which is $g(x)$?`,
              `$f$ 的图象按以下方式变换得到 $g$ 的图象：${opsText(ops)["zh-CN"]}$g(x)$ 是哪一个？`,
            ),
            candidates.map((c) => same(`$g(x) = ${tfLatex(c)}$`)),
            t(
              `${label(1, "Apply the first operation", "做第一步").en} Start from $y = f(x)$ and ${opHow(ops[0]!).en}: $y = ${tfLatex(first)}$.

${label(2, "Apply the second to that formula", "第二步作用在新式子上").en} Now ${opHow(ops[1]!).en}. It acts on everything written so far:${steps(`g(x) = ${tfLatex(g)}`)}${tfLatex(rev) === tfLatex(g) ? "Here one operation is vertical and the other horizontal, so the other order gives the same function." : `In the other order the result would be $${tfLatex(rev)}$, a different function: here the order matters.`}

**Check.** Follow the point $(2, 2)$ of $f$: $${[pair, ...trail(ops, pair)].map(([px, py]) => pt(px, py)).join(" \\to ")}$. At $x = ${num(end[0])}$ the input of $f$ is $${argAt(g, end[0])}$, so $g(${num(end[0])}) = ${outAt(g, Q.of(2))} = ${num(end[1])}$, as it should be.`,
              `${label(1, "Apply the first operation", "做第一步")["zh-CN"]} 从 $y = f(x)$ 出发，${opHow(ops[0]!)["zh-CN"]}：$y = ${tfLatex(first)}$。

${label(2, "Apply the second to that formula", "第二步作用在新式子上")["zh-CN"]} 接着${opHow(ops[1]!)["zh-CN"]}。它作用在已经得到的整个式子上：${steps(`g(x) = ${tfLatex(g)}`)}${tfLatex(rev) === tfLatex(g) ? "这里一步是竖直的、一步是水平的，所以换个顺序得到同一个函数。" : `换个顺序会得到 $${tfLatex(rev)}$，是另一个函数：这里顺序有影响。`}

**检验。** 追踪 $f$ 上的点 $(2, 2)$：$${[pair, ...trail(ops, pair)].map(([px, py]) => pt(px, py)).join(" \\to ")}$。在 $x = ${num(end[0])}$ 处 $f$ 的输入是 $${argAt(g, end[0])}$，所以 $g(${num(end[0])}) = ${outAt(g, Q.of(2))} = ${num(end[1])}$，与之相符。`,
            ),
          ),
          [
            [
              `$g(x) = ${tfLatex(rev)}$`,
              "This applies the two operations in the reverse order, and the order changes the result here.",
              "这里把两步的顺序颠倒了，而这里顺序会影响结果。",
            ],
            [
              `$g(x) = ${tfLatex({ ...g, h: g.h.neg() })}$`,
              "The horizontal shift goes the wrong way: $x - h$ moves the graph to the right when $h$ is positive.",
              "水平平移方向反了：$h$ 为正时，$x - h$ 把图象向右移。",
            ],
            [
              `$g(x) = ${tfLatex({ ...g, k: g.k.neg() })}$`,
              "The vertical shift goes the wrong way: the number added outside moves the graph by that amount, sign included.",
              "竖直平移方向反了：加在外面的数连同符号决定图象移动的量。",
            ],
            [
              `$g(x) = ${tfLatex({ ...rev, h: rev.h.neg(), k: rev.k.neg() })}$`,
              "This reverses the order and also the directions of the shifts.",
              "这里既颠倒了顺序，又把平移方向弄反了。",
            ],
            [
              `$g(x) = ${tfLatex({ ...g, a: Q.one.div(g.a), b: Q.one.div(g.b) })}$`,
              "The factors are upside down: a stretch writes its factor as given, and a horizontal change writes the factor's reciprocal.",
              "系数颠倒了：竖直伸缩直接写系数，水平伸缩写的是它的倒数。",
            ],
          ],
        );
      },
    },
    {
      id: "two-transformations-from-graphs",
      figure: algebraDrawings3["combining-graph-transformations-two-operations#two-transformations-from-graphs"],
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        `A stretch changes the size of a graph and a shift changes only its position. So read the stretches first, from the width and height, and then the shifts, from where a matching point ends up.

Say the solid graph of $f$ runs through $(-2, 0)$, $(0, -2)$ and $(2, 2)$, and the dashed graph through $(1, 0)$, $(3, -4)$ and $(5, 4)$. Both are $4$ wide, so there is no horizontal stretch; the heights are $4$ and $8$, so $a = \\frac{8}{4} = 2$. After the stretch alone the left endpoint $(-2, 0)$ would stay at $(-2, 0)$, but it is at $(1, 0)$: $h = 3$ and $k = 0$. Hence $g(x) = 2f(x - 3)$. Check with $(0, -2)$: it goes to $(0 + 3, 2 \\cdot (-2)) = (3, -4)$.

> **Watch out.** Compare matching points, such as the two left endpoints. The dashed graph to the left or below means a negative shift. A wider graph means a horizontal factor $b$ less than $1$, not more; and in $b(x - h)$ the shift is $h$ itself, not $h$ times $b$.`,
        `伸缩改变图象的大小，平移只改变它的位置。所以先从宽度和高度读出伸缩，再从对应点最终的位置读出平移。

设实线 $f$ 经过 $(-2, 0)$、$(0, -2)$、$(2, 2)$，虚线经过 $(1, 0)$、$(3, -4)$、$(5, 4)$。两个图象都宽 $4$，所以没有水平伸缩；高度分别是 $4$ 和 $8$，所以 $a = \\frac{8}{4} = 2$。只做伸缩时，左端点 $(-2, 0)$ 仍在 $(-2, 0)$，但它实际在 $(1, 0)$：$h = 3$，$k = 0$。因此 $g(x) = 2f(x - 3)$。用 $(0, -2)$ 检验：它移到 $(0 + 3, 2 \\cdot (-2)) = (3, -4)$。

> **注意。** 要比较对应点，例如两个左端点。虚线在左边或下边，说明平移量是负数。图象变宽说明水平系数 $b$ 小于 $1$，而不是大于 $1$；在 $b(x - h)$ 中平移量就是 $h$，不是 $h$ 乘 $b$。`,
      ),
      generate(rng) {
        const c = pairCase(rng, () => compose(twoOps(rng)), { x: [-4, 4], y: [-4, 4] });
        const g = c.tf;
        const wrong = [
          { ...g, h: g.h.neg() },
          { ...g, k: g.k.neg() },
          { ...g, a: Q.one.div(g.a) },
          { ...g, b: Q.one.div(g.b) },
          { ...g, h: g.h.mul(g.b) },
          { ...g, h: g.h.neg(), k: g.k.neg() },
        ].filter((w, i, all) => imageKey(w, c.f) !== imageKey(g, c.f) && all.findIndex((v) => tfLatex(v) === tfLatex(w)) === i);
        const [x, y] = c.f[0]!;
        const [u, v] = mapPoint(g, [Q.of(x), Q.of(y)]);
        const xs = c.f.map((q) => q[0]);
        const ys = c.f.map((q) => q[1]);
        const wide = Math.max(...xs) - Math.min(...xs);
        const tall = Math.max(...ys) - Math.min(...ys);
        const [xc, yc] = c.f[c.f.length - 1]!;
        const [uc, vc] = mapPoint(g, [Q.of(xc), Q.of(yc)]);
        const [sx, sy] = [Q.of(x).div(g.b), g.a.mul(Q.of(y))];
        const opt = (w: Tf) => `$g(x) = ${tfLatex(w)}$`;
        const reasons: Reason[] = [
          [
            opt({ ...g, h: g.h.neg() }),
            "The horizontal shift goes the wrong way: $x - h$ moves the graph right by $h$.",
            "水平平移方向反了：$x - h$ 把图象向右移 $h$。",
          ],
          [
            opt({ ...g, k: g.k.neg() }),
            "The vertical shift goes the wrong way: $+k$ outside moves the graph up by $k$.",
            "竖直平移方向反了：外面的 $+k$ 把图象向上移 $k$。",
          ],
          [
            opt({ ...g, a: Q.one.div(g.a) }),
            "The vertical factor is upside down: the heights are multiplied by $a$ itself.",
            "竖直方向的系数颠倒了：高度乘以 $a$ 本身。",
          ],
          [
            opt({ ...g, b: Q.one.div(g.b) }),
            "The horizontal factor is upside down: a factor $b$ inside divides the widths by $b$.",
            "水平方向的系数颠倒了：括号里的系数 $b$ 把宽度除以 $b$。",
          ],
          [
            opt({ ...g, h: g.h.mul(g.b) }),
            "The shift is multiplied by $b$: in $b(x - h)$ the graph moves by $h$ itself.",
            "平移量被乘了 $b$：在 $b(x - h)$ 中图象移动的正是 $h$。",
          ],
          [opt({ ...g, h: g.h.neg(), k: g.k.neg() }), "Both shifts go the wrong way.", "两个平移方向都反了。"],
        ];
        return annotate(
          {
            ...reasoned(
              shuffled(
                rng,
                solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
                [g, ...rng.shuffle(wrong).slice(0, 3)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
                t(
                  `${label(1, "Compare the sizes", "比较大小").en} The solid graph is $${wide}$ wide and $${tall}$ tall; the dashed one is $${num(Q.of(wide).div(g.b))}$ wide and $${num(g.a.mul(Q.of(tall)))}$ tall. From the widths, $b = \\frac{${wide}}{${num(Q.of(wide).div(g.b))}} = ${g.b.toLatex()}$. From the heights, $a = \\frac{${num(g.a.mul(Q.of(tall)))}}{${tall}} = ${g.a.toLatex()}$.

${label(2, "Find the shifts", "求平移量").en} After the stretches alone, the left endpoint $${pt(x, y)}$ of $f$ would be at $${pt(sx, sy)}$. It is at $${pt(u, v)}$ instead. Hence $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$ and $k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$:${steps(`g(x) = ${tfLatex(g)}`)}**Check.** The right endpoint $${pt(xc, yc)}$ of $f$ should go to $${pt(uc, vc)}$. At $x = ${num(uc)}$ the input of $f$ is $${argAt(g, uc)}$, so $g(${num(uc)}) = ${outAt(g, Q.of(yc))} = ${num(vc)}$: that is the right endpoint of the dashed graph.`,
                  `${label(1, "Compare the sizes", "比较大小")["zh-CN"]} 实线宽 $${wide}$、高 $${tall}$；虚线宽 $${num(Q.of(wide).div(g.b))}$、高 $${num(g.a.mul(Q.of(tall)))}$。由宽度得 $b = \\frac{${wide}}{${num(Q.of(wide).div(g.b))}} = ${g.b.toLatex()}$，由高度得 $a = \\frac{${num(g.a.mul(Q.of(tall)))}}{${tall}} = ${g.a.toLatex()}$。

${label(2, "Find the shifts", "求平移量")["zh-CN"]} 只做伸缩时，$f$ 的左端点 $${pt(x, y)}$ 会在 $${pt(sx, sy)}$，而它实际在 $${pt(u, v)}$。因此 $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$，$k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$：${steps(`g(x) = ${tfLatex(g)}`)}**检验。** $f$ 的右端点 $${pt(xc, yc)}$ 应移到 $${pt(uc, vc)}$。在 $x = ${num(uc)}$ 处 $f$ 的输入是 $${argAt(g, uc)}$，所以 $g(${num(uc)}) = ${outAt(g, Q.of(yc))} = ${num(vc)}$：正是虚线的右端点。`,
                ),
              ),
              reasons,
            ),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(g, [x, y]),
          ...imageAlt(g, [x, y]),
        );
      },
    },
  ],
};

// 3.10.6 Three or more operations.

/** threeTf draws a·f(b(x − h)) + k with a, b > 0 and at least three of the parameters changed. */
function threeTf(rng: Rng, small = false): Tf {
  for (;;) {
    const a = rng.bool(0.7) ? rng.pick(small ? [Q.of(2), Q.of(1, 2)] : stretchFactors) : Q.one;
    const b = rng.bool(0.6) ? rng.pick(small ? [Q.of(2), Q.of(1, 2)] : [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3)]) : Q.one;
    const h = rng.bool(0.8) ? Q.of(rng.nonZero(-4, 4)) : Q.zero;
    const k = rng.bool(0.8) ? Q.of(rng.nonZero(-4, 4)) : Q.zero;
    const changed = [!a.eq(Q.one), !b.eq(Q.one), !h.isZero(), !k.isZero()].filter(Boolean).length;
    if (changed >= 3) return { a, b, h, k };
  }
}

/** combiningGraphTransformationsThreeOrMoreOperations reads and applies y = a·f(b(x − h)) + k. */
export const combiningGraphTransformationsThreeOrMoreOperations: TopicDef = {
  id: "combining-graph-transformations-three-or-more-operations",
  title: t("Combining Graph Transformations: Three or More Operations", "图象的组合变换：三步及以上"),
  summary: t(
    "Read the stretches and shifts in y = a·f(b(x − h)) + k and follow points through them.",
    "读出 y = a·f(b(x − h)) + k 中的伸缩与平移，并追踪点的变化。",
  ),
  prerequisites: ["combining-graph-transformations-two-operations"],
  encompasses: [{ topic: "combining-graph-transformations-two-operations", weight: 0.7 }],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `With two operations we saw that inside changes act on $x$ and outside changes act on $y$, and that a stretch acts on a shift made before it. With all four at once, $y = a f(b(x - h)) + k$, the same rules give a fixed order: horizontally, stretch by $\\frac{1}{b}$ and then shift by $h$; vertically, stretch by $a$ and then shift by $k$.

Take $f(x) = x^{2}$ and $g(x) = \\frac{1}{2} f(2(x - 3)) + 1$. Each point $(x, y)$ moves to $\\left(\\frac{x}{2} + 3, \\frac{1}{2}y + 1\\right)$:

$$\\begin{array}{c|ccc} \\text{point of } f & (-2, 4) & (0, 0) & (2, 4) \\\\ \\hline \\text{point of } g & (2, 3) & (3, 1) & (4, 3) \\end{array}$$

Check: $g(4) = \\frac{1}{2}(2(4 - 3))^{2} + 1 = \\frac{1}{2} \\cdot 4 + 1 = 3$. If the formula is written $\\frac{1}{2} f(2x - 6) + 1$, factor first, $2x - 6 = 2(x - 3)$: the shift is $3$, not $6$.

In this lesson we describe several transformations from a formula, follow points through them, and find the formula from two graphs.`,
    `学两步变换时我们看到：括号里的变化作用于 $x$，外面的变化作用于 $y$，而伸缩会作用在它之前做的平移上。四种变化同时出现，即 $y = a f(b(x - h)) + k$ 时，同样的规则给出固定的顺序：水平方向先伸缩为原来的 $\\frac{1}{b}$，再平移 $h$；竖直方向先伸缩为原来的 $a$ 倍，再平移 $k$。

取 $f(x) = x^{2}$，$g(x) = \\frac{1}{2} f(2(x - 3)) + 1$。每个点 $(x, y)$ 移到 $\\left(\\frac{x}{2} + 3, \\frac{1}{2}y + 1\\right)$：

$$\\begin{array}{c|ccc} f \\text{ 上的点} & (-2, 4) & (0, 0) & (2, 4) \\\\ \\hline g \\text{ 上的点} & (2, 3) & (3, 1) & (4, 3) \\end{array}$$

检验：$g(4) = \\frac{1}{2}(2(4 - 3))^{2} + 1 = \\frac{1}{2} \\cdot 4 + 1 = 3$。如果式子写成 $\\frac{1}{2} f(2x - 6) + 1$，先提取公因数 $2x - 6 = 2(x - 3)$：平移量是 $3$，不是 $6$。

这节课我们由解析式描述多次变换，追踪点的位置，并从两个图象求出解析式。`,
  ),
  knowledgePoints: [
    {
      id: "describing-several-transformations",
      figure: algebraDrawings3["combining-graph-transformations-three-or-more-operations#describing-several-transformations"],
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        `The graph of $y = a f(b(x - h)) + k$ (with $a, b > 0$) comes from the graph of $f$ in this order:

1. horizontally, stretch by the factor $\\frac{1}{b}$, then shift right by $h$;
2. vertically, stretch by the factor $a$, then shift up by $k$.

Why this order: the stretch is applied to $x - h$, the result of the shift, so undoing it on the graph means stretching first; outside, $a$ multiplies $f$ before $k$ is added. For $y = 3f(2(x + 1)) - 4$: compress horizontally by $\\frac{1}{2}$, shift left $1$, stretch vertically by $3$, shift down $4$. If the argument is written as $2x + 2$, factor it first: $2x + 2 = 2(x + 1)$.

> **Watch out.** Read $h$ only after factoring out $b$: in $f(2x + 2)$ the shift is $1$ to the left, not $2$. $x - h$ shifts **right** by $h$ and $+k$ shifts up. The horizontal factor is $\\frac{1}{b}$, while the vertical factor is $a$ itself.`,
        `$y = a f(b(x - h)) + k$（$a, b > 0$）的图象由 $f$ 的图象按以下顺序得到：

1. 水平方向：伸缩为原来的 $\\frac{1}{b}$，再向右平移 $h$；
2. 竖直方向：伸缩为原来的 $a$ 倍，再向上平移 $k$。

为什么是这个顺序：系数 $b$ 乘的是平移后的 $x - h$，在图象上反过来就是先伸缩；外面的 $a$ 先乘 $f$，然后才加上 $k$。对于 $y = 3f(2(x + 1)) - 4$：水平方向压缩为原来的 $\\frac{1}{2}$，向左平移 $1$，竖直方向伸长为原来的 $3$ 倍，向下平移 $4$。如果自变量写成 $2x + 2$，先提取公因数：$2x + 2 = 2(x + 1)$。

> **注意。** 提取 $b$ 之后才能读出 $h$：在 $f(2x + 2)$ 中是向左平移 $1$，不是 $2$。$x - h$ 是向**右**平移 $h$，$+k$ 是向上平移。水平方向的系数是 $\\frac{1}{b}$，竖直方向的系数就是 $a$ 本身。`,
      ),
      generate(rng) {
        const g = threeTf(rng);
        const candidates = [
          g,
          { ...g, h: g.h.neg() },
          { ...g, k: g.k.neg() },
          { ...g, b: Q.one.div(g.b) },
          { ...g, a: Q.one.div(g.a) },
          { ...g, h: g.h.mul(g.b) },
        ];
        const ex: [Q, Q] = [Q.of(6), Q.of(g.a.d).mul(Q.of(2))];
        const last = mapPoint(g, ex);
        return reasoned(
          shuffled(
            rng,
            t(
              `Which sequence of transformations takes the graph of $y = f(x)$ to the graph of $y = ${tfLatex(g)}$?`,
              `哪一组变换把 $y = f(x)$ 的图象变成 $y = ${tfLatex(g)}$ 的图象？`,
            ),
            candidates.map((c) => opsText(standardOps(c))),
            t(
              `${label(1, "Read the parameters", "读出参数").en} Match $y = ${tfLatex(g)}$ with $y = a f(b(x - h)) + k$: $a = ${g.a.toLatex()}$, $b = ${g.b.toLatex()}$, $h = ${g.h.toLatex()}$ and $k = ${g.k.toLatex()}$.

${label(2, "Put the steps in order", "按顺序排列").en} The changes inside come first, the stretch by $\\frac{1}{b}$ before the shift by $h$; then the changes outside, the stretch by $a$ before the shift by $k$. Leaving out the parameters that change nothing: ${opsText(standardOps(g)).en}

**Check.** These steps take the point $${pt(ex[0], ex[1])}$ of $f$ along $${[ex, ...trail(standardOps(g), ex)].map(([px, py]) => pt(px, py)).join(" \\to ")}$. At $x = ${num(last[0])}$ the input of $f$ is $${argAt(g, last[0])}$, so $y = ${outAt(g, ex[1])} = ${num(last[1])}$ on the graph too.`,
              `${label(1, "Read the parameters", "读出参数")["zh-CN"]} 把 $y = ${tfLatex(g)}$ 与 $y = a f(b(x - h)) + k$ 对照：$a = ${g.a.toLatex()}$，$b = ${g.b.toLatex()}$，$h = ${g.h.toLatex()}$，$k = ${g.k.toLatex()}$。

${label(2, "Put the steps in order", "按顺序排列")["zh-CN"]} 先做括号里的变化：先伸缩为原来的 $\\frac{1}{b}$，再平移 $h$；再做外面的变化：先伸缩为原来的 $a$ 倍，再平移 $k$。去掉不起作用的参数：${opsText(standardOps(g))["zh-CN"]}

**检验。** 这些步骤把 $f$ 上的点 $${pt(ex[0], ex[1])}$ 依次移到 $${[ex, ...trail(standardOps(g), ex)].map(([px, py]) => pt(px, py)).join(" \\to ")}$。在 $x = ${num(last[0])}$ 处 $f$ 的输入是 $${argAt(g, last[0])}$，所以图象上 $y = ${outAt(g, ex[1])} = ${num(last[1])}$，也相符。`,
            ),
          ),
          [
            [
              opsText(standardOps({ ...g, h: g.h.neg() })).en,
              "The horizontal shift goes the wrong way: $x - h$ moves the graph to the right when $h$ is positive.",
              "水平平移方向反了：$h$ 为正时，$x - h$ 把图象向右移。",
            ],
            [
              opsText(standardOps({ ...g, k: g.k.neg() })).en,
              "The vertical shift goes the wrong way: the number added outside moves the graph by that amount, sign included.",
              "竖直平移方向反了：加在外面的数连同符号决定图象移动的量。",
            ],
            [
              opsText(standardOps({ ...g, b: Q.one.div(g.b) })).en,
              "The horizontal factor is upside down: a factor $b$ on the input multiplies the $x$-coordinates by $\\frac{1}{b}$.",
              "水平方向的系数颠倒了：输入上的系数 $b$ 把横坐标乘以 $\\frac{1}{b}$。",
            ],
            [
              opsText(standardOps({ ...g, a: Q.one.div(g.a) })).en,
              "The vertical factor is upside down: a factor $a$ outside multiplies the $y$-coordinates by $a$ itself.",
              "竖直方向的系数颠倒了：外面的系数 $a$ 把纵坐标乘以 $a$ 本身。",
            ],
            [
              opsText(standardOps({ ...g, h: g.h.mul(g.b) })).en,
              "The shift is too far: in $b(x - h)$ the factor is already outside, so the shift is $h$ and not $h$ times $b$.",
              "平移量错了：在 $b(x - h)$ 中系数已提到外面，所以平移量是 $h$，不是 $h$ 乘 $b$。",
            ],
          ],
        );
      },
    },
    {
      id: "points-under-several-transformations",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        `Changes inside the function act on $x$ and are undone in reverse, while changes outside act on $y$ directly. Track a single point through each transformation.

For $y = a f(b(x - h)) + k$, the point $(x, y)$ of $f$ moves to

$$\\left(\\frac{x}{b} + h,\\ ay + k\\right).$$

The new $x$-coordinate is the number that makes the input $b(x - h)$ equal to the old one, and the new height is the old height multiplied by $a$ and then raised by $k$. For $y = 3f(2(x + 1)) - 4$, the point $(6, 2)$ moves to $\\left(\\frac{6}{2} - 1,\\ 3 \\cdot 2 - 4\\right) = (2, 2)$.

> **Watch out.** Divide by $b$ and then add $h$: do not multiply by $b$, and do not subtract $h$, since $x - h$ moves points **right**. Multiply the height by $a$ itself before adding $k$. Keep the $x$-coordinate first.`,
        `函数内部的变化作用于 $x$，要反过来理解；函数外部的变化直接作用于 $y$。跟踪一个点经过每一次变换的位置。

对于 $y = a f(b(x - h)) + k$，$f$ 上的点 $(x, y)$ 移到

$$\\left(\\frac{x}{b} + h,\\ ay + k\\right)$$

新的横坐标是使输入 $b(x - h)$ 等于原横坐标的那个数，新的高度是原高度乘以 $a$ 再加上 $k$。对于 $y = 3f(2(x + 1)) - 4$，点 $(6, 2)$ 移到 $\\left(\\frac{6}{2} - 1,\\ 3 \\cdot 2 - 4\\right) = (2, 2)$。

> **注意。** 先除以 $b$，再加上 $h$：不要乘以 $b$，也不要减去 $h$，因为 $x - h$ 把点向**右**移。高度乘以 $a$ 本身，再加 $k$。横坐标写在前面。`,
      ),
      generate(rng) {
        const g = threeTf(rng);
        const p: [Q, Q] = [Q.of(rng.int(-5, 5)).mul(Q.of(g.b.n)), Q.of(rng.int(-5, 5)).mul(Q.of(g.a.d))];
        const [x, y] = mapPoint(g, p);
        const xHow = g.b.eq(Q.one)
          ? addText(g.h)
          : g.h.isZero()
            ? t(`divide by $${g.b.toLatex()}$`, `除以 $${g.b.toLatex()}$`)
            : t(`divide by $${g.b.toLatex()}$ and then ${addText(g.h).en}`, `先除以 $${g.b.toLatex()}$，再${addText(g.h)["zh-CN"]}`);
        const yHow = g.a.eq(Q.one)
          ? addText(g.k)
          : g.k.isZero()
            ? t(`multiply by $${g.a.toLatex()}$`, `乘以 $${g.a.toLatex()}$`)
            : t(`multiply by $${g.a.toLatex()}$ and then ${addText(g.k).en}`, `先乘以 $${g.a.toLatex()}$，再${addText(g.k)["zh-CN"]}`);
        const xMoves = !(g.b.eq(Q.one) && g.h.isZero());
        const yMoves = !(g.a.eq(Q.one) && g.k.isZero());
        const xStep = `${num(p[0])}${g.b.eq(Q.one) ? "" : ` \\div ${paren(g.b)}`}${plus(g.h)} = ${num(x)}`;
        const yStep = `${outAt(g, p[1])} = ${num(y)}`;
        return imageProblem(
          p,
          g,
          [
            { ...g, h: g.h.neg() },
            { ...g, k: g.k.neg() },
            { ...g, b: Q.one.div(g.b) },
            { ...g, a: Q.one.div(g.a) },
            { ...g, h: g.h.mul(g.b) },
          ],
          t(
            `${label(1, "Move the $x$-coordinate", "移动横坐标").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. ${
              xMoves
                ? `The changes inside, in $f(${argLatex(g.b, g.h)})$, act on $x$ backward: ${xHow.en}.${steps(xStep)}`
                : `Nothing changes inside $f$, so the $x$-coordinate stays $${num(x)}$.

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标").en} ${
              yMoves
                ? `The changes outside act on $y$ as written: ${yHow.en}.${steps(yStep)}`
                : `Nothing changes outside $f$, so the $y$-coordinate stays $${num(y)}$.

`
            }The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input of $f$ is $${argAt(g, x)}$, and $f(${num(p[0])}) = ${num(p[1])}$. So $g(${num(x)}) = ${outAt(g, p[1])} = ${num(y)}$.`,
            `${label(1, "Move the $x$-coordinate", "移动横坐标")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。${
              xMoves
                ? `$f(${argLatex(g.b, g.h)})$ 括号里的变化反着作用于 $x$：${xHow["zh-CN"]}。${steps(xStep)}`
                : `$f$ 的括号里没有变化，横坐标仍是 $${num(x)}$。

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标")["zh-CN"]} ${
              yMoves
                ? `外面的变化照写的那样作用于 $y$：${yHow["zh-CN"]}。${steps(yStep)}`
                : `$f$ 的外面没有变化，纵坐标仍是 $${num(y)}$。

`
            }所求的点是 $${pt(x, y)}$。

**检验。** 在 $x = ${num(x)}$ 处，$f$ 的输入是 $${argAt(g, x)}$，而 $f(${num(p[0])}) = ${num(p[1])}$。因此 $g(${num(x)}) = ${outAt(g, p[1])} = ${num(y)}$。`,
          ),
        );
      },
    },
    {
      id: "several-transformations-from-graphs",
      figure: algebraDrawings3["combining-graph-transformations-three-or-more-operations#several-transformations-from-graphs"],
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        `To match a graph with $y = a f(b(x - h)) + k$, compare the width and height of the two graphs to find $b$ and $a$, then compare matching endpoints to find the shifts. The stretches change only the size and the shifts only the position, so the two steps do not interfere.

Say the solid graph of $f$ runs through $(0, 0)$, $(2, 2)$ and $(4, 0)$, and the dashed graph through $(-1, -1)$, $(3, 3)$ and $(7, -1)$. The width goes from $4$ to $8$, so $b = \\frac{4}{8} = \\frac{1}{2}$; the height goes from $2$ to $4$, so $a = 2$. After the stretches alone the left endpoint $(0, 0)$ would still be at $(0, 0)$, but it is at $(-1, -1)$: $h = -1$ and $k = -1$. Hence $g(x) = 2f\\left(\\frac{1}{2}(x + 1)\\right) - 1$. Check: $(2, 2)$ goes to $(2 \\cdot 2 - 1, 2 \\cdot 2 - 1) = (3, 3)$.

> **Watch out.** The horizontal factor $b$ is the old width over the new width, the reciprocal of the stretch factor. The vertical factor $a$ is the new height over the old. Find the shifts after the stretches, so that $h$ is not multiplied by $b$, and mind their signs.`,
        `要把图象与 $y = a f(b(x - h)) + k$ 对应，先比较两个图象的宽度和高度，求出 $b$ 和 $a$，再比较对应端点求出平移量。伸缩只改变大小，平移只改变位置，所以这两步互不干扰。

设实线 $f$ 经过 $(0, 0)$、$(2, 2)$、$(4, 0)$，虚线经过 $(-1, -1)$、$(3, 3)$、$(7, -1)$。宽度从 $4$ 变成 $8$，所以 $b = \\frac{4}{8} = \\frac{1}{2}$；高度从 $2$ 变成 $4$，所以 $a = 2$。只做伸缩时，左端点 $(0, 0)$ 仍在 $(0, 0)$，但它实际在 $(-1, -1)$：$h = -1$，$k = -1$。因此 $g(x) = 2f\\left(\\frac{1}{2}(x + 1)\\right) - 1$。检验：$(2, 2)$ 移到 $(2 \\cdot 2 - 1, 2 \\cdot 2 - 1) = (3, 3)$。

> **注意。** 水平系数 $b$ 是原宽度除以新宽度，是伸缩倍数的倒数；竖直系数 $a$ 是新高度除以原高度。伸缩求完再求平移，这样 $h$ 不会被乘以 $b$；还要注意平移的符号。`,
      ),
      generate(rng) {
        const c = pairCase(rng, () => threeTf(rng, true), { x: [-6, 6], y: [-4, 4] });
        const g = c.tf;
        const wrong = [
          { ...g, h: g.h.neg() },
          { ...g, k: g.k.neg() },
          { ...g, a: Q.one.div(g.a) },
          { ...g, b: Q.one.div(g.b) },
          { ...g, h: g.h.mul(g.b) },
          { ...g, h: g.h.neg(), k: g.k.neg() },
        ].filter((w, i, all) => imageKey(w, c.f) !== imageKey(g, c.f) && all.findIndex((v) => tfLatex(v) === tfLatex(w)) === i);
        const [x, y] = c.f[c.f.length - 1]!;
        const [u, v] = mapPoint(g, [Q.of(x), Q.of(y)]);
        const xs = c.f.map((q) => q[0]);
        const ys = c.f.map((q) => q[1]);
        const wide = Math.max(...xs) - Math.min(...xs);
        const tall = Math.max(...ys) - Math.min(...ys);
        const [xc, yc] = c.f[0]!;
        const [uc, vc] = mapPoint(g, [Q.of(xc), Q.of(yc)]);
        const [sx, sy] = [Q.of(x).div(g.b), g.a.mul(Q.of(y))];
        const opt = (w: Tf) => `$g(x) = ${tfLatex(w)}$`;
        const reasons: Reason[] = [
          [
            opt({ ...g, h: g.h.neg() }),
            "The horizontal shift goes the wrong way: $x - h$ moves the graph right by $h$.",
            "水平平移方向反了：$x - h$ 把图象向右移 $h$。",
          ],
          [
            opt({ ...g, k: g.k.neg() }),
            "The vertical shift goes the wrong way: $+k$ outside moves the graph up by $k$.",
            "竖直平移方向反了：外面的 $+k$ 把图象向上移 $k$。",
          ],
          [
            opt({ ...g, a: Q.one.div(g.a) }),
            "The vertical factor is upside down: the heights are multiplied by $a$ itself.",
            "竖直方向的系数颠倒了：高度乘以 $a$ 本身。",
          ],
          [
            opt({ ...g, b: Q.one.div(g.b) }),
            "The horizontal factor is upside down: a factor $b$ inside divides the widths by $b$.",
            "水平方向的系数颠倒了：括号里的系数 $b$ 把宽度除以 $b$。",
          ],
          [
            opt({ ...g, h: g.h.mul(g.b) }),
            "The shift is multiplied by $b$: in $b(x - h)$ the graph moves by $h$ itself.",
            "平移量被乘了 $b$：在 $b(x - h)$ 中图象移动的正是 $h$。",
          ],
          [opt({ ...g, h: g.h.neg(), k: g.k.neg() }), "Both shifts go the wrong way.", "两个平移方向都反了。"],
        ];
        return annotate(
          {
            ...reasoned(
              shuffled(
                rng,
                solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
                [g, ...rng.shuffle(wrong).slice(0, 3)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
                t(
                  `${label(1, "Compare the sizes", "比较大小").en} The solid graph is $${wide}$ wide and $${tall}$ tall; the dashed one is $${num(Q.of(wide).div(g.b))}$ wide and $${num(g.a.mul(Q.of(tall)))}$ tall. From the widths, $b = \\frac{${wide}}{${num(Q.of(wide).div(g.b))}} = ${g.b.toLatex()}$. From the heights, $a = \\frac{${num(g.a.mul(Q.of(tall)))}}{${tall}} = ${g.a.toLatex()}$.

${label(2, "Find the shifts", "求平移量").en} After the stretches alone, the right endpoint $${pt(x, y)}$ of $f$ would be at $${pt(sx, sy)}$. It is at $${pt(u, v)}$ instead. Hence $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$ and $k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$:${steps(`g(x) = ${tfLatex(g)}`)}**Check.** The left endpoint $${pt(xc, yc)}$ of $f$ should go to $${pt(uc, vc)}$. At $x = ${num(uc)}$ the input of $f$ is $${argAt(g, uc)}$, so $g(${num(uc)}) = ${outAt(g, Q.of(yc))} = ${num(vc)}$: that is the left endpoint of the dashed graph.`,
                  `${label(1, "Compare the sizes", "比较大小")["zh-CN"]} 实线宽 $${wide}$、高 $${tall}$；虚线宽 $${num(Q.of(wide).div(g.b))}$、高 $${num(g.a.mul(Q.of(tall)))}$。由宽度得 $b = \\frac{${wide}}{${num(Q.of(wide).div(g.b))}} = ${g.b.toLatex()}$，由高度得 $a = \\frac{${num(g.a.mul(Q.of(tall)))}}{${tall}} = ${g.a.toLatex()}$。

${label(2, "Find the shifts", "求平移量")["zh-CN"]} 只做伸缩时，$f$ 的右端点 $${pt(x, y)}$ 会在 $${pt(sx, sy)}$，而它实际在 $${pt(u, v)}$。因此 $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$，$k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$：${steps(`g(x) = ${tfLatex(g)}`)}**检验。** $f$ 的左端点 $${pt(xc, yc)}$ 应移到 $${pt(uc, vc)}$。在 $x = ${num(uc)}$ 处 $f$ 的输入是 $${argAt(g, uc)}$，所以 $g(${num(uc)}) = ${outAt(g, Q.of(yc))} = ${num(vc)}$：正是虚线的左端点。`,
                ),
              ),
              reasons,
            ),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(g, [x, y]),
          ...imageAlt(g, [x, y]),
        );
      },
    },
  ],
};

// 3.10.7 Constructing functions.

/** Parent is a basic function whose transformations are written directly. */
interface Parent {
  readonly name: Text;
  /** at writes the function applied to x − h. */
  readonly at: (h: Q) => string;
  readonly f: (x: number) => number;
}

const parents: readonly Parent[] = [
  {
    name: same("$y = x^{2}$"),
    at: (h) => (h.isZero() ? "x^{2}" : `(${shifted(h)})^{2}`),
    f: (x) => x * x,
  },
  {
    name: same("$y = x^{3}$"),
    at: (h) => (h.isZero() ? "x^{3}" : `(${shifted(h)})^{3}`),
    f: (x) => x * x * x,
  },
  {
    name: same("$y = \\sqrt{x}$"),
    at: (h) => `\\sqrt{${shifted(h)}}`,
    f: (x) => (x >= 0 ? Math.sqrt(x) : Number.NaN),
  },
  {
    name: same("$y = |x|$"),
    at: (h) => `|${shifted(h)}|`,
    f: (x) => Math.abs(x),
  },
];

/** parentLatex writes a·P(x − h) + k. */
const parentLatex = (p: Parent, a: Q, h: Q, k: Q) => `${front(a)}${p.at(h)}${plus(k)}`;

/** constructingFunctionsUsingTransformations writes formulas for transformed functions. */
export const constructingFunctionsUsingTransformations: TopicDef = {
  id: "constructing-functions-using-transformations",
  title: t("Constructing Functions Using Transformations", "用变换构造函数"),
  summary: t(
    "Write the formula of a function obtained from a known function by a sequence of transformations.",
    "写出由已知函数经过一系列变换得到的函数的解析式。",
  ),
  prerequisites: ["combining-graph-transformations-three-or-more-operations", "function-composition"],
  encompasses: [{ topic: "combining-graph-transformations-three-or-more-operations", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.BF.A.1"],
  intro: t(
    `So far we have read transformations off a formula. Now we go the other way: given a function and a list of transformations, we write the new formula, one operation at a time.

Each operation acts on the formula written so far. Shifting right $h$ replaces $x$ with $x - h$; stretching vertically by $a$ multiplies the **whole** formula by $a$; shifting up $k$ adds $k$. Start from $y = |x|$: shift right $2$, then stretch vertically by $3$, then shift down $1$:

$$y = |x| \\ \\to\\ y = |x - 2| \\ \\to\\ y = 3|x - 2| \\ \\to\\ y = 3|x - 2| - 1.$$

Check with a point: $(1, 1)$ is on $y = |x|$ and moves to $(1 + 2, 3 \\cdot 1 - 1) = (3, 2)$, and indeed $3|3 - 2| - 1 = 2$.

When the function is given by its own formula, write the transformation in function notation and substitute. For $f(x) = x^{2} + 1$ shifted right $2$: $g(x) = f(x - 2) = (x - 2)^{2} + 1 = x^{2} - 4x + 5$.

In this lesson we transform basic functions, transform a given function, and write equations from graphs.`,
    `前面我们是从解析式读出变换。现在反过来：给定一个函数和一串变换，一步一步写出新的解析式。

每一步变换都作用在已经写出的式子上。向右平移 $h$：把 $x$ 换成 $x - h$；竖直伸缩为原来的 $a$ 倍：把**整个**式子乘以 $a$；向上平移 $k$：加上 $k$。从 $y = |x|$ 出发，向右平移 $2$，再竖直伸长为原来的 $3$ 倍，再向下平移 $1$：

$$y = |x| \\ \\to\\ y = |x - 2| \\ \\to\\ y = 3|x - 2| \\ \\to\\ y = 3|x - 2| - 1$$

用一个点检验：$(1, 1)$ 在 $y = |x|$ 上，移到 $(1 + 2, 3 \\cdot 1 - 1) = (3, 2)$，而 $3|3 - 2| - 1 = 2$，正确。

当函数由自己的解析式给出时，先用函数记号写出变换，再代入。把 $f(x) = x^{2} + 1$ 向右平移 $2$：$g(x) = f(x - 2) = (x - 2)^{2} + 1 = x^{2} - 4x + 5$。

这节课我们变换基本函数，变换给定的函数，并由图象写出解析式。`,
  ),
  knowledgePoints: [
    {
      id: "transforming-basic-functions",
      title: t("Transforming basic functions", "变换基本函数"),
      explanation: t(
        `Build the formula one operation at a time, in the order given, because each operation acts on the formula written so far:

- shifting right $h$ replaces $x$ with $x - h$;
- stretching vertically by $a$ multiplies the **whole** current formula by $a$;
- shifting up $k$ adds $k$ to the whole formula.

Starting from $y = \\sqrt{x}$: shift up $1$ gives $y = \\sqrt{x} + 1$; then stretch vertically by $3$ gives $y = 3(\\sqrt{x} + 1) = 3\\sqrt{x} + 3$; then shift left $2$ gives $y = 3\\sqrt{x + 2} + 3$.

> **Watch out.** Shifting right writes $x - h$ with a minus sign, and shifting up adds $k$ with its own sign. A stretch that comes **after** a vertical shift multiplies that shift too; a stretch that comes before it does not.`,
        `按给定顺序一步一步地写出解析式，因为每一步都作用在已经写出的式子上：

- 向右平移 $h$：把 $x$ 换成 $x - h$；
- 竖直方向伸缩为原来的 $a$ 倍：把**整个**当前解析式乘以 $a$；
- 向上平移 $k$：给整个解析式加上 $k$。

从 $y = \\sqrt{x}$ 出发：向上平移 $1$ 得 $y = \\sqrt{x} + 1$；再竖直伸长为原来的 $3$ 倍得 $y = 3(\\sqrt{x} + 1) = 3\\sqrt{x} + 3$；再向左平移 $2$ 得 $y = 3\\sqrt{x + 2} + 3$。

> **注意。** 向右平移写成带减号的 $x - h$；向上平移加上 $k$，符号照抄。竖直平移**之后**的伸缩也会把平移量相乘；在平移之前的伸缩则不会。`,
      ),
      generate(rng) {
        const p = rng.pick(parents);
        const ops = rng.shuffle([
          right(rng.nonZero(-6, 6)),
          up(rng.nonZero(-6, 6)),
          vertical(rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2)])),
        ]);
        const g = compose(ops);
        const ver = ops.filter((o) => o.kind !== "right");
        const naive = compose([...ver].sort((o) => (o.kind === "vertical" ? -1 : 1)));
        const answer = parentLatex(p, g.a, g.h, g.k);
        const end = mapPoint(g, [Q.one, Q.one]);
        const buildSteps = (loc: "en" | "zh-CN") =>
          ops
            .map((op, i) => {
              const before = compose(ops.slice(0, i));
              const s = compose(ops.slice(0, i + 1));
              const formula =
                op.kind === "vertical" && !before.k.isZero()
                  ? `y = ${op.by.toLatex()}\\left(${parentLatex(p, before.a, before.h, before.k)}\\right) = ${parentLatex(p, s.a, s.h, s.k)}`
                  : `y = ${parentLatex(p, s.a, s.h, s.k)}`;
              const how = opHow(op);
              return `${label(i + 1, cap(opText(op).en), opText(op)["zh-CN"])[loc]} ${loc === "en" ? `${cap(how.en)}:` : `${how["zh-CN"]}：`}${steps(formula)}`;
            })
            .join("");
        return expressionProblem({
          prompt: t(
            `The graph of ${p.name.en} is transformed as follows. ${opsText(ops).en} Write the equation of the new graph.`,
            `把 ${p.name["zh-CN"]} 的图象按以下方式变换：${opsText(ops)["zh-CN"]}写出所得图象的解析式。`,
          ),
          answer,
          prefix: "y =",
          wrong: [
            parentLatex(p, g.a, g.h.neg(), g.k),
            parentLatex(p, g.a, g.h, g.k.neg()),
            parentLatex(p, naive.a, g.h, naive.k),
            parentLatex(p, g.a, g.h, naive.k.eq(g.k) ? g.k.mul(g.a) : naive.k),
          ],
          solution: t(
            `${buildSteps("en")}**Check.** The point $(1, 1)$ is on ${p.name.en}. The operations move it to $${pt(end[0], end[1])}$, and at $x = ${num(end[0])}$ the input of the basic function is $${argAt(g, end[0])}$, so $y = ${outAt(g, Q.one)} = ${num(end[1])}$.`,
            `${buildSteps("zh-CN")}**检验。** 点 $(1, 1)$ 在 ${p.name["zh-CN"]} 上。这些变换把它移到 $${pt(end[0], end[1])}$，而在 $x = ${num(end[0])}$ 处基本函数的输入是 $${argAt(g, end[0])}$，所以 $y = ${outAt(g, Q.one)} = ${num(end[1])}$。`,
          ),
        });
      },
    },
    {
      id: "transforming-a-given-function",
      title: t("Transforming a given function", "变换给定的函数"),
      explanation: t(
        `To transform a function given by a formula, write the transformation in function notation first, then substitute: $f(x - h)$ means the formula of $f$ with every $x$ replaced by $x - h$, and $a f(\\ldots)$ multiplies all of it. Let $f(x) = x^2 - 2x$. Stretching vertically by $2$, then shifting right $1$ and down $3$ gives

$$g(x) = 2f(x - 1) - 3 = 2\\left((x - 1)^2 - 2(x - 1)\\right) - 3 = 2x^2 - 8x + 3.$$

> **Watch out.** Shifting right $h$ puts $x - h$ into $f$, not $x + h$, and a shift down subtracts. Multiply the **whole** substituted formula by $a$, every term of it, and use $a$ itself, not $\\frac{1}{a}$.`,
        `要变换由解析式给出的函数，先用函数记号写出变换，再代入：$f(x - h)$ 表示把 $f$ 的解析式中每个 $x$ 都换成 $x - h$，$a f(\\ldots)$ 则把它整个乘以 $a$。设 $f(x) = x^2 - 2x$。竖直伸长为原来的 $2$ 倍，再向右平移 $1$、向下平移 $3$ 得到

$$g(x) = 2f(x - 1) - 3 = 2\\left((x - 1)^2 - 2(x - 1)\\right) - 3 = 2x^2 - 8x + 3$$

> **注意。** 向右平移 $h$ 是把 $x - h$ 代入 $f$，不是 $x + h$；向下平移是减去。$a$ 要乘**整个**代入后的式子的每一项，而且乘的是 $a$ 本身，不是 $\\frac{1}{a}$。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const ops = [vertical(rng.pick([Q.of(2), Q.of(3), Q.of(1, 2)])), right(rng.nonZero(-4, 4)), up(rng.nonZero(-6, 6))];
        const g = compose(ops);
        const answer = tfPoly(f, g);
        const chainOps = ["f(x)", ...ops.map((_, i) => tfLatex(compose(ops.slice(0, i + 1))))].join(" \\to ");
        const atH = g.a.mul(f[0]!).add(g.k);
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is obtained from the graph of $f$ as follows. ${opsText(ops).en} Find $g(x)$.`,
            `设 ${fIs(f)}。$f$ 的图象按以下方式变换得到 $g$ 的图象：${opsText(ops)["zh-CN"]}求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [
            tfPoly(f, { ...g, h: g.h.neg() }),
            tfPoly(f, { ...g, k: g.k.neg() }),
            tfPoly(f, { ...g, a: Q.one.div(g.a) }),
            tfPoly(f, { ...g, a: Q.one }),
          ],
          solution: t(
            `${label(1, "Write it in function notation", "用函数记号表示").en} Apply the operations to $f(x)$ in order: $${chainOps}$. So $g(x) = ${tfLatex(g)}$.

${label(2, "Substitute", "代入").en} Replace every $x$ in $f$ with $${shifted(g.h)}$ and multiply the whole of it by $${g.a.toLatex()}$:${steps(`g(x) = ${front(g.a)}\\left(${substituted(f, shifted(g.h))}\\right)${plus(g.k)}`)}${label(3, "Simplify", "化简").en} Expand the squares and collect the terms:${steps(`g(x) = ${answer}`)}**Check.** At $x = ${g.h.toLatex()}$ the input of $f$ is $0$ and $f(0) = ${num(f[0]!)}$, so $g(${g.h.toLatex()}) = ${outAt(g, f[0]!)} = ${num(atH)}$. The simplified form gives $${num(pAt(transformPoly(f, g), g.h))}$ there too.`,
            `${label(1, "Write it in function notation", "用函数记号表示")["zh-CN"]} 对 $f(x)$ 按顺序进行变换：$${chainOps}$。所以 $g(x) = ${tfLatex(g)}$。

${label(2, "Substitute", "代入")["zh-CN"]} 把 $f$ 中的每个 $x$ 换成 $${shifted(g.h)}$，再把整个式子乘以 $${g.a.toLatex()}$：${steps(`g(x) = ${front(g.a)}\\left(${substituted(f, shifted(g.h))}\\right)${plus(g.k)}`)}${label(3, "Simplify", "化简")["zh-CN"]} 展开平方并合并同类项：${steps(`g(x) = ${answer}`)}**检验。** 在 $x = ${g.h.toLatex()}$ 处 $f$ 的输入是 $0$，$f(0) = ${num(f[0]!)}$，所以 $g(${g.h.toLatex()}) = ${outAt(g, f[0]!)} = ${num(atH)}$。化简后的式子在这里的值也是 $${num(pAt(transformPoly(f, g), g.h))}$。`,
          ),
        });
      },
    },
    {
      id: "equations-of-transformed-graphs",
      figure: algebraDrawings2["constructing-functions-using-transformations#equations-of-transformed-graphs"],
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        `A transformed basic graph $y = a\\,P(x - h) + k$ has its key point, the vertex or starting point, at $(h, k)$, because $P(0) = 0$ puts the key point of $P$ at the origin and the shifts move it to $(h, k)$. To find $a$, go one unit right of it: a basic graph that rises $1$ there rises $a$ after the stretch, and falls if $a$ is negative.

If a transformation of $y = \\sqrt{x}$ starts at $(-2, 1)$ and passes through $(-1, 3)$, then $a = 3 - 1 = 2$ and $y = 2\\sqrt{x + 2} + 1$.

> **Watch out.** A key point at $(h, k)$ gives $x - h$: a key point to the left of the $y$-axis gives $x + \\ldots$. Keep $h$ inside and $k$ outside, not the other way round, and make $a$ negative when the graph goes down from its key point.`,
        `变换后的基本函数图象 $y = a\\,P(x - h) + k$ 的关键点（顶点或起点）在 $(h, k)$，因为 $P(0) = 0$ 使 $P$ 的关键点在原点，平移把它移到 $(h, k)$。求 $a$ 时，从关键点向右走一个单位：原来上升 $1$ 的地方，伸缩后上升 $a$；$a$ 为负时则下降。

如果 $y = \\sqrt{x}$ 的某个变换图象从 $(-2, 1)$ 出发并经过 $(-1, 3)$，则 $a = 3 - 1 = 2$，$y = 2\\sqrt{x + 2} + 1$。

> **注意。** 关键点在 $(h, k)$ 对应 $x - h$：关键点在 $y$ 轴左边时写成 $x + \\ldots$。$h$ 在括号里，$k$ 在外面，不要弄反；图象从关键点往下走时，$a$ 是负数。`,
      ),
      generate(rng) {
        const p = rng.pick(parents.slice(0, 3));
        const a = Q.of(rng.pick([1, 1, -1, 2, -2]));
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const an = a.toNumber();
        const marks: PlaneMark[] = [
          { kind: "curve", f: (x) => an * p.f(x - h) + k, from: p === parents[2] ? h : -8, accent: true },
          { kind: "point", at: [h, k], accent: true },
          { kind: "point", at: [h + 1, k + an], accent: true },
        ];
        const answer = parentLatex(p, a, Q.of(h), Q.of(k));
        const d = p === parents[2] ? 4 : -1;
        const pd = Q.of(p.f(d));
        const yd = a.mul(pd).add(Q.of(k));
        return annotate(
          {
            ...expressionProblem({
              prompt: t(
                `The graph shown is a transformation of the graph of ${p.name.en}. Write its equation.`,
                `图中是 ${p.name["zh-CN"]} 的图象经过变换得到的图象。写出它的解析式。`,
              ),
              answer,
              prefix: "y =",
              wrong: [
                parentLatex(p, a.neg(), Q.of(h), Q.of(k)),
                parentLatex(p, a, Q.of(-h), Q.of(k)),
                parentLatex(p, a, Q.of(h), Q.of(-k)),
                parentLatex(p, a, Q.of(k), Q.of(h)),
              ],
              solution: t(
                `${label(1, "Find the key point", "找关键点").en} The ${p === parents[2] ? "starting point" : "vertex"} of the graph is $${pt(h, k)}$. The key point of the basic graph is $(0, 0)$, so it moved to $x = ${h}$ and $y = ${k}$: $h = ${h}$ and $k = ${k}$.

${label(2, "Find the stretch", "求伸缩系数").en} One unit to the right the graph is at $${pt(h + 1, k + an)}$, a change of $${num(Q.of(k + an))} - ${paren(k)} = ${an}$. The basic graph rises $1$ there, so $a = ${an}$:${steps(`y = ${answer}`)}**Check.** At $x = ${h + d}$ the input of the basic function is $${argAt(tf({ h }), Q.of(h + d))}$, which gives $${num(pd)}$. So $y = ${outAt(tf({ a, k }), pd)} = ${num(yd)}$: the formula puts $${pt(h + d, yd)}$ on the graph, as the picture shows.`,
                `${label(1, "Find the key point", "找关键点")["zh-CN"]} 图象的${p === parents[2] ? "起点" : "顶点"}是 $${pt(h, k)}$。基本函数图象的关键点是 $(0, 0)$，它移到了 $x = ${h}$、$y = ${k}$：$h = ${h}$，$k = ${k}$。

${label(2, "Find the stretch", "求伸缩系数")["zh-CN"]} 向右一个单位处图象在 $${pt(h + 1, k + an)}$，变化了 $${num(Q.of(k + an))} - ${paren(k)} = ${an}$。基本函数在那里上升 $1$，所以 $a = ${an}$：${steps(`y = ${answer}`)}**检验。** 在 $x = ${h + d}$ 处基本函数的输入是 $${argAt(tf({ h }), Q.of(h + d))}$，函数值为 $${num(pd)}$。所以 $y = ${outAt(tf({ a, k }), pd)} = ${num(yd)}$：解析式给出图象上的点 $${pt(h + d, yd)}$，与图相符。`,
              ),
            }),
            figure: {
              svg: plane(view, marks),
              alt: t(
                `A transformation of the graph of ${p.name.en}, with its key point at ${pt(h, k)} and passing through ${pt(h + 1, k + an)}.`,
                `${p.name["zh-CN"]} 的图象经过变换得到的图象，关键点为 ${pt(h, k)}，并经过 ${pt(h + 1, k + an)}。`,
              ),
            },
          },
          view,
          [{ kind: "curve", f: p.f, from: p === parents[2] ? 0 : -8, dashed: true }, ...shift([0, 0], [h, k])],
          `The parent graph moves so that its key point goes to ${at([h, k])}.`,
          `母函数图象平移，使关键点移到 ${at([h, k])}。`,
        );
      },
    },
  ],
};

// 3.10.8 Vertical reflections.

/** verticalReflectionsOfFunctions reflects graphs in the x-axis with y = −f(x). */
export const verticalReflectionsOfFunctions: TopicDef = {
  id: "vertical-reflections-of-functions",
  title: t("Vertical Reflections of Functions", "函数图象关于 x 轴的翻折"),
  summary: t(
    "Reflect the graph of any function in the x-axis: y = −f(x) changes the sign of every y-coordinate.",
    "把任意函数的图象关于 x 轴翻折：y = −f(x) 改变每个纵坐标的符号。",
  ),
  prerequisites: ["vertical-translations-of-functions", "vertical-reflections-of-absolute-value-graphs"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We have reflected the V of $y = |x|$ in the $x$-axis to get $y = -|x|$, and we know that adding $k$ outside the function moves every height. Putting a minus sign outside does the same kind of thing for any function: it replaces every height by its opposite.

Take $f(x) = x^{2} - 4$ and $g(x) = -f(x) = -x^{2} + 4$:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 0 & -3 & -4 & -3 & 0 \\\\ g(x) & 0 & 3 & 4 & 3 & 0 \\end{array}$$

Each point $(x, y)$ moves to $(x, -y)$: the point $(0, -4)$ goes to $(0, 4)$, and the roots $(\\pm 2, 0)$ stay where they are. The graph flips over the $x$-axis like a page. Check: $g(1) = -(1^{2} - 4) = 3$.

In this lesson we reflect points, write the reflected function, and read its values from a graph.`,
    `我们把 $y = |x|$ 的 V 形关于 $x$ 轴翻折得到 $y = -|x|$，也知道在函数外面加上 $k$ 会改变每个高度。在任何函数外面加一个负号也是类似的：把每个高度换成它的相反数。

取 $f(x) = x^{2} - 4$，$g(x) = -f(x) = -x^{2} + 4$：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline f(x) & 0 & -3 & -4 & -3 & 0 \\\\ g(x) & 0 & 3 & 4 & 3 & 0 \\end{array}$$

每个点 $(x, y)$ 都移到 $(x, -y)$：点 $(0, -4)$ 移到 $(0, 4)$，零点 $(\\pm 2, 0)$ 不动。图象像翻书页一样绕 $x$ 轴翻过去。检验：$g(1) = -(1^{2} - 4) = 3$。

这节课我们翻折点，写出翻折后的函数，并从图象读出它的值。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-vertical-reflection",
      figure: algebraDrawings2["vertical-reflections-of-functions#points-under-a-vertical-reflection"],
      title: t("Reflecting points", "翻折点"),
      explanation: t(
        `The graph of $y = -f(x)$ takes the opposite of every output of $f$ at the same input. So the point $(x, y)$ moves to $(x, -y)$: the graph is reflected in the $x$-axis. Points on the $x$-axis, the roots, stay where they are.

The point $(3, -5)$ on $f$ moves to $(3, 5)$ on $y = -f(x)$: same input $3$, opposite height.

> **Watch out.** Only the $y$-coordinate changes sign. Changing the sign of $x$ instead is the reflection in the $y$-axis, $f(-x)$; changing both is $-f(-x)$. Do not swap the coordinates.`,
        `$y = -f(x)$ 在同一个输入处取 $f$ 的输出的相反数。所以点 $(x, y)$ 移到 $(x, -y)$：图象关于 $x$ 轴翻折。$x$ 轴上的点（零点）不动。

$f$ 上的点 $(3, -5)$ 移到 $y = -f(x)$ 上的 $(3, 5)$：输入同样是 $3$，高度相反。

> **注意。** 只有纵坐标变号。改变横坐标的符号是关于 $y$ 轴的翻折 $f(-x)$；两个都变号是 $-f(-x)$。也不要把两个坐标对调。`,
      ),
      generate(rng) {
        const p: [Q, Q] = [Q.of(rng.nonZero(-9, 9)), Q.of(rng.nonZero(-9, 9))];
        const g = tf({ a: -1 });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ b: -1 }), tf({ a: -1, b: -1 })],
          t(
            `${label(1, "Keep the input", "输入不变").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. The graph of $-f(x)$ uses the same input, so the $x$-coordinate stays $${num(x)}$.

${label(2, "Change the sign of the output", "输出变号").en} The output is the opposite of $f(${num(p[0])})$:${steps(`-(${num(p[1])}) = ${num(y)}`)}The point is $${pt(x, y)}$.

**Check.** The midpoint of $${pt(p[0], p[1])}$ and $${pt(x, y)}$ is $\\left(${num(x)}, \\frac{${num(p[1])} + ${paren(y)}}{2}\\right) = (${num(x)}, 0)$, on the $x$-axis, so the two points are mirror images in it.`,
            `${label(1, "Keep the input", "输入不变")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。$-f(x)$ 的图象用同一个输入，所以横坐标仍是 $${num(x)}$。

${label(2, "Change the sign of the output", "输出变号")["zh-CN"]} 输出是 $f(${num(p[0])})$ 的相反数：${steps(`-(${num(p[1])}) = ${num(y)}`)}所求的点是 $${pt(x, y)}$。

**检验。** $${pt(p[0], p[1])}$ 与 $${pt(x, y)}$ 的中点是 $\\left(${num(x)}, \\frac{${num(p[1])} + ${paren(y)}}{2}\\right) = (${num(x)}, 0)$，在 $x$ 轴上，所以两点关于 $x$ 轴对称。`,
          ),
        );
      },
    },
    {
      id: "equations-of-vertical-reflections",
      figure: algebraDrawings2["vertical-reflections-of-functions#equations-of-vertical-reflections"],
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        `To reflect the graph of $f$ in the $x$-axis, take the opposite of the **whole** function: $-f(x)$ is $-1$ times all of $f(x)$, so every term changes sign. For $f(x) = x^2 - 3x + 2$,

$$-f(x) = -(x^2 - 3x + 2) = -x^2 + 3x - 2.$$

> **Watch out.** Change the sign of **every** term, not just the first one. Do not replace $x$ with $-x$: that gives $f(-x)$, the reflection in the $y$-axis.`,
        `要把 $f$ 的图象关于 $x$ 轴翻折，就取**整个**函数的相反数：$-f(x)$ 是 $-1$ 乘整个 $f(x)$，所以每一项都变号。对于 $f(x) = x^2 - 3x + 2$，

$$-f(x) = -(x^2 - 3x + 2) = -x^2 + 3x - 2$$

> **注意。** **每一项**都要变号，而不只是第一项。不要把 $x$ 换成 $-x$：那得到的是 $f(-x)$，即关于 $y$ 轴的翻折。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const answer = tfPoly(f, tf({ a: -1 }));
        const leadOnly = f.map((c, i) => (i === f.length - 1 ? c.neg() : c));
        const c = [1, 2, 3, -1].find((v) => !pAt(f, Q.of(v)).isZero()) ?? 1;
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the reflection of the graph of $f$ in the $x$-axis. Find $g(x)$.`,
            `设 ${fIs(f)}。$g$ 的图象是 $f$ 的图象关于 $x$ 轴翻折得到的。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [pLatex(leadOnly), tfPoly(f, tf({ b: -1 })), tfPoly(f, tf({ a: -1, b: -1 }))],
          solution: t(
            `${label(1, "Take the opposite of the whole function", "取整个函数的相反数").en} Reflecting in the $x$-axis changes the sign of every output:${steps(`g(x) = -f(x) = -(${pLatex(f)})`)}${label(2, "Change every sign", "每一项变号").en} The minus sign multiplies each term by $-1$:${steps(`g(x) = ${answer}`)}**Check.** $f(${c}) = ${num(pAt(f, Q.of(c)))}$, and the answer gives $g(${c}) = ${num(pAt(transformPoly(f, tf({ a: -1 })), Q.of(c)))}$, the opposite.`,
            `${label(1, "Take the opposite of the whole function", "取整个函数的相反数")["zh-CN"]} 关于 $x$ 轴翻折会改变每个输出的符号：${steps(`g(x) = -f(x) = -(${pLatex(f)})`)}${label(2, "Change every sign", "每一项变号")["zh-CN"]} 负号把每一项都乘以 $-1$：${steps(`g(x) = ${answer}`)}**检验。** $f(${c}) = ${num(pAt(f, Q.of(c)))}$，而答案给出 $g(${c}) = ${num(pAt(transformPoly(f, tf({ a: -1 })), Q.of(c)))}$，正是它的相反数。`,
          ),
        });
      },
    },
    {
      id: "vertical-reflections-from-graphs",
      figure: algebraDrawings3["vertical-reflections-of-functions#vertical-reflections-from-graphs"],
      title: t("Values of the reflected function", "翻折后函数的值"),
      explanation: t(
        `To find a value of $g(x) = -f(x)$ from the graph of $f$, read $f$ at the **same** input and change the sign: $g$ is defined by that one value of $f$. If the graph of $f$ passes through $(2, -3)$, then $g(2) = -(-3) = 3$.

> **Watch out.** Do not stop at $f(x)$: the answer is its opposite. Read the graph at $x$ itself, not at $-x$.`,
        `要从 $f$ 的图象求 $g(x) = -f(x)$ 的值，就在**同一个**输入处读出 $f$ 的值再变号：$g$ 就是由 $f$ 的这一个值确定的。若 $f$ 的图象经过 $(2, -3)$，则 $g(2) = -(-3) = 3$。

> **注意。** 不要停在 $f(x)$：答案是它的相反数。要在 $x$ 本身处读图，而不是在 $-x$ 处。`,
      ),
      generate(rng) {
        const f = randomGraph(rng, -6, 6, -6, 6);
        const vs = f.filter(([, y]) => y !== 0);
        const [x, y] = vs.length ? rng.pick(vs) : f[0]!;
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `The graph of $f$ is shown. Let $g(x) = -f(x)$. Find $g(${x})$.`,
                `下图是 $f$ 的图象。设 $g(x) = -f(x)$。求 $g(${x})$。`,
              ),
              answer: -y,
              wrong: [y, ...(valueOn(f, -x) ? [valueOn(f, -x)!, valueOn(f, -x)!.neg()] : [])],
              solution: t(
                `${label(1, "Read the graph", "读图").en} The graph of $f$ passes through $${pt(x, y)}$, so $f(${x}) = ${y}$.

${label(2, "Change the sign", "变号").en} $g$ takes the opposite of $f$ at the same input:${steps(`g(${x}) = -f(${x}) = -(${y}) = ${-y}`)}**Check.** The points $${pt(x, y)}$ and $${pt(x, -y)}$ are both $${Math.abs(y)}$ from the $x$-axis, on opposite sides of it, as a reflection in the $x$-axis requires.`,
                `${label(1, "Read the graph", "读图")["zh-CN"]} $f$ 的图象经过 $${pt(x, y)}$，所以 $f(${x}) = ${y}$。

${label(2, "Change the sign", "变号")["zh-CN"]} $g$ 在同一个输入处取 $f$ 的相反数：${steps(`g(${x}) = -f(${x}) = -(${y}) = ${-y}`)}**检验。** 点 $${pt(x, y)}$ 和 $${pt(x, -y)}$ 到 $x$ 轴的距离都是 $${Math.abs(y)}$，分别在 $x$ 轴两侧，符合关于 $x$ 轴的翻折。`,
              ),
            }),
            figure: graphFigure(f),
          },
          view,
          shift([x, y], [x, -y]),
          `The point ${at([x, y])} of f reflects to ${at([x, -y])}.`,
          `f 上的点 ${at([x, y])} 反射到 ${at([x, -y])}。`,
        );
      },
    },
  ],
};

// 3.10.9 Horizontal reflections.

/** horizontalReflectionsOfFunctions reflects graphs in the y-axis with y = f(−x). */
export const horizontalReflectionsOfFunctions: TopicDef = {
  id: "horizontal-reflections-of-functions",
  title: t("Horizontal Reflections of Functions", "函数图象关于 y 轴的翻折"),
  summary: t(
    "Reflect the graph of any function in the y-axis: y = f(−x) changes the sign of every x-coordinate.",
    "把任意函数的图象关于 y 轴翻折：y = f(−x) 改变每个横坐标的符号。",
  ),
  prerequisites: ["horizontal-translations-of-functions", "vertical-reflections-of-functions"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We have reflected graphs in the $x$-axis by changing the sign of the output. Changing the sign of the **input** instead reflects in the $y$-axis, and like every change inside $f$, it acts on $x$.

Take $f(x) = \\sqrt{x}$ and $g(x) = f(-x) = \\sqrt{-x}$:

$$\\begin{array}{c|cccc} \\text{point of } f & (0, 0) & (1, 1) & (4, 2) & (9, 3) \\\\ \\hline \\text{point of } g & (0, 0) & (-1, 1) & (-4, 2) & (-9, 3) \\end{array}$$

$g$ reaches $f(4) = 2$ at $x = -4$, because $-(-4) = 4$. Every point $(x, y)$ moves to $(-x, y)$: the graph, which ran to the right of the origin, now runs to the left, and the domain $x \\ge 0$ becomes $x \\le 0$. Check: $g(-9) = \\sqrt{9} = 3$.

In this lesson we reflect points, write $f(-x)$ for polynomials, and tell the two reflections apart.`,
    `我们已经通过改变输出的符号把图象关于 $x$ 轴翻折。如果改变的是**输入**的符号，图象就关于 $y$ 轴翻折；和括号里的其他变化一样，它作用在 $x$ 上。

取 $f(x) = \\sqrt{x}$，$g(x) = f(-x) = \\sqrt{-x}$：

$$\\begin{array}{c|cccc} f \\text{ 上的点} & (0, 0) & (1, 1) & (4, 2) & (9, 3) \\\\ \\hline g \\text{ 上的点} & (0, 0) & (-1, 1) & (-4, 2) & (-9, 3) \\end{array}$$

$g$ 在 $x = -4$ 处取到 $f(4) = 2$，因为 $-(-4) = 4$。每个点 $(x, y)$ 都移到 $(-x, y)$：原来在原点右边的图象现在在左边，定义域 $x \\ge 0$ 变成 $x \\le 0$。检验：$g(-9) = \\sqrt{9} = 3$。

这节课我们翻折点，写出多项式的 $f(-x)$，并区分两种翻折。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-reflection",
      figure: algebraDrawings2["horizontal-reflections-of-functions#points-under-a-horizontal-reflection"],
      title: t("Reflecting points", "翻折点"),
      explanation: t(
        `The graph of $y = f(-x)$ reaches the output $f(p)$ where its input $-x$ equals $p$, that is at $x = -p$. So the point $(x, y)$ moves to $(-x, y)$: the graph is reflected in the $y$-axis. The $y$-intercept stays where it is.

The point $(4, 1)$ on $f$ moves to $(-4, 1)$ on $y = f(-x)$: check $f(-(-4)) = f(4) = 1$.

> **Watch out.** Only the $x$-coordinate changes sign. Changing the sign of $y$ is the reflection in the $x$-axis, $-f(x)$; changing both is $-f(-x)$. Do not swap the coordinates.`,
        `$y = f(-x)$ 在输入 $-x$ 等于 $p$ 的地方，即 $x = -p$ 处，取到输出 $f(p)$。所以点 $(x, y)$ 移到 $(-x, y)$：图象关于 $y$ 轴翻折。$y$ 轴截距不动。

$f$ 上的点 $(4, 1)$ 移到 $y = f(-x)$ 上的 $(-4, 1)$：检验 $f(-(-4)) = f(4) = 1$。

> **注意。** 只有横坐标变号。改变纵坐标的符号是关于 $x$ 轴的翻折 $-f(x)$；两个都变号是 $-f(-x)$。也不要把两个坐标对调。`,
      ),
      generate(rng) {
        const p: [Q, Q] = [Q.of(rng.nonZero(-9, 9)), Q.of(rng.nonZero(-9, 9))];
        const g = tf({ b: -1 });
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [tf({ a: -1 }), tf({ a: -1, b: -1 })],
          t(
            `${label(1, "Find the new input", "求新的输入").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. The graph of $f(-x)$ reaches this output where $-x = ${num(p[0])}$:${steps(`x = -(${num(p[0])}) = ${num(x)}`)}${label(2, "Keep the height", "高度不变").en} The output is still $${num(y)}$. The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input is $-(${num(x)}) = ${num(p[0])}$, so $g(${num(x)}) = f(${num(p[0])}) = ${num(p[1])}$. The two points $${pt(p[0], p[1])}$ and $${pt(x, y)}$ are the same distance $${num(p[0].abs())}$ from the $y$-axis, on opposite sides.`,
            `${label(1, "Find the new input", "求新的输入")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。$f(-x)$ 的图象在 $-x = ${num(p[0])}$ 处取到这个输出：${steps(`x = -(${num(p[0])}) = ${num(x)}`)}${label(2, "Keep the height", "高度不变")["zh-CN"]} 输出仍是 $${num(y)}$。所求的点是 $${pt(x, y)}$。

**检验。** 在 $x = ${num(x)}$ 处输入是 $-(${num(x)}) = ${num(p[0])}$，所以 $g(${num(x)}) = f(${num(p[0])}) = ${num(p[1])}$。点 $${pt(p[0], p[1])}$ 和 $${pt(x, y)}$ 到 $y$ 轴的距离都是 $${num(p[0].abs())}$，分别在 $y$ 轴两侧。`,
          ),
        );
      },
    },
    {
      id: "equations-of-horizontal-reflections",
      figure: algebraDrawings2["horizontal-reflections-of-functions#equations-of-horizontal-reflections"],
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        `To reflect the graph of $f$ in the $y$-axis, replace every $x$ with $-x$. Since $(-x)^{n} = (-1)^{n}x^{n}$, even powers of $-x$ equal those of $x$, while odd powers change sign. For $f(x) = 2x^2 + 5x - 1$,

$$f(-x) = 2(-x)^2 + 5(-x) - 1 = 2x^2 - 5x - 1.$$

> **Watch out.** Only the odd powers change sign; the even powers and the constant stay. Changing the sign of every term gives $-f(x)$, the reflection in the $x$-axis, and changing the sign of only the leading term is neither reflection.`,
        `要把 $f$ 的图象关于 $y$ 轴翻折，就把每个 $x$ 换成 $-x$。因为 $(-x)^{n} = (-1)^{n}x^{n}$，$-x$ 的偶次幂等于 $x$ 的偶次幂，奇次幂则变号。对于 $f(x) = 2x^2 + 5x - 1$，

$$f(-x) = 2(-x)^2 + 5(-x) - 1 = 2x^2 - 5x - 1$$

> **注意。** 只有奇次幂变号，偶次幂和常数项不变。每一项都变号得到的是 $-f(x)$，即关于 $x$ 轴的翻折；只改变首项的符号则哪种翻折都不是。`,
      ),
      generate(rng) {
        const cubic = rng.bool(0.4);
        const f: QPoly = cubic
          ? [rng.nonZero(-9, 9), rng.nonZero(-6, 6), rng.int(-4, 4), rng.pick([1, -1, 2, -2])].map((n) => Q.of(n))
          : randomQuadratic(rng);
        const answer = tfPoly(f, tf({ b: -1 }));
        const negSub = f
          .map((c, i) => [c, i] as const)
          .reverse()
          .filter(([c]) => !c.isZero())
          .map(([c, i], j) => {
            const power = i === 0 ? "" : i === 1 ? "(-x)" : `(-x)^{${i}}`;
            const size = i === 0 ? num(c.abs()) : front(c.abs());
            return j === 0 ? (i === 0 ? num(c) : `${front(c)}${power}`) : ` ${c.sign() < 0 ? "-" : "+"} ${size}${power}`;
          })
          .join("");
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the reflection of the graph of $f$ in the $y$-axis. Find $g(x)$.`,
            `设 ${fIs(f)}。$g$ 的图象是 $f$ 的图象关于 $y$ 轴翻折得到的。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ a: -1 })), tfPoly(f, tf({ a: -1, b: -1 })), pLatex(f.map((c, i) => (i === f.length - 1 ? c.neg() : c)))],
          solution: t(
            `${label(1, "Replace $x$ with $-x$", "把 $x$ 换成 $-x$").en} Every $x$ in the formula of $f$ becomes $-x$:${steps(`g(x) = f(-x) = ${negSub}`)}${label(2, "Simplify the powers", "化简乘方").en} $(-x)^{n} = x^{n}$ for even $n$ and $-x^{n}$ for odd $n$, so the odd powers of $x$ change sign:${steps(`g(x) = ${answer}`)}**Check.** $f(-1) = ${num(pAt(f, Q.of(-1)))}$, and the answer gives $g(1) = ${num(pAt(transformPoly(f, tf({ b: -1 })), Q.one))}$, the same value, as $g(1) = f(-1)$ requires.`,
            `${label(1, "Replace $x$ with $-x$", "把 $x$ 换成 $-x$")["zh-CN"]} 把 $f$ 的解析式中每个 $x$ 都换成 $-x$：${steps(`g(x) = f(-x) = ${negSub}`)}${label(2, "Simplify the powers", "化简乘方")["zh-CN"]} 当 $n$ 为偶数时 $(-x)^{n} = x^{n}$，为奇数时 $(-x)^{n} = -x^{n}$，所以 $x$ 的奇次幂变号：${steps(`g(x) = ${answer}`)}**检验。** $f(-1) = ${num(pAt(f, Q.of(-1)))}$，而答案给出 $g(1) = ${num(pAt(transformPoly(f, tf({ b: -1 })), Q.one))}$，两者相等，符合 $g(1) = f(-1)$。`,
          ),
        });
      },
    },
    {
      id: "recognizing-reflections",
      figure: algebraDrawings2["horizontal-reflections-of-functions#recognizing-reflections"],
      title: t("Recognizing reflections", "识别翻折"),
      explanation: t(
        `Compare matching points. In a reflection in the $x$-axis, $y = -f(x)$, each point keeps its $x$-coordinate and the graph flips upside down. In a reflection in the $y$-axis, $y = f(-x)$, each point keeps its $y$-coordinate and the graph flips left to right. Doing both, $y = -f(-x)$, sends $(x, y)$ to $(-x, -y)$.

If the corner $(2, 3)$ of $f$ shows up at $(-2, 3)$ on $g$, the height is kept and $x$ changed sign: $g(x) = f(-x)$.

> **Watch out.** Use a point off both axes: a point on an axis looks the same after one of the reflections. Look at which coordinate changed sign; a minus sign **outside** $f$ flips the heights, one **inside** flips the $x$-coordinates.`,
        `比较对应点。关于 $x$ 轴翻折 $y = -f(x)$：每个点横坐标不变，图象上下颠倒。关于 $y$ 轴翻折 $y = f(-x)$：每个点纵坐标不变，图象左右颠倒。两者都做 $y = -f(-x)$：把 $(x, y)$ 变成 $(-x, -y)$。

如果 $f$ 的拐点 $(2, 3)$ 出现在 $g$ 的 $(-2, 3)$，高度不变而 $x$ 变号：$g(x) = f(-x)$。

> **注意。** 要用不在坐标轴上的点：坐标轴上的点在某一种翻折下看起来不变。看哪个坐标变了号；$f$ **外面**的负号翻转高度，**括号里**的负号翻转横坐标。`,
      ),
      generate(rng) {
        const all = [tf({ a: -1 }), tf({ b: -1 }), tf({ a: -1, b: -1 })];
        for (;;) {
          const f = randomGraph(rng, -6, 6, -6, 6);
          const keys = new Set([tf({}), ...all].map((g) => imageKey(g, f)));
          if (keys.size < 4) continue;
          const g = rng.pick(all);
          const image = mapGraph(g, f)!;
          const [x, y] = f[0]!;
          const off = f.filter((q) => q[0] !== 0 && q[1] !== 0);
          const [x1, y1] = off[0] ?? f[0]!;
          const [x2, y2] = off[1] ?? f[f.length - 1]!;
          const [u1, v1] = mapPoint(g, [Q.of(x1), Q.of(y1)]);
          const [u2, v2] = mapPoint(g, [Q.of(x2), Q.of(y2)]);
          const opt = (w: Tf) => `$g(x) = ${tfLatex(w)}$`;
          const reasons: Reason[] = [
            [
              opt(tf({ a: -1 })),
              "This is the reflection in the $x$-axis: it would keep each $x$-coordinate and change the sign of $y$.",
              "这是关于 $x$ 轴的翻折：它会保持横坐标不变，改变纵坐标的符号。",
            ],
            [
              opt(tf({ b: -1 })),
              "This is the reflection in the $y$-axis: it would keep each $y$-coordinate and change the sign of $x$.",
              "这是关于 $y$ 轴的翻折：它会保持纵坐标不变，改变横坐标的符号。",
            ],
            [
              opt(tf({ a: -1, b: -1 })),
              "This reflects in both axes: it would change the signs of both coordinates.",
              "这是关于两条坐标轴的翻折：它会改变两个坐标的符号。",
            ],
          ];
          return annotate(
            {
              ...reasoned(
                shuffled(
                  rng,
                  solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
                  [g, ...all.filter((w) => w !== g)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
                  t(
                    `${label(1, "Follow a point", "追踪一个点").en} Take the point $${pt(x1, y1)}$ of $f$, off both axes. On the dashed graph it shows up at $${pt(u1, v1)}$.

${label(2, "See which signs changed", "看哪个坐标变号").en} ${g.b.sign() < 0 && g.a.sign() < 0 ? "Both coordinates changed sign" : g.a.sign() < 0 ? "The $x$-coordinate stayed and the $y$-coordinate changed sign" : "The $y$-coordinate stayed and the $x$-coordinate changed sign"}. ${g.b.sign() < 0 && g.a.sign() < 0 ? "That is a reflection in both axes" : g.a.sign() < 0 ? "That is a reflection in the $x$-axis" : "That is a reflection in the $y$-axis"}:${steps(`g(x) = ${tfLatex(g)}`)}**Check.** The point $${pt(x2, y2)}$ of $f$ should go to $${pt(u2, v2)}$, and that is a vertex of the dashed graph too.`,
                    `${label(1, "Follow a point", "追踪一个点")["zh-CN"]} 取 $f$ 上不在坐标轴上的点 $${pt(x1, y1)}$。它在虚线上出现在 $${pt(u1, v1)}$。

${label(2, "See which signs changed", "看哪个坐标变号")["zh-CN"]} ${g.b.sign() < 0 && g.a.sign() < 0 ? "两个坐标都变了号" : g.a.sign() < 0 ? "横坐标不变，纵坐标变号" : "纵坐标不变，横坐标变号"}。${g.b.sign() < 0 && g.a.sign() < 0 ? "这是关于两条坐标轴的翻折" : g.a.sign() < 0 ? "这是关于 $x$ 轴的翻折" : "这是关于 $y$ 轴的翻折"}：${steps(`g(x) = ${tfLatex(g)}`)}**检验。** $f$ 上的点 $${pt(x2, y2)}$ 应移到 $${pt(u2, v2)}$，它也是虚线的一个顶点。`,
                  ),
                ),
                reasons,
              ),
              figure: graphFigure(f, image),
            },
            view,
            imageMarks(g, [x, y]),
            ...imageAlt(g, [x, y]),
          );
        }
      },
    },
  ],
};

// 3.10.10 Reflections with other transformations.

/** reflectOps draws a reflection combined with a shift and possibly a stretch, in some order. */
function reflectOps(rng: Rng): Op[] {
  const vert = rng.bool();
  const shift = vert ? up(rng.nonZero(-5, 5)) : right(rng.nonZero(-5, 5));
  const ops = [vert ? xAxis : yAxis, shift];
  if (rng.bool(0.4)) ops.push(vert ? vertical(rng.pick([Q.of(2), Q.of(3)])) : horizontal(rng.pick([Q.of(2), Q.of(1, 2)])));
  return rng.shuffle(ops);
}

/** combiningReflectionsWithOtherGraphTransformations combines reflections with shifts and stretches. */
export const combiningReflectionsWithOtherGraphTransformations: TopicDef = {
  id: "combining-reflections-with-other-graph-transformations",
  title: t("Combining Reflections With Other Graph Transformations", "翻折与其他图象变换的组合"),
  summary: t(
    "Combine reflections with shifts and stretches, including y = f(h − x), and attend to the order.",
    "把翻折与平移、伸缩组合起来（包括 y = f(h − x)），并注意顺序。",
  ),
  prerequisites: ["horizontal-reflections-of-functions", "combining-graph-transformations-three-or-more-operations"],
  encompasses: [
    { topic: "horizontal-reflections-of-functions", weight: 0.5 },
    { topic: "vertical-reflections-of-functions", weight: 0.5 },
    { topic: "combining-graph-transformations-three-or-more-operations", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `A reflection is one more operation that can be combined with shifts and stretches, and the rule we know still holds: each operation acts on the formula written so far, so a reflection also reflects a shift made before it.

Take $f(x) = \\sqrt{x}$. Reflect in the $y$-axis, then shift right $4$: replace $x$ with $-x$, then $x$ with $x - 4$, which gives $g(x) = f(-(x - 4)) = \\sqrt{4 - x}$. Each point $(x, y)$ moves to $(4 - x, y)$:

$$\\begin{array}{c|ccc} \\text{point of } f & (0, 0) & (1, 1) & (4, 2) \\\\ \\hline \\text{point of } g & (4, 0) & (3, 1) & (0, 2) \\end{array}$$

Check: $g(3) = \\sqrt{4 - 3} = 1$. In the other order, shifting right $4$ first and then reflecting, the result is $f(-x - 4) = \\sqrt{-x - 4}$, which starts at $(-4, 0)$ instead.

In this lesson we follow points through reflections and shifts, attend to the order, and recognize the transformations from graphs.`,
    `翻折是又一种可以与平移、伸缩组合的变换，而我们熟悉的规则仍然成立：每一步都作用在已经写出的式子上，所以翻折也会翻折在它之前做的平移。

取 $f(x) = \\sqrt{x}$。先关于 $y$ 轴翻折，再向右平移 $4$：先把 $x$ 换成 $-x$，再把 $x$ 换成 $x - 4$，得到 $g(x) = f(-(x - 4)) = \\sqrt{4 - x}$。每个点 $(x, y)$ 都移到 $(4 - x, y)$：

$$\\begin{array}{c|ccc} f \\text{ 上的点} & (0, 0) & (1, 1) & (4, 2) \\\\ \\hline g \\text{ 上的点} & (4, 0) & (3, 1) & (0, 2) \\end{array}$$

检验：$g(3) = \\sqrt{4 - 3} = 1$。换个顺序，先向右平移 $4$ 再翻折，结果是 $f(-x - 4) = \\sqrt{-x - 4}$，它的起点是 $(-4, 0)$。

这节课我们追踪点经过翻折和平移后的位置，注意变换的顺序，并从图象识别变换。`,
  ),
  knowledgePoints: [
    {
      id: "points-under-reflections-and-shifts",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        `A negative factor in front of $f$ changes the sign of $y$ before the vertical shift; a negative factor on $x$ changes the sign of $x$. To follow a point into $y = f(h - x)$, ask which $x$ gives the input $p$: $h - x = p$, so $x = h - p$.

The point $(1, 4)$ on $f$ moves to $(1, -4 + 2) = (1, -2)$ on $y = -f(x) + 2$, and to $(3 - 1, 4) = (2, 4)$ on $y = f(3 - x)$.

> **Watch out.** In $f(h - x)$ the new $x$ is $h - p$, not $p - h$ or $p + h$. Outside, change the sign of $y$ (and stretch) **before** adding the shift. Reflect only in the axis the formula says, and keep the $x$-coordinate first.`,
        `$f$ 前面的负号在竖直平移之前改变 $y$ 的符号；$x$ 前面的负号改变 $x$ 的符号。要追踪点到 $y = f(h - x)$ 上，问哪个 $x$ 使输入为 $p$：$h - x = p$，所以 $x = h - p$。

$f$ 上的点 $(1, 4)$ 移到 $y = -f(x) + 2$ 上的 $(1, -4 + 2) = (1, -2)$，移到 $y = f(3 - x)$ 上的 $(3 - 1, 4) = (2, 4)$。

> **注意。** 在 $f(h - x)$ 中新的 $x$ 是 $h - p$，不是 $p - h$ 或 $p + h$。外面要**先**改变 $y$ 的符号（和伸缩），再加上平移量。只按式子所说的坐标轴翻折；写点时横坐标在前。`,
      ),
      generate(rng) {
        const p = randomPoint(rng);
        const kind = rng.int(0, 2);
        const c = rng.nonZero(-6, 6);
        const a = rng.pick([Q.one, Q.of(2), Q.of(3)]);
        const g = kind === 0 ? tf({ a: a.neg(), k: c }) : kind === 1 ? tf({ b: -1, h: c }) : tf({ a: -1, b: -1, k: c });
        const written = kind === 1 ? `f(${linear(-1, c)})` : tfLatex(g);
        const [x, y] = mapPoint(g, p);
        const xStep = g.h.isZero()
          ? `x = -(${num(p[0])}) = ${num(x)}`
          : `${linear(-1, g.h)} = ${num(p[0])} \\quad\\Rightarrow\\quad x = ${num(g.h)} - ${paren(p[0])} = ${num(x)}`;
        const yMoves = !(g.a.eq(Q.one) && g.k.isZero());
        const sizeHow = g.a.eq(Q.of(-1))
          ? t("change its sign", "改变它的符号")
          : g.a.sign() < 0
            ? t(`multiply by $${g.a.toLatex()}$`, `乘以 $${g.a.toLatex()}$`)
            : t("keep it", "保持不变");
        const yHow = g.k.isZero()
          ? sizeHow
          : g.a.eq(Q.one)
            ? addText(g.k)
            : t(`${sizeHow.en} and then ${addText(g.k).en}`, `先${sizeHow["zh-CN"]}，再${addText(g.k)["zh-CN"]}`);
        return imageProblem(
          p,
          g,
          [
            { ...g, h: g.h.neg() },
            { ...g, k: g.k.neg() },
            { ...g, a: g.a.neg() },
            { ...g, b: g.b.neg() },
          ],
          t(
            `${label(1, "Move the $x$-coordinate", "移动横坐标").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. ${
              g.b.sign() < 0
                ? `The graph of $y = ${written}$ uses this value where the input of $f$ equals $${num(p[0])}$:${steps(xStep)}`
                : `Nothing changes inside $f$, so the $x$-coordinate stays $${num(x)}$.

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标").en} ${
              yMoves
                ? `The changes outside act on $y$: ${yHow.en}.${steps(`${outAt(g, p[1])} = ${num(y)}`)}`
                : `Nothing changes outside $f$, so the $y$-coordinate stays $${num(y)}$.

`
            }The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input of $f$ is $${argAt(g, x)}$, and $f(${num(p[0])}) = ${num(p[1])}$. So $y = ${outAt(g, p[1])} = ${num(y)}$.`,
            `${label(1, "Move the $x$-coordinate", "移动横坐标")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。${
              g.b.sign() < 0
                ? `$y = ${written}$ 的图象在 $f$ 的输入等于 $${num(p[0])}$ 处用到这个值：${steps(xStep)}`
                : `$f$ 的括号里没有变化，横坐标仍是 $${num(x)}$。

`
            }${label(2, "Move the $y$-coordinate", "移动纵坐标")["zh-CN"]} ${
              yMoves
                ? `外面的变化作用于 $y$：${yHow["zh-CN"]}。${steps(`${outAt(g, p[1])} = ${num(y)}`)}`
                : `$f$ 的外面没有变化，纵坐标仍是 $${num(y)}$。

`
            }所求的点是 $${pt(x, y)}$。

**检验。** 在 $x = ${num(x)}$ 处，$f$ 的输入是 $${argAt(g, x)}$，而 $f(${num(p[0])}) = ${num(p[1])}$。因此 $y = ${outAt(g, p[1])} = ${num(y)}$。`,
          ),
          written,
        );
      },
    },
    {
      id: "the-order-of-reflections-and-shifts",
      figure: algebraDrawings2["combining-reflections-with-other-graph-transformations#the-order-of-reflections-and-shifts"],
      title: t("The order of the operations", "变换的顺序"),
      explanation: t(
        `A reflection also reflects any shift made before it, because it acts on the whole formula written so far.

- Reflect in the $x$-axis, then shift up $3$: $y = -f(x) + 3$. Shift up $3$ first, then reflect: $y = -(f(x) + 3) = -f(x) - 3$.
- Reflect in the $y$-axis, then shift right $2$: replace $x$ with $-x$, then $x$ with $x - 2$: $y = f(-(x - 2)) = f(2 - x)$. Shift right $2$ first, then reflect: $y = f(-x - 2)$.

> **Watch out.** Apply the operations in the order given; the reverse order gives a different function. A reflection in the $x$-axis puts the minus sign in front of $f$, one in the $y$-axis puts it on $x$. Keep the direction of each shift.`,
        `翻折也会翻折在它之前所做的平移，因为它作用在已经写出的整个式子上。

- 先关于 $x$ 轴翻折，再向上平移 $3$：$y = -f(x) + 3$。先向上平移 $3$ 再翻折：$y = -(f(x) + 3) = -f(x) - 3$。
- 先关于 $y$ 轴翻折，再向右平移 $2$：先把 $x$ 换成 $-x$，再把 $x$ 换成 $x - 2$：$y = f(-(x - 2)) = f(2 - x)$。先向右平移 $2$ 再翻折：$y = f(-x - 2)$。

> **注意。** 按给出的顺序进行变换；顺序颠倒会得到另一个函数。关于 $x$ 轴翻折把负号放在 $f$ 前面，关于 $y$ 轴翻折把负号放在 $x$ 上。每次平移的方向不要弄反。`,
      ),
      generate(rng) {
        const ops = reflectOps(rng);
        const g = compose(ops);
        const rev = compose([...ops].reverse());
        const flipA = { ...g, a: g.a.neg() };
        const flipB = { ...g, b: g.b.neg() };
        const write = (w: Tf) => same(`$g(x) = ${linLatex(w.a, w.b, w.b.mul(w.h).neg(), w.k)}$`);
        const pair: [Q, Q] = [Q.of(2), Q.of(2)];
        const end = mapPoint(g, pair);
        const buildSteps = (loc: "en" | "zh-CN") =>
          ops
            .map((op, i) => {
              const s = compose(ops.slice(0, i + 1));
              const how = opHow(op);
              return `${label(i + 1, cap(opText(op).en), opText(op)["zh-CN"])[loc]} ${loc === "en" ? `${cap(how.en)}:` : `${how["zh-CN"]}：`}${steps(`y = ${linLatex(s.a, s.b, s.b.mul(s.h).neg(), s.k)}`)}`;
            })
            .join("");
        const reasons: Reason[] = [
          [
            write(rev).en,
            "This applies the operations in the reverse order. A reflection also reflects a shift made before it, so the order matters.",
            "这里把顺序颠倒了。翻折也会翻折在它之前做的平移，所以顺序有影响。",
          ],
          [write({ ...g, h: g.h.neg(), k: g.k.neg() }).en, "The shift goes the wrong way.", "平移方向反了。"],
          [
            write(flipA).en,
            "The sign in front of $f$ is wrong: only a reflection in the $x$-axis puts a minus sign there.",
            "$f$ 前面的符号错了：只有关于 $x$ 轴的翻折才在那里放负号。",
          ],
          [
            write(flipB).en,
            "The sign of $x$ is wrong: only a reflection in the $y$-axis changes the sign of $x$.",
            "$x$ 的符号错了：只有关于 $y$ 轴的翻折才改变 $x$ 的符号。",
          ],
          [
            write({ ...rev, h: rev.h.neg(), k: rev.k.neg() }).en,
            "This reverses the order and also the direction of the shift.",
            "这里既颠倒了顺序，又把平移方向弄反了。",
          ],
        ];
        return reasoned(
          shuffled(
            rng,
            t(
              `The graph of $g$ is obtained from the graph of $f$ as follows. ${opsText(ops).en} Which is $g(x)$?`,
              `$f$ 的图象按以下方式变换得到 $g$ 的图象：${opsText(ops)["zh-CN"]}$g(x)$ 是哪一个？`,
            ),
            [g, rev, { ...g, h: g.h.neg(), k: g.k.neg() }, flipA, flipB, { ...rev, h: rev.h.neg(), k: rev.k.neg() }].map(write),
            t(
              `${buildSteps("en")}**Check.** Follow the point $(2, 2)$ of $f$: $${[pair, ...trail(ops, pair)].map(([px, py]) => pt(px, py)).join(" \\to ")}$. At $x = ${num(end[0])}$ the input of $f$ is $${argAt(g, end[0])}$, so $y = ${outAt(g, Q.of(2))} = ${num(end[1])}$, as it should be.`,
              `${buildSteps("zh-CN")}**检验。** 追踪 $f$ 上的点 $(2, 2)$：$${[pair, ...trail(ops, pair)].map(([px, py]) => pt(px, py)).join(" \\to ")}$。在 $x = ${num(end[0])}$ 处 $f$ 的输入是 $${argAt(g, end[0])}$，所以 $y = ${outAt(g, Q.of(2))} = ${num(end[1])}$，与之相符。`,
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "reflections-and-shifts-from-graphs",
      figure: algebraDrawings3["combining-reflections-with-other-graph-transformations#reflections-and-shifts-from-graphs"],
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        `First decide which reflection happened: if the graph is upside down, $f$ has a negative factor in front; if it is reversed left to right, $x$ has a negative factor. A reflection changes the shape's orientation, and a shift only its position, so the two can be read separately. Then use a matching endpoint to find the shift, and check another point.

If the solid graph runs from $(-3, 1)$ to $(1, 3)$ and the dashed graph is the same shape flipped upside down, from $(-3, -3)$ to $(1, -1)$, then $a = -1$; after the reflection alone $(-3, 1)$ would be at $(-3, -1)$, but it is at $(-3, -3)$, so $k = -2$ and $g(x) = -f(x) - 2$.

> **Watch out.** Upside down means a minus sign in front of $f$; reversed left to right means a minus sign on $x$. Mixing them up, or putting both, gives a different graph. Find the shifts **after** the reflection and check their signs with a second point.`,
        `先判断发生了哪种翻折：图象上下颠倒，则 $f$ 前有负号；左右颠倒，则 $x$ 前有负号。翻折改变图形的朝向，平移只改变位置，所以两者可以分开读出。再用一对对应端点求平移量，并检验另一个点。

如果实线从 $(-3, 1)$ 到 $(1, 3)$，虚线是同样的形状上下颠倒，从 $(-3, -3)$ 到 $(1, -1)$，那么 $a = -1$；只做翻折时 $(-3, 1)$ 会在 $(-3, -1)$，但它实际在 $(-3, -3)$，所以 $k = -2$，$g(x) = -f(x) - 2$。

> **注意。** 上下颠倒对应 $f$ 前面的负号；左右颠倒对应 $x$ 上的负号。把两者弄混或同时都加，会得到另一个图象。翻折之后再求平移量，并用第二个点检验符号。`,
      ),
      generate(rng) {
        const c = pairCase(rng, () => compose(reflectOps(rng)), { x: [-4, 4], y: [-4, 4] });
        const g = c.tf;
        const write = (w: Tf) => same(`$g(x) = ${linLatex(w.a, w.b, w.b.mul(w.h).neg(), w.k)}$`);
        const wrong = [
          { ...g, a: g.a.neg() },
          { ...g, b: g.b.neg() },
          { ...g, h: g.h.neg() },
          { ...g, k: g.k.neg() },
          { ...g, a: g.a.neg(), b: g.b.neg() },
          { ...g, a: g.a.neg(), k: g.k.neg() },
        ].filter((w, i, all) => imageKey(w, c.f) !== imageKey(g, c.f) && all.findIndex((v) => write(v).en === write(w).en) === i);
        const [x, y] = c.f[0]!;
        const [u, v] = mapPoint(g, [Q.of(x), Q.of(y)]);
        const xs = c.f.map((q) => q[0]);
        const ys = c.f.map((q) => q[1]);
        const wide = Math.max(...xs) - Math.min(...xs);
        const tall = Math.max(...ys) - Math.min(...ys);
        const [xc, yc] = c.f[c.f.length - 1]!;
        const [uc, vc] = mapPoint(g, [Q.of(xc), Q.of(yc)]);
        const [sx, sy] = [Q.of(x).div(g.b), g.a.mul(Q.of(y))];
        const reasons: Reason[] = [
          [
            write({ ...g, a: g.a.neg() }).en,
            `The sign in front of $f$ is wrong: the dashed graph is ${g.a.sign() < 0 ? "" : "not "}upside down.`,
            `$f$ 前面的符号错了：虚线${g.a.sign() < 0 ? "是" : "不是"}上下颠倒的。`,
          ],
          [
            write({ ...g, b: g.b.neg() }).en,
            `The sign of $x$ is wrong: the dashed graph is ${g.b.sign() < 0 ? "" : "not "}reversed left to right.`,
            `$x$ 的符号错了：虚线${g.b.sign() < 0 ? "是" : "不是"}左右颠倒的。`,
          ],
          [
            write({ ...g, h: g.h.neg() }).en,
            "The horizontal shift has the wrong sign: check it with a matching endpoint.",
            "水平平移的符号错了：用一对对应端点检验。",
          ],
          [
            write({ ...g, k: g.k.neg() }).en,
            "The vertical shift has the wrong sign: check it with a matching endpoint.",
            "竖直平移的符号错了：用一对对应端点检验。",
          ],
          [
            write({ ...g, a: g.a.neg(), b: g.b.neg() }).en,
            "This is the other reflection: both signs are wrong.",
            "这是另一种翻折：两个符号都错了。",
          ],
          [
            write({ ...g, a: g.a.neg(), k: g.k.neg() }).en,
            "This is the right graph reflected in the $x$-axis: the sign in front of $f$ and the vertical shift are both wrong.",
            "这是正确图象关于 $x$ 轴翻折后的结果：$f$ 前面的符号和竖直平移都错了。",
          ],
        ];
        return annotate(
          {
            ...reasoned(
              shuffled(
                rng,
                solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
                [g, ...rng.shuffle(wrong).slice(0, 3)].map(write),
                t(
                  `${label(1, "Compare the shapes", "比较形状").en} The dashed graph ${g.a.sign() < 0 ? "is upside down compared with the solid one, so the factor in front of $f$ is negative" : "is reversed left to right compared with the solid one, so the factor on $x$ is negative"}. The solid graph is $${wide}$ wide and $${tall}$ tall, the dashed one $${num(Q.of(wide).div(g.b.abs()))}$ wide and $${num(g.a.abs().mul(Q.of(tall)))}$ tall. Hence $a = ${g.a.toLatex()}$ and $b = ${g.b.toLatex()}$.

${label(2, "Find the shifts", "求平移量").en} After the reflection and stretch alone, the left endpoint $${pt(x, y)}$ of $f$ would be at $${pt(sx, sy)}$. It is at $${pt(u, v)}$ instead. Hence the shifts are $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$ and $k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$:${steps(`g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}`)}**Check.** The right endpoint $${pt(xc, yc)}$ of $f$ should go to $${pt(uc, vc)}$. At $x = ${num(uc)}$ the input of $f$ is $${argAt(g, uc)}$, so $y = ${outAt(g, Q.of(yc))} = ${num(vc)}$: that is the other endpoint of the dashed graph.`,
                  `${label(1, "Compare the shapes", "比较形状")["zh-CN"]} 与实线相比，虚线${g.a.sign() < 0 ? "上下颠倒，所以 $f$ 前面的系数是负数" : "左右颠倒，所以 $x$ 上的系数是负数"}。实线宽 $${wide}$、高 $${tall}$，虚线宽 $${num(Q.of(wide).div(g.b.abs()))}$、高 $${num(g.a.abs().mul(Q.of(tall)))}$。因此 $a = ${g.a.toLatex()}$，$b = ${g.b.toLatex()}$。

${label(2, "Find the shifts", "求平移量")["zh-CN"]} 只做翻折和伸缩时，$f$ 的左端点 $${pt(x, y)}$ 会在 $${pt(sx, sy)}$，而它实际在 $${pt(u, v)}$。因此平移量 $h = ${num(u)} - ${paren(sx)} = ${g.h.toLatex()}$，$k = ${num(v)} - ${paren(sy)} = ${g.k.toLatex()}$：${steps(`g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}`)}**检验。** $f$ 的右端点 $${pt(xc, yc)}$ 应移到 $${pt(uc, vc)}$。在 $x = ${num(uc)}$ 处 $f$ 的输入是 $${argAt(g, uc)}$，所以 $y = ${outAt(g, Q.of(yc))} = ${num(vc)}$：正是虚线的另一个端点。`,
                ),
              ),
              reasons,
            ),
            figure: graphFigure(c.f, c.g),
          },
          view,
          imageMarks(g, [x, y]),
          ...imageAlt(g, [x, y]),
        );
      },
    },
  ],
};

// 3.10.11 Finding points.

/** randomLin draws g(x) = a·f(bx + c) + d with nonzero integer a and b, not both 1. */
function randomLin(rng: Rng): { a: Q; b: Q; c: Q; d: Q } {
  const a = Q.of(rng.pick([1, -1, 2, -2, 3, -3]));
  const b = Q.of(rng.pick([1, -1, 2, -2, 3]));
  if (a.eq(Q.one) && b.eq(Q.one)) return { a: Q.of(2), b: Q.of(-1), c: Q.of(rng.nonZero(-6, 6)), d: Q.of(rng.int(-6, 6)) };
  return { a, b, c: Q.of(rng.nonZero(-6, 6)), d: Q.of(rng.int(-6, 6)) };
}

/** linTf converts a·f(bx + c) + d to a·f(b(x − h)) + k. */
const linTf = (l: { a: Q; b: Q; c: Q; d: Q }): Tf => ({ a: l.a, b: l.b, h: l.c.neg().div(l.b), k: l.d });

/** findingPointsOnTransformedCurves finds corresponding points on f and a·f(bx + c) + d. */
export const findingPointsOnTransformedCurves: TopicDef = {
  id: "finding-points-on-transformed-curves",
  title: t("Finding Points on Transformed Curves", "求变换后曲线上的点"),
  summary: t(
    "Find the point of y = a·f(bx + c) + d that comes from a given point of f, and the reverse.",
    "求 y = a·f(bx + c) + d 上由 f 的已知点得到的点，以及反过来求原来的点。",
  ),
  prerequisites: ["combining-reflections-with-other-graph-transformations"],
  encompasses: [
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.5 },
    { topic: "combining-graph-transformations-three-or-more-operations", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We can follow a point through $y = a f(b(x - h)) + k$. Often the formula comes with the input written out, as in $y = 2f(3x - 3) + 1$, and then it is quicker to work with the equation itself than to factor it first.

Say $(6, 4)$ is on the graph of $f$, so $f(6) = 4$. The new graph uses this value where its input $3x - 3$ equals $6$:

$$3x - 3 = 6 \\quad\\Rightarrow\\quad x = 3, \\qquad y = 2 \\cdot 4 + 1 = 9.$$

So $(3, 9)$ is on the new graph. Going back works the same way in reverse: at $x = 3$ the input is $3 \\cdot 3 - 3 = 6$, and $9 = 2f(6) + 1$ gives $f(6) = \\frac{9 - 1}{2} = 4$, the point $(6, 4)$ again. Check: $2f(3 \\cdot 3 - 3) + 1 = 2 \\cdot 4 + 1 = 9$.

In this lesson we move points from $f$ to the transformed curve and back, and evaluate transformed functions from a table.`,
    `我们会追踪点经过 $y = a f(b(x - h)) + k$ 后的位置。解析式常常把输入展开来写，例如 $y = 2f(3x - 3) + 1$，这时直接用方程求解比先提取公因数更快。

设 $(6, 4)$ 在 $f$ 的图象上，即 $f(6) = 4$。新图象在输入 $3x - 3$ 等于 $6$ 的地方用到这个值：

$$3x - 3 = 6 \\quad\\Rightarrow\\quad x = 3, \\qquad y = 2 \\cdot 4 + 1 = 9$$

所以 $(3, 9)$ 在新图象上。反过来也一样：在 $x = 3$ 处输入是 $3 \\cdot 3 - 3 = 6$，由 $9 = 2f(6) + 1$ 得 $f(6) = \\frac{9 - 1}{2} = 4$，又回到点 $(6, 4)$。检验：$2f(3 \\cdot 3 - 3) + 1 = 2 \\cdot 4 + 1 = 9$。

这节课我们把点从 $f$ 移到变换后的曲线上，再移回来，并根据表格求变换后函数的值。`,
  ),
  knowledgePoints: [
    {
      id: "forward-to-the-transformed-curve",
      title: t("From f to the transformed curve", "从 f 到变换后的曲线"),
      explanation: t(
        `The new graph uses the value $f(p) = q$ wherever its input $bx + c$ equals $p$. So to move the point $(p, q)$ of $f$ onto $y = a f(bx + c) + d$, solve for the $x$ that makes the input equal $p$, then compute the output:

$$bx + c = p, \\qquad y = a q + d.$$

For $(4, 3)$ and $y = -2f(2x - 6) + 1$: $2x - 6 = 4$ gives $x = 5$, and $y = -2 \\cdot 3 + 1 = -5$, so the point is $(5, -5)$.

> **Watch out.** The new $x$ is the **solution** of $bx + c = p$, not the value $bp + c$; solve by subtracting $c$ and then dividing by $b$. Outside, multiply $q$ by $a$ first and add $d$ after.`,
        `新图象在输入 $bx + c$ 等于 $p$ 的地方用到 $f(p) = q$ 这个值。所以要把 $f$ 上的点 $(p, q)$ 移到 $y = a f(bx + c) + d$ 上，先求使输入等于 $p$ 的 $x$，再计算输出：

$$bx + c = p, \\qquad y = a q + d$$

对于 $(4, 3)$ 和 $y = -2f(2x - 6) + 1$：由 $2x - 6 = 4$ 得 $x = 5$，$y = -2 \\cdot 3 + 1 = -5$，所以这个点是 $(5, -5)$。

> **注意。** 新的 $x$ 是方程 $bx + c = p$ 的**解**，不是 $bp + c$ 的值；解时先减去 $c$，再除以 $b$。外面先把 $q$ 乘以 $a$，再加 $d$。`,
      ),
      generate(rng) {
        const l = randomLin(rng);
        const g = linTf(l);
        const p = randomPoint(rng);
        const [x, y] = mapPoint(g, p);
        const solve = [
          `${linear(l.b, l.c)} = ${num(p[0])}`,
          ...(l.b.eq(Q.one) ? [] : [`${front(l.b)}x = ${num(p[0])}${plus(l.c.neg())} = ${num(p[0].sub(l.c))}`]),
          `x = ${l.b.eq(Q.one) ? `${num(p[0])}${plus(l.c.neg())} = ` : `\\frac{${num(p[0].sub(l.c))}}{${l.b.toLatex()}} = `}${num(x)}`,
        ];
        return pointProblem({
          prompt: pointQuestion(p, linLatex(l.a, l.b, l.c, l.d)),
          answer: [x, y],
          wrong: [
            [l.b.mul(p[0]).add(l.c), y],
            [p[0].add(l.c).div(l.b), y],
            [x, p[1].add(l.d).mul(l.a)],
            [p[0].div(l.b).sub(l.c), y],
          ],
          solution: t(
            `${label(1, "Solve for the input", "解出输入").en} Since $${pt(p[0], p[1])}$ is on $f$, $f(${num(p[0])}) = ${num(p[1])}$. The new graph uses this value where its input equals $${num(p[0])}$:${steps(...solve)}${label(2, "Compute the output", "计算输出").en} Multiply by $a$, then add $d$:${steps(`y = ${outAt(g, p[1])} = ${num(y)}`)}The point is $${pt(x, y)}$.

**Check.** At $x = ${num(x)}$ the input is $${linAt(l.b, l.c, x)}$, so $y = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${num(p[0])})`)} = ${outAt(g, p[1])} = ${num(y)}$.`,
            `${label(1, "Solve for the input", "解出输入")["zh-CN"]} 因为 $${pt(p[0], p[1])}$ 在 $f$ 上，$f(${num(p[0])}) = ${num(p[1])}$。新图象在输入等于 $${num(p[0])}$ 的地方用到这个值：${steps(...solve)}${label(2, "Compute the output", "计算输出")["zh-CN"]} 先乘 $a$，再加 $d$：${steps(`y = ${outAt(g, p[1])} = ${num(y)}`)}所求的点是 $${pt(x, y)}$。

**检验。** 在 $x = ${num(x)}$ 处输入是 $${linAt(l.b, l.c, x)}$，所以 $y = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${num(p[0])})`)} = ${outAt(g, p[1])} = ${num(y)}$。`,
          ),
        });
      },
    },
    {
      id: "back-to-the-original-curve",
      title: t("From the transformed curve back to f", "从变换后的曲线回到 f"),
      explanation: t(
        `If $(u, v)$ lies on $y = a f(bx + c) + d$, then $v = a f(bu + c) + d$. So $f$ takes the input $bu + c$ to the output $\\frac{v - d}{a}$, and the point

$$\\left(bu + c,\\ \\frac{v - d}{a}\\right)$$

lies on the graph of $f$. For $(5, -5)$ on $y = -2f(2x - 6) + 1$: $(2 \\cdot 5 - 6, \\frac{-5 - 1}{-2}) = (4, 3)$.

> **Watch out.** Going back, compute the input $bu + c$ directly; do not solve an equation as in the forward direction. For the output, subtract $d$ **before** dividing by $a$, and divide rather than multiply.`,
        `若 $(u, v)$ 在 $y = a f(bx + c) + d$ 上，则 $v = a f(bu + c) + d$。所以 $f$ 把输入 $bu + c$ 变成输出 $\\frac{v - d}{a}$，点

$$\\left(bu + c,\\ \\frac{v - d}{a}\\right)$$

在 $f$ 的图象上。对于 $y = -2f(2x - 6) + 1$ 上的 $(5, -5)$：$(2 \\cdot 5 - 6, \\frac{-5 - 1}{-2}) = (4, 3)$。

> **注意。** 往回求时，直接计算输入 $bu + c$，不要像正向那样解方程。求输出时**先**减去 $d$ 再除以 $a$，是除而不是乘。`,
      ),
      generate(rng) {
        const l = randomLin(rng);
        const g = linTf(l);
        const u = Q.of(rng.int(-6, 6));
        const v = Q.of(rng.int(-4, 4)).mul(l.a).add(l.d);
        const [x, y] = unmapPoint(g, [u, v]);
        return pointProblem({
          prompt: t(
            `The point $${pt(u, v)}$ lies on the graph of $y = ${linLatex(l.a, l.b, l.c, l.d)}$. Which point must lie on the graph of $y = f(x)$?`,
            `点 $${pt(u, v)}$ 在 $y = ${linLatex(l.a, l.b, l.c, l.d)}$ 的图象上。哪个点一定在 $y = f(x)$ 的图象上？`,
          ),
          answer: [x, y],
          wrong: [mapPoint(g, [u, v]), [u.sub(l.c).div(l.b), y], [x, v.div(l.a).sub(l.d)], [x, l.a.mul(v).add(l.d)]],
          solution: t(
            `${label(1, "Compute the input of $f$", "计算 $f$ 的输入").en} At $x = ${num(u)}$ the input of $f$ is $${linAt(l.b, l.c, u)}$. So $${num(v)} = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${num(x)})`)}$.

${label(2, "Solve for the output of $f$", "解出 $f$ 的输出").en} Solve this for $f(${num(x)})$, undoing the outside operations:${steps(`f(${num(x)}) = ${undoOut(l.a, l.d, v)} = ${num(y)}`)}The point is $${pt(x, y)}$.

**Check.** Move $${pt(x, y)}$ forward: $${linear(l.b, l.c)} = ${num(x)}$ gives $x = ${num(u)}$, and $${outAt(g, y)} = ${num(v)}$, back to $${pt(u, v)}$.`,
            `${label(1, "Compute the input of $f$", "计算 $f$ 的输入")["zh-CN"]} 在 $x = ${num(u)}$ 处，$f$ 的输入是 $${linAt(l.b, l.c, u)}$。所以 $${num(v)} = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${num(x)})`)}$。

${label(2, "Solve for the output of $f$", "解出 $f$ 的输出")["zh-CN"]} 撤销外面的运算，解出 $f(${num(x)})$：${steps(`f(${num(x)}) = ${undoOut(l.a, l.d, v)} = ${num(y)}`)}所求的点是 $${pt(x, y)}$。

**检验。** 把 $${pt(x, y)}$ 正向移动：由 $${linear(l.b, l.c)} = ${num(x)}$ 得 $x = ${num(u)}$，而 $${outAt(g, y)} = ${num(v)}$，回到 $${pt(u, v)}$。`,
          ),
        });
      },
    },
    {
      id: "values-from-a-table",
      title: t("Values from a table", "由表格求值"),
      explanation: t(
        `To evaluate a transformed function at a number, work from the inside out, in the order the formula is built: compute the input of $f$, look up $f$ there, then apply the outer operations. If $f(1) = 7$ and $g(x) = 3f(2x - 5) - 4$, then

$$g(3) = 3f(2 \\cdot 3 - 5) - 4 = 3f(1) - 4 = 3 \\cdot 7 - 4 = 17.$$

> **Watch out.** Look up $f$ at the computed input, not at the number you were given. Multiply by $a$ before adding $d$, and do not stop at the table value: it still has to go through the outer operations.`,
        `要求变换后的函数在某个数处的值，按解析式构成的顺序从内向外计算：先算 $f$ 的输入，查出 $f$ 在该处的值，再进行外层的运算。若 $f(1) = 7$，$g(x) = 3f(2x - 5) - 4$，则

$$g(3) = 3f(2 \\cdot 3 - 5) - 4 = 3f(1) - 4 = 3 \\cdot 7 - 4 = 17$$

> **注意。** 要在算出的输入处查 $f$，而不是在题目给的数处查。先乘 $a$ 再加 $d$；查到表中的值后不要停下，还要经过外层的运算。`,
      ),
      generate(rng) {
        const xs = range(-3, 3);
        const ys = xs.map(() => rng.int(-9, 9));
        const l = randomLin(rng);
        const options = range(-12, 12).filter((x) => {
          const i = l.b.mul(Q.of(x)).add(l.c).toNumber();
          return i >= -3 && i <= 3;
        });
        const x0 = rng.pick(options.length ? options : [0]);
        const input = l.b.mul(Q.of(x0)).add(l.c).toNumber();
        const fv = options.length ? ys[input + 3]! : 0;
        const ans = l.a.mul(Q.of(fv)).add(l.d);
        const table = `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.join(" & ")} \\\\ \\hline f(x) & ${ys.join(" & ")} \\end{array}$$`;
        const atX0 = ys[x0 + 3];
        return numberProblem({
          prompt: t(
            `Some values of $f$ are given in the table.${table}Let $g(x) = ${linLatex(l.a, l.b, l.c, l.d)}$. Find $g(${x0})$.`,
            `下表给出了 $f$ 的一些值。${table}设 $g(x) = ${linLatex(l.a, l.b, l.c, l.d)}$。求 $g(${x0})$。`,
          ),
          answer: ans,
          wrong: [Q.of(fv), l.a.mul(Q.of(fv + l.d.toNumber())), ...(atX0 === undefined ? [] : [l.a.mul(Q.of(atX0)).add(l.d)])],
          solution: t(
            `${label(1, "Compute the input of $f$", "计算 $f$ 的输入").en} At $x = ${x0}$ the input is $${linAt(l.b, l.c, Q.of(x0))}$.

${label(2, "Look it up", "查表").en} The table gives $f(${input}) = ${fv}$.

${label(3, "Apply the outer operations", "进行外层运算").en} Apply the outside, $y \\mapsto ${linear(l.a, l.d, "y")}$:${steps(`g(${x0}) = ${outAt(linTf(l), Q.of(fv))} = ${ans.toLatex()}`)}**Check.** Undo the outer operations: $${undoOut(l.a, l.d, ans)} = ${fv}$, which is the table value at $x = ${input}$.`,
            `${label(1, "Compute the input of $f$", "计算 $f$ 的输入")["zh-CN"]} 在 $x = ${x0}$ 处输入是 $${linAt(l.b, l.c, Q.of(x0))}$。

${label(2, "Look it up", "查表")["zh-CN"]} 由表格，$f(${input}) = ${fv}$。

${label(3, "Apply the outer operations", "进行外层运算")["zh-CN"]} 进行外层运算 $y \\mapsto ${linear(l.a, l.d, "y")}$：${steps(`g(${x0}) = ${outAt(linTf(l), Q.of(fv))} = ${ans.toLatex()}`)}**检验。** 撤销外层运算：$${undoOut(l.a, l.d, ans)} = ${fv}$，正是表中 $x = ${input}$ 处的值。`,
          ),
        });
      },
    },
  ],
};

// 3.10.12 Domain and range.

/** iv is the interval between lo and hi (infinite when undefined), closed at the ends as given. */
function iv(lo: Coefficient | undefined, hi: Coefficient | undefined, loClosed = true, hiClosed = true): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined && loClosed,
    hiClosed: hi !== undefined && hiClosed,
  };
}

/** mapSet applies x ↦ m·x + c to a set of real numbers (m ≠ 0). */
function mapSet(set: RealSet, m: Coefficient, c: Coefficient): RealSet {
  const M = toQ(m);
  const C = toQ(c);
  const f = (v: Q | undefined) => (v === undefined ? undefined : v.mul(M).add(C));
  return union(
    ...set.map((i) =>
      M.sign() > 0
        ? { ...(i.lo && { lo: f(i.lo) }), ...(i.hi && { hi: f(i.hi) }), loClosed: i.loClosed, hiClosed: i.hiClosed }
        : { ...(i.hi && { lo: f(i.hi) }), ...(i.lo && { hi: f(i.lo) }), loClosed: i.hiClosed, hiClosed: i.loClosed },
    ),
  );
}

/** randomSet draws an interval with integer ends: bounded or not, open or closed at each end. */
function randomSet(rng: Rng): RealSet {
  const a = rng.int(-9, 6);
  const b = rng.int(a + 1, 9);
  const kind = rng.int(0, 5);
  if (kind === 0) return union(iv(a, undefined, rng.bool()));
  if (kind === 1) return union(iv(undefined, b, true, rng.bool()));
  return union(iv(a, b, rng.bool(0.7), rng.bool(0.7)));
}

const setText = (set: RealSet) => `$${intervalLatex(set)}$`;

const domainRangeOf = (dom: RealSet, ran: RealSet) =>
  t(
    `The function $f$ has domain ${setText(dom)} and range ${setText(ran)}.`,
    `函数 $f$ 的定义域是 ${setText(dom)}，值域是 ${setText(ran)}。`,
  );

/** finiteEnds lists the ends of a set that are numbers, from left to right. */
const finiteEnds = (set: RealSet): Q[] => set.flatMap((i) => [i.lo, i.hi]).filter((e): e is Q => e !== undefined);

/** linAt works out bx + c at a number: "2 \cdot (-1) + 3 = 1". */
function linAt(b: Q, c: Q, x: Q): string {
  const bx = b.eq(Q.one) ? num(x) : b.eq(Q.of(-1)) ? `-${paren(x)}` : `${b.toLatex()} \\cdot ${paren(x)}`;
  return `${bx}${plus(c)} = ${num(b.mul(x).add(c))}`;
}

/** undoOut undoes y ↦ a·y + d on the output w: "\frac{9 - 1}{2}", or "9 - 1" when a is 1. */
const undoOut = (a: Q, d: Q, w: Q) => (a.eq(Q.one) ? `${num(w)}${plus(d.neg())}` : `\\frac{${num(w)}${plus(d.neg())}}{${a.toLatex()}}`);

/** rangeSolution finds the range of a·f(…) + k from the range of f, step by step, and checks one end. */
function rangeSolution(ran: RealSet, a: Q, k: Q, answer: RealSet): Text {
  const lines = finiteEnds(ran).map((e) => `${outAt(tf({ a, k }), e)} = ${num(a.mul(e).add(k))}`);
  const w = finiteEnds(answer)[0]!;
  const undo = a.eq(Q.one) ? `${num(w)}${plus(k.neg())}` : `\\frac{${num(w)}${plus(k.neg())}}{${a.toLatex()}}`;
  const open = finiteEnds(ran).length < 2;
  const neg = a.sign() < 0;
  return t(
    `${label(1, "Act on the outputs", "作用于输出").en} The operations outside $f$ turn every output $y$ into $${linear(a, k, "y")}$. They change the range and leave the domain alone. Apply them to each end of ${setText(ran)}:${steps(...lines)}${label(2, "Put the ends in order", "整理端点").en} ${neg ? "Since $a$ is negative, the ends change places" : "Since $a$ is positive, the ends keep their places"}, and each end stays included or excluded as before.${open ? ` The unbounded end stays unbounded${neg ? ", on the other side" : ""}.` : ""} The range of $g$ is ${setText(answer)}.

**Check.** Undo the outside operations on the end $${num(w)}$: $${undo} = ${num(w.sub(k).div(a))}$, an end of the range of $f$.`,
    `${label(1, "Act on the outputs", "作用于输出")["zh-CN"]} $f$ 外面的变换把每个输出 $y$ 变成 $${linear(a, k, "y")}$。它们改变值域，不改变定义域。对 ${setText(ran)} 的每个端点进行变换：${steps(...lines)}${label(2, "Put the ends in order", "整理端点")["zh-CN"]} ${neg ? "因为 $a$ 是负数，两端互换位置" : "因为 $a$ 是正数，两端位置不变"}，每个端点是否包含也与原来相同。${open ? `无界的一端仍然无界${neg ? "，但换到另一边" : ""}。` : ""}$g$ 的值域是 ${setText(answer)}。

**检验。** 对端点 $${num(w)}$ 撤销外面的变换：$${undo} = ${num(w.sub(k).div(a))}$，正是 $f$ 的值域的端点。`,
  );
}

/** domainSolution finds the domain of f(bx + c) from the domain of f, step by step, and checks one end. */
function domainSolution(dom: RealSet, b: Q, c: Q, answer: RealSet): Text {
  const lines = finiteEnds(dom).map((e) => `${linear(b, c)} = ${num(e)} \\quad\\Rightarrow\\quad x = ${num(e.sub(c).div(b))}`);
  const w = finiteEnds(answer)[0]!;
  const open = finiteEnds(dom).length < 2;
  const neg = b.sign() < 0;
  return t(
    `${label(1, "Act on the inputs", "作用于输入").en} $g$ is defined exactly when its input to $f$, $${linear(b, c)}$, lies in the domain ${setText(dom)} of $f$. So the operations inside change the domain and leave the range alone. Solve for $x$ at each end:${steps(...lines)}${label(2, "Put the ends in order", "整理端点").en} ${neg ? "Dividing by the negative number $b$ makes the ends change places" : "Since $b$ is positive, the ends keep their places"}, and each end stays included or excluded as before.${open ? ` The unbounded end stays unbounded${neg ? ", on the other side" : ""}.` : ""} The domain of $g$ is ${setText(answer)}.

**Check.** At the end $x = ${num(w)}$ the input is $${linAt(b, c, w)}$, an end of the domain of $f$.`,
    `${label(1, "Act on the inputs", "作用于输入")["zh-CN"]} 当且仅当输入 $${linear(b, c)}$ 属于 $f$ 的定义域 ${setText(dom)} 时 $g$ 有定义。所以括号里的变换改变定义域，不改变值域。对每个端点解出 $x$：${steps(...lines)}${label(2, "Put the ends in order", "整理端点")["zh-CN"]} ${neg ? "除以负数 $b$ 使两端互换位置" : "因为 $b$ 是正数，两端位置不变"}，每个端点是否包含也与原来相同。${open ? `无界的一端仍然无界${neg ? "，但换到另一边" : ""}。` : ""}$g$ 的定义域是 ${setText(answer)}。

**检验。** 在端点 $x = ${num(w)}$ 处，输入是 $${linAt(b, c, w)}$，正是 $f$ 的定义域的端点。`,
  );
}

/** theDomainAndRangeOfTransformedFunctions finds domains and ranges after transformations. */
export const theDomainAndRangeOfTransformedFunctions: TopicDef = {
  id: "the-domain-and-range-of-transformed-functions",
  title: t("The Domain and Range of Transformed Functions", "变换后函数的定义域与值域"),
  summary: t(
    "Transform the domain with the horizontal operations and the range with the vertical ones.",
    "用水平方向的变换求定义域，用竖直方向的变换求值域。",
  ),
  prerequisites: ["finding-points-on-transformed-curves", "domain-and-range-of-absolute-value-functions"],
  encompasses: [
    { topic: "finding-points-on-transformed-curves", weight: 0.4 },
    { topic: "range-of-a-function", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.A.1"],
  intro: t(
    `The domain of a function is its set of inputs and the range its set of outputs. We know that changes inside $f$ act on the inputs and changes outside act on the outputs, so the inside decides the new domain and the outside decides the new range.

Take $f$ with domain $[0, 4]$ and range $[1, 3]$, and $g(x) = 2f(x - 1) + 3$. $g$ is defined when $x - 1$ is in $[0, 4]$, that is for $1 \\le x \\le 5$. Its outputs are $2y + 3$ for $y$ in $[1, 3]$, from $2 \\cdot 1 + 3 = 5$ to $2 \\cdot 3 + 3 = 9$. So $g$ has domain $[1, 5]$ and range $[5, 9]$. Check with a point: $(0, 1)$ on $f$ moves to $(0 + 1, 2 \\cdot 1 + 3) = (1, 5)$, a corner of both new intervals.

In this lesson we find ranges after vertical operations, domains after horizontal ones, and both after several operations.`,
    `函数的定义域是输入的集合，值域是输出的集合。我们知道括号里的变化作用于输入，外面的变化作用于输出，所以括号里决定新的定义域，外面决定新的值域。

设 $f$ 的定义域是 $[0, 4]$，值域是 $[1, 3]$，$g(x) = 2f(x - 1) + 3$。当 $x - 1$ 属于 $[0, 4]$，即 $1 \\le x \\le 5$ 时 $g$ 有定义。它的输出是 $2y + 3$，其中 $y$ 属于 $[1, 3]$，从 $2 \\cdot 1 + 3 = 5$ 到 $2 \\cdot 3 + 3 = 9$。所以 $g$ 的定义域是 $[1, 5]$，值域是 $[5, 9]$。用一个点检验：$f$ 上的 $(0, 1)$ 移到 $(0 + 1, 2 \\cdot 1 + 3) = (1, 5)$，正是两个新区间的端点。

这节课我们求竖直变换后的值域、水平变换后的定义域，以及多次变换后的定义域和值域。`,
  ),
  knowledgePoints: [
    {
      id: "range-after-vertical-transformations",
      title: t("Vertical operations change the range", "竖直变换改变值域"),
      explanation: t(
        `Vertical operations act on the outputs, so they change the range and leave the domain alone. For $g(x) = a f(x) + k$, every output $y$ of $f$ becomes $ay + k$, so apply $y \\mapsto ay + k$ to each end of the range. A negative $a$ swaps the ends.

If the range of $f$ is $[-1, 4)$, the range of $g(x) = -2f(x) + 3$ runs from $-2 \\cdot 4 + 3 = -5$ (not included) to $-2 \\cdot (-1) + 3 = 5$: it is $(-5, 5]$.

> **Watch out.** Use the range, not the domain. Multiply by $a$ before adding $k$, keep the sign of $k$, and when $a$ is negative reverse the order of the ends, with their brackets.`,
        `竖直方向的变换作用在输出上，所以改变值域而不改变定义域。对于 $g(x) = a f(x) + k$，$f$ 的每个输出 $y$ 都变成 $ay + k$，所以把值域的每个端点按 $y \\mapsto ay + k$ 变换。$a$ 为负时两端互换。

若 $f$ 的值域是 $[-1, 4)$，则 $g(x) = -2f(x) + 3$ 的值域从 $-2 \\cdot 4 + 3 = -5$（不含）到 $-2 \\cdot (-1) + 3 = 5$：是 $(-5, 5]$。

> **注意。** 用的是值域，不是定义域。先乘 $a$ 再加 $k$，$k$ 的符号照抄；$a$ 为负时两端连同括号一起互换。`,
      ),
      generate(rng) {
        const dom = randomSet(rng);
        const ran = randomSet(rng);
        const a = Q.of(rng.pick([1, -1, 2, -2, 3, -3]));
        const k = Q.of(rng.nonZero(-6, 6));
        const answer = mapSet(ran, a, k);
        return intervalProblem({
          prompt: t(
            `${domainRangeOf(dom, ran).en} Find the range of $g(x) = ${tfLatex(tf({ a, k }))}$. Write it in interval notation.`,
            `${domainRangeOf(dom, ran)["zh-CN"]}求 $g(x) = ${tfLatex(tf({ a, k }))}$ 的值域，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong: [ran, dom, mapSet(ran, a, k.neg()), mapSet(ran, a.neg(), k), mapSet(ran, Q.one, k.mul(a))],
          solution: rangeSolution(ran, a, k, answer),
        });
      },
    },
    {
      id: "domain-after-horizontal-transformations",
      title: t("Horizontal operations change the domain", "水平变换改变定义域"),
      explanation: t(
        `Horizontal operations act on the inputs, so they change the domain. $g(x) = f(bx + c)$ is defined exactly when $bx + c$ is in the domain of $f$; solve for $x$ at each end. A negative $b$ swaps the ends.

If the domain of $f$ is $[2, 8]$, then $g(x) = f(2x - 4)$ needs $2 \\le 2x - 4 \\le 8$, that is $3 \\le x \\le 6$: the domain of $g$ is $[3, 6]$.

> **Watch out.** Solve $bx + c = e$ for $x$: subtract $c$, then divide by $b$. Do not compute $be + c$, which moves the ends the wrong way, and do not forget to divide by $b$. Use the domain, not the range.`,
        `水平方向的变换作用在输入上，所以改变定义域。$g(x) = f(bx + c)$ 有定义当且仅当 $bx + c$ 在 $f$ 的定义域内；对每个端点解出 $x$。$b$ 为负时两端互换。

若 $f$ 的定义域是 $[2, 8]$，则 $g(x) = f(2x - 4)$ 要求 $2 \\le 2x - 4 \\le 8$，即 $3 \\le x \\le 6$：$g$ 的定义域是 $[3, 6]$。

> **注意。** 解方程 $bx + c = e$ 求 $x$：先减去 $c$，再除以 $b$。不要计算 $be + c$，那会把端点往反方向移；也不要忘了除以 $b$。用的是定义域，不是值域。`,
      ),
      generate(rng) {
        const dom = randomSet(rng);
        const ran = randomSet(rng);
        const b = Q.of(rng.pick([1, -1, 2, -2, 3]));
        const c = Q.of(rng.nonZero(-6, 6));
        const answer = mapSet(dom, Q.one.div(b), c.neg().div(b));
        return intervalProblem({
          prompt: t(
            `${domainRangeOf(dom, ran).en} Find the domain of $g(x) = f(${linear(b, c)})$. Write it in interval notation.`,
            `${domainRangeOf(dom, ran)["zh-CN"]}求 $g(x) = f(${linear(b, c)})$ 的定义域，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong: [dom, ran, mapSet(dom, b, c), mapSet(dom, Q.one.div(b), c.div(b)), mapSet(dom, Q.one, c.neg())],
          solution: domainSolution(dom, b, c, answer),
        });
      },
    },
    {
      id: "domain-and-range-after-several-transformations",
      title: t("Both at once", "同时求定义域和值域"),
      explanation: t(
        `For $g(x) = a f(bx + c) + d$, find the domain from the inside, $bx + c$, and the range from the outside, $ay + d$: the two parts act on different coordinates and do not affect each other. If $f$ has domain $[-4, 2]$ and range $[0, 5]$, then $g(x) = -f(-x + 1) + 2$ has domain $[-1, 5]$ (from $-4 \\le -x + 1 \\le 2$) and range $[-3, 2]$ (from $y \\mapsto -y + 2$).

> **Watch out.** Answer the question asked: the domain uses only $b$ and $c$, the range only $a$ and $d$. For the domain, solve $bx + c = e$ rather than computing $be + c$; for the range, keep the sign of $d$ and multiply by $a$, not $\\frac{1}{a}$.`,
        `对于 $g(x) = a f(bx + c) + d$，由内层 $bx + c$ 求定义域，由外层 $ay + d$ 求值域：两部分作用在不同的坐标上，互不影响。若 $f$ 的定义域是 $[-4, 2]$、值域是 $[0, 5]$，则 $g(x) = -f(-x + 1) + 2$ 的定义域是 $[-1, 5]$（由 $-4 \\le -x + 1 \\le 2$），值域是 $[-3, 2]$（由 $y \\mapsto -y + 2$）。

> **注意。** 回答题目所问：定义域只用 $b$ 和 $c$，值域只用 $a$ 和 $d$。求定义域要解 $bx + c = e$，而不是算 $be + c$；求值域时 $d$ 的符号照抄，乘的是 $a$ 而不是 $\\frac{1}{a}$。`,
      ),
      generate(rng) {
        const dom = randomSet(rng);
        const ran = randomSet(rng);
        const l = randomLin(rng);
        const domG = mapSet(dom, Q.one.div(l.b), l.c.neg().div(l.b));
        const ranG = mapSet(ran, l.a, l.d);
        const askDomain = rng.bool();
        const g = linLatex(l.a, l.b, l.c, l.d);
        return intervalProblem({
          prompt: t(
            `${domainRangeOf(dom, ran).en} Find the ${askDomain ? "domain" : "range"} of $g(x) = ${g}$. Write it in interval notation.`,
            `${domainRangeOf(dom, ran)["zh-CN"]}求 $g(x) = ${g}$ 的${askDomain ? "定义域" : "值域"}，用区间记号表示。`,
          ),
          set: askDomain ? domG : ranG,
          form: "interval",
          wrong: askDomain
            ? [dom, ranG, mapSet(dom, l.b, l.c), mapSet(dom, Q.one.div(l.b), l.c.div(l.b))]
            : [ran, domG, mapSet(ran, l.a, l.d.neg()), mapSet(ran, Q.one.div(l.a), l.d)],
          solution: askDomain ? domainSolution(dom, l.b, l.c, domG) : rangeSolution(ran, l.a, l.d, ranG),
        });
      },
    },
  ],
};

// 3.10.13 Absolute value transformations.

/** absoluteValueGraphTransformations studies y = |f(x)| and y = f(|x|). */
export const absoluteValueGraphTransformations: TopicDef = {
  id: "absolute-value-graph-transformations",
  title: t("Absolute Value Graph Transformations", "绝对值图象变换"),
  summary: t(
    "Graph y = |f(x)|, which reflects the parts below the x-axis upward, and y = f(|x|), which mirrors the right half across the y-axis.",
    "画 y = |f(x)|（把 x 轴下方的部分翻折到上方）和 y = f(|x|)（把右半部分关于 y 轴对称到左边）的图象。",
  ),
  prerequisites: ["the-domain-and-range-of-transformed-functions"],
  encompasses: [{ topic: "absolute-value-expressions", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `We have met $|x|$ as a function and as a distance from $0$. Putting bars into a formula gives two new transformations, depending on where they go: around the output, $|f(x)|$, or around the input, $f(|x|)$.

Take $f(x) = x - 2$:

$$\\begin{array}{c|cccc} x & -1 & 0 & 1 & 3 \\\\ \\hline f(x) & -3 & -2 & -1 & 1 \\\\ |f(x)| & 3 & 2 & 1 & 1 \\\\ f(|x|) & -1 & -2 & -1 & 1 \\end{array}$$

$|f(x)|$ turns the negative outputs positive: the part of the line below the $x$-axis is reflected up, and the graph is the V $y = |x - 2|$. $f(|x|) = |x| - 2$ uses $|x|$ as the input: at $x = -1$ it repeats the value at $x = 1$, so the left half mirrors the right half. Check: $f(|-1|) = f(1) = -1$, but $|f(-1)| = |-3| = 3$.

In this lesson we evaluate both kinds, read them from a graph, and find the range of $|f(x)|$.`,
    `我们已经把 $|x|$ 看作函数，也看作到 $0$ 的距离。在解析式中加上绝对值符号会得到两种新的变换，取决于放在哪里：套在输出上 $|f(x)|$，或套在输入上 $f(|x|)$。

取 $f(x) = x - 2$：

$$\\begin{array}{c|cccc} x & -1 & 0 & 1 & 3 \\\\ \\hline f(x) & -3 & -2 & -1 & 1 \\\\ |f(x)| & 3 & 2 & 1 & 1 \\\\ f(|x|) & -1 & -2 & -1 & 1 \\end{array}$$

$|f(x)|$ 把负的输出变成正的：直线在 $x$ 轴下方的部分翻折到上方，图象是 V 形 $y = |x - 2|$。$f(|x|) = |x| - 2$ 用 $|x|$ 作输入：在 $x = -1$ 处重复 $x = 1$ 处的值，所以左半部分是右半部分的镜像。检验：$f(|-1|) = f(1) = -1$，而 $|f(-1)| = |-3| = 3$。

这节课我们计算这两种函数的值，从图象读出它们，并求 $|f(x)|$ 的值域。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-absolute-value-transformations",
      title: t("Evaluating |f(x)| and f(|x|)", "求 |f(x)| 与 f(|x|) 的值"),
      explanation: t(
        `The bars act at different stages, and the order of a formula's operations is the order of evaluation:

- $g(x) = |f(x)|$: evaluate $f$ first, then take the absolute value of the **output**;
- $h(x) = f(|x|)$: take the absolute value of the **input** first, then evaluate $f$.

For $f(x) = x^2 + 4x - 1$: $g(-2) = |4 - 8 - 1| = 5$, while $h(-2) = f(2) = 4 + 8 - 1 = 11$.

> **Watch out.** Read where the bars are. In $|f(x)|$ do not change the sign of the input, and do not drop the bars from a negative output. In $f(|x|)$ evaluate $f$ at $|x|$, not at $x$.`,
        `绝对值作用的阶段不同，解析式中运算的顺序就是计算的顺序：

- $g(x) = |f(x)|$：先求 $f$ 的值，再对**输出**取绝对值；
- $h(x) = f(|x|)$：先对**输入**取绝对值，再求 $f$ 的值。

对于 $f(x) = x^2 + 4x - 1$：$g(-2) = |4 - 8 - 1| = 5$，而 $h(-2) = f(2) = 4 + 8 - 1 = 11$。

> **注意。** 看清绝对值符号的位置。在 $|f(x)|$ 中不要改变输入的符号，负的输出也不能去掉绝对值就算了。在 $f(|x|)$ 中要在 $|x|$ 处求 $f$，而不是在 $x$ 处。`,
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const outer = rng.bool();
        let x0 = Q.of(rng.nonZero(-5, -1));
        if (outer && pAt(f, x0).sign() >= 0) {
          const neg = range(-5, 5).find((x) => pAt(f, Q.of(x)).sign() < 0);
          if (neg !== undefined) x0 = Q.of(neg);
        }
        const fx = pAt(f, x0);
        const fAbs = pAt(f, x0.abs());
        const answer = outer ? fx.abs() : fAbs;
        const name = outer ? "|f(x)|" : "f(|x|)";
        const plug = (z: Q) => {
          const [c0, c1, c2] = f as [Q, Q, Q];
          const zt = z.sign() < 0 ? `(${num(z)})` : num(z);
          const sq = c2.eq(Q.one) ? `${zt}^{2}` : c2.eq(Q.of(-1)) ? `-${zt}^{2}` : `${c2.toLatex()} \\cdot ${zt}^{2}`;
          const mid = `${c1.sign() < 0 ? " - " : " + "}${c1.abs().eq(Q.one) ? zt : `${c1.abs().toLatex()} \\cdot ${zt}`}`;
          return `${sq}${mid}${plus(c0)}`;
        };
        return numberProblem({
          prompt: t(
            `Let ${fIs(f)} and $g(x) = ${name}$. Find $g(${x0.toLatex()})$.`,
            `设 ${fIs(f)}，$g(x) = ${name}$。求 $g(${x0.toLatex()})$。`,
          ),
          answer,
          wrong: [fx, fAbs, fx.abs(), fAbs.abs(), fx.neg()],
          solution: outer
            ? t(
                `${label(1, "Evaluate $f$ first", "先求 $f$ 的值").en} The bars are around the output, so evaluate $f$ at $${num(x0)}$ itself:${steps(`f(${num(x0)}) = ${plug(x0)} = ${num(fx)}`)}${label(2, "Then take the absolute value", "再取绝对值").en} ${fx.sign() < 0 ? "The output is negative, so the bars change its sign" : "The output is not negative, so the bars leave it alone"}:${steps(`g(${num(x0)}) = |${num(fx)}| = ${num(answer)}`)}**Check.** $${num(answer)}$ is not negative, as an absolute value must be, and it is the distance of $${num(fx)}$ from $0$.`,
                `${label(1, "Evaluate $f$ first", "先求 $f$ 的值")["zh-CN"]} 绝对值套在输出上，所以在 $${num(x0)}$ 本身处求 $f$：${steps(`f(${num(x0)}) = ${plug(x0)} = ${num(fx)}`)}${label(2, "Then take the absolute value", "再取绝对值")["zh-CN"]} ${fx.sign() < 0 ? "输出是负数，绝对值改变它的符号" : "输出不是负数，绝对值不改变它"}：${steps(`g(${num(x0)}) = |${num(fx)}| = ${num(answer)}`)}**检验。** $${num(answer)}$ 不是负数，符合绝对值的要求，它正是 $${num(fx)}$ 到 $0$ 的距离。`,
              )
            : t(
                `${label(1, "Take the absolute value of the input", "先对输入取绝对值").en} The bars are around the input, so first $|${num(x0)}| = ${num(x0.abs())}$.

${label(2, "Then evaluate $f$", "再求 $f$ 的值").en} Evaluate $f$ at $${num(x0.abs())}$:${steps(`g(${num(x0)}) = f(${num(x0.abs())}) = ${plug(x0.abs())} = ${num(answer)}`)}**Check.** $g(x) = f(|x|)$ takes the same value at $x$ and $-x$: $g(${num(x0.neg())}) = f(${num(x0.abs())}) = ${num(answer)}$ too${x0.sign() < 0 ? `, while $f(${num(x0)}) = ${num(fx)}$ is a different number` : ""}.`,
                `${label(1, "Take the absolute value of the input", "先对输入取绝对值")["zh-CN"]} 绝对值套在输入上，所以先算 $|${num(x0)}| = ${num(x0.abs())}$。

${label(2, "Then evaluate $f$", "再求 $f$ 的值")["zh-CN"]} 在 $${num(x0.abs())}$ 处求 $f$：${steps(`g(${num(x0)}) = f(${num(x0.abs())}) = ${plug(x0.abs())} = ${num(answer)}`)}**检验。** $g(x) = f(|x|)$ 在 $x$ 与 $-x$ 处取同样的值：$g(${num(x0.neg())}) = f(${num(x0.abs())}) = ${num(answer)}$ 也成立${x0.sign() < 0 ? `，而 $f(${num(x0)}) = ${num(fx)}$ 是另一个数` : ""}。`,
              ),
        });
      },
    },
    {
      id: "absolute-value-transformations-from-graphs",
      figure: algebraDrawings2["absolute-value-graph-transformations#absolute-value-transformations-from-graphs"],
      title: t("Reading the new graphs", "读出新图象"),
      explanation: t(
        `From the graph of $f$:

- $y = |f(x)|$ keeps the parts on or above the $x$-axis and reflects the parts below it upward, because $|y| = -y$ when $y < 0$;
- $y = f(|x|)$ keeps the part for $x \\ge 0$ and replaces the left half with the mirror image of the right half, so its value at $-p$ is $f(p)$.

If the graph of $f$ passes through $(3, -2)$, then $|f(3)| = 2$ and $f(|-3|) = -2$.

> **Watch out.** For $|f(x)|$ read $f$ at $x$ itself and make the result positive; for $f(|x|)$ read $f$ at $|x|$, on the right half, and keep its sign. The two are not the same.`,
        `由 $f$ 的图象：

- $y = |f(x)|$ 保留 $x$ 轴上及上方的部分，把下方的部分翻折到上方，因为 $y < 0$ 时 $|y| = -y$；
- $y = f(|x|)$ 保留 $x \\ge 0$ 的部分，左半部分换成右半部分关于 $y$ 轴的对称图形，所以它在 $-p$ 处的值是 $f(p)$。

若 $f$ 的图象经过 $(3, -2)$，则 $|f(3)| = 2$，$f(|-3|) = -2$。

> **注意。** 求 $|f(x)|$ 时在 $x$ 本身处读 $f$，再把结果变成正的；求 $f(|x|)$ 时在 $|x|$ 处（右半部分）读 $f$，保留它的符号。两者不同。`,
      ),
      generate(rng) {
        for (;;) {
          const f = randomGraph(rng, -6, 6, -6, 6);
          const outer = rng.bool();
          const lo = f[0]![0];
          const hi = f[f.length - 1]![0];
          const xs = range(lo, hi).filter((x) => {
            if (outer) return valueOn(f, x)!.sign() < 0;
            return x < 0 && -x <= hi && valueOn(f, -x) !== undefined && !(valueOn(f, x)?.eq(valueOn(f, -x)!) ?? false);
          });
          if (xs.length === 0) continue;
          const x = rng.pick(xs);
          const fx = valueOn(f, x);
          const fm = valueOn(f, Math.abs(x));
          if (!outer && fm === undefined) continue;
          const answer = outer ? fx!.abs() : fm!;
          const name = outer ? "|f(x)|" : "f(|x|)";
          return annotate(
            {
              ...numberProblem({
                prompt: t(
                  `The graph of $f$ is shown. Let $g(x) = ${name}$. Find $g(${x})$.`,
                  `下图是 $f$ 的图象。设 $g(x) = ${name}$。求 $g(${x})$。`,
                ),
                answer,
                wrong: [...(fx ? [fx, fx.abs()] : []), ...(fm ? [fm, fm.abs().neg(), fm.neg()] : [])],
                solution: outer
                  ? t(
                      `${label(1, "Read $f$ at $x$", "在 $x$ 处读 $f$").en} From the graph, $f(${x}) = ${fx!.toLatex()}$: the point $${pt(x, fx!)}$ is below the $x$-axis.

${label(2, "Reflect it up", "向上翻折").en} The bars turn the negative output into its opposite:${steps(`g(${x}) = |${fx!.toLatex()}| = ${answer.toLatex()}`)}**Check.** The points $${pt(x, fx!)}$ and $${pt(x, answer)}$ are both $${answer.toLatex()}$ from the $x$-axis, on opposite sides, as the reflection upward requires.`,
                      `${label(1, "Read $f$ at $x$", "在 $x$ 处读 $f$")["zh-CN"]} 由图象，$f(${x}) = ${fx!.toLatex()}$：点 $${pt(x, fx!)}$ 在 $x$ 轴下方。

${label(2, "Reflect it up", "向上翻折")["zh-CN"]} 绝对值把负的输出变成它的相反数：${steps(`g(${x}) = |${fx!.toLatex()}| = ${answer.toLatex()}`)}**检验。** 点 $${pt(x, fx!)}$ 和 $${pt(x, answer)}$ 到 $x$ 轴的距离都是 $${answer.toLatex()}$，分别在 $x$ 轴两侧，符合向上翻折。`,
                    )
                  : t(
                      `${label(1, "Take the absolute value of the input", "先对输入取绝对值").en} $|${x}| = ${-x}$, so $g(${x}) = f(${-x})$: the value comes from the right half of the graph.

${label(2, "Read $f$ there", "在那里读 $f$").en} From the graph, the point $${pt(-x, fm!)}$ is on $f$:${steps(`g(${x}) = f(${-x}) = ${fm!.toLatex()}`)}**Check.** $g(x) = f(|x|)$ is symmetric about the $y$-axis, so $g(${-x}) = f(${-x}) = ${fm!.toLatex()}$ as well: the points $${pt(x, fm!)}$ and $${pt(-x, fm!)}$ are mirror images.`,
                      `${label(1, "Take the absolute value of the input", "先对输入取绝对值")["zh-CN"]} $|${x}| = ${-x}$，所以 $g(${x}) = f(${-x})$：值来自图象的右半部分。

${label(2, "Read $f$ there", "在那里读 $f$")["zh-CN"]} 由图象，点 $${pt(-x, fm!)}$ 在 $f$ 上：${steps(`g(${x}) = f(${-x}) = ${fm!.toLatex()}`)}**检验。** $g(x) = f(|x|)$ 的图象关于 $y$ 轴对称，所以 $g(${-x}) = f(${-x}) = ${fm!.toLatex()}$ 也成立：点 $${pt(x, fm!)}$ 与 $${pt(-x, fm!)}$ 互为镜像。`,
                    ),
              }),
              figure: graphFigure(f),
            },
            view,
            shift(outer ? [x, fx!.toNumber()] : [Math.abs(x), fm!.toNumber()], [x, answer.toNumber()]),
            outer
              ? `The point below the x-axis reflects up, to height ${plain(answer)}.`
              : `The value at x = ${Math.abs(x)} is copied to x = ${x}: ${plain(answer)}.`,
            outer ? `x 轴下方的点向上反射，高度为 ${plain(answer)}。` : `x = ${Math.abs(x)} 处的值复制到 x = ${x}：${plain(answer)}。`,
          );
        }
      },
    },
    {
      id: "the-range-of-the-absolute-value-of-a-function",
      title: t("The range of |f(x)|", "|f(x)| 的值域"),
      explanation: t(
        `Taking absolute values turns the negative outputs of $f$ into positive ones and leaves the others. If the range of $f$ is $[m, M]$:

- when $m \\ge 0$, the range of $|f(x)|$ is still $[m, M]$;
- when $M \\le 0$, it is $[-M, -m]$;
- when $m < 0 < M$, the output $0$ is reached and the range is $[0, \\max(-m, M)]$.

For the range $[-5, 3]$, the range of $|f(x)|$ is $[0, 5]$.

> **Watch out.** When the graph crosses the $x$-axis, the least value of $|f(x)|$ is $0$, not $|m|$ or $|M|$. The greatest value is the larger of $-m$ and $M$, which can come from the lowest point. Do not keep the negative part of the range.`,
        `取绝对值把 $f$ 的负输出变成正的，其余不变。若 $f$ 的值域是 $[m, M]$：

- 当 $m \\ge 0$ 时，$|f(x)|$ 的值域仍是 $[m, M]$；
- 当 $M \\le 0$ 时，值域是 $[-M, -m]$；
- 当 $m < 0 < M$ 时，能取到 $0$，值域是 $[0, \\max(-m, M)]$。

若值域是 $[-5, 3]$，则 $|f(x)|$ 的值域是 $[0, 5]$。

> **注意。** 图象穿过 $x$ 轴时，$|f(x)|$ 的最小值是 $0$，而不是 $|m|$ 或 $|M|$。最大值是 $-m$ 与 $M$ 中较大的那个，可能来自最低点。不要保留值域中负的部分。`,
      ),
      generate(rng) {
        const f = randomGraph(rng, -6, 6, -6, 6);
        const ys = f.map(([, y]) => y);
        const m = Math.min(...ys);
        const M = Math.max(...ys);
        const lo = m >= 0 ? m : M <= 0 ? -M : 0;
        const hi = m >= 0 ? M : M <= 0 ? -m : Math.max(-m, M);
        const set = union(iv(lo, hi));
        return {
          ...intervalProblem({
            prompt: t(
              "The graph of $f$ is shown. Find the range of $g(x) = |f(x)|$. Write it in interval notation.",
              "下图是 $f$ 的图象。求 $g(x) = |f(x)|$ 的值域，用区间记号表示。",
            ),
            set,
            form: "interval",
            wrong: [
              union(iv(m, M)),
              union(iv(Math.min(Math.abs(m), Math.abs(M)), Math.max(Math.abs(m), Math.abs(M)))),
              union(iv(0, M)),
              union(iv(lo, M)),
            ],
            solution: t(
              `${label(1, "Read the range of $f$", "读出 $f$ 的值域").en} The graph is made of segments, so its lowest and highest points are vertices: the lowest is at height $${m}$ and the highest at $${M}$. The range of $f$ is $[${m}, ${M}]$.

${label(2, "Take absolute values", "取绝对值").en} ${m >= 0 ? "No output is negative, so the bars change nothing" : M <= 0 ? "Every output is at most $0$, so the bars change every sign and reverse the order" : `The outputs run from negative to positive, so the graph crosses the $x$-axis, where $|f(x)| = 0$. The greatest value is $\\max(${-m}, ${M}) = ${hi}$`}. The range of $g$ is ${setText(set)}.

**Check.** A value of $|f(x)|$ is a height's distance from the $x$-axis. The vertex farthest from the axis is at height $${Math.abs(m) > Math.abs(M) ? m : M}$, giving the greatest value $${hi}$; ${m < 0 && M > 0 ? "the crossing gives the least value $0$" : `the vertex nearest to the axis gives the least value $${lo}$`}.`,
              `${label(1, "Read the range of $f$", "读出 $f$ 的值域")["zh-CN"]} 图象由线段组成，所以最低点和最高点都是顶点：最低点高度为 $${m}$，最高点为 $${M}$。$f$ 的值域是 $[${m}, ${M}]$。

${label(2, "Take absolute values", "取绝对值")["zh-CN"]} ${m >= 0 ? "没有负的输出，所以取绝对值不改变任何值" : M <= 0 ? "每个输出都不大于 $0$，所以取绝对值改变每个值的符号，两端互换" : `输出从负到正，所以图象穿过 $x$ 轴，在那里 $|f(x)| = 0$。最大值是 $\\max(${-m}, ${M}) = ${hi}$`}。$g$ 的值域是 ${setText(set)}。

**检验。** $|f(x)|$ 的值是高度到 $x$ 轴的距离。离 $x$ 轴最远的顶点高度为 $${Math.abs(m) > Math.abs(M) ? m : M}$，给出最大值 $${hi}$；${m < 0 && M > 0 ? "与 $x$ 轴的交点给出最小值 $0$" : `离 $x$ 轴最近的顶点给出最小值 $${lo}$`}。`,
            ),
          }),
          figure: graphFigure(f),
        };
      },
    },
  ],
};

/** graphTransformationTopics are the topics of Algebra II module 3.10, Graph Transformations of Functions, in teaching order. */
export const graphTransformationTopics: readonly TopicDef[] = [
  verticalTranslationsOfFunctions,
  horizontalTranslationsOfFunctions,
  verticalStretchesOfFunctions,
  horizontalStretchesOfFunctions,
  combiningGraphTransformationsTwoOperations,
  combiningGraphTransformationsThreeOrMoreOperations,
  constructingFunctionsUsingTransformations,
  verticalReflectionsOfFunctions,
  horizontalReflectionsOfFunctions,
  combiningReflectionsWithOtherGraphTransformations,
  findingPointsOnTransformedCurves,
  theDomainAndRangeOfTransformedFunctions,
  absoluteValueGraphTransformations,
];
