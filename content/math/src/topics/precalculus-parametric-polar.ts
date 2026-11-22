import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, type PlaneMark, type Point, paren, plane, poly, Q } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { choiceProblem, equationProblem, numberProblem, pointProblem, radicalProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus units 8 & 9: Parametric Equations and Polar Coordinates
// (Module 8.28: Parametric Equations; Module 9.29: Polar Coordinates).

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** same writes one text for both locales, as for an option that is only mathematics. */
const same = (s: string) => t(s, s);

/** times writes a coefficient times a value, as "3(-2)", "4" or "-(-4)". */
const times = (a: number, v: number) => (a === 1 ? paren(v) : a === -1 ? `-${paren(v)}` : `${a}(${v})`);

/** oneOf builds a choice problem from the right option and up to three wrong ones, with reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** twelfthsOf reads an angle written as a fraction of pi, such as \frac{5\pi}{6}, as a multiple of pi over 12. */
function twelfthsOf(tex: string): number {
  const found = /^\\frac\{(\d*)\\pi\}\{(\d+)\}$/.exec(tex);
  return (Number(found?.[1] || 1) * 12) / Number(found?.[2] ?? 1);
}

/** piAngle writes a multiple of pi over 12 as a reduced angle in the interval from 0 to 2 pi. */
function piAngle(twelfths: number): string {
  const n = ((twelfths % 24) + 24) % 24;
  if (n === 0) return "0";
  const d = gcd(n, 12);
  const top = n / d === 1 ? "" : `${n / d}`;
  return 12 / d === 1 ? `${top}\\pi` : `\\frac{${top}\\pi}{${12 / d}}`;
}

function sgnTerm(n: number): string {
  if (n === 0) return "";
  return n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function linExpr(a: number, b: number, v = "t"): string {
  let res = "";
  if (a === 1) res = v;
  else if (a === -1) res = `-${v}`;
  else if (a !== 0) res = `${a}${v}`;

  if (b !== 0) {
    if (res === "") res = `${b}`;
    else res += b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  } else if (res === "") {
    res = "0";
  }
  return res;
}

function sq(v: string, h: number): string {
  if (h === 0) return `${v}^2`;
  if (h > 0) return `(${v} - ${h})^2`;
  return `(${v} + ${Math.abs(h)})^2`;
}

function lin(v: string, h: number): string {
  if (h === 0) return v;
  if (h > 0) return `(${v} - ${h})`;
  return `(${v} + ${Math.abs(h)})`;
}

function trigTerm(h: number, c: number, trig: string): string {
  if (c === 0) return `${h}`;
  const cAbs = Math.abs(c);
  const coeff = cAbs === 1 ? trig : `${cAbs}${trig}`;
  if (h === 0) return c < 0 ? `-${coeff}` : coeff;
  return c < 0 ? `${h} - ${coeff}` : `${h} + ${coeff}`;
}

/** traced samples the parametric curve (x(t), y(t)) for t from t1 to t2 as segments. */
function traced(x: (t: number) => number, y: (t: number) => number, t1: number, t2: number, accent = true): PlaneMark[] {
  const n = 80;
  const at = (i: number): Point => {
    const u = t1 + ((t2 - t1) * i) / n;
    return [x(u), y(u)];
  };
  return Array.from({ length: n }, (_, i): PlaneMark => ({ kind: "segment", a: at(i), b: at(i + 1), accent }));
}

/** arrowhead draws an arrowhead at p pointing along the direction d, with sides of length size. */
function arrowhead(p: Point, d: Point, size = 0.5): PlaneMark[] {
  const n = Math.hypot(d[0], d[1]);
  const [ux, uy] = [d[0] / n, d[1] / n];
  return [0.45, -0.45].map((a): PlaneMark => {
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return { kind: "segment", a: p, b: [p[0] - size * (ux * c - uy * s), p[1] - size * (ux * s + uy * c)], accent: true };
  });
}

/** parametricPointsFigure plots x = 2t − 1, y = t² + 3 with the points for t = −2, …, 2. */
const parametricPointsFigure: Figure = {
  svg: plane({ xMin: -6, xMax: 4, yMin: 0, yMax: 9 }, [
    ...traced(
      (u) => 2 * u - 1,
      (u) => u * u + 3,
      -2.2,
      2.2,
    ),
    ...[-2, -1, 0, 1, 2].map(
      (u): PlaneMark => ({
        kind: "point",
        at: [2 * u - 1, u * u + 3],
        label: `t = ${String(u).replace("-", "−")}`,
        dir: u < 0 ? "w" : u > 0 ? "e" : "s",
      }),
    ),
  ]),
  alt: t(
    "The curve x = 2t − 1, y = t² + 3, with the points for t = −2, −1, 0, 1 and 2 marked: (−5, 7), (−3, 4), (−1, 3), (1, 4) and (3, 7).",
    "曲线 x = 2t − 1，y = t² + 3，标出了 t = −2、−1、0、1、2 对应的点：(−5, 7)、(−3, 4)、(−1, 3)、(1, 4)、(3, 7)。",
  ),
};

/** orientationFigure traces x = 2t − 1, y = t² + 3 for t from −2 to 2 with arrows in the direction of increasing t. */
const orientationFigure: Figure = {
  svg: plane({ xMin: -6, xMax: 4, yMin: 0, yMax: 9 }, [
    ...traced(
      (u) => 2 * u - 1,
      (u) => u * u + 3,
      -2,
      2,
    ),
    ...arrowhead([-4, 5.25], [2, -3]),
    ...arrowhead([0, 3.25], [2, 1]),
    ...arrowhead([2, 5.25], [2, 3]),
    { kind: "point", at: [-5, 7], label: "t = −2", dir: "w" },
    { kind: "point", at: [3, 7], label: "t = 2", dir: "e" },
  ]),
  alt: t(
    "The curve x = 2t − 1, y = t² + 3 for t from −2 to 2, traced from the initial point (−5, 7) down through (−1, 3) and up to the terminal point (3, 7), with arrows pointing in the direction of increasing t.",
    "t 从 −2 到 2 时的曲线 x = 2t − 1，y = t² + 3：从起点 (−5, 7) 向下经过 (−1, 3)，再向上到终点 (3, 7)，箭头指向 t 增大的方向。",
  ),
};

/** circleMarks draws the circle of radius r about (h, k). */
const circleMarks = (h: number, k: number, r: number, accent = true) =>
  traced(
    (u) => h + r * Math.cos(u),
    (u) => k + r * Math.sin(u),
    0,
    2 * Math.PI,
    accent,
  );

const sampleAngle = (2 * Math.PI) / 9;
const sampleP: Point = [2 + 3 * Math.cos(sampleAngle), 1 + 3 * Math.sin(sampleAngle)];

/** parametricCircleFigure shows how x = h + r cos θ, y = k + r sin θ locate a point of the circle from its center. */
const parametricCircleFigure: Figure = {
  svg: plane({ xMin: -2, xMax: 7, yMin: -3, yMax: 6 }, [
    ...circleMarks(2, 1, 3),
    { kind: "segment", a: [2, 1], b: sampleP },
    { kind: "segment", a: [2, 1], b: [sampleP[0], 1], dashed: true },
    { kind: "segment", a: [sampleP[0], 1], b: sampleP, dashed: true },
    { kind: "label", at: [2.6, 1.15], text: "θ", dir: "ne" },
    { kind: "label", at: [(2 + sampleP[0]) / 2, (1 + sampleP[1]) / 2], text: "r", dir: "nw" },
    { kind: "label", at: [(2 + sampleP[0]) / 2, 1], text: "r cos θ", dir: "s" },
    { kind: "label", at: [sampleP[0], (1 + sampleP[1]) / 2], text: "r sin θ", dir: "e" },
    { kind: "point", at: [2, 1], label: "(h, k)", dir: "sw" },
    { kind: "point", at: sampleP },
  ]),
  alt: t(
    "A circle with center (h, k) and radius r. The radius to a point of the circle makes the angle θ with the horizontal; the horizontal leg of the right triangle below it has length r cos θ and the vertical leg has length r sin θ, so the point is (h + r cos θ, k + r sin θ).",
    "圆心为 (h, k)、半径为 r 的圆。到圆上一点的半径与水平方向成角 θ；其下方直角三角形的水平直角边长为 r cos θ，竖直直角边长为 r sin θ，所以该点为 (h + r cos θ, k + r sin θ)。",
  ),
};

/** concentricCirclesFigure shows the circles r = 1, 2 and 3 about the pole, with a radius of r = 3 at the angle θ = π/3. */
const concentricCirclesFigure: Figure = {
  svg: plane({ xMin: -4, xMax: 4, yMin: -4, yMax: 4 }, [
    { kind: "circle", center: [0, 0], r: 1 },
    { kind: "circle", center: [0, 0], r: 2 },
    { kind: "circle", center: [0, 0], r: 3, accent: true },
    { kind: "segment", a: [0, 0], b: [1.5, 1.5 * Math.sqrt(3)], accent: true },
    { kind: "label", at: [0.75, 0.75 * Math.sqrt(3)], text: "3", dir: "nw" },
    { kind: "label", at: [1.25, 0.2], text: "θ", dir: "ne" },
    { kind: "point", at: [1.5, 1.5 * Math.sqrt(3)] },
  ]),
  alt: t(
    "Three circles centered at the pole, r = 1, r = 2 and r = 3, the last one highlighted. A radius of length 3 from the pole at the angle θ reaches the circle r = 3: every angle gives a point at distance 3.",
    "三个以极点为圆心的圆 r = 1、r = 2 与 r = 3，最后一个突出显示。从极点出发、与极轴成角 θ、长为 3 的半径到达圆 r = 3：每个角都给出一个到极点距离为 3 的点。",
  ),
};

/** cosineCircleFigure shows r = 4 cos θ, the circle with center (2, 0) and radius 2 through the pole. */
const cosineCircleFigure: Figure = {
  svg: plane({ xMin: -2, xMax: 6, yMin: -3, yMax: 3 }, [
    ...circleMarks(2, 0, 2),
    { kind: "point", at: [2, 0], label: "(2, 0)", dir: "n" },
    { kind: "point", at: [0, 0] },
  ]),
  alt: t(
    "The graph of r = 4 cos θ: a circle with center (2, 0) on the x-axis and radius 2. It passes through the pole and touches the y-axis there.",
    "r = 4 cos θ 的图象：圆心 (2, 0) 在 x 轴上、半径为 2 的圆。它经过极点，并在极点处与 y 轴相切。",
  ),
};

/** sineCircleFigure shows r = 4 sin θ, the circle with center (0, 2) and radius 2 through the pole. */
const sineCircleFigure: Figure = {
  svg: plane({ xMin: -3, xMax: 3, yMin: -2, yMax: 5 }, [
    ...circleMarks(0, 2, 2),
    { kind: "point", at: [0, 2], label: "(0, 2)", dir: "e" },
    { kind: "point", at: [0, 0] },
  ]),
  alt: t(
    "The graph of r = 4 sin θ: a circle with center (0, 2) on the y-axis and radius 2. It passes through the pole and touches the x-axis there.",
    "r = 4 sin θ 的图象：圆心 (0, 2) 在 y 轴上、半径为 2 的圆。它经过极点，并在极点处与 x 轴相切。",
  ),
};

// ─── 8.28.1 Graphing Curves Defined Parametrically ──────────────────────────

/** graphingCurvesDefinedParametrically covers evaluating parametric tables and orientation. */
export const graphingCurvesDefinedParametrically: TopicDef = {
  id: "graphing-curves-defined-parametrically",
  title: t("Graphing Curves Defined Parametrically", "参数方程定义的曲线作图"),
  summary: t(
    "Plot plane curves defined by parametric equations x = f(t) and y = g(t) using a table of values, and determine the orientation (direction of motion) as t increases.",
    "通过数值表绘制参数方程 x = f(t) 与 y = g(t) 定义的平面曲线，并确定随着参数 t 增大曲线的方向（运动取向）。",
  ),
  prerequisites: ["equations-of-circles"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7", "CCSS.HSN.VM.A.1"],
  intro: t(
    `A graph $y = f(x)$ gives one coordinate from the other. A moving point is often easier to describe by giving both coordinates from a third variable, the time $t$. Say an ant is at $x = t + 1$, $y = t^{2}$ at time $t$. A table of times gives its positions:

$$\\begin{array}{c|cccc} t & -1 & 0 & 1 & 2 \\\\ \\hline (x, y) & (0, 1) & (1, 0) & (2, 1) & (3, 4) \\end{array}$$

Joined in the order of $t$, these points trace a parabola from $(0, 1)$ down to $(1, 0)$ and up to $(3, 4)$.

Check: $t = x - 1$ turns $y = t^{2}$ into $y = (x - 1)^{2}$, and at $x = 3$ that gives $2^{2} = 4$, the last point of the table.

In this lesson we find the points of a curve from values of its parameter, find where the curve starts and ends as the parameter increases, and find the parameter at a given point.`,
    `函数图象 $y = f(x)$ 由一个坐标得到另一个坐标。描述一个运动的点时，常常更方便的是用第三个变量——时间 $t$——同时给出两个坐标。比如一只蚂蚁在时刻 $t$ 位于 $x = t + 1$，$y = t^{2}$。列出几个时刻，就得到它的位置：

$$\\begin{array}{c|cccc} t & -1 & 0 & 1 & 2 \\\\ \\hline (x, y) & (0, 1) & (1, 0) & (2, 1) & (3, 4) \\end{array}$$

按 $t$ 的顺序连起来，这些点描出一条抛物线：从 $(0, 1)$ 下到 $(1, 0)$，再上到 $(3, 4)$。

检验：由 $t = x - 1$，$y = t^{2}$ 变成 $y = (x - 1)^{2}$；$x = 3$ 时得 $2^{2} = 4$，正是表中最后一个点。

这节课我们由参数的取值求曲线上的点，求参数增大时曲线的起点和终点，并求给定点对应的参数。`,
  ),
  knowledgePoints: [
    {
      id: "plotting-parametric-points",
      title: t("Plotting points from parametric equations", "由参数方程列表描点"),
      explanation: t(
        "A plane curve can be defined parametrically by expressing both coordinates as functions of a third variable called a **parameter** $t$:\n$$x = f(t), \\quad y = g(t)$$\nTo plot points on the curve, substitute chosen values of $t$ into $f(t)$ and $g(t)$ to obtain coordinate pairs $(x(t), y(t))$ on the Cartesian plane.\n\nFor example, if $x(t) = 2t - 1$ and $y(t) = t^2 + 3$, then at $t = 2$:\n$$x(2) = 2(2) - 1 = 3, \\quad y(2) = 2^2 + 3 = 7$$\nyielding the point $(3, 7)$.\n\nCheck: $2t - 1 = 3$ only at $t = 2$, so $(3, 7)$ is the point of the curve for $t = 2$ and no other; in the figure it is the point marked $t = 2$.\n\n> **Watch out.** The first coordinate comes from $x(t)$ and the second from $y(t)$: the answer is $(3, 7)$, not $(7, 3)$. Square $t$ before multiplying: at $t = -2$, $t^{2} = 4$, not $-4$.",
        "平面曲线可以通过将两个坐标分别表示为第三个变量（称为**参数** $t$）的函数来定义：\n$$x = f(t), \\quad y = g(t)$$\n作图时，选取参数 $t$ 的特定取值代入 $f(t)$ 与 $g(t)$，得到直角坐标平面上的点 $(x(t), y(t))$。\n\n例如，若 $x(t) = 2t - 1$ 且 $y(t) = t^2 + 3$，则在 $t = 2$ 处：\n$$x(2) = 2(2) - 1 = 3, \\quad y(2) = 2^2 + 3 = 7$$\n对应的平面点坐标为 $(3, 7)$。\n\n检验：$2t - 1 = 3$ 只在 $t = 2$ 时成立，所以 $(3, 7)$ 是曲线上 $t = 2$ 对应的点，且只对应这个 $t$；图中它就是标着 $t = 2$ 的点。\n\n> **注意。** 第一个坐标来自 $x(t)$，第二个来自 $y(t)$：答案是 $(3, 7)$，不是 $(7, 3)$。先把 $t$ 平方再乘系数：$t = -2$ 时 $t^{2} = 4$，不是 $-4$。",
      ),
      figure: parametricPointsFigure,
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.int(-5, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const t0 = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const xVal = a * t0 + b;
        const yVal = c * t0 * t0 + d;
        const xExpr = linExpr(a, b, "t");
        const yExpr = `${c === 1 ? "" : c === -1 ? "-" : c}t^2 ${sgnTerm(d)}`.trim();
        return pointProblem({
          prompt: t(
            `For the curve defined parametrically by $x(t) = ${xExpr}$ and $y(t) = ${yExpr}$, find the point $(x, y)$ corresponding to $t = ${t0}$.`,
            `对于参数方程为 $x(t) = ${xExpr}$ 和 $y(t) = ${yExpr}$ 的曲线，求当 $t = ${t0}$ 时对应的点 $(x, y)$ 的坐标。`,
          ),
          answer: [xVal, yVal],
          wrong: [
            [yVal, xVal],
            [xVal, -yVal],
            [-xVal, yVal],
            [xVal + 2, yVal],
            [xVal, yVal - 3],
          ],
          solution: walked(
            [
              [
                ["Find x", "求 x"],
                t(`Put $t = ${t0}$ into $x(t) = ${xExpr}$:`, `把 $t = ${t0}$ 代入 $x(t) = ${xExpr}$：`),
                [`x(${t0}) = ${times(a, t0)} ${sgnTerm(b)} = ${xVal}`],
              ],
              [
                ["Find y", "求 y"],
                t(`Put the same $t$ into $y(t) = ${yExpr}$, squaring first:`, `把同一个 $t$ 代入 $y(t) = ${yExpr}$，先平方：`),
                [`y(${t0}) = ${times(c, t0)}^{2} ${sgnTerm(d)} = ${times(c, t0 * t0)} ${sgnTerm(d)} = ${yVal}`],
              ],
            ],
            t(
              `Solving $${poly([a, "t"])} ${sgnTerm(b)} = ${xVal}$ gives $${poly([a, "t"])} = ${xVal - b}$, so $t = ${t0}$: the only parameter with this $x$ is the given one, and it gives $y = ${yVal}$. The point is $(${xVal}, ${yVal})$.`,
              `解 $${poly([a, "t"])} ${sgnTerm(b)} = ${xVal}$ 得 $${poly([a, "t"])} = ${xVal - b}$，所以 $t = ${t0}$：有这个 $x$ 的参数只有给定的这一个，它给出 $y = ${yVal}$。所求点为 $(${xVal}, ${yVal})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "direction-of-motion-orientation",
      title: t("Orientation and direction of motion", "曲线的取向与运动方向"),
      explanation: t(
        "As the parameter $t$ increases along an interval $[t_1, t_2]$, the point $(x(t), y(t))$ traces the curve in a specific direction called the **orientation** of the curve.\n\nThe point corresponding to the smallest parameter value $t = t_1$ is the **initial point** $(x(t_1), y(t_1))$, and the point corresponding to $t = t_2$ is the **terminal point** $(x(t_2), y(t_2))$. Directional arrows are placed along the curve to display this movement. For $x = 2t - 1$, $y = t^{2} + 3$ with $-2 \\le t \\le 2$, the initial point is $(-5, 7)$ and the terminal point is $(3, 7)$.\n\nCheck: halfway, $t = 0$ gives $(-1, 3)$, the lowest point, which the curve passes between its two ends, as the arrows in the figure show.\n\n> **Watch out.** The initial point belongs to the smallest value of $t$, not to the smallest $x$ or $y$. When $x(t)$ decreases, the curve starts on the right and moves left.",
        "当参数 $t$ 在区间 $[t_1, t_2]$ 上逐渐增大时，动点 $(x(t), y(t))$ 在曲线上运动的方向称为曲线的**取向**（或运动方向）。\n\n对应区间左端点 $t = t_1$ 的点称为**起点**（初始点）$(x(t_1), y(t_1))$，对应右端点 $t = t_2$ 的点称为**终点**（终止点）$(x(t_2), y(t_2))$。通常在曲线上标出箭头以指示随 $t$ 增大的运动方向。对于 $x = 2t - 1$，$y = t^{2} + 3$（$-2 \\le t \\le 2$），起点是 $(-5, 7)$，终点是 $(3, 7)$。\n\n检验：中间的 $t = 0$ 给出 $(-1, 3)$，即最低点，曲线在两端之间经过它，正如图中箭头所示。\n\n> **注意。** 起点对应 $t$ 的最小值，而不是最小的 $x$ 或 $y$。$x(t)$ 递减时，曲线从右边出发向左移动。",
      ),
      figure: orientationFigure,
      generate(rng) {
        const t1 = rng.pick([-3, -2, -1, 0]);
        const t2 = rng.pick([1, 2, 3, 4]);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.int(-4, 4);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-4, 4);
        const xExpr = linExpr(a, b, "t");
        const yExpr = linExpr(c, d, "t");
        const x1 = a * t1 + b;
        const y1 = c * t1 + d;
        const x2 = a * t2 + b;
        const y2 = c * t2 + d;
        const askInitial = rng.bool();
        const ans: [number, number] = askInitial ? [x1, y1] : [x2, y2];
        const other: [number, number] = askInitial ? [x2, y2] : [x1, y1];
        return pointProblem({
          prompt: askInitial
            ? t(
                `A curve is defined parametrically by $x(t) = ${xExpr}$ and $y(t) = ${yExpr}$ for $t \\in [${t1}, ${t2}]$. Find the initial point $(x, y)$ as $t$ increases.`,
                `已知参数方程 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$，其中 $t \\in [${t1}, ${t2}]$。求随着 $t$ 增大，曲线的起点坐标 $(x, y)$。`,
              )
            : t(
                `A curve is defined parametrically by $x(t) = ${xExpr}$ and $y(t) = ${yExpr}$ for $t \\in [${t1}, ${t2}]$. Find the terminal point $(x, y)$ as $t$ increases.`,
                `已知参数方程 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$，其中 $t \\in [${t1}, ${t2}]$。求随着 $t$ 增大，曲线的终点坐标 $(x, y)$。`,
              ),
          answer: ans,
          wrong: [other, [ans[1], ans[0]], [ans[0], -ans[1]], [ans[0] + 1, ans[1]]],
          solution: walked(
            [
              [
                ["Evaluate at the start", "计算区间起点"],
                t(`The smallest value of $t$ is $t = ${t1}$, where the motion begins:`, `$t$ 的最小值是 $t = ${t1}$，运动从这里开始：`),
                [`x(${t1}) = ${times(a, t1)} ${sgnTerm(b)} = ${x1}, \\quad y(${t1}) = ${times(c, t1)} ${sgnTerm(d)} = ${y1}`],
              ],
              [
                ["Evaluate at the end", "计算区间终点"],
                t(`The largest value is $t = ${t2}$, where the motion ends:`, `最大值是 $t = ${t2}$，运动到这里结束：`),
                [`x(${t2}) = ${times(a, t2)} ${sgnTerm(b)} = ${x2}, \\quad y(${t2}) = ${times(c, t2)} ${sgnTerm(d)} = ${y2}`],
              ],
            ],
            t(
              `Each unit of $t$ moves $x$ by $${a}$, and $t$ runs over $${t2 - t1}$ units, so $x$ goes from $${x1}$ to $${x1} ${sgnTerm(a * (t2 - t1))} = ${x2}$, as found. The ${askInitial ? "initial" : "terminal"} point is $(${ans[0]}, ${ans[1]})$.`,
              `$t$ 每增加 1，$x$ 变化 $${a}$；$t$ 一共走过 $${t2 - t1}$ 个单位，所以 $x$ 从 $${x1}$ 变到 $${x1} ${sgnTerm(a * (t2 - t1))} = ${x2}$，与上面一致。${askInitial ? "起点" : "终点"}是 $(${ans[0]}, ${ans[1]})$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.2 Cartesian Equations of Parametric Curves ────────────────────────

/** cartesianEquationsOfParametricCurves covers eliminating the parameter algebraically and trigonometrically. */
export const cartesianEquationsOfParametricCurves: TopicDef = {
  id: "cartesian-equations-of-parametric-curves",
  title: t("Cartesian Equations of Parametric Curves", "消参法求平面曲线的普通方程"),
  summary: t(
    "Eliminate the parameter t by algebraic substitution or trigonometric identities to find the Cartesian equation of a curve, taking into account domain restrictions.",
    "通过代数消元法或三角恒等式消除参数 t，求解曲线的直角坐标方程（普通方程），并注意自变量的取值范围限制。",
  ),
  prerequisites: ["graphing-curves-defined-parametrically"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7", "CCSS.HSG.GPE.A.3"],
  intro: t(
    `Parametric equations say where a point is at each value of $t$; an equation in $x$ and $y$ alone says which points the curve contains. To get the second from the first, remove $t$. Take $x = t - 3$, $y = 2t$. The first equation gives $t = x + 3$, and putting that into the second gives

$$y = 2(x + 3) = 2x + 6$$

so the curve is a line.

Check: $t = 1$ gives the point $(-2, 2)$, and $2(-2) + 6 = 2$.

In this lesson we eliminate the parameter by substitution, eliminate an angle with the identity $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$, and find the slope of a line given parametrically.`,
    `参数方程说明每个 $t$ 值时点在哪里；只含 $x$ 和 $y$ 的方程说明曲线包含哪些点。要由前者得到后者，就要消去 $t$。取 $x = t - 3$，$y = 2t$。由第一个方程得 $t = x + 3$，代入第二个方程得

$$y = 2(x + 3) = 2x + 6$$

所以这条曲线是直线。

检验：$t = 1$ 给出点 $(-2, 2)$，而 $2(-2) + 6 = 2$。

这节课我们用代入法消去参数，用恒等式 $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$ 消去角参数，并求参数形式给出的直线的斜率。`,
  ),
  knowledgePoints: [
    {
      id: "eliminate-parameter-algebraic",
      title: t("Eliminating parameter by algebraic substitution", "代数代入消参法"),
      explanation: t(
        "To find the Cartesian equation $y = f(x)$ from parametric equations $x = f(t)$ and $y = g(t)$:\n1. Solve for $t$ in terms of $x$ (for example, $x = t + h \\implies t = x - h$).\n2. Substitute the expression for $t$ into the equation for $y$.\n3. Simplify the resulting equation.\n\nFor example, if $x = t + 2$ and $y = 3t^2 - 1$, then $t = x - 2$, giving $y = 3(x - 2)^2 - 1$.\n\nCheck: $t = 1$ gives the point $(3, 2)$ of the curve, and the equation gives $3(3 - 2)^{2} - 1 = 2$.\n\n> **Watch out.** Solving $x = t + 2$ for $t$ subtracts: $t = x - 2$, so the square is $(x - 2)^{2}$, not $(x + 2)^{2}$. The result gives $y$ in terms of $x$; keep the constant of $y(t)$ with its own sign.",
        "由参数方程 $x = f(t)$ 与 $y = g(t)$ 求直角坐标方程（普通方程）$y = f(x)$ 的步骤：\n1. 从较简方程中解出参数 $t$（例如 $x = t + h \\implies t = x - h$）。\n2. 将 $t$ 的表达式代入关于 $y$ 的方程中。\n3. 化简所得方程。\n\n例如，若 $x = t + 2$ 且 $y = 3t^2 - 1$，则 $t = x - 2$，代入得 $y = 3(x - 2)^2 - 1$。\n\n检验：$t = 1$ 给出曲线上的点 $(3, 2)$，而方程给出 $3(3 - 2)^{2} - 1 = 2$。\n\n> **注意。** 由 $x = t + 2$ 解 $t$ 要做减法：$t = x - 2$，所以平方项是 $(x - 2)^{2}$，不是 $(x + 2)^{2}$。结果是用 $x$ 表示 $y$；$y(t)$ 中的常数保持原来的符号。",
      ),
      generate(rng) {
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xExpr = linExpr(1, h, "t");
        const yExpr = `${a === 1 ? "" : a === -1 ? "-" : a}t^2 ${sgnTerm(k)}`.trim();
        const aCoeff = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const rightEq = `y = ${aCoeff}${sq("x", h)} ${sgnTerm(k)}`.trim();
        const wrong1 = `y = ${aCoeff}${sq("x", -h)} ${sgnTerm(k)}`.trim();
        const wrong2 = `x = ${aCoeff}${sq("y", h)} ${sgnTerm(k)}`.trim();
        const wrong3 = `y = ${aCoeff}${sq("x", h)} ${sgnTerm(-k)}`.trim();
        const wrong4 = `y = ${a === -1 ? "" : a + 1 === -1 ? "-" : a + 1}${sq("x", h)} ${sgnTerm(k)}`.trim();
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $t$ to find the Cartesian equation of the curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `消去参数 $t$，求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的直角坐标方程。`,
          ),
          answer: rightEq,
          wrong: [wrong1, wrong2, wrong3, wrong4],
          solution: walked(
            [
              [
                ["Solve for t", "解出 t"],
                t(`The equation $x = ${xExpr}$ is linear in $t$:`, `方程 $x = ${xExpr}$ 关于 $t$ 是一次的：`),
                [`t = ${linExpr(1, -h, "x")}`],
              ],
              [["Substitute", "代入"], t(`Replace $t$ in $y = ${yExpr}$:`, `把 $y = ${yExpr}$ 中的 $t$ 换掉：`), [rightEq]],
            ],
            t(
              `At $t = 1$ the curve is at $(${1 + h}, ${a + k})$, and the equation gives $${aCoeff}(${1 + h} ${sgnTerm(-h)})^{2} ${sgnTerm(k)} = ${a + k}$.`,
              `$t = 1$ 时曲线在 $(${1 + h}, ${a + k})$，而方程给出 $${aCoeff}(${1 + h} ${sgnTerm(-h)})^{2} ${sgnTerm(k)} = ${a + k}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "eliminate-parameter-trigonometric",
      title: t("Eliminating parameter using trigonometric identities", "利用三角恒等式消参"),
      explanation: t(
        "When parametric equations contain trigonometric functions, isolate the trigonometric terms and use the fundamental Pythagorean identity:\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\nGiven $x = h + a\\cos\\theta$ and $y = k + b\\sin\\theta$, we have $\\frac{x - h}{a} = \\cos\\theta$ and $\\frac{y - k}{b} = \\sin\\theta$. Squaring and adding gives the standard ellipse equation:\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\n\nFor $x = 1 + 3\\cos\\theta$, $y = -2 + 2\\sin\\theta$: $\\cos\\theta = \\frac{x - 1}{3}$ and $\\sin\\theta = \\frac{y + 2}{2}$, so\n$$\\frac{(x - 1)^{2}}{9} + \\frac{(y + 2)^{2}}{4} = 1$$\nCheck: $\\theta = 0$ gives the point $(4, -2)$, and $\\frac{9}{9} + \\frac{0}{4} = 1$.\n\n> **Watch out.** Square the whole fraction, so the denominators become $a^{2}$ and $b^{2}$: $9$, not $3$. And $x = h + a\\cos\\theta$ gives $x - h$ on top, with the sign of $h$ reversed.",
        "当参数方程含有三角函数时，先将三角函数单独分离出来，再利用同角三角函数的基本平方关系：\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\n对于 $x = h + a\\cos\\theta$ 与 $y = k + b\\sin\\theta$，可得 $\\frac{x - h}{a} = \\cos\\theta$ 和 $\\frac{y - k}{b} = \\sin\\theta$。两式分别平方后相加，即得椭圆的标准方程：\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\n\n对 $x = 1 + 3\\cos\\theta$，$y = -2 + 2\\sin\\theta$：$\\cos\\theta = \\frac{x - 1}{3}$，$\\sin\\theta = \\frac{y + 2}{2}$，所以\n$$\\frac{(x - 1)^{2}}{9} + \\frac{(y + 2)^{2}}{4} = 1$$\n检验：$\\theta = 0$ 给出点 $(4, -2)$，而 $\\frac{9}{9} + \\frac{0}{4} = 1$。\n\n> **注意。** 要把整个分式平方，所以分母变成 $a^{2}$ 和 $b^{2}$：是 $9$，不是 $3$。由 $x = h + a\\cos\\theta$ 得到的分子是 $x - h$，$h$ 的符号要反过来。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const xTerm = trigTerm(h, a, "\\cos\\theta");
        const yTerm = trigTerm(k, b, "\\sin\\theta");
        const a2 = a * a;
        const b2 = b * b;
        const rightEq = `\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1`;
        const wrong1 = `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`;
        const wrong2 = `\\frac{${sq("x", h)}}{${b2}} + \\frac{${sq("y", k)}}{${a2}} = 1`;
        const wrong3 = `\\frac{${sq("x", -h)}}{${a2}} + \\frac{${sq("y", -k)}}{${b2}} = 1`;
        const wrong4 = `\\frac{${lin("x", h)}}{${a}} + \\frac{${lin("y", k)}}{${b}} = 1`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $\\theta$ from $x = ${xTerm}$, $y = ${yTerm}$ ($0 \\le \\theta < 2\\pi$) to find its Cartesian equation.`,
            `消去参数 $\\theta$（$0 \\le \\theta < 2\\pi$），求曲线 $x = ${xTerm}$，$y = ${yTerm}$ 的直角坐标方程。`,
          ),
          answer: rightEq,
          wrong: [wrong1, wrong2, wrong3, wrong4],
          solution: walked(
            [
              [
                ["Isolate cosine and sine", "分离余弦和正弦"],
                t(`Move the constant over and divide by the coefficient in each equation:`, `在每个方程中移走常数，再除以系数：`),
                [`\\cos\\theta = \\frac{${linExpr(1, -h, "x")}}{${a}}, \\quad \\sin\\theta = \\frac{${linExpr(1, -k, "y")}}{${b}}`],
              ],
              [
                ["Square and add", "平方后相加"],
                t(`Since $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$:`, `因为 $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$：`),
                [
                  `\\left(\\frac{${linExpr(1, -h, "x")}}{${a}}\\right)^{2} + \\left(\\frac{${linExpr(1, -k, "y")}}{${b}}\\right)^{2} = 1`,
                  rightEq,
                ],
              ],
            ],
            t(
              `At $\\theta = 0$ the curve is at $(${h + a}, ${k})$, where $x$ is $${a}$ from $${h}$ and $y = ${k}$: the equation gives $${a2} / ${a2} + 0 = 1$.`,
              `$\\theta = 0$ 时曲线在 $(${h + a}, ${k})$，这里 $x$ 与 $${h}$ 相差 $${a}$，$y = ${k}$：方程给出 $${a2} / ${a2} + 0 = 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.3 Finding Intercepts of Curves Defined Parametrically ─────────────

/** findingInterceptsOfCurvesDefinedParametrically covers x- and y-intercepts of parametric curves. */
export const findingInterceptsOfCurvesDefinedParametrically: TopicDef = {
  id: "finding-intercepts-of-curves-defined-parametrically",
  title: t("Finding Intercepts of Curves Defined Parametrically", "求参数方程曲线的坐标轴截距"),
  summary: t(
    "Find the x-intercepts and y-intercepts of parametric curves by solving x(t) = 0 and y(t) = 0 for the parameter t.",
    "通过分别令 x(t) = 0 与 y(t) = 0 求解参数 t，进而确定参数曲线与坐标轴的截距及交点坐标。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7"],
  intro: t(
    `A curve crosses the $y$-axis where its $x$-coordinate is $0$, and the $x$-axis where its $y$-coordinate is $0$. With parametric equations, each of these is an equation in $t$. Take $x = t - 2$, $y = t^{2} - 1$. Then $x = 0$ at $t = 2$, where $y = 3$: the curve crosses the $y$-axis at $(0, 3)$. And $y = 0$ at $t = \\pm 1$, where $x = -1$ and $x = -3$: it crosses the $x$-axis at $(-1, 0)$ and $(-3, 0)$.

Check: eliminating $t = x + 2$ gives $y = (x + 2)^{2} - 1$, and $x = 0$ gives $4 - 1 = 3$.

In this lesson we find the $y$-intercepts by solving $x(t) = 0$, the $x$-intercepts by solving $y(t) = 0$, and keep only the values of $t$ inside a given range.`,
    `曲线在 $x$ 坐标为 $0$ 处穿过 $y$ 轴，在 $y$ 坐标为 $0$ 处穿过 $x$ 轴。对参数方程来说，这各是一个关于 $t$ 的方程。取 $x = t - 2$，$y = t^{2} - 1$。$t = 2$ 时 $x = 0$，此时 $y = 3$：曲线在 $(0, 3)$ 穿过 $y$ 轴。$t = \\pm 1$ 时 $y = 0$，此时 $x = -1$ 和 $x = -3$：曲线在 $(-1, 0)$ 和 $(-3, 0)$ 穿过 $x$ 轴。

检验：消去 $t = x + 2$ 得 $y = (x + 2)^{2} - 1$，代入 $x = 0$ 得 $4 - 1 = 3$。

这节课我们解 $x(t) = 0$ 求 $y$ 轴截距，解 $y(t) = 0$ 求 $x$ 轴截距，并只保留给定范围内的 $t$ 值。`,
  ),
  knowledgePoints: [
    {
      id: "parametric-y-intercepts",
      title: t("Finding y-intercepts of a parametric curve", "求参数曲线的 y 轴截距"),
      explanation: t(
        "The $y$-intercepts of a curve occur where the curve crosses the $y$-axis, which corresponds to $x(t) = 0$:\n1. Set $x(t) = 0$ and solve for the parameter $t$.\n2. For each real solution $t$, evaluate $y(t)$ to obtain the intercept point $(0, y(t))$.\n\nFor example, if $x(t) = t^2 - 4$ and $y(t) = 2t + 1$, setting $x(t) = 0$ gives $t = \\pm 2$. Then $y(2) = 5$ and $y(-2) = -3$, yielding $y$-intercepts at $(0, 5)$ and $(0, -3)$.\n\nCheck: both points really lie on the $y$-axis, since $x(2) = x(-2) = 4 - 4 = 0$.\n\n> **Watch out.** A $y$-intercept has $x = 0$, so solve $x(t) = 0$, not $y(t) = 0$, and write it as $(0, y)$. Both roots $t = \\pm 2$ count, and each gives its own point; $t = 0$ gives $x = -4$, which is not on the axis.",
        "曲线的 $y$ 轴截距（与 $y$ 轴的交点）发生在 $x(t) = 0$ 处：\n1. 令 $x(t) = 0$ 并求出参数 $t$ 的实数解。\n2. 将所求出的每个 $t$ 值代入 $y(t)$，得到截距交点坐标 $(0, y(t))$。\n\n例如，若 $x(t) = t^2 - 4$ 且 $y(t) = 2t + 1$，令 $x(t) = 0$ 得 $t = \\pm 2$。计算得 $y(2) = 5$ 与 $y(-2) = -3$，因此 $y$ 轴截距交点为 $(0, 5)$ 和 $(0, -3)$。\n\n检验：两个点确实在 $y$ 轴上，因为 $x(2) = x(-2) = 4 - 4 = 0$。\n\n> **注意。** $y$ 轴截距处 $x = 0$，所以要解 $x(t) = 0$，不是 $y(t) = 0$，并写成 $(0, y)$。两个根 $t = \\pm 2$ 都要算，各给出一个点；$t = 0$ 给出 $x = -4$，不在坐标轴上。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const k2 = k * k;
        const xExpr = `t^2 - ${k2}`;
        const yExpr = linExpr(c, d, "t");
        const y1 = c * k + d;
        const y2 = -c * k + d;
        const smaller = Math.min(y1, y2);
        const larger = Math.max(y1, y2);
        const wrong = [
          t(`$(${smaller}, 0)$ and $(${larger}, 0)$`, `$(${smaller}, 0)$ 和 $(${larger}, 0)$`),
          t(`$(0, ${smaller + 1})$ and $(0, ${larger + 1})$`, `$(0, ${smaller + 1})$ 和 $(0, ${larger + 1})$`),
          t(`$(0, ${d})$`, `$(0, ${d})$`),
          ...(d === 0 ? [] : [t(`$(0, ${-smaller})$ and $(0, ${-larger})$`, `$(0, ${-smaller})$ 和 $(0, ${-larger})$`)]),
        ];
        return oneOf(
          rng,
          t(
            `Find all $y$-intercepts of the parametric curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的所有 $y$ 轴截距交点坐标。`,
          ),
          t(`$(0, ${smaller})$ and $(0, ${larger})$`, `$(0, ${smaller})$ 和 $(0, ${larger})$`),
          wrong,
          walked(
            [
              [
                ["Set x(t) = 0", "令 x(t) = 0"],
                t(`On the $y$-axis the $x$-coordinate is $0$:`, `在 $y$ 轴上，$x$ 坐标为 $0$：`),
                [`t^{2} - ${k2} = 0 \\implies t^{2} = ${k2} \\implies t = \\pm ${k}`],
              ],
              [
                ["Find y at each root", "求每个根处的 y"],
                t(`Put both values into $y(t) = ${yExpr}$:`, `把两个值都代入 $y(t) = ${yExpr}$：`),
                [`y(${k}) = ${times(c, k)} ${sgnTerm(d)} = ${y1}, \\quad y(${-k}) = ${times(c, -k)} ${sgnTerm(d)} = ${y2}`],
              ],
            ],
            t(
              `$x(\\pm ${k}) = ${k2} - ${k2} = 0$, so both points are on the $y$-axis, and they are $|${y1} - ${paren(y2)}| = ${Math.abs(y1 - y2)}$ apart, which is $|${c}|$ times the gap $${2 * k}$ between the two values of $t$. The $y$-intercepts are $(0, ${smaller})$ and $(0, ${larger})$.`,
              `$x(\\pm ${k}) = ${k2} - ${k2} = 0$，所以两个点都在 $y$ 轴上；它们相距 $|${y1} - ${paren(y2)}| = ${Math.abs(y1 - y2)}$，正是两个 $t$ 值之差 $${2 * k}$ 的 $|${c}|$ 倍。$y$ 轴截距交点为 $(0, ${smaller})$ 和 $(0, ${larger})$。`,
            ),
          ),
          [
            why(
              wrong[0]!,
              "The coordinates are in the wrong order: a point on the $y$-axis has $x = 0$ first.",
              "坐标顺序反了：$y$ 轴上的点第一个坐标 $x = 0$。",
            ),
            why(
              wrong[1]!,
              `Both values are $1$ too large: $y(${k}) = ${y1}$ and $y(${-k}) = ${y2}$.`,
              `两个值都大了 $1$：$y(${k}) = ${y1}$，$y(${-k}) = ${y2}$。`,
            ),
            why(
              wrong[2]!,
              `This is the point at $t = 0$, but there $x = ${-k2}$, so it is not on the $y$-axis.`,
              `这是 $t = 0$ 对应的点，但那里 $x = ${-k2}$，不在 $y$ 轴上。`,
            ),
            ...(wrong[3]
              ? [
                  why(
                    wrong[3],
                    `The signs of $y$ are flipped: $y(${k}) = ${y1}$, not $${-y1}$.`,
                    `$y$ 的符号反了：$y(${k}) = ${y1}$，不是 $${-y1}$。`,
                  ),
                ]
              : []),
          ],
        );
      },
    },
    {
      id: "parametric-x-intercepts",
      title: t("Finding x-intercepts of a parametric curve", "求参数曲线的 x 轴截距"),
      explanation: t(
        "The $x$-intercepts of a curve occur where the curve crosses the $x$-axis, which corresponds to $y(t) = 0$:\n1. Set $y(t) = 0$ and solve for $t$.\n2. Substitute each real solution $t$ into $x(t)$ to find the intercept point $(x(t), 0)$.\n\nFor example, if $x(t) = 3t - 2$ and $y(t) = t^2 - 9$, setting $y(t) = 0$ gives $t = \\pm 3$. Then $x(3) = 7$ and $x(-3) = -11$, giving $x$-intercepts at $(7, 0)$ and $(-11, 0)$.\n\nCheck: both points lie on the $x$-axis, since $y(3) = y(-3) = 9 - 9 = 0$.\n\n> **Watch out.** An $x$-intercept has $y = 0$, so solve $y(t) = 0$ and put the roots into $x(t)$; write the point as $(x, 0)$. Use both roots: $x(-3) = 3(-3) - 2 = -11$.",
        "曲线的 $x$ 轴截距（与 $x$ 轴的交点）发生在 $y(t) = 0$ 处：\n1. 令 $y(t) = 0$ 并求解参数 $t$。\n2. 将所求出的每个实数解 $t$ 代入 $x(t)$，得到交点坐标 $(x(t), 0)$。\n\n例如，若 $x(t) = 3t - 2$ 且 $y(t) = t^2 - 9$，令 $y(t) = 0$ 得 $t = \\pm 3$。计算得 $x(3) = 7$ 与 $x(-3) = -11$，因此 $x$ 轴截距交点为 $(7, 0)$ 和 $(-11, 0)$。\n\n检验：两个点都在 $x$ 轴上，因为 $y(3) = y(-3) = 9 - 9 = 0$。\n\n> **注意。** $x$ 轴截距处 $y = 0$，所以要解 $y(t) = 0$，再把根代入 $x(t)$；点写成 $(x, 0)$。两个根都要用：$x(-3) = 3(-3) - 2 = -11$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const k2 = k * k;
        const xExpr = linExpr(c, d, "t");
        const yExpr = `t^2 - ${k2}`;
        const x1 = c * k + d;
        const x2 = -c * k + d;
        const smaller = Math.min(x1, x2);
        const larger = Math.max(x1, x2);
        const wrong = [
          t(`$(0, ${smaller})$ and $(0, ${larger})$`, `$(0, ${smaller})$ 和 $(0, ${larger})$`),
          t(`$(${smaller + 1}, 0)$ and $(${larger + 1}, 0)$`, `$(${smaller + 1}, 0)$ 和 $(${larger + 1}, 0)$`),
          t(`$(${d}, 0)$`, `$(${d}, 0)$`),
          ...(d === 0 ? [] : [t(`$(${-smaller}, 0)$ and $(${-larger}, 0)$`, `$(${-smaller}, 0)$ 和 $(${-larger}, 0)$`)]),
        ];
        return oneOf(
          rng,
          t(
            `Find all $x$-intercepts of the parametric curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的所有 $x$ 轴截距交点坐标。`,
          ),
          t(`$(${smaller}, 0)$ and $(${larger}, 0)$`, `$(${smaller}, 0)$ 和 $(${larger}, 0)$`),
          wrong,
          walked(
            [
              [
                ["Set y(t) = 0", "令 y(t) = 0"],
                t(`On the $x$-axis the $y$-coordinate is $0$:`, `在 $x$ 轴上，$y$ 坐标为 $0$：`),
                [`t^{2} - ${k2} = 0 \\implies t^{2} = ${k2} \\implies t = \\pm ${k}`],
              ],
              [
                ["Find x at each root", "求每个根处的 x"],
                t(`Put both values into $x(t) = ${xExpr}$:`, `把两个值都代入 $x(t) = ${xExpr}$：`),
                [`x(${k}) = ${times(c, k)} ${sgnTerm(d)} = ${x1}, \\quad x(${-k}) = ${times(c, -k)} ${sgnTerm(d)} = ${x2}`],
              ],
            ],
            t(
              `$y(\\pm ${k}) = ${k2} - ${k2} = 0$, so both points are on the $x$-axis, and they are $|${x1} - ${paren(x2)}| = ${Math.abs(x1 - x2)}$ apart, which is $|${c}|$ times the gap $${2 * k}$ between the two values of $t$. The $x$-intercepts are $(${smaller}, 0)$ and $(${larger}, 0)$.`,
              `$y(\\pm ${k}) = ${k2} - ${k2} = 0$，所以两个点都在 $x$ 轴上；它们相距 $|${x1} - ${paren(x2)}| = ${Math.abs(x1 - x2)}$，正是两个 $t$ 值之差 $${2 * k}$ 的 $|${c}|$ 倍。$x$ 轴截距交点为 $(${smaller}, 0)$ 和 $(${larger}, 0)$。`,
            ),
          ),
          [
            why(
              wrong[0]!,
              "The coordinates are in the wrong order: a point on the $x$-axis has $y = 0$ second.",
              "坐标顺序反了：$x$ 轴上的点第二个坐标 $y = 0$。",
            ),
            why(
              wrong[1]!,
              `Both values are $1$ too large: $x(${k}) = ${x1}$ and $x(${-k}) = ${x2}$.`,
              `两个值都大了 $1$：$x(${k}) = ${x1}$，$x(${-k}) = ${x2}$。`,
            ),
            why(
              wrong[2]!,
              `This is the point at $t = 0$, but there $y = ${-k2}$, so it is not on the $x$-axis.`,
              `这是 $t = 0$ 对应的点，但那里 $y = ${-k2}$，不在 $x$ 轴上。`,
            ),
            ...(wrong[3]
              ? [
                  why(
                    wrong[3],
                    `The signs of $x$ are flipped: $x(${k}) = ${x1}$, not $${-x1}$.`,
                    `$x$ 的符号反了：$x(${k}) = ${x1}$，不是 $${-x1}$。`,
                  ),
                ]
              : []),
          ],
        );
      },
    },
  ],
};

// ─── 8.28.4 Finding Intersections of Parametric Curves and Lines ────────────

/** findingIntersectionsOfParametricCurvesAndLines covers intersections between parametric curves and lines. */
export const findingIntersectionsOfParametricCurvesAndLines: TopicDef = {
  id: "finding-intersections-of-parametric-curves-and-lines",
  title: t("Finding Intersections of Parametric Curves and Lines", "参数曲线与直线的交点"),
  summary: t(
    "Find intersection points of a parametric curve with a Cartesian line Ax + By + C = 0 by substituting the parametric equations into the line equation and solving for t.",
    "将参数方程代入直线的一般式方程 Ax + By + C = 0 中求解参数 t，从而求得参数曲线与直线的交点坐标。",
  ),
  prerequisites: ["finding-intercepts-of-curves-defined-parametrically"],
  encompasses: [{ topic: "finding-intercepts-of-curves-defined-parametrically", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.B.7", "CCSS.HSA.REI.C.7"],
  intro: t(
    `A point of a parametric curve lies on a line when its coordinates satisfy the line's equation. Putting $x(t)$ and $y(t)$ into that equation leaves one equation in $t$, and each root is a point where they meet. Take the curve $x = t$, $y = t^{2}$ and the line $y = x + 2$:

$$t^{2} = t + 2 \\implies t^{2} - t - 2 = 0 \\implies (t - 2)(t + 1) = 0$$

so $t = 2$ and $t = -1$, the points $(2, 4)$ and $(-1, 1)$.

Check: $4 = 2 + 2$ and $1 = -1 + 2$, so both points are on the line.

In this lesson we find where a parametric curve meets a line, decide where two moving particles collide, and find the line that touches a parametric parabola at one point.`,
    `参数曲线上的一点在直线上，当且仅当它的坐标满足直线方程。把 $x(t)$ 和 $y(t)$ 代入这个方程，就得到一个关于 $t$ 的方程，每个根对应一个交点。取曲线 $x = t$，$y = t^{2}$ 和直线 $y = x + 2$：

$$t^{2} = t + 2 \\implies t^{2} - t - 2 = 0 \\implies (t - 2)(t + 1) = 0$$

所以 $t = 2$ 和 $t = -1$，交点是 $(2, 4)$ 和 $(-1, 1)$。

检验：$4 = 2 + 2$，$1 = -1 + 2$，所以两个点都在直线上。

这节课我们求参数曲线与直线的交点，判断两个运动粒子在哪里相撞，并求与参数抛物线只有一个公共点的直线。`,
  ),
  knowledgePoints: [
    {
      id: "intersection-parametric-curve-and-line",
      title: t("Intersection of a parametric curve and a line", "参数曲线与直线的交点"),
      explanation: t(
        "To find the intersection points between a parametric curve $x = x(t), y = y(t)$ and a Cartesian line $Ax + By = C$:\n1. Substitute $x(t)$ and $y(t)$ into the line's equation to obtain a single equation in $t$.\n2. Solve for $t$.\n3. Substitute each solution $t$ back into $(x(t), y(t))$ to determine the coordinates of the intersection point(s).\n\nFor $x = 2t$, $y = t^{2} - 3$ and the line $y = x$: $t^{2} - 3 = 2t$, so $t^{2} - 2t - 3 = (t - 3)(t + 1) = 0$, and $t = 3$ or $t = -1$. The points are $(6, 6)$ and $(-2, -2)$. Check: both have $y = x$.\n\n> **Watch out.** The roots are values of $t$, not coordinates: put each one into both $x(t)$ and $y(t)$, and write the point as $(x, y)$, not $(y, x)$.",
        "求参数曲线 $x = x(t), y = y(t)$ 与直角坐标直线 $Ax + By = C$ 的交点步骤：\n1. 将 $x(t)$ 与 $y(t)$ 代入直线的方程中，得到关于参数 $t$ 的一元方程。\n2. 解该方程求出参数 $t$ 的值。\n3. 将每个解 $t$ 代回参数方程 $(x(t), y(t))$ 中，求出对应的交点坐标。\n\n对 $x = 2t$，$y = t^{2} - 3$ 和直线 $y = x$：$t^{2} - 3 = 2t$，所以 $t^{2} - 2t - 3 = (t - 3)(t + 1) = 0$，$t = 3$ 或 $t = -1$。交点是 $(6, 6)$ 和 $(-2, -2)$。检验：两点都满足 $y = x$。\n\n> **注意。** 根是 $t$ 的值，不是坐标：要把每个根分别代入 $x(t)$ 和 $y(t)$，并把点写成 $(x, y)$，不是 $(y, x)$。",
      ),
      generate(rng) {
        const t1 = rng.int(-3, 1);
        let t2 = rng.int(2, 5);
        while (t2 === t1) t2 = rng.int(2, 5);
        const k = rng.int(-4, 4);
        const sum = t1 + t2;
        const prod = t1 * t2;
        const cVal = k - prod;
        const lineStr = `${poly([1, "y"], [-sum, "x"])} = ${cVal}`;
        const p1x = t1;
        const p1y = t1 * t1 + k;
        const p2x = t2;
        const p2y = t2 * t2 + k;
        const swapped = t(`$(${p1y}, ${p1x})$ and $(${p2y}, ${p2x})$`, `$(${p1y}, ${p1x})$ 和 $(${p2y}, ${p2x})$`);
        const higher = t(`$(${p1x}, ${p1y + 2})$ and $(${p2x}, ${p2y + 2})$`, `$(${p1x}, ${p1y + 2})$ 和 $(${p2x}, ${p2y + 2})$`);
        const flippedX = t(`$(${-p1x}, ${p1y})$ and $(${-p2x}, ${p2y})$`, `$(${-p1x}, ${p1y})$ 和 $(${-p2x}, ${p2y})$`);
        const flippedY = t(`$(${p1x}, ${-p1y})$ and $(${p2x}, ${-p2y})$`, `$(${p1x}, ${-p1y})$ 和 $(${p2x}, ${-p2y})$`);
        // With t1 = -t2 the flipped x-coordinates give the same two points in the other order, so that option is left out.
        const wrong = [swapped, higher, ...(t1 === -t2 ? [] : [flippedX]), flippedY];
        return oneOf(
          rng,
          t(
            `Find the intersection points of the parametric curve $x(t) = t$, $y(t) = t^2 ${sgnTerm(k)}$ and the line $${lineStr}$.`,
            `求参数曲线 $x(t) = t$，$y(t) = t^2 ${sgnTerm(k)}$ 与直线 $${lineStr}$ 的交点坐标。`,
          ),
          t(`$(${p1x}, ${p1y})$ and $(${p2x}, ${p2y})$`, `$(${p1x}, ${p1y})$ 和 $(${p2x}, ${p2y})$`),
          wrong,
          walked(
            [
              [
                ["Substitute", "代入"],
                t(
                  `Put $x = t$ and $y = t^{2} ${sgnTerm(k)}$ into $${lineStr}$ and collect the terms on one side:`,
                  `把 $x = t$ 和 $y = t^{2} ${sgnTerm(k)}$ 代入 $${lineStr}$，并把各项移到一边：`,
                ),
                [
                  `(${poly([1, "t^{2}"], [k, ""])})${sum === 0 ? "" : ` ${sum > 0 ? "-" : "+"} ${poly([Math.abs(sum), "t"])}`} = ${cVal}`,
                  `${poly([1, "t^{2}"], [-sum, "t"], [prod, ""])} = 0`,
                ],
              ],
              [
                ["Factor", "因式分解"],
                t(
                  `Two numbers with product $${prod}$ and sum $${sum}$ are $${t1}$ and $${t2}$:`,
                  `积为 $${prod}$、和为 $${sum}$ 的两个数是 $${t1}$ 和 $${t2}$：`,
                ),
                [`${lin("t", t1)}${lin("t", t2)} = 0 \\implies t = ${t1} \\text{ or } t = ${t2}`],
              ],
              [
                ["Find the points", "求出交点"],
                t(
                  `Put each value of $t$ into $x = t$ and $y = t^{2} ${sgnTerm(k)}$:`,
                  `把每个 $t$ 值代入 $x = t$ 和 $y = t^{2} ${sgnTerm(k)}$：`,
                ),
                [`t = ${t1}: \\ (${p1x}, ${p1y}), \\quad t = ${t2}: \\ (${p2x}, ${p2y})`],
              ],
            ],
            t(
              `Both points satisfy $${lineStr}$: $${p1y} ${sgnTerm(-sum * p1x)} = ${cVal}$ and $${p2y} ${sgnTerm(-sum * p2x)} = ${cVal}$.`,
              `两个点都满足 $${lineStr}$：$${p1y} ${sgnTerm(-sum * p1x)} = ${cVal}$，$${p2y} ${sgnTerm(-sum * p2x)} = ${cVal}$。`,
            ),
          ),
          [
            why(
              swapped,
              "This swaps the coordinates: $x = t$, so the first coordinate is the value of $t$.",
              "坐标对调了：$x = t$，所以第一个坐标就是 $t$ 的值。",
            ),
            why(
              higher,
              `The second coordinates are $2$ too large: $y = t^{2} ${sgnTerm(k)}$ gives $${p1y}$ and $${p2y}$.`,
              `第二个坐标大了 $2$：$y = t^{2} ${sgnTerm(k)}$ 给出 $${p1y}$ 和 $${p2y}$。`,
            ),
            why(
              flippedX,
              `The signs of $x$ are flipped: $x = t$, so the first coordinates are the roots $${t1}$ and $${t2}$.`,
              `$x$ 的符号反了：$x = t$，所以第一个坐标就是根 $${t1}$ 和 $${t2}$。`,
            ),
            why(
              flippedY,
              `The signs of $y$ are flipped: at the roots $y = t^{2} ${sgnTerm(k)}$ is $${p1y}$ and $${p2y}$.`,
              `$y$ 的符号反了：在两个根处 $y = t^{2} ${sgnTerm(k)}$ 等于 $${p1y}$ 和 $${p2y}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "collision-point-of-two-particles",
      title: t("Collision point of two parametric paths", "两条参数曲线的碰撞点与碰撞时间"),
      explanation: t(
        "Two particles moving along paths $(x_1(t), y_1(t))$ and $(x_2(t), y_2(t))$ **collide** if they are at the exact same location at the **same time** $t$:\n$$x_1(t) = x_2(t) \\quad \\text{and} \\quad y_1(t) = y_2(t)$$\nIf such a time $t$ exists, the point $(x_1(t), y_1(t))$ is the collision point. (In contrast, a geometric path crossing without sharing the same time $t$ is an intersection, not a collision).\n\nFor $P_1(t) = (t + 1, 2t)$ and $P_2(t) = (3t - 3, t + 2)$: the $x$-coordinates agree when $t + 1 = 3t - 3$, that is at $t = 2$. Then $y_1(2) = 4$ and $y_2(2) = 4$ agree too, so the particles collide at $(3, 4)$. Check: $P_1(2) = (3, 4)$ and $P_2(2) = (3, 4)$.\n\n> **Watch out.** Solve for one time from the $x$-coordinates and test the $y$-coordinates at that same time. Paths that cross at different times meet nowhere.",
        "两颗分别沿轨迹 $(x_1(t), y_1(t))$ 和 $(x_2(t), y_2(t))$ 运动的粒子，若在**同一时刻** $t$ 处于**相同位置**，则发生**碰撞**：\n$$x_1(t) = x_2(t) \\quad \\text{且} \\quad y_1(t) = y_2(t)$$\n若存在这样的时刻 $t$，则对应点即为碰撞点。（与之相比，若两条轨迹仅在空间上交叉但不同时到达同一位置，则为几何相交而非碰撞）。\n\n对 $P_1(t) = (t + 1, 2t)$ 和 $P_2(t) = (3t - 3, t + 2)$：$x$ 坐标在 $t + 1 = 3t - 3$ 即 $t = 2$ 时相等。此时 $y_1(2) = 4$，$y_2(2) = 4$ 也相等，所以两粒子在 $(3, 4)$ 相撞。检验：$P_1(2) = (3, 4)$，$P_2(2) = (3, 4)$。\n\n> **注意。** 由 $x$ 坐标解出一个时刻，再在同一时刻检验 $y$ 坐标。两条轨迹若在不同时刻经过交叉点，粒子并不会相遇。",
      ),
      generate(rng) {
        const tStar = rng.int(1, 5);
        const xStar = rng.int(-5, 5);
        const yStar = rng.int(-5, 5);
        const a1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        let a2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        while (a2 === a1) a2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        let c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        while (c2 === c1) c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b1 = xStar - a1 * tStar;
        const b2 = xStar - a2 * tStar;
        const d1 = yStar - c1 * tStar;
        const d2 = yStar - c2 * tStar;
        const p1xExpr = linExpr(a1, b1, "t");
        const p1yExpr = linExpr(c1, d1, "t");
        const p2xExpr = linExpr(a2, b2, "t");
        const p2yExpr = linExpr(c2, d2, "t");
        return pointProblem({
          prompt: t(
            `Two particles follow paths $P_1(t) = (${p1xExpr}, ${p1yExpr})$ and $P_2(t) = (${p2xExpr}, ${p2yExpr})$ for $t \\ge 0$. Find the coordinates $(x, y)$ of their collision point.`,
            `两颗粒子分别沿轨迹 $P_1(t) = (${p1xExpr}, ${p1yExpr})$ 与 $P_2(t) = (${p2xExpr}, ${p2yExpr})$（$t \\ge 0$）运动。求它们碰撞点的坐标 $(x, y)$。`,
          ),
          answer: [xStar, yStar],
          wrong: [
            [xStar + 1, yStar],
            [yStar, xStar],
            [xStar, -yStar],
            [xStar, yStar + 2],
          ],
          solution: walked(
            [
              [
                ["Equate the x-coordinates", "令 x 坐标相等"],
                t(`At a collision both particles have the same $x$ at the same time $t$:`, `相撞时，两粒子在同一时刻 $t$ 有相同的 $x$：`),
                [`${p1xExpr} = ${p2xExpr} \\implies ${a1 - a2 === 1 ? "" : `${poly([a1 - a2, "t"])} = ${b2 - b1} \\implies `}t = ${tStar}`],
              ],
              [
                ["Test the y-coordinates", "检验 y 坐标"],
                t(`At $t = ${tStar}$ both $y$-coordinates must agree:`, `在 $t = ${tStar}$ 时两个 $y$ 坐标必须相等：`),
                [
                  `y_1(${tStar}) = ${times(c1, tStar)} ${sgnTerm(d1)} = ${yStar}, \\quad y_2(${tStar}) = ${times(c2, tStar)} ${sgnTerm(d2)} = ${yStar}`,
                ],
              ],
            ],
            t(
              `Both particles are at the same place at $t = ${tStar}$: $P_1(${tStar}) = (${xStar}, ${yStar})$ and $x_2(${tStar}) = ${times(a2, tStar)} ${sgnTerm(b2)} = ${xStar}$. The collision point is $(${xStar}, ${yStar})$.`,
              `两粒子在 $t = ${tStar}$ 时位于同一处：$P_1(${tStar}) = (${xStar}, ${yStar})$，$x_2(${tStar}) = ${times(a2, tStar)} ${sgnTerm(b2)} = ${xStar}$。碰撞点为 $(${xStar}, ${yStar})$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.5 Parametric Equations of Circles ─────────────────────────────────

/** parametricEquationsOfCircles covers circles in parametric and standard forms. */
export const parametricEquationsOfCircles: TopicDef = {
  id: "parametric-equations-of-circles",
  title: t("Parametric Equations of Circles", "圆的参数方程"),
  summary: t(
    "Represent circles centered at (h, k) with radius r using parametric equations x = h + r cos θ, y = k + r sin θ, and convert between parametric and standard Cartesian forms.",
    "使用参数方程 x = h + r cos θ, y = k + r sin θ 表示圆心为 (h, k)、半径为 r 的圆，并在参数方程与标准直角坐标方程之间互相转换。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "equations-of-circles", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `On the unit circle, the point at angle $\\theta$ is $(\\cos\\theta, \\sin\\theta)$. A circle of radius $r$ about $(h, k)$ is the unit circle stretched by $r$ and moved by $(h, k)$, so its point at angle $\\theta$ is $(h + r\\cos\\theta, k + r\\sin\\theta)$. For the circle $(x - 1)^{2} + (y + 2)^{2} = 9$, with center $(1, -2)$ and radius $3$, the angle $\\theta = \\frac{\\pi}{2}$ gives

$$x = 1 + 3\\cos\\frac{\\pi}{2} = 1, \\quad y = -2 + 3\\sin\\frac{\\pi}{2} = 1$$

the top of the circle, $(1, 1)$.

Check: $(1 - 1)^{2} + (1 + 2)^{2} = 0 + 9 = 9$.

In this lesson we write parametric equations for a circle, find the circle's equation from parametric ones, and find how far a point travels when it goes around more than once.`,
    `单位圆上角 $\\theta$ 对应的点是 $(\\cos\\theta, \\sin\\theta)$。以 $(h, k)$ 为圆心、半径为 $r$ 的圆，是把单位圆放大 $r$ 倍再平移 $(h, k)$ 得到的，所以它在角 $\\theta$ 处的点是 $(h + r\\cos\\theta, k + r\\sin\\theta)$。对圆 $(x - 1)^{2} + (y + 2)^{2} = 9$，圆心 $(1, -2)$，半径 $3$，角 $\\theta = \\frac{\\pi}{2}$ 给出

$$x = 1 + 3\\cos\\frac{\\pi}{2} = 1, \\quad y = -2 + 3\\sin\\frac{\\pi}{2} = 1$$

即圆的最高点 $(1, 1)$。

检验：$(1 - 1)^{2} + (1 + 2)^{2} = 0 + 9 = 9$。

这节课我们写出圆的参数方程，由参数方程求圆的方程，并求点绕圆不止一圈时走过的路程。`,
  ),
  knowledgePoints: [
    {
      id: "circle-cartesian-to-parametric",
      title: t("Standard circle to parametric form", "圆的标准方程化为参数方程"),
      explanation: t(
        "A circle centered at $(h, k)$ with radius $r > 0$ has standard equation:\n$$(x - h)^2 + (y - k)^2 = r^2$$\nIts parametric representation is:\n$$x = h + r\\cos\\theta, \\quad y = k + r\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\nwhere $\\theta$ represents the angle from the positive horizontal ray extending from the center.\n\nFor $(x + 2)^{2} + (y - 1)^{2} = 16$: the center is $(-2, 1)$ and $r = \\sqrt{16} = 4$, so $x = -2 + 4\\cos\\theta$, $y = 1 + 4\\sin\\theta$. Check: $\\theta = 0$ gives $(2, 1)$, and $(2 + 2)^{2} + (1 - 1)^{2} = 16$.\n\n> **Watch out.** The coefficient is the radius $\\sqrt{16} = 4$, not $16$. Read the center with the signs reversed, $(x + 2)$ means $h = -2$, and keep $h$ and the cosine with $x$, $k$ and the sine with $y$.",
        "圆心为 $(h, k)$、半径为 $r > 0$ 的圆的标准方程为：\n$$(x - h)^2 + (y - k)^2 = r^2$$\n其参数方程表示为：\n$$x = h + r\\cos\\theta, \\quad y = k + r\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\n其中参数 $\\theta$ 表示从圆心引出的水平正向射线逆时针旋转的角。\n\n对 $(x + 2)^{2} + (y - 1)^{2} = 16$：圆心是 $(-2, 1)$，$r = \\sqrt{16} = 4$，所以 $x = -2 + 4\\cos\\theta$，$y = 1 + 4\\sin\\theta$。检验：$\\theta = 0$ 给出 $(2, 1)$，而 $(2 + 2)^{2} + (1 - 1)^{2} = 16$。\n\n> **注意。** 系数是半径 $\\sqrt{16} = 4$，不是 $16$。读圆心时符号要反过来，$(x + 2)$ 表示 $h = -2$；$h$ 和余弦跟 $x$ 在一起，$k$ 和正弦跟 $y$ 在一起。",
      ),
      figure: parametricCircleFigure,
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.int(2, 10);
        const r2 = r * r;
        const cartesianEq = `${sq("x", h)} + ${sq("y", k)} = ${r2}`;
        const rightParam = `x = ${trigTerm(h, r, "\\cos\\theta")}, \\; y = ${trigTerm(k, r, "\\sin\\theta")}`;
        const wrong1 = `x = ${trigTerm(k, r, "\\cos\\theta")}, \\; y = ${trigTerm(h, r, "\\sin\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, r2, "\\cos\\theta")}, \\; y = ${trigTerm(k, r2, "\\sin\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, r, "\\cos\\theta")}, \\; y = ${trigTerm(-k, r, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, r, "\\cos\\theta")}, \\; y = ${trigTerm(k, r, "\\cos\\theta")}`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the circle with equation $${cartesianEq}$ ($0 \\le \\theta < 2\\pi$).`,
            `求圆的标准方程 $${cartesianEq}$ 对应的参数方程（$0 \\le \\theta < 2\\pi$）。`,
          ),
          same(`$${rightParam}$`),
          [same(`$${wrong1}$`), same(`$${wrong2}$`), same(`$${wrong3}$`), same(`$${wrong4}$`)],
          walked(
            [
              [
                ["Read the center and radius", "读出圆心和半径"],
                t(
                  `Compare with $(x - h)^{2} + (y - k)^{2} = r^{2}$: the center is $(h, k) = (${h}, ${k})$, and $r = \\sqrt{${r2}} = ${r}$.`,
                  `与 $(x - h)^{2} + (y - k)^{2} = r^{2}$ 比较：圆心 $(h, k) = (${h}, ${k})$，$r = \\sqrt{${r2}} = ${r}$。`,
                ),
              ],
              [
                ["Stretch and move the unit circle", "放大并平移单位圆"],
                t(
                  `Multiply $\\cos\\theta$ and $\\sin\\theta$ by $r$ and add the center:`,
                  `把 $\\cos\\theta$ 和 $\\sin\\theta$ 乘以 $r$，再加上圆心坐标：`,
                ),
                [
                  `x = h + r\\cos\\theta = ${trigTerm(h, r, "\\cos\\theta")}, \\quad y = k + r\\sin\\theta = ${trigTerm(k, r, "\\sin\\theta")}`,
                ],
              ],
            ],
            t(
              `At $\\theta = 0$ the equations give $(${h + r}, ${k})$, which is $${r}$ to the right of the center, and $${r}^{2} + 0^{2} = ${r2}$, so the point is on the circle.`,
              `$\\theta = 0$ 时方程给出 $(${h + r}, ${k})$，在圆心右边 $${r}$ 处，而 $${r}^{2} + 0^{2} = ${r2}$，所以这个点在圆上。`,
            ),
          ),
          [
            why(
              same(`$${wrong1}$`),
              `The center's coordinates are swapped: $h = ${h}$ goes with $x$ and $k = ${k}$ with $y$.`,
              `圆心坐标对调了：$h = ${h}$ 跟 $x$，$k = ${k}$ 跟 $y$。`,
            ),
            why(
              same(`$${wrong2}$`),
              `This uses $r^{2} = ${r2}$ as the coefficient; the radius is $\\sqrt{${r2}} = ${r}$.`,
              `这把 $r^{2} = ${r2}$ 当成了系数；半径是 $\\sqrt{${r2}} = ${r}$。`,
            ),
            why(
              same(`$${wrong3}$`),
              `The signs of the center are flipped: $${sq("x", h)}$ means $h = ${h}$.`,
              `圆心的符号反了：$${sq("x", h)}$ 表示 $h = ${h}$。`,
            ),
            why(
              same(`$${wrong4}$`),
              "With the cosine in both equations, $x$ and $y$ move together along a line segment, not around a circle.",
              "两个方程都用余弦，$x$ 和 $y$ 一起沿一条线段移动，不是绕圆走。",
            ),
          ],
        );
      },
    },
    {
      id: "circle-parametric-to-cartesian",
      figure: precalculusDrawings3["parametric-equations-of-circles#circle-parametric-to-cartesian"],
      title: t("Identify center and radius from parametric circle", "由圆的参数方程求圆心与半径"),
      explanation: t(
        "From the parametric equations $x = h + r\\cos\\theta$ and $y = k + r\\sin\\theta$:\n- The center is $(h, k)$.\n- The radius is $r$.\n- The Cartesian equation is $(x - h)^2 + (y - k)^2 = r^2$.\n\nFor example, $x = 3 + 5\\cos\\theta, y = -1 + 5\\sin\\theta$ represents a circle with center $(3, -1)$ and radius $5$.\n\nCheck: in the example, $\\theta = \\pi$ gives $(3 - 5, -1) = (-2, -1)$, and $(-2 - 3)^{2} + (-1 + 1)^{2} = 25 = 5^{2}$.\n\n> **Watch out.** The right side is $r^{2} = 25$, not $r = 5$. And $x = 3 + 5\\cos\\theta$ gives $x - 3 = 5\\cos\\theta$, so the bracket is $(x - 3)$, not $(x + 3)$.",
        "由圆的参数方程 $x = h + r\\cos\\theta$ 与 $y = k + r\\sin\\theta$ 可直接读出：\n- 圆心为 $(h, k)$。\n- 半径为 $r$。\n- 直角坐标方程为 $(x - h)^2 + (y - k)^2 = r^2$。\n\n例如，$x = 3 + 5\\cos\\theta, y = -1 + 5\\sin\\theta$ 表示圆心为 $(3, -1)$、半径为 $5$ 的圆。\n\n检验：在例子中，$\\theta = \\pi$ 给出 $(3 - 5, -1) = (-2, -1)$，而 $(-2 - 3)^{2} + (-1 + 1)^{2} = 25 = 5^{2}$。\n\n> **注意。** 右边是 $r^{2} = 25$，不是 $r = 5$。由 $x = 3 + 5\\cos\\theta$ 得 $x - 3 = 5\\cos\\theta$，所以括号是 $(x - 3)$，不是 $(x + 3)$。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.int(2, 10);
        const xTerm = trigTerm(h, r, "\\cos\\theta");
        const yTerm = trigTerm(k, r, "\\sin\\theta");
        const r2 = r * r;
        const stdEq = `${sq("x", h)} + ${sq("y", k)} = ${r2}`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $\\theta$ to find the standard Cartesian equation of the circle defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `消去参数 $\\theta$，求由参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 所表示的圆的标准直角坐标方程。`,
          ),
          answer: stdEq,
          wrong: [
            `${sq("x", -h)} + ${sq("y", -k)} = ${r2}`,
            `${sq("x", k)} + ${sq("y", h)} = ${r2}`,
            `${sq("x", h)} + ${sq("y", k)} = ${r}`,
            `${sq("x", h)} - ${sq("y", k)} = ${r2}`,
          ],
          solution: walked(
            [
              [
                ["Isolate the trigonometric terms", "分离三角函数项"],
                t(`Move the constants to the left:`, `把常数移到左边：`),
                [`${linExpr(1, -h, "x")} = ${r}\\cos\\theta, \\quad ${linExpr(1, -k, "y")} = ${r}\\sin\\theta`],
              ],
              [
                ["Square and add", "平方后相加"],
                t(`Since $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$:`, `因为 $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$：`),
                [`${sq("x", h)} + ${sq("y", k)} = ${r2}(\\cos^{2}\\theta + \\sin^{2}\\theta) = ${r2}`],
              ],
            ],
            t(
              `At $\\theta = 0$ the curve is at $(${h + r}, ${k})$, which is $${r}$ from the center $(${h}, ${k})$, and $${r}^{2} + 0^{2} = ${r2}$.`,
              `$\\theta = 0$ 时曲线在 $(${h + r}, ${k})$，与圆心 $(${h}, ${k})$ 相距 $${r}$，而 $${r}^{2} + 0^{2} = ${r2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.6 Parametric Equations of Ellipses ────────────────────────────────

/** parametricEquationsOfEllipses covers ellipses in parametric form and eccentric angles. */
export const parametricEquationsOfEllipses: TopicDef = {
  id: "parametric-equations-of-ellipses",
  title: t("Parametric Equations of Ellipses", "椭圆的参数方程"),
  summary: t(
    "Write parametric equations for ellipses centered at (h, k) as x = h + a cos θ, y = k + b sin θ, relate parameters to semi-major and semi-minor axes, and distinguish parameter θ from the geometric angle.",
    "将中心在 (h, k) 的椭圆表示为参数方程 x = h + a cos θ, y = k + b sin θ，理解半长轴、半短轴与参数的关系，并区分参数 θ 与几何角。",
  ),
  prerequisites: ["parametric-equations-of-circles"],
  encompasses: [{ topic: "parametric-equations-of-circles", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `An ellipse is a circle stretched by different amounts across and up. Starting from the unit circle $(\\cos\\theta, \\sin\\theta)$ and stretching by $4$ across and $2$ up gives $x = 4\\cos\\theta$, $y = 2\\sin\\theta$. At $\\theta = 0$ the point is $(4, 0)$ and at $\\theta = \\frac{\\pi}{2}$ it is $(0, 2)$: the ends of the two semi-axes.

Check: $\\left(\\frac{x}{4}\\right)^{2} + \\left(\\frac{y}{2}\\right)^{2} = \\cos^{2}\\theta + \\sin^{2}\\theta = 1$, which is the ellipse $\\frac{x^{2}}{16} + \\frac{y^{2}}{4} = 1$, and $(0, 2)$ gives $0 + \\frac{4}{4} = 1$.

In this lesson we convert between the standard and parametric equations of an ellipse, find the lengths of its axes, and find the point for a given value of the parameter.`,
    `椭圆就是横向和纵向放大倍数不同的圆。从单位圆 $(\\cos\\theta, \\sin\\theta)$ 出发，横向放大 $4$ 倍、纵向放大 $2$ 倍，得到 $x = 4\\cos\\theta$，$y = 2\\sin\\theta$。$\\theta = 0$ 时点为 $(4, 0)$，$\\theta = \\frac{\\pi}{2}$ 时点为 $(0, 2)$：正是两条半轴的端点。

检验：$\\left(\\frac{x}{4}\\right)^{2} + \\left(\\frac{y}{2}\\right)^{2} = \\cos^{2}\\theta + \\sin^{2}\\theta = 1$，即椭圆 $\\frac{x^{2}}{16} + \\frac{y^{2}}{4} = 1$，而 $(0, 2)$ 代入得 $0 + \\frac{4}{4} = 1$。

这节课我们在椭圆的标准方程与参数方程之间互化，求它的轴长，并求给定参数对应的点。`,
  ),
  knowledgePoints: [
    {
      id: "ellipse-parametric-equations",
      title: t("Converting between standard and parametric equations of an ellipse", "椭圆标准方程与参数方程的互化"),
      explanation: t(
        "An ellipse with center $(h, k)$, horizontal semi-axis $a$, and vertical semi-axis $b$ has standard Cartesian equation:\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\nIts parametric equations are:\n$$x = h + a\\cos\\theta, \\quad y = k + b\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\nSquaring and adding yields $\\left(\\frac{x - h}{a}\\right)^2 + \\left(\\frac{y - k}{b}\\right)^2 = \\cos^2\\theta + \\sin^2\\theta = 1$.\n\nFor $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 3)^{2}}{4} = 1$: the center is $(1, -3)$, $a = 5$ and $b = 2$, so $x = 1 + 5\\cos\\theta$, $y = -3 + 2\\sin\\theta$. Check: $\\theta = 0$ gives $(6, -3)$, and $\\frac{25}{25} + 0 = 1$.\n\n> **Watch out.** The coefficients are the square roots of the denominators, $5$ and $2$, not $25$ and $4$. The root under $x$ goes with $\\cos\\theta$ in $x$. Cosine and sine trace an ellipse; secant and tangent would trace a hyperbola.",
        "中心在 $(h, k)$、水平半轴长为 $a$、垂直半轴长为 $b$ 的椭圆的标准方程为：\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\n其对应的参数方程为：\n$$x = h + a\\cos\\theta, \\quad y = k + b\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\n易验证 $\\left(\\frac{x - h}{a}\\right)^2 + \\left(\\frac{y - k}{b}\\right)^2 = \\cos^2\\theta + \\sin^2\\theta = 1$。\n\n对 $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 3)^{2}}{4} = 1$：中心是 $(1, -3)$，$a = 5$，$b = 2$，所以 $x = 1 + 5\\cos\\theta$，$y = -3 + 2\\sin\\theta$。检验：$\\theta = 0$ 给出 $(6, -3)$，而 $\\frac{25}{25} + 0 = 1$。\n\n> **注意。** 系数是分母的平方根 $5$ 和 $2$，不是 $25$ 和 $4$。$x$ 下面的平方根跟 $x$ 里的 $\\cos\\theta$ 在一起。余弦和正弦描出椭圆；正割和正切描出的是双曲线。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, a, "\\cos\\theta")}, \\; y = ${trigTerm(k, b, "\\sin\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, a2, "\\cos\\theta")}, \\; y = ${trigTerm(k, b2, "\\sin\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, b, "\\cos\\theta")}, \\; y = ${trigTerm(k, a, "\\sin\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, a, "\\cos\\theta")}, \\; y = ${trigTerm(-k, b, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations of the ellipse $${stdEq}$ ($0 \\le \\theta < 2\\pi$).`,
            `求椭圆 $${stdEq}$ 的参数方程（$0 \\le \\theta < 2\\pi$）。`,
          ),
          same(`$${rightParam}$`),
          [same(`$${wrong1}$`), same(`$${wrong2}$`), same(`$${wrong3}$`), same(`$${wrong4}$`)],
          walked(
            [
              [
                ["Read the center and semi-axes", "读出中心和半轴"],
                t(
                  `The center is $(h, k) = (${h}, ${k})$, the horizontal semi-axis is $a = \\sqrt{${a2}} = ${a}$, and the vertical semi-axis is $b = \\sqrt{${b2}} = ${b}$.`,
                  `中心为 $(h, k) = (${h}, ${k})$，水平半轴 $a = \\sqrt{${a2}} = ${a}$，竖直半轴 $b = \\sqrt{${b2}} = ${b}$。`,
                ),
              ],
              [
                ["Stretch and move the unit circle", "放大并平移单位圆"],
                t(
                  `Stretch $\\cos\\theta$ by $a$ and $\\sin\\theta$ by $b$, then add the center:`,
                  `把 $\\cos\\theta$ 放大 $a$ 倍、$\\sin\\theta$ 放大 $b$ 倍，再加上中心坐标：`,
                ),
                [
                  `x = h + a\\cos\\theta = ${trigTerm(h, a, "\\cos\\theta")}, \\quad y = k + b\\sin\\theta = ${trigTerm(k, b, "\\sin\\theta")}`,
                ],
              ],
            ],
            t(
              `At $\\theta = \\frac{\\pi}{2}$ the point is $(${h}, ${k + b})$, $${b}$ above the center, and the standard equation gives $0 + ${b2} / ${b2} = 1$.`,
              `$\\theta = \\frac{\\pi}{2}$ 时点为 $(${h}, ${k + b})$，在中心上方 $${b}$ 处，标准方程给出 $0 + ${b2} / ${b2} = 1$。`,
            ),
          ),
          [
            why(
              same(`$${wrong1}$`),
              `This uses the denominators $${a2}$ and $${b2}$; the semi-axes are their square roots, $${a}$ and $${b}$.`,
              `这用了分母 $${a2}$ 和 $${b2}$；半轴是它们的平方根 $${a}$ 和 $${b}$。`,
            ),
            why(
              same(`$${wrong2}$`),
              `The semi-axes are swapped: $a = ${a}$, from under $x$, goes with $\\cos\\theta$ in $x$.`,
              `两条半轴对调了：$x$ 下面的 $a = ${a}$ 跟 $x$ 里的 $\\cos\\theta$ 在一起。`,
            ),
            why(
              same(`$${wrong3}$`),
              `The signs of the center are flipped: $${sq("x", h)}$ means $h = ${h}$.`,
              `中心的符号反了：$${sq("x", h)}$ 表示 $h = ${h}$。`,
            ),
            why(
              same(`$${wrong4}$`),
              "Secant and tangent satisfy $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$, which gives a hyperbola; an ellipse needs cosine and sine.",
              "正割和正切满足 $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$，得到的是双曲线；椭圆要用余弦和正弦。",
            ),
          ],
        );
      },
    },
    {
      id: "ellipse-axes-and-eccentric-angle",
      figure: precalculusDrawings4["parametric-equations-of-ellipses#ellipse-axes-and-eccentric-angle"],
      title: t("Semi-axes lengths and eccentric angle", "椭圆的半轴长与离心角"),
      explanation: t(
        "For an ellipse $x = h + a\\cos\\theta, y = k + b\\sin\\theta$:\n- The center is $(h, k)$.\n- The semi-major axis length is $\\max(a, b)$, and the length of the major axis is $2\\max(a, b)$.\n- The semi-minor axis length is $\\min(a, b)$, and the length of the minor axis is $2\\min(a, b)$.\n- The parameter $\\theta$ is called the **eccentric angle**. It corresponds to the angle of a point on the circumscribed auxiliary circle, and is generally not the geometric angle from the origin to $(x, y)$.\n\nFor $x = 2 + 3\\cos\\theta$, $y = -1 + 5\\sin\\theta$: the semi-axes are $3$ and $5$, so the major axis is vertical with length $10$, and the minor axis is $6$. Check: $\\theta = \\frac{\\pi}{2}$ and $\\theta = \\frac{3\\pi}{2}$ give $(2, 4)$ and $(2, -6)$, which are $10$ apart.\n\n> **Watch out.** An axis is twice its semi-axis: $10$, not $5$. The major axis goes with the larger coefficient, whether it multiplies $\\cos\\theta$ or $\\sin\\theta$.",
        "对于椭圆参数方程 $x = h + a\\cos\\theta, y = k + b\\sin\\theta$：\n- 中心为 $(h, k)$。\n- 半长轴长为 $\\max(a, b)$，长轴全长为 $2\\max(a, b)$。\n- 半短轴长为 $\\min(a, b)$，短轴全长为 $2\\min(a, b)$。\n- 参数 $\\theta$ 称为该点的**离心角**。它是辅助圆上对应点的圆心角，通常不等于椭圆上该点与中心连线的极角（几何角度）。\n\n对 $x = 2 + 3\\cos\\theta$，$y = -1 + 5\\sin\\theta$：两条半轴是 $3$ 和 $5$，所以长轴竖直、长 $10$，短轴长 $6$。检验：$\\theta = \\frac{\\pi}{2}$ 和 $\\theta = \\frac{3\\pi}{2}$ 给出 $(2, 4)$ 和 $(2, -6)$，相距 $10$。\n\n> **注意。** 轴长是半轴的两倍：是 $10$，不是 $5$。长轴对应较大的系数，不论它乘的是 $\\cos\\theta$ 还是 $\\sin\\theta$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const xTerm = trigTerm(h, a, "\\cos\\theta");
        const yTerm = trigTerm(k, b, "\\sin\\theta");
        const majorLen = 2 * Math.max(a, b);
        const minorLen = 2 * Math.min(a, b);
        const askMajor = rng.bool();
        const alongX = askMajor === a > b;
        const semi = alongX ? a : b;
        return numberProblem({
          prompt: askMajor
            ? t(
                `For the ellipse $x = ${xTerm}$, $y = ${yTerm}$, find the length of the major axis.`,
                `对于椭圆 $x = ${xTerm}$，$y = ${yTerm}$，求其长轴的全长。`,
              )
            : t(
                `For the ellipse $x = ${xTerm}$, $y = ${yTerm}$, find the length of the minor axis.`,
                `对于椭圆 $x = ${xTerm}$，$y = ${yTerm}$，求其短轴的全长。`,
              ),
          answer: askMajor ? majorLen : minorLen,
          wrong: [askMajor ? minorLen : majorLen, Math.max(a, b), Math.min(a, b), 2 * (a + b)],
          solution: walked(
            [
              [
                ["Read the semi-axes", "读出半轴"],
                t(
                  `The coefficients of $\\cos\\theta$ and $\\sin\\theta$ are the semi-axes: $a = ${a}$ across and $b = ${b}$ up and down, about the center $(${h}, ${k})$.`,
                  `$\\cos\\theta$ 和 $\\sin\\theta$ 的系数就是半轴：横向 $a = ${a}$，纵向 $b = ${b}$，中心为 $(${h}, ${k})$。`,
                ),
              ],
              [
                [askMajor ? "Take the larger one" : "Take the smaller one", askMajor ? "取较大的" : "取较小的"],
                t(
                  `The ${askMajor ? "major" : "minor"} axis goes with the ${askMajor ? "larger" : "smaller"} semi-axis, $${semi}$, so it is ${alongX ? "horizontal" : "vertical"}.`,
                  `${askMajor ? "长" : "短"}轴对应${askMajor ? "较大" : "较小"}的半轴 $${semi}$，所以它是${alongX ? "水平" : "竖直"}的。`,
                ),
              ],
              [
                ["Double it", "乘以 2"],
                t(`An axis runs across the whole ellipse:`, `轴贯穿整个椭圆：`),
                [`2 \\cdot ${semi} = ${2 * semi}`],
              ],
            ],
            t(
              alongX
                ? `$\\theta = 0$ and $\\theta = \\pi$ give the ends $(${h + a}, ${k})$ and $(${h - a}, ${k})$, which are $${2 * a}$ apart.`
                : `$\\theta = \\frac{\\pi}{2}$ and $\\theta = \\frac{3\\pi}{2}$ give the ends $(${h}, ${k + b})$ and $(${h}, ${k - b})$, which are $${2 * b}$ apart.`,
              alongX
                ? `$\\theta = 0$ 和 $\\theta = \\pi$ 给出端点 $(${h + a}, ${k})$ 和 $(${h - a}, ${k})$，相距 $${2 * a}$。`
                : `$\\theta = \\frac{\\pi}{2}$ 和 $\\theta = \\frac{3\\pi}{2}$ 给出端点 $(${h}, ${k + b})$ 和 $(${h}, ${k - b})$，相距 $${2 * b}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.7 Parametric Equations of Parabolas ───────────────────────────────

/** parametricEquationsOfParabolas covers standard parabolas opening along axes. */
export const parametricEquationsOfParabolas: TopicDef = {
  id: "parametric-equations-of-parabolas",
  title: t("Parametric Equations of Parabolas", "标准抛物线的参数方程"),
  summary: t(
    "Formulate parametric equations for standard parabolas opening along coordinate axes (x = pt², y = 2pt for y² = 4px and x = 2pt, y = pt² for x² = 4py), and eliminate t to recover standard Cartesian forms.",
    "建立开口向坐标轴的标准抛物线的参数方程（y² = 4px 对应 x = pt², y = 2pt；x² = 4py 对应 x = 2pt, y = pt²），并通过消参恢复其标准直角坐标方程。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "cartesian-equations-of-parametric-curves", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `In $x^{2} = 4py$ one variable is squared and the other is not. Parametric equations can make that visible: let the variable that is not squared grow like $t^{2}$ and the squared one like $t$. For $x^{2} = 8y$, so $4p = 8$ and $p = 2$, take $x = 4t$ and $y = 2t^{2}$. Then

$$x^{2} = 16t^{2} = 8 \\cdot 2t^{2} = 8y$$

so every value of $t$ gives a point of the parabola; $t = 1$ gives $(4, 2)$.

Check: $4^{2} = 16 = 8 \\cdot 2$.

In this lesson we write parametric equations for parabolas with vertex at the origin, eliminate the parameter to get the standard equation back, and find the focus.`,
    `在 $x^{2} = 4py$ 中，一个变量被平方，另一个没有。参数方程可以把这一点表现出来：让未平方的那个变量像 $t^{2}$ 那样变化，被平方的那个像 $t$ 那样变化。对 $x^{2} = 8y$，$4p = 8$，$p = 2$，取 $x = 4t$，$y = 2t^{2}$。于是

$$x^{2} = 16t^{2} = 8 \\cdot 2t^{2} = 8y$$

所以每个 $t$ 值都给出抛物线上的一点；$t = 1$ 给出 $(4, 2)$。

检验：$4^{2} = 16 = 8 \\cdot 2$。

这节课我们写出顶点在原点的抛物线的参数方程，消去参数还原标准方程，并求焦点。`,
  ),
  knowledgePoints: [
    {
      id: "standard-horizontal-parabola-parametric",
      figure: precalculusDrawings3["parametric-equations-of-parabolas#standard-horizontal-parabola-parametric"],
      title: t("Parametric equations of horizontal parabolas $y^2 = 4px$", "水平抛物线 $y^2 = 4px$ 的参数方程"),
      explanation: t(
        "A standard horizontal parabola with vertex at $(0, 0)$ has Cartesian equation $y^2 = 4px$ with focus $(p, 0)$.\nSetting $y = 2pt$ into the equation:\n$$(2pt)^2 = 4px \\implies 4p^2 t^2 = 4px \\implies x = pt^2$$\nThus, the standard parametric equations are:\n$$x = pt^2, \\quad y = 2pt \\quad (t \\in \\mathbb{R})$$\nEliminating $t = \\frac{y}{2p}$ yields $x = p\\left(\\frac{y}{2p}\\right)^2 = \\frac{y^2}{4p} \\implies y^2 = 4px$.\n\nFor $y^{2} = 12x$: $4p = 12$, so $p = 3$, and $x = 3t^{2}$, $y = 6t$, with focus $(3, 0)$. Check: $t = 1$ gives $(3, 6)$, and $6^{2} = 36 = 12 \\cdot 3$.\n\n> **Watch out.** The coefficient of $t^{2}$ is $p$, a quarter of $4p$: $x = 3t^{2}$, not $12t^{2}$, and $y = 2pt = 6t$, not $3t$. In $y^{2} = 4px$ the squared variable $y$ is the one that is linear in $t$.",
        "顶点在原点 $(0, 0)$、焦点在 $(p, 0)$ 的标准水平抛物线方程为 $y^2 = 4px$。\n令 $y = 2pt$，代入方程得：\n$$(2pt)^2 = 4px \\implies 4p^2 t^2 = 4px \\implies x = pt^2$$\n因此标准参数方程为：\n$$x = pt^2, \\quad y = 2pt \\quad (t \\in \\mathbb{R})$$\n反向消去参数 $t = \\frac{y}{2p}$ 即可恢复直角坐标方程 $y^2 = 4px$。\n\n对 $y^{2} = 12x$：$4p = 12$，所以 $p = 3$，$x = 3t^{2}$，$y = 6t$，焦点为 $(3, 0)$。检验：$t = 1$ 给出 $(3, 6)$，而 $6^{2} = 36 = 12 \\cdot 3$。\n\n> **注意。** $t^{2}$ 的系数是 $p$，即 $4p$ 的四分之一：$x = 3t^{2}$，不是 $12t^{2}$；$y = 2pt = 6t$，不是 $3t$。在 $y^{2} = 4px$ 中，被平方的 $y$ 才是关于 $t$ 为一次的那个变量。",
      ),
      generate(rng) {
        const p = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const fourP = 4 * p;
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const mode = rng.pick(["toParametric", "toCartesian", "focusDirectrix"]);

        if (mode === "toCartesian") {
          const rightEq = `y^2 = ${fourP}x`;
          const wrong1 = `x^2 = ${fourP}y`;
          const wrong2 = `y^2 = ${2 * p}x`;
          const wrong3 = `y^2 = ${-fourP}x`;
          return equationProblem({
            prompt: t(
              `Eliminate the parameter $t$ from $x = ${pCoeff}t^2, y = ${poly([2 * p, "t"])}$ ($t \\in \\mathbb{R}$) to find the Cartesian equation of the parabola.`,
              `消去参数 $t$（$t \\in \\mathbb{R}$），求抛物线 $x = ${pCoeff}t^2, y = ${poly([2 * p, "t"])}$ 的直角坐标方程。`,
            ),
            answer: rightEq,
            wrong: [wrong1, wrong2, wrong3],
            solution: walked(
              [
                [
                  ["Solve for t", "解出 t"],
                  t(`The equation for $y$ is linear in $t$:`, `$y$ 的方程关于 $t$ 是一次的：`),
                  [`t = \\frac{y}{${2 * p}}`],
                ],
                [
                  ["Substitute", "代入"],
                  t(`Put it into $x = ${pCoeff}t^{2}$ and clear the fraction:`, `代入 $x = ${pCoeff}t^{2}$ 并去分母：`),
                  [`x = ${pCoeff}\\left(\\frac{y}{${2 * p}}\\right)^{2} = \\frac{y^{2}}{${fourP}}`, rightEq],
                ],
              ],
              t(
                `At $t = 1$ the curve is at $(${p}, ${2 * p})$, and $${paren(2 * p)}^{2} = ${4 * p * p} = ${fourP} \\cdot ${paren(p)}$.`,
                `$t = 1$ 时曲线在 $(${p}, ${2 * p})$，而 $${paren(2 * p)}^{2} = ${4 * p * p} = ${fourP} \\cdot ${paren(p)}$。`,
              ),
            ),
          });
        }

        if (mode === "focusDirectrix") {
          return pointProblem({
            prompt: t(
              `For the parabola given parametrically by $x = ${pCoeff}t^2, y = ${poly([2 * p, "t"])}$, find the coordinates of its focus.`,
              `求参数方程为 $x = ${pCoeff}t^2, y = ${poly([2 * p, "t"])}$ 的抛物线的焦点坐标。`,
            ),
            answer: [p, 0],
            wrong: [
              [0, p],
              [2 * p, 0],
              [-p, 0],
            ],
            solution: walked(
              [
                [
                  ["Match the standard form", "对照标准形式"],
                  t(
                    `In $x = pt^{2}$, $y = 2pt$ the coefficient of $t^{2}$ is $p$, and the coefficient of $t$ is twice it: here $p = ${p}$ and $2p = ${2 * p}$.`,
                    `在 $x = pt^{2}$，$y = 2pt$ 中，$t^{2}$ 的系数是 $p$，$t$ 的系数是它的两倍：这里 $p = ${p}$，$2p = ${2 * p}$。`,
                  ),
                ],
                [
                  ["Place the focus", "确定焦点"],
                  t(
                    `This is $y^{2} = ${fourP}x$, which opens along the $x$-axis with focus $(p, 0) = (${p}, 0)$ and directrix $x = ${-p}$.`,
                    `这是 $y^{2} = ${fourP}x$，沿 $x$ 轴张开，焦点 $(p, 0) = (${p}, 0)$，准线 $x = ${-p}$。`,
                  ),
                ],
              ],
              t(
                `The point at $t = 1$ is $(${p}, ${2 * p})$. It is $${Math.abs(2 * p)}$ from the focus $(${p}, 0)$, straight ${p > 0 ? "up" : "down"}, and $|${p} - ${paren(-p)}| = ${Math.abs(2 * p)}$ from the directrix, as a point of a parabola must be.`,
                `$t = 1$ 对应的点是 $(${p}, ${2 * p})$。它到焦点 $(${p}, 0)$ 的距离是 $${Math.abs(2 * p)}$（在正${p > 0 ? "上" : "下"}方），到准线的距离是 $|${p} - ${paren(-p)}| = ${Math.abs(2 * p)}$，正如抛物线上的点应满足的那样。`,
              ),
            ),
          });
        }

        const rightParam = `x = ${pCoeff}t^2, \\; y = ${poly([2 * p, "t"])}`;
        const wrong1 = `x = ${poly([2 * p, "t"])}, \\; y = ${pCoeff}t^2`;
        const wrong2 = `x = ${poly([fourP, "t^2"])}, \\; y = ${poly([2 * p, "t"])}`;
        const wrong3 = `x = ${pCoeff}t^2, \\; y = ${poly([p, "t"])}`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the standard parabola $y^2 = ${fourP}x$ ($t \\in \\mathbb{R}$).`,
            `求标准抛物线 $y^2 = ${fourP}x$ 的参数方程（$t \\in \\mathbb{R}$）。`,
          ),
          same(`$${rightParam}$`),
          [same(`$${wrong1}$`), same(`$${wrong2}$`), same(`$${wrong3}$`)],
          walked(
            [
              [["Find p", "求 p"], t(`Compare with $y^{2} = 4px$:`, `与 $y^{2} = 4px$ 比较：`), [`4p = ${fourP} \\implies p = ${p}`]],
              [
                ["Write the equations", "写出参数方程"],
                t(`The squared variable $y$ is linear in $t$:`, `被平方的 $y$ 关于 $t$ 是一次的：`),
                [`x = pt^{2} = ${pCoeff}t^{2}, \\quad y = 2pt = ${poly([2 * p, "t"])}`],
              ],
            ],
            t(
              `Substituting, $(${poly([2 * p, "t"])})^{2} = ${4 * p * p}t^{2} = ${fourP} \\cdot ${p < 0 ? `(${pCoeff}t^{2})` : `${pCoeff}t^{2}`}$, which is $y^{2} = ${fourP}x$ for every $t$.`,
              `代入得 $(${poly([2 * p, "t"])})^{2} = ${4 * p * p}t^{2} = ${fourP} \\cdot ${p < 0 ? `(${pCoeff}t^{2})` : `${pCoeff}t^{2}`}$，对每个 $t$ 都满足 $y^{2} = ${fourP}x$。`,
            ),
          ),
          [
            why(
              same(`$${wrong1}$`),
              "This swaps $x$ and $y$: in $y^{2} = 4px$ the squared variable $y$ is the one that is linear in $t$.",
              "这把 $x$ 和 $y$ 对调了：在 $y^{2} = 4px$ 中，被平方的 $y$ 才关于 $t$ 为一次。",
            ),
            why(
              same(`$${wrong2}$`),
              `With $y = ${poly([2 * p, "t"])}$, $y^{2} = ${4 * p * p}t^{2}$, so $x$ must be $${pCoeff}t^{2}$, not $${poly([fourP, "t^2"])}$.`,
              `$y = ${poly([2 * p, "t"])}$ 时 $y^{2} = ${4 * p * p}t^{2}$，所以 $x$ 应为 $${pCoeff}t^{2}$，不是 $${poly([fourP, "t^2"])}$。`,
            ),
            why(
              same(`$${wrong3}$`),
              `With $y = ${poly([p, "t"])}$, $y^{2} = ${p * p === 1 ? "" : p * p}t^{2}$, which is only $${pCoeff}x$, not $${fourP}x$.`,
              `$y = ${poly([p, "t"])}$ 时 $y^{2} = ${p * p === 1 ? "" : p * p}t^{2}$，只等于 $${pCoeff}x$，不是 $${fourP}x$。`,
            ),
          ],
        );
      },
    },
    {
      id: "standard-vertical-parabola-parametric",
      figure: precalculusDrawings4["parametric-equations-of-parabolas#standard-vertical-parabola-parametric"],
      title: t("Parametric equations of vertical parabolas $x^2 = 4py$", "铅直抛物线 $x^2 = 4py$ 的参数方程"),
      explanation: t(
        "A standard vertical parabola with vertex at $(0, 0)$ has Cartesian equation $x^2 = 4py$ with focus at $(0, p)$.\nSetting $x = 2pt$ into the equation gives:\n$$(2pt)^2 = 4py \\implies 4p^2 t^2 = 4py \\implies y = pt^2$$\nThus, its parametric equations are:\n$$x = 2pt, \\quad y = pt^2 \\quad (t \\in \\mathbb{R})$$\n\nFor $x^{2} = -16y$: $4p = -16$, so $p = -4$, and $x = -8t$, $y = -4t^{2}$, with focus $(0, -4)$. Check: $t = 1$ gives $(-8, -4)$, and $(-8)^{2} = 64 = -16 \\cdot (-4)$.\n\n> **Watch out.** Here $x$ is squared, so $x$ is the linear one: $x = 2pt$ and $y = pt^{2}$. The focus $(0, p)$ is on the $y$-axis, and keeps the sign of $p$.",
        "顶点在原点 $(0, 0)$、焦点在 $(0, p)$ 的标准铅直抛物线方程为 $x^2 = 4py$。\n令 $x = 2pt$ 代入方程可得：\n$$(2pt)^2 = 4py \\implies 4p^2 t^2 = 4py \\implies y = pt^2$$\n因此其参数方程为：\n$$x = 2pt, \\quad y = pt^2 \\quad (t \\in \\mathbb{R})$$\n\n对 $x^{2} = -16y$：$4p = -16$，所以 $p = -4$，$x = -8t$，$y = -4t^{2}$，焦点为 $(0, -4)$。检验：$t = 1$ 给出 $(-8, -4)$，而 $(-8)^{2} = 64 = -16 \\cdot (-4)$。\n\n> **注意。** 这里被平方的是 $x$，所以 $x$ 关于 $t$ 为一次：$x = 2pt$，$y = pt^{2}$。焦点 $(0, p)$ 在 $y$ 轴上，并保留 $p$ 的符号。",
      ),
      generate(rng) {
        const p = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const fourP = 4 * p;
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const mode = rng.pick(["toParametric", "toCartesian", "focusDirectrix"]);

        if (mode === "toCartesian") {
          const rightEq = `x^2 = ${fourP}y`;
          const wrong1 = `y^2 = ${fourP}x`;
          const wrong2 = `x^2 = ${2 * p}y`;
          const wrong3 = `x^2 = ${-fourP}y`;
          return equationProblem({
            prompt: t(
              `Eliminate the parameter $t$ from $x = ${poly([2 * p, "t"])}, y = ${pCoeff}t^2$ ($t \\in \\mathbb{R}$) to find the Cartesian equation of the parabola.`,
              `消去参数 $t$（$t \\in \\mathbb{R}$），求抛物线 $x = ${poly([2 * p, "t"])}, y = ${pCoeff}t^2$ 的直角坐标方程。`,
            ),
            answer: rightEq,
            wrong: [wrong1, wrong2, wrong3],
            solution: walked(
              [
                [
                  ["Solve for t", "解出 t"],
                  t(`The equation for $x$ is linear in $t$:`, `$x$ 的方程关于 $t$ 是一次的：`),
                  [`t = \\frac{x}{${2 * p}}`],
                ],
                [
                  ["Substitute", "代入"],
                  t(`Put it into $y = ${pCoeff}t^{2}$ and clear the fraction:`, `代入 $y = ${pCoeff}t^{2}$ 并去分母：`),
                  [`y = ${pCoeff}\\left(\\frac{x}{${2 * p}}\\right)^{2} = \\frac{x^{2}}{${fourP}}`, rightEq],
                ],
              ],
              t(
                `At $t = 1$ the curve is at $(${2 * p}, ${p})$, and $${paren(2 * p)}^{2} = ${4 * p * p} = ${fourP} \\cdot ${paren(p)}$.`,
                `$t = 1$ 时曲线在 $(${2 * p}, ${p})$，而 $${paren(2 * p)}^{2} = ${4 * p * p} = ${fourP} \\cdot ${paren(p)}$。`,
              ),
            ),
          });
        }

        if (mode === "focusDirectrix") {
          return pointProblem({
            prompt: t(
              `For the parabola given parametrically by $x = ${poly([2 * p, "t"])}, y = ${pCoeff}t^2$, find the coordinates of its focus.`,
              `求参数方程为 $x = ${poly([2 * p, "t"])}, y = ${pCoeff}t^2$ 的抛物线的焦点坐标。`,
            ),
            answer: [0, p],
            wrong: [
              [p, 0],
              [0, 2 * p],
              [0, -p],
            ],
            solution: walked(
              [
                [
                  ["Match the standard form", "对照标准形式"],
                  t(
                    `In $x = 2pt$, $y = pt^{2}$ the coefficient of $t^{2}$ is $p$, and the coefficient of $t$ is twice it: here $p = ${p}$ and $2p = ${2 * p}$.`,
                    `在 $x = 2pt$，$y = pt^{2}$ 中，$t^{2}$ 的系数是 $p$，$t$ 的系数是它的两倍：这里 $p = ${p}$，$2p = ${2 * p}$。`,
                  ),
                ],
                [
                  ["Place the focus", "确定焦点"],
                  t(
                    `This is $x^{2} = ${fourP}y$, which opens along the $y$-axis with focus $(0, p) = (0, ${p})$ and directrix $y = ${-p}$.`,
                    `这是 $x^{2} = ${fourP}y$，沿 $y$ 轴张开，焦点 $(0, p) = (0, ${p})$，准线 $y = ${-p}$。`,
                  ),
                ],
              ],
              t(
                `The point at $t = 1$ is $(${2 * p}, ${p})$. It is $${Math.abs(2 * p)}$ from the focus $(0, ${p})$, straight ${p > 0 ? "right" : "left"}, and $|${p} - ${paren(-p)}| = ${Math.abs(2 * p)}$ from the directrix, as a point of a parabola must be.`,
                `$t = 1$ 对应的点是 $(${2 * p}, ${p})$。它到焦点 $(0, ${p})$ 的距离是 $${Math.abs(2 * p)}$（在正${p > 0 ? "右" : "左"}方），到准线的距离是 $|${p} - ${paren(-p)}| = ${Math.abs(2 * p)}$，正如抛物线上的点应满足的那样。`,
              ),
            ),
          });
        }

        const rightParam = `x = ${poly([2 * p, "t"])}, \\; y = ${pCoeff}t^2`;
        const wrong1 = `x = ${pCoeff}t^2, \\; y = ${poly([2 * p, "t"])}`;
        const wrong2 = `x = ${poly([2 * p, "t"])}, \\; y = ${poly([fourP, "t^2"])}`;
        const wrong3 = `x = ${poly([p, "t"])}, \\; y = ${pCoeff}t^2`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the standard parabola $x^2 = ${fourP}y$ ($t \\in \\mathbb{R}$).`,
            `求标准铅直抛物线 $x^2 = ${fourP}y$ 的参数方程（$t \\in \\mathbb{R}$）。`,
          ),
          same(`$${rightParam}$`),
          [same(`$${wrong1}$`), same(`$${wrong2}$`), same(`$${wrong3}$`)],
          walked(
            [
              [["Find p", "求 p"], t(`Compare with $x^{2} = 4py$:`, `与 $x^{2} = 4py$ 比较：`), [`4p = ${fourP} \\implies p = ${p}`]],
              [
                ["Write the equations", "写出参数方程"],
                t(`The squared variable $x$ is linear in $t$:`, `被平方的 $x$ 关于 $t$ 是一次的：`),
                [`x = 2pt = ${poly([2 * p, "t"])}, \\quad y = pt^{2} = ${pCoeff}t^{2}`],
              ],
            ],
            t(
              `Substituting, $(${poly([2 * p, "t"])})^{2} = ${4 * p * p}t^{2} = ${fourP} \\cdot ${p < 0 ? `(${pCoeff}t^{2})` : `${pCoeff}t^{2}`}$, which is $x^{2} = ${fourP}y$ for every $t$.`,
              `代入得 $(${poly([2 * p, "t"])})^{2} = ${4 * p * p}t^{2} = ${fourP} \\cdot ${p < 0 ? `(${pCoeff}t^{2})` : `${pCoeff}t^{2}`}$，对每个 $t$ 都满足 $x^{2} = ${fourP}y$。`,
            ),
          ),
          [
            why(
              same(`$${wrong1}$`),
              "This swaps $x$ and $y$: in $x^{2} = 4py$ the squared variable $x$ is the one that is linear in $t$.",
              "这把 $x$ 和 $y$ 对调了：在 $x^{2} = 4py$ 中，被平方的 $x$ 才关于 $t$ 为一次。",
            ),
            why(
              same(`$${wrong2}$`),
              `With $x = ${poly([2 * p, "t"])}$, $x^{2} = ${4 * p * p}t^{2}$, so $y$ must be $${pCoeff}t^{2}$, not $${poly([fourP, "t^2"])}$.`,
              `$x = ${poly([2 * p, "t"])}$ 时 $x^{2} = ${4 * p * p}t^{2}$，所以 $y$ 应为 $${pCoeff}t^{2}$，不是 $${poly([fourP, "t^2"])}$。`,
            ),
            why(
              same(`$${wrong3}$`),
              `With $x = ${poly([p, "t"])}$, $x^{2} = ${p * p === 1 ? "" : p * p}t^{2}$, which is only $${pCoeff}y$, not $${fourP}y$.`,
              `$x = ${poly([p, "t"])}$ 时 $x^{2} = ${p * p === 1 ? "" : p * p}t^{2}$，只等于 $${pCoeff}y$，不是 $${fourP}y$。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 8.28.8 Parametric Equations of Parabolas Centered at (h,k) ─────────────

/** parametricEquationsOfParabolasCenteredAtHk covers translated parabolas. */
export const parametricEquationsOfParabolasCenteredAtHk: TopicDef = {
  id: "parametric-equations-of-parabolas-centered-at-hk",
  title: t("Parametric Equations of Parabolas Centered at (h,k)", "一般位置抛物线的参数方程"),
  summary: t(
    "Write parametric equations for translated parabolas with vertex (h, k), such as x = h + 2pt, y = k + pt² or x = h + pt², y = k + 2pt, and identify the vertex and Cartesian form.",
    "写出顶点为 (h, k) 的平移抛物线的参数方程（如 x = h + 2pt, y = k + pt² 或 x = h + pt², y = k + 2pt），并识别其顶点坐标与直角坐标方程。",
  ),
  prerequisites: ["parametric-equations-of-parabolas"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `Moving a parabola moves every point by the same amount, so its parametric equations just gain the shift. The parabola $x = 2t$, $y = t^{2}$ has vertex $(0, 0)$; moved to the vertex $(2, -1)$ it becomes $x = 2 + 2t$, $y = -1 + t^{2}$, and $t = 0$ still gives the vertex. Eliminating $t = \\frac{x - 2}{2}$ gives

$$y + 1 = \\frac{(x - 2)^{2}}{4} \\implies (x - 2)^{2} = 4(y + 1)$$

Check: $t = 1$ gives $(4, 0)$, and $(4 - 2)^{2} = 4 = 4(0 + 1)$.

In this lesson we eliminate the parameter for parabolas with vertex $(h, k)$ that open up or down and left or right, and read the vertex from the parameter.`,
    `平移抛物线时每个点都移动同样的距离，所以参数方程只是加上平移量。抛物线 $x = 2t$，$y = t^{2}$ 的顶点是 $(0, 0)$；平移到顶点 $(2, -1)$ 后变成 $x = 2 + 2t$，$y = -1 + t^{2}$，而 $t = 0$ 仍给出顶点。消去 $t = \\frac{x - 2}{2}$ 得

$$y + 1 = \\frac{(x - 2)^{2}}{4} \\implies (x - 2)^{2} = 4(y + 1)$$

检验：$t = 1$ 给出 $(4, 0)$，而 $(4 - 2)^{2} = 4 = 4(0 + 1)$。

这节课我们对顶点为 $(h, k)$、向上下或左右张开的抛物线消去参数，并由参数读出顶点。`,
  ),
  knowledgePoints: [
    {
      id: "shifted-vertical-parabola-parametric",
      figure: precalculusDrawings4["parametric-equations-of-parabolas-centered-at-hk#shifted-vertical-parabola-parametric"],
      title: t("Shifted vertical parabola parametric equations", "顶点在 (h, k) 的铅直抛物线参数方程"),
      explanation: t(
        "Translating a standard vertical parabola with vertex $(h, k)$ gives the Cartesian equation:\n$$(x - h)^2 = 4p(y - k)$$\nIts parametric equations are obtained by shifting the standard form $(2pt, pt^2)$:\n$$x = h + 2pt, \\quad y = k + pt^2 \\quad (t \\in \\mathbb{R})$$\nAt $t = 0$, $(x, y) = (h, k)$, which is the vertex of the parabola.\n\nFor $x = 1 + 4t$, $y = 3 + 2t^{2}$, where $p = 2$: $t = \\frac{x - 1}{4}$, so $y - 3 = 2 \\cdot \\frac{(x - 1)^{2}}{16}$, that is $(x - 1)^{2} = 8(y - 3)$. Check: $t = 1$ gives $(5, 5)$, and $(5 - 1)^{2} = 16 = 8(5 - 3)$.\n\n> **Watch out.** The right side is $4p$ times $(y - k)$: $8(y - 3)$, not $4(y - 3)$. The brackets hold $x - h$ and $y - k$, so a vertex $(1, 3)$ gives $(x - 1)$ and $(y - 3)$.",
        "将顶点位于 $(h, k)$ 的铅直抛物线平移后，其直角坐标顶点式方程为：\n$$(x - h)^2 = 4p(y - k)$$\n通过在标准参数式 $(2pt, pt^2)$ 上叠加平移量，得到参数方程：\n$$x = h + 2pt, \\quad y = k + pt^2 \\quad (t \\in \\mathbb{R})$$\n当 $t = 0$ 时，点 $(x, y) = (h, k)$ 即为抛物线的顶点坐标。\n\n对 $x = 1 + 4t$，$y = 3 + 2t^{2}$，其中 $p = 2$：$t = \\frac{x - 1}{4}$，所以 $y - 3 = 2 \\cdot \\frac{(x - 1)^{2}}{16}$，即 $(x - 1)^{2} = 8(y - 3)$。检验：$t = 1$ 给出 $(5, 5)$，而 $(5 - 1)^{2} = 16 = 8(5 - 3)$。\n\n> **注意。** 右边是 $4p$ 乘 $(y - k)$：是 $8(y - 3)$，不是 $4(y - 3)$。括号里是 $x - h$ 和 $y - k$，所以顶点 $(1, 3)$ 给出 $(x - 1)$ 和 $(y - 3)$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const p = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xTerm = linExpr(2 * p, h, "t");
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const yTerm = `${pCoeff}t^2 ${sgnTerm(k)}`.trim();
        const stdEq = `${sq("x", h)} = ${4 * p}${lin("y", k)}`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $t$ to find the Cartesian equation of the parabola $x(t) = ${xTerm}$, $y(t) = ${yTerm}$.`,
            `消去参数 $t$，求参数抛物线 $x(t) = ${xTerm}$，$y(t) = ${yTerm}$ 的直角坐标方程。`,
          ),
          answer: stdEq,
          wrong: [
            `${sq("x", -h)} = ${4 * p}${lin("y", -k)}`,
            `${sq("y", k)} = ${4 * p}${lin("x", h)}`,
            `${sq("x", h)} = ${2 * p}${lin("y", k)}`,
          ],
          solution: walked(
            [
              [
                ["Find the vertex", "求顶点"],
                t(
                  `At $t = 0$ the point is $(${h}, ${k})$, the vertex, where $y$ turns around.`,
                  `$t = 0$ 时点为 $(${h}, ${k})$，即顶点，$y$ 在这里转向。`,
                ),
              ],
              [
                ["Solve for t", "解出 t"],
                t(`The equation for $x$ is linear in $t$:`, `$x$ 的方程关于 $t$ 是一次的：`),
                [`t = \\frac{${linExpr(1, -h, "x")}}{${2 * p}}`],
              ],
              [
                ["Substitute and clear the fraction", "代入并去分母"],
                t(
                  `Put it into $${linExpr(1, -k, "y")} = ${pCoeff}t^{2}$ and multiply by $${4 * p}$:`,
                  `代入 $${linExpr(1, -k, "y")} = ${pCoeff}t^{2}$，再乘以 $${4 * p}$：`,
                ),
                [
                  `${linExpr(1, -k, "y")} = ${pCoeff}\\left(\\frac{${linExpr(1, -h, "x")}}{${2 * p}}\\right)^{2} = \\frac{${sq("x", h)}}{${4 * p}}`,
                  stdEq,
                ],
              ],
            ],
            t(
              `At $t = 1$ the curve is at $(${h + 2 * p}, ${k + p})$, where $x - h = ${2 * p}$ and $y - k = ${p}$: $${paren(2 * p)}^{2} = ${4 * p * p} = ${4 * p} \\cdot ${paren(p)}$.`,
              `$t = 1$ 时曲线在 $(${h + 2 * p}, ${k + p})$，这里 $x - h = ${2 * p}$，$y - k = ${p}$：$${paren(2 * p)}^{2} = ${4 * p * p} = ${4 * p} \\cdot ${paren(p)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "shifted-horizontal-parabola-parametric",
      figure: precalculusDrawings4["parametric-equations-of-parabolas-centered-at-hk#shifted-horizontal-parabola-parametric"],
      title: t("Shifted horizontal parabola parametric equations", "顶点在 (h, k) 的水平抛物线参数方程"),
      explanation: t(
        "A parabola opening horizontally with vertex at $(h, k)$ has Cartesian equation:\n$$(y - k)^2 = 4p(x - h)$$\nIts parametric equations are:\n$$x = h + pt^2, \\quad y = k + 2pt \\quad (t \\in \\mathbb{R})$$\nAt $t = 0$, $(x, y) = (h, k)$ gives the vertex.\n\nFor $x = -2 + 3t^{2}$, $y = 1 + 6t$, where $p = 3$: $t = \\frac{y - 1}{6}$, so $x + 2 = 3 \\cdot \\frac{(y - 1)^{2}}{36}$, that is $(y - 1)^{2} = 12(x + 2)$. Check: $t = 1$ gives $(1, 7)$, and $(7 - 1)^{2} = 36 = 12(1 + 2)$.\n\n> **Watch out.** Here $y$ is squared, because $y$ is linear in $t$: the equation is $(y - k)^{2} = 4p(x - h)$, not $(x - h)^{2} = 4p(y - k)$. Use $4p = 12$, not $2p = 6$.",
        "顶点在 $(h, k)$ 且开口水平的抛物线的直角坐标方程为：\n$$(y - k)^2 = 4p(x - h)$$\n其对应的参数方程为：\n$$x = h + pt^2, \\quad y = k + 2pt \\quad (t \\in \\mathbb{R})$$\n在 $t = 0$ 处，点 $(x, y) = (h, k)$ 即为顶点。\n\n对 $x = -2 + 3t^{2}$，$y = 1 + 6t$，其中 $p = 3$：$t = \\frac{y - 1}{6}$，所以 $x + 2 = 3 \\cdot \\frac{(y - 1)^{2}}{36}$，即 $(y - 1)^{2} = 12(x + 2)$。检验：$t = 1$ 给出 $(1, 7)$，而 $(7 - 1)^{2} = 36 = 12(1 + 2)$。\n\n> **注意。** 这里被平方的是 $y$，因为 $y$ 关于 $t$ 是一次的：方程是 $(y - k)^{2} = 4p(x - h)$，不是 $(x - h)^{2} = 4p(y - k)$。要用 $4p = 12$，不是 $2p = 6$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const p = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const xTerm = `${pCoeff}t^2 ${sgnTerm(h)}`.trim();
        const yTerm = linExpr(2 * p, k, "t");
        const stdEq = `${sq("y", k)} = ${4 * p}${lin("x", h)}`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $t$ to find the Cartesian equation of the parabola $x(t) = ${xTerm}$, $y(t) = ${yTerm}$.`,
            `消去参数 $t$，求参数抛物线 $x(t) = ${xTerm}$，$y(t) = ${yTerm}$ 的直角坐标方程。`,
          ),
          answer: stdEq,
          wrong: [
            `${sq("y", -k)} = ${4 * p}${lin("x", -h)}`,
            `${sq("x", h)} = ${4 * p}${lin("y", k)}`,
            `${sq("y", k)} = ${2 * p}${lin("x", h)}`,
          ],
          solution: walked(
            [
              [
                ["Find the vertex", "求顶点"],
                t(
                  `At $t = 0$ the point is $(${h}, ${k})$, the vertex, where $x$ turns around.`,
                  `$t = 0$ 时点为 $(${h}, ${k})$，即顶点，$x$ 在这里转向。`,
                ),
              ],
              [
                ["Solve for t", "解出 t"],
                t(`The equation for $y$ is linear in $t$:`, `$y$ 的方程关于 $t$ 是一次的：`),
                [`t = \\frac{${linExpr(1, -k, "y")}}{${2 * p}}`],
              ],
              [
                ["Substitute and clear the fraction", "代入并去分母"],
                t(
                  `Put it into $${linExpr(1, -h, "x")} = ${pCoeff}t^{2}$ and multiply by $${4 * p}$:`,
                  `代入 $${linExpr(1, -h, "x")} = ${pCoeff}t^{2}$，再乘以 $${4 * p}$：`,
                ),
                [
                  `${linExpr(1, -h, "x")} = ${pCoeff}\\left(\\frac{${linExpr(1, -k, "y")}}{${2 * p}}\\right)^{2} = \\frac{${sq("y", k)}}{${4 * p}}`,
                  stdEq,
                ],
              ],
            ],
            t(
              `At $t = 1$ the curve is at $(${h + p}, ${k + 2 * p})$, where $y - k = ${2 * p}$ and $x - h = ${p}$: $${paren(2 * p)}^{2} = ${4 * p * p} = ${4 * p} \\cdot ${paren(p)}$.`,
              `$t = 1$ 时曲线在 $(${h + p}, ${k + 2 * p})$，这里 $y - k = ${2 * p}$，$x - h = ${p}$：$${paren(2 * p)}^{2} = ${4 * p * p} = ${4 * p} \\cdot ${paren(p)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 8.28.9 Parametric Equations of Horizontal Hyperbolas ───────────────────

/** parametricEquationsOfHorizontalHyperbolas covers horizontal hyperbolas using sec and tan. */
export const parametricEquationsOfHorizontalHyperbolas: TopicDef = {
  id: "parametric-equations-of-horizontal-hyperbolas",
  title: t("Parametric Equations of Horizontal Hyperbolas", "水平双曲线的参数方程"),
  summary: t(
    "Parametrize horizontal hyperbolas using secant and tangent as x = h + a sec θ, y = k + b tan θ, and verify the standard Cartesian equation using sec² θ - tan² θ = 1.",
    "使用正割与正切函数将水平双曲线参数化为 x = h + a sec θ, y = k + b tan θ，并利用 sec² θ - tan² θ = 1 转化为标准直角坐标方程。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "horizontal-hyperbola-standard-to-parametric",
      title: t("Standard to parametric form of horizontal hyperbolas", "水平双曲线标准方程化为参数方程"),
      explanation: t(
        "A horizontal hyperbola with center $(h, k)$ and semi-axes $a$ and $b$ has standard equation:\n$$\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$$\nUsing the identity $\\sec^2\\theta - \\tan^2\\theta = 1$, we assign $\\frac{x - h}{a} = \\sec\\theta$ and $\\frac{y - k}{b} = \\tan\\theta$, which yields:\n$$x = h + a\\sec\\theta, \\quad y = k + b\\tan\\theta$$",
        "中心在 $(h, k)$、半实轴为 $a$、半虚轴为 $b$ 的水平双曲线的标准方程为：\n$$\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$$\n利用三角恒等式 $\\sec^2\\theta - \\tan^2\\theta = 1$，令 $\\frac{x - h}{a} = \\sec\\theta$ 与 $\\frac{y - k}{b} = \\tan\\theta$，得到其参数方程为：\n$$x = h + a\\sec\\theta, \\quad y = k + b\\tan\\theta$$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, b, "\\tan\\theta")}, \\; y = ${trigTerm(k, a, "\\sec\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, a2, "\\sec\\theta")}, \\; y = ${trigTerm(k, b2, "\\tan\\theta")}`;
        const wrong3 = `x = ${trigTerm(h, a, "\\cos\\theta")}, \\; y = ${trigTerm(k, b, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(-h, a, "\\sec\\theta")}, \\; y = ${trigTerm(-k, b, "\\tan\\theta")}`;
        return oneOf(
          rng,
          t(`Find the parametric equations of the horizontal hyperbola $${stdEq}$.`, `求水平双曲线 $${stdEq}$ 的参数方程。`),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `The center is $(h, k) = (${h}, ${k})$. The semi-transverse axis is $a = \\sqrt{${a2}} = ${a}$ and semi-conjugate axis is $b = \\sqrt{${b2}} = ${b}$.\nUsing $\\sec^2\\theta - \\tan^2\\theta = 1$:\n$$x = h + a\\sec\\theta = ${trigTerm(h, a, "\\sec\\theta")}, \\quad y = k + b\\tan\\theta = ${trigTerm(k, b, "\\tan\\theta")}$$`,
            `双曲线中心为 $(h, k) = (${h}, ${k})$，半实轴长 $a = \\sqrt{${a2}} = ${a}$，半虚轴长 $b = \\sqrt{${b2}} = ${b}$。\n利用 $\\sec^2\\theta - \\tan^2\\theta = 1$ 可得：\n$$x = h + a\\sec\\theta = ${trigTerm(h, a, "\\sec\\theta")}, \\quad y = k + b\\tan\\theta = ${trigTerm(k, b, "\\tan\\theta")}$$`,
          ),
        );
      },
    },
    {
      id: "horizontal-hyperbola-parametric-to-standard",
      title: t("Identify center and vertices from horizontal hyperbola", "由参数方程确定水平双曲线的中心与顶点"),
      explanation: t(
        "For a horizontal hyperbola $x = h + a\\sec\\theta, y = k + b\\tan\\theta$:\n- The center is $(h, k)$.\n- The transverse axis is horizontal, along the line $y = k$.\n- The vertices occur where $\\tan\\theta = 0$ (so $\\sec\\theta = \\pm 1$), giving $(h - a, k)$ and $(h + a, k)$.\n- The Cartesian equation is $\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$.",
        "对于水平双曲线参数方程 $x = h + a\\sec\\theta, y = k + b\\tan\\theta$：\n- 中心为 $(h, k)$。\n- 实轴沿水平方向直线 $y = k$。\n- 顶点发生在 $\\tan\\theta = 0$（此时 $\\sec\\theta = \\pm 1$）处，坐标为 $(h - a, k)$ 和 $(h + a, k)$。\n- 直角坐标方程为 $\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const xTerm = trigTerm(h, a, "\\sec\\theta");
        const yTerm = trigTerm(k, b, "\\tan\\theta");
        const stdEq = `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $\\theta$ to find the standard Cartesian equation of the hyperbola defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `消去参数 $\\theta$，求由参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 定义的双曲线的标准直角坐标方程。`,
          ),
          answer: stdEq,
          wrong: [
            `\\frac{${sq("y", k)}}{${a2}} - \\frac{${sq("x", h)}}{${b2}} = 1`,
            `\\frac{${sq("x", -h)}}{${a2}} - \\frac{${sq("y", -k)}}{${b2}} = 1`,
            `\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1`,
          ],
          solution: t(
            `The center is $(h, k) = (${h}, ${k})$. Since $\\sec\\theta = \\frac{${lin("x", h)}}{${a}}$ and $\\tan\\theta = \\frac{${lin("y", k)}}{${b}}$, using $\\sec^2\\theta - \\tan^2\\theta = 1$ gives:\n$$${stdEq}$$`,
            `中心为 $(h, k) = (${h}, ${k})$。由于 $\\sec\\theta = \\frac{${lin("x", h)}}{${a}}$ 且 $\\tan\\theta = \\frac{${lin("y", k)}}{${b}}$，利用 $\\sec^2\\theta - \\tan^2\\theta = 1$ 可得：\n$$${stdEq}$$`,
          ),
        });
      },
    },
  ],
};

// ─── 8.28.10 Parametric Equations of Vertical Hyperbolas ────────────────────

/** parametricEquationsOfVerticalHyperbolas covers vertical hyperbolas with transverse axis along y. */
export const parametricEquationsOfVerticalHyperbolas: TopicDef = {
  id: "parametric-equations-of-vertical-hyperbolas",
  title: t("Parametric Equations of Vertical Hyperbolas", "铅直双曲线的参数方程"),
  summary: t(
    "Parametrize vertical hyperbolas with transverse axis along y as y = k + a sec θ, x = h + b tan θ, and convert to standard Cartesian form (y - k)²/a² - (x - h)²/b² = 1.",
    "将主轴沿 y 轴方向的铅直双曲线参数化为 y = k + a sec θ, x = h + b tan θ，并将其与标准方程 (y - k)²/a² - (x - h)²/b² = 1 进行互化。",
  ),
  prerequisites: ["parametric-equations-of-horizontal-hyperbolas"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "vertical-hyperbola-standard-to-parametric",
      title: t("Standard to parametric form of vertical hyperbolas", "铅直双曲线标准方程化为参数方程"),
      explanation: t(
        "A vertical hyperbola with center $(h, k)$ has standard equation:\n$$\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$$\nTo match $\\sec^2\\theta - \\tan^2\\theta = 1$, we assign the secant to the positive term (here $y$):\n$$\\frac{y - k}{a} = \\sec\\theta, \\quad \\frac{x - h}{b} = \\tan\\theta$$\nwhich gives:\n$$x = h + b\\tan\\theta, \\quad y = k + a\\sec\\theta$$",
        "中心在 $(h, k)$ 的铅直双曲线的标准方程为：\n$$\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$$\n对照 $\\sec^2\\theta - \\tan^2\\theta = 1$，正项（$y$ 项）对应正割函数：\n$$\\frac{y - k}{a} = \\sec\\theta, \\quad \\frac{x - h}{b} = \\tan\\theta$$\n得到参数方程为：\n$$x = h + b\\tan\\theta, \\quad y = k + a\\sec\\theta$$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("y", k)}}{${a2}} - \\frac{${sq("x", h)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, b, "\\tan\\theta")}, \\; y = ${trigTerm(k, a, "\\sec\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, b2, "\\tan\\theta")}, \\; y = ${trigTerm(k, a2, "\\sec\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, b, "\\tan\\theta")}, \\; y = ${trigTerm(-k, a, "\\sec\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, b, "\\sin\\theta")}, \\; y = ${trigTerm(k, a, "\\cos\\theta")}`;
        return oneOf(
          rng,
          t(`Find the parametric equations of the vertical hyperbola $${stdEq}$.`, `求铅直双曲线 $${stdEq}$ 的参数方程。`),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `The positive term is $y$, so the transverse axis is vertical with semi-axis $a = ${a}$, and semi-conjugate axis $b = ${b}$.\nUsing $\\sec^2\\theta - \\tan^2\\theta = 1$:\n$$x = h + b\\tan\\theta = ${trigTerm(h, b, "\\tan\\theta")}, \\quad y = k + a\\sec\\theta = ${trigTerm(k, a, "\\sec\\theta")}$$`,
            `方程中正项为 $y$，因此主轴为铅直方向，半实轴长 $a = ${a}$，半虚轴长 $b = ${b}$。\n利用 $\\sec^2\\theta - \\tan^2\\theta = 1$：\n$$x = h + b\\tan\\theta = ${trigTerm(h, b, "\\tan\\theta")}, \\quad y = k + a\\sec\\theta = ${trigTerm(k, a, "\\sec\\theta")}$$`,
          ),
        );
      },
    },
    {
      id: "vertical-hyperbola-parametric-to-standard",
      title: t("Identify center and vertices of vertical hyperbola", "由参数方程确定铅直双曲线的中心与顶点"),
      explanation: t(
        "For a vertical hyperbola $x = h + b\\tan\\theta, y = k + a\\sec\\theta$:\n- The center is $(h, k)$.\n- The transverse axis is vertical, along the line $x = h$.\n- The vertices occur at $\\tan\\theta = 0$ (so $\\sec\\theta = \\pm 1$), giving $(h, k - a)$ and $(h, k + a)$.\n- The Cartesian equation is $\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$.",
        "对于铅直双曲线参数方程 $x = h + b\\tan\\theta, y = k + a\\sec\\theta$：\n- 中心为 $(h, k)$。\n- 实轴沿铅直方向直线 $x = h$。\n- 顶点发生在 $\\tan\\theta = 0$（此时 $\\sec\\theta = \\pm 1$）处，坐标为 $(h, k - a)$ 和 $(h, k + a)$。\n- 直角坐标方程为 $\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const xTerm = trigTerm(h, b, "\\tan\\theta");
        const yTerm = trigTerm(k, a, "\\sec\\theta");
        const stdEq = `\\frac{${sq("y", k)}}{${a2}} - \\frac{${sq("x", h)}}{${b2}} = 1`;
        return equationProblem({
          prompt: t(
            `Eliminate the parameter $\\theta$ to find the standard Cartesian equation of the hyperbola defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `消去参数 $\\theta$，求由参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 定义的双曲线的标准直角坐标方程。`,
          ),
          answer: stdEq,
          wrong: [
            `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`,
            `\\frac{${sq("y", -k)}}{${a2}} - \\frac{${sq("x", -h)}}{${b2}} = 1`,
            `\\frac{${sq("y", k)}}{${a2}} + \\frac{${sq("x", h)}}{${b2}} = 1`,
          ],
          solution: t(
            `The center is $(h, k) = (${h}, ${k})$. Since $\\sec\\theta = \\frac{${lin("y", k)}}{${a}}$ and $\\tan\\theta = \\frac{${lin("x", h)}}{${b}}$, using $\\sec^2\\theta - \\tan^2\\theta = 1$ gives:\n$$${stdEq}$$`,
            `中心为 $(h, k) = (${h}, ${k})$。由于 $\\sec\\theta = \\frac{${lin("y", k)}}{${a}}$ 且 $\\tan\\theta = \\frac{${lin("x", h)}}{${b}}$，利用 $\\sec^2\\theta - \\tan^2\\theta = 1$ 可得：\n$$${stdEq}$$`,
          ),
        });
      },
    },
  ],
};

// ─── 9.29.1 Introduction to Polar Coordinates ───────────────────────────────

/** introductionToPolarCoordinates covers pole, polar axis, coordinates (r, θ), and negative r. */
export const introductionToPolarCoordinates: TopicDef = {
  id: "introduction-to-polar-coordinates",
  title: t("Introduction to Polar Coordinates", "极坐标系与点的极坐标"),
  summary: t(
    "Understand the polar coordinate system defined by a pole and polar axis, plot points with coordinates (r, θ), and represent points using negative radial values (-r, θ) = (r, θ + π) and non-unique angles.",
    "理解由极点和极轴构成的极坐标系，绘制坐标为 (r, θ) 的点，掌握负极径表示法 (-r, θ) = (r, θ + π) 以及极坐标的多重非唯一性表示。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "plotting-polar-coordinates",
      figure: precalculusDrawings3["introduction-to-polar-coordinates#plotting-polar-coordinates"],
      title: t("Plotting points and negative r in polar coordinates", "在极坐标系中描点与负极径"),
      explanation: t(
        "In the polar coordinate system, a point $P$ is located by $(r, \\theta)$:\n- The origin is the **pole** $O$, and the positive horizontal axis is the **polar axis**.\n- $r$ is the directed distance from the pole to $P$.\n- $\\theta$ is the directed angle measured counterclockwise from the polar axis.\n\nWhen $r < 0$, plot the point $|r|$ units along the opposite ray pointing in direction $\\theta + \\pi$:\n$$(-r, \\theta) = (r, \\theta + \\pi)$$\nFor example, $(-4, \\frac{\\pi}{3}) = (4, \\frac{4\\pi}{3})$, which lies in Quadrant III.",
        "在极坐标系中，平面上的点 $P$ 由有序数对 $(r, \\theta)$ 确定：\n- 原点称为**极点** $O$，水平向右的射线称为**极轴**。\n- $r$ 是从极点到点 $P$ 的有向距离（极径）。\n- $\\theta$ 是从极轴逆时针旋转到极径的有向角（极角）。\n\n当 $r < 0$ 时，点位于射线反向延长线上（即 $\\theta + \\pi$ 方向），距极点 $|r|$ 个单位：\n$$(-r, \\theta) = (r, \\theta + \\pi)$$\n例如，$(-4, \\frac{\\pi}{3}) = (4, \\frac{4\\pi}{3})$，位于第三象限。",
      ),
      generate(rng) {
        const specialAngles = [
          { angleStr: "\\frac{\\pi}{6}", oppStr: "\\frac{7\\pi}{6}", oppAngle: "7pi/6" },
          { angleStr: "\\frac{\\pi}{4}", oppStr: "\\frac{5\\pi}{4}", oppAngle: "5pi/4" },
          { angleStr: "\\frac{\\pi}{3}", oppStr: "\\frac{4\\pi}{3}", oppAngle: "4pi/3" },
          { angleStr: "\\frac{\\pi}{2}", oppStr: "\\frac{3\\pi}{2}", oppAngle: "3pi/2" },
          { angleStr: "\\frac{2\\pi}{3}", oppStr: "\\frac{5\\pi}{3}", oppAngle: "5pi/3" },
          { angleStr: "\\frac{3\\pi}{4}", oppStr: "\\frac{7\\pi}{4}", oppAngle: "7pi/4" },
          { angleStr: "\\frac{5\\pi}{6}", oppStr: "\\frac{11\\pi}{6}", oppAngle: "11pi/6" },
        ];
        const item = rng.pick(specialAngles);
        const rNeg = rng.int(-8, -2);
        const rPos = Math.abs(rNeg);
        const rightChoice = `(${rPos}, ${item.oppStr})`;
        const wrong1 = `(${rPos}, ${item.angleStr})`;
        const wrong2 = `(${rNeg}, ${item.oppStr})`;
        const wrong3 = `(${rPos}, -${item.angleStr})`;
        const wrong4 = `(${rPos}, 2\\pi - ${item.angleStr})`;
        return oneOf(
          rng,
          t(
            `Which of the following gives the polar coordinates of $(${rNeg}, ${item.angleStr})$ with positive radius $r > 0$ and $0 \\le \\theta < 2\\pi$?`,
            `下列哪个选项给出了极坐标点 $(${rNeg}, ${item.angleStr})$ 在 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 条件下的等价坐标？`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `A negative radius represents movement in the opposite direction $\\theta + \\pi$:\n$$(${rNeg}, ${item.angleStr}) = (${rPos}, ${item.angleStr} + \\pi) = (${rPos}, ${item.oppStr})$$`,
            `负极径表示沿反方向 $\\theta + \\pi$ 度量：\n$$(${rNeg}, ${item.angleStr}) = (${rPos}, ${item.angleStr} + \\pi) = (${rPos}, ${item.oppStr})$$`,
          ),
        );
      },
    },
    {
      id: "multiple-polar-representations",
      title: t("Equivalent polar coordinate representations", "点的等价极坐标表示"),
      explanation: t(
        "Unlike Cartesian coordinates, polar representations are not unique. Every point in the plane has infinitely many pairs of polar coordinates:\n$$(r, \\theta) = (r, \\theta + 2k\\pi) = (-r, \\theta + (2k+1)\\pi), \\quad k \\in \\mathbb{Z}$$\nFor example, $(3, \\frac{\\pi}{4})$ can also be written as $(3, \\frac{9\\pi}{4})$, $(3, -\\frac{7\\pi}{4})$, or $(-3, \\frac{5\\pi}{4})$.",
        "与直角坐标不同，平面的极坐标表示不是唯一的。同一个点具有无穷多对极坐标表示：\n$$(r, \\theta) = (r, \\theta + 2k\\pi) = (-r, \\theta + (2k+1)\\pi), \\quad k \\in \\mathbb{Z}$$\n例如，$(3, \\frac{\\pi}{4})$ 亦可表示为 $(3, \\frac{9\\pi}{4})$、$(3, -\\frac{7\\pi}{4})$ 或 $(-3, \\frac{5\\pi}{4})$。",
      ),
      generate(rng) {
        const angleList = [
          { th: "\\frac{\\pi}{6}", plusPi: "\\frac{7\\pi}{6}", minus2Pi: "-\\frac{11\\pi}{6}" },
          { th: "\\frac{\\pi}{4}", plusPi: "\\frac{5\\pi}{4}", minus2Pi: "-\\frac{7\\pi}{4}" },
          { th: "\\frac{\\pi}{3}", plusPi: "\\frac{4\\pi}{3}", minus2Pi: "-\\frac{5\\pi}{3}" },
          { th: "\\frac{\\pi}{2}", plusPi: "\\frac{3\\pi}{2}", minus2Pi: "-\\frac{3\\pi}{2}" },
          { th: "\\frac{2\\pi}{3}", plusPi: "\\frac{5\\pi}{3}", minus2Pi: "-\\frac{4\\pi}{3}" },
          { th: "\\frac{3\\pi}{4}", plusPi: "\\frac{7\\pi}{4}", minus2Pi: "-\\frac{5\\pi}{4}" },
          { th: "\\frac{5\\pi}{6}", plusPi: "\\frac{11\\pi}{6}", minus2Pi: "-\\frac{7\\pi}{6}" },
          { th: "\\frac{7\\pi}{6}", plusPi: "\\frac{\\pi}{6}", minus2Pi: "-\\frac{5\\pi}{6}" },
          { th: "\\frac{5\\pi}{4}", plusPi: "\\frac{\\pi}{4}", minus2Pi: "-\\frac{3\\pi}{4}" },
          { th: "\\frac{4\\pi}{3}", plusPi: "\\frac{\\pi}{3}", minus2Pi: "-\\frac{2\\pi}{3}" },
          { th: "\\frac{5\\pi}{3}", plusPi: "\\frac{2\\pi}{3}", minus2Pi: "-\\frac{\\pi}{3}" },
          { th: "\\frac{7\\pi}{4}", plusPi: "\\frac{3\\pi}{4}", minus2Pi: "-\\frac{\\pi}{4}" },
          { th: "\\frac{11\\pi}{6}", plusPi: "\\frac{5\\pi}{6}", minus2Pi: "-\\frac{\\pi}{6}" },
        ];
        const rVal = rng.int(2, 9);
        const item = rng.pick(angleList);
        const mode = rng.pick(["negR", "negTheta"]);

        if (mode === "negR") {
          const rightChoice = `(-${rVal}, ${item.plusPi})`;
          const wrong1 = `(-${rVal}, ${item.th})`;
          const wrong2 = `(${rVal}, ${item.plusPi})`;
          const wrong3 = `(-${rVal}, -${item.th})`;
          return oneOf(
            rng,
            t(
              `Which of the following coordinates represents the point $(${rVal}, ${item.th})$ using a negative radius $r < 0$ and $0 \\le \\theta < 2\\pi$?`,
              `下列哪个选项使用负极径 $r < 0$ 且 $0 \\le \\theta < 2\\pi$ 表示点 $(${rVal}, ${item.th})$？`,
            ),
            t(`$${rightChoice}$`, `$${rightChoice}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Using $(-r, \\theta + \\pi)$:\n$$(${rVal}, ${item.th}) = (-${rVal}, ${item.th} + \\pi) = ${rightChoice}$$`,
              `根据 $(-r, \\theta + \\pi)$：\n$$(${rVal}, ${item.th}) = (-${rVal}, ${item.th} + \\pi) = ${rightChoice}$$`,
            ),
          );
        }

        const rightChoice = `(${rVal}, ${item.minus2Pi})`;
        const wrong1 = `(${rVal}, -${item.th})`;
        const wrong2 = `(-${rVal}, ${item.minus2Pi})`;
        const wrong3 = `(${rVal}, ${item.plusPi})`;
        return oneOf(
          rng,
          t(
            `Which of the following coordinates represents the point $(${rVal}, ${item.th})$ with a negative angle in $[-2\\pi, 0)$?`,
            `下列哪个选项使用在 $[-2\\pi, 0)$ 内的负角表示点 $(${rVal}, ${item.th})$？`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Subtract $2\\pi$ from the angle:\n$$(${rVal}, ${item.th}) = (${rVal}, ${item.th} - 2\\pi) = ${rightChoice}$$`,
            `极角减去 $2\\pi$：\n$$(${rVal}, ${item.th}) = (${rVal}, ${item.th} - 2\\pi) = ${rightChoice}$$`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.2 Converting from Polar Coordinates to Cartesian Coordinates ──────

/** convertingFromPolarCoordinatesToCartesianCoordinates covers polar <-> Cartesian coordinate conversions. */
export const convertingFromPolarCoordinatesToCartesianCoordinates: TopicDef = {
  id: "converting-from-polar-coordinates-to-cartesian-coordinates",
  title: t("Converting from Polar Coordinates to Cartesian Coordinates", "极坐标与直角坐标的互相转换"),
  summary: t(
    "Convert coordinates between polar (r, θ) and Cartesian (x, y) systems using x = r cos θ, y = r sin θ, r = √(x² + y²), and tan θ = y/x with quadrant analysis.",
    "利用 x = r cos θ, y = r sin θ 以及 r = √(x² + y²), tan θ = y/x（结合象限判断）实现极坐标 (r, θ) 与直角坐标 (x, y) 之间的互相转换。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "polar-to-cartesian",
      figure: precalculusDrawings3["converting-from-polar-coordinates-to-cartesian-coordinates#polar-to-cartesian"],
      title: t("Convert polar coordinates to Cartesian coordinates", "将极坐标转换为直角坐标"),
      explanation: t(
        "A point in polar coordinates is given by its distance from the origin and its angle, and right-triangle trigonometry gives its horizontal and vertical coordinates. To convert polar coordinates $(r, \\theta)$ to Cartesian coordinates $(x, y)$:\n$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$\nFor example, for $(r, \\theta) = (6, \\frac{2\\pi}{3})$:\n$$x = 6\\cos\\frac{2\\pi}{3} = 6\\left(-\\frac{1}{2}\\right) = -3, \\quad y = 6\\sin\\frac{2\\pi}{3} = 6\\left(\\frac{\\sqrt{3}}{2}\\right) = 3\\sqrt{3}$$\nThus $(x, y) = (-3, 3\\sqrt{3})$.",
        "极坐标中的点由它到原点的距离和角度给出，用直角三角形中的三角比就能求出它的横坐标和纵坐标。将极坐标 $(r, \\theta)$ 转换为直角坐标 $(x, y)$ 的公式为：\n$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$\n例如，对于 $(r, \\theta) = (6, \\frac{2\\pi}{3})$：\n$$x = 6\\cos\\frac{2\\pi}{3} = 6\\left(-\\frac{1}{2}\\right) = -3, \\quad y = 6\\sin\\frac{2\\pi}{3} = 6\\left(\\frac{\\sqrt{3}}{2}\\right) = 3\\sqrt{3}$$\n直角坐标为 $(-3, 3\\sqrt{3})$。",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const r = 2 * k;
        const angles = [
          { th: "\\frac{\\pi}{3}", x: `${k}`, y: `${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{2\\pi}{3}", x: `-${k}`, y: `${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{4\\pi}{3}", x: `-${k}`, y: `-${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{5\\pi}{3}", x: `${k}`, y: `-${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{\\pi}{6}", x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}` },
          { th: "\\frac{5\\pi}{6}", x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}` },
          { th: "\\frac{7\\pi}{6}", x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}` },
          { th: "\\frac{11\\pi}{6}", x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}` },
        ];
        const item = rng.pick(angles);
        const negX = item.x.startsWith("-") ? item.x.slice(1) : `-${item.x}`;
        const negY = item.y.startsWith("-") ? item.y.slice(1) : `-${item.y}`;
        const rightChoice = `(${item.x}, ${item.y})`;
        const wrong1 = `(${item.y}, ${item.x})`;
        const wrong2 = `(${negX}, ${item.y})`;
        const wrong3 = `(${item.x}, ${negY})`;
        return oneOf(
          rng,
          t(
            `Convert the polar coordinates $(${r}, ${item.th})$ into Cartesian coordinates $(x, y)$.`,
            `将极坐标 $(${r}, ${item.th})$ 转换为直角坐标 $(x, y)$。`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Calculate $x$ and $y$:\n$$x = ${r}\\cos\\left(${item.th}\\right) = ${item.x}$$\n$$y = ${r}\\sin\\left(${item.th}\\right) = ${item.y}$$\nThus $(x, y) = ${rightChoice}$.`,
            `计算 $x$ 与 $y$：\n$$x = ${r}\\cos\\left(${item.th}\\right) = ${item.x}$$\n$$y = ${r}\\sin\\left(${item.th}\\right) = ${item.y}$$\n因此直角坐标为 $${rightChoice}$。`,
          ),
        );
      },
    },
    {
      id: "cartesian-to-polar",
      figure: precalculusDrawings4["converting-from-polar-coordinates-to-cartesian-coordinates#cartesian-to-polar"],
      title: t("Convert Cartesian coordinates to polar coordinates", "将直角坐标转换为极坐标"),
      explanation: t(
        "To convert Cartesian coordinates $(x, y)$ into polar coordinates $(r, \\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$:\n1. Find the distance $r = \\sqrt{x^2 + y^2}$.\n2. Find the reference angle $\\alpha = \\arctan|y/x|$.\n3. Determine $\\theta$ by identifying the quadrant of $(x, y)$:\n   - Quadrant I: $\\theta = \\alpha$\n   - Quadrant II: $\\theta = \\pi - \\alpha$\n   - Quadrant III: $\\theta = \\pi + \\alpha$\n   - Quadrant IV: $\\theta = 2\\pi - \\alpha$",
        "将直角坐标 $(x, y)$ 转换为满足 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 的极坐标 $(r, \\theta)$ 的步骤：\n1. 计算距离 $r = \\sqrt{x^2 + y^2}$。\n2. 计算参考角 $\\alpha = \\arctan|y/x|$。\n3. 根据 $(x, y)$ 所在的象限确定极角 $\\theta$：\n   - 第一象限：$\\theta = \\alpha$\n   - 第二象限：$\\theta = \\pi - \\alpha$\n   - 第三象限：$\\theta = \\pi + \\alpha$\n   - 第四象限：$\\theta = 2\\pi - \\alpha$",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const configs = [
          { x: `${k}`, y: `${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{\\pi}{4}" },
          { x: `-${k}`, y: `${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{3\\pi}{4}" },
          { x: `-${k}`, y: `-${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{5\\pi}{4}" },
          { x: `${k}`, y: `-${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{7\\pi}{4}" },
          { x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}`, r: `${2 * k}`, th: "\\frac{\\pi}{6}" },
          { x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}`, r: `${2 * k}`, th: "\\frac{5\\pi}{6}" },
          { x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}`, r: `${2 * k}`, th: "\\frac{7\\pi}{6}" },
          { x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}`, r: `${2 * k}`, th: "\\frac{11\\pi}{6}" },
        ];
        const item = rng.pick(configs);
        const rightChoice = `(${item.r}, ${item.th})`;
        const wrong1 = `(${item.r}, ${piAngle(-twelfthsOf(item.th))})`;
        const wrong2 = `(${k}, ${item.th})`;
        const wrong3 = `(${item.r}, ${piAngle(twelfthsOf(item.th) + 12)})`;
        return oneOf(
          rng,
          t(
            `Convert the Cartesian point $(${item.x}, ${item.y})$ into polar coordinates $(r, \\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
            `将直角坐标点 $(${item.x}, ${item.y})$ 转换为满足 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 的极坐标 $(r, \\theta)$。`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Compute radius:\n$$r = \\sqrt{x^2 + y^2} = ${item.r}$$\nDetermine angle $\\theta$ from $\\tan\\theta = y/x$ and quadrant analysis:\n$$\\theta = ${item.th}$$\nThus $(r, \\theta) = ${rightChoice}$.`,
            `计算极径：\n$$r = \\sqrt{x^2 + y^2} = ${item.r}$$\n根据 $\\tan\\theta = y/x$ 结合所在象限确定极角：\n$$\\theta = ${item.th}$$\n因此极坐标为 $${rightChoice}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.3 Polar Equations of Circles Centered at the Origin ───────────────

/** polarEquationsOfCirclesCenteredAtTheOrigin covers r = a circles and Cartesian conversions. */
export const polarEquationsOfCirclesCenteredAtTheOrigin: TopicDef = {
  id: "polar-equations-of-circles-centered-at-the-origin",
  title: t("Polar Equations of Circles Centered at the Origin", "以极点为圆心的圆的极坐标方程"),
  summary: t(
    "Analyze polar equations of circles centered at the pole in the form $r = a$, understand families of concentric circles, and convert to Cartesian form $x^2 + y^2 = a^2$.",
    "掌握以极点为圆心的圆的极坐标方程 $r = a$，理解同心圆族，并实现与直角坐标方程 $x^2 + y^2 = a^2$ 的互化。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1", "CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "circle-at-origin-polar-form",
      title: t("Circles centered at the pole r = a", "以极点为圆心的圆 r = a"),
      explanation: t(
        "The polar equation $r = a$ (where $a \\ne 0$) states that every point on the graph is at directed distance $|a|$ from the pole, for every angle $\\theta$:\n- The graph is a circle centered at the pole $(0, 0)$ with radius $R = |a|$.\n- The equation $r = -a$ produces the identical circle, because $(-a, \\theta) = (a, \\theta + \\pi)$.\n- Varying $a$ generates a family of concentric circles centered at the origin.",
        "极坐标方程 $r = a$（其中 $a \\ne 0$）表示平面上所有与极点的距离均为 $|a|$ 的点构成的集合：\n- 其图形是以极点 $(0, 0)$ 为圆心、半径为 $R = |a|$ 的圆。\n- 方程 $r = -a$ 表示完全相同的圆，因为 $(-a, \\theta) = (a, \\theta + \\pi)$。\n- 改变常数 $a$ 的值，可得到以极点为中心的同心圆族。",
      ),
      figure: concentricCirclesFigure,
      generate(rng) {
        const a = rng.pick([
          -18, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18,
        ]);
        const radius = Math.abs(a);
        const diameter = 2 * radius;
        const askRadius = rng.bool();
        return numberProblem({
          prompt: askRadius
            ? t(`Find the radius of the circle with polar equation $r = ${a}$.`, `求极坐标方程 $r = ${a}$ 所表示的圆的半径。`)
            : t(`Find the diameter of the circle with polar equation $r = ${a}$.`, `求极坐标方程 $r = ${a}$ 所表示的圆的直径。`),
          answer: askRadius ? radius : diameter,
          wrong: [askRadius ? diameter : radius, a, radius * radius],
          solution: t(
            `The equation $r = ${a}$ represents all points at distance $|${a}| = ${radius}$ from the pole $(0, 0)$.\nThus the center is $(0, 0)$, radius is $${radius}$, and diameter is $2(${radius}) = ${diameter}$.`,
            `方程 $r = ${a}$ 表示所有到极点 $(0, 0)$ 的距离为 $|${a}| = ${radius}$ 的点。\n因此圆心为 $(0, 0)$，半径为 $${radius}$，直径为 $2(${radius}) = ${diameter}$。`,
          ),
        });
      },
    },
    {
      id: "circle-at-origin-conversion",
      figure: precalculusDrawings4["polar-equations-of-circles-centered-at-the-origin#circle-at-origin-conversion"],
      title: t("Convert r = a to Cartesian equation", "将 r = a 转化为直角坐标方程"),
      explanation: t(
        "Since polar and Cartesian coordinates are related by $x^2 + y^2 = r^2$, squaring both sides of $r = a$ gives:\n$$r^2 = a^2 \\implies x^2 + y^2 = a^2$$\nFor instance, the polar circle $r = 5$ has Cartesian equation $x^2 + y^2 = 25$.",
        "由于极坐标与直角坐标的关系满足 $x^2 + y^2 = r^2$，将 $r = a$ 两边平方即可得：\n$$r^2 = a^2 \\implies x^2 + y^2 = a^2$$\n例如，极坐标方程 $r = 5$ 对应的直角坐标方程为 $x^2 + y^2 = 25$。",
      ),
      generate(rng) {
        const a = rng.pick([
          -18, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18,
          20,
        ]);
        const radius = Math.abs(a);
        const a2 = radius * radius;
        return equationProblem({
          prompt: t(
            `Find the Cartesian equation corresponding to the polar equation $r = ${a}$.`,
            `求极坐标方程 $r = ${a}$ 对应的直角坐标方程。`,
          ),
          answer: `x^2 + y^2 = ${a2}`,
          wrong: [`x^2 + y^2 = ${radius}`, `${sq("x", a)} + y^2 = ${a2}`, `x^2 + ${sq("y", a)} = ${a2}`],
          solution: t(
            `Square both sides of $r = ${a}$:\n$$r^2 = (${a})^2 = ${a2}$$\nSince $r^2 = x^2 + y^2$, the Cartesian equation is $x^2 + y^2 = ${a2}$.`,
            `将 $r = ${a}$ 两边平方：\n$$r^2 = (${a})^2 = ${a2}$$\n由 $r^2 = x^2 + y^2$ 可得直角坐标方程为 $x^2 + y^2 = ${a2}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 9.29.4 Polar Equations of Radial Lines ─────────────────────────────────

/** polarEquationsOfRadialLines covers theta = alpha lines and conversions. */
export const polarEquationsOfRadialLines: TopicDef = {
  id: "polar-equations-of-radial-lines",
  title: t("Polar Equations of Radial Lines", "过极点的射线的极坐标方程"),
  summary: t(
    "Write and interpret polar equations of lines through the pole as θ = α, understand the slope m = tan α, and convert to Cartesian form y = (tan α) x.",
    "建立并理解过极点的直线与射线的极坐标方程 θ = α，掌握斜率 m = tan α，并将其转换为直角坐标方程 y = (tan α) x。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [{ topic: "introduction-to-polar-coordinates", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "radial-line-polar-equation",
      figure: precalculusDrawings3["polar-equations-of-radial-lines#radial-line-polar-equation"],
      title: t("The polar equation $\\theta = \\alpha$", "极坐标方程 $\\theta = \\alpha$"),
      explanation: t(
        "The polar equation $\\theta = \\alpha$ places no restriction on $r$, allowing $r$ to be any real number:\n- For $r \\ge 0$, the points trace the ray making angle $\\alpha$ with the polar axis.\n- For $r < 0$, the points trace the opposite ray in direction $\\alpha + \\pi$.\nTogether, all values of $r \\in \\mathbb{R}$ form the complete straight line passing through the pole with slope:\n$$m = \\tan\\alpha$$",
        "极坐标方程 $\\theta = \\alpha$ 对极径 $r$ 没有任何限制，$r$ 可取任意实数：\n- 当 $r \\ge 0$ 时，点构成与极轴夹角为 $\\alpha$ 的射线。\n- 当 $r < 0$ 时，点构成反方向角为 $\\alpha + \\pi$ 的反向射线。\n两部分结合，全体 $r \\in \\mathbb{R}$ 构成了整条穿过极点且斜率为：\n$$m = \\tan\\alpha$$\n的直线。",
      ),
      generate(rng) {
        const lineData = [
          {
            alpha: "\\frac{\\pi}{6}",
            deg: "30^\\circ",
            slope: "\\frac{\\sqrt{3}}{3}",
            bad1: "\\sqrt{3}",
            bad2: "-\\frac{\\sqrt{3}}{3}",
          },
          { alpha: "\\frac{\\pi}{4}", deg: "45^\\circ", slope: "1", bad1: "-1", bad2: "\\sqrt{3}" },
          {
            alpha: "\\frac{\\pi}{3}",
            deg: "60^\\circ",
            slope: "\\sqrt{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-\\sqrt{3}",
          },
          {
            alpha: "\\frac{2\\pi}{3}",
            deg: "120^\\circ",
            slope: "-\\sqrt{3}",
            bad1: "\\sqrt{3}",
            bad2: "-\\frac{\\sqrt{3}}{3}",
          },
          { alpha: "\\frac{3\\pi}{4}", deg: "135^\\circ", slope: "-1", bad1: "1", bad2: "-\\sqrt{3}" },
          {
            alpha: "\\frac{5\\pi}{6}",
            deg: "150^\\circ",
            slope: "-\\frac{\\sqrt{3}}{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-\\sqrt{3}",
          },
          {
            alpha: "\\frac{7\\pi}{6}",
            deg: "210^\\circ",
            slope: "\\frac{\\sqrt{3}}{3}",
            bad1: "-\\frac{\\sqrt{3}}{3}",
            bad2: "1",
          },
          {
            alpha: "\\frac{5\\pi}{4}",
            deg: "225^\\circ",
            slope: "1",
            bad1: "-1",
            bad2: "\\frac{\\sqrt{3}}{3}",
          },
          { alpha: "\\frac{4\\pi}{3}", deg: "240^\\circ", slope: "\\sqrt{3}", bad1: "-\\sqrt{3}", bad2: "1" },
          { alpha: "\\frac{5\\pi}{3}", deg: "300^\\circ", slope: "-\\sqrt{3}", bad1: "\\sqrt{3}", bad2: "1" },
          {
            alpha: "\\frac{7\\pi}{4}",
            deg: "315^\\circ",
            slope: "-1",
            bad1: "1",
            bad2: "-\\frac{\\sqrt{3}}{3}",
          },
          {
            alpha: "\\frac{11\\pi}{6}",
            deg: "330^\\circ",
            slope: "-\\frac{\\sqrt{3}}{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-1",
          },
        ];
        const item = rng.pick(lineData);
        const mode = rng.pick(["slopeRad", "slopeDeg", "pointOnLine"]);
        if (mode === "pointOnLine") {
          const r = rng.int(2, 8);
          const tw = twelfthsOf(item.alpha);
          const opposite = piAngle(tw + 12);
          const at = (angle: string) => t(`$\\left(${r},\\, ${angle}\\right)$`, `$\\left(${r},\\, ${angle}\\right)$`);
          return oneOf(
            rng,
            t(
              `The polar equation $\\theta = ${item.alpha}$, with $r$ any real number, is a line through the pole. Which of these points lies on the line?`,
              `极坐标方程 $\\theta = ${item.alpha}$（$r$ 取任意实数）是一条过极点的直线。下列哪个点在这条直线上？`,
            ),
            at(opposite),
            [at(piAngle(tw + 6)), at(piAngle(-tw)), at(piAngle(tw + 4)), at(piAngle(tw + 8))],
            t(
              `Adding $\\pi$ to the angle and changing the sign of $r$ gives the same point, so $\\left(${r},\\, ${opposite}\\right)$ is the point $\\left(${-r},\\, ${item.alpha}\\right)$, which satisfies $\\theta = ${item.alpha}$. It lies on the opposite ray. The other angles do not differ from $${item.alpha}$ by a multiple of $\\pi$.`,
              `角加 $\\pi$ 并改变 $r$ 的符号，得到的是同一个点，所以 $\\left(${r},\\, ${opposite}\\right)$ 就是点 $\\left(${-r},\\, ${item.alpha}\\right)$，它满足 $\\theta = ${item.alpha}$，位于反向射线上。其余的角与 $${item.alpha}$ 之差都不是 $\\pi$ 的整数倍。`,
            ),
          );
        }
        const angleTex = mode === "slopeDeg" ? item.deg : item.alpha;
        const slopeAnswer: [number | Q, number] =
          item.slope === "\\frac{\\sqrt{3}}{3}"
            ? [Q.of(1, 3), 3]
            : item.slope === "-\\frac{\\sqrt{3}}{3}"
              ? [Q.of(-1, 3), 3]
              : item.slope === "\\sqrt{3}"
                ? [1, 3]
                : item.slope === "-\\sqrt{3}"
                  ? [-1, 3]
                  : item.slope === "1"
                    ? [1, 1]
                    : [-1, 1];
        return radicalProblem({
          prompt: t(
            `Find the slope $m$ of the line given by the polar equation $\\theta = ${angleTex}$.`,
            `求极坐标方程 $\\theta = ${angleTex}$ 所表示直线的斜率 $m$。`,
          ),
          answer: slopeAnswer,
          wrong: [item.bad1, item.bad2, "0"],
          solution: t(
            `The line passes through the pole with inclination angle $\\alpha = ${angleTex}$.\nThe slope is $m = \\tan\\left(${angleTex}\\right) = ${item.slope}$.`,
            `该直线通过极点，倾斜角为 $\\alpha = ${angleTex}$。\n因此斜率为 $m = \\tan\\left(${angleTex}\\right) = ${item.slope}$。`,
          ),
        });
      },
    },
    {
      id: "radial-line-to-cartesian",
      figure: precalculusDrawings4["polar-equations-of-radial-lines#radial-line-to-cartesian"],
      title: t("Convert $\\theta = \\alpha$ to a Cartesian equation", "将 $\\theta = \\alpha$ 转化为直角坐标方程"),
      explanation: t(
        "A fixed angle with any distance describes a whole line through the origin, because negative distances reach the points on the opposite side. To convert $\\theta = \\alpha$ into Cartesian coordinates, take the tangent of both sides:\n$$\\tan\\theta = \\tan\\alpha \\implies \\frac{y}{x} = \\tan\\alpha \\implies y = (\\tan\\alpha)x$$\nFor example, $\\theta = \\frac{\\pi}{3}$ gives $y = \\left(\\tan\\frac{\\pi}{3}\\right)x = \\sqrt{3}x$.",
        "固定角度而距离任意时，描述的是一条经过原点的直线，因为负的距离会到达另一侧的点。将 $\\theta = \\alpha$ 转化为直角坐标方程时，两边取正切：\n$$\\tan\\theta = \\tan\\alpha \\implies \\frac{y}{x} = \\tan\\alpha \\implies y = (\\tan\\alpha)x$$\n例如，$\\theta = \\frac{\\pi}{3}$ 对应直线 $y = \\left(\\tan\\frac{\\pi}{3}\\right)x = \\sqrt{3}x$。",
      ),
      generate(rng) {
        const lineData = [
          {
            alpha: "\\frac{\\pi}{6}",
            reducedAlpha: "\\frac{\\pi}{6}",
            deg: "30^\\circ",
            eq: "y = \\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = -\\frac{\\sqrt{3}}{3}x",
            stdEq: (c: number) => (c === 1 ? "x - \\sqrt{3}y = 0" : `${c}x - ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{\\pi}{4}",
            reducedAlpha: "\\frac{\\pi}{4}",
            deg: "45^\\circ",
            eq: "y = x",
            bad1: "y = -x",
            bad2: "y = 2x",
            stdEq: (c: number) => (c === 1 ? "x - y = 0" : `${c}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{\\pi}{3}",
            reducedAlpha: "\\frac{\\pi}{3}",
            deg: "60^\\circ",
            eq: "y = \\sqrt{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -\\sqrt{3}x",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x - y = 0" : `${c}\\sqrt{3}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{2\\pi}{3}",
            reducedAlpha: "\\frac{2\\pi}{3}",
            deg: "120^\\circ",
            eq: "y = -\\sqrt{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = -\\frac{\\sqrt{3}}{3}x",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x + y = 0" : `${c}\\sqrt{3}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{3\\pi}{4}",
            reducedAlpha: "\\frac{3\\pi}{4}",
            deg: "135^\\circ",
            eq: "y = -x",
            bad1: "y = x",
            bad2: "y = -2x",
            stdEq: (c: number) => (c === 1 ? "x + y = 0" : `${c}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{6}",
            reducedAlpha: "\\frac{5\\pi}{6}",
            deg: "150^\\circ",
            eq: "y = -\\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -\\sqrt{3}x",
            stdEq: (c: number) => (c === 1 ? "x + \\sqrt{3}y = 0" : `${c}x + ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{7\\pi}{6}",
            reducedAlpha: "\\frac{\\pi}{6}",
            deg: "210^\\circ",
            eq: "y = \\frac{\\sqrt{3}}{3}x",
            bad1: "y = -\\frac{\\sqrt{3}}{3}x",
            bad2: "y = x",
            stdEq: (c: number) => (c === 1 ? "x - \\sqrt{3}y = 0" : `${c}x - ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{4}",
            reducedAlpha: "\\frac{\\pi}{4}",
            deg: "225^\\circ",
            eq: "y = x",
            bad1: "y = -x",
            bad2: "y = \\sqrt{3}x",
            stdEq: (c: number) => (c === 1 ? "x - y = 0" : `${c}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{4\\pi}{3}",
            reducedAlpha: "\\frac{\\pi}{3}",
            deg: "240^\\circ",
            eq: "y = \\sqrt{3}x",
            bad1: "y = -\\sqrt{3}x",
            bad2: "y = x",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x - y = 0" : `${c}\\sqrt{3}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{3}",
            reducedAlpha: "\\frac{2\\pi}{3}",
            deg: "300^\\circ",
            eq: "y = -\\sqrt{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = x",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x + y = 0" : `${c}\\sqrt{3}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{7\\pi}{4}",
            reducedAlpha: "\\frac{3\\pi}{4}",
            deg: "315^\\circ",
            eq: "y = -x",
            bad1: "y = x",
            bad2: "y = -\\sqrt{3}x",
            stdEq: (c: number) => (c === 1 ? "x + y = 0" : `${c}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{11\\pi}{6}",
            reducedAlpha: "\\frac{5\\pi}{6}",
            deg: "330^\\circ",
            eq: "y = -\\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -x",
            stdEq: (c: number) => (c === 1 ? "x + \\sqrt{3}y = 0" : `${c}x + ${c}\\sqrt{3}y = 0`),
          },
        ];
        const item = rng.pick(lineData);
        const mode = rng.pick(["polarToCartRad", "polarToCartDeg", "cartToPolarSlope", "cartToPolarStd"]);

        if (mode === "cartToPolarStd") {
          const c = rng.int(1, 5);
          const cartEq = item.stdEq(c);
          return oneOf(
            rng,
            t(
              `Convert the Cartesian equation $${cartEq}$ into a polar equation of the form $\\theta = \\alpha$ with $0 \\le \\alpha < \\pi$.`,
              `将直角坐标方程 $${cartEq}$ 转化为形如 $\\theta = \\alpha$（$0 \\le \\alpha < \\pi$）的极坐标方程。`,
            ),
            t(`$\\theta = ${item.reducedAlpha}$`, `$\\theta = ${item.reducedAlpha}$`),
            [
              t(
                `$\\theta = ${piAngle((twelfthsOf(item.reducedAlpha) + 6) % 12)}$`,
                `$\\theta = ${piAngle((twelfthsOf(item.reducedAlpha) + 6) % 12)}$`,
              ),
              t(`$r = ${item.reducedAlpha}$`, `$r = ${item.reducedAlpha}$`),
              t(`$\\theta = 0$`, `$\\theta = 0$`),
            ],
            t(
              `Substitute $x = r\\cos\\theta$ and $y = r\\sin\\theta$ into $${cartEq}$ to find $\\tan\\theta$. For $0 \\le \\alpha < \\pi$, the polar equation is $\\theta = ${item.reducedAlpha}$.`,
              `将 $x = r\\cos\\theta$ 与 $y = r\\sin\\theta$ 代入 $${cartEq}$ 可得 $\\tan\\theta$ 的值。在 $0 \\le \\alpha < \\pi$ 范围内，极坐标方程为 $\\theta = ${item.reducedAlpha}$。`,
            ),
          );
        }

        if (mode === "cartToPolarSlope") {
          return oneOf(
            rng,
            t(
              `Convert the Cartesian line $${item.eq}$ into a polar equation of the form $\\theta = \\alpha$ with $0 \\le \\alpha < \\pi$.`,
              `将直角坐标直线 $${item.eq}$ 转化为形如 $\\theta = \\alpha$（$0 \\le \\alpha < \\pi$）的极坐标方程。`,
            ),
            t(`$\\theta = ${item.reducedAlpha}$`, `$\\theta = ${item.reducedAlpha}$`),
            [
              t(
                `$\\theta = ${piAngle((twelfthsOf(item.reducedAlpha) + 6) % 12)}$`,
                `$\\theta = ${piAngle((twelfthsOf(item.reducedAlpha) + 6) % 12)}$`,
              ),
              t(`$r = ${item.reducedAlpha}$`, `$r = ${item.reducedAlpha}$`),
              t(`$\\theta = 0$`, `$\\theta = 0$`),
            ],
            t(
              `The slope of $${item.eq}$ is $\\tan\\alpha$. For $0 \\le \\alpha < \\pi$, $\\theta = ${item.reducedAlpha}$.`,
              `直线 $${item.eq}$ 的斜率为 $\\tan\\alpha$。在 $0 \\le \\alpha < \\pi$ 内，$\\theta = ${item.reducedAlpha}$。`,
            ),
          );
        }

        const angleTex = mode === "polarToCartDeg" ? item.deg : item.alpha;
        return oneOf(
          rng,
          t(
            `Convert the polar equation $\\theta = ${angleTex}$ into a Cartesian equation.`,
            `将极坐标方程 $\\theta = ${angleTex}$ 转化为直角坐标方程。`,
          ),
          t(`$${item.eq}$`, `$${item.eq}$`),
          [t(`$${item.bad1}$`, `$${item.bad1}$`), t(`$${item.bad2}$`, `$${item.bad2}$`), t(`$x = 0$`, `$x = 0$`)],
          t(
            `Take tangent of both sides: $\\tan\\theta = \\tan\\left(${angleTex}\\right)$.\nSince $\\tan\\theta = y/x$, we obtain $y = (\\tan\\left(${angleTex}\\right))x$, which simplifies to $${item.eq}$.`,
            `两边取正切得：$\\tan\\theta = \\tan\\left(${angleTex}\\right)$。\n由于 $\\tan\\theta = y/x$，化简即得 $${item.eq}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.5 Polar Equations of Circles Centered on Coordinate Axes ──────────

/** polarEquationsOfCirclesCenteredOnTheCoordinateAxes covers r = 2a cos theta and r = 2b sin theta. */
export const polarEquationsOfCirclesCenteredOnTheCoordinateAxes: TopicDef = {
  id: "polar-equations-of-circles-centered-on-the-coordinate-axes",
  title: t("Polar Equations of Circles Centered on the Coordinate Axes", "圆心在坐标轴上的圆的极坐标方程"),
  summary: t(
    "Understand polar equations of circles tangent to a coordinate axis at the pole: r = 2a cos θ (center (a, 0), radius |a|) and r = 2b sin θ (center (0, b), radius |b|), and convert to Cartesian form.",
    "掌握在极点处与坐标轴相切的圆的极坐标方程：r = 2a cos θ（圆心为 (a, 0)，半径为 |a|）与 r = 2b sin θ（圆心为 (0, b)，半径为 |b|），并将其转化为直角坐标方程。",
  ),
  prerequisites: ["polar-equations-of-circles-centered-at-the-origin", "converting-from-polar-coordinates-to-cartesian-coordinates"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1", "CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "circle-on-x-axis-polar",
      title: t("Circles of the form $r = 2a\\cos\\theta$", "形如 $r = 2a\\cos\\theta$ 的圆"),
      explanation: t(
        "Multiplying $r = 2a\\cos\\theta$ by $r$ gives:\n$$r^2 = 2a(r\\cos\\theta) \\implies x^2 + y^2 = 2ax \\implies (x - a)^2 + y^2 = a^2$$\nThis is a circle with:\n- Center at $(a, 0)$ on the $x$-axis\n- Radius $R = |a|$\n- Passing through the pole $(0, 0)$ and tangent to the $y$-axis.",
        "将方程 $r = 2a\\cos\\theta$ 两端同乘 $r$ 可得：\n$$r^2 = 2a(r\\cos\\theta) \\implies x^2 + y^2 = 2ax \\implies (x - a)^2 + y^2 = a^2$$\n这表示一个圆，其特征为：\n- 圆心在 $x$ 轴上的 $(a, 0)$\n- 半径为 $R = |a|$\n- 经过极点 $(0, 0)$ 且与 $y$ 轴相切于极点。",
      ),
      figure: cosineCircleFigure,
      generate(rng) {
        const a = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const twoA = 2 * a;
        const radius = Math.abs(a);
        const a2 = a * a;
        const mode = rng.pick(["fromPolar", "toPolar"]);

        if (mode === "toPolar") {
          const rightEq = `r = ${twoA}\\cos\\theta`;
          const wrong1 = `r = ${twoA}\\sin\\theta`;
          const wrong2 = `r = ${a}\\cos\\theta`;
          const wrong3 = `r = ${-twoA}\\cos\\theta`;
          return oneOf(
            rng,
            t(
              `Find the polar equation for the circle centered at $(${a}, 0)$ with radius $${radius}$.`,
              `求圆心在 $(${a}, 0)$、半径为 $r = ${radius}$ 的圆的极坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `The standard Cartesian equation is $${sq("x", a)} + y^2 = ${a2} \\implies x^2 + y^2 = ${twoA}x$.\nSubstitute $r^2 = x^2 + y^2$ and $x = r\\cos\\theta$:\n$$r^2 = ${twoA}r\\cos\\theta \\implies ${rightEq}$$`,
              `直角坐标方程为 $${sq("x", a)} + y^2 = ${a2} \\implies x^2 + y^2 = ${twoA}x$。\n代入 $r^2 = x^2 + y^2$ 及 $x = r\\cos\\theta$：\n$$r^2 = ${twoA}r\\cos\\theta \\implies ${rightEq}$$`,
            ),
          );
        }

        return equationProblem({
          prompt: t(
            `Convert the polar equation $r = ${twoA}\\cos\\theta$ into standard Cartesian form $(x - a)^2 + y^2 = a^2$.`,
            `将极坐标方程 $r = ${twoA}\\cos\\theta$ 化为圆的标准直角坐标方程 $(x - a)^2 + y^2 = a^2$。`,
          ),
          answer: `${sq("x", a)} + y^2 = ${a2}`,
          wrong: [`x^2 + ${sq("y", a)} = ${a2}`, `${sq("x", twoA)} + y^2 = ${twoA * twoA}`, `${sq("x", -a)} + y^2 = ${a2}`],
          solution: t(
            `Multiply by $r$: $r^2 = ${twoA}r\\cos\\theta \\implies x^2 + y^2 = ${twoA}x$.\nComplete the square: $${poly([1, "x^2"], [-twoA, "x"], [a2, ""])} + y^2 = ${a2} \\implies ${sq("x", a)} + y^2 = ${a2}$.\nCenter is $(${a}, 0)$ and radius is $${radius}$.`,
            `两端同乘 $r$ 得 $r^2 = ${twoA}r\\cos\\theta \\implies x^2 + y^2 = ${twoA}x$。\n配方得 $${poly([1, "x^2"], [-twoA, "x"], [a2, ""])} + y^2 = ${a2} \\implies ${sq("x", a)} + y^2 = ${a2}$。\n因此圆心为 $(${a}, 0)$，半径为 $${radius}$。`,
          ),
        });
      },
    },
    {
      id: "circle-on-y-axis-polar",
      title: t("Circles of the form $r = 2b\\sin\\theta$", "形如 $r = 2b\\sin\\theta$ 的圆"),
      explanation: t(
        "Multiplying $r = 2b\\sin\\theta$ by $r$ gives:\n$$r^2 = 2b(r\\sin\\theta) \\implies x^2 + y^2 = 2by \\implies x^2 + (y - b)^2 = b^2$$\nThis is a circle with:\n- Center at $(0, b)$ on the $y$-axis\n- Radius $R = |b|$\n- Passing through the pole $(0, 0)$ and tangent to the $x$-axis.",
        "将方程 $r = 2b\\sin\\theta$ 两端同乘 $r$ 可得：\n$$r^2 = 2b(r\\sin\\theta) \\implies x^2 + y^2 = 2by \\implies x^2 + (y - b)^2 = b^2$$\n这表示一个圆，其特征为：\n- 圆心在 $y$ 轴上的 $(0, b)$\n- 半径为 $R = |b|$\n- 经过极点 $(0, 0)$ 且与 $x$ 轴相切于极点。",
      ),
      figure: sineCircleFigure,
      generate(rng) {
        const b = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const twoB = 2 * b;
        const radius = Math.abs(b);
        const b2 = b * b;
        const mode = rng.pick(["fromPolar", "toPolar"]);

        if (mode === "toPolar") {
          const rightEq = `r = ${twoB}\\sin\\theta`;
          const wrong1 = `r = ${twoB}\\cos\\theta`;
          const wrong2 = `r = ${b}\\sin\\theta`;
          const wrong3 = `r = ${-twoB}\\sin\\theta`;
          return oneOf(
            rng,
            t(
              `Find the polar equation for the circle centered at $(0, ${b})$ with radius $${radius}$.`,
              `求圆心在 $(0, ${b})$、半径为 $r = ${radius}$ 的圆的极坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `The standard Cartesian equation is $x^2 + ${sq("y", b)} = ${b2} \\implies x^2 + y^2 = ${twoB}y$.\nSubstitute $r^2 = x^2 + y^2$ and $y = r\\sin\\theta$:\n$$r^2 = ${twoB}r\\sin\\theta \\implies ${rightEq}$$`,
              `直角坐标方程为 $x^2 + ${sq("y", b)} = ${b2} \\implies x^2 + y^2 = ${twoB}y$。\n代入 $r^2 = x^2 + y^2$ 及 $y = r\\sin\\theta$：\n$$r^2 = ${twoB}r\\sin\\theta \\implies ${rightEq}$$`,
            ),
          );
        }

        return equationProblem({
          prompt: t(
            `Convert the polar equation $r = ${twoB}\\sin\\theta$ into standard Cartesian form $x^2 + (y - b)^2 = b^2$.`,
            `将极坐标方程 $r = ${twoB}\\sin\\theta$ 化为圆的标准直角坐标方程 $x^2 + (y - b)^2 = b^2$。`,
          ),
          answer: `x^2 + ${sq("y", b)} = ${b2}`,
          wrong: [`${sq("x", b)} + y^2 = ${b2}`, `x^2 + ${sq("y", twoB)} = ${twoB * twoB}`, `x^2 + ${sq("y", -b)} = ${b2}`],
          solution: t(
            `Multiply by $r$: $r^2 = ${twoB}r\\sin\\theta \\implies x^2 + y^2 = ${twoB}y$.\nComplete the square: $x^2 + ${poly([1, "y^2"], [-twoB, "y"], [b2, ""])} = ${b2} \\implies x^2 + ${sq("y", b)} = ${b2}$.\nCenter is $(0, ${b})$ and radius is $${radius}$.`,
            `两端同乘 $r$ 得 $r^2 = ${twoB}r\\sin\\theta \\implies x^2 + y^2 = ${twoB}y$。\n配方得 $x^2 + ${poly([1, "y^2"], [-twoB, "y"], [b2, ""])} = ${b2} \\implies x^2 + ${sq("y", b)} = ${b2}$。\n因此圆心为 $(0, ${b})$，半径为 $${radius}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 9.29.6 Finding Intersections of Polar Curves ───────────────────────────

/** findingIntersectionsOfPolarCurves covers solving simultaneous polar curves and pole intersection. */
export const findingIntersectionsOfPolarCurves: TopicDef = {
  id: "finding-intersections-of-polar-curves",
  title: t("Finding Intersections of Polar Curves", "求极坐标曲线的交点"),
  summary: t(
    "Find intersection points of polar curves by solving r₁(θ) = r₂(θ) simultaneously, accounting for alternative coordinate representations and testing whether the pole is a shared point.",
    "通过联立求解 r₁(θ) = r₂(θ) 寻找极坐标曲线的交点，注意多重极坐标表示，并特别检验极点（r = 0）是否为两曲线的公共交点。",
  ),
  prerequisites: ["polar-equations-of-circles-centered-on-the-coordinate-axes"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "solve-simultaneous-polar-equations",
      title: t("Solving simultaneous polar equations", "联立求解极坐标方程"),
      explanation: t(
        "To find the intersection points of two polar curves $r_1(\\theta)$ and $r_2(\\theta)$:\n1. Set $r_1(\\theta) = r_2(\\theta)$ and solve for $\\theta \\in [0, 2\\pi)$.\n2. Compute $r$ for each solution to obtain $(r, \\theta)$.\n\nFor example, to intersect $r = 3$ and $r = 6\\cos\\theta$:\n$$6\\cos\\theta = 3 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\nyielding points $(3, \\frac{\\pi}{3})$ and $(3, \\frac{5\\pi}{3})$.",
        "求解两极坐标曲线 $r_1(\\theta)$ 与 $r_2(\\theta)$ 的交点方法：\n1. 令 $r_1(\\theta) = r_2(\\theta)$ 并在 $[0, 2\\pi)$ 内求解 $\\theta$。\n2. 将解出的每个 $\\theta$ 代入求出 $r$，得到交点极坐标 $(r, \\theta)$。\n\n例如，求 $r = 3$ 与 $r = 6\\cos\\theta$ 的交点：\n$$6\\cos\\theta = 3 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n交点为 $(3, \\frac{\\pi}{3})$ 和 $(3, \\frac{5\\pi}{3})$。",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const twoA = 2 * a;
        const kind = rng.pick(["cosHalf", "sinHalf", "cosRad2", "sinRad2"]);

        if (kind === "cosRad2") {
          const eq1 = `${a}\\sqrt{2}`;
          const p1 = `(${eq1}, \\frac{\\pi}{4})`;
          const p2 = `(${eq1}, \\frac{7\\pi}{4})`;
          const rightChoice = `$${p1}$ and $${p2}$`;
          const wrong1 = `(${eq1}, \\frac{\\pi}{3})$ and $(${eq1}, \\frac{5\\pi}{3})`;
          const wrong2 = `(${twoA}, \\frac{\\pi}{4})$ and $(${twoA}, \\frac{7\\pi}{4})`;
          const wrong3 = `(${eq1}, \\frac{3\\pi}{4})$ and $(${eq1}, \\frac{5\\pi}{4})`;
          return oneOf(
            rng,
            t(
              `Find the intersection points of the polar curves $r = ${eq1}$ and $r = ${twoA}\\cos\\theta$ for $0 \\le \\theta < 2\\pi$.`,
              `求极坐标曲线 $r = ${eq1}$ 与 $r = ${twoA}\\cos\\theta$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
            ),
            t(rightChoice, rightChoice.replace(" and ", " 和 ")),
            [
              t(`$${wrong1}$`, `$${wrong1}$`.replace(" and ", " 和 ")),
              t(`$${wrong2}$`, `$${wrong2}$`.replace(" and ", " 和 ")),
              t(`$${wrong3}$`, `$${wrong3}$`.replace(" and ", " 和 ")),
            ],
            t(
              `Set equations equal: $${twoA}\\cos\\theta = ${eq1} \\implies \\cos\\theta = \\frac{\\sqrt{2}}{2}$.\nOn $[0, 2\\pi)$, $\\theta = \\frac{\\pi}{4}, \\frac{7\\pi}{4}$.\nThus the intersection points are $${p1}$ and $${p2}$.`,
              `联立方程：$${twoA}\\cos\\theta = ${eq1} \\implies \\cos\\theta = \\frac{\\sqrt{2}}{2}$。\n在 $[0, 2\\pi)$ 内解得 $\\theta = \\frac{\\pi}{4}, \\frac{7\\pi}{4}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
            ),
          );
        }

        if (kind === "sinRad2") {
          const eq1 = `${a}\\sqrt{2}`;
          const p1 = `(${eq1}, \\frac{\\pi}{4})`;
          const p2 = `(${eq1}, \\frac{3\\pi}{4})`;
          const rightChoice = `$${p1}$ and $${p2}$`;
          const wrong1 = `(${eq1}, \\frac{\\pi}{6})$ and $(${eq1}, \\frac{5\\pi}{6})`;
          const wrong2 = `(${twoA}, \\frac{\\pi}{4})$ and $(${twoA}, \\frac{3\\pi}{4})`;
          const wrong3 = `(${eq1}, \\frac{5\\pi}{4})$ and $(${eq1}, \\frac{7\\pi}{4})`;
          return oneOf(
            rng,
            t(
              `Find the intersection points of the polar curves $r = ${eq1}$ and $r = ${twoA}\\sin\\theta$ for $0 \\le \\theta < 2\\pi$.`,
              `求极坐标曲线 $r = ${eq1}$ 与 $r = ${twoA}\\sin\\theta$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
            ),
            t(rightChoice, rightChoice.replace(" and ", " 和 ")),
            [
              t(`$${wrong1}$`, `$${wrong1}$`.replace(" and ", " 和 ")),
              t(`$${wrong2}$`, `$${wrong2}$`.replace(" and ", " 和 ")),
              t(`$${wrong3}$`, `$${wrong3}$`.replace(" and ", " 和 ")),
            ],
            t(
              `Set equations equal: $${twoA}\\sin\\theta = ${eq1} \\implies \\sin\\theta = \\frac{\\sqrt{2}}{2}$.\nOn $[0, 2\\pi)$, $\\theta = \\frac{\\pi}{4}, \\frac{3\\pi}{4}$.\nThus the intersection points are $${p1}$ and $${p2}$.`,
              `联立方程：$${twoA}\\sin\\theta = ${eq1} \\implies \\sin\\theta = \\frac{\\sqrt{2}}{2}$。\n在 $[0, 2\\pi)$ 内解得 $\\theta = \\frac{\\pi}{4}, \\frac{3\\pi}{4}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
            ),
          );
        }

        const isCos = kind === "cosHalf";
        const eq2 = isCos ? `${twoA}\\cos\\theta` : `${twoA}\\sin\\theta`;
        const p1 = isCos ? `(${a}, \\frac{\\pi}{3})` : `(${a}, \\frac{\\pi}{6})`;
        const p2 = isCos ? `(${a}, \\frac{5\\pi}{3})` : `(${a}, \\frac{5\\pi}{6})`;
        const rightChoice = `$${p1}$ and $${p2}$`;
        const wrong1 = isCos
          ? `(${a}, \\frac{\\pi}{6}) and (${a}, \\frac{11\\pi}{6})`
          : `(${a}, \\frac{\\pi}{3}) and (${a}, \\frac{2\\pi}{3})`;
        const wrong2 = `(${twoA}, \\frac{\\pi}{4})$ and $(${twoA}, \\frac{7\\pi}{4})`;
        const wrong3 = `(${a}, \\frac{\\pi}{4})$ and $(${a}, \\frac{5\\pi}{4})`;
        return oneOf(
          rng,
          t(
            `Find the intersection points of the polar curves $r = ${a}$ and $r = ${eq2}$ for $0 \\le \\theta < 2\\pi$.`,
            `求极坐标曲线 $r = ${a}$ 与 $r = ${eq2}$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
          ),
          t(rightChoice, rightChoice.replace(" and ", " 和 ")),
          [
            t(`$${wrong1}$`, `$${wrong1}$`.replace(" and ", " 和 ")),
            t(`$${wrong2}$`, `$${wrong2}$`.replace(" and ", " 和 ")),
            t(`$${wrong3}$`, `$${wrong3}$`.replace(" and ", " 和 ")),
          ],
          t(
            `Set equations equal: $${eq2} = ${a} \\implies ${isCos ? "\\cos" : "\\sin"}\\theta = \\frac{1}{2}$.\nOn $[0, 2\\pi)$, $\\theta = ${isCos ? "\\frac{\\pi}{3}, \\frac{5\\pi}{3}" : "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"}$.\nThe points are $${p1}$ and $${p2}$.`,
            `联立方程：$${eq2} = ${a} \\implies ${isCos ? "\\cos" : "\\sin"}\\theta = \\frac{1}{2}$。\n在 $[0, 2\\pi)$ 内，解得 $\\theta = ${isCos ? "\\frac{\\pi}{3}, \\frac{5\\pi}{3}" : "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
          ),
        );
      },
    },
    {
      id: "pole-as-polar-intersection",
      figure: precalculusDrawings4["finding-intersections-of-polar-curves#pole-as-polar-intersection"],
      title: t("The pole as an intersection point", "极点作为交点的检验"),
      explanation: t(
        "The pole is represented by $(0, \\theta)$ for **any** angle $\\theta$. As a result, two polar curves can both pass through the pole at different angles $\\theta_1 \\ne \\theta_2$.\nSuch a shared point may not show up by simply equating $r_1(\\theta) = r_2(\\theta)$!\n\nTo verify if the pole is an intersection point:\n1. Check whether there is a $\\theta_1$ with $r_1(\\theta_1) = 0$.\n2. Check whether there is a $\\theta_2$ with $r_2(\\theta_2) = 0$.\nIf both curves pass through $r = 0$, the pole $(0, 0)$ is an intersection point.",
        "极点由 $(0, \\theta)$ 表示，对于**任意**角度 $\\theta$ 均代表同一点。因此，两条极坐标曲线完全可以在不同角度 $\\theta_1 \\ne \\theta_2$ 处穿过极点。\n这种交点往往无法通过直接联立方程 $r_1(\\theta) = r_2(\\theta)$ 求解得到！\n\n检验极点是否为交点的方法：\n1. 检查是否存在 $\\theta_1$ 使得 $r_1(\\theta_1) = 0$。\n2. 检查是否存在 $\\theta_2$ 使得 $r_2(\\theta_2) = 0$。\n若两曲线均能取到 $r = 0$，则极点 $(0, 0)$ 是它们的公共交点。",
      ),
      generate(rng) {
        const a = rng.int(1, 8);
        // 0: r = 2b sin θ meets C₁ at the pole and one more point; 1: r = 2b cos θ touches it only at the pole;
        // 2: the circle r = c with c < 2a crosses it twice away from the pole; 3: r = c with c > 2a misses it.
        const kind = rng.int(0, 3);
        const b = kind === 1 ? rng.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((x) => x !== a)) : rng.int(1, 8);
        const c = kind === 2 ? rng.int(1, 2 * a - 1) : rng.int(2 * a + 1, 2 * a + 6);
        const c2 = [`${2 * b}\\sin\\theta`, `${2 * b}\\cos\\theta`, `${c}`, `${c}`][kind]!;
        const c1 = `${2 * a}\\cos\\theta`;
        const options = [
          t(
            "Yes, the pole is an intersection point; there are 2 intersection points in total (the pole and 1 other point).",
            "是，极点是交点；平面内共有 2 个交点（极点及另外 1 个点）。",
          ),
          t("Yes, the pole is an intersection point, and it is the only one.", "是，极点是交点，而且是唯一的交点。"),
          t(
            "No, the pole is not an intersection point; there are 2 intersection points in total.",
            "否，极点不是交点；平面内共有 2 个交点。",
          ),
          t("No, the two curves do not intersect anywhere.", "否，两条曲线在平面内没有任何交点。"),
        ];
        const pole = t(
          `$C_1$ passes through the pole at $\\theta = \\frac{\\pi}{2}$, since $\\cos\\frac{\\pi}{2} = 0$.`,
          `$C_1$ 在 $\\theta = \\frac{\\pi}{2}$ 处经过极点，因为 $\\cos\\frac{\\pi}{2} = 0$。`,
        );
        const rest = [
          t(
            `$C_2$ passes through the pole at $\\theta = 0$, since $\\sin 0 = 0$, so the pole is an intersection point even though the curves reach it at different angles. Equating radii: $${2 * a}\\cos\\theta = ${2 * b}\\sin\\theta$ gives $\\tan\\theta = ${Q.of(a, b).toLatex()}$, one more point. So there are 2 intersection points.`,
            `$C_2$ 在 $\\theta = 0$ 处经过极点，因为 $\\sin 0 = 0$，所以即使两曲线到达极点的角度不同，极点仍是交点。令极径相等：$${2 * a}\\cos\\theta = ${2 * b}\\sin\\theta$，得 $\\tan\\theta = ${Q.of(a, b).toLatex()}$，又得一个交点。所以共有 2 个交点。`,
          ),
          t(
            `$C_2$ also passes through the pole at $\\theta = \\frac{\\pi}{2}$. Equating radii: $${2 * a}\\cos\\theta = ${2 * b}\\cos\\theta$ forces $\\cos\\theta = 0$, which is the pole again. The circles touch only at the pole.`,
            `$C_2$ 也在 $\\theta = \\frac{\\pi}{2}$ 处经过极点。令极径相等：$${2 * a}\\cos\\theta = ${2 * b}\\cos\\theta$ 迫使 $\\cos\\theta = 0$，仍是极点。两圆只在极点相切。`,
          ),
          t(
            `$C_2$ is the circle of radius $${c}$ about the pole, so it never reaches the pole. Equating radii: $\\cos\\theta = ${Q.of(c, 2 * a).toLatex()}$ has two solutions in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, so there are 2 intersection points, neither of them the pole.`,
            `$C_2$ 是以极点为圆心、半径为 $${c}$ 的圆，永远不经过极点。令极径相等：$\\cos\\theta = ${Q.of(c, 2 * a).toLatex()}$ 在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内有两个解，所以共有 2 个交点，都不是极点。`,
          ),
          t(
            `$C_2$ is the circle of radius $${c}$ about the pole, so it never reaches the pole. Every point of $C_1$ is at distance $|${2 * a}\\cos\\theta| \\le ${2 * a} < ${c}$ from the pole, so the curves do not meet.`,
            `$C_2$ 是以极点为圆心、半径为 $${c}$ 的圆，永远不经过极点。$C_1$ 上每一点到极点的距离 $|${2 * a}\\cos\\theta| \\le ${2 * a} < ${c}$，所以两曲线不相交。`,
          ),
        ][kind]!;
        return choiceProblem({
          prompt: t(
            `Do the polar curves $C_1: r = ${c1}$ and $C_2: r = ${c2}$ intersect at the pole, and how many distinct intersection points do they have in the plane?`,
            `极坐标曲线 $C_1: r = ${c1}$ 与 $C_2: r = ${c2}$ 是否相交于极点？它们在平面内共有几个不同的交点？`,
          ),
          options,
          correct: kind,
          solution: t(`${pole.en} ${rest.en}`, `${pole["zh-CN"]}${rest["zh-CN"]}`),
        });
      },
    },
  ],
};

// ─── Exported Topics Array ──────────────────────────────────────────────────

/** precalculusParametricPolarTopics contains the 16 topics of Units 8 & 9. */
export const precalculusParametricPolarTopics: readonly TopicDef[] = [
  graphingCurvesDefinedParametrically,
  cartesianEquationsOfParametricCurves,
  findingInterceptsOfCurvesDefinedParametrically,
  findingIntersectionsOfParametricCurvesAndLines,
  parametricEquationsOfCircles,
  parametricEquationsOfEllipses,
  parametricEquationsOfParabolas,
  parametricEquationsOfParabolasCenteredAtHk,
  parametricEquationsOfHorizontalHyperbolas,
  parametricEquationsOfVerticalHyperbolas,
  introductionToPolarCoordinates,
  convertingFromPolarCoordinatesToCartesianCoordinates,
  polarEquationsOfCirclesCenteredAtTheOrigin,
  polarEquationsOfRadialLines,
  polarEquationsOfCirclesCenteredOnTheCoordinateAxes,
  findingIntersectionsOfPolarCurves,
];
