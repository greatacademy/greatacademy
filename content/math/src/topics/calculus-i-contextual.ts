import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, poly, Q, sketch } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { article, numberProblem, say, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { lim, oneOf, type Poly, pAt, par, pDer, pLatex, rounded, table } from "./calculus-common.ts";
import { firsts, fmt, functionWith, quotients, walked } from "./calculus-i-differentiation.ts";

// Calculus I unit 6: Contextual Applications of Differentiation, modules 6.14 to 6.17.

/** L writes a rational number in LaTeX. */
const L = (q: Q) => q.toLatex();

/** Context is a quantity that changes over time, with its units in both locales. */
interface Context {
  readonly f: string;
  readonly what: Text;
  readonly out: Text;
  readonly time: Text;
  readonly one: Text;
}

/** contexts are quantities that change over time. */
const contexts: readonly Context[] = [
  {
    f: "V",
    what: t("the volume of water in a tank", "水箱中水的体积"),
    out: t("liters", "升"),
    time: t("minutes", "分钟"),
    one: t("minute", "分钟"),
  },
  {
    f: "P",
    what: t("the population of a town", "某镇的人口"),
    out: t("people", "人"),
    time: t("years", "年"),
    one: t("year", "年"),
  },
  {
    f: "h",
    what: t("the height of a balloon", "气球的高度"),
    out: t("meters", "米"),
    time: t("seconds", "秒"),
    one: t("second", "秒"),
  },
  {
    f: "T",
    what: t("the temperature of a cup of coffee", "一杯咖啡的温度"),
    out: t("degrees Celsius", "摄氏度"),
    time: t("minutes", "分钟"),
    one: t("minute", "分钟"),
  },
  {
    f: "D",
    what: t("the distance a car has traveled", "汽车行驶的路程"),
    out: t("kilometers", "千米"),
    time: t("hours", "小时"),
    one: t("hour", "小时"),
  },
  {
    f: "M",
    what: t("the mass of a radioactive sample", "放射性样品的质量"),
    out: t("grams", "克"),
    time: t("days", "天"),
    one: t("day", "天"),
  },
];

/** setting describes a context: "Let V(t) be the volume of water in a tank, in liters, t minutes after it starts filling." */
const setting = (c: Context) =>
  t(
    `Let $${c.f}(t)$ be ${c.what.en}, in ${c.out.en}, $t$ ${c.time.en} after a measurement starts.`,
    `设 $${c.f}(t)$ 为测量开始 $t$ ${c.time["zh-CN"]}后${c.what["zh-CN"]}（单位：${c.out["zh-CN"]}）。`,
  );

/** interpretingTheMeaningOfTheDerivativeInContext reads derivatives as rates with units. */
export const interpretingTheMeaningOfTheDerivativeInContext: TopicDef = {
  id: "interpreting-the-meaning-of-the-derivative-in-context",
  title: t("Interpreting the Meaning of the Derivative in Context", "在实际情境中解释导数的意义"),
  summary: t(
    "Give the units of a derivative and interpret a statement about a derivative in context.",
    "给出导数的单位，并在实际情境中解释关于导数的陈述。",
  ),
  intro: t(
    "Let $V(t)$ be the volume of water in a tank, in liters, after $t$ minutes. If $V(2) = 50$ and $V(2.1) = 50.8$, the volume grew by $0.8$ liters in $0.1$ minute, a rate of $\\frac{0.8}{0.1} = 8$ liters per minute. The derivative $V'(2)$ is the limit of such rates, so it is measured in liters per minute as well.\n\nCheck: a rate of $8$ liters per minute kept up for $0.1$ minute gives $8 \\times 0.1 = 0.8$ liters, the change we started from.\n\nIn this lesson we give the units of a derivative and read what a statement such as $V'(2) = 8$ says, and what it does not say, about the quantity.",
    "设 $V(t)$ 为 $t$ 分钟后水箱中水的体积（单位：升）。若 $V(2) = 50$，$V(2.1) = 50.8$，则体积在 $0.1$ 分钟内增加了 $0.8$ 升，速率为 $\\frac{0.8}{0.1} = 8$ 升每分钟。导数 $V'(2)$ 是这类速率的极限，所以它的单位也是升每分钟。\n\n检验：以 $8$ 升每分钟的速率持续 $0.1$ 分钟，得到 $8 \\times 0.1 = 0.8$ 升，正是开始时的变化量。\n\n本课我们给出导数的单位，并解读像 $V'(2) = 8$ 这样的陈述对这个量说明了什么、没有说明什么。",
  ),
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "units-of-the-derivative",
      title: t("Units of the derivative", "导数的单位"),
      explanation: t(
        "$f'(t) = \\lim_{h \\to 0}\\frac{f(t + h) - f(t)}{h}$ is a change in output divided by a change in input, so its units are the output units per input unit. If $V(t)$ is a volume in liters and $t$ is in minutes, $V'(t)$ is in liters per minute.\n\nCheck: a rate times a time gives back an amount, and liters per minute times minutes is liters, the units of $V$ itself.\n\n> **Watch out.** The output's units go on top and the input's units below. Liters per minute per minute are the units of the second derivative $V''$, not of $V'$.",
        "$f'(t) = \\lim_{h \\to 0}\\frac{f(t + h) - f(t)}{h}$ 是输出的变化量除以输入的变化量，因此它的单位是“输出单位每输入单位”。若 $V(t)$ 是以升为单位的体积，$t$ 以分钟为单位，则 $V'(t)$ 的单位是升每分钟。\n\n检验：变化率乘以时间得到变化的量，升每分钟乘以分钟就是升，正是 $V$ 本身的单位。\n\n> **注意。** 输出的单位在上，输入的单位在下。“升每分钟每分钟”是二阶导数 $V''$ 的单位，不是 $V'$ 的单位。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const a = rng.int(1, 12);
        const per = (x: Context) => t(`${x.out.en} per ${x.one.en}`, `${x.out["zh-CN"]}每${x.one["zh-CN"]}`);
        const oneOut = c.out.en === "people" ? "person" : c.out.en === "degrees Celsius" ? "degree Celsius" : c.out.en.replace(/s$/, "");
        return reasoned(
          oneOf(
            rng,
            t(`${setting(c).en} What are the units of $${c.f}'(${a})$?`, `${setting(c)["zh-CN"]}$${c.f}'(${a})$ 的单位是什么？`),
            per(c),
            [
              c.out,
              t(`${c.one.en} per ${oneOut}`, `${c.one["zh-CN"]}每${c.out["zh-CN"]}`),
              t(`${c.out.en} per ${c.one.en} per ${c.one.en}`, `${c.out["zh-CN"]}每${c.one["zh-CN"]}的平方`),
            ],
            walked(
              [
                [
                  ["Name the units of the input and the output", "写出输入和输出的单位"],
                  t(
                    `The output $${c.f}$ is measured in ${c.out.en} and the input $t$ in ${c.time.en}.`,
                    `输出 $${c.f}$ 的单位是${c.out["zh-CN"]}，输入 $t$ 的单位是${c.time["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Divide output by input", "输出除以输入"],
                  t(
                    `$${c.f}'(${a})$ is a change in ${c.out.en} divided by a change in ${c.time.en}, so it is measured in ${per(c).en}.`,
                    `$${c.f}'(${a})$ 是${c.out["zh-CN"]}的变化量除以${c.time["zh-CN"]}的变化量，单位是${per(c)["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Multiplying a rate in ${per(c).en} by a time in ${c.time.en} cancels the ${c.time.en} and leaves ${c.out.en}, the units of $${c.f}$, as a change in $${c.f}$ must have.`,
                `把单位为${per(c)["zh-CN"]}的变化率乘以单位为${c.time["zh-CN"]}的时间，${c.time["zh-CN"]}约去，剩下${c.out["zh-CN"]}，正是 $${c.f}$ 的变化量应有的单位。`,
              ),
            ),
          ),
          [
            [
              c.out.en,
              "These are the units of the function's value. A derivative is a change in that value divided by a change in the input.",
              "这是函数值的单位。导数是函数值的变化量除以输入的变化量。",
            ],
            [`${c.one.en} per ${oneOut}`, "This is upside down: the output's units go on top.", "这里颠倒了：输出的单位在分子上。"],
            [
              `${c.out.en} per ${c.one.en} per ${c.one.en}`,
              "This is the unit of the second derivative, which divides by the input's units twice.",
              "这是二阶导数的单位，它除以输入单位两次。",
            ],
          ],
        );
      },
    },
    {
      id: "interpreting-a-derivative-value",
      title: t("Interpreting a derivative value", "解释导数值"),
      explanation: t(
        "A derivative value is a rate at one instant: its sign gives the direction of change and its size gives how fast. If $P(t)$ is the population of a town and $t$ is in years, $P'(3) = -40$ says that at the instant $t = 3$, the population is decreasing at a rate of $40$ people per year.\n\nCheck: over the next tenth of a year the population changes by about $-40 \\times 0.1 = -4$ people, a decrease, as the negative sign says.\n\n> **Watch out.** $P'(3) = -40$ says nothing about the value of $P$: it does not mean $P(3) = -40$. Nor does it describe a change over the first $3$ years; it describes the single instant $t = 3$.",
        "导数值是某一时刻的变化率：它的符号表示变化的方向，大小表示变化的快慢。若 $P(t)$ 是某镇的人口，$t$ 以年为单位，则 $P'(3) = -40$ 表示在 $t = 3$ 这一时刻，人口正以每年 $40$ 人的速率减少。\n\n检验：在接下来的十分之一年里，人口约变化 $-40 \\times 0.1 = -4$ 人，是减少，与负号一致。\n\n> **注意。** $P'(3) = -40$ 与 $P$ 的值无关：它不表示 $P(3) = -40$。它也不描述前 $3$ 年的变化，只描述 $t = 3$ 这一时刻。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const a = rng.int(1, 12);
        const v = rng.nonZero(-60, 60);
        const n = Math.abs(v);
        const up = v > 0;
        const at = t(`At $t = ${a}$`, `在 $t = ${a}$ 时`);
        const rate = (inc: boolean) =>
          t(
            `${at.en}, ${c.what.en} is ${inc ? "increasing" : "decreasing"} at a rate of $${n}$ ${c.out.en} per ${c.one.en}.`,
            `${at["zh-CN"]}，${c.what["zh-CN"]}正以每${c.one["zh-CN"]} $${n}$ ${c.out["zh-CN"]}的速率${inc ? "增加" : "减少"}。`,
          );
        const value = t(`${at.en}, ${c.what.en} is $${v}$ ${c.out.en}.`, `${at["zh-CN"]}，${c.what["zh-CN"]}为 $${v}$ ${c.out["zh-CN"]}。`);
        const interval = t(
          `Over the first $${a}$ ${c.time.en}, ${c.what.en} ${up ? "increases" : "decreases"} by $${n}$ ${c.out.en}.`,
          `在前 $${a}$ ${c.time["zh-CN"]}内，${c.what["zh-CN"]}${up ? "增加" : "减少"}了 $${n}$ ${c.out["zh-CN"]}。`,
        );
        return reasoned(
          oneOf(
            rng,
            t(`${setting(c).en} What does $${c.f}'(${a}) = ${v}$ mean?`, `${setting(c)["zh-CN"]}$${c.f}'(${a}) = ${v}$ 表示什么？`),
            rate(up),
            [rate(!up), value, interval],
            walked(
              [
                [
                  ["Read what kind of number it is", "看清它是什么量"],
                  t(
                    `$${c.f}'(${a})$ is the instantaneous rate of change of $${c.f}$ at $t = ${a}$, measured in ${c.out.en} per ${c.one.en}.`,
                    `$${c.f}'(${a})$ 是 $${c.f}$ 在 $t = ${a}$ 时的瞬时变化率，单位是${c.out["zh-CN"]}每${c.one["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Read the sign", "看符号"],
                  t(
                    `It is ${up ? "positive" : "negative"}, so at that instant ${c.what.en} is ${up ? "increasing" : "decreasing"}, at $${n}$ ${c.out.en} per ${c.one.en}.`,
                    `它为${up ? "正" : "负"}，所以在这一时刻${c.what["zh-CN"]}正在${up ? "增加" : "减少"}，速率为每${c.one["zh-CN"]} $${n}$ ${c.out["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Over a short time of $0.1$ ${c.one.en} after $t = ${a}$, the change is about $${v} \\times 0.1 = ${fmt(v / 10)}$ ${c.out.en}: ${up ? "an increase" : "a decrease"}, with the sign of the derivative.`,
                `在 $t = ${a}$ 之后很短的 $0.1$ ${c.one["zh-CN"]}内，变化量约为 $${v} \\times 0.1 = ${fmt(v / 10)}$ ${c.out["zh-CN"]}：是${up ? "增加" : "减少"}，与导数的符号一致。`,
              ),
            ),
          ),
          [
            [
              rate(!up).en,
              `The sign gives the direction: a ${up ? "positive" : "negative"} derivative means the quantity is ${up ? "increasing" : "decreasing"}.`,
              `符号表示方向：导数为${up ? "正" : "负"}，说明这个量正在${up ? "增加" : "减少"}。`,
            ],
            [
              value.en,
              "This reads the derivative as the value of the quantity. A derivative is a rate of change, not an amount.",
              "这把导数当成了这个量本身的值。导数是变化率，不是数量。",
            ],
            [
              interval.en,
              `This describes a change over an interval of time. $${c.f}'(${a})$ is a rate at the single instant $t = ${a}$.`,
              `这描述的是一段时间内的变化。$${c.f}'(${a})$ 是 $t = ${a}$ 这一时刻的变化率。`,
            ],
          ],
        );
      },
    },
  ],
};

/** ratesOfChangeInAppliedContexts computes rates of change from formulas in context. */
export const ratesOfChangeInAppliedContexts: TopicDef = {
  id: "rates-of-change-in-applied-contexts",
  title: t("Rates of Change in Applied Contexts", "实际情境中的变化率"),
  summary: t(
    "Differentiate a formula for a quantity in context and evaluate its rate of change.",
    "对实际情境中的量的公式求导，计算它的变化率。",
  ),
  intro: t(
    "A stone dropped from a cliff has fallen $s(t) = 5t^{2}$ meters after $t$ seconds. Its speed is the rate of change of this distance, $s'(t) = 10t$, so after $2$ seconds it is falling at $s'(2) = 20$ meters per second.\n\nCheck: between $t = 2$ and $t = 2.01$ it falls $5(2.01)^{2} - 5(2)^{2} = 0.2005$ meters, a rate of $\\frac{0.2005}{0.01} = 20.05$ meters per second, close to $20$.\n\nIn this lesson we differentiate formulas for heights, costs, areas and populations, and evaluate their rates of change at a given moment.",
    "从悬崖上落下的石头 $t$ 秒后下落了 $s(t) = 5t^{2}$ 米。它的速度是这段距离的变化率 $s'(t) = 10t$，所以 $2$ 秒后它以 $s'(2) = 20$ 米每秒的速度下落。\n\n检验：在 $t = 2$ 与 $t = 2.01$ 之间它下落了 $5(2.01)^{2} - 5(2)^{2} = 0.2005$ 米，速率为 $\\frac{0.2005}{0.01} = 20.05$ 米每秒，接近 $20$。\n\n本课我们对高度、成本、面积和人口的公式求导，并计算它们在给定时刻的变化率。",
  ),
  prerequisites: ["interpreting-the-meaning-of-the-derivative-in-context"],
  encompasses: [{ topic: "interpreting-the-meaning-of-the-derivative-in-context", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-change-of-polynomial-models",
      title: t("Rates of change of polynomial models", "多项式模型的变化率"),
      explanation: t(
        "Differentiate the formula, then substitute the input. If a ball's height is $h(t) = -5t^{2} + 20t + 2$ meters after $t$ seconds, then $h'(t) = -10t + 20$, so at $t = 3$ its height changes at $h'(3) = -10$ meters per second: it is falling at $10$ meters per second.\n\nCheck: $h(3) = 17$ and $h(3.01) = 16.8995$, so over that hundredth of a second the rate is $\\frac{16.8995 - 17}{0.01} = -10.05$, close to $-10$.\n\n> **Watch out.** The rate at $t = 3$ is $h'(3)$, not the height $h(3)$, and not the average rate $\\frac{h(3) - h(0)}{3}$ over the first three seconds.",
        "先对公式求导，再代入输入值。若小球 $t$ 秒后的高度为 $h(t) = -5t^{2} + 20t + 2$ 米，则 $h'(t) = -10t + 20$，所以 $t = 3$ 时高度的变化率为 $h'(3) = -10$ 米每秒：小球正以每秒 $10$ 米的速度下落。\n\n检验：$h(3) = 17$，$h(3.01) = 16.8995$，所以这百分之一秒内的变化率为 $\\frac{16.8995 - 17}{0.01} = -10.05$，接近 $-10$。\n\n> **注意。** $t = 3$ 时的变化率是 $h'(3)$，不是高度 $h(3)$，也不是前三秒的平均变化率 $\\frac{h(3) - h(0)}{3}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const v = rng.int(10, 40);
          const h0 = rng.int(0, 50);
          const t0 = rng.int(1, 6);
          const p: Poly = [h0, v, -5];
          const answer = pAt(pDer(p), t0);
          return numberProblem({
            prompt: t(
              `A ball is thrown upward. Its height after $t$ seconds is $h(t) = ${pLatex(p, "t")}$ meters. Find the rate of change of its height, in meters per second, at $t = ${t0}$.`,
              `一个小球被竖直向上抛出，$t$ 秒后的高度为 $h(t) = ${pLatex(p, "t")}$ 米。求 $t = ${t0}$ 时其高度的变化率（米每秒）。`,
            ),
            answer,
            mistakes: firsts([
              why(pAt(p, t0), `This is the height $h(${t0})$, not its rate of change.`, `这是高度 $h(${t0})$，不是它的变化率。`),
              why(
                Q.of(pAt(p, t0) - h0, t0),
                `This is the average rate $\\frac{h(${t0}) - h(0)}{${t0}}$ over the first $${t0}$ seconds, not the rate at the instant $t = ${t0}$.`,
                `这是前 $${t0}$ 秒的平均变化率 $\\frac{h(${t0}) - h(0)}{${t0}}$，不是 $t = ${t0}$ 时刻的变化率。`,
              ),
              why(
                v,
                `This is $h'(0)$, the rate at the start: the term $-10t$ of $h'(t)$ was left out.`,
                `这是 $h'(0)$，即开始时的变化率：漏掉了 $h'(t)$ 中的 $-10t$ 项。`,
              ),
              why(-answer, `The sign is reversed: $h'(${t0}) = -10(${t0}) + ${v}$.`, `符号反了：$h'(${t0}) = -10(${t0}) + ${v}$。`),
            ]),
            solution: walked(
              [
                [["Differentiate", "求导"], t("Differentiate term by term:", "逐项求导："), [`h'(t) = ${pLatex(pDer(p), "t")}`]],
                [
                  ["Substitute", "代入"],
                  t(`Put in $t = ${t0}$, in meters per second:`, `代入 $t = ${t0}$，单位为米每秒：`),
                  [`h'(${t0}) = -10(${t0}) + ${v} = ${answer}`],
                ],
              ],
              quotients((x) => -5 * x * x + v * x + h0, t0, answer, "h", "t"),
            ),
          });
        }
        if (kind === 1) {
          const [c0, c1] = [rng.int(5, 50) * 100, rng.int(2, 20)];
          const c2 = Q.of(rng.int(1, 9), 100);
          const x0 = rng.int(1, 9) * 50;
          const cost = `${decimal(c2)}x^{2} + ${c1}x + ${c0}`;
          const answer = c2.mul(Q.of(2 * x0)).add(Q.of(c1));
          const total = c2.mul(Q.of(x0 * x0)).add(Q.of(c1 * x0 + c0));
          const k = c2.toNumber();
          return numberProblem({
            prompt: t(
              `The cost of producing $x$ items is $C(x) = ${cost}$ dollars. Find the marginal cost $C'(${x0})$, in dollars per item.`,
              `生产 $x$ 件产品的成本为 $C(x) = ${cost}$ 美元。求边际成本 $C'(${x0})$（美元每件）。`,
            ),
            answer,
            form: "decimal",
            mistakes: firsts([
              why(total, `This is the total cost $C(${x0})$, not the marginal cost.`, `这是总成本 $C(${x0})$，不是边际成本。`),
              why(
                total.div(Q.of(x0)),
                `This is the average cost per item, $\\frac{C(${x0})}{${x0}}$, which includes the fixed cost $${c0}$.`,
                `这是平均每件的成本 $\\frac{C(${x0})}{${x0}}$，其中包含了固定成本 $${c0}$。`,
              ),
              why(
                Q.of(c1),
                `This keeps only the derivative of $${c1}x$: the derivative of $${decimal(c2)}x^{2}$ was left out.`,
                `这只保留了 $${c1}x$ 的导数，漏掉了 $${decimal(c2)}x^{2}$ 的导数。`,
              ),
              why(
                c2.mul(Q.of(x0)).add(Q.of(c1)),
                `This differentiates $${decimal(c2)}x^{2}$ to $${decimal(c2)}x$: the power rule brings down the $2$.`,
                `这把 $${decimal(c2)}x^{2}$ 的导数算成了 $${decimal(c2)}x$：幂法则要把指数 $2$ 乘到前面。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("Differentiate term by term:", "逐项求导："),
                  [`C'(x) = ${decimal(c2.mul(Q.of(2)))}x + ${c1}`],
                ],
                [
                  ["Substitute", "代入"],
                  t(`Put in $x = ${x0}$, in dollars per item:`, `代入 $x = ${x0}$，单位为美元每件：`),
                  [`C'(${x0}) = ${decimal(c2.mul(Q.of(2)))}(${x0}) + ${c1} = ${decimal(answer)}`],
                ],
              ],
              quotients((x) => k * x * x + c1 * x + c0, x0, answer.toNumber(), "C"),
            ),
          });
        }
        const r = rng.int(2, 9);
        const t0 = rng.int(1, 8);
        const a = rng.int(1, 6) * 10;
        const p: Poly = [0, a, r];
        const answer = pAt(pDer(p), t0);
        return numberProblem({
          prompt: t(
            `The area of an oil spill $t$ hours after a leak begins is $A(t) = ${pLatex(p, "t")}$ square meters. How fast is the area growing at $t = ${t0}$, in square meters per hour?`,
            `漏油开始 $t$ 小时后油污的面积为 $A(t) = ${pLatex(p, "t")}$ 平方米。$t = ${t0}$ 时面积增长的速率是多少（平方米每小时）？`,
          ),
          answer,
          mistakes: firsts([
            why(pAt(p, t0), `This is the area $A(${t0})$, not its rate of growth.`, `这是面积 $A(${t0})$，不是它的增长速率。`),
            why(
              Q.of(pAt(p, t0), t0),
              `This is the average rate $\\frac{A(${t0}) - A(0)}{${t0}}$ since the leak began, not the rate at $t = ${t0}$.`,
              `这是漏油开始以来的平均变化率 $\\frac{A(${t0}) - A(0)}{${t0}}$，不是 $t = ${t0}$ 时的变化率。`,
            ),
            why(
              a,
              `This is $A'(0)$, the rate when the leak began: the term $${2 * r}t$ was left out.`,
              `这是 $A'(0)$，即漏油开始时的速率：漏掉了 $${2 * r}t$ 项。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("Differentiate term by term:", "逐项求导："), [`A'(t) = ${pLatex(pDer(p), "t")}`]],
              [
                ["Substitute", "代入"],
                t(`Put in $t = ${t0}$, in square meters per hour:`, `代入 $t = ${t0}$，单位为平方米每小时：`),
                [`A'(${t0}) = ${2 * r}(${t0}) + ${a} = ${answer}`],
              ],
            ],
            quotients((x) => r * x * x + a * x, t0, answer, "A", "t"),
          ),
        });
      },
    },
    {
      id: "rates-of-change-of-exponential-models",
      title: t("Rates of change of exponential models", "指数模型的变化率"),
      explanation: t(
        "For $P(t) = P_{0}e^{kt}$, $P'(t) = kP_{0}e^{kt} = kP(t)$: the rate of change is proportional to the amount. Evaluate with a calculator and round as asked. For $P(t) = 1000e^{0.05t}$, $P'(t) = 50e^{0.05t}$, so $P'(10) = 50e^{0.5} \\approx 82.4$ per hour.\n\nCheck: $P(10) = 1000e^{0.5} \\approx 1648.7$, and $k \\cdot P(10) = 0.05 \\times 1648.7 \\approx 82.4$, the same rate.\n\n> **Watch out.** The chain rule brings the factor $k$ down: $\\frac{d}{dt}e^{kt} = ke^{kt}$, not $e^{kt}$. A negative $k$ gives a negative rate, a decrease.",
        "对 $P(t) = P_{0}e^{kt}$，$P'(t) = kP_{0}e^{kt} = kP(t)$：变化率与当前的量成正比。用计算器求值并按要求取近似。对 $P(t) = 1000e^{0.05t}$，$P'(t) = 50e^{0.05t}$，所以 $P'(10) = 50e^{0.5} \\approx 82.4$ 每小时。\n\n检验：$P(10) = 1000e^{0.5} \\approx 1648.7$，而 $k \\cdot P(10) = 0.05 \\times 1648.7 \\approx 82.4$，变化率相同。\n\n> **注意。** 链式法则会带下因子 $k$：$\\frac{d}{dt}e^{kt} = ke^{kt}$，不是 $e^{kt}$。$k$ 为负时变化率为负，表示减少。",
      ),
      generate(rng) {
        for (;;) {
          const growth = rng.bool();
          const p0 = growth ? rng.int(2, 9) * 1000 : rng.int(2, 9) * 10;
          const k = Q.of(growth ? rng.int(2, 9) : -rng.int(2, 9), 100);
          const t0 = rng.int(2, 20);
          const kL = k.toNumber();
          const value = kL * p0 * Math.exp(kL * t0);
          const answer = rounded(value, 1);
          const amountValue = p0 * Math.exp(kL * t0);
          const amount = rounded(amountValue, 1);
          if (!answer || !amount || answer.eq(amount)) continue;
          const f = `${p0}e^{${kL}t}`;
          const scale = k.mul(Q.of(p0)).toNumber();
          const exponent = Math.round(kL * t0 * 100) / 100;
          const [what, unit] = growth
            ? [t("bacteria in a culture", "培养皿中的细菌数"), t("bacteria per hour", "个每小时")]
            : [t("grams of a radioactive substance", "放射性物质的克数"), t("grams per hour", "克每小时")];
          return numberProblem({
            prompt: t(
              `The number of ${what.en} after $t$ hours is $${f}$. Find its rate of change at $t = ${t0}$, in ${unit.en}, to one decimal place.`,
              `$t$ 小时后${what["zh-CN"]}为 $${f}$。求 $t = ${t0}$ 时它的变化率（${unit["zh-CN"]}），精确到一位小数。`,
            ),
            answer,
            form: "decimal",
            mistakes: firsts([
              why(amount, `This is the amount at $t = ${t0}$, not its rate of change.`, `这是 $t = ${t0}$ 时的量，不是它的变化率。`),
              why(
                answer.neg(),
                `The sign is reversed: the rate has the sign of $k = ${kL}$.`,
                `符号反了：变化率的符号与 $k = ${kL}$ 相同。`,
              ),
              why(
                k.mul(Q.of(p0)),
                `This is the rate at $t = 0$: the factor $e^{${exponent}}$ was left out.`,
                `这是 $t = 0$ 时的变化率：漏掉了因子 $e^{${exponent}}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("By the chain rule the factor $k$ comes down:", "由链式法则，因子 $k$ 被带下来："),
                  [`\\frac{d}{dt}\\left(${f}\\right) = ${kL} \\cdot ${p0}e^{${kL}t} = ${scale}e^{${kL}t}`],
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `Put in $t = ${t0}$ and round to one decimal place, in ${unit.en}:`,
                    `代入 $t = ${t0}$，精确到一位小数，单位为${unit["zh-CN"]}：`,
                  ),
                  [`${scale}e^{${exponent}} \\approx ${answer.toNumber()}`],
                ],
              ],
              t(
                `The rate is $k$ times the amount. The amount is $${p0}e^{${exponent}} \\approx ${fmt(amountValue)}$, and $${kL} \\times ${fmt(amountValue)} \\approx ${fmt(value)}$, which rounds to $${answer.toNumber()}$.`,
                `变化率等于 $k$ 乘以当前的量。当前的量为 $${p0}e^{${exponent}} \\approx ${fmt(amountValue)}$，而 $${kL} \\times ${fmt(amountValue)} \\approx ${fmt(value)}$，四舍五入为 $${answer.toNumber()}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** Quotient is a difference quotient: forward, backward or central. */
type Quotient = "forward" | "backward" | "central";

/** quotientParts gives the two inputs and the width of a difference quotient at a with step h. */
function quotientParts(kind: Quotient, a: Q, h: Q): readonly [Q, Q, Q] {
  if (kind === "forward") return [a.add(h), a, h];
  if (kind === "backward") return [a, a.sub(h), h];
  return [a.add(h), a.sub(h), h.add(h)];
}

/** ratio writes n/d as a fraction and simplifies it when that changes it: "\\frac{6}{-2} = -3". */
function ratio(n: number, d: number): string {
  const q = Q.of(n, d).toLatex();
  const f = `\\frac{${n}}{${d}}`;
  return q === f ? f : `${f} = ${q}`;
}

/** decimal writes a terminating rational as a decimal. */
const decimal = (q: Q) => String(Number(q.toNumber().toFixed(10)));

/** pd writes a terminating rational as a decimal, in parentheses when it is negative. */
const pd = (q: Q) => (q.sign() < 0 ? `(${decimal(q)})` : decimal(q));

/** qAt evaluates a polynomial at a rational. */
const qAt = (p: Poly, x: Q) => p.reduce((s, c, i) => s.add(Q.of(c).mul(x.pow(i))), Q.zero);

/** quotientFormula writes the formula of a difference quotient. */
const quotientFormula: Record<Quotient, string> = {
  forward: "\\frac{f(a + h) - f(a)}{h}",
  backward: "\\frac{f(a) - f(a - h)}{h}",
  central: "\\frac{f(a + h) - f(a - h)}{2h}",
};

/** quotientName names a difference quotient in both locales. */
const quotientName = (kind: Quotient) => t(kind, { forward: "向前", backward: "向后", central: "中心" }[kind]);

/** quotientFromTable estimates a derivative from a table with a difference quotient. */
function quotientFromTable(rng: Rng, kind: Quotient): Problem {
  const h = rng.pick([1, 2, 5, 10]);
  const x0 = rng.int(0, 5) * h;
  const xs = [0, 1, 2, 3, 4].map((i) => x0 + i * h);
  let y = rng.int(-20, 40);
  const ys = xs.map(() => {
    y += rng.int(-6, 15);
    return y;
  });
  const j = kind === "forward" ? rng.int(0, 3) : kind === "backward" ? rng.int(1, 4) : rng.int(1, 3);
  const [hi, lo, w] = kind === "forward" ? [j + 1, j, h] : kind === "backward" ? [j, j - 1, h] : [j + 1, j - 1, 2 * h];
  const rise = ys[hi]! - ys[lo]!;
  const answer = Q.of(rise, w);
  const name = quotientName(kind);
  const side =
    kind === "forward"
      ? t(`the next listed input, $${xs[hi]}$`, `表中的下一个输入值 $${xs[hi]}$`)
      : kind === "backward"
        ? t(`the previous listed input, $${xs[lo]}$`, `表中的前一个输入值 $${xs[lo]}$`)
        : t(`the inputs on either side, $${xs[lo]}$ and $${xs[hi]}$`, `两侧的输入值 $${xs[lo]}$ 和 $${xs[hi]}$`);
  const mistakes = [
    why(
      rise,
      `This is the change in $f$ without dividing by the change in $x$, which is $${w}$.`,
      `这只是 $f$ 的变化量，没有除以 $x$ 的变化量 $${w}$。`,
    ),
    why(
      answer.neg(),
      "The subtraction is the wrong way round: subtract the value at the smaller input from the value at the larger one.",
      "减法顺序反了：应该用较大输入处的值减去较小输入处的值。",
    ),
  ];
  if (kind === "forward" && j >= 1)
    mistakes.push(
      why(
        Q.of(ys[j]! - ys[j - 1]!, h),
        `This is the backward difference quotient, which uses the point to the left, $x = ${xs[j - 1]}$.`,
        `这是向后差商，用的是左侧的点 $x = ${xs[j - 1]}$。`,
      ),
    );
  if (kind === "backward" && j <= 3)
    mistakes.push(
      why(
        Q.of(ys[j + 1]! - ys[j]!, h),
        `This is the forward difference quotient, which uses the point to the right, $x = ${xs[j + 1]}$.`,
        `这是向前差商，用的是右侧的点 $x = ${xs[j + 1]}$。`,
      ),
    );
  if (kind === "central")
    mistakes.push(
      why(
        Q.of(rise, h),
        `This divides by $${h}$, but the two inputs are $2h = ${2 * h}$ apart.`,
        `这里除以了 $${h}$，但两个输入值相距 $2h = ${2 * h}$。`,
      ),
      why(
        Q.of(ys[j + 1]! - ys[j]!, h),
        "This is the forward difference quotient, which uses only the point to the right.",
        "这是向前差商，只用了右侧的点。",
      ),
    );
  return numberProblem({
    prompt: t(
      `The table gives values of a differentiable function $f$.\n\n${table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...ys.map((v) => `$${v}$`)])}\n\nUse a ${name.en} difference quotient with the values in the table to estimate $f'(${xs[j]})$.`,
      `下表给出可导函数 $f$ 的一些值。\n\n${table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...ys.map((v) => `$${v}$`)])}\n\n用表中的值和${name["zh-CN"]}差商估计 $f'(${xs[j]})$。`,
    ),
    answer,
    mistakes: firsts(mistakes),
    solution: walked(
      [
        [
          ["Choose the points", "选取点"],
          t(
            `A ${name.en} difference quotient at $${xs[j]}$ uses ${side.en}, so the inputs are $${xs[lo]}$ and $${xs[hi]}$, $${w}$ apart.`,
            `在 $${xs[j]}$ 处的${name["zh-CN"]}差商使用${side["zh-CN"]}，所以两个输入值是 $${xs[lo]}$ 和 $${xs[hi]}$，相距 $${w}$。`,
          ),
        ],
        [
          ["Divide the change in f by the change in x", "用 f 的变化量除以 x 的变化量"],
          t("Read the values from the table:", "从表中读出函数值："),
          [
            `f'(${xs[j]}) \\approx \\frac{f(${xs[hi]}) - f(${xs[lo]})}{${xs[hi]} - ${par(xs[lo]!)}} = \\frac{${ys[hi]} - ${par(ys[lo]!)}}{${w}} = ${L(answer)}`,
          ],
        ],
      ],
      t(
        `Start at $f(${xs[lo]}) = ${ys[lo]}$ and go $${w}$ units to the right at a slope of $${L(answer)}$: $${ys[lo]} + ${w} \\cdot ${answer.sign() < 0 ? `\\left(${L(answer)}\\right)` : L(answer)} = ${ys[hi]}$, the value the table gives at $x = ${xs[hi]}$.`,
        `从 $f(${xs[lo]}) = ${ys[lo]}$ 出发，以斜率 $${L(answer)}$ 向右走 $${w}$ 个单位：$${ys[lo]} + ${w} \\cdot ${answer.sign() < 0 ? `\\left(${L(answer)}\\right)` : L(answer)} = ${ys[hi]}$，正是表中 $x = ${xs[hi]}$ 处的值。`,
      ),
    ),
  });
}

/** quotientFromFormula evaluates a difference quotient of a polynomial with a small step. */
function quotientFromFormula(rng: Rng, kind: Quotient): Problem {
  const quadratic = rng.bool();
  const p: Poly = quadratic
    ? [rng.int(-5, 5), rng.int(-5, 5), rng.nonZero(-3, 3)]
    : [rng.int(-3, 3), rng.int(-3, 3), 0, rng.nonZero(-2, 2)];
  const a = Q.of(rng.int(-3, 4));
  const h = rng.pick([Q.of(1, 10), Q.of(1, 100), Q.of(1, 2), Q.of(1, 5)]);
  const [x1, x2, w] = quotientParts(kind, a, h);
  const [y1, y2] = [qAt(p, x1), qAt(p, x2)];
  const answer = y1.sub(y2).div(w);
  const exact = Q.of(pAt(pDer(p), a.toNumber()));
  const name = quotientName(kind);
  const error = answer.sub(exact);
  const lead = Q.of(quadratic ? p[2]! : p[3]!);
  const errorFormula = quadratic
    ? { forward: "Ah", backward: "-Ah", central: "0" }[kind]
    : { forward: "3Aah + Ah^{2}", backward: "-3Aah + Ah^{2}", central: "Ah^{2}" }[kind];
  const mistakes = [
    why(
      exact,
      `This is the exact derivative $f'(${L(a)})$. The question asks for the estimate the ${name.en} difference quotient gives.`,
      `这是导数的精确值 $f'(${L(a)})$。题目要求的是${name["zh-CN"]}差商给出的估计值。`,
    ),
    why(
      y1.sub(y2),
      `This is the difference $f(${decimal(x1)}) - f(${decimal(x2)})$ without dividing by $${decimal(w)}$.`,
      `这只是差 $f(${decimal(x1)}) - f(${decimal(x2)})$，没有除以 $${decimal(w)}$。`,
    ),
    kind === "central"
      ? why(
          y1.sub(y2).div(h),
          `This divides by $h = ${decimal(h)}$, but the two inputs are $2h = ${decimal(w)}$ apart.`,
          `这里除以了 $h = ${decimal(h)}$，但两个输入值相距 $2h = ${decimal(w)}$。`,
        )
      : why(
          y1.sub(y2).div(h.add(h)),
          `This divides by $2h$, as for a central difference quotient, but the two inputs are only $h = ${decimal(h)}$ apart.`,
          `这像中心差商那样除以了 $2h$，但两个输入值只相距 $h = ${decimal(h)}$。`,
        ),
  ];
  return numberProblem({
    prompt: t(
      `Let $f(x) = ${pLatex(p)}$. Estimate $f'(${L(a)})$ with a ${name.en} difference quotient $${quotientFormula[kind]}$, using $h = ${decimal(h)}$.`,
      `设 $f(x) = ${pLatex(p)}$。用${name["zh-CN"]}差商 $${quotientFormula[kind]}$ 估计 $f'(${L(a)})$，取 $h = ${decimal(h)}$。`,
    ),
    answer,
    form: "decimal",
    mistakes: firsts(mistakes),
    solution: walked(
      [
        [
          ["Evaluate f at the two inputs", "计算两个输入处的 f"],
          t(
            `With $a = ${L(a)}$ and $h = ${decimal(h)}$, the inputs are $${decimal(x1)}$ and $${decimal(x2)}$:`,
            `取 $a = ${L(a)}$，$h = ${decimal(h)}$，两个输入值是 $${decimal(x1)}$ 和 $${decimal(x2)}$：`,
          ),
          [`f(${decimal(x1)}) = ${decimal(y1)}, \\qquad f(${decimal(x2)}) = ${decimal(y2)}`],
        ],
        [
          ["Divide by the width", "除以宽度"],
          t(`The inputs are $${decimal(w)}$ apart:`, `两个输入值相距 $${decimal(w)}$：`),
          [`\\frac{${decimal(y1)} - ${pd(y2)}}{${decimal(w)}} = ${decimal(answer)}`],
        ],
      ],
      t(
        `Compare with the derivative. $f'(x) = ${pLatex(pDer(p))}$, so $f'(${L(a)}) = ${L(exact)}$. For $f(x) = ${quadratic ? "Ax^{2} + Bx + C" : "Ax^{3} + Bx + C"}$ the ${name.en} quotient is exactly $f'(a) + ${errorFormula === "0" ? "0" : `(${errorFormula})`}$, with $A = ${L(lead)}$ this is $${L(exact)} + ${pd(error)} = ${decimal(answer)}$, as found. ${error.isZero() ? "Here the estimate has no error at all." : `The estimate is off by $${decimal(error)}$, which is small because $h$ is small.`}`,
        `与导数比较。$f'(x) = ${pLatex(pDer(p))}$，所以 $f'(${L(a)}) = ${L(exact)}$。对 $f(x) = ${quadratic ? "Ax^{2} + Bx + C" : "Ax^{3} + Bx + C"}$，${name["zh-CN"]}差商恰好等于 $f'(a) + ${errorFormula === "0" ? "0" : `(${errorFormula})`}$，取 $A = ${L(lead)}$，这里是 $${L(exact)} + ${pd(error)} = ${decimal(answer)}$，与所求一致。${error.isZero() ? "这里估计值完全没有误差。" : `估计值偏差 $${decimal(error)}$，因为 $h$ 很小，偏差也很小。`}`,
      ),
    ),
  });
}

/** estimatingDerivativesUsingAForwardDifferenceQuotient estimates derivatives with forward differences. */
export const estimatingDerivativesUsingAForwardDifferenceQuotient: TopicDef = {
  id: "estimating-derivatives-using-a-forward-difference-quotient",
  title: t("Estimating Derivatives Using a Forward Difference Quotient", "用向前差商估计导数"),
  summary: t(
    "Estimate a derivative with the forward difference quotient (f(a + h) − f(a))/h.",
    "用向前差商 (f(a + h) − f(a))/h 估计导数。",
  ),
  intro: t(
    "When we only have a few values of a function, we cannot differentiate a formula, but we can still estimate a derivative by the slope of a short secant line. If $f(3) = 9$ and $f(3.1) = 9.61$, the slope from $x = 3$ to $x = 3.1$ is $\\frac{9.61 - 9}{0.1} = 6.1$, an estimate of $f'(3)$.\n\nCheck: these are values of $f(x) = x^{2}$, and $f'(3) = 2(3) = 6$, close to the estimate $6.1$.\n\nIn this lesson we estimate derivatives with the forward difference quotient $\\frac{f(a + h) - f(a)}{h}$, from tables and from formulas.",
    "只有函数的几个值时，无法对公式求导，但仍可以用一小段割线的斜率估计导数。若 $f(3) = 9$，$f(3.1) = 9.61$，则从 $x = 3$ 到 $x = 3.1$ 的斜率为 $\\frac{9.61 - 9}{0.1} = 6.1$，这是 $f'(3)$ 的估计值。\n\n检验：这些是 $f(x) = x^{2}$ 的值，而 $f'(3) = 2(3) = 6$，与估计值 $6.1$ 接近。\n\n本课我们用向前差商 $\\frac{f(a + h) - f(a)}{h}$ 估计导数，数据来自表格或公式。",
  ),
  prerequisites: ["calculating-derivatives-from-data-and-tables"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "forward-difference-quotients-from-tables",
      title: t("Forward difference quotients from tables", "由表格计算向前差商"),
      explanation: t(
        "For small $h$, $f'(a) \\approx \\frac{f(a + h) - f(a)}{h}$, the slope of the secant line from $a$ to the next point to its right. From a table, use the next listed input as $a + h$. If $f(4) = 10$ and $f(6) = 16$ are neighbors in a table, $f'(4) \\approx \\frac{16 - 10}{6 - 4} = 3$.\n\nCheck: going $2$ units right from $(4, 10)$ at slope $3$ rises $2 \\times 3 = 6$, reaching $16$, the next value in the table.\n\n> **Watch out.** Divide by the change in $x$, which is the gap between the listed inputs and need not be $1$. And subtract in the same order on top and bottom.",
        "当 $h$ 很小时，$f'(a) \\approx \\frac{f(a + h) - f(a)}{h}$，即从 $a$ 到其右侧下一点的割线斜率。由表格估计时，取表中下一个输入值作为 $a + h$。若表中相邻的值为 $f(4) = 10$，$f(6) = 16$，则 $f'(4) \\approx \\frac{16 - 10}{6 - 4} = 3$。\n\n检验：从 $(4, 10)$ 出发以斜率 $3$ 向右走 $2$ 个单位，上升 $2 \\times 3 = 6$，到达 $16$，正是表中的下一个值。\n\n> **注意。** 要除以 $x$ 的变化量，即表中相邻输入值的间隔，它不一定是 $1$。分子分母的相减顺序要一致。",
      ),
      generate: (rng) => quotientFromTable(rng, "forward"),
    },
    {
      id: "forward-difference-quotients-from-formulas",
      title: t("Forward difference quotients from formulas", "由公式计算向前差商"),
      explanation: t(
        "A forward difference quotient is the slope of a secant line to a nearby point on the right, which estimates the derivative when the step is small. Evaluate $f(a + h)$ and $f(a)$ exactly, subtract and divide by $h$. For $f(x) = x^{2}$, $a = 3$ and $h = 0.1$: $\\frac{9.61 - 9}{0.1} = 6.1$.\n\nCheck: $f'(3) = 6$, and for $f(x) = x^{2}$ the forward quotient is exactly $2a + h = 6 + 0.1 = 6.1$.\n\n> **Watch out.** Divide by $h$ itself, not by $2h$; and evaluate $f(a + h)$ exactly before subtracting, since rounding it first can wipe out the small difference.",
        "向前差商是到右侧邻近点的割线斜率，当步长很小时，它可以估计导数。精确计算 $f(a + h)$ 和 $f(a)$，相减后除以 $h$。对 $f(x) = x^{2}$，$a = 3$，$h = 0.1$：$\\frac{9.61 - 9}{0.1} = 6.1$。\n\n检验：$f'(3) = 6$，而对 $f(x) = x^{2}$，向前差商恰好是 $2a + h = 6 + 0.1 = 6.1$。\n\n> **注意。** 除以 $h$ 本身，不是 $2h$；相减前要精确算出 $f(a + h)$，先取近似可能把这个很小的差抹掉。",
      ),
      generate: (rng) => quotientFromFormula(rng, "forward"),
    },
  ],
};

/** estimatingDerivativesUsingABackwardDifferenceQuotient estimates derivatives with backward differences. */
export const estimatingDerivativesUsingABackwardDifferenceQuotient: TopicDef = {
  id: "estimating-derivatives-using-a-backward-difference-quotient",
  title: t("Estimating Derivatives Using a Backward Difference Quotient", "用向后差商估计导数"),
  summary: t(
    "Estimate a derivative with the backward difference quotient (f(a) − f(a − h))/h.",
    "用向后差商 (f(a) − f(a − h))/h 估计导数。",
  ),
  intro: t(
    "Sometimes the next value is not known yet: a reading taken now can only be compared with the one before it. The secant line to the point on the left gives an estimate too. For $f(x) = x^{2}$, $\\frac{f(3) - f(2.9)}{0.1} = \\frac{9 - 8.41}{0.1} = 5.9$ estimates $f'(3)$.\n\nCheck: $f'(3) = 6$, and the forward estimate $6.1$ lies on the other side of it: the true slope is between the two.\n\nIn this lesson we estimate derivatives with the backward difference quotient $\\frac{f(a) - f(a - h)}{h}$, from tables and from formulas.",
    "有时下一个值还不知道：现在测得的读数只能和前一个读数比较。到左侧点的割线也能给出估计。对 $f(x) = x^{2}$，$\\frac{f(3) - f(2.9)}{0.1} = \\frac{9 - 8.41}{0.1} = 5.9$ 是 $f'(3)$ 的估计值。\n\n检验：$f'(3) = 6$，而向前估计值 $6.1$ 位于它的另一侧：真实斜率介于两者之间。\n\n本课我们用向后差商 $\\frac{f(a) - f(a - h)}{h}$ 估计导数，数据来自表格或公式。",
  ),
  prerequisites: ["estimating-derivatives-using-a-forward-difference-quotient"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "backward-difference-quotients-from-tables",
      title: t("Backward difference quotients from tables", "由表格计算向后差商"),
      explanation: t(
        "$f'(a) \\approx \\frac{f(a) - f(a - h)}{h}$ uses the point to the left of $a$. From a table, use the previous listed input as $a - h$. If $f(4) = 10$ and $f(6) = 16$ are neighbors, the backward estimate of $f'(6)$ is $\\frac{16 - 10}{6 - 4} = 3$.\n\nCheck: going $2$ units left from $(6, 16)$ at slope $3$ falls $2 \\times 3 = 6$, reaching $10$, the previous value in the table.\n\n> **Watch out.** The backward quotient at $a$ uses $a$ and the input before it, not the input after it. Keep the later value first on top, so that the slope has the right sign.",
        "$f'(a) \\approx \\frac{f(a) - f(a - h)}{h}$ 使用 $a$ 左侧的点。由表格估计时，取表中前一个输入值作为 $a - h$。若相邻的值为 $f(4) = 10$，$f(6) = 16$，则 $f'(6)$ 的向后估计值为 $\\frac{16 - 10}{6 - 4} = 3$。\n\n检验：从 $(6, 16)$ 出发以斜率 $3$ 向左走 $2$ 个单位，下降 $2 \\times 3 = 6$，到达 $10$，正是表中的前一个值。\n\n> **注意。** $a$ 处的向后差商用 $a$ 和它前面的输入值，不用它后面的输入值。分子中较后的值放在前面，斜率的符号才对。",
      ),
      generate: (rng) => quotientFromTable(rng, "backward"),
    },
    {
      id: "backward-difference-quotients-from-formulas",
      title: t("Backward difference quotients from formulas", "由公式计算向后差商"),
      explanation: t(
        "A backward difference quotient uses a nearby point on the left instead, and for a curve that bends one way the two estimates lie on opposite sides of the true slope. For $f(x) = x^{2}$, $a = 3$ and $h = 0.1$: $\\frac{9 - 8.41}{0.1} = 5.9$. The forward estimate $6.1$ and the backward estimate $5.9$ lie on either side of $f'(3) = 6$.\n\nCheck: for $f(x) = x^{2}$ the backward quotient is exactly $2a - h = 6 - 0.1 = 5.9$.\n\n> **Watch out.** $f(a - h)$ is the value at the smaller input, so it is subtracted: $f(a) - f(a - h)$, divided by $h$, not by $-h$.",
        "向后差商改用左侧的邻近点；对于向同一方向弯曲的曲线，两个估计值位于真实斜率的两侧。对 $f(x) = x^{2}$，$a = 3$，$h = 0.1$：$\\frac{9 - 8.41}{0.1} = 5.9$。向前估计值 $6.1$ 与向后估计值 $5.9$ 分别位于 $f'(3) = 6$ 的两侧。\n\n检验：对 $f(x) = x^{2}$，向后差商恰好是 $2a - h = 6 - 0.1 = 5.9$。\n\n> **注意。** $f(a - h)$ 是较小输入处的值，所以它被减去：$f(a) - f(a - h)$，再除以 $h$，不是除以 $-h$。",
      ),
      generate: (rng) => quotientFromFormula(rng, "backward"),
    },
  ],
};

/** estimatingDerivativesUsingACentralDifferenceQuotient estimates derivatives with central differences. */
export const estimatingDerivativesUsingACentralDifferenceQuotient: TopicDef = {
  id: "estimating-derivatives-using-a-central-difference-quotient",
  title: t("Estimating Derivatives Using a Central Difference Quotient", "用中心差商估计导数"),
  summary: t(
    "Estimate a derivative with the central difference quotient (f(a + h) − f(a − h))/(2h).",
    "用中心差商 (f(a + h) − f(a − h))/(2h) 估计导数。",
  ),
  intro: t(
    "The forward estimate of $f'(3)$ for $f(x) = x^{2}$ with $h = 0.1$ is $6.1$, and the backward estimate is $5.9$. Their average, $6$, is far better than either. That average is the slope of the secant line from $2.9$ to $3.1$: $\\frac{9.61 - 8.41}{0.2} = 6$.\n\nCheck: $f'(3) = 2(3) = 6$ exactly.\n\nIn this lesson we estimate derivatives with the central difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$, from tables and from formulas.",
    "对 $f(x) = x^{2}$ 取 $h = 0.1$，$f'(3)$ 的向前估计值是 $6.1$，向后估计值是 $5.9$。它们的平均值 $6$ 比两者都好得多。这个平均值就是从 $2.9$ 到 $3.1$ 的割线斜率：$\\frac{9.61 - 8.41}{0.2} = 6$。\n\n检验：$f'(3) = 2(3) = 6$，完全相等。\n\n本课我们用中心差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 估计导数，数据来自表格或公式。",
  ),
  prerequisites: ["estimating-derivatives-using-a-backward-difference-quotient"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "central-difference-quotients-from-tables",
      title: t("Central difference quotients from tables", "由表格计算中心差商"),
      explanation: t(
        "$f'(a) \\approx \\frac{f(a + h) - f(a - h)}{2h}$ uses points on both sides of $a$; it is the average of the forward and backward estimates and is usually more accurate. If $f(2) = 7$, $f(4) = 10$ and $f(6) = 16$, then $f'(4) \\approx \\frac{16 - 7}{6 - 2} = \\frac{9}{4}$.\n\nCheck: the backward estimate is $\\frac{10 - 7}{2} = \\frac{3}{2}$ and the forward estimate is $\\frac{16 - 10}{2} = 3$; their average is $\\frac{1}{2}\\left(\\frac{3}{2} + 3\\right) = \\frac{9}{4}$.\n\n> **Watch out.** The width of the interval is $2h$, the distance between the two outer inputs, not $h$. The value at $a$ itself is not used.",
        "$f'(a) \\approx \\frac{f(a + h) - f(a - h)}{2h}$ 使用 $a$ 两侧的点；它是向前与向后估计值的平均，通常更准确。若 $f(2) = 7$，$f(4) = 10$，$f(6) = 16$，则 $f'(4) \\approx \\frac{16 - 7}{6 - 2} = \\frac{9}{4}$。\n\n检验：向后估计值为 $\\frac{10 - 7}{2} = \\frac{3}{2}$，向前估计值为 $\\frac{16 - 10}{2} = 3$；它们的平均值为 $\\frac{1}{2}\\left(\\frac{3}{2} + 3\\right) = \\frac{9}{4}$。\n\n> **注意。** 区间的宽度是两端输入值之间的距离 $2h$，不是 $h$。$a$ 处本身的值用不到。",
      ),
      generate: (rng) => quotientFromTable(rng, "central"),
    },
    {
      id: "central-difference-quotients-from-formulas",
      title: t("Central difference quotients from formulas", "由公式计算中心差商"),
      explanation: t(
        "The central difference quotient uses points on both sides, so their errors largely cancel and it is usually much more accurate than either one-sided estimate. For $f(x) = x^{3}$, $a = 1$ and $h = 0.1$: $\\frac{1.331 - 0.729}{0.2} = 3.01$, close to $f'(1) = 3$.\n\nCheck: for $f(x) = x^{3}$ the central quotient is exactly $3a^{2} + h^{2} = 3 + 0.01 = 3.01$. For a quadratic the central quotient has no error at all.\n\n> **Watch out.** Divide by $2h$, the distance from $a - h$ to $a + h$. Dividing by $h$ doubles the estimate.",
        "中心差商使用两侧的点，误差大部分相互抵消，所以通常比任何一侧的估计都准确得多。对 $f(x) = x^{3}$，$a = 1$，$h = 0.1$：$\\frac{1.331 - 0.729}{0.2} = 3.01$，接近 $f'(1) = 3$。\n\n检验：对 $f(x) = x^{3}$，中心差商恰好是 $3a^{2} + h^{2} = 3 + 0.01 = 3.01$。对二次函数，中心差商完全没有误差。\n\n> **注意。** 要除以 $a - h$ 到 $a + h$ 的距离 $2h$。除以 $h$ 会使估计值加倍。",
      ),
      generate: (rng) => quotientFromFormula(rng, "central"),
    },
  ],
};

/** pv evaluates a polynomial at a number. */
const pv = (p: Poly, x: number) => p.reduce((s, c, i) => s + c * x ** i, 0);

/** introductionToRelatedRates relates rates of quantities linked by an equation. */
export const introductionToRelatedRates: TopicDef = {
  id: "introduction-to-related-rates",
  title: t("Introduction to Related Rates", "相关变化率简介"),
  summary: t(
    "Differentiate an equation linking two quantities with respect to time to relate their rates.",
    "把联系两个量的方程对时间求导，得到它们变化率之间的关系。",
  ),
  intro: t(
    "The side of a square metal plate grows at $0.5$ cm/s as it is heated. How fast does its area grow when the side is $10$ cm? The area is $A = s^{2}$, and both $A$ and $s$ depend on time, so by the chain rule $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(10)(0.5) = 10$ cm²/s.\n\nCheck: a tenth of a second later the side is $10.05$ cm and the area $101.0025$ cm², an increase of $1.0025$ cm² in $0.1$ s, about $10$ cm²/s.\n\nIn this lesson we differentiate an equation linking two quantities with respect to time, and use the result to find one rate from the other.",
    "金属方板受热时边长以 $0.5$ cm/s 的速率增大。当边长为 $10$ cm 时，它的面积增大得多快？面积 $A = s^{2}$，$A$ 和 $s$ 都依赖于时间，由链式法则 $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(10)(0.5) = 10$ cm²/s。\n\n检验：十分之一秒后边长为 $10.05$ cm，面积为 $101.0025$ cm²，在 $0.1$ s 内增加了 $1.0025$ cm²，约为 $10$ cm²/s。\n\n本课我们把联系两个量的方程对时间求导，并用所得结果由一个变化率求出另一个。",
  ),
  prerequisites: ["implicit-differentiation", "rates-of-change-in-applied-contexts"],
  encompasses: [
    { topic: "implicit-differentiation", weight: 0.3 },
    { topic: "the-chain-rule-for-differentiation", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-a-related-rate",
      title: t("Finding a related rate", "求相关变化率"),
      explanation: t(
        "When two quantities are linked by an equation and both change with time, differentiating the equation with respect to time links their rates of change. If $x$ and $y$ both depend on $t$ and $y = f(x)$, the chain rule gives\n\n$$\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}.$$\n\nFor $y = x^{3}$ with $\\frac{dx}{dt} = 2$ when $x = 1$: $\\frac{dy}{dt} = 3(1)^{2}(2) = 6$.\n\nCheck: if $x$ moves from $1$ to $1.001$ in $0.0005$ units of time, $y$ moves from $1$ to $1.001^{3} \\approx 1.003$, a rate of about $\\frac{0.003}{0.0005} = 6$.\n\n> **Watch out.** Evaluate $f'$ at the value of $x$, then multiply by $\\frac{dx}{dt}$. Leaving out $\\frac{dx}{dt}$ gives $\\frac{dy}{dx}$, not $\\frac{dy}{dt}$.",
        "当两个量由一个方程联系并都随时间变化时，把方程对时间求导，就把它们的变化率联系起来了。若 $x$ 和 $y$ 都依赖于 $t$，且 $y = f(x)$，则由链式法则\n\n$$\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}.$$\n\n对 $y = x^{3}$，当 $x = 1$ 时 $\\frac{dx}{dt} = 2$：$\\frac{dy}{dt} = 3(1)^{2}(2) = 6$。\n\n检验：若 $x$ 在 $0.0005$ 个单位时间内从 $1$ 变到 $1.001$，则 $y$ 从 $1$ 变到 $1.001^{3} \\approx 1.003$，变化率约为 $\\frac{0.003}{0.0005} = 6$。\n\n> **注意。** 先在 $x$ 的值处计算 $f'$，再乘以 $\\frac{dx}{dt}$。漏掉 $\\frac{dx}{dt}$ 得到的是 $\\frac{dy}{dx}$，不是 $\\frac{dy}{dt}$。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const x0 = rng.int(-3, 3);
        const r = rng.nonZero(-5, 5);
        const d = pAt(pDer(p), x0);
        const answer = d * r;
        const dt = 0.001;
        const step = (pv(p, x0 + r * dt) - pv(p, x0)) / dt;
        return numberProblem({
          prompt: t(
            `$x$ and $y$ are functions of $t$ with $y = ${pLatex(p)}$. Find $\\frac{dy}{dt}$ when $x = ${x0}$ and $\\frac{dx}{dt} = ${r}$.`,
            `$x$ 和 $y$ 都是 $t$ 的函数，且 $y = ${pLatex(p)}$。当 $x = ${x0}$，$\\frac{dx}{dt} = ${r}$ 时，求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              d,
              `This is $\\frac{dy}{dx}$ at $x = ${x0}$: it still has to be multiplied by $\\frac{dx}{dt} = ${r}$.`,
              `这是 $x = ${x0}$ 处的 $\\frac{dy}{dx}$：还要乘以 $\\frac{dx}{dt} = ${r}$。`,
            ),
            why(
              pAt(p, x0) * r,
              `This multiplies the value $y = ${pAt(p, x0)}$ by $\\frac{dx}{dt}$. The chain rule uses the derivative $\\frac{dy}{dx}$, not $y$.`,
              `这是用 $y$ 的值 $${pAt(p, x0)}$ 乘以 $\\frac{dx}{dt}$。链式法则用的是导数 $\\frac{dy}{dx}$，不是 $y$。`,
            ),
            why(
              pAt(pDer(p), r),
              `This evaluates the derivative at $x = ${r}$, the rate, instead of at the position $x = ${x0}$.`,
              `这是在 $x = ${r}$（变化率的值）处计算导数，而不是在位置 $x = ${x0}$ 处。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with respect to t", "对 t 求导"],
                t("By the chain rule,", "由链式法则，"),
                [`\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}`],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `At $x = ${x0}$ the bracket is $${d}$, and $\\frac{dx}{dt} = ${r}$:`,
                  `在 $x = ${x0}$ 处括号内为 $${d}$，且 $\\frac{dx}{dt} = ${r}$：`,
                ),
                [`\\frac{dy}{dt} = ${d} \\cdot ${par(r)} = ${answer}`],
              ],
            ],
            t(
              `Let $x$ change at $${r}$ for a short time $0.001$: it moves from $${x0}$ to $${fmt(x0 + r * dt)}$, and $y$ moves from $${pv(p, x0)}$ to $${fmt(pv(p, x0 + r * dt))}$. The rate is about $${fmt(step)}$, close to $${answer}$.`,
              `让 $x$ 以 $${r}$ 的速率变化一小段时间 $0.001$：$x$ 从 $${x0}$ 变到 $${fmt(x0 + r * dt)}$，$y$ 从 $${pv(p, x0)}$ 变到 $${fmt(pv(p, x0 + r * dt))}$。变化率约为 $${fmt(step)}$，接近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-for-an-unknown-rate",
      title: t("Solving for an unknown rate", "求未知的变化率"),
      explanation: t(
        "After differentiating, substitute every value you know at that moment, and the equation that remains can be solved for the rate you want. The same equation can be solved for either rate. If $y = x^{2} + 1$ and $\\frac{dy}{dt} = 12$ when $x = 3$, then $12 = 2(3)\\frac{dx}{dt}$, so $\\frac{dx}{dt} = 2$.\n\nCheck: with $\\frac{dx}{dt} = 2$, the chain rule gives $\\frac{dy}{dt} = 2(3)(2) = 12$, the rate we were given.\n\n> **Watch out.** Divide by $f'(x)$ to undo the multiplication; do not multiply again, and do not turn the fraction upside down.",
        "求导后，代入那一时刻所有已知的值，剩下的方程就可以解出所求的变化率。同一个方程可以解出任一个变化率。若 $y = x^{2} + 1$，当 $x = 3$ 时 $\\frac{dy}{dt} = 12$，则 $12 = 2(3)\\frac{dx}{dt}$，所以 $\\frac{dx}{dt} = 2$。\n\n检验：取 $\\frac{dx}{dt} = 2$，由链式法则 $\\frac{dy}{dt} = 2(3)(2) = 12$，正是已知的变化率。\n\n> **注意。** 要除以 $f'(x)$ 来消去乘法；不要再乘一次，也不要把分数颠倒。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        let x0 = rng.int(-4, 4);
        while (pAt(pDer(p), x0) === 0) x0 += 1;
        const s = rng.nonZero(-20, 20);
        const d = pAt(pDer(p), x0);
        const answer = Q.of(s, d);
        const dText = d === 1 ? "" : d === -1 ? "-" : `${d}`;
        return numberProblem({
          prompt: t(
            `$x$ and $y$ are functions of $t$ with $y = ${pLatex(p)}$. Find $\\frac{dx}{dt}$ when $x = ${x0}$ and $\\frac{dy}{dt} = ${s}$.`,
            `$x$ 和 $y$ 都是 $t$ 的函数，且 $y = ${pLatex(p)}$。当 $x = ${x0}$，$\\frac{dy}{dt} = ${s}$ 时，求 $\\frac{dx}{dt}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              s * d,
              `This multiplies $\\frac{dy}{dt}$ by $\\frac{dy}{dx} = ${d}$. Since $\\frac{dy}{dt} = ${d}\\frac{dx}{dt}$, divide by $${d}$ instead.`,
              `这是用 $\\frac{dy}{dt}$ 乘以 $\\frac{dy}{dx} = ${d}$。由 $\\frac{dy}{dt} = ${d}\\frac{dx}{dt}$，应该除以 $${d}$。`,
            ),
            why(Q.of(d, s), "This is the fraction turned upside down.", "这是把分数颠倒了。"),
            why(
              answer.neg(),
              `The sign is lost: $\\frac{dx}{dt}$ has the sign of $\\frac{${s}}{${d}}$.`,
              `丢了符号：$\\frac{dx}{dt}$ 的符号与 $\\frac{${s}}{${d}}$ 相同。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with respect to t", "对 t 求导"],
                t("By the chain rule,", "由链式法则，"),
                [`\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}`],
              ],
              [
                ["Substitute and solve", "代入并求解"],
                t(
                  `At $x = ${x0}$ the bracket is $${d}$; put in $\\frac{dy}{dt} = ${s}$ and divide:`,
                  `在 $x = ${x0}$ 处括号内为 $${d}$；代入 $\\frac{dy}{dt} = ${s}$ 后相除：`,
                ),
                [`${s} = ${dText}\\frac{dx}{dt}, \\qquad \\frac{dx}{dt} = ${L(answer)}`],
              ],
            ],
            t(
              `Put the rate back: $${d} \\cdot ${answer.sign() < 0 ? `\\left(${L(answer)}\\right)` : L(answer)} = ${s}$, the given $\\frac{dy}{dt}$.`,
              `把变化率代回：$${d} \\cdot ${answer.sign() < 0 ? `\\left(${L(answer)}\\right)` : L(answer)} = ${s}$，正是已知的 $\\frac{dy}{dt}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** triples are Pythagorean triples. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
  [8, 15, 17],
  [15, 8, 17],
  [9, 12, 15],
  [12, 9, 15],
  [7, 24, 25],
  [24, 7, 25],
];

/** relatedRatesWithImplicitFunctions relates rates of x and y on implicit curves. */
export const relatedRatesWithImplicitFunctions: TopicDef = {
  id: "related-rates-with-implicit-functions",
  title: t("Related Rates With Implicit Functions", "隐函数的相关变化率"),
  summary: t(
    "Differentiate an equation in x and y with respect to time to relate dx/dt and dy/dt.",
    "把关于 x 和 y 的方程对时间求导，联系 dx/dt 与 dy/dt。",
  ),
  intro: t(
    "A point moves around the circle $x^{2} + y^{2} = 25$. At $(3, 4)$ the radius to the point has slope $\\frac{4}{3}$, and the point moves along the tangent, at right angles to the radius, so its direction has slope $-\\frac{3}{4}$. If $x$ grows at $2$ units per second, $y$ changes at $-\\frac{3}{4} \\cdot 2 = -\\frac{3}{2}$ units per second.\n\nCheck: differentiating $x^{2} + y^{2} = 25$ with respect to time gives $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$, and $2(3)(2) + 2(4)\\left(-\\frac{3}{2}\\right) = 12 - 12 = 0$.\n\nIn this lesson we differentiate equations in $x$ and $y$ with respect to time, with the chain rule and the product rule, and solve for the unknown rate.",
    "一点沿圆 $x^{2} + y^{2} = 25$ 运动。在 $(3, 4)$ 处，到该点的半径斜率为 $\\frac{4}{3}$，点沿切线方向运动，与半径垂直，所以运动方向的斜率为 $-\\frac{3}{4}$。若 $x$ 以每秒 $2$ 个单位增大，则 $y$ 以每秒 $-\\frac{3}{4} \\cdot 2 = -\\frac{3}{2}$ 个单位变化。\n\n检验：把 $x^{2} + y^{2} = 25$ 对时间求导，得 $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$，而 $2(3)(2) + 2(4)\\left(-\\frac{3}{2}\\right) = 12 - 12 = 0$。\n\n本课我们用链式法则和乘积法则把关于 $x$ 和 $y$ 的方程对时间求导，并解出未知的变化率。",
  ),
  prerequisites: ["introduction-to-related-rates"],
  encompasses: [
    { topic: "introduction-to-related-rates", weight: 0.4 },
    { topic: "implicit-differentiation", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "related-rates-on-circles",
      figure: calculusDrawings2["related-rates-with-implicit-functions#related-rates-on-circles"],
      title: t("Related rates on circles", "圆上的相关变化率"),
      explanation: t(
        "For a point moving on a curve, differentiate the equation of the curve with respect to time, then substitute the position and the known rate. A point moves on $x^{2} + y^{2} = 25$. Differentiating with respect to $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. At $(3, 4)$ with $\\frac{dx}{dt} = 2$: $2(3)(2) + 2(4)\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -\\frac{3}{2}$.\n\nCheck: the tangent at $(3, 4)$ has slope $-\\frac{3}{4}$, and the point moves along it, so $\\frac{dy}{dt} = -\\frac{3}{4} \\cdot 2 = -\\frac{3}{2}$.\n\n> **Watch out.** $y^{2}$ differentiates to $2y\\frac{dy}{dt}$, not $2y$, and the constant $25$ to $0$. Keep $x$ and $y$ in their places: $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$.",
        "对于沿曲线运动的点，把曲线方程对时间求导，再代入位置和已知的变化率。一点在 $x^{2} + y^{2} = 25$ 上运动。对 $t$ 求导：$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$。在 $(3, 4)$ 处且 $\\frac{dx}{dt} = 2$ 时：$2(3)(2) + 2(4)\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -\\frac{3}{2}$。\n\n检验：$(3, 4)$ 处切线的斜率为 $-\\frac{3}{4}$，点沿切线运动，所以 $\\frac{dy}{dt} = -\\frac{3}{4} \\cdot 2 = -\\frac{3}{2}$。\n\n> **注意。** $y^{2}$ 的导数是 $2y\\frac{dy}{dt}$，不是 $2y$；常数 $25$ 的导数是 $0$。$x$ 与 $y$ 的位置不要弄反：$\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$。",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick(triples);
        const x0 = a * rng.sign();
        const y0 = b * rng.sign();
        const r = rng.nonZero(-6, 6);
        const answer = Q.of(-x0 * r, y0);
        const slope = Q.of(-x0, y0);
        return numberProblem({
          prompt: t(
            `A point moves along the circle $x^{2} + y^{2} = ${c * c}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
            `一点沿圆 $x^{2} + y^{2} = ${c * c}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              answer.neg(),
              "The minus sign is lost: moving $2x\\frac{dx}{dt}$ to the other side makes it negative.",
              "丢了负号：把 $2x\\frac{dx}{dt}$ 移到另一边要变号。",
            ),
            why(
              Q.of(-y0 * r, x0),
              "$x$ and $y$ are swapped: the equation gives $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$.",
              "$x$ 和 $y$ 弄反了：方程给出 $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$。",
            ),
            why(
              slope,
              `This is $\\frac{dy}{dx}$, the slope of the circle there; it still has to be multiplied by $\\frac{dx}{dt} = ${r}$.`,
              `这是 $\\frac{dy}{dx}$，即圆在该点的斜率；还要乘以 $\\frac{dx}{dt} = ${r}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with respect to t", "对 t 求导"],
                t("Differentiate both sides of the equation of the circle:", "对圆的方程两边求导："),
                [`2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0`],
              ],
              [
                ["Substitute and solve", "代入并求解"],
                t(
                  `Put in $x = ${x0}$, $y = ${y0}$ and $\\frac{dx}{dt} = ${r}$:`,
                  `代入 $x = ${x0}$，$y = ${y0}$，$\\frac{dx}{dt} = ${r}$：`,
                ),
                [`2(${x0})(${r}) + 2(${y0})\\frac{dy}{dt} = 0, \\qquad \\frac{dy}{dt} = ${L(answer)}`],
              ],
            ],
            t(
              `The tangent to the circle at $(${x0}, ${y0})$ is at right angles to the radius, whose slope is $${L(Q.of(y0, x0))}$, so the tangent has slope $${L(slope)}$. The point moves along it: $\\frac{dy}{dt} = ${L(slope)} \\cdot ${par(r)} = ${L(answer)}$.`,
              `圆在 $(${x0}, ${y0})$ 处的切线与半径垂直，半径的斜率为 $${L(Q.of(y0, x0))}$，所以切线的斜率为 $${L(slope)}$。点沿切线运动：$\\frac{dy}{dt} = ${L(slope)} \\cdot ${par(r)} = ${L(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "related-rates-on-other-curves",
      title: t("Related rates on other curves", "其他曲线上的相关变化率"),
      explanation: t(
        "Differentiate each term with respect to $t$, using the product rule where $x$ and $y$ are multiplied. On $xy = 12$: $\\frac{dx}{dt}y + x\\frac{dy}{dt} = 0$. At $(2, 6)$ with $\\frac{dx}{dt} = 1$: $6 + 2\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -3$.\n\nCheck: on this curve $y = \\frac{12}{x}$, so $\\frac{dy}{dx} = -\\frac{12}{x^{2}} = -3$ at $x = 2$, and $\\frac{dy}{dt} = -3 \\cdot 1 = -3$.\n\n> **Watch out.** $xy$ is a product of two changing quantities, so its derivative has two terms, $\\frac{dx}{dt}y + x\\frac{dy}{dt}$. A power of $y$ brings the factor $\\frac{dy}{dt}$: $\\frac{d}{dt}y^{3} = 3y^{2}\\frac{dy}{dt}$.",
        "对每一项关于 $t$ 求导，$x$ 与 $y$ 相乘时用乘积法则。在 $xy = 12$ 上：$\\frac{dx}{dt}y + x\\frac{dy}{dt} = 0$。在 $(2, 6)$ 处且 $\\frac{dx}{dt} = 1$ 时：$6 + 2\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -3$。\n\n检验：在这条曲线上 $y = \\frac{12}{x}$，所以在 $x = 2$ 处 $\\frac{dy}{dx} = -\\frac{12}{x^{2}} = -3$，$\\frac{dy}{dt} = -3 \\cdot 1 = -3$。\n\n> **注意。** $xy$ 是两个变化量的乘积，所以它的导数有两项：$\\frac{dx}{dt}y + x\\frac{dy}{dt}$。$y$ 的幂会带出因子 $\\frac{dy}{dt}$：$\\frac{d}{dt}y^{3} = 3y^{2}\\frac{dy}{dt}$。",
      ),
      generate(rng) {
        const x0 = rng.nonZero(-6, 6);
        const y0 = rng.nonZero(-6, 6);
        const r = rng.nonZero(-5, 5);
        if (rng.bool()) {
          const answer = Q.of(-y0 * r, x0);
          const c = x0 * y0;
          return numberProblem({
            prompt: t(
              `A point moves along the curve $xy = ${c}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
              `一点沿曲线 $xy = ${c}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
            ),
            answer,
            mistakes: firsts([
              why(
                answer.neg(),
                "The minus sign is lost when $y\\frac{dx}{dt}$ is moved to the other side.",
                "把 $y\\frac{dx}{dt}$ 移到另一边时丢了负号。",
              ),
              why(
                Q.of(-x0 * r, y0),
                "$x$ and $y$ are swapped: the equation gives $\\frac{dy}{dt} = -\\frac{y}{x}\\frac{dx}{dt}$.",
                "$x$ 和 $y$ 弄反了：方程给出 $\\frac{dy}{dt} = -\\frac{y}{x}\\frac{dx}{dt}$。",
              ),
              why(
                r * y0,
                "This is only the term $y\\frac{dx}{dt}$. By the product rule it is balanced by $x\\frac{dy}{dt}$, which still has to be solved for.",
                "这只是 $y\\frac{dx}{dt}$ 一项。由乘积法则，它与 $x\\frac{dy}{dt}$ 相抵，还要解出 $\\frac{dy}{dt}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate with respect to t", "对 t 求导"],
                  t("By the product rule,", "由乘积法则，"),
                  [`y\\frac{dx}{dt} + x\\frac{dy}{dt} = 0`],
                ],
                [
                  ["Substitute and solve", "代入并求解"],
                  t(
                    `Put in $x = ${x0}$, $y = ${y0}$ and $\\frac{dx}{dt} = ${r}$:`,
                    `代入 $x = ${x0}$，$y = ${y0}$，$\\frac{dx}{dt} = ${r}$：`,
                  ),
                  [`${y0} \\cdot ${par(r)} + ${par(x0)}\\frac{dy}{dt} = 0, \\qquad \\frac{dy}{dt} = ${L(answer)}`],
                ],
              ],
              t(
                `Solve the curve for $y$ instead: $y = \\frac{${c}}{x}$, so $\\frac{dy}{dx} = -\\frac{${c}}{x^{2}} = ${L(Q.of(-c, x0 * x0))}$ at $x = ${x0}$, and $\\frac{dy}{dt} = ${L(Q.of(-c, x0 * x0))} \\cdot ${par(r)} = ${L(answer)}$.`,
                `改为把曲线解成 $y$ 的表达式：$y = \\frac{${c}}{x}$，所以在 $x = ${x0}$ 处 $\\frac{dy}{dx} = -\\frac{${c}}{x^{2}} = ${L(Q.of(-c, x0 * x0))}$，$\\frac{dy}{dt} = ${L(Q.of(-c, x0 * x0))} \\cdot ${par(r)} = ${L(answer)}$。`,
              ),
            ),
          });
        }
        const k = rng.int(1, 3);
        const c = y0 * y0 * y0 - k * x0 * x0;
        const answer = Q.of(2 * k * x0 * r, 3 * y0 * y0);
        const dt = 0.001;
        const x1 = x0 + r * dt;
        const y1 = Math.cbrt(c + k * x1 * x1);
        return numberProblem({
          prompt: t(
            `A point moves along the curve $${poly([1, "y^{3}"], [-k, "x^{2}"])} = ${c}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
            `一点沿曲线 $${poly([1, "y^{3}"], [-k, "x^{2}"])} = ${c}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              answer.neg(),
              `The sign is wrong: moving $-${2 * k}x\\frac{dx}{dt}$ to the other side makes it positive.`,
              `符号错了：把 $-${2 * k}x\\frac{dx}{dt}$ 移到另一边要变为正。`,
            ),
            why(
              Q.of(2 * k * x0 * r, 3 * y0),
              "This differentiates $y^{3}$ to $3y\\frac{dy}{dt}$; the power rule gives $3y^{2}\\frac{dy}{dt}$.",
              "这把 $y^{3}$ 的导数算成了 $3y\\frac{dy}{dt}$；幂法则给出 $3y^{2}\\frac{dy}{dt}$。",
            ),
            why(
              Q.of(2 * k * x0, 3 * y0 * y0),
              `This is $\\frac{dy}{dx}$; it still has to be multiplied by $\\frac{dx}{dt} = ${r}$.`,
              `这是 $\\frac{dy}{dx}$；还要乘以 $\\frac{dx}{dt} = ${r}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with respect to t", "对 t 求导"],
                t("Each power brings out the rate of its variable:", "每个幂都带出其变量的变化率："),
                [`3y^{2}\\frac{dy}{dt} - ${2 * k}x\\frac{dx}{dt} = 0`],
              ],
              [
                ["Substitute and solve", "代入并求解"],
                t(
                  `Put in $x = ${x0}$, $y = ${y0}$ and $\\frac{dx}{dt} = ${r}$:`,
                  `代入 $x = ${x0}$，$y = ${y0}$，$\\frac{dx}{dt} = ${r}$：`,
                ),
                [`${3 * y0 * y0}\\frac{dy}{dt} = ${2 * k * x0 * r}, \\qquad \\frac{dy}{dt} = ${L(answer)}`],
              ],
            ],
            t(
              `Move along the curve for a short time $0.001$: $x$ becomes $${fmt(x1)}$, and $y = \\sqrt[3]{${c} + ${k === 1 ? "" : k}x^{2}}$ becomes $${fmt(y1)}$. The rate is about $\\frac{${fmt(y1)} - ${par(y0)}}{0.001} \\approx ${fmt((y1 - y0) / dt)}$, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `沿曲线移动一小段时间 $0.001$：$x$ 变为 $${fmt(x1)}$，$y = \\sqrt[3]{${c} + ${k === 1 ? "" : k}x^{2}}$ 变为 $${fmt(y1)}$。变化率约为 $\\frac{${fmt(y1)} - ${par(y0)}}{0.001} \\approx ${fmt((y1 - y0) / dt)}$，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** piTimes writes c·π: "6\\pi", "\\frac{3\\pi}{2}". */
function piTimes(c: Q): string {
  const n = c.n < 0n ? -c.n : c.n;
  const sign = c.sign() < 0 ? "-" : "";
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  return c.d === 1n ? `${sign}${top}` : `${sign}\\frac{${top}}{${c.d}}`;
}

/** overPi writes c/π: "\\frac{3}{16\\pi}". */
function overPi(c: Q): string {
  const n = c.n < 0n ? -c.n : c.n;
  return `${c.sign() < 0 ? "-" : ""}\\frac{${n}}{${c.d === 1n ? "" : c.d}\\pi}`;
}

const ring = (r: number, squash = 1, n = 96): Point[] =>
  Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), squash * r * Math.sin((2 * Math.PI * i) / n)]);

/** growthFigure shows a circle (or a sphere, with its equator) of radius r gaining a thin shaded band of width dr. */
function growthFigure(sphere: boolean): Figure {
  const marks: Mark[] = [
    { kind: "shade", points: [...ring(3.5), ...ring(3).reverse()] },
    { kind: "polygon", points: ring(3) },
    { kind: "polygon", points: ring(3.5) },
    { kind: "segment", a: [0, 0], b: [3, 0] },
    { kind: "dot", at: [0, 0] },
    { kind: "side", a: [3, 0], b: [0, 0], text: "r" },
    { kind: "label", at: [3.5, 0], text: "dr", dir: "e" },
  ];
  if (sphere) marks.splice(3, 0, { kind: "polygon", points: ring(3, 0.3) });
  return {
    svg: sketch(marks),
    alt: sphere
      ? t(
          "A sphere of radius r with a thin shaded shell of thickness dr over its surface; the new volume is about the surface area 4πr² times dr.",
          "半径为 r 的球，表面覆盖一层厚度为 dr 的阴影薄壳；新增体积约为表面积 4πr² 乘以 dr。",
        )
      : t(
          "A circle of radius r with a thin shaded ring of width dr around it; the new area is about the circumference 2πr times dr.",
          "半径为 r 的圆，外面围着一圈宽为 dr 的阴影细环；新增面积约为周长 2πr 乘以 dr。",
        ),
  };
}

/** calculatingRelatedRatesWithCirclesAndSpheres relates rates of radius, area and volume. */
export const calculatingRelatedRatesWithCirclesAndSpheres: TopicDef = {
  id: "calculating-related-rates-with-circles-and-spheres",
  title: t("Calculating Related Rates With Circles and Spheres", "圆与球的相关变化率"),
  summary: t(
    "Relate the rates of change of the radius, circumference, area, surface area and volume of circles and spheres.",
    "联系圆与球的半径、周长、面积、表面积和体积的变化率。",
  ),
  intro: t(
    "A stone dropped into a pond makes a circular ripple whose radius grows at $3$ cm/s. When the radius is $10$ cm, the area $A = \\pi r^{2}$ grows at $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi(10)(3) = 60\\pi$ cm²/s.\n\nCheck: the new water is a thin ring around a circle of circumference $2\\pi(10) = 20\\pi$ cm; each second the ring is about $3$ cm wide, so it adds about $20\\pi \\cdot 3 = 60\\pi$ cm².\n\nIn this lesson we relate the rates of the radius, circumference and area of a circle, and of the radius, surface area and volume of a sphere.",
    "石子落入池塘，激起的圆形水波半径以 $3$ cm/s 的速率增大。当半径为 $10$ cm 时，面积 $A = \\pi r^{2}$ 增大的速率为 $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi(10)(3) = 60\\pi$ cm²/s。\n\n检验：新增的部分是周长为 $2\\pi(10) = 20\\pi$ cm 的圆外的一圈细环；每秒这圈环宽约 $3$ cm，所以增加约 $20\\pi \\cdot 3 = 60\\pi$ cm²。\n\n本课我们联系圆的半径、周长和面积的变化率，以及球的半径、表面积和体积的变化率。",
  ),
  prerequisites: ["introduction-to-related-rates", "volumes-of-spheres"],
  encompasses: [{ topic: "introduction-to-related-rates", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "growing-circles",
      title: t("Growing circles", "扩大的圆"),
      explanation: t(
        "Differentiate the area or circumference formula with respect to time, so that the rate of the radius appears as a factor by the chain rule. Differentiate $A = \\pi r^{2}$ with respect to $t$: $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$. For the circumference $C = 2\\pi r$: $\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt}$. Leave answers in terms of $\\pi$. With $r = 5$ and $\\frac{dr}{dt} = 2$: $\\frac{dA}{dt} = 2\\pi(5)(2) = 20\\pi$.\n\nCheck: the circumference is $10\\pi$, and a ring $2$ units wide around it adds about $10\\pi \\cdot 2 = 20\\pi$ each unit of time, as the figure shows.\n\n> **Watch out.** Differentiate before substituting the radius: $\\pi r^{2}$ times $\\frac{dr}{dt}$ is not the rate of the area. The rate of the circumference does not depend on the radius at all.",
        "把面积或周长公式对时间求导，根据链式法则，半径的变化率会作为一个因子出现。把 $A = \\pi r^{2}$ 对 $t$ 求导：$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$。对周长 $C = 2\\pi r$：$\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt}$。答案用 $\\pi$ 表示。当 $r = 5$，$\\frac{dr}{dt} = 2$ 时：$\\frac{dA}{dt} = 2\\pi(5)(2) = 20\\pi$。\n\n检验：周长为 $10\\pi$，在它外面每单位时间增加一圈宽 $2$ 的环，面积约增加 $10\\pi \\cdot 2 = 20\\pi$，如图所示。\n\n> **注意。** 先求导再代入半径：$\\pi r^{2}$ 乘以 $\\frac{dr}{dt}$ 并不是面积的变化率。周长的变化率与半径完全无关。",
      ),
      figure: growthFigure(false),
      generate(rng) {
        const r0 = rng.int(2, 30);
        const v = rng.int(1, 9);
        const area = rng.int(0, 3) > 0;
        const answer = piTimes(Q.of(area ? 2 * r0 * v : 2 * v));
        const grown = ((r0 + 0.01 * v) ** 2 - r0 * r0) / 0.01;
        return functionWith(
          {
            prompt: t(
              `A ripple spreads in a circle whose radius grows at $${v}$ cm/s. How fast is the ${area ? "area" : "circumference"} of the circle increasing when the radius is $${r0}$ cm? Give your answer in ${area ? "cm²/s" : "cm/s"}, in terms of $\\pi$.`,
              `水波呈圆形扩散，半径以 $${v}$ cm/s 的速率增大。当半径为 $${r0}$ cm 时，圆的${area ? "面积" : "周长"}增大的速率是多少？用 $\\pi$ 表示，单位为 ${area ? "cm²/s" : "cm/s"}。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Differentiate the formula", "对公式求导"],
                  area
                    ? t("Differentiate $A = \\pi r^{2}$ with respect to $t$:", "把 $A = \\pi r^{2}$ 对 $t$ 求导：")
                    : t("Differentiate $C = 2\\pi r$ with respect to $t$:", "把 $C = 2\\pi r$ 对 $t$ 求导："),
                  [area ? "\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}" : "\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt}"],
                ],
                [
                  ["Substitute", "代入"],
                  area
                    ? t(
                        `Put in $r = ${r0}$ and $\\frac{dr}{dt} = ${v}$, in cm²/s:`,
                        `代入 $r = ${r0}$，$\\frac{dr}{dt} = ${v}$，单位为 cm²/s：`,
                      )
                    : t(
                        `Put in $\\frac{dr}{dt} = ${v}$, in cm/s; the radius does not enter:`,
                        `代入 $\\frac{dr}{dt} = ${v}$，单位为 cm/s；半径不出现：`,
                      ),
                  [area ? `\\frac{dA}{dt} = 2\\pi(${r0})(${v}) = ${answer}` : `\\frac{dC}{dt} = 2\\pi(${v}) = ${answer}`],
                ],
              ],
              area
                ? t(
                    `In $0.01$ s the radius grows from $${r0}$ to $${fmt(r0 + 0.01 * v)}$ cm, and the area by $\\pi\\left(${fmt(r0 + 0.01 * v)}^{2} - ${r0}^{2}\\right)$. Divided by $0.01$, that is about $${fmt(grown)}\\pi$ cm²/s, close to $${answer}$.`,
                    `在 $0.01$ s 内半径从 $${r0}$ 增大到 $${fmt(r0 + 0.01 * v)}$ cm，面积增加 $\\pi\\left(${fmt(r0 + 0.01 * v)}^{2} - ${r0}^{2}\\right)$。除以 $0.01$，约为 $${fmt(grown)}\\pi$ cm²/s，接近 $${answer}$。`,
                  )
                : t(
                    `In $0.01$ s the radius grows by $${fmt(0.01 * v)}$ cm, so the circumference grows by $2\\pi \\cdot ${fmt(0.01 * v)} = ${fmt(0.02 * v)}\\pi$ cm. Divided by $0.01$, that is $${answer}$ cm/s, whatever the radius.`,
                    `在 $0.01$ s 内半径增大 $${fmt(0.01 * v)}$ cm，所以周长增大 $2\\pi \\cdot ${fmt(0.01 * v)} = ${fmt(0.02 * v)}\\pi$ cm。除以 $0.01$，得 $${answer}$ cm/s，与半径无关。`,
                  ),
            ),
          },
          area
            ? [
                say(
                  piTimes(Q.of(r0 * r0 * v)),
                  "This multiplies the area $\\pi r^{2}$ by $\\frac{dr}{dt}$. Differentiate first: $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$.",
                  "这是用面积 $\\pi r^{2}$ 乘以 $\\frac{dr}{dt}$。应先求导：$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$。",
                ),
                say(
                  piTimes(Q.of(2 * r0)),
                  `This is $\\frac{dA}{dr}$; it still has to be multiplied by $\\frac{dr}{dt} = ${v}$.`,
                  `这是 $\\frac{dA}{dr}$；还要乘以 $\\frac{dr}{dt} = ${v}$。`,
                ),
                say(
                  piTimes(Q.of(r0 * v)),
                  "This leaves out the $2$ that the power rule brings down from $r^{2}$.",
                  "这漏掉了幂法则从 $r^{2}$ 带下来的 $2$。",
                ),
              ]
            : [
                say(
                  piTimes(Q.of(2 * r0 * v)),
                  "This is the rate of the area, $2\\pi r\\frac{dr}{dt}$, not of the circumference.",
                  "这是面积的变化率 $2\\pi r\\frac{dr}{dt}$，不是周长的变化率。",
                ),
                say(piTimes(Q.of(v)), "This leaves out the $2$ in $C = 2\\pi r$.", "这漏掉了 $C = 2\\pi r$ 中的 $2$。"),
              ],
        );
      },
    },
    {
      id: "growing-spheres",
      title: t("Growing spheres", "膨胀的球"),
      explanation: t(
        "The rate at which the volume grows is the surface area times the rate of the radius, because new volume is added as a thin shell over the surface. For a sphere, $V = \\frac{4}{3}\\pi r^{3}$ and $S = 4\\pi r^{2}$, so\n\n$$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}, \\qquad \\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt}.$$\n\nWith $r = 3$ and $\\frac{dr}{dt} = 2$: $\\frac{dV}{dt} = 4\\pi(9)(2) = 72\\pi$.\n\nCheck: the surface area at $r = 3$ is $4\\pi(9) = 36\\pi$, and a shell of thickness $2$ per unit time over it holds about $36\\pi \\cdot 2 = 72\\pi$.\n\n> **Watch out.** The power rule turns $\\frac{4}{3}\\pi r^{3}$ into $4\\pi r^{2}$: the $3$ comes down and cancels the $\\frac{1}{3}$. Do not keep the $\\frac{4}{3}$.",
        "体积增长的速率等于表面积乘以半径的变化率，因为新增的体积是覆盖在表面上的一层薄壳。对球，$V = \\frac{4}{3}\\pi r^{3}$，$S = 4\\pi r^{2}$，所以\n\n$$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}, \\qquad \\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt}.$$\n\n当 $r = 3$，$\\frac{dr}{dt} = 2$ 时：$\\frac{dV}{dt} = 4\\pi(9)(2) = 72\\pi$。\n\n检验：$r = 3$ 时表面积为 $4\\pi(9) = 36\\pi$，每单位时间在其上增加厚 $2$ 的一层壳，体积约为 $36\\pi \\cdot 2 = 72\\pi$。\n\n> **注意。** 幂法则把 $\\frac{4}{3}\\pi r^{3}$ 变成 $4\\pi r^{2}$：指数 $3$ 乘下来与 $\\frac{1}{3}$ 约掉。不要保留 $\\frac{4}{3}$。",
      ),
      figure: growthFigure(true),
      generate(rng) {
        const r0 = rng.int(2, 15);
        const v = Q.of(rng.int(1, 5), rng.pick([1, 1, 2, 4]));
        const volume = rng.bool();
        const answer = piTimes(v.mul(Q.of(volume ? 4 * r0 * r0 : 8 * r0)));
        const vn = v.toNumber();
        const r1 = r0 + 0.01 * vn;
        const grown = volume ? ((4 / 3) * (r1 ** 3 - r0 ** 3)) / 0.01 : (4 * (r1 ** 2 - r0 ** 2)) / 0.01;
        return functionWith(
          {
            prompt: t(
              `The radius of a spherical balloon increases at $${L(v)}$ cm/s. How fast is its ${volume ? "volume" : "surface area"} increasing when the radius is $${r0}$ cm? Give your answer in ${volume ? "cm³/s" : "cm²/s"}, in terms of $\\pi$.`,
              `球形气球的半径以 $${L(v)}$ cm/s 的速率增大。当半径为 $${r0}$ cm 时，它的${volume ? "体积" : "表面积"}增大的速率是多少？用 $\\pi$ 表示，单位为 ${volume ? "cm³/s" : "cm²/s"}。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Differentiate the formula", "对公式求导"],
                  volume
                    ? t("Differentiate $V = \\frac{4}{3}\\pi r^{3}$ with respect to $t$:", "把 $V = \\frac{4}{3}\\pi r^{3}$ 对 $t$ 求导：")
                    : t("Differentiate $S = 4\\pi r^{2}$ with respect to $t$:", "把 $S = 4\\pi r^{2}$ 对 $t$ 求导："),
                  [volume ? "\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}" : "\\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt}"],
                ],
                [
                  ["Substitute", "代入"],
                  t(`Put in $r = ${r0}$ and $\\frac{dr}{dt} = ${L(v)}$:`, `代入 $r = ${r0}$，$\\frac{dr}{dt} = ${L(v)}$：`),
                  [
                    volume
                      ? `\\frac{dV}{dt} = 4\\pi(${r0})^{2} \\cdot ${L(v)} = ${answer}`
                      : `\\frac{dS}{dt} = 8\\pi(${r0}) \\cdot ${L(v)} = ${answer}`,
                  ],
                ],
              ],
              t(
                `In $0.01$ s the radius grows from $${r0}$ to $${fmt(r1)}$ cm. The ${volume ? "volume $\\frac{4}{3}\\pi r^{3}$" : "surface area $4\\pi r^{2}$"} grows by an amount that, divided by $0.01$, is about $${fmt(grown)}\\pi$, close to $${answer}$.`,
                `在 $0.01$ s 内半径从 $${r0}$ 增大到 $${fmt(r1)}$ cm。${volume ? "体积 $\\frac{4}{3}\\pi r^{3}$" : "表面积 $4\\pi r^{2}$"}的增加量除以 $0.01$，约为 $${fmt(grown)}\\pi$，接近 $${answer}$。`,
              ),
            ),
          },
          volume
            ? [
                say(
                  piTimes(v.mul(Q.of(4 * r0 * r0, 3))),
                  "This keeps the $\\frac{4}{3}$: the $3$ brought down by the power rule cancels the $\\frac{1}{3}$, leaving $4\\pi r^{2}$.",
                  "这保留了 $\\frac{4}{3}$：幂法则带下的 $3$ 与 $\\frac{1}{3}$ 约掉，剩下 $4\\pi r^{2}$。",
                ),
                say(
                  piTimes(v.mul(Q.of(4 * r0 * r0 * r0, 3))),
                  "This multiplies the volume by $\\frac{dr}{dt}$ without differentiating.",
                  "这是没有求导，直接用体积乘以 $\\frac{dr}{dt}$。",
                ),
                say(
                  piTimes(v.mul(Q.of(8 * r0))),
                  "This is the rate of the surface area, $8\\pi r\\frac{dr}{dt}$, not of the volume.",
                  "这是表面积的变化率 $8\\pi r\\frac{dr}{dt}$，不是体积的变化率。",
                ),
              ]
            : [
                say(
                  piTimes(v.mul(Q.of(4 * r0 * r0))),
                  "This is the rate of the volume, $4\\pi r^{2}\\frac{dr}{dt}$, not of the surface area.",
                  "这是体积的变化率 $4\\pi r^{2}\\frac{dr}{dt}$，不是表面积的变化率。",
                ),
                say(
                  piTimes(v.mul(Q.of(4 * r0))),
                  "This leaves out the $2$ that the power rule brings down from $r^{2}$.",
                  "这漏掉了幂法则从 $r^{2}$ 带下来的 $2$。",
                ),
              ],
        );
      },
    },
    {
      id: "finding-the-rate-of-change-of-a-radius",
      figure: calculusDrawings2["calculating-related-rates-with-circles-and-spheres#finding-the-rate-of-change-of-a-radius"],
      title: t("Finding the rate of change of a radius", "求半径的变化率"),
      explanation: t(
        "When the rate of the area or volume is given, solve for $\\frac{dr}{dt}$. If air is pumped into a sphere at $100$ cm³/s, then at $r = 5$: $100 = 4\\pi(25)\\frac{dr}{dt}$, so $\\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s.\n\nCheck: $4\\pi(25) \\cdot \\frac{1}{\\pi} = 100$, the given rate of the volume.\n\n> **Watch out.** Divide the given rate by $4\\pi r^{2}$ (or by $2\\pi r$ for a circle); keep the $4$ or the $2$, and keep $\\pi$ in the denominator.",
        "已知面积或体积的变化率时，解出 $\\frac{dr}{dt}$。若以 $100$ cm³/s 的速率向球内充气，则在 $r = 5$ 时：$100 = 4\\pi(25)\\frac{dr}{dt}$，所以 $\\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s。\n\n检验：$4\\pi(25) \\cdot \\frac{1}{\\pi} = 100$，正是已知的体积变化率。\n\n> **注意。** 用已知的变化率除以 $4\\pi r^{2}$（圆则除以 $2\\pi r$）；不要丢掉 $4$ 或 $2$，$\\pi$ 留在分母中。",
      ),
      generate(rng) {
        const sphere = rng.bool();
        const r0 = rng.int(2, 12);
        const q = rng.int(1, 30) * (sphere ? 10 : 2);
        const k = sphere ? 4 * r0 * r0 : 2 * r0;
        const rate = Q.of(q, k);
        const answer = overPi(rate);
        return functionWith(
          {
            prompt: sphere
              ? t(
                  `Air is pumped into a spherical balloon at $${q}$ cm³/s. How fast is the radius increasing when it is $${r0}$ cm? Give your answer in cm/s, in terms of $\\pi$.`,
                  `以 $${q}$ cm³/s 的速率向球形气球内充气。当半径为 $${r0}$ cm 时，半径增大的速率是多少？用 $\\pi$ 表示，单位为 cm/s。`,
                )
              : t(
                  `The area of a circular oil slick grows at $${q}$ m²/min. How fast is its radius growing when the radius is $${r0}$ m? Give your answer in m/min, in terms of $\\pi$.`,
                  `圆形油污的面积以 $${q}$ m²/min 的速率增大。当半径为 $${r0}$ m 时，半径增大的速率是多少？用 $\\pi$ 表示，单位为 m/min。`,
                ),
            answer,
            solution: walked(
              [
                [
                  ["Differentiate the formula", "对公式求导"],
                  sphere
                    ? t("Differentiate $V = \\frac{4}{3}\\pi r^{3}$ with respect to $t$:", "把 $V = \\frac{4}{3}\\pi r^{3}$ 对 $t$ 求导：")
                    : t("Differentiate $A = \\pi r^{2}$ with respect to $t$:", "把 $A = \\pi r^{2}$ 对 $t$ 求导："),
                  [sphere ? "\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}" : "\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}"],
                ],
                [
                  ["Substitute and solve", "代入并求解"],
                  t(
                    `Put in $r = ${r0}$ and the given rate $${q}$, then divide by $${k}\\pi$:`,
                    `代入 $r = ${r0}$ 和已知的变化率 $${q}$，再除以 $${k}\\pi$：`,
                  ),
                  [`${q} = ${k}\\pi\\frac{dr}{dt}, \\qquad \\frac{dr}{dt} = ${answer}`],
                ],
              ],
              t(
                `Put the rate back: $${k}\\pi \\cdot ${answer} = ${q}$, the given rate of the ${sphere ? "volume" : "area"}.`,
                `把变化率代回：$${k}\\pi \\cdot ${answer} = ${q}$，正是已知的${sphere ? "体积" : "面积"}变化率。`,
              ),
            ),
          },
          [
            say(piTimes(Q.of(q * k)), `This multiplies by $${k}\\pi$ instead of dividing by it.`, `这是乘以 $${k}\\pi$，而应该除以它。`),
            say(
              overPi(Q.of(q, sphere ? r0 * r0 : r0)),
              `This leaves out the ${sphere ? "$4$ in $4\\pi r^{2}$" : "$2$ in $2\\pi r$"}.`,
              `这漏掉了${sphere ? " $4\\pi r^{2}$ 中的 $4$" : " $2\\pi r$ 中的 $2$"}。`,
            ),
            say(overPi(Q.of(k, q)), "This turns the fraction upside down.", "这是把分数颠倒了。"),
          ],
        );
      },
    },
  ],
};

/** calculatingRelatedRatesWithSquares relates rates of the side, perimeter and area of squares. */
export const calculatingRelatedRatesWithSquares: TopicDef = {
  id: "calculating-related-rates-with-squares",
  title: t("Calculating Related Rates With Squares", "正方形的相关变化率"),
  summary: t("Relate the rates of change of the side, perimeter and area of a square.", "联系正方形的边长、周长和面积的变化率。"),
  intro: t(
    "A square patch of frost on a window spreads so that its side grows at $2$ cm/min. When the side is $6$ cm, its area $A = s^{2}$ grows at $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(6)(2) = 24$ cm²/min, and its perimeter $P = 4s$ grows at $\\frac{dP}{dt} = 4(2) = 8$ cm/min.\n\nCheck: the new frost forms strips along two sides, each $6$ cm long and growing $2$ cm wide per minute, which add about $2 \\cdot 6 \\cdot 2 = 24$ cm² per minute.\n\nIn this lesson we relate the rates of the side, the perimeter and the area of a square, in both directions.",
    "窗上一块正方形的霜在扩大，边长以 $2$ cm/min 的速率增长。当边长为 $6$ cm 时，面积 $A = s^{2}$ 增大的速率为 $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(6)(2) = 24$ cm²/min，周长 $P = 4s$ 增大的速率为 $\\frac{dP}{dt} = 4(2) = 8$ cm/min。\n\n检验：新增的霜沿两条边形成两条长 $6$ cm 的窄带，每分钟加宽 $2$ cm，约增加 $2 \\cdot 6 \\cdot 2 = 24$ cm²。\n\n本课我们在两个方向上联系正方形的边长、周长和面积的变化率。",
  ),
  prerequisites: ["introduction-to-related-rates"],
  encompasses: [{ topic: "introduction-to-related-rates", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-area-and-perimeter-of-squares",
      title: t("Rates of area and perimeter of squares", "正方形面积与周长的变化率"),
      explanation: t(
        "Write the area or perimeter as a formula in the side length, differentiate it with respect to time, and substitute the current side and its rate. For a square of side $s$, $A = s^{2}$ and $P = 4s$, so $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ and $\\frac{dP}{dt} = 4\\frac{ds}{dt}$. With $s = 10$ and $\\frac{ds}{dt} = 3$: $\\frac{dA}{dt} = 60$ and $\\frac{dP}{dt} = 12$.\n\nCheck: $0.01$ of a unit of time later the side is $10.03$ and the area $100.6009$, an increase of $0.6009$, a rate of about $60$.\n\n> **Watch out.** $\\frac{dA}{dt}$ needs both the current side and its rate; $2s$ alone is $\\frac{dA}{ds}$. A shrinking side has a negative rate, and so does the area.",
        "把面积或周长写成边长的公式，对时间求导，再代入当前的边长及其变化率。边长为 $s$ 的正方形，$A = s^{2}$，$P = 4s$，所以 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$，$\\frac{dP}{dt} = 4\\frac{ds}{dt}$。当 $s = 10$，$\\frac{ds}{dt} = 3$ 时：$\\frac{dA}{dt} = 60$，$\\frac{dP}{dt} = 12$。\n\n检验：经过 $0.01$ 个单位时间，边长为 $10.03$，面积为 $100.6009$，增加了 $0.6009$，变化率约为 $60$。\n\n> **注意。** $\\frac{dA}{dt}$ 既需要当前的边长，也需要边长的变化率；只有 $2s$ 是 $\\frac{dA}{ds}$。边长缩短时变化率为负，面积的变化率也为负。",
      ),
      generate(rng) {
        const s0 = rng.int(2, 25);
        const v = rng.nonZero(-6, 8);
        const area = rng.int(0, 3) > 0;
        const answer = area ? 2 * s0 * v : 4 * v;
        const s1 = s0 + 0.01 * v;
        return numberProblem({
          prompt: t(
            `The side of a square is ${v > 0 ? "increasing" : "decreasing"} at $${Math.abs(v)}$ cm/s. Find the rate of change of its ${area ? "area, in cm²/s" : "perimeter, in cm/s"}, when the side is $${s0}$ cm.`,
            `正方形的边长以 $${Math.abs(v)}$ cm/s 的速率${v > 0 ? "增大" : "减小"}。当边长为 $${s0}$ cm 时，求它的${area ? "面积的变化率（cm²/s）" : "周长的变化率（cm/s）"}。`,
          ),
          answer,
          mistakes: firsts(
            area
              ? [
                  why(
                    s0 * v,
                    "This leaves out the $2$ that the power rule brings down from $s^{2}$.",
                    "这漏掉了幂法则从 $s^{2}$ 带下来的 $2$。",
                  ),
                  why(
                    2 * s0,
                    `This is $\\frac{dA}{ds} = 2s$; it still has to be multiplied by $\\frac{ds}{dt} = ${v}$.`,
                    `这是 $\\frac{dA}{ds} = 2s$；还要乘以 $\\frac{ds}{dt} = ${v}$。`,
                  ),
                  why(
                    -answer,
                    `The sign is wrong: the side is ${v > 0 ? "increasing" : "decreasing"}, so $\\frac{ds}{dt} = ${v}$.`,
                    `符号错了：边长在${v > 0 ? "增大" : "减小"}，所以 $\\frac{ds}{dt} = ${v}$。`,
                  ),
                ]
              : [
                  why(v, "This leaves out the $4$ in $P = 4s$: all four sides grow.", "这漏掉了 $P = 4s$ 中的 $4$：四条边都在变化。"),
                  why(4 * s0, "This is the perimeter itself, not its rate of change.", "这是周长本身，不是它的变化率。"),
                  why(
                    -answer,
                    `The sign is wrong: the side is ${v > 0 ? "increasing" : "decreasing"}, so $\\frac{ds}{dt} = ${v}$.`,
                    `符号错了：边长在${v > 0 ? "增大" : "减小"}，所以 $\\frac{ds}{dt} = ${v}$。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Differentiate the formula", "对公式求导"],
                area
                  ? t("Differentiate $A = s^{2}$ with respect to $t$:", "把 $A = s^{2}$ 对 $t$ 求导：")
                  : t("Differentiate $P = 4s$ with respect to $t$:", "把 $P = 4s$ 对 $t$ 求导："),
                [area ? "\\frac{dA}{dt} = 2s\\frac{ds}{dt}" : "\\frac{dP}{dt} = 4\\frac{ds}{dt}"],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `The side is ${v > 0 ? "increasing" : "decreasing"}, so $\\frac{ds}{dt} = ${v}$${area ? `; with $s = ${s0}$` : ""}:`,
                  `边长在${v > 0 ? "增大" : "减小"}，所以 $\\frac{ds}{dt} = ${v}$${area ? `；代入 $s = ${s0}$` : ""}：`,
                ),
                [area ? `\\frac{dA}{dt} = 2(${s0})(${v}) = ${answer}` : `\\frac{dP}{dt} = 4(${v}) = ${answer}`],
              ],
            ],
            area
              ? t(
                  `In $0.01$ s the side changes from $${s0}$ to $${fmt(s1)}$ cm and the area from $${s0 * s0}$ to $${fmt(s1 * s1)}$ cm². Divided by $0.01$, the change is about $${fmt((s1 * s1 - s0 * s0) / 0.01)}$ cm²/s, close to $${answer}$.`,
                  `在 $0.01$ s 内边长从 $${s0}$ 变为 $${fmt(s1)}$ cm，面积从 $${s0 * s0}$ 变为 $${fmt(s1 * s1)}$ cm²。变化量除以 $0.01$ 约为 $${fmt((s1 * s1 - s0 * s0) / 0.01)}$ cm²/s，接近 $${answer}$。`,
                )
              : t(
                  `Each of the four sides changes at $${v}$ cm/s, so together they change at $4 \\times ${par(v)} = ${answer}$ cm/s.`,
                  `四条边各以 $${v}$ cm/s 的速率变化，合起来的变化率为 $4 \\times ${par(v)} = ${answer}$ cm/s。`,
                ),
          ),
        });
      },
    },
    {
      id: "rates-of-sides-of-squares",
      title: t("Rates of sides of squares", "正方形边长的变化率"),
      explanation: t(
        "When the area's rate is given, first find the side from the area, then solve $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ for $\\frac{ds}{dt}$. If $A = 49$ and $\\frac{dA}{dt} = 21$: $s = 7$, so $21 = 14\\frac{ds}{dt}$ and $\\frac{ds}{dt} = \\frac{3}{2}$.\n\nCheck: with $\\frac{ds}{dt} = \\frac{3}{2}$, $\\frac{dA}{dt} = 2(7)\\left(\\frac{3}{2}\\right) = 21$, the given rate.\n\n> **Watch out.** Put the side $s = \\sqrt{A}$ into $2s$, not the area itself.",
        "已知面积的变化率时，先由面积求出边长，再由 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ 解出 $\\frac{ds}{dt}$。若 $A = 49$，$\\frac{dA}{dt} = 21$：$s = 7$，所以 $21 = 14\\frac{ds}{dt}$，$\\frac{ds}{dt} = \\frac{3}{2}$。\n\n检验：取 $\\frac{ds}{dt} = \\frac{3}{2}$，$\\frac{dA}{dt} = 2(7)\\left(\\frac{3}{2}\\right) = 21$，正是已知的变化率。\n\n> **注意。** 代入 $2s$ 的是边长 $s = \\sqrt{A}$，不是面积本身。",
      ),
      generate(rng) {
        const s0 = rng.int(2, 20);
        const q = rng.int(1, 40);
        const answer = Q.of(q, 2 * s0);
        return numberProblem({
          prompt: t(
            `The area of a square grows at $${q}$ cm²/s. How fast is its side growing, in cm/s, when the area is $${s0 * s0}$ cm²?`,
            `正方形的面积以 $${q}$ cm²/s 的速率增大。当面积为 $${s0 * s0}$ cm² 时，边长增大的速率是多少（cm/s）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.of(q, 2 * s0 * s0),
              `This puts the area $${s0 * s0}$ in place of the side $${s0}$.`,
              `这是把面积 $${s0 * s0}$ 当成了边长 $${s0}$ 代入。`,
            ),
            why(
              Q.of(q, s0),
              "This leaves out the $2$ in $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$.",
              "这漏掉了 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ 中的 $2$。",
            ),
            why(2 * s0 * q, `This multiplies by $2s = ${2 * s0}$ instead of dividing by it.`, `这是乘以 $2s = ${2 * s0}$，而应该除以它。`),
          ]),
          solution: walked(
            [
              [
                ["Find the side", "求边长"],
                t("The side is the square root of the area:", "边长是面积的平方根："),
                [`s = \\sqrt{${s0 * s0}} = ${s0}`],
              ],
              [
                ["Differentiate and solve", "求导并求解"],
                t(
                  `$\\frac{dA}{dt} = 2s\\frac{ds}{dt}$; put in $s = ${s0}$ and $\\frac{dA}{dt} = ${q}$:`,
                  `$\\frac{dA}{dt} = 2s\\frac{ds}{dt}$；代入 $s = ${s0}$，$\\frac{dA}{dt} = ${q}$：`,
                ),
                [`${q} = ${2 * s0}\\frac{ds}{dt}, \\qquad \\frac{ds}{dt} = ${L(answer)}`],
              ],
            ],
            t(
              `Put the rate back: $2(${s0}) \\cdot ${L(answer)} = ${q}$, the given rate of the area.`,
              `把变化率代回：$2(${s0}) \\cdot ${L(answer)} = ${q}$，正是已知的面积变化率。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesWithRectangularSolids relates rates of the edges and volume of boxes. */
export const calculatingRelatedRatesWithRectangularSolids: TopicDef = {
  id: "calculating-related-rates-with-rectangular-solids",
  title: t("Calculating Related Rates With Rectangular Solids", "长方体的相关变化率"),
  summary: t(
    "Relate the rates of change of the edges, surface area and volume of rectangular solids and cubes.",
    "联系长方体和正方体的棱长、表面积和体积的变化率。",
  ),
  intro: t(
    "A rectangular tank $4$ m long and $3$ m wide is being filled, and the water's depth rises at $0.5$ m/h. The water's volume is $V = 4 \\cdot 3 \\cdot h = 12h$, so $\\frac{dV}{dt} = 12\\frac{dh}{dt} = 12(0.5) = 6$ m³/h.\n\nCheck: in one hour the depth rises $0.5$ m, which is a layer $4 \\times 3 \\times 0.5 = 6$ m³.\n\nIn this lesson we relate the rates of the edges of a box to the rate of its volume, with the product rule when several edges change, and do the same for cubes.",
    "一个长 $4$ m、宽 $3$ m 的长方体水箱正在注水，水深以 $0.5$ m/h 的速率上升。水的体积为 $V = 4 \\cdot 3 \\cdot h = 12h$，所以 $\\frac{dV}{dt} = 12\\frac{dh}{dt} = 12(0.5) = 6$ m³/h。\n\n检验：一小时内水深上升 $0.5$ m，即增加一层 $4 \\times 3 \\times 0.5 = 6$ m³ 的水。\n\n本课我们联系长方体棱长的变化率与体积的变化率，几条棱同时变化时用乘积法则，并对正方体做同样的事。",
  ),
  prerequisites: ["calculating-related-rates-with-squares", "volumes-of-rectangular-solids"],
  encompasses: [{ topic: "the-product-rule-for-differentiation", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-volume-of-boxes",
      title: t("Rates of volume of boxes", "长方体体积的变化率"),
      explanation: t(
        "When several dimensions change at once, the product rule gives one term for each dimension, with that dimension's rate times the other two dimensions. For $V = lwh$ with all three edges changing, the product rule gives\n\n$$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt}.$$\n\nWith $l = 4$, $w = 3$, $h = 2$ and rates $1$, $-1$ and $2$: $\\frac{dV}{dt} = 1(3)(2) + 4(-1)(2) + 4(3)(2) = 6 - 8 + 24 = 22$.\n\nCheck: $0.001$ of a unit of time later the box is $4.001 \\times 2.999 \\times 2.002$, with volume $24.022\\ldots$, an increase of about $0.022$, a rate of about $22$.\n\n> **Watch out.** Each term has one rate and two lengths. Multiplying the three rates together, or the volume by one rate, is not the product rule.",
        "当几个尺寸同时变化时，乘积法则为每个尺寸给出一项，即该尺寸的变化率乘以另外两个尺寸。对 $V = lwh$，当三条棱都在变化时，由乘积法则\n\n$$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt}.$$\n\n当 $l = 4$，$w = 3$，$h = 2$，变化率分别为 $1$、$-1$、$2$ 时：$\\frac{dV}{dt} = 1(3)(2) + 4(-1)(2) + 4(3)(2) = 6 - 8 + 24 = 22$。\n\n检验：经过 $0.001$ 个单位时间，长方体为 $4.001 \\times 2.999 \\times 2.002$，体积为 $24.022\\ldots$，约增加 $0.022$，变化率约为 $22$。\n\n> **注意。** 每一项含一个变化率和两个长度。把三个变化率相乘，或用体积乘以一个变化率，都不是乘积法则。",
      ),
      generate(rng) {
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 10), rng.int(1, 8)];
        const [dl, dw, dh] = [rng.nonZero(-3, 4), rng.nonZero(-3, 4), rng.nonZero(-3, 4)];
        const terms = [dl * w * h, l * dw * h, l * w * dh];
        const answer = terms[0]! + terms[1]! + terms[2]!;
        const e = 0.001;
        const later = (l + e * dl) * (w + e * dw) * (h + e * dh);
        return numberProblem({
          prompt: t(
            `The length, width and height of a box are changing at $${dl}$, $${dw}$ and $${dh}$ cm/s. Find the rate of change of its volume, in cm³/s, when the length is $${l}$ cm, the width $${w}$ cm and the height $${h}$ cm.`,
            `一个长方体的长、宽、高分别以 $${dl}$、$${dw}$、$${dh}$ cm/s 的速率变化。当长为 $${l}$ cm、宽为 $${w}$ cm、高为 $${h}$ cm 时，求其体积的变化率（cm³/s）。`,
          ),
          answer,
          mistakes: firsts([
            why(
              dl * dw * dh,
              "This multiplies the three rates together. The product rule gives three terms, each one rate times the other two lengths.",
              "这是把三个变化率相乘。乘积法则给出三项，每项是一个变化率乘以另外两个长度。",
            ),
            why(l * w * h, "This is the volume itself, not its rate of change.", "这是体积本身，不是它的变化率。"),
            why(
              terms[2]!,
              "This keeps only the term for the height, as if the length and width were fixed.",
              "这只保留了高的那一项，好像长和宽不变。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with the product rule", "用乘积法则求导"],
                t("Each edge's rate is multiplied by the other two edges:", "每条棱的变化率乘以另外两条棱："),
                ["\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt}"],
              ],
              [
                ["Substitute", "代入"],
                t("Put in the lengths and the rates, in cm³/s:", "代入长度和变化率，单位为 cm³/s："),
                [
                  `\\frac{dV}{dt} = ${par(dl)}(${w})(${h}) + (${l})${par(dw)}(${h}) + (${l})(${w})${par(dh)} = ${terms.map(String).join(" + ").replaceAll("+ -", "- ")} = ${answer}`,
                ],
              ],
            ],
            t(
              `After $0.001$ s the box is $${fmt(l + e * dl)} \\times ${fmt(w + e * dw)} \\times ${fmt(h + e * dh)}$, with volume about $${fmt(later)}$, compared with $${l * w * h}$. The change divided by $0.001$ is about $${fmt((later - l * w * h) / e)}$, close to $${answer}$.`,
              `$0.001$ s 后长方体为 $${fmt(l + e * dl)} \\times ${fmt(w + e * dw)} \\times ${fmt(h + e * dh)}$，体积约为 $${fmt(later)}$，原来是 $${l * w * h}$。变化量除以 $0.001$ 约为 $${fmt((later - l * w * h) / e)}$，接近 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rates-of-cubes",
      title: t("Rates of cubes", "正方体的变化率"),
      explanation: t(
        "All edges of a cube are equal, so its volume and surface area depend on one length, and the chain rule turns the rate of the edge into their rates. For a cube of edge $s$, $V = s^{3}$ and $S = 6s^{2}$, so $\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$ and $\\frac{dS}{dt} = 12s\\frac{ds}{dt}$. With $s = 5$ and $\\frac{ds}{dt} = 2$: $\\frac{dV}{dt} = 3(25)(2) = 150$.\n\nCheck: the product rule on $V = lwh$ with all three edges equal to $5$ and growing at $2$ gives $3 \\times 2(5)(5) = 150$, the same.\n\n> **Watch out.** The surface area has six faces: $S = 6s^{2}$ differentiates to $12s\\frac{ds}{dt}$, not $6s\\frac{ds}{dt}$.",
        "立方体的各条棱都相等，所以体积和表面积只取决于一个长度，链式法则把棱长的变化率转化为它们的变化率。棱长为 $s$ 的正方体，$V = s^{3}$，$S = 6s^{2}$，所以 $\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$，$\\frac{dS}{dt} = 12s\\frac{ds}{dt}$。当 $s = 5$，$\\frac{ds}{dt} = 2$ 时：$\\frac{dV}{dt} = 3(25)(2) = 150$。\n\n检验：对 $V = lwh$ 用乘积法则，三条棱都等于 $5$ 且都以 $2$ 增长，得 $3 \\times 2(5)(5) = 150$，结果相同。\n\n> **注意。** 表面积有六个面：$S = 6s^{2}$ 的导数是 $12s\\frac{ds}{dt}$，不是 $6s\\frac{ds}{dt}$。",
      ),
      generate(rng) {
        const s0 = rng.int(2, 12);
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const q = rng.int(1, 30) * 3;
          const answer = Q.of(q, 3 * s0 * s0);
          return numberProblem({
            prompt: t(
              `Water fills a cubical mold so that its volume grows at $${q}$ cm³/s while it stays a cube. How fast is the edge growing, in cm/s, when the edge is $${s0}$ cm?`,
              `一个正方体的体积以 $${q}$ cm³/s 的速率增大，且始终保持正方体。当棱长为 $${s0}$ cm 时，棱长增大的速率是多少（cm/s）？`,
            ),
            answer,
            mistakes: firsts([
              why(
                Q.of(q, s0 * s0),
                "This leaves out the $3$ that the power rule brings down from $s^{3}$.",
                "这漏掉了幂法则从 $s^{3}$ 带下来的 $3$。",
              ),
              why(
                3 * s0 * s0 * q,
                `This multiplies by $3s^{2} = ${3 * s0 * s0}$ instead of dividing by it.`,
                `这是乘以 $3s^{2} = ${3 * s0 * s0}$，而应该除以它。`,
              ),
              why(
                Q.of(q, 3 * s0),
                "This divides by $3s$; the derivative of $s^{3}$ is $3s^{2}$.",
                "这是除以 $3s$；$s^{3}$ 的导数是 $3s^{2}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("Differentiate $V = s^{3}$ with respect to $t$:", "把 $V = s^{3}$ 对 $t$ 求导："),
                  ["\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}"],
                ],
                [
                  ["Substitute and solve", "代入并求解"],
                  t(`Put in $s = ${s0}$ and $\\frac{dV}{dt} = ${q}$:`, `代入 $s = ${s0}$，$\\frac{dV}{dt} = ${q}$：`),
                  [`${q} = ${3 * s0 * s0}\\frac{ds}{dt}, \\qquad \\frac{ds}{dt} = ${L(answer)}`],
                ],
              ],
              t(
                `Put the rate back: $3(${s0})^{2} \\cdot ${L(answer)} = ${q}$, the given rate of the volume.`,
                `把变化率代回：$3(${s0})^{2} \\cdot ${L(answer)} = ${q}$，正是已知的体积变化率。`,
              ),
            ),
          });
        }
        const v = rng.int(1, 5);
        const volume = kind === 0;
        const answer = volume ? 3 * s0 * s0 * v : 12 * s0 * v;
        const s1 = s0 + 0.01 * v;
        const later = volume ? s1 ** 3 : 6 * s1 * s1;
        const now = volume ? s0 ** 3 : 6 * s0 * s0;
        return numberProblem({
          prompt: t(
            `The edges of a cube grow at $${v}$ cm/s. How fast is its ${volume ? "volume growing, in cm³/s" : "surface area growing, in cm²/s"}, when the edge is $${s0}$ cm?`,
            `正方体的棱长以 $${v}$ cm/s 的速率增大。当棱长为 $${s0}$ cm 时，它的${volume ? "体积增大的速率是多少（cm³/s）" : "表面积增大的速率是多少（cm²/s）"}？`,
          ),
          answer,
          mistakes: firsts(
            volume
              ? [
                  why(
                    s0 * s0 * v,
                    "This leaves out the $3$ that the power rule brings down from $s^{3}$.",
                    "这漏掉了幂法则从 $s^{3}$ 带下来的 $3$。",
                  ),
                  why(
                    3 * s0 * s0,
                    `This is $\\frac{dV}{ds}$; it still has to be multiplied by $\\frac{ds}{dt} = ${v}$.`,
                    `这是 $\\frac{dV}{ds}$；还要乘以 $\\frac{ds}{dt} = ${v}$。`,
                  ),
                  why(
                    s0 * s0 * s0 * v,
                    "This multiplies the volume by $\\frac{ds}{dt}$ without differentiating.",
                    "这是没有求导，直接用体积乘以 $\\frac{ds}{dt}$。",
                  ),
                ]
              : [
                  why(
                    6 * s0 * v,
                    "This differentiates $6s^{2}$ to $6s$; the power rule gives $12s$.",
                    "这把 $6s^{2}$ 的导数算成了 $6s$；幂法则给出 $12s$。",
                  ),
                  why(
                    12 * s0,
                    `This is $\\frac{dS}{ds}$; it still has to be multiplied by $\\frac{ds}{dt} = ${v}$.`,
                    `这是 $\\frac{dS}{ds}$；还要乘以 $\\frac{ds}{dt} = ${v}$。`,
                  ),
                  why(
                    6 * s0 * s0 * v,
                    "This multiplies the surface area by $\\frac{ds}{dt}$ without differentiating.",
                    "这是没有求导，直接用表面积乘以 $\\frac{ds}{dt}$。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                volume
                  ? t("Differentiate $V = s^{3}$ with respect to $t$:", "把 $V = s^{3}$ 对 $t$ 求导：")
                  : t("Differentiate $S = 6s^{2}$ with respect to $t$:", "把 $S = 6s^{2}$ 对 $t$ 求导："),
                [volume ? "\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}" : "\\frac{dS}{dt} = 12s\\frac{ds}{dt}"],
              ],
              [
                ["Substitute", "代入"],
                t(`Put in $s = ${s0}$ and $\\frac{ds}{dt} = ${v}$:`, `代入 $s = ${s0}$，$\\frac{ds}{dt} = ${v}$：`),
                [volume ? `\\frac{dV}{dt} = 3(${s0})^{2}(${v}) = ${answer}` : `\\frac{dS}{dt} = 12(${s0})(${v}) = ${answer}`],
              ],
            ],
            t(
              `In $0.01$ s the edge grows to $${fmt(s1)}$ cm and the ${volume ? "volume" : "surface area"} from $${now}$ to about $${fmt(later)}$. Divided by $0.01$, the change is about $${fmt((later - now) / 0.01)}$, close to $${answer}$.`,
              `在 $0.01$ s 内棱长增大到 $${fmt(s1)}$ cm，${volume ? "体积" : "表面积"}从 $${now}$ 变为约 $${fmt(later)}$。变化量除以 $0.01$ 约为 $${fmt((later - now) / 0.01)}$，接近 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesUsingThePythagoreanTheorem relates rates of the sides of right triangles. */
export const calculatingRelatedRatesUsingThePythagoreanTheorem: TopicDef = {
  id: "calculating-related-rates-using-the-pythagorean-theorem",
  title: t("Calculating Related Rates Using the Pythagorean Theorem", "用勾股定理计算相关变化率"),
  summary: t(
    "Relate the rates of change of the sides of a right triangle: sliding ladders and moving objects.",
    "联系直角三角形各边的变化率：滑动的梯子与运动的物体。",
  ),
  intro: t(
    "A $5$ m ladder leans against a wall with its foot $3$ m out, so its top is $4$ m up. If the foot slides out at $1$ m/s, then from $x^{2} + y^{2} = 25$ we get $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$, so $3(1) + 4\\frac{dy}{dt} = 0$ and $\\frac{dy}{dt} = -\\frac{3}{4}$: the top slides down at $0.75$ m/s.\n\nCheck: $0.01$ s later the foot is $3.01$ m out and the top $\\sqrt{25 - 3.01^{2}} \\approx 3.99248$ m up, a drop of $0.00752$ m in $0.01$ s, about $0.75$ m/s.\n\nIn this lesson we use the Pythagorean theorem to relate the rates of the sides of a right triangle: ladders, and objects moving along perpendicular roads.",
    "一架 $5$ m 长的梯子靠在墙上，梯脚离墙 $3$ m，所以梯顶离地 $4$ m。若梯脚以 $1$ m/s 的速率向外滑，由 $x^{2} + y^{2} = 25$ 得 $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$，所以 $3(1) + 4\\frac{dy}{dt} = 0$，$\\frac{dy}{dt} = -\\frac{3}{4}$：梯顶以 $0.75$ m/s 的速率下滑。\n\n检验：$0.01$ s 后梯脚离墙 $3.01$ m，梯顶离地 $\\sqrt{25 - 3.01^{2}} \\approx 3.99248$ m，在 $0.01$ s 内下降了 $0.00752$ m，约为 $0.75$ m/s。\n\n本课我们用勾股定理联系直角三角形各边的变化率：滑动的梯子，以及沿互相垂直的道路运动的物体。",
  ),
  prerequisites: ["related-rates-with-implicit-functions"],
  encompasses: [{ topic: "related-rates-with-implicit-functions", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "sliding-ladders",
      title: t("Sliding ladders", "滑动的梯子"),
      explanation: t(
        "A ladder of length $L$ leans against a wall, with its foot $x$ from the wall and its top $y$ up the wall: $x^{2} + y^{2} = L^{2}$. Then $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$: as the foot slides out, the top slides down. For a $13$ m ladder with its foot $5$ m out sliding at $2$ m/s, $y = 12$ and $\\frac{dy}{dt} = -\\frac{5}{12} \\cdot 2 = -\\frac{5}{6}$.\n\nCheck: $5(2) + 12\\left(-\\frac{5}{6}\\right) = 10 - 10 = 0$, as the differentiated equation requires.\n\n> **Watch out.** Find the missing side $y = \\sqrt{L^{2} - x^{2}}$ first, and put $x$ on top: $\\frac{x}{y}$, not $\\frac{y}{x}$. The ladder's length is constant, so it differentiates to $0$.",
        "长为 $L$ 的梯子靠在墙上，梯脚离墙 $x$，梯顶离地 $y$：$x^{2} + y^{2} = L^{2}$。于是 $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$：梯脚向外滑时，梯顶向下滑。对 $13$ m 长的梯子，梯脚离墙 $5$ m 并以 $2$ m/s 滑动时，$y = 12$，$\\frac{dy}{dt} = -\\frac{5}{12} \\cdot 2 = -\\frac{5}{6}$。\n\n检验：$5(2) + 12\\left(-\\frac{5}{6}\\right) = 10 - 10 = 0$，符合求导后的方程。\n\n> **注意。** 先求出缺少的边 $y = \\sqrt{L^{2} - x^{2}}$，并把 $x$ 放在分子上：是 $\\frac{x}{y}$，不是 $\\frac{y}{x}$。梯子长度不变，它的导数是 $0$。",
      ),
      generate(rng) {
        const [x0, y0, c] = rng.pick(triples);
        const v = Q.of(rng.int(1, 6), rng.pick([1, 2, 4]));
        const answer = v.mul(Q.of(x0, y0));
        const e = 0.001;
        const x1 = x0 + e * v.toNumber();
        const y1 = Math.sqrt(c * c - x1 * x1);
        return numberProblem({
          prompt: t(
            `${article(c, true)} $${c}$ m ladder leans against a vertical wall. Its foot slides away from the wall at $${L(v)}$ m/s. How fast is the top sliding down the wall, in m/s, when the foot is $${x0}$ m from the wall?`,
            `一架长 $${c}$ m 的梯子靠在竖直的墙上，梯脚以 $${L(v)}$ m/s 的速率离墙滑开。当梯脚离墙 $${x0}$ m 时，梯顶沿墙下滑的速率是多少（m/s）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              v.mul(Q.of(y0, x0)),
              "This has $x$ and $y$ swapped: the equation gives $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$.",
              "$x$ 和 $y$ 弄反了：方程给出 $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$。",
            ),
            why(
              v,
              "The top does not move as fast as the foot: the speeds are in the ratio $x : y$.",
              "梯顶的速率与梯脚不同：两者之比是 $x : y$。",
            ),
            why(
              v.mul(Q.of(x0, c)),
              `This divides by the ladder's length $${c}$ instead of the height of the top, $${y0}$.`,
              `这是除以梯子的长度 $${c}$，而应该除以梯顶的高度 $${y0}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the height of the top", "求梯顶的高度"],
                t("By the Pythagorean theorem,", "由勾股定理，"),
                [`y = \\sqrt{${c}^{2} - ${x0}^{2}} = ${y0}`],
              ],
              [
                ["Differentiate and solve", "求导并求解"],
                t(
                  `Differentiate $x^{2} + y^{2} = ${c * c}$ and put in $x = ${x0}$, $y = ${y0}$, $\\frac{dx}{dt} = ${L(v)}$:`,
                  `对 $x^{2} + y^{2} = ${c * c}$ 求导，代入 $x = ${x0}$，$y = ${y0}$，$\\frac{dx}{dt} = ${L(v)}$：`,
                ),
                [`${x0} \\cdot ${L(v)} + ${y0}\\frac{dy}{dt} = 0, \\qquad \\frac{dy}{dt} = ${L(answer.neg())}`],
              ],
              [
                ["Answer the question", "回答问题"],
                t(`The top slides down at $${L(answer)}$ m/s.`, `梯顶以 $${L(answer)}$ m/s 的速率下滑。`),
              ],
            ],
            t(
              `$0.001$ s later the foot is $${fmt(x1)}$ m out and the top $\\sqrt{${c * c} - ${fmt(x1)}^{2}} \\approx ${fmt(y1)}$ m up, a drop of about $${fmt(y0 - y1)}$ m in $0.001$ s, that is about $${fmt((y0 - y1) / e)}$ m/s, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `$0.001$ s 后梯脚离墙 $${fmt(x1)}$ m，梯顶离地 $\\sqrt{${c * c} - ${fmt(x1)}^{2}} \\approx ${fmt(y1)}$ m，在 $0.001$ s 内约下降 $${fmt(y0 - y1)}$ m，即约 $${fmt((y0 - y1) / e)}$ m/s，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "distances-between-moving-objects",
      figure: calculusDrawings2["calculating-related-rates-using-the-pythagorean-theorem#distances-between-moving-objects"],
      title: t("Distances between moving objects", "运动物体之间的距离"),
      explanation: t(
        "If two objects move along perpendicular roads, their distance $s$ satisfies $s^{2} = x^{2} + y^{2}$, so\n\n$$s\\frac{ds}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}.$$\n\nIf one car is $3$ km east of a crossing driving away at $40$ km/h and another $4$ km north driving away at $30$ km/h, then $s = 5$ and $5\\frac{ds}{dt} = 3(40) + 4(30) = 240$, so $\\frac{ds}{dt} = 48$ km/h.\n\nCheck: a minute later ($\\frac{1}{60}$ h) the cars are $3.6667$ km and $4.5$ km out, $\\sqrt{3.6667^{2} + 4.5^{2}} \\approx 5.8048$ km apart, an increase of $0.8048$ km in $\\frac{1}{60}$ h, about $48$ km/h.\n\n> **Watch out.** A distance from the crossing that is shrinking has a negative rate: a car driving toward the crossing has $\\frac{dx}{dt} < 0$. Speeds do not simply add.",
        "若两个物体沿互相垂直的道路运动，它们的距离 $s$ 满足 $s^{2} = x^{2} + y^{2}$，所以\n\n$$s\\frac{ds}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}.$$\n\n若一辆车在路口以东 $3$ km 处以 $40$ km/h 驶离，另一辆在路口以北 $4$ km 处以 $30$ km/h 驶离，则 $s = 5$，$5\\frac{ds}{dt} = 3(40) + 4(30) = 240$，所以 $\\frac{ds}{dt} = 48$ km/h。\n\n检验：一分钟（$\\frac{1}{60}$ h）后两车分别离路口 $3.6667$ km 和 $4.5$ km，相距 $\\sqrt{3.6667^{2} + 4.5^{2}} \\approx 5.8048$ km，在 $\\frac{1}{60}$ h 内增加了 $0.8048$ km，约为 $48$ km/h。\n\n> **注意。** 到路口的距离在缩短时变化率为负：驶向路口的车 $\\frac{dx}{dt} < 0$。速度不能简单相加。",
      ),
      generate(rng) {
        const [p, q, r] = rng.pick(triples);
        const k = rng.pick([1, 2, 5, 10]);
        const [x0, y0, s0] = [p * k, q * k, r * k];
        const u = rng.int(3, 12) * 10;
        const w = rng.int(3, 12) * 10;
        const top = -x0 * u + y0 * w;
        const answer = Q.of(top, s0);
        const e = 0.001;
        const s1 = Math.hypot(x0 - e * u, y0 + e * w);
        return numberProblem({
          prompt: t(
            `Car A is $${x0}$ km east of an intersection, driving west toward it at $${u}$ km/h. Car B is $${y0}$ km north of the intersection, driving north away from it at $${w}$ km/h. At what rate is the distance between the cars changing, in km/h?`,
            `汽车 A 在路口以东 $${x0}$ km 处，以 $${u}$ km/h 的速度向西驶向路口。汽车 B 在路口以北 $${y0}$ km 处，以 $${w}$ km/h 的速度向北驶离路口。两车之间的距离以多大的速率变化（km/h）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.of(x0 * u + y0 * w, s0),
              `Car A drives toward the intersection, so its distance from it is shrinking: $\\frac{dx}{dt} = -${u}$, not $${u}$.`,
              `汽车 A 驶向路口，它到路口的距离在缩短：$\\frac{dx}{dt} = -${u}$，不是 $${u}$。`,
            ),
            why(
              u + w,
              "This adds the two speeds. The distance changes at a rate that depends on the positions as well.",
              "这是把两个速度相加。距离的变化率还取决于位置。",
            ),
            why(
              answer.neg(),
              "Both rates have the wrong sign: car A's distance shrinks and car B's grows.",
              "两个变化率的符号都反了：汽车 A 的距离在缩短，汽车 B 的在增大。",
            ),
            why(top, `This leaves out the division by the distance $s = ${s0}$.`, `这漏掉了除以距离 $s = ${s0}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the distance", "求距离"],
                t("By the Pythagorean theorem,", "由勾股定理，"),
                [`s = \\sqrt{${x0}^{2} + ${y0}^{2}} = ${s0}`],
              ],
              [
                ["Differentiate and substitute", "求导并代入"],
                t(
                  `Car A's distance shrinks, so $\\frac{dx}{dt} = -${u}$; car B's grows, so $\\frac{dy}{dt} = ${w}$:`,
                  `汽车 A 的距离在缩短，所以 $\\frac{dx}{dt} = -${u}$；汽车 B 的在增大，所以 $\\frac{dy}{dt} = ${w}$：`,
                ),
                [`${s0}\\frac{ds}{dt} = ${x0}(-${u}) + ${y0}(${w}) = ${top}, \\qquad \\frac{ds}{dt} = ${L(answer)}`],
              ],
            ],
            t(
              `$0.001$ h later car A is $${fmt(x0 - e * u)}$ km out and car B $${fmt(y0 + e * w)}$ km, so they are $${fmt(s1)}$ km apart. The change divided by $0.001$ is about $${fmt((s1 - s0) / e)}$ km/h, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `$0.001$ h 后汽车 A 离路口 $${fmt(x0 - e * u)}$ km，汽车 B 离路口 $${fmt(y0 + e * w)}$ km，两车相距 $${fmt(s1)}$ km。变化量除以 $0.001$ 约为 $${fmt((s1 - s0) / e)}$ km/h，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lamppostFigure shows a post of height H, a person of height h at distance x and the shadow s, the light's ray grazing the head. */
const lamppostFigure: Figure = {
  svg: sketch([
    { kind: "segment", a: [-0.5, 0], b: [6, 0] },
    { kind: "segment", a: [0, 0], b: [0, 5] },
    { kind: "segment", a: [3, 0], b: [3, 2] },
    { kind: "segment", a: [0, 5], b: [5, 0], dashed: true },
    { kind: "right", vertex: [3, 0], from: [5, 0], to: [3, 2] },
    { kind: "side", a: [0, 5], b: [0, 0], text: "H" },
    { kind: "side", a: [3, 0], b: [3, 2], text: "h" },
    { kind: "side", a: [0, 0], b: [3, 0], text: "x" },
    { kind: "side", a: [3, 0], b: [5, 0], text: "s" },
  ]),
  alt: t(
    "A lamppost of height H and a person of height h at distance x from it; the ray from the lamp over the person's head reaches the ground at the end of the shadow s, forming two similar right triangles.",
    "高为 H 的路灯和离它 x 远、身高为 h 的人；从灯经过人头顶的光线落在影子 s 的末端，形成两个相似的直角三角形。",
  ),
};

/** coneRim is an ellipse drawn as the rim of a cone at height y with radius r. */
const coneRim = (y: number, r: number): Point[] =>
  Array.from({ length: 48 }, (_, i) => [r * Math.cos((i * Math.PI) / 24), y + 0.25 * r * Math.sin((i * Math.PI) / 24)]);

/** coneFigure shows an inverted cone of radius R and height H holding water of depth h and surface radius r. */
const coneFigure: Figure = {
  svg: sketch([
    {
      kind: "shade",
      points: [
        [0, 0],
        [1.2, 3],
        [-1.2, 3],
      ],
    },
    { kind: "shade", points: coneRim(3, 1.2) },
    { kind: "polygon", points: coneRim(5, 2) },
    { kind: "polygon", points: coneRim(3, 1.2) },
    { kind: "segment", a: [0, 0], b: [2, 5] },
    { kind: "segment", a: [0, 0], b: [-2, 5] },
    { kind: "segment", a: [0, 0], b: [0, 5], dashed: true },
    { kind: "segment", a: [0, 5], b: [2, 5], dashed: true },
    { kind: "segment", a: [0, 3], b: [1.2, 3], dashed: true },
    { kind: "segment", a: [3, 0], b: [3, 5] },
    { kind: "segment", a: [-3, 0], b: [-3, 3] },
    { kind: "label", at: [1, 5], text: "R", dir: "s" },
    { kind: "label", at: [0.6, 3], text: "r", dir: "s" },
    { kind: "label", at: [3, 2.5], text: "H", dir: "e" },
    { kind: "label", at: [-3, 1.5], text: "h", dir: "w" },
  ] satisfies Mark[]),
  alt: t(
    "An inverted cone with top radius R and height H holds water of depth h whose surface has radius r; the water forms a smaller cone similar to the whole.",
    "顶面半径为 R、高为 H 的倒立圆锥中盛有深度为 h 的水，水面半径为 r；水形成一个与整个圆锥相似的小圆锥。",
  ),
};

/** shadowCase is a person, a lamppost and a walking speed, in meters and meters per second. */
function shadowCase(rng: Rng) {
  const h = Q.of(rng.pick([15, 16, 18, 20]), 10);
  const H = h.add(Q.of(rng.int(2, 8) * 5, 10));
  const v = Q.of(rng.int(5, 20), 10);
  return { h, H, v, ratio: h.div(H.sub(h)) };
}

/** calculatingRelatedRatesUsingSimilarTriangles relates rates through similar triangles. */
export const calculatingRelatedRatesUsingSimilarTriangles: TopicDef = {
  id: "calculating-related-rates-using-similar-triangles",
  title: t("Calculating Related Rates Using Similar Triangles", "用相似三角形计算相关变化率"),
  summary: t(
    "Use similar triangles to link two lengths, then relate their rates: shadows cast by lampposts.",
    "用相似三角形联系两段长度，再联系它们的变化率：路灯下的影子。",
  ),
  intro: t(
    "A person $2$ m tall walks away from a $6$ m lamppost at $1$ m/s. The ray from the lamp over the head makes two similar triangles, so $\\frac{s}{2} = \\frac{x + s}{6}$, which gives $6s = 2x + 2s$ and $s = \\frac{1}{2}x$. Then $\\frac{ds}{dt} = \\frac{1}{2}\\frac{dx}{dt} = 0.5$ m/s.\n\nCheck: at $x = 4$ the shadow is $2$ m, so its tip is $6$ m from the post. The ray from the lamp, $6$ m up, to that tip drops $1$ m for each meter, and $4$ m out it is $2$ m up: exactly the top of the head.\n\nIn this lesson we use similar triangles to link the length of a shadow, and the position of its tip, to the walker's distance, and then relate their rates.",
    "一个身高 $2$ m 的人以 $1$ m/s 的速度从高 $6$ m 的路灯下走开。从灯经过头顶的光线形成两个相似三角形，所以 $\\frac{s}{2} = \\frac{x + s}{6}$，得 $6s = 2x + 2s$，$s = \\frac{1}{2}x$。于是 $\\frac{ds}{dt} = \\frac{1}{2}\\frac{dx}{dt} = 0.5$ m/s。\n\n检验：当 $x = 4$ 时影长为 $2$ m，影子顶端离灯柱 $6$ m。从高 $6$ m 的灯到这一点的光线每前进 $1$ m 下降 $1$ m，在离灯柱 $4$ m 处高 $2$ m：恰好是头顶。\n\n本课我们用相似三角形把影子的长度和影子顶端的位置与行人的距离联系起来，再联系它们的变化率。",
  ),
  prerequisites: ["introduction-to-related-rates", "the-aa-similarity-criterion"],
  encompasses: [{ topic: "introduction-to-related-rates", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "lengths-of-shadows",
      title: t("Lengths of shadows", "影子的长度"),
      explanation: t(
        "A person of height $h$ walks away from a lamppost of height $H$. With $x$ the distance from the post and $s$ the shadow's length, similar triangles give $\\frac{s}{h} = \\frac{x + s}{H}$, so $s = \\frac{h}{H - h}x$ and\n\n$$\\frac{ds}{dt} = \\frac{h}{H - h}\\frac{dx}{dt}.$$\n\nFor a $2$ m person walking at $1.5$ m/s from a $6$ m post: $s = \\frac{2}{4}x = \\frac{1}{2}x$ and $\\frac{ds}{dt} = 0.75$ m/s.\n\nCheck: at $x = 4$ the shadow is $2$ m. The ray from the top of the post to the shadow's tip, $6$ m out, drops $1$ m for each meter, so $4$ m out it is $2$ m up, just over the head.\n\n> **Watch out.** The large triangle's base is $x + s$, from the post to the tip of the shadow, not $x$. The rate of the shadow does not depend on how far the person has walked.",
        "身高为 $h$ 的人从高为 $H$ 的路灯下走开。设人离灯柱的距离为 $x$，影长为 $s$，由相似三角形得 $\\frac{s}{h} = \\frac{x + s}{H}$，所以 $s = \\frac{h}{H - h}x$，\n\n$$\\frac{ds}{dt} = \\frac{h}{H - h}\\frac{dx}{dt}.$$\n\n身高 $2$ m 的人以 $1.5$ m/s 的速度从高 $6$ m 的灯柱下走开：$s = \\frac{2}{4}x = \\frac{1}{2}x$，$\\frac{ds}{dt} = 0.75$ m/s。\n\n检验：当 $x = 4$ 时影长为 $2$ m。从灯柱顶端到离灯柱 $6$ m 的影子顶端的光线每前进 $1$ m 下降 $1$ m，在 $4$ m 处高 $2$ m，正好经过头顶。\n\n> **注意。** 大三角形的底是从灯柱到影子顶端的 $x + s$，不是 $x$。影子的变化率与人已走出多远无关。",
      ),
      figure: lamppostFigure,
      generate(rng) {
        const { h, H, v, ratio } = shadowCase(rng);
        const answer = ratio.mul(v);
        const n = (q: Q) => decimal(q);
        const s10 = ratio.mul(Q.of(10));
        return numberProblem({
          prompt: t(
            `A person $${n(h)}$ m tall walks away from ${article(n(H))} $${n(H)}$ m lamppost at $${n(v)}$ m/s. How fast is the length of their shadow increasing, in m/s?`,
            `一个身高 $${n(h)}$ m 的人以 $${n(v)}$ m/s 的速度从高 $${n(H)}$ m 的路灯下走开。他的影子长度增加的速率是多少（m/s）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              h.div(H).mul(v),
              "This uses $\\frac{s}{x} = \\frac{h}{H}$. The large triangle's base runs from the post to the tip of the shadow, $x + s$.",
              "这用的是 $\\frac{s}{x} = \\frac{h}{H}$。大三角形的底是从灯柱到影子顶端的 $x + s$。",
            ),
            why(
              H.div(H.sub(h)).mul(v),
              "This is the speed of the tip of the shadow, $\\frac{d(x + s)}{dt}$, not the rate of the shadow's length.",
              "这是影子顶端的速度 $\\frac{d(x + s)}{dt}$，不是影长的变化率。",
            ),
            why(
              v,
              "This is the walking speed. The shadow grows at a fixed fraction of it.",
              "这是行走的速度。影长以它的一个固定倍数增长。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Relate the lengths", "联系长度"],
                t("Similar triangles give", "由相似三角形得"),
                [`\\frac{s}{${n(h)}} = \\frac{x + s}{${n(H)}}, \\qquad ${n(H)}s = ${n(h)}x + ${n(h)}s, \\qquad s = ${L(ratio)}x`],
              ],
              [
                ["Differentiate", "求导"],
                t(`With $\\frac{dx}{dt} = ${n(v)}$:`, `代入 $\\frac{dx}{dt} = ${n(v)}$：`),
                [`\\frac{ds}{dt} = ${L(ratio)} \\cdot ${n(v)} = ${L(answer)}`],
              ],
            ],
            t(
              `At $x = 10$ the formula gives $s = ${L(s10)}${s10.isInteger() ? "" : ` \\approx ${fmt(s10.toNumber())}`}$. The ray drops $${n(H)}$ m over the $${fmt(10 + s10.toNumber())}$ m from the post to the tip, a slope of $${fmt(H.toNumber() / (10 + s10.toNumber()))}$, and $${n(h)}$ m over the shadow, a slope of $${fmt(h.toNumber() / s10.toNumber())}$: the same, so the ray grazes the head. Each meter walked adds $${L(ratio)}$ m of shadow.`,
              `当 $x = 10$ 时，公式给出 $s = ${L(s10)}${s10.isInteger() ? "" : ` \\approx ${fmt(s10.toNumber())}`}$。光线在从灯柱到影子顶端的 $${fmt(10 + s10.toNumber())}$ m 上下降 $${n(H)}$ m，斜率为 $${fmt(H.toNumber() / (10 + s10.toNumber()))}$；在影子上下降 $${n(h)}$ m，斜率为 $${fmt(h.toNumber() / s10.toNumber())}$：两者相同，所以光线正好经过头顶。每走 $1$ m，影子增长 $${L(ratio)}$ m。`,
            ),
          ),
        });
      },
    },
    {
      id: "tips-of-shadows",
      title: t("Tips of shadows", "影子顶端的速度"),
      explanation: t(
        "The tip of the shadow is $x + s = \\frac{H}{H - h}x$ from the post, so it moves at $\\frac{H}{H - h}\\frac{dx}{dt}$, faster than the person walks. For a $2$ m person walking at $1.5$ m/s from a $6$ m post, the tip moves at $\\frac{6}{4} \\cdot 1.5 = 2.25$ m/s.\n\nCheck: the tip moves with the person and also gets farther ahead as the shadow grows: $1.5 + 0.75 = 2.25$ m/s.\n\n> **Watch out.** The tip's position is measured from the post, $x + s$; the rate of $s$ alone is how fast the tip pulls away from the person.",
        "影子的顶端离灯柱 $x + s = \\frac{H}{H - h}x$，所以它移动的速度为 $\\frac{H}{H - h}\\frac{dx}{dt}$，比人走得快。身高 $2$ m 的人以 $1.5$ m/s 的速度从高 $6$ m 的灯柱下走开，影子顶端的速度为 $\\frac{6}{4} \\cdot 1.5 = 2.25$ m/s。\n\n检验：影子顶端随人一起移动，又因影子变长而越来越超前：$1.5 + 0.75 = 2.25$ m/s。\n\n> **注意。** 影子顶端的位置从灯柱量起，是 $x + s$；单独 $s$ 的变化率是顶端离开人的速度。",
      ),
      figure: lamppostFigure,
      generate(rng) {
        const { h, H, v, ratio: grow } = shadowCase(rng);
        const ratio = H.div(H.sub(h));
        const answer = ratio.mul(v);
        const n = (q: Q) => decimal(q);
        return numberProblem({
          prompt: t(
            `A person $${n(h)}$ m tall walks away from ${article(n(H))} $${n(H)}$ m lamppost at $${n(v)}$ m/s. How fast is the tip of their shadow moving away from the lamppost, in m/s?`,
            `一个身高 $${n(h)}$ m 的人以 $${n(v)}$ m/s 的速度从高 $${n(H)}$ m 的路灯下走开。他的影子顶端远离灯柱的速度是多少（m/s）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              grow.mul(v),
              "This is how fast the shadow's length grows. The tip also moves with the person, so add the walking speed.",
              "这是影长增长的速率。影子顶端还随人一起移动，要再加上行走速度。",
            ),
            why(
              v,
              "This is the walking speed; the tip moves faster, because the shadow lengthens too.",
              "这是行走速度；影子顶端移动得更快，因为影子也在变长。",
            ),
            why(
              h.div(H).mul(v),
              "This uses the ratio $\\frac{h}{H}$, which does not come from the similar triangles.",
              "这用的是比 $\\frac{h}{H}$，它不是由相似三角形得到的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the tip", "确定顶端位置"],
                t(`Similar triangles give $s = ${L(grow)}x$, so the tip is at`, `由相似三角形得 $s = ${L(grow)}x$，所以顶端位于`),
                [`x + s = x + ${L(grow)}x = ${L(ratio)}x`],
              ],
              [
                ["Differentiate", "求导"],
                t(`With $\\frac{dx}{dt} = ${n(v)}$:`, `代入 $\\frac{dx}{dt} = ${n(v)}$：`),
                [`\\frac{d(x + s)}{dt} = ${L(ratio)} \\cdot ${n(v)} = ${L(answer)}`],
              ],
            ],
            t(
              `The tip moves with the person at $${n(v)}$ m/s and pulls ahead as the shadow grows at $${L(grow)} \\cdot ${n(v)} = ${L(grow.mul(v))}$ m/s: together $${L(answer)}$ m/s.`,
              `影子顶端随人以 $${n(v)}$ m/s 移动，又因影子以 $${L(grow)} \\cdot ${n(v)} = ${L(grow.mul(v))}$ m/s 变长而超前：合起来是 $${L(answer)}$ m/s。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesUsingTrigonometry relates rates of angles and lengths. */
export const calculatingRelatedRatesUsingTrigonometry: TopicDef = {
  id: "calculating-related-rates-using-trigonometry",
  title: t("Calculating Related Rates Using Trigonometry", "用三角函数计算相关变化率"),
  summary: t(
    "Relate the rate of change of an angle to the rates of change of lengths through trigonometric ratios.",
    "通过三角比联系角的变化率与长度的变化率。",
  ),
  intro: t(
    "A rocket rises straight up at $10$ m/s, watched from $100$ m away. With $y$ its height and $\\theta$ the angle of elevation, $\\tan\\theta = \\frac{y}{100}$, so $\\sec^{2}\\theta\\frac{d\\theta}{dt} = \\frac{1}{100}\\frac{dy}{dt}$. When $y = 100$, $\\theta = \\frac{\\pi}{4}$ and $\\sec^{2}\\theta = 2$, so $\\frac{d\\theta}{dt} = \\frac{10}{200} = 0.05$ radians per second.\n\nCheck: one second later $y = 110$ and $\\theta = \\arctan 1.1 \\approx 0.8330$, against $\\frac{\\pi}{4} \\approx 0.7854$: an increase of about $0.048$ radians, close to $0.05$.\n\nIn this lesson we write a trigonometric ratio linking an angle to lengths, differentiate it, and find the rate of the angle or of a length.",
    "火箭以 $10$ m/s 的速度竖直上升，观察者在 $100$ m 外。设火箭高度为 $y$，仰角为 $\\theta$，则 $\\tan\\theta = \\frac{y}{100}$，所以 $\\sec^{2}\\theta\\frac{d\\theta}{dt} = \\frac{1}{100}\\frac{dy}{dt}$。当 $y = 100$ 时，$\\theta = \\frac{\\pi}{4}$，$\\sec^{2}\\theta = 2$，所以 $\\frac{d\\theta}{dt} = \\frac{10}{200} = 0.05$ 弧度每秒。\n\n检验：一秒后 $y = 110$，$\\theta = \\arctan 1.1 \\approx 0.8330$，而原来是 $\\frac{\\pi}{4} \\approx 0.7854$：约增加 $0.048$ 弧度，接近 $0.05$。\n\n本课我们写出联系角与长度的三角比，对它求导，求出角或长度的变化率。",
  ),
  prerequisites: ["introduction-to-related-rates"],
  encompasses: [
    { topic: "introduction-to-related-rates", weight: 0.3 },
    { topic: "differentiating-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-change-of-angles",
      figure: calculusDrawings2["calculating-related-rates-using-trigonometry#rates-of-change-of-angles"],
      title: t("Rates of change of angles", "角的变化率"),
      explanation: t(
        "A plane flies at constant altitude $h$ toward an observer. With $x$ its horizontal distance and $\\theta$ its angle of elevation, $\\tan\\theta = \\frac{h}{x}$. Differentiating, $\\sec^{2}\\theta\\frac{d\\theta}{dt} = -\\frac{h}{x^{2}}\\frac{dx}{dt}$, and since $\\sec^{2}\\theta = \\frac{x^{2} + h^{2}}{x^{2}}$,\n\n$$\\frac{d\\theta}{dt} = -\\frac{h}{x^{2} + h^{2}}\\frac{dx}{dt}.$$\n\nWith $h = 4$, $x = 3$ and the plane approaching at $500$ km/h, $\\frac{dx}{dt} = -500$ and $\\frac{d\\theta}{dt} = \\frac{4 \\cdot 500}{25} = 80$ radians per hour.\n\nCheck: differentiate $\\theta = \\arctan\\frac{4}{x}$ directly: $\\frac{d\\theta}{dt} = \\frac{1}{1 + \\frac{16}{9}} \\cdot \\frac{4}{9} \\cdot 500 = \\frac{9}{25} \\cdot \\frac{2000}{9} = 80$.\n\n> **Watch out.** The denominator is $x^{2} + h^{2}$, the squared distance to the plane, not $x^{2}$. A plane approaching has $\\frac{dx}{dt} < 0$, and its angle increases.",
        "飞机在高度 $h$ 处水平飞向观察者。设水平距离为 $x$，仰角为 $\\theta$，则 $\\tan\\theta = \\frac{h}{x}$。求导得 $\\sec^{2}\\theta\\frac{d\\theta}{dt} = -\\frac{h}{x^{2}}\\frac{dx}{dt}$，又 $\\sec^{2}\\theta = \\frac{x^{2} + h^{2}}{x^{2}}$，所以\n\n$$\\frac{d\\theta}{dt} = -\\frac{h}{x^{2} + h^{2}}\\frac{dx}{dt}.$$\n\n当 $h = 4$，$x = 3$，飞机以 $500$ km/h 飞近时，$\\frac{dx}{dt} = -500$，$\\frac{d\\theta}{dt} = \\frac{4 \\cdot 500}{25} = 80$ 弧度每小时。\n\n检验：直接对 $\\theta = \\arctan\\frac{4}{x}$ 求导：$\\frac{d\\theta}{dt} = \\frac{1}{1 + \\frac{16}{9}} \\cdot \\frac{4}{9} \\cdot 500 = \\frac{9}{25} \\cdot \\frac{2000}{9} = 80$。\n\n> **注意。** 分母是到飞机距离的平方 $x^{2} + h^{2}$，不是 $x^{2}$。飞机飞近时 $\\frac{dx}{dt} < 0$，仰角增大。",
      ),
      generate(rng) {
        const h = rng.int(2, 9);
        const x0 = rng.int(2, 15);
        const v = rng.int(2, 12) * 50;
        const d2 = x0 * x0 + h * h;
        const answer = Q.of(h * v, d2);
        return numberProblem({
          prompt: t(
            `A plane flies horizontally at an altitude of $${h}$ km toward an observer on the ground, at $${v}$ km/h. How fast is the angle of elevation from the observer to the plane increasing, in radians per hour, when the plane is $${x0}$ km away horizontally?`,
            `飞机在 $${h}$ km 的高度以 $${v}$ km/h 的速度水平飞向地面上的观察者。当飞机与观察者的水平距离为 $${x0}$ km 时，观察者看飞机的仰角增大的速率是多少（弧度每小时）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.of(h * v, x0 * x0),
              "This leaves out $\\sec^{2}\\theta$: dividing by it turns $x^{2}$ into $x^{2} + h^{2}$.",
              "这漏掉了 $\\sec^{2}\\theta$：除以它会把 $x^{2}$ 变成 $x^{2} + h^{2}$。",
            ),
            why(
              Q.of(x0 * v, d2),
              `This puts the distance $${x0}$ on top in place of the altitude $${h}$.`,
              `这把分子上的高度 $${h}$ 换成了距离 $${x0}$。`,
            ),
            why(
              Q.of(v, h),
              "This divides the speed by the altitude, as if the plane were straight overhead.",
              "这是用速度除以高度，好像飞机就在头顶正上方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the ratio", "对三角比求导"],
                t(
                  `$\\tan\\theta = \\frac{${h}}{x}$; differentiate and use $\\sec^{2}\\theta = \\frac{x^{2} + ${h * h}}{x^{2}}$:`,
                  `$\\tan\\theta = \\frac{${h}}{x}$；求导，并用 $\\sec^{2}\\theta = \\frac{x^{2} + ${h * h}}{x^{2}}$：`,
                ),
                [
                  `\\sec^{2}\\theta\\frac{d\\theta}{dt} = -\\frac{${h}}{x^{2}}\\frac{dx}{dt}, \\qquad \\frac{d\\theta}{dt} = -\\frac{${h}}{x^{2} + ${h * h}}\\frac{dx}{dt}`,
                ],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `The plane approaches, so $\\frac{dx}{dt} = -${v}$; with $x = ${x0}$:`,
                  `飞机在飞近，所以 $\\frac{dx}{dt} = -${v}$；代入 $x = ${x0}$：`,
                ),
                [`\\frac{d\\theta}{dt} = \\frac{${h} \\cdot ${v}}{${d2}} = ${L(answer)}`],
              ],
            ],
            t(
              `Differentiate $\\theta = \\arctan\\frac{${h}}{x}$ directly: $\\frac{d\\theta}{dt} = \\frac{1}{1 + \\left(\\frac{${h}}{${x0}}\\right)^{2}} \\cdot \\frac{${h}}{${x0 * x0}} \\cdot ${v} = \\frac{${x0 * x0}}{${d2}} \\cdot \\frac{${h * v}}{${x0 * x0}} = ${L(answer)}$.`,
              `直接对 $\\theta = \\arctan\\frac{${h}}{x}$ 求导：$\\frac{d\\theta}{dt} = \\frac{1}{1 + \\left(\\frac{${h}}{${x0}}\\right)^{2}} \\cdot \\frac{${h}}{${x0 * x0}} \\cdot ${v} = \\frac{${x0 * x0}}{${d2}} \\cdot \\frac{${h * v}}{${x0 * x0}} = ${L(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rates-of-change-of-lengths-from-angles",
      figure: calculusDrawings2["calculating-related-rates-using-trigonometry#rates-of-change-of-lengths-from-angles"],
      title: t("Rates of change of lengths from angles", "由角求长度的变化率"),
      explanation: t(
        "A searchlight $d$ m from a wall rotates at $\\frac{d\\theta}{dt}$ radians per second. The spot is $x = d\\tan\\theta$ along the wall from the nearest point, so\n\n$$\\frac{dx}{dt} = d\\sec^{2}\\theta\\frac{d\\theta}{dt}.$$\n\nAt $\\theta = \\frac{\\pi}{4}$, $\\sec^{2}\\theta = 2$; with $d = 10$ and $\\frac{d\\theta}{dt} = 0.5$, $\\frac{dx}{dt} = 10 \\cdot 2 \\cdot 0.5 = 10$ m/s.\n\nCheck: $0.001$ s before and after, the angle is $\\frac{\\pi}{4} \\mp 0.0005$, and $\\frac{10\\tan(0.78590) - 10\\tan(0.78490)}{0.002} \\approx 10.0000$.\n\n> **Watch out.** The angle must be in radians, and $\\sec^{2}\\theta = \\frac{1}{\\cos^{2}\\theta}$, not $\\cos^{2}\\theta$. The angle is measured from the perpendicular to the wall.",
        "探照灯距墙 $d$ m，以 $\\frac{d\\theta}{dt}$ 弧度每秒的速率转动。光斑沿墙到最近点的距离为 $x = d\\tan\\theta$，所以\n\n$$\\frac{dx}{dt} = d\\sec^{2}\\theta\\frac{d\\theta}{dt}.$$\n\n在 $\\theta = \\frac{\\pi}{4}$ 时，$\\sec^{2}\\theta = 2$；当 $d = 10$，$\\frac{d\\theta}{dt} = 0.5$ 时，$\\frac{dx}{dt} = 10 \\cdot 2 \\cdot 0.5 = 10$ m/s。\n\n检验：前后各 $0.001$ s，角为 $\\frac{\\pi}{4} \\mp 0.0005$，$\\frac{10\\tan(0.78590) - 10\\tan(0.78490)}{0.002} \\approx 10.0000$。\n\n> **注意。** 角必须用弧度，且 $\\sec^{2}\\theta = \\frac{1}{\\cos^{2}\\theta}$，不是 $\\cos^{2}\\theta$。角是从墙的垂线量起的。",
      ),
      generate(rng) {
        const d = rng.int(2, 30);
        const w = Q.of(rng.int(1, 5), rng.pick([1, 2, 4, 10]));
        const [angle, sec2, theta] = rng.pick([
          ["\\frac{\\pi}{6}", Q.of(4, 3), Math.PI / 6],
          ["\\frac{\\pi}{4}", Q.of(2), Math.PI / 4],
          ["\\frac{\\pi}{3}", Q.of(4), Math.PI / 3],
        ] as const);
        const answer = w.mul(sec2).mul(Q.of(d));
        const e = 0.001;
        const turn = w.toNumber() * e;
        const central = (d * Math.tan(theta + turn) - d * Math.tan(theta - turn)) / (2 * e);
        return numberProblem({
          prompt: t(
            `A searchlight $${d}$ m from a straight wall rotates at $${L(w)}$ radians per second. How fast is the spot of light moving along the wall, in m/s, when the beam makes an angle of $${angle}$ with the perpendicular to the wall?`,
            `探照灯距一面笔直的墙 $${d}$ m，以 $${L(w)}$ 弧度每秒的速率转动。当光束与墙的垂线成 $${angle}$ 角时，光斑沿墙移动的速度是多少（m/s）？`,
          ),
          answer,
          mistakes: firsts([
            why(
              w.mul(Q.of(d)),
              "This leaves out $\\sec^{2}\\theta$, the derivative of $\\tan\\theta$.",
              "这漏掉了 $\\tan\\theta$ 的导数 $\\sec^{2}\\theta$。",
            ),
            why(
              w.mul(Q.of(d)).div(sec2),
              "This multiplies by $\\cos^{2}\\theta$; the derivative of $\\tan\\theta$ is $\\sec^{2}\\theta = \\frac{1}{\\cos^{2}\\theta}$.",
              "这是乘以 $\\cos^{2}\\theta$；$\\tan\\theta$ 的导数是 $\\sec^{2}\\theta = \\frac{1}{\\cos^{2}\\theta}$。",
            ),
            why(answer.mul(Q.of(d)), `This multiplies by the distance $${d}$ twice.`, `这把距离 $${d}$ 乘了两次。`),
          ]),
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                t(`The spot is at $x = ${d}\\tan\\theta$, so`, `光斑位于 $x = ${d}\\tan\\theta$，所以`),
                [`\\frac{dx}{dt} = ${d}\\sec^{2}\\theta\\frac{d\\theta}{dt}`],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `At $\\theta = ${angle}$, $\\sec^{2}\\theta = ${L(sec2)}$:`,
                  `在 $\\theta = ${angle}$ 时，$\\sec^{2}\\theta = ${L(sec2)}$：`,
                ),
                [`\\frac{dx}{dt} = ${d} \\cdot ${L(sec2)} \\cdot ${L(w)} = ${L(answer)}`],
              ],
            ],
            t(
              `In $0.001$ s before and after, the beam turns $${fmt(turn)}$ radians each way, and the spot moves from $${d}\\tan\\left(${angle} - ${fmt(turn)}\\right)$ to $${d}\\tan\\left(${angle} + ${fmt(turn)}\\right)$; divided by $0.002$ s that is about $${fmt(central)}$ m/s, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `前后各 $0.001$ s 内光束各转过 $${fmt(turn)}$ 弧度，光斑从 $${d}\\tan\\left(${angle} - ${fmt(turn)}\\right)$ 移到 $${d}\\tan\\left(${angle} + ${fmt(turn)}\\right)$；除以 $0.002$ s 约为 $${fmt(central)}$ m/s，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesWithCones relates the depth and volume of liquid in conical tanks. */
export const calculatingRelatedRatesWithCones: TopicDef = {
  id: "calculating-related-rates-with-cones",
  title: t("Calculating Related Rates With Cones", "圆锥的相关变化率"),
  summary: t(
    "Relate the rates of change of the depth and the volume of liquid in an inverted conical tank.",
    "联系倒立圆锥形容器中液体深度与体积的变化率。",
  ),
  intro: t(
    "Water pours at $2$ m³/min into an inverted cone of top radius $2$ m and height $4$ m. By similar triangles the surface radius is $r = \\frac{1}{2}h$, so $V = \\frac{1}{3}\\pi\\left(\\frac{h}{2}\\right)^{2}h = \\frac{\\pi}{12}h^{3}$ and $\\frac{dV}{dt} = \\frac{\\pi}{4}h^{2}\\frac{dh}{dt}$. When $h = 2$: $2 = \\pi\\frac{dh}{dt}$, so the level rises at $\\frac{2}{\\pi} \\approx 0.64$ m/min.\n\nCheck: at that moment the water's surface is a circle of radius $1$ m and area $\\pi$ m²; spreading $2$ m³ per minute over it raises the level about $\\frac{2}{\\pi}$ m per minute.\n\nIn this lesson we use similar triangles to write the volume of water in a cone in terms of its depth alone, and then relate the rates of the depth and the volume.",
    "水以 $2$ m³/min 的速率注入顶面半径 $2$ m、高 $4$ m 的倒立圆锥。由相似三角形，水面半径为 $r = \\frac{1}{2}h$，所以 $V = \\frac{1}{3}\\pi\\left(\\frac{h}{2}\\right)^{2}h = \\frac{\\pi}{12}h^{3}$，$\\frac{dV}{dt} = \\frac{\\pi}{4}h^{2}\\frac{dh}{dt}$。当 $h = 2$ 时：$2 = \\pi\\frac{dh}{dt}$，所以水面以 $\\frac{2}{\\pi} \\approx 0.64$ m/min 的速率上升。\n\n检验：此时水面是半径 $1$ m、面积 $\\pi$ m² 的圆；每分钟 $2$ m³ 的水铺在上面，使水面每分钟约上升 $\\frac{2}{\\pi}$ m。\n\n本课我们用相似三角形把圆锥中水的体积只用深度表示，再联系深度与体积的变化率。",
  ),
  prerequisites: ["calculating-related-rates-using-similar-triangles", "volumes-of-right-cones"],
  encompasses: [
    { topic: "calculating-related-rates-using-similar-triangles", weight: 0.4 },
    { topic: "volumes-of-right-cones", weight: 0.1 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-depth-in-conical-tanks",
      title: t("Rates of depth in conical tanks", "圆锥形容器中液面深度的变化率"),
      explanation: t(
        "In an inverted cone of radius $R$ and height $H$, water of depth $h$ has surface radius $r = \\frac{R}{H}h$ by similar triangles, so $V = \\frac{1}{3}\\pi\\left(\\frac{R}{H}\\right)^{2}h^{3}$ and\n\n$$\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}.$$\n\nFor $R = 3$, $H = 6$, $h = 2$ and $\\frac{dV}{dt} = 4$: $4 = \\pi \\cdot \\frac{1}{4} \\cdot 4\\frac{dh}{dt} = \\pi\\frac{dh}{dt}$, so $\\frac{dh}{dt} = \\frac{4}{\\pi}$.\n\nCheck: the surface then has radius $1$ and area $\\pi$, and $4$ units of volume a second spread over it raise the level $\\frac{4}{\\pi}$ a second.\n\n> **Watch out.** Eliminate $r$ before differentiating, since $h$ is the variable whose rate is wanted. Treating $r$ as a constant, or setting $r = h$, gives the wrong rate.",
        "在半径为 $R$、高为 $H$ 的倒立圆锥中，深度为 $h$ 的水面半径由相似三角形得 $r = \\frac{R}{H}h$，所以 $V = \\frac{1}{3}\\pi\\left(\\frac{R}{H}\\right)^{2}h^{3}$，\n\n$$\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}.$$\n\n当 $R = 3$，$H = 6$，$h = 2$，$\\frac{dV}{dt} = 4$ 时：$4 = \\pi \\cdot \\frac{1}{4} \\cdot 4\\frac{dh}{dt} = \\pi\\frac{dh}{dt}$，所以 $\\frac{dh}{dt} = \\frac{4}{\\pi}$。\n\n检验：此时水面半径为 $1$，面积为 $\\pi$，每秒 $4$ 个单位体积铺在上面，使水面每秒上升 $\\frac{4}{\\pi}$。\n\n> **注意。** 求导前先消去 $r$，因为要求的是 $h$ 的变化率。把 $r$ 当作常数，或令 $r = h$，都会得到错误的变化率。",
      ),
      figure: coneFigure,
      generate(rng) {
        const [R, H] = rng.pick([
          [2, 4],
          [3, 6],
          [3, 9],
          [4, 8],
          [4, 6],
          [5, 10],
          [6, 9],
          [2, 6],
        ] as const);
        const rho = Q.of(R, H);
        const h0 = rng.int(1, H - 1);
        const q = rng.int(1, 12);
        const k = rho.mul(rho).mul(Q.of(h0 * h0));
        const answer = overPi(Q.of(q).div(k));
        const r0 = rho.mul(Q.of(h0));
        return functionWith(
          {
            prompt: t(
              `Water flows at $${q}$ m³/min into a tank shaped like an inverted cone, with top radius $${R}$ m and height $${H}$ m. How fast is the water level rising when the water is $${h0}$ m deep? Give your answer in m/min, in terms of $\\pi$.`,
              `水以 $${q}$ m³/min 的速率注入一个倒立圆锥形水箱，水箱顶部半径为 $${R}$ m，高为 $${H}$ m。当水深为 $${h0}$ m 时，水面上升的速率是多少？用 $\\pi$ 表示，单位为 m/min。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Eliminate the radius", "消去半径"],
                  t("By similar triangles $r = \\frac{R}{H}h$, so", "由相似三角形 $r = \\frac{R}{H}h$，所以"),
                  [
                    `r = ${L(rho)}h, \\qquad V = \\frac{1}{3}\\pi\\left(${L(rho)}h\\right)^{2}h = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}`,
                  ],
                ],
                [
                  ["Differentiate", "求导"],
                  t("Differentiate with respect to $t$:", "对 $t$ 求导："),
                  [`\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt}`],
                ],
                [
                  ["Substitute and solve", "代入并求解"],
                  t(`Put in $h = ${h0}$ and $\\frac{dV}{dt} = ${q}$:`, `代入 $h = ${h0}$，$\\frac{dV}{dt} = ${q}$：`),
                  [`${q} = ${piTimes(k)}\\frac{dh}{dt}, \\qquad \\frac{dh}{dt} = ${answer}`],
                ],
              ],
              t(
                `At that depth the surface has radius $${L(r0)}$ m and area $${piTimes(r0.mul(r0))}$ m². Spreading $${q}$ m³ a minute over it raises the level $${q} \\div ${piTimes(r0.mul(r0))} = ${answer}$ m a minute.`,
                `在这个深度水面半径为 $${L(r0)}$ m，面积为 $${piTimes(r0.mul(r0))}$ m²。每分钟 $${q}$ m³ 的水铺在上面，使水面每分钟上升 $${q} \\div ${piTimes(r0.mul(r0))} = ${answer}$ m。`,
              ),
            ),
          },
          [
            say(
              overPi(Q.of(q, h0 * h0)),
              "This sets $r = h$, leaving out the ratio $\\frac{R}{H}$ from the similar triangles.",
              "这是令 $r = h$，漏掉了相似三角形给出的比 $\\frac{R}{H}$。",
            ),
            say(
              overPi(Q.of(3 * q).div(k)),
              "This leaves out the $3$ that the power rule brings down from $h^{3}$, so the $\\frac{1}{3}$ stays.",
              "这漏掉了幂法则从 $h^{3}$ 带下来的 $3$，于是 $\\frac{1}{3}$ 没有约掉。",
            ),
            say(
              overPi(Q.of(q).div(k.mul(Q.of(h0)))),
              "This divides by $h^{3}$ from the volume instead of $h^{2}$ from its derivative.",
              "这是除以体积中的 $h^{3}$，而应该除以导数中的 $h^{2}$。",
            ),
          ],
        );
      },
    },
    {
      id: "rates-of-volume-in-conical-tanks",
      title: t("Rates of volume in conical tanks", "圆锥形容器中体积的变化率"),
      explanation: t(
        "If the depth's rate is known, $\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}$ gives the rate at which the volume changes. For $R = 2$, $H = 4$, $h = 3$ and a level falling at $0.5$ m/min: $\\frac{dV}{dt} = \\pi \\cdot \\frac{1}{4} \\cdot 9 \\cdot (-0.5) = -\\frac{9\\pi}{8}$ m³/min.\n\nCheck: the surface has radius $1.5$ and area $2.25\\pi$; a layer of that area falling $0.5$ m a minute loses $1.125\\pi = \\frac{9\\pi}{8}$ m³ a minute.\n\n> **Watch out.** The $3$ from the power rule cancels the $\\frac{1}{3}$ of the cone's volume. A falling level gives a negative rate.",
        "已知深度的变化率时，由 $\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}$ 求体积的变化率。当 $R = 2$，$H = 4$，$h = 3$，水面以 $0.5$ m/min 下降时：$\\frac{dV}{dt} = \\pi \\cdot \\frac{1}{4} \\cdot 9 \\cdot (-0.5) = -\\frac{9\\pi}{8}$ m³/min。\n\n检验：水面半径为 $1.5$，面积为 $2.25\\pi$；这样一层每分钟下降 $0.5$ m，每分钟减少 $1.125\\pi = \\frac{9\\pi}{8}$ m³。\n\n> **注意。** 幂法则带下的 $3$ 与圆锥体积中的 $\\frac{1}{3}$ 约掉。液面下降时变化率为负。",
      ),
      figure: coneFigure,
      generate(rng) {
        const [R, H] = rng.pick([
          [2, 4],
          [3, 6],
          [3, 9],
          [4, 8],
          [5, 10],
          [2, 6],
          [6, 12],
        ] as const);
        const rho = Q.of(R, H);
        const h0 = rng.int(1, H - 1);
        const v = Q.of(rng.nonZero(-5, 5), rng.pick([1, 2, 4, 10]));
        const c = rho
          .mul(rho)
          .mul(Q.of(h0 * h0))
          .mul(v);
        const answer = piTimes(c);
        const e = 0.001;
        const cube = (x: number) => x ** 3;
        const grown = ((rho.toNumber() ** 2 / 3) * (cube(h0 + e * v.toNumber()) - cube(h0))) / e;
        return functionWith(
          {
            prompt: t(
              `A tank shaped like an inverted cone has top radius $${R}$ m and height $${H}$ m. The water level is ${v.sign() > 0 ? "rising" : "falling"} at $${L(v.abs())}$ m/min. Find the rate of change of the volume of water, in m³/min, when the water is $${h0}$ m deep, in terms of $\\pi$.`,
              `倒立圆锥形水箱顶部半径为 $${R}$ m，高为 $${H}$ m。水面以 $${L(v.abs())}$ m/min 的速率${v.sign() > 0 ? "上升" : "下降"}。当水深为 $${h0}$ m 时，求水的体积的变化率（m³/min），用 $\\pi$ 表示。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Write the volume in the depth", "用深度表示体积"],
                  t("By similar triangles $r = \\frac{R}{H}h$, so", "由相似三角形 $r = \\frac{R}{H}h$，所以"),
                  [`V = \\frac{1}{3}\\pi\\left(${L(rho)}h\\right)^{2}h = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}`],
                ],
                [
                  ["Differentiate and substitute", "求导并代入"],
                  t(
                    `The level is ${v.sign() > 0 ? "rising" : "falling"}, so $\\frac{dh}{dt} = ${L(v)}$:`,
                    `水面在${v.sign() > 0 ? "上升" : "下降"}，所以 $\\frac{dh}{dt} = ${L(v)}$：`,
                  ),
                  [
                    `\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt} = ${piTimes(rho.mul(rho))}(${h0})^{2}\\left(${L(v)}\\right) = ${answer}`,
                  ],
                ],
              ],
              t(
                `In $0.001$ min the depth goes from $${h0}$ to $${fmt(h0 + e * v.toNumber())}$ m, and the volume $${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$ changes by an amount that, divided by $0.001$, is about $${fmt(grown)}\\pi$, close to $${answer}$.`,
                `在 $0.001$ min 内深度从 $${h0}$ 变为 $${fmt(h0 + e * v.toNumber())}$ m，体积 $${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$ 的变化量除以 $0.001$，约为 $${fmt(grown)}\\pi$，接近 $${answer}$。`,
              ),
            ),
          },
          [
            say(
              piTimes(c.div(Q.of(3))),
              "This keeps the $\\frac{1}{3}$: the $3$ brought down by the power rule cancels it.",
              "这保留了 $\\frac{1}{3}$：幂法则带下的 $3$ 会把它约掉。",
            ),
            say(
              piTimes(c.neg()),
              `The sign is wrong: the level is ${v.sign() > 0 ? "rising, so the volume grows" : "falling, so the volume shrinks"}.`,
              `符号错了：水面在${v.sign() > 0 ? "上升，体积在增大" : "下降，体积在减小"}。`,
            ),
            say(
              piTimes(Q.of(R * R * h0 * h0).mul(v)),
              `This uses the tank's radius $${R}$ in place of the ratio $\\frac{R}{H} = ${L(rho)}$.`,
              `这用水箱的半径 $${R}$ 代替了比 $\\frac{R}{H} = ${L(rho)}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** lhopitalsRule evaluates indeterminate limits with L'Hôpital's rule. */
export const lhopitalsRule: TopicDef = {
  id: "lhopitals-rule",
  title: t("L'Hopital's Rule", "洛必达法则"),
  summary: t(
    "Evaluate limits of the indeterminate forms 0/0 and ∞/∞ by differentiating the numerator and denominator.",
    "对 0/0 与 ∞/∞ 型未定式，分别对分子和分母求导来计算极限。",
  ),
  intro: t(
    "At $x = 0$ both $\\sin(3x)$ and $2x$ are $0$, so $\\lim_{x \\to 0}\\frac{\\sin(3x)}{2x}$ has the form $\\frac{0}{0}$. Differentiating the top and the bottom separately gives $\\lim_{x \\to 0}\\frac{3\\cos(3x)}{2} = \\frac{3}{2}$.\n\nCheck: at $x = 0.01$, $\\frac{\\sin(0.03)}{0.02} \\approx 1.4998$, close to $1.5$.\n\nIn this lesson we check that a limit has the form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, differentiate the numerator and the denominator separately, and apply the rule again while the form stays indeterminate.",
    "在 $x = 0$ 处 $\\sin(3x)$ 和 $2x$ 都为 $0$，所以 $\\lim_{x \\to 0}\\frac{\\sin(3x)}{2x}$ 是 $\\frac{0}{0}$ 型。分子分母分别求导得 $\\lim_{x \\to 0}\\frac{3\\cos(3x)}{2} = \\frac{3}{2}$。\n\n检验：在 $x = 0.01$ 处，$\\frac{\\sin(0.03)}{0.02} \\approx 1.4998$，接近 $1.5$。\n\n本课我们先检查极限是否为 $\\frac{0}{0}$ 或 $\\frac{\\infty}{\\infty}$ 型，再分别对分子和分母求导，若仍是未定式就再用一次法则。",
  ),
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "lhopitals-rule-for-zero-over-zero",
      title: t("L'Hopital's rule for 0/0", "0/0 型的洛必达法则"),
      explanation: t(
        "If $f(a) = g(a) = 0$ (or both tend to $\\pm\\infty$), and $\\lim_{x \\to a}\\frac{f'(x)}{g'(x)}$ exists, then\n\n$$\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)}.$$\n\nFor $\\lim_{x \\to 0}\\frac{e^{2x} - 1}{3x}$ both parts are $0$ at $x = 0$, so the limit is $\\lim_{x \\to 0}\\frac{2e^{2x}}{3} = \\frac{2}{3}$.\n\nCheck: at $x = 0.001$, $\\frac{e^{0.002} - 1}{0.003} \\approx 0.6673$, close to $\\frac{2}{3}$.\n\n> **Watch out.** Differentiate the numerator and the denominator separately; this is not the quotient rule. Check the form first: the rule does not apply to a limit that is not indeterminate.",
        "若 $f(a) = g(a) = 0$（或两者都趋于 $\\pm\\infty$），且 $\\lim_{x \\to a}\\frac{f'(x)}{g'(x)}$ 存在，则\n\n$$\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)}.$$\n\n对 $\\lim_{x \\to 0}\\frac{e^{2x} - 1}{3x}$，在 $x = 0$ 处分子分母都为 $0$，所以极限为 $\\lim_{x \\to 0}\\frac{2e^{2x}}{3} = \\frac{2}{3}$。\n\n检验：在 $x = 0.001$ 处，$\\frac{e^{0.002} - 1}{0.003} \\approx 0.6673$，接近 $\\frac{2}{3}$。\n\n> **注意。** 分子和分母分别求导，这不是商法则。先检查形式：极限不是未定式时不能用这个法则。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        if (kind === 4) {
          const n = rng.int(2, 5);
          const c = rng.int(1, 3);
          const top = n * c ** (n - 1);
          const answer = Q.of(top, b);
          const x = c + 0.001;
          const near = (x ** n - c ** n) / (b * (x - c));
          return numberProblem({
            prompt: t(
              `Evaluate $${lim(c)}\\frac{x^{${n}} - ${c ** n}}{${b}(x - ${c})}$.`,
              `计算 $${lim(c)}\\frac{x^{${n}} - ${c ** n}}{${b}(x - ${c})}$。`,
            ),
            answer,
            mistakes: firsts([
              why(
                Q.of(n, b),
                `This differentiates $x^{${n}}$ to $${n}$; the power rule gives $${n}x^{${n - 1}}$, which is $${top}$ at $x = ${c}$.`,
                `这把 $x^{${n}}$ 的导数算成了 $${n}$；幂法则给出 $${n}x^{${n - 1}}$，在 $x = ${c}$ 处为 $${top}$。`,
              ),
              why(top, `This leaves out the denominator's derivative, $${b}$.`, `这漏掉了分母的导数 $${b}$。`),
              why(
                0,
                "This reads the form $\\frac{0}{0}$ as $0$; it has no value until the rule is applied.",
                "这把 $\\frac{0}{0}$ 型当成了 $0$；在使用法则之前它没有确定的值。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Check the form", "检查形式"],
                  t(
                    `At $x = ${c}$ the numerator is $${c}^{${n}} - ${c ** n} = 0$ and the denominator is $0$:`,
                    `在 $x = ${c}$ 处分子为 $${c}^{${n}} - ${c ** n} = 0$，分母为 $0$：`,
                  ),
                  ["\\frac{0}{0}"],
                ],
                [
                  ["Differentiate the top and the bottom", "分子分母分别求导"],
                  t("By L'Hôpital's rule,", "由洛必达法则，"),
                  [`${lim(c)}\\frac{${n}x^{${n - 1}}}{${b}} = \\frac{${top}}{${b}} = ${L(answer)}`],
                ],
              ],
              t(
                `At $x = ${fmt(x)}$ the quotient is about $${fmt(near)}$, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
                `在 $x = ${fmt(x)}$ 处商约为 $${fmt(near)}$，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
              ),
            ),
          });
        }
        const cases = [
          [`e^{${a}x} - 1`, `\\frac{${a}e^{${a}x}}{${b}}`, (x: number) => Math.exp(a * x) - 1],
          [`\\sin(${a}x)`, `\\frac{${a}\\cos(${a}x)}{${b}}`, (x: number) => Math.sin(a * x)],
          [`\\ln(1 + ${a}x)`, `\\frac{${a}}{${b}(1 + ${a}x)}`, (x: number) => Math.log(1 + a * x)],
          [`\\tan(${a}x)`, `\\frac{${a}\\sec^{2}(${a}x)}{${b}}`, (x: number) => Math.tan(a * x)],
        ] as const;
        const [top, after, f] = cases[kind]!;
        const answer = Q.of(a, b);
        const near = f(0.001) / (b * 0.001);
        return numberProblem({
          prompt: t(`Evaluate $${lim(0)}\\frac{${top}}{${b}x}$.`, `计算 $${lim(0)}\\frac{${top}}{${b}x}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.of(b, a),
              "This puts the denominator's derivative on top: the limit is $\\frac{f'}{g'}$, not $\\frac{g'}{f'}$.",
              "这把分母的导数放到了上面：极限是 $\\frac{f'}{g'}$，不是 $\\frac{g'}{f'}$。",
            ),
            why(
              1,
              "This reads the form $\\frac{0}{0}$ as $1$; it has no value until the rule is applied.",
              "这把 $\\frac{0}{0}$ 型当成了 $1$；在使用法则之前它没有确定的值。",
            ),
            why(
              0,
              "This reads the form $\\frac{0}{0}$ as $0$; it has no value until the rule is applied.",
              "这把 $\\frac{0}{0}$ 型当成了 $0$；在使用法则之前它没有确定的值。",
            ),
            why(a, `This leaves out the denominator's derivative, $${b}$.`, `这漏掉了分母的导数 $${b}$。`),
          ]),
          solution: walked(
            [
              [
                ["Check the form", "检查形式"],
                t("At $x = 0$ the numerator and the denominator are both $0$:", "在 $x = 0$ 处分子和分母都为 $0$："),
                ["\\frac{0}{0}"],
              ],
              [
                ["Differentiate the top and the bottom", "分子分母分别求导"],
                t("By L'Hôpital's rule,", "由洛必达法则，"),
                [`${lim(0)}${after} = \\frac{${a}}{${b}}${answer.toLatex() === `\\frac{${a}}{${b}}` ? "" : ` = ${L(answer)}`}`],
              ],
            ],
            t(
              `At $x = 0.001$ the quotient is about $${fmt(near)}$, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `在 $x = 0.001$ 处商约为 $${fmt(near)}$，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "applying-lhopitals-rule-repeatedly",
      title: t("Applying L'Hopital's rule repeatedly", "多次使用洛必达法则"),
      explanation: t(
        "Check the form again after each application, because the rule only applies while the quotient is still zero over zero or infinity over infinity. If $\\frac{f'(x)}{g'(x)}$ is still indeterminate, apply the rule again:\n\n$$\\lim_{x \\to 0}\\frac{e^{x} - 1 - x}{x^{2}} = \\lim_{x \\to 0}\\frac{e^{x} - 1}{2x} = \\lim_{x \\to 0}\\frac{e^{x}}{2} = \\frac{1}{2}.$$\n\nIt also handles $\\frac{\\infty}{\\infty}$: $\\lim_{x \\to \\infty}\\frac{x^{2}}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2x}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2}{e^{x}} = 0$.\n\nCheck: at $x = 0.01$, $\\frac{e^{0.01} - 1 - 0.01}{0.0001} \\approx 0.5017$, close to $\\frac{1}{2}$.\n\n> **Watch out.** Stop as soon as the quotient is no longer indeterminate; applying the rule once more gives a wrong answer. Keep the chain-rule factor each time you differentiate.",
        "每次使用后都要再检查形式，因为只有当商仍是零比零或无穷比无穷时才能使用这个法则。若 $\\frac{f'(x)}{g'(x)}$ 仍是未定式，就再用一次法则：\n\n$$\\lim_{x \\to 0}\\frac{e^{x} - 1 - x}{x^{2}} = \\lim_{x \\to 0}\\frac{e^{x} - 1}{2x} = \\lim_{x \\to 0}\\frac{e^{x}}{2} = \\frac{1}{2}.$$\n\n它也适用于 $\\frac{\\infty}{\\infty}$：$\\lim_{x \\to \\infty}\\frac{x^{2}}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2x}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2}{e^{x}} = 0$。\n\n检验：在 $x = 0.01$ 处，$\\frac{e^{0.01} - 1 - 0.01}{0.0001} \\approx 0.5017$，接近 $\\frac{1}{2}$。\n\n> **注意。** 商一旦不再是未定式就停止；再多用一次法则会得到错误答案。每次求导都要保留链式法则的因子。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const ax = a === 1 ? "x" : `${a}x`;
        const c1 = a === 1 ? "" : String(a);
        const c2 = a * a === 1 ? "" : String(a * a);
        const c3 = a === 1 ? "" : String(a ** 3);
        const [top, bottom, d1, d2, d3, answer, f, g] =
          kind === 0
            ? ([
                `e^{${ax}} - 1 - ${ax}`,
                `${b}x^{2}`,
                `\\frac{${c1}e^{${ax}} - ${a}}{${2 * b}x}`,
                `\\frac{${c2}e^{${ax}}}{${2 * b}}`,
                "",
                Q.of(a * a, 2 * b),
                (x: number) => Math.exp(a * x) - 1 - a * x,
                (x: number) => b * x * x,
              ] as const)
            : kind === 1
              ? ([
                  `1 - \\cos(${ax})`,
                  `${b}x^{2}`,
                  `\\frac{${c1}\\sin(${ax})}{${2 * b}x}`,
                  `\\frac{${c2}\\cos(${ax})}{${2 * b}}`,
                  "",
                  Q.of(a * a, 2 * b),
                  (x: number) => 1 - Math.cos(a * x),
                  (x: number) => b * x * x,
                ] as const)
              : kind === 2
                ? ([
                    `${ax} - \\sin(${ax})`,
                    `${b}x^{3}`,
                    `\\frac{${a} - ${c1}\\cos(${ax})}{${3 * b}x^{2}}`,
                    `\\frac{${c2}\\sin(${ax})}{${6 * b}x}`,
                    `\\frac{${c3}\\cos(${ax})}{${6 * b}}`,
                    Q.of(a * a * a, 6 * b),
                    (x: number) => a * x - Math.sin(a * x),
                    (x: number) => b * x ** 3,
                  ] as const)
                : ([
                    `e^{${ax}} - e^{-${ax}} - ${2 * a}x`,
                    `${b}x^{3}`,
                    `\\frac{${c1}e^{${ax}} + ${c1}e^{-${ax}} - ${2 * a}}{${3 * b}x^{2}}`,
                    `\\frac{${c2}e^{${ax}} - ${c2}e^{-${ax}}}{${6 * b}x}`,
                    `\\frac{${c3}e^{${ax}} + ${c3}e^{-${ax}}}{${6 * b}}`,
                    Q.of(a * a * a, 3 * b),
                    (x: number) => Math.exp(a * x) - Math.exp(-a * x) - 2 * a * x,
                    (x: number) => b * x ** 3,
                  ] as const);
        const third = kind >= 2;
        const zero = t("At $x = 0$ the top and the bottom are both $0$:", "在 $x = 0$ 处分子和分母都为 $0$：");
        const slip = third
          ? t(
              `This differentiates $${3 * b}x^{2}$ to $${3 * b}x$, dropping the $2$ from the power rule.`,
              `这把 $${3 * b}x^{2}$ 的导数算成了 $${3 * b}x$，漏掉了幂法则的 $2$。`,
            )
          : t(
              `This differentiates $${b}x^{2}$ to $${b}x$, dropping the $2$ from the power rule.`,
              `这把 $${b}x^{2}$ 的导数算成了 $${b}x$，漏掉了幂法则的 $2$。`,
            );
        return numberProblem({
          prompt: t(`Evaluate $${lim(0)}\\frac{${top}}{${bottom}}$.`, `计算 $${lim(0)}\\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              0,
              "This stops after the first application and reads the form $\\frac{0}{0}$ that is left as $0$.",
              "这在第一次使用后就停下，把剩下的 $\\frac{0}{0}$ 型当成了 $0$。",
            ),
            why(answer.mul(Q.of(2)), slip.en, slip["zh-CN"]),
            why(
              answer.div(Q.of(a)),
              `This leaves out one chain-rule factor $${a}$ from differentiating the inside $${ax}$.`,
              `这漏掉了对内层 $${ax}$ 求导得到的一个链式法则因子 $${a}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Check the form", "检查形式"], zero, ["\\frac{0}{0}"]],
              [
                ["Apply the rule once", "使用一次法则"],
                t(
                  "Differentiating the top and the bottom gives a quotient that is still $\\frac{0}{0}$ at $x = 0$:",
                  "分子分母分别求导，得到的商在 $x = 0$ 处仍是 $\\frac{0}{0}$ 型：",
                ),
                [`${lim(0)}${d1}`],
              ],
              third
                ? [
                    ["Apply it again", "再使用一次"],
                    t("Still $\\frac{0}{0}$ at $x = 0$:", "在 $x = 0$ 处仍是 $\\frac{0}{0}$ 型："),
                    [`${lim(0)}${d2}`],
                  ]
                : [
                    ["Apply it again", "再使用一次"],
                    t("Now the bottom is a nonzero constant, so put in $x = 0$:", "现在分母是非零常数，代入 $x = 0$："),
                    [`${lim(0)}${d2} = ${L(answer)}`],
                  ],
              ...(third
                ? ([
                    [
                      ["Apply it a third time", "第三次使用"],
                      t("Now the bottom is a nonzero constant, so put in $x = 0$:", "现在分母是非零常数，代入 $x = 0$："),
                      [`${lim(0)}${d3} = ${L(answer)}`],
                    ],
                  ] as const)
                : []),
            ],
            t(
              `At $x = 0.01$ the quotient is about $${fmt(f(0.01) / g(0.01))}$, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `在 $x = 0.01$ 处商约为 $${fmt(f(0.01) / g(0.01))}$，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lhopitalsRuleAppliedToTables applies L'Hôpital's rule to values from a table. */
export const lhopitalsRuleAppliedToTables: TopicDef = {
  id: "lhopitals-rule-applied-to-tables",
  title: t("L'Hopital's Rule Applied to Tables", "洛必达法则在表格中的应用"),
  summary: t(
    "Evaluate an indeterminate limit of a quotient from a table of values of the functions and their derivatives.",
    "由函数及其导数的值表计算商的未定式极限。",
  ),
  intro: t(
    "A table gives $f(2) = g(2) = 0$, $f'(2) = 6$ and $g'(2) = 4$. The limit $\\lim_{x \\to 2}\\frac{f(x)}{g(x)}$ has the form $\\frac{0}{0}$, so by L'Hôpital's rule it is $\\frac{f'(2)}{g'(2)} = \\frac{6}{4} = \\frac{3}{2}$.\n\nCheck: near $x = 2$ the tangent lines give $f(x) \\approx 6(x - 2)$ and $g(x) \\approx 4(x - 2)$, whose quotient is $\\frac{6}{4}$.\n\nIn this lesson we read the values of functions and their derivatives from a table, check the form of the limit, and use L'Hôpital's rule only when it applies.",
    "表中给出 $f(2) = g(2) = 0$，$f'(2) = 6$，$g'(2) = 4$。极限 $\\lim_{x \\to 2}\\frac{f(x)}{g(x)}$ 是 $\\frac{0}{0}$ 型，所以由洛必达法则它等于 $\\frac{f'(2)}{g'(2)} = \\frac{6}{4} = \\frac{3}{2}$。\n\n检验：在 $x = 2$ 附近，由切线得 $f(x) \\approx 6(x - 2)$，$g(x) \\approx 4(x - 2)$，它们的商是 $\\frac{6}{4}$。\n\n本课我们从表中读出函数及其导数的值，检查极限的形式，只在适用时使用洛必达法则。",
  ),
  prerequisites: ["lhopitals-rule"],
  encompasses: [{ topic: "lhopitals-rule", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "lhopitals-rule-from-tables",
      title: t("L'Hopital's rule from tables", "由表格使用洛必达法则"),
      explanation: t(
        "If the table shows $f(a) = g(a) = 0$ and $g'(a) \\ne 0$, with $f'$ and $g'$ continuous, then $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{f'(a)}{g'(a)}$. If $f'(a) = g'(a) = 0$ as well, go on to the second derivatives. With $f(1) = g(1) = 0$, $f'(1) = 3$ and $g'(1) = -6$, the limit is $\\frac{3}{-6} = -\\frac{1}{2}$.\n\nCheck: near $x = 1$, $f(x) \\approx 3(x - 1)$ and $g(x) \\approx -6(x - 1)$, whose quotient is $-\\frac{1}{2}$.\n\n> **Watch out.** $\\frac{f(a)}{g(a)} = \\frac{0}{0}$ is not $0$ or $1$; it means the rule is needed. Divide the derivatives; do not use the quotient rule.",
        "若表中 $f(a) = g(a) = 0$，$g'(a) \\ne 0$，且 $f'$、$g'$ 连续，则 $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{f'(a)}{g'(a)}$。若还有 $f'(a) = g'(a) = 0$，则继续看二阶导数。若 $f(1) = g(1) = 0$，$f'(1) = 3$，$g'(1) = -6$，极限为 $\\frac{3}{-6} = -\\frac{1}{2}$。\n\n检验：在 $x = 1$ 附近，$f(x) \\approx 3(x - 1)$，$g(x) \\approx -6(x - 1)$，它们的商是 $-\\frac{1}{2}$。\n\n> **注意。** $\\frac{f(a)}{g(a)} = \\frac{0}{0}$ 既不是 $0$ 也不是 $1$，它表示需要用法则。用导数相除，不要用商法则。",
      ),
      generate(rng) {
        const a = rng.int(-3, 5);
        const second = rng.int(0, 2) === 0;
        const fv = [0, second ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const gv = [0, second ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const k = second ? 2 : 1;
        const answer = Q.of(fv[k]!, gv[k]!);
        const tab = table(
          ["", "$f$", "$g$"],
          [`value at $x = ${a}$`, `$${fv[0]}$`, `$${gv[0]}$`],
          [`first derivative at $x = ${a}$`, `$${fv[1]}$`, `$${gv[1]}$`],
          [`second derivative at $x = ${a}$`, `$${fv[2]}$`, `$${gv[2]}$`],
        );
        const tabZh = table(
          ["", "$f$", "$g$"],
          [`$x = ${a}$ 处的函数值`, `$${fv[0]}$`, `$${gv[0]}$`],
          [`$x = ${a}$ 处的一阶导数`, `$${fv[1]}$`, `$${gv[1]}$`],
          [`$x = ${a}$ 处的二阶导数`, `$${fv[2]}$`, `$${gv[2]}$`],
        );
        const xa = a === 0 ? "x" : a < 0 ? `(x + ${-a})` : `(x - ${a})`;
        return numberProblem({
          prompt: t(
            `$f$ and $g$ have continuous second derivatives, with values given in the table.\n\n${tab}\n\nEvaluate $${lim(a)}\\frac{f(x)}{g(x)}$.`,
            `$f$ 和 $g$ 有连续的二阶导数，相关的值如下表。\n\n${tabZh}\n\n计算 $${lim(a)}\\frac{f(x)}{g(x)}$。`,
          ),
          answer,
          mistakes: firsts(
            second
              ? [
                  why(
                    0,
                    "This reads $\\frac{f'(a)}{g'(a)} = \\frac{0}{0}$ as $0$; it is still indeterminate, so go on to the second derivatives.",
                    "这把 $\\frac{f'(a)}{g'(a)} = \\frac{0}{0}$ 当成了 $0$；它仍是未定式，要继续看二阶导数。",
                  ),
                  why(
                    1,
                    "This reads $\\frac{0}{0}$ as $1$; it is still indeterminate, so go on to the second derivatives.",
                    "这把 $\\frac{0}{0}$ 当成了 $1$；它仍是未定式，要继续看二阶导数。",
                  ),
                  why(
                    Q.of(gv[2]!, fv[2]!),
                    "This divides $g''$ by $f''$; the numerator's derivative goes on top.",
                    "这是用 $g''$ 除以 $f''$；分子的导数应在上面。",
                  ),
                ]
              : [
                  why(
                    Q.of(fv[2]!, gv[2]!),
                    "This goes on to the second derivatives, but $g'(a) \\ne 0$, so the first derivatives already give the limit.",
                    "这用了二阶导数，但 $g'(a) \\ne 0$，一阶导数已经给出了极限。",
                  ),
                  why(
                    Q.of(gv[1]!, fv[1]!),
                    "This divides $g'$ by $f'$; the numerator's derivative goes on top.",
                    "这是用 $g'$ 除以 $f'$；分子的导数应在上面。",
                  ),
                  why(
                    0,
                    "This reads $\\frac{f(a)}{g(a)} = \\frac{0}{0}$ as $0$; the form is indeterminate, so the rule is needed.",
                    "这把 $\\frac{f(a)}{g(a)} = \\frac{0}{0}$ 当成了 $0$；这是未定式，需要用法则。",
                  ),
                ],
          ),
          solution: walked(
            second
              ? [
                  [
                    ["Check the form", "检查形式"],
                    t(
                      `$f(${a}) = g(${a}) = 0$, and also $f'(${a}) = g'(${a}) = 0$: after one application the form is still`,
                      `$f(${a}) = g(${a}) = 0$，且 $f'(${a}) = g'(${a}) = 0$：用一次法则后仍是`,
                    ),
                    ["\\frac{0}{0}"],
                  ],
                  [
                    ["Apply the rule twice", "使用两次法则"],
                    t(`$g''(${a}) = ${gv[2]} \\ne 0$, so`, `$g''(${a}) = ${gv[2]} \\ne 0$，所以`),
                    [`${lim(a)}\\frac{f(x)}{g(x)} = \\frac{f''(${a})}{g''(${a})} = ${ratio(fv[2]!, gv[2]!)}`],
                  ],
                ]
              : [
                  [
                    ["Check the form", "检查形式"],
                    t(`$f(${a}) = g(${a}) = 0$, so the form is`, `$f(${a}) = g(${a}) = 0$，所以是`),
                    ["\\frac{0}{0}"],
                  ],
                  [
                    ["Apply the rule", "使用法则"],
                    t(`$g'(${a}) = ${gv[1]} \\ne 0$, so`, `$g'(${a}) = ${gv[1]} \\ne 0$，所以`),
                    [`${lim(a)}\\frac{f(x)}{g(x)} = \\frac{f'(${a})}{g'(${a})} = ${ratio(fv[1]!, gv[1]!)}`],
                  ],
                ],
            second
              ? t(
                  `Near $x = ${a}$ Taylor's formula gives $f(x) \\approx \\frac{${fv[2]}}{2}${xa}^{2}$ and $g(x) \\approx \\frac{${gv[2]}}{2}${xa}^{2}$; the $\\frac{1}{2}${xa}^{2}$ cancels, leaving $${L(answer)}$.`,
                  `在 $x = ${a}$ 附近，由泰勒公式 $f(x) \\approx \\frac{${fv[2]}}{2}${xa}^{2}$，$g(x) \\approx \\frac{${gv[2]}}{2}${xa}^{2}$；约去 $\\frac{1}{2}${xa}^{2}$，剩下 $${L(answer)}$。`,
                )
              : t(
                  `Near $x = ${a}$ the tangent lines give $f(x) \\approx ${fv[1]}${xa}$ and $g(x) \\approx ${gv[1]}${xa}$; the $${xa}$ cancels, leaving $${L(answer)}$.`,
                  `在 $x = ${a}$ 附近，由切线得 $f(x) \\approx ${fv[1]}${xa}$，$g(x) \\approx ${gv[1]}${xa}$；约去 $${xa}$，剩下 $${L(answer)}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "checking-the-form-before-applying-lhopitals-rule",
      title: t("Checking the form before applying L'Hopital's rule", "使用洛必达法则前检查形式"),
      explanation: t(
        "L'Hôpital's rule applies only to indeterminate forms. If $g(a) \\ne 0$ and $f$, $g$ are continuous, the limit is simply $\\frac{f(a)}{g(a)}$; using the derivatives there gives a wrong answer. With $f(1) = 2$, $g(1) = 4$, $f'(1) = 3$ and $g'(1) = 5$, the limit is $\\frac{2}{4} = \\frac{1}{2}$, not $\\frac{3}{5}$.\n\nCheck: at $x = 1.01$, $f \\approx 2 + 0.03 = 2.03$ and $g \\approx 4 + 0.05 = 4.05$, a quotient of about $0.5012$, close to $\\frac{1}{2}$.\n\n> **Watch out.** Look at $f(a)$ and $g(a)$ before differentiating anything. Use the derivatives only when both values are $0$.",
        "洛必达法则只适用于未定式。若 $g(a) \\ne 0$ 且 $f$、$g$ 连续，极限就是 $\\frac{f(a)}{g(a)}$；此时用导数会得到错误答案。若 $f(1) = 2$，$g(1) = 4$，$f'(1) = 3$，$g'(1) = 5$，极限是 $\\frac{2}{4} = \\frac{1}{2}$，不是 $\\frac{3}{5}$。\n\n检验：在 $x = 1.01$ 处，$f \\approx 2 + 0.03 = 2.03$，$g \\approx 4 + 0.05 = 4.05$，商约为 $0.5012$，接近 $\\frac{1}{2}$。\n\n> **注意。** 在求导之前先看 $f(a)$ 和 $g(a)$。只有两者都为 $0$ 时才用导数。",
      ),
      generate(rng) {
        const a = rng.int(-3, 5);
        const indeterminate = rng.bool();
        const fv = [indeterminate ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const gv = [indeterminate ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const answer = indeterminate ? Q.of(fv[1]!, gv[1]!) : Q.of(fv[0]!, gv[0]!);
        const head = ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"];
        const tab = table(head, [`$${a}$`, `$${fv[0]}$`, `$${fv[1]}$`, `$${gv[0]}$`, `$${gv[1]}$`]);
        const f1 = fv[0]! + 0.01 * fv[1]!;
        const g1 = gv[0]! + 0.01 * gv[1]!;
        return numberProblem({
          prompt: t(
            `$f$ and $g$ are differentiable, with continuous derivatives, and have the values in the table.\n\n${tab}\n\nEvaluate $${lim(a)}\\frac{f(x)}{g(x)}$.`,
            `$f$ 和 $g$ 可导且导数连续，相关的值如下表。\n\n${tab}\n\n计算 $${lim(a)}\\frac{f(x)}{g(x)}$。`,
          ),
          answer,
          mistakes: firsts(
            indeterminate
              ? [
                  why(
                    Q.of(gv[1]!, fv[1]!),
                    "This divides $g'$ by $f'$; the numerator's derivative goes on top.",
                    "这是用 $g'$ 除以 $f'$；分子的导数应在上面。",
                  ),
                  why(
                    0,
                    "This reads $\\frac{0}{0}$ as $0$; the form is indeterminate, so the rule is needed.",
                    "这把 $\\frac{0}{0}$ 当成了 $0$；这是未定式，需要用法则。",
                  ),
                  why(
                    1,
                    "This reads $\\frac{0}{0}$ as $1$; the form is indeterminate, so the rule is needed.",
                    "这把 $\\frac{0}{0}$ 当成了 $1$；这是未定式，需要用法则。",
                  ),
                ]
              : [
                  why(
                    Q.of(fv[1]!, gv[1]!),
                    `This applies L'Hôpital's rule, but $g(${a}) = ${gv[0]} \\ne 0$: the form is not indeterminate.`,
                    `这用了洛必达法则，但 $g(${a}) = ${gv[0]} \\ne 0$：这不是未定式。`,
                  ),
                  why(
                    Q.of(gv[0]!, fv[0]!),
                    "This divides $g(a)$ by $f(a)$; the numerator goes on top.",
                    "这是用 $g(a)$ 除以 $f(a)$；分子应在上面。",
                  ),
                ],
          ),
          solution: walked(
            indeterminate
              ? [
                  [
                    ["Check the form", "检查形式"],
                    t(`$f(${a}) = g(${a}) = 0$, an indeterminate form:`, `$f(${a}) = g(${a}) = 0$，是未定式：`),
                    ["\\frac{0}{0}"],
                  ],
                  [
                    ["Apply the rule", "使用法则"],
                    t(`$g'(${a}) = ${gv[1]} \\ne 0$, so`, `$g'(${a}) = ${gv[1]} \\ne 0$，所以`),
                    [`${lim(a)}\\frac{f(x)}{g(x)} = \\frac{f'(${a})}{g'(${a})} = ${ratio(fv[1]!, gv[1]!)}`],
                  ],
                ]
              : [
                  [
                    ["Check the form", "检查形式"],
                    t(
                      `$g(${a}) = ${gv[0]} \\ne 0$, so the quotient is continuous at $x = ${a}$ and L'Hôpital's rule does not apply.`,
                      `$g(${a}) = ${gv[0]} \\ne 0$，商在 $x = ${a}$ 处连续，不能用洛必达法则。`,
                    ),
                  ],
                  [
                    ["Substitute", "代入"],
                    t("The limit is the value of the quotient:", "极限就是商的值："),
                    [`${lim(a)}\\frac{f(x)}{g(x)} = \\frac{f(${a})}{g(${a})} = ${ratio(fv[0]!, gv[0]!)}`],
                  ],
                ],
            t(
              `At $x = ${a} + 0.01$ the tangent lines give $f \\approx ${fv[0]} + 0.01 \\cdot ${par(fv[1]!)} = ${fmt(f1)}$ and $g \\approx ${gv[0]} + 0.01 \\cdot ${par(gv[1]!)} = ${fmt(g1)}$, a quotient of about $${fmt(f1 / g1)}$, close to $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `在 $x = ${a} + 0.01$ 处，由切线得 $f \\approx ${fv[0]} + 0.01 \\cdot ${par(fv[1]!)} = ${fmt(f1)}$，$g \\approx ${gv[0]} + 0.01 \\cdot ${par(gv[1]!)} = ${fmt(g1)}$，商约为 $${fmt(f1 / g1)}$，接近 $${L(answer)}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculusIContextualTopics are the topics of Calculus I unit 6. */
export const calculusIContextualTopics: readonly TopicDef[] = [
  interpretingTheMeaningOfTheDerivativeInContext,
  ratesOfChangeInAppliedContexts,
  estimatingDerivativesUsingAForwardDifferenceQuotient,
  estimatingDerivativesUsingABackwardDifferenceQuotient,
  estimatingDerivativesUsingACentralDifferenceQuotient,
  introductionToRelatedRates,
  relatedRatesWithImplicitFunctions,
  calculatingRelatedRatesWithCirclesAndSpheres,
  calculatingRelatedRatesWithSquares,
  calculatingRelatedRatesWithRectangularSolids,
  calculatingRelatedRatesUsingThePythagoreanTheorem,
  calculatingRelatedRatesUsingSimilarTriangles,
  calculatingRelatedRatesUsingTrigonometry,
  calculatingRelatedRatesWithCones,
  lhopitalsRule,
  lhopitalsRuleAppliedToTables,
];
