import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, linear, num, type PlaneMark, type PlaneView, paren, plane, poly, Q } from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, yesNo } from "../problems.ts";

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
  `${linear(1, toQ(k).neg(), "y")} = ${coefficient(m)}(${linear(1, toQ(h).neg())})`;

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
  const head = `${num(m)} \\cdot ${paren(x)}`;
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
  const mul =
    f1 !== 1 && f2 !== 1
      ? t(
          `Multiply the first equation by $${f1}$ and the second by $${f2}$: ${steps(eqOf(s1), eqOf(s2))}`,
          `第一个方程乘以 $${f1}$，第二个方程乘以 $${f2}$：${steps(eqOf(s1), eqOf(s2))}`,
        )
      : f1 !== 1
        ? t(`Multiply the first equation by $${f1}$: ${steps(eqOf(s1))}`, `第一个方程乘以 $${f1}$：${steps(eqOf(s1))}`)
        : f2 !== 1
          ? t(`Multiply the second equation by $${f2}$: ${steps(eqOf(s2))}`, `第二个方程乘以 $${f2}$：${steps(eqOf(s2))}`)
          : t("", "");
  const elimSteps = steps(`${poly([k, kv])} = ${num(r)}`, `${kv} = ${num(K)}`);
  const backSteps = steps(
    ...(K.isZero() ? [] : [`${poly([e1[elim], ev], [Q.of(e1[keep]).mul(K), ""])} = ${num(e1[2])}`]),
    `${poly([e1[elim], ev])} = ${num(rest)}`,
    `${ev} = ${num(E)}`,
  );
  return t(
    `${mul.en}${add ? "Add the equations" : "Subtract the second equation from the first"} to eliminate $${ev}$: ${elimSteps}Substitute $${kv} = ${num(K)}$ into the first equation: ${backSteps}The solution is $${pointLatex(sol)}$.`,
    `${mul["zh-CN"]}${add ? "两个方程相加" : "第一个方程减去第二个方程"}，消去 $${ev}$：${elimSteps}把 $${kv} = ${num(K)}$ 代入第一个方程：${backSteps}方程组的解是 $${pointLatex(sol)}$。`,
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

/** walk describes the moves from the origin to (x, y). */
function walk(x: number, y: number): Text {
  const h =
    x === 0
      ? ["no steps left or right", "不左右移动"]
      : x > 0
        ? [`${x} to the right`, `向右 ${x} 格`]
        : [`${-x} to the left`, `向左 ${-x} 格`];
  const v = y === 0 ? ["no steps up or down", "不上下移动"] : y > 0 ? [`${y} up`, `向上 ${y} 格`] : [`${-y} down`, `向下 ${-y} 格`];
  return t(`from the origin, go ${h[0]} and ${v[0]}`, `从原点出发，${h[1]}，${v[1]}`);
}

// ─── The coordinate plane ─────────────────────────────────────────────────────

const quadrantOptions: readonly Text[] = [
  t("Quadrant I", "第一象限"),
  t("Quadrant II", "第二象限"),
  t("Quadrant III", "第三象限"),
  t("Quadrant IV", "第四象限"),
  t("On an axis", "在坐标轴上"),
];

export const theCoordinatePlane: TopicDef = {
  id: "the-coordinate-plane",
  title: t("The Coordinate Plane", "平面直角坐标系"),
  summary: t(
    "Name and locate points by their coordinates, and tell the quadrant of a point.",
    "用坐标表示和确定点的位置，判断点所在的象限。",
  ),
  prerequisites: ["integers-and-opposites"],
  encompasses: [{ topic: "integers-and-opposites", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.5.G.A.1", "CCSS.6.NS.C.6", "CCSS.6.NS.C.8"],
  knowledgePoints: [
    {
      id: "reading-coordinates",
      title: t("Reading coordinates", "读出点的坐标"),
      explanation: t(
        "The **coordinate plane** is formed by two perpendicular number lines: the horizontal **$x$-axis** and the vertical **$y$-axis**, which cross at the **origin** $(0, 0)$.\n\nEvery point has an **ordered pair** of coordinates $(x, y)$: $x$ tells how far to go right (positive) or left (negative) from the origin, and $y$ how far to go up (positive) or down (negative). The $x$-coordinate always comes first.\n\nFor example, to reach $(-3, 2)$, go $3$ to the left and $2$ up. A point on the $y$-axis has $x$-coordinate $0$, such as $(0, -4)$.",
        "**平面直角坐标系**由两条互相垂直的数轴组成：水平的 **$x$ 轴**和竖直的 **$y$ 轴**，它们相交于**原点** $(0, 0)$。\n\n每个点都有一个**有序数对**作为坐标 $(x, y)$：$x$ 表示从原点向右（正）或向左（负）走多远，$y$ 表示向上（正）或向下（负）走多远。$x$ 坐标总是写在前面。\n\n例如，到达 $(-3, 2)$ 要向左走 $3$，再向上走 $2$。$y$ 轴上的点的 $x$ 坐标是 $0$，例如 $(0, -4)$。",
      ),
      keyPrerequisites: ["integers-and-opposites"],
      generate(rng) {
        const x = rng.int(-5, 5);
        const y = x === 0 ? rng.nonZero(-5, 5) : rng.int(-5, 5);
        const name = rng.pick(["P", "A", "B", "Q"]);
        const w = walk(x, y);
        return {
          ...pointProblem({
            prompt: t(`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`),
            answer: [x, y],
            wrong: [
              [y, x],
              [-x, y],
              [x, -y],
            ],
            solution: t(
              `To reach $${name}$, ${w.en}, so $${name} = ${pointLatex([x, y])}$.`,
              `要到达点 $${name}$，${w["zh-CN"]}，所以 $${name} = ${pointLatex([x, y])}$。`,
            ),
          }),
          figure: graph(
            [{ kind: "point", at: [x, y], label: name, accent: true }],
            `A point ${name} on a coordinate grid.`,
            `坐标网格上的一个点 ${name}。`,
          ),
        };
      },
    },
    {
      id: "locating-points",
      title: t("Locating a point", "找到给定坐标的点"),
      explanation: t(
        "To locate the point $(x, y)$, start at the origin, move $x$ units along the $x$-axis, then $y$ units parallel to the $y$-axis.\n\nOrder matters: $(2, -5)$ is $2$ right and $5$ down, while $(-5, 2)$ is $5$ left and $2$ up.",
        "要找到点 $(x, y)$，从原点出发，先沿 $x$ 轴方向移动 $x$ 个单位，再沿 $y$ 轴方向移动 $y$ 个单位。\n\n顺序很重要：$(2, -5)$ 是向右 $2$、向下 $5$，而 $(-5, 2)$ 是向左 $5$、向上 $2$。",
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
        const w = walk(a, b);
        return {
          ...choiceProblem({
            prompt: t(`Which point is at $${pointLatex([a, b])}$?`, `哪个点的坐标是 $${pointLatex([a, b])}$？`),
            options: names.map((n) => same(n)),
            correct,
            solution: t(
              `${w.en[0]!.toUpperCase()}${w.en.slice(1)}: that is point $${names[correct]}$.`,
              `${w["zh-CN"]}，到达的是点 $${names[correct]}$。`,
            ),
          }),
          figure: graph(
            points.map(([x, y], i) => ({ kind: "point", at: [x, y], label: names[i]!, accent: true })),
            "Four points A, B, C and D on a coordinate grid.",
            "坐标网格上的四个点 A、B、C、D。",
          ),
        };
      },
    },
    {
      id: "quadrants",
      title: t("Quadrants", "象限"),
      explanation: t(
        "The axes divide the plane into four **quadrants**, numbered counterclockwise from the upper right:\n\n- Quadrant I: $x > 0$, $y > 0$\n- Quadrant II: $x < 0$, $y > 0$\n- Quadrant III: $x < 0$, $y < 0$\n- Quadrant IV: $x > 0$, $y < 0$\n\nA point with a coordinate equal to $0$ lies on an axis and is in no quadrant.",
        "两条坐标轴把平面分成四个**象限**，从右上方开始按逆时针方向编号：\n\n- 第一象限：$x > 0$，$y > 0$\n- 第二象限：$x < 0$，$y > 0$\n- 第三象限：$x < 0$，$y < 0$\n- 第四象限：$x > 0$，$y < 0$\n\n有一个坐标为 $0$ 的点在坐标轴上，不属于任何象限。",
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
        const reason = onAxis
          ? t(
              `Its ${x === 0 ? "$x$" : "$y$"}-coordinate is $0$, so the point lies on the ${x === 0 ? "$y$" : "$x$"}-axis.`,
              `它的 ${x === 0 ? "$x$" : "$y$"} 坐标是 $0$，所以这个点在 ${x === 0 ? "$y$" : "$x$"} 轴上。`,
            )
          : t(
              `Its $x$-coordinate is ${sign(x).en} and its $y$-coordinate is ${sign(y).en}, so it is in ${quadrantOptions[correct]!.en}.`,
              `它的 $x$ 坐标是${sign(x)["zh-CN"]}，$y$ 坐标是${sign(y)["zh-CN"]}，所以在${quadrantOptions[correct]!["zh-CN"]}。`,
            );
        return choiceProblem({
          prompt: t(`Where does the point $${pointLatex([x, y])}$ lie?`, `点 $${pointLatex([x, y])}$ 在哪里？`),
          options: quadrantOptions,
          correct,
          solution: reason,
        });
      },
    },
  ],
};

// ─── Slope ──────────────────────────────────────────────────────────────────

const slopeKinds: readonly Text[] = [t("Positive", "正数"), t("Negative", "负数"), t("Zero", "零"), t("Undefined", "不存在")];

export const slopeOfALine: TopicDef = {
  id: "slope-of-a-line",
  title: t("Slope of a Line", "直线的斜率"),
  summary: t("Find the slope of a line from its graph or from two of its points.", "由图像或直线上的两点求直线的斜率。"),
  prerequisites: ["the-coordinate-plane", "operations-with-rational-numbers"],
  encompasses: [
    { topic: "the-coordinate-plane", weight: 0.3 },
    { topic: "subtracting-integers", weight: 0.3 },
    { topic: "operations-with-rational-numbers", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.B.6", "CCSS.8.F.B.4"],
  knowledgePoints: [
    {
      id: "slope-from-a-graph",
      title: t("Rise over run", "纵向变化比横向变化"),
      explanation: t(
        "The **slope** $m$ of a line measures its steepness. Between two points of the line, the **run** is the horizontal change and the **rise** is the vertical change:\n\n$$m = \\frac{\\text{rise}}{\\text{run}}.$$\n\nMoving from left to right, a rise upward is positive and a drop downward is negative. If the line goes from $(1, 4)$ to $(4, -2)$, the run is $3$ and the rise is $-6$, so $m = \\frac{-6}{3} = -2$. A line that goes up from left to right has positive slope; one that goes down has negative slope.",
        "**斜率** $m$ 衡量直线的倾斜程度。在直线上的两点之间，**横向变化**（run）是水平方向的变化，**纵向变化**（rise）是竖直方向的变化：\n\n$$m = \\frac{\\text{纵向变化}}{\\text{横向变化}}.$$\n\n从左向右看，向上为正，向下为负。若直线从 $(1, 4)$ 到 $(4, -2)$，横向变化是 $3$，纵向变化是 $-6$，所以 $m = \\frac{-6}{3} = -2$。从左向右上升的直线斜率为正，下降的直线斜率为负。",
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
        return {
          ...numberProblem({
            prompt: t("Find the slope of the line through the points $A$ and $B$.", "求过点 $A$ 和 $B$ 的直线的斜率。"),
            answer: m,
            wrong: [Q.of(run, rise), m.neg(), ...(run !== 1 ? [rise] : [])],
            solution: t(
              `From $A$ to $B$ the run is $${run}$ and the rise is $${rise}$: ${steps(`m = \\frac{${rise}}{${run}}${m.eq(Q.of(rise)) || (m.n === BigInt(rise) && m.d === BigInt(run)) ? "" : ` = ${num(m)}`}`)}`,
              `从 $A$ 到 $B$，横向变化是 $${run}$，纵向变化是 $${rise}$：${steps(`m = \\frac{${rise}}{${run}}${m.eq(Q.of(rise)) || (m.n === BigInt(rise) && m.d === BigInt(run)) ? "" : ` = ${num(m)}`}`)}`,
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
        };
      },
    },
    {
      id: "slope-formula",
      title: t("The slope formula", "斜率公式"),
      explanation: t(
        "For the line through $(x_1, y_1)$ and $(x_2, y_2)$ with $x_1 \\ne x_2$,\n\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}.$$\n\nSubtract in the **same order** on top and bottom. Through $(-2, 5)$ and $(4, 1)$:\n\n$$m = \\frac{1 - 5}{4 - (-2)} = \\frac{-4}{6} = -\\frac{2}{3}.$$",
        "过 $(x_1, y_1)$ 和 $(x_2, y_2)$（$x_1 \\ne x_2$）的直线的斜率为\n\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}.$$\n\n分子和分母要按**相同的顺序**相减。过 $(-2, 5)$ 和 $(4, 1)$：\n\n$$m = \\frac{1 - 5}{4 - (-2)} = \\frac{-4}{6} = -\\frac{2}{3}.$$",
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
        return numberProblem({
          prompt: t(
            `Find the slope of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$.`,
            `求过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的斜率。`,
          ),
          answer: m,
          wrong: [m.neg(), Q.of(x2 - x1, y2 - y1), Q.of(y2 + y1, x2 - x1)],
          solution: t(`Use the slope formula: ${steps(work)}`, `用斜率公式：${steps(work)}`),
        });
      },
    },
    {
      id: "zero-and-undefined-slopes",
      title: t("Zero and undefined slopes", "斜率为零与斜率不存在"),
      explanation: t(
        "A **horizontal** line has rise $0$, so its slope is $\\frac{0}{\\text{run}} = 0$.\n\nA **vertical** line has run $0$, and division by $0$ is not defined: the slope of a vertical line is **undefined**.\n\nSo through $(3, 1)$ and $(3, 7)$ the line is vertical (same $x$), and through $(-2, 4)$ and $(5, 4)$ it is horizontal (same $y$).",
        "**水平**直线的纵向变化为 $0$，所以斜率是 $\\frac{0}{\\text{横向变化}} = 0$。\n\n**竖直**直线的横向变化为 $0$，而除以 $0$ 没有意义：竖直直线的斜率**不存在**。\n\n所以过 $(3, 1)$ 和 $(3, 7)$ 的直线是竖直的（$x$ 相同），过 $(-2, 4)$ 和 $(5, 4)$ 的直线是水平的（$y$ 相同）。",
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
        return choiceProblem({
          prompt: t(`What is the slope of the line through $${p}$ and $${q}$?`, `过点 $${p}$ 和 $${q}$ 的直线的斜率是什么？`),
          options: slopeKinds,
          correct: kind,
          solution: reason,
        });
      },
    },
    {
      id: "missing-coordinate",
      title: t("Finding a missing coordinate", "求未知坐标"),
      explanation: t(
        "If the slope is known, the slope formula becomes an equation for a missing coordinate. The line through $(2, 3)$ and $(6, y)$ has slope $\\frac{1}{2}$:\n\n$$\\frac{y - 3}{6 - 2} = \\frac{1}{2} \\;\\Rightarrow\\; y - 3 = \\frac{1}{2} \\cdot 4 = 2 \\;\\Rightarrow\\; y = 5.$$\n\nIn words: a run of $4$ at slope $\\frac{1}{2}$ gives a rise of $2$.",
        "已知斜率时，斜率公式就成了关于未知坐标的方程。过 $(2, 3)$ 和 $(6, y)$ 的直线斜率为 $\\frac{1}{2}$：\n\n$$\\frac{y - 3}{6 - 2} = \\frac{1}{2} \\;\\Rightarrow\\; y - 3 = \\frac{1}{2} \\cdot 4 = 2 \\;\\Rightarrow\\; y = 5.$$\n\n也就是说：斜率为 $\\frac{1}{2}$ 时，横向变化 $4$ 对应纵向变化 $2$。",
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
          return numberProblem({
            prompt: t(
              `The line through $${pointLatex([x1, y1])}$ and $(${num(x2)}, y)$ has slope $${num(m)}$. Find $y$.`,
              `过点 $${pointLatex([x1, y1])}$ 和 $(${num(x2)}, y)$ 的直线的斜率为 $${num(m)}$。求 $y$。`,
            ),
            answer: y2,
            solveFor: "y",
            wrong: [y1 - rise, rise, Q.of(y1).add(Q.of(run).div(m))],
            solution: t(`Use the slope formula: ${work}`, `用斜率公式：${work}`),
          });
        }
        const work = steps(
          `\\frac{${num(y2)} - ${paren(y1)}}{x - ${paren(x1)}} = ${num(m)}`,
          `x - ${paren(x1)} = \\frac{${rise}}{${num(m)}} = ${num(run)}`,
          `x = ${x2}`,
        );
        return numberProblem({
          prompt: t(
            `The line through $${pointLatex([x1, y1])}$ and $(x, ${num(y2)})$ has slope $${num(m)}$. Find $x$.`,
            `过点 $${pointLatex([x1, y1])}$ 和 $(x, ${num(y2)})$ 的直线的斜率为 $${num(m)}$。求 $x$。`,
          ),
          answer: x2,
          solveFor: "x",
          wrong: [x1 - run, run, Q.of(x1).add(Q.of(rise).mul(m))],
          solution: t(`Use the slope formula: ${work}`, `用斜率公式：${work}`),
        });
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
  encompasses: [
    { topic: "slope-of-a-line", weight: 0.4 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.B.6", "CCSS.8.F.A.3"],
  knowledgePoints: [
    {
      id: "writing-from-slope-and-intercept",
      title: t("Slope and $y$-intercept", "斜率与 $y$ 轴截距"),
      explanation: t(
        "A line crosses the $y$-axis at its **$y$-intercept** $(0, b)$; the number $b$ is also called the $y$-intercept. The line with slope $m$ and $y$-intercept $b$ has the equation\n\n$$y = mx + b,$$\n\ncalled **slope-intercept form**: a point $(x, y)$ lies on the line exactly when its coordinates satisfy the equation. The line with slope $-\\frac{3}{4}$ through $(0, 2)$ is $y = -\\frac{3}{4}x + 2$; with slope $5$ and $y$-intercept $-1$ it is $y = 5x - 1$.",
        "直线与 $y$ 轴的交点 $(0, b)$ 叫做直线的 **$y$ 轴截距**点，数 $b$ 叫做 **$y$ 轴截距**。斜率为 $m$、$y$ 轴截距为 $b$ 的直线的方程是\n\n$$y = mx + b,$$\n\n叫做**斜截式**：点 $(x, y)$ 在直线上，当且仅当它的坐标满足这个方程。斜率为 $-\\frac{3}{4}$、过 $(0, 2)$ 的直线是 $y = -\\frac{3}{4}x + 2$；斜率为 $5$、$y$ 轴截距为 $-1$ 的直线是 $y = 5x - 1$。",
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
        return equationProblem({
          prompt,
          answer,
          form: "slope-intercept",
          wrong: [si(b, m), si(m, -b), si(m.neg(), b)],
          solution: t(
            `Put $m = ${num(m)}$ and $b = ${num(b)}$ into $y = mx + b$: ${steps(answer)}`,
            `把 $m = ${num(m)}$，$b = ${num(b)}$ 代入 $y = mx + b$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "reading-from-a-graph",
      title: t("The equation of a graphed line", "由图像写方程"),
      explanation: t(
        "To write the equation of a graphed line, read the $y$-intercept $b$ where the line crosses the $y$-axis, then find the slope from two grid points of the line as rise over run.\n\nIf a line crosses the $y$-axis at $(0, -3)$ and also passes through $(2, 2)$, then $m = \\frac{5}{2}$ and the line is $y = \\frac{5}{2}x - 3$.",
        "要写出图像中直线的方程，先在直线与 $y$ 轴的交点读出 $y$ 轴截距 $b$，再用直线上的两个网格点求斜率（纵向变化比横向变化）。\n\n若直线与 $y$ 轴交于 $(0, -3)$，又经过 $(2, 2)$，则 $m = \\frac{5}{2}$，直线为 $y = \\frac{5}{2}x - 3$。",
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
        return {
          ...equationProblem({
            prompt: t("Write the equation of the line shown, in slope-intercept form.", "写出图中直线的斜截式方程。"),
            answer,
            form: "slope-intercept",
            wrong: [si(Q.of(run, rise), b), si(m.neg(), b), si(m, -b)],
            solution: t(
              `The line crosses the $y$-axis at $${pointLatex([0, b])}$, so $b = ${b}$. From there to $${pointLatex([run, b + rise])}$ the run is $${run}$ and the rise is $${rise}$, so $m = ${num(m)}$: ${steps(answer)}`,
              `直线与 $y$ 轴交于 $${pointLatex([0, b])}$，所以 $b = ${b}$。从这一点到 $${pointLatex([run, b + rise])}$，横向变化是 $${run}$，纵向变化是 $${rise}$，所以 $m = ${num(m)}$：${steps(answer)}`,
            ),
          }),
          figure: graph(
            [lineMark(m, b), { kind: "point", at: [0, b] }, { kind: "point", at: [run, b + rise] }],
            "A line through two marked grid points, one of them on the y-axis.",
            "一条经过两个标出的网格点的直线，其中一个点在 y 轴上。",
          ),
        };
      },
    },
    {
      id: "points-on-a-line",
      title: t("Points on a line", "直线上的点"),
      explanation: t(
        "A point lies on the line $y = mx + b$ exactly when its coordinates make the equation true. To find the point of the line with a given $x$, substitute it: on $y = -2x + 7$, the point with $x = 3$ has $y = -2 \\cdot 3 + 7 = 1$.\n\nTo test whether $(4, 0)$ is on that line, substitute $x = 4$: $-2 \\cdot 4 + 7 = -1 \\ne 0$, so it is not.",
        "点在直线 $y = mx + b$ 上，当且仅当它的坐标使方程成立。要求直线上横坐标为给定值的点，就把 $x$ 代入：在 $y = -2x + 7$ 上，$x = 3$ 的点的 $y = -2 \\cdot 3 + 7 = 1$。\n\n要检验 $(4, 0)$ 是否在这条直线上，代入 $x = 4$：$-2 \\cdot 4 + 7 = -1 \\ne 0$，所以不在。",
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
          return numberProblem({
            prompt: t(`The point $(${x0}, y)$ lies on the line $${line}$. Find $y$.`, `点 $(${x0}, y)$ 在直线 $${line}$ 上。求 $y$。`),
            answer: y,
            solveFor: "y",
            wrong: [m.mul(Q.of(x0)).sub(Q.of(b)), m.add(Q.of(x0 + b)), Q.of(x0 + b)],
            solution: t(`Substitute $x = ${x0}$: ${steps(work)}`, `代入 $x = ${x0}$：${steps(work)}`),
          });
        }
        const on = rng.bool();
        const y0 = on ? y : y.add(Q.of(rng.nonZero(-3, 3)));
        return choiceProblem({
          prompt: t(
            `Does the point $${pointLatex([x0, y0])}$ lie on the line $${line}$?`,
            `点 $${pointLatex([x0, y0])}$ 在直线 $${line}$ 上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `Substitute $x = ${x0}$: ${steps(work)}${on ? `This is the $y$-coordinate of the point, so it lies on the line.` : `This is not $${num(y0)}$, so the point is not on the line.`}`,
            `代入 $x = ${x0}$：${steps(work)}${on ? "这正是该点的 $y$ 坐标，所以点在直线上。" : `这不等于 $${num(y0)}$，所以点不在直线上。`}`,
          ),
        });
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
  knowledgePoints: [
    {
      id: "slope-and-y-intercept",
      title: t("Reading the slope and the $y$-intercept", "读出斜率和 $y$ 轴截距"),
      explanation: t(
        "In $y = mx + b$, the coefficient of $x$ is the slope and the constant term gives the $y$-intercept $(0, b)$, because $x = 0$ gives $y = b$. The terms may come in either order: $y = 4 - \\frac{1}{2}x$ has slope $-\\frac{1}{2}$ and $y$-intercept $(0, 4)$. Mind the sign of each term.",
        "在 $y = mx + b$ 中，$x$ 的系数是斜率，常数项给出 $y$ 轴截距点 $(0, b)$，因为 $x = 0$ 时 $y = b$。两项的顺序可以颠倒：$y = 4 - \\frac{1}{2}x$ 的斜率是 $-\\frac{1}{2}$，$y$ 轴截距点是 $(0, 4)$。注意每一项的符号。",
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const b = rng.nonZero(-9, 9);
        const rhs = rng.bool() ? linear(m, b) : poly([b, ""], [m, "x"]);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Find the slope of the line $y = ${rhs}$.`, `求直线 $y = ${rhs}$ 的斜率。`),
            answer: m,
            wrong: [b, m.neg()],
            solution: t(`The coefficient of $x$ is the slope: $m = ${num(m)}$.`, `$x$ 的系数就是斜率：$m = ${num(m)}$。`),
          });
        }
        return pointProblem({
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
            `When $x = 0$, $y = ${num(b)}$, so the $y$-intercept is $${pointLatex([0, b])}$.`,
            `当 $x = 0$ 时 $y = ${num(b)}$，所以交点是 $${pointLatex([0, b])}$。`,
          ),
        });
      },
    },
    {
      id: "x-intercept",
      title: t("The $x$-intercept", "$x$ 轴截距"),
      explanation: t(
        "A line crosses the $x$-axis at its **$x$-intercept**, where $y = 0$. To find it, set $y = 0$ and solve for $x$:\n\n$$y = 3x - 6: \\quad 0 = 3x - 6 \\;\\Rightarrow\\; 3x = 6 \\;\\Rightarrow\\; x = 2,$$\n\nso the $x$-intercept is $(2, 0)$.",
        "直线与 $x$ 轴的交点叫做 **$x$ 轴截距**点，在这一点 $y = 0$。令 $y = 0$ 解出 $x$ 即可：\n\n$$y = 3x - 6: \\quad 0 = 3x - 6 \\;\\Rightarrow\\; 3x = 6 \\;\\Rightarrow\\; x = 2,$$\n\n所以与 $x$ 轴的交点是 $(2, 0)$。",
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
        return pointProblem({
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
            `Set $y = 0$ and solve: ${steps(`0 = ${linear(m, b)}`, `${poly([m, "x"])} = ${num(b.neg())}`, `x = ${num(x0)}`)}The $x$-intercept is $${pointLatex([x0, 0])}$.`,
            `令 $y = 0$ 并求解：${steps(`0 = ${linear(m, b)}`, `${poly([m, "x"])} = ${num(b.neg())}`, `x = ${num(x0)}`)}与 $x$ 轴的交点是 $${pointLatex([x0, 0])}$。`,
          ),
        });
      },
    },
    {
      id: "rewriting-in-slope-intercept-form",
      title: t("Rewriting in slope-intercept form", "化为斜截式"),
      explanation: t(
        "To read the slope and $y$-intercept of a line such as $4x - 2y = 6$, solve the equation for $y$:\n\n$$-2y = -4x + 6 \\;\\Rightarrow\\; y = 2x - 3.$$\n\nDivide **every** term by the coefficient of $y$, including the constant.",
        "要读出 $4x - 2y = 6$ 这类直线的斜率和 $y$ 轴截距，先把方程对 $y$ 求解：\n\n$$-2y = -4x + 6 \\;\\Rightarrow\\; y = 2x - 3.$$\n\n要把**每一项**（包括常数项）都除以 $y$ 的系数。",
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
        const work = steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`, answer);
        return equationProblem({
          prompt: t(`Write $${eq}$ in slope-intercept form.`, `把 $${eq}$ 化为斜截式。`),
          answer,
          form: "slope-intercept",
          wrong: [si(m.neg(), b), si(-A, C), si(m, b.neg())],
          solution: t(
            `Isolate the $y$-term, then divide every term by $${num(B)}$: ${work}`,
            `先把含 $y$ 的项单独留在一边，再把每一项都除以 $${num(B)}$：${work}`,
          ),
        });
      },
    },
  ],
};

// ─── Point-slope and standard form ──────────────────────────────────────────

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
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.8.F.B.4"],
  knowledgePoints: [
    {
      id: "writing-from-a-point-and-slope",
      title: t("A point and the slope", "一点和斜率"),
      explanation: t(
        "If $(x, y)$ is any point other than $(x_1, y_1)$ on the line with slope $m$ through $(x_1, y_1)$, the slope formula gives $\\frac{y - y_1}{x - x_1} = m$, that is\n\n$$y - y_1 = m(x - x_1),$$\n\nthe **point-slope form**. Through $(-4, 2)$ with slope $3$: $y - 2 = 3(x - (-4))$, written $y - 2 = 3(x + 4)$. Watch the signs: a negative coordinate turns the subtraction into an addition.",
        "设 $(x, y)$ 是过 $(x_1, y_1)$、斜率为 $m$ 的直线上异于 $(x_1, y_1)$ 的任意一点，由斜率公式 $\\frac{y - y_1}{x - x_1} = m$，即\n\n$$y - y_1 = m(x - x_1),$$\n\n这叫做**点斜式**。过 $(-4, 2)$、斜率为 $3$：$y - 2 = 3(x - (-4))$，写作 $y - 2 = 3(x + 4)$。注意符号：坐标为负数时，减号变成加号。",
      ),
      generate(rng) {
        const m = pickSlopeNotOne(rng);
        const [h, k] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const answer = ps(m, h, k);
        return equationProblem({
          prompt: t(
            `Write the equation of the line through $${pointLatex([h, k])}$ with slope $${num(m)}$, in point-slope form.`,
            `写出过点 $${pointLatex([h, k])}$、斜率为 $${num(m)}$ 的直线的点斜式方程。`,
          ),
          answer,
          form: "point-slope",
          wrong: [ps(m, -h, -k), ps(m, k, h), ps(m.neg(), h, k)],
          solution: t(
            `Substitute $x_1 = ${h}$, $y_1 = ${k}$ and $m = ${num(m)}$ into $y - y_1 = m(x - x_1)$: ${steps(answer)}`,
            `把 $x_1 = ${h}$，$y_1 = ${k}$，$m = ${num(m)}$ 代入 $y - y_1 = m(x - x_1)$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "through-two-points",
      title: t("A line through two points", "过两点的直线"),
      explanation: t(
        "To write the equation of the line through two points, first find the slope, then use either point in point-slope form. Through $(1, 5)$ and $(3, -1)$: $m = \\frac{-1 - 5}{3 - 1} = -3$, so $y - 5 = -3(x - 1)$. Using the other point gives $y + 1 = -3(x - 3)$, an equation of the same line.",
        "要写出过两点的直线方程，先求斜率，再用其中任一点写出点斜式。过 $(1, 5)$ 和 $(3, -1)$：$m = \\frac{-1 - 5}{3 - 1} = -3$，所以 $y - 5 = -3(x - 1)$。用另一点得到 $y + 1 = -3(x - 3)$，表示的是同一条直线。",
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
        return equationProblem({
          prompt: t(
            `Write the equation of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$, in point-slope form.`,
            `写出过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的点斜式方程。`,
          ),
          answer,
          form: "point-slope",
          wrong: [ps(Q.of(dx, dy), x1, y1), ps(m.neg(), x1, y1), ps(m, -x1, -y1)],
          solution: t(
            `The slope is $m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = ${num(m)}$. Using the point $${pointLatex([x1, y1])}$: ${steps(answer)}`,
            `斜率 $m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = ${num(m)}$。用点 $${pointLatex([x1, y1])}$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "converting-to-slope-intercept",
      title: t("From point-slope to slope-intercept form", "由点斜式化为斜截式"),
      explanation: t(
        "To rewrite a point-slope equation in slope-intercept form, distribute the slope, then move the constant to the right side:\n\n$$y + 4 = -2(x - 3) \\;\\Rightarrow\\; y + 4 = -2x + 6 \\;\\Rightarrow\\; y = -2x + 2.$$",
        "要把点斜式化为斜截式，先用分配律展开，再把常数移到右边：\n\n$$y + 4 = -2(x - 3) \\;\\Rightarrow\\; y + 4 = -2x + 6 \\;\\Rightarrow\\; y = -2x + 2.$$",
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const m = pickSlopeNotOne(rng, 0.3);
        const h = Number(m.d) * rng.nonZero(-4, 4);
        const k = rng.nonZero(-9, 9);
        const mh = m.mul(Q.of(h));
        const b = Q.of(k).sub(mh);
        const answer = si(m, b);
        const work = steps(`${linear(1, -k, "y")} = ${linear(m, mh.neg())}`, answer);
        return equationProblem({
          prompt: t(`Write $${ps(m, h, k)}$ in slope-intercept form.`, `把 $${ps(m, h, k)}$ 化为斜截式。`),
          answer,
          form: "slope-intercept",
          wrong: [si(m, mh.neg().sub(Q.of(k))), si(m, k - h), si(m, mh.add(Q.of(k)))],
          solution: t(
            `Distribute, then ${k > 0 ? `subtract $${k}$ from` : `add $${-k}$ to`} both sides: ${work}`,
            `先展开，再两边同时${k > 0 ? `减去 $${k}$` : `加上 $${-k}$`}：${work}`,
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
  encompasses: [
    { topic: "point-slope-form", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.HSA.CED.A.4"],
  knowledgePoints: [
    {
      id: "from-slope-intercept-to-standard",
      title: t("Converting to standard form", "化为标准式"),
      explanation: t(
        "The **standard form** of a line is\n\n$$Ax + By = C,$$\n\nwith integers $A$, $B$ and $C$ that have no common factor, and $A > 0$ (or $A = 0$ and $B > 0$). To convert $y = \\frac{2}{3}x - 4$: bring the $x$-term to the left, $-\\frac{2}{3}x + y = -4$; multiply by $3$ to clear the fraction, $-2x + 3y = -12$; multiply by $-1$ to make $A$ positive: $2x - 3y = 12$.",
        "直线的**标准式**是\n\n$$Ax + By = C,$$\n\n其中 $A$、$B$、$C$ 是没有公因数的整数，且 $A > 0$（或 $A = 0$ 且 $B > 0$）。化 $y = \\frac{2}{3}x - 4$ 为标准式：把含 $x$ 的项移到左边，$-\\frac{2}{3}x + y = -4$；两边乘以 $3$ 去分母，$-2x + 3y = -12$；再乘以 $-1$ 使 $A$ 为正：$2x - 3y = 12$。",
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
            `Bring the $x$-term to the left, then scale so that the coefficients are integers without a common factor and the coefficient of $x$ is positive: ${steps(moved, answer)}`,
            `把含 $x$ 的项移到左边，再乘以适当的数，使系数是没有公因数的整数且 $x$ 的系数为正：${steps(moved, answer)}`,
          ),
        });
      },
    },
    {
      id: "horizontal-and-vertical-lines",
      title: t("Horizontal and vertical lines", "水平与竖直的直线"),
      explanation: t(
        "Every point of the **horizontal** line through $(3, -2)$ has $y$-coordinate $-2$, so its equation is $y = -2$ (slope $0$). Every point of the **vertical** line through $(3, -2)$ has $x$-coordinate $3$, so its equation is $x = 3$ (slope undefined).\n\nBoth are in standard form: $y = -2$ is $0x + 1y = -2$ and $x = 3$ is $1x + 0y = 3$. A vertical line has no slope-intercept form.",
        "过 $(3, -2)$ 的**水平**直线上每个点的 $y$ 坐标都是 $-2$，所以方程是 $y = -2$（斜率为 $0$）。过 $(3, -2)$ 的**竖直**直线上每个点的 $x$ 坐标都是 $3$，所以方程是 $x = 3$（斜率不存在）。\n\n它们都是标准式：$y = -2$ 即 $0x + 1y = -2$，$x = 3$ 即 $1x + 0y = 3$。竖直直线没有斜截式。",
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const [h, k] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const vertical = rng.bool();
        const answer = vertical ? `x = ${h}` : `y = ${k}`;
        const wrong = vertical ? [`y = ${h}`, `x = ${k}`, `y = ${k}`] : [`x = ${k}`, `y = ${h}`, `x = ${h}`];
        const reason = vertical
          ? t(
              `Every point of the vertical line has $x$-coordinate $${h}$: ${steps(answer)}`,
              `竖直直线上每个点的 $x$ 坐标都是 $${h}$：${steps(answer)}`,
            )
          : t(
              `Every point of the horizontal line has $y$-coordinate $${k}$: ${steps(answer)}`,
              `水平直线上每个点的 $y$ 坐标都是 $${k}$：${steps(answer)}`,
            );
        if (rng.bool()) {
          return equationProblem({
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
          });
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
        "To write the line through two points in standard form, find the slope, write the point-slope form, then rearrange. Through $(2, 1)$ and $(5, -1)$: $m = -\\frac{2}{3}$, so\n\n$$y - 1 = -\\frac{2}{3}(x - 2) \\;\\Rightarrow\\; 3y - 3 = -2x + 4 \\;\\Rightarrow\\; 2x + 3y = 7.$$",
        "要写出过两点的直线的标准式，先求斜率，写出点斜式，再整理。过 $(2, 1)$ 和 $(5, -1)$：$m = -\\frac{2}{3}$，所以\n\n$$y - 1 = -\\frac{2}{3}(x - 2) \\;\\Rightarrow\\; 3y - 3 = -2x + 4 \\;\\Rightarrow\\; 2x + 3y = 7.$$",
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
        return equationProblem({
          prompt: t(
            `Write the equation of the line through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$, in standard form.`,
            `写出过点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$ 的直线的标准式方程。`,
          ),
          answer,
          form: "standard",
          wrong: [std(A, B, -C), std(B, A, C), std(A, -B, C)],
          solution: t(
            `The slope is $m = ${num(m)}$, so the line is $${ps(m, x1, y1)}$. Rearrange it: ${steps(answer)}`,
            `斜率 $m = ${num(m)}$，直线为 $${ps(m, x1, y1)}$。整理得：${steps(answer)}`,
          ),
        });
      },
    },
  ],
};

export const propertiesOfLinesInStandardForm: TopicDef = {
  id: "properties-of-lines-in-standard-form",
  title: t("Properties of Lines Given in Standard Form", "标准式直线的性质"),
  summary: t("Find the intercepts and the slope of a line $Ax + By = C$.", "求直线 $Ax + By = C$ 的截距和斜率。"),
  prerequisites: ["standard-form", "properties-of-lines-in-slope-intercept-form"],
  encompasses: [
    { topic: "standard-form", weight: 0.4 },
    { topic: "properties-of-lines-in-slope-intercept-form", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.8.F.B.4", "CCSS.HSA.CED.A.4"],
  knowledgePoints: [
    {
      id: "intercepts-from-standard-form",
      title: t("Intercepts", "截距"),
      explanation: t(
        "Standard form makes the intercepts easy to find. For $3x - 4y = 12$:\n\n- $x$-intercept: set $y = 0$, $3x = 12$, $x = 4$; the point $(4, 0)$.\n- $y$-intercept: set $x = 0$, $-4y = 12$, $y = -3$; the point $(0, -3)$.",
        "用标准式很容易求截距。对于 $3x - 4y = 12$：\n\n- 与 $x$ 轴的交点：令 $y = 0$，$3x = 12$，$x = 4$，即点 $(4, 0)$。\n- 与 $y$ 轴的交点：令 $x = 0$，$-4y = 12$，$y = -3$，即点 $(0, -3)$。",
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const c = rng.bool(0.6) ? a * b * rng.nonZero(-2, 2) : rng.nonZero(-12, 12);
        const [A, B, C] = standardOf(a, b, c);
        const eq = std(A, B, C);
        if (rng.bool()) {
          const x0 = Q.of(C, A);
          return pointProblem({
            prompt: t(`Find the $x$-intercept of the line $${eq}$, as an ordered pair.`, `求直线 $${eq}$ 与 $x$ 轴的交点，写成有序数对。`),
            answer: [x0, 0],
            wrong: [
              [0, x0],
              [Q.of(C, B), 0],
              [x0.neg(), 0],
            ],
            solution: t(
              `Set $y = 0$: ${steps(`${poly([A, "x"])} = ${num(C)}`, `x = ${num(x0)}`)}The $x$-intercept is $${pointLatex([x0, 0])}$.`,
              `令 $y = 0$：${steps(`${poly([A, "x"])} = ${num(C)}`, `x = ${num(x0)}`)}与 $x$ 轴的交点是 $${pointLatex([x0, 0])}$。`,
            ),
          });
        }
        const y0 = Q.of(C, B);
        return pointProblem({
          prompt: t(`Find the $y$-intercept of the line $${eq}$, as an ordered pair.`, `求直线 $${eq}$ 与 $y$ 轴的交点，写成有序数对。`),
          answer: [0, y0],
          wrong: [
            [y0, 0],
            [0, Q.of(C, A)],
            [0, y0.neg()],
          ],
          solution: t(
            `Set $x = 0$: ${steps(`${poly([B, "y"])} = ${num(C)}`, `y = ${num(y0)}`)}The $y$-intercept is $${pointLatex([0, y0])}$.`,
            `令 $x = 0$：${steps(`${poly([B, "y"])} = ${num(C)}`, `y = ${num(y0)}`)}与 $y$ 轴的交点是 $${pointLatex([0, y0])}$。`,
          ),
        });
      },
    },
    {
      id: "slope-from-standard-form",
      title: t("The slope", "斜率"),
      explanation: t(
        "Solving $Ax + By = C$ for $y$ (with $B \\ne 0$) gives $y = -\\frac{A}{B}x + \\frac{C}{B}$, so the slope is\n\n$$m = -\\frac{A}{B}.$$\n\nFor $3x - 4y = 12$, $m = -\\frac{3}{-4} = \\frac{3}{4}$. Mind both signs.",
        "把 $Ax + By = C$（$B \\ne 0$）对 $y$ 求解，得 $y = -\\frac{A}{B}x + \\frac{C}{B}$，所以斜率为\n\n$$m = -\\frac{A}{B}.$$\n\n对于 $3x - 4y = 12$，$m = -\\frac{3}{-4} = \\frac{3}{4}$。注意两个符号。",
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
            `Solve for $y$: ${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`, si(m, Q.of(C, B)))}The slope is $${num(m)}$.`,
            `对 $y$ 求解：${steps(`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`, si(m, Q.of(C, B)))}斜率是 $${num(m)}$。`,
          ),
        });
      },
    },
    {
      id: "standard-form-from-intercepts",
      title: t("A line from its intercepts", "由截距写方程"),
      explanation: t(
        "The intercepts determine a line. If a line crosses the axes at $(4, 0)$ and $(0, -2)$, its slope is $\\frac{-2 - 0}{0 - 4} = \\frac{1}{2}$ and its $y$-intercept is $-2$: $y = \\frac{1}{2}x - 2$, which in standard form is $x - 2y = 4$. Check with the intercepts: $4 - 0 = 4$ and $0 - 2(-2) = 4$. ✓",
        "截距确定一条直线。若直线与坐标轴交于 $(4, 0)$ 和 $(0, -2)$，它的斜率是 $\\frac{-2 - 0}{0 - 4} = \\frac{1}{2}$，$y$ 轴截距是 $-2$：$y = \\frac{1}{2}x - 2$，化为标准式是 $x - 2y = 4$。用截距检验：$4 - 0 = 4$，$0 - 2(-2) = 4$。✓",
      ),
      generate(rng) {
        const [a, b] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const [A, B, C] = standardOf(b, a, a * b);
        const answer = std(A, B, C);
        const m = Q.of(-b, a);
        return {
          ...equationProblem({
            prompt: t("Write the equation of the line shown, in standard form.", "写出图中直线的标准式方程。"),
            answer,
            form: "standard",
            wrong: [std(...standardOf(a, b, a * b)), std(...standardOf(b, a, -a * b)), std(...standardOf(b, -a, a * b))],
            solution: t(
              `The line crosses the axes at $${pointLatex([a, 0])}$ and $${pointLatex([0, b])}$, so its slope is $${num(m)}$ and $${si(m, b)}$. In standard form: ${steps(answer)}`,
              `直线与坐标轴交于 $${pointLatex([a, 0])}$ 和 $${pointLatex([0, b])}$，所以斜率是 $${num(m)}$，$${si(m, b)}$。化为标准式：${steps(answer)}`,
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
        };
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

export const parallelLinesInTheCoordinatePlane: TopicDef = {
  id: "parallel-lines-in-the-coordinate-plane",
  title: t("Parallel Lines in the Coordinate Plane", "坐标平面中的平行线"),
  summary: t(
    "Recognize parallel lines by their slopes, and write the equation of a parallel line.",
    "由斜率识别平行线，写出平行线的方程。",
  ),
  prerequisites: ["properties-of-lines-in-standard-form"],
  encompasses: [
    { topic: "properties-of-lines-in-standard-form", weight: 0.3 },
    { topic: "slope-intercept-form", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "parallel-slopes",
      title: t("Parallel lines have equal slopes", "平行线的斜率相等"),
      explanation: t(
        "Two different lines are **parallel** exactly when they have the same slope (or are both vertical): they rise equally over every run, so they never meet.\n\n$y = 2x + 1$ and $y = 2x - 5$ are parallel. To compare a line in standard form, find its slope $-\\frac{A}{B}$: $4x - 2y = 3$ has slope $2$, so it is parallel to them as well.",
        "两条不同的直线**平行**，当且仅当它们的斜率相同（或都是竖直的）：它们在相同的横向变化下有相同的纵向变化，所以永不相交。\n\n$y = 2x + 1$ 与 $y = 2x - 5$ 平行。比较标准式的直线时，先求斜率 $-\\frac{A}{B}$：$4x - 2y = 3$ 的斜率是 $2$，所以它也与它们平行。",
      ),
      generate(rng) {
        const m = pickSteepSlope(rng);
        const b0 = rng.int(-9, 9);
        let bc = rng.nonZero(-9, 9);
        if (bc === b0) bc = b0 === 9 ? 8 : b0 + 1;
        const slopes = [m, m.neg(), Q.one.div(m), Q.one.div(m).neg()];
        const standard = rng.bool();
        const givenStandard = rng.bool();
        const options = rng.shuffle(slopes.map((s, i) => ({ s, i, eq: lineIn(s, i === 0 ? bc : rng.nonZero(-9, 9), standard) })));
        const correct = options.findIndex((o) => o.i === 0);
        const given = lineIn(m, b0, givenStandard);
        return choiceProblem({
          prompt: t(`Which line is parallel to $${given}$?`, `哪条直线与 $${given}$ 平行？`),
          options: options.map((o) => same(`$${o.eq}$`)),
          correct,
          solution: t(
            `Parallel lines have equal slopes. The slope of $${given}$ is $${num(m)}$; the slopes of the options are ${options.map((o) => `$${num(o.s)}$`).join(", ")}. Only $${options[correct]!.eq}$ has slope $${num(m)}$.`,
            `平行线的斜率相等。$${given}$ 的斜率是 $${num(m)}$；各选项的斜率依次是 ${options.map((o) => `$${num(o.s)}$`).join("、")}。只有 $${options[correct]!.eq}$ 的斜率是 $${num(m)}$。`,
          ),
        });
      },
    },
    {
      id: "parallel-line-through-a-point",
      title: t("A parallel line through a point", "过一点作平行线"),
      explanation: t(
        "The line through $(4, -1)$ parallel to $y = \\frac{1}{2}x + 3$ has the same slope $\\frac{1}{2}$. Find its $y$-intercept by substituting the point:\n\n$$-1 = \\frac{1}{2} \\cdot 4 + b \\;\\Rightarrow\\; b = -3,$$\n\nso the line is $y = \\frac{1}{2}x - 3$.",
        "过 $(4, -1)$ 且与 $y = \\frac{1}{2}x + 3$ 平行的直线斜率也是 $\\frac{1}{2}$。代入这一点求 $y$ 轴截距：\n\n$$-1 = \\frac{1}{2} \\cdot 4 + b \\;\\Rightarrow\\; b = -3,$$\n\n所以这条直线是 $y = \\frac{1}{2}x - 3$。",
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
        const given = lineIn(m, b0, rng.bool());
        const answer = si(m, b);
        const perp = Q.one.div(m).neg();
        return equationProblem({
          prompt: t(
            `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ parallel to $${given}$.`,
            `写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 平行的直线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [si(m, k), si(perp, Q.of(k).sub(perp.mul(Q.of(h)))), si(m, Q.of(k).add(m.mul(Q.of(h)))), si(m, b0)],
          solution: t(
            `The parallel line has the same slope, $${num(m)}$. Substitute the point to find $b$: ${steps(`${num(k)} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}So the line is $${answer}$.`,
            `平行线的斜率相同，为 $${num(m)}$。代入该点求 $b$：${steps(`${num(k)} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}所以直线为 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "parallel-same-or-intersecting",
      title: t("Parallel, the same line, or intersecting", "平行、重合还是相交"),
      explanation: t(
        "To compare two lines, write both in slope-intercept form.\n\n- Different slopes: the lines **intersect** in one point.\n- Same slope, different $y$-intercepts: the lines are **parallel**.\n- Same slope and same $y$-intercept: the equations describe **the same line**, like $y = 3x - 1$ and $6x - 2y = 2$.",
        "比较两条直线时，把它们都化为斜截式。\n\n- 斜率不同：两直线**相交**于一点。\n- 斜率相同、$y$ 轴截距不同：两直线**平行**。\n- 斜率和 $y$ 轴截距都相同：两个方程表示**同一条直线**，例如 $y = 3x - 1$ 与 $6x - 2y = 2$。",
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
            `Solve the second equation for $y$: $${si(m2, b2)}$. ${verdict.en}`,
            `把第二个方程对 $y$ 求解：$${si(m2, b2)}$。${verdict["zh-CN"]}`,
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
  encompasses: [
    { topic: "parallel-lines-in-the-coordinate-plane", weight: 0.5 },
    { topic: "operations-with-rational-numbers", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "perpendicular-slopes",
      title: t("Negative reciprocal slopes", "互为负倒数的斜率"),
      explanation: t(
        "Two lines with slopes $m_1$ and $m_2$ are **perpendicular** exactly when $m_1 m_2 = -1$, that is, when each slope is the **negative reciprocal** of the other:\n\n$$m_2 = -\\frac{1}{m_1}.$$\n\nA line perpendicular to a line of slope $\\frac{2}{3}$ has slope $-\\frac{3}{2}$; perpendicular to slope $-4$, slope $\\frac{1}{4}$. (A horizontal and a vertical line are perpendicular too.)",
        "斜率为 $m_1$ 和 $m_2$ 的两条直线**垂直**，当且仅当 $m_1 m_2 = -1$，即两个斜率互为**负倒数**：\n\n$$m_2 = -\\frac{1}{m_1}.$$\n\n与斜率为 $\\frac{2}{3}$ 的直线垂直的直线斜率是 $-\\frac{3}{2}$；与斜率为 $-4$ 的直线垂直的直线斜率是 $\\frac{1}{4}$。（水平直线与竖直直线也互相垂直。）",
      ),
      generate(rng) {
        const m = pickSlope(rng, 0.5);
        const b = rng.int(-9, 9);
        const given = lineIn(m, b, rng.bool());
        const p = Q.one.div(m).neg();
        return numberProblem({
          prompt: t(`Find the slope of a line perpendicular to $${given}$.`, `求与 $${given}$ 垂直的直线的斜率。`),
          answer: p,
          wrong: [m, m.neg(), Q.one.div(m)],
          solution: t(
            `The given line has slope $${num(m)}$. The perpendicular slope is its negative reciprocal: ${steps(`-\\frac{1}{${num(m)}} = ${num(p)}`)}`,
            `已知直线的斜率是 $${num(m)}$。垂线的斜率是它的负倒数：${steps(`-\\frac{1}{${num(m)}} = ${num(p)}`)}`,
          ),
        });
      },
    },
    {
      id: "perpendicular-line-through-a-point",
      title: t("A perpendicular line through a point", "过一点作垂线"),
      explanation: t(
        "To write the line through $(2, 5)$ perpendicular to $y = -\\frac{2}{3}x + 1$, take the negative reciprocal slope $\\frac{3}{2}$ and substitute the point:\n\n$$5 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; b = 2,$$\n\nso the line is $y = \\frac{3}{2}x + 2$.",
        "要写出过 $(2, 5)$ 且与 $y = -\\frac{2}{3}x + 1$ 垂直的直线，取负倒数斜率 $\\frac{3}{2}$，再代入这一点：\n\n$$5 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; b = 2,$$\n\n所以直线为 $y = \\frac{3}{2}x + 2$。",
      ),
      generate(rng) {
        const m = pickSlope(rng, 0.5);
        const p = Q.one.div(m).neg();
        const h = Number(p.d) * rng.nonZero(-3, 3);
        const k = rng.int(-9, 9);
        const b = Q.of(k).sub(p.mul(Q.of(h)));
        const given = lineIn(m, rng.int(-9, 9), rng.bool());
        const answer = si(p, b);
        const inv = Q.one.div(m);
        return equationProblem({
          prompt: t(
            `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ perpendicular to $${given}$.`,
            `写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 垂直的直线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [si(m, Q.of(k).sub(m.mul(Q.of(h)))), si(inv, Q.of(k).sub(inv.mul(Q.of(h)))), si(p, Q.of(k).add(p.mul(Q.of(h))))],
          solution: t(
            `The given line has slope $${num(m)}$, so the perpendicular line has slope $${num(p)}$. Substitute the point to find $b$: ${steps(`${num(k)} = ${num(p)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}So the line is $${answer}$.`,
            `已知直线的斜率是 $${num(m)}$，所以垂线的斜率是 $${num(p)}$。代入该点求 $b$：${steps(`${num(k)} = ${num(p)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}所以直线为 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "parallel-perpendicular-or-neither",
      title: t("Parallel, perpendicular or neither", "平行、垂直还是都不是"),
      explanation: t(
        "Find both slopes. Equal slopes mean parallel lines (or the same line); slopes whose product is $-1$ mean perpendicular lines; otherwise the lines are neither. For example, $y = -2x + 1$ and $x - 2y = 6$ have slopes $-2$ and $\\frac{1}{2}$, whose product is $-1$: they are perpendicular.",
        "先求两条直线的斜率。斜率相等则平行（或重合）；斜率之积为 $-1$ 则垂直；否则既不平行也不垂直。例如 $y = -2x + 1$ 与 $x - 2y = 6$ 的斜率是 $-2$ 和 $\\frac{1}{2}$，乘积为 $-1$：它们互相垂直。",
      ),
      generate(rng) {
        const m = pickSteepSlope(rng);
        const kind = rng.int(0, 2);
        const b1 = rng.int(-8, 8);
        let b2 = rng.int(-8, 8);
        if (kind === 0 && b2 === b1) b2 = b1 === 8 ? 7 : b1 + 1;
        const perp = Q.one.div(m).neg();
        const m2 = kind === 0 ? m : kind === 1 ? perp : rng.pick([m.neg(), Q.one.div(m), m.add(Q.one)]);
        const [l1, l2] = [lineIn(m, b1, rng.bool()), lineIn(m2, b2, rng.bool())];
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
            `The slopes are $${num(m)}$ and $${num(m2)}$. ${verdict.en}`,
            `两条直线的斜率分别是 $${num(m)}$ 和 $${num(m2)}$。${verdict["zh-CN"]}`,
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
  title: t("Systems of Linear Equations", "二元一次方程组"),
  summary: t(
    "Check solutions of a system of two linear equations, and solve a system from its graph.",
    "检验二元一次方程组的解，并由图像求解方程组。",
  ),
  prerequisites: ["slope-intercept-form"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.8.EE.C.8.A", "CCSS.HSA.REI.C.6"],
  knowledgePoints: [
    {
      id: "checking-a-solution",
      title: t("Solutions of a system", "方程组的解"),
      explanation: t(
        "A **system of equations** is a set of equations to be satisfied at the same time. A **solution** of a system in $x$ and $y$ is an ordered pair that makes **every** equation true.\n\n$(2, -1)$ solves $\\begin{cases} x + y = 1 \\\\ 3x - y = 7 \\end{cases}$ because $2 + (-1) = 1$ and $3 \\cdot 2 - (-1) = 7$. A pair that satisfies only one of the equations is not a solution.",
        "**方程组**是需要同时满足的几个方程。关于 $x$ 和 $y$ 的方程组的**解**是使**每一个**方程都成立的有序数对。\n\n$(2, -1)$ 是 $\\begin{cases} x + y = 1 \\\\ 3x - y = 7 \\end{cases}$ 的解，因为 $2 + (-1) = 1$ 且 $3 \\cdot 2 - (-1) = 7$。只满足其中一个方程的数对不是解。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const { e1, e2, sol } = randomSystem(rng, 5);
        const yes = rng.bool();
        const step = rng.nonZero(-2, 2);
        const p: [number, number] = yes ? sol : [sol[0] + e1[1] * step, sol[1] - e1[0] * step];
        const value = (e: Lin) => e[0] * p[0] + e[1] * p[1];
        const check = (e: Lin) =>
          `${num(e[0])} \\cdot ${paren(p[0])} ${e[1] < 0 ? "-" : "+"} ${Math.abs(e[1])} \\cdot ${paren(p[1])} = ${value(e)}`;
        const ok2 = value(e2) === e2[2];
        return choiceProblem({
          prompt: t(
            `Is $${pointLatex(p)}$ a solution of the system $$${system(eqOf(e1), eqOf(e2))}$$`,
            `$${pointLatex(p)}$ 是方程组 $$${system(eqOf(e1), eqOf(e2))}$$ 的解吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Substitute into each equation: ${steps(check(e1), check(e2))}${ok2 ? "Both equations hold, so it is a solution." : `The second equation needs $${e2[2]}$, so the pair is not a solution.`}`,
            `代入每个方程：${steps(check(e1), check(e2))}${ok2 ? "两个方程都成立，所以是解。" : `第二个方程右边是 $${e2[2]}$，不成立，所以不是解。`}`,
          ),
        });
      },
    },
    {
      id: "solving-by-graphing",
      title: t("Solving by graphing", "图像法解方程组"),
      explanation: t(
        "Each equation of a system in $x$ and $y$ has a line as its graph. A point lies on both lines exactly when it satisfies both equations, so the solution of the system is the **point of intersection** of the two lines.\n\nRead the intersection from the graph, then check it in both equations.",
        "关于 $x$ 和 $y$ 的方程组中，每个方程的图像都是一条直线。一个点同时在两条直线上，当且仅当它同时满足两个方程，所以方程组的解就是两直线的**交点**。\n\n从图像读出交点，再代入两个方程检验。",
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
        return {
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
              `The lines intersect at $${pointLatex([x0, y0])}$. Check: $${evalAt(m1, x0, b1)} = ${y0}$ and $${evalAt(m2, x0, b2)} = ${y0}$.`,
              `两直线交于 $${pointLatex([x0, y0])}$。检验：$${evalAt(m1, x0, b1)} = ${y0}$，$${evalAt(m2, x0, b2)} = ${y0}$。`,
            ),
          }),
          figure: graph(
            [lineMark(m1, b1), lineMark(m2, b2, false)],
            `The lines ${plainLine(m1, b1)} and ${plainLine(m2, b2)}.`,
            `直线 ${plainLine(m1, b1)} 与 ${plainLine(m2, b2)}。`,
          ),
        };
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
  encompasses: [
    { topic: "systems-of-linear-equations", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.6"],
  knowledgePoints: [
    {
      id: "adding-equations",
      title: t("Adding the equations", "两个方程相加"),
      explanation: t(
        "If $A = B$ and $C = D$, then $A + C = B + D$: equations can be added side by side. When a variable has **opposite** coefficients in the two equations, adding them eliminates it:\n\n$$\\begin{cases} 3x + 2y = 4 \\\\ 5x - 2y = 12 \\end{cases} \\;\\Rightarrow\\; 8x = 16 \\;\\Rightarrow\\; x = 2.$$\n\nThen substitute into either equation: $3 \\cdot 2 + 2y = 4$, so $y = -1$. The solution is $(2, -1)$.",
        "若 $A = B$ 且 $C = D$，则 $A + C = B + D$：两个方程可以左右分别相加。当某个变量在两个方程中的系数**互为相反数**时，相加就把它消去：\n\n$$\\begin{cases} 3x + 2y = 4 \\\\ 5x - 2y = 12 \\end{cases} \\;\\Rightarrow\\; 8x = 16 \\;\\Rightarrow\\; x = 2.$$\n\n再代入任一方程：$3 \\cdot 2 + 2y = 4$，所以 $y = -1$。方程组的解是 $(2, -1)$。",
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
        "When a variable has the **same** coefficient in both equations, subtracting one equation from the other eliminates it. Subtract every term, constants included:\n\n$$\\begin{cases} 4x + 3y = 5 \\\\ x + 3y = -4 \\end{cases} \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3,$$\n\nthen $3 + 3y = -4$ gives $y = -\\frac{7}{3}$. Careful with signs: subtracting $-4$ means adding $4$.",
        "当某个变量在两个方程中的系数**相同**时，用一个方程减去另一个方程就把它消去。每一项（包括常数）都要相减：\n\n$$\\begin{cases} 4x + 3y = 5 \\\\ x + 3y = -4 \\end{cases} \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3,$$\n\n再由 $3 + 3y = -4$ 得 $y = -\\frac{7}{3}$。注意符号：减去 $-4$ 就是加上 $4$。",
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
  title: t("Elimination: One Transformation", "加减消元：变形一个方程"),
  summary: t(
    "Multiply one equation by a number so that adding or subtracting eliminates a variable.",
    "把一个方程乘以一个数，使相加或相减能消去一个变量。",
  ),
  prerequisites: ["introduction-to-elimination"],
  encompasses: [{ topic: "introduction-to-elimination", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.5"],
  knowledgePoints: [
    {
      id: "multiplying-one-equation",
      title: t("Multiplying one equation", "一个方程乘以一个数"),
      explanation: t(
        "Multiplying both sides of an equation by a nonzero number does not change its solutions. If a coefficient in one equation is a multiple of the matching coefficient in the other, scale the other equation to match:\n\n$$\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$$\n\nMultiply the first equation by $2$: $4x + 2y = 14$. Adding it to the second gives $7x = 14$, so $x = 2$ and $y = 3$. Multiply **every** term, the constant too.",
        "方程两边同乘以一个非零数，方程的解不变。若一个方程中某变量的系数是另一个方程中对应系数的倍数，就把另一个方程乘以适当的数使它们匹配：\n\n$$\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 0 \\end{cases}$$\n\n第一个方程乘以 $2$：$4x + 2y = 14$。与第二个方程相加得 $7x = 14$，所以 $x = 2$，$y = 3$。**每一项**（包括常数）都要乘。",
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
        "Before eliminating, write both equations in the form $ax + by = c$ so that like terms line up:\n\n$$\\begin{cases} 3x + 2y = 11 \\\\ y = 4x - 11 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 3x + 2y = 11 \\\\ -4x + y = -11 \\end{cases}$$\n\nWhen a term moves to the other side, its sign changes. Then eliminate as usual.",
        "消元之前，先把两个方程都写成 $ax + by = c$ 的形式，使同类项对齐：\n\n$$\\begin{cases} 3x + 2y = 11 \\\\ y = 4x - 11 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 3x + 2y = 11 \\\\ -4x + y = -11 \\end{cases}$$\n\n把一项移到等号另一边时要变号。然后照常消元。",
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
            `Write the second equation as $${eqOf(e2)}$. ${eliminationSolution(e1, e2, elim).en}`,
            `把第二个方程写成 $${eqOf(e2)}$。${eliminationSolution(e1, e2, elim)["zh-CN"]}`,
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
  title: t("Elimination: Two Transformations", "加减消元：变形两个方程"),
  summary: t(
    "Multiply both equations so that a variable's coefficients become opposites.",
    "两个方程分别乘以适当的数，使某个变量的系数互为相反数。",
  ),
  prerequisites: ["elimination-with-one-transformation"],
  encompasses: [
    { topic: "elimination-with-one-transformation", weight: 0.7 },
    { topic: "operations-with-rational-numbers", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.5"],
  knowledgePoints: [
    {
      id: "multiplying-both-equations",
      title: t("Multiplying both equations", "两个方程都乘以一个数"),
      explanation: t(
        "When neither coefficient of a variable divides the other, scale both equations so that the coefficients become their least common multiple:\n\n$$\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$$\n\nTo eliminate $x$, multiply the first equation by $2$ and the second by $3$: $6x + 8y = 20$ and $6x - 15y = -3$. Subtracting gives $23y = 23$, so $y = 1$, and then $x = 2$.",
        "当某变量的两个系数互不整除时，把两个方程分别乘以适当的数，使这两个系数都变成它们的最小公倍数：\n\n$$\\begin{cases} 3x + 4y = 10 \\\\ 2x - 5y = -1 \\end{cases}$$\n\n要消去 $x$，第一个方程乘以 $2$，第二个方程乘以 $3$：$6x + 8y = 20$，$6x - 15y = -3$。相减得 $23y = 23$，所以 $y = 1$，进而 $x = 2$。",
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
        "The solution of a system with integer coefficients need not be integers. Proceed exactly as before and keep exact fractions:\n\n$$\\begin{cases} 2x + 3y = 1 \\\\ 5x - 2y = 3 \\end{cases}$$\n\nMultiply by $2$ and $3$ to eliminate $y$: $4x + 6y = 2$ and $15x - 6y = 9$, so $19x = 11$ and $x = \\frac{11}{19}$; then $y = \\frac{1}{19}$.",
        "整数系数的方程组的解不一定是整数。照常求解，保留准确的分数：\n\n$$\\begin{cases} 2x + 3y = 1 \\\\ 5x - 2y = 3 \\end{cases}$$\n\n分别乘以 $2$ 和 $3$ 消去 $y$：$4x + 6y = 2$，$15x - 6y = 9$，所以 $19x = 11$，$x = \\frac{11}{19}$；进而 $y = \\frac{1}{19}$。",
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
    parts.push(`the second by $${clears[1]}$`);
    zh.push(`第二个方程乘以 $${clears[1]}$`);
  }
  const lines = steps(
    ...[clears[0] !== 1 ? eqOf(e1) : undefined, clears[1] !== 1 ? eqOf(e2) : undefined].filter((l): l is string => l !== undefined),
  );
  return t(
    `Multiply ${parts.join(" and ")} to clear the ${what}: ${lines}`,
    `${zh.join("，")}，去掉${what === "fractions" ? "分数" : "小数"}：${lines}`,
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
    { topic: "least-common-multiple", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.6"],
  knowledgePoints: [
    {
      id: "clearing-fractions",
      title: t("Clearing the fractions", "去分母"),
      explanation: t(
        "Multiply an equation with fractional coefficients by the least common multiple of the denominators. Every term must be multiplied, the constant too:\n\n$$\\frac{1}{2}x + \\frac{2}{3}y = 3 \\;\\xrightarrow{\\;\\times 6\\;}\\; 3x + 4y = 18.$$\n\nThe new equation has the same solutions, and the system can then be solved by elimination.",
        "把含分数系数的方程乘以各分母的最小公倍数。每一项（包括常数）都要乘：\n\n$$\\frac{1}{2}x + \\frac{2}{3}y = 3 \\;\\xrightarrow{\\;\\times 6\\;}\\; 3x + 4y = 18.$$\n\n新方程的解不变，然后就可以用消元法解方程组。",
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
        "When both equations have fractions, clear each one with the least common multiple of its own denominators, then eliminate:\n\n$$\\begin{cases} \\frac{1}{3}x + \\frac{1}{2}y = 1 \\\\ \\frac{3}{4}x - \\frac{1}{4}y = 2 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 2x + 3y = 6 \\\\ 3x - y = 8 \\end{cases}$$",
        "两个方程都有分数时，分别乘以各自分母的最小公倍数去分母，再消元：\n\n$$\\begin{cases} \\frac{1}{3}x + \\frac{1}{2}y = 1 \\\\ \\frac{3}{4}x - \\frac{1}{4}y = 2 \\end{cases} \\;\\Rightarrow\\; \\begin{cases} 2x + 3y = 6 \\\\ 3x - y = 8 \\end{cases}$$",
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
  knowledgePoints: [
    {
      id: "clearing-decimals",
      title: t("Clearing tenths", "去掉一位小数"),
      explanation: t(
        "An equation whose decimals have one decimal place becomes an equation with integer coefficients when multiplied by $10$:\n\n$$0.3x - 1.2y = 0.6 \\;\\xrightarrow{\\;\\times 10\\;}\\; 3x - 12y = 6.$$\n\nMultiply every term, then solve the system by elimination.",
        "小数都只有一位小数的方程，乘以 $10$ 后就成为整数系数的方程：\n\n$$0.3x - 1.2y = 0.6 \\;\\xrightarrow{\\;\\times 10\\;}\\; 3x - 12y = 6.$$\n\n每一项都要乘，然后用消元法解方程组。",
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
            `Multiply the first equation by $10$: ${steps(eqOf(e1))}${rest.en}`,
            `第一个方程乘以 $10$：${steps(eqOf(e1))}${rest["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "clearing-hundredths",
      title: t("Clearing hundredths", "去掉两位小数"),
      explanation: t(
        "If some decimal has two decimal places, multiply that equation by $100$: $0.05x + 0.25y = 1.45$ becomes $5x + 25y = 145$. Each equation is multiplied by the power of ten its own decimals need.",
        "若某个小数有两位小数，就把那个方程乘以 $100$：$0.05x + 0.25y = 1.45$ 变成 $5x + 25y = 145$。每个方程各自乘以它的小数所需要的 10 的幂。",
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
            `Multiply the first equation by $100$${g !== 1 ? ` and divide by $${g}$` : ""}, and the second by $10$: ${steps(eqOf(r1), eqOf(e2))}${rest.en}`,
            `第一个方程乘以 $100$${g !== 1 ? `再除以 $${g}$` : ""}，第二个方程乘以 $10$：${steps(eqOf(r1), eqOf(e2))}${rest["zh-CN"]}`,
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
    return t(
      `The coefficients are not proportional ($${num(Q.of(e1[0], e2[0]))} \\ne ${num(Q.of(e1[1], e2[1]))}$), so elimination leaves one variable with a nonzero coefficient: there is exactly one solution.`,
      `系数不成比例（$${num(Q.of(e1[0], e2[0]))} \\ne ${num(Q.of(e1[1], e2[1]))}$），消元后剩下的变量系数不为零：恰有一个解。`,
    );
  }
  const scaled = `${poly([k * e1[0], "x"], [k * e1[1], "y"])} = ${num(k * e1[2])}`;
  const end = `0 = ${num(e2[2] - k * e1[2])}`;
  return kind === 1
    ? t(
        `Multiply the first equation by $${k}$: $${scaled}$. Subtracting the second equation gives $${end}$, which is false: there is no solution.`,
        `第一个方程乘以 $${k}$：$${scaled}$。减去第二个方程得 $${end}$，这不成立：方程组无解。`,
      )
    : t(
        `Multiply the first equation by $${k}$: $${scaled}$, which is the second equation. Subtracting gives $0 = 0$: every solution of one equation solves the other, so there are infinitely many solutions.`,
        `第一个方程乘以 $${k}$：$${scaled}$，正是第二个方程。相减得 $0 = 0$：一个方程的每个解都是另一个方程的解，所以有无穷多个解。`,
      );
}

export const systemsWithNoSolutionOrInfinitelyManySolutions: TopicDef = {
  id: "systems-with-no-solution-or-infinitely-many-solutions",
  title: t("Systems with No Solution or Infinitely Many Solutions", "无解或有无穷多解的方程组"),
  summary: t(
    "Recognize systems of linear equations with no solution or infinitely many solutions.",
    "识别无解或有无穷多个解的线性方程组。",
  ),
  prerequisites: ["elimination-with-one-transformation", "parallel-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "elimination-with-one-transformation", weight: 0.4 },
    { topic: "parallel-lines-in-the-coordinate-plane", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B"],
  knowledgePoints: [
    {
      id: "by-elimination",
      title: t("Recognizing them by elimination", "用消元识别"),
      explanation: t(
        "Sometimes elimination removes **both** variables:\n\n- If what remains is false, such as $0 = 7$, the system has **no solution**.\n- If it is always true, $0 = 0$, the two equations are equivalent and the system has **infinitely many solutions**.\n\nIn $\\begin{cases} 2x - 3y = 5 \\\\ -4x + 6y = 1 \\end{cases}$, doubling the first equation and adding gives $0 = 11$: no solution.",
        "有时消元会把**两个**变量都消去：\n\n- 若剩下的等式不成立，例如 $0 = 7$，方程组**无解**。\n- 若恒成立，即 $0 = 0$，两个方程等价，方程组有**无穷多个解**。\n\n在 $\\begin{cases} 2x - 3y = 5 \\\\ -4x + 6y = 1 \\end{cases}$ 中，第一个方程乘以 $2$ 再相加得 $0 = 11$：无解。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const { e1, e2, k } = specialSystem(rng, kind);
        return choiceProblem({
          prompt: t(
            `How many solutions does the system have? $$${system(eqOf(e1), eqOf(e2))}$$`,
            `方程组有几个解？$$${system(eqOf(e1), eqOf(e2))}$$`,
          ),
          options: solutionCounts,
          correct: kind,
          solution: specialReason(e1, e2, kind, k),
        });
      },
    },
    {
      id: "by-slopes-and-intercepts",
      title: t("Recognizing them by slopes and intercepts", "用斜率和截距识别"),
      explanation: t(
        "The solutions of a system are the common points of two lines, so compare the lines in slope-intercept form:\n\n- different slopes: the lines cross once, **one solution**;\n- equal slopes, different $y$-intercepts: parallel lines, **no solution**;\n- equal slopes and equal $y$-intercepts: the same line, **infinitely many solutions**.",
        "方程组的解就是两条直线的公共点，所以把两条直线化为斜截式比较：\n\n- 斜率不同：两直线相交于一点，**恰有一个解**；\n- 斜率相同、$y$ 轴截距不同：两直线平行，**无解**；\n- 斜率和 $y$ 轴截距都相同：同一条直线，**有无穷多个解**。",
      ),
      keyPrerequisites: ["parallel-lines-in-the-coordinate-plane"],
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
            `Solve the second equation for $y$: $${si(m2, b2)}$. ${verdict.en}`,
            `把第二个方程对 $y$ 求解：$${si(m2, b2)}$。${verdict["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "finding-a-coefficient",
      title: t("Choosing a coefficient", "确定系数"),
      explanation: t(
        "A system $\\begin{cases} ax + by = c \\\\ a'x + b'y = c' \\end{cases}$ has no solution or infinitely many exactly when the left side of one equation is a multiple of the other's. For example, $\\begin{cases} 2x + 3y = 4 \\\\ kx + 6y = 5 \\end{cases}$: the $y$-coefficient doubled, so the left sides are proportional when $k = 4$; then $4x + 6y$ would equal both $8$ and $5$, so there is no solution.",
        "方程组 $\\begin{cases} ax + by = c \\\\ a'x + b'y = c' \\end{cases}$ 无解或有无穷多解，当且仅当一个方程的左边是另一个方程左边的倍数。例如 $\\begin{cases} 2x + 3y = 4 \\\\ kx + 6y = 5 \\end{cases}$：$y$ 的系数扩大为 $2$ 倍，所以当 $k = 4$ 时左边成比例；这时 $4x + 6y$ 既要等于 $8$ 又要等于 $5$，所以无解。",
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
              `The $y$-coefficient of the second equation is $${n}$ times that of the first, so the left sides are proportional when $k = ${n} \\cdot ${paren(a)} = ${n * a}$. Then the first equation times $${n}$ reads $${std(n * a, n * b, n * c)}$, which contradicts $= ${num(d)}$: no solution.`,
              `第二个方程中 $y$ 的系数是第一个方程的 $${n}$ 倍，所以当 $k = ${n} \\cdot ${paren(a)} = ${n * a}$ 时左边成比例。这时第一个方程乘以 $${n}$ 得 $${std(n * a, n * b, n * c)}$，与右边 $${num(d)}$ 矛盾：无解。`,
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
            `The left side of the second equation is $${n}$ times that of the first. The equations are equivalent when the constant is multiplied too: $k = ${n} \\cdot ${paren(c)} = ${n * c}$.`,
            `第二个方程的左边是第一个方程左边的 $${n}$ 倍。常数也乘以 $${n}$ 时两个方程等价：$k = ${n} \\cdot ${paren(c)} = ${n * c}$。`,
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
  knowledgePoints: [
    {
      id: "classifying-systems",
      title: t("Classifying a system", "方程组的分类"),
      explanation: t(
        "A system is **consistent** if it has at least one solution, and **inconsistent** if it has none. A consistent system of two linear equations is **independent** if it has exactly one solution and **dependent** if it has infinitely many (its equations are equivalent).\n\n| Solutions | Lines | Class |\n| :--- | :--- | :--- |\n| One | Intersecting | Consistent, independent |\n| Infinitely many | The same line | Consistent, dependent |\n| None | Parallel | Inconsistent |",
        "有解的方程组叫做**相容**的，无解的叫做**不相容**的。由两个一次方程组成的相容方程组，若恰有一个解则是**独立**的，若有无穷多个解（两个方程等价）则是**相关**的。\n\n| 解 | 直线 | 分类 |\n| :--- | :--- | :--- |\n| 一个 | 相交 | 相容且独立 |\n| 无穷多个 | 同一条直线 | 相容且相关 |\n| 没有 | 平行 | 不相容 |",
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
        return choiceProblem({
          prompt: t(`Classify the system $$${system(eqOf(e1), eqOf(e2))}$$`, `判断方程组 $$${system(eqOf(e1), eqOf(e2))}$$ 的类型。`),
          options: classes,
          correct,
          solution: t(`${reason.en} ${end.en}`, `${reason["zh-CN"]}${end["zh-CN"]}`),
        });
      },
    },
    {
      id: "classifying-from-graphs",
      title: t("Classifying from the graphs", "由图像分类"),
      explanation: t(
        "The graphs of the two equations show the class at a glance: lines that cross once give a consistent, independent system; parallel lines an inconsistent one; and lines that lie on top of each other, a consistent, dependent one.",
        "从两个方程的图像可以直接看出类型：相交于一点的两条直线对应相容且独立的方程组；平行线对应不相容的方程组；完全重合的直线对应相容且相关的方程组。",
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
            "The lines cross at one point: one solution, so the system is consistent and independent.",
            "两直线相交于一点：恰有一个解，所以方程组相容且独立。",
          ),
          t("The lines are parallel: no solution, so the system is inconsistent.", "两直线平行：无解，所以方程组不相容。"),
          t(
            "The two lines coincide: infinitely many solutions, so the system is consistent and dependent.",
            "两条直线重合：有无穷多个解，所以方程组相容且相关。",
          ),
        ][kind]!;
        const alt = [
          ["Two lines that cross at one point.", "两条相交于一点的直线。"],
          ["Two parallel lines.", "两条平行的直线。"],
          ["Two lines that lie on top of each other, one drawn dashed.", "两条完全重合的直线，其中一条画成虚线。"],
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
  title: t("Solving Systems by Substitution", "代入消元法"),
  summary: t(
    "Solve a system by substituting an expression for one variable into the other equation.",
    "把表示一个变量的式子代入另一个方程来解方程组。",
  ),
  prerequisites: ["systems-of-linear-equations", "equations-with-parentheses"],
  encompasses: [
    { topic: "systems-of-linear-equations", weight: 0.3 },
    { topic: "equations-with-parentheses", weight: 0.6 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.C.8.B", "CCSS.HSA.REI.C.6"],
  knowledgePoints: [
    {
      id: "substituting-an-expression",
      title: t("Substituting an expression", "代入一个式子"),
      explanation: t(
        "When one equation gives a variable in terms of the other, replace that variable in the other equation by the expression, in parentheses:\n\n$$\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases} \\;\\Rightarrow\\; 3x + 2(2x - 1) = 12 \\;\\Rightarrow\\; 7x - 2 = 12 \\;\\Rightarrow\\; x = 2.$$\n\nThen $y = 2 \\cdot 2 - 1 = 3$; the solution is $(2, 3)$. Distribute to **every** term inside the parentheses.",
        "当一个方程用一个变量表示出另一个变量时，就把另一个方程中的这个变量换成这个式子（加上括号）：\n\n$$\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = 12 \\end{cases} \\;\\Rightarrow\\; 3x + 2(2x - 1) = 12 \\;\\Rightarrow\\; 7x - 2 = 12 \\;\\Rightarrow\\; x = 2.$$\n\n再由 $y = 2 \\cdot 2 - 1 = 3$，方程组的解是 $(2, 3)$。乘法要分配到括号里的**每一项**。",
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
        const work = steps(
          subst,
          `${poly([A + B * m, ov], [B * b0, ""])} = ${num(C)}`,
          `${ov} = ${o}`,
          `${sv} = ${num(m)} \\cdot ${paren(o)} ${b0 < 0 ? "-" : "+"} ${Math.abs(b0)} = ${s}`,
        );
        return pointProblem({
          prompt: t(`Solve the system $$${system(first, second)}$$`, `解方程组 $$${system(first, second)}$$`),
          answer: [x, y],
          wrong: pairs([y, x], slip),
          solution: t(
            `Substitute $${linear(m, b0, ov)}$ for $${sv}$ in the second equation and solve: ${work}The solution is $${pointLatex([x, y])}$.`,
            `把第二个方程中的 $${sv}$ 换成 $${linear(m, b0, ov)}$ 并求解：${work}方程组的解是 $${pointLatex([x, y])}$。`,
          ),
        });
      },
    },
    {
      id: "solving-for-a-variable-first",
      title: t("Solving for a variable first", "先用一个变量表示另一个"),
      explanation: t(
        "If a variable has coefficient $1$ or $-1$ in one equation, solve that equation for it, then substitute:\n\n$$\\begin{cases} x - 3y = 7 \\\\ 2x + y = 0 \\end{cases} \\;\\Rightarrow\\; x = 3y + 7 \\;\\Rightarrow\\; 2(3y + 7) + y = 0 \\;\\Rightarrow\\; y = -2,$$\n\nand $x = 3(-2) + 7 = 1$. Moving $-3y$ across the equals sign makes it $+3y$.",
        "若某个变量在一个方程中的系数是 $1$ 或 $-1$，先由这个方程用另一个变量表示它，再代入：\n\n$$\\begin{cases} x - 3y = 7 \\\\ 2x + y = 0 \\end{cases} \\;\\Rightarrow\\; x = 3y + 7 \\;\\Rightarrow\\; 2(3y + 7) + y = 0 \\;\\Rightarrow\\; y = -2,$$\n\n进而 $x = 3(-2) + 7 = 1$。把 $-3y$ 移到等号另一边变成 $+3y$。",
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
        const work = steps(
          `${un} = ${expr}`,
          swap
            ? `${poly([b2, vn])} ${a2 < 0 ? "-" : "+"} ${coefficient(Math.abs(a2))}(${expr}) = ${num(c2)}`
            : `${coefficient(a2)}(${expr}) ${b2 < 0 ? "-" : "+"} ${poly([Math.abs(b2), vn])} = ${num(c2)}`,
          `${poly([b2 - a2 * sign * b1, vn], [a2 * sign * c1, ""])} = ${num(c2)}`,
          `${vn} = ${v}`,
          `${un} = ${u}`,
        );
        const order = rng.bool();
        const shown = order ? system(e1, e2) : system(e2, e1);
        return pointProblem({
          prompt: t(`Solve the system $$${shown}$$`, `解方程组 $$${shown}$$`),
          answer: [x, y],
          wrong: pairs([y, x], slip),
          solution: t(
            `Solve $${e1}$ for $${un}$, substitute into the other equation, and solve: ${work}The solution is $${pointLatex([x, y])}$.`,
            `由 $${e1}$ 用 $${vn}$ 表示 $${un}$，代入另一个方程并求解：${work}方程组的解是 $${pointLatex([x, y])}$。`,
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
    { topic: "elimination-with-two-transformations", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.3 },
    { topic: "operations-with-rational-numbers", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.6", "CCSS.HSA.REI.D.11"],
  knowledgePoints: [
    {
      id: "two-lines-in-slope-intercept-form",
      title: t("Two lines in slope-intercept form", "两条斜截式直线"),
      explanation: t(
        "The intersection of two lines is the solution of the system of their equations. If both are in slope-intercept form, set the right sides equal:\n\n$$y = 3x - 2,\\; y = -x + 5: \\quad 3x - 2 = -x + 5 \\;\\Rightarrow\\; x = \\frac{7}{4},$$\n\nthen $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$. The lines meet at $\\left(\\frac{7}{4}, \\frac{13}{4}\\right)$; coordinates need not be integers.",
        "两直线的交点就是它们的方程组成的方程组的解。若两个方程都是斜截式，令右边相等：\n\n$$y = 3x - 2,\\; y = -x + 5: \\quad 3x - 2 = -x + 5 \\;\\Rightarrow\\; x = \\frac{7}{4},$$\n\n再由 $y = 3 \\cdot \\frac{7}{4} - 2 = \\frac{13}{4}$，两直线交于 $\\left(\\frac{7}{4}, \\frac{13}{4}\\right)$；坐标不一定是整数。",
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
            `Set the right sides equal: ${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}Then $y = ${evalAt(m1, x, b1)} = ${num(y)}$. The lines meet at $${pointLatex([x, y])}$.`,
            `令右边相等：${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `${poly([m1 - m2, "x"])} = ${num(b2 - b1)}`, `x = ${num(x)}`)}再由 $y = ${evalAt(m1, x, b1)} = ${num(y)}$，两直线交于 $${pointLatex([x, y])}$。`,
          ),
        });
      },
    },
    {
      id: "lines-in-different-forms",
      title: t("Lines in different forms", "不同形式的直线"),
      explanation: t(
        "If one line is in slope-intercept form and the other in standard form, substitute the expression for $y$ into the standard form. For $y = 2x - 3$ and $4x + 3y = 1$:\n\n$$4x + 3(2x - 3) = 1 \\;\\Rightarrow\\; 10x = 10 \\;\\Rightarrow\\; x = 1,$$\n\nand $y = -1$: the lines meet at $(1, -1)$.",
        "若一条直线是斜截式，另一条是标准式，就把表示 $y$ 的式子代入标准式。对于 $y = 2x - 3$ 和 $4x + 3y = 1$：\n\n$$4x + 3(2x - 3) = 1 \\;\\Rightarrow\\; 10x = 10 \\;\\Rightarrow\\; x = 1,$$\n\n再得 $y = -1$：两直线交于 $(1, -1)$。",
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
            `Substitute $${linear(m, b)}$ for $y$: ${steps(sub, `${poly([(A + B * m) / scale, "x"])} = ${num((C - B * b) / scale)}`, `x = ${num(x)}`)}Then $y = ${num(y)}$, and the lines meet at $${pointLatex([x, y])}$.`,
            `把 $y$ 换成 $${linear(m, b)}$：${steps(sub, `${poly([(A + B * m) / scale, "x"])} = ${num((C - B * b) / scale)}`, `x = ${num(x)}`)}再得 $y = ${num(y)}$，两直线交于 $${pointLatex([x, y])}$。`,
          ),
        });
      },
    },
    {
      id: "lines-through-given-points",
      title: t("A line given by two points", "由两点确定的直线"),
      explanation: t(
        "When a line is given by two of its points, first write its equation, then intersect. The line through $(0, 1)$ and $(2, 7)$ has slope $3$, so it is $y = 3x + 1$; with $y = -x + 9$ it meets where $3x + 1 = -x + 9$, at $(2, 7)$.",
        "当一条直线由它上面的两点给出时，先写出它的方程，再求交点。过 $(0, 1)$ 和 $(2, 7)$ 的直线斜率为 $3$，即 $y = 3x + 1$；它与 $y = -x + 9$ 的交点满足 $3x + 1 = -x + 9$，即 $(2, 7)$。",
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
            `The slope of $\\ell$ is $\\frac{${y2 - y1}}{${dx}} = ${m1}$, so $\\ell$ is $${si(m1, b1)}$. Set the right sides equal: ${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `x = ${num(x)}`)}Then $y = ${num(y)}$; the intersection is $${pointLatex([x, y])}$.`,
            `$\\ell$ 的斜率是 $\\frac{${y2 - y1}}{${dx}} = ${m1}$，所以 $\\ell$ 为 $${si(m1, b1)}$。令右边相等：${steps(`${linear(m1, b1)} = ${linear(m2, b2)}`, `x = ${num(x)}`)}再得 $y = ${num(y)}$；交点是 $${pointLatex([x, y])}$。`,
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
            `A theater sold ${N} tickets for a total of $\\$${R}$. Adult tickets cost $\\$${pa}$ each and child tickets $\\$${pc}$ each. How many ${names[ask][0]} were sold?`,
            `剧院共售出 ${N} 张票，收入 ${R} 元。成人票每张 ${pa} 元，儿童票每张 ${pc} 元。售出了多少张${names[ask][1]}？`,
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
            `A farm keeps chickens and rabbits. Together they have ${N} heads and ${L} legs. How many ${names[ask][0]} are there?`,
            `鸡兔同笼，共有 ${N} 个头、${L} 条腿。有多少只${names[ask][1]}？`,
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
              `A school bought ${N} notebooks and pens for $\\$${R}$. Notebooks cost $\\$${pa}$ each and pens $\\$${pb}$ each. How many ${names[ask][0]} did it buy?`,
              `学校花 ${R} 元买了笔记本和钢笔共 ${N} 件。笔记本每本 ${pa} 元，钢笔每支 ${pb} 元。买了多少${ask === 0 ? "本" : "支"}${names[ask][1]}？`,
            )
          : t(
              `A shop packed ${N} boxes of tea, large ones holding ${pa} bags and small ones holding ${pb} bags, ${R} bags in all. How many ${names[ask][0]} are there?`,
              `商店把茶包装成 ${N} 盒，大盒每盒 ${pa} 包，小盒每盒 ${pb} 包，共 ${R} 包。${names[ask][1]}有多少盒？`,
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
  title: t("Modeling with Systems of Linear Equations", "用方程组建模"),
  summary: t("Write and solve systems of equations for problems about two unknown quantities.", "为含两个未知量的问题列出并解方程组。"),
  prerequisites: ["solving-systems-by-substitution", "elimination-with-one-transformation"],
  encompasses: [
    { topic: "solving-systems-by-substitution", weight: 0.4 },
    { topic: "elimination-with-one-transformation", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.8.EE.C.8.C", "CCSS.HSA.CED.A.3"],
  knowledgePoints: [
    {
      id: "sum-and-difference",
      title: t("Two unknown numbers", "两个未知数"),
      explanation: t(
        'Name the two unknowns, translate each fact into an equation, and solve the system. "Two numbers have sum $40$ and difference $6$":\n\n$$\\begin{cases} x + y = 40 \\\\ x - y = 6 \\end{cases} \\;\\Rightarrow\\; 2x = 46,\\; x = 23,\\; y = 17.$$\n\n"The larger number is $4$ more than twice the smaller" becomes $x = 2y + 4$.',
        "设出两个未知数，把每个条件译成一个方程，再解方程组。“两个数的和是 $40$，差是 $6$”：\n\n$$\\begin{cases} x + y = 40 \\\\ x - y = 6 \\end{cases} \\;\\Rightarrow\\; 2x = 46,\\; x = 23,\\; y = 17.$$\n\n“较大的数比较小的数的 $2$ 倍多 $4$”写成 $x = 2y + 4$。",
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
              `Let $x$ be the larger number and $y$ the smaller: ${steps(system(`x + y = ${S}`, `x - y = ${D}`))}Adding gives $2x = ${S + D}$, so $x = ${x}$ and $y = ${S} - ${paren(x)} = ${y}$.`,
              `设较大的数为 $x$，较小的数为 $y$：${steps(system(`x + y = ${S}`, `x - y = ${D}`))}两式相加得 $2x = ${S + D}$，所以 $x = ${x}$，$y = ${S} - ${paren(x)} = ${y}$。`,
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
            `Let $x$ be the larger number and $y$ the smaller: $x + y = ${S}$ and $x = ${c}y + ${k}$. Substitute: ${steps(`${c}y + ${k} + y = ${S}`, `${c + 1}y = ${S - k}`, `y = ${y}`)}Then $x = ${c} \\cdot ${y} + ${k} = ${x}$.`,
            `设较大的数为 $x$，较小的数为 $y$：$x + y = ${S}$，$x = ${c}y + ${k}$。代入：${steps(`${c}y + ${k} + y = ${S}`, `${c + 1}y = ${S - k}`, `y = ${y}`)}所以 $x = ${c} \\cdot ${y} + ${k} = ${x}$。`,
          ),
        });
      },
    },
    {
      id: "counts-and-totals",
      title: t("Counts and totals", "数量与总值"),
      explanation: t(
        "Many problems give the total **number** of items of two kinds and their total **value**. One equation counts, the other adds up values:\n\n$120$ tickets, adults $\\$9$, children $\\$5$, $\\$840$ in all:\n\n$$\\begin{cases} x + y = 120 \\\\ 9x + 5y = 840 \\end{cases}$$\n\nMultiply the first equation by $5$ and subtract: $4x = 240$, so $x = 60$ adult tickets and $y = 60$ child tickets.",
        "很多问题给出两类物品的总**数量**和总**价值**。一个方程表示数量，另一个方程表示价值之和：\n\n共 $120$ 张票，成人票 $9$ 元，儿童票 $5$ 元，共收入 $840$ 元：\n\n$$\\begin{cases} x + y = 120 \\\\ 9x + 5y = 840 \\end{cases}$$\n\n第一个方程乘以 $5$ 再相减：$4x = 240$，所以成人票 $x = 60$ 张，儿童票 $y = 60$ 张。",
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
            `${p.vars.en} ${steps(sys)}Multiply the first equation by $${pb}$ and subtract it from the second: $${pa - pb}x = ${p.total - pb * p.count}$, so $x = ${n[0]}$ and $y = ${p.count} - ${n[0]} = ${n[1]}$. There are ${n[ask]} ${p.names[ask][0]}.`,
            `${p.vars["zh-CN"]}${steps(sys)}第一个方程乘以 $${pb}$，再用第二个方程减去它：$${pa - pb}x = ${p.total - pb * p.count}$，所以 $x = ${n[0]}$，$y = ${p.count} - ${n[0]} = ${n[1]}$。${p.names[ask][1]}有 ${n[ask]} 个。`,
          ),
        });
      },
    },
    {
      id: "writing-the-system",
      title: t("Writing the system", "列出方程组"),
      explanation: t(
        "Before solving, check that each equation says something true about the situation: the counting equation adds numbers of items, and the value equation multiplies each count by **its own** price or size. Mixing up the totals or the prices gives a system that describes a different situation.",
        "求解之前，要检查每个方程都正确描述了情境：数量方程把物品的个数相加，价值方程把每类物品的个数乘以**它自己的**单价或规格。把总数或单价弄混，得到的方程组描述的就是另一种情境了。",
      ),
      generate(rng) {
        const { p } = purchase(rng);
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
            `${p.prompt(0).en} ${p.vars.en} Which system models the situation?`,
            `${p.prompt(0)["zh-CN"]}${p.vars["zh-CN"]}哪个方程组符合题意？`,
          ),
          options: options.map((i) => same(`$${candidates[i]!}$`)),
          correct,
          solution: t(
            `The counts add up to ${N}: $x + y = ${N}$. Each of the $x$ ${p.names[0][0]} contributes $${pa}$ and each of the $y$ ${p.names[1][0]} contributes $${pb}$, for $${R}$ in all: $${poly([pa, "x"], [pb, "y"])} = ${R}$.`,
            `个数之和是 ${N}：$x + y = ${N}$。$x$ 个${p.names[0][1]}每个贡献 $${pa}$，$y$ 个${p.names[1][1]}每个贡献 $${pb}$，合计 $${R}$：$${poly([pa, "x"], [pb, "y"])} = ${R}$。`,
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
  encompasses: [
    { topic: "modeling-with-systems", weight: 0.6 },
    { topic: "decimal-arithmetic", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.3"],
  knowledgePoints: [
    {
      id: "number-of-coins",
      title: t("Counting coins", "数硬币"),
      explanation: t(
        "Work in cents so that every coefficient is an integer. A jar of $30$ coins, all $5$-cent and $25$-cent coins, worth $\\$3.10$ (that is, $310$ cents):\n\n$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$\n\nMultiply the first equation by $5$ and subtract: $20q = 160$, so $q = 8$ and $n = 22$.",
        "以“分”为单位计算，使所有系数都是整数。罐子里有 $30$ 枚硬币，都是 $5$ 分和 $25$ 分的，共 $3.10$ 元（即 $310$ 分）：\n\n$$\\begin{cases} n + q = 30 \\\\ 5n + 25q = 310 \\end{cases}$$\n\n第一个方程乘以 $5$ 再相减：$20q = 160$，所以 $q = 8$，$n = 22$。",
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
            `A jar holds ${N} coins, all ${v1}-cent and ${v2}-cent coins, worth $\\$${money(V)}$ in all. How many ${vs[ask]}-cent coins are there?`,
            `罐子里有 ${N} 枚硬币，都是 ${v1} 分和 ${v2} 分的，共 ${money(V)} 元。${vs[ask]} 分的硬币有多少枚？`,
          ),
          answer: n[ask],
          wrong: [n[1 - ask]!, Q.of(V, v1 + v2), Q.of(V, vs[ask]!)],
          solution: t(
            `Let $a$ be the number of ${v1}-cent coins and $b$ the number of ${v2}-cent coins, and work in cents: ${steps(sys)}Multiply the first equation by $${v1}$ and subtract: $${v2 - v1}b = ${V - v1 * N}$, so $b = ${n[1]}$ and $a = ${n[0]}$. So there are ${n[ask]} coins of ${vs[ask]} cents.`,
            `设 ${v1} 分硬币有 $a$ 枚，${v2} 分硬币有 $b$ 枚，以分为单位：${steps(sys)}第一个方程乘以 $${v1}$ 再相减：$${v2 - v1}b = ${V - v1 * N}$，所以 $b = ${n[1]}$，$a = ${n[0]}$。${vs[ask]} 分的硬币有 ${n[ask]} 枚。`,
          ),
        });
      },
    },
    {
      id: "coins-with-a-relation",
      title: t("Coins related by a condition", "有附加条件的硬币问题"),
      explanation: t(
        'Sometimes the number of one kind of coin is described in terms of the other: "there are $4$ more dimes than quarters" gives $d = q + 4$. Substitute it into the value equation:\n\n$$10(q + 4) + 25q = 425 \\;\\Rightarrow\\; 35q = 385 \\;\\Rightarrow\\; q = 11,\\; d = 15.$$',
        "有时一种硬币的个数是用另一种来描述的：“$10$ 分硬币比 $25$ 分硬币多 $4$ 枚”给出 $d = q + 4$。把它代入价值方程：\n\n$$10(q + 4) + 25q = 425 \\;\\Rightarrow\\; 35q = 385 \\;\\Rightarrow\\; q = 11,\\; d = 15.$$",
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
          ? `${k} times as many ${v1}-cent coins as ${v2}-cent coins`
          : `${k} more ${v1}-cent coins than ${v2}-cent coins`;
        const relZh = twice ? `${v1} 分硬币的枚数是 ${v2} 分硬币的 ${k} 倍` : `${v1} 分硬币比 ${v2} 分硬币多 ${k} 枚`;
        const rel = twice ? `a = ${k}b` : `a = b + ${k}`;
        const subst = twice ? `${v1} \\cdot ${k}b + ${v2}b = ${V}` : `${v1}(b + ${k}) + ${v2}b = ${V}`;
        const coef = twice ? v1 * k + v2 : v1 + v2;
        const rhs = twice ? V : V - v1 * k;
        const slip = twice ? Q.of(V, k + v2) : Q.of(V - k, v1 + v2);
        return numberProblem({
          prompt: t(
            `A purse holds only ${v1}-cent and ${v2}-cent coins, worth $\\$${money(V)}$ in all. There are ${relEn}. How many ${vs[ask]}-cent coins are there?`,
            `钱包里只有 ${v1} 分和 ${v2} 分的硬币，共 ${money(V)} 元。${relZh}。${vs[ask]} 分的硬币有多少枚？`,
          ),
          answer,
          wrong: [ask === 0 ? b : a, ask === 0 ? slip.add(Q.of(twice ? 0 : k)) : slip, twice ? Q.of(V, v1 + v2) : b + k + 1],
          solution: t(
            `Let $a$ be the number of ${v1}-cent coins and $b$ the number of ${v2}-cent coins. Then $${rel}$ and $${v1}a + ${v2}b = ${V}$ (in cents). Substitute: ${steps(subst, `${coef}b = ${rhs}`, `b = ${b}`)}so $a = ${a}$. So there are ${answer} coins of ${vs[ask]} cents.`,
            `设 ${v1} 分硬币有 $a$ 枚，${v2} 分硬币有 $b$ 枚。则 $${rel}$，且 $${v1}a + ${v2}b = ${V}$（以分为单位）。代入：${steps(subst, `${coef}b = ${rhs}`, `b = ${b}`)}所以 $a = ${a}$。${vs[ask]} 分的硬币有 ${answer} 枚。`,
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
