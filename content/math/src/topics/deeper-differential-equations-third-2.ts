// Third knowledge points for thin topics of Differential Equations, from repeated
// eigenvalues to numerical methods: the reverse question, a harder case or a common trap.
// See `deeperDifferentialEquationsThird2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** expOf writes e to a multiple of a variable, leaving out a coefficient of 1. */
const expOf = (k: number, v = "t") => `e^{${k === 1 ? "" : k === -1 ? "-" : k}${v}}`;
/** mat writes a two by two matrix by rows. */
const mat = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** vec writes a column vector with two entries. */
const vec = (a: number | string, b: number | string) => `\\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}`;
/** angle writes a sine or cosine of a multiple of a variable, leaving out a multiple of 1. */
const angle = (fn: string, n: number, v: string) => `\\${fn} ${n === 1 ? "" : n}${v}`;

const pairedEigenvector = point(
  "the-eigenvector-paired-with-a-generalized-eigenvector",
  ["The eigenvector paired with a generalized eigenvector", "与广义特征向量配对的特征向量"],
  [
    "A defective system also has the solution $e^{\\lambda t}(t\\mathbf{v} + \\mathbf{w})$. It is easiest to choose $\\mathbf{w}$ first and compute $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$, which is automatically an eigenvector, because $(A - \\lambda I)^{2}$ is the zero matrix.",
    "亏损方程组还有解 $e^{\\lambda t}(t\\mathbf{v} + \\mathbf{w})$。最简单的做法是先选 $\\mathbf{w}$，再计算 $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$；它自动是特征向量，因为 $(A - \\lambda I)^{2}$ 是零矩阵。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const q = nz(rng, 4);
    const l = nz(rng, 6);
    const A = mat(l + p * q, p * p, -q * q, l - p * q);
    const useFirst = rng.bool();
    const w = useFirst ? vec(1, 0) : vec(0, 1);
    const v = useFirst ? [p * q, -q * q] : [p * p, -p * q];
    const firstEntry = rng.bool();
    const answer = (firstEntry ? v[0] : v[1]) as number;
    const raw = useFirst ? (firstEntry ? l + p * q : -q * q) : firstEntry ? p * p : l - p * q;
    const other = (firstEntry ? v[1] : v[0]) as number;
    const name: Pair = firstEntry ? ["first", "第一"] : ["second", "第二"];
    return ask(
      [
        `$A = ${A}$ has the repeated eigenvalue $${l}$ and is defective. For $\\mathbf{w} = ${w}$, find the ${name[0]} entry of $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$.`,
        `$A = ${A}$ 有重特征值 $${l}$，且是亏损的。对 $\\mathbf{w} = ${w}$，求 $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$ 的${name[1]}个分量。`,
      ],
      answer,
      [raw, -answer, other],
      [
        `Subtracting $${l}$ from the diagonal gives $A - \\lambda I = ${mat(p * q, p * p, -q * q, -p * q)}$. Multiplying by $\\mathbf{w}$ picks out a column, which is $\\mathbf{v} = ${vec(v[0] as number, v[1] as number)}$. So the entry is $${answer}$.`,
        `对角线减去 $${l}$，得 $A - \\lambda I = ${mat(p * q, p * p, -q * q, -p * q)}$。乘以 $\\mathbf{w}$ 就取出一列，即 $\\mathbf{v} = ${vec(v[0] as number, v[1] as number)}$。所以这个分量是 $${answer}$。`,
      ],
    );
  },
);

const exponentialForcingVector = point(
  "an-exponential-forcing-vector",
  ["An exponential forcing vector", "指数强迫向量"],
  [
    "For $\\mathbf{x}' = A\\mathbf{x} + e^{mt}\\mathbf{b}$, when $m$ is not an eigenvalue, try $\\mathbf{x}_{p} = e^{mt}\\mathbf{a}$. This gives $(mI - A)\\mathbf{a} = \\mathbf{b}$. The two entries are coupled, so a triangular system is solved from the bottom row up.",
    "对 $\\mathbf{x}' = A\\mathbf{x} + e^{mt}\\mathbf{b}$，当 $m$ 不是特征值时，设 $\\mathbf{x}_{p} = e^{mt}\\mathbf{a}$，得 $(mI - A)\\mathbf{a} = \\mathbf{b}$。两个分量是耦合的，所以三角形方程组要从最后一行向上解。",
  ],
  (rng) => {
    const alpha = nz(rng, 5);
    const delta = nz(rng, 5);
    const beta = nz(rng, 4);
    const m = rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== alpha && v !== delta));
    const a1 = nz(rng, 5);
    const a2 = nz(rng, 5);
    const f2 = (m - delta) * a2;
    const f1 = (m - alpha) * a1 - beta * a2;
    const e = expOf(m);
    const first = poly([alpha, "x_{1}"], [beta, "x_{2}"], [f1, e]);
    const second = poly([delta, "x_{2}"], [f2, e]);
    return ask(
      [
        `$x_{1}' = ${first}$, $x_{2}' = ${second}$ has a particular solution with $x_{1} = a_{1}${e}$ and $x_{2} = a_{2}${e}$. Find $a_{1}$.`,
        `$x_{1}' = ${first}$，$x_{2}' = ${second}$ 有一个特解，其中 $x_{1} = a_{1}${e}$，$x_{2} = a_{2}${e}$。求 $a_{1}$。`,
      ],
      a1,
      [Q.of(f1, m - alpha), -a1, a2],
      [
        `The second equation gives $${poly([m - delta, "a_{2}"])} = ${f2}$, so $a_{2} = ${a2}$. The first gives $${poly([m - alpha, "a_{1}"], [-beta * a2, ""])} = ${f1}$, so $a_{1} = ${a1}$.`,
        `第二个方程给出 $${poly([m - delta, "a_{2}"])} = ${f2}$，所以 $a_{2} = ${a2}$。第一个方程给出 $${poly([m - alpha, "a_{1}"], [-beta * a2, ""])} = ${f1}$，所以 $a_{1} = ${a1}$。`,
      ],
    );
  },
);

const nullcline = point(
  "the-line-where-trajectories-turn",
  ["The line where trajectories turn", "轨线转向的直线"],
  [
    "A nullcline organizes a phase portrait. Trajectories have horizontal tangents where $y' = 0$ and vertical tangents where $x' = 0$. It is easy to swap these: the horizontal crossings come from the equation for $y'$, not the one for $x'$.",
    "零斜线帮助整理相图。轨线在 $y' = 0$ 处切线水平，在 $x' = 0$ 处切线竖直。这两者容易弄反：水平穿越来自 $y'$ 的方程，而不是 $x'$ 的方程。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const c = nz(rng, 6);
    const d0 = nz(rng, 6);
    const d = a * d0 === b * c ? -d0 : d0;
    const horizontal = rng.bool();
    const answer = horizontal ? Q.of(-c, d) : Q.of(-a, b);
    const other = horizontal ? Q.of(-a, b) : Q.of(-c, d);
    const name: Pair = horizontal ? ["horizontal", "水平"] : ["vertical", "竖直"];
    const eq = horizontal ? poly([c, "x"], [d, "y"]) : poly([a, "x"], [b, "y"]);
    return ask(
      [
        `For $x' = ${poly([a, "x"], [b, "y"])}$, $y' = ${poly([c, "x"], [d, "y"])}$, trajectories have ${name[0]} tangents along a line through the origin. Find its slope.`,
        `对 $x' = ${poly([a, "x"], [b, "y"])}$，$y' = ${poly([c, "x"], [d, "y"])}$，轨线沿一条过原点的直线切线${name[1]}。求这条直线的斜率。`,
      ],
      answer,
      [other, answer.neg(), other.neg()],
      [
        `${horizontal ? "A horizontal tangent needs $y' = 0$" : "A vertical tangent needs $x' = 0$"}, so $${eq} = 0$. Solving for $y$ gives the slope $${answer.toLatex()}$.`,
        `${horizontal ? "切线水平要求 $y' = 0$" : "切线竖直要求 $x' = 0$"}，所以 $${eq} = 0$。解出 $y$，得斜率 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const limitOnEquilibriumLine = point(
  "where-a-trajectory-lands-on-the-line-of-equilibria",
  ["Where a trajectory lands on the line of equilibria", "轨线落在平衡线上的位置"],
  [
    "When one eigenvalue is zero and the other is negative, each solution runs along a straight line to a point of the line of equilibria. A conserved combination of the variables tells which point, without solving the system.",
    "当一个特征值为零、另一个为负时，每个解都沿一条直线走到平衡线上的某一点。变量的一个守恒组合可以告诉我们是哪一点，无需解方程组。",
  ],
  (rng) => {
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const x0 = rng.int(-9, 9);
    const y0 = x0 + nz(rng, 8);
    const total = q * x0 + p * y0;
    const answer = Q.of(total, p + q);
    const combo = poly([q, "x"], [p, "y"]);
    return ask(
      [
        `For $x' = ${poly([-p, "x"], [p, "y"])}$, $y' = ${poly([q, "x"], [-q, "y"])}$ with $x(0) = ${x0}$ and $y(0) = ${y0}$, find the limit of $x(t)$ as $t \\to \\infty$.`,
        `对 $x' = ${poly([-p, "x"], [p, "y"])}$，$y' = ${poly([q, "x"], [-q, "y"])}$，且 $x(0) = ${x0}$，$y(0) = ${y0}$，求 $t \\to \\infty$ 时 $x(t)$ 的极限。`,
      ],
      answer,
      [Q.of(x0 + y0, 2), x0, y0, Q.of(p * x0 + q * y0, p + q)],
      [
        `The eigenvalues are $0$ and $${-(p + q)}$, and every point of the line $y = x$ is an equilibrium. The combination $${combo}$ has zero derivative, so it stays at $${total}$. On $y = x$ this gives $${p + q}x = ${total}$, so the limit is $${answer.toLatex()}$.`,
        `特征值是 $0$ 和 $${-(p + q)}$，直线 $y = x$ 上每一点都是平衡点。组合 $${combo}$ 的导数为零，所以保持为 $${total}$。在 $y = x$ 上，得 $${p + q}x = ${total}$，所以极限是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const shiftedInitial = point(
  "the-initial-condition-shifts-too",
  ["The initial condition shifts too", "初始条件也要平移"],
  [
    "Shifting to $u = x - x_{*}$ removes the constant from the equation, but the initial value changes as well, to $u(0) = x(0) - x_{*}$. So the decay applies to the distance from equilibrium, and the equilibrium is added back at the end.",
    "平移到 $u = x - x_{*}$ 消去了方程中的常数，但初值也变了，成为 $u(0) = x(0) - x_{*}$。所以衰减作用于到平衡点的距离，最后还要把平衡值加回来。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const xs = nz(rng, 9);
    const d = 2 * nz(rng, 6);
    const x0 = xs + d;
    const T = k === 1 ? "\\ln 2" : `\\frac{\\ln 2}{${k}}`;
    const answer = xs + d / 2;
    return ask(
      [
        `Solve $x' = ${poly([-k, "x"], [k * xs, ""])}$ with $x(0) = ${x0}$, and find $x(${T})$.`,
        `解 $x' = ${poly([-k, "x"], [k * xs, ""])}$，$x(0) = ${x0}$，并求 $x(${T})$。`,
      ],
      answer,
      [Q.of(x0, 2), xs, Q.of(x0, 2).add(Q.of(xs))],
      [
        `The equilibrium is $${xs}$, so $u = x - ${paren(xs)}$ has $u(0) = ${d}$ and $u = ${d}${expOf(-k)}$. At this time $u = ${d / 2}$, so $x = ${answer}$.`,
        `平衡点是 $${xs}$，所以 $u = x - ${paren(xs)}$ 满足 $u(0) = ${d}$，$u = ${d}${expOf(-k)}$。此时 $u = ${d / 2}$，所以 $x = ${answer}$。`,
      ],
    );
  },
);

const classifyEquilibrium = point(
  "classifying-an-equilibrium-by-its-jacobian",
  ["Classifying an equilibrium by its Jacobian", "由雅可比矩阵判断平衡点类型"],
  [
    "The Jacobian at an equilibrium decides its type when no eigenvalue has zero real part. A negative determinant means a saddle. A positive determinant with a negative trace means that both eigenvalues have negative real part, so the equilibrium is stable.",
    "当没有特征值的实部为零时，平衡点处的雅可比矩阵决定其类型。行列式为负表示鞍点。行列式为正且迹为负，表示两个特征值的实部都为负，所以平衡点稳定。",
  ],
  (rng) => {
    const s = rng.pick([-1, 1]);
    const m = rng.int(1, 6);
    const d = rng.int(1, 6);
    const star = rng.pick([-m, m]);
    const det = -2 * s * star;
    const saddle: Pair = ["A saddle, which is unstable", "鞍点，不稳定"];
    const stable: Pair = ["Stable, with both eigenvalues having negative real part", "稳定，两个特征值的实部都为负"];
    const source: Pair = ["Unstable, with both eigenvalues having positive real part", "不稳定，两个特征值的实部都为正"];
    const center: Pair = ["A center, with purely imaginary eigenvalues", "中心，特征值是纯虚数"];
    const correct = det < 0 ? saddle : stable;
    const system = `x' = y$, $y' = ${poly([s, "x^{2}"], [-s * m * m, ""], [-d, "y"])}`;
    const systemZh = `x' = y$，$y' = ${poly([s, "x^{2}"], [-s * m * m, ""], [-d, "y"])}`;
    const J = mat(0, 1, 2 * s * star, -d);
    return choose(
      rng,
      [`What type of equilibrium does $${system}$ have at $(${star}, 0)$?`, `$${systemZh}$ 在 $(${star}, 0)$ 处的平衡点是什么类型？`],
      correct,
      [saddle, stable, source, center].filter((o) => o !== correct),
      [
        `The Jacobian there is $${J}$, with determinant $${det}$ and trace $${-d}$. ${det < 0 ? "A negative determinant gives real eigenvalues of opposite signs." : "A positive determinant and a negative trace make both real parts negative."}`,
        `该处的雅可比矩阵是 $${J}$，行列式是 $${det}$，迹是 $${-d}$。${det < 0 ? "行列式为负，特征值是异号实数。" : "行列式为正且迹为负，两个实部都为负。"}`,
      ],
    );
  },
);

const coefficientsFromFundamental = point(
  "the-coefficients-for-an-initial-condition",
  ["The coefficients for an initial condition", "满足初始条件的系数"],
  [
    "Every solution is $\\mathbf{x}(t) = \\Phi(t)\\mathbf{c}$, and the initial condition requires $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$. This is a linear system for the coefficients. Note that $\\Phi(0)$ need not be the identity, so $\\mathbf{c}$ is usually not $\\mathbf{x}(0)$ itself.",
    "每个解都是 $\\mathbf{x}(t) = \\Phi(t)\\mathbf{c}$，初始条件要求 $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$。这是关于系数的线性方程组。注意 $\\Phi(0)$ 不一定是单位矩阵，所以 $\\mathbf{c}$ 通常不等于 $\\mathbf{x}(0)$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a));
    const p = nz(rng, 4);
    const q = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== p));
    const c1 = nz(rng, 6);
    const c2 = nz(rng, 6);
    const x0 = c1 + c2;
    const y0 = p * c1 + q * c2;
    const useFirst = rng.bool();
    const answer = useFirst ? c1 : c2;
    const phi = mat(expOf(a), expOf(b), poly([p, expOf(a)]), poly([q, expOf(b)]));
    const name = useFirst ? "c_{1}" : "c_{2}";
    return ask(
      [
        `A fundamental matrix of a system is $\\Phi(t) = ${phi}$. The solution with $\\mathbf{x}(0) = ${vec(x0, y0)}$ is $\\Phi(t)${vec("c_{1}", "c_{2}")}$. Find $${name}$.`,
        `一个方程组的基本矩阵是 $\\Phi(t) = ${phi}$。满足 $\\mathbf{x}(0) = ${vec(x0, y0)}$ 的解是 $\\Phi(t)${vec("c_{1}", "c_{2}")}$。求 $${name}$。`,
      ],
      answer,
      [useFirst ? c2 : c1, -answer, useFirst ? x0 : y0],
      [
        `At $t = 0$ the exponentials are $1$, so $c_{1} + c_{2} = ${x0}$ and $${poly([p, "c_{1}"], [q, "c_{2}"])} = ${y0}$. Solving gives $c_{1} = ${c1}$ and $c_{2} = ${c2}$.`,
        `在 $t = 0$ 处，指数函数都等于 $1$，所以 $c_{1} + c_{2} = ${x0}$，$${poly([p, "c_{1}"], [q, "c_{2}"])} = ${y0}$。解得 $c_{1} = ${c1}$，$c_{2} = ${c2}$。`,
      ],
    );
  },
);

const exponentialOfJordan = point(
  "the-matrix-exponential-is-not-taken-entry-by-entry",
  ["The matrix exponential is not taken entry by entry", "矩阵指数不是逐个元素取指数"],
  [
    "Writing $A = \\lambda I + N$ with $N^{2}$ zero gives $e^{At} = e^{\\lambda t}(I + tN)$, since $\\lambda I$ commutes with $N$. So the upper entry is $bte^{\\lambda t}$. Taking the exponential of each entry would be wrong.",
    "把 $A$ 写成 $\\lambda I + N$，其中 $N^{2}$ 为零，由于 $\\lambda I$ 与 $N$ 可交换，得 $e^{At} = e^{\\lambda t}(I + tN)$。所以右上元素是 $bte^{\\lambda t}$。对每个元素分别取指数是错误的。",
  ],
  (rng) => {
    const l = rng.pick([-2, -1, 1, 2, 3]);
    const b = nz(rng, 9);
    const scale = Q.of(2).pow(l);
    const answer = scale.mul(Q.of(b));
    const A = mat(l, b, 0, l);
    return ask(
      [
        `For $A = ${A}$, the upper right entry of $e^{At}$ at $t = \\ln 2$ is $k\\ln 2$. Find $k$.`,
        `对 $A = ${A}$，$e^{At}$ 在 $t = \\ln 2$ 处的右上元素是 $k\\ln 2$。求 $k$。`,
      ],
      answer,
      [b, scale, l * b],
      [
        `$e^{At} = ${expOf(l)}${mat(1, "bt", 0, 1)}$ with $b = ${b}$, so the entry is $${poly([b, `t${expOf(l)}`])}$. At $t = \\ln 2$ we have $${expOf(l)} = ${scale.toLatex()}$, so $k = ${answer.toLatex()}$.`,
        `$e^{At} = ${expOf(l)}${mat(1, "bt", 0, 1)}$，其中 $b = ${b}$，所以该元素是 $${poly([b, `t${expOf(l)}`])}$。在 $t = \\ln 2$ 处，$${expOf(l)} = ${scale.toLatex()}$，所以 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const integralOfExponentialMatrix = point(
  "constant-forcing-through-the-matrix-exponential",
  ["Constant forcing through the matrix exponential", "通过矩阵指数处理常数强迫"],
  [
    "With zero initial state and constant forcing, $\\mathbf{x}(t) = \\int_{0}^{t} e^{As}\\mathbf{g} \\, ds$. For a diagonal $A$ each entry is an ordinary integral, giving $\\frac{g}{a}(e^{at} - 1)$. Both the factor $\\frac{1}{a}$ and the $-1$ from the lower limit are easy to lose.",
    "零初始状态、常数强迫时，$\\mathbf{x}(t) = \\int_{0}^{t} e^{As}\\mathbf{g} \\, ds$。对角矩阵 $A$ 的每个分量都是普通积分，得 $\\frac{g}{a}(e^{at} - 1)$。因子 $\\frac{1}{a}$ 和下限带来的 $-1$ 都容易丢失。",
  ],
  (rng) => {
    const a = rng.pick([-2, -1, 1, 2, 3]);
    const d = nz(rng, 4);
    const g = nz(rng, 12);
    const h = nz(rng, 12);
    const pow = Q.of(2).pow(a);
    const growth = pow.sub(Q.of(1));
    const answer = Q.of(g, a).mul(growth);
    const A = mat(a, 0, 0, d);
    return ask(
      [
        `Solve $\\mathbf{x}' = ${A}\\mathbf{x} + ${vec(g, h)}$ with $\\mathbf{x}(0) = \\mathbf{0}$, and find $x_{1}(\\ln 2)$.`,
        `解 $\\mathbf{x}' = ${A}\\mathbf{x} + ${vec(g, h)}$，$\\mathbf{x}(0) = \\mathbf{0}$，并求 $x_{1}(\\ln 2)$。`,
      ],
      answer,
      [Q.of(g).mul(pow), Q.of(g, a).mul(pow), Q.of(g).mul(growth)],
      [
        `$x_{1}(t) = \\int_{0}^{t} ${poly([g, expOf(a, "s")])} \\, ds = ${poly([Q.of(g, a), `\\left(${expOf(a)} - 1\\right)`])}$. At $t = \\ln 2$ we have $${expOf(a)} = ${pow.toLatex()}$, so $x_{1} = ${answer.toLatex()}$.`,
        `$x_{1}(t) = \\int_{0}^{t} ${poly([g, expOf(a, "s")])} \\, ds = ${poly([Q.of(g, a), `\\left(${expOf(a)} - 1\\right)`])}$。在 $t = \\ln 2$ 处，$${expOf(a)} = ${pow.toLatex()}$，所以 $x_{1} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const vopNonDiagonal = point(
  "variation-of-parameters-with-a-non-diagonal-fundamental-matrix",
  ["Variation of parameters with a non-diagonal fundamental matrix", "基本矩阵非对角时的参数变易"],
  [
    "When $\\Phi$ is not diagonal, $\\Phi\\mathbf{u}' = \\mathbf{g}$ couples the parameters. With a triangular $\\Phi$, solve the bottom row first. The first parameter then has a term that depends on $t$, and it must be integrated rather than treated as a constant.",
    "当 $\\Phi$ 不是对角矩阵时，$\\Phi\\mathbf{u}' = \\mathbf{g}$ 使参数耦合。$\\Phi$ 是三角矩阵时，先解最后一行。于是第一个参数含有依赖 $t$ 的项，必须积分，不能当作常数。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const f1 = nz(rng, 9);
    const f2 = 2 * nz(rng, 6);
    const T = rng.int(1, 4);
    const answer = f1 * T - (f2 * T * T) / 2;
    const e = expOf(a);
    const phi = mat(e, `t${e}`, 0, e);
    const g = vec(poly([f1, e]), poly([f2, e]));
    const uPrime = poly([f1, ""], [-f2, "t"]);
    return ask(
      [
        `$\\Phi(t) = ${phi}$ is a fundamental matrix, and $\\mathbf{g}(t) = ${g}$. Solving $\\Phi\\mathbf{u}' = \\mathbf{g}$ with $\\mathbf{u}(0) = \\mathbf{0}$, find $u_{1}(${T})$.`,
        `$\\Phi(t) = ${phi}$ 是基本矩阵，$\\mathbf{g}(t) = ${g}$。解 $\\Phi\\mathbf{u}' = \\mathbf{g}$，$\\mathbf{u}(0) = \\mathbf{0}$，求 $u_{1}(${T})$。`,
      ],
      answer,
      [f1 * T, f1 * T + (f2 * T * T) / 2, f1 - f2 * T],
      [
        `The bottom row gives $u_{2}' = ${f2}$, and only this derivative is needed. The top row gives $u_{1}' + tu_{2}' = ${f1}$, so $u_{1}' = ${uPrime}$. Integrating from $0$ to $${T}$ gives $${answer}$.`,
        `最后一行给出 $u_{2}' = ${f2}$。第一行给出 $u_{1}' + tu_{2}' = ${f1}$，所以 $u_{1}' = ${uPrime}$。从 $0$ 积分到 $${T}$，得 $${answer}$。`,
      ],
    );
  },
);

const criticalCapacity = point(
  "the-carrying-capacity-that-predators-need",
  ["The carrying capacity that predators need", "捕食者所需的环境容量"],
  [
    "With logistic prey, coexistence needs the prey level $x_{*}$ that holds predators steady to be below the carrying capacity $K$. The predator level is $y_{*} = \\frac{r}{a}\\left(1 - \\frac{x_{*}}{K}\\right)$, so it falls to zero when $K$ reaches $x_{*}$, and predators die out below that.",
    "猎物为逻辑斯谛增长时，共存要求使捕食者保持稳定的猎物水平 $x_{*}$ 低于环境容量 $K$。捕食者水平是 $y_{*} = \\frac{r}{a}\\left(1 - \\frac{x_{*}}{K}\\right)$，所以当 $K$ 降到 $x_{*}$ 时它降为零，低于这个值捕食者就会灭绝。",
  ],
  (rng) => {
    const r = rng.int(2, 9);
    const a = rng.int(1, 6);
    const c = rng.int(2, 12);
    const d = rng.int(1, 5);
    const answer = Q.of(c, d);
    const first = `x' = ${r}x\\left(1 - \\frac{x}{K}\\right) - ${poly([a, "xy"])}`;
    const second = `y' = ${poly([-c, "y"], [d, "xy"])}`;
    return ask(
      [
        `For $${first}$, $${second}$, the coexistence level of predators falls as $K$ falls. Find the value of $K$ at which it reaches zero.`,
        `对 $${first}$，$${second}$，当 $K$ 减小时，共存时的捕食者水平下降。求它降到零时的 $K$。`,
      ],
      answer,
      [Q.of(d, c), c, Q.of(r, a)],
      [
        `Setting $y' = 0$ with $y > 0$ gives $x_{*} = ${answer.toLatex()}$. The prey equation then gives $y_{*} = ${Q.of(r, a).toLatex()}\\left(1 - \\frac{x_{*}}{K}\\right)$, which is zero exactly at $K = ${answer.toLatex()}$.`,
        `令 $y' = 0$ 且 $y > 0$，得 $x_{*} = ${answer.toLatex()}$。猎物方程给出 $y_{*} = ${Q.of(r, a).toLatex()}\\left(1 - \\frac{x_{*}}{K}\\right)$，恰好在 $K = ${answer.toLatex()}$ 时为零。`,
      ],
    );
  },
);

const cornerJump = point(
  "a-corner-is-a-jump-in-the-derivative",
  ["A corner is a jump in the derivative", "尖角是导数的跳跃"],
  [
    "A piecewise smooth function can be continuous and still have a corner. Then the function has no jump, but its derivative does, and the size of that jump is the right-hand derivative minus the left-hand derivative at the joining point.",
    "分段光滑的函数可以连续却仍有尖角。这时函数本身没有跳跃，但导数有，跳跃的大小等于连接点处的右导数减去左导数。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const T = rng.int(1, 4);
    const q = rng.int(-9, 9);
    const r0 = nz(rng, 9);
    const r = r0 === 2 * p * T ? r0 + 1 : r0;
    const s = p * T * T + q - r * T;
    const left = poly([p, "t^{2}"], [q, ""]);
    const right = poly([r, "t"], [s, ""]);
    const f = `f(t) = \\begin{cases} ${left}, & 0 \\le t < ${T} \\\\ ${right}, & t \\ge ${T} \\end{cases}`;
    const answer = r - 2 * p * T;
    return ask(
      [
        `The function $${f}$ is continuous at $t = ${T}$. Find the jump of $f'$ there, right value minus left value.`,
        `函数 $${f}$ 在 $t = ${T}$ 处连续。求 $f'$ 在该处的跳跃（右值减左值）。`,
      ],
      answer,
      [-answer, r - p * T, r],
      [
        `On the left $f'(t) = ${poly([2 * p, "t"])}$, which tends to $${2 * p * T}$. On the right $f'(t) = ${r}$. So the jump is $${r} - ${paren(2 * p * T)} = ${answer}$.`,
        `左边 $f'(t) = ${poly([2 * p, "t"])}$，趋于 $${2 * p * T}$。右边 $f'(t) = ${r}$。所以跳跃是 $${r} - ${paren(2 * p * T)} = ${answer}$。`,
      ],
    );
  },
);

const transformOfT = point(
  "the-transform-of-t-from-the-definition",
  ["The transform of t from the definition", "由定义求 t 的变换"],
  [
    "The definition also handles a factor of $t$, through integration by parts: $\\int_{0}^{\\infty} te^{-kt} \\, dt = \\frac{1}{k^{2}}$ for $k > 0$. An exponential factor just shifts $s$, so the combined rate is $k = s - a$, and the exponent of the denominator is $2$, not $1$.",
    "定义也能处理因子 $t$，用分部积分：当 $k > 0$ 时，$\\int_{0}^{\\infty} te^{-kt} \\, dt = \\frac{1}{k^{2}}$。指数因子只是平移 $s$，所以合起来的速率是 $k = s - a$，分母的指数是 $2$，而不是 $1$。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const a = rng.int(-3, 3);
    const k = rng.int(2, 5);
    const s = a + k;
    const answer = Q.of(c, k * k);
    const integrand = poly([c, a === 0 ? "t" : `t${expOf(a)}`]);
    return ask(
      [
        `Evaluate $\\int_{0}^{\\infty} ${integrand}e^{-st} \\, dt$ at $s = ${s}$.`,
        `当 $s = ${s}$ 时，求 $\\int_{0}^{\\infty} ${integrand}e^{-st} \\, dt$。`,
      ],
      answer,
      [Q.of(c, k), Q.of(c, k * k * k), answer.neg()],
      [
        `The exponentials combine into $${expOf(-k)}$. Integration by parts gives $\\int_{0}^{\\infty} t${expOf(-k)} \\, dt = \\frac{1}{${k * k}}$, so the value is $${answer.toLatex()}$.`,
        `指数函数合并为 $${expOf(-k)}$。分部积分得 $\\int_{0}^{\\infty} t${expOf(-k)} \\, dt = \\frac{1}{${k * k}}$，所以值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const transformValue = point(
  "the-initial-value-in-the-transformed-equation",
  ["The initial value in the transformed equation", "变换后方程中的初值"],
  [
    "The rule $\\mathcal{L}\\{y'\\} = sY - y(0)$ brings the initial value in as a term of the algebra. So for $y' + ky = c$, $Y(s) = \\frac{y(0) + c/s}{s + k}$. Dropping $y(0)$ gives the response from rest, which is a different function.",
    "规则 $\\mathcal{L}\\{y'\\} = sY - y(0)$ 把初值作为代数项带入。所以对 $y' + ky = c$，$Y(s) = \\frac{y(0) + c/s}{s + k}$。漏掉 $y(0)$ 得到的是从静止开始的响应，那是另一个函数。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const c = nz(rng, 12);
    const y0 = nz(rng, 9);
    const s = rng.int(1, 5);
    const forcing = Q.of(c, s);
    const denom = Q.of(s + k);
    const answer = Q.of(y0).add(forcing).div(denom);
    return ask(
      [
        `For $${poly([1, "y'"], [k, "y"])} = ${c}$ with $y(0) = ${y0}$, find the value of the Laplace transform $Y(s)$ at $s = ${s}$.`,
        `对 $${poly([1, "y'"], [k, "y"])} = ${c}$，$y(0) = ${y0}$，求拉普拉斯变换 $Y(s)$ 在 $s = ${s}$ 处的值。`,
      ],
      answer,
      [forcing.div(denom), forcing.sub(Q.of(y0)).div(denom), Q.of(y0 + c).div(denom)],
      [
        `Transforming gives $(s + ${k})Y - ${paren(y0)} = \\frac{${c}}{s}$. So $Y(${s}) = \\frac{${y0} + ${paren(forcing)}}{${s + k}} = ${answer.toLatex()}$.`,
        `变换后得 $(s + ${k})Y - ${paren(y0)} = \\frac{${c}}{s}$。所以 $Y(${s}) = \\frac{${y0} + ${paren(forcing)}}{${s + k}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const afterSwitchOff = point(
  "the-response-after-a-switch-off",
  ["The response after a switch off", "关闭之后的响应"],
  [
    "Forcing $c(1 - u(t - T))$ is on until $T$ and off after it. By the delay theorem the response is the rise from rest minus the same rise delayed by $T$. So after $T$ the solution simply decays from the value it reached, with no further rise.",
    "强迫项 $c(1 - u(t - T))$ 在 $T$ 之前开启，之后关闭。由时滞定理，响应是从静止开始的上升减去延迟 $T$ 的同样上升。所以 $T$ 之后，解只是从已达到的值衰减，不再上升。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const c = rng.int(1, 60);
    const n = rng.int(2, 4);
    const T = k === 1 ? "\\ln 2" : `\\frac{\\ln 2}{${k}}`;
    const level = Q.of(c, k);
    const answer = Q.of(c, k * 2 ** n);
    const risen = level.mul(Q.of(2 ** n - 1, 2 ** n));
    return ask(
      [
        `$${poly([1, "y'"], [k, "y"])} = ${c}\\left(1 - u(t - T)\\right)$ with $y(0) = 0$ and $T = ${T}$. Find $y(${n}T)$.`,
        `$${poly([1, "y'"], [k, "y"])} = ${c}\\left(1 - u(t - T)\\right)$，$y(0) = 0$，$T = ${T}$。求 $y(${n}T)$。`,
      ],
      answer,
      [risen, level, level.mul(Q.of(1, 2))],
      [
        `Up to $T$, $y$ rises toward $${level.toLatex()}$ and reaches half of it, since $${expOf(-k)}$ is $\\frac{1}{2}$ at $T$. After that $y$ only decays, halving every $T$, so $y(${n}T)$ is $${level.toLatex()}$ times $\\frac{1}{${2 ** n}}$, which is $${answer.toLatex()}$.`,
        `到 $T$ 为止，$y$ 向 $${level.toLatex()}$ 上升并达到它的一半，因为 $${expOf(-k)}$ 在 $T$ 处等于 $\\frac{1}{2}$。此后 $y$ 只衰减，每过 $T$ 减半，所以 $y(${n}T)$ 是 $${level.toLatex()}$ 乘以 $\\frac{1}{${2 ** n}}$，即 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const pulseAmplitude = point(
  "the-amplitude-left-by-a-pulse",
  ["The amplitude left by a pulse", "脉冲留下的振幅"],
  [
    "When a constant force on an oscillator is switched off, the two delayed responses add. Their phases decide the outcome: a pulse lasting an odd number of half periods doubles the amplitude, and one lasting a whole number of periods leaves the oscillator at rest.",
    "作用在振子上的常力关闭时，两个延迟响应相加。它们的相位决定结果：持续奇数个半周期的脉冲使振幅加倍，持续整数个周期的脉冲使振子静止。",
  ],
  (rng) => {
    const w = rng.int(1, 6);
    const F = rng.int(1, 40);
    const j = rng.int(1, 4);
    const piPart = j === 1 ? "\\pi" : `${j}\\pi`;
    const T = w === 1 ? piPart : `\\frac{${piPart}}{${w}}`;
    const full = Q.of(2 * F, w * w);
    const odd = j % 2 === 1;
    const answer = odd ? full : Q.of(0);
    const left = poly([1, "y''"], [w * w, "y"]);
    const c = w === 1 ? "" : w;
    return ask(
      [
        `$${left} = ${F}\\left(1 - u(t - T)\\right)$ with $y(0) = y'(0) = 0$ and $T = ${T}$. Find the amplitude of the motion for $t > T$, or $0$ if the oscillator is at rest.`,
        `$${left} = ${F}\\left(1 - u(t - T)\\right)$，$y(0) = y'(0) = 0$，$T = ${T}$。求 $t > T$ 时运动的振幅；如果振子静止，填 $0$。`,
      ],
      answer,
      [odd ? 0 : full, Q.of(F, w * w), Q.of(2 * F, w)],
      [
        `For $t > T$, $y = ${Q.of(F, w * w).toLatex()}\\left(\\cos ${c === "" ? "" : c}(t - T) - \\cos ${c}t\\right)$, and shifting by $T$ changes the angle by $${piPart}$. ${odd ? `So the first cosine is the negative of the second, and the amplitude is $${full.toLatex()}$.` : "So the two cosines are equal, they cancel, and the amplitude is $0$."}`,
        `当 $t > T$ 时，$y = ${Q.of(F, w * w).toLatex()}\\left(\\cos ${c === "" ? "" : c}(t - T) - \\cos ${c}t\\right)$，平移 $T$ 使角度改变 $${piPart}$。${odd ? `所以第一个余弦是第二个的相反数，振幅是 $${full.toLatex()}$。` : "所以两个余弦相等并抵消，振幅是 $0$。"}`,
      ],
    );
  },
);

const coupledTransform = point(
  "cramers-rule-for-a-coupled-transform",
  ["Cramer's rule for a coupled transform", "耦合变换的克拉默法则"],
  [
    "Transforming $\\mathbf{x}' = A\\mathbf{x}$ gives $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$. In a coupled system neither transform can be found alone, so use Cramer's rule, and remember that the off-diagonal entries of $sI - A$ have the opposite sign to those of $A$.",
    "变换 $\\mathbf{x}' = A\\mathbf{x}$ 得 $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$。在耦合方程组中，两个变换都不能单独求出，所以要用克拉默法则，并记住 $sI - A$ 的非对角元素与 $A$ 的符号相反。",
  ],
  (rng) => {
    const a = -rng.int(1, 5);
    const d = -rng.int(1, 5);
    const b = rng.int(1, 5);
    const c = -rng.int(1, 5);
    const p = nz(rng, 6);
    const r = nz(rng, 6);
    const s = rng.int(1, 4);
    const det = (s - a) * (s - d) - b * c;
    const top = (s - d) * p + b * r;
    const answer = Q.of(top, det);
    return ask(
      [
        `For $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$, $x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$ with $x_{1}(0) = ${p}$ and $x_{2}(0) = ${r}$, find $X_{1}(${s})$, where $X_{1} = \\mathcal{L}\\{x_{1}\\}$.`,
        `对 $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$，$x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$，$x_{1}(0) = ${p}$，$x_{2}(0) = ${r}$，求 $X_{1}(${s})$，其中 $X_{1} = \\mathcal{L}\\{x_{1}\\}$。`,
      ],
      answer,
      [Q.of(p, s - a), Q.of((s - a) * p + b * r, det), Q.of((s - d) * p - b * r, det)],
      [
        `At $s = ${s}$, $sI - A = ${mat(s - a, -b, -c, s - d)}$, with determinant $${det}$. Cramer's rule gives the numerator $${s - d} \\cdot ${paren(p)} + ${b} \\cdot ${paren(r)} = ${top}$, so $X_{1}(${s}) = ${answer.toLatex()}$.`,
        `在 $s = ${s}$ 处，$sI - A = ${mat(s - a, -b, -c, s - d)}$，行列式是 $${det}$。克拉默法则给出分子 $${s - d} \\cdot ${paren(p)} + ${b} \\cdot ${paren(r)} = ${top}$，所以 $X_{1}(${s}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cascadeTransform = point(
  "the-transform-of-a-forced-cascade",
  ["The transform of a forced cascade", "受迫级联系统的变换"],
  [
    "In a cascade the forcing reaches the first variable only through the second, so the transforms multiply along the chain. A constant force contributes $\\frac{f}{s}$, not $f$, and this factor of $\\frac{1}{s}$ is the part most often forgotten.",
    "在级联系统中，强迫项只通过第二个变量作用于第一个变量，所以变换沿着链条相乘。常力贡献的是 $\\frac{f}{s}$，而不是 $f$，这个 $\\frac{1}{s}$ 因子最容易被遗忘。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const c = rng.int(1, 5);
    const b = nz(rng, 5);
    const f = nz(rng, 12);
    const s = rng.int(1, 4);
    const answer = Q.of(b * f, s * (s + a) * (s + c));
    return ask(
      [
        `For $x_{1}' = ${poly([-a, "x_{1}"], [b, "x_{2}"])}$, $x_{2}' = ${poly([-c, "x_{2}"], [f, ""])}$ with $x_{1}(0) = x_{2}(0) = 0$, find $X_{1}(${s})$, where $X_{1} = \\mathcal{L}\\{x_{1}\\}$.`,
        `对 $x_{1}' = ${poly([-a, "x_{1}"], [b, "x_{2}"])}$，$x_{2}' = ${poly([-c, "x_{2}"], [f, ""])}$，$x_{1}(0) = x_{2}(0) = 0$，求 $X_{1}(${s})$，其中 $X_{1} = \\mathcal{L}\\{x_{1}\\}$。`,
      ],
      answer,
      [Q.of(b * f, (s + a) * (s + c)), Q.of(f, s * (s + c)), Q.of(b * f, s * (s + a))],
      [
        `$X_{2}(s) = \\frac{${f}}{s(s + ${c})}$, and then $X_{1}(s) = \\frac{${b}X_{2}(s)}{s + ${a}}$. At $s = ${s}$, the denominator is $${s} \\cdot ${s + c} \\cdot ${s + a}$, so $X_{1}(${s}) = ${answer.toLatex()}$.`,
        `$X_{2}(s) = \\frac{${f}}{s(s + ${c})}$，于是 $X_{1}(s) = \\frac{${b}X_{2}(s)}{s + ${a}}$。在 $s = ${s}$ 处，分母是 $${s} \\cdot ${s + c} \\cdot ${s + a}$，所以 $X_{1}(${s}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** ordinals names the first few positions in a list. */
const ordinals: readonly Pair[] = [
  ["smallest", "最小的"],
  ["second smallest", "第二小的"],
  ["third smallest", "第三小的"],
  ["fourth smallest", "第四小的"],
];

const bvpEigenvalues = point(
  "the-values-of-lambda-with-nonzero-solutions",
  ["The values of lambda with nonzero solutions", "存在非零解的 lambda 值"],
  [
    "A homogeneous boundary value problem has the zero solution, and nonzero solutions only for special values of the parameter. For $y'' + \\lambda y = 0$ with $y(0) = y(L) = 0$, the condition is that $\\sqrt{\\lambda}L$ is a multiple of $\\pi$, so $\\lambda$ equals $\\left(\\frac{n\\pi}{L}\\right)^{2}$.",
    "齐次边值问题有零解，只有参数取特殊值时才有非零解。对 $y'' + \\lambda y = 0$，$y(0) = y(L) = 0$，条件是 $\\sqrt{\\lambda}L$ 为 $\\pi$ 的倍数，所以 $\\lambda$ 等于 $\\left(\\frac{n\\pi}{L}\\right)^{2}$。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const n = rng.int(1, 4);
    const L = k === 1 ? "\\pi" : `\\frac{\\pi}{${k}}`;
    const name = ordinals[n - 1] as Pair;
    const answer = (n * k) ** 2;
    return ask(
      [
        `$y'' + \\lambda y = 0$ with $y(0) = 0$ and $y\\left(${L}\\right) = 0$ has nonzero solutions for certain positive $\\lambda$. Find the ${name[0]} such $\\lambda$.`,
        `$y'' + \\lambda y = 0$，$y(0) = 0$，$y\\left(${L}\\right) = 0$，对某些正数 $\\lambda$ 有非零解。求${name[1]}这样的 $\\lambda$。`,
      ],
      answer,
      [n * k, n * n * k, n * k * k],
      [
        `The condition $y(0) = 0$ leaves $y = \\sin(\\sqrt{\\lambda}x)$, so the other condition needs $\\sqrt{\\lambda} \\cdot ${L} = ${n === 1 ? "" : n}\\pi$. That gives $\\sqrt{\\lambda} = ${n * k}$ and $\\lambda = ${answer}$.`,
        `条件 $y(0) = 0$ 留下 $y = \\sin(\\sqrt{\\lambda}x)$，所以另一个条件要求 $\\sqrt{\\lambda} \\cdot ${L} = ${n === 1 ? "" : n}\\pi$。于是 $\\sqrt{\\lambda} = ${n * k}$，$\\lambda = ${answer}$。`,
      ],
    );
  },
);

const integrationConstant = point(
  "the-constant-from-integrating-sine-terms",
  ["The constant from integrating sine terms", "积分正弦项产生的常数"],
  [
    "Integrating a sine series term by term from $0$ to $x$ does not give a pure cosine series. Since $\\int_{0}^{x} \\sin nt \\, dt = \\frac{1 - \\cos nx}{n}$, each term leaves a constant $\\frac{1}{n}$ times its coefficient, and these constants add up.",
    "把正弦级数从 $0$ 到 $x$ 逐项积分，得到的不是纯余弦级数。由于 $\\int_{0}^{x} \\sin nt \\, dt = \\frac{1 - \\cos nx}{n}$，每一项都留下一个常数，等于其系数乘以 $\\frac{1}{n}$，这些常数相加。",
  ],
  (rng) => {
    const a = nz(rng, 12);
    const b = nz(rng, 12);
    const p = rng.int(1, 5);
    const q = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== p));
    const answer = Q.of(a, p).add(Q.of(b, q));
    const f = poly([a, angle("sin", p, "t")], [b, angle("sin", q, "t")]);
    return ask(
      [
        `Integrate $${f}$ term by term from $0$ to $x$. Find the constant term of the result.`,
        `把 $${f}$ 从 $0$ 到 $x$ 逐项积分。求结果的常数项。`,
      ],
      answer,
      [0, answer.neg(), a + b],
      [
        `Each term gives a constant from the lower limit: $${Q.of(a, p).toLatex()}$ and $${Q.of(b, q).toLatex()}$. Their sum is $${answer.toLatex()}$, which is not zero in general, even though the sines themselves have mean zero.`,
        `每一项由下限产生一个常数：$${Q.of(a, p).toLatex()}$ 和 $${Q.of(b, q).toLatex()}$。它们的和是 $${answer.toLatex()}$，一般不为零，尽管正弦函数本身的平均值为零。`,
      ],
    );
  },
);

const constantMode = point(
  "the-constant-mode-of-a-periodic-response",
  ["The constant mode of a periodic response", "周期响应的常数模态"],
  [
    "A Fourier series may have a constant term, and it counts as the mode with $n = 0$. For $y'' + k^{2}y = c + b\\sin nx$ the constant mode responds with $\\frac{c}{k^{2}}$ and the sine mode with $\\frac{b}{k^{2} - n^{2}}$, and the solution is their sum.",
    "傅里叶级数可能有常数项，它相当于 $n = 0$ 的模态。对 $y'' + k^{2}y = c + b\\sin nx$，常数模态的响应是 $\\frac{c}{k^{2}}$，正弦模态的响应是 $\\frac{b}{k^{2} - n^{2}}$，解是它们的和。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const n = rng.pick([1, 3].filter((v) => v !== k));
    const c = nz(rng, 40);
    const b = nz(rng, 40);
    const sign = n === 1 ? 1 : -1;
    const level = Q.of(c, k * k);
    const mode = Q.of(b, k * k - n * n);
    const answer = level.add(mode.mul(Q.of(sign)));
    const left = poly([1, "y''"], [k * k, "y"]);
    const right = poly([c, ""], [b, angle("sin", n, "x")]);
    return ask(
      [
        `$y$ is the periodic solution of $${left} = ${right}$. Find $y\\left(\\frac{\\pi}{2}\\right)$.`,
        `$y$ 是 $${left} = ${right}$ 的周期解。求 $y\\left(\\frac{\\pi}{2}\\right)$。`,
      ],
      answer,
      [mode.mul(Q.of(sign)), level, level.sub(mode.mul(Q.of(sign)))],
      [
        `The constant mode gives $${level.toLatex()}$, and the sine mode has amplitude $${mode.toLatex()}$. At $\\frac{\\pi}{2}$ the sine equals $${sign}$, so $y = ${answer.toLatex()}$.`,
        `常数模态给出 $${level.toLatex()}$，正弦模态的振幅是 $${mode.toLatex()}$。在 $\\frac{\\pi}{2}$ 处，正弦值等于 $${sign}$，所以 $y = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cosineIvp = point(
  "cosine-forcing-changes-the-first-constant",
  ["Cosine forcing changes the first constant", "余弦强迫改变第一个常数"],
  [
    "Under sine forcing the particular part vanishes at $t = 0$, so $c_{1} = y(0)$. Under cosine forcing it does not: the particular part has the value $Y$ at $t = 0$, and so $c_{1} = y(0) - Y$. The derivative condition then fixes $c_{2}$ on its own.",
    "在正弦强迫下，特解部分在 $t = 0$ 处为零，所以 $c_{1} = y(0)$。在余弦强迫下则不然：特解部分在 $t = 0$ 处的值是 $Y$，所以 $c_{1} = y(0) - Y$。导数条件再单独确定 $c_{2}$。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const w = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== k));
    const F = nz(rng, 30);
    const y0 = rng.int(-9, 9);
    const v0 = rng.int(-9, 9);
    const Y = Q.of(F, k * k - w * w);
    const answer = Q.of(y0).sub(Y);
    const left = poly([1, "y''"], [k * k, "y"]);
    const form = `Y${angle("cos", w, "t")} + c_{1}${angle("cos", k, "t")} + c_{2}${angle("sin", k, "t")}`;
    return ask(
      [
        `Solve $${left} = ${poly([F, angle("cos", w, "t")])}$ with $y(0) = ${y0}$ and $y'(0) = ${v0}$, writing $y = ${form}$. Find $c_{1}$.`,
        `解 $${left} = ${poly([F, angle("cos", w, "t")])}$，$y(0) = ${y0}$，$y'(0) = ${v0}$，写成 $y = ${form}$。求 $c_{1}$。`,
      ],
      answer,
      [y0, Q.of(y0).add(Y), Y],
      [
        `Substituting the cosine term gives $Y = \\frac{${F}}{${k * k - w * w}} = ${Y.toLatex()}$. At $t = 0$ the sines vanish, so $y(0) = Y + c_{1}$, and $c_{1} = ${y0} - ${paren(Y)} = ${answer.toLatex()}$.`,
        `代入余弦项得 $Y = \\frac{${F}}{${k * k - w * w}} = ${Y.toLatex()}$。在 $t = 0$ 处正弦项为零，所以 $y(0) = Y + c_{1}$，$c_{1} = ${y0} - ${paren(Y)} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const reactionBvp = point(
  "a-reaction-term-in-the-sine-expansion",
  ["A reaction term in the sine expansion", "正弦展开中的反应项"],
  [
    "The sine expansion still works for $-y'' + k^{2}y = f$ on $[0, \\pi]$ with zero boundary values. On the mode $\\sin nx$ the left side multiplies by $n^{2} + k^{2}$, so each coefficient divides by this sum. There is no resonance, because the sum is never zero.",
    "正弦展开对 $[0, \\pi]$ 上边界值为零的 $-y'' + k^{2}y = f$ 同样有效。在模态 $\\sin nx$ 上，左边乘以 $n^{2} + k^{2}$，所以每个系数都除以这个和。不会共振，因为这个和永远不为零。",
  ],
  (rng) => {
    const n = rng.int(1, 5);
    const k = rng.int(1, 6);
    const b = nz(rng, 60);
    const answer = Q.of(b, n * n + k * k);
    const left = poly([-1, "y''"], [k * k, "y"]);
    const right = poly([b, angle("sin", n, "x")]);
    const mode = angle("sin", n, "x");
    return ask(
      [
        `Solve $${left} = ${right}$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$, writing $y = Y${mode}$. Find $Y$.`,
        `在 $[0, \\pi]$ 上解 $${left} = ${right}$，$y(0) = y(\\pi) = 0$，写成 $y = Y${mode}$。求 $Y$。`,
      ],
      answer,
      [Q.of(b, n * n), Q.of(b, k * k), Q.of(b, (n + k) ** 2)],
      [
        `Substituting, $-y''$ gives $${n * n}Y${mode}$ and the other term gives $${k * k}Y${mode}$. So $${n * n + k * k}Y = ${b}$ and $Y = ${answer.toLatex()}$.`,
        `代入后，$-y''$ 给出 $${n * n}Y${mode}$，另一项给出 $${k * k}Y${mode}$。所以 $${n * n + k * k}Y = ${b}$，$Y = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const leadingLimits = point(
  "the-limits-that-enter-the-indicial-equation",
  ["The limits that enter the indicial equation", "进入指标方程的极限"],
  [
    "At a regular singular point $x = 0$, the numbers $p_{0} = \\lim_{x \\to 0} xP(x)$ and $q_{0} = \\lim_{x \\to 0} x^{2}Q(x)$ are what enter the indicial equation. Only the values at $x = 0$ matter, so the higher terms of the numerators have no effect.",
    "在正则奇点 $x = 0$ 处，进入指标方程的是 $p_{0} = \\lim_{x \\to 0} xP(x)$ 和 $q_{0} = \\lim_{x \\to 0} x^{2}Q(x)$。只有 $x = 0$ 处的值起作用，所以分子的高次项没有影响。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 5);
    const e = rng.int(1, 6);
    const c = nz(rng, 9);
    const g = nz(rng, 5);
    const f = rng.int(1, 6);
    const useP = rng.bool();
    const answer = useP ? Q.of(a, e) : Q.of(c, f);
    const P = `\\frac{${poly([a, ""], [b, "x"])}}{x(x + ${e})}`;
    const R = `\\frac{${poly([c, ""], [g, "x"])}}{x^{2}(x + ${f})}`;
    const name = useP ? "p_{0} = \\lim_{x \\to 0} xP(x)" : "q_{0} = \\lim_{x \\to 0} x^{2}Q(x)";
    return ask(
      [
        `For $y'' + P(x)y' + Q(x)y = 0$ with $P(x) = ${P}$ and $Q(x) = ${R}$, find $${name}$.`,
        `对 $y'' + P(x)y' + Q(x)y = 0$，其中 $P(x) = ${P}$，$Q(x) = ${R}$，求 $${name}$。`,
      ],
      answer,
      [useP ? a : c, useP ? Q.of(b, e) : Q.of(g, f), useP ? Q.of(c, f) : Q.of(a, e)],
      [
        useP
          ? `$xP(x) = \\frac{${poly([a, ""], [b, "x"])}}{x + ${e}}$. Setting $x = 0$ gives $${answer.toLatex()}$.`
          : `$x^{2}Q(x) = \\frac{${poly([c, ""], [g, "x"])}}{x + ${f}}$. Setting $x = 0$ gives $${answer.toLatex()}$.`,
        useP
          ? `$xP(x) = \\frac{${poly([a, ""], [b, "x"])}}{x + ${e}}$。令 $x = 0$，得 $${answer.toLatex()}$。`
          : `$x^{2}Q(x) = \\frac{${poly([c, ""], [g, "x"])}}{x + ${f}}$。令 $x = 0$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const nonzeroExponent = point(
  "the-recurrence-with-a-nonzero-exponent",
  ["The recurrence with a nonzero exponent", "指数不为零时的递推关系"],
  [
    "With exponent $r$, the power of $x$ in each term is $n + r$, so the exponent changes the recurrence. For $xy'' + cy = 0$, the coefficient of $x^{n + r}$ gives $a_{n + 1}(n + r + 1)(n + r) + ca_{n} = 0$, which has to be evaluated at the chosen $r$.",
    "指数为 $r$ 时，每项中 $x$ 的幂是 $n + r$，所以指数会改变递推关系。对 $xy'' + cy = 0$，$x^{n + r}$ 的系数给出 $a_{n + 1}(n + r + 1)(n + r) + ca_{n} = 0$，要在所选的 $r$ 处取值。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const N = rng.int(1, 5);
    const denom = (N + 2) * (N + 1);
    const answer = Q.of(-c, denom);
    return ask(
      [
        `The equation $${poly([1, "xy''"], [c, "y"])} = 0$ has a Frobenius solution $y = \\sum a_{n}x^{n + 1}$ with exponent $r = 1$. Find $\\frac{a_{${N + 1}}}{a_{${N}}}$.`,
        `方程 $${poly([1, "xy''"], [c, "y"])} = 0$ 有弗罗贝尼乌斯解 $y = \\sum a_{n}x^{n + 1}$，指数 $r = 1$。求 $\\frac{a_{${N + 1}}}{a_{${N}}}$。`,
      ],
      answer,
      [answer.neg(), Q.of(-c, (N + 1) * N), Q.of(-c, N + 1)],
      [
        `With $r = 1$ the recurrence is $a_{n + 1}(n + 2)(n + 1) + ${paren(c)}a_{n} = 0$. At $n = ${N}$, the factors are $${N + 2}$ and $${N + 1}$, so the ratio is $${answer.toLatex()}$.`,
        `当 $r = 1$ 时，递推关系是 $a_{n + 1}(n + 2)(n + 1) + ${paren(c)}a_{n} = 0$。在 $n = ${N}$ 处，因子是 $${N + 2}$ 和 $${N + 1}$，所以比值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const secondSolutionForm = point(
  "the-form-of-the-second-solution",
  ["The form of the second solution", "第二个解的形式"],
  [
    "The difference of the exponents decides the form of the second Frobenius solution. A non-integer difference gives a second series. Equal exponents always bring a logarithm. A positive integer difference may bring a logarithm, with a coefficient that may turn out to be zero.",
    "指数之差决定第二个弗罗贝尼乌斯解的形式。差不是整数时，得到第二个级数。指数相等时，一定出现对数。差是正整数时，可能出现对数，其系数可能为零。",
  ],
  (rng) => {
    const kind = rng.pick(["half", "equal", "integer"]);
    let A = 1;
    let B = 0;
    let C = 0;
    let roots: Pair = ["", ""];
    if (kind === "equal") {
      const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
      B = 1 - 2 * m;
      C = m * m;
      roots = [`$${m}$ twice`, `$${m}$（二重）`];
    } else if (kind === "integer") {
      const low = rng.int(-3, 3);
      const high = low + rng.int(1, 3);
      B = 1 - low - high;
      C = low * high;
      roots = [`$${high}$ and $${low}$`, `$${high}$ 和 $${low}$`];
    } else {
      A = 2;
      const i = rng.int(0, 3);
      const j = rng.pick([-2, -1, 1, 2, 3]);
      B = 1 - 2 * i - 2 * j;
      C = (2 * i + 1) * j;
      const half = Q.of(2 * i + 1, 2).toLatex();
      roots = [`$${half}$ and $${j}$`, `$${half}$ 和 $${j}$`];
    }
    const two: Pair = [
      "Two series with no logarithm: $y_{2} = x^{r_{2}}\\sum b_{n}x^{n}$",
      "两个级数，没有对数：$y_{2} = x^{r_{2}}\\sum b_{n}x^{n}$",
    ];
    const log: Pair = [
      "Always a logarithm: $y_{2} = y_{1}\\ln x + x^{r_{1}}\\sum b_{n}x^{n}$",
      "一定有对数：$y_{2} = y_{1}\\ln x + x^{r_{1}}\\sum b_{n}x^{n}$",
    ];
    const maybe: Pair = [
      "Possibly a logarithm: $y_{2} = Cy_{1}\\ln x + x^{r_{2}}\\sum b_{n}x^{n}$, where $C$ may be zero",
      "可能有对数：$y_{2} = Cy_{1}\\ln x + x^{r_{2}}\\sum b_{n}x^{n}$，其中 $C$ 可能为零",
    ];
    const product: Pair = ["A simple multiple of the first: $y_{2} = xy_{1}$", "第一个解的简单倍数：$y_{2} = xy_{1}$"];
    const correct = kind === "half" ? two : kind === "equal" ? log : maybe;
    const eq = poly([A, "x^{2}y''"], [B, "xy'"], [1, "xy"], [C, "y"]);
    const indicial = poly([A, "r(r - 1)"], [B, "r"], [C, ""]);
    const why: Pair =
      kind === "half"
        ? ["The exponents differ by a non-integer, so two series exist.", "指数之差不是整数，所以存在两个级数。"]
        : kind === "equal"
          ? ["The exponents are equal, so a logarithm always appears.", "指数相等，所以一定出现对数。"]
          : ["The exponents differ by a positive integer, so a logarithm may appear.", "指数之差是正整数，所以可能出现对数。"];
    return choose(
      rng,
      [
        `Near the regular singular point $x = 0$ of $${eq} = 0$, what form does the second solution take, with $r_{1}$ the larger exponent and $r_{2}$ the smaller?`,
        `在 $${eq} = 0$ 的正则奇点 $x = 0$ 附近，第二个解是什么形式？其中 $r_{1}$ 是较大的指数，$r_{2}$ 是较小的指数。`,
      ],
      correct,
      [two, log, maybe, product].filter((o) => o !== correct),
      [
        `The indicial equation is $${indicial} = 0$, with roots ${roots[0]}. ${why[0]}`,
        `指标方程是 $${indicial} = 0$，根是 ${roots[1]}。${why[1]}`,
      ],
    );
  },
);

const stepLimit = point(
  "the-step-limit-set-by-the-fastest-mode",
  ["The step limit set by the fastest mode", "最快模态决定的步长限制"],
  [
    "Euler's method multiplies a mode with eigenvalue $\\lambda$ by $1 + h\\lambda$ at each step, so a decaying mode decays numerically only when $h < \\frac{2}{|\\lambda|}$. In a system the fastest mode sets the limit, even if that mode is too small to notice in the solution.",
    "欧拉法每一步把特征值为 $\\lambda$ 的模态乘以 $1 + h\\lambda$，所以衰减模态只有当 $h < \\frac{2}{|\\lambda|}$ 时在数值上才衰减。在方程组中，最快的模态决定限制，即使它在解中小到难以察觉。",
  ],
  (rng) => {
    const l1 = rng.int(1, 12);
    const l2 = rng.pick([...Array(20).keys()].map((i) => i + 1).filter((v) => v !== l1));
    const b = nz(rng, 9);
    const fast = Math.max(l1, l2);
    const slow = Math.min(l1, l2);
    const answer = Q.of(2, fast);
    const A = mat(-l1, b, 0, -l2);
    return ask(
      [
        `Euler's method is applied to $\\mathbf{x}' = ${A}\\mathbf{x}$. Every mode decays numerically exactly when $0 < h < h_{0}$. Find $h_{0}$.`,
        `把欧拉法用于 $\\mathbf{x}' = ${A}\\mathbf{x}$。当且仅当 $0 < h < h_{0}$ 时，每个模态在数值上都衰减。求 $h_{0}$。`,
      ],
      answer,
      [Q.of(2, slow), Q.of(1, fast), Q.of(2, l1 + l2)],
      [
        `The matrix is triangular, so its eigenvalues are $${-l1}$ and $${-l2}$. The condition $|1 + h\\lambda| < 1$ gives $h < \\frac{2}{|\\lambda|}$, and the stricter limit comes from $|\\lambda| = ${fast}$, so $h_{0} = ${answer.toLatex()}$.`,
        `矩阵是三角矩阵，所以特征值是 $${-l1}$ 和 $${-l2}$。条件 $|1 + h\\lambda| < 1$ 给出 $h < \\frac{2}{|\\lambda|}$，更严格的限制来自 $|\\lambda| = ${fast}$，所以 $h_{0} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** stepSizes are step sizes that keep the amplification factors exact. */
const stepSizes = [Q.of(1, 10), Q.of(1, 5), Q.of(1, 4), Q.of(1, 2), Q.of(1)] as const;

const energyGrowth = point(
  "euler-adds-energy-to-an-oscillator",
  ["Euler adds energy to an oscillator", "欧拉法给振子增加能量"],
  [
    "The exact motion of $y'' + k^{2}y = 0$ keeps $(y')^{2} + k^{2}y^{2}$ constant. Each Euler step multiplies this quantity by $1 + h^{2}k^{2}$, whatever the state is. So the numerical oscillation always grows, and a smaller step only slows the growth.",
    "$y'' + k^{2}y = 0$ 的精确运动保持 $(y')^{2} + k^{2}y^{2}$ 不变。欧拉法每一步都把这个量乘以 $1 + h^{2}k^{2}$，与状态无关。所以数值振荡总是增长，较小的步长只是减慢增长。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const h = rng.pick(stepSizes);
    const k2 = Q.of(k * k);
    const answer = Q.one.add(h.mul(h).mul(k2));
    const left = poly([1, "y''"], [k * k, "y"]);
    const energy = poly([1, "(y')^{2}"], [k * k, "y^{2}"]);
    return ask(
      [
        `Euler's method with $h = ${h.toLatex()}$ is applied to $${left} = 0$. By what factor does each step multiply $E = ${energy}$?`,
        `把步长 $h = ${h.toLatex()}$ 的欧拉法用于 $${left} = 0$。每一步把 $E = ${energy}$ 乘以多少？`,
      ],
      answer,
      [Q.one.add(h.mul(k2)), Q.one.add(h.mul(h).mul(Q.of(k))), Q.one.sub(h.mul(h).mul(k2))],
      [
        `A step gives $y_{1} = y + hv$ and $v_{1} = ${poly([1, "v"], [-k * k, "hy"])}$. Expanding $E$ for the new values, the cross terms cancel and $E$ gains $${poly([k * k, "h^{2}E"])}$. So the factor is $1 + ${h.mul(h).mul(k2).toLatex()} = ${answer.toLatex()}$.`,
        `一步给出 $y_{1} = y + hv$，$v_{1} = ${poly([1, "v"], [-k * k, "hy"])}$。对新值展开 $E$，交叉项抵消，$E$ 增加 $${poly([k * k, "h^{2}E"])}$。所以因子是 $1 + ${h.mul(h).mul(k2).toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const errorEstimate = point(
  "the-error-estimate-from-predictor-and-corrector",
  ["The error estimate from predictor and corrector", "由预测值和校正值估计误差"],
  [
    "A predictor-corrector pair produces an error estimate at no extra cost. For ABM2, the local errors of the predictor and the corrector are $\\frac{5}{12}h^{3}y'''$ and $-\\frac{1}{12}h^{3}y'''$, so the corrector's error is about one sixth of the gap between the two values.",
    "预测-校正方法不需额外计算就能给出误差估计。对 ABM2，预测值和校正值的局部误差分别是 $\\frac{5}{12}h^{3}y'''$ 和 $-\\frac{1}{12}h^{3}y'''$，所以校正值的误差约为两个值之差的六分之一。",
  ],
  (rng) => {
    const m = rng.int(1, 40);
    const base = rng.int(100, 900);
    const sign = rng.pick([-1, 1]);
    const P = base;
    const C = base + sign * 6 * m;
    const show = (v: number) => (v / 100).toFixed(2);
    return ask(
      [
        `In one step of ABM2, the predictor gives $${show(P)}$ and the corrector gives $${show(C)}$. Estimate the size of the local error of the corrected value.`,
        `在 ABM2 的一步中，预测值是 $${show(P)}$，校正值是 $${show(C)}$。估计校正值局部误差的大小。`,
      ],
      Q.of(m, 100),
      [Q.of(6 * m, 100), Q.of(3 * m, 100), Q.of(5 * m, 100)],
      [
        `The gap is $${show(6 * m)}$. The errors have the coefficients $\\frac{5}{12}$ and $-\\frac{1}{12}$, which differ by $\\frac{1}{2}$, so the corrector's error is $\\frac{1}{6}$ of the gap, about $${show(m)}$.`,
        `差是 $${show(6 * m)}$。误差的系数是 $\\frac{5}{12}$ 和 $-\\frac{1}{12}$，相差 $\\frac{1}{2}$，所以校正值的误差是差的 $\\frac{1}{6}$，约为 $${show(m)}$。`,
      ],
    );
  },
);

const newtonLinear = point(
  "newton-needs-one-iteration-for-a-linear-equation",
  ["Newton needs one iteration for a linear equation", "线性方程只需一次牛顿迭代"],
  [
    "When $f$ is linear in $y$, the equation $g(y) = 0$ of implicit Euler is linear too, and Newton's method lands on the exact root in one iteration from any starting guess. So the guess does not appear in the result, and the step is $\\frac{y_{n} + hc}{1 + hk}$ for $y' = -ky + c$.",
    "当 $f$ 关于 $y$ 是线性时，隐式欧拉法的方程 $g(y) = 0$ 也是线性的，牛顿法从任何初始猜测出发，一次迭代就得到精确的根。所以结果中不出现猜测值，对 $y' = -ky + c$，这一步是 $\\frac{y_{n} + hc}{1 + hk}$。",
  ],
  (rng) => {
    const k = rng.int(1, 8);
    const h = rng.pick([Q.of(1), Q.of(1, 2), Q.of(1, 4)]);
    const yn = nz(rng, 20);
    const c = nz(rng, 20);
    const guess = rng.int(-9, 9);
    const top = Q.of(yn).add(h.mul(Q.of(c)));
    const bottom = Q.one.add(h.mul(Q.of(k)));
    const answer = top.div(bottom);
    const f = poly([-k, "y"], [c, ""]);
    return ask(
      [
        `A backward Euler step with $h = ${h.toLatex()}$ for $y' = ${f}$ from $y_{n} = ${yn}$ uses Newton's method with starting guess $y^{(0)} = ${guess}$. Find $y^{(1)}$.`,
        `对 $y' = ${f}$ 从 $y_{n} = ${yn}$ 出发做步长 $h = ${h.toLatex()}$ 的后向欧拉步，用牛顿法，初始猜测 $y^{(0)} = ${guess}$。求 $y^{(1)}$。`,
      ],
      answer,
      [Q.of(yn).add(h.mul(Q.of(-k * guess + c))), top, guess],
      [
        `$g(y) = ${poly([bottom, "y"])} - ${paren(top)}$ is linear, so one Newton iteration reaches its root from any guess. The root is $\\frac{${top.toLatex()}}{${bottom.toLatex()}} = ${answer.toLatex()}$.`,
        `$g(y) = ${poly([bottom, "y"])} - ${paren(top)}$ 是线性的，所以牛顿法从任何猜测出发，一次迭代就到达它的根。根是 $\\frac{${top.toLatex()}}{${bottom.toLatex()}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const trapezoidalFactor = point(
  "the-amplification-factor-of-the-trapezoidal-method",
  ["The amplification factor of the trapezoidal method", "梯形法的放大因子"],
  [
    "For $y' = -ky$, solving the trapezoidal equation gives $y_{n + 1} = \\frac{1 - hk/2}{1 + hk/2}y_{n}$. This factor has size below $1$ for every $h$, so the method is stable. But for large $hk$ it nears $-1$, so stiff components oscillate and hardly decay.",
    "对 $y' = -ky$，解梯形方程得 $y_{n + 1} = \\frac{1 - hk/2}{1 + hk/2}y_{n}$。对任何 $h$，这个因子的绝对值都小于 $1$，所以方法稳定。但 $hk$ 很大时它接近 $-1$，所以刚性分量会振荡，几乎不衰减。",
  ],
  (rng) => {
    const k = rng.int(1, 20);
    const h = rng.pick(stepSizes);
    const half = h.mul(Q.of(k)).div(Q.of(2));
    const answer = Q.one.sub(half).div(Q.one.add(half));
    const hk = h.mul(Q.of(k));
    return ask(
      [
        `The trapezoidal method with $h = ${h.toLatex()}$ is applied to $y' = ${poly([-k, "y"])}$. It gives $y_{n + 1} = Ry_{n}$. Find $R$.`,
        `把步长 $h = ${h.toLatex()}$ 的梯形法用于 $y' = ${poly([-k, "y"])}$，得 $y_{n + 1} = Ry_{n}$。求 $R$。`,
      ],
      answer,
      [Q.one.div(Q.one.add(hk)), Q.one.sub(hk), answer.neg()],
      [
        `The method reads $y_{n + 1} = y_{n} - ${half.toLatex()}(y_{n} + y_{n + 1})$, using $\\frac{hk}{2} = ${half.toLatex()}$. Collecting terms gives $R = \\frac{1 - ${half.toLatex()}}{1 + ${half.toLatex()}} = ${answer.toLatex()}$.`,
        `方法写作 $y_{n + 1} = y_{n} - ${half.toLatex()}(y_{n} + y_{n + 1})$，其中 $\\frac{hk}{2} = ${half.toLatex()}$。合并同类项得 $R = \\frac{1 - ${half.toLatex()}}{1 + ${half.toLatex()}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** deeperDifferentialEquationsThird2Points maps topics of Differential Equations, from repeated eigenvalues to numerical methods, to a third knowledge point. */
export const deeperDifferentialEquationsThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues": [pairedEigenvector],
  "solving-inhomogeneous-systems-of-odes": [exponentialForcingVector],
  "phase-planes-and-phase-portraits": [nullcline],
  "phase-portraits-for-linear-systems-with-zero-eigenvalues": [limitOnEquilibriumLine],
  "shifted-systems-of-odes": [shiftedInitial],
  "linear-approximations-near-equilibria": [classifyEquilibrium],
  "fundamental-matrices": [coefficientsFromFundamental],
  "solving-homogeneous-systems-of-odes-using-matrix-methods": [exponentialOfJordan],
  "solving-inhomogeneous-systems-of-odes-using-matrix-methods": [integralOfExponentialMatrix],
  "solving-systems-of-odes-using-variation-of-parameters": [vopNonDiagonal],
  "the-lotka-volterra-model-with-carrying-capacity": [criticalCapacity],
  "piecewise-continuity-and-piecewise-smoothness": [cornerJump],
  "introduction-to-laplace-transforms": [transformOfT],
  "solving-first-order-odes-using-laplace-transforms": [transformValue],
  "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms": [afterSwitchOff],
  "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms": [pulseAmplitude],
  "solving-homogeneous-systems-of-odes-using-laplace-transforms": [coupledTransform],
  "solving-inhomogeneous-systems-of-odes-using-laplace-transforms": [cascadeTransform],
  "introduction-to-boundary-value-problems": [bvpEigenvalues],
  "differentiating-and-integrating-fourier-series": [integrationConstant],
  "solving-odes-using-fourier-series": [constantMode],
  "solving-ivps-using-fourier-series": [cosineIvp],
  "solving-bvps-using-fourier-series": [reactionBvp],
  "regular-singular-points": [leadingLimits],
  "finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution": [nonzeroExponent],
  "finding-general-solutions-using-the-method-of-frobenius": [secondSolutionForm],
  "eulers-method-for-systems-of-odes": [stepLimit],
  "eulers-method-for-second-order-odes": [energyGrowth],
  "the-abm2-method": [errorEstimate],
  "using-the-implicit-euler-method-with-newtons-method": [newtonLinear],
  "using-the-trapezoidal-method-with-newtons-method": [trapezoidalFactor],
};
