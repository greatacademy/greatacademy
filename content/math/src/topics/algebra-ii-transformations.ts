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

import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, steps } from "../problems.ts";

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
  return pointProblem({
    prompt: pointQuestion(p, written),
    answer: mapPoint(g, p),
    wrong: [...wrongTfs.map((w) => mapPoint(w, p)), [p[1], p[0]]],
    solution,
  });
}

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
  encompasses: [
    { topic: "absolute-value-graphs", weight: 0.3 },
    { topic: "the-vertex-form-of-a-parabola", weight: 0.1 },
    { topic: "graphs-of-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-vertical-translation",
      title: t("Moving points up and down", "上下移动点"),
      explanation: t(
        "The graph of $y = f(x) + k$ has the same inputs as $y = f(x)$, but every output is $k$ more. So every point $(x, y)$ of the graph of $f$ moves to $(x, y + k)$: the graph shifts **up** $k$ units when $k > 0$ and **down** $|k|$ units when $k < 0$.\n\nIf $(2, 5)$ is on the graph of $y = f(x)$, then $(2, 5 - 3) = (2, 2)$ is on the graph of $y = f(x) - 3$.",
        "$y = f(x) + k$ 与 $y = f(x)$ 的输入相同，但每个输出都多了 $k$。所以 $f$ 的图象上每个点 $(x, y)$ 都移到 $(x, y + k)$：$k > 0$ 时图象向**上**平移 $k$ 个单位，$k < 0$ 时向**下**平移 $|k|$ 个单位。\n\n若 $(2, 5)$ 在 $y = f(x)$ 的图象上，则 $(2, 5 - 3) = (2, 2)$ 在 $y = f(x) - 3$ 的图象上。",
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
            `Adding $${k}$ to the output moves every point ${k > 0 ? "up" : "down"} ${units(Q.of(k))}: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$.`,
            `输出加上 $${k}$，每个点向${k > 0 ? "上" : "下"}移动 $${Math.abs(k)}$ 个单位：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。`,
          ),
        );
      },
    },
    {
      id: "equations-of-vertical-translations",
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        "To shift the graph of $f$ up by $k$ units, add $k$ to the whole function: $g(x) = f(x) + k$. To shift it down, subtract.\n\nFor $f(x) = x^2 - 4x + 1$ shifted down $5$ units:\n\n$$g(x) = f(x) - 5 = x^2 - 4x + 1 - 5 = x^2 - 4x - 4$$",
        "要把 $f$ 的图象向上平移 $k$ 个单位，就给整个函数加上 $k$：$g(x) = f(x) + k$。向下平移就减去。\n\n把 $f(x) = x^2 - 4x + 1$ 向下平移 $5$ 个单位：\n\n$$g(x) = f(x) - 5 = x^2 - 4x + 1 - 5 = x^2 - 4x - 4$$",
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const k = rng.nonZero(-9, 9);
        const g = tf({ k });
        const answer = tfPoly(f, g);
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the graph of $f$ shifted ${k > 0 ? "up" : "down"} ${units(Q.of(k))}. Find $g(x)$.`,
            `设 ${fIs(f)}。把 $f$ 的图象向${k > 0 ? "上" : "下"}平移 $${Math.abs(k)}$ 个单位得到 $g$ 的图象。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ k: -k })), tfPoly(f, tf({ h: k })), tfPoly(f, tf({ h: -k })), pLatex(f)],
          solution: t(
            `$$g(x) = f(x)${plus(k)} = ${pLatex(f)}${plus(k)} = ${answer}$$`,
            `$$g(x) = f(x)${plus(k)} = ${pLatex(f)}${plus(k)} = ${answer}$$`,
          ),
        });
      },
    },
    {
      id: "vertical-translations-from-graphs",
      title: t("Reading the shift from graphs", "从图象读出平移量"),
      explanation: t(
        "When the graph of $g$ is the graph of $f$ shifted vertically, compare one point of $f$ with the point of $g$ directly above or below it. If $(1, -2)$ is on $f$ and $(1, 2)$ is on $g$, then every point moved up $4$ units and $g(x) = f(x) + 4$.",
        "如果 $g$ 的图象是 $f$ 的图象上下平移得到的，就比较 $f$ 上的一个点和 $g$ 上正上方或正下方对应的点。若 $(1, -2)$ 在 $f$ 上、$(1, 2)$ 在 $g$ 上，则每个点都向上移动了 $4$ 个单位，$g(x) = f(x) + 4$。",
      ),
      generate(rng) {
        const c = pairCase(rng, () => tf({ k: rng.nonZero(-6, 6) }), { y: [-4, 4] });
        const k = c.tf.k;
        const [x, y] = c.f[0]!;
        return {
          ...numberProblem({
            prompt: solidDashed("Given that $g(x) = f(x) + k$, find $k$.", "已知 $g(x) = f(x) + k$，求 $k$。"),
            answer: k,
            wrong: [k.neg()],
            solution: t(
              `The point $${pt(x, y)}$ of $f$ moves to $${pt(x, k.add(Q.of(y)))}$ on $g$, a change of $${k.toLatex()}$ in $y$, so $k = ${k.toLatex()}$.`,
              `$f$ 上的点 $${pt(x, y)}$ 移到 $g$ 上的 $${pt(x, k.add(Q.of(y)))}$，$y$ 变化了 $${k.toLatex()}$，所以 $k = ${k.toLatex()}$。`,
            ),
          }),
          figure: graphFigure(c.f, c.g),
        };
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
  encompasses: [{ topic: "vertical-translations-of-functions", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-translation",
      title: t("Moving points left and right", "左右移动点"),
      explanation: t(
        "The graph of $y = f(x - h)$ reaches each output of $f$ $h$ units **later**: at $x = p + h$ it computes $f(p + h - h) = f(p)$. So every point $(x, y)$ moves to $(x + h, y)$, which is a shift **right** for $h > 0$.\n\nThe sign looks backwards: $y = f(x + 3) = f(x - (-3))$ is shifted $3$ units **left**, so $(2, 5)$ on $f$ moves to $(-1, 5)$.",
        "$y = f(x - h)$ 的图象比 $f$ **晚** $h$ 个单位达到每个输出：在 $x = p + h$ 处它计算的是 $f(p + h - h) = f(p)$。所以每个点 $(x, y)$ 都移到 $(x + h, y)$，$h > 0$ 时是向**右**平移。\n\n符号看起来是反的：$y = f(x + 3) = f(x - (-3))$ 是向**左**平移 $3$ 个单位，所以 $f$ 上的 $(2, 5)$ 移到 $(-1, 5)$。",
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
            `In $f(${shifted(h)})$, $h = ${h}$, so the graph shifts ${h > 0 ? "right" : "left"} ${units(Q.of(h))}: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$. Check: at $x = ${x.toLatex()}$ the input of $f$ is $${x.toLatex()}${plus(-h)} = ${p[0].toLatex()}$.`,
            `在 $f(${shifted(h)})$ 中 $h = ${h}$，所以图象向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。检验：$x = ${x.toLatex()}$ 时 $f$ 的输入是 $${x.toLatex()}${plus(-h)} = ${p[0].toLatex()}$。`,
          ),
        );
      },
    },
    {
      id: "equations-of-horizontal-translations",
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        "To shift the graph of $f$ right by $h$ units, replace every $x$ in $f(x)$ with $(x - h)$; to shift it left, replace $x$ with $(x + h)$.\n\nFor $f(x) = x^2 + 3x$ shifted left $2$ units:\n\n$$g(x) = f(x + 2) = (x + 2)^2 + 3(x + 2) = x^2 + 7x + 10$$\n\nYou may leave the answer unexpanded.",
        "要把 $f$ 的图象向右平移 $h$ 个单位，把 $f(x)$ 中的每个 $x$ 换成 $(x - h)$；向左平移则换成 $(x + h)$。\n\n把 $f(x) = x^2 + 3x$ 向左平移 $2$ 个单位：\n\n$$g(x) = f(x + 2) = (x + 2)^2 + 3(x + 2) = x^2 + 7x + 10$$\n\n答案可以不展开。",
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
            `Replace $x$ with $(${shifted(h)})$:${steps(`g(x) = f(${shifted(h)}) = ${answer}`)}`,
            `把 $x$ 换成 $(${shifted(h)})$：${steps(`g(x) = f(${shifted(h)}) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "horizontal-translations-from-graphs",
      title: t("Reading the shift from graphs", "从图象读出平移量"),
      explanation: t(
        "When the graph of $g$ is the graph of $f$ shifted horizontally, match a point of $f$ with the point of $g$ at the same height, such as the two left endpoints. If the left endpoint of $f$ is $(-3, 1)$ and that of $g$ is $(2, 1)$, the graph moved $5$ units right, so $g(x) = f(x - 5)$ and $h = 5$.",
        "如果 $g$ 的图象是 $f$ 的图象左右平移得到的，就把 $f$ 上的一个点与 $g$ 上同样高度的对应点配对，例如两个左端点。若 $f$ 的左端点是 $(-3, 1)$、$g$ 的左端点是 $(2, 1)$，则图象向右移动了 $5$ 个单位，所以 $g(x) = f(x - 5)$，$h = 5$。",
      ),
      generate(rng) {
        const c = pairCase(rng, () => tf({ h: rng.nonZero(-6, 6) }), { x: [-4, 4] });
        const h = c.tf.h;
        const [x, y] = c.f[0]!;
        return {
          ...numberProblem({
            prompt: solidDashed("Given that $g(x) = f(x - h)$, find $h$.", "已知 $g(x) = f(x - h)$，求 $h$。"),
            answer: h,
            wrong: [h.neg()],
            solution: t(
              `The left endpoint $${pt(x, y)}$ of $f$ moves to $${pt(h.add(Q.of(x)), y)}$ on $g$, ${units(h)} to the ${h.sign() > 0 ? "right" : "left"}, so $h = ${h.toLatex()}$.`,
              `$f$ 的左端点 $${pt(x, y)}$ 移到 $g$ 上的 $${pt(h.add(Q.of(x)), y)}$，向${h.sign() > 0 ? "右" : "左"}移动了 $${h.abs().toLatex()}$ 个单位，所以 $h = ${h.toLatex()}$。`,
            ),
          }),
          figure: graphFigure(c.f, c.g),
        };
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
  encompasses: [
    { topic: "vertical-translations-of-functions", weight: 0.2 },
    { topic: "stretches-of-absolute-value-graphs", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-vertical-stretch",
      title: t("Multiplying the y-coordinates", "纵坐标乘以系数"),
      explanation: t(
        "For $a > 0$, the graph of $y = a f(x)$ multiplies every output of $f$ by $a$, so the point $(x, y)$ moves to $(x, ay)$. Points on the $x$-axis stay where they are.\n\nIf $a > 1$ the graph is **stretched** vertically by a factor of $a$; if $0 < a < 1$ it is **compressed** by a factor of $a$. The point $(4, -6)$ on $f$ moves to $(4, -2)$ on $y = \\frac{1}{3}f(x)$.",
        "当 $a > 0$ 时，$y = a f(x)$ 把 $f$ 的每个输出乘以 $a$，所以点 $(x, y)$ 移到 $(x, ay)$。$x$ 轴上的点不动。\n\n$a > 1$ 时图象竖直方向**伸长**为原来的 $a$ 倍；$0 < a < 1$ 时竖直方向**压缩**为原来的 $a$。$f$ 上的点 $(4, -6)$ 移到 $y = \\frac{1}{3}f(x)$ 上的 $(4, -2)$。",
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
            `Multiply the $y$-coordinate by $${a.toLatex()}$ and keep the $x$-coordinate: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$.`,
            `纵坐标乘以 $${a.toLatex()}$，横坐标不变：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。`,
          ),
        );
      },
    },
    {
      id: "describing-vertical-stretches",
      title: t("Stretch or compression?", "伸长还是压缩？"),
      explanation: t(
        "In $y = a f(x)$ the factor multiplies the **output**, so the change is vertical. $y = 4f(x)$ is a vertical stretch by a factor of $4$; $y = \\frac{1}{4}f(x)$ is a vertical compression by a factor of $\\frac{1}{4}$. Neither changes any $x$-coordinate.",
        "在 $y = a f(x)$ 中系数乘的是**输出**，所以变化是竖直方向的。$y = 4f(x)$ 是竖直方向伸长为原来的 $4$ 倍；$y = \\frac{1}{4}f(x)$ 是竖直方向压缩为原来的 $\\frac{1}{4}$。两者都不改变横坐标。",
      ),
      generate(rng) {
        const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(6), Q.of(3, 2), Q.of(5, 2), Q.of(4, 3), Q.of(5, 3), Q.of(7, 2)]);
        const fn = rng.pick(["f", "g", "h"]);
        const a = rng.bool() ? c : Q.one.div(c);
        const o = stretchOptions(c);
        const correct = a.eq(c) ? o.vs : o.vc;
        const others = a.eq(c) ? [o.vc, o.hs, o.hc] : [o.vs, o.hc, o.hs];
        return shuffled(
          rng,
          t(
            `How is the graph of $y = ${front(a)}${fn}(x)$ obtained from the graph of $y = ${fn}(x)$?`,
            `$y = ${front(a)}${fn}(x)$ 的图象是怎样由 $y = ${fn}(x)$ 的图象得到的？`,
          ),
          [correct, ...others].map(capText),
          t(
            `The factor $${a.toLatex()}$ multiplies the outputs, so every $y$-coordinate is multiplied by $${a.toLatex()}$: ${correct.en}.`,
            `系数 $${a.toLatex()}$ 乘的是输出，所以每个纵坐标都乘以 $${a.toLatex()}$：${correct["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "vertical-stretches-from-graphs",
      title: t("Reading the factor from graphs", "从图象读出系数"),
      explanation: t(
        "To find $a$ in $g(x) = a f(x)$ from graphs, pick a point of $f$ off the $x$-axis and divide the $y$-coordinate of $g$ at the same $x$ by it. If $f(2) = 4$ and $g(2) = 2$, then $a = \\frac{2}{4} = \\frac{1}{2}$.",
        "要从图象求 $g(x) = a f(x)$ 中的 $a$，取 $f$ 上一个不在 $x$ 轴上的点，用同一个 $x$ 处 $g$ 的纵坐标除以它。若 $f(2) = 4$，$g(2) = 2$，则 $a = \\frac{2}{4} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const a = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2)]);
        const yStep = Number(a.d);
        const lim = Math.floor(7 / Number(a.n)) * yStep;
        const c = pairCase(rng, () => tf({ a }), { y: [-Math.min(lim, 6), Math.min(lim, 6)], yStep });
        const [x, y] = c.f.find(([, v]) => v !== 0)!;
        return {
          ...numberProblem({
            prompt: solidDashed("Given that $g(x) = a f(x)$, find $a$.", "已知 $g(x) = a f(x)$，求 $a$。"),
            answer: a,
            wrong: [Q.one.div(a), a.neg()],
            solution: t(
              `At $x = ${x}$, $f(${x}) = ${y}$ and $g(${x}) = ${a.mul(Q.of(y)).toLatex()}$, so $a = \\frac{${a.mul(Q.of(y)).toLatex()}}{${y}} = ${a.toLatex()}$.`,
              `在 $x = ${x}$ 处，$f(${x}) = ${y}$，$g(${x}) = ${a.mul(Q.of(y)).toLatex()}$，所以 $a = \\frac{${a.mul(Q.of(y)).toLatex()}}{${y}} = ${a.toLatex()}$。`,
            ),
          }),
          figure: graphFigure(c.f, c.g),
        };
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
  encompasses: [
    { topic: "vertical-stretches-of-functions", weight: 0.3 },
    { topic: "horizontal-translations-of-functions", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-stretch",
      title: t("Dividing the x-coordinates", "横坐标除以系数"),
      explanation: t(
        "For $b > 0$, the graph of $y = f(bx)$ reaches the output $f(p)$ when $bx = p$, that is at $x = \\frac{p}{b}$. So the point $(x, y)$ moves to $\\left(\\frac{x}{b}, y\\right)$: the $x$-coordinates are **divided** by $b$.\n\nThe point $(6, 1)$ on $f$ moves to $(3, 1)$ on $y = f(2x)$ and to $(12, 1)$ on $y = f\\left(\\frac{1}{2}x\\right)$.",
        "当 $b > 0$ 时，$y = f(bx)$ 在 $bx = p$，即 $x = \\frac{p}{b}$ 时取到输出 $f(p)$。所以点 $(x, y)$ 移到 $\\left(\\frac{x}{b}, y\\right)$：横坐标**除以** $b$。\n\n$f$ 上的点 $(6, 1)$ 移到 $y = f(2x)$ 上的 $(3, 1)$，移到 $y = f\\left(\\frac{1}{2}x\\right)$ 上的 $(12, 1)$。",
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
            `Divide the $x$-coordinate by $${b.toLatex()}$ and keep the $y$-coordinate: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$. Check: $${b.toLatex()} \\cdot ${paren(x)} = ${p[0].toLatex()}$.`,
            `横坐标除以 $${b.toLatex()}$，纵坐标不变：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。检验：$${b.toLatex()} \\cdot ${paren(x)} = ${p[0].toLatex()}$。`,
          ),
        );
      },
    },
    {
      id: "describing-horizontal-stretches",
      title: t("Stretch or compression?", "伸长还是压缩？"),
      explanation: t(
        "Because $y = f(bx)$ divides the $x$-coordinates by $b$, the factor of the horizontal change is $\\frac{1}{b}$:\n\n- $y = f(3x)$ is a horizontal **compression** by a factor of $\\frac{1}{3}$;\n- $y = f\\left(\\frac{1}{3}x\\right)$ is a horizontal **stretch** by a factor of $3$.\n\nThis is the opposite of what the factor of a vertical stretch suggests.",
        "因为 $y = f(bx)$ 把横坐标除以 $b$，水平方向变化的倍数是 $\\frac{1}{b}$：\n\n- $y = f(3x)$ 是水平方向**压缩**为原来的 $\\frac{1}{3}$；\n- $y = f\\left(\\frac{1}{3}x\\right)$ 是水平方向**伸长**为原来的 $3$ 倍。\n\n这与竖直伸缩的系数正好相反。",
      ),
      generate(rng) {
        const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(6), Q.of(3, 2), Q.of(5, 2), Q.of(4, 3), Q.of(5, 3), Q.of(7, 2)]);
        const fn = rng.pick(["f", "g", "h"]);
        const b = rng.bool() ? c : Q.one.div(c);
        const o = stretchOptions(c);
        const correct = b.eq(c) ? o.hc : o.hs;
        const others = b.eq(c) ? [o.hs, o.vs, o.vc] : [o.hc, o.vc, o.vs];
        return shuffled(
          rng,
          t(
            `How is the graph of $y = ${fn}(${front(b)}x)$ obtained from the graph of $y = ${fn}(x)$?`,
            `$y = ${fn}(${front(b)}x)$ 的图象是怎样由 $y = ${fn}(x)$ 的图象得到的？`,
          ),
          [correct, ...others].map(capText),
          t(
            `The factor $${b.toLatex()}$ multiplies the input, so every $x$-coordinate is divided by $${b.toLatex()}$, that is multiplied by $${Q.one.div(b).toLatex()}$: ${correct.en}.`,
            `系数 $${b.toLatex()}$ 乘的是输入，所以每个横坐标除以 $${b.toLatex()}$，即乘以 $${Q.one.div(b).toLatex()}$：${correct["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "equations-of-horizontal-stretches",
      title: t("Writing the new function", "写出新函数"),
      explanation: t(
        "A horizontal stretch by a factor of $s$ multiplies the $x$-coordinates by $s$, so it replaces $x$ with $\\frac{1}{s}x$. Stretching $f(x) = x^2 - 4x$ horizontally by a factor of $2$ gives\n\n$$g(x) = f\\left(\\tfrac{1}{2}x\\right) = \\tfrac{1}{4}x^2 - 2x,$$\n\nand compressing it by a factor of $\\frac{1}{2}$ gives $g(x) = f(2x) = 4x^2 - 8x$.",
        "水平方向伸长为原来的 $s$ 倍，就是把横坐标乘以 $s$，也就是把 $x$ 换成 $\\frac{1}{s}x$。把 $f(x) = x^2 - 4x$ 水平方向伸长为原来的 $2$ 倍得到\n\n$$g(x) = f\\left(\\tfrac{1}{2}x\\right) = \\tfrac{1}{4}x^2 - 2x,$$\n\n水平方向压缩为原来的 $\\frac{1}{2}$ 得到 $g(x) = f(2x) = 4x^2 - 8x$。",
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
            `The $x$-coordinates are multiplied by $${s.toLatex()}$, so replace $x$ with $${front(b)}x$:${steps(`g(x) = f(${front(b)}x) = ${answer}`)}`,
            `横坐标乘以 $${s.toLatex()}$，所以把 $x$ 换成 $${front(b)}x$：${steps(`g(x) = f(${front(b)}x) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "horizontal-stretches-from-graphs",
      title: t("Reading the factor from graphs", "从图象读出系数"),
      explanation: t(
        "To find $b$ in $g(x) = f(bx)$ from graphs, match a point of $f$ off the $y$-axis, such as an endpoint, with the corresponding point of $g$: $b$ is the $x$-coordinate on $f$ divided by the one on $g$. If the right endpoint of $f$ is $(4, 2)$ and that of $g$ is $(2, 2)$, then $b = \\frac{4}{2} = 2$.",
        "要从图象求 $g(x) = f(bx)$ 中的 $b$，把 $f$ 上一个不在 $y$ 轴上的点（例如端点）与 $g$ 上的对应点配对：$b$ 等于 $f$ 上的横坐标除以 $g$ 上的横坐标。若 $f$ 的右端点是 $(4, 2)$、$g$ 的右端点是 $(2, 2)$，则 $b = \\frac{4}{2} = 2$。",
      ),
      generate(rng) {
        const b = rng.pick([Q.of(2), Q.of(1, 2), Q.of(3), Q.of(1, 3)]);
        const xStep = Number(b.n);
        const lim = Math.floor(7 / Number(b.d)) * xStep;
        const c = pairCase(rng, () => tf({ b }), { x: [-Math.min(lim, 6), Math.min(lim, 6)], xStep });
        const [x, y] = c.f[0]![0] !== 0 ? c.f[0]! : c.f[c.f.length - 1]!;
        const u = Q.of(x).div(b);
        return {
          ...numberProblem({
            prompt: solidDashed("Given that $g(x) = f(bx)$, find $b$.", "已知 $g(x) = f(bx)$，求 $b$。"),
            answer: b,
            wrong: [Q.one.div(b), b.neg()],
            solution: t(
              `The point $${pt(x, y)}$ of $f$ corresponds to $${pt(u, y)}$ on $g$, so $b = \\frac{${x}}{${u.toLatex()}} = ${b.toLatex()}$.`,
              `$f$ 上的点 $${pt(x, y)}$ 对应 $g$ 上的 $${pt(u, y)}$，所以 $b = \\frac{${x}}{${u.toLatex()}} = ${b.toLatex()}$。`,
            ),
          }),
          figure: graphFigure(c.f, c.g),
        };
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
  knowledgePoints: [
    {
      id: "points-under-two-transformations",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        "Apply the changes to a point one coordinate at a time. In $y = a f(x - h) + k$ the $x$-coordinate gains $h$, and the $y$-coordinate is multiplied by $a$ and **then** gains $k$.\n\nThe point $(1, 4)$ on $f$ moves to $(1, 2 \\cdot 4 - 3) = (1, 5)$ on $y = 2f(x) - 3$, and to $(1 - 1, 4 + 6) = (0, 10)$ on $y = f(x + 1) + 6$.",
        "对一个点逐个坐标地进行变化。在 $y = a f(x - h) + k$ 中，横坐标加上 $h$；纵坐标先乘以 $a$，**再**加上 $k$。\n\n$f$ 上的点 $(1, 4)$ 移到 $y = 2f(x) - 3$ 上的 $(1, 2 \\cdot 4 - 3) = (1, 5)$，移到 $y = f(x + 1) + 6$ 上的 $(1 - 1, 4 + 6) = (0, 10)$。",
      ),
      generate(rng) {
        const g = compose(twoOps(rng));
        const p: [Q, Q] = [Q.of(rng.int(-6, 6)).mul(Q.of(g.b.n)), Q.of(rng.int(-6, 6)).mul(Q.of(g.a.d))];
        const [x, y] = mapPoint(g, p);
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
            `The $x$-coordinate: $${p[0].toLatex()}${g.b.eq(Q.one) ? "" : ` \\div ${paren(g.b)}`}${plus(g.h)} = ${x.toLatex()}$. The $y$-coordinate: $${g.a.eq(Q.one) ? "" : `${g.a.toLatex()} \\cdot `}${paren(p[1])}${plus(g.k)} = ${y.toLatex()}$. The point is $${pt(x, y)}$.`,
            `横坐标：$${p[0].toLatex()}${g.b.eq(Q.one) ? "" : ` \\div ${paren(g.b)}`}${plus(g.h)} = ${x.toLatex()}$。纵坐标：$${g.a.eq(Q.one) ? "" : `${g.a.toLatex()} \\cdot `}${paren(p[1])}${plus(g.k)} = ${y.toLatex()}$。所以这个点是 $${pt(x, y)}$。`,
          ),
        );
      },
    },
    {
      id: "the-order-of-two-transformations",
      title: t("The order of the operations", "变换的顺序"),
      explanation: t(
        "The order matters when two operations act in the same direction. Stretching vertically by $2$ and then shifting up $3$ gives $y = 2f(x) + 3$; shifting up $3$ first and then stretching gives $y = 2(f(x) + 3) = 2f(x) + 6$, since the stretch doubles the shift too.\n\nHorizontally, shifting right $1$ and then compressing by a factor of $\\frac{1}{2}$ replaces $x$ with $x - 1$ and then $x$ with $2x$: $y = f(2x - 1) = f\\left(2\\left(x - \\frac{1}{2}\\right)\\right)$. Compressing first gives $y = f(2(x - 1))$.",
        "当两个变换作用在同一方向时，顺序会影响结果。先竖直伸长为原来的 $2$ 倍再向上平移 $3$ 得到 $y = 2f(x) + 3$；先向上平移 $3$ 再伸长得到 $y = 2(f(x) + 3) = 2f(x) + 6$，因为伸长把平移量也变成了 $2$ 倍。\n\n水平方向，先向右平移 $1$ 再压缩为原来的 $\\frac{1}{2}$：先把 $x$ 换成 $x - 1$，再把 $x$ 换成 $2x$，得到 $y = f(2x - 1) = f\\left(2\\left(x - \\frac{1}{2}\\right)\\right)$。先压缩则得到 $y = f(2(x - 1))$。",
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
        return shuffled(
          rng,
          t(
            `The graph of $g$ is obtained from the graph of $f$ as follows. ${opsText(ops).en} Which is $g(x)$?`,
            `$f$ 的图象按以下方式变换得到 $g$ 的图象：${opsText(ops)["zh-CN"]}$g(x)$ 是哪一个？`,
          ),
          candidates.map((c) => same(`$g(x) = ${tfLatex(c)}$`)),
          t(
            `Apply the operations in order, starting from $f(x)$: the result is $g(x) = ${tfLatex(g)}$.`,
            `从 $f(x)$ 出发按顺序进行变换，结果是 $g(x) = ${tfLatex(g)}$。`,
          ),
        );
      },
    },
    {
      id: "two-transformations-from-graphs",
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        "To recognize a combined transformation from graphs, compare matching points, such as the endpoints: a change in width or height means a stretch, and where the points end up gives the shifts. Then check the formula with one point.",
        "要从图象识别组合变换，就比较对应点（例如端点）：宽度或高度改变说明有伸缩，点最终的位置给出平移量。最后用一个点检验解析式。",
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
        return {
          ...shuffled(
            rng,
            solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
            [g, ...rng.shuffle(wrong).slice(0, 3)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
            t(
              `For $g(x) = ${tfLatex(g)}$, the left endpoint $${pt(x, y)}$ of $f$ moves to $${pt(u, v)}$, which is the left endpoint of the dashed graph; the other points match too.`,
              `对于 $g(x) = ${tfLatex(g)}$，$f$ 的左端点 $${pt(x, y)}$ 移到 $${pt(u, v)}$，正是虚线的左端点；其他点也都对应。`,
            ),
          ),
          figure: graphFigure(c.f, c.g),
        };
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
  knowledgePoints: [
    {
      id: "describing-several-transformations",
      title: t("Describing the transformations", "描述变换"),
      explanation: t(
        "The graph of $y = a f(b(x - h)) + k$ (with $a, b > 0$) comes from the graph of $f$ in this order:\n\n1. horizontally, stretch by the factor $\\frac{1}{b}$, then shift right by $h$;\n2. vertically, stretch by the factor $a$, then shift up by $k$.\n\nFor $y = 3f(2(x + 1)) - 4$: compress horizontally by $\\frac{1}{2}$, shift left $1$, stretch vertically by $3$, shift down $4$. If the argument is written as $2x + 2$, factor it first: $2x + 2 = 2(x + 1)$.",
        "$y = a f(b(x - h)) + k$（$a, b > 0$）的图象由 $f$ 的图象按以下顺序得到：\n\n1. 水平方向：伸缩为原来的 $\\frac{1}{b}$，再向右平移 $h$；\n2. 竖直方向：伸缩为原来的 $a$ 倍，再向上平移 $k$。\n\n对于 $y = 3f(2(x + 1)) - 4$：水平方向压缩为原来的 $\\frac{1}{2}$，向左平移 $1$，竖直方向伸长为原来的 $3$ 倍，向下平移 $4$。如果自变量写成 $2x + 2$，先提取公因数：$2x + 2 = 2(x + 1)$。",
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
        return shuffled(
          rng,
          t(
            `Which sequence of transformations takes the graph of $y = f(x)$ to the graph of $y = ${tfLatex(g)}$?`,
            `哪一组变换把 $y = f(x)$ 的图象变成 $y = ${tfLatex(g)}$ 的图象？`,
          ),
          candidates.map((c) => opsText(standardOps(c))),
          t(
            `Here $a = ${g.a.toLatex()}$, $b = ${g.b.toLatex()}$, $h = ${g.h.toLatex()}$ and $k = ${g.k.toLatex()}$. ${opsText(standardOps(g)).en}`,
            `这里 $a = ${g.a.toLatex()}$，$b = ${g.b.toLatex()}$，$h = ${g.h.toLatex()}$，$k = ${g.k.toLatex()}$。${opsText(standardOps(g))["zh-CN"]}`,
          ),
        );
      },
    },
    {
      id: "points-under-several-transformations",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        "For $y = a f(b(x - h)) + k$, the point $(x, y)$ of $f$ moves to\n\n$$\\left(\\frac{x}{b} + h,\\ ay + k\\right).$$\n\nFor $y = 3f(2(x + 1)) - 4$, the point $(6, 2)$ moves to $\\left(\\frac{6}{2} - 1,\\ 3 \\cdot 2 - 4\\right) = (2, 2)$.",
        "对于 $y = a f(b(x - h)) + k$，$f$ 上的点 $(x, y)$ 移到\n\n$$\\left(\\frac{x}{b} + h,\\ ay + k\\right)。$$\n\n对于 $y = 3f(2(x + 1)) - 4$，点 $(6, 2)$ 移到 $\\left(\\frac{6}{2} - 1,\\ 3 \\cdot 2 - 4\\right) = (2, 2)$。",
      ),
      generate(rng) {
        const g = threeTf(rng);
        const p: [Q, Q] = [Q.of(rng.int(-5, 5)).mul(Q.of(g.b.n)), Q.of(rng.int(-5, 5)).mul(Q.of(g.a.d))];
        const [x, y] = mapPoint(g, p);
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
            `$$\\left(\\frac{${p[0].toLatex()}}{${g.b.toLatex()}}${plus(g.h)},\\ ${g.a.toLatex()} \\cdot ${paren(p[1])}${plus(g.k)}\\right) = ${pt(x, y)}$$`,
            `$$\\left(\\frac{${p[0].toLatex()}}{${g.b.toLatex()}}${plus(g.h)},\\ ${g.a.toLatex()} \\cdot ${paren(p[1])}${plus(g.k)}\\right) = ${pt(x, y)}$$`,
          ),
        );
      },
    },
    {
      id: "several-transformations-from-graphs",
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        "To match a graph with $y = a f(b(x - h)) + k$, compare the width and height of the two graphs to find $b$ and $a$, then compare matching endpoints to find the shifts. Check the formula by moving one point of $f$ and seeing that it lands on $g$.",
        "要把图象与 $y = a f(b(x - h)) + k$ 对应，先比较两个图象的宽度和高度，求出 $b$ 和 $a$，再比较对应端点求出平移量。最后把 $f$ 上的一个点按公式移动，看它是否落在 $g$ 上。",
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
        return {
          ...shuffled(
            rng,
            solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
            [g, ...rng.shuffle(wrong).slice(0, 3)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
            t(
              `For $g(x) = ${tfLatex(g)}$, the right endpoint $${pt(x, y)}$ of $f$ moves to $${pt(u, v)}$, which is the right endpoint of the dashed graph; the other points match too.`,
              `对于 $g(x) = ${tfLatex(g)}$，$f$ 的右端点 $${pt(x, y)}$ 移到 $${pt(u, v)}$，正是虚线的右端点；其他点也都对应。`,
            ),
          ),
          figure: graphFigure(c.f, c.g),
        };
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
  encompasses: [
    { topic: "combining-graph-transformations-three-or-more-operations", weight: 0.5 },
    { topic: "function-composition", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.BF.A.1"],
  knowledgePoints: [
    {
      id: "transforming-basic-functions",
      title: t("Transforming basic functions", "变换基本函数"),
      explanation: t(
        "Build the formula one operation at a time, in the order given:\n\n- shifting right $h$ replaces $x$ with $x - h$;\n- stretching vertically by $a$ multiplies the **whole** current formula by $a$;\n- shifting up $k$ adds $k$ to the whole formula.\n\nStarting from $y = \\sqrt{x}$: shift up $1$ gives $y = \\sqrt{x} + 1$; then stretch vertically by $3$ gives $y = 3(\\sqrt{x} + 1) = 3\\sqrt{x} + 3$; then shift left $2$ gives $y = 3\\sqrt{x + 2} + 3$.",
        "按给定顺序一步一步地写出解析式：\n\n- 向右平移 $h$：把 $x$ 换成 $x - h$；\n- 竖直方向伸缩为原来的 $a$ 倍：把**整个**当前解析式乘以 $a$；\n- 向上平移 $k$：给整个解析式加上 $k$。\n\n从 $y = \\sqrt{x}$ 出发：向上平移 $1$ 得 $y = \\sqrt{x} + 1$；再竖直伸长为原来的 $3$ 倍得 $y = 3(\\sqrt{x} + 1) = 3\\sqrt{x} + 3$；再向左平移 $2$ 得 $y = 3\\sqrt{x + 2} + 3$。",
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
            `Apply the operations in order: the $x$-shift gives $x${plus(g.h.neg())}$ inside, and the vertical operations give the factor $${g.a.toLatex()}$ and the constant $${g.k.toLatex()}$. So $y = ${answer}$.`,
            `按顺序进行变换：水平平移使函数内部变成 $x${plus(g.h.neg())}$，竖直方向的变换得到系数 $${g.a.toLatex()}$ 和常数 $${g.k.toLatex()}$。所以 $y = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "transforming-a-given-function",
      title: t("Transforming a given function", "变换给定的函数"),
      explanation: t(
        "To transform a function given by a formula, write the transformation in function notation first, then substitute. Let $f(x) = x^2 - 2x$. Stretching vertically by $2$, then shifting right $1$ and down $3$ gives\n\n$$g(x) = 2f(x - 1) - 3 = 2\\left((x - 1)^2 - 2(x - 1)\\right) - 3 = 2x^2 - 8x + 3.$$",
        "要变换由解析式给出的函数，先用函数记号写出变换，再代入。设 $f(x) = x^2 - 2x$。竖直伸长为原来的 $2$ 倍，再向右平移 $1$、向下平移 $3$ 得到\n\n$$g(x) = 2f(x - 1) - 3 = 2\\left((x - 1)^2 - 2(x - 1)\\right) - 3 = 2x^2 - 8x + 3。$$",
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const ops = [vertical(rng.pick([Q.of(2), Q.of(3), Q.of(1, 2)])), right(rng.nonZero(-4, 4)), up(rng.nonZero(-6, 6))];
        const g = compose(ops);
        const answer = tfPoly(f, g);
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
            `In function notation, $g(x) = ${tfLatex(g)}$. Substitute and simplify:${steps(`g(x) = ${answer}`)}`,
            `用函数记号表示，$g(x) = ${tfLatex(g)}$。代入并化简：${steps(`g(x) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "equations-of-transformed-graphs",
      title: t("Equations from graphs", "由图象写解析式"),
      explanation: t(
        "A transformed basic graph $y = a\\,P(x - h) + k$ has its key point, the vertex or starting point, at $(h, k)$. To find $a$, go one unit right of it: a basic graph that rises $1$ there rises $a$ after the stretch.\n\nIf a transformation of $y = \\sqrt{x}$ starts at $(-2, 1)$ and passes through $(-1, 3)$, then $a = 3 - 1 = 2$ and $y = 2\\sqrt{x + 2} + 1$.",
        "变换后的基本函数图象 $y = a\\,P(x - h) + k$ 的关键点（顶点或起点）在 $(h, k)$。求 $a$ 时，从关键点向右走一个单位：原来上升 $1$ 的地方，伸缩后上升 $a$。\n\n如果 $y = \\sqrt{x}$ 的某个变换图象从 $(-2, 1)$ 出发并经过 $(-1, 3)$，则 $a = 3 - 1 = 2$，$y = 2\\sqrt{x + 2} + 1$。",
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
        return {
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
              `The key point is $${pt(h, k)}$, and one unit to its right the graph is at $${pt(h + 1, k + an)}$, a change of $${an}$, so $a = ${an}$ and $y = ${answer}$.`,
              `关键点是 $${pt(h, k)}$，向右一个单位处图象在 $${pt(h + 1, k + an)}$，变化了 $${an}$，所以 $a = ${an}$，$y = ${answer}$。`,
            ),
          }),
          figure: {
            svg: plane(view, marks),
            alt: t(
              `A transformation of the graph of ${p.name.en}, with its key point at ${pt(h, k)} and passing through ${pt(h + 1, k + an)}.`,
              `${p.name["zh-CN"]} 的图象经过变换得到的图象，关键点为 ${pt(h, k)}，并经过 ${pt(h + 1, k + an)}。`,
            ),
          },
        };
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
  encompasses: [
    { topic: "vertical-reflections-of-absolute-value-graphs", weight: 0.3 },
    { topic: "vertical-reflections-of-quadratic-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-vertical-reflection",
      title: t("Reflecting points", "翻折点"),
      explanation: t(
        "The graph of $y = -f(x)$ takes the opposite of every output of $f$, so the point $(x, y)$ moves to $(x, -y)$: the graph is reflected in the $x$-axis. Points on the $x$-axis, the roots, stay where they are.\n\nThe point $(3, -5)$ on $f$ moves to $(3, 5)$ on $y = -f(x)$.",
        "$y = -f(x)$ 取 $f$ 的每个输出的相反数，所以点 $(x, y)$ 移到 $(x, -y)$：图象关于 $x$ 轴翻折。$x$ 轴上的点（零点）不动。\n\n$f$ 上的点 $(3, -5)$ 移到 $y = -f(x)$ 上的 $(3, 5)$。",
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
            `Change the sign of the $y$-coordinate and keep the $x$-coordinate: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$.`,
            `纵坐标变号，横坐标不变：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。`,
          ),
        );
      },
    },
    {
      id: "equations-of-vertical-reflections",
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        "To reflect the graph of $f$ in the $x$-axis, take the opposite of the **whole** function: every term changes sign. For $f(x) = x^2 - 3x + 2$,\n\n$$-f(x) = -(x^2 - 3x + 2) = -x^2 + 3x - 2.$$",
        "要把 $f$ 的图象关于 $x$ 轴翻折，就取**整个**函数的相反数：每一项都变号。对于 $f(x) = x^2 - 3x + 2$，\n\n$$-f(x) = -(x^2 - 3x + 2) = -x^2 + 3x - 2。$$",
      ),
      generate(rng) {
        const f = randomQuadratic(rng);
        const answer = tfPoly(f, tf({ a: -1 }));
        const leadOnly = f.map((c, i) => (i === f.length - 1 ? c.neg() : c));
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the reflection of the graph of $f$ in the $x$-axis. Find $g(x)$.`,
            `设 ${fIs(f)}。$g$ 的图象是 $f$ 的图象关于 $x$ 轴翻折得到的。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [pLatex(leadOnly), tfPoly(f, tf({ b: -1 })), tfPoly(f, tf({ a: -1, b: -1 }))],
          solution: t(`$$g(x) = -f(x) = -(${pLatex(f)}) = ${answer}$$`, `$$g(x) = -f(x) = -(${pLatex(f)}) = ${answer}$$`),
        });
      },
    },
    {
      id: "vertical-reflections-from-graphs",
      title: t("Values of the reflected function", "翻折后函数的值"),
      explanation: t(
        "To find a value of $g(x) = -f(x)$ from the graph of $f$, read $f$ at the same input and change the sign. If the graph of $f$ passes through $(2, -3)$, then $g(2) = -(-3) = 3$.",
        "要从 $f$ 的图象求 $g(x) = -f(x)$ 的值，就在同一个输入处读出 $f$ 的值再变号。若 $f$ 的图象经过 $(2, -3)$，则 $g(2) = -(-3) = 3$。",
      ),
      generate(rng) {
        const f = randomGraph(rng, -6, 6, -6, 6);
        const vs = f.filter(([, y]) => y !== 0);
        const [x, y] = vs.length ? rng.pick(vs) : f[0]!;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ is shown. Let $g(x) = -f(x)$. Find $g(${x})$.`,
              `下图是 $f$ 的图象。设 $g(x) = -f(x)$。求 $g(${x})$。`,
            ),
            answer: -y,
            wrong: [y, ...(valueOn(f, -x) ? [valueOn(f, -x)!, valueOn(f, -x)!.neg()] : [])],
            solution: t(
              `From the graph, $f(${x}) = ${y}$, so $g(${x}) = -${paren(y)} = ${-y}$.`,
              `由图象，$f(${x}) = ${y}$，所以 $g(${x}) = -${paren(y)} = ${-y}$。`,
            ),
          }),
          figure: graphFigure(f),
        };
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
  encompasses: [
    { topic: "vertical-reflections-of-functions", weight: 0.3 },
    { topic: "horizontal-translations-of-functions", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "points-under-a-horizontal-reflection",
      title: t("Reflecting points", "翻折点"),
      explanation: t(
        "The graph of $y = f(-x)$ reaches the output $f(p)$ at $x = -p$, so the point $(x, y)$ moves to $(-x, y)$: the graph is reflected in the $y$-axis. The $y$-intercept stays where it is.\n\nThe point $(4, 1)$ on $f$ moves to $(-4, 1)$ on $y = f(-x)$.",
        "$y = f(-x)$ 在 $x = -p$ 处取到输出 $f(p)$，所以点 $(x, y)$ 移到 $(-x, y)$：图象关于 $y$ 轴翻折。$y$ 轴截距不动。\n\n$f$ 上的点 $(4, 1)$ 移到 $y = f(-x)$ 上的 $(-4, 1)$。",
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
            `Change the sign of the $x$-coordinate and keep the $y$-coordinate: $${pt(p[0], p[1])}$ moves to $${pt(x, y)}$.`,
            `横坐标变号，纵坐标不变：$${pt(p[0], p[1])}$ 移到 $${pt(x, y)}$。`,
          ),
        );
      },
    },
    {
      id: "equations-of-horizontal-reflections",
      title: t("Writing the reflected function", "写出翻折后的函数"),
      explanation: t(
        "To reflect the graph of $f$ in the $y$-axis, replace every $x$ with $-x$. Even powers of $-x$ equal those of $x$, while odd powers change sign. For $f(x) = 2x^2 + 5x - 1$,\n\n$$f(-x) = 2(-x)^2 + 5(-x) - 1 = 2x^2 - 5x - 1.$$",
        "要把 $f$ 的图象关于 $y$ 轴翻折，就把每个 $x$ 换成 $-x$。$-x$ 的偶次幂等于 $x$ 的偶次幂，奇次幂则变号。对于 $f(x) = 2x^2 + 5x - 1$，\n\n$$f(-x) = 2(-x)^2 + 5(-x) - 1 = 2x^2 - 5x - 1。$$",
      ),
      generate(rng) {
        const cubic = rng.bool(0.4);
        const f: QPoly = cubic
          ? [rng.nonZero(-9, 9), rng.nonZero(-6, 6), rng.int(-4, 4), rng.pick([1, -1, 2, -2])].map((n) => Q.of(n))
          : randomQuadratic(rng);
        const answer = tfPoly(f, tf({ b: -1 }));
        return expressionProblem({
          prompt: t(
            `Let ${fIs(f)}. The graph of $g$ is the reflection of the graph of $f$ in the $y$-axis. Find $g(x)$.`,
            `设 ${fIs(f)}。$g$ 的图象是 $f$ 的图象关于 $y$ 轴翻折得到的。求 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [tfPoly(f, tf({ a: -1 })), tfPoly(f, tf({ a: -1, b: -1 })), pLatex(f.map((c, i) => (i === f.length - 1 ? c.neg() : c)))],
          solution: t(
            `Replace $x$ with $-x$: the odd powers of $x$ change sign and the even powers do not.${steps(`g(x) = f(-x) = ${answer}`)}`,
            `把 $x$ 换成 $-x$：$x$ 的奇次幂变号，偶次幂不变。${steps(`g(x) = f(-x) = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "recognizing-reflections",
      title: t("Recognizing reflections", "识别翻折"),
      explanation: t(
        "Compare matching points. In a reflection in the $x$-axis, $y = -f(x)$, each point keeps its $x$-coordinate and the graph flips upside down. In a reflection in the $y$-axis, $y = f(-x)$, each point keeps its $y$-coordinate and the graph flips left to right. Doing both, $y = -f(-x)$, sends $(x, y)$ to $(-x, -y)$.",
        "比较对应点。关于 $x$ 轴翻折 $y = -f(x)$：每个点横坐标不变，图象上下颠倒。关于 $y$ 轴翻折 $y = f(-x)$：每个点纵坐标不变，图象左右颠倒。两者都做 $y = -f(-x)$：把 $(x, y)$ 变成 $(-x, -y)$。",
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
          const [u, v] = mapPoint(g, [Q.of(x), Q.of(y)]);
          return {
            ...shuffled(
              rng,
              solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
              [g, ...all.filter((w) => w !== g)].map((w) => same(`$g(x) = ${tfLatex(w)}$`)),
              t(
                `The point $${pt(x, y)}$ of $f$ corresponds to $${pt(u, v)}$ on $g$, so $g(x) = ${tfLatex(g)}$.`,
                `$f$ 上的点 $${pt(x, y)}$ 对应 $g$ 上的 $${pt(u, v)}$，所以 $g(x) = ${tfLatex(g)}$。`,
              ),
            ),
            figure: graphFigure(f, image),
          };
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
  knowledgePoints: [
    {
      id: "points-under-reflections-and-shifts",
      title: t("Following a point", "追踪一个点"),
      explanation: t(
        "A negative factor in front of $f$ changes the sign of $y$ before the vertical shift; a negative factor on $x$ changes the sign of $x$. To follow a point into $y = f(h - x)$, ask which $x$ gives the input $p$: $h - x = p$, so $x = h - p$.\n\nThe point $(1, 4)$ on $f$ moves to $(1, -4 + 2) = (1, -2)$ on $y = -f(x) + 2$, and to $(3 - 1, 4) = (2, 4)$ on $y = f(3 - x)$.",
        "$f$ 前面的负号在竖直平移之前改变 $y$ 的符号；$x$ 前面的负号改变 $x$ 的符号。要追踪点到 $y = f(h - x)$ 上，问哪个 $x$ 使输入为 $p$：$h - x = p$，所以 $x = h - p$。\n\n$f$ 上的点 $(1, 4)$ 移到 $y = -f(x) + 2$ 上的 $(1, -4 + 2) = (1, -2)$，移到 $y = f(3 - x)$ 上的 $(3 - 1, 4) = (2, 4)$。",
      ),
      generate(rng) {
        const p = randomPoint(rng);
        const kind = rng.int(0, 2);
        const c = rng.nonZero(-6, 6);
        const a = rng.pick([Q.one, Q.of(2), Q.of(3)]);
        const g = kind === 0 ? tf({ a: a.neg(), k: c }) : kind === 1 ? tf({ b: -1, h: c }) : tf({ a: -1, b: -1, k: c });
        const written = kind === 1 ? `f(${linear(-1, c)})` : tfLatex(g);
        const [x, y] = mapPoint(g, p);
        return imageProblem(
          p,
          g,
          [
            { ...g, h: g.h.neg() },
            { ...g, k: g.k.neg() },
            { ...g, a: g.a.neg() },
            { ...g, b: g.b.neg() },
          ],
          kind === 1
            ? t(
                `The input of $f$ is $${linear(-1, c)}$. It equals $${p[0].toLatex()}$ when $x = ${c}${plus(p[0].neg())} = ${x.toLatex()}$, and the output is unchanged, so the point is $${pt(x, y)}$.`,
                `$f$ 的输入是 $${linear(-1, c)}$。当 $x = ${c}${plus(p[0].neg())} = ${x.toLatex()}$ 时它等于 $${p[0].toLatex()}$，输出不变，所以这个点是 $${pt(x, y)}$。`,
              )
            : t(
                `The $x$-coordinate becomes $${x.toLatex()}$ and the $y$-coordinate becomes $${g.a.toLatex()} \\cdot ${paren(p[1])}${plus(g.k)} = ${y.toLatex()}$, so the point is $${pt(x, y)}$.`,
                `横坐标变为 $${x.toLatex()}$，纵坐标变为 $${g.a.toLatex()} \\cdot ${paren(p[1])}${plus(g.k)} = ${y.toLatex()}$，所以这个点是 $${pt(x, y)}$。`,
              ),
          written,
        );
      },
    },
    {
      id: "the-order-of-reflections-and-shifts",
      title: t("The order of the operations", "变换的顺序"),
      explanation: t(
        "A reflection also reflects any shift made before it.\n\n- Reflect in the $x$-axis, then shift up $3$: $y = -f(x) + 3$. Shift up $3$ first, then reflect: $y = -(f(x) + 3) = -f(x) - 3$.\n- Reflect in the $y$-axis, then shift right $2$: replace $x$ with $-x$, then $x$ with $x - 2$: $y = f(-(x - 2)) = f(2 - x)$. Shift right $2$ first, then reflect: $y = f(-x - 2)$.",
        "翻折也会翻折在它之前所做的平移。\n\n- 先关于 $x$ 轴翻折，再向上平移 $3$：$y = -f(x) + 3$。先向上平移 $3$ 再翻折：$y = -(f(x) + 3) = -f(x) - 3$。\n- 先关于 $y$ 轴翻折，再向右平移 $2$：先把 $x$ 换成 $-x$，再把 $x$ 换成 $x - 2$：$y = f(-(x - 2)) = f(2 - x)$。先向右平移 $2$ 再翻折：$y = f(-x - 2)$。",
      ),
      generate(rng) {
        const ops = reflectOps(rng);
        const g = compose(ops);
        const rev = compose([...ops].reverse());
        const flipA = { ...g, a: g.a.neg() };
        const flipB = { ...g, b: g.b.neg() };
        const write = (w: Tf) => same(`$g(x) = ${linLatex(w.a, w.b, w.b.mul(w.h).neg(), w.k)}$`);
        return shuffled(
          rng,
          t(
            `The graph of $g$ is obtained from the graph of $f$ as follows. ${opsText(ops).en} Which is $g(x)$?`,
            `$f$ 的图象按以下方式变换得到 $g$ 的图象：${opsText(ops)["zh-CN"]}$g(x)$ 是哪一个？`,
          ),
          [g, rev, { ...g, h: g.h.neg(), k: g.k.neg() }, flipA, flipB, { ...rev, h: rev.h.neg(), k: rev.k.neg() }].map(write),
          t(
            `Apply the operations in order, starting from $f(x)$: the result is $g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}$.`,
            `从 $f(x)$ 出发按顺序进行变换，结果是 $g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}$。`,
          ),
        );
      },
    },
    {
      id: "reflections-and-shifts-from-graphs",
      title: t("Recognizing the transformations", "识别变换"),
      explanation: t(
        "First decide which reflection happened: if the graph is upside down, $f$ has a negative factor in front; if it is reversed left to right, $x$ has a negative factor. Then use a matching endpoint to find the shift, and check another point.",
        "先判断发生了哪种翻折：图象上下颠倒，则 $f$ 前有负号；左右颠倒，则 $x$ 前有负号。再用一对对应端点求平移量，并检验另一个点。",
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
        return {
          ...shuffled(
            rng,
            solidDashed("Which is $g(x)$?", "$g(x)$ 是哪一个？"),
            [g, ...rng.shuffle(wrong).slice(0, 3)].map(write),
            t(
              `The left endpoint $${pt(x, y)}$ of $f$ moves to $${pt(u, v)}$ under $g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}$, an endpoint of the dashed graph; the other points match too.`,
              `在 $g(x) = ${linLatex(g.a, g.b, g.b.mul(g.h).neg(), g.k)}$ 下，$f$ 的左端点 $${pt(x, y)}$ 移到 $${pt(u, v)}$，正是虚线的一个端点；其他点也都对应。`,
            ),
          ),
          figure: graphFigure(c.f, c.g),
        };
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
  encompasses: [{ topic: "combining-reflections-with-other-graph-transformations", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "forward-to-the-transformed-curve",
      title: t("From f to the transformed curve", "从 f 到变换后的曲线"),
      explanation: t(
        "To move the point $(p, q)$ of $f$ onto $y = a f(bx + c) + d$, solve for the $x$ that makes the input equal $p$, then compute the output:\n\n$$bx + c = p, \\qquad y = a q + d.$$\n\nFor $(4, 3)$ and $y = -2f(2x - 6) + 1$: $2x - 6 = 4$ gives $x = 5$, and $y = -2 \\cdot 3 + 1 = -5$, so the point is $(5, -5)$.",
        "要把 $f$ 上的点 $(p, q)$ 移到 $y = a f(bx + c) + d$ 上，先求使输入等于 $p$ 的 $x$，再计算输出：\n\n$$bx + c = p, \\qquad y = a q + d。$$\n\n对于 $(4, 3)$ 和 $y = -2f(2x - 6) + 1$：由 $2x - 6 = 4$ 得 $x = 5$，$y = -2 \\cdot 3 + 1 = -5$，所以这个点是 $(5, -5)$。",
      ),
      generate(rng) {
        const l = randomLin(rng);
        const g = linTf(l);
        const p = randomPoint(rng);
        const [x, y] = mapPoint(g, p);
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
            `Solve $${linear(l.b, l.c)} = ${p[0].toLatex()}$: $x = ${x.toLatex()}$. Then $y = ${l.a.toLatex()} \\cdot ${paren(p[1])}${plus(l.d)} = ${y.toLatex()}$. The point is $${pt(x, y)}$.`,
            `解 $${linear(l.b, l.c)} = ${p[0].toLatex()}$：$x = ${x.toLatex()}$。再算 $y = ${l.a.toLatex()} \\cdot ${paren(p[1])}${plus(l.d)} = ${y.toLatex()}$。所以这个点是 $${pt(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "back-to-the-original-curve",
      title: t("From the transformed curve back to f", "从变换后的曲线回到 f"),
      explanation: t(
        "If $(u, v)$ lies on $y = a f(bx + c) + d$, then $v = a f(bu + c) + d$. So $f$ takes the input $bu + c$ to the output $\\frac{v - d}{a}$, and the point\n\n$$\\left(bu + c,\\ \\frac{v - d}{a}\\right)$$\n\nlies on the graph of $f$. For $(5, -5)$ on $y = -2f(2x - 6) + 1$: $(2 \\cdot 5 - 6, \\frac{-5 - 1}{-2}) = (4, 3)$.",
        "若 $(u, v)$ 在 $y = a f(bx + c) + d$ 上，则 $v = a f(bu + c) + d$。所以 $f$ 把输入 $bu + c$ 变成输出 $\\frac{v - d}{a}$，点\n\n$$\\left(bu + c,\\ \\frac{v - d}{a}\\right)$$\n\n在 $f$ 的图象上。对于 $y = -2f(2x - 6) + 1$ 上的 $(5, -5)$：$(2 \\cdot 5 - 6, \\frac{-5 - 1}{-2}) = (4, 3)$。",
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
            `Here $${pt(u, v)}$ means $${v.toLatex()} = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${x.toLatex()})`)}$, so $f(${x.toLatex()}) = \\frac{${v.toLatex()}${plus(l.d.neg())}}{${l.a.toLatex()}} = ${y.toLatex()}$. The point is $${pt(x, y)}$.`,
            `$${pt(u, v)}$ 表示 $${v.toLatex()} = ${linLatex(l.a, l.b, l.c, l.d).replace(/\(.*\)/, `(${x.toLatex()})`)}$，所以 $f(${x.toLatex()}) = \\frac{${v.toLatex()}${plus(l.d.neg())}}{${l.a.toLatex()}} = ${y.toLatex()}$。这个点是 $${pt(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "values-from-a-table",
      title: t("Values from a table", "由表格求值"),
      explanation: t(
        "To evaluate a transformed function at a number, work from the inside out: compute the input of $f$, look up $f$ there, then apply the outer operations. If $f(1) = 7$ and $g(x) = 3f(2x - 5) - 4$, then\n\n$$g(3) = 3f(2 \\cdot 3 - 5) - 4 = 3f(1) - 4 = 3 \\cdot 7 - 4 = 17.$$",
        "要求变换后的函数在某个数处的值，从内向外计算：先算 $f$ 的输入，查出 $f$ 在该处的值，再进行外层的运算。若 $f(1) = 7$，$g(x) = 3f(2x - 5) - 4$，则\n\n$$g(3) = 3f(2 \\cdot 3 - 5) - 4 = 3f(1) - 4 = 3 \\cdot 7 - 4 = 17。$$",
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
            `The input of $f$ is $${l.b.toLatex()} \\cdot ${paren(x0)}${plus(l.c)} = ${input}$, and $f(${input}) = ${fv}$ from the table. So $g(${x0}) = ${l.a.toLatex()} \\cdot ${paren(fv)}${plus(l.d)} = ${ans.toLatex()}$.`,
            `$f$ 的输入是 $${l.b.toLatex()} \\cdot ${paren(x0)}${plus(l.c)} = ${input}$，由表格 $f(${input}) = ${fv}$。所以 $g(${x0}) = ${l.a.toLatex()} \\cdot ${paren(fv)}${plus(l.d)} = ${ans.toLatex()}$。`,
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
    { topic: "domain-of-a-function", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.A.1"],
  knowledgePoints: [
    {
      id: "range-after-vertical-transformations",
      title: t("Vertical operations change the range", "竖直变换改变值域"),
      explanation: t(
        "Vertical operations act on the outputs, so they change the range and leave the domain alone. For $g(x) = a f(x) + k$, apply $y \\mapsto ay + k$ to each end of the range. A negative $a$ swaps the ends.\n\nIf the range of $f$ is $[-1, 4)$, the range of $g(x) = -2f(x) + 3$ runs from $-2 \\cdot 4 + 3 = -5$ (not included) to $-2 \\cdot (-1) + 3 = 5$: it is $(-5, 5]$.",
        "竖直方向的变换作用在输出上，所以改变值域而不改变定义域。对于 $g(x) = a f(x) + k$，把值域的每个端点按 $y \\mapsto ay + k$ 变换。$a$ 为负时两端互换。\n\n若 $f$ 的值域是 $[-1, 4)$，则 $g(x) = -2f(x) + 3$ 的值域从 $-2 \\cdot 4 + 3 = -5$（不含）到 $-2 \\cdot (-1) + 3 = 5$：是 $(-5, 5]$。",
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
          solution: t(
            `Apply $y \\mapsto ${linear(a, k, "y")}$ to the range ${setText(ran)}${a.sign() < 0 ? ", which swaps the ends" : ""}: the range of $g$ is ${setText(answer)}.`,
            `把值域 ${setText(ran)} 按 $y \\mapsto ${linear(a, k, "y")}$ 变换${a.sign() < 0 ? "（两端互换）" : ""}：$g$ 的值域是 ${setText(answer)}。`,
          ),
        });
      },
    },
    {
      id: "domain-after-horizontal-transformations",
      title: t("Horizontal operations change the domain", "水平变换改变定义域"),
      explanation: t(
        "Horizontal operations act on the inputs, so they change the domain. $g(x) = f(bx + c)$ is defined exactly when $bx + c$ is in the domain of $f$; solve for $x$ at each end. A negative $b$ swaps the ends.\n\nIf the domain of $f$ is $[2, 8]$, then $g(x) = f(2x - 4)$ needs $2 \\le 2x - 4 \\le 8$, that is $3 \\le x \\le 6$: the domain of $g$ is $[3, 6]$.",
        "水平方向的变换作用在输入上，所以改变定义域。$g(x) = f(bx + c)$ 有定义当且仅当 $bx + c$ 在 $f$ 的定义域内；对每个端点解出 $x$。$b$ 为负时两端互换。\n\n若 $f$ 的定义域是 $[2, 8]$，则 $g(x) = f(2x - 4)$ 要求 $2 \\le 2x - 4 \\le 8$，即 $3 \\le x \\le 6$：$g$ 的定义域是 $[3, 6]$。",
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
          solution: t(
            `$g$ is defined when $${linear(b, c)}$ is in ${setText(dom)}. Solving for $x$ at each end${b.sign() < 0 ? " (dividing by a negative number swaps them)" : ""} gives the domain ${setText(answer)}.`,
            `当 $${linear(b, c)}$ 属于 ${setText(dom)} 时 $g$ 有定义。对每个端点解出 $x$${b.sign() < 0 ? "（除以负数时两端互换）" : ""}，得定义域为 ${setText(answer)}。`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-after-several-transformations",
      title: t("Both at once", "同时求定义域和值域"),
      explanation: t(
        "For $g(x) = a f(bx + c) + d$, find the domain from the inside, $bx + c$, and the range from the outside, $ay + d$. If $f$ has domain $[-4, 2]$ and range $[0, 5]$, then $g(x) = -f(-x + 1) + 2$ has domain $[-1, 5]$ (from $-4 \\le -x + 1 \\le 2$) and range $[-3, 2]$ (from $y \\mapsto -y + 2$).",
        "对于 $g(x) = a f(bx + c) + d$，由内层 $bx + c$ 求定义域，由外层 $ay + d$ 求值域。若 $f$ 的定义域是 $[-4, 2]$、值域是 $[0, 5]$，则 $g(x) = -f(-x + 1) + 2$ 的定义域是 $[-1, 5]$（由 $-4 \\le -x + 1 \\le 2$），值域是 $[-3, 2]$（由 $y \\mapsto -y + 2$）。",
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
          solution: askDomain
            ? t(
                `The domain comes from the input: $${linear(l.b, l.c)}$ must be in ${setText(dom)}, which gives ${setText(domG)}.`,
                `定义域由输入决定：$${linear(l.b, l.c)}$ 必须属于 ${setText(dom)}，得 ${setText(domG)}。`,
              )
            : t(
                `The range comes from the outputs: apply $y \\mapsto ${linear(l.a, l.d, "y")}$ to ${setText(ran)}, which gives ${setText(ranG)}.`,
                `值域由输出决定：把 ${setText(ran)} 按 $y \\mapsto ${linear(l.a, l.d, "y")}$ 变换，得 ${setText(ranG)}。`,
              ),
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
  encompasses: [
    { topic: "the-domain-and-range-of-transformed-functions", weight: 0.2 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.3 },
    { topic: "absolute-value-expressions", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "evaluating-absolute-value-transformations",
      title: t("Evaluating |f(x)| and f(|x|)", "求 |f(x)| 与 f(|x|) 的值"),
      explanation: t(
        "The bars act at different stages:\n\n- $g(x) = |f(x)|$: evaluate $f$ first, then take the absolute value of the **output**;\n- $h(x) = f(|x|)$: take the absolute value of the **input** first, then evaluate $f$.\n\nFor $f(x) = x^2 + 4x - 1$: $g(-2) = |4 - 8 - 1| = 5$, while $h(-2) = f(2) = 4 + 8 - 1 = 11$.",
        "绝对值作用的阶段不同：\n\n- $g(x) = |f(x)|$：先求 $f$ 的值，再对**输出**取绝对值；\n- $h(x) = f(|x|)$：先对**输入**取绝对值，再求 $f$ 的值。\n\n对于 $f(x) = x^2 + 4x - 1$：$g(-2) = |4 - 8 - 1| = 5$，而 $h(-2) = f(2) = 4 + 8 - 1 = 11$。",
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
        return numberProblem({
          prompt: t(
            `Let ${fIs(f)} and $g(x) = ${name}$. Find $g(${x0.toLatex()})$.`,
            `设 ${fIs(f)}，$g(x) = ${name}$。求 $g(${x0.toLatex()})$。`,
          ),
          answer,
          wrong: [fx, fAbs, fx.abs(), fAbs.abs(), fx.neg()],
          solution: outer
            ? t(
                `First $f(${x0.toLatex()}) = ${fx.toLatex()}$, then $g(${x0.toLatex()}) = |${fx.toLatex()}| = ${answer.toLatex()}$.`,
                `先算 $f(${x0.toLatex()}) = ${fx.toLatex()}$，再得 $g(${x0.toLatex()}) = |${fx.toLatex()}| = ${answer.toLatex()}$。`,
              )
            : t(
                `First $|${x0.toLatex()}| = ${x0.abs().toLatex()}$, then $g(${x0.toLatex()}) = f(${x0.abs().toLatex()}) = ${answer.toLatex()}$.`,
                `先算 $|${x0.toLatex()}| = ${x0.abs().toLatex()}$，再得 $g(${x0.toLatex()}) = f(${x0.abs().toLatex()}) = ${answer.toLatex()}$。`,
              ),
        });
      },
    },
    {
      id: "absolute-value-transformations-from-graphs",
      title: t("Reading the new graphs", "读出新图象"),
      explanation: t(
        "From the graph of $f$:\n\n- $y = |f(x)|$ keeps the parts on or above the $x$-axis and reflects the parts below it upward;\n- $y = f(|x|)$ keeps the part for $x \\ge 0$ and replaces the left half with the mirror image of the right half, so its value at $-p$ is $f(p)$.\n\nIf the graph of $f$ passes through $(3, -2)$, then $|f(3)| = 2$ and $f(|-3|) = -2$.",
        "由 $f$ 的图象：\n\n- $y = |f(x)|$ 保留 $x$ 轴上及上方的部分，把下方的部分翻折到上方；\n- $y = f(|x|)$ 保留 $x \\ge 0$ 的部分，左半部分换成右半部分关于 $y$ 轴的对称图形，所以它在 $-p$ 处的值是 $f(p)$。\n\n若 $f$ 的图象经过 $(3, -2)$，则 $|f(3)| = 2$，$f(|-3|) = -2$。",
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
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f$ is shown. Let $g(x) = ${name}$. Find $g(${x})$.`,
                `下图是 $f$ 的图象。设 $g(x) = ${name}$。求 $g(${x})$。`,
              ),
              answer,
              wrong: [...(fx ? [fx, fx.abs()] : []), ...(fm ? [fm, fm.abs().neg(), fm.neg()] : [])],
              solution: outer
                ? t(
                    `From the graph, $f(${x}) = ${fx!.toLatex()}$, which is below the $x$-axis, so $g(${x}) = |${fx!.toLatex()}| = ${answer.toLatex()}$.`,
                    `由图象，$f(${x}) = ${fx!.toLatex()}$，在 $x$ 轴下方，所以 $g(${x}) = |${fx!.toLatex()}| = ${answer.toLatex()}$。`,
                  )
                : t(
                    `$g(${x}) = f(|${x}|) = f(${-x})$, and from the graph, $f(${-x}) = ${fm!.toLatex()}$.`,
                    `$g(${x}) = f(|${x}|) = f(${-x})$，由图象，$f(${-x}) = ${fm!.toLatex()}$。`,
                  ),
            }),
            figure: graphFigure(f),
          };
        }
      },
    },
    {
      id: "the-range-of-the-absolute-value-of-a-function",
      title: t("The range of |f(x)|", "|f(x)| 的值域"),
      explanation: t(
        "Taking absolute values turns the negative outputs of $f$ into positive ones. If the range of $f$ is $[m, M]$:\n\n- when $m \\ge 0$, the range of $|f(x)|$ is still $[m, M]$;\n- when $M \\le 0$, it is $[-M, -m]$;\n- when $m < 0 < M$, the output $0$ is reached and the range is $[0, \\max(-m, M)]$.\n\nFor the range $[-5, 3]$, the range of $|f(x)|$ is $[0, 5]$.",
        "取绝对值把 $f$ 的负输出变成正的。若 $f$ 的值域是 $[m, M]$：\n\n- 当 $m \\ge 0$ 时，$|f(x)|$ 的值域仍是 $[m, M]$；\n- 当 $M \\le 0$ 时，值域是 $[-M, -m]$；\n- 当 $m < 0 < M$ 时，能取到 $0$，值域是 $[0, \\max(-m, M)]$。\n\n若值域是 $[-5, 3]$，则 $|f(x)|$ 的值域是 $[0, 5]$。",
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
              `The range of $f$ is $[${m}, ${M}]$. ${m < 0 && M > 0 ? `It contains $0$, so the least value of $|f(x)|$ is $0$, and the greatest is $\\max(${-m}, ${M}) = ${hi}$.` : `Taking absolute values gives the values from $${lo}$ to $${hi}$.`} The range is ${setText(set)}.`,
              `$f$ 的值域是 $[${m}, ${M}]$。${m < 0 && M > 0 ? `它包含 $0$，所以 $|f(x)|$ 的最小值是 $0$，最大值是 $\\max(${-m}, ${M}) = ${hi}$。` : `取绝对值后，值从 $${lo}$ 到 $${hi}$。`}值域是 ${setText(set)}。`,
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
