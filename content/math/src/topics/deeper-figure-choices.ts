// Knowledge points whose options are drawings: the learner reads a graph, a transformation or a
// number line off the picture. Each wrong drawing comes from a mistake learners make with signs,
// swapped numbers or the direction of a shading.

import type { Figure, KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  svgDocument,
} from "@ga/subject-math";

import { figureChoice } from "../problems.ts";
import { numberLineFigure } from "./compound-inequalities.ts";

type Pair = readonly [string, string];
type Pt = readonly [number, number];

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** wide is the window of most drawings here. */
const wide: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6, labelEvery: 2 };

/** at writes a point for alt text, in parentheses. */
const at = (p: Pt) => `(${Math.round(p[0] * 100) / 100}, ${Math.round(p[1] * 100) / 100})`;

/** coef gives a slope as an exact number for LaTeX. */
const coef = (m: number): Coefficient => (Number.isInteger(m) ? m : Q.of(Math.round(m * 4), 4));

/** tex writes a point as LaTeX. */
const tex = (p: Pt) => `(${num(coef(p[0]))}, ${num(coef(p[1]))})`;

/** plus writes the number added at the end of an expression, nothing when it is zero. */
const plus = (k: number) => (k === 0 ? "" : k < 0 ? ` - ${-k}` : ` + ${k}`);

/** shifted writes x - h, or just x when h is zero. */
const shifted = (h: number) => (h === 0 ? "x" : `x${plus(-h)}`);

/** nonzero picks a whole number from -n to n other than 0. */
const nonzero = (rng: Rng, n: number) => rng.sign() * rng.int(1, n);

/** draw makes a figure in a window from its marks and its alt texts. */
const draw = (view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): Figure => ({
  svg: plane(view, marks),
  alt: t(en, zh),
});

/** lineFigure draws the line y = mx + b. */
const lineFigure = (m: number, b: number): Figure =>
  draw(
    wide,
    [{ kind: "line", a: [0, b], b: [1, b + m], accent: true }],
    `A line through ${at([0, b])} and ${at([1, b + m])}.`,
    `一条经过 ${at([0, b])} 和 ${at([1, b + m])} 的直线。`,
  );

/** curveFigure draws y = f(x), described by its shape and the points at the given x. */
function curveFigure(view: PlaneView, f: (x: number) => number, xs: readonly number[], shape: Pair): Figure {
  const through = xs.map((x) => at([x, f(x)])).join(", ");
  return draw(
    view,
    [{ kind: "curve", f, accent: true }],
    `${shape[0]} through ${through}.`,
    `${shape[1]}，经过 ${through.replaceAll("), (", ")、(")}。`,
  );
}

/** pointFigure draws one labeled point. */
const pointFigure = (p: Pt, label: string): Figure =>
  draw(wide, [{ kind: "point", at: p, label, dir: "ne", accent: true }], `Point ${label} at ${at(p)}.`, `点 ${label} 位于 ${at(p)}。`);

/** names label the vertices of a triangle. */
const names = ["A", "B", "C"];

/** bases are triangles with no two sides equal, near the origin. */
const bases: readonly (readonly Pt[])[] = [
  [
    [-2, -1],
    [1, -1],
    [-2, 1],
  ],
  [
    [-1, -2],
    [2, -1],
    [0, 2],
  ],
  [
    [-2, 0],
    [2, -2],
    [1, 1],
  ],
];

/** corners are triangles with no two sides equal, in the first quadrant. */
const corners: readonly (readonly Pt[])[] = [
  [
    [1, 1],
    [4, 1],
    [1, 3],
  ],
  [
    [1, 2],
    [5, 1],
    [2, 4],
  ],
  [
    [2, 1],
    [5, 2],
    [3, 5],
  ],
  [
    [1, 1],
    [3, 2],
    [1, 5],
  ],
  [
    [2, 2],
    [5, 1],
    [4, 4],
  ],
  [
    [1, 3],
    [3, 1],
    [5, 4],
  ],
  [
    [1, 1],
    [2, 4],
    [5, 2],
  ],
  [
    [1, 4],
    [2, 1],
    [4, 5],
  ],
  [
    [2, 1],
    [4, 1],
    [1, 4],
  ],
];

/** listed writes the vertices of a triangle for alt text. */
const listed = (pts: readonly Pt[], prime = "") => pts.map((p, i) => `${names[i]}${prime}${at(p)}`).join(", ");

/** triangleMarks draws a triangle as an outline with named corners. */
const triangleMarks = (pts: readonly Pt[]): PlaneMark[] => [
  { kind: "path", points: [...pts, pts[0] as Pt], accent: true },
  ...pts.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i] as string, dir: "sw", accent: true })),
];

/** triangleFigure draws the triangle a problem starts from. */
const triangleFigure = (pts: readonly Pt[]): Figure =>
  draw(wide, triangleMarks(pts), `Triangle with vertices ${listed(pts)}.`, `三角形，顶点为 ${listed(pts)}。`);

/** imageFigure draws a triangle and a candidate for its image. */
const imageFigure = (pts: readonly Pt[], image: readonly Pt[]): Figure =>
  draw(
    wide,
    [
      { kind: "polygon", points: image, tone: "result" },
      ...triangleMarks(pts),
      ...image.map((p, i): PlaneMark => ({ kind: "point", at: p, label: `${names[i]}'`, dir: "ne", tone: "result" })),
    ],
    `Triangle with vertices ${listed(pts)} and its image with vertices ${listed(image, "'")}.`,
    `三角形，顶点为 ${listed(pts)}，它的像的顶点为 ${listed(image, "'")}。`,
  );

/** Motion moves a point. */
type Motion = (p: Pt) => Pt;

/** motions are the rigid motions about the origin used here, by name. */
const motions: Readonly<Record<string, { readonly move: Motion; readonly en: string; readonly zh: string; readonly rule: string }>> = {
  ccw90: {
    move: ([x, y]) => [-y, x],
    en: "$90^\\circ$ counterclockwise about the origin",
    zh: "绕原点逆时针旋转 $90^\\circ$",
    rule: "(x, y) \\to (-y, x)",
  },
  cw90: {
    move: ([x, y]) => [y, -x],
    en: "$90^\\circ$ clockwise about the origin",
    zh: "绕原点顺时针旋转 $90^\\circ$",
    rule: "(x, y) \\to (y, -x)",
  },
  half: { move: ([x, y]) => [-x, -y], en: "$180^\\circ$ about the origin", zh: "绕原点旋转 $180^\\circ$", rule: "(x, y) \\to (-x, -y)" },
  ccw270: {
    move: ([x, y]) => [y, -x],
    en: "$270^\\circ$ counterclockwise about the origin",
    zh: "绕原点逆时针旋转 $270^\\circ$",
    rule: "(x, y) \\to (y, -x)",
  },
  overX: { move: ([x, y]) => [x, -y], en: "across the $x$-axis", zh: "关于 $x$ 轴翻折", rule: "(x, y) \\to (x, -y)" },
  overY: { move: ([x, y]) => [-x, y], en: "across the $y$-axis", zh: "关于 $y$ 轴翻折", rule: "(x, y) \\to (-x, y)" },
  overDiagonal: { move: ([x, y]) => [y, x], en: "across the line $y = x$", zh: "关于直线 $y = x$ 翻折", rule: "(x, y) \\to (y, x)" },
  overOtherDiagonal: {
    move: ([x, y]) => [-y, -x],
    en: "across the line $y = -x$",
    zh: "关于直线 $y = -x$ 翻折",
    rule: "(x, y) \\to (-y, -x)",
  },
};

/** motionChoice asks for the image of a triangle under one motion, offering the images under others. */
function motionChoice(rng: Rng, verb: Pair, right: string, others: readonly string[]) {
  const pts = rng.pick(corners);
  const motion = motions[right] as (typeof motions)[string];
  const images = pts.map(motion.move);
  const vertex = images
    .map((p, i) => `${names[i]}${tex(pts[i] as Pt)} \\to ${names[i]}'${tex(p)}`)
    .map((s) => `$${s}$`)
    .join(", ");
  return figureChoice(rng, {
    prompt: t(
      `Triangle $ABC$ is ${verb[0]} ${motion.en}. Which drawing shows its image?`,
      `把三角形 $ABC$ ${motion.zh}。哪张图画出了它的像？`,
    ),
    figure: triangleFigure(pts),
    correct: imageFigure(pts, images),
    wrong: others.map((o) => imageFigure(pts, pts.map((motions[o] as (typeof motions)[string]).move))),
    solution: t(
      `This motion sends every point by the rule $${motion.rule}$. Apply it to each vertex: ${vertex}. The other drawings use a different rule, so at least one of their vertices lands elsewhere.`,
      `这个变换按规则 $${motion.rule}$ 移动每个点。把它用到每个顶点上：${vertex.replaceAll("$, $", "$，$")}。其余的图用了别的规则，至少有一个顶点落在别处。`,
    ),
  });
}

/** halfPlaneFigure draws the boundary of y = mx + b and shades one side. */
function halfPlaneFigure(m: number, b: number, above: boolean, dashed: boolean): Figure {
  const side = above ? ([-m, 1, -b] as const) : ([m, -1, b] as const);
  const en = `A ${dashed ? "dashed" : "solid"} line through ${at([0, b])} and ${at([1, b + m])}, with the side ${above ? "above" : "below"} it shaded.`;
  const zh = `一条经过 ${at([0, b])} 和 ${at([1, b + m])} 的${dashed ? "虚线" : "实线"}，它${above ? "上方" : "下方"}的一侧涂了阴影。`;
  return draw(
    wide,
    [
      { kind: "region", halfPlanes: [side] },
      { kind: "line", a: [0, b], b: [1, b + m], accent: true, dashed },
    ],
    en,
    zh,
  );
}

/** slopes are the slopes of the lines drawn here; they stay readable on the grid. */
const slopes = [1, 2, 3, -1, -2, -3, 0.5, -0.5];

/** inequalityChoice asks for the graph of an inequality in slope-intercept form. */
function inequalityChoice(rng: Rng, strict: boolean) {
  const m = rng.pick(slopes);
  const b = nonzero(rng, 4);
  const above = rng.bool();
  const sign = strict ? (above ? ">" : "<") : above ? "\\ge" : "\\le";
  const holds = above ? 0 > b : 0 < b;
  return figureChoice(rng, {
    prompt: t(
      `Which drawing shows the solutions of $y ${sign} ${linear(coef(m), b)}$?`,
      `哪张图画出了 $y ${sign} ${linear(coef(m), b)}$ 的解？`,
    ),
    correct: halfPlaneFigure(m, b, above, strict),
    wrong: [halfPlaneFigure(m, b, !above, strict), halfPlaneFigure(m, b, above, !strict), halfPlaneFigure(-m, b, above, strict)],
    solution: t(
      `The boundary is $y = ${linear(coef(m), b)}$, through $${tex([0, b])}$ with slope $${num(coef(m))}$. It is ${strict ? "dashed, because points on it do not satisfy a strict inequality" : "solid, because points on it satisfy the inequality"}. Test the origin: $0 ${sign} ${num(b)}$ is ${holds ? "true" : "false"}, so the shading ${holds ? "includes" : "leaves out"} the origin.`,
      `边界是 $y = ${linear(coef(m), b)}$，经过 $${tex([0, b])}$，斜率为 $${num(coef(m))}$。${strict ? "它画成虚线，因为边界上的点不满足严格不等式" : "它画成实线，因为边界上的点满足不等式"}。用原点检验：$0 ${sign} ${num(b)}$ ${holds ? "成立" : "不成立"}，所以阴影${holds ? "包含" : "不包含"}原点。`,
    ),
  });
}

/** Shift is a graph moved right by h and up by k. */
interface Shift {
  readonly h: number;
  readonly k: number;
}

/** shiftChoice asks for a graph y = a·g(x - h) + k, offering the mistakes with the signs of h, k and a. */
function shiftChoice(
  rng: Rng,
  g: (x: number) => number,
  latex: (inner: string) => string,
  xs: (s: Shift) => readonly number[],
  shape: Pair,
  start: Pair,
) {
  const h = nonzero(rng, 3);
  const k = nonzero(rng, 3);
  const figure = (a: number, s: Shift) => curveFigure(wide, (x) => a * g(x - s.h) + s.k, xs(s), shape);
  const equation = `y = ${latex(shifted(h))}${plus(k)}`;
  return figureChoice(rng, {
    prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
    correct: figure(1, { h, k }),
    wrong: [figure(1, { h: -h, k }), figure(1, { h, k: -k }), figure(-1, { h, k })],
    solution: t(
      `Inside the function, $${shifted(h)}$ moves the graph ${h > 0 ? "right" : "left"} by $${Math.abs(h)}$: the sign looks opposite to the move, because $x = ${num(h)}$ makes the inside zero. The ${k > 0 ? `$+ ${k}$` : `$- ${-k}$`} outside moves it ${k > 0 ? "up" : "down"} by $${Math.abs(k)}$. So ${start[0]} is at $${tex([h, k])}$, and with no minus sign in front, the graph is not turned over.`,
      `函数内部的 $${shifted(h)}$ 把图像向${h > 0 ? "右" : "左"}移动 $${Math.abs(h)}$：符号看起来与移动方向相反，因为 $x = ${num(h)}$ 时内部为零。外面的 ${k > 0 ? `$+ ${k}$` : `$- ${-k}$`} 把图像向${k > 0 ? "上" : "下"}移动 $${Math.abs(k)}$。所以${start[1]}在 $${tex([h, k])}$；前面没有负号，所以图像没有翻转。`,
    ),
  });
}

/** tall is the window of graphs of exponential functions. */
const tall: PlaneView = { xMin: -5, xMax: 5, yMin: -2, yMax: 8, labelEvery: 2 };

/** exponentialFigure draws y = a·r^x + k. */
const exponentialFigure = (a: number, r: number, k: number): Figure =>
  curveFigure(tall, (x) => a * r ** x + k, [0, 1], ["A curve", "一条曲线"]);

/** factor writes the number in front of a power. */
const factor = (a: number) => (a === 1 ? "" : `${a} \\cdot `);

/** logView is the window of graphs of logarithms and their inverses. */
const logView: PlaneView = { xMin: -4, xMax: 10, yMin: -7, yMax: 7, labelEvery: 2 };

/** waves is the window of graphs of sine and cosine. */
const waves: PlaneView = { xMin: -7, xMax: 7, yMin: -4, yMax: 4 };

/** waveFigure draws y = A sin x + k or y = A cos x + k. */
function waveFigure(A: number, sine: boolean, k: number): Figure {
  const f = (x: number) => A * (sine ? Math.sin(x) : Math.cos(x)) + k;
  const rising = A > 0;
  return draw(
    waves,
    [{ kind: "curve", f, accent: true }],
    `A wave through ${at([0, f(0)])} and ${at([Math.PI / 2, f(Math.PI / 2)])}, with greatest value ${Math.abs(A) + k} and least value ${k - Math.abs(A)}${sine ? `, ${rising ? "rising" : "falling"} to the right of x = 0` : ""}.`,
    `一条波形曲线，经过 ${at([0, f(0)])} 和 ${at([Math.PI / 2, f(Math.PI / 2)])}，最大值为 ${Math.abs(A) + k}，最小值为 ${k - Math.abs(A)}${sine ? `，在 x = 0 右侧${rising ? "上升" : "下降"}` : ""}。`,
  );
}

/** times writes the factor of a sine or cosine. */
const times = (A: number) => (A === 1 ? "" : A === -1 ? "-" : String(A));

/** ray is the set of numbers on one side of a, with or without a. */
const ray = (a: number, right: boolean, closed: boolean): RealSet =>
  right ? [{ lo: Q.of(a), loClosed: closed, hiClosed: false }] : [{ hi: Q.of(a), hiClosed: closed, loClosed: false }];

/** partsFigure draws the number line from 0 to 1 in equal parts, with a dot at the given part. */
function partsFigure(parts: number, mark: number): Figure {
  const x = (k: number) => Math.round((30 + (k / parts) * 260) * 100) / 100;
  let body = `<line x1="${x(0)}" y1="24" x2="${x(parts)}" y2="24"/>`;
  for (let k = 0; k <= parts; k++) body += `<line x1="${x(k)}" y1="17" x2="${x(k)}" y2="31"/>`;
  body += `<text x="${x(0)}" y="48" stroke="none" fill="currentColor">0</text><text x="${x(parts)}" y="48" stroke="none" fill="currentColor">1</text>`;
  body += `<circle class="accent" cx="${x(mark)}" cy="24" r="5" fill="currentColor" stroke="none"/>`;
  return {
    svg: svgDocument(56, body),
    alt: t(
      `A number line from 0 to 1 cut into ${parts} equal parts, with a dot ${mark} parts from 0.`,
      `一条从 0 到 1 的数轴，平均分成 ${parts} 份，点在距 0 第 ${mark} 份处。`,
    ),
  };
}

/** figureChoicePoints holds the knowledge points answered by choosing a drawing, by topic. */
export const figureChoicePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-coordinate-plane": [
    skill(
      "choosing-the-drawing-of-a-point",
      ["Choosing the drawing of a point", "选出点的位置"],
      [
        "The first number of a point says how far to move along the $x$-axis, and the second how far along the $y$-axis. Starting at the origin, go right for a positive first number and left for a negative one, then up for a positive second number and down for a negative one. The order matters: $(2, 5)$ and $(5, 2)$ are different points.",
        "点的第一个数表示沿 $x$ 轴移动多远，第二个数表示沿 $y$ 轴移动多远。从原点出发，第一个数为正向右、为负向左，第二个数为正向上、为负向下。顺序不能换：$(2, 5)$ 和 $(5, 2)$ 是不同的点。",
      ],
      (rng) => {
        const a = nonzero(rng, 5);
        let b = nonzero(rng, 5);
        if (Math.abs(a) === Math.abs(b)) b = b > 0 ? (b % 5) + 1 : -((-b % 5) + 1);
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the point $P${tex([a, b])}$?`, `哪张图画出了点 $P${tex([a, b])}$？`),
          correct: pointFigure([a, b], "P"),
          wrong: [pointFigure([b, a], "P"), pointFigure([-a, b], "P"), pointFigure([a, -b], "P")],
          solution: t(
            `From the origin, move $${Math.abs(a)}$ ${a > 0 ? "right" : "left"} because the first number is $${num(a)}$, then $${Math.abs(b)}$ ${b > 0 ? "up" : "down"} because the second number is $${num(b)}$.`,
            `从原点出发，因为第一个数是 $${num(a)}$，所以向${a > 0 ? "右" : "左"}移动 $${Math.abs(a)}$；因为第二个数是 $${num(b)}$，所以再向${b > 0 ? "上" : "下"}移动 $${Math.abs(b)}$。`,
          ),
        });
      },
    ),
  ],
  "reflections-of-points-in-the-coordinate-plane": [
    skill(
      "choosing-the-drawing-of-a-reflected-point",
      ["Choosing the drawing of a reflected point", "选出翻折后的点"],
      [
        "A reflection across an axis keeps a point the same distance from that axis, on the other side. Across the $x$-axis the second number changes sign; across the $y$-axis the first number does. Check a drawing by asking whether the axis is exactly halfway between the point and its image.",
        "关于坐标轴翻折后，点到这条轴的距离不变，但到了另一侧。关于 $x$ 轴翻折时第二个数变号；关于 $y$ 轴翻折时第一个数变号。检查图时，看这条轴是否恰好在点和它的像的正中间。",
      ],
      (rng) => {
        const a = nonzero(rng, 5);
        let b = nonzero(rng, 5);
        if (Math.abs(a) === Math.abs(b)) b = b > 0 ? (b % 5) + 1 : -((-b % 5) + 1);
        const overX = rng.bool();
        const image = (p: Pt): Figure =>
          draw(
            wide,
            [
              { kind: "point", at: [a, b], label: "P", dir: "ne", accent: true },
              { kind: "point", at: p, label: "P'", dir: "ne", tone: "result" },
            ],
            `Point P at ${at([a, b])} and its image P' at ${at(p)}.`,
            `点 P 位于 ${at([a, b])}，它的像 P' 位于 ${at(p)}。`,
          );
        const right: Pt = overX ? [a, -b] : [-a, b];
        const axis: Pair = overX ? ["$x$-axis", "$x$ 轴"] : ["$y$-axis", "$y$ 轴"];
        return figureChoice(rng, {
          prompt: t(
            `Point $P${tex([a, b])}$ is reflected across the ${axis[0]}. Which drawing shows its image $P'$?`,
            `点 $P${tex([a, b])}$ 关于${axis[1]}翻折。哪张图画出了它的像 $P'$？`,
          ),
          correct: image(right),
          wrong: [image(overX ? [-a, b] : [a, -b]), image([-a, -b]), image([b, a])],
          solution: t(
            `Across the ${axis[0]}, the ${overX ? "second" : "first"} number changes sign and the other stays, so $P'$ is $${tex(right)}$. The axis is then exactly halfway between the two points.`,
            `关于${axis[1]}翻折时，${overX ? "第二" : "第一"}个数变号，另一个不变，所以 $P'$ 是 $${tex(right)}$。这时这条轴恰好在两点的正中间。`,
          ),
        });
      },
    ),
  ],
  "graphing-linear-equations": [
    skill(
      "choosing-a-line-by-its-intercepts",
      ["Choosing a line by its intercepts", "用截距选出直线"],
      [
        "To match an equation $ax + by = c$ with a line, find where the line meets the axes. Setting $y = 0$ gives the point on the $x$-axis, and setting $x = 0$ gives the point on the $y$-axis. Two points fix a line, so the drawing has to pass through both.",
        "要把方程 $ax + by = c$ 和直线对应起来，先求直线与坐标轴的交点。令 $y = 0$ 得到 $x$ 轴上的点，令 $x = 0$ 得到 $y$ 轴上的点。两点确定一条直线，所以图必须经过这两点。",
      ],
      (rng) => {
        const [u, v] = rng.shuffle([1, 2, 3, 4, 6]);
        const p = rng.sign() * (u as number);
        const q = rng.sign() * (v as number);
        const line = (x0: number, y0: number): Figure =>
          draw(
            wide,
            [{ kind: "line", a: [x0, 0], b: [0, y0], accent: true }],
            `A line through ${at([x0, 0])} and ${at([0, y0])}.`,
            `一条经过 ${at([x0, 0])} 和 ${at([0, y0])} 的直线。`,
          );
        const equation = `${poly([q, "x"], [p, "y"])} = ${num(p * q)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the line $${equation}$?`, `哪张图画出了直线 $${equation}$？`),
          correct: line(p, q),
          wrong: [line(q, p), line(-p, q), line(p, -q)],
          solution: t(
            `Setting $y = 0$ gives $x = ${num(p)}$, so the line passes through $${tex([p, 0])}$. Setting $x = 0$ gives $y = ${num(q)}$, so it passes through $${tex([0, q])}$. Only one drawing goes through both.`,
            `令 $y = 0$，得 $x = ${num(p)}$，所以直线经过 $${tex([p, 0])}$。令 $x = 0$，得 $y = ${num(q)}$，所以它经过 $${tex([0, q])}$。只有一张图同时经过这两点。`,
          ),
        });
      },
    ),
  ],
  "slope-intercept-form": [
    skill(
      "choosing-a-line-by-slope-and-intercept",
      ["Choosing a line by slope and intercept", "用斜率和截距选出直线"],
      [
        "In $y = mx + b$, the line meets the $y$-axis at $(0, b)$, and one step to the right changes $y$ by $m$. A positive $m$ means the line climbs from left to right, and a negative $m$ means it falls. Check both things on a drawing: where it crosses and which way it leans.",
        "在 $y = mx + b$ 中，直线与 $y$ 轴交于 $(0, b)$，向右走一步，$y$ 变化 $m$。$m$ 为正时直线从左到右上升，$m$ 为负时下降。在图上两件事都要检查：交点在哪里，直线往哪边倾斜。",
      ],
      (rng) => {
        const m = rng.pick(slopes);
        const b = nonzero(rng, 4);
        const equation = `y = ${linear(coef(m), b)}`;
        const end: Pt = [1, b + m];
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the line $${equation}$?`, `哪张图画出了直线 $${equation}$？`),
          correct: lineFigure(m, b),
          wrong: [lineFigure(-m, b), lineFigure(m, -b), lineFigure(b, m)],
          solution: t(
            `The line meets the $y$-axis at $${tex([0, b])}$. The slope is $${num(coef(m))}$, so it ${m > 0 ? "climbs" : "falls"} from left to right, and one step right reaches $${tex(end)}$.`,
            `直线与 $y$ 轴交于 $${tex([0, b])}$。斜率是 $${num(coef(m))}$，所以它从左到右${m > 0 ? "上升" : "下降"}，向右一步到达 $${tex(end)}$。`,
          ),
        });
      },
    ),
  ],
  "systems-of-linear-equations": [
    skill(
      "choosing-the-drawing-of-a-system",
      ["Choosing the drawing of a system", "选出方程组的图像"],
      [
        "Each equation of a system is a line, and a solution is a point on both. So the drawing of a system must show both lines correctly, and the point where they cross is the solution. A drawing with one line wrong crosses somewhere else.",
        "方程组的每个方程都是一条直线，解是同时在两条直线上的点。所以方程组的图必须把两条直线都画对，它们的交点就是解。如果有一条画错了，交点就会落在别处。",
      ],
      (rng) => {
        const [x0, y0] = [rng.int(-2, 2), rng.int(-2, 2)];
        const [m1, m2] = rng.shuffle([1, 2, -1, -2, 3, -3]);
        const [p, q] = [m1 as number, m2 as number];
        const [b1, b2] = [y0 - p * x0, y0 - q * x0];
        const pair = (a: number, c: number, d: number, e: number): Figure =>
          draw(
            wide,
            [
              { kind: "line", a: [0, c], b: [1, c + a], accent: true },
              { kind: "line", a: [0, e], b: [1, e + d], tone: "action" },
            ],
            `Two lines: one through ${at([0, c])} and ${at([1, c + a])}, the other through ${at([0, e])} and ${at([1, e + d])}.`,
            `两条直线：一条经过 ${at([0, c])} 和 ${at([1, c + a])}，另一条经过 ${at([0, e])} 和 ${at([1, e + d])}。`,
          );
        const system = `y = ${linear(p, b1)}$ and $y = ${linear(q, b2)}`;
        const crossing = draw(
          wide,
          [
            { kind: "line", a: [0, b1], b: [1, b1 + p], accent: true },
            { kind: "line", a: [0, b2], b: [1, b2 + q], tone: "action" },
            { kind: "point", at: [x0, y0], label: tex([x0, y0]).replaceAll("-", "−"), dir: "ne", tone: "result" },
          ],
          `The two lines cross at ${at([x0, y0])}.`,
          `两条直线相交于 ${at([x0, y0])}。`,
        );
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the system $${system}$?`, `哪张图画出了方程组 $${system.replace("$ and $", "$，$")}$？`),
          correct: pair(p, b1, q, b2),
          wrong: [pair(-p, b1, q, b2), pair(p, b1, -q, b2), pair(p, -b1 + 1, q, b2)],
          solution: t(
            `The first line meets the $y$-axis at $${tex([0, b1])}$ with slope $${num(p)}$, and the second at $${tex([0, b2])}$ with slope $${num(q)}$. They cross at the solution: $${tex([x0, y0])}$ fits both, since $${num(y0)} = ${num(p)} \\cdot ${paren(x0)}${plus(b1)}$ and $${num(y0)} = ${num(q)} \\cdot ${paren(x0)}${plus(b2)}$.`,
            `第一条直线与 $y$ 轴交于 $${tex([0, b1])}$，斜率为 $${num(p)}$；第二条与 $y$ 轴交于 $${tex([0, b2])}$，斜率为 $${num(q)}$。它们的交点就是解：$${tex([x0, y0])}$ 同时满足两个方程，因为 $${num(y0)} = ${num(p)} \\cdot ${paren(x0)}${plus(b1)}$，且 $${num(y0)} = ${num(q)} \\cdot ${paren(x0)}${plus(b2)}$。`,
          ),
          solutionFigure: crossing,
        });
      },
    ),
  ],
  "graphing-strict-linear-inequalities": [
    skill(
      "choosing-the-drawing-of-a-strict-inequality",
      ["Choosing the drawing of a strict inequality", "选出严格不等式的图像"],
      [
        "A drawing of a strict inequality has a dashed boundary, because points on the line do not count. To decide which side is shaded, test a point off the line, usually the origin: if it satisfies the inequality, its side is shaded.",
        "严格不等式的图用虚线作边界，因为线上的点不算解。要判断哪一侧有阴影，取一个不在线上的点检验，通常取原点：如果它满足不等式，它所在的一侧就涂阴影。",
      ],
      (rng) => inequalityChoice(rng, true),
    ),
  ],
  "graphing-non-strict-linear-inequalities": [
    skill(
      "choosing-the-drawing-of-a-non-strict-inequality",
      ["Choosing the drawing of a non-strict inequality", "选出非严格不等式的图像"],
      [
        "With $\\le$ or $\\ge$, the points on the line count too, so the boundary is solid. The side to shade is found the same way as for a strict inequality: test a point off the line.",
        "用 $\\le$ 或 $\\ge$ 时，线上的点也算解，所以边界是实线。阴影在哪一侧的判断方法与严格不等式相同：取一个不在线上的点检验。",
      ],
      (rng) => inequalityChoice(rng, false),
    ),
  ],
  "absolute-value-graphs": [
    skill(
      "choosing-the-drawing-of-an-absolute-value",
      ["Choosing the drawing of an absolute value", "选出绝对值函数的图像"],
      [
        "The graph of $y = |x - h| + k$ is a V with its tip at $(h, k)$. Inside the bars, $x - h$ moves the V right by $h$; outside, $+ k$ moves it up by $k$. A minus sign in front of the bars turns the V upside down.",
        "$y = |x - h| + k$ 的图像是一个 V 形，尖点在 $(h, k)$。绝对值符号内的 $x - h$ 把 V 形向右移动 $h$；符号外的 $+ k$ 把它向上移动 $k$。绝对值前面的负号把 V 形上下翻转。",
      ],
      (rng) =>
        shiftChoice(
          rng,
          Math.abs,
          (inner) => `|${inner}|`,
          ({ h }) => [h, h + 1],
          ["A V-shaped graph", "一个 V 形图像"],
          ["the tip", "尖点"],
        ),
    ),
  ],
  "graphing-elementary-quadratic-functions": [
    skill(
      "choosing-the-drawing-of-a-parabola",
      ["Choosing the drawing of a parabola", "选出抛物线"],
      [
        "The graph of $y = ax^2 + c$ is a parabola with its vertex at $(0, c)$, through the point $(1, a + c)$. A positive $a$ opens it upward and a negative $a$ downward; a larger size of $a$ makes it narrower. Reading the vertex and the height at $x = 1$ settles all of this at once.",
        "$y = ax^2 + c$ 的图像是顶点在 $(0, c)$ 的抛物线，经过点 $(1, a + c)$。$a$ 为正时开口向上，为负时开口向下；$a$ 的绝对值越大，开口越窄。读出顶点和 $x = 1$ 处的高度，这些就都确定了。",
      ],
      (rng) => {
        const a = rng.sign() * rng.pick([0.25, 0.5, 1, 2, 3]);
        const c = rng.int(-2, 2);
        const shape: Pair = ["A parabola", "一条抛物线"];
        const figure = (d: number) => curveFigure(wide, (x) => d * x * x + c, [0, 1], shape);
        const equation = `y = ${poly([coef(a), "x^2"])}${plus(c)}`;
        const height = tex([1, a + c]);
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: figure(a),
          wrong: [figure(-a), figure(a * 2), figure(a / 2)],
          solution: t(
            `The vertex is $${tex([0, c])}$, and at $x = 1$ the parabola reaches $${height}$. Since the coefficient $${num(coef(a))}$ is ${a > 0 ? "positive" : "negative"}, it opens ${a > 0 ? "upward" : "downward"}.`,
            `顶点是 $${tex([0, c])}$，当 $x = 1$ 时抛物线到达 $${height}$。因为系数 $${num(coef(a))}$ 是${a > 0 ? "正数" : "负数"}，所以开口向${a > 0 ? "上" : "下"}。`,
          ),
        });
      },
    ),
  ],
  "graphs-of-general-quadratic-functions": [
    skill(
      "choosing-a-parabola-by-its-vertex",
      ["Choosing a parabola by its vertex", "用顶点选出抛物线"],
      [
        "The graph of $y = (x - h)^2 + k$ is the parabola $y = x^2$ with its vertex moved to $(h, k)$. A minus sign in front of the square turns it upside down. Read the vertex from the equation before looking at the drawings.",
        "$y = (x - h)^2 + k$ 的图像是把抛物线 $y = x^2$ 的顶点移到 $(h, k)$。平方前面的负号把它上下翻转。先从方程读出顶点，再看图。",
      ],
      (rng) =>
        shiftChoice(
          rng,
          (x) => x * x,
          (inner) => `(${inner})^2`,
          ({ h }) => [h, h + 1],
          ["A parabola", "一条抛物线"],
          ["the vertex", "顶点"],
        ),
    ),
  ],
  "graphing-elementary-cubic-functions": [
    skill(
      "choosing-the-drawing-of-a-cubic",
      ["Choosing the drawing of a cubic", "选出三次函数的图像"],
      [
        "The graph of $y = (x - h)^3 + k$ is the S-shaped curve $y = x^3$ with its center moved to $(h, k)$. It rises from left to right; a minus sign in front makes it fall instead.",
        "$y = (x - h)^3 + k$ 的图像是把 S 形曲线 $y = x^3$ 的中心移到 $(h, k)$。它从左到右上升；前面的负号让它改为下降。",
      ],
      (rng) =>
        shiftChoice(
          rng,
          (x) => x ** 3,
          (inner) => `(${inner})^3`,
          ({ h }) => [h, h + 1],
          ["An S-shaped curve", "一条 S 形曲线"],
          ["the center", "中心"],
        ),
    ),
  ],
  "graphing-the-square-root-function": [
    skill(
      "choosing-the-drawing-of-a-square-root",
      ["Choosing the drawing of a square root", "选出平方根函数的图像"],
      [
        "The graph of $y = \\sqrt{x - h} + k$ starts at the point $(h, k)$ and bends to the right, since the root exists only when $x - h \\ge 0$. A minus sign in front of the root sends the curve down from its starting point.",
        "$y = \\sqrt{x - h} + k$ 的图像从点 $(h, k)$ 出发向右弯曲，因为只有当 $x - h \\ge 0$ 时根号才有意义。根号前面的负号让曲线从起点向下走。",
      ],
      (rng) =>
        shiftChoice(
          rng,
          Math.sqrt,
          (inner) => `\\sqrt{${inner}}`,
          ({ h }) => [h, h + 1],
          ["A curve starting at its first point", "一条从第一个点出发的曲线"],
          ["the starting point", "起点"],
        ),
    ),
  ],
  "graphing-exponential-growth-functions": [
    skill(
      "choosing-the-drawing-of-exponential-growth",
      ["Choosing the drawing of exponential growth", "选出指数增长的图像"],
      [
        "The graph of $y = a \\cdot b^x + k$ with $a > 0$ and $b > 1$ crosses the $y$-axis at $(0, a + k)$, passes through $(1, ab + k)$, and rises faster and faster to the right. To the left it comes close to the line $y = k$ without touching it.",
        "当 $a > 0$，$b > 1$ 时，$y = a \\cdot b^x + k$ 的图像与 $y$ 轴交于 $(0, a + k)$，经过 $(1, ab + k)$，向右上升得越来越快。向左它越来越接近直线 $y = k$，但不会碰到。",
      ],
      (rng) => {
        const a = rng.int(1, 4);
        const b = rng.pick([2, 3, 4]);
        const k = rng.int(-1, 1);
        const equation = `y = ${factor(a)}${b}^x${plus(k)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: exponentialFigure(a, b, k),
          wrong: [exponentialFigure(a, 1 / b, k), exponentialFigure(a + 1, b, k), exponentialFigure(a, b, k + 1)],
          solution: t(
            `At $x = 0$, $y = ${a + k}$, so the curve crosses the $y$-axis at $${tex([0, a + k])}$. At $x = 1$, $y = ${a * b + k}$. Since the base $${b}$ is greater than $1$, the curve rises to the right, and to the left it comes close to $y = ${k}$.`,
            `当 $x = 0$ 时，$y = ${a + k}$，所以曲线与 $y$ 轴交于 $${tex([0, a + k])}$。当 $x = 1$ 时，$y = ${a * b + k}$。因为底数 $${b}$ 大于 $1$，所以曲线向右上升，向左接近 $y = ${k}$。`,
          ),
        });
      },
    ),
  ],
  "graphing-exponential-decay-functions": [
    skill(
      "choosing-the-drawing-of-exponential-decay",
      ["Choosing the drawing of exponential decay", "选出指数衰减的图像"],
      [
        "The graph of $y = a \\cdot r^x + k$ with $a > 0$ and $0 < r < 1$ crosses the $y$-axis at $(0, a + k)$ and falls to the right, coming close to the line $y = k$ without touching it. Going one step left divides the power by $r$, which makes the curve climb steeply on the left.",
        "当 $a > 0$，$0 < r < 1$ 时，$y = a \\cdot r^x + k$ 的图像与 $y$ 轴交于 $(0, a + k)$，向右下降，越来越接近直线 $y = k$ 但不会碰到。向左走一步，幂要除以 $r$，所以曲线在左边陡峭上升。",
      ],
      (rng) => {
        const a = rng.int(1, 4);
        const b = rng.pick([2, 3, 4]);
        const k = rng.int(-1, 1);
        const equation = `y = ${factor(a)}\\left(\\frac{1}{${b}}\\right)^x${plus(k)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: exponentialFigure(a, 1 / b, k),
          wrong: [exponentialFigure(a, b, k), exponentialFigure(a + 1, 1 / b, k), exponentialFigure(a, 1 / b, k + 1)],
          solution: t(
            `At $x = 0$, $y = ${a + k}$, so the curve crosses the $y$-axis at $${tex([0, a + k])}$. At $x = -1$, $y = ${a * b + k}$. The base is less than $1$, so the curve falls to the right and comes close to $y = ${k}$.`,
            `当 $x = 0$ 时，$y = ${a + k}$，所以曲线与 $y$ 轴交于 $${tex([0, a + k])}$。当 $x = -1$ 时，$y = ${a * b + k}$。底数小于 $1$，所以曲线向右下降，并接近 $y = ${k}$。`,
          ),
        });
      },
    ),
  ],
  "graphing-logarithmic-functions": [
    skill(
      "choosing-the-drawing-of-a-logarithm",
      ["Choosing the drawing of a logarithm", "选出对数函数的图像"],
      [
        "The graph of $y = \\log_b(x - h) + k$ with $b > 1$ rises slowly to the right from a vertical line $x = h$ it never touches. It passes through $(h + 1, k)$, because $\\log_b 1 = 0$, and through $(h + b, k + 1)$, because $\\log_b b = 1$.",
        "当 $b > 1$ 时，$y = \\log_b(x - h) + k$ 的图像从竖直线 $x = h$ 附近向右缓慢上升，且永远碰不到这条线。它经过 $(h + 1, k)$，因为 $\\log_b 1 = 0$；还经过 $(h + b, k + 1)$，因为 $\\log_b b = 1$。",
      ],
      (rng) => {
        const b = rng.pick([2, 3]);
        const h = rng.int(0, 2);
        const k = rng.int(-2, 2);
        const log = (x: number) => Math.log(x) / Math.log(b);
        const shape: Pair = ["A curve", "一条曲线"];
        const inside = h === 0 ? "x" : `(x - ${h})`;
        const equation = `y = \\log_{${b}} ${inside}${plus(k)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: curveFigure(logView, (x) => log(x - h) + k, [h + 1, h + b], shape),
          wrong: [
            curveFigure(logView, (x) => -log(x - h) + k, [h + 1, h + b], shape),
            curveFigure(logView, (x) => log(x - h) - k, [h + 1, h + b], shape),
            curveFigure(logView, (x) => b ** (x - k) + h, [k, k + 1], shape),
          ],
          solution: t(
            `The curve exists only for $x > ${h}$. It passes through $${tex([h + 1, k])}$, where the logarithm is $0$, and through $${tex([h + b, k + 1])}$, where it is $1$. So it rises to the right.`,
            `曲线只在 $x > ${h}$ 时存在。它经过 $${tex([h + 1, k])}$，这里对数为 $0$；还经过 $${tex([h + b, k + 1])}$，这里对数为 $1$。所以它向右上升。`,
          ),
        });
      },
    ),
  ],
  "graphing-sine-and-cosine": [
    skill(
      "choosing-the-drawing-of-a-wave",
      ["Choosing the drawing of a wave", "选出正弦和余弦的图像"],
      [
        "Three readings settle a graph of $y = A\\sin x + k$ or $y = A\\cos x + k$. The wave swings around the line $y = k$, and it swings $|A|$ above and below it. The value at $x = 0$ tells sine from cosine: sine is $k$ there, on the middle line, and cosine is $A + k$, at a peak or a trough. For a sine, the sign of $A$ says whether the wave rises or falls to the right of $x = 0$.",
        "$y = A\\sin x + k$ 或 $y = A\\cos x + k$ 的图像看三处就能确定。曲线围绕直线 $y = k$ 摆动，上下各摆动 $|A|$。$x = 0$ 处的值可以区分正弦和余弦：正弦在这里是 $k$，正好在中线上；余弦是 $A + k$，在波峰或波谷。对正弦来说，$A$ 的符号决定曲线在 $x = 0$ 右侧是上升还是下降。",
      ],
      (rng) => {
        const A = rng.pick([1, 2, 3, -1, -2, -3]);
        const k = rng.int(-1, 1);
        const sine = rng.bool();
        const name = sine ? "\\sin" : "\\cos";
        const other = Math.abs(A) === 3 ? (A > 0 ? 2 : -2) : A + Math.sign(A);
        const start = sine ? k : A + k;
        const equation = `y = ${times(A)}${name} x${plus(k)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: waveFigure(A, sine, k),
          wrong: [waveFigure(A, !sine, k), waveFigure(-A, sine, k), waveFigure(other, sine, k)],
          solution: t(
            `The middle line is $y = ${k}$, and the wave swings $${Math.abs(A)}$ above and below it, from $${k - Math.abs(A)}$ to $${k + Math.abs(A)}$. At $x = 0$, $y = ${start}$, because $${name} 0 = ${sine ? 0 : 1}$.${sine ? ` To the right of $x = 0$ the wave ${A > 0 ? "rises" : "falls"}, since $\\sin x$ is positive there and $${num(A)}$ is ${A > 0 ? "positive" : "negative"}.` : ""}`,
            `中线是 $y = ${k}$，曲线在它上下各摆动 $${Math.abs(A)}$，从 $${k - Math.abs(A)}$ 到 $${k + Math.abs(A)}$。当 $x = 0$ 时，$y = ${start}$，因为 $${name} 0 = ${sine ? 0 : 1}$。${sine ? `在 $x = 0$ 右侧曲线${A > 0 ? "上升" : "下降"}，因为此处 $\\sin x$ 为正，而 $${num(A)}$ 为${A > 0 ? "正" : "负"}数。` : ""}`,
          ),
        });
      },
    ),
  ],
  "graphs-of-inverse-functions": [
    skill(
      "choosing-the-graph-of-an-inverse",
      ["Choosing the graph of an inverse", "选出反函数的图像"],
      [
        "If $(a, b)$ is on the graph of $f$, then $(b, a)$ is on the graph of $f^{-1}$. Swapping the coordinates of every point reflects the graph across the line $y = x$. To check a drawing, swap the coordinates of two points of $f$ and see whether both land on it.",
        "如果 $(a, b)$ 在 $f$ 的图像上，那么 $(b, a)$ 就在 $f^{-1}$ 的图像上。把每个点的坐标交换，就是把图像关于直线 $y = x$ 翻折。检查图时，把 $f$ 上两个点的坐标交换，看它们是否都落在图上。",
      ],
      (rng) => {
        const m = rng.pick([2, 3, -2, -3, 0.5, -0.5]);
        const b = nonzero(rng, 3);
        const f = lineFigure(m, b);
        const candidate = (s: number, c: number) => lineFigure(s, c);
        const [slope, intercept] = [1 / m, -b / m];
        const p: Pt = [0, b];
        const r: Pt = [1, b + m];
        return figureChoice(rng, {
          prompt: t(
            "The drawing shows the graph of $f$. Which drawing shows the graph of $f^{-1}$?",
            "图中是 $f$ 的图像。哪张图是 $f^{-1}$ 的图像？",
          ),
          figure: f,
          correct: candidate(slope, intercept),
          wrong: [candidate(-m, b), candidate(-m, -b), candidate(m, -b)],
          solution: t(
            `The graph of $f$ passes through $${tex(p)}$ and $${tex(r)}$. Swapping the coordinates gives $${tex([p[1], p[0]])}$ and $${tex([r[1], r[0]])}$, which lie on the graph of $f^{-1}$. The two graphs are mirror images across $y = x$.`,
            `$f$ 的图像经过 $${tex(p)}$ 和 $${tex(r)}$。交换坐标得到 $${tex([p[1], p[0]])}$ 和 $${tex([r[1], r[0]])}$，它们都在 $f^{-1}$ 的图像上。这两个图像关于 $y = x$ 对称。`,
          ),
          solutionFigure: draw(
            wide,
            [
              { kind: "line", a: [0, 0], b: [1, 1], tone: "action", dashed: true },
              { kind: "line", a: [0, b], b: [1, b + m], accent: true },
              { kind: "line", a: [b, 0], b: [b + m, 1], tone: "result" },
            ],
            `The graph of f through ${at(p)} and ${at(r)}, the graph of its inverse through ${at([b, 0])} and ${at([b + m, 1])}, and the dashed mirror line y = x.`,
            `f 的图像经过 ${at(p)} 和 ${at(r)}，反函数的图像经过 ${at([b, 0])} 和 ${at([b + m, 1])}，虚线是对称轴 y = x。`,
          ),
        });
      },
    ),
  ],
  "translations-of-geometric-figures": [
    skill(
      "choosing-the-drawing-of-a-translation",
      ["Choosing the drawing of a translation", "选出平移后的图形"],
      [
        "A translation moves every point by the same amount in the same direction. Pick one vertex and count the move on the grid; if the image of that vertex is right, check that the other vertices moved by the same amount. The image has the same size and faces the same way.",
        "平移把每个点沿同一方向移动相同的距离。选一个顶点，在网格上数出移动量；如果这个顶点的像对了，再检查其他顶点是否移动了相同的量。像的大小和朝向都不变。",
      ],
      (rng) => {
        const pts = rng.pick(bases);
        const p = rng.int(1, 3) * rng.sign();
        let q = rng.int(1, 3) * rng.sign();
        if (Math.abs(p) === Math.abs(q)) q = q > 0 ? (q % 3) + 1 : -((-q % 3) + 1);
        const moved = (dx: number, dy: number) => pts.map(([x, y]): Pt => [x + dx, y + dy]);
        const [across, up]: Pair = [p > 0 ? "right" : "left", q > 0 ? "up" : "down"];
        const [acrossZh, upZh]: Pair = [p > 0 ? "右" : "左", q > 0 ? "上" : "下"];
        const first = pts[0] as Pt;
        return figureChoice(rng, {
          prompt: t(
            `Triangle $ABC$ is translated $${Math.abs(p)}$ units ${across} and $${Math.abs(q)}$ units ${up}. Which drawing shows its image?`,
            `把三角形 $ABC$ 向${acrossZh}平移 $${Math.abs(p)}$ 个单位，再向${upZh}平移 $${Math.abs(q)}$ 个单位。哪张图画出了它的像？`,
          ),
          figure: triangleFigure(pts),
          correct: imageFigure(pts, moved(p, q)),
          wrong: [imageFigure(pts, moved(q, p)), imageFigure(pts, moved(-p, q)), imageFigure(pts, moved(p, -q))],
          solution: t(
            `Every point moves by $${num(p)}$ across and $${num(q)}$ up. So $A${tex(first)}$ goes to $A'${tex([first[0] + p, first[1] + q])}$, and the other vertices move by the same amount.`,
            `每个点横向移动 $${num(p)}$，纵向移动 $${num(q)}$。所以 $A${tex(first)}$ 移到 $A'${tex([first[0] + p, first[1] + q])}$，其他顶点移动相同的量。`,
          ),
        });
      },
    ),
  ],
  "rotations-of-geometric-figures": [
    skill(
      "choosing-the-drawing-of-a-rotation",
      ["Choosing the drawing of a rotation", "选出旋转后的图形"],
      [
        "A rotation about the origin keeps every point at the same distance from the origin and turns it through the same angle. A quarter turn counterclockwise carries the first quadrant into the second, and a quarter turn clockwise carries it into the fourth. So first check which quadrant the image lies in, then check the vertices.",
        "绕原点旋转时，每个点到原点的距离不变，并转过相同的角。逆时针转四分之一圈把第一象限转到第二象限，顺时针转四分之一圈把它转到第四象限。所以先看像在哪个象限，再检查顶点。",
      ],
      (rng) => {
        const right = rng.pick(["ccw90", "cw90"]);
        return motionChoice(rng, ["rotated", "旋转"], right, [right === "ccw90" ? "cw90" : "ccw90", "half", rng.pick(["overX", "overY"])]);
      },
    ),
  ],
  "rotation-rules-in-the-coordinate-plane": [
    skill(
      "choosing-a-rotation-by-its-rule",
      ["Choosing a rotation by its rule", "用规则选出旋转后的图形"],
      [
        "A half turn about the origin sends $(x, y)$ to $(-x, -y)$. A turn of $270^\\circ$ counterclockwise is the same as a quarter turn clockwise, and sends $(x, y)$ to $(y, -x)$. A drawing is right when every vertex of the image follows the rule.",
        "绕原点转半圈把 $(x, y)$ 变成 $(-x, -y)$。逆时针转 $270^\\circ$ 等于顺时针转四分之一圈，把 $(x, y)$ 变成 $(y, -x)$。只有像的每个顶点都符合规则，图才是对的。",
      ],
      (rng) => {
        const right = rng.pick(["half", "ccw270"]);
        return motionChoice(rng, ["rotated", "旋转"], right, [
          right === "half" ? "ccw270" : "half",
          "ccw90",
          rng.pick(["overDiagonal", "overX"]),
        ]);
      },
    ),
  ],
  "reflections-in-the-coordinate-plane": [
    skill(
      "choosing-the-drawing-of-a-reflection",
      ["Choosing the drawing of a reflection", "选出翻折后的图形"],
      [
        "A reflection flips a figure over a line: each point and its image are the same distance from the line, on opposite sides, and the figure's direction around its vertices reverses. Across the $x$-axis $y$ changes sign, across the $y$-axis $x$ changes sign, and across $y = x$ the coordinates swap.",
        "翻折把图形沿一条直线翻过去：每个点和它的像到这条线的距离相等，分在两侧，而且顶点的环绕方向会反过来。关于 $x$ 轴翻折时 $y$ 变号，关于 $y$ 轴翻折时 $x$ 变号，关于 $y = x$ 翻折时两个坐标交换。",
      ],
      (rng) => {
        const right = rng.pick(["overX", "overY", "overDiagonal", "overOtherDiagonal"]);
        const others = ["overX", "overY", "overDiagonal", "overOtherDiagonal", "half"].filter((o) => o !== right);
        return motionChoice(rng, ["reflected", "翻折"], right, rng.shuffle(others).slice(0, 3));
      },
    ),
  ],
  "representing-solutions-to-inequalities-on-number-lines": [
    skill(
      "choosing-the-number-line-of-an-inequality",
      ["Choosing the number line of an inequality", "选出不等式的数轴表示"],
      [
        "First solve the inequality, remembering that dividing by a negative number reverses it. Then read the drawing: a filled dot means the number itself is a solution and an open circle means it is not, and the arrow points toward the other solutions.",
        "先解不等式，记住除以负数时不等号要反向。然后看图：实心点表示这个数本身是解，空心圈表示不是，箭头指向其余的解。",
      ],
      (rng) => {
        const k = rng.pick([2, 3, 4, -2, -3]);
        const a = rng.int(-4, 4);
        const c = rng.int(-6, 6);
        const right = rng.bool();
        const closed = rng.bool();
        const greater = closed ? "\\ge" : ">";
        const less = closed ? "\\le" : "<";
        const sign = k > 0 === right ? greater : less;
        const drawn = (toRight: boolean, filled: boolean) => numberLineFigure(ray(a, toRight, filled), a - 5, a + 5);
        const left = `${linear(k, c)}`;
        const d = k * a + c;
        return figureChoice(rng, {
          prompt: t(
            `Which number line shows the solutions of $${left} ${sign} ${num(d)}$?`,
            `哪条数轴表示 $${left} ${sign} ${num(d)}$ 的解？`,
          ),
          correct: drawn(right, closed),
          wrong: [drawn(!right, closed), drawn(right, !closed), drawn(!right, !closed)],
          solution: t(
            `${c === 0 ? "" : `Subtract $${num(c)}$ from both sides: $${num(k)}x ${sign} ${num(d - c)}$. `}Divide by $${num(k)}$${k < 0 ? ", which reverses the inequality" : ""}: $x ${right ? greater : less} ${num(a)}$. So the ${closed ? "dot at" : "circle at"} $${num(a)}$ is ${closed ? "filled" : "open"}, and the arrow points ${right ? "right" : "left"}.`,
            `${c === 0 ? "" : `两边减去 $${num(c)}$：$${num(k)}x ${sign} ${num(d - c)}$。`}两边除以 $${num(k)}$${k < 0 ? "，不等号反向" : ""}：$x ${right ? greater : less} ${num(a)}$。所以 $${num(a)}$ 处是${closed ? "实心点" : "空心圈"}，箭头指向${right ? "右" : "左"}。`,
          ),
        });
      },
    ),
  ],
  "fractions-on-the-number-line": [
    skill(
      "choosing-the-number-line-of-a-fraction",
      ["Choosing the number line of a fraction", "选出分数在数轴上的位置"],
      [
        "To place a fraction between 0 and 1, the denominator says how many equal parts to cut the line into, and the numerator says how many parts to count from 0. Count the spaces between tick marks, not the tick marks themselves: a line cut into 4 parts has 5 tick marks.",
        "要在 0 和 1 之间标出一个分数，分母表示把这段数轴平均分成几份，分子表示从 0 开始数几份。要数刻度之间的空隙，而不是刻度本身：分成 4 份的线段有 5 个刻度。",
      ],
      (rng) => {
        const d = rng.int(3, 8);
        const n = rng.int(1, d - 1);
        const other = n === d - 1 ? n - 1 : n + 1;
        return figureChoice(rng, {
          prompt: t(`Which number line has a dot at $\\frac{${n}}{${d}}$?`, `哪条数轴上的点表示 $\\frac{${n}}{${d}}$？`),
          correct: partsFigure(d, n),
          wrong: [partsFigure(d + 1, n), partsFigure(d, other), partsFigure(d - 1 === n ? d + 2 : d - 1, n)],
          solution: t(
            `The denominator $${d}$ means the line from $0$ to $1$ is cut into $${d}$ equal parts, which takes $${d + 1}$ tick marks. The numerator $${n}$ means the dot is $${n}$ part${n === 1 ? "" : "s"} from $0$.`,
            `分母 $${d}$ 表示把 $0$ 到 $1$ 平均分成 $${d}$ 份，需要 $${d + 1}$ 个刻度。分子 $${n}$ 表示点距 $0$ 有 $${n}$ 份。`,
          ),
        });
      },
    ),
  ],
};
