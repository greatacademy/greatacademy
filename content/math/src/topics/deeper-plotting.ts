// Knowledge points answered by marking points on a grid. Producing a point or a line is a different
// skill from recognizing one: nothing on the page suggests where it goes.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, type PlaneView, poly } from "@ga/subject-math";

import { plotProblem } from "../problems.ts";

type Pair = readonly [string, string];
type Pt = readonly [number, number];

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** grid is the window of most drawings here. */
const grid: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6, labelEvery: 2 };

/** blank describes a grid with nothing on it. */
const blank = t("An empty coordinate grid.", "一张空白的坐标网格。");

/** tex writes a point as LaTeX. */
const tex = (p: Pt) => `(${p[0]}, ${p[1]})`;

/** nonzero picks a whole number from -n to n other than 0. */
const nonzero = (rng: Rng, n: number) => rng.sign() * rng.int(1, n);

/** dot is a labeled point the drawing starts from. */
const dot = (at: Pt, label: string): PlaneMark => ({ kind: "point", at, label, dir: "ne", accent: true });

/** apart picks two numbers from -n to n, neither zero, with different sizes, so that mistakes lead to different points. */
function apart(rng: Rng, n: number): Pt {
  const a = nonzero(rng, n);
  let b = nonzero(rng, n);
  while (Math.abs(b) === Math.abs(a)) b = nonzero(rng, n);
  return [a, b];
}

/** walk says how to reach a point from the origin. */
const walk = ([x, y]: Pt): Text =>
  t(
    `Start at the origin. Go $${Math.abs(x)}$ ${x < 0 ? "left" : "right"} for the first coordinate, then $${Math.abs(y)}$ ${y < 0 ? "down" : "up"} for the second.`,
    `从原点出发。第一个坐标：向${x < 0 ? "左" : "右"}走 $${Math.abs(x)}$；第二个坐标：向${y < 0 ? "下" : "上"}走 $${Math.abs(y)}$。`,
  );

/** slip are the mistakes of reading a point's coordinates. */
const slip = ([x, y]: Pt) => [
  {
    at: [[y, x] as Pt],
    why: t(
      "You swapped the coordinates: the first says how far across, the second how far up.",
      "你把坐标对调了：第一个是水平距离，第二个是竖直距离。",
    ),
  },
  {
    at: [[-x, y] as Pt],
    why: t("The first coordinate has the wrong sign: check left or right.", "第一个坐标的符号错了：看向左还是向右。"),
  },
  { at: [[x, -y] as Pt], why: t("The second coordinate has the wrong sign: check up or down.", "第二个坐标的符号错了：看向上还是向下。") },
];

/** markingPoint asks to mark a point given by its coordinates. */
function markingPoint(view: PlaneView, step: number, p: Pt) {
  return plotProblem({
    prompt: t(`Mark the point $${tex(p)}$ on the grid.`, `在网格上标出点 $${tex(p)}$。`),
    view,
    step,
    alt: blank,
    answer: [p],
    wrong: slip(p),
    solution: walk(p),
    solutionAlt: t(`The point ${tex(p)} on the grid.`, `网格上的点 ${tex(p)}。`),
  });
}

/** rotations are the turns about the origin used here. */
const rotations: readonly { readonly move: (p: Pt) => Pt; readonly rule: string; readonly en: string; readonly zh: string }[] = [
  { move: ([x, y]) => [-y, x], rule: "(x, y) \\to (-y, x)", en: "$90^\\circ$ counterclockwise", zh: "逆时针 $90^\\circ$" },
  { move: ([x, y]) => [y, -x], rule: "(x, y) \\to (y, -x)", en: "$90^\\circ$ clockwise", zh: "顺时针 $90^\\circ$" },
  { move: ([x, y]) => [-x, -y], rule: "(x, y) \\to (-x, -y)", en: "$180^\\circ$", zh: "$180^\\circ$" },
];

/** mirrors are the reflections in the coordinate plane used here. */
const mirrors: readonly {
  readonly move: (p: Pt) => Pt;
  readonly rule: string;
  readonly en: string;
  readonly zh: string;
  readonly line: PlaneMark;
}[] = [
  {
    move: ([x, y]) => [y, x],
    rule: "(x, y) \\to (y, x)",
    en: "the line $y = x$",
    zh: "直线 $y = x$",
    line: { kind: "line", a: [0, 0], b: [1, 1], dashed: true, tone: "action" },
  },
  {
    move: ([x, y]) => [-y, -x],
    rule: "(x, y) \\to (-y, -x)",
    en: "the line $y = -x$",
    zh: "直线 $y = -x$",
    line: { kind: "line", a: [0, 0], b: [1, -1], dashed: true, tone: "action" },
  },
  {
    move: ([x, y]) => [x, -y],
    rule: "(x, y) \\to (x, -y)",
    en: "the $x$-axis",
    zh: "$x$ 轴",
    line: { kind: "line", a: [0, 0], b: [1, 0], dashed: true, tone: "action" },
  },
  {
    move: ([x, y]) => [-x, y],
    rule: "(x, y) \\to (-x, y)",
    en: "the $y$-axis",
    zh: "$y$ 轴",
    line: { kind: "line", a: [0, 0], b: [0, 1], dashed: true, tone: "action" },
  },
];

/** plottingPoints adds to each topic the knowledge points answered by marking the grid. */
export const plottingPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-coordinate-plane": [
    skill(
      "marking-a-point-on-the-grid",
      ["Marking a point on the grid", "在网格上标点"],
      [
        "To mark the point $(x, y)$, start at the origin. The first coordinate tells you how far to go across: right if it is positive, left if it is negative. The second tells you how far to go from there: up if it is positive, down if it is negative. The order matters, because $(2, 5)$ and $(5, 2)$ are different places.",
        "要标出点 $(x, y)$，从原点出发。第一个坐标表示水平走多远：正数向右，负数向左。第二个坐标表示接着竖直走多远：正数向上，负数向下。顺序很重要，因为 $(2, 5)$ 和 $(5, 2)$ 是不同的位置。",
      ],
      (rng) => {
        const [a, b] = apart(rng, 5);
        return markingPoint(grid, 1, [a, b]);
      },
    ),
  ],
  "rational-numbers-in-the-coordinate-plane": [
    skill(
      "marking-a-point-with-halves",
      ["Marking a point with halves", "标出坐标含二分之一的点"],
      [
        "A coordinate need not be a whole number. Grid lines here are half a unit apart, so $(1.5, -2)$ sits halfway between $x = 1$ and $x = 2$, on the line $y = -2$. Move across first, then up or down, counting two grid lines for each whole unit.",
        "坐标不一定是整数。这里网格线之间相距半个单位，所以 $(1.5, -2)$ 位于 $x = 1$ 和 $x = 2$ 的正中间，在直线 $y = -2$ 上。先水平移动，再上下移动，每一个单位数两条网格线。",
      ],
      (rng) => {
        const view: PlaneView = { xMin: -4, xMax: 4, yMin: -4, yMax: 4, step: 0.5, labelEvery: 2 };
        const half = () => rng.sign() * (rng.int(0, 3) + 0.5);
        const whole = nonzero(rng, 3);
        const p: Pt = rng.bool() ? [half(), whole] : [whole, half()];
        return markingPoint(view, 0.5, p);
      },
    ),
  ],
  "reflections-of-points-in-the-coordinate-plane": [
    skill(
      "marking-a-reflected-point",
      ["Marking a reflected point", "标出反射后的点"],
      [
        "A reflection across an axis keeps a point at the same distance from that axis, on the other side. Across the $x$-axis the point moves up or down, so its second coordinate changes sign and its first stays. Across the $y$-axis it moves left or right, so its first coordinate changes sign and its second stays.",
        "关于坐标轴的反射使点到这条轴的距离不变，并落到另一侧。关于 $x$ 轴反射时，点上下移动，所以第二个坐标变号，第一个不变。关于 $y$ 轴反射时，点左右移动，所以第一个坐标变号，第二个不变。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const overX = rng.bool();
        const image: Pt = overX ? [p[0], -p[1]] : [-p[0], p[1]];
        const other: Pt = overX ? [-p[0], p[1]] : [p[0], -p[1]];
        return plotProblem({
          prompt: t(
            `Mark the image of point $P$ after a reflection across the ${overX ? "$x$" : "$y$"}-axis.`,
            `标出点 $P$ 关于 ${overX ? "$x$" : "$y$"} 轴反射后的像。`,
          ),
          view: grid,
          marks: [dot(p, "P")],
          alt: t(`A grid with the point P at ${tex(p)}.`, `网格上有点 P，位于 ${tex(p)}。`),
          answer: [image],
          wrong: [
            { at: [other], why: t("That is the reflection across the other axis.", "这是关于另一条轴的反射。") },
            {
              at: [[-p[0], -p[1]]],
              why: t("You changed both signs: only one coordinate changes.", "你把两个符号都变了：只有一个坐标变号。"),
            },
            {
              at: [[p[1], p[0]]],
              why: t("You swapped the coordinates: that is a reflection across $y = x$.", "你对调了坐标：那是关于 $y = x$ 的反射。"),
            },
          ],
          solution: t(
            `The ${overX ? "$x$" : "$y$"}-axis is the mirror, so $P$ goes straight across it to the same distance on the other side: $${tex(p)} \\to ${tex(image)}$.`,
            `${overX ? "$x$" : "$y$"} 轴是镜面，所以 $P$ 垂直越过它，到另一侧相同距离处：$${tex(p)} \\to ${tex(image)}$。`,
          ),
          solutionAlt: t(`P at ${tex(p)} and its image at ${tex(image)}.`, `P 在 ${tex(p)}，它的像在 ${tex(image)}。`),
          solutionMarks: [{ kind: "segment", a: p, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
  midpoints: [
    skill(
      "marking-a-midpoint",
      ["Marking a midpoint", "标出中点"],
      [
        "The midpoint of a segment is halfway along it in both directions. Its first coordinate is the average of the two first coordinates, and its second is the average of the two second coordinates. On a grid, you can check it by counting: the steps from one end to the midpoint equal the steps from the midpoint to the other end.",
        "线段的中点在两个方向上都位于正中间。它的第一个坐标是两个第一坐标的平均数，第二个坐标是两个第二坐标的平均数。在网格上可以数格子检验：从一端到中点的步数等于从中点到另一端的步数。",
      ],
      (rng) => {
        const m: Pt = [rng.int(-2, 2), rng.int(-2, 2)];
        const [dx, dy] = [nonzero(rng, 3), nonzero(rng, 3)];
        const a: Pt = [m[0] - dx, m[1] - dy];
        const b: Pt = [m[0] + dx, m[1] + dy];
        return plotProblem({
          prompt: t("Mark the midpoint of segment $AB$.", "标出线段 $AB$ 的中点。"),
          view: grid,
          marks: [{ kind: "segment", a, b, accent: true }, dot(a, "A"), dot(b, "B")],
          alt: t(`A segment from A at ${tex(a)} to B at ${tex(b)}.`, `一条从 A ${tex(a)} 到 B ${tex(b)} 的线段。`),
          answer: [m],
          wrong: [
            {
              at: [[b[0] - a[0], b[1] - a[1]]],
              why: t(
                "You subtracted the coordinates and did not halve: that is how far apart the ends are.",
                "你把坐标相减了，也没有取一半：那是两端相距多远。",
              ),
            },
            {
              at: [[a[0] + b[0], a[1] + b[1]]],
              why: t("You added the coordinates but did not divide by $2$.", "你把坐标相加了，但没有除以 $2$。"),
            },
            { at: [[m[1], m[0]]], why: t("You swapped the coordinates of the midpoint.", "你把中点的坐标对调了。") },
          ],
          solution: t(
            `Average each coordinate: $\\frac{${a[0]} + ${b[0]}}{2} = ${m[0]}$ and $\\frac{${a[1]} + ${b[1]}}{2} = ${m[1]}$. The midpoint is $${tex(m)}$.`.replaceAll(
              "+ -",
              "- ",
            ),
            `对每个坐标取平均：$\\frac{${a[0]} + ${b[0]}}{2} = ${m[0]}$，$\\frac{${a[1]} + ${b[1]}}{2} = ${m[1]}$。中点是 $${tex(m)}$。`.replaceAll(
              "+ -",
              "- ",
            ),
          ),
          solutionAlt: t(`The midpoint ${tex(m)} of the segment.`, `线段的中点 ${tex(m)}。`),
        });
      },
    ),
  ],
  "graphing-linear-equations": [
    skill(
      "drawing-a-line-from-its-equation",
      ["Drawing a line from its equation", "根据方程画直线"],
      [
        "Two points fix a line. To draw $y = mx + b$, pick two easy values of $x$, work out $y$ for each, and mark the two points. $x = 0$ is the easiest, as it gives $y = b$. If $m$ is a fraction, pick $x$ values that clear the denominator, so that both points land on the grid.",
        "两点确定一条直线。要画 $y = mx + b$，选两个好算的 $x$ 值，分别算出 $y$，标出这两个点。$x = 0$ 最好算，它给出 $y = b$。如果 $m$ 是分数，选能消去分母的 $x$ 值，这样两个点都落在网格上。",
      ],
      (rng) => {
        const q = rng.pick([1, 1, 2]);
        const p = (q === 2 ? rng.pick([1, 3]) : rng.int(1, 3)) * rng.sign();
        const b = rng.int(-3, 3);
        const slope = q === 1 ? (p === 1 ? "" : p === -1 ? "-" : `${p}`) : `${p < 0 ? "-" : ""}\\frac{${Math.abs(p)}}{${q}}`;
        const tail = b === 0 ? "" : b < 0 ? ` - ${-b}` : ` + ${b}`;
        const equation = `y = ${slope}x${tail}`;
        const first: Pt = [0, b];
        const second: Pt = [q, b + p];
        return plotProblem({
          prompt: t(`Draw the line $${equation}$ by marking two of its points.`, `标出直线 $${equation}$ 上的两个点，画出这条直线。`),
          view: grid,
          alt: blank,
          answer: [first, second],
          line: [p, -q, -q * b],
          wrong: [
            {
              at: [
                [0, -b],
                [q, -b + p],
              ],
              why: t("This line crosses the $y$-axis at the opposite of $b$.", "这条直线与 $y$ 轴的交点是 $b$ 的相反数。"),
            },
            {
              at: [first, [q, b - p]],
              why: t("This line leans the wrong way: its slope has the opposite sign.", "这条直线倾斜方向错了：斜率的符号相反。"),
            },
            { at: [first, [b + p, q]], why: t("The second point has its coordinates swapped.", "第二个点的坐标对调了。") },
          ],
          solution: t(
            `At $x = 0$, $y = ${b}$, which gives $${tex(first)}$. At $x = ${q}$, $y = ${b + p}$, which gives $${tex(second)}$. Any two points of the line would do.`,
            `当 $x = 0$ 时 $y = ${b}$，得到 $${tex(first)}$。当 $x = ${q}$ 时 $y = ${b + p}$，得到 $${tex(second)}$。这条直线上任意两个点都可以。`,
          ),
          solutionAlt: t(`The line through ${tex(first)} and ${tex(second)}.`, `经过 ${tex(first)} 和 ${tex(second)} 的直线。`),
          solutionMarks: [{ kind: "line", a: first, b: second, accent: true }],
        });
      },
    ),
    skill(
      "marking-the-intercepts-of-a-line",
      ["Marking the intercepts of a line", "标出直线的截距点"],
      [
        "The $x$-intercept is where a line meets the $x$-axis, where $y = 0$. The $y$-intercept is where it meets the $y$-axis, where $x = 0$. For an equation such as $3x + 2y = 6$, set each variable to $0$ in turn and solve for the other. Each gives one point, and those two points draw the line.",
        "$x$ 轴截距点是直线与 $x$ 轴的交点，此时 $y = 0$。$y$ 轴截距点是直线与 $y$ 轴的交点，此时 $x = 0$。对于 $3x + 2y = 6$ 这样的方程，依次令每个变量为 $0$，解出另一个。每次得到一个点，这两个点就画出了直线。",
      ],
      (rng) => {
        const [u, v] = rng.shuffle([1, 2, 3, 4, 5, 6]);
        const p = rng.sign() * (u as number);
        const q = rng.sign() * (v as number);
        const equation = `${poly([q, "x"], [p, "y"])} = ${p * q}`;
        const onX: Pt = [p, 0];
        const onY: Pt = [0, q];
        return plotProblem({
          prompt: t(`Mark the two intercepts of the line $${equation}$.`, `标出直线 $${equation}$ 的两个截距点。`),
          view: grid,
          alt: blank,
          answer: [onX, onY],
          wrong: [
            {
              at: [
                [q, 0],
                [0, p],
              ],
              why: t(
                "You swapped the intercepts: to find where $y = 0$, divide by the coefficient of $x$.",
                "你把截距对调了：求 $y = 0$ 的点时，要除以 $x$ 的系数。",
              ),
            },
            {
              at: [
                [-p, 0],
                [0, -q],
              ],
              why: t("Both intercepts have the wrong sign.", "两个截距的符号都错了。"),
            },
          ],
          solution: t(
            `Set $y = 0$: $${poly([q, "x"])} = ${p * q}$, so $x = ${p}$. Set $x = 0$: $${poly([p, "y"])} = ${p * q}$, so $y = ${q}$. The points are $${tex(onX)}$ and $${tex(onY)}$.`,
            `令 $y = 0$：$${poly([q, "x"])} = ${p * q}$，所以 $x = ${p}$。令 $x = 0$：$${poly([p, "y"])} = ${p * q}$，所以 $y = ${q}$。两点是 $${tex(onX)}$ 和 $${tex(onY)}$。`,
          ),
          solutionAlt: t(`The line through ${tex(onX)} and ${tex(onY)}.`, `经过 ${tex(onX)} 和 ${tex(onY)} 的直线。`),
          solutionMarks: [{ kind: "line", a: onX, b: onY, accent: true }],
        });
      },
    ),
    skill(
      "drawing-horizontal-and-vertical-lines",
      ["Drawing horizontal and vertical lines", "画水平线和竖直线"],
      [
        "The equation $x = 3$ puts no condition on $y$: every point with first coordinate $3$ is on it, so the line is vertical. In the same way, $y = 3$ is horizontal. To draw either one, mark two points that keep the named coordinate fixed and change the other.",
        "方程 $x = 3$ 对 $y$ 没有限制：所有第一个坐标为 $3$ 的点都在线上，所以这是竖直线。同样，$y = 3$ 是水平线。要画它们，就标出两个点：保持方程中那个坐标不变，改变另一个坐标。",
      ],
      (rng) => {
        const c = nonzero(rng, 5);
        const vertical = rng.bool();
        const name = vertical ? "x" : "y";
        const first: Pt = vertical ? [c, 0] : [0, c];
        const second: Pt = vertical ? [c, 1] : [1, c];
        const swapped: Pt = vertical ? [0, c] : [c, 0];
        const swapped2: Pt = vertical ? [1, c] : [c, 1];
        const doubled = rng.bool();
        const equation = doubled ? `2${name} = ${2 * c}` : `${name} = ${c}`;
        const reduced = doubled ? `$${equation}$ means $${name} = ${c}$. ` : "";
        const reducedZh = doubled ? `$${equation}$ 就是 $${name} = ${c}$。` : "";
        return plotProblem({
          prompt: t(`Draw the line $${equation}$ by marking two of its points.`, `标出直线 $${equation}$ 上的两个点，画出这条直线。`),
          view: grid,
          alt: blank,
          answer: [first, second],
          line: vertical ? [1, 0, c] : [0, 1, c],
          wrong: [
            {
              at: [swapped, swapped2],
              why: t(
                `That line has the other coordinate fixed. On $${name} = ${c}$, it is $${name}$ that stays at $${c}$.`,
                `那条直线固定的是另一个坐标。在 $${name} = ${c}$ 上，保持为 $${c}$ 的是 $${name}$。`,
              ),
            },
          ],
          solution: t(
            `${reduced}Every point of the line has $${name} = ${c}$, and the other coordinate can be anything. So $${tex(first)}$ and $${tex(second)}$ are on it, and the line is ${vertical ? "vertical" : "horizontal"}.`,
            `${reducedZh}这条直线上每个点都有 $${name} = ${c}$，另一个坐标可以是任意值。所以 $${tex(first)}$ 和 $${tex(second)}$ 都在线上，这是一条${vertical ? "竖直线" : "水平线"}。`,
          ),
          solutionAlt: t(`The line ${name} = ${c}.`, `直线 ${name} = ${c}。`),
          solutionMarks: [{ kind: "line", a: first, b: second, accent: true }],
        });
      },
    ),
  ],
  "slope-intercept-form": [
    skill(
      "marking-a-point-by-rise-and-run",
      ["Marking a point by rise and run", "按升降和水平距离标点"],
      [
        "A slope $\\frac{p}{q}$ says that each $q$ steps to the right go with $p$ steps up, or down if $p$ is negative. So from any point on a line, you can reach the next one: count the run to the right, then the rise. This is how to draw a line from one point and its slope, with no calculation.",
        "斜率 $\\frac{p}{q}$ 表示每向右 $q$ 步，就向上 $p$ 步（$p$ 为负时向下）。所以从直线上任意一点，都能走到下一个点：先向右数水平距离，再数升降。这样只用一个点和斜率就能画出直线，不用计算。",
      ],
      (rng) => {
        const a: Pt = [rng.int(-4, 0), rng.int(-2, 2)];
        const run = rng.int(1, 3);
        const rise = nonzero(rng, 3);
        const next: Pt = [a[0] + run, a[1] + rise];
        const slope = run === 1 ? `${rise}` : `${rise < 0 ? "-" : ""}\\frac{${Math.abs(rise)}}{${run}}`;
        return plotProblem({
          prompt: t(
            `A line has slope $${slope}$ and passes through $A$. Mark the point of the line that is ${run === 1 ? "$1$ unit" : `$${run}$ units`} to the right of $A$ along the $x$-axis.`,
            `一条直线的斜率是 $${slope}$，经过点 $A$。标出直线上比 $A$ 向右 $${run}$ 个单位（沿 $x$ 轴方向）的点。`,
          ),
          view: grid,
          marks: [dot(a, "A")],
          alt: t(`A grid with the point A at ${tex(a)}.`, `网格上有点 A，位于 ${tex(a)}。`),
          answer: [next],
          wrong: [
            {
              at: [[a[0] + run, a[1] - rise]],
              why: t("You moved the wrong way up or down: check the sign of the slope.", "你上下方向走反了：看斜率的符号。"),
            },
            {
              at: [[a[0] + rise, a[1] + run]],
              why: t("You swapped rise and run: in a slope, the rise is on top.", "你把升降和水平距离对调了：斜率的分子是升降。"),
            },
          ],
          solution: t(
            `From $A${tex(a)}$, go $${run}$ to the right and $${Math.abs(rise)}$ ${rise < 0 ? "down" : "up"}, which gives $${tex(next)}$.`,
            `从 $A${tex(a)}$ 向右走 $${run}$，再向${rise < 0 ? "下" : "上"}走 $${Math.abs(rise)}$，得到 $${tex(next)}$。`,
          ),
          solutionAlt: t(
            `The line through A and ${tex(next)}, with its run and rise.`,
            `经过 A 和 ${tex(next)} 的直线，并标出水平距离和升降。`,
          ),
          solutionMarks: [
            { kind: "line", a, b: next, accent: true },
            { kind: "segment", a, b: [next[0], a[1]], tone: "action" },
            { kind: "segment", a: [next[0], a[1]], b: next, tone: "action" },
          ],
        });
      },
    ),
  ],
  "systems-of-linear-equations": [
    skill(
      "marking-the-solution-of-a-system",
      ["Marking the solution of a system", "标出方程组的解"],
      [
        "A point on a line satisfies that line's equation, so a point on both lines satisfies both equations. That makes the crossing point the solution of the system. Read it off the drawing, and then check it by putting its coordinates into each equation.",
        "直线上的点满足这条直线的方程，所以同时在两条直线上的点满足两个方程。因此交点就是方程组的解。从图上读出它，再把坐标代入每个方程检验。",
      ],
      (rng) => {
        const x0 = nonzero(rng, 4);
        let y0 = nonzero(rng, 4);
        while (Math.abs(y0) === Math.abs(x0)) y0 = nonzero(rng, 4);
        const c: Pt = [x0, y0];
        const [p, q] = rng.shuffle([-2, -1, 1, 2, 3]);
        const b1 = y0 - (p as number) * x0;
        const b2 = y0 - (q as number) * x0;
        const shown = (m: number, b: number) => `y = ${m === 1 ? "" : m === -1 ? "-" : m}x${b === 0 ? "" : b < 0 ? ` - ${-b}` : ` + ${b}`}`;
        const marks: readonly PlaneMark[] = [
          { kind: "line", a: c, b: [x0 + 1, y0 + (p as number)], accent: true },
          { kind: "line", a: c, b: [x0 + 1, y0 + (q as number)], tone: "action" },
        ];
        return plotProblem({
          prompt: t(
            `The drawing shows the lines $${shown(p as number, b1)}$ and $${shown(q as number, b2)}$. Mark the solution of the system.`,
            `图中画出了直线 $${shown(p as number, b1)}$ 和 $${shown(q as number, b2)}$。标出方程组的解。`,
          ),
          view: grid,
          marks,
          alt: t("Two lines that cross on the grid.", "网格上两条相交的直线。"),
          answer: [c],
          wrong: [{ at: [[y0, x0]], why: t("You swapped the coordinates of the crossing point.", "你把交点的坐标对调了。") }],
          solution: t(
            `The lines cross at $${tex(c)}$. Check: $${p} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b1 < 0 ? `(${b1})` : b1} = ${y0}$ and $${q} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b2 < 0 ? `(${b2})` : b2} = ${y0}$.`,
            `两条直线相交于 $${tex(c)}$。检验：$${p} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b1 < 0 ? `(${b1})` : b1} = ${y0}$，$${q} \\cdot ${x0 < 0 ? `(${x0})` : x0} + ${b2 < 0 ? `(${b2})` : b2} = ${y0}$。`,
          ),
          solutionAlt: t(`The lines cross at ${tex(c)}.`, `两条直线相交于 ${tex(c)}。`),
        });
      },
    ),
  ],
  "graphs-of-general-quadratic-functions": [
    skill(
      "marking-the-vertex-from-the-equation",
      ["Marking the vertex from the equation", "根据方程标出顶点"],
      [
        "In $y = a(x - h)^2 + k$, the square is never negative, so $y$ reaches its lowest or highest value when $x = h$, where the square is $0$ and $y = k$. So the vertex is $(h, k)$. Mind the sign: $(x - 2)^2$ has $h = 2$, and $(x + 2)^2$ has $h = -2$.",
        "在 $y = a(x - h)^2 + k$ 中，平方不会是负数，所以当 $x = h$ 时平方为 $0$，$y = k$，这时 $y$ 达到最低或最高值。所以顶点是 $(h, k)$。注意符号：$(x - 2)^2$ 的 $h = 2$，$(x + 2)^2$ 的 $h = -2$。",
      ],
      (rng) => {
        const [h, k] = apart(rng, 5);
        const a = rng.pick([-3, -2, -1, 2, 3]);
        const equation = `y = ${a === -1 ? "-" : a}(x ${h < 0 ? `+ ${-h}` : `- ${h}`})^2 ${k < 0 ? `- ${-k}` : `+ ${k}`}`;
        const p: Pt = [h, k];
        return plotProblem({
          prompt: t(`Mark the vertex of the parabola $${equation}$.`, `标出抛物线 $${equation}$ 的顶点。`),
          view: grid,
          alt: blank,
          answer: [p],
          wrong: [
            {
              at: [[-h, k]],
              why: t(
                "The sign of $h$ is reversed: the form has $x - h$, so read the opposite of the number you see.",
                "$h$ 的符号反了：形式是 $x - h$，所以要取看到的数的相反数。",
              ),
            },
            {
              at: [[h, -k]],
              why: t("The sign of $k$ is reversed: the number added outside is $k$ itself.", "$k$ 的符号反了：外面加的数就是 $k$ 本身。"),
            },
            { at: [[k, h]], why: t("You swapped the coordinates: $h$ is the first one.", "你把坐标对调了：$h$ 是第一个坐标。") },
          ],
          solution: t(
            `The square is $0$ when $x = ${h}$, and then $y = ${k}$. The vertex is $${tex(p)}$. The factor $${a}$ changes the width and direction, not the vertex.`,
            `当 $x = ${h}$ 时平方为 $0$，此时 $y = ${k}$。顶点是 $${tex(p)}$。因数 $${a}$ 改变的是宽窄和开口方向，不改变顶点。`,
          ),
          solutionAlt: t(`The parabola with its vertex at ${tex(p)}.`, `顶点在 ${tex(p)} 的抛物线。`),
          solutionMarks: [{ kind: "curve", f: (x) => a * (x - h) * (x - h) + k, accent: true }],
        });
      },
    ),
    skill(
      "marking-the-roots-from-factors",
      ["Marking the $x$-intercepts from the factors", "根据因式标出与 $x$ 轴的交点"],
      [
        "A product is $0$ exactly when one of its factors is $0$. So $y = (x - r)(x - s)$ meets the $x$-axis where $x = r$ and where $x = s$. These are points on the axis, with second coordinate $0$. As with the vertex form, the sign inside the factor is the opposite of the root.",
        "乘积为 $0$，当且仅当其中一个因式为 $0$。所以 $y = (x - r)(x - s)$ 在 $x = r$ 和 $x = s$ 处与 $x$ 轴相交。这些点在轴上，第二个坐标是 $0$。和顶点式一样，因式里的符号与根相反。",
      ],
      (rng) => {
        const [r, s] = rng.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) as [number, number];
        const factor = (v: number) => `(x ${v < 0 ? `+ ${-v}` : `- ${v}`})`;
        return plotProblem({
          prompt: t(
            `Mark the points where $y = ${factor(r)}${factor(s)}$ meets the $x$-axis.`,
            `标出 $y = ${factor(r)}${factor(s)}$ 与 $x$ 轴的交点。`,
          ),
          view: grid,
          alt: blank,
          answer: [
            [r, 0],
            [s, 0],
          ],
          wrong: [
            {
              at: [
                [-r, 0],
                [-s, 0],
              ],
              why: t(
                "Both signs are reversed: the factor $x - r$ is $0$ when $x = r$.",
                "两个符号都反了：当 $x = r$ 时，因式 $x - r$ 为 $0$。",
              ),
            },
            {
              at: [
                [0, r],
                [0, s],
              ],
              why: t(
                "Those points are on the $y$-axis. On the $x$-axis, the second coordinate is $0$.",
                "这些点在 $y$ 轴上。在 $x$ 轴上，第二个坐标是 $0$。",
              ),
            },
          ],
          solution: t(
            `$${factor(r)} = 0$ when $x = ${r}$, and $${factor(s)} = 0$ when $x = ${s}$. The points are $${tex([r, 0])}$ and $${tex([s, 0])}$.`,
            `当 $x = ${r}$ 时 $${factor(r)} = 0$，当 $x = ${s}$ 时 $${factor(s)} = 0$。两点是 $${tex([r, 0])}$ 和 $${tex([s, 0])}$。`,
          ),
          solutionAlt: t(`The parabola crossing the x-axis at ${r} and ${s}.`, `与 x 轴交于 ${r} 和 ${s} 的抛物线。`),
          solutionMarks: [{ kind: "curve", f: (x) => (x - r) * (x - s), accent: true }],
        });
      },
    ),
  ],
  "graphing-elementary-quadratic-functions": [
    skill(
      "marking-a-pair-of-mirror-points",
      ["Marking a pair of mirror points", "标出一对对称点"],
      [
        "The graph of $y = ax^2 + c$ is symmetric about the $y$-axis, since $x$ and $-x$ have the same square. So once you know the height at $x = 1$, you know it at $x = -1$ as well. Marking such a pair, plus the vertex $(0, c)$, is the quickest way to sketch the parabola.",
        "$y = ax^2 + c$ 的图像关于 $y$ 轴对称，因为 $x$ 和 $-x$ 的平方相同。所以知道了 $x = 1$ 处的高度，也就知道了 $x = -1$ 处的高度。标出这样一对点，再加上顶点 $(0, c)$，是画抛物线最快的方法。",
      ],
      (rng) => {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(-2, 2);
        const at = rng.pick([1, 2]);
        const use = at === 2 && Math.abs(a) > 1 ? 1 : at;
        const y = a * use * use + c;
        const tail = c === 0 ? "" : c < 0 ? ` - ${-c}` : ` + ${c}`;
        const equation = `y = ${a === 1 ? "" : a === -1 ? "-" : a}x^2${tail}`;
        return plotProblem({
          prompt: t(
            `Mark the two points of $${equation}$ where $x = ${use}$ and $x = ${-use}$.`,
            `标出 $${equation}$ 上 $x = ${use}$ 和 $x = ${-use}$ 处的两个点。`,
          ),
          view: grid,
          alt: blank,
          answer: [
            [use, y],
            [-use, y],
          ],
          wrong: [
            {
              at: [
                [use, y],
                [-use, -y],
              ],
              why: t(
                "The square of a negative number is positive, so both points have the same height.",
                "负数的平方是正数，所以两个点高度相同。",
              ),
            },
            {
              at: [
                [y, use],
                [y, -use],
              ],
              why: t("You swapped the coordinates: $x$ comes first.", "你把坐标对调了：$x$ 在前。"),
            },
          ],
          solution: t(
            `Both values of $x$ have square $${use * use}$, so $y = ${a} \\cdot ${use * use} ${c < 0 ? `- ${-c}` : `+ ${c}`} = ${y}$ at each. The points are $${tex([use, y])}$ and $${tex([-use, y])}$.`,
            `两个 $x$ 值的平方都是 $${use * use}$，所以两处都有 $y = ${a} \\cdot ${use * use} ${c < 0 ? `- ${-c}` : `+ ${c}`} = ${y}$。两点是 $${tex([use, y])}$ 和 $${tex([-use, y])}$。`,
          ),
          solutionAlt: t(`The parabola through both points, at height ${y}.`, `经过这两点的抛物线，高度为 ${y}。`),
          solutionMarks: [{ kind: "curve", f: (x) => a * x * x + c, accent: true }],
        });
      },
    ),
  ],
  "absolute-value-graphs": [
    skill(
      "marking-the-corner-of-an-absolute-value-graph",
      ["Marking the corner of an absolute value graph", "标出绝对值图像的拐点"],
      [
        "The graph of $y = |x - h| + k$ has the shape of a V. An absolute value is never negative, so the lowest point comes where the inside is $0$, at $x = h$, and there $y = k$. The corner is therefore $(h, k)$, read in the same way as the vertex of a parabola.",
        "$y = |x - h| + k$ 的图像是 V 形。绝对值不会是负数，所以最低点出现在里面为 $0$ 的地方，即 $x = h$，此时 $y = k$。因此拐点是 $(h, k)$，读法和抛物线的顶点一样。",
      ],
      (rng) => {
        const [h, k] = apart(rng, 5);
        const p: Pt = [h, k];
        const equation = `y = |x ${h < 0 ? `+ ${-h}` : `- ${h}`}| ${k < 0 ? `- ${-k}` : `+ ${k}`}`;
        return plotProblem({
          prompt: t(`Mark the corner of the graph of $${equation}$.`, `标出 $${equation}$ 的图像的拐点。`),
          view: grid,
          alt: blank,
          answer: [p],
          wrong: [
            {
              at: [[-h, k]],
              why: t(
                "The inside is $0$ at the opposite of the number you see: $|x - 2|$ is $0$ at $x = 2$.",
                "里面为 $0$ 的位置是看到的数的相反数：$|x - 2|$ 在 $x = 2$ 处为 $0$。",
              ),
            },
            {
              at: [[h, -k]],
              why: t("The number added outside moves the graph by itself, with its own sign.", "外面加的数按它自身的符号移动图像。"),
            },
            { at: [[k, h]], why: t("You swapped the coordinates of the corner.", "你把拐点的坐标对调了。") },
          ],
          solution: t(
            `The inside is $0$ when $x = ${h}$, and then $y = ${k}$. The corner is $${tex(p)}$.`,
            `当 $x = ${h}$ 时里面为 $0$，此时 $y = ${k}$。拐点是 $${tex(p)}$。`,
          ),
          solutionAlt: t(`The V-shaped graph with its corner at ${tex(p)}.`, `拐点在 ${tex(p)} 的 V 形图像。`),
          solutionMarks: [{ kind: "curve", f: (x) => Math.abs(x - h) + k, accent: true }],
        });
      },
    ),
  ],
  "graphs-of-inverse-functions": [
    skill(
      "marking-a-point-of-the-inverse",
      ["Marking a point of the inverse", "标出反函数图像上的点"],
      [
        "If $f(a) = b$, then $f^{-1}(b) = a$. So each point $(a, b)$ on the graph of $f$ gives the point $(b, a)$ on the graph of $f^{-1}$. Swapping coordinates is a reflection across the line $y = x$, so the two graphs are mirror images of each other.",
        "如果 $f(a) = b$，那么 $f^{-1}(b) = a$。所以 $f$ 的图像上每个点 $(a, b)$ 都对应 $f^{-1}$ 的图像上的点 $(b, a)$。对调坐标就是关于直线 $y = x$ 的反射，所以两个图像互为镜像。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const image: Pt = [p[1], p[0]];
        return plotProblem({
          prompt: t(
            "The point $P$ lies on the graph of a one-to-one function $f$. Mark the matching point on the graph of $f^{-1}$.",
            "点 $P$ 在一一对应的函数 $f$ 的图像上。标出 $f^{-1}$ 的图像上与之对应的点。",
          ),
          view: grid,
          marks: [{ kind: "line", a: [0, 0], b: [1, 1], dashed: true }, dot(p, "P")],
          alt: t(`The point P at ${tex(p)} and the dashed line y = x.`, `点 P 在 ${tex(p)}，还有虚线 y = x。`),
          answer: [image],
          wrong: [
            {
              at: [[-p[0], -p[1]]],
              why: t(
                "An inverse function is not a negative: swap the coordinates rather than changing their signs.",
                "反函数不是相反数：要对调坐标，而不是改变符号。",
              ),
            },
            {
              at: [[p[0], -p[1]]],
              why: t("That is a reflection across the $x$-axis, not across $y = x$.", "这是关于 $x$ 轴的反射，而不是关于 $y = x$ 的。"),
            },
            {
              at: [[-p[0], p[1]]],
              why: t("That is a reflection across the $y$-axis, not across $y = x$.", "这是关于 $y$ 轴的反射，而不是关于 $y = x$ 的。"),
            },
          ],
          solution: t(
            `Here $f(${p[0]}) = ${p[1]}$, so $f^{-1}(${p[1]}) = ${p[0]}$. Swapping the coordinates of $${tex(p)}$ gives $${tex(image)}$, the mirror image across $y = x$.`,
            `这里 $f(${p[0]}) = ${p[1]}$，所以 $f^{-1}(${p[1]}) = ${p[0]}$。对调 $${tex(p)}$ 的坐标得到 $${tex(image)}$，也就是关于 $y = x$ 的镜像。`,
          ),
          solutionAlt: t(`P and its mirror image ${tex(image)} across y = x.`, `P 和它关于 y = x 的镜像 ${tex(image)}。`),
          solutionMarks: [{ kind: "segment", a: p, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
  "translations-of-geometric-figures": [
    skill(
      "marking-the-image-of-a-vertex",
      ["Marking the image of a vertex", "标出顶点的像"],
      [
        "A translation moves every point by the same amount. To find the image of a vertex, count the move across from the vertex, then the move up or down. Every other vertex would move in the same way, so the image has the same size, shape and direction as the figure.",
        "平移使每个点移动相同的量。要找顶点的像，从顶点开始数水平移动，再数上下移动。其他顶点也同样移动，所以像和原图形的大小、形状、方向都相同。",
      ],
      (rng) => {
        const a: Pt = [rng.int(-3, 0), rng.int(-3, 0)];
        const b: Pt = [a[0] + rng.int(1, 3), a[1]];
        const c: Pt = [a[0], a[1] + rng.int(1, 3)];
        const [p, q] = apart(rng, 3);
        const image: Pt = [a[0] + p, a[1] + q];
        const across = p > 0 ? ["right", "右"] : ["left", "左"];
        const up = q > 0 ? ["up", "上"] : ["down", "下"];
        return plotProblem({
          prompt: t(
            `Triangle $ABC$ is translated $${Math.abs(p)}$ unit${Math.abs(p) === 1 ? "" : "s"} ${across[0]} and $${Math.abs(q)}$ unit${Math.abs(q) === 1 ? "" : "s"} ${up[0]}. Mark the image of vertex $A$.`,
            `把三角形 $ABC$ 向${across[1]}平移 $${Math.abs(p)}$ 个单位，再向${up[1]}平移 $${Math.abs(q)}$ 个单位。标出顶点 $A$ 的像。`,
          ),
          view: grid,
          marks: [
            { kind: "segment", a, b, accent: true },
            { kind: "segment", a: b, b: c, accent: true },
            { kind: "segment", a: c, b: a, accent: true },
            dot(a, "A"),
          ],
          alt: t(
            `Triangle ABC with A at ${tex(a)}, B at ${tex(b)} and C at ${tex(c)}.`,
            `三角形 ABC，A 在 ${tex(a)}，B 在 ${tex(b)}，C 在 ${tex(c)}。`,
          ),
          answer: [image],
          wrong: [
            {
              at: [[a[0] + q, a[1] + p]],
              why: t(
                "You swapped the two moves: the move across changes the first coordinate.",
                "你把两次移动对调了：水平移动改变第一个坐标。",
              ),
            },
            { at: [[a[0] - p, a[1] + q]], why: t("You moved the wrong way across.", "你水平方向移反了。") },
            { at: [[a[0] + p, a[1] - q]], why: t("You moved the wrong way up or down.", "你竖直方向移反了。") },
          ],
          solution: t(
            `Add the moves to $A${tex(a)}$: $${a[0]} ${p < 0 ? "-" : "+"} ${Math.abs(p)} = ${image[0]}$ and $${a[1]} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${image[1]}$. The image is $${tex(image)}$.`,
            `把移动量加到 $A${tex(a)}$ 上：$${a[0]} ${p < 0 ? "-" : "+"} ${Math.abs(p)} = ${image[0]}$，$${a[1]} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${image[1]}$。像是 $${tex(image)}$。`,
          ),
          solutionAlt: t(`The image of A at ${tex(image)}.`, `A 的像在 ${tex(image)}。`),
          solutionMarks: [{ kind: "segment", a, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
  "rotation-rules-in-the-coordinate-plane": [
    skill(
      "marking-a-rotated-point",
      ["Marking a rotated point", "标出旋转后的点"],
      [
        "A turn about the origin follows a rule. A quarter turn counterclockwise sends $(x, y)$ to $(-y, x)$, a quarter turn clockwise sends it to $(y, -x)$, and a half turn sends it to $(-x, -y)$. You can check a result on the grid: the point stays at the same distance from the origin, and it lands in the quadrant the turn leads to.",
        "绕原点的旋转遵循规则。逆时针转四分之一圈把 $(x, y)$ 变成 $(-y, x)$，顺时针转四分之一圈把它变成 $(y, -x)$，转半圈把它变成 $(-x, -y)$。可以在网格上检验：点到原点的距离不变，并落在旋转后对应的象限。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const turn = rng.pick(rotations);
        const image = turn.move(p);
        const others = rotations.filter((r) => r !== turn);
        return plotProblem({
          prompt: t(`Mark the image of $P$ after a rotation of ${turn.en} about the origin.`, `标出 $P$ 绕原点旋转${turn.zh}后的像。`),
          view: grid,
          marks: [dot(p, "P")],
          alt: t(`The point P at ${tex(p)}.`, `点 P 在 ${tex(p)}。`),
          answer: [image],
          wrong: [
            ...others.map((r) => ({
              at: [r.move(p)],
              why: t(`That follows the rule $${r.rule}$, which is a rotation of ${r.en}.`, `这用的是规则 $${r.rule}$，那是旋转${r.zh}。`),
            })),
            {
              at: [[p[1], p[0]] as Pt],
              why: t(
                "Swapping alone is a reflection across $y = x$: a quarter turn also changes one sign.",
                "只对调坐标是关于 $y = x$ 的反射：转四分之一圈还要改变一个符号。",
              ),
            },
          ],
          solution: t(
            `The rule is $${turn.rule}$, so $${tex(p)} \\to ${tex(image)}$.`,
            `规则是 $${turn.rule}$，所以 $${tex(p)} \\to ${tex(image)}$。`,
          ),
          solutionAlt: t(`P and its image ${tex(image)}, joined to the origin.`, `P 和它的像 ${tex(image)}，都与原点相连。`),
          solutionMarks: [
            { kind: "segment", a: [0, 0], b: p, dashed: true, tone: "action" },
            { kind: "segment", a: [0, 0], b: image, dashed: true, tone: "action" },
          ],
        });
      },
    ),
  ],
  "reflections-in-the-coordinate-plane": [
    skill(
      "marking-a-point-reflected-in-a-line",
      ["Marking a point reflected in a line", "标出关于直线反射后的点"],
      [
        "The rule depends on the mirror. Across the $x$-axis, $(x, y)$ goes to $(x, -y)$; across the $y$-axis, to $(-x, y)$; across $y = x$, to $(y, x)$; and across $y = -x$, to $(-y, -x)$. In every case the mirror is halfway between the point and its image, and the segment joining them is perpendicular to the mirror.",
        "规则取决于镜面。关于 $x$ 轴，$(x, y)$ 变成 $(x, -y)$；关于 $y$ 轴，变成 $(-x, y)$；关于 $y = x$，变成 $(y, x)$；关于 $y = -x$，变成 $(-y, -x)$。无论哪种情况，镜面都在点和像的正中间，连接它们的线段与镜面垂直。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const mirror = rng.pick(mirrors);
        const image = mirror.move(p);
        const others = mirrors.filter((r) => r !== mirror);
        return plotProblem({
          prompt: t(`Mark the image of $P$ after a reflection across ${mirror.en}.`, `标出 $P$ 关于${mirror.zh}反射后的像。`),
          view: grid,
          marks: [mirror.line, dot(p, "P")],
          alt: t(`The point P at ${tex(p)} and the dashed mirror line.`, `点 P 在 ${tex(p)}，还有虚线镜面。`),
          answer: [image],
          wrong: others.map((r) => ({
            at: [r.move(p)],
            why: t(
              `That follows the rule $${r.rule}$, which is a reflection across ${r.en}.`,
              `这用的是规则 $${r.rule}$，那是关于${r.zh}的反射。`,
            ),
          })),
          solution: t(
            `The rule is $${mirror.rule}$, so $${tex(p)} \\to ${tex(image)}$.`,
            `规则是 $${mirror.rule}$，所以 $${tex(p)} \\to ${tex(image)}$。`,
          ),
          solutionAlt: t(`P and its image ${tex(image)}, joined across the mirror.`, `P 和它的像 ${tex(image)}，隔着镜面相连。`),
          solutionMarks: [{ kind: "segment", a: p, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
};
