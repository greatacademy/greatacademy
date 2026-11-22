import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, linear, num, type PlaneMark, type PlaneView, type Point, paren, plane, poly, Q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { annotate, at, away, graphFigure, guides, plain, riseOf, riseRun, slopeFigure, walkTo } from "../graph-figures.ts";
import { viewAround } from "../motion-figures.ts";
import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, verdictChoice, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

function gcd(a: number, b: number): number {
  let [m, n] = [Math.abs(a), Math.abs(b)];
  while (n !== 0) [m, n] = [n, m % n];
  return m;
}

/** fracSlopes are the slopes p/q in lowest terms with 0 < |p| ≤ 5 and q from 2 to 4. */
const fracSlopes: readonly Q[] = [2, 3, 4].flatMap((q) =>
  [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((p) => gcd(p, q) === 1).map((p) => Q.of(p, q)),
);

/** pickSlope draws a nonzero slope: an integer from −5 to 5, or with probability frac a fraction from fracSlopes. */
function pickSlope(rng: Rng, frac = 0.4): Q {
  return rng.bool(frac) ? rng.pick(fracSlopes) : Q.of(rng.nonZero(-5, 5));
}

/** pickSlopeNotOne draws a slope as pickSlope does, but never 1, so that point-slope form keeps its coefficient. */
function pickSlopeNotOne(rng: Rng, frac = 0.4): Q {
  const m = pickSlope(rng, frac);
  return m.eq(Q.one) ? Q.of(rng.pick([2, 3, -2])) : m;
}

/** si writes y = mx + b. */
const si = (m: Coefficient, b: Coefficient) => `y = ${linear(m, b)}`;

/** std writes ax + by = c. */
const std = (a: Coefficient, b: Coefficient, c: Coefficient) => `${poly([a, "x"], [b, "y"])} = ${num(c)}`;

/** coefficient writes m before a parenthesis: "" for 1, "-" for −1. */
function coefficient(m: Coefficient): string {
  const v = toQ(m);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return num(v);
}

/** ps writes the point-slope form y − k = m(x − h). */
const ps = (m: Coefficient, h: Coefficient, k: Coefficient) =>
  `${linear(1, toQ(k).neg(), "y")} = ${toQ(h).isZero() ? poly([m, "x"]) : `${coefficient(m)}(${linear(1, toQ(h).neg())})`}`;

/** standardOf scales ax + by = c to integers without a common factor and a positive leading coefficient. */
function standardOf(a: Coefficient, b: Coefficient, c: Coefficient): [number, number, number] {
  const qs = [a, b, c].map(toQ);
  const bgcd = (x: bigint, y: bigint): bigint => {
    let [m, n] = [x < 0n ? -x : x, y < 0n ? -y : y];
    while (n !== 0n) [m, n] = [n, m % n];
    return m;
  };
  let l = 1n;
  for (const q of qs) l = (l * q.d) / bgcd(l, q.d);
  let ints = qs.map((q) => q.n * (l / q.d));
  const g = ints.reduce((acc, v) => bgcd(acc, v), 0n);
  ints = ints.map((v) => v / g);
  if (ints[0]! < 0n || (ints[0] === 0n && ints[1]! < 0n)) ints = ints.map((v) => -v);
  return [Number(ints[0]), Number(ints[1]), Number(ints[2])];
}

/** stdOfLine writes y = mx + b in standard form. */
const stdOfLine = (m: Q, b: Coefficient) => std(...standardOf(m.neg(), 1, b));

/** system writes two equations as a system. */
const system = (e1: string, e2: string) => `\\begin{cases} ${e1} \\\\ ${e2} \\end{cases}`;

/** solve2 solves a1·x + b1·y = c1, a2·x + b2·y = c2 by Cramer's rule, or returns undefined when the determinant is 0. */
function solve2(a1: Coefficient, b1: Coefficient, c1: Coefficient, a2: Coefficient, b2: Coefficient, c2: Coefficient): [Q, Q] | undefined {
  const [A1, B1, C1, A2, B2, C2] = [a1, b1, c1, a2, b2, c2].map(toQ) as [Q, Q, Q, Q, Q, Q];
  const det = A1.mul(B2).sub(A2.mul(B1));
  if (det.isZero()) return undefined;
  return [C1.mul(B2).sub(C2.mul(B1)).div(det), A1.mul(C2).sub(A2.mul(C1)).div(det)];
}

/** pairs keeps the defined pairs, for the wrong responses of a point problem. */
const pairs = (...ps: readonly (readonly Coefficient[] | undefined)[]) => ps.filter((p): p is readonly Coefficient[] => p !== undefined);

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string, v: PlaneView = view): Figure => ({
  svg: plane(v, marks),
  alt: t(en, zh),
});

/** lineMark draws the line y = mx + b. */
const lineMark = (m: Q, b: Coefficient, accent = true, dashed = false): PlaneMark => ({
  kind: "line",
  a: [0, toQ(b).toNumber()],
  b: [1, toQ(b).add(m).toNumber()],
  accent,
  dashed,
});

/** plainLine writes y = mx + b for alt text. */
const plainLine = (m: Q, b: Coefficient) => `y = ${linear(m, b).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2")}`;

/** evalAt writes m · x + b for substituting x into y = mx + b, leaving out a zero b. */
function evalAt(m: Coefficient, x: Coefficient, b: Coefficient): string {
  const B = toQ(b);
  const M = toQ(m);
  const head = M.eq(Q.of(1)) ? paren(x) : M.eq(Q.of(-1)) ? `-${paren(x)}` : `${num(m)} \\cdot ${paren(x)}`;
  return B.isZero() ? head : `${head} ${B.sign() < 0 ? "-" : "+"} ${num(B.abs())}`;
}

/** Lin is a linear equation ax + by = c with integer coefficients. */
type Lin = readonly [number, number, number];

const varNames = ["x", "y"] as const;

/** eqOf writes ax + by = c. */
const eqOf = ([a, b, c]: Lin) => std(a, b, c);

/** linSolution is the solution of a system of two equations with integer coefficients. */
const linSolution = (e1: Lin, e2: Lin) => solve2(e1[0], e1[1], e1[2], e2[0], e2[1], e2[2]);

/** scaleFactors are the positive factors that make the coefficients of the eliminated variable opposite or equal. */
function scaleFactors(e1: Lin, e2: Lin, elim: 0 | 1): [number, number] {
  const g = gcd(e1[elim], e2[elim]);
  return [Math.abs(e2[elim]) / g, Math.abs(e1[elim]) / g];
}

/** forgotConstants solves the system after multiplying the variable terms but not the constants, a typical mistake. */
function forgotConstants(e1: Lin, e2: Lin, elim: 0 | 1): [Q, Q] | undefined {
  const [f1, f2] = scaleFactors(e1, e2, elim);
  return solve2(e1[0] * f1, e1[1] * f1, e1[2], e2[0] * f2, e2[1] * f2, e2[2]);
}

/** checkEq substitutes a pair into ax + by = c and works out the left side. */
function checkEq([a, b, c]: Lin, [x, y]: readonly Q[]): string {
  const term = (k: number, v: Q) => (k === 1 ? paren(v) : k === -1 ? `-${paren(v)}` : `${num(k)} \\cdot ${paren(v)}`);
  const [t1, t2] = [Q.of(a).mul(x!), Q.of(b).mul(y!)];
  const second = b < 0 ? `- ${term(-b, y!)}` : `+ ${term(b, y!)}`;
  return `${term(a, x!)} ${second} = ${num(t1)} ${t2.sign() < 0 ? "-" : "+"} ${num(t2.abs())} = ${num(c)}`;
}

/** eliminationSolution explains how to solve a system with integer coefficients by eliminating one variable. */
function eliminationSolution(e1: Lin, e2: Lin, elim: 0 | 1): Text {
  const keep = (1 - elim) as 0 | 1;
  const [f1, f2] = scaleFactors(e1, e2, elim);
  const add = Math.sign(e1[elim]) !== Math.sign(e2[elim]);
  const s1 = e1.map((v) => v * f1) as unknown as Lin;
  const s2 = e2.map((v) => v * f2) as unknown as Lin;
  const k = add ? s1[keep] + s2[keep] : s1[keep] - s2[keep];
  const r = add ? s1[2] + s2[2] : s1[2] - s2[2];
  const K = Q.of(r, k);
  const rest = Q.of(e1[2]).sub(Q.of(e1[keep]).mul(K));
  const E = rest.div(Q.of(e1[elim]));
  const [ev, kv] = [varNames[elim], varNames[keep]];
  const sol = elim === 0 ? [E, K] : [K, E];
  const goal = add ? ["opposite", "互为相反数"] : ["equal", "相等"];
  const reason = t(
    `, so that the coefficients of $${ev}$ become ${goal[0]}, $${s1[elim]}$ and $${s2[elim]}$. Multiply every term, the constant included:`,
    `，使 $${ev}$ 的系数${goal[1]}，成为 $${s1[elim]}$ 和 $${s2[elim]}$。每一项都要乘，包括常数：`,
  );
  const mul =
    f1 !== 1 && f2 !== 1
      ? t(
          `**Match the coefficients.** Multiply the first equation by $${f1}$ and the second by $${f2}$${reason.en} ${steps(eqOf(s1), eqOf(s2))}`,
          `**使系数匹配。** 第一个方程乘以 $${f1}$，第二个方程乘以 $${f2}$${reason["zh-CN"]}${steps(eqOf(s1), eqOf(s2))}`,
        )
      : f1 !== 1
        ? t(
            `**Match the coefficients.** Multiply the first equation by $${f1}$${reason.en} ${steps(eqOf(s1))}`,
            `**使系数匹配。** 第一个方程乘以 $${f1}$${reason["zh-CN"]}${steps(eqOf(s1))}`,
          )
        : f2 !== 1
          ? t(
              `**Match the coefficients.** Multiply the second equation by $${f2}$${reason.en} ${steps(eqOf(s2))}`,
              `**使系数匹配。** 第二个方程乘以 $${f2}$${reason["zh-CN"]}${steps(eqOf(s2))}`,
            )
          : t("", "");
  const elimSteps = steps(...new Set([`${poly([k, kv])} = ${num(r)}`, `${kv} = ${num(K)}`]));
  const backSteps = steps(
    ...(K.isZero() ? [] : [`${poly([e1[elim], ev], [Q.of(e1[keep]).mul(K), ""])} = ${num(e1[2])}`]),
    ...new Set([`${poly([e1[elim], ev])} = ${num(rest)}`, `${ev} = ${num(E)}`]),
  );
  const check = checkEq(e2, sol);
  return t(
    `${mul.en}**Eliminate $${ev}$.** The coefficients of $${ev}$ are $${s1[elim]}$ and $${s2[elim]}$, so ${add ? "adding the equations side by side cancels them" : "subtracting the second equation from the first, every term and the constants too, cancels them"}: ${elimSteps}**Substitute back.** Put $${kv} = ${num(K)}$ into the first equation and solve for $${ev}$: ${backSteps}The solution is $${pointLatex(sol)}$.

**Check.** The first equation was used to find $${ev}$, so test the second: $${check}$.`,
    `${mul["zh-CN"]}**消去 $${ev}$。** $${ev}$ 的系数是 $${s1[elim]}$ 和 $${s2[elim]}$，所以${add ? "两个方程左右分别相加，就把它消去了" : "用第一个方程减去第二个方程，每一项连同常数都相减，就把它消去了"}：${elimSteps}**回代。** 把 $${kv} = ${num(K)}$ 代入第一个方程，解出 $${ev}$：${backSteps}方程组的解是 $${pointLatex(sol)}$。

**检验。** 求 $${ev}$ 时用了第一个方程，所以代入第二个方程检验：$${check}$。`,
  );
}

/** randomSystem draws a system with integer coefficients from −max to max (nonzero) and an integer solution. */
function randomSystem(rng: Rng, max = 6): { e1: Lin; e2: Lin; sol: [number, number] } {
  let a1: number;
  let b1: number;
  let a2: number;
  let b2: number;
  do {
    [a1, b1, a2, b2] = [rng.nonZero(-max, max), rng.nonZero(-max, max), rng.nonZero(-max, max), rng.nonZero(-max, max)];
  } while (a1 * b2 - a2 * b1 === 0);
  const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
  return {
    e1: [a1, b1, a1 * x + b1 * y],
    e2: [a2, b2, a2 * x + b2 * y],
    sol: [x, y],
  };
}

// ─── The coordinate plane ─────────────────────────────────────────────────────

const quadrantOptions: readonly Text[] = [
  t("Quadrant I", "第一象限"),
  t("Quadrant II", "第二象限"),
  t("Quadrant III", "第三象限"),
  t("Quadrant IV", "第四象限"),
  t("On an axis", "在坐标轴上"),
];

/** sideCheck writes the check of a point's coordinates by the side of each axis the point lies on. */
function sideCheck(x: number, y: number): Text {
  const xs =
    x > 0
      ? ["to the right of the $y$-axis, so its $x$-coordinate must be positive", "在 $y$ 轴右侧，所以 $x$ 坐标应为正数"]
      : x < 0
        ? ["to the left of the $y$-axis, so its $x$-coordinate must be negative", "在 $y$ 轴左侧，所以 $x$ 坐标应为负数"]
        : ["on the $y$-axis, so its $x$-coordinate must be $0$", "在 $y$ 轴上，所以 $x$ 坐标应为 $0$"];
  const ys =
    y > 0
      ? ["above the $x$-axis, so its $y$-coordinate must be positive", "在 $x$ 轴上方，所以 $y$ 坐标应为正数"]
      : y < 0
        ? ["below the $x$-axis, so its $y$-coordinate must be negative", "在 $x$ 轴下方，所以 $y$ 坐标应为负数"]
        : ["on the $x$-axis, so its $y$-coordinate must be $0$", "在 $x$ 轴上，所以 $y$ 坐标应为 $0$"];
  return t(
    `**Check.** The point lies ${xs[0]}, and ${ys[0]}. The pair $${pointLatex([x, y])}$ agrees on both counts.`,
    `**检验。** 这个点${xs[1]}；${ys[1]}。数对 $${pointLatex([x, y])}$ 两点都符合。`,
  );
}

/** moves describes the horizontal and the vertical move from the origin to (x, y) as two separate steps. */
function moves(x: number, y: number): [Text, Text] {
  return [
    x === 0
      ? t("The $x$-coordinate is $0$: do not move left or right, stay on the $y$-axis.", "$x$ 坐标是 $0$：不左右移动，留在 $y$ 轴上。")
      : x > 0
        ? t(
            `The $x$-coordinate is $${x}$, positive: move $${x}$ to the right along the $x$-axis.`,
            `$x$ 坐标是 $${x}$，是正数：沿 $x$ 轴向右移动 $${x}$。`,
          )
        : t(
            `The $x$-coordinate is $${x}$, negative: move $${-x}$ to the left along the $x$-axis.`,
            `$x$ 坐标是 $${x}$，是负数：沿 $x$ 轴向左移动 $${-x}$。`,
          ),
    y === 0
      ? t("The $y$-coordinate is $0$: do not move up or down.", "$y$ 坐标是 $0$：不上下移动。")
      : y > 0
        ? t(`The $y$-coordinate is $${y}$, positive: from there, move $${y}$ up.`, `$y$ 坐标是 $${y}$，是正数：从那里向上移动 $${y}$。`)
        : t(
            `The $y$-coordinate is $${y}$, negative: from there, move $${-y}$ down.`,
            `$y$ 坐标是 $${y}$，是负数：从那里向下移动 $${-y}$。`,
          ),
  ];
}

export const theCoordinatePlane: TopicDef = {
  id: "the-coordinate-plane",
  title: t("The Coordinate Plane", "平面直角坐标系"),
  summary: t(
    "Name and locate points by their coordinates, and tell the quadrant of a point.",
    "用坐标表示和确定点的位置，判断点所在的象限。",
  ),
  prerequisites: ["integers-and-opposites"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.5.G.A.1", "CCSS.6.NS.C.6", "CCSS.6.NS.C.8"],
  intro: t(
    `A number line gives every number a place: positive numbers to the right of $0$, negative numbers to the left. One number line can only describe positions along a line, though. To describe a position on a flat surface, like a square on a map, we need two numbers: how far across and how far up.

So we take **two number lines** and cross them at their zeros, one horizontal and one vertical. The horizontal one is the **$x$-axis**, the vertical one the **$y$-axis**, and the point where they cross is the **origin**. Now every point of the plane has an address, a pair of numbers $(x, y)$: start at the origin, move $x$ along the $x$-axis, then $y$ up or down.

For example, the point $P = (3, -2)$ is reached by moving $3$ to the right and then $2$ down:

{{figure 0}}

In this lesson we read the coordinates of a point from a grid, find the point with given coordinates, and see how the signs of the coordinates tell which part of the plane a point is in.`,
    `数轴给每个数一个位置：正数在 $0$ 的右边，负数在左边。但一条数轴只能描述一条直线上的位置。要描述一个平面上的位置，比如地图上的一个格子，需要两个数：横着走多远，竖着走多远。

所以我们取**两条数轴**，让它们在零点处相交，一条水平，一条竖直。水平的叫 **$x$ 轴**，竖直的叫 **$y$ 轴**，交点叫**原点**。这样平面上每个点都有了一个“地址”，即一对数 $(x, y)$：从原点出发，沿 $x$ 轴移动 $x$，再向上或向下移动 $y$。

例如，点 $P = (3, -2)$：先向右移动 $3$，再向下移动 $2$：

{{figure 0}}

这节课我们从网格上读出点的坐标，找出给定坐标的点，并看看坐标的正负如何告诉我们点在平面的哪一部分。`,
  ),
  introFigures: [
    graph(
      walkTo([3, -2], "P"),
      "From the origin, 3 to the right along the x-axis and then 2 down reaches P = (3, −2).",
      "从原点出发，沿 x 轴向右 3，再向下 2，到达 P = (3, −2)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "reading-coordinates",
      figure: algebraDrawings["the-coordinate-plane#reading-coordinates"],
      title: t("Reading coordinates", "读出点的坐标"),
      explanation: t(
        `The **coordinate plane** is formed by two perpendicular number lines: the horizontal **$x$-axis** and the vertical **$y$-axis**, which cross at the **origin** $(0, 0)$.

Every point has an **ordered pair** of coordinates $(x, y)$. To read them, retrace the walk from the origin to the point:

1. Go straight across to the point's column and read the $x$-axis there: right of the origin is positive, left is negative. That is $x$.
2. Then go up or down to the point: up is positive, down is negative. That is $y$.

For example, a point $3$ columns left of the $y$-axis and $2$ rows above the $x$-axis is $(-3, 2)$. A point on the $y$-axis has made no move across, so its $x$-coordinate is $0$, as in $(0, -4)$.

> **Watch out.** The $x$-coordinate, the move across, always comes first. $(2, -3)$ and $(-3, 2)$ are different points. And a move left or down gives a **negative** coordinate: do not drop the minus sign.`,
        `**平面直角坐标系**由两条互相垂直的数轴组成：水平的 **$x$ 轴**和竖直的 **$y$ 轴**，它们相交于**原点** $(0, 0)$。

每个点都有一个**有序数对**作为坐标 $(x, y)$。读坐标时，就把从原点走到这个点的路线重走一遍：

1. 先横着走到点所在的那一列，读出 $x$ 轴上的数：原点右边为正，左边为负。这就是 $x$。
2. 再向上或向下走到这个点：向上为正，向下为负。这就是 $y$。

例如，一个点在 $y$ 轴左边 $3$ 列、$x$ 轴上方 $2$ 行，它就是 $(-3, 2)$。$y$ 轴上的点不需要横着走，所以 $x$ 坐标是 $0$，例如 $(0, -4)$。

> **注意。** 横着走的 $x$ 坐标总是写在前面。$(2, -3)$ 和 $(-3, 2)$ 是两个不同的点。向左或向下走得到的是**负**坐标，不要漏掉负号。`,
      ),
      keyPrerequisites: ["integers-and-opposites"],
      generate(rng) {
        const x = rng.int(-5, 5);
        const y = x === 0 ? rng.nonZero(-5, 5) : rng.int(-5, 5);
        const name = rng.pick(["P", "A", "B", "Q"]);
        const check = sideCheck(x, y);
        return annotate(
          {
            ...pointProblem({
              prompt: t(`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`),
              answer: [x, y],
              wrong: [
                [y, x],
                [-x, y],
                [x, -y],
              ],
              solution: t(
                `Retrace the walk from the origin to $${name}$, across first and then up or down.

**Across.** ${x === 0 ? `$${name}$ is on the $y$-axis, so there is no move across: $x = 0$.` : `$${name}$ is ${Math.abs(x)} ${Math.abs(x) === 1 ? "unit" : "units"} ${x > 0 ? "right" : "left"} of the $y$-axis, so $x = ${x}$.`}

**Up or down.** ${y === 0 ? `$${name}$ is on the $x$-axis, so there is no move up or down: $y = 0$.` : `$${name}$ is ${Math.abs(y)} ${Math.abs(y) === 1 ? "unit" : "units"} ${y > 0 ? "above" : "below"} the $x$-axis, so $y = ${y}$.`}

So $${name} = ${pointLatex([x, y])}$, with the $x$-coordinate first.

${check.en}`,
                `把从原点走到 $${name}$ 的路线重走一遍：先横着走，再上下走。

**横向。** ${x === 0 ? `$${name}$ 在 $y$ 轴上，不需要横着走：$x = 0$。` : `$${name}$ 在 $y$ 轴${x > 0 ? "右" : "左"}边 ${Math.abs(x)} 个单位，所以 $x = ${x}$。`}

**纵向。** ${y === 0 ? `$${name}$ 在 $x$ 轴上，不需要上下走：$y = 0$。` : `$${name}$ 在 $x$ 轴${y > 0 ? "上方" : "下方"} ${Math.abs(y)} 个单位，所以 $y = ${y}$。`}

所以 $${name} = ${pointLatex([x, y])}$，$x$ 坐标写在前面。

${check["zh-CN"]}`,
              ),
            }),
            figure: graph(
              [{ kind: "point", at: [x, y], label: name, accent: true }],
              `A point ${name} on a coordinate grid.`,
              `坐标网格上的一个点 ${name}。`,
            ),
          },
          view,
          walkTo([x, y], name),
          `From the origin, move ${x} along the x-axis and ${y} along the y-axis: ${name} is ${at([x, y])}.`,
          `从原点出发，水平走 ${x}，竖直走 ${y}：${name} 是 ${at([x, y])}。`,
        );
      },
    },
    {
      id: "locating-points",
      figure: algebraDrawings["the-coordinate-plane#locating-points"],
      title: t("Locating a point", "找到给定坐标的点"),
      explanation: t(
        `To locate the point $(x, y)$, read the pair as directions from the origin:

1. Move $x$ units along the $x$-axis: right if $x$ is positive, left if it is negative.
2. From there, move $y$ units parallel to the $y$-axis: up if $y$ is positive, down if it is negative.

For $(2, -5)$: move $2$ to the right, then $5$ down. The point is below the $x$-axis and to the right of the $y$-axis.

> **Watch out.** Order matters: $(2, -5)$ is $2$ right and $5$ down, while $(-5, 2)$ is $5$ left and $2$ up. Always make the first move across, using the first number, and the second move up or down, using the second.`,
        `要找到点 $(x, y)$，就把这个数对当作从原点出发的路线：

1. 沿 $x$ 轴方向移动 $x$ 个单位：$x$ 为正向右，为负向左。
2. 再从那里沿 $y$ 轴方向移动 $y$ 个单位：$y$ 为正向上，为负向下。

对 $(2, -5)$：向右移动 $2$，再向下移动 $5$。这个点在 $x$ 轴下方、$y$ 轴右侧。

> **注意。** 顺序很重要：$(2, -5)$ 是向右 $2$、向下 $5$，而 $(-5, 2)$ 是向左 $5$、向上 $2$。第一步总是用第一个数横着走，第二步用第二个数上下走。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        } while (Math.abs(a) === Math.abs(b));
        const others = rng.sample<readonly [number, number]>(
          [
            [b, a],
            [-a, b],
            [a, -b],
            [-b, -a],
          ],
          3,
        );
        const points = rng.shuffle<readonly [number, number]>([[a, b], ...others]);
        const correct = points.findIndex(([x, y]) => x === a && y === b);
        const names = ["A", "B", "C", "D"];
        const [mx, my] = moves(a, b);
        const check = sideCheck(a, b);
        return annotate(
          {
            ...choiceProblem({
              prompt: t(`Which point is at $${pointLatex([a, b])}$?`, `哪个点的坐标是 $${pointLatex([a, b])}$？`),
              options: names.map((n) => same(n)),
              correct,
              solution: t(
                `Start at the origin and follow the pair $${pointLatex([a, b])}$.

**Step 1.** ${mx.en}

**Step 2.** ${my.en}

The walk ends at point $${names[correct]}$.

${check.en}`,
                `从原点出发，按数对 $${pointLatex([a, b])}$ 走。

**第一步。** ${mx["zh-CN"]}

**第二步。** ${my["zh-CN"]}

走到的是点 $${names[correct]}$。

${check["zh-CN"]}`,
              ),
            }),
            figure: graph(
              points.map(([x, y], i) => ({ kind: "point", at: [x, y], label: names[i]!, accent: true })),
              "Four points A, B, C and D on a coordinate grid.",
              "坐标网格上的四个点 A、B、C、D。",
            ),
          },
          view,
          walkTo([a, b], names[correct]),
          `The point ${at([a, b])} is ${names[correct]}.`,
          `点 ${at([a, b])} 是 ${names[correct]}。`,
        );
      },
    },
    {
      id: "quadrants",
      title: t("Quadrants", "象限"),
      explanation: t(
        `The axes divide the plane into four **quadrants**, numbered counterclockwise from the upper right:

- Quadrant I: $x > 0$, $y > 0$
- Quadrant II: $x < 0$, $y > 0$
- Quadrant III: $x < 0$, $y < 0$
- Quadrant IV: $x > 0$, $y < 0$

Why the signs decide it: the sign of $x$ says whether the point is right or left of the $y$-axis, and the sign of $y$ whether it is above or below the $x$-axis. Those two answers pick one of the four regions. For $(-7, 3)$, $x$ is negative (left) and $y$ is positive (up), so the point is in the upper left, Quadrant II.

A point with a coordinate equal to $0$ lies on an axis and is in no quadrant.

> **Watch out.** The quadrants go **counterclockwise**: Quadrant II is the upper left, not the lower right. And a point such as $(0, 5)$ is not in Quadrant I: it sits on the $y$-axis, between quadrants.`,
        `两条坐标轴把平面分成四个**象限**，从右上方开始按逆时针方向编号：

- 第一象限：$x > 0$，$y > 0$
- 第二象限：$x < 0$，$y > 0$
- 第三象限：$x < 0$，$y < 0$
- 第四象限：$x > 0$，$y < 0$

为什么由正负号决定：$x$ 的正负说明点在 $y$ 轴的右边还是左边，$y$ 的正负说明点在 $x$ 轴的上方还是下方，这两个答案就确定了四个区域中的一个。对 $(-7, 3)$，$x$ 为负（左），$y$ 为正（上），所以点在左上方，即第二象限。

有一个坐标为 $0$ 的点在坐标轴上，不属于任何象限。

> **注意。** 象限是按**逆时针**编号的：第二象限在左上方，不在右下方。像 $(0, 5)$ 这样的点不在第一象限，它在 $y$ 轴上，位于象限之间。`,
      ),
      generate(rng) {
        const onAxis = rng.bool(0.15);
        let x = rng.nonZero(-15, 15);
        let y = rng.nonZero(-15, 15);
        if (onAxis) {
          if (rng.bool()) x = 0;
          else y = 0;
        }
        const correct = onAxis ? 4 : x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2;
        const sign = (v: number) => (v > 0 ? t("positive", "正数") : t("negative", "负数"));
        const corner = [t("upper right", "右上方"), t("upper left", "左上方"), t("lower left", "左下方"), t("lower right", "右下方")];
        const solution = onAxis
          ? t(
              `Its ${x === 0 ? "$x$" : "$y$"}-coordinate is $0$, so the point lies on the ${x === 0 ? "$y$" : "$x$"}-axis.

A point on an axis is on the border between two quadrants and belongs to neither, so the answer is "on an axis".

**Check.** From the origin, the walk to $${pointLatex([x, y])}$ ${x === 0 ? "never moves across, so it stays on the vertical axis" : "never moves up or down, so it stays on the horizontal axis"}.`,
              `它的 ${x === 0 ? "$x$" : "$y$"} 坐标是 $0$，所以这个点在 ${x === 0 ? "$y$" : "$x$"} 轴上。

坐标轴上的点位于两个象限的分界线上，不属于任何象限，所以答案是“在坐标轴上”。

**检验。** 从原点走到 $${pointLatex([x, y])}$ 时，${x === 0 ? "完全不横着走，所以一直在竖直的坐标轴上" : "完全不上下走，所以一直在水平的坐标轴上"}。`,
            )
          : t(
              `Its $x$-coordinate is ${sign(x).en}, so the point is ${x > 0 ? "right" : "left"} of the $y$-axis. Its $y$-coordinate is ${sign(y).en}, so it is ${y > 0 ? "above" : "below"} the $x$-axis.

${x > 0 ? "Right" : "Left"} and ${y > 0 ? "up" : "down"} is the ${corner[correct]!.en} region, which is ${quadrantOptions[correct]!.en}.

**Check.** Counting counterclockwise from the upper right, I, II, III, IV, the ${corner[correct]!.en} region is number ${["I", "II", "III", "IV"][correct]}, whose points have $x ${x > 0 ? ">" : "<"} 0$ and $y ${y > 0 ? ">" : "<"} 0$, as $${pointLatex([x, y])}$ does.`,
              `它的 $x$ 坐标是${sign(x)["zh-CN"]}，所以点在 $y$ 轴${x > 0 ? "右" : "左"}边；$y$ 坐标是${sign(y)["zh-CN"]}，所以点在 $x$ 轴${y > 0 ? "上方" : "下方"}。

${x > 0 ? "右" : "左"}边且${y > 0 ? "上方" : "下方"}，就是${corner[correct]!["zh-CN"]}的区域，即${quadrantOptions[correct]!["zh-CN"]}。

**检验。** 从右上方开始逆时针数一、二、三、四，${corner[correct]!["zh-CN"]}是第${["一", "二", "三", "四"][correct]}个区域，那里的点满足 $x ${x > 0 ? ">" : "<"} 0$，$y ${y > 0 ? ">" : "<"} 0$，$${pointLatex([x, y])}$ 正是如此。`,
            );
        return choiceProblem({
          prompt: t(`Where does the point $${pointLatex([x, y])}$ lie?`, `点 $${pointLatex([x, y])}$ 在哪里？`),
          options: quadrantOptions,
          correct,
          solution,
        });
      },
    },
  ],
};

// ─── Slope ──────────────────────────────────────────────────────────────────

/** undo writes the step that moves a subtracted number v back across an equation, after a comma: add v, or subtract −v, or nothing for 0. */
function undo(v: number): Text {
  if (v === 0) return t("", "");
  return v > 0
    ? t(`, then add $${v}$ to both sides`, `，再两边同加 $${v}$`)
    : t(`, then subtract $${-v}$ from both sides`, `，再两边同减 $${-v}$`);
}

const slopeKinds: readonly Text[] = [t("Positive", "正数"), t("Negative", "负数"), t("Zero", "零"), t("Undefined", "不存在")];

export const slopeOfALine: TopicDef = {
  id: "slope-of-a-line",
  title: t("Calculating Slopes of Straight Lines", "计算直线的斜率"),
  summary: t("Find the slope of a line from its graph or from two of its points.", "由图像或直线上的两点求直线的斜率。"),
  prerequisites: ["the-coordinate-plane", "operations-with-rational-numbers"],
  encompasses: [
    { topic: "the-coordinate-plane", weight: 0.3 },
    { topic: "subtracting-integers", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.B.6", "CCSS.8.F.B.4"],
  intro: t(
    `In the coordinate plane, a straight line can be gentle or steep, and it can climb or fall as we read it from left to right. To compare lines, we want one number that measures this tilt.

Walk along a line from one of its points to another. The walk has two parts: the **run**, how far we move across, and the **rise**, how far we move up (a move down is a negative rise). A steep line rises a lot for each step across; a gentle one rises little. So the tilt is measured by the ratio

$$\\text{slope} = \\frac{\\text{rise}}{\\text{run}}.$$

The ratio does not depend on which two points we pick. On the line below, from $(-2, -3)$ to $(0, -2)$ the run is $2$ and the rise is $1$; from $(0, -2)$ to $(4, 0)$ the run is $4$ and the rise is $2$. Both give $\\frac{1}{2}$:

{{figure 0}}

The two triangles have the same shape, one is just larger, so a straight line has a single slope. In this lesson we read slopes from graphs, compute them from coordinates, meet the lines whose slope is $0$ or undefined, and use a known slope to find a missing coordinate.`,
    `在坐标平面上，直线可能平缓，也可能陡峭；从左往右看，它可能上升，也可能下降。为了比较直线，我们需要用一个数来衡量这种倾斜。

沿着直线从一点走到另一点。这段路分两部分：**横向变化**，即横着走了多远；**纵向变化**，即向上走了多远（向下走就是负的纵向变化）。陡的直线每横走一步就升高很多，平缓的直线只升高一点。所以倾斜程度用比值来衡量：

$$\\text{斜率} = \\frac{\\text{纵向变化}}{\\text{横向变化}}.$$

这个比值与选哪两个点无关。在下面的直线上，从 $(-2, -3)$ 到 $(0, -2)$，横向变化 $2$，纵向变化 $1$；从 $(0, -2)$ 到 $(4, 0)$，横向变化 $4$，纵向变化 $2$。两者都得 $\\frac{1}{2}$：

{{figure 0}}

两个三角形形状相同，只是一个更大，所以一条直线只有一个斜率。这节课我们从图像读出斜率，由坐标计算斜率，认识斜率为 $0$ 或不存在的直线，并用已知斜率求未知坐标。`,
  ),
  introFigures: [
    graph(
      [
        { kind: "line", a: [-2, -3], b: [4, 0], accent: true },
        ...riseRun([-2, -3], [0, -2]),
        ...riseRun([0, -2], [4, 0]),
        { kind: "point", at: [-2, -3] },
        { kind: "point", at: [0, -2] },
        { kind: "point", at: [4, 0] },
      ],
      "A line through (−2, −3), (0, −2) and (4, 0). The first step has a run of 2 and a rise of 1, the second a run of 4 and a rise of 2: both ratios are 1/2.",
      "经过 (−2, −3)、(0, −2) 和 (4, 0) 的直线。第一段横向变化 2、纵向变化 1，第二段横向变化 4、纵向变化 2：两个比值都是 1/2。",
    ),
  ],
  knowledgePoints: [
    {
      id: "slope-from-a-graph",
      title: t("Rise over run", "纵向变化比横向变化"),
      explanation: t(
        `The **slope** $m$ of a line measures its steepness. Between two points of the line, the **run** is the horizontal change and the **rise** is the vertical change:

$$m = \\frac{\\text{rise}}{\\text{run}}.$$

To read it from a graph, pick two points where the line crosses grid corners exactly, and walk from the left one to the right one: count the squares across (the run, positive since we move right), then the squares up or down (the rise, positive up and negative down).

For a line from $(1, 4)$ to $(4, -2)$: the walk goes $3$ across and $6$ down, so the run is $3$, the rise is $-6$, and

$$m = \\frac{-6}{3} = -2.$$

The sign agrees with the picture: a line that goes up from left to right has positive slope, one that goes down has negative slope.

> **Watch out.** Slope is rise **over** run: the vertical count goes on top. Writing $\\frac{3}{-6}$ gives $-\\frac{1}{2}$, a much gentler line. And a drop is a negative rise: if the line falls from left to right, the slope must come out negative.`,
        `**斜率** $m$ 衡量直线的倾斜程度。在直线上的两点之间，**横向变化**是水平方向的变化，**纵向变化**是竖直方向的变化：

$$m = \\frac{\\text{纵向变化}}{\\text{横向变化}}.$$

从图像上读斜率时，选直线恰好经过格点的两个点，从左边的点走到右边的点：先数横着走了几格（横向变化，向右走所以为正），再数向上或向下走了几格（纵向变化，向上为正，向下为负）。

若直线从 $(1, 4)$ 到 $(4, -2)$：横着走 $3$ 格，向下走 $6$ 格，所以横向变化是 $3$，纵向变化是 $-6$，

$$m = \\frac{-6}{3} = -2.$$

符号与图像一致：从左向右上升的直线斜率为正，下降的直线斜率为负。

> **注意。** 斜率是纵向变化**除以**横向变化，竖直方向的格数在分子上。写成 $\\frac{3}{-6}$ 得到 $-\\frac{1}{2}$，那是平缓得多的直线。向下走是负的纵向变化：直线从左向右下降时，斜率一定是负数。`,
      ),
      generate(rng) {
        const run = rng.int(1, 6);
        const x1 = rng.int(-5, 5 - run);
        const rise = rng.nonZero(-6, 6);
        const y1 = rng.int(Math.max(-5, -5 - rise), Math.min(5, 5 - rise));
        const m = Q.of(rise, run);
        const [A, B]: [readonly [number, number], readonly [number, number]] = [
          [x1, y1],
          [x1 + run, y1 + rise],
        ];
        return annotate(
          {
            ...numberProblem({
              prompt: t("Find the slope of the line through the points $A$ and $B$.", "求过点 $A$ 和 $B$ 的直线的斜率。"),
              answer: m,
              mistakes: [
                why(
                  Q.of(run, rise),
                  "That is the run divided by the rise. Slope is the rise divided by the run.",
                  "这是横向变化除以纵向变化。斜率是纵向变化除以横向变化。",
                ),
                why(
                  m.neg(),
                  "The size is right, but check the direction: a line that rises from left to right has a positive slope, and one that falls has a negative slope.",
                  "大小对了，但要看方向：从左到右上升的直线斜率为正，下降的直线斜率为负。",
                ),
                ...(run !== 1
                  ? [
                      why(
                        rise,
                        "That is only the rise. Divide it by the run to get the slope.",
                        "这只是纵向变化，还要除以横向变化才是斜率。",
                      ),
                    ]
                  : []),
              ],
              solution: t(
                `**Step 1: run and rise.** Walk along the line from $A$ to $B$. The walk goes $${run}$ to the right, so the run is $${run}$, and $${Math.abs(rise)}$ ${rise > 0 ? "up" : "down"}, so the rise is $${rise}$.

**Step 2: divide.** ${steps(`m = \\frac{\\text{rise}}{\\text{run}} = \\frac{${rise}}{${run}}${m.eq(Q.of(rise)) || (m.n === BigInt(rise) && m.d === BigInt(run)) ? "" : ` = ${num(m)}`}`)}The line ${rise > 0 ? "rises" : "falls"} from left to right, and the slope is ${rise > 0 ? "positive" : "negative"}, as it should be.

**Check.** From $A = ${pointLatex(A)}$, a run of $${run}$ and a rise of $${rise}$ land on $${pointLatex(B)}$, which is $B$.`,
                `**第一步：横向变化和纵向变化。** 沿直线从 $A$ 走到 $B$：向右走 $${run}$，所以横向变化是 $${run}$；向${rise > 0 ? "上" : "下"}走 $${Math.abs(rise)}$，所以纵向变化是 $${rise}$。

**第二步：相除。** ${steps(`m = \\frac{\\text{纵向变化}}{\\text{横向变化}} = \\frac{${rise}}{${run}}${m.eq(Q.of(rise)) || (m.n === BigInt(rise) && m.d === BigInt(run)) ? "" : ` = ${num(m)}`}`)}直线从左向右${rise > 0 ? "上升" : "下降"}，斜率为${rise > 0 ? "正" : "负"}，与图像一致。

**检验。** 从 $A = ${pointLatex(A)}$ 出发，横向变化 $${run}$、纵向变化 $${rise}$，到达 $${pointLatex(B)}$，正是 $B$。`,
              ),
            }),
            figure: graph(
              [
                { kind: "line", a: A, b: B, accent: true },
                { kind: "point", at: A, label: "A", dir: "nw" },
                { kind: "point", at: B, label: "B", dir: "se" },
              ],
              "A line through two grid points A and B.",
              "一条经过网格点 A 和 B 的直线。",
            ),
          },
          view,
          riseRun(A, B),
          `From A to B the run is ${run} and the rise is ${rise}, so the slope is ${plain(m)}.`,
          `从 A 到 B，水平变化 ${run}，竖直变化 ${rise}，所以斜率是 ${plain(m)}。`,
        );
      },
    },
    {
      id: "slope-formula",
      title: t("The slope formula", "斜率公式"),
      explanation: t(
        `Counting squares works only on a graph. With coordinates, the rise and the run are differences: going from $(x_1, y_1)$ to $(x_2, y_2)$, the $y$-coordinate changes by $y_2 - y_1$ and the $x$-coordinate by $x_2 - x_1$. So for $x_1 \\ne x_2$,

$$m = \\frac{y_2 - y_1}{x_2 - x_1}.$$

Through $(-2, 5)$ and $(4, 1)$, take $(-2, 5)$ as the first point:

$$m = \\frac{1 - 5}{4 - (-2)} = \\frac{-4}{6} = -\\frac{2}{3}.$$

Taking the points the other way round gives $\\frac{5 - 1}{-2 - 4} = \\frac{4}{-6}$, the same slope: both differences change sign, so their ratio does not.

> **Watch out.** Subtract in the **same order** on top and bottom: $\\frac{1 - 5}{-2 - 4}$ mixes the orders and gives $+\\frac{2}{3}$, the wrong sign. Keep the $y$-differences on top, and subtract the coordinates, never add them. Subtracting a negative, as in $4 - (-2)$, is adding: $6$.`,
        `数格子只能在图像上用。有了坐标，纵向变化和横向变化就是差：从 $(x_1, y_1)$ 到 $(x_2, y_2)$，$y$ 坐标变化 $y_2 - y_1$，$x$ 坐标变化 $x_2 - x_1$。所以当 $x_1 \\ne x_2$ 时，

$$m = \\frac{y_2 - y_1}{x_2 - x_1}.$$

过 $(-2, 5)$ 和 $(4, 1)$，以 $(-2, 5)$ 为第一个点：

$$m = \\frac{1 - 5}{4 - (-2)} = \\frac{-4}{6} = -\\frac{2}{3}.$$

把两点顺序反过来，得 $\\frac{5 - 1}{-2 - 4} = \\frac{4}{-6}$，斜率相同：分子分母都变号，比值不变。

> **注意。** 分子和分母要按**相同的顺序**相减：$\\frac{1 - 5}{-2 - 4}$ 把顺序弄混了，得到 $+\\frac{2}{3}$，符号错了。$y$ 的差在分子上；坐标要相减，不能相加。减去负数，比如 $4 - (-2)$，就是加：得 $6$。`,
      ),
      keyPrerequisites: ["subtracting-integers"],
      generate(rng) {
        let x1: number;
        let x2: number;
        let y1: number;
        let y2: number;
        do {
          [x1, y1, x2, y2] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
        } while (x1 === x2 || y1 === y2);
        const m = Q.of(y2 - y1, x2 - x1);
        const work = `m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${num(m)}`;
        return {
          ...numberProblem({
            prompt: t(
              `Find the slope of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$.`,
              `求过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的斜率。`,
            ),
            answer: m,
            mistakes: [
              why(
                m.neg(),
                "The size is right but the sign is wrong. Subtract the coordinates in the same order on the top and on the bottom.",
                "大小对了，但符号错了。分子和分母要按相同的顺序相减。",
              ),
              why(
                Q.of(x2 - x1, y2 - y1),
                "That is the change in $x$ over the change in $y$. Slope is the change in $y$ over the change in $x$.",
                "这是 $x$ 的变化量除以 $y$ 的变化量。斜率是 $y$ 的变化量除以 $x$ 的变化量。",
              ),
              why(
                Q.of(y2 + y1, x2 - x1),
                "You added the $y$-coordinates. The top of the slope formula is their difference.",
                "你把两个纵坐标相加了。斜率公式的分子是它们的差。",
              ),
            ],
            solution: t(
              `**Step 1: the differences.** Take $${pointLatex([x1, y1])}$ as the first point. The rise is $${num(y2)} - ${paren(y1)} = ${y2 - y1}$ and the run is $${num(x2)} - ${paren(x1)} = ${x2 - x1}$, both subtracted in the same order.

**Step 2: divide and simplify.** ${steps(work)}**Check.** From $${pointLatex([x1, y1])}$, a run of $${x2 - x1}$ at slope $${num(m)}$ gives a rise of $${num(m)} \\cdot ${paren(x2 - x1)} = ${y2 - y1}$, and $${y1} + ${paren(y2 - y1)} = ${y2}$: we land on $${pointLatex([x2, y2])}$.`,
              `**第一步：求差。** 以 $${pointLatex([x1, y1])}$ 为第一个点。纵向变化 $${num(y2)} - ${paren(y1)} = ${y2 - y1}$，横向变化 $${num(x2)} - ${paren(x1)} = ${x2 - x1}$，两者按相同顺序相减。

**第二步：相除并化简。** ${steps(work)}**检验。** 从 $${pointLatex([x1, y1])}$ 出发，斜率为 $${num(m)}$，横向变化 $${x2 - x1}$ 对应纵向变化 $${num(m)} \\cdot ${paren(x2 - x1)} = ${y2 - y1}$，而 $${y1} + ${paren(y2 - y1)} = ${y2}$：正好到达 $${pointLatex([x2, y2])}$。`,
            ),
          }),
          solutionFigure: slopeFigure(
            [x1, y1],
            [x2, y2],
            `The run is ${x2 - x1} and the rise is ${y2 - y1}, so the slope is ${plain(m)}.`,
            `水平变化 ${x2 - x1}，竖直变化 ${y2 - y1}，所以斜率是 ${plain(m)}。`,
          ),
        };
      },
    },
    {
      id: "zero-and-undefined-slopes",
      title: t("Zero and undefined slopes", "斜率为零与斜率不存在"),
      explanation: t(
        `Two special lines have no tilt to measure in the usual way.

A **horizontal** line has rise $0$ between any two of its points, so its slope is $\\frac{0}{\\text{run}} = 0$: zero is a perfectly good number, and it says the line is flat.

A **vertical** line has run $0$, and division by $0$ is not defined: the slope of a vertical line is **undefined**. It is steeper than any slope, so no number measures it.

The coordinates tell which case it is. Through $(-2, 4)$ and $(5, 4)$ the $y$-coordinates agree, so the rise is $0$ and the line is horizontal, slope $0$. Through $(3, 1)$ and $(3, 7)$ the $x$-coordinates agree, so the run is $0$: the line is vertical, and $\\frac{6}{0}$ has no value.

> **Watch out.** Do not swap the two cases: equal $y$-coordinates mean slope $0$ (flat), equal $x$-coordinates mean undefined slope (straight up). $\\frac{0}{7} = 0$, but $\\frac{7}{0}$ is not $0$; it is not a number at all.`,
        `有两种特殊的直线，不能用通常的办法衡量倾斜。

**水平**直线上任意两点之间的纵向变化都是 $0$，所以斜率是 $\\frac{0}{\\text{横向变化}} = 0$：零是一个正常的数，它表示直线是平的。

**竖直**直线的横向变化为 $0$，而除以 $0$ 没有意义：竖直直线的斜率**不存在**。它比任何斜率都陡，没有数能衡量它。

看坐标就能判断属于哪种情况。过 $(-2, 4)$ 和 $(5, 4)$，两点的 $y$ 坐标相同，纵向变化为 $0$，直线是水平的，斜率为 $0$。过 $(3, 1)$ 和 $(3, 7)$，两点的 $x$ 坐标相同，横向变化为 $0$：直线是竖直的，$\\frac{6}{0}$ 没有值。

> **注意。** 不要把两种情况弄反：$y$ 坐标相同，斜率为 $0$（平的）；$x$ 坐标相同，斜率不存在（竖直的）。$\\frac{0}{7} = 0$，但 $\\frac{7}{0}$ 不是 $0$，它根本不是一个数。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const x1 = rng.int(-9, 9);
        const y1 = rng.int(-9, 9);
        const dx = kind === 3 ? 0 : rng.nonZero(-6, 6);
        const dy = kind === 2 ? 0 : kind === 3 ? rng.nonZero(-6, 6) : rng.int(1, 6) * (kind === 0 ? 1 : -1) * Math.sign(dx);
        const [p, q] = [pointLatex([x1, y1]), pointLatex([x1 + dx, y1 + dy])];
        const reason = [
          t(
            `The rise $${dy}$ and the run $${dx}$ have the same sign, so the slope is positive.`,
            `纵向变化 $${dy}$ 与横向变化 $${dx}$ 同号，所以斜率为正。`,
          ),
          t(
            `The rise $${dy}$ and the run $${dx}$ have opposite signs, so the slope is negative.`,
            `纵向变化 $${dy}$ 与横向变化 $${dx}$ 异号，所以斜率为负。`,
          ),
          t(
            "The two points have the same $y$-coordinate: the line is horizontal and its slope is $0$.",
            "两点的 $y$ 坐标相同：直线是水平的，斜率为 $0$。",
          ),
          t(
            "The two points have the same $x$-coordinate: the line is vertical, the run is $0$, and division by $0$ is not defined, so the slope is not defined either.",
            "两点的 $x$ 坐标相同：直线是竖直的，横向变化为 $0$，斜率不存在。",
          ),
        ][kind]!;
        const check =
          kind === 3
            ? t(
                `**Check.** The formula would give $\\frac{${dy}}{0}$, and no number times $0$ is $${dy}$, so there is no slope to write down.`,
                `**检验。** 用公式会得到 $\\frac{${dy}}{0}$，而没有哪个数乘 $0$ 等于 $${dy}$，所以写不出斜率。`,
              )
            : kind === 2
              ? t(`**Check.** $m = \\frac{0}{${dx}} = 0$.`, `**检验。** $m = \\frac{0}{${dx}} = 0$。`)
              : t(
                  `**Check.** $m = \\frac{${dy}}{${dx}} = ${num(Q.of(dy, dx))}$, which is ${kind === 0 ? "positive" : "negative"}.`,
                  `**检验。** $m = \\frac{${dy}}{${dx}} = ${num(Q.of(dy, dx))}$，是${kind === 0 ? "正" : "负"}数。`,
                );
        return {
          ...choiceProblem({
            prompt: t(`What is the slope of the line through $${p}$ and $${q}$?`, `过点 $${p}$ 和 $${q}$ 的直线的斜率是什么？`),
            options: slopeKinds,
            correct: kind,
            solution: t(
              `From $${p}$ to $${q}$, the run is $${num(x1 + dx)} - ${paren(x1)} = ${dx}$ and the rise is $${num(y1 + dy)} - ${paren(y1)} = ${dy}$.

${reason.en}

${check.en}`,
              `从 $${p}$ 到 $${q}$，横向变化 $${num(x1 + dx)} - ${paren(x1)} = ${dx}$，纵向变化 $${num(y1 + dy)} - ${paren(y1)} = ${dy}$。

${reason["zh-CN"]}

${check["zh-CN"]}`,
            ),
          }),
          solutionFigure: slopeFigure(
            [x1, y1],
            [x1 + dx, y1 + dy],
            `The line through ${at([x1, y1])} and ${at([x1 + dx, y1 + dy])}: the run is ${dx} and the rise is ${dy}.`,
            `经过 ${at([x1, y1])} 和 ${at([x1 + dx, y1 + dy])} 的直线：水平变化 ${dx}，竖直变化 ${dy}。`,
          ),
        };
      },
    },
    {
      id: "missing-coordinate",
      title: t("Finding a missing coordinate", "求未知坐标"),
      explanation: t(
        `The slope formula links four coordinates and the slope. If the slope and three of the coordinates are known, it becomes an equation for the fourth.

The line through $(2, 3)$ and $(6, y)$ has slope $\\frac{1}{2}$. Put what is known into the formula, then multiply both sides by the run $6 - 2 = 4$:

$$\\frac{y - 3}{6 - 2} = \\frac{1}{2} \\;\\Rightarrow\\; y - 3 = \\frac{1}{2} \\cdot 4 = 2 \\;\\Rightarrow\\; y = 5.$$

In words: a run of $4$ at slope $\\frac{1}{2}$ gives a rise of $2$, and rising $2$ from $y = 3$ reaches $5$. When the missing coordinate is an $x$, the reasoning runs backward: the run is the rise **divided** by the slope.

> **Watch out.** The rise is the slope **times** the run, and the run is the rise **divided by** the slope; do not mix them up. And the change is measured from the first point: add it to the known coordinate, as in $3 + 2 = 5$, rather than giving the change itself as the answer.`,
        `斜率公式把四个坐标和斜率联系在一起。已知斜率和其中三个坐标，它就成了关于第四个坐标的方程。

过 $(2, 3)$ 和 $(6, y)$ 的直线斜率为 $\\frac{1}{2}$。把已知的数代入公式，再在两边同乘横向变化 $6 - 2 = 4$：

$$\\frac{y - 3}{6 - 2} = \\frac{1}{2} \\;\\Rightarrow\\; y - 3 = \\frac{1}{2} \\cdot 4 = 2 \\;\\Rightarrow\\; y = 5.$$

也就是说：斜率为 $\\frac{1}{2}$ 时，横向变化 $4$ 对应纵向变化 $2$，从 $y = 3$ 升高 $2$ 到 $5$。如果未知的是 $x$ 坐标，就反过来想：横向变化等于纵向变化**除以**斜率。

> **注意。** 纵向变化等于斜率**乘**横向变化，横向变化等于纵向变化**除以**斜率，两者不要弄混。变化量是相对第一个点的：要把它加到已知坐标上，比如 $3 + 2 = 5$，而不是把变化量本身当作答案。`,
      ),
      generate(rng) {
        const m = rng.bool() ? Q.of(rng.nonZero(-4, 4)) : rng.pick(fracSlopes);
        const k = rng.nonZero(-3, 3);
        const run = Number(m.d) * k;
        const rise = Number(m.n) * k;
        const [x1, y1] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [x2, y2] = [x1 + run, y1 + rise];
        if (rng.bool()) {
          const work = steps(
            `\\frac{y - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = ${num(m)}`,
            `y - ${paren(y1)} = ${num(m)} \\cdot ${paren(run)} = ${num(rise)}`,
            `y = ${y2}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `The line through $${pointLatex([x1, y1])}$ and $(${num(x2)}, y)$ has slope $${num(m)}$. Find $y$.`,
                `过点 $${pointLatex([x1, y1])}$ 和 $(${num(x2)}, y)$ 的直线的斜率为 $${num(m)}$。求 $y$。`,
              ),
              answer: y2,
              solveFor: "y",
              mistakes: [
                why(
                  y1 - rise,
                  "That moves from the first point the wrong way. Add the change in $y$ to the first $y$-coordinate.",
                  "这是从第一个点朝相反方向移动。应把 $y$ 的变化量加到第一个点的纵坐标上。",
                ),
                why(
                  rise,
                  "That is the change in $y$. Add it to the $y$-coordinate of the first point.",
                  "这是 $y$ 的变化量，还要加上第一个点的纵坐标。",
                ),
                why(
                  Q.of(y1).add(Q.of(run).div(m)),
                  "You divided the change in $x$ by the slope. The change in $y$ is the slope times the change in $x$.",
                  "你用 $x$ 的变化量除以了斜率。$y$ 的变化量等于斜率乘 $x$ 的变化量。",
                ),
              ],
              solution: t(
                `**Step 1: set up the equation.** Put the two points and the slope into $m = \\frac{y_2 - y_1}{x_2 - x_1}$, with $y$ unknown.

**Step 2: solve.** The run is $${num(x2)} - ${paren(x1)} = ${run}$. Multiply both sides by it${undo(y1).en}:${work}**Check.** $\\frac{${y2} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${rise}}{${run}} = ${num(m)}$, the given slope.`,
                `**第一步：列方程。** 把两点和斜率代入 $m = \\frac{y_2 - y_1}{x_2 - x_1}$，$y$ 未知。

**第二步：解方程。** 横向变化是 $${num(x2)} - ${paren(x1)} = ${run}$。两边同乘它${undo(y1)["zh-CN"]}：${work}**检验。** $\\frac{${y2} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${rise}}{${run}} = ${num(m)}$，正是已知斜率。`,
              ),
            }),
            solutionFigure: slopeFigure(
              [x1, y1],
              [x2, y2],
              `With slope ${plain(m)} from ${at([x1, y1])}, the other point is ${at([x2, y2])}, so y = ${y2}.`,
              `从 ${at([x1, y1])} 出发，斜率为 ${plain(m)}，另一点是 ${at([x2, y2])}，所以 y = ${y2}。`,
            ),
          };
        }
        const work = steps(
          `\\frac{${num(y2)} - ${paren(y1)}}{x - ${paren(x1)}} = ${num(m)}`,
          `x - ${paren(x1)} = \\frac{${rise}}{${num(m)}} = ${num(run)}`,
          `x = ${x2}`,
        );
        return {
          ...numberProblem({
            prompt: t(
              `The line through $${pointLatex([x1, y1])}$ and $(x, ${num(y2)})$ has slope $${num(m)}$. Find $x$.`,
              `过点 $${pointLatex([x1, y1])}$ 和 $(x, ${num(y2)})$ 的直线的斜率为 $${num(m)}$。求 $x$。`,
            ),
            answer: x2,
            solveFor: "x",
            mistakes: [
              why(
                x1 - run,
                "That moves from the first point the wrong way. Add the change in $x$ to the first $x$-coordinate.",
                "这是从第一个点朝相反方向移动。应把 $x$ 的变化量加到第一个点的横坐标上。",
              ),
              why(
                run,
                "That is the change in $x$. Add it to the $x$-coordinate of the first point.",
                "这是 $x$ 的变化量，还要加上第一个点的横坐标。",
              ),
              why(
                Q.of(x1).add(Q.of(rise).mul(m)),
                "You multiplied the change in $y$ by the slope. The change in $x$ is the change in $y$ divided by the slope.",
                "你用 $y$ 的变化量乘了斜率。$x$ 的变化量等于 $y$ 的变化量除以斜率。",
              ),
            ],
            solution: t(
              `**Step 1: set up the equation.** Put the two points and the slope into $m = \\frac{y_2 - y_1}{x_2 - x_1}$, with $x$ unknown.

**Step 2: solve.** The rise is $${num(y2)} - ${paren(y1)} = ${rise}$. Since the rise is the slope times the run, the run $x - ${paren(x1)}$ is the rise divided by the slope${undo(x1).en}:${work}**Check.** $\\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = \\frac{${rise}}{${run}} = ${num(m)}$, the given slope.`,
              `**第一步：列方程。** 把两点和斜率代入 $m = \\frac{y_2 - y_1}{x_2 - x_1}$，$x$ 未知。

**第二步：解方程。** 纵向变化是 $${num(y2)} - ${paren(y1)} = ${rise}$。因为纵向变化等于斜率乘横向变化，横向变化 $x - ${paren(x1)}$ 等于纵向变化除以斜率${undo(x1)["zh-CN"]}：${work}**检验。** $\\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = \\frac{${rise}}{${run}} = ${num(m)}$，正是已知斜率。`,
            ),
          }),
          solutionFigure: slopeFigure(
            [x1, y1],
            [x2, y2],
            `With slope ${plain(m)} from ${at([x1, y1])}, the other point is ${at([x2, y2])}, so x = ${x2}.`,
            `从 ${at([x1, y1])} 出发，斜率为 ${plain(m)}，另一点是 ${at([x2, y2])}，所以 x = ${x2}。`,
          ),
        };
      },
    },
  ],
};

// ─── Slope-intercept form ───────────────────────────────────────────────────

export const slopeInterceptForm: TopicDef = {
  id: "slope-intercept-form",
  title: t("Equations of Lines in Slope-Intercept Form", "斜截式直线方程"),
  summary: t(
    "Write and use the equation $y = mx + b$ of a line with slope $m$ and $y$-intercept $b$.",
    "写出并使用斜率为 $m$、$y$ 轴截距为 $b$ 的直线方程 $y = mx + b$。",
  ),
  prerequisites: ["slope-of-a-line", "evaluating-expressions"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.8.EE.B.6", "CCSS.8.F.A.3"],
  intro: t(
    `A slope tells how a line tilts, but many lines share a tilt: they are parallel copies of one another. To pin down one line we also need a point, and the most convenient point is where the line crosses the $y$-axis, its **$y$-intercept** $(0, b)$.

Take the line with slope $2$ through $(0, 1)$, and any other point $(x, y)$ on it. From $(0, 1)$ to $(x, y)$ the run is $x - 0 = x$ and the rise is $y - 1$:

{{figure 0}}

The slope is the same between any two points of the line, so

$$\\frac{y - 1}{x} = 2, \\qquad\\text{so}\\qquad y - 1 = 2x, \\qquad\\text{so}\\qquad y = 2x + 1.$$

The equation says: start at height $1$ on the $y$-axis, and add $2$ for every unit you move right. For example, $x = 3$ gives $y = 7$, and indeed $(3, 7)$ is on the line. The same reasoning for any slope $m$ and $y$-intercept $b$ gives the **slope-intercept form**

$$y = mx + b.$$

In this lesson we write lines in this form from their slope and $y$-intercept, read the equation of a line from its graph, and use the equation to find and test points of the line.`,
    `斜率说明直线怎样倾斜，但倾斜程度相同的直线有很多条，它们互相平行。要确定一条直线，还需要一个点，最方便的点是直线与 $y$ 轴的交点，即 **$y$ 轴截距**点 $(0, b)$。

取斜率为 $2$、过 $(0, 1)$ 的直线，并在直线上任取另一点 $(x, y)$。从 $(0, 1)$ 到 $(x, y)$，横向变化 $x - 0 = x$，纵向变化 $y - 1$：

{{figure 0}}

直线上任意两点之间的斜率都相同，所以

$$\\frac{y - 1}{x} = 2, \\qquad\\text{所以}\\qquad y - 1 = 2x, \\qquad\\text{所以}\\qquad y = 2x + 1.$$

这个方程的意思是：从 $y$ 轴上高度 $1$ 处出发，每向右移动一个单位就加 $2$。例如 $x = 3$ 时 $y = 7$，$(3, 7)$ 确实在直线上。对任意斜率 $m$ 和 $y$ 轴截距 $b$ 做同样的推导，就得到**斜截式**

$$y = mx + b.$$

这节课我们由斜率和 $y$ 轴截距写出斜截式，从图像读出直线的方程，并用方程求出和检验直线上的点。`,
  ),
  introFigures: [
    graphFigure(
      viewAround([
        [0, 1],
        [3, 7],
      ]),
      [
        { kind: "line", a: [0, 1], b: [3, 7], accent: true },
        ...riseRun([0, 1], [3, 7], ["x", "y - 1"]),
        { kind: "point", at: [0, 1], label: "(0, 1)", dir: "nw" },
        { kind: "point", at: [3, 7], label: "(x, y)", dir: "nw", tone: "result" },
      ],
      "The line with slope 2 through (0, 1). From (0, 1) to another point (x, y) of the line, the run is x and the rise is y − 1.",
      "过 (0, 1)、斜率为 2 的直线。从 (0, 1) 到直线上另一点 (x, y)，横向变化是 x，纵向变化是 y − 1。",
    ),
  ],
  knowledgePoints: [
    {
      id: "writing-from-slope-and-intercept",
      title: t("Slope and $y$-intercept", "斜率与 $y$ 轴截距"),
      explanation: t(
        `A line crosses the $y$-axis at its **$y$-intercept** $(0, b)$; the number $b$ is also called the $y$-intercept. The line with slope $m$ and $y$-intercept $b$ has the equation

$$y = mx + b,$$

called **slope-intercept form**. Each part has a job: at $x = 0$ the term $mx$ is $0$, so $y = b$ and the line passes through $(0, b)$; and each step of $1$ to the right adds $m$ to $y$, which is what a slope of $m$ means.

So the line with slope $-\\frac{3}{4}$ through $(0, 2)$ is $y = -\\frac{3}{4}x + 2$, and the line with slope $5$ and $y$-intercept $-1$ is $y = 5x + (-1)$, written $y = 5x - 1$.

> **Watch out.** The slope multiplies $x$ and the intercept stands alone: slope $5$ and intercept $-1$ give $y = 5x - 1$, not $y = -x + 5$. Keep each sign with its number, so an intercept of $-1$ is subtracted, not added.`,
        `直线与 $y$ 轴的交点 $(0, b)$ 叫做直线的 **$y$ 轴截距**点，数 $b$ 叫做 **$y$ 轴截距**。斜率为 $m$、$y$ 轴截距为 $b$ 的直线的方程是

$$y = mx + b,$$

叫做**斜截式**。每一部分各有作用：$x = 0$ 时 $mx$ 这一项为 $0$，所以 $y = b$，直线经过 $(0, b)$；每向右移动 $1$，$y$ 就增加 $m$，这正是斜率为 $m$ 的意思。

所以斜率为 $-\\frac{3}{4}$、过 $(0, 2)$ 的直线是 $y = -\\frac{3}{4}x + 2$；斜率为 $5$、$y$ 轴截距为 $-1$ 的直线是 $y = 5x + (-1)$，写作 $y = 5x - 1$。

> **注意。** 斜率乘 $x$，截距单独一项：斜率 $5$、截距 $-1$ 得 $y = 5x - 1$，而不是 $y = -x + 5$。每个数要带着自己的符号，所以截距 $-1$ 是减去 $1$，不是加上 $1$。`,
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const b = rng.int(-9, 9);
        const answer = si(m, b);
        const prompt = rng.bool()
          ? t(
              `Write the equation of the line with slope $${num(m)}$ and $y$-intercept $${num(b)}$, in slope-intercept form.`,
              `写出斜率为 $${num(m)}$、$y$ 轴截距为 $${num(b)}$ 的直线的斜截式方程。`,
            )
          : t(
              `A line has slope $${num(m)}$ and crosses the $y$-axis at $${pointLatex([0, b])}$. Write its equation in slope-intercept form.`,
              `一条直线的斜率为 $${num(m)}$，与 $y$ 轴交于 $${pointLatex([0, b])}$。写出它的斜截式方程。`,
            );
        return {
          ...equationProblem({
            prompt,
            answer,
            form: "slope-intercept",
            wrong: [si(b, m), si(m, -b), si(m.neg(), b)],
            solution: t(
              `The slope is the coefficient of $x$, so $m = ${num(m)}$. The $y$-intercept is the height where the line meets the $y$-axis, so $b = ${num(b)}$. Put both into $y = mx + b$: ${steps(answer)}The line drawn from its $y$-intercept with this slope:

{{figure 0}}

**Check.** At $x = 0$ the equation gives $y = ${num(b)}$, so the line meets the $y$-axis at $${pointLatex([0, b])}$; at $x = 1$ it gives $y = ${num(m.add(Q.of(b)))}$, a rise of $${num(m)}$ for a run of $1$, which is the slope.`,
              `斜率是 $x$ 的系数，所以 $m = ${num(m)}$。$y$ 轴截距是直线与 $y$ 轴相交处的高度，所以 $b = ${num(b)}$。把两者代入 $y = mx + b$：${steps(answer)}从 $y$ 轴截距出发、以此斜率画出的直线：

{{figure 0}}

**检验。** $x = 0$ 时方程给出 $y = ${num(b)}$，所以直线与 $y$ 轴交于 $${pointLatex([0, b])}$；$x = 1$ 时 $y = ${num(m.add(Q.of(b)))}$，横向变化 $1$ 对应纵向变化 $${num(m)}$，正是斜率。`,
            ),
          }),
          solutionFigures: [
            slopeFigure(
              [0, b],
              riseOf([0, b], m),
              `The line starts at ${b} on the y-axis and has slope ${plain(m)}.`,
              `直线从 y 轴上的 ${b} 出发，斜率是 ${plain(m)}。`,
              true,
            ),
          ],
        };
      },
    },
    {
      id: "reading-from-a-graph",
      figure: gradeDrawings3["slope-intercept-form#reading-from-a-graph"],
      title: t("The equation of a graphed line", "由图像写方程"),
      explanation: t(
        `A graph shows the two numbers that slope-intercept form needs, one after the other.

1. **The $y$-intercept.** Find where the line crosses the $y$-axis. The height of that point is $b$.
2. **The slope.** From that point, walk along the line to another point where it crosses grid corners exactly. Count the run (across) and the rise (up is positive, down negative), and divide: $m = \\frac{\\text{rise}}{\\text{run}}$.

If a line crosses the $y$-axis at $(0, -3)$ and also passes through $(2, 2)$, then $b = -3$, the walk from $(0, -3)$ to $(2, 2)$ has run $2$ and rise $5$, so $m = \\frac{5}{2}$, and the line is $y = \\frac{5}{2}x - 3$.

> **Watch out.** Put the rise on top: $\\frac{2}{5}$ would describe a much gentler line. Check the sign against the picture, since a line falling from left to right needs a negative slope, and read $b$ with its sign: a crossing below the origin is a negative intercept.`,
        `图像把斜截式需要的两个数依次给了出来。

1. **$y$ 轴截距。** 找到直线与 $y$ 轴的交点，这一点的高度就是 $b$。
2. **斜率。** 从这一点沿直线走到另一个恰好在格点上的点，数出横向变化（横着走）和纵向变化（向上为正，向下为负），相除：$m = \\frac{\\text{纵向变化}}{\\text{横向变化}}$。

若直线与 $y$ 轴交于 $(0, -3)$，又经过 $(2, 2)$，则 $b = -3$；从 $(0, -3)$ 到 $(2, 2)$，横向变化 $2$，纵向变化 $5$，所以 $m = \\frac{5}{2}$，直线为 $y = \\frac{5}{2}x - 3$。

> **注意。** 纵向变化放在分子上：$\\frac{2}{5}$ 表示的是平缓得多的直线。要对照图像检查符号：从左向右下降的直线斜率为负；读 $b$ 时也要带符号，交点在原点下方，截距就是负数。`,
      ),
      generate(rng) {
        let b: number;
        let run: number;
        let rise: number;
        do {
          [b, run, rise] = [rng.int(-4, 4), rng.int(1, 3), rng.nonZero(-4, 4)];
        } while (Math.abs(b + rise) > 5);
        const m = Q.of(rise, run);
        const answer = si(m, b);
        return annotate(
          {
            ...equationProblem({
              prompt: t("Write the equation of the line shown, in slope-intercept form.", "写出图中直线的斜截式方程。"),
              answer,
              form: "slope-intercept",
              wrong: [si(Q.of(run, rise), b), si(m.neg(), b), si(m, -b)],
              solution: t(
                `**Step 1: the $y$-intercept.** The line crosses the $y$-axis at $${pointLatex([0, b])}$, so $b = ${b}$.

**Step 2: the slope.** From $${pointLatex([0, b])}$ to the other marked point $${pointLatex([run, b + rise])}$ the run is $${run}$ and the rise is $${rise}$, so $m = \\frac{${rise}}{${run}}${m.d === BigInt(run) ? "" : ` = ${num(m)}`}$.

**Step 3: the equation.** Put $m$ and $b$ into $y = mx + b$: ${steps(answer)}**Check.** The marked point $${pointLatex([run, b + rise])}$ must satisfy the equation: $${evalAt(m, run, b)} = ${b + rise}$.`,
                `**第一步：$y$ 轴截距。** 直线与 $y$ 轴交于 $${pointLatex([0, b])}$，所以 $b = ${b}$。

**第二步：斜率。** 从 $${pointLatex([0, b])}$ 到另一个标出的点 $${pointLatex([run, b + rise])}$，横向变化是 $${run}$，纵向变化是 $${rise}$，所以 $m = \\frac{${rise}}{${run}}${m.d === BigInt(run) ? "" : ` = ${num(m)}`}$。

**第三步：写方程。** 把 $m$ 和 $b$ 代入 $y = mx + b$：${steps(answer)}**检验。** 标出的点 $${pointLatex([run, b + rise])}$ 必须满足方程：$${evalAt(m, run, b)} = ${b + rise}$。`,
              ),
            }),
            figure: graph(
              [lineMark(m, b), { kind: "point", at: [0, b] }, { kind: "point", at: [run, b + rise] }],
              "A line through two marked grid points, one of them on the y-axis.",
              "一条经过两个标出的网格点的直线，其中一个点在 y 轴上。",
            ),
          },
          view,
          [...riseRun([0, b], [run, b + rise]), { kind: "point", at: [0, b], tone: "result" }],
          `The line crosses the y-axis at ${b}, with a run of ${run} and a rise of ${rise}: the slope is ${plain(m)}.`,
          `直线与 y 轴交于 ${b}，水平变化 ${run}，竖直变化 ${rise}：斜率是 ${plain(m)}。`,
        );
      },
    },
    {
      id: "points-on-a-line",
      title: t("Points on a line", "直线上的点"),
      explanation: t(
        `An equation of a line is a test that every point of the line passes and no other point does: a point lies on the line $y = mx + b$ exactly when its coordinates make the equation true. That gives two uses.

**Finding a point.** To find the point of the line with a given $x$, substitute it and compute $y$, multiplying before adding. On $y = -2x + 7$, the point with $x = 3$ has

$$y = -2 \\cdot 3 + 7 = -6 + 7 = 1,$$

so $(3, 1)$ is on the line.

**Testing a point.** To test whether $(4, 0)$ is on that line, substitute $x = 4$: $-2 \\cdot 4 + 7 = -1$. The line is at height $-1$ there, not $0$, so $(4, 0)$ is not on it.

> **Watch out.** Multiply $m$ by $x$ first, then add $b$: $-2 \\cdot 3 + 7$ is $1$, not $-2 + 3 + 7$. And add $b$ with its own sign; a line $y = 4x - 5$ subtracts $5$.`,
        `直线的方程是一种检验：直线上的每个点都能通过，其他点都通不过。点在直线 $y = mx + b$ 上，当且仅当它的坐标使方程成立。由此有两种用法。

**求点。** 要求直线上横坐标为给定值的点，就把 $x$ 代入算出 $y$，先乘后加。在 $y = -2x + 7$ 上，$x = 3$ 的点

$$y = -2 \\cdot 3 + 7 = -6 + 7 = 1,$$

所以 $(3, 1)$ 在直线上。

**检验点。** 要检验 $(4, 0)$ 是否在这条直线上，代入 $x = 4$：$-2 \\cdot 4 + 7 = -1$。直线在那里的高度是 $-1$，不是 $0$，所以 $(4, 0)$ 不在直线上。

> **注意。** 先算 $m$ 乘 $x$，再加 $b$：$-2 \\cdot 3 + 7$ 等于 $1$，不是 $-2 + 3 + 7$。$b$ 要带着自己的符号加上；直线 $y = 4x - 5$ 是减去 $5$。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const m = pickSlope(rng, 0.3);
        const b = rng.int(-9, 9);
        const x0 = Number(m.d) * rng.nonZero(-4, 4);
        const y = m.mul(Q.of(x0)).add(Q.of(b));
        const line = si(m, b);
        const work = `y = ${evalAt(m, x0, b)} = ${num(y)}`;
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(`The point $(${x0}, y)$ lies on the line $${line}$. Find $y$.`, `点 $(${x0}, y)$ 在直线 $${line}$ 上。求 $y$。`),
              answer: y,
              solveFor: "y",
              wrong: [m.mul(Q.of(x0)).sub(Q.of(b)), m.add(Q.of(x0 + b)), Q.of(x0 + b)],
              solution: t(
                `A point lies on the line exactly when its coordinates satisfy the equation, so substitute $x = ${x0}$ into $${line}$, multiplying before adding: ${steps(work)}So the point is $${pointLatex([x0, y])}$.

**Check.** From the $y$-intercept $${pointLatex([0, b])}$, a run of $${x0}$ at slope $${num(m)}$ is a rise of $${num(m.mul(Q.of(x0)))}$, and $${b} + ${paren(m.mul(Q.of(x0)))} = ${num(y)}$.`,
                `点在直线上，当且仅当它的坐标满足方程，所以把 $x = ${x0}$ 代入 $${line}$，先乘后加：${steps(work)}所以这个点是 $${pointLatex([x0, y])}$。

**检验。** 从 $y$ 轴截距点 $${pointLatex([0, b])}$ 出发，斜率为 $${num(m)}$，横向变化 $${x0}$ 对应纵向变化 $${num(m.mul(Q.of(x0)))}$，而 $${b} + ${paren(m.mul(Q.of(x0)))} = ${num(y)}$。`,
              ),
            }),
            solutionFigure: graphFigure(
              viewAround([
                [x0, y.toNumber()],
                [0, b],
              ]),
              [{ kind: "line", a: [0, b], b: riseOf([0, b], m), accent: true }, ...guides([x0, y.toNumber()], at([x0, y.toNumber()]))],
              `At x = ${x0} the line is at y = ${plain(y)}.`,
              `当 x = ${x0} 时，直线上 y = ${plain(y)}。`,
            ),
          };
        }
        const on = rng.bool();
        const y0 = on ? y : y.add(Q.of(rng.nonZero(-3, 3)));
        return {
          ...choiceProblem({
            prompt: t(
              `Does the point $${pointLatex([x0, y0])}$ lie on the line $${line}$?`,
              `点 $${pointLatex([x0, y0])}$ 在直线 $${line}$ 上吗？`,
            ),
            options: yesNo,
            correct: on ? 0 : 1,
            solution: t(
              `The point is on the line exactly when its coordinates satisfy the equation. Substitute its $x$-coordinate, $x = ${x0}$, into the right side: ${steps(work)}${on ? `This is the $y$-coordinate of the point, so the point lies on the line.` : `The line is at height $${num(y)}$ when $x = ${x0}$, but the point is at height $${num(y0)}$, so the point is not on the line.`}

**Check.** ${on ? `Both sides of $${line}$ agree at $${pointLatex([x0, y0])}$: the left side is $${num(y0)}$ and the right side is $${num(y)}$.` : `The point of the line with $x = ${x0}$ is $${pointLatex([x0, y])}$, which is $${y0.sub(y).abs().toLatex()}$ ${y0.cmp(y) > 0 ? "below" : "above"} the given point.`}`,
              `点在直线上，当且仅当它的坐标满足方程。把它的横坐标 $x = ${x0}$ 代入右边：${steps(work)}${on ? "这正是该点的 $y$ 坐标，所以点在直线上。" : `当 $x = ${x0}$ 时直线的高度是 $${num(y)}$，而这个点的高度是 $${num(y0)}$，所以点不在直线上。`}

**检验。** ${on ? `在 $${pointLatex([x0, y0])}$ 处，$${line}$ 两边相等：左边是 $${num(y0)}$，右边是 $${num(y)}$。` : `直线上 $x = ${x0}$ 的点是 $${pointLatex([x0, y])}$，比已知点${y0.cmp(y) > 0 ? "低" : "高"} $${y0.sub(y).abs().toLatex()}$。`}`,
            ),
          }),
          solutionFigure: graphFigure(
            viewAround([
              [x0, y.toNumber()],
              [x0, y0.toNumber()],
              [0, b],
            ]),
            [
              { kind: "line", a: [0, b], b: riseOf([0, b], m), accent: true },
              { kind: "point", at: [x0, y.toNumber()] },
              { kind: "point", at: [x0, y0.toNumber()], tone: "result" },
            ],
            on
              ? `The point ${at([x0, y0.toNumber()])} lies on the line.`
              : `At x = ${x0} the line is at y = ${plain(y)}, not ${plain(y0)}.`,
            on ? `点 ${at([x0, y0.toNumber()])} 在直线上。` : `当 x = ${x0} 时，直线上 y = ${plain(y)}，不是 ${plain(y0)}。`,
          ),
        };
      },
    },
  ],
};

export const propertiesOfLinesInSlopeInterceptForm: TopicDef = {
  id: "properties-of-lines-in-slope-intercept-form",
  title: t("Properties of Lines Given in Slope-Intercept Form", "斜截式直线的性质"),
  summary: t(
    "Read the slope and intercepts of a line, and rewrite equations in slope-intercept form.",
    "读出直线的斜率和截距，并把方程化为斜截式。",
  ),
  prerequisites: ["slope-intercept-form", "two-step-equations"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.8.F.B.4", "CCSS.HSA.CED.A.4"],
  intro: t(
    `Slope-intercept form, $y = mx + b$, is useful because the numbers we care about can be read straight off it: the coefficient of $x$ is the slope, and the constant is where the line meets the $y$-axis. Other facts take one short calculation, such as where the line meets the $x$-axis.

Take $y = 2x - 6$. Its slope is $2$, and at $x = 0$ it gives $y = -6$, so it crosses the $y$-axis at $(0, -6)$. On the $x$-axis every point has $y = 0$, so solving $0 = 2x - 6$ gives $x = 3$: it crosses the $x$-axis at $(3, 0)$.

{{figure 0}}

Lines are not always given in this form; $2x - y = 6$ is the same line written differently. In this lesson we read the slope and the $y$-intercept, find the $x$-intercept, and solve other equations for $y$ to put them in slope-intercept form.`,
    `斜截式 $y = mx + b$ 之所以有用，是因为我们关心的数可以直接从中读出：$x$ 的系数是斜率，常数是直线与 $y$ 轴相交的位置。另一些信息只需一步简单的计算，比如直线与 $x$ 轴的交点。

以 $y = 2x - 6$ 为例。它的斜率是 $2$；$x = 0$ 时 $y = -6$，所以它与 $y$ 轴交于 $(0, -6)$。$x$ 轴上每个点的 $y$ 都是 $0$，解 $0 = 2x - 6$ 得 $x = 3$：它与 $x$ 轴交于 $(3, 0)$。

{{figure 0}}

直线并不总是以这种形式给出；$2x - y = 6$ 是同一条直线的另一种写法。这节课我们读出斜率和 $y$ 轴截距，求 $x$ 轴截距，并把其他方程对 $y$ 求解，化为斜截式。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 6, yMin: -8, yMax: 2, labelEvery: 2 },
      [
        { kind: "line", a: [0, -6], b: [3, 0], accent: true },
        { kind: "point", at: [0, -6], label: "(0, −6)", dir: "e" },
        { kind: "point", at: [3, 0], label: "(3, 0)", dir: "se", tone: "result" },
      ],
      "The line y = 2x − 6, which crosses the y-axis at (0, −6) and the x-axis at (3, 0).",
      "直线 y = 2x − 6，它与 y 轴交于 (0, −6)，与 x 轴交于 (3, 0)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "slope-and-y-intercept",
      title: t("Reading the slope and the $y$-intercept", "读出斜率和 $y$ 轴截距"),
      explanation: t(
        `In $y = mx + b$, the coefficient of $x$ is the slope, because each step of $1$ in $x$ changes $y$ by that coefficient. The constant term gives the $y$-intercept $(0, b)$, because $x = 0$ makes the $x$-term vanish and leaves $y = b$.

The terms may come in either order, and each keeps the sign in front of it. In $y = 4 - \\frac{1}{2}x$, the $x$-term is $-\\frac{1}{2}x$, so the slope is $-\\frac{1}{2}$; the constant is $4$, so the $y$-intercept is $(0, 4)$.

> **Watch out.** The slope is the number **with** $x$, whichever term comes first, and it carries the sign in front of it: in $y = 4 - \\frac{1}{2}x$ the slope is $-\\frac{1}{2}$, not $4$. The $y$-intercept as a point is $(0, b)$: its $x$-coordinate is $0$, so it is not $(b, 0)$.`,
        `在 $y = mx + b$ 中，$x$ 的系数是斜率，因为 $x$ 每增加 $1$，$y$ 就改变这个系数那么多。常数项给出 $y$ 轴截距点 $(0, b)$，因为 $x = 0$ 时含 $x$ 的项消失，只剩 $y = b$。

两项的顺序可以颠倒，每一项都带着它前面的符号。在 $y = 4 - \\frac{1}{2}x$ 中，含 $x$ 的项是 $-\\frac{1}{2}x$，所以斜率是 $-\\frac{1}{2}$；常数是 $4$，所以 $y$ 轴截距点是 $(0, 4)$。

> **注意。** 斜率是**和 $x$ 在一起**的那个数，不管它在前还是在后，并且要带上它前面的符号：在 $y = 4 - \\frac{1}{2}x$ 中斜率是 $-\\frac{1}{2}$，不是 $4$。$y$ 轴截距点是 $(0, b)$，它的横坐标是 $0$，不是 $(b, 0)$。`,
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const b = rng.nonZero(-9, 9);
        const rhs = rng.bool() ? linear(m, b) : poly([b, ""], [m, "x"]);
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(`Find the slope of the line $y = ${rhs}$.`, `求直线 $y = ${rhs}$ 的斜率。`),
              answer: m,
              wrong: [b, m.neg()],
              solution: t(
                `The $x$-term of $y = ${rhs}$ is $${poly([m, "x"])}$, with its sign. Its coefficient is the slope, wherever the term stands:

$$m = ${num(m)}.$$

**Check.** At $x = 0$ the equation gives $y = ${b}$, and at $x = 1$ it gives $y = ${num(m.add(Q.of(b)))}$: a run of $1$ changes $y$ by $${num(m)}$.`,
                `$y = ${rhs}$ 中含 $x$ 的项（连同符号）是 $${poly([m, "x"])}$。不管这一项在哪里，它的系数就是斜率：

$$m = ${num(m)}.$$

**检验。** $x = 0$ 时 $y = ${b}$，$x = 1$ 时 $y = ${num(m.add(Q.of(b)))}$：横向变化 $1$，$y$ 改变 $${num(m)}$。`,
              ),
            }),
            solutionFigure: slopeFigure(
              [0, b],
              riseOf([0, b], m),
              `The line has slope ${plain(m)} and crosses the y-axis at ${b}.`,
              `直线的斜率是 ${plain(m)}，与 y 轴交于 ${b}。`,
            ),
          };
        }
        return {
          ...pointProblem({
            prompt: t(
              `Find the $y$-intercept of the line $y = ${rhs}$, as an ordered pair.`,
              `求直线 $y = ${rhs}$ 与 $y$ 轴的交点，写成有序数对。`,
            ),
            answer: [0, b],
            wrong: [
              [b, 0],
              [0, m],
              [0, -b],
            ],
            solution: t(
              `The $y$-intercept is the point of the line on the $y$-axis, where $x = 0$. Setting $x = 0$ makes the term $${poly([m, "x"])}$ vanish and leaves the constant: $y = ${num(b)}$.

So the $y$-intercept is $${pointLatex([0, b])}$, with $x$-coordinate $0$.

**Check.** Put $x = 0$ and $y = ${b}$ into $y = ${rhs}$: the right side is $${evalAt(m, 0, b)} = ${b}$, the left side.`,
              `$y$ 轴截距点是直线在 $y$ 轴上的点，那里 $x = 0$。令 $x = 0$，含 $x$ 的项 $${poly([m, "x"])}$ 消失，只剩常数：$y = ${num(b)}$。

所以与 $y$ 轴的交点是 $${pointLatex([0, b])}$，横坐标为 $0$。

**检验。** 把 $x = 0$，$y = ${b}$ 代入 $y = ${rhs}$：右边 $${evalAt(m, 0, b)} = ${b}$，等于左边。`,
            ),
          }),
          solutionFigure: slopeFigure(
            [0, b],
            riseOf([0, b], m),
            `The line has slope ${plain(m)} and crosses the y-axis at ${b}.`,
            `直线的斜率是 ${plain(m)}，与 y 轴交于 ${b}。`,
          ),
        };
      },
    },
    {
      id: "x-intercept",
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        `A line crosses the $x$-axis at its **$x$-intercept**. Every point of the $x$-axis has height $0$, so the $x$-intercept is the point of the line where $y = 0$. To find it, set $y = 0$ and solve the equation for $x$:

$$y = 3x - 6: \\quad 0 = 3x - 6 \\;\\Rightarrow\\; 3x = 6 \\;\\Rightarrow\\; x = 2.$$

The constant $-6$ moved across as $+6$, then we divided by the slope $3$. So the $x$-intercept is $(2, 0)$.

> **Watch out.** The $x$-intercept is $(2, 0)$, with the $0$ in the $y$ place; $(0, 2)$ would be on the $y$-axis. When moving the constant to the other side, change its sign: $0 = 3x - 6$ gives $3x = 6$, not $3x = -6$.`,
        `直线与 $x$ 轴的交点叫做 **$x$ 轴截距**点。$x$ 轴上每个点的高度都是 $0$，所以 $x$ 轴截距点就是直线上 $y = 0$ 的点。令 $y = 0$，解出 $x$ 即可：

$$y = 3x - 6: \\quad 0 = 3x - 6 \\;\\Rightarrow\\; 3x = 6 \\;\\Rightarrow\\; x = 2.$$

常数 $-6$ 移到另一边成为 $+6$，再除以斜率 $3$。所以与 $x$ 轴的交点是 $(2, 0)$。

> **注意。** 与 $x$ 轴的交点是 $(2, 0)$，$0$ 在 $y$ 的位置上；$(0, 2)$ 在 $y$ 轴上。把常数移到另一边时要变号：由 $0 = 3x - 6$ 得 $3x = 6$，不是 $3x = -6$。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        let m: Q;
        let b: Q;
        if (rng.bool(0.35)) {
          m = Q.of(rng.sign() * rng.int(2, 5));
          b = Q.of(rng.nonZero(-9, 9));
        } else {
          m = pickSlope(rng);
          b = m.mul(Q.of(Number(m.d) * rng.nonZero(-4, 4))).neg();
        }
        const x0 = b.neg().div(m);
        return {
          ...pointProblem({
            prompt: t(
              `Find the $x$-intercept of the line $${si(m, b)}$, as an ordered pair.`,
              `求直线 $${si(m, b)}$ 与 $x$ 轴的交点，写成有序数对。`,
            ),
            answer: [x0, 0],
            wrong: [
              [x0.neg(), 0],
              [0, x0],
              [0, b],
            ],
            solution: t(
              `**Step 1: set $y = 0$.** Every point of the $x$-axis has $y = 0$.

**Step 2: solve for $x$.** Move the constant across with its sign changed, then divide by $${num(m)}$: ${steps(`0 = ${linear(m, b)}`, `${poly([m, "x"])} = ${num(b.neg())}`, `x = ${num(x0)}`)}The $x$-intercept is $${pointLatex([x0, 0])}$.

**Check.** $${evalAt(m, x0, b)} = 0$, so the line is at height $0$ there.`,
              `**第一步：令 $y = 0$。** $x$ 轴上每个点都有 $y = 0$。

**第二步：解出 $x$。** 把常数移到另一边并变号，再除以 $${num(m)}$：${steps(`0 = ${linear(m, b)}`, `${poly([m, "x"])} = ${num(b.neg())}`, `x = ${num(x0)}`)}与 $x$ 轴的交点是 $${pointLatex([x0, 0])}$。

**检验。** $${evalAt(m, x0, b)} = 0$，所以直线在那里的高度是 $0$。`,
            ),
          }),
          solutionFigure: graphFigure(
            viewAround([
              [0, b.toNumber()],
              [x0.toNumber(), 0],
            ]),
            [
              { kind: "line", a: [0, b.toNumber()], b: [x0.toNumber(), 0], accent: true },
              { kind: "point", at: [x0.toNumber(), 0], tone: "result" },
            ],
            `The line crosses the x-axis at ${plain(x0)}.`,
            `直线与 x 轴交于 ${plain(x0)}。`,
          ),
        };
      },
    },
    {
      id: "rewriting-in-slope-intercept-form",
      title: t("Rewriting in slope-intercept form", "化为斜截式"),
      explanation: t(
        `An equation such as $4x - 2y = 6$ describes a line, but its slope and $y$-intercept are hidden. Solving the equation for $y$ brings it to slope-intercept form, where they can be read. Two steps do it:

1. **Isolate the $y$-term.** Move every other term to the other side, by doing the opposite operation on both sides. Subtracting $4x$ from both sides gives $-2y = -4x + 6$.
2. **Divide every term by the coefficient of $y$.** Dividing by $-2$ gives $y = 2x - 3$.

Now the slope $2$ and the $y$-intercept $-3$ can be read.

> **Watch out.** Divide **every** term by the coefficient of $y$, including the constant: $-2y = -4x + 6$ gives $y = 2x - 3$, not $y = 2x + 6$. A term changes sign when it moves across, and dividing by a negative coefficient changes the sign of every term.`,
        `像 $4x - 2y = 6$ 这样的方程表示一条直线，但它的斜率和 $y$ 轴截距看不出来。把方程对 $y$ 求解，化成斜截式，就能读出它们。分两步：

1. **把含 $y$ 的项单独留下。** 在两边做相反的运算，把其他项移到另一边。两边同减 $4x$，得 $-2y = -4x + 6$。
2. **每一项都除以 $y$ 的系数。** 除以 $-2$，得 $y = 2x - 3$。

现在可以读出斜率 $2$ 和 $y$ 轴截距 $-3$。

> **注意。** 要把**每一项**都除以 $y$ 的系数，包括常数项：由 $-2y = -4x + 6$ 得 $y = 2x - 3$，不是 $y = 2x + 6$。一项移到另一边要变号；除以负系数时，每一项的符号都会改变。`,
      ),
      generate(rng) {
        let A: number;
        let B: number;
        let layout: number;
        do {
          [A, B, layout] = [rng.nonZero(-6, 6), rng.nonZero(-5, 5), rng.int(0, 3)];
        } while (layout >= 2 && Math.abs(B) === 1);
        const C = rng.bool(0.6) ? B * rng.int(-6, 6) : rng.int(-12, 12);
        const m = Q.of(-A, B);
        const b = Q.of(C, B);
        const eq = [
          std(A, B, C),
          `${poly([B, "y"], [A, "x"])} = ${num(C)}`,
          `${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`,
          `${poly([B, "y"], [-C, ""])} = ${poly([-A, "x"])}`,
        ][layout]!;
        const answer = si(m, b);

        return equationProblem({
          prompt: t(`Write $${eq}$ in slope-intercept form.`, `把 $${eq}$ 化为斜截式。`),
          answer,
          form: "slope-intercept",
          wrong: [si(m.neg(), b), si(-A, C), si(m, b.neg())],
          solution: t(
            `**Step 1: isolate the $y$-term.** Move every term without $y$ to the other side, changing its sign as it crosses: ${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`)}${B === 1 ? "The coefficient of $y$ is already $1$, so this is slope-intercept form. " : `**Step 2: divide every term by $${num(B)}$**, the coefficient of $y$, the constant included: ${steps(answer)}`}The slope is $${num(m)}$ and the $y$-intercept is $${num(b)}$.

**Check.** At $x = 0$ the answer gives $y = ${num(b)}$. In the original equation, $x = 0$ leaves $${poly([B, "y"])} = ${C}$, and $${num(B)} \\cdot ${paren(b)} = ${C}$.`,
            `**第一步：把含 $y$ 的项单独留下。** 把不含 $y$ 的项移到另一边，移项要变号：${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`)}${B === 1 ? "$y$ 的系数已经是 $1$，这就是斜截式。" : `**第二步：每一项都除以 $${num(B)}$**，即 $y$ 的系数，常数项也要除：${steps(answer)}`}斜率是 $${num(m)}$，$y$ 轴截距是 $${num(b)}$。

**检验。** $x = 0$ 时，答案给出 $y = ${num(b)}$。在原方程中，$x = 0$ 时剩下 $${poly([B, "y"])} = ${C}$，而 $${num(B)} \\cdot ${paren(b)} = ${C}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Point-slope and standard form ──────────────────────────────────────────

/** snugView is a window of the plane around the points and the origin, with a margin of two units, at most twice as tall as wide or as wide as tall, so that a short rise or run is not lost in a square view. */
function snugView(points: readonly Point[]): PlaneView {
  const xs = [0, ...points.map((p) => p[0])];
  const ys = [0, ...points.map((p) => p[1])];
  let [xMin, xMax, yMin, yMax] = [Math.min(...xs) - 2, Math.max(...xs) + 2, Math.min(...ys) - 2, Math.max(...ys) + 2];
  const widen = (lo: number, hi: number, span: number): [number, number] => {
    const more = Math.ceil((span - (hi - lo)) / 2);
    return more > 0 ? [lo - more, hi + more] : [lo, hi];
  };
  [xMin, xMax] = widen(xMin, xMax, (yMax - yMin) / 2);
  [yMin, yMax] = widen(yMin, yMax, (xMax - xMin) / 2);
  const span = Math.max(xMax - xMin, yMax - yMin);
  return { xMin, xMax, yMin, yMax, labelEvery: span > 14 ? 2 : 1 };
}

/** pointSlopeIntro draws the line through (3, 1) with slope 2 and a point (x, y) on it, with the run x − 3 and the rise y − 1. */
const pointSlopeIntro: Figure = graphFigure(
  viewAround([
    [3, 1],
    [6, 7],
  ]),
  [
    { kind: "line", a: [3, 1], b: [6, 7], accent: true },
    ...riseRun([3, 1], [6, 7], ["x - 3", "y - 1"]),
    { kind: "point", at: [3, 1], label: "(3, 1)", dir: "se" },
    { kind: "point", at: [6, 7], label: "(x, y)", dir: "nw", tone: "result" },
  ],
  "The line through (3, 1) with slope 2. From (3, 1) to any other point (x, y) of the line, the run is x − 3 and the rise is y − 1.",
  "过 (3, 1)、斜率为 2 的直线。从 (3, 1) 到直线上任意另一点 (x, y)，水平变化是 x − 3，竖直变化是 y − 1。",
);

/** pointSlopeCheck writes the check that the point (h, k) satisfies y − k = m(x − h): both sides are 0. */
function pointSlopeCheck(m: Q, h: number, k: number): Text {
  return t(
    `**Check.** The line must pass through $${pointLatex([h, k])}$. Put $x = ${h}$ and $y = ${k}$ in: the left side is $${k} - ${paren(k)} = 0$ and the right side is $${num(m)}(${h} - ${paren(h)}) = 0$. Both sides agree.`,
    `**检验。** 直线必须经过 $${pointLatex([h, k])}$。代入 $x = ${h}$，$y = ${k}$：左边 $${k} - ${paren(k)} = 0$，右边 $${num(m)}(${h} - ${paren(h)}) = 0$，两边相等。`,
  );
}

export const pointSlopeForm: TopicDef = {
  id: "point-slope-form",
  title: t("Equations of Lines in Point-Slope Form", "点斜式直线方程"),
  summary: t(
    "Write the equation of a line through a point with a given slope, or through two points.",
    "写出过一点且斜率已知、或过两点的直线方程。",
  ),
  prerequisites: ["slope-intercept-form", "distributive-property"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.4 },
    { topic: "distributive-property", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.8.F.B.4"],
  intro: t(
    `In slope-intercept form, $y = mx + b$, a line is written from its slope $m$ and the point where it crosses the $y$-axis. Often, though, what we know is a different point. Suppose a line passes through $(3, 1)$ and rises $2$ for every $1$ it moves right. Its $y$-intercept is not given, yet the line is completely determined: one point and a direction fix it.

The key fact is that a line has the **same slope between any two of its points**. Take any other point $(x, y)$ on the line. From $(3, 1)$ to $(x, y)$, the run is $x - 3$ and the rise is $y - 1$:

{{figure 0}}

Since the slope is $2$,

$$\\frac{y - 1}{x - 3} = 2, \\qquad\\text{so}\\qquad y - 1 = 2(x - 3).$$

Every point of the line satisfies this equation, and no other point does: it is an equation of the line. Doing the same with any point $(x_1, y_1)$ and any slope $m$ gives the **point-slope form**

$$y - y_1 = m(x - x_1).$$

In this lesson we write lines in this form from a point and a slope, then from two points, and finally turn point-slope form into slope-intercept form, to read the $y$-intercept.`,
    `在斜截式 $y = mx + b$ 中，直线由斜率 $m$ 和它与 $y$ 轴的交点写出。但很多时候，我们知道的是另外某个点。假设一条直线经过 $(3, 1)$，并且每向右移动 $1$ 就上升 $2$。题目没有给出 $y$ 轴截距，但这条直线已经完全确定了：一个点加一个方向就能确定一条直线。

关键在于，**直线上任意两点之间的斜率都相同**。在直线上任取另一点 $(x, y)$。从 $(3, 1)$ 到 $(x, y)$，水平变化是 $x - 3$，竖直变化是 $y - 1$：

{{figure 0}}

因为斜率是 $2$，

$$\\frac{y - 1}{x - 3} = 2, \\qquad\\text{所以}\\qquad y - 1 = 2(x - 3).$$

直线上的每个点都满足这个方程，其他点都不满足：它就是这条直线的方程。对任意一点 $(x_1, y_1)$ 和任意斜率 $m$ 做同样的推导，就得到**点斜式**

$$y - y_1 = m(x - x_1).$$

这节课先由一点和斜率写出点斜式，再由两点写出，最后把点斜式化为斜截式，以便读出 $y$ 轴截距。`,
  ),
  introFigures: [pointSlopeIntro],
  knowledgePoints: [
    {
      id: "writing-from-a-point-and-slope",
      title: t("A point and the slope", "一点和斜率"),
      explanation: t(
        `To write the line through $(x_1, y_1)$ with slope $m$, put the three numbers into

$$y - y_1 = m(x - x_1).$$

The coordinates of the point are **subtracted**: $y_1$ from $y$ on the left, $x_1$ from $x$ inside the parentheses. The slope multiplies the parentheses.

For the line through $(-4, 2)$ with slope $3$: here $x_1 = -4$, $y_1 = 2$ and $m = 3$, so

$$y - 2 = 3(x - (-4)).$$

Subtracting $-4$ is adding $4$, so the equation is written $y - 2 = 3(x + 4)$.

> **Watch out.** The signs in the equation are the opposite of the signs of the point: $y - 2$ comes from $y_1 = 2$, and $x + 4$ from $x_1 = -4$. Writing $y + 2 = 3(x - 4)$ describes a line through $(4, -2)$ instead. Also keep each coordinate with its own variable: $x_1$ goes with $x$, $y_1$ with $y$.`,
        `要写出过 $(x_1, y_1)$、斜率为 $m$ 的直线，把这三个数代入

$$y - y_1 = m(x - x_1).$$

点的坐标是被**减去**的：左边从 $y$ 中减去 $y_1$，括号里从 $x$ 中减去 $x_1$。斜率乘在括号前面。

求过 $(-4, 2)$、斜率为 $3$ 的直线：这里 $x_1 = -4$，$y_1 = 2$，$m = 3$，所以

$$y - 2 = 3(x - (-4)).$$

减去 $-4$ 就是加上 $4$，所以方程写作 $y - 2 = 3(x + 4)$。

> **注意。** 方程里的符号与点的坐标符号相反：$y - 2$ 来自 $y_1 = 2$，$x + 4$ 来自 $x_1 = -4$。写成 $y + 2 = 3(x - 4)$，表示的就成了过 $(4, -2)$ 的直线。另外，每个坐标要跟着自己的变量：$x_1$ 配 $x$，$y_1$ 配 $y$。`,
      ),
      generate(rng) {
        const m = pickSlopeNotOne(rng);
        const [h, k] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const answer = ps(m, h, k);
        const raw = `y - ${paren(k)} = ${num(m)}(x - ${paren(h)})`;
        const check = pointSlopeCheck(m, h, k);
        const flip = h < 0 || k < 0;
        const work = flip
          ? [
              `${steps(raw)}Subtracting a negative number is adding its opposite, so the signs flip:${steps(answer)}`,
              `${steps(raw)}减去一个负数等于加上它的相反数，所以符号改变：${steps(answer)}`,
            ]
          : [steps(answer), steps(answer)];
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the line through $${pointLatex([h, k])}$ with slope $${num(m)}$, in point-slope form.`,
              `写出过点 $${pointLatex([h, k])}$、斜率为 $${num(m)}$ 的直线的点斜式方程。`,
            ),
            answer,
            form: "point-slope",
            wrong: [ps(m, -h, -k), ps(m, k, h), ps(m.neg(), h, k)],
            solution: t(
              `The point gives $x_1 = ${h}$ and $y_1 = ${k}$, and the slope is $m = ${num(m)}$. Substitute them into $y - y_1 = m(x - x_1)$:${work[0]}The line drawn with this slope through the point:

{{figure 0}}

${check.en}`,
              `由点得 $x_1 = ${h}$，$y_1 = ${k}$，斜率 $m = ${num(m)}$。代入 $y - y_1 = m(x - x_1)$：${work[1]}过该点、以此斜率画出的直线：

{{figure 0}}

${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            slopeFigure(
              [h, k],
              riseOf([h, k], m),
              `The line through ${at([h, k])} with slope ${plain(m)}.`,
              `经过 ${at([h, k])}、斜率为 ${plain(m)} 的直线。`,
              true,
            ),
          ],
        };
      },
    },
    {
      id: "through-two-points",
      title: t("A line through two points", "过两点的直线"),
      explanation: t(
        `Two points also fix a line, but point-slope form needs the slope. So the work has two steps:

1. Find the slope from the two points: $m = \\dfrac{y_2 - y_1}{x_2 - x_1}$.
2. Use **either** point with that slope in $y - y_1 = m(x - x_1)$.

For the line through $(1, 5)$ and $(3, -1)$: the run from the first point to the second is $3 - 1 = 2$ and the rise is $-1 - 5 = -6$, so

$$m = \\frac{-6}{2} = -3.$$

With the point $(1, 5)$: $y - 5 = -3(x - 1)$.

Starting from the other point gives $y + 1 = -3(x - 3)$. The two equations look different, but they describe the same line: expanding either one gives $y = -3x + 8$.

> **Watch out.** Subtract in the same order on top and at the bottom of the slope: $\\frac{y_2 - y_1}{x_2 - x_1}$, never $\\frac{y_2 - y_1}{x_1 - x_2}$, which flips the sign. And the slope is rise over run, not run over rise.`,
        `两点也能确定一条直线，但点斜式需要斜率。所以分两步：

1. 由两点求斜率：$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$。
2. 用其中**任意**一点和这个斜率代入 $y - y_1 = m(x - x_1)$。

求过 $(1, 5)$ 和 $(3, -1)$ 的直线：从第一个点到第二个点，水平变化 $3 - 1 = 2$，竖直变化 $-1 - 5 = -6$，所以

$$m = \\frac{-6}{2} = -3.$$

用点 $(1, 5)$：$y - 5 = -3(x - 1)$。

用另一个点则得到 $y + 1 = -3(x - 3)$。两个方程看起来不同，表示的却是同一条直线：把任何一个展开，都得到 $y = -3x + 8$。

> **注意。** 斜率的分子和分母要按同样的顺序相减：$\\frac{y_2 - y_1}{x_2 - x_1}$，不能写成 $\\frac{y_2 - y_1}{x_1 - x_2}$，那样符号会反。斜率是竖直变化除以水平变化，不是反过来。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        let x1: number;
        let y1: number;
        let dx: number;
        let dy: number;
        do {
          [x1, y1, dx, dy] = [rng.nonZero(-8, 8), rng.int(-8, 8), rng.nonZero(-6, 6), rng.nonZero(-8, 8)];
        } while (dx === dy);
        const [x2, y2] = [x1 + dx, y1 + dy];
        const m = Q.of(dy, dx);
        const answer = ps(m, x1, y1);
        const slope = `m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${dy}}{${dx}} = ${num(m)}`;
        const check = `${num(y2)} - ${paren(y1)} = ${num(m)}(${num(x2)} - ${paren(x1)})`;
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$, in point-slope form.`,
              `写出过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的点斜式方程。`,
            ),
            answer,
            form: "point-slope",
            wrong: [ps(Q.of(dx, dy), x1, y1), ps(m.neg(), x1, y1), ps(m, -x1, -y1)],
            solution: t(
              `**Step 1: the slope.** From $${pointLatex([x1, y1])}$ to $${pointLatex([x2, y2])}$, the run is $${dx}$ and the rise is $${dy}$:

{{figure 0}}

${steps(slope)}**Step 2: the equation.** Use the point $${pointLatex([x1, y1])}$, so $x_1 = ${x1}$ and $y_1 = ${y1}$, in $y - y_1 = m(x - x_1)$:${steps(answer)}{{figure 1}}

**Check.** The other point must satisfy the equation too. With $x = ${x2}$ and $y = ${y2}$: $${check}$, that is $${dy} = ${dy}$.`,
              `**第一步：求斜率。** 从 $${pointLatex([x1, y1])}$ 到 $${pointLatex([x2, y2])}$，水平变化 $${dx}$，竖直变化 $${dy}$：

{{figure 0}}

${steps(slope)}**第二步：写方程。** 用点 $${pointLatex([x1, y1])}$，即 $x_1 = ${x1}$，$y_1 = ${y1}$，代入 $y - y_1 = m(x - x_1)$：${steps(answer)}{{figure 1}}

**检验。** 另一个点也必须满足方程。代入 $x = ${x2}$，$y = ${y2}$：$${check}$，即 $${dy} = ${dy}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              snugView([
                [x1, y1],
                [x2, y2],
              ]),
              [
                ...riseRun([x1, y1], [x2, y2]),
                { kind: "point", at: [x1, y1], label: at([x1, y1]), dir: away([x1, y1], [x2, y2]), accent: true },
                { kind: "point", at: [x2, y2], label: at([x2, y2]), dir: away([x2, y2], [x1, y1]) },
              ],
              `From ${at([x1, y1])} to ${at([x2, y2])}: a run of ${dx} and a rise of ${dy}.`,
              `从 ${at([x1, y1])} 到 ${at([x2, y2])}：水平变化 ${dx}，竖直变化 ${dy}。`,
            ),
            slopeFigure(
              [x1, y1],
              [x2, y2],
              `The line through both points, with slope ${plain(m)}.`,
              `经过两点、斜率为 ${plain(m)} 的直线。`,
              true,
            ),
          ],
        };
      },
    },
    {
      id: "converting-to-slope-intercept",
      title: t("From point-slope to slope-intercept form", "由点斜式化为斜截式"),
      explanation: t(
        `Point-slope form is quick to write, but slope-intercept form shows more at a glance: the $y$-intercept, where the line crosses the $y$-axis. To convert, solve the equation for $y$ in two steps:

1. **Distribute** the slope over the parentheses.
2. **Move the constant** from the left side to the right, by doing the opposite operation on both sides.

For $y + 4 = -2(x - 3)$:

$$y + 4 = -2x + 6 \\qquad (\\text{distribute: } -2 \\cdot x = -2x, -2 \\cdot (-3) = 6)$$

$$y = -2x + 2 \\qquad (\\text{subtract } 4 \\text{ from both sides})$$

The slope $-2$ is unchanged, and now the $y$-intercept, $2$, can be read off.

> **Watch out.** The slope multiplies **both** terms in the parentheses: $-2(x - 3)$ is $-2x + 6$, not $-2x - 3$. And the constant on the left moves with the opposite sign: $+4$ on the left becomes $-4$ on the right.`,
        `点斜式写起来快，但斜截式能一眼看出更多信息：$y$ 轴截距，也就是直线与 $y$ 轴的交点。转化时分两步解出 $y$：

1. 用分配律**展开**括号。
2. 在两边做相反的运算，把左边的常数**移到**右边。

对 $y + 4 = -2(x - 3)$：

$$y + 4 = -2x + 6 \\qquad (\\text{展开：} -2 \\cdot x = -2x, -2 \\cdot (-3) = 6)$$

$$y = -2x + 2 \\qquad (\\text{两边同时减去 } 4)$$

斜率 $-2$ 不变，现在可以读出 $y$ 轴截距 $2$。

> **注意。** 斜率要乘括号里的**每一项**：$-2(x - 3)$ 是 $-2x + 6$，不是 $-2x - 3$。左边的常数移到右边要变号：左边的 $+4$ 到右边成为 $-4$。`,
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const m = pickSlopeNotOne(rng, 0.3);
        const h = Number(m.d) * rng.nonZero(-4, 4);
        const k = rng.nonZero(-9, 9);
        const mh = m.mul(Q.of(h));
        const b = Q.of(k).sub(mh);
        const answer = si(m, b);
        const distributed = `${linear(1, -k, "y")} = ${linear(m, mh.neg())}`;
        const move =
          k > 0 ? [`add $${k}$ to both sides`, `两边同时加上 $${k}$`] : [`subtract $${-k}$ from both sides`, `两边同时减去 $${-k}$`];
        return equationProblem({
          prompt: t(`Write $${ps(m, h, k)}$ in slope-intercept form.`, `把 $${ps(m, h, k)}$ 化为斜截式。`),
          answer,
          form: "slope-intercept",
          wrong: [si(m, mh.neg().sub(Q.of(k))), si(m, k - h), si(m, mh.add(Q.of(k)))],
          solution: t(
            `**Step 1: distribute.** The slope $${num(m)}$ multiplies both terms in the parentheses: $${num(m)} \\cdot x = ${linear(m, 0)}$ and $${num(m)} \\cdot ${paren(-h)} = ${num(mh.neg())}$.${steps(distributed)}**Step 2: isolate $y$.** To move $${num(-k)}$ off the left side, ${move[0]}:${steps(answer)}The slope is $${num(m)}$ and the $y$-intercept is $${num(b)}$.

**Check.** The point $${pointLatex([h, k])}$ of the original equation must lie on the new one: $${num(m)} \\cdot ${paren(h)} + ${paren(b)} = ${k}$.`,
            `**第一步：展开。** 斜率 $${num(m)}$ 乘括号里的每一项：$${num(m)} \\cdot x = ${linear(m, 0)}$，$${num(m)} \\cdot ${paren(-h)} = ${num(mh.neg())}$。${steps(distributed)}**第二步：解出 $y$。** 为了把左边的 $${num(-k)}$ 移走，${move[1]}：${steps(answer)}斜率是 $${num(m)}$，$y$ 轴截距是 $${num(b)}$。

**检验。** 原方程中的点 $${pointLatex([h, k])}$ 必须在新方程上：$${num(m)} \\cdot ${paren(h)} + ${paren(b)} = ${k}$。`,
          ),
        });
      },
    },
  ],
};

export const standardForm: TopicDef = {
  id: "standard-form",
  title: t("Equations of Lines in Standard Form", "标准式直线方程"),
  summary: t(
    "Write equations of lines in the form $Ax + By = C$, including horizontal and vertical lines.",
    "把直线方程写成 $Ax + By = C$ 的形式，包括水平和竖直的直线。",
  ),
  prerequisites: ["point-slope-form", "equations-with-variables-on-both-sides"],
  encompasses: [{ topic: "slope-of-a-line", weight: 0.3 }],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.HSA.CED.A.4"],
  intro: t(
    `Slope-intercept form, $y = mx + b$, and point-slope form, $y - y_1 = m(x - x_1)$, both need a slope. A vertical line has none, so neither form can describe it. There is a form that covers every line, and it often comes straight out of a problem: a ticket costs $2$ for a child and $3$ for an adult, and the tickets sold brought in $12$. With $x$ children and $y$ adults,

$$2x + 3y = 12.$$

This is a line: solving for $y$ gives $y = -\\frac{2}{3}x + 4$. Written the first way, the two variables sit together on the left and the constant on the right. That is **standard form**,

$$Ax + By = C,$$

with whole numbers $A$, $B$ and $C$. A vertical line such as $x = 3$ fits it too, as $1x + 0y = 3$. In this lesson we convert lines to standard form, write horizontal and vertical lines, and write the line through two points in standard form.`,
    `斜截式 $y = mx + b$ 和点斜式 $y - y_1 = m(x - x_1)$ 都需要斜率。竖直的直线没有斜率，所以这两种形式都描述不了它。有一种形式适用于所有直线，而且常常直接从问题中得出：儿童票每张 $2$ 元，成人票每张 $3$ 元，卖票共收入 $12$ 元。设儿童票 $x$ 张、成人票 $y$ 张，则

$$2x + 3y = 12.$$

这是一条直线：对 $y$ 求解得 $y = -\\frac{2}{3}x + 4$。按第一种写法，两个变量一起在左边，常数在右边。这就是**标准式**

$$Ax + By = C,$$

其中 $A$、$B$、$C$ 是整数。像 $x = 3$ 这样的竖直直线也符合它，即 $1x + 0y = 3$。这节课我们把直线化为标准式，写出水平和竖直的直线，并写出过两点的直线的标准式。`,
  ),
  knowledgePoints: [
    {
      id: "from-slope-intercept-to-standard",
      title: t("Converting to standard form", "化为标准式"),
      explanation: t(
        `The **standard form** of a line is

$$Ax + By = C,$$

with integers $A$, $B$ and $C$ that have no common factor, and $A > 0$ (or $A = 0$ and $B > 0$). These rules make the form unique: each line has exactly one way to be written, so two people's answers can be compared.

To convert $y = \\frac{2}{3}x - 4$, do the same operation on both sides each time:

1. Bring the $x$-term to the left by subtracting $\\frac{2}{3}x$: $-\\frac{2}{3}x + y = -4$.
2. Multiply every term by $3$ to clear the fraction: $-2x + 3y = -12$.
3. Multiply every term by $-1$ to make $A$ positive: $2x - 3y = 12$.

Steps 2 and 3 can be done at once, multiplying by $-3$.

> **Watch out.** Multiply **every** term, the constant on the right included: multiplying $-\\frac{2}{3}x + y = -4$ by $3$ gives $-12$ on the right, not $-4$. And when you multiply by a negative number, every sign changes, not only the sign of $A$.`,
        `直线的**标准式**是

$$Ax + By = C,$$

其中 $A$、$B$、$C$ 是没有公因数的整数，且 $A > 0$（或 $A = 0$ 且 $B > 0$）。这些规定使写法唯一：每条直线只有一种写法，两个人的答案才能直接比较。

化 $y = \\frac{2}{3}x - 4$ 为标准式，每一步都在两边做同样的运算：

1. 两边减去 $\\frac{2}{3}x$，把含 $x$ 的项移到左边：$-\\frac{2}{3}x + y = -4$。
2. 每一项乘以 $3$ 去分母：$-2x + 3y = -12$。
3. 每一项乘以 $-1$，使 $A$ 为正：$2x - 3y = 12$。

第 2、3 步可以合成一步，乘以 $-3$。

> **注意。** **每一项**都要乘，包括右边的常数：$-\\frac{2}{3}x + y = -4$ 乘以 $3$，右边得 $-12$，不是 $-4$。乘以负数时，所有符号都会改变，不只是 $A$ 的符号。`,
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const b = Q.of(rng.int(-9, 9), rng.bool(0.3) ? m.d : 1n);
        const [A, B, C] = standardOf(m.neg(), 1, b);
        const answer = std(A, B, C);
        const moved = `${poly([m.neg(), "x"], [1, "y"])} = ${num(b)}`;
        return equationProblem({
          prompt: t(`Write $${si(m, b)}$ in standard form.`, `把 $${si(m, b)}$ 化为标准式。`),
          answer,
          form: "standard",
          wrong: [std(-A, -B, -C), std(A, B, -C), std(A, -B, C), moved],
          solution: t(
            `**Step 1: bring the $x$-term to the left.** ${m.sign() > 0 ? `Subtract $${poly([m, "x"])}$ from` : `Add $${poly([m.neg(), "x"])}$ to`} both sides: ${steps(moved)}${B === 1 ? "The coefficients are already integers without a common factor, and the coefficient of $x$ is positive, so this is standard form." : `**Step 2: scale.** Multiply every term by $${B}$${Math.abs(B) > 1 ? `: the factor $${Math.abs(B)}$ clears the denominators` : ""}${B < 0 ? `${Math.abs(B) > 1 ? ", and" : ":"} the minus sign makes the coefficient of $x$ positive` : ""}. ${steps(answer)}`}**Check.** The $y$-intercept $${pointLatex([0, b])}$ of the original line must satisfy the answer: $${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(b)} = ${C}$.`,
            `**第一步：把含 $x$ 的项移到左边。** 两边${m.sign() > 0 ? `同减 $${poly([m, "x"])}$` : `同加 $${poly([m.neg(), "x"])}$`}：${steps(moved)}${B === 1 ? "系数已经是没有公因数的整数，$x$ 的系数为正，这就是标准式。" : `**第二步：乘以适当的数。** 每一项都乘以 $${B}$：${Math.abs(B) === 1 ? "" : `因数 $${Math.abs(B)}$ 去掉分母，`}${B < 0 ? "负号使 $x$ 的系数为正" : "$x$ 的系数仍为正"}。${steps(answer)}`}**检验。** 原直线的 $y$ 轴截距点 $${pointLatex([0, b])}$ 必须满足答案：$${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(b)} = ${C}$。`,
          ),
        });
      },
    },
    {
      id: "horizontal-and-vertical-lines",
      title: t("Horizontal and vertical lines", "水平与竖直的直线"),
      explanation: t(
        `A **horizontal** line keeps the same height everywhere. Every point of the horizontal line through $(3, -2)$ has $y$-coordinate $-2$, whatever its $x$-coordinate, so the line is described by the single condition $y = -2$. Its slope is $0$.

A **vertical** line keeps the same position across. Every point of the vertical line through $(3, -2)$ has $x$-coordinate $3$, so its equation is $x = 3$. Its slope is undefined.

Both are in standard form: $y = -2$ is $0x + 1y = -2$ and $x = 3$ is $1x + 0y = 3$. A vertical line has no slope-intercept form.

> **Watch out.** A vertical line is $x = \\ldots$, a horizontal line is $y = \\ldots$: the equation names the coordinate that does **not** change. And use that coordinate of the point: the vertical line through $(3, -2)$ is $x = 3$, not $x = -2$.`,
        `**水平**直线处处高度相同。过 $(3, -2)$ 的水平直线上，每个点的 $y$ 坐标都是 $-2$，不管 $x$ 坐标是多少，所以这条直线由一个条件 $y = -2$ 描述。它的斜率为 $0$。

**竖直**直线处处水平位置相同。过 $(3, -2)$ 的竖直直线上，每个点的 $x$ 坐标都是 $3$，所以方程是 $x = 3$。它的斜率不存在。

它们都是标准式：$y = -2$ 即 $0x + 1y = -2$，$x = 3$ 即 $1x + 0y = 3$。竖直直线没有斜截式。

> **注意。** 竖直直线是 $x = \\ldots$，水平直线是 $y = \\ldots$：方程写出的是**不变**的那个坐标。并且要用点的那个坐标：过 $(3, -2)$ 的竖直直线是 $x = 3$，不是 $x = -2$。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const [h, k] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const vertical = rng.bool();
        const answer = vertical ? `x = ${h}` : `y = ${k}`;
        const wrong = vertical ? [`y = ${h}`, `x = ${k}`, `y = ${k}`] : [`x = ${k}`, `y = ${h}`, `x = ${h}`];
        const reason = vertical
          ? t(
              `The line is vertical through $${pointLatex([h, k])}$: it goes straight up and down, so every point of it is at the same position across, $x = ${h}$, while $y$ can be anything. The equation states just that: ${steps(answer)}**Check.** $${pointLatex([h, k])}$ has $x = ${h}$, and so does every point above or below it, such as $${pointLatex([h, k + 1])}$.`,
              `直线竖直地经过 $${pointLatex([h, k])}$：它上下延伸，所以直线上每个点的水平位置都相同，$x = ${h}$，而 $y$ 可以是任何数。方程就写出这一点：${steps(answer)}**检验。** $${pointLatex([h, k])}$ 的 $x = ${h}$，它正上方或正下方的点，比如 $${pointLatex([h, k + 1])}$，也都是 $x = ${h}$。`,
            )
          : t(
              `The line is horizontal through $${pointLatex([h, k])}$: it runs straight across, so every point of it is at the same height, $y = ${k}$, while $x$ can be anything. The equation states just that: ${steps(answer)}**Check.** $${pointLatex([h, k])}$ has $y = ${k}$, and so does every point to its left or right, such as $${pointLatex([h + 1, k])}$.`,
              `直线水平地经过 $${pointLatex([h, k])}$：它左右延伸，所以直线上每个点的高度都相同，$y = ${k}$，而 $x$ 可以是任何数。方程就写出这一点：${steps(answer)}**检验。** $${pointLatex([h, k])}$ 的 $y = ${k}$，它左边或右边的点，比如 $${pointLatex([h + 1, k])}$，也都是 $y = ${k}$。`,
            );
        if (rng.bool()) {
          return {
            ...equationProblem({
              prompt: vertical
                ? t(
                    `Write the equation of the vertical line through $${pointLatex([h, k])}$.`,
                    `写出过点 $${pointLatex([h, k])}$ 的竖直直线的方程。`,
                  )
                : t(
                    `Write the equation of the horizontal line through $${pointLatex([h, k])}$.`,
                    `写出过点 $${pointLatex([h, k])}$ 的水平直线的方程。`,
                  ),
              answer,
              form: "standard",
              wrong,
              solution: reason,
            }),
            solutionFigure: graphFigure(
              viewAround([[h, k]]),
              [
                { kind: "line", a: [h, k], b: vertical ? [h, k + 1] : [h + 1, k], tone: "result" },
                { kind: "point", at: [h, k], accent: true },
              ],
              vertical ? `The vertical line x = ${h} through ${at([h, k])}.` : `The horizontal line y = ${k} through ${at([h, k])}.`,
              vertical ? `经过 ${at([h, k])} 的竖直直线 x = ${h}。` : `经过 ${at([h, k])} 的水平直线 y = ${k}。`,
            ),
          };
        }
        return {
          ...equationProblem({
            prompt: t("Write the equation of the line shown.", "写出图中直线的方程。"),
            answer,
            form: "standard",
            wrong,
            solution: reason,
          }),
          figure: graph(
            [
              { kind: "line", a: [h, k], b: vertical ? [h, k + 1] : [h + 1, k], accent: true },
              { kind: "point", at: [h, k] },
            ],
            vertical ? "A vertical line through a marked grid point." : "A horizontal line through a marked grid point.",
            vertical ? "一条经过一个标出的网格点的竖直直线。" : "一条经过一个标出的网格点的水平直线。",
          ),
        };
      },
    },
    {
      id: "standard-form-through-two-points",
      title: t("Standard form from two points", "由两点写标准式"),
      explanation: t(
        `To write the line through two points in standard form, use what you already know and then rearrange:

1. Find the slope from the two points.
2. Write the point-slope form with one of the points.
3. Clear the fraction by multiplying both sides by the denominator of the slope, then collect the $x$- and $y$-terms on the left and the constants on the right.

Through $(2, 1)$ and $(5, -1)$: $m = \\frac{-1 - 1}{5 - 2} = -\\frac{2}{3}$, so

$$y - 1 = -\\frac{2}{3}(x - 2) \\;\\Rightarrow\\; 3y - 3 = -2x + 4 \\;\\Rightarrow\\; 2x + 3y = 7.$$

Both points satisfy the result: $2 \\cdot 2 + 3 \\cdot 1 = 7$ and $2 \\cdot 5 + 3 \\cdot (-1) = 7$.

> **Watch out.** When a term moves across the equals sign, its sign changes: $3y - 3 = -2x + 4$ becomes $2x + 3y = 7$, with $+3$ added to $4$. Keep $A$ with $x$ and $B$ with $y$; swapping them gives a different line.`,
        `要写出过两点的直线的标准式，先用已经学过的方法，再整理：

1. 由两点求斜率。
2. 用其中一点写出点斜式。
3. 两边乘以斜率的分母去分母，再把含 $x$、$y$ 的项移到左边，常数移到右边。

过 $(2, 1)$ 和 $(5, -1)$：$m = \\frac{-1 - 1}{5 - 2} = -\\frac{2}{3}$，所以

$$y - 1 = -\\frac{2}{3}(x - 2) \\;\\Rightarrow\\; 3y - 3 = -2x + 4 \\;\\Rightarrow\\; 2x + 3y = 7.$$

两点都满足结果：$2 \\cdot 2 + 3 \\cdot 1 = 7$，$2 \\cdot 5 + 3 \\cdot (-1) = 7$。

> **注意。** 一项移过等号时要变号：$3y - 3 = -2x + 4$ 变成 $2x + 3y = 7$，$+3$ 移过去加到 $4$ 上。$A$ 跟着 $x$，$B$ 跟着 $y$；对调后就是另一条直线。`,
      ),
      generate(rng) {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        do {
          [x1, y1, x2, y2] = [rng.int(-7, 7), rng.int(-7, 7), rng.int(-7, 7), rng.int(-7, 7)];
        } while (x1 === x2 || y1 === y2);
        const m = Q.of(y2 - y1, x2 - x1);
        const [A, B, C] = standardOf(y2 - y1, x1 - x2, (y2 - y1) * x1 + (x1 - x2) * y1);
        const answer = std(A, B, C);
        const [dx, dy] = [x2 - x1, y2 - y1];
        const cleared = `${coefficient(dx)}(${linear(1, -y1, "y")}) = ${coefficient(dy)}(${linear(1, -x1)})`;
        const collected = `${poly([-dy, "x"], [dx, "y"])} = ${num(dx * y1 - dy * x1)}`;
        const clear = [...new Set([cleared, collected, answer])];
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$, in standard form.`,
              `写出过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的标准式方程。`,
            ),
            answer,
            form: "standard",
            wrong: [std(A, B, -C), std(B, A, C), std(A, -B, C)],
            solution: t(
              `**Step 1: the slope.** ${steps(`m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${dy}}{${dx}}${Q.of(dy, dx).d === BigInt(Math.abs(dx)) && Math.sign(dx) > 0 ? "" : ` = ${num(m)}`}`)}**Step 2: point-slope form**, with the point $${pointLatex([x1, y1])}$: ${steps(ps(m, x1, y1))}**Step 3: rearrange.** Multiply both sides by the run $${dx}$ to clear the fraction, expand, bring the $x$-term to the left, and scale to whole numbers without a common factor and a positive coefficient of $x$: ${steps(...clear)}**Check.** The other point must satisfy the answer: $${num(A)} \\cdot ${paren(x2)} + ${paren(B)} \\cdot ${paren(y2)} = ${C}$.`,
              `**第一步：求斜率。** ${steps(`m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${dy}}{${dx}}${Q.of(dy, dx).d === BigInt(Math.abs(dx)) && Math.sign(dx) > 0 ? "" : ` = ${num(m)}`}`)}**第二步：点斜式**，用点 $${pointLatex([x1, y1])}$：${steps(ps(m, x1, y1))}**第三步：整理。** 两边乘以横向变化 $${dx}$ 去分母，展开，把含 $x$ 的项移到左边，再化为没有公因数的整数系数，并使 $x$ 的系数为正：${steps(...clear)}**检验。** 另一点必须满足答案：$${num(A)} \\cdot ${paren(x2)} + ${paren(B)} \\cdot ${paren(y2)} = ${C}$。`,
            ),
          }),
          solutionFigure: slopeFigure(
            [x1, y1],
            [x2, y2],
            `The run is ${x2 - x1} and the rise is ${y2 - y1}, so the slope is ${plain(m)}.`,
            `水平变化 ${x2 - x1}，竖直变化 ${y2 - y1}，所以斜率是 ${plain(m)}。`,
            true,
          ),
        };
      },
    },
  ],
};

export const propertiesOfLinesInStandardForm: TopicDef = {
  id: "properties-of-lines-in-standard-form",
  title: t("Properties of Lines Given in Standard Form", "标准式直线的性质"),
  summary: t("Find the intercepts and the slope of a line $Ax + By = C$.", "求直线 $Ax + By = C$ 的截距和斜率。"),
  prerequisites: ["standard-form", "properties-of-lines-in-slope-intercept-form"],
  encompasses: [{ topic: "standard-form", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.8.F.B.4", "CCSS.HSA.CED.A.4"],
  intro: t(
    `A line in standard form, $Ax + By = C$, does not show its slope or $y$-intercept the way $y = mx + b$ does. It has its own advantage: the places where the line crosses the axes come out in one step each, because on an axis one of the variables is $0$.

Take $3x - 4y = 12$. On the $x$-axis $y = 0$, which leaves $3x = 12$, so $x = 4$. On the $y$-axis $x = 0$, which leaves $-4y = 12$, so $y = -3$. Two points fix the line, and from $(0, -3)$ to $(4, 0)$ the run is $4$ and the rise $3$, so the slope is $\\frac{3}{4}$.

{{figure 0}}

In this lesson we find the intercepts of a line in standard form, read its slope from the coefficients, and write a line in standard form from its intercepts.`,
    `标准式 $Ax + By = C$ 不像 $y = mx + b$ 那样直接显示斜率和 $y$ 轴截距。但它有自己的长处：直线与坐标轴的交点各用一步就能求出，因为在坐标轴上有一个变量为 $0$。

以 $3x - 4y = 12$ 为例。在 $x$ 轴上 $y = 0$，剩下 $3x = 12$，所以 $x = 4$。在 $y$ 轴上 $x = 0$，剩下 $-4y = 12$，所以 $y = -3$。两点确定直线，从 $(0, -3)$ 到 $(4, 0)$，横向变化 $4$，纵向变化 $3$，所以斜率是 $\\frac{3}{4}$。

{{figure 0}}

这节课我们求标准式直线的截距，由系数读出斜率，并由截距写出标准式。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -2, xMax: 7, yMin: -5, yMax: 3 },
      [
        { kind: "line", a: [0, -3], b: [4, 0], accent: true },
        ...riseRun([0, -3], [4, 0]),
        { kind: "point", at: [4, 0], label: "(4, 0)", dir: "nw", tone: "result" },
        { kind: "point", at: [0, -3], label: "(0, −3)", dir: "w", tone: "result" },
      ],
      "The line 3x − 4y = 12 crosses the x-axis at (4, 0) and the y-axis at (0, −3); between them the run is 4 and the rise is 3.",
      "直线 3x − 4y = 12 与 x 轴交于 (4, 0)，与 y 轴交于 (0, −3)；两点之间横向变化 4，纵向变化 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "intercepts-from-standard-form",
      title: t("Intercepts", "截距"),
      explanation: t(
        `On the $x$-axis every point has $y = 0$, and on the $y$-axis every point has $x = 0$. In standard form, setting one variable to $0$ removes its term and leaves a one-step equation for the other. For $3x - 4y = 12$:

- $x$-intercept: set $y = 0$, so $3x = 12$ and $x = 4$; the point $(4, 0)$.
- $y$-intercept: set $x = 0$, so $-4y = 12$ and $y = -3$; the point $(0, -3)$.

> **Watch out.** Divide by the coefficient of the variable that is left: for the $x$-intercept that is $A$, the coefficient of $x$, not $B$. Write the point with the $0$ in the right place: the $x$-intercept is $(4, 0)$, not $(0, 4)$.`,
        `$x$ 轴上每个点都有 $y = 0$，$y$ 轴上每个点都有 $x = 0$。在标准式中，令一个变量为 $0$，它那一项就消失了，只剩关于另一个变量的一步方程。对于 $3x - 4y = 12$：

- 与 $x$ 轴的交点：令 $y = 0$，则 $3x = 12$，$x = 4$，即点 $(4, 0)$。
- 与 $y$ 轴的交点：令 $x = 0$，则 $-4y = 12$，$y = -3$，即点 $(0, -3)$。

> **注意。** 要除以剩下那个变量的系数：求与 $x$ 轴的交点时除以 $x$ 的系数 $A$，不是 $B$。写点时 $0$ 要放对位置：与 $x$ 轴的交点是 $(4, 0)$，不是 $(0, 4)$。`,
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const c = rng.bool(0.6) ? a * b * rng.nonZero(-2, 2) : rng.nonZero(-12, 12);
        const [A, B, C] = standardOf(a, b, c);
        const eq = std(A, B, C);
        if (rng.bool()) {
          const x0 = Q.of(C, A);
          return {
            ...pointProblem({
              prompt: t(
                `Find the $x$-intercept of the line $${eq}$, as an ordered pair.`,
                `求直线 $${eq}$ 与 $x$ 轴的交点，写成有序数对。`,
              ),
              answer: [x0, 0],
              wrong: [
                [0, x0],
                [Q.of(C, B), 0],
                [x0.neg(), 0],
              ],
              solution: t(
                `**Step 1: set $y = 0$.** The $x$-intercept is on the $x$-axis, where $y = 0$, so the $y$-term drops out.

**Step 2: solve for $x$.** ${A === 1 ? "What is left is already solved:" : `Divide both sides by $${A}$, the coefficient of $x$:`} ${steps(...(A === 1 ? [] : [`${poly([A, "x"])} = ${num(C)}`]), `x = ${num(x0)}`)}The $x$-intercept is $${pointLatex([x0, 0])}$.

**Check.** $${num(A)} \\cdot ${paren(x0)} + ${paren(B)} \\cdot 0 = ${C}$.`,
                `**第一步：令 $y = 0$。** 与 $x$ 轴的交点在 $x$ 轴上，那里 $y = 0$，所以含 $y$ 的项消失。

**第二步：解出 $x$。** ${A === 1 ? "剩下的方程已经解好了：" : `两边除以 $x$ 的系数 $${A}$：`}${steps(...(A === 1 ? [] : [`${poly([A, "x"])} = ${num(C)}`]), `x = ${num(x0)}`)}与 $x$ 轴的交点是 $${pointLatex([x0, 0])}$。

**检验。** $${num(A)} \\cdot ${paren(x0)} + ${paren(B)} \\cdot 0 = ${C}$。`,
              ),
            }),
            solutionFigure: graphFigure(
              viewAround([
                [C / A, 0],
                [0, C / B],
              ]),
              [
                { kind: "line", a: [C / A, 0], b: [0, C / B], accent: true },
                { kind: "point", at: [0, C / B] },
                { kind: "point", at: [C / A, 0], tone: "result" },
              ],
              `The line crosses the x-axis at ${plain(x0)}.`,
              `直线与 x 轴交于 ${plain(x0)}。`,
            ),
          };
        }
        const y0 = Q.of(C, B);
        return {
          ...pointProblem({
            prompt: t(`Find the $y$-intercept of the line $${eq}$, as an ordered pair.`, `求直线 $${eq}$ 与 $y$ 轴的交点，写成有序数对。`),
            answer: [0, y0],
            wrong: [
              [y0, 0],
              [0, Q.of(C, A)],
              [0, y0.neg()],
            ],
            solution: t(
              `**Step 1: set $x = 0$.** The $y$-intercept is on the $y$-axis, where $x = 0$, so the $x$-term drops out.

**Step 2: solve for $y$.** ${B === 1 ? "What is left is already solved:" : `Divide both sides by $${B}$, the coefficient of $y$:`} ${steps(...(B === 1 ? [] : [`${poly([B, "y"])} = ${num(C)}`]), `y = ${num(y0)}`)}The $y$-intercept is $${pointLatex([0, y0])}$.

**Check.** $${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(y0)} = ${C}$.`,
              `**第一步：令 $x = 0$。** 与 $y$ 轴的交点在 $y$ 轴上，那里 $x = 0$，所以含 $x$ 的项消失。

**第二步：解出 $y$。** ${B === 1 ? "剩下的方程已经解好了：" : `两边除以 $y$ 的系数 $${B}$：`}${steps(...(B === 1 ? [] : [`${poly([B, "y"])} = ${num(C)}`]), `y = ${num(y0)}`)}与 $y$ 轴的交点是 $${pointLatex([0, y0])}$。

**检验。** $${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(y0)} = ${C}$。`,
            ),
          }),
          solutionFigure: graphFigure(
            viewAround([
              [C / A, 0],
              [0, C / B],
            ]),
            [
              { kind: "line", a: [C / A, 0], b: [0, C / B], accent: true },
              { kind: "point", at: [C / A, 0] },
              { kind: "point", at: [0, C / B], tone: "result" },
            ],
            `The line crosses the y-axis at ${plain(y0)}.`,
            `直线与 y 轴交于 ${plain(y0)}。`,
          ),
        };
      },
    },
    {
      id: "slope-from-standard-form",
      title: t("The slope", "斜率"),
      explanation: t(
        `The slope of a line in standard form can be read from its coefficients without rewriting the whole equation each time. To see why, solve $Ax + By = C$ for $y$ once, with $B \\ne 0$: subtract $Ax$ from both sides, then divide by $B$:

$$By = -Ax + C \\;\\Rightarrow\\; y = -\\frac{A}{B}x + \\frac{C}{B}.$$

The coefficient of $x$ is now the slope, so

$$m = -\\frac{A}{B}.$$

For $3x - 4y = 12$: $A = 3$ and $B = -4$, so $m = -\\frac{3}{-4} = \\frac{3}{4}$.

> **Watch out.** There are two signs to handle: the minus in front of the fraction, and the signs of $A$ and $B$ themselves. Forgetting the minus gives $-\\frac{3}{4}$ here. The coefficient of $x$ goes on top: $-\\frac{B}{A}$ is a different slope.`,
        `标准式的直线方程不必每次都整个改写，也能由系数直接读出斜率。为了看清原因，把 $Ax + By = C$（$B \\ne 0$）对 $y$ 求解一次：两边减去 $Ax$，再除以 $B$：

$$By = -Ax + C \\;\\Rightarrow\\; y = -\\frac{A}{B}x + \\frac{C}{B}.$$

现在 $x$ 的系数就是斜率，所以

$$m = -\\frac{A}{B}.$$

对于 $3x - 4y = 12$：$A = 3$，$B = -4$，所以 $m = -\\frac{3}{-4} = \\frac{3}{4}$。

> **注意。** 要处理两个符号：分数前面的负号，以及 $A$、$B$ 本身的符号。忘了前面的负号，这里就会得到 $-\\frac{3}{4}$。$x$ 的系数在分子上：$-\\frac{B}{A}$ 是另一个斜率。`,
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
        const [A, B, C] = standardOf(a, b, rng.int(-15, 15));
        const m = Q.of(-A, B);
        return numberProblem({
          prompt: t(`Find the slope of the line $${std(A, B, C)}$.`, `求直线 $${std(A, B, C)}$ 的斜率。`),
          answer: m,
          wrong: [Q.of(A, B), Q.of(-B, A), Q.of(B, A)],
          solution: t(
            `**Step 1: isolate the $y$-term.** Subtract $${poly([A, "x"])}$ from both sides: ${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`)}${B === 1 ? "The coefficient of $y$ is already $1$, so this is slope-intercept form. " : `**Step 2: divide by $${B}$**, the coefficient of $y$, every term: ${steps(si(m, Q.of(C, B)))}`}The coefficient of $x$ is the slope: $m = ${num(m)}$.

**Check.** The rule $m = -\\frac{A}{B}$ gives $-\\frac{${A}}{${B}} = ${num(m)}$.`,
            `**第一步：把含 $y$ 的项单独留下。** 两边减去 $${poly([A, "x"])}$：${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`)}${B === 1 ? "$y$ 的系数已经是 $1$，这就是斜截式。" : `**第二步：每一项都除以 $y$ 的系数 $${B}$。** ${steps(si(m, Q.of(C, B)))}`}$x$ 的系数就是斜率：$m = ${num(m)}$。

**检验。** 由 $m = -\\frac{A}{B}$ 得 $-\\frac{${A}}{${B}} = ${num(m)}$。`,
          ),
        });
      },
    },
    {
      id: "standard-form-from-intercepts",
      title: t("A line from its intercepts", "由截距写方程"),
      explanation: t(
        `The two intercepts are two points of the line, so they determine it. If a line crosses the axes at $(4, 0)$ and $(0, -2)$:

1. Its slope is $\\frac{-2 - 0}{0 - 4} = \\frac{1}{2}$.
2. Its $y$-intercept is $-2$, so $y = \\frac{1}{2}x - 2$.
3. In standard form, subtract $\\frac{1}{2}x$ and multiply by $-2$: $x - 2y = 4$.

Check with the intercepts: $4 - 2 \\cdot 0 = 4$ and $0 - 2 \\cdot (-2) = 4$.

> **Watch out.** Do not copy the intercepts in as coefficients: $4x - 2y = 4$ crosses the $x$-axis at $(1, 0)$, not $(4, 0)$. Work out the slope, then check both intercepts in the final equation.`,
        `两个截距点是直线上的两个点，所以它们确定直线。若直线与坐标轴交于 $(4, 0)$ 和 $(0, -2)$：

1. 斜率是 $\\frac{-2 - 0}{0 - 4} = \\frac{1}{2}$。
2. $y$ 轴截距是 $-2$，所以 $y = \\frac{1}{2}x - 2$。
3. 化为标准式：两边减去 $\\frac{1}{2}x$，再乘以 $-2$：$x - 2y = 4$。

用截距检验：$4 - 2 \\cdot 0 = 4$，$0 - 2 \\cdot (-2) = 4$。

> **注意。** 不要把截距直接抄成系数：$4x - 2y = 4$ 与 $x$ 轴的交点是 $(1, 0)$，不对。先求斜率，再把两个截距点都代入最后的方程检验。`,
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const [A, B, C] = standardOf(b, a, a * b);
        const answer = std(A, B, C);
        const m = Q.of(-b, a);
        return annotate(
          {
            ...equationProblem({
              prompt: t("Write the equation of the line shown, in standard form.", "写出图中直线的标准式方程。"),
              answer,
              form: "standard",
              wrong: [std(...standardOf(a, b, a * b)), std(...standardOf(b, a, -a * b)), std(...standardOf(b, -a, a * b))],
              solution: t(
                `**Step 1: the intercepts.** The line crosses the $x$-axis at $${pointLatex([a, 0])}$ and the $y$-axis at $${pointLatex([0, b])}$.

**Step 2: the slope.** ${steps(`m = \\frac{${b} - 0}{0 - ${paren(a)}} = ${num(m)}`)}With the $y$-intercept $${b}$, the line is $${si(m, b)}$.

**Step 3: standard form.** Bring the $x$-term to the left and scale to whole numbers without a common factor, with a positive coefficient of $x$: ${steps(answer)}**Check.** Both intercepts satisfy it: $${num(A)} \\cdot ${paren(a)} + ${paren(B)} \\cdot 0 = ${C}$ and $${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(b)} = ${C}$.`,
                `**第一步：截距。** 直线与 $x$ 轴交于 $${pointLatex([a, 0])}$，与 $y$ 轴交于 $${pointLatex([0, b])}$。

**第二步：斜率。** ${steps(`m = \\frac{${b} - 0}{0 - ${paren(a)}} = ${num(m)}`)}$y$ 轴截距是 $${b}$，所以直线为 $${si(m, b)}$。

**第三步：化为标准式。** 把含 $x$ 的项移到左边，化为没有公因数的整数系数，并使 $x$ 的系数为正：${steps(answer)}**检验。** 两个截距点都满足：$${num(A)} \\cdot ${paren(a)} + ${paren(B)} \\cdot 0 = ${C}$，$${num(A)} \\cdot 0 + ${paren(B)} \\cdot ${paren(b)} = ${C}$。`,
              ),
            }),
            figure: graph(
              [
                { kind: "line", a: [a, 0], b: [0, b], accent: true },
                { kind: "point", at: [a, 0] },
                { kind: "point", at: [0, b] },
              ],
              `A line crossing the x-axis at (${a}, 0) and the y-axis at (0, ${b}).`,
              `一条与 x 轴交于 (${a}, 0)、与 y 轴交于 (0, ${b}) 的直线。`,
            ),
          },
          view,
          riseRun([a, 0], [0, b]),
          `From the x-intercept ${a} to the y-intercept ${b}, the slope is ${plain(m)}.`,
          `从 x 轴截距 ${a} 到 y 轴截距 ${b}，斜率是 ${plain(m)}。`,
        );
      },
    },
  ],
};

// ─── Parallel and perpendicular lines ───────────────────────────────────────

/** pickSteepSlope draws a slope with |m| ≠ 1, so that m, −m, 1/m and −1/m differ. */
function pickSteepSlope(rng: Rng): Q {
  return rng.bool(0.5) ? Q.of(rng.sign() * rng.int(2, 5)) : rng.pick(fracSlopes.filter((q) => q.n !== 1n && q.n !== -1n));
}

/** lineIn writes the line y = mx + b in slope-intercept or standard form. */
const lineIn = (m: Q, b: Coefficient, standard: boolean) => (standard ? stdOfLine(m, b) : si(m, b));

/** slopeReading says how the slope of the line y = mx + b, as lineIn writes it, is read off the equation. */
function slopeReading(m: Q, b: Coefficient, standard: boolean): Text {
  const eq = lineIn(m, b, standard);
  if (!standard)
    return t(
      `$${eq}$ is in slope-intercept form, so its slope is the coefficient of $x$, $${num(m)}$`,
      `$${eq}$ 是斜截式，斜率就是 $x$ 的系数 $${num(m)}$`,
    );
  const [A, B] = standardOf(m.neg(), 1, b);
  return t(
    `$${eq}$ is in standard form, so its slope is $-\\frac{A}{B} = -\\frac{${A}}{${B}} = ${num(m)}$`,
    `$${eq}$ 是标准式，斜率为 $-\\frac{A}{B} = -\\frac{${A}}{${B}} = ${num(m)}$`,
  );
}

export const parallelLinesInTheCoordinatePlane: TopicDef = {
  id: "parallel-lines-in-the-coordinate-plane",
  title: t("Parallel Lines in the Coordinate Plane", "坐标平面中的平行线"),
  summary: t(
    "Recognize parallel lines by their slopes, and write the equation of a parallel line.",
    "由斜率识别平行线，写出平行线的方程。",
  ),
  prerequisites: ["properties-of-lines-in-standard-form"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5"],
  intro: t(
    `Two lines in a plane either cross or never meet. Slopes tell which. Take $y = 2x + 1$ and $y = 2x - 3$. Both rise $2$ for every step of $1$ to the right, so as we move along them, they climb at exactly the same rate. The first starts $4$ higher on the $y$-axis, and since neither ever gains on the other, it stays $4$ higher everywhere:

{{figure 0}}

Lines that never meet are **parallel**. So two different lines with the same slope are parallel, and two lines with different slopes must cross somewhere, because one climbs faster than the other. In this lesson we recognize parallel lines from their equations, write the line through a point parallel to a given line, and tell parallel lines from the same line written twice and from lines that cross.`,
    `平面上的两条直线要么相交，要么永不相交。斜率能告诉我们是哪一种。看 $y = 2x + 1$ 和 $y = 2x - 3$。它们每向右走 $1$ 都上升 $2$，所以沿着它们走，两条直线以完全相同的速度上升。第一条在 $y$ 轴上起点高 $4$，而两条直线谁也追不上谁，所以它处处都高 $4$：

{{figure 0}}

永不相交的直线叫做**平行线**。所以斜率相同的两条不同直线互相平行；斜率不同的两条直线一定会在某处相交，因为一条比另一条上升得快。这节课我们由方程识别平行线，写出过一点且与已知直线平行的直线，并区分平行线、同一条直线的两种写法和相交的直线。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "line", a: [0, 1], b: [1, 3], accent: true },
        { kind: "line", a: [0, -3], b: [1, -1], tone: "action" },
        ...riseRun([0, 1], [1, 3]),
        ...riseRun([0, -3], [1, -1]),
        { kind: "segment", a: [2, 1], b: [2, 5], dashed: true, tone: "result" },
      ],
      "The lines y = 2x + 1 and y = 2x − 3. Both have a run of 1 and a rise of 2 at each step, and the vertical gap between them is 4 everywhere.",
      "直线 y = 2x + 1 和 y = 2x − 3。两者每一步都是横向变化 1、纵向变化 2，它们之间的竖直距离处处都是 4。",
    ),
  ],
  knowledgePoints: [
    {
      id: "parallel-slopes",
      figure: gradeDrawings5["parallel-lines-in-the-coordinate-plane#parallel-slopes"],
      title: t("Parallel lines have equal slopes", "平行线的斜率相等"),
      explanation: t(
        `Two different lines are **parallel** exactly when they have the same slope (or are both vertical): they rise equally over every run, so the gap between them never changes and they never meet.

So to decide whether two lines are parallel, compare their slopes, and only their slopes. $y = 2x + 1$ and $y = 2x - 5$ are parallel. A line in standard form must have its slope worked out first, as $-\\frac{A}{B}$: $4x - 2y = 3$ has slope $-\\frac{4}{-2} = 2$, so it is parallel to them as well.

> **Watch out.** Parallel means the **same** slope, not the opposite one and not the negative reciprocal: slope $2$ and slope $-\\frac{1}{2}$ belong to perpendicular lines. Do not read the slope off a standard-form equation as the coefficient of $x$; $4x - 2y = 3$ has slope $2$, not $4$.`,
        `两条不同的直线**平行**，当且仅当它们的斜率相同（或都是竖直的）：它们在相同的横向变化下有相同的纵向变化，所以两者间的距离始终不变，永不相交。

所以判断两条直线是否平行，要比较斜率，并且只比较斜率。$y = 2x + 1$ 与 $y = 2x - 5$ 平行。标准式的直线要先求出斜率 $-\\frac{A}{B}$：$4x - 2y = 3$ 的斜率是 $-\\frac{4}{-2} = 2$，所以它也与它们平行。

> **注意。** 平行要求斜率**相同**，不是相反数，也不是负倒数：斜率 $2$ 与斜率 $-\\frac{1}{2}$ 属于互相垂直的直线。不要把标准式中 $x$ 的系数直接当作斜率；$4x - 2y = 3$ 的斜率是 $2$，不是 $4$。`,
      ),
      generate(rng) {
        const m = pickSteepSlope(rng);
        const b0 = rng.int(-9, 9);
        let bc = rng.nonZero(-9, 9);
        if (bc === b0) bc = b0 === 9 ? 8 : b0 + 1;
        const slopes = [m, m.neg(), Q.one.div(m), Q.one.div(m).neg()];
        const standard = rng.bool();
        const givenStandard = rng.bool();
        const options = rng.shuffle(
          slopes.map((s, i) => {
            const b = i === 0 ? bc : rng.nonZero(-9, 9);
            return { s, i, b, eq: lineIn(s, b, standard) };
          }),
        );
        const correct = options.findIndex((o) => o.i === 0);
        const given = lineIn(m, b0, givenStandard);
        return choiceProblem({
          prompt: t(`Which line is parallel to $${given}$?`, `哪条直线与 $${given}$ 平行？`),
          options: options.map((o) => same(`$${o.eq}$`)),
          correct,
          solution: t(
            `**Step 1: the given slope.** Parallel lines have equal slopes, so start with the slope of the given line: ${slopeReading(m, b0, givenStandard).en}.

**Step 2: the slopes of the options.** ${options.map((o) => slopeReading(o.s, o.b, standard).en).join("; ")}.

Only $${options[correct]!.eq}$ has slope $${num(m)}$, and it crosses the $y$-axis at $${bc}$ rather than $${b0}$, so it is a different line with the same slope: it is parallel.

**Check.** The other slopes are $${num(m.neg())}$, $${num(Q.one.div(m))}$ and $${num(Q.one.div(m).neg())}$, none equal to $${num(m)}$, so those lines cross the given one.`,
            `**第一步：已知直线的斜率。** 平行线的斜率相等，所以先求已知直线的斜率：${slopeReading(m, b0, givenStandard)["zh-CN"]}。

**第二步：各选项的斜率。** ${options.map((o) => slopeReading(o.s, o.b, standard)["zh-CN"]).join("；")}。

只有 $${options[correct]!.eq}$ 的斜率是 $${num(m)}$，而且它与 $y$ 轴交于 $${bc}$ 而不是 $${b0}$，所以它是斜率相同的另一条直线：与已知直线平行。

**检验。** 其他斜率是 $${num(m.neg())}$、$${num(Q.one.div(m))}$ 和 $${num(Q.one.div(m).neg())}$，都不等于 $${num(m)}$，所以那些直线都与已知直线相交。`,
          ),
        });
      },
    },
    {
      id: "parallel-line-through-a-point",
      figure: gradeDrawings5["parallel-lines-in-the-coordinate-plane#parallel-line-through-a-point"],
      title: t("A parallel line through a point", "过一点作平行线"),
      explanation: t(
        `A line parallel to a given line has the **same slope**, so only its $y$-intercept is unknown. The point it must pass through decides that intercept: its coordinates have to satisfy $y = mx + b$.

The line through $(4, -1)$ parallel to $y = \\frac{1}{2}x + 3$ has slope $\\frac{1}{2}$. Substitute $x = 4$ and $y = -1$ and solve for $b$:

$$-1 = \\frac{1}{2} \\cdot 4 + b \\;\\Rightarrow\\; -1 = 2 + b \\;\\Rightarrow\\; b = -3,$$

so the line is $y = \\frac{1}{2}x - 3$. Its intercept differs from $3$, as it must: a parallel line is a different line.

> **Watch out.** The point is not the $y$-intercept: $(4, -1)$ does not make $b = -1$. And keep the slope exactly as it is; taking the negative reciprocal gives a perpendicular line instead.`,
        `与已知直线平行的直线**斜率相同**，所以只有 $y$ 轴截距未知。它必须经过的点决定了这个截距：点的坐标要满足 $y = mx + b$。

过 $(4, -1)$ 且与 $y = \\frac{1}{2}x + 3$ 平行的直线，斜率是 $\\frac{1}{2}$。代入 $x = 4$，$y = -1$，解出 $b$：

$$-1 = \\frac{1}{2} \\cdot 4 + b \\;\\Rightarrow\\; -1 = 2 + b \\;\\Rightarrow\\; b = -3,$$

所以直线为 $y = \\frac{1}{2}x - 3$。它的截距与 $3$ 不同，这是必然的：平行线是另一条直线。

> **注意。** 这个点不是 $y$ 轴截距点：$(4, -1)$ 并不意味着 $b = -1$。斜率要保持原样；取负倒数得到的是垂线。`,
      ),
      keyPrerequisites: ["point-slope-form"],
      generate(rng) {
        let m: Q;
        let b0: number;
        let h: number;
        let k: number;
        let b: Q;
        do {
          m = pickSlope(rng);
          b0 = rng.int(-9, 9);
          h = Number(m.d) * rng.nonZero(-3, 3);
          k = rng.int(-9, 9);
          b = Q.of(k).sub(m.mul(Q.of(h)));
        } while (b.eq(Q.of(b0)));
        const givenStandard = rng.bool();
        const given = lineIn(m, b0, givenStandard);
        const mh = m.mul(Q.of(h));
        const answer = si(m, b);
        const perp = Q.one.div(m).neg();
        return {
          ...equationProblem({
            prompt: t(
              `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ parallel to $${given}$.`,
              `写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 平行的直线的斜截式方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [si(m, k), si(perp, Q.of(k).sub(perp.mul(Q.of(h)))), si(m, Q.of(k).add(m.mul(Q.of(h)))), si(m, b0)],
            solution: t(
              `**Step 1: the slope.** ${slopeReading(m, b0, givenStandard).en}. A parallel line has the same slope, $${num(m)}$.

**Step 2: the $y$-intercept.** The line must pass through $${pointLatex([h, k])}$, so $x = ${h}$ and $y = ${k}$ satisfy $y = ${poly([m, "x"])} + b$. Multiply, then move $${num(mh)}$ to the other side: ${steps(...new Set([`${num(k)} = ${num(m)} \\cdot ${paren(h)} + b`, `${num(k)} = ${num(mh)} + b`, `b = ${num(b)}`]))}So the line is $${answer}$.

**Check.** $${evalAt(m, h, b)} = ${k}$, so the point is on it, and its $y$-intercept $${num(b)}$ differs from $${b0}$, so it is a different line with the same slope.`,
              `**第一步：斜率。** ${slopeReading(m, b0, givenStandard)["zh-CN"]}。平行线的斜率相同，为 $${num(m)}$。

**第二步：$y$ 轴截距。** 直线必须经过 $${pointLatex([h, k])}$，所以 $x = ${h}$，$y = ${k}$ 满足 $y = ${poly([m, "x"])} + b$。先算乘法，再把 $${num(mh)}$ 移到另一边：${steps(...new Set([`${num(k)} = ${num(m)} \\cdot ${paren(h)} + b`, `${num(k)} = ${num(mh)} + b`, `b = ${num(b)}`]))}所以直线为 $${answer}$。

**检验。** $${evalAt(m, h, b)} = ${k}$，所以点在直线上；它的 $y$ 轴截距 $${num(b)}$ 与 $${b0}$ 不同，所以是斜率相同的另一条直线。`,
            ),
          }),
          solutionFigure: graphFigure(
            viewAround([
              [h, k],
              [0, b0],
            ]),
            [
              { kind: "line", a: [0, b0], b: riseOf([0, b0], m), accent: true },
              { kind: "line", a: [h, k], b: riseOf([h, k], m), tone: "result" },
              { kind: "point", at: [h, k], tone: "result" },
            ],
            `The new line has the same slope, ${plain(m)}, and passes through ${at([h, k])}.`,
            `新直线斜率相同，都是 ${plain(m)}，并经过 ${at([h, k])}。`,
          ),
        };
      },
    },
    {
      id: "parallel-same-or-intersecting",
      figure: gradeDrawings5["parallel-lines-in-the-coordinate-plane#parallel-same-or-intersecting"],
      title: t("Parallel, the same line, or intersecting", "平行、重合还是相交"),
      explanation: t(
        `Two equations can describe lines that cross, lines that never meet, or one and the same line. To tell which, write both in slope-intercept form, where the slope and the $y$-intercept can be compared:

- Different slopes: the lines **intersect** in one point.
- Same slope, different $y$-intercepts: the lines are **parallel**.
- Same slope and same $y$-intercept: the equations describe **the same line**.

For example, $6x - 2y = 2$ gives $-2y = -6x + 2$, so $y = 3x - 1$: it is the same line as $y = 3x - 1$, written with every term doubled and rearranged.

> **Watch out.** Equal slopes do not by themselves make lines parallel: compare the intercepts too, since a multiple of an equation, such as $6x - 2y = 2$ for $3x - y = 1$, is the same line. And solve for $y$ fully before comparing, dividing every term by the coefficient of $y$.`,
        `两个方程表示的直线可能相交，可能永不相交，也可能是同一条直线。要判断是哪种，把两个方程都化为斜截式，比较斜率和 $y$ 轴截距：

- 斜率不同：两直线**相交**于一点。
- 斜率相同、$y$ 轴截距不同：两直线**平行**。
- 斜率和 $y$ 轴截距都相同：两个方程表示**同一条直线**。

例如，由 $6x - 2y = 2$ 得 $-2y = -6x + 2$，所以 $y = 3x - 1$：它与 $y = 3x - 1$ 是同一条直线，只是每一项都乘了 $2$ 又移了项。

> **注意。** 斜率相等本身并不说明平行：还要比较截距，因为一个方程的倍数，比如 $3x - y = 1$ 的倍数 $6x - 2y = 2$，表示的是同一条直线。比较之前要把 $y$ 完全解出来，每一项都除以 $y$ 的系数。`,
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const b = rng.int(-6, 6);
        const [A, B, C] = standardOf(m.neg(), 1, b);
        const kind = rng.int(0, 2);
        const k = rng.pick([-3, -2, -1, 2, 3]);
        let line2: Lin;
        if (kind === 0) line2 = [k * A, k * B, k * C + rng.nonZero(-4, 4)];
        else if (kind === 1) line2 = [k * A, k * B, k * C];
        else {
          let m2 = pickSlope(rng);
          while (m2.eq(m)) m2 = pickSlope(rng);
          line2 = standardOf(m2.neg(), 1, rng.int(-6, 6));
        }
        const m2 = Q.of(-line2[0], line2[1]);
        const b2 = Q.of(line2[2], line2[1]);
        const verdict = [
          t(
            "The slopes are equal and the $y$-intercepts differ, so the lines are parallel.",
            "斜率相等而 $y$ 轴截距不同，所以两直线平行。",
          ),
          t(
            "The slopes and the $y$-intercepts are equal, so the equations describe the same line.",
            "斜率和 $y$ 轴截距都相等，所以两个方程表示同一条直线。",
          ),
          t("The slopes differ, so the lines intersect.", "斜率不同，所以两直线相交。"),
        ][kind]!;
        const l1 = si(m, b);
        const l2 = eqOf(line2);
        return choiceProblem({
          prompt: t(`How are the lines $${l1}$ and $${l2}$ related?`, `直线 $${l1}$ 与 $${l2}$ 是什么关系？`),
          options: [t("Parallel", "平行"), t("The same line", "同一条直线"), t("Intersecting", "相交")],
          correct: kind,
          solution: t(
            `**Step 1: the first line.** $${l1}$ has slope $${num(m)}$ and $y$-intercept $${b}$.

**Step 2: the second line.** Solve $${l2}$ for $y$, moving the $x$-term across and dividing every term by $${line2[1]}$: ${steps(...new Set([`${poly([line2[1], "y"])} = ${poly([-line2[0], "x"], [line2[2], ""])}`, si(m2, b2)]))}It has slope $${num(m2)}$ and $y$-intercept $${num(b2)}$.

${verdict.en}

**Check.** ${
              kind === 2
                ? `$${num(m)} \\ne ${num(m2)}$, so one line climbs faster than the other and they must cross once.`
                : `The first line's $y$-intercept $${pointLatex([0, b])}$ in the second equation gives $${paren(line2[0])} \\cdot 0 + ${paren(line2[1])} \\cdot ${paren(b)} = ${line2[1] * b}$, ${kind === 1 ? `which is $${line2[2]}$: the point lies on both lines` : `not $${line2[2]}$: the lines do not share that point, and with equal slopes they share none`}.`
            }`,
            `**第一步：第一条直线。** $${l1}$ 的斜率是 $${num(m)}$，$y$ 轴截距是 $${b}$。

**第二步：第二条直线。** 把 $${l2}$ 对 $y$ 求解：把含 $x$ 的项移过去，每一项除以 $${line2[1]}$：${steps(...new Set([`${poly([line2[1], "y"])} = ${poly([-line2[0], "x"], [line2[2], ""])}`, si(m2, b2)]))}它的斜率是 $${num(m2)}$，$y$ 轴截距是 $${num(b2)}$。

${verdict["zh-CN"]}

**检验。** ${
              kind === 2
                ? `$${num(m)} \\ne ${num(m2)}$，一条直线比另一条上升得快，所以它们一定相交于一点。`
                : `把第一条直线的 $y$ 轴截距点 $${pointLatex([0, b])}$ 代入第二个方程：$${paren(line2[0])} \\cdot 0 + ${paren(line2[1])} \\cdot ${paren(b)} = ${line2[1] * b}$，${kind === 1 ? `等于 $${line2[2]}$：这个点在两条直线上` : `不等于 $${line2[2]}$：两直线不共有这个点，而斜率相等，所以没有公共点`}。`
            }`,
          ),
        });
      },
    },
  ],
};

export const perpendicularLinesInTheCoordinatePlane: TopicDef = {
  id: "perpendicular-lines-in-the-coordinate-plane",
  title: t("Perpendicular Lines in the Coordinate Plane", "坐标平面中的垂线"),
  summary: t("Use negative reciprocal slopes to recognize and write perpendicular lines.", "用互为负倒数的斜率识别并写出垂线。"),
  prerequisites: ["parallel-lines-in-the-coordinate-plane"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5"],
  intro: t(
    `Parallel lines have equal slopes. Perpendicular lines, which meet at a right angle, have slopes related in another way, and a slope triangle shows how.

The line $y = \\frac{2}{3}x$ has a slope triangle with run $3$ and rise $2$. Turn the whole picture a quarter turn clockwise about the origin. The line turns into one perpendicular to it, and its triangle turns too: the run of $3$ becomes a drop of $3$, and the rise of $2$ becomes a run of $2$.

{{figure 0}}

So the turned line has slope $\\frac{-3}{2} = -\\frac{3}{2}$: the fraction is flipped and the sign changed. The two slopes multiply to $\\frac{2}{3} \\cdot \\left(-\\frac{3}{2}\\right) = -1$. In this lesson we find perpendicular slopes, write the line through a point perpendicular to a given line, and tell whether two lines are parallel, perpendicular or neither.`,
    `平行线的斜率相等。垂直的直线相交成直角，它们的斜率有另一种关系，用斜率三角形就能看出来。

直线 $y = \\frac{2}{3}x$ 的斜率三角形横向变化 $3$、纵向变化 $2$。把整个图形绕原点顺时针转四分之一圈。直线转成了与它垂直的直线，三角形也跟着转：横向的 $3$ 变成向下的 $3$，纵向的 $2$ 变成横向的 $2$。

{{figure 0}}

所以转过来的直线斜率是 $\\frac{-3}{2} = -\\frac{3}{2}$：分数颠倒，符号改变。两个斜率相乘得 $\\frac{2}{3} \\cdot \\left(-\\frac{3}{2}\\right) = -1$。这节课我们求垂线的斜率，写出过一点且与已知直线垂直的直线，并判断两条直线是平行、垂直还是都不是。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -4, xMax: 5, yMin: -4, yMax: 4 },
      [
        { kind: "line", a: [0, 0], b: [3, 2], accent: true },
        { kind: "line", a: [0, 0], b: [2, -3], tone: "result" },
        ...riseRun([0, 0], [3, 2]),
        ...riseRun([0, 0], [2, -3]),
      ],
      "The line y = (2/3)x with a run of 3 and a rise of 2, and the perpendicular line y = −(3/2)x with a run of 2 and a rise of −3.",
      "直线 y = (2/3)x，横向变化 3、纵向变化 2；与它垂直的直线 y = −(3/2)x，横向变化 2、纵向变化 −3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "perpendicular-slopes",
      figure: gradeDrawings5["perpendicular-lines-in-the-coordinate-plane#perpendicular-slopes"],
      title: t("Negative reciprocal slopes", "互为负倒数的斜率"),
      explanation: t(
        `Two lines with slopes $m_1$ and $m_2$ are **perpendicular** exactly when $m_1 m_2 = -1$, that is, when each slope is the **negative reciprocal** of the other:

$$m_2 = -\\frac{1}{m_1}.$$

The reason is the quarter turn: turning a slope triangle with run $q$ and rise $p$ by a right angle gives a triangle with run $p$ and rise $-q$, so the slope $\\frac{p}{q}$ becomes $-\\frac{q}{p}$. Two changes happen at once: the fraction flips and the sign changes.

A line perpendicular to a line of slope $\\frac{2}{3}$ has slope $-\\frac{3}{2}$; perpendicular to slope $-4$, which is $-\\frac{4}{1}$, it has slope $\\frac{1}{4}$. (A horizontal and a vertical line are perpendicular too.)

> **Watch out.** Do both steps. Changing only the sign, $\\frac{2}{3} \\to -\\frac{2}{3}$, or only flipping, $\\frac{2}{3} \\to \\frac{3}{2}$, does not give a right angle; check that the product is $-1$. Keeping the same slope gives a parallel line.`,
        `斜率为 $m_1$ 和 $m_2$ 的两条直线**垂直**，当且仅当 $m_1 m_2 = -1$，即两个斜率互为**负倒数**：

$$m_2 = -\\frac{1}{m_1}.$$

原因在于转四分之一圈：把横向变化 $q$、纵向变化 $p$ 的斜率三角形转一个直角，得到横向变化 $p$、纵向变化 $-q$ 的三角形，所以斜率 $\\frac{p}{q}$ 变成 $-\\frac{q}{p}$。两件事同时发生：分数颠倒，符号改变。

与斜率为 $\\frac{2}{3}$ 的直线垂直的直线斜率是 $-\\frac{3}{2}$；与斜率为 $-4$（即 $-\\frac{4}{1}$）的直线垂直的直线斜率是 $\\frac{1}{4}$。（水平直线与竖直直线也互相垂直。）

> **注意。** 两步都要做。只改符号 $\\frac{2}{3} \\to -\\frac{2}{3}$，或只颠倒 $\\frac{2}{3} \\to \\frac{3}{2}$，都不能得到直角；要检查乘积是否为 $-1$。保持斜率不变得到的是平行线。`,
      ),
      generate(rng) {
        const m = pickSlope(rng, 0.5);
        const b = rng.int(-9, 9);
        const standard = rng.bool();
        const given = lineIn(m, b, standard);
        const p = Q.one.div(m).neg();
        // For a positive whole slope the reciprocal is already in its final form.
        const reciprocal = `-\\frac{1}{${num(m)}}`;
        const derivation = reciprocal === num(p) ? `m_2 = ${reciprocal}` : `${reciprocal} = ${num(p)}`;
        return numberProblem({
          prompt: t(`Find the slope of a line perpendicular to $${given}$.`, `求与 $${given}$ 垂直的直线的斜率。`),
          answer: p,
          mistakes: [
            why(
              m,
              "That is the same slope, which gives a parallel line. A perpendicular slope is the negative reciprocal.",
              "这是相同的斜率，得到的是平行线。垂直直线的斜率是负倒数。",
            ),
            why(
              m.neg(),
              "You changed the sign but did not flip the fraction. A perpendicular slope is the negative reciprocal.",
              "你只改了符号，没有把分数颠倒。垂直直线的斜率是负倒数。",
            ),
            why(
              Q.one.div(m),
              "You flipped the fraction but did not change the sign. A perpendicular slope is the negative reciprocal.",
              "你把分数颠倒了，但没有改符号。垂直直线的斜率是负倒数。",
            ),
          ],
          solution: t(
            `**Step 1: the given slope.** ${slopeReading(m, b, standard).en}.

**Step 2: the negative reciprocal.** Flip the fraction and change the sign: ${steps(derivation)}**Check.** $${num(m)} \\cdot ${paren(p)} = -1$, so the lines meet at a right angle.`,
            `**第一步：已知直线的斜率。** ${slopeReading(m, b, standard)["zh-CN"]}。

**第二步：取负倒数。** 把分数颠倒，再改变符号：${steps(derivation)}**检验。** $${num(m)} \\cdot ${paren(p)} = -1$，所以两直线成直角。`,
          ),
        });
      },
    },
    {
      id: "perpendicular-line-through-a-point",
      figure: gradeDrawings5["perpendicular-lines-in-the-coordinate-plane#perpendicular-line-through-a-point"],
      title: t("A perpendicular line through a point", "过一点作垂线"),
      explanation: t(
        `A perpendicular line through a point takes two steps: first its slope, the negative reciprocal of the given slope, then its $y$-intercept, from the point.

To write the line through $(2, 5)$ perpendicular to $y = -\\frac{2}{3}x + 1$: the negative reciprocal of $-\\frac{2}{3}$ is $\\frac{3}{2}$. The point must satisfy $y = \\frac{3}{2}x + b$:

$$5 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; 5 = 3 + b \\;\\Rightarrow\\; b = 2,$$

so the line is $y = \\frac{3}{2}x + 2$. Its slope times the given slope is $\\frac{3}{2} \\cdot \\left(-\\frac{2}{3}\\right) = -1$, as it should be.

> **Watch out.** Use the **new** slope when you substitute the point, not the given one. And solve for $b$ by subtracting: $5 = 3 + b$ gives $b = 2$, not $8$.`,
        `过一点作垂线分两步：先求斜率，即已知斜率的负倒数；再由这个点求 $y$ 轴截距。

要写出过 $(2, 5)$ 且与 $y = -\\frac{2}{3}x + 1$ 垂直的直线：$-\\frac{2}{3}$ 的负倒数是 $\\frac{3}{2}$。这个点必须满足 $y = \\frac{3}{2}x + b$：

$$5 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; 5 = 3 + b \\;\\Rightarrow\\; b = 2,$$

所以直线为 $y = \\frac{3}{2}x + 2$。它的斜率乘已知斜率得 $\\frac{3}{2} \\cdot \\left(-\\frac{2}{3}\\right) = -1$，正应如此。

> **注意。** 代入点时要用**新的**斜率，不能用已知直线的斜率。求 $b$ 时要做减法：由 $5 = 3 + b$ 得 $b = 2$，不是 $8$。`,
      ),
      generate(rng) {
        const m = pickSlope(rng, 0.5);
        const p = Q.one.div(m).neg();
        const h = Number(p.d) * rng.nonZero(-3, 3);
        const k = rng.int(-9, 9);
        const b = Q.of(k).sub(p.mul(Q.of(h)));
        const b0 = rng.int(-9, 9);
        const givenStandard = rng.bool();
        const given = lineIn(m, b0, givenStandard);
        const ph = p.mul(Q.of(h));
        const answer = si(p, b);
        const inv = Q.one.div(m);
        return {
          ...equationProblem({
            prompt: t(
              `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ perpendicular to $${given}$.`,
              `写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 垂直的直线的斜截式方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [si(m, Q.of(k).sub(m.mul(Q.of(h)))), si(inv, Q.of(k).sub(inv.mul(Q.of(h)))), si(p, Q.of(k).add(p.mul(Q.of(h))))],
            solution: t(
              `**Step 1: the slope.** ${slopeReading(m, b0, givenStandard).en}. The perpendicular slope is its negative reciprocal, $${num(p)}$.

**Step 2: the $y$-intercept.** The line must pass through $${pointLatex([h, k])}$, so $x = ${h}$ and $y = ${k}$ satisfy $y = ${poly([p, "x"])} + b$. Multiply, then move $${num(ph)}$ to the other side: ${steps(...new Set([`${num(k)} = ${num(p)} \\cdot ${paren(h)} + b`, `${num(k)} = ${num(ph)} + b`, `b = ${num(b)}`]))}So the line is $${answer}$.

**Check.** $${evalAt(p, h, b)} = ${k}$, so the point is on it, and $${num(m)} \\cdot ${paren(p)} = -1$, so it is perpendicular to the given line.`,
              `**第一步：斜率。** ${slopeReading(m, b0, givenStandard)["zh-CN"]}。垂线的斜率是它的负倒数 $${num(p)}$。

**第二步：$y$ 轴截距。** 直线必须经过 $${pointLatex([h, k])}$，所以 $x = ${h}$，$y = ${k}$ 满足 $y = ${poly([p, "x"])} + b$。先算乘法，再把 $${num(ph)}$ 移到另一边：${steps(...new Set([`${num(k)} = ${num(p)} \\cdot ${paren(h)} + b`, `${num(k)} = ${num(ph)} + b`, `b = ${num(b)}`]))}所以直线为 $${answer}$。

**检验。** $${evalAt(p, h, b)} = ${k}$，所以点在直线上；$${num(m)} \\cdot ${paren(p)} = -1$，所以它与已知直线垂直。`,
            ),
          }),
          solutionFigure: graphFigure(
            viewAround([
              [h, k],
              [0, b0],
            ]),
            [
              { kind: "line", a: [0, b0], b: riseOf([0, b0], m), accent: true },
              { kind: "line", a: [h, k], b: riseOf([h, k], p), tone: "result" },
              { kind: "point", at: [h, k], tone: "result" },
            ],
            `The new line has slope ${plain(p)}, perpendicular to slope ${plain(m)}, and passes through ${at([h, k])}.`,
            `新直线斜率为 ${plain(p)}，与斜率 ${plain(m)} 垂直，并经过 ${at([h, k])}。`,
          ),
        };
      },
    },
    {
      id: "parallel-perpendicular-or-neither",
      figure: gradeDrawings5["perpendicular-lines-in-the-coordinate-plane#parallel-perpendicular-or-neither"],
      title: t("Parallel, perpendicular or neither", "平行、垂直还是都不是"),
      explanation: t(
        `To classify two lines, find both slopes, solving for $y$ when a line is in standard form, then compare them:

- equal slopes: the lines are parallel (or the same line);
- slopes whose product is $-1$: the lines are perpendicular;
- anything else: the lines are neither.

For example, $y = -2x + 1$ has slope $-2$, and $x - 2y = 6$ gives $y = \\frac{1}{2}x - 3$, slope $\\frac{1}{2}$. The product is $-2 \\cdot \\frac{1}{2} = -1$: they are perpendicular.

> **Watch out.** Opposite slopes, such as $2$ and $-2$, are not perpendicular, and reciprocal slopes, such as $2$ and $\\frac{1}{2}$, are not either: test the product, which must be exactly $-1$.`,
        `判断两条直线的关系，先求出两个斜率（标准式要先对 $y$ 求解），再比较：

- 斜率相等：两直线平行（或重合）；
- 斜率之积为 $-1$：两直线垂直；
- 其他情况：既不平行也不垂直。

例如，$y = -2x + 1$ 的斜率是 $-2$；由 $x - 2y = 6$ 得 $y = \\frac{1}{2}x - 3$，斜率是 $\\frac{1}{2}$。乘积 $-2 \\cdot \\frac{1}{2} = -1$：它们互相垂直。

> **注意。** 互为相反数的斜率，比如 $2$ 和 $-2$，不表示垂直；互为倒数的斜率，比如 $2$ 和 $\\frac{1}{2}$，也不表示垂直：要检验乘积，必须恰好是 $-1$。`,
      ),
      generate(rng) {
        const m = pickSteepSlope(rng);
        const kind = rng.int(0, 2);
        const b1 = rng.int(-8, 8);
        let b2 = rng.int(-8, 8);
        if (kind === 0 && b2 === b1) b2 = b1 === 8 ? 7 : b1 + 1;
        const perp = Q.one.div(m).neg();
        const m2 = kind === 0 ? m : kind === 1 ? perp : rng.pick([m.neg(), Q.one.div(m), m.add(Q.one)]);
        const [s1, s2] = [rng.bool(), rng.bool()];
        const [l1, l2] = [lineIn(m, b1, s1), lineIn(m2, b2, s2)];
        const verdict = [
          t("The slopes are equal, so the lines are parallel.", "斜率相等，所以两直线平行。"),
          t(
            `The product of the slopes is $${num(m.mul(m2))}$, so the lines are perpendicular.`,
            `斜率之积为 $${num(m.mul(m2))}$，所以两直线垂直。`,
          ),
          t(
            `The slopes differ and their product is $${num(m.mul(m2))}$, not $-1$, so the lines are neither parallel nor perpendicular.`,
            `斜率不同，且乘积为 $${num(m.mul(m2))}$，不是 $-1$，所以两直线既不平行也不垂直。`,
          ),
        ][kind]!;
        return choiceProblem({
          prompt: t(
            `Are the lines $${l1}$ and $${l2}$ parallel, perpendicular, or neither?`,
            `直线 $${l1}$ 与 $${l2}$ 是平行、垂直，还是都不是？`,
          ),
          options: [t("Parallel", "平行"), t("Perpendicular", "垂直"), t("Neither", "都不是")],
          correct: kind,
          solution: t(
            `**Step 1: the slopes.** ${slopeReading(m, b1, s1).en}; ${slopeReading(m2, b2, s2).en}.

**Step 2: compare them.** ${verdict.en}

**Check.** ${
              kind === 0
                ? `The $y$-intercepts are $${b1}$ and $${b2}$, so these are two different lines, not one line written twice.`
                : kind === 1
                  ? `The negative reciprocal of $${num(m)}$ is $-\\frac{1}{${num(m)}} = ${num(perp)}$, which is the second slope.`
                  : `Parallel would need slope $${num(m)}$ and perpendicular would need $${num(perp)}$; $${num(m2)}$ is neither.`
            }`,
            `**第一步：求斜率。** ${slopeReading(m, b1, s1)["zh-CN"]}；${slopeReading(m2, b2, s2)["zh-CN"]}。

**第二步：比较。** ${verdict["zh-CN"]}

**检验。** ${
              kind === 0
                ? `两者的 $y$ 轴截距是 $${b1}$ 和 $${b2}$，所以是两条不同的直线，不是同一条直线写了两次。`
                : kind === 1
                  ? `$${num(m)}$ 的负倒数是 $-\\frac{1}{${num(m)}} = ${num(perp)}$，正是第二个斜率。`
                  : `平行需要斜率 $${num(m)}$，垂直需要 $${num(perp)}$；$${num(m2)}$ 两者都不是。`
            }`,
          ),
        });
      },
    },
  ],
};

// ─── Systems of linear equations ────────────────────────────────────────────

/** smallSlopes are slopes whose lines are easy to draw through grid points. */
const smallSlopes: readonly Q[] = [-3, -2, -1, 1, 2, 3].map((n) => Q.of(n)).concat([Q.of(1, 2), Q.of(-1, 2)]);

export const systemsOfLinearEquations: TopicDef = {
  id: "systems-of-linear-equations",
  title: t("Introduction to Systems of Linear Equations", "线性方程组简介"),
  summary: t(
    "Check solutions of a system of two linear equations, and solve a system from its graph.",
    "检验二元一次方程组的解，并由图像求解方程组。",
  ),
  prerequisites: ["slope-intercept-form"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.8.EE.C.8.A", "CCSS.HSA.REI.C.6"],
  intro: t(
    `An equation such as $y = x + 1$ has many solutions, the points of its line. Often a question puts two conditions on the same two numbers at once, and then we need a pair that satisfies both equations together. Such a pair of equations is a **system**.

Take $y = x + 1$ and $y = -x + 3$. Their lines are drawn below. A point on the first line satisfies the first equation, and a point on the second line satisfies the second, so a point on both lines satisfies both: here that is the crossing point $(1, 2)$.

{{figure 0}}

Substituting confirms it: $1 + 1 = 2$ and $-1 + 3 = 2$. In this lesson we check whether a pair solves a system, and solve a system by reading where its lines cross.`,
    `像 $y = x + 1$ 这样的方程有许多解，就是它的直线上的点。很多问题同时对同样两个数提出两个条件，这时需要找一对同时满足两个方程的数。这样的一组方程叫做**方程组**。

看 $y = x + 1$ 和 $y = -x + 3$，它们的直线画在下面。第一条直线上的点满足第一个方程，第二条直线上的点满足第二个方程，所以同时在两条直线上的点两个方程都满足：这里就是交点 $(1, 2)$。

{{figure 0}}

代入可以确认：$1 + 1 = 2$，$-1 + 3 = 2$。这节课我们检验一对数是不是方程组的解，并通过读出两条直线的交点来解方程组。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 5, yMin: -2, yMax: 5 },
      [
        { kind: "line", a: [0, 1], b: [3, 4], accent: true },
        { kind: "line", a: [0, 3], b: [3, 0] },
        { kind: "point", at: [1, 2], label: "(1, 2)", dir: "n", tone: "result" },
      ],
      "The lines y = x + 1 and y = −x + 3, which cross at (1, 2).",
      "直线 y = x + 1 与 y = −x + 3，交于 (1, 2)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "checking-a-solution",
      title: t("Solutions of a system", "方程组的解"),
      explanation: t(
        `A **system of equations** is a set of equations to be satisfied at the same time. A **solution** of a system in $x$ and $y$ is an ordered pair that makes **every** equation true, so checking a pair means substituting it into each equation in turn.

$(2, -1)$ solves $\\begin{cases} x + y = 1 \\\\ 3x - y = 7 \\end{cases}$: the first equation gives $2 + (-1) = 1$, and the second gives $3 \\cdot 2 - (-1) = 6 + 1 = 7$. Both hold. The pair $(0, 1)$ also makes $x + y = 1$ true, but $3 \\cdot 0 - 1 = -1$, not $7$, so it is not a solution.

> **Watch out.** Satisfying one equation is not enough: test **both**. Put each number in its own place, $x$ first, and keep the brackets around negative numbers, since $-(-1)$ is $+1$.`,
        `**方程组**是需要同时满足的几个方程。关于 $x$ 和 $y$ 的方程组的**解**是使**每一个**方程都成立的有序数对，所以检验一对数，就是把它依次代入每一个方程。

$(2, -1)$ 是 $\\begin{cases} x + y = 1 \\\\ 3x - y = 7 \\end{cases}$ 的解：第一个方程得 $2 + (-1) = 1$，第二个方程得 $3 \\cdot 2 - (-1) = 6 + 1 = 7$，都成立。数对 $(0, 1)$ 也使 $x + y = 1$ 成立，但 $3 \\cdot 0 - 1 = -1$，不是 $7$，所以它不是解。

> **注意。** 只满足一个方程不够，**两个**都要检验。每个数放在自己的位置上，先 $x$ 后 $y$；负数要加括号，因为 $-(-1)$ 是 $+1$。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const { e1, e2, sol } = randomSystem(rng, 5);
        const yes = rng.bool();
        const step = rng.nonZero(-2, 2);
        const p: [number, number] = yes ? sol : [sol[0] + e1[1] * step, sol[1] - e1[0] * step];
        const value = (e: Lin) => e[0] * p[0] + e[1] * p[1];
        const term = (k: number, v: number) => (k === 1 ? paren(v) : k === -1 ? `-${paren(v)}` : `${num(k)} \\cdot ${paren(v)}`);
        const check = (e: Lin) => `${term(e[0], p[0])} ${e[1] < 0 ? "-" : "+"} ${term(Math.abs(e[1]), p[1])} = ${value(e)}`;
        const ok2 = value(e2) === e2[2];
        const shown = yes ? e2[2] + 1 : value(e2);
        return verdictChoice(rng, {
          prompt: t(
            `Is $${pointLatex(p)}$ a solution of the system $$${system(eqOf(e1), eqOf(e2))}$$`,
            `$${pointLatex(p)}$ 是方程组 $$${system(eqOf(e1), eqOf(e2))}$$ 的解吗？`,
          ),
          holds: yes,
          yes: t("it makes both equations true", "它使两个方程都成立"),
          no: t(`the second equation gives $${shown}$, not $${e2[2]}$`, `第二个方程得到 $${shown}$，而不是 $${e2[2]}$`),
          yesWrong: t("it makes the first equation true", "它使第一个方程成立"),
          noWrong: t(`the first equation gives $${e1[2] + 1}$, not $${e1[2]}$`, `第一个方程得到 $${e1[2] + 1}$，而不是 $${e1[2]}$`),
          solution: t(
            `**Substitute.** Put $x = ${p[0]}$ and $y = ${p[1]}$ into each equation: ${steps(check(e1), check(e2))}**Compare.** The first equation needs $${e1[2]}$ and gets it. ${ok2 ? `The second needs $${e2[2]}$ and gets it too. Both equations hold, so $${pointLatex(p)}$ is a solution.` : `The second needs $${e2[2]}$ but gets $${value(e2)}$. One equation fails, so $${pointLatex(p)}$ is not a solution.`}`,
            `**代入。** 把 $x = ${p[0]}$，$y = ${p[1]}$ 代入每个方程：${steps(check(e1), check(e2))}**比较。** 第一个方程右边是 $${e1[2]}$，成立。${ok2 ? `第二个方程右边是 $${e2[2]}$，也成立。两个方程都成立，所以 $${pointLatex(p)}$ 是解。` : `第二个方程右边是 $${e2[2]}$，却得到 $${value(e2)}$。有一个方程不成立，所以 $${pointLatex(p)}$ 不是解。`}`,
          ),
        });
      },
    },
    {
      id: "solving-by-graphing",
      figure: gradeDrawings4["systems-of-linear-equations#solving-by-graphing"],
      title: t("Solving by graphing", "图像法解方程组"),
      explanation: t(
        `Each equation of a system in $x$ and $y$ has a line as its graph. A point lies on a line exactly when it satisfies that line's equation, so a point lies on both lines exactly when it satisfies both equations. The solution of the system is therefore the **point of intersection** of the two lines.

For $y = 2x - 1$ and $y = -x + 5$, the lines cross at the grid point $(2, 3)$. Reading it off is only half the job, because a graph can be misread by a square; checking settles it: $2 \\cdot 2 - 1 = 3$ and $-2 + 5 = 3$.

> **Watch out.** The answer is where the lines cross **each other**, not where one of them crosses the $y$-axis. Write the $x$-coordinate first: across, then up or down.`,
        `关于 $x$ 和 $y$ 的方程组中，每个方程的图像都是一条直线。一个点在某条直线上，当且仅当它满足这条直线的方程；所以一个点同时在两条直线上，当且仅当它同时满足两个方程。因此方程组的解就是两直线的**交点**。

对 $y = 2x - 1$ 和 $y = -x + 5$，两直线交于格点 $(2, 3)$。读出交点只完成了一半，因为看图可能差一格；检验才能确定：$2 \\cdot 2 - 1 = 3$，$-2 + 5 = 3$。

> **注意。** 答案是两条直线**彼此**相交的点，不是其中一条与 $y$ 轴的交点。先写 $x$ 坐标：先横向，再上下。`,
      ),
      generate(rng) {
        let x0: number;
        let y0: number;
        let m1: Q;
        let m2: Q;
        do {
          [x0, y0] = [rng.int(-4, 4), rng.int(-4, 4)];
          [m1, m2] = rng.sample(smallSlopes, 2) as [Q, Q];
        } while ((m1.d !== 1n || m2.d !== 1n) && x0 % 2 !== 0);
        const b1 = Q.of(y0).sub(m1.mul(Q.of(x0)));
        const b2 = Q.of(y0).sub(m2.mul(Q.of(x0)));
        const [l1, l2] = [si(m1, b1), si(m2, b2)];
        return annotate(
          {
            ...pointProblem({
              prompt: t(
                `The graphs of the equations of the system $$${system(l1, l2)}$$ are shown. Solve the system.`,
                `图中是方程组 $$${system(l1, l2)}$$ 中两个方程的图像。解这个方程组。`,
              ),
              answer: [x0, y0],
              wrong: [
                [y0, x0],
                [0, b1],
                [0, b2],
              ],
              solution: t(
                `**Read the intersection.** Follow the two lines to the point where they cross. ${x0 === 0 && y0 === 0 ? "They cross at the origin" : `From the origin it is ${x0 === 0 ? "straight" : `$${Math.abs(x0)}$ ${x0 < 0 ? "to the left" : "to the right"}${y0 === 0 ? "" : " and"}`}${y0 === 0 ? ", on the $x$-axis" : ` $${Math.abs(y0)}$ ${y0 < 0 ? "down" : "up"}`}`}, so it is $${pointLatex([x0, y0])}$.

**Check.** Substitute $x = ${x0}$ into both equations: $${evalAt(m1, x0, b1)} = ${y0}$ and $${evalAt(m2, x0, b2)} = ${y0}$. Both give $y = ${y0}$, so the point is on both lines and the solution is $${pointLatex([x0, y0])}$.`,
                `**读出交点。** 沿两条直线找到它们相交的点。${x0 === 0 && y0 === 0 ? "它们交于原点" : `从原点出发${x0 === 0 ? "" : `向${x0 < 0 ? "左" : "右"} $${Math.abs(x0)}$`}${x0 !== 0 && y0 !== 0 ? "、" : ""}${y0 === 0 ? "，在 $x$ 轴上" : `向${y0 < 0 ? "下" : "上"} $${Math.abs(y0)}$`}`}，所以交点是 $${pointLatex([x0, y0])}$。

**检验。** 把 $x = ${x0}$ 代入两个方程：$${evalAt(m1, x0, b1)} = ${y0}$，$${evalAt(m2, x0, b2)} = ${y0}$。都得到 $y = ${y0}$，所以这个点在两条直线上，方程组的解是 $${pointLatex([x0, y0])}$。`,
              ),
            }),
            figure: graph(
              [lineMark(m1, b1), lineMark(m2, b2, false)],
              `The lines ${plainLine(m1, b1)} and ${plainLine(m2, b2)}.`,
              `直线 ${plainLine(m1, b1)} 与 ${plainLine(m2, b2)}。`,
            ),
          },
          view,
          guides([x0, y0], at([x0, y0])),
          `The lines cross at ${at([x0, y0])}.`,
          `两直线交于 ${at([x0, y0])}。`,
        );
      },
    },
  ],
};

/** opposedSystem draws a system whose eliminated variable has opposite (add) or equal (subtract) coefficients. */
function opposedSystem(rng: Rng, add: boolean): { e1: Lin; e2: Lin; elim: 0 | 1; sol: [number, number] } {
  const elim: 0 | 1 = rng.bool() ? 1 : 0;
  let u: number;
  let v1: number;
  let v2: number;
  do {
    [u, v1, v2] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
  } while (add ? v1 + v2 === 0 : v1 === v2);
  const u2 = add ? -u : u;
  const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
  const make = (ue: number, ve: number): Lin => {
    const [a, b] = elim === 0 ? [ue, ve] : [ve, ue];
    return [a, b, a * x + b * y];
  };
  return { e1: make(u, v1), e2: make(u2, v2), elim, sol: [x, y] };
}

/** signSlip is the solution obtained by combining the constants with the wrong operation. */
function signSlip(e1: Lin, e2: Lin, elim: 0 | 1, add: boolean): [Q, Q] | undefined {
  const keep = 1 - elim;
  const k = add ? e1[keep]! + e2[keep]! : e1[keep]! - e2[keep]!;
  const r = add ? e1[2] - e2[2] : e1[2] + e2[2];
  if (k === 0) return undefined;
  const K = Q.of(r, k);
  const E = Q.of(e1[2]).sub(Q.of(e1[keep]!).mul(K)).div(Q.of(e1[elim]));
  return elim === 0 ? [E, K] : [K, E];
}

export const introductionToElimination: TopicDef = {
  id: "introduction-to-elimination",
  title: t("Introduction to the Elimination Method", "加减消元法入门"),
  summary: t(
    "Solve a system by adding or subtracting its equations to eliminate a variable.",
    "通过两个方程相加或相减消去一个变量来解方程组。",
  ),
  prerequisites: ["systems-of-linear-equations", "two-step-equations"],
  encompasses: [{ topic: "two-step-equations", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.6"],
  intro: t(
    `Reading a solution from a graph works when the lines cross at a grid point, but $x = \\frac{7}{3}$ is hard to see on a grid. We can already solve an equation in one unknown, such as $2x = 6$, so the idea is to combine the two equations into one in which a variable has disappeared.

Equal things added to equal things give equal results: if $A = B$ and $C = D$, then $A + C = B + D$. Take $x + y = 5$ and $x - y = 1$. Adding left sides and right sides,

$$(x + y) + (x - y) = 5 + 1, \\quad\\text{so}\\quad 2x = 6,$$

because $y$ and $-y$ cancel. So $x = 3$, and the first equation gives $3 + y = 5$, so $y = 2$. Check in the second: $3 - 2 = 1$. This is the **elimination method**. In this lesson we add the equations when a variable has opposite coefficients, and subtract them when it has the same coefficient.`,
    `从图像读出解，只在两直线交于格点时可行；$x = \\frac{7}{3}$ 在方格纸上很难看准。我们已经会解 $2x = 6$ 这样的一元方程，所以思路是把两个方程合成一个，让其中一个变量消失。

等量加等量，和相等：若 $A = B$ 且 $C = D$，则 $A + C = B + D$。看 $x + y = 5$ 和 $x - y = 1$，左边加左边、右边加右边：

$$(x + y) + (x - y) = 5 + 1, \\quad\\text{即}\\quad 2x = 6,$$

因为 $y$ 和 $-y$ 抵消了。于是 $x = 3$，由第一个方程 $3 + y = 5$ 得 $y = 2$。代入第二个方程检验：$3 - 2 = 1$。这就是**加减消元法**。这节课我们在某个变量系数互为相反数时把两个方程相加，在系数相同时把它们相减。`,
  ),
  knowledgePoints: [
    {
      id: "adding-equations",
      title: t("Adding the equations", "两个方程相加"),
      explanation: t(
        `If $A = B$ and $C = D$, then $A + C = B + D$: equations can be added side by side, and the sum is true for every pair that solves the system. When a variable has **opposite** coefficients in the two equations, adding them eliminates it, leaving one equation in one unknown:

$$\\begin{cases} 3x + 2y = 4 \\\\ 5x - 2y = 12 \\end{cases} \\;\\Rightarrow\\; 8x = 16 \\;\\Rightarrow\\; x = 2.$$

Then substitute into either equation: $3 \\cdot 2 + 2y = 4$ gives $2y = -2$, so $y = -1$. Check in the other equation: $5 \\cdot 2 - 2 \\cdot (-1) = 10 + 2 = 12$. The solution is $(2, -1)$.

> **Watch out.** Add the right sides too: $4 + 12 = 16$. Subtracting the constants while adding the left sides gives a wrong pair. And write the pair in the order $(x, y)$, whichever variable you found first.`,
        `若 $A = B$ 且 $C = D$，则 $A + C = B + D$：两个方程可以左右分别相加，方程组的每个解都满足相加得到的方程。当某个变量在两个方程中的系数**互为相反数**时，相加就把它消去，剩下一个一元方程：

$$\\begin{cases} 3x + 2y = 4 \\\\ 5x - 2y = 12 \\end{cases} \\;\\Rightarrow\\; 8x = 16 \\;\\Rightarrow\\; x = 2.$$

再代入任一方程：由 $3 \\cdot 2 + 2y = 4$ 得 $2y = -2$，所以 $y = -1$。代入另一个方程检验：$5 \\cdot 2 - 2 \\cdot (-1) = 10 + 2 = 12$。方程组的解是 $(2, -1)$。

> **注意。** 右边也要相加：$4 + 12 = 16$。左边相加、右边却相减，会得到错误的数对。无论先求出哪个变量，数对都按 $(x, y)$ 的顺序写。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const { e1, e2, elim, sol } = opposedSystem(rng, true);
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), eqOf(e2))}$$`, `解方程组 $$${system(eqOf(e1), eqOf(e2))}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], signSlip(e1, e2, elim, true)),
          solution: eliminationSolution(e1, e2, elim),
        });
      },
    },
    {
      id: "subtracting-equations",
      title: t("Subtracting the equations", "两个方程相减"),
      explanation: t(
        `When a variable has the **same** coefficient in both equations, adding would double it, but subtracting one equation from the other eliminates it. If $A = B$ and $C = D$, then $A - C = B - D$, so subtract every term, constants included:

$$\\begin{cases} 4x + 3y = 5 \\\\ x + 3y = -4 \\end{cases} \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3.$$

The right side is $5 - (-4) = 9$. Then $3 + 3y = -4$ gives $3y = -7$, so $y = -\\frac{7}{3}$. Check in the first equation: $4 \\cdot 3 + 3 \\cdot \\left(-\\frac{7}{3}\\right) = 12 - 7 = 5$.

> **Watch out.** Subtract the constants as well, and mind their signs: $5 - (-4)$ is $9$, not $1$. Adding the constants while subtracting the left sides is the usual slip.`,
        `当某个变量在两个方程中的系数**相同**时，相加会让它翻倍，用一个方程减去另一个方程却能把它消去。若 $A = B$ 且 $C = D$，则 $A - C = B - D$，所以每一项（包括常数）都要相减：

$$\\begin{cases} 4x + 3y = 5 \\\\ x + 3y = -4 \\end{cases} \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3.$$

右边是 $5 - (-4) = 9$。再由 $3 + 3y = -4$ 得 $3y = -7$，所以 $y = -\\frac{7}{3}$。代入第一个方程检验：$4 \\cdot 3 + 3 \\cdot \\left(-\\frac{7}{3}\\right) = 12 - 7 = 5$。

> **注意。** 常数也要相减，并注意符号：$5 - (-4)$ 是 $9$，不是 $1$。左边相减、常数却相加，是最常见的错误。`,
      ),
      generate(rng) {
        const { e1, e2, elim, sol } = opposedSystem(rng, false);
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), eqOf(e2))}$$`, `解方程组 $$${system(eqOf(e1), eqOf(e2))}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], signSlip(e1, e2, elim, false)),
          solution: eliminationSolution(e1, e2, elim),
        });
      },
    },
  ],
};

/** scaledSystem draws a system where the eliminated variable's coefficient in one equation is a multiple of that in the other. */
function scaledSystem(rng: Rng): { e1: Lin; e2: Lin; elim: 0 | 1; sol: [number, number] } {
  const elim: 0 | 1 = rng.bool() ? 1 : 0;
  let u: number;
  let f: number;
  let v1: number;
  let v2: number;
  do {
    [u, f, v1, v2] = [rng.nonZero(-4, 4), rng.sign() * rng.int(2, 4), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
  } while (v2 === f * v1);
  const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
  const make = (ue: number, ve: number): Lin => {
    const [a, b] = elim === 0 ? [ue, ve] : [ve, ue];
    return [a, b, a * x + b * y];
  };
  const [e1, e2] = [make(u, v1), make(f * u, v2)];
  return rng.bool() ? { e1, e2, elim, sol: [x, y] } : { e1: e2, e2: e1, elim, sol: [x, y] };
}

export const eliminationWithOneTransformation: TopicDef = {
  id: "elimination-with-one-transformation",
  title: t("Solving Systems of Linear Equations Using Elimination: One Transformation", "用消元法解线性方程组：变形一个方程"),
  summary: t(
    "Multiply one equation by a number so that adding or subtracting eliminates a variable.",
    "把一个方程乘以一个数，使相加或相减能消去一个变量。",
  ),
  prerequisites: ["introduction-to-elimination"],
  encompasses: [{ topic: "introduction-to-elimination", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.5"],
  intro: t(
    `Adding or subtracting the equations eliminates a variable when its coefficients are already opposite or equal. In $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$ they are not: adding gives $5x - y = 7$, which still has two unknowns.

An equation keeps its solutions when both sides are multiplied by the same nonzero number. Every pair with $2x + y = 7$ also has $4x + 2y = 14$, and the other way round. So we may replace the first equation by $4x + 2y = 14$. Now the coefficients of $y$ are $2$ and $-2$, and adding gives

$$7x = 14, \\quad\\text{so}\\quad x = 2.$$

Then $2 \\cdot 2 + y = 7$ gives $y = 3$, and the second equation checks: $3 \\cdot 2 - 2 \\cdot 3 = 0$. In this lesson we multiply one equation to make a pair of coefficients match, and line up the terms when an equation is not written as $ax + by = c$.`,
    `当某个变量的系数已经互为相反数或相等时，两个方程相加或相减就能把它消去。在 $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$ 中不是这样：相加得 $5x - y = 7$，仍有两个未知数。

方程两边同乘以一个非零数，解不变。满足 $2x + y = 7$ 的每一对数也满足 $4x + 2y = 14$，反过来也一样。所以可以把第一个方程换成 $4x + 2y = 14$。这时 $y$ 的系数是 $2$ 和 $-2$，相加得

$$7x = 14, \\quad\\text{所以}\\quad x = 2.$$

再由 $2 \\cdot 2 + y = 7$ 得 $y = 3$，代入第二个方程检验：$3 \\cdot 2 - 2 \\cdot 3 = 0$。这节课我们把一个方程乘以一个数，使一对系数匹配；方程不是 $ax + by = c$ 的形式时，先对齐各项。`,
  ),
  knowledgePoints: [
    {
      id: "multiplying-one-equation",
      title: t("Multiplying one equation", "一个方程乘以一个数"),
      explanation: t(
        `Multiplying both sides of an equation by a nonzero number does not change its solutions. So if a coefficient in one equation is a multiple of the matching coefficient in the other, scale the other equation until the two are opposite (then add) or equal (then subtract).

$$\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$$

The coefficients of $y$ are $1$ and $-2$. Multiply the first equation by $2$: $4x + 2y = 14$. Adding it to the second gives $7x = 14$, so $x = 2$, and $2 \\cdot 2 + y = 7$ gives $y = 3$. Check in the second equation: $3 \\cdot 2 - 2 \\cdot 3 = 0$.

> **Watch out.** Multiply **every** term, the constant too: $2(2x + y) = 2 \\cdot 7$ is $4x + 2y = 14$, not $4x + 2y = 7$. Leaving the constant alone changes the equation and gives a wrong pair.`,
        `方程两边同乘以一个非零数，方程的解不变。所以若一个方程中某变量的系数是另一个方程中对应系数的倍数，就把另一个方程乘以适当的数，使两个系数互为相反数（然后相加）或相等（然后相减）。

$$\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$$

$y$ 的系数是 $1$ 和 $-2$。第一个方程乘以 $2$：$4x + 2y = 14$。与第二个方程相加得 $7x = 14$，所以 $x = 2$，再由 $2 \\cdot 2 + y = 7$ 得 $y = 3$。代入第二个方程检验：$3 \\cdot 2 - 2 \\cdot 3 = 0$。

> **注意。** **每一项**都要乘，包括常数：$2(2x + y) = 2 \\cdot 7$ 是 $4x + 2y = 14$，不是 $4x + 2y = 7$。常数不乘，方程就变了，会得到错误的数对。`,
      ),
      generate(rng) {
        const { e1, e2, elim, sol } = scaledSystem(rng);
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), eqOf(e2))}$$`, `解方程组 $$${system(eqOf(e1), eqOf(e2))}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], forgotConstants(e1, e2, elim)),
          solution: eliminationSolution(e1, e2, elim),
        });
      },
    },
    {
      id: "aligning-terms-first",
      title: t("Lining up the terms first", "先对齐各项"),
      explanation: t(
        `Elimination adds or subtracts like terms, so they must sit in the same column. Before eliminating, write both equations in the form $ax + by = c$: the $x$ term first, then the $y$ term, then the constant on the right.

$$\\begin{cases} 3x + 2y = 11 \\\\ y = 4x - 11 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 3x + 2y = 11 \\\\ -4x + y = -11 \\end{cases}$$

Subtracting $4x$ from both sides of $y = 4x - 11$ moves the $x$ term to the left. Now multiply the second equation by $2$, $-8x + 2y = -22$, and subtract it from the first: $11x = 33$, so $x = 3$, and $y = 4 \\cdot 3 - 11 = 1$. Check: $3 \\cdot 3 + 2 \\cdot 1 = 11$.

> **Watch out.** A term that moves to the other side changes sign: $4x$ on the right becomes $-4x$ on the left. Keeping its old sign gives a different system and a wrong answer.`,
        `消元是把同类项相加或相减，所以同类项要上下对齐。消元之前，先把两个方程都写成 $ax + by = c$ 的形式：先写 $x$ 项，再写 $y$ 项，常数放在右边。

$$\\begin{cases} 3x + 2y = 11 \\\\ y = 4x - 11 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 3x + 2y = 11 \\\\ -4x + y = -11 \\end{cases}$$

在 $y = 4x - 11$ 两边都减去 $4x$，就把 $x$ 项移到了左边。再把第二个方程乘以 $2$，得 $-8x + 2y = -22$，用第一个方程减去它：$11x = 33$，所以 $x = 3$，$y = 4 \\cdot 3 - 11 = 1$。检验：$3 \\cdot 3 + 2 \\cdot 1 = 11$。

> **注意。** 一项移到等号另一边要变号：右边的 $4x$ 移到左边变成 $-4x$。保留原来的符号，就成了另一个方程组，答案也就错了。`,
      ),
      generate(rng) {
        const { e1, e2, elim, sol } = scaledSystem(rng);
        const [a2, b2, c2] = e2;
        const shown = rng.bool()
          ? `${poly([a2, "x"])} = ${poly([-b2, "y"], [c2, ""])}`
          : `${poly([b2, "y"])} = ${poly([c2, ""], [-a2, "x"])}`;
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), shown)}$$`, `解方程组 $$${system(eqOf(e1), shown)}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], linSolution(e1, [a2, -b2, c2])),
          solution: t(
            `**Line up the terms.** Move the terms so that $x$ and $y$ are on the left and the constant is on the right; a term changes sign when it crosses the equals sign. The second equation becomes $${eqOf(e2)}$.

${eliminationSolution(e1, e2, elim).en}`,
            `**对齐各项。** 移项，使 $x$ 和 $y$ 在左边、常数在右边；一项越过等号要变号。第二个方程变成 $${eqOf(e2)}$。

${eliminationSolution(e1, e2, elim)["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** stubbornSystem draws a system in which no coefficient of a variable divides the other, so both equations must be scaled. */
function stubbornSystem(rng: Rng): { e1: Lin; e2: Lin; sol: [number, number] } {
  const free = (p: number, q: number) => Math.abs(p) % Math.abs(q) !== 0 && Math.abs(q) % Math.abs(p) !== 0;
  let a1: number;
  let b1: number;
  let a2: number;
  let b2: number;
  do {
    [a1, b1, a2, b2] = [2, 2, 2, 2].map(() => rng.sign() * rng.int(2, 7)) as [number, number, number, number];
  } while (!free(a1, a2) || !free(b1, b2) || a1 * b2 - a2 * b1 === 0);
  const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
  return { e1: [a1, b1, a1 * x + b1 * y], e2: [a2, b2, a2 * x + b2 * y], sol: [x, y] };
}

export const eliminationWithTwoTransformations: TopicDef = {
  id: "elimination-with-two-transformations",
  title: t("Solving Systems of Linear Equations Using Elimination: Two Transformations", "用消元法解线性方程组：变形两个方程"),
  summary: t(
    "Multiply both equations so that a variable's coefficients become opposites.",
    "两个方程分别乘以适当的数，使某个变量的系数互为相反数。",
  ),
  prerequisites: ["elimination-with-one-transformation"],
  encompasses: [{ topic: "elimination-with-one-transformation", weight: 0.7 }],
  xp: 18,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.5"],
  intro: t(
    `Multiplying one equation works when one coefficient is a multiple of the other, like $2$ and $6$. In $\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$ no coefficient divides its partner: $3$ and $2$, $4$ and $-5$. Multiplying one equation alone cannot make a pair match.

So multiply both. The coefficients of $x$, $3$ and $2$, have $6$ as their least common multiple. The first equation times $2$ and the second times $3$ give

$$\\begin{cases} 6x + 8y = 20 \\\\ 6x - 15y = -3 \\end{cases}$$

Subtracting, $23y = 23$, so $y = 1$, and $3x + 4 = 10$ gives $x = 2$. Check: $2 \\cdot 2 - 5 \\cdot 1 = -1$. In this lesson we scale both equations, and keep exact fractions when the solution is not a whole number.`,
    `当一个系数是另一个的倍数时，比如 $2$ 和 $6$，把一个方程乘以一个数就行。在 $\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$ 中，没有一个系数能整除对应的系数：$3$ 和 $2$，$4$ 和 $-5$。只乘一个方程，无法使任何一对系数匹配。

那就两个都乘。$x$ 的系数 $3$ 和 $2$ 的最小公倍数是 $6$。第一个方程乘以 $2$，第二个方程乘以 $3$，得

$$\\begin{cases} 6x + 8y = 20 \\\\ 6x - 15y = -3 \\end{cases}$$

相减得 $23y = 23$，所以 $y = 1$，由 $3x + 4 = 10$ 得 $x = 2$。检验：$2 \\cdot 2 - 5 \\cdot 1 = -1$。这节课我们把两个方程都乘以适当的数，并在解不是整数时保留准确的分数。`,
  ),
  knowledgePoints: [
    {
      id: "multiplying-both-equations",
      title: t("Multiplying both equations", "两个方程都乘以一个数"),
      explanation: t(
        `When neither coefficient of a variable divides the other, scale both equations so that the two coefficients become their least common multiple, or its opposite. Each multiplier is the factor that takes its coefficient there.

$$\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$$

To eliminate $x$, the target is $6$: multiply the first equation by $2$ and the second by $3$, giving $6x + 8y = 20$ and $6x - 15y = -3$. The coefficients are equal, so subtract: $23y = 23$, so $y = 1$, and then $3x + 4 = 10$ gives $x = 2$. Check: $2 \\cdot 2 - 5 \\cdot 1 = -1$.

> **Watch out.** Each equation gets its own multiplier, and it multiplies every term of that equation, constant included: $3(2x - 5y) = 3 \\cdot (-1)$ gives $-3$ on the right, not $-1$.`,
        `当某变量的两个系数互不整除时，把两个方程分别乘以适当的数，使这两个系数都变成它们的最小公倍数或其相反数。每个乘数就是把对应系数变成这个数所需的因数。

$$\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$$

要消去 $x$，目标是 $6$：第一个方程乘以 $2$，第二个方程乘以 $3$，得 $6x + 8y = 20$，$6x - 15y = -3$。两个系数相等，所以相减：$23y = 23$，$y = 1$，再由 $3x + 4 = 10$ 得 $x = 2$。检验：$2 \\cdot 2 - 5 \\cdot 1 = -1$。

> **注意。** 每个方程有自己的乘数，并且要乘这个方程的每一项，包括常数：$3(2x - 5y) = 3 \\cdot (-1)$ 的右边是 $-3$，不是 $-1$。`,
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        const { e1, e2, sol } = stubbornSystem(rng);
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), eqOf(e2))}$$`, `解方程组 $$${system(eqOf(e1), eqOf(e2))}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], forgotConstants(e1, e2, elim), forgotConstants(e1, e2, (1 - elim) as 0 | 1)),
          solution: eliminationSolution(e1, e2, elim),
        });
      },
    },
    {
      id: "fractional-solutions",
      title: t("Solutions that are fractions", "解为分数的情形"),
      explanation: t(
        `The solution of a system with integer coefficients need not be integers: the last step divides by a coefficient, and the division need not come out even. Proceed exactly as before and keep exact fractions.

$$\\begin{cases} 2x + 3y = 1 \\\\ 5x - 2y = 3 \\end{cases}$$

Multiply by $2$ and $3$ to eliminate $y$: $4x + 6y = 2$ and $15x - 6y = 9$. Adding, $19x = 11$, so $x = \\frac{11}{19}$. Then $3y = 1 - \\frac{22}{19} = -\\frac{3}{19}$, so $y = -\\frac{1}{19}$. Check in the second equation: $\\frac{55}{19} + \\frac{2}{19} = \\frac{57}{19} = 3$.

> **Watch out.** Do not round $\\frac{11}{19}$ to a decimal: a rounded value no longer fits the equations exactly. And multiply the constants along with the variable terms, or the fractions you get are wrong ones.`,
        `整数系数的方程组的解不一定是整数：最后一步要除以一个系数，不一定能除尽。照常求解，保留准确的分数。

$$\\begin{cases} 2x + 3y = 1 \\\\ 5x - 2y = 3 \\end{cases}$$

分别乘以 $2$ 和 $3$ 消去 $y$：$4x + 6y = 2$，$15x - 6y = 9$。相加得 $19x = 11$，所以 $x = \\frac{11}{19}$。于是 $3y = 1 - \\frac{22}{19} = -\\frac{3}{19}$，$y = -\\frac{1}{19}$。代入第二个方程检验：$\\frac{55}{19} + \\frac{2}{19} = \\frac{57}{19} = 3$。

> **注意。** 不要把 $\\frac{11}{19}$ 四舍五入成小数：近似值不能准确地满足方程。常数也要和变量项一起乘，否则得到的分数是错的。`,
      ),
      generate(rng) {
        let e1: Lin;
        let e2: Lin;
        let sol: [Q, Q] | undefined;
        do {
          const s = stubbornSystem(rng);
          const shift: Lin = [0, 0, rng.nonZero(-3, 3)];
          e1 = [s.e1[0], s.e1[1], s.e1[2] + shift[2]];
          e2 = s.e2;
          sol = linSolution(e1, e2);
        } while (!sol || (sol[0].isInteger() && sol[1].isInteger()) || sol[0].d > 30n || sol[1].d > 30n);
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        return pointProblem({
          prompt: t(`Solve the system $$${system(eqOf(e1), eqOf(e2))}$$`, `解方程组 $$${system(eqOf(e1), eqOf(e2))}$$`),
          answer: sol,
          wrong: pairs([sol[1], sol[0]], forgotConstants(e1, e2, elim)),
          solution: eliminationSolution(e1, e2, elim),
        });
      },
    },
  ],
};

/** lcmOf is the least common multiple of the denominators of some rationals. */
function lcmOf(qs: readonly Q[]): number {
  let l = 1;
  for (const q of qs) l = (l * Number(q.d)) / gcd(l, Number(q.d));
  return l;
}

/** fractionalVersion divides an integer equation by d, giving fractional coefficients, and returns it with the factor that clears them. */
function fractionalVersion(e: Lin, d: number): { coef: [Q, Q, Q]; clear: number } {
  const coef = e.map((v) => Q.of(v, d)) as [Q, Q, Q];
  return { coef, clear: lcmOf(coef) };
}

/** fractionalSystem draws an integer system with a fractional version of one or both equations. */
function fractionalSystem(
  rng: Rng,
  both: boolean,
): { shown: [string, string]; e1: Lin; e2: Lin; sol: [number, number]; clears: [number, number]; wrongSol?: [Q, Q] } {
  let s: { e1: Lin; e2: Lin; sol: [number, number] };
  let f1: { coef: [Q, Q, Q]; clear: number };
  let f2: { coef: [Q, Q, Q]; clear: number };
  const frac = (f: { coef: [Q, Q, Q] }) => f.coef[0].d > 1n || f.coef[1].d > 1n;
  do {
    s = randomSystem(rng, 6);
    f1 = fractionalVersion(s.e1, rng.pick([2, 3, 4, 6]));
    f2 = both ? fractionalVersion(s.e2, rng.pick([2, 3, 4, 5])) : { coef: s.e2.map((v) => Q.of(v)) as [Q, Q, Q], clear: 1 };
  } while (!frac(f1) || (both && !frac(f2)));
  const write = (c: [Q, Q, Q]) => `${poly([c[0], "x"], [c[1], "y"])} = ${num(c[2])}`;
  const e1 = f1.coef.map((q) => q.mul(Q.of(f1.clear)).toNumber()) as unknown as Lin;
  const e2 = f2.coef.map((q) => q.mul(Q.of(f2.clear)).toNumber()) as unknown as Lin;
  const half = (f: { coef: [Q, Q, Q]; clear: number }) => [f.coef[0].mul(Q.of(f.clear)), f.coef[1].mul(Q.of(f.clear)), f.coef[2]] as const;
  const [w1, w2] = [half(f1), half(f2)];
  return {
    shown: [write(f1.coef), write(f2.coef)],
    e1,
    e2,
    sol: s.sol,
    clears: [f1.clear, f2.clear],
    wrongSol: solve2(w1[0], w1[1], w1[2], w2[0], w2[1], w2[2]),
  };
}

/** clearingText explains how the shown equations were cleared of fractions or decimals. */
function clearingText(clears: readonly [number, number], e1: Lin, e2: Lin, what: "fractions" | "decimals"): Text {
  const parts: string[] = [];
  const zh: string[] = [];
  if (clears[0] !== 1) {
    parts.push(`the first equation by $${clears[0]}$`);
    zh.push(`第一个方程乘以 $${clears[0]}$`);
  }
  if (clears[1] !== 1) {
    parts.push(`${clears[0] !== 1 ? "the second" : "the second equation"} by $${clears[1]}$`);
    zh.push(`第二个方程乘以 $${clears[1]}$`);
  }
  const lines = steps(
    ...[clears[0] !== 1 ? eqOf(e1) : undefined, clears[1] !== 1 ? eqOf(e2) : undefined].filter((l): l is string => l !== undefined),
  );
  const basis =
    what === "fractions"
      ? t(
          `${parts.length > 1 ? "each by the least common multiple of its own denominators" : "the least common multiple of its denominators"}`,
          `${parts.length > 1 ? "各自分母的最小公倍数" : "它的各分母的最小公倍数"}`,
        )
      : t("the power of ten its decimals need", "它的小数所需的 10 的幂");
  return t(
    `**Clear the ${what}.** Multiply ${parts.join(" and ")}, ${basis.en}. Every term is multiplied, the constant included, and the new ${parts.length > 1 ? "equations have" : "equation has"} the same solutions: ${lines}`,
    `**去掉${what === "fractions" ? "分母" : "小数"}。** ${zh.join("，")}，乘的是${basis["zh-CN"]}。每一项都要乘，包括常数；新方程的解不变：${lines}`,
  );
}

export const systemsWithFractionalCoefficients: TopicDef = {
  id: "systems-with-fractional-coefficients",
  title: t("Systems of Linear Equations with Fractional Coefficients", "分数系数的方程组"),
  summary: t("Clear the fractions from a system, then solve it by elimination.", "先去掉方程组中的分数，再用消元法求解。"),
  prerequisites: ["elimination-with-two-transformations"],
  encompasses: [
    { topic: "elimination-with-two-transformations", weight: 0.6 },
    { topic: "operations-with-rational-numbers", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.6"],
  intro: t(
    `Elimination is easiest with whole-number coefficients, and fractions make every step heavier. But we already know that multiplying both sides of an equation by a nonzero number keeps its solutions. If we multiply by a number that every denominator divides, the fractions disappear.

Take $\\begin{cases} \\frac{1}{2}x + \\frac{2}{3}y = 3 \\\\ x - y = -1 \\end{cases}$. The denominators of the first equation are $2$ and $3$, with least common multiple $6$:

$$6 \\cdot \\tfrac{1}{2}x + 6 \\cdot \\tfrac{2}{3}y = 6 \\cdot 3, \\quad\\text{that is}\\quad 3x + 4y = 18.$$

Now multiply $x - y = -1$ by $4$ and add: $7x = 14$, so $x = 2$, and $y = 3$. Check in the original equation: $\\frac{1}{2} \\cdot 2 + \\frac{2}{3} \\cdot 3 = 1 + 2 = 3$. In this lesson we clear the fractions from one equation or from both, then solve by elimination.`,
    `用消元法时，整数系数最简单，分数会让每一步都更繁琐。但我们已经知道，方程两边同乘以一个非零数，解不变。如果乘的数能被每个分母整除，分数就消失了。

看 $\\begin{cases} \\frac{1}{2}x + \\frac{2}{3}y = 3 \\\\ x - y = -1 \\end{cases}$。第一个方程的分母是 $2$ 和 $3$，最小公倍数是 $6$：

$$6 \\cdot \\tfrac{1}{2}x + 6 \\cdot \\tfrac{2}{3}y = 6 \\cdot 3, \\quad\\text{即}\\quad 3x + 4y = 18.$$

再把 $x - y = -1$ 乘以 $4$ 后相加：$7x = 14$，所以 $x = 2$，$y = 3$。代入原方程检验：$\\frac{1}{2} \\cdot 2 + \\frac{2}{3} \\cdot 3 = 1 + 2 = 3$。这节课我们去掉一个或两个方程中的分母，再用消元法求解。`,
  ),
  knowledgePoints: [
    {
      id: "clearing-fractions",
      title: t("Clearing the fractions", "去分母"),
      explanation: t(
        `Multiplying both sides of an equation by a nonzero number keeps its solutions. Choose the least common multiple of the denominators: every denominator divides it, so every fraction becomes a whole number, and the numbers stay as small as possible.

$$\\frac{1}{2}x + \\frac{2}{3}y = 3 \\;\\xrightarrow{\\;\\times 6\\;}\\; 3x + 4y = 18.$$

Here $6 \\cdot \\frac{1}{2} = 3$, $6 \\cdot \\frac{2}{3} = 4$ and $6 \\cdot 3 = 18$. The new equation has the same solutions, and the system can then be solved by elimination.

> **Watch out.** Multiply the constant as well: $6 \\cdot 3 = 18$. Writing $3x + 4y = 3$ is a different equation, and it leads to a wrong pair.`,
        `方程两边同乘以一个非零数，解不变。选各分母的最小公倍数：每个分母都能整除它，所以每个分数都变成整数，而且数尽可能小。

$$\\frac{1}{2}x + \\frac{2}{3}y = 3 \\;\\xrightarrow{\\;\\times 6\\;}\\; 3x + 4y = 18.$$

这里 $6 \\cdot \\frac{1}{2} = 3$，$6 \\cdot \\frac{2}{3} = 4$，$6 \\cdot 3 = 18$。新方程的解不变，然后就可以用消元法解方程组。

> **注意。** 常数也要乘：$6 \\cdot 3 = 18$。写成 $3x + 4y = 3$ 就是另一个方程了，会得到错误的数对。`,
      ),
      keyPrerequisites: ["least-common-multiple"],
      generate(rng) {
        const s = fractionalSystem(rng, false);
        const swap = rng.bool();
        const shown = swap ? system(s.shown[1], s.shown[0]) : system(s.shown[0], s.shown[1]);
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        const clear = swap ? clearingText([1, s.clears[0]], s.e2, s.e1, "fractions") : clearingText(s.clears, s.e1, s.e2, "fractions");
        const rest = swap ? eliminationSolution(s.e2, s.e1, elim) : eliminationSolution(s.e1, s.e2, elim);
        return pointProblem({
          prompt: t(`Solve the system $$${shown}$$`, `解方程组 $$${shown}$$`),
          answer: s.sol,
          wrong: pairs([s.sol[1], s.sol[0]], s.wrongSol),
          solution: t(`${clear.en}${rest.en}`, `${clear["zh-CN"]}${rest["zh-CN"]}`),
        });
      },
    },
    {
      id: "fractions-in-both-equations",
      title: t("Fractions in both equations", "两个方程都有分数"),
      explanation: t(
        `When both equations have fractions, clear each one with the least common multiple of its own denominators. The two multipliers may differ, since each equation is changed separately and keeps its own solutions.

$$\\begin{cases} \\frac{1}{3}x + \\frac{1}{2}y = 1 \\\\ \\frac{3}{4}x - \\frac{1}{4}y = 2 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 2x + 3y = 6 \\\\ 3x - y = 8 \\end{cases}$$

The first equation is multiplied by $6$, the second by $4$. Then eliminate: multiplying $3x - y = 8$ by $3$ gives $9x - 3y = 24$, and adding gives $11x = 30$, so $x = \\frac{30}{11}$.

> **Watch out.** Multiply the right side of each equation too: $4 \\cdot 2 = 8$, not $2$. A constant left unchanged gives a wrong answer that still looks reasonable.`,
        `两个方程都有分数时，分别乘以各自分母的最小公倍数去分母。两个乘数可以不同，因为每个方程是分别变形的，各自的解都不变。

$$\\begin{cases} \\frac{1}{3}x + \\frac{1}{2}y = 1 \\\\ \\frac{3}{4}x - \\frac{1}{4}y = 2 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 2x + 3y = 6 \\\\ 3x - y = 8 \\end{cases}$$

第一个方程乘以 $6$，第二个方程乘以 $4$。然后消元：把 $3x - y = 8$ 乘以 $3$ 得 $9x - 3y = 24$，相加得 $11x = 30$，所以 $x = \\frac{30}{11}$。

> **注意。** 每个方程的右边也要乘：$4 \\cdot 2 = 8$，不是 $2$。常数不乘，得到的错误答案看起来还挺合理。`,
      ),
      generate(rng) {
        const s = fractionalSystem(rng, true);
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        const clear = clearingText(s.clears, s.e1, s.e2, "fractions");
        const rest = eliminationSolution(s.e1, s.e2, elim);
        return pointProblem({
          prompt: t(`Solve the system $$${system(s.shown[0], s.shown[1])}$$`, `解方程组 $$${system(s.shown[0], s.shown[1])}$$`),
          answer: s.sol,
          wrong: pairs([s.sol[1], s.sol[0]], s.wrongSol),
          solution: t(`${clear.en}${rest.en}`, `${clear["zh-CN"]}${rest["zh-CN"]}`),
        });
      },
    },
  ],
};

/** dpoly writes a sum of terms with decimal coefficients: "0.5x - 1.25y". */
function dpoly(...terms: readonly (readonly [Q, string])[]): string {
  let out = "";
  for (const [c, v] of terms) {
    if (c.isZero()) continue;
    const abs = c.abs();
    const body = v === "" ? dec(abs) : abs.eq(Q.one) ? v : `${dec(abs)}${v}`;
    if (out === "") out = c.sign() < 0 ? `-${body}` : body;
    else out += c.sign() < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

/** decimalVersion divides an integer equation by 10 or 100 and writes it with decimals; clear is the power of ten that clears them. */
function decimalVersion(e: Lin, scale: number): { latex: string; clear: number; coef: [Q, Q, Q] } {
  const coef = e.map((v) => Q.of(v, scale)) as [Q, Q, Q];
  const clear = coef.some((q) => q.d > 10n || (q.d > 1n && 10n % q.d !== 0n)) ? 100 : coef.some((q) => q.d > 1n) ? 10 : 1;
  return { latex: `${dpoly([coef[0], "x"], [coef[1], "y"])} = ${dec(coef[2])}`, clear, coef };
}

export const systemsWithDecimalCoefficients: TopicDef = {
  id: "systems-with-decimal-coefficients",
  title: t("Systems of Linear Equations with Decimal Coefficients", "小数系数的方程组"),
  summary: t(
    "Clear the decimals from a system by multiplying by a power of ten, then solve it.",
    "乘以 10 的幂去掉方程组中的小数，再求解。",
  ),
  prerequisites: ["elimination-with-two-transformations", "decimal-arithmetic"],
  encompasses: [
    { topic: "elimination-with-two-transformations", weight: 0.6 },
    { topic: "decimal-arithmetic", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.6"],
  intro: t(
    `A decimal is a fraction whose denominator is a power of ten: $0.3 = \\frac{3}{10}$ and $0.25 = \\frac{25}{100}$. So clearing decimals is clearing fractions, and the multiplier is simply $10$ for tenths or $100$ for hundredths.

Take $0.3x - 1.2y = 0.6$. Every decimal has one decimal place, so multiply by $10$:

$$3x - 12y = 6.$$

Multiplying by $10$ moves each decimal point one place right, and the equation keeps its solutions. With whole-number coefficients the system is solved by elimination as before. In this lesson we clear tenths, then hundredths, choosing the power of ten for each equation separately.`,
    `小数就是分母为 10 的幂的分数：$0.3 = \\frac{3}{10}$，$0.25 = \\frac{25}{100}$。所以去掉小数就是去分母，乘数就是 $10$（一位小数）或 $100$（两位小数）。

看 $0.3x - 1.2y = 0.6$。每个小数都只有一位小数，所以乘以 $10$：

$$3x - 12y = 6.$$

乘以 $10$ 就是把每个小数点向右移一位，方程的解不变。系数都是整数后，就像以前一样用消元法解方程组。这节课我们先去掉一位小数，再去掉两位小数，每个方程分别选择 10 的幂。`,
  ),
  knowledgePoints: [
    {
      id: "clearing-decimals",
      title: t("Clearing tenths", "去掉一位小数"),
      explanation: t(
        `An equation whose decimals have one decimal place becomes an equation with integer coefficients when multiplied by $10$, because $10$ times a number of tenths is a whole number:

$$0.3x - 1.2y = 0.6 \\;\\xrightarrow{\\;\\times 10\\;}\\; 3x - 12y = 6.$$

Each term is multiplied: $10 \\cdot 0.3 = 3$, $10 \\cdot 1.2 = 12$ and $10 \\cdot 0.6 = 6$. The equation keeps its solutions, and the system is then solved by elimination.

> **Watch out.** The constant on the right is multiplied too: $0.6$ becomes $6$. Leaving it as $0.6$ changes the equation and gives a wrong pair.`,
        `小数都只有一位小数的方程，乘以 $10$ 后就成为整数系数的方程，因为 $10$ 乘以若干个十分之一是整数：

$$0.3x - 1.2y = 0.6 \\;\\xrightarrow{\\;\\times 10\\;}\\; 3x - 12y = 6.$$

每一项都要乘：$10 \\cdot 0.3 = 3$，$10 \\cdot 1.2 = 12$，$10 \\cdot 0.6 = 6$。方程的解不变，然后用消元法解方程组。

> **注意。** 右边的常数也要乘：$0.6$ 变成 $6$。仍写 $0.6$，方程就变了，会得到错误的数对。`,
      ),
      keyPrerequisites: ["decimal-arithmetic"],
      generate(rng) {
        let s: { e1: Lin; e2: Lin; sol: [number, number] };
        let d: ReturnType<typeof decimalVersion>;
        do {
          s = randomSystem(rng, 9);
          d = decimalVersion(s.e1, 10);
        } while (d.clear !== 10 || (d.coef[0].d === 1n && d.coef[1].d === 1n));
        const e1 = d.coef.map((q) => q.mul(Q.of(10)).toNumber()) as unknown as Lin;
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        const shown = system(d.latex, eqOf(s.e2));
        const rest = eliminationSolution(e1, s.e2, elim);
        return pointProblem({
          prompt: t(`Solve the system $$${shown}$$`, `解方程组 $$${shown}$$`),
          answer: s.sol,
          wrong: pairs([s.sol[1], s.sol[0]], solve2(e1[0], e1[1], d.coef[2], s.e2[0], s.e2[1], s.e2[2])),
          solution: t(
            `**Clear the decimals.** Every decimal in the first equation has one decimal place, so multiply it by $10$, every term and the constant too: ${steps(eqOf(e1))}${rest.en}`,
            `**去掉小数。** 第一个方程中的小数都只有一位，所以把它乘以 $10$，每一项连同常数都要乘：${steps(eqOf(e1))}${rest["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "clearing-hundredths",
      title: t("Clearing hundredths", "去掉两位小数"),
      explanation: t(
        `If some decimal has two decimal places, its equation needs $100$, since $10 \\cdot 0.05 = 0.5$ is still a decimal. Each equation is multiplied by the power of ten its own decimals need.

$0.05x + 0.25y = 1.45$ becomes $5x + 25y = 145$ after multiplying by $100$. All three numbers share the factor $5$, so dividing by $5$ gives the simpler $x + 5y = 29$, with the same solutions. An equation with only tenths, such as $0.2x - 0.7y = 1.3$, needs just $10$: $2x - 7y = 13$.

> **Watch out.** Clear **both** equations, each with its own power of ten, and multiply every term, the constant included. An equation left with decimals, or with its constant unchanged, gives a wrong solution.`,
        `若某个小数有两位小数，它所在的方程要乘以 $100$，因为 $10 \\cdot 0.05 = 0.5$ 仍是小数。每个方程各自乘以它的小数所需要的 10 的幂。

$0.05x + 0.25y = 1.45$ 乘以 $100$ 变成 $5x + 25y = 145$。三个数都有因数 $5$，除以 $5$ 得更简单的 $x + 5y = 29$，解不变。只有一位小数的方程，比如 $0.2x - 0.7y = 1.3$，只需乘以 $10$：$2x - 7y = 13$。

> **注意。** **两个**方程都要去掉小数，各自乘以所需的 10 的幂，并且每一项（包括常数）都要乘。留着小数的方程，或常数没乘的方程，都会得到错误的解。`,
      ),
      generate(rng) {
        let s: { e1: Lin; e2: Lin; sol: [number, number] };
        let d1: ReturnType<typeof decimalVersion>;
        let d2: ReturnType<typeof decimalVersion>;
        do {
          s = randomSystem(rng, 9);
          const e1: Lin = [s.e1[0] * 5, s.e1[1] * 5, s.e1[2] * 5];
          s = { ...s, e1 };
          d1 = decimalVersion(e1, 100);
          d2 = decimalVersion(s.e2, 10);
        } while (d1.clear !== 100 || d2.clear !== 10);
        const e1 = d1.coef.map((q) => q.mul(Q.of(100)).toNumber()) as unknown as Lin;
        const e2 = d2.coef.map((q) => q.mul(Q.of(10)).toNumber()) as unknown as Lin;
        const g = gcd(gcd(e1[0], e1[1]), e1[2]);
        const r1 = e1.map((v) => v / g) as unknown as Lin;
        const elim: 0 | 1 = rng.bool() ? 1 : 0;
        const shown = system(d1.latex, d2.latex);
        const rest = eliminationSolution(r1, e2, elim);
        return pointProblem({
          prompt: t(`Solve the system $$${shown}$$`, `解方程组 $$${shown}$$`),
          answer: s.sol,
          wrong: pairs(
            [s.sol[1], s.sol[0]],
            solve2(e1[0], e1[1], e1[2], e2[0], e2[1], d2.coef[2]),
            solve2(e1[0], e1[1], e1[2], d2.coef[0], d2.coef[1], d2.coef[2]),
          ),
          solution: t(
            `**Clear the decimals.** The first equation has hundredths, so multiply it by $100$${g !== 1 ? `, then divide by $${g}$, a factor of every term, to keep the numbers small` : ""}. The second has only tenths, so multiply it by $10$. Every term is multiplied, the constants included: ${steps(eqOf(r1), eqOf(e2))}${rest.en}`,
            `**去掉小数。** 第一个方程有两位小数，所以乘以 $100$${g !== 1 ? `，再除以每一项都有的因数 $${g}$，让数小一些` : ""}。第二个方程只有一位小数，所以乘以 $10$。每一项（包括常数）都要乘：${steps(eqOf(r1), eqOf(e2))}${rest["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

// ─── Special systems ────────────────────────────────────────────────────────

const solutionCounts: readonly Text[] = [
  t("Exactly one solution", "恰有一个解"),
  t("No solution", "无解"),
  t("Infinitely many solutions", "无穷多个解"),
];

/** specialSystem draws a system with one solution (kind 0), no solution (1) or infinitely many (2), the second equation a multiple of the first in the special cases. */
function specialSystem(rng: Rng, kind: number): { e1: Lin; e2: Lin; k: number } {
  const [A, B] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
  const C = rng.int(-12, 12);
  const k = rng.pick([-3, -2, -1, 2, 3]);
  if (kind === 0) {
    let a2: number;
    let b2: number;
    do {
      [a2, b2] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
    } while (A * b2 === a2 * B);
    return { e1: [A, B, C], e2: [a2, b2, rng.int(-12, 12)], k };
  }
  return { e1: [A, B, C], e2: [k * A, k * B, kind === 2 ? k * C : k * C + rng.nonZero(-5, 5)], k };
}

/** specialReason explains the number of solutions of a special system found by elimination. */
function specialReason(e1: Lin, e2: Lin, kind: number, k: number): Text {
  if (kind === 0) {
    const [rx, ry] = [num(Q.of(e1[0], e2[0])), num(Q.of(e1[1], e2[1]))];
    return t(
      `**Compare the left sides.** For one left side to be a multiple of the other, the coefficients of $x$ and of $y$ would have to be in the same ratio. Here $\\frac{${e1[0]}}{${e2[0]}} = ${rx}$ but $\\frac{${e1[1]}}{${e2[1]}} = ${ry}$, so they are not proportional.

**Conclude.** Eliminating one variable therefore leaves the other with a nonzero coefficient, and it has exactly one value: the lines cross once, and there is exactly one solution.`,
      `**比较左边。** 要使一个方程的左边是另一个的倍数，$x$ 的系数和 $y$ 的系数必须成同一比例。这里 $\\frac{${e1[0]}}{${e2[0]}} = ${rx}$，而 $\\frac{${e1[1]}}{${e2[1]}} = ${ry}$，不成比例。

**下结论。** 所以消去一个变量后，另一个变量的系数不为零，它只有一个值：两直线相交于一点，恰有一个解。`,
    );
  }
  const scaled = `${poly([k * e1[0], "x"], [k * e1[1], "y"])} = ${num(k * e1[2])}`;
  const end = `0 = ${num(k * e1[2] - e2[2])}`;
  const compare = t(
    `**Compare the left sides.** The coefficients of the second equation are $${k}$ times those of the first, so multiply the first equation by $${k}$, every term: $${scaled}$.`,
    `**比较左边。** 第二个方程的系数是第一个方程的 $${k}$ 倍，所以把第一个方程每一项都乘以 $${k}$：$${scaled}$。`,
  );
  return kind === 1
    ? t(
        `${compare.en}

**Eliminate.** Subtracting the second equation removes both variables and leaves $${end}$, which is false. No pair can make both equations true, since the same left side cannot equal $${num(k * e1[2])}$ and $${num(e2[2])}$ at once: there is no solution.`,
        `${compare["zh-CN"]}

**消元。** 减去第二个方程，两个变量都消去了，剩下 $${end}$，这不成立。同一个左边不可能既等于 $${num(k * e1[2])}$ 又等于 $${num(e2[2])}$，所以没有数对能使两个方程都成立：方程组无解。`,
      )
    : t(
        `${compare.en} This is exactly the second equation.

**Eliminate.** Subtracting removes everything and leaves $0 = 0$, which is always true. Every solution of one equation solves the other, so there are infinitely many solutions.`,
        `${compare["zh-CN"]}这正是第二个方程。

**消元。** 相减后全部消去，剩下 $0 = 0$，恒成立。一个方程的每个解都是另一个方程的解，所以有无穷多个解。`,
      );
}

export const systemsWithNoSolutionOrInfinitelyManySolutions: TopicDef = {
  id: "systems-with-no-solution-or-infinitely-many-solutions",
  title: t("Systems of Equations With No Solutions and Infinitely Many Solutions", "无解与有无穷多解的方程组"),
  summary: t(
    "Recognize systems of linear equations with no solution or infinitely many solutions.",
    "识别无解或有无穷多个解的线性方程组。",
  ),
  prerequisites: ["elimination-with-one-transformation", "properties-of-lines-in-slope-intercept-form"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B"],
  intro: t(
    `Two lines in a plane usually cross at one point, and that point is the one solution of their system. But lines with the same slope never cross unless they are the same line. So some systems have no solution, and some have infinitely many.

Take $\\begin{cases} x + y = 2 \\\\ 2x + 2y = 7 \\end{cases}$. Doubling the first equation gives $2x + 2y = 4$. The same expression $2x + 2y$ cannot equal both $4$ and $7$, and subtracting the equations shows it: $0 = -3$, a false statement. In slope-intercept form the lines are $y = -x + 2$ and $y = -x + \\frac{7}{2}$: equal slopes, different intercepts, parallel.

If the second equation were $2x + 2y = 4$ instead, it would be the first equation doubled, the same line, and every point on it would be a solution; subtracting would give $0 = 0$. In this lesson we recognize both cases by elimination and by slopes and intercepts, and choose a coefficient that produces them.`,
    `平面上的两条直线通常交于一点，这个点就是它们组成的方程组的唯一解。但斜率相同的两条直线，除非是同一条直线，否则永不相交。所以有的方程组无解，有的方程组有无穷多个解。

看 $\\begin{cases} x + y = 2 \\\\ 2x + 2y = 7 \\end{cases}$。第一个方程乘以 $2$ 得 $2x + 2y = 4$。同一个式子 $2x + 2y$ 不可能既等于 $4$ 又等于 $7$；两个方程相减也说明了这一点：$0 = -3$，是假命题。化成斜截式，两条直线是 $y = -x + 2$ 和 $y = -x + \\frac{7}{2}$：斜率相同，截距不同，互相平行。

如果第二个方程换成 $2x + 2y = 4$，它就是第一个方程乘以 $2$，是同一条直线，直线上每个点都是解；相减得 $0 = 0$。这节课我们用消元法以及斜率和截距识别这两种情形，并确定使它们出现的系数。`,
  ),
  knowledgePoints: [
    {
      id: "by-elimination",
      title: t("Recognizing them by elimination", "用消元识别"),
      explanation: t(
        `Sometimes elimination removes **both** variables, because one left side is a multiple of the other. What remains is a statement about numbers alone:

- If it is false, such as $0 = 7$, no pair makes both equations true, and the system has **no solution**.
- If it is always true, $0 = 0$, the two equations are equivalent and the system has **infinitely many solutions**.

In $\\begin{cases} 2x - 3y = 5 \\\\ -4x + 6y = 1 \\end{cases}$, doubling the first equation gives $4x - 6y = 10$, and adding the second gives $0 = 11$: no solution.

> **Watch out.** $0 = 0$ does not mean the solution is $0$ or that there is none: it is true for every pair on the line, so there are infinitely many. Only a false statement like $0 = 11$ means no solution.`,
        `有时消元会把**两个**变量都消去，因为一个方程的左边是另一个的倍数。剩下的是只含数的等式：

- 若它不成立，例如 $0 = 7$，没有数对能使两个方程都成立，方程组**无解**。
- 若它恒成立，即 $0 = 0$，两个方程等价，方程组有**无穷多个解**。

在 $\\begin{cases} 2x - 3y = 5 \\\\ -4x + 6y = 1 \\end{cases}$ 中，第一个方程乘以 $2$ 得 $4x - 6y = 10$，再与第二个方程相加得 $0 = 11$：无解。

> **注意。** $0 = 0$ 不是说解为 $0$，也不是说无解：直线上每一对数都使它成立，所以有无穷多个解。只有像 $0 = 11$ 这样的假命题才表示无解。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const { e1, e2, k } = specialSystem(rng, kind);
        return reasoned(
          choiceProblem({
            prompt: t(
              `How many solutions does the system have? $$${system(eqOf(e1), eqOf(e2))}$$`,
              `方程组有几个解？$$${system(eqOf(e1), eqOf(e2))}$$`,
            ),
            options: solutionCounts,
            correct: kind,
            solution: specialReason(e1, e2, kind, k),
          }),
          [
            [
              solutionCounts[0]!.en,
              "Exactly one solution needs two lines that cross, but eliminating here removes both variables, so the lines are parallel or the same.",
              "恰有一个解要求两条直线相交，但这里消元后两个变量都消失了，所以两条直线平行或重合。",
            ],
            [
              solutionCounts[1]!.en,
              "No solution needs elimination to end in a false statement such as $0 = 5$, and it does not here.",
              "无解要求消元后得到像 $0 = 5$ 这样的假命题，而这里并非如此。",
            ],
            [
              solutionCounts[2]!.en,
              "Infinitely many solutions needs elimination to end in a true statement such as $0 = 0$, and it does not here.",
              "无穷多个解要求消元后得到像 $0 = 0$ 这样的真命题，而这里并非如此。",
            ],
          ],
        );
      },
    },
    {
      id: "by-slopes-and-intercepts",
      figure: gradeDrawings3["systems-with-no-solution-or-infinitely-many-solutions#by-slopes-and-intercepts"],
      title: t("Recognizing them by slopes and intercepts", "用斜率和截距识别"),
      explanation: t(
        `The solutions of a system are the common points of two lines, so compare the lines in slope-intercept form:

- different slopes: the lines cross once, **one solution**;
- equal slopes, different $y$-intercepts: parallel lines, **no solution**;
- equal slopes and equal $y$-intercepts: the same line, **infinitely many solutions**.

For $y = 2x + 1$ and $4x - 2y = -2$: solving the second for $y$ gives $-2y = -4x - 2$, so $y = 2x + 1$. Same slope, same intercept: the same line, infinitely many solutions.

> **Watch out.** Equal slopes alone do not decide it: compare the $y$-intercepts as well. And divide **every** term by the coefficient of $y$ before reading the slope and intercept.`,
        `方程组的解就是两条直线的公共点，所以把两条直线化为斜截式比较：

- 斜率不同：两直线相交于一点，**恰有一个解**；
- 斜率相同、$y$ 轴截距不同：两直线平行，**无解**；
- 斜率和 $y$ 轴截距都相同：同一条直线，**有无穷多个解**。

对 $y = 2x + 1$ 和 $4x - 2y = -2$：把第二个方程对 $y$ 求解，$-2y = -4x - 2$，所以 $y = 2x + 1$。斜率相同，截距也相同：是同一条直线，有无穷多个解。

> **注意。** 只看斜率相等还不能下结论，还要比较 $y$ 轴截距。读斜率和截距之前，要把**每一项**都除以 $y$ 的系数。`,
      ),
      keyPrerequisites: ["properties-of-lines-in-slope-intercept-form"],
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = pickSlope(rng, 0.3);
        const b = rng.int(-8, 8);
        let m2 = m;
        let b2 = Q.of(b);
        if (kind === 0) while (m2.eq(m)) m2 = pickSlope(rng, 0.3);
        if (kind === 1) b2 = Q.of(b + rng.nonZero(-4, 4));
        const [A, B, C] = standardOf(m2.neg(), 1, b2);
        const f = rng.pick([1, 2, 3, -1, -2]);
        const second = std(f * A, f * B, f * C);
        const l1 = si(m, b);
        const verdict = [
          t("The slopes differ, so the lines cross once: exactly one solution.", "斜率不同，两直线相交于一点：恰有一个解。"),
          t(
            "The slopes are equal and the $y$-intercepts differ, so the lines are parallel: no solution.",
            "斜率相等而 $y$ 轴截距不同，两直线平行：无解。",
          ),
          t(
            "The slopes and the $y$-intercepts are equal, so both equations describe the same line: infinitely many solutions.",
            "斜率和 $y$ 轴截距都相等，两个方程表示同一条直线：有无穷多个解。",
          ),
        ][kind]!;
        return choiceProblem({
          prompt: t(`How many solutions does the system have? $$${system(l1, second)}$$`, `方程组有几个解？$$${system(l1, second)}$$`),
          options: solutionCounts,
          correct: kind,
          solution: t(
            `**Rewrite the second equation.** The first is already in slope-intercept form, with slope $${num(m)}$ and $y$-intercept $${b}$. Solve the second for $y$, dividing every term by the coefficient of $y$: $${si(m2, b2)}$, with slope $${num(m2)}$ and $y$-intercept $${num(b2)}$.

**Compare.** ${verdict.en}`,
            `**改写第二个方程。** 第一个方程已经是斜截式，斜率 $${num(m)}$，$y$ 轴截距 $${b}$。把第二个方程对 $y$ 求解，每一项都除以 $y$ 的系数：$${si(m2, b2)}$，斜率 $${num(m2)}$，$y$ 轴截距 $${num(b2)}$。

**比较。** ${verdict["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "finding-a-coefficient",
      title: t("Choosing a coefficient", "确定系数"),
      explanation: t(
        `A system $\\begin{cases} ax + by = c \\\\ a'x + b'y = c' \\end{cases}$ has no solution or infinitely many exactly when the left side of one equation is a multiple of the other's. Then the constants decide: if they are in the same ratio, the equations are equivalent; if not, they contradict each other.

Take $\\begin{cases} 2x + 3y = 4 \\\\ kx + 6y = 5 \\end{cases}$. The $y$-coefficient doubled, $6 = 2 \\cdot 3$, so the left sides are proportional when $k = 2 \\cdot 2 = 4$. Then $4x + 6y$ would equal both $2 \\cdot 4 = 8$ and $5$, so there is no solution.

> **Watch out.** Find the factor from the coefficients you know, then apply that same factor, with its sign, to the unknown one: here $k = 2 \\cdot 2$, not $2$ itself and not $-4$.`,
        `方程组 $\\begin{cases} ax + by = c \\\\ a'x + b'y = c' \\end{cases}$ 无解或有无穷多解，当且仅当一个方程的左边是另一个方程左边的倍数。这时由常数决定：常数也成同一比例，两个方程等价；不成比例，两个方程互相矛盾。

看 $\\begin{cases} 2x + 3y = 4 \\\\ kx + 6y = 5 \\end{cases}$。$y$ 的系数扩大为 $2$ 倍，$6 = 2 \\cdot 3$，所以当 $k = 2 \\cdot 2 = 4$ 时左边成比例。这时 $4x + 6y$ 既要等于 $2 \\cdot 4 = 8$ 又要等于 $5$，所以无解。

> **注意。** 先由已知的系数求出倍数，再把同一个倍数（连同符号）用到未知系数上：这里 $k = 2 \\cdot 2$，不是 $2$ 本身，也不是 $-4$。`,
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const c = rng.int(-10, 10);
        const n = rng.pick([-3, -2, 2, 3, 4]);
        if (rng.bool()) {
          const d = n * c + rng.nonZero(-5, 5);
          const e2 = `${poly([1, "kx"], [n * b, "y"])} = ${num(d)}`.replace("kx", "kx");
          return numberProblem({
            prompt: t(
              `For what value of $k$ does the system have no solution? $$${system(std(a, b, c), e2)}$$`,
              `当 $k$ 为何值时方程组无解？$$${system(std(a, b, c), e2)}$$`,
            ),
            answer: n * a,
            solveFor: "k",
            wrong: [a, -n * a, n * b],
            solution: t(
              `**Find the multiple.** The $y$-coefficient of the second equation is $${n * b}$, which is $${n}$ times the first equation's $${b}$. The left sides are proportional when the $x$-coefficients have the same factor: $k = ${n} \\cdot ${paren(a)} = ${n * a}$.

**Check.** With $k = ${n * a}$, the first equation times $${n}$ reads $${std(n * a, n * b, n * c)}$, so the left side $${poly([n * a, "x"], [n * b, "y"])}$ would have to equal both $${num(n * c)}$ and $${num(d)}$. That is impossible, so the system has no solution.`,
              `**找倍数。** 第二个方程中 $y$ 的系数是 $${n * b}$，是第一个方程中 $${b}$ 的 $${n}$ 倍。$x$ 的系数也是这个倍数时，左边成比例：$k = ${n} \\cdot ${paren(a)} = ${n * a}$。

**检验。** $k = ${n * a}$ 时，第一个方程乘以 $${n}$ 得 $${std(n * a, n * b, n * c)}$，于是左边 $${poly([n * a, "x"], [n * b, "y"])}$ 既要等于 $${num(n * c)}$ 又要等于 $${num(d)}$。这不可能，所以方程组无解。`,
            ),
          });
        }
        const e2 = `${poly([n * a, "x"], [n * b, "y"])} = k`;
        return numberProblem({
          prompt: t(
            `For what value of $k$ does the system have infinitely many solutions? $$${system(std(a, b, c), e2)}$$`,
            `当 $k$ 为何值时方程组有无穷多个解？$$${system(std(a, b, c), e2)}$$`,
          ),
          answer: n * c,
          solveFor: "k",
          wrong: [c, -n * c, n * c + 1],
          solution: t(
            `**Find the multiple.** The left side of the second equation is $${n}$ times that of the first: $${n * a} = ${n} \\cdot ${paren(a)}$ and $${n * b} = ${n} \\cdot ${paren(b)}$. The equations describe the same line when the constant is multiplied too: $k = ${n} \\cdot ${paren(c)} = ${n * c}$.

**Check.** The first equation times $${n}$ is $${std(n * a, n * b, n * c)}$, which is the second equation with $k = ${n * c}$, so every solution of one solves the other.`,
            `**找倍数。** 第二个方程的左边是第一个方程左边的 $${n}$ 倍：$${n * a} = ${n} \\cdot ${paren(a)}$，$${n * b} = ${n} \\cdot ${paren(b)}$。常数也乘以 $${n}$ 时，两个方程表示同一条直线：$k = ${n} \\cdot ${paren(c)} = ${n * c}$。

**检验。** 第一个方程乘以 $${n}$ 得 $${std(n * a, n * b, n * c)}$，正是 $k = ${n * c}$ 时的第二个方程，所以一个方程的每个解都是另一个方程的解。`,
          ),
        });
      },
    },
  ],
};

const classes: readonly Text[] = [
  t("Consistent and independent", "相容且独立"),
  t("Consistent and dependent", "相容且相关"),
  t("Inconsistent", "不相容"),
];

export const consistencyAndDependency: TopicDef = {
  id: "consistency-and-dependency",
  title: t("Consistency and Dependency in Linear Systems", "线性方程组的相容性与相关性"),
  summary: t("Classify a system as consistent or inconsistent, dependent or independent.", "判断方程组是否相容、是否相关。"),
  prerequisites: ["systems-with-no-solution-or-infinitely-many-solutions"],
  encompasses: [{ topic: "systems-with-no-solution-or-infinitely-many-solutions", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.HSA.REI.C.6"],
  intro: t(
    `A system of two linear equations has exactly one solution, none, or infinitely many, as its two lines cross, are parallel, or coincide. These three cases come up often enough to have names, which sort them by two questions: is there any solution at all, and are the equations really two different conditions?

Take $\\begin{cases} x - y = 1 \\\\ 3x - 3y = 3 \\end{cases}$. The second equation is the first times $3$, so it adds no new information: the two equations are one condition written twice. The system has solutions, infinitely many, so it is **consistent**, and since one equation depends on the other, it is **dependent**. Change the second to $3x - 3y = 4$ and the lines become parallel: no solution, an **inconsistent** system. In this lesson we classify systems from their equations and from their graphs.`,
    `由两个一次方程组成的方程组，要么恰有一个解，要么无解，要么有无穷多个解，对应两条直线相交、平行或重合。这三种情形很常见，所以有专门的名称，它们按两个问题来分类：到底有没有解？两个方程是不是真的是两个不同的条件？

看 $\\begin{cases} x - y = 1 \\\\ 3x - 3y = 3 \\end{cases}$。第二个方程是第一个方程乘以 $3$，没有带来新的信息：两个方程是同一个条件写了两遍。方程组有解，而且有无穷多个，所以是**相容**的；一个方程依赖于另一个，所以是**相关**的。把第二个方程改成 $3x - 3y = 4$，两条直线就平行了：无解，是**不相容**的方程组。这节课我们由方程和图像给方程组分类。`,
  ),
  knowledgePoints: [
    {
      id: "classifying-systems",
      figure: algebraDrawings["consistency-and-dependency#classifying-systems"],
      title: t("Classifying a system", "方程组的分类"),
      explanation: t(
        `A system is **consistent** if it has at least one solution, and **inconsistent** if it has none. A consistent system of two linear equations is **independent** if it has exactly one solution and **dependent** if it has infinitely many (its equations are equivalent).

| Solutions | Lines | Class |
| :--- | :--- | :--- |
| One | Intersecting | Consistent, independent |
| Infinitely many | The same line | Consistent, dependent |
| None | Parallel | Inconsistent |

For $\\begin{cases} x + 2y = 3 \\\\ 2x + 4y = 6 \\end{cases}$, doubling the first equation gives the second, and subtracting leaves $0 = 0$: infinitely many solutions, so consistent and dependent.

> **Watch out.** "Dependent" is a kind of **consistent** system, with infinitely many solutions; it does not mean no solution. A system with no solution is simply inconsistent.`,
        `有解的方程组叫做**相容**的，无解的叫做**不相容**的。由两个一次方程组成的相容方程组，若恰有一个解则是**独立**的，若有无穷多个解（两个方程等价）则是**相关**的。

| 解 | 直线 | 分类 |
| :--- | :--- | :--- |
| 一个 | 相交 | 相容且独立 |
| 无穷多个 | 同一条直线 | 相容且相关 |
| 没有 | 平行 | 不相容 |

对 $\\begin{cases} x + 2y = 3 \\\\ 2x + 4y = 6 \\end{cases}$，第一个方程乘以 $2$ 就是第二个方程，相减得 $0 = 0$：有无穷多个解，所以相容且相关。

> **注意。** "相关"是**相容**方程组的一种，有无穷多个解，不是无解。无解的方程组就是不相容的。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const { e1, e2, k } = specialSystem(rng, kind);
        const correct = [0, 2, 1][kind]!;
        const reason = specialReason(e1, e2, kind, k);
        const end = [
          t("So the system is consistent and independent.", "所以方程组相容且独立。"),
          t("So the system is inconsistent.", "所以方程组不相容。"),
          t("So the system is consistent and dependent.", "所以方程组相容且相关。"),
        ][kind]!;
        return reasoned(
          choiceProblem({
            prompt: t(`Classify the system $$${system(eqOf(e1), eqOf(e2))}$$`, `判断方程组 $$${system(eqOf(e1), eqOf(e2))}$$ 的类型。`),
            options: classes,
            correct,
            solution: t(`${reason.en}\n\n**Classify.** ${end.en}`, `${reason["zh-CN"]}\n\n**分类。** ${end["zh-CN"]}`),
          }),
          [
            [
              classes[0]!.en,
              "Independent means the lines cross at one point, but these two lines have the same slope.",
              "独立表示两条直线交于一点，但这两条直线斜率相同。",
            ],
            [
              classes[1]!.en,
              "Dependent means both equations describe the same line, and these two do not.",
              "相关表示两个方程表示同一条直线，而这两个方程不是。",
            ],
            [
              classes[2]!.en,
              "Inconsistent means the system has no solution at all, and this one has a solution.",
              "不相容表示方程组完全没有解，而这个方程组有解。",
            ],
          ],
        );
      },
    },
    {
      id: "classifying-from-graphs",
      title: t("Classifying from the graphs", "由图像分类"),
      explanation: t(
        `The graphs of the two equations show the number of solutions, and the number of solutions gives the class:

- lines that cross once: one solution, a consistent, independent system;
- parallel lines: no solution, an inconsistent system;
- lines that lie on top of each other: infinitely many solutions, a consistent, dependent system.

If only one line seems visible, with the other drawn dashed right along it, the two equations describe the same line: dependent.

> **Watch out.** Two lines that look close together are not the same line unless they coincide everywhere. Check whether they lean at the same steepness and whether there is a gap between them.`,
        `两个方程的图像显示解的个数，由解的个数就能分类：

- 相交于一点的两条直线：恰有一个解，方程组相容且独立；
- 平行线：无解，方程组不相容；
- 完全重合的直线：有无穷多个解，方程组相容且相关。

如果看上去只有一条直线，另一条画成虚线正好沿着它，那么两个方程表示同一条直线：相关。

> **注意。** 两条看起来很接近的直线，只有处处重合才是同一条直线。要看它们的倾斜程度是否相同，中间有没有间隔。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = rng.pick(smallSlopes);
        const b = rng.int(-4, 4);
        let m2 = m;
        let b2 = b;
        if (kind === 0) while (m2.eq(m)) m2 = rng.pick(smallSlopes);
        if (kind === 1) b2 = b + rng.pick([-3, -2, 2, 3]);
        const correct = [0, 2, 1][kind]!;
        const reason = [
          t(
            "**Look at the lines.** They lean differently and cross at one point, so the system has exactly one solution.\n\n**Classify.** It has a solution, so it is consistent, and only one, so it is independent.",
            "**看直线。** 两条直线倾斜程度不同，相交于一点，所以方程组恰有一个解。\n\n**分类。** 有解，所以相容；只有一个解，所以独立。",
          ),
          t(
            "**Look at the lines.** They have the same steepness and keep the same distance apart, so they are parallel and never meet: the system has no solution.\n\n**Classify.** A system with no solution is inconsistent.",
            "**看直线。** 两条直线倾斜程度相同，彼此距离不变，所以平行，永不相交：方程组无解。\n\n**分类。** 无解的方程组是不相容的。",
          ),
          t(
            "**Look at the lines.** The dashed line lies right on top of the other, so the two equations describe the same line, and every point of it is a solution: infinitely many.\n\n**Classify.** It has solutions, so it is consistent, and infinitely many, so it is dependent.",
            "**看直线。** 虚线正好与另一条直线重合，所以两个方程表示同一条直线，它上面的每个点都是解：有无穷多个解。\n\n**分类。** 有解，所以相容；有无穷多个解，所以相关。",
          ),
        ][kind]!;
        const alt = [
          ["The graphs of two equations on one coordinate grid.", "同一坐标网格上两个方程的图像。"],
          ["The graphs of two equations on one coordinate grid.", "同一坐标网格上两个方程的图像。"],
          ["The graphs of two equations on one coordinate grid, one drawn dashed.", "同一坐标网格上两个方程的图像，其中一条画成虚线。"],
        ][kind]!;
        return {
          ...choiceProblem({
            prompt: t(
              "The graphs of the two equations of a system are shown. Classify the system.",
              "图中是一个方程组中两个方程的图像。判断方程组的类型。",
            ),
            options: classes,
            correct,
            solution: reason,
          }),
          figure: graph([lineMark(m, b), lineMark(m2, b2, false, true)], alt[0]!, alt[1]!),
        };
      },
    },
  ],
};

// ─── Substitution and intersections ─────────────────────────────────────────

export const solvingSystemsBySubstitution: TopicDef = {
  id: "solving-systems-by-substitution",
  title: t("Solving Systems of Equations by Substitution", "用代入法解方程组"),
  summary: t(
    "Solve a system by substituting an expression for one variable into the other equation.",
    "把表示一个变量的式子代入另一个方程来解方程组。",
  ),
  prerequisites: ["systems-of-linear-equations", "equations-with-parentheses"],
  encompasses: [{ topic: "equations-with-parentheses", weight: 0.6 }],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.6"],
  intro: t(
    `Elimination combines two equations to remove a variable. Sometimes there is a more direct way: when one equation already says what a variable equals, that value can be used in the other equation.

Take $\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases}$. For any solution, $y$ is the same number as $2x - 1$, so in the second equation we may write $2x - 1$ in place of $y$, keeping it in parentheses because $2$ multiplies all of it:

$$3x + 2(2x - 1) = 12, \\quad 7x - 2 = 12, \\quad x = 2.$$

Then the first equation gives $y = 2 \\cdot 2 - 1 = 3$, and the second checks: $3 \\cdot 2 + 2 \\cdot 3 = 12$. This is the **substitution method**. In this lesson we substitute an expression we are given, and first solve an equation for a variable when its coefficient is $1$ or $-1$.`,
    `消元法把两个方程合起来消去一个变量。有时还有更直接的办法：当一个方程已经说明某个变量等于什么时，就可以在另一个方程中使用它。

看 $\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases}$。对任何一个解，$y$ 和 $2x - 1$ 是同一个数，所以在第二个方程中可以把 $y$ 写成 $2x - 1$，并加上括号，因为 $2$ 要乘它的全部：

$$3x + 2(2x - 1) = 12, \\quad 7x - 2 = 12, \\quad x = 2.$$

再由第一个方程得 $y = 2 \\cdot 2 - 1 = 3$，代入第二个方程检验：$3 \\cdot 2 + 2 \\cdot 3 = 12$。这就是**代入法**。这节课我们代入已经给出的式子，并在某个变量的系数是 $1$ 或 $-1$ 时，先用另一个变量表示它。`,
  ),
  knowledgePoints: [
    {
      id: "substituting-an-expression",
      title: t("Substituting an expression", "代入一个式子"),
      explanation: t(
        `When one equation gives a variable in terms of the other, both sides name the same number, so that variable can be replaced in the other equation by the expression. Put the expression in parentheses, since the coefficient multiplies all of it:

$$\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases} \\;\\Rightarrow\\; 3x + 2(2x - 1) = 12 \\;\\Rightarrow\\; 7x - 2 = 12 \\;\\Rightarrow\\; x = 2.$$

Then $y = 2 \\cdot 2 - 1 = 3$; the solution is $(2, 3)$. Check in the second equation: $3 \\cdot 2 + 2 \\cdot 3 = 12$.

> **Watch out.** Distribute to **every** term inside the parentheses: $2(2x - 1)$ is $4x - 2$, not $4x - 1$. Forgetting the constant gives a wrong pair.`,
        `当一个方程用一个变量表示出另一个变量时，两边是同一个数，所以可以把另一个方程中的这个变量换成这个式子。式子要加上括号，因为系数要乘它的全部：

$$\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases} \\;\\Rightarrow\\; 3x + 2(2x - 1) = 12 \\;\\Rightarrow\\; 7x - 2 = 12 \\;\\Rightarrow\\; x = 2.$$

再由 $y = 2 \\cdot 2 - 1 = 3$，方程组的解是 $(2, 3)$。代入第二个方程检验：$3 \\cdot 2 + 2 \\cdot 3 = 12$。

> **注意。** 乘法要分配到括号里的**每一项**：$2(2x - 1)$ 是 $4x - 2$，不是 $4x - 1$。漏乘常数会得到错误的数对。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const solveY = rng.bool();
        const [sv, ov] = solveY ? ["y", "x"] : ["x", "y"];
        let m: number;
        let b0: number;
        let A: number;
        let B: number;
        do {
          [m, b0, A, B] = [rng.nonZero(-4, 4), rng.nonZero(-8, 8), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        } while (A + B * m === 0);
        // The substituted variable has coefficient B in the other equation; the remaining one has A.
        const o = rng.int(-6, 6);
        const s = m * o + b0;
        const C = A * o + B * s;
        const [x, y] = solveY ? [o, s] : [s, o];
        const first = `${sv} = ${linear(m, b0, ov)}`;
        const second = solveY ? std(A, B, C) : `${poly([B, "x"], [A, "y"])} = ${num(C)}`;
        const ox = Q.of(C - b0, A + B * m);
        const slip = solveY ? [ox, ox.mul(Q.of(m)).add(Q.of(b0))] : [ox.mul(Q.of(m)).add(Q.of(b0)), ox];
        const subst = `${poly([A, ov])} ${B < 0 ? "-" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}(${linear(m, b0, ov)}) = ${num(C)}`;
        const work = steps(subst, `${poly([A + B * m, ov], [B * b0, ""])} = ${num(C)}`, `${ov} = ${o}`);
        const back = steps(`${sv} = ${evalAt(m, o, b0)} = ${s}`);
        const check = checkEq(solveY ? [A, B, C] : [B, A, C], [Q.of(x), Q.of(y)]);
        return pointProblem({
          prompt: t(`Solve the system $$${system(first, second)}$$`, `解方程组 $$${system(first, second)}$$`),
          answer: [x, y],
          wrong: pairs([y, x], slip),
          solution: t(
            `**Substitute.** The first equation says that $${sv}$ equals $${linear(m, b0, ov)}$, so replace $${sv}$ in the second equation by this expression, in parentheses. Multiply out, collect like terms and solve for $${ov}$: ${work}**Back-substitute.** Put $${ov} = ${o}$ into the first equation: ${back}The solution is $${pointLatex([x, y])}$.

**Check.** The first equation gave $${sv}$, so test the second: $${check}$.`,
            `**代入。** 第一个方程说 $${sv}$ 等于 $${linear(m, b0, ov)}$，所以把第二个方程中的 $${sv}$ 换成这个式子，并加上括号。去括号、合并同类项，解出 $${ov}$：${work}**回代。** 把 $${ov} = ${o}$ 代入第一个方程：${back}方程组的解是 $${pointLatex([x, y])}$。

**检验。** $${sv}$ 是由第一个方程求出的，所以代入第二个方程检验：$${check}$。`,
          ),
        });
      },
    },
    {
      id: "solving-for-a-variable-first",
      title: t("Solving for a variable first", "先用一个变量表示另一个"),
      explanation: t(
        `If a variable has coefficient $1$ or $-1$ in one equation, it can be isolated without fractions. Solve that equation for it, then substitute into the other:

$$\\begin{cases} x - 3y = 7 \\\\ 2x + y = 0 \\end{cases} \\;\\Rightarrow\\; x = 3y + 7 \\;\\Rightarrow\\; 2(3y + 7) + y = 0 \\;\\Rightarrow\\; 7y + 14 = 0 \\;\\Rightarrow\\; y = -2,$$

and $x = 3 \\cdot (-2) + 7 = 1$. Check in the second equation: $2 \\cdot 1 + (-2) = 0$.

> **Watch out.** Moving a term across the equals sign changes its sign: $x - 3y = 7$ gives $x = 3y + 7$, not $x = -3y + 7$. If the coefficient is $-1$, multiply every term by $-1$ at the end.`,
        `若某个变量在一个方程中的系数是 $1$ 或 $-1$，不用分数就能把它单独表示出来。先由这个方程用另一个变量表示它，再代入另一个方程：

$$\\begin{cases} x - 3y = 7 \\\\ 2x + y = 0 \\end{cases} \\;\\Rightarrow\\; x = 3y + 7 \\;\\Rightarrow\\; 2(3y + 7) + y = 0 \\;\\Rightarrow\\; 7y + 14 = 0 \\;\\Rightarrow\\; y = -2,$$

进而 $x = 3 \\cdot (-2) + 7 = 1$。代入第二个方程检验：$2 \\cdot 1 + (-2) = 0$。

> **注意。** 一项移到等号另一边要变号：由 $x - 3y = 7$ 得 $x = 3y + 7$，不是 $x = -3y + 7$。若系数是 $-1$，最后要把每一项都乘以 $-1$。`,
      ),
      generate(rng) {
        let b1: number;
        let a2: number;
        let b2: number;
        const sign = rng.sign();
        do {
          [b1, a2, b2] = [rng.nonZero(-5, 5), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        } while (sign * b2 - a2 * b1 === 0);
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const swap = rng.bool();
        // In variables (u, v): sign·u + b1·v = c1, a2·u + b2·v = c2, with u = x unless swap.
        const [u, v] = swap ? [y, x] : [x, y];
        const [un, vn] = swap ? ["y", "x"] : ["x", "y"];
        const c1 = sign * u + b1 * v;
        const c2 = a2 * u + b2 * v;
        const write = (cu: number, cv: number, c: number) => (swap ? std(cv, cu, c) : std(cu, cv, c));
        const e1 = write(sign, b1, c1);
        const e2 = write(a2, b2, c2);
        const expr = linear(-sign * b1, sign * c1, vn);
        const slipExpr: [number, number] = [sign * b1, sign * c1];
        const slipDen = b2 + a2 * slipExpr[0];
        let slip: [Q, Q] | undefined;
        if (slipDen !== 0) {
          const vSlip = Q.of(c2 - a2 * slipExpr[1], slipDen);
          const uSlip = vSlip.mul(Q.of(slipExpr[0])).add(Q.of(slipExpr[1]));
          slip = swap ? [vSlip, uSlip] : [uSlip, vSlip];
        }
        const isolate = steps(`${un} = ${expr}`);
        const work = steps(
          swap
            ? `${poly([b2, vn])} ${a2 < 0 ? "-" : "+"} ${coefficient(Math.abs(a2))}(${expr}) = ${num(c2)}`
            : `${coefficient(a2)}(${expr}) ${b2 < 0 ? "-" : "+"} ${poly([Math.abs(b2), vn])} = ${num(c2)}`,
          `${poly([b2 - a2 * sign * b1, vn], [a2 * sign * c1, ""])} = ${num(c2)}`,
          `${vn} = ${v}`,
        );
        const back = steps(`${un} = ${evalAt(-sign * b1, v, sign * c1)} = ${u}`);
        const check = checkEq(swap ? [b2, a2, c2] : [a2, b2, c2], [Q.of(x), Q.of(y)]);
        const order = rng.bool();
        const shown = order ? system(e1, e2) : system(e2, e1);
        return pointProblem({
          prompt: t(`Solve the system $$${shown}$$`, `解方程组 $$${shown}$$`),
          answer: [x, y],
          wrong: pairs([y, x], slip),
          solution: t(
            `**Solve for $${un}$.** In $${e1}$ the coefficient of $${un}$ is $${sign}$, so it is easy to isolate: move the $${vn}$ term to the other side, where it changes sign${sign < 0 ? ", then multiply every term by $-1$" : ""}. ${isolate}**Substitute.** Replace $${un}$ in the other equation by this expression, in parentheses, and solve for $${vn}$: ${work}**Back-substitute.** ${back}The solution is $${pointLatex([x, y])}$.

**Check.** The expression came from $${e1}$, so test the other equation: $${check}$.`,
            `**用 $${vn}$ 表示 $${un}$。** 在 $${e1}$ 中 $${un}$ 的系数是 $${sign}$，很容易单独表示出来：把 $${vn}$ 项移到等号另一边，移项要变号${sign < 0 ? "，再把每一项都乘以 $-1$" : ""}。${isolate}**代入。** 把另一个方程中的 $${un}$ 换成这个式子，加上括号，解出 $${vn}$：${work}**回代。** ${back}方程组的解是 $${pointLatex([x, y])}$。

**检验。** 这个式子来自 $${e1}$，所以代入另一个方程检验：$${check}$。`,
          ),
        });
      },
    },
  ],
};

export const intersectionOfTwoLines: TopicDef = {
  id: "intersection-of-two-lines",
  title: t("Calculating the Intersection of Two Lines", "求两直线的交点"),
  summary: t("Find the point where two lines meet by solving their equations as a system.", "把两条直线的方程联立成方程组，求它们的交点。"),
  prerequisites: ["solving-systems-by-substitution", "elimination-with-two-transformations"],
  encompasses: [
    { topic: "solving-systems-by-substitution", weight: 0.5 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.6", "CCSS.HSA.REI.D.11"],
  intro: t(
    `A point lies on a line exactly when its coordinates satisfy the line's equation. So the point where two lines meet is the one pair that satisfies both equations: the solution of their system. Reading it from a graph works only when it falls on grid points; solving the system finds it exactly.

Take $y = 3x - 2$ and $y = -x + 5$. Where they meet they share the same $y$, so the right sides are equal:

$$3x - 2 = -x + 5, \\quad 4x = 7, \\quad x = \\frac{7}{4}.$$

Then $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$, and the other line agrees: $-\\frac{7}{4} + 5 = \\frac{13}{4}$. In this lesson we intersect lines in slope-intercept form, lines in different forms, and a line given by two of its points.`,
    `一个点在一条直线上，当且仅当它的坐标满足这条直线的方程。所以两条直线的交点，就是同时满足两个方程的那一对数：它们组成的方程组的解。从图像读交点只在它落在格点上时可行；解方程组能准确地求出它。

看 $y = 3x - 2$ 和 $y = -x + 5$。在交点处它们的 $y$ 相同，所以右边相等：

$$3x - 2 = -x + 5, \\quad 4x = 7, \\quad x = \\frac{7}{4}.$$

于是 $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$，另一条直线也得到同样的值：$-\\frac{7}{4} + 5 = \\frac{13}{4}$。这节课我们求两条斜截式直线的交点、不同形式的直线的交点，以及由两点给出的直线与另一条直线的交点。`,
  ),
  knowledgePoints: [
    {
      id: "two-lines-in-slope-intercept-form",
      title: t("Two lines in slope-intercept form", "两条斜截式直线"),
      explanation: t(
        `The intersection of two lines is the solution of the system of their equations. If both are in slope-intercept form, both right sides equal the same $y$ there, so set them equal:

$$y = 3x - 2,\\; y = -x + 5: \\quad 3x - 2 = -x + 5 \\;\\Rightarrow\\; 4x = 7 \\;\\Rightarrow\\; x = \\frac{7}{4},$$

then $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$. The lines meet at $\\left(\\frac{7}{4}, \\frac{13}{4}\\right)$; coordinates need not be integers. Check with the other line: $-\\frac{7}{4} + 5 = \\frac{13}{4}$.

> **Watch out.** Moving the constants changes their signs: from $3x - 2 = -x + 5$, adding $2$ and $x$ to both sides gives $4x = 7$, not $4x = -7$. Write the point as $(x, y)$.`,
        `两直线的交点就是它们的方程组成的方程组的解。若两个方程都是斜截式，在交点处两个右边都等于同一个 $y$，所以令它们相等：

$$y = 3x - 2,\\; y = -x + 5: \\quad 3x - 2 = -x + 5 \\;\\Rightarrow\\; 4x = 7 \\;\\Rightarrow\\; x = \\frac{7}{4},$$

再由 $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$，两直线交于 $\\left(\\frac{7}{4}, \\frac{13}{4}\\right)$；坐标不一定是整数。用另一条直线检验：$-\\frac{7}{4} + 5 = \\frac{13}{4}$。

> **注意。** 移动常数要变号：由 $3x - 2 = -x + 5$，两边加 $2$ 再加 $x$ 得 $4x = 7$，不是 $4x = -7$。交点按 $(x, y)$ 的顺序写。`,
      ),
      generate(rng) {
        let m1: number;
        let m2: number;
        do {
          [m1, m2] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        } while (m1 === m2);
        const [b1, b2] = [rng.int(-9, 9), rng.int(-9, 9)];
        const x = Q.of(b2 - b1, m1 - m2);
        const y = x.mul(Q.of(m1)).add(Q.of(b1));
        const xs = Q.of(b1 - b2, m1 - m2);
        return pointProblem({
          prompt: t(
            `Find the point of intersection of the lines $${si(m1, b1)}$ and $${si(m2, b2)}$.`,
            `求直线 $${si(m1, b1)}$ 与 $${si(m2, b2)}$ 的交点。`,
          ),
          answer: [x, y],
          wrong: pairs([y, x], [xs, xs.mul(Q.of(m1)).add(Q.of(b1))]),
          solution: t(
            `**Set the right sides equal.** At the intersection both lines have the same $y$, so their right sides are equal. Collect the $x$ terms on the left and the constants on the right: ${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}**Find $y$.** Substitute into the first line: $y = ${evalAt(m1, x, b1)} = ${num(y)}$. The lines meet at $${pointLatex([x, y])}$.

**Check.** The second line gives the same value: $${evalAt(m2, x, b2)} = ${num(y)}$.`,
            `**令右边相等。** 在交点处两条直线的 $y$ 相同，所以右边相等。把 $x$ 项移到左边、常数移到右边：${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}**求 $y$。** 代入第一条直线：$y = ${evalAt(m1, x, b1)} = ${num(y)}$。两直线交于 $${pointLatex([x, y])}$。

**检验。** 第二条直线给出同样的值：$${evalAt(m2, x, b2)} = ${num(y)}$。`,
          ),
        });
      },
    },
    {
      id: "lines-in-different-forms",
      title: t("Lines in different forms", "不同形式的直线"),
      explanation: t(
        `If one line is in slope-intercept form and the other in standard form, the first already gives $y$ as an expression in $x$. Substitute it, in parentheses, into the standard form. For $y = 2x - 3$ and $4x + 3y = 1$:

$$4x + 3(2x - 3) = 1 \\;\\Rightarrow\\; 10x - 9 = 1 \\;\\Rightarrow\\; 10x = 10 \\;\\Rightarrow\\; x = 1,$$

and $y = 2 \\cdot 1 - 3 = -1$: the lines meet at $(1, -1)$. Check: $4 \\cdot 1 + 3 \\cdot (-1) = 1$.

> **Watch out.** The coefficient multiplies the constant inside the parentheses too, with its sign: $3(2x - 3)$ is $6x - 9$, so the next step adds $9$, not subtracts it.`,
        `若一条直线是斜截式，另一条是标准式，第一条已经把 $y$ 用 $x$ 表示出来了。把这个式子加上括号代入标准式。对于 $y = 2x - 3$ 和 $4x + 3y = 1$：

$$4x + 3(2x - 3) = 1 \\;\\Rightarrow\\; 10x - 9 = 1 \\;\\Rightarrow\\; 10x = 10 \\;\\Rightarrow\\; x = 1,$$

再得 $y = 2 \\cdot 1 - 3 = -1$：两直线交于 $(1, -1)$。检验：$4 \\cdot 1 + 3 \\cdot (-1) = 1$。

> **注意。** 系数也要乘括号里的常数，连同符号：$3(2x - 3)$ 是 $6x - 9$，所以下一步是两边加 $9$，而不是减 $9$。`,
      ),
      generate(rng) {
        let m: number;
        let A: number;
        let B: number;
        do {
          [m, A, B] = [rng.nonZero(-5, 5), rng.int(1, 6), rng.nonZero(-6, 6)];
        } while (A + B * m === 0);
        const b = rng.int(-8, 8);
        const C = rng.int(-15, 15);
        const x = Q.of(C - B * b, A + B * m);
        const y = x.mul(Q.of(m)).add(Q.of(b));
        const xs = Q.of(C + B * b, A + B * m);
        const [A2, B2, C2] = standardOf(A, B, C);
        const scale = A / A2;
        const sub = `${poly([A2, "x"])} ${B2 < 0 ? "-" : "+"} ${Math.abs(B2) === 1 ? "" : Math.abs(B2)}(${linear(m, b)}) = ${num(C2)}`;
        return pointProblem({
          prompt: t(
            `Find the point of intersection of the lines $${si(m, b)}$ and $${std(A2, B2, C2)}$.`,
            `求直线 $${si(m, b)}$ 与 $${std(A2, B2, C2)}$ 的交点。`,
          ),
          answer: [x, y],
          wrong: pairs([y, x], [xs, xs.mul(Q.of(m)).add(Q.of(b))]),
          solution: t(
            `**Substitute.** The first line gives $y$ as $${linear(m, b)}$, so put this expression, in parentheses, for $y$ in the second equation, multiply out and solve: ${steps(sub, `${poly([(A + B * m) / scale, "x"])} = ${num((C - B * b) / scale)}`, `x = ${num(x)}`)}**Find $y$.** $y = ${evalAt(m, x, b)} = ${num(y)}$, so the lines meet at $${pointLatex([x, y])}$.

**Check.** In the second equation: $${checkEq([A2, B2, C2], [x, y])}$.`,
            `**代入。** 第一条直线给出 $y = ${linear(m, b)}$，所以把第二个方程中的 $y$ 换成这个式子（加上括号），去括号并求解：${steps(sub, `${poly([(A + B * m) / scale, "x"])} = ${num((C - B * b) / scale)}`, `x = ${num(x)}`)}**求 $y$。** $y = ${evalAt(m, x, b)} = ${num(y)}$，所以两直线交于 $${pointLatex([x, y])}$。

**检验。** 代入第二个方程：$${checkEq([A2, B2, C2], [x, y])}$。`,
          ),
        });
      },
    },
    {
      id: "lines-through-given-points",
      title: t("A line given by two points", "由两点确定的直线"),
      explanation: t(
        `When a line is given by two of its points, first write its equation, then intersect. The slope is rise over run, and one of the points then gives the $y$-intercept.

The line through $(0, 1)$ and $(2, 7)$ has slope $\\frac{7 - 1}{2 - 0} = 3$ and passes through $(0, 1)$, so it is $y = 3x + 1$. With $y = -x + 9$ it meets where $3x + 1 = -x + 9$, so $4x = 8$, $x = 2$ and $y = 7$: at $(2, 7)$. Check: $-2 + 9 = 7$.

> **Watch out.** The slope is the change in $y$ over the change in $x$, $\\frac{6}{2}$, not $\\frac{2}{6}$. Subtract the coordinates in the same order on top and bottom.`,
        `当一条直线由它上面的两点给出时，先写出它的方程，再求交点。斜率是纵向变化除以横向变化，再用其中一点求出 $y$ 轴截距。

过 $(0, 1)$ 和 $(2, 7)$ 的直线斜率为 $\\frac{7 - 1}{2 - 0} = 3$，并经过 $(0, 1)$，所以是 $y = 3x + 1$。它与 $y = -x + 9$ 的交点满足 $3x + 1 = -x + 9$，所以 $4x = 8$，$x = 2$，$y = 7$：交点是 $(2, 7)$。检验：$-2 + 9 = 7$。

> **注意。** 斜率是 $y$ 的变化除以 $x$ 的变化，是 $\\frac{6}{2}$，不是 $\\frac{2}{6}$。分子分母中坐标相减的顺序要一致。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        let m1: number;
        let m2: number;
        let dx: number;
        do {
          [m1, m2, dx] = [rng.nonZero(-4, 4), rng.nonZero(-5, 5), rng.nonZero(-3, 3)];
        } while (m1 === m2 || Q.of(1, m1).eq(Q.of(m2)));
        const [x1, y1] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [x2, y2] = [x1 + dx, y1 + m1 * dx];
        const b1 = y1 - m1 * x1;
        const b2 = rng.int(-9, 9);
        const x = Q.of(b2 - b1, m1 - m2);
        const y = x.mul(Q.of(m1)).add(Q.of(b1));
        const inv = Q.of(1, m1);
        const binv = Q.of(y1).sub(inv.mul(Q.of(x1)));
        const xw = Q.of(b2)
          .sub(binv)
          .div(inv.sub(Q.of(m2)));
        return pointProblem({
          prompt: t(
            `Line $\\ell$ passes through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. Find the point where $\\ell$ intersects the line $${si(m2, b2)}$.`,
            `直线 $\\ell$ 经过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。求 $\\ell$ 与直线 $${si(m2, b2)}$ 的交点。`,
          ),
          answer: [x, y],
          wrong: pairs([y, x], [xw, xw.mul(Q.of(m2)).add(Q.of(b2))]),
          solution: t(
            `**Write the equation of $\\ell$.** Its slope is rise over run, $\\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = \\frac{${y2 - y1}}{${dx}} = ${m1}$. ${x1 === 0 ? `The point $${pointLatex([x1, y1])}$ is on the $y$-axis, so $b = ${b1}$` : `Putting $${pointLatex([x1, y1])}$ into $y = ${linear(m1, 0)} + b$ gives $${y1} = ${evalAt(m1, x1, 0)} + b$, so $b = ${b1}$`} and $\\ell$ is $${si(m1, b1)}$.

**Intersect.** Set the right sides equal and solve: ${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}**Find $y$.** $y = ${evalAt(m1, x, b1)} = ${num(y)}$, so the intersection is $${pointLatex([x, y])}$.

**Check.** The other line gives the same value: $${evalAt(m2, x, b2)} = ${num(y)}$.`,
            `**写出 $\\ell$ 的方程。** 斜率是纵向变化除以横向变化，$\\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = \\frac{${y2 - y1}}{${dx}} = ${m1}$。${x1 === 0 ? `点 $${pointLatex([x1, y1])}$ 在 $y$ 轴上，所以 $b = ${b1}$` : `把 $${pointLatex([x1, y1])}$ 代入 $y = ${linear(m1, 0)} + b$，得 $${y1} = ${evalAt(m1, x1, 0)} + b$，所以 $b = ${b1}$`}，$\\ell$ 为 $${si(m1, b1)}$。

**求交点。** 令右边相等并求解：${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}**求 $y$。** $y = ${evalAt(m1, x, b1)} = ${num(y)}$，所以交点是 $${pointLatex([x, y])}$。

**检验。** 另一条直线给出同样的值：$${evalAt(m2, x, b2)} = ${num(y)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Modeling ───────────────────────────────────────────────────────────────

/** Purchase is a context in which two kinds of items with different prices add up to a count and a total. */
interface Purchase {
  /** names are the two kinds, singular-free plural forms in English and Chinese. */
  readonly names: readonly [readonly [string, string], readonly [string, string]];
  readonly prices: readonly [number, number];
  readonly count: number;
  readonly total: number;
  readonly prompt: (ask: 0 | 1) => Text;
  readonly vars: Text;
}

/** purchase draws a context with two prices, a total count and a total value, and the counts of each kind. */
function purchase(rng: Rng): { p: Purchase; n: [number, number] } {
  const n: [number, number] = [rng.int(3, 40), rng.int(3, 40)];
  const ctx = rng.int(0, 3);
  if (ctx === 0) {
    let pa: number;
    let pc: number;
    do {
      [pa, pc] = [rng.int(8, 20), rng.int(4, 12)];
    } while (pa <= pc);
    const [N, R] = [n[0] + n[1], pa * n[0] + pc * n[1]];
    const names: Purchase["names"] = [
      ["adult tickets", "成人票"],
      ["child tickets", "儿童票"],
    ];
    return {
      n,
      p: {
        names,
        prices: [pa, pc],
        count: N,
        total: R,
        prompt: (ask) =>
          t(
            `A theater sold $${N}$ tickets for a total of $\\$${R}$. Adult tickets cost $\\$${pa}$ each and child tickets $\\$${pc}$ each. How many ${names[ask][0]} were sold?`,
            `剧院共售出 $${N}$ 张票，收入 $${R}$ 元。成人票每张 $${pa}$ 元，儿童票每张 $${pc}$ 元。售出了多少张${names[ask][1]}？`,
          ),
        vars: t("Let $x$ be the number of adult tickets and $y$ the number of child tickets.", "设成人票有 $x$ 张，儿童票有 $y$ 张。"),
      },
    };
  }
  if (ctx === 1) {
    const [N, L] = [n[0] + n[1], 2 * n[0] + 4 * n[1]];
    const names: Purchase["names"] = [
      ["chickens", "鸡"],
      ["rabbits", "兔"],
    ];
    return {
      n,
      p: {
        names,
        prices: [2, 4],
        count: N,
        total: L,
        prompt: (ask) =>
          t(
            `A farm keeps chickens and rabbits. Together they have $${N}$ heads and $${L}$ legs. How many ${names[ask][0]} are there?`,
            `鸡兔同笼，共有 $${N}$ 个头、$${L}$ 条腿。有多少只${names[ask][1]}？`,
          ),
        vars: t("Let $x$ be the number of chickens and $y$ the number of rabbits.", "设鸡有 $x$ 只，兔有 $y$ 只。"),
      },
    };
  }
  let pa: number;
  let pb: number;
  do {
    [pa, pb] = [rng.int(2, 9), rng.int(1, 6)];
  } while (pa === pb);
  const [N, R] = [n[0] + n[1], pa * n[0] + pb * n[1]];
  const names: Purchase["names"] =
    ctx === 2
      ? [
          ["notebooks", "笔记本"],
          ["pens", "钢笔"],
        ]
      : [
          ["large boxes", "大盒"],
          ["small boxes", "小盒"],
        ];
  return {
    n,
    p: {
      names,
      prices: [pa, pb],
      count: N,
      total: R,
      prompt: (ask) =>
        ctx === 2
          ? t(
              `A school bought $${N}$ notebooks and pens for $\\$${R}$. Notebooks cost $\\$${pa}$ each and pens $\\$${pb}$ each. How many ${names[ask][0]} did it buy?`,
              `学校花 $${R}$ 元买了笔记本和钢笔共 $${N}$ 件。笔记本每本 $${pa}$ 元，钢笔每支 $${pb}$ 元。买了多少${ask === 0 ? "本" : "支"}${names[ask][1]}？`,
            )
          : t(
              `A shop packed $${N}$ boxes of tea, large ones holding $${pa}$ bags and small ones holding $${pb}$ bags, $${R}$ bags in all. How many ${names[ask][0]} are there?`,
              `商店把茶包装成 $${N}$ 盒，大盒每盒 $${pa}$ 包，小盒每盒 $${pb}$ 包，共 $${R}$ 包。${names[ask][1]}有多少盒？`,
            ),
      vars:
        ctx === 2
          ? t("Let $x$ be the number of notebooks and $y$ the number of pens.", "设笔记本有 $x$ 本，钢笔有 $y$ 支。")
          : t("Let $x$ be the number of large boxes and $y$ the number of small boxes.", "设大盒有 $x$ 盒，小盒有 $y$ 盒。"),
    },
  };
}

export const modelingWithSystems: TopicDef = {
  id: "modeling-with-systems",
  title: t("Modeling Using Systems of Linear Equations", "用线性方程组建模"),
  summary: t("Write and solve systems of equations for problems about two unknown quantities.", "为含两个未知量的问题列出并解方程组。"),
  prerequisites: ["solving-systems-by-substitution", "elimination-with-one-transformation"],
  encompasses: [{ topic: "solving-systems-by-substitution", weight: 0.4 }],
  xp: 18,
  standards: ["CCSS.8.EE.C.8.C", "CCSS.HSA.CED.A.3"],
  intro: t(
    `We can now solve any system of two linear equations, by elimination or by substitution. Many questions in words are about two unknown quantities tied together by two facts, and each fact becomes one equation.

"Two numbers have sum $40$ and difference $6$." Call the larger $x$ and the smaller $y$. The first fact says $x + y = 40$ and the second $x - y = 6$. Adding them gives $2x = 46$, so $x = 23$, and then $y = 40 - 23 = 17$. The answer fits the words: $23 + 17 = 40$ and $23 - 17 = 6$.

The work always has the same shape: name the unknowns, write one equation for each fact, solve, and check the answer against the original words. In this lesson we model sums and differences, and counts and totals of two kinds of items.`,
    `我们已经会用消元法或代入法解任何由两个一次方程组成的方程组。很多文字题讨论的是由两个条件联系起来的两个未知量，每个条件就成为一个方程。

“两个数的和是 $40$，差是 $6$。”设较大的数为 $x$，较小的数为 $y$。第一个条件是 $x + y = 40$，第二个是 $x - y = 6$。两式相加得 $2x = 46$，所以 $x = 23$，再得 $y = 40 - 23 = 17$。答案符合题意：$23 + 17 = 40$，$23 - 17 = 6$。

做法总是一样的：设出未知数，每个条件列一个方程，求解，再用原来的文字检验答案。这节课我们为和与差、两类物品的数量与总值建立模型。`,
  ),
  knowledgePoints: [
    {
      id: "sum-and-difference",
      title: t("Two unknown numbers", "两个未知数"),
      explanation: t(
        `Name the two unknowns, translate each fact into an equation, and solve the system. "Two numbers have sum $40$ and difference $6$":

$$\\begin{cases} x + y = 40 \\\\ x - y = 6 \\end{cases} \\;\\Rightarrow\\; 2x = 46,\\; x = 23,\\; y = 17.$$

Other phrases translate the same way. "The larger number is $4$ more than twice the smaller" becomes $x = 2y + 4$: twice the smaller is $2y$, and $4$ more is $2y + 4$. Check the result against the words: $23 + 17 = 40$ and $23 - 17 = 6$.

> **Watch out.** Adding the equations gives $2x = 46$, so divide by $2$: $46$ is twice the larger number, not the number itself. Then answer the number that is asked for, larger or smaller.`,
        `设出两个未知数，把每个条件译成一个方程，再解方程组。“两个数的和是 $40$，差是 $6$”：

$$\\begin{cases} x + y = 40 \\\\ x - y = 6 \\end{cases} \\;\\Rightarrow\\; 2x = 46,\\; x = 23,\\; y = 17.$$

其他说法也这样翻译。“较大的数比较小的数的 $2$ 倍多 $4$”写成 $x = 2y + 4$：较小的数的 $2$ 倍是 $2y$，再多 $4$ 就是 $2y + 4$。用原来的文字检验结果：$23 + 17 = 40$，$23 - 17 = 6$。

> **注意。** 两式相加得 $2x = 46$，要除以 $2$：$46$ 是较大的数的两倍，不是这个数本身。还要回答题目问的是哪个数，较大的还是较小的。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const y = rng.int(-20, 40);
          const x = y + rng.int(1, 30);
          const [S, D] = [x + y, x - y];
          const larger = rng.bool();
          return numberProblem({
            prompt: larger
              ? t(
                  `Two numbers have a sum of $${S}$ and a difference of $${D}$. Find the larger number.`,
                  `两个数的和是 $${S}$，差是 $${D}$。求较大的数。`,
                )
              : t(
                  `Two numbers have a sum of $${S}$ and a difference of $${D}$. Find the smaller number.`,
                  `两个数的和是 $${S}$，差是 $${D}$。求较小的数。`,
                ),
            answer: larger ? x : y,
            wrong: [larger ? y : x, S + D, S - D],
            solution: t(
              `**Write the system.** Let $x$ be the larger number and $y$ the smaller. The sum and the difference each give an equation: ${steps(system(`x + y = ${S}`, `x - y = ${D}`))}**Eliminate $y$.** Adding the equations cancels $y$: $2x = ${S + D}$, so $x = ${x}$. Then $y = ${S} - ${paren(x)} = ${y}$. The ${larger ? "larger" : "smaller"} number is $${larger ? x : y}$.

**Check.** $${x} + ${paren(y)} = ${S}$ and $${x} - ${paren(y)} = ${D}$.`,
              `**列方程组。** 设较大的数为 $x$，较小的数为 $y$。和与差各给出一个方程：${steps(system(`x + y = ${S}`, `x - y = ${D}`))}**消去 $y$。** 两式相加，$y$ 抵消：$2x = ${S + D}$，所以 $x = ${x}$。于是 $y = ${S} - ${paren(x)} = ${y}$。${larger ? "较大" : "较小"}的数是 $${larger ? x : y}$。

**检验。** $${x} + ${paren(y)} = ${S}$，$${x} - ${paren(y)} = ${D}$。`,
            ),
          });
        }
        const c = rng.int(2, 5);
        const k = rng.int(1, 12);
        const y = rng.int(2, 25);
        const x = c * y + k;
        const S = x + y;
        const larger = rng.bool();
        return numberProblem({
          prompt: larger
            ? t(
                `The sum of two numbers is $${S}$. The larger is $${k}$ more than $${c}$ times the smaller. Find the larger number.`,
                `两个数的和是 $${S}$，较大的数比较小的数的 $${c}$ 倍多 $${k}$。求较大的数。`,
              )
            : t(
                `The sum of two numbers is $${S}$. The larger is $${k}$ more than $${c}$ times the smaller. Find the smaller number.`,
                `两个数的和是 $${S}$，较大的数比较小的数的 $${c}$ 倍多 $${k}$。求较小的数。`,
              ),
          answer: larger ? x : y,
          wrong: [larger ? y : x, Q.of(S + k, c + 1), Q.of(S - k, c)],
          solution: t(
            `**Write the system.** Let $x$ be the larger number and $y$ the smaller. The sum gives $x + y = ${S}$, and "$${k}$ more than $${c}$ times the smaller" gives $x = ${c}y + ${k}$.

**Substitute.** Replace $x$ in the first equation by $${c}y + ${k}$: ${steps(`${c}y + ${k} + y = ${S}`, `${c + 1}y = ${S - k}`, `y = ${y}`)}Then $x = ${c} \\cdot ${y} + ${k} = ${x}$. The ${larger ? "larger" : "smaller"} number is $${larger ? x : y}$.

**Check.** $${x} + ${y} = ${S}$, and $${x}$ is $${k}$ more than $${c} \\cdot ${y} = ${c * y}$.`,
            `**列方程组。** 设较大的数为 $x$，较小的数为 $y$。由和得 $x + y = ${S}$，由“比较小的数的 $${c}$ 倍多 $${k}$”得 $x = ${c}y + ${k}$。

**代入。** 把第一个方程中的 $x$ 换成 $${c}y + ${k}$：${steps(`${c}y + ${k} + y = ${S}`, `${c + 1}y = ${S - k}`, `y = ${y}`)}所以 $x = ${c} \\cdot ${y} + ${k} = ${x}$。${larger ? "较大" : "较小"}的数是 $${larger ? x : y}$。

**检验。** $${x} + ${y} = ${S}$，而 $${x}$ 比 $${c} \\cdot ${y} = ${c * y}$ 多 $${k}$。`,
          ),
        });
      },
    },
    {
      id: "counts-and-totals",
      title: t("Counts and totals", "数量与总值"),
      explanation: t(
        `Many problems give the total **number** of items of two kinds and their total **value**. One equation counts the items, the other adds up each count times its own value:

$120$ tickets, adults $\\$9$, children $\\$5$, $\\$840$ in all:

$$\\begin{cases} x + y = 120 \\\\ 9x + 5y = 840 \\end{cases}$$

Multiply the first equation by $5$, $5x + 5y = 600$, and subtract it from the second: $4x = 240$, so $x = 60$ adult tickets and $y = 60$ child tickets. Check: $9 \\cdot 60 + 5 \\cdot 60 = 540 + 300 = 840$.

> **Watch out.** Dividing the total by the sum of the prices, $\\frac{840}{14}$, does not give either count. Solve the system, and answer the kind of item the question asks about.`,
        `很多问题给出两类物品的总**数量**和总**价值**。一个方程数物品的个数，另一个方程把每类的个数乘以各自的值再相加：

共 $120$ 张票，成人票 $9$ 元，儿童票 $5$ 元，共收入 $840$ 元：

$$\\begin{cases} x + y = 120 \\\\ 9x + 5y = 840 \\end{cases}$$

第一个方程乘以 $5$ 得 $5x + 5y = 600$，再用第二个方程减去它：$4x = 240$，所以成人票 $x = 60$ 张，儿童票 $y = 60$ 张。检验：$9 \\cdot 60 + 5 \\cdot 60 = 540 + 300 = 840$。

> **注意。** 用总价除以单价之和，$\\frac{840}{14}$，得到的不是任何一类的个数。要解方程组，并回答题目问的那一类物品。`,
      ),
      generate(rng) {
        const { p, n } = purchase(rng);
        const ask: 0 | 1 = rng.bool() ? 0 : 1;
        const [pa, pb] = p.prices;
        const sys = system(`x + y = ${p.count}`, `${poly([pa, "x"], [pb, "y"])} = ${p.total}`);
        return numberProblem({
          prompt: p.prompt(ask),
          answer: n[ask],
          wrong: [n[1 - ask]!, Q.of(p.total, pa + pb), Q.of(p.total + pb * p.count, pa - pb)],
          solution: t(
            `**Write the system.** ${p.vars.en} One equation counts, the other adds up each count times its own value: ${steps(sys)}**Eliminate $y$.** Multiply the first equation by $${pb}$, giving $${pb}x + ${pb}y = ${pb * p.count}$, and subtract it from the second: $${poly([pa - pb, "x"])} = ${p.total} - ${pb * p.count} = ${p.total - pb * p.count}$, so $x = ${n[0]}$ and $y = ${p.count} - ${n[0]} = ${n[1]}$. There are $${n[ask]}$ ${p.names[ask][0]}.

**Check.** $${n[0]} + ${n[1]} = ${p.count}$, and $${pa} \\cdot ${n[0]} + ${pb} \\cdot ${n[1]} = ${pa * n[0]} + ${pb * n[1]} = ${p.total}$.`,
            `**列方程组。** ${p.vars["zh-CN"]}一个方程表示数量，另一个方程把每类的个数乘以各自的值再相加：${steps(sys)}**消去 $y$。** 第一个方程乘以 $${pb}$ 得 $${pb}x + ${pb}y = ${pb * p.count}$，再用第二个方程减去它：$${poly([pa - pb, "x"])} = ${p.total} - ${pb * p.count} = ${p.total - pb * p.count}$，所以 $x = ${n[0]}$，$y = ${p.count} - ${n[0]} = ${n[1]}$。${p.names[ask][1]}有 $${n[ask]}$ 个。

**检验。** $${n[0]} + ${n[1]} = ${p.count}$，$${pa} \\cdot ${n[0]} + ${pb} \\cdot ${n[1]} = ${pa * n[0]} + ${pb * n[1]} = ${p.total}$。`,
          ),
        });
      },
    },
    {
      id: "writing-the-system",
      title: t("Writing the system", "列出方程组"),
      explanation: t(
        `Before solving, check that each equation says something true about the situation. The counting equation adds numbers of items, so its right side is the total count. The value equation multiplies each count by **its own** price or size, so its right side is the total value.

For $120$ tickets at $\\$9$ for adults ($x$) and $\\$5$ for children ($y$), $\\$840$ in all, the system is $x + y = 120$ and $9x + 5y = 840$. Reading it back: "the tickets number $120$" and "adult tickets bring $9$ each, child tickets $5$ each, $840$ in all". Both are true.

> **Watch out.** Swapping the two totals, or attaching the adult price to $y$, still gives a tidy-looking system, but it describes a different situation. Read each equation back in words.`,
        `求解之前，要检查每个方程都正确描述了情境。数量方程把物品的个数相加，右边是总个数。价值方程把每类物品的个数乘以**它自己的**单价或规格，右边是总值。

$120$ 张票，成人票（$x$ 张）$9$ 元，儿童票（$y$ 张）$5$ 元，共收入 $840$ 元，方程组是 $x + y = 120$ 和 $9x + 5y = 840$。读回文字：“票共有 $120$ 张”，“成人票每张 $9$ 元，儿童票每张 $5$ 元，共 $840$ 元”。两句都对。

> **注意。** 把两个总数对调，或者把成人票价配给 $y$，得到的方程组看起来也很整齐，但描述的是另一种情境。要把每个方程读回成文字检查。`,
      ),
      generate(rng) {
        const { p, n } = purchase(rng);
        const [pa, pb] = p.prices;
        const N = p.count;
        const R = p.total;
        const candidates = [
          system(`x + y = ${N}`, `${poly([pa, "x"], [pb, "y"])} = ${R}`),
          system(`x + y = ${N}`, `${poly([pb, "x"], [pa, "y"])} = ${R}`),
          system(`x + y = ${R}`, `${poly([pa, "x"], [pb, "y"])} = ${N}`),
          system(`${poly([pa, "x"], [pb, "y"])} = ${N}`, `x + y = ${R}`),
          system(`x + y = ${N}`, `${pa + pb}(x + y) = ${R}`),
        ];
        const options = rng.shuffle([0, ...rng.sample([1, 2, 3, 4], 3)]);
        const correct = options.indexOf(0);
        return choiceProblem({
          prompt: t(
            `${p.prompt(0).en.replace(/ How many [^?]*\?$/, "")} ${p.vars.en} Which system models the situation?`,
            `${p.prompt(0)["zh-CN"].replace(/[^。]*？$/, "")}${p.vars["zh-CN"]}哪个方程组符合题意？`,
          ),
          options: options.map((i) => same(`$${candidates[i]!}$`)),
          correct,
          solution: t(
            `**The count.** The numbers of items add up to $${N}$: $x + y = ${N}$.

**The total.** Each of the $x$ ${p.names[0][0]} contributes $${pa}$ and each of the $y$ ${p.names[1][0]} contributes $${pb}$, for $${R}$ in all: $${poly([pa, "x"], [pb, "y"])} = ${R}$. The system with both of these equations is the answer.

**Check.** The actual counts, $x = ${n[0]}$ and $y = ${n[1]}$, fit it: $${n[0]} + ${n[1]} = ${N}$ and $${pa} \\cdot ${n[0]} + ${pb} \\cdot ${n[1]} = ${R}$.`,
            `**数量。** 物品的个数之和是 $${N}$：$x + y = ${N}$。

**总值。** $x$ 个${p.names[0][1]}每个贡献 $${pa}$，$y$ 个${p.names[1][1]}每个贡献 $${pb}$，合计 $${R}$：$${poly([pa, "x"], [pb, "y"])} = ${R}$。含有这两个方程的方程组就是答案。

**检验。** 实际的个数 $x = ${n[0]}$，$y = ${n[1]}$ 满足它：$${n[0]} + ${n[1]} = ${N}$，$${pa} \\cdot ${n[0]} + ${pb} \\cdot ${n[1]} = ${R}$。`,
          ),
        });
      },
    },
  ],
};

/** money writes an amount in cents as dollars with two decimals: "3.45". */
const money = (cents: number) => `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;

const coinValues = [5, 10, 25, 50] as const;

export const coinProblems: TopicDef = {
  id: "coin-problems",
  title: t("Modeling Coin Problems Using Systems of Linear Equations", "用方程组解硬币问题"),
  summary: t("Find how many coins of each kind make up a sum of money.", "求一笔钱由每种硬币各多少枚组成。"),
  prerequisites: ["modeling-with-systems", "decimal-arithmetic"],
  encompasses: [{ topic: "modeling-with-systems", weight: 0.6 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.3"],
  intro: t(
    `A pile of coins has a count and a value, and these give the two equations of a system, just as tickets do. The value of a group of coins is the value of one coin times their number: $8$ coins of $25$ cents are worth $8 \\cdot 25 = 200$ cents.

Say a jar holds $30$ coins, all $5$-cent and $25$-cent coins, worth $\\$3.10$. Working in cents keeps every number whole: $\\$3.10$ is $310$ cents. With $n$ coins of $5$ cents and $q$ of $25$ cents,

$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$

Five times the first equation is $5n + 5q = 150$; subtracting it from the second gives $20q = 160$, so $q = 8$ and $n = 22$. Check: $5 \\cdot 22 + 25 \\cdot 8 = 110 + 200 = 310$. In this lesson we count coins of two kinds, and use a relation between the counts when one is given.`,
    `一堆硬币有个数，也有价值，就像票一样，这两者给出方程组的两个方程。一组硬币的价值是一枚的面值乘以枚数：$8$ 枚 $25$ 分硬币值 $8 \\cdot 25 = 200$ 分。

比如罐子里有 $30$ 枚硬币，都是 $5$ 分和 $25$ 分的，共 $3.10$ 元。以分为单位，所有数都是整数：$3.10$ 元就是 $310$ 分。设 $5$ 分硬币有 $n$ 枚，$25$ 分硬币有 $q$ 枚：

$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$

第一个方程乘以 $5$ 是 $5n + 5q = 150$，用第二个方程减去它得 $20q = 160$，所以 $q = 8$，$n = 22$。检验：$5 \\cdot 22 + 25 \\cdot 8 = 110 + 200 = 310$。这节课我们数两种硬币的枚数，并在给出枚数之间的关系时利用它。`,
  ),
  knowledgePoints: [
    {
      id: "number-of-coins",
      title: t("Counting coins", "数硬币"),
      explanation: t(
        `Work in cents so that every coefficient is an integer. One equation counts the coins; the other adds up their values, each count times the value of one coin. A jar of $30$ coins, all $5$-cent and $25$-cent coins, worth $\\$3.10$ (that is, $310$ cents):

$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$

Multiply the first equation by $5$ and subtract: $20q = 160$, so $q = 8$ and $n = 22$. Check: $22 + 8 = 30$ and $110 + 200 = 310$.

> **Watch out.** Convert the dollars to cents before writing the value equation: $\\$3.10$ is $310$ cents, not $3.10$ or $31$. And dividing the value by the sum of the coin values does not give a count.`,
        `以“分”为单位计算，使所有系数都是整数。一个方程数硬币的枚数，另一个方程把价值相加，每种的枚数乘以一枚的面值。罐子里有 $30$ 枚硬币，都是 $5$ 分和 $25$ 分的，共 $3.10$ 元（即 $310$ 分）：

$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$

第一个方程乘以 $5$ 再相减：$20q = 160$，所以 $q = 8$，$n = 22$。检验：$22 + 8 = 30$，$110 + 200 = 310$。

> **注意。** 列价值方程之前，先把元换算成分：$3.10$ 元是 $310$ 分，不是 $3.10$，也不是 $31$。用总价值除以面值之和，得到的不是枚数。`,
      ),
      keyPrerequisites: ["decimal-arithmetic"],
      generate(rng) {
        const [v1, v2] = rng.sample(coinValues, 2).sort((a, b) => a - b) as [number, number];
        const n: [number, number] = [rng.int(2, 30), rng.int(2, 30)];
        const N = n[0] + n[1];
        const V = v1 * n[0] + v2 * n[1];
        const ask: 0 | 1 = rng.bool() ? 0 : 1;
        const vs = [v1, v2];
        const sys = system(`a + b = ${N}`, `${v1}a + ${v2}b = ${V}`);
        return numberProblem({
          prompt: t(
            `A jar holds $${N}$ coins, all $${v1}$-cent and $${v2}$-cent coins, worth $\\$${money(V)}$ in all. How many ${vs[ask]}-cent coins are there?`,
            `罐子里有 $${N}$ 枚硬币，都是 $${v1}$ 分和 $${v2}$ 分的，共 $${money(V)}$ 元。${vs[ask]} 分的硬币有多少枚？`,
          ),
          answer: n[ask],
          wrong: [n[1 - ask]!, Q.of(V, v1 + v2), Q.of(V, vs[ask]!)],
          solution: t(
            `**Write the system.** Let $a$ be the number of ${v1}-cent coins and $b$ the number of ${v2}-cent coins. Work in cents, so $\\$${money(V)}$ is $${V}$ cents. One equation counts coins, the other adds up their values: ${steps(sys)}**Eliminate $a$.** Multiply the first equation by $${v1}$, giving $${v1}a + ${v1}b = ${v1 * N}$, and subtract it from the second: $${v2 - v1}b = ${V} - ${v1 * N} = ${V - v1 * N}$, so $b = ${n[1]}$ and $a = ${N} - ${n[1]} = ${n[0]}$. So there are $${n[ask]}$ coins of ${vs[ask]} cents.

**Check.** $${n[0]} + ${n[1]} = ${N}$ coins, worth $${v1} \\cdot ${n[0]} + ${v2} \\cdot ${n[1]} = ${v1 * n[0]} + ${v2 * n[1]} = ${V}$ cents.`,
            `**列方程组。** 设 ${v1} 分硬币有 $a$ 枚，${v2} 分硬币有 $b$ 枚。以分为单位，$${money(V)}$ 元就是 $${V}$ 分。一个方程数硬币，另一个方程把面值相加：${steps(sys)}**消去 $a$。** 第一个方程乘以 $${v1}$ 得 $${v1}a + ${v1}b = ${v1 * N}$，再用第二个方程减去它：$${v2 - v1}b = ${V} - ${v1 * N} = ${V - v1 * N}$，所以 $b = ${n[1]}$，$a = ${N} - ${n[1]} = ${n[0]}$。${vs[ask]} 分的硬币有 $${n[ask]}$ 枚。

**检验。** 共 $${n[0]} + ${n[1]} = ${N}$ 枚，价值 $${v1} \\cdot ${n[0]} + ${v2} \\cdot ${n[1]} = ${v1 * n[0]} + ${v2 * n[1]} = ${V}$ 分。`,
          ),
        });
      },
    },
    {
      id: "coins-with-a-relation",
      title: t("Coins related by a condition", "有附加条件的硬币问题"),
      explanation: t(
        `Sometimes the number of one kind of coin is described in terms of the other. Then that description is one equation, already solved for a variable, and substituting it into the value equation leaves one unknown. "There are $4$ more dimes than quarters" gives $d = q + 4$; with a value of $425$ cents,

$$10(q + 4) + 25q = 425 \\;\\Rightarrow\\; 35q + 40 = 425 \\;\\Rightarrow\\; 35q = 385 \\;\\Rightarrow\\; q = 11,\\; d = 15.$$

Check: $10 \\cdot 15 + 25 \\cdot 11 = 150 + 275 = 425$, and $15$ is $4$ more than $11$.

> **Watch out.** "$4$ more dimes than quarters" adds the $4$ to the quarters: $d = q + 4$. And the coin value multiplies the whole of $q + 4$: $10(q + 4) = 10q + 40$, not $10q + 4$.`,
        `有时一种硬币的枚数是用另一种来描述的。这个描述就是一个已经解出某个变量的方程，把它代入价值方程，就只剩一个未知数。“$10$ 分硬币比 $25$ 分硬币多 $4$ 枚”给出 $d = q + 4$；总价值 $425$ 分时，

$$10(q + 4) + 25q = 425 \\;\\Rightarrow\\; 35q + 40 = 425 \\;\\Rightarrow\\; 35q = 385 \\;\\Rightarrow\\; q = 11,\\; d = 15.$$

检验：$10 \\cdot 15 + 25 \\cdot 11 = 150 + 275 = 425$，而 $15$ 比 $11$ 多 $4$。

> **注意。** “$10$ 分硬币比 $25$ 分硬币多 $4$ 枚”是在 $25$ 分硬币的枚数上加 $4$：$d = q + 4$。面值要乘整个 $q + 4$：$10(q + 4) = 10q + 40$，不是 $10q + 4$。`,
      ),
      generate(rng) {
        const [v1, v2] = rng.sample(coinValues, 2).sort((a, b) => a - b) as [number, number];
        const b = rng.int(2, 20);
        const twice = rng.bool();
        const k = twice ? rng.int(2, 3) : rng.int(1, 12);
        const a = twice ? k * b : b + k;
        const V = v1 * a + v2 * b;
        const ask: 0 | 1 = rng.bool() ? 0 : 1;
        const vs = [v1, v2];
        const answer = ask === 0 ? a : b;
        const relEn = twice
          ? `$${k}$ times as many $${v1}$-cent coins as $${v2}$-cent coins`
          : `$${k}$ more $${v1}$-cent coins than $${v2}$-cent coins`;
        const relZh = twice ? `$${v1}$ 分硬币的枚数是 $${v2}$ 分硬币的 $${k}$ 倍` : `$${v1}$ 分硬币比 $${v2}$ 分硬币多 $${k}$ 枚`;
        const rel = twice ? `a = ${k}b` : `a = b + ${k}`;
        const subst = twice ? `${v1} \\cdot ${k}b + ${v2}b = ${V}` : `${v1}(b + ${k}) + ${v2}b = ${V}`;
        const coef = twice ? v1 * k + v2 : v1 + v2;
        const rhs = twice ? V : V - v1 * k;
        const slip = twice ? Q.of(V, k + v2) : Q.of(V - k, v1 + v2);
        return numberProblem({
          prompt: t(
            `A purse holds only $${v1}$-cent and $${v2}$-cent coins, worth $\\$${money(V)}$ in all. There are ${relEn}. How many ${vs[ask]}-cent coins are there?`,
            `钱包里只有 $${v1}$ 分和 $${v2}$ 分的硬币，共 $${money(V)}$ 元。${relZh}。${vs[ask]} 分的硬币有多少枚？`,
          ),
          answer,
          wrong: [ask === 0 ? b : a, ask === 0 ? slip.add(Q.of(twice ? 0 : k)) : slip, twice ? Q.of(V, v1 + v2) : b + k + 1],
          solution: t(
            `**Write the equations.** Let $a$ be the number of ${v1}-cent coins and $b$ the number of ${v2}-cent coins. The relation gives $${rel}$, and the value in cents gives $${v1}a + ${v2}b = ${V}$.

**Substitute.** Replace $a$ in the value equation by ${twice ? `$${k}b$` : `$b + ${k}$, in parentheses`}: ${steps(subst, `${coef}b = ${rhs}`, `b = ${b}`)}so $a = ${twice ? `${k} \\cdot ${b}` : `${b} + ${k}`} = ${a}$. So there are $${answer}$ coins of ${vs[ask]} cents.

**Check.** $${v1} \\cdot ${a} + ${v2} \\cdot ${b} = ${v1 * a} + ${v2 * b} = ${V}$ cents, and $${a}$ is ${twice ? `$${k}$ times $${b}$` : `$${k}$ more than $${b}$`}.`,
            `**列方程。** 设 ${v1} 分硬币有 $a$ 枚，${v2} 分硬币有 $b$ 枚。由数量关系得 $${rel}$，由总价值（以分为单位）得 $${v1}a + ${v2}b = ${V}$。

**代入。** 把价值方程中的 $a$ 换成${twice ? ` $${k}b$` : ` $b + ${k}$（加上括号）`}：${steps(subst, `${coef}b = ${rhs}`, `b = ${b}`)}所以 $a = ${twice ? `${k} \\cdot ${b}` : `${b} + ${k}`} = ${a}$。${vs[ask]} 分的硬币有 $${answer}$ 枚。

**检验。** $${v1} \\cdot ${a} + ${v2} \\cdot ${b} = ${v1 * a} + ${v2 * b} = ${V}$ 分，而 $${a}$ ${twice ? `是 $${b}$ 的 $${k}$ 倍` : `比 $${b}$ 多 $${k}$`}。`,
          ),
        });
      },
    },
  ],
};

/** lineTopics are the topics on the coordinate plane, lines and systems of linear equations, in teaching order. */
export const lineTopics: readonly TopicDef[] = [
  theCoordinatePlane,
  slopeOfALine,
  slopeInterceptForm,
  propertiesOfLinesInSlopeInterceptForm,
  pointSlopeForm,
  standardForm,
  propertiesOfLinesInStandardForm,
  parallelLinesInTheCoordinatePlane,
  perpendicularLinesInTheCoordinatePlane,
  systemsOfLinearEquations,
  introductionToElimination,
  eliminationWithOneTransformation,
  eliminationWithTwoTransformations,
  systemsWithFractionalCoefficients,
  systemsWithDecimalCoefficients,
  systemsWithNoSolutionOrInfinitelyManySolutions,
  consistencyAndDependency,
  solvingSystemsBySubstitution,
  intersectionOfTwoLines,
  modelingWithSystems,
  coinProblems,
];
