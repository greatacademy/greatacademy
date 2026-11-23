import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { functionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import {
  bare,
  exactDiv,
  exactLatex,
  exactNumber,
  graphAltOf,
  infL,
  type LimitValue,
  lim,
  limitChoice,
  limitText,
  piLatex,
  range,
  type Side,
  type SpecialAngle,
  specialAngles,
  table,
} from "./calculus-common.ts";

// Calculus I unit 2: Limits, modules 2.2 (Estimating Limits from Graphs),
// 2.3 (The Algebra of Limits) and 2.4 (Limits of Functions).

const view = { xMin: -6, xMax: 6, yMin: -7, yMax: 7 };

/** sideWord names the side of a one-sided limit. */
const sideWord = (side: Side) => (side < 0 ? t("left", "左") : t("right", "右"));

/** piece is a line or gentle parabola through (a, y0). */
function piece(rng: Rng, a: number, y0: number): (x: number) => number {
  const m = rng.pick([-1.5, -1, -0.5, 0.5, 1, 1.5]);
  const c = rng.pick([0, 0, 0.2, -0.2]);
  return (x) => y0 + m * (x - a) + c * (x - a) ** 2;
}

/** Step is one labelled step of a solution: its title in each locale, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
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

/** fmt writes a value rounded to three decimal places, without trailing zeros. */
const fmt = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** nearX are the x-values a − 0.1, a − 0.01, a + 0.01 and a + 0.1. */
const nearX = (a: number) => [-0.1, -0.01, 0.01, 0.1].map((d) => Math.round((a + d) * 1000) / 1000);

/** nearTable tabulates f just left of a (with left) and just right of a (with right), to three decimal places. */
function nearTable(a: number, left: (x: number) => number, right: (x: number) => number = left, name = "f(x)"): string {
  const xs = nearX(a);
  return table(["$x$", ...xs.map((x) => `$${x}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(x < a ? left(x) : right(x))}$`)]);
}

/** closeTable tabulates f at a − 0.01, a − 0.001, a + 0.001 and a + 0.01, to three decimal places. */
function closeTable(a: number, f: (x: number) => number, name = "f(x)"): string {
  const xs = [-0.01, -0.001, 0.001, 0.01].map((d) => Math.round((a + d) * 1000) / 1000);
  return table(["$x$", ...xs.map((x) => `$${x}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(f(x))}$`)]);
}

/** sideTable tabulates f at a + 0.1, a + 0.01 and a + 0.001 on the given side of a (minus on the left), to three decimal places. */
function sideTable(a: number, side: Side, f: (x: number) => number, name = "f(x)"): string {
  const xs = [0.1, 0.01, 0.001].map((d) => Math.round((a + side * d) * 1000) / 1000);
  return table(["$x$", ...xs.map((x) => `$${x}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(f(x))}$`)]);
}

/** farTable tabulates f at x = 10, 100 and 1000, or at their negatives when sign is negative, to three decimal places. */
function farTable(sign: number, f: (x: number) => number, name = "f(x)"): string {
  const xs = [10, 100, 1000].map((x) => sign * x);
  return table(["$x$", ...xs.map((x) => `$${x}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(f(x))}$`)]);
}

/** limitAsk asks for a limit as a choice, as limitChoice does, and gives every wrong option that can be shown its reason. */
function limitAsk(
  rng: Rng,
  prompt: Text,
  right: LimitValue,
  wrong: readonly LimitValue[],
  solution: Text,
  reason: (v: LimitValue) => readonly [en: string, zh: string],
  figure?: Figure,
  dne = false,
): Problem {
  const problem = limitChoice(rng, prompt, right, wrong, solution, figure, dne);
  const pool: LimitValue[] = [...wrong, "inf", "-inf", ...(dne ? (["dne"] as const) : [])];
  return reasoned(
    problem,
    pool.map((v): Reason => {
      const [en, zh] = reason(v);
      return [limitText(v).en, en, zh];
    }),
  );
}

/** LimitGraph is a graph with a break at x = a: left limit L, right limit R, value f(a) (undefined when there is no point), and the two pieces drawn. */
interface LimitGraph {
  readonly a: number;
  readonly L: number;
  readonly R: number;
  readonly value: number | undefined;
  readonly figure: Figure;
  readonly left: (x: number) => number;
  readonly right: (x: number) => number;
}

/** limitGraph draws two pieces meeting x = a, with a jump when jump is set, and the value at a chosen by valueKind (0 none, 1 on the left piece, 2 on the right piece, 3 elsewhere). */
function limitGraph(rng: Rng, jump: boolean, valueKind: number): LimitGraph {
  const a = rng.int(-3, 3);
  const L = rng.int(-4, 4);
  const R = jump ? rng.pick(range(-4, 4).filter((r) => r !== L)) : L;
  const left = piece(rng, a, L);
  const right = piece(rng, a, R);
  const elsewhere = rng.pick(range(-5, 5).filter((v) => v !== L && v !== R));
  const value = valueKind === 0 ? undefined : valueKind === 1 ? L : valueKind === 2 ? R : elsewhere;
  const marks: PlaneMark[] = [
    { kind: "curve", f: left, to: a, accent: true },
    { kind: "curve", f: right, from: a, accent: true },
  ];
  if (value !== L) marks.push({ kind: "point", at: [a, L], open: true, accent: true });
  if (value !== R && R !== L) marks.push({ kind: "point", at: [a, R], open: true, accent: true });
  if (value !== undefined) marks.push({ kind: "point", at: [a, value], accent: true });
  return {
    a,
    L,
    R,
    value,
    figure: { svg: plane(view, marks), alt: graphAltOf(view, marks) },
    left,
    right,
  };
}

/** describeValue says what the graph shows at x = a. */
function describeValue(g: LimitGraph) {
  return g.value === undefined
    ? t(
        `There is no filled point at $x = ${g.a}$, so $f(${g.a})$ is not defined.`,
        `$x = ${g.a}$ 处没有实心点，所以 $f(${g.a})$ 没有定义。`,
      )
    : t(`The filled point shows $f(${g.a}) = ${g.value}$.`, `实心点表明 $f(${g.a}) = ${g.value}$。`);
}

/** theFiniteLimitOfAFunction reads limits from graphs and tables. */
export const theFiniteLimitOfAFunction: TopicDef = {
  id: "the-finite-limit-of-a-function",
  title: t("The Finite Limit of a Function", "函数的有限极限"),
  summary: t(
    "Read the limit of a function at a point from its graph or a table of values, and tell it apart from the function's value.",
    "从函数图像或数值表读出函数在一点处的极限，并把它与函数值区分开。",
  ),
  prerequisites: ["piecewise-functions"],
  encompasses: [],
  xp: 12,
  standards: [],
  intro: t(
    `A piecewise function can give a point its own value, apart from the formula around it. For example,

$$f(x) = \\begin{cases} x + 1, & x \\ne 2 \\\\ 7, & x = 2 \\end{cases}$$

has $f(2) = 7$, yet for every $x$ near $2$ the values $x + 1$ are near $3$.

Check: $f(1.99) = 2.99$ and $f(2.01) = 3.01$, both close to $3$ and far from $7$.

In this lesson we name the number the values approach, the limit, and read it from graphs and tables, keeping it apart from the value of the function at the point.`,
    `分段函数可以单独规定某一点的函数值，与它周围的式子无关。例如

$$f(x) = \\begin{cases} x + 1, & x \\ne 2 \\\\ 7, & x = 2 \\end{cases}$$

有 $f(2) = 7$，但对 $2$ 附近的每个 $x$，函数值 $x + 1$ 都接近 $3$。

检验：$f(1.99) = 2.99$，$f(2.01) = 3.01$，都接近 $3$，而离 $7$ 很远。

这节课我们给函数值所趋近的数起个名字，叫作极限；我们从图像和数值表读出极限，并把它与函数在该点的值区分开。`,
  ),
  knowledgePoints: [
    {
      id: "reading-a-limit-from-a-graph",
      figure: calculusDrawings1["the-finite-limit-of-a-function#reading-a-limit-from-a-graph"],
      title: t("Reading a limit from a graph", "从图像读出极限"),
      explanation: t(
        "$\\lim_{x \\to a} f(x) = L$ means that $f(x)$ gets as close to $L$ as we like when $x$ is close enough to $a$, but not equal to it.\n\nOn a graph, follow the curve towards $x = a$ from both sides and read the height it approaches. The point at $x = a$ itself does not matter: a hole, or a point somewhere else, does not change the limit.\n\nFor example, the graph of $y = \\frac{x^{2} - 1}{x - 1}$ is the line $y = x + 1$ with a hole at $x = 1$, and the line approaches height $2$ there, so the limit at $1$ is $2$.\n\nCheck: at $x = 0.99$ and $x = 1.01$ the heights are $1.99$ and $2.01$.\n\n> **Watch out.** Read the height, the $y$-value, not the $x$-value $a$. A filled point away from the curve gives $f(a)$, not the limit.",
        "$\\lim_{x \\to a} f(x) = L$ 表示只要 $x$ 足够接近 $a$（但不等于 $a$），$f(x)$ 就能任意接近 $L$。\n\n在图像上，从两侧沿曲线走向 $x = a$，读出曲线趋近的高度。$x = a$ 处的点本身无关紧要：空心点，或别处的一个点，都不会改变极限。\n\n例如，$y = \\frac{x^{2} - 1}{x - 1}$ 的图像是直线 $y = x + 1$ 在 $x = 1$ 处挖去一点，直线在那里趋近高度 $2$，所以在 $1$ 处的极限是 $2$。\n\n检验：$x = 0.99$ 与 $x = 1.01$ 处的高度分别是 $1.99$ 与 $2.01$。\n\n> **注意。** 要读高度，即 $y$ 值，而不是 $x$ 值 $a$。离开曲线的实心点给出的是 $f(a)$，不是极限。",
      ),
      generate(rng) {
        const g = limitGraph(rng, false, rng.pick([0, 1, 3, 3]));
        return {
          ...numberProblem({
            prompt: t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
            answer: g.L,
            wrong: [...(g.value === undefined ? [] : [g.value]), g.a, g.L + 1, g.L - 1],
            solution: walked(
              [
                [
                  ["Follow the curve from the left", "从左侧沿曲线走"],
                  t(
                    `As $x$ increases towards $${g.a}$, the curve heads to height $${g.L}$.`,
                    `当 $x$ 增大并趋近 $${g.a}$ 时，曲线趋向高度 $${g.L}$。`,
                  ),
                ],
                [
                  ["Follow the curve from the right", "从右侧沿曲线走"],
                  t(
                    `As $x$ decreases towards $${g.a}$, the curve heads to the same height $${g.L}$, so the limit is $${g.L}$.`,
                    `当 $x$ 减小并趋近 $${g.a}$ 时，曲线趋向同一高度 $${g.L}$，所以极限是 $${g.L}$。`,
                  ),
                ],
                [
                  ["Set the point aside", "不看该点本身"],
                  t(`${describeValue(g).en} The value does not affect the limit.`, `${describeValue(g)["zh-CN"]}函数值不影响极限。`),
                ],
              ],
              t(
                `Read the heights of the drawn curve just beside $x = ${g.a}$:\n\n${nearTable(g.a, g.left, g.right)}\n\nThe heights close in on $${g.L}$ from both sides.`,
                `读出所画曲线在 $x = ${g.a}$ 两旁的高度：\n\n${nearTable(g.a, g.left, g.right)}\n\n两侧的高度都逼近 $${g.L}$。`,
              ),
            ),
          }),
          figure: g.figure,
        };
      },
    },
    {
      id: "limits-and-function-values",
      title: t("Limits and function values", "极限与函数值"),
      explanation: t(
        "The limit and the value of $f$ at $a$ are different questions:\n\n- $\\lim_{x \\to a} f(x)$ is the height the curve approaches near $x = a$;\n- $f(a)$ is the height of the filled point at $x = a$.\n\nThey are equal only when the curve passes through the filled point without a break. For example, if the curve approaches height $3$ at $x = 2$ but the filled point is at $(2, 7)$, then the limit is $3$ and $f(2) = 7$.\n\nCheck: points of the curve near $x = 2$, such as $x = 1.99$ and $x = 2.01$, have heights near $3$; only the single point $x = 2$ has height $7$.\n\n> **Watch out.** An open circle is not a value of $f$. Answer the question asked: $f(a)$ asks for the filled point, the limit asks for the height the curve approaches.",
        "$f$ 在 $a$ 处的极限与函数值是两回事：\n\n- $\\lim_{x \\to a} f(x)$ 是曲线在 $x = a$ 附近趋近的高度；\n- $f(a)$ 是 $x = a$ 处实心点的高度。\n\n只有当曲线不间断地穿过这个实心点时，二者才相等。例如，若曲线在 $x = 2$ 处趋近高度 $3$，而实心点在 $(2, 7)$，则极限是 $3$，$f(2) = 7$。\n\n检验：曲线上 $x = 2$ 附近的点，如 $x = 1.99$ 与 $x = 2.01$，高度都接近 $3$；只有 $x = 2$ 这一个点的高度是 $7$。\n\n> **注意。** 空心圆不是 $f$ 的值。按所问作答：$f(a)$ 问的是实心点，极限问的是曲线趋近的高度。",
      ),
      generate(rng) {
        const g = limitGraph(rng, false, rng.pick([1, 3, 3]));
        const askValue = rng.bool();
        const value = g.value!;
        const answer = askValue ? value : g.L;
        return {
          ...numberProblem({
            prompt: askValue
              ? t(`The graph of $y = f(x)$ is shown. Find $f(${g.a})$.`, `图中是 $y = f(x)$ 的图像。求 $f(${g.a})$。`)
              : t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
            answer,
            wrong: [askValue ? g.L : value, g.a, -g.a],
            solution: walked(
              [
                [
                  ["Read the limit", "读出极限"],
                  t(
                    `The curve approaches height $${g.L}$ from both sides, so $${lim(g.a)} f(x) = ${g.L}$.`,
                    `曲线从两侧趋近高度 $${g.L}$，所以 $${lim(g.a)} f(x) = ${g.L}$。`,
                  ),
                ],
                [
                  ["Read the value", "读出函数值"],
                  t(
                    `The filled point at $x = ${g.a}$ has height $${value}$, so $f(${g.a}) = ${value}$.`,
                    `$x = ${g.a}$ 处的实心点高度为 $${value}$，所以 $f(${g.a}) = ${value}$。`,
                  ),
                ],
                [
                  ["Answer the question", "回答所问"],
                  t(
                    `The question asks for ${askValue ? `the value, $${value}$` : `the limit, $${g.L}$`}.`,
                    `题目问的是${askValue ? `函数值 $${value}$` : `极限 $${g.L}$`}。`,
                  ),
                ],
              ],
              t(
                `Read the curve just beside $x = ${g.a}$, where only the curve counts:\n\n${nearTable(g.a, g.left, g.right)}\n\nThese heights approach $${g.L}$, the limit, while the single point at $x = ${g.a}$ sits at $${value}$.`,
                `读出 $x = ${g.a}$ 两旁的曲线高度，这里只有曲线起作用：\n\n${nearTable(g.a, g.left, g.right)}\n\n这些高度趋近极限 $${g.L}$，而 $x = ${g.a}$ 这一个点的高度是 $${value}$。`,
              ),
            ),
          }),
          figure: g.figure,
        };
      },
    },
    {
      id: "estimating-a-limit-from-a-table",
      title: t("Estimating a limit from a table", "由数值表估计极限"),
      explanation: t(
        "When $f(a)$ cannot be computed, evaluate $f$ at points closer and closer to $a$ from both sides. If the values settle towards one number, that number is an estimate of the limit.\n\n| $x$ | $-0.1$ | $-0.01$ | $0.01$ | $0.1$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $\\frac{\\sin x}{x}$ | $0.99833$ | $0.99998$ | $0.99998$ | $0.99833$ |\n\nThe values approach $1$, so $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.\n\nCheck: the gap from $1$ is $0.00167$ at $x = \\pm 0.1$ and $0.00002$ at $x = \\pm 0.01$, so it shrinks towards $0$.\n\n> **Watch out.** Use the values closest to $a$ on both sides, not the value at the edge of the table. The limit is the number the values approach, not the point $a$ they are taken near.",
        "当无法计算 $f(a)$ 时，从两侧在越来越接近 $a$ 的点上计算 $f$。如果函数值稳定地趋向某个数，这个数就是极限的估计值。\n\n| $x$ | $-0.1$ | $-0.01$ | $0.01$ | $0.1$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $\\frac{\\sin x}{x}$ | $0.99833$ | $0.99998$ | $0.99998$ | $0.99833$ |\n\n函数值趋近 $1$，所以 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$。\n\n检验：与 $1$ 的差在 $x = \\pm 0.1$ 处是 $0.00167$，在 $x = \\pm 0.01$ 处是 $0.00002$，越来越接近 $0$。\n\n> **注意。** 要看两侧最接近 $a$ 的值，而不是表格边缘的值。极限是函数值趋近的数，而不是取值所靠近的点 $a$。",
      ),
      generate(rng) {
        const [k, m] = rng.pick([
          [1, 2],
          [3, 2],
          [5, 2],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [6, 5],
          [2, 1],
          [3, 1],
          [4, 1],
          [7, 2],
          [9, 4],
          [8, 5],
        ] as const);
        const a = rng.int(-3, 3);
        const family = rng.int(0, 1);
        const f = (x: number) => {
          const u = x - a;
          return family === 0 ? Math.sin(k * u) / (m * u) : (Math.exp(k * u) - 1) / (m * u);
        };
        const xs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1].map((d) => Math.round((a + d) * 1000) / 1000);
        const answer = Q.of(k, m);
        const v = (x: number) => f(x).toFixed(5);
        const gap = (x: number) => Math.abs(f(x) - answer.toNumber()).toFixed(5);
        const tableText = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...xs.map((x) => `$${v(x)}$`)]);
        const far = xs[0]!;
        const near = xs[2]!;
        return numberProblem({
          prompt: t(
            `Some values of a function $f$ near $x = ${a}$ are shown. Estimate $${lim(a)} f(x)$.\n\n${tableText}`,
            `下表给出函数 $f$ 在 $x = ${a}$ 附近的一些值。估计 $${lim(a)} f(x)$。\n\n${tableText}`,
          ),
          answer,
          ...(answer.isInteger() ? {} : { form: "decimal" as const }),
          wrong: [Q.of(Math.round(f(a + 0.1) * 100), 100), Q.of(a), Q.zero],
          solution: walked(
            [
              [
                ["Read the left side", "看左侧"],
                t(
                  `For $x < ${a}$ the values run $${v(xs[0]!)}$, $${v(xs[1]!)}$, $${v(xs[2]!)}$.`,
                  `当 $x < ${a}$ 时，函数值依次为 $${v(xs[0]!)}$、$${v(xs[1]!)}$、$${v(xs[2]!)}$。`,
                ),
              ],
              [
                ["Read the right side", "看右侧"],
                t(
                  `For $x > ${a}$, coming in from $${xs[5]}$, they run $${v(xs[5]!)}$, $${v(xs[4]!)}$, $${v(xs[3]!)}$.`,
                  `当 $x > ${a}$ 时，从 $${xs[5]}$ 向内，函数值依次为 $${v(xs[5]!)}$、$${v(xs[4]!)}$、$${v(xs[3]!)}$。`,
                ),
              ],
              [
                ["Name the common value", "得出共同趋向的值"],
                t(
                  `Both sides settle towards $${dec(answer)}$, so the limit is about $${dec(answer)}$.`,
                  `两侧都稳定地趋向 $${dec(answer)}$，所以极限约为 $${dec(answer)}$。`,
                ),
              ],
            ],
            t(
              `Measure how far the values are from $${dec(answer)}$. At $x = ${far}$ the gap is $${gap(far)}$, and at $x = ${near}$ it is $${gap(near)}$.\n\nThe gap shrinks towards $0$ as $x$ closes in on $${a}$, so $${dec(answer)}$ is the number the values approach.`,
              `看函数值离 $${dec(answer)}$ 有多远。$x = ${far}$ 处相差 $${gap(far)}$，$x = ${near}$ 处相差 $${gap(near)}$。\n\n随着 $x$ 逼近 $${a}$，差距缩小到 $0$，所以 $${dec(answer)}$ 正是函数值趋近的数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theLeftAndRightSidedLimitsOfAFunction reads one-sided limits. */
export const theLeftAndRightSidedLimitsOfAFunction: TopicDef = {
  id: "the-left-and-right-sided-limits-of-a-function",
  title: t("The Left and Right-Sided Limits of a Function", "函数的左极限与右极限"),
  summary: t("Read left- and right-sided limits from graphs and tables.", "从图像和数值表读出左极限和右极限。"),
  prerequisites: ["the-finite-limit-of-a-function"],
  encompasses: [{ topic: "the-finite-limit-of-a-function", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `The limit of $f$ at $a$ is the height its values approach as $x$ closes in on $a$. Near a jump, the two sides close in on different heights. For example,

$$f(x) = \\begin{cases} x, & x < 1 \\\\ x + 2, & x \\ge 1 \\end{cases}$$

has values near $1$ just left of $x = 1$ and values near $3$ just right of it.

Check: $f(0.99) = 0.99$, while $f(1.01) = 3.01$.

In this lesson we read the limit from each side separately, the left-sided and the right-sided limit, from graphs and from tables.`,
    `$f$ 在 $a$ 处的极限是 $x$ 逼近 $a$ 时函数值趋近的高度。在跳跃处，两侧趋近的高度不同。例如

$$f(x) = \\begin{cases} x, & x < 1 \\\\ x + 2, & x \\ge 1 \\end{cases}$$

在 $x = 1$ 的左侧附近函数值接近 $1$，在右侧附近函数值接近 $3$。

检验：$f(0.99) = 0.99$，而 $f(1.01) = 3.01$。

这节课我们分别从每一侧读出极限，即左极限与右极限，既从图像读，也从数值表读。`,
  ),
  knowledgePoints: [
    {
      id: "one-sided-limits-from-a-graph",
      figure: calculusDrawings1["the-left-and-right-sided-limits-of-a-function#one-sided-limits-from-a-graph"],
      title: t("One-sided limits from a graph", "从图像读出单侧极限"),
      explanation: t(
        "The **left-sided limit** $\\lim_{x \\to a^{-}} f(x)$ uses only $x < a$; the **right-sided limit** $\\lim_{x \\to a^{+}} f(x)$ uses only $x > a$.\n\nWhere a graph jumps at $x = a$, follow each piece to its end: the left piece ends at the left-sided limit and the right piece starts at the right-sided limit, whatever $f(a)$ is. For the function that is $x$ for $x < 1$ and $x + 2$ for $x \\ge 1$, the left-sided limit at $1$ is $1$ and the right-sided limit is $3$.\n\nCheck: $f(0.999) = 0.999$ is near $1$ and $f(1.001) = 3.001$ is near $3$.\n\n> **Watch out.** The minus sign in $a^{-}$ means from the left, through values below $a$; it does not make anything negative. The filled point at $x = a$ is $f(a)$, which need not equal either one-sided limit.",
        "**左极限** $\\lim_{x \\to a^{-}} f(x)$ 只考虑 $x < a$；**右极限** $\\lim_{x \\to a^{+}} f(x)$ 只考虑 $x > a$。\n\n若图像在 $x = a$ 处跳跃，沿每一段走到端点：左边一段的端点高度是左极限，右边一段的起点高度是右极限，与 $f(a)$ 无关。对于 $x < 1$ 时为 $x$、$x \\ge 1$ 时为 $x + 2$ 的函数，在 $1$ 处的左极限是 $1$，右极限是 $3$。\n\n检验：$f(0.999) = 0.999$ 接近 $1$，$f(1.001) = 3.001$ 接近 $3$。\n\n> **注意。** $a^{-}$ 中的负号表示从左侧，即经过小于 $a$ 的值趋近，并不让任何数变成负的。$x = a$ 处的实心点是 $f(a)$，它不一定等于任一单侧极限。",
      ),
      generate(rng) {
        const g = limitGraph(rng, true, rng.int(0, 3));
        const side = rng.pick([-1, 1] as const);
        const answer = side < 0 ? g.L : g.R;
        const other = side < 0 ? g.R : g.L;
        const w = sideWord(side);
        const f = side < 0 ? g.left : g.right;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is shown. Find $${lim(g.a, side)} f(x)$.`,
              `图中是 $y = f(x)$ 的图像。求 $${lim(g.a, side)} f(x)$。`,
            ),
            answer,
            wrong: [other, ...(g.value === undefined ? [] : [g.value]), g.a],
            solution: walked(
              [
                [
                  ["Choose the piece", "选出那一段"],
                  t(
                    `The limit is from the ${w.en}, so use only the piece of the graph with $x ${side < 0 ? "<" : ">"} ${g.a}$.`,
                    `这是${w["zh-CN"]}极限，所以只看 $x ${side < 0 ? "<" : ">"} ${g.a}$ 的那一段图像。`,
                  ),
                ],
                [
                  ["Follow it to the end", "沿它走到端点"],
                  t(
                    `Approaching $x = ${g.a}$ from the ${w.en}, that piece heads to height $${answer}$, so the limit is $${answer}$.`,
                    `从${w["zh-CN"]}侧趋近 $x = ${g.a}$ 时，这一段趋向高度 $${answer}$，所以极限是 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `Read the heights of that piece closer and closer to $x = ${g.a}$:\n\n${sideTable(g.a, side, f)}\n\nThey close in on $${answer}$. The other piece heads to $${other}$, which is the limit from the other side.`,
                `读出这一段在越来越接近 $x = ${g.a}$ 处的高度：\n\n${sideTable(g.a, side, f)}\n\n它们逼近 $${answer}$。另一段趋向 $${other}$，那是另一侧的极限。`,
              ),
            ),
          }),
          figure: g.figure,
        };
      },
    },
    {
      id: "one-sided-limits-from-a-table",
      title: t("One-sided limits from a table", "由数值表求单侧极限"),
      explanation: t(
        "A table can show different behavior on each side of $a$. Read the values for $x < a$ to estimate the left-sided limit, and those for $x > a$ for the right-sided limit. For example, if $f(1.99) = 4.99$, $f(1.999) = 4.999$, $f(2.001) = -1.999$ and $f(2.01) = -1.99$, the left-sided limit at $2$ is $5$ and the right-sided limit is $-2$.\n\nCheck: the left values miss $5$ by $0.01$ and then $0.001$, and the right values miss $-2$ by $0.01$ and then $0.001$.\n\n> **Watch out.** Use only the columns on the side the limit names. Averaging the two sides gives a number neither side approaches.",
        "数值表可能显示 $a$ 两侧的不同变化趋势。用 $x < a$ 的值估计左极限，用 $x > a$ 的值估计右极限。例如，若 $f(1.99) = 4.99$，$f(1.999) = 4.999$，$f(2.001) = -1.999$，$f(2.01) = -1.99$，则在 $2$ 处左极限是 $5$，右极限是 $-2$。\n\n检验：左侧的值与 $5$ 相差 $0.01$，然后是 $0.001$；右侧的值与 $-2$ 相差 $0.01$，然后是 $0.001$。\n\n> **注意。** 只用极限所指那一侧的列。把两侧取平均，得到的数哪一侧都不趋近。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const c = rng.int(-4, 4);
        const k = rng.nonZero(-3, 3);
        const m = rng.pick([-2, -1, 1, 2]);
        const f = (x: number) => c + k * Math.sign(x - a) + m * (x - a);
        const xs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1].map((d) => Math.round((a + d) * 1000) / 1000);
        const side = rng.pick([-1, 1] as const);
        const answer = c + side * k;
        const w = sideWord(side);
        const val = (x: number) => dec(Q.of(Math.round(f(x) * 1000), 1000));
        const tableText = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...xs.map((x) => `$${val(x)}$`)]);
        const mine = side < 0 ? [xs[0]!, xs[1]!, xs[2]!] : [xs[5]!, xs[4]!, xs[3]!];
        const gap = (x: number) => dec(Q.of(Math.round(Math.abs(f(x) - answer) * 1000), 1000));
        return numberProblem({
          prompt: t(
            `Some values of $f$ near $x = ${a}$ are shown. Estimate $${lim(a, side)} f(x)$.\n\n${tableText}`,
            `下表给出 $f$ 在 $x = ${a}$ 附近的一些值。估计 $${lim(a, side)} f(x)$。\n\n${tableText}`,
          ),
          answer,
          wrong: [c - side * k, c, a],
          solution: walked(
            [
              [
                ["Pick the columns", "选出那几列"],
                t(
                  `The limit is from the ${w.en}, so use only $x ${side < 0 ? "<" : ">"} ${a}$: the columns $${mine.join("$, $")}$.`,
                  `这是${w["zh-CN"]}极限，所以只用 $x ${side < 0 ? "<" : ">"} ${a}$ 的列：$${mine.join("$、$")}$。`,
                ),
              ],
              [
                ["Read the trend", "看趋势"],
                t(
                  `Moving towards $${a}$, the values run $${mine.map(val).join("$, $")}$, so they approach $${answer}$.`,
                  `向 $${a}$ 靠近时，函数值依次为 $${mine.map(val).join("$、$")}$，所以趋近 $${answer}$。`,
                ),
              ],
            ],
            t(
              `Measure the gap between each value and $${answer}$: it is $${gap(mine[0]!)}$, then $${gap(mine[1]!)}$, then $${gap(mine[2]!)}$.\n\nThe gap shrinks by a factor of ten each time $x$ gets ten times closer, so the values on this side approach $${answer}$.`,
              `量出每个值与 $${answer}$ 的差：依次为 $${gap(mine[0]!)}$、$${gap(mine[1]!)}$、$${gap(mine[2]!)}$。\n\n$x$ 每靠近十倍，差距就缩小十倍，所以这一侧的函数值趋近 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** findingTheExistenceOfALimitUsingOneSidedLimits decides whether a two-sided limit exists. */
export const findingTheExistenceOfALimitUsingOneSidedLimits: TopicDef = {
  id: "finding-the-existence-of-a-limit-using-one-sided-limits",
  title: t("Finding the Existence of a Limit Using One-Sided Limits", "用单侧极限判断极限是否存在"),
  summary: t("Decide whether a limit exists by comparing the left- and right-sided limits.", "比较左极限与右极限，判断极限是否存在。"),
  prerequisites: ["the-left-and-right-sided-limits-of-a-function"],
  encompasses: [{ topic: "the-left-and-right-sided-limits-of-a-function", weight: 0.6 }],
  xp: 10,
  standards: [],
  intro: t(
    `The left-sided limit uses only $x < a$ and the right-sided limit only $x > a$. For example, with

$$f(x) = \\begin{cases} x, & x < 1 \\\\ x + 2, & x \\ge 1 \\end{cases}$$

the left-sided limit at $1$ is $1$ and the right-sided limit is $3$, so no single height is approached from both sides.

Check: $f(0.99) = 0.99$ and $f(1.01) = 3.01$ are about $2$ apart, however close to $1$ we go.

In this lesson we decide whether the two-sided limit exists by comparing the one-sided limits, from graphs and from given values.`,
    `左极限只考虑 $x < a$，右极限只考虑 $x > a$。例如，对于

$$f(x) = \\begin{cases} x, & x < 1 \\\\ x + 2, & x \\ge 1 \\end{cases}$$

在 $1$ 处左极限是 $1$，右极限是 $3$，所以没有一个高度能从两侧同时趋近。

检验：$f(0.99) = 0.99$ 与 $f(1.01) = 3.01$ 相差约 $2$，无论离 $1$ 多近都是这样。

这节课我们比较两个单侧极限，判断双侧极限是否存在，既从图像判断，也从给定的值判断。`,
  ),
  knowledgePoints: [
    {
      id: "existence-of-a-limit-from-a-graph",
      figure: calculusDrawings1["finding-the-existence-of-a-limit-using-one-sided-limits#existence-of-a-limit-from-a-graph"],
      title: t("Existence of a limit from a graph", "由图像判断极限是否存在"),
      explanation: t(
        "$\\lim_{x \\to a} f(x)$ exists exactly when both one-sided limits exist and are equal; then it is their common value.\n\nIf the graph jumps at $x = a$, the one-sided limits differ and the limit **does not exist**. If both pieces head to the same height, the limit is that height, even when the point at $x = a$ is missing or sits elsewhere.\n\nCheck: for a jump from height $1$ to height $3$, the values just left of $a$ stay near $1$ and those just right stay near $3$, so no one number is near both.\n\n> **Watch out.** A filled point at $x = a$ does not decide the limit; only the two sides do. Do not average the two one-sided limits.",
        "当且仅当两个单侧极限都存在且相等时，$\\lim_{x \\to a} f(x)$ 存在，且等于它们的公共值。\n\n若图像在 $x = a$ 处跳跃，两个单侧极限不相等，极限**不存在**。若两段趋向同一高度，极限就是这个高度，即使 $x = a$ 处没有点或点在别处。\n\n检验：对于从高度 $1$ 跳到高度 $3$ 的跳跃，紧靠 $a$ 左侧的值都接近 $1$，右侧的值都接近 $3$，所以没有一个数同时接近两者。\n\n> **注意。** $x = a$ 处的实心点不决定极限，只有两侧才决定。不要把两个单侧极限取平均。",
      ),
      generate(rng) {
        const jump = rng.bool();
        const g = limitGraph(rng, jump, rng.int(0, 3));
        const right: LimitValue = jump ? "dne" : Q.of(g.L);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return [
              `Both pieces head to height $${g.L}$, so the one-sided limits agree and the limit exists.`,
              `两段都趋向高度 $${g.L}$，两个单侧极限相等，所以极限存在。`,
            ];
          if (v === "inf" || v === "-inf")
            return [
              `The graph stays near finite heights next to $x = ${g.a}$; it does not ${v === "inf" ? "rise" : "fall"} without bound.`,
              `在 $x = ${g.a}$ 旁图像保持在有限的高度附近，并没有无界${v === "inf" ? "上升" : "下降"}。`,
            ];
          const n = v.toNumber();
          if (jump && n === g.L)
            return [
              `This is only the left-sided limit; from the right the graph heads to $${g.R}$.`,
              `这只是左极限；从右侧看图像趋向 $${g.R}$。`,
            ];
          if (jump && n === g.R)
            return [
              `This is only the right-sided limit; from the left the graph heads to $${g.L}$.`,
              `这只是右极限；从左侧看图像趋向 $${g.L}$。`,
            ];
          if (n === g.value)
            return [
              `This is $f(${g.a})$, the height of the filled point, which does not decide the limit.`,
              `这是实心点的高度 $f(${g.a})$，它不决定极限。`,
            ];
          return [`This is the $x$-value $${g.a}$, not a height the graph approaches.`, `这是 $x$ 值 $${g.a}$，不是图像趋近的高度。`];
        };
        return limitAsk(
          rng,
          t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
          right,
          [Q.of(g.L), Q.of(g.R), ...(g.value === undefined ? [] : [Q.of(g.value)]), Q.of(g.a)],
          walked(
            [
              [
                ["Read the left-sided limit", "读出左极限"],
                t(`From the left the curve heads to height $${g.L}$:`, `从左侧看，曲线趋向高度 $${g.L}$：`),
                [`${lim(g.a, -1)} f(x) = ${g.L}`],
              ],
              [
                ["Read the right-sided limit", "读出右极限"],
                t(`From the right the curve heads to height $${g.R}$:`, `从右侧看，曲线趋向高度 $${g.R}$：`),
                [`${lim(g.a, 1)} f(x) = ${g.R}`],
              ],
              [
                ["Compare", "比较"],
                jump
                  ? t(`The one-sided limits differ, so the limit does not exist.`, `两个单侧极限不相等，所以极限不存在。`)
                  : t(
                      `The one-sided limits agree, so $${lim(g.a)} f(x) = ${g.L}$. ${describeValue(g).en}`,
                      `两个单侧极限相等，所以 $${lim(g.a)} f(x) = ${g.L}$。${describeValue(g)["zh-CN"]}`,
                    ),
              ],
            ],
            t(
              `Read the heights of the drawn curve just beside $x = ${g.a}$:\n\n${nearTable(g.a, g.left, g.right)}\n\n${jump ? `The left values stay near $${g.L}$ and the right values near $${g.R}$, so no single number is approached from both sides.` : `Both sides close in on $${g.L}$.`}`,
              `读出所画曲线在 $x = ${g.a}$ 两旁的高度：\n\n${nearTable(g.a, g.left, g.right)}\n\n${jump ? `左侧的值保持在 $${g.L}$ 附近，右侧的值保持在 $${g.R}$ 附近，所以没有一个数能从两侧同时趋近。` : `两侧都逼近 $${g.L}$。`}`,
            ),
          ),
          reason,
          g.figure,
          true,
        );
      },
    },
    {
      id: "existence-of-a-limit-from-one-sided-limits",
      title: t("Existence of a limit from one-sided limits", "由单侧极限判断极限是否存在"),
      explanation: t(
        "Given the one-sided limits, compare them. If $\\lim_{x \\to 2^{-}} f(x) = 5$ and $\\lim_{x \\to 2^{+}} f(x) = 5$, then $\\lim_{x \\to 2} f(x) = 5$, even if $f(2) = 1$ or $f(2)$ is not defined.\n\nCheck: every $x$ close to $2$, on either side, has $f(x)$ close to $5$; the limit never looks at $x = 2$ itself.\n\n> **Watch out.** When the one-sided limits differ, the limit does not exist, and it is not their average. The value $f(a)$ plays no part either way.",
        "已知两个单侧极限时，比较它们。若 $\\lim_{x \\to 2^{-}} f(x) = 5$ 且 $\\lim_{x \\to 2^{+}} f(x) = 5$，则 $\\lim_{x \\to 2} f(x) = 5$，即使 $f(2) = 1$ 或 $f(2)$ 没有定义。\n\n检验：$2$ 附近的每个 $x$，无论在哪一侧，$f(x)$ 都接近 $5$；极限从不考虑 $x = 2$ 本身。\n\n> **注意。** 单侧极限不相等时，极限不存在，也不等于它们的平均值。无论哪种情况，函数值 $f(a)$ 都不起作用。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const L = rng.int(-9, 9);
        const equal = rng.bool();
        const R = equal ? L : rng.pick(range(-9, 9).filter((r) => r !== L));
        const v = rng.pick(range(-9, 9).filter((r) => r !== L));
        const facts = `$$${lim(a, -1)} f(x) = ${L}, \\quad ${lim(a, 1)} f(x) = ${R}, \\quad f(${a}) = ${v}$$`;
        const reason = (x: LimitValue): readonly [string, string] => {
          if (x === "dne") return [`The one-sided limits are both $${L}$, so the limit exists.`, `两个单侧极限都是 $${L}$，所以极限存在。`];
          if (x === "inf" || x === "-inf")
            return [
              `Both one-sided limits are finite numbers, so the limit is not ${x === "inf" ? "$\\infty$" : "$-\\infty$"}.`,
              `两个单侧极限都是有限数，所以极限不是 ${x === "inf" ? "$\\infty$" : "$-\\infty$"}。`,
            ];
          const n = x.toNumber();
          if (n === v && n !== R) return [`This is $f(${a})$, which plays no part in the limit.`, `这是 $f(${a})$，它与极限无关。`];
          if (n === L) return [`This is only the left-sided limit; the right-sided limit is $${R}$.`, `这只是左极限；右极限是 $${R}$。`];
          return [`This is only the right-sided limit; the left-sided limit is $${L}$.`, `这只是右极限；左极限是 $${L}$。`];
        };
        return limitAsk(
          rng,
          t(`A function $f$ satisfies ${facts} Find $${lim(a)} f(x)$.`, `函数 $f$ 满足 ${facts} 求 $${lim(a)} f(x)$。`),
          equal ? Q.of(L) : "dne",
          [Q.of(v), Q.of(L), Q.of(R)],
          walked(
            [
              [
                ["Compare the one-sided limits", "比较单侧极限"],
                equal
                  ? t(
                      `The left- and right-sided limits are both $${L}$, so the limit is $${L}$.`,
                      `左极限与右极限都是 $${L}$，所以极限是 $${L}$。`,
                    )
                  : t(
                      `The left-sided limit is $${L}$ and the right-sided limit is $${R}$. They differ, so the limit does not exist.`,
                      `左极限是 $${L}$，右极限是 $${R}$。二者不相等，所以极限不存在。`,
                    ),
              ],
              [
                ["Set the value aside", "不看函数值"],
                t(
                  `The value $f(${a}) = ${v}$ plays no part, because the limit only uses $x \\ne ${a}$.`,
                  `函数值 $f(${a}) = ${v}$ 不起作用，因为极限只考虑 $x \\ne ${a}$。`,
                ),
              ],
            ],
            equal
              ? t(
                  `Go back to what the limit asks. Every $x$ close to $${a}$ but not equal to it lies on one side or the other, and on both sides $f(x)$ is close to $${L}$.\n\nSo $f(x)$ is close to $${L}$ for all such $x$, which is exactly the statement that the limit is $${L}$.`,
                  `回到极限的含义。每个接近 $${a}$ 但不等于 $${a}$ 的 $x$ 都在某一侧，而两侧的 $f(x)$ 都接近 $${L}$。\n\n所以对所有这样的 $x$，$f(x)$ 都接近 $${L}$，这正是"极限为 $${L}$"的意思。`,
                )
              : t(
                  `Suppose the limit were some number $M$. Then $f(x)$ would be close to $M$ on both sides of $${a}$, so $M$ would be close to both $${L}$ and $${R}$.\n\nThese are $${Math.abs(L - R)}$ apart, so no number is close to both, and the limit cannot exist.`,
                  `假设极限是某个数 $M$。那么在 $${a}$ 两侧 $f(x)$ 都接近 $M$，于是 $M$ 同时接近 $${L}$ 与 $${R}$。\n\n这两个数相差 $${Math.abs(L - R)}$，没有一个数能同时接近两者，所以极限不可能存在。`,
                ),
          ),
          reason,
          undefined,
          true,
        );
      },
    },
  ],
};

/** limitsAtInfinityFromGraphs reads limits at ±∞ from graphs and tables. */
export const limitsAtInfinityFromGraphs: TopicDef = {
  id: "limits-at-infinity-from-graphs",
  title: t("Limits at Infinity from Graphs", "从图像读出无穷远处的极限"),
  summary: t(
    "Read limits as x → ∞ and x → −∞ from graphs with horizontal asymptotes, and estimate them from tables.",
    "从有水平渐近线的图像读出 x → ∞ 和 x → −∞ 时的极限，并由数值表估计它们。",
  ),
  prerequisites: ["the-finite-limit-of-a-function", "end-behavior"],
  encompasses: [
    { topic: "the-finite-limit-of-a-function", weight: 0.3 },
    { topic: "end-behavior", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `A limit at a point reads the height that $f(x)$ approaches as $x$ closes in on a number. The same idea works as $x$ grows without bound. For example, the values of

$$f(x) = 2 + \\frac{1}{x}$$

get closer and closer to $2$ as $x$ gets large, because $\\frac{1}{x}$ shrinks towards $0$.

Check: $f(10) = 2.1$, $f(100) = 2.01$ and $f(1000) = 2.001$.

In this lesson we read limits as $x \\to \\infty$ and $x \\to -\\infty$ from graphs that level off towards a horizontal line, and estimate them from tables.`,
    `点处的极限读的是 $x$ 逼近某个数时 $f(x)$ 趋近的高度。同样的想法也适用于 $x$ 无界增大的情形。例如

$$f(x) = 2 + \\frac{1}{x}$$

的值随 $x$ 变大越来越接近 $2$，因为 $\\frac{1}{x}$ 缩小到 $0$。

检验：$f(10) = 2.1$，$f(100) = 2.01$，$f(1000) = 2.001$。

这节课我们从逐渐趋于一条水平直线的图像读出 $x \\to \\infty$ 与 $x \\to -\\infty$ 时的极限，并由数值表估计它们。`,
  ),
  knowledgePoints: [
    {
      id: "limits-at-infinity-from-a-graph",
      figure: calculusDrawings1["limits-at-infinity-from-graphs#limits-at-infinity-from-a-graph"],
      title: t("Limits at infinity from a graph", "从图像读出无穷远处的极限"),
      explanation: t(
        "$\\lim_{x \\to \\infty} f(x) = L$ means that $f(x)$ approaches $L$ as $x$ grows without bound; the graph levels off towards the horizontal line $y = L$, a **horizontal asymptote**. The limit as $x \\to -\\infty$ is read at the far left, and can be different. For $y = 2 + \\frac{1}{x}$, both ends level off towards $y = 2$.\n\nCheck: $2 + \\frac{1}{1000} = 2.001$ and $2 + \\frac{1}{-1000} = 1.999$, both close to $2$.\n\n> **Watch out.** Read the far end the limit names: $x \\to \\infty$ is the far right and $x \\to -\\infty$ the far left. A vertical asymptote in the middle has nothing to do with these limits.",
        "$\\lim_{x \\to \\infty} f(x) = L$ 表示当 $x$ 无界增大时 $f(x)$ 趋近 $L$；图像逐渐趋于水平直线 $y = L$，即**水平渐近线**。$x \\to -\\infty$ 时的极限在图像最左端读取，可能与之不同。对于 $y = 2 + \\frac{1}{x}$，两端都逐渐趋于 $y = 2$。\n\n检验：$2 + \\frac{1}{1000} = 2.001$，$2 + \\frac{1}{-1000} = 1.999$，都接近 $2$。\n\n> **注意。** 要看极限所指的那一端：$x \\to \\infty$ 是最右端，$x \\to -\\infty$ 是最左端。中间的竖直渐近线与这些极限无关。",
      ),
      generate(rng) {
        const toPlus = rng.bool();
        const h = rng.int(-2, 2);
        let f: (x: number) => number;
        let left: number;
        let rightL: number;
        if (rng.bool()) {
          const c = rng.int(-4, 4);
          const k = rng.pick([-3, -2, -1, 1, 2, 3]);
          f = (x) => c + k / (x - h);
          left = c;
          rightL = c;
        } else {
          const m = rng.int(-3, 3);
          const d = rng.pick([-3, -2, -1, 1, 2, 3]);
          f = (x) => m + d * Math.tanh((x - h) / 1.5);
          left = m - d;
          rightL = m + d;
        }
        const answer = toPlus ? rightL : left;
        const target = toPlus ? "\\infty" : "-\\infty";
        const sign = toPlus ? 1 : -1;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is shown. Find $${lim(target)} f(x)$.`,
              `图中是 $y = f(x)$ 的图像。求 $${lim(target)} f(x)$。`,
            ),
            answer,
            wrong: [toPlus ? left : rightL, h, 0, -answer],
            solution: walked(
              [
                [
                  ["Go to the far end", "走到远端"],
                  t(
                    `The limit is as $x \\to ${target}$, so look at the far ${toPlus ? "right" : "left"} of the graph.`,
                    `极限是 $x \\to ${target}$，所以看图像的最${toPlus ? "右" : "左"}端。`,
                  ),
                ],
                [
                  ["Read the level", "读出水平高度"],
                  t(
                    `There the graph levels off towards the line $y = ${answer}$, so the limit is $${answer}$.`,
                    `那里图像逐渐趋于直线 $y = ${answer}$，所以极限是 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `Read the heights of the drawn curve further and further ${toPlus ? "right" : "left"}:\n\n${farTable(sign, f)}\n\nThey close in on $${answer}$.`,
                `读出所画曲线越来越靠${toPlus ? "右" : "左"}处的高度：\n\n${farTable(sign, f)}\n\n它们逼近 $${answer}$。`,
              ),
            ),
          }),
          figure: {
            svg: plane({ xMin: -9, xMax: 9, yMin: -7, yMax: 7 }, [{ kind: "curve", f, accent: true }]),
            alt: graphAltOf({ xMin: -9, xMax: 9, yMin: -7, yMax: 7 }, [{ kind: "curve", f }]),
          },
        };
      },
    },
    {
      id: "limits-at-infinity-from-a-table",
      title: t("Limits at infinity from a table", "由数值表估计无穷远处的极限"),
      explanation: t(
        "To estimate $\\lim_{x \\to \\infty} f(x)$, evaluate $f$ at larger and larger $x$: $10, 100, 1000, \\ldots$ If the values settle towards a number, that number is the limit. For $f(x) = \\frac{3x + 1}{x}$ the values at $10$, $100$ and $1000$ are $3.1$, $3.01$ and $3.001$, so the limit is $3$.\n\nCheck: the gap from $3$ is $0.1$, then $0.01$, then $0.001$, shrinking towards $0$.\n\n> **Watch out.** The limit is the number the values settle towards, not the first value in the table. For $x \\to -\\infty$, use $-10, -100, -1000, \\ldots$",
        "估计 $\\lim_{x \\to \\infty} f(x)$ 时，在越来越大的 $x$ 处计算 $f$：$10, 100, 1000, \\ldots$ 如果函数值稳定地趋向某个数，这个数就是极限。对于 $f(x) = \\frac{3x + 1}{x}$，在 $10$、$100$、$1000$ 处的值分别为 $3.1$、$3.01$、$3.001$，所以极限是 $3$。\n\n检验：与 $3$ 的差依次为 $0.1$、$0.01$、$0.001$，缩小到 $0$。\n\n> **注意。** 极限是函数值稳定趋向的数，而不是表中的第一个值。求 $x \\to -\\infty$ 的极限时，用 $-10, -100, -1000, \\ldots$",
      ),
      generate(rng) {
        const p = rng.nonZero(-6, 6);
        const q = rng.nonZero(-9, 9);
        const r = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5].filter((v) => p * v !== q));
        const sign = rng.pick([1, -1] as const);
        const f = (x: number) => (p * x + q) / (x + r);
        const xs = [10, 100, 1000, 10000, 100000].map((x) => sign * x);
        const target = sign > 0 ? "\\infty" : "-\\infty";
        const v = (x: number) => f(x).toFixed(5);
        const gap = (x: number) => Math.abs(f(x) - p).toFixed(5);
        const tableText = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...xs.map((x) => `$${v(x)}$`)]);
        return numberProblem({
          prompt: t(
            `Some values of $f$ are shown. Estimate $${lim(target)} f(x)$.\n\n${tableText}`,
            `下表给出 $f$ 的一些值。估计 $${lim(target)} f(x)$。\n\n${tableText}`,
          ),
          answer: p,
          wrong: [Q.of(Math.round(f(xs[0]!) * 10), 10), Q.zero, Q.of(-p)],
          solution: walked(
            [
              [
                ["Read the trend", "看趋势"],
                t(
                  `As $x \\to ${target}$, the values run $${xs.map(v).join("$, $")}$.`,
                  `当 $x \\to ${target}$ 时，函数值依次为 $${xs.map(v).join("$、$")}$。`,
                ),
              ],
              [
                ["Name the limit", "得出极限"],
                t(`They settle towards $${p}$, so the limit is $${p}$.`, `它们稳定地趋向 $${p}$，所以极限是 $${p}$。`),
              ],
            ],
            t(
              `Measure the gap between each value and $${p}$: at $x = ${xs[0]}$ it is $${gap(xs[0]!)}$, and at $x = ${xs[4]}$ it is $${gap(xs[4]!)}$.\n\nThe gap shrinks towards $0$ as $x$ moves out, so $${p}$ is the number the values approach.`,
              `量出每个值与 $${p}$ 的差：$x = ${xs[0]}$ 处是 $${gap(xs[0]!)}$，$x = ${xs[4]}$ 处是 $${gap(xs[4]!)}$。\n\n随着 $x$ 向外走，差距缩小到 $0$，所以 $${p}$ 正是函数值趋近的数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** infiniteLimitsFromGraphs reads infinite limits at vertical asymptotes from graphs. */
export const infiniteLimitsFromGraphs: TopicDef = {
  id: "infinite-limits-from-graphs",
  title: t("Infinite Limits from Graphs", "从图像读出无穷极限"),
  summary: t(
    "Read one-sided and two-sided infinite limits at a vertical asymptote from a graph.",
    "从图像读出函数在竖直渐近线处的单侧和双侧无穷极限。",
  ),
  prerequisites: ["the-left-and-right-sided-limits-of-a-function", "unbounded-behavior-of-functions-near-a-point"],
  encompasses: [
    { topic: "the-left-and-right-sided-limits-of-a-function", weight: 0.3 },
    { topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `One-sided limits read what $f(x)$ does as $x$ closes in on $a$ from each side. Near a vertical asymptote the values do not settle at all: they grow or fall without bound. For example,

$$f(x) = \\frac{1}{x - 2}$$

is large and positive just right of $x = 2$ and large and negative just left of it.

Check: $f(2.01) = 100$ and $f(1.99) = -100$, and $f(2.001) = 1000$.

In this lesson we read such behavior as the infinite limits $\\infty$ and $-\\infty$, from each side and from both sides, on graphs with vertical asymptotes.`,
    `单侧极限描述 $x$ 从每一侧逼近 $a$ 时 $f(x)$ 的变化。在竖直渐近线附近，函数值根本不会稳定下来：它们无界地增大或减小。例如

$$f(x) = \\frac{1}{x - 2}$$

在 $x = 2$ 右侧附近取很大的正值，在左侧附近取很大的负值。

检验：$f(2.01) = 100$，$f(1.99) = -100$，$f(2.001) = 1000$。

这节课我们在有竖直渐近线的图像上，把这种变化读作无穷极限 $\\infty$ 与 $-\\infty$，分单侧和双侧来读。`,
  ),
  knowledgePoints: [
    {
      id: "infinite-limits-from-a-graph",
      figure: calculusDrawings1["infinite-limits-from-graphs#infinite-limits-from-a-graph"],
      title: t("Infinite limits from a graph", "从图像读出无穷极限"),
      explanation: t(
        "If $f(x)$ grows without bound as $x \\to a^{+}$, we write $\\lim_{x \\to a^{+}} f(x) = \\infty$; if it falls without bound, $-\\infty$. The line $x = a$ is a **vertical asymptote**.\n\nThe two-sided limit is $\\infty$ (or $-\\infty$) only if both sides go the same way; if one side rises and the other falls, it does not exist. For $y = \\frac{1}{(x - 2)^{2}}$ both sides rise, so the limit at $2$ is $\\infty$.\n\nCheck: at $x = 1.99$ and $x = 2.01$ the values are both $10000$, and closer in they are larger still.\n\n> **Watch out.** Writing $\\infty$ records how the limit fails to be a number; it is not the height of any point. The horizontal level the graph approaches far away is a different limit.",
        "若 $x \\to a^{+}$ 时 $f(x)$ 无界增大，记作 $\\lim_{x \\to a^{+}} f(x) = \\infty$；若无界减小，则为 $-\\infty$。直线 $x = a$ 是**竖直渐近线**。\n\n只有两侧趋势相同时，双侧极限才是 $\\infty$（或 $-\\infty$）；若一侧上升、一侧下降，极限不存在。对于 $y = \\frac{1}{(x - 2)^{2}}$，两侧都上升，所以在 $2$ 处的极限是 $\\infty$。\n\n检验：$x = 1.99$ 与 $x = 2.01$ 处的值都是 $10000$，再靠近还会更大。\n\n> **注意。** 写 $\\infty$ 记录的是极限以何种方式不成为一个数，它不是任何点的高度。图像在远处趋近的水平高度是另一个极限。",
      ),
      generate(rng) {
        const h = rng.int(-3, 3);
        const c = rng.int(-2, 2);
        const k = rng.pick([-2, -1, 1, 2]);
        const even = rng.bool();
        const f = (x: number) => c + k / (x - h) ** (even ? 2 : 1);
        const leftSign = even ? Math.sign(k) : -Math.sign(k);
        const rightSign = Math.sign(k);
        const side = rng.pick([-1, 1, 0] as const);
        const toInf = (s: number): LimitValue => (s > 0 ? "inf" : "-inf");
        const answer: LimitValue =
          side < 0 ? toInf(leftSign) : side > 0 ? toInf(rightSign) : leftSign === rightSign ? toInf(leftSign) : "dne";
        const operator = side === 0 ? lim(h) : lim(h, side);
        return limitAsk(
          rng,
          t(`The graph of $y = f(x)$ is shown. Find $${operator} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${operator} f(x)$。`),
          answer,
          [Q.of(c), Q.of(h)],
          walked(
            [
              [
                ["Read the left side", "看左侧"],
                t(
                  `Just left of $x = ${h}$ the graph ${leftSign > 0 ? "rises" : "falls"} without bound:`,
                  `紧靠 $x = ${h}$ 左侧，图像无界${leftSign > 0 ? "上升" : "下降"}：`,
                ),
                [`${lim(h, -1)} f(x) = ${infL(leftSign)}`],
              ],
              [
                ["Read the right side", "看右侧"],
                t(
                  `Just right of $x = ${h}$ the graph ${rightSign > 0 ? "rises" : "falls"} without bound:`,
                  `紧靠 $x = ${h}$ 右侧，图像无界${rightSign > 0 ? "上升" : "下降"}：`,
                ),
                [`${lim(h, 1)} f(x) = ${infL(rightSign)}`],
              ],
              [
                ["Answer the question", "回答所问"],
                side !== 0
                  ? t(
                      `The question asks for the ${side < 0 ? "left" : "right"}-sided limit, which is $${infL(side < 0 ? leftSign : rightSign)}$.`,
                      `题目问的是${side < 0 ? "左" : "右"}极限，它是 $${infL(side < 0 ? leftSign : rightSign)}$。`,
                    )
                  : answer === "dne"
                    ? t(`The sides disagree, so the two-sided limit does not exist.`, `两侧不一致，所以双侧极限不存在。`)
                    : t(`Both sides agree, so the limit is $${infL(leftSign)}$.`, `两侧一致，所以极限是 $${infL(leftSign)}$。`),
              ],
            ],
            t(
              `Read the heights of the drawn curve closer and closer to $x = ${h}$:\n\n${nearTable(h, f)}\n\nThe values ${even ? "keep the same sign on both sides" : "have opposite signs on the two sides"} and grow in size as $x$ closes in, as the asymptote suggests.`,
              `读出所画曲线越来越接近 $x = ${h}$ 处的高度：\n\n${nearTable(h, f)}\n\n随着 $x$ 逼近，函数值${even ? "在两侧符号相同" : "在两侧符号相反"}，绝对值越来越大，与渐近线所示一致。`,
            ),
          ),
          (v) => {
            if (v === "dne")
              return side === 0
                ? [
                    `Both sides ${leftSign > 0 ? "rise" : "fall"} without bound, so the limit is $${infL(leftSign)}$.`,
                    `两侧都无界${leftSign > 0 ? "上升" : "下降"}，所以极限是 $${infL(leftSign)}$。`,
                  ]
                : [
                    `From one side the graph does one definite thing, so this one-sided limit is $\\infty$ or $-\\infty$.`,
                    `从一侧看图像有确定的趋势，所以这个单侧极限是 $\\infty$ 或 $-\\infty$。`,
                  ];
            if (v === "inf" || v === "-inf") {
              const s = v === "inf" ? 1 : -1;
              if (side === 0 && leftSign !== rightSign)
                return [
                  `Only one side ${s > 0 ? "rises" : "falls"} without bound; the other side ${s > 0 ? "falls" : "rises"}, so the two-sided limit does not exist.`,
                  `只有一侧无界${s > 0 ? "上升" : "下降"}，另一侧无界${s > 0 ? "下降" : "上升"}，所以双侧极限不存在。`,
                ];
              return [
                `On the side asked for, the graph ${s > 0 ? "falls" : "rises"} without bound, not ${s > 0 ? "rises" : "falls"}.`,
                `在所问的那一侧，图像无界${s > 0 ? "下降" : "上升"}，而不是${s > 0 ? "上升" : "下降"}。`,
              ];
            }
            if (v.toNumber() === c)
              return [
                `$${c}$ is the level the graph approaches far from the asymptote, not its behavior next to $x = ${h}$.`,
                `$${c}$ 是图像远离渐近线时趋近的高度，而不是它在 $x = ${h}$ 旁的变化。`,
              ];
            return [
              `$${h}$ is where the asymptote is, an $x$-value; near it the values are unbounded.`,
              `$${h}$ 是渐近线的位置，是一个 $x$ 值；在它附近函数值是无界的。`,
            ];
          },
          {
            svg: plane(view, [
              { kind: "line", a: [h, 0], b: [h, 1], dashed: true },
              { kind: "curve", f, accent: true },
            ]),
            alt: t("The graph of y = f(x) with a vertical asymptote.", "有竖直渐近线的 y = f(x) 的图像。"),
          },
          true,
        );
      },
    },
    {
      id: "graphs-with-two-vertical-asymptotes",
      figure: calculusDrawings1["infinite-limits-from-graphs#graphs-with-two-vertical-asymptotes"],
      title: t("Graphs with two vertical asymptotes", "有两条竖直渐近线的图像"),
      explanation: t(
        "A graph can have several vertical asymptotes, and the behavior near each one is read separately. First find the dashed line at the point the limit approaches; then look only at the part of the graph next to it on the side the limit names:\n\n- the graph shooting up gives $\\infty$, shooting down gives $-\\infty$;\n- for a two-sided limit, both sides must go the same way, otherwise the limit does not exist.\n\nWhat the graph does near the other asymptote, or far away, has no bearing on the limit. For $y = \\frac{1}{x + 1} + \\frac{1}{x - 3}$, just right of $x = 3$ the second term is huge and positive while the first is about $\\frac{1}{4}$, so the right-sided limit at $3$ is $\\infty$.\n\nCheck: at $x = 3.01$ the value is about $0.25 + 100 = 100.25$.\n\n> **Watch out.** Use the asymptote at the point the limit names. The graph near the other asymptote can rise where this one falls.",
        "一个图像可以有几条竖直渐近线，每条渐近线附近的行为要分别读出。先找出极限所趋向的那个点处的虚线，再只看虚线旁、极限所指那一侧的图像：\n\n- 图像向上无限延伸为 $\\infty$，向下无限延伸为 $-\\infty$；\n- 对于双侧极限，两侧必须同向，否则极限不存在。\n\n图像在另一条渐近线附近或远处的表现，与这个极限无关。对于 $y = \\frac{1}{x + 1} + \\frac{1}{x - 3}$，紧靠 $x = 3$ 右侧，第二项是很大的正数，而第一项约为 $\\frac{1}{4}$，所以在 $3$ 处的右极限是 $\\infty$。\n\n检验：$x = 3.01$ 处的值约为 $0.25 + 100 = 100.25$。\n\n> **注意。** 要用极限所指那个点处的渐近线。另一条渐近线附近的图像可能在这里下降时上升。",
      ),
      generate(rng) {
        const h1 = rng.int(-4, -1);
        const h2 = h1 + rng.int(3, 5);
        const c = rng.int(-2, 2);
        const k1 = rng.pick([-1, 1]);
        const k2 = rng.pick([-1, 1]);
        const e1 = rng.pick([1, 2]);
        const e2 = rng.pick([1, 2]);
        const f = (x: number) => c + k1 / (x - h1) ** e1 + k2 / (x - h2) ** e2;
        const first = rng.bool();
        const [h, k, e] = first ? [h1, k1, e1] : [h2, k2, e2];
        const other = first ? h2 : h1;
        const leftSign = e === 2 ? k : -k;
        const rightSign = k;
        const side = rng.pick([-1, 1, 0] as const);
        const toInf = (s: number): LimitValue => (s > 0 ? "inf" : "-inf");
        const answer: LimitValue =
          side < 0 ? toInf(leftSign) : side > 0 ? toInf(rightSign) : leftSign === rightSign ? toInf(leftSign) : "dne";
        const operator = side === 0 ? lim(h) : lim(h, side);
        return limitAsk(
          rng,
          t(
            `The graph of $y = f(x)$ has vertical asymptotes at $x = ${h1}$ and $x = ${h2}$. Find $${operator} f(x)$.`,
            `$y = f(x)$ 的图像在 $x = ${h1}$ 和 $x = ${h2}$ 处有竖直渐近线。求 $${operator} f(x)$。`,
          ),
          answer,
          [Q.of(c), Q.of(h)],
          walked(
            [
              [
                ["Pick the asymptote", "选出渐近线"],
                t(
                  `The limit is at $x = ${h}$, so look only at the dashed line $x = ${h}$ and ignore the one at $x = ${other}$.`,
                  `极限在 $x = ${h}$ 处，所以只看虚线 $x = ${h}$，不管 $x = ${other}$ 处那一条。`,
                ),
              ],
              [
                ["Read both sides", "读两侧"],
                t(
                  `Just left of it the graph ${leftSign > 0 ? "rises" : "falls"} without bound, and just right of it the graph ${rightSign > 0 ? "rises" : "falls"} without bound:`,
                  `紧靠它的左侧，图像无界${leftSign > 0 ? "上升" : "下降"}；紧靠它的右侧，图像无界${rightSign > 0 ? "上升" : "下降"}：`,
                ),
                [`${lim(h, -1)} f(x) = ${infL(leftSign)}, \\qquad ${lim(h, 1)} f(x) = ${infL(rightSign)}`],
              ],
              [
                ["Answer the question", "回答所问"],
                side !== 0
                  ? t(
                      `The question asks for the ${side < 0 ? "left" : "right"}-sided limit, which is $${infL(side < 0 ? leftSign : rightSign)}$.`,
                      `题目问的是${side < 0 ? "左" : "右"}极限，它是 $${infL(side < 0 ? leftSign : rightSign)}$。`,
                    )
                  : answer === "dne"
                    ? t(`The sides disagree, so the two-sided limit does not exist.`, `两侧不一致，所以双侧极限不存在。`)
                    : t(`Both sides agree, so the limit is $${infL(leftSign)}$.`, `两侧一致，所以极限为 $${infL(leftSign)}$。`),
              ],
            ],
            t(
              `Read the heights of the drawn curve closer and closer to $x = ${h}$:\n\n${nearTable(h, f)}\n\nThe sizes grow as $x$ closes in, with the signs found above on each side.`,
              `读出所画曲线越来越接近 $x = ${h}$ 处的高度：\n\n${nearTable(h, f)}\n\n随着 $x$ 逼近，绝对值越来越大，两侧的符号与上面所读一致。`,
            ),
          ),
          (v) => {
            if (v === "dne")
              return side === 0
                ? [
                    `Both sides ${leftSign > 0 ? "rise" : "fall"} without bound, so the limit is $${infL(leftSign)}$.`,
                    `两侧都无界${leftSign > 0 ? "上升" : "下降"}，所以极限是 $${infL(leftSign)}$。`,
                  ]
                : [
                    `From one side the graph does one definite thing, so this one-sided limit is $\\infty$ or $-\\infty$.`,
                    `从一侧看图像有确定的趋势，所以这个单侧极限是 $\\infty$ 或 $-\\infty$。`,
                  ];
            if (v === "inf" || v === "-inf") {
              const s = v === "inf" ? 1 : -1;
              if (side === 0 && leftSign !== rightSign)
                return [
                  `Only one side ${s > 0 ? "rises" : "falls"} without bound; the other side ${s > 0 ? "falls" : "rises"}, so the two-sided limit does not exist.`,
                  `只有一侧无界${s > 0 ? "上升" : "下降"}，另一侧无界${s > 0 ? "下降" : "上升"}，所以双侧极限不存在。`,
                ];
              return [
                `Next to $x = ${h}$, on the side asked for, the graph ${s > 0 ? "falls" : "rises"} without bound. The other asymptote does not matter.`,
                `在 $x = ${h}$ 旁所问的那一侧，图像无界${s > 0 ? "下降" : "上升"}。另一条渐近线无关。`,
              ];
            }
            if (v.toNumber() === c)
              return [
                `$${c}$ is the level the graph approaches far away, not its behavior next to $x = ${h}$.`,
                `$${c}$ 是图像在远处趋近的高度，而不是它在 $x = ${h}$ 旁的变化。`,
              ];
            return [
              `$${h}$ is where the asymptote is, an $x$-value; near it the values are unbounded.`,
              `$${h}$ 是渐近线的位置，是一个 $x$ 值；在它附近函数值是无界的。`,
            ];
          },
          {
            svg: plane(view, [
              { kind: "line", a: [h1, 0], b: [h1, 1], dashed: true },
              { kind: "line", a: [h2, 0], b: [h2, 1], dashed: true },
              { kind: "curve", f, accent: true },
            ]),
            alt: t(
              `The graph of y = f(x) with vertical asymptotes at x = ${h1} and x = ${h2}.`,
              `在 x = ${h1} 和 x = ${h2} 处有竖直渐近线的 y = f(x) 的图像。`,
            ),
          },
          true,
        );
      },
    },
  ],
};

/** limitsOfPowerFunctionsAndTheConstantRuleForLimits evaluates limits of constants and power functions. */
export const limitsOfPowerFunctionsAndTheConstantRuleForLimits: TopicDef = {
  id: "limits-of-power-functions-and-the-constant-rule-for-limits",
  title: t("Limits of Power Functions, and the Constant Rule for Limits", "幂函数的极限与常数法则"),
  summary: t("Evaluate limits of constants and of power functions cxⁿ by substitution.", "用代入法求常数和幂函数 cxⁿ 的极限。"),
  prerequisites: ["the-finite-limit-of-a-function"],
  encompasses: [],
  xp: 8,
  standards: [],
  intro: t(
    `A limit can be estimated from a table of values near the point. For example, for $f(x) = x^{2}$ near $x = 3$,

$$f(2.99) = 8.9401, \\qquad f(3.01) = 9.0601$$

and the values close in on $9$, which is $3^{2}$.

Check: at $x = 2.999$ and $x = 3.001$ the values are $8.994001$ and $9.006001$, closer still to $9$.

In this lesson we see that for constants and power functions the limit is always found this simply: by substituting the point.`,
    `极限可以由该点附近的数值表来估计。例如，对 $x = 3$ 附近的 $f(x) = x^{2}$，

$$f(2.99) = 8.9401, \\qquad f(3.01) = 9.0601$$

函数值逼近 $9$，也就是 $3^{2}$。

检验：$x = 2.999$ 与 $x = 3.001$ 处的值为 $8.994001$ 与 $9.006001$，更接近 $9$。

这节课我们看到，对常数与幂函数，极限总能这样简单地求出：代入该点即可。`,
  ),
  knowledgePoints: [
    {
      id: "limits-of-constants-and-powers",
      title: t("Limits of constants and powers", "常数与幂的极限"),
      explanation: t(
        "A constant does not depend on the variable at all, and a power of the variable approaches the same power of the point it approaches. Two basic rules:\n\n- **Constant rule:** $\\lim_{x \\to a} c = c$.\n- **Power rule:** $\\lim_{x \\to a} x^{n} = a^{n}$, and with a constant multiple, $\\lim_{x \\to a} cx^{n} = ca^{n}$.\n\nSo $\\lim_{x \\to -2} 3x^{3} = 3(-2)^{3} = -24$ and $\\lim_{x \\to 5} 7 = 7$.\n\nCheck: $3(-2.01)^{3} \\approx -24.36$ and $3(-1.99)^{3} \\approx -23.64$, on either side of $-24$.\n\n> **Watch out.** Raise only $a$ to the power, then multiply by $c$: $3(-2)^{3}$ is $-24$, not $(3 \\cdot (-2))^{3} = -216$. Keep the parentheses around a negative $a$.",
        "常数完全不依赖于变量，而变量的幂趋近于它所趋近的点的同次幂。两条基本法则：\n\n- **常数法则：**$\\lim_{x \\to a} c = c$。\n- **幂法则：**$\\lim_{x \\to a} x^{n} = a^{n}$；带常数倍时，$\\lim_{x \\to a} cx^{n} = ca^{n}$。\n\n所以 $\\lim_{x \\to -2} 3x^{3} = 3(-2)^{3} = -24$，$\\lim_{x \\to 5} 7 = 7$。\n\n检验：$3(-2.01)^{3} \\approx -24.36$，$3(-1.99)^{3} \\approx -23.64$，分居 $-24$ 两侧。\n\n> **注意。** 只把 $a$ 取幂，再乘以 $c$：$3(-2)^{3}$ 是 $-24$，而不是 $(3 \\cdot (-2))^{3} = -216$。$a$ 为负数时要保留括号。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        if (rng.bool(0.2)) {
          const c = rng.nonZero(-12, 12);
          return numberProblem({
            prompt: t(`Find $${lim(a)} ${c}$.`, `求 $${lim(a)} ${c}$。`),
            answer: c,
            wrong: [a, c * a, 0],
            solution: walked(
              [
                [
                  ["Notice the constant", "认出常数"],
                  t(`The expression $${c}$ does not involve $x$ at all.`, `表达式 $${c}$ 完全不含 $x$。`),
                ],
                [
                  ["Apply the constant rule", "用常数法则"],
                  t(`The limit of a constant is the constant:`, `常数的极限就是这个常数：`),
                  [`${lim(a)} ${c} = ${c}`],
                ],
              ],
              t(
                `Tabulate the function $f(x) = ${c}$ near $x = ${a}$:\n\n${nearTable(a, () => c)}\n\nEvery value is $${c}$, so the values approach $${c}$.`,
                `列出函数 $f(x) = ${c}$ 在 $x = ${a}$ 附近的值：\n\n${nearTable(a, () => c)}\n\n每个值都是 $${c}$，所以函数值趋近 $${c}$。`,
              ),
            ),
          });
        }
        const n = rng.int(1, 4);
        const c = rng.pick([-5, -3, -2, -1, 1, 2, 3, 4, 5]);
        const answer = c * a ** n;
        const term = poly([c, n === 1 ? "x" : `x^{${n}}`]);
        const f = (x: number) => c * x ** n;
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${term}$.`, `求 $${lim(a)} ${term}$。`),
          answer,
          wrong: [(c * a) ** n, c * a * n, -answer],
          solution: walked(
            [
              [
                ["Apply the power rule", "用幂法则"],
                t(
                  `Replace $x$ by $${a}$ in the power, keeping the coefficient $${c}$ outside:`,
                  `把幂中的 $x$ 换成 $${a}$，系数 $${c}$ 留在外面：`,
                ),
                [`${lim(a)} ${term} = ${c}(${a})^{${n}}`],
              ],
              [
                ["Evaluate", "计算"],
                t(`Since $(${a})^{${n}} = ${a ** n}$:`, `因为 $(${a})^{${n}} = ${a ** n}$：`),
                [`${c} \\cdot ${a ** n < 0 ? `(${a ** n})` : a ** n} = ${answer}`],
              ],
            ],
            t(
              `Estimate the limit from values near $x = ${a}$:\n\n${nearTable(a, f)}\n\nThe values close in on $${answer}$ from both sides.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${nearTable(a, f)}\n\n函数值从两侧逼近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "limits-of-negative-and-fractional-coefficient-powers",
      title: t("Powers with negative exponents", "负指数幂的极限"),
      explanation: t(
        "A negative power is a reciprocal, so as long as the point is not zero, the limit is found by substituting the point. The power rule also holds for negative exponents when $a \\ne 0$: $\\lim_{x \\to a} cx^{-n} = \\frac{c}{a^{n}}$.\n\nSo $\\lim_{x \\to 2} 6x^{-3} = \\frac{6}{8} = \\frac{3}{4}$.\n\nCheck: $6 \\cdot 2.01^{-3} \\approx 0.739$ and $6 \\cdot 1.99^{-3} \\approx 0.761$, on either side of $0.75$.\n\n> **Watch out.** $x^{-n}$ means $\\frac{1}{x^{n}}$, not $-x^{n}$ and not $\\frac{1}{-nx}$. At $a = 0$ the rule does not apply, because $\\frac{c}{0}$ is not a number.",
        "负指数幂是倒数，所以只要该点不是零，代入该点就能求出极限。当 $a \\ne 0$ 时，幂法则对负指数同样成立：$\\lim_{x \\to a} cx^{-n} = \\frac{c}{a^{n}}$。\n\n所以 $\\lim_{x \\to 2} 6x^{-3} = \\frac{6}{8} = \\frac{3}{4}$。\n\n检验：$6 \\cdot 2.01^{-3} \\approx 0.739$，$6 \\cdot 1.99^{-3} \\approx 0.761$，分居 $0.75$ 两侧。\n\n> **注意。** $x^{-n}$ 表示 $\\frac{1}{x^{n}}$，不是 $-x^{n}$，也不是 $\\frac{1}{-nx}$。$a = 0$ 时法则不适用，因为 $\\frac{c}{0}$ 不是一个数。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, -1, 2, 3, 4, 5]);
        const n = rng.int(1, 3);
        const c = rng.nonZero(-9, 9);
        const answer = Q.of(c, a ** n);
        const written = rng.bool();
        const term = written ? `${c === 1 ? "" : c === -1 ? "-" : c}x^{-${n}}` : `\\frac{${c}}{x^{${n}}}`.replace("x^{1}", "x");
        const f = (x: number) => c / x ** n;
        const exact = answer.isInteger() ? "" : `, which is about $${fmt(answer.toNumber())}$`;
        const exactZh = answer.isInteger() ? "" : `，约为 $${fmt(answer.toNumber())}$`;
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${term}$.`, `求 $${lim(a)} ${term}$。`),
          answer,
          wrong: [Q.of(c * a ** n), Q.of(c, -n * a), answer.neg()],
          solution: walked(
            [
              [
                ["Write it as a reciprocal", "写成倒数"],
                t(`The point $${a}$ is not zero, so the power rule applies to the reciprocal:`, `点 $${a}$ 不是零，所以幂法则可用于倒数：`),
                [`${lim(a)} ${term} = \\frac{${c}}{(${a})^{${n}}}`],
              ],
              [
                ["Evaluate", "计算"],
                t(`Since $(${a})^{${n}} = ${a ** n}$:`, `因为 $(${a})^{${n}} = ${a ** n}$：`),
                [`\\frac{${c}}{${a ** n}} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `Estimate the limit from values near $x = ${a}$:\n\n${nearTable(a, f)}\n\nThe values close in on $${answer.toLatex()}$${exact}.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${nearTable(a, f)}\n\n函数值逼近 $${answer.toLatex()}$${exactZh}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** quadratic draws a polynomial ax² + bx + c with small coefficients, writes it and keeps its coefficients. */
function quadratic(rng: Rng) {
  const a = rng.pick([-3, -2, -1, 1, 2, 3]);
  const b = rng.int(-6, 6);
  const c = rng.int(-9, 9);
  return {
    latex: poly([a, "x^{2}"], [b, "x"], [c, ""]),
    at: (x: number) => a * x * x + b * x + c,
    coef: [a, b, c] as const,
  };
}

/** theSumRuleForLimits combines limits with the sum and constant multiple rules. */
export const theSumRuleForLimits: TopicDef = {
  id: "the-sum-rule-for-limits",
  title: t("The Sum Rule for Limits", "极限的和法则"),
  summary: t(
    "Use the sum and constant multiple rules to combine known limits and to find limits of polynomials.",
    "用和法则与常数倍法则组合已知极限，并求多项式的极限。",
  ),
  prerequisites: ["limits-of-power-functions-and-the-constant-rule-for-limits"],
  encompasses: [{ topic: "limits-of-power-functions-and-the-constant-rule-for-limits", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `The power and constant rules give $\\lim_{x \\to 2} 3x^{2} = 12$ and $\\lim_{x \\to 2} 5 = 5$. A table of the sum $3x^{2} + 5$ near $x = 2$ shows

$$3(1.99)^{2} + 5 = 16.8803, \\qquad 3(2.01)^{2} + 5 = 17.1203$$

so the values close in on $17$, which is $12 + 5$.

Check: at $x = 1.999$ and $x = 2.001$ the values are $16.988003$ and $17.012003$, closer still to $17$.

In this lesson we add known limits with the sum rule, and use it to find the limit of any polynomial by substitution.`,
    `由幂法则与常数法则，$\\lim_{x \\to 2} 3x^{2} = 12$，$\\lim_{x \\to 2} 5 = 5$。和 $3x^{2} + 5$ 在 $x = 2$ 附近的数值表显示

$$3(1.99)^{2} + 5 = 16.8803, \\qquad 3(2.01)^{2} + 5 = 17.1203$$

函数值逼近 $17$，也就是 $12 + 5$。

检验：$x = 1.999$ 与 $x = 2.001$ 处的值为 $16.988003$ 与 $17.012003$，更接近 $17$。

这节课我们用和法则把已知极限相加，并用它代入求出任意多项式的极限。`,
  ),
  knowledgePoints: [
    {
      id: "combining-limits-with-the-sum-rule",
      title: t("Combining known limits", "组合已知极限"),
      explanation: t(
        "When the limits of two functions are known, the limit of any combination of them with constant coefficients is the same combination of the limits. If $\\lim_{x \\to a} f(x) = A$ and $\\lim_{x \\to a} g(x) = B$ both exist, then\n\n$$\\lim_{x \\to a} \\left[ p f(x) + q g(x) \\right] = pA + qB.$$\n\nWith $A = 4$ and $B = -1$: $\\lim_{x \\to a} [3f(x) - 2g(x)] = 12 + 2 = 14$.\n\nCheck: take the terms in the other order, $-2(-1) + 3(4) = 2 + 12 = 14$.\n\n> **Watch out.** Multiply each coefficient by its own limit, with the sign: $-2 \\cdot (-1)$ is $+2$. The rule needs both limits to exist; if one of them does not, it says nothing.",
        "当两个函数的极限已知时，它们任意常系数组合的极限，就是这两个极限的同样组合。若 $\\lim_{x \\to a} f(x) = A$ 与 $\\lim_{x \\to a} g(x) = B$ 都存在，则\n\n$$\\lim_{x \\to a} \\left[ p f(x) + q g(x) \\right] = pA + qB.$$\n\n当 $A = 4$，$B = -1$ 时：$\\lim_{x \\to a} [3f(x) - 2g(x)] = 12 + 2 = 14$。\n\n检验：换个顺序相加，$-2(-1) + 3(4) = 2 + 12 = 14$。\n\n> **注意。** 每个系数乘以它自己的极限，并带上符号：$-2 \\cdot (-1)$ 是 $+2$。法则要求两个极限都存在；只要有一个不存在，法则就无从使用。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const A = rng.nonZero(-8, 8);
        const B = rng.nonZero(-8, 8);
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const r = rng.int(-6, 6);
        const answer = p * A + q * B + r;
        const expr = poly([p, "f(x)"], [q, "g(x)"], [r, ""]);
        const shown = poly([p, `(${A})`], [q, `(${B})`], [r, ""]);
        const terms = poly([p * A, ""], [q * B, ""], [r, ""]);
        const xa = a === 0 ? "x" : `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})`;
        const sampleF = `${A} + ${xa}`;
        const sampleG = `${B} - ${xa}`;
        const fx = (x: number) => A + (x - a);
        const gx = (x: number) => B - (x - a);
        const combo = (x: number) => p * fx(x) + q * gx(x) + r;
        return numberProblem({
          prompt: t(
            `Given $${lim(a)} f(x) = ${A}$ and $${lim(a)} g(x) = ${B}$, find $${lim(a)} \\left[${expr}\\right]$.`,
            `已知 $${lim(a)} f(x) = ${A}$，$${lim(a)} g(x) = ${B}$，求 $${lim(a)} \\left[${expr}\\right]$。`,
          ),
          answer,
          wrong: [p * A + q * B, A + B + r, p * B + q * A + r],
          solution: walked(
            [
              [
                ["Split the limit", "拆开极限"],
                t(
                  `Both limits exist, so by the sum and constant multiple rules each term takes its own limit:`,
                  `两个极限都存在，所以由和法则与常数倍法则，每一项各自取极限：`,
                ),
                [`${lim(a)} \\left[${expr}\\right] = ${shown}`],
              ],
              [["Evaluate", "计算"], t(`Multiply out each term and add:`, `算出每一项再相加：`), [`${terms} = ${answer}`]],
            ],
            t(
              `Try functions that have these limits, $f(x) = ${sampleF}$ and $g(x) = ${sampleG}$, and tabulate $${expr}$ near $x = ${a}$:\n\n${nearTable(a, combo, combo, expr)}\n\nThe values close in on $${answer}$.`,
              `取具有这两个极限的函数 $f(x) = ${sampleF}$ 与 $g(x) = ${sampleG}$，列出 $${expr}$ 在 $x = ${a}$ 附近的值：\n\n${nearTable(a, combo, combo, expr)}\n\n函数值逼近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "limits-of-polynomials",
      title: t("Limits of polynomials", "多项式的极限"),
      explanation: t(
        "Applying the sum, constant multiple and power rules term by term shows that a polynomial's limit is its value: $\\lim_{x \\to a} p(x) = p(a)$.\n\n$$\\lim_{x \\to 2} (x^{2} - 3x + 5) = 4 - 6 + 5 = 3.$$\n\nCheck: at $x = 2.01$ the value is $4.0401 - 6.03 + 5 = 3.0101$, and at $x = 1.99$ it is $2.9901$, both close to $3$.\n\n> **Watch out.** Substitute the point into every term, and keep a negative point in parentheses: at $x = -2$, $x^{2}$ is $(-2)^{2} = 4$ and $-3x$ is $+6$.",
        "逐项运用和法则、常数倍法则和幂法则可知，多项式的极限等于它的值：$\\lim_{x \\to a} p(x) = p(a)$。\n\n$$\\lim_{x \\to 2} (x^{2} - 3x + 5) = 4 - 6 + 5 = 3.$$\n\n检验：$x = 2.01$ 处的值为 $4.0401 - 6.03 + 5 = 3.0101$，$x = 1.99$ 处为 $2.9901$，都接近 $3$。\n\n> **注意。** 每一项都要代入该点，负数要加括号：$x = -2$ 时，$x^{2}$ 是 $(-2)^{2} = 4$，$-3x$ 是 $+6$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const cubic = rng.bool(0.4);
        const d = cubic ? rng.pick([-2, -1, 1, 2]) : 0;
        const q = quadratic(rng);
        const [qa, qb, qc] = q.coef;
        const latex = cubic ? `${poly([d, "x^{3}"])} ${q.latex.startsWith("-") ? `- ${q.latex.slice(1)}` : `+ ${q.latex}`}` : q.latex;
        const answer = d * a ** 3 + q.at(a);
        const p = (x: number) => d * x ** 3 + q.at(x);
        const substituted = poly([d, `(${a})^{3}`], [qa, `(${a})^{2}`], [qb, `(${a})`], [qc, ""]);
        const values = poly([d * a ** 3, ""], [qa * a * a, ""], [qb * a, ""], [qc, ""]);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\left(${latex}\\right)$.`, `求 $${lim(a)} \\left(${latex}\\right)$。`),
          answer,
          wrong: [d * a ** 3 + q.at(-a), answer + 2 * a, 0],
          solution: walked(
            [
              [
                ["Substitute", "代入"],
                t(
                  `A polynomial's limit is its value, so replace every $x$ by $${a}$:`,
                  `多项式的极限等于它的值，所以把每个 $x$ 换成 $${a}$：`,
                ),
                [substituted],
              ],
              [["Evaluate", "计算"], t(`Work out each term and add:`, `算出每一项再相加：`), [`${values} = ${answer}`]],
            ],
            t(
              `Estimate the limit from values near $x = ${a}$:\n\n${nearTable(a, p)}\n\nThe values close in on $${answer}$ from both sides.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${nearTable(a, p)}\n\n函数值从两侧逼近 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theProductAndQuotientRulesForLimits combines limits by products and quotients. */
export const theProductAndQuotientRulesForLimits: TopicDef = {
  id: "the-product-and-quotient-rules-for-limits",
  title: t("The Product and Quotient Rules for Limits", "极限的积法则与商法则"),
  summary: t(
    "Use the product and quotient rules to combine known limits and to find limits of rational functions by substitution.",
    "用积法则与商法则组合已知极限，并用代入法求分式函数的极限。",
  ),
  prerequisites: ["the-sum-rule-for-limits"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The sum rule adds known limits: $\\lim_{x \\to 2} x = 2$ and $\\lim_{x \\to 2} (x + 3) = 5$. Products behave the same way. A table of $x(x + 3)$ near $x = 2$ shows

$$1.99 \\cdot 4.99 = 9.9301, \\qquad 2.01 \\cdot 5.01 = 10.0701$$

so the values close in on $10$, which is $2 \\cdot 5$.

Check: at $x = 1.999$ and $x = 2.001$ the values are $9.993001$ and $10.007001$, closer still to $10$.

In this lesson we multiply and divide known limits, and find limits of rational functions by substitution where the denominator is not zero.`,
    `和法则把已知极限相加：$\\lim_{x \\to 2} x = 2$，$\\lim_{x \\to 2} (x + 3) = 5$。积也是一样。$x(x + 3)$ 在 $x = 2$ 附近的数值表显示

$$1.99 \\cdot 4.99 = 9.9301, \\qquad 2.01 \\cdot 5.01 = 10.0701$$

函数值逼近 $10$，也就是 $2 \\cdot 5$。

检验：$x = 1.999$ 与 $x = 2.001$ 处的值为 $9.993001$ 与 $10.007001$，更接近 $10$。

这节课我们把已知极限相乘、相除，并在分母不为零处用代入法求分式函数的极限。`,
  ),
  knowledgePoints: [
    {
      id: "combining-limits-with-products-and-quotients",
      title: t("Combining known limits", "组合已知极限"),
      explanation: t(
        "Products and quotients of functions have limits equal to the products and quotients of their limits, except that a quotient needs a nonzero limit below. If $\\lim f = A$ and $\\lim g = B$, then $\\lim (fg) = AB$, and $\\lim \\frac{f}{g} = \\frac{A}{B}$ provided $B \\ne 0$.\n\nWith $A = 6$, $B = -4$ and $\\lim h = 3$: $\\lim \\frac{f(x)g(x)}{h(x)} = \\frac{6 \\cdot (-4)}{3} = -8$.\n\nCheck: divide first and then multiply, $\\frac{6}{3} \\cdot (-4) = 2 \\cdot (-4) = -8$.\n\n> **Watch out.** The quotient rule needs the limit of the denominator to be nonzero. When it is $0$, the rule gives no answer, and the limit has to be found another way.",
        "函数之积与商的极限等于各自极限的积与商，只是商要求分母的极限不为零。若 $\\lim f = A$，$\\lim g = B$，则 $\\lim (fg) = AB$；当 $B \\ne 0$ 时，$\\lim \\frac{f}{g} = \\frac{A}{B}$。\n\n当 $A = 6$，$B = -4$，$\\lim h = 3$ 时：$\\lim \\frac{f(x)g(x)}{h(x)} = \\frac{6 \\cdot (-4)}{3} = -8$。\n\n检验：先除再乘，$\\frac{6}{3} \\cdot (-4) = 2 \\cdot (-4) = -8$。\n\n> **注意。** 商法则要求分母的极限不为零。分母极限为 $0$ 时，法则给不出答案，极限要用别的方法求。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const C = rng.nonZero(-5, 5);
        const form = B + C === 0 ? rng.pick([0, 2]) : rng.int(0, 2);
        const exprs = ["\\frac{f(x)g(x)}{h(x)}", "\\frac{f(x)}{g(x) + h(x)}", "f(x)\\left[g(x) - h(x)\\right]"];
        const values = [Q.of(A * B, C), Q.of(A, B + C || 1), Q.of(A * (B - C))];
        const answer = values[form]!;
        const expr = exprs[form]!;
        const shown = [`\\frac{(${A})(${B})}{${C}}`, `\\frac{${A}}{${B} + (${C})}`, `(${A})\\left[${B} - (${C})\\right]`][form]!;
        const inner = [`\\frac{${A * B}}{${C}}`, `\\frac{${A}}{${B + C}}`, `(${A})(${B - C})`][form]!;
        const why = [
          t(`The limit of $h$ is $${C} \\ne 0$, so the quotient rule applies.`, `$h$ 的极限为 $${C} \\ne 0$，所以商法则适用。`),
          t(
            `The limit of the denominator is $${B} + (${C}) = ${B + C} \\ne 0$, so the quotient rule applies.`,
            `分母的极限为 $${B} + (${C}) = ${B + C} \\ne 0$，所以商法则适用。`,
          ),
          t(`All three limits exist, so the product and difference rules apply.`, `三个极限都存在，所以积法则与差法则适用。`),
        ][form]!;
        const given = (and: string, sep: string) => `$${lim(a)} f(x) = ${A}$${sep}$${lim(a)} g(x) = ${B}$${and}$${lim(a)} h(x) = ${C}$`;
        const xa = a === 0 ? "x" : `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})`;
        const d = (x: number) => x - a;
        const fx = (x: number) => A + d(x);
        const gx = (x: number) => B + d(x);
        const hx = (x: number) => C + d(x);
        const combo = [
          (x: number) => (fx(x) * gx(x)) / hx(x),
          (x: number) => fx(x) / (gx(x) + hx(x)),
          (x: number) => fx(x) * (gx(x) - hx(x)),
        ][form]!;
        const approx = answer.isInteger() ? "" : `, about $${fmt(answer.toNumber())}$`;
        const approxZh = answer.isInteger() ? "" : `，约为 $${fmt(answer.toNumber())}$`;
        return numberProblem({
          prompt: t(`Given ${given(" and ", ", ")}, find $${lim(a)} ${expr}$.`, `已知 ${given("，", "，")}，求 $${lim(a)} ${expr}$。`),
          answer,
          wrong: [Q.of(A * B * C), Q.of(A + B, C), answer.neg()],
          solution: walked(
            [
              [["Check the rules apply", "确认法则适用"], why],
              [
                ["Replace each limit", "代入各个极限"],
                t(`Each function is replaced by its limit:`, `每个函数换成它的极限：`),
                [`${lim(a)} ${expr} = ${shown}`],
              ],
              [["Evaluate", "计算"], t(`Work out the result:`, `算出结果：`), [`${inner} = ${answer.toLatex()}`]],
            ],
            t(
              `Try functions that have these limits, $f(x) = ${A} + ${xa}$, $g(x) = ${B} + ${xa}$ and $h(x) = ${C} + ${xa}$, and tabulate $${expr}$ near $x = ${a}$:\n\n${nearTable(a, combo, combo, expr)}\n\nThe values close in on $${answer.toLatex()}$${approx}.`,
              `取具有这些极限的函数 $f(x) = ${A} + ${xa}$、$g(x) = ${B} + ${xa}$ 与 $h(x) = ${C} + ${xa}$，列出 $${expr}$ 在 $x = ${a}$ 附近的值：\n\n${nearTable(a, combo, combo, expr)}\n\n函数值逼近 $${answer.toLatex()}$${approxZh}。`,
            ),
          ),
        });
      },
    },
    {
      id: "limits-of-rational-functions-by-substitution",
      title: t("Limits of rational functions by substitution", "用代入法求分式函数的极限"),
      explanation: t(
        "By the quotient rule, a rational function's limit is its value wherever the denominator is not zero:\n\n$$\\lim_{x \\to 3} \\frac{x^{2} + 1}{x - 1} = \\frac{10}{2} = 5.$$\n\nCheck: at $x = 2.99$ the value is $\\frac{9.9401}{1.99} \\approx 4.995$, and at $x = 3.01$ it is $\\frac{10.0601}{2.01} \\approx 5.005$, both close to $5$.\n\n> **Watch out.** Look at the denominator first. Substitution works only when the denominator is not $0$ at the point; if it is $0$, the answer is not found this way.",
        "由商法则，在分母不为零处，分式函数的极限等于它的值：\n\n$$\\lim_{x \\to 3} \\frac{x^{2} + 1}{x - 1} = \\frac{10}{2} = 5.$$\n\n检验：$x = 2.99$ 处的值为 $\\frac{9.9401}{1.99} \\approx 4.995$，$x = 3.01$ 处为 $\\frac{10.0601}{2.01} \\approx 5.005$，都接近 $5$。\n\n> **注意。** 先看分母。只有分母在该点不为 $0$ 时才能代入；若分母为 $0$，就不能这样求。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const top = quadratic(rng);
        const m = rng.pick([1, 2, 3]);
        const n = rng.pick(range(-6, 6).filter((v) => m * a + v !== 0));
        const den = m * a + n;
        const num = top.at(a);
        const answer = Q.of(num, den);
        const below = poly([m, "x"], [n, ""]);
        const fr = `\\frac{${top.latex}}{${below}}`;
        const f = (x: number) => top.at(x) / (m * x + n);
        const approx = answer.isInteger() ? "" : `, about $${fmt(answer.toNumber())}$`;
        const approxZh = answer.isInteger() ? "" : `，约为 $${fmt(answer.toNumber())}$`;
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${fr}$.`, `求 $${lim(a)} ${fr}$。`),
          answer,
          wrong: [Q.of(den, num === 0 ? 1 : num), Q.of(num), answer.neg()],
          solution: walked(
            [
              [
                ["Check the denominator", "检查分母"],
                t(`At $x = ${a}$ the denominator is`, `在 $x = ${a}$ 处，分母为`),
                [`${poly([m, `(${a})`], [n, ""])} = ${den} \\ne 0`],
              ],
              [
                ["Substitute", "代入"],
                t(`So the limit is the value of the function; the numerator is $${num}$:`, `所以极限等于函数值；分子为 $${num}$：`),
                [`${lim(a)} ${fr} = \\frac{${num}}{${den}} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `Estimate the limit from values near $x = ${a}$:\n\n${nearTable(a, f)}\n\nThe values close in on $${answer.toLatex()}$${approx}.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${nearTable(a, f)}\n\n函数值逼近 $${answer.toLatex()}$${approxZh}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** thePowerAndRootRulesForLimits takes powers and roots of limits. */
export const thePowerAndRootRulesForLimits: TopicDef = {
  id: "the-power-and-root-rules-for-limits",
  title: t("The Power and Root Rules for Limits", "极限的幂法则与根式法则"),
  summary: t(
    "Take powers and roots of known limits, and find limits of roots of polynomials.",
    "对已知极限取幂和开方，并求多项式开方的极限。",
  ),
  prerequisites: ["the-product-and-quotient-rules-for-limits"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The product rule multiplies known limits, so a function multiplied by itself has the square of its limit. With $\\lim_{x \\to 3} (x - 1) = 2$, the cube $(x - 1)^{3} = (x - 1)(x - 1)(x - 1)$ has limit $2 \\cdot 2 \\cdot 2 = 8$. A table near $x = 3$ agrees:

$$(1.99)^{3} = 7.880599, \\qquad (2.01)^{3} = 8.120601$$

Check: at $x = 2.999$ and $x = 3.001$ the values are $(1.999)^{3} \\approx 7.988$ and $(2.001)^{3} \\approx 8.012$, closer still to $8$.

In this lesson we take powers and roots of known limits directly, and use the root rule to find limits of roots of polynomials.`,
    `积法则把已知极限相乘，所以一个函数自乘，其极限就是原极限的平方。由 $\\lim_{x \\to 3} (x - 1) = 2$，立方 $(x - 1)^{3} = (x - 1)(x - 1)(x - 1)$ 的极限是 $2 \\cdot 2 \\cdot 2 = 8$。$x = 3$ 附近的数值表与此一致：

$$(1.99)^{3} = 7.880599, \\qquad (2.01)^{3} = 8.120601$$

检验：$x = 2.999$ 与 $x = 3.001$ 处的值为 $(1.999)^{3} \\approx 7.988$ 与 $(2.001)^{3} \\approx 8.012$，更接近 $8$。

这节课我们直接对已知极限取幂和开方，并用根式法则求多项式开方的极限。`,
  ),
  knowledgePoints: [
    {
      id: "powers-and-roots-of-limits",
      title: t("Powers and roots of limits", "极限的幂与根"),
      explanation: t(
        "Raising to a power or taking a root can be done after finding the limit, as long as an even root is applied to a nonnegative number. If $\\lim_{x \\to a} f(x) = A$, then\n\n$$\\lim_{x \\to a} [f(x)]^{n} = A^{n}, \\qquad \\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{A},$$\n\nwhere for even $n$ we need $A > 0$. So if $\\lim f = 8$, then $\\lim \\sqrt[3]{f(x)} = 2$ and $\\lim [f(x)]^{2} = 64$.\n\nCheck: $2^{3} = 8$, so $2$ is indeed the cube root of $8$; and $64 = 8 \\cdot 8$ is what the product rule gives for $f(x) \\cdot f(x)$.\n\n> **Watch out.** Take the power of the limit before multiplying by a coefficient: if $\\lim f = -3$, then $\\lim 2[f(x)]^{2} = 2 \\cdot 9 = 18$, not $(2 \\cdot (-3))^{2} = 36$. An even root of a negative limit is not a real number.",
        "可以先求极限再取幂或开方，只要偶次方根作用在非负数上即可。若 $\\lim_{x \\to a} f(x) = A$，则\n\n$$\\lim_{x \\to a} [f(x)]^{n} = A^{n}, \\qquad \\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{A},$$\n\n其中 $n$ 为偶数时要求 $A > 0$。所以若 $\\lim f = 8$，则 $\\lim \\sqrt[3]{f(x)} = 2$，$\\lim [f(x)]^{2} = 64$。\n\n检验：$2^{3} = 8$，所以 $2$ 确实是 $8$ 的立方根；$64 = 8 \\cdot 8$ 正是积法则对 $f(x) \\cdot f(x)$ 给出的结果。\n\n> **注意。** 先对极限取幂，再乘系数：若 $\\lim f = -3$，则 $\\lim 2[f(x)]^{2} = 2 \\cdot 9 = 18$，而不是 $(2 \\cdot (-3))^{2} = 36$。负数的偶次方根不是实数。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const kind = rng.int(0, 2);
        const xa = a === 0 ? "x" : `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})`;
        if (kind === 0) {
          const A = rng.nonZero(-5, 5);
          const n = rng.int(2, 4);
          const c = rng.pick([1, 1, 2, -1, 3]);
          const answer = c * A ** n;
          const expr = `${c === 1 ? "" : c === -1 ? "-" : c}\\left[f(x)\\right]^{${n}}`;
          const f = (x: number) => c * (A + x - a) ** n;
          return numberProblem({
            prompt: t(`Given $${lim(a)} f(x) = ${A}$, find $${lim(a)} ${expr}$.`, `已知 $${lim(a)} f(x) = ${A}$，求 $${lim(a)} ${expr}$。`),
            answer,
            wrong: [c * A * n, -answer, (c * A) ** n],
            solution: walked(
              [
                [
                  ["Apply the power rule", "用幂法则"],
                  t(
                    `The limit of $[f(x)]^{${n}}$ is the ${n === 2 ? "square" : n === 3 ? "cube" : "fourth power"} of the limit:`,
                    `$[f(x)]^{${n}}$ 的极限是极限的 ${n} 次方：`,
                  ),
                  [`${lim(a)} \\left[f(x)\\right]^{${n}} = ${paren(A)}^{${n}} = ${A ** n}`],
                ],
                [
                  ["Multiply by the coefficient", "乘以系数"],
                  c === 1
                    ? t(`The coefficient is $1$, so the limit is $${answer}$.`, `系数是 $1$，所以极限是 $${answer}$。`)
                    : t(`Then the constant multiple rule:`, `再用常数倍法则：`),
                  c === 1 ? [] : [`${c} \\cdot ${A ** n} = ${answer}`],
                ],
              ],
              t(
                `Try a function with this limit, $f(x) = ${A} + ${xa}$, and tabulate $${expr}$ near $x = ${a}$:\n\n${nearTable(a, f, f, expr)}\n\nThe values close in on $${answer}$.`,
                `取具有这个极限的函数 $f(x) = ${A} + ${xa}$，列出 $${expr}$ 在 $x = ${a}$ 附近的值：\n\n${nearTable(a, f, f, expr)}\n\n函数值逼近 $${answer}$。`,
              ),
            ),
          });
        }
        const square = kind === 1;
        const r = square ? rng.int(1, 12) : rng.nonZero(-5, 5);
        const A = square ? r * r : r ** 3;
        const root = square ? "\\sqrt{f(x)}" : "\\sqrt[3]{f(x)}";
        const ofA = square ? `\\sqrt{${A}}` : `\\sqrt[3]{${A}}`;
        const f = (x: number) => (square ? Math.sqrt : Math.cbrt)(A + x - a);
        return numberProblem({
          prompt: t(`Given $${lim(a)} f(x) = ${A}$, find $${lim(a)} ${root}$.`, `已知 $${lim(a)} f(x) = ${A}$，求 $${lim(a)} ${root}$。`),
          answer: r,
          wrong: [A, Q.of(A, square ? 2 : 3), -r],
          solution: walked(
            [
              [
                ["Check the root applies", "确认可以开方"],
                square
                  ? t(`The limit $${A}$ is positive, so the square root rule applies.`, `极限 $${A}$ 为正，所以平方根法则适用。`)
                  : t(`A cube root applies to any real number.`, `立方根对任何实数都适用。`),
              ],
              [
                ["Take the root of the limit", "对极限开方"],
                t(`Since $${paren(r)}^{${square ? 2 : 3}} = ${A}$:`, `因为 $${paren(r)}^{${square ? 2 : 3}} = ${A}$：`),
                [`${lim(a)} ${root} = ${ofA} = ${r}`],
              ],
            ],
            t(
              `Try a function with this limit, $f(x) = ${A} + ${xa}$, and tabulate $${root}$ near $x = ${a}$:\n\n${nearTable(a, f, f, root)}\n\nThe values close in on $${r}$.`,
              `取具有这个极限的函数 $f(x) = ${A} + ${xa}$，列出 $${root}$ 在 $x = ${a}$ 附近的值：\n\n${nearTable(a, f, f, root)}\n\n函数值逼近 $${r}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "limits-of-roots-of-polynomials",
      title: t("Limits of roots of polynomials", "多项式开方的极限"),
      explanation: t(
        "A polynomial has no breaks, so find its limit by substitution, and then apply the root to the result. Combine the root rule with the limit of a polynomial:\n\n$$\\lim_{x \\to 3} \\sqrt{x^{2} + 16} = \\sqrt{\\lim_{x \\to 3} (x^{2} + 16)} = \\sqrt{25} = 5.$$\n\nCheck: at $x = 3.01$ the value is $\\sqrt{25.0601} \\approx 5.006$, and at $x = 2.99$ it is $\\sqrt{24.9401} \\approx 4.994$, both close to $5$.\n\n> **Watch out.** The root covers the whole polynomial, not each term: $\\sqrt{9 + 16}$ is $5$, not $3 + 4 = 7$.",
        "多项式没有间断，所以用代入法求它的极限，再对结果开方。把根式法则与多项式的极限结合：\n\n$$\\lim_{x \\to 3} \\sqrt{x^{2} + 16} = \\sqrt{\\lim_{x \\to 3} (x^{2} + 16)} = \\sqrt{25} = 5.$$\n\n检验：$x = 3.01$ 处的值为 $\\sqrt{25.0601} \\approx 5.006$，$x = 2.99$ 处为 $\\sqrt{24.9401} \\approx 4.994$，都接近 $5$。\n\n> **注意。** 根号作用于整个多项式，而不是逐项开方：$\\sqrt{9 + 16}$ 是 $5$，不是 $3 + 4 = 7$。",
      ),
      generate(rng) {
        const square = rng.bool(0.7);
        const a = rng.int(-4, 4);
        const r = square ? rng.int(1, 9) : rng.nonZero(-4, 4);
        const k = rng.pick([1, 2, 3]);
        const b = rng.int(-5, 5);
        const inner = k * a * a + b * a;
        const value = square ? r * r : r ** 3;
        const c = value - inner;
        const latex = poly([k, "x^{2}"], [b, "x"], [c, ""]);
        const wrapped = square ? `\\sqrt{${latex}}` : `\\sqrt[3]{${latex}}`;
        const substituted = poly([k, `(${a})^{2}`], [b, `(${a})`], [c, ""]);
        const f = (x: number) => (square ? Math.sqrt : Math.cbrt)(k * x * x + b * x + c);
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${wrapped}$.`, `求 $${lim(a)} ${wrapped}$。`),
          answer: r,
          wrong: [value, -r, r + 1],
          solution: walked(
            [
              [
                ["Find the limit inside", "求根号内的极限"],
                t(`The polynomial's limit is its value at $x = ${a}$:`, `多项式的极限等于它在 $x = ${a}$ 处的值：`),
                [`${substituted} = ${value}`],
              ],
              [
                ["Take the root", "开方"],
                square
                  ? t(`The limit inside is positive, so the root rule applies:`, `根号内的极限为正，所以根式法则适用：`)
                  : t(`A cube root applies to any real number:`, `立方根对任何实数都适用：`),
                [`${lim(a)} ${wrapped} = ${square ? `\\sqrt{${value}}` : `\\sqrt[3]{${value}}`} = ${r}`],
              ],
            ],
            t(
              `Estimate the limit from values close to $x = ${a}$:\n\n${closeTable(a, f)}\n\nThe values close in on $${r}$ from both sides.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${closeTable(a, f)}\n\n函数值从两侧逼近 $${r}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** limitsAtInfinityOfPolynomials finds the end behavior of polynomials as limits. */
export const limitsAtInfinityOfPolynomials: TopicDef = {
  id: "limits-at-infinity-of-polynomials",
  title: t("Limits at Infinity of Polynomials", "多项式在无穷远处的极限"),
  summary: t("Find the limits of a polynomial as x → ±∞ from its leading term.", "由首项求多项式在 x → ±∞ 时的极限。"),
  prerequisites: ["limits-at-infinity-from-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `A limit at infinity reads where $f(x)$ heads as $x$ grows without bound. Some graphs level off; a polynomial never does. For example, $f(x) = x^{2} - 10x$ starts negative, but

$$f(10) = 0, \\qquad f(100) = 9000, \\qquad f(1000) = 990000$$

so its values grow without bound, and $\\lim_{x \\to \\infty} f(x) = \\infty$.

Check: at $x = 1000$ the term $x^{2} = 1000000$ is a hundred times the size of $10x = 10000$, so the square takes over.

In this lesson we find the limits of a polynomial as $x \\to \\infty$ and $x \\to -\\infty$ from its leading term alone.`,
    `无穷远处的极限读的是 $x$ 无界增大时 $f(x)$ 的去向。有些图像会逐渐趋于水平；多项式从不如此。例如 $f(x) = x^{2} - 10x$ 一开始是负的，但

$$f(10) = 0, \\qquad f(100) = 9000, \\qquad f(1000) = 990000$$

它的值无界增大，所以 $\\lim_{x \\to \\infty} f(x) = \\infty$。

检验：$x = 1000$ 时，$x^{2} = 1000000$ 是 $10x = 10000$ 的一百倍，平方项占了主导。

这节课我们只凭首项求出多项式在 $x \\to \\infty$ 与 $x \\to -\\infty$ 时的极限。`,
  ),
  knowledgePoints: [
    {
      id: "limits-at-infinity-from-the-leading-term",
      title: t("Using the leading term", "利用首项"),
      explanation: t(
        "As $x \\to \\pm\\infty$, a polynomial behaves like its leading term $ax^{n}$:\n\n- $x \\to \\infty$: the limit is $\\infty$ if $a > 0$ and $-\\infty$ if $a < 0$.\n- $x \\to -\\infty$: $x^{n}$ is positive for even $n$ and negative for odd $n$, so the sign of $ax^{n}$ decides.\n\n$\\lim_{x \\to -\\infty} (-2x^{3} + 5x) = \\infty$, since $-2x^{3} > 0$ for large negative $x$.\n\nCheck: at $x = -100$ the value is $-2(-1000000) - 500 = 1999500$, large and positive.\n\n> **Watch out.** A polynomial of degree $1$ or more never levels off, so its limit at $\\pm\\infty$ is never a number such as $0$ or the leading coefficient. For $x \\to -\\infty$, work out the sign of $x^{n}$ before the sign of $a$.",
        "当 $x \\to \\pm\\infty$ 时，多项式的表现与首项 $ax^{n}$ 一致：\n\n- $x \\to \\infty$：$a > 0$ 时极限为 $\\infty$，$a < 0$ 时为 $-\\infty$。\n- $x \\to -\\infty$：$n$ 为偶数时 $x^{n}$ 为正，$n$ 为奇数时为负，由 $ax^{n}$ 的符号决定。\n\n$\\lim_{x \\to -\\infty} (-2x^{3} + 5x) = \\infty$，因为当 $x$ 是绝对值很大的负数时 $-2x^{3} > 0$。\n\n检验：$x = -100$ 时值为 $-2(-1000000) - 500 = 1999500$，是很大的正数。\n\n> **注意。** 一次及以上的多项式从不趋于水平，所以它在 $\\pm\\infty$ 处的极限从来不是 $0$ 或首项系数这样的数。求 $x \\to -\\infty$ 的极限时，先定出 $x^{n}$ 的符号，再看 $a$ 的符号。",
      ),
      generate(rng) {
        const n = rng.int(2, 5);
        const a = rng.nonZero(-5, 5);
        const b = rng.int(-9, 9);
        const c = rng.int(-9, 9);
        const toPlus = rng.bool();
        const latex = poly([a, `x^{${n}}`], [b, `x^{${n - 1}}`.replace("x^{1}", "x")], [c, ""]);
        const powerSign = toPlus || n % 2 === 0 ? 1 : -1;
        const sign = Math.sign(a) * powerSign;
        const target = toPlus ? "\\infty" : "-\\infty";
        const lead = poly([a, `x^{${n}}`]);
        const ratio = (x: number) => (a * x ** n + b * x ** (n - 1) + c) / (a * x ** n);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "inf" || v === "-inf" || v === "dne")
            return [
              `As $x \\to ${target}$, $x^{${n}}$ is ${powerSign > 0 ? "positive" : "negative"} and the coefficient $${a}$ is ${a > 0 ? "positive" : "negative"}, so $${lead}$ heads to $${infL(sign)}$.`,
              `当 $x \\to ${target}$ 时，$x^{${n}}$ 为${powerSign > 0 ? "正" : "负"}，系数 $${a}$ 为${a > 0 ? "正" : "负"}，所以 $${lead}$ 趋于 $${infL(sign)}$。`,
            ];
          if (v.isZero())
            return [
              `A polynomial of degree $${n}$ does not shrink towards $0$; its size grows without bound.`,
              `$${n}$ 次多项式不会缩小到 $0$；它的绝对值无界增大。`,
            ];
          return [
            `$${a}$ is the leading coefficient. It sets the sign, but the values do not settle at $${a}$; they grow without bound.`,
            `$${a}$ 是首项系数。它决定符号，但函数值并不稳定在 $${a}$，而是无界增大。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${lim(target)} \\left(${latex}\\right)$.`, `求 $${lim(target)} \\left(${latex}\\right)$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.of(a)],
          walked(
            [
              [
                ["Find the leading term", "找出首项"],
                t(
                  `The term of highest degree is $${lead}$, and far out it decides the behavior.`,
                  `次数最高的项是 $${lead}$，在远处由它决定函数的表现。`,
                ),
              ],
              [
                ["Find its sign", "确定它的符号"],
                t(
                  `As $x \\to ${target}$, $x^{${n}} \\to ${infL(powerSign)}$, and multiplying by $${a}$ gives`,
                  `当 $x \\to ${target}$ 时，$x^{${n}} \\to ${infL(powerSign)}$，乘以 $${a}$ 得`,
                ),
                [`${lim(target)} \\left(${latex}\\right) = ${infL(sign)}`],
              ],
            ],
            t(
              `Compare the polynomial with its leading term far out:\n\n${farTable(toPlus ? 1 : -1, ratio, `\\frac{${latex}}{${lead}}`)}\n\nThe ratio closes in on $1$, so the polynomial is about $${lead}$ there, which heads to $${infL(sign)}$.`,
              `在远处比较多项式与它的首项：\n\n${farTable(toPlus ? 1 : -1, ratio, `\\frac{${latex}}{${lead}}`)}\n\n比值逼近 $1$，所以那里的多项式约等于 $${lead}$，而它趋于 $${infL(sign)}$。`,
            ),
          ),
          reason,
        );
      },
    },
    {
      id: "limits-at-infinity-of-factored-polynomials",
      title: t("Polynomials in factored form", "因式分解形式的多项式"),
      explanation: t(
        "For a product of factors, the leading term is the product of the factors' leading terms:\n\n$$(2 - x)(x + 3)^{2} \\text{ has leading term } (-x)(x)^{2} = -x^{3},$$\n\nso it tends to $-\\infty$ as $x \\to \\infty$ and to $\\infty$ as $x \\to -\\infty$.\n\nCheck: at $x = 100$ the value is $(-98)(103)^{2} = -1039682$, large and negative.\n\n> **Watch out.** Raise a factor's leading term to the factor's power: $(x + 3)^{2}$ contributes $x^{2}$, not $x$. A factor such as $(2 - x)$ has leading term $-x$, which flips the sign.",
        "对于因式的乘积，首项是各因式首项之积：\n\n$$(2 - x)(x + 3)^{2} \\text{ 的首项是 } (-x)(x)^{2} = -x^{3},$$\n\n所以 $x \\to \\infty$ 时它趋于 $-\\infty$，$x \\to -\\infty$ 时趋于 $\\infty$。\n\n检验：$x = 100$ 时值为 $(-98)(103)^{2} = -1039682$，是很大的负数。\n\n> **注意。** 因式的首项要取该因式的次数：$(x + 3)^{2}$ 贡献 $x^{2}$，而不是 $x$。像 $(2 - x)$ 这样的因式首项是 $-x$，会改变符号。",
      ),
      generate(rng) {
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const flip = rng.bool();
        const m = rng.int(1, 3);
        const k = rng.pick([1, 2, 3]);
        const first = flip ? `(${p} - ${k === 1 ? "" : k}x)` : `(${poly([k, "x"], [p, ""])})`;
        const second = `(${bare(q)})${m === 1 ? "" : `^{${m}}`}`;
        const degree = 1 + m;
        const lead = flip ? -k : k;
        const toPlus = rng.bool();
        const powerSign = toPlus || degree % 2 === 0 ? 1 : -1;
        const sign = Math.sign(lead) * powerSign;
        const target = toPlus ? "\\infty" : "-\\infty";
        const expr = rng.bool() ? `${first}${second}` : `${second}${first}`;
        const leadLatex = poly([lead, `x^{${degree}}`]);
        const firstLead = poly([lead, "x"]);
        const xm = m === 1 ? "x" : `x^{${m}}`;
        const value = (x: number) => (flip ? p - k * x : k * x + p) * (x - q) ** m;
        const ratio = (x: number) => value(x) / (lead * x ** degree);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "inf" || v === "-inf" || v === "dne")
            return [
              `The leading term is $${leadLatex}$. As $x \\to ${target}$, $x^{${degree}}$ is ${powerSign > 0 ? "positive" : "negative"}, so the product heads to $${infL(sign)}$.`,
              `首项是 $${leadLatex}$。当 $x \\to ${target}$ 时，$x^{${degree}}$ 为${powerSign > 0 ? "正" : "负"}，所以乘积趋于 $${infL(sign)}$。`,
            ];
          if (v.isZero())
            return [
              `The factors grow without bound in size, so their product does not shrink towards $0$.`,
              `各因式的绝对值都无界增大，所以它们的乘积不会缩小到 $0$。`,
            ];
          return [
            `$${lead}$ is the leading coefficient. It sets the sign, but the values grow without bound rather than settle at $${lead}$.`,
            `$${lead}$ 是首项系数。它决定符号，但函数值无界增大，而不是稳定在 $${lead}$。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${lim(target)} ${expr}$.`, `求 $${lim(target)} ${expr}$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.of(lead)],
          walked(
            [
              [
                ["Multiply the leading terms", "首项相乘"],
                t(
                  `The factors have leading terms $${firstLead}$ and $${xm}$, so the leading term of the product is`,
                  `两个因式的首项分别是 $${firstLead}$ 与 $${xm}$，所以乘积的首项是`,
                ),
                [`${firstLead} \\cdot ${xm} =${leadLatex}`],
              ],
              [
                ["Find its sign", "确定它的符号"],
                t(
                  `As $x \\to ${target}$, $x^{${degree}} \\to ${infL(powerSign)}$, and multiplying by $${lead}$ gives`,
                  `当 $x \\to ${target}$ 时，$x^{${degree}} \\to ${infL(powerSign)}$，乘以 $${lead}$ 得`,
                ),
                [`${lim(target)} ${expr} = ${infL(sign)}`],
              ],
            ],
            t(
              `Compare the product with its leading term far out:\n\n${farTable(toPlus ? 1 : -1, ratio, `\\frac{f(x)}{${leadLatex}}`)}\n\nHere $f(x)$ is the product. The ratio closes in on $1$, so the product is about $${leadLatex}$ there, which heads to $${infL(sign)}$.`,
              `在远处比较乘积与它的首项：\n\n${farTable(toPlus ? 1 : -1, ratio, `\\frac{f(x)}{${leadLatex}}`)}\n\n这里 $f(x)$ 表示这个乘积。比值逼近 $1$，所以那里的乘积约等于 $${leadLatex}$，而它趋于 $${infL(sign)}$。`,
            ),
          ),
          reason,
        );
      },
    },
  ],
};

/** limitsOfReciprocalFunctions finds limits of k/(x − h)ⁿ near the asymptote and at infinity. */
export const limitsOfReciprocalFunctions: TopicDef = {
  id: "limits-of-reciprocal-functions",
  title: t("Limits of Reciprocal Functions", "倒数函数的极限"),
  summary: t(
    "Find limits of k/(x − h)ⁿ + c at its vertical asymptote and as x → ±∞.",
    "求 k/(x − h)ⁿ + c 在竖直渐近线处以及 x → ±∞ 时的极限。",
  ),
  prerequisites: ["infinite-limits-from-graphs", "limits-at-infinity-from-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `On a graph, an infinite limit shows as a curve shooting up or down beside a vertical asymptote, and a limit at infinity as a curve levelling off. The formula

$$f(x) = \\frac{1}{x - 2} + 3$$

does both: beside $x = 2$ the fraction is huge, and far out it is tiny, leaving $3$.

Check: $f(2.01) = 103$ and $f(1.99) = -97$, while $f(1000) \\approx 3.001$.

In this lesson we find these limits for $\\frac{k}{(x - h)^{n}} + c$ from the formula, without a graph.`,
    `在图像上，无穷极限表现为曲线在竖直渐近线旁向上或向下无限延伸，无穷远处的极限表现为曲线逐渐趋于水平。式子

$$f(x) = \\frac{1}{x - 2} + 3$$

两者兼有：在 $x = 2$ 旁分式的绝对值很大，在远处分式很小，只剩下 $3$。

检验：$f(2.01) = 103$，$f(1.99) = -97$，而 $f(1000) \\approx 3.001$。

这节课我们不借助图像，直接由式子求 $\\frac{k}{(x - h)^{n}} + c$ 的这些极限。`,
  ),
  knowledgePoints: [
    {
      id: "reciprocal-limits-at-the-asymptote",
      figure: calculusDrawings1["limits-of-reciprocal-functions#reciprocal-limits-at-the-asymptote"],
      title: t("Limits at the vertical asymptote", "竖直渐近线处的极限"),
      explanation: t(
        "Near $x = h$, $\\frac{k}{(x - h)^{n}}$ is a fixed number divided by a tiny one, so it is huge. Its sign depends on the sign of $k$ and of $(x - h)^{n}$:\n\n- for even $n$, $(x - h)^{n} > 0$ on both sides, so both one-sided limits have the sign of $k$;\n- for odd $n$, $(x - h)^{n}$ is negative on the left and positive on the right, so the sides differ and the two-sided limit does not exist.\n\nFor $\\frac{-3}{(x - 1)^{2}}$ both sides head to $-\\infty$.\n\nCheck: at $x = 0.99$ and $x = 1.01$ the value is $\\frac{-3}{0.0001} = -30000$ on both sides.\n\n> **Watch out.** The added constant $c$ does not matter here; it only moves a huge value a little. Work out the sign of $(x - h)^{n}$ on the side asked for before writing $\\infty$ or $-\\infty$.",
        "在 $x = h$ 附近，$\\frac{k}{(x - h)^{n}}$ 是一个固定的数除以一个很小的数，所以绝对值很大。其符号由 $k$ 和 $(x - h)^{n}$ 的符号决定：\n\n- $n$ 为偶数时，$(x - h)^{n}$ 在两侧都为正，两个单侧极限的符号都与 $k$ 相同；\n- $n$ 为奇数时，$(x - h)^{n}$ 左负右正，两侧不同，双侧极限不存在。\n\n对于 $\\frac{-3}{(x - 1)^{2}}$，两侧都趋于 $-\\infty$。\n\n检验：$x = 0.99$ 与 $x = 1.01$ 处的值都是 $\\frac{-3}{0.0001} = -30000$。\n\n> **注意。** 这里加上的常数 $c$ 不起作用，它只是把一个很大的值稍微移动一点。写 $\\infty$ 或 $-\\infty$ 之前，先定出所问那一侧 $(x - h)^{n}$ 的符号。",
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const k = rng.nonZero(-6, 6);
        const n = rng.int(1, 4);
        const c = rng.int(-3, 3);
        const side = rng.pick([-1, 1, 0] as const);
        const leftSign = Math.sign(k) * (n % 2 === 0 ? 1 : -1);
        const rightSign = Math.sign(k);
        const toInf = (s: number): LimitValue => (s > 0 ? "inf" : "-inf");
        const answer: LimitValue =
          side < 0 ? toInf(leftSign) : side > 0 ? toInf(rightSign) : leftSign === rightSign ? toInf(leftSign) : "dne";
        const den = h === 0 ? `x${n === 1 ? "" : `^{${n}}`}` : `(${bare(h)})${n === 1 ? "" : `^{${n}}`}`;
        const expr = `\\frac{${k}}{${den}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const operator = side === 0 ? lim(h) : lim(h, side);
        const f = (x: number) => k / (x - h) ** n + c;
        const sideSign = (s: number) => (s > 0 ? "positive" : "negative");
        const sideSignZh = (s: number) => (s > 0 ? "正" : "负");
        const denLeft = n % 2 === 0 ? 1 : -1;
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return side === 0
              ? [
                  `Both sides head to $${infL(leftSign)}$, so the limit is written as $${infL(leftSign)}$.`,
                  `两侧都趋于 $${infL(leftSign)}$，所以极限记作 $${infL(leftSign)}$。`,
                ]
              : [
                  `On one side the fraction does one definite thing, so this one-sided limit is $\\infty$ or $-\\infty$.`,
                  `在一侧分式有确定的趋势，所以这个单侧极限是 $\\infty$ 或 $-\\infty$。`,
                ];
          if (v === "inf" || v === "-inf") {
            const s = v === "inf" ? 1 : -1;
            if (answer === "dne")
              return [
                `Only one side heads to $${infL(s)}$; the other heads to $${infL(-s)}$, so the two-sided limit does not exist.`,
                `只有一侧趋于 $${infL(s)}$，另一侧趋于 $${infL(-s)}$，所以双侧极限不存在。`,
              ];
            const actual = answer === "inf" ? 1 : -1;
            return [
              `The sign is wrong: $${k}$ divided by a ${sideSign(side < 0 ? denLeft : 1)} tiny number is ${sideSign(actual)}, so the fraction heads to $${infL(actual)}$.`,
              `符号错了：$${k}$ 除以一个很小的${sideSignZh(side < 0 ? denLeft : 1)}数是${sideSignZh(actual)}的，所以分式趋于 $${infL(actual)}$。`,
            ];
          }
          if (v.isZero())
            return [
              `The numerator stays $${k}$ while the denominator shrinks to $0$, so the fraction grows in size; it does not shrink to $0$.`,
              `分子保持 $${k}$，分母缩小到 $0$，所以分式的绝对值变大，而不是缩小到 $0$。`,
            ];
          return [
            `$${c}$ is the level of the horizontal asymptote, the limit far out, not the behavior next to $x = ${h}$.`,
            `$${c}$ 是水平渐近线的高度，即远处的极限，而不是 $x = ${h}$ 旁的变化。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${operator} ${expr}$.`, `求 $${operator} ${expr}$。`),
          answer,
          [Q.zero, Q.of(c)],
          walked(
            [
              [
                ["Find the sign of the denominator", "确定分母的符号"],
                n % 2 === 0
                  ? t(
                      `The power $${n}$ is even, so $${den}$ is a tiny positive number on both sides of $${h}$.`,
                      `指数 $${n}$ 是偶数，所以在 $${h}$ 两侧 $${den}$ 都是很小的正数。`,
                    )
                  : t(
                      `The power $${n}$ is odd, so $${den}$ is a tiny negative number on the left of $${h}$ and a tiny positive number on the right.`,
                      `指数 $${n}$ 是奇数，所以 $${den}$ 在 $${h}$ 左侧是很小的负数，在右侧是很小的正数。`,
                    ),
              ],
              [
                ["Divide the numerator", "用分子去除"],
                t(
                  `The numerator is $${k}$, so the fraction tends to $${infL(leftSign)}$ from the left and $${infL(rightSign)}$ from the right; adding $${c}$ changes nothing.`,
                  `分子是 $${k}$，所以分式从左侧趋于 $${infL(leftSign)}$，从右侧趋于 $${infL(rightSign)}$；加上 $${c}$ 不改变结果。`,
                ),
              ],
              [
                ["Answer the question", "回答所问"],
                side !== 0
                  ? t(
                      `The question asks for the ${side < 0 ? "left" : "right"}-sided limit, which is $${infL(side < 0 ? leftSign : rightSign)}$.`,
                      `题目问的是${side < 0 ? "左" : "右"}极限，它是 $${infL(side < 0 ? leftSign : rightSign)}$。`,
                    )
                  : answer === "dne"
                    ? t(`The sides disagree, so the two-sided limit does not exist.`, `两侧不一致，所以双侧极限不存在。`)
                    : t(`Both sides agree, so the limit is $${infL(leftSign)}$.`, `两侧一致，所以极限是 $${infL(leftSign)}$。`),
              ],
            ],
            t(
              `Evaluate the function closer and closer to $x = ${h}$:\n\n${nearTable(h, f)}\n\nThe values ${leftSign === rightSign ? "keep the same sign on both sides" : "have opposite signs on the two sides"} and grow in size as $x$ closes in, which matches the answer.`,
              `计算越来越接近 $x = ${h}$ 处的函数值：\n\n${nearTable(h, f)}\n\n随着 $x$ 逼近，函数值${leftSign === rightSign ? "在两侧符号相同" : "在两侧符号相反"}，绝对值越来越大，与答案一致。`,
            ),
          ),
          reason,
          undefined,
          true,
        );
      },
    },
    {
      id: "reciprocal-limits-at-infinity",
      figure: calculusDrawings1["limits-of-reciprocal-functions#reciprocal-limits-at-infinity"],
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "When the denominator grows without bound, the fraction shrinks toward zero, so only the constant added to it remains in the limit. As $x \\to \\pm\\infty$, $(x - h)^{n}$ grows without bound, so $\\frac{k}{(x - h)^{n}} \\to 0$ and $\\frac{k}{(x - h)^{n}} + c \\to c$. The line $y = c$ is a horizontal asymptote.\n\nFor $\\frac{5}{x + 1} - 2$ the limit as $x \\to \\infty$ is $-2$.\n\nCheck: at $x = 999$ the value is $\\frac{5}{1000} - 2 = -1.995$, close to $-2$.\n\n> **Watch out.** The numerator $k$ does not survive in the limit, because the fraction itself tends to $0$. The point $h$ tells where the vertical asymptote is, not the level far out.",
        "当分母无限增大时，分式趋近于零，所以极限中只剩下与它相加的常数。当 $x \\to \\pm\\infty$ 时，$(x - h)^{n}$ 无界增大，所以 $\\frac{k}{(x - h)^{n}} \\to 0$，$\\frac{k}{(x - h)^{n}} + c \\to c$。直线 $y = c$ 是水平渐近线。\n\n对于 $\\frac{5}{x + 1} - 2$，$x \\to \\infty$ 时的极限是 $-2$。\n\n检验：$x = 999$ 时值为 $\\frac{5}{1000} - 2 = -1.995$，接近 $-2$。\n\n> **注意。** 分子 $k$ 不会留在极限中，因为分式本身趋于 $0$。点 $h$ 说明的是竖直渐近线的位置，而不是远处的高度。",
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const k = rng.nonZero(-6, 6);
        const n = rng.int(1, 3);
        const c = rng.int(-6, 6);
        const toPlus = rng.bool();
        const target = toPlus ? "\\infty" : "-\\infty";
        const den = h === 0 ? `x${n === 1 ? "" : `^{${n}}`}` : `(${bare(h)})${n === 1 ? "" : `^{${n}}`}`;
        const frac = `\\frac{${k}}{${den}}`;
        const expr = `${frac}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const f = (x: number) => k / (x - h) ** n + c;
        const candidates: readonly (readonly [Q, string, string])[] = [
          [
            Q.zero,
            `The fraction tends to $0$, but the constant $${c}$ is still added, so the limit is $${c}$.`,
            `分式趋于 $0$，但还要加上常数 $${c}$，所以极限是 $${c}$。`,
          ],
          [
            Q.of(k),
            `$${k}$ is the numerator. The fraction itself tends to $0$, so $${k}$ does not survive.`,
            `$${k}$ 是分子。分式本身趋于 $0$，所以 $${k}$ 不会留下。`,
          ],
          [
            Q.of(c + k),
            `This treats the fraction as if it tended to $${k}$; it tends to $0$, leaving only $${c}$.`,
            `这是把分式当成趋于 $${k}$；其实它趋于 $0$，只剩下 $${c}$。`,
          ],
          [
            Q.of(h),
            `$${h}$ is where the vertical asymptote is, an $x$-value, not the level the graph approaches far out.`,
            `$${h}$ 是竖直渐近线的位置，是一个 $x$ 值，而不是图像在远处趋近的高度。`,
          ],
        ];
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "inf" || v === "-inf" || v === "dne")
            return [
              `Far out the fraction shrinks to $0$ and the values settle at $${c}$; they grow without bound only next to $x = ${h}$.`,
              `在远处分式缩小到 $0$，函数值稳定在 $${c}$；只有在 $x = ${h}$ 旁它们才无界增大。`,
            ];
          const hit = candidates.find(([w]) => w.eq(v));
          return hit ? [hit[1], hit[2]] : [`The fraction tends to $0$, so the limit is $${c}$.`, `分式趋于 $0$，所以极限是 $${c}$。`];
        };
        return limitAsk(
          rng,
          t(`Find $${lim(target)} ${expr}$.`, `求 $${lim(target)} ${expr}$。`),
          Q.of(c),
          candidates.map(([w]) => w),
          walked(
            [
              [
                ["Look at the denominator", "看分母"],
                t(
                  `As $x \\to ${target}$, $${den}$ grows without bound in size, so the fraction shrinks:`,
                  `当 $x \\to ${target}$ 时，$${den}$ 的绝对值无界增大，所以分式缩小：`,
                ),
                [`${lim(target)} ${frac} = 0`],
              ],
              [
                ["Add the constant", "加上常数"],
                t(`Only the constant remains, so the limit is $${c}$.`, `只剩下常数，所以极限是 $${c}$。`),
              ],
            ],
            t(
              `Evaluate the function further and further ${toPlus ? "right" : "left"}:\n\n${farTable(toPlus ? 1 : -1, f)}\n\nThe values close in on $${c}$.`,
              `计算越来越靠${toPlus ? "右" : "左"}处的函数值：\n\n${farTable(toPlus ? 1 : -1, f)}\n\n函数值逼近 $${c}$。`,
            ),
          ),
          reason,
        );
      },
    },
  ],
};

/** limitsOfExponentialFunctions finds limits of exponential functions. */
export const limitsOfExponentialFunctions: TopicDef = {
  id: "limits-of-exponential-functions",
  title: t("Limits of Exponential Functions", "指数函数的极限"),
  summary: t("Find limits of a·bˣ + c as x → ±∞ and at a point.", "求 a·bˣ + c 在 x → ±∞ 时以及在一点处的极限。"),
  prerequisites: ["limits-at-infinity-from-graphs", "properties-of-transformed-exponential-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The graph of a transformed exponential function such as $f(x) = 2^{x} + 1$ has a horizontal asymptote, here $y = 1$, which it approaches at the far left. In the language of limits this is $\\lim_{x \\to -\\infty} f(x) = 1$, because

$$2^{-10} = \\frac{1}{1024} \\approx 0.001$$

is already tiny.

Check: $f(-10) \\approx 1.001$ and $f(-20) \\approx 1.000001$, closing in on $1$.

In this lesson we write the end behavior of $a \\cdot b^{x} + c$ as limits at $\\pm\\infty$, and find its limits at a point.`,
    `变换后的指数函数，例如 $f(x) = 2^{x} + 1$，其图像有一条水平渐近线，这里是 $y = 1$，图像在最左端趋近它。用极限的语言说，就是 $\\lim_{x \\to -\\infty} f(x) = 1$，因为

$$2^{-10} = \\frac{1}{1024} \\approx 0.001$$

已经很小了。

检验：$f(-10) \\approx 1.001$，$f(-20) \\approx 1.000001$，逼近 $1$。

这节课我们把 $a \\cdot b^{x} + c$ 的端点行为写成 $\\pm\\infty$ 处的极限，并求它在一点处的极限。`,
  ),
  knowledgePoints: [
    {
      id: "exponential-limits-at-infinity",
      figure: calculusDrawings1["limits-of-exponential-functions#exponential-limits-at-infinity"],
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "A base greater than one makes powers grow rapidly in one direction and shrink toward zero in the other, which gives the graph its horizontal asymptote. For $b > 1$: $b^{x} \\to \\infty$ as $x \\to \\infty$ and $b^{x} \\to 0$ as $x \\to -\\infty$. For $0 < b < 1$ it is the other way round. So\n\n$$\\lim_{x \\to -\\infty} (3 \\cdot 2^{x} + 5) = 5, \\qquad \\lim_{x \\to \\infty} (-e^{x} + 1) = -\\infty.$$\n\nCheck: $3 \\cdot 2^{-10} + 5 \\approx 5.003$, while $-e^{10} + 1 \\approx -22025$.\n\n> **Watch out.** On the side where the power shrinks, the limit is $c$, not $a + c$: $b^{x}$ equals $1$ only at $x = 0$. On the side where it grows, the sign of $a$ decides between $\\infty$ and $-\\infty$.",
        "底数大于 1 时，幂在一个方向上迅速增大，在另一个方向上趋近于零，这就是图像有水平渐近线的原因。当 $b > 1$ 时：$x \\to \\infty$ 时 $b^{x} \\to \\infty$，$x \\to -\\infty$ 时 $b^{x} \\to 0$。当 $0 < b < 1$ 时恰好相反。所以\n\n$$\\lim_{x \\to -\\infty} (3 \\cdot 2^{x} + 5) = 5, \\qquad \\lim_{x \\to \\infty} (-e^{x} + 1) = -\\infty.$$\n\n检验：$3 \\cdot 2^{-10} + 5 \\approx 5.003$，而 $-e^{10} + 1 \\approx -22025$。\n\n> **注意。** 在幂缩小的一侧，极限是 $c$，而不是 $a + c$：$b^{x}$ 只在 $x = 0$ 处等于 $1$。在幂增大的一侧，由 $a$ 的符号决定是 $\\infty$ 还是 $-\\infty$。",
      ),
      generate(rng) {
        const bases = [
          { latex: "2^{x}", grows: true, at: (x: number) => 2 ** x },
          { latex: "3^{x}", grows: true, at: (x: number) => 3 ** x },
          { latex: "e^{x}", grows: true, at: (x: number) => Math.exp(x) },
          { latex: "e^{-x}", grows: false, at: (x: number) => Math.exp(-x) },
          { latex: "\\left(\\frac{1}{2}\\right)^{x}", grows: false, at: (x: number) => 0.5 ** x },
          { latex: "\\left(\\frac{2}{3}\\right)^{x}", grows: false, at: (x: number) => (2 / 3) ** x },
          { latex: "5^{x}", grows: true, at: (x: number) => 5 ** x },
        ];
        const b = rng.pick(bases);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 5]);
        const c = rng.int(-6, 6);
        const toPlus = rng.bool();
        const big = toPlus === b.grows;
        const answer: LimitValue = big ? (a > 0 ? "inf" : "-inf") : Q.of(c);
        const target = toPlus ? "\\infty" : "-\\infty";
        const expr = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${b.latex}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const term = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${b.latex}`;
        const f = (x: number) => a * b.at(x) + c;
        const xs = [1, 5, 10].map((x) => (toPlus ? x : -x));
        const tableText = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...xs.map((x) => `$${fmt(f(x))}$`)]);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "inf" || v === "-inf" || v === "dne")
            return big
              ? [
                  `The power is positive and grows without bound; multiplied by $${a}$ it heads to $${infL(a)}$.`,
                  `幂为正且无界增大；乘以 $${a}$ 后趋于 $${infL(a)}$。`,
                ]
              : [
                  `On this side the power shrinks to $0$, so the values level off at $${c}$ instead of growing without bound.`,
                  `在这一侧幂缩小到 $0$，所以函数值稳定在 $${c}$，而不是无界增大。`,
                ];
          if (v.eq(Q.of(c)))
            return [
              `$${c}$ is the level at the other end, where the power shrinks; at this end the power grows without bound.`,
              `$${c}$ 是另一端的高度，那里幂缩小；这一端幂无界增大。`,
            ];
          if (v.eq(Q.of(a + c)))
            return [
              `This takes $${b.latex}$ to be $1$, its value at $x = 0$, not its behavior as $x \\to ${target}$.`,
              `这是把 $${b.latex}$ 当成 $1$，那是它在 $x = 0$ 处的值，而不是 $x \\to ${target}$ 时的表现。`,
            ];
          return big
            ? [`The power grows without bound, so the values do not shrink to $0$.`, `幂无界增大，所以函数值不会缩小到 $0$。`]
            : [
                `The power tends to $0$, but $${c}$ is still added, so the limit is $${c}$.`,
                `幂趋于 $0$，但还要加上 $${c}$，所以极限是 $${c}$。`,
              ];
        };
        return limitAsk(
          rng,
          t(`Find $${lim(target)} \\left(${expr}\\right)$.`, `求 $${lim(target)} \\left(${expr}\\right)$。`),
          answer,
          [Q.of(c), Q.of(a + c), Q.zero],
          walked(
            [
              [
                ["Find what the power does", "看幂的变化"],
                big
                  ? t(
                      `As $x \\to ${target}$ the power $${b.latex}$ grows without bound.`,
                      `当 $x \\to ${target}$ 时，幂 $${b.latex}$ 无界增大。`,
                    )
                  : t(
                      `As $x \\to ${target}$ the power $${b.latex}$ shrinks towards $0$.`,
                      `当 $x \\to ${target}$ 时，幂 $${b.latex}$ 缩小到 $0$。`,
                    ),
              ],
              [
                ["Apply the coefficient and constant", "乘系数、加常数"],
                big
                  ? t(
                      `Multiplying by $${a}$ ${a > 0 ? "keeps the sign" : "flips the sign"}, and adding $${c}$ does not change an unbounded value:`,
                      `乘以 $${a}$ ${a > 0 ? "不改变符号" : "改变符号"}，加上 $${c}$ 不影响无界的值：`,
                    )
                  : t(`The term $${term}$ tends to $0$, leaving the constant:`, `项 $${term}$ 趋于 $0$，只剩下常数：`),
                [`${lim(target)} \\left(${expr}\\right) = ${big ? infL(a) : c}`],
              ],
            ],
            t(
              `Evaluate the function further and further ${toPlus ? "right" : "left"}:\n\n${tableText}\n\n${big ? `The values grow in size with the sign of $${a}$, already huge at $x = ${xs[2]}$.` : `The values close in on $${c}$.`}`,
              `计算越来越靠${toPlus ? "右" : "左"}处的函数值：\n\n${tableText}\n\n${big ? `函数值的绝对值不断增大，符号与 $${a}$ 相同，在 $x = ${xs[2]}$ 处已经很大。` : `函数值逼近 $${c}$。`}`,
            ),
          ),
          reason,
        );
      },
    },
    {
      id: "exponential-limits-at-a-point",
      figure: calculusDrawings1["limits-of-exponential-functions#exponential-limits-at-a-point"],
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "An exponential graph has no hole or jump, so its limit at any point is simply the value of the function there: $\\lim_{x \\to 1} (2e^{3x} - 4) = 2e^{3} - 4$.\n\nCheck: $2e^{3} - 4 \\approx 36.171$, and at $x = 1.01$ the value is $2e^{3.03} - 4 \\approx 37.394$, close by.\n\n> **Watch out.** Substitute into the whole exponent: at $x = 1$, $e^{3x}$ is $e^{3}$, and the coefficient $2$ stays outside, so the answer is not $e^{6} - 4$.",
        "指数函数的图像没有洞或跳跃，所以它在任意点处的极限就是该点的函数值：$\\lim_{x \\to 1} (2e^{3x} - 4) = 2e^{3} - 4$。\n\n检验：$2e^{3} - 4 \\approx 36.171$，而 $x = 1.01$ 处的值为 $2e^{3.03} - 4 \\approx 37.394$，相差不大。\n\n> **注意。** 代入整个指数：$x = 1$ 时，$e^{3x}$ 是 $e^{3}$，系数 $2$ 留在外面，所以答案不是 $e^{6} - 4$。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, -1, 2, 3, 4]);
        const k = rng.pick([-2, -1, 1, 2, 3]);
        const p = rng.nonZero(-3, 3);
        const c = rng.int(-5, 5);
        const exponent = poly([k, "x"]);
        const value = k * p;
        const constant = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`;
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const answer = `${coef}e^{${value}}${constant}`;
        const f = (x: number) => a * Math.exp(k * x) + c;
        return functionProblem({
          prompt: t(
            `Find $${lim(p)} \\left(${coef}e^{${exponent}}${constant}\\right)$. Give the exact value.`,
            `求 $${lim(p)} \\left(${coef}e^{${exponent}}${constant}\\right)$，写出精确值。`,
          ),
          answer,
          wrong: [`${coef}e^{${-value}}${constant}`, `${coef}e^{${k}}${constant}`, `${a * value + c}`],
          solution: walked(
            [
              [
                ["Use continuity", "利用连续性"],
                t(
                  `An exponential function has no breaks, so the limit is the value at $x = ${p}$.`,
                  `指数函数没有间断，所以极限等于 $x = ${p}$ 处的值。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(`The exponent becomes $${k} \\cdot ${paren(p)} = ${value}$:`, `指数变为 $${k} \\cdot ${paren(p)} = ${value}$：`),
                [`${lim(p)} \\left(${coef}e^{${exponent}}${constant}\\right) = ${answer}`],
              ],
            ],
            t(
              `The exact value is about $${fmt(f(p))}$. Estimate the limit from values close to $x = ${p}$:\n\n${closeTable(p, f)}\n\nThe values close in on $${fmt(f(p))}$ from both sides.`,
              `精确值约为 $${fmt(f(p))}$。用 $x = ${p}$ 附近的值估计极限：\n\n${closeTable(p, f)}\n\n函数值从两侧逼近 $${fmt(f(p))}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** limitsOfLogarithmicFunctions finds limits of logarithmic functions. */
export const limitsOfLogarithmicFunctions: TopicDef = {
  id: "limits-of-logarithmic-functions",
  title: t("Limits of Logarithmic Functions", "对数函数的极限"),
  summary: t(
    "Find limits of logarithmic functions at the edge of their domain, at infinity and at a point.",
    "求对数函数在定义域边界处、无穷远处以及一点处的极限。",
  ),
  prerequisites: ["infinite-limits-from-graphs", "properties-of-transformed-logarithmic-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The graph of $y = \\ln x$ has the vertical asymptote $x = 0$: just right of it the graph falls without bound. As an infinite limit this is $\\lim_{x \\to 0^{+}} \\ln x = -\\infty$, because

$$\\ln 0.01 \\approx -4.605, \\qquad \\ln 0.0001 \\approx -9.210$$

and each time $x$ shrinks by a factor of $100$ the value drops by another $4.605$.

Check: $\\ln 0.000001 \\approx -13.816$, lower still, with no level in sight.

In this lesson we find limits of logarithmic functions at the edge of their domain, at infinity and at a point.`,
    `$y = \\ln x$ 的图像有竖直渐近线 $x = 0$：紧靠它的右侧，图像无界下降。写成无穷极限就是 $\\lim_{x \\to 0^{+}} \\ln x = -\\infty$，因为

$$\\ln 0.01 \\approx -4.605, \\qquad \\ln 0.0001 \\approx -9.210$$

$x$ 每缩小到原来的 $\\frac{1}{100}$，函数值就再下降 $4.605$。

检验：$\\ln 0.000001 \\approx -13.816$，更低，看不到任何下限。

这节课我们求对数函数在定义域边界处、无穷远处以及一点处的极限。`,
  ),
  knowledgePoints: [
    {
      id: "logarithmic-limits-at-the-asymptote-and-infinity",
      figure: calculusDrawings1["limits-of-logarithmic-functions#logarithmic-limits-at-the-asymptote-and-infinity"],
      title: t("Limits at the asymptote and at infinity", "渐近线处与无穷远处的极限"),
      explanation: t(
        "A logarithm drops without bound as its input approaches zero from the right, and grows without bound, though very slowly, as its input grows. For a base $b > 1$: $\\log_{b} x \\to -\\infty$ as $x \\to 0^{+}$ and $\\log_{b} x \\to \\infty$ as $x \\to \\infty$, slowly. Shifted, $\\ln(x - h) \\to -\\infty$ as $x \\to h^{+}$. A negative multiplier flips the sign: $\\lim_{x \\to 0^{+}} (-2\\ln x) = \\infty$.\n\nCheck: $-2\\ln 0.001 \\approx 13.816$ and $-2\\ln 0.000001 \\approx 27.631$, growing without bound.\n\n> **Watch out.** A logarithm has no horizontal asymptote: it grows slowly, but its limit as $x \\to \\infty$ is still $\\infty$, not a number. At the vertical asymptote, read the sign of the multiplier before writing $\\infty$ or $-\\infty$.",
        "当自变量从右侧趋近于零时，对数无限减小；当自变量增大时，对数也无限增大，只是增长得很慢。对于底数 $b > 1$：$x \\to 0^{+}$ 时 $\\log_{b} x \\to -\\infty$，$x \\to \\infty$ 时 $\\log_{b} x \\to \\infty$（增长缓慢）。平移后，$x \\to h^{+}$ 时 $\\ln(x - h) \\to -\\infty$。负的系数会改变符号：$\\lim_{x \\to 0^{+}} (-2\\ln x) = \\infty$。\n\n检验：$-2\\ln 0.001 \\approx 13.816$，$-2\\ln 0.000001 \\approx 27.631$，无界增大。\n\n> **注意。** 对数函数没有水平渐近线：它增长得慢，但 $x \\to \\infty$ 时的极限仍是 $\\infty$，而不是一个数。在竖直渐近线处，写 $\\infty$ 或 $-\\infty$ 之前先看系数的符号。",
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const a = rng.pick([-3, -2, -1, 1, 2, 4]);
        const c = rng.int(-5, 5);
        const fn = rng.pick(["\\ln", "\\log_{2}", "\\log"]);
        const atInfinity = rng.bool(0.4);
        const inner = h === 0 ? "x" : `(${bare(h)})`;
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const expr = `${coef}${fn} ${inner}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const logSign = atInfinity ? 1 : -1;
        const sign = logSign * Math.sign(a);
        const operator = atInfinity ? lim("\\infty") : lim(h, 1);
        const log = fn === "\\ln" ? Math.log : fn === "\\log" ? Math.log10 : Math.log2;
        const gaps = atInfinity ? ["10", "1000", "1000000"] : ["0.1", "0.001", "0.000001"];
        const gapValues = atInfinity ? [10, 1000, 1000000] : [0.1, 0.001, 0.000001];
        const gapName = h === 0 ? "x" : bare(h);
        const tableText = table(
          [`$${gapName}$`, ...gaps.map((g) => `$${g}$`)],
          ["$f(x)$", ...gapValues.map((g) => `$${fmt(a * log(g) + c)}$`)],
        );
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "inf" || v === "-inf" || v === "dne")
            return [
              `$${fn} ${inner}$ heads to $${infL(logSign)}$ here; multiplied by $${a}$ it heads to $${infL(sign)}$.`,
              `这里 $${fn} ${inner}$ 趋于 $${infL(logSign)}$；乘以 $${a}$ 后趋于 $${infL(sign)}$。`,
            ];
          if (v.eq(Q.of(c)))
            return [
              `$${c}$ is only added at the end; the logarithm itself is unbounded here, so the sum is too.`,
              `$${c}$ 只是最后加上的；这里对数本身无界，所以和也无界。`,
            ];
          if (v.isZero())
            return atInfinity
              ? [
                  `A logarithm grows slowly but without bound; it does not level off at any number.`,
                  `对数增长得慢，但无界增大；它不会稳定在任何数上。`,
                ]
              : [
                  `The logarithm of a number near $0$ is a large negative number, not $0$; the logarithm is $0$ where its input is $1$.`,
                  `接近 $0$ 的数的对数是绝对值很大的负数，而不是 $0$；对数在其真数为 $1$ 时才等于 $0$。`,
                ];
          return [
            `$${h}$ is where the vertical asymptote is, an $x$-value, not a height the graph approaches.`,
            `$${h}$ 是竖直渐近线的位置，是一个 $x$ 值，而不是图像趋近的高度。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${operator} \\left(${expr}\\right)$.`, `求 $${operator} \\left(${expr}\\right)$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.of(c), Q.zero, Q.of(h)],
          walked(
            [
              [
                ["Find what the logarithm does", "看对数的变化"],
                atInfinity
                  ? t(
                      `As $x \\to \\infty$, the input $${inner}$ grows without bound, so $${fn} ${inner} \\to \\infty$, slowly.`,
                      `当 $x \\to \\infty$ 时，真数 $${inner}$ 无界增大，所以 $${fn} ${inner} \\to \\infty$，只是增长缓慢。`,
                    )
                  : t(
                      `As $x \\to ${h}^{+}$, the input $${inner}$ is a tiny positive number, so $${fn} ${inner} \\to -\\infty$.`,
                      `当 $x \\to ${h}^{+}$ 时，真数 $${inner}$ 是很小的正数，所以 $${fn} ${inner} \\to -\\infty$。`,
                    ),
              ],
              [
                ["Apply the coefficient", "乘以系数"],
                t(
                  `Multiplying by $${a}$ ${a > 0 ? "keeps" : "flips"} the sign, and adding $${c}$ does not change an unbounded value:`,
                  `乘以 $${a}$ ${a > 0 ? "不改变" : "改变"}符号，加上 $${c}$ 不影响无界的值：`,
                ),
                [`${operator} \\left(${expr}\\right) = ${infL(sign)}`],
              ],
            ],
            t(
              `Evaluate the function as $${gapName}$ ${atInfinity ? "grows" : "shrinks"}:\n\n${tableText}\n\nEach step changes the value by about the same amount again, so the values pass any bound, heading to $${infL(sign)}$.`,
              `随着 $${gapName}$ ${atInfinity ? "增大" : "缩小"}，计算函数值：\n\n${tableText}\n\n每一步函数值都再变化大致相同的量，所以函数值越过任何界限，趋于 $${infL(sign)}$。`,
            ),
          ),
          reason,
        );
      },
    },
    {
      id: "logarithmic-limits-at-a-point",
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "Inside its domain a logarithm has no breaks, so its limit at a point is its value there: $\\lim_{x \\to 8} (3\\log_{2} x - 1) = 3 \\cdot 3 - 1 = 8$.\n\nCheck: $2^{3} = 8$, so $\\log_{2} 8 = 3$; and at $x = 8.01$ the value is about $8.005$, close to $8$.\n\n> **Watch out.** Find the logarithm first, then multiply and add: $\\log_{2} 8$ is the exponent $3$, not $8$ and not $\\frac{8}{2}$.",
        "在定义域内，对数函数没有间断，所以它在一点处的极限等于该点的函数值：$\\lim_{x \\to 8} (3\\log_{2} x - 1) = 3 \\cdot 3 - 1 = 8$。\n\n检验：$2^{3} = 8$，所以 $\\log_{2} 8 = 3$；而 $x = 8.01$ 处的值约为 $8.005$，接近 $8$。\n\n> **注意。** 先求对数，再乘、再加：$\\log_{2} 8$ 是指数 $3$，不是 $8$，也不是 $\\frac{8}{2}$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 5, 10]);
        const k = rng.int(-2, b === 10 ? 3 : 4);
        const at = Q.of(b).pow(k);
        const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const c = rng.int(-6, 6);
        const fn = b === 10 ? "\\log" : `\\log_{${b}}`;
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const expr = `${coef}${fn} x${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const answer = a * k + c;
        const f = (x: number) => (a * Math.log(x)) / Math.log(b) + c;
        const x0 = at.toNumber();
        const check =
          x0 >= 1
            ? t(
                `Estimate the limit from values close to $x = ${at.toLatex()}$:\n\n${closeTable(x0, f)}\n\nThe values close in on $${answer}$ from both sides.`,
                `用 $x = ${at.toLatex()}$ 附近的值估计极限：\n\n${closeTable(x0, f)}\n\n函数值从两侧逼近 $${answer}$。`,
              )
            : t(
                `Undo the logarithm: $${b}^{${k}} = ${at.toLatex()}$, so $${fn} ${at.toLatex()}$ is indeed $${k}$.\n\nThen $${a} \\cdot ${paren(k)} = ${a * k}$, and adding $${c}$ gives $${answer}$ again.`,
                `反过来验证：$${b}^{${k}} = ${at.toLatex()}$，所以 $${fn} ${at.toLatex()}$ 确实是 $${k}$。\n\n于是 $${a} \\cdot ${paren(k)} = ${a * k}$，再加 $${c}$，仍得 $${answer}$。`,
              );
        return numberProblem({
          prompt: t(`Find $${lim(at.toLatex())} \\left(${expr}\\right)$.`, `求 $${lim(at.toLatex())} \\left(${expr}\\right)$。`),
          answer,
          wrong: [a * -k + c, k + c, a * k],
          solution: walked(
            [
              [
                ["Find the logarithm", "求对数"],
                t(
                  `Inside the domain the limit is the value. Since $${b}^{${k}} = ${at.toLatex()}$:`,
                  `在定义域内极限等于函数值。因为 $${b}^{${k}} = ${at.toLatex()}$：`,
                ),
                [`${fn} ${at.toLatex()} = ${k}`],
              ],
              [
                ["Multiply and add", "乘系数再加常数"],
                t(`Put it into the expression:`, `代入表达式：`),
                [`${a} \\cdot ${paren(k)}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`} = ${answer}`],
              ],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** limitsOfRadicalFunctions finds limits of square and cube roots. */
export const limitsOfRadicalFunctions: TopicDef = {
  id: "limits-of-radical-functions",
  title: t("Limits of Radical Functions", "根式函数的极限"),
  summary: t(
    "Find limits of radical functions inside their domain, at its endpoint and at infinity.",
    "求根式函数在定义域内、端点处以及无穷远处的极限。",
  ),
  prerequisites: ["the-power-and-root-rules-for-limits", "finding-the-existence-of-a-limit-using-one-sided-limits"],
  encompasses: [{ topic: "the-power-and-root-rules-for-limits", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `The root rule takes the root of a limit: since $\\lim_{x \\to 5} (x + 4) = 9$, we get $\\lim_{x \\to 5} \\sqrt{x + 4} = \\sqrt{9} = 3$. A table agrees:

$$\\sqrt{8.99} \\approx 2.998, \\qquad \\sqrt{9.01} \\approx 3.002$$

Check: $2.998^{2} \\approx 8.988$ and $3.002^{2} \\approx 9.012$, so these really are the roots of numbers close to $9$.

In this lesson we find limits of radical functions inside their domain, at the endpoint of the domain, where only one side has values, and at infinity.`,
    `根式法则对极限开方：由 $\\lim_{x \\to 5} (x + 4) = 9$，得 $\\lim_{x \\to 5} \\sqrt{x + 4} = \\sqrt{9} = 3$。数值表与此一致：

$$\\sqrt{8.99} \\approx 2.998, \\qquad \\sqrt{9.01} \\approx 3.002$$

检验：$2.998^{2} \\approx 8.988$，$3.002^{2} \\approx 9.012$，它们确实是接近 $9$ 的数的平方根。

这节课我们求根式函数在定义域内、在只有一侧有函数值的定义域端点处，以及在无穷远处的极限。`,
  ),
  knowledgePoints: [
    {
      id: "radical-limits-inside-the-domain",
      title: t("Limits inside the domain", "定义域内的极限"),
      explanation: t(
        "Inside its domain a radical function has no breaks, so substitute: $\\lim_{x \\to 6} \\sqrt{2x - 3} = \\sqrt{9} = 3$. Cube roots are defined everywhere: $\\lim_{x \\to -4} \\sqrt[3]{2x} = \\sqrt[3]{-8} = -2$.\n\nCheck: at $x = 6.01$ the value is $\\sqrt{9.02} \\approx 3.003$, close to $3$; and $(-2)^{3} = -8$.\n\n> **Watch out.** Work out the whole radicand before taking the root: $\\sqrt{2 \\cdot 6 - 3}$ is $\\sqrt{9}$, not $\\sqrt{12} - \\sqrt{3}$. A cube root of a negative number is negative.",
        "在定义域内根式函数没有间断，所以直接代入：$\\lim_{x \\to 6} \\sqrt{2x - 3} = \\sqrt{9} = 3$。立方根处处有定义：$\\lim_{x \\to -4} \\sqrt[3]{2x} = \\sqrt[3]{-8} = -2$。\n\n检验：$x = 6.01$ 处的值为 $\\sqrt{9.02} \\approx 3.003$，接近 $3$；且 $(-2)^{3} = -8$。\n\n> **注意。** 先算出整个被开方数再开方：$\\sqrt{2 \\cdot 6 - 3}$ 是 $\\sqrt{9}$，不是 $\\sqrt{12} - \\sqrt{3}$。负数的立方根是负数。",
      ),
      generate(rng) {
        const square = rng.bool(0.6);
        const r = square ? rng.int(1, 8) : rng.nonZero(-4, 4);
        const p = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
        const a = rng.int(-6, 6);
        const radicand = square ? r * r : r ** 3;
        const q = radicand - p * a;
        const inner = poly([p, "x"], [q, ""]);
        const c = rng.pick([1, 1, 2, -1, 3]);
        const coef = c === 1 ? "" : c === -1 ? "-" : `${c}`;
        const expr = `${coef}${square ? `\\sqrt{${inner}}` : `\\sqrt[3]{${inner}}`}`;
        const f = (x: number) => c * (square ? Math.sqrt : Math.cbrt)(p * x + q);
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${expr}$.`, `求 $${lim(a)} ${expr}$。`),
          answer: c * r,
          wrong: [c * radicand, -c * r, c * r + 1],
          solution: walked(
            [
              [
                ["Find the radicand", "求被开方数"],
                t(`Substitute $x = ${a}$ into the radicand:`, `把 $x = ${a}$ 代入被开方数：`),
                [`${poly([p, `(${a})`], [q, ""])} = ${radicand}`],
              ],
              [
                ["Take the root", "开方"],
                square
                  ? t(
                      `The radicand is positive, so $x = ${a}$ is inside the domain and the limit is the value:`,
                      `被开方数为正，所以 $x = ${a}$ 在定义域内，极限等于函数值：`,
                    )
                  : t(`A cube root is defined everywhere, so the limit is the value:`, `立方根处处有定义，所以极限等于函数值：`),
                [`${lim(a)} ${expr} = ${c === 1 ? "" : `${c} \\cdot `}${paren(r)} = ${c * r}`],
              ],
            ],
            t(
              `Estimate the limit from values close to $x = ${a}$:\n\n${closeTable(a, f)}\n\nThe values close in on $${c * r}$ from both sides.`,
              `用 $x = ${a}$ 附近的值估计极限：\n\n${closeTable(a, f)}\n\n函数值从两侧逼近 $${c * r}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "radical-limits-at-the-endpoint-and-infinity",
      title: t("Limits at the endpoint and at infinity", "端点处与无穷远处的极限"),
      explanation: t(
        "$\\sqrt{x - h}$ is defined only for $x \\ge h$. So $\\lim_{x \\to h^{+}} \\sqrt{x - h} = 0$, while the left-sided limit, and hence the two-sided limit, does not exist. As $x \\to \\infty$, $\\sqrt{x - h} \\to \\infty$.\n\nFor $\\sqrt{x - 2}$: $\\sqrt{2.01 - 2} = 0.1$ and $\\sqrt{2.0001 - 2} = 0.01$, closing in on $0$, while at $x = 1.99$ the radicand is $-0.01$ and there is no value.\n\nCheck: $\\sqrt{10002 - 2} = 100$ and $\\sqrt{1000002 - 2} = 1000$, growing without bound.\n\n> **Watch out.** A limit can only use the side where the function has values. When the question asks for the two-sided limit at the endpoint, or for the side outside the domain, the limit does not exist; it is not $0$.",
        "$\\sqrt{x - h}$ 只在 $x \\ge h$ 时有定义。所以 $\\lim_{x \\to h^{+}} \\sqrt{x - h} = 0$，而左极限以及双侧极限都不存在。当 $x \\to \\infty$ 时，$\\sqrt{x - h} \\to \\infty$。\n\n对于 $\\sqrt{x - 2}$：$\\sqrt{2.01 - 2} = 0.1$，$\\sqrt{2.0001 - 2} = 0.01$，逼近 $0$；而 $x = 1.99$ 时被开方数为 $-0.01$，没有函数值。\n\n检验：$\\sqrt{10002 - 2} = 100$，$\\sqrt{1000002 - 2} = 1000$，无界增大。\n\n> **注意。** 极限只能用函数有值的那一侧。题目问端点处的双侧极限，或问定义域外那一侧的极限时，极限不存在，而不是 $0$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(-4, 4);
        const reflected = rng.bool(0.3);
        const inner = reflected ? poly([-1, "x"], [h, ""]) : bare(h);
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const expr = `${coef}\\sqrt{${inner}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const kind = rng.int(0, 2);
        // The domain is x ≥ h, or x ≤ h when reflected.
        const inside: Side = reflected ? -1 : 1;
        const outside: Side = reflected ? 1 : -1;
        const f = (x: number) => a * Math.sqrt(reflected ? h - x : x - h) + c;
        const twoSided = rng.bool();
        const operator =
          kind === 0 ? lim(h, inside) : kind === 1 ? (twoSided ? lim(h) : lim(h, outside)) : lim(reflected ? "-\\infty" : "\\infty");
        const answer: LimitValue = kind === 0 ? Q.of(c) : kind === 1 ? "dne" : a > 0 ? "inf" : "-inf";
        const domain = `x ${reflected ? "\\le" : "\\ge"} ${h}`;
        const outsideX = h + outside * 0.01;
        const radicandAt = reflected ? h - outsideX : outsideX - h;
        const steps1: readonly Step[] =
          kind === 0
            ? [
                [
                  ["Find the domain", "找出定义域"],
                  t(
                    `The radicand $${inner}$ is nonnegative for $${domain}$, so the side asked for lies inside the domain.`,
                    `被开方数 $${inner}$ 在 $${domain}$ 时非负，所以所问的一侧在定义域内。`,
                  ),
                ],
                [
                  ["Let the radicand shrink", "被开方数趋于零"],
                  t(
                    `From that side the radicand tends to $0$, so the root does too, leaving the constant:`,
                    `从这一侧看，被开方数趋于 $0$，根式也趋于 $0$，只剩下常数：`,
                  ),
                  [`${operator} \\left(${expr}\\right) = ${c}`],
                ],
              ]
            : kind === 1
              ? [
                  [
                    ["Find the domain", "找出定义域"],
                    t(`The radicand $${inner}$ is nonnegative only for $${domain}$.`, `被开方数 $${inner}$ 只在 $${domain}$ 时非负。`),
                  ],
                  [
                    ["Look at the side asked for", "看所问的一侧"],
                    twoSided
                      ? t(
                          `A two-sided limit needs values on both sides of $${h}$, but on the ${outside < 0 ? "left" : "right"} there are none. So the limit does not exist.`,
                          `双侧极限要求 $${h}$ 两侧都有函数值，但${outside < 0 ? "左" : "右"}侧没有。所以极限不存在。`,
                        )
                      : t(
                          `The ${outside < 0 ? "left" : "right"} side of $${h}$ is outside the domain, so there are no values to approach and the limit does not exist.`,
                          `$${h}$ 的${outside < 0 ? "左" : "右"}侧在定义域之外，没有可以趋近的函数值，所以极限不存在。`,
                        ),
                  ],
                ]
              : [
                  [
                    ["Let the radicand grow", "被开方数增大"],
                    t(
                      `As $x \\to ${reflected ? "-\\infty" : "\\infty"}$, the radicand $${inner}$ grows without bound, and so does its square root.`,
                      `当 $x \\to ${reflected ? "-\\infty" : "\\infty"}$ 时，被开方数 $${inner}$ 无界增大，其平方根也无界增大。`,
                    ),
                  ],
                  [
                    ["Apply the coefficient", "乘以系数"],
                    t(`Multiplying by $${a}$ ${a > 0 ? "keeps" : "flips"} the sign:`, `乘以 $${a}$ ${a > 0 ? "不改变" : "改变"}符号：`),
                    [`${operator} \\left(${expr}\\right) = ${infL(a)}`],
                  ],
                ];
        const check =
          kind === 0
            ? t(
                `Evaluate the function closer and closer to $x = ${h}$ from inside the domain:\n\n${sideTable(h, inside, f)}\n\nThe values close in on $${c}$.`,
                `从定义域内越来越接近 $x = ${h}$，计算函数值：\n\n${sideTable(h, inside, f)}\n\n函数值逼近 $${c}$。`,
              )
            : kind === 1
              ? t(
                  `Try a point just outside the domain, $x = ${fmt(outsideX)}$: the radicand is $${fmt(radicandAt)}$, which has no real square root.\n\nThe same happens at every $x$ on that side, however close to $${h}$, so there are no values there for a limit to use.`,
                  `取定义域外紧邻的一点 $x = ${fmt(outsideX)}$：被开方数为 $${fmt(radicandAt)}$，没有实数平方根。\n\n在那一侧，无论多接近 $${h}$，每个 $x$ 都是如此，所以那里没有可供极限使用的函数值。`,
                )
              : t(
                  `Evaluate the function further and further ${reflected ? "left" : "right"}:\n\n${farTable(reflected ? -1 : 1, f)}\n\nThe values keep growing in size with the sign of $${a}$, without levelling off.`,
                  `计算越来越靠${reflected ? "左" : "右"}处的函数值：\n\n${farTable(reflected ? -1 : 1, f)}\n\n函数值的绝对值不断增大，符号与 $${a}$ 相同，不会趋于水平。`,
                );
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return kind === 0
              ? [
                  `From inside the domain the function has values, and they approach $${c}$, so this one-sided limit exists.`,
                  `从定义域内看函数有值，且趋近 $${c}$，所以这个单侧极限存在。`,
                ]
              : [
                  `Far out the values grow without bound in one direction, so the limit is written as $${infL(a)}$.`,
                  `在远处函数值朝一个方向无界增大，所以极限记作 $${infL(a)}$。`,
                ];
          if (v === "inf" || v === "-inf") {
            if (kind === 2)
              return [
                `The square root is positive and grows; multiplied by $${a}$ it heads to $${infL(a)}$.`,
                `平方根为正且不断增大；乘以 $${a}$ 后趋于 $${infL(a)}$。`,
              ];
            if (kind === 0)
              return [
                `Near $x = ${h}$ the root is close to $0$, so the values stay close to $${c}$; they are not unbounded.`,
                `在 $x = ${h}$ 附近根式接近 $0$，所以函数值接近 $${c}$，并非无界。`,
              ];
            return [
              `On the side asked for there are no values at all, so they cannot grow without bound; the limit does not exist.`,
              `在所问的一侧根本没有函数值，谈不上无界增大；极限不存在。`,
            ];
          }
          if (v.eq(Q.of(c)))
            return kind === 1
              ? [
                  `$${c}$ is approached only from inside the domain; the limit asked for needs values ${twoSided ? "on both sides, and outside the domain there are none" : "on the other side, where there are none"}.`,
                  `只有从定义域内才趋近 $${c}$；所问的极限需要${twoSided ? "两侧的函数值，而定义域外没有" : "另一侧的函数值，而那里没有"}。`,
                ]
              : [`$${c}$ is the value at the endpoint; far out the root grows without bound.`, `$${c}$ 是端点处的值；在远处根式无界增大。`];
          if (v.isZero())
            return kind === 0
              ? [
                  `The root tends to $0$, but $${c}$ is still added, so the limit is $${c}$.`,
                  `根式趋于 $0$，但还要加上 $${c}$，所以极限是 $${c}$。`,
                ]
              : kind === 1
                ? [
                    `The root tends to $0$ only from inside the domain; on the side asked for there are no values, so the limit does not exist.`,
                    `只有从定义域内根式才趋于 $0$；所问的一侧没有函数值，所以极限不存在。`,
                  ]
                : [`The radicand grows without bound, so the root does not shrink to $0$.`, `被开方数无界增大，所以根式不会缩小到 $0$。`];
          return [
            `$${h}$ is the endpoint of the domain, an $x$-value, not a height the function approaches.`,
            `$${h}$ 是定义域的端点，是一个 $x$ 值，而不是函数趋近的高度。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${operator} \\left(${expr}\\right)$.`, `求 $${operator} \\left(${expr}\\right)$。`),
          answer,
          [Q.of(c), Q.zero, Q.of(h)],
          walked(steps1, check),
          reason,
          undefined,
          true,
        );
      },
    },
  ],
};

/** paren writes a number in parentheses when negative. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** trigValue is the exact value of sin, cos or tan at a special angle, or undefined where tan is not defined. */
function trigValue(name: "sin" | "cos" | "tan", angle: (typeof specialAngles)[number]) {
  if (name === "sin") return angle.sin;
  if (name === "cos") return angle.cos;
  return angle.cos.c.isZero() ? undefined : exactDiv(angle.sin, angle.cos);
}

/** limitsOfTrigonometricFunctions finds limits of sine, cosine and tangent. */
export const limitsOfTrigonometricFunctions: TopicDef = {
  id: "limits-of-trigonometric-functions",
  title: t("Limits of Trigonometric Functions", "三角函数的极限"),
  summary: t(
    "Find limits of sine, cosine and tangent at special angles, at the asymptotes of tangent, and at infinity.",
    "求正弦、余弦、正切在特殊角处、正切的渐近线处以及无穷远处的极限。",
  ),
  prerequisites: ["infinite-limits-from-graphs", "graphing-tangent-and-cotangent"],
  encompasses: [{ topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `The graph of $y = \\tan x$ has a vertical asymptote at $x = \\frac{\\pi}{2} \\approx 1.571$: it shoots up just to the left and comes up from far below just to the right. A table shows the infinite limits

$$\\tan 1.56 \\approx 92.6, \\qquad \\tan 1.58 \\approx -108.6$$

Check: closer in, $\\tan 1.57 \\approx 1255.8$, larger still on the left.

In this lesson we find limits of sine, cosine and tangent at special angles, at the asymptotes of tangent, and as $x \\to \\pm\\infty$.`,
    `$y = \\tan x$ 的图像在 $x = \\frac{\\pi}{2} \\approx 1.571$ 处有竖直渐近线：紧靠左侧向上无限延伸，紧靠右侧从很低处上来。数值表显示了这些无穷极限：

$$\\tan 1.56 \\approx 92.6, \\qquad \\tan 1.58 \\approx -108.6$$

检验：再靠近一些，$\\tan 1.57 \\approx 1255.8$，左侧的值更大。

这节课我们求正弦、余弦、正切在特殊角处、正切的渐近线处以及 $x \\to \\pm\\infty$ 时的极限。`,
  ),
  knowledgePoints: [
    {
      id: "trigonometric-limits-at-special-angles",
      figure: calculusDrawings1["limits-of-trigonometric-functions#trigonometric-limits-at-special-angles"],
      title: t("Limits at special angles", "特殊角处的极限"),
      explanation: t(
        "Sine and cosine have no breaks, and tangent has none where $\\cos x \\ne 0$, so their limits are their values:\n\n$$\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}, \\qquad \\lim_{x \\to \\frac{3\\pi}{4}} \\tan x = -1.$$\n\nCheck: $\\frac{\\pi}{3} \\approx 1.047$ and $\\cos 1.05 \\approx 0.498$, close to $\\frac{1}{2}$.\n\n> **Watch out.** Use the unit circle for the sign: $\\frac{3\\pi}{4}$ is in the second quadrant, where cosine is negative, so $\\tan \\frac{3\\pi}{4}$ is $-1$, not $1$.",
        "正弦和余弦没有间断，正切在 $\\cos x \\ne 0$ 处也没有间断，所以它们的极限等于函数值：\n\n$$\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}, \\qquad \\lim_{x \\to \\frac{3\\pi}{4}} \\tan x = -1.$$\n\n检验：$\\frac{\\pi}{3} \\approx 1.047$，$\\cos 1.05 \\approx 0.498$，接近 $\\frac{1}{2}$。\n\n> **注意。** 用单位圆判断符号：$\\frac{3\\pi}{4}$ 在第二象限，那里余弦为负，所以 $\\tan \\frac{3\\pi}{4}$ 是 $-1$，不是 $1$。",
      ),
      generate(rng) {
        const name = rng.pick(["sin", "cos", "tan"] as const);
        const angle = rng.pick(specialAngles.filter((s) => trigValue(name, s) !== undefined));
        const v = trigValue(name, angle) ?? angle.sin;
        const answer = exactLatex(v);
        const other = exactLatex(name === "sin" ? angle.cos : angle.sin);
        const f = name === "sin" ? Math.sin : name === "cos" ? Math.cos : Math.tan;
        const parts = [
          ...(angle.n === 0 ? [] : [`$${angle.latex} \\approx ${fmt(angle.value)}$`]),
          ...(v.m === 1 && v.c.isInteger() ? [] : [`$${answer} \\approx ${fmt(exactNumber(v))}$`]),
        ];
        const decimals = parts.length === 0 ? t("", "") : t(`In decimals, ${parts.join(" and ")}. `, `化成小数，${parts.join("，")}。`);
        return functionProblem({
          prompt: t(`Find $${lim(angle.latex)} \\${name} x$.`, `求 $${lim(angle.latex)} \\${name} x$。`),
          answer,
          wrong: [other, `-${answer}`.replace("--", ""), "1"],
          solution: walked(
            [
              [
                ["Check for a break", "检查是否间断"],
                name === "tan"
                  ? t(
                      `At $x = ${angle.latex}$, $\\cos x = ${exactLatex(angle.cos)} \\ne 0$, so $\\tan x$ has no break there.`,
                      `在 $x = ${angle.latex}$ 处，$\\cos x = ${exactLatex(angle.cos)} \\ne 0$，所以 $\\tan x$ 在那里没有间断。`,
                    )
                  : t(
                      `$\\${name} x$ has no breaks anywhere, so the limit is the value.`,
                      `$\\${name} x$ 处处没有间断，所以极限等于函数值。`,
                    ),
              ],
              [
                ["Evaluate", "求值"],
                t(`From the unit circle:`, `由单位圆：`),
                [`${lim(angle.latex)} \\${name} x = \\${name} ${angle.latex} = ${answer}`],
              ],
            ],
            t(
              `${decimals.en}Estimate the limit from values close to $x = ${fmt(angle.value)}$:\n\n${closeTable(angle.value, f, `\\${name} x`)}\n\nThe values close in on $${fmt(exactNumber(v))}$.`,
              `${decimals["zh-CN"]}用 $x = ${fmt(angle.value)}$ 附近的值估计极限：\n\n${closeTable(angle.value, f, `\\${name} x`)}\n\n函数值逼近 $${fmt(exactNumber(v))}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "infinite-and-nonexistent-trigonometric-limits",
      figure: calculusDrawings1["limits-of-trigonometric-functions#infinite-and-nonexistent-trigonometric-limits"],
      title: t("Infinite and nonexistent limits", "无穷极限与不存在的极限"),
      explanation: t(
        "$\\tan x = \\frac{\\sin x}{\\cos x}$ has vertical asymptotes where $\\cos x = 0$. Just left of $\\frac{\\pi}{2}$, $\\tan x \\to \\infty$; just right, $\\tan x \\to -\\infty$; so $\\lim_{x \\to \\pi/2} \\tan x$ does not exist.\n\nAs $x \\to \\pm\\infty$, $\\sin x$ and $\\cos x$ keep oscillating between $-1$ and $1$, so their limits do not exist.\n\nCheck: $\\sin x$ is $1$ at $x = \\frac{\\pi}{2} + 2\\pi n$ and $-1$ at $x = \\frac{3\\pi}{2} + 2\\pi n$ for every whole number $n$, however large, so it never settles.\n\n> **Watch out.** An oscillating function is bounded, so its limit at infinity is not $\\infty$ either; the limit simply does not exist. A negative multiplier in front of $\\tan x$ swaps the signs on the two sides.",
        "$\\tan x = \\frac{\\sin x}{\\cos x}$ 在 $\\cos x = 0$ 处有竖直渐近线。在 $\\frac{\\pi}{2}$ 左侧附近 $\\tan x \\to \\infty$；右侧附近 $\\tan x \\to -\\infty$；所以 $\\lim_{x \\to \\pi/2} \\tan x$ 不存在。\n\n当 $x \\to \\pm\\infty$ 时，$\\sin x$ 和 $\\cos x$ 在 $-1$ 与 $1$ 之间不停振荡，所以极限不存在。\n\n检验：对每个整数 $n$，无论多大，$\\sin x$ 在 $x = \\frac{\\pi}{2} + 2\\pi n$ 处为 $1$，在 $x = \\frac{3\\pi}{2} + 2\\pi n$ 处为 $-1$，所以它永远不会稳定下来。\n\n> **注意。** 振荡的函数是有界的，所以它在无穷远处的极限也不是 $\\infty$；极限就是不存在。$\\tan x$ 前面的负系数会使两侧的符号互换。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, -1, -2, 5]);
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        if (rng.bool(0.25)) {
          const fns = [
            { latex: "\\sin x", at: (x: number) => Math.sin(x) },
            { latex: "\\cos x", at: (x: number) => Math.cos(x) },
            { latex: "\\sin 2x", at: (x: number) => Math.sin(2 * x) },
            { latex: "\\cos 3x", at: (x: number) => Math.cos(3 * x) },
          ];
          const fn = rng.pick(fns);
          const toPlus = rng.bool();
          const target = toPlus ? "\\infty" : "-\\infty";
          const size = Math.abs(a);
          const f = (x: number) => a * fn.at(x);
          const reason = (v: LimitValue): readonly [string, string] => {
            if (v === "inf" || v === "-inf" || v === "dne")
              return [
                `The values stay between $${-size}$ and $${size}$, so they are bounded and cannot head to $\\infty$ or $-\\infty$.`,
                `函数值始终在 $${-size}$ 与 $${size}$ 之间，是有界的，不可能趋于 $\\infty$ 或 $-\\infty$。`,
              ];
            if (v.isZero())
              return [
                `The values swing back and forth through $0$ but never settle there; they keep returning to $${size}$ and $${-size}$.`,
                `函数值来回穿过 $0$，但从不稳定在 $0$；它们不断回到 $${size}$ 与 $${-size}$。`,
              ];
            return [
              `The values reach $${v.toLatex()}$ again and again, but in between they swing to $${v.neg().toLatex()}$, so they never settle at $${v.toLatex()}$.`,
              `函数值一次次达到 $${v.toLatex()}$，但其间又摆到 $${v.neg().toLatex()}$，所以从不稳定在 $${v.toLatex()}$。`,
            ];
          };
          return limitAsk(
            rng,
            t(`Find $${lim(target)} ${coef}${fn.latex}$.`, `求 $${lim(target)} ${coef}${fn.latex}$。`),
            "dne",
            [Q.zero, Q.of(a), Q.of(-a)],
            walked(
              [
                [
                  ["See the oscillation", "看出振荡"],
                  t(
                    `As $x \\to ${target}$, $${fn.latex}$ keeps swinging between $-1$ and $1$, reaching both values again and again.`,
                    `当 $x \\to ${target}$ 时，$${fn.latex}$ 在 $-1$ 与 $1$ 之间不停摆动，一次又一次达到这两个值。`,
                  ),
                ],
                [
                  ["Draw the conclusion", "得出结论"],
                  t(
                    `So $${coef}${fn.latex}$ swings between $${-size}$ and $${size}$ and settles at no number. It is bounded, so it does not tend to $\\pm\\infty$ either: the limit does not exist.`,
                    `所以 $${coef}${fn.latex}$ 在 $${-size}$ 与 $${size}$ 之间摆动，不稳定于任何数。它有界，所以也不趋于 $\\pm\\infty$：极限不存在。`,
                  ),
                ],
              ],
              t(
                `Evaluate the function further and further ${toPlus ? "right" : "left"}:\n\n${farTable(toPlus ? 1 : -1, f)}\n\nThe values jump about between $${-size}$ and $${size}$ instead of closing in on a number.`,
                `计算越来越靠${toPlus ? "右" : "左"}处的函数值：\n\n${farTable(toPlus ? 1 : -1, f)}\n\n函数值在 $${-size}$ 与 $${size}$ 之间跳动，而不是逼近某个数。`,
              ),
            ),
            reason,
            undefined,
            true,
          );
        }
        const k = rng.pick([-3, -1, 1, 3]);
        const at = piLatex(k, 2);
        const x0 = (k * Math.PI) / 2;
        const side = rng.pick([-1, 1, 0] as const);
        // tan x → +∞ just left of each asymptote and −∞ just right.
        const sign = (s: Side) => -s * Math.sign(a);
        const answer: LimitValue = side === 0 ? "dne" : sign(side) > 0 ? "inf" : "-inf";
        const operator = side === 0 ? lim(at) : lim(at, side);
        const f = (x: number) => a * Math.tan(x);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return [
              `On one side the values go one definite way, so this one-sided limit is $\\infty$ or $-\\infty$.`,
              `在一侧函数值有确定的去向，所以这个单侧极限是 $\\infty$ 或 $-\\infty$。`,
            ];
          if (v === "inf" || v === "-inf") {
            const s = v === "inf" ? 1 : -1;
            if (side === 0)
              return [
                `Only one side heads to $${infL(s)}$; the other heads to $${infL(-s)}$, so the two-sided limit does not exist.`,
                `只有一侧趋于 $${infL(s)}$，另一侧趋于 $${infL(-s)}$，所以双侧极限不存在。`,
              ];
            return [
              `The sign is wrong: just to the ${side < 0 ? "left" : "right"} of $${at}$, $\\tan x \\to ${infL(-side)}$, and multiplying by $${a}$ gives $${infL(sign(side))}$.`,
              `符号错了：紧靠 $${at}$ ${side < 0 ? "左" : "右"}侧，$\\tan x \\to ${infL(-side)}$，乘以 $${a}$ 得 $${infL(sign(side))}$。`,
            ];
          }
          if (v.isZero())
            return [
              `$\\tan x$ is $0$ where $\\sin x = 0$; at $x = ${at}$ it is $\\cos x$ that is $0$, so the values are unbounded.`,
              `$\\tan x$ 在 $\\sin x = 0$ 处为 $0$；而在 $x = ${at}$ 处为 $0$ 的是 $\\cos x$，所以函数值无界。`,
            ];
          return [
            `$${a}$ only scales $\\tan x$; the tangent itself is unbounded next to $x = ${at}$.`,
            `$${a}$ 只是 $\\tan x$ 的倍数；在 $x = ${at}$ 旁正切本身无界。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${operator} ${coef}\\tan x$.`, `求 $${operator} ${coef}\\tan x$。`),
          answer,
          [Q.zero, Q.of(a)],
          walked(
            [
              [
                ["Find the asymptote", "找出渐近线"],
                t(
                  `At $x = ${at}$, $\\cos x = 0$ while $\\sin x = ${k === 1 || k === -3 ? 1 : -1}$, so $\\tan x = \\frac{\\sin x}{\\cos x}$ has a vertical asymptote.`,
                  `在 $x = ${at}$ 处，$\\cos x = 0$ 而 $\\sin x = ${k === 1 || k === -3 ? 1 : -1}$，所以 $\\tan x = \\frac{\\sin x}{\\cos x}$ 有竖直渐近线。`,
                ),
              ],
              [
                ["Read the two sides", "看两侧"],
                t(
                  `Just left, $\\tan x \\to \\infty$; just right, $\\tan x \\to -\\infty$. With the factor $${a}$: left $${infL(sign(-1))}$, right $${infL(sign(1))}$.`,
                  `紧靠左侧 $\\tan x \\to \\infty$，紧靠右侧 $\\tan x \\to -\\infty$。乘以 $${a}$ 后：左侧 $${infL(sign(-1))}$，右侧 $${infL(sign(1))}$。`,
                ),
              ],
              [
                ["Answer the question", "回答所问"],
                side === 0
                  ? t(`The sides differ, so the two-sided limit does not exist.`, `两侧不同，所以双侧极限不存在。`)
                  : t(
                      `The question asks for the ${side < 0 ? "left" : "right"}-sided limit, which is $${infL(sign(side))}$.`,
                      `题目问的是${side < 0 ? "左" : "右"}极限，它是 $${infL(sign(side))}$。`,
                    ),
              ],
            ],
            t(
              `In decimals $${at} \\approx ${fmt(x0)}$. Evaluate the function on both sides of it:\n\n${nearTable(x0, f, f, `${coef}\\tan x`)}\n\nThe values have opposite signs on the two sides and grow in size closer in, which matches the answer.`,
              `化成小数，$${at} \\approx ${fmt(x0)}$。计算它两侧的函数值：\n\n${nearTable(x0, f, f, `${coef}\\tan x`)}\n\n两侧函数值符号相反，越靠近绝对值越大，与答案一致。`,
            ),
          ),
          reason,
          undefined,
          true,
        );
      },
    },
  ],
};

/** limitsOfReciprocalTrigonometricFunctions finds limits of secant, cosecant and cotangent. */
export const limitsOfReciprocalTrigonometricFunctions: TopicDef = {
  id: "limits-of-reciprocal-trigonometric-functions",
  title: t("Limits of Reciprocal Trigonometric Functions", "倒数三角函数的极限"),
  summary: t(
    "Find limits of secant, cosecant and cotangent at special angles and at their asymptotes.",
    "求正割、余割、余切在特殊角处以及渐近线处的极限。",
  ),
  prerequisites: ["limits-of-trigonometric-functions", "graphing-secant-and-cosecant"],
  encompasses: [
    { topic: "limits-of-trigonometric-functions", weight: 0.4 },
    { topic: "graphing-secant-and-cosecant", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Sine and cosine have no breaks, so $\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}$. The quotient rule then gives the limit of the reciprocal:

$$\\lim_{x \\to \\frac{\\pi}{3}} \\sec x = \\frac{1}{\\frac{1}{2}} = 2$$

Check: $\\frac{\\pi}{3} \\approx 1.047$, and $\\frac{1}{\\cos 1.047} \\approx 1.999$, close to $2$.

In this lesson we find limits of secant, cosecant and cotangent at special angles, and at their asymptotes, where the denominator is $0$.`,
    `正弦和余弦没有间断，所以 $\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}$。再由商法则得到倒数的极限：

$$\\lim_{x \\to \\frac{\\pi}{3}} \\sec x = \\frac{1}{\\frac{1}{2}} = 2$$

检验：$\\frac{\\pi}{3} \\approx 1.047$，而 $\\frac{1}{\\cos 1.047} \\approx 1.999$，接近 $2$。

这节课我们求正割、余割、余切在特殊角处，以及在分母为 $0$ 的渐近线处的极限。`,
  ),
  knowledgePoints: [
    {
      id: "reciprocal-trigonometric-limits-at-special-angles",
      figure: calculusDrawings1["limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-at-special-angles"],
      title: t("Limits at special angles", "特殊角处的极限"),
      explanation: t(
        "Evaluate the sine or cosine at the special angle first, check that the denominator is not zero, and then take the reciprocal or quotient. Where the denominator is not zero, $\\sec x = \\frac{1}{\\cos x}$, $\\csc x = \\frac{1}{\\sin x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$ have no breaks, so substitute:\n\n$$\\lim_{x \\to \\frac{\\pi}{6}} \\sec x = \\frac{1}{\\sqrt{3}/2} = \\frac{2\\sqrt{3}}{3}.$$\n\nCheck: $\\frac{2\\sqrt{3}}{3} \\approx 1.155$, and $\\frac{1}{\\cos 0.524} \\approx 1.155$ too.\n\n> **Watch out.** $\\sec x$ is the reciprocal of $\\cos x$, not of $\\sin x$, and not $\\cos^{-1} x$, the inverse function. Rationalize at the end: $\\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$.",
        "先求出特殊角处的正弦或余弦值，确认分母不为零，再取倒数或商。在分母不为零处，$\\sec x = \\frac{1}{\\cos x}$、$\\csc x = \\frac{1}{\\sin x}$、$\\cot x = \\frac{\\cos x}{\\sin x}$ 没有间断，直接代入：\n\n$$\\lim_{x \\to \\frac{\\pi}{6}} \\sec x = \\frac{1}{\\sqrt{3}/2} = \\frac{2\\sqrt{3}}{3}.$$\n\n检验：$\\frac{2\\sqrt{3}}{3} \\approx 1.155$，而 $\\frac{1}{\\cos 0.524} \\approx 1.155$，一致。\n\n> **注意。** $\\sec x$ 是 $\\cos x$ 的倒数，不是 $\\sin x$ 的倒数，也不是反函数 $\\cos^{-1} x$。最后要把分母有理化：$\\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$。",
      ),
      generate(rng) {
        const name = rng.pick(["sec", "csc", "cot"] as const);
        const below = (s: SpecialAngle) => (name === "sec" ? s.cos : s.sin);
        const angle = rng.pick(specialAngles.filter((s) => !below(s).c.isZero()));
        const one = { c: Q.one, m: 1 };
        const den = below(angle);
        const top = name === "cot" ? angle.cos : one;
        const v = exactDiv(top, den);
        const answer = exactLatex(v);
        const flipped = exactLatex(name === "cot" ? exactDiv(angle.sin, angle.cos.c.isZero() ? one : angle.cos) : den);
        const f = (x: number) => (name === "sec" ? 1 / Math.cos(x) : name === "csc" ? 1 / Math.sin(x) : Math.cos(x) / Math.sin(x));
        const denName = name === "sec" ? "cos" : "sin";
        const quotient = name === "cot" ? `\\frac{${exactLatex(angle.cos)}}{${exactLatex(den)}}` : `\\frac{1}{${exactLatex(den)}}`;
        return functionProblem({
          prompt: t(`Find $${lim(angle.latex)} \\${name} x$.`, `求 $${lim(angle.latex)} \\${name} x$。`),
          answer,
          wrong: [flipped, `-${answer}`.replace("--", "")],
          solution: walked(
            [
              [
                ["Check the denominator", "检查分母"],
                t(
                  `At $x = ${angle.latex}$, the denominator is not zero, so $\\${name} x$ has no break there:`,
                  `在 $x = ${angle.latex}$ 处分母不为零，所以 $\\${name} x$ 在那里没有间断：`,
                ),
                [`\\${denName} ${angle.latex} = ${exactLatex(den)} \\ne 0`],
              ],
              [
                ["Substitute", "代入"],
                t(`The limit is the value:`, `极限等于函数值：`),
                [`\\${name} ${angle.latex} = ${quotient} = ${answer}`],
              ],
            ],
            t(
              `In decimals, $${angle.latex} \\approx ${fmt(angle.value)}$. Estimate the limit from values close to it:\n\n${closeTable(angle.value, f, `\\${name} x`)}\n\nThe values close in on $${fmt(exactNumber(v))}$, which is $${answer}$ in decimals.`,
              `化成小数，$${angle.latex} \\approx ${fmt(angle.value)}$。用它附近的值估计极限：\n\n${closeTable(angle.value, f, `\\${name} x`)}\n\n函数值逼近 $${fmt(exactNumber(v))}$，也就是 $${answer}$ 的小数值。`,
            ),
          ),
        });
      },
    },
    {
      id: "reciprocal-trigonometric-limits-at-asymptotes",
      figure: calculusDrawings1["limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-at-asymptotes"],
      title: t("Limits at the asymptotes", "渐近线处的极限"),
      explanation: t(
        "Where the denominator is $0$, the function has a vertical asymptote. Find the sign of the function just to each side:\n\n- just right of $0$, $\\sin x > 0$, so $\\csc x \\to \\infty$ and $\\cot x \\to \\infty$;\n- just left of $0$, both tend to $-\\infty$;\n- just left of $\\frac{\\pi}{2}$, $\\cos x > 0$, so $\\sec x \\to \\infty$; just right, $\\sec x \\to -\\infty$.\n\nCheck: $\\csc 0.001 = \\frac{1}{\\sin 0.001} \\approx 1000$, and $\\csc(-0.001) \\approx -1000$.\n\n> **Watch out.** For $\\cot x = \\frac{\\cos x}{\\sin x}$ the numerator has a sign too: near $x = \\pi$, $\\cos x \\approx -1$, so just right of $\\pi$, where $\\sin x < 0$, $\\cot x \\to \\infty$.",
        "分母为 $0$ 处有竖直渐近线。判断函数在两侧附近的符号：\n\n- 在 $0$ 右侧附近 $\\sin x > 0$，所以 $\\csc x \\to \\infty$，$\\cot x \\to \\infty$；\n- 在 $0$ 左侧附近，二者都趋于 $-\\infty$；\n- 在 $\\frac{\\pi}{2}$ 左侧附近 $\\cos x > 0$，所以 $\\sec x \\to \\infty$；右侧附近 $\\sec x \\to -\\infty$。\n\n检验：$\\csc 0.001 = \\frac{1}{\\sin 0.001} \\approx 1000$，$\\csc(-0.001) \\approx -1000$。\n\n> **注意。** 对 $\\cot x = \\frac{\\cos x}{\\sin x}$，分子也有符号：在 $x = \\pi$ 附近 $\\cos x \\approx -1$，所以紧靠 $\\pi$ 右侧，$\\sin x < 0$，$\\cot x \\to \\infty$。",
      ),
      generate(rng) {
        const name = rng.pick(["sec", "csc", "cot"] as const);
        const k = rng.int(-2, 3);
        // sec has asymptotes at odd multiples of π/2; csc and cot at multiples of π.
        const [n, d] = name === "sec" ? [2 * k - 1, 2] : [k, 1];
        const at = piLatex(n, d);
        const x0 = (n * Math.PI) / d;
        const f = (x: number) => (name === "sec" ? 1 / Math.cos(x) : name === "csc" ? 1 / Math.sin(x) : Math.cos(x) / Math.sin(x));
        const signOn = (s: Side) => Math.sign(f(x0 + s * 1e-4));
        const side = rng.pick([-1, 1] as const);
        const sign = signOn(side);
        const denName = name === "sec" ? "cos" : "sin";
        const denSign = Math.sign((name === "sec" ? Math.cos : Math.sin)(x0 + side * 1e-4));
        const topSign = name === "cot" ? Math.sign(Math.cos(x0)) : 1;
        const word = (s: number) => (s > 0 ? "positive" : "negative");
        const wordZh = (s: number) => (s > 0 ? "正" : "负");
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return [
              `On one side the values go one definite way, so this one-sided limit is $\\infty$ or $-\\infty$.`,
              `在一侧函数值有确定的去向，所以这个单侧极限是 $\\infty$ 或 $-\\infty$。`,
            ];
          if (v === "inf" || v === "-inf")
            return [
              `The sign is wrong: just to the ${side < 0 ? "left" : "right"} of $${at}$ the function is ${word(sign)}, so it heads to $${infL(sign)}$.`,
              `符号错了：紧靠 $${at}$ ${side < 0 ? "左" : "右"}侧函数为${wordZh(sign)}，所以趋于 $${infL(sign)}$。`,
            ];
          if (v.isZero())
            return [
              `It is the denominator $\\${denName} x$ that tends to $0$; dividing by a number near $0$ makes the values huge, not $0$.`,
              `趋于 $0$ 的是分母 $\\${denName} x$；除以接近 $0$ 的数使函数值很大，而不是 $0$。`,
            ];
          return [
            `$${v.toLatex()}$ is a value the function takes away from the asymptote; next to $x = ${at}$ the values are unbounded.`,
            `$${v.toLatex()}$ 是函数在远离渐近线处取到的值；在 $x = ${at}$ 旁函数值无界。`,
          ];
        };
        return limitAsk(
          rng,
          t(`Find $${lim(at, side)} \\${name} x$.`, `求 $${lim(at, side)} \\${name} x$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.one, Q.of(-1)],
          walked(
            [
              [
                ["Find the asymptote", "找出渐近线"],
                t(
                  `As $x \\to ${at}$, the denominator $\\${denName} x \\to 0$, so the values are unbounded.`,
                  `当 $x \\to ${at}$ 时，分母 $\\${denName} x \\to 0$，所以函数值无界。`,
                ),
              ],
              [
                ["Find the sign", "确定符号"],
                name === "cot"
                  ? t(
                      `Near $${at}$, $\\cos x$ is ${word(topSign)}, and just to the ${side < 0 ? "left" : "right"}, $\\sin x$ is ${word(denSign)}. The quotient is ${word(sign)}:`,
                      `在 $${at}$ 附近 $\\cos x$ 为${wordZh(topSign)}，紧靠${side < 0 ? "左" : "右"}侧 $\\sin x$ 为${wordZh(denSign)}。商为${wordZh(sign)}：`,
                    )
                  : t(
                      `Just to the ${side < 0 ? "left" : "right"} of $${at}$, $\\${denName} x$ is ${word(denSign)}, so its reciprocal is ${word(sign)}:`,
                      `紧靠 $${at}$ ${side < 0 ? "左" : "右"}侧，$\\${denName} x$ 为${wordZh(denSign)}，所以它的倒数为${wordZh(sign)}：`,
                    ),
                [`${lim(at, side)} \\${name} x = ${infL(sign)}`],
              ],
            ],
            t(
              `${n === 0 ? "" : `In decimals $${at} \\approx ${fmt(x0)}$. `}Evaluate the function closer and closer to $x = ${at}$ from the ${side < 0 ? "left" : "right"}:\n\n${sideTable(x0, side, f, `\\${name} x`)}\n\nThe values are ${word(sign)} and grow in size, heading to $${infL(sign)}$.`,
              `${n === 0 ? "" : `化成小数，$${at} \\approx ${fmt(x0)}$。`}从${side < 0 ? "左" : "右"}侧越来越接近 $x = ${at}$，计算函数值：\n\n${sideTable(x0, side, f, `\\${name} x`)}\n\n函数值为${wordZh(sign)}，绝对值越来越大，趋于 $${infL(sign)}$。`,
            ),
          ),
          reason,
          undefined,
          true,
        );
      },
    },
  ],
};

/** inverseTrigValues are the exact values of arcsin, arccos and arctan at nice arguments, as multiples nπ/d. */
const inverseTrigValues: readonly { name: "arcsin" | "arccos" | "arctan"; arg: string; n: number; d: number }[] = [
  ...(
    [
      ["0", 0, 1],
      ["\\frac{1}{2}", 1, 6],
      ["-\\frac{1}{2}", -1, 6],
      ["\\frac{\\sqrt{2}}{2}", 1, 4],
      ["-\\frac{\\sqrt{2}}{2}", -1, 4],
      ["\\frac{\\sqrt{3}}{2}", 1, 3],
      ["-\\frac{\\sqrt{3}}{2}", -1, 3],
      ["1", 1, 2],
      ["-1", -1, 2],
    ] as const
  ).flatMap(([arg, n, d]) => [
    { name: "arcsin" as const, arg, n, d },
    // arccos v = π/2 − arcsin v.
    {
      name: "arccos" as const,
      arg,
      n: d % 2 === 0 ? d / 2 - n : d - 2 * n,
      d: d % 2 === 0 ? d : d * 2,
    },
  ]),
  ...(
    [
      ["0", 0, 1],
      ["1", 1, 4],
      ["-1", -1, 4],
      ["\\sqrt{3}", 1, 3],
      ["-\\sqrt{3}", -1, 3],
      ["\\frac{\\sqrt{3}}{3}", 1, 6],
      ["-\\frac{\\sqrt{3}}{3}", -1, 6],
    ] as const
  ).map(([arg, n, d]) => ({ name: "arctan" as const, arg, n, d })),
];

/** limitsOfInverseTrigonometricFunctions finds limits of arcsin, arccos and arctan. */
export const limitsOfInverseTrigonometricFunctions: TopicDef = {
  id: "limits-of-inverse-trigonometric-functions",
  title: t("Limits of Inverse Trigonometric Functions", "反三角函数的极限"),
  summary: t(
    "Find limits of arcsin, arccos and arctan at points of their domain and of arctan at infinity.",
    "求 arcsin、arccos、arctan 在定义域内各点处的极限，以及 arctan 在无穷远处的极限。",
  ),
  prerequisites: [
    "limits-of-trigonometric-functions",
    "further-evaluating-expressions-containing-inverse-trigonometric-functions",
    "graphing-the-inverse-tangent-function",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `An inverse trigonometric value is an angle: $\\arcsin \\frac{1}{2} = \\frac{\\pi}{6}$, because $\\sin \\frac{\\pi}{6} = \\frac{1}{2}$ and $\\frac{\\pi}{6}$ lies in the range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. Near $x = \\frac{1}{2}$ the values of $\\arcsin x$ stay close to that angle:

$$\\arcsin 0.49 \\approx 0.512, \\qquad \\arcsin 0.51 \\approx 0.535$$

Check: $\\frac{\\pi}{6} \\approx 0.524$, which lies between the two.

In this lesson we find limits of $\\arcsin$, $\\arccos$ and $\\arctan$ at points of their domains, and of $\\arctan$ as $x \\to \\pm\\infty$.`,
    `反三角函数的值是一个角：$\\arcsin \\frac{1}{2} = \\frac{\\pi}{6}$，因为 $\\sin \\frac{\\pi}{6} = \\frac{1}{2}$，且 $\\frac{\\pi}{6}$ 在值域 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 内。在 $x = \\frac{1}{2}$ 附近，$\\arcsin x$ 的值都接近这个角：

$$\\arcsin 0.49 \\approx 0.512, \\qquad \\arcsin 0.51 \\approx 0.535$$

检验：$\\frac{\\pi}{6} \\approx 0.524$，正好在两者之间。

这节课我们求 $\\arcsin$、$\\arccos$、$\\arctan$ 在定义域内各点处的极限，以及 $\\arctan$ 在 $x \\to \\pm\\infty$ 时的极限。`,
  ),
  knowledgePoints: [
    {
      id: "inverse-trigonometric-limits-at-a-point",
      figure: calculusDrawings1["limits-of-inverse-trigonometric-functions#inverse-trigonometric-limits-at-a-point"],
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "Inside their domains, $\\arcsin$, $\\arccos$ and $\\arctan$ have no breaks, so the limit is the value: the angle in the function's range whose sine, cosine or tangent is the given number. So $\\lim_{x \\to 1/2} \\arccos x = \\frac{\\pi}{3}$ and $\\lim_{x \\to -1} \\arctan x = -\\frac{\\pi}{4}$.\n\nCheck: $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$ with $\\frac{\\pi}{3}$ in $[0, \\pi]$, and $\\tan\\left(-\\frac{\\pi}{4}\\right) = -1$ with $-\\frac{\\pi}{4}$ in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.\n\n> **Watch out.** Each function has its own range: $\\arcsin$ and $\\arctan$ give angles between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, but $\\arccos$ gives angles between $0$ and $\\pi$. So $\\arccos\\left(-\\frac{1}{2}\\right)$ is $\\frac{2\\pi}{3}$, not $-\\frac{\\pi}{3}$.",
        "在定义域内，$\\arcsin$、$\\arccos$、$\\arctan$ 没有间断，所以极限等于函数值：即在该函数值域内、正弦、余弦或正切等于给定数的那个角。所以 $\\lim_{x \\to 1/2} \\arccos x = \\frac{\\pi}{3}$，$\\lim_{x \\to -1} \\arctan x = -\\frac{\\pi}{4}$。\n\n检验：$\\cos \\frac{\\pi}{3} = \\frac{1}{2}$ 且 $\\frac{\\pi}{3}$ 在 $[0, \\pi]$ 内；$\\tan\\left(-\\frac{\\pi}{4}\\right) = -1$ 且 $-\\frac{\\pi}{4}$ 在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内。\n\n> **注意。** 每个函数有自己的值域：$\\arcsin$ 和 $\\arctan$ 给出 $-\\frac{\\pi}{2}$ 到 $\\frac{\\pi}{2}$ 之间的角，而 $\\arccos$ 给出 $0$ 到 $\\pi$ 之间的角。所以 $\\arccos\\left(-\\frac{1}{2}\\right)$ 是 $\\frac{2\\pi}{3}$，不是 $-\\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const v = rng.pick(inverseTrigValues);
        const k = rng.pick([1, 1, 2, 3, -1]);
        const angle = piLatex(v.n, v.d);
        const answer = piLatex(k * v.n, v.d);
        const angleArg = angle.startsWith("-") ? `\\left(${angle}\\right)` : angle;
        const coef = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        const argLatex = v.arg.startsWith("-") ? `\\left(${v.arg}\\right)` : v.arg;
        const theta = (v.n * Math.PI) / v.d;
        const x0 = v.name === "arcsin" ? Math.sin(theta) : v.name === "arccos" ? Math.cos(theta) : Math.tan(theta);
        const inverse = v.name === "arcsin" ? Math.asin : v.name === "arccos" ? Math.acos : Math.atan;
        const f = (x: number) => k * inverse(x);
        const forward = v.name.slice(3);
        const range =
          v.name === "arccos"
            ? "[0, \\pi]"
            : v.name === "arcsin"
              ? "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]"
              : "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)";
        const edge = v.name !== "arctan" && Math.abs(Math.abs(x0) - 1) < 1e-9;
        const inside: Side = x0 > 0 ? -1 : 1;
        const tableText = edge ? sideTable(x0, inside, f, `${coef}\\${v.name} x`) : closeTable(x0, f, `${coef}\\${v.name} x`);
        return functionProblem({
          prompt: t(`Find $${lim(v.arg)} ${coef}\\${v.name} x$.`, `求 $${lim(v.arg)} ${coef}\\${v.name} x$。`),
          answer,
          wrong: [piLatex(-k * v.n, v.d), piLatex(k * (v.d - 2 * v.n), 2 * v.d), piLatex(k * v.n, 2 * v.d)],
          solution: walked(
            [
              [
                ["Find the angle", "求出角"],
                t(
                  `The angle in $${range}$ whose ${forward === "sin" ? "sine" : forward === "cos" ? "cosine" : "tangent"} is $${v.arg}$ is $${angle}$, since $\\${forward} ${angleArg} = ${v.arg}$:`,
                  `在 $${range}$ 内${forward === "sin" ? "正弦" : forward === "cos" ? "余弦" : "正切"}为 $${v.arg}$ 的角是 $${angle}$，因为 $\\${forward} ${angleArg} = ${v.arg}$：`,
                ),
                [`\\${v.name} ${argLatex} = ${angle}`],
              ],
              [
                ["Use continuity", "利用连续性"],
                k === 1
                  ? t(
                      `$\\${v.name} x$ has no break at $x = ${v.arg}$, so the limit is this value, $${answer}$.`,
                      `$\\${v.name} x$ 在 $x = ${v.arg}$ 处没有间断，所以极限就是这个值 $${answer}$。`,
                    )
                  : t(
                      `$\\${v.name} x$ has no break at $x = ${v.arg}$, so the limit is this value times $${k}$:`,
                      `$\\${v.name} x$ 在 $x = ${v.arg}$ 处没有间断，所以极限是这个值乘以 $${k}$：`,
                    ),
                k === 1
                  ? []
                  : [`${lim(v.arg)} ${coef}\\${v.name} x = ${k} \\cdot ${angle === "0" ? "0" : `\\left(${angle}\\right)`} = ${answer}`],
              ],
            ],
            t(
              `In decimals the answer is about $${fmt(k * theta)}$. Estimate the limit from values close to $x = ${fmt(x0)}$${edge ? ", inside the domain" : ""}:\n\n${tableText}\n\nThe values close in on $${fmt(k * theta)}$.`,
              `化成小数，答案约为 $${fmt(k * theta)}$。用 $x = ${fmt(x0)}$ 附近${edge ? "定义域内" : ""}的值估计极限：\n\n${tableText}\n\n函数值逼近 $${fmt(k * theta)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "arctangent-limits-at-infinity",
      figure: calculusDrawings1["limits-of-inverse-trigonometric-functions#arctangent-limits-at-infinity"],
      title: t("Arctangent at infinity", "无穷远处的反正切"),
      explanation: t(
        "$\\arctan x$ has horizontal asymptotes $y = \\pm\\frac{\\pi}{2}$:\n\n$$\\lim_{x \\to \\infty} \\arctan x = \\frac{\\pi}{2}, \\qquad \\lim_{x \\to -\\infty} \\arctan x = -\\frac{\\pi}{2}.$$\n\nA positive multiple inside, as in $\\arctan 3x$, does not change these; a negative one swaps them.\n\nCheck: $\\arctan 1000 \\approx 1.570$, and $\\frac{\\pi}{2} \\approx 1.571$.\n\n> **Watch out.** The limit is $\\pm\\frac{\\pi}{2}$, not $\\infty$: arctangent levels off. Multiply the limit by the coefficient outside, and add any constant afterwards.",
        "$\\arctan x$ 有水平渐近线 $y = \\pm\\frac{\\pi}{2}$：\n\n$$\\lim_{x \\to \\infty} \\arctan x = \\frac{\\pi}{2}, \\qquad \\lim_{x \\to -\\infty} \\arctan x = -\\frac{\\pi}{2}.$$\n\n括号内乘以正数（如 $\\arctan 3x$）不改变这些极限；乘以负数则使二者互换。\n\n检验：$\\arctan 1000 \\approx 1.570$，而 $\\frac{\\pi}{2} \\approx 1.571$。\n\n> **注意。** 极限是 $\\pm\\frac{\\pi}{2}$，不是 $\\infty$：反正切会趋于水平。外面的系数乘到极限上，常数最后再加。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, -1, -2]);
        const k = rng.pick([1, 2, 3, -1, -2, -3]);
        const c = rng.int(-3, 3);
        const toPlus = rng.bool();
        const sign = (toPlus ? 1 : -1) * Math.sign(k);
        const halfPi = piLatex(a * sign, 2);
        const answer = c === 0 ? halfPi : `${halfPi} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`;
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const inner = k === 1 ? "x" : k === -1 ? "(-x)" : k < 0 ? `(${k}x)` : `${k}x`;
        const expr = `${coef}\\arctan ${inner}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const target = toPlus ? "\\infty" : "-\\infty";
        const wrongHalf = piLatex(-a * sign, 2);
        const f = (x: number) => a * Math.atan(k * x) + c;
        const value = (a * sign * Math.PI) / 2 + c;
        return functionProblem({
          prompt: t(`Find $${lim(target)} \\left(${expr}\\right)$.`, `求 $${lim(target)} \\left(${expr}\\right)$。`),
          answer,
          wrong: [c === 0 ? wrongHalf : `${wrongHalf} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`, String(c), piLatex(a * sign, 1)],
          solution: walked(
            [
              [
                ["Follow the inside", "看括号内"],
                t(
                  `As $x \\to ${target}$, $${inner} \\to ${infL(sign)}$, so the arctangent levels off:`,
                  `当 $x \\to ${target}$ 时，$${inner} \\to ${infL(sign)}$，所以反正切趋于水平：`,
                ),
                [`\\arctan ${inner} \\to ${piLatex(sign, 2)}`],
              ],
              [
                ["Apply the coefficient and constant", "乘系数、加常数"],
                t(`Multiply by $${a}$${c === 0 ? "" : ` and add $${c}$`}:`, `乘以 $${a}$${c === 0 ? "" : `，再加 $${c}$`}：`),
                [`${lim(target)} \\left(${expr}\\right) = ${answer}`],
              ],
            ],
            t(
              `In decimals the answer is about $${fmt(value)}$. Evaluate the function further and further ${toPlus ? "right" : "left"}:\n\n${farTable(toPlus ? 1 : -1, f)}\n\nThe values close in on $${fmt(value)}$.`,
              `化成小数，答案约为 $${fmt(value)}$。计算越来越靠${toPlus ? "右" : "左"}处的函数值：\n\n${farTable(toPlus ? 1 : -1, f)}\n\n函数值逼近 $${fmt(value)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** casesLatex writes a piecewise definition. */
const casesLatex = (pieces: readonly (readonly [string, string])[]) =>
  `f(x) = \\begin{cases} ${pieces.map(([e, c]) => `${e} & ${c}`).join(" \\\\ ")} \\end{cases}`;

/** limitsOfPiecewiseFunctions finds limits of piecewise-defined functions at their break points. */
export const limitsOfPiecewiseFunctions: TopicDef = {
  id: "limits-of-piecewise-functions",
  title: t("Limits of Piecewise Functions", "分段函数的极限"),
  summary: t(
    "Find one-sided and two-sided limits of piecewise-defined functions at the points where the formula changes.",
    "求分段函数在分段点处的单侧极限和双侧极限。",
  ),
  prerequisites: ["finding-the-existence-of-a-limit-using-one-sided-limits", "the-sum-rule-for-limits"],
  encompasses: [
    { topic: "finding-the-existence-of-a-limit-using-one-sided-limits", weight: 0.4 },
    { topic: "the-sum-rule-for-limits", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `A limit exists when the two one-sided limits agree. A piecewise function uses a different formula on each side of a point, so each side is read from its own formula. For

$$f(x) = \\begin{cases} x + 1 & x < 1 \\\\ 3 - x & x \\ge 1 \\end{cases}$$

the left side gives $1 + 1 = 2$ and the right side $3 - 1 = 2$, so $\\lim_{x \\to 1} f(x) = 2$.

Check: $f(0.99) = 1.99$ and $f(1.01) = 1.99$, both close to $2$.

In this lesson we find one-sided and two-sided limits of piecewise functions at the points where the formula changes.`,
    `两个单侧极限相等时，极限存在。分段函数在一点两侧用不同的表达式，所以每一侧都用它自己的表达式来读。对于

$$f(x) = \\begin{cases} x + 1 & x < 1 \\\\ 3 - x & x \\ge 1 \\end{cases}$$

左侧给出 $1 + 1 = 2$，右侧给出 $3 - 1 = 2$，所以 $\\lim_{x \\to 1} f(x) = 2$。

检验：$f(0.99) = 1.99$，$f(1.01) = 1.99$，都接近 $2$。

这节课我们求分段函数在分段点处的单侧极限和双侧极限。`,
  ),
  knowledgePoints: [
    {
      id: "one-sided-limits-of-piecewise-functions",
      title: t("One-sided limits at a break point", "分段点处的单侧极限"),
      explanation: t(
        "At the break point $x = a$ of a piecewise function, the left-sided limit uses the formula for $x < a$ and the right-sided limit the formula for $x > a$:\n\n$$f(x) = \\begin{cases} x^{2} & x < 2 \\\\ 3x - 1 & x \\ge 2 \\end{cases} \\quad\\Rightarrow\\quad \\lim_{x \\to 2^{-}} f(x) = 4, \\; \\lim_{x \\to 2^{+}} f(x) = 5.$$\n\nCheck: $f(1.99) = 3.9601$, close to $4$, and $f(2.01) = 5.03$, close to $5$.\n\n> **Watch out.** The side of the limit picks the formula; where the equals sign of $\\le$ or $\\ge$ sits only decides $f(a)$, which the limit does not use.",
        "在分段函数的分段点 $x = a$ 处，左极限用 $x < a$ 的表达式，右极限用 $x > a$ 的表达式：\n\n$$f(x) = \\begin{cases} x^{2} & x < 2 \\\\ 3x - 1 & x \\ge 2 \\end{cases} \\quad\\Rightarrow\\quad \\lim_{x \\to 2^{-}} f(x) = 4, \\; \\lim_{x \\to 2^{+}} f(x) = 5.$$\n\n检验：$f(1.99) = 3.9601$，接近 $4$；$f(2.01) = 5.03$，接近 $5$。\n\n> **注意。** 极限所指的那一侧决定用哪个表达式；$\\le$ 或 $\\ge$ 中的等号放在哪边，只决定 $f(a)$，而极限不用 $f(a)$。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = rng.bool() ? quadratic(rng) : linearPiece(rng);
        const right = rng.bool() ? quadratic(rng) : linearPiece(rng);
        const closedLeft = rng.bool();
        const side = rng.pick([-1, 1] as const);
        const chosen = side < 0 ? left : right;
        const answer = chosen.at(a);
        const definition = casesLatex([
          [left.latex, `x ${closedLeft ? "\\le" : "<"} ${a}`],
          [right.latex, `x ${closedLeft ? ">" : "\\ge"} ${a}`],
        ]);
        const sideEn = side < 0 ? "left" : "right";
        const sideZh = side < 0 ? "左" : "右";
        return numberProblem({
          prompt: t(`Let $$${definition}$$ Find $${lim(a, side)} f(x)$.`, `设 $$${definition}$$ 求 $${lim(a, side)} f(x)$。`),
          answer,
          wrong: [side < 0 ? right.at(a) : left.at(a), a],
          solution: walked(
            [
              [
                ["Pick the formula", "选出表达式"],
                t(
                  `For $x$ just to the ${sideEn} of $${a}$, $f(x) = ${chosen.latex}$.`,
                  `当 $x$ 在 $${a}$ 的${sideZh}侧附近时，$f(x) = ${chosen.latex}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `This formula is a polynomial, so its limit is its value at $${a}$:`,
                  `这个表达式是多项式，所以它的极限等于在 $${a}$ 处的值：`,
                ),
                [`${lim(a, side)} f(x) = ${answer}`],
              ],
            ],
            t(
              `Evaluate $f$ closer and closer to $x = ${a}$ from the ${sideEn}:\n\n${sideTable(a, side, chosen.at)}\n\nThe values close in on $${answer}$.`,
              `从${sideZh}侧越来越接近 $x = ${a}$，计算 $f$ 的值：\n\n${sideTable(a, side, chosen.at)}\n\n函数值逼近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "two-sided-limits-of-piecewise-functions",
      title: t("Two-sided limits at a break point", "分段点处的双侧极限"),
      explanation: t(
        "Compute both one-sided limits at the break point. If they agree, that is the limit; if not, the limit does not exist. The value of $f$ at the break point never matters.\n\nFor $f(x) = 2x$ when $x < 3$, $f(3) = 0$ and $f(x) = x + 3$ when $x > 3$, both sides give $6$, so the limit is $6$ although $f(3) = 0$.\n\nCheck: $f(2.99) = 5.98$ and $f(3.01) = 6.01$, both close to $6$.\n\n> **Watch out.** When the one-sided limits differ, the limit does not exist; it is not their average, and it is not the value $f(a)$.",
        "在分段点处计算两个单侧极限。若相等，它就是极限；若不相等，极限不存在。$f$ 在分段点处的值无关紧要。\n\n对于 $x < 3$ 时 $f(x) = 2x$、$f(3) = 0$、$x > 3$ 时 $f(x) = x + 3$，两侧都给出 $6$，所以极限是 $6$，尽管 $f(3) = 0$。\n\n检验：$f(2.99) = 5.98$，$f(3.01) = 6.01$，都接近 $6$。\n\n> **注意。** 单侧极限不相等时，极限不存在；它不是两者的平均值，也不是函数值 $f(a)$。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = rng.bool() ? quadratic(rng) : linearPiece(rng);
        let right = linearPiece(rng);
        if (rng.bool()) {
          // Shift the right piece so that the two pieces meet.
          const shiftBy = left.at(a) - right.at(a);
          const base = right;
          right = {
            latex: poly([base.slope, "x"], [base.intercept + shiftBy, ""]),
            at: (x: number) => base.at(x) + shiftBy,
            slope: base.slope,
            intercept: base.intercept + shiftBy,
          };
        }
        const middle = rng.int(-9, 9);
        const L = left.at(a);
        const R = right.at(a);
        const definition = casesLatex([
          [left.latex, `x < ${a}`],
          [String(middle), `x = ${a}`],
          [right.latex, `x > ${a}`],
        ]);
        const reason = (v: LimitValue): readonly [string, string] => {
          if (v === "dne")
            return [
              `Both one-sided limits are $${L}$, so the limit exists and is $${L}$.`,
              `两个单侧极限都是 $${L}$，所以极限存在，等于 $${L}$。`,
            ];
          if (v === "inf" || v === "-inf")
            return [
              `Both pieces are polynomials, which stay finite near $x = ${a}$; nothing grows without bound.`,
              `两段都是多项式，在 $x = ${a}$ 附近取有限值；没有什么无界增大。`,
            ];
          if (L !== R && v.eq(Q.of(L)))
            return [
              `$${L}$ is only the left-sided limit; the right-sided limit is $${R}$, and they differ.`,
              `$${L}$ 只是左极限；右极限是 $${R}$，二者不相等。`,
            ];
          if (L !== R && v.eq(Q.of(R)))
            return [
              `$${R}$ is only the right-sided limit; the left-sided limit is $${L}$, and they differ.`,
              `$${R}$ 只是右极限；左极限是 $${L}$，二者不相等。`,
            ];
          return [`$${middle}$ is the value $f(${a})$, which a limit never uses.`, `$${middle}$ 是函数值 $f(${a})$，极限从不使用它。`];
        };
        return limitAsk(
          rng,
          t(`Let $$${definition}$$ Find $${lim(a)} f(x)$.`, `设 $$${definition}$$ 求 $${lim(a)} f(x)$。`),
          L === R ? Q.of(L) : "dne",
          [Q.of(middle), Q.of(L), Q.of(R)],
          walked(
            [
              [
                ["Find the left-sided limit", "求左极限"],
                t(`For $x < ${a}$, $f(x) = ${left.latex}$:`, `当 $x < ${a}$ 时，$f(x) = ${left.latex}$：`),
                [`${lim(a, -1)} f(x) = ${L}`],
              ],
              [
                ["Find the right-sided limit", "求右极限"],
                t(`For $x > ${a}$, $f(x) = ${right.latex}$:`, `当 $x > ${a}$ 时，$f(x) = ${right.latex}$：`),
                [`${lim(a, 1)} f(x) = ${R}`],
              ],
              [
                ["Compare", "比较"],
                L === R
                  ? t(
                      `They agree, so the limit is $${L}$. The value $f(${a}) = ${middle}$ plays no part.`,
                      `二者相等，所以极限是 $${L}$。函数值 $f(${a}) = ${middle}$ 不起作用。`,
                    )
                  : t(
                      `They differ, so the limit does not exist. The value $f(${a}) = ${middle}$ plays no part.`,
                      `二者不相等，所以极限不存在。函数值 $f(${a}) = ${middle}$ 不起作用。`,
                    ),
              ],
            ],
            t(
              `Evaluate $f$ on both sides of $x = ${a}$:\n\n${nearTable(a, left.at, right.at)}\n\n${L === R ? `Both sides close in on $${L}$.` : `The left values close in on $${L}$ and the right values on $${R}$, so no single number is approached.`}`,
              `计算 $f$ 在 $x = ${a}$ 两侧的值：\n\n${nearTable(a, left.at, right.at)}\n\n${L === R ? `两侧都逼近 $${L}$。` : `左侧的值逼近 $${L}$，右侧的值逼近 $${R}$，没有一个数能从两侧同时趋近。`}`,
            ),
          ),
          reason,
          undefined,
          true,
        );
      },
    },
  ],
};

/** linearPiece draws a line mx + b with small coefficients. */
function linearPiece(rng: Rng) {
  const slope = rng.nonZero(-4, 4);
  const intercept = rng.int(-6, 6);
  return { latex: poly([slope, "x"], [intercept, ""]), at: (x: number) => slope * x + intercept, slope, intercept };
}

/** calculusILimitTopics are the topics of Calculus I modules 2.2 to 2.4. */
export const calculusILimitTopics: readonly TopicDef[] = [
  theFiniteLimitOfAFunction,
  theLeftAndRightSidedLimitsOfAFunction,
  findingTheExistenceOfALimitUsingOneSidedLimits,
  limitsAtInfinityFromGraphs,
  infiniteLimitsFromGraphs,
  limitsOfPowerFunctionsAndTheConstantRuleForLimits,
  theSumRuleForLimits,
  theProductAndQuotientRulesForLimits,
  thePowerAndRootRulesForLimits,
  limitsAtInfinityOfPolynomials,
  limitsOfReciprocalFunctions,
  limitsOfExponentialFunctions,
  limitsOfLogarithmicFunctions,
  limitsOfRadicalFunctions,
  limitsOfTrigonometricFunctions,
  limitsOfReciprocalTrigonometricFunctions,
  limitsOfInverseTrigonometricFunctions,
  limitsOfPiecewiseFunctions,
];
