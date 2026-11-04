// Further knowledge points for topics of Multivariable Calculus, each a skill the
// topic's own points leave out. See `deeperMultivariableCalculusPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, pointProblem } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** both writes the same formula as an option in both languages. */
const both = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);
/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** coefficient writes a positive number before a symbol, leaving out 1. */
const coefficient = (n: number) => (n === 1 ? "" : `${n}`);

// ---------------------------------------------------------------------------
// Curves
// ---------------------------------------------------------------------------

const tangentParallelToPlane: KnowledgePointDef = {
  id: "where-a-tangent-line-is-parallel-to-the-xy-plane",
  title: t("Where a tangent line is parallel to the $xy$-plane", "切线在何处与 $xy$ 平面平行"),
  explanation: t(
    "The tangent line at a point of a curve has the direction $\\mathbf{r}'(t)$. It is parallel to the $xy$-plane exactly when this direction has no vertical part, so solve $z'(t) = 0$ and ignore the other two components.",
    "曲线上一点的切线方向是 $\\mathbf{r}'(t)$。切线与 $xy$ 平面平行，当且仅当这个方向没有竖直分量，所以解 $z'(t) = 0$，另外两个分量不用管。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const a = rng.int(1, 9);
    const answer = 2 * p;
    const z = poly([1, "t^3"], [-3 * p, "t^2"], [a, ""]);
    return numberProblem({
      prompt: t(
        `The curve $\\mathbf{r}(t) = \\langle t, t^2, ${z} \\rangle$ has a tangent line parallel to the $xy$-plane at one value $t > 0$. Find it.`,
        `曲线 $\\mathbf{r}(t) = \\langle t, t^2, ${z} \\rangle$ 在某个 $t > 0$ 处的切线与 $xy$ 平面平行。求这个 $t$。`,
      ),
      answer,
      solveFor: "t",
      wrong: [p, 3 * p, 6 * p],
      solution: t(
        `We need $z'(t) = 3t^2 - ${6 * p}t = 3t(t - ${2 * p}) = 0$. The zero with $t > 0$ is $t = ${answer}$.`,
        `需要 $z'(t) = 3t^2 - ${6 * p}t = 3t(t - ${2 * p}) = 0$。其中 $t > 0$ 的根是 $t = ${answer}$。`,
      ),
    });
  },
};

const curvatureOfAHelix: KnowledgePointDef = {
  id: "the-curvature-of-a-helix",
  title: t("The curvature of a helix", "螺旋线的曲率"),
  explanation: t(
    "For the helix $\\langle a\\cos t, a\\sin t, bt \\rangle$, the cross product formula gives the constant curvature $\\kappa = \\frac{a}{a^2+b^2}$. With $b = 0$ this is the circle's $\\frac{1}{a}$, and stretching the helix upward straightens it and lowers the curvature.",
    "对螺旋线 $\\langle a\\cos t, a\\sin t, bt \\rangle$，向量积公式给出常数曲率 $\\kappa = \\frac{a}{a^2+b^2}$。当 $b = 0$ 时就是圆的 $\\frac{1}{a}$；把螺旋线向上拉长会使它变直，曲率变小。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    let b = rng.int(1, 6);
    if (b === a) b += 1;
    const answer = Q.of(a, a * a + b * b);
    return numberProblem({
      prompt: t(
        `Find the curvature of the helix $\\langle ${coefficient(a)}\\cos t, ${coefficient(a)}\\sin t, ${coefficient(b)}t \\rangle$.`,
        `求螺旋线 $\\langle ${coefficient(a)}\\cos t, ${coefficient(a)}\\sin t, ${coefficient(b)}t \\rangle$ 的曲率。`,
      ),
      answer,
      wrong: [Q.of(1, a), Q.of(b, a * a + b * b), Q.of(1, a * a + b * b)],
      solution: t(
        `Here $|\\mathbf{r}'|^2 = ${a * a + b * b}$ and $|\\mathbf{r}' \\times \\mathbf{r}''| = ${a}\\sqrt{${a * a + b * b}}$. Then $\\kappa = \\frac{|\\mathbf{r}' \\times \\mathbf{r}''|}{|\\mathbf{r}'|^3} = ${answer.toLatex()}$.`,
        `这里 $|\\mathbf{r}'|^2 = ${a * a + b * b}$，$|\\mathbf{r}' \\times \\mathbf{r}''| = ${a}\\sqrt{${a * a + b * b}}$。于是 $\\kappa = \\frac{|\\mathbf{r}' \\times \\mathbf{r}''|}{|\\mathbf{r}'|^3} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const binormalFromTangentAndNormal: KnowledgePointDef = {
  id: "the-binormal-from-the-unit-tangent-and-normal",
  title: t("The binormal from the unit tangent and normal", "由单位切向量和法向量求副法向量"),
  explanation: t(
    "The binormal is defined by $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$, in this order. Because $\\mathbf{T}$ and $\\mathbf{N}$ are perpendicular unit vectors, $\\mathbf{B}$ is a unit vector too, so no further normalizing is needed. Reversing the order would flip its sign.",
    "副法向量定义为 $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$，顺序不能变。因为 $\\mathbf{T}$ 和 $\\mathbf{N}$ 是互相垂直的单位向量，$\\mathbf{B}$ 也是单位向量，不必再单位化。交换顺序会改变符号。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
    ] as const);
    const sa = rng.pick([1, -1]);
    const sb = rng.pick([1, -1]);
    const sn = rng.pick([1, -1]);
    const T = [sa * p, sb * q];
    const answer = [Q.of(sn * T[1]!, r), Q.of(-sn * T[0]!, r), Q.of(0)];
    const Tl = `\\left\\langle ${Q.of(T[0]!, r).toLatex()}, ${Q.of(T[1]!, r).toLatex()}, 0 \\right\\rangle`;
    return pointProblem({
      prompt: t(
        `At a point of a curve, $\\mathbf{T} = ${Tl}$ and $\\mathbf{N} = \\langle 0, 0, ${sn} \\rangle$. Find $\\mathbf{B}$ as $\\langle x, y, z \\rangle$.`,
        `曲线上某点处 $\\mathbf{T} = ${Tl}$，$\\mathbf{N} = \\langle 0, 0, ${sn} \\rangle$。求 $\\mathbf{B}$，写成 $\\langle x, y, z \\rangle$。`,
      ),
      answer,
      vars: ["x", "y", "z"],
      vector: true,
      wrong: [answer.map((x) => x.neg()), [Q.of(T[0]!, r), Q.of(T[1]!, r), Q.of(sn)]],
      solution: t(
        `Take the cross product: $\\mathbf{T} \\times \\mathbf{N} = \\langle T_y N_z, -T_x N_z, 0 \\rangle = \\langle ${answer[0]!.toLatex()}, ${answer[1]!.toLatex()}, 0 \\rangle$. The third component is $T_xN_y - T_yN_x = 0$, since $\\mathbf{N}$ has no $x$ or $y$ part.`,
        `计算向量积：$\\mathbf{T} \\times \\mathbf{N} = \\langle T_y N_z, -T_x N_z, 0 \\rangle = \\langle ${answer[0]!.toLatex()}, ${answer[1]!.toLatex()}, 0 \\rangle$。第三个分量是 $T_xN_y - T_yN_x = 0$，因为 $\\mathbf{N}$ 没有 $x$、$y$ 分量。`,
      ),
    });
  },
};

const parameterForConservative: KnowledgePointDef = {
  id: "the-parameter-that-makes-a-plane-field-conservative",
  title: t("The parameter that makes a plane field conservative", "使平面向量场保守的参数"),
  explanation: t(
    "A field $\\langle P, Q \\rangle$ on the whole plane is conservative exactly when $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$ everywhere. With an unknown coefficient, this must hold as an identity, so comparing the two sides fixes the coefficient.",
    "全平面上的向量场 $\\langle P, Q \\rangle$ 保守，当且仅当处处有 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$。系数未知时，这必须是恒等式，比较两边就确定了系数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const p = nonzero(rng, 5);
    const q = nonzero(rng, 5);
    const cubic = rng.int(0, 1) === 0;
    const P = cubic ? poly([a, "x^2y"], [p, "x"]) : poly([a, "y^2"], [p, "x"]);
    const Q2 = cubic ? poly([1, "kx^3"], [q, "y"]) : poly([1, "kxy"], [q, ""]);
    const answer = cubic ? Q.of(a, 3) : Q.of(2 * a);
    const py = cubic ? `${a}x^2` : `${2 * a}y`;
    const qx = cubic ? "3kx^2" : "ky";
    return numberProblem({
      prompt: t(
        `The field $\\langle ${P}, ${Q2} \\rangle$ is conservative. Find $k$.`,
        `向量场 $\\langle ${P}, ${Q2} \\rangle$ 是保守场。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [a, answer.neg(), Q.of(a, 2)],
      solution: t(
        `We need $\\frac{\\partial P}{\\partial y} = ${py}$ to equal $\\frac{\\partial Q}{\\partial x} = ${qx}$ everywhere, so $k = ${answer.toLatex()}$. The terms in $x$ alone and $y$ alone play no part.`,
        `需要 $\\frac{\\partial P}{\\partial y} = ${py}$ 处处等于 $\\frac{\\partial Q}{\\partial x} = ${qx}$，所以 $k = ${answer.toLatex()}$。只含 $x$ 或只含 $y$ 的项不起作用。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Limits and derivatives
// ---------------------------------------------------------------------------

const limitByPolar: KnowledgePointDef = {
  id: "showing-a-limit-exists-with-polar-coordinates",
  title: t("Showing a limit exists with polar coordinates", "用极坐标说明极限存在"),
  explanation: t(
    "Paths can only show that a limit fails to exist. To show that one exists, write $x = r\\cos\\theta$ and $y = r\\sin\\theta$: if the expression is $r$ to a positive power times something bounded, then it tends to zero from every direction at once. If $r$ cancels completely, the value depends on the direction $\\theta$.",
    "沿路径只能说明极限不存在。要说明极限存在，令 $x = r\\cos\\theta$，$y = r\\sin\\theta$：如果式子是 $r$ 的正数次幂乘有界量，它就从所有方向一起趋于零。如果 $r$ 完全约掉，值就取决于方向 $\\theta$。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const c = coefficient(a);
    const fraction = (top: string, bottom = "x^2 + y^2") => `\\frac{${c}${top}}{${bottom}}`;
    const top = rng.pick(["x^3", "y^3", "x^2y", "xy^2"]);
    return pickChoice(
      rng,
      t("Which of these functions has a limit as $(x, y) \\to (0, 0)$?", "下列函数中，哪一个当 $(x, y) \\to (0, 0)$ 时有极限？"),
      both(fraction(top)),
      [both(fraction("xy")), both(fraction(rng.pick(["x^2", "y^2"]))), both(`\\frac{${c}(x^2 - y^2)}{x^2 + y^2}`)],
      t(
        `In polar coordinates the numerator of $${fraction(top)}$ has $r^3$ and the denominator has $r^2$, so the function is $r$ times something bounded and tends to $0$. In the others $r$ cancels, and the value still depends on $\\theta$.`,
        `用极坐标表示，$${fraction(top)}$ 的分子含 $r^3$，分母含 $r^2$，所以函数等于 $r$ 乘有界量，趋于 $0$。其余几个的 $r$ 都约掉了，值仍取决于 $\\theta$。`,
      ),
    );
  },
};

const directionWithNoChange: KnowledgePointDef = {
  id: "a-direction-in-which-a-function-does-not-change",
  title: t("A direction in which a function does not change", "函数值不变的方向"),
  explanation: t(
    "The directional derivative is $\\nabla f \\cdot \\mathbf{u}$. It is zero exactly when $\\mathbf{u}$ is perpendicular to the gradient, which is the direction along the level curve. So swap the components of the gradient and change one sign to find such a direction.",
    "方向导数是 $\\nabla f \\cdot \\mathbf{u}$。它为零，当且仅当 $\\mathbf{u}$ 与梯度垂直，也就是沿等值线的方向。所以交换梯度的两个分量并改变其中一个的符号，就得到这样的方向。",
  ),
  generate(rng) {
    let g: [number, number];
    let a: number;
    let b: number;
    let x: number;
    let y: number;
    do {
      a = nonzero(rng, 3);
      b = nonzero(rng, 6);
      x = nonzero(rng, 3);
      y = nonzero(rng, 3);
      g = [2 * a * x, b];
    } while (Math.abs(g[0]) === Math.abs(g[1]));
    const f = poly([a, "x^2"], [b, "y"]);
    const vec = (u: number, v: number) => `\\langle ${u}, ${v} \\rangle`;
    return pickChoice(
      rng,
      t(
        `In which direction does $f(x, y) = ${f}$ have a zero directional derivative at $(${x}, ${y})$?`,
        `在点 $(${x}, ${y})$ 处，$f(x, y) = ${f}$ 沿哪个方向的方向导数为零？`,
      ),
      both(vec(g[1], -g[0])),
      [both(vec(g[0], g[1])), both(vec(g[1], g[0])), both(vec(-g[0], -g[1]))],
      t(
        `The gradient there is $${vec(g[0], g[1])}$. The direction $${vec(g[1], -g[0])}$ has dot product $${g[0]}(${g[1]}) + ${inParens(g[1])}(${-g[0]}) = 0$ with it.`,
        `该点的梯度是 $${vec(g[0], g[1])}$。方向 $${vec(g[1], -g[0])}$ 与它的数量积是 $${g[0]}(${g[1]}) + ${inParens(g[1])}(${-g[0]}) = 0$。`,
      ),
    );
  },
};

const implicitPartial: KnowledgePointDef = {
  id: "an-implicit-partial-derivative-from-the-chain-rule",
  title: t("An implicit partial derivative from the chain rule", "由链式法则求隐函数偏导数"),
  explanation: t(
    "If $F(x, y, z) = c$ defines $z$ as a function of $x$ and $y$, differentiating with respect to $x$ gives $F_x + F_z\\frac{\\partial z}{\\partial x} = 0$. So $\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$ wherever $F_z \\ne 0$. Note the minus sign, which the fraction notation hides.",
    "如果 $F(x, y, z) = c$ 确定 $z$ 是 $x$、$y$ 的函数，对 $x$ 求导得 $F_x + F_z\\frac{\\partial z}{\\partial x} = 0$。所以当 $F_z \\ne 0$ 时，$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$。注意负号，分数的写法会让人忽略它。",
  ),
  generate(rng) {
    let a: number;
    let b: number;
    let x: number;
    let y: number;
    let z: number;
    let Fx: number;
    let Fz: number;
    do {
      a = nonzero(rng, 4);
      b = nonzero(rng, 4);
      x = nonzero(rng, 3);
      y = nonzero(rng, 3);
      z = nonzero(rng, 3);
      Fx = a * y;
      Fz = b * y + 2 * z;
    } while (Fz === 0 || Math.abs(Fx) === Math.abs(Fz));
    const c = a * x * y + b * y * z + z * z;
    const answer = Q.of(-Fx, Fz);
    const F = poly([a, "xy"], [b, "yz"], [1, "z^2"]);
    return numberProblem({
      prompt: t(
        `The equation $${F} = ${c}$ defines $z$ as a function of $x$ and $y$ near $(${x}, ${y}, ${z})$. Find $\\frac{\\partial z}{\\partial x}$ at that point.`,
        `方程 $${F} = ${c}$ 在点 $(${x}, ${y}, ${z})$ 附近确定 $z$ 是 $x$、$y$ 的函数。求该点处的 $\\frac{\\partial z}{\\partial x}$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-Fz, Fx), Q.of(Fx)],
      solution: t(
        `Here $F_x = ${a}y = ${Fx}$ and $F_z = ${b}y + 2z = ${Fz}$ at the point. So $\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = ${answer.toLatex()}$.`,
        `在该点 $F_x = ${a}y = ${Fx}$，$F_z = ${b}y + 2z = ${Fz}$。所以 $\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const harmonicParameter: KnowledgePointDef = {
  id: "the-coefficient-that-makes-a-function-harmonic",
  title: t("The coefficient that makes a function harmonic", "使函数调和的系数"),
  explanation: t(
    "A function is harmonic when $u_{xx} + u_{yy} = 0$ everywhere. These functions describe steady heat and electric potential. Compute both second partial derivatives with the coefficient left in, then require their sum to vanish for every $x$ and $y$.",
    "满足处处 $u_{xx} + u_{yy} = 0$ 的函数称为调和函数，它们描述稳定的热分布和电势。保留系数算出两个二阶偏导数，再要求它们的和对所有 $x$、$y$ 都为零。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const form = rng.int(0, 2);
    const u = [poly([a, "x^3"], [1, "kxy^2"]), poly([a, "x^2"], [1, "ky^2"]), poly([a, "x^2y"], [1, "ky^3"])][form]!;
    const answer = [Q.of(-3 * a), Q.of(-a), Q.of(-a, 3)][form]!;
    const sum = [`${6 * a}x + 2kx`, `${2 * a} + 2k`, `${2 * a}y + 6ky`][form]!;
    return numberProblem({
      prompt: t(
        `The function $u = ${u}$ satisfies $u_{xx} + u_{yy} = 0$ everywhere. Find $k$.`,
        `函数 $u = ${u}$ 处处满足 $u_{xx} + u_{yy} = 0$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [answer.neg(), Q.of(-a), Q.of(a).mul(Q.of(3))],
      solution: t(
        `The sum of the second partial derivatives is $${sum}$. It vanishes everywhere only when $k = ${answer.toLatex()}$.`,
        `两个二阶偏导数之和是 $${sum}$。只有 $k = ${answer.toLatex()}$ 时它才处处为零。`,
      ),
    });
  },
};

const tangentPlaneParallel: KnowledgePointDef = {
  id: "where-a-tangent-plane-is-parallel-to-a-given-plane",
  title: t("Where a tangent plane is parallel to a given plane", "切平面在何处与已知平面平行"),
  explanation: t(
    "The tangent plane to $z = f(x, y)$ has slopes $f_x$ and $f_y$. The plane $z = px + qy + s$ has slopes $p$ and $q$. So the two are parallel where $f_x = p$ and $f_y = q$, which are two equations for the point of tangency.",
    "曲面 $z = f(x, y)$ 的切平面斜率是 $f_x$ 和 $f_y$，平面 $z = px + qy + s$ 的斜率是 $p$ 和 $q$。所以两者平行的位置满足 $f_x = p$，$f_y = q$，这是切点的两个方程。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const b = rng.int(1, 3);
    const x = nonzero(rng, 3);
    const y = nonzero(rng, 3);
    const p = 2 * a * x;
    const q = 2 * b * y;
    const z = a * x * x + b * y * y;
    const s = rng.pick([-9, -5, 1, 4, 7].filter((v) => v !== p * x + q * y - z));
    return pointProblem({
      prompt: t(
        `Find the point of the surface $z = ${poly([a, "x^2"], [b, "y^2"])}$ where the tangent plane is parallel to $z = ${poly([p, "x"], [q, "y"], [s, ""])}$. Answer as $(x, y, z)$.`,
        `求曲面 $z = ${poly([a, "x^2"], [b, "y^2"])}$ 上切平面与 $z = ${poly([p, "x"], [q, "y"], [s, ""])}$ 平行的点，写成 $(x, y, z)$。`,
      ),
      answer: [x, y, z],
      vars: ["x", "y", "z"],
      wrong: [
        [p, q, z],
        [x, y, p * x + q * y + s],
        [-x, -y, z],
      ],
      solution: t(
        `Match the slopes: $${2 * a}x = ${p}$ and $${2 * b}y = ${q}$, so $x = ${x}$ and $y = ${y}$. The surface then gives $z = ${z}$.`,
        `比较斜率：$${2 * a}x = ${p}$，$${2 * b}y = ${q}$，所以 $x = ${x}$，$y = ${y}$。由曲面得 $z = ${z}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Optimization
// ---------------------------------------------------------------------------

const localMinimumPoint: KnowledgePointDef = {
  id: "picking-the-local-minimum-among-critical-points",
  title: t("Picking the local minimum among critical points", "在临界点中找出局部极小点"),
  explanation: t(
    "A function can have several critical points of different kinds. Find them all by setting both partial derivatives to zero, then test each with the second derivatives. A point with $D > 0$ and $f_{xx} > 0$ is a local minimum, and $D < 0$ means a saddle.",
    "函数可以有多个不同类型的临界点。令两个偏导数为零，求出全部临界点，再用二阶导数逐一检验。$D > 0$ 且 $f_{xx} > 0$ 的点是局部极小点，$D < 0$ 则是鞍点。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const b = nonzero(rng, 4);
    const f = poly([1, "x^3"], [-3 * a * a, "x"], [1, "y^2"], [-2 * b, "y"]);
    return pointProblem({
      prompt: t(
        `Find the local minimum point of $f(x, y) = ${f}$. Answer as $(x, y)$.`,
        `求 $f(x, y) = ${f}$ 的局部极小点，写成 $(x, y)$。`,
      ),
      answer: [a, b],
      wrong: [
        [-a, b],
        [a, -b],
        [a * a, b],
      ],
      solution: t(
        `Setting $f_x = 3x^2 - ${3 * a * a} = 0$ and $f_y = 2y - ${inParens(2 * b)} = 0$ gives $(\\pm ${a}, ${b})$. With $f_{yy} = 2$, $D = 12x$: at $x = ${a}$ it is positive with $f_{xx} > 0$, a minimum, and at $x = ${-a}$ it is negative, a saddle.`,
        `令 $f_x = 3x^2 - ${3 * a * a} = 0$，$f_y = 2y - ${inParens(2 * b)} = 0$，得 $(\\pm ${a}, ${b})$。$f_{yy} = 2$，$D = 12x$：在 $x = ${a}$ 处 $D$ 为正且 $f_{xx} > 0$，是极小点；在 $x = ${-a}$ 处 $D$ 为负，是鞍点。`,
      ),
    });
  },
};

const saddleParameter: KnowledgePointDef = {
  id: "the-smallest-coefficient-that-gives-a-saddle",
  title: t("The smallest coefficient that gives a saddle", "产生鞍点的最小系数"),
  explanation: t(
    "For $f = ax^2 + kxy + by^2$ with $a$ and $b$ positive, the origin is critical with discriminant $D = 4ab - k^2$. A saddle needs $D < 0$, so $k^2 > 4ab$. When $D = 0$ the test says nothing, and so that value of $k$ does not count.",
    "对 $f = ax^2 + kxy + by^2$（$a$、$b$ 为正），原点是临界点，判别式 $D = 4ab - k^2$。鞍点要求 $D < 0$，即 $k^2 > 4ab$。$D = 0$ 时判别法没有结论，所以这样的 $k$ 不算。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const four = 4 * a * b;
    const answer = Math.floor(Math.sqrt(four)) + 1;
    return numberProblem({
      prompt: t(
        `What is the smallest positive integer $k$ for which the second derivative test shows that $f(x, y) = ${poly([a, "x^2"], [1, "kxy"], [b, "y^2"])}$ has a saddle at the origin?`,
        `使二阶导数判别法判定 $f(x, y) = ${poly([a, "x^2"], [1, "kxy"], [b, "y^2"])}$ 在原点为鞍点的最小正整数 $k$ 是多少？`,
      ),
      answer,
      solveFor: "k",
      wrong: [answer - 1, four, four + 1],
      solution: t(
        `$D = ${four} - k^2$, and a saddle needs $k^2 > ${four}$. Now $${answer - 1}^2 = ${(answer - 1) ** 2}$ is not above $${four}$, and $${answer}^2 = ${answer * answer}$ is.`,
        `$D = ${four} - k^2$，鞍点要求 $k^2 > ${four}$。而 $${answer - 1}^2 = ${(answer - 1) ** 2}$ 不大于 $${four}$，$${answer}^2 = ${answer * answer}$ 大于 $${four}$。`,
      ),
    });
  },
};

const meaningOfTheMultiplier: KnowledgePointDef = {
  id: "finding-the-lagrange-multiplier-and-its-meaning",
  title: t("Finding the Lagrange multiplier and its meaning", "拉格朗日乘数及其含义"),
  explanation: t(
    "The multiplier in $\\nabla f = \\lambda\\nabla g$ is more than a helper. It tells how fast the optimal value changes as the constraint $g = c$ is relaxed: $\\frac{d f^*}{dc} = \\lambda$. To find it, express the point through $\\lambda$ and substitute into the constraint.",
    "$\\nabla f = \\lambda\\nabla g$ 中的乘数不只是辅助量。它说明放宽约束 $g = c$ 时最优值变化多快：$\\frac{d f^*}{dc} = \\lambda$。要求出它，先用 $\\lambda$ 表示点，再代入约束。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 9);
    const nn = a * a + b * b;
    const answer = Q.of(2 * c, nn);
    return numberProblem({
      prompt: t(
        `Minimize $x^2 + y^2$ subject to $${poly([a, "x"], [b, "y"])} = ${c}$. Find the multiplier $\\lambda$ in $\\nabla f = \\lambda\\nabla g$ at the minimum.`,
        `在 $${poly([a, "x"], [b, "y"])} = ${c}$ 的条件下求 $x^2 + y^2$ 的最小值。求最小点处 $\\nabla f = \\lambda\\nabla g$ 中的乘数 $\\lambda$。`,
      ),
      answer,
      wrong: [Q.of(c, nn), Q.of(c * c, nn), Q.of(nn, 2 * c)],
      solution: t(
        `The equations $2x = ${a}\\lambda$ and $2y = ${b}\\lambda$ give $x = \\frac{${a}\\lambda}{2}$ and $y = \\frac{${b}\\lambda}{2}$. Substituting gives $\\frac{${nn}\\lambda}{2} = ${c}$, so $\\lambda = ${answer.toLatex()}$.`,
        `由 $2x = ${a}\\lambda$，$2y = ${b}\\lambda$ 得 $x = \\frac{${a}\\lambda}{2}$，$y = \\frac{${b}\\lambda}{2}$。代入约束得 $\\frac{${nn}\\lambda}{2} = ${c}$，所以 $\\lambda = ${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Multiple integrals
// ---------------------------------------------------------------------------

const midpointSum: KnowledgePointDef = {
  id: "a-double-riemann-sum-with-midpoints",
  title: t("A double Riemann sum with midpoints", "取中点的二重黎曼和"),
  explanation: t(
    "Sampling each subrectangle at its center usually approximates a double integral much better than sampling at a corner. Add up the values of the function at the centers and multiply by the area of one subrectangle.",
    "在每个小矩形的中心取值，通常比在角上取值更接近二重积分。把函数在各中心的值相加，再乘一个小矩形的面积。",
  ),
  generate(rng) {
    const a = 2 * rng.int(1, 3);
    const b = 2 * rng.int(1, 3);
    const k = rng.int(1, 4);
    const f = poly([1, "x^2"], [k, "y"]);
    const [x1, x2] = [a / 2, (3 * a) / 2];
    const [y1, y2] = [b / 2, (3 * b) / 2];
    const value = (x: number, y: number) => x * x + k * y;
    const sum = value(x1, y1) + value(x1, y2) + value(x2, y1) + value(x2, y2);
    const area = a * b;
    return numberProblem({
      prompt: t(
        `Divide $[0, ${2 * a}] \\times [0, ${2 * b}]$ into four equal rectangles. Find the midpoint Riemann sum of $f(x, y) = ${f}$.`,
        `把 $[0, ${2 * a}] \\times [0, ${2 * b}]$ 分成四个相等的矩形。求 $f(x, y) = ${f}$ 的中点黎曼和。`,
      ),
      answer: sum * area,
      form: "integer",
      wrong: [sum, value(a, b) * 4 * area, (value(0, 0) + value(a, 0) + value(0, b) + value(a, b)) * area],
      solution: t(
        `The centers have $x = ${x1}, ${x2}$ and $y = ${y1}, ${y2}$, and the values there add up to $${sum}$. Each rectangle has area $${area}$, so the sum is $${sum * area}$.`,
        `中心的 $x$ 为 $${x1}, ${x2}$，$y$ 为 $${y1}, ${y2}$，这些点上的函数值之和是 $${sum}$。每个矩形面积为 $${area}$，所以和是 $${sum * area}$。`,
      ),
    });
  },
};

const integralBySymmetry: KnowledgePointDef = {
  id: "a-double-integral-by-symmetry",
  title: t("A double integral by symmetry", "利用对称性求二重积分"),
  explanation: t(
    "If a region is symmetric about the $y$-axis and an integrand is odd in $x$, the parts on the two sides cancel and the integral is zero. The same holds for $y$ and the $x$-axis. Only the even terms of the integrand are left to compute.",
    "如果区域关于 $y$ 轴对称，被积函数关于 $x$ 是奇函数，两侧的部分相互抵消，积分为零。$y$ 和 $x$ 轴也一样。只有被积函数中的偶次项才需要计算。",
  ),
  generate(rng) {
    const p = rng.int(1, 5);
    const q = rng.int(1, 5);
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 6);
    const area = 4 * p * q;
    const answer = c * area;
    return numberProblem({
      prompt: t(
        `Evaluate $\\iint_R (${poly([a, "x"], [b, "y^3"], [c, ""])})\\,dA$ over $R = [${-p}, ${p}] \\times [${-q}, ${q}]$.`,
        `计算 $\\iint_R (${poly([a, "x"], [b, "y^3"], [c, ""])})\\,dA$，其中 $R = [${-p}, ${p}] \\times [${-q}, ${q}]$。`,
      ),
      answer,
      form: "integer",
      wrong: [c * p * q, (a + b + c) * area, 0],
      solution: t(
        `The rectangle is symmetric about both axes. The term $${poly([a, "x"])}$ is odd in $x$ and $${poly([b, "y^3"])}$ is odd in $y$, so both integrate to zero. What is left is $${c}$ times the area $${area}$, which is $${answer}$.`,
        `矩形关于两条坐标轴都对称。$${poly([a, "x"])}$ 关于 $x$ 是奇函数，$${poly([b, "y^3"])}$ 关于 $y$ 是奇函数，所以积分都为零。剩下的是 $${c}$ 乘面积 $${area}$，即 $${answer}$。`,
      ),
    });
  },
};

const gaussianOverADisk: KnowledgePointDef = {
  id: "integrating-an-exponential-of-r-squared-over-a-disk",
  title: t("Integrating an exponential of $r^2$ over a disk", "在圆盘上积分 $r^2$ 的指数"),
  explanation: t(
    "The function $e^{-k(x^2+y^2)}$ has no elementary antiderivative in $x$, but polar coordinates supply the factor $r$ from $dA = r\\,dr\\,d\\theta$, and then $\\int re^{-kr^2}\\,dr$ yields to a substitution. This is the key step in computing the Gaussian integral.",
    "函数 $e^{-k(x^2+y^2)}$ 对 $x$ 没有初等原函数，但极坐标中 $dA = r\\,dr\\,d\\theta$ 提供了因子 $r$，于是 $\\int re^{-kr^2}\\,dr$ 可以用换元法求出。这是计算高斯积分的关键一步。",
  ),
  generate(rng) {
    const c = rng.int(1, 4);
    const k = rng.int(1, 4);
    const R = rng.int(1, 3);
    const exponent = k * R * R;
    const front = Q.of(c, k);
    const head = (q: Q) => (q.eq(Q.of(1)) ? "\\pi" : `${q.toLatex()}\\pi`);
    const power = `e^{-${exponent}}`;
    const integrand = `${coefficient(c)}e^{-${coefficient(k)}(x^2 + y^2)}`;
    return pickChoice(
      rng,
      t(
        `Evaluate $\\iint_D ${integrand}\\,dA$, where $D$ is the disk $x^2 + y^2 \\le ${R * R}$.`,
        `计算 $\\iint_D ${integrand}\\,dA$，其中 $D$ 是圆盘 $x^2 + y^2 \\le ${R * R}$。`,
      ),
      both(`${head(front)}(1 - ${power})`),
      [
        both(`${head(front)}\\,${power}`),
        both(`${head(front.mul(Q.of(2)))}(1 - ${power})`),
        both(`${head(front.mul(Q.of(k)))}(1 - e^{-${R * R}})`),
      ],
      t(
        `In polar coordinates it is $2\\pi \\cdot ${c}\\int_0^{${R}} re^{-${k}r^2}\\,dr = 2\\pi \\cdot ${c} \\cdot \\frac{1 - ${power}}{${2 * k}}$. That is $${head(front)}(1 - ${power})$.`,
        `用极坐标得 $2\\pi \\cdot ${c}\\int_0^{${R}} re^{-${k}r^2}\\,dr = 2\\pi \\cdot ${c} \\cdot \\frac{1 - ${power}}{${2 * k}}$，即 $${head(front)}(1 - ${power})$。`,
      ),
    );
  },
};

const volumeOfACone: KnowledgePointDef = {
  id: "the-volume-of-a-cone-in-cylindrical-coordinates",
  title: t("The volume of a cone in cylindrical coordinates", "用柱坐标求圆锥的体积"),
  explanation: t(
    "A cone with its tip at the origin is $z = mr$ in cylindrical coordinates. Between the cone and a plane $z = h$, integrate $r$ from $0$ to $\\frac{h}{m}$ or, more simply, take each height $z$ and integrate over a disk of radius $\\frac{z}{m}$.",
    "顶点在原点的圆锥在柱坐标中是 $z = mr$。在圆锥和平面 $z = h$ 之间，可以让 $r$ 从 $0$ 积到 $\\frac{h}{m}$；更简单的做法是对每个高度 $z$，在半径为 $\\frac{z}{m}$ 的圆盘上积分。",
  ),
  generate(rng) {
    const m = rng.int(1, 4);
    const h = rng.int(1, 10) * m;
    const answer = Q.of(h * h * h, 3 * m * m);
    const lower = m === 1 ? "\\sqrt{x^2 + y^2}" : `${m}\\sqrt{x^2 + y^2}`;
    return numberProblem({
      prompt: t(
        `The solid $${lower} \\le z \\le ${h}$ has volume $c\\pi$. Find $c$.`,
        `立体 $${lower} \\le z \\le ${h}$ 的体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      solveFor: "c",
      wrong: [Q.of(h * h * h, m * m), Q.of(h * h, 3 * m), Q.of(2 * h * h * h, 3 * m * m)],
      solution: t(
        `In cylindrical coordinates the solid is $${m}r \\le z \\le ${h}$. Integrating, $2\\pi\\int_0^{${h / m}} (${h} - ${m}r)r\\,dr = ${answer.toLatex()}\\pi$, so $c = ${answer.toLatex()}$.`,
        `在柱坐标中，立体是 $${m}r \\le z \\le ${h}$。积分得 $2\\pi\\int_0^{${h / m}} (${h} - ${m}r)r\\,dr = ${answer.toLatex()}\\pi$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const volumeOfASphericalCone: KnowledgePointDef = {
  id: "the-volume-of-a-spherical-sector",
  title: t("The volume of a spherical sector", "球扇形的体积"),
  explanation: t(
    "In spherical coordinates, $dV = \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$. The part of a ball with $\\phi \\le \\phi_0$, an ice-cream cone shape, separates into three integrals and has volume $\\frac{2\\pi}{3}R^3(1 - \\cos\\phi_0)$.",
    "球坐标中 $dV = \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$。球内满足 $\\phi \\le \\phi_0$ 的部分形如蛋卷冰淇淋，可分成三个积分，体积是 $\\frac{2\\pi}{3}R^3(1 - \\cos\\phi_0)$。",
  ),
  generate(rng) {
    const R = rng.int(1, 12);
    const [angle, oneMinusCos] = rng.pick([
      ["\\frac{\\pi}{3}", Q.of(1, 2)],
      ["\\frac{\\pi}{2}", Q.of(1)],
      ["\\frac{2\\pi}{3}", Q.of(3, 2)],
    ] as const);
    const answer = Q.of(2 * R ** 3, 3).mul(oneMinusCos);
    return numberProblem({
      prompt: t(
        `The part of the ball $\\rho \\le ${R}$ with $\\phi \\le ${angle}$ has volume $c\\pi$. Find $c$.`,
        `球 $\\rho \\le ${R}$ 中满足 $\\phi \\le ${angle}$ 的部分体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      solveFor: "c",
      wrong: [Q.of(4 * R ** 3, 3), Q.of(2 * R ** 3, 3), answer.mul(Q.of(3))],
      solution: t(
        `The three integrals give $2\\pi$ for $\\theta$, $\\frac{${R ** 3}}{3}$ for $\\rho$, and $1 - \\cos\\phi_0 = ${oneMinusCos.toLatex()}$ for $\\phi$. Their product is $${answer.toLatex()}\\pi$.`,
        `三个积分分别给出：$\\theta$ 为 $2\\pi$，$\\rho$ 为 $\\frac{${R ** 3}}{3}$，$\\phi$ 为 $1 - \\cos\\phi_0 = ${oneMinusCos.toLatex()}$。它们的积是 $${answer.toLatex()}\\pi$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Green, Stokes and the divergence theorem
// ---------------------------------------------------------------------------

const greenBackwards: KnowledgePointDef = {
  id: "a-coefficient-from-a-known-circulation",
  title: t("A coefficient from a known circulation", "由已知环量求系数"),
  explanation: t(
    "Green's theorem turns a circulation into the integral of $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$. When this quantity is constant, the circulation is that constant times the area, and a known circulation can be read backwards to find a coefficient of the field.",
    "格林公式把环量化为 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$ 的积分。这个量是常数时，环量就等于常数乘面积，因此可以由已知环量反过来求向量场的系数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const k = nonzero(rng, 5);
    const w = rng.int(2, 6);
    const h = rng.int(1, 5);
    const area = w * h;
    const circulation = (a + k) * area;
    return numberProblem({
      prompt: t(
        `The counterclockwise circulation of $\\mathbf{F} = \\langle ${poly([-1, "ky"])}, ${poly([a, "x"])} \\rangle$ around a ${w} by ${h} rectangle is $${circulation}$. Find $k$.`,
        `$\\mathbf{F} = \\langle ${poly([-1, "ky"])}, ${poly([a, "x"])} \\rangle$ 沿长 ${w}、宽 ${h} 的矩形逆时针方向的环量是 $${circulation}$。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [-k, a + k, Q.of(circulation, area)],
      solution: t(
        `Here $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${a} + k$, so the circulation is $${area}(${a} + k) = ${circulation}$. Dividing gives $${a} + k = ${a + k}$, so $k = ${k}$.`,
        `这里 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${a} + k$，所以环量是 $${area}(${a} + k) = ${circulation}$。相除得 $${a} + k = ${a + k}$，所以 $k = ${k}$。`,
      ),
    });
  },
};

const closingASurface: KnowledgePointDef = {
  id: "flux-through-an-open-surface-by-closing-it",
  title: t("Flux through an open surface by closing it", "补成闭曲面求开曲面的通量"),
  explanation: t(
    "The divergence theorem needs a closed surface. For a cap, add the flat base to close it: the outward flux through both is the integral of the divergence over the solid. Then subtract the flux through the base, which is usually simple to find directly.",
    "散度定理需要闭曲面。对曲面帽，加上平的底面使它封闭：穿过两者向外的通量等于散度在立体上的积分。再减去穿过底面的通量，这一项通常可以直接算出。",
  ),
  generate(rng) {
    const R = rng.int(1, 4);
    const a = rng.int(1, 3);
    const b = rng.int(1, 3);
    const k = rng.int(1, 6);
    const div = 2 * a + b;
    const total = Q.of(div * R ** 4, 2);
    const answer = total.add(Q.of(k * R * R));
    const field = `\\langle ${coefficient(a)}x, ${coefficient(a)}y, ${poly([b, "z"], [k, ""])} \\rangle`;
    return numberProblem({
      prompt: t(
        `The upward flux of $${field}$ through the cap $z = ${R * R} - x^2 - y^2$, $z \\ge 0$, is $c\\pi$. Find $c$.`,
        `$${field}$ 向上穿过曲面帽 $z = ${R * R} - x^2 - y^2$（$z \\ge 0$）的通量是 $c\\pi$。求 $c$。`,
      ),
      answer,
      solveFor: "c",
      wrong: [total, total.sub(Q.of(k * R * R)), Q.of(div * R ** 4)],
      solution: t(
        `Close the cap with the disk $z = 0$. The divergence is $${div}$ and the solid has volume $\\frac{\\pi}{2}(${R * R})^2$, so the total outward flux is $${total.toLatex()}\\pi$. Through the base the outward normal points down, giving $-${k} \\cdot ${R * R}\\pi$. So the cap has $${total.toLatex()}\\pi + ${k * R * R}\\pi = ${answer.toLatex()}\\pi$.`,
        `用圆盘 $z = 0$ 封闭曲面帽。散度是 $${div}$，立体体积是 $\\frac{\\pi}{2}(${R * R})^2$，所以向外的总通量是 $${total.toLatex()}\\pi$。底面向外的法向朝下，通量是 $-${k} \\cdot ${R * R}\\pi$。所以曲面帽的通量是 $${total.toLatex()}\\pi + ${k * R * R}\\pi = ${answer.toLatex()}\\pi$。`,
      ),
    });
  },
};

const swappingStokesSurface: KnowledgePointDef = {
  id: "swapping-a-surface-with-the-same-boundary-in-stokes-theorem",
  title: t("Swapping a surface with the same boundary in Stokes' theorem", "斯托克斯公式中换成边界相同的曲面"),
  explanation: t(
    "Stokes' theorem makes the flux of a curl depend only on the boundary curve. So a hard surface such as a hemisphere can be replaced with the flat disk that has the same boundary and orientation, where the normal is constant and the integral is easy.",
    "斯托克斯公式说明旋度的通量只取决于边界曲线。所以半球这样难算的曲面可以换成边界和定向都相同的平面圆盘，那里法向量是常数，积分很容易。",
  ),
  generate(rng) {
    const R = rng.int(1, 6);
    const a = nonzero(rng, 5);
    const p = nonzero(rng, 4);
    const answer = 2 * a * R * R;
    const field = `\\langle ${poly([-a, "y"])}, ${poly([a, "x"])}, ${poly([p, "z^2"])} \\rangle`;
    return numberProblem({
      prompt: t(
        `$S$ is the upper hemisphere $x^2 + y^2 + z^2 = ${R * R}$, $z \\ge 0$, with upward normal, and $\\mathbf{F} = ${field}$. The flux of $\\nabla \\times \\mathbf{F}$ through $S$ is $c\\pi$. Find $c$.`,
        `$S$ 是上半球面 $x^2 + y^2 + z^2 = ${R * R}$，$z \\ge 0$，法向朝上，$\\mathbf{F} = ${field}$。$\\nabla \\times \\mathbf{F}$ 穿过 $S$ 的通量是 $c\\pi$。求 $c$。`,
      ),
      answer,
      solveFor: "c",
      wrong: [a * R * R, 2 * answer, 2 * a * R ** 3],
      solution: t(
        `The disk $x^2 + y^2 \\le ${R * R}$ has the same boundary circle. The curl is $\\langle 0, 0, ${2 * a} \\rangle$, so the flux through the disk is $${2 * a}$ times the area $${R * R}\\pi$, which gives $c = ${answer}$.`,
        `圆盘 $x^2 + y^2 \\le ${R * R}$ 有相同的边界圆。旋度是 $\\langle 0, 0, ${2 * a} \\rangle$，所以穿过圆盘的通量是 $${2 * a}$ 乘面积 $${R * R}\\pi$，得 $c = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

const compositeCentroid: KnowledgePointDef = {
  id: "the-centroid-of-a-region-made-of-two-rectangles",
  title: t("The centroid of a region made of two rectangles", "两个矩形组成的区域的形心"),
  explanation: t(
    "The moment of a region is the sum of the moments of its parts, so there is no need to integrate over a composite shape. Each part acts as if its area were at its own centroid, and the centroid of the whole is the weighted average by area.",
    "区域的矩等于各部分的矩之和，所以组合图形不必逐个积分。每一部分相当于面积集中在自身的形心，整体的形心就是按面积加权的平均。",
  ),
  generate(rng) {
    const a = 2 * rng.int(1, 3);
    const b = 2 * rng.int(1, 4);
    const c = 2 * rng.int(1, 3);
    let d = 2 * rng.int(1, 4);
    if (d === b) d += 2;
    const A1 = a * b;
    const A2 = c * d;
    const x1 = a / 2;
    const x2 = a + c / 2;
    const answer = Q.of(A1 * x1 + A2 * x2, A1 + A2);
    return numberProblem({
      prompt: t(
        `A region is the union of the rectangles $[0, ${a}] \\times [0, ${b}]$ and $[${a}, ${a + c}] \\times [0, ${d}]$. Find the $x$-coordinate of its centroid.`,
        `一个区域由矩形 $[0, ${a}] \\times [0, ${b}]$ 和 $[${a}, ${a + c}] \\times [0, ${d}]$ 组成。求它的形心的 $x$ 坐标。`,
      ),
      answer,
      wrong: [Q.of(x1 + x2, 2), Q.of(a + c, 2), Q.of(A2 * x1 + A1 * x2, A1 + A2)],
      solution: t(
        `The parts have areas $${A1}$ and $${A2}$ with centers at $x = ${x1}$ and $x = ${x2}$. So $\\bar{x} = \\frac{${A1}(${x1}) + ${A2}(${x2})}{${A1} + ${A2}} = ${answer.toLatex()}$.`,
        `两部分的面积是 $${A1}$ 和 $${A2}$，中心在 $x = ${x1}$ 和 $x = ${x2}$。所以 $\\bar{x} = \\frac{${A1}(${x1}) + ${A2}(${x2})}{${A1} + ${A2}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const marginalFromIndependence: KnowledgePointDef = {
  id: "a-marginal-probability-from-independent-joint-values",
  title: t("A marginal probability from independent joint values", "由独立变量的联合概率求边缘概率"),
  explanation: t(
    "If $X$ and $Y$ are independent, then the conditional probability of $Y$ given $X$ is the same as its marginal probability. So the marginal of $Y$ can be found by comparing two joint probabilities in one row of the table: $P(Y=1) = \\frac{P(X=1, Y=1)}{P(X=1, Y=0) + P(X=1, Y=1)}$.",
    "若 $X$ 和 $Y$ 独立，则 $Y$ 在给定 $X$ 时的条件概率等于它的边缘概率。所以比较表中同一行的两个联合概率，就能求出 $Y$ 的边缘概率：$P(Y=1) = \\frac{P(X=1, Y=1)}{P(X=1, Y=0) + P(X=1, Y=1)}$。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const both1 = Q.of(p * q, 100);
    const one0 = Q.of(p * (10 - q), 100);
    const answer = Q.of(q, 10);
    return numberProblem({
      prompt: t(
        `$X$ and $Y$ are independent and take the values $0$ and $1$, with $P(X=1, Y=1) = ${both1.toLatex()}$ and $P(X=1, Y=0) = ${one0.toLatex()}$. Find $P(Y=1)$.`,
        `$X$ 和 $Y$ 独立，取值为 $0$ 和 $1$，$P(X=1, Y=1) = ${both1.toLatex()}$，$P(X=1, Y=0) = ${one0.toLatex()}$。求 $P(Y=1)$。`,
      ),
      answer,
      wrong: [both1, Q.of(p, 10), Q.of(10 - q, 10)],
      solution: t(
        `Adding the two gives $P(X=1) = ${Q.of(p, 10).toLatex()}$. By independence, $P(Y=1) = \\frac{P(X=1, Y=1)}{P(X=1)} = ${answer.toLatex()}$.`,
        `两者相加得 $P(X=1) = ${Q.of(p, 10).toLatex()}$。由独立性，$P(Y=1) = \\frac{P(X=1, Y=1)}{P(X=1)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

/** deeperMultivariableCalculusPoints gives, by topic id, the knowledge points added after a Multivariable Calculus topic's own. */
export const deeperMultivariableCalculusPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "tangent-vectors-and-tangent-lines-to-curves": [tangentParallelToPlane],
  "finding-curvature-using-the-cross-product": [curvatureOfAHelix],
  "binormal-vectors": [binormalFromTangentAndNormal],
  "conservative-vector-fields-in-the-cartesian-plane": [parameterForConservative],
  "limits-and-continuity-of-multivariable-functions": [limitByPolar],
  "directional-derivatives": [directionWithNoChange],
  "the-multivariable-chain-rule": [implicitPartial],
  "higher-order-partial-derivatives": [harmonicParameter],
  "tangent-planes-to-surfaces": [tangentPlaneParallel],
  "global-vs-local-extrema-and-critical-points-of-multivariable-functions": [localMinimumPoint],
  "the-second-partial-derivatives-test": [saddleParameter],
  "lagrange-multipliers-with-one-constraint": [meaningOfTheMultiplier],
  "calculating-double-summations-over-partitions": [midpointSum],
  "properties-of-double-integrals": [integralBySymmetry],
  "double-integrals-in-plane-polar-coordinates": [gaussianOverADisk],
  "triple-integrals-in-cylindrical-polar-coordinates": [volumeOfACone],
  "triple-integrals-in-spherical-polar-coordinates": [volumeOfASphericalCone],
  "greens-theorem-in-circulation-curl-form": [greenBackwards],
  "the-divergence-theorem": [closingASurface],
  "stokes-theorem": [swappingStokesSurface],
  "moments-and-center-of-mass": [compositeCentroid],
  "joint-distributions-for-discrete-random-variables": [marginalFromIndependence],
};
