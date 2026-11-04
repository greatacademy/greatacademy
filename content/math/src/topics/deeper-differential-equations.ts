// Further knowledge points for topics of Differential Equations, each a skill the
// topic's own points leave out. See `deeperDifferentialEquationsPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

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
};
