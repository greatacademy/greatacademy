import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { lim, oneOf, type Poly, pAt, par, pDer, pLatex, rounded, table } from "./calculus-common.ts";

// Calculus I unit 6: Contextual Applications of Differentiation, modules 6.14 to 6.17.

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
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [{ topic: "the-instantaneous-rate-of-change-of-a-function-at-a-point", weight: 0.3 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "units-of-the-derivative",
      title: t("Units of the derivative", "导数的单位"),
      explanation: t(
        "$f'(t) = \\lim_{h \\to 0}\\frac{f(t + h) - f(t)}{h}$ is a change in output divided by a change in input, so its units are the output units per input unit. If $V(t)$ is a volume in liters and $t$ is in minutes, $V'(t)$ is in liters per minute.",
        "$f'(t) = \\lim_{h \\to 0}\\frac{f(t + h) - f(t)}{h}$ 是输出的变化量除以输入的变化量，因此它的单位是“输出单位每输入单位”。若 $V(t)$ 是以升为单位的体积，$t$ 以分钟为单位，则 $V'(t)$ 的单位是升每分钟。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const a = rng.int(1, 12);
        const per = (x: Context) => t(`${x.out.en} per ${x.one.en}`, `${x.out["zh-CN"]}每${x.one["zh-CN"]}`);
        return oneOf(
          rng,
          t(`${setting(c).en} What are the units of $${c.f}'(${a})$?`, `${setting(c)["zh-CN"]}$${c.f}'(${a})$ 的单位是什么？`),
          per(c),
          [
            c.out,
            t(`${c.one.en} per ${c.out.en.replace(/s$/, "")}`, `${c.one["zh-CN"]}每${c.out["zh-CN"]}`),
            t(`${c.out.en} per ${c.one.en} per ${c.one.en}`, `${c.out["zh-CN"]}每${c.one["zh-CN"]}的平方`),
          ],
          t(
            `$${c.f}'(${a})$ is a change in ${c.out.en} divided by a change in ${c.time.en}, so it is measured in ${per(c).en}.`,
            `$${c.f}'(${a})$ 是${c.out["zh-CN"]}的变化量除以${c.time["zh-CN"]}的变化量，单位是${per(c)["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "interpreting-a-derivative-value",
      title: t("Interpreting a derivative value", "解释导数值"),
      explanation: t(
        "$P'(3) = -40$ says that at the instant $t = 3$, $P$ is decreasing at a rate of $40$ units of $P$ per unit of $t$. It says nothing about the value of $P$ itself, and it describes an instant, not a change over an interval.",
        "$P'(3) = -40$ 表示在 $t = 3$ 这一时刻，$P$ 正以每单位 $t$ 减少 $40$ 个单位的速率变化。它与 $P$ 本身的值无关，描述的是某一时刻，而不是一段时间内的变化。",
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
        return oneOf(
          rng,
          t(`${setting(c).en} What does $${c.f}'(${a}) = ${v}$ mean?`, `${setting(c)["zh-CN"]}$${c.f}'(${a}) = ${v}$ 表示什么？`),
          rate(up),
          [
            rate(!up),
            t(`${at.en}, ${c.what.en} is $${v}$ ${c.out.en}.`, `${at["zh-CN"]}，${c.what["zh-CN"]}为 $${v}$ ${c.out["zh-CN"]}。`),
            t(
              `Over the first $${a}$ ${c.time.en}, ${c.what.en} ${up ? "increases" : "decreases"} by $${n}$ ${c.out.en}.`,
              `在前 $${a}$ ${c.time["zh-CN"]}内，${c.what["zh-CN"]}${up ? "增加" : "减少"}了 $${n}$ ${c.out["zh-CN"]}。`,
            ),
          ],
          t(
            `$${c.f}'(${a})$ is the instantaneous rate of change at $t = ${a}$, in ${c.out.en} per ${c.one.en}. It is ${up ? "positive" : "negative"}, so the quantity is ${up ? "increasing" : "decreasing"}.`,
            `$${c.f}'(${a})$ 是 $t = ${a}$ 时的瞬时变化率，单位是${c.out["zh-CN"]}每${c.one["zh-CN"]}。它为${up ? "正" : "负"}，所以该量正在${up ? "增加" : "减少"}。`,
          ),
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
  prerequisites: ["interpreting-the-meaning-of-the-derivative-in-context"],
  encompasses: [{ topic: "interpreting-the-meaning-of-the-derivative-in-context", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-change-of-polynomial-models",
      title: t("Rates of change of polynomial models", "多项式模型的变化率"),
      explanation: t(
        "Differentiate the formula, then substitute the input. If a ball's height is $h(t) = -5t^{2} + 20t + 2$ meters after $t$ seconds, then $h'(t) = -10t + 20$, so at $t = 3$ its height changes at $h'(3) = -10$ meters per second: it is falling at $10$ meters per second.",
        "先对公式求导，再代入输入值。若小球 $t$ 秒后的高度为 $h(t) = -5t^{2} + 20t + 2$ 米，则 $h'(t) = -10t + 20$，所以 $t = 3$ 时高度的变化率为 $h'(3) = -10$ 米每秒：小球正以每秒 $10$ 米的速度下落。",
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
            wrong: [pAt(p, t0), -answer, v].filter((w) => w !== answer),
            solution: t(
              `$h'(t) = ${pLatex(pDer(p), "t")}$, so $h'(${t0}) = ${answer}$ meters per second.`,
              `$h'(t) = ${pLatex(pDer(p), "t")}$，所以 $h'(${t0}) = ${answer}$ 米每秒。`,
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
          return numberProblem({
            prompt: t(
              `The cost of producing $x$ items is $C(x) = ${cost}$ dollars. Find the marginal cost $C'(${x0})$, in dollars per item.`,
              `生产 $x$ 件产品的成本为 $C(x) = ${cost}$ 美元。求边际成本 $C'(${x0})$（美元每件）。`,
            ),
            answer,
            wrong: [total, total.div(Q.of(x0)), Q.of(c1)].filter((w) => !w.eq(answer)),
            solution: t(
              `$C'(x) = ${decimal(c2.mul(Q.of(2)))}x + ${c1}$, so $C'(${x0}) = ${decimal(answer)}$ dollars per item.`,
              `$C'(x) = ${decimal(c2.mul(Q.of(2)))}x + ${c1}$，所以 $C'(${x0}) = ${decimal(answer)}$ 美元每件。`,
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
          wrong: [pAt(p, t0), Q.of(pAt(p, t0), t0).toNumber(), a].filter((w) => w !== answer),
          solution: t(
            `$A'(t) = ${pLatex(pDer(p), "t")}$, so $A'(${t0}) = ${answer}$ square meters per hour.`,
            `$A'(t) = ${pLatex(pDer(p), "t")}$，所以 $A'(${t0}) = ${answer}$ 平方米每小时。`,
          ),
        });
      },
    },
    {
      id: "rates-of-change-of-exponential-models",
      title: t("Rates of change of exponential models", "指数模型的变化率"),
      explanation: t(
        "For $P(t) = P_{0}e^{kt}$, $P'(t) = kP_{0}e^{kt} = kP(t)$: the rate of change is proportional to the amount. Evaluate with a calculator and round as asked.",
        "对 $P(t) = P_{0}e^{kt}$，$P'(t) = kP_{0}e^{kt} = kP(t)$：变化率与当前的量成正比。用计算器求值并按要求取近似。",
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
          const amount = rounded(p0 * Math.exp(kL * t0), 1);
          if (!answer || !amount || answer.eq(amount)) continue;
          const f = `${p0}e^{${kL}t}`;
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
            wrong: [amount, answer.neg()],
            solution: t(
              `The derivative is $${kL * p0}e^{${kL}t}$. At $t = ${t0}$ it is $${kL * p0}e^{${Math.round(kL * t0 * 100) / 100}} \\approx ${answer.toNumber()}$ ${unit.en}.`,
              `导数为 $${kL * p0}e^{${kL}t}$。在 $t = ${t0}$ 时为 $${kL * p0}e^{${Math.round(kL * t0 * 100) / 100}} \\approx ${answer.toNumber()}$ ${unit["zh-CN"]}。`,
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

/** qAt evaluates a polynomial at a rational. */
const qAt = (p: Poly, x: Q) => p.reduce((s, c, i) => s.add(Q.of(c).mul(x.pow(i))), Q.zero);

/** quotientFormula writes the formula of a difference quotient. */
const quotientFormula: Record<Quotient, string> = {
  forward: "\\frac{f(a + h) - f(a)}{h}",
  backward: "\\frac{f(a) - f(a - h)}{h}",
  central: "\\frac{f(a + h) - f(a - h)}{2h}",
};

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
  const answer = Q.of(ys[hi]! - ys[lo]!, w);
  const other =
    kind === "central" ? Q.of(ys[j + 1]! - ys[j]!, h) : kind === "forward" ? Q.of(ys[j + 1]! - ys[j]!, 1) : Q.of(ys[j]! - ys[j - 1]!, 1);
  const name = t(kind, { forward: "向前", backward: "向后", central: "中心" }[kind]);
  return numberProblem({
    prompt: t(
      `The table gives values of a differentiable function $f$.\n\n${table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...ys.map((v) => `$${v}$`)])}\n\nUse a ${name.en} difference quotient with the values in the table to estimate $f'(${xs[j]})$.`,
      `下表给出可导函数 $f$ 的一些值。\n\n${table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...ys.map((v) => `$${v}$`)])}\n\n用表中的值和${name["zh-CN"]}差商估计 $f'(${xs[j]})$。`,
    ),
    answer,
    wrong: [other, Q.of(ys[hi]! - ys[lo]!), answer.neg()].filter((w) => !w.eq(answer)),
    solution: t(
      `$f'(${xs[j]}) \\approx \\frac{f(${xs[hi]}) - f(${xs[lo]})}{${xs[hi]} - ${par(xs[lo]!)}} = \\frac{${ys[hi]} - ${par(ys[lo]!)}}{${w}} = ${answer.toLatex()}$.`,
      `$f'(${xs[j]}) \\approx \\frac{f(${xs[hi]}) - f(${xs[lo]})}{${xs[hi]} - ${par(xs[lo]!)}} = \\frac{${ys[hi]} - ${par(ys[lo]!)}}{${w}} = ${answer.toLatex()}$。`,
    ),
  });
}

/** quotientFromFormula evaluates a difference quotient of a polynomial with a small step. */
function quotientFromFormula(rng: Rng, kind: Quotient): Problem {
  const p: Poly = rng.bool()
    ? [rng.int(-5, 5), rng.int(-5, 5), rng.nonZero(-3, 3)]
    : [rng.int(-3, 3), rng.int(-3, 3), 0, rng.nonZero(-2, 2)];
  const a = Q.of(rng.int(-3, 4));
  const h = rng.pick([Q.of(1, 10), Q.of(1, 100), Q.of(1, 2), Q.of(1, 5)]);
  const [x1, x2, w] = quotientParts(kind, a, h);
  const [y1, y2] = [qAt(p, x1), qAt(p, x2)];
  const answer = y1.sub(y2).div(w);
  const exact = Q.of(pAt(pDer(p), a.toNumber()));
  const name = t(kind, { forward: "向前", backward: "向后", central: "中心" }[kind]);
  return numberProblem({
    prompt: t(
      `Let $f(x) = ${pLatex(p)}$. Estimate $f'(${a.toLatex()})$ with a ${name.en} difference quotient $${quotientFormula[kind]}$, using $h = ${decimal(h)}$.`,
      `设 $f(x) = ${pLatex(p)}$。用${name["zh-CN"]}差商 $${quotientFormula[kind]}$ 估计 $f'(${a.toLatex()})$，取 $h = ${decimal(h)}$。`,
    ),
    answer,
    form: "decimal",
    wrong: [exact, y1.sub(y2), y1.sub(y2).div(h.add(h))].filter((v) => !v.eq(answer)),
    solution: t(
      `$f(${decimal(x1)}) = ${decimal(y1)}$ and $f(${decimal(x2)}) = ${decimal(y2)}$, so the estimate is $\\frac{${decimal(y1)} - ${y2.sign() < 0 ? `(${decimal(y2)})` : decimal(y2)}}{${decimal(w)}} = ${decimal(answer)}$. (The exact derivative is $${exact.toLatex()}$.)`,
      `$f(${decimal(x1)}) = ${decimal(y1)}$，$f(${decimal(x2)}) = ${decimal(y2)}$，所以估计值为 $\\frac{${decimal(y1)} - ${y2.sign() < 0 ? `(${decimal(y2)})` : decimal(y2)}}{${decimal(w)}} = ${decimal(answer)}$。（导数的精确值为 $${exact.toLatex()}$。）`,
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
  prerequisites: ["calculating-derivatives-from-data-and-tables"],
  encompasses: [{ topic: "calculating-derivatives-from-data-and-tables", weight: 0.3 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "forward-difference-quotients-from-tables",
      title: t("Forward difference quotients from tables", "由表格计算向前差商"),
      explanation: t(
        "For small $h$, $f'(a) \\approx \\frac{f(a + h) - f(a)}{h}$, the slope of the secant line from $a$ to the next point to its right. From a table, use the next listed input as $a + h$.",
        "当 $h$ 很小时，$f'(a) \\approx \\frac{f(a + h) - f(a)}{h}$，即从 $a$ 到其右侧下一点的割线斜率。由表格估计时，取表中下一个输入值作为 $a + h$。",
      ),
      generate: (rng) => quotientFromTable(rng, "forward"),
    },
    {
      id: "forward-difference-quotients-from-formulas",
      title: t("Forward difference quotients from formulas", "由公式计算向前差商"),
      explanation: t(
        "Evaluate $f(a + h)$ and $f(a)$ exactly, subtract and divide by $h$. For $f(x) = x^{2}$, $a = 3$ and $h = 0.1$: $\\frac{9.61 - 9}{0.1} = 6.1$, close to $f'(3) = 6$.",
        "精确计算 $f(a + h)$ 和 $f(a)$，相减后除以 $h$。对 $f(x) = x^{2}$，$a = 3$，$h = 0.1$：$\\frac{9.61 - 9}{0.1} = 6.1$，接近 $f'(3) = 6$。",
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
  prerequisites: ["estimating-derivatives-using-a-forward-difference-quotient"],
  encompasses: [{ topic: "estimating-derivatives-using-a-forward-difference-quotient", weight: 0.5 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "backward-difference-quotients-from-tables",
      title: t("Backward difference quotients from tables", "由表格计算向后差商"),
      explanation: t(
        "$f'(a) \\approx \\frac{f(a) - f(a - h)}{h}$ uses the point to the left of $a$. From a table, use the previous listed input as $a - h$.",
        "$f'(a) \\approx \\frac{f(a) - f(a - h)}{h}$ 使用 $a$ 左侧的点。由表格估计时，取表中前一个输入值作为 $a - h$。",
      ),
      generate: (rng) => quotientFromTable(rng, "backward"),
    },
    {
      id: "backward-difference-quotients-from-formulas",
      title: t("Backward difference quotients from formulas", "由公式计算向后差商"),
      explanation: t(
        "For $f(x) = x^{2}$, $a = 3$ and $h = 0.1$: $\\frac{9 - 8.41}{0.1} = 5.9$. The forward estimate $6.1$ and the backward estimate $5.9$ lie on either side of $f'(3) = 6$.",
        "对 $f(x) = x^{2}$，$a = 3$，$h = 0.1$：$\\frac{9 - 8.41}{0.1} = 5.9$。向前估计值 $6.1$ 与向后估计值 $5.9$ 分别位于 $f'(3) = 6$ 的两侧。",
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
  prerequisites: ["estimating-derivatives-using-a-backward-difference-quotient"],
  encompasses: [{ topic: "estimating-derivatives-using-a-backward-difference-quotient", weight: 0.5 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "central-difference-quotients-from-tables",
      title: t("Central difference quotients from tables", "由表格计算中心差商"),
      explanation: t(
        "$f'(a) \\approx \\frac{f(a + h) - f(a - h)}{2h}$ uses points on both sides of $a$; it is the average of the forward and backward estimates and is usually more accurate. The width of the interval is $2h$.",
        "$f'(a) \\approx \\frac{f(a + h) - f(a - h)}{2h}$ 使用 $a$ 两侧的点；它是向前与向后估计值的平均，通常更准确。区间的宽度是 $2h$。",
      ),
      generate: (rng) => quotientFromTable(rng, "central"),
    },
    {
      id: "central-difference-quotients-from-formulas",
      title: t("Central difference quotients from formulas", "由公式计算中心差商"),
      explanation: t(
        "For $f(x) = x^{2}$, $a = 3$ and $h = 0.1$: $\\frac{9.61 - 8.41}{0.2} = 6$, exactly $f'(3)$. For a quadratic the central difference quotient is always exact.",
        "对 $f(x) = x^{2}$，$a = 3$，$h = 0.1$：$\\frac{9.61 - 8.41}{0.2} = 6$，恰好等于 $f'(3)$。对二次函数，中心差商总是精确的。",
      ),
      generate: (rng) => quotientFromFormula(rng, "central"),
    },
  ],
};

/** introductionToRelatedRates relates rates of quantities linked by an equation. */
export const introductionToRelatedRates: TopicDef = {
  id: "introduction-to-related-rates",
  title: t("Introduction to Related Rates", "相关变化率简介"),
  summary: t(
    "Differentiate an equation linking two quantities with respect to time to relate their rates.",
    "把联系两个量的方程对时间求导，得到它们变化率之间的关系。",
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
        "If $x$ and $y$ both depend on $t$ and $y = f(x)$, the chain rule gives\n\n$$\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}.$$\n\nFor $y = x^{3}$ with $\\frac{dx}{dt} = 2$ when $x = 1$: $\\frac{dy}{dt} = 3(1)^{2}(2) = 6$.",
        "若 $x$ 和 $y$ 都依赖于 $t$，且 $y = f(x)$，则由链式法则\n\n$$\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}.$$\n\n对 $y = x^{3}$，当 $x = 1$ 时 $\\frac{dx}{dt} = 2$：$\\frac{dy}{dt} = 3(1)^{2}(2) = 6$。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const x0 = rng.int(-3, 3);
        const r = rng.nonZero(-5, 5);
        const d = pAt(pDer(p), x0);
        const answer = d * r;
        return numberProblem({
          prompt: t(
            `$x$ and $y$ are functions of $t$ with $y = ${pLatex(p)}$. Find $\\frac{dy}{dt}$ when $x = ${x0}$ and $\\frac{dx}{dt} = ${r}$.`,
            `$x$ 和 $y$ 都是 $t$ 的函数，且 $y = ${pLatex(p)}$。当 $x = ${x0}$，$\\frac{dx}{dt} = ${r}$ 时，求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          wrong: [d, pAt(p, x0) * r, pAt(pDer(p), r)].filter((w) => w !== answer),
          solution: t(
            `Differentiating with respect to $t$, $\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}$. At $x = ${x0}$ this is $${d} \\cdot ${par(r)} = ${answer}$.`,
            `对 $t$ 求导，$\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}$。在 $x = ${x0}$ 处为 $${d} \\cdot ${par(r)} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "solving-for-an-unknown-rate",
      title: t("Solving for an unknown rate", "求未知的变化率"),
      explanation: t(
        "The same equation can be solved for either rate. If $y = x^{2} + 1$ and $\\frac{dy}{dt} = 12$ when $x = 3$, then $12 = 2(3)\\frac{dx}{dt}$, so $\\frac{dx}{dt} = 2$.",
        "同一个方程可以解出任一个变化率。若 $y = x^{2} + 1$，当 $x = 3$ 时 $\\frac{dy}{dt} = 12$，则 $12 = 2(3)\\frac{dx}{dt}$，所以 $\\frac{dx}{dt} = 2$。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        let x0 = rng.int(-4, 4);
        while (pAt(pDer(p), x0) === 0) x0 += 1;
        const s = rng.nonZero(-20, 20);
        const d = pAt(pDer(p), x0);
        const answer = Q.of(s, d);
        return numberProblem({
          prompt: t(
            `$x$ and $y$ are functions of $t$ with $y = ${pLatex(p)}$. Find $\\frac{dx}{dt}$ when $x = ${x0}$ and $\\frac{dy}{dt} = ${s}$.`,
            `$x$ 和 $y$ 都是 $t$ 的函数，且 $y = ${pLatex(p)}$。当 $x = ${x0}$，$\\frac{dy}{dt} = ${s}$ 时，求 $\\frac{dx}{dt}$。`,
          ),
          answer,
          wrong: [Q.of(s * d), Q.of(d, s), answer.neg()].filter((w) => !w.eq(answer)),
          solution: t(
            `$\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}$, so $${s} = ${d}\\frac{dx}{dt}$ and $\\frac{dx}{dt} = ${answer.toLatex()}$.`,
            `$\\frac{dy}{dt} = (${pLatex(pDer(p))})\\frac{dx}{dt}$，所以 $${s} = ${d}\\frac{dx}{dt}$，$\\frac{dx}{dt} = ${answer.toLatex()}$。`,
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
      title: t("Related rates on circles", "圆上的相关变化率"),
      explanation: t(
        "A point moves on $x^{2} + y^{2} = 25$. Differentiating with respect to $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$. At $(3, 4)$ with $\\frac{dx}{dt} = 2$: $2(3)(2) + 2(4)\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -\\frac{3}{2}$.",
        "一点在 $x^{2} + y^{2} = 25$ 上运动。对 $t$ 求导：$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$。在 $(3, 4)$ 处且 $\\frac{dx}{dt} = 2$ 时：$2(3)(2) + 2(4)\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -\\frac{3}{2}$。",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick(triples);
        const x0 = a * rng.sign();
        const y0 = b * rng.sign();
        const r = rng.nonZero(-6, 6);
        const answer = Q.of(-x0 * r, y0);
        return numberProblem({
          prompt: t(
            `A point moves along the circle $x^{2} + y^{2} = ${c * c}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
            `一点沿圆 $x^{2} + y^{2} = ${c * c}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          wrong: [answer.neg(), Q.of(-y0 * r, x0), Q.of(-x0, y0)].filter((w) => !w.eq(answer)),
          solution: t(
            `$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt} = -\\frac{${x0}}{${y0}} \\cdot ${par(r)} = ${answer.toLatex()}$.`,
            `$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt} = -\\frac{${x0}}{${y0}} \\cdot ${par(r)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "related-rates-on-other-curves",
      title: t("Related rates on other curves", "其他曲线上的相关变化率"),
      explanation: t(
        "Differentiate each term with respect to $t$, using the product rule where $x$ and $y$ are multiplied. On $xy = 12$: $\\frac{dx}{dt}y + x\\frac{dy}{dt} = 0$.",
        "对每一项关于 $t$ 求导，$x$ 与 $y$ 相乘时用乘积法则。在 $xy = 12$ 上：$\\frac{dx}{dt}y + x\\frac{dy}{dt} = 0$。",
      ),
      generate(rng) {
        const x0 = rng.nonZero(-6, 6);
        const y0 = rng.nonZero(-6, 6);
        const r = rng.nonZero(-5, 5);
        if (rng.bool()) {
          const answer = Q.of(-y0 * r, x0);
          return numberProblem({
            prompt: t(
              `A point moves along the curve $xy = ${x0 * y0}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
              `一点沿曲线 $xy = ${x0 * y0}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
            ),
            answer,
            wrong: [answer.neg(), Q.of(-x0 * r, y0), Q.of(r * y0)].filter((w) => !w.eq(answer)),
            solution: t(
              `$y\\frac{dx}{dt} + x\\frac{dy}{dt} = 0$, so $${y0} \\cdot ${par(r)} + ${par(x0)}\\frac{dy}{dt} = 0$ and $\\frac{dy}{dt} = ${answer.toLatex()}$.`,
              `$y\\frac{dx}{dt} + x\\frac{dy}{dt} = 0$，所以 $${y0} \\cdot ${par(r)} + ${par(x0)}\\frac{dy}{dt} = 0$，$\\frac{dy}{dt} = ${answer.toLatex()}$。`,
            ),
          });
        }
        const k = rng.int(1, 3);
        const c = y0 * y0 * y0 - k * x0 * x0;
        const answer = Q.of(2 * k * x0 * r, 3 * y0 * y0);
        return numberProblem({
          prompt: t(
            `A point moves along the curve $${poly([1, "y^{3}"], [-k, "x^{2}"])} = ${c}$. When it is at $(${x0}, ${y0})$, $\\frac{dx}{dt} = ${r}$. Find $\\frac{dy}{dt}$.`,
            `一点沿曲线 $${poly([1, "y^{3}"], [-k, "x^{2}"])} = ${c}$ 运动。当它位于 $(${x0}, ${y0})$ 时，$\\frac{dx}{dt} = ${r}$。求 $\\frac{dy}{dt}$。`,
          ),
          answer,
          wrong: [answer.neg(), Q.of(2 * k * x0 * r, 3 * y0), Q.of(2 * k * x0, 3 * y0 * y0)].filter((w) => !w.eq(answer)),
          solution: t(
            `$3y^{2}\\frac{dy}{dt} - ${2 * k}x\\frac{dx}{dt} = 0$, so $${3 * y0 * y0}\\frac{dy}{dt} = ${2 * k * x0 * r}$ and $\\frac{dy}{dt} = ${answer.toLatex()}$.`,
            `$3y^{2}\\frac{dy}{dt} - ${2 * k}x\\frac{dx}{dt} = 0$，所以 $${3 * y0 * y0}\\frac{dy}{dt} = ${2 * k * x0 * r}$，$\\frac{dy}{dt} = ${answer.toLatex()}$。`,
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

/** calculatingRelatedRatesWithCirclesAndSpheres relates rates of radius, area and volume. */
export const calculatingRelatedRatesWithCirclesAndSpheres: TopicDef = {
  id: "calculating-related-rates-with-circles-and-spheres",
  title: t("Calculating Related Rates With Circles and Spheres", "圆与球的相关变化率"),
  summary: t(
    "Relate the rates of change of the radius, circumference, area, surface area and volume of circles and spheres.",
    "联系圆与球的半径、周长、面积、表面积和体积的变化率。",
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
        "Differentiate $A = \\pi r^{2}$ with respect to $t$: $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$. For the circumference $C = 2\\pi r$: $\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt}$. Leave answers in terms of $\\pi$.",
        "把 $A = \\pi r^{2}$ 对 $t$ 求导：$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$。对周长 $C = 2\\pi r$：$\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt}$。答案用 $\\pi$ 表示。",
      ),
      generate(rng) {
        const r0 = rng.int(2, 30);
        const v = rng.int(1, 9);
        const area = rng.int(0, 3) > 0;
        const answer = piTimes(Q.of(area ? 2 * r0 * v : 2 * v));
        return functionProblem({
          prompt: t(
            `A ripple spreads in a circle whose radius grows at $${v}$ cm/s. How fast is the ${area ? "area" : "circumference"} of the circle increasing when the radius is $${r0}$ cm? Give your answer in ${area ? "cm²/s" : "cm/s"}, in terms of $\\pi$.`,
            `水波呈圆形扩散，半径以 $${v}$ cm/s 的速率增大。当半径为 $${r0}$ cm 时，圆的${area ? "面积" : "周长"}增大的速率是多少？用 $\\pi$ 表示，单位为 ${area ? "cm²/s" : "cm/s"}。`,
          ),
          answer,
          wrong: area
            ? [piTimes(Q.of(r0 * r0 * v)), piTimes(Q.of(2 * r0)), piTimes(Q.of(r0 * v))]
            : [piTimes(Q.of(2 * r0 * v)), piTimes(Q.of(v))],
          solution: area
            ? t(
                `$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi(${r0})(${v}) = ${answer}$ cm²/s.`,
                `$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi(${r0})(${v}) = ${answer}$ cm²/s。`,
              )
            : t(
                `$\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt} = 2\\pi(${v}) = ${answer}$ cm/s, whatever the radius.`,
                `$\\frac{dC}{dt} = 2\\pi\\frac{dr}{dt} = 2\\pi(${v}) = ${answer}$ cm/s，与半径无关。`,
              ),
        });
      },
    },
    {
      id: "growing-spheres",
      title: t("Growing spheres", "膨胀的球"),
      explanation: t(
        "For a sphere, $V = \\frac{4}{3}\\pi r^{3}$ and $S = 4\\pi r^{2}$, so\n\n$$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}, \\qquad \\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt}.$$",
        "对球，$V = \\frac{4}{3}\\pi r^{3}$，$S = 4\\pi r^{2}$，所以\n\n$$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}, \\qquad \\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt}.$$",
      ),
      generate(rng) {
        const r0 = rng.int(2, 15);
        const v = Q.of(rng.int(1, 5), rng.pick([1, 1, 2, 4]));
        const volume = rng.bool();
        const answer = piTimes(v.mul(Q.of(volume ? 4 * r0 * r0 : 8 * r0)));
        return functionProblem({
          prompt: t(
            `The radius of a spherical balloon increases at $${v.toLatex()}$ cm/s. How fast is its ${volume ? "volume" : "surface area"} increasing when the radius is $${r0}$ cm? Give your answer in ${volume ? "cm³/s" : "cm²/s"}, in terms of $\\pi$.`,
            `球形气球的半径以 $${v.toLatex()}$ cm/s 的速率增大。当半径为 $${r0}$ cm 时，它的${volume ? "体积" : "表面积"}增大的速率是多少？用 $\\pi$ 表示，单位为 ${volume ? "cm³/s" : "cm²/s"}。`,
          ),
          answer,
          wrong: volume
            ? [piTimes(v.mul(Q.of(4 * r0 * r0, 3))), piTimes(v.mul(Q.of(4 * r0 * r0 * r0, 3))), piTimes(v.mul(Q.of(8 * r0)))]
            : [piTimes(v.mul(Q.of(4 * r0 * r0))), piTimes(v.mul(Q.of(4 * r0)))],
          solution: volume
            ? t(
                `$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt} = 4\\pi(${r0})^{2} \\cdot ${v.toLatex()} = ${answer}$ cm³/s.`,
                `$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt} = 4\\pi(${r0})^{2} \\cdot ${v.toLatex()} = ${answer}$ cm³/s。`,
              )
            : t(
                `$\\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt} = 8\\pi(${r0}) \\cdot ${v.toLatex()} = ${answer}$ cm²/s.`,
                `$\\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt} = 8\\pi(${r0}) \\cdot ${v.toLatex()} = ${answer}$ cm²/s。`,
              ),
        });
      },
    },
    {
      id: "finding-the-rate-of-change-of-a-radius",
      title: t("Finding the rate of change of a radius", "求半径的变化率"),
      explanation: t(
        "When the rate of the area or volume is given, solve for $\\frac{dr}{dt}$. If air is pumped into a sphere at $100$ cm³/s, then at $r = 5$: $100 = 4\\pi(25)\\frac{dr}{dt}$, so $\\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s.",
        "已知面积或体积的变化率时，解出 $\\frac{dr}{dt}$。若以 $100$ cm³/s 的速率向球内充气，则在 $r = 5$ 时：$100 = 4\\pi(25)\\frac{dr}{dt}$，所以 $\\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s。",
      ),
      generate(rng) {
        const sphere = rng.bool();
        const r0 = rng.int(2, 12);
        const q = rng.int(1, 30) * (sphere ? 10 : 2);
        const k = sphere ? 4 * r0 * r0 : 2 * r0;
        const answer = overPi(Q.of(q, k));
        return functionProblem({
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
          wrong: [piTimes(Q.of(q * k)), overPi(Q.of(q, sphere ? r0 * r0 : r0)), overPi(Q.of(k, q))],
          solution: sphere
            ? t(
                `$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}$, so $${q} = ${k}\\pi\\frac{dr}{dt}$ and $\\frac{dr}{dt} = ${answer}$ cm/s.`,
                `$\\frac{dV}{dt} = 4\\pi r^{2}\\frac{dr}{dt}$，所以 $${q} = ${k}\\pi\\frac{dr}{dt}$，$\\frac{dr}{dt} = ${answer}$ cm/s。`,
              )
            : t(
                `$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$, so $${q} = ${k}\\pi\\frac{dr}{dt}$ and $\\frac{dr}{dt} = ${answer}$ m/min.`,
                `$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$，所以 $${q} = ${k}\\pi\\frac{dr}{dt}$，$\\frac{dr}{dt} = ${answer}$ m/min。`,
              ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesWithSquares relates rates of the side, perimeter and area of squares. */
export const calculatingRelatedRatesWithSquares: TopicDef = {
  id: "calculating-related-rates-with-squares",
  title: t("Calculating Related Rates With Squares", "正方形的相关变化率"),
  summary: t("Relate the rates of change of the side, perimeter and area of a square.", "联系正方形的边长、周长和面积的变化率。"),
  prerequisites: ["introduction-to-related-rates"],
  encompasses: [{ topic: "introduction-to-related-rates", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-area-and-perimeter-of-squares",
      title: t("Rates of area and perimeter of squares", "正方形面积与周长的变化率"),
      explanation: t(
        "For a square of side $s$, $A = s^{2}$ and $P = 4s$, so $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ and $\\frac{dP}{dt} = 4\\frac{ds}{dt}$.",
        "边长为 $s$ 的正方形，$A = s^{2}$，$P = 4s$，所以 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$，$\\frac{dP}{dt} = 4\\frac{ds}{dt}$。",
      ),
      generate(rng) {
        const s0 = rng.int(2, 25);
        const v = rng.nonZero(-6, 8);
        const area = rng.int(0, 3) > 0;
        const answer = area ? 2 * s0 * v : 4 * v;
        return numberProblem({
          prompt: t(
            `The side of a square is ${v > 0 ? "increasing" : "decreasing"} at $${Math.abs(v)}$ cm/s. Find the rate of change of its ${area ? "area, in cm²/s" : "perimeter, in cm/s"}, when the side is $${s0}$ cm.`,
            `正方形的边长以 $${Math.abs(v)}$ cm/s 的速率${v > 0 ? "增大" : "减小"}。当边长为 $${s0}$ cm 时，求它的${area ? "面积的变化率（cm²/s）" : "周长的变化率（cm/s）"}。`,
          ),
          answer,
          wrong: (area ? [s0 * v, 2 * s0, -answer] : [v, 4 * s0, -answer]).filter((w) => w !== answer),
          solution: area
            ? t(
                `$\\frac{ds}{dt} = ${v}$, so $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(${s0})(${v}) = ${answer}$ cm²/s.`,
                `$\\frac{ds}{dt} = ${v}$，所以 $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2(${s0})(${v}) = ${answer}$ cm²/s。`,
              )
            : t(
                `$\\frac{ds}{dt} = ${v}$, so $\\frac{dP}{dt} = 4\\frac{ds}{dt} = ${answer}$ cm/s.`,
                `$\\frac{ds}{dt} = ${v}$，所以 $\\frac{dP}{dt} = 4\\frac{ds}{dt} = ${answer}$ cm/s。`,
              ),
        });
      },
    },
    {
      id: "rates-of-sides-of-squares",
      title: t("Rates of sides of squares", "正方形边长的变化率"),
      explanation: t(
        "When the area's rate is given, first find the side from the area, then solve $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ for $\\frac{ds}{dt}$. If $A = 49$ and $\\frac{dA}{dt} = 21$: $s = 7$, so $21 = 14\\frac{ds}{dt}$ and $\\frac{ds}{dt} = \\frac{3}{2}$.",
        "已知面积的变化率时，先由面积求出边长，再由 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$ 解出 $\\frac{ds}{dt}$。若 $A = 49$，$\\frac{dA}{dt} = 21$：$s = 7$，所以 $21 = 14\\frac{ds}{dt}$，$\\frac{ds}{dt} = \\frac{3}{2}$。",
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
          wrong: [Q.of(q, 2 * s0 * s0), Q.of(q, s0), Q.of(2 * s0 * q)].filter((w) => !w.eq(answer)),
          solution: t(
            `$s = \\sqrt{${s0 * s0}} = ${s0}$. From $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$: $${q} = ${2 * s0}\\frac{ds}{dt}$, so $\\frac{ds}{dt} = ${answer.toLatex()}$ cm/s.`,
            `$s = \\sqrt{${s0 * s0}} = ${s0}$。由 $\\frac{dA}{dt} = 2s\\frac{ds}{dt}$：$${q} = ${2 * s0}\\frac{ds}{dt}$，所以 $\\frac{ds}{dt} = ${answer.toLatex()}$ cm/s。`,
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
  prerequisites: ["calculating-related-rates-with-squares", "volumes-of-rectangular-solids"],
  encompasses: [
    { topic: "calculating-related-rates-with-squares", weight: 0.3 },
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-volume-of-boxes",
      title: t("Rates of volume of boxes", "长方体体积的变化率"),
      explanation: t(
        "For $V = lwh$ with all three edges changing, the product rule gives\n\n$$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt}.$$",
        "对 $V = lwh$，当三条棱都在变化时，由乘积法则\n\n$$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt}.$$",
      ),
      generate(rng) {
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 10), rng.int(1, 8)];
        const [dl, dw, dh] = [rng.nonZero(-3, 4), rng.nonZero(-3, 4), rng.nonZero(-3, 4)];
        const terms = [dl * w * h, l * dw * h, l * w * dh];
        const answer = terms[0]! + terms[1]! + terms[2]!;
        return numberProblem({
          prompt: t(
            `The length, width and height of a box are changing at $${dl}$, $${dw}$ and $${dh}$ cm/s. Find the rate of change of its volume, in cm³/s, when the length is $${l}$ cm, the width $${w}$ cm and the height $${h}$ cm.`,
            `一个长方体的长、宽、高分别以 $${dl}$、$${dw}$、$${dh}$ cm/s 的速率变化。当长为 $${l}$ cm、宽为 $${w}$ cm、高为 $${h}$ cm 时，求其体积的变化率（cm³/s）。`,
          ),
          answer,
          wrong: [dl * dw * dh, l * w * h, (dl + dw + dh) * l * w * h].filter((v) => v !== answer),
          solution: t(
            `$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt} = ${terms.map(String).join(" + ").replaceAll("+ -", "- ")} = ${answer}$ cm³/s.`,
            `$\\frac{dV}{dt} = \\frac{dl}{dt}wh + l\\frac{dw}{dt}h + lw\\frac{dh}{dt} = ${terms.map(String).join(" + ").replaceAll("+ -", "- ")} = ${answer}$ cm³/s。`,
          ),
        });
      },
    },
    {
      id: "rates-of-cubes",
      title: t("Rates of cubes", "正方体的变化率"),
      explanation: t(
        "For a cube of edge $s$, $V = s^{3}$ and $S = 6s^{2}$, so $\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$ and $\\frac{dS}{dt} = 12s\\frac{ds}{dt}$.",
        "棱长为 $s$ 的正方体，$V = s^{3}$，$S = 6s^{2}$，所以 $\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$，$\\frac{dS}{dt} = 12s\\frac{ds}{dt}$。",
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
            wrong: [Q.of(q, s0 * s0), Q.of(3 * s0 * s0 * q), Q.of(q, 3 * s0)].filter((w) => !w.eq(answer)),
            solution: t(
              `$\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$, so $${q} = ${3 * s0 * s0}\\frac{ds}{dt}$ and $\\frac{ds}{dt} = ${answer.toLatex()}$ cm/s.`,
              `$\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt}$，所以 $${q} = ${3 * s0 * s0}\\frac{ds}{dt}$，$\\frac{ds}{dt} = ${answer.toLatex()}$ cm/s。`,
            ),
          });
        }
        const v = rng.int(1, 5);
        const volume = kind === 0;
        const answer = volume ? 3 * s0 * s0 * v : 12 * s0 * v;
        return numberProblem({
          prompt: t(
            `The edges of a cube grow at $${v}$ cm/s. How fast is its ${volume ? "volume growing, in cm³/s" : "surface area growing, in cm²/s"}, when the edge is $${s0}$ cm?`,
            `正方体的棱长以 $${v}$ cm/s 的速率增大。当棱长为 $${s0}$ cm 时，它的${volume ? "体积增大的速率是多少（cm³/s）" : "表面积增大的速率是多少（cm²/s）"}？`,
          ),
          answer,
          wrong: (volume ? [s0 * s0 * v, 3 * s0 * s0, s0 * s0 * s0 * v] : [6 * s0 * v, 12 * s0, 6 * s0 * s0 * v]).filter(
            (w) => w !== answer,
          ),
          solution: volume
            ? t(
                `$\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt} = 3(${s0})^{2}(${v}) = ${answer}$ cm³/s.`,
                `$\\frac{dV}{dt} = 3s^{2}\\frac{ds}{dt} = 3(${s0})^{2}(${v}) = ${answer}$ cm³/s。`,
              )
            : t(
                `$\\frac{dS}{dt} = 12s\\frac{ds}{dt} = 12(${s0})(${v}) = ${answer}$ cm²/s.`,
                `$\\frac{dS}{dt} = 12s\\frac{ds}{dt} = 12(${s0})(${v}) = ${answer}$ cm²/s。`,
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
  prerequisites: ["related-rates-with-implicit-functions"],
  encompasses: [{ topic: "related-rates-with-implicit-functions", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "sliding-ladders",
      title: t("Sliding ladders", "滑动的梯子"),
      explanation: t(
        "A ladder of length $L$ leans against a wall, with its foot $x$ from the wall and its top $y$ up the wall: $x^{2} + y^{2} = L^{2}$. Then $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$: as the foot slides out, the top slides down.",
        "长为 $L$ 的梯子靠在墙上，梯脚离墙 $x$，梯顶离地 $y$：$x^{2} + y^{2} = L^{2}$。于是 $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$：梯脚向外滑时，梯顶向下滑。",
      ),
      generate(rng) {
        const [x0, y0, c] = rng.pick(triples);
        const v = Q.of(rng.int(1, 6), rng.pick([1, 2, 4]));
        const answer = v.mul(Q.of(x0, y0));
        return numberProblem({
          prompt: t(
            `A $${c}$ m ladder leans against a vertical wall. Its foot slides away from the wall at $${v.toLatex()}$ m/s. How fast is the top sliding down the wall, in m/s, when the foot is $${x0}$ m from the wall?`,
            `一架长 $${c}$ m 的梯子靠在竖直的墙上，梯脚以 $${v.toLatex()}$ m/s 的速率离墙滑开。当梯脚离墙 $${x0}$ m 时，梯顶沿墙下滑的速率是多少（m/s）？`,
          ),
          answer,
          wrong: [v.mul(Q.of(y0, x0)), v, v.mul(Q.of(x0, c))].filter((w) => !w.eq(answer)),
          solution: t(
            `When $x = ${x0}$, $y = \\sqrt{${c}^{2} - ${x0}^{2}} = ${y0}$. From $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$: $${x0} \\cdot ${v.toLatex()} + ${y0}\\frac{dy}{dt} = 0$, so $\\frac{dy}{dt} = ${answer.neg().toLatex()}$. The top slides down at $${answer.toLatex()}$ m/s.`,
            `当 $x = ${x0}$ 时，$y = \\sqrt{${c}^{2} - ${x0}^{2}} = ${y0}$。由 $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$：$${x0} \\cdot ${v.toLatex()} + ${y0}\\frac{dy}{dt} = 0$，所以 $\\frac{dy}{dt} = ${answer.neg().toLatex()}$。梯顶以 $${answer.toLatex()}$ m/s 的速率下滑。`,
          ),
        });
      },
    },
    {
      id: "distances-between-moving-objects",
      title: t("Distances between moving objects", "运动物体之间的距离"),
      explanation: t(
        "If two objects move along perpendicular roads, their distance $s$ satisfies $s^{2} = x^{2} + y^{2}$, so\n\n$$s\\frac{ds}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}.$$\n\nA distance that is shrinking has a negative rate.",
        "若两个物体沿互相垂直的道路运动，它们的距离 $s$ 满足 $s^{2} = x^{2} + y^{2}$，所以\n\n$$s\\frac{ds}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}.$$\n\n正在缩短的距离的变化率为负。",
      ),
      generate(rng) {
        const [p, q, r] = rng.pick(triples);
        const k = rng.pick([1, 2, 5, 10]);
        const [x0, y0, s0] = [p * k, q * k, r * k];
        const u = rng.int(3, 12) * 10;
        const w = rng.int(3, 12) * 10;
        const answer = Q.of(-x0 * u + y0 * w, s0);
        return numberProblem({
          prompt: t(
            `Car A is $${x0}$ km east of an intersection, driving west toward it at $${u}$ km/h. Car B is $${y0}$ km north of the intersection, driving north away from it at $${w}$ km/h. At what rate is the distance between the cars changing, in km/h?`,
            `汽车 A 在路口以东 $${x0}$ km 处，以 $${u}$ km/h 的速度向西驶向路口。汽车 B 在路口以北 $${y0}$ km 处，以 $${w}$ km/h 的速度向北驶离路口。两车之间的距离以多大的速率变化（km/h）？`,
          ),
          answer,
          wrong: [Q.of(x0 * u + y0 * w, s0), Q.of(u + w), Q.of(x0 * u - y0 * w, s0)].filter((v) => !v.eq(answer)),
          solution: t(
            `The distance is $s = \\sqrt{${x0}^{2} + ${y0}^{2}} = ${s0}$. With $\\frac{dx}{dt} = -${u}$ and $\\frac{dy}{dt} = ${w}$, $${s0}\\frac{ds}{dt} = ${x0}(-${u}) + ${y0}(${w}) = ${-x0 * u + y0 * w}$, so $\\frac{ds}{dt} = ${answer.toLatex()}$ km/h.`,
            `距离为 $s = \\sqrt{${x0}^{2} + ${y0}^{2}} = ${s0}$。由 $\\frac{dx}{dt} = -${u}$，$\\frac{dy}{dt} = ${w}$，$${s0}\\frac{ds}{dt} = ${x0}(-${u}) + ${y0}(${w}) = ${-x0 * u + y0 * w}$，所以 $\\frac{ds}{dt} = ${answer.toLatex()}$ km/h。`,
          ),
        });
      },
    },
  ],
};

/** calculatingRelatedRatesUsingSimilarTriangles relates rates through similar triangles. */
export const calculatingRelatedRatesUsingSimilarTriangles: TopicDef = {
  id: "calculating-related-rates-using-similar-triangles",
  title: t("Calculating Related Rates Using Similar Triangles", "用相似三角形计算相关变化率"),
  summary: t(
    "Use similar triangles to link two lengths, then relate their rates: shadows cast by lampposts.",
    "用相似三角形联系两段长度，再联系它们的变化率：路灯下的影子。",
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
        "A person of height $h$ walks away from a lamppost of height $H$. With $x$ the distance from the post and $s$ the shadow's length, similar triangles give $\\frac{s}{h} = \\frac{x + s}{H}$, so $s = \\frac{h}{H - h}x$ and\n\n$$\\frac{ds}{dt} = \\frac{h}{H - h}\\frac{dx}{dt}.$$",
        "身高为 $h$ 的人从高为 $H$ 的路灯下走开。设人离灯柱的距离为 $x$，影长为 $s$，由相似三角形得 $\\frac{s}{h} = \\frac{x + s}{H}$，所以 $s = \\frac{h}{H - h}x$，\n\n$$\\frac{ds}{dt} = \\frac{h}{H - h}\\frac{dx}{dt}.$$",
      ),
      generate(rng) {
        const h = Q.of(rng.pick([15, 16, 18, 20]), 10);
        const H = h.add(Q.of(rng.int(2, 8) * 5, 10));
        const v = Q.of(rng.int(5, 20), 10);
        const ratio = h.div(H.sub(h));
        const answer = ratio.mul(v);
        const n = (q: Q) => decimal(q);
        return numberProblem({
          prompt: t(
            `A person $${n(h)}$ m tall walks away from a $${n(H)}$ m lamppost at $${n(v)}$ m/s. How fast is the length of their shadow increasing, in m/s?`,
            `一个身高 $${n(h)}$ m 的人以 $${n(v)}$ m/s 的速度从高 $${n(H)}$ m 的路灯下走开。他的影子长度增加的速率是多少（m/s）？`,
          ),
          answer,
          wrong: [h.div(H).mul(v), H.div(H.sub(h)).mul(v), v].filter((w) => !w.eq(answer)),
          solution: t(
            `$\\frac{s}{${n(h)}} = \\frac{x + s}{${n(H)}}$ gives $${n(H.sub(h))}s = ${n(h)}x$, so $s = ${ratio.toLatex()}x$ and $\\frac{ds}{dt} = ${ratio.toLatex()} \\cdot ${n(v)} = ${answer.toLatex()}$ m/s.`,
            `由 $\\frac{s}{${n(h)}} = \\frac{x + s}{${n(H)}}$ 得 $${n(H.sub(h))}s = ${n(h)}x$，所以 $s = ${ratio.toLatex()}x$，$\\frac{ds}{dt} = ${ratio.toLatex()} \\cdot ${n(v)} = ${answer.toLatex()}$ m/s。`,
          ),
        });
      },
    },
    {
      id: "tips-of-shadows",
      title: t("Tips of shadows", "影子顶端的速度"),
      explanation: t(
        "The tip of the shadow is $x + s = \\frac{H}{H - h}x$ from the post, so it moves at $\\frac{H}{H - h}\\frac{dx}{dt}$, faster than the person walks.",
        "影子的顶端离灯柱 $x + s = \\frac{H}{H - h}x$，所以它移动的速度为 $\\frac{H}{H - h}\\frac{dx}{dt}$，比人走得快。",
      ),
      generate(rng) {
        const h = Q.of(rng.pick([15, 16, 18, 20]), 10);
        const H = h.add(Q.of(rng.int(2, 8) * 5, 10));
        const v = Q.of(rng.int(5, 20), 10);
        const ratio = H.div(H.sub(h));
        const answer = ratio.mul(v);
        const n = (q: Q) => decimal(q);
        return numberProblem({
          prompt: t(
            `A person $${n(h)}$ m tall walks away from a $${n(H)}$ m lamppost at $${n(v)}$ m/s. How fast is the tip of their shadow moving away from the lamppost, in m/s?`,
            `一个身高 $${n(h)}$ m 的人以 $${n(v)}$ m/s 的速度从高 $${n(H)}$ m 的路灯下走开。他的影子顶端远离灯柱的速度是多少（m/s）？`,
          ),
          answer,
          wrong: [h.div(H.sub(h)).mul(v), v, h.div(H).mul(v)].filter((w) => !w.eq(answer)),
          solution: t(
            `With $s = ${h.div(H.sub(h)).toLatex()}x$, the tip is at $x + s = ${ratio.toLatex()}x$, so it moves at $${ratio.toLatex()} \\cdot ${n(v)} = ${answer.toLatex()}$ m/s.`,
            `由 $s = ${h.div(H.sub(h)).toLatex()}x$，影子顶端位于 $x + s = ${ratio.toLatex()}x$，所以它移动的速度为 $${ratio.toLatex()} \\cdot ${n(v)} = ${answer.toLatex()}$ m/s。`,
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
      title: t("Rates of change of angles", "角的变化率"),
      explanation: t(
        "A plane flies at constant altitude $h$ toward an observer. With $x$ its horizontal distance and $\\theta$ its angle of elevation, $\\tan\\theta = \\frac{h}{x}$. Differentiating, $\\sec^{2}\\theta\\frac{d\\theta}{dt} = -\\frac{h}{x^{2}}\\frac{dx}{dt}$, and since $\\sec^{2}\\theta = \\frac{x^{2} + h^{2}}{x^{2}}$,\n\n$$\\frac{d\\theta}{dt} = -\\frac{h}{x^{2} + h^{2}}\\frac{dx}{dt}.$$",
        "飞机在高度 $h$ 处水平飞向观察者。设水平距离为 $x$，仰角为 $\\theta$，则 $\\tan\\theta = \\frac{h}{x}$。求导得 $\\sec^{2}\\theta\\frac{d\\theta}{dt} = -\\frac{h}{x^{2}}\\frac{dx}{dt}$，又 $\\sec^{2}\\theta = \\frac{x^{2} + h^{2}}{x^{2}}$，所以\n\n$$\\frac{d\\theta}{dt} = -\\frac{h}{x^{2} + h^{2}}\\frac{dx}{dt}.$$",
      ),
      generate(rng) {
        const h = rng.int(2, 9);
        const x0 = rng.int(2, 15);
        const v = rng.int(2, 12) * 50;
        const answer = Q.of(h * v, x0 * x0 + h * h);
        return numberProblem({
          prompt: t(
            `A plane flies horizontally at an altitude of $${h}$ km toward an observer on the ground, at $${v}$ km/h. How fast is the angle of elevation from the observer to the plane increasing, in radians per hour, when the plane is $${x0}$ km away horizontally?`,
            `飞机在 $${h}$ km 的高度以 $${v}$ km/h 的速度水平飞向地面上的观察者。当飞机与观察者的水平距离为 $${x0}$ km 时，观察者看飞机的仰角增大的速率是多少（弧度每小时）？`,
          ),
          answer,
          wrong: [Q.of(h * v, x0 * x0), Q.of(x0 * v, x0 * x0 + h * h), Q.of(v, h)].filter((w) => !w.eq(answer)),
          solution: t(
            `$\\tan\\theta = \\frac{${h}}{x}$, so $\\frac{d\\theta}{dt} = -\\frac{${h}}{x^{2} + ${h * h}}\\frac{dx}{dt}$. With $x = ${x0}$ and $\\frac{dx}{dt} = -${v}$: $\\frac{d\\theta}{dt} = \\frac{${h} \\cdot ${v}}{${x0 * x0 + h * h}} = ${answer.toLatex()}$ radians per hour.`,
            `$\\tan\\theta = \\frac{${h}}{x}$，所以 $\\frac{d\\theta}{dt} = -\\frac{${h}}{x^{2} + ${h * h}}\\frac{dx}{dt}$。代入 $x = ${x0}$，$\\frac{dx}{dt} = -${v}$：$\\frac{d\\theta}{dt} = \\frac{${h} \\cdot ${v}}{${x0 * x0 + h * h}} = ${answer.toLatex()}$ 弧度每小时。`,
          ),
        });
      },
    },
    {
      id: "rates-of-change-of-lengths-from-angles",
      title: t("Rates of change of lengths from angles", "由角求长度的变化率"),
      explanation: t(
        "A searchlight $d$ m from a wall rotates at $\\frac{d\\theta}{dt}$ radians per second. The spot is $x = d\\tan\\theta$ along the wall from the nearest point, so\n\n$$\\frac{dx}{dt} = d\\sec^{2}\\theta\\frac{d\\theta}{dt}.$$\n\nAt $\\theta = \\frac{\\pi}{4}$, $\\sec^{2}\\theta = 2$.",
        "探照灯距墙 $d$ m，以 $\\frac{d\\theta}{dt}$ 弧度每秒的速率转动。光斑沿墙到最近点的距离为 $x = d\\tan\\theta$，所以\n\n$$\\frac{dx}{dt} = d\\sec^{2}\\theta\\frac{d\\theta}{dt}.$$\n\n在 $\\theta = \\frac{\\pi}{4}$ 时，$\\sec^{2}\\theta = 2$。",
      ),
      generate(rng) {
        const d = rng.int(2, 30);
        const w = Q.of(rng.int(1, 5), rng.pick([1, 2, 4, 10]));
        const [angle, sec2] = rng.pick([
          ["\\frac{\\pi}{6}", Q.of(4, 3)],
          ["\\frac{\\pi}{4}", Q.of(2)],
          ["\\frac{\\pi}{3}", Q.of(4)],
        ] as const);
        const answer = w.mul(sec2).mul(Q.of(d));
        return numberProblem({
          prompt: t(
            `A searchlight $${d}$ m from a straight wall rotates at $${w.toLatex()}$ radians per second. How fast is the spot of light moving along the wall, in m/s, when the beam makes an angle of $${angle}$ with the perpendicular to the wall?`,
            `探照灯距一面笔直的墙 $${d}$ m，以 $${w.toLatex()}$ 弧度每秒的速率转动。当光束与墙的垂线成 $${angle}$ 角时，光斑沿墙移动的速度是多少（m/s）？`,
          ),
          answer,
          wrong: [w.mul(Q.of(d)), w.mul(Q.of(d)).div(sec2), answer.mul(Q.of(d))].filter((v) => !v.eq(answer)),
          solution: t(
            `$x = ${d}\\tan\\theta$, so $\\frac{dx}{dt} = ${d}\\sec^{2}\\theta\\frac{d\\theta}{dt}$. At $\\theta = ${angle}$, $\\sec^{2}\\theta = ${sec2.toLatex()}$, so $\\frac{dx}{dt} = ${d} \\cdot ${sec2.toLatex()} \\cdot ${w.toLatex()} = ${answer.toLatex()}$ m/s.`,
            `$x = ${d}\\tan\\theta$，所以 $\\frac{dx}{dt} = ${d}\\sec^{2}\\theta\\frac{d\\theta}{dt}$。在 $\\theta = ${angle}$ 时，$\\sec^{2}\\theta = ${sec2.toLatex()}$，所以 $\\frac{dx}{dt} = ${d} \\cdot ${sec2.toLatex()} \\cdot ${w.toLatex()} = ${answer.toLatex()}$ m/s。`,
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
        "In an inverted cone of radius $R$ and height $H$, water of depth $h$ has surface radius $r = \\frac{R}{H}h$ by similar triangles, so $V = \\frac{1}{3}\\pi\\left(\\frac{R}{H}\\right)^{2}h^{3}$ and\n\n$$\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}.$$\n\nEliminate $r$ before differentiating, since $h$ is the variable whose rate is wanted.",
        "在半径为 $R$、高为 $H$ 的倒立圆锥中，深度为 $h$ 的水面半径由相似三角形得 $r = \\frac{R}{H}h$，所以 $V = \\frac{1}{3}\\pi\\left(\\frac{R}{H}\\right)^{2}h^{3}$，\n\n$$\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}.$$\n\n求导前先消去 $r$，因为要求的是 $h$ 的变化率。",
      ),
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
        return functionProblem({
          prompt: t(
            `Water flows at $${q}$ m³/min into a tank shaped like an inverted cone, with top radius $${R}$ m and height $${H}$ m. How fast is the water level rising when the water is $${h0}$ m deep? Give your answer in m/min, in terms of $\\pi$.`,
            `水以 $${q}$ m³/min 的速率注入一个倒立圆锥形水箱，水箱顶部半径为 $${R}$ m，高为 $${H}$ m。当水深为 $${h0}$ m 时，水面上升的速率是多少？用 $\\pi$ 表示，单位为 m/min。`,
          ),
          answer,
          wrong: [overPi(Q.of(q, h0 * h0)), overPi(Q.of(3 * q).div(k)), overPi(Q.of(q).div(k.mul(Q.of(h0))))],
          solution: t(
            `$r = ${rho.toLatex()}h$, so $V = \\frac{1}{3}\\pi\\left(${rho.toLatex()}h\\right)^{2}h = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$ and $\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt}$. At $h = ${h0}$: $${q} = ${piTimes(k)}\\frac{dh}{dt}$, so $\\frac{dh}{dt} = ${answer}$ m/min.`,
            `$r = ${rho.toLatex()}h$，所以 $V = \\frac{1}{3}\\pi\\left(${rho.toLatex()}h\\right)^{2}h = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$，$\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt}$。在 $h = ${h0}$ 时：$${q} = ${piTimes(k)}\\frac{dh}{dt}$，所以 $\\frac{dh}{dt} = ${answer}$ m/min。`,
          ),
        });
      },
    },
    {
      id: "rates-of-volume-in-conical-tanks",
      title: t("Rates of volume in conical tanks", "圆锥形容器中体积的变化率"),
      explanation: t(
        "If the depth's rate is known, $\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}$ gives the rate at which the volume changes. A falling level gives a negative rate.",
        "已知深度的变化率时，由 $\\frac{dV}{dt} = \\pi\\left(\\frac{R}{H}\\right)^{2}h^{2}\\frac{dh}{dt}$ 求体积的变化率。液面下降时变化率为负。",
      ),
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
        const answer = piTimes(
          rho
            .mul(rho)
            .mul(Q.of(h0 * h0))
            .mul(v),
        );
        return functionProblem({
          prompt: t(
            `A tank shaped like an inverted cone has top radius $${R}$ m and height $${H}$ m. The water level is ${v.sign() > 0 ? "rising" : "falling"} at $${v.abs().toLatex()}$ m/min. Find the rate of change of the volume of water, in m³/min, when the water is $${h0}$ m deep, in terms of $\\pi$.`,
            `倒立圆锥形水箱顶部半径为 $${R}$ m，高为 $${H}$ m。水面以 $${v.abs().toLatex()}$ m/min 的速率${v.sign() > 0 ? "上升" : "下降"}。当水深为 $${h0}$ m 时，求水的体积的变化率（m³/min），用 $\\pi$ 表示。`,
          ),
          answer,
          wrong: [
            piTimes(
              rho
                .mul(rho)
                .mul(Q.of(h0 * h0))
                .mul(v)
                .div(Q.of(3)),
            ),
            piTimes(
              rho
                .mul(rho)
                .mul(Q.of(h0 * h0))
                .mul(v)
                .neg(),
            ),
            piTimes(Q.of(R * R * h0 * h0).mul(v)),
          ],
          solution: t(
            `$V = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$, so $\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt} = ${piTimes(rho.mul(rho))}(${h0})^{2}(${v.toLatex()}) = ${answer}$ m³/min.`,
            `$V = ${piTimes(rho.mul(rho).div(Q.of(3)))}h^{3}$，所以 $\\frac{dV}{dt} = ${piTimes(rho.mul(rho))}h^{2}\\frac{dh}{dt} = ${piTimes(rho.mul(rho))}(${h0})^{2}(${v.toLatex()}) = ${answer}$ m³/min。`,
          ),
        });
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
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [{ topic: "special-limits-involving-cosine", weight: 0.2 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "lhopitals-rule-for-zero-over-zero",
      title: t("L'Hopital's rule for 0/0", "0/0 型的洛必达法则"),
      explanation: t(
        "If $f(a) = g(a) = 0$ (or both tend to $\\pm\\infty$), and $\\lim_{x \\to a}\\frac{f'(x)}{g'(x)}$ exists, then\n\n$$\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)}.$$\n\nDifferentiate the numerator and denominator separately; this is not the quotient rule. Check the form first: the rule does not apply to a limit that is not indeterminate.",
        "若 $f(a) = g(a) = 0$（或两者都趋于 $\\pm\\infty$），且 $\\lim_{x \\to a}\\frac{f'(x)}{g'(x)}$ 存在，则\n\n$$\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)}.$$\n\n分子和分母分别求导，这不是商法则。先检查形式：极限不是未定式时不能用这个法则。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        if (kind === 4) {
          const n = rng.int(2, 5);
          const c = rng.int(1, 3);
          const answer = Q.of(n * c ** (n - 1), b);
          return numberProblem({
            prompt: t(
              `Evaluate $${lim(c)}\\frac{x^{${n}} - ${c ** n}}{${b}(x - ${c})}$.`,
              `计算 $${lim(c)}\\frac{x^{${n}} - ${c ** n}}{${b}(x - ${c})}$。`,
            ),
            answer,
            wrong: [Q.of(n, b), Q.of(n * c ** (n - 1)), Q.zero].filter((w) => !w.eq(answer)),
            solution: t(
              `At $x = ${c}$ both numerator and denominator are $0$. By L'Hôpital's rule the limit is $${lim(c)}\\frac{${n}x^{${n - 1}}}{${b}} = \\frac{${n * c ** (n - 1)}}{${b}} = ${answer.toLatex()}$.`,
              `在 $x = ${c}$ 处分子分母都为 $0$。由洛必达法则，极限为 $${lim(c)}\\frac{${n}x^{${n - 1}}}{${b}} = \\frac{${n * c ** (n - 1)}}{${b}} = ${answer.toLatex()}$。`,
            ),
          });
        }
        const [top, dTop] = [
          [`e^{${a}x} - 1`, `${a}e^{${a}x}`],
          [`\\sin(${a}x)`, `${a}\\cos(${a}x)`],
          [`\\ln(1 + ${a}x)`, `\\frac{${a}}{1 + ${a}x}`],
          [`\\tan(${a}x)`, `${a}\\sec^{2}(${a}x)`],
        ][kind]!;
        const answer = Q.of(a, b);
        return numberProblem({
          prompt: t(`Evaluate $${lim(0)}\\frac{${top}}{${b}x}$.`, `计算 $${lim(0)}\\frac{${top}}{${b}x}$。`),
          answer,
          wrong: [Q.of(b, a), Q.one, Q.zero, Q.of(a)].filter((w) => !w.eq(answer)),
          solution: t(
            `At $x = 0$ both numerator and denominator are $0$. By L'Hôpital's rule the limit is $${lim(0)}\\frac{${dTop}}{${b}} = ${answer.toLatex()}$.`,
            `在 $x = 0$ 处分子分母都为 $0$。由洛必达法则，极限为 $${lim(0)}\\frac{${dTop}}{${b}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "applying-lhopitals-rule-repeatedly",
      title: t("Applying L'Hopital's rule repeatedly", "多次使用洛必达法则"),
      explanation: t(
        "If $\\frac{f'(x)}{g'(x)}$ is still indeterminate, apply the rule again:\n\n$$\\lim_{x \\to 0}\\frac{e^{x} - 1 - x}{x^{2}} = \\lim_{x \\to 0}\\frac{e^{x} - 1}{2x} = \\lim_{x \\to 0}\\frac{e^{x}}{2} = \\frac{1}{2}.$$\n\nIt also handles $\\frac{\\infty}{\\infty}$: $\\lim_{x \\to \\infty}\\frac{x^{2}}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2x}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2}{e^{x}} = 0$.",
        "若 $\\frac{f'(x)}{g'(x)}$ 仍是未定式，就再用一次法则：\n\n$$\\lim_{x \\to 0}\\frac{e^{x} - 1 - x}{x^{2}} = \\lim_{x \\to 0}\\frac{e^{x} - 1}{2x} = \\lim_{x \\to 0}\\frac{e^{x}}{2} = \\frac{1}{2}.$$\n\n它也适用于 $\\frac{\\infty}{\\infty}$：$\\lim_{x \\to \\infty}\\frac{x^{2}}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2x}{e^{x}} = \\lim_{x \\to \\infty}\\frac{2}{e^{x}} = 0$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const ax = a === 1 ? "x" : `${a}x`;
        const [top, bottom, d1, d2, answer] =
          kind === 0
            ? [
                `e^{${ax}} - 1 - ${ax}`,
                `${b}x^{2}`,
                `\\frac{${a === 1 ? "" : a}e^{${ax}} - ${a}}{${2 * b}x}`,
                `\\frac{${a * a === 1 ? "" : a * a}e^{${ax}}}{${2 * b}}`,
                Q.of(a * a, 2 * b),
              ]
            : kind === 1
              ? [
                  `1 - \\cos(${ax})`,
                  `${b}x^{2}`,
                  `\\frac{${a === 1 ? "" : a}\\sin(${ax})}{${2 * b}x}`,
                  `\\frac{${a * a === 1 ? "" : a * a}\\cos(${ax})}{${2 * b}}`,
                  Q.of(a * a, 2 * b),
                ]
              : kind === 2
                ? [
                    `${ax} - \\sin(${ax})`,
                    `${b}x^{3}`,
                    `\\frac{${a} - ${a === 1 ? "" : a}\\cos(${ax})}{${3 * b}x^{2}}`,
                    `\\frac{${a * a === 1 ? "" : a * a}\\sin(${ax})}{${6 * b}x}`,
                    Q.of(a * a * a, 6 * b),
                  ]
                : [
                    `e^{${ax}} - e^{-${ax}} - ${2 * a}x`,
                    `${b}x^{3}`,
                    `\\frac{${a === 1 ? "" : a}e^{${ax}} + ${a === 1 ? "" : a}e^{-${ax}} - ${2 * a}}{${3 * b}x^{2}}`,
                    `\\frac{${a * a === 1 ? "" : a * a}e^{${ax}} - ${a * a === 1 ? "" : a * a}e^{-${ax}}}{${6 * b}x}`,
                    Q.of(a * a * a, 3 * b),
                  ];
        const third = kind >= 2;
        return numberProblem({
          prompt: t(`Evaluate $${lim(0)}\\frac{${top}}{${bottom}}$.`, `计算 $${lim(0)}\\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.zero, Q.of(a, b), answer.mul(Q.of(2))].filter((w) => !w.eq(answer)),
          solution: t(
            `The form is $\\frac{0}{0}$. Applying L'Hôpital's rule gives $${lim(0)}${d1}$, which is still $\\frac{0}{0}$; applying it again gives $${lim(0)}${d2}${third ? "" : ` = ${answer.toLatex()}`}$${third ? `, still $\\frac{0}{0}$; a third application gives $${answer.toLatex()}$` : ""}.`,
            `这是 $\\frac{0}{0}$ 型。用洛必达法则得 $${lim(0)}${d1}$，仍是 $\\frac{0}{0}$ 型；再用一次得 $${lim(0)}${d2}${third ? "" : ` = ${answer.toLatex()}`}$${third ? `，仍是 $\\frac{0}{0}$ 型；第三次使用得 $${answer.toLatex()}$` : ""}。`,
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
  prerequisites: ["lhopitals-rule"],
  encompasses: [{ topic: "lhopitals-rule", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "lhopitals-rule-from-tables",
      title: t("L'Hopital's rule from tables", "由表格使用洛必达法则"),
      explanation: t(
        "If the table shows $f(a) = g(a) = 0$ and $g'(a) \\ne 0$, with $f'$ and $g'$ continuous, then $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{f'(a)}{g'(a)}$. If $f'(a) = g'(a) = 0$ as well, go on to the second derivatives.",
        "若表中 $f(a) = g(a) = 0$，$g'(a) \\ne 0$，且 $f'$、$g'$ 连续，则 $\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\frac{f'(a)}{g'(a)}$。若还有 $f'(a) = g'(a) = 0$，则继续看二阶导数。",
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
        return numberProblem({
          prompt: t(
            `$f$ and $g$ have continuous second derivatives, with values given in the table.\n\n${tab}\n\nEvaluate $${lim(a)}\\frac{f(x)}{g(x)}$.`,
            `$f$ 和 $g$ 有连续的二阶导数，相关的值如下表。\n\n${tabZh}\n\n计算 $${lim(a)}\\frac{f(x)}{g(x)}$。`,
          ),
          answer,
          wrong: [
            second ? Q.zero : Q.of(fv[2]!, gv[2]!),
            Q.of(gv[k]!, fv[k]!),
            second ? Q.of(1) : Q.of(fv[1]! * gv[2]! - fv[2]! * gv[1]!, gv[1]! * gv[1]!),
          ].filter((w) => !w.eq(answer)),
          solution: second
            ? t(
                `$f(${a}) = g(${a}) = 0$ and $f'(${a}) = g'(${a}) = 0$, so apply L'Hôpital's rule twice: the limit is $\\frac{f''(${a})}{g''(${a})} = ${ratio(fv[2]!, gv[2]!)}$.`,
                `$f(${a}) = g(${a}) = 0$ 且 $f'(${a}) = g'(${a}) = 0$，所以用两次洛必达法则：极限为 $\\frac{f''(${a})}{g''(${a})} = ${ratio(fv[2]!, gv[2]!)}$。`,
              )
            : t(
                `$f(${a}) = g(${a}) = 0$, so the form is $\\frac{0}{0}$. By L'Hôpital's rule the limit is $\\frac{f'(${a})}{g'(${a})} = ${ratio(fv[1]!, gv[1]!)}$.`,
                `$f(${a}) = g(${a}) = 0$，是 $\\frac{0}{0}$ 型。由洛必达法则，极限为 $\\frac{f'(${a})}{g'(${a})} = ${ratio(fv[1]!, gv[1]!)}$。`,
              ),
        });
      },
    },
    {
      id: "checking-the-form-before-applying-lhopitals-rule",
      title: t("Checking the form before applying L'Hopital's rule", "使用洛必达法则前检查形式"),
      explanation: t(
        "L'Hôpital's rule applies only to indeterminate forms. If $g(a) \\ne 0$ and $f$, $g$ are continuous, the limit is simply $\\frac{f(a)}{g(a)}$; using the derivatives there gives a wrong answer.",
        "洛必达法则只适用于未定式。若 $g(a) \\ne 0$ 且 $f$、$g$ 连续，极限就是 $\\frac{f(a)}{g(a)}$；此时用导数会得到错误答案。",
      ),
      generate(rng) {
        const a = rng.int(-3, 5);
        const indeterminate = rng.bool();
        const fv = [indeterminate ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const gv = [indeterminate ? 0 : rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const answer = indeterminate ? Q.of(fv[1]!, gv[1]!) : Q.of(fv[0]!, gv[0]!);
        const head = ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"];
        const tab = table(head, [`$${a}$`, `$${fv[0]}$`, `$${fv[1]}$`, `$${gv[0]}$`, `$${gv[1]}$`]);
        return numberProblem({
          prompt: t(
            `$f$ and $g$ are differentiable, with continuous derivatives, and have the values in the table.\n\n${tab}\n\nEvaluate $${lim(a)}\\frac{f(x)}{g(x)}$.`,
            `$f$ 和 $g$ 可导且导数连续，相关的值如下表。\n\n${tab}\n\n计算 $${lim(a)}\\frac{f(x)}{g(x)}$。`,
          ),
          answer,
          wrong: [indeterminate ? Q.of(gv[1]!, fv[1]!) : Q.of(fv[1]!, gv[1]!), Q.zero].filter((w) => !w.eq(answer)),
          solution: indeterminate
            ? t(
                `$f(${a}) = g(${a}) = 0$, an indeterminate form, so by L'Hôpital's rule the limit is $${ratio(fv[1]!, gv[1]!)}$.`,
                `$f(${a}) = g(${a}) = 0$，是未定式，所以由洛必达法则，极限为 $${ratio(fv[1]!, gv[1]!)}$。`,
              )
            : t(
                `$g(${a}) = ${gv[0]} \\ne 0$, so the quotient is continuous at $${a}$ and the limit is $${ratio(fv[0]!, gv[0]!)}$. L'Hôpital's rule does not apply.`,
                `$g(${a}) = ${gv[0]} \\ne 0$，商在 $${a}$ 处连续，极限为 $${ratio(fv[0]!, gv[0]!)}$。这里不能用洛必达法则。`,
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
