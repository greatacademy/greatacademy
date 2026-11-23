import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";

import { functionProblem, numberProblem } from "../problems.ts";
import { fac, type Poly, pAt, pLatex } from "./calculus-common.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { antiderivativeAt, antiderivativeLatex } from "./calculus-i-riemann.ts";
import { pMul, pSum } from "./calculus-ii-fractions-improper.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 2: Applications of Integration, modules 2.8–2.9.

/** intQ integrates an integer polynomial exactly between integer limits. */
export const intQ = (p: Poly, a: number, b: number) => antiderivativeAt(p, b).sub(antiderivativeAt(p, a));

/** pScale multiplies a polynomial by k. */
export const pScale = (p: Poly, k: number): Poly => p.map((c) => c * k);

/** int writes a definite integral. */
export const int = (a: number | string, b: number | string, body: string, v = "x") => `\\int_{${a}}^{${b}} ${body} \\, d${v}`;

/** exactProblem asks for an exact value written as an expression, such as a multiple of π. */
export function exactProblem(prompt: Text, answer: string, wrong: readonly string[], en: string, zh: string) {
  return functionProblem({ prompt, answer, wrong, solution: t(en, zh) });
}

/** times writes q times a constant symbol: "\frac{3}{2}\pi", "\sqrt{3}". */
export const times = (q: Q, symbol: string) => (symbol === "" ? q.toLatex() : q.isZero() ? "0" : `${coef(q)}${symbol}`);

/** Mistake is a wrong number with what to say about it. */
type Mistake = { readonly value: Q; readonly why: Text };

/** slip is a wrong number with its reason in English and Chinese. */
const slip = (value: Q | number, en: string, zh: string): Mistake => ({
  value: typeof value === "number" ? Q.of(value) : value,
  why: t(en, zh),
});

/** distinct keeps the first reason for each wrong value. */
const distinct = (ms: readonly Mistake[]) => ms.filter((m, i) => ms.findIndex((n) => n.value.eq(m.value)) === i);

/** worked asks for a number and explains it in labelled steps with a check. */
function worked(prompt: Text, answer: Q, parts: readonly Step[], check: Text, mistakes: readonly Mistake[]): Problem {
  return numberProblem({
    prompt,
    answer,
    mistakes: distinct(mistakes),
    solution: walked(parts, check),
  });
}

/** exactWorked asks for an exact expression and explains it in labelled steps with a check. */
function exactWorked(prompt: Text, answer: string, parts: readonly Step[], check: Text, mistakes: readonly Said[]): Problem {
  return functionWith({ prompt, answer, solution: walked(parts, check) }, mistakes);
}

/** inP writes a number in parentheses when it is negative. */
const inP = (q: Q | number) => {
  const v = typeof q === "number" ? Q.of(q) : q;
  return v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex();
};

/** around writes a decimal with three places: "4.583". */
const around = (v: number) => (Math.round(v * 1000) / 1000).toString();

/** pAtQ evaluates a polynomial at a rational number. */
const pAtQ = (p: Poly, x: Q) => p.reduceRight((s: Q, c) => s.mul(x).add(Q.of(c)), Q.zero);

/** antiderivativeIn writes the antiderivative of a polynomial in the variable v. */
const antiderivativeIn = (p: Poly, v = "x") => antiderivativeLatex(p).replace(/x/g, v);

/** evaluated writes [F]_a^b = F(b) − F(a) = value for a polynomial integrand. */
const evaluated = (p: Poly, a: number, b: number, v = "x") =>
  `\\Big[${antiderivativeIn(p, v)}\\Big]_{${a}}^{${b}} = ${antiderivativeAt(p, b).toLatex()} - ${inP(antiderivativeAt(p, a))} = ${intQ(p, a, b).toLatex()}`;

/** positivePoly chooses a polynomial of degree at most 2 with non-negative coefficients and a positive constant term. */
function positivePoly(rng: Rng): Poly {
  return [rng.int(1, 9), rng.int(0, 6), rng.int(0, 3)];
}

/** RateContext describes a quantity that changes at a given rate. */
interface RateContext {
  readonly rate: Text;
  readonly start: Text;
  readonly ask: Text;
  readonly unit: string;
}

/** rateContexts are situations in which a rate is integrated to find an amount. */
const rateContexts: readonly ((r: string, w: number, T: number) => RateContext)[] = [
  (r, w, T) => ({
    rate: t(
      `Water flows into a tank at a rate of $r(t) = ${r}$ liters per minute, where $t$ is in minutes.`,
      `水以 $r(t) = ${r}$ 升/分钟的速率流入水箱，$t$ 的单位为分钟。`,
    ),
    start: t(`The tank holds $${w}$ liters at $t = 0$.`, `$t = 0$ 时水箱中有 $${w}$ 升水。`),
    ask: t(`How many liters are in the tank at $t = ${T}$?`, `$t = ${T}$ 时水箱中有多少升水？`),
    unit: "L",
  }),
  (r, w, T) => ({
    rate: t(
      `A bacteria population grows at a rate of $r(t) = ${r}$ thousand cells per hour, where $t$ is in hours.`,
      `某细菌种群以 $r(t) = ${r}$ 千个/小时的速率增长，$t$ 的单位为小时。`,
    ),
    start: t(`There are $${w}$ thousand cells at $t = 0$.`, `$t = 0$ 时有 $${w}$ 千个细胞。`),
    ask: t(`How many thousand cells are there at $t = ${T}$?`, `$t = ${T}$ 时有多少千个细胞？`),
    unit: "",
  }),
  (r, w, T) => ({
    rate: t(
      `Snow accumulates on a roof at a rate of $r(t) = ${r}$ kilograms per hour, where $t$ is in hours.`,
      `雪以 $r(t) = ${r}$ 千克/小时的速率积在屋顶上，$t$ 的单位为小时。`,
    ),
    start: t(`There are $${w}$ kilograms of snow on the roof at $t = 0$.`, `$t = 0$ 时屋顶上有 $${w}$ 千克雪。`),
    ask: t(`How many kilograms of snow are on the roof at $t = ${T}$?`, `$t = ${T}$ 时屋顶上有多少千克雪？`),
    unit: "kg",
  }),
];

/** integratingRatesOfChange recovers an amount from its rate of change with the net change theorem. */
export const integratingRatesOfChange: TopicDef = {
  id: "integrating-rates-of-change",
  title: t("Integrating Rates of Change", "对变化率积分"),
  summary: t("The integral of a rate of change gives the net change in the quantity.", "变化率的积分给出该量的净变化。"),
  intro: t(
    "Water flows into a tank at $r(t) = 2t + 3$ liters per minute, and the tank starts with $10$ liters. The rate is the derivative of the amount, so the amount after $4$ minutes is the start plus the integral of the rate:\n\n$$10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + \\Big[t^{2} + 3t\\Big]_{0}^{4} = 10 + 28 = 38 \\text{ liters}.$$\n\nCheck: the amount is $Q(t) = 10 + t^{2} + 3t$, since $Q(0) = 10$ and $Q'(t) = 2t + 3$; then $Q(4) = 10 + 16 + 12 = 38$.\n\nIn this lesson we integrate a rate of change to find how much a quantity changes, add the starting amount, and combine an inflow with an outflow.",
    "水以 $r(t) = 2t + 3$ 升/分钟的速率流入水箱，水箱原有 $10$ 升。速率是水量的导数，所以 $4$ 分钟后的水量等于初始量加上速率的积分：\n\n$$10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + \\Big[t^{2} + 3t\\Big]_{0}^{4} = 10 + 28 = 38 \\text{ 升}$$\n\n检验：水量为 $Q(t) = 10 + t^{2} + 3t$，因为 $Q(0) = 10$ 且 $Q'(t) = 2t + 3$；于是 $Q(4) = 10 + 16 + 12 = 38$。\n\n本课我们对变化率积分，求出一个量的变化，再加上初始量，并把流入与流出合在一起考虑。",
  ),
  prerequisites: ["the-fundamental-theorem-of-calculus", "rates-of-change-in-applied-contexts"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-an-amount-from-its-rate",
      figure: calculusDrawings4["integrating-rates-of-change#finding-an-amount-from-its-rate"],
      title: t("Finding an amount from its rate", "由变化率求总量"),
      explanation: t(
        "If $Q'(t) = r(t)$, the fundamental theorem gives the net change theorem:\n\n$$Q(T) = Q(0) + \\int_{0}^{T} r(t) \\, dt.$$\n\nFor example, if water flows in at $r(t) = 2t + 3$ liters per minute and the tank starts with $10$ liters, after $4$ minutes it holds $10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + 28 = 38$ liters.\n\nCheck: the rate rises from $3$ to $11$, so the $4$ minutes add between $3 \\cdot 4 = 12$ and $11 \\cdot 4 = 44$ liters; $28$ lies between them.\n\n> **Watch out.** The integral gives only the change. Add the starting amount $Q(0)$, and integrate the rate rather than evaluating it at $t = T$.",
        "若 $Q'(t) = r(t)$，由微积分基本定理得净变化定理：\n\n$$Q(T) = Q(0) + \\int_{0}^{T} r(t) \\, dt$$\n\n例如水以 $r(t) = 2t + 3$ 升/分钟流入，水箱原有 $10$ 升，$4$ 分钟后水箱中有 $10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + 28 = 38$ 升。\n\n检验：速率从 $3$ 升到 $11$，所以这 $4$ 分钟增加的水量介于 $3 \\cdot 4 = 12$ 与 $11 \\cdot 4 = 44$ 升之间；$28$ 确实在其间。\n\n> **注意。** 积分只给出变化量，还要加上初始量 $Q(0)$；而且要对速率积分，不是把 $t = T$ 代入速率。",
      ),
      generate(rng) {
        const p = positivePoly(rng);
        const T = rng.int(1, 6);
        const w = rng.int(5, 60);
        const r = pLatex(p, "t");
        const c = rng.pick(rateContexts)(r, w, T);
        const net = intQ(p, 0, T);
        const answer = net.add(Q.of(w));
        const [low, high] = [pAt(p, 0) * T, pAt(p, T) * T];
        return worked(
          t(`${c.rate.en} ${c.start.en} ${c.ask.en}`, `${c.rate["zh-CN"]}${c.start["zh-CN"]}${c.ask["zh-CN"]}`),
          answer,
          [
            [
              ["Use the net change theorem", "用净变化定理"],
              t("The amount at the end is the starting amount plus the integral of the rate:", "终了时的量等于初始量加上速率的积分："),
              [`Q(${T}) = ${w} + ${int(0, T, `(${r})`, "t")}`],
            ],
            [["Integrate the rate", "对速率积分"], t("Use an antiderivative:", "用原函数："), [evaluated(p, 0, T, "t")]],
            [["Add the starting amount", "加上初始量"], t("So:", "所以："), [`Q(${T}) = ${w} + ${net.toLatex()} = ${answer.toLatex()}`]],
          ],
          t(
            `The rate never decreases on $[0, ${T}]$, from $r(0) = ${pAt(p, 0)}$ to $r(${T}) = ${pAt(p, T)}$, so the change lies between $${pAt(p, 0)} \\cdot ${T} = ${low}$ and $${pAt(p, T)} \\cdot ${T} = ${high}$. The change $${net.toLatex()}$ does.`,
            `在 $[0, ${T}]$ 上速率从不减小，从 $r(0) = ${pAt(p, 0)}$ 变到 $r(${T}) = ${pAt(p, T)}$，所以变化量介于 $${pAt(p, 0)} \\cdot ${T} = ${low}$ 与 $${pAt(p, T)} \\cdot ${T} = ${high}$ 之间。变化量 $${net.toLatex()}$ 确实如此。`,
          ),
          [
            slip(net, `This is only the change; the starting amount $${w}$ must be added.`, `这只是变化量；还要加上初始量 $${w}$。`),
            slip(
              w + pAt(p, T),
              `This adds the rate at $t = ${T}$, which is a rate per unit of time, not an amount; integrate the rate instead.`,
              `这里加上的是 $t = ${T}$ 时的速率，它是单位时间的变化，不是总量；应当对速率积分。`,
            ),
            slip(
              w + pAt(p, T) * T,
              `This multiplies the final rate by the time, as if the rate had been $${pAt(p, T)}$ all along; the rate changes, so integrate it.`,
              `这是把最终速率乘以时间，好像速率一直是 $${pAt(p, T)}$；速率在变化，所以要对它积分。`,
            ),
          ],
        );
      },
    },
    {
      id: "net-change-with-inflow-and-outflow",
      figure: calculusDrawings4["integrating-rates-of-change#net-change-with-inflow-and-outflow"],
      title: t("Net change with inflow and outflow", "有流入与流出时的净变化"),
      explanation: t(
        "When a quantity has an inflow rate $R(t)$ and an outflow rate $L(t)$, its rate of change is $R(t) - L(t)$, so the change from $t = a$ to $t = b$ is\n\n$$\\int_{a}^{b} \\left(R(t) - L(t)\\right) dt.$$\n\nA negative answer means the quantity decreased. For example, with $R(t) = 5$ and $L(t) = 2t$ from $t = 0$ to $t = 3$, the change is $\\int_{0}^{3} (5 - 2t) \\, dt = 15 - 9 = 6$.\n\nCheck: $15$ liters flow in and $\\int_{0}^{3} 2t \\, dt = 9$ liters flow out, which leaves $15 - 9 = 6$.\n\n> **Watch out.** Subtract the outflow, in that order: inflow minus outflow. Subtracting the rates at the two ends is not the change; the difference of the rates must be integrated.",
        "若某量的流入速率为 $R(t)$、流出速率为 $L(t)$，则它的变化率为 $R(t) - L(t)$，从 $t = a$ 到 $t = b$ 的变化量为\n\n$$\\int_{a}^{b} \\left(R(t) - L(t)\\right) dt$$\n\n结果为负说明该量减少了。例如 $R(t) = 5$，$L(t) = 2t$，从 $t = 0$ 到 $t = 3$ 的变化量为 $\\int_{0}^{3} (5 - 2t) \\, dt = 15 - 9 = 6$。\n\n检验：流入 $15$ 升，流出 $\\int_{0}^{3} 2t \\, dt = 9$ 升，剩下 $15 - 9 = 6$。\n\n> **注意。** 要按流入减流出的顺序减去流出量。两端速率之差不是变化量；要对速率之差积分。",
      ),
      generate(rng) {
        const R: Poly = [rng.int(1, 8), rng.int(0, 4), rng.int(0, 2)];
        const L: Poly = [rng.int(2, 12), rng.int(0, 3)];
        const a = rng.int(0, 3);
        const b = a + rng.int(1, 4);
        const d = pSum(R, pScale(L, -1));
        const answer = intQ(d, a, b);
        const [rl, ll] = [pLatex(R, "t"), pLatex(L, "t")];
        const [inflow, outflow] = [intQ(R, a, b), intQ(L, a, b)];
        return worked(
          t(
            `Water flows into a tank at $R(t) = ${rl}$ liters per minute and drains out at $L(t) = ${ll}$ liters per minute, where $t$ is in minutes. By how many liters does the amount of water change from $t = ${a}$ to $t = ${b}$? (Give a negative number for a decrease.)`,
            `水以 $R(t) = ${rl}$ 升/分钟流入水箱，同时以 $L(t) = ${ll}$ 升/分钟流出，$t$ 的单位为分钟。从 $t = ${a}$ 到 $t = ${b}$，水量变化了多少升？（减少时填负数。）`,
          ),
          answer,
          [
            [
              ["Write the rate of change", "写出变化率"],
              t("The rate of change is inflow minus outflow:", "变化率是流入减流出："),
              [`R(t) - L(t) = (${rl}) - (${ll}) = ${pLatex(d, "t")}`],
            ],
            [
              ["Integrate over the interval", "在区间上积分"],
              t("Use an antiderivative:", "用原函数："),
              [`${int(a, b, `(${pLatex(d, "t")})`, "t")} = ${evaluated(d, a, b, "t")}`],
            ],
          ],
          t(
            `Find the two amounts separately. In: $${int(a, b, `(${rl})`, "t")} = ${inflow.toLatex()}$. Out: $${int(a, b, `(${ll})`, "t")} = ${outflow.toLatex()}$. The change is $${inflow.toLatex()} - ${inP(outflow)} = ${answer.toLatex()}$ liters.`,
            `分别求两个量。流入：$${int(a, b, `(${rl})`, "t")} = ${inflow.toLatex()}$。流出：$${int(a, b, `(${ll})`, "t")} = ${outflow.toLatex()}$。变化量为 $${inflow.toLatex()} - ${inP(outflow)} = ${answer.toLatex()}$ 升。`,
          ),
          [
            slip(
              inflow,
              "This counts only the water that flows in; the water that drains out must be subtracted.",
              "这里只算了流入的水；还要减去流出的水。",
            ),
            slip(
              answer.neg(),
              "This is outflow minus inflow; the change is inflow minus outflow, so the sign is reversed.",
              "这是流出减流入；变化量是流入减流出，所以符号反了。",
            ),
            slip(
              pAt(d, b) - pAt(d, a),
              "This subtracts the values of the rate at the two ends; the change is the integral of the rate, not the change in the rate.",
              "这是用速率在两端的值相减；变化量是速率的积分，不是速率的变化。",
            ),
          ],
        );
      },
    },
  ],
};

/** integratingDensityFunctions finds totals from linear and radial densities. */
export const integratingDensityFunctions: TopicDef = {
  id: "integrating-density-functions",
  title: t("Integrating Density Functions", "对密度函数积分"),
  summary: t(
    "Integrate a density to find a total mass or population, using rings for radial densities.",
    "对密度积分求总质量或总人口，径向密度用圆环来处理。",
  ),
  intro: t(
    "A rod $2$ meters long has density $\\rho(x) = 2 + x$ kilograms per meter at distance $x$ from one end. A short piece of length $\\Delta x$ weighs about $\\rho(x)\\Delta x$, so the mass is the integral of the density:\n\n$$m = \\int_{0}^{2} (2 + x) \\, dx = \\Big[2x + \\frac{x^{2}}{2}\\Big]_{0}^{2} = 6 \\text{ kilograms}.$$\n\nCheck: the density grows evenly from $2$ to $4$, so its average is $3$, and $3 \\cdot 2 = 6$.\n\nIn this lesson we integrate a density along a line to find a total, and for a density that depends on the distance from a center, we add up thin rings.",
    "一根长 $2$ 米的细杆，在距一端 $x$ 处的密度为 $\\rho(x) = 2 + x$ 千克/米。长为 $\\Delta x$ 的一小段约重 $\\rho(x)\\Delta x$，所以质量是密度的积分：\n\n$$m = \\int_{0}^{2} (2 + x) \\, dx = \\Big[2x + \\frac{x^{2}}{2}\\Big]_{0}^{2} = 6 \\text{ 千克}$$\n\n检验：密度从 $2$ 均匀地增加到 $4$，平均值是 $3$，而 $3 \\cdot 2 = 6$。\n\n本课我们沿直线对密度积分求总量；当密度只取决于到中心的距离时，把细圆环加起来。",
  ),
  prerequisites: ["integrating-rates-of-change"],
  encompasses: [{ topic: "integrating-rates-of-change", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-density",
      title: t("Linear density", "线密度"),
      explanation: t(
        "If a rod lying along $[0, L]$ has density $\\rho(x)$ kilograms per meter, a short piece of length $\\Delta x$ has mass about $\\rho(x)\\Delta x$. Adding the pieces gives the total mass\n\n$$m = \\int_{0}^{L} \\rho(x) \\, dx.$$\n\nFor example, a rod of length $3$ with $\\rho(x) = 2 + x$ has mass $\\int_{0}^{3} (2 + x) \\, dx = 6 + \\frac{9}{2} = \\frac{21}{2}$.\n\nCheck: the density rises evenly from $2$ to $5$, so it averages $\\frac{7}{2}$, and $\\frac{7}{2} \\cdot 3 = \\frac{21}{2}$.\n\n> **Watch out.** Density times length gives the mass only when the density is constant. The density at the far end is a value per meter, not a mass.",
        "若位于 $[0, L]$ 上的细杆密度为 $\\rho(x)$ 千克/米，长为 $\\Delta x$ 的一小段质量约为 $\\rho(x)\\Delta x$。把各段相加，得总质量\n\n$$m = \\int_{0}^{L} \\rho(x) \\, dx$$\n\n例如长为 $3$、$\\rho(x) = 2 + x$ 的细杆，质量为 $\\int_{0}^{3} (2 + x) \\, dx = 6 + \\frac{9}{2} = \\frac{21}{2}$。\n\n检验：密度从 $2$ 均匀地增加到 $5$，平均值为 $\\frac{7}{2}$，而 $\\frac{7}{2} \\cdot 3 = \\frac{21}{2}$。\n\n> **注意。** 只有密度不变时，密度乘长度才等于质量。远端的密度是每米的值，不是质量。",
      ),
      generate(rng) {
        const p = positivePoly(rng);
        const L = rng.int(1, 6);
        const answer = intQ(p, 0, L);
        const rod = rng.bool();
        const [low, high] = [pAt(p, 0) * L, pAt(p, L) * L];
        return worked(
          rod
            ? t(
                `A rod of length $${L}$ meters has density $\\rho(x) = ${pLatex(p)}$ kilograms per meter, where $x$ is the distance in meters from one end. Find the mass of the rod in kilograms.`,
                `一根长 $${L}$ 米的细杆，密度为 $\\rho(x) = ${pLatex(p)}$ 千克/米，$x$ 为到一端的距离（米）。求细杆的质量（千克）。`,
              )
            : t(
                `Along a road, the population density is $\\rho(x) = ${pLatex(p)}$ hundred people per kilometer, where $x$ is the distance in kilometers from the town hall. How many hundred people live along the first $${L}$ kilometers?`,
                `沿一条公路，人口密度为 $\\rho(x) = ${pLatex(p)}$ 百人/千米，$x$ 为到市政厅的距离（千米）。前 $${L}$ 千米内住着多少百人？`,
              ),
          answer,
          [
            [
              ["Set up the integral", "列出积分"],
              t("Add up density times length along the interval:", "沿区间把密度乘长度加起来："),
              [int(0, L, `(${pLatex(p)})`)],
            ],
            [["Integrate", "积分"], t("Use an antiderivative:", "用原函数："), [`${int(0, L, `(${pLatex(p)})`)} = ${evaluated(p, 0, L)}`]],
          ],
          t(
            `The density never decreases on $[0, ${L}]$, from $${pAt(p, 0)}$ to $${pAt(p, L)}$, so the total lies between $${pAt(p, 0)} \\cdot ${L} = ${low}$ and $${pAt(p, L)} \\cdot ${L} = ${high}$. The answer $${answer.toLatex()}$ does.`,
            `在 $[0, ${L}]$ 上密度从不减小，从 $${pAt(p, 0)}$ 变到 $${pAt(p, L)}$，所以总量介于 $${pAt(p, 0)} \\cdot ${L} = ${low}$ 与 $${pAt(p, L)} \\cdot ${L} = ${high}$ 之间。答案 $${answer.toLatex()}$ 确实如此。`,
          ),
          [
            slip(
              high,
              `This treats the density as constant at its value $${pAt(p, L)}$ at the far end; the density changes, so integrate it.`,
              `这是把密度当作一直等于远端的值 $${pAt(p, L)}$；密度在变化，所以要对它积分。`,
            ),
            slip(
              pAt(p, L),
              `This is the density at $x = ${L}$, a value per unit of length, not a total.`,
              `这是 $x = ${L}$ 处的密度，是单位长度上的值，不是总量。`,
            ),
            slip(
              pAt(p, 0) * L,
              `This treats the density as constant at its value $${pAt(p, 0)}$ at $x = 0$; the density changes, so integrate it.`,
              `这是把密度当作一直等于 $x = 0$ 处的值 $${pAt(p, 0)}$；密度在变化，所以要对它积分。`,
            ),
          ],
        );
      },
    },
    {
      id: "radial-density",
      title: t("Radial density", "径向密度"),
      explanation: t(
        "If the density of a circular region depends only on the distance $r$ from the center, cut it into thin rings. A ring of radius $r$ and width $\\Delta r$ has area about $2\\pi r\\Delta r$, so the total is\n\n$$\\int_{0}^{R} 2\\pi r\\rho(r) \\, dr.$$\n\nFor example, with $\\rho(r) = 3 - r$ thousand people per square kilometer within $3$ km of the center, the population is $2\\pi\\int_{0}^{3} (3r - r^{2}) \\, dr = 9\\pi$ thousand.\n\nCheck: a constant density $c$ gives $2\\pi\\int_{0}^{R} cr \\, dr = c\\pi R^{2}$, which is density times area, as it should be.\n\n> **Watch out.** Keep the factor $r$: a ring of radius $r$ is $2\\pi r$ long. Without it, the integral treats every ring as equally long.",
        "若圆形区域的密度只与到中心的距离 $r$ 有关，就把它切成细圆环。半径为 $r$、宽为 $\\Delta r$ 的圆环面积约为 $2\\pi r\\Delta r$，所以总量为\n\n$$\\int_{0}^{R} 2\\pi r\\rho(r) \\, dr$$\n\n例如在距中心 $3$ 千米内 $\\rho(r) = 3 - r$ 千人/平方千米，则人口为 $2\\pi\\int_{0}^{3} (3r - r^{2}) \\, dr = 9\\pi$ 千人。\n\n检验：密度为常数 $c$ 时，$2\\pi\\int_{0}^{R} cr \\, dr = c\\pi R^{2}$，正是密度乘面积。\n\n> **注意。** 要保留因子 $r$：半径为 $r$ 的圆环长 $2\\pi r$。漏掉它，积分就把每个圆环当成一样长。",
      ),
      generate(rng) {
        const R = rng.int(1, 5);
        const c = rng.int(1, 4);
        // Either c(R − r), which falls to 0 at the edge, or a density with non-negative coefficients.
        const rho: Poly = rng.bool() ? [c * R, -c] : positivePoly(rng);
        const ring = pMul([0, 1], rho);
        const half = intQ(ring, 0, R);
        const value = half.mul(Q.of(2));
        const answer = times(value, "\\pi");
        const [at0, atR] = [pAt(rho, 0), pAt(rho, R)];
        const [low, high] = [Math.min(at0, atR), Math.max(at0, atR)];
        return exactWorked(
          t(
            `The population density of a city is $\\rho(r) = ${pLatex(rho, "r")}$ thousand people per square kilometer, where $r$ is the distance in kilometers from the center. Find the population, in thousands, within $${R}$ ${R === 1 ? "kilometer" : "kilometers"} of the center. Give an exact answer.`,
            `某城市的人口密度为 $\\rho(r) = ${pLatex(rho, "r")}$ 千人/平方千米，$r$ 为到市中心的距离（千米）。求距市中心 $${R}$ 千米内的人口（千人），给出精确值。`,
          ),
          answer,
          [
            [
              ["Cut into rings", "切成圆环"],
              t(
                "A ring of radius $r$ and width $dr$ has area $2\\pi r \\, dr$, so:",
                "半径为 $r$、宽为 $dr$ 的圆环面积为 $2\\pi r \\, dr$，所以：",
              ),
              [`P = ${int(0, R, `2\\pi r(${pLatex(rho, "r")})`, "r")} = 2\\pi${int(0, R, `(${pLatex(ring, "r")})`, "r")}`],
            ],
            [
              ["Integrate", "积分"],
              t("Use an antiderivative and multiply by $2\\pi$:", "用原函数，再乘以 $2\\pi$："),
              [
                `${int(0, R, `(${pLatex(ring, "r")})`, "r")} = ${evaluated(ring, 0, R, "r")}`,
                `P = 2\\pi \\cdot ${half.toLatex()} = ${answer}`,
              ],
            ],
          ],
          t(
            `The disk has area $${times(Q.of(R * R), "\\pi")}$, and the density stays between $${low}$ and $${high}$ on it, so the population lies between $${times(Q.of(low * R * R), "\\pi")}$ and $${times(Q.of(high * R * R), "\\pi")}$. The answer $${answer}$ does.`,
            `圆盘面积为 $${times(Q.of(R * R), "\\pi")}$，其上密度介于 $${low}$ 与 $${high}$ 之间，所以人口介于 $${times(Q.of(low * R * R), "\\pi")}$ 与 $${times(Q.of(high * R * R), "\\pi")}$ 之间。答案 $${answer}$ 确实如此。`,
          ),
          [
            {
              response: times(intQ(rho, 0, R).mul(Q.of(2)), "\\pi"),
              why: t(
                "This leaves out the factor $r$: a ring of radius $r$ has length $2\\pi r$, not $2\\pi$.",
                "这里漏掉了因子 $r$：半径为 $r$ 的圆环长 $2\\pi r$，不是 $2\\pi$。",
              ),
            },
            {
              response: half.toLatex(),
              why: t(
                "This is the integral of $r\\rho(r)$ alone; the ring length $2\\pi r$ contributes the factor $2\\pi$.",
                "这只是 $r\\rho(r)$ 的积分；圆环长 $2\\pi r$ 还带来因子 $2\\pi$。",
              ),
            },
            {
              response: times(half, "\\pi"),
              why: t("The circumference of a ring is $2\\pi r$; the factor $2$ is missing.", "圆环的周长是 $2\\pi r$；漏掉了因子 $2$。"),
            },
          ],
        );
      },
    },
  ],
};

/** AverageCase is a transcendental function with its exact average value on an interval, the values it stays between, and typical mistakes. */
interface AverageCase {
  readonly f: string;
  readonly a: string;
  readonly b: string;
  readonly answer: string;
  readonly work: string;
  readonly integral: string;
  readonly length: string;
  readonly approx: number;
  readonly range: readonly [number, number];
  readonly mistakes: readonly Said[];
}

/** theAverageValueOfAFunction computes 1/(b − a) times the integral. */
export const theAverageValueOfAFunction: TopicDef = {
  id: "the-average-value-of-a-function",
  title: t("The Average Value of a Function", "函数的平均值"),
  summary: t("The average value of f on [a, b] is the integral divided by b − a.", "f 在 [a, b] 上的平均值是积分除以 b − a。"),
  intro: t(
    "On $[0, 3]$ the function $x^{2}$ runs from $0$ up to $9$. Its average value is the height of the rectangle on $[0, 3]$ with the same area as the region under the curve:\n\n$$\\frac{1}{3 - 0}\\int_{0}^{3} x^{2} \\, dx = \\frac{1}{3} \\cdot 9 = 3.$$\n\nCheck: the rectangle of height $3$ and width $3$ has area $9$, the same as $\\int_{0}^{3} x^{2} \\, dx$; and $x^{2}$ does take the value $3$, at $x = \\sqrt{3}$ inside the interval.\n\nIn this lesson we find average values of polynomials and of other functions by dividing the integral by the length of the interval.",
    "在 $[0, 3]$ 上，函数 $x^{2}$ 从 $0$ 增加到 $9$。它的平均值是 $[0, 3]$ 上与曲线下方区域面积相等的矩形的高：\n\n$$\\frac{1}{3 - 0}\\int_{0}^{3} x^{2} \\, dx = \\frac{1}{3} \\cdot 9 = 3$$\n\n检验：高 $3$、宽 $3$ 的矩形面积为 $9$，与 $\\int_{0}^{3} x^{2} \\, dx$ 相同；而且 $x^{2}$ 在区间内的 $x = \\sqrt{3}$ 处确实取值 $3$。\n\n本课我们把积分除以区间长度，求多项式和其他函数的平均值。",
  ),
  prerequisites: ["applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions"],
  encompasses: [{ topic: "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "average-values-of-polynomials",
      figure: calculusDrawings4["the-average-value-of-a-function#average-values-of-polynomials"],
      title: t("Average values of polynomials", "多项式的平均值"),
      explanation: t(
        "The average value of $f$ on $[a, b]$ is\n\n$$f_{\\text{avg}} = \\frac{1}{b - a}\\int_{a}^{b} f(x) \\, dx.$$\n\nIt is the height of the rectangle on $[a, b]$ with the same area as the region under $f$. For example, the average of $x^{2}$ on $[0, 3]$ is $\\frac{1}{3} \\cdot 9 = 3$.\n\nCheck: for a polynomial of degree at most $3$, Simpson's rule is exact: the average is $\\frac{f(a) + 4f(m) + f(b)}{6}$ with $m$ the midpoint. For $x^{2}$ on $[0, 3]$ this is $\\frac{0 + 4 \\cdot \\frac{9}{4} + 9}{6} = 3$.\n\n> **Watch out.** Divide by the length $b - a$, not by $b + a$. And the average of the two end values, $\\frac{f(a) + f(b)}{2}$, is the average only for a straight line.",
        "$f$ 在 $[a, b]$ 上的平均值为\n\n$$f_{\\text{avg}} = \\frac{1}{b - a}\\int_{a}^{b} f(x) \\, dx$$\n\n它是 $[a, b]$ 上与 $f$ 下方区域面积相等的矩形的高。例如 $x^{2}$ 在 $[0, 3]$ 上的平均值为 $\\frac{1}{3} \\cdot 9 = 3$。\n\n检验：对次数不超过 $3$ 的多项式，辛普森公式是精确的：平均值等于 $\\frac{f(a) + 4f(m) + f(b)}{6}$，$m$ 为中点。对 $[0, 3]$ 上的 $x^{2}$，它等于 $\\frac{0 + 4 \\cdot \\frac{9}{4} + 9}{6} = 3$。\n\n> **注意。** 要除以长度 $b - a$，不是 $b + a$。两端函数值的平均 $\\frac{f(a) + f(b)}{2}$ 只对直线才是平均值。",
      ),
      generate(rng) {
        const deg = rng.int(1, 3);
        const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-5, 5));
        p[deg] = rng.nonZero(-3, 3);
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 4);
        const I = intQ(p, a, b);
        const answer = I.div(Q.of(b - a));
        const mid = Q.of(a + b, 2);
        const [fa, fm, fb] = [Q.of(pAt(p, a)), pAtQ(p, mid), Q.of(pAt(p, b))];
        return worked(
          t(
            `Find the average value of $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(p)}$ 在 $[${a}, ${b}]$ 上的平均值。`,
          ),
          answer,
          [
            [
              ["Integrate", "积分"],
              t("Integrate over the interval:", "在区间上积分："),
              [`${int(a, b, `(${pLatex(p)})`)} = ${evaluated(p, a, b)}`],
            ],
            [
              ["Divide by the length", "除以区间长度"],
              t(`The length is $${b} - ${inP(a)} = ${b - a}$:`, `区间长度为 $${b} - ${inP(a)} = ${b - a}$：`),
              [`f_{\\text{avg}} = \\frac{${I.toLatex()}}{${b - a}} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Simpson's rule is exact for polynomials of degree at most $3$. With the midpoint $${mid.toLatex()}$: $f(${a}) = ${fa.toLatex()}$, $f(${mid.toLatex()}) = ${fm.toLatex()}$, $f(${b}) = ${fb.toLatex()}$, and $\\frac{${fa.toLatex()} + 4 \\cdot ${inP(fm)} + ${inP(fb)}}{6} = ${answer.toLatex()}$.`,
            `辛普森公式对次数不超过 $3$ 的多项式是精确的。取中点 $${mid.toLatex()}$：$f(${a}) = ${fa.toLatex()}$，$f(${mid.toLatex()}) = ${fm.toLatex()}$，$f(${b}) = ${fb.toLatex()}$，而 $\\frac{${fa.toLatex()} + 4 \\cdot ${inP(fm)} + ${inP(fb)}}{6} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              I,
              `This is the integral; the average divides it by the length $${b - a}$ of the interval.`,
              `这是积分；平均值还要除以区间长度 $${b - a}$。`,
            ),
            slip(
              Q.of(pAt(p, a) + pAt(p, b), 2),
              "This averages only the two end values, which gives the average only for a straight line.",
              "这里只平均了两端的函数值，这只对直线才是平均值。",
            ),
            slip(
              I.div(Q.of(b + a === 0 ? 2 * b : b + a)),
              b + a === 0
                ? `This divides by $2b = ${2 * b}$; the integral must be divided by the length $b - a = ${b - a}$.`
                : `This divides by $a + b = ${a + b}$; the integral must be divided by the length $b - a = ${b - a}$.`,
              b + a === 0
                ? `这里除以了 $2b = ${2 * b}$；积分应除以区间长度 $b - a = ${b - a}$。`
                : `这里除以了 $a + b = ${a + b}$；积分应除以区间长度 $b - a = ${b - a}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "average-values-of-other-functions",
      title: t("Average values of other functions", "其他函数的平均值"),
      explanation: t(
        "The same formula applies to any integrable function. For example, the average of $\\sin x$ on $[0, \\pi]$ is $\\frac{1}{\\pi}\\left[-\\cos x\\right]_{0}^{\\pi} = \\frac{2}{\\pi}$, and the average of $\\frac{1}{x}$ on $[1, e]$ is $\\frac{1}{e - 1}$.\n\nCheck: an average lies between the smallest and largest values of the function. $\\sin x$ runs from $0$ to $1$ on $[0, \\pi]$, and $\\frac{2}{\\pi} \\approx 0.637$.\n\n> **Watch out.** The length of $\\left[0, \\frac{\\pi}{2}\\right]$ is $\\frac{\\pi}{2}$ and that of $[0, \\ln m]$ is $\\ln m$: divide by the length, whatever form it has.",
        "同样的公式适用于任何可积函数。例如 $\\sin x$ 在 $[0, \\pi]$ 上的平均值为 $\\frac{1}{\\pi}\\left[-\\cos x\\right]_{0}^{\\pi} = \\frac{2}{\\pi}$，$\\frac{1}{x}$ 在 $[1, e]$ 上的平均值为 $\\frac{1}{e - 1}$。\n\n检验：平均值介于函数的最小值与最大值之间。在 $[0, \\pi]$ 上 $\\sin x$ 从 $0$ 到 $1$，而 $\\frac{2}{\\pi} \\approx 0.637$。\n\n> **注意。** $\\left[0, \\frac{\\pi}{2}\\right]$ 的长度是 $\\frac{\\pi}{2}$，$[0, \\ln m]$ 的长度是 $\\ln m$：不论长度是什么形式，都要除以它。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(3, 7);
        const kk = coef(Q.of(k));
        const sorted = (u: number, v: number): readonly [number, number] => [Math.min(u, v), Math.max(u, v)];
        const said = (response: string, en: string, zh: string): Said => ({ response, why: t(en, zh) });
        const cases: AverageCase[] = [
          {
            f: `${kk}\\sin x`,
            a: "0",
            b: "\\pi",
            answer: `\\frac{${2 * k}}{\\pi}`,
            work: `${int(0, "\\pi", `${kk}\\sin x`)} = \\Big[${coef(Q.of(-k))}\\cos x\\Big]_{0}^{\\pi} = ${2 * k}`,
            integral: `${2 * k}`,
            length: "\\pi",
            approx: (2 * k) / Math.PI,
            range: sorted(0, k),
            mistakes: [
              said(
                `${2 * k}`,
                "This is the integral; divide it by the length $\\pi$ of the interval.",
                "这是积分；还要除以区间长度 $\\pi$。",
              ),
              said(
                `\\frac{${k}}{\\pi}`,
                "$\\int_{0}^{\\pi} \\sin x \\, dx = 2$, not $1$: $-\\cos \\pi + \\cos 0 = 2$.",
                "$\\int_{0}^{\\pi} \\sin x \\, dx = 2$，不是 $1$：$-\\cos \\pi + \\cos 0 = 2$。",
              ),
              said(
                "0",
                "$-\\cos x$ at $\\pi$ is $1$ and at $0$ is $-1$; their difference is $2$, not $0$.",
                "$-\\cos x$ 在 $\\pi$ 处为 $1$，在 $0$ 处为 $-1$；二者之差是 $2$，不是 $0$。",
              ),
            ],
          },
          {
            f: `${kk}\\cos x`,
            a: "0",
            b: "\\frac{\\pi}{2}",
            answer: `\\frac{${2 * k}}{\\pi}`,
            work: `${int(0, "\\frac{\\pi}{2}", `${kk}\\cos x`)} = \\Big[${kk}\\sin x\\Big]_{0}^{\\pi/2} = ${k}`,
            integral: `${k}`,
            length: "\\frac{\\pi}{2}",
            approx: (2 * k) / Math.PI,
            range: sorted(0, k),
            mistakes: [
              said(
                `${k}`,
                "This is the integral; divide it by the length $\\frac{\\pi}{2}$.",
                "这是积分；还要除以长度 $\\frac{\\pi}{2}$。",
              ),
              said(
                `\\frac{${k}}{\\pi}`,
                "The length of $\\left[0, \\frac{\\pi}{2}\\right]$ is $\\frac{\\pi}{2}$, not $\\pi$.",
                "$\\left[0, \\frac{\\pi}{2}\\right]$ 的长度是 $\\frac{\\pi}{2}$，不是 $\\pi$。",
              ),
              said(
                `\\frac{${k}}{2}`,
                "This divides by $2$; the length is $\\frac{\\pi}{2}$, so dividing by it multiplies by $\\frac{2}{\\pi}$.",
                "这里除以了 $2$；长度是 $\\frac{\\pi}{2}$，除以它等于乘以 $\\frac{2}{\\pi}$。",
              ),
            ],
          },
          {
            f: `${kk}e^{x}`,
            a: "0",
            b: `\\ln ${m}`,
            answer: `\\frac{${k * (m - 1)}}{\\ln ${m}}`,
            work: `${int(0, `\\ln ${m}`, `${kk}e^{x}`)} = ${k}\\left(e^{\\ln ${m}} - e^{0}\\right) = ${k}(${m} - 1) = ${k * (m - 1)}`,
            integral: `${k * (m - 1)}`,
            length: `\\ln ${m}`,
            approx: (k * (m - 1)) / Math.log(m),
            range: sorted(k, k * m),
            mistakes: [
              said(`${k * (m - 1)}`, `This is the integral; divide it by the length $\\ln ${m}$.`, `这是积分；还要除以长度 $\\ln ${m}$。`),
              said(
                `\\frac{${k * m}}{\\ln ${m}}`,
                "The lower limit gives $e^{0} = 1$, which must be subtracted.",
                "下限给出 $e^{0} = 1$，要把它减去。",
              ),
              said(
                `\\frac{${k * (m - 1)}}{${m}}`,
                `The length of the interval is $\\ln ${m}$, not $${m}$.`,
                `区间长度是 $\\ln ${m}$，不是 $${m}$。`,
              ),
            ],
          },
          {
            f: `\\frac{${k}}{x}`.replace("\\frac{-", "-\\frac{"),
            a: "1",
            b: `${m}`,
            answer: `${coef(Q.of(k, m - 1))}\\ln ${m}`,
            work: `${int(1, m, `\\frac{${k}}{x}`.replace("\\frac{-", "-\\frac{"))} = ${kk}\\left(\\ln ${m} - \\ln 1\\right) = ${kk}\\ln ${m}`,
            integral: `${kk}\\ln ${m}`,
            length: `${m} - 1`,
            approx: (k * Math.log(m)) / (m - 1),
            range: sorted(k / m, k),
            mistakes: [
              said(
                `${kk}\\ln ${m}`,
                `This is the integral; divide it by the length $${m} - 1 = ${m - 1}$.`,
                `这是积分；还要除以长度 $${m} - 1 = ${m - 1}$。`,
              ),
              said(
                `${coef(Q.of(k, m))}\\ln ${m}`,
                `The interval starts at $1$, so its length is $${m - 1}$, not $${m}$.`,
                `区间从 $1$ 开始，所以长度是 $${m - 1}$，不是 $${m}$。`,
              ),
              said(
                Q.of(k, m - 1).toLatex(),
                `$\\int \\frac{1}{x} \\, dx = \\ln x$; the factor $\\ln ${m}$ is missing.`,
                `$\\int \\frac{1}{x} \\, dx = \\ln x$；漏掉了因子 $\\ln ${m}$。`,
              ),
            ],
          },
        ];
        const c = rng.pick(cases);
        return exactWorked(
          t(
            `Find the average value of $${c.f}$ on $\\left[${c.a}, ${c.b}\\right]$. Give an exact answer.`,
            `求 $${c.f}$ 在 $\\left[${c.a}, ${c.b}\\right]$ 上的平均值，给出精确值。`,
          ),
          c.answer,
          [
            [["Integrate", "积分"], t("Use an antiderivative:", "用原函数："), [c.work]],
            [
              ["Divide by the length", "除以区间长度"],
              t(`The length of the interval is $${c.length}$:`, `区间长度为 $${c.length}$：`),
              [`f_{\\text{avg}} = \\frac{${c.integral}}{${c.length}} = ${c.answer}`],
            ],
          ],
          t(
            `The average must lie between the smallest and largest values of the function on the interval, $${around(c.range[0])}$ and $${around(c.range[1])}$. Indeed $${c.answer} \\approx ${around(c.approx)}$.`,
            `平均值必须介于函数在区间上的最小值与最大值之间，即 $${around(c.range[0])}$ 与 $${around(c.range[1])}$ 之间。确实 $${c.answer} \\approx ${around(c.approx)}$。`,
          ),
          c.mistakes,
        );
      },
    },
  ],
};

/** downward returns c(x − r1)(r2 − x), which is positive between the roots. */
const downward = (c: number, r1: number, r2: number): Poly => pScale(pMul([-r1, 1], [r2, -1]), c);

/** lowerCurve chooses a polynomial of degree at most 2 for the lower boundary. */
const lowerCurve = (rng: Rng): Poly => [rng.int(-5, 5), rng.int(-4, 4), rng.int(-1, 1)];

/** twoCurves orders two curve equations randomly for display. */
function twoCurves(rng: Rng, f: string, g: string): readonly [string, string] {
  return rng.bool() ? [f, g] : [g, f];
}

/** factored writes c(v − r1)(r2 − v). */
const factored = (c: number, r1: number, r2: number, v = "x") =>
  `${c === 1 ? "" : c}${r1 === 0 ? v : `(${pLatex([-r1, 1], v)})`}(${r2} - ${v})`;

/** enclosedProblem asks for the area enclosed by two curves whose difference is c(v − r1)(r2 − v), in x or in y. */
function enclosedProblem(rng: Rng, v: "x" | "y"): Problem {
  const r1 = rng.int(-4, 2);
  const r2 = r1 + rng.int(1, 4);
  const c = rng.int(1, 3);
  const g = lowerCurve(rng);
  const d = downward(c, r1, r2);
  const f = pSum(g, d);
  const w = r2 - r1;
  const answer = Q.of(c * w ** 3, 6);
  const u = v === "x" ? "y" : "x";
  const [fl, gl] = [pLatex(f, v), pLatex(g, v)];
  const [first, second] = twoCurves(rng, `${u} = ${fl}`, `${u} = ${gl}`);
  const side = v === "x" ? ["on top", "在上方"] : ["on the right", "在右侧"];
  const peak = Q.of(c * w * w, 4);
  return worked(
    t(`Find the area of the region enclosed by $${first}$ and $${second}$.`, `求 $${first}$ 与 $${second}$ 围成的区域面积。`),
    answer,
    [
      [
        ["Subtract and find the crossings", "相减并求交点"],
        t(
          `Subtract the curves and factor; the difference is zero at $${v} = ${r1}$ and $${v} = ${r2}$ and positive between, so $${u} = ${fl}$ is ${side[0]}:`,
          `两曲线相减并因式分解；差在 $${v} = ${r1}$ 和 $${v} = ${r2}$ 处为零，其间为正，所以 $${u} = ${fl}$ ${side[1]}：`,
        ),
        [`(${fl}) - (${gl}) = ${pLatex(d, v)} = ${factored(c, r1, r2, v)}`],
      ],
      [
        ["Integrate between the crossings", "在交点之间积分"],
        t("Use an antiderivative:", "用原函数："),
        [`${int(r1, r2, `(${pLatex(d, v)})`, v)} = ${evaluated(d, r1, r2, v)}`],
      ],
    ],
    t(
      `Use Archimedes' rule: the region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it. Here the width is $${w}$ and the greatest gap, at the middle, is $${c === 1 ? "" : c}\\left(\\frac{${w}}{2}\\right)^{2} = ${peak.toLatex()}$, so the area is $\\frac{2}{3} \\cdot ${w} \\cdot ${peak.toLatex()} = ${answer.toLatex()}$.`,
      `用阿基米德的结论：抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$。这里宽为 $${w}$，最大的间距在中点，为 $${c === 1 ? "" : c}\\left(\\frac{${w}}{2}\\right)^{2} = ${peak.toLatex()}$，所以面积为 $\\frac{2}{3} \\cdot ${w} \\cdot ${peak.toLatex()} = ${answer.toLatex()}$。`,
    ),
    [
      slip(
        intQ(f, r1, r2),
        `This integrates only the curve $${u} = ${fl}$; the other curve must be subtracted from it.`,
        `这里只对曲线 $${u} = ${fl}$ 积分；还要减去另一条曲线。`,
      ),
      slip(answer.neg(), "This subtracts the curves the wrong way round; an area is never negative.", "这里两曲线减反了；面积不会是负的。"),
      slip(
        peak.mul(Q.of(w)),
        `This is the whole rectangle, width $${w}$ times the greatest gap $${peak.toLatex()}$; the region fills only $\\frac{2}{3}$ of it.`,
        `这是整个矩形，宽 $${w}$ 乘以最大间距 $${peak.toLatex()}$；区域只占它的 $\\frac{2}{3}$。`,
      ),
    ],
  );
}

/** theAreaBetweenCurvesExpressedAsFunctionsOfX integrates top minus bottom. */
export const theAreaBetweenCurvesExpressedAsFunctionsOfX: TopicDef = {
  id: "the-area-between-curves-expressed-as-functions-of-x",
  title: t("The Area Between Curves Expressed as Functions of X", "以 x 的函数表示的曲线之间的面积"),
  summary: t("Integrate the upper curve minus the lower curve between their intersections.", "在交点之间对上方曲线减下方曲线积分。"),
  intro: t(
    "The line $y = x$ and the parabola $y = x^{2}$ meet where $x = x^{2}$, at $x = 0$ and $x = 1$. Between them the line is on top, since $\\frac{1}{2} > \\frac{1}{4}$ at $x = \\frac{1}{2}$. Each thin vertical strip has height top minus bottom, so\n\n$$\\text{Area} = \\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}.$$\n\nCheck: under the line lies a triangle of area $\\frac{1}{2}$, and under the parabola an area of $\\int_{0}^{1} x^{2} \\, dx = \\frac{1}{3}$; the region between is what is left, $\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$.\n\nIn this lesson we find the area between two curves by integrating the upper curve minus the lower one, between their crossings or between given vertical lines.",
    "直线 $y = x$ 与抛物线 $y = x^{2}$ 在 $x = x^{2}$ 处相交，即 $x = 0$ 和 $x = 1$。其间直线在上方，因为在 $x = \\frac{1}{2}$ 处 $\\frac{1}{2} > \\frac{1}{4}$。每个竖直细条的高是上减下，所以\n\n$$\\text{面积} = \\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$$\n\n检验：直线下方是面积为 $\\frac{1}{2}$ 的三角形，抛物线下方面积为 $\\int_{0}^{1} x^{2} \\, dx = \\frac{1}{3}$；两者之间的区域就是剩下的部分，$\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$。\n\n本课我们对上方曲线减下方曲线积分，求两曲线之间的面积，积分限是交点或给定的竖直线。",
  ),
  prerequisites: ["the-area-bounded-by-a-curve-and-the-x-axis"],
  encompasses: [{ topic: "the-area-bounded-by-a-curve-and-the-x-axis", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-enclosed-by-two-curves",
      title: t("Areas enclosed by two curves", "两条曲线围成的面积"),
      explanation: t(
        "If $f(x) \\ge g(x)$ on $[a, b]$, the area between the curves is\n\n$$\\int_{a}^{b} \\left(f(x) - g(x)\\right) dx.$$\n\nFor a region enclosed by two curves, the limits are the $x$-coordinates of the intersection points, found by solving $f(x) = g(x)$. For example, $y = x$ and $y = x^{2}$ meet at $x = 0$ and $x = 1$, with $x \\ge x^{2}$ between, so the area is $\\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{6}$.\n\nCheck: the triangle under the line has area $\\frac{1}{2}$ and the region under the parabola $\\frac{1}{3}$, and $\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$.\n\n> **Watch out.** Subtract the lower curve from the upper one; the other order gives a negative number. And integrating the upper curve alone counts the area down to the $x$-axis, not to the other curve.",
        "若在 $[a, b]$ 上 $f(x) \\ge g(x)$，两曲线之间的面积为\n\n$$\\int_{a}^{b} \\left(f(x) - g(x)\\right) dx$$\n\n对两曲线围成的区域，积分限是交点的 $x$ 坐标，由 $f(x) = g(x)$ 解出。例如 $y = x$ 与 $y = x^{2}$ 交于 $x = 0$ 和 $x = 1$，其间 $x \\ge x^{2}$，所以面积为 $\\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{6}$。\n\n检验：直线下方三角形面积为 $\\frac{1}{2}$，抛物线下方面积为 $\\frac{1}{3}$，而 $\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$。\n\n> **注意。** 要用上方曲线减下方曲线；反过来会得到负数。只对上方曲线积分，算的是到 $x$ 轴的面积，而不是到另一条曲线的面积。",
      ),
      generate(rng) {
        return enclosedProblem(rng, "x");
      },
    },
    {
      id: "areas-between-curves-over-an-interval",
      title: t("Areas between curves over an interval", "区间上两曲线之间的面积"),
      explanation: t(
        "When the region is bounded by vertical lines $x = a$ and $x = b$, those are the limits. First decide which curve is on top. For example, $x^{2} + 1 > x$ for every $x$, so the area between $y = x^{2} + 1$ and $y = x$ from $x = 0$ to $x = 3$ is $\\int_{0}^{3} (x^{2} - x + 1) \\, dx = \\frac{15}{2}$.\n\nCheck: integrate the curves one at a time: $\\int_{0}^{3} (x^{2} + 1) \\, dx = 12$ and $\\int_{0}^{3} x \\, dx = \\frac{9}{2}$, and $12 - \\frac{9}{2} = \\frac{15}{2}$.\n\n> **Watch out.** Make sure the upper curve stays on top over the whole interval. Completing the square shows it: $x^{2} - x + 1 = \\left(x - \\frac{1}{2}\\right)^{2} + \\frac{3}{4} > 0$.",
        "当区域由竖直线 $x = a$ 与 $x = b$ 围住时，它们就是积分限。先判断哪条曲线在上方。例如对所有 $x$ 都有 $x^{2} + 1 > x$，所以从 $x = 0$ 到 $x = 3$ 之间 $y = x^{2} + 1$ 与 $y = x$ 之间的面积为 $\\int_{0}^{3} (x^{2} - x + 1) \\, dx = \\frac{15}{2}$。\n\n检验：对两条曲线分别积分：$\\int_{0}^{3} (x^{2} + 1) \\, dx = 12$，$\\int_{0}^{3} x \\, dx = \\frac{9}{2}$，而 $12 - \\frac{9}{2} = \\frac{15}{2}$。\n\n> **注意。** 要确认上方曲线在整个区间上都在上方。配方可以看出：$x^{2} - x + 1 = \\left(x - \\frac{1}{2}\\right)^{2} + \\frac{3}{4} > 0$。",
      ),
      generate(rng) {
        const h = rng.int(-3, 3);
        const m = rng.int(1, 4);
        const g: Poly = [rng.int(-5, 5), rng.int(-3, 3)];
        const d: Poly = [h * h + m, -2 * h, 1];
        const f = pSum(g, d);
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 3);
        const answer = intQ(d, a, b);
        const [fl, gl] = [pLatex(f), pLatex(g)];
        const [first, second] = twoCurves(rng, `y = ${fl}`, `y = ${gl}`);
        const square = h === 0 ? "" : ` = ${fac(h)}^{2} + ${m}`.replace("(x)^{2}", "x^{2}");
        const [If, Ig] = [intQ(f, a, b), intQ(g, a, b)];
        return worked(
          t(
            `Find the area of the region between $${first}$ and $${second}$ from $x = ${a}$ to $x = ${b}$.`,
            `求从 $x = ${a}$ 到 $x = ${b}$ 之间 $${first}$ 与 $${second}$ 之间的区域面积。`,
          ),
          answer,
          [
            [
              ["Find the upper curve", "找出上方曲线"],
              t(`The difference is always positive, so $y = ${fl}$ is on top:`, `两者之差恒为正，所以 $y = ${fl}$ 在上方：`),
              [`(${fl}) - (${gl}) = ${pLatex(d)}${square} > 0`],
            ],
            [
              ["Integrate over the interval", "在区间上积分"],
              t("Use an antiderivative:", "用原函数："),
              [`${int(a, b, `(${pLatex(d)})`)} = ${evaluated(d, a, b)}`],
            ],
          ],
          t(
            `Integrate the curves one at a time: $${int(a, b, `(${fl})`)} = ${If.toLatex()}$ and $${int(a, b, `(${gl})`)} = ${Ig.toLatex()}$, and $${If.toLatex()} - ${inP(Ig)} = ${answer.toLatex()}$.`,
            `对两条曲线分别积分：$${int(a, b, `(${fl})`)} = ${If.toLatex()}$，$${int(a, b, `(${gl})`)} = ${Ig.toLatex()}$，而 $${If.toLatex()} - ${inP(Ig)} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              If,
              `This integrates only the upper curve; the lower curve $y = ${gl}$ must be subtracted.`,
              `这里只对上方曲线积分；还要减去下方曲线 $y = ${gl}$。`,
            ),
            slip(
              Ig,
              `This integrates only the lower curve; the area is the upper curve minus the lower one.`,
              `这里只对下方曲线积分；面积是上方曲线减下方曲线。`,
            ),
            slip(
              answer.neg(),
              "This is the lower curve minus the upper one; an area is never negative.",
              "这是下方曲线减上方曲线；面积不会是负的。",
            ),
          ],
        );
      },
    },
  ],
};

/** theAreaBetweenCurvesExpressedAsFunctionsOfY integrates right minus left with respect to y. */
export const theAreaBetweenCurvesExpressedAsFunctionsOfY: TopicDef = {
  id: "the-area-between-curves-expressed-as-functions-of-y",
  title: t("The Area Between Curves Expressed as Functions of Y", "以 y 的函数表示的曲线之间的面积"),
  summary: t("Integrate the right curve minus the left curve with respect to y.", "对 y 积分，被积函数为右侧曲线减左侧曲线。"),
  intro: t(
    "The parabola $x = y^{2}$ and the line $x = y + 2$ meet where $y^{2} = y + 2$, at $y = -1$ and $y = 2$. Slicing horizontally, each thin strip runs from the parabola on the left to the line on the right, so\n\n$$\\text{Area} = \\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\Big[\\frac{y^{2}}{2} + 2y - \\frac{y^{3}}{3}\\Big]_{-1}^{2} = \\frac{9}{2}.$$\n\nCheck: the region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it. The height is $3$ and the widest gap, at $y = \\frac{1}{2}$, is $\\frac{9}{4}$, and $\\frac{2}{3} \\cdot 3 \\cdot \\frac{9}{4} = \\frac{9}{2}$.\n\nIn this lesson we integrate with respect to $y$, the right curve minus the left, and choose this when it makes a region simpler.",
    "抛物线 $x = y^{2}$ 与直线 $x = y + 2$ 在 $y^{2} = y + 2$ 处相交，即 $y = -1$ 和 $y = 2$。横向切片时，每个细条从左边的抛物线延伸到右边的直线，所以\n\n$$\\text{面积} = \\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\Big[\\frac{y^{2}}{2} + 2y - \\frac{y^{3}}{3}\\Big]_{-1}^{2} = \\frac{9}{2}$$\n\n检验：抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$。这里高为 $3$，最宽处在 $y = \\frac{1}{2}$，宽 $\\frac{9}{4}$，而 $\\frac{2}{3} \\cdot 3 \\cdot \\frac{9}{4} = \\frac{9}{2}$。\n\n本课我们对 $y$ 积分，被积函数是右侧曲线减左侧曲线，并在这样能让区域更简单时选择它。",
  ),
  prerequisites: ["the-area-between-curves-expressed-as-functions-of-x", "the-area-bounded-by-a-curve-and-the-y-axis"],
  encompasses: [
    { topic: "the-area-between-curves-expressed-as-functions-of-x", weight: 0.5 },
    { topic: "the-area-bounded-by-a-curve-and-the-y-axis", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-between-curves-of-the-form-x-equals-f-of-y",
      title: t("Areas between curves of the form x = f(y)", "形如 x = f(y) 的曲线之间的面积"),
      explanation: t(
        "When curves are given as $x = f(y)$ and $x = g(y)$ with $f(y) \\ge g(y)$ for $c \\le y \\le d$, slice horizontally:\n\n$$\\text{Area} = \\int_{c}^{d} \\left(f(y) - g(y)\\right) dy,$$\n\nthe right curve minus the left curve. For example, $x = y^{2}$ and $x = y + 2$ meet at $y = -1$ and $y = 2$, so the area is $\\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\frac{9}{2}$.\n\nCheck: the region fills $\\frac{2}{3}$ of its bounding rectangle, of height $3$ and greatest width $\\frac{9}{4}$: $\\frac{2}{3} \\cdot 3 \\cdot \\frac{9}{4} = \\frac{9}{2}$.\n\n> **Watch out.** With respect to $y$ the integrand is right minus left, not top minus bottom, and the limits are $y$-values.",
        "当曲线写成 $x = f(y)$ 与 $x = g(y)$，且在 $c \\le y \\le d$ 上 $f(y) \\ge g(y)$ 时，横向切片：\n\n$$\\text{面积} = \\int_{c}^{d} \\left(f(y) - g(y)\\right) dy$$\n\n即右侧曲线减左侧曲线。例如 $x = y^{2}$ 与 $x = y + 2$ 交于 $y = -1$ 和 $y = 2$，所以面积为 $\\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\frac{9}{2}$。\n\n检验：区域占外接矩形的 $\\frac{2}{3}$，矩形高 $3$，最大宽度 $\\frac{9}{4}$：$\\frac{2}{3} \\cdot 3 \\cdot \\frac{9}{4} = \\frac{9}{2}$。\n\n> **注意。** 对 $y$ 积分时被积函数是右减左，不是上减下，积分限是 $y$ 的值。",
      ),
      generate(rng) {
        return enclosedProblem(rng, "y");
      },
    },
    {
      id: "choosing-to-integrate-with-respect-to-y",
      figure: calculusDrawings4["the-area-between-curves-expressed-as-functions-of-y#choosing-to-integrate-with-respect-to-y"],
      title: t("Choosing to integrate with respect to y", "选择对 y 积分"),
      explanation: t(
        "Some regions are much simpler to slice horizontally. The region bounded by the parabola $x = y^{2}$ and the line $x = 4$ would need two square-root curves $y = \\pm\\sqrt{x}$ in terms of $x$, but in terms of $y$ it runs from $y = -2$ to $y = 2$ between $x = y^{2}$ and $x = 4$:\n\n$$\\int_{-2}^{2} (4 - y^{2}) \\, dy = \\frac{32}{3}.$$\n\nCheck: in terms of $x$, the region is $2\\int_{0}^{4} \\sqrt{x} \\, dx = 2 \\cdot \\frac{2}{3} \\cdot 8 = \\frac{32}{3}$, the same.\n\n> **Watch out.** The region reaches from $y = -2$ up to $y = 2$; integrating from $0$ to $2$ finds only its upper half.",
        "有些区域横向切片要简单得多。由抛物线 $x = y^{2}$ 与直线 $x = 4$ 围成的区域，若对 $x$ 积分需要两条曲线 $y = \\pm\\sqrt{x}$，而对 $y$ 积分时，它从 $y = -2$ 到 $y = 2$，位于 $x = y^{2}$ 与 $x = 4$ 之间：\n\n$$\\int_{-2}^{2} (4 - y^{2}) \\, dy = \\frac{32}{3}$$\n\n检验：对 $x$ 积分，区域面积为 $2\\int_{0}^{4} \\sqrt{x} \\, dx = 2 \\cdot \\frac{2}{3} \\cdot 8 = \\frac{32}{3}$，结果相同。\n\n> **注意。** 区域从 $y = -2$ 一直到 $y = 2$；只从 $0$ 积到 $2$ 求出的只是上半部分。",
      ),
      generate(rng) {
        const c = rng.int(1, 4);
        const n = rng.int(1, 4);
        const s = rng.int(-4, 4);
        const b = c * n * n + s;
        const answer = Q.of(4 * c * n ** 3, 3);
        const curve = pLatex([s, 0, c], "y");
        const gap: Poly = [b - s, 0, -c];
        const box = 2 * c * n ** 3;
        return worked(
          t(
            `Find the area of the region bounded by $x = ${curve}$ and the line $x = ${b}$.`,
            `求由 $x = ${curve}$ 与直线 $x = ${b}$ 围成的区域面积。`,
          ),
          answer,
          [
            [
              ["Find the limits in y", "求 y 的积分限"],
              t("The curves meet where:", "两曲线的交点满足："),
              [`${curve} = ${b} \\implies y^{2} = ${n * n} \\implies y = \\pm ${n}`],
            ],
            [
              ["Integrate right minus left", "对右减左积分"],
              t(`The line $x = ${b}$ is on the right:`, `直线 $x = ${b}$ 在右侧：`),
              [
                `${int(-n, n, `\\left(${b} - (${curve})\\right)`, "y")} = ${int(-n, n, `(${pLatex(gap, "y")})`, "y")} = ${evaluated(gap, -n, n, "y")}`,
              ],
            ],
          ],
          t(
            `The region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it. That rectangle has height $${2 * n}$ and width $${b} - ${inP(s)} = ${c * n * n}$, so the area is $\\frac{2}{3} \\cdot ${2 * n} \\cdot ${c * n * n} = ${answer.toLatex()}$.`,
            `抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$。这个矩形高 $${2 * n}$，宽 $${b} - ${inP(s)} = ${c * n * n}$，所以面积为 $\\frac{2}{3} \\cdot ${2 * n} \\cdot ${c * n * n} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              answer.div(Q.of(2)),
              `This integrates from $y = 0$ to $y = ${n}$, the upper half only; the region also reaches down to $y = -${n}$.`,
              `这是从 $y = 0$ 积到 $y = ${n}$，只是上半部分；区域还向下延伸到 $y = -${n}$。`,
            ),
            slip(
              2 * b * n,
              `This integrates only the line $x = ${b}$; the parabola on the left must be subtracted.`,
              `这里只对直线 $x = ${b}$ 积分；还要减去左侧的抛物线。`,
            ),
            slip(
              box,
              `This is the whole rectangle of height $${2 * n}$ and width $${c * n * n}$; the region fills only $\\frac{2}{3}$ of it.`,
              `这是高 $${2 * n}$、宽 $${c * n * n}$ 的整个矩形；区域只占它的 $\\frac{2}{3}$。`,
            ),
            slip(
              Q.of(2 * b * n).sub(Q.of(2 * c * n ** 3, 3)),
              `The parabola is $x = ${curve}$; its constant $${s}$ was left out of the difference.`,
              `抛物线是 $x = ${curve}$；相减时漏掉了它的常数项 $${s}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** threeRoots chooses three increasing integer roots. */
function threeRoots(rng: Rng): readonly [number, number, number] {
  const r1 = rng.int(-3, 0);
  const r2 = r1 + rng.int(1, 2);
  return [r1, r2, r2 + rng.int(1, 2)];
}

/** findingAreasBetweenCurvesThatIntersectAtMoreThanTwoPoints splits the area at each crossing. */
export const findingAreasBetweenCurvesThatIntersectAtMoreThanTwoPoints: TopicDef = {
  id: "finding-areas-between-curves-that-intersect-at-more-than-two-points",
  title: t("Finding Areas Between Curves That Intersect at More Than Two Points", "求相交于两点以上的曲线之间的面积"),
  summary: t("Split the region at each intersection and add the areas of the pieces.", "在每个交点处把区域拆开，再把各部分面积相加。"),
  intro: t(
    "The curves $y = x^{3}$ and $y = x$ cross three times, where $x^{3} = x$: at $x = -1$, $0$ and $1$. On $[-1, 0]$ the cubic is on top, and on $[0, 1]$ the line is. Integrating $x^{3} - x$ straight from $-1$ to $1$ gives $0$, because the two pieces cancel. Split at the crossings instead:\n\n$$\\int_{-1}^{0} (x^{3} - x) \\, dx + \\int_{0}^{1} (x - x^{3}) \\, dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}.$$\n\nCheck: both curves are symmetric through the origin, so the two regions are congruent, and the area is $2\\int_{0}^{1} (x - x^{3}) \\, dx = 2 \\cdot \\frac{1}{4} = \\frac{1}{2}$.\n\nIn this lesson we split a region at every crossing, add the areas of the pieces, and use symmetry when the pieces match.",
    "曲线 $y = x^{3}$ 与 $y = x$ 相交三次，交点满足 $x^{3} = x$：$x = -1$、$0$、$1$。在 $[-1, 0]$ 上三次曲线在上方，在 $[0, 1]$ 上直线在上方。若直接从 $-1$ 到 $1$ 对 $x^{3} - x$ 积分，结果是 $0$，因为两部分相互抵消。应在交点处拆开：\n\n$$\\int_{-1}^{0} (x^{3} - x) \\, dx + \\int_{0}^{1} (x - x^{3}) \\, dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$$\n\n检验：两条曲线都关于原点对称，所以两块区域全等，面积为 $2\\int_{0}^{1} (x - x^{3}) \\, dx = 2 \\cdot \\frac{1}{4} = \\frac{1}{2}$。\n\n本课我们在每个交点处拆开区域，把各部分面积相加，并在各部分相同时利用对称性。",
  ),
  prerequisites: [
    "the-area-between-curves-expressed-as-functions-of-x",
    "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
  ],
  encompasses: [
    { topic: "the-area-between-curves-expressed-as-functions-of-x", weight: 0.5 },
    { topic: "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-between-a-cubic-and-a-line",
      title: t("Areas between a cubic and a line", "三次曲线与直线之间的面积"),
      explanation: t(
        "When the curves cross more than twice, which curve is on top changes at each crossing. Integrate $|f(x) - g(x)|$ by splitting at the intersections:\n\n$$\\text{Area} = \\left|\\int_{r_{1}}^{r_{2}} (f - g) \\, dx\\right| + \\left|\\int_{r_{2}}^{r_{3}} (f - g) \\, dx\\right|.$$\n\nFor example, $y = x^{3}$ and $y = x$ cross at $-1$, $0$ and $1$, and the pieces give $\\frac{1}{4}$ and $-\\frac{1}{4}$, so the area is $\\frac{1}{2}$.\n\nCheck: the two signed pieces must add up to the integral straight across, $\\int_{-1}^{1} (x^{3} - x) \\, dx = 0 = \\frac{1}{4} - \\frac{1}{4}$.\n\n> **Watch out.** Integrating $f - g$ straight from $r_{1}$ to $r_{3}$ lets the pieces cancel. Take the absolute value of each piece before adding.",
        "当曲线相交两次以上时，在每个交点处上下位置都会改变。在交点处拆开，对 $|f(x) - g(x)|$ 积分：\n\n$$\\text{面积} = \\left|\\int_{r_{1}}^{r_{2}} (f - g) \\, dx\\right| + \\left|\\int_{r_{2}}^{r_{3}} (f - g) \\, dx\\right|$$\n\n例如 $y = x^{3}$ 与 $y = x$ 交于 $-1$、$0$、$1$，两部分分别给出 $\\frac{1}{4}$ 和 $-\\frac{1}{4}$，所以面积为 $\\frac{1}{2}$。\n\n检验：两个带符号的部分之和必须等于直接积分的结果，$\\int_{-1}^{1} (x^{3} - x) \\, dx = 0 = \\frac{1}{4} - \\frac{1}{4}$。\n\n> **注意。** 若直接从 $r_{1}$ 到 $r_{3}$ 对 $f - g$ 积分，各部分会相互抵消。要先取每部分的绝对值再相加。",
      ),
      generate(rng) {
        const [r1, r2, r3] = threeRoots(rng);
        const k = rng.pick([1, -1, 2]);
        const d = pScale(pMul(pMul([-r1, 1], [-r2, 1]), [-r3, 1]), k);
        const g: Poly = [rng.int(-4, 4), rng.int(-3, 3)];
        const f = pSum(g, d);
        const [i1, i2] = [intQ(d, r1, r2), intQ(d, r2, r3)];
        const answer = i1.abs().add(i2.abs());
        const noQuarter = d.map((x, i) => (i === 3 ? 4 * x : x));
        const whole = intQ(d, r1, r3);
        const [fl, gl] = [pLatex(f), pLatex(g)];
        const [first, second] = twoCurves(rng, `y = ${fl}`, `y = ${gl}`);
        return worked(
          t(
            `Find the total area of the regions enclosed by $${first}$ and $${second}$.`,
            `求 $${first}$ 与 $${second}$ 围成的各区域的总面积。`,
          ),
          answer,
          [
            [
              ["Find the crossings", "求交点"],
              t(
                `Subtract the curves; the difference is zero at $x = ${r1}$, $${r2}$ and $${r3}$:`,
                `两曲线相减；差在 $x = ${r1}$、$${r2}$、$${r3}$ 处为零：`,
              ),
              [`(${fl}) - (${gl}) = ${pLatex(d)}`],
            ],
            [
              ["Integrate each piece", "逐段积分"],
              t("Integrate between consecutive crossings:", "在相邻交点之间积分："),
              [`${int(r1, r2, `(${pLatex(d)})`)} = ${i1.toLatex()}`, `${int(r2, r3, `(${pLatex(d)})`)} = ${i2.toLatex()}`],
            ],
            [
              ["Add the sizes", "把大小相加"],
              t("Each piece counts as a positive area:", "每部分都按正的面积计入："),
              [`${i1.abs().toLatex()} + ${i2.abs().toLatex()} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `The signed pieces must add up to the integral straight across: $${int(r1, r3, `(${pLatex(d)})`)} = ${whole.toLatex()}$, and $${i1.toLatex()} + ${inP(i2)} = ${whole.toLatex()}$. Their sizes add to $${answer.toLatex()}$.`,
            `带符号的两部分之和必须等于直接积分的结果：$${int(r1, r3, `(${pLatex(d)})`)} = ${whole.toLatex()}$，而 $${i1.toLatex()} + ${inP(i2)} = ${whole.toLatex()}$。它们的大小之和为 $${answer.toLatex()}$。`,
          ),
          [
            slip(
              whole.abs(),
              `This integrates straight from $${r1}$ to $${r3}$, so the piece below cancels part of the piece above; split at $x = ${r2}$.`,
              `这是直接从 $${r1}$ 积到 $${r3}$，下方的部分抵消了上方的一部分；要在 $x = ${r2}$ 处拆开。`,
            ),
            slip(
              whole,
              `This is the signed integral from $${r1}$ to $${r3}$, in which the two pieces cancel in part; add their sizes instead.`,
              `这是从 $${r1}$ 到 $${r3}$ 的带符号积分，两部分部分抵消；应把它们的大小相加。`,
            ),
            slip(
              i1.abs().mul(Q.of(2)),
              "This doubles the first piece, as if the two regions were equal; they are not symmetric here, so integrate each.",
              "这是把第一部分加倍，好像两块区域相等；这里它们不对称，要分别积分。",
            ),
            slip(
              i1.abs(),
              `This is only the region from $x = ${r1}$ to $x = ${r2}$; the region from $x = ${r2}$ to $x = ${r3}$ must be added.`,
              `这只是从 $x = ${r1}$ 到 $x = ${r2}$ 的区域；还要加上从 $x = ${r2}$ 到 $x = ${r3}$ 的区域。`,
            ),
            slip(
              intQ(noQuarter, r1, r2)
                .abs()
                .add(intQ(noQuarter, r2, r3).abs()),
              "$\\int x^{3} \\, dx = \\frac{x^{4}}{4}$; the division by $4$ is missing.",
              "$\\int x^{3} \\, dx = \\frac{x^{4}}{4}$；漏掉了除以 $4$。",
            ),
          ],
        );
      },
    },
    {
      id: "using-symmetry-for-areas-between-curves",
      title: t("Using symmetry for areas between curves", "利用对称性求曲线之间的面积"),
      explanation: t(
        "Look for symmetry to save work. $y = x^{3}$ and $y = 4x$ meet at $x = -2, 0, 2$; the two regions are mirror images through the origin, so the area is\n\n$$2\\int_{0}^{2} (4x - x^{3}) \\, dx = 2 \\cdot 4 = 8.$$\n\nLikewise $y = x^{4}$ and $y = m^{2}x^{2}$ enclose two regions that mirror each other across the $y$-axis.\n\nCheck: on $[-2, 0]$ the cubic is on top, and $\\int_{-2}^{0} (x^{3} - 4x) \\, dx = 4$, the same as the right-hand piece.\n\n> **Watch out.** For the odd pair, $\\int_{-2}^{2} (4x - x^{3}) \\, dx = 0$: the two pieces cancel. Double the area of one piece instead.",
        "利用对称性可以减少计算。$y = x^{3}$ 与 $y = 4x$ 交于 $x = -2, 0, 2$；两块区域关于原点对称，所以面积为\n\n$$2\\int_{0}^{2} (4x - x^{3}) \\, dx = 2 \\cdot 4 = 8$$\n\n同样，$y = x^{4}$ 与 $y = m^{2}x^{2}$ 围成的两块区域关于 $y$ 轴对称。\n\n检验：在 $[-2, 0]$ 上三次曲线在上方，$\\int_{-2}^{0} (x^{3} - 4x) \\, dx = 4$，与右边一块相同。\n\n> **注意。** 对奇函数这一对，$\\int_{-2}^{2} (4x - x^{3}) \\, dx = 0$：两部分抵消了。应把其中一块的面积加倍。",
      ),
      generate(rng) {
        const c = rng.int(1, 4);
        const m = rng.int(1, 4);
        const s = rng.int(-3, 3);
        const cubic = rng.bool();
        const f: Poly = cubic ? [s, 0, 0, c] : [s, 0, 0, 0, c];
        const g: Poly = cubic ? [s, c * m * m] : [s, 0, c * m * m];
        const answer = cubic ? Q.of(c * m ** 4, 2) : Q.of(4 * c * m ** 5, 15);
        const half = answer.div(Q.of(2));
        const inner: Poly = cubic ? [0, c * m * m, 0, -c] : [0, 0, c * m * m, 0, -c];
        const left: Poly = cubic ? pScale(inner, -1) : inner;
        const [first, second] = twoCurves(rng, `y = ${pLatex(f)}`, `y = ${pLatex(g)}`);
        const meet = cubic
          ? `${c === 1 ? "" : c}x^{3} = ${c * m * m}x \\implies x = -${m}, 0, ${m}`
          : `${c === 1 ? "" : c}x^{4} = ${c * m * m}x^{2} \\implies x = -${m}, 0, ${m}`;
        return worked(
          t(
            `Find the total area of the regions enclosed by $${first}$ and $${second}$.`,
            `求 $${first}$ 与 $${second}$ 围成的各区域的总面积。`,
          ),
          answer,
          [
            [
              ["Find the crossings", "求交点"],
              s === 0
                ? t("Set the curves equal:", "令两曲线相等：")
                : t(`Set the curves equal; the constant $${s}$ cancels:`, `令两曲线相等；常数 $${s}$ 相互抵消：`),
              [meet],
            ],
            [
              ["Integrate one piece", "求一块的面积"],
              t(`On $[0, ${m}]$ the curve $y = ${pLatex(g)}$ is on top:`, `在 $[0, ${m}]$ 上曲线 $y = ${pLatex(g)}$ 在上方：`),
              [`${int(0, m, `(${pLatex(inner)})`)} = ${evaluated(inner, 0, m)}`],
            ],
            [
              ["Use symmetry", "利用对称性"],
              t(
                cubic ? "The other piece is its image through the origin:" : "The other piece is its mirror image across the $y$-axis:",
                cubic ? "另一块是它关于原点的对称图形：" : "另一块是它关于 $y$ 轴的镜像：",
              ),
              [`2 \\cdot ${half.toLatex()} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Integrate the left piece directly. On $[-${m}, 0]$ the difference is $${pLatex(left)}$, and $${int(-m, 0, `(${pLatex(left)})`)} = ${intQ(left, -m, 0).toLatex()}$, the same as the right piece.`,
            `直接计算左边一块。在 $[-${m}, 0]$ 上两者之差为 $${pLatex(left)}$，而 $${int(-m, 0, `(${pLatex(left)})`)} = ${intQ(left, -m, 0).toLatex()}$，与右边一块相同。`,
          ),
          cubic
            ? [
                slip(
                  0,
                  `This integrates straight from $-${m}$ to $${m}$; the two pieces have opposite signs and cancel. Double one piece instead.`,
                  `这是直接从 $-${m}$ 积到 $${m}$；两部分符号相反，相互抵消。应把一块加倍。`,
                ),
                slip(
                  half,
                  "This is only one of the two regions; the other, its image through the origin, has the same area.",
                  "这只是两块区域中的一块；另一块是它关于原点的对称图形，面积相同。",
                ),
                slip(
                  Q.of(-c * m ** 4),
                  "$\\int x^{3} \\, dx = \\frac{x^{4}}{4}$; the division by $4$ is missing.",
                  "$\\int x^{3} \\, dx = \\frac{x^{4}}{4}$；漏掉了除以 $4$。",
                ),
              ]
            : [
                slip(
                  half,
                  "This is only one of the two regions; the other, its mirror image across the $y$-axis, has the same area.",
                  "这只是两块区域中的一块；另一块是它关于 $y$ 轴的镜像，面积相同。",
                ),
                slip(
                  Q.of(-4 * c * m ** 5, 3),
                  "$\\int x^{4} \\, dx = \\frac{x^{5}}{5}$; the division by $5$ is missing.",
                  "$\\int x^{4} \\, dx = \\frac{x^{5}}{5}$；漏掉了除以 $5$。",
                ),
                slip(
                  answer.neg(),
                  "This subtracts the curves the wrong way round; an area is never negative.",
                  "这里两曲线减反了；面积不会是负的。",
                ),
              ],
        );
      },
    },
  ],
};

/** ArcCase is a curve whose arc-length integrand is a perfect square, with its derivative, the root, the antiderivative and typical mistakes. */
interface ArcCase {
  readonly curve: string;
  readonly derivative: string;
  readonly square: string;
  readonly root: string;
  readonly antiderivative: string;
  readonly answer: string;
  readonly length: number;
  readonly height: number;
  readonly mistakes: readonly Said[];
}

/** powerCurves are y = c·x^(3/2) with 1 + y'² = 1 + kx, and endpoints making 1 + kb a perfect square. */
const powerCurves: readonly { c: string; value: number; slope: string; k: number; ends: readonly (readonly [number, number])[] }[] = [
  {
    c: "\\frac{2}{3}",
    value: 2 / 3,
    slope: "",
    k: 1,
    ends: [
      [3, 2],
      [8, 3],
      [15, 4],
      [24, 5],
    ],
  },
  {
    c: "\\frac{4}{3}",
    value: 4 / 3,
    slope: "2",
    k: 4,
    ends: [
      [2, 3],
      [6, 5],
      [12, 7],
    ],
  },
  {
    c: "2",
    value: 2,
    slope: "3",
    k: 9,
    ends: [
      [7, 8],
      [11, 10],
    ],
  },
];

/** theArcLengthOfAPlanarCurve integrates sqrt(1 + (dy/dx)²). */
export const theArcLengthOfAPlanarCurve: TopicDef = {
  id: "the-arc-length-of-a-planar-curve",
  title: t("The Arc Length of a Planar Curve", "平面曲线的弧长"),
  summary: t(
    "The length of $y = f(x)$ from $x = a$ to $x = b$ is $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$.",
    "$y = f(x)$ 从 $x = a$ 到 $x = b$ 的弧长为 $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$。",
  ),
  intro: t(
    "A short piece of a curve is nearly straight, with length $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$. Adding the pieces gives an integral. For $y = \\frac{2}{3}x^{3/2}$ from $x = 0$ to $x = 3$, $y' = \\sqrt{x}$, so\n\n$$L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\Big[(1 + x)^{3/2}\\Big]_{0}^{3} = \\frac{2}{3}(8 - 1) = \\frac{14}{3} \\approx 4.667.$$\n\nCheck: the curve runs from $(0, 0)$ to $(3, 2\\sqrt{3})$, and the straight chord between them has length $\\sqrt{9 + 12} \\approx 4.583$. The curve must be a little longer than the chord, and it is.\n\nIn this lesson we find arc lengths with the formula, using a substitution or a perfect square to remove the root.",
    "曲线上的一小段近似为直线，长 $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$。把各段相加就得到一个积分。对 $y = \\frac{2}{3}x^{3/2}$ 从 $x = 0$ 到 $x = 3$，$y' = \\sqrt{x}$，所以\n\n$$L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\Big[(1 + x)^{3/2}\\Big]_{0}^{3} = \\frac{2}{3}(8 - 1) = \\frac{14}{3} \\approx 4.667$$\n\n检验：曲线从 $(0, 0)$ 到 $(3, 2\\sqrt{3})$，两点间的直线弦长为 $\\sqrt{9 + 12} \\approx 4.583$。曲线应比弦稍长，确实如此。\n\n本课我们用弧长公式求弧长，并用换元或完全平方去掉根号。",
  ),
  prerequisites: ["integration-using-substitution"],
  encompasses: [{ topic: "integration-using-substitution", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-length-with-a-substitution",
      figure: calculusDrawings4["the-arc-length-of-a-planar-curve#arc-length-with-a-substitution"],
      title: t("Arc length with a substitution", "用换元法求弧长"),
      explanation: t(
        "A short piece of the curve is nearly a straight segment of length $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$. Adding the pieces,\n\n$$L = \\int_{a}^{b} \\sqrt{1 + \\left(f'(x)\\right)^{2}} \\, dx.$$\n\nFor $y = \\frac{2}{3}x^{3/2}$, $f'(x) = x^{1/2}$, so $L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\left[(1 + x)^{3/2}\\right]_{0}^{3} = \\frac{14}{3}$.\n\nCheck: the chord from $(0, 0)$ to $(3, 2\\sqrt{3})$ has length $\\sqrt{21} \\approx 4.58$, a little less than $\\frac{14}{3} \\approx 4.67$, as a chord must be.\n\n> **Watch out.** With $u = 1 + kx$, $du = k \\, dx$, so divide by $k$. And subtract the value at the lower limit, $1^{3/2} = 1$.",
        "曲线上的一小段近似为长 $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$ 的线段。把各段相加，\n\n$$L = \\int_{a}^{b} \\sqrt{1 + \\left(f'(x)\\right)^{2}} \\, dx$$\n\n对 $y = \\frac{2}{3}x^{3/2}$，$f'(x) = x^{1/2}$，所以 $L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\left[(1 + x)^{3/2}\\right]_{0}^{3} = \\frac{14}{3}$。\n\n检验：从 $(0, 0)$ 到 $(3, 2\\sqrt{3})$ 的弦长为 $\\sqrt{21} \\approx 4.58$，比 $\\frac{14}{3} \\approx 4.67$ 稍短，弦本来就应更短。\n\n> **注意。** 令 $u = 1 + kx$，则 $du = k \\, dx$，所以要除以 $k$。还要减去下限处的值 $1^{3/2} = 1$。",
      ),
      generate(rng) {
        const pc = rng.pick(powerCurves);
        const [b, q] = rng.pick(pc.ends);
        const s = rng.int(-5, 5);
        const answer = Q.of(2 * (q ** 3 - 1), 3 * pc.k);
        const inner = pc.k === 1 ? "1 + x" : `1 + ${pc.k}x`;
        const curve = `${pc.c}x^{3/2}${s === 0 ? "" : s > 0 ? ` + ${s}` : ` - ${-s}`}`;
        const rise = pc.value * b ** 1.5;
        const chord = Math.hypot(b, rise);
        const front = Q.of(2, 3 * pc.k).toLatex();
        const length = answer.isInteger() ? answer.toLatex() : `${answer.toLatex()} \\approx ${around(answer.toNumber())}`;
        return worked(
          t(`Find the arc length of $y = ${curve}$ from $x = 0$ to $x = ${b}$.`, `求 $y = ${curve}$ 从 $x = 0$ 到 $x = ${b}$ 的弧长。`),
          answer,
          [
            [
              ["Square the derivative", "求导数的平方"],
              t("Differentiate; the constant drops out:", "求导；常数项消失："),
              [`y' = ${pc.slope}\\sqrt{x}, \\quad \\left(y'\\right)^{2} = ${pc.k === 1 ? "x" : `${pc.k}x`}`],
            ],
            [
              ["Substitute", "换元"],
              t(
                `Let $u = ${inner}$, so $du = ${pc.k === 1 ? "" : pc.k}\\,dx$ and $u$ runs from $1$ to $${q * q}$:`,
                `令 $u = ${inner}$，则 $du = ${pc.k === 1 ? "" : pc.k}\\,dx$，$u$ 从 $1$ 变到 $${q * q}$：`,
              ),
              [`L = ${int(0, b, `\\sqrt{${inner}}`)} = ${pc.k === 1 ? "" : `\\frac{1}{${pc.k}}`}${int(1, q * q, "u^{1/2}", "u")}`],
            ],
            [
              ["Integrate", "积分"],
              t("Use the power rule:", "用幂函数的积分公式："),
              [`L = ${front}\\Big[u^{3/2}\\Big]_{1}^{${q * q}} = ${front}(${q ** 3} - 1) = ${answer.toLatex()}`],
            ],
          ],
          t(
            `The curve rises from height $${s}$ to about $${around(s + rise)}$, so the chord between its ends has length $\\sqrt{${b}^{2} + ${around(rise)}^{2}} \\approx ${around(chord)}$. The arc must be at least as long, and it is shorter than the path along the two legs, $${b} + ${around(rise)} = ${around(b + rise)}$. Indeed $${length}$ lies between them.`,
            `曲线从高度 $${s}$ 升到约 $${around(s + rise)}$，所以两端之间的弦长为 $\\sqrt{${b}^{2} + ${around(rise)}^{2}} \\approx ${around(chord)}$。弧长至少等于弦长，又小于沿两条直角边走的路程 $${b} + ${around(rise)} = ${around(b + rise)}$。确实 $${length}$ 在两者之间。`,
          ),
          [
            slip(
              Q.of(2 * q ** 3, 3 * pc.k),
              "The value at the lower limit, $1^{3/2} = 1$, must be subtracted.",
              "下限处的值 $1^{3/2} = 1$ 要减去。",
            ),
            slip(
              q - 1,
              `This takes the difference of $\\sqrt{${inner}}$ at the two ends; the square root must be integrated, not just evaluated.`,
              `这是 $\\sqrt{${inner}}$ 在两端的值之差；要对根式积分，不是只代入求值。`,
            ),
            slip(
              Q.of(2 * (q ** 3 - 1), 3),
              `With $u = ${inner}$, $du = ${pc.k}\\,dx$, so the integral is divided by $${pc.k}$.`,
              `令 $u = ${inner}$，则 $du = ${pc.k}\\,dx$，所以积分要除以 $${pc.k}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "arc-length-with-a-perfect-square",
      title: t("Arc length with a perfect square", "利用完全平方求弧长"),
      explanation: t(
        "Some curves are designed so that $1 + (f')^{2}$ is a perfect square, which removes the root and leaves a simple integral. For $y = \\frac{x^{3}}{6} + \\frac{1}{2x}$, $f'(x) = \\frac{x^{2}}{2} - \\frac{1}{2x^{2}}$ and\n\n$$1 + (f')^{2} = \\frac{x^{4}}{4} + \\frac{1}{2} + \\frac{1}{4x^{4}} = \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right)^{2},$$\n\nso $L = \\int_{a}^{b} \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right) dx = \\left[\\frac{x^{3}}{6} - \\frac{1}{2x}\\right]_{a}^{b}$. From $x = 1$ to $x = 2$ this is $\\frac{17}{12}$.\n\nCheck: the curve runs from $\\left(1, \\frac{2}{3}\\right)$ to $\\left(2, \\frac{19}{12}\\right)$, and the chord has length $\\sqrt{1 + \\left(\\frac{11}{12}\\right)^{2}} \\approx 1.357$, just under $\\frac{17}{12} \\approx 1.417$.\n\n> **Watch out.** Only the sign in the middle changes: $(A - B)^{2} + 4AB = (A + B)^{2}$. The antiderivative of $\\frac{1}{2x^{2}}$ is $-\\frac{1}{2x}$, with a minus sign.",
        "有些曲线经过设计，使 $1 + (f')^{2}$ 恰为完全平方，从而去掉根号，只剩一个简单的积分。对 $y = \\frac{x^{3}}{6} + \\frac{1}{2x}$，$f'(x) = \\frac{x^{2}}{2} - \\frac{1}{2x^{2}}$，且\n\n$$1 + (f')^{2} = \\frac{x^{4}}{4} + \\frac{1}{2} + \\frac{1}{4x^{4}} = \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right)^{2}$$\n\n所以 $L = \\int_{a}^{b} \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right) dx = \\left[\\frac{x^{3}}{6} - \\frac{1}{2x}\\right]_{a}^{b}$。从 $x = 1$ 到 $x = 2$，它等于 $\\frac{17}{12}$。\n\n检验：曲线从 $\\left(1, \\frac{2}{3}\\right)$ 到 $\\left(2, \\frac{19}{12}\\right)$，弦长为 $\\sqrt{1 + \\left(\\frac{11}{12}\\right)^{2}} \\approx 1.357$，略小于 $\\frac{17}{12} \\approx 1.417$。\n\n> **注意。** 只有中间的符号改变：$(A - B)^{2} + 4AB = (A + B)^{2}$。$\\frac{1}{2x^{2}}$ 的原函数是 $-\\frac{1}{2x}$，带负号。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(a + 1, 5);
        const s = rng.int(-4, 4);
        const shift = s === 0 ? "" : s > 0 ? ` + ${s}` : ` - ${-s}`;
        const said = (response: string, en: string, zh: string): Said => ({ response, why: t(en, zh) });
        const F1 = (x: number) => Q.of(x ** 3, 6).sub(Q.of(1, 2 * x));
        const F2 = (x: number) => Q.of(x ** 4, 8).sub(Q.of(1, 4 * x * x));
        const ratio = Q.of(b, a);
        const lnRatio = `\\ln ${ratio.isInteger() ? ratio.toLatex() : `\\left(${ratio.toLatex()}\\right)`}`;
        const f1 = (x: number) => x ** 3 / 6 + 1 / (2 * x);
        const f2 = (x: number) => x ** 4 / 8 + 1 / (4 * x * x);
        const f3 = (x: number) => (x * x) / 8 - Math.log(x);
        const cases: ArcCase[] = [
          {
            curve: `\\frac{x^{3}}{6} + \\frac{1}{2x}${shift}`,
            derivative: "\\frac{x^{2}}{2} - \\frac{1}{2x^{2}}",
            square: "\\frac{x^{4}}{4} + \\frac{1}{2} + \\frac{1}{4x^{4}}",
            root: "\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}",
            antiderivative: "\\frac{x^{3}}{6} - \\frac{1}{2x}",
            answer: F1(b).sub(F1(a)).toLatex(),
            length: F1(b).sub(F1(a)).toNumber(),
            height: f1(b) - f1(a),
            mistakes: [
              said(
                Q.of(b ** 3 - a ** 3, 6)
                  .add(Q.of(1, 2 * b))
                  .sub(Q.of(1, 2 * a))
                  .toLatex(),
                "The antiderivative of $\\frac{1}{2x^{2}}$ is $-\\frac{1}{2x}$; this uses $+\\frac{1}{2x}$, the term of the curve itself.",
                "$\\frac{1}{2x^{2}}$ 的原函数是 $-\\frac{1}{2x}$；这里用了 $+\\frac{1}{2x}$，那是曲线本身的项。",
              ),
              said(
                Q.of(b - a).toLatex(),
                "This takes the root as $1$, which gives the length of the interval; the curve is longer.",
                "这是把根式当作 $1$，得到的是区间长度；曲线比它长。",
              ),
              said(
                Q.of(b ** 3 - a ** 3, 6).toLatex(),
                "This drops the term $\\frac{1}{2x^{2}}$ of the root.",
                "这里漏掉了根式中的 $\\frac{1}{2x^{2}}$ 项。",
              ),
            ],
          },
          {
            curve: `\\frac{x^{4}}{8} + \\frac{1}{4x^{2}}${shift}`,
            derivative: "\\frac{x^{3}}{2} - \\frac{1}{2x^{3}}",
            square: "\\frac{x^{6}}{4} + \\frac{1}{2} + \\frac{1}{4x^{6}}",
            root: "\\frac{x^{3}}{2} + \\frac{1}{2x^{3}}",
            antiderivative: "\\frac{x^{4}}{8} - \\frac{1}{4x^{2}}",
            answer: F2(b).sub(F2(a)).toLatex(),
            length: F2(b).sub(F2(a)).toNumber(),
            height: f2(b) - f2(a),
            mistakes: [
              said(
                Q.of(b ** 4 - a ** 4, 8)
                  .add(Q.of(1, 4 * b * b))
                  .sub(Q.of(1, 4 * a * a))
                  .toLatex(),
                "The antiderivative of $\\frac{1}{2x^{3}}$ is $-\\frac{1}{4x^{2}}$; this uses $+\\frac{1}{4x^{2}}$, the term of the curve itself.",
                "$\\frac{1}{2x^{3}}$ 的原函数是 $-\\frac{1}{4x^{2}}$；这里用了 $+\\frac{1}{4x^{2}}$，那是曲线本身的项。",
              ),
              said(
                Q.of(b - a).toLatex(),
                "This takes the root as $1$, which gives the length of the interval; the curve is longer.",
                "这是把根式当作 $1$，得到的是区间长度；曲线比它长。",
              ),
              said(
                Q.of(b ** 4 - a ** 4, 8).toLatex(),
                "This drops the term $\\frac{1}{2x^{3}}$ of the root.",
                "这里漏掉了根式中的 $\\frac{1}{2x^{3}}$ 项。",
              ),
            ],
          },
          {
            curve: `\\frac{x^{2}}{8} - \\ln x${shift}`,
            derivative: "\\frac{x}{4} - \\frac{1}{x}",
            square: "\\frac{x^{2}}{16} + \\frac{1}{2} + \\frac{1}{x^{2}}",
            root: "\\frac{x}{4} + \\frac{1}{x}",
            antiderivative: "\\frac{x^{2}}{8} + \\ln x",
            answer: `${Q.of(b * b - a * a, 8).toLatex()} + ${lnRatio}`,
            length: Q.of(b * b - a * a, 8).toNumber() + Math.log(b / a),
            height: f3(b) - f3(a),
            mistakes: [
              said(
                `${Q.of(b * b - a * a, 8).toLatex()} - ${lnRatio}`,
                "The root is $\\frac{x}{4} + \\frac{1}{x}$, with a plus sign, so $\\ln x$ is added.",
                "根式是 $\\frac{x}{4} + \\frac{1}{x}$，带加号，所以 $\\ln x$ 是加上的。",
              ),
              said(
                Q.of(b * b - a * a, 8).toLatex(),
                "This drops the term $\\frac{1}{x}$ of the root, whose integral is $\\ln x$.",
                "这里漏掉了根式中的 $\\frac{1}{x}$ 项，它的积分是 $\\ln x$。",
              ),
              said(
                `${Q.of(b * b - a * a, 8).toLatex()} + \\ln ${b}`,
                `The lower limit gives $\\ln ${a}$, which must be subtracted.`,
                `下限给出 $\\ln ${a}$，要把它减去。`,
              ),
            ],
          },
        ];
        const c = rng.pick(cases);
        const chord = Math.hypot(b - a, c.height);
        return exactWorked(
          t(
            `Find the arc length of $y = ${c.curve}$ from $x = ${a}$ to $x = ${b}$. Give an exact answer.`,
            `求 $y = ${c.curve}$ 从 $x = ${a}$ 到 $x = ${b}$ 的弧长，给出精确值。`,
          ),
          c.answer,
          [
            [["Differentiate", "求导"], t("The constant drops out:", "常数项消失："), [`y' = ${c.derivative}`]],
            [
              ["Complete the square", "配成完全平方"],
              t(
                "Adding $1$ changes only the middle term, from $-\\frac{1}{2}$ to $+\\frac{1}{2}$:",
                "加上 $1$ 只改变中间一项，从 $-\\frac{1}{2}$ 变成 $+\\frac{1}{2}$：",
              ),
              [`1 + (y')^{2} = ${c.square} = \\left(${c.root}\\right)^{2}`],
            ],
            [
              ["Integrate", "积分"],
              t("The root is gone:", "根号去掉了："),
              [`L = ${int(a, b, `\\left(${c.root}\\right)`)} = \\Big[${c.antiderivative}\\Big]_{${a}}^{${b}} = ${c.answer}`],
            ],
          ],
          t(
            `The ends of the curve differ by $${b - a}$ across and about $${around(c.height)}$ in height, so the chord has length about $${around(chord)}$. The arc must be at least that long: $${c.answer} \\approx ${around(c.length)}$.`,
            `曲线两端水平相差 $${b - a}$，高度相差约 $${around(c.height)}$，所以弦长约为 $${around(chord)}$。弧长至少应等于弦长：$${c.answer} \\approx ${around(c.length)}$。`,
          ),
          c.mistakes,
        );
      },
    },
  ],
};

/** Base is the base of a solid: the width s(x) of the region, its square, its greatest value, with ∫s and ∫s² over it. */
interface Base {
  readonly region: Text;
  readonly s: string;
  readonly s2: string;
  readonly limits: readonly [number, number];
  readonly intS: Q;
  readonly intS2: Q;
  readonly maxS: Q;
  readonly where: Text;
}

/** singleCurveBase chooses a region bounded by one curve and the axes. */
function singleCurveBase(rng: Rng): Base {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const m = rng.int(1, 4);
    const b = rng.int(1, 4);
    const line = pLatex([m * b, -m]);
    return {
      region: t(`the region bounded by $y = ${line}$ and the coordinate axes`, `由 $y = ${line}$ 与两条坐标轴围成的区域`),
      s: line,
      s2: pLatex(pMul([m * b, -m], [m * b, -m])),
      limits: [0, b],
      intS: Q.of(m * b * b, 2),
      intS2: Q.of(m * m * b ** 3, 3),
      maxS: Q.of(m * b),
      where: t(`at $x = 0$`, `在 $x = 0$ 处`),
    };
  }
  if (kind === 1) {
    const c = rng.int(1, 3);
    const m = rng.int(1, 3);
    const curve = pLatex([c * m * m, 0, -c]);
    return {
      region: t(`the region bounded by $y = ${curve}$ and the $x$-axis`, `由 $y = ${curve}$ 与 $x$ 轴围成的区域`),
      s: curve,
      s2: pLatex(pMul([c * m * m, 0, -c], [c * m * m, 0, -c])),
      limits: [-m, m],
      intS: Q.of(4 * c * m ** 3, 3),
      intS2: Q.of(16 * c * c * m ** 5, 15),
      maxS: Q.of(c * m * m),
      where: t(`at $x = 0$`, `在 $x = 0$ 处`),
    };
  }
  const k = rng.int(1, 4);
  const n = rng.int(1, 3);
  const b = n * n;
  return {
    region: t(
      `the region bounded by $y = ${coef(Q.of(k))}\\sqrt{x}$, the $x$-axis and the line $x = ${b}$`,
      `由 $y = ${coef(Q.of(k))}\\sqrt{x}$、$x$ 轴与直线 $x = ${b}$ 围成的区域`,
    ),
    s: `${coef(Q.of(k))}\\sqrt{x}`,
    s2: `${coef(Q.of(k * k))}x`,
    limits: [0, b],
    intS: Q.of(2 * k * n ** 3, 3),
    intS2: Q.of(k * k * b * b, 2),
    maxS: Q.of(k * n),
    where: t(`at $x = ${b}$`, `在 $x = ${b}$ 处`),
  };
}

/** twoCurveBase chooses a region between y = c·m·x + d and y = c·x² + d. */
function twoCurveBase(rng: Rng): Base {
  const c = rng.int(1, 3);
  const m = rng.int(1, 4);
  const d = rng.int(-3, 3);
  const top = pLatex([d, c * m]);
  const bottom = pLatex([d, 0, c]);
  return {
    region: t(`the region enclosed by $y = ${top}$ and $y = ${bottom}$`, `由 $y = ${top}$ 与 $y = ${bottom}$ 围成的区域`),
    s: pLatex([0, c * m, -c]),
    s2: pLatex(pMul([0, c * m, -c], [0, c * m, -c])),
    limits: [0, m],
    intS: Q.of(c * m ** 3, 6),
    intS2: Q.of(c * c * m ** 5, 30),
    maxS: Q.of(c * m * m, 4),
    where: t(`at the middle, $x = ${Q.of(m, 2).toLatex()}$`, `在中点 $x = ${Q.of(m, 2).toLatex()}$ 处`),
  };
}

/** Section is a cross-section shape with its area as a multiple of the side squared, and the factors a learner might use by mistake. */
interface Section {
  readonly shape: Text;
  readonly factor: Q;
  readonly symbol: string;
  readonly area: string;
  readonly slips: readonly { readonly factor: Q; readonly why: Text }[];
}

/** scaled writes q·symbol·body, leaving out a factor of 1. */
const scaled = (q: Q, symbol: string, body: string) => `${q.eq(Q.one) ? "" : q.toLatex()}${symbol}${body}`;

/** volumeProblem asks for the volume of a solid with known cross sections. */
function volumeProblem(base: Base, section: Section, square = true): Problem {
  const [a, b] = base.limits;
  const value = square ? base.intS2.mul(section.factor) : base.intS.mul(section.factor);
  const answer = times(value, section.symbol);
  const prompt = t(
    `The base of a solid is ${base.region.en}. Cross sections perpendicular to the $x$-axis are ${section.shape.en}. Find the volume of the solid.${section.symbol === "" ? "" : " Give an exact answer."}`,
    `某立体的底面是${base.region["zh-CN"]}。垂直于 $x$ 轴的截面是${section.shape["zh-CN"]}。求该立体的体积${section.symbol === "" ? "" : "，给出精确值"}。`,
  );
  const integrand = square ? `(${base.s})^{2}` : `(${base.s})`;
  const inner = square ? base.intS2 : base.intS;
  const width = b - a;
  const maxArea = square ? base.maxS.mul(base.maxS).mul(section.factor) : base.maxS.mul(section.factor);
  const bound = maxArea.mul(Q.of(width));
  const show = (q: Q) => times(q, section.symbol);
  const parts: Step[] = [
    [
      ["Find the side and the limits", "求边长和积分限"],
      t(`Across the base at $x$, the cross section stands on a segment of length:`, `在 $x$ 处，截面立在横跨底面的一条线段上，其长度为：`),
      [`s(x) = ${base.s}, \\quad ${a} \\le x \\le ${b}`],
    ],
    [
      ["Write the area of a cross section", "写出截面面积"],
      t(`The cross sections are ${section.shape.en}:`, `截面是${section.shape["zh-CN"]}：`),
      [`A(x) = ${section.area}`],
    ],
    [
      ["Integrate the area", "对面积积分"],
      t("Add up the slices:", "把各薄片加起来："),
      square
        ? [
            `V = ${scaled(section.factor, section.symbol, int(a, b, integrand))} = ${scaled(section.factor, section.symbol, int(a, b, `(${base.s2})`))}${
              section.factor.eq(Q.one) && section.symbol === ""
                ? ""
                : ` = ${scaled(section.factor, section.symbol, "")} \\cdot ${inner.toLatex()}`
            } = ${answer}`,
          ]
        : [
            `V = ${scaled(section.factor, section.symbol, int(a, b, integrand))} = ${section.factor.toLatex()} \\cdot ${inner.toLatex()} = ${answer}`,
          ],
    ],
  ];
  const check = t(
    `Bound the volume by the largest slice. The side is greatest ${base.where.en}, $s = ${base.maxS.toLatex()}$, where the area is $${show(maxArea)}$. Every slice is at most that, over a length of $${width}$, so $0 < V \\le ${show(maxArea)} \\cdot ${width} = ${show(bound)}$. Indeed $${answer}$ is less.`,
    `用最大的截面估计体积。边长${base.where["zh-CN"]}最大，$s = ${base.maxS.toLatex()}$，此时截面面积为 $${show(maxArea)}$。每个截面都不超过它，区间长为 $${width}$，所以 $0 < V \\le ${show(maxArea)} \\cdot ${width} = ${show(bound)}$。确实 $${answer}$ 更小。`,
  );
  const raw: { value: Q; why: Text }[] = square
    ? [
        ...section.slips.map((s) => ({ value: base.intS2.mul(s.factor), why: s.why })),
        {
          value: base.intS.mul(section.factor),
          why: t(
            "This integrates the side $s(x)$, not the area of the cross section; the area grows with $s^{2}$.",
            "这是对边长 $s(x)$ 积分，而不是对截面面积积分；面积随 $s^{2}$ 变化。",
          ),
        },
        {
          value: base.intS.mul(base.intS).mul(section.factor),
          why: t(
            "This squares the integral of $s$; the square of each side must be taken before integrating.",
            "这是把 $s$ 的积分平方；应先把每个边长平方再积分。",
          ),
        },
      ]
    : [
        ...section.slips.map((s) => ({ value: base.intS.mul(s.factor), why: s.why })),
        {
          value: base.intS2.mul(section.factor),
          why: t(
            "This squares the side, as for a square; here the height is fixed, so the area is the height times $s$.",
            "这里把边长平方了，像正方形那样；这里高是固定的，所以面积是高乘以 $s$。",
          ),
        },
        {
          value: base.intS.mul(section.factor).div(Q.of(2)),
          why: t(
            "This halves the area, as for a triangle; the cross sections are rectangles.",
            "这是把面积减半，像三角形那样；截面是矩形。",
          ),
        },
      ];
  const mistakes = raw.filter((m, i) => !m.value.eq(value) && raw.findIndex((n) => n.value.eq(m.value)) === i);
  if (section.symbol === "") return worked(prompt, value, parts, check, mistakes);
  return exactWorked(
    prompt,
    answer,
    parts,
    check,
    mistakes.map((m) => ({ response: times(m.value, section.symbol), why: m.why })),
  );
}

/** squares are square cross sections. */
const squares: Section = {
  shape: t("squares", "正方形"),
  factor: Q.one,
  symbol: "",
  area: "s^{2}",
  slips: [
    {
      factor: Q.of(1, 2),
      why: t(
        "A square of side $s$ has area $s^{2}$; halving it gives a triangle.",
        "边长为 $s$ 的正方形面积为 $s^{2}$；减半得到的是三角形。",
      ),
    },
  ],
};

/** volumesOfSolidsWithSquareCrossSections integrates the area of square cross sections. */
export const volumesOfSolidsWithSquareCrossSections: TopicDef = {
  id: "volumes-of-solids-with-square-cross-sections",
  title: t("Volumes of Solids With Square Cross Sections", "截面为正方形的立体的体积"),
  summary: t("Integrate the area A(x) = s(x)² of square cross sections.", "对正方形截面的面积 A(x) = s(x)² 积分。"),
  intro: t(
    "Slice a solid like a loaf of bread. A slice at $x$ of thickness $dx$ has volume about $A(x) \\, dx$, where $A(x)$ is the area of the cross section, so $V = \\int_{a}^{b} A(x) \\, dx$. Take the base under $y = 2 - x$ on $[0, 2]$, with square cross sections standing on it. The square at $x$ has side $2 - x$, so\n\n$$V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\Big[-\\frac{(2 - x)^{3}}{3}\\Big]_{0}^{2} = \\frac{8}{3}.$$\n\nCheck: this solid is a pyramid with a square base of side $2$ and height $2$, and a pyramid has volume $\\frac{1}{3} \\cdot 4 \\cdot 2 = \\frac{8}{3}$.\n\nIn this lesson we find the volume of a solid whose cross sections are squares standing on a region, under one curve or between two.",
    "像切面包一样把立体切片。在 $x$ 处厚 $dx$ 的薄片体积约为 $A(x) \\, dx$，其中 $A(x)$ 是截面面积，所以 $V = \\int_{a}^{b} A(x) \\, dx$。取 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，上面立着正方形截面。在 $x$ 处的正方形边长为 $2 - x$，所以\n\n$$V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\Big[-\\frac{(2 - x)^{3}}{3}\\Big]_{0}^{2} = \\frac{8}{3}$$\n\n检验：这个立体是一个底面为边长 $2$ 的正方形、高为 $2$ 的棱锥，棱锥体积为 $\\frac{1}{3} \\cdot 4 \\cdot 2 = \\frac{8}{3}$。\n\n本课我们求截面为正方形的立体的体积，正方形立在一条曲线下方或两条曲线之间的区域上。",
  ),
  prerequisites: ["the-area-between-curves-expressed-as-functions-of-x"],
  encompasses: [{ topic: "the-area-between-curves-expressed-as-functions-of-x", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "square-cross-sections-under-a-curve",
      figure: calculusDrawings4["volumes-of-solids-with-square-cross-sections#square-cross-sections-under-a-curve"],
      title: t("Square cross sections under a curve", "曲线下方区域上的正方形截面"),
      explanation: t(
        "If the cross section of a solid at $x$ has area $A(x)$, slicing gives $V = \\int_{a}^{b} A(x) \\, dx$. When the base is a region in the plane and the cross sections perpendicular to the $x$-axis are squares, each side is the width $s(x)$ of the base at $x$, so $A(x) = s(x)^{2}$. For the base under $y = 2 - x$ on $[0, 2]$: $V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$.\n\nCheck: the solid is a pyramid with a $2 \\times 2$ square base and height $2$, of volume $\\frac{1}{3} \\cdot 4 \\cdot 2 = \\frac{8}{3}$.\n\n> **Watch out.** Square the side before integrating. $\\int_{0}^{2} (2 - x) \\, dx = 2$ is the area of the base, not the volume, and $2^{2} = 4$ is not the volume either.",
        "若立体在 $x$ 处的截面面积为 $A(x)$，切片可得 $V = \\int_{a}^{b} A(x) \\, dx$。当底面是平面区域、垂直于 $x$ 轴的截面是正方形时，每个正方形的边长就是底面在 $x$ 处的宽度 $s(x)$，所以 $A(x) = s(x)^{2}$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面：$V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$。\n\n检验：这个立体是底面为 $2 \\times 2$ 正方形、高为 $2$ 的棱锥，体积为 $\\frac{1}{3} \\cdot 4 \\cdot 2 = \\frac{8}{3}$。\n\n> **注意。** 要先把边长平方再积分。$\\int_{0}^{2} (2 - x) \\, dx = 2$ 是底面面积，不是体积；$2^{2} = 4$ 也不是体积。",
      ),
      generate(rng) {
        return volumeProblem(singleCurveBase(rng), squares);
      },
    },
    {
      id: "square-cross-sections-between-two-curves",
      title: t("Square cross sections between two curves", "两曲线之间区域上的正方形截面"),
      explanation: t(
        "When the base lies between two curves, the side of each square is the top curve minus the bottom curve: $s(x) = f(x) - g(x)$. For the region between $y = x$ and $y = x^{2}$: $V = \\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\int_{0}^{1} (x^{2} - 2x^{3} + x^{4}) \\, dx = \\frac{1}{3} - \\frac{1}{2} + \\frac{1}{5} = \\frac{1}{30}$.\n\nCheck: the widest gap is $\\frac{1}{4}$, at $x = \\frac{1}{2}$, so no slice has area more than $\\frac{1}{16}$, and the volume is at most $\\frac{1}{16}$ over a length of $1$. Indeed $\\frac{1}{30} < \\frac{1}{16}$.\n\n> **Watch out.** The side is the gap $f - g$, squared as a whole: $(x - x^{2})^{2}$, not $x^{2} - x^{4}$.",
        "当底面位于两曲线之间时，正方形的边长是上方曲线减下方曲线：$s(x) = f(x) - g(x)$。对 $y = x$ 与 $y = x^{2}$ 之间的区域：$V = \\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\int_{0}^{1} (x^{2} - 2x^{3} + x^{4}) \\, dx = \\frac{1}{3} - \\frac{1}{2} + \\frac{1}{5} = \\frac{1}{30}$。\n\n检验：最大的间距在 $x = \\frac{1}{2}$ 处，为 $\\frac{1}{4}$，所以每个截面面积都不超过 $\\frac{1}{16}$，区间长为 $1$，体积至多为 $\\frac{1}{16}$。确实 $\\frac{1}{30} < \\frac{1}{16}$。\n\n> **注意。** 边长是间距 $f - g$，要整体平方：$(x - x^{2})^{2}$，而不是 $x^{2} - x^{4}$。",
      ),
      generate(rng) {
        return volumeProblem(twoCurveBase(rng), squares);
      },
    },
  ],
};

/** volumesOfSolidsWithRectangularCrossSections integrates the area of rectangular cross sections. */
export const volumesOfSolidsWithRectangularCrossSections: TopicDef = {
  id: "volumes-of-solids-with-rectangular-cross-sections",
  title: t("Volumes of Solids With Rectangular Cross Sections", "截面为矩形的立体的体积"),
  summary: t("Integrate the area of rectangular cross sections whose base lies in the region.", "对底边位于区域内的矩形截面的面积积分。"),
  intro: t(
    "A rectangle standing on the base has its base $s(x)$ across the region and some height. If the height is $3$ times the base, its area is $s \\cdot 3s = 3s^{2}$. For the base under $y = 2 - x$ on $[0, 2]$,\n\n$$V = 3\\int_{0}^{2} (2 - x)^{2} \\, dx = 3 \\cdot \\frac{8}{3} = 8.$$\n\nCheck: the largest rectangle, at $x = 0$, is $2$ by $6$, of area $12$, and the solid is a pyramid on it with height $2$: $\\frac{1}{3} \\cdot 12 \\cdot 2 = 8$.\n\nIn this lesson we find volumes with rectangular cross sections, whose height is either a multiple of the base or a constant.",
    "立在底面上的矩形，底边 $s(x)$ 横跨区域，并有一定的高。若高是底边的 $3$ 倍，面积为 $s \\cdot 3s = 3s^{2}$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，\n\n$$V = 3\\int_{0}^{2} (2 - x)^{2} \\, dx = 3 \\cdot \\frac{8}{3} = 8$$\n\n检验：最大的矩形在 $x = 0$ 处，为 $2 \\times 6$，面积 $12$，立体是以它为底、高为 $2$ 的棱锥：$\\frac{1}{3} \\cdot 12 \\cdot 2 = 8$。\n\n本课我们求截面为矩形的立体的体积，矩形的高或者是底边的倍数，或者是常数。",
  ),
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rectangles-with-height-proportional-to-the-base",
      figure: calculusDrawings4["volumes-of-solids-with-rectangular-cross-sections#rectangles-with-height-proportional-to-the-base"],
      title: t("Rectangles with height proportional to the base", "高与底成比例的矩形"),
      explanation: t(
        "If each rectangular cross section has its base $s(x)$ across the region and height $h$ times its base, its area is $s \\cdot hs = hs^{2}$, so $V = h\\int_{a}^{b} s(x)^{2} \\, dx$. For the base under $y = 2 - x$ on $[0, 2]$ with $h = 3$: $V = 3 \\cdot \\frac{8}{3} = 8$.\n\nCheck: the slices are the squares of the square-section solid stretched $3$ times upward, so the volume is $3$ times that solid's $\\frac{8}{3}$, which is $8$.\n\n> **Watch out.** The area is $hs^{2}$, not $hs$: the height itself grows with the base.",
        "若每个矩形截面的底边 $s(x)$ 横跨区域、高是底边的 $h$ 倍，则面积为 $s \\cdot hs = hs^{2}$，所以 $V = h\\int_{a}^{b} s(x)^{2} \\, dx$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，取 $h = 3$：$V = 3 \\cdot \\frac{8}{3} = 8$。\n\n检验：这些截面是正方形截面立体的正方形向上拉伸 $3$ 倍，所以体积是那个立体的 $\\frac{8}{3}$ 的 $3$ 倍，即 $8$。\n\n> **注意。** 面积是 $hs^{2}$，不是 $hs$：高本身也随底边变化。",
      ),
      generate(rng) {
        const h = rng.int(2, 4);
        const section: Section = {
          shape: t(`rectangles whose height is $${h}$ times the base`, `高为底边 $${h}$ 倍的矩形`),
          factor: Q.of(h),
          symbol: "",
          area: `s \\cdot ${h}s = ${h}s^{2}`,
          slips: [
            {
              factor: Q.one,
              why: t(
                `This leaves out the factor $${h}$: the height is $${h}s$, so the area is $${h}s^{2}$.`,
                `这里漏掉了因数 $${h}$：高为 $${h}s$，所以面积为 $${h}s^{2}$。`,
              ),
            },
          ],
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "rectangles-with-constant-height",
      figure: calculusDrawings4["volumes-of-solids-with-rectangular-cross-sections#rectangles-with-constant-height"],
      title: t("Rectangles with constant height", "高为常数的矩形"),
      explanation: t(
        "If every rectangle has the same height $H$, its area is $Hs(x)$, and the volume is $H$ times the area of the base: $V = H\\int_{a}^{b} s(x) \\, dx$. The solid is a slab of constant thickness. For the base under $y = 2 - x$ on $[0, 2]$ with $H = 5$: $V = 5 \\cdot 2 = 10$.\n\nCheck: the base is a triangle with legs $2$ and $2$, of area $2$, and a slab of thickness $5$ on it has volume $5 \\cdot 2 = 10$.\n\n> **Watch out.** Do not square the side here; only the base $s$ varies, while the height stays $H$.",
        "若每个矩形的高都是 $H$，其面积为 $Hs(x)$，体积等于 $H$ 乘以底面面积：$V = H\\int_{a}^{b} s(x) \\, dx$。这个立体是厚度不变的板。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，取 $H = 5$：$V = 5 \\cdot 2 = 10$。\n\n检验：底面是两条直角边都为 $2$ 的三角形，面积为 $2$，厚 $5$ 的板体积为 $5 \\cdot 2 = 10$。\n\n> **注意。** 这里不要把边长平方；只有底边 $s$ 在变，高始终是 $H$。",
      ),
      generate(rng) {
        const H = rng.int(2, 6);
        const section: Section = {
          shape: t(`rectangles of height $${H}$`, `高为 $${H}$ 的矩形`),
          factor: Q.of(H),
          symbol: "",
          area: `${H}s`,
          slips: [
            {
              factor: Q.one,
              why: t(
                `This is the area of the base; multiply by the height $${H}$ to get the volume.`,
                `这是底面面积；还要乘以高 $${H}$ 才是体积。`,
              ),
            },
          ],
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section, false);
      },
    },
  ],
};

/** volumesOfSolidsWithTriangularCrossSections integrates the area of triangular cross sections. */
export const volumesOfSolidsWithTriangularCrossSections: TopicDef = {
  id: "volumes-of-solids-with-triangular-cross-sections",
  title: t("Volumes of Solids With Triangular Cross Sections", "截面为三角形的立体的体积"),
  summary: t(
    "Integrate the area of equilateral or right isosceles triangular cross sections.",
    "对等边三角形或等腰直角三角形截面的面积积分。",
  ),
  intro: t(
    "When the cross sections are triangles, write the area of each from the side $s(x)$ that lies in the base, then integrate. Take isosceles right triangles with one leg in the base under $y = 2 - x$ on $[0, 2]$. Each has area $\\frac{1}{2}s^{2}$, so\n\n$$V = \\frac{1}{2}\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{1}{2} \\cdot \\frac{8}{3} = \\frac{4}{3}.$$\n\nCheck: each triangle is half of the square on the same side, so this solid has half the volume of the square-section solid, $\\frac{1}{2} \\cdot \\frac{8}{3} = \\frac{4}{3}$.\n\nIn this lesson we find volumes with equilateral and isosceles right triangle cross sections.",
    "当截面是三角形时，先由底面上的边 $s(x)$ 写出每个三角形的面积，再积分。取一条直角边在 $[0, 2]$ 上 $y = 2 - x$ 下方底面上的等腰直角三角形。每个面积为 $\\frac{1}{2}s^{2}$，所以\n\n$$V = \\frac{1}{2}\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{1}{2} \\cdot \\frac{8}{3} = \\frac{4}{3}$$\n\n检验：每个三角形是同边长正方形的一半，所以这个立体的体积是正方形截面立体的一半，$\\frac{1}{2} \\cdot \\frac{8}{3} = \\frac{4}{3}$。\n\n本课我们求截面为等边三角形和等腰直角三角形的立体的体积。",
  ),
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equilateral-triangle-cross-sections",
      figure: calculusDrawings4["volumes-of-solids-with-triangular-cross-sections#equilateral-triangle-cross-sections"],
      title: t("Equilateral triangle cross sections", "等边三角形截面"),
      explanation: t(
        "Slice the solid perpendicular to the axis; each slice is a thin triangle whose area depends on its side, and adding up the slices gives the volume. An equilateral triangle with side $s$ has height $\\frac{\\sqrt{3}}{2}s$ and area $\\frac{1}{2} \\cdot s \\cdot \\frac{\\sqrt{3}}{2}s = \\frac{\\sqrt{3}}{4}s^{2}$, so $V = \\frac{\\sqrt{3}}{4}\\int_{a}^{b} s(x)^{2} \\, dx$. For the base under $y = 2 - x$ on $[0, 2]$: $V = \\frac{\\sqrt{3}}{4} \\cdot \\frac{8}{3} = \\frac{2\\sqrt{3}}{3}$.\n\nCheck: $\\frac{\\sqrt{3}}{4} \\approx 0.433$, so the solid holds a little less than half of the square-section solid: $0.433 \\cdot \\frac{8}{3} \\approx 1.155$, and $\\frac{2\\sqrt{3}}{3} \\approx 1.155$.\n\n> **Watch out.** The height of the triangle is $\\frac{\\sqrt{3}}{2}s$, not $s$; the area $\\frac{1}{2}s^{2}$ would belong to a right triangle with two legs $s$.",
        "垂直于轴把立体切成薄片；每一片是一个面积取决于边长的三角形，把所有薄片加起来就得到体积。边长为 $s$ 的等边三角形高为 $\\frac{\\sqrt{3}}{2}s$，面积为 $\\frac{1}{2} \\cdot s \\cdot \\frac{\\sqrt{3}}{2}s = \\frac{\\sqrt{3}}{4}s^{2}$，所以 $V = \\frac{\\sqrt{3}}{4}\\int_{a}^{b} s(x)^{2} \\, dx$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面：$V = \\frac{\\sqrt{3}}{4} \\cdot \\frac{8}{3} = \\frac{2\\sqrt{3}}{3}$。\n\n检验：$\\frac{\\sqrt{3}}{4} \\approx 0.433$，所以立体体积略小于正方形截面立体的一半：$0.433 \\cdot \\frac{8}{3} \\approx 1.155$，而 $\\frac{2\\sqrt{3}}{3} \\approx 1.155$。\n\n> **注意。** 三角形的高是 $\\frac{\\sqrt{3}}{2}s$，不是 $s$；面积 $\\frac{1}{2}s^{2}$ 属于两条直角边都为 $s$ 的直角三角形。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("equilateral triangles", "等边三角形"),
          factor: Q.of(1, 4),
          symbol: "\\sqrt{3}",
          area: "\\frac{\\sqrt{3}}{4}s^{2}",
          slips: [
            {
              factor: Q.of(1, 2),
              why: t(
                "The height of an equilateral triangle is $\\frac{\\sqrt{3}}{2}s$, so its area is $\\frac{\\sqrt{3}}{4}s^{2}$, not $\\frac{\\sqrt{3}}{2}s^{2}$.",
                "等边三角形的高为 $\\frac{\\sqrt{3}}{2}s$，所以面积为 $\\frac{\\sqrt{3}}{4}s^{2}$，不是 $\\frac{\\sqrt{3}}{2}s^{2}$。",
              ),
            },
            {
              factor: Q.one,
              why: t(
                "This leaves out the $\\frac{1}{4}$ in the area $\\frac{\\sqrt{3}}{4}s^{2}$.",
                "这里漏掉了面积 $\\frac{\\sqrt{3}}{4}s^{2}$ 中的 $\\frac{1}{4}$。",
              ),
            },
          ],
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "right-isosceles-triangle-cross-sections",
      figure: calculusDrawings4["volumes-of-solids-with-triangular-cross-sections#right-isosceles-triangle-cross-sections"],
      title: t("Right isosceles triangle cross sections", "等腰直角三角形截面"),
      explanation: t(
        "For an isosceles right triangle with a leg $s$ in the base, the area is $\\frac{1}{2}s^{2}$. If instead the hypotenuse $s$ lies in the base, each leg is $\\frac{s}{\\sqrt{2}}$ and the area is $\\frac{1}{2}\\left(\\frac{s}{\\sqrt{2}}\\right)^{2} = \\frac{1}{4}s^{2}$. For the base under $y = 2 - x$ on $[0, 2]$, $\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$, so the volumes are $\\frac{4}{3}$ and $\\frac{2}{3}$.\n\nCheck: the square on the hypotenuse $s$ is cut by its diagonals into four such triangles, so each has area $\\frac{1}{4}s^{2}$.\n\n> **Watch out.** Read which side lies in the base: a leg gives $\\frac{1}{2}s^{2}$, the hypotenuse gives $\\frac{1}{4}s^{2}$.",
        "若等腰直角三角形的一条直角边 $s$ 在底面上，面积为 $\\frac{1}{2}s^{2}$。若斜边 $s$ 在底面上，每条直角边为 $\\frac{s}{\\sqrt{2}}$，面积为 $\\frac{1}{2}\\left(\\frac{s}{\\sqrt{2}}\\right)^{2} = \\frac{1}{4}s^{2}$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，$\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$，所以两种体积分别为 $\\frac{4}{3}$ 和 $\\frac{2}{3}$。\n\n检验：以斜边为边的正方形被两条对角线分成四个这样的三角形，所以每个面积为 $\\frac{1}{4}s^{2}$。\n\n> **注意。** 看清哪条边在底面上：直角边给出 $\\frac{1}{2}s^{2}$，斜边给出 $\\frac{1}{4}s^{2}$。",
      ),
      generate(rng) {
        const leg = rng.bool();
        const section: Section = leg
          ? {
              shape: t("isosceles right triangles with one leg in the base", "一条直角边在底面上的等腰直角三角形"),
              factor: Q.of(1, 2),
              symbol: "",
              area: "\\frac{1}{2}s^{2}",
              slips: [
                {
                  factor: Q.of(1, 4),
                  why: t(
                    "The area $\\frac{1}{4}s^{2}$ is for the hypotenuse in the base; with a leg $s$ in the base, the area is $\\frac{1}{2}s^{2}$.",
                    "面积 $\\frac{1}{4}s^{2}$ 对应斜边在底面上；直角边 $s$ 在底面上时，面积为 $\\frac{1}{2}s^{2}$。",
                  ),
                },
                {
                  factor: Q.one,
                  why: t("This leaves out the $\\frac{1}{2}$ in the area of a triangle.", "这里漏掉了三角形面积中的 $\\frac{1}{2}$。"),
                },
              ],
            }
          : {
              shape: t("isosceles right triangles with the hypotenuse in the base", "斜边在底面上的等腰直角三角形"),
              factor: Q.of(1, 4),
              symbol: "",
              area: "\\frac{1}{4}s^{2}",
              slips: [
                {
                  factor: Q.of(1, 2),
                  why: t(
                    "The area $\\frac{1}{2}s^{2}$ is for a leg in the base; with the hypotenuse $s$ in the base, each leg is $\\frac{s}{\\sqrt{2}}$ and the area is $\\frac{1}{4}s^{2}$.",
                    "面积 $\\frac{1}{2}s^{2}$ 对应直角边在底面上；斜边 $s$ 在底面上时，每条直角边为 $\\frac{s}{\\sqrt{2}}$，面积为 $\\frac{1}{4}s^{2}$。",
                  ),
                },
              ],
            };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
  ],
};

/** volumesOfSolidsWithCircularCrossSections integrates the area of semicircular and circular cross sections. */
export const volumesOfSolidsWithCircularCrossSections: TopicDef = {
  id: "volumes-of-solids-with-circular-cross-sections",
  title: t("Volumes of Solids With Circular Cross Sections", "截面为圆形的立体的体积"),
  summary: t("Integrate the area of semicircles or circles whose diameter spans the base.", "对直径横跨底面的半圆或圆的面积积分。"),
  intro: t(
    "When each cross section is a circle whose diameter $s(x)$ spans the base, its radius is $\\frac{s}{2}$ and its area is $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$. For the base under $y = 2 - x$ on $[0, 2]$,\n\n$$V = \\frac{\\pi}{4}\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{\\pi}{4} \\cdot \\frac{8}{3} = \\frac{2\\pi}{3}.$$\n\nCheck: each circle fits inside the square on the same diameter and fills $\\frac{\\pi}{4}$ of it, so the volume is $\\frac{\\pi}{4}$ of the square-section solid's $\\frac{8}{3}$, about $2.09$, a little less than $\\frac{8}{3} \\approx 2.67$.\n\nIn this lesson we find volumes with semicircular and circular cross sections whose diameter lies across the base.",
    "当每个截面都是直径 $s(x)$ 横跨底面的圆时，半径为 $\\frac{s}{2}$，面积为 $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面，\n\n$$V = \\frac{\\pi}{4}\\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{\\pi}{4} \\cdot \\frac{8}{3} = \\frac{2\\pi}{3}$$\n\n检验：每个圆都在以同一直径为边的正方形内，占它的 $\\frac{\\pi}{4}$，所以体积是正方形截面立体 $\\frac{8}{3}$ 的 $\\frac{\\pi}{4}$，约为 $2.09$，比 $\\frac{8}{3} \\approx 2.67$ 稍小。\n\n本课我们求截面为半圆或圆、直径横跨底面的立体的体积。",
  ),
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "semicircular-cross-sections",
      title: t("Semicircular cross sections", "半圆形截面"),
      explanation: t(
        "When the base of each slice is the diameter of a semicircle, find its area from that diameter and integrate it along the axis. A semicircle with diameter $s$ has radius $\\frac{s}{2}$ and area $\\frac{1}{2}\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{8}s^{2}$, so $V = \\frac{\\pi}{8}\\int_{a}^{b} s(x)^{2} \\, dx$. For the base under $y = 2 - x$ on $[0, 2]$: $V = \\frac{\\pi}{8} \\cdot \\frac{8}{3} = \\frac{\\pi}{3}$.\n\nCheck: two semicircles make a circle, so the volume is half that of the circular-section solid, $\\frac{1}{2} \\cdot \\frac{2\\pi}{3} = \\frac{\\pi}{3}$.\n\n> **Watch out.** $s$ is the diameter. Using $s$ as the radius gives $\\frac{\\pi}{2}s^{2}$, four times too much.",
        "当每个截面的底边是半圆的直径时，由直径求出它的面积，再沿轴积分。直径为 $s$ 的半圆半径为 $\\frac{s}{2}$，面积为 $\\frac{1}{2}\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{8}s^{2}$，所以 $V = \\frac{\\pi}{8}\\int_{a}^{b} s(x)^{2} \\, dx$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面：$V = \\frac{\\pi}{8} \\cdot \\frac{8}{3} = \\frac{\\pi}{3}$。\n\n检验：两个半圆合成一个圆，所以体积是圆形截面立体的一半，$\\frac{1}{2} \\cdot \\frac{2\\pi}{3} = \\frac{\\pi}{3}$。\n\n> **注意。** $s$ 是直径。把 $s$ 当作半径会得到 $\\frac{\\pi}{2}s^{2}$，大了四倍。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("semicircles with diameter in the base", "直径在底面上的半圆"),
          factor: Q.of(1, 8),
          symbol: "\\pi",
          area: "\\frac{\\pi}{8}s^{2}",
          slips: [
            {
              factor: Q.of(1, 2),
              why: t(
                "This uses $s$ as the radius; $s$ is the diameter, so the radius is $\\frac{s}{2}$.",
                "这里把 $s$ 当作半径；$s$ 是直径，半径为 $\\frac{s}{2}$。",
              ),
            },
            {
              factor: Q.of(1, 4),
              why: t(
                "This is the area of a whole circle; a semicircle has half of it, $\\frac{\\pi}{8}s^{2}$.",
                "这是整个圆的面积；半圆只有它的一半，$\\frac{\\pi}{8}s^{2}$。",
              ),
            },
          ],
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "circular-cross-sections",
      figure: calculusDrawings4["volumes-of-solids-with-circular-cross-sections#circular-cross-sections"],
      title: t("Circular cross sections", "圆形截面"),
      explanation: t(
        "Each slice is a full circle whose diameter spans the base region, so its area is $\\frac{\\pi}{4}$ times the square of that length. A circle with diameter $s$ has area $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$, so $V = \\frac{\\pi}{4}\\int_{a}^{b} s(x)^{2} \\, dx$. For the base under $y = 2 - x$ on $[0, 2]$: $V = \\frac{\\pi}{4} \\cdot \\frac{8}{3} = \\frac{2\\pi}{3}$.\n\nCheck: each circle fits inside the square on its diameter, so the volume must be less than the square-section volume $\\frac{8}{3} \\approx 2.67$; indeed $\\frac{2\\pi}{3} \\approx 2.09$.\n\n> **Watch out.** Halve the diameter before squaring: $\\pi s^{2}$ treats $s$ as the radius and is four times too large.",
        "每个截面都是一个整圆，它的直径横跨底面区域，所以面积是 $\\frac{\\pi}{4}$ 乘以这个长度的平方。直径为 $s$ 的圆面积为 $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$，所以 $V = \\frac{\\pi}{4}\\int_{a}^{b} s(x)^{2} \\, dx$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面：$V = \\frac{\\pi}{4} \\cdot \\frac{8}{3} = \\frac{2\\pi}{3}$。\n\n检验：每个圆都在以其直径为边的正方形内，所以体积必定小于正方形截面立体的体积 $\\frac{8}{3} \\approx 2.67$；确实 $\\frac{2\\pi}{3} \\approx 2.09$。\n\n> **注意。** 先把直径减半再平方：$\\pi s^{2}$ 把 $s$ 当成了半径，大了四倍。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("circles with diameter in the base", "直径在底面上的圆"),
          factor: Q.of(1, 4),
          symbol: "\\pi",
          area: "\\frac{\\pi}{4}s^{2}",
          slips: [
            {
              factor: Q.one,
              why: t(
                "This uses $s$ as the radius; $s$ is the diameter, so the radius is $\\frac{s}{2}$.",
                "这里把 $s$ 当作半径；$s$ 是直径，半径为 $\\frac{s}{2}$。",
              ),
            },
            {
              factor: Q.of(1, 8),
              why: t(
                "This is the area of a semicircle; a whole circle of diameter $s$ has area $\\frac{\\pi}{4}s^{2}$.",
                "这是半圆的面积；直径为 $s$ 的整圆面积为 $\\frac{\\pi}{4}s^{2}$。",
              ),
            },
          ],
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
  ],
};

/** calculusIIAreaTopics are the topics of Calculus II modules 2.8–2.9. */
export const calculusIIAreaTopics: readonly TopicDef[] = [
  integratingRatesOfChange,
  integratingDensityFunctions,
  theAverageValueOfAFunction,
  theAreaBetweenCurvesExpressedAsFunctionsOfX,
  theAreaBetweenCurvesExpressedAsFunctionsOfY,
  findingAreasBetweenCurvesThatIntersectAtMoreThanTwoPoints,
  theArcLengthOfAPlanarCurve,
  volumesOfSolidsWithSquareCrossSections,
  volumesOfSolidsWithRectangularCrossSections,
  volumesOfSolidsWithTriangularCrossSections,
  volumesOfSolidsWithCircularCrossSections,
];
