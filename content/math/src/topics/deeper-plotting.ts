// Knowledge points answered by marking points on a grid. Producing a point or a line is a different
// skill from recognizing one: nothing on the page suggests where it goes.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, type PlaneView, plane, poly } from "@ga/subject-math";

import { plotProblem } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

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
        `To mark the point $(x, y)$, read the pair as two moves from the origin, in order.

1. The first coordinate is the move **across**: right if it is positive, left if it is negative.
2. The second is the move **up or down** from there: up if it is positive, down if it is negative.

For $(-3, 4)$: go $3$ to the left, then $4$ up, and mark the point you reach. It should lie left of the $y$-axis and above the $x$-axis, as the signs say.

> **Watch out.** The order matters: $(2, 5)$ and $(5, 2)$ are different places. Always use the first number for the move across, never for the move up.`,
        `要标出点 $(x, y)$，就把这个数对看成从原点出发的两次移动，按顺序走。

1. 第一个坐标是**水平**移动：正数向右，负数向左。
2. 第二个坐标是接着的**竖直**移动：正数向上，负数向下。

对 $(-3, 4)$：向左走 $3$，再向上走 $4$，标出到达的点。它应在 $y$ 轴左边、$x$ 轴上方，与符号一致。

> **注意。** 顺序很重要：$(2, 5)$ 和 $(5, 2)$ 是不同的位置。第一个数总是用于水平移动，不能用于竖直移动。`,
      ],
      (rng) => {
        const [a, b] = apart(rng, 5);
        const p = markingPoint(grid, 1, [a, b]);
        const [x, y] = [a, b];
        return {
          ...p,
          solution: t(
            `${walk([x, y]).en}

The walk ends at $${tex([x, y])}$: mark it there.

**Check.** The point is ${x < 0 ? "left" : "right"} of the $y$-axis, as a ${x < 0 ? "negative" : "positive"} first coordinate says, and ${y < 0 ? "below" : "above"} the $x$-axis, as a ${y < 0 ? "negative" : "positive"} second coordinate says.`,
            `${walk([x, y])["zh-CN"]}

到达的位置是 $${tex([x, y])}$，在那里标点。

**检验。** 这个点在 $y$ 轴${x < 0 ? "左" : "右"}边，与第一个坐标为${x < 0 ? "负" : "正"}数一致；在 $x$ 轴${y < 0 ? "下方" : "上方"}，与第二个坐标为${y < 0 ? "负" : "正"}数一致。`,
          ),
        };
      },
    ),
  ],
  "rational-numbers-in-the-coordinate-plane": [
    {
      ...skill(
        "marking-a-point-with-halves",
        ["Marking a point with halves", "标出坐标含二分之一的点"],
        [
          "A coordinate need not be a whole number. Grid lines here are half a unit apart, so $(1.5, -2)$ sits halfway between $x = 1$ and $x = 2$, on the line $y = -2$. Move across first, then up or down, counting two grid lines for each whole unit.\n\nCheck: $1.5$ is $3$ half units, so the point is $3$ lines right of the $y$-axis and $4$ lines below the $x$-axis.\n\n> **Watch out.** Each grid line is only half a unit: $1.5$ is $3$ lines, not $1$ or $5$.",
          "坐标不一定是整数。这里网格线之间相距半个单位，所以 $(1.5, -2)$ 位于 $x = 1$ 和 $x = 2$ 的正中间，在直线 $y = -2$ 上。先水平移动，再上下移动，每一个单位数两条网格线。\n\n检验：$1.5$ 是 $3$ 个半单位，所以这个点在 $y$ 轴右边第 $3$ 条线、$x$ 轴下方第 $4$ 条线上。\n\n> **注意。** 每格只有半个单位：$1.5$ 是 $3$ 格，不是 $1$ 格或 $5$ 格。",
        ],
        (rng) => {
          const view: PlaneView = { xMin: -4, xMax: 4, yMin: -4, yMax: 4, step: 0.5, labelEvery: 2 };
          const half = () => rng.sign() * (rng.int(0, 3) + 0.5);
          const whole = nonzero(rng, 3);
          const p: Pt = rng.bool() ? [half(), whole] : [whole, half()];
          const [x, y] = p;
          const lines = (v: number) => Math.abs(v) * 2;
          const between = (v: number): Pair => {
            const [lo, hi] = [Math.floor(v), Math.ceil(v)];
            return [`$${v}$ is halfway between $${lo}$ and $${hi}$`, `$${v}$ 在 $${lo}$ 和 $${hi}$ 的正中间`];
          };
          const halfOne = Number.isInteger(x) ? y : x;
          const [en, zh] = between(halfOne);
          return {
            ...markingPoint(view, 0.5, p),
            solution: t(
              `${stepLabel(1, "Move across", "水平移动").en} $${x}$ is $${lines(x)}$ half units, so go $${lines(x)}$ grid lines ${x < 0 ? "left" : "right"} from the origin.\n\n${stepLabel(2, "Move up or down", "上下移动").en} $${y}$ is $${lines(y)}$ half units, so go $${lines(y)}$ grid lines ${y < 0 ? "down" : "up"}. Mark $${tex(p)}$ there.\n\n**Check.** ${en} on its axis, and the point sits on a half-unit line just there.`,
              `${stepLabel(1, "Move across", "水平移动")["zh-CN"]}$${x}$ 是 $${lines(x)}$ 个半单位，所以从原点向${x < 0 ? "左" : "右"}走 $${lines(x)}$ 格。\n\n${stepLabel(2, "Move up or down", "上下移动")["zh-CN"]}$${y}$ 是 $${lines(y)}$ 个半单位，所以再向${y < 0 ? "下" : "上"}走 $${lines(y)}$ 格。在那里标出 $${tex(p)}$。\n\n**检验。** ${zh}，这个点正好在那条半单位的网格线上。`,
            ),
          };
        },
      ),
      figure: {
        svg: plane({ xMin: -4, xMax: 4, yMin: -4, yMax: 4, step: 0.5, labelEvery: 2 }, [dot([1.5, -2], "P")]),
        alt: t("The point P at (1.5, −2) on a grid with lines every half unit.", "每半个单位一条线的网格上的点 P(1.5, −2)。"),
      },
    },
  ],
  "reflections-of-points-in-the-coordinate-plane": [
    skill(
      "marking-a-reflected-point",
      ["Marking a reflected point", "标出反射后的点"],
      [
        "A reflection across an axis keeps a point at the same distance from that axis, on the other side. Across the $x$-axis the point moves up or down, so its second coordinate changes sign and its first stays. Across the $y$-axis it moves left or right, so its first coordinate changes sign and its second stays. Across the $y$-axis, $(-4, 1)$ goes to $(4, 1)$.\n\nCheck: $(-4, 1)$ is $4$ left of the $y$-axis and $(4, 1)$ is $4$ right of it, at the same height.\n\n> **Watch out.** Change only one sign: changing both turns the point halfway round the origin instead.",
        "关于坐标轴的反射使点到这条轴的距离不变，并落到另一侧。关于 $x$ 轴反射时，点上下移动，所以第二个坐标变号，第一个不变。关于 $y$ 轴反射时，点左右移动，所以第一个坐标变号，第二个不变。$(-4, 1)$ 关于 $y$ 轴反射后是 $(4, 1)$。\n\n检验：$(-4, 1)$ 在 $y$ 轴左边 $4$，$(4, 1)$ 在 $y$ 轴右边 $4$，高度相同。\n\n> **注意。** 只改变一个符号：两个都变就成了绕原点转半圈。",
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
            `${stepLabel(1, "Find the distance", "量距离").en} $P${tex(p)}$ is $${Math.abs(overX ? p[1] : p[0])}$ ${overX ? (p[1] > 0 ? "above" : "below") : p[0] > 0 ? "right of" : "left of"} the ${overX ? "$x$" : "$y$"}-axis.\n\n${stepLabel(2, "Cross the mirror", "越过镜面").en} Go straight across the axis to the same distance on the other side; the ${overX ? "second" : "first"} coordinate changes sign: $${tex(p)} \\to ${tex(image)}$. Mark it there.\n\n**Check.** The ${overX ? "first" : "second"} coordinate, $${overX ? p[0] : p[1]}$, did not change, and the axis is halfway between $P$ and its image.`,
            `${stepLabel(1, "Find the distance", "量距离")["zh-CN"]}$P${tex(p)}$ 在 ${overX ? "$x$" : "$y$"} 轴${overX ? (p[1] > 0 ? "上方" : "下方") : p[0] > 0 ? "右边" : "左边"} $${Math.abs(overX ? p[1] : p[0])}$ 处。\n\n${stepLabel(2, "Cross the mirror", "越过镜面")["zh-CN"]}垂直越过这条轴，到另一侧相同距离处；${overX ? "第二" : "第一"}个坐标变号：$${tex(p)} \\to ${tex(image)}$。在那里标点。\n\n**检验。** ${overX ? "第一" : "第二"}个坐标 $${overX ? p[0] : p[1]}$ 没有变，而且这条轴在 $P$ 和它的像的正中间。`,
          ),
          solutionAlt: t(`P at ${tex(p)} and its image at ${tex(image)}.`, `P 在 ${tex(p)}，它的像在 ${tex(image)}。`),
          solutionMarks: [{ kind: "segment", a: p, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
  midpoints: [
    {
      ...skill(
        "marking-a-midpoint",
        ["Marking a midpoint", "标出中点"],
        [
          "The midpoint of a segment is halfway along it in both directions. Its first coordinate is the average of the two first coordinates, and its second is the average of the two second coordinates. For $A(-2, 1)$ and $B(4, 5)$: $\\frac{-2 + 4}{2} = 1$ and $\\frac{1 + 5}{2} = 3$, so the midpoint is $(1, 3)$.\n\nCheck: from $A$ to $(1, 3)$ is $3$ right and $2$ up, and from $(1, 3)$ to $B$ is again $3$ right and $2$ up.\n\n> **Watch out.** Add, then halve. $(-2 + 4, 1 + 5) = (2, 6)$ is not the midpoint, and neither is the difference $(6, 4)$.",
          "线段的中点在两个方向上都位于正中间。它的第一个坐标是两个第一坐标的平均数，第二个坐标是两个第二坐标的平均数。对于 $A(-2, 1)$ 和 $B(4, 5)$：$\\frac{-2 + 4}{2} = 1$，$\\frac{1 + 5}{2} = 3$，所以中点是 $(1, 3)$。\n\n检验：从 $A$ 到 $(1, 3)$ 是向右 $3$、向上 $2$，从 $(1, 3)$ 到 $B$ 也是向右 $3$、向上 $2$。\n\n> **注意。** 先相加，再取一半。$(-2 + 4, 1 + 5) = (2, 6)$ 不是中点，两者的差 $(6, 4)$ 也不是。",
        ],
        (rng) => {
          const m: Pt = [rng.int(-2, 2), rng.int(-2, 2)];
          const [dx, dy] = [nonzero(rng, 3), nonzero(rng, 3)];
          const a: Pt = [m[0] - dx, m[1] - dy];
          const b: Pt = [m[0] + dx, m[1] + dy];
          const sum = (u: number, v: number) => `${u} ${v < 0 ? `- ${-v}` : `+ ${v}`}`;
          const step = (d: number, pos: string, neg: string) => `${Math.abs(d)} ${d < 0 ? neg : pos}`;
          const s1 = stepLabel(1, "First coordinate", "第一个坐标");
          const s2 = stepLabel(2, "Second coordinate", "第二个坐标");
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
              `${s1.en} Average the first coordinates: $\\frac{${sum(a[0], b[0])}}{2} = ${m[0]}$.\n\n${s2.en} Average the second coordinates: $\\frac{${sum(a[1], b[1])}}{2} = ${m[1]}$. Mark $${tex(m)}$.\n\n**Check.** From $A$ to $${tex(m)}$ is ${step(dx, "right", "left")} and ${step(dy, "up", "down")}, and from $${tex(m)}$ to $B$ is the same again.`,
              `${s1["zh-CN"]}第一个坐标取平均：$\\frac{${sum(a[0], b[0])}}{2} = ${m[0]}$。\n\n${s2["zh-CN"]}第二个坐标取平均：$\\frac{${sum(a[1], b[1])}}{2} = ${m[1]}$。标出 $${tex(m)}$。\n\n**检验。** 从 $A$ 到 $${tex(m)}$ 是向${dx < 0 ? "左" : "右"} $${Math.abs(dx)}$、向${dy < 0 ? "下" : "上"} $${Math.abs(dy)}$，从 $${tex(m)}$ 到 $B$ 也一样。`,
            ),
            solutionAlt: t(`The midpoint ${tex(m)} of the segment.`, `线段的中点 ${tex(m)}。`),
          });
        },
      ),
      figure: {
        svg: plane(grid, [{ kind: "segment", a: [-2, 1], b: [4, 5], accent: true }, dot([-2, 1], "A"), dot([4, 5], "B"), dot([1, 3], "M")]),
        alt: t("Segment AB from (−2, 1) to (4, 5) with its midpoint M at (1, 3).", "线段 AB 从 (−2, 1) 到 (4, 5)，中点 M 在 (1, 3)。"),
      },
    },
  ],
  "graphing-linear-equations": [
    {
      ...skill(
        "drawing-a-line-from-its-equation",
        ["Drawing a line from its equation", "根据方程画直线"],
        [
          "Two points fix a line. To draw $y = mx + b$, pick two easy values of $x$, work out $y$ for each, and mark the two points. $x = 0$ is the easiest, as it gives $y = b$. If $m$ is a fraction, pick an $x$ that clears the denominator, so both points land on the grid. For $y = 2x - 1$: $x = 0$ gives $(0, -1)$ and $x = 1$ gives $(1, 1)$.\n\nCheck: a third point should line up too: $x = 2$ gives $y = 3$, and $(2, 3)$ is on the same line.\n\n> **Watch out.** At $x = 0$ the value is $b$ itself, sign included: $y = 2x - 1$ starts at $-1$, not $1$.",
          "两点确定一条直线。要画 $y = mx + b$，选两个好算的 $x$ 值，分别算出 $y$，标出这两个点。$x = 0$ 最好算，它给出 $y = b$。如果 $m$ 是分数，选能消去分母的 $x$，这样两个点都落在网格上。对于 $y = 2x - 1$：$x = 0$ 得 $(0, -1)$，$x = 1$ 得 $(1, 1)$。\n\n检验：第三个点也应在同一条直线上：$x = 2$ 时 $y = 3$，$(2, 3)$ 正在这条直线上。\n\n> **注意。** $x = 0$ 时的值就是 $b$，连同符号：$y = 2x - 1$ 从 $-1$ 开始，不是 $1$。",
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
          const back: Pt = [-q, b - p];
          const s1 = stepLabel(1, "Start at x = 0", "从 x = 0 开始");
          const s2 = stepLabel(2, "Pick a second x", "再选一个 x");
          const times = q === 1 ? `${p < 0 ? `(${p})` : p} \\cdot ${q}` : `${slope} \\cdot ${q}`;
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
              `${s1.en} At $x = 0$, $y = ${b}$. Mark $${tex(first)}$.\n\n${s2.en} At $x = ${q}$, $y = ${times}${tail} = ${b + p}$. Mark $${tex(second)}$ and draw the line through both points.\n\n**Check.** One more point fits: at $x = ${-q}$, $y = ${b - p}$, and $${tex(back)}$ lies on the same line, as far on the other side of $${tex(first)}$.`,
              `${s1["zh-CN"]}$x = 0$ 时 $y = ${b}$。标出 $${tex(first)}$。\n\n${s2["zh-CN"]}$x = ${q}$ 时 $y = ${times}${tail} = ${b + p}$。标出 $${tex(second)}$，过这两点画直线。\n\n**检验。** 再取一个点：$x = ${-q}$ 时 $y = ${b - p}$，$${tex(back)}$ 也在这条直线上，在 $${tex(first)}$ 的另一侧，距离相同。`,
            ),
            solutionAlt: t(`The line through ${tex(first)} and ${tex(second)}.`, `经过 ${tex(first)} 和 ${tex(second)} 的直线。`),
            solutionMarks: [{ kind: "line", a: first, b: second, accent: true }],
          });
        },
      ),
      figure: {
        svg: plane(grid, [{ kind: "line", a: [0, -1], b: [1, 1], accent: true }, dot([0, -1], "(0, -1)"), dot([1, 1], "(1, 1)")]),
        alt: t("The line y = 2x − 1 through (0, −1) and (1, 1).", "直线 y = 2x − 1 经过 (0, −1) 和 (1, 1)。"),
      },
    },
    {
      ...skill(
        "marking-the-intercepts-of-a-line",
        ["Marking the intercepts of a line", "标出直线的截距点"],
        [
          "The $x$-intercept is where a line meets the $x$-axis, where $y = 0$. The $y$-intercept is where it meets the $y$-axis, where $x = 0$. Set each variable to $0$ in turn and solve for the other. For $3x + 2y = 6$: $y = 0$ gives $x = 2$, and $x = 0$ gives $y = 3$, so the intercepts are $(2, 0)$ and $(0, 3)$.\n\nCheck: $3(2) + 2(0) = 6$ and $3(0) + 2(3) = 6$.\n\n> **Watch out.** For the $x$-intercept divide by the number in front of $x$: $6 \\div 3 = 2$, not $6 \\div 2 = 3$.",
          "$x$ 轴截距点是直线与 $x$ 轴的交点，此时 $y = 0$。$y$ 轴截距点是直线与 $y$ 轴的交点，此时 $x = 0$。依次令每个变量为 $0$，解出另一个。对于 $3x + 2y = 6$：令 $y = 0$ 得 $x = 2$，令 $x = 0$ 得 $y = 3$，所以两个截距点是 $(2, 0)$ 和 $(0, 3)$。\n\n检验：$3(2) + 2(0) = 6$，$3(0) + 2(3) = 6$。\n\n> **注意。** 求 $x$ 轴截距时要除以 $x$ 前面的数：$6 \\div 3 = 2$，不是 $6 \\div 2 = 3$。",
        ],
        (rng) => {
          const [u, v] = rng.shuffle([1, 2, 3, 4, 5, 6]);
          const p = rng.sign() * (u as number);
          const q = rng.sign() * (v as number);
          const equation = `${poly([q, "x"], [p, "y"])} = ${p * q}`;
          const onX: Pt = [p, 0];
          const onY: Pt = [0, q];
          const s1 = stepLabel(1, "Set y to 0", "令 y = 0");
          const s2 = stepLabel(2, "Set x to 0", "令 x = 0");
          const pq = p * q;
          const half: Pt = [p / 2, q / 2];
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
              `${s1.en} $${poly([q, "x"])} = ${pq}$, so $x = ${p}$. Mark $${tex(onX)}$.\n\n${s2.en} $${poly([p, "y"])} = ${pq}$, so $y = ${q}$. Mark $${tex(onY)}$.\n\n**Check.** The point halfway between them, $${tex(half)}$, fits too: $${poly([q, "x"], [p, "y"])}$ there is $${pq / 2} + ${pq / 2 < 0 ? `(${pq / 2})` : pq / 2} = ${pq}$.`,
              `${s1["zh-CN"]}$${poly([q, "x"])} = ${pq}$，所以 $x = ${p}$。标出 $${tex(onX)}$。\n\n${s2["zh-CN"]}$${poly([p, "y"])} = ${pq}$，所以 $y = ${q}$。标出 $${tex(onY)}$。\n\n**检验。** 两点正中间的点 $${tex(half)}$ 也满足方程：在那里 $${poly([q, "x"], [p, "y"])}$ 等于 $${pq / 2} + ${pq / 2 < 0 ? `(${pq / 2})` : pq / 2} = ${pq}$。`,
            ),
            solutionAlt: t(`The line through ${tex(onX)} and ${tex(onY)}.`, `经过 ${tex(onX)} 和 ${tex(onY)} 的直线。`),
            solutionMarks: [{ kind: "line", a: onX, b: onY, accent: true }],
          });
        },
      ),
      figure: {
        svg: plane(grid, [{ kind: "line", a: [2, 0], b: [0, 3], accent: true }, dot([2, 0], "(2, 0)"), dot([0, 3], "(0, 3)")]),
        alt: t("The line 3x + 2y = 6 with its intercepts (2, 0) and (0, 3) marked.", "直线 3x + 2y = 6，标出截距点 (2, 0) 和 (0, 3)。"),
      },
    },
    {
      ...skill(
        "drawing-horizontal-and-vertical-lines",
        ["Drawing horizontal and vertical lines", "画水平线和竖直线"],
        [
          "The equation $x = 3$ puts no condition on $y$: every point with first coordinate $3$ is on it, so the line is vertical. In the same way, $y = 3$ is horizontal. To draw either one, mark two points that keep the named coordinate fixed and change the other: $(3, 0)$ and $(3, 1)$ for $x = 3$.\n\nCheck: the two points are one above the other, so the line through them is vertical.\n\n> **Watch out.** $x = 3$ is not the point $(0, 3)$ or a horizontal line at height $3$: it is $x$ that stays $3$.",
          "方程 $x = 3$ 对 $y$ 没有限制：所有第一个坐标为 $3$ 的点都在线上，所以这是竖直线。同样，$y = 3$ 是水平线。要画它们，就标出两个点：保持方程中那个坐标不变，改变另一个坐标。$x = 3$ 可以取 $(3, 0)$ 和 $(3, 1)$。\n\n检验：这两个点上下对齐，所以过它们的直线是竖直的。\n\n> **注意。** $x = 3$ 不是点 $(0, 3)$，也不是高度为 $3$ 的水平线：保持为 $3$ 的是 $x$。",
        ],
        (rng) => {
          const c = nonzero(rng, 5);
          const vertical = rng.bool();
          const name = vertical ? "x" : "y";
          const other = vertical ? "y" : "x";
          const first: Pt = vertical ? [c, 0] : [0, c];
          const second: Pt = vertical ? [c, 1] : [1, c];
          const swapped: Pt = vertical ? [0, c] : [c, 0];
          const swapped2: Pt = vertical ? [1, c] : [c, 1];
          const doubled = rng.bool();
          const equation = doubled ? `2${name} = ${2 * c}` : `${name} = ${c}`;
          const s1 = stepLabel(1, `Read ${name}`, `读出 ${name}`);
          const s2 = stepLabel(2, "Mark two points", "标出两个点");
          const [en1, zh1] = doubled
            ? [`Divide by $2$: $${equation}$ means $${name} = ${c}$.`, `两边除以 $2$：$${equation}$ 就是 $${name} = ${c}$。`]
            : [`Every point of the line has $${name} = ${c}$.`, `这条直线上每个点都有 $${name} = ${c}$。`];
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
              `${s1.en} ${en1} The value of $${other}$ can be anything.\n\n${s2.en} Keep $${name} = ${c}$ and take $${other} = 0$ and $${other} = 1$: $${tex(first)}$ and $${tex(second)}$. Draw the line through them.\n\n**Check.** The two points are ${vertical ? "one above the other" : "side by side"}, so the line is ${vertical ? "vertical" : "horizontal"}, as an equation with only $${name}$ should be.`,
              `${s1["zh-CN"]}${zh1}$${other}$ 可以取任意值。\n\n${s2["zh-CN"]}保持 $${name} = ${c}$，取 $${other} = 0$ 和 $${other} = 1$：$${tex(first)}$ 和 $${tex(second)}$。过这两点画直线。\n\n**检验。** 这两个点${vertical ? "上下对齐" : "左右并排"}，所以直线是${vertical ? "竖直线" : "水平线"}，只含 $${name}$ 的方程正应如此。`,
            ),
            solutionAlt: t(`The line ${name} = ${c}.`, `直线 ${name} = ${c}。`),
            solutionMarks: [{ kind: "line", a: first, b: second, accent: true }],
          });
        },
      ),
      figure: {
        svg: plane(grid, [{ kind: "line", a: [3, 0], b: [3, 1], accent: true }, dot([3, 0], "(3, 0)"), dot([3, 1], "(3, 1)")]),
        alt: t("The vertical line x = 3 through (3, 0) and (3, 1).", "竖直线 x = 3 经过 (3, 0) 和 (3, 1)。"),
      },
    },
  ],
  "slope-intercept-form": [
    skill(
      "marking-a-point-by-rise-and-run",
      ["Marking a point by rise and run", "按升降和水平距离标点"],
      [
        `A slope $\\frac{p}{q}$ says that each $q$ steps to the right go with $p$ steps up, or down if $p$ is negative. So from any point on a line you can reach another point of it without any calculation: count the run to the right, then the rise.

For a line through $(1, -2)$ with slope $-\\frac{3}{2}$: go $2$ to the right and $3$ down, to $(3, -5)$. Both points are on the line, and joining them draws it.

> **Watch out.** The rise is the **top** of the slope and the run the bottom: slope $\\frac{3}{2}$ means $2$ across and $3$ up, not $3$ across and $2$ up. A negative slope means the rise goes **down**.`,
        `斜率 $\\frac{p}{q}$ 表示每向右 $q$ 步，就向上 $p$ 步（$p$ 为负时向下）。所以从直线上任意一点出发，不用计算就能走到直线上的另一点：先向右数水平距离，再数升降。

过 $(1, -2)$、斜率为 $-\\frac{3}{2}$ 的直线：向右走 $2$，向下走 $3$，到达 $(3, -5)$。两点都在直线上，连起来就画出了直线。

> **注意。** 斜率的**分子**是升降，分母是水平距离：斜率 $\\frac{3}{2}$ 表示横走 $2$、向上 $3$，不是横走 $3$、向上 $2$。斜率为负时，升降是**向下**。`,
      ],
      (rng) => {
        const a: Pt = [rng.int(-4, 0), rng.int(-2, 2)];
        const run = rng.int(1, 3);
        // A rise that shares a factor with the run would show a slope not in lowest terms, such as 2/2.
        const rise = rng.pick(run === 1 ? [-3, -2, -1, 1, 2, 3] : run === 2 ? [-3, -1, 1, 3] : [-2, -1, 1, 2]);
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
            `The slope $${slope}$ means a rise of $${rise}$ for each run of $${run}$, since the rise is the top of the slope.

From $A${tex(a)}$, go $${run}$ to the right and $${Math.abs(rise)}$ ${rise < 0 ? "down" : "up"}, which gives $${tex(next)}$.

**Check.** From $A$ to $${tex(next)}$ the rise over the run is $\\frac{${next[1]} - ${a[1] < 0 ? `(${a[1]})` : a[1]}}{${next[0]} - ${a[0] < 0 ? `(${a[0]})` : a[0]}} = \\frac{${rise}}{${run}}$, the slope.`,
            `斜率 $${slope}$ 表示每横走 $${run}$，升降 $${rise}$，因为斜率的分子是升降。

从 $A${tex(a)}$ 向右走 $${run}$，再向${rise < 0 ? "下" : "上"}走 $${Math.abs(rise)}$，得到 $${tex(next)}$。

**检验。** 从 $A$ 到 $${tex(next)}$，升降比水平距离是 $\\frac{${next[1]} - ${a[1] < 0 ? `(${a[1]})` : a[1]}}{${next[0]} - ${a[0] < 0 ? `(${a[0]})` : a[0]}} = \\frac{${rise}}{${run}}$，正是斜率。`,
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
        `A point lies on a line exactly when it satisfies the line's equation. So a point on **both** lines satisfies both equations at once, which is what a solution of the system is: the crossing point of the two lines is the solution.

To find it from a drawing, follow the two lines to where they meet and read the coordinates of that grid point, across first, then up. Then check it: if the lines $y = x + 1$ and $y = -x + 5$ cross at $(2, 3)$, then $2 + 1 = 3$ and $-2 + 5 = 3$, so $(2, 3)$ fits both.

> **Watch out.** Write the crossing point with its $x$-coordinate first; $(3, 2)$ is a different point and fits neither equation here. A point on only one line is not a solution.`,
        `点在直线上，当且仅当它满足这条直线的方程。所以同时在**两条**直线上的点同时满足两个方程，这正是方程组的解：两条直线的交点就是解。

从图上找解时，顺着两条直线找到它们相交的格点，读出坐标，先横后竖。然后检验：若直线 $y = x + 1$ 和 $y = -x + 5$ 交于 $(2, 3)$，则 $2 + 1 = 3$，$-2 + 5 = 3$，所以 $(2, 3)$ 两个方程都满足。

> **注意。** 交点要先写 $x$ 坐标；$(3, 2)$ 是另一个点，在这里两个方程都不满足。只在一条直线上的点不是解。`,
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
        const sub = (m: number, b: number) =>
          `${m === 1 ? "" : m === -1 ? "-" : `${m} \\cdot `}${x0 < 0 ? `(${x0})` : x0}${b === 0 ? "" : b < 0 ? ` - ${-b}` : ` + ${b}`}`;
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
            `A solution of the system lies on both lines, so it is where they cross. Following the two lines, they meet at the grid point $${Math.abs(x0)}$ ${x0 < 0 ? "left" : "right"} of the origin and $${Math.abs(y0)}$ ${y0 < 0 ? "down" : "up"}, which is $${tex(c)}$.

**Check.** Put $x = ${x0}$ into each equation: $${sub(p as number, b1)} = ${y0}$ and $${sub(q as number, b2)} = ${y0}$. Both give $y = ${y0}$.`,
            `方程组的解同时在两条直线上，所以就是交点。顺着两条直线看，它们相交于原点${x0 < 0 ? "左" : "右"}边 $${Math.abs(x0)}$、${y0 < 0 ? "下方" : "上方"} $${Math.abs(y0)}$ 的格点，即 $${tex(c)}$。

**检验。** 把 $x = ${x0}$ 代入每个方程：$${sub(p as number, b1)} = ${y0}$，$${sub(q as number, b2)} = ${y0}$。两个都得 $y = ${y0}$。`,
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
        "In $y = a(x - h)^2 + k$, the square is never negative, so $y$ reaches its lowest or highest value when $x = h$, where the square is $0$ and $y = k$. So the vertex is $(h, k)$. For $y = 2(x + 1)^2 - 4$ the square is $0$ at $x = -1$, and there $y = -4$, so the vertex is $(-1, -4)$.\n\n> **Watch out.** Mind the sign of $h$: $(x - 2)^2$ has $h = 2$, and $(x + 2)^2$ has $h = -2$. The number added outside is $k$ with its own sign, and the factor $a$ in front changes neither coordinate of the vertex.",
        "在 $y = a(x - h)^2 + k$ 中，平方不会是负数，所以当 $x = h$ 时平方为 $0$，$y = k$，这时 $y$ 达到最低或最高值。所以顶点是 $(h, k)$。对 $y = 2(x + 1)^2 - 4$，平方在 $x = -1$ 时为 $0$，此时 $y = -4$，所以顶点是 $(-1, -4)$。\n\n> **注意。** 注意 $h$ 的符号：$(x - 2)^2$ 的 $h = 2$，$(x + 2)^2$ 的 $h = -2$。外面加的数就是 $k$，保持自己的符号；前面的因数 $a$ 不改变顶点的任何一个坐标。",
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
            `**Step 1: Find where the square is $0$.** The square $(x ${h < 0 ? `+ ${-h}` : `- ${h}`})^2$ is $0$ when $x = ${h}$, and it is positive everywhere else, so the vertex has $x = ${h}$.

**Step 2: Find the height there.** With the square $0$, only the number added outside is left: $y = ${k}$. The vertex is $${tex(p)}$. The factor $${a}$ changes the width and direction, not the vertex.

**Check.** Put $x = ${h}$ into the equation: $y = ${a === -1 ? "-" : `${a} \\cdot `}0^2 ${k < 0 ? `- ${-k}` : `+ ${k}`} = ${k}$, and every other $x$ makes the square positive, so $y$ is ${a > 0 ? "larger" : "smaller"} there.`,
            `**第一步：找出平方为 $0$ 的位置。** 平方 $(x ${h < 0 ? `+ ${-h}` : `- ${h}`})^2$ 在 $x = ${h}$ 时为 $0$，在其他地方都为正，所以顶点的 $x = ${h}$。

**第二步：求出那里的高度。** 平方为 $0$ 时只剩外面加的数：$y = ${k}$。顶点是 $${tex(p)}$。因数 $${a}$ 改变的是宽窄和开口方向，不改变顶点。

**检验。** 把 $x = ${h}$ 代入方程：$y = ${a === -1 ? "-" : `${a} \\cdot `}0^2 ${k < 0 ? `- ${-k}` : `+ ${k}`} = ${k}$；其他的 $x$ 都使平方为正，所以那里的 $y$ 都更${a > 0 ? "大" : "小"}。`,
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
        "A product is $0$ exactly when one of its factors is $0$. So $y = (x - r)(x - s)$ meets the $x$-axis where $x = r$ and where $x = s$. These are points on the axis, with second coordinate $0$. As with the vertex form, the sign inside the factor is the opposite of the root. For $y = (x - 1)(x + 3)$ the first factor is $0$ at $x = 1$ and the second at $x = -3$, so the points are $(1, 0)$ and $(-3, 0)$.\n\n> **Watch out.** The factor $x + 3$ is $0$ at $x = -3$, not at $3$. And the points lie on the $x$-axis, so they are written $(1, 0)$ and $(-3, 0)$, with $0$ second, not $(0, 1)$ and $(0, -3)$.",
        "乘积为 $0$，当且仅当其中一个因式为 $0$。所以 $y = (x - r)(x - s)$ 在 $x = r$ 和 $x = s$ 处与 $x$ 轴相交。这些点在轴上，第二个坐标是 $0$。和顶点式一样，因式里的符号与根相反。对 $y = (x - 1)(x + 3)$，第一个因式在 $x = 1$ 时为 $0$，第二个在 $x = -3$ 时为 $0$，所以两点是 $(1, 0)$ 和 $(-3, 0)$。\n\n> **注意。** 因式 $x + 3$ 在 $x = -3$ 时为 $0$，不是在 $3$。这些点在 $x$ 轴上，所以写成 $(1, 0)$ 和 $(-3, 0)$，$0$ 在后，不是 $(0, 1)$ 和 $(0, -3)$。",
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
            `A product is $0$ exactly when one of its factors is $0$, and on the $x$-axis $y = 0$. So set each factor equal to $0$: $${factor(r)} = 0$ when $x = ${r}$, and $${factor(s)} = 0$ when $x = ${s}$. The points are $${tex([r, 0])}$ and $${tex([s, 0])}$.

**Check.** At $x = ${r}$ the first factor is $${r} ${r < 0 ? `+ ${-r}` : `- ${r}`} = 0$, and at $x = ${s}$ the second is $${s} ${s < 0 ? `+ ${-s}` : `- ${s}`} = 0$; either way the product, $y$, is $0$.`,
            `乘积为 $0$，当且仅当其中一个因式为 $0$，而在 $x$ 轴上 $y = 0$。所以令每个因式等于 $0$：当 $x = ${r}$ 时 $${factor(r)} = 0$，当 $x = ${s}$ 时 $${factor(s)} = 0$。两点是 $${tex([r, 0])}$ 和 $${tex([s, 0])}$。

**检验。** 在 $x = ${r}$ 处第一个因式是 $${r} ${r < 0 ? `+ ${-r}` : `- ${r}`} = 0$，在 $x = ${s}$ 处第二个是 $${s} ${s < 0 ? `+ ${-s}` : `- ${s}`} = 0$；两种情况下乘积 $y$ 都是 $0$。`,
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
        "The graph of $y = ax^2 + c$ is symmetric about the $y$-axis, since $x$ and $-x$ have the same square. So once you know the height at $x = 1$, you know it at $x = -1$ as well. Marking such a pair, plus the vertex $(0, c)$, is the quickest way to sketch the parabola. For $y = 2x^2 - 1$, both $x = 1$ and $x = -1$ give $y = 2 \\cdot 1 - 1 = 1$, so the pair is $(1, 1)$ and $(-1, 1)$.\n\n> **Watch out.** The two points have the **same** height: $(-1)^2 = 1$, so $x = -1$ does not give the opposite of the height at $x = 1$. And write each point with $x$ first.",
        "$y = ax^2 + c$ 的图像关于 $y$ 轴对称，因为 $x$ 和 $-x$ 的平方相同。所以知道了 $x = 1$ 处的高度，也就知道了 $x = -1$ 处的高度。标出这样一对点，再加上顶点 $(0, c)$，是画抛物线最快的方法。对 $y = 2x^2 - 1$，$x = 1$ 和 $x = -1$ 都给出 $y = 2 \\cdot 1 - 1 = 1$，所以这一对点是 $(1, 1)$ 和 $(-1, 1)$。\n\n> **注意。** 两个点的高度**相同**：$(-1)^2 = 1$，所以 $x = -1$ 处的高度不是 $x = 1$ 处高度的相反数。每个点都要 $x$ 在前。",
      ],
      (rng) => {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(-2, 2);
        const at = rng.pick([1, 2]);
        const use = at === 2 && Math.abs(a) > 1 ? 1 : at;
        const y = a * use * use + c;
        const tail = c === 0 ? "" : c < 0 ? ` - ${-c}` : ` + ${c}`;
        const equation = `y = ${a === 1 ? "" : a === -1 ? "-" : a}x^2${tail}`;
        const calc = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${use * use}${tail}`;
        const height = calc === String(y) ? `y = ${y}` : `y = ${calc} = ${y}`;
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
            `**Step 1: Square the inputs.** $${use}^2 = ${use * use}$ and $(${-use})^2 = ${use * use}$: the two inputs have the same square.

**Step 2: Compute the height.** Both points have $${height}$. The points are $${tex([use, y])}$ and $${tex([-use, y])}$.

**Check.** The vertex $(0, ${c})$ lies halfway between the two points, and both are ${y > c ? "above" : "below"} it by $${Math.abs(y - c)}$, as the mirror symmetry about the $y$-axis says.`,
            `**第一步：把输入平方。** $${use}^2 = ${use * use}$，$(${-use})^2 = ${use * use}$：两个输入的平方相同。

**第二步：计算高度。** 两处都有 $${height}$。两点是 $${tex([use, y])}$ 和 $${tex([-use, y])}$。

**检验。** 顶点 $(0, ${c})$ 在两点的正中间，两点都在它${y > c ? "上方" : "下方"} $${Math.abs(y - c)}$ 处，正符合关于 $y$ 轴的对称。`,
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
        "The graph of $y = |x - h| + k$ has the shape of a V. An absolute value is never negative, so the lowest point comes where the inside is $0$, at $x = h$, and there $y = k$. The corner is therefore $(h, k)$, read in the same way as the vertex of a parabola. For $y = |x + 3| - 2$ the inside is $0$ at $x = -3$, so the corner is $(-3, -2)$.\n\n> **Watch out.** The inside is $0$ at the opposite of the number you see: $|x + 3|$ is $0$ at $x = -3$, not $3$. The number outside keeps its own sign, and the corner is written $(x, y)$, with the number from inside the bars first.",
        "$y = |x - h| + k$ 的图像是 V 形。绝对值不会是负数，所以最低点出现在里面为 $0$ 的地方，即 $x = h$，此时 $y = k$。因此拐点是 $(h, k)$，读法和抛物线的顶点一样。对 $y = |x + 3| - 2$，里面在 $x = -3$ 时为 $0$，所以拐点是 $(-3, -2)$。\n\n> **注意。** 里面为 $0$ 的位置是看到的数的相反数：$|x + 3|$ 在 $x = -3$ 处为 $0$，不是 $3$。外面的数保持自己的符号；拐点写成 $(x, y)$，绝对值里面得出的数在前。",
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
            `**Step 1: where the inside is $0$.** $x ${h < 0 ? `+ ${-h}` : `- ${h}`} = 0$ when $x = ${h}$. There the absolute value is $0$, its least value, so the graph is lowest.\n\n**Step 2: the height there.** $y = 0 ${k < 0 ? `- ${-k}` : `+ ${k}`} = ${k}$. The corner is $${tex(p)}$.\n\n**Check.** One step to either side the graph is higher: at $x = ${h - 1}$ and at $x = ${h + 1}$ the absolute value is $1$, so $y = ${k + 1}$ at both, more than $${k}$.`,
            `**第一步：里面为 $0$ 的位置。** 当 $x = ${h}$ 时 $x ${h < 0 ? `+ ${-h}` : `- ${h}`} = 0$。这时绝对值取最小值 $0$，图像最低。\n\n**第二步：这里的高度。** $y = 0 ${k < 0 ? `- ${-k}` : `+ ${k}`} = ${k}$。拐点是 $${tex(p)}$。\n\n**检验。** 向任意一侧走一步，图像都更高：在 $x = ${h - 1}$ 和 $x = ${h + 1}$ 处绝对值都是 $1$，所以两处都有 $y = ${k + 1}$，比 $${k}$ 大。`,
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
        "If $f(a) = b$, then $f^{-1}(b) = a$. So each point $(a, b)$ on the graph of $f$ gives the point $(b, a)$ on the graph of $f^{-1}$. Swapping coordinates is a reflection across the line $y = x$, so the two graphs are mirror images of each other.\n\n> **Watch out.** Swapping the coordinates is not changing their signs: $(a, b)$ goes to $(b, a)$, not to $(-a, -b)$ or $(a, -b)$.",
        "如果 $f(a) = b$，那么 $f^{-1}(b) = a$。所以 $f$ 的图像上每个点 $(a, b)$ 都对应 $f^{-1}$ 的图像上的点 $(b, a)$。对调坐标就是关于直线 $y = x$ 的反射，所以两个图像互为镜像。\n\n> **注意。** 对调坐标不是改变符号：$(a, b)$ 变成 $(b, a)$，而不是 $(-a, -b)$ 或 $(a, -b)$。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const image: Pt = [p[1], p[0]];
        const sum = p[0] + p[1];
        const mid = sum % 2 === 0 ? String(sum / 2) : `${sum < 0 ? "-" : ""}\\frac{${Math.abs(sum)}}{2}`;
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
            `${stepLabel(1, "Read the point", "读懂这个点").en} The point $P${tex(p)}$ on the graph of $f$ means $f(${p[0]}) = ${p[1]}$.\n\n${stepLabel(2, "Swap the coordinates", "对调坐标").en} Then $f^{-1}(${p[1]}) = ${p[0]}$, so the matching point is $${tex(image)}$, the mirror image of $P$ across $y = x$.\n\n**Check.** The midpoint of $P$ and $${tex(image)}$ is\n\n$$\\left(${mid}, ${mid}\\right)$$\n\nIt lies on $y = x$, and the segment joining the two points has slope $-1$, so it is perpendicular to $y = x$.`,
            `${stepLabel(1, "Read the point", "读懂这个点")["zh-CN"]}点 $P${tex(p)}$ 在 $f$ 的图像上，意思是 $f(${p[0]}) = ${p[1]}$。\n\n${stepLabel(2, "Swap the coordinates", "对调坐标")["zh-CN"]}于是 $f^{-1}(${p[1]}) = ${p[0]}$，对应的点是 $${tex(image)}$，也就是 $P$ 关于 $y = x$ 的镜像。\n\n**检验。** $P$ 与 $${tex(image)}$ 的中点是\n\n$$\\left(${mid}, ${mid}\\right)$$\n\n它在 $y = x$ 上，连接两点的线段斜率为 $-1$，与 $y = x$ 垂直。`,
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
        "A translation moves every point by the same amount. To find the image of a vertex, count the move across from the vertex, then the move up or down. Every other vertex would move in the same way, so the image has the same size, shape and direction as the figure.\n\n> **Watch out.** The move across changes only the first coordinate and the move up or down only the second: do not count the vertical move along the $x$-axis. Left and down go toward smaller numbers.",
        "平移使每个点移动相同的量。要找顶点的像，从顶点开始数水平移动，再数上下移动。其他顶点也同样移动，所以像和原图形的大小、形状、方向都相同。\n\n> **注意。** 水平移动只改变第一个坐标，上下移动只改变第二个坐标：不要把上下移动的格数沿 $x$ 轴去数。向左、向下是朝较小的数移动。",
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
            `${stepLabel(1, "move across", "水平移动").en} From $A${tex(a)}$, moving $${Math.abs(p)}$ ${across[0]} changes the first coordinate: $${a[0]} ${p < 0 ? "-" : "+"} ${Math.abs(p)} = ${image[0]}$.\n\n${stepLabel(2, "move up or down", "上下移动").en} Moving $${Math.abs(q)}$ ${up[0]} changes the second coordinate: $${a[1]} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${image[1]}$. Mark the image at $${tex(image)}$.\n\n**Check.** Move the image back, $${Math.abs(p)}$ ${p > 0 ? "left" : "right"} and $${Math.abs(q)}$ ${q > 0 ? "down" : "up"}: $(${image[0]} ${p > 0 ? "-" : "+"} ${Math.abs(p)}, ${image[1]} ${q > 0 ? "-" : "+"} ${Math.abs(q)}) = ${tex(a)}$, which is $A$.`,
            `${stepLabel(1, "move across", "水平移动")["zh-CN"]}从 $A${tex(a)}$ 出发，向${across[1]}移 $${Math.abs(p)}$ 改变第一个坐标：$${a[0]} ${p < 0 ? "-" : "+"} ${Math.abs(p)} = ${image[0]}$。\n\n${stepLabel(2, "move up or down", "上下移动")["zh-CN"]}向${up[1]}移 $${Math.abs(q)}$ 改变第二个坐标：$${a[1]} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${image[1]}$。在 $${tex(image)}$ 处标出像。\n\n**检验。** 把像移回去，向${p > 0 ? "左" : "右"}移 $${Math.abs(p)}$，向${q > 0 ? "下" : "上"}移 $${Math.abs(q)}$：$(${image[0]} ${p > 0 ? "-" : "+"} ${Math.abs(p)}, ${image[1]} ${q > 0 ? "-" : "+"} ${Math.abs(q)}) = ${tex(a)}$，正是 $A$。`,
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
        "A turn about the origin follows a rule. A quarter turn counterclockwise sends $(x, y)$ to $(-y, x)$, a quarter turn clockwise sends it to $(y, -x)$, and a half turn sends it to $(-x, -y)$. You can check a result on the grid: the point stays at the same distance from the origin, and it lands in the quadrant the turn leads to.\n\n> **Watch out.** Swapping the coordinates alone, $(x, y) \\to (y, x)$, is a reflection across $y = x$, not a turn: a quarter turn swaps them *and* changes one sign, the first for counterclockwise and the second for clockwise.",
        "绕原点的旋转遵循规则。逆时针转四分之一圈把 $(x, y)$ 变成 $(-y, x)$，顺时针转四分之一圈把它变成 $(y, -x)$，转半圈把它变成 $(-x, -y)$。可以在网格上检验：点到原点的距离不变，并落在旋转后对应的象限。\n\n> **注意。** 只对调坐标，$(x, y) \\to (y, x)$，是关于 $y = x$ 的反射，不是旋转：转四分之一圈要对调坐标，*并且*改变一个符号，逆时针改第一个，顺时针改第二个。",
      ],
      (rng) => {
        const p = apart(rng, 5);
        const turn = rng.pick(rotations);
        const image = turn.move(p);
        const back = rotations[[1, 0, 2][rotations.indexOf(turn)]!]!;
        const sq = (n: number) => (n < 0 ? `(${n})^2` : `${n}^2`);
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
            `${stepLabel(1, "find the rule", "找出规则").en} A rotation of ${turn.en} about the origin follows the rule $${turn.rule}$.\n\n${stepLabel(2, "apply it", "代入").en} With $x = ${p[0]}$ and $y = ${p[1]}$, the rule gives $${tex(p)} \\to ${tex(image)}$. Mark the image there.\n\n**Check.** Turn the image back, ${back.en}, by the rule $${back.rule}$: $${tex(image)} \\to ${tex(back.move(image))}$, which is $P$. Both points are also the same distance from the origin: $${sq(p[0])} + ${sq(p[1])} = ${sq(image[0])} + ${sq(image[1])} = ${p[0] ** 2 + p[1] ** 2}$.`,
            `${stepLabel(1, "find the rule", "找出规则")["zh-CN"]}绕原点旋转${turn.zh}的规则是 $${turn.rule}$。\n\n${stepLabel(2, "apply it", "代入")["zh-CN"]}把 $x = ${p[0]}$，$y = ${p[1]}$ 代入，得 $${tex(p)} \\to ${tex(image)}$。在那里标出像。\n\n**检验。** 把像转回去，${back.zh}，规则是 $${back.rule}$：$${tex(image)} \\to ${tex(back.move(image))}$，正是 $P$。两点到原点的距离也相同：$${sq(p[0])} + ${sq(p[1])} = ${sq(image[0])} + ${sq(image[1])} = ${p[0] ** 2 + p[1] ** 2}$。`,
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
        "The rule depends on the mirror. Across the $x$-axis, $(x, y)$ goes to $(x, -y)$; across the $y$-axis, to $(-x, y)$; across $y = x$, to $(y, x)$; and across $y = -x$, to $(-y, -x)$. In every case the mirror is halfway between the point and its image, and the segment joining them is perpendicular to the mirror.\n\n> **Watch out.** Match the rule to the mirror. The axes change one sign without swapping; $y = x$ swaps without changing signs; $y = -x$ swaps *and* changes both signs.",
        "规则取决于镜面。关于 $x$ 轴，$(x, y)$ 变成 $(x, -y)$；关于 $y$ 轴，变成 $(-x, y)$；关于 $y = x$，变成 $(y, x)$；关于 $y = -x$，变成 $(-y, -x)$。无论哪种情况，镜面都在点和像的正中间，连接它们的线段与镜面垂直。\n\n> **注意。** 规则要与镜面对应。关于坐标轴：改变一个符号，不对调；关于 $y = x$：对调，不变号；关于 $y = -x$：对调，*并且*两个都变号。",
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
            `${stepLabel(1, "find the rule", "找出规则").en} A reflection across ${mirror.en} follows the rule $${mirror.rule}$.\n\n${stepLabel(2, "apply it", "代入").en} With $x = ${p[0]}$ and $y = ${p[1]}$, the rule gives $${tex(p)} \\to ${tex(image)}$. Mark the image there.\n\n**Check.** Reflect the image across the same mirror: $${tex(image)} \\to ${tex(mirror.move(image))}$, which is $P$ again, as a reflection done twice undoes itself.`,
            `${stepLabel(1, "find the rule", "找出规则")["zh-CN"]}关于${mirror.zh}的反射规则是 $${mirror.rule}$。\n\n${stepLabel(2, "apply it", "代入")["zh-CN"]}把 $x = ${p[0]}$，$y = ${p[1]}$ 代入，得 $${tex(p)} \\to ${tex(image)}$。在那里标出像。\n\n**检验。** 把像关于同一镜面再反射一次：$${tex(image)} \\to ${tex(mirror.move(image))}$，又回到 $P$，因为反射两次就还原了。`,
          ),
          solutionAlt: t(`P and its image ${tex(image)}, joined across the mirror.`, `P 和它的像 ${tex(image)}，隔着镜面相连。`),
          solutionMarks: [{ kind: "segment", a: p, b: image, dashed: true, tone: "action" }],
        });
      },
    ),
  ],
};
