import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { fac, type Poly, pAt, pLatex } from "./calculus-common.ts";
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
  prerequisites: ["the-fundamental-theorem-of-calculus", "rates-of-change-in-applied-contexts"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-an-amount-from-its-rate",
      title: t("Finding an amount from its rate", "由变化率求总量"),
      explanation: t(
        "If $Q'(t) = r(t)$, the fundamental theorem gives the net change theorem:\n\n$$Q(T) = Q(0) + \\int_{0}^{T} r(t) \\, dt.$$\n\nFor example, if water flows in at $r(t) = 2t + 3$ liters per minute and the tank starts with $10$ liters, after $4$ minutes it holds $10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + 28 = 38$ liters.",
        "若 $Q'(t) = r(t)$，由微积分基本定理得净变化定理：\n\n$$Q(T) = Q(0) + \\int_{0}^{T} r(t) \\, dt。$$\n\n例如水以 $r(t) = 2t + 3$ 升/分钟流入，水箱原有 $10$ 升，$4$ 分钟后水箱中有 $10 + \\int_{0}^{4} (2t + 3) \\, dt = 10 + 28 = 38$ 升。",
      ),
      generate(rng) {
        const p = positivePoly(rng);
        const T = rng.int(1, 6);
        const w = rng.int(5, 60);
        const r = pLatex(p, "t");
        const c = rng.pick(rateContexts)(r, w, T);
        const net = intQ(p, 0, T);
        const answer = net.add(Q.of(w));
        return numberProblem({
          prompt: t(`${c.rate.en} ${c.start.en} ${c.ask.en}`, `${c.rate["zh-CN"]}${c.start["zh-CN"]}${c.ask["zh-CN"]}`),
          answer,
          wrong: [net, Q.of(w + pAt(p, T)), Q.of(w + pAt(p, T) * T)],
          solution: t(
            `The amount is $${w} + ${int(0, T, `(${r})`, "t")} = ${w} + \\Big[${antiderivativeLatex(p).replace(/x/g, "t")}\\Big]_{0}^{${T}} = ${w} + ${net.toLatex()} = ${answer.toLatex()}$.`,
            `总量为 $${w} + ${int(0, T, `(${r})`, "t")} = ${w} + \\Big[${antiderivativeLatex(p).replace(/x/g, "t")}\\Big]_{0}^{${T}} = ${w} + ${net.toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "net-change-with-inflow-and-outflow",
      title: t("Net change with inflow and outflow", "有流入与流出时的净变化"),
      explanation: t(
        "When a quantity has an inflow rate $R(t)$ and an outflow rate $L(t)$, its rate of change is $R(t) - L(t)$, so the change from $t = a$ to $t = b$ is\n\n$$\\int_{a}^{b} \\left(R(t) - L(t)\\right) dt.$$\n\nA negative answer means the quantity decreased.",
        "若某量的流入速率为 $R(t)$、流出速率为 $L(t)$，则它的变化率为 $R(t) - L(t)$，从 $t = a$ 到 $t = b$ 的变化量为\n\n$$\\int_{a}^{b} \\left(R(t) - L(t)\\right) dt。$$\n\n结果为负说明该量减少了。",
      ),
      generate(rng) {
        const R: Poly = [rng.int(1, 8), rng.int(0, 4), rng.int(0, 2)];
        const L: Poly = [rng.int(2, 12), rng.int(0, 3)];
        const a = rng.int(0, 3);
        const b = a + rng.int(1, 4);
        const d = pSum(R, pScale(L, -1));
        const answer = intQ(d, a, b);
        const [rl, ll] = [pLatex(R, "t"), pLatex(L, "t")];
        return numberProblem({
          prompt: t(
            `Water flows into a tank at $R(t) = ${rl}$ liters per minute and drains out at $L(t) = ${ll}$ liters per minute, where $t$ is in minutes. By how many liters does the amount of water change from $t = ${a}$ to $t = ${b}$? (Give a negative number for a decrease.)`,
            `水以 $R(t) = ${rl}$ 升/分钟流入水箱，同时以 $L(t) = ${ll}$ 升/分钟流出，$t$ 的单位为分钟。从 $t = ${a}$ 到 $t = ${b}$，水量变化了多少升？（减少时填负数。）`,
          ),
          answer,
          wrong: [intQ(R, a, b), answer.neg(), Q.of(pAt(d, b) - pAt(d, a))],
          solution: t(
            `The change is $${int(a, b, `(${pLatex(d, "t")})`, "t")} = ${answer.toLatex()}$ liters.`,
            `变化量为 $${int(a, b, `(${pLatex(d, "t")})`, "t")} = ${answer.toLatex()}$ 升。`,
          ),
        });
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
  prerequisites: ["integrating-rates-of-change"],
  encompasses: [{ topic: "integrating-rates-of-change", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-density",
      title: t("Linear density", "线密度"),
      explanation: t(
        "If a rod lying along $[0, L]$ has density $\\rho(x)$ kilograms per meter, a short piece of length $\\Delta x$ has mass about $\\rho(x)\\Delta x$. Adding the pieces gives the total mass\n\n$$m = \\int_{0}^{L} \\rho(x) \\, dx.$$",
        "若位于 $[0, L]$ 上的细杆密度为 $\\rho(x)$ 千克/米，长为 $\\Delta x$ 的一小段质量约为 $\\rho(x)\\Delta x$。把各段相加，得总质量\n\n$$m = \\int_{0}^{L} \\rho(x) \\, dx。$$",
      ),
      generate(rng) {
        const p = positivePoly(rng);
        const L = rng.int(1, 6);
        const answer = intQ(p, 0, L);
        const rod = rng.bool();
        return numberProblem({
          prompt: rod
            ? t(
                `A rod of length $${L}$ meters has density $\\rho(x) = ${pLatex(p)}$ kilograms per meter, where $x$ is the distance in meters from one end. Find the mass of the rod in kilograms.`,
                `一根长 $${L}$ 米的细杆，密度为 $\\rho(x) = ${pLatex(p)}$ 千克/米，$x$ 为到一端的距离（米）。求细杆的质量（千克）。`,
              )
            : t(
                `Along a road, the population density is $\\rho(x) = ${pLatex(p)}$ hundred people per kilometer, where $x$ is the distance in kilometers from the town hall. How many hundred people live along the first $${L}$ kilometers?`,
                `沿一条公路，人口密度为 $\\rho(x) = ${pLatex(p)}$ 百人/千米，$x$ 为到市政厅的距离（千米）。前 $${L}$ 千米内住着多少百人？`,
              ),
          answer,
          wrong: [Q.of(pAt(p, L) * L), Q.of(pAt(p, L)), Q.of(p.reduce((s, c, i) => s + c * L ** (i + 1), 0))],
          solution: t(
            `The total is $${int(0, L, `(${pLatex(p)})`)} = \\Big[${antiderivativeLatex(p)}\\Big]_{0}^{${L}} = ${answer.toLatex()}$.`,
            `总量为 $${int(0, L, `(${pLatex(p)})`)} = \\Big[${antiderivativeLatex(p)}\\Big]_{0}^{${L}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "radial-density",
      title: t("Radial density", "径向密度"),
      explanation: t(
        "If the density of a circular region depends only on the distance $r$ from the center, cut it into thin rings. A ring of radius $r$ and width $\\Delta r$ has area about $2\\pi r\\Delta r$, so the total is\n\n$$\\int_{0}^{R} 2\\pi r\\rho(r) \\, dr.$$\n\nFor example, with $\\rho(r) = 3 - r$ thousand people per square kilometer within $3$ km of the center, the population is $2\\pi\\int_{0}^{3} (3r - r^{2}) \\, dr = 9\\pi$ thousand.",
        "若圆形区域的密度只与到中心的距离 $r$ 有关，就把它切成细圆环。半径为 $r$、宽为 $\\Delta r$ 的圆环面积约为 $2\\pi r\\Delta r$，所以总量为\n\n$$\\int_{0}^{R} 2\\pi r\\rho(r) \\, dr。$$\n\n例如在距中心 $3$ 千米内 $\\rho(r) = 3 - r$ 千人/平方千米，则人口为 $2\\pi\\int_{0}^{3} (3r - r^{2}) \\, dr = 9\\pi$ 千人。",
      ),
      generate(rng) {
        const R = rng.int(1, 5);
        const c = rng.int(1, 4);
        // Either c(R − r), which falls to 0 at the edge, or a density with non-negative coefficients.
        const rho: Poly = rng.bool() ? [c * R, -c] : positivePoly(rng);
        const ring = pMul([0, 1], rho);
        const value = intQ(ring, 0, R).mul(Q.of(2));
        return exactProblem(
          t(
            `The population density of a city is $\\rho(r) = ${pLatex(rho, "r")}$ thousand people per square kilometer, where $r$ is the distance in kilometers from the center. Find the population, in thousands, within $${R}$ ${R === 1 ? "kilometer" : "kilometers"} of the center. Give an exact answer.`,
            `某城市的人口密度为 $\\rho(r) = ${pLatex(rho, "r")}$ 千人/平方千米，$r$ 为到市中心的距离（千米）。求距市中心 $${R}$ 千米内的人口（千人），给出精确值。`,
          ),
          times(value, "\\pi"),
          [times(intQ(rho, 0, R).mul(Q.of(2)), "\\pi"), intQ(ring, 0, R).toLatex(), times(intQ(ring, 0, R), "\\pi")],
          `Thin rings give $${int(0, R, `2\\pi r(${pLatex(rho, "r")})`, "r")} = 2\\pi${int(0, R, `(${pLatex(ring, "r")})`, "r")} = ${times(value, "\\pi")}$ thousand people.`,
          `用细圆环得 $${int(0, R, `2\\pi r(${pLatex(rho, "r")})`, "r")} = 2\\pi${int(0, R, `(${pLatex(ring, "r")})`, "r")} = ${times(value, "\\pi")}$ 千人。`,
        );
      },
    },
  ],
};

/** AverageCase is a transcendental function with its exact average value on an interval. */
interface AverageCase {
  readonly f: string;
  readonly a: string;
  readonly b: string;
  readonly answer: string;
  readonly wrong: readonly string[];
  readonly work: string;
}

/** theAverageValueOfAFunction computes 1/(b − a) times the integral. */
export const theAverageValueOfAFunction: TopicDef = {
  id: "the-average-value-of-a-function",
  title: t("The Average Value of a Function", "函数的平均值"),
  summary: t("The average value of f on [a, b] is the integral divided by b − a.", "f 在 [a, b] 上的平均值是积分除以 b − a。"),
  prerequisites: ["applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions"],
  encompasses: [{ topic: "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "average-values-of-polynomials",
      title: t("Average values of polynomials", "多项式的平均值"),
      explanation: t(
        "The average value of $f$ on $[a, b]$ is\n\n$$f_{\\text{avg}} = \\frac{1}{b - a}\\int_{a}^{b} f(x) \\, dx.$$\n\nIt is the height of the rectangle on $[a, b]$ with the same area as the region under $f$. For example, the average of $x^{2}$ on $[0, 3]$ is $\\frac{1}{3} \\cdot 9 = 3$.",
        "$f$ 在 $[a, b]$ 上的平均值为\n\n$$f_{\\text{avg}} = \\frac{1}{b - a}\\int_{a}^{b} f(x) \\, dx。$$\n\n它是 $[a, b]$ 上与 $f$ 下方区域面积相等的矩形的高。例如 $x^{2}$ 在 $[0, 3]$ 上的平均值为 $\\frac{1}{3} \\cdot 9 = 3$。",
      ),
      generate(rng) {
        const deg = rng.int(1, 3);
        const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-5, 5));
        p[deg] = rng.nonZero(-3, 3);
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 4);
        const I = intQ(p, a, b);
        const answer = I.div(Q.of(b - a));
        return numberProblem({
          prompt: t(
            `Find the average value of $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(p)}$ 在 $[${a}, ${b}]$ 上的平均值。`,
          ),
          answer,
          wrong: [I, Q.of(pAt(p, a) + pAt(p, b), 2), I.div(Q.of(b + a === 0 ? 2 * b : b + a))],
          solution: t(
            `$${int(a, b, `(${pLatex(p)})`)} = ${I.toLatex()}$, and dividing by $${b} - ${a < 0 ? `(${a})` : a} = ${b - a}$ gives $${answer.toLatex()}$.`,
            `$${int(a, b, `(${pLatex(p)})`)} = ${I.toLatex()}$，除以 $${b} - ${a < 0 ? `(${a})` : a} = ${b - a}$ 得 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "average-values-of-other-functions",
      title: t("Average values of other functions", "其他函数的平均值"),
      explanation: t(
        "The same formula applies to any integrable function. For example, the average of $\\sin x$ on $[0, \\pi]$ is $\\frac{1}{\\pi}\\left[-\\cos x\\right]_{0}^{\\pi} = \\frac{2}{\\pi}$, and the average of $\\frac{1}{x}$ on $[1, e]$ is $\\frac{1}{e - 1}$.",
        "同样的公式适用于任何可积函数。例如 $\\sin x$ 在 $[0, \\pi]$ 上的平均值为 $\\frac{1}{\\pi}\\left[-\\cos x\\right]_{0}^{\\pi} = \\frac{2}{\\pi}$，$\\frac{1}{x}$ 在 $[1, e]$ 上的平均值为 $\\frac{1}{e - 1}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(3, 7);
        const kk = coef(Q.of(k));
        const cases: AverageCase[] = [
          {
            f: `${kk}\\sin x`,
            a: "0",
            b: "\\pi",
            answer: `\\frac{${2 * k}}{\\pi}`,
            wrong: [`${2 * k}`, `\\frac{${k}}{\\pi}`, "0"],
            work: `${int(0, "\\pi", `${kk}\\sin x`)} = ${2 * k}`,
          },
          {
            f: `${kk}\\cos x`,
            a: "0",
            b: "\\frac{\\pi}{2}",
            answer: `\\frac{${2 * k}}{\\pi}`,
            wrong: [`${k}`, `\\frac{${k}}{\\pi}`, `\\frac{${k}}{2}`],
            work: `${int(0, "\\frac{\\pi}{2}", `${kk}\\cos x`)} = ${k}`,
          },
          {
            f: `${kk}e^{x}`,
            a: "0",
            b: `\\ln ${m}`,
            answer: `\\frac{${k * (m - 1)}}{\\ln ${m}}`,
            wrong: [`${k * (m - 1)}`, `\\frac{${k * m}}{\\ln ${m}}`, `\\frac{${k * (m - 1)}}{${m}}`],
            work: `${int(0, `\\ln ${m}`, `${kk}e^{x}`)} = ${k}(${m} - 1) = ${k * (m - 1)}`,
          },
          {
            f: `\\frac{${k}}{x}`.replace("\\frac{-", "-\\frac{"),
            a: "1",
            b: `${m}`,
            answer: `${coef(Q.of(k, m - 1))}\\ln ${m}`,
            wrong: [`${coef(Q.of(k))}\\ln ${m}`, `${coef(Q.of(k, m))}\\ln ${m}`, Q.of(k, m - 1).toLatex()],
            work: `${int(1, m, `\\frac{${k}}{x}`.replace("\\frac{-", "-\\frac{"))} = ${coef(Q.of(k))}\\ln ${m}`,
          },
        ];
        const c = rng.pick(cases);
        return exactProblem(
          t(
            `Find the average value of $${c.f}$ on $\\left[${c.a}, ${c.b}\\right]$. Give an exact answer.`,
            `求 $${c.f}$ 在 $\\left[${c.a}, ${c.b}\\right]$ 上的平均值，给出精确值。`,
          ),
          c.answer,
          c.wrong,
          `$${c.work}$. Dividing by the length of the interval, $${c.b}${c.a === "0" ? "" : ` - ${c.a}`}$, gives $${c.answer}$.`,
          `$${c.work}$。除以区间长度 $${c.b}${c.a === "0" ? "" : ` - ${c.a}`}$，得 $${c.answer}$。`,
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

/** theAreaBetweenCurvesExpressedAsFunctionsOfX integrates top minus bottom. */
export const theAreaBetweenCurvesExpressedAsFunctionsOfX: TopicDef = {
  id: "the-area-between-curves-expressed-as-functions-of-x",
  title: t("The Area Between Curves Expressed as Functions of X", "以 x 的函数表示的曲线之间的面积"),
  summary: t("Integrate the upper curve minus the lower curve between their intersections.", "在交点之间对上方曲线减下方曲线积分。"),
  prerequisites: ["the-area-bounded-by-a-curve-and-the-x-axis"],
  encompasses: [{ topic: "the-area-bounded-by-a-curve-and-the-x-axis", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-enclosed-by-two-curves",
      title: t("Areas enclosed by two curves", "两条曲线围成的面积"),
      explanation: t(
        "If $f(x) \\ge g(x)$ on $[a, b]$, the area between the curves is\n\n$$\\int_{a}^{b} \\left(f(x) - g(x)\\right) dx.$$\n\nFor a region enclosed by two curves, the limits are the $x$-coordinates of the intersection points, found by solving $f(x) = g(x)$. For example, $y = x$ and $y = x^{2}$ meet at $x = 0$ and $x = 1$, with $x \\ge x^{2}$ between, so the area is $\\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{6}$.",
        "若在 $[a, b]$ 上 $f(x) \\ge g(x)$，两曲线之间的面积为\n\n$$\\int_{a}^{b} \\left(f(x) - g(x)\\right) dx。$$\n\n对两曲线围成的区域，积分限是交点的 $x$ 坐标，由 $f(x) = g(x)$ 解出。例如 $y = x$ 与 $y = x^{2}$ 交于 $x = 0$ 和 $x = 1$，其间 $x \\ge x^{2}$，所以面积为 $\\int_{0}^{1} (x - x^{2}) \\, dx = \\frac{1}{6}$。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 2);
        const r2 = r1 + rng.int(1, 4);
        const c = rng.int(1, 3);
        const g = lowerCurve(rng);
        const d = downward(c, r1, r2);
        const f = pSum(g, d);
        const answer = Q.of(c * (r2 - r1) ** 3, 6);
        const [first, second] = twoCurves(rng, `y = ${pLatex(f)}`, `y = ${pLatex(g)}`);
        return numberProblem({
          prompt: t(`Find the area of the region enclosed by $${first}$ and $${second}$.`, `求 $${first}$ 与 $${second}$ 围成的区域面积。`),
          answer,
          wrong: [answer.mul(Q.of(2)), intQ(f, r1, r2), Q.of(c * (r2 - r1) ** 2, 2)],
          solution: t(
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}$, which is zero at $x = ${r1}$ and $x = ${r2}$ and positive between them. The area is $${int(r1, r2, `(${pLatex(d)})`)} = ${answer.toLatex()}$.`,
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}$，它在 $x = ${r1}$ 和 $x = ${r2}$ 处为零，其间为正。面积为 $${int(r1, r2, `(${pLatex(d)})`)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "areas-between-curves-over-an-interval",
      title: t("Areas between curves over an interval", "区间上两曲线之间的面积"),
      explanation: t(
        "When the region is bounded by vertical lines $x = a$ and $x = b$, those are the limits. First decide which curve is on top. For example, $x^{2} + 1 > x$ for every $x$, so the area between $y = x^{2} + 1$ and $y = x$ from $x = 0$ to $x = 3$ is $\\int_{0}^{3} (x^{2} - x + 1) \\, dx = \\frac{15}{2}$.",
        "当区域由竖直线 $x = a$ 与 $x = b$ 围住时，它们就是积分限。先判断哪条曲线在上方。例如对所有 $x$ 都有 $x^{2} + 1 > x$，所以从 $x = 0$ 到 $x = 3$ 之间 $y = x^{2} + 1$ 与 $y = x$ 之间的面积为 $\\int_{0}^{3} (x^{2} - x + 1) \\, dx = \\frac{15}{2}$。",
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
        const [first, second] = twoCurves(rng, `y = ${pLatex(f)}`, `y = ${pLatex(g)}`);
        return numberProblem({
          prompt: t(
            `Find the area of the region between $${first}$ and $${second}$ from $x = ${a}$ to $x = ${b}$.`,
            `求从 $x = ${a}$ 到 $x = ${b}$ 之间 $${first}$ 与 $${second}$ 之间的区域面积。`,
          ),
          answer,
          wrong: [intQ(f, a, b), intQ(g, a, b), answer.neg()],
          solution: t(
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}${h === 0 ? "" : ` = ${fac(h)}^{2} + ${m}`} > 0$, so $y = ${pLatex(f)}$ is on top. The area is $${int(a, b, `(${pLatex(d)})`)} = ${answer.toLatex()}$.`.replace(
              "(x)^{2}",
              "x^{2}",
            ),
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}${h === 0 ? "" : ` = ${fac(h)}^{2} + ${m}`} > 0$，所以 $y = ${pLatex(f)}$ 在上方。面积为 $${int(a, b, `(${pLatex(d)})`)} = ${answer.toLatex()}$。`.replace(
              "(x)^{2}",
              "x^{2}",
            ),
          ),
        });
      },
    },
  ],
};

/** theAreaBetweenCurvesExpressedAsFunctionsOfY integrates right minus left with respect to y. */
export const theAreaBetweenCurvesExpressedAsFunctionsOfY: TopicDef = {
  id: "the-area-between-curves-expressed-as-functions-of-y",
  title: t("The Area Between Curves Expressed as Functions of Y", "以 y 的函数表示的曲线之间的面积"),
  summary: t("Integrate the right curve minus the left curve with respect to y.", "对 y 积分，被积函数为右侧曲线减左侧曲线。"),
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
        "When curves are given as $x = f(y)$ and $x = g(y)$ with $f(y) \\ge g(y)$ for $c \\le y \\le d$, slice horizontally:\n\n$$\\text{Area} = \\int_{c}^{d} \\left(f(y) - g(y)\\right) dy,$$\n\nthe right curve minus the left curve. For example, $x = y^{2}$ and $x = y + 2$ meet at $y = -1$ and $y = 2$, so the area is $\\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\frac{9}{2}$.",
        "当曲线写成 $x = f(y)$ 与 $x = g(y)$，且在 $c \\le y \\le d$ 上 $f(y) \\ge g(y)$ 时，横向切片：\n\n$$\\text{面积} = \\int_{c}^{d} \\left(f(y) - g(y)\\right) dy，$$\n\n即右侧曲线减左侧曲线。例如 $x = y^{2}$ 与 $x = y + 2$ 交于 $y = -1$ 和 $y = 2$，所以面积为 $\\int_{-1}^{2} (y + 2 - y^{2}) \\, dy = \\frac{9}{2}$。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 2);
        const r2 = r1 + rng.int(1, 4);
        const c = rng.int(1, 3);
        const g = lowerCurve(rng);
        const d = downward(c, r1, r2);
        const f = pSum(g, d);
        const answer = Q.of(c * (r2 - r1) ** 3, 6);
        const [first, second] = twoCurves(rng, `x = ${pLatex(f, "y")}`, `x = ${pLatex(g, "y")}`);
        return numberProblem({
          prompt: t(`Find the area of the region enclosed by $${first}$ and $${second}$.`, `求 $${first}$ 与 $${second}$ 围成的区域面积。`),
          answer,
          wrong: [answer.mul(Q.of(2)), intQ(f, r1, r2), Q.of(c * (r2 - r1) ** 2, 2)],
          solution: t(
            `$(${pLatex(f, "y")}) - (${pLatex(g, "y")}) = ${pLatex(d, "y")}$, which is zero at $y = ${r1}$ and $y = ${r2}$ and positive between them, so $x = ${pLatex(f, "y")}$ is on the right. The area is $${int(r1, r2, `(${pLatex(d, "y")})`, "y")} = ${answer.toLatex()}$.`,
            `$(${pLatex(f, "y")}) - (${pLatex(g, "y")}) = ${pLatex(d, "y")}$，它在 $y = ${r1}$ 和 $y = ${r2}$ 处为零，其间为正，所以 $x = ${pLatex(f, "y")}$ 在右侧。面积为 $${int(r1, r2, `(${pLatex(d, "y")})`, "y")} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "choosing-to-integrate-with-respect-to-y",
      title: t("Choosing to integrate with respect to y", "选择对 y 积分"),
      explanation: t(
        "Some regions are much simpler to slice horizontally. The region bounded by the parabola $x = y^{2}$ and the line $x = 4$ would need two square-root curves $y = \\pm\\sqrt{x}$ in terms of $x$, but in terms of $y$ it runs from $y = -2$ to $y = 2$ between $x = y^{2}$ and $x = 4$:\n\n$$\\int_{-2}^{2} (4 - y^{2}) \\, dy = \\frac{32}{3}.$$",
        "有些区域横向切片要简单得多。由抛物线 $x = y^{2}$ 与直线 $x = 4$ 围成的区域，若对 $x$ 积分需要两条曲线 $y = \\pm\\sqrt{x}$，而对 $y$ 积分时，它从 $y = -2$ 到 $y = 2$，位于 $x = y^{2}$ 与 $x = 4$ 之间：\n\n$$\\int_{-2}^{2} (4 - y^{2}) \\, dy = \\frac{32}{3}。$$",
      ),
      generate(rng) {
        const c = rng.int(1, 4);
        const n = rng.int(1, 4);
        const s = rng.int(-4, 4);
        const b = c * n * n + s;
        const answer = Q.of(4 * c * n ** 3, 3);
        return numberProblem({
          prompt: t(
            `Find the area of the region bounded by $x = ${pLatex([s, 0, c], "y")}$ and the line $x = ${b}$.`,
            `求由 $x = ${pLatex([s, 0, c], "y")}$ 与直线 $x = ${b}$ 围成的区域面积。`,
          ),
          answer,
          wrong: [answer.div(Q.of(2)), Q.of(2 * c * n ** 3, 3), Q.of(2 * b * n)],
          solution: t(
            `The curves meet where $${pLatex([s, 0, c], "y")} = ${b}$, so $y = \\pm ${n}$. The area is $${int(-n, n, `(${pLatex([b - s, 0, -c], "y")})`, "y")} = ${answer.toLatex()}$.`,
            `两曲线交于 $${pLatex([s, 0, c], "y")} = ${b}$，即 $y = \\pm ${n}$。面积为 $${int(-n, n, `(${pLatex([b - s, 0, -c], "y")})`, "y")} = ${answer.toLatex()}$。`,
          ),
        });
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
        "When the curves cross more than twice, which curve is on top changes at each crossing. Integrate $|f(x) - g(x)|$ by splitting at the intersections:\n\n$$\\text{Area} = \\left|\\int_{r_{1}}^{r_{2}} (f - g) \\, dx\\right| + \\left|\\int_{r_{2}}^{r_{3}} (f - g) \\, dx\\right|.$$\n\nIntegrating $f - g$ straight from $r_{1}$ to $r_{3}$ lets the pieces cancel.",
        "当曲线相交两次以上时，在每个交点处上下位置都会改变。在交点处拆开，对 $|f(x) - g(x)|$ 积分：\n\n$$\\text{面积} = \\left|\\int_{r_{1}}^{r_{2}} (f - g) \\, dx\\right| + \\left|\\int_{r_{2}}^{r_{3}} (f - g) \\, dx\\right|。$$\n\n若直接从 $r_{1}$ 到 $r_{3}$ 对 $f - g$ 积分，各部分会相互抵消。",
      ),
      generate(rng) {
        const [r1, r2, r3] = threeRoots(rng);
        const k = rng.pick([1, -1, 2]);
        const d = pScale(pMul(pMul([-r1, 1], [-r2, 1]), [-r3, 1]), k);
        const g: Poly = [rng.int(-4, 4), rng.int(-3, 3)];
        const f = pSum(g, d);
        const [i1, i2] = [intQ(d, r1, r2), intQ(d, r2, r3)];
        const answer = i1.abs().add(i2.abs());
        const [first, second] = twoCurves(rng, `y = ${pLatex(f)}`, `y = ${pLatex(g)}`);
        return numberProblem({
          prompt: t(
            `Find the total area of the regions enclosed by $${first}$ and $${second}$.`,
            `求 $${first}$ 与 $${second}$ 围成的各区域的总面积。`,
          ),
          answer,
          wrong: [i1.add(i2).abs(), i1.add(i2), i1.abs().mul(Q.of(2))],
          solution: t(
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}$, which is zero at $x = ${r1}, ${r2}, ${r3}$. Then $${int(r1, r2, `(${pLatex(d)})`)} = ${i1.toLatex()}$ and $${int(r2, r3, `(${pLatex(d)})`)} = ${i2.toLatex()}$, so the area is $${i1.abs().toLatex()} + ${i2.abs().toLatex()} = ${answer.toLatex()}$.`,
            `$(${pLatex(f)}) - (${pLatex(g)}) = ${pLatex(d)}$，它在 $x = ${r1}, ${r2}, ${r3}$ 处为零。$${int(r1, r2, `(${pLatex(d)})`)} = ${i1.toLatex()}$，$${int(r2, r3, `(${pLatex(d)})`)} = ${i2.toLatex()}$，所以面积为 $${i1.abs().toLatex()} + ${i2.abs().toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "using-symmetry-for-areas-between-curves",
      title: t("Using symmetry for areas between curves", "利用对称性求曲线之间的面积"),
      explanation: t(
        "Look for symmetry to save work. $y = x^{3}$ and $y = 4x$ meet at $x = -2, 0, 2$; the two regions are mirror images through the origin, so the area is\n\n$$2\\int_{0}^{2} (4x - x^{3}) \\, dx = 2 \\cdot 4 = 8.$$\n\nLikewise $y = x^{4}$ and $y = m^{2}x^{2}$ enclose two regions that mirror each other across the $y$-axis.",
        "利用对称性可以减少计算。$y = x^{3}$ 与 $y = 4x$ 交于 $x = -2, 0, 2$；两块区域关于原点对称，所以面积为\n\n$$2\\int_{0}^{2} (4x - x^{3}) \\, dx = 2 \\cdot 4 = 8。$$\n\n同样，$y = x^{4}$ 与 $y = m^{2}x^{2}$ 围成的两块区域关于 $y$ 轴对称。",
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
        const inner = cubic ? pLatex([0, c * m * m, 0, -c]) : pLatex([0, 0, c * m * m, 0, -c]);
        const [first, second] = twoCurves(rng, `y = ${pLatex(f)}`, `y = ${pLatex(g)}`);
        return numberProblem({
          prompt: t(
            `Find the total area of the regions enclosed by $${first}$ and $${second}$.`,
            `求 $${first}$ 与 $${second}$ 围成的各区域的总面积。`,
          ),
          answer,
          wrong: [cubic ? Q.zero : half, half.mul(Q.of(4)), cubic ? half : answer.mul(Q.of(2))],
          solution: t(
            `The curves meet at $x = -${m}, 0, ${m}$, and the two regions are symmetric. On $[0, ${m}]$ the difference is $${inner}$, and $${int(0, m, `(${inner})`)} = ${half.toLatex()}$, so the total is $${answer.toLatex()}$.`,
            `两曲线交于 $x = -${m}, 0, ${m}$，两块区域对称。在 $[0, ${m}]$ 上两者之差为 $${inner}$，而 $${int(0, m, `(${inner})`)} = ${half.toLatex()}$，所以总面积为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** ArcCase is a curve whose arc-length integrand is a perfect square, with its exact length. */
interface ArcCase {
  readonly curve: string;
  readonly a: number;
  readonly b: number;
  readonly answer: string;
  readonly wrong: readonly string[];
  readonly work: string;
}

/** powerCurves are y = c·x^(3/2) with 1 + y'² = 1 + kx, and endpoints making 1 + kb a perfect square. */
const powerCurves: readonly { c: string; k: number; ends: readonly (readonly [number, number])[] }[] = [
  {
    c: "\\frac{2}{3}",
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
    k: 4,
    ends: [
      [2, 3],
      [6, 5],
      [12, 7],
    ],
  },
  {
    c: "2",
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
  prerequisites: ["integration-using-substitution"],
  encompasses: [{ topic: "integration-using-substitution", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-length-with-a-substitution",
      title: t("Arc length with a substitution", "用换元法求弧长"),
      explanation: t(
        "A short piece of the curve is nearly a straight segment of length $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$. Adding the pieces,\n\n$$L = \\int_{a}^{b} \\sqrt{1 + \\left(f'(x)\\right)^{2}} \\, dx.$$\n\nFor $y = \\frac{2}{3}x^{3/2}$, $f'(x) = x^{1/2}$, so $L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\left[(1 + x)^{3/2}\\right]_{0}^{3} = \\frac{14}{3}$.",
        "曲线上的一小段近似为长 $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}} = \\sqrt{1 + \\left(\\frac{\\Delta y}{\\Delta x}\\right)^{2}}\\Delta x$ 的线段。把各段相加，\n\n$$L = \\int_{a}^{b} \\sqrt{1 + \\left(f'(x)\\right)^{2}} \\, dx。$$\n\n对 $y = \\frac{2}{3}x^{3/2}$，$f'(x) = x^{1/2}$，所以 $L = \\int_{0}^{3} \\sqrt{1 + x} \\, dx = \\frac{2}{3}\\left[(1 + x)^{3/2}\\right]_{0}^{3} = \\frac{14}{3}$。",
      ),
      generate(rng) {
        const pc = rng.pick(powerCurves);
        const [b, q] = rng.pick(pc.ends);
        const s = rng.int(-5, 5);
        const answer = Q.of(2 * (q ** 3 - 1), 3 * pc.k);
        const inner = pc.k === 1 ? "1 + x" : `1 + ${pc.k}x`;
        return numberProblem({
          prompt: t(
            `Find the arc length of $y = ${pc.c}x^{3/2}${s === 0 ? "" : s > 0 ? ` + ${s}` : ` - ${-s}`}$ from $x = 0$ to $x = ${b}$.`,
            `求 $y = ${pc.c}x^{3/2}${s === 0 ? "" : s > 0 ? ` + ${s}` : ` - ${-s}`}$ 从 $x = 0$ 到 $x = ${b}$ 的弧长。`,
          ),
          answer,
          wrong: [Q.of(2 * q ** 3, 3 * pc.k), Q.of(q - 1), Q.of(2 * (q ** 3 - 1), 3)],
          solution: t(
            `$\\left(y'\\right)^{2} = ${pc.k === 1 ? "x" : `${pc.k}x`}$, so $L = ${int(0, b, `\\sqrt{${inner}}`)} = \\frac{2}{${3 * pc.k}}\\left[(${inner})^{3/2}\\right]_{0}^{${b}} = \\frac{2}{${3 * pc.k}}(${q ** 3} - 1) = ${answer.toLatex()}$.`,
            `$\\left(y'\\right)^{2} = ${pc.k === 1 ? "x" : `${pc.k}x`}$，所以 $L = ${int(0, b, `\\sqrt{${inner}}`)} = \\frac{2}{${3 * pc.k}}\\left[(${inner})^{3/2}\\right]_{0}^{${b}} = \\frac{2}{${3 * pc.k}}(${q ** 3} - 1) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "arc-length-with-a-perfect-square",
      title: t("Arc length with a perfect square", "利用完全平方求弧长"),
      explanation: t(
        "These curves are chosen so that one plus the square of the derivative is a perfect square, which removes the root and leaves a simple integral. Some curves are designed so that $1 + (f')^{2}$ is a perfect square. For $y = \\frac{x^{3}}{6} + \\frac{1}{2x}$, $f'(x) = \\frac{x^{2}}{2} - \\frac{1}{2x^{2}}$ and\n\n$$1 + (f')^{2} = \\frac{x^{4}}{4} + \\frac{1}{2} + \\frac{1}{4x^{4}} = \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right)^{2},$$\n\nso $L = \\int_{a}^{b} \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right) dx = \\left[\\frac{x^{3}}{6} - \\frac{1}{2x}\\right]_{a}^{b}$.",
        "这些曲线经过特别选择，使 1 加导数的平方是一个完全平方，从而去掉根号，只剩一个简单的积分。有些曲线经过设计，使 $1 + (f')^{2}$ 恰为完全平方。对 $y = \\frac{x^{3}}{6} + \\frac{1}{2x}$，$f'(x) = \\frac{x^{2}}{2} - \\frac{1}{2x^{2}}$，且\n\n$$1 + (f')^{2} = \\frac{x^{4}}{4} + \\frac{1}{2} + \\frac{1}{4x^{4}} = \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right)^{2}，$$\n\n所以 $L = \\int_{a}^{b} \\left(\\frac{x^{2}}{2} + \\frac{1}{2x^{2}}\\right) dx = \\left[\\frac{x^{3}}{6} - \\frac{1}{2x}\\right]_{a}^{b}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(a + 1, 5);
        const s = rng.int(-4, 4);
        const shift = s === 0 ? "" : s > 0 ? ` + ${s}` : ` - ${-s}`;
        const F1 = (x: number) => Q.of(x ** 3, 6).sub(Q.of(1, 2 * x));
        const F2 = (x: number) => Q.of(x ** 4, 8).sub(Q.of(1, 4 * x * x));
        const cases: ArcCase[] = [
          {
            curve: `\\frac{x^{3}}{6} + \\frac{1}{2x}${shift}`,
            a,
            b,
            answer: F1(b).sub(F1(a)).toLatex(),
            wrong: [
              Q.of(b ** 3 - a ** 3, 6)
                .add(Q.of(1, 2 * b))
                .sub(Q.of(1, 2 * a))
                .toLatex(),
              Q.of(b - a).toLatex(),
              Q.of(b ** 3 - a ** 3, 6).toLatex(),
            ],
            work: `\\sqrt{1 + (y')^{2}} = \\frac{x^{2}}{2} + \\frac{1}{2x^{2}}$, so $L = \\left[\\frac{x^{3}}{6} - \\frac{1}{2x}\\right]_{${a}}^{${b}}`,
          },
          {
            curve: `\\frac{x^{4}}{8} + \\frac{1}{4x^{2}}${shift}`,
            a,
            b,
            answer: F2(b).sub(F2(a)).toLatex(),
            wrong: [
              Q.of(b ** 4 - a ** 4, 8)
                .add(Q.of(1, 4 * b * b))
                .sub(Q.of(1, 4 * a * a))
                .toLatex(),
              Q.of(b - a).toLatex(),
              Q.of(b ** 4 - a ** 4, 8).toLatex(),
            ],
            work: `\\sqrt{1 + (y')^{2}} = \\frac{x^{3}}{2} + \\frac{1}{2x^{3}}$, so $L = \\left[\\frac{x^{4}}{8} - \\frac{1}{4x^{2}}\\right]_{${a}}^{${b}}`,
          },
          {
            curve: `\\frac{x^{2}}{8} - \\ln x${shift}`,
            a,
            b,
            answer: `${Q.of(b * b - a * a, 8).toLatex()} + \\ln ${Q.of(b, a).isInteger() ? Q.of(b, a).toLatex() : `\\left(${Q.of(b, a).toLatex()}\\right)`}`,
            wrong: [
              `${Q.of(b * b - a * a, 8).toLatex()} - \\ln ${Q.of(b, a).isInteger() ? Q.of(b, a).toLatex() : `\\left(${Q.of(b, a).toLatex()}\\right)`}`,
              Q.of(b * b - a * a, 8).toLatex(),
              `${Q.of(b * b - a * a, 8).toLatex()} + \\ln ${b}`,
            ],
            work: `\\sqrt{1 + (y')^{2}} = \\frac{x}{4} + \\frac{1}{x}$, so $L = \\left[\\frac{x^{2}}{8} + \\ln x\\right]_{${a}}^{${b}}`,
          },
        ];
        const c = rng.pick(cases);
        return exactProblem(
          t(
            `Find the arc length of $y = ${c.curve}$ from $x = ${c.a}$ to $x = ${c.b}$. Give an exact answer.`,
            `求 $y = ${c.curve}$ 从 $x = ${c.a}$ 到 $x = ${c.b}$ 的弧长，给出精确值。`,
          ),
          c.answer,
          c.wrong,
          `$${c.work} = ${c.answer}$.`,
          `$${c.work} = ${c.answer}$。`.replace("$, so $", "$，所以 $"),
        );
      },
    },
  ],
};

/** Base is the base of a solid: the width s(x) of the region, with ∫s and ∫s² over it. */
interface Base {
  readonly region: Text;
  readonly s: string;
  readonly limits: readonly [number, number];
  readonly intS: Q;
  readonly intS2: Q;
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
      limits: [0, b],
      intS: Q.of(m * b * b, 2),
      intS2: Q.of(m * m * b ** 3, 3),
    };
  }
  if (kind === 1) {
    const c = rng.int(1, 3);
    const m = rng.int(1, 3);
    const curve = pLatex([c * m * m, 0, -c]);
    return {
      region: t(`the region bounded by $y = ${curve}$ and the $x$-axis`, `由 $y = ${curve}$ 与 $x$ 轴围成的区域`),
      s: curve,
      limits: [-m, m],
      intS: Q.of(4 * c * m ** 3, 3),
      intS2: Q.of(16 * c * c * m ** 5, 15),
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
    limits: [0, b],
    intS: Q.of(2 * k * n ** 3, 3),
    intS2: Q.of(k * k * b * b, 2),
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
    limits: [0, m],
    intS: Q.of(c * m ** 3, 6),
    intS2: Q.of(c * c * m ** 5, 30),
  };
}

/** Section is a cross-section shape with its area as a multiple of the side squared. */
interface Section {
  readonly shape: Text;
  readonly factor: Q;
  readonly symbol: string;
  readonly area: string;
}

/** volumeProblem asks for the volume of a solid with known cross sections. */
function volumeProblem(base: Base, section: Section, square = true) {
  const [a, b] = base.limits;
  const value = square ? base.intS2.mul(section.factor) : base.intS.mul(section.factor);
  const answer = times(value, section.symbol);
  const prompt = t(
    `The base of a solid is ${base.region.en}. Cross sections perpendicular to the $x$-axis are ${section.shape.en}. Find the volume of the solid.${section.symbol === "" ? "" : " Give an exact answer."}`,
    `某立体的底面是${base.region["zh-CN"]}。垂直于 $x$ 轴的截面是${section.shape["zh-CN"]}。求该立体的体积${section.symbol === "" ? "" : "，给出精确值"}。`,
  );
  const integrand = square ? `(${base.s})^{2}` : `(${base.s})`;
  const en = `The side of a cross section is $s(x) = ${base.s}$ for $${a} \\le x \\le ${b}$, and its area is $${section.area}$. So $V = ${section.factor.eq(Q.one) ? "" : section.factor.toLatex()}${section.symbol}${int(a, b, integrand)} = ${answer}$.`;
  const zh = `截面的边长为 $s(x) = ${base.s}$（$${a} \\le x \\le ${b}$），面积为 $${section.area}$。所以 $V = ${section.factor.eq(Q.one) ? "" : section.factor.toLatex()}${section.symbol}${int(a, b, integrand)} = ${answer}$。`;
  const wrongValues = square
    ? [base.intS.mul(section.factor), base.intS2, base.intS2.mul(section.factor).mul(Q.of(2))]
    : [base.intS2.mul(section.factor), base.intS, value.mul(Q.of(2))];
  if (section.symbol === "") return numberProblem({ prompt, answer: value, wrong: wrongValues, solution: t(en, zh) });
  return exactProblem(prompt, answer, [...wrongValues.map((w) => times(w, section.symbol)), value.toLatex()], en, zh);
}

/** squares are square cross sections. */
const squares: Section = { shape: t("squares", "正方形"), factor: Q.one, symbol: "", area: "s^{2}" };

/** volumesOfSolidsWithSquareCrossSections integrates the area of square cross sections. */
export const volumesOfSolidsWithSquareCrossSections: TopicDef = {
  id: "volumes-of-solids-with-square-cross-sections",
  title: t("Volumes of Solids With Square Cross Sections", "截面为正方形的立体的体积"),
  summary: t("Integrate the area A(x) = s(x)² of square cross sections.", "对正方形截面的面积 A(x) = s(x)² 积分。"),
  prerequisites: ["the-area-between-curves-expressed-as-functions-of-x"],
  encompasses: [{ topic: "the-area-between-curves-expressed-as-functions-of-x", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "square-cross-sections-under-a-curve",
      title: t("Square cross sections under a curve", "曲线下方区域上的正方形截面"),
      explanation: t(
        "If the cross section of a solid at $x$ has area $A(x)$, slicing gives $V = \\int_{a}^{b} A(x) \\, dx$. When the base is a region in the plane and the cross sections perpendicular to the $x$-axis are squares, each side is the width $s(x)$ of the base at $x$, so $A(x) = s(x)^{2}$. For the base under $y = 2 - x$ on $[0, 2]$: $V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$.",
        "若立体在 $x$ 处的截面面积为 $A(x)$，切片可得 $V = \\int_{a}^{b} A(x) \\, dx$。当底面是平面区域、垂直于 $x$ 轴的截面是正方形时，每个正方形的边长就是底面在 $x$ 处的宽度 $s(x)$，所以 $A(x) = s(x)^{2}$。对 $[0, 2]$ 上 $y = 2 - x$ 下方的底面：$V = \\int_{0}^{2} (2 - x)^{2} \\, dx = \\frac{8}{3}$。",
      ),
      generate(rng) {
        return volumeProblem(singleCurveBase(rng), squares);
      },
    },
    {
      id: "square-cross-sections-between-two-curves",
      title: t("Square cross sections between two curves", "两曲线之间区域上的正方形截面"),
      explanation: t(
        "When the base lies between two curves, the side of each square is the top curve minus the bottom curve: $s(x) = f(x) - g(x)$. For the region between $y = x$ and $y = x^{2}$: $V = \\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\frac{1}{30}$.",
        "当底面位于两曲线之间时，正方形的边长是上方曲线减下方曲线：$s(x) = f(x) - g(x)$。对 $y = x$ 与 $y = x^{2}$ 之间的区域：$V = \\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\frac{1}{30}$。",
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
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rectangles-with-height-proportional-to-the-base",
      title: t("Rectangles with height proportional to the base", "高与底成比例的矩形"),
      explanation: t(
        "If each rectangular cross section has its base $s(x)$ across the region and height $h$ times its base, its area is $s \\cdot hs = hs^{2}$, so $V = h\\int_{a}^{b} s(x)^{2} \\, dx$.",
        "若每个矩形截面的底边 $s(x)$ 横跨区域、高是底边的 $h$ 倍，则面积为 $s \\cdot hs = hs^{2}$，所以 $V = h\\int_{a}^{b} s(x)^{2} \\, dx$。",
      ),
      generate(rng) {
        const h = rng.int(2, 4);
        const section: Section = {
          shape: t(`rectangles whose height is $${h}$ times the base`, `高为底边 $${h}$ 倍的矩形`),
          factor: Q.of(h),
          symbol: "",
          area: `s \\cdot ${h}s = ${h}s^{2}`,
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "rectangles-with-constant-height",
      title: t("Rectangles with constant height", "高为常数的矩形"),
      explanation: t(
        "If every rectangle has the same height $H$, its area is $Hs(x)$, and the volume is $H$ times the area of the base: $V = H\\int_{a}^{b} s(x) \\, dx$. The solid is a slab of constant thickness.",
        "若每个矩形的高都是 $H$，其面积为 $Hs(x)$，体积等于 $H$ 乘以底面面积：$V = H\\int_{a}^{b} s(x) \\, dx$。这个立体是厚度不变的板。",
      ),
      generate(rng) {
        const H = rng.int(2, 6);
        const section: Section = {
          shape: t(`rectangles of height $${H}$`, `高为 $${H}$ 的矩形`),
          factor: Q.of(H),
          symbol: "",
          area: `${H}s`,
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
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equilateral-triangle-cross-sections",
      title: t("Equilateral triangle cross sections", "等边三角形截面"),
      explanation: t(
        "Slice the solid perpendicular to the axis; each slice is a thin triangle whose area depends on its side, and adding up the slices gives the volume. An equilateral triangle with side $s$ has area $\\frac{\\sqrt{3}}{4}s^{2}$, so $V = \\frac{\\sqrt{3}}{4}\\int_{a}^{b} s(x)^{2} \\, dx$.",
        "垂直于轴把立体切成薄片；每一片是一个面积取决于边长的三角形，把所有薄片加起来就得到体积。边长为 $s$ 的等边三角形面积为 $\\frac{\\sqrt{3}}{4}s^{2}$，所以 $V = \\frac{\\sqrt{3}}{4}\\int_{a}^{b} s(x)^{2} \\, dx$。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("equilateral triangles", "等边三角形"),
          factor: Q.of(1, 4),
          symbol: "\\sqrt{3}",
          area: "\\frac{\\sqrt{3}}{4}s^{2}",
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "right-isosceles-triangle-cross-sections",
      title: t("Right isosceles triangle cross sections", "等腰直角三角形截面"),
      explanation: t(
        "For an isosceles right triangle with a leg $s$ in the base, the area is $\\frac{1}{2}s^{2}$. If instead the hypotenuse $s$ lies in the base, each leg is $\\frac{s}{\\sqrt{2}}$ and the area is $\\frac{1}{4}s^{2}$.",
        "若等腰直角三角形的一条直角边 $s$ 在底面上，面积为 $\\frac{1}{2}s^{2}$。若斜边 $s$ 在底面上，每条直角边为 $\\frac{s}{\\sqrt{2}}$，面积为 $\\frac{1}{4}s^{2}$。",
      ),
      generate(rng) {
        const leg = rng.bool();
        const section: Section = leg
          ? {
              shape: t("isosceles right triangles with one leg in the base", "一条直角边在底面上的等腰直角三角形"),
              factor: Q.of(1, 2),
              symbol: "",
              area: "\\frac{1}{2}s^{2}",
            }
          : {
              shape: t("isosceles right triangles with the hypotenuse in the base", "斜边在底面上的等腰直角三角形"),
              factor: Q.of(1, 4),
              symbol: "",
              area: "\\frac{1}{4}s^{2}",
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
  prerequisites: ["volumes-of-solids-with-square-cross-sections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "semicircular-cross-sections",
      title: t("Semicircular cross sections", "半圆形截面"),
      explanation: t(
        "When the base of each slice is the diameter of a semicircle, find its area from that diameter and integrate it along the axis. A semicircle with diameter $s$ has radius $\\frac{s}{2}$ and area $\\frac{1}{2}\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{8}s^{2}$, so $V = \\frac{\\pi}{8}\\int_{a}^{b} s(x)^{2} \\, dx$.",
        "当每个截面的底边是半圆的直径时，由直径求出它的面积，再沿轴积分。直径为 $s$ 的半圆半径为 $\\frac{s}{2}$，面积为 $\\frac{1}{2}\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{8}s^{2}$，所以 $V = \\frac{\\pi}{8}\\int_{a}^{b} s(x)^{2} \\, dx$。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("semicircles with diameter in the base", "直径在底面上的半圆"),
          factor: Q.of(1, 8),
          symbol: "\\pi",
          area: "\\frac{\\pi}{8}s^{2}",
        };
        return volumeProblem(rng.bool() ? singleCurveBase(rng) : twoCurveBase(rng), section);
      },
    },
    {
      id: "circular-cross-sections",
      title: t("Circular cross sections", "圆形截面"),
      explanation: t(
        "Each slice is a full circle whose diameter spans the base region, so its area is $\\frac{\\pi}{4}$ times the square of that length. A circle with diameter $s$ has area $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$, so $V = \\frac{\\pi}{4}\\int_{a}^{b} s(x)^{2} \\, dx$. Remember to halve the diameter before squaring.",
        "每个截面都是一个整圆，它的直径横跨底面区域，所以面积是 $\\frac{\\pi}{4}$ 乘以这个长度的平方。直径为 $s$ 的圆面积为 $\\pi\\left(\\frac{s}{2}\\right)^{2} = \\frac{\\pi}{4}s^{2}$，所以 $V = \\frac{\\pi}{4}\\int_{a}^{b} s(x)^{2} \\, dx$。注意先把直径减半再平方。",
      ),
      generate(rng) {
        const section: Section = {
          shape: t("circles with diameter in the base", "直径在底面上的圆"),
          factor: Q.of(1, 4),
          symbol: "\\pi",
          area: "\\frac{\\pi}{4}s^{2}",
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
