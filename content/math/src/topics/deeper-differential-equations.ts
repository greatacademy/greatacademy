// Further knowledge points for topics of Differential Equations, each a skill the
// topic's own points leave out. See `deeperDifferentialEquationsPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { lowestTerms, numberProblem } from "../problems.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));
/** matrix2 writes a two-by-two matrix by its rows. */
const matrix2 = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** decimal writes a whole number of tenths as a decimal. */
const decimal = (n: number) => `${n / 10}`;
/** complexRoots writes the conjugate roots with real part -p and imaginary part q. */
const complexRoots = (p: number, q: number) => `${-p} \\pm ${q === 1 ? "" : q}i`;

const levelThroughAPoint: KnowledgePointDef = {
  id: "the-level-of-the-solution-through-a-point",
  title: t("The level of the solution through a point", "过一点的解所在的等值线"),
  explanation: t(
    "The solutions of an exact equation $M\\,dx + N\\,dy = 0$ are the level curves $F(x, y) = C$ of its potential function. An initial condition picks one of these curves. So build $F$ with $F_x = M$ and $F_y = N$, and evaluate it at the given point to find $C$.",
    "恰当方程 $M\\,dx + N\\,dy = 0$ 的解是势函数的等值线 $F(x, y) = C$。初始条件选出其中一条。所以先由 $F_x = M$ 和 $F_y = N$ 构造 $F$，再把给定的点代入，求出 $C$。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const b = nonzero(rng, 5);
    const c = rng.int(1, 4);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const answer = a * p * p + b * p * q + c * q * q;
    const M = poly([2 * a, "x"], [b, "y"]);
    const N = poly([b, "x"], [2 * c, "y"]);
    const F = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
    return numberProblem({
      prompt: t(
        `The solution of $(${M})\\,dx + (${N})\\,dy = 0$ through the point $(${p}, ${q})$ is the curve $F(x, y) = C$, where $F$ has no constant term. Find $C$.`,
        `$(${M})\\,dx + (${N})\\,dy = 0$ 过点 $(${p}, ${q})$ 的解是曲线 $F(x, y) = C$，其中 $F$ 没有常数项。求 $C$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * p * p + c * q * q, 2 * answer, a * p * p + 2 * b * p * q + c * q * q],
      solution: t(
        `Integrating gives $F(x, y) = ${F}$; the $xy$ term comes once, from either integration. At the point, $C = ${answer}$.`,
        `积分得 $F(x, y) = ${F}$；$xy$ 项只算一次，它在两次积分中都会出现。代入这一点得 $C = ${answer}$。`,
      ),
    });
  },
};

const bifurcationValue: KnowledgePointDef = {
  id: "the-parameter-where-equilibria-appear",
  title: t("The parameter where equilibria appear", "平衡解出现时的参数值"),
  explanation: t(
    "As a parameter changes, the equilibria of an equation can merge and vanish. This change is called a bifurcation. For a quadratic right-hand side, the equilibria are its roots, and the change happens where the discriminant is zero. At that value there is exactly one equilibrium.",
    "参数变化时，方程的平衡解可能合并并消失，这种变化叫作分岔。右端是二次式时，平衡解就是它的根，变化发生在判别式为零的地方。此时恰有一个平衡解。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const B = nonzero(rng, 9);
    const answer = a * B * B;
    const right = poly([a, "y^2"], [2 * a * B, "y"]);
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $y' = ${right} + k$ have exactly one equilibrium solution?`,
        `$k$ 取何值时 $y' = ${right} + k$ 恰有一个平衡解？`,
      ),
      answer,
      solveFor: "k",
      wrong: [B * B, -answer, 4 * answer],
      solution: t(
        `The discriminant of the right-hand side is $${inParens(2 * a * B)}^2 - 4 \\cdot ${a} \\cdot k$. Setting it to zero gives $k = ${answer}$.`,
        `右端的判别式是 $${inParens(2 * a * B)}^2 - 4 \\cdot ${a} \\cdot k$。令它为零，得 $k = ${answer}$。`,
      ),
    });
  },
};

const largestHarvest: KnowledgePointDef = {
  id: "the-largest-sustainable-harvest",
  title: t("The largest sustainable harvest", "最大的可持续收获量"),
  explanation: t(
    "With a constant harvest $h$, logistic growth becomes $P' = rP\\left(1 - \\frac{P}{K}\\right) - h$. A steady population needs an equilibrium, so $h$ must not exceed the largest natural growth rate. That peak is at $P = \\frac{K}{2}$, where the rate is $\\frac{rK}{4}$. A larger harvest drives the population to extinction.",
    "有固定收获量 $h$ 时，逻辑斯蒂增长变成 $P' = rP\\left(1 - \\frac{P}{K}\\right) - h$。要维持稳定的种群，必须存在平衡解，所以 $h$ 不能超过自然增长率的最大值。这个峰值在 $P = \\frac{K}{2}$ 处，增长率是 $\\frac{rK}{4}$。收获更多，种群就会灭绝。",
  ),
  generate(rng) {
    const r = rng.int(1, 9);
    const K = 100 * rng.int(1, 20);
    const answer = Q.of(r * K, 40);
    return numberProblem({
      prompt: t(
        `A population satisfies $P' = ${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) - h$, with a constant harvest $h$. What is the largest $h$ for which an equilibrium exists?`,
        `种群满足 $P' = ${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) - h$，其中 $h$ 是固定的收获量。存在平衡解的最大 $h$ 是多少？`,
      ),
      answer,
      wrong: [Q.of(r * K, 20), Q.of(r * K, 10), Q.of(K, 4)],
      solution: t(
        `Natural growth peaks at $P = ${K / 2}$, with rate $${decimal(r)} \\cdot ${K / 2} \\cdot \\frac{1}{2} = ${answer.toLatex()}$. An equilibrium exists only if $h$ is at most this.`,
        `自然增长率在 $P = ${K / 2}$ 处达到峰值，增长率是 $${decimal(r)} \\cdot ${K / 2} \\cdot \\frac{1}{2} = ${answer.toLatex()}$。只有 $h$ 不超过它时才存在平衡解。`,
      ),
    });
  },
};

const initialFromTwoReadings: KnowledgePointDef = {
  id: "an-initial-value-from-two-readings",
  title: t("An initial value from two readings", "由两次读数求初始值"),
  explanation: t(
    "Exponential change multiplies by the same factor over equal times. If two readings are one interval apart, their quotient is that factor. Dividing the first reading by the factor steps back one interval. When the readings are at times $T$ and $2T$, this gives $A(0) = \\frac{A(T)^2}{A(2T)}$.",
    "指数变化在相等的时间内乘以相同的因子。如果两次读数相隔一段时间，它们的商就是这个因子。第一次读数除以这个因子，就回退了一段时间。读数在 $T$ 和 $2T$ 时，得 $A(0) = \\frac{A(T)^2}{A(2T)}$。",
  ),
  generate(rng) {
    const A0 = 4 * rng.int(1, 9);
    const r = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2)]);
    const T = rng.int(1, 10);
    const u = Q.of(A0).mul(r);
    const v = u.mul(r);
    return numberProblem({
      prompt: t(
        `A quantity satisfies $A' = kA$. It equals $${u.toLatex()}$ at $t = ${T}$ and $${v.toLatex()}$ at $t = ${2 * T}$. Find $A(0)$.`,
        `某个量满足 $A' = kA$。它在 $t = ${T}$ 时等于 $${u.toLatex()}$，在 $t = ${2 * T}$ 时等于 $${v.toLatex()}$。求 $A(0)$。`,
      ),
      answer: A0,
      wrong: [u.add(u).sub(v), u, v],
      solution: t(
        `Each interval of length $${T}$ multiplies the amount by $${r.toLatex()}$. Going back one interval from the first reading gives $${u.toLatex()} \\div ${r.toLatex()} = ${A0}$.`,
        `每段长为 $${T}$ 的时间使这个量乘以 $${r.toLatex()}$。从第一次读数回退一段，得 $${u.toLatex()} \\div ${r.toLatex()} = ${A0}$。`,
      ),
    });
  },
};

const halfLifeFromReadings: KnowledgePointDef = {
  id: "a-half-life-from-two-amounts",
  title: t("A half-life from two amounts", "由两个量求半衰期"),
  explanation: t(
    "If an amount falls by an exact power of two, count how many halvings that takes. The elapsed time divided by this count is the half-life. No logarithm is needed in this case, and the size of the starting amount does not matter, only the ratio of the two amounts.",
    "如果一个量恰好减少到二的幂分之一，就数一数减半了多少次。经过的时间除以这个次数就是半衰期。这种情况不需要对数，初始量的大小也不重要，只有两个量的比值才有关系。",
  ),
  generate(rng) {
    const H = rng.int(2, 12);
    const n = rng.int(2, 5);
    const end = rng.int(1, 9);
    const start = end * 2 ** n;
    const time = n * H;
    return numberProblem({
      prompt: t(
        `A sample decays exponentially from ${start} g to ${end} g in ${time} years. What is its half-life, in years?`,
        `某样品从 ${start} g 按指数衰减到 ${end} g，用了 ${time} 年。它的半衰期是多少年？`,
      ),
      answer: H,
      form: "integer",
      wrong: [Math.round(time / 2), time, n],
      solution: t(
        `The ratio is $\\frac{${start}}{${end}} = 2^{${n}}$, so the sample halved $${n}$ times. The half-life is $\\frac{${time}}{${n}} = ${H}$ years.`,
        `比值是 $\\frac{${start}}{${end}} = 2^{${n}}$，所以样品减半了 $${n}$ 次。半衰期是 $\\frac{${time}}{${n}} = ${H}$ 年。`,
      ),
    });
  },
};

const logisticAfterGrowthFactor: KnowledgePointDef = {
  id: "a-logistic-value-from-the-exponential-factor",
  title: t("A logistic value from the exponential factor", "由指数因子求逻辑斯蒂值"),
  explanation: t(
    "The logistic solution is $P(t) = \\frac{K}{1 + Ae^{-rt}}$, with $A = \\frac{K - P_0}{P_0}$. The time enters only through $e^{rt}$. So if this factor is known, the population can be found without knowing $r$ or $t$ separately. Early growth is close to exponential, but the denominator holds it below $K$.",
    "逻辑斯蒂解是 $P(t) = \\frac{K}{1 + Ae^{-rt}}$，其中 $A = \\frac{K - P_0}{P_0}$。时间只通过 $e^{rt}$ 出现。所以只要知道这个因子，不必分别知道 $r$ 和 $t$ 就能求出种群数量。初期增长接近指数，但分母使它始终低于 $K$。",
  ),
  generate(rng) {
    const P0 = 10 * rng.int(1, 9);
    const A = rng.int(1, 9);
    const K = P0 * (1 + A);
    const m = rng.int(2, 9);
    const answer = Q.of(K * m, m + A);
    return numberProblem({
      prompt: t(
        `A population follows the logistic equation with $P(0) = ${P0}$ and carrying capacity ${K}. Find $P$ at the time when $e^{rt} = ${m}$.`,
        `种群服从逻辑斯蒂方程，$P(0) = ${P0}$，环境容量是 ${K}。求 $e^{rt} = ${m}$ 时的 $P$。`,
      ),
      answer,
      wrong: [Q.of(P0 * m), Q.of(K, m), Q.of(K, 1 + A * m)],
      solution: t(
        `Here $A = \\frac{${K} - ${P0}}{${P0}} = ${A}$. So $P = \\frac{${K}}{1 + \\frac{${A}}{${m}}} = ${answer.toLatex()}$.`,
        `这里 $A = \\frac{${K} - ${P0}}{${P0}} = ${A}$。所以 $P = \\frac{${K}}{1 + \\frac{${A}}{${m}}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const dragFromTerminal: KnowledgePointDef = {
  id: "the-drag-coefficient-from-terminal-velocity",
  title: t("The drag coefficient from terminal velocity", "由终端速度求阻力系数"),
  explanation: t(
    "At terminal velocity the acceleration is zero, so drag exactly balances weight. With quadratic drag, $mv' = mg - kv^2$ gives $kv_T^2 = mg$. A measured terminal velocity therefore gives the coefficient $k$, with no need to solve the differential equation at all.",
    "达到终端速度时加速度为零，所以阻力恰好与重力平衡。对二次阻力，由 $mv' = mg - kv^2$ 得 $kv_T^2 = mg$。所以测出终端速度就能得到系数 $k$，完全不必解微分方程。",
  ),
  generate(rng) {
    const m = rng.int(1, 9);
    const v = rng.int(5, 30);
    const answer = Q.of(10 * m, v * v);
    return numberProblem({
      prompt: t(
        `An object of mass ${m} kg falls with drag force $kv^2$ and reaches a terminal velocity of ${v} m/s. Taking $g = 10$ m/s², find $k$.`,
        `质量为 ${m} kg 的物体下落，阻力是 $kv^2$，终端速度是 ${v} m/s。取 $g = 10$ m/s²，求 $k$。`,
      ),
      answer,
      wrong: [Q.of(10 * m, v), Q.of(10, v * v), Q.of(v * v, 10 * m)],
      solution: t(
        `At terminal velocity, $k \\cdot ${v}^2 = ${m} \\cdot 10$. So $k = \\frac{${10 * m}}{${v * v}} = ${answer.toLatex()}$.`,
        `达到终端速度时，$k \\cdot ${v}^2 = ${m} \\cdot 10$。所以 $k = \\frac{${10 * m}}{${v * v}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const escapeRatio: KnowledgePointDef = {
  id: "comparing-the-escape-velocities-of-two-planets",
  title: t("Comparing the escape velocities of two planets", "比较两颗行星的逃逸速度"),
  explanation: t(
    "The escape velocity $v = \\sqrt{\\frac{2GM}{R}}$ depends on mass and radius only through their quotient, and then only by a square root. So in a comparison the constants cancel. Multiplying the mass by $a$ and the radius by $b$ multiplies the escape velocity by $\\sqrt{\\frac{a}{b}}$.",
    "逃逸速度 $v = \\sqrt{\\frac{2GM}{R}}$ 只通过商依赖于质量和半径，而且还要开平方。所以比较时常数都约去了。质量乘以 $a$、半径乘以 $b$，逃逸速度就乘以 $\\sqrt{\\frac{a}{b}}$。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const r = rng.int(2, 7);
    const M = a * a * r;
    return numberProblem({
      prompt: t(
        `A planet has ${M} times the mass and ${r} times the radius of another. How many times the other's escape velocity is its escape velocity?`,
        `一颗行星的质量是另一颗的 ${M} 倍，半径是其 ${r} 倍。它的逃逸速度是另一颗的多少倍？`,
      ),
      answer: a,
      form: "integer",
      wrong: [a * a, M, r],
      solution: t(
        `The escape velocity is proportional to $\\sqrt{\\frac{M}{R}}$, so the factor is $\\sqrt{\\frac{${M}}{${r}}} = ${a}$.`,
        `逃逸速度与 $\\sqrt{\\frac{M}{R}}$ 成正比，所以倍数是 $\\sqrt{\\frac{${M}}{${r}}} = ${a}$。`,
      ),
    });
  },
};

const annihilatorOrder: KnowledgePointDef = {
  id: "the-order-of-an-annihilating-operator",
  title: t("The order of an annihilating operator", "零化算子的阶"),
  explanation: t(
    "The operator $(D - a)^{n+1}$ sends $x^ne^{ax}$ to zero, because each factor lowers the power of $x$ by one. For a sum with different exponential rates, multiply the operators for the separate terms. The order of the product is the total of the separate orders, and no smaller constant-coefficient operator works.",
    "算子 $(D - a)^{n+1}$ 把 $x^ne^{ax}$ 变成零，因为每个因子都使 $x$ 的幂次降低一。对指数速率不同的和，把各项的算子相乘。乘积的阶是各阶之和，没有更低阶的常系数算子能做到。",
  ),
  generate(rng) {
    const n = rng.int(0, 3);
    const m = rng.int(0, 3);
    const a = rng.int(1, 5);
    const b = different(rng, 1, 5, a);
    const term = (power: number, rate: number) => `${power === 0 ? "" : power === 1 ? "x" : `x^${power}`}e^{${poly([rate, "x"])}}`;
    const answer = n + m + 2;
    const factor = (rate: number, order: number) => (order === 1 ? `(D - ${rate})` : `(D - ${rate})^{${order}}`);
    return numberProblem({
      prompt: t(
        `What is the smallest order of a linear constant-coefficient differential operator that sends $${term(n, a)} + ${term(m, b)}$ to zero?`,
        `能把 $${term(n, a)} + ${term(m, b)}$ 变成零的线性常系数微分算子，最低是几阶？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.max(n, m) + 1, n + m, n + m + 1],
      solution: t(
        `The operator $${factor(a, n + 1)}${factor(b, m + 1)}$ does this, and its order is $${n + 1} + ${m + 1} = ${answer}$.`,
        `算子 $${factor(a, n + 1)}${factor(b, m + 1)}$ 可以做到，它的阶是 $${n + 1} + ${m + 1} = ${answer}$。`,
      ),
    });
  },
};

const boundedSlope: KnowledgePointDef = {
  id: "the-initial-slope-that-keeps-a-solution-bounded",
  title: t("The initial slope that keeps a solution bounded", "使解有界的初始斜率"),
  explanation: t(
    "With roots of opposite signs, the general solution is $c_1e^{rt} + c_2e^{st}$ with $r > 0 > s$. The first term grows without bound unless $c_1 = 0$. So a bounded solution is a multiple of $e^{st}$ alone, and its initial slope must be $s$ times its initial value.",
    "两根异号时，通解是 $c_1e^{rt} + c_2e^{st}$，其中 $r > 0 > s$。除非 $c_1 = 0$，否则第一项无限增长。所以有界解只是 $e^{st}$ 的倍数，它的初始斜率必须等于 $s$ 乘以初始值。",
  ),
  generate(rng) {
    const r = rng.int(1, 6);
    const s = -rng.int(1, 6);
    const y0 = rng.int(1, 9);
    const answer = s * y0;
    const b = -(r + s);
    const c = r * s;
    return numberProblem({
      prompt: t(
        `For $${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0$ with $y(0) = ${y0}$, which value of $y'(0)$ makes the solution bounded as $t \\to \\infty$?`,
        `对 $${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0$，$y(0) = ${y0}$，$y'(0)$ 取何值时解在 $t \\to \\infty$ 时有界？`,
      ),
      answer,
      form: "integer",
      wrong: [r * y0, y0, s],
      solution: t(
        `The characteristic roots are $${r}$ and $${s}$. A bounded solution has no $e^{${r === 1 ? "" : r}t}$ term, so $y = ${poly([y0, `e^{${poly([s, "t"])}}`])}$, and $y'(0) = ${answer}$.`,
        `特征根是 $${r}$ 和 $${s}$。有界解不含 $e^{${r === 1 ? "" : r}t}$ 项，所以 $y = ${poly([y0, `e^{${poly([s, "t"])}}`])}$，$y'(0) = ${answer}$。`,
      ),
    });
  },
};

const peakWithRepeatedRoot: KnowledgePointDef = {
  id: "the-peak-of-a-solution-with-a-repeated-root",
  title: t("The peak of a solution with a repeated root", "重根解的峰值时刻"),
  explanation: t(
    "With a repeated root $-a$ and $y(0) = 0$, the solution is $y = vte^{-at}$. The factor $t$ makes it rise at first, and the exponential makes it decay later. Setting $y' = 0$ shows the peak is at $t = \\frac{1}{a}$, and this time does not depend on the initial slope $v$.",
    "重根为 $-a$ 且 $y(0) = 0$ 时，解是 $y = vte^{-at}$。因子 $t$ 使它先上升，指数项使它后来衰减。令 $y' = 0$，得峰值在 $t = \\frac{1}{a}$ 处，这个时刻与初始斜率 $v$ 无关。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const v = rng.int(1, 9);
    const answer = Q.of(1, a);
    return numberProblem({
      prompt: t(
        `Let $${poly([1, "y''"], [2 * a, "y'"], [a * a, "y"])} = 0$ with $y(0) = 0$ and $y'(0) = ${v}$. At what time $t > 0$ is $y$ largest?`,
        `设 $${poly([1, "y''"], [2 * a, "y'"], [a * a, "y"])} = 0$，$y(0) = 0$，$y'(0) = ${v}$。在什么时刻 $t > 0$，$y$ 最大？`,
      ),
      answer,
      wrong: [Q.of(2, a), Q.of(1, 2 * a), Q.of(v, a)],
      solution: t(
        `The solution is $y = ${poly([v, `te^{${poly([-a, "t"])}}`])}$, whose derivative is $${v === 1 ? "" : v}(${poly([1, ""], [-a, "t"])})e^{${poly([-a, "t"])}}$. This vanishes at $t = ${answer.toLatex()}$.`,
        `解是 $y = ${poly([v, `te^{${poly([-a, "t"])}}`])}$，它的导数是 $${v === 1 ? "" : v}(${poly([1, ""], [-a, "t"])})e^{${poly([-a, "t"])}}$，在 $t = ${answer.toLatex()}$ 处为零。`,
      ),
    });
  },
};

const firstZeroOfDampedOscillation: KnowledgePointDef = {
  id: "the-first-zero-of-a-damped-oscillation",
  title: t("The first zero of a damped oscillation", "阻尼振动的第一个零点"),
  explanation: t(
    "With complex roots $-p \\pm qi$ and $y(0) = 0$, the solution is $y = \\frac{v}{q}e^{-pt}\\sin qt$. The exponential is never zero, so the zeros are those of the sine. The first after the start is at $t = \\frac{\\pi}{q}$. Damping shrinks the swings but leaves the spacing of the zeros alone.",
    "复根为 $-p \\pm qi$ 且 $y(0) = 0$ 时，解是 $y = \\frac{v}{q}e^{-pt}\\sin qt$。指数项永不为零，所以零点就是正弦的零点，起点之后的第一个在 $t = \\frac{\\pi}{q}$ 处。阻尼使振幅缩小，但不改变零点的间距。",
  ),
  generate(rng) {
    const p = rng.int(1, 6);
    const q = rng.int(1, 9);
    const v = rng.int(1, 9);
    const answer = Q.of(1, q);
    return numberProblem({
      prompt: t(
        `Let $${poly([1, "y''"], [2 * p, "y'"], [p * p + q * q, "y"])} = 0$ with $y(0) = 0$ and $y'(0) = ${v}$. The first positive zero of $y$ is at $t = c\\pi$. Find $c$.`,
        `设 $${poly([1, "y''"], [2 * p, "y'"], [p * p + q * q, "y"])} = 0$，$y(0) = 0$，$y'(0) = ${v}$。$y$ 的第一个正零点在 $t = c\\pi$ 处。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(1, p), Q.of(2, q), Q.of(1, 2 * q)],
      solution: t(
        `The characteristic roots are $${complexRoots(p, q)}$, so $y$ is a multiple of $e^{${poly([-p, "t"])}}\\sin ${poly([q, "t"])}$. The sine first returns to zero at $${poly([q, "t"])} = \\pi$, so $c = ${answer.toLatex()}$.`,
        `特征根是 $${complexRoots(p, q)}$，所以 $y$ 是 $e^{${poly([-p, "t"])}}\\sin ${poly([q, "t"])}$ 的倍数。正弦在 $${poly([q, "t"])} = \\pi$ 时第一次回到零，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const forcingAtADoubleRoot: KnowledgePointDef = {
  id: "exponential-forcing-at-a-double-root",
  title: t("Exponential forcing at a double root", "重根处的指数强迫"),
  explanation: t(
    "If the forcing rate is a double root of the characteristic equation, both $e^{at}$ and $te^{at}$ solve the homogeneous equation, so the trial must be $At^2e^{at}$. Substituting, only the term in which both derivatives hit $t^2$ survives, which gives $2A$ on the left side.",
    "如果强迫项的速率是特征方程的重根，$e^{at}$ 和 $te^{at}$ 都是齐次方程的解，所以试探解必须是 $At^2e^{at}$。代入后，只有两次求导都作用在 $t^2$ 上的项留下来，左边得到 $2A$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const k = rng.int(1, 12);
    const answer = Q.of(k, 2);
    const rate = poly([a, "t"]);
    return numberProblem({
      prompt: t(
        `The equation $${poly([1, "y''"], [-2 * a, "y'"], [a * a, "y"])} = ${k}e^{${rate}}$ has a particular solution $At^2e^{${rate}}$. Find $A$.`,
        `方程 $${poly([1, "y''"], [-2 * a, "y'"], [a * a, "y"])} = ${k}e^{${rate}}$ 有特解 $At^2e^{${rate}}$。求 $A$。`,
      ),
      answer,
      wrong: [Q.of(k), Q.of(2 * k), Q.of(k, a * a)],
      solution: t(
        `Writing the left side as $(${poly([1, "D"], [-a, ""])})^2y$ and using $y = Ae^{${rate}}t^2$, the operator acts only on $t^2$ and gives $2Ae^{${rate}}$. So $2A = ${k}$ and $A = ${answer.toLatex()}$.`,
        `把左边写成 $(${poly([1, "D"], [-a, ""])})^2y$，代入 $y = Ae^{${rate}}t^2$，算子只作用在 $t^2$ 上，得 $2Ae^{${rate}}$。所以 $2A = ${k}$，$A = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const frequencyFromStretch: KnowledgePointDef = {
  id: "the-frequency-from-the-static-stretch-of-a-spring",
  title: t("The frequency from the static stretch of a spring", "由弹簧静伸长求频率"),
  explanation: t(
    "At rest, a hanging mass stretches a spring by a distance $d$ for which $kd = mg$. So $\\frac{k}{m} = \\frac{g}{d}$, and the natural frequency is $\\omega = \\sqrt{\\frac{g}{d}}$. Neither the mass nor the spring constant needs to be known separately: the stretch alone sets the frequency.",
    "静止时，悬挂的质量使弹簧伸长 $d$，满足 $kd = mg$。所以 $\\frac{k}{m} = \\frac{g}{d}$，固有频率是 $\\omega = \\sqrt{\\frac{g}{d}}$。质量和弹簧常数都不必单独知道，只由静伸长就能确定频率。",
  ),
  generate(rng) {
    const w = rng.int(2, 10);
    const m = rng.int(1, 6);
    const d = Q.of(10, w * w);
    return numberProblem({
      prompt: t(
        `A mass of ${m} kg hanging at rest stretches a spring by $${d.toLatex()}$ m. Taking $g = 10$ m/s² and ignoring damping, find the natural frequency in rad/s.`,
        `质量为 ${m} kg 的物体静止悬挂时，使弹簧伸长 $${d.toLatex()}$ m。取 $g = 10$ m/s²，忽略阻尼，求固有频率（rad/s）。`,
      ),
      answer: w,
      form: "integer",
      wrong: [w * w, m * w, w + m],
      solution: t(
        `$\\omega^2 = \\frac{g}{d} = 10 \\div ${d.toLatex()} = ${w * w}$, so $\\omega = ${w}$. The mass does not enter.`,
        `$\\omega^2 = \\frac{g}{d} = 10 \\div ${d.toLatex()} = ${w * w}$，所以 $\\omega = ${w}$。质量不起作用。`,
      ),
    });
  },
};

const quasiFrequency: KnowledgePointDef = {
  id: "the-quasi-frequency-of-a-damped-oscillator",
  title: t("The quasi-frequency of a damped oscillator", "阻尼振子的准频率"),
  explanation: t(
    "An underdamped oscillator $my'' + cy' + ky = 0$ has characteristic roots $-\\frac{c}{2m} \\pm qi$, where $q^2 = \\frac{k}{m} - \\frac{c^2}{4m^2}$. Its oscillation therefore has the frequency $q$, which is lower than the undamped frequency $\\sqrt{\\frac{k}{m}}$. Damping slows the swings as well as shrinking them.",
    "欠阻尼振子 $my'' + cy' + ky = 0$ 的特征根是 $-\\frac{c}{2m} \\pm qi$，其中 $q^2 = \\frac{k}{m} - \\frac{c^2}{4m^2}$。所以它的振动频率是 $q$，低于无阻尼频率 $\\sqrt{\\frac{k}{m}}$。阻尼既使振幅缩小，也使振动变慢。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const c = 2 * m * p;
    const k = m * (p * p + q * q);
    return numberProblem({
      prompt: t(
        `Find the quasi-frequency, in rad/s, of the oscillator $${poly([m, "y''"], [c, "y'"], [k, "y"])} = 0$.`,
        `求振子 $${poly([m, "y''"], [c, "y'"], [k, "y"])} = 0$ 的准频率（rad/s）。`,
      ),
      answer: q,
      form: "integer",
      wrong: [p, p * p + q * q, p + q],
      solution: t(
        `Dividing by the mass gives the roots of $${poly([1, "r^2"], [2 * p, "r"], [p * p + q * q, ""])} = 0$, which are $${complexRoots(p, q)}$. The imaginary part is the quasi-frequency, $${q}$.`,
        `除以质量后，特征方程是 $${poly([1, "r^2"], [2 * p, "r"], [p * p + q * q, ""])} = 0$，根是 $${complexRoots(p, q)}$。虚部就是准频率 $${q}$。`,
      ),
    });
  },
};

const beats: KnowledgePointDef = {
  id: "the-coefficient-of-a-beat",
  title: t("The coefficient of a beat", "拍的系数"),
  explanation: t(
    "An undamped oscillator forced from rest at a nearby frequency combines two cosines: $y = A(\\cos\\nu t - \\cos\\omega t)$, with $A = \\frac{F}{\\omega^2 - \\nu^2}$. The closer the frequencies, the larger $A$ is. The two cosines drift in and out of step, which produces the swelling and fading called beats.",
    "无阻尼振子从静止开始，受到相近频率的强迫时，解是两个余弦的组合：$y = A(\\cos\\nu t - \\cos\\omega t)$，其中 $A = \\frac{F}{\\omega^2 - \\nu^2}$。频率越接近，$A$ 越大。两个余弦时而同步、时而错开，产生时强时弱的现象，叫作拍。",
  ),
  generate(rng) {
    const w = rng.int(1, 9);
    const n = different(rng, 1, 9, w);
    const F = rng.int(1, 20);
    const answer = Q.of(F, w * w - n * n);
    const cos = (j: number) => `\\cos ${j === 1 ? "" : j}t`;
    return numberProblem({
      prompt: t(
        `The solution of $${poly([1, "y''"], [w * w, "y"])} = ${F}${cos(n)}$ with $y(0) = y'(0) = 0$ has the form $y = A(${cos(n)} - ${cos(w)})$. Find $A$.`,
        `$${poly([1, "y''"], [w * w, "y"])} = ${F}${cos(n)}$，$y(0) = y'(0) = 0$ 的解形如 $y = A(${cos(n)} - ${cos(w)})$。求 $A$。`,
      ),
      answer,
      wrong: [Q.of(F, w * w + n * n), answer.neg(), Q.of(F, w - n)],
      solution: t(
        `Substituting the trial $A${cos(n)}$ gives $A(${w * w} - ${n * n}) = ${F}$, so $A = ${answer.toLatex()}$. The term in $${cos(w)}$ solves the homogeneous equation and makes $y(0) = 0$.`,
        `代入试探解 $A${cos(n)}$，得 $A(${w * w} - ${n * n}) = ${F}$，所以 $A = ${answer.toLatex()}$。$${cos(w)}$ 项是齐次方程的解，它使 $y(0) = 0$。`,
      ),
    });
  },
};

const criticalResistance: KnowledgePointDef = {
  id: "the-resistance-for-critical-damping",
  title: t("The resistance for critical damping", "临界阻尼的电阻"),
  explanation: t(
    "The charge in a series circuit satisfies $Lq'' + Rq' + \\frac{q}{C} = 0$. The circuit is critically damped when the characteristic equation has a repeated root, that is, when $R^2 = \\frac{4L}{C}$. A smaller resistance makes the charge oscillate, and a larger one makes it decay slowly without oscillating.",
    "串联电路中的电荷满足 $Lq'' + Rq' + \\frac{q}{C} = 0$。特征方程有重根时电路处于临界阻尼，即 $R^2 = \\frac{4L}{C}$。电阻更小时电荷会振荡，更大时电荷缓慢衰减而不振荡。",
  ),
  generate(rng) {
    const s = rng.int(1, 9);
    const L = rng.int(1, 6);
    const C = Q.of(L, s * s);
    const answer = 2 * s;
    return numberProblem({
      prompt: t(
        `A series circuit has inductance ${L} H and capacitance $${C.toLatex()}$ F. Which resistance, in ohms, makes it critically damped?`,
        `串联电路的电感是 ${L} H，电容是 $${C.toLatex()}$ F。多大的电阻（欧姆）使它处于临界阻尼？`,
      ),
      answer,
      form: "integer",
      wrong: [s, 4 * s * s, 2 * L],
      solution: t(
        `$R^2 = \\frac{4L}{C} = 4 \\cdot ${L} \\div ${C.toLatex()} = ${answer * answer}$, so $R = ${answer}$.`,
        `$R^2 = \\frac{4L}{C} = 4 \\cdot ${L} \\div ${C.toLatex()} = ${answer * answer}$，所以 $R = ${answer}$。`,
      ),
    });
  },
};

const stabilityThreshold: KnowledgePointDef = {
  id: "the-parameter-range-for-asymptotic-stability",
  title: t("The parameter range for asymptotic stability", "渐近稳定的参数范围"),
  explanation: t(
    "A two-dimensional linear system is asymptotically stable exactly when its matrix has negative trace and positive determinant. With a parameter in the matrix, each condition gives an inequality. Both must hold, so the stable range is bounded by the stricter of the two conditions.",
    "二维线性系统渐近稳定，当且仅当矩阵的迹为负、行列式为正。矩阵含参数时，每个条件都给出一个不等式。两个都必须成立，所以稳定范围由更严格的那个条件决定。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const fromDet = Q.of(-b * c, a);
    const detBound = (-b * c) / a;
    const answer = detBound < a ? fromDet : Q.of(a);
    const other = detBound < a ? Q.of(a) : fromDet;
    return numberProblem({
      prompt: t(
        `The system $\\mathbf{x}' = ${matrix2(-a, b, c, "k")}\\mathbf{x}$ is asymptotically stable exactly when $k < K$. Find $K$.`,
        `系统 $\\mathbf{x}' = ${matrix2(-a, b, c, "k")}\\mathbf{x}$ 渐近稳定，当且仅当 $k < K$。求 $K$。`,
      ),
      answer,
      wrong: [other, answer.neg(), Q.of(b * c)],
      solution: t(
        `A negative trace requires $k < ${a}$. A positive determinant requires $${poly([-a, "k"], [-b * c, ""])} > 0$, that is, $k < ${fromDet.toLatex()}$. The stricter bound is $K = ${answer.toLatex()}$.`,
        `迹为负要求 $k < ${a}$。行列式为正要求 $${poly([-a, "k"], [-b * c, ""])} > 0$，即 $k < ${fromDet.toLatex()}$。更严格的界是 $K = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const parameterForCenter: KnowledgePointDef = {
  id: "the-parameter-that-makes-a-center",
  title: t("The parameter that makes a center", "使平衡点成为中心的参数"),
  explanation: t(
    "The eigenvalues of a matrix are purely imaginary exactly when its trace is zero and its determinant is positive. Then trajectories are closed curves around a center. A trace above zero gives an outward spiral, and a trace below zero an inward one, so a center is the boundary between the two.",
    "矩阵的特征值是纯虚数，当且仅当迹为零且行列式为正。此时轨线是绕中心的闭曲线。迹大于零时是向外的螺线，小于零时是向内的螺线，所以中心是二者的分界。",
  ),
  generate(rng) {
    const d = nonzero(rng, 4);
    const b = rng.int(1, 5);
    const c = d * d + rng.int(1, 5);
    const answer = -d;
    return numberProblem({
      prompt: t(
        `For which $k$ is the origin a center of $\\mathbf{x}' = ${matrix2("k", b, -c, d)}\\mathbf{x}$?`,
        `$k$ 取何值时，原点是 $\\mathbf{x}' = ${matrix2("k", b, -c, d)}\\mathbf{x}$ 的中心？`,
      ),
      answer,
      solveFor: "k",
      wrong: [d, 0, b],
      solution: t(
        `The trace $${poly([1, "k"], [d, ""])}$ must be zero, so $k = ${answer}$. Then the determinant is $${inParens(answer)}(${d}) + ${b * c} = ${answer * d + b * c}$, which is positive, so the origin is a center.`,
        `迹 $${poly([1, "k"], [d, ""])}$ 必须为零，所以 $k = ${answer}$。此时行列式是 $${inParens(answer)}(${d}) + ${b * c} = ${answer * d + b * c}$，是正数，所以原点是中心。`,
      ),
    });
  },
};

const parameterForRepeatedEigenvalue: KnowledgePointDef = {
  id: "the-parameter-that-makes-an-eigenvalue-repeated",
  title: t("The parameter that makes an eigenvalue repeated", "使特征值重复的参数"),
  explanation: t(
    "A two-by-two matrix has a repeated eigenvalue when the discriminant of its characteristic equation is zero. For $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ this discriminant is $(a - d)^2 + 4bc$. Setting it to zero gives the boundary between the real and the complex cases in a phase portrait.",
    "二阶矩阵的特征方程判别式为零时，特征值重复。对 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，判别式是 $(a - d)^2 + 4bc$。令它为零，就得到相图中实根情形与复根情形的分界。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = different(rng, -6, 6, a);
    const b = nonzero(rng, 5);
    const gap = (a - d) ** 2;
    const answer = Q.of(-gap, 4 * b);
    return numberProblem({
      prompt: t(
        `For which $k$ does $${matrix2(a, b, "k", d)}$ have a repeated eigenvalue?`,
        `$k$ 取何值时 $${matrix2(a, b, "k", d)}$ 有重复的特征值？`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-gap, b), Q.of(-(a - d), 4 * b)],
      solution: t(
        `The discriminant is $(${a - d})^2 + 4(${b})k = ${poly([gap, ""], [4 * b, "k"])}$. Setting it to zero gives $k = ${answer.toLatex()}$.`,
        `判别式是 $(${a - d})^2 + 4(${b})k = ${poly([gap, ""], [4 * b, "k"])}$。令它为零，得 $k = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const determinantOfExponential: KnowledgePointDef = {
  id: "the-determinant-of-a-matrix-exponential",
  title: t("The determinant of a matrix exponential", "矩阵指数的行列式"),
  explanation: t(
    "The eigenvalues of $e^{tA}$ are $e^{t\\lambda}$ for each eigenvalue $\\lambda$ of $A$, and a determinant is a product of eigenvalues. Multiplying exponentials adds their exponents, so $\\det e^{tA} = e^{t\\operatorname{tr}A}$. This holds without computing the exponential, and it shows that $e^{tA}$ is never singular.",
    "$e^{tA}$ 的特征值是 $e^{t\\lambda}$，其中 $\\lambda$ 是 $A$ 的特征值，而行列式是特征值之积。指数相乘时指数部分相加，所以 $\\det e^{tA} = e^{t\\operatorname{tr}A}$。这不必算出矩阵指数，也说明 $e^{tA}$ 永远可逆。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 9);
    let d = nonzero(rng, 9);
    if (a + d === 0) d = d === 9 ? 8 : d + 1;
    const s = rng.int(2, 5);
    const trace = a + d;
    const answer = s * trace;
    return numberProblem({
      prompt: t(
        `$A = ${matrix2(a, b, c, d)}$, and $\\det e^{${s}A} = e^{k}$. Find $k$.`,
        `$A = ${matrix2(a, b, c, d)}$，$\\det e^{${s}A} = e^{k}$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [trace, s * (a * d - b * c), a * d - b * c],
      solution: t(
        `The trace of $A$ is $${a} + ${inParens(d)} = ${trace}$, so $k = ${s} \\cdot ${inParens(trace)} = ${answer}$.`,
        `$A$ 的迹是 $${a} + ${inParens(d)} = ${trace}$，所以 $k = ${s} \\cdot ${inParens(trace)} = ${answer}$。`,
      ),
    });
  },
};

const slopeFromTransform: KnowledgePointDef = {
  id: "initial-values-from-a-transform",
  title: t("Initial values from a transform", "由变换求初始值"),
  explanation: t(
    "A transform shows the initial behaviour of a function without inverting it. Since $\\mathcal{L}\\{f'\\} = sF(s) - f(0)$ tends to zero as $s$ grows, $f(0) = \\lim_{s \\to \\infty} sF(s)$. Applying the same limit to $f'$ gives $f'(0)$ from $sF(s) - f(0)$.",
    "不用求逆变换，也能从变换看出函数的初始行为。由于 $s$ 增大时 $\\mathcal{L}\\{f'\\} = sF(s) - f(0)$ 趋于零，所以 $f(0) = \\lim_{s \\to \\infty} sF(s)$。对 $f'$ 用同样的极限，就能由 $sF(s) - f(0)$ 得到 $f'(0)$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const d = rng.int(1, 12);
    const answer = b - a * c;
    const F = `\\frac{${poly([a, "s"], [b, ""])}}{${poly([1, "s^2"], [c, "s"], [d, ""])}}`;
    return numberProblem({
      prompt: t(
        `The function $f$ has Laplace transform $F(s) = ${F}$. Find $f'(0)$.`,
        `函数 $f$ 的拉普拉斯变换是 $F(s) = ${F}$。求 $f'(0)$。`,
      ),
      answer,
      form: "integer",
      wrong: [b, a, b + a * c],
      solution: t(
        `First, $f(0) = \\lim sF(s) = ${a}$. Then $${poly([1, "sF(s)"], [-a, ""])}$ has numerator $${poly([answer, "s"], [-a * d, ""])}$ over the same denominator, and multiplying by $s$ and taking the limit gives $f'(0) = ${answer}$.`,
        `首先，$f(0) = \\lim sF(s) = ${a}$。然后 $${poly([1, "sF(s)"], [-a, ""])}$ 的分子是 $${poly([answer, "s"], [-a * d, ""])}$，分母不变，乘以 $s$ 再取极限得 $f'(0) = ${answer}$。`,
      ),
    });
  },
};

const convolutionOfPowers: KnowledgePointDef = {
  id: "a-convolution-through-the-transform",
  title: t("A convolution through the transform", "通过变换求卷积"),
  explanation: t(
    "The convolution $(f * g)(t) = \\int_0^t f(\\tau)g(t - \\tau)\\,d\\tau$ has the transform $F(s)G(s)$. So a convolution can be found by multiplying transforms and inverting the product. This is usually quicker than the integral, and it is also why a product of transforms is not the transform of a product.",
    "卷积 $(f * g)(t) = \\int_0^t f(\\tau)g(t - \\tau)\\,d\\tau$ 的变换是 $F(s)G(s)$。所以可以把变换相乘，再求逆变换，得到卷积。这通常比直接积分快，这也说明变换之积并不是乘积的变换。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const T = rng.int(1, 4);
    const answer = Q.of(a * b * T ** 4, 12);
    return numberProblem({
      prompt: t(
        `Let $f(t) = ${poly([a, "t"])}$ and $g(t) = ${poly([b, "t^2"])}$. Find the convolution $(f * g)(${T})$.`,
        `设 $f(t) = ${poly([a, "t"])}$，$g(t) = ${poly([b, "t^2"])}$。求卷积 $(f * g)(${T})$。`,
      ),
      answer,
      wrong: [Q.of(a * b * T ** 3), Q.of(a * b * T ** 4, 24), Q.of(a * b * T ** 4, 4)],
      solution: t(
        `The transforms are $\\frac{${a}}{s^2}$ and $\\frac{${2 * b}}{s^3}$, with product $\\frac{${2 * a * b}}{s^5}$. Since $t^4$ has transform $\\frac{24}{s^5}$, the convolution is $\\frac{${2 * a * b}}{24}t^4$, which at $t = ${T}$ is $${answer.toLatex()}$.`,
        `两个变换是 $\\frac{${a}}{s^2}$ 和 $\\frac{${2 * b}}{s^3}$，乘积是 $\\frac{${2 * a * b}}{s^5}$。由于 $t^4$ 的变换是 $\\frac{24}{s^5}$，卷积是 $\\frac{${2 * a * b}}{24}t^4$，在 $t = ${T}$ 处等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const sineCoefficientOfAStep: KnowledgePointDef = {
  id: "a-fourier-sine-coefficient-of-a-step",
  title: t("A Fourier sine coefficient of a step", "阶跃函数的傅里叶正弦系数"),
  explanation: t(
    "For a function that is constant on each half of $(-\\pi, \\pi)$, split the integral for $b_n$ at zero. Over a half period, $\\int_0^\\pi \\sin nx\\,dx$ is $\\frac{2}{n}$ for odd $n$ and zero for even $n$. So only odd frequencies appear, and their coefficients fall off like $\\frac{1}{n}$.",
    "对在 $(-\\pi, \\pi)$ 两半上分别为常数的函数，把 $b_n$ 的积分在零处分开。在半个周期上，$\\int_0^\\pi \\sin nx\\,dx$ 当 $n$ 为奇数时是 $\\frac{2}{n}$，为偶数时是零。所以只出现奇数频率，系数按 $\\frac{1}{n}$ 衰减。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const b = different(rng, -6, 6, a);
    const n = rng.pick([1, 3, 5, 7]);
    const answer = Q.of(2 * (b - a), n);
    const f = `\\begin{cases} ${a} & -\\pi < x < 0 \\\\ ${b} & 0 < x < \\pi \\end{cases}`;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. Its Fourier coefficient is $b_{${n}} = \\frac{c}{\\pi}$. Find $c$.`,
        `设 $f(x) = ${f}$。它的傅里叶系数是 $b_{${n}} = \\frac{c}{\\pi}$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(b - a, n), answer.neg(), Q.of(2 * (a + b) || 1, n)],
      solution: t(
        `$b_{${n}} = \\frac{1}{\\pi}\\left(${inParens(a)} \\cdot \\frac{-2}{${n}} + ${inParens(b)} \\cdot \\frac{2}{${n}}\\right)$, since the two halves give opposite integrals. So $c = ${answer.toLatex()}$.`,
        `$b_{${n}} = \\frac{1}{\\pi}\\left(${inParens(a)} \\cdot \\frac{-2}{${n}} + ${inParens(b)} \\cdot \\frac{2}{${n}}\\right)$，因为两半的积分相反。所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const recurrenceGrowth: KnowledgePointDef = {
  id: "the-long-run-ratio-of-a-linear-recurrence",
  title: t("The long-run ratio of a linear recurrence", "线性递推的长期比值"),
  explanation: t(
    "Trying $a_n = x^n$ in $a_{n+2} = pa_{n+1} + qa_n$ gives the characteristic equation $x^2 = px + q$, just as for a differential equation. The solution is a combination of the powers of the two roots. The root of larger size dominates, so the ratio of consecutive terms tends to that root.",
    "把 $a_n = x^n$ 代入 $a_{n+2} = pa_{n+1} + qa_n$，得特征方程 $x^2 = px + q$，与微分方程的做法一样。解是两个根的幂的组合。绝对值较大的根占主导，所以相邻两项之比趋于这个根。",
  ),
  generate(rng) {
    const r = rng.int(2, 7);
    const s = rng.pick([...Array(2 * r - 1).keys()].map((i) => i - r + 1).filter((i) => i !== 0 && i !== 1));
    const p = r + s;
    const q = -r * s;
    const right = poly([p, "a_{n+1}"], [q, "a_n"]);
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = a_1 = 1$ and $a_{n+2} = ${right}$. What does $\\frac{a_{n+1}}{a_n}$ tend to?`,
        `数列满足 $a_0 = a_1 = 1$，$a_{n+2} = ${right}$。$\\frac{a_{n+1}}{a_n}$ 趋于多少？`,
      ),
      answer: r,
      form: "integer",
      wrong: [s, p, q],
      solution: t(
        `The characteristic equation is $${poly([1, "x^2"], [-p, "x"], [-q, ""])} = 0$, with roots $${r}$ and $${s}$. The root of larger size is $${r}$, and it dominates because the starting values give it a nonzero coefficient.`,
        `特征方程是 $${poly([1, "x^2"], [-p, "x"], [-q, ""])} = 0$，两根是 $${r}$ 和 $${s}$。绝对值较大的根是 $${r}$，初始值使它的系数不为零，所以它占主导。`,
      ),
    });
  },
};

const richardson: KnowledgePointDef = {
  id: "richardson-extrapolation",
  title: t("Richardson extrapolation", "理查森外推"),
  explanation: t(
    "If a method has order $p$, halving the step divides the error by about $2^p$. Combining two estimates can cancel this leading error: $y \\approx \\frac{2^py_{h/2} - y_h}{2^p - 1}$. So two runs with different steps give a better answer than either, at no extra cost beyond the runs themselves.",
    "如果方法是 $p$ 阶的，步长减半时误差大约除以 $2^p$。组合两个估计值可以消去这个主要误差：$y \\approx \\frac{2^py_{h/2} - y_h}{2^p - 1}$。所以用不同步长运行两次，能得到比任何一次都好的答案，除了运行本身没有额外代价。",
  ),
  generate(rng) {
    const p = rng.int(1, 2);
    const y1 = rng.int(11, 40);
    const y2 = y1 + rng.int(1, 9);
    const factor = 2 ** p;
    const answer = Q.of(factor * y2 - y1, 10 * (factor - 1));
    const work = p === 1 ? `2 \\cdot ${decimal(y2)} - ${decimal(y1)}` : `\\frac{4 \\cdot ${decimal(y2)} - ${decimal(y1)}}{3}`;
    return numberProblem({
      prompt: t(
        `A method of order ${p} gives the estimate $${decimal(y1)}$ with step $h$ and $${decimal(y2)}$ with step $\\frac{h}{2}$. What value does Richardson extrapolation give?`,
        `一个 ${p} 阶方法用步长 $h$ 得到估计值 $${decimal(y1)}$，用步长 $\\frac{h}{2}$ 得到 $${decimal(y2)}$。理查森外推给出什么值？`,
      ),
      answer,
      wrong: [Q.of(y2, 10), Q.of(y1 + y2, 20), Q.of(y1, 10)],
      solution: t(`The formula gives $${work} = ${answer.toLatex()}$.`, `由公式得 $${work} = ${answer.toLatex()}$。`),
    });
  },
};

/** exponential writes e raised to a whole multiple of a variable, without a coefficient of 1. */
const exponential = (r: number, v: string) => `e^{${r === 1 ? "" : r === -1 ? "-" : r}${v}}`;
/** power writes x raised to a nonzero whole number, without an exponent of 1. */
const power = (r: number) => (r === 1 ? "x" : `x^{${r}}`);
/** shifted writes x minus a number, as a single sign. */
const shifted = (a: number) => poly([1, "x"], [-a, ""]);
/** multiple writes a whole multiple of an angle, without a coefficient of 1. */
const multiple = (k: number, angle: string) => `${k === 1 ? "" : k}${angle}`;
/** signedFactor puts a negative rational in parentheses, for use after a product sign. */
const signedFactor = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());
/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const timeConstantOfDrag: KnowledgePointDef = {
  id: "the-time-constant-of-linear-drag",
  title: t("The time constant of linear drag", "线性阻力的时间常数"),
  explanation: t(
    "A body falling from rest with drag $bv$ has speed $v = v_T\\left(1 - e^{-bt/m}\\right)$, where $v_T$ is its terminal speed. The fraction of the terminal speed reached depends only on $\\frac{bt}{m}$, not on $g$. So $\\frac{m}{b}$ sets the time scale of the fall, and it is called the time constant.",
    "从静止开始、受阻力 $bv$ 的落体，速度为 $v = v_T\\left(1 - e^{-bt/m}\\right)$，其中 $v_T$ 是终端速度。达到终端速度的比例只取决于 $\\frac{bt}{m}$，与 $g$ 无关。所以 $\\frac{m}{b}$ 决定了下落的时间尺度，它叫作时间常数。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const b = rng.int(2, 10);
    const k = rng.int(1, 3);
    const answer = Q.of(k * m, b);
    return numberProblem({
      prompt: t(
        `An object of mass $${m}\\text{ kg}$ falls from rest with air resistance $${b}v\\text{ N}$. After how many seconds has its speed reached the fraction $1 - e^{-${k}}$ of its terminal speed?`,
        `质量为 $${m}\\text{ kg}$ 的物体从静止开始下落，空气阻力为 $${b}v\\text{ N}$。经过多少秒，它的速度达到终端速度的 $1 - e^{-${k}}$ 倍？`,
      ),
      answer,
      wrong: [Q.of(m, b), Q.of(k * b, m), Q.of(k * m)],
      solution: t(
        `The fraction reached at time $t$ is $1 - e^{-${b}t/${m}}$. Matching the exponents gives $\\frac{${b}t}{${m}} = ${k}$, so $t = ${answer.toLatex()}$.`,
        `时刻 $t$ 达到的比例是 $1 - e^{-${b}t/${m}}$。比较指数得 $\\frac{${b}t}{${m}} = ${k}$，所以 $t = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const rateOfCurrent: KnowledgePointDef = {
  id: "the-rate-of-the-current-at-a-moment",
  title: t("The rate of the current at a moment", "某一时刻电流的变化率"),
  explanation: t(
    "In a series RL circuit the voltages balance, so $Li' + Ri = V$ at every moment. This gives the rate of change of the current directly from its present value, with no need to solve the equation. The current rises while it is below $\\frac{V}{R}$ and falls while it is above.",
    "在串联 RL 电路中电压始终平衡，所以每一时刻都有 $Li' + Ri = V$。由此可以直接从当前电流得到它的变化率，不需要解方程。电流低于 $\\frac{V}{R}$ 时上升，高于它时下降。",
  ),
  generate(rng) {
    const L = rng.int(1, 10);
    const R = rng.int(1, 12);
    const V = 10 * rng.int(1, 12);
    const i = rng.int(1, 10);
    const answer = Q.of(V - R * i, L);
    return numberProblem({
      prompt: t(
        `A series circuit has $L = ${L}\\text{ H}$, $R = ${R}\\ \\Omega$ and a constant voltage $${V}\\text{ V}$. At a moment when the current is $${i}\\text{ A}$, how fast is it changing, in $\\text{A/s}$? Give a negative number if it is falling.`,
        `串联电路中 $L = ${L}\\text{ H}$，$R = ${R}\\ \\Omega$，恒定电压为 $${V}\\text{ V}$。在电流为 $${i}\\text{ A}$ 的时刻，它的变化率是多少 $\\text{A/s}$？如果电流在下降，答案取负数。`,
      ),
      answer,
      wrong: [Q.of(V, L), Q.of(V + R * i, L), Q.of(V - R * i, R), Q.of(V - R * i)],
      solution: t(
        `The balance of voltages reads $${poly([L, "i'"])} + ${R} \\cdot ${i} = ${V}$. Solving for the rate gives $i' = ${answer.toLatex()}$.`,
        `电压平衡式是 $${poly([L, "i'"])} + ${R} \\cdot ${i} = ${V}$。解出变化率，得 $i' = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const conditionsAtLaterTime: KnowledgePointDef = {
  id: "initial-conditions-at-a-later-time",
  title: t("Initial conditions at a later time", "在较晚时刻给定的初始条件"),
  explanation: t(
    "A constant-coefficient equation does not change when time is shifted, so $e^{r(t - t_0)}$ is a solution whenever $e^{rt}$ is. When the conditions are given at $t_0$, using this form makes every exponential equal $1$ at that time. The two conditions then become a simple linear system for the constants.",
    "常系数方程在时间平移下不变，所以只要 $e^{rt}$ 是解，$e^{r(t - t_0)}$ 也是解。条件在 $t_0$ 给出时，用这种形式可以使每个指数函数在该时刻都等于 $1$。两个条件于是变成关于常数的简单线性方程组。",
  ),
  generate(rng) {
    const u = nonzero(rng, 5);
    const w = different(rng, -5, 5, u);
    const r1 = Math.max(u, w);
    const r2 = Math.min(u, w);
    const t0 = rng.int(1, 5);
    const p = nonzero(rng, 6);
    const v = nonzero(rng, 9);
    const answer = Q.of(v - r2 * p, r1 - r2);
    const equation = poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"]);
    return numberProblem({
      prompt: t(
        `Solve $${equation} = 0$ with $y(${t0}) = ${p}$ and $y'(${t0}) = ${v}$. Let $r_1 > r_2$ be the characteristic roots, and write the solution as $y = Ae^{r_1(t - ${t0})} + Be^{r_2(t - ${t0})}$. Find $A$.`,
        `解 $${equation} = 0$，条件为 $y(${t0}) = ${p}$，$y'(${t0}) = ${v}$。设 $r_1 > r_2$ 是特征根，把解写成 $y = Ae^{r_1(t - ${t0})} + Be^{r_2(t - ${t0})}$。求 $A$。`,
      ),
      answer,
      wrong: [Q.of(v - r1 * p, r2 - r1), Q.of(v + r2 * p, r1 - r2), Q.of(v, r1 - r2), p],
      solution: t(
        `The roots are $r_1 = ${r1}$ and $r_2 = ${r2}$. At $t = ${t0}$ both exponentials equal $1$, so $A + B = ${p}$ and $${poly([r1, "A"], [r2, "B"])} = ${v}$. Eliminating $B$ gives $${poly([r1 - r2, "A"])} = ${v - r2 * p}$, so $A = ${answer.toLatex()}$.`,
        `特征根是 $r_1 = ${r1}$，$r_2 = ${r2}$。在 $t = ${t0}$ 处两个指数函数都等于 $1$，所以 $A + B = ${p}$，$${poly([r1, "A"], [r2, "B"])} = ${v}$。消去 $B$ 得 $${poly([r1 - r2, "A"])} = ${v - r2 * p}$，所以 $A = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const equationFromPowers: KnowledgePointDef = {
  id: "the-equation-from-two-power-solutions",
  title: t("The equation from two power solutions", "由两个幂函数解求方程"),
  explanation: t(
    "Substituting $y = x^m$ into $x^2y'' + bxy' + cy = 0$ gives the indicial equation $m^2 + (b - 1)m + c = 0$. Knowing two solutions means knowing its two roots, and the roots fix the quadratic. Expand $(m - r)(m - s)$ and compare coefficients. The term $b - 1$ is the usual trap, since $b$ itself is not minus the sum of the roots.",
    "把 $y = x^m$ 代入 $x^2y'' + bxy' + cy = 0$，得到指标方程 $m^2 + (b - 1)m + c = 0$。知道两个解就是知道它的两个根，而两个根决定了这个二次式。展开 $(m - r)(m - s)$ 并比较系数。容易出错的是 $b - 1$ 这一项：$b$ 本身并不等于两根之和的相反数。",
  ),
  generate(rng) {
    const r = nonzero(rng, 5);
    const s = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((m) => m !== r));
    const askB = rng.pick([true, false]);
    const b = 1 - r - s;
    const c = r * s;
    const quadratic = poly([1, "m^2"], [-(r + s), "m"], [c, ""]);
    const stepEn = askB ? `So $b - 1 = ${-(r + s)}$, which gives $b = ${b}$.` : `So $c = ${c}$.`;
    const stepZh = askB ? `所以 $b - 1 = ${-(r + s)}$，得 $b = ${b}$。` : `所以 $c = ${c}$。`;
    return numberProblem({
      prompt: t(
        `The equation $x^2y'' + bxy' + cy = 0$ has the solutions $y = ${power(r)}$ and $y = ${power(s)}$ for $x > 0$. Find $${askB ? "b" : "c"}$.`,
        `方程 $x^2y'' + bxy' + cy = 0$ 在 $x > 0$ 上有解 $y = ${power(r)}$ 和 $y = ${power(s)}$。求 $${askB ? "b" : "c"}$。`,
      ),
      answer: askB ? b : c,
      form: "integer",
      solveFor: askB ? "b" : "c",
      wrong: askB ? [-(r + s), r + s, 1 + r + s] : [-c, r + s, c + 1],
      solution: t(
        `The indicial equation has these exponents as roots, so it is $${quadratic} = 0$. Comparing it with $m^2 + (b - 1)m + c = 0$ gives the coefficients. ${stepEn}`,
        `这两个指数是指标方程的根，所以指标方程是 $${quadratic} = 0$。把它与 $m^2 + (b - 1)m + c = 0$ 比较，就得到系数。${stepZh}`,
      ),
    });
  },
};

const coefficientForRepeatedRoot: KnowledgePointDef = {
  id: "the-coefficient-that-makes-a-repeated-root",
  title: t("The coefficient that makes a repeated root", "使指标方程有重根的系数"),
  explanation: t(
    "For $ax^2y'' + pxy' + ky = 0$ the indicial equation is $am^2 + (p - a)m + k = 0$. Solutions switch from two separate powers to $x^m$ and $x^m \\ln x$ exactly when this quadratic has a repeated root. So set its discriminant to zero. Remember that the middle coefficient is $p - a$, not $p$.",
    "对 $ax^2y'' + pxy' + ky = 0$，指标方程是 $am^2 + (p - a)m + k = 0$。当且仅当这个二次方程有重根时，解才从两个不同的幂函数变成 $x^m$ 和 $x^m \\ln x$。所以令判别式为零。注意中间的系数是 $p - a$，而不是 $p$。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const R = nonzero(rng, 9);
    const p = a * (1 - 2 * R);
    const answer = a * R * R;
    const middle = p - a;
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $${poly([a, "x^2y''"], [p, "xy'"])} + ky = 0$ have an indicial equation with a repeated root?`,
        `$k$ 取何值时，$${poly([a, "x^2y''"], [p, "xy'"])} + ky = 0$ 的指标方程有重根？`,
      ),
      answer,
      form: "integer",
      solveFor: "k",
      wrong: [R * R, -answer, Q.of(p * p, 4 * a), 2 * answer],
      solution: t(
        `The indicial equation is $${poly([a, "m^2"], [middle, "m"])} + k = 0$. Setting its discriminant to zero gives $k = \\frac{${inParens(middle)}^2}{${4 * a}} = ${answer}$, and the repeated root is $m = ${R}$.`,
        `指标方程是 $${poly([a, "m^2"], [middle, "m"])} + k = 0$。令判别式为零，得 $k = \\frac{${inParens(middle)}^2}{${4 * a}} = ${answer}$，重根是 $m = ${R}$。`,
      ),
    });
  },
};

const coefficientFromOscillatingSolution: KnowledgePointDef = {
  id: "the-coefficient-from-an-oscillating-power-solution",
  title: t("A coefficient from an oscillating power solution", "由振荡的幂函数解求系数"),
  explanation: t(
    "A solution $x^{\\alpha}\\cos(\\beta \\ln x)$ of $x^2y'' + bxy' + cy = 0$ shows that $\\alpha \\pm \\beta i$ are the roots of the indicial equation $m^2 + (b - 1)m + c = 0$. The constant term of a monic quadratic is the product of its roots. For conjugate roots that product is $\\alpha^2 + \\beta^2$.",
    "如果 $x^{\\alpha}\\cos(\\beta \\ln x)$ 是 $x^2y'' + bxy' + cy = 0$ 的解，那么 $\\alpha \\pm \\beta i$ 就是指标方程 $m^2 + (b - 1)m + c = 0$ 的根。首一二次式的常数项等于两根之积。对共轭根，这个积是 $\\alpha^2 + \\beta^2$。",
  ),
  generate(rng) {
    const alpha = rng.int(-4, 4);
    const beta = rng.int(1, 6);
    const answer = alpha * alpha + beta * beta;
    const amplitude = alpha === 0 ? "" : power(alpha);
    const wave = `\\cos(${multiple(beta, "\\ln x")})`;
    return numberProblem({
      prompt: t(
        `The equation $x^2y'' + bxy' + cy = 0$ has the solution $y = ${amplitude}${wave}$ for $x > 0$. Find $c$.`,
        `方程 $x^2y'' + bxy' + cy = 0$ 在 $x > 0$ 上有解 $y = ${amplitude}${wave}$。求 $c$。`,
      ),
      answer,
      form: "integer",
      solveFor: "c",
      wrong: [beta * beta, alpha * alpha - beta * beta, beta * beta - alpha * alpha, alpha + beta],
      solution: t(
        `The indicial roots are $m = ${alpha} \\pm ${multiple(beta, "i")}$. Their product is $c = ${inParens(alpha)}^2 + ${beta}^2 = ${answer}$.`,
        `指标方程的根是 $m = ${alpha} \\pm ${multiple(beta, "i")}$。它们的积是 $c = ${inParens(alpha)}^2 + ${beta}^2 = ${answer}$。`,
      ),
    });
  },
};

const equationForMultiplier: KnowledgePointDef = {
  id: "the-equation-for-the-multiplier",
  title: t("The equation for the multiplier", "乘子满足的方程"),
  explanation: t(
    "To reduce the order of $y'' + py' + qy = 0$ with a known solution $y_1$, substitute $y = vy_1$. The terms containing $v$ itself cancel, because $y_1$ is a solution. What remains is $y_1v'' + (2y_1' + py_1)v' = 0$. For $y_1 = e^{rt}$, dividing by $y_1$ gives $v'' + (2r + p)v' = 0$.",
    "已知 $y'' + py' + qy = 0$ 的一个解 $y_1$，要降阶就代入 $y = vy_1$。含 $v$ 本身的项会消去，因为 $y_1$ 是解。剩下的是 $y_1v'' + (2y_1' + py_1)v' = 0$。当 $y_1 = e^{rt}$ 时，除以 $y_1$ 得 $v'' + (2r + p)v' = 0$。",
  ),
  generate(rng) {
    const r = nonzero(rng, 6);
    const s = different(rng, -6, 6, r);
    const p = -(r + s);
    const answer = 2 * r + p;
    const equation = poly([1, "y''"], [p, "y'"], [r * s, "y"]);
    const known = exponential(r, "t");
    return numberProblem({
      prompt: t(
        `$y_1 = ${known}$ solves $${equation} = 0$. Substituting $y = v${known}$ gives $v'' + kv' = 0$. Find $k$.`,
        `$y_1 = ${known}$ 是 $${equation} = 0$ 的解。代入 $y = v${known}$ 得 $v'' + kv' = 0$。求 $k$。`,
      ),
      answer,
      form: "integer",
      solveFor: "k",
      wrong: [r + p, 2 * r - p, -answer, p],
      solution: t(
        `The derivatives of $y = v${known}$ contribute $2r$ to the coefficient of $v'$, and the $y'$ term of the equation contributes its own coefficient. So $k = 2 \\cdot ${inParens(r)} + ${inParens(p)} = ${answer}$.`,
        `$y = v${known}$ 的导数给 $v'$ 的系数贡献 $2r$，方程的 $y'$ 项再贡献它自己的系数。所以 $k = 2 \\cdot ${inParens(r)} + ${inParens(p)} = ${answer}$。`,
      ),
    });
  },
};

const springForResonance: KnowledgePointDef = {
  id: "the-spring-constant-for-resonance",
  title: t("The spring constant for resonance", "产生共振的弹簧常数"),
  explanation: t(
    "An undamped system $mx'' + kx = F\\cos\\omega t$ has natural frequency $\\sqrt{\\frac{k}{m}}$. It resonates when the driving frequency equals the natural one, and the response then grows without bound. Engineers avoid this by choosing the stiffness. So $k = m\\omega^2$ is the value to reach or, in practice, to stay away from.",
    "无阻尼系统 $mx'' + kx = F\\cos\\omega t$ 的固有频率是 $\\sqrt{\\frac{k}{m}}$。当驱动频率等于固有频率时发生共振，响应会无限增大。工程师通过选择刚度来避免这种情况。所以 $k = m\\omega^2$ 是要达到的值，或者在实践中要避开的值。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const w = rng.int(1, 9);
    const F = rng.int(2, 9);
    const answer = m * w * w;
    return numberProblem({
      prompt: t(
        `For which spring constant $k$ does the undamped system $${m}x'' + kx = ${F}\\cos ${multiple(w, "t")}$ resonate?`,
        `弹簧常数 $k$ 取何值时，无阻尼系统 $${m}x'' + kx = ${F}\\cos ${multiple(w, "t")}$ 发生共振？`,
      ),
      answer,
      form: "integer",
      solveFor: "k",
      wrong: [m * w, w * w, Q.of(w * w, m), m * m * w * w],
      solution: t(
        `Resonance needs $\\sqrt{\\frac{k}{${m}}} = ${w}$. Squaring gives $k = ${m} \\cdot ${w}^2 = ${answer}$. The force amplitude plays no part.`,
        `共振要求 $\\sqrt{\\frac{k}{${m}}} = ${w}$。平方得 $k = ${m} \\cdot ${w}^2 = ${answer}$。力的振幅不起作用。`,
      ),
    });
  },
};

const capacitanceForResonance: KnowledgePointDef = {
  id: "the-capacitance-for-electrical-resonance",
  title: t("The capacitance for electrical resonance", "产生电共振的电容"),
  explanation: t(
    "The steady-state current in a series circuit has amplitude $\\frac{V}{\\sqrt{R^2 + \\left(L\\omega - \\frac{1}{C\\omega}\\right)^2}}$. The resistance cannot be removed, but the second term in the root can. The amplitude is largest when $L\\omega = \\frac{1}{C\\omega}$, which is how a radio tunes to a station by adjusting its capacitor.",
    "串联电路的稳态电流振幅是 $\\frac{V}{\\sqrt{R^2 + \\left(L\\omega - \\frac{1}{C\\omega}\\right)^2}}$。电阻无法消除，但根号中的第二项可以。当 $L\\omega = \\frac{1}{C\\omega}$ 时振幅最大，收音机正是这样通过调节电容来选台的。",
  ),
  generate(rng) {
    const L = rng.int(1, 8);
    const w = rng.int(2, 12);
    const R = rng.int(1, 20);
    const V = 10 * rng.int(1, 9);
    const answer = Q.of(1, L * w * w);
    return numberProblem({
      prompt: t(
        `A series circuit has $R = ${R}\\ \\Omega$ and $L = ${L}\\text{ H}$, and is driven by $E(t) = ${V}\\sin ${w}t\\text{ V}$. Which capacitance, in farads, makes the steady-state current amplitude as large as possible?`,
        `串联电路中 $R = ${R}\\ \\Omega$，$L = ${L}\\text{ H}$，由 $E(t) = ${V}\\sin ${w}t\\text{ V}$ 驱动。电容取多少法拉时，稳态电流的振幅最大？`,
      ),
      answer,
      wrong: [Q.of(1, L * w), Q.of(1, w * w), L * w * w, Q.of(1, L * L * w * w)],
      solution: t(
        `The amplitude is largest when $${L} \\cdot ${w} = \\frac{1}{${w}C}$, which gives $C = \\frac{1}{${L} \\cdot ${w}^2} = ${answer.toLatex()}$.`,
        `当 $${L} \\cdot ${w} = \\frac{1}{${w}C}$ 时振幅最大，得 $C = \\frac{1}{${L} \\cdot ${w}^2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const shiftedTransformAtPoint: KnowledgePointDef = {
  id: "a-shifted-transform-at-a-point",
  title: t("A shifted transform at a point", "平移后的变换在一点的值"),
  explanation: t(
    "The first shifting theorem says $\\mathcal{L}\\{e^{at}f(t)\\}(s) = F(s - a)$. So the transform of the product at $s$ is the transform of $f$ at the shifted point $s - a$. To evaluate it, subtract $a$ first and only then use the formula for $F$. Applying the formula at $s$ itself is the common mistake.",
    "第一平移定理说 $\\mathcal{L}\\{e^{at}f(t)\\}(s) = F(s - a)$。所以乘积在 $s$ 处的变换，就是 $f$ 的变换在平移后的点 $s - a$ 处的值。计算时先减去 $a$，再用 $F$ 的公式。直接在 $s$ 处套用公式是常见的错误。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = rng.int(1, 6);
    const d = rng.int(1, 6);
    const s = a + d;
    const answer = Q.of(d, d * d + b * b);
    return numberProblem({
      prompt: t(
        `Find $\\mathcal{L}\\{${exponential(a, "t")}\\cos ${multiple(b, "t")}\\}$ at $s = ${s}$.`,
        `求 $\\mathcal{L}\\{${exponential(a, "t")}\\cos ${multiple(b, "t")}\\}$ 在 $s = ${s}$ 处的值。`,
      ),
      answer,
      wrong: [Q.of(s, s * s + b * b), Q.of(b, d * d + b * b), Q.of(s + a, (s + a) * (s + a) + b * b)],
      solution: t(
        `Here $F(s) = \\frac{s}{s^2 + ${b * b}}$, evaluated at $s - a = ${d}$. This gives $\\frac{${d}}{${d * d} + ${b * b}} = ${answer.toLatex()}$.`,
        `这里 $F(s) = \\frac{s}{s^2 + ${b * b}}$，要在 $s - a = ${d}$ 处取值。得 $\\frac{${d}}{${d * d} + ${b * b}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const stepOnUnshiftedFunction: KnowledgePointDef = {
  id: "a-step-on-an-unshifted-function",
  title: t("A step on an unshifted function", "阶跃函数乘未平移的函数"),
  explanation: t(
    "The second shifting theorem transforms $g(t - a)u(t - a)$, so the function must be written in powers of $t - a$ first. A function such as $pt + q$ is not yet in that form. Rewrite it as $p(t - a) + (pa + q)$. Then the transform of $(pt + q)u(t - a)$ is $e^{-as}\\left(\\frac{p}{s^2} + \\frac{pa + q}{s}\\right)$.",
    "第二平移定理变换的是 $g(t - a)u(t - a)$，所以必须先把函数写成 $t - a$ 的幂。像 $pt + q$ 这样的函数还不是这种形式。把它改写成 $p(t - a) + (pa + q)$。于是 $(pt + q)u(t - a)$ 的变换是 $e^{-as}\\left(\\frac{p}{s^2} + \\frac{pa + q}{s}\\right)$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 6);
    const a = rng.int(1, 6);
    const q = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((n) => n !== -p * a));
    const answer = p * a + q;
    return numberProblem({
      prompt: t(
        `$\\mathcal{L}\\{(${poly([p, "t"], [q, ""])})u(t - ${a})\\} = e^{-${multiple(a, "s")}}\\left(\\frac{A}{s^2} + \\frac{B}{s}\\right)$. Find $B$.`,
        `$\\mathcal{L}\\{(${poly([p, "t"], [q, ""])})u(t - ${a})\\} = e^{-${multiple(a, "s")}}\\left(\\frac{A}{s^2} + \\frac{B}{s}\\right)$。求 $B$。`,
      ),
      answer,
      form: "integer",
      solveFor: "B",
      wrong: [q, q - p * a, p, p * a],
      solution: t(
        `Rewrite the function in powers of $t - ${a}$: $${poly([p, "t"], [q, ""])} = ${poly([p, `(t - ${a})`], [answer, ""])}$. The constant term becomes the coefficient of $\\frac{1}{s}$, so $B = ${answer}$.`,
        `把函数写成 $t - ${a}$ 的幂：$${poly([p, "t"], [q, ""])} = ${poly([p, `(t - ${a})`], [answer, ""])}$。常数项就是 $\\frac{1}{s}$ 的系数，所以 $B = ${answer}$。`,
      ),
    });
  },
};

const integralOfSteps: KnowledgePointDef = {
  id: "integrating-a-sum-of-steps",
  title: t("Integrating a sum of steps", "对阶跃函数之和积分"),
  explanation: t(
    "The function $u(t - c)$ is $0$ before $t = c$ and $1$ after it. Over the interval from $0$ to $T$ it therefore encloses the area of a rectangle of width $T - c$. A combination of steps adds these rectangles, each scaled by its coefficient, and a negative coefficient subtracts its area.",
    "函数 $u(t - c)$ 在 $t = c$ 之前为 $0$，之后为 $1$。所以在 $0$ 到 $T$ 上，它围成一个宽为 $T - c$ 的矩形。阶跃函数的线性组合就是把这些矩形相加，每个矩形乘以自己的系数，负系数表示减去相应的面积。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const p = rng.int(1, 4);
    const q = rng.int(p + 1, 7);
    const T = rng.int(q + 1, 12);
    const answer = a * (T - p) + b * (T - q);
    const f = poly([a, `u(t - ${p})`], [b, `u(t - ${q})`]);
    return numberProblem({
      prompt: t(`Evaluate $\\int_0^{${T}} \\big(${f}\\big)\\,dt$.`, `计算 $\\int_0^{${T}} \\big(${f}\\big)\\,dt$。`),
      answer,
      form: "integer",
      wrong: [a * T + b * T, a * p + b * q, a * (T - p), a * (T - p) - b * (T - q)],
      solution: t(
        `The first step is on for a width of $${T - p}$ and the second for $${T - q}$. The integral is $${a} \\cdot ${T - p} + ${inParens(b)} \\cdot ${T - q} = ${answer}$.`,
        `第一个阶跃作用的宽度是 $${T - p}$，第二个是 $${T - q}$。积分等于 $${a} \\cdot ${T - p} + ${inParens(b)} \\cdot ${T - q} = ${answer}$。`,
      ),
    });
  },
};

const inverseDividedByS: KnowledgePointDef = {
  id: "inverting-a-transform-divided-by-s",
  title: t("Inverting a transform divided by s", "求除以 s 后的变换的逆"),
  explanation: t(
    "Dividing a transform by $s$ corresponds to integrating the function: $\\mathcal{L}^{-1}\\left\\{\\frac{F(s)}{s}\\right\\} = \\int_0^t f(\\tau)\\,d\\tau$. This often replaces partial fractions. To invert $\\frac{c}{s(s + a)}$, recognize $\\frac{c}{s + a}$ as the transform of $ce^{-at}$ and integrate that from $0$ to $t$.",
    "把变换除以 $s$ 相当于对函数积分：$\\mathcal{L}^{-1}\\left\\{\\frac{F(s)}{s}\\right\\} = \\int_0^t f(\\tau)\\,d\\tau$。这常常可以代替部分分式。要求 $\\frac{c}{s(s + a)}$ 的逆变换，先认出 $\\frac{c}{s + a}$ 是 $ce^{-at}$ 的变换，再把它从 $0$ 积分到 $t$。",
  ),
  generate(rng) {
    const c = rng.int(1, 12);
    const a = rng.int(1, 9);
    const answer = Q.of(c, a);
    const decay = exponential(-a, "t");
    return numberProblem({
      prompt: t(
        `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s(s + ${a})}\\right\\} = K\\left(1 - ${decay}\\right)$. Find $K$.`,
        `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s(s + ${a})}\\right\\} = K\\left(1 - ${decay}\\right)$。求 $K$。`,
      ),
      answer,
      solveFor: "K",
      wrong: [c, Q.of(a, c), Q.of(-c, a), c * a],
      solution: t(
        `The fraction without the factor $s$ is the transform of $${poly([c, exponential(-a, "t")])}$. Integrating it from $0$ to $t$ divides by the rate $${a}$ and gives the factor $1 - ${decay}$, so $K = ${answer.toLatex()}$.`,
        `去掉因子 $s$ 后的分式是 $${poly([c, exponential(-a, "t")])}$ 的变换。把它从 $0$ 积分到 $t$，要除以速率 $${a}$，并得到因子 $1 - ${decay}$，所以 $K = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const periodicPulseTrain: KnowledgePointDef = {
  id: "the-transform-of-a-periodic-pulse-train",
  title: t("The transform of a periodic pulse train", "周期脉冲序列的变换"),
  explanation: t(
    "A function of period $P$ has transform $F(s) = \\frac{1}{1 - e^{-Ps}}\\int_0^P e^{-st}f(t)\\,dt$, because the later periods repeat the first one with growing delays. As $s \\to 0^+$, the first factor behaves like $\\frac{1}{Ps}$ and the integral tends to $\\int_0^P f$. So $sF(s)$ tends to the average of $f$ over a period.",
    "周期为 $P$ 的函数的变换是 $F(s) = \\frac{1}{1 - e^{-Ps}}\\int_0^P e^{-st}f(t)\\,dt$，因为后面的周期只是第一个周期的延迟重复。当 $s \\to 0^+$ 时，第一个因子接近 $\\frac{1}{Ps}$，积分趋于 $\\int_0^P f$。所以 $sF(s)$ 趋于 $f$ 在一个周期上的平均值。",
  ),
  generate(rng) {
    const P = rng.int(2, 12);
    const d = rng.int(1, P - 1);
    const h = rng.int(2, 12);
    const answer = Q.of(h * d, P);
    return numberProblem({
      prompt: t(
        `$f$ has period $${P}$, with $f(t) = ${h}$ for $0 \\le t < ${d}$ and $f(t) = 0$ for $${d} \\le t < ${P}$. Its transform is $F(s)$. Find $\\lim_{s \\to 0^+} sF(s)$.`,
        `$f$ 的周期为 $${P}$，当 $0 \\le t < ${d}$ 时 $f(t) = ${h}$，当 $${d} \\le t < ${P}$ 时 $f(t) = 0$。它的变换是 $F(s)$。求 $\\lim_{s \\to 0^+} sF(s)$。`,
      ),
      answer,
      wrong: [h * d, Q.of(h, P), Q.of(h * (P - d), P), h],
      solution: t(
        `The period formula gives $sF(s) = \\frac{${h}\\left(1 - ${exponential(-d, "s")}\\right)}{1 - ${exponential(-P, "s")}}$. For small $s$ the numerator is close to $${h} \\cdot ${multiple(d, "s")}$ and the denominator to $${P}s$, so the limit is $\\frac{${h * d}}{${P}}${lowestTerms(h * d, P)}$, the average of $f$.`,
        `周期公式给出 $sF(s) = \\frac{${h}\\left(1 - ${exponential(-d, "s")}\\right)}{1 - ${exponential(-P, "s")}}$。$s$ 很小时，分子接近 $${h} \\cdot ${multiple(d, "s")}$，分母接近 $${P}s$，所以极限是 $\\frac{${h * d}}{${P}}${lowestTerms(h * d, P)}$，也就是 $f$ 的平均值。`,
      ),
    });
  },
};

const halfPeriodShift: KnowledgePointDef = {
  id: "the-series-of-a-half-period-shift",
  title: t("The series of a half-period shift", "平移半个周期后的级数"),
  explanation: t(
    "Moving a $2\\pi$-periodic function by half its period changes its Fourier series in a simple way. Since $\\cos n(x + \\pi) = (-1)^n\\cos nx$ and $\\sin n(x + \\pi) = (-1)^n\\sin nx$, each coefficient keeps its size. Even harmonics stay the same and odd harmonics change sign, so no integral has to be computed again.",
    "把周期为 $2\\pi$ 的函数平移半个周期，它的傅里叶级数变化很简单。因为 $\\cos n(x + \\pi) = (-1)^n\\cos nx$，$\\sin n(x + \\pi) = (-1)^n\\sin nx$，每个系数的大小不变。偶次谐波不变，奇次谐波变号，所以不需要重新计算积分。",
  ),
  generate(rng) {
    const c = rng.int(1, 12);
    const e = different(rng, 1, 9, c);
    const k = rng.int(2, 7);
    const sign = k % 2 === 0 ? 1 : -1;
    const answer = Q.of(sign * c, k);
    return numberProblem({
      prompt: t(
        `A $2\\pi$-periodic function $f$ has Fourier coefficients $a_n = \\frac{${c}}{n}$ and $b_n = \\frac{${e}}{n}$. Let $g(x) = f(x + \\pi)$. Find the coefficient of $\\cos ${k}x$ in the Fourier series of $g$.`,
        `周期为 $2\\pi$ 的函数 $f$ 的傅里叶系数是 $a_n = \\frac{${c}}{n}$，$b_n = \\frac{${e}}{n}$。设 $g(x) = f(x + \\pi)$。求 $g$ 的傅里叶级数中 $\\cos ${k}x$ 的系数。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(sign * e, k), Q.of(e, k)],
      solution: t(
        `The shift turns $\\cos ${k}x$ into $\\cos(${k}x + ${k}\\pi) = ${sign === 1 ? "" : "-"}\\cos ${k}x$, and sine terms stay sine terms. So the coefficient is $${sign === 1 ? "" : "-"}a_{${k}} = ${answer.toLatex()}$.`,
        `平移把 $\\cos ${k}x$ 变成 $\\cos(${k}x + ${k}\\pi) = ${sign === 1 ? "" : "-"}\\cos ${k}x$，正弦项仍是正弦项。所以系数是 $${sign === 1 ? "" : "-"}a_{${k}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const sineSeriesOfLinear: KnowledgePointDef = {
  id: "the-sine-series-of-a-linear-function",
  title: t("The sine series of a linear function", "线性函数的正弦级数"),
  explanation: t(
    "The sine coefficients on $(0, \\pi)$ are $b_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\sin nx\\,dx$. For $f(x) = x$, integration by parts gives $\\int_0^\\pi x\\sin nx\\,dx = -\\frac{\\pi\\cos n\\pi}{n}$. Since $\\cos n\\pi = (-1)^n$, the result is $b_n = \\frac{2(-1)^{n+1}}{n}$. The signs alternate, and a constant multiple of $x$ scales every coefficient.",
    "$(0, \\pi)$ 上的正弦系数是 $b_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\sin nx\\,dx$。对 $f(x) = x$，分部积分得 $\\int_0^\\pi x\\sin nx\\,dx = -\\frac{\\pi\\cos n\\pi}{n}$。因为 $\\cos n\\pi = (-1)^n$，结果是 $b_n = \\frac{2(-1)^{n+1}}{n}$。符号交替出现，$x$ 乘以常数时每个系数也乘以同一个常数。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const n = rng.int(1, 8);
    const sign = n % 2 === 1 ? 1 : -1;
    const answer = Q.of(2 * c * sign, n);
    return numberProblem({
      prompt: t(
        `The Fourier sine series of $f(x) = ${poly([c, "x"])}$ on $(0, \\pi)$ has coefficients $b_n$. Find $b_{${n}}$.`,
        `$f(x) = ${poly([c, "x"])}$ 在 $(0, \\pi)$ 上的傅里叶正弦级数的系数为 $b_n$。求 $b_{${n}}$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * sign, n), Q.of(2 * c, n * n), Q.of(4 * c * sign, n)],
      solution: t(
        `For $f(x) = x$ the coefficient is $\\frac{2(-1)^{n+1}}{n}$. Here $n = ${n}$ gives the sign $${sign === 1 ? "+" : "-"}$, and the factor $${c}$ scales it, so $b_{${n}} = ${answer.toLatex()}$.`,
        `对 $f(x) = x$，系数是 $\\frac{2(-1)^{n+1}}{n}$。这里 $n = ${n}$，符号为 $${sign === 1 ? "+" : "-"}$，再乘以因子 $${c}$，所以 $b_{${n}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const cosineSeriesOfQuadratic: KnowledgePointDef = {
  id: "the-cosine-series-of-a-quadratic-function",
  title: t("The cosine series of a quadratic function", "二次函数的余弦级数"),
  explanation: t(
    "The cosine coefficients on $(0, \\pi)$ are $a_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\cos nx\\,dx$. For $f(x) = x^2$, integrating by parts twice gives $\\int_0^\\pi x^2\\cos nx\\,dx = \\frac{2\\pi(-1)^n}{n^2}$, so $a_n = \\frac{4(-1)^n}{n^2}$. The coefficients shrink like $\\frac{1}{n^2}$, faster than for a function whose extension has a jump.",
    "$(0, \\pi)$ 上的余弦系数是 $a_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\cos nx\\,dx$。对 $f(x) = x^2$，分部积分两次得 $\\int_0^\\pi x^2\\cos nx\\,dx = \\frac{2\\pi(-1)^n}{n^2}$，所以 $a_n = \\frac{4(-1)^n}{n^2}$。系数像 $\\frac{1}{n^2}$ 那样减小，比延拓后有跳跃的函数更快。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const n = rng.int(1, 8);
    const sign = n % 2 === 0 ? 1 : -1;
    const answer = Q.of(4 * c * sign, n * n);
    return numberProblem({
      prompt: t(
        `The Fourier cosine series of $f(x) = ${poly([c, "x^2"])}$ on $(0, \\pi)$ has coefficients $a_n$. Find $a_{${n}}$.`,
        `$f(x) = ${poly([c, "x^2"])}$ 在 $(0, \\pi)$ 上的傅里叶余弦级数的系数为 $a_n$。求 $a_{${n}}$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(2 * c * sign, n * n), Q.of(4 * c * sign, n), Q.of(4 * c, n * n * n)],
      solution: t(
        `For $f(x) = x^2$ the coefficient is $\\frac{4(-1)^n}{n^2}$. Here $n = ${n}$ gives the sign $${sign === 1 ? "+" : "-"}$, and the factor $${c}$ scales it, so $a_{${n}} = ${answer.toLatex()}$.`,
        `对 $f(x) = x^2$，系数是 $\\frac{4(-1)^n}{n^2}$。这里 $n = ${n}$，符号为 $${sign === 1 ? "+" : "-"}$，再乘以因子 $${c}$，所以 $a_{${n}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const harmonicFromFrequency: KnowledgePointDef = {
  id: "naming-a-harmonic-from-its-frequency",
  title: t("Naming a harmonic from its frequency", "由频率确定谐波的次数"),
  explanation: t(
    "A function of period $T = 2L$ has a Fourier series with terms $\\cos\\frac{n\\pi x}{L}$. A written term may have its fraction reduced, which hides its number $n$. To recover it, divide the angular frequency of the term by the fundamental frequency $\\frac{\\pi}{L}$. The quotient is the number of full oscillations in a period.",
    "周期为 $T = 2L$ 的函数，其傅里叶级数的项是 $\\cos\\frac{n\\pi x}{L}$。写出来的项可能约过分，因而看不出次数 $n$。要还原它，就用该项的角频率除以基频 $\\frac{\\pi}{L}$。商就是一个周期内完整振荡的次数。",
  ),
  generate(rng) {
    const L = rng.int(2, 8);
    const n = rng.int(1, 12);
    const g = gcd(n, L);
    const p = n / g;
    const q = L / g;
    const angle = q === 1 ? `${multiple(p, "\\pi")} x` : `\\frac{${multiple(p, "\\pi")} x}{${q}}`;
    return numberProblem({
      prompt: t(
        `A function has period $${2 * L}$. Which harmonic number $n$ is the term $\\cos\\left(${angle}\\right)$ of its Fourier series?`,
        `函数的周期为 $${2 * L}$。它的傅里叶级数中，$\\cos\\left(${angle}\\right)$ 这一项的谐波次数 $n$ 是多少？`,
      ),
      answer: n,
      form: "integer",
      solveFor: "n",
      wrong: [p, 2 * n, Q.of(n, 2), n + L],
      solution: t(
        `Here $L = ${L}$, so the terms are $\\cos\\frac{n\\pi x}{${L}}$. Matching the frequencies requires $\\frac{n}{${L}} = ${Q.of(n, L).toLatex()}$, so $n = ${n}$.`,
        `这里 $L = ${L}$，所以各项是 $\\cos\\frac{n\\pi x}{${L}}$。比较频率，需要 $\\frac{n}{${L}} = ${Q.of(n, L).toLatex()}$，所以 $n = ${n}$。`,
      ),
    });
  },
};

const gibbsOvershoot: KnowledgePointDef = {
  id: "the-overshoot-at-a-jump",
  title: t("The overshoot at a jump", "跳跃点处的过冲"),
  explanation: t(
    "Partial sums of a Fourier series do not settle smoothly near a jump. They overshoot the higher value and undershoot the lower one by about $9\\%$ of the jump, however many terms are taken. This is the Gibbs phenomenon. The peak only moves closer to the jump, so convergence does not remove its height.",
    "傅里叶级数的部分和在跳跃点附近不会平稳地趋近。无论取多少项，它都会高出较高的值、低于较低的值，差距约为跳跃量的 $9\\%$。这就是吉布斯现象。峰值只是越来越靠近跳跃点，所以收敛并不会消除它的高度。",
  ),
  generate(rng) {
    const a = rng.int(-9, 8);
    const gap = rng.int(1, 12);
    const b = a + gap;
    const answer = Q.of(100 * b + 9 * gap, 100);
    return numberProblem({
      prompt: t(
        `A $2\\pi$-periodic function equals $${a}$ on $(-\\pi, 0)$ and $${b}$ on $(0, \\pi)$. Taking the Gibbs overshoot to be $9\\%$ of the jump, what height do the peaks of the partial sums approach just to the right of $x = 0$?`,
        `周期为 $2\\pi$ 的函数在 $(-\\pi, 0)$ 上等于 $${a}$，在 $(0, \\pi)$ 上等于 $${b}$。取吉布斯过冲为跳跃量的 $9\\%$，部分和在 $x = 0$ 右侧的峰值趋于多高？`,
      ),
      answer,
      form: "decimal",
      wrong: [Q.of(a + b, 2), b, Q.of(100 * b + 18 * gap, 100), Q.of(100 * b + 9 * Math.abs(b), 100), Q.of(100 * a - 9 * gap, 100)],
      solution: t(
        `The jump is $${gap}$, measured from $${a}$ up to $${b}$. The peak lies above the higher value by $9\\%$ of the jump: $${b} + 0.09 \\cdot ${gap} = ${dec(answer)}$.`,
        `跳跃量是 $${gap}$，从 $${a}$ 升到 $${b}$。峰值比较高的值高出跳跃量的 $9\\%$：$${b} + 0.09 \\cdot ${gap} = ${dec(answer)}$。`,
      ),
    });
  },
};

const countingEigenvalues: KnowledgePointDef = {
  id: "counting-eigenvalues-below-a-bound",
  title: t("Counting eigenvalues below a bound", "计数小于某值的特征值"),
  explanation: t(
    "On an interval of length $\\ell$, the problem $y'' + \\lambda y = 0$ has eigenvalues $\\left(\\frac{n\\pi}{\\ell}\\right)^2$. With $y = 0$ at both ends, $n$ starts at $1$. With $y' = 0$ at both ends, $n$ starts at $0$, since a constant is then an eigenfunction. So the count depends on the boundary conditions as well as the length.",
    "在长度为 $\\ell$ 的区间上，问题 $y'' + \\lambda y = 0$ 的特征值是 $\\left(\\frac{n\\pi}{\\ell}\\right)^2$。两端 $y = 0$ 时，$n$ 从 $1$ 开始。两端 $y' = 0$ 时，$n$ 从 $0$ 开始，因为这时常数是特征函数。所以特征值的个数既取决于长度，也取决于边界条件。",
  ),
  generate(rng) {
    const m = rng.int(1, 3);
    const N = rng.int(2, 7);
    const low = (m * N) ** 2;
    const high = (m * (N + 1)) ** 2;
    const M = rng.int(low + 1, high - 1);
    const fixed = rng.pick([true, false]);
    const end = m === 1 ? "\\pi" : `\\frac{\\pi}{${m}}`;
    const answer = fixed ? N : N + 1;
    const conditions = fixed ? `y(0) = y\\left(${end}\\right) = 0` : `y'(0) = y'\\left(${end}\\right) = 0`;
    const rule = poly([m * m, "n^2"]);
    return numberProblem({
      prompt: t(
        `How many eigenvalues of $y'' + \\lambda y = 0$ with $${conditions}$ are less than $${M}$?`,
        `$y'' + \\lambda y = 0$（条件为 $${conditions}$）有多少个特征值小于 $${M}$？`,
      ),
      answer,
      form: "integer",
      wrong: [fixed ? N + 1 : N, answer + 1, answer - 1, Math.floor(Math.sqrt(M))],
      solution: t(
        `The eigenvalues are $\\lambda = ${rule}$ with $n = ${fixed ? "1" : "0"}, ${fixed ? "2" : "1"}, \\ldots$. The value at $n = ${N}$ is $${low}$, which is below the bound, and the value at $n = ${N + 1}$ is $${high}$, which is not. That leaves $${answer}$ eigenvalues${fixed ? "" : ", counting $\\lambda = 0$"}.`,
        `特征值是 $\\lambda = ${rule}$，$n = ${fixed ? "1" : "0"}, ${fixed ? "2" : "1"}, \\ldots$。$n = ${N}$ 时的值是 $${low}$，小于界限；$n = ${N + 1}$ 时的值是 $${high}$，不小于界限。所以共有 $${answer}$ 个特征值${fixed ? "" : "（包括 $\\lambda = 0$）"}。`,
      ),
    });
  },
};

const severalImplicitSteps: KnowledgePointDef = {
  id: "several-implicit-euler-steps",
  title: t("Several implicit Euler steps", "多步隐式欧拉法"),
  explanation: t(
    "For $y' = -\\lambda y$, the implicit Euler equation $y_{k+1} = y_k - h\\lambda y_{k+1}$ solves to $y_{k+1} = \\frac{y_k}{1 + h\\lambda}$. So every step divides by the same number, and repeated steps divide by its powers. The values shrink and stay positive for any step size, unlike the explicit method.",
    "对 $y' = -\\lambda y$，隐式欧拉方程 $y_{k+1} = y_k - h\\lambda y_{k+1}$ 解得 $y_{k+1} = \\frac{y_k}{1 + h\\lambda}$。所以每一步都除以同一个数，多步就是除以它的幂。与显式方法不同，无论步长多大，这些值都会减小并保持为正。",
  ),
  generate(rng) {
    const F = rng.int(2, 4);
    const tenths = rng.pick([1, 2, 5, 10]);
    const lambda = ((F - 1) * 10) / tenths;
    const steps = rng.int(2, 3);
    const answer = rng.int(1, 20);
    const start = answer * F ** steps;
    return numberProblem({
      prompt: t(
        `Apply $${steps}$ steps of the implicit Euler method with $h = ${decimal(tenths)}$ to $y' = ${poly([-lambda, "y"])}$, $y(0) = ${start}$. Find $y_{${steps}}$.`,
        `用隐式欧拉法对 $y' = ${poly([-lambda, "y"])}$，$y(0) = ${start}$ 迭代 $${steps}$ 步，步长 $h = ${decimal(tenths)}$。求 $y_{${steps}}$。`,
      ),
      answer,
      wrong: [start * (2 - F) ** steps, Q.of(start, F), Q.of(start, F * steps), Q.of(start, (F + 1) ** steps)],
      solution: t(
        `Each step divides by $1 + h\\lambda = ${F}$. After $${steps}$ steps, $y_{${steps}} = \\frac{${start}}{${F}^{${steps}}} = ${answer}$.`,
        `每一步都除以 $1 + h\\lambda = ${F}$。$${steps}$ 步之后，$y_{${steps}} = \\frac{${start}}{${F}^{${steps}}} = ${answer}$。`,
      ),
    });
  },
};

const stepWithoutOvershoot: KnowledgePointDef = {
  id: "the-largest-step-without-oscillation",
  title: t("The largest step without oscillation", "不产生振荡的最大步长"),
  explanation: t(
    "Explicit Euler on $y' = \\lambda(c - y)$ multiplies the distance from $c$ by $1 - h\\lambda$ at each step. The method is stable for $h\\lambda$ up to $2$, but stability alone does not make the result look right. When $h\\lambda$ exceeds $1$ the factor is negative, so the values jump back and forth across $c$, which the true solution never does.",
    "显式欧拉法用于 $y' = \\lambda(c - y)$ 时，每一步把到 $c$ 的距离乘以 $1 - h\\lambda$。只要 $h\\lambda$ 不超过 $2$，方法就是稳定的，但稳定并不代表结果合理。当 $h\\lambda$ 超过 $1$ 时因子为负，数值会在 $c$ 的两侧来回跳动，而真实解从不这样。",
  ),
  generate(rng) {
    const lambda = rng.int(2, 40);
    const c = rng.int(1, 20);
    const answer = Q.of(1, lambda);
    return numberProblem({
      prompt: t(
        `Explicit Euler is applied to $y' = ${lambda}(${c} - y)$, starting above $${c}$. What is the largest step size $h$ for which the values never cross below $${c}$?`,
        `对 $y' = ${lambda}(${c} - y)$ 使用显式欧拉法，初值大于 $${c}$。步长 $h$ 最大取多少时，数值始终不会低于 $${c}$？`,
      ),
      answer,
      wrong: [Q.of(2, lambda), lambda, Q.of(1, 2 * lambda), Q.of(c, lambda)],
      solution: t(
        `The distance from $${c}$ is multiplied by $1 - ${lambda}h$ at each step. It stays nonnegative when $1 - ${lambda}h \\ge 0$, so the largest step is $h = ${answer.toLatex()}$. The level being approached does not affect it.`,
        `每一步到 $${c}$ 的距离乘以 $1 - ${lambda}h$。当 $1 - ${lambda}h \\ge 0$ 时它保持非负，所以最大步长是 $h = ${answer.toLatex()}$。趋近的水平不影响这个结果。`,
      ),
    });
  },
};

const stepsForTargetError: KnowledgePointDef = {
  id: "the-steps-needed-for-a-target-error",
  title: t("The steps needed for a target error", "达到目标误差所需的步数"),
  explanation: t(
    "A method of order $p$ has error about $Ch^p$, and the number of steps on a fixed interval is proportional to $\\frac{1}{h}$. Dividing $h$ by $r$ multiplies the work by $r$ and divides the error by $r^p$. High-order methods therefore gain accuracy cheaply, while a first-order method pays for every factor in full.",
    "$p$ 阶方法的误差约为 $Ch^p$，而固定区间上的步数与 $\\frac{1}{h}$ 成正比。把 $h$ 除以 $r$，工作量乘以 $r$，误差除以 $r^p$。所以高阶方法能以很小的代价提高精度，而一阶方法的每一分精度都要付出同样多的步数。",
  ),
  generate(rng) {
    const p = rng.pick([1, 2, 4]);
    const k = rng.int(1, 3);
    const N = 10 * rng.int(1, 10);
    const r = 2 ** k;
    const factor = r ** p;
    const answer = N * r;
    return numberProblem({
      prompt: t(
        `A method of order $${p}$ takes $${N}$ steps to cross an interval. How many steps does it need on the same interval to make the error $${factor}$ times smaller?`,
        `一个 $${p}$ 阶方法用 $${N}$ 步走完一个区间。要使误差缩小到 $\\frac{1}{${factor}}$，在同一区间上需要多少步？`,
      ),
      answer,
      form: "integer",
      wrong: [N * factor, N * p, N * r * r, N + factor],
      solution: t(
        `Dividing $h$ by $r$ divides the error by $r^p$, with $p = ${p}$ here. The required factor is reached with $r = ${r}$, so the number of steps becomes $${N} \\cdot ${r} = ${answer}$.`,
        `把 $h$ 除以 $r$，误差除以 $r^p$，这里 $p = ${p}$。取 $r = ${r}$ 就达到所需的倍数，所以步数变为 $${N} \\cdot ${r} = ${answer}$。`,
      ),
    });
  },
};

const midpointStep: KnowledgePointDef = {
  id: "a-midpoint-step",
  title: t("A midpoint step", "中点法的一步"),
  explanation: t(
    "The midpoint method is a second-order relative of Heun's method. It uses Euler's method for half a step to reach an estimated midpoint, and takes the slope there: $k_1 = f(t_n, y_n)$, then $k_2 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_1\\right)$. The full step from $y_n$ then uses this better slope: $y_{n+1} = y_n + hk_2$.",
    "中点法是与 Heun 方法同属二阶的方法。它先用欧拉法走半步，估计出中点，再取那里的斜率：$k_1 = f(t_n, y_n)$，然后 $k_2 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_1\\right)$。之后从 $y_n$ 出发，用这个更好的斜率走完整一步：$y_{n+1} = y_n + hk_2$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 3);
    const t0 = rng.int(0, 2);
    const y0 = rng.int(1, 9);
    const tenths = rng.pick([2, 4, 10]);
    const h = Q.of(tenths, 10);
    const half = Q.of(tenths, 20);
    const f = (time: Q, y: Q) => Q.of(a).mul(time).add(Q.of(b).mul(y));
    const start = Q.of(y0);
    const k1 = f(Q.of(t0), start);
    const middle = start.add(half.mul(k1));
    const k2 = f(Q.of(t0).add(half), middle);
    const answer = start.add(h.mul(k2));
    const k4 = f(Q.of(t0).add(h), start.add(h.mul(k1)));
    return numberProblem({
      prompt: t(
        `Apply one step of the midpoint method with $h = ${decimal(tenths)}$ to $y' = ${poly([a, "t"], [b, "y"])}$, $y(${t0}) = ${y0}$. Find $y_1$.`,
        `用中点法对 $y' = ${poly([a, "t"], [b, "y"])}$，$y(${t0}) = ${y0}$ 走一步，步长 $h = ${decimal(tenths)}$。求 $y_1$。`,
      ),
      answer,
      wrong: [start.add(h.mul(k1)), start.add(half.mul(k1.add(k4))), start.add(h.mul(f(Q.of(t0).add(half), start))), middle],
      solution: t(
        `First $k_1 = ${k1.toLatex()}$, which gives the estimated midpoint value $${middle.toLatex()}$. The slope there is $k_2 = ${k2.toLatex()}$. So $y_1 = ${y0} + ${decimal(tenths)} \\cdot ${signedFactor(k2)} = ${answer.toLatex()}$.`,
        `先求 $k_1 = ${k1.toLatex()}$，得到中点的估计值 $${middle.toLatex()}$。那里的斜率是 $k_2 = ${k2.toLatex()}$。所以 $y_1 = ${y0} + ${decimal(tenths)} \\cdot ${signedFactor(k2)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const rk4OfTime: KnowledgePointDef = {
  id: "an-rk4-step-for-a-function-of-t-alone",
  title: t("An RK4 step for a function of t alone", "右端只含 t 时的 RK4 步"),
  explanation: t(
    "When the right-hand side depends only on $t$, the slopes $k_2$ and $k_3$ are the same value, both taken at the midpoint. RK4 then becomes $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 4k_2 + k_4)$, which is Simpson's rule for the integral of $f$. Simpson's rule is exact for quadratics, so here the step equals the true solution.",
    "右端只依赖 $t$ 时，$k_2$ 和 $k_3$ 是同一个值，都在中点处取得。RK4 于是变成 $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 4k_2 + k_4)$，这正是 $f$ 的积分的辛普森公式。辛普森公式对二次函数是精确的，所以这里的一步就等于真实解。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const b = rng.int(-4, 4);
    const c = rng.int(-5, 5);
    const h = rng.pick([1, 2, 3, 4]);
    const t0 = rng.int(0, 3);
    const y0 = rng.int(1, 12);
    const f = (x: Q) => Q.of(a).mul(x).mul(x).add(Q.of(b).mul(x)).add(Q.of(c));
    const k1 = f(Q.of(t0));
    const k2 = f(Q.of(2 * t0 + h, 2));
    const k4 = f(Q.of(t0 + h));
    const start = Q.of(y0);
    const answer = start.add(Q.of(h, 6).mul(k1.add(k2.mul(Q.of(4))).add(k4)));
    return numberProblem({
      prompt: t(
        `Apply one RK4 step with $h = ${h}$ to $y' = ${poly([a, "t^2"], [b, "t"], [c, ""])}$, $y(${t0}) = ${y0}$. Find $y_1$.`,
        `用 RK4 对 $y' = ${poly([a, "t^2"], [b, "t"], [c, ""])}$，$y(${t0}) = ${y0}$ 走一步，步长 $h = ${h}$。求 $y_1$。`,
      ),
      answer,
      wrong: [start.add(Q.of(h).mul(k2)), start.add(Q.of(h).mul(k1)), start.add(Q.of(h, 2).mul(k1.add(k4)))],
      solution: t(
        `The slopes are $k_1 = ${k1.toLatex()}$, $k_2 = k_3 = ${k2.toLatex()}$ and $k_4 = ${k4.toLatex()}$. The weighted average gives $y_1 = ${y0} + \\frac{${h}}{6}\\big(k_1 + 4k_2 + k_4\\big) = ${answer.toLatex()}$.`,
        `斜率是 $k_1 = ${k1.toLatex()}$，$k_2 = k_3 = ${k2.toLatex()}$，$k_4 = ${k4.toLatex()}$。加权平均得 $y_1 = ${y0} + \\frac{${h}}{6}\\big(k_1 + 4k_2 + k_4\\big) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const harvestingBothSpecies: KnowledgePointDef = {
  id: "the-effect-of-harvesting-both-species",
  title: t("The effect of harvesting both species", "同时捕捞两个物种的效果"),
  explanation: t(
    "Suppose both populations of a predator-prey model are removed at the same per capita rate $e$. The prey growth rate $a$ becomes $a - e$ and the predator death rate $c$ becomes $c + e$. So the equilibrium moves to more prey and fewer predators. This is Volterra's principle, and it explains why less fishing can mean fewer prey fish.",
    "假设捕食模型中的两个种群都按相同的人均比率 $e$ 被移除。猎物的增长率 $a$ 变成 $a - e$，捕食者的死亡率 $c$ 变成 $c + e$。所以平衡点移向更多的猎物和更少的捕食者。这就是沃尔泰拉原理，它解释了为什么减少捕捞反而可能使被捕食的鱼变少。",
  ),
  generate(rng) {
    const a = rng.int(4, 12);
    const b = rng.int(1, 5);
    const c = rng.int(1, 6);
    const d = rng.int(1, 5);
    const e = rng.int(1, 3);
    const askPrey = rng.pick([true, false]);
    const prey = Q.of(c + e, d);
    const predator = Q.of(a - e, b);
    const answer = askPrey ? prey : predator;
    return numberProblem({
      prompt: t(
        `Both species are harvested in the model $x' = ${poly([a, "x"], [-b, "xy"])} - ${poly([e, "x"])}$, $y' = ${poly([-c, "y"], [d, "xy"])} - ${poly([e, "y"])}$, with prey $x$ and predators $y$. Find the ${askPrey ? "prey" : "predator"} population at the coexistence equilibrium.`,
        `在模型 $x' = ${poly([a, "x"], [-b, "xy"])} - ${poly([e, "x"])}$，$y' = ${poly([-c, "y"], [d, "xy"])} - ${poly([e, "y"])}$ 中，两个物种都被捕捞，$x$ 是猎物，$y$ 是捕食者。求共存平衡点处${askPrey ? "猎物" : "捕食者"}的数量。`,
      ),
      answer,
      wrong: askPrey ? [Q.of(c, d), Q.of(c - e, d), predator] : [Q.of(a, b), Q.of(a + e, b), prey],
      solution: t(
        `At coexistence, dividing the equations by $x$ and $y$ gives $${a - e} = ${poly([b, "y"])}$ and $${c + e} = ${poly([d, "x"])}$. Solving for $${askPrey ? "x" : "y"}$ gives $${answer.toLatex()}$.`,
        `共存时，把两个方程分别除以 $x$ 和 $y$，得 $${a - e} = ${poly([b, "y"])}$，$${c + e} = ${poly([d, "x"])}$。解出 $${askPrey ? "x" : "y"}$，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const radiusOfConvergence: KnowledgePointDef = {
  id: "the-guaranteed-radius-of-convergence",
  title: t("The guaranteed radius of convergence", "有保证的收敛半径"),
  explanation: t(
    "For $P(x)y'' + Q(x)y' + R(x)y = 0$ with polynomial coefficients, the singular points are the zeros of $P$. A power series solution about an ordinary point $x_0$ converges at least out to the nearest singular point. Complex zeros count too, so the distance must be measured in the complex plane.",
    "对多项式系数方程 $P(x)y'' + Q(x)y' + R(x)y = 0$，奇点就是 $P$ 的零点。在常点 $x_0$ 处的幂级数解至少收敛到最近的奇点。复零点也算在内，所以距离要在复平面上度量。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const complex = rng.pick([true, false]);
    const rest = poly([1, "y'"], [k, "y"]);
    if (complex) {
      const [leg, q, hyp] = rng.pick([
        [3, 4, 5],
        [4, 3, 5],
        [6, 8, 10],
        [8, 6, 10],
        [5, 12, 13],
        [12, 5, 13],
      ] as const);
      const x0 = rng.pick([leg, -leg]);
      return numberProblem({
        prompt: t(
          `A power series solution of $(${poly([1, "x^2"], [q * q, ""])})y'' + ${rest} = 0$ is centered at $x = ${x0}$. How large a radius of convergence does the ordinary-point theorem guarantee?`,
          `$(${poly([1, "x^2"], [q * q, ""])})y'' + ${rest} = 0$ 的幂级数解以 $x = ${x0}$ 为中心。常点定理保证的收敛半径是多少？`,
        ),
        answer: hyp,
        form: "integer",
        wrong: [leg, q, leg + q],
        solution: t(
          `The leading coefficient vanishes at $x = \\pm ${q}i$. Both points lie at distance $\\sqrt{${leg}^2 + ${q}^2} = ${hyp}$ from the center, so the radius is at least $${hyp}$.`,
          `首项系数在 $x = \\pm ${q}i$ 处为零。这两点到中心的距离都是 $\\sqrt{${leg}^2 + ${q}^2} = ${hyp}$，所以半径至少是 $${hyp}$。`,
        ),
      });
    }
    const a = nonzero(rng, 9);
    const b = different(rng, -9, 9, a);
    const others = [...Array(21).keys()].map((i) => i - 10).filter((i) => i !== a && i !== b);
    const x0 = rng.pick(others);
    const first = Math.abs(x0 - a);
    const second = Math.abs(x0 - b);
    const answer = Math.min(first, second);
    const product = b === 0 ? `x(${shifted(a)})` : `(${shifted(a)})(${shifted(b)})`;
    return numberProblem({
      prompt: t(
        `A power series solution of $${product}y'' + ${rest} = 0$ is centered at $x = ${x0}$. How large a radius of convergence does the ordinary-point theorem guarantee?`,
        `$${product}y'' + ${rest} = 0$ 的幂级数解以 $x = ${x0}$ 为中心。常点定理保证的收敛半径是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.max(first, second), Math.abs(x0), Math.abs(a - b), first + second],
      solution: t(
        `The singular points are $x = ${a}$ and $x = ${b}$, at distances $${first}$ and $${second}$ from the center. The nearer one gives the radius $${answer}$.`,
        `奇点是 $x = ${a}$ 和 $x = ${b}$，到中心的距离分别是 $${first}$ 和 $${second}$。较近的一个给出半径 $${answer}$。`,
      ),
    });
  },
};

const rateWithChangingVolume: KnowledgePointDef = {
  id: "the-rate-when-the-volume-changes",
  title: t("The rate when the volume changes", "体积变化时的变化率"),
  explanation: t(
    "In a mixture problem the amount of solute changes at the rate in minus the rate out. The rate in is the inflow concentration times the inflow rate. The rate out uses the current concentration, $\\frac{Q}{V(t)}$. If inflow and outflow differ, the volume $V(t)$ changes linearly with time, so the volume at that moment must be found first.",
    "在混合问题中，溶质量的变化率等于流入率减去流出率。流入率是流入浓度乘以流入速度。流出率要用当前浓度 $\\frac{Q}{V(t)}$。如果流入和流出的速度不同，体积 $V(t)$ 随时间线性变化，所以必须先求出那一时刻的体积。",
  ),
  generate(rng) {
    const start = 50 * rng.int(2, 10);
    const out = rng.int(2, 8);
    const into = out + rng.int(1, 4);
    const c = rng.int(1, 9);
    const T = 5 * rng.int(1, 6);
    const S = 10 * rng.int(5, 30);
    const V = start + (into - out) * T;
    const inflow = c * into;
    const answer = Q.of(inflow).sub(Q.of(out * S, V));
    return numberProblem({
      prompt: t(
        `A tank starts with $${start}$ liters. A solution of concentration $${c}\\text{ g/L}$ flows in at $${into}\\text{ L/min}$, and the mixture drains at $${out}\\text{ L/min}$. At $t = ${T}$ minutes it holds $${S}$ grams of solute. How fast is the solute changing then, in $\\text{g/min}$? Give a negative number if it is falling.`,
        `水箱开始时有 $${start}$ 升液体。浓度为 $${c}\\text{ g/L}$ 的溶液以 $${into}\\text{ L/min}$ 流入，混合液以 $${out}\\text{ L/min}$ 流出。在 $t = ${T}$ 分钟时，水箱中有 $${S}$ 克溶质。此时溶质的变化率是多少 $\\text{g/min}$？如果在减少，答案取负数。`,
      ),
      answer,
      wrong: [Q.of(inflow).sub(Q.of(out * S, start)), Q.of(inflow).sub(Q.of(into * S, V)), inflow],
      solution: t(
        `The volume at that time is $${start} + ${into - out} \\cdot ${T} = ${V}$ liters. The rate in is $${inflow}$ and the rate out is $${out} \\cdot \\frac{${S}}{${V}}$. The difference is $${answer.toLatex()}$.`,
        `那时的体积是 $${start} + ${into - out} \\cdot ${T} = ${V}$ 升。流入率是 $${inflow}$，流出率是 $${out} \\cdot \\frac{${S}}{${V}}$。两者之差是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const constantBernoulliSolution: KnowledgePointDef = {
  id: "the-nonzero-constant-solution-of-a-bernoulli-equation",
  title: t("The constant solution of a Bernoulli equation", "伯努利方程的常数解"),
  explanation: t(
    "With constant coefficients, $y' + py = qy^n$ is autonomous, so its constant solutions come from setting $y' = 0$. Besides $y = 0$, this gives $y^{n-1} = \\frac{p}{q}$. No substitution is needed. In the linear equation for $v = y^{1-n}$, the same value appears as the equilibrium, which is why solutions may level off there.",
    "系数为常数时，$y' + py = qy^n$ 是自治方程，所以令 $y' = 0$ 就得到它的常数解。除了 $y = 0$，还有 $y^{n-1} = \\frac{p}{q}$。这不需要任何代换。在关于 $v = y^{1-n}$ 的线性方程中，同一个值表现为平衡解，所以解可能在那里趋于平稳。",
  ),
  generate(rng) {
    const answer = rng.int(2, 6);
    const q = rng.int(1, 5);
    const n = rng.int(2, 4);
    const ratio = answer ** (n - 1);
    const p = q * ratio;
    const left = n === 2 ? "y" : `y^{${n - 1}}`;
    return numberProblem({
      prompt: t(
        `Find the positive constant solution of $y' + ${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$.`,
        `求 $y' + ${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$ 的正常数解。`,
      ),
      answer,
      form: "integer",
      wrong: [p, ratio + 1, q, n],
      solution: t(
        `A constant solution has $y' = 0$, so $${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$. Dividing by $y$ and by the coefficient gives $${left} = ${ratio}$, so the positive solution is $y = ${answer}$.`,
        `常数解满足 $y' = 0$，所以 $${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$。两边除以 $y$ 和系数，得 $${left} = ${ratio}$，所以正解是 $y = ${answer}$。`,
      ),
    });
  },
};

const clairautLinesThroughPoint: KnowledgePointDef = {
  id: "the-solution-lines-through-a-point",
  title: t("The solution lines through a point", "过一点的解直线"),
  explanation: t(
    "The general solutions of Clairaut's equation $y = xy' + (y')^2$ are the lines $y = cx + c^2$. To find those through a given point, substitute its coordinates and solve the resulting quadratic in $c$. A point below the singular parabola $y = -\\frac{x^2}{4}$ gets no line, one on it gets one, and one above it gets two.",
    "克莱罗方程 $y = xy' + (y')^2$ 的通解是直线 $y = cx + c^2$。要找过给定点的直线，就代入该点的坐标，解关于 $c$ 的二次方程。奇解抛物线 $y = -\\frac{x^2}{4}$ 下方的点没有这样的直线，线上的点有一条，上方的点有两条。",
  ),
  generate(rng) {
    const u = rng.int(-6, 6);
    const w = different(rng, -6, 6, u);
    const small = Math.min(u, w);
    const large = Math.max(u, w);
    const x0 = -(small + large);
    const y0 = -small * large;
    return numberProblem({
      prompt: t(
        `Two solution lines of $y = xy' + (y')^2$ pass through the point $(${x0}, ${y0})$. Find the larger of their slopes.`,
        `$y = xy' + (y')^2$ 有两条解直线经过点 $(${x0}, ${y0})$。求它们中较大的斜率。`,
      ),
      answer: large,
      form: "integer",
      wrong: [small, x0, y0, -large],
      solution: t(
        `A line $y = cx + c^2$ passes through the point when $${poly([1, "c^2"], [x0, "c"], [-y0, ""])} = 0$. The roots are $c = ${small}$ and $c = ${large}$, so the larger slope is $${large}$.`,
        `直线 $y = cx + c^2$ 过这一点，当且仅当 $${poly([1, "c^2"], [x0, "c"], [-y0, ""])} = 0$。根是 $c = ${small}$ 和 $c = ${large}$，所以较大的斜率是 $${large}$。`,
      ),
    });
  },
};

const limitFromThreeReadings: KnowledgePointDef = {
  id: "the-limit-from-three-readings",
  title: t("The limit from three readings", "由三次读数求极限值"),
  explanation: t(
    "Under inhibited growth $y' = k(M - y)$, the distance to the limit $M$ shrinks by a fixed factor over each equal time interval. So the increases between equally spaced readings form a geometric sequence. Their ratio gives that factor, and summing the increases still to come gives $M$, without ever finding $k$.",
    "在抑制增长 $y' = k(M - y)$ 中，到极限 $M$ 的距离在每段相等的时间内都缩小相同的倍数。所以等间隔读数之间的增量构成等比数列。增量之比就是这个倍数，把以后的增量全部加起来就得到 $M$，完全不需要求 $k$。",
  ),
  generate(rng) {
    const M = 150 + 10 * rng.int(0, 15);
    const shrink = rng.pick([2, 3]);
    const D = 36 * rng.int(1, 3);
    const T = rng.int(1, 5);
    const first = M - D;
    const second = M - D / shrink;
    const third = M - D / (shrink * shrink);
    const gap1 = second - first;
    const gap2 = third - second;
    const left = Q.of(gap2, shrink - 1);
    return numberProblem({
      prompt: t(
        `A quantity grows according to $y' = k(M - y)$. It equals $${first}$ at $t = ${T}$, $${second}$ at $t = ${2 * T}$ and $${third}$ at $t = ${3 * T}$. Find the limit $M$.`,
        `某个量按 $y' = k(M - y)$ 增长。它在 $t = ${T}$ 时等于 $${first}$，在 $t = ${2 * T}$ 时等于 $${second}$，在 $t = ${3 * T}$ 时等于 $${third}$。求极限 $M$。`,
      ),
      answer: M,
      form: "integer",
      wrong: [third + gap2, third + gap1, third, first + gap1 * shrink],
      solution: t(
        `The increases are $${gap1}$ and $${gap2}$, so each is $\\frac{1}{${shrink}}$ of the one before. The increases still to come form a geometric series with the sum $${gap2}\\left(\\frac{1}{${shrink}} + \\frac{1}{${shrink * shrink}} + \\cdots\\right) = ${left.toLatex()}$. So $M = ${third} + ${left.toLatex()} = ${M}$.`,
        `增量是 $${gap1}$ 和 $${gap2}$，所以每个增量都是前一个的 $\\frac{1}{${shrink}}$。以后的增量构成等比级数，其和为 $${gap2}\\left(\\frac{1}{${shrink}} + \\frac{1}{${shrink * shrink}} + \\cdots\\right) = ${left.toLatex()}$。所以 $M = ${third} + ${left.toLatex()} = ${M}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** signedPower writes a power of a variable, leaving out an exponent of one. */
const signedPower = (name: string, n: number) => (n === 1 ? name : `${name}^{${n}}`);
/** exponentOf writes the exponent c times the variable given, leaving out a coefficient of size one. */
const exponentOf = (c: number, name: string) => (c === 1 ? name : c === -1 ? `-${name}` : `${c}${name}`);

const blowUpTime: KnowledgePointDef = {
  id: "the-time-a-separable-solution-blows-up",
  title: t("The time a separable solution blows up", "可分离方程的解爆破的时间"),
  explanation: t(
    "A nonlinear equation can have a solution that stops existing, even though its right side is perfectly smooth. Separating $y' = ky^2$ gives $-\\frac{1}{y} = kt + C$, so $y$ is a constant divided by an expression that falls to zero at a finite time. As $t$ approaches that time, $y$ grows without bound, and the solution has no continuation past it. Nothing in the formula for the equation itself warns of this time; it depends on the initial value.",
    "即使右边完全光滑，非线性方程的解也可能不再存在。分离 $y' = ky^2$ 得 $-\\frac{1}{y} = kt + C$，所以 $y$ 是一个常数除以在有限时刻降到零的式子。当 $t$ 趋近这个时刻，$y$ 无限增大，解无法延续到它之后。方程本身的公式并不提示这个时刻，它取决于初值。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const a = rng.int(1, 6);
    const answer = Q.of(1, k * a);
    return numberProblem({
      prompt: t(
        `The solution of $y' = ${k === 1 ? "" : k}y^2$, $y(0) = ${a}$, grows without bound as $t$ approaches a time $T > 0$. Find $T$.`,
        `$y' = ${k === 1 ? "" : k}y^2$，$y(0) = ${a}$ 的解在 $t$ 趋近某时刻 $T > 0$ 时无限增大。求 $T$。`,
      ),
      answer,
      wrong: [Q.of(k * a), Q.of(1, k), Q.of(1, a), Q.of(2, k * a), Q.of(1, k * a + 1), answer.neg()],
      solution: t(
        `Separating gives $\\frac{1}{y} = ${Q.of(1, a).toLatex()} - ${k === 1 ? "" : k}t$. The right side reaches zero at $t = ${answer.toLatex()}$.`,
        `分离变量得 $\\frac{1}{y} = ${Q.of(1, a).toLatex()} - ${k === 1 ? "" : k}t$。右边在 $t = ${answer.toLatex()}$ 时变为零。`,
      ),
    });
  },
};

const constantSolutionValue: KnowledgePointDef = {
  id: "the-initial-value-that-gives-a-constant-solution",
  title: t("The initial value that gives a constant solution", "得到常数解的初值"),
  explanation: t(
    "The general solution of $y' = py + q$ is a particular solution plus $Ce^{pt}$. Among all these solutions, exactly one has $C = 0$, and it is a constant. A constant has zero derivative, so setting $py + q = 0$ finds it at once, without any integration. Starting at this value, nothing ever changes. Starting anywhere else, the solution moves away from it or towards it depending on the sign of $p$.",
    "$y' = py + q$ 的通解是一个特解加上 $Ce^{pt}$。在所有这些解中，恰有一个 $C = 0$，它是常数。常数的导数为零，所以令 $py + q = 0$ 就立刻求出它，不必积分。从这个值出发，什么都不会改变。从其他值出发，解会离开它或趋向它，取决于 $p$ 的符号。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 12);
    const answer = Q.of(-q, p);
    return numberProblem({
      prompt: t(
        `For which value of $y(0)$ is the solution of $y' = ${poly([p, "y"], [q, ""])}$ constant?`,
        `当 $y(0)$ 取何值时，$y' = ${poly([p, "y"], [q, ""])}$ 的解是常数？`,
      ),
      answer,
      wrong: [Q.of(q, p), Q.of(p, q), Q.of(-q), Q.of(0)],
      solution: t(
        `A constant solution has $y' = 0$, so $${poly([p, "y"], [q, ""])} = 0$, which gives $y = ${answer.toLatex()}$.`,
        `常数解满足 $y' = 0$，所以 $${poly([p, "y"], [q, ""])} = 0$，得 $y = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const noTransientExponential: KnowledgePointDef = {
  id: "the-initial-value-with-no-transient-under-exponential-forcing",
  title: t("The initial value with no transient under exponential forcing", "指数强迫下没有瞬态项的初值"),
  explanation: t(
    "The solutions of a forced linear equation differ from each other only by a multiple of the homogeneous solution, which is the transient. The initial value decides that multiple. So a solution with no transient is the particular solution alone, and its value at $t = 0$ is just the coefficient found by undetermined coefficients. Any other starting value adds a term $Ce^{-at}$, in addition to the response to the forcing.",
    "受迫线性方程的解之间只差齐次解的一个倍数，这就是瞬态项。初值决定这个倍数。所以没有瞬态项的解就是特解本身，它在 $t = 0$ 的值就是待定系数法求出的系数。任何其他初值都会在受迫响应之外增加一项 $Ce^{-at}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const c = different(rng, -6, 6, -a) || a + 1;
    const b = rng.int(2, 12);
    const answer = Q.of(b, a + c);
    return numberProblem({
      prompt: t(
        `Find the value of $y(0)$ for which the solution of $${poly([1, "y'"], [a, "y"])} = ${b}e^{${exponentOf(c, "t")}}$ has no term in $e^{${exponentOf(-a, "t")}}$.`,
        `求 $y(0)$ 的值，使 $${poly([1, "y'"], [a, "y"])} = ${b}e^{${exponentOf(c, "t")}}$ 的解不含 $e^{${exponentOf(-a, "t")}}$ 项。`,
      ),
      answer,
      wrong: [Q.of(b, a), Q.of(b, c), Q.of(b), a === c ? Q.of(b, a + c + 1) : Q.of(b, a - c)],
      solution: t(
        `Trying $y = Ae^{${exponentOf(c, "t")}}$ gives $A(${c} + ${a}) = ${b}$, so $A = ${answer.toLatex()}$. With no transient, $y(0) = A$.`,
        `设 $y = Ae^{${exponentOf(c, "t")}}$，得 $A(${c} + ${a}) = ${b}$，所以 $A = ${answer.toLatex()}$。没有瞬态项时，$y(0) = A$。`,
      ),
    });
  },
};

const boundedAtOrigin: KnowledgePointDef = {
  id: "the-solution-that-stays-bounded-at-the-origin",
  title: t("The solution that stays bounded at the origin", "在原点附近有界的解"),
  explanation: t(
    "A coefficient that is singular at $x = 0$ can act in place of an initial condition. For $y' + \\frac{k}{x}y = c$, the integrating factor $x^k$ gives $y = \\frac{cx}{k + 1} + Cx^{-k}$. With $k > 0$, the second term grows without bound as $x$ approaches zero unless $C = 0$. So requiring the solution to stay bounded there picks out exactly one solution from the whole family.",
    "在 $x = 0$ 处奇异的系数可以起到初始条件的作用。对 $y' + \\frac{k}{x}y = c$，积分因子 $x^k$ 给出 $y = \\frac{cx}{k + 1} + Cx^{-k}$。当 $k > 0$ 时，除非 $C = 0$，否则第二项在 $x$ 趋近零时无限增大。所以要求解在那里有界，就从整个解族中选出了唯一一个解。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const c = rng.int(2, 12);
    const x0 = rng.int(1, 6);
    const answer = Q.of(c * x0, k + 1);
    return numberProblem({
      prompt: t(
        `A solution of $y' + \\frac{${k}}{x}y = ${c}$ on $x > 0$ stays bounded as $x \\to 0^+$. Find $y(${x0})$.`,
        `$y' + \\frac{${k}}{x}y = ${c}$ 在 $x > 0$ 上的一个解在 $x \\to 0^+$ 时有界。求 $y(${x0})$。`,
      ),
      answer,
      wrong: [Q.of(c * x0, k), Q.of(c * x0), Q.of(c, k + 1), answer.add(Q.of(1))],
      solution: t(
        `Integrating gives $y = \\frac{${c}x}{${k + 1}} + Cx^{-${k}}$, and boundedness forces $C = 0$. So $y(${x0}) = ${answer.toLatex()}$.`,
        `积分得 $y = \\frac{${c}x}{${k + 1}} + Cx^{-${k}}$，有界性要求 $C = 0$。所以 $y(${x0}) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const eulerHomogeneous: KnowledgePointDef = {
  id: "eulers-theorem-for-homogeneous-functions",
  title: t("Euler's theorem for homogeneous functions", "齐次函数的欧拉定理"),
  explanation: t(
    "A function homogeneous of degree $n$ satisfies $f(sx, sy) = s^n f(x, y)$ for all $s$. Differentiating both sides with respect to $s$ and then setting $s = 1$ gives $xf_x + yf_y = nf$. So this particular combination of partial derivatives depends only on the degree and on the value of the function at the point. Neither the formula for $f$ nor the separate partial derivatives need to be known.",
    "$n$ 次齐次函数对所有 $s$ 满足 $f(sx, sy) = s^n f(x, y)$。两边对 $s$ 求导，再令 $s = 1$，得 $xf_x + yf_y = nf$。所以这个特定的偏导数组合只取决于次数和函数在该点的值。既不需要知道 $f$ 的公式，也不需要知道各个偏导数。",
  ),
  generate(rng) {
    const n = rng.int(2, 6);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const v = nonzero(rng, 9);
    const answer = n * v;
    return numberProblem({
      prompt: t(
        `A differentiable function $f$ is homogeneous of degree ${n}, with $f(${a}, ${b}) = ${v}$. Find $${a}f_x(${a}, ${b}) + ${b}f_y(${a}, ${b})$.`,
        `可微函数 $f$ 是 ${n} 次齐次函数，$f(${a}, ${b}) = ${v}$。求 $${a}f_x(${a}, ${b}) + ${b}f_y(${a}, ${b})$。`,
      ),
      answer,
      form: "integer",
      wrong: [v, n + v, (n - 1) * v, -answer, answer + 1],
      solution: t(
        `Euler's theorem gives $xf_x + yf_y = nf$, which here is $${n} \\cdot ${inParens(v)} = ${answer}$.`,
        `欧拉定理给出 $xf_x + yf_y = nf$，这里是 $${n} \\cdot ${inParens(v)} = ${answer}$。`,
      ),
    });
  },
};

const powerMakingExact: KnowledgePointDef = {
  id: "the-power-of-x-that-makes-an-equation-exact",
  title: t("The power of x that makes an equation exact", "使方程恰当的 x 的幂"),
  explanation: t(
    "To find an integrating factor of a given shape, multiply through by it and apply the test for exactness. With the factor $x^m$, the equation $ay\\,dx + bx\\,dy = 0$ has $M = ax^m y$ and $N = bx^{m + 1}$. So $M_y = ax^m$ and $N_x = b(m + 1)x^m$. The powers of $x$ agree automatically, so exactness becomes one equation for $m$, and the exponent need not be a whole number.",
    "要求给定形状的积分因子，就乘上它，再用恰当性检验。用因子 $x^m$，方程 $ay\\,dx + bx\\,dy = 0$ 有 $M = ax^m y$，$N = bx^{m + 1}$。所以 $M_y = ax^m$，$N_x = b(m + 1)x^m$。$x$ 的幂自动相同，于是恰当性成为关于 $m$ 的一个方程，指数不一定是整数。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = different(rng, 1, 9, a);
    const ratio = Q.of(a, b);
    const answer = ratio.sub(Q.of(1));
    return numberProblem({
      prompt: t(
        `Find $m$ so that multiplying $${a === 1 ? "" : a}y\\,dx + ${b === 1 ? "" : b}x\\,dy = 0$ by $x^m$ makes the equation exact.`,
        `求 $m$，使 $${a === 1 ? "" : a}y\\,dx + ${b === 1 ? "" : b}x\\,dy = 0$ 乘以 $x^m$ 后成为恰当方程。`,
      ),
      answer,
      wrong: [ratio, Q.of(b, a).sub(Q.of(1)), ratio.add(Q.of(1)), answer.neg()],
      solution: t(
        `Exactness requires $${a} = ${b}(m + 1)$, so $m = ${ratio.toLatex()} - 1 = ${answer.toLatex()}$.`,
        `恰当性要求 $${a} = ${b}(m + 1)$，所以 $m = ${ratio.toLatex()} - 1 = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const semistableLimit: KnowledgePointDef = {
  id: "the-limit-near-a-semistable-equilibrium",
  title: t("The limit near a semistable equilibrium", "半稳定平衡点附近的极限"),
  explanation: t(
    "At a double root of the right side of an autonomous equation, $y'$ does not change sign. So solutions on one side approach that equilibrium, while solutions on the other side move away from it. Such an equilibrium is called semistable. To find a limit, look at the sign of $y'$ at the starting value, then follow the solution in that direction until it reaches the first equilibrium, which it can never cross.",
    "在自治方程右边的二重根处，$y'$ 不变号。所以一侧的解趋向这个平衡点，另一侧的解离开它。这样的平衡点称为半稳定的。要求极限，先看 $y'$ 在初值处的符号，然后沿这个方向跟随解，直到它到达第一个平衡点，它永远无法越过这个点。",
  ),
  generate(rng) {
    const a = rng.int(-6, 3);
    const b = a + rng.int(2, 6);
    const place = rng.pick(["below", "between", "above"] as const);
    const y0 = place === "below" ? a - rng.int(1, 4) : place === "between" ? a + rng.int(1, b - a - 1) : b + rng.int(1, 4);
    const answer = place === "below" ? a : b;
    const other = place === "below" ? b : a;
    const first = poly([1, "y"], [-a, ""]);
    const second = poly([b, ""], [-1, "y"]);
    const sign = place === "above" ? "negative" : "positive";
    const signZh = place === "above" ? "负" : "正";
    return numberProblem({
      prompt: t(
        `Let $y' = (${first})^2(${second})$ with $y(0) = ${y0}$. Find $\\lim_{t \\to \\infty} y(t)$.`,
        `设 $y' = (${first})^2(${second})$，$y(0) = ${y0}$。求 $\\lim_{t \\to \\infty} y(t)$。`,
      ),
      answer,
      form: "integer",
      wrong: [other, y0, a + b, answer + 1],
      solution: t(
        `The equilibria are $${a}$ and $${b}$. At $y = ${y0}$, the derivative is ${sign}, so $y$ moves towards $${answer}$ and stops there.`,
        `平衡点是 $${a}$ 和 $${b}$。在 $y = ${y0}$ 处导数为${signZh}，所以 $y$ 向 $${answer}$ 移动并停在那里。`,
      ),
    });
  },
};

const isoclineOfSlope: KnowledgePointDef = {
  id: "the-isocline-of-a-given-slope",
  title: t("The isocline of a given slope", "给定斜率的等斜线"),
  explanation: t(
    "An isocline is the set of points where the slope field has one fixed value. Setting the right side of $y' = f(x, y)$ equal to a constant $m$ describes it, so no solving of the differential equation is needed. For a linear right side, each isocline is a straight line, and these lines are all parallel. Drawing a few of them, with short segments of the matching slope, is a fast way to sketch a field.",
    "等斜线是斜率场取同一固定值的点集。令 $y' = f(x, y)$ 的右边等于常数 $m$ 就描述了它，所以不需要解微分方程。对线性的右边，每条等斜线都是直线，而且彼此平行。画出其中几条，并标上相应斜率的短线段，是快速勾画斜率场的方法。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const m = nonzero(rng, 9);
    const answer = Q.of(m, b);
    return numberProblem({
      prompt: t(
        `For $y' = ${poly([a, "x"], [b, "y"])}$, the points where the slope field has slope $${m}$ form a line. Find its $y$-intercept.`,
        `对 $y' = ${poly([a, "x"], [b, "y"])}$，斜率场中斜率为 $${m}$ 的点构成一条直线。求它的 $y$ 轴截距。`,
      ),
      answer,
      wrong: [Q.of(m, a), Q.of(-m, b), Q.of(m), Q.of(m * b)],
      solution: t(
        `The line is $${poly([a, "x"], [b, "y"])} = ${m}$. Setting $x = 0$ gives $y = ${answer.toLatex()}$.`,
        `这条直线是 $${poly([a, "x"], [b, "y"])} = ${m}$。令 $x = 0$，得 $y = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tankTransient: KnowledgePointDef = {
  id: "the-transient-coefficient-of-a-mixing-tank",
  title: t("The transient coefficient of a mixing tank", "混合罐的瞬态系数"),
  explanation: t(
    "When brine flows in and out at the same rate, the amount of salt obeys a linear equation, and its solution has two parts. The constant part is the amount that the tank would hold at the concentration of the incoming brine. The other part is an exponential decay that carries the initial difference from this amount. Since it equals the whole difference at $t = 0$, its coefficient can be negative, if the tank starts with too little salt.",
    "当盐水以相同速率流入流出时，盐量服从线性方程，它的解有两部分。常数部分是罐内浓度等于流入盐水浓度时的盐量。另一部分是指数衰减，携带着初始时与这个量的差。由于它在 $t = 0$ 时等于全部差值，如果罐里起初盐太少，它的系数可以是负的。",
  ),
  generate(rng) {
    const volume = rng.int(2, 20) * 10;
    const c = rng.int(1, 6);
    const r = rng.int(1, 9);
    const start = rng.int(0, 40) * 10;
    const limit = c * volume;
    const answer = start - limit;
    return numberProblem({
      prompt: t(
        `A tank holds ${volume} L of water containing ${start} g of salt. Brine with ${c} g/L flows in at ${r} L/min, and the stirred mixture flows out at the same rate. The salt has the form $A(t) = M + Ke^{-kt}$. Find $K$.`,
        `一个罐装有 ${volume} L 水，含盐 ${start} g。浓度为 ${c} g/L 的盐水以 ${r} L/min 流入，搅拌后的混合液以相同速率流出。盐量的形式是 $A(t) = M + Ke^{-kt}$。求 $K$。`,
      ),
      answer,
      form: "integer",
      wrong: [start, limit, limit - start, c * r, answer + 10],
      solution: t(
        `The long-run amount is $M = ${c} \\cdot ${volume} = ${limit}$. At $t = 0$, $M + K = ${start}$, so $K = ${answer}$.`,
        `长期盐量是 $M = ${c} \\cdot ${volume} = ${limit}$。在 $t = 0$ 时，$M + K = ${start}$，所以 $K = ${answer}$。`,
      ),
    });
  },
};

const orthogonalThroughPoint: KnowledgePointDef = {
  id: "the-orthogonal-trajectory-through-a-point",
  title: t("The orthogonal trajectory through a point", "过一点的正交轨线"),
  explanation: t(
    "To find orthogonal trajectories, first remove the constant from the family. For $y = cx^n$, dividing gives $y' = \\frac{ny}{x}$, a slope that holds for every curve in the family. A curve crossing at right angles has the negative reciprocal slope, $y' = -\\frac{x}{ny}$. This equation is separable, and its solutions are ellipses. The initial point then fixes the particular ellipse, just as for any other family of solutions.",
    "求正交轨线时，先从曲线族中消去常数。对 $y = cx^n$，相除得 $y' = \\frac{ny}{x}$，这个斜率对族中每条曲线都成立。以直角相交的曲线有负倒数斜率 $y' = -\\frac{x}{ny}$。这个方程可分离变量，解是椭圆。然后由给定的点确定具体的椭圆，就像其他解族一样。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const answer = a * a + n * b * b;
    return numberProblem({
      prompt: t(
        `The orthogonal trajectory of the family $y = cx^{${n}}$ through $(${a}, ${b})$ has an equation $x^2 + py^2 = K$. Find $K$.`,
        `曲线族 $y = cx^{${n}}$ 过 $(${a}, ${b})$ 的正交轨线的方程是 $x^2 + py^2 = K$。求 $K$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * a + b * b, n * a * a + b * b, n * (a * a + b * b), answer + 1],
      solution: t(
        `Separating $y' = -\\frac{x}{${n}y}$ gives $x^2 + ${n}y^2 = K$. At the point, $K = ${a * a} + ${n} \\cdot ${b * b} = ${answer}$.`,
        `分离 $y' = -\\frac{x}{${n}y}$，得 $x^2 + ${n}y^2 = K$。在该点，$K = ${a * a} + ${n} \\cdot ${b * b} = ${answer}$。`,
      ),
    });
  },
};

const accelerationFromPower: KnowledgePointDef = {
  id: "the-acceleration-when-speed-is-a-power-of-position",
  title: t("The acceleration when speed is a power of position", "速度是位置的幂时的加速度"),
  explanation: t(
    "If velocity is given as a function of position, $\\frac{dv}{dx}$ alone is not the acceleration, because it measures the change per metre and not per second. The chain rule supplies the missing factor: $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$. So the acceleration at a point is the speed there times the slope of the velocity graph. The time never needs to appear in the calculation.",
    "如果速度是位置的函数，$\\frac{dv}{dx}$ 本身不是加速度，因为它度量的是每米而不是每秒的变化。链式法则补上缺少的因子：$a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$。所以一点处的加速度是该点的速度乘以速度图的斜率。计算中根本不需要出现时间。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(1, 3);
    const x0 = rng.int(1, 3);
    const velocity = k * x0 ** n;
    const slope = k * n * x0 ** (n - 1);
    const answer = velocity * slope;
    return numberProblem({
      prompt: t(
        `A particle moving along a line has velocity $v = ${k === 1 ? "" : k}${signedPower("x", n)}$ at position $x$. Find its acceleration at $x = ${x0}$.`,
        `沿直线运动的质点在位置 $x$ 的速度是 $v = ${k === 1 ? "" : k}${signedPower("x", n)}$。求它在 $x = ${x0}$ 处的加速度。`,
      ),
      answer,
      form: "integer",
      wrong: [slope, velocity, velocity * velocity, answer + 1],
      solution: t(
        `At $x = ${x0}$, $v = ${velocity}$ and $\\frac{dv}{dx} = ${slope}$. So $a = v\\frac{dv}{dx} = ${answer}$.`,
        `在 $x = ${x0}$ 处，$v = ${velocity}$，$\\frac{dv}{dx} = ${slope}$。所以 $a = v\\frac{dv}{dx} = ${answer}$。`,
      ),
    });
  },
};

const periodOfOrbit: KnowledgePointDef = {
  id: "the-period-of-a-larger-circular-orbit",
  title: t("The period of a larger circular orbit", "更大圆轨道的周期"),
  explanation: t(
    "For a circular orbit, gravity supplies the centripetal force, so $\\frac{GMm}{r^2} = \\frac{mv^2}{r}$, and the speed satisfies $v^2 = \\frac{GM}{r}$. One full turn takes $T = \\frac{2\\pi r}{v}$, and combining these gives $T^2 = \\frac{4\\pi^2 r^3}{GM}$. So the square of the period is proportional to the cube of the radius, which is Kepler's third law. Neither the mass of the satellite nor the value of $G$ matters in a comparison.",
    "对圆轨道，引力提供向心力，所以 $\\frac{GMm}{r^2} = \\frac{mv^2}{r}$，速度满足 $v^2 = \\frac{GM}{r}$。转一整圈需要 $T = \\frac{2\\pi r}{v}$，合起来得 $T^2 = \\frac{4\\pi^2 r^3}{GM}$。所以周期的平方与半径的立方成正比，这就是开普勒第三定律。做比较时，卫星的质量和 $G$ 的值都不起作用。",
  ),
  generate(rng) {
    const k = rng.int(2, 5);
    const period = rng.int(1, 12);
    const ratio = k * k;
    const answer = k ** 3 * period;
    return numberProblem({
      prompt: t(
        `Two satellites circle the same planet. The outer orbit has ${ratio} times the radius of the inner one, and the inner satellite has a period of ${period} hours. Find the period of the outer satellite, in hours.`,
        `两颗卫星绕同一行星运行。外轨道的半径是内轨道的 ${ratio} 倍，内侧卫星的周期是 ${period} 小时。求外侧卫星的周期（小时）。`,
      ),
      answer,
      form: "integer",
      wrong: [ratio * period, k * period, ratio * ratio * period, answer + 1],
      solution: t(
        `Since $T^2$ is proportional to $r^3$, the period is multiplied by $${ratio}^{3/2} = ${k ** 3}$. This gives $${answer}$ hours.`,
        `由于 $T^2$ 与 $r^3$ 成正比，周期乘以 $${ratio}^{3/2} = ${k ** 3}$。这样得 $${answer}$ 小时。`,
      ),
    });
  },
};

const initialCurrent: KnowledgePointDef = {
  id: "the-initial-current-of-a-charging-circuit",
  title: t("The initial current of a charging circuit", "充电电路的初始电流"),
  explanation: t(
    "In the equation $Rq' + \\frac{q}{C} = V$, an uncharged capacitor has $q = 0$ at the moment the switch closes, and so no voltage across it. The whole battery voltage then falls across the resistor, and $q'(0) = \\frac{V}{R}$. The capacitance does not enter, because it only matters once charge has built up. As charging goes on, the current falls towards zero, with time constant $RC$.",
    "在方程 $Rq' + \\frac{q}{C} = V$ 中，未充电的电容器在开关闭合瞬间 $q = 0$，所以两端没有电压。这时电池的全部电压都加在电阻上，$q'(0) = \\frac{V}{R}$。电容不出现，因为只有积累了电荷它才起作用。随着充电进行，电流趋于零，时间常数是 $RC$。",
  ),
  generate(rng) {
    const r = rng.int(2, 20);
    const v = rng.int(6, 24);
    const n = rng.int(2, 9);
    const answer = Q.of(v, r);
    return numberProblem({
      prompt: t(
        `An uncharged capacitor of $\\frac{1}{${n}}$ F, a resistor of ${r} Ω and a ${v} V battery are connected in series. Find the current, in amperes, at the moment the circuit is closed.`,
        `未充电的 $\\frac{1}{${n}}$ F 电容器、${r} Ω 电阻和 ${v} V 电池串联。求电路闭合瞬间的电流（安培）。`,
      ),
      answer,
      wrong: [Q.of(v, n), Q.of(v * r), Q.of(r, v), Q.of(0)],
      solution: t(
        `At first $q = 0$, so the equation gives $${r}q'(0) = ${v}$. Thus the current is $${answer.toLatex()}$ A.`,
        `起初 $q = 0$，所以方程给出 $${r}q'(0) = ${v}$。于是电流是 $${answer.toLatex()}$ A。`,
      ),
    });
  },
};

const operatorOnExponential: KnowledgePointDef = {
  id: "a-product-of-operators-on-an-exponential",
  title: t("A product of operators on an exponential", "算子之积作用于指数函数"),
  explanation: t(
    "Since $De^{cx} = ce^{cx}$, the operator $D - a$ acts on $e^{cx}$ simply by multiplying it by the number $c - a$. Applying a product of such operators then multiplies these numbers together, so a polynomial in $D$ acts on $e^{cx}$ as that polynomial evaluated at $c$. This is the reason the characteristic equation works. If $c$ is a root, the result is zero, and $e^{cx}$ solves the homogeneous equation.",
    "由于 $De^{cx} = ce^{cx}$，算子 $D - a$ 作用于 $e^{cx}$ 只是乘以数 $c - a$。于是这种算子之积作用时，就把这些数相乘，所以 $D$ 的多项式作用于 $e^{cx}$ 等于该多项式在 $c$ 处的值。这正是特征方程有效的原因。如果 $c$ 是根，结果为零，$e^{cx}$ 就是齐次方程的解。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const answer = (c - a) * (c - b);
    return numberProblem({
      prompt: t(
        `The operator $(${poly([1, "D"], [-a, ""])})(${poly([1, "D"], [-b, ""])})$ sends $e^{${exponentOf(c, "x")}}$ to $Ke^{${exponentOf(c, "x")}}$. Find $K$.`,
        `算子 $(${poly([1, "D"], [-a, ""])})(${poly([1, "D"], [-b, ""])})$ 把 $e^{${exponentOf(c, "x")}}$ 变成 $Ke^{${exponentOf(c, "x")}}$。求 $K$。`,
      ),
      answer,
      form: "integer",
      wrong: [c * c + a * b, (c + a) * (c + b), c - a + (c - b), answer + 1],
      solution: t(
        `Each factor $D - r$ multiplies the exponential by $${c} - r$. So $K = (${c} - ${inParens(a)})(${c} - ${inParens(b)}) = ${answer}$.`,
        `每个因子 $D - r$ 把指数函数乘以 $${c} - r$。所以 $K = (${c} - ${inParens(a)})(${c} - ${inParens(b)}) = ${answer}$。`,
      ),
    });
  },
};

const companionProduct: KnowledgePointDef = {
  id: "the-product-of-the-eigenvalues-of-a-companion-matrix",
  title: t("The product of the eigenvalues of a companion matrix", "友矩阵特征值之积"),
  explanation: t(
    "When $y''' + ay'' + by' + cy = 0$ is written as a system for $(y, y', y'')$, the eigenvalues of the matrix are the roots of $r^3 + ar^2 + br + c$. By Vieta's formulas, the product of three roots of a monic cubic is $-c$, and their sum is $-a$. For a matrix, these numbers are the determinant and the trace, so a quick check of the sign against the bottom row of the matrix is available.",
    "把 $y''' + ay'' + by' + cy = 0$ 写成 $(y, y', y'')$ 的方程组时，矩阵的特征值是 $r^3 + ar^2 + br + c$ 的根。由韦达定理，首一三次多项式三个根之积是 $-c$，和是 $-a$。对矩阵来说，这两个数就是行列式和迹，所以可以对照矩阵的最后一行快速检查符号。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 12);
    const answer = -c;
    return numberProblem({
      prompt: t(
        `The equation $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ is written as a system $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x} = (y, y', y'')$. Find the product of the eigenvalues of $A$.`,
        `方程 $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ 写成方程组 $\\mathbf{x}' = A\\mathbf{x}$，其中 $\\mathbf{x} = (y, y', y'')$。求 $A$ 的特征值之积。`,
      ),
      answer,
      form: "integer",
      wrong: [c, -a, -b, a, answer + 1],
      solution: t(
        `The eigenvalues are the roots of the cubic with constant term $${c}$. The product of its roots is the negative of this, which is $${answer}$.`,
        `特征值是常数项为 $${c}$ 的三次多项式的根。根之积是常数项的相反数，即 $${answer}$。`,
      ),
    });
  },
};

const oscillationRate: KnowledgePointDef = {
  id: "the-growth-rate-of-an-oscillating-system",
  title: t("The growth rate of an oscillating system", "振荡系统的增长率"),
  explanation: t(
    "When a real two-by-two matrix has complex eigenvalues $\\alpha \\pm i\\beta$, every solution of $\\mathbf{x}' = A\\mathbf{x}$ is $e^{\\alpha t}$ times a combination of a sine and a cosine. So $\\alpha$ alone decides whether the spiral grows, shrinks or closes. The two eigenvalues add to the trace of the matrix, and the imaginary parts cancel. Hence $\\alpha$ is half of the trace, and there is no need to solve a quadratic equation to find it.",
    "当实二阶矩阵有复特征值 $\\alpha \\pm i\\beta$ 时，$\\mathbf{x}' = A\\mathbf{x}$ 的每个解都是 $e^{\\alpha t}$ 乘以正弦和余弦的组合。所以只有 $\\alpha$ 决定螺线是增长、收缩还是闭合。两个特征值之和是矩阵的迹，虚部相消。因此 $\\alpha$ 是迹的一半，不必解二次方程。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const b = rng.int(1, 5);
    const m = Math.floor(((a - d) * (a - d)) / (4 * b)) + rng.int(1, 3);
    const flip = rng.pick([1, -1]);
    const answer = Q.of(a + d, 2);
    return numberProblem({
      prompt: t(
        `The matrix $A = ${matrix2(a, flip * b, -flip * m, d)}$ has complex eigenvalues. Every solution of $\\mathbf{x}' = A\\mathbf{x}$ is $e^{\\alpha t}$ times a bounded oscillation. Find $\\alpha$.`,
        `矩阵 $A = ${matrix2(a, flip * b, -flip * m, d)}$ 有复特征值。$\\mathbf{x}' = A\\mathbf{x}$ 的每个解都是 $e^{\\alpha t}$ 乘以有界振荡。求 $\\alpha$。`,
      ),
      answer,
      wrong: [Q.of(a + d), answer.neg(), Q.of(a * d + b * m), answer.add(Q.of(1))],
      solution: t(
        `The real part of the eigenvalues is half of the trace, so $\\alpha = \\frac{${inParens(a)} + ${inParens(d)}}{2} = ${answer.toLatex()}$.`,
        `特征值的实部是迹的一半，所以 $\\alpha = \\frac{${inParens(a)} + ${inParens(d)}}{2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const polynomialTransform: KnowledgePointDef = {
  id: "the-transform-of-a-polynomial-at-a-point",
  title: t("The transform of a polynomial at a point", "多项式的变换在一点的值"),
  explanation: t(
    "By linearity, a polynomial transforms one term at a time, using $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$. The factorial is the part that is easy to forget, since it does not appear for $1$ or $t$ and first matters at $t^2$. The power of $s$ is one more than the power of $t$. Once the transform is known as a function of $s$, its value at a point follows by substitution.",
    "由线性性，多项式逐项变换，用 $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$。阶乘这部分容易被忘记，因为对 $1$ 或 $t$ 它不出现，到 $t^2$ 才开始起作用。$s$ 的幂比 $t$ 的幂大一。知道了变换作为 $s$ 的函数之后，代入就得到它在一点的值。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 9);
    const s = rng.int(1, 4);
    const at = (x: number, y: number, z: number) =>
      Q.of(x, s)
        .add(Q.of(y, s * s))
        .add(Q.of(z, s ** 3));
    const fraction = (n: number, den: string) => `${n < 0 ? "-" : "+"} \\frac{${Math.abs(n)}}{${den}}`;
    const transform = `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{s} ${fraction(b, "s^2")} ${fraction(2 * c, "s^3")}`;
    const answer = at(a, b, 2 * c);
    return numberProblem({
      prompt: t(
        `Let $F(s)$ be the Laplace transform of $f(t) = ${poly([a, ""], [b, "t"], [c, "t^2"])}$. Find $F(${s})$.`,
        `设 $F(s)$ 是 $f(t) = ${poly([a, ""], [b, "t"], [c, "t^2"])}$ 的拉普拉斯变换。求 $F(${s})$。`,
      ),
      answer,
      wrong: [at(a, b, c), Q.of(a + b + c, s), answer.add(Q.of(1)), answer.sub(Q.of(1))],
      solution: t(
        `The transform is $${transform}$. At $s = ${s}$, this equals $${answer.toLatex()}$.`,
        `变换是 $${transform}$。在 $s = ${s}$ 处，它等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const powerTimesExponentialTransform: KnowledgePointDef = {
  id: "the-transform-of-a-power-times-an-exponential",
  title: t("The transform of a power times an exponential", "幂乘指数函数的变换"),
  explanation: t(
    "Multiplying by $t$ corresponds to taking $-\\frac{d}{ds}$ of the transform. Starting with $\\frac{1}{s - a}$ for $e^{at}$ and repeating this gives $\\frac{n!}{(s - a)^{n + 1}}$ for $t^n e^{at}$. Each derivative raises the power in the denominator by one, and brings down a factor that builds the factorial. The minus sign in the rule cancels the minus sign from differentiating, so the result is positive for $s > a$.",
    "乘以 $t$ 对应于对变换取 $-\\frac{d}{ds}$。从 $e^{at}$ 的 $\\frac{1}{s - a}$ 出发，反复这样做，就得到 $t^n e^{at}$ 的 $\\frac{n!}{(s - a)^{n + 1}}$。每次求导都把分母的幂升高一次，并带下一个构成阶乘的因子。法则中的负号抵消了求导产生的负号，所以当 $s > a$ 时结果为正。",
  ),
  generate(rng) {
    const n = rng.int(1, 3);
    const a = nonzero(rng, 3);
    const gap = rng.int(1, 4);
    const s = a + gap;
    const factorial = [1, 1, 2, 6][n] ?? 1;
    const answer = Q.of(factorial, gap ** (n + 1));
    const other = Math.abs(s + a) || 1;
    return numberProblem({
      prompt: t(
        `Find the Laplace transform of $${signedPower("t", n)}e^{${exponentOf(a, "t")}}$ at $s = ${s}$.`,
        `求 $${signedPower("t", n)}e^{${exponentOf(a, "t")}}$ 的拉普拉斯变换在 $s = ${s}$ 处的值。`,
      ),
      answer,
      wrong: [
        Q.of(1, gap ** (n + 1)),
        Q.of(factorial, gap ** n),
        Q.of(factorial, other ** (n + 1)),
        answer.add(Q.of(1)),
        Q.of(factorial, (gap + 1) ** (n + 1)),
        Q.of(factorial + 1, gap ** (n + 1)),
      ],
      solution: t(
        `The transform is $\\frac{${factorial}}{(${poly([1, "s"], [-a, ""])})^{${n + 1}}}$, and here $${poly([1, "s"], [-a, ""])} = ${gap}$. This gives $${answer.toLatex()}$.`,
        `变换是 $\\frac{${factorial}}{(${poly([1, "s"], [-a, ""])})^{${n + 1}}}$，这里 $${poly([1, "s"], [-a, ""])} = ${gap}$。于是得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const transformedNumerator: KnowledgePointDef = {
  id: "the-numerator-of-a-transformed-equation",
  title: t("The numerator of a transformed equation", "变换后方程的分子"),
  explanation: t(
    "Transforming $y'' + ay' + by = 0$ uses $\\mathcal{L}\\{y''\\} = s^2Y - sy(0) - y'(0)$ and $\\mathcal{L}\\{y'\\} = sY - y(0)$. Gathering the terms in $Y$ gives the characteristic polynomial as denominator, and the initial values all collect in the numerator. Notice that $y(0)$ appears twice, because the damping term contributes to the constant part. This extra product $ay(0)$ is the part of the numerator that is most often left out.",
    "变换 $y'' + ay' + by = 0$ 要用 $\\mathcal{L}\\{y''\\} = s^2Y - sy(0) - y'(0)$ 和 $\\mathcal{L}\\{y'\\} = sY - y(0)$。合并 $Y$ 的项后，分母是特征多项式，初值都集中在分子。注意 $y(0)$ 出现两次，因为阻尼项也贡献给常数部分。这个额外的乘积 $ay(0)$ 是分子中最常被遗漏的部分。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const p = nonzero(rng, 6);
    const q = nonzero(rng, 9);
    const answer = q + a * p;
    return numberProblem({
      prompt: t(
        `For $${poly([1, "y''"], [a, "y'"], [b, "y"])} = 0$ with $y(0) = ${p}$ and $y'(0) = ${q}$, the transform has the form $Y(s) = \\frac{As + K}{${poly([1, "s^2"], [a, "s"], [b, ""])}}$. Find $K$.`,
        `对 $${poly([1, "y''"], [a, "y'"], [b, "y"])} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$，变换的形式是 $Y(s) = \\frac{As + K}{${poly([1, "s^2"], [a, "s"], [b, ""])}}$。求 $K$。`,
      ),
      answer,
      form: "integer",
      wrong: [q, q - a * p, a * p, answer + 1, answer - 1],
      solution: t(
        `The numerator is $y(0)s + y'(0) + ay(0)$ with $a = ${a}$, so $K = ${q} + ${inParens(a)} \\cdot ${inParens(p)} = ${answer}$.`,
        `分子是 $y(0)s + y'(0) + ay(0)$，其中 $a = ${a}$，所以 $K = ${q} + ${inParens(a)} \\cdot ${inParens(p)} = ${answer}$。`,
      ),
    });
  },
};

const mixedEndEigenvalue: KnowledgePointDef = {
  id: "eigenvalues-with-one-fixed-end-and-one-free-end",
  title: t("Eigenvalues with one fixed end and one free end", "一端固定一端自由的特征值"),
  explanation: t(
    "For $y'' + \\lambda y = 0$ with $y(0) = 0$, the first condition leaves $y = \\sin(kx)$, where $k^2 = \\lambda$. The condition $y'(L) = 0$ then needs $\\cos(kL) = 0$, so $kL$ is an odd multiple of $\\frac{\\pi}{2}$. This differs from two fixed ends, where $kL$ is any multiple of $\\pi$. So the lowest mode fits only a quarter of a wave on the interval, and the eigenvalues involve the odd numbers only.",
    "对 $y'' + \\lambda y = 0$，$y(0) = 0$，第一个条件留下 $y = \\sin(kx)$，其中 $k^2 = \\lambda$。条件 $y'(L) = 0$ 又要求 $\\cos(kL) = 0$，所以 $kL$ 是 $\\frac{\\pi}{2}$ 的奇数倍。这与两端固定不同，那时 $kL$ 是 $\\pi$ 的任意整数倍。所以最低模式在区间上只有四分之一个波，特征值只涉及奇数。",
  ),
  generate(rng) {
    const n = rng.int(1, 4);
    const length = rng.int(1, 8);
    const odd = 2 * n - 1;
    const answer = Q.of(odd * odd, 4 * length * length);
    const en = ["smallest", "second smallest", "third smallest", "fourth smallest"][n - 1];
    const zh = ["最小的", "第二小的", "第三小的", "第四小的"][n - 1];
    return numberProblem({
      prompt: t(
        `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(${length}) = 0$, the ${en} eigenvalue is $c\\pi^2$. Find $c$.`,
        `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(${length}) = 0$，${zh}特征值是 $c\\pi^2$。求 $c$。`,
      ),
      answer,
      wrong: [
        Q.of(n * n, length * length),
        Q.of(odd * odd, length * length),
        Q.of((odd + 2) ** 2, 4 * length * length),
        Q.of(n * n, 4 * length * length),
        Q.of(odd * odd, 2 * length * length),
      ],
      solution: t(
        `Here $k \\cdot ${length} = \\frac{${odd === 1 ? "" : odd}\\pi}{2}$, so $\\lambda = k^2 = \\frac{${odd === 1 ? "" : odd * odd}\\pi^2}{${4 * length * length}}$. Thus $c = ${answer.toLatex()}$.`,
        `这里 $k \\cdot ${length} = \\frac{${odd === 1 ? "" : odd}\\pi}{2}$，所以 $\\lambda = k^2 = \\frac{${odd === 1 ? "" : odd * odd}\\pi^2}{${4 * length * length}}$。于是 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const loadedEndSlope: KnowledgePointDef = {
  id: "the-end-slope-of-a-loaded-boundary-value-problem",
  title: t("The end slope of a loaded boundary value problem", "受载边值问题的端点斜率"),
  explanation: t(
    "Integrating $y'' = c$ twice gives $y = \\frac{c}{2}x^2 + Ax + B$, with two constants that the boundary conditions must fix. Unlike an initial value problem, the slope at the left end is not given in advance: it is whatever makes the curve arrive correctly at the far end. With $y(0) = y(L) = 0$, the parabola is symmetric about the midpoint, so the two end slopes are equal and opposite.",
    "对 $y'' = c$ 积分两次，得 $y = \\frac{c}{2}x^2 + Ax + B$，两个常数由边界条件确定。与初值问题不同，左端的斜率不是预先给定的，它要使曲线正确到达另一端。当 $y(0) = y(L) = 0$ 时，抛物线关于中点对称，所以两端的斜率大小相等、方向相反。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const length = rng.int(1, 9);
    const answer = Q.of(-c * length, 2);
    return numberProblem({
      prompt: t(
        `Let $y'' = ${c}$ with $y(0) = 0$ and $y(${length}) = 0$. Find $y'(0)$.`,
        `设 $y'' = ${c}$，$y(0) = 0$，$y(${length}) = 0$。求 $y'(0)$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * length), Q.of(-c * length), Q.of(-c * length * length, 8)],
      solution: t(
        `The solution is $y = \\frac{c}{2}x(x - ${length})$ with $c = ${c}$. Differentiating at $x = 0$ gives $${answer.toLatex()}$.`,
        `解是 $y = \\frac{c}{2}x(x - ${length})$，其中 $c = ${c}$。在 $x = 0$ 处求导，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const airyCoefficient: KnowledgePointDef = {
  id: "a-series-coefficient-of-the-equation-y-double-prime-equals-xy",
  title: t("A series coefficient of the equation y'' = xy", "方程 y'' = xy 的级数系数"),
  explanation: t(
    "The equation $y'' = xy$ has no solutions in elementary functions, but a power series handles it well. Comparing coefficients of $x^n$ gives $(n + 2)(n + 1)a_{n + 2} = a_{n - 1}$, so each coefficient is tied to the one three places back. Two free constants, $a_0 = y(0)$ and $a_1 = y'(0)$, start two separate chains of coefficients, and the coefficient $a_2$ is zero, starting a third chain of zeros.",
    "方程 $y'' = xy$ 没有初等函数解，但幂级数能很好地处理它。比较 $x^n$ 的系数，得 $(n + 2)(n + 1)a_{n + 2} = a_{n - 1}$，所以每个系数与前面第三个系数相关。两个自由常数 $a_0 = y(0)$ 和 $a_1 = y'(0)$ 开始两条独立的系数链，系数 $a_2$ 为零，开始第三条全为零的链。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const b = nonzero(rng, 12);
    const cubic = rng.pick([true, false]);
    const power = cubic ? 3 : 4;
    const start = cubic ? a : b;
    const other = cubic ? b : a;
    const denominator = cubic ? 6 : 12;
    const answer = Q.of(start, denominator);
    return numberProblem({
      prompt: t(
        `The solution of $y'' = xy$ with $y(0) = ${a}$ and $y'(0) = ${b}$ has a power series about $x = 0$. Find the coefficient of $x^{${power}}$.`,
        `$y'' = xy$，$y(0) = ${a}$，$y'(0) = ${b}$ 的解在 $x = 0$ 处有幂级数。求 $x^{${power}}$ 的系数。`,
      ),
      answer,
      wrong: [Q.of(other, denominator), Q.of(start, power), Q.of(start, power - 1), Q.of(start, 2 * denominator)],
      solution: t(
        `Comparing coefficients gives $${power}\\cdot${power - 1}\\,a_{${power}} = a_{${power - 3}}$, and $a_{${power - 3}} = ${start}$. So $a_{${power}} = ${answer.toLatex()}$.`,
        `比较系数，得 $${power}\\cdot${power - 1}\\,a_{${power}} = a_{${power - 3}}$，且 $a_{${power - 3}} = ${start}$。所以 $a_{${power}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const indicialSum: KnowledgePointDef = {
  id: "the-sum-of-the-indicial-roots",
  title: t("The sum of the indicial roots", "指标根之和"),
  explanation: t(
    "For $x^2y'' + xP(x)y' + Q(x)y = 0$ with a regular singular point at the origin, only $p = P(0)$ and $q = Q(0)$ enter the indicial equation $r(r - 1) + pr + q = 0$. Written out, this is $r^2 + (p - 1)r + q = 0$, and by Vieta's formulas the roots add to $1 - p$. So $q$ and the higher terms of the coefficients play no part in the sum of the roots.",
    "对原点为正则奇点的 $x^2y'' + xP(x)y' + Q(x)y = 0$，只有 $p = P(0)$ 和 $q = Q(0)$ 进入指标方程 $r(r - 1) + pr + q = 0$。展开得 $r^2 + (p - 1)r + q = 0$，由韦达定理，两根之和是 $1 - p$。所以 $q$ 和系数的高次项对根之和都不起作用。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 9);
    const c = nonzero(rng, 5);
    const answer = 1 - p;
    return numberProblem({
      prompt: t(
        `Find the sum of the indicial roots at $x = 0$ of $x^2y'' + ${p === 1 ? "" : p === -1 ? "-" : p}xy' + (${poly([q, ""], [c, "x"])})y = 0$.`.replace(
          "+ -",
          "- ",
        ),
        `求 $x^2y'' + ${p === 1 ? "" : p === -1 ? "-" : p}xy' + (${poly([q, ""], [c, "x"])})y = 0$ 在 $x = 0$ 处的指标根之和。`.replace(
          "+ -",
          "- ",
        ),
      ),
      answer,
      form: "integer",
      wrong: [-p, p, p - 1, q, answer + 1],
      solution: t(
        `The indicial equation is $r(r - 1) + ${inParens(p)}r + ${inParens(q)} = 0$, in which $r$ has coefficient $${p - 1}$. So the roots add to $${answer}$.`,
        `指标方程是 $r(r - 1) + ${inParens(p)}r + ${inParens(q)} = 0$，其中 $r$ 的系数是 $${p - 1}$。所以两根之和是 $${answer}$。`,
      ),
    });
  },
};

const twoTrapezoidalSteps: KnowledgePointDef = {
  id: "two-trapezoidal-steps-for-pure-decay",
  title: t("Two trapezoidal steps for pure decay", "纯衰减的两个梯形步"),
  explanation: t(
    "For $y' = -ky$, the trapezoidal rule reads $y_{n + 1} = y_n + \\frac{h}{2}(-ky_n - ky_{n + 1})$. Although the method is implicit, this equation is linear in the new value, so it can be solved at once to give $y_{n + 1} = \\frac{2 - hk}{2 + hk}y_n$. Each step multiplies by the same factor, so two steps multiply by its square. The size of the factor is always below 1, which is why the method is stable.",
    "对 $y' = -ky$，梯形法则是 $y_{n + 1} = y_n + \\frac{h}{2}(-ky_n - ky_{n + 1})$。虽然方法是隐式的，但这个方程对新值是线性的，所以可以立即解出 $y_{n + 1} = \\frac{2 - hk}{2 + hk}y_n$。每一步都乘以同样的因子，所以两步乘以它的平方。因子的大小总小于 1，这就是这个方法稳定的原因。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const d = rng.pick([1, 2, 4]);
    const start = rng.int(1, 9);
    const top = 2 * d - k;
    const bottom = 2 * d + k;
    const factor = Q.of(top, bottom);
    const answer = factor.mul(factor).mul(Q.of(start));
    const forward = Q.of(d - k, d);
    return numberProblem({
      prompt: t(
        `Apply two steps of the trapezoidal method with $h = ${Q.of(1, d).toLatex()}$ to $y' = ${k === 1 ? "-" : `-${k}`}y$, $y(0) = ${start}$. Find the value it gives for $y(${Q.of(2, d).toLatex()})$.`,
        `对 $y' = ${k === 1 ? "-" : `-${k}`}y$，$y(0) = ${start}$，用 $h = ${Q.of(1, d).toLatex()}$ 的梯形法走两步。求它给出的 $y(${Q.of(2, d).toLatex()})$ 的值。`,
      ),
      answer,
      wrong: [factor.mul(Q.of(start)), forward.mul(forward).mul(Q.of(start)), Q.of(d * d * start, (d + k) * (d + k)), answer.add(Q.of(1))],
      solution: t(
        `Each step multiplies by $\\frac{2 - hk}{2 + hk} = ${factor.toLatex()}$. Two steps give $${start} \\cdot \\left(${factor.toLatex()}\\right)^2 = ${answer.toLatex()}$.`,
        `每一步乘以 $\\frac{2 - hk}{2 + hk} = ${factor.toLatex()}$。两步得 $${start} \\cdot \\left(${factor.toLatex()}\\right)^2 = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const invariantLineSlope: KnowledgePointDef = {
  id: "the-slope-of-a-straight-line-solution",
  title: t("The slope of a straight-line solution", "直线解的斜率"),
  explanation: t(
    "A trajectory through the origin that stays on a straight line must have velocity along that line at every point, so its direction is an eigenvector. For an upper triangular matrix, the eigenvalues can be read off the diagonal, and the $x$-axis is one of these lines. The other line comes from solving $(A - dI)\\mathbf{v} = \\mathbf{0}$ for the second eigenvalue $d$, whose first row gives the slope of the line directly.",
    "过原点且保持在直线上的轨线，在每一点的速度都必须沿这条直线，所以它的方向是特征向量。对上三角矩阵，特征值可以从对角线读出，$x$ 轴是其中一条直线。另一条直线由第二个特征值 $d$ 解 $(A - dI)\\mathbf{v} = \\mathbf{0}$ 得到，它的第一行直接给出直线的斜率。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = different(rng, -6, 6, a);
    const b = nonzero(rng, 6);
    const answer = Q.of(d - a, b);
    return numberProblem({
      prompt: t(
        `The system $\\mathbf{x}' = ${matrix2(a, b, 0, d)}\\mathbf{x}$ has solutions that stay on the $x$-axis, and also on one other line through the origin. Find the slope of that line.`,
        `方程组 $\\mathbf{x}' = ${matrix2(a, b, 0, d)}\\mathbf{x}$ 有保持在 $x$ 轴上的解，也有保持在另一条过原点直线上的解。求那条直线的斜率。`,
      ),
      answer,
      wrong: [Q.of(a - d, b), Q.of(b, d - a), Q.of(d - a), Q.of(d + a, b)],
      solution: t(
        `The eigenvalue $${d}$ has an eigenvector with $${poly([a - d, "x"], [b, "y"])} = 0$. This gives $\\frac{y}{x} = ${answer.toLatex()}$.`,
        `特征值 $${d}$ 的特征向量满足 $${poly([a - d, "x"], [b, "y"])} = 0$。于是 $\\frac{y}{x} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const bernoulliCoefficient: KnowledgePointDef = {
  id: "the-coefficient-after-a-bernoulli-substitution",
  title: t("The coefficient after a Bernoulli substitution", "伯努利代换后的系数"),
  explanation: t(
    "The substitution $v = y^{1 - n}$ turns $y' + py = qy^n$ into a linear equation. Dividing by $y^n$ gives $y^{-n}y' + py^{1 - n} = q$, and since $v' = (1 - n)y^{-n}y'$, multiplying by $1 - n$ gives $v' + (1 - n)pv = (1 - n)q$. Both the coefficient of $v$ and the new right side pick up the factor $1 - n$. For $n \\ge 2$, this factor is negative, which reverses the sign of the coefficient.",
    "代换 $v = y^{1 - n}$ 把 $y' + py = qy^n$ 变成线性方程。除以 $y^n$ 得 $y^{-n}y' + py^{1 - n} = q$，由于 $v' = (1 - n)y^{-n}y'$，再乘以 $1 - n$ 得 $v' + (1 - n)pv = (1 - n)q$。$v$ 的系数和新的右边都多了因子 $1 - n$。当 $n \\ge 2$ 时，这个因子是负的，使系数变号。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = rng.int(2, 9);
    const n = rng.int(2, 6);
    const answer = (1 - n) * p;
    return numberProblem({
      prompt: t(
        `The substitution $v = y^{${1 - n}}$ turns $${poly([1, "y'"], [p, "y"])} = ${q}y^{${n}}$ into a linear equation $v' + Kv = g$. Find $K$.`,
        `代换 $v = y^{${1 - n}}$ 把 $${poly([1, "y'"], [p, "y"])} = ${q}y^{${n}}$ 变成线性方程 $v' + Kv = g$。求 $K$。`,
      ),
      answer,
      form: "integer",
      wrong: [p, -answer, (1 - n) * q, n * p],
      solution: t(
        `Multiplying the equation by $(1 - n)y^{-n}$ with $n = ${n}$ gives $K = ${1 - n} \\cdot ${inParens(p)} = ${answer}$.`,
        `当 $n = ${n}$ 时，方程乘以 $(1 - n)y^{-n}$，得 $K = ${1 - n} \\cdot ${inParens(p)} = ${answer}$。`,
      ),
    });
  },
};

/** deeperDifferentialEquationsPoints gives, by topic id, the knowledge points added after a Differential Equations topic's own. */
export const deeperDifferentialEquationsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "exact-differential-equations": [levelThroughAPoint],
  "classifying-equilibrium-solutions-of-first-order-odes": [bifurcationValue],
  "logistic-growth-models-with-first-order-odes": [largestHarvest],
  "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values": [initialFromTwoReadings],
  "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems": [halfLifeFromReadings],
  "solving-the-logistic-growth-equation": [logisticAfterGrowthFactor],
  "falling-body-problems-with-quadratic-drag": [dragFromTerminal],
  "modeling-escape-velocity-with-first-order-odes": [escapeRatio],
  "linear-differential-operators": [annihilatorOrder],
  "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots": [boundedSlope],
  "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots": [peakWithRepeatedRoot],
  "second-order-homogeneous-odes-characteristic-equations-with-complex-roots": [firstZeroOfDampedOscillation],
  "second-order-inhomogeneous-odes-with-exponential-forcing": [forcingAtADoubleRoot],
  "simple-harmonic-oscillators": [frequencyFromStretch],
  "damped-oscillators": [quasiFrequency],
  "forced-oscillators": [beats],
  "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes": [criticalResistance],
  "equilibrium-points-and-stability-for-systems-of-odes": [stabilityThreshold],
  "phase-portraits-for-linear-systems-with-complex-eigenvalues": [parameterForCenter],
  "phase-portraits-for-linear-systems-with-repeated-eigenvalues": [parameterForRepeatedEigenvalue],
  "matrix-exponentials": [determinantOfExponential],
  "laplace-transforms-of-derivatives": [slopeFromTransform],
  "inverse-laplace-transforms": [convolutionOfPowers],
  "introduction-to-fourier-series": [sineCoefficientOfAStep],
  "introduction-to-recurrence-relations": [recurrenceGrowth],
  "error-in-numerical-methods": [richardson],
  "falling-body-problems-with-linear-drag": [timeConstantOfDrag],
  "modeling-rl-circuits-with-first-order-odes": [rateOfCurrent],
  "second-order-homogeneous-initial-value-problems": [conditionsAtLaterTime],
  "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots": [equationFromPowers],
  "cauchy-euler-equations-characteristic-equations-with-repeated-roots": [coefficientForRepeatedRoot],
  "cauchy-euler-equations-characteristic-equations-with-complex-roots": [coefficientFromOscillatingSolution],
  "reduction-of-order": [equationForMultiplier],
  "resonance-in-vibrating-systems": [springForResonance],
  "modeling-current-in-rcl-circuits-with-second-order-odes": [capacitanceForResonance],
  "the-first-shifting-theorem-of-laplace-transforms": [shiftedTransformAtPoint],
  "the-second-shifting-theorem-of-laplace-transforms": [stepOnUnshiftedFunction],
  "the-unit-step-function": [integralOfSteps],
  "laplace-transforms-of-integrals": [inverseDividedByS],
  "laplace-transforms-of-piecewise-continuous-functions": [periodicPulseTrain],
  "properties-of-fourier-series": [halfPeriodShift],
  "fourier-sine-series": [sineSeriesOfLinear],
  "fourier-cosine-series": [cosineSeriesOfQuadratic],
  "fourier-series-of-arbitrary-period": [harmonicFromFrequency],
  "convergence-of-fourier-series": [gibbsOvershoot],
  "eigenvalues-and-eigenfunctions-of-homogeneous-bvps": [countingEigenvalues],
  "the-implicit-euler-method": [severalImplicitSteps],
  "stability-of-numerical-methods": [stepWithoutOvershoot],
  "order-of-numerical-methods": [stepsForTargetError],
  "the-modified-euler-method": [midpointStep],
  "the-rk4-method": [rk4OfTime],
  "the-lotka-volterra-predator-prey-model": [harvestingBothSpecies],
  "power-series-solutions-of-differential-equations": [radiusOfConvergence],
  "modeling-mixture-problems-with-first-order-linear-odes": [rateWithChangingVolume],
  "bernoulli-differential-equations": [constantBernoulliSolution],
  "clairaut-differential-equations": [clairautLinesThroughPoint],
  "inhibited-growth-models-with-first-order-odes": [limitFromThreeReadings],
  "solving-first-order-odes-using-separation-of-variables": [blowUpTime],
  "general-solutions-of-first-order-linear-odes": [constantSolutionValue],
  "solving-first-order-linear-odes-with-exponential-forcing": [noTransientExponential],
  "solving-first-order-linear-odes-using-integrating-factors": [boundedAtOrigin],
  "homogeneous-functions": [eulerHomogeneous],
  "solving-exact-odes-using-integrating-factors": [powerMakingExact],
  "equilibrium-solutions-of-first-order-odes": [semistableLimit],
  "analyzing-slope-fields-for-nonautonomous-differential-equations": [isoclineOfSlope],
  "modeling-mixture-problems-with-first-order-separable-odes": [tankTransient],
  "orthogonal-trajectories": [orthogonalThroughPoint],
  "velocity-and-acceleration-as-functions-of-displacement": [accelerationFromPower],
  "newtons-law-of-universal-gravitation": [periodOfOrbit],
  "modeling-rc-circuits-with-first-order-odes": [initialCurrent],
  "differential-operators": [operatorOnExponential],
  "expressing-homogeneous-odes-as-first-order-systems": [companionProduct],
  "solving-homogeneous-systems-of-odes-with-complex-eigenvalues": [oscillationRate],
  "linearity-of-laplace-transforms": [polynomialTransform],
  "the-smoothness-property-of-laplace-transforms": [powerTimesExponentialTransform],
  "solving-second-order-odes-using-laplace-transforms": [transformedNumerator],
  "second-order-homogeneous-boundary-value-problems": [mixedEndEigenvalue],
  "second-order-inhomogeneous-boundary-value-problems": [loadedEndSlope],
  "taylor-series-solutions-of-differential-equations": [airyCoefficient],
  "the-method-of-frobenius": [indicialSum],
  "the-trapezoidal-method": [twoTrapezoidalSteps],
  "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues": [invariantLineSlope],
  "reducing-odes-to-first-order-linear-by-substitution": [bernoulliCoefficient],
};
