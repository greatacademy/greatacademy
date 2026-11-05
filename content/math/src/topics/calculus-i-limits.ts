import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import {
  bare,
  exactDiv,
  exactLatex,
  infL,
  type LimitValue,
  lim,
  limitChoice,
  piLatex,
  range,
  type Side,
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

/** LimitGraph is a graph with a break at x = a: left limit L, right limit R, and value f(a) (undefined when there is no point). */
interface LimitGraph {
  readonly a: number;
  readonly L: number;
  readonly R: number;
  readonly value: number | undefined;
  readonly figure: Figure;
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
    figure: { svg: plane(view, marks), alt: t("The graph of y = f(x).", "y = f(x) 的图像。") },
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
  encompasses: [{ topic: "piecewise-functions", weight: 0.1 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "reading-a-limit-from-a-graph",
      title: t("Reading a limit from a graph", "从图像读出极限"),
      explanation: t(
        "$\\lim_{x \\to a} f(x) = L$ means that $f(x)$ gets as close to $L$ as we like when $x$ is close enough to $a$, but not equal to it.\n\nOn a graph, follow the curve towards $x = a$ from both sides and read the height it approaches. The point at $x = a$ itself does not matter: a hole, or a point somewhere else, does not change the limit.",
        "$\\lim_{x \\to a} f(x) = L$ 表示只要 $x$ 足够接近 $a$（但不等于 $a$），$f(x)$ 就能任意接近 $L$。\n\n在图像上，从两侧沿曲线走向 $x = a$，读出曲线趋近的高度。$x = a$ 处的点本身无关紧要：空心点，或别处的一个点，都不会改变极限。",
      ),
      generate(rng) {
        const g = limitGraph(rng, false, rng.pick([0, 1, 3, 3]));
        return {
          ...numberProblem({
            prompt: t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
            answer: g.L,
            wrong: [...(g.value === undefined ? [] : [g.value]), g.a, g.L + 1, g.L - 1],
            solution: t(
              `From both sides the curve approaches height $${g.L}$ as $x \\to ${g.a}$, so the limit is $${g.L}$. ${describeValue(g).en} The value does not affect the limit.`,
              `当 $x \\to ${g.a}$ 时，曲线从两侧都趋近高度 $${g.L}$，所以极限是 $${g.L}$。${describeValue(g)["zh-CN"]}函数值不影响极限。`,
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
        "The limit and the value of $f$ at $a$ are different questions:\n\n- $\\lim_{x \\to a} f(x)$ is the height the curve approaches near $x = a$;\n- $f(a)$ is the height of the filled point at $x = a$.\n\nThey are equal only when the curve passes through the filled point without a break.",
        "$f$ 在 $a$ 处的极限与函数值是两回事：\n\n- $\\lim_{x \\to a} f(x)$ 是曲线在 $x = a$ 附近趋近的高度；\n- $f(a)$ 是 $x = a$ 处实心点的高度。\n\n只有当曲线不间断地穿过这个实心点时，二者才相等。",
      ),
      generate(rng) {
        const g = limitGraph(rng, false, rng.pick([1, 3, 3]));
        const askValue = rng.bool();
        const value = g.value!;
        return {
          ...numberProblem({
            prompt: askValue
              ? t(`The graph of $y = f(x)$ is shown. Find $f(${g.a})$.`, `图中是 $y = f(x)$ 的图像。求 $f(${g.a})$。`)
              : t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
            answer: askValue ? value : g.L,
            wrong: [askValue ? g.L : value, g.a, -g.a],
            solution: t(
              `The curve approaches height $${g.L}$ from both sides, so $${lim(g.a)} f(x) = ${g.L}$; the filled point gives $f(${g.a}) = ${value}$.`,
              `曲线从两侧趋近高度 $${g.L}$，所以 $${lim(g.a)} f(x) = ${g.L}$；实心点给出 $f(${g.a}) = ${value}$。`,
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
        "When $f(a)$ cannot be computed, evaluate $f$ at points closer and closer to $a$ from both sides. If the values settle towards one number, that number is an estimate of the limit.\n\n| $x$ | $-0.1$ | $-0.01$ | $0.01$ | $0.1$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $\\frac{\\sin x}{x}$ | $0.99833$ | $0.99998$ | $0.99998$ | $0.99833$ |\n\nThe values approach $1$, so $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.",
        "当无法计算 $f(a)$ 时，从两侧在越来越接近 $a$ 的点上计算 $f$。如果函数值稳定地趋向某个数，这个数就是极限的估计值。\n\n| $x$ | $-0.1$ | $-0.01$ | $0.01$ | $0.1$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $\\frac{\\sin x}{x}$ | $0.99833$ | $0.99998$ | $0.99998$ | $0.99833$ |\n\n函数值趋近 $1$，所以 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$。",
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
        return numberProblem({
          prompt: t(
            `Some values of a function $f$ near $x = ${a}$ are shown. Estimate $${lim(a)} f(x)$.\n\n${table(
              ["$x$", ...xs.map((x) => `$${x}$`)],
              ["$f(x)$", ...xs.map((x) => `$${f(x).toFixed(5)}$`)],
            )}`,
            `下表给出函数 $f$ 在 $x = ${a}$ 附近的一些值。估计 $${lim(a)} f(x)$。\n\n${table(
              ["$x$", ...xs.map((x) => `$${x}$`)],
              ["$f(x)$", ...xs.map((x) => `$${f(x).toFixed(5)}$`)],
            )}`,
          ),
          answer,
          ...(answer.isInteger() ? {} : { form: "decimal" as const }),
          wrong: [Q.of(Math.round(f(a + 0.1) * 100), 100), Q.of(a), Q.zero],
          solution: t(
            `As $x$ gets closer to $${a}$ from both sides, the values of $f(x)$ settle towards $${dec(answer)}$.`,
            `当 $x$ 从两侧越来越接近 $${a}$ 时，$f(x)$ 的值稳定地趋向 $${dec(answer)}$。`,
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
  encompasses: [{ topic: "the-finite-limit-of-a-function", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-sided-limits-from-a-graph",
      title: t("One-sided limits from a graph", "从图像读出单侧极限"),
      explanation: t(
        "The **left-sided limit** $\\lim_{x \\to a^{-}} f(x)$ uses only $x < a$; the **right-sided limit** $\\lim_{x \\to a^{+}} f(x)$ uses only $x > a$.\n\nWhere a graph jumps at $x = a$, follow each piece to its end: the left piece ends at the left-sided limit and the right piece starts at the right-sided limit, whatever $f(a)$ is.",
        "**左极限** $\\lim_{x \\to a^{-}} f(x)$ 只考虑 $x < a$；**右极限** $\\lim_{x \\to a^{+}} f(x)$ 只考虑 $x > a$。\n\n若图像在 $x = a$ 处跳跃，沿每一段走到端点：左边一段的端点高度是左极限，右边一段的起点高度是右极限，与 $f(a)$ 无关。",
      ),
      generate(rng) {
        const g = limitGraph(rng, true, rng.int(0, 3));
        const side = rng.pick([-1, 1] as const);
        const answer = side < 0 ? g.L : g.R;
        const w = sideWord(side);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is shown. Find $${lim(g.a, side)} f(x)$.`,
              `图中是 $y = f(x)$ 的图像。求 $${lim(g.a, side)} f(x)$。`,
            ),
            answer,
            wrong: [side < 0 ? g.R : g.L, ...(g.value === undefined ? [] : [g.value]), g.a],
            solution: t(
              `Approaching $x = ${g.a}$ from the ${w.en}, the curve heads to height $${answer}$.`,
              `从${w["zh-CN"]}侧趋近 $x = ${g.a}$ 时，曲线趋向高度 $${answer}$。`,
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
        "A table can show different behavior on each side of $a$. Read the values for $x < a$ to estimate the left-sided limit, and those for $x > a$ for the right-sided limit.",
        "数值表可能显示 $a$ 两侧的不同变化趋势。用 $x < a$ 的值估计左极限，用 $x > a$ 的值估计右极限。",
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
        const tableText = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...xs.map((x) => `$${dec(Q.of(Math.round(f(x) * 1000), 1000))}$`)],
        );
        return numberProblem({
          prompt: t(
            `Some values of $f$ near $x = ${a}$ are shown. Estimate $${lim(a, side)} f(x)$.\n\n${tableText}`,
            `下表给出 $f$ 在 $x = ${a}$ 附近的一些值。估计 $${lim(a, side)} f(x)$。\n\n${tableText}`,
          ),
          answer,
          wrong: [c - side * k, c, a],
          solution: t(
            `For $x$ just to the ${w.en} of $${a}$ the values approach $${answer}$.`,
            `当 $x$ 在 $${a}$ 的${w["zh-CN"]}侧附近时，函数值趋近 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "existence-of-a-limit-from-a-graph",
      title: t("Existence of a limit from a graph", "由图像判断极限是否存在"),
      explanation: t(
        "$\\lim_{x \\to a} f(x)$ exists exactly when both one-sided limits exist and are equal; then it is their common value.\n\nIf the graph jumps at $x = a$, the one-sided limits differ and the limit **does not exist**.",
        "当且仅当两个单侧极限都存在且相等时，$\\lim_{x \\to a} f(x)$ 存在，且等于它们的公共值。\n\n若图像在 $x = a$ 处跳跃，两个单侧极限不相等，极限**不存在**。",
      ),
      generate(rng) {
        const jump = rng.bool();
        const g = limitGraph(rng, jump, rng.int(0, 3));
        const right: LimitValue = jump ? "dne" : Q.of(g.L);
        return limitChoice(
          rng,
          t(`The graph of $y = f(x)$ is shown. Find $${lim(g.a)} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${lim(g.a)} f(x)$。`),
          right,
          [Q.of(g.L), Q.of(g.R), ...(g.value === undefined ? [] : [Q.of(g.value)]), Q.of(g.a)],
          jump
            ? t(
                `$${lim(g.a, -1)} f(x) = ${g.L}$ but $${lim(g.a, 1)} f(x) = ${g.R}$. The one-sided limits differ, so the limit does not exist.`,
                `$${lim(g.a, -1)} f(x) = ${g.L}$，而 $${lim(g.a, 1)} f(x) = ${g.R}$。两个单侧极限不相等，所以极限不存在。`,
              )
            : t(
                `Both one-sided limits equal $${g.L}$, so $${lim(g.a)} f(x) = ${g.L}$.`,
                `两个单侧极限都等于 $${g.L}$，所以 $${lim(g.a)} f(x) = ${g.L}$。`,
              ),
          g.figure,
          true,
        );
      },
    },
    {
      id: "existence-of-a-limit-from-one-sided-limits",
      title: t("Existence of a limit from one-sided limits", "由单侧极限判断极限是否存在"),
      explanation: t(
        "Given the one-sided limits, compare them. If $\\lim_{x \\to 2^{-}} f(x) = 5$ and $\\lim_{x \\to 2^{+}} f(x) = 5$, then $\\lim_{x \\to 2} f(x) = 5$, even if $f(2) = 1$ or $f(2)$ is not defined.",
        "已知两个单侧极限时，比较它们。若 $\\lim_{x \\to 2^{-}} f(x) = 5$ 且 $\\lim_{x \\to 2^{+}} f(x) = 5$，则 $\\lim_{x \\to 2} f(x) = 5$，即使 $f(2) = 1$ 或 $f(2)$ 没有定义。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const L = rng.int(-9, 9);
        const equal = rng.bool();
        const R = equal ? L : rng.pick(range(-9, 9).filter((r) => r !== L));
        const v = rng.pick(range(-9, 9).filter((r) => r !== L));
        const facts = `$$${lim(a, -1)} f(x) = ${L}, \\quad ${lim(a, 1)} f(x) = ${R}, \\quad f(${a}) = ${v}$$`;
        return limitChoice(
          rng,
          t(`A function $f$ satisfies ${facts} Find $${lim(a)} f(x)$.`, `函数 $f$ 满足 ${facts} 求 $${lim(a)} f(x)$。`),
          equal ? Q.of(L) : "dne",
          [Q.of(v), Q.of(L), Q.of(R)],
          equal
            ? t(
                `The one-sided limits are equal, so the limit is $${L}$; the value $f(${a}) = ${v}$ plays no part.`,
                `两个单侧极限相等，所以极限是 $${L}$；函数值 $f(${a}) = ${v}$ 不起作用。`,
              )
            : t(
                `The one-sided limits $${L}$ and $${R}$ differ, so the limit does not exist.`,
                `单侧极限 $${L}$ 与 $${R}$ 不相等，所以极限不存在。`,
              ),
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
  knowledgePoints: [
    {
      id: "limits-at-infinity-from-a-graph",
      title: t("Limits at infinity from a graph", "从图像读出无穷远处的极限"),
      explanation: t(
        "$\\lim_{x \\to \\infty} f(x) = L$ means that $f(x)$ approaches $L$ as $x$ grows without bound; the graph levels off towards the horizontal line $y = L$, a **horizontal asymptote**. The limit as $x \\to -\\infty$ is read at the far left, and can be different.",
        "$\\lim_{x \\to \\infty} f(x) = L$ 表示当 $x$ 无界增大时 $f(x)$ 趋近 $L$；图像逐渐趋于水平直线 $y = L$，即**水平渐近线**。$x \\to -\\infty$ 时的极限在图像最左端读取，可能与之不同。",
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
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is shown. Find $${lim(target)} f(x)$.`,
              `图中是 $y = f(x)$ 的图像。求 $${lim(target)} f(x)$。`,
            ),
            answer,
            wrong: [toPlus ? left : rightL, h, 0, -answer],
            solution: t(
              `At the far ${toPlus ? "right" : "left"} the graph levels off towards $y = ${answer}$, so the limit is $${answer}$.`,
              `在图像最${toPlus ? "右" : "左"}端，曲线逐渐趋于 $y = ${answer}$，所以极限是 $${answer}$。`,
            ),
          }),
          figure: {
            svg: plane({ xMin: -9, xMax: 9, yMin: -7, yMax: 7 }, [{ kind: "curve", f, accent: true }]),
            alt: t("The graph of y = f(x).", "y = f(x) 的图像。"),
          },
        };
      },
    },
    {
      id: "limits-at-infinity-from-a-table",
      title: t("Limits at infinity from a table", "由数值表估计无穷远处的极限"),
      explanation: t(
        "To estimate $\\lim_{x \\to \\infty} f(x)$, evaluate $f$ at larger and larger $x$: $10, 100, 1000, \\ldots$ If the values settle towards a number, that number is the limit.",
        "估计 $\\lim_{x \\to \\infty} f(x)$ 时，在越来越大的 $x$ 处计算 $f$：$10, 100, 1000, \\ldots$ 如果函数值稳定地趋向某个数，这个数就是极限。",
      ),
      generate(rng) {
        const p = rng.nonZero(-6, 6);
        const q = rng.nonZero(-9, 9);
        const r = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5].filter((v) => p * v !== q));
        const sign = rng.pick([1, -1] as const);
        const f = (x: number) => (p * x + q) / (x + r);
        const xs = [10, 100, 1000, 10000, 100000].map((x) => sign * x);
        const target = sign > 0 ? "\\infty" : "-\\infty";
        const tableText = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...xs.map((x) => `$${f(x).toFixed(5)}$`)]);
        return numberProblem({
          prompt: t(
            `Some values of $f$ are shown. Estimate $${lim(target)} f(x)$.\n\n${tableText}`,
            `下表给出 $f$ 的一些值。估计 $${lim(target)} f(x)$。\n\n${tableText}`,
          ),
          answer: p,
          wrong: [Q.of(Math.round(f(xs[0]!) * 10), 10), Q.zero, Q.of(-p)],
          solution: t(`As $x \\to ${target}$, the values settle towards $${p}$.`, `当 $x \\to ${target}$ 时，函数值稳定地趋向 $${p}$。`),
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
  knowledgePoints: [
    {
      id: "infinite-limits-from-a-graph",
      title: t("Infinite limits from a graph", "从图像读出无穷极限"),
      explanation: t(
        "If $f(x)$ grows without bound as $x \\to a^{+}$, we write $\\lim_{x \\to a^{+}} f(x) = \\infty$; if it falls without bound, $-\\infty$. The line $x = a$ is a **vertical asymptote**.\n\nThe two-sided limit is $\\infty$ (or $-\\infty$) only if both sides go the same way; if one side rises and the other falls, it does not exist.",
        "若 $x \\to a^{+}$ 时 $f(x)$ 无界增大，记作 $\\lim_{x \\to a^{+}} f(x) = \\infty$；若无界减小，则为 $-\\infty$。直线 $x = a$ 是**竖直渐近线**。\n\n只有两侧趋势相同时，双侧极限才是 $\\infty$（或 $-\\infty$）；若一侧上升、一侧下降，极限不存在。",
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
        return limitChoice(
          rng,
          t(`The graph of $y = f(x)$ is shown. Find $${operator} f(x)$.`, `图中是 $y = f(x)$ 的图像。求 $${operator} f(x)$。`),
          answer,
          [Q.of(c), Q.of(h)],
          t(
            `Near $x = ${h}$ the graph ${leftSign > 0 ? "rises" : "falls"} without bound on the left and ${rightSign > 0 ? "rises" : "falls"} without bound on the right: $${lim(h, -1)} f(x) = ${infL(leftSign)}$ and $${lim(h, 1)} f(x) = ${infL(rightSign)}$.${side === 0 ? (answer === "dne" ? " The sides disagree, so the limit does not exist." : ` Both sides agree, so the limit is $${infL(leftSign)}$.`) : ""}`,
            `在 $x = ${h}$ 附近，图像在左侧无界${leftSign > 0 ? "上升" : "下降"}，在右侧无界${rightSign > 0 ? "上升" : "下降"}：$${lim(h, -1)} f(x) = ${infL(leftSign)}$，$${lim(h, 1)} f(x) = ${infL(rightSign)}$。${side === 0 ? (answer === "dne" ? "两侧不一致，所以极限不存在。" : `两侧一致，所以极限是 $${infL(leftSign)}$。`) : ""}`,
          ),
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
      title: t("Graphs with two vertical asymptotes", "有两条竖直渐近线的图像"),
      explanation: t(
        "A graph can have several vertical asymptotes, and the behavior near each one is read separately. First find the dashed line at the point the limit approaches; then look only at the part of the graph next to it on the side the limit names:\n\n- the graph shooting up gives $\\infty$, shooting down gives $-\\infty$;\n- for a two-sided limit, both sides must go the same way, otherwise the limit does not exist.\n\nWhat the graph does near the other asymptote, or far away, has no bearing on the limit.",
        "一个图像可以有几条竖直渐近线，每条渐近线附近的行为要分别读出。先找出极限所趋向的那个点处的虚线，再只看虚线旁、极限所指那一侧的图像：\n\n- 图像向上无限延伸为 $\\infty$，向下无限延伸为 $-\\infty$；\n- 对于双侧极限，两侧必须同向，否则极限不存在。\n\n图像在另一条渐近线附近或远处的表现，与这个极限无关。",
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
        const leftSign = e === 2 ? k : -k;
        const rightSign = k;
        const side = rng.pick([-1, 1, 0] as const);
        const toInf = (s: number): LimitValue => (s > 0 ? "inf" : "-inf");
        const answer: LimitValue =
          side < 0 ? toInf(leftSign) : side > 0 ? toInf(rightSign) : leftSign === rightSign ? toInf(leftSign) : "dne";
        const operator = side === 0 ? lim(h) : lim(h, side);
        const verdict =
          side === 0
            ? answer === "dne"
              ? t(" The sides disagree, so the two-sided limit does not exist.", "两侧不一致，所以双侧极限不存在。")
              : t(` Both sides agree, so the limit is $${infL(leftSign)}$.`, `两侧一致，所以极限为 $${infL(leftSign)}$。`)
            : t("", "");
        return limitChoice(
          rng,
          t(
            `The graph of $y = f(x)$ has vertical asymptotes at $x = ${h1}$ and $x = ${h2}$. Find $${operator} f(x)$.`,
            `$y = f(x)$ 的图像在 $x = ${h1}$ 和 $x = ${h2}$ 处有竖直渐近线。求 $${operator} f(x)$。`,
          ),
          answer,
          [Q.of(c), Q.of(h)],
          t(
            `Look only at the asymptote $x = ${h}$. Just left of it the graph ${leftSign > 0 ? "rises" : "falls"} without bound, and just right of it the graph ${rightSign > 0 ? "rises" : "falls"} without bound: $${lim(h, -1)} f(x) = ${infL(leftSign)}$ and $${lim(h, 1)} f(x) = ${infL(rightSign)}$.${verdict.en}`,
            `只看渐近线 $x = ${h}$。紧靠它的左侧，图像无界${leftSign > 0 ? "上升" : "下降"}；紧靠它的右侧，图像无界${rightSign > 0 ? "上升" : "下降"}：$${lim(h, -1)} f(x) = ${infL(leftSign)}$，$${lim(h, 1)} f(x) = ${infL(rightSign)}$。${verdict["zh-CN"]}`,
          ),
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
  encompasses: [{ topic: "the-finite-limit-of-a-function", weight: 0.3 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-constants-and-powers",
      title: t("Limits of constants and powers", "常数与幂的极限"),
      explanation: t(
        "A constant does not depend on the variable at all, and a power of the variable approaches the same power of the point it approaches. Two basic rules:\n\n- **Constant rule:** $\\lim_{x \\to a} c = c$.\n- **Power rule:** $\\lim_{x \\to a} x^{n} = a^{n}$, and with a constant multiple, $\\lim_{x \\to a} cx^{n} = ca^{n}$.\n\nSo $\\lim_{x \\to -2} 3x^{3} = 3(-2)^{3} = -24$ and $\\lim_{x \\to 5} 7 = 7$.",
        "常数完全不依赖于变量，而变量的幂趋近于它所趋近的点的同次幂。两条基本法则：\n\n- **常数法则：**$\\lim_{x \\to a} c = c$。\n- **幂法则：**$\\lim_{x \\to a} x^{n} = a^{n}$；带常数倍时，$\\lim_{x \\to a} cx^{n} = ca^{n}$。\n\n所以 $\\lim_{x \\to -2} 3x^{3} = 3(-2)^{3} = -24$，$\\lim_{x \\to 5} 7 = 7$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        if (rng.bool(0.2)) {
          const c = rng.nonZero(-12, 12);
          return numberProblem({
            prompt: t(`Find $${lim(a)} ${c}$.`, `求 $${lim(a)} ${c}$。`),
            answer: c,
            wrong: [a, c * a, 0],
            solution: t(`The limit of a constant is the constant: $${c}$.`, `常数的极限就是这个常数：$${c}$。`),
          });
        }
        const n = rng.int(1, 4);
        const c = rng.pick([-5, -3, -2, -1, 1, 2, 3, 4, 5]);
        const answer = c * a ** n;
        const term = poly([c, n === 1 ? "x" : `x^{${n}}`]);
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${term}$.`, `求 $${lim(a)} ${term}$。`),
          answer,
          wrong: [(c * a) ** n, c * a * n, -answer],
          solution: t(
            `By the power rule, $${lim(a)} ${term} = ${c}(${a})^{${n}} = ${answer}$.`,
            `由幂法则，$${lim(a)} ${term} = ${c}(${a})^{${n}} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "limits-of-negative-and-fractional-coefficient-powers",
      title: t("Powers with negative exponents", "负指数幂的极限"),
      explanation: t(
        "A negative power is a reciprocal, so as long as the point is not zero, the limit is found by substituting the point. The power rule also holds for negative exponents when $a \\ne 0$: $\\lim_{x \\to a} cx^{-n} = \\frac{c}{a^{n}}$.\n\nSo $\\lim_{x \\to 2} 6x^{-3} = \\frac{6}{8} = \\frac{3}{4}$.",
        "负指数幂是倒数，所以只要该点不是零，代入该点就能求出极限。当 $a \\ne 0$ 时，幂法则对负指数同样成立：$\\lim_{x \\to a} cx^{-n} = \\frac{c}{a^{n}}$。\n\n所以 $\\lim_{x \\to 2} 6x^{-3} = \\frac{6}{8} = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, -1, 2, 3, 4, 5]);
        const n = rng.int(1, 3);
        const c = rng.nonZero(-9, 9);
        const answer = Q.of(c, a ** n);
        const written = rng.bool();
        const term = written ? `${c === 1 ? "" : c === -1 ? "-" : c}x^{-${n}}` : `\\frac{${c}}{x^{${n}}}`.replace("x^{1}", "x");
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${term}$.`, `求 $${lim(a)} ${term}$。`),
          answer,
          wrong: [Q.of(c * a ** n), Q.of(c, -n * a), answer.neg()],
          solution: t(
            `$$${lim(a)} ${term} = \\frac{${c}}{(${a})^{${n}}} = ${answer.toLatex()}$$`,
            `$$${lim(a)} ${term} = \\frac{${c}}{(${a})^{${n}}} = ${answer.toLatex()}$$`,
          ),
        });
      },
    },
  ],
};

/** quadratic draws a polynomial ax² + bx + c with small coefficients and writes it. */
function quadratic(rng: Rng) {
  const a = rng.pick([-3, -2, -1, 1, 2, 3]);
  const b = rng.int(-6, 6);
  const c = rng.int(-9, 9);
  return { latex: poly([a, "x^{2}"], [b, "x"], [c, ""]), at: (x: number) => a * x * x + b * x + c };
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
  knowledgePoints: [
    {
      id: "combining-limits-with-the-sum-rule",
      title: t("Combining known limits", "组合已知极限"),
      explanation: t(
        "When the limits of two functions are known, the limit of any combination of them with constant coefficients is the same combination of the limits. If $\\lim_{x \\to a} f(x) = A$ and $\\lim_{x \\to a} g(x) = B$ both exist, then\n\n$$\\lim_{x \\to a} \\left[ p f(x) + q g(x) \\right] = pA + qB.$$\n\nWith $A = 4$ and $B = -1$: $\\lim_{x \\to a} [3f(x) - 2g(x)] = 12 + 2 = 14$.",
        "当两个函数的极限已知时，它们任意常系数组合的极限，就是这两个极限的同样组合。若 $\\lim_{x \\to a} f(x) = A$ 与 $\\lim_{x \\to a} g(x) = B$ 都存在，则\n\n$$\\lim_{x \\to a} \\left[ p f(x) + q g(x) \\right] = pA + qB.$$\n\n当 $A = 4$，$B = -1$ 时：$\\lim_{x \\to a} [3f(x) - 2g(x)] = 12 + 2 = 14$。",
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
        const steps = poly([p, `(${A})`], [q, `(${B})`], [r, ""]);
        return numberProblem({
          prompt: t(
            `Given $${lim(a)} f(x) = ${A}$ and $${lim(a)} g(x) = ${B}$, find $${lim(a)} \\left[${expr}\\right]$.`,
            `已知 $${lim(a)} f(x) = ${A}$，$${lim(a)} g(x) = ${B}$，求 $${lim(a)} \\left[${expr}\\right]$。`,
          ),
          answer,
          wrong: [p * A + q * B, A + B + r, p * B + q * A + r],
          solution: t(
            `$$${lim(a)} \\left[${expr}\\right] = ${steps} = ${answer}$$`,
            `$$${lim(a)} \\left[${expr}\\right] = ${steps} = ${answer}$$`,
          ),
        });
      },
    },
    {
      id: "limits-of-polynomials",
      title: t("Limits of polynomials", "多项式的极限"),
      explanation: t(
        "Applying the sum, constant multiple and power rules term by term shows that a polynomial's limit is its value: $\\lim_{x \\to a} p(x) = p(a)$.\n\n$$\\lim_{x \\to 2} (x^{2} - 3x + 5) = 4 - 6 + 5 = 3.$$",
        "逐项运用和法则、常数倍法则和幂法则可知，多项式的极限等于它的值：$\\lim_{x \\to a} p(x) = p(a)$。\n\n$$\\lim_{x \\to 2} (x^{2} - 3x + 5) = 4 - 6 + 5 = 3.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const cubic = rng.bool(0.4);
        const d = cubic ? rng.pick([-2, -1, 1, 2]) : 0;
        const q = quadratic(rng);
        const latex = cubic ? `${poly([d, "x^{3}"])} ${q.latex.startsWith("-") ? `- ${q.latex.slice(1)}` : `+ ${q.latex}`}` : q.latex;
        const answer = d * a ** 3 + q.at(a);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\left(${latex}\\right)$.`, `求 $${lim(a)} \\left(${latex}\\right)$。`),
          answer,
          wrong: [d * a ** 3 + q.at(-a), answer + 2 * a, 0],
          solution: t(
            `A polynomial's limit is its value. Substitute $x = ${a}$: the result is $${answer}$.`,
            `多项式的极限等于它的值。代入 $x = ${a}$，结果为 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "combining-limits-with-products-and-quotients",
      title: t("Combining known limits", "组合已知极限"),
      explanation: t(
        "Products and quotients of functions have limits equal to the products and quotients of their limits, except that a quotient needs a nonzero limit below. If $\\lim f = A$ and $\\lim g = B$, then $\\lim (fg) = AB$, and $\\lim \\frac{f}{g} = \\frac{A}{B}$ provided $B \\ne 0$.\n\nWith $A = 6$, $B = -4$ and $\\lim h = 3$: $\\lim \\frac{f(x)g(x)}{h(x)} = \\frac{6 \\cdot (-4)}{3} = -8$.",
        "函数之积与商的极限等于各自极限的积与商，只是商要求分母的极限不为零。若 $\\lim f = A$，$\\lim g = B$，则 $\\lim (fg) = AB$；当 $B \\ne 0$ 时，$\\lim \\frac{f}{g} = \\frac{A}{B}$。\n\n当 $A = 6$，$B = -4$，$\\lim h = 3$ 时：$\\lim \\frac{f(x)g(x)}{h(x)} = \\frac{6 \\cdot (-4)}{3} = -8$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const C = rng.nonZero(-5, 5);
        const form = rng.int(0, 2);
        const exprs = ["\\frac{f(x)g(x)}{h(x)}", "\\frac{f(x)}{g(x) + h(x)}", "f(x)\\left[g(x) - h(x)\\right]"];
        const values = [Q.of(A * B, C), B + C === 0 ? undefined : Q.of(A, B + C), Q.of(A * (B - C))];
        const f = values[form] === undefined ? 0 : form;
        const answer = values[f]!;
        const expr = exprs[f]!;
        const given = `$${lim(a)} f(x) = ${A}$, $${lim(a)} g(x) = ${B}$ ${"and"} $${lim(a)} h(x) = ${C}$`;
        return numberProblem({
          prompt: t(`Given ${given}, find $${lim(a)} ${expr}$.`, `已知 ${given.replace("and", "，")}，求 $${lim(a)} ${expr}$。`),
          answer,
          wrong: [Q.of(A * B * C), Q.of(A + B, C), answer.neg()],
          solution: t(
            `Replace each function by its limit: the result is $${answer.toLatex()}$.`,
            `把每个函数换成它的极限：结果为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "limits-of-rational-functions-by-substitution",
      title: t("Limits of rational functions by substitution", "用代入法求分式函数的极限"),
      explanation: t(
        "By the quotient rule, a rational function's limit is its value wherever the denominator is not zero:\n\n$$\\lim_{x \\to 3} \\frac{x^{2} + 1}{x - 1} = \\frac{10}{2} = 5.$$",
        "由商法则，在分母不为零处，分式函数的极限等于它的值：\n\n$$\\lim_{x \\to 3} \\frac{x^{2} + 1}{x - 1} = \\frac{10}{2} = 5.$$",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(-4, 4);
          const top = quadratic(rng);
          const m = rng.pick([1, 2, 3]);
          const n = rng.int(-6, 6);
          const den = m * a + n;
          if (den === 0) continue;
          const answer = Q.of(top.at(a), den);
          return numberProblem({
            prompt: t(
              `Find $${lim(a)} \\frac{${top.latex}}{${poly([m, "x"], [n, ""])}}$.`,
              `求 $${lim(a)} \\frac{${top.latex}}{${poly([m, "x"], [n, ""])}}$。`,
            ),
            answer,
            wrong: [Q.of(den, top.at(a) === 0 ? 1 : top.at(a)), Q.of(top.at(a)), answer.neg()],
            solution: t(
              `The denominator is $${den} \\ne 0$ at $x = ${a}$, so substitute: $\\frac{${top.at(a)}}{${den}} = ${answer.toLatex()}$.`,
              `在 $x = ${a}$ 处分母为 $${den} \\ne 0$，所以直接代入：$\\frac{${top.at(a)}}{${den}} = ${answer.toLatex()}$。`,
            ),
          });
        }
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
  encompasses: [{ topic: "the-product-and-quotient-rules-for-limits", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-and-roots-of-limits",
      title: t("Powers and roots of limits", "极限的幂与根"),
      explanation: t(
        "Raising to a power or taking a root can be done after finding the limit, as long as an even root is applied to a nonnegative number. If $\\lim_{x \\to a} f(x) = A$, then\n\n$$\\lim_{x \\to a} [f(x)]^{n} = A^{n}, \\qquad \\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{A},$$\n\nwhere for even $n$ we need $A > 0$. So if $\\lim f = 8$, then $\\lim \\sqrt[3]{f(x)} = 2$ and $\\lim [f(x)]^{2} = 64$.",
        "可以先求极限再取幂或开方，只要偶次方根作用在非负数上即可。若 $\\lim_{x \\to a} f(x) = A$，则\n\n$$\\lim_{x \\to a} [f(x)]^{n} = A^{n}, \\qquad \\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{A},$$\n\n其中 $n$ 为偶数时要求 $A > 0$。所以若 $\\lim f = 8$，则 $\\lim \\sqrt[3]{f(x)} = 2$，$\\lim [f(x)]^{2} = 64$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const A = rng.nonZero(-5, 5);
          const n = rng.int(2, 4);
          const c = rng.pick([1, 1, 2, -1, 3]);
          const answer = c * A ** n;
          const expr = `${c === 1 ? "" : c === -1 ? "-" : c}\\left[f(x)\\right]^{${n}}`;
          return numberProblem({
            prompt: t(`Given $${lim(a)} f(x) = ${A}$, find $${lim(a)} ${expr}$.`, `已知 $${lim(a)} f(x) = ${A}$，求 $${lim(a)} ${expr}$。`),
            answer,
            wrong: [c * A * n, -answer, (c * A) ** n],
            solution: t(
              `$$${lim(a)} ${expr} = ${c === 1 ? "" : `${c} \\cdot `}(${A})^{${n}} = ${answer}$$`,
              `$$${lim(a)} ${expr} = ${c === 1 ? "" : `${c} \\cdot `}(${A})^{${n}} = ${answer}$$`,
            ),
          });
        }
        const square = kind === 1;
        const r = square ? rng.int(1, 12) : rng.nonZero(-5, 5);
        const A = square ? r * r : r ** 3;
        const root = square ? "\\sqrt{f(x)}" : "\\sqrt[3]{f(x)}";
        return numberProblem({
          prompt: t(`Given $${lim(a)} f(x) = ${A}$, find $${lim(a)} ${root}$.`, `已知 $${lim(a)} f(x) = ${A}$，求 $${lim(a)} ${root}$。`),
          answer: r,
          wrong: [A, Q.of(A, square ? 2 : 3), -r],
          solution: t(
            `$$${lim(a)} ${root} = ${square ? `\\sqrt{${A}}` : `\\sqrt[3]{${A}}`} = ${r}$$`,
            `$$${lim(a)} ${root} = ${square ? `\\sqrt{${A}}` : `\\sqrt[3]{${A}}`} = ${r}$$`,
          ),
        });
      },
    },
    {
      id: "limits-of-roots-of-polynomials",
      title: t("Limits of roots of polynomials", "多项式开方的极限"),
      explanation: t(
        "A polynomial has no breaks, so find its limit by substitution, and then apply the root to the result. Combine the root rule with the limit of a polynomial:\n\n$$\\lim_{x \\to 3} \\sqrt{x^{2} + 16} = \\sqrt{\\lim_{x \\to 3} (x^{2} + 16)} = \\sqrt{25} = 5.$$",
        "多项式没有间断，所以用代入法求它的极限，再对结果开方。把根式法则与多项式的极限结合：\n\n$$\\lim_{x \\to 3} \\sqrt{x^{2} + 16} = \\sqrt{\\lim_{x \\to 3} (x^{2} + 16)} = \\sqrt{25} = 5.$$",
      ),
      generate(rng) {
        const square = rng.bool(0.7);
        const a = rng.int(-4, 4);
        const r = square ? rng.int(1, 9) : rng.nonZero(-4, 4);
        const k = rng.pick([1, 2, 3]);
        const b = rng.int(-5, 5);
        const inner = k * a * a + b * a;
        const c = (square ? r * r : r ** 3) - inner;
        const latex = poly([k, "x^{2}"], [b, "x"], [c, ""]);
        const answer = r;
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} ${square ? `\\sqrt{${latex}}` : `\\sqrt[3]{${latex}}`}$.`,
            `求 $${lim(a)} ${square ? `\\sqrt{${latex}}` : `\\sqrt[3]{${latex}}`}$。`,
          ),
          answer,
          wrong: [square ? r * r : r ** 3, -r, r + 1],
          solution: t(
            `The polynomial approaches $${square ? r * r : r ** 3}$ as $x \\to ${a}$, so the limit is $${square ? `\\sqrt{${r * r}}` : `\\sqrt[3]{${r ** 3}}`} = ${r}$.`,
            `当 $x \\to ${a}$ 时，多项式趋近 $${square ? r * r : r ** 3}$，所以极限为 $${square ? `\\sqrt{${r * r}}` : `\\sqrt[3]{${r ** 3}}`} = ${r}$。`,
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
  encompasses: [{ topic: "limits-at-infinity-from-graphs", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-at-infinity-from-the-leading-term",
      title: t("Using the leading term", "利用首项"),
      explanation: t(
        "As $x \\to \\pm\\infty$, a polynomial behaves like its leading term $ax^{n}$:\n\n- $x \\to \\infty$: the limit is $\\infty$ if $a > 0$ and $-\\infty$ if $a < 0$.\n- $x \\to -\\infty$: $x^{n}$ is positive for even $n$ and negative for odd $n$, so the sign of $ax^{n}$ decides.\n\n$\\lim_{x \\to -\\infty} (-2x^{3} + 5x) = \\infty$, since $-2x^{3} > 0$ for large negative $x$.",
        "当 $x \\to \\pm\\infty$ 时，多项式的表现与首项 $ax^{n}$ 一致：\n\n- $x \\to \\infty$：$a > 0$ 时极限为 $\\infty$，$a < 0$ 时为 $-\\infty$。\n- $x \\to -\\infty$：$n$ 为偶数时 $x^{n}$ 为正，$n$ 为奇数时为负，由 $ax^{n}$ 的符号决定。\n\n$\\lim_{x \\to -\\infty} (-2x^{3} + 5x) = \\infty$，因为当 $x$ 是绝对值很大的负数时 $-2x^{3} > 0$。",
      ),
      generate(rng) {
        const n = rng.int(2, 5);
        const a = rng.nonZero(-5, 5);
        const b = rng.int(-9, 9);
        const c = rng.int(-9, 9);
        const toPlus = rng.bool();
        const latex = poly([a, `x^{${n}}`], [b, `x^{${n - 1}}`.replace("x^{1}", "x")], [c, ""]);
        const sign = toPlus ? Math.sign(a) : Math.sign(a) * (n % 2 === 0 ? 1 : -1);
        const target = toPlus ? "\\infty" : "-\\infty";
        return limitChoice(
          rng,
          t(`Find $${lim(target)} \\left(${latex}\\right)$.`, `求 $${lim(target)} \\left(${latex}\\right)$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.of(a)],
          t(
            `The leading term $${poly([a, `x^{${n}}`])}$ decides. As $x \\to ${target}$, $x^{${n}} \\to ${toPlus || n % 2 === 0 ? "\\infty" : "-\\infty"}$, so the limit is $${infL(sign)}$.`,
            `由首项 $${poly([a, `x^{${n}}`])}$ 决定。当 $x \\to ${target}$ 时，$x^{${n}} \\to ${toPlus || n % 2 === 0 ? "\\infty" : "-\\infty"}$，所以极限是 $${infL(sign)}$。`,
          ),
        );
      },
    },
    {
      id: "limits-at-infinity-of-factored-polynomials",
      title: t("Polynomials in factored form", "因式分解形式的多项式"),
      explanation: t(
        "For a product of factors, the leading term is the product of the factors' leading terms:\n\n$$(2 - x)(x + 3)^{2} \\text{ has leading term } (-x)(x)^{2} = -x^{3},$$\n\nso it tends to $-\\infty$ as $x \\to \\infty$ and to $\\infty$ as $x \\to -\\infty$.",
        "对于因式的乘积，首项是各因式首项之积：\n\n$$(2 - x)(x + 3)^{2} \\text{ 的首项是 } (-x)(x)^{2} = -x^{3},$$\n\n所以 $x \\to \\infty$ 时它趋于 $-\\infty$，$x \\to -\\infty$ 时趋于 $\\infty$。",
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
        const sign = toPlus ? Math.sign(lead) : Math.sign(lead) * (degree % 2 === 0 ? 1 : -1);
        const target = toPlus ? "\\infty" : "-\\infty";
        const expr = rng.bool() ? `${first}${second}` : `${second}${first}`;
        return limitChoice(
          rng,
          t(`Find $${lim(target)} ${expr}$.`, `求 $${lim(target)} ${expr}$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.of(lead)],
          t(
            `The leading term is $${poly([lead, `x^{${degree}}`])}$. As $x \\to ${target}$ it tends to $${infL(sign)}$.`,
            `首项是 $${poly([lead, `x^{${degree}}`])}$。当 $x \\to ${target}$ 时它趋于 $${infL(sign)}$。`,
          ),
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
  encompasses: [
    { topic: "infinite-limits-from-graphs", weight: 0.3 },
    { topic: "limits-at-infinity-from-graphs", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reciprocal-limits-at-the-asymptote",
      title: t("Limits at the vertical asymptote", "竖直渐近线处的极限"),
      explanation: t(
        "Near $x = h$, $\\frac{k}{(x - h)^{n}}$ is a fixed number divided by a tiny one, so it is huge. Its sign depends on the sign of $k$ and of $(x - h)^{n}$:\n\n- for even $n$, $(x - h)^{n} > 0$ on both sides, so both one-sided limits have the sign of $k$;\n- for odd $n$, $(x - h)^{n}$ is negative on the left and positive on the right, so the sides differ and the two-sided limit does not exist.",
        "在 $x = h$ 附近，$\\frac{k}{(x - h)^{n}}$ 是一个固定的数除以一个很小的数，所以绝对值很大。其符号由 $k$ 和 $(x - h)^{n}$ 的符号决定：\n\n- $n$ 为偶数时，$(x - h)^{n}$ 在两侧都为正，两个单侧极限的符号都与 $k$ 相同；\n- $n$ 为奇数时，$(x - h)^{n}$ 左负右正，两侧不同，双侧极限不存在。",
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
        return limitChoice(
          rng,
          t(`Find $${operator} ${expr}$.`, `求 $${operator} ${expr}$。`),
          answer,
          [Q.zero, Q.of(c)],
          t(
            `$${den}$ is a tiny ${n % 2 === 0 ? "positive number on both sides" : "number, negative on the left and positive on the right"} of $${h}$, and the numerator is $${k}$. So the fraction tends to $${infL(leftSign)}$ from the left and $${infL(rightSign)}$ from the right${side === 0 ? (answer === "dne" ? ": the limit does not exist" : `: the limit is $${infL(leftSign)}$`) : ""}.`,
            `在 $${h}$ 附近，$${den}$ 是${n % 2 === 0 ? "两侧都为正的很小的数" : "左负右正的很小的数"}，且分子是 $${k}$。所以分式从左侧趋于 $${infL(leftSign)}$，从右侧趋于 $${infL(rightSign)}$${side === 0 ? (answer === "dne" ? "：极限不存在" : `：极限是 $${infL(leftSign)}$`) : ""}。`,
          ),
          undefined,
          true,
        );
      },
    },
    {
      id: "reciprocal-limits-at-infinity",
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "When the denominator grows without bound, the fraction shrinks toward zero, so only the constant added to it remains in the limit. As $x \\to \\pm\\infty$, $(x - h)^{n}$ grows without bound, so $\\frac{k}{(x - h)^{n}} \\to 0$ and $\\frac{k}{(x - h)^{n}} + c \\to c$. The line $y = c$ is a horizontal asymptote.",
        "当分母无限增大时，分式趋近于零，所以极限中只剩下与它相加的常数。当 $x \\to \\pm\\infty$ 时，$(x - h)^{n}$ 无界增大，所以 $\\frac{k}{(x - h)^{n}} \\to 0$，$\\frac{k}{(x - h)^{n}} + c \\to c$。直线 $y = c$ 是水平渐近线。",
      ),
      generate(rng) {
        const h = rng.int(-4, 4);
        const k = rng.nonZero(-6, 6);
        const n = rng.int(1, 3);
        const c = rng.int(-6, 6);
        const target = rng.pick(["\\infty", "-\\infty"]);
        const den = h === 0 ? `x${n === 1 ? "" : `^{${n}}`}` : `(${bare(h)})${n === 1 ? "" : `^{${n}}`}`;
        const expr = `\\frac{${k}}{${den}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        return limitChoice(
          rng,
          t(`Find $${lim(target)} ${expr}$.`, `求 $${lim(target)} ${expr}$。`),
          Q.of(c),
          [Q.of(k), Q.of(c + k), Q.of(h), Q.zero],
          t(
            `The fraction tends to $0$ as $x \\to ${target}$, so the limit is $${c}$.`,
            `当 $x \\to ${target}$ 时分式趋于 $0$，所以极限是 $${c}$。`,
          ),
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
  encompasses: [{ topic: "properties-of-transformed-exponential-functions", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-limits-at-infinity",
      title: t("Limits at infinity", "无穷远处的极限"),
      explanation: t(
        "A base greater than one makes powers grow rapidly in one direction and shrink toward zero in the other, which gives the graph its horizontal asymptote. For $b > 1$: $b^{x} \\to \\infty$ as $x \\to \\infty$ and $b^{x} \\to 0$ as $x \\to -\\infty$. For $0 < b < 1$ it is the other way round. So\n\n$$\\lim_{x \\to -\\infty} (3 \\cdot 2^{x} + 5) = 5, \\qquad \\lim_{x \\to \\infty} (-e^{x} + 1) = -\\infty.$$",
        "底数大于 1 时，幂在一个方向上迅速增大，在另一个方向上趋近于零，这就是图像有水平渐近线的原因。当 $b > 1$ 时：$x \\to \\infty$ 时 $b^{x} \\to \\infty$，$x \\to -\\infty$ 时 $b^{x} \\to 0$。当 $0 < b < 1$ 时恰好相反。所以\n\n$$\\lim_{x \\to -\\infty} (3 \\cdot 2^{x} + 5) = 5, \\qquad \\lim_{x \\to \\infty} (-e^{x} + 1) = -\\infty.$$",
      ),
      generate(rng) {
        const bases = [
          { latex: "2^{x}", grows: true },
          { latex: "3^{x}", grows: true },
          { latex: "e^{x}", grows: true },
          { latex: "e^{-x}", grows: false },
          { latex: "\\left(\\frac{1}{2}\\right)^{x}", grows: false },
          { latex: "\\left(\\frac{2}{3}\\right)^{x}", grows: false },
          { latex: "5^{x}", grows: true },
        ];
        const b = rng.pick(bases);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 5]);
        const c = rng.int(-6, 6);
        const toPlus = rng.bool();
        const big = toPlus === b.grows;
        const answer: LimitValue = big ? (a > 0 ? "inf" : "-inf") : Q.of(c);
        const target = toPlus ? "\\infty" : "-\\infty";
        const expr = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${b.latex}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        return limitChoice(
          rng,
          t(`Find $${lim(target)} \\left(${expr}\\right)$.`, `求 $${lim(target)} \\left(${expr}\\right)$。`),
          answer,
          [Q.of(c), Q.of(a + c), Q.zero],
          big
            ? t(
                `$${b.latex} \\to \\infty$ as $x \\to ${target}$${a === 1 ? "" : `, and it is multiplied by $${a}$`}, so the limit is $${infL(a)}$.`,
                `当 $x \\to ${target}$ 时 $${b.latex} \\to \\infty$${a === 1 ? "" : `，再乘以 $${a}$`}，所以极限是 $${infL(a)}$。`,
              )
            : t(
                `$${b.latex} \\to 0$ as $x \\to ${target}$, so the limit is $${c}$.`,
                `当 $x \\to ${target}$ 时 $${b.latex} \\to 0$，所以极限是 $${c}$。`,
              ),
        );
      },
    },
    {
      id: "exponential-limits-at-a-point",
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "Because there is no hole or jump in an exponential graph, the limit at any point is simply the value of the function there. Exponential functions have no breaks, so their limit at a point is their value: $\\lim_{x \\to 1} (2e^{3x} - 4) = 2e^{3} - 4$.",
        "因为指数函数的图像没有洞或跳跃，所以在任意点处的极限就是该点的函数值。指数函数没有间断，所以它在一点处的极限等于函数值：$\\lim_{x \\to 1} (2e^{3x} - 4) = 2e^{3} - 4$。",
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
        const answer = value === 0 ? String(a + c) : `${coef}e^{${value}}${constant}`;
        return functionProblem({
          prompt: t(
            `Find $${lim(p)} \\left(${coef}e^{${exponent}}${constant}\\right)$. Give the exact value.`,
            `求 $${lim(p)} \\left(${coef}e^{${exponent}}${constant}\\right)$，写出精确值。`,
          ),
          answer,
          wrong: [`${coef}e^{${-value}}${constant}`, `${coef}e^{${k}}${constant}`, `${a * value + c}`],
          solution: t(
            `Substitute $x = ${p}$: the exponent is $${value}$, so the limit is $${answer}$.`,
            `代入 $x = ${p}$：指数为 $${value}$，所以极限是 $${answer}$。`,
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
  encompasses: [{ topic: "properties-of-transformed-logarithmic-functions", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "logarithmic-limits-at-the-asymptote-and-infinity",
      title: t("Limits at the asymptote and at infinity", "渐近线处与无穷远处的极限"),
      explanation: t(
        "A logarithm drops without bound as its input approaches zero from the right, and grows without bound, though very slowly, as its input grows. For a base $b > 1$: $\\log_{b} x \\to -\\infty$ as $x \\to 0^{+}$ and $\\log_{b} x \\to \\infty$ as $x \\to \\infty$, slowly. Shifted, $\\ln(x - h) \\to -\\infty$ as $x \\to h^{+}$. A negative multiplier flips the sign: $\\lim_{x \\to 0^{+}} (-2\\ln x) = \\infty$.",
        "当自变量从右侧趋近于零时，对数无限减小；当自变量增大时，对数也无限增大，只是增长得很慢。对于底数 $b > 1$：$x \\to 0^{+}$ 时 $\\log_{b} x \\to -\\infty$，$x \\to \\infty$ 时 $\\log_{b} x \\to \\infty$（增长缓慢）。平移后，$x \\to h^{+}$ 时 $\\ln(x - h) \\to -\\infty$。负的系数会改变符号：$\\lim_{x \\to 0^{+}} (-2\\ln x) = \\infty$。",
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
        const sign = atInfinity ? Math.sign(a) : -Math.sign(a);
        const operator = atInfinity ? lim("\\infty") : lim(h, 1);
        return limitChoice(
          rng,
          t(`Find $${operator} \\left(${expr}\\right)$.`, `求 $${operator} \\left(${expr}\\right)$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.of(c), Q.zero, Q.of(h)],
          t(
            `$${fn} ${inner} \\to ${atInfinity ? "\\infty" : "-\\infty"}$ as $x \\to ${atInfinity ? "\\infty" : `${h}^{+}`}$${a === 1 ? "" : `; multiplied by $${a}$ it tends to $${infL(sign)}$`}.`,
            `当 $x \\to ${atInfinity ? "\\infty" : `${h}^{+}`}$ 时 $${fn} ${inner} \\to ${atInfinity ? "\\infty" : "-\\infty"}$${a === 1 ? "" : `；乘以 $${a}$ 后趋于 $${infL(sign)}$`}。`,
          ),
        );
      },
    },
    {
      id: "logarithmic-limits-at-a-point",
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "At any point inside its domain, a logarithm behaves continuously, so you can find the limit by evaluating the logarithm at the point. Inside its domain a logarithm has no breaks, so its limit is its value: $\\lim_{x \\to 8} (3\\log_{2} x - 1) = 3 \\cdot 3 - 1 = 8$.",
        "在定义域内的任意点处，对数函数是连续的，所以求出该点的对数值就得到极限。在定义域内，对数函数没有间断，所以极限等于函数值：$\\lim_{x \\to 8} (3\\log_{2} x - 1) = 3 \\cdot 3 - 1 = 8$。",
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
        return numberProblem({
          prompt: t(`Find $${lim(at.toLatex())} \\left(${expr}\\right)$.`, `求 $${lim(at.toLatex())} \\left(${expr}\\right)$。`),
          answer,
          wrong: [a * -k + c, k + c, a * k],
          solution: t(
            `$${fn} ${at.toLatex()} = ${k}$, so the limit is $${answer}$.`,
            `$${fn} ${at.toLatex()} = ${k}$，所以极限是 $${answer}$。`,
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
  encompasses: [
    { topic: "the-power-and-root-rules-for-limits", weight: 0.4 },
    { topic: "finding-the-existence-of-a-limit-using-one-sided-limits", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "radical-limits-inside-the-domain",
      title: t("Limits inside the domain", "定义域内的极限"),
      explanation: t(
        "Inside its domain a radical function has no breaks, so substitute: $\\lim_{x \\to 6} \\sqrt{2x - 3} = \\sqrt{9} = 3$. Cube roots are defined everywhere: $\\lim_{x \\to -4} \\sqrt[3]{2x} = \\sqrt[3]{-8} = -2$.",
        "在定义域内根式函数没有间断，所以直接代入：$\\lim_{x \\to 6} \\sqrt{2x - 3} = \\sqrt{9} = 3$。立方根处处有定义：$\\lim_{x \\to -4} \\sqrt[3]{2x} = \\sqrt[3]{-8} = -2$。",
      ),
      generate(rng) {
        const square = rng.bool(0.6);
        const r = square ? rng.int(1, 8) : rng.nonZero(-4, 4);
        const p = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
        const a = rng.int(-6, 6);
        const q = (square ? r * r : r ** 3) - p * a;
        const inner = poly([p, "x"], [q, ""]);
        const c = rng.pick([1, 1, 2, -1, 3]);
        const coef = c === 1 ? "" : c === -1 ? "-" : `${c}`;
        const expr = `${coef}${square ? `\\sqrt{${inner}}` : `\\sqrt[3]{${inner}}`}`;
        return numberProblem({
          prompt: t(`Find $${lim(a)} ${expr}$.`, `求 $${lim(a)} ${expr}$。`),
          answer: c * r,
          wrong: [c * (square ? r * r : r ** 3), -c * r, c * r + 1],
          solution: t(
            `Substitute $x = ${a}$: the radicand is $${square ? r * r : r ** 3}$, so the limit is $${c === 1 ? "" : `${c} \\cdot ${paren(r)} = `}${c * r}$.`,
            `代入 $x = ${a}$：被开方数为 $${square ? r * r : r ** 3}$，所以极限是 $${c === 1 ? "" : `${c} \\cdot ${paren(r)} = `}${c * r}$。`,
          ),
        });
      },
    },
    {
      id: "radical-limits-at-the-endpoint-and-infinity",
      title: t("Limits at the endpoint and at infinity", "端点处与无穷远处的极限"),
      explanation: t(
        "$\\sqrt{x - h}$ is defined only for $x \\ge h$. So $\\lim_{x \\to h^{+}} \\sqrt{x - h} = 0$, while the left-sided limit, and hence the two-sided limit, does not exist. As $x \\to \\infty$, $\\sqrt{x - h} \\to \\infty$.",
        "$\\sqrt{x - h}$ 只在 $x \\ge h$ 时有定义。所以 $\\lim_{x \\to h^{+}} \\sqrt{x - h} = 0$，而左极限以及双侧极限都不存在。当 $x \\to \\infty$ 时，$\\sqrt{x - h} \\to \\infty$。",
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
        let operator: string;
        let answer: LimitValue;
        let why: { en: string; zh: string };
        if (kind === 0) {
          operator = lim(h, inside);
          answer = Q.of(c);
          why = {
            en: `The radicand tends to $0$ from inside the domain, so the limit is $${c}$.`,
            zh: `被开方数从定义域内趋于 $0$，所以极限是 $${c}$。`,
          };
        } else if (kind === 1) {
          operator = rng.bool() ? lim(h) : lim(h, inside < 0 ? 1 : -1);
          answer = "dne";
          why = {
            en: `The function is not defined for $x ${reflected ? ">" : "<"} ${h}$, so this limit does not exist.`,
            zh: `函数在 $x ${reflected ? ">" : "<"} ${h}$ 时没有定义，所以这个极限不存在。`,
          };
        } else {
          operator = lim(reflected ? "-\\infty" : "\\infty");
          answer = a > 0 ? "inf" : "-inf";
          why = {
            en: `The radicand grows without bound, so the root does too; multiplied by $${a}$ the limit is $${infL(a)}$.`,
            zh: `被开方数无界增大，根式也无界增大；乘以 $${a}$ 后极限是 $${infL(a)}$。`,
          };
        }
        return limitChoice(
          rng,
          t(`Find $${operator} \\left(${expr}\\right)$.`, `求 $${operator} \\left(${expr}\\right)$。`),
          answer,
          [Q.of(c), Q.zero, Q.of(h)],
          t(why.en, why.zh),
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
  encompasses: [
    { topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.3 },
    { topic: "infinite-limits-from-graphs", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "trigonometric-limits-at-special-angles",
      title: t("Limits at special angles", "特殊角处的极限"),
      explanation: t(
        "Sine and cosine have no breaks, and tangent has none where $\\cos x \\ne 0$, so their limits are their values:\n\n$$\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}, \\qquad \\lim_{x \\to \\frac{3\\pi}{4}} \\tan x = -1.$$",
        "正弦和余弦没有间断，正切在 $\\cos x \\ne 0$ 处也没有间断，所以它们的极限等于函数值：\n\n$$\\lim_{x \\to \\frac{\\pi}{3}} \\cos x = \\frac{1}{2}, \\qquad \\lim_{x \\to \\frac{3\\pi}{4}} \\tan x = -1.$$",
      ),
      generate(rng) {
        for (;;) {
          const name = rng.pick(["sin", "cos", "tan"] as const);
          const angle = rng.pick(specialAngles);
          const v = trigValue(name, angle);
          if (!v) continue;
          const answer = exactLatex(v);
          const other = exactLatex(name === "sin" ? angle.cos : angle.sin);
          return functionProblem({
            prompt: t(`Find $${lim(angle.latex)} \\${name} x$.`, `求 $${lim(angle.latex)} \\${name} x$。`),
            answer,
            wrong: [other, `-${answer}`.replace("--", ""), "1"],
            solution: t(
              `$\\${name} x$ has no break at $x = ${angle.latex}$, so the limit is $\\${name} ${angle.latex} = ${answer}$.`,
              `$\\${name} x$ 在 $x = ${angle.latex}$ 处没有间断，所以极限是 $\\${name} ${angle.latex} = ${answer}$。`,
            ),
          });
        }
      },
    },
    {
      id: "infinite-and-nonexistent-trigonometric-limits",
      title: t("Infinite and nonexistent limits", "无穷极限与不存在的极限"),
      explanation: t(
        "$\\tan x = \\frac{\\sin x}{\\cos x}$ has vertical asymptotes where $\\cos x = 0$. Just left of $\\frac{\\pi}{2}$, $\\tan x \\to \\infty$; just right, $\\tan x \\to -\\infty$; so $\\lim_{x \\to \\pi/2} \\tan x$ does not exist.\n\nAs $x \\to \\pm\\infty$, $\\sin x$ and $\\cos x$ keep oscillating between $-1$ and $1$, so their limits do not exist.",
        "$\\tan x = \\frac{\\sin x}{\\cos x}$ 在 $\\cos x = 0$ 处有竖直渐近线。在 $\\frac{\\pi}{2}$ 左侧附近 $\\tan x \\to \\infty$；右侧附近 $\\tan x \\to -\\infty$；所以 $\\lim_{x \\to \\pi/2} \\tan x$ 不存在。\n\n当 $x \\to \\pm\\infty$ 时，$\\sin x$ 和 $\\cos x$ 在 $-1$ 与 $1$ 之间不停振荡，所以极限不存在。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, -1, -2, 5]);
        const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        if (rng.bool(0.25)) {
          const fn = rng.pick(["\\sin x", "\\cos x", "\\sin 2x", "\\cos 3x"]);
          const target = rng.pick(["\\infty", "-\\infty"]);
          return limitChoice(
            rng,
            t(`Find $${lim(target)} ${coef}${fn}$.`, `求 $${lim(target)} ${coef}${fn}$。`),
            "dne",
            [Q.zero, Q.of(a), Q.of(-a)],
            t(
              `$${fn}$ oscillates between $-1$ and $1$ forever, so the limit does not exist.`,
              `$${fn}$ 永远在 $-1$ 与 $1$ 之间振荡，所以极限不存在。`,
            ),
            undefined,
            true,
          );
        }
        const k = rng.pick([-3, -1, 1, 3]);
        const at = piLatex(k, 2);
        const side = rng.pick([-1, 1, 0] as const);
        // tan x → +∞ just left of each asymptote and −∞ just right.
        const sign = (s: Side) => -s * Math.sign(a);
        const answer: LimitValue = side === 0 ? "dne" : sign(side) > 0 ? "inf" : "-inf";
        const operator = side === 0 ? lim(at) : lim(at, side);
        return limitChoice(
          rng,
          t(`Find $${operator} ${coef}\\tan x$.`, `求 $${operator} ${coef}\\tan x$。`),
          answer,
          [Q.zero, Q.of(a)],
          t(
            `$\\cos x \\to 0$ at $x = ${at}$, so $\\tan x \\to \\infty$ from the left and $-\\infty$ from the right. With the factor $${a}$: left $${infL(sign(-1))}$, right $${infL(sign(1))}$.${side === 0 ? " The sides differ, so the limit does not exist." : ""}`,
            `在 $x = ${at}$ 处 $\\cos x \\to 0$，所以 $\\tan x$ 从左侧趋于 $\\infty$，从右侧趋于 $-\\infty$。乘以 $${a}$ 后：左侧 $${infL(sign(-1))}$，右侧 $${infL(sign(1))}$。${side === 0 ? "两侧不同，所以极限不存在。" : ""}`,
          ),
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
  knowledgePoints: [
    {
      id: "reciprocal-trigonometric-limits-at-special-angles",
      title: t("Limits at special angles", "特殊角处的极限"),
      explanation: t(
        "Evaluate the sine or cosine at the special angle first, check that the denominator is not zero, and then take the reciprocal or quotient. Where the denominator is not zero, $\\sec x = \\frac{1}{\\cos x}$, $\\csc x = \\frac{1}{\\sin x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$ have no breaks, so substitute:\n\n$$\\lim_{x \\to \\frac{\\pi}{6}} \\sec x = \\frac{1}{\\sqrt{3}/2} = \\frac{2\\sqrt{3}}{3}.$$",
        "先求出特殊角处的正弦或余弦值，确认分母不为零，再取倒数或商。在分母不为零处，$\\sec x = \\frac{1}{\\cos x}$、$\\csc x = \\frac{1}{\\sin x}$、$\\cot x = \\frac{\\cos x}{\\sin x}$ 没有间断，直接代入：\n\n$$\\lim_{x \\to \\frac{\\pi}{6}} \\sec x = \\frac{1}{\\sqrt{3}/2} = \\frac{2\\sqrt{3}}{3}.$$",
      ),
      generate(rng) {
        for (;;) {
          const name = rng.pick(["sec", "csc", "cot"] as const);
          const angle = rng.pick(specialAngles);
          const one = { c: Q.one, m: 1 };
          const den = name === "sec" ? angle.cos : angle.sin;
          if (den.c.isZero()) continue;
          const v = exactDiv(name === "cot" ? angle.cos : one, den);
          const answer = exactLatex(v);
          const flipped = exactLatex(name === "cot" ? exactDiv(angle.sin, angle.cos.c.isZero() ? one : angle.cos) : den);
          return functionProblem({
            prompt: t(`Find $${lim(angle.latex)} \\${name} x$.`, `求 $${lim(angle.latex)} \\${name} x$。`),
            answer,
            wrong: [flipped, `-${answer}`.replace("--", "")],
            solution: t(
              `At $x = ${angle.latex}$, $\\${name === "sec" ? "cos" : "sin"} x = ${exactLatex(den)} \\ne 0$, so substitute: $\\${name} ${angle.latex} = ${answer}$.`,
              `在 $x = ${angle.latex}$ 处，$\\${name === "sec" ? "cos" : "sin"} x = ${exactLatex(den)} \\ne 0$，直接代入：$\\${name} ${angle.latex} = ${answer}$。`,
            ),
          });
        }
      },
    },
    {
      id: "reciprocal-trigonometric-limits-at-asymptotes",
      title: t("Limits at the asymptotes", "渐近线处的极限"),
      explanation: t(
        "Where the denominator is $0$, the function has a vertical asymptote. Find the sign of the function just to each side:\n\n- just right of $0$, $\\sin x > 0$, so $\\csc x \\to \\infty$ and $\\cot x \\to \\infty$;\n- just left of $0$, both tend to $-\\infty$;\n- just left of $\\frac{\\pi}{2}$, $\\cos x > 0$, so $\\sec x \\to \\infty$; just right, $\\sec x \\to -\\infty$.",
        "分母为 $0$ 处有竖直渐近线。判断函数在两侧附近的符号：\n\n- 在 $0$ 右侧附近 $\\sin x > 0$，所以 $\\csc x \\to \\infty$，$\\cot x \\to \\infty$；\n- 在 $0$ 左侧附近，二者都趋于 $-\\infty$；\n- 在 $\\frac{\\pi}{2}$ 左侧附近 $\\cos x > 0$，所以 $\\sec x \\to \\infty$；右侧附近 $\\sec x \\to -\\infty$。",
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
        return limitChoice(
          rng,
          t(`Find $${lim(at, side)} \\${name} x$.`, `求 $${lim(at, side)} \\${name} x$。`),
          sign > 0 ? "inf" : "-inf",
          [Q.zero, Q.one, Q.of(-1)],
          t(
            `$\\${name === "sec" ? "cos" : "sin"} x \\to 0$ as $x \\to ${at}$, and just to the ${sideWord(side).en} the function is ${sign > 0 ? "positive" : "negative"}, so the limit is $${infL(sign)}$.`,
            `当 $x \\to ${at}$ 时 $\\${name === "sec" ? "cos" : "sin"} x \\to 0$，而在${sideWord(side)["zh-CN"]}侧附近函数${sign > 0 ? "为正" : "为负"}，所以极限是 $${infL(sign)}$。`,
          ),
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
      n: d / 2 === Math.floor(d / 2) ? d / 2 - n : (d - 2 * n) / 2,
      d: d / 2 === Math.floor(d / 2) ? d : d * 2,
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
  encompasses: [
    { topic: "limits-of-trigonometric-functions", weight: 0.2 },
    { topic: "further-evaluating-expressions-containing-inverse-trigonometric-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverse-trigonometric-limits-at-a-point",
      title: t("Limits at a point", "一点处的极限"),
      explanation: t(
        "Inside their domains the inverse trigonometric functions are continuous, so the limit is the angle whose sine, cosine or tangent is the given number. Inside their domains, $\\arcsin$, $\\arccos$ and $\\arctan$ have no breaks, so their limits are their values: $\\lim_{x \\to 1/2} \\arccos x = \\frac{\\pi}{3}$ and $\\lim_{x \\to -1} \\arctan x = -\\frac{\\pi}{4}$.",
        "在定义域内反三角函数是连续的，所以极限就是正弦、余弦或正切等于给定数的那个角。在定义域内，$\\arcsin$、$\\arccos$、$\\arctan$ 没有间断，所以极限等于函数值：$\\lim_{x \\to 1/2} \\arccos x = \\frac{\\pi}{3}$，$\\lim_{x \\to -1} \\arctan x = -\\frac{\\pi}{4}$。",
      ),
      generate(rng) {
        const v = rng.pick(inverseTrigValues);
        const k = rng.pick([1, 1, 2, 3, -1]);
        const answer = piLatex(k * v.n, v.d);
        const coef = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        const argLatex = v.arg.startsWith("-") ? `\\left(${v.arg}\\right)` : v.arg;
        return functionProblem({
          prompt: t(`Find $${lim(v.arg)} ${coef}\\${v.name} x$.`, `求 $${lim(v.arg)} ${coef}\\${v.name} x$。`),
          answer,
          wrong: [piLatex(-k * v.n, v.d), piLatex(k * (v.d - 2 * v.n), 2 * v.d), piLatex(k * v.n, 2 * v.d)],
          solution: t(
            `$\\${v.name} ${argLatex} = ${piLatex(v.n, v.d)}$, so the limit is $${answer}$.`,
            `$\\${v.name} ${argLatex} = ${piLatex(v.n, v.d)}$，所以极限是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "arctangent-limits-at-infinity",
      title: t("Arctangent at infinity", "无穷远处的反正切"),
      explanation: t(
        "$\\arctan x$ has horizontal asymptotes $y = \\pm\\frac{\\pi}{2}$:\n\n$$\\lim_{x \\to \\infty} \\arctan x = \\frac{\\pi}{2}, \\qquad \\lim_{x \\to -\\infty} \\arctan x = -\\frac{\\pi}{2}.$$\n\nA positive multiple inside, as in $\\arctan 3x$, does not change these; a negative one swaps them.",
        "$\\arctan x$ 有水平渐近线 $y = \\pm\\frac{\\pi}{2}$：\n\n$$\\lim_{x \\to \\infty} \\arctan x = \\frac{\\pi}{2}, \\qquad \\lim_{x \\to -\\infty} \\arctan x = -\\frac{\\pi}{2}.$$\n\n括号内乘以正数（如 $\\arctan 3x$）不改变这些极限；乘以负数则使二者互换。",
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
        return functionProblem({
          prompt: t(`Find $${lim(target)} \\left(${expr}\\right)$.`, `求 $${lim(target)} \\left(${expr}\\right)$。`),
          answer,
          wrong: [c === 0 ? wrongHalf : `${wrongHalf} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`, String(c), piLatex(a * sign, 1)],
          solution: t(
            `As $x \\to ${target}$, $${inner} \\to ${infL(sign)}$, so $\\arctan ${inner} \\to ${piLatex(sign, 2)}$ and the limit is $${answer}$.`,
            `当 $x \\to ${target}$ 时，$${inner} \\to ${infL(sign)}$，所以 $\\arctan ${inner} \\to ${piLatex(sign, 2)}$，极限是 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "one-sided-limits-of-piecewise-functions",
      title: t("One-sided limits at a break point", "分段点处的单侧极限"),
      explanation: t(
        "At the break point $x = a$ of a piecewise function, the left-sided limit uses the formula for $x < a$ and the right-sided limit the formula for $x > a$:\n\n$$f(x) = \\begin{cases} x^{2} & x < 2 \\\\ 3x - 1 & x \\ge 2 \\end{cases} \\quad\\Rightarrow\\quad \\lim_{x \\to 2^{-}} f(x) = 4, \\; \\lim_{x \\to 2^{+}} f(x) = 5.$$",
        "在分段函数的分段点 $x = a$ 处，左极限用 $x < a$ 的表达式，右极限用 $x > a$ 的表达式：\n\n$$f(x) = \\begin{cases} x^{2} & x < 2 \\\\ 3x - 1 & x \\ge 2 \\end{cases} \\quad\\Rightarrow\\quad \\lim_{x \\to 2^{-}} f(x) = 4, \\; \\lim_{x \\to 2^{+}} f(x) = 5.$$",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = rng.bool() ? quadratic(rng) : linearPiece(rng);
        const right = rng.bool() ? quadratic(rng) : linearPiece(rng);
        const closedLeft = rng.bool();
        const side = rng.pick([-1, 1] as const);
        const answer = side < 0 ? left.at(a) : right.at(a);
        return numberProblem({
          prompt: t(
            `Let $$${casesLatex([
              [left.latex, `x ${closedLeft ? "\\le" : "<"} ${a}`],
              [right.latex, `x ${closedLeft ? ">" : "\\ge"} ${a}`],
            ])}$$ Find $${lim(a, side)} f(x)$.`,
            `设 $$${casesLatex([
              [left.latex, `x ${closedLeft ? "\\le" : "<"} ${a}`],
              [right.latex, `x ${closedLeft ? ">" : "\\ge"} ${a}`],
            ])}$$ 求 $${lim(a, side)} f(x)$。`,
          ),
          answer,
          wrong: [side < 0 ? right.at(a) : left.at(a), a],
          solution: t(
            `For $x$ just to the ${sideWord(side).en} of $${a}$, $f(x) = ${(side < 0 ? left : right).latex}$, so the limit is its value at $${a}$: $${answer}$.`,
            `当 $x$ 在 $${a}$ 的${sideWord(side)["zh-CN"]}侧附近时，$f(x) = ${(side < 0 ? left : right).latex}$，所以极限是它在 $${a}$ 处的值：$${answer}$。`,
          ),
        });
      },
    },
    {
      id: "two-sided-limits-of-piecewise-functions",
      title: t("Two-sided limits at a break point", "分段点处的双侧极限"),
      explanation: t(
        "Compute both one-sided limits at the break point. If they agree, that is the limit; if not, the limit does not exist. The value of $f$ at the break point never matters.",
        "在分段点处计算两个单侧极限。若相等，它就是极限；若不相等，极限不存在。$f$ 在分段点处的值无关紧要。",
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
        return limitChoice(
          rng,
          t(
            `Let $$${casesLatex([
              [left.latex, `x < ${a}`],
              [String(middle), `x = ${a}`],
              [right.latex, `x > ${a}`],
            ])}$$ Find $${lim(a)} f(x)$.`,
            `设 $$${casesLatex([
              [left.latex, `x < ${a}`],
              [String(middle), `x = ${a}`],
              [right.latex, `x > ${a}`],
            ])}$$ 求 $${lim(a)} f(x)$。`,
          ),
          L === R ? Q.of(L) : "dne",
          [Q.of(middle), Q.of(L), Q.of(R)],
          t(
            `$${lim(a, -1)} f(x) = ${L}$ and $${lim(a, 1)} f(x) = ${R}$. ${L === R ? `They agree, so the limit is $${L}$.` : "They differ, so the limit does not exist."}`,
            `$${lim(a, -1)} f(x) = ${L}$，$${lim(a, 1)} f(x) = ${R}$。${L === R ? `二者相等，所以极限是 $${L}$。` : "二者不相等，所以极限不存在。"}`,
          ),
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
