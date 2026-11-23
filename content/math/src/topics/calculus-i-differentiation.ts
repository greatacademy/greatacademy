import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import {
  expressionProblem,
  type FunctionProblem,
  functionProblem,
  numberProblem,
  reasonChoice,
  say,
  solutionsProblem,
  steps,
  why,
  whySet,
  withMistakes,
} from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { bare, fac, graphAltOf, lim, oneOf, type Poly, pAt, par, pDer, pLatex, power, range, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 4: Introduction to Differentiation, module 4.9. Topic 4.9.1
// is the existing the-average-rate-of-change-of-a-function.

/** Step is one labelled step of a solution: its title in each locale, what it says, and the lines it displays. */
export type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
export function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], said, lines = []], i) => {
        const gap = locale === "en" && said[locale] !== "" ? " " : "";
        return `${stepLabel(i + 1, en, zh)[locale]}${gap}${said[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。**${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** none is a step that only displays its lines. */
export const none = t("", "");

/** fmt writes a value to four decimal places without trailing zeros, or as m × 10^k when it is very large or very small. */
export function fmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1e6 || (a > 0 && a < 1e-4)) {
    let k = Math.floor(Math.log10(a));
    let m = Math.round((v / 10 ** k) * 100) / 100;
    if (Math.abs(m) >= 10) {
      m /= 10;
      k += 1;
    }
    return `${m} \\times 10^{${k}}`;
  }
  return dec(Q.of(Math.round(v * 10000) || 0, 10000));
}

/** shown writes a value, with a decimal next to it when it is not a whole number. */
export const shown = (q: Q) => (q.isInteger() ? q.toLatex() : `${q.toLatex()} = ${fmt(q.toNumber())}`);

/** Value is a value to check against: a number, a fraction, or its LaTeX with its decimal value. */
export type Value = number | Q | readonly [latex: string, value: number];

/** quotients checks a rate of change at a with difference quotients on both sides, step = 0.01 and step = −0.01, and their average, which is exact when f is a quadratic. */
export function quotients(f: (x: number) => number, a: number, value: Value, name = "f", v = "x", lead?: Text, step = "h"): Text {
  const at = (h: number) => (f(a + h) - f(a)) / h;
  const line = (h: number) => `$$\\frac{${name}(${fmt(a + h)}) - ${name}(${fmt(a)})}{${fmt(h)}} \\approx ${fmt(at(h))}$$`;
  const lines = `${line(0.01)}\n\n${line(-0.01)}`;
  const target = typeof value === "number" ? value : value instanceof Q ? value.toNumber() : value[1];
  const shownValue =
    typeof value === "number"
      ? String(value)
      : value instanceof Q
        ? shown(value)
        : `${value[0]}${Number.isInteger(value[1]) ? "" : ` \\approx ${fmt(value[1])}`}`;
  const average = (at(0.01) + at(-0.01)) / 2;
  const mean = fmt(average);
  const off = (x: number) => Math.abs(x - target);
  const isExact = (x: number) => off(x) < 1e-7 * Math.max(1, Math.abs(target));
  const closer = off(average) < Math.min(off(at(0.01)), off(at(-0.01)));
  const [en, zh] =
    isExact(at(0.01)) && isExact(at(-0.01))
      ? [`Both are exactly $${shownValue}$.`, `两者都恰好是 $${shownValue}$。`]
      : isExact(average)
        ? [
            `Both are close to $${shownValue}$, and their average is exactly $${shownValue}$.`,
            `两者都接近 $${shownValue}$，它们的平均值恰好是 $${shownValue}$。`,
          ]
        : mean === fmt(target)
          ? [
              `Both are close to $${shownValue}$, and their average, $${mean}$, agrees with it to four decimal places.`,
              `两者都接近 $${shownValue}$，它们的平均值 $${mean}$ 与它在四位小数内一致。`,
            ]
          : closer
            ? [
                `Both are close to $${shownValue}$, and their average, $${mean}$, is closer still.`,
                `两者都接近 $${shownValue}$，它们的平均值 $${mean}$ 更接近。`,
              ]
            : [
                `Both are close to $${shownValue}$, and so is their average, $${mean}$.`,
                `两者都接近 $${shownValue}$，它们的平均值 $${mean}$ 也接近。`,
              ];
  return t(
    `${lead ? `${lead.en} ` : ""}Estimate the rate of change at $${v} = ${a}$ with a difference quotient on each side, $${step} = 0.01$ and $${step} = -0.01$:\n\n${lines}\n\n${en}`,
    `${lead ? lead["zh-CN"] : ""}用两侧的差商估计 $${v} = ${a}$ 处的变化率，取 $${step} = 0.01$ 和 $${step} = -0.01$：\n\n${lines}\n\n${zh}`,
  );
}

/** Mistake is a wrong value with what to say about it. */
export type Mistake = ReturnType<typeof why>;

/** firsts keeps the first mistake for each value, so no response gets two reasons. */
export function firsts(ms: readonly Mistake[]): Mistake[] {
  const key = (m: Mistake) => (typeof m.value === "number" ? Q.of(m.value) : m.value).toString();
  return ms.filter((m, i) => ms.findIndex((n) => key(n) === key(m)) === i);
}

/** Said is a wrong response with what to say about it. */
export type Said = ReturnType<typeof say>;

/** once keeps the first reason for each response. */
export const once = (ms: readonly Said[]) => ms.filter((m, i) => ms.findIndex((n) => n.response === m.response) === i);

/** functionWith builds a function problem whose wrong responses each get a reason of their own. */
export function functionWith(p: Omit<FunctionProblem, "wrong">, mistakes: readonly Said[]): Problem {
  const kept = once(mistakes);
  const problem = functionProblem({ ...p, wrong: kept.map((m) => m.response) });
  return withMistakes(
    problem,
    kept.filter((m) => (problem.wrong ?? []).includes(m.response)),
  );
}

/** pSub writes a polynomial with a number put in for x: "3(2)^{2} - 4(2) + 1". */
const pSub = (p: Poly, a: number) => poly(...p.map((c, i) => [c, i === 0 ? "" : `(${a})${i === 1 ? "" : `^{${i}}`}`] as const).reverse());

/** quadratic is sx² + bx + c with small coefficients. */
const quadratic = (rng: Rng): Poly => [rng.int(-6, 6), rng.int(-5, 5), rng.nonZero(-3, 3)];

/** cubic is a cubic with small coefficients. */
const cubic = (rng: Rng): Poly => [rng.int(-6, 6), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];

/** quotientSteps works out [f(a + h) − f(a)]/h for f = sx² + bx + c, with a a number or "x". */
function quotientSteps(p: Poly, a: number | "x"): string {
  const [, b, s] = p as [number, number, number];
  if (a === "x") {
    const top = poly([2 * s, "xh"], [s, "h^{2}"], [b, "h"]);
    return `\\frac{f(x + h) - f(x)}{h} = \\frac{${top}}{h} = ${poly([2 * s, "x"], [s, "h"], [b, ""])}`;
  }
  const lin = 2 * s * a + b;
  return `\\frac{f(${a} + h) - f(${a})}{h} = \\frac{${poly([lin, "h"], [s, "h^{2}"])}}{h} = ${poly([s, "h"], [lin, ""])}`;
}

/** square writes (a + h)² expanded: "9 + 6h + h^{2}". */
const square = (a: number) => poly([a * a, ""], [2 * a, "h"], [1, "h^{2}"]);

/** theAverageRateOfChangeOfAFunctionOverAVaryingInterval writes the difference quotient. */
export const theAverageRateOfChangeOfAFunctionOverAVaryingInterval: TopicDef = {
  id: "the-average-rate-of-change-of-a-function-over-a-varying-interval",
  title: t("The Average Rate of Change of a Function over a Varying Interval", "函数在可变区间上的平均变化率"),
  summary: t(
    "Write and simplify the difference quotient, the average rate of change over an interval of width h.",
    "写出并化简差商，即在宽度为 h 的区间上的平均变化率。",
  ),
  intro: t(
    "A cart has rolled $t^{2}$ meters after $t$ seconds. Over the interval $[3, 3 + h]$ its average speed is\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h,$$\n\nwhich gives the average speed for every width at once: $7$ m/s when $h = 1$, $6.1$ m/s when $h = 0.1$.\n\nCheck: over $[3, 4]$ the cart goes from $9$ m to $16$ m, which is $7$ m in $1$ second, as $6 + 1$ says.\n\nIn this lesson we write the average rate of change over an interval of width $h$ as one expression, the difference quotient, and simplify it, first at a given point and then at a general point $x$.",
    "一辆小车 $t$ 秒后滚过了 $t^{2}$ 米。在区间 $[3, 3 + h]$ 上，它的平均速度是\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h,$$\n\n它一次给出了每种宽度下的平均速度：$h = 1$ 时是 $7$ m/s，$h = 0.1$ 时是 $6.1$ m/s。\n\n检验：在 $[3, 4]$ 上小车从 $9$ m 走到 $16$ m，$1$ 秒走了 $7$ m，与 $6 + 1$ 一致。\n\n本课我们把宽度为 $h$ 的区间上的平均变化率写成一个式子，即差商，并把它化简，先在给定的点处，再在一般的点 $x$ 处。",
  ),
  prerequisites: ["the-average-rate-of-change-of-a-function"],
  encompasses: [{ topic: "the-average-rate-of-change-of-a-function", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "difference-quotient-at-a-point",
      title: t("The difference quotient at a point", "某点处的差商"),
      explanation: t(
        "The average rate of change of $f$ over $[a, a + h]$ is the **difference quotient**\n\n$$\\frac{f(a + h) - f(a)}{h}.$$\n\nFor a polynomial, expand $f(a + h)$, subtract $f(a)$ (the terms without $h$ cancel) and divide by $h$. For $f(x) = x^{2}$ at $a = 3$:\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h.$$\n\nCheck: with $h = 1$, directly $\\frac{f(4) - f(3)}{1} = 16 - 9 = 7$, and $6 + 1 = 7$.\n\n> **Watch out.** $f(a + h)$ is not $f(a) + h$. Put the whole of $a + h$ into $f$: $(3 + h)^{2} = 9 + 6h + h^{2}$, not $9 + h^{2}$.",
        "$f$ 在 $[a, a + h]$ 上的平均变化率是**差商**\n\n$$\\frac{f(a + h) - f(a)}{h}.$$\n\n对多项式，先展开 $f(a + h)$，再减去 $f(a)$（不含 $h$ 的项相互抵消），最后除以 $h$。对 $f(x) = x^{2}$，$a = 3$：\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h.$$\n\n检验：取 $h = 1$，直接算 $\\frac{f(4) - f(3)}{1} = 16 - 9 = 7$，而 $6 + 1 = 7$。\n\n> **注意。** $f(a + h)$ 不是 $f(a) + h$。要把整个 $a + h$ 代入 $f$：$(3 + h)^{2} = 9 + 6h + h^{2}$，不是 $9 + h^{2}$。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const a = rng.int(-4, 4);
        const [, b, s] = p as [number, number, number];
        const lin = 2 * s * a + b;
        const fa = pAt(p, a);
        const f1 = pAt(p, a + 1);
        const answer = poly([s, "h"], [lin, ""]);
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Simplify the difference quotient $\\frac{f(${a} + h) - f(${a})}{h}$ for $h \\ne 0$.`,
            `设 $f(x) = ${pLatex(p)}$。当 $h \\ne 0$ 时，化简差商 $\\frac{f(${a} + h) - f(${a})}{h}$。`,
          ),
          answer,
          simplified: true,
          mistakes: once([
            say(
              poly([s, "h"], [s * a + b, ""]),
              `This misses the $2$ in $(${a} + h)^{2} = ${square(a)}$: the middle term is $${2 * a}h$.`,
              `这漏掉了 $(${a} + h)^{2} = ${square(a)}$ 中的 $2$：中间一项是 $${2 * a}h$。`,
            ),
            say(
              poly([s, "h^{2}"], [lin, "h"]),
              "This is only the top, $f(a + h) - f(a)$. It still has to be divided by $h$.",
              "这只是分子 $f(a + h) - f(a)$，还要除以 $h$。",
            ),
            say(
              String(lin),
              `This lets $h$ go to $0$, which gives the instantaneous rate. The difference quotient keeps the term $${poly([s, "h"])}$.`,
              `这让 $h$ 趋于 $0$，得到的是瞬时变化率。差商还保留着 $${poly([s, "h"])}$ 这一项。`,
            ),
          ]),
          solution: walked(
            [
              [["Evaluate $f$ at the point", "求该点的函数值"], t(`Substitute $x = ${a}$:`, `代入 $x = ${a}$：`), [`f(${a}) = ${fa}`]],
              [
                ["Expand the shifted value", "展开平移后的函数值"],
                t(`Use $(${a} + h)^{2} = ${square(a)}$:`, `利用 $(${a} + h)^{2} = ${square(a)}$：`),
                [`f(${a} + h) = ${poly([s, "h^{2}"], [lin, "h"], [fa, ""])}`],
              ],
              [
                ["Subtract and divide by $h$", "相减再除以 $h$"],
                t("The constant terms cancel:", "常数项相互抵消："),
                [quotientSteps(p, a)],
              ],
            ],
            t(
              `Put $h = 1$. The answer gives $${s} + ${par(lin)} = ${s + lin}$, and directly $\\frac{f(${a + 1}) - f(${a})}{1} = ${f1} - ${par(fa)} = ${f1 - fa}$.`,
              `取 $h = 1$。答案给出 $${s} + ${par(lin)} = ${s + lin}$，直接计算 $\\frac{f(${a + 1}) - f(${a})}{1} = ${f1} - ${par(fa)} = ${f1 - fa}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "difference-quotient-at-a-general-point",
      title: t("The difference quotient at a general point", "一般点处的差商"),
      explanation: t(
        "At a general point $x$ the difference quotient is an expression in both $x$ and $h$. Expand the function at the shifted input $x + h$, cancel the terms of $f(x)$, and divide by $h$; letting $h$ go to zero afterwards gives the derivative. For $f(x) = 3x^{2}$:\n\n$$\\frac{3(x + h)^{2} - 3x^{2}}{h} = \\frac{6xh + 3h^{2}}{h} = 6x + 3h.$$\n\nCheck: at $x = 1$ with $h = 1$, directly $\\frac{f(2) - f(1)}{1} = 12 - 3 = 9$, and $6 + 3 = 9$.\n\n> **Watch out.** The terms of $f(x)$ cancel, but every term with $h$ stays: $6x + 3h$ is the difference quotient, and the $3h$ only disappears in the limit $h \\to 0$.",
        "在一般点 $x$ 处，差商是同时含 $x$ 和 $h$ 的式子。展开平移后自变量 $x + h$ 处的函数值，消去 $f(x)$ 的各项，再除以 $h$；之后令 $h$ 趋于零就得到导数。对 $f(x) = 3x^{2}$：\n\n$$\\frac{3(x + h)^{2} - 3x^{2}}{h} = \\frac{6xh + 3h^{2}}{h} = 6x + 3h.$$\n\n检验：在 $x = 1$ 处取 $h = 1$，直接算 $\\frac{f(2) - f(1)}{1} = 12 - 3 = 9$，而 $6 + 3 = 9$。\n\n> **注意。** $f(x)$ 的各项会抵消，但含 $h$ 的项都要保留：$6x + 3h$ 是差商，其中的 $3h$ 只有在 $h \\to 0$ 取极限时才消失。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const [c, b, s] = p as [number, number, number];
        const answer = poly([2 * s, "x"], [s, "h"], [b, ""]);
        const f1 = pAt(p, 1);
        const f2 = pAt(p, 2);
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Simplify $\\frac{f(x + h) - f(x)}{h}$ for $h \\ne 0$.`,
            `设 $f(x) = ${pLatex(p)}$。当 $h \\ne 0$ 时，化简 $\\frac{f(x + h) - f(x)}{h}$。`,
          ),
          answer,
          simplified: true,
          mistakes: once([
            say(
              poly([2 * s, "x"], [b, ""]),
              `This is the derivative: it lets $h$ go to $0$. The difference quotient keeps the term $${poly([s, "h"])}$.`,
              `这是导数：它让 $h$ 趋于了 $0$。差商还保留着 $${poly([s, "h"])}$ 这一项。`,
            ),
            say(
              poly([s, "x"], [s, "h"], [b, ""]),
              "This misses the $2$ in $(x + h)^{2} = x^{2} + 2xh + h^{2}$.",
              "这漏掉了 $(x + h)^{2} = x^{2} + 2xh + h^{2}$ 中的 $2$。",
            ),
            say(
              poly([2 * s, "x"], [s, "h"]),
              `This drops the linear term: $${poly([b, "(x + h)"])} - ${par(b)}x = ${poly([b, "h"])}$, which leaves $${b}$ after dividing by $h$.`,
              `这丢掉了一次项：$${poly([b, "(x + h)"])} - ${par(b)}x = ${poly([b, "h"])}$，除以 $h$ 后剩下 $${b}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Expand the shifted value", "展开平移后的函数值"],
                t("Use $(x + h)^{2} = x^{2} + 2xh + h^{2}$:", "利用 $(x + h)^{2} = x^{2} + 2xh + h^{2}$："),
                [`f(x + h) = ${poly([s, "x^{2}"], [2 * s, "xh"], [s, "h^{2}"], [b, "x"], [b, "h"], [c, ""])}`],
              ],
              [
                ["Subtract $f(x)$", "减去 $f(x)$"],
                t("The terms of $f(x)$ cancel, leaving only terms with $h$:", "$f(x)$ 的各项相互抵消，只剩下含 $h$ 的项："),
                [`f(x + h) - f(x) = ${poly([2 * s, "xh"], [s, "h^{2}"], [b, "h"])}`],
              ],
              [["Divide by $h$", "除以 $h$"], none, [quotientSteps(p, "x")]],
            ],
            t(
              `Put $x = 1$ and $h = 1$. The answer gives $${2 * s} + ${par(s)} + ${par(b)} = ${3 * s + b}$, and directly $\\frac{f(2) - f(1)}{1} = ${f2} - ${par(f1)} = ${f2 - f1}$.`,
              `取 $x = 1$，$h = 1$。答案给出 $${2 * s} + ${par(s)} + ${par(b)} = ${3 * s + b}$，直接计算 $\\frac{f(2) - f(1)}{1} = ${f2} - ${par(f1)} = ${f2 - f1}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theInstantaneousRateOfChangeOfAFunctionAtAPoint takes the limit of the difference quotient. */
export const theInstantaneousRateOfChangeOfAFunctionAtAPoint: TopicDef = {
  id: "the-instantaneous-rate-of-change-of-a-function-at-a-point",
  title: t("The Instantaneous Rate of Change of a Function at a Point", "函数在一点处的瞬时变化率"),
  summary: t(
    "Find the instantaneous rate of change as the limit of average rates of change, exactly and from tables.",
    "把瞬时变化率作为平均变化率的极限来求，包括精确计算和由数值表估计。",
  ),
  intro: t(
    "Over $[3, 3 + h]$ the average rate of change of $x^{2}$ is $6 + h$. As $h$ shrinks to $0$, from either side, these average rates close in on a single number, $6$. That number is the instantaneous rate of change of $x^{2}$ at $3$: how fast $x^{2}$ is changing at that very point.\n\nCheck: over $[3, 3.01]$ the average rate is $\\frac{9.0601 - 9}{0.01} = 6.01$, and over $[2.99, 3]$ it is $\\frac{8.9401 - 9}{-0.01} = 5.99$.\n\nIn this lesson we find instantaneous rates of change as limits of average rates: exactly by simplifying first, from tables of average rates, and as the velocity of a moving object.",
    "在 $[3, 3 + h]$ 上，$x^{2}$ 的平均变化率是 $6 + h$。当 $h$ 从任一侧缩小到 $0$ 时，这些平均变化率逼近同一个数 $6$。这个数就是 $x^{2}$ 在 $3$ 处的瞬时变化率：$x^{2}$ 恰在这一点变化得有多快。\n\n检验：在 $[3, 3.01]$ 上平均变化率是 $\\frac{9.0601 - 9}{0.01} = 6.01$，在 $[2.99, 3]$ 上是 $\\frac{8.9401 - 9}{-0.01} = 5.99$。\n\n本课我们把瞬时变化率作为平均变化率的极限来求：先化简再精确计算，由平均变化率的数值表来估计，以及求运动物体的速度。",
  ),
  prerequisites: [
    "the-average-rate-of-change-of-a-function-over-a-varying-interval",
    "calculating-limits-of-rational-functions-by-factoring",
  ],
  encompasses: [
    { topic: "the-average-rate-of-change-of-a-function-over-a-varying-interval", weight: 0.6 },
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "instantaneous-rate-as-a-limit",
      title: t("The instantaneous rate as a limit", "瞬时变化率作为极限"),
      explanation: t(
        "As the interval shrinks, the average rate of change approaches the **instantaneous rate of change** at $a$:\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$\n\nSimplify the difference quotient first, then let $h \\to 0$. For $f(x) = x^{2}$ at $a = 3$, $\\frac{f(3 + h) - f(3)}{h} = 6 + h \\to 6$.\n\nCheck: with $h = 0.01$ the quotient is $\\frac{9.0601 - 9}{0.01} = 6.01$, already close to $6$.\n\n> **Watch out.** Simplify before letting $h \\to 0$. Putting $h = 0$ into $\\frac{f(a + h) - f(a)}{h}$ straight away gives $\\frac{0}{0}$, which says nothing.",
        "当区间缩小时，平均变化率趋近于 $a$ 处的**瞬时变化率**：\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$\n\n先化简差商，再令 $h \\to 0$。对 $f(x) = x^{2}$，$a = 3$，$\\frac{f(3 + h) - f(3)}{h} = 6 + h \\to 6$。\n\n检验：取 $h = 0.01$，差商是 $\\frac{9.0601 - 9}{0.01} = 6.01$，已经接近 $6$。\n\n> **注意。** 先化简，再令 $h \\to 0$。直接把 $h = 0$ 代入 $\\frac{f(a + h) - f(a)}{h}$ 只会得到 $\\frac{0}{0}$，说明不了什么。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const a = rng.int(-5, 5);
        const [, b, s] = p as [number, number, number];
        const answer = 2 * s * a + b;
        const fa = pAt(p, a);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Find the instantaneous rate of change of $f$ at $x = ${a}$ by evaluating $${lim(0, undefined, "h")} \\frac{f(${a} + h) - f(${a})}{h}$.`,
            `设 $f(x) = ${pLatex(p)}$。通过计算 $${lim(0, undefined, "h")} \\frac{f(${a} + h) - f(${a})}{h}$，求 $f$ 在 $x = ${a}$ 处的瞬时变化率。`,
          ),
          answer,
          mistakes: firsts([
            why(
              s * a + b,
              `This misses the $2$ in $(${a} + h)^{2} = ${square(a)}$, so the term $${2 * s * a}h$ became $${s * a}h$.`,
              `这漏掉了 $(${a} + h)^{2} = ${square(a)}$ 中的 $2$，把 $${2 * s * a}h$ 这一项算成了 $${s * a}h$。`,
            ),
            why(fa, `This is $f(${a})$, the value of the function, not how fast it changes.`, `这是函数值 $f(${a})$，不是函数变化的快慢。`),
            why(
              s * a * a + b,
              `This keeps $${s} \\cdot ${par(a)}^{2}$ from $f$. After dividing by $h$, the $x^{2}$ term leaves $${s} \\cdot 2 \\cdot ${par(a)} = ${2 * s * a}$.`,
              `这保留了 $f$ 中的 $${s} \\cdot ${par(a)}^{2}$。除以 $h$ 之后，$x^{2}$ 项留下的是 $${s} \\cdot 2 \\cdot ${par(a)} = ${2 * s * a}$。`,
            ),
            why(
              answer + s,
              `This puts $h = 1$, which gives the average rate over $[${a}, ${a + 1}]$. The instantaneous rate lets $h$ go to $0$.`,
              `这代入了 $h = 1$，得到的是 $[${a}, ${a + 1}]$ 上的平均变化率。瞬时变化率要让 $h$ 趋于 $0$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Simplify the difference quotient", "化简差商"],
                t(
                  `Expand $f(${a} + h)$, subtract $f(${a}) = ${fa}$ and divide by $h$:`,
                  `展开 $f(${a} + h)$，减去 $f(${a}) = ${fa}$，再除以 $h$：`,
                ),
                [quotientSteps(p, a)],
              ],
              [
                ["Let $h \\to 0$", "令 $h \\to 0$"],
                t(`The term $${poly([s, "h"])}$ goes to $0$:`, `$${poly([s, "h"])}$ 这一项趋于 $0$：`),
                [`${lim(0, undefined, "h")} \\left(${poly([s, "h"], [answer, ""])}\\right) = ${answer}`],
              ],
            ],
            quotients((x) => pAt(p, x), a, answer),
          ),
        });
      },
    },
    {
      id: "estimating-an-instantaneous-rate-from-a-table",
      title: t("Estimating an instantaneous rate from a table", "由数值表估计瞬时变化率"),
      explanation: t(
        "Compute average rates of change over smaller and smaller intervals $[a, a + h]$, with $h$ positive and negative. The values they settle towards estimate the instantaneous rate of change at $a$.\n\nFor $f(x) = x^{3}$ at $a = 1$: the average rate is $3.31$ for $h = 0.1$, $3.0301$ for $h = 0.01$ and $2.9701$ for $h = -0.01$. They settle towards $3$.\n\nCheck: the average of the rates for $h = 0.01$ and $h = -0.01$ is $3.0001$, closer still to $3$.\n\n> **Watch out.** Read the rates for the smallest $h$, on both sides. The rate for $h = 0.1$ is only a rough estimate, and the value $0$ that $h$ approaches is not the rate.",
        "计算在越来越小的区间 $[a, a + h]$ 上的平均变化率，$h$ 取正值也取负值。它们稳定趋向的值就是 $a$ 处瞬时变化率的估计值。\n\n对 $f(x) = x^{3}$，$a = 1$：$h = 0.1$ 时平均变化率是 $3.31$，$h = 0.01$ 时是 $3.0301$，$h = -0.01$ 时是 $2.9701$。它们稳定地趋向 $3$。\n\n检验：$h = 0.01$ 和 $h = -0.01$ 两个变化率的平均值是 $3.0001$，更接近 $3$。\n\n> **注意。** 要看两侧最小的 $h$ 对应的变化率。$h = 0.1$ 的变化率只是粗略的估计；$h$ 趋向的 $0$ 也不是变化率。",
      ),
      generate(rng) {
        const p = cubic(rng);
        const a = rng.int(-2, 2);
        const answer = pAt(pDer(p), a);
        const hs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];
        const rate = (h: number) => (pAt(p, a + h) - pAt(p, a)) / h;
        const r = (h: number) => rate(h).toFixed(4);
        const tab = table(["$h$", ...hs.map((h) => `$${h}$`)], [`$\\frac{f(${a} + h) - f(${a})}{h}$`, ...hs.map((h) => `$${r(h)}$`)]);
        const central = fmt((rate(0.1) + rate(-0.1)) / 2);
        return numberProblem({
          prompt: t(
            `The table shows average rates of change of a function $f$ over the intervals from $${a}$ to $${a} + h$.\n\n${tab}\n\nEstimate the instantaneous rate of change of $f$ at $x = ${a}$.`,
            `下表给出函数 $f$ 在从 $${a}$ 到 $${a} + h$ 的区间上的平均变化率。\n\n${tab}\n\n估计 $f$ 在 $x = ${a}$ 处的瞬时变化率。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Math.round(rate(0.1)),
              "This rounds the rate for $h = 0.1$, the widest interval on the right. The smallest $h$ gives the best estimate.",
              "这是把右侧最宽区间 $h = 0.1$ 的变化率取整。最小的 $h$ 给出的估计最好。",
            ),
            why(
              Math.round(rate(-0.1)),
              "This rounds the rate for $h = -0.1$, the widest interval on the left. The smallest $h$ gives the best estimate.",
              "这是把左侧最宽区间 $h = -0.1$ 的变化率取整。最小的 $h$ 给出的估计最好。",
            ),
            why(
              0,
              "$0$ is where $h$ goes, not where the rates go. Read the rates in the second row.",
              "$0$ 是 $h$ 的去向，不是变化率的去向。要看第二行的变化率。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the smallest steps", "看最小的步长"],
                t(
                  `For $h = 0.001$ the average rate is $${r(0.001)}$, and for $h = -0.001$ it is $${r(-0.001)}$.`,
                  `$h = 0.001$ 时平均变化率是 $${r(0.001)}$，$h = -0.001$ 时是 $${r(-0.001)}$。`,
                ),
              ],
              [
                ["Find where the rates settle", "找出变化率趋向的值"],
                t(
                  `As $h$ shrinks on both sides, the rates settle towards $${answer}$, so the instantaneous rate is about $${answer}$.`,
                  `当 $h$ 从两侧缩小时，变化率稳定地趋向 $${answer}$，所以瞬时变化率约为 $${answer}$。`,
                ),
              ],
            ],
            t(
              `Even the two widest intervals point the same way: the rates for $h = 0.1$ and $h = -0.1$ are $${r(0.1)}$ and $${r(-0.1)}$, and their average, $${central}$, is close to $${answer}$.`,
              `最宽的两个区间也指向同一个值：$h = 0.1$ 和 $h = -0.1$ 的变化率是 $${r(0.1)}$ 和 $${r(-0.1)}$，它们的平均值 $${central}$ 接近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "instantaneous-velocity",
      title: t("Instantaneous velocity", "瞬时速度"),
      explanation: t(
        "For a position function $s(t)$, the average rate of change is the average velocity, and the instantaneous rate of change is the **instantaneous velocity**:\n\n$$v(a) = \\lim_{h \\to 0} \\frac{s(a + h) - s(a)}{h}.$$\n\nFor $s(t) = 20t - 5t^{2}$ at $t = 1$: $\\frac{s(1 + h) - s(1)}{h} = \\frac{10h - 5h^{2}}{h} = 10 - 5h \\to 10$, so $v(1) = 10$ m/s.\n\nCheck: $s(1.01) = 15.0995$ and $s(1) = 15$, so over that hundredth of a second the average velocity is $9.95$ m/s.\n\n> **Watch out.** The height divided by the time, $\\frac{s(a)}{a}$, is not the velocity at $t = a$. And a negative velocity means the object is moving down.",
        "对位置函数 $s(t)$，平均变化率是平均速度，瞬时变化率是**瞬时速度**：\n\n$$v(a) = \\lim_{h \\to 0} \\frac{s(a + h) - s(a)}{h}.$$\n\n对 $s(t) = 20t - 5t^{2}$ 在 $t = 1$ 处：$\\frac{s(1 + h) - s(1)}{h} = \\frac{10h - 5h^{2}}{h} = 10 - 5h \\to 10$，所以 $v(1) = 10$ m/s。\n\n检验：$s(1.01) = 15.0995$，$s(1) = 15$，所以这百分之一秒内的平均速度是 $9.95$ m/s。\n\n> **注意。** 高度除以时间 $\\frac{s(a)}{a}$ 不是 $t = a$ 时的速度。速度为负表示物体在向下运动。",
      ),
      generate(rng) {
        const v0 = rng.int(10, 40);
        const h0 = rng.pick([0, 0, 2, 5, 10, 20]);
        const a = rng.int(1, 4);
        const p: Poly = [h0, v0, -5];
        const answer = v0 - 10 * a;
        const sa = pAt(p, a);
        return numberProblem({
          prompt: t(
            `A ball is thrown upwards, and its height after $t$ seconds is $s(t) = ${pLatex(p, "t")}$ meters. Find its instantaneous velocity at $t = ${a}$.`,
            `把一个球向上抛出，$t$ 秒后它的高度为 $s(t) = ${pLatex(p, "t")}$ 米。求它在 $t = ${a}$ 时的瞬时速度。`,
          ),
          answer,
          unit: "m/s",
          mistakes: firsts([
            why(
              v0 - 5 * a,
              `This misses the $2$ in $(${a} + h)^{2} = ${square(a)}$, so the term $-5t^{2}$ gave $-5 \\cdot ${a}$ instead of $-10 \\cdot ${a}$.`,
              `这漏掉了 $(${a} + h)^{2} = ${square(a)}$ 中的 $2$，所以 $-5t^{2}$ 这一项给出的是 $-5 \\cdot ${a}$，而不是 $-10 \\cdot ${a}$。`,
            ),
            why(sa, `This is the height $s(${a})$ in meters, not the velocity.`, `这是高度 $s(${a})$，单位是米，不是速度。`),
            why(
              Math.round(sa / a),
              `This divides the height by the time. That is not the rate of change at $t = ${a}$.`,
              `这是用高度除以时间，不是 $t = ${a}$ 时的变化率。`,
            ),
            why(
              -answer,
              `This has the wrong sign: the velocity is $${v0} - 10 \\cdot ${a} = ${answer}$.`,
              `这符号错了：速度是 $${v0} - 10 \\cdot ${a} = ${answer}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Simplify the difference quotient", "化简差商"],
                t(`Expand $s(${a} + h)$ and subtract $s(${a}) = ${sa}$:`, `展开 $s(${a} + h)$，减去 $s(${a}) = ${sa}$：`),
                [
                  `\\frac{s(${a} + h) - s(${a})}{h} = \\frac{${poly([v0 - 10 * a, "h"], [-5, "h^{2}"])}}{h} = ${poly([-5, "h"], [answer, ""])}`,
                ],
              ],
              [
                ["Let $h \\to 0$", "令 $h \\to 0$"],
                t(
                  `The term $-5h$ goes to $0$, so the velocity is $${answer}$ m/s${answer < 0 ? ": the ball is moving down" : answer === 0 ? ": the ball is at the top" : ": the ball is still rising"}.`,
                  `$-5h$ 这一项趋于 $0$，所以速度是 $${answer}$ m/s${answer < 0 ? "：球在向下运动" : answer === 0 ? "：球在最高点" : "：球还在上升"}。`,
                ),
              ],
            ],
            quotients((x) => pAt(p, x), a, answer, "s", "t"),
          ),
        });
      },
    },
  ],
};

/** definingTheDerivativeUsingDerivativeNotation defines f'(x) as a limit. */
export const definingTheDerivativeUsingDerivativeNotation: TopicDef = {
  id: "defining-the-derivative-using-derivative-notation",
  title: t("Defining the Derivative Using Derivative Notation", "用导数记号定义导数"),
  summary: t(
    "Define the derivative f'(x) as the limit of the difference quotient and compute it from the definition.",
    "把导数 f'(x) 定义为差商的极限，并用定义计算导数。",
  ),
  intro: t(
    "For $f(x) = x^{2}$ the instantaneous rate of change is $6$ at $x = 3$ and $10$ at $x = 5$; at any $x$ it is $2x$. Collecting all these rates into one function gives the derivative, $f'(x) = 2x$.\n\nCheck: $\\frac{f(5.01) - f(5)}{0.01} = \\frac{25.1001 - 25}{0.01} = 10.01$, close to $2 \\cdot 5 = 10$.\n\nIn this lesson we define the derivative $f'(x)$ as the limit of the difference quotient, find it from the definition for quadratics and reciprocals, and write $f'(a)$ as a limit as $x$ approaches $a$.",
    "对 $f(x) = x^{2}$，瞬时变化率在 $x = 3$ 处是 $6$，在 $x = 5$ 处是 $10$，在任意 $x$ 处是 $2x$。把这些变化率合成一个函数，就是导数 $f'(x) = 2x$。\n\n检验：$\\frac{f(5.01) - f(5)}{0.01} = \\frac{25.1001 - 25}{0.01} = 10.01$，接近 $2 \\cdot 5 = 10$。\n\n本课我们把导数 $f'(x)$ 定义为差商的极限，用定义求二次函数和倒数型函数的导数，并把 $f'(a)$ 写成 $x$ 趋于 $a$ 时的极限。",
  ),
  prerequisites: ["the-instantaneous-rate-of-change-of-a-function-at-a-point"],
  encompasses: [{ topic: "the-instantaneous-rate-of-change-of-a-function-at-a-point", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-derivative-from-the-definition",
      title: t("The derivative from the definition", "由定义求导数"),
      explanation: t(
        "The **derivative** of $f$ is the function\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h},$$\n\nalso written $\\frac{dy}{dx}$ or $\\frac{d}{dx}f(x)$. Its value $f'(a)$ is the instantaneous rate of change at $a$. For $f(x) = 3x^{2}$, the quotient is $6x + 3h$, so $f'(x) = 6x$.\n\nCheck: $\\frac{f(1.01) - f(1)}{0.01} = \\frac{3.0603 - 3}{0.01} = 6.03$, close to $f'(1) = 6$.\n\n> **Watch out.** Divide by $h$ first and only then let $h \\to 0$, and do not stop before the limit: $6x + 3h$ is the difference quotient, not the derivative.",
        "$f$ 的**导数**是函数\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h},$$\n\n也记作 $\\frac{dy}{dx}$ 或 $\\frac{d}{dx}f(x)$。它的值 $f'(a)$ 就是 $a$ 处的瞬时变化率。对 $f(x) = 3x^{2}$，差商为 $6x + 3h$，所以 $f'(x) = 6x$。\n\n检验：$\\frac{f(1.01) - f(1)}{0.01} = \\frac{3.0603 - 3}{0.01} = 6.03$，接近 $f'(1) = 6$。\n\n> **注意。** 先除以 $h$，再令 $h \\to 0$；也不要停在取极限之前：$6x + 3h$ 是差商，不是导数。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const [, b, s] = p as [number, number, number];
        const answer = poly([2 * s, "x"], [b, ""]);
        const at1 = 2 * s + b;
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Use the definition of the derivative to find $f'(x)$.`,
            `设 $f(x) = ${pLatex(p)}$。用导数的定义求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          mistakes: once([
            say(
              poly([s, "x"], [b, ""]),
              "This misses the $2$ in $(x + h)^{2} = x^{2} + 2xh + h^{2}$.",
              "这漏掉了 $(x + h)^{2} = x^{2} + 2xh + h^{2}$ 中的 $2$。",
            ),
            say(
              poly([2 * s, "x"]),
              `This drops the linear term: $${poly([b, "x"])}$ changes at rate $${b}$.`,
              `这丢掉了一次项：$${poly([b, "x"])}$ 的变化率是 $${b}$。`,
            ),
            say(
              poly([2 * s, "x"], [s, "h"], [b, ""]),
              "This stops at the difference quotient. Let $h \\to 0$ to get the derivative.",
              "这停在了差商这一步。还要令 $h \\to 0$ 才得到导数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Expand and subtract", "展开并相减"],
                t("Expand $f(x + h)$; the terms of $f(x)$ cancel:", "展开 $f(x + h)$；$f(x)$ 的各项相互抵消："),
                [`f(x + h) - f(x) = ${poly([2 * s, "xh"], [s, "h^{2}"], [b, "h"])}`],
              ],
              [["Divide by $h$", "除以 $h$"], none, [quotientSteps(p, "x")]],
              [
                ["Let $h \\to 0$", "令 $h \\to 0$"],
                none,
                [`f'(x) = ${lim(0, undefined, "h")} \\left(${poly([2 * s, "x"], [s, "h"], [b, ""])}\\right) = ${answer}`],
              ],
            ],
            quotients(
              (x) => pAt(p, x),
              1,
              at1,
              "f",
              "x",
              t(`At $x = 1$ the answer gives $f'(1) = ${at1}$.`, `在 $x = 1$ 处，答案给出 $f'(1) = ${at1}$。`),
            ),
          ),
        });
      },
    },
    {
      id: "the-derivative-at-a-point-as-a-limit-as-x-approaches-a",
      title: t("The derivative at a point as a limit as x approaches a", "导数作为 x 趋于 a 的极限"),
      explanation: t(
        "Writing $x = a + h$ gives an equivalent form:\n\n$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$\n\nFor a polynomial, the numerator has the factor $x - a$; cancel it and substitute. For $f(x) = x^{2}$ at $a = 3$: $\\frac{x^{2} - 9}{x - 3} = x + 3 \\to 6$.\n\nCheck: at $x = 3.01$ the quotient is $\\frac{9.0601 - 9}{0.01} = 6.01$.\n\n> **Watch out.** Substituting $x = a$ straight away gives $\\frac{0}{0}$, not $0$. Cancel the factor $x - a$ first, then substitute.",
        "令 $x = a + h$，得到等价形式：\n\n$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$\n\n对多项式，分子含因式 $x - a$；约去它再代入。对 $f(x) = x^{2}$，$a = 3$：$\\frac{x^{2} - 9}{x - 3} = x + 3 \\to 6$。\n\n检验：$x = 3.01$ 时，商为 $\\frac{9.0601 - 9}{0.01} = 6.01$。\n\n> **注意。** 直接代入 $x = a$ 得到的是 $\\frac{0}{0}$，不是 $0$。要先约去因式 $x - a$，再代入。",
      ),
      generate(rng) {
        const s = rng.nonZero(-3, 3);
        const b = rng.int(-6, 6);
        const p: Poly = [rng.int(-6, 6), b, s];
        const a = rng.nonZero(-5, 5);
        const fa = pAt(p, a);
        const answer = 2 * s * a + b;
        // f(x) − f(a) = (x − a)(s(x + a) + b).
        const inner = poly([s, "x"], [s * a + b, ""]);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Evaluate $${lim(a)} \\frac{f(x) - f(${a})}{${bare(a)}}$.`,
            `设 $f(x) = ${pLatex(p)}$。求 $${lim(a)} \\frac{f(x) - f(${a})}{${bare(a)}}$。`,
          ),
          answer,
          mistakes: firsts([
            why(fa, `This is $f(${a})$, a value of $f$, not the limit of the quotient.`, `这是 $f$ 的函数值 $f(${a})$，不是商的极限。`),
            why(
              s * a + b,
              `This substitutes into $${poly([s, "x"], [b, ""])}$ and loses the $${poly([s * a, ""])}$ that the factorization adds: the other factor is $${inner}$.`,
              `这代入的是 $${poly([s, "x"], [b, ""])}$，漏掉了分解时多出的 $${s * a}$：另一个因式是 $${inner}$。`,
            ),
            why(
              0,
              `This puts $x = ${a}$ into the top only. The bottom is $0$ there too: cancel $${fac(a)}$ first.`,
              `这只把 $x = ${a}$ 代入了分子。分母在该处也是 $0$：要先约去 $${fac(a)}$。`,
            ),
            why(answer - b, `This drops the $${b}$ from the other factor $${inner}$.`, `这丢掉了另一个因式 $${inner}$ 中的 $${b}$。`),
          ]),
          solution: walked(
            [
              [["Find $f(a)$", "求 $f(a)$"], none, [`f(${a}) = ${fa}`]],
              [
                ["Factor the top", "分解分子"],
                t(
                  `$f(x) - f(${a})$ is $0$ at $x = ${a}$, so it has the factor $${fac(a)}$:`,
                  `$f(x) - f(${a})$ 在 $x = ${a}$ 处为 $0$，所以含因式 $${fac(a)}$：`,
                ),
                [`f(x) - f(${a}) = ${fac(a)}(${inner})`],
              ],
              [
                ["Cancel and substitute", "约分再代入"],
                none,
                [`${lim(a)} \\frac{f(x) - f(${a})}{${bare(a)}} = ${lim(a)} (${inner}) = ${answer}`],
              ],
            ],
            quotients(
              (x) => pAt(p, x),
              a,
              answer,
              "f",
              "x",
              t(
                `The limit is $f'(${a})$, the rate of change of $f$ at $x = ${a}$.`,
                `这个极限就是 $f'(${a})$，即 $f$ 在 $x = ${a}$ 处的变化率。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "the-derivative-of-a-reciprocal-from-the-definition",
      title: t("The derivative of a reciprocal from the definition", "由定义求倒数型函数的导数"),
      explanation: t(
        "For $f(x) = \\frac{k}{x + c}$, put the two fractions of the difference quotient over a common denominator; a factor $h$ then cancels:\n\n$$\\frac{1}{h}\\left(\\frac{k}{x + h + c} - \\frac{k}{x + c}\\right) = \\frac{-k}{(x + h + c)(x + c)} \\to -\\frac{k}{(x + c)^{2}}.$$\n\nFor $f(x) = \\frac{6}{x + 1}$ this gives $f'(x) = -\\frac{6}{(x + 1)^{2}}$, so $f'(1) = -\\frac{3}{2}$.\n\nCheck: $\\frac{f(1.01) - f(1)}{0.01} \\approx -1.4925$, close to $-1.5$.\n\n> **Watch out.** The top of the combined fraction is $k(x + c) - k(x + h + c) = -kh$, so the derivative has the opposite sign to $k$. And the square in the denominator comes from the two factors $(x + h + c)(x + c)$, which become equal only as $h \\to 0$.",
        "对 $f(x) = \\frac{k}{x + c}$，把差商中的两个分式通分，就能约去因子 $h$：\n\n$$\\frac{1}{h}\\left(\\frac{k}{x + h + c} - \\frac{k}{x + c}\\right) = \\frac{-k}{(x + h + c)(x + c)} \\to -\\frac{k}{(x + c)^{2}}.$$\n\n对 $f(x) = \\frac{6}{x + 1}$，得 $f'(x) = -\\frac{6}{(x + 1)^{2}}$，所以 $f'(1) = -\\frac{3}{2}$。\n\n检验：$\\frac{f(1.01) - f(1)}{0.01} \\approx -1.4925$，接近 $-1.5$。\n\n> **注意。** 通分后的分子是 $k(x + c) - k(x + h + c) = -kh$，所以导数的符号与 $k$ 相反。分母中的平方来自两个因式 $(x + h + c)(x + c)$，它们只有在 $h \\to 0$ 时才相等。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(-6, 6);
        const den = poly([1, "x"], [c, ""]);
        const sq = c === 0 ? "x^{2}" : `(${den})^{2}`;
        const answer = `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${sq}}`;
        const xh = poly([1, "x"], [1, "h"], [c, ""]);
        const top = `${k}${c === 0 ? "x" : `(${den})`} - ${par(k)}(${xh})`;
        const prod = `(${xh})${c === 0 ? "x" : `(${den})`}`;
        const x0 = 2 - c;
        const at = Q.of(-k, 4);
        return functionWith(
          {
            prompt: t(
              `Let $f(x) = \\frac{${k}}{${den}}$. Use the definition of the derivative to find $f'(x)$.`,
              `设 $f(x) = \\frac{${k}}{${den}}$。用导数的定义求 $f'(x)$。`,
            ),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Combine the fractions", "通分"],
                  t("Put the two fractions over one denominator:", "把两个分式化成同分母："),
                  [`\\frac{f(x + h) - f(x)}{h} = \\frac{1}{h} \\cdot \\frac{${top}}{${prod}}`],
                ],
                [
                  ["Cancel $h$", "约去 $h$"],
                  t(`The top simplifies to $${poly([-k, "h"])}$:`, `分子化简为 $${poly([-k, "h"])}$：`),
                  [`\\frac{f(x + h) - f(x)}{h} = \\frac{${-k}}{${prod}}`],
                ],
                [["Let $h \\to 0$", "令 $h \\to 0$"], none, [`f'(x) = ${answer}`]],
              ],
              quotients(
                (x) => k / (x + c),
                x0,
                at,
                "f",
                "x",
                t(
                  `At $x = ${x0}$, where $${den} = 2$, the answer gives $f'(${x0}) = ${at.toLatex()}$.`,
                  `在 $x = ${x0}$ 处 $${den} = 2$，答案给出 $f'(${x0}) = ${at.toLatex()}$。`,
                ),
              ),
            ),
          },
          [
            say(
              `${k > 0 ? "" : "-"}\\frac{${Math.abs(k)}}{${sq}}`,
              `This has the wrong sign: the top of the combined fraction is $${poly([-k, "h"])}$.`,
              `这符号错了：通分后的分子是 $${poly([-k, "h"])}$。`,
            ),
            say(`\\frac{${k}}{${den}}`, "This is $f(x)$ itself, not its derivative.", "这是 $f(x)$ 本身，不是它的导数。"),
            say(
              `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${den}}`,
              `This misses the square: the bottom is $${prod}$, which becomes $${sq}$ as $h \\to 0$.`,
              `这漏掉了平方：分母是 $${prod}$，当 $h \\to 0$ 时变成 $${sq}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** Smoothness is how a graph behaves at a point. */
type Smoothness = "smooth" | "corner" | "cusp" | "vertical" | "jump";

/** continuityAndDifferentiabilityOfFunctions relates differentiability and continuity. */
export const continuityAndDifferentiabilityOfFunctions: TopicDef = {
  id: "continuity-and-differentiability-of-functions",
  title: t("Continuity and Differentiability of Functions", "函数的连续性与可导性"),
  summary: t(
    "Recognize where a function is not differentiable, and relate differentiability to continuity.",
    "识别函数在何处不可导，并理解可导性与连续性的关系。",
  ),
  intro: t(
    "The graph of $|x|$ has no break at $0$, so $|x|$ is continuous there. But it has a corner: the slope is $-1$ just to the left and $1$ just to the right. No single tangent line fits, so $|x|$ has no derivative at $0$.\n\nCheck: $\\frac{|0.01| - |0|}{0.01} = 1$ but $\\frac{|-0.01| - |0|}{-0.01} = -1$; the difference quotients from the two sides do not close in on one number.\n\nIn this lesson we find where a function is not differentiable, from its graph and at the break point of a piecewise function, and see why a differentiable function must be continuous.",
    "$|x|$ 的图像在 $0$ 处没有断开，所以 $|x|$ 在该处连续。但图像在这里有一个角点：左侧斜率是 $-1$，右侧斜率是 $1$。没有一条切线能同时贴合两侧，所以 $|x|$ 在 $0$ 处没有导数。\n\n检验：$\\frac{|0.01| - |0|}{0.01} = 1$，而 $\\frac{|-0.01| - |0|}{-0.01} = -1$；两侧的差商并不逼近同一个数。\n\n本课我们根据图像和分段函数的分段点判断函数在何处不可导，并说明为什么可导函数一定连续。",
  ),
  prerequisites: ["defining-the-derivative-using-derivative-notation", "defining-continuity-at-a-point"],
  encompasses: [{ topic: "defining-continuity-at-a-point", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "differentiability-from-a-graph",
      figure: calculusDrawings2["continuity-and-differentiability-of-functions#differentiability-from-a-graph"],
      title: t("Differentiability from a graph", "由图像判断可导性"),
      explanation: t(
        "$f$ is **differentiable** at $a$ when $f'(a)$ exists: the graph has a single, non-vertical tangent line there. A graph is not differentiable at\n\n- a **corner**, where the slopes from the two sides differ;\n- a **cusp**, where the slopes tend to $\\infty$ and $-\\infty$;\n- a **vertical tangent**;\n- a **discontinuity**.\n\nA differentiable function is continuous, but a continuous function need not be differentiable. For example, $f(x) = |x - 2|$ is continuous at $x = 2$, but its graph has a corner there, so it is not differentiable at $2$.\n\nCheck: at $x = 2$ the difference quotient of $|x - 2|$ is $1$ for $h = 0.01$ and $-1$ for $h = -0.01$: two different slopes.\n\n> **Watch out.** A graph without a break can still fail to be differentiable. Look for a corner, a cusp or a vertical tangent as well as for a jump.",
        "若 $f'(a)$ 存在，即图像在该处有唯一一条非竖直的切线，就称 $f$ 在 $a$ 处**可导**。图像在以下位置不可导：\n\n- **角点**：两侧的斜率不同；\n- **尖点**：斜率分别趋于 $\\infty$ 和 $-\\infty$；\n- **竖直切线**处；\n- **间断点**处。\n\n可导函数一定连续，但连续函数不一定可导。例如 $f(x) = |x - 2|$ 在 $x = 2$ 处连续，但图像在该处有角点，所以在 $2$ 处不可导。\n\n检验：在 $x = 2$ 处，$|x - 2|$ 的差商在 $h = 0.01$ 时是 $1$，在 $h = -0.01$ 时是 $-1$：两个不同的斜率。\n\n> **注意。** 图像没有断开，也可能不可导。除了跳跃，还要看有没有角点、尖点或竖直切线。",
      ),
      generate(rng) {
        const kind = rng.pick<Smoothness>(["smooth", "smooth", "corner", "cusp", "vertical", "jump"]);
        const a = rng.int(-3, 3);
        const d = rng.int(-3, 3);
        const k = rng.pick([-2, -1.5, 1.5, 2]);
        const view = { xMin: -6, xMax: 6, yMin: -7, yMax: 7 };
        let e = d;
        let marks: PlaneMark[];
        if (kind === "smooth") {
          const m = rng.pick([-1, -0.5, 0, 0.5, 1]);
          const c = rng.pick([-0.3, -0.2, 0.2, 0.3]);
          marks = [
            { kind: "curve", f: (x) => d + m * (x - a) + c * (x - a) ** 2, accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "corner") {
          const m1 = rng.pick([-2, -1, -0.5, 0.5, 1, 2]);
          const m2 = rng.pick([-2, -1, -0.5, 0.5, 1, 2].filter((m) => m !== m1));
          marks = [
            { kind: "curve", f: (x) => d + m1 * (x - a), to: a, accent: true },
            { kind: "curve", f: (x) => d + m2 * (x - a), from: a, accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "cusp") {
          marks = [
            { kind: "curve", f: (x) => d + k * Math.cbrt((x - a) ** 2), accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "vertical") {
          marks = [
            { kind: "curve", f: (x) => d + k * Math.cbrt(x - a), accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else {
          e = d + rng.pick([-3, -2, 2, 3]);
          marks = [
            { kind: "curve", f: (x) => d + 0.5 * (x - a), to: a, accent: true },
            { kind: "curve", f: (x) => e + 0.5 * (x - a), from: a, accent: true },
            { kind: "point", at: [a, d], accent: true },
            { kind: "point", at: [a, e], open: true, accent: true },
          ];
        }
        const because: Record<Smoothness, Text> = {
          smooth: t(
            `The graph is smooth at $x = ${a}$, with a single non-vertical tangent line, so $f$ is differentiable there.`,
            `图像在 $x = ${a}$ 处光滑，有唯一一条非竖直的切线，所以 $f$ 在该处可导。`,
          ),
          corner: t(
            `The graph has a corner at $x = ${a}$: the slopes from the left and right differ, so $f'(${a})$ does not exist.`,
            `图像在 $x = ${a}$ 处有一个角点：左右两侧的斜率不同，所以 $f'(${a})$ 不存在。`,
          ),
          cusp: t(
            `The graph has a cusp at $x = ${a}$: the slopes become infinitely steep in opposite directions, so $f'(${a})$ does not exist.`,
            `图像在 $x = ${a}$ 处有一个尖点：两侧斜率朝相反方向无限变陡，所以 $f'(${a})$ 不存在。`,
          ),
          vertical: t(
            `The tangent line at $x = ${a}$ is vertical and has no slope, so $f'(${a})$ does not exist.`,
            `$x = ${a}$ 处的切线是竖直的，斜率没有定义，所以 $f'(${a})$ 不存在。`,
          ),
          jump: t(
            `$f$ is not continuous at $x = ${a}$, so it cannot be differentiable there.`,
            `$f$ 在 $x = ${a}$ 处不连续，所以在该处不可导。`,
          ),
        };
        const zoom: Record<Smoothness, Text> = {
          smooth: t(
            `Zoom in on $(${a}, ${d})$: the graph looks more and more like one straight, slanted or flat line, its tangent.`,
            `放大 $(${a}, ${d})$ 附近：图像越来越像一条直线（倾斜或水平），这就是它的切线。`,
          ),
          corner: t(
            `Zoom in on $(${a}, ${d})$: the two sides stay two straight lines with different slopes, however far we zoom.`,
            `放大 $(${a}, ${d})$ 附近：无论放大多少，两侧始终是斜率不同的两条直线。`,
          ),
          cusp: t(
            `Zoom in on $(${a}, ${d})$: both sides become steeper and steeper and meet in a sharp point.`,
            `放大 $(${a}, ${d})$ 附近：两侧越来越陡，在一个尖端相遇。`,
          ),
          vertical: t(
            `Zoom in on $(${a}, ${d})$: the graph looks more and more like a vertical line, which has no slope.`,
            `放大 $(${a}, ${d})$ 附近：图像越来越像一条竖直的直线，而竖直线没有斜率。`,
          ),
          jump: t(
            `The two pieces end at different heights, $${d}$ and $${e}$, so no single line can touch the graph there from both sides.`,
            `两段在不同的高度 $${d}$ 和 $${e}$ 处结束，所以没有一条直线能在该处从两侧贴合图像。`,
          ),
        };
        const figure: Figure = { svg: plane(view, marks), alt: graphAltOf(view, marks) };
        const reasons: Record<Smoothness, Text> = {
          smooth: t("Yes, because the graph has a single non-vertical tangent line there.", "是，因为图像在该处有唯一一条非竖直的切线。"),
          corner: t("No, because the graph has a corner there.", "否，因为图像在该处有一个角点。"),
          cusp: t("No, because the graph has a cusp there.", "否，因为图像在该处有一个尖点。"),
          vertical: t("No, because the tangent line there is vertical.", "否，因为该处的切线是竖直的。"),
          jump: t("No, because $f$ is not continuous there.", "否，因为 $f$ 在该处不连续。"),
        };
        const continuous = t("Yes, because $f$ is continuous there.", "是，因为 $f$ 在该处连续。");
        const faults = [reasons.corner, reasons.cusp, reasons.vertical, reasons.jump];
        const absent: Record<Smoothness, readonly [string, string]> = {
          smooth: [`The graph is not smooth at $x = ${a}$`, `图像在 $x = ${a}$ 处并不光滑`],
          corner: [`There is no corner at $x = ${a}$`, `$x = ${a}$ 处没有角点`],
          cusp: [`There is no cusp at $x = ${a}$`, `$x = ${a}$ 处没有尖点`],
          vertical: [`The tangent at $x = ${a}$ is not vertical`, `$x = ${a}$ 处的切线不是竖直的`],
          jump: [`The graph does not break at $x = ${a}$`, `图像在 $x = ${a}$ 处没有断开`],
        };
        const actual: Record<Smoothness, readonly [string, string]> = {
          smooth: ["the graph is smooth there, with a single non-vertical tangent line", "图像在该处光滑，有唯一一条非竖直的切线"],
          corner: ["the graph has a corner there", "图像在该处有一个角点"],
          cusp: ["the graph has a cusp there", "图像在该处有一个尖点"],
          vertical: ["the tangent line there is vertical", "该处的切线是竖直的"],
          jump: ["the graph jumps there", "图像在该处跳跃"],
        };
        const kinds: readonly Smoothness[] = ["smooth", "corner", "cusp", "vertical", "jump"];
        const others = kinds
          .filter((w) => w !== kind)
          .map((w) => [reasons[w].en, `${absent[w][0]}: ${actual[kind][0]}.`, `${absent[w][1]}：${actual[kind][1]}。`] as const);
        const continuity =
          kind === "jump"
            ? ([
                continuous.en,
                `$f$ is not continuous at $x = ${a}$: the graph breaks there.`,
                `$f$ 在 $x = ${a}$ 处不连续：图像在该处断开。`,
              ] as const)
            : kind === "smooth"
              ? ([
                  continuous.en,
                  "The answer yes is right, but continuity alone does not make a function differentiable. The reason is the single non-vertical tangent line.",
                  "回答“是”没错，但仅凭连续并不能保证可导。真正的理由是有唯一一条非竖直的切线。",
                ] as const)
              : ([continuous.en, `Continuity is not enough: ${actual[kind][0]}.`, `仅仅连续还不够：${actual[kind][1]}。`] as const);
        return {
          ...reasoned(
            reasonChoice(rng, {
              prompt: t(
                `The graph of $y = f(x)$ is shown. Is $f$ differentiable at $x = ${a}$?`,
                `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${a}$ 处可导吗？`,
              ),
              correct: reasons[kind],
              wrong: [reasons.smooth, continuous, ...rng.shuffle(faults)].filter((r) => r !== reasons[kind]).slice(0, 3),
              solution: walked(
                [
                  [
                    ["Check continuity", "看是否连续"],
                    kind === "jump"
                      ? t(
                          `The graph breaks at $x = ${a}$: the filled point is at height $${d}$, but the other piece starts at height $${e}$.`,
                          `图像在 $x = ${a}$ 处断开：实心点的高度是 $${d}$，另一段却从高度 $${e}$ 开始。`,
                        )
                      : t(
                          `The graph runs through $(${a}, ${d})$ without a break, so $f$ is continuous there.`,
                          `图像连续不断地经过 $(${a}, ${d})$，所以 $f$ 在该处连续。`,
                        ),
                  ],
                  [["Look for one tangent line", "看是否有唯一的切线"], because[kind]],
                ],
                zoom[kind],
              ),
            }),
            [...others, continuity],
          ),
          figure,
        };
      },
    },
    {
      id: "differentiability-of-piecewise-functions",
      title: t("Differentiability of piecewise functions", "分段函数的可导性"),
      explanation: t(
        "At the break point $a$ of a piecewise function made of polynomials:\n\n1. if the pieces do not meet at $a$, $f$ is not continuous, so not differentiable;\n2. if they meet, compare the slopes of the two pieces at $a$: $f$ is differentiable exactly when they are equal.\n\nFor $f(x) = x^{2}$ when $x < 1$ and $f(x) = 2x - 1$ when $x \\ge 1$: both pieces give $1$ at $x = 1$, and the slopes there are $2 \\cdot 1 = 2$ and $2$. So $f$ is differentiable at $1$.\n\nCheck: $\\frac{f(1.01) - f(1)}{0.01} = 2$ and $\\frac{f(0.99) - f(1)}{-0.01} = 1.99$, both close to $2$.\n\n> **Watch out.** Equal slopes are not enough on their own: check first that the pieces meet. A function that is not continuous is never differentiable, whatever the slopes.",
        "在由多项式构成的分段函数的分段点 $a$ 处：\n\n1. 若两段在 $a$ 处不相接，$f$ 不连续，因此不可导；\n2. 若相接，比较两段在 $a$ 处的斜率：当且仅当它们相等时 $f$ 可导。\n\n对 $x < 1$ 时 $f(x) = x^{2}$、$x \\ge 1$ 时 $f(x) = 2x - 1$：两段在 $x = 1$ 处都给出 $1$，该处的斜率分别是 $2 \\cdot 1 = 2$ 和 $2$。所以 $f$ 在 $1$ 处可导。\n\n检验：$\\frac{f(1.01) - f(1)}{0.01} = 2$，$\\frac{f(0.99) - f(1)}{-0.01} = 1.99$，都接近 $2$。\n\n> **注意。** 仅有斜率相等还不够：要先看两段是否相接。不连续的函数无论斜率如何都不可导。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = quadratic(rng);
        const kind = rng.int(0, 2);
        const slope = pAt(pDer(left), a);
        const m = kind === 0 ? slope : rng.pick(range(-6, 6).filter((x) => x !== slope));
        const meet = pAt(left, a) - m * a;
        const d = kind === 2 ? meet + rng.pick([-3, -2, -1, 1, 2, 3]) : meet;
        const right: Poly = [d, m];
        const f = `f(x) = \\begin{cases} ${pLatex(left)} & x < ${a} \\\\ ${pLatex(right)} & x \\ge ${a} \\end{cases}`;
        const options = [
          t("Continuous and differentiable", "连续且可导"),
          t("Continuous but not differentiable", "连续但不可导"),
          t("Neither continuous nor differentiable", "既不连续也不可导"),
          t("Differentiable but not continuous", "可导但不连续"),
        ];
        const L = pAt(left, a);
        const R = pAt(right, a);
        const fromRight = (pAt(right, a + 0.01) - R) / 0.01;
        const fromLeft = (pAt(left, a - 0.01) - R) / -0.01;
        const quotientLines = `$$\\frac{f(${fmt(a + 0.01)}) - f(${a})}{0.01} \\approx ${fmt(fromRight)}$$\n\n$$\\frac{f(${fmt(a - 0.01)}) - f(${a})}{-0.01} \\approx ${fmt(fromLeft)}$$`;
        const solution =
          kind === 2
            ? walked(
                [
                  [
                    ["Compare the values", "比较函数值"],
                    t(
                      `At $x = ${a}$ the left piece gives $${L}$, but the right piece gives $${R}$.`,
                      `在 $x = ${a}$ 处，左段给出 $${L}$，右段却给出 $${R}$。`,
                    ),
                  ],
                  [
                    ["Conclude", "得出结论"],
                    t(
                      "The pieces do not meet, so $f$ is not continuous there, and a function that is not continuous cannot be differentiable.",
                      "两段不相接，所以 $f$ 在该处不连续，而不连续的函数不可能可导。",
                    ),
                  ],
                ],
                t(
                  `The difference quotients on the two sides are\n\n${quotientLines}\n\nThe one from the left is huge because the pieces are $${Math.abs(L - R)}$ apart: there is no slope for it to settle on.`,
                  `两侧的差商是\n\n${quotientLines}\n\n左侧的差商很大，因为两段相差 $${Math.abs(L - R)}$：它没有可以趋近的斜率。`,
                ),
              )
            : walked(
                [
                  [
                    ["Compare the values", "比较函数值"],
                    t(
                      `Both pieces give $${L}$ at $x = ${a}$, so $f$ is continuous there.`,
                      `两段在 $x = ${a}$ 处都给出 $${L}$，所以 $f$ 在该处连续。`,
                    ),
                  ],
                  [
                    ["Compare the slopes", "比较斜率"],
                    t(
                      `The left piece has derivative $${pLatex(pDer(left))}$, which is $${slope}$ at $x = ${a}$; the right piece is a line of slope $${m}$.`,
                      `左段的导数是 $${pLatex(pDer(left))}$，在 $x = ${a}$ 处等于 $${slope}$；右段是斜率为 $${m}$ 的直线。`,
                    ),
                  ],
                  [
                    ["Conclude", "得出结论"],
                    kind === 0
                      ? t("The slopes are equal, so $f$ is differentiable there.", "两个斜率相等，所以 $f$ 在该处可导。")
                      : t(
                          "The slopes differ, so the graph has a corner and $f$ is not differentiable there.",
                          "两个斜率不等，所以图像有角点，$f$ 在该处不可导。",
                        ),
                  ],
                ],
                t(
                  `The difference quotients on the two sides are\n\n${quotientLines}\n\n${kind === 0 ? `Both are close to $${slope}$: one slope from both sides.` : `They are close to two different slopes, $${m}$ and $${slope}$.`}`,
                  `两侧的差商是\n\n${quotientLines}\n\n${kind === 0 ? `两者都接近 $${slope}$：两侧是同一个斜率。` : `它们分别接近两个不同的斜率 $${m}$ 和 $${slope}$。`}`,
                ),
              );
        return reasoned(
          oneOf(
            rng,
            t(`Let $$${f}$$ Which describes $f$ at $x = ${a}$?`, `设 $$${f}$$ 下列哪一项描述了 $f$ 在 $x = ${a}$ 处的情况？`),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            solution,
          ),
          [
            [
              options[0]!.en,
              kind === 1
                ? `The two slopes at $x = ${a}$ are $${slope}$ and $${m}$, which differ, so there is a corner.`
                : `The two pieces give different values at $x = ${a}$, so there is a break.`,
              kind === 1
                ? `在 $x = ${a}$ 处两个斜率是 $${slope}$ 和 $${m}$，并不相同，所以有尖角。`
                : `在 $x = ${a}$ 处两段的值不同，所以有断开。`,
            ],
            [
              options[1]!.en,
              kind === 0
                ? `The two slopes at $x = ${a}$ are both $${slope}$, so there is no corner.`
                : `The two pieces give different values at $x = ${a}$, so the function is not continuous.`,
              kind === 0 ? `在 $x = ${a}$ 处两个斜率都是 $${slope}$，所以没有尖角。` : `在 $x = ${a}$ 处两段的值不同，所以函数不连续。`,
            ],
            [
              options[2]!.en,
              `Both pieces give $${L}$ at $x = ${a}$, so the function is continuous.`,
              `在 $x = ${a}$ 处两段都给出 $${L}$，所以函数连续。`,
            ],
            [
              options[3]!.en,
              "A function that is differentiable at a point is always continuous there, so this cannot happen.",
              "函数在一点可导，就一定在该点连续，所以这种情况不会发生。",
            ],
          ],
        );
      },
    },
  ],
};

/** powerTerm writes kx^e for a rational exponent e: "3x^{2}", "-\\frac{1}{2}x^{-\\frac{3}{2}}", "5". */
const powerTerm = (k: Q, e: Q) => (e.isZero() ? k.toLatex() : poly([k, e.eq(Q.one) ? "x" : `x^{${e.toLatex()}}`]));

/** RootForm is a power of x written with a root or a fraction, and its exponent. */
interface RootForm {
  readonly latex: (k: number) => string;
  readonly e: Q;
  readonly rewrite: string;
}

/** rootForms are powers written with roots and fractions. */
const rootForms: readonly RootForm[] = [
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt{x}`, e: Q.of(1, 2), rewrite: "x^{\\frac{1}{2}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[3]{x}`, e: Q.of(1, 3), rewrite: "x^{\\frac{1}{3}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[3]{x^{2}}`, e: Q.of(2, 3), rewrite: "x^{\\frac{2}{3}}" },
  { latex: (k) => `${k === 1 ? "" : k}x\\sqrt{x}`, e: Q.of(3, 2), rewrite: "x^{\\frac{3}{2}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[4]{x^{3}}`, e: Q.of(3, 4), rewrite: "x^{\\frac{3}{4}}" },
  { latex: (k) => `\\frac{${k}}{x}`, e: Q.of(-1), rewrite: "x^{-1}" },
  { latex: (k) => `\\frac{${k}}{x^{2}}`, e: Q.of(-2), rewrite: "x^{-2}" },
  { latex: (k) => `\\frac{${k}}{x^{3}}`, e: Q.of(-3), rewrite: "x^{-3}" },
  { latex: (k) => `\\frac{${k}}{x^{5}}`, e: Q.of(-5), rewrite: "x^{-5}" },
  { latex: (k) => `\\frac{${k}}{\\sqrt{x}}`, e: Q.of(-1, 2), rewrite: "x^{-\\frac{1}{2}}" },
  { latex: (k) => `\\frac{${k}}{\\sqrt[3]{x}}`, e: Q.of(-1, 3), rewrite: "x^{-\\frac{1}{3}}" },
  { latex: (k) => `\\frac{${k}}{x\\sqrt{x}}`, e: Q.of(-3, 2), rewrite: "x^{-\\frac{3}{2}}" },
];

/** thePowerRuleForDifferentiation differentiates powers of x. */
export const thePowerRuleForDifferentiation: TopicDef = {
  id: "the-power-rule-for-differentiation",
  title: t("The Power Rule for Differentiation", "求导的幂法则"),
  summary: t(
    "Differentiate powers of x, including negative and fractional powers, with the power rule.",
    "用幂法则对 x 的幂求导，包括负指数幂和分数指数幂。",
  ),
  intro: t(
    "From the definition, $x^{2}$ has derivative $2x$ and $x^{3}$ has derivative $3x^{2}$: the exponent comes down in front and drops by one. This pattern, $\\frac{d}{dx} x^{n} = nx^{n - 1}$, is the power rule, and it saves working through the limit every time.\n\nCheck: for $x^{3}$ at $x = 2$, $\\frac{2.01^{3} - 8}{0.01} \\approx 12.06$, close to $3 \\cdot 2^{2} = 12$.\n\nIn this lesson we use the power rule for positive whole-number powers, then for negative and fractional powers written as fractions and roots.",
    "由定义可知，$x^{2}$ 的导数是 $2x$，$x^{3}$ 的导数是 $3x^{2}$：指数拿到前面，再减一。这个规律 $\\frac{d}{dx} x^{n} = nx^{n - 1}$ 就是幂法则，有了它就不必每次都去求极限。\n\n检验：对 $x^{3}$ 在 $x = 2$ 处，$\\frac{2.01^{3} - 8}{0.01} \\approx 12.06$，接近 $3 \\cdot 2^{2} = 12$。\n\n本课我们先对正整数次幂使用幂法则，再对写成分式和根式的负指数幂与分数指数幂使用它。",
  ),
  prerequisites: ["defining-the-derivative-using-derivative-notation", "writing-radicals-using-fractional-exponents"],
  encompasses: [{ topic: "writing-radicals-using-fractional-exponents", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-power-rule-for-positive-integer-powers",
      title: t("The power rule for positive integer powers", "正整数次幂的幂法则"),
      explanation: t(
        "**Power rule.** $\\frac{d}{dx} x^{n} = nx^{n - 1}$: bring the exponent down as a factor and lower it by one. A constant factor stays: $\\frac{d}{dx} 4x^{5} = 20x^{4}$. The derivative of a constant is $0$.\n\nCheck: at $x = 1$, $\\frac{4 \\cdot 1.01^{5} - 4}{0.01} \\approx 20.40$, close to $20 \\cdot 1^{4} = 20$.\n\n> **Watch out.** Do both moves: bring the exponent down and lower it by one. $\\frac{d}{dx} x^{5} = 5x^{4}$, not $5x^{5}$ and not $x^{4}$.",
        "**幂法则** $\\frac{d}{dx} x^{n} = nx^{n - 1}$：把指数拿下来作为因数，再把指数减一。常数因子保留：$\\frac{d}{dx} 4x^{5} = 20x^{4}$。常数的导数为 $0$。\n\n检验：在 $x = 1$ 处，$\\frac{4 \\cdot 1.01^{5} - 4}{0.01} \\approx 20.40$，接近 $20 \\cdot 1^{4} = 20$。\n\n> **注意。** 两步都要做：把指数拿下来，再把指数减一。$\\frac{d}{dx} x^{5} = 5x^{4}$，不是 $5x^{5}$，也不是 $x^{4}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = rng.pick([1, 1, -1, 2, 3, 4, 5, -2, -3, 6, 7]);
        const f = poly([k, power(n)]);
        const answer = poly([k * n, power(n - 1)]);
        return functionWith(
          {
            prompt: t(`Find $\\frac{d}{dx}\\left(${f}\\right)$.`, `求 $\\frac{d}{dx}\\left(${f}\\right)$。`),
            answer,
            solution: walked(
              [
                [
                  ["Bring the exponent down", "把指数拿下来"],
                  t(`Multiply by the exponent $${n}$ and lower it by one:`, `乘以指数 $${n}$，再把指数减一：`),
                  [`\\frac{d}{dx}\\left(${f}\\right) = ${k === 1 ? "" : `${par(k)} \\cdot `}${n}x^{${n} - 1}`],
                ],
                [["Simplify", "化简"], none, [`\\frac{d}{dx}\\left(${f}\\right) = ${answer}`]],
              ],
              quotients(
                (x) => k * x ** n,
                1,
                k * n,
                "f",
                "x",
                t(
                  `Call the function $f(x)$. At $x = 1$ the answer gives $${k * n}$.`,
                  `把这个函数记作 $f(x)$。在 $x = 1$ 处，答案给出 $${k * n}$。`,
                ),
              ),
            ),
          },
          [
            say(
              poly([k * n, power(n)]),
              `This keeps the exponent $${n}$; it must drop to $${n - 1}$.`,
              `这保留了指数 $${n}$；它要减为 $${n - 1}$。`,
            ),
            say(
              poly([k, power(n - 1)]),
              `This lowers the exponent but leaves out the factor $${n}$.`,
              `这把指数减了一，但漏掉了因数 $${n}$。`,
            ),
            say(
              poly([k * (n - 1), power(n - 1)]),
              `This multiplies by the new exponent $${n - 1}$. The factor is the old exponent, $${n}$.`,
              `这乘的是新的指数 $${n - 1}$。因数应是原来的指数 $${n}$。`,
            ),
            say(
              poly([k * n, power(n + 1)]),
              "This raises the exponent. Differentiating lowers it by one.",
              "这把指数升高了。求导要把指数减一。",
            ),
          ],
        );
      },
    },
    {
      id: "the-power-rule-for-negative-and-fractional-powers",
      title: t("The power rule for negative and fractional powers", "负指数与分数指数的幂法则"),
      explanation: t(
        "The power rule holds for every real exponent. Rewrite roots and fractions as powers first:\n\n$$\\frac{d}{dx} \\frac{6}{x^{2}} = \\frac{d}{dx} 6x^{-2} = -12x^{-3}, \\qquad \\frac{d}{dx} \\sqrt{x} = \\frac{d}{dx} x^{\\frac{1}{2}} = \\frac{1}{2}x^{-\\frac{1}{2}}.$$\n\nCheck: for $\\sqrt{x}$ at $x = 4$, $\\frac{\\sqrt{4.01} - 2}{0.01} \\approx 0.2498$, close to $\\frac{1}{2} \\cdot 4^{-\\frac{1}{2}} = \\frac{1}{4}$.\n\n> **Watch out.** Lowering a negative exponent by one makes it more negative: $-2 - 1 = -3$, not $-1$. And $\\frac{1}{2} - 1 = -\\frac{1}{2}$.",
        "幂法则对任意实数指数都成立。先把根式和分式改写成幂：\n\n$$\\frac{d}{dx} \\frac{6}{x^{2}} = \\frac{d}{dx} 6x^{-2} = -12x^{-3}, \\qquad \\frac{d}{dx} \\sqrt{x} = \\frac{d}{dx} x^{\\frac{1}{2}} = \\frac{1}{2}x^{-\\frac{1}{2}}.$$\n\n检验：对 $\\sqrt{x}$ 在 $x = 4$ 处，$\\frac{\\sqrt{4.01} - 2}{0.01} \\approx 0.2498$，接近 $\\frac{1}{2} \\cdot 4^{-\\frac{1}{2}} = \\frac{1}{4}$。\n\n> **注意。** 负指数减一后更负：$-2 - 1 = -3$，不是 $-1$。而 $\\frac{1}{2} - 1 = -\\frac{1}{2}$。",
      ),
      generate(rng) {
        const form = rng.pick(rootForms);
        const k = rng.pick([1, 2, 3, 4, 6, 8, 9, 10, 12, -2, -3, -4]);
        const f = form.latex(k);
        const e1 = form.e.sub(Q.one);
        const coef = Q.of(k).mul(form.e);
        const answer = powerTerm(coef, e1);
        const e = form.e.toNumber();
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            positive: true,
            solution: walked(
              [
                [["Rewrite as a power", "改写成幂"], none, [`f(x) = ${f} = ${powerTerm(Q.of(k), form.e)}`]],
                [
                  ["Apply the power rule", "用幂法则"],
                  t(`Multiply by $${form.e.toLatex()}$ and lower the exponent by one:`, `乘以 $${form.e.toLatex()}$，再把指数减一：`),
                  [`f'(x) = ${par(k)} \\cdot ${par(form.e)}x^{${form.e.toLatex()} - 1} = ${answer}`],
                ],
              ],
              quotients(
                (x) => k * x ** e,
                1,
                coef,
                "f",
                "x",
                t(
                  `At $x = 1$ every power of $x$ is $1$, so the answer gives $f'(1) = ${coef.toLatex()}$.`,
                  `在 $x = 1$ 处 $x$ 的任何次幂都是 $1$，所以答案给出 $f'(1) = ${coef.toLatex()}$。`,
                ),
              ),
            ),
          },
          [
            say(
              powerTerm(coef, form.e.add(Q.one)),
              `This raises the exponent to $${form.e.add(Q.one).toLatex()}$. Differentiating lowers it by one.`,
              `这把指数升到了 $${form.e.add(Q.one).toLatex()}$。求导要把指数减一。`,
            ),
            say(
              powerTerm(Q.of(k), e1),
              `This lowers the exponent but leaves out the factor $${form.e.toLatex()}$.`,
              `这把指数减了一，但漏掉了因数 $${form.e.toLatex()}$。`,
            ),
            say(
              powerTerm(coef.neg(), e1),
              `This has the wrong sign: the factor is $${par(k)} \\cdot ${par(form.e)} = ${coef.toLatex()}$.`,
              `这符号错了：因数是 $${par(k)} \\cdot ${par(form.e)} = ${coef.toLatex()}$。`,
            ),
            say(
              powerTerm(coef, form.e),
              `This keeps the exponent $${form.e.toLatex()}$; it must drop to $${e1.toLatex()}$.`,
              `这保留了指数 $${form.e.toLatex()}$；它要减为 $${e1.toLatex()}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** Term is one term kx^e of a sum. */
interface Term {
  readonly k: Q;
  readonly e: Q;
  readonly latex: string;
}

/** mixedTerm is a power written with a root or a fraction. */
function mixedTerm(rng: Rng): Term {
  const form = rng.pick(rootForms);
  const k = rng.pick([1, 2, 3, 4, 6, 8, -2, -4]);
  return { k: Q.of(k), e: form.e, latex: form.latex(k) };
}

/** theSumAndConstantMultipleRulesForDifferentiation differentiates sums. */
export const theSumAndConstantMultipleRulesForDifferentiation: TopicDef = {
  id: "the-sum-and-constant-multiple-rules-for-differentiation",
  title: t("The Sum and Constant Multiple Rules for Differentiation", "求导的和法则与常数倍法则"),
  summary: t(
    "Differentiate polynomials and other sums of powers term by term, and evaluate derivatives at points.",
    "对多项式及其他幂函数之和逐项求导，并计算导数在某点处的值。",
  ),
  intro: t(
    "To differentiate $x^{3} + 5x$, differentiate each term and add: $3x^{2} + 5$. A constant factor stays in front, and a constant term disappears, since a constant does not change.\n\nCheck: at $x = 1$, $\\frac{(1.01^{3} + 5.05) - 6}{0.01} \\approx 8.03$, close to $3 + 5 = 8$.\n\nIn this lesson we differentiate polynomials and other sums of powers term by term, and evaluate a derivative at a point.",
    "要对 $x^{3} + 5x$ 求导，就对每一项求导再相加：$3x^{2} + 5$。常数因子留在前面，常数项消失，因为常数不变化。\n\n检验：在 $x = 1$ 处，$\\frac{(1.01^{3} + 5.05) - 6}{0.01} \\approx 8.03$，接近 $3 + 5 = 8$。\n\n本课我们对多项式及其他幂函数之和逐项求导，并求导数在某点处的值。",
  ),
  prerequisites: ["the-power-rule-for-differentiation"],
  encompasses: [{ topic: "the-power-rule-for-differentiation", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "differentiating-polynomials",
      title: t("Differentiating polynomials", "多项式求导"),
      explanation: t(
        "The derivative of a sum is the sum of the derivatives and constants factor out, so a polynomial is differentiated one term at a time with the power rule. **Sum rule.** $(f + g)' = f' + g'$. **Constant multiple rule.** $(cf)' = cf'$. So a polynomial is differentiated term by term:\n\n$$\\frac{d}{dx}\\left(2x^{3} - 5x^{2} + 7x - 4\\right) = 6x^{2} - 10x + 7.$$\n\nCheck: at $x = 1$ the polynomial is $0$, and $\\frac{f(1.01) - f(1)}{0.01} \\approx 3.01$, close to $6 - 10 + 7 = 3$.\n\n> **Watch out.** The constant term goes to $0$, and the term in $x$ becomes its coefficient: $\\frac{d}{dx} 7x = 7$, not $7x$ and not $0$.",
        "和的导数等于导数的和，常数可以提出，所以多项式可以用幂法则逐项求导。**和法则** $(f + g)' = f' + g'$。**常数倍法则** $(cf)' = cf'$。所以多项式可以逐项求导：\n\n$$\\frac{d}{dx}\\left(2x^{3} - 5x^{2} + 7x - 4\\right) = 6x^{2} - 10x + 7.$$\n\n检验：在 $x = 1$ 处这个多项式等于 $0$，$\\frac{f(1.01) - f(1)}{0.01} \\approx 3.01$，接近 $6 - 10 + 7 = 3$。\n\n> **注意。** 常数项的导数是 $0$，一次项的导数是它的系数：$\\frac{d}{dx} 7x = 7$，不是 $7x$，也不是 $0$。",
      ),
      generate(rng) {
        const deg = rng.int(3, 5);
        const p: number[] = range(0, deg).map((i) => (i === deg ? rng.nonZero(-5, 5) : rng.int(-9, 9)));
        const d = pDer(p);
        const answer = pLatex(d);
        const at1 = pAt(d, 1);
        const each = p
          .map((c, i) =>
            c === 0 ? "" : `\\frac{d}{dx}\\left(${poly([c, power(i)])}\\right) = ${i === 0 ? 0 : poly([c * i, power(i - 1)])}`,
          )
          .filter((l) => l !== "")
          .reverse();
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${pLatex(p)}$.`, `设 $f(x) = ${pLatex(p)}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Differentiate each term", "逐项求导"],
                  t("Use the power rule on each term; a constant has derivative $0$:", "对每一项用幂法则；常数的导数为 $0$："),
                  each,
                ],
                [["Add the results", "把结果相加"], none, [`f'(x) = ${answer}`]],
              ],
              quotients(
                (x) => pAt(p, x),
                1,
                at1,
                "f",
                "x",
                t(`At $x = 1$ the answer gives $f'(1) = ${at1}$.`, `在 $x = 1$ 处，答案给出 $f'(1) = ${at1}$。`),
              ),
            ),
          },
          [
            say(
              pLatex([d[0]! + p[0]!, ...d.slice(1)]),
              `This keeps the constant $${p[0]}$. A constant does not change, so its derivative is $0$.`,
              `这保留了常数 $${p[0]}$。常数不变化，它的导数是 $0$。`,
            ),
            say(
              pLatex(p.slice(1)),
              "This lowers each exponent but leaves out the factors that the exponents bring down.",
              "这把每个指数都减了一，但漏掉了指数拿下来作的因数。",
            ),
            say(
              pLatex(p.map((c, i) => c * i)),
              "This brings each exponent down but does not lower it by one.",
              "这把每个指数都拿下来了，但没有把指数减一。",
            ),
          ],
        );
      },
    },
    {
      id: "differentiating-sums-of-powers",
      title: t("Differentiating sums of powers", "幂函数之和的求导"),
      explanation: t(
        "When a sum mixes roots, fractions and powers, rewrite every term as $kx^{n}$ and then differentiate term by term:\n\n$$\\frac{d}{dx}\\left(x^{2} + 4\\sqrt{x} - \\frac{3}{x}\\right) = \\frac{d}{dx}\\left(x^{2} + 4x^{\\frac{1}{2}} - 3x^{-1}\\right) = 2x + 2x^{-\\frac{1}{2}} + 3x^{-2}.$$\n\nCheck: at $x = 1$ the derivative is $2 + 2 + 3 = 7$, and $\\frac{f(1.01) - f(1)}{0.01} \\approx 6.975$.\n\n> **Watch out.** Rewrite before differentiating. $\\frac{3}{x}$ is $3x^{-1}$, whose derivative $-3x^{-2}$ has the opposite sign; it is not $\\frac{3}{1}$, the derivative of the bottom.",
        "当和式中混有根式、分式和幂时，把每一项改写成 $kx^{n}$，再逐项求导：\n\n$$\\frac{d}{dx}\\left(x^{2} + 4\\sqrt{x} - \\frac{3}{x}\\right) = \\frac{d}{dx}\\left(x^{2} + 4x^{\\frac{1}{2}} - 3x^{-1}\\right) = 2x + 2x^{-\\frac{1}{2}} + 3x^{-2}.$$\n\n检验：在 $x = 1$ 处导数是 $2 + 2 + 3 = 7$，而 $\\frac{f(1.01) - f(1)}{0.01} \\approx 6.975$。\n\n> **注意。** 先改写再求导。$\\frac{3}{x}$ 是 $3x^{-1}$，它的导数 $-3x^{-2}$ 符号相反；不是对分母求导得到的 $\\frac{3}{1}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 5);
        const kn = rng.nonZero(-4, 4);
        const first: Term = { k: Q.of(kn), e: Q.of(n), latex: poly([kn, power(n)]) };
        let second = mixedTerm(rng);
        while (second.e.eq(first.e)) second = mixedTerm(rng);
        const c = rng.int(-9, 9);
        const terms = [first, second];
        const constant = c === 0 ? [] : [String(c)];
        const f = sumLatex([first.latex, second.latex, ...constant]);
        const parts = terms.map((x) => [x.k.mul(x.e), x.e.sub(Q.one)] as const);
        const answer = sumLatex(parts.map(([k, e]) => powerTerm(k, e)));
        const at1 = parts.reduce((s, [k]) => s.add(k), Q.zero);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            positive: true,
            solution: walked(
              [
                [
                  ["Rewrite each term as a power", "把每一项改写成幂"],
                  none,
                  [`f(x) = ${sumLatex([...terms.map((x) => powerTerm(x.k, x.e)), ...constant])}`],
                ],
                [
                  ["Differentiate term by term", "逐项求导"],
                  t(
                    `Use the power rule on each power${c === 0 ? "" : "; the constant has derivative $0$"}:`,
                    `对每个幂用幂法则${c === 0 ? "" : "；常数的导数为 $0$"}：`,
                  ),
                  [`f'(x) = ${answer}`],
                ],
              ],
              quotients(
                (x) => terms.reduce((s, term) => s + term.k.toNumber() * x ** term.e.toNumber(), c),
                1,
                at1,
                "f",
                "x",
                t(
                  `At $x = 1$ every power of $x$ is $1$, so the answer gives $f'(1) = ${at1.toLatex()}$.`,
                  `在 $x = 1$ 处 $x$ 的任何次幂都是 $1$，所以答案给出 $f'(1) = ${at1.toLatex()}$。`,
                ),
              ),
            ),
          },
          [
            say(
              sumLatex(terms.map((x) => powerTerm(x.k.mul(x.e), x.e.add(Q.one)))),
              "This raises the exponents. Differentiating lowers each one by one.",
              "这把指数升高了。求导要把每个指数减一。",
            ),
            say(
              sumLatex([...parts.map(([k, e]) => powerTerm(k, e)), ...constant]).replace(/^$/, "0"),
              `This keeps the constant $${c}$. Its derivative is $0$.`,
              `这保留了常数 $${c}$。它的导数是 $0$。`,
            ),
            say(
              sumLatex(terms.map((x) => powerTerm(x.k, x.e.sub(Q.one)))),
              "This lowers each exponent but leaves out the factors that the exponents bring down.",
              "这把每个指数都减了一，但漏掉了指数拿下来作的因数。",
            ),
          ],
        );
      },
    },
    {
      id: "evaluating-a-derivative-at-a-point",
      title: t("Evaluating a derivative at a point", "求导数在某点处的值"),
      explanation: t(
        "To find $f'(a)$, first find the function $f'(x)$, then substitute $x = a$. For $f(x) = x^{3} - 4x$, $f'(x) = 3x^{2} - 4$, so $f'(2) = 12 - 4 = 8$.\n\nCheck: $\\frac{f(2.01) - f(2)}{0.01} \\approx 8.06$, close to $8$.\n\n> **Watch out.** Do not substitute into $f$ first. $f(a)$ is a constant, whose derivative is $0$, and $f(a)$ itself is a value, not a rate.",
        "求 $f'(a)$ 时，先求出导函数 $f'(x)$，再代入 $x = a$。对 $f(x) = x^{3} - 4x$，$f'(x) = 3x^{2} - 4$，所以 $f'(2) = 12 - 4 = 8$。\n\n检验：$\\frac{f(2.01) - f(2)}{0.01} \\approx 8.06$，接近 $8$。\n\n> **注意。** 不要先代入 $f$。$f(a)$ 是常数，它的导数为 $0$；$f(a)$ 本身是函数值，不是变化率。",
      ),
      generate(rng) {
        const p = cubic(rng);
        const a = rng.nonZero(-3, 3);
        const d = pDer(p);
        const answer = pAt(d, a);
        return numberProblem({
          prompt: t(`Let $f(x) = ${pLatex(p)}$. Find $f'(${a})$.`, `设 $f(x) = ${pLatex(p)}$。求 $f'(${a})$。`),
          answer,
          mistakes: firsts([
            why(pAt(p, a), `This is $f(${a})$, the value of $f$, not of $f'$.`, `这是 $f(${a})$，是 $f$ 的值，不是 $f'$ 的值。`),
            why(
              0,
              `This differentiates the number $f(${a})$. Find $f'(x)$ first, then substitute.`,
              `这是对数 $f(${a})$ 求导。要先求 $f'(x)$，再代入。`,
            ),
            why(pAt(d, -a), `This substitutes $x = ${-a}$. Mind the sign of $${a}$.`, `这代入的是 $x = ${-a}$。注意 $${a}$ 的符号。`),
            why(
              answer - d[0]!,
              `This drops the constant $${d[0]}$ of $f'(x)$, which comes from the term $${poly([p[1]!, "x"])}$ of $f$.`,
              `这丢掉了 $f'(x)$ 的常数项 $${d[0]}$，它来自 $f$ 中的 $${poly([p[1]!, "x"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("Use the power rule on each term:", "对每一项用幂法则："), [`f'(x) = ${pLatex(d)}`]],
              [["Substitute", "代入"], none, [`f'(${a}) = ${pSub(d, a)} = ${answer}`]],
            ],
            quotients((x) => pAt(p, x), a, answer),
          ),
        });
      },
    },
  ],
};

/** calculatingTheSlopeOfATangentLineUsingDifferentiation reads tangent slopes from derivatives. */
export const calculatingTheSlopeOfATangentLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-slope-of-a-tangent-line-using-differentiation",
  title: t("Calculating the Slope of a Tangent Line Using Differentiation", "用求导计算切线的斜率"),
  summary: t(
    "Find the slope of the tangent line at a point, and the points where the tangent has a given slope.",
    "求某点处切线的斜率，以及切线斜率为给定值的点。",
  ),
  intro: t(
    "The steepness of the curve $y = x^{2}$ at the point $(3, 9)$ is the slope of its tangent line there, and the derivative gives it at once: $y' = 2x$, so the slope is $6$.\n\nCheck: the chord from $(3, 9)$ to $(3.01, 9.0601)$ has slope $6.01$, and the chord from $(2.99, 8.9401)$ to $(3, 9)$ has slope $5.99$.\n\nIn this lesson we find the slope of a tangent line from the derivative, and the points where the tangent line has a given slope.",
    "曲线 $y = x^{2}$ 在点 $(3, 9)$ 处的陡峭程度就是该处切线的斜率，导数可以直接给出它：$y' = 2x$，所以斜率是 $6$。\n\n检验：从 $(3, 9)$ 到 $(3.01, 9.0601)$ 的割线斜率是 $6.01$，从 $(2.99, 8.9401)$ 到 $(3, 9)$ 的割线斜率是 $5.99$。\n\n本课我们由导数求切线的斜率，并求切线斜率为给定值的点。",
  ),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation"],
  encompasses: [{ topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-of-a-tangent-line-at-a-point",
      title: t("The slope of a tangent line at a point", "某点处切线的斜率"),
      explanation: t(
        "The **tangent line** to $y = f(x)$ at $x = a$ is the line through $(a, f(a))$ that the curve hugs there. Its slope is $f'(a)$. For $y = x^{3} - 2x$ at $x = 2$: $y' = 3x^{2} - 2$, so the slope is $10$.\n\nCheck: the chord from $(2, 4)$ to $(2.01, 4.100601)$ has slope $10.0601$, close to $10$.\n\n> **Watch out.** The slope is $f'(a)$, not the height $f(a)$: here the point is $(2, 4)$, but the slope is $10$.",
        "$y = f(x)$ 在 $x = a$ 处的**切线**是经过 $(a, f(a))$、与曲线在该处紧贴的直线。它的斜率是 $f'(a)$。对 $y = x^{3} - 2x$ 在 $x = 2$ 处：$y' = 3x^{2} - 2$，所以斜率为 $10$。\n\n检验：从 $(2, 4)$ 到 $(2.01, 4.100601)$ 的割线斜率是 $10.0601$，接近 $10$。\n\n> **注意。** 斜率是 $f'(a)$，不是高度 $f(a)$：这里切点是 $(2, 4)$，斜率却是 $10$。",
      ),
      generate(rng) {
        const p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        const d = pDer(p);
        const answer = pAt(d, a);
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to $y = ${pLatex(p)}$ at the point where $x = ${a}$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的切线斜率。`,
          ),
          answer,
          mistakes: firsts([
            why(pAt(p, a), `This is the height $y(${a})$ of the point, not the slope.`, `这是切点的高度 $y(${a})$，不是斜率。`),
            why(d[0]!, "This is the slope at $x = 0$, the constant term of $y'$.", "这是 $x = 0$ 处的斜率，即 $y'$ 的常数项。"),
            why(
              pAt(d, a + 1),
              `This is the slope at $x = ${a + 1}$, not at $x = ${a}$.`,
              `这是 $x = ${a + 1}$ 处的斜率，不是 $x = ${a}$ 处的。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("The slope of the curve at each $x$ is", "曲线在每个 $x$ 处的斜率是"), [`y' = ${pLatex(d)}`]],
              [["Substitute the point", "代入切点"], none, [`y'(${a}) = ${pSub(d, a)} = ${answer}`]],
            ],
            quotients((x) => pAt(p, x), a, answer, "f", "x", t("Call the curve $y = f(x)$.", "把曲线记作 $y = f(x)$。")),
          ),
        });
      },
    },
    {
      id: "points-where-the-tangent-has-a-given-slope",
      title: t("Points where the tangent has a given slope", "切线斜率为给定值的点"),
      explanation: t(
        "To find where the tangent line has slope $m$, solve $f'(x) = m$. A horizontal tangent has slope $0$. For $f(x) = x^{3} - 3x$, $f'(x) = 3x^{2} - 3 = 0$ at $x = \\pm 1$.\n\nCheck: on the graph of $x^{3} - 3x$, the points $(-1, 2)$ and $(1, -2)$ are where the curve turns, a peak and a dip, and there the tangent is flat.\n\n> **Watch out.** Set the derivative equal to $m$, not the function, and give every solution: a quadratic $f'$ can reach the slope $m$ twice.",
        "要求切线斜率为 $m$ 的点，就解方程 $f'(x) = m$。水平切线的斜率为 $0$。对 $f(x) = x^{3} - 3x$，$f'(x) = 3x^{2} - 3 = 0$ 的解是 $x = \\pm 1$。\n\n检验：在 $x^{3} - 3x$ 的图像上，点 $(-1, 2)$ 和 $(1, -2)$ 是曲线转弯的地方，一个是峰，一个是谷，那里的切线是水平的。\n\n> **注意。** 令导数等于 $m$，而不是令函数等于 $m$；还要给出所有解：二次的 $f'$ 可能两次取到斜率 $m$。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 4);
        const r2 = rng.pick(range(-4, 4).filter((r) => r !== r1 && (r + r1) % 2 === 0));
        const m = rng.pick([0, 0, rng.int(-9, 9)]);
        // f'(x) = 3(x − r1)(x − r2) + m.
        const p: Poly = [rng.int(-5, 5), 3 * r1 * r2 + m, (-3 * (r1 + r2)) / 2, 1];
        const d = pDer(p);
        const what = m === 0 ? t("is horizontal", "是水平的") : t(`has slope $${m}$`, `的斜率为 $${m}$`);
        const zero = pLatex([3 * r1 * r2, -3 * (r1 + r2), 3]);
        return solutionsProblem({
          prompt: t(
            `Find every $x$ at which the tangent line to $y = ${pLatex(p)}$ ${what.en}.`,
            `求曲线 $y = ${pLatex(p)}$ 的切线${what["zh-CN"]}时的所有 $x$ 值。`,
          ),
          values: [String(r1), String(r2)],
          wrong: [[String(r1 + r2)]],
          mistakes: [
            whySet(
              [String(-r1), String(-r2)],
              `These have the wrong signs: the factor $${fac(r1)}$ is $0$ at $x = ${r1}$.`,
              `这些符号错了：因式 $${fac(r1)}$ 在 $x = ${r1}$ 处为 $0$。`,
            ),
            whySet(
              [String(r1)],
              `This misses a solution: $${fac(r2)}$ is $0$ at $x = ${r2}$, so the tangent there ${what.en} too.`,
              `这漏了一个解：$${fac(r2)}$ 在 $x = ${r2}$ 处为 $0$，所以那里的切线也${what["zh-CN"]}。`,
            ),
          ],
          solution: walked(
            [
              [["Differentiate", "求导"], none, [`y' = ${pLatex(d)}`]],
              [
                [`Solve $y' = ${m}$`, `解方程 $y' = ${m}$`],
                none,
                [...(m === 0 ? [] : [`${pLatex(d)} = ${m}`]), `${zero} = 0`, `3${fac(r1)}${fac(r2)} = 0`],
              ],
              [["Read off the solutions", "写出解"], t(`So $x = ${r1}$ or $x = ${r2}$.`, `所以 $x = ${r1}$ 或 $x = ${r2}$。`)],
            ],
            t(
              `Substitute back into $y'$: $y'(${r1}) = ${pSub(d, r1)} = ${pAt(d, r1)}$ and $y'(${r2}) = ${pSub(d, r2)} = ${pAt(d, r2)}$, both equal to $${m}$.`,
              `代回 $y'$：$y'(${r1}) = ${pSub(d, r1)} = ${pAt(d, r1)}$，$y'(${r2}) = ${pSub(d, r2)} = ${pAt(d, r2)}$，都等于 $${m}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** pointSlope writes the line through (a, y0) with slope m: "y - 3 = 2(x + 1)". */
function pointSlope(a: number, y0: Q | number, m: Q | number): string {
  const q = m instanceof Q ? m : Q.of(m);
  const lhs = poly([1, "y"], [(y0 instanceof Q ? y0 : Q.of(y0)).neg(), ""]);
  const rhs = poly([q, a === 0 ? "x" : `(${bare(a)})`]).replace(/^\((.*)\)$/, "$1");
  return `${lhs} = ${rhs}`;
}

/** lineLatex writes y = mx + b with rational coefficients. */
const lineLatex = (m: Q, b: Q) => poly([m, "x"], [b, ""]);

/** nearby checks a tangent line on the graph: it meets the curve at a and stays close to it at a + 0.1. */
function nearby(a: number, y0: Q | number, m: Q, b: Q, curve: (x: number) => number): Text {
  const x1 = a + 0.1;
  const line = fmt(m.toNumber() * x1 + b.toNumber());
  const y = y0 instanceof Q ? y0.toLatex() : `${y0}`;
  return t(
    `On the graph the line touches the curve at $(${a}, ${y})$: there it gives $${m.toLatex()} \\cdot ${par(a)} + ${par(b)} = ${y}$. Just beside it, at $x = ${fmt(x1)}$, the line gives $${line}$ and the curve gives $${fmt(curve(x1))}$, almost the same.`,
    `在图像上，这条直线在 $(${a}, ${y})$ 处与曲线相切：该处直线给出 $${m.toLatex()} \\cdot ${par(a)} + ${par(b)} = ${y}$。在它旁边的 $x = ${fmt(x1)}$ 处，直线给出 $${line}$，曲线给出 $${fmt(curve(x1))}$，几乎相同。`,
  );
}

/** PowerCurve is a curve k√x or k/x at a point where its value and slope are rational. */
interface PowerCurve {
  readonly latex: string;
  readonly a: number;
  readonly y: Q;
  readonly slope: Q;
  readonly derivative: string;
  readonly f: (x: number) => number;
}

/** powerCurve chooses k√x at a perfect square or k/x at an integer. */
function powerCurve(rng: Rng): PowerCurve {
  const k = rng.pick([1, 2, 3, 4, 6, 8, -2, -4]);
  if (rng.bool()) {
    const n = rng.int(1, 4);
    return {
      latex: `${k === 1 ? "" : k}\\sqrt{x}`,
      a: n * n,
      y: Q.of(k * n),
      slope: Q.of(k, 2 * n),
      derivative: `\\frac{${k}}{2\\sqrt{x}}`,
      f: (x) => k * Math.sqrt(x),
    };
  }
  const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  return {
    latex: `\\frac{${k}}{x}`,
    a,
    y: Q.of(k, a),
    slope: Q.of(-k, a * a),
    derivative: `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{x^{2}}`,
    f: (x) => k / x,
  };
}

/** calculatingTheEquationOfATangentLineUsingDifferentiation writes tangent lines. */
export const calculatingTheEquationOfATangentLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-equation-of-a-tangent-line-using-differentiation",
  title: t("Calculating the Equation of a Tangent Line Using Differentiation", "用求导求切线方程"),
  summary: t(
    "Write the equation of the tangent line to a curve at a point from the point and the derivative.",
    "由切点和导数写出曲线在某点处的切线方程。",
  ),
  intro: t(
    "The tangent line to $y = x^{2}$ at $x = 3$ passes through $(3, 9)$ with slope $y'(3) = 6$, so it is $y - 9 = 6(x - 3)$, that is, $y = 6x - 9$.\n\nCheck: at $x = 3.1$ the line gives $9.6$ and the curve gives $9.61$: near the point of tangency the two almost agree.\n\nIn this lesson we write the equation of the tangent line from the point and the derivative, for polynomial curves and for curves such as $\\frac{k}{x}$ and $k\\sqrt{x}$.",
    "$y = x^{2}$ 在 $x = 3$ 处的切线经过 $(3, 9)$，斜率为 $y'(3) = 6$，所以切线是 $y - 9 = 6(x - 3)$，即 $y = 6x - 9$。\n\n检验：在 $x = 3.1$ 处直线给出 $9.6$，曲线给出 $9.61$：在切点附近两者几乎一致。\n\n本课我们由切点和导数写出切线方程，曲线包括多项式曲线以及 $\\frac{k}{x}$、$k\\sqrt{x}$ 这样的曲线。",
  ),
  prerequisites: ["calculating-the-slope-of-a-tangent-line-using-differentiation", "point-slope-form"],
  encompasses: [
    { topic: "calculating-the-slope-of-a-tangent-line-using-differentiation", weight: 0.6 },
    { topic: "point-slope-form", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "tangent-lines-to-polynomial-curves",
      title: t("Tangent lines to polynomial curves", "多项式曲线的切线"),
      explanation: t(
        "The tangent line at $x = a$ passes through $(a, f(a))$ with slope $f'(a)$. In point-slope form,\n\n$$y - f(a) = f'(a)(x - a).$$\n\nFor $f(x) = x^{2} + 1$ at $a = 2$: $f(2) = 5$, $f'(2) = 4$, so $y - 5 = 4(x - 2)$, that is, $y = 4x - 3$.\n\nCheck: at $x = 2.1$ the line gives $5.4$ and the curve gives $5.41$.\n\n> **Watch out.** $f(a)$ is not the intercept: the line passes through $(a, f(a))$, not through $(0, f(a))$. Expand $f'(a)(x - a)$ to find the intercept $f(a) - f'(a) \\cdot a$.",
        "$x = a$ 处的切线经过 $(a, f(a))$，斜率为 $f'(a)$。用点斜式表示为\n\n$$y - f(a) = f'(a)(x - a).$$\n\n对 $f(x) = x^{2} + 1$ 在 $a = 2$ 处：$f(2) = 5$，$f'(2) = 4$，所以 $y - 5 = 4(x - 2)$，即 $y = 4x - 3$。\n\n检验：在 $x = 2.1$ 处直线给出 $5.4$，曲线给出 $5.41$。\n\n> **注意。** $f(a)$ 不是截距：直线经过 $(a, f(a))$，而不是 $(0, f(a))$。展开 $f'(a)(x - a)$，截距是 $f(a) - f'(a) \\cdot a$。",
      ),
      generate(rng) {
        const p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        const fa = pAt(p, a);
        const m = pAt(pDer(p), a);
        const b = fa - m * a;
        const answer = lineLatex(Q.of(m), Q.of(b));
        return expressionProblem({
          prompt: t(
            `Find the equation of the tangent line to $y = ${pLatex(p)}$ at $x = ${a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的切线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          mistakes: once([
            say(
              lineLatex(Q.of(m), Q.of(fa)),
              `This uses $f(${a}) = ${fa}$ as the intercept. The line passes through $(${a}, ${fa})$, not through $(0, ${fa})$.`,
              `这把 $f(${a}) = ${fa}$ 当成了截距。直线经过 $(${a}, ${fa})$，而不是 $(0, ${fa})$。`,
            ),
            say(
              lineLatex(Q.of(fa), Q.of(b)),
              `This uses the height $${fa}$ as the slope. The slope is $f'(${a}) = ${m}$.`,
              `这把高度 $${fa}$ 当成了斜率。斜率是 $f'(${a}) = ${m}$。`,
            ),
            say(
              lineLatex(Q.of(m), Q.of(fa + m * a)),
              `This adds $${m} \\cdot ${par(a)}$ instead of subtracting it: the intercept is $${fa} - ${par(m)} \\cdot ${par(a)}$.`,
              `这加上了 $${m} \\cdot ${par(a)}$，应该减去它：截距是 $${fa} - ${par(m)} \\cdot ${par(a)}$。`,
            ),
            say(pLatex(pDer(p)), "This is the derivative $f'(x)$, not the tangent line.", "这是导数 $f'(x)$，不是切线。"),
          ]),
          solution: walked(
            [
              [["Find the point", "求切点"], t(`Substitute $x = ${a}$ into the curve:`, `把 $x = ${a}$ 代入曲线：`), [`f(${a}) = ${fa}`]],
              [["Find the slope", "求斜率"], none, [`f'(x) = ${pLatex(pDer(p))}`, `f'(${a}) = ${m}`]],
              [
                ["Write the line", "写出直线"],
                t(`Use point-slope form through $(${a}, ${fa})$ with slope $${m}$:`, `用点斜式，过 $(${a}, ${fa})$，斜率为 $${m}$：`),
                [pointSlope(a, fa, m), `y = ${answer}`],
              ],
            ],
            nearby(a, fa, Q.of(m), Q.of(b), (x) => pAt(p, x)),
          ),
        });
      },
    },
    {
      id: "tangent-lines-to-power-curves",
      title: t("Tangent lines to power curves", "幂函数曲线的切线"),
      explanation: t(
        "The same method works for any curve whose derivative we know. For $y = \\frac{4}{x}$ at $x = 2$: $y = 2$ and $y' = -\\frac{4}{x^{2}} = -1$, so the tangent line is $y - 2 = -(x - 2)$, that is, $y = -x + 4$.\n\nCheck: at $x = 2.1$ the line gives $1.9$ and the curve gives $\\frac{4}{2.1} \\approx 1.9048$.\n\n> **Watch out.** The slope of the line is a number: put $x = 2$ into $y' = -\\frac{4}{x^{2}}$ before writing the line, and keep the minus sign that the power rule brings for $\\frac{k}{x}$.",
        "对任何已知导数的曲线，方法都一样。对 $y = \\frac{4}{x}$ 在 $x = 2$ 处：$y = 2$，$y' = -\\frac{4}{x^{2}} = -1$，所以切线为 $y - 2 = -(x - 2)$，即 $y = -x + 4$。\n\n检验：在 $x = 2.1$ 处直线给出 $1.9$，曲线给出 $\\frac{4}{2.1} \\approx 1.9048$。\n\n> **注意。** 直线的斜率是一个数：写直线之前要把 $x = 2$ 代入 $y' = -\\frac{4}{x^{2}}$；对 $\\frac{k}{x}$，别丢掉幂法则带来的负号。",
      ),
      generate(rng) {
        const c = powerCurve(rng);
        const b = c.y.sub(c.slope.mul(Q.of(c.a)));
        const answer = lineLatex(c.slope, b);
        return expressionProblem({
          prompt: t(
            `Find the equation of the tangent line to $y = ${c.latex}$ at $x = ${c.a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${c.latex}$ 在 $x = ${c.a}$ 处的切线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          mistakes: once([
            say(
              lineLatex(c.slope, c.y),
              `This uses the height $${c.y.toLatex()}$ as the intercept. The line passes through $(${c.a}, ${c.y.toLatex()})$, not through $(0, ${c.y.toLatex()})$.`,
              `这把高度 $${c.y.toLatex()}$ 当成了截距。直线经过 $(${c.a}, ${c.y.toLatex()})$，而不是 $(0, ${c.y.toLatex()})$。`,
            ),
            say(
              lineLatex(c.slope.neg(), c.y.add(c.slope.mul(Q.of(c.a)))),
              `This has the slope with the wrong sign: $y' = ${c.derivative}$ gives $${c.slope.toLatex()}$ at $x = ${c.a}$.`,
              `这斜率的符号错了：$y' = ${c.derivative}$ 在 $x = ${c.a}$ 处等于 $${c.slope.toLatex()}$。`,
            ),
            say(
              lineLatex(c.y, b),
              `This uses the height $${c.y.toLatex()}$ as the slope. The slope comes from $y'$.`,
              `这把高度 $${c.y.toLatex()}$ 当成了斜率。斜率要由 $y'$ 求出。`,
            ),
          ]),
          solution: walked(
            [
              [["Find the point", "求切点"], none, [`y(${c.a}) = ${c.y.toLatex()}`]],
              [
                ["Find the slope", "求斜率"],
                t(`Differentiate with the power rule and put in $x = ${c.a}$:`, `用幂法则求导，再代入 $x = ${c.a}$：`),
                [`y' = ${c.derivative}`, `y'(${c.a}) = ${c.slope.toLatex()}`],
              ],
              [["Write the line", "写出直线"], none, [pointSlope(c.a, c.y, c.slope), `y = ${answer}`]],
            ],
            nearby(c.a, c.y, c.slope, b, c.f),
          ),
        });
      },
    },
  ],
};

/** calculatingTheEquationOfANormalLineUsingDifferentiation writes normal lines. */
export const calculatingTheEquationOfANormalLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-equation-of-a-normal-line-using-differentiation",
  title: t("Calculating the Equation of a Normal Line Using Differentiation", "用求导求法线方程"),
  summary: t(
    "Find the slope and equation of the normal line, perpendicular to the tangent line at a point.",
    "求法线（与某点处切线垂直的直线）的斜率和方程。",
  ),
  intro: t(
    "At $(1, 1)$ on $y = x^{2}$ the tangent slope is $2$. The normal line there is perpendicular to the tangent, so its slope is $-\\frac{1}{2}$, and its equation is $y - 1 = -\\frac{1}{2}(x - 1)$.\n\nCheck: the product of the two slopes is $2 \\cdot \\left(-\\frac{1}{2}\\right) = -1$, as it must be for perpendicular lines.\n\nIn this lesson we find the slope of the normal line from the derivative and write its equation.",
    "在 $y = x^{2}$ 上的点 $(1, 1)$ 处，切线斜率是 $2$。该处的法线与切线垂直，所以斜率是 $-\\frac{1}{2}$，方程是 $y - 1 = -\\frac{1}{2}(x - 1)$。\n\n检验：两个斜率之积是 $2 \\cdot \\left(-\\frac{1}{2}\\right) = -1$，互相垂直的直线正应如此。\n\n本课我们由导数求法线的斜率，并写出法线方程。",
  ),
  prerequisites: ["calculating-the-equation-of-a-tangent-line-using-differentiation", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "calculating-the-equation-of-a-tangent-line-using-differentiation", weight: 0.5 },
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-of-a-normal-line",
      figure: calculusDrawings2["calculating-the-equation-of-a-normal-line-using-differentiation#the-slope-of-a-normal-line"],
      title: t("The slope of a normal line", "法线的斜率"),
      explanation: t(
        "The **normal line** at a point is perpendicular to the tangent line there. When the tangent slope is $m \\ne 0$, the normal slope is the negative reciprocal $-\\frac{1}{m}$. (A horizontal tangent has a vertical normal.) For $y = x^{2}$ at $x = 3$ the tangent slope is $6$, so the normal slope is $-\\frac{1}{6}$.\n\nCheck: $6 \\cdot \\left(-\\frac{1}{6}\\right) = -1$, as for any two perpendicular lines.\n\n> **Watch out.** Take both parts of the negative reciprocal: $-\\frac{1}{m}$, not $-m$ and not $\\frac{1}{m}$.",
        "某点处的**法线**与该点处的切线垂直。当切线斜率 $m \\ne 0$ 时，法线斜率是它的负倒数 $-\\frac{1}{m}$。（水平切线对应竖直的法线。）对 $y = x^{2}$ 在 $x = 3$ 处，切线斜率是 $6$，所以法线斜率是 $-\\frac{1}{6}$。\n\n检验：$6 \\cdot \\left(-\\frac{1}{6}\\right) = -1$，任意两条互相垂直的直线都是这样。\n\n> **注意。** 负倒数的两部分都要做：$-\\frac{1}{m}$，不是 $-m$，也不是 $\\frac{1}{m}$。",
      ),
      generate(rng) {
        let p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        while (pAt(pDer(p), a) === 0) p = quadratic(rng);
        const m = pAt(pDer(p), a);
        const answer = Q.of(-1, m);
        const raw = `-\\frac{1}{${m}}`;
        const chain = raw === answer.toLatex() ? raw : `${raw} = ${answer.toLatex()}`;
        return numberProblem({
          prompt: t(
            `Find the slope of the normal line to $y = ${pLatex(p)}$ at $x = ${a}$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的法线斜率。`,
          ),
          answer,
          mistakes: firsts([
            why(Q.of(m), "This is the slope of the tangent line. The normal is perpendicular to it.", "这是切线的斜率。法线与切线垂直。"),
            why(Q.of(-m), "This changes the sign but does not take the reciprocal.", "这改变了符号，但没有取倒数。"),
            why(Q.of(1, m), "This takes the reciprocal but does not change the sign.", "这取了倒数，但没有改变符号。"),
          ]),
          solution: walked(
            [
              [["Find the tangent slope", "求切线斜率"], none, [`y' = ${pLatex(pDer(p))}`, `y'(${a}) = ${m}`]],
              [["Take the negative reciprocal", "取负倒数"], t("The normal slope is", "法线斜率是"), [chain]],
            ],
            t(
              `The two slopes multiply to $-1$, as perpendicular slopes do: $${m} \\cdot ${par(answer)} = -1$.`,
              `两个斜率之积是 $-1$，互相垂直的直线正应如此：$${m} \\cdot ${par(answer)} = -1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-equation-of-a-normal-line",
      title: t("The equation of a normal line", "法线方程"),
      explanation: t(
        "The normal line at $x = a$ passes through $(a, f(a))$ with slope $-\\frac{1}{f'(a)}$:\n\n$$y - f(a) = -\\frac{1}{f'(a)}(x - a).$$\n\nFor $f(x) = x^{2}$ at $a = 1$: the point is $(1, 1)$ and $f'(1) = 2$, so $y - 1 = -\\frac{1}{2}(x - 1)$, that is, $y = -\\frac{1}{2}x + \\frac{3}{2}$.\n\nCheck: at $x = 1$ the line gives $-\\frac{1}{2} + \\frac{3}{2} = 1$, the point on the curve.\n\n> **Watch out.** The normal goes through the same point as the tangent, $(a, f(a))$; only the slope changes, to $-\\frac{1}{f'(a)}$.",
        "$x = a$ 处的法线经过 $(a, f(a))$，斜率为 $-\\frac{1}{f'(a)}$：\n\n$$y - f(a) = -\\frac{1}{f'(a)}(x - a).$$\n\n对 $f(x) = x^{2}$ 在 $a = 1$ 处：点为 $(1, 1)$，$f'(1) = 2$，所以 $y - 1 = -\\frac{1}{2}(x - 1)$，即 $y = -\\frac{1}{2}x + \\frac{3}{2}$。\n\n检验：在 $x = 1$ 处直线给出 $-\\frac{1}{2} + \\frac{3}{2} = 1$，正是曲线上的点。\n\n> **注意。** 法线与切线经过同一点 $(a, f(a))$；只有斜率变了，变为 $-\\frac{1}{f'(a)}$。",
      ),
      generate(rng) {
        let p = quadratic(rng);
        const a = rng.int(-3, 3);
        while (pAt(pDer(p), a) === 0) p = quadratic(rng);
        const fa = pAt(p, a);
        const m = pAt(pDer(p), a);
        const n = Q.of(-1, m);
        const b = Q.of(fa).sub(n.mul(Q.of(a)));
        const answer = lineLatex(n, b);
        const raw = `-\\frac{1}{${m}}`;
        return expressionProblem({
          prompt: t(
            `Find the equation of the normal line to $y = ${pLatex(p)}$ at $x = ${a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的法线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          mistakes: once([
            say(
              lineLatex(Q.of(m), Q.of(fa - m * a)),
              `This is the tangent line, with slope $${m}$. The normal has slope $${n.toLatex()}$.`,
              `这是切线，斜率为 $${m}$。法线的斜率是 $${n.toLatex()}$。`,
            ),
            say(
              lineLatex(Q.of(1, m), Q.of(fa).sub(Q.of(a, m))),
              `This takes the reciprocal $${Q.of(1, m).toLatex()}$ but not its negative.`,
              `这取了倒数 $${Q.of(1, m).toLatex()}$，但没有取相反数。`,
            ),
            say(
              lineLatex(n, Q.of(fa)),
              `This uses $f(${a}) = ${fa}$ as the intercept. The line passes through $(${a}, ${fa})$, not through $(0, ${fa})$.`,
              `这把 $f(${a}) = ${fa}$ 当成了截距。直线经过 $(${a}, ${fa})$，而不是 $(0, ${fa})$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the point and the tangent slope", "求切点和切线斜率"],
                none,
                [`f(${a}) = ${fa}`, `f'(x) = ${pLatex(pDer(p))}, \\quad f'(${a}) = ${m}`],
              ],
              [
                ["Find the normal slope", "求法线斜率"],
                t("It is the negative reciprocal of the tangent slope:", "它是切线斜率的负倒数："),
                [raw === n.toLatex() ? raw : `${raw} = ${n.toLatex()}`],
              ],
              [["Write the line", "写出直线"], none, [pointSlope(a, fa, n), `y = ${answer}`]],
            ],
            t(
              `At $x = ${a}$ the line gives $${n.toLatex()} \\cdot ${par(a)} + ${par(b)} = ${fa}$, the point on the curve, and its slope times the tangent slope is $${par(n)} \\cdot ${par(m)} = -1$, so it is perpendicular to the tangent.`,
              `在 $x = ${a}$ 处直线给出 $${n.toLatex()} \\cdot ${par(a)} + ${par(b)} = ${fa}$，正是曲线上的点；它的斜率与切线斜率之积是 $${par(n)} \\cdot ${par(m)} = -1$，所以它与切线垂直。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculusIDifferentiationTopics are the topics of Calculus I module 4.9. */
export const calculusIDifferentiationTopics: readonly TopicDef[] = [
  theAverageRateOfChangeOfAFunctionOverAVaryingInterval,
  theInstantaneousRateOfChangeOfAFunctionAtAPoint,
  definingTheDerivativeUsingDerivativeNotation,
  continuityAndDifferentiabilityOfFunctions,
  thePowerRuleForDifferentiation,
  theSumAndConstantMultipleRulesForDifferentiation,
  calculatingTheSlopeOfATangentLineUsingDifferentiation,
  calculatingTheEquationOfATangentLineUsingDifferentiation,
  calculatingTheEquationOfANormalLineUsingDifferentiation,
];
