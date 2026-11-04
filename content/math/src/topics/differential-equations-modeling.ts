import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

/** round2 rounds a measured value to two decimal places. */
const round2 = (x: number): Q => Q.of(Math.round(x * 100), 100);

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
        "For a tank with volume $V$ where pure solvent enters at rate $r$ and well-mixed solution exits at rate $r$, the solute amount satisfies $\\frac{dS}{dt} = -\\frac{r}{V}S$. At any instant when the rate of solute loss is $D$, the amount of solute present is $S = D \\frac{V}{r}$.",
        "容积为 $V$ 的容器中，纯溶剂以速率 $r$ 流入，充分搅拌后的溶液以相同速率 $r$ 流出。溶质含量满足 $\\frac{dS}{dt} = -\\frac{r}{V}S$。当溶质流失速率为 $D$ 时，容器内现存溶质为 $S = D \\frac{V}{r}$。",
      ),
      generate(rng: Rng): Problem {
        const T = rng.int(10, 50); // V / r
        const r = rng.int(2, 8);
        const V = r * T;
        const D = rng.int(2, 25);
        const ans = D * T;

        const prompt = t(
          `A tank contains $${V}$ liters of salt solution. Pure water enters the tank at a rate of $${r}\\text{ L/min}$, and the thoroughly mixed solution drains at the same rate of $${r}\\text{ L/min}$. At a certain moment, salt is leaving the tank at an instantaneous rate of $${D}\\text{ kg/min}$. How many kilograms of salt are in the tank at this moment?`,
          `一个水箱中装有 $${V}$ 升盐水溶液。纯水以 $${r}\\text{ 升/分}$ 的速率流入水箱，充分混合后的溶液以相同的 $${r}\\text{ 升/分}$ 速率流出。在某一时刻，盐离开水箱的瞬时速率为 $${D}\\text{ 千克/分}$。求此时水箱中含有多少千克的盐？`,
        );
        const solution = t(
          steps(
            `Let $S(t)$ be the amount of salt in kilograms at time $t$. The rate of change of salt is $\\frac{dS}{dt} = \\text{rate in} - \\text{rate out}$.`,
            `Pure water contains no salt, so $\\text{rate in} = 0$. The outflow rate of salt is $r \\times \\frac{S}{V} = ${r} \\times \\frac{S}{${V}} = \\frac{S}{${T}}$.`,
            `We are given that the outflow rate is $${D}\\text{ kg/min}$, so $\\frac{S}{${T}} = ${D}$.`,
            `Solving for $S$: $S = ${D} \\times ${T} = ${ans}\\text{ kg}$.`,
          ),
          steps(
            `设 $t$ 时刻水箱中盐的质量为 $S(t)$（千克）。盐的变化率为 $\\frac{dS}{dt} = \\text{流入速率} - \\text{流出速率}$。`,
            `流入的是纯水，故流入速率为 $0$。盐的流出速率为 $r \\times \\frac{S}{V} = ${r} \\times \\frac{S}{${V}} = \\frac{S}{${T}}$。`,
            `已知此时盐的流出速率为 $${D}\\text{ 千克/分}$，即 $\\frac{S}{${T}} = ${D}$。`,
            `解得 $S = ${D} \\times ${T} = ${ans}\\text{ 千克}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [D * r, ans + D, ans + T],
        });
      },
    },
    {
      id: "salt-remaining-after-a-given-time",
      title: t("Salt remaining after a given time", "经过一段时间后剩余的盐"),
      explanation: t(
        "Separating $\\frac{dS}{dt} = -\\frac{r}{V}S$ gives $\\frac{dS}{S} = -\\frac{r}{V}\\,dt$, so $\\ln S = -\\frac{r}{V}t + C$ and\n\n$$S(t) = S_0 e^{-rt/V},$$\n\nwhere $S_0$ is the initial amount. The salt decays exponentially with rate constant $\\frac{r}{V}$, the fraction of the tank replaced each minute. A $100$-liter tank flushed at $5$ L/min starting with $20$ kg of salt holds $20e^{-0.05t}$ kg after $t$ minutes.",
        "分离变量 $\\frac{dS}{dt} = -\\frac{r}{V}S$ 得 $\\frac{dS}{S} = -\\frac{r}{V}\\,dt$，所以 $\\ln S = -\\frac{r}{V}t + C$，即\n\n$$S(t) = S_0 e^{-rt/V},$$\n\n其中 $S_0$ 为初始含量。盐按指数衰减，速率常数 $\\frac{r}{V}$ 是每分钟被替换的容器比例。容积 $100$ 升、以 $5$ 升/分冲洗、初始含盐 $20$ 千克的水箱，$t$ 分钟后含盐 $20e^{-0.05t}$ 千克。",
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
          wrong: [round2(S0 * (1 - Math.exp((-r * t0) / V))), round2(S0 * Math.exp(-t0 / V)), round2(S0 * (1 - (r * t0) / V))].filter(
            (w) => w.sign() > 0,
          ),
          solution: t(
            steps(
              `The amount satisfies $\\frac{dS}{dt} = -\\frac{${r}}{${V}}S$, so $S(t) = ${S0}e^{-${dec(rate)}t}$.`,
              `At $t = ${t0}$: $S(${t0}) = ${S0}e^{-${expo}} \\approx ${dec(ans)}\\text{ kg}$.`,
            ),
            steps(
              `盐的含量满足 $\\frac{dS}{dt} = -\\frac{${r}}{${V}}S$，所以 $S(t) = ${S0}e^{-${dec(rate)}t}$。`,
              `当 $t = ${t0}$ 时：$S(${t0}) = ${S0}e^{-${expo}} \\approx ${dec(ans)}\\text{ 千克}$。`,
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
  prerequisites: ["modeling-mixture-problems-with-first-order-separable-odes", "general-solutions-of-first-order-linear-odes"],
  encompasses: [
    {
      topic: "modeling-mixture-problems-with-first-order-separable-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "mixture-problems-with-inflow-concentration-or-variable-volume",
      title: t("Steady-state solution in mixture problems with constant inflow concentration", "恒定流入浓度混合问题的稳态解"),
      explanation: t(
        "For $\\frac{dS}{dt} + \\frac{r}{V}S = r c_{\\text{in}}$, the general solution is $S(t) = V c_{\\text{in}} + C e^{-(r/V)t}$. As $t \\to \\infty$, the amount of solute approaches the steady-state value $S_\\infty = V c_{\\text{in}}$.",
        "对于微分方程 $\\frac{dS}{dt} + \\frac{r}{V}S = r c_{\\text{in}}$，通解为 $S(t) = V c_{\\text{in}} + C e^{-(r/V)t}$。当 $t \\to \\infty$ 时，溶质总量趋于稳态极限值 $S_\\infty = V c_{\\text{in}}$。",
      ),
      generate(rng: Rng): Problem {
        const V = rng.int(10, 80) * 10; // 100 to 800
        const cin = rng.int(2, 12);
        const r = rng.int(2, 8);
        const ans = V * cin;

        const prompt = t(
          `A storage reservoir holds $${V}$ liters of water. A solution with chemical concentration $${cin}\\text{ g/L}$ flows into the reservoir at $${r}\\text{ L/min}$, and the uniform mixture flows out at the same rate of $${r}\\text{ L/min}$. What is the steady-state amount of chemical in the reservoir as $t \\to \\infty$ (in grams)?`,
          `一个水库蓄有 $${V}$ 升水。化学物质浓度为 $${cin}\\text{ 克/升}$ 的溶液以 $${r}\\text{ 升/分}$ 的速率流入水库，混合均匀的液体以相同的 $${r}\\text{ 升/分}$ 速率流出。求当 $t \\to \\infty$ 时，水库中化学物质的稳态总量（单位：克）是多少？`,
        );
        const solution = t(
          steps(
            `The differential equation for the chemical amount $S(t)$ is $\\frac{dS}{dt} = r c_{\\text{in}} - \\frac{r}{V}S = ${r * cin} - \\frac{${r}}{${V}}S$.`,
            `Rearrange into standard linear form: $\\frac{dS}{dt} + \\frac{${r}}{${V}}S = ${r * cin}$.`,
            `As $t \\to \\infty$, the system reaches equilibrium where $\\frac{dS}{dt} = 0$.`,
            `Set the derivative to zero: $0 = r c_{\\text{in}} - \\frac{r}{V}S_\\infty \\implies S_\\infty = V c_{\\text{in}} = ${V} \\times ${cin} = ${ans}\\text{ g}$.`,
          ),
          steps(
            `化学物质质量 $S(t)$ 满足微分方程 $\\frac{dS}{dt} = r c_{\\text{in}} - \\frac{r}{V}S = ${r * cin} - \\frac{${r}}{${V}}S$。`,
            `整理为标准一阶线性微分方程：$\\frac{dS}{dt} + \\frac{${r}}{${V}}S = ${r * cin}$。`,
            `当 $t \\to \\infty$ 时，系统趋向动态平衡稳态，此时导数 $\\frac{dS}{dt} = 0$。`,
            `令导数为零：$0 = r c_{\\text{in}} - \\frac{r}{V}S_\\infty \\implies S_\\infty = V c_{\\text{in}} = ${V} \\times ${cin} = ${ans}\\text{ 克}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [V * r, cin * r * 10, ans + V],
        });
      },
    },
    {
      id: "the-amount-at-a-given-time-with-inflowing-solute",
      title: t("The amount at a given time with inflowing solute", "有溶质流入时某一时刻的含量"),
      explanation: t(
        "The linear equation $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$ has the equilibrium $S_\\infty = Vc_{\\text{in}}$, and the gap from equilibrium decays exponentially:\n\n$$S(t) = S_\\infty + (S_0 - S_\\infty)e^{-rt/V}.$$\n\nFor a $200$-liter tank of pure water ($S_0 = 0$) fed $3$ g/L solution at $4$ L/min, $S_\\infty = 600$ g and $S(t) = 600(1 - e^{-0.02t})$. The amount climbs toward $S_\\infty$ when $S_0 < S_\\infty$ and falls toward it otherwise.",
        "线性方程 $\\frac{dS}{dt} + \\frac{r}{V}S = rc_{\\text{in}}$ 的平衡值为 $S_\\infty = Vc_{\\text{in}}$，与平衡值的差按指数衰减：\n\n$$S(t) = S_\\infty + (S_0 - S_\\infty)e^{-rt/V}.$$\n\n例如 $200$ 升纯水（$S_0 = 0$），以 $4$ 升/分注入 $3$ 克/升的溶液，则 $S_\\infty = 600$ 克，$S(t) = 600(1 - e^{-0.02t})$。$S_0 < S_\\infty$ 时含量上升趋于 $S_\\infty$，否则下降趋于它。",
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
        const start = S0 === 0 ? t("pure water", "纯水") : t(`water containing $${S0}$ g of the chemical`, `含该化学物质 $${S0}$ 克的水`);
        return numberProblem({
          prompt: t(
            `A tank holds $${V}$ liters of ${start.en}. A solution with concentration $${cin}\\text{ g/L}$ flows in at $${r}\\text{ L/min}$, and the well-mixed solution drains at the same rate. How many grams of the chemical are in the tank after $${t0}$ minutes? Round to two decimal places.`,
            `水箱中有 $${V}$ 升${start["zh-CN"]}。浓度为 $${cin}\\text{ 克/升}$ 的溶液以 $${r}\\text{ 升/分}$ 流入，充分混合的溶液以相同速率流出。$${t0}$ 分钟后水箱中有多少克该化学物质？精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [round2(Sinf), round2(Sinf * e), round2(S0 + r * cin * t0), round2(Sinf - S0 * e)].filter((w) => w.sign() > 0),
          solution: t(
            steps(
              `The equilibrium is $S_\\infty = Vc_{\\text{in}} = ${V} \\cdot ${cin} = ${Sinf}$, and the rate constant is $\\frac{r}{V} = ${dec(rate)}$.`,
              `$S(t) = ${Sinf} + (${S0} - ${Sinf})e^{-${dec(rate)}t}$, so $S(${t0}) = ${Sinf} ${S0 - Sinf < 0 ? "-" : "+"} ${Math.abs(S0 - Sinf)}e^{-${expo}} \\approx ${dec(ans)}\\text{ g}$.`,
            ),
            steps(
              `平衡值为 $S_\\infty = Vc_{\\text{in}} = ${V} \\cdot ${cin} = ${Sinf}$，速率常数为 $\\frac{r}{V} = ${dec(rate)}$。`,
              `$S(t) = ${Sinf} + (${S0} - ${Sinf})e^{-${dec(rate)}t}$，所以 $S(${t0}) = ${Sinf} ${S0 - Sinf < 0 ? "-" : "+"} ${Math.abs(S0 - Sinf)}e^{-${expo}} \\approx ${dec(ans)}\\text{ 克}$。`,
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
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-orthogonal-trajectories-of-a-family-of-curves",
      title: t("Finding orthogonal trajectories of a family of curves", "求解平面曲线族的正交轨迹"),
      explanation: t(
        "Orthogonal trajectories cross every curve of the family at right angles, so their slope is the negative reciprocal of the family's slope at each point. For $y = C x^k$, differentiating yields $\\frac{dy}{dx} = \\frac{k y}{x}$. The orthogonal trajectories satisfy $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$, giving the family $x^2 + k y^2 = C'$.",
        "正交轨线与曲线族中的每条曲线都垂直相交，所以它在每一点的斜率是曲线族斜率的负倒数。对于曲线族 $y = C x^k$，求导消去常数 $C$ 得 $\\frac{dy}{dx} = \\frac{k y}{x}$。其正交轨迹满足负倒数斜率 $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$，积分得到曲线族 $x^2 + k y^2 = C'$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k;

        const prompt = t(
          `Find the coefficient $B$ such that the orthogonal trajectories to the family of curves $y = C x^{${k}}$ are given by $x^2 + B y^2 = C'$.`,
          `已知曲线族 $y = C x^{${k}}$ 的正交轨迹方程具有形式 $x^2 + B y^2 = C'$。求系数 $B$ 的值。`,
        );
        const solution = t(
          steps(
            `Differentiate $y = C x^{${k}}$ with respect to $x$: $\\frac{dy}{dx} = ${k} C x^{${k}-1}$.`,
            `Eliminate the parameter $C$ using $C = \\frac{y}{x^{${k}}}$: $\\frac{dy}{dx} = ${k} \\left(\\frac{y}{x^{${k}}}\\right) x^{${k}-1} = \\frac{${k}y}{x}$.`,
            `The orthogonal trajectories must have the negative reciprocal slope: $\\frac{dy}{dx} = -\\frac{x}{${k}y}$.`,
            `Separate variables: $${k}y\\,dy = -x\\,dx \\implies x\\,dx + ${k}y\\,dy = 0$.`,
            `Integrate both sides: $\\frac{x^2}{2} + \\frac{${k}y^2}{2} = K \\implies x^2 + ${k}y^2 = C'$.`,
            `Comparing with $x^2 + B y^2 = C'$, we obtain $B = ${ans}$.`,
          ),
          steps(
            `对曲线族 $y = C x^{${k}}$ 关于 $x$ 求导：$\\frac{dy}{dx} = ${k} C x^{${k}-1}$。`,
            `由 $C = \\frac{y}{x^{${k}}}$ 消去参数 $C$：$\\frac{dy}{dx} = ${k} \\left(\\frac{y}{x^{${k}}}\\right) x^{${k}-1} = \\frac{${k}y}{x}$。`,
            `正交轨迹的斜率为负倒数：$\\frac{dy}{dx} = -\\frac{x}{${k}y}$。`,
            `分离变量：$${k}y\\,dy = -x\\,dx \\implies x\\,dx + ${k}y\\,dy = 0$。`,
            `两边积分：$\\frac{x^2}{2} + \\frac{${k}y^2}{2} = K \\implies x^2 + ${k}y^2 = C'$。`,
            `与 $x^2 + B y^2 = C'$ 对比系数，得 $B = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [k + 1, 2 * k, k * k],
        });
      },
    },
    {
      id: "orthogonal-trajectories-of-exponential-curves",
      title: t("Orthogonal trajectories of exponential curves", "指数曲线族的正交轨线"),
      explanation: t(
        "The recipe is always the same: differentiate the family, eliminate the constant so the slope is a function $f(x, y)$, replace $f$ by $-\\frac{1}{f}$, and solve.\n\nFor $y = Ce^{kx}$: $y' = kCe^{kx} = ky$. The trajectories satisfy $\\frac{dy}{dx} = -\\frac{1}{ky}$, so $ky\\,dy = -dx$ and $\\frac{k}{2}y^{2} = -x + K$, that is $y^{2} = -\\frac{2}{k}x + C'$: a family of parabolas opening away from the direction in which the exponentials grow.",
        "方法总是相同的：对曲线族求导，消去常数使斜率成为 $f(x, y)$，把 $f$ 换成 $-\\frac{1}{f}$，再解方程。\n\n对 $y = Ce^{kx}$：$y' = kCe^{kx} = ky$。正交轨线满足 $\\frac{dy}{dx} = -\\frac{1}{ky}$，所以 $ky\\,dy = -dx$，$\\frac{k}{2}y^{2} = -x + K$，即 $y^{2} = -\\frac{2}{k}x + C'$：一族开口方向与指数增长方向相反的抛物线。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 10]);
        const n = rng.pick([1, 1, 2, 3]);
        const kq = Q.of(k, n);
        const ans = Q.of(-2).div(kq);
        const kl = kq.toLatex();
        const expo = kq.isInteger() ? (k === 1 ? "x" : k === -1 ? "-x" : `${k}x`) : `${kl}x`;
        return numberProblem({
          prompt: t(
            `The orthogonal trajectories of the family $y = Ce^{${expo}}$ have the form $y^{2} = Bx + C'$. Find $B$.`,
            `曲线族 $y = Ce^{${expo}}$ 的正交轨线形如 $y^{2} = Bx + C'$。求 $B$。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(-1).div(kq), kq.mul(Q.of(-2)), Q.of(2).mul(kq)],
          solution: t(
            steps(
              `Differentiate: $y' = ${kl}Ce^{${expo}} = ${kl}y$.`,
              `The trajectories satisfy $\\frac{dy}{dx} = -\\frac{1}{${kl}y}$, so $${kl}y\\,dy = -dx$.`,
              `Integrate: $\\frac{${kl}}{2}y^{2} = -x + K$, so $y^{2} = ${ans.toLatex()}x + C'$ and $B = ${ans.toLatex()}$.`,
            ),
            steps(
              `求导：$y' = ${kl}Ce^{${expo}} = ${kl}y$。`,
              `正交轨线满足 $\\frac{dy}{dx} = -\\frac{1}{${kl}y}$，所以 $${kl}y\\,dy = -dx$。`,
              `积分：$\\frac{${kl}}{2}y^{2} = -x + K$，所以 $y^{2} = ${ans.toLatex()}x + C'$，$B = ${ans.toLatex()}$。`,
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
  prerequisites: ["further-modeling-with-first-order-odes"],
  encompasses: [{ topic: "further-modeling-with-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "von-bertalanffy-and-monod-inhibited-growth",
      title: t("Rate of growth in bounded growth models", "有限增长模型的瞬时增长速率"),
      explanation: t(
        "In an inhibited growth model $\\frac{dy}{dt} = k(M - y)$, the rate of growth is directly proportional to the difference between the carrying capacity $M$ and the current size $y$.",
        "在有限增长模型 $\\frac{dy}{dt} = k(M - y)$ 中，瞬时增长速率与最大容纳量 $M$ 与当前量 $y$ 之差成正比。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const M = rng.int(50, 250);
        const diff = rng.int(5, 30);
        const yVal = M - diff;
        const ans = k * diff;

        const prompt = t(
          `A population size $y(t)$ grows according to the inhibited growth differential equation $\\frac{dy}{dt} = ${k}(${M} - y)$. Find the instantaneous rate of growth $\\frac{dy}{dt}$ when $y = ${yVal}$.`,
          `某种群数量 $y(t)$ 服从有限增长微分方程 $\\frac{dy}{dt} = ${k}(${M} - y)$。求当种群数量达到 $y = ${yVal}$ 时的瞬时增长速率 $\\frac{dy}{dt}$。`,
        );
        const solution = t(
          steps(
            `Substitute $y = ${yVal}$ directly into the differential equation: $\\frac{dy}{dt} = ${k}(${M} - ${yVal})$.`,
            `Evaluate the difference: $${M} - ${yVal} = ${diff}$.`,
            `Multiply by the growth constant: $\\frac{dy}{dt} = ${k} \\times ${diff} = ${ans}$.`,
          ),
          steps(
            `直接将 $y = ${yVal}$ 代入微分方程：$\\frac{dy}{dt} = ${k}(${M} - ${yVal})$。`,
            `计算差值：$${M} - ${yVal} = ${diff}$。`,
            `乘以增长常数：$\\frac{dy}{dt} = ${k} \\times ${diff} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + k, k * yVal, diff],
        });
      },
    },
    {
      id: "the-size-at-a-given-time",
      title: t("The size at a given time", "某一时刻的规模"),
      explanation: t(
        "Separating $\\frac{dy}{dt} = k(M - y)$ gives $\\frac{dy}{M - y} = k\\,dt$, so $-\\ln(M - y) = kt + C$. The gap to the capacity shrinks exponentially, and with $y(0) = y_0$:\n\n$$y(t) = M - (M - y_0)e^{-kt}.$$\n\nA fish of length $10$ cm growing toward $M = 60$ cm with $k = 0.2$ per year has length $60 - 50e^{-0.2t}$; after $5$ years that is $60 - 50e^{-1} \\approx 41.61$ cm.",
        "分离变量 $\\frac{dy}{dt} = k(M - y)$ 得 $\\frac{dy}{M - y} = k\\,dt$，所以 $-\\ln(M - y) = kt + C$。与容量的差距按指数缩小，代入 $y(0) = y_0$：\n\n$$y(t) = M - (M - y_0)e^{-kt}.$$\n\n一条长 $10$ 厘米的鱼以 $k = 0.2$（每年）向 $M = 60$ 厘米生长，长度为 $60 - 50e^{-0.2t}$；$5$ 年后为 $60 - 50e^{-1} \\approx 41.61$ 厘米。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(5, 30) * 10;
        const y0 = rng.int(0, Math.floor(M / 20)) * 10;
        const k = Q.of(rng.int(1, 9), 10);
        const t0 = rng.int(1, 10);
        const kt = k.mul(Q.of(t0));
        const ans = round2(M - (M - y0) * Math.exp(-kt.toNumber()));
        return numberProblem({
          prompt: t(
            `A quantity grows according to $\\frac{dy}{dt} = ${dec(k)}(${M} - y)$ with $y(0) = ${y0}$. Find $y(${t0})$. Round to two decimal places.`,
            `某量按 $\\frac{dy}{dt} = ${dec(k)}(${M} - y)$ 增长，且 $y(0) = ${y0}$。求 $y(${t0})$，精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [
            round2((M - y0) * Math.exp(-kt.toNumber())),
            round2(M * (1 - Math.exp(-kt.toNumber()))),
            round2(y0 + (M - y0) * kt.toNumber()),
          ].filter((w) => w.sign() > 0 && w.cmp(Q.of(M)) < 0),
          solution: t(
            steps(
              `The solution is $y(t) = M - (M - y_0)e^{-kt} = ${M} - ${M - y0}e^{-${dec(k)}t}$.`,
              `At $t = ${t0}$: $y(${t0}) = ${M} - ${M - y0}e^{-${dec(kt)}} \\approx ${dec(ans)}$.`,
            ),
            steps(
              `解为 $y(t) = M - (M - y_0)e^{-kt} = ${M} - ${M - y0}e^{-${dec(k)}t}$。`,
              `当 $t = ${t0}$ 时：$y(${t0}) = ${M} - ${M - y0}e^{-${dec(kt)}} \\approx ${dec(ans)}$。`,
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
  prerequisites: ["inhibited-growth-models-with-first-order-odes"],
  encompasses: [{ topic: "inhibited-growth-models-with-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "newtons-law-of-cooling",
      title: t("Newton's law of cooling", "牛顿冷却定律"),
      explanation: t(
        "An object cools faster when it is much hotter than its surroundings, so its rate of change is proportional to the temperature difference. According to Newton's law of cooling, $\\frac{dT}{dt} = -k(T - T_m)$. The rate of temperature decrease is $-\\frac{dT}{dt} = k(T - T_m)$.",
        "物体比周围环境热得越多，冷却得越快，所以它的变化率与温差成正比。根据牛顿冷却定律，$\\frac{dT}{dt} = -k(T - T_m)$。温度的下降速率为 $-\\frac{dT}{dt} = k(T - T_m)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const Tm = rng.int(10, 30);
        const diff = rng.int(10, 50);
        const Tval = Tm + diff;
        const ans = k * diff;

        const prompt = t(
          `A heated metal ingot cools in a room kept at a constant temperature of $T_m = ${Tm}^\\circ\\text{C}$ according to the differential equation $\\frac{dT}{dt} = -${k}(T - ${Tm})$. At what rate is the ingot's temperature decreasing (in $^\\circ\\text{C/min}$) when its temperature is $${Tval}^\\circ\\text{C}$?`,
          `一块受热金属置于恒温 $T_m = ${Tm}^\\circ\\text{C}$ 的房间中冷却，满足微分方程 $\\frac{dT}{dt} = -${k}(T - ${Tm})$。当金属温度为 $${Tval}^\\circ\\text{C}$ 时，其温度下降速率（单位：$^\\circ\\text{C/分}$）是多少？`,
        );
        const solution = t(
          steps(
            `The rate of temperature decrease is given by $-\\frac{dT}{dt} = ${k}(T - ${Tm})$.`,
            `Substitute $T = ${Tval}^\\circ\\text{C}$: $-\\frac{dT}{dt} = ${k}(${Tval} - ${Tm}) = ${k}(${diff})$.`,
            `Calculate the product: $${k} \\times ${diff} = ${ans}^\\circ\\text{C/min}$.`,
          ),
          steps(
            `温度的下降速率由 $-\\frac{dT}{dt} = ${k}(T - ${Tm})$ 给出。`,
            `代入 $T = ${Tval}^\\circ\\text{C}$：$-\\frac{dT}{dt} = ${k}(${Tval} - ${Tm}) = ${k}(${diff})$。`,
            `计算乘积：$${k} \\times ${diff} = ${ans}^\\circ\\text{C/分}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + k, diff, k * Tval],
        });
      },
    },
    {
      id: "predicting-temperatures-from-two-readings",
      title: t("Predicting temperatures from two readings", "由两次读数预测温度"),
      explanation: t(
        "The solution of Newton's law of cooling is $T(t) = T_m + (T_0 - T_m)e^{-kt}$: the difference from the room temperature is multiplied by the same factor $e^{-kt_1}$ over every interval of length $t_1$. So one reading after $t_1$ minutes gives that factor without computing $k$:\n\n$$e^{-kt_1} = \\frac{T(t_1) - T_m}{T_0 - T_m},$$\n\nand after $n t_1$ minutes the difference is $(T_0 - T_m)\\left(e^{-kt_1}\\right)^{n}$. Coffee at $90^\\circ$ in a $20^\\circ$ room that reaches $55^\\circ$ in $10$ minutes has halved its difference, so after $20$ minutes it is $20 + 70 \\cdot \\frac{1}{4} = 37.5^\\circ$.",
        "牛顿冷却定律的解为 $T(t) = T_m + (T_0 - T_m)e^{-kt}$：每经过长为 $t_1$ 的一段时间，与室温之差都乘以同一个因子 $e^{-kt_1}$。所以 $t_1$ 分钟后的一次读数就给出这个因子，无需求出 $k$：\n\n$$e^{-kt_1} = \\frac{T(t_1) - T_m}{T_0 - T_m},$$\n\n经过 $n t_1$ 分钟后，温差为 $(T_0 - T_m)\\left(e^{-kt_1}\\right)^{n}$。在 $20^\\circ$ 的房间里，$90^\\circ$ 的咖啡 $10$ 分钟后降到 $55^\\circ$，温差减半，所以 $20$ 分钟后为 $20 + 70 \\cdot \\frac{1}{4} = 37.5^\\circ$。",
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
        const T1 = Tm + (diff * p) / q;
        const ratio = Q.of(p, q);
        const ans = Q.of(Tm).add(Q.of(diff).mul(ratio.pow(n)));
        return numberProblem({
          prompt: t(
            `An object at $${T0}^\\circ\\text{C}$ is placed in a room kept at $${Tm}^\\circ\\text{C}$ and cools according to Newton's law of cooling. After $${t1}$ minutes its temperature is $${T1}^\\circ\\text{C}$. What is its temperature after $${n * t1}$ minutes?`,
            `一个 $${T0}^\\circ\\text{C}$ 的物体放在保持 $${Tm}^\\circ\\text{C}$ 的房间里，按牛顿冷却定律降温。$${t1}$ 分钟后其温度为 $${T1}^\\circ\\text{C}$。$${n * t1}$ 分钟后其温度是多少？`,
          ),
          answer: ans,
          unit: "°C",
          wrong: [
            Q.of(diff).mul(ratio.pow(n)),
            Q.of(T0 - n * (T0 - T1)),
            Q.of(Tm).add(Q.of(diff).mul(ratio).div(Q.of(n))),
            Q.of(T1).mul(ratio.pow(n - 1)),
          ].filter((w) => w.sign() > 0),
          solution: t(
            steps(
              `The difference from room temperature starts at $${T0} - ${Tm} = ${diff}$ and is $${T1} - ${Tm} = ${(diff * p) / q}$ after $${t1}$ minutes, so each $${t1}$ minutes multiplies it by $e^{-${t1}k} = ${ratio.toLatex()}$.`,
              `After $${n * t1}$ minutes: $T = ${Tm} + ${diff} \\left(${ratio.toLatex()}\\right)^{${n}} = ${ans.toLatex()}^\\circ\\text{C}$.`,
            ),
            steps(
              `与室温之差开始时为 $${T0} - ${Tm} = ${diff}$，$${t1}$ 分钟后为 $${T1} - ${Tm} = ${(diff * p) / q}$，所以每 $${t1}$ 分钟温差乘以 $e^{-${t1}k} = ${ratio.toLatex()}$。`,
              `$${n * t1}$ 分钟后：$T = ${Tm} + ${diff} \\left(${ratio.toLatex()}\\right)^{${n}} = ${ans.toLatex()}^\\circ\\text{C}$。`,
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
  prerequisites: ["determining-properties-of-objects-described-as-functions-of-displacement"],
  encompasses: [
    {
      topic: "determining-properties-of-objects-described-as-functions-of-displacement",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "terminal-velocity-with-linear-air-resistance",
      title: t("Terminal velocity with linear air resistance", "线性空气阻力下的收尾速度"),
      explanation: t(
        "As the object speeds up the resistance grows until it balances gravity, and at that speed the acceleration is zero and the velocity stops changing. Terminal velocity is reached when acceleration becomes zero ($m\\frac{dv}{dt} = 0$), so $mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$.",
        "物体加速时阻力随之增大，直到与重力平衡；在这个速度下加速度为零，速度不再变化。当加速度降为零（$m\\frac{dv}{dt} = 0$）时物体达到收尾速度，此时重力与阻力平衡：$mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(2, 15);
        const ans = rng.int(10, 60); // v_term in m/s
        const W = b * ans; // mg = weight in Newtons

        const prompt = t(
          `A skydiver and equipment with total weight $mg = ${W}\\text{ N}$ falls vertically through air, experiencing a linear drag force $F_d = ${b}v\\text{ N}$, where $v$ is downward speed in $\\text{m/s}$. Find the terminal velocity $v_{\\text{term}}$ in $\\text{m/s}$.`,
          `一名跳伞员连同装备总重力为 $mg = ${W}\\text{ 牛}$，在空气中垂直下落，受到的线性空气阻力为 $F_d = ${b}v\\text{ 牛}$（$v$ 为向下速度，单位为 $\\text{米/秒}$）。求其收尾终端速度 $v_{\\text{term}}$（单位：$\\text{米/秒}$）。`,
        );
        const solution = t(
          steps(
            `Newton's second law for the downward motion is $m \\frac{dv}{dt} = mg - bv$.`,
            `Terminal velocity occurs when the net force is zero and acceleration vanishes: $mg - bv_{\\text{term}} = 0$.`,
            `Substitute the given values: $${W} - ${b}v_{\\text{term}} = 0$.`,
            `Solve for $v_{\\text{term}}$: $v_{\\text{term}} = \\frac{${W}}{${b}} = ${ans}\\text{ m/s}$.`,
          ),
          steps(
            `根据牛顿第二定律，物体向下的运动方程为 $m \\frac{dv}{dt} = mg - bv$。`,
            `当合外力为零、加速度消失时达到收尾速度：$mg - bv_{\\text{term}} = 0$。`,
            `代入已知数值：$${W} - ${b}v_{\\text{term}} = 0$。`,
            `解得收尾速度：$v_{\\text{term}} = \\frac{${W}}{${b}} = ${ans}\\text{ 米/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + b, Math.round(W / (b + 1)), ans * 2],
        });
      },
    },
    {
      id: "velocity-at-a-given-time-with-linear-drag",
      title: t("Velocity at a given time with linear drag", "线性阻力下某一时刻的速度"),
      explanation: t(
        "Dividing $m\\frac{dv}{dt} = mg - bv$ by $m$ gives a linear equation whose solution from rest, $v(0) = 0$, is\n\n$$v(t) = v_{\\text{term}}\\left(1 - e^{-bt/m}\\right), \\qquad v_{\\text{term}} = \\frac{mg}{b}.$$\n\nThe speed approaches the terminal velocity, closing the gap by the factor $e^{-b/m}$ each second. A $70$ kg skydiver with $b = 14$ kg/s has $v_{\\text{term}} = 49$ m/s and $v(t) = 49(1 - e^{-0.2t})$.",
        "把 $m\\frac{dv}{dt} = mg - bv$ 两边除以 $m$ 得到线性方程，从静止开始（$v(0) = 0$）的解为\n\n$$v(t) = v_{\\text{term}}\\left(1 - e^{-bt/m}\\right), \\qquad v_{\\text{term}} = \\frac{mg}{b}.$$\n\n速度趋于终端速度，与它的差距每秒乘以因子 $e^{-b/m}$。质量 $70$ 千克、$b = 14$ 千克/秒的跳伞者，$v_{\\text{term}} = 49$ 米/秒，$v(t) = 49(1 - e^{-0.2t})$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([5, 10, 20, 40, 50, 80, 100]);
        const b = rng.pick([1, 2, 4, 5, 10, 20]);
        const t0 = rng.int(2, 12);
        const vt = Q.of(m * 98, b * 10);
        const rate = Q.of(b, m);
        const ans = round2(vt.toNumber() * (1 - Math.exp((-b * t0) / m)));
        return numberProblem({
          prompt: t(
            `An object of mass $${m}\\text{ kg}$ is dropped from rest and falls with linear air resistance $${b}v\\text{ N}$. Taking $g = 9.8\\text{ m/s}^2$, find its speed after $${t0}$ seconds in $\\text{m/s}$. Round to two decimal places.`,
            `质量为 $${m}\\text{ 千克}$ 的物体从静止释放，下落时受线性空气阻力 $${b}v\\text{ 牛}$。取 $g = 9.8\\text{ 米/秒}^2$，求 $${t0}$ 秒后的速度（米/秒），精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [
            round2(vt.toNumber()),
            round2(9.8 * t0),
            round2(vt.toNumber() * Math.exp((-b * t0) / m)),
            round2(vt.toNumber() * (1 - Math.exp(-b * t0))),
          ].filter((w) => w.sign() > 0),
          solution: t(
            steps(
              `The terminal velocity is $v_{\\text{term}} = \\frac{mg}{b} = \\frac{${m} \\cdot 9.8}{${b}} = ${dec(vt)}$, and $\\frac{b}{m} = ${dec(rate)}$.`,
              `$v(${t0}) = ${dec(vt)}\\left(1 - e^{-${dec(rate.mul(Q.of(t0)))}}\\right) \\approx ${dec(ans)}\\text{ m/s}$.`,
            ),
            steps(
              `终端速度为 $v_{\\text{term}} = \\frac{mg}{b} = \\frac{${m} \\cdot 9.8}{${b}} = ${dec(vt)}$，$\\frac{b}{m} = ${dec(rate)}$。`,
              `$v(${t0}) = ${dec(vt)}\\left(1 - e^{-${dec(rate.mul(Q.of(t0)))}}\\right) \\approx ${dec(ans)}\\text{ 米/秒}$。`,
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
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [{ topic: "falling-body-problems-with-linear-drag", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "terminal-velocity-with-quadratic-air-resistance",
      title: t("Terminal velocity with quadratic air resistance", "二次空气阻力下的收尾速度"),
      explanation: t(
        "With resistance proportional to the square of the speed, the balance of forces gives an equation for the square of the terminal velocity. At terminal velocity under quadratic drag, $mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$.",
        "当阻力与速率的平方成正比时，力的平衡给出关于终极速度平方的方程。二次空气阻力达到平衡时，$mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 10);
        const ans = rng.int(10, 50); // v_term in m/s
        const W = c * ans * ans; // mg

        const prompt = t(
          `An object with weight $mg = ${W}\\text{ N}$ falls vertically subject to quadratic air drag $F_d = ${c}v^2\\text{ N}$. Find the terminal velocity $v_{\\text{term}}$ in $\\text{m/s}$.`,
          `一个重力为 $mg = ${W}\\text{ 牛}$ 的物体在垂直下落过程中受到二次空气阻力 $F_d = ${c}v^2\\text{ 牛}$ 的作用。求其终端收尾速度 $v_{\\text{term}}$（单位：$\\text{米/秒}$）。`,
        );
        const solution = t(
          steps(
            `At terminal velocity, the gravitational force balances the drag force: $mg = c v_{\\text{term}}^2$.`,
            `Substitute $mg = ${W}$ and $c = ${c}$: $${W} = ${c} v_{\\text{term}}^2$.`,
            `Solve for $v_{\\text{term}}^2$: $v_{\\text{term}}^2 = \\frac{${W}}{${c}} = ${ans * ans}$.`,
            `Take the square root: $v_{\\text{term}} = \\sqrt{${ans * ans}} = ${ans}\\text{ m/s}$.`,
          ),
          steps(
            `达到终端收尾速度时，重力与空气阻力相互平衡：$mg = c v_{\\text{term}}^2$。`,
            `代入 $mg = ${W}$ 与 $c = ${c}$：$${W} = ${c} v_{\\text{term}}^2$。`,
            `解得速度平方：$v_{\\text{term}}^2 = \\frac{${W}}{${c}} = ${ans * ans}$。`,
            `开平方求得终端速度：$v_{\\text{term}} = \\sqrt{${ans * ans}} = ${ans}\\text{ 米/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * ans, Math.round(W / c), ans + c],
        });
      },
    },
    {
      id: "acceleration-at-a-given-speed",
      title: t("Acceleration at a given speed", "给定速度时的加速度"),
      explanation: t(
        "Before terminal velocity is reached, the net force is not zero. Dividing $m\\frac{dv}{dt} = mg - cv^{2}$ by $m$ gives the acceleration at any speed:\n\n$$\\frac{dv}{dt} = g - \\frac{c}{m}v^{2} = g\\left(1 - \\frac{v^{2}}{v_{\\text{term}}^{2}}\\right).$$\n\nAt half the terminal speed the drag is a quarter of the weight, so the acceleration is $\\frac{3}{4}g$. A negative value means the object is moving faster than $v_{\\text{term}}$ and slowing down.",
        "在达到终端速度之前，合力不为零。把 $m\\frac{dv}{dt} = mg - cv^{2}$ 两边除以 $m$，得到任意速度下的加速度：\n\n$$\\frac{dv}{dt} = g - \\frac{c}{m}v^{2} = g\\left(1 - \\frac{v^{2}}{v_{\\text{term}}^{2}}\\right).$$\n\n速度为终端速度的一半时，阻力是重力的四分之一，所以加速度为 $\\frac{3}{4}g$。若结果为负，说明物体比 $v_{\\text{term}}$ 快，正在减速。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([2, 4, 5, 8, 10, 20, 25, 50]);
        const c = rng.pick([1, 2, 4, 5]) * (rng.bool() ? 1 : 10);
        const cq = Q.of(c, 100);
        const vMax = Math.floor(Math.sqrt((9.8 * m) / cq.toNumber()));
        const v = rng.int(1, Math.max(1, vMax - 1));
        const ans = Q.of(98, 10).sub(cq.mul(Q.of(v * v)).div(Q.of(m)));
        return numberProblem({
          prompt: t(
            `An object of mass $${m}\\text{ kg}$ falls with quadratic air resistance $${dec(cq)}v^{2}\\text{ N}$. Taking $g = 9.8\\text{ m/s}^2$, find its acceleration $\\frac{dv}{dt}$ in $\\text{m/s}^2$ at the moment its speed is $${v}\\text{ m/s}$.`,
            `质量为 $${m}\\text{ 千克}$ 的物体下落时受二次空气阻力 $${dec(cq)}v^{2}\\text{ 牛}$。取 $g = 9.8\\text{ 米/秒}^2$，求速度为 $${v}\\text{ 米/秒}$ 时的加速度 $\\frac{dv}{dt}$（米/秒²）。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [
            Q.of(98, 10).sub(cq.mul(Q.of(v * v))),
            Q.of(98, 10).sub(cq.mul(Q.of(v)).div(Q.of(m))),
            cq.mul(Q.of(v * v)).div(Q.of(m)),
            Q.of(98, 10),
          ],
          solution: t(
            steps(
              `Divide Newton's second law by $m$: $\\frac{dv}{dt} = g - \\frac{c}{m}v^{2}$.`,
              `$\\frac{dv}{dt} = 9.8 - \\frac{${dec(cq)} \\cdot ${v}^{2}}{${m}} = 9.8 - ${dec(cq.mul(Q.of(v * v)).div(Q.of(m)))} = ${dec(ans)}\\text{ m/s}^2$.`,
            ),
            steps(
              `牛顿第二定律两边除以 $m$：$\\frac{dv}{dt} = g - \\frac{c}{m}v^{2}$。`,
              `$\\frac{dv}{dt} = 9.8 - \\frac{${dec(cq)} \\cdot ${v}^{2}}{${m}} = 9.8 - ${dec(cq.mul(Q.of(v * v)).div(Q.of(m)))} = ${dec(ans)}\\text{ 米/秒}^2$。`,
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
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "inverse-square-gravitational-force-and-acceleration",
      title: t("Inverse-square gravitational force and acceleration", "万有引力的平方反比律与加速度"),
      explanation: t(
        "The acceleration of gravity at distance $r$ from the planetary center is $g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$, where $g_0$ is the acceleration at the planet's surface $r = R$.",
        "距行星中心距离为 $r$ 处的重力加速度为 $g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$，其中 $g_0$ 为行星表面（$r = R$）处的重力加速度。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 9);
        const k = rng.int(1, 8);
        const g0 = k * n * n; // surface gravity
        const ans = k; // acceleration at distance n R

        const prompt = t(
          `A spherical planet has radius $R$ and surface gravitational acceleration $g_0 = ${g0}\\text{ m/s}^2$. What is the magnitude of the gravitational acceleration (in $\\text{m/s}^2$) experienced by a satellite orbiting at a distance of $r = ${n}R$ from the center of the planet?`,
          `一颗半径为 $R$ 的球形行星，其表面重力加速度为 $g_0 = ${g0}\\text{ 米/秒}^2$。一颗卫星在距离行星中心 $r = ${n}R$ 处的轨道上运行，其受到的重力加速度大小（单位：$\\text{米/秒}^2$）是多少？`,
        );
        const solution = t(
          steps(
            `According to Newton's law of universal gravitation, gravitational acceleration satisfies an inverse-square law: $g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$.`,
            `Substitute $r = ${n}R$: $g(${n}R) = g_0 \\left(\\frac{R}{${n}R}\\right)^2 = \\frac{g_0}{${n * n}}$.`,
            `Substitute $g_0 = ${g0}$: $g = \\frac{${g0}}{${n * n}} = ${ans}\\text{ m/s}^2$.`,
          ),
          steps(
            `根据牛顿万有引力定律，引力加速度满足距离平方反比规律：$g(r) = g_0 \\left(\\frac{R}{r}\\right)^2$。`,
            `代入 $r = ${n}R$：$g(${n}R) = g_0 \\left(\\frac{R}{${n}R}\\right)^2 = \\frac{g_0}{${n * n}}$。`,
            `代入 $g_0 = ${g0}$：$g = \\frac{${g0}}{${n * n}} = ${ans}\\text{ 米/秒}^2$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * n, Math.round(g0 / n), ans + 2],
        });
      },
    },
    {
      id: "the-altitude-for-a-given-gravity",
      title: t("The altitude for a given gravity", "给定重力加速度对应的高度"),
      explanation: t(
        "Running the inverse-square law backwards finds where gravity has a given strength. From $g(r) = g_0\\left(\\frac{R}{r}\\right)^{2}$,\n\n$$r = R\\sqrt{\\frac{g_0}{g}},$$\n\nand the altitude above the surface is $h = r - R$. Gravity is a quarter of its surface value at $r = 2R$, an altitude of one planetary radius, and a ninth of it at $r = 3R$. The answer is a distance from the center first; subtracting $R$ is the step most often forgotten.",
        "把平方反比定律反过来用，可以求出重力加速度为给定值的位置。由 $g(r) = g_0\\left(\\frac{R}{r}\\right)^{2}$，\n\n$$r = R\\sqrt{\\frac{g_0}{g}},$$\n\n距地表的高度为 $h = r - R$。重力加速度在 $r = 2R$（高度为一个行星半径）处是地表的四分之一，在 $r = 3R$ 处是九分之一。先求出的是到中心的距离，最常忘记的一步是减去 $R$。",
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
        const r = Q.of(R * p, q);
        const ans = r.sub(Q.of(R));
        return numberProblem({
          prompt: t(
            `A planet has radius $${R}\\text{ km}$. At what altitude above its surface, in km, is the gravitational acceleration $${ratio.toLatex()}$ of its surface value?`,
            `某行星半径为 $${R}\\text{ 千米}$。在距其表面多高（千米）处，重力加速度是表面值的 $${ratio.toLatex()}$？`,
          ),
          answer: ans,
          unit: "km",
          wrong: [r, Q.of(R).div(ratio).sub(Q.of(R)), Q.of(R).mul(ratio), Q.of(R).div(ratio)],
          solution: t(
            steps(
              `From $\\frac{g}{g_0} = \\left(\\frac{R}{r}\\right)^{2} = ${ratio.toLatex()}$, $\\frac{r}{R} = ${Q.of(p, q).toLatex()}$, so $r = ${r.toLatex()}\\text{ km}$.`,
              `The altitude is $h = r - R = ${r.toLatex()} - ${R} = ${ans.toLatex()}\\text{ km}$.`,
            ),
            steps(
              `由 $\\frac{g}{g_0} = \\left(\\frac{R}{r}\\right)^{2} = ${ratio.toLatex()}$ 得 $\\frac{r}{R} = ${Q.of(p, q).toLatex()}$，所以 $r = ${r.toLatex()}\\text{ 千米}$。`,
              `高度为 $h = r - R = ${r.toLatex()} - ${R} = ${ans.toLatex()}\\text{ 千米}$。`,
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
  prerequisites: ["newtons-law-of-universal-gravitation"],
  encompasses: [{ topic: "newtons-law-of-universal-gravitation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "deriving-escape-velocity-via-chain-rule",
      title: t("Deriving escape velocity via chain rule", "应用链式法则推导天体逃逸速度"),
      explanation: t(
        "Writing acceleration in terms of distance lets you integrate from the surface to infinity, and the escape velocity is the speed that just reaches zero far away. By rewriting acceleration as $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$ and integrating $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$, we find $v_{\\text{esc}}^2 = 2 g_0 R$.",
        "把加速度用距离表示，就可以从表面积分到无穷远，逃逸速度就是在无穷远处恰好减为零的速度。将加速度改写为 $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$，两端积分 $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$，可求得逃逸速度平方 $v_{\\text{esc}}^2 = 2 g_0 R$。",
      ),
      generate(rng: Rng): Problem {
        const ans = rng.int(4, 30); // v_esc in km/s
        const product = ans * ans; // 2 g0 R in (km/s)^2

        const prompt = t(
          `For a planet with radius $R$ and surface gravity $g_0$, suppose the quantity $2 g_0 R = ${product}\\text{ (km/s)}^2$. Using the differential equation $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$, find the escape velocity $v_{\\text{esc}}$ of the planet in $\\text{km/s}$.`,
          `对于某颗表面重力加速度为 $g_0$、半径为 $R$ 的行星，已知 $2 g_0 R = ${product}\\text{ (千米/秒)}^2$。利用径向运动微分方程 $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$，求该行星的逃逸速度 $v_{\\text{esc}}$（单位：$\\text{千米/秒}$）。`,
        );
        const solution = t(
          steps(
            `Rewrite Newton's law using the chain rule $\\frac{dv}{dt} = v\\frac{dv}{dr}$: $v\\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$.`,
            `Separate variables and integrate from the surface $r = R$ (with $v = v_{\\text{esc}}$) to $r \\to \\infty$ (where $v \\ge 0$): $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$.`,
            `Evaluate the integrals: $-\\frac{1}{2} v_{\\text{esc}}^2 = -g_0 R^2 \\left[ -\\frac{1}{r} \\right]_R^\\infty = -g_0 R$.`,
            `Therefore, $v_{\\text{esc}}^2 = 2 g_0 R = ${product} \\implies v_{\\text{esc}} = \\sqrt{${product}} = ${ans}\\text{ km/s}$.`,
          ),
          steps(
            `利用导数链式法则 $\\frac{dv}{dt} = v\\frac{dv}{dr}$ 改写牛顿定律：$v\\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$。`,
            `分离变量，从行星表面 $r = R$（$v = v_{\\text{esc}}$）积分到 $r \\to \\infty$（$v \\ge 0$）：$\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$。`,
            `计算定积分：$-\\frac{1}{2} v_{\\text{esc}}^2 = -g_0 R^2 \\left[ -\\frac{1}{r} \\right]_R^\\infty = -g_0 R$。`,
            `两端化简得 $v_{\\text{esc}}^2 = 2 g_0 R = ${product} \\implies v_{\\text{esc}} = \\sqrt{${product}} = ${ans}\\text{ 千米/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [product, Math.round(ans / 2), ans * 2],
        });
      },
    },
    {
      id: "maximum-distance-below-escape-velocity",
      title: t("The maximum distance below escape velocity", "低于逃逸速度时的最远距离"),
      explanation: t(
        "Integrating $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$ from the surface, where $v = v_0$, to a general $r$ gives\n\n$$v^{2} = v_0^{2} - 2g_0R\\left(1 - \\frac{R}{r}\\right) = v_0^{2} - v_{\\text{esc}}^{2}\\left(1 - \\frac{R}{r}\\right).$$\n\nIf $v_0 < v_{\\text{esc}}$ the object stops where $v = 0$, at $\\frac{R}{r_{\\max}} = 1 - \\frac{v_0^{2}}{v_{\\text{esc}}^{2}}$. Launched at half the escape speed, it reaches $r_{\\max} = \\frac{R}{1 - 1/4} = \\frac{4}{3}R$ from the center.",
        "从地表（$v = v_0$）到一般的 $r$ 积分 $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$，得\n\n$$v^{2} = v_0^{2} - 2g_0R\\left(1 - \\frac{R}{r}\\right) = v_0^{2} - v_{\\text{esc}}^{2}\\left(1 - \\frac{R}{r}\\right).$$\n\n若 $v_0 < v_{\\text{esc}}$，物体在 $v = 0$ 处停下，此时 $\\frac{R}{r_{\\max}} = 1 - \\frac{v_0^{2}}{v_{\\text{esc}}^{2}}$。以逃逸速度的一半发射，它到达距中心 $r_{\\max} = \\frac{R}{1 - 1/4} = \\frac{4}{3}R$ 处。",
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
        const factor = Q.one.div(Q.one.sub(k2));
        const ans = Q.of(R).mul(factor).sub(Q.of(R));
        return numberProblem({
          prompt: t(
            `A probe is launched straight up from the surface of an airless planet of radius $${R}\\text{ km}$ at $${Q.of(p, q).toLatex()}$ of the escape velocity. Using $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$, find the greatest altitude it reaches above the surface, in km.`,
            `从半径为 $${R}\\text{ 千米}$ 的无大气行星表面竖直向上发射一个探测器，初速度为逃逸速度的 $${Q.of(p, q).toLatex()}$。利用 $v\\frac{dv}{dr} = -\\frac{g_0R^{2}}{r^{2}}$，求它距表面的最大高度（千米）。`,
          ),
          answer: ans,
          unit: "km",
          wrong: [
            Q.of(R).mul(factor),
            Q.of(R).mul(k2),
            Q.of(R)
              .div(Q.one.sub(Q.of(p, q)))
              .sub(Q.of(R)),
          ],
          solution: t(
            steps(
              `With $v_0^{2} = ${k2.toLatex()}v_{\\text{esc}}^{2}$, the speed vanishes where $1 - \\frac{R}{r} = ${k2.toLatex()}$, that is $\\frac{R}{r_{\\max}} = ${Q.one.sub(k2).toLatex()}$.`,
              `So $r_{\\max} = ${factor.toLatex()} \\cdot ${R} = ${Q.of(R).mul(factor).toLatex()}\\text{ km}$ and the altitude is $${Q.of(R).mul(factor).toLatex()} - ${R} = ${ans.toLatex()}\\text{ km}$.`,
            ),
            steps(
              `由 $v_0^{2} = ${k2.toLatex()}v_{\\text{esc}}^{2}$，速度在 $1 - \\frac{R}{r} = ${k2.toLatex()}$ 处为零，即 $\\frac{R}{r_{\\max}} = ${Q.one.sub(k2).toLatex()}$。`,
              `所以 $r_{\\max} = ${factor.toLatex()} \\cdot ${R} = ${Q.of(R).mul(factor).toLatex()}\\text{ 千米}$，高度为 $${Q.of(R).mul(factor).toLatex()} - ${R} = ${ans.toLatex()}\\text{ 千米}$。`,
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
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rl-circuit-transient-and-steady-state-current",
      title: t("Steady-state current in an RL circuit", "RL 串联电路的稳态电流"),
      explanation: t(
        "For an RL circuit governed by $L\\frac{di}{dt} + Ri = V_0$, the current is $i(t) = \\frac{V_0}{R}(1 - e^{-Rt/L})$. As $t \\to \\infty$, the inductor acts as a short circuit ($\\frac{di}{dt} = 0$), giving steady-state current $i_\\infty = \\frac{V_0}{R}$.",
        "对于由 $L\\frac{di}{dt} + Ri = V_0$ 描述的 RL 电路，通解为 $i(t) = \\frac{V_0}{R}(1 - e^{-Rt/L})$。当 $t \\to \\infty$ 时，电感相当于短路导线（$\\frac{di}{dt} = 0$），稳态电流为 $i_\\infty = \\frac{V_0}{R}$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 30);
        const ans = rng.int(2, 25); // i_infinity in Amperes
        const V0 = R * ans;
        const L = rng.int(2, 8);

        const prompt = t(
          `A series circuit contains an inductor of inductance $L = ${L}\\text{ H}$, a resistor of resistance $R = ${R}\\ \\Omega$, and a constant DC voltage source $V_0 = ${V0}\\text{ V}$. Find the steady-state current $i_\\infty$ (in Amperes) as $t \\to \\infty$.`,
          `一个串联电路由电感 $L = ${L}\\text{ 亨}$、电阻 $R = ${R}\\ \\Omega$ 以及直流恒压源 $V_0 = ${V0}\\text{ 伏}$ 组成。求当 $t \\to \\infty$ 时电路中的稳态电流 $i_\\infty$（单位：安培）。`,
        );
        const solution = t(
          steps(
            `Kirchhoff's voltage law yields the first-order differential equation $L \\frac{di}{dt} + R i = V_0$.`,
            `Substitute the given components: $${L} \\frac{di}{dt} + ${R} i = ${V0}$.`,
            `As $t \\to \\infty$, the transient current settles into steady state where $\\frac{di}{dt} = 0$.`,
            `The equation reduces to $R i_\\infty = V_0 \\implies i_\\infty = \\frac{V_0}{R} = \\frac{${V0}}{${R}} = ${ans}\\text{ A}$.`,
          ),
          steps(
            `由基尔霍夫电压定律列出一阶微分方程：$L \\frac{di}{dt} + R i = V_0$。`,
            `代入电路参数：$${L} \\frac{di}{dt} + ${R} i = ${V0}$。`,
            `当 $t \\to \\infty$ 时，瞬态过程结束进入稳态，此时电流变化率 $\\frac{di}{dt} = 0$。`,
            `方程简化为电阻两端电压降等于电源电压：$R i_\\infty = V_0 \\implies i_\\infty = \\frac{V_0}{R} = \\frac{${V0}}{${R}} = ${ans}\\text{ 安}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + L, Math.round(V0 / L), ans * 2],
        });
      },
    },
    {
      id: "the-current-at-a-given-time",
      title: t("The current at a given time", "某一时刻的电流"),
      explanation: t(
        "With $i(0) = 0$, the linear equation $L\\frac{di}{dt} + Ri = V_0$ has the solution\n\n$$i(t) = \\frac{V_0}{R}\\left(1 - e^{-Rt/L}\\right).$$\n\nThe **time constant** $\\tau = \\frac{L}{R}$ sets the pace: after one time constant the current has reached $1 - e^{-1} \\approx 63\\%$ of its steady value, and after five it is within $1\\%$. A $2$ H inductor with $R = 10\\ \\Omega$ has $\\tau = 0.2$ s.",
        "当 $i(0) = 0$ 时，线性方程 $L\\frac{di}{dt} + Ri = V_0$ 的解为\n\n$$i(t) = \\frac{V_0}{R}\\left(1 - e^{-Rt/L}\\right).$$\n\n**时间常数** $\\tau = \\frac{L}{R}$ 决定变化快慢：经过一个时间常数，电流达到稳态值的 $1 - e^{-1} \\approx 63\\%$，经过五个时间常数后误差小于 $1\\%$。$2$ 亨的电感与 $R = 10\\ \\Omega$ 的电阻，$\\tau = 0.2$ 秒。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.pick([1, 2, 4, 5, 10]);
        const R = rng.pick([2, 4, 5, 8, 10, 20]);
        const iInf = rng.int(1, 12);
        const V0 = iInf * R;
        const t0 = Q.of(rng.int(1, 10), 10);
        const rt = Q.of(R, L).mul(t0);
        const ans = round2(iInf * (1 - Math.exp(-rt.toNumber())));
        return numberProblem({
          prompt: t(
            `A series circuit has an inductor $L = ${L}\\text{ H}$, a resistor $R = ${R}\\ \\Omega$ and a constant voltage $V_0 = ${V0}\\text{ V}$, switched on at $t = 0$ with no current. Find the current at $t = ${dec(t0)}$ s in amperes. Round to two decimal places.`,
            `串联电路中有电感 $L = ${L}\\text{ 亨}$、电阻 $R = ${R}\\ \\Omega$ 和恒定电压 $V_0 = ${V0}\\text{ 伏}$，在 $t = 0$ 时接通，初始电流为零。求 $t = ${dec(t0)}$ 秒时的电流（安），精确到两位小数。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [round2(iInf), round2(iInf * Math.exp(-rt.toNumber())), round2(iInf * (1 - Math.exp((-L * t0.toNumber()) / R)))].filter(
            (w) => w.sign() > 0,
          ),
          solution: t(
            steps(
              `The steady current is $\\frac{V_0}{R} = \\frac{${V0}}{${R}} = ${iInf}$ A, and $\\frac{R}{L} = ${Q.of(R, L).toLatex()}$.`,
              `$i(${dec(t0)}) = ${iInf}\\left(1 - e^{-${dec(rt)}}\\right) \\approx ${dec(ans)}\\text{ A}$.`,
            ),
            steps(
              `稳态电流为 $\\frac{V_0}{R} = \\frac{${V0}}{${R}} = ${iInf}$ 安，$\\frac{R}{L} = ${Q.of(R, L).toLatex()}$。`,
              `$i(${dec(t0)}) = ${iInf}\\left(1 - e^{-${dec(rt)}}\\right) \\approx ${dec(ans)}\\text{ 安}$。`,
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
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rc-circuit-charging-and-discharging",
      title: t("Steady-state capacitor charge in an RC circuit", "RC 串联电路的稳态电荷量"),
      explanation: t(
        "For an RC circuit $R\\frac{dq}{dt} + \\frac{q}{C} = V_0$, the charge builds up according to $q(t) = C V_0(1 - e^{-t/(RC)})$. At steady state as $t \\to \\infty$, the capacitor is fully charged with $q_\\infty = C V_0$.",
        "对于 RC 充电电路 $R\\frac{dq}{dt} + \\frac{q}{C} = V_0$，电荷量积累规律为 $q(t) = C V_0(1 - e^{-t/(RC)})$。在稳态极限 $t \\to \\infty$ 时，电容器充满电，最大电荷量为 $q_\\infty = C V_0$。",
      ),
      generate(rng: Rng): Problem {
        const C = rng.int(2, 20); // in microfarads
        const V0 = rng.int(10, 100); // in Volts
        const ans = C * V0; // in microcoulombs
        const R = rng.int(10, 50); // in k-ohms

        const prompt = t(
          `A series circuit has a resistor $R = ${R}\\text{ k}\\Omega$, a capacitor $C = ${C}\\ \\mu\\text{F}$, and a constant voltage source $V_0 = ${V0}\\text{ V}$. Find the steady-state maximum charge $q_\\infty$ on the capacitor (in $\\mu\\text{C}$) as $t \\to \\infty$.`,
          `一个串联电路包含电阻 $R = ${R}\\text{ 千欧}$、电容 $C = ${C}\\ \\mu\\text{F}$ 以及恒定电源 $V_0 = ${V0}\\text{ 伏}$。求当 $t \\to \\infty$ 时电容器上的稳态最大电荷量 $q_\\infty$（单位：$\\mu\\text{C}$）。`,
        );
        const solution = t(
          steps(
            `Kirchhoff's voltage law for the circuit gives $R \\frac{dq}{dt} + \\frac{q}{C} = V_0$.`,
            `When the capacitor is fully charged ($t \\to \\infty$), the current ceases so $\\frac{dq}{dt} = 0$.`,
            `The differential equation gives $\\frac{q_\\infty}{C} = V_0 \\implies q_\\infty = C V_0$.`,
            `Compute: $q_\\infty = (${C}\\ \\mu\\text{F}) \\times (${V0}\\text{ V}) = ${ans}\\ \\mu\\text{C}$.`,
          ),
          steps(
            `根据基尔霍夫电压定律，电路满足微分方程 $R \\frac{dq}{dt} + \\frac{q}{C} = V_0$。`,
            `当电容器充满电（$t \\to \\infty$）时，回路中无电流流动，即 $\\frac{dq}{dt} = 0$。`,
            `微分方程化简为电容两端电压等于电源电压：$\\frac{q_\\infty}{C} = V_0 \\implies q_\\infty = C V_0$。`,
            `计算电荷量：$q_\\infty = (${C}\\ \\mu\\text{F}) \\times (${V0}\\text{ 伏}) = ${ans}\\ \\mu\\text{C}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + R, Math.round(ans / 2), ans * 2],
        });
      },
    },
    {
      id: "the-charge-while-discharging",
      title: t("The charge while discharging", "放电过程中的电荷"),
      explanation: t(
        "With no voltage source, $R\\frac{dq}{dt} + \\frac{q}{C} = 0$ is separable, and a capacitor that starts with charge $q_0$ discharges as\n\n$$q(t) = q_0 e^{-t/(RC)}.$$\n\nThe time constant is $\\tau = RC$; with $R$ in $\\text{k}\\Omega$ and $C$ in $\\mu\\text{F}$, the product $RC$ is in milliseconds. The charge halves every $RC\\ln 2$, so a $10\\text{ k}\\Omega$, $5\\ \\mu\\text{F}$ circuit has $\\tau = 50$ ms and loses half its charge in about $34.66$ ms.",
        "没有电源时，$R\\frac{dq}{dt} + \\frac{q}{C} = 0$ 可分离变量，初始电荷为 $q_0$ 的电容器按下式放电：\n\n$$q(t) = q_0 e^{-t/(RC)}.$$\n\n时间常数为 $\\tau = RC$；$R$ 以 $\\text{k}\\Omega$、$C$ 以 $\\mu\\text{F}$ 为单位时，$RC$ 的单位是毫秒。电荷每经过 $RC\\ln 2$ 减半，所以 $10\\text{ k}\\Omega$、$5\\ \\mu\\text{F}$ 的电路 $\\tau = 50$ 毫秒，约 $34.66$ 毫秒后电荷减半。",
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
            wrong: [round2(tau / n), round2(tau * n), round2(Math.log(n) / tau)],
            solution: t(
              steps(
                `$\\tau = RC = ${R} \\cdot ${C} = ${tau}$ ms, and $q(t) = ${q0}e^{-t/${tau}}$.`,
                `Setting $e^{-t/${tau}} = \\frac{1}{${n}}$ gives $t = ${tau}\\ln ${n} \\approx ${dec(ans)}$ ms.`,
              ),
              steps(
                `$\\tau = RC = ${R} \\cdot ${C} = ${tau}$ 毫秒，$q(t) = ${q0}e^{-t/${tau}}$。`,
                `令 $e^{-t/${tau}} = \\frac{1}{${n}}$，得 $t = ${tau}\\ln ${n} \\approx ${dec(ans)}$ 毫秒。`,
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
          wrong: [round2(q0 * (1 - Math.exp(-t0 / tau))), round2(q0 * Math.exp(-t0 * tau)), round2(q0 * Math.exp((-t0 * C) / R))].filter(
            (w) => w.sign() > 0,
          ),
          solution: t(
            steps(
              `$\\tau = RC = ${R} \\cdot ${C} = ${tau}$ ms, and $q(t) = ${q0}e^{-t/${tau}}$.`,
              `$q(${t0}) = ${q0}e^{-${dec(Q.of(t0, tau))}} \\approx ${dec(ans)}\\ \\mu\\text{C}$.`,
            ),
            steps(
              `$\\tau = RC = ${R} \\cdot ${C} = ${tau}$ 毫秒，$q(t) = ${q0}e^{-t/${tau}}$。`,
              `$q(${t0}) = ${q0}e^{-${dec(Q.of(t0, tau))}} \\approx ${dec(ans)}\\ \\mu\\text{C}$。`,
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
