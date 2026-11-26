import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** round2 rounds a measured value to two decimal places. */
const round2 = (x: number): Q => Q.of(Math.round(x * 100), 100);

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer, repeats an earlier one, or is not positive. */
const apart = (answer: number | Q, mistakes: readonly Mistake[], positive = false): Mistake[] => {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  return mistakes.filter(
    (m, i, all) =>
      !q(m.value).eq(q(answer)) && all.findIndex((x) => q(x.value).eq(q(m.value))) === i && (!positive || q(m.value).sign() > 0),
  );
};

/** cq writes a rational coefficient before a symbol: "" for 1 and "-" for -1. */
const cq = (v: Q): string => (v.eq(Q.one) ? "" : v.eq(Q.of(-1)) ? "-" : v.toLatex());

/** parQ wraps a negative rational number in parentheses for use as a factor. */
const parQ = (v: Q): string => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());

// ---------------------------------------------------------------------------
// 2.5 Applications of First-Order ODEs
// ---------------------------------------------------------------------------

/** modelingMixtureProblemsWithFirstOrderSeparableOdes models inflow and outflow with pure liquid. */
export const modelingMixtureProblemsWithFirstOrderSeparableOdes: TopicDef = {
  id: "modeling-mixture-problems-with-first-order-separable-odes",
  title: t("Modeling Mixture Problems With First-Order Separable ODEs", "一阶可分离变量微分方程的混合问题建模"),
  summary: t(
    "When pure solvent enters a well-stirred tank and solution leaves at the same rate r, the amount of solute S(t) satisfies dS/dt = -(r/V) S.",
    "当纯溶剂以速率 r 流入充分混合的容器且混合液以相同速率 r 流出时，溶质质量 S(t) 满足可分离变量方程 dS/dt = -(r/V) S。",
  ),
  intro: t(
    "Take a $100$-liter tank holding $20$ kg of salt, flushed with pure water at $5$ L/min while the mixture drains at the same rate. The outflow carries salt at $5 \\cdot \\frac{S}{100} = \\frac{S}{20}$ kg/min, so $\\frac{dS}{dt} = -\\frac{S}{20}$ and $S = 20e^{-t/20}$. After $20$ minutes $S = 20e^{-1} \\approx 7.36$ kg.\n\nCheck: $S(0) = 20$, and $\\frac{dS}{dt} = -e^{-t/20} = -\\frac{S}{20}$.\n\nIn this lesson we model a tank flushed with pure liquid and find how much solute it holds.",
    "取一个装有 $20$ 千克盐的 $100$ 升水箱，用纯水以 $5$ 升/分冲洗，混合液以相同速率流出。流出液每分钟带走 $5 \\cdot \\frac{S}{100} = \\frac{S}{20}$ 千克盐，所以 $\\frac{dS}{dt} = -\\frac{S}{20}$，$S = 20e^{-t/20}$。$20$ 分钟后 $S = 20e^{-1} \\approx 7.36$ 千克。\n\n检验：$S(0) = 20$，并且 $\\frac{dS}{dt} = -e^{-t/20} = -\\frac{S}{20}$。\n\n本课我们为用纯液体冲洗的容器建模，并求其中溶质的含量。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables", "further-modeling-with-first-order-odes"],
  encompasses: [
    {
      topic: "solving-first-order-odes-using-separation-of-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "mixture-problems-with-equal-inflow-and-outflow-rates",
      title: t("Mixture problems with equal inflow and outflow rates", "流速相等的溶质稀释问题"),
      explanation: t(
        "For a tank with volume $V$ where pure solvent enters at rate $r$ and well-mixed solution exits at rate $r$, the solute amount satisfies $\\frac{dS}{dt} = -\\frac{r}{V}S$. At any instant when the rate of solute loss is $D$, the amount of solute present is $S = D \\frac{V}{r}$.\n\n> **Watch out.** The salt leaves at $\\frac{r}{V}S$, so $S = D \\cdot \\frac{V}{r}$, not $D \\cdot r$. For $V = 200$, $r = 4$ and $D = 3$ kg/min, $S = 3 \\cdot 50 = 150$ kg, not $12$.",
        "容积为 $V$ 的容器中，纯溶剂以速率 $r$ 流入，充分搅拌后的溶液以相同速率 $r$ 流出。溶质含量满足 $\\frac{dS}{dt} = -\\frac{r}{V}S$。当溶质流失速率为 $D$ 时，容器内现存溶质为 $S = D \\frac{V}{r}$。\n\n> **注意。** 盐以 $\\frac{r}{V}S$ 的速率流出，所以 $S = D \\cdot \\frac{V}{r}$，不是 $D \\cdot r$。对 $V = 200$，$r = 4$，$D = 3$ 千克/分，$S = 3 \\cdot 50 = 150$ 千克，不是 $12$。",
      ),
      generate(rng: Rng): Problem {
        const T = rng.int(10, 50); // V / r
        const r = rng.int(2, 8);
        const V = r * T;
        const D = rng.int(2, 25);
        const ans = D * T;
        return numberProblem({
          prompt: t(
            `A tank contains $${V}$ liters of salt solution. Pure water enters the tank at a rate of $${r}\\text{ L/min}$, and the thoroughly mixed solution drains at the same rate of $${r}\\text{ L/min}$. At a certain moment, salt is leaving the tank at an instantaneous rate of $${D}\\text{ kg/min}$. How many kilograms of salt are in the tank at this moment?`,
            `一个水箱中装有 $${V}$ 升盐水溶液。纯水以 $${r}\\text{ 升/分}$ 的速率流入水箱，充分混合后的溶液以相同的 $${r}\\text{ 升/分}$ 速率流出。在某一时刻，盐离开水箱的瞬时速率为 $${D}\\text{ 千克/分}$。求此时水箱中含有多少千克的盐？`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              D * r,
              "That multiplies the loss rate by the flow rate; the loss rate is $\\frac{r}{V}S$, so divide by $\\frac{r}{V}$.",
              "这把流失速率乘以了流速；流失速率是 $\\frac{r}{V}S$，应除以 $\\frac{r}{V}$。",
            ),
            why(D * V, "That multiplies by the volume but does not divide by the flow rate.", "这乘了体积，却没有除以流速。"),
            why(Q.of(D, T), "That divides by $\\frac{V}{r}$ instead of multiplying by it.", "这除以了 $\\frac{V}{r}$，而应乘以它。"),
          ]),
          solution: walked(
            [
              [
                ["Model the outflow", "写出流出速率"],
                t(
                  "Pure water brings no salt in, and the outflow has concentration $\\frac{S}{V}$.",
                  "流入的纯水不含盐，流出液的浓度是 $\\frac{S}{V}$。",
                ),
                [`\\frac{dS}{dt} = 0 - ${r} \\cdot \\frac{S}{${V}} = -\\frac{S}{${T}}`],
              ],
              [["Use the given rate", "代入已知速率"], t("", ""), [`\\frac{S}{${T}} = ${D}, \\qquad S = ${D} \\cdot ${T} = ${ans}`]],
            ],
            t(
              `With $S = ${ans}$ kg the concentration is $${ans} \\div ${V} = ${Q.of(ans, V).toLatex()}$ kg/L, and $${r}$ L/min of it carries away $${Q.of(ans, V).toLatex()} \\cdot ${r} = ${D}$ kg/min.`,
              `$S = ${ans}$ 千克时浓度为 $${ans} \\div ${V} = ${Q.of(ans, V).toLatex()}$ 千克/升，每分钟流出 $${r}$ 升，带走 $${Q.of(ans, V).toLatex()} \\cdot ${r} = ${D}$ 千克。`,
            ),
          ),
        });
      },
    },
    {
      id: "salt-remaining-after-a-given-time",
      title: t("Salt remaining after a given time", "经过一段时间后剩余的盐"),
      explanation: t(
        "Separating $\\frac{dS}{dt} = -\\frac{r}{V}S$ gives $\\frac{dS}{S} = -\\frac{r}{V}\\,dt$, so $\\ln S = -\\frac{r}{V}t + C$ and\n\n$$S(t) = S_0 e^{-rt/V},$$\n\nwhere $S_0$ is the initial amount. The salt decays exponentially with rate constant $\\frac{r}{V}$, the fraction of the tank replaced each minute. A $100$-liter tank flushed at $5$ L/min starting with $20$ kg of salt holds $20e^{-0.05t}$ kg after $t$ minutes.\n\n> **Watch out.** $S_0e^{-rt/V}$ is what remains, not what has left, and the rate constant is $\\frac{r}{V}$, not $\\frac{1}{V}$. In that tank after $20$ minutes $20e^{-1} \\approx 7.36$ kg remain, not $20(1 - e^{-1}) \\approx 12.64$ kg.",
        "分离变量 $\\frac{dS}{dt} = -\\frac{r}{V}S$ 得 $\\frac{dS}{S} = -\\frac{r}{V}\\,dt$，所以 $\\ln S = -\\frac{r}{V}t + C$，即\n\n$$S(t) = S_0 e^{-rt/V},$$\n\n其中 $S_0$ 为初始含量。盐按指数衰减，速率常数 $\\frac{r}{V}$ 是每分钟被替换的容器比例。容积 $100$ 升、以 $5$ 升/分冲洗、初始含盐 $20$ 千克的水箱，$t$ 分钟后含盐 $20e^{-0.05t}$ 千克。\n\n> **注意。** $S_0e^{-rt/V}$ 是剩下的量，不是流走的量；速率常数是 $\\frac{r}{V}$，不是 $\\frac{1}{V}$。上面的水箱 $20$ 分钟后剩 $20e^{-1} \\approx 7.36$ 千克，不是 $20(1 - e^{-1}) \\approx 12.64$ 千克。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.int(2, 10);
        const V = r * rng.pick([10, 20, 25, 40, 50]);
        const S0 = rng.int(10, 80);
        const t0 = rng.pick([5, 10, 15, 20, 30, 45, 60]);
        const rate = Q.of(r, V);
        const ans = round2(S0 * Math.exp((-r * t0) / V));
        const expo = dec(rate.mul(Q.of(t0)));
        return numberProblem({
          prompt: t(
            `A tank holds $${V}$ liters of brine containing $${S0}$ kg of salt. Pure water flows in at $${r}\\text{ L/min}$ and the well-mixed solution drains at the same rate. How much salt is in the tank after $${t0}$ minutes? Round to two decimal places.`,
            `水箱中有 $${V}$ 升盐水，含盐 $${S0}$ 千克。纯水以 $${r}\\text{ 升/分}$ 流入，充分混合的溶液以相同速率流出。$${t0}$ 分钟后水箱中有多少千克盐？精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(
                round2(S0 * (1 - Math.exp((-r * t0) / V))),
                "That is the salt that has left the tank, not what remains.",
                "这是流出水箱的盐，不是剩下的盐。",
              ),
              why(round2(S0 * Math.exp(-t0 / V)), "That leaves the flow rate $r$ out of the exponent.", "这在指数中漏掉了流速 $r$。"),
              why(
                round2(S0 * (1 - (r * t0) / V)),
                "That loses salt in a straight line; the loss slows as the tank gets fresher.",
                "这是按直线减少；随着水箱变淡，流失会减慢。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [["Set up the equation", "列出方程"], t("", ""), [`\\frac{dS}{dt} = -\\frac{${r}}{${V}}S = -${dec(rate)}S`]],
              [
                ["Solve it", "求解"],
                t(`Separate the variables and use $S(0) = ${S0}$.`, `分离变量并用 $S(0) = ${S0}$。`),
                [`S(t) = ${S0}e^{-${dec(rate)}t}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`S(${t0}) = ${S0}e^{-${expo}} \\approx ${dec(ans)}`]],
            ],
            t(
              `The exponent $${expo}$ is $${t0}$ minutes times the fraction $${dec(rate)}$ of the tank replaced each minute; it is positive, so less than the initial $${S0}$ kg remains, but more than $0$.`,
              `指数 $${expo}$ 等于 $${t0}$ 分钟乘以每分钟被替换的比例 $${dec(rate)}$；它为正，所以剩下的盐少于初始的 $${S0}$ 千克，但多于 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** modelingMixtureProblemsWithFirstOrderLinearOdes models inflow with non-zero concentration. */
export const modelingMixtureProblemsWithFirstOrderLinearOdes: TopicDef = {
  id: "modeling-mixture-problems-with-first-order-linear-odes",
  title: t("Modeling Mixture Problems With First-Order Linear ODEs", "一阶线性微分方程的混合问题建模"),
  summary: t(
    "When the incoming fluid has solute concentration $c_{\\text{in}}$, the amount $S(t)$ satisfies $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$ and tends to $S_\\infty = Vc_{\\text{in}}$.",
    "当流入液体的溶质浓度为 $c_{\\text{in}}$ 时，溶质量 $S(t)$ 满足 $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$，并趋于 $S_\\infty = Vc_{\\text{in}}$。",
  ),
  intro: t(
    "Take a $200$-liter tank of pure water fed a $3$ g/L solution at $4$ L/min, with the mixture draining at the same rate. Then $\\frac{dS}{dt} = 12 - \\frac{S}{50}$, the equilibrium is $S_\\infty = 600$ g, and $S = 600\\left(1 - e^{-t/50}\\right)$.\n\nCheck: $S(0) = 0$, and $\\frac{dS}{dt} = 12e^{-t/50}$, which equals $12 - \\frac{S}{50}$ because $\\frac{S}{50} = 12 - 12e^{-t/50}$.\n\nIn this lesson we model a tank fed with a solution and find its long-run and its current amount of solute.",
    "取一个装满纯水的 $200$ 升水箱，以 $4$ 升/分注入 $3$ 克/升的溶液，混合液以相同速率流出。则 $\\frac{dS}{dt} = 12 - \\frac{S}{50}$，平衡值 $S_\\infty = 600$ 克，$S = 600\\left(1 - e^{-t/50}\\right)$。\n\n检验：$S(0) = 0$，并且 $\\frac{dS}{dt} = 12e^{-t/50}$，它等于 $12 - \\frac{S}{50}$，因为 $\\frac{S}{50} = 12 - 12e^{-t/50}$。\n\n本课我们为注入溶液的容器建模，求溶质的长期含量和某一时刻的含量。",
  ),
  prerequisites: ["modeling-mixture-problems-with-first-order-separable-odes", "general-solutions-of-first-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "mixture-problems-with-inflow-concentration-or-variable-volume",
      title: t("Steady-state solution in mixture problems with constant inflow concentration", "恒定流入浓度混合问题的稳态解"),
      explanation: t(
        "For $\\frac{dS}{dt} + \\frac{r}{V}S = r c_{\\text{in}}$, the general solution is $S(t) = V c_{\\text{in}} + C e^{-(r/V)t}$. As $t \\to \\infty$, the amount of solute approaches the steady-state value $S_\\infty = V c_{\\text{in}}$.\n\n> **Watch out.** The flow rate cancels at equilibrium: the tank ends up at the incoming concentration. A $500$-liter tank fed $4$ g/L solution approaches $500 \\cdot 4 = 2000$ g at any flow rate.",
        "对于微分方程 $\\frac{dS}{dt} + \\frac{r}{V}S = r c_{\\text{in}}$，通解为 $S(t) = V c_{\\text{in}} + C e^{-(r/V)t}$。当 $t \\to \\infty$ 时，溶质总量趋于稳态极限值 $S_\\infty = V c_{\\text{in}}$。\n\n> **注意。** 在平衡时流速会消去：水箱最终达到流入液的浓度。一个注入 $4$ 克/升溶液的 $500$ 升水箱，无论流速多少，都趋于 $500 \\cdot 4 = 2000$ 克。",
      ),
      generate(rng: Rng): Problem {
        const V = rng.int(10, 80) * 10; // 100 to 800
        const cin = rng.int(2, 12);
        const r = rng.int(2, 8);
        const ans = V * cin;
        return numberProblem({
          prompt: t(
            `A storage reservoir holds $${V}$ liters of water. A solution with chemical concentration $${cin}\\text{ g/L}$ flows into the reservoir at $${r}\\text{ L/min}$, and the uniform mixture flows out at the same rate of $${r}\\text{ L/min}$. What is the steady-state amount of chemical in the reservoir as $t \\to \\infty$ (in grams)?`,
            `一个水库蓄有 $${V}$ 升水。化学物质浓度为 $${cin}\\text{ 克/升}$ 的溶液以 $${r}\\text{ 升/分}$ 的速率流入水库，混合均匀的液体以相同的 $${r}\\text{ 升/分}$ 速率流出。求当 $t \\to \\infty$ 时，水库中化学物质的稳态总量（单位：克）是多少？`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(V * r, "That multiplies the volume by the flow rate; the concentration belongs there.", "这把体积乘以了流速；应乘以浓度。"),
            why(r * cin, "That is the rate at which the chemical flows in, in grams per minute.", "这是化学物质流入的速率，单位是克/分。"),
            why(cin, "That is the concentration in grams per liter, not the amount.", "这是以克/升为单位的浓度，不是总量。"),
          ]),
          solution: walked(
            [
              [
                ["Write the balance", "写出平衡方程"],
                t(
                  "Rate in is $rc_{\\text{in}}$; rate out is $\\frac{r}{V}S$.",
                  "流入速率为 $rc_{\\text{in}}$，流出速率为 $\\frac{r}{V}S$。",
                ),
                [`\\frac{dS}{dt} = ${r} \\cdot ${cin} - \\frac{${r}}{${V}}S = ${r * cin} - \\frac{${r}}{${V}}S`],
              ],
              [
                ["Set the rate to zero", "令变化率为零"],
                t("At steady state $S$ stops changing.", "稳态时 $S$ 不再变化。"),
                [`\\frac{${r}}{${V}}S_\\infty = ${r * cin}, \\qquad S_\\infty = ${r * cin} \\cdot \\frac{${V}}{${r}} = ${ans}`],
              ],
            ],
            t(
              `At $S = ${ans}$ g the reservoir's concentration is $${ans} \\div ${V} = ${cin}$ g/L, the same as the incoming solution, so the chemical flows in and out at the same rate.`,
              `$S = ${ans}$ 克时水库的浓度为 $${ans} \\div ${V} = ${cin}$ 克/升，与流入溶液相同，所以化学物质的流入与流出速率相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-amount-at-a-given-time-with-inflowing-solute",
      title: t("The amount at a given time with inflowing solute", "有溶质流入时某一时刻的含量"),
      explanation: t(
        "The linear equation $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$ has the equilibrium $S_\\infty = Vc_{\\text{in}}$, and the gap from equilibrium decays exponentially:\n\n$$S(t) = S_\\infty + (S_0 - S_\\infty)e^{-rt/V}.$$\n\nFor a $200$-liter tank of pure water ($S_0 = 0$) fed $3$ g/L solution at $4$ L/min, $S_\\infty = 600$ g and $S(t) = 600(1 - e^{-0.02t})$. The amount climbs toward $S_\\infty$ when $S_0 < S_\\infty$ and falls toward it otherwise.\n\n> **Watch out.** Only the gap $S_0 - S_\\infty$ decays. In that tank after $50$ minutes $S = 600(1 - e^{-1}) \\approx 379.27$ g, not $600e^{-1} \\approx 220.73$ g.",
        "线性方程 $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$ 的平衡值为 $S_\\infty = Vc_{\\text{in}}$，与平衡值的差按指数衰减：\n\n$$S(t) = S_\\infty + (S_0 - S_\\infty)e^{-rt/V}.$$\n\n例如 $200$ 升纯水（$S_0 = 0$），以 $4$ 升/分注入 $3$ 克/升的溶液，则 $S_\\infty = 600$ 克，$S(t) = 600(1 - e^{-0.02t})$。$S_0 < S_\\infty$ 时含量上升趋于 $S_\\infty$，否则下降趋于它。\n\n> **注意。** 衰减的只是差 $S_0 - S_\\infty$。上面的水箱 $50$ 分钟后 $S = 600(1 - e^{-1}) \\approx 379.27$ 克，不是 $600e^{-1} \\approx 220.73$ 克。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.int(2, 10);
        const V = r * rng.pick([10, 20, 25, 40, 50]);
        const cin = rng.int(1, 8);
        const Sinf = V * cin;
        const S0 = rng.pick([0, 0, Math.round(Sinf / 4), Sinf * 2]);
        const t0 = rng.pick([5, 10, 15, 20, 30, 60]);
        const rate = Q.of(r, V);
        const e = Math.exp((-r * t0) / V);
        const ans = round2(Sinf + (S0 - Sinf) * e);
        const expo = dec(rate.mul(Q.of(t0)));
        const sign = S0 - Sinf < 0 ? "-" : "+";
        const gap = Math.abs(S0 - Sinf);
        const start = S0 === 0 ? t("pure water", "纯水") : t(`water containing $${S0}$ g of the chemical`, `含该化学物质 $${S0}$ 克的水`);
        return numberProblem({
          prompt: t(
            `A tank holds $${V}$ liters of ${start.en}. A solution with concentration $${cin}\\text{ g/L}$ flows in at $${r}\\text{ L/min}$, and the well-mixed solution drains at the same rate. How many grams of the chemical are in the tank after $${t0}$ minutes? Round to two decimal places.`,
            `水箱中有 $${V}$ 升${start["zh-CN"]}。浓度为 $${cin}\\text{ 克/升}$ 的溶液以 $${r}\\text{ 升/分}$ 流入，充分混合的溶液以相同速率流出。$${t0}$ 分钟后水箱中有多少克该化学物质？精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(round2(Sinf), "That is the long-run amount, which the tank only approaches.", "这是长期含量，水箱只是趋近它。"),
              why(
                round2(Sinf * e),
                "That decays the whole equilibrium amount instead of the gap $S_0 - S_\\infty$.",
                "这让整个平衡值衰减，而衰减的应是差 $S_0 - S_\\infty$。",
              ),
              why(
                round2(S0 + r * cin * t0),
                "That adds the inflow at a constant rate and ignores the outflow.",
                "这按恒定速率加上流入量，忽略了流出。",
              ),
              why(
                round2(Sinf - S0 * e),
                "That decays only the starting amount; the decaying term is $(S_0 - S_\\infty)e^{-rt/V}$.",
                "这只让初始量衰减；衰减项应是 $(S_0 - S_\\infty)e^{-rt/V}$。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Find the equilibrium", "求平衡值"],
                t("", ""),
                [`S_\\infty = ${V} \\cdot ${cin} = ${Sinf}, \\qquad \\frac{r}{V} = ${dec(rate)}`],
              ],
              [
                ["Write the solution", "写出解"],
                t(`The gap starts at $${S0} - ${Sinf}$.`, `差开始时为 $${S0} - ${Sinf}$。`),
                [`S(t) = ${Sinf} ${sign} ${gap}e^{-${dec(rate)}t}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`S(${t0}) = ${Sinf} ${sign} ${gap}e^{-${expo}} \\approx ${dec(ans)}`]],
            ],
            t(
              `At $t = 0$ the formula gives $${Sinf} ${sign} ${gap} = ${S0}$, the starting amount, and the value $${dec(ans)}$ lies between $${S0}$ and the equilibrium $${Sinf}$.`,
              `在 $t = 0$ 时公式给出 $${Sinf} ${sign} ${gap} = ${S0}$，正是初始量；而 $${dec(ans)}$ 介于 $${S0}$ 与平衡值 $${Sinf}$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** orthogonalTrajectories finds curves intersecting a given family at right angles. */
export const orthogonalTrajectories: TopicDef = {
  id: "orthogonal-trajectories",
  title: t("Orthogonal Trajectories", "正交轨迹"),
  summary: t(
    "A family of curves intersecting every member of another family at right angles satisfies dy/dx = -1/f(x, y), where dy/dx = f(x, y) is the original family's ODE.",
    "处处与已知曲线族垂直相交的曲线族称为正交轨迹族，其满足微分方程 dy/dx = -1/f(x, y)，其中 dy/dx = f(x, y) 为原曲线族的微分方程。",
  ),
  intro: t(
    "Take the lines $y = Cx$. Their slope is $y' = C = \\frac{y}{x}$, so the orthogonal trajectories satisfy $y' = -\\frac{x}{y}$, that is $y\\,dy = -x\\,dx$. Integrating gives $x^2 + y^2 = C'$: circles about the origin.\n\nCheck: at $(3, 4)$ the line has slope $\\frac{4}{3}$, the circle has slope $-\\frac{3}{4}$, and $\\frac{4}{3} \\cdot \\left(-\\frac{3}{4}\\right) = -1$.\n\nIn this lesson we find the curves that cross every member of a family at right angles.",
    "取直线族 $y = Cx$。它们的斜率为 $y' = C = \\frac{y}{x}$，所以正交轨迹满足 $y' = -\\frac{x}{y}$，即 $y\\,dy = -x\\,dx$。积分得 $x^2 + y^2 = C'$：以原点为圆心的圆。\n\n检验：在 $(3, 4)$ 处直线斜率为 $\\frac{4}{3}$，圆的斜率为 $-\\frac{3}{4}$，且 $\\frac{4}{3} \\cdot \\left(-\\frac{3}{4}\\right) = -1$。\n\n本课我们求与曲线族中每条曲线都垂直相交的曲线。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-orthogonal-trajectories-of-a-family-of-curves",
      figure: differentialEquationsDrawings1["orthogonal-trajectories#finding-orthogonal-trajectories-of-a-family-of-curves"],
      title: t("Finding orthogonal trajectories of a family of curves", "求解平面曲线族的正交轨迹"),
      explanation: t(
        "Orthogonal trajectories cross every curve of the family at right angles, so their slope is the negative reciprocal of the family's slope at each point. For $y = C x^k$, differentiating yields $\\frac{dy}{dx} = \\frac{k y}{x}$. The orthogonal trajectories satisfy $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$, giving the family $x^2 + k y^2 = C'$.\n\n> **Watch out.** The factor $k$ stays with $y\\,dy$, so it multiplies $y^2$. For $y = Cx^2$ the trajectories are $x^2 + 2y^2 = C'$, not $x^2 + \\frac{1}{2}y^2 = C'$.",
        "正交轨线与曲线族中的每条曲线都垂直相交，所以它在每一点的斜率是曲线族斜率的负倒数。对于曲线族 $y = C x^k$，求导消去常数 $C$ 得 $\\frac{dy}{dx} = \\frac{k y}{x}$。其正交轨迹满足负倒数斜率 $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$，积分得到曲线族 $x^2 + k y^2 = C'$。\n\n> **注意。** 因子 $k$ 跟着 $y\\,dy$，所以它乘在 $y^2$ 上。对 $y = Cx^2$，正交轨迹是 $x^2 + 2y^2 = C'$，不是 $x^2 + \\frac{1}{2}y^2 = C'$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k;
        const power = k - 1 === 1 ? "x" : `x^{${k - 1}}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient $B$ such that the orthogonal trajectories to the family of curves $y = C x^{${k}}$ are given by $x^2 + B y^2 = C'$.`,
            `已知曲线族 $y = C x^{${k}}$ 的正交轨迹方程具有形式 $x^2 + B y^2 = C'$。求系数 $B$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(1, k),
              "That moves $k$ to the wrong side: it multiplies $y\\,dy$, so it stays with $y^2$.",
              "这把 $k$ 放错了一边：它乘在 $y\\,dy$ 上，所以留在 $y^2$ 前。",
            ),
            why(
              1,
              "That treats every power family like the lines $y = Cx$, whose trajectories are circles.",
              "这把所有幂函数族都当成直线族 $y = Cx$，后者的正交轨迹才是圆。",
            ),
            why(
              2 * k,
              "That integrates $y\\,dy$ to $y^2$ instead of $\\frac{y^2}{2}$ while keeping $\\frac{x^2}{2}$ on the other side.",
              "这把 $y\\,dy$ 积分成了 $y^2$ 而不是 $\\frac{y^2}{2}$，另一边却保留了 $\\frac{x^2}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate and eliminate $C$", "求导并消去 $C$"],
                t(`Replace $C$ by $\\frac{y}{x^{${k}}}$.`, `把 $C$ 换成 $\\frac{y}{x^{${k}}}$。`),
                [`y' = ${k}C${power} = \\frac{${k}y}{x}`],
              ],
              [
                ["Take the negative reciprocal", "取负倒数"],
                t("", ""),
                [`\\frac{dy}{dx} = -\\frac{x}{${k}y}, \\qquad ${k}y\\,dy = -x\\,dx`],
              ],
              [["Integrate", "积分"], t("", ""), [`\\frac{${k}}{2}y^2 = -\\frac{x^2}{2} + K, \\qquad x^2 + ${k}y^2 = C'`, `B = ${ans}`]],
            ],
            t(
              `The product of the two slopes is $\\frac{${k}y}{x} \\cdot \\left(-\\frac{x}{${k}y}\\right) = -1$ at every point where both are defined, so the curves meet at right angles.`,
              `两条曲线斜率之积为 $\\frac{${k}y}{x} \\cdot \\left(-\\frac{x}{${k}y}\\right) = -1$，在两者都有定义的每一点都成立，所以曲线垂直相交。`,
            ),
          ),
        });
      },
    },
    {
      id: "orthogonal-trajectories-of-exponential-curves",
      figure: differentialEquationsDrawings1["orthogonal-trajectories#orthogonal-trajectories-of-exponential-curves"],
      title: t("Orthogonal trajectories of exponential curves", "指数曲线族的正交轨线"),
      explanation: t(
        "The recipe is always the same: differentiate the family, eliminate the constant so the slope is a function $f(x, y)$, replace $f$ by $-\\frac{1}{f}$, and solve.\n\nFor $y = Ce^{kx}$: $y' = kCe^{kx} = ky$. The trajectories satisfy $\\frac{dy}{dx} = -\\frac{1}{ky}$, so $ky\\,dy = -dx$ and $\\frac{k}{2}y^{2} = -x + K$, that is $y^{2} = -\\frac{2}{k}x + C'$: a family of parabolas opening away from the direction in which the exponentials grow.\n\n> **Watch out.** Integrating $ky\\,dy$ gives $\\frac{k}{2}y^2$, so a factor $2$ appears in $B$, together with the minus sign. For $y = Ce^{2x}$, $B = -1$, not $-\\frac{1}{2}$.",
        "方法总是相同的：对曲线族求导，消去常数使斜率成为 $f(x, y)$，把 $f$ 换成 $-\\frac{1}{f}$，再解方程。\n\n对 $y = Ce^{kx}$：$y' = kCe^{kx} = ky$。正交轨线满足 $\\frac{dy}{dx} = -\\frac{1}{ky}$，所以 $ky\\,dy = -dx$，$\\frac{k}{2}y^{2} = -x + K$，即 $y^{2} = -\\frac{2}{k}x + C'$：一族开口方向与指数增长方向相反的抛物线。\n\n> **注意。** 积分 $ky\\,dy$ 得 $\\frac{k}{2}y^2$，所以 $B$ 中会出现因子 $2$，还带着负号。对 $y = Ce^{2x}$，$B = -1$，不是 $-\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 10]);
        const n = rng.pick([1, 1, 2, 3]);
        const kq = Q.of(k, n);
        const ans = Q.of(-2).div(kq);
        const kc = cq(kq);
        const expo = `${kc}x`;
        const half = kq.div(Q.of(2));
        return numberProblem({
          prompt: t(
            `The orthogonal trajectories of the family $y = Ce^{${expo}}$ have the form $y^{2} = Bx + C'$. Find $B$.`,
            `曲线族 $y = Ce^{${expo}}$ 的正交轨线形如 $y^{2} = Bx + C'$。求 $B$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(ans.neg(), "The minus sign is lost: the trajectories satisfy $ky\\,dy = -dx$.", "丢了负号：正交轨线满足 $ky\\,dy = -dx$。"),
            why(Q.of(-1).div(kq), "That forgets the factor $2$ from integrating $y\\,dy$.", "这忘了积分 $y\\,dy$ 产生的因子 $2$。"),
            why(kq.mul(Q.of(-2)), "That multiplies by $k$ instead of dividing by it.", "这乘以了 $k$，而应除以它。"),
            why(Q.of(2).mul(kq), "That multiplies by $k$ and also loses the minus sign.", "这乘以了 $k$，还丢了负号。"),
          ]),
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                t(`Eliminate $C$ using $y = Ce^{${expo}}$.`, `用 $y = Ce^{${expo}}$ 消去 $C$。`),
                [`y' = ${kc}Ce^{${expo}} = ${kc}y`],
              ],
              [["Take the negative reciprocal", "取负倒数"], t("", ""), [`\\frac{dy}{dx} = -\\frac{1}{${kc}y}, \\qquad ${kc}y\\,dy = -dx`]],
              [["Integrate", "积分"], t("", ""), [`${cq(half)}y^{2} = -x + K, \\qquad y^{2} = ${cq(ans)}x + C'`, `B = ${ans.toLatex()}`]],
            ],
            t(
              `Along $y^2 = ${cq(ans)}x + C'$, $2yy' = ${ans.toLatex()}$, so the trajectory slope times the family slope $${kc}y$ is $\\frac{1}{2} \\cdot ${parQ(ans)} \\cdot ${parQ(kq)} = -1$.`,
              `沿 $y^2 = ${cq(ans)}x + C'$ 有 $2yy' = ${ans.toLatex()}$，所以正交轨线斜率乘以曲线族斜率 $${kc}y$ 为 $\\frac{1}{2} \\cdot ${parQ(ans)} \\cdot ${parQ(kq)} = -1$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.6 Growth and Decay Models With First-Order ODEs
// ---------------------------------------------------------------------------

/** inhibitedGrowthModelsWithFirstOrderOdes models bounded growth approaching capacity. */
export const inhibitedGrowthModelsWithFirstOrderOdes: TopicDef = {
  id: "inhibited-growth-models-with-first-order-odes",
  title: t("Inhibited Growth Models With First-Order ODEs", "一阶微分方程的有限增长模型"),
  summary: t(
    "Inhibited growth dy/dt = k(M - y) describes quantities growing at a rate proportional to remaining capacity, converging toward carrying capacity M.",
    "有限受阻增长模型 dy/dt = k(M - y) 描述增长速率与未利用容量成正比的物理与生物过程，其解渐近趋于环境容纳量 M。",
  ),
  intro: t(
    "A fish $10$ cm long grows toward a maximum length of $60$ cm by $\\frac{dy}{dt} = 0.2(60 - y)$ per year. Today it grows at $0.2 \\cdot 50 = 10$ cm per year, and its length is $y = 60 - 50e^{-0.2t}$; after $5$ years that is $60 - 50e^{-1} \\approx 41.61$ cm.\n\nCheck: $y(0) = 60 - 50 = 10$, and $y' = 10e^{-0.2t} = 0.2(60 - y)$ because $60 - y = 50e^{-0.2t}$.\n\nIn this lesson we model growth that slows as it nears a limit, and find its rate and its size at a given time.",
    "一条长 $10$ 厘米的鱼按 $\\frac{dy}{dt} = 0.2(60 - y)$（每年）向最大长度 $60$ 厘米生长。现在它每年长 $0.2 \\cdot 50 = 10$ 厘米，长度为 $y = 60 - 50e^{-0.2t}$；$5$ 年后为 $60 - 50e^{-1} \\approx 41.61$ 厘米。\n\n检验：$y(0) = 60 - 50 = 10$，并且 $y' = 10e^{-0.2t} = 0.2(60 - y)$，因为 $60 - y = 50e^{-0.2t}$。\n\n本课我们为接近上限时减慢的增长建模，求它的增长速率和某一时刻的规模。",
  ),
  prerequisites: ["further-modeling-with-first-order-odes"],
  encompasses: [{ topic: "further-modeling-with-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "von-bertalanffy-and-monod-inhibited-growth",
      title: t("Rate of growth in bounded growth models", "有限增长模型的瞬时增长速率"),
      explanation: t(
        "In an inhibited growth model $\\frac{dy}{dt} = k(M - y)$, the rate of growth is directly proportional to the difference between the carrying capacity $M$ and the current size $y$.\n\n> **Watch out.** The rate uses the room left, $M - y$, not the size $y$. For $\\frac{dy}{dt} = 3(100 - y)$ at $y = 90$, the rate is $3 \\cdot 10 = 30$, not $3 \\cdot 90 = 270$.",
        "在有限增长模型 $\\frac{dy}{dt} = k(M - y)$ 中，瞬时增长速率与最大容纳量 $M$ 与当前量 $y$ 之差成正比。\n\n> **注意。** 速率用的是剩余空间 $M - y$，不是当前量 $y$。对 $\\frac{dy}{dt} = 3(100 - y)$，在 $y = 90$ 时速率为 $3 \\cdot 10 = 30$，不是 $3 \\cdot 90 = 270$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const M = rng.int(50, 250);
        const diff = rng.int(5, 30);
        const yVal = M - diff;
        const ans = k * diff;
        return numberProblem({
          prompt: t(
            `A population size $y(t)$ grows according to the inhibited growth differential equation $\\frac{dy}{dt} = ${k}(${M} - y)$. Find the instantaneous rate of growth $\\frac{dy}{dt}$ when $y = ${yVal}$.`,
            `某种群数量 $y(t)$ 服从有限增长微分方程 $\\frac{dy}{dt} = ${k}(${M} - y)$。求当种群数量达到 $y = ${yVal}$ 时的瞬时增长速率 $\\frac{dy}{dt}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              k * yVal,
              "That multiplies $k$ by the size $y$; the rate uses the room left, $M - y$.",
              "这把 $k$ 乘以当前量 $y$；速率用的是剩余空间 $M - y$。",
            ),
            why(diff, "That is the room left, $M - y$, before multiplying by $k$.", "这是乘以 $k$ 之前的剩余空间 $M - y$。"),
            why(k * M, "That multiplies $k$ by the capacity $M$ and forgets to subtract $y$.", "这把 $k$ 乘以容量 $M$，忘了减去 $y$。"),
          ]),
          solution: walked(
            [
              [["Find the room left", "求剩余空间"], t("", ""), [`M - y = ${M} - ${yVal} = ${diff}`]],
              [["Multiply by $k$", "乘以 $k$"], t("", ""), [`\\frac{dy}{dt} = ${k} \\cdot ${diff} = ${ans}`]],
            ],
            t(
              `The rate $${ans}$ is positive and less than $${k} \\cdot ${M} = ${k * M}$, the rate at $y = 0$, as it must be for a population this close to its capacity.`,
              `速率 $${ans}$ 为正，并且小于 $y = 0$ 时的速率 $${k} \\cdot ${M} = ${k * M}$，这对一个接近容量的种群是应有的。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-size-at-a-given-time",
      title: t("The size at a given time", "某一时刻的规模"),
      explanation: t(
        "Separating $\\frac{dy}{dt} = k(M - y)$ gives $\\frac{dy}{M - y} = k\\,dt$, so $-\\ln(M - y) = kt + C$. The gap to the capacity shrinks exponentially, and with $y(0) = y_0$:\n\n$$y(t) = M - (M - y_0)e^{-kt}.$$\n\nA fish of length $10$ cm growing toward $M = 60$ cm with $k = 0.2$ per year has length $60 - 50e^{-0.2t}$; after $5$ years that is $60 - 50e^{-1} \\approx 41.61$ cm.\n\n> **Watch out.** $(M - y_0)e^{-kt}$ is the gap that is left, not the size. For that fish $50e^{-1} \\approx 18.39$ cm is how far it still has to grow; its length is $60 - 18.39 = 41.61$ cm.",
        "分离变量 $\\frac{dy}{dt} = k(M - y)$ 得 $\\frac{dy}{M - y} = k\\,dt$，所以 $-\\ln(M - y) = kt + C$。与容量的差距按指数缩小，代入 $y(0) = y_0$：\n\n$$y(t) = M - (M - y_0)e^{-kt}.$$\n\n一条长 $10$ 厘米的鱼以 $k = 0.2$（每年）向 $M = 60$ 厘米生长，长度为 $60 - 50e^{-0.2t}$；$5$ 年后为 $60 - 50e^{-1} \\approx 41.61$ 厘米。\n\n> **注意。** $(M - y_0)e^{-kt}$ 是剩下的差距，不是规模。对这条鱼，$50e^{-1} \\approx 18.39$ 厘米是它还要长的长度；它的长度是 $60 - 18.39 = 41.61$ 厘米。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(5, 30) * 10;
        const y0 = rng.int(0, Math.floor(M / 20)) * 10;
        const k = Q.of(rng.int(1, 9), 10);
        const t0 = rng.int(1, 10);
        const kt = k.mul(Q.of(t0));
        const e = Math.exp(-kt.toNumber());
        const ans = round2(M - (M - y0) * e);
        const gap = round2((M - y0) * e);
        return numberProblem({
          prompt: t(
            `A quantity grows according to $\\frac{dy}{dt} = ${dec(k)}(${M} - y)$ with $y(0) = ${y0}$. Find $y(${t0})$. Round to two decimal places.`,
            `某量按 $\\frac{dy}{dt} = ${dec(k)}(${M} - y)$ 增长，且 $y(0) = ${y0}$。求 $y(${t0})$，精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(gap, "That is the gap $M - y$ still left, not the size.", "这是还剩下的差距 $M - y$，不是规模。"),
              why(round2(M * (1 - e)), "That starts the growth from $0$ and ignores $y(0)$.", "这让增长从 $0$ 开始，忽略了 $y(0)$。"),
              why(
                round2(y0 + (M - y0) * kt.toNumber()),
                "That keeps the starting rate for the whole time; the growth slows as $y$ nears $M$.",
                "这在整段时间都用初始速率；随着 $y$ 接近 $M$，增长会减慢。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Write the solution", "写出解"],
                t(`The gap to the capacity starts at $${M} - ${y0} = ${M - y0}$.`, `与容量的差距开始时为 $${M} - ${y0} = ${M - y0}$。`),
                [`y(t) = ${M} - ${M - y0}e^{-${dec(k)}t}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`y(${t0}) = ${M} - ${M - y0}e^{-${dec(kt)}} \\approx ${M} - ${dec(gap)} = ${dec(ans)}`]],
            ],
            t(
              `The value $${dec(ans)}$ lies between the start $${y0}$ and the capacity $${M}$, and the formula gives $${M} - ${M - y0} = ${y0}$ at $t = 0$.`,
              `结果 $${dec(ans)}$ 介于初值 $${y0}$ 与容量 $${M}$ 之间，并且公式在 $t = 0$ 时给出 $${M} - ${M - y0} = ${y0}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** inhibitedDecayModelsWithFirstOrderOdes models Newton's law of cooling. */
export const inhibitedDecayModelsWithFirstOrderOdes: TopicDef = {
  id: "inhibited-decay-models-with-first-order-odes",
  title: t("Inhibited Decay Models With First-Order ODEs", "一阶微分方程的受阻衰减模型"),
  summary: t(
    "Newton's law of cooling, $\\frac{dT}{dt} = -k(T - T_m)$, models an object's temperature approaching the surrounding temperature $T_m$.",
    "牛顿冷却定律 $\\frac{dT}{dt} = -k(T - T_m)$ 描述物体温度趋于环境温度 $T_m$ 的过程。",
  ),
  intro: t(
    "Coffee at $90^\\circ$C sits in a $20^\\circ$C room and cools by $\\frac{dT}{dt} = -k(T - 20)$. The difference from the room, $70^\\circ$, shrinks by the same factor over equal times, so if it is $55^\\circ$ after $10$ minutes (difference $35$, half of $70$), after $20$ minutes the difference is $17.5$ and $T = 37.5^\\circ$C.\n\nCheck: $T = 20 + 70 \\cdot 2^{-t/10}$ gives $T(0) = 90$, $T(10) = 55$ and $T(20) = 37.5$.\n\nIn this lesson we use Newton's law of cooling to find how fast an object cools and what temperature it will reach.",
    "$90^\\circ$C 的咖啡放在 $20^\\circ$C 的房间里，按 $\\frac{dT}{dt} = -k(T - 20)$ 冷却。与室温之差 $70^\\circ$ 在相等时间内乘以同一个因子，所以若 $10$ 分钟后为 $55^\\circ$（温差 $35$，是 $70$ 的一半），$20$ 分钟后温差为 $17.5$，$T = 37.5^\\circ$C。\n\n检验：$T = 20 + 70 \\cdot 2^{-t/10}$ 给出 $T(0) = 90$，$T(10) = 55$，$T(20) = 37.5$。\n\n本课我们用牛顿冷却定律求物体冷却的快慢以及它将达到的温度。",
  ),
  prerequisites: ["inhibited-growth-models-with-first-order-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "newtons-law-of-cooling",
      title: t("Newton's law of cooling", "牛顿冷却定律"),
      explanation: t(
        "An object cools faster when it is much hotter than its surroundings, so its rate of change is proportional to the temperature difference. According to Newton's law of cooling, $\\frac{dT}{dt} = -k(T - T_m)$. The rate of temperature decrease is $-\\frac{dT}{dt} = k(T - T_m)$.\n\n> **Watch out.** Use the difference from the room, not the temperature itself. With $k = 2$, $T_m = 20^\\circ$ and $T = 50^\\circ$, the object cools at $2 \\cdot 30 = 60^\\circ$ per minute, not $2 \\cdot 50 = 100^\\circ$.",
        "物体比周围环境热得越多，冷却得越快，所以它的变化率与温差成正比。根据牛顿冷却定律，$\\frac{dT}{dt} = -k(T - T_m)$。温度的下降速率为 $-\\frac{dT}{dt} = k(T - T_m)$。\n\n> **注意。** 用的是与室温之差，不是温度本身。若 $k = 2$，$T_m = 20^\\circ$，$T = 50^\\circ$，物体每分钟降温 $2 \\cdot 30 = 60^\\circ$，不是 $2 \\cdot 50 = 100^\\circ$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const Tm = rng.int(10, 30);
        const diff = rng.int(10, 50);
        const Tval = Tm + diff;
        const ans = k * diff;
        return numberProblem({
          prompt: t(
            `A heated metal ingot cools in a room kept at a constant temperature of $T_m = ${Tm}^\\circ\\text{C}$ according to the differential equation $\\frac{dT}{dt} = -${k}(T - ${Tm})$. At what rate is the ingot's temperature decreasing (in $^\\circ\\text{C/min}$) when its temperature is $${Tval}^\\circ\\text{C}$?`,
            `一块受热金属置于恒温 $T_m = ${Tm}^\\circ\\text{C}$ 的房间中冷却，满足微分方程 $\\frac{dT}{dt} = -${k}(T - ${Tm})$。当金属温度为 $${Tval}^\\circ\\text{C}$ 时，其温度下降速率（单位：$^\\circ\\text{C/分}$）是多少？`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              k * Tval,
              "That multiplies $k$ by the temperature; the law uses the difference $T - T_m$.",
              "这把 $k$ 乘以温度本身；定律用的是温差 $T - T_m$。",
            ),
            why(diff, "That is the temperature difference before multiplying by $k$.", "这是乘以 $k$ 之前的温差。"),
            why(k * (Tval + Tm), "That adds the room temperature instead of subtracting it.", "这加上了室温，而应减去它。"),
          ]),
          solution: walked(
            [
              [["Find the difference", "求温差"], t("", ""), [`T - T_m = ${Tval} - ${Tm} = ${diff}`]],
              [
                ["Multiply by $k$", "乘以 $k$"],
                t("The minus sign in the law says the temperature is falling.", "定律中的负号表示温度在下降。"),
                [`-\\frac{dT}{dt} = ${k} \\cdot ${diff} = ${ans}`],
              ],
            ],
            t(
              `Then $\\frac{dT}{dt} = -${ans}$, which is negative because the ingot is hotter than the room, so it is cooling at $${ans}^\\circ\\text{C}$ per minute.`,
              `于是 $\\frac{dT}{dt} = -${ans}$，它为负，因为金属比房间热，所以每分钟降温 $${ans}^\\circ\\text{C}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "predicting-temperatures-from-two-readings",
      title: t("Predicting temperatures from two readings", "由两次读数预测温度"),
      explanation: t(
        "The solution of Newton's law of cooling is $T(t) = T_m + (T_0 - T_m)e^{-kt}$: the difference from the room temperature is multiplied by the same factor $e^{-kt_1}$ over every interval of length $t_1$. So one reading after $t_1$ minutes gives that factor without computing $k$:\n\n$$e^{-kt_1} = \\frac{T(t_1) - T_m}{T_0 - T_m},$$\n\nand after $n t_1$ minutes the difference is $(T_0 - T_m)\\left(e^{-kt_1}\\right)^{n}$. Coffee at $90^\\circ$ in a $20^\\circ$ room that reaches $55^\\circ$ in $10$ minutes has halved its difference, so after $20$ minutes it is $20 + 70 \\cdot \\frac{1}{4} = 37.5^\\circ$.\n\n> **Watch out.** The factor multiplies the difference, so add the room temperature back at the end. For that coffee $70 \\cdot \\frac{1}{4} = 17.5^\\circ$ is the difference after $20$ minutes; the temperature is $37.5^\\circ$.",
        "牛顿冷却定律的解为 $T(t) = T_m + (T_0 - T_m)e^{-kt}$：每经过长为 $t_1$ 的一段时间，与室温之差都乘以同一个因子 $e^{-kt_1}$。所以 $t_1$ 分钟后的一次读数就给出这个因子，无需求出 $k$：\n\n$$e^{-kt_1} = \\frac{T(t_1) - T_m}{T_0 - T_m},$$\n\n经过 $n t_1$ 分钟后，温差为 $(T_0 - T_m)\\left(e^{-kt_1}\\right)^{n}$。在 $20^\\circ$ 的房间里，$90^\\circ$ 的咖啡 $10$ 分钟后降到 $55^\\circ$，温差减半，所以 $20$ 分钟后为 $20 + 70 \\cdot \\frac{1}{4} = 37.5^\\circ$。\n\n> **注意。** 因子乘的是温差，所以最后要加回室温。对这杯咖啡，$70 \\cdot \\frac{1}{4} = 17.5^\\circ$ 是 $20$ 分钟后的温差；温度是 $37.5^\\circ$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [3, 4],
          [1, 4],
          [4, 5],
        ] as const);
        const n = rng.int(2, 3);
        const Tm = rng.int(15, 25);
        const diff = q ** n * rng.int(1, Math.max(1, Math.floor(160 / q ** n)));
        const T0 = Tm + diff;
        const t1 = rng.pick([5, 8, 10, 12, 15, 20]);
        const d1 = (diff * p) / q;
        const T1 = Tm + d1;
        const ratio = Q.of(p, q);
        const later = Q.of(diff).mul(ratio.pow(n));
        const ans = Q.of(Tm).add(later);
        return numberProblem({
          prompt: t(
            `An object at $${T0}^\\circ\\text{C}$ is placed in a room kept at $${Tm}^\\circ\\text{C}$ and cools according to Newton's law of cooling. After $${t1}$ minutes its temperature is $${T1}^\\circ\\text{C}$. What is its temperature after $${n * t1}$ minutes?`,
            `一个 $${T0}^\\circ\\text{C}$ 的物体放在保持 $${Tm}^\\circ\\text{C}$ 的房间里，按牛顿冷却定律降温。$${t1}$ 分钟后其温度为 $${T1}^\\circ\\text{C}$。$${n * t1}$ 分钟后其温度是多少？`,
          ),
          answer: ans,
          unit: "°C",
          mistakes: apart(
            ans,
            [
              why(later, "That is the difference from the room; add the room temperature back.", "这是与室温之差；要加回室温。"),
              why(
                Q.of(T0 - n * (T0 - T1)),
                "That lets the temperature fall by the same amount each interval; the difference shrinks by the same factor instead.",
                "这让每段时间温度下降相同的量；实际上是温差按相同因子缩小。",
              ),
              why(
                Q.of(Tm).add(Q.of(diff).mul(ratio).div(Q.of(n))),
                "That divides the factor by $n$ instead of raising it to the power $n$.",
                "这把因子除以 $n$，而应取它的 $n$ 次方。",
              ),
              why(
                Q.of(T1).mul(ratio.pow(n - 1)),
                "That applies the factor to the temperature itself, not to its difference from the room.",
                "这把因子用在温度本身，而不是它与室温之差。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Find the factor", "求因子"],
                t(`Compare the differences from the room at $0$ and $${t1}$ minutes.`, `比较 $0$ 分钟与 $${t1}$ 分钟时与室温之差。`),
                [`e^{-${t1}k} = \\frac{${T1} - ${Tm}}{${T0} - ${Tm}} = \\frac{${d1}}{${diff}} = ${ratio.toLatex()}`],
              ],
              [
                [`Apply it $${n}$ times`, `用 $${n}$ 次`],
                t("", ""),
                [`T(${n * t1}) = ${Tm} + ${diff}\\left(${ratio.toLatex()}\\right)^{${n}} = ${Tm} + ${later.toLatex()} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The temperature $${ans.toLatex()}^\\circ$ is below the reading $${T1}^\\circ$ and above the room's $${Tm}^\\circ$, so the object keeps cooling toward the room.`,
              `温度 $${ans.toLatex()}^\\circ$ 低于读数 $${T1}^\\circ$，高于室温 $${Tm}^\\circ$，所以物体继续向室温冷却。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.7 Physical Applications of First-Order ODEs
// ---------------------------------------------------------------------------

/** fallingBodyProblemsWithLinearDrag determines terminal velocity under linear resistance. */
export const fallingBodyProblemsWithLinearDrag: TopicDef = {
  id: "falling-body-problems-with-linear-drag",
  title: t("Falling Body Problems With Linear Drag", "线性阻力下的落体问题"),
  summary: t(
    "Under gravity and linear air resistance $-bv$, the downward velocity satisfies $m\\frac{dv}{dt} = mg - bv$, with terminal velocity $v_{\\text{term}} = \\frac{mg}{b}$.",
    "在重力与线性阻力 $-bv$ 作用下，向下速度满足 $m\\frac{dv}{dt} = mg - bv$，终端速度为 $v_{\\text{term}} = \\frac{mg}{b}$。",
  ),
  intro: t(
    "A $70$ kg skydiver falls with drag $14v$ N, so $70\\frac{dv}{dt} = 686 - 14v$. The drag balances the weight at $v_{\\text{term}} = \\frac{686}{14} = 49$ m/s, and from rest $v = 49\\left(1 - e^{-0.2t}\\right)$; after $5$ seconds that is $49(1 - e^{-1}) \\approx 30.97$ m/s.\n\nCheck: $v(0) = 0$, and $70v' = 70 \\cdot 9.8e^{-0.2t} = 686 - 14v$ because $14v = 686 - 686e^{-0.2t}$.\n\nIn this lesson we model a fall with drag proportional to speed and find the terminal velocity and the speed at a given time.",
    "一名 $70$ 千克的跳伞者下落时受阻力 $14v$ 牛，所以 $70\\frac{dv}{dt} = 686 - 14v$。阻力在 $v_{\\text{term}} = \\frac{686}{14} = 49$ 米/秒时与重力平衡；从静止开始 $v = 49\\left(1 - e^{-0.2t}\\right)$，$5$ 秒后为 $49(1 - e^{-1}) \\approx 30.97$ 米/秒。\n\n检验：$v(0) = 0$，并且 $70v' = 70 \\cdot 9.8e^{-0.2t} = 686 - 14v$，因为 $14v = 686 - 686e^{-0.2t}$。\n\n本课我们为阻力与速度成正比的下落建模，求终端速度和某一时刻的速度。",
  ),
  prerequisites: ["determining-properties-of-objects-described-as-functions-of-displacement"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "terminal-velocity-with-linear-air-resistance",
      title: t("Terminal velocity with linear air resistance", "线性空气阻力下的收尾速度"),
      explanation: t(
        "As the object speeds up the resistance grows until it balances gravity, and at that speed the acceleration is zero and the velocity stops changing. Terminal velocity is reached when acceleration becomes zero ($m\\frac{dv}{dt} = 0$), so $mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$.\n\n> **Watch out.** Divide the weight by $b$, not $b$ by the weight. With $mg = 300$ N and drag $6v$ N, $v_{\\text{term}} = \\frac{300}{6} = 50$ m/s, not $\\frac{6}{300} = 0.02$ m/s.",
        "物体加速时阻力随之增大，直到与重力平衡；在这个速度下加速度为零，速度不再变化。当加速度降为零（$m\\frac{dv}{dt} = 0$）时物体达到收尾速度，此时重力与阻力平衡：$mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$。\n\n> **注意。** 是重力除以 $b$，不是 $b$ 除以重力。若 $mg = 300$ 牛，阻力 $6v$ 牛，$v_{\\text{term}} = \\frac{300}{6} = 50$ 米/秒，不是 $\\frac{6}{300} = 0.02$ 米/秒。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(2, 15);
        const ans = rng.int(10, 60); // v_term in m/s
        const W = b * ans; // mg = weight in Newtons
        return numberProblem({
          prompt: t(
            `A skydiver and equipment with total weight $mg = ${W}\\text{ N}$ falls vertically through air, experiencing a linear drag force $F_d = ${b}v\\text{ N}$, where $v$ is downward speed in $\\text{m/s}$. Find the terminal velocity $v_{\\text{term}}$ in $\\text{m/s}$.`,
            `一名跳伞员连同装备总重力为 $mg = ${W}\\text{ 牛}$，在空气中垂直下落，受到的线性空气阻力为 $F_d = ${b}v\\text{ 牛}$（$v$ 为向下速度，单位为 $\\text{米/秒}$）。求其收尾终端速度 $v_{\\text{term}}$（单位：$\\text{米/秒}$）。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(b, W),
              "That divides $b$ by the weight; the balance $bv = mg$ gives $v = mg \\div b$.",
              "这用 $b$ 除以重力；平衡 $bv = mg$ 给出 $v = mg \\div b$。",
            ),
            why(W * b, "That multiplies the weight by $b$ instead of dividing.", "这把重力乘以 $b$，而应相除。"),
          ]),
          solution: walked(
            [
              [
                ["Set the acceleration to zero", "令加速度为零"],
                t("At terminal velocity the drag balances the weight.", "达到收尾速度时阻力与重力平衡。"),
                [`${W} - ${b}v_{\\text{term}} = 0`],
              ],
              [["Solve", "求解"], t("", ""), [`v_{\\text{term}} = ${W} \\div ${b} = ${ans}`]],
            ],
            t(
              `At $${ans}$ m/s the drag is $${b} \\cdot ${ans} = ${W}$ N, exactly the weight, so the net force and the acceleration are zero.`,
              `在 $${ans}$ 米/秒时阻力为 $${b} \\cdot ${ans} = ${W}$ 牛，恰好等于重力，所以合力和加速度都为零。`,
            ),
          ),
        });
      },
    },
    {
      id: "velocity-at-a-given-time-with-linear-drag",
      title: t("Velocity at a given time with linear drag", "线性阻力下某一时刻的速度"),
      explanation: t(
        "Dividing $m\\frac{dv}{dt} = mg - bv$ by $m$ gives a linear equation whose solution from rest, $v(0) = 0$, is\n\n$$v(t) = v_{\\text{term}}\\left(1 - e^{-bt/m}\\right), \\qquad v_{\\text{term}} = \\frac{mg}{b}.$$\n\nThe speed approaches the terminal velocity, closing the gap by the factor $e^{-b/m}$ each second. A $70$ kg skydiver with $b = 14$ kg/s has $v_{\\text{term}} = 49$ m/s and $v(t) = 49(1 - e^{-0.2t})$.\n\n> **Watch out.** The exponent is $\\frac{b}{m}t$, not $bt$: the mass slows the approach. For that skydiver after $5$ s, $v = 49(1 - e^{-1}) \\approx 30.97$ m/s, not $49(1 - e^{-70}) \\approx 49$ m/s.",
        "把 $m\\frac{dv}{dt} = mg - bv$ 两边除以 $m$ 得到线性方程，从静止开始（$v(0) = 0$）的解为\n\n$$v(t) = v_{\\text{term}}\\left(1 - e^{-bt/m}\\right), \\qquad v_{\\text{term}} = \\frac{mg}{b}.$$\n\n速度趋于终端速度，与它的差距每秒乘以因子 $e^{-b/m}$。质量 $70$ 千克、$b = 14$ 千克/秒的跳伞者，$v_{\\text{term}} = 49$ 米/秒，$v(t) = 49(1 - e^{-0.2t})$。\n\n> **注意。** 指数是 $\\frac{b}{m}t$，不是 $bt$：质量使接近过程变慢。这名跳伞者 $5$ 秒后 $v = 49(1 - e^{-1}) \\approx 30.97$ 米/秒，不是 $49(1 - e^{-70}) \\approx 49$ 米/秒。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([5, 10, 20, 40, 50, 80, 100]);
        const b = rng.pick([1, 2, 4, 5, 10, 20]);
        const t0 = rng.int(2, 12);
        const vt = Q.of(m * 98, b * 10);
        const rate = Q.of(b, m);
        const e = Math.exp((-b * t0) / m);
        const ans = round2(vt.toNumber() * (1 - e));
        const expo = dec(rate.mul(Q.of(t0)));
        return numberProblem({
          prompt: t(
            `An object of mass $${m}\\text{ kg}$ is dropped from rest and falls with linear air resistance $${b}v\\text{ N}$. Taking $g = 9.8\\text{ m/s}^2$, find its speed after $${t0}$ seconds in $\\text{m/s}$. Round to two decimal places.`,
            `质量为 $${m}\\text{ 千克}$ 的物体从静止释放，下落时受线性空气阻力 $${b}v\\text{ 牛}$。取 $g = 9.8\\text{ 米/秒}^2$，求 $${t0}$ 秒后的速度（米/秒），精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(
                round2(vt.toNumber()),
                "That is the terminal velocity, which the object only approaches.",
                "这是终端速度，物体只是趋近它。",
              ),
              why(round2(9.8 * t0), "That ignores the drag and lets the object fall freely.", "这忽略了阻力，按自由落体计算。"),
              why(
                round2(vt.toNumber() * e),
                "That is the gap still left to the terminal velocity, not the speed.",
                "这是距终端速度还剩的差距，不是速度。",
              ),
              why(
                round2(vt.toNumber() * (1 - Math.exp(-b * t0))),
                "That leaves the mass out of the exponent; it is $\\frac{b}{m}t$.",
                "这在指数中漏掉了质量；指数是 $\\frac{b}{m}t$。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Find the terminal velocity", "求终端速度"],
                t("", ""),
                [`v_{\\text{term}} = \\frac{mg}{b} = ${m} \\cdot 9.8 \\div ${b} = ${dec(vt)}, \\qquad \\frac{b}{m} = ${dec(rate)}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`v(${t0}) = ${dec(vt)}\\left(1 - e^{-${expo}}\\right) \\approx ${dec(ans)}`]],
            ],
            t(
              `The speed $${dec(ans)}$ m/s is below both the terminal velocity $${dec(vt)}$ m/s and the free-fall speed $9.8 \\cdot ${t0} = ${dec(Q.of(98 * t0, 10))}$ m/s, as drag must make it.`,
              `速度 $${dec(ans)}$ 米/秒既小于终端速度 $${dec(vt)}$ 米/秒，也小于自由落体速度 $9.8 \\cdot ${t0} = ${dec(Q.of(98 * t0, 10))}$ 米/秒，这正是阻力造成的。`,
            ),
          ),
        });
      },
    },
  ],
};

/** fallingBodyProblemsWithQuadraticDrag determines terminal velocity under quadratic resistance. */
export const fallingBodyProblemsWithQuadraticDrag: TopicDef = {
  id: "falling-body-problems-with-quadratic-drag",
  title: t("Falling Body Problems With Quadratic Drag", "二次阻力下的落体问题"),
  summary: t(
    "At high speed, air resistance is proportional to $v^2$: $m\\frac{dv}{dt} = mg - cv^2$, with terminal velocity $v_{\\text{term}} = \\sqrt{mg/c}$.",
    "高速运动时阻力与 $v^2$ 成正比：$m\\frac{dv}{dt} = mg - cv^2$，终端速度为 $v_{\\text{term}} = \\sqrt{mg/c}$。",
  ),
  intro: t(
    "A $10$ kg object falls with drag $0.4v^2$ N, so $10\\frac{dv}{dt} = 98 - 0.4v^2$. The drag balances the weight when $v^2 = \\frac{98}{0.4} = 245$, so $v_{\\text{term}} = \\sqrt{245} \\approx 15.65$ m/s. At $10$ m/s the acceleration is $9.8 - \\frac{0.4 \\cdot 100}{10} = 5.8$ m/s².\n\nCheck: at $v^2 = 245$ the drag is $0.4 \\cdot 245 = 98$ N, the weight.\n\nIn this lesson we model a fall with drag proportional to the square of the speed and find its terminal velocity and acceleration.",
    "一个 $10$ 千克的物体下落时受阻力 $0.4v^2$ 牛，所以 $10\\frac{dv}{dt} = 98 - 0.4v^2$。当 $v^2 = \\frac{98}{0.4} = 245$ 时阻力与重力平衡，所以 $v_{\\text{term}} = \\sqrt{245} \\approx 15.65$ 米/秒。速度为 $10$ 米/秒时加速度为 $9.8 - \\frac{0.4 \\cdot 100}{10} = 5.8$ 米/秒²。\n\n检验：$v^2 = 245$ 时阻力为 $0.4 \\cdot 245 = 98$ 牛，等于重力。\n\n本课我们为阻力与速度平方成正比的下落建模，求终端速度和加速度。",
  ),
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "terminal-velocity-with-quadratic-air-resistance",
      title: t("Terminal velocity with quadratic air resistance", "二次空气阻力下的收尾速度"),
      explanation: t(
        "With resistance proportional to the square of the speed, the balance of forces gives an equation for the square of the terminal velocity. At terminal velocity under quadratic drag, $mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$.\n\n> **Watch out.** The balance gives $v_{\\text{term}}^2$; take the square root at the end. With $mg = 1600$ N and drag $4v^2$ N, $v_{\\text{term}}^2 = 400$ and $v_{\\text{term}} = 20$ m/s, not $400$ m/s.",
        "当阻力与速率的平方成正比时，力的平衡给出关于终极速度平方的方程。二次空气阻力达到平衡时，$mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$。\n\n> **注意。** 平衡给出的是 $v_{\\text{term}}^2$，最后要开平方。若 $mg = 1600$ 牛，阻力 $4v^2$ 牛，$v_{\\text{term}}^2 = 400$，$v_{\\text{term}} = 20$ 米/秒，不是 $400$ 米/秒。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 10);
        const ans = rng.int(10, 50); // v_term in m/s
        const W = c * ans * ans; // mg
        return numberProblem({
          prompt: t(
            `An object with weight $mg = ${W}\\text{ N}$ falls vertically subject to quadratic air drag $F_d = ${c}v^2\\text{ N}$. Find the terminal velocity $v_{\\text{term}}$ in $\\text{m/s}$.`,
            `一个重力为 $mg = ${W}\\text{ 牛}$ 的物体在垂直下落过程中受到二次空气阻力 $F_d = ${c}v^2\\text{ 牛}$ 的作用。求其终端收尾速度 $v_{\\text{term}}$（单位：$\\text{米/秒}$）。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(ans * ans, "That is $v_{\\text{term}}^2$; take its square root.", "这是 $v_{\\text{term}}^2$；还要开平方。"),
            why(
              c * ans,
              "That multiplies the weight by $c$ before the square root instead of dividing.",
              "这在开平方前把重力乘以 $c$，而应除以 $c$。",
            ),
            why(W, "That is the weight; the speed comes from $cv^2 = mg$.", "这是重力；速度要由 $cv^2 = mg$ 求出。"),
          ]),
          solution: walked(
            [
              [
                ["Balance the forces", "力的平衡"],
                t("", ""),
                [`${c}v_{\\text{term}}^2 = ${W}, \\qquad v_{\\text{term}}^2 = ${W} \\div ${c} = ${ans * ans}`],
              ],
              [
                ["Take the square root", "开平方"],
                t("The speed is positive.", "速度为正。"),
                [`v_{\\text{term}} = \\sqrt{${ans * ans}} = ${ans}`],
              ],
            ],
            t(
              `At $${ans}$ m/s the drag is $${c} \\cdot ${ans}^2 = ${W}$ N, the weight, so the acceleration is zero.`,
              `在 $${ans}$ 米/秒时阻力为 $${c} \\cdot ${ans}^2 = ${W}$ 牛，等于重力，所以加速度为零。`,
            ),
          ),
        });
      },
    },
    {
      id: "acceleration-at-a-given-speed",
      figure: differentialEquationsDrawings1["falling-body-problems-with-quadratic-drag#acceleration-at-a-given-speed"],
      title: t("Acceleration at a given speed", "给定速度时的加速度"),
      explanation: t(
        "Before terminal velocity is reached, the net force is not zero. Dividing $m\\frac{dv}{dt} = mg - cv^{2}$ by $m$ gives the acceleration at any speed:\n\n$$\\frac{dv}{dt} = g - \\frac{c}{m}v^{2} = g\\left(1 - \\frac{v^{2}}{v_{\\text{term}}^{2}}\\right).$$\n\nAt half the terminal speed the drag is a quarter of the weight, so the acceleration is $\\frac{3}{4}g$. A negative value means the object is moving faster than $v_{\\text{term}}$ and slowing down.\n\n> **Watch out.** The drag is a force, so divide it by the mass before subtracting from $g$. For $m = 5$ kg, drag $0.2v^2$ N and $v = 10$ m/s, $\\frac{dv}{dt} = 9.8 - \\frac{20}{5} = 5.8$, not $9.8 - 20 = -10.2$.",
        "在达到终端速度之前，合力不为零。把 $m\\frac{dv}{dt} = mg - cv^{2}$ 两边除以 $m$，得到任意速度下的加速度：\n\n$$\\frac{dv}{dt} = g - \\frac{c}{m}v^{2} = g\\left(1 - \\frac{v^{2}}{v_{\\text{term}}^{2}}\\right).$$\n\n速度为终端速度的一半时，阻力是重力的四分之一，所以加速度为 $\\frac{3}{4}g$。若结果为负，说明物体比 $v_{\\text{term}}$ 快，正在减速。\n\n> **注意。** 阻力是力，要先除以质量再从 $g$ 中减去。若 $m = 5$ 千克，阻力 $0.2v^2$ 牛，$v = 10$ 米/秒，则 $\\frac{dv}{dt} = 9.8 - \\frac{20}{5} = 5.8$，不是 $9.8 - 20 = -10.2$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([2, 4, 5, 8, 10, 20, 25, 50]);
        const c = rng.pick([1, 2, 4, 5]) * (rng.bool() ? 1 : 10);
        const cq = Q.of(c, 100);
        const vMax = Math.floor(Math.sqrt((9.8 * m) / cq.toNumber()));
        const v = rng.int(1, Math.max(1, vMax - 1));
        const drag = cq.mul(Q.of(v * v));
        const ans = Q.of(98, 10).sub(drag.div(Q.of(m)));
        return numberProblem({
          prompt: t(
            `An object of mass $${m}\\text{ kg}$ falls with quadratic air resistance $${dec(cq)}v^{2}\\text{ N}$. Taking $g = 9.8\\text{ m/s}^2$, find its acceleration $\\frac{dv}{dt}$ in $\\text{m/s}^2$ at the moment its speed is $${v}\\text{ m/s}$.`,
            `质量为 $${m}\\text{ 千克}$ 的物体下落时受二次空气阻力 $${dec(cq)}v^{2}\\text{ 牛}$。取 $g = 9.8\\text{ 米/秒}^2$，求速度为 $${v}\\text{ 米/秒}$ 时的加速度 $\\frac{dv}{dt}$（米/秒²）。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(ans, [
            why(Q.of(98, 10).sub(drag), "That subtracts the drag force without dividing it by the mass.", "这直接减去阻力，没有除以质量。"),
            why(
              Q.of(98, 10).sub(cq.mul(Q.of(v)).div(Q.of(m))),
              "That uses $v$ instead of $v^2$ in the drag.",
              "这在阻力中用了 $v$ 而不是 $v^2$。",
            ),
            why(drag.div(Q.of(m)), "That is the deceleration from drag alone; gravity is missing.", "这只是阻力产生的减速度，漏了重力。"),
            why(Q.of(98, 10), "That ignores the drag.", "这忽略了阻力。"),
          ]),
          solution: walked(
            [
              [["Find the drag", "求阻力"], t("", ""), [`${dec(cq)} \\cdot ${v}^{2} = ${dec(drag)}`]],
              [
                ["Divide by $m$ and subtract", "除以 $m$ 再相减"],
                t("", ""),
                [`\\frac{dv}{dt} = 9.8 - \\frac{${dec(drag)}}{${m}} = 9.8 - ${dec(drag.div(Q.of(m)))} = ${dec(ans)}`],
              ],
            ],
            t(
              `Multiplying back, $${m} \\cdot ${dec(ans)} = ${dec(Q.of(m).mul(ans))}$ N equals the weight $${dec(Q.of(98 * m, 10))}$ N minus the drag $${dec(drag)}$ N.`,
              `反过来乘回去，$${m} \\cdot ${dec(ans)} = ${dec(Q.of(m).mul(ans))}$ 牛，等于重力 $${dec(Q.of(98 * m, 10))}$ 牛减去阻力 $${dec(drag)}$ 牛。`,
            ),
          ),
        });
      },
    },
  ],
};

/** newtonsLawOfUniversalGravitation models gravitational attraction as an inverse-square law. */
export const newtonsLawOfUniversalGravitation: TopicDef = {
  id: "newtons-law-of-universal-gravitation",
  title: t("Newton's Law of Universal Gravitation", "万有引力定律"),
  summary: t(
    "Gravitational force is inversely proportional to $r^2$: $F = -\\frac{GMm}{r^2} = -mg_0\\left(\\frac{R}{r}\\right)^2$, so acceleration changes with distance on a planetary scale.",
    "引力与距离平方成反比：$F = -\\frac{GMm}{r^2} = -mg_0\\left(\\frac{R}{r}\\right)^2$，因此在天体尺度上加速度随距离变化。",
  ),
  intro: t(
    "On a planet with surface gravity $g_0 = 12$ m/s², a satellite at $r = 2R$ from the center feels $g = 12\\left(\\frac{R}{2R}\\right)^2 = 3$ m/s². Going the other way, gravity is $\\frac{1}{9}$ of its surface value where $\\frac{R}{r} = \\frac{1}{3}$, at $r = 3R$, an altitude of $2R$.\n\nCheck: $12 \\div 2^2 = 3$, and $\\left(\\frac{R}{3R}\\right)^2 = \\frac{1}{9}$.\n\nIn this lesson we use the inverse-square law to find gravity at a distance and the altitude where it has a given strength.",
    "在表面重力加速度 $g_0 = 12$ 米/秒² 的行星上，距中心 $r = 2R$ 的卫星受到 $g = 12\\left(\\frac{R}{2R}\\right)^2 = 3$ 米/秒²。反过来，重力加速度是表面值的 $\\frac{1}{9}$ 的地方满足 $\\frac{R}{r} = \\frac{1}{3}$，即 $r = 3R$，高度为 $2R$。\n\n检验：$12 \\div 2^2 = 3$，并且 $\\left(\\frac{R}{3R}\\right)^2 = \\frac{1}{9}$。\n\n本课我们用平方反比定律求某一距离处的重力加速度，以及重力加速度为给定值的高度。",
  ),
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "inverse-square-gravitational-force-and-acceleration",
      title: t("Inverse-square gravitational force and acceleration", "万有引力的平方反比律与加速度"),
      explanation: t(
        "The acceleration of gravity at distance $r$ from the planetary center is $g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$, where $g_0$ is the acceleration at the planet's surface $r = R$.\n\n> **Watch out.** Divide by the square of the distance ratio, not the ratio. With $g_0 = 18$ m/s² at $r = 3R$, $g = \\frac{18}{9} = 2$ m/s², not $\\frac{18}{3} = 6$ m/s².",
        "距行星中心距离为 $r$ 处的重力加速度为 $g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$，其中 $g_0$ 为行星表面（$r = R$）处的重力加速度。\n\n> **注意。** 要除以距离比的平方，而不是距离比。若 $g_0 = 18$ 米/秒²，在 $r = 3R$ 处 $g = \\frac{18}{9} = 2$ 米/秒²，不是 $\\frac{18}{3} = 6$ 米/秒²。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 9);
        const k = rng.int(1, 8);
        const g0 = k * n * n; // surface gravity
        const ans = k; // acceleration at distance n R
        return numberProblem({
          prompt: t(
            `A spherical planet has radius $R$ and surface gravitational acceleration $g_0 = ${g0}\\text{ m/s}^2$. What is the magnitude of the gravitational acceleration (in $\\text{m/s}^2$) experienced by a satellite orbiting at a distance of $r = ${n}R$ from the center of the planet?`,
            `一颗半径为 $R$ 的球形行星，其表面重力加速度为 $g_0 = ${g0}\\text{ 米/秒}^2$。一颗卫星在距离行星中心 $r = ${n}R$ 处的轨道上运行，其受到的重力加速度大小（单位：$\\text{米/秒}^2$）是多少？`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(k * n, "That divides by the distance ratio, not its square.", "这除以了距离比，而不是它的平方。"),
            why(
              g0 * n * n,
              "That multiplies by the square of the ratio; gravity weakens with distance.",
              "这乘以了比的平方；重力随距离减弱。",
            ),
            why(g0, "That is the surface value; the satellite is farther from the center.", "这是表面值；卫星离中心更远。"),
          ]),
          solution: walked(
            [
              [
                ["Use the inverse-square law", "用平方反比定律"],
                t("", ""),
                [`g = g_0\\left(\\frac{R}{${n}R}\\right)^2 = \\frac{g_0}{${n * n}}`],
              ],
              [["Substitute", "代入"], t("", ""), [`g = ${g0} \\div ${n * n} = ${ans}`]],
            ],
            t(
              `Going back, $${ans} \\cdot ${n}^2 = ${g0}$, the surface value, and $${ans} < ${g0}$ because the satellite is farther out.`,
              `反过来，$${ans} \\cdot ${n}^2 = ${g0}$，正是表面值；而 $${ans} < ${g0}$，因为卫星更远。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-altitude-for-a-given-gravity",
      title: t("The altitude for a given gravity", "给定重力加速度对应的高度"),
      explanation: t(
        "Running the inverse-square law backwards finds where gravity has a given strength. From $g(r) = g_0\\left(\\frac{R}{r}\\right)^{2}$,\n\n$$r = R\\sqrt{\\frac{g_0}{g}},$$\n\nand the altitude above the surface is $h = r - R$. Gravity is a quarter of its surface value at $r = 2R$, an altitude of one planetary radius, and a ninth of it at $r = 3R$. The answer is a distance from the center first; subtracting $R$ is the step most often forgotten.\n\n> **Watch out.** Take the square root of the gravity ratio before multiplying by $R$. For a quarter of surface gravity on a $6000$ km planet, $r = 6000 \\cdot 2 = 12000$ km and $h = 6000$ km, not $6000 \\cdot 4 - 6000 = 18000$ km.",
        "把平方反比定律反过来用，可以求出重力加速度为给定值的位置。由 $g(r) = g_0\\left(\\frac{R}{r}\\right)^{2}$，\n\n$$r = R\\sqrt{\\frac{g_0}{g}},$$\n\n距地表的高度为 $h = r - R$。重力加速度在 $r = 2R$（高度为一个行星半径）处是地表的四分之一，在 $r = 3R$ 处是九分之一。先求出的是到中心的距离，最常忘记的一步是减去 $R$。\n\n> **注意。** 先对重力之比开平方，再乘以 $R$。在半径 $6000$ 千米的行星上，重力为表面四分之一处 $r = 6000 \\cdot 2 = 12000$ 千米，$h = 6000$ 千米，不是 $6000 \\cdot 4 - 6000 = 18000$ 千米。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.pick([1700, 2400, 3400, 6000, 6400, 7000]);
        const [p, q] = rng.pick([
          [2, 1],
          [3, 1],
          [4, 1],
          [3, 2],
          [5, 2],
          [5, 4],
          [5, 3],
        ] as const);
        const ratio = Q.of(q * q, p * p);
        const k = Q.of(p, q);
        const r = Q.of(R * p, q);
        const ans = r.sub(Q.of(R));
        return numberProblem({
          prompt: t(
            `A planet has radius $${R}\\text{ km}$. At what altitude above its surface, in km, is the gravitational acceleration $${ratio.toLatex()}$ of its surface value?`,
            `某行星半径为 $${R}\\text{ 千米}$。在距其表面多高（千米）处，重力加速度是表面值的 $${ratio.toLatex()}$？`,
          ),
          answer: ans,
          unit: "km",
          mistakes: apart(ans, [
            why(r, "That is the distance from the center; subtract the radius for the altitude.", "这是到中心的距离；减去半径才是高度。"),
            why(Q.of(R).div(ratio).sub(Q.of(R)), "That forgets the square root of the gravity ratio.", "这忘了对重力之比开平方。"),
            why(Q.of(R).div(ratio), "That forgets both the square root and subtracting the radius.", "这既忘了开平方，也忘了减去半径。"),
          ]),
          solution: walked(
            [
              [
                ["Find the distance from the center", "求到中心的距离"],
                t("", ""),
                [
                  `\\left(\\frac{R}{r}\\right)^2 = ${ratio.toLatex()}, \\qquad \\frac{r}{R} = ${k.toLatex()}, \\qquad r = ${R} \\cdot ${k.toLatex()} = ${r.toLatex()}`,
                ],
              ],
              [["Subtract the radius", "减去半径"], t("", ""), [`h = ${r.toLatex()} - ${R} = ${ans.toLatex()}`]],
            ],
            t(
              `At $r = ${r.toLatex()}$ km, $\\left(\\frac{${R}}{${r.toLatex()}}\\right)^2 = \\left(${Q.of(q, p).toLatex()}\\right)^2 = ${ratio.toLatex()}$, the required fraction of surface gravity.`,
              `在 $r = ${r.toLatex()}$ 千米处，$\\left(\\frac{${R}}{${r.toLatex()}}\\right)^2 = \\left(${Q.of(q, p).toLatex()}\\right)^2 = ${ratio.toLatex()}$，正是所要求的表面重力比例。`,
            ),
          ),
        });
      },
    },
  ],
};

/** modelingEscapeVelocityWithFirstOrderOdes derives escape velocity via chain rule. */
export const modelingEscapeVelocityWithFirstOrderOdes: TopicDef = {
  id: "modeling-escape-velocity-with-first-order-odes",
  title: t("Modeling Escape Velocity With First-Order ODEs", "一阶微分方程建模逃逸速度"),
  summary: t(
    "Integrating $v\\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$ from $r = R$ to $\\infty$ gives the escape velocity $v_{\\text{esc}} = \\sqrt{2g_0 R}$.",
    "把 $v\\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$ 从 $r = R$ 积分到 $\\infty$，得逃逸速度 $v_{\\text{esc}} = \\sqrt{2g_0 R}$。",
  ),
  intro: t(
    "By the chain rule $\\frac{dv}{dt} = v\\frac{dv}{dr}$, so a rocket coasting away from a planet obeys $v\\frac{dv}{dr} = -\\frac{g_0R^2}{r^2}$. Integrating from the surface gives $v^2 = v_0^2 - 2g_0R\\left(1 - \\frac{R}{r}\\right)$. If $2g_0R = 100\\text{ (km/s)}^2$, a launch at $v_0 = 10$ km/s just keeps $v^2 \\ge 0$ all the way out: the escape velocity is $10$ km/s.\n\nCheck: with $v_0^2 = 100$, $v^2 = 100\\frac{R}{r}$, which is positive for every $r$ and tends to $0$.\n\nIn this lesson we derive the escape velocity and find how high a slower launch reaches.",
    "由链式法则 $\\frac{dv}{dt} = v\\frac{dv}{dr}$，远离行星滑行的火箭满足 $v\\frac{dv}{dr} = -\\frac{g_0R^2}{r^2}$。从表面积分得 $v^2 = v_0^2 - 2g_0R\\left(1 - \\frac{R}{r}\\right)$。若 $2g_0R = 100\\text{ (千米/秒)}^2$，以 $v_0 = 10$ 千米/秒发射恰好使 $v^2 \\ge 0$ 一直成立：逃逸速度为 $10$ 千米/秒。\n\n检验：当 $v_0^2 = 100$ 时 $v^2 = 100\\frac{R}{r}$，对每个 $r$ 都为正并趋于 $0$。\n\n本课我们推导逃逸速度，并求较慢的发射能达到的高度。",
  ),
  prerequisites: ["newtons-law-of-universal-gravitation"],
  encompasses: [{ topic: "newtons-law-of-universal-gravitation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "deriving-escape-velocity-via-chain-rule",
      title: t("Deriving escape velocity via chain rule", "应用链式法则推导天体逃逸速度"),
      explanation: t(
        "Writing acceleration in terms of distance lets you integrate from the surface to infinity, and the escape velocity is the speed that just reaches zero far away. By rewriting acceleration as $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$ and integrating $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$, we find $v_{\\text{esc}}^2 = 2 g_0 R$.\n\n> **Watch out.** The integration gives $v_{\\text{esc}}^2$; the speed is its square root. If $2g_0R = 121\\text{ (km/s)}^2$, $v_{\\text{esc}} = 11$ km/s, not $121$ km/s.",
        "把加速度用距离表示，就可以从表面积分到无穷远，逃逸速度就是在无穷远处恰好减为零的速度。将加速度改写为 $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$，两端积分 $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$，可求得逃逸速度平方 $v_{\\text{esc}}^2 = 2 g_0 R$。\n\n> **注意。** 积分给出的是 $v_{\\text{esc}}^2$；速度是它的平方根。若 $2g_0R = 121\\text{ (千米/秒)}^2$，$v_{\\text{esc}} = 11$ 千米/秒，不是 $121$ 千米/秒。",
      ),
      generate(rng: Rng): Problem {
        const ans = rng.int(4, 30); // v_esc in km/s
        const product = ans * ans; // 2 g0 R in (km/s)^2
        return numberProblem({
          prompt: t(
            `For a planet with radius $R$ and surface gravity $g_0$, suppose the quantity $2 g_0 R = ${product}\\text{ (km/s)}^2$. Using the differential equation $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$, find the escape velocity $v_{\\text{esc}}$ of the planet in $\\text{km/s}$.`,
            `对于某颗表面重力加速度为 $g_0$、半径为 $R$ 的行星，已知 $2 g_0 R = ${product}\\text{ (千米/秒)}^2$。利用径向运动微分方程 $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$，求该行星的逃逸速度 $v_{\\text{esc}}$（单位：$\\text{千米/秒}$）。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(product, "That is $v_{\\text{esc}}^2$; take its square root.", "这是 $v_{\\text{esc}}^2$；还要开平方。"),
            why(
              Q.of(product, 2),
              "That halves $2g_0R$ and skips the square root; $v_{\\text{esc}}^2$ is $2g_0R$ itself.",
              "这把 $2g_0R$ 减半且没开平方；$v_{\\text{esc}}^2$ 就等于 $2g_0R$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate from the surface to infinity", "从表面积分到无穷远"],
                t(
                  "The speed falls from $v_{\\text{esc}}$ to $0$ as $r$ goes from $R$ to $\\infty$.",
                  "当 $r$ 从 $R$ 到 $\\infty$ 时，速度从 $v_{\\text{esc}}$ 降到 $0$。",
                ),
                [
                  `\\int_{v_{\\text{esc}}}^{0} v\\,dv = -g_0R^2\\int_R^\\infty \\frac{dr}{r^2}, \\qquad -\\frac{1}{2}v_{\\text{esc}}^2 = -g_0R`,
                ],
              ],
              [
                ["Solve", "求解"],
                t("", ""),
                [`v_{\\text{esc}}^2 = 2g_0R = ${product}, \\qquad v_{\\text{esc}} = \\sqrt{${product}} = ${ans}`],
              ],
            ],
            t(`Squaring back, $${ans}^2 = ${product} = 2g_0R$.`, `平方回去，$${ans}^2 = ${product} = 2g_0R$。`),
          ),
        });
      },
    },
    {
      id: "maximum-distance-below-escape-velocity",
      title: t("The maximum distance below escape velocity", "低于逃逸速度时的最远距离"),
      explanation: t(
        "Integrating $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$ from the surface, where $v = v_0$, to a general $r$ gives\n\n$$v^{2} = v_0^{2} - 2g_0R\\left(1 - \\frac{R}{r}\\right) = v_0^{2} - v_{\\text{esc}}^{2}\\left(1 - \\frac{R}{r}\\right).$$\n\nIf $v_0 < v_{\\text{esc}}$ the object stops where $v = 0$, at $\\frac{R}{r_{\\max}} = 1 - \\frac{v_0^{2}}{v_{\\text{esc}}^{2}}$. Launched at half the escape speed, it reaches $r_{\\max} = \\frac{R}{1 - 1/4} = \\frac{4}{3}R$ from the center.\n\n> **Watch out.** Square the speed ratio, and subtract $R$ at the end for the altitude. At half the escape speed on a $6000$ km planet, $r_{\\max} = 8000$ km and the altitude is $2000$ km, not $\\frac{6000}{1 - 1/2} - 6000 = 6000$ km.",
        "从地表（$v = v_0$）到一般的 $r$ 积分 $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$，得\n\n$$v^{2} = v_0^{2} - 2g_0R\\left(1 - \\frac{R}{r}\\right) = v_0^{2} - v_{\\text{esc}}^{2}\\left(1 - \\frac{R}{r}\\right).$$\n\n若 $v_0 < v_{\\text{esc}}$，物体在 $v = 0$ 处停下，此时 $\\frac{R}{r_{\\max}} = 1 - \\frac{v_0^{2}}{v_{\\text{esc}}^{2}}$。以逃逸速度的一半发射，它到达距中心 $r_{\\max} = \\frac{R}{1 - 1/4} = \\frac{4}{3}R$ 处。\n\n> **注意。** 速度之比要平方，最后减去 $R$ 才是高度。在半径 $6000$ 千米的行星上以逃逸速度的一半发射，$r_{\\max} = 8000$ 千米，高度为 $2000$ 千米，不是 $\\frac{6000}{1 - 1/2} - 6000 = 6000$ 千米。",
      ),
      generate(rng: Rng): Problem {
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
        ] as const);
        const R = rng.pick([1700, 2400, 3400, 6000, 6400]);
        const k2 = Q.of(p * p, q * q);
        const left = Q.one.sub(k2);
        const factor = Q.one.div(left);
        const rMax = Q.of(R).mul(factor);
        const ans = rMax.sub(Q.of(R));
        return numberProblem({
          prompt: t(
            `A probe is launched straight up from the surface of an airless planet of radius $${R}\\text{ km}$ at $${Q.of(p, q).toLatex()}$ of the escape velocity. Using $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$, find the greatest altitude it reaches above the surface, in km.`,
            `从半径为 $${R}\\text{ 千米}$ 的无大气行星表面竖直向上发射一个探测器，初速度为逃逸速度的 $${Q.of(p, q).toLatex()}$。利用 $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$，求它距表面的最大高度（千米）。`,
          ),
          answer: ans,
          unit: "km",
          mistakes: apart(ans, [
            why(
              rMax,
              "That is the distance from the center; subtract the radius for the altitude.",
              "这是到中心的距离；减去半径才是高度。",
            ),
            why(
              Q.of(R).mul(k2),
              "That treats gravity as constant all the way up; it weakens with distance, so the probe climbs higher.",
              "这把重力当作一路不变；重力随距离减弱，所以探测器会升得更高。",
            ),
            why(
              Q.of(R)
                .div(Q.one.sub(Q.of(p, q)))
                .sub(Q.of(R)),
              "That uses the speed ratio without squaring it.",
              "这用了速度之比，却没有平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find where the speed vanishes", "求速度为零的位置"],
                t(
                  `With $v_0^2 = ${k2.toLatex()}v_{\\text{esc}}^2$, set $v^2 = 0$.`,
                  `由 $v_0^2 = ${k2.toLatex()}v_{\\text{esc}}^2$，令 $v^2 = 0$。`,
                ),
                [`1 - \\frac{R}{r_{\\max}} = ${k2.toLatex()}, \\qquad \\frac{R}{r_{\\max}} = ${left.toLatex()}`],
              ],
              [
                ["Solve for the altitude", "求高度"],
                t("", ""),
                [
                  `r_{\\max} = ${R} \\cdot ${factor.toLatex()} = ${rMax.toLatex()}, \\qquad h = ${rMax.toLatex()} - ${R} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `At $r_{\\max} = ${rMax.toLatex()}$ km, $1 - \\frac{R}{r_{\\max}} = 1 - ${left.toLatex()} = ${k2.toLatex()}$, so $v^2 = v_0^2 - ${k2.toLatex()}v_{\\text{esc}}^2 = 0$ there.`,
              `在 $r_{\\max} = ${rMax.toLatex()}$ 千米处，$1 - \\frac{R}{r_{\\max}} = 1 - ${left.toLatex()} = ${k2.toLatex()}$，所以那里 $v^2 = v_0^2 - ${k2.toLatex()}v_{\\text{esc}}^2 = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** modelingRlCircuitsWithFirstOrderOdes models series RL circuit transient and steady state. */
export const modelingRlCircuitsWithFirstOrderOdes: TopicDef = {
  id: "modeling-rl-circuits-with-first-order-odes",
  title: t("Modeling RL Circuits With First-Order ODEs", "一阶微分方程建模 RL 电路"),
  summary: t(
    "In a series RL circuit the current satisfies $L\\frac{di}{dt} + Ri = V(t)$; under a constant voltage $V_0$ it tends to $i_\\infty = \\frac{V_0}{R}$.",
    "串联 RL 电路中电流满足 $L\\frac{di}{dt} + Ri = V(t)$；在恒定电压 $V_0$ 下趋于 $i_\\infty = \\frac{V_0}{R}$。",
  ),
  intro: t(
    "A $2$ H inductor and a $10\\ \\Omega$ resistor are switched onto $30$ V, so $2\\frac{di}{dt} + 10i = 30$. The current settles at $i_\\infty = \\frac{30}{10} = 3$ A, and from $i(0) = 0$ it is $i = 3\\left(1 - e^{-5t}\\right)$; at $t = 0.2$ s that is $3(1 - e^{-1}) \\approx 1.90$ A.\n\nCheck: $2i' + 10i = 30e^{-5t} + 30 - 30e^{-5t} = 30$, and $i(0) = 0$.\n\nIn this lesson we model a series RL circuit and find its steady current and its current at a given time.",
    "$2$ 亨的电感与 $10\\ \\Omega$ 的电阻接到 $30$ 伏电源上，所以 $2\\frac{di}{dt} + 10i = 30$。电流稳定在 $i_\\infty = \\frac{30}{10} = 3$ 安，从 $i(0) = 0$ 开始 $i = 3\\left(1 - e^{-5t}\\right)$；在 $t = 0.2$ 秒时为 $3(1 - e^{-1}) \\approx 1.90$ 安。\n\n检验：$2i' + 10i = 30e^{-5t} + 30 - 30e^{-5t} = 30$，并且 $i(0) = 0$。\n\n本课我们为串联 RL 电路建模，求稳态电流和某一时刻的电流。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rl-circuit-transient-and-steady-state-current",
      title: t("Steady-state current in an RL circuit", "RL 串联电路的稳态电流"),
      explanation: t(
        "For an RL circuit governed by $L\\frac{di}{dt} + Ri = V_0$, the current is $i(t) = \\frac{V_0}{R}(1 - e^{-Rt/L})$. As $t \\to \\infty$, the inductor acts as a short circuit ($\\frac{di}{dt} = 0$), giving steady-state current $i_\\infty = \\frac{V_0}{R}$.\n\n> **Watch out.** The inductance only sets how fast the current settles, not where. With $V_0 = 24$ V, $R = 6\\ \\Omega$ and $L = 3$ H, $i_\\infty = \\frac{24}{6} = 4$ A, not $\\frac{24}{3} = 8$ A.",
        "对于由 $L\\frac{di}{dt} + Ri = V_0$ 描述的 RL 电路，通解为 $i(t) = \\frac{V_0}{R}(1 - e^{-Rt/L})$。当 $t \\to \\infty$ 时，电感相当于短路导线（$\\frac{di}{dt} = 0$），稳态电流为 $i_\\infty = \\frac{V_0}{R}$。\n\n> **注意。** 电感只决定电流稳定得多快，不决定稳定在哪里。若 $V_0 = 24$ 伏，$R = 6\\ \\Omega$，$L = 3$ 亨，$i_\\infty = \\frac{24}{6} = 4$ 安，不是 $\\frac{24}{3} = 8$ 安。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 30);
        const ans = rng.int(2, 25); // i_infinity in Amperes
        const V0 = R * ans;
        const L = rng.int(2, 8);
        return numberProblem({
          prompt: t(
            `A series circuit contains an inductor of inductance $L = ${L}\\text{ H}$, a resistor of resistance $R = ${R}\\ \\Omega$, and a constant DC voltage source $V_0 = ${V0}\\text{ V}$. Find the steady-state current $i_\\infty$ (in Amperes) as $t \\to \\infty$.`,
            `一个串联电路由电感 $L = ${L}\\text{ 亨}$、电阻 $R = ${R}\\ \\Omega$ 以及直流恒压源 $V_0 = ${V0}\\text{ 伏}$ 组成。求当 $t \\to \\infty$ 时电路中的稳态电流 $i_\\infty$（单位：安培）。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(V0, L),
              "That divides by the inductance; at steady state only the resistor limits the current.",
              "这除以了电感；稳态时只有电阻限制电流。",
            ),
            why(
              Q.of(V0, R + L),
              "That adds the inductance to the resistance as if it were another resistor.",
              "这把电感当作另一个电阻加到了电阻上。",
            ),
            why(V0, "That is the voltage; divide it by the resistance.", "这是电压；要除以电阻。"),
          ]),
          solution: walked(
            [
              [
                ["Set the rate to zero", "令变化率为零"],
                t("At steady state the current stops changing.", "稳态时电流不再变化。"),
                [`${L} \\cdot 0 + ${R}i_\\infty = ${V0}`],
              ],
              [["Solve", "求解"], t("", ""), [`i_\\infty = ${V0} \\div ${R} = ${ans}`]],
            ],
            t(
              `At $${ans}$ A the resistor drops $${R} \\cdot ${ans} = ${V0}$ V, the whole supply, leaving nothing across the inductor, so $\\frac{di}{dt} = 0$.`,
              `电流为 $${ans}$ 安时电阻上的压降为 $${R} \\cdot ${ans} = ${V0}$ 伏，正是全部电源电压，电感上没有电压，所以 $\\frac{di}{dt} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-current-at-a-given-time",
      title: t("The current at a given time", "某一时刻的电流"),
      explanation: t(
        "With $i(0) = 0$, the linear equation $L\\frac{di}{dt} + Ri = V_0$ has the solution\n\n$$i(t) = \\frac{V_0}{R}\\left(1 - e^{-Rt/L}\\right).$$\n\nThe **time constant** $\\tau = \\frac{L}{R}$ sets the pace: after one time constant the current has reached $1 - e^{-1} \\approx 63\\%$ of its steady value, and after five it is within $1\\%$. A $2$ H inductor with $R = 10\\ \\Omega$ has $\\tau = 0.2$ s.\n\n> **Watch out.** The exponent is $\\frac{R}{L}t$, not $\\frac{L}{R}t$. With $L = 2$ H, $R = 10\\ \\Omega$ and $i_\\infty = 3$ A, at $t = 0.2$ s the current is $3(1 - e^{-1}) \\approx 1.90$ A, not $3(1 - e^{-0.04}) \\approx 0.12$ A.",
        "当 $i(0) = 0$ 时，线性方程 $L\\frac{di}{dt} + Ri = V_0$ 的解为\n\n$$i(t) = \\frac{V_0}{R}\\left(1 - e^{-Rt/L}\\right).$$\n\n**时间常数** $\\tau = \\frac{L}{R}$ 决定变化快慢：经过一个时间常数，电流达到稳态值的 $1 - e^{-1} \\approx 63\\%$，经过五个时间常数后误差小于 $1\\%$。$2$ 亨的电感与 $R = 10\\ \\Omega$ 的电阻，$\\tau = 0.2$ 秒。\n\n> **注意。** 指数是 $\\frac{R}{L}t$，不是 $\\frac{L}{R}t$。若 $L = 2$ 亨，$R = 10\\ \\Omega$，$i_\\infty = 3$ 安，在 $t = 0.2$ 秒时电流为 $3(1 - e^{-1}) \\approx 1.90$ 安，不是 $3(1 - e^{-0.04}) \\approx 0.12$ 安。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.pick([1, 2, 4, 5, 10]);
        const R = rng.pick([2, 4, 5, 8, 10, 20]);
        const iInf = rng.int(1, 12);
        const V0 = iInf * R;
        const t0 = Q.of(rng.int(1, 10), 10);
        const rt = Q.of(R, L).mul(t0);
        const e = Math.exp(-rt.toNumber());
        const ans = round2(iInf * (1 - e));
        return numberProblem({
          prompt: t(
            `A series circuit has an inductor $L = ${L}\\text{ H}$, a resistor $R = ${R}\\ \\Omega$ and a constant voltage $V_0 = ${V0}\\text{ V}$, switched on at $t = 0$ with no current. Find the current at $t = ${dec(t0)}$ s in amperes. Round to two decimal places.`,
            `串联电路中有电感 $L = ${L}\\text{ 亨}$、电阻 $R = ${R}\\ \\Omega$ 和恒定电压 $V_0 = ${V0}\\text{ 伏}$，在 $t = 0$ 时接通，初始电流为零。求 $t = ${dec(t0)}$ 秒时的电流（安），精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(round2(iInf), "That is the steady current, which is only approached.", "这是稳态电流，只是趋近它。"),
              why(
                round2(iInf * e),
                "That is the gap still left to the steady current, not the current.",
                "这是距稳态电流还剩的差距，不是电流。",
              ),
              why(
                round2(iInf * (1 - Math.exp((-L * t0.toNumber()) / R))),
                "That turns the exponent upside down; it is $\\frac{R}{L}t$.",
                "这把指数颠倒了；指数是 $\\frac{R}{L}t$。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Find the steady current and the rate", "求稳态电流与速率"],
                t("", ""),
                [`i_\\infty = ${V0} \\div ${R} = ${iInf}, \\qquad \\frac{R}{L} = ${Q.of(R, L).toLatex()}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`i(${dec(t0)}) = ${iInf}\\left(1 - e^{-${dec(rt)}}\\right) \\approx ${dec(ans)}`]],
            ],
            t(
              `The current $${dec(ans)}$ A is between $0$ and the steady $${iInf}$ A; the exponent $${dec(rt)}$ is $${dec(t0)}$ s divided by the time constant $${dec(Q.of(L, R))}$ s.`,
              `电流 $${dec(ans)}$ 安介于 $0$ 与稳态的 $${iInf}$ 安之间；指数 $${dec(rt)}$ 等于 $${dec(t0)}$ 秒除以时间常数 $${dec(Q.of(L, R))}$ 秒。`,
            ),
          ),
        });
      },
    },
  ],
};

/** modelingRcCircuitsWithFirstOrderOdes models series RC circuit charge and discharging. */
export const modelingRcCircuitsWithFirstOrderOdes: TopicDef = {
  id: "modeling-rc-circuits-with-first-order-odes",
  title: t("Modeling RC Circuits With First-Order ODEs", "一阶微分方程建模 RC 电路"),
  summary: t(
    "In a series RC circuit the charge satisfies $R\\frac{dq}{dt} + \\frac{1}{C}q = V(t)$; under a constant voltage $V_0$ it tends to $q_{\\max} = CV_0$.",
    "串联 RC 电路中电荷满足 $R\\frac{dq}{dt} + \\frac{1}{C}q = V(t)$；在恒定电压 $V_0$ 下趋于 $q_{\\max} = CV_0$。",
  ),
  intro: t(
    "A $5\\ \\mu$F capacitor charged with $100\\ \\mu$C discharges through $10$ k$\\Omega$, so $R\\frac{dq}{dt} + \\frac{q}{C} = 0$ and $q = 100e^{-t/50}$ with $t$ in ms, because $RC = 50$ ms. After $50$ ms, $q = 100e^{-1} \\approx 36.79\\ \\mu$C; connected to $20$ V instead, it would charge toward $CV_0 = 100\\ \\mu$C.\n\nCheck: $50q' + q = -100e^{-t/50} + 100e^{-t/50} = 0$, and $q(0) = 100$.\n\nIn this lesson we model a series RC circuit and find its final charge and its charge while discharging.",
    "一个 $5\\ \\mu$F、带电 $100\\ \\mu$C 的电容器通过 $10$ k$\\Omega$ 放电，所以 $R\\frac{dq}{dt} + \\frac{q}{C} = 0$，$q = 100e^{-t/50}$（$t$ 以毫秒计），因为 $RC = 50$ 毫秒。$50$ 毫秒后 $q = 100e^{-1} \\approx 36.79\\ \\mu$C；若改接 $20$ 伏电源，它会充电趋于 $CV_0 = 100\\ \\mu$C。\n\n检验：$50q' + q = -100e^{-t/50} + 100e^{-t/50} = 0$，并且 $q(0) = 100$。\n\n本课我们为串联 RC 电路建模，求最终电荷和放电过程中的电荷。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rc-circuit-charging-and-discharging",
      title: t("Steady-state capacitor charge in an RC circuit", "RC 串联电路的稳态电荷量"),
      explanation: t(
        "For an RC circuit $R\\frac{dq}{dt} + \\frac{q}{C} = V_0$, the charge builds up according to $q(t) = C V_0(1 - e^{-t/(RC)})$. At steady state as $t \\to \\infty$, the capacitor is fully charged with $q_\\infty = C V_0$.\n\n> **Watch out.** Multiply the voltage by the capacitance; the resistor only sets the pace. With $C = 4\\ \\mu$F and $V_0 = 50$ V, $q_\\infty = 200\\ \\mu$C, not $\\frac{50}{4} = 12.5\\ \\mu$C.",
        "对于 RC 充电电路 $R\\frac{dq}{dt} + \\frac{q}{C} = V_0$，电荷量积累规律为 $q(t) = C V_0(1 - e^{-t/(RC)})$。在稳态极限 $t \\to \\infty$ 时，电容器充满电，最大电荷量为 $q_\\infty = C V_0$。\n\n> **注意。** 是电压乘以电容；电阻只决定快慢。若 $C = 4\\ \\mu$F，$V_0 = 50$ 伏，$q_\\infty = 200\\ \\mu$C，不是 $\\frac{50}{4} = 12.5\\ \\mu$C。",
      ),
      generate(rng: Rng): Problem {
        const C = rng.int(2, 20); // in microfarads
        const V0 = rng.int(10, 100); // in Volts
        const ans = C * V0; // in microcoulombs
        const R = rng.int(10, 50); // in k-ohms
        return numberProblem({
          prompt: t(
            `A series circuit has a resistor $R = ${R}\\text{ k}\\Omega$, a capacitor $C = ${C}\\ \\mu\\text{F}$, and a constant voltage source $V_0 = ${V0}\\text{ V}$. Find the steady-state maximum charge $q_\\infty$ on the capacitor (in $\\mu\\text{C}$) as $t \\to \\infty$.`,
            `一个串联电路包含电阻 $R = ${R}\\text{ 千欧}$、电容 $C = ${C}\\ \\mu\\text{F}$ 以及恒定电源 $V_0 = ${V0}\\text{ 伏}$。求当 $t \\to \\infty$ 时电容器上的稳态最大电荷量 $q_\\infty$（单位：$\\mu\\text{C}$）。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(V0, C),
              "That divides the voltage by the capacitance; at full charge $\\frac{q}{C} = V_0$, so $q = CV_0$.",
              "这用电压除以电容；充满时 $\\frac{q}{C} = V_0$，所以 $q = CV_0$。",
            ),
            why(
              R * V0,
              "That multiplies by the resistance; the resistor only sets how fast the charge builds.",
              "这乘以了电阻；电阻只决定充电的快慢。",
            ),
            why(R * C, "That is the time constant $RC$, not the charge.", "这是时间常数 $RC$，不是电荷。"),
          ]),
          solution: walked(
            [
              [
                ["Set the current to zero", "令电流为零"],
                t("When the capacitor is full, no current flows.", "电容器充满时没有电流。"),
                [`R \\cdot 0 + \\frac{q_\\infty}{${C}} = ${V0}`],
              ],
              [["Solve", "求解"], t("", ""), [`q_\\infty = ${C} \\cdot ${V0} = ${ans}`]],
            ],
            t(
              `At $${ans}\\ \\mu$C the capacitor's voltage is $${ans} \\div ${C} = ${V0}$ V, the whole supply, so no voltage is left to drive a current through the resistor.`,
              `电荷为 $${ans}\\ \\mu$C 时电容器两端电压为 $${ans} \\div ${C} = ${V0}$ 伏，正是全部电源电压，电阻上没有电压推动电流。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-charge-while-discharging",
      title: t("The charge while discharging", "放电过程中的电荷"),
      explanation: t(
        "With no voltage source, $R\\frac{dq}{dt} + \\frac{q}{C} = 0$ is separable, and a capacitor that starts with charge $q_0$ discharges as\n\n$$q(t) = q_0 e^{-t/(RC)}.$$\n\nThe time constant is $\\tau = RC$; with $R$ in $\\text{k}\\Omega$ and $C$ in $\\mu\\text{F}$, the product $RC$ is in milliseconds. The charge halves every $RC\\ln 2$, so a $10\\text{ k}\\Omega$, $5\\ \\mu\\text{F}$ circuit has $\\tau = 50$ ms and loses half its charge in about $34.66$ ms.\n\n> **Watch out.** Divide the time by $RC$ in the exponent; do not multiply. In that circuit after $50$ ms, $\\frac{50}{50} = 1$ and $q = q_0e^{-1}$, not $q_0e^{-2500}$.",
        "没有电源时，$R\\frac{dq}{dt} + \\frac{q}{C} = 0$ 可分离变量，初始电荷为 $q_0$ 的电容器按下式放电：\n\n$$q(t) = q_0 e^{-t/(RC)}.$$\n\n时间常数为 $\\tau = RC$；$R$ 以 $\\text{k}\\Omega$、$C$ 以 $\\mu\\text{F}$ 为单位时，$RC$ 的单位是毫秒。电荷每经过 $RC\\ln 2$ 减半，所以 $10\\text{ k}\\Omega$、$5\\ \\mu\\text{F}$ 的电路 $\\tau = 50$ 毫秒，约 $34.66$ 毫秒后电荷减半。\n\n> **注意。** 指数中要用时间除以 $RC$，不是相乘。这个电路 $50$ 毫秒后 $\\frac{50}{50} = 1$，$q = q_0e^{-1}$，不是 $q_0e^{-2500}$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.pick([2, 4, 5, 10, 20, 25, 50]);
        const C = rng.pick([1, 2, 4, 5, 10]);
        const q0 = rng.int(2, 30) * 10;
        const tau = R * C;
        const askTime = rng.bool();
        if (askTime) {
          const n = rng.pick([2, 4, 5, 10]);
          const ans = round2(tau * Math.log(n));
          return numberProblem({
            prompt: t(
              `A capacitor $C = ${C}\\ \\mu\\text{F}$ holding charge $${q0}\\ \\mu\\text{C}$ discharges through a resistor $R = ${R}\\text{ k}\\Omega$. How many milliseconds does it take for the charge to fall to $\\frac{1}{${n}}$ of its initial value? Round to two decimal places.`,
              `带电 $${q0}\\ \\mu\\text{C}$ 的电容器 $C = ${C}\\ \\mu\\text{F}$ 通过电阻 $R = ${R}\\text{ k}\\Omega$ 放电。电荷降到初始值的 $\\frac{1}{${n}}$ 需要多少毫秒？精确到两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(
              ans,
              [
                why(
                  round2(tau / n),
                  "That divides the time constant by $n$; solving $e^{-t/RC} = \\frac{1}{n}$ needs a logarithm.",
                  "这把时间常数除以 $n$；解 $e^{-t/RC} = \\frac{1}{n}$ 需要取对数。",
                ),
                why(
                  round2(tau * n),
                  "That multiplies the time constant by $n$ instead of by $\\ln n$.",
                  "这把时间常数乘以 $n$，而应乘以 $\\ln n$。",
                ),
                why(
                  round2(Math.log(n) / tau),
                  "That divides $\\ln n$ by $RC$ instead of multiplying.",
                  "这用 $\\ln n$ 除以 $RC$，而应相乘。",
                ),
              ],
              true,
            ),
            solution: walked(
              [
                [
                  ["Find the time constant", "求时间常数"],
                  t("", ""),
                  [`\\tau = RC = ${R} \\cdot ${C} = ${tau}, \\qquad q(t) = ${q0}e^{-t/${tau}}`],
                ],
                [
                  ["Solve for $t$", "解出 $t$"],
                  t("Take the natural logarithm of both sides.", "两边取自然对数。"),
                  [`e^{-t/${tau}} = \\frac{1}{${n}}, \\qquad t = ${tau}\\ln ${n} \\approx ${dec(ans)}`],
                ],
              ],
              t(
                `The time does not depend on the starting $${q0}\\ \\mu$C: at $t = ${dec(ans)}$ ms, $e^{-${dec(ans)}/${tau}} \\approx \\frac{1}{${n}}$ of any start.`,
                `结果与初始的 $${q0}\\ \\mu$C 无关：在 $t = ${dec(ans)}$ 毫秒时，$e^{-${dec(ans)}/${tau}} \\approx \\frac{1}{${n}}$，对任何初值都成立。`,
              ),
            ),
          });
        }
        const t0 = rng.int(1, 4) * (tau >= 20 ? 10 : 2);
        const ans = round2(q0 * Math.exp(-t0 / tau));
        return numberProblem({
          prompt: t(
            `A capacitor $C = ${C}\\ \\mu\\text{F}$ holding charge $${q0}\\ \\mu\\text{C}$ discharges through a resistor $R = ${R}\\text{ k}\\Omega$. Find the charge in $\\mu\\text{C}$ after $${t0}$ ms. Round to two decimal places.`,
            `带电 $${q0}\\ \\mu\\text{C}$ 的电容器 $C = ${C}\\ \\mu\\text{F}$ 通过电阻 $R = ${R}\\text{ k}\\Omega$ 放电。求 $${t0}$ 毫秒后的电荷（$\\mu\\text{C}$），精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: apart(
            ans,
            [
              why(
                round2(q0 * (1 - Math.exp(-t0 / tau))),
                "That is the charge that has drained away, not what remains.",
                "这是已经放掉的电荷，不是剩下的。",
              ),
              why(
                round2(q0 * Math.exp(-t0 * tau)),
                "That multiplies the time by $RC$ in the exponent instead of dividing.",
                "这在指数中把时间乘以 $RC$，而应相除。",
              ),
              why(
                round2(q0 * Math.exp((-t0 * C) / R)),
                "That uses $\\frac{R}{C}$ as the time constant instead of $RC$.",
                "这把 $\\frac{R}{C}$ 当作时间常数，应为 $RC$。",
              ),
            ],
            true,
          ),
          solution: walked(
            [
              [
                ["Find the time constant", "求时间常数"],
                t("", ""),
                [`\\tau = RC = ${R} \\cdot ${C} = ${tau}, \\qquad q(t) = ${q0}e^{-t/${tau}}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`q(${t0}) = ${q0}e^{-${dec(Q.of(t0, tau))}} \\approx ${dec(ans)}`]],
            ],
            t(
              `The charge $${dec(ans)}\\ \\mu$C is less than the starting $${q0}\\ \\mu$C and more than $0$; the exponent $${dec(Q.of(t0, tau))}$ counts the time in units of $\\tau = ${tau}$ ms.`,
              `电荷 $${dec(ans)}\\ \\mu$C 小于初始的 $${q0}\\ \\mu$C 且大于 $0$；指数 $${dec(Q.of(t0, tau))}$ 是以 $\\tau = ${tau}$ 毫秒为单位的时间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** differentialEquationsModelingTopics gathers all Unit 2 topics. */
export const differentialEquationsModelingTopics: TopicDef[] = [
  modelingMixtureProblemsWithFirstOrderSeparableOdes,
  modelingMixtureProblemsWithFirstOrderLinearOdes,
  orthogonalTrajectories,
  inhibitedGrowthModelsWithFirstOrderOdes,
  inhibitedDecayModelsWithFirstOrderOdes,
  fallingBodyProblemsWithLinearDrag,
  fallingBodyProblemsWithQuadraticDrag,
  newtonsLawOfUniversalGravitation,
  modelingEscapeVelocityWithFirstOrderOdes,
  modelingRlCircuitsWithFirstOrderOdes,
  modelingRcCircuitsWithFirstOrderOdes,
];
