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
import { stepLabel } from "../solution-kit.ts";
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
  const undo = undoing[right] ?? right;
  const back = motions[undo] as (typeof motions)[string];
  const a1 = images[0] as Pt;
  return figureChoice(rng, {
    prompt: t(
      `Triangle $ABC$ is ${verb[0]} ${motion.en}. Which drawing shows its image?`,
      `把三角形 $ABC$ ${motion.zh}。哪张图画出了它的像？`,
    ),
    figure: triangleFigure(pts),
    correct: imageFigure(pts, images),
    wrong: others.map((o) => imageFigure(pts, pts.map((motions[o] as (typeof motions)[string]).move))),
    whys: others.map((o) => {
      const rule = (motions[o] as (typeof motions)[string]).rule;
      return t(
        `This drawing follows the rule $${rule}$, which belongs to a different motion.`,
        `这张图用的是规则 $${rule}$，那是另一种运动。`,
      );
    }),
    solution: t(
      `${stepLabel(1, "find the rule", "找出规则").en} Moving a point ${motion.en} sends $(x, y)$ by the rule $${motion.rule}$.\n\n${stepLabel(2, "apply it to the vertices", "作用在顶点上").en} ${vertex}. Only one drawing has its image vertices at all three points; the others follow a different rule, so at least one of their vertices lands elsewhere.\n\n**Check.** Map $A'$ back. ${undo === right ? "Doing the same motion again undoes it" : `Moving it ${back.en} undoes the motion`}, by the rule $${back.rule}$: $A'${tex(a1)} \\to ${tex(back.move(a1))}$, which is $A$ again.`,
      `${stepLabel(1, "find the rule", "找出规则")["zh-CN"]}把点${motion.zh}，就是按规则 $${motion.rule}$ 移动 $(x, y)$。\n\n${stepLabel(2, "apply it to the vertices", "作用在顶点上")["zh-CN"]}${vertex.replaceAll("$, $", "$，$")}。只有一张图的像的三个顶点都在这些位置；其余的图用了别的规则，至少有一个顶点落在别处。\n\n**检验。** 把 $A'$ 移回去。${undo === right ? "再做一次同样的变换就还原了" : `把它${back.zh}就还原了`}，规则是 $${back.rule}$：$A'${tex(a1)} \\to ${tex(back.move(a1))}$，正是 $A$。`,
    ),
  });
}

/** undoing names, for each motion, the motion that undoes it. */
const undoing: Readonly<Record<string, string>> = { ccw90: "cw90", cw90: "ccw90", ccw270: "ccw90" };

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
    whys: [
      t(
        "This drawing shades the wrong side of the line. Test a point, such as the origin.",
        "这张图涂错了直线的一侧。代入一个点检验，比如原点。",
      ),
      t(
        "The boundary is drawn the wrong way: a solid line means its points count, which needs $\\le$ or $\\ge$.",
        "边界画法不对：实线表示线上的点也算，这要求是 $\\le$ 或 $\\ge$。",
      ),
      t("This line has the opposite slope, so it leans the wrong way.", "这条直线的斜率符号相反，倾斜方向错了。"),
    ],
    solution: t(
      [
        `**Step 1: Find the boundary.** Replace $${sign}$ by $=$: the boundary is $y = ${linear(coef(m), b)}$. It crosses the $y$-axis at $${tex([0, b])}$ and has slope $${num(coef(m))}$, so it passes through $${tex([1, b + m])}$ too. This rules out the drawing whose line leans the other way.`,
        `**Step 2: Dashed or solid.** The sign is $${sign}$, ${strict ? "a strict inequality, so points on the line do not count and the boundary is dashed" : "which allows equality, so points on the line count and the boundary is solid"}.`,
        `**Step 3: Choose the side.** The origin is not on the line, so test it: $0 ${sign} ${num(b)}$ is ${holds ? "true" : "false"}. So the shaded side is the one ${holds ? "that holds" : "without"} the origin: the side ${above ? "above" : "below"} the line.`,
        `**Check.** Take the point $${tex([0, above ? b + 1 : b - 1])}$, one unit ${above ? "above" : "below"} the line in the shaded part: $${num(above ? b + 1 : b - 1)} ${sign} ${num(b)}$ is true.`,
      ].join("\n\n"),
      [
        `**第一步：找边界。** 把 $${sign}$ 换成 $=$，边界是 $y = ${linear(coef(m), b)}$。它与 $y$ 轴交于 $${tex([0, b])}$，斜率为 $${num(coef(m))}$，所以也经过 $${tex([1, b + m])}$。倾斜方向相反的那张图可以排除。`,
        `**第二步：虚线还是实线。** 符号是 $${sign}$，${strict ? "这是严格不等式，线上的点不算解，所以边界画成虚线" : "它允许取等号，线上的点也算解，所以边界画成实线"}。`,
        `**第三步：选一侧。** 原点不在直线上，用它检验：$0 ${sign} ${num(b)}$ ${holds ? "成立" : "不成立"}。所以涂阴影的是${holds ? "有" : "没有"}原点的一侧，也就是直线${above ? "上方" : "下方"}的一侧。`,
        `**检验。** 取阴影里、直线${above ? "上方" : "下方"}一个单位的点 $${tex([0, above ? b + 1 : b - 1])}$：$${num(above ? b + 1 : b - 1)} ${sign} ${num(b)}$ 成立。`,
      ].join("\n\n"),
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
    whys: [
      t(
        "This graph moves sideways the wrong way: $x - h$ moves a graph $h$ to the right.",
        "这个图像左右平移的方向错了：$x - h$ 使图像向右移 $h$。",
      ),
      t(
        "This graph moves up or down the wrong way: a number added outside moves it up.",
        "这个图像上下平移的方向错了：在外面加一个正数使图像上移。",
      ),
      t("This graph is flipped upside down, which would need a minus sign in front.", "这个图像上下翻转了，那需要前面有负号。"),
    ],
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
        `The first number of a point says how far to move along the $x$-axis, and the second how far along the $y$-axis. Starting at the origin, go right for a positive first number and left for a negative one, then up for a positive second number and down for a negative one.

To choose between drawings, use the signs first: they tell which side of each axis the point is on. For $(-2, 5)$ the point must be left of the $y$-axis and above the $x$-axis; then count $2$ left and $5$ up to be sure.

> **Watch out.** The order matters: $(2, 5)$ and $(5, 2)$ are different points, and a drawing with the coordinates swapped can look almost right. Check each sign too: $(-2, 5)$ and $(2, 5)$ are mirror images across the $y$-axis.`,
        `点的第一个数表示沿 $x$ 轴移动多远，第二个数表示沿 $y$ 轴移动多远。从原点出发，第一个数为正向右、为负向左，第二个数为正向上、为负向下。

在几张图中选择时，先看符号：它们说明点在每条坐标轴的哪一侧。对 $(-2, 5)$，点必须在 $y$ 轴左边、$x$ 轴上方；再数向左 $2$、向上 $5$ 来确认。

> **注意。** 顺序不能换：$(2, 5)$ 和 $(5, 2)$ 是不同的点，把坐标对调的图可能看起来几乎是对的。每个符号也要检查：$(-2, 5)$ 和 $(2, 5)$ 关于 $y$ 轴对称。`,
      ],
      (rng) => {
        const a = nonzero(rng, 5);
        let b = nonzero(rng, 5);
        if (Math.abs(a) === Math.abs(b)) b = b > 0 ? (b % 5) + 1 : -((-b % 5) + 1);
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the point $P${tex([a, b])}$?`, `哪张图画出了点 $P${tex([a, b])}$？`),
          correct: pointFigure([a, b], "P"),
          wrong: [pointFigure([b, a], "P"), pointFigure([-a, b], "P"), pointFigure([a, -b], "P")],
          whys: [
            t("This drawing swaps the coordinates: the first one is the move across.", "这张图把坐标对调了：第一个坐标是水平方向的移动。"),
            t(
              "This drawing has the wrong sign across: check left or right of the $y$-axis.",
              "这张图水平方向的符号错了：看点在 $y$ 轴的左边还是右边。",
            ),
            t(
              "This drawing has the wrong sign going up: check above or below the $x$-axis.",
              "这张图竖直方向的符号错了：看点在 $x$ 轴的上方还是下方。",
            ),
          ],
          solution: t(
            `From the origin, move $${Math.abs(a)}$ ${a > 0 ? "right" : "left"} because the first number is $${num(a)}$, then $${Math.abs(b)}$ ${b > 0 ? "up" : "down"} because the second number is $${num(b)}$. The drawing whose point $P$ is there is the answer.

**Check.** $P$ must be ${a > 0 ? "right" : "left"} of the $y$-axis and ${b > 0 ? "above" : "below"} the $x$-axis, and $${Math.abs(a)}$ from the $y$-axis rather than $${Math.abs(b)}$; the drawings with the coordinates swapped or a sign changed fail one of these.`,
            `从原点出发，因为第一个数是 $${num(a)}$，所以向${a > 0 ? "右" : "左"}移动 $${Math.abs(a)}$；因为第二个数是 $${num(b)}$，所以再向${b > 0 ? "上" : "下"}移动 $${Math.abs(b)}$。点 $P$ 在那里的图就是答案。

**检验。** $P$ 必须在 $y$ 轴${a > 0 ? "右" : "左"}边、$x$ 轴${b > 0 ? "上方" : "下方"}，并且离 $y$ 轴 $${Math.abs(a)}$ 而不是 $${Math.abs(b)}$；坐标对调或符号改变的图总有一条不符合。`,
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
        "A reflection across an axis keeps a point the same distance from that axis, on the other side. Across the $x$-axis the second number changes sign; across the $y$-axis the first number does. Across the $x$-axis, $P(2, 3)$ lands on $P'(2, -3)$.\n\nCheck: $P$ is $3$ above the $x$-axis and $P'$ is $3$ below it, straight underneath, so the axis is exactly halfway between them.\n\n> **Watch out.** A drawing where both signs changed, or where the numbers swapped places, shows a different move, not this reflection.",
        "关于坐标轴翻折后，点到这条轴的距离不变，但到了另一侧。关于 $x$ 轴翻折时第二个数变号；关于 $y$ 轴翻折时第一个数变号。$P(2, 3)$ 关于 $x$ 轴翻折后落在 $P'(2, -3)$。\n\n检验：$P$ 在 $x$ 轴上方 $3$，$P'$ 在 $x$ 轴下方 $3$，就在正下方，所以这条轴恰好在两点的正中间。\n\n> **注意。** 两个符号都变了、或两个数交换了位置的图，画的是别的移动，不是这次翻折。",
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
          whys: [
            t("This image is a reflection across the other axis.", "这是关于另一条轴的反射。"),
            t("This image changes both signs, which is a half turn about the origin.", "这个像把两个符号都变了，那是绕原点转半圈。"),
            t("This image swaps the coordinates, which is a reflection across $y = x$.", "这个像把坐标对调了，那是关于 $y = x$ 的反射。"),
          ],
          solution: t(
            `${stepLabel(1, "Keep one number", "保留一个数").en} Across the ${axis[0]}, the point moves ${overX ? "up or down" : "left or right"}, so the ${overX ? "first" : "second"} number stays.\n\n${stepLabel(2, "Change the other sign", "另一个数变号").en} The ${overX ? "second" : "first"} number changes sign: $${tex([a, b])} \\to ${tex(right)}$. Choose the drawing with $P'$ there.\n\n**Check.** $P$ and $P'$ are both $${Math.abs(overX ? b : a)}$ from the ${axis[0]}, on opposite sides, so the axis is exactly halfway between them.`,
            `${stepLabel(1, "Keep one number", "保留一个数")["zh-CN"]}关于${axis[1]}翻折时，点${overX ? "上下" : "左右"}移动，所以${overX ? "第一" : "第二"}个数不变。\n\n${stepLabel(2, "Change the other sign", "另一个数变号")["zh-CN"]}${overX ? "第二" : "第一"}个数变号：$${tex([a, b])} \\to ${tex(right)}$。选 $P'$ 在这里的图。\n\n**检验。** $P$ 和 $P'$ 到${axis[1]}的距离都是 $${Math.abs(overX ? b : a)}$，分在两侧，所以这条轴恰好在两点的正中间。`,
          ),
        });
      },
    ),
  ],
  "graphing-linear-equations": [
    {
      ...skill(
        "choosing-a-line-by-its-intercepts",
        ["Choosing a line by its intercepts", "用截距选出直线"],
        [
          "To match $ax + by = c$ with a drawing, find where the line meets the axes. Setting $y = 0$ gives the point on the $x$-axis, and setting $x = 0$ gives the point on the $y$-axis. For $3x + 2y = 6$: $y = 0$ gives $x = 2$, and $x = 0$ gives $y = 3$, so the line passes through $(2, 0)$ and $(0, 3)$.\n\nCheck: both points fit, $3(2) + 2(0) = 6$ and $3(0) + 2(3) = 6$.\n\n> **Watch out.** For the $x$-axis point divide by the number in front of $x$, not $y$: dividing by $2$ would give $(3, 0)$, the intercepts swapped.",
          "要把方程 $ax + by = c$ 和图对应起来，先求直线与坐标轴的交点。令 $y = 0$ 得到 $x$ 轴上的点，令 $x = 0$ 得到 $y$ 轴上的点。对于 $3x + 2y = 6$：令 $y = 0$ 得 $x = 2$，令 $x = 0$ 得 $y = 3$，所以直线经过 $(2, 0)$ 和 $(0, 3)$。\n\n检验：两点都满足方程，$3(2) + 2(0) = 6$，$3(0) + 2(3) = 6$。\n\n> **注意。** 求 $x$ 轴上的点时要除以 $x$ 前面的数，不是 $y$ 前面的数：除以 $2$ 会得到 $(3, 0)$，把截距对调了。",
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
          const s1 = stepLabel(1, "Set y to 0", "令 y = 0");
          const s2 = stepLabel(2, "Set x to 0", "令 x = 0");
          return figureChoice(rng, {
            prompt: t(`Which drawing shows the line $${equation}$?`, `哪张图画出了直线 $${equation}$？`),
            correct: line(p, q),
            wrong: [line(q, p), line(-p, q), line(p, -q)],
            whys: [
              t(
                "This line swaps the intercepts. To find the $x$-intercept, set $y = 0$.",
                "这条直线把两个截距对调了。求 $x$ 轴截距时令 $y = 0$。",
              ),
              t("This line crosses the $x$-axis on the wrong side of the origin.", "这条直线与 $x$ 轴的交点在原点的另一侧。"),
              t("This line crosses the $y$-axis on the wrong side of the origin.", "这条直线与 $y$ 轴的交点在原点的另一侧。"),
            ],
            solution: t(
              `${s1.en} $${poly([q, "x"])} = ${num(p * q)}$, so $x = ${num(p)}$ and the line passes through $${tex([p, 0])}$.\n\n${s2.en} $${poly([p, "y"])} = ${num(p * q)}$, so $y = ${num(q)}$ and the line passes through $${tex([0, q])}$. Only one drawing goes through both.\n\n**Check.** Both points fit: $${poly([q, "x"])}$ at $x = ${num(p)}$ is $${num(p * q)}$, and $${poly([p, "y"])}$ at $y = ${num(q)}$ is $${num(p * q)}$.`,
              `${s1["zh-CN"]}$${poly([q, "x"])} = ${num(p * q)}$，所以 $x = ${num(p)}$，直线经过 $${tex([p, 0])}$。\n\n${s2["zh-CN"]}$${poly([p, "y"])} = ${num(p * q)}$，所以 $y = ${num(q)}$，直线经过 $${tex([0, q])}$。只有一张图同时经过这两点。\n\n**检验。** 两点都满足方程：$x = ${num(p)}$ 时 $${poly([q, "x"])}$ 等于 $${num(p * q)}$，$y = ${num(q)}$ 时 $${poly([p, "y"])}$ 也等于 $${num(p * q)}$。`,
            ),
          });
        },
      ),
      figure: draw(
        wide,
        [
          { kind: "line", a: [2, 0], b: [0, 3], accent: true },
          { kind: "point", at: [2, 0], label: "(2, 0)", dir: "se" },
          { kind: "point", at: [0, 3], label: "(0, 3)", dir: "w" },
        ],
        "The line 3x + 2y = 6 through (2, 0) and (0, 3).",
        "直线 3x + 2y = 6 经过 (2, 0) 和 (0, 3)。",
      ),
    },
  ],
  "slope-intercept-form": [
    skill(
      "choosing-a-line-by-slope-and-intercept",
      ["Choosing a line by slope and intercept", "用斜率和截距选出直线"],
      [
        `In $y = mx + b$, the line meets the $y$-axis at $(0, b)$, and one step to the right changes $y$ by $m$. So two facts identify the drawing: where the line crosses the $y$-axis, and which way and how steeply it leans.

For $y = -2x + 1$: the line crosses the $y$-axis at $(0, 1)$, and one step right takes it down $2$, to $(1, -1)$. A drawing that passes through both points is the line.

> **Watch out.** Check both facts, not one: a line through $(0, 1)$ that climbs has the right intercept but the opposite slope, and a line with the slope and intercept swapped, $y = x - 2$, passes elsewhere. A negative $m$ falls from left to right.`,
        `在 $y = mx + b$ 中，直线与 $y$ 轴交于 $(0, b)$，向右走一步，$y$ 变化 $m$。所以两件事就能认出图像：直线在哪里与 $y$ 轴相交，往哪边倾斜、倾斜多少。

对 $y = -2x + 1$：直线与 $y$ 轴交于 $(0, 1)$，向右一步就下降 $2$，到达 $(1, -1)$。经过这两点的图就是这条直线。

> **注意。** 两件事都要检查，不能只看一件：过 $(0, 1)$ 但上升的直线截距对了，斜率却相反；把斜率和截距对调的直线 $y = x - 2$ 则经过别处。$m$ 为负时，直线从左到右下降。`,
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
          whys: [
            t("This line has the opposite slope, so it leans the wrong way.", "这条直线的斜率符号相反，倾斜方向错了。"),
            t("This line crosses the $y$-axis at the opposite of $b$.", "这条直线与 $y$ 轴的交点是 $b$ 的相反数。"),
            t("This line swaps the slope and the intercept.", "这条直线把斜率和截距对调了。"),
          ],
          solution: t(
            `**Step 1: the $y$-intercept.** At $x = 0$, $y = ${b}$, so the line meets the $y$-axis at $${tex([0, b])}$.

**Step 2: the slope.** The slope is $${num(coef(m))}$, so the line ${m > 0 ? "climbs" : "falls"} from left to right, and one step right reaches $${tex(end)}$. The drawing through both points is the answer.

**Check.** $x = 1$ in the equation gives $y = ${num(coef(m))} \\cdot 1${plus(b)} = ${b + m}$, so $${tex(end)}$ is on the line.`,
            `**第一步：$y$ 轴截距。** $x = 0$ 时 $y = ${b}$，所以直线与 $y$ 轴交于 $${tex([0, b])}$。

**第二步：斜率。** 斜率是 $${num(coef(m))}$，所以直线从左到右${m > 0 ? "上升" : "下降"}，向右一步到达 $${tex(end)}$。经过这两点的图就是答案。

**检验。** 把 $x = 1$ 代入方程，得 $y = ${num(coef(m))} \\cdot 1${plus(b)} = ${b + m}$，所以 $${tex(end)}$ 在直线上。`,
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
        `Each equation of a system is a line, and a solution is a point on both. So the drawing of a system must show both lines correctly, and the point where they cross is the solution.

Check each line by its $y$-intercept and its slope. For $y = 2x - 1$ and $y = -x + 2$: the first meets the $y$-axis at $(0, -1)$ and climbs $2$ per step, the second meets it at $(0, 2)$ and falls $1$ per step. They cross at $(1, 1)$, which fits both: $2 \\cdot 1 - 1 = 1$ and $-1 + 2 = 1$.

> **Watch out.** Check **both** lines. A drawing with one line wrong, leaning the other way or crossing the $y$-axis at another height, still shows two crossing lines, but they cross somewhere else.`,
        `方程组的每个方程都是一条直线，解是同时在两条直线上的点。所以方程组的图必须把两条直线都画对，它们的交点就是解。

用 $y$ 轴截距和斜率检查每条直线。对 $y = 2x - 1$ 和 $y = -x + 2$：第一条与 $y$ 轴交于 $(0, -1)$，每走一步上升 $2$；第二条与 $y$ 轴交于 $(0, 2)$，每走一步下降 $1$。它们交于 $(1, 1)$，两个方程都满足：$2 \\cdot 1 - 1 = 1$，$-1 + 2 = 1$。

> **注意。** **两条**直线都要检查。有一条画错的图，比如倾斜方向反了或与 $y$ 轴交点高度不对，仍然画着两条相交的直线，但交点落在了别处。`,
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
          whys: [
            t("In this drawing, the first line has the opposite slope.", "这张图中，第一条直线的斜率符号相反。"),
            t("In this drawing, the second line has the opposite slope.", "这张图中，第二条直线的斜率符号相反。"),
            t("In this drawing, the first line crosses the $y$-axis at the wrong height.", "这张图中，第一条直线与 $y$ 轴的交点高度不对。"),
          ],
          solution: t(
            `**The first line.** It meets the $y$-axis at $${tex([0, b1])}$ with slope $${num(p)}$, so it ${p > 0 ? "climbs" : "falls"} from left to right.

**The second line.** It meets the $y$-axis at $${tex([0, b2])}$ with slope $${num(q)}$, so it ${q > 0 ? "climbs" : "falls"}. The drawing with both lines right is the answer, and its lines cross at the solution.

**Check.** $${tex([x0, y0])}$ fits both equations, since $${num(y0)} = ${num(p)} \\cdot ${paren(x0)}${plus(b1)}$ and $${num(y0)} = ${num(q)} \\cdot ${paren(x0)}${plus(b2)}$.`,
            `**第一条直线。** 它与 $y$ 轴交于 $${tex([0, b1])}$，斜率为 $${num(p)}$，所以从左到右${p > 0 ? "上升" : "下降"}。

**第二条直线。** 它与 $y$ 轴交于 $${tex([0, b2])}$，斜率为 $${num(q)}$，所以${q > 0 ? "上升" : "下降"}。两条直线都画对的图就是答案，它们的交点就是解。

**检验。** $${tex([x0, y0])}$ 同时满足两个方程，因为 $${num(y0)} = ${num(p)} \\cdot ${paren(x0)}${plus(b1)}$，且 $${num(y0)} = ${num(q)} \\cdot ${paren(x0)}${plus(b2)}$。`,
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
        `A drawing of an inequality has two parts, the boundary line and the shaded side, and each must match the inequality.

The boundary comes from replacing the sign by $=$. With $<$ or $>$, a point on that line makes both sides equal, so it is not a solution: the boundary is dashed. The line splits the plane in two, and on each side the inequality is either true everywhere or false everywhere, so one test point decides the side.

For $y > 2x - 1$: the boundary $y = 2x - 1$ is dashed. Testing the origin gives $0 > -1$, which is true, so the side holding the origin is shaded.

> **Watch out.** Check all three features: a drawing can shade the wrong side, draw a solid line for a strict sign, or use a line that leans the wrong way because its slope has the opposite sign.`,
        `不等式的图像有两部分：边界直线和涂阴影的一侧，两者都要与不等式相符。

把不等号换成 $=$ 就得到边界。用 $<$ 或 $>$ 时，线上的点使两边相等，不是解，所以边界画成虚线。直线把平面分成两半，在每一半里不等式要么处处成立，要么处处不成立，所以检验一个点就能定下是哪一侧。

例如 $y > 2x - 1$：边界 $y = 2x - 1$ 画成虚线。代入原点得 $0 > -1$，成立，所以原点所在的一侧涂阴影。

> **注意。** 三处都要核对：有的图涂错了一侧，有的把严格不等式的边界画成实线，有的直线斜率符号相反，倾斜方向错了。`,
      ],
      (rng) => inequalityChoice(rng, true),
    ),
  ],
  "graphing-non-strict-linear-inequalities": [
    skill(
      "choosing-the-drawing-of-a-non-strict-inequality",
      ["Choosing the drawing of a non-strict inequality", "选出非严格不等式的图像"],
      [
        `With $\\le$ or $\\ge$, a point on the boundary makes both sides equal, and equality is allowed, so the points on the line are solutions: the boundary is solid. The side is found as for a strict inequality, by testing a point off the line.

For $y \\le -x + 3$: the boundary $y = -x + 3$ is solid. Testing the origin gives $0 \\le 3$, which is true, so the side holding the origin, below the line, is shaded.

> **Watch out.** Check all three features: a drawing can shade the wrong side, draw a dashed line although equality is allowed, or use a line that leans the wrong way because its slope has the opposite sign.`,
        `用 $\\le$ 或 $\\ge$ 时，边界上的点使两边相等，而这里允许相等，所以线上的点也是解，边界画成实线。阴影在哪一侧，和严格不等式一样，取一个不在线上的点检验。

例如 $y \\le -x + 3$：边界 $y = -x + 3$ 画成实线。代入原点得 $0 \\le 3$，成立，所以原点所在的一侧，也就是直线下方，涂阴影。

> **注意。** 三处都要核对：有的图涂错了一侧，有的在允许取等号时把边界画成虚线，有的直线斜率符号相反，倾斜方向错了。`,
      ],
      (rng) => inequalityChoice(rng, false),
    ),
  ],
  "absolute-value-graphs": [
    skill(
      "choosing-the-drawing-of-an-absolute-value",
      ["Choosing the drawing of an absolute value", "选出绝对值函数的图像"],
      [
        "The graph of $y = |x - h| + k$ is a V with its tip at $(h, k)$. Inside the bars, $x - h$ moves the V right by $h$; outside, $+ k$ moves it up by $k$. A minus sign in front of the bars turns the V upside down. So $y = |x + 1| + 2$ is the V of $y = |x|$ moved $1$ left and $2$ up, with its tip at $(-1, 2)$, opening upward.\n\n> **Watch out.** Inside the bars the sign looks opposite to the move: $x + 1$ moves the V **left**, because the inside is $0$ at $x = -1$. Outside, the sign means what it says. And without a minus sign in front, the V opens upward.",
        "$y = |x - h| + k$ 的图像是一个 V 形，尖点在 $(h, k)$。绝对值符号内的 $x - h$ 把 V 形向右移动 $h$；符号外的 $+ k$ 把它向上移动 $k$。绝对值前面的负号把 V 形上下翻转。所以 $y = |x + 1| + 2$ 是把 $y = |x|$ 的 V 形向左移 $1$、向上移 $2$，尖点在 $(-1, 2)$，开口向上。\n\n> **注意。** 绝对值符号里面的符号看起来与移动方向相反：$x + 1$ 使 V 形向**左**移，因为 $x = -1$ 时里面为 $0$。外面的符号就是它表示的方向。前面没有负号时，V 形开口向上。",
      ],
      (rng) => {
        const p = shiftChoice(
          rng,
          Math.abs,
          (inner) => `|${inner}|`,
          ({ h }) => [h, h + 1],
          ["A V-shaped graph", "一个 V 形图像"],
          ["the tip", "尖点"],
        );
        return {
          ...p,
          solution: t(
            `${p.solution.en}\n\n**Check.** In the chosen drawing the tip is the lowest point, and one unit to the right of the tip the graph is one unit higher, just as $y = |x|$ rises from $(0, 0)$ to $(1, 1)$.`,
            `${p.solution["zh-CN"]}\n\n**检验。** 所选的图中尖点是最低点，在尖点右边一个单位处图像高一个单位，正如 $y = |x|$ 从 $(0, 0)$ 升到 $(1, 1)$。`,
          ),
        };
      },
    ),
  ],
  "graphing-elementary-quadratic-functions": [
    skill(
      "choosing-the-drawing-of-a-parabola",
      ["Choosing the drawing of a parabola", "选出抛物线"],
      [
        "The graph of $y = ax^2 + c$ is a parabola with its vertex at $(0, c)$, through the point $(1, a + c)$. A positive $a$ opens it upward and a negative $a$ downward; a larger size of $a$ makes it narrower. Reading the vertex and the height at $x = 1$ settles all of this at once. For $y = 2x^2 - 1$ the vertex is $(0, -1)$ and the point at $x = 1$ is $(1, 1)$: two units above the vertex, where $y = x^2 - 1$ would be only one unit above.\n\n> **Watch out.** The sign of $a$ and its size answer different questions. A minus sign turns the parabola over but does not change its width, and a fraction such as $\\frac{1}{2}$ makes it wider, not narrower. Check the drawing at $x = 1$: it must be exactly the size of $a$ above or below the vertex.",
        "$y = ax^2 + c$ 的图像是顶点在 $(0, c)$ 的抛物线，经过点 $(1, a + c)$。$a$ 为正时开口向上，为负时开口向下；$a$ 的绝对值越大，开口越窄。读出顶点和 $x = 1$ 处的高度，这些就都确定了。对 $y = 2x^2 - 1$，顶点是 $(0, -1)$，$x = 1$ 处的点是 $(1, 1)$：比顶点高两个单位，而 $y = x^2 - 1$ 只高一个单位。\n\n> **注意。** $a$ 的符号和大小回答的是不同的问题。负号让抛物线翻转，但不改变宽窄；像 $\\frac{1}{2}$ 这样的分数让它变宽，而不是变窄。在 $x = 1$ 处检查图：它与顶点的高度差必须恰好等于 $a$ 的绝对值。",
      ],
      (rng) => {
        const a = rng.sign() * rng.pick([0.25, 0.5, 1, 2, 3]);
        const c = rng.int(-2, 2);
        const shape: Pair = ["A parabola", "一条抛物线"];
        const figure = (d: number) => curveFigure(wide, (x) => d * x * x + c, [0, 1], shape);
        const equation = `y = ${poly([coef(a), "x^2"])}${plus(c)}`;
        const height = tex([1, a + c]);
        const atOne = `${Math.abs(a) === 1 ? (a > 0 ? "" : "-") : `${num(coef(a))} \\cdot `}1^2${plus(c)}`;
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: figure(a),
          wrong: [figure(-a), figure(a * 2), figure(a / 2)],
          whys: [
            t("This parabola opens the wrong way: the sign of $a$ decides that.", "这条抛物线开口方向错了：开口方向由 $a$ 的符号决定。"),
            t(
              "This parabola is too narrow: at $x = 1$ it has moved twice as far from the vertex as $a$ says.",
              "这条抛物线太窄：在 $x = 1$ 处，它离顶点的距离是 $a$ 所示的两倍。",
            ),
            t(
              "This parabola is too wide: at $x = 1$ it has moved half as far from the vertex as $a$ says.",
              "这条抛物线太宽：在 $x = 1$ 处，它离顶点的距离是 $a$ 所示的一半。",
            ),
          ],
          solution: t(
            `**Step 1: Read the vertex and the direction.** At $x = 0$ the square is $0$, so the vertex is $${tex([0, c])}$. Since the coefficient $${num(coef(a))}$ is ${a > 0 ? "positive" : "negative"}, the parabola opens ${a > 0 ? "upward" : "downward"}.

**Step 2: Read the width.** At $x = 1$ the square is $1$, so the parabola reaches $${height}$, $${num(coef(Math.abs(a)))}$ ${Math.abs(a) > 1 ? "units" : "unit"} ${a > 0 ? "above" : "below"} the vertex. The drawing through both points is the graph.

**Check.** Put $x = 1$ into the equation: $y = ${atOne} = ${num(coef(a + c))}$, the height read in the drawing.`,
            `**第一步：读出顶点和开口方向。** $x = 0$ 时平方为 $0$，所以顶点是 $${tex([0, c])}$。因为系数 $${num(coef(a))}$ 是${a > 0 ? "正数" : "负数"}，所以开口向${a > 0 ? "上" : "下"}。

**第二步：读出宽窄。** $x = 1$ 时平方为 $1$，所以抛物线到达 $${height}$，在顶点${a > 0 ? "上方" : "下方"} $${num(coef(Math.abs(a)))}$ 个单位处。经过这两点的图就是所求图像。

**检验。** 把 $x = 1$ 代入方程：$y = ${atOne} = ${num(coef(a + c))}$，正是图中读出的高度。`,
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
        "The graph of $y = (x - h)^2 + k$ is the parabola $y = x^2$ with its vertex moved to $(h, k)$. A minus sign in front of the square turns it upside down. Read the vertex from the equation before looking at the drawings. For $y = (x + 1)^2 - 3$ the square is $0$ at $x = -1$, so the vertex is $(-1, -3)$, and one unit to its right the graph is one unit higher, at $(0, -2)$.\n\n> **Watch out.** The number inside the parentheses moves the graph the opposite way to its sign: $(x + 1)^2$ moves it $1$ to the **left**, since $x = -1$ makes the inside zero. The number added outside keeps its sign and moves the graph up or down.",
        "$y = (x - h)^2 + k$ 的图像是把抛物线 $y = x^2$ 的顶点移到 $(h, k)$。平方前面的负号把它上下翻转。先从方程读出顶点，再看图。对 $y = (x + 1)^2 - 3$，平方在 $x = -1$ 时为 $0$，所以顶点是 $(-1, -3)$；在它右边一个单位处，图像高一个单位，在 $(0, -2)$。\n\n> **注意。** 括号里的数使图像向与它的符号相反的方向移动：$(x + 1)^2$ 使图像向**左**移 $1$，因为 $x = -1$ 时括号里为零。外面加的数保持自己的符号，使图像上下移动。",
      ],
      (rng) => {
        const p = shiftChoice(
          rng,
          (x) => x * x,
          (inner) => `(${inner})^2`,
          ({ h }) => [h, h + 1],
          ["A parabola", "一条抛物线"],
          ["the vertex", "顶点"],
        );
        return {
          ...p,
          solution: t(
            `${p.solution.en}\n\n**Check.** In the chosen drawing the vertex is the lowest point, and one unit to the right of the vertex the graph is one unit higher, just as $y = x^2$ rises from $(0, 0)$ to $(1, 1)$.`,
            `${p.solution["zh-CN"]}\n\n**检验。** 所选的图中顶点是最低点，在顶点右边一个单位处图像高一个单位，正如 $y = x^2$ 从 $(0, 0)$ 升到 $(1, 1)$。`,
          ),
        };
      },
    ),
  ],
  "graphing-elementary-cubic-functions": [
    skill(
      "choosing-the-drawing-of-a-cubic",
      ["Choosing the drawing of a cubic", "选出三次函数的图像"],
      [
        "The graph of $y = (x - h)^3 + k$ is the S-shaped curve $y = x^3$ with its center moved to $(h, k)$. It rises from left to right; a minus sign in front makes it fall instead.\n\n> **Watch out.** The number inside the parentheses moves the center the opposite way to its sign: $(x + 2)^3$ has its center at $x = -2$, since that makes the inside zero. The number added outside keeps its sign and moves the center up or down.",
        "$y = (x - h)^3 + k$ 的图像是把 S 形曲线 $y = x^3$ 的中心移到 $(h, k)$。它从左到右上升；前面的负号让它改为下降。\n\n> **注意。** 括号里的数使中心向与它的符号相反的方向移动：$(x + 2)^3$ 的中心在 $x = -2$ 处，因为这时括号里为零。外面加的数保持自己的符号，使中心上下移动。",
      ],
      (rng) => {
        const p = shiftChoice(
          rng,
          (x) => x ** 3,
          (inner) => `(${inner})^3`,
          ({ h }) => [h, h + 1],
          ["An S-shaped curve", "一条 S 形曲线"],
          ["the center", "中心"],
        );
        return {
          ...p,
          solution: t(
            `${p.solution.en}\n\n**Check.** In the chosen drawing the curve flattens out at its center and rises from left to right, and one unit to the right of the center it is one unit higher, just as $y = x^3$ rises from $(0, 0)$ to $(1, 1)$.`,
            `${p.solution["zh-CN"]}\n\n**检验。** 所选的图中曲线在中心处变平，从左到右上升，在中心右边一个单位处高一个单位，正如 $y = x^3$ 从 $(0, 0)$ 升到 $(1, 1)$。`,
          ),
        };
      },
    ),
  ],
  "graphing-the-square-root-function": [
    skill(
      "choosing-the-drawing-of-a-square-root",
      ["Choosing the drawing of a square root", "选出平方根函数的图像"],
      [
        "The graph of $y = \\sqrt{x - h} + k$ starts at the point $(h, k)$ and bends to the right, since the root exists only when $x - h \\ge 0$. A minus sign in front of the root sends the curve down from its starting point.\n\n> **Watch out.** The number under the root moves the graph the opposite way to its sign: $\\sqrt{x + 2}$ starts at $x = -2$, since that makes the inside zero. The number added outside keeps its sign and moves the graph up or down.",
        "$y = \\sqrt{x - h} + k$ 的图像从点 $(h, k)$ 出发向右弯曲，因为只有当 $x - h \\ge 0$ 时根号才有意义。根号前面的负号让曲线从起点向下走。\n\n> **注意。** 根号里的数使图像向与它的符号相反的方向移动：$\\sqrt{x + 2}$ 的起点在 $x = -2$ 处，因为这时根号里为零。外面加的数保持自己的符号，使图像上下移动。",
      ],
      (rng) => {
        const p = shiftChoice(
          rng,
          Math.sqrt,
          (inner) => `\\sqrt{${inner}}`,
          ({ h }) => [h, h + 1],
          ["A curve starting at its first point", "一条从第一个点出发的曲线"],
          ["the starting point", "起点"],
        );
        return {
          ...p,
          solution: t(
            `${p.solution.en}\n\n**Check.** In the chosen drawing the curve starts at its lowest point and goes right, and one unit to the right of the start it is one unit higher, just as $y = \\sqrt{x}$ rises from $(0, 0)$ to $(1, 1)$.`,
            `${p.solution["zh-CN"]}\n\n**检验。** 所选的图中曲线从最低点出发向右延伸，在起点右边一个单位处高一个单位，正如 $y = \\sqrt{x}$ 从 $(0, 0)$ 升到 $(1, 1)$。`,
          ),
        };
      },
    ),
  ],
  "graphing-exponential-growth-functions": [
    skill(
      "choosing-the-drawing-of-exponential-growth",
      ["Choosing the drawing of exponential growth", "选出指数增长的图像"],
      [
        "The graph of $y = a \\cdot b^x + k$ with $a > 0$ and $b > 1$ crosses the $y$-axis at $(0, a + k)$, passes through $(1, ab + k)$, and rises faster and faster to the right. To the left it comes close to the line $y = k$ without touching it.\n\n> **Watch out.** Check three things on each drawing: it rises to the right (a base below $1$ would make it fall), it crosses the $y$-axis at $a + k$ (not higher), and it levels off at $y = k$, the added number.",
        "当 $a > 0$，$b > 1$ 时，$y = a \\cdot b^x + k$ 的图像与 $y$ 轴交于 $(0, a + k)$，经过 $(1, ab + k)$，向右上升得越来越快。向左它越来越接近直线 $y = k$，但不会碰到。\n\n> **注意。** 每张图都要检查三点：向右上升（底数小于 $1$ 会使它下降）；与 $y$ 轴交于 $a + k$（不能更高）；趋近于 $y = k$，即所加的数。",
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
          whys: [
            t("This curve falls to the right, but a base above $1$ makes it rise.", "这条曲线向右下降，但底数大于 $1$ 时曲线上升。"),
            t(
              "This curve starts too high: its value at $x = 0$ uses too large an $a$.",
              "这条曲线起点太高：它在 $x = 0$ 处的值用了过大的 $a$。",
            ),
            t(
              "This curve levels off at the wrong height: the added number is the asymptote.",
              "这条曲线趋近的高度不对：所加的数就是渐近线。",
            ),
          ],
          solution: t(
            `**Step 1:** plot two points. At $x = 0$ the power is $1$, so $y = ${a + k}$ and the curve crosses the $y$-axis at $${tex([0, a + k])}$. At $x = 1$, $y = ${a * b + k}$.\n\n**Step 2:** read the shape. Since the base $${b}$ is greater than $1$, the curve rises to the right, and to the left the power shrinks toward $0$, so the curve comes close to $y = ${k}$. The drawing that does all of this is the graph.\n\n**Check.** At $x = -1$, $y = ${factor(a)}\\frac{1}{${b}}${plus(k)}$, which lies between $${k}$ and $${a + k}$: on the left the curve is already close to its asymptote, as the chosen drawing shows.`,
            `**第一步：** 描两个点。当 $x = 0$ 时幂为 $1$，所以 $y = ${a + k}$，曲线与 $y$ 轴交于 $${tex([0, a + k])}$。当 $x = 1$ 时，$y = ${a * b + k}$。\n\n**第二步：** 看形状。因为底数 $${b}$ 大于 $1$，所以曲线向右上升；向左幂越来越接近 $0$，所以曲线接近 $y = ${k}$。同时满足这些的那张图就是所求图像。\n\n**检验。** 当 $x = -1$ 时，$y = ${factor(a)}\\frac{1}{${b}}${plus(k)}$，在 $${k}$ 与 $${a + k}$ 之间：曲线在左边已经接近渐近线，与所选的图一致。`,
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
        "The graph of $y = a \\cdot r^x + k$ with $a > 0$ and $0 < r < 1$ crosses the $y$-axis at $(0, a + k)$ and falls to the right, coming close to the line $y = k$ without touching it. Going one step left divides the power by $r$, which makes the curve climb steeply on the left.\n\n> **Watch out.** Check three things on each drawing: it falls to the right (a base above $1$ would make it rise), it crosses the $y$-axis at $a + k$ (not higher), and it levels off at $y = k$ on the right, the added number.",
        "当 $a > 0$，$0 < r < 1$ 时，$y = a \\cdot r^x + k$ 的图像与 $y$ 轴交于 $(0, a + k)$，向右下降，越来越接近直线 $y = k$ 但不会碰到。向左走一步，幂要除以 $r$，所以曲线在左边陡峭上升。\n\n> **注意。** 每张图都要检查三点：向右下降（底数大于 $1$ 会使它上升）；与 $y$ 轴交于 $a + k$（不能更高）；在右侧趋近于 $y = k$，即所加的数。",
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
          whys: [
            t(
              "This curve rises to the right, but a base between $0$ and $1$ makes it fall.",
              "这条曲线向右上升，但底数在 $0$ 和 $1$ 之间时曲线下降。",
            ),
            t(
              "This curve starts too high: its value at $x = 0$ uses too large an $a$.",
              "这条曲线起点太高：它在 $x = 0$ 处的值用了过大的 $a$。",
            ),
            t(
              "This curve levels off at the wrong height: the added number is the asymptote.",
              "这条曲线趋近的高度不对：所加的数就是渐近线。",
            ),
          ],
          solution: t(
            `**Step 1:** plot two points. At $x = 0$ the power is $1$, so $y = ${a + k}$ and the curve crosses the $y$-axis at $${tex([0, a + k])}$. At $x = -1$ the power is $${b}$, so $y = ${a * b + k}$.\n\n**Step 2:** read the shape. The base $\\frac{1}{${b}}$ is less than $1$, so the curve falls to the right, and there the power shrinks toward $0$, so the curve comes close to $y = ${k}$. The drawing that does all of this is the graph.\n\n**Check.** At $x = 1$, $y = ${factor(a)}\\frac{1}{${b}}${plus(k)}$, which lies between $${k}$ and $${a + k}$: on the right the curve is already close to its asymptote, as the chosen drawing shows.`,
            `**第一步：** 描两个点。当 $x = 0$ 时幂为 $1$，所以 $y = ${a + k}$，曲线与 $y$ 轴交于 $${tex([0, a + k])}$。当 $x = -1$ 时幂为 $${b}$，所以 $y = ${a * b + k}$。\n\n**第二步：** 看形状。底数 $\\frac{1}{${b}}$ 小于 $1$，所以曲线向右下降；在右侧幂越来越接近 $0$，所以曲线接近 $y = ${k}$。同时满足这些的那张图就是所求图像。\n\n**检验。** 当 $x = 1$ 时，$y = ${factor(a)}\\frac{1}{${b}}${plus(k)}$，在 $${k}$ 与 $${a + k}$ 之间：曲线在右边已经接近渐近线，与所选的图一致。`,
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
        `A logarithm is defined only for positive arguments, so $y = \\log_b(x - h) + k$ lives to the right of $x = h$: as $x$ comes down toward $h$, the argument shrinks toward $0$ and the logarithm drops without bound, so the vertical line $x = h$ is an asymptote. Two exact points pin the curve down: the argument is $1$ at $x = h + 1$, where $\\log_b 1 = 0$, and $b$ at $x = h + b$, where $\\log_b b = 1$. With $b > 1$ the curve rises slowly to the right.

Take $y = \\log_{2}(x + 1) + 3$, where $h = -1$. The asymptote is $x = -1$. At $x = 0$ the argument is $1$, so $y = 0 + 3 = 3$; at $x = 1$ the argument is $2$, so $y = 1 + 3 = 4$. The graph climbs from near $x = -1$ through $(0, 3)$ and $(1, 4)$.

> **Watch out.** A curve that falls to the right is a flipped logarithm, $-\\log_b$. A curve through the right points shifted the wrong way up or down used $-k$ instead of $+k$. And a curve that crosses the $y$-axis and grows faster and faster is the inverse, an exponential, not the logarithm.`,
        `对数只对正的真数有定义，所以 $y = \\log_b(x - h) + k$ 的图像在 $x = h$ 的右边：$x$ 向 $h$ 靠近时，真数趋近 $0$，对数无限减小，所以竖直线 $x = h$ 是渐近线。两个准确的点确定曲线：$x = h + 1$ 时真数是 $1$，$\\log_b 1 = 0$；$x = h + b$ 时真数是 $b$，$\\log_b b = 1$。$b > 1$ 时曲线向右缓慢上升。

取 $y = \\log_{2}(x + 1) + 3$，这里 $h = -1$。渐近线是 $x = -1$。$x = 0$ 时真数是 $1$，所以 $y = 0 + 3 = 3$；$x = 1$ 时真数是 $2$，所以 $y = 1 + 3 = 4$。图像从 $x = -1$ 附近上升，经过 $(0, 3)$ 和 $(1, 4)$。

> **注意。** 向右下降的曲线是翻转的对数 $-\\log_b$。经过的点上下移错的曲线把 $+k$ 用成了 $-k$。与 $y$ 轴相交、越长越快的曲线是反函数，即指数函数，而不是对数函数。`,
      ],
      (rng) => {
        const b = rng.pick([2, 3]);
        const h = rng.int(0, 2);
        const k = rng.int(-2, 2);
        const log = (x: number) => Math.log(x) / Math.log(b);
        const shape: Pair = ["A curve", "一条曲线"];
        const inside = h === 0 ? "x" : `(x - ${h})`;
        const equation = `y = \\log_{${b}} ${inside}${plus(k)}`;
        const val = (v: number) => (k === 0 ? String(v) : `${v}${plus(k)} = ${v + k}`);
        return figureChoice(rng, {
          prompt: t(`Which drawing shows the graph of $${equation}$?`, `哪张图是 $${equation}$ 的图像？`),
          correct: curveFigure(logView, (x) => log(x - h) + k, [h + 1, h + b], shape),
          wrong: [
            curveFigure(logView, (x) => -log(x - h) + k, [h + 1, h + b], shape),
            curveFigure(logView, (x) => log(x - h) - k, [h + 1, h + b], shape),
            curveFigure(logView, (x) => b ** (x - k) + h, [k, k + 1], shape),
          ],
          whys: [
            t("This curve is flipped: with a base above $1$, a logarithm rises.", "这条曲线翻转了：底数大于 $1$ 时，对数上升。"),
            t("This curve sits at the wrong height: the added number moves it up or down.", "这条曲线高度不对：所加的数使它上下移动。"),
            t("This is the graph of the inverse function, an exponential.", "这是反函数（指数函数）的图像。"),
          ],
          solution: t(
            `${stepLabel(1, "find the asymptote", "找渐近线").en} The argument $${h === 0 ? "x" : `x - ${h}`}$ must be positive, so the curve exists only for $x > ${h}$ and comes down along the vertical line $x = ${h}$ without touching it.\n\n${stepLabel(2, "plot two points", "描两个点").en} At $x = ${h + 1}$ the argument is $1$, so $y = ${val(0)}$: the point $${tex([h + 1, k])}$. At $x = ${h + b}$ the argument is $${b}$, so $y = ${val(1)}$: the point $${tex([h + b, k + 1])}$. The base $${b}$ is above $1$, so the curve rises to the right through both points; the drawing that does this is the graph.\n\n**Check.** Try $x = ${h + b * b}$: the argument is $${b * b} = ${b}^{2}$, so $y = ${val(2)}$, a little higher again, as a slowly rising logarithm should be.`,
            `${stepLabel(1, "find the asymptote", "找渐近线")["zh-CN"]}真数 $${h === 0 ? "x" : `x - ${h}`}$ 必须为正，所以曲线只在 $x > ${h}$ 时存在，沿着竖直线 $x = ${h}$ 向下延伸而不与它相交。\n\n${stepLabel(2, "plot two points", "描两个点")["zh-CN"]}$x = ${h + 1}$ 时真数是 $1$，所以 $y = ${val(0)}$，得到点 $${tex([h + 1, k])}$。$x = ${h + b}$ 时真数是 $${b}$，所以 $y = ${val(1)}$，得到点 $${tex([h + b, k + 1])}$。底数 $${b}$ 大于 $1$，所以曲线经过这两点向右上升；这样的那张图就是所求图像。\n\n**检验。** 取 $x = ${h + b * b}$：真数是 $${b * b} = ${b}^{2}$，所以 $y = ${val(2)}$，又高了一点，正符合对数缓慢上升的样子。`,
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
        `The values of $\\sin x$ and $\\cos x$ run from $-1$ to $1$. Multiplying by $A$ stretches them to run from $-|A|$ to $|A|$, and adding $k$ lifts every point by $k$. So the graph of $y = A\\sin x + k$ or $y = A\\cos x + k$ swings around the middle line $y = k$, reaching $|A|$ above and below it. The value at $x = 0$ tells sine from cosine. Since $\\sin 0 = 0$, a sine starts at $k$, on the middle line. Since $\\cos 0 = 1$, a cosine starts at $A + k$, at a peak or a trough. Just right of $x = 0$, $\\sin x$ is positive, so a sine with $A > 0$ rises there and one with $A < 0$ falls.

Take $y = 2\\sin x - 1$. The middle line is $y = -1$, and the wave runs from $-3$ to $1$. At $x = 0$, $y = 2 \\cdot 0 - 1 = -1$, on the middle line. Since $A = 2 > 0$ it rises, to its peak $2 \\cdot 1 - 1 = 1$ at $x = \\frac{\\pi}{2}$.

> **Watch out.** A wave that starts at a peak or a trough is a cosine, not a sine. A sine that falls first has a negative $A$. And $|A|$ is the distance from the middle line to a peak, not from a trough to a peak, which is $2|A|$.`,
        `$\\sin x$ 和 $\\cos x$ 的值都在 $-1$ 到 $1$ 之间。乘以 $A$ 把它们拉伸到 $-|A|$ 到 $|A|$ 之间，再加 $k$ 把每个点抬高 $k$。所以 $y = A\\sin x + k$ 或 $y = A\\cos x + k$ 的图像围绕中线 $y = k$ 摆动，上下各到 $|A|$。$x = 0$ 处的值可以区分正弦和余弦。因为 $\\sin 0 = 0$，正弦从 $k$ 出发，在中线上。因为 $\\cos 0 = 1$，余弦从 $A + k$ 出发，在波峰或波谷。在 $x = 0$ 右侧附近 $\\sin x$ 为正，所以 $A > 0$ 的正弦在那里上升，$A < 0$ 的正弦下降。

取 $y = 2\\sin x - 1$。中线是 $y = -1$，曲线在 $-3$ 到 $1$ 之间。$x = 0$ 时 $y = 2 \\cdot 0 - 1 = -1$，在中线上。因为 $A = 2 > 0$，曲线上升，在 $x = \\frac{\\pi}{2}$ 处到达波峰 $2 \\cdot 1 - 1 = 1$。

> **注意。** 从波峰或波谷出发的曲线是余弦，不是正弦。先下降的正弦，$A$ 为负。$|A|$ 是中线到波峰的距离，不是波谷到波峰的距离，后者是 $2|A|$。`,
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
          whys: [
            t(
              "This wave is the other function: at $x = 0$, sine sits on its midline and cosine at its peak.",
              "这条波是另一个函数：在 $x = 0$ 处，正弦在中线上，余弦在波峰。",
            ),
            t("This wave is flipped: its first move from $x = 0$ goes the wrong way.", "这条波翻转了：它从 $x = 0$ 出发后第一步方向错了。"),
            t("This wave has the wrong height: the number in front is the amplitude.", "这条波的高度不对：前面的数是振幅。"),
          ],
          solution: t(
            `${stepLabel(1, "Read the middle line and the height", "读出中线和高度").en} The middle line is $y = ${k}$, and the wave swings $${Math.abs(A)}$ above and below it, from $${k - Math.abs(A)}$ to $${k + Math.abs(A)}$.\n\n${stepLabel(2, "Read the start", "读出起点").en} At $x = 0$, $y = ${start}$, because $${name} 0 = ${sine ? 0 : 1}$. ${sine ? `To the right of $x = 0$ the wave ${A > 0 ? "rises" : "falls"}, since $\\sin x$ is positive there and $${num(A)}$ is ${A > 0 ? "positive" : "negative"}.` : `That is ${A > 0 ? "a peak" : "a trough"}, since $${num(A)}$ is ${A > 0 ? "positive" : "negative"}.`} Only one drawing does all of this.\n\n**Check.** ${sine ? `At $x = \\frac{\\pi}{2}$, where $\\sin x = 1$, the graph should be at $${A + k}$, ${A > 0 ? "its peak" : "its trough"}.` : `At $x = \\pi$, where $\\cos x = -1$, the graph should be at $${k - A}$, ${A > 0 ? "its trough" : "its peak"}.`} The right drawing passes through that point too.`,
            `${stepLabel(1, "Read the middle line and the height", "读出中线和高度")["zh-CN"]}中线是 $y = ${k}$，曲线在它上下各摆动 $${Math.abs(A)}$，从 $${k - Math.abs(A)}$ 到 $${k + Math.abs(A)}$。\n\n${stepLabel(2, "Read the start", "读出起点")["zh-CN"]}当 $x = 0$ 时，$y = ${start}$，因为 $${name} 0 = ${sine ? 0 : 1}$。${sine ? `在 $x = 0$ 右侧曲线${A > 0 ? "上升" : "下降"}，因为此处 $\\sin x$ 为正，而 $${num(A)}$ 为${A > 0 ? "正" : "负"}数。` : `这是${A > 0 ? "波峰" : "波谷"}，因为 $${num(A)}$ 为${A > 0 ? "正" : "负"}数。`}只有一张图同时符合这些。\n\n**检验。**${sine ? `在 $x = \\frac{\\pi}{2}$ 处 $\\sin x = 1$，图像应在 $${A + k}$，是${A > 0 ? "波峰" : "波谷"}。` : `在 $x = \\pi$ 处 $\\cos x = -1$，图像应在 $${k - A}$，是${A > 0 ? "波谷" : "波峰"}。`}正确的图也经过这一点。`,
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
        "If $(a, b)$ is on the graph of $f$, then $(b, a)$ is on the graph of $f^{-1}$. Swapping the coordinates of every point reflects the graph across the line $y = x$. To check a drawing, swap the coordinates of two points of $f$ and see whether both land on it.\n\n> **Watch out.** The inverse of a line with slope $m$ does not have slope $-m$. Rise and run swap, so its slope is $\\frac{1}{m}$.",
        "如果 $(a, b)$ 在 $f$ 的图像上，那么 $(b, a)$ 就在 $f^{-1}$ 的图像上。把每个点的坐标交换，就是把图像关于直线 $y = x$ 翻折。检查图时，把 $f$ 上两个点的坐标交换，看它们是否都落在图上。\n\n> **注意。** 斜率为 $m$ 的直线，其反函数的斜率不是 $-m$。竖直变化量与水平变化量互换，所以斜率是 $\\frac{1}{m}$。",
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
          whys: [
            t(
              "This line is the mirror image of $f$ across the $y$-axis, not across $y = x$.",
              "这条直线是 $f$ 关于 $y$ 轴的镜像，而不是关于 $y = x$ 的。",
            ),
            t(
              "This line is the mirror image of $f$ across the $x$-axis, not across $y = x$. An inverse is not a negative.",
              "这条直线是 $f$ 关于 $x$ 轴的镜像，而不是关于 $y = x$ 的。反函数不是相反数。",
            ),
            t(
              "This line is $f$ turned half a turn about the origin. An inverse swaps the coordinates.",
              "这条直线是 $f$ 绕原点转半圈的结果。反函数要对调坐标。",
            ),
          ],
          solution: t(
            `${stepLabel(1, "Read two points of f", "读出 f 上的两个点").en} The graph of $f$ passes through $${tex(p)}$ and $${tex(r)}$.\n\n${stepLabel(2, "Swap the coordinates", "交换坐标").en} Swapping gives $${tex([p[1], p[0]])}$ and $${tex([r[1], r[0]])}$, which lie on the graph of $f^{-1}$. Only one drawing passes through both, and it is the mirror image of $f$ across $y = x$.\n\n**Check.** Going from the first swapped point to the second, the height rises by $1$ while $x$ changes by $${num(coef(m))}$. So the line through them has slope\n\n$$\\frac{1}{${num(coef(m))}} = ${num(Q.one.div(Q.of(Math.round(m * 4), 4)))}$$\n\nThat is the reciprocal of the slope of $f$, as it must be when rise and run swap.`,
            `${stepLabel(1, "Read two points of f", "读出 f 上的两个点")["zh-CN"]}$f$ 的图像经过 $${tex(p)}$ 和 $${tex(r)}$。\n\n${stepLabel(2, "Swap the coordinates", "交换坐标")["zh-CN"]}交换坐标得到 $${tex([p[1], p[0]])}$ 和 $${tex([r[1], r[0]])}$，它们都在 $f^{-1}$ 的图像上。只有一张图同时经过这两点，它就是 $f$ 关于 $y = x$ 的镜像。\n\n**检验。** 从交换后的第一个点到第二个点，高度增加 $1$，$x$ 变化 $${num(coef(m))}$。所以过它们的直线斜率是\n\n$$\\frac{1}{${num(coef(m))}} = ${num(Q.one.div(Q.of(Math.round(m * 4), 4)))}$$\n\n这正是 $f$ 斜率的倒数，符合竖直变化量与水平变化量互换的要求。`,
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
        "A translation moves every point by the same amount in the same direction. Pick one vertex and count the move on the grid; if the image of that vertex is right, check that the other vertices moved by the same amount. The image has the same size and faces the same way.\n\n> **Watch out.** Keep the two distances apart and keep their directions: a drawing that moves $3$ up and $2$ across instead of $2$ up and $3$ across, or the right distance the wrong way, is also a slide, but of a different translation.",
        "平移把每个点沿同一方向移动相同的距离。选一个顶点，在网格上数出移动量；如果这个顶点的像对了，再检查其他顶点是否移动了相同的量。像的大小和朝向都不变。\n\n> **注意。** 两个距离不要对调，方向也不要弄反：把“横移 $3$、竖移 $2$”画成“横移 $2$、竖移 $3$”，或者距离对但方向反了，画出来也是平移，只是另一个平移。",
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
          whys: [
            t("This image swaps the two distances: the move across and the move up.", "这个像把水平和竖直两个距离对调了。"),
            t("This image moves the wrong way across.", "这个像水平方向移反了。"),
            t("This image moves the wrong way up or down.", "这个像竖直方向移反了。"),
          ],
          solution: t(
            `${stepLabel(1, "write the move", "写出移动量").en} Moving $${Math.abs(p)}$ units ${across} and $${Math.abs(q)}$ units ${up} adds $${num(p)}$ to every $x$-coordinate and $${num(q)}$ to every $y$-coordinate.\n\n${stepLabel(2, "move the vertices", "移动顶点").en} ${pts.map((v, i) => `$${names[i]}${tex(v)} \\to ${names[i]}'${tex([v[0] + p, v[1] + q])}$`).join(", ")}. The right drawing has its image at these three points, the same size and facing the same way.\n\n**Check.** Move $A'${tex([first[0] + p, first[1] + q])}$ back, $${Math.abs(p)}$ units ${p > 0 ? "left" : "right"} and $${Math.abs(q)}$ units ${q > 0 ? "down" : "up"}: it lands on $${tex(first)}$, which is $A$.`,
            `${stepLabel(1, "write the move", "写出移动量")["zh-CN"]}向${acrossZh}平移 $${Math.abs(p)}$ 个单位、向${upZh}平移 $${Math.abs(q)}$ 个单位，就是每个 $x$ 坐标加 $${num(p)}$，每个 $y$ 坐标加 $${num(q)}$。\n\n${stepLabel(2, "move the vertices", "移动顶点")["zh-CN"]}${pts.map((v, i) => `$${names[i]}${tex(v)} \\to ${names[i]}'${tex([v[0] + p, v[1] + q])}$`).join("，")}。正确的图中，像的顶点就在这三处，大小和朝向都不变。\n\n**检验。** 把 $A'${tex([first[0] + p, first[1] + q])}$ 移回去，向${p > 0 ? "左" : "右"}移 $${Math.abs(p)}$ 个单位、向${q > 0 ? "下" : "上"}移 $${Math.abs(q)}$ 个单位：落在 $${tex(first)}$，正是 $A$。`,
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
        "A rotation about the origin keeps every point at the same distance from the origin and turns it through the same angle. A quarter turn counterclockwise carries the first quadrant into the second, and a quarter turn clockwise carries it into the fourth. So first check which quadrant the image lies in, then check the vertices.\n\n> **Watch out.** Counterclockwise turns from the positive $x$-axis toward the positive $y$-axis. A quarter turn the other way, or a reflection, lands next door; a reflection also reverses the order of the vertices around the triangle, while a rotation keeps it.",
        "绕原点旋转时，每个点到原点的距离不变，并转过相同的角。逆时针转四分之一圈把第一象限转到第二象限，顺时针转四分之一圈把它转到第四象限。所以先看像在哪个象限，再检查顶点。\n\n> **注意。** 逆时针是从 $x$ 轴正方向转向 $y$ 轴正方向。反方向转四分之一圈，或者做一次翻折，像会落到相邻的象限；翻折还会让三角形顶点的环绕顺序反过来，旋转则不会。",
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
        "A half turn about the origin sends $(x, y)$ to $(-x, -y)$. A turn of $270^\\circ$ counterclockwise is the same as a quarter turn clockwise, and sends $(x, y)$ to $(y, -x)$. A drawing is right when every vertex of the image follows the rule.\n\n> **Watch out.** $270^\\circ$ counterclockwise is not $(x, y) \\to (-y, x)$: that is $90^\\circ$ counterclockwise. Test one vertex: a $270^\\circ$ turn sends $(1, 2)$ to $(2, -1)$, a $90^\\circ$ turn to $(-2, 1)$.",
        "绕原点转半圈把 $(x, y)$ 变成 $(-x, -y)$。逆时针转 $270^\\circ$ 等于顺时针转四分之一圈，把 $(x, y)$ 变成 $(y, -x)$。只有像的每个顶点都符合规则，图才是对的。\n\n> **注意。** 逆时针 $270^\\circ$ 不是 $(x, y) \\to (-y, x)$，那是逆时针 $90^\\circ$。用一个顶点试一试：转 $270^\\circ$ 把 $(1, 2)$ 变成 $(2, -1)$，转 $90^\\circ$ 则变成 $(-2, 1)$。",
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
        "A reflection flips a figure over a line: each point and its image are the same distance from the line, on opposite sides, and the figure's direction around its vertices reverses. Across the $x$-axis $y$ changes sign, across the $y$-axis $x$ changes sign, and across $y = x$ the coordinates swap.\n\n> **Watch out.** Across the $x$-axis it is $y$ that changes sign, not $x$: the image stays straight above or below the point. Across $y = -x$ the coordinates swap *and* both change sign.",
        "翻折把图形沿一条直线翻过去：每个点和它的像到这条线的距离相等，分在两侧，而且顶点的环绕方向会反过来。关于 $x$ 轴翻折时 $y$ 变号，关于 $y$ 轴翻折时 $x$ 变号，关于 $y = x$ 翻折时两个坐标交换。\n\n> **注意。** 关于 $x$ 轴翻折时变号的是 $y$，不是 $x$：像在原来那个点的正上方或正下方。关于 $y = -x$ 翻折时，两个坐标交换，*并且*都变号。",
      ],
      (rng) => {
        const right = rng.pick(["overX", "overY", "overDiagonal", "overOtherDiagonal"]);
        const others = ["overX", "overY", "overDiagonal", "overOtherDiagonal", "half"].filter((o) => o !== right);
        return motionChoice(rng, ["reflected", "翻折"], right, rng.shuffle(others).slice(0, 3));
      },
    ),
  ],
  "representing-solutions-to-inequalities-on-number-lines": [
    {
      ...skill(
        "choosing-the-number-line-of-an-inequality",
        ["Choosing the number line of an inequality", "选出不等式的数轴表示"],
        [
          "First solve the inequality, remembering that dividing by a negative number reverses it. Then read the drawing: a filled dot means the number itself is a solution and an open circle means it is not, and the arrow points toward the other solutions. $-2x + 1 > -5$ gives $-2x > -6$, so $x < 3$: an open circle at $3$ with the arrow to the left.\n\nCheck: $x = 2$ is on the arrow, and $-2(2) + 1 = -3 > -5$ is true.\n\n> **Watch out.** The arrow follows the solved inequality, not the original symbol: $>$ in $-2x + 1 > -5$ ends up pointing left.",
          "先解不等式，记住除以负数时不等号要反向。然后看图：实心点表示这个数本身是解，空心圈表示不是，箭头指向其余的解。$-2x + 1 > -5$ 得 $-2x > -6$，所以 $x < 3$：在 $3$ 处画空心圈，箭头向左。\n\n检验：$x = 2$ 在箭头上，$-2(2) + 1 = -3 > -5$ 成立。\n\n> **注意。** 箭头方向看解出来的不等式，不看原来的符号：$-2x + 1 > -5$ 中的 $>$ 最后指向左边。",
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
          const tv = right ? a + 1 : a - 1;
          const s1 = stepLabel(1, "Solve", "求解");
          const s2 = stepLabel(2, "Read the drawing", "看图");
          const undo =
            c === 0
              ? ["", ""]
              : [
                  `${c > 0 ? `subtract $${c}$ from` : `add $${-c}$ to`} both sides, $${num(k)}x ${sign} ${num(d - c)}$, then `,
                  `两边${c > 0 ? `减去 $${c}$` : `加上 $${-c}$`}，得 $${num(k)}x ${sign} ${num(d - c)}$，再`,
                ];
          const tested = `${num(k)}(${tv})${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}`;
          return figureChoice(rng, {
            prompt: t(
              `Which number line shows the solutions of $${left} ${sign} ${num(d)}$?`,
              `哪条数轴表示 $${left} ${sign} ${num(d)}$ 的解？`,
            ),
            correct: drawn(right, closed),
            wrong: [drawn(!right, closed), drawn(right, !closed), drawn(!right, !closed)],
            whys: [
              t(
                "The arrow points the wrong way. Dividing by a negative number reverses the inequality.",
                "箭头方向错了。除以负数时不等号要变向。",
              ),
              t(
                "The dot is wrong: a filled dot means the point counts, an open one that it does not.",
                "圆点不对：实心表示这一点算，空心表示不算。",
              ),
              t("Both the arrow and the dot are wrong.", "箭头和圆点都错了。"),
            ],
            solution: t(
              `${s1.en} ${undo[0] ? undo[0].charAt(0).toUpperCase() + undo[0].slice(1) : ""}${undo[0] ? "divide" : "Divide"} by $${num(k)}$${k < 0 ? ", which reverses the inequality" : ""}: $x ${right ? greater : less} ${num(a)}$.\n\n${s2.en} The ${closed ? "dot" : "circle"} at $${num(a)}$ is ${closed ? "filled" : "open"}, and the arrow points ${right ? "right" : "left"}.\n\n**Check.** $x = ${tv}$ is on the arrow: $${tested} = ${k * tv + c}$, and $${k * tv + c} ${sign} ${num(d)}$ is true.`,
              `${s1["zh-CN"]}${undo[1]}两边除以 $${num(k)}$${k < 0 ? "，不等号反向" : ""}：$x ${right ? greater : less} ${num(a)}$。\n\n${s2["zh-CN"]}$${num(a)}$ 处是${closed ? "实心点" : "空心圈"}，箭头指向${right ? "右" : "左"}。\n\n**检验。** $x = ${tv}$ 在箭头上：$${tested} = ${k * tv + c}$，$${k * tv + c} ${sign} ${num(d)}$ 成立。`,
            ),
          });
        },
      ),
      figure: numberLineFigure(ray(3, false, false), -2, 8),
    },
  ],
  "fractions-on-the-number-line": [
    {
      ...skill(
        "choosing-the-number-line-of-a-fraction",
        ["Choosing the number line of a fraction", "选出分数在数轴上的位置"],
        [
          "Place $\\frac{3}{4}$. The denominator 4 cuts the line from 0 to 1 into 4 equal spaces, which takes 5 tick marks. The numerator 3 says to count 3 spaces from 0.\n\nCheck: the dot is 1 space short of 1, and $\\frac{3}{4} + \\frac{1}{4} = 1$.\n\n> **Watch out.** Count the spaces between the tick marks, not the tick marks.",
          "标出 $\\frac{3}{4}$。分母 4 把 0 到 1 平均分成 4 格，需要 5 个刻度。分子 3 表示从 0 开始数 3 格。\n\n检验：点离 1 还差 1 格，$\\frac{3}{4} + \\frac{1}{4} = 1$。\n\n> **注意。** 要数刻度之间的格，不是数刻度。",
        ],
        (rng) => {
          const d = rng.int(3, 8);
          const n = rng.int(1, d - 1);
          const other = n === d - 1 ? n - 1 : n + 1;
          return figureChoice(rng, {
            prompt: t(`Which number line has a dot at $\\frac{${n}}{${d}}$?`, `哪条数轴上的点表示 $\\frac{${n}}{${d}}$？`),
            correct: partsFigure(d, n),
            wrong: [partsFigure(d + 1, n), partsFigure(d, other), partsFigure(d - 1 === n ? d + 2 : d - 1, n)],
            whys: [
              t(
                "This line is cut into too many parts: it counts the tick marks, not the spaces.",
                "这条线分得太多了：它数的是刻度，不是格。",
              ),
              t("This line is cut correctly, but the dot is the wrong number of parts from $0$.", "这条线分得对，但点离 $0$ 的格数不对。"),
              t(
                "This line is cut into the wrong number of parts: the denominator is the number of equal parts.",
                "这条线分的份数不对：分母就是平均分成的份数。",
              ),
            ],
            solution: t(
              `${stepLabel(1, "count the spaces", "数格").en} The denominator $${d}$ cuts the line from $0$ to $1$ into $${d}$ equal spaces, which takes $${d + 1}$ tick marks.\n\n${stepLabel(2, "count from 0", "从 0 开始数").en} The numerator $${n}$ puts the dot $${n}$ space${n === 1 ? "" : "s"} from $0$.\n\n**Check.** The dot is $${d - n}$ space${d - n === 1 ? "" : "s"} short of $1$, and $\\frac{${n}}{${d}} + \\frac{${d - n}}{${d}} = 1$.`,
              `${stepLabel(1, "count the spaces", "数格")["zh-CN"]}分母 $${d}$ 把 $0$ 到 $1$ 平均分成 $${d}$ 格，需要 $${d + 1}$ 个刻度。\n\n${stepLabel(2, "count from 0", "从 0 开始数")["zh-CN"]}分子 $${n}$ 表示点离 $0$ 有 $${n}$ 格。\n\n**检验。**点离 $1$ 还差 $${d - n}$ 格，$\\frac{${n}}{${d}} + \\frac{${d - n}}{${d}} = 1$。`,
            ),
          });
        },
      ),
      figure: partsFigure(4, 3),
    },
  ],
};
