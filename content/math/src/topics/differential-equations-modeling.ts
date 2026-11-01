import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { numberProblem, steps } from "../problems.ts";

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
  ],
};

/** modelingMixtureProblemsWithFirstOrderLinearOdes models inflow with non-zero concentration. */
export const modelingMixtureProblemsWithFirstOrderLinearOdes: TopicDef = {
  id: "modeling-mixture-problems-with-first-order-linear-odes",
  title: t("Modeling Mixture Problems With First-Order Linear ODEs", "一阶线性微分方程的混合问题建模"),
  summary: t(
    "When incoming fluid contains concentration c_in of solute, the amount S(t) satisfies dS/dt + (r/V) S = r c_in, with steady-state capacity S_∞ = V c_in.",
    "当流入液体含有浓度为 c_in 的溶质时，溶质质量 S(t) 满足一阶线性方程 dS/dt + (r/V) S = r c_in，其稳态极限为 S_∞ = V c_in。",
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
        "For $y = C x^k$, differentiating yields $\\frac{dy}{dx} = \\frac{k y}{x}$. The orthogonal trajectories satisfy $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$, giving the family $x^2 + k y^2 = C'$.",
        "对于曲线族 $y = C x^k$，求导消去常数 $C$ 得 $\\frac{dy}{dx} = \\frac{k y}{x}$。其正交轨迹满足负倒数斜率 $\\frac{dy}{dx} = -\\frac{x}{k y} \\implies k y\\,dy + x\\,dx = 0$，积分得到曲线族 $x^2 + k y^2 = C'$。",
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
            `Separate variables: ${k}y\\,dy = -x\\,dx \\implies x\\,dx + ${k}y\\,dy = 0$.`,
            `Integrate both sides: $\\frac{x^2}{2} + \\frac{${k}y^2}{2} = K \\implies x^2 + ${k}y^2 = C'$.`,
            `Comparing with $x^2 + B y^2 = C'$, we obtain $B = ${ans}$.`,
          ),
          steps(
            `对曲线族 $y = C x^{${k}}$ 关于 $x$ 求导：$\\frac{dy}{dx} = ${k} C x^{${k}-1}$。`,
            `由 $C = \\frac{y}{x^{${k}}}$ 消去参数 $C$：$\\frac{dy}{dx} = ${k} \\left(\\frac{y}{x^{${k}}}\\right) x^{${k}-1} = \\frac{${k}y}{x}$。`,
            `正交轨迹的斜率为负倒数：$\\frac{dy}{dx} = -\\frac{x}{${k}y}$。`,
            `分离变量：${k}y\\,dy = -x\\,dx \\implies x\\,dx + ${k}y\\,dy = 0$。`,
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
  ],
};

/** inhibitedDecayModelsWithFirstOrderOdes models Newton's law of cooling. */
export const inhibitedDecayModelsWithFirstOrderOdes: TopicDef = {
  id: "inhibited-decay-models-with-first-order-odes",
  title: t("Inhibited Decay Models With First-Order ODEs", "一阶微分方程的受阻衰减模型"),
  summary: t(
    "Newton's law of cooling dT/dt = -k(T - T_m) models the temperature of an object approaching surrounding medium temperature T_m.",
    "牛顿冷却定律 dT/dt = -k(T - T_m) 描述物体温度随时间衰减并趋于周围介质环境温度 T_m 的过程。",
  ),
  prerequisites: ["inhibited-growth-models-with-first-order-odes"],
  encompasses: [{ topic: "inhibited-growth-models-with-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "newtons-law-of-cooling",
      title: t("Newton's law of cooling", "牛顿冷却定律"),
      explanation: t(
        "According to Newton's law of cooling, $\\frac{dT}{dt} = -k(T - T_m)$. The rate of temperature decrease is $-\\frac{dT}{dt} = k(T - T_m)$.",
        "根据牛顿冷却定律，$\\frac{dT}{dt} = -k(T - T_m)$。温度的下降速率为 $-\\frac{dT}{dt} = k(T - T_m)$。",
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
            `Calculate the product: ${k} \\times ${diff} = ${ans}^\\circ\\text{C/min}$.`,
          ),
          steps(
            `温度的下降速率由 $-\\frac{dT}{dt} = ${k}(T - ${Tm})$ 给出。`,
            `代入 $T = ${Tval}^\\circ\\text{C}$：$-\\frac{dT}{dt} = ${k}(${Tval} - ${Tm}) = ${k}(${diff})$。`,
            `计算乘积：${k} \\times ${diff} = ${ans}^\\circ\\text{C/分}$。`,
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
    "Under gravity and linear air resistance -bv, an object's downward velocity satisfies m dv/dt = mg - bv, yielding terminal velocity v_term = mg/b.",
    "在重力和线性空气阻力 -bv 作用下，落体的向下速度满足 m dv/dt = mg - bv，其收尾终端速度为 v_term = mg/b。",
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
        "Terminal velocity is reached when acceleration becomes zero ($m\\frac{dv}{dt} = 0$), so $mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$.",
        "当加速度降为零（$m\\frac{dv}{dt} = 0$）时物体达到收尾速度，此时重力与阻力平衡：$mg - bv_{\\text{term}} = 0 \\implies v_{\\text{term}} = \\frac{mg}{b}$。",
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
            `Substitute the given values: ${W} - ${b}v_{\\text{term}} = 0$.`,
            `Solve for $v_{\\text{term}}$: $v_{\\text{term}} = \\frac{${W}}{${b}} = ${ans}\\text{ m/s}$.`,
          ),
          steps(
            `根据牛顿第二定律，物体向下的运动方程为 $m \\frac{dv}{dt} = mg - bv$。`,
            `当合外力为零、加速度消失时达到收尾速度：$mg - bv_{\\text{term}} = 0$。`,
            `代入已知数值：${W} - ${b}v_{\\text{term}} = 0$。`,
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
  ],
};

/** fallingBodyProblemsWithQuadraticDrag determines terminal velocity under quadratic resistance. */
export const fallingBodyProblemsWithQuadraticDrag: TopicDef = {
  id: "falling-body-problems-with-quadratic-drag",
  title: t("Falling Body Problems With Quadratic Drag", "二次阻力下的落体问题"),
  summary: t(
    "For high-speed falling objects, air resistance is proportional to v^2: m dv/dt = mg - c v^2, with terminal velocity v_term = √(mg/c).",
    "高速运动落体的阻力与速度平方成正比：m dv/dt = mg - c v^2，其终端收尾速度为 v_term = √(mg/c)。",
  ),
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [{ topic: "falling-body-problems-with-linear-drag", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "terminal-velocity-with-quadratic-air-resistance",
      title: t("Terminal velocity with quadratic air resistance", "二次空气阻力下的收尾速度"),
      explanation: t(
        "At terminal velocity under quadratic drag, $mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$.",
        "二次空气阻力达到平衡时，$mg - c v_{\\text{term}}^2 = 0 \\implies v_{\\text{term}} = \\sqrt{\\frac{mg}{c}}$。",
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
            `Substitute $mg = ${W}$ and $c = ${c}$: ${W} = ${c} v_{\\text{term}}^2$.`,
            `Solve for $v_{\\text{term}}^2$: $v_{\\text{term}}^2 = \\frac{${W}}{${c}} = ${ans * ans}$.`,
            `Take the square root: $v_{\\text{term}} = \\sqrt{${ans * ans}} = ${ans}\\text{ m/s}$.`,
          ),
          steps(
            `达到终端收尾速度时，重力与空气阻力相互平衡：$mg = c v_{\\text{term}}^2$。`,
            `代入 $mg = ${W}$ 与 $c = ${c}$：${W} = ${c} v_{\\text{term}}^2$。`,
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
  ],
};

/** newtonsLawOfUniversalGravitation models gravitational attraction as an inverse-square law. */
export const newtonsLawOfUniversalGravitation: TopicDef = {
  id: "newtons-law-of-universal-gravitation",
  title: t("Newton's Law of Universal Gravitation", "万有引力定律"),
  summary: t(
    "Newton's law states gravitational force is inversely proportional to r^2: F = -GMm/r^2 = -mg_0 (R/r)^2, causing variable acceleration at planetary distances.",
    "牛顿万有引力定律指出引力与距离平方成反比：F = -GMm/r^2 = -mg_0 (R/r)^2，在大尺度天体运动中加速度随距离衰减。",
  ),
  prerequisites: ["falling-body-problems-with-linear-drag"],
  encompasses: [{ topic: "falling-body-problems-with-linear-drag", weight: 0.3 }],
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
  ],
};

/** modelingEscapeVelocityWithFirstOrderOdes derives escape velocity via chain rule. */
export const modelingEscapeVelocityWithFirstOrderOdes: TopicDef = {
  id: "modeling-escape-velocity-with-first-order-odes",
  title: t("Modeling Escape Velocity With First-Order ODEs", "一阶微分方程建模逃逸速度"),
  summary: t(
    "Using v dv/dr = -g_0 R^2/r^2, integrating from r = R to ∞ yields the escape velocity v_esc = √(2 g_0 R).",
    "利用微分链式法则 v dv/dr = -g_0 R^2/r^2，从 r = R 积分至无穷大可推导得出逃逸速度公式 v_esc = √(2 g_0 R)。",
  ),
  prerequisites: ["newtons-law-of-universal-gravitation"],
  encompasses: [{ topic: "newtons-law-of-universal-gravitation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "deriving-escape-velocity-via-chain-rule",
      title: t("Deriving escape velocity via chain rule", "应用链式法则推导天体逃逸速度"),
      explanation: t(
        "By rewriting acceleration as $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$ and integrating $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$, we find $v_{\\text{esc}}^2 = 2 g_0 R$.",
        "将加速度改写为 $v \\frac{dv}{dr} = -\\frac{g_0 R^2}{r^2}$，两端积分 $\\int_{v_{\\text{esc}}}^0 v\\,dv = -g_0 R^2 \\int_R^\\infty \\frac{dr}{r^2}$，可求得逃逸速度平方 $v_{\\text{esc}}^2 = 2 g_0 R$。",
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
  ],
};

/** modelingRlCircuitsWithFirstOrderOdes models series RL circuit transient and steady state. */
export const modelingRlCircuitsWithFirstOrderOdes: TopicDef = {
  id: "modeling-rl-circuits-with-first-order-odes",
  title: t("Modeling RL Circuits With First-Order ODEs", "一阶微分方程建模 RL 电路"),
  summary: t(
    "In a series RL circuit, current satisfies L di/dt + R i = V(t), with steady-state current i_∞ = V_0/R under constant voltage V_0.",
    "在串联 RL 电路中，电流满足 L di/dt + R i = V(t)；在恒定电压 V_0 激励下，稳态电流为 i_∞ = V_0/R。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rl-circuit-transient-and-steady-state-current",
      title: t("Steady-state current in an RL circuit", "RL 串联电路的稳态电流"),
      explanation: t(
        "For an RL circuit governed by $L\\frac{di}{dt} + Ri = V_0$, the current is $i(t) = \\frac{V_0}{R}(1 - e^{-Rt/L})$. As $t \\to \\infty$, the inductor acts as a short circuit ($\\\\frac{di}{dt} = 0$), giving steady-state current $i_\\infty = \\frac{V_0}{R}$.",
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
            `Substitute the given components: ${L} \\frac{di}{dt} + ${R} i = ${V0}$.`,
            `As $t \\to \\infty$, the transient current settles into steady state where $\\frac{di}{dt} = 0$.`,
            `The equation reduces to $R i_\\infty = V_0 \\implies i_\\infty = \\frac{V_0}{R} = \\frac{${V0}}{${R}} = ${ans}\\text{ A}$.`,
          ),
          steps(
            `由基尔霍夫电压定律列出一阶微分方程：$L \\frac{di}{dt} + R i = V_0$。`,
            `代入电路参数：${L} \\frac{di}{dt} + ${R} i = ${V0}$。`,
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
  ],
};

/** modelingRcCircuitsWithFirstOrderOdes models series RC circuit charge and discharging. */
export const modelingRcCircuitsWithFirstOrderOdes: TopicDef = {
  id: "modeling-rc-circuits-with-first-order-odes",
  title: t("Modeling RC Circuits With First-Order ODEs", "一阶微分方程建模 RC 电路"),
  summary: t(
    "In a series RC circuit, capacitor charge satisfies R dq/dt + (1/C) q = V(t), with maximum charge q_max = C V_0 under constant voltage V_0.",
    "在串联 RC 电路中，电容器电荷量满足 R dq/dt + (1/C) q = V(t)；在恒压源 V_0 充电下，最大稳态电荷量为 q_max = C V_0。",
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
